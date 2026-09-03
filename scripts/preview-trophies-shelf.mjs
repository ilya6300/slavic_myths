/**
 * Preview trophies at 3.8vh (≈41px at 1080p) — shelf scale check.
 */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const trophiesDir = path.join(root, 'assets/trophies');
const out = path.join(
  root,
  'instruction/design/drafts/trophy_shelf_3.8vh_preview.png',
);

const FILES = [
  'susedko_chest.png',
  'bannik_broom.png',
  'kikimora_yarn.png',
  'polevoy_wreath.png',
  'ovinnik_sheaf.png',
  'leshiy_staff.png',
  'vodyanoy_shell.png',
  'toptygin_paw.png',
  'poludnica_sickle.png',
  'rusalka_comb.png',
  'lada_harmony_vase.png',
  'veles_bust.png',
  'yaga_hut.png',
  'koschei_needle.png',
  'chudo_figurine.png',
];

/** 3.8vh at 1080px viewport height */
const DISPLAY_H = Math.round(1080 * 0.038);
const GAP = 8;
const PAD = 16;

async function main() {
  const resized = [];
  for (const file of FILES) {
    const p = path.join(trophiesDir, file);
    const meta = await sharp(p).metadata();
    const h = DISPLAY_H;
    const w = Math.round((meta.width / meta.height) * h);
    const buf = await sharp(p).resize({ width: w, height: h }).png().toBuffer();
    resized.push({ buf, w, h });
  }

  const totalW =
    PAD * 2 + resized.reduce((s, r, i) => s + r.w + (i > 0 ? GAP : 0), 0);
  const totalH = PAD * 2 + DISPLAY_H;

  const composites = [];
  let x = PAD;
  for (const r of resized) {
    composites.push({ input: r.buf, left: x, top: PAD + DISPLAY_H - r.h });
    x += r.w + GAP;
  }

  await sharp({
    create: {
      width: totalW,
      height: totalH,
      channels: 4,
      background: { r: 180, g: 140, b: 100, alpha: 255 },
    },
  })
    .composite(composites)
    .png()
    .toFile(out);

  console.log(`Preview ${DISPLAY_H}px height (3.8vh@1080): ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
