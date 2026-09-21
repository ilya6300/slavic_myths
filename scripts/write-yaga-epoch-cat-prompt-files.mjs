import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildEpochCatPrompt, YAGA_EPOCH_CAT_SKIN_IDS } from './yaga-shop-epoch-cat-prompts.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'instruction', 'design', 'drafts', 'prompts');
mkdirSync(dir, { recursive: true });

for (const id of YAGA_EPOCH_CAT_SKIN_IDS) {
  for (const pose of ['sid', 'sleep']) {
    const file = path.join(dir, `${id}_${pose}.txt`);
    writeFileSync(file, buildEpochCatPrompt(id, pose), 'utf8');
  }
}
console.log('Wrote', YAGA_EPOCH_CAT_SKIN_IDS.length * 2, 'prompt files to', dir);
