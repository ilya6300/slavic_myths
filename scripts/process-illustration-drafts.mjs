/**
 * Process illustration_book drafts: remove black background → transparent α.
 * Source: instruction/design/drafts/*_illustration_draft.png
 * Output: assets/illustration_book/*.png
 */
import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const DRAFTS_DIR = path.join(root, 'instruction/design/drafts');
const OUTPUT_DIR = path.join(root, 'assets/illustration_book');

/** spiritId → [draft basename, output filename] */
const MAPPING = [
  ['brownie', 'brownie_illustration_draft.png', 'brownie.png'],
  ['susedko', 'susedko_illustration_draft.png', 'susedko.png'],
  ['bannik', 'bannik_illustration_draft.png', 'bannik.png'],
  ['kikimora', 'kikimora_illustration_draft.png', 'kikimora.png'],
  ['poludnik', 'poludnik_illustration_draft.png', 'poludnik.png'],
  ['ovinnik', 'ovinnik_illustration_draft.png', 'ovinnik.png'],
  ['leshiy', 'leshiy_illustration_draft.png', 'leschii.png'],
  ['vodyanoy', 'vodyanoy_illustration_draft.png', 'waterman.png'],
  ['dedushka_toptygin', 'toptygin_illustration_draft.png', 'Grandpa_Toptygin.png'],
  ['poludnica', 'poludnica_illustration_draft.png', 'poludnica.png'],
  ['rusalka', 'rusalka_illustration_draft.png', 'rusalka.png'],
  ['lada', 'lada_illustration_draft.png', 'lada.png'],
  ['veles', 'veles_illustration_draft.png', 'veles.png'],
  ['baba_yaga', 'baba_yaga_illustration_draft.png', 'Baba_Yaga.png'],
  ['koschei_immortal', 'koschei_illustration_draft.png', 'koschei.png'],
  ['chudo_yudo', 'chudo_yudo_illustration_draft.png', 'chudo_yodo.png'],
  ['yarilo', 'yarilo_illustration_draft.png', 'yarilo.png'],
  ['perun', 'perun_illustration_draft.png', 'perun.png'],
];

function removeNearBlackBackground(data, channels) {
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const isPureBlack = max <= 18;
    if (isPureBlack) {
      data[i + 3] = 0;
    }
  }
}

async function processDraft(draftName, outputName) {
  const inputPath = path.join(DRAFTS_DIR, draftName);
  const outPath = path.join(OUTPUT_DIR, outputName);

  const extracted = await sharp(inputPath).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });

  const pixels = Uint8Array.from(extracted.data);
  removeNearBlackBackground(pixels, extracted.info.channels);

  await sharp(pixels, {
    raw: {
      width: extracted.info.width,
      height: extracted.info.height,
      channels: 4,
    },
  })
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  const outMeta = await sharp(outPath).metadata();
  return {
    output: outputName,
    width: outMeta.width,
    height: outMeta.height,
    hasAlpha: outMeta.hasAlpha,
  };
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const results = [];
  for (const [, draft, output] of MAPPING) {
    results.push(await processDraft(draft, output));
  }
  console.table(results);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
