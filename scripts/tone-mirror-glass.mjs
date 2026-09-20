/**
 * Затемняет «стекло» зеркала, чтобы не выглядело как дыра в сцене.
 * Usage: node scripts/tone-mirror-glass.mjs assets/izba/mirror_floor.png
 */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const filePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  process.argv[2] ?? 'assets/izba/mirror_floor.png',
);

const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});
const { width: w, height: h, channels: ch } = info;
const px = Uint8Array.from(data);

const isGlass = (r, g, b, a) =>
  a > 0 && r >= 195 && g >= 190 && b >= 185 && r - b < 35;

let toned = 0;
for (let p = 0; p < w * h; p++) {
  const i = p * ch;
  const r = px[i];
  const g = px[i + 1];
  const b = px[i + 2];
  const a = px[i + 3];
  if (!isGlass(r, g, b, a)) continue;
  px[i] = Math.round(r * 0.72 + 40);
  px[i + 1] = Math.round(g * 0.74 + 48);
  px[i + 2] = Math.round(b * 0.76 + 58);
  px[i + 3] = 255;
  toned++;
}

await sharp(px, { raw: { width: w, height: h, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(filePath);

console.log(`${filePath}: toned ${toned} glass pixels`);
