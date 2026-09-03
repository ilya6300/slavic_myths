/**
 * Copy owner-cut drafts → assets/illustration_book/ (no trim, no auto α).
 * Source: instruction/design/drafts/*_illustration_draft.png
 */
import { copyFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const DRAFTS_DIR = path.join(root, 'instruction/design/drafts');
const OUTPUT_DIR = path.join(root, 'assets/illustration_book');

const MAPPING = [
  ['brownie_illustration_draft.png', 'brownie.png'],
  ['susedko_illustration_draft.png', 'susedko.png'],
  ['bannik_illustration_draft.png', 'bannik.png'],
  ['kikimora_illustration_draft.png', 'kikimora.png'],
  ['poludnik_illustration_draft.png', 'poludnik.png'],
  ['ovinnik_illustration_draft.png', 'ovinnik.png'],
  ['leshiy_illustration_draft.png', 'leschii.png'],
  ['vodyanoy_illustration_draft.png', 'waterman.png'],
  ['toptygin_illustration_draft.png', 'Grandpa_Toptygin.png'],
  ['poludnica_illustration_draft.png', 'poludnica.png'],
  ['rusalka_illustration_draft.png', 'rusalka.png'],
  ['lada_illustration_draft.png', 'lada.png'],
  ['veles_illustration_draft.png', 'veles.png'],
  ['baba_yaga_illustration_draft.png', 'Baba_Yaga.png'],
  ['koschei_illustration_draft.png', 'koschei.png'],
  ['chudo_yudo_illustration_draft.png', 'chudo_yodo.png'],
];

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  for (const [draft, output] of MAPPING) {
    await copyFile(path.join(DRAFTS_DIR, draft), path.join(OUTPUT_DIR, output));
    console.log(`${draft} → ${output}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
