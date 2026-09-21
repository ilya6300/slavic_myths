import { buildEpochCatPrompt } from './yaga-shop-epoch-cat-prompts.mjs';

const [skinId, pose] = process.argv.slice(2);
if (!skinId || !pose) {
  console.error('Usage: node scripts/emit-yaga-epoch-cat-prompt.mjs <skinId> sid|sleep');
  process.exit(1);
}
process.stdout.write(buildEpochCatPrompt(skinId, pose));
