/**
 * Remove only edge-connected near-white pixels → transparent α.
 * Keeps internal highlights opaque (book illustration on #FFF backdrop).
 *
 * Usage: node scripts/remove-border-white-alpha.mjs <relative-path> [threshold]
 */
import sharp from 'sharp';
import path from 'path';
import { rename, unlink } from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const threshold = Number(process.argv[3] ?? 248);

function isBg(r, g, b) {
  return r >= threshold && g >= threshold && b >= threshold;
}

const rel = process.argv[2];
if (!rel) {
  console.error('Usage: node scripts/remove-border-white-alpha.mjs <path> [threshold]');
  process.exit(1);
}

const filePath = path.join(root, rel);
const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});
const { width, height, channels } = info;
const px = Uint8Array.from(data);
const w = width;
const h = height;
const ch = channels;
const n = w * h;
const bg = new Uint8Array(n);

const pixelBg = (x, y) => {
  const i = (y * w + x) * ch;
  return isBg(px[i], px[i + 1], px[i + 2]);
};

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
  if (!pixelBg(x, y)) continue;
  bg[p] = 1;
  queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

let removed = 0;
for (let p = 0; p < n; p++) {
  if (!bg[p]) continue;
  const i = p * ch;
  px[i + 3] = 0;
  removed++;
}

const tmpPath = `${filePath}.alpha.tmp.png`;
await sharp(px, { raw: { width: w, height: h, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(tmpPath);
await unlink(filePath).catch(() => undefined);
await rename(tmpPath, filePath);

console.log(
  `${rel}: removed ${((removed / n) * 100).toFixed(1)}% edge-connected white (threshold ${threshold})`,
);
