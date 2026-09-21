import sharp from 'sharp';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'instruction', 'design', 'mockups');

const names = [
  'starter_pack_mockup.png',
  'street_yard_mockup.png',
  'kikimora_craft_mockup.png',
  'rewarded_wait_mockup.png',
];

await mkdir(dir, { recursive: true });
for (const name of names) {
  const label = name.replace('_mockup.png', '').replace(/_/g, ' ');
  const svg = `<svg width="640" height="360" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#1a120c"/>
  <text x="50%" y="50%" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="#e8d4b0">${label} — UX wire placeholder</text>
</svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  await writeFile(path.join(dir, name), buf);
  console.log('wrote', name);
}
