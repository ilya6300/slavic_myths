/**
 * Copy Yaga shop cat skin drafts from Cursor generate folder → design/drafts + production paths, then α.
 * Usage: node scripts/import-yaga-cat-skin-drafts.mjs [cursorAssetsDir]
 */
import { copyFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { YAGA_EPOCH_CAT_SKIN_IDS } from './yaga-shop-epoch-cat-prompts.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const defaultCursorAssets =
  process.env.CURSOR_GENERATED_ASSETS ??
  path.join(
    process.env.USERPROFILE ?? '',
    '.cursor',
    'projects',
    'l-Frontend-games-slavic-myths',
    'assets',
  );

let cursorDir = path.resolve(defaultCursorAssets);

const cliArgs = process.argv.slice(2);
const pathArg = cliArgs.find((a) => a.includes('/') || a.includes('\\'));
if (pathArg) {
  cursorDir = path.resolve(pathArg);
}
const idArgs = cliArgs.filter((a) => a !== pathArg);
const SKINS = idArgs.length > 0 ? idArgs : YAGA_EPOCH_CAT_SKIN_IDS;

function runAlpha(relPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [path.join(root, 'scripts', 'remove-border-white-alpha.mjs'), relPath],
      { cwd: root, stdio: 'inherit' },
    );
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`alpha failed: ${relPath}`))));
  });
}

for (const id of SKINS) {
  for (const pose of ['sid', 'sleep']) {
    const draftName = `${id}_${pose}_draft.png`;
    const src = path.join(cursorDir, draftName);
    const draftDest = path.join(root, 'instruction', 'design', 'drafts', draftName);
    const prodRel = `assets/pets/the_age_of_miracles/${id}/${id}_${pose}.png`;
    const prodDest = path.join(root, prodRel);

    await mkdir(path.dirname(prodDest), { recursive: true });
    await mkdir(path.dirname(draftDest), { recursive: true });
    await copyFile(src, draftDest);
    await copyFile(src, prodDest);
    await runAlpha(prodRel);
    console.log('OK', prodRel);
  }
}
