import fs from 'fs';

const part = process.argv[2];
const ru = JSON.parse(fs.readFileSync(`scripts/_quiz-ru-${part}.json`, 'utf8'));
const pairs = JSON.parse(fs.readFileSync(`scripts/_quiz-pairs-${part}.json`, 'utf8'));
if (pairs.length !== ru.length) {
  throw new Error(`part ${part}: ru ${ru.length} pairs ${pairs.length}`);
}
const out = {};
ru.forEach((line, i) => {
  const { en, tr } = pairs[i];
  if (!en || !tr || en === line || tr === line) throw new Error(`bad ${part} #${i}`);
  out[line] = { en, tr };
});
fs.writeFileSync(`scripts/_quiz-i18n-${part}.json`, JSON.stringify(out));
console.log('part', part, Object.keys(out).length);
