/**
 * Post-generate gate for illustration_book PNGs (book parchment — no internal holes).
 * Usage: node scripts/verify-book-illustration.mjs assets/illustration_book/perun.png
 */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const rel = process.argv[2];
const whiteBg = process.argv[3] === 'white' || process.argv.includes('--white-bg');
if (!rel) {
  console.error('Usage: node scripts/verify-book-illustration.mjs <relative-path> [white]');
  process.exit(1);
}

const filePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', rel);
const meta = await sharp(filePath).metadata();
if (meta.format !== 'png' || !meta.hasAlpha) {
  console.error('FAIL: must be PNG with alpha channel');
  process.exit(1);
}

const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});
const { width: w, height: h, channels: ch } = info;
const n = w * h;
let trans = 0;
let semi = 0;
let internalHoles = 0;

const alphaAt = (x, y) => {
  if (x < 0 || y < 0 || x >= w || y >= h) return 0;
  return data[(y * w + x) * ch + 3];
};

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const a = alphaAt(x, y);
    if (a < 16) trans++;
    else if (a < 240) semi++;
    if (a >= 16 || x === 0 || y === 0 || x === w - 1 || y === h - 1) continue;
    let opaqueNeighbors = 0;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      if (alphaAt(x + dx, y + dy) > 200) opaqueNeighbors++;
    }
    if (opaqueNeighbors >= 3) internalHoles++;
  }
}

const transPct = (trans / n) * 100;
const report = {
  path: rel,
  size: `${w}x${h}`,
  transPct: transPct.toFixed(1),
  semiPct: ((semi / n) * 100).toFixed(1),
  internalHoles,
};

const fails = [];
const maxTrans = whiteBg ? 50 : 22;
if (transPct > maxTrans) {
  fails.push(
    `transparency ${transPct.toFixed(1)}% > ${maxTrans}% (${whiteBg ? 'subject too small on white' : 'backdrop washed out'})`,
  );
}
if (semi > 0) fails.push(`semi-transparent pixels ${semi} (halos on parchment)`);
if (internalHoles > 0) fails.push(`internal alpha holes ${internalHoles} (просветы)`);

console.log(JSON.stringify(report, null, 2));
if (fails.length) {
  console.error('FAIL:', fails.join('; '));
  process.exit(1);
}
console.log('OK: passes book illustration gate');
