/**
 * Post-process Epic 15 generated PNGs → production paths with alpha.
 * Drafts: instruction/design/drafts/yarilo_*_draft.png, perun_*_draft.png
 */
import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const DRAFTS = path.join(root, 'instruction/design/drafts');

const WHITE_THRESHOLD = 248;

function removeNearBlackBackground(data, channels) {
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    if (max <= 18) data[i + 3] = 0;
  }
}

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

async function processFile(inputRel, outputRel, mode) {
  const inputPath = path.join(root, inputRel);
  const outputPath = path.join(root, outputRel);
  await mkdir(path.dirname(outputPath), { recursive: true });

  const extracted = await sharp(inputPath).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  const pixels = Uint8Array.from(extracted.data);
  if (mode === 'white-border') {
    await sharp(inputPath).png({ compressionLevel: 9 }).toFile(outputPath);
    for (const script of ['remove-border-white-alpha.mjs', 'fill-internal-alpha-holes.mjs']) {
      const r = spawnSync(process.execPath, [path.join(__dirname, script), outputRel], {
        cwd: root,
        stdio: 'inherit',
      });
      if (r.status !== 0) process.exit(r.status ?? 1);
    }
    const meta = await sharp(outputPath).metadata();
    console.log(`${outputRel}: ${meta.width}x${meta.height} white-border pipeline`);
    return;
  }
  if (mode === 'white') removeWhiteBackground(pixels, extracted.info.channels);
  else if (mode === 'black') removeNearBlackBackground(pixels, extracted.info.channels);
  else throw new Error(`Unknown mode: ${mode}`);

  await sharp(pixels, {
    raw: {
      width: extracted.info.width,
      height: extracted.info.height,
      channels: 4,
    },
  })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);

  const meta = await sharp(outputPath).metadata();
  console.log(`${outputRel}: ${meta.width}x${meta.height} alpha=${meta.hasAlpha}`);
}

const JOBS = [
  ['instruction/design/drafts/yarilo_spring_shield_draft.png', 'assets/trophies/yarilo_spring_shield.png', 'white'],
  ['instruction/design/drafts/perun_oak_shield_draft.png', 'assets/trophies/perun_oak_shield.png', 'white'],
  ['instruction/design/drafts/yarilo_illustration_draft.png', 'assets/illustration_book/yarilo.png', 'black'],
  ['instruction/design/drafts/perun_illustration_draft.png', 'assets/illustration_book/perun.png', 'white-border'],
  ['instruction/design/drafts/yarilo_creature_draft.png', 'assets/creatures_in_the_book/yarilo.png', 'black'],
  ['instruction/design/drafts/perun_creature_draft.png', 'assets/creatures_in_the_book/perun.png', 'black'],
];

for (const [inRel, outRel, mode] of JOBS) {
  await processFile(inRel, outRel, mode);
}
