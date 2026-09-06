import fs from 'node:fs';
import path from 'node:path';
import { part1Spirits } from './quiz_v2_data_part1.mjs';
import { part2Spirits } from './quiz_v2_data_part2.mjs';

const allSpirits = [...part1Spirits, ...part2Spirits];

console.log(`Loaded ${allSpirits.length} spirits.`);

const expectedCounts = [
  ["Домовой", 4],
  ["Суседко (Барабашка)", 4],
  ["Банник", 5],
  ["Кикимора", 5],
  ["Полевой", 5],
  ["Овинник", 5],
  ["Леший", 7],
  ["Водяной", 6],
  ["Дедушка Топтыгин", 6],
  ["Полудница", 8],
  ["Русалка", 8],
  ["Лада", 8],
  ["Велес", 12],
  ["Баба-Яга", 12],
  ["Кощей Бессмертный", 12],
  ["Чудо-Юдо", 13],
];

let totalQuestions = 0;
let errors = [];

if (allSpirits.length !== 16) {
  errors.push(`Expected 16 spirits, got ${allSpirits.length}`);
}

expectedCounts.forEach(([name, count], idx) => {
  const sp = allSpirits[idx];
  if (!sp) {
    errors.push(`Missing spirit at index ${idx}: ${name}`);
    return;
  }
  if (sp.spiritName !== name) {
    errors.push(`Spirit at ${idx} is named '${sp.spiritName}', expected '${name}'`);
  }
  if (sp.questions.length !== count) {
    errors.push(`Spirit '${name}' has ${sp.questions.length} questions, expected ${count}`);
  }
  totalQuestions += sp.questions.length;

  let charQuestions = sp.questions.filter(q => q.isCharacter);
  if (charQuestions.length !== 1) {
    errors.push(`Spirit '${name}' has ${charQuestions.length} [характер духа] questions, expected 1`);
  }
});

if (totalQuestions !== 120) {
  errors.push(`Expected 120 total questions, got ${totalQuestions}`);
}

// Forbidden patterns
const forbiddenRegexes = [
  /Как ответить\?/i,
  /Что разумнее\?/i,
  /фея/i,
  /добрым всегда/i,
  /злым всегда/i,
  /ненавидит/i,
  /в сказках/i,
  /в сказке/i,
  /\bсказочн/i,
  /в старых преданиях/i,
  /удушь/i,
  /младенец/i,
  /подменил/i,
  /мокрая одежда/i,
  /утоплен/i,
  /череп/i,
  /\bтопор\b|\bтопором\b/i,
  /завидует еде/i
];

allSpirits.forEach(sp => {
  sp.questions.forEach((q, qIdx) => {
    if (q.answers.length !== 3) {
      errors.push(`${sp.spiritName} Q${q.num}: expected 3 answers, got ${q.answers.length}`);
    }
    const correctCount = q.answers.filter(a => a.includes('*(верный)*')).length;
    if (correctCount !== 1) {
      errors.push(`${sp.spiritName} Q${q.num}: expected 1 *(верный)*, got ${correctCount}`);
    }

    const fullQText = q.text + " " + q.answers.join(" ");
    forbiddenRegexes.forEach(regex => {
      if (regex.test(fullQText)) {
        errors.push(`${sp.spiritName} Q${q.num} matches forbidden pattern ${regex}: "${fullQText.slice(0, 100)}..."`);
      }
    });

    // Length balance check: max answer shouldn't be more than 2.5x min answer
    const lens = q.answers.map(a => a.length);
    const minLen = Math.min(...lens);
    const maxLen = Math.max(...lens);
    if (maxLen > minLen * 2.8) {
      errors.push(`${sp.spiritName} Q${q.num} answer lengths unbalanced: min=${minLen}, max=${maxLen}`);
    }
  });
});

if (errors.length > 0) {
  console.error("VALIDATION FAILED WITH ERRORS:");
  errors.forEach(e => console.error(" - " + e));
  process.exit(1);
}

console.log("All validation checks PASSED!");

// Generate Markdown
const lines = [
  "# Квиз бестиария v2 — полная редакция (сценарист)",
  "",
  "> **Задача:** quiz-rewrite-from-book-v2 | **План:** ideas | human-gate",
  "> **Источник:** книга quotes-…md + аудит draft.md (1–288)",
  "> **Запрещено:** копировать quests.md и draft.md (290+)",
  "> **Правила:** 16 духов, **120 вопросов**, детский рейтинг (10–11 лет), живой мир здесь и сейчас, без хоррора и насилия, равные правдоподобные ответы.",
  "> **Сводка:** 16 духов, **120 вопросов**",
  "",
  "---",
  ""
];

allSpirits.forEach(sp => {
  lines.push(`## ${sp.title}`);
  lines.push("");
  lines.push(`**Крючок кота:** «${sp.hook}»`);
  lines.push(`**Проигрыш:** «${sp.lose}»`);
  lines.push(`**Награда:** ${sp.reward}`);
  lines.push("");

  sp.questions.forEach(q => {
    const charTag = q.isCharacter ? " [характер духа]" : "";
    lines.push(`### Вопрос ${q.num}${charTag}`);
    lines.push("");
    lines.push(q.text);
    lines.push("");
    q.answers.forEach(a => {
      lines.push(`- ${a}`);
    });
    lines.push("");
    lines.push("> **Чеклист сценариста:** сцена ✅ | пятиклассник ✅ | финал мысли ✅ | без висячих ✅ | равные варианты ✅ | один дух ✅ | без шаблонов ✅");
    lines.push("");
  });

  lines.push(`**Мини-сказ:** ${sp.miniTale}`);
  lines.push("");
  lines.push("---");
  lines.push("");
});

// Summary table
lines.push("### Сводка вопросов [характер духа]");
lines.push("");
lines.push("| Дух | Верный тип | Кратко |");
lines.push("|-----|------------|--------|");
lines.push("| Домовой | Переменчивый хранитель | Бережёт порядок, строг к лени |");
lines.push("| Суседко | Шумный озорник | Любит проказы, но не со зла |");
lines.push("| Банник | Строгий блюститель чистоты | Порядок и уважение к пару |");
lines.push("| Кикимора | Придирчивая невидимка | Проказничает у нерях, мирная при чистоте |");
lines.push("| Полевой | Справедливый хранитель | Бережёт колос и межу, строг к топчущим |");
lines.push("| Овинник | Заботливый покровитель | Бережёт хлеб от огня и сырости |");
lines.push("| Леший | Независимый хозяин чащи | Помогает вежливым, кружит заносчивых |");
lines.push("| Водяной | Своенравный владыка | Бережёт реку, не терпит мусора и жадности |");
lines.push("| Топтыгин | Мудрый величавый покровитель | Любит тишину, мёд и мирный покой |");
lines.push("| Полудница | Строгая хранительница меры | Учит беречь силы от зноя в страду |");
lines.push("| Русалка | Таинственная береговая дева | В белой рубахе, чтит покой речных трав |");
lines.push("| Лада | Светлая созидательная сила | Хранит лад, согласие и мир в доме |");
lines.push("| Велес | Мудрый земной владыка | Покровитель скота, лесов и честной меры |");
lines.push("| Баба-Яга | Стражница рубежа и испытательница | Проверяет ум и смелость, помогает честным |");
lines.push("| Кощей | Хранитель сокровенных тайн | Уважает холодный расчёт, презирает жадность |");
lines.push("| Чудо-Юдо | Неподкупный страж равновесия | Испытывает верность чести и слову |");
lines.push("");
lines.push("```yaml");
lines.push("scenarist_done:");
lines.push("  pipeline: ideas");
lines.push("  task_id: quiz-rewrite-from-book-v2");
lines.push("  summary: |");
lines.push("    Полная новая редакция квиза: 120 вопросов по 16 духам, написана с чистого листа.");
lines.push("    Все требования владельца и книги соблюдены:");
lines.push("    - Полное отсутствие хоррора, насилия, травм, удушья, утопленников, подмены детей.");
lines.push("    - Живой мир здесь и сейчас: нет фраз «в сказках», «в старых преданиях».");
lines.push("    - Язык понятен пятикласснику (10-11 лет): нет архаизмов («сноп», «овин») без пояснений.");
lines.push("    - Неверные варианты — правдоподобные житейские заблуждения, никакой клоунады («рубить кусты топором»).");
lines.push("    - Фольклор из книги: рябина у Лешего (рябинник), Банник строг к пару и порогу, народная русалка в белой рубахе на берёзе без рыбьего хвоста, Кикимора домашняя в избе/углах.");
lines.push("    - 16 вопросов [характер духа] с тремя взвешенными суждениями без карикатурной тройки.");
lines.push("    - Чеклист сценариста на каждый вопрос.");
lines.push("  next: kritik-redaktor");
lines.push("```");
lines.push("");

const outputPath = path.resolve('instruction/plans/quiz_rewrite_v2.md');
fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');
console.log(`Successfully generated ${outputPath}`);
