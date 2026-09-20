/**
 * Черновик зеркала: edge-flood белого + снятие белого ореола у края α.
 * Usage: node scripts/process-mirror-draft-alpha.mjs <relative-path>
 */
import sharp from 'sharp';
import path from 'path';
import { rename, unlink } from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const rel = process.argv[2];
if (!rel) {
  console.error('Usage: node scripts/process-mirror-draft-alpha.mjs <path>');
  process.exit(1);
}

const EDGE_THRESHOLD = 235;
const FRINGE_THRESHOLD = 228;
const filePath = path.join(root, rel);

const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});
const { width: w, height: h, channels: ch } = info;
const px = Uint8Array.from(data);
const n = w * h;

const isNearWhite = (r, g, b, t) =>
  r >= t && g >= t && b >= t;

const alphaAt = (x, y) => {
  if (x < 0 || y < 0 || x >= w || y >= h) return 0;
  return px[(y * w + x) * ch + 3];
};

// 1) Edge-connected near-white → transparent
const bg = new Uint8Array(n);
const queue = [];
for (let x = 0; x < w; x++) {
  queue.push([x, 0], [x, h - 1]);
}
for (let y = 0; y < h; y++) {
  queue.push([0, y], [w - 1, y]);
}
while (queue.length) {
  const [x, y] = queue.pop();
  if (x < 0 || y < 0 || x >= w || y >= h) continue;
  const p = y * w + x;
  if (bg[p]) continue;
  const i = p * ch;
  if (!isNearWhite(px[i], px[i + 1], px[i + 2], EDGE_THRESHOLD)) continue;
  bg[p] = 1;
  queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}
let edgeRemoved = 0;
for (let p = 0; p < n; p++) {
  if (!bg[p]) continue;
  px[p * ch + 3] = 0;
  edgeRemoved++;
}

// 2) Defringe: near-white pixels touching transparency
let fringeRemoved = 0;
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const p = y * w + x;
    const i = p * ch;
    if (px[i + 3] === 0) continue;
    if (!isNearWhite(px[i], px[i + 1], px[i + 2], FRINGE_THRESHOLD)) continue;
    const touchesClear =
      alphaAt(x - 1, y) === 0 ||
      alphaAt(x + 1, y) === 0 ||
      alphaAt(x, y - 1) === 0 ||
      alphaAt(x, y + 1) === 0;
    if (!touchesClear) continue;
    px[i + 3] = 0;
    fringeRemoved++;
  }
}

const tmpPath = `${filePath}.alpha.tmp.png`;
await sharp(px, { raw: { width: w, height: h, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(tmpPath);
await unlink(filePath).catch(() => undefined);
await rename(tmpPath, filePath);

console.log(
  `${rel}: edge ${((edgeRemoved / n) * 100).toFixed(1)}%, fringe ${fringeRemoved}px`,
);
