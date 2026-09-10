/**
 * HUD-иконки: убрать белую подложку генератора → прозрачный α (как monete_v1).
 * Канон фона в промпте: «solid black background»; на практике — α, см. assets/UI/monete_v1.png.
 *
 * Usage: node scripts/process-hud-icon.mjs assets/UI/icon_energy.png
 */
import sharp from 'sharp';
import { rename, unlink } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

/** Порог «белой подложки» (не трогаем светящиеся блики молнии). */
const WHITE_THRESHOLD = 248;

function removeWhiteBackground(data, channels) {
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
      data[i + 3] = 0;
    }
  }
}

async function processHudIcon(relativePath) {
  const inputPath = path.join(root, relativePath);
  const extracted = await sharp(inputPath).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });

  const pixels = Uint8Array.from(extracted.data);
  removeWhiteBackground(pixels, extracted.info.channels);

  const tempPath = `${inputPath}.tmp.png`;
  await sharp(pixels, {
    raw: {
      width: extracted.info.width,
      height: extracted.info.height,
      channels: 4,
    },
  })
    .png()
    .toFile(tempPath);
  await unlink(inputPath).catch(() => undefined);
  await rename(tempPath, inputPath);

  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  let white = 0;
  let trans = 0;
  const total = data.length / info.channels;
  for (let i = 0; i < data.length; i += info.channels) {
    const a = data[i + 3];
    if (a < 16) trans++;
    else if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) white++;
  }

  console.log(
    `${relativePath}: white ${((white / total) * 100).toFixed(1)}%, transparent ${((trans / total) * 100).toFixed(1)}%`,
  );
}

const target = process.argv[2] ?? 'assets/UI/icon_energy.png';
await processHudIcon(target);
