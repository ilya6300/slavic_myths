/**
 * MVP clay-wood placeholders for book UI P0 (TASK-012) until art pass.
 *
 * НЕ запускать поверх уже залитого арта в assets/UI/ — перезаписывает PNG.
 * Восстановление: git checkout HEAD -- assets/UI/arrow_*_wood.png assets/UI/book_close_wood.png …
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const uiDir = path.join(root, 'assets', 'UI');

async function woodTile(w, h, label) {
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#a67c52"/><stop offset="100%" stop-color="#6b4a2e"/>
  </linearGradient></defs>
  <rect width="100%" height="100%" rx="8" fill="url(#g)" stroke="#4a3218" stroke-width="2"/>
  <text x="50%" y="54%" text-anchor="middle" font-family="Georgia,serif" font-size="${Math.min(w,h)*0.22}" fill="#f5e6c8">${label}</text>
</svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

const files = [
  ['arrow_left_wood.png', 64, 64, '◀'],
  ['arrow_right_wood.png', 64, 64, '▶'],
  ['icon_paw.png', 48, 48, '🐾'],
  ['book_close_wood.png', 56, 56, '×'],
];

await mkdir(uiDir, { recursive: true });
for (const [name, w, h, label] of files) {
  const out = path.join(uiDir, name);
  const buf = await woodTile(w, h, label);
  await writeFile(out, buf);
  console.log('wrote', name);
}
