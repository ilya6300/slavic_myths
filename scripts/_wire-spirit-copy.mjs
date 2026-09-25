import fs from 'fs';

const p = 'src/data/spirits.ts';
let s = fs.readFileSync(p, 'utf8');
if (!s.includes('from \'./spiritCopy\'')) {
  s = s.replace(
    "import { resolveText } from '../i18n/resolve';",
    "import { resolveText } from '../i18n/resolve';\nimport { spiritCopy } from './spiritCopy';",
  );
}

const TEXT_KEYS = [
  'name',
  'bookDescription',
  'bookRewardDescription',
  'loseMessage',
  'trophyDescription',
  'miniTale',
  'lockedHint',
];

const ids = [
  'brownie',
  'susedko',
  'bannik',
  'kikimora',
  'poludnik',
  'ovinnik',
  'leshiy',
  'vodyanoy',
  'dedushka_toptygin',
  'poludnica',
  'rusalka',
  'baba_yaga',
  'lada',
  'veles',
  'koschei_immortal',
  'chudo_yudo',
  'yarilo',
  'perun',
];

function stripTextFields(block) {
  const lines = block.split('\n');
  const out = [];
  let skipping = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!skipping) {
      const key = TEXT_KEYS.find((k) => line.startsWith(`    ${k}:`));
      if (key) {
        const rest = line.slice(`    ${key}:`.length).trim();
        if (rest === '' || !rest.endsWith(',')) {
          skipping = true;
          if (rest.endsWith(',')) skipping = false;
        }
        continue;
      }
      out.push(line);
    } else if (line.trimEnd().endsWith(',')) {
      skipping = false;
    }
  }
  return out.join('\n');
}

for (const id of ids) {
  const start = s.indexOf(`    id: '${id}',`);
  if (start < 0) {
    console.log('MISS start', id);
    continue;
  }
  const nextId = ids[ids.indexOf(id) + 1];
  const end = nextId
    ? s.indexOf(`    id: '${nextId}',`, start + 1)
    : s.indexOf('];', start);
  if (end < 0) {
    console.log('MISS end', id);
    continue;
  }
  let block = s.slice(start, end);
  if (block.includes(`...spiritCopy.${id}`)) {
    console.log('already', id);
    continue;
  }
  block = stripTextFields(block);
  block = block.replace(
    `    id: '${id}',\n`,
    `    id: '${id}',\n    ...spiritCopy.${id},\n`,
  );
  s = s.slice(0, start) + block + s.slice(end);
  console.log('ok', id);
}

fs.writeFileSync(p, s);
