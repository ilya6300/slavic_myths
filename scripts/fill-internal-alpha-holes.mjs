/**
 * Fill transparent pockets not connected to image border (book просветы).
 * Usage: node scripts/fill-internal-alpha-holes.mjs <relative-path>
 */
import sharp from 'sharp';
import path from 'path';
import { rename, unlink } from 'fs/promises';
import { fileURLToPath } from 'url';

const rel = process.argv[2];
if (!rel) {
  console.error('Usage: node scripts/fill-internal-alpha-holes.mjs <relative-path>');
  process.exit(1);
}

const filePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', rel);
const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});
const px = Uint8Array.from(data);
const { width: w, height: h, channels: ch } = info;
const n = w * h;

const alphaAt = (x, y) => {
  if (x < 0 || y < 0 || x >= w || y >= h) return 0;
  return px[(y * w + x) * ch + 3];
};

const isHole = (x, y) => {
  if (x <= 0 || y <= 0 || x >= w - 1 || y >= h - 1) return false;
  if (alphaAt(x, y) >= 16) return false;
  let opaqueNeighbors = 0;
  for (const [dx, dy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    if (alphaAt(x + dx, y + dy) > 200) opaqueNeighbors++;
  }
  return opaqueNeighbors >= 3;
};

let filled = 0;
for (let pass = 0; pass < 20; pass++) {
  let passFilled = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      if (!isHole(x, y)) continue;
      const i = (y * w + x) * ch;
      let sr = 0;
      let sg = 0;
      let sb = 0;
      let c = 0;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const j = ((y + dy) * w + (x + dx)) * ch;
        if (px[j + 3] <= 200) continue;
        sr += px[j];
        sg += px[j + 1];
        sb += px[j + 2];
        c++;
      }
      if (c < 3) continue;
      px[i] = Math.round(sr / c);
      px[i + 1] = Math.round(sg / c);
      px[i + 2] = Math.round(sb / c);
      px[i + 3] = 255;
      passFilled++;
    }
  }
  filled += passFilled;
  if (passFilled === 0) break;
}

const tmp = `${filePath}.holes.tmp.png`;
await sharp(px, { raw: { width: w, height: h, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(tmp);
await unlink(filePath).catch(() => undefined);
await rename(tmp, filePath);
console.log(`${rel}: filled ${filled} internal transparent pixels`);
