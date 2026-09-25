import fs from 'fs';
const data = JSON.parse(fs.readFileSync('src/data/divinationAnswers.generated.json', 'utf8'));
const set = new Set();
for (const pairs of Object.values(data)) {
  for (const pair of pairs) {
    set.add(pair[0]);
    set.add(pair[1]);
  }
}
const list = [...set];
fs.writeFileSync('scripts/_div-ru.json', JSON.stringify(list, null, 2));
console.log('unique', list.length, 'spirits', Object.keys(data).length);
