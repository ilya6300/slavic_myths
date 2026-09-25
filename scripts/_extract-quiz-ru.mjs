import fs from 'fs';
import ts from 'typescript';

const src = fs.readFileSync('src/data/quiz.ts', 'utf8');
const sf = ts.createSourceFile('quiz.ts', src, ts.ScriptTarget.Latest, true);
const strings = new Set();
function walk(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    const t = node.text;
    if (/[А-Яа-яЁё]/.test(t)) strings.add(t);
  }
  ts.forEachChild(node, walk);
}
walk(sf);
const list = [...strings];
fs.writeFileSync('scripts/_quiz-ru.json', JSON.stringify(list, null, 2));
console.log('count', list.length);
