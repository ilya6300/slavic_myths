import { describe, expect, it } from 'vitest';
import { spiritQuizzes, shuffleQuizQuestions } from './quiz';

describe('quiz data', () => {
  it('should contain 18 spirit quizzes from quests.md', () => {
    expect(spiritQuizzes).toHaveLength(18);
    const brownie = spiritQuizzes.find((q) => q.spiritId === 'brownie')!;
    expect(brownie.questions).toHaveLength(4);
    const bannik = spiritQuizzes.find((q) => q.spiritId === 'bannik')!;
    expect(bannik.questions).toHaveLength(5);
    expect(bannik.questions[1].prompt.ru).toContain('мыло');
    expect(bannik.questions[1].options[bannik.questions[1].correctIndex].ru).toContain(
      'воды, мыло и веник',
    );
    const totalQuestions = spiritQuizzes.reduce(
      (sum, q) => sum + q.questions.length,
      0,
    );
    expect(totalQuestions).toBeGreaterThanOrEqual(140);
    expect(totalQuestions).toBeLessThanOrEqual(145);
  });

  it('should mark Polevoy correct answers as index 0', () => {
    const polevoy = spiritQuizzes.find((q) => q.spiritId === 'poludnik')!;
    expect(polevoy.questions).toHaveLength(5);
    const correct = [
      'Уйти с полосы в тень и переждать самый жаркий час покоем, потому что полдень — его время на этом поле.',
      'Он бережёт семейную полосу от недоброго завистливого взгляда, как хозяин бережёт свой дом — только дом его здесь, среди колосьев.',
      'Он держит семейную полосу как свой дом: бережёт её от недоброго взгляда и в полдень хочет, чтобы люди сидели в тени.',
      'Когда он к семье добр, он похож на домашнего хозяина полосы; когда суров — его видят маленьким косматым, бычком или козликом.',
      'На севере его сила не в зное, а в ледяном сиверене: этот ветер он сам высвистывает над своей полосой.',
    ];
    polevoy.questions.forEach((question, index) => {
      expect(question.correctIndex).toBe(0);
      expect(question.options[question.correctIndex].ru).toBe(correct[index]);
    });
    expect(polevoy.catHook.ru).toContain('полосой');
    expect(polevoy.questions[4].prompt.ru).toContain('сиверень');
  });

  it('should mark Leshiy correct answers as index 0', () => {
    const leshiy = spiritQuizzes.find((q) => q.spiritId === 'leshiy')!;
    expect(leshiy.questions).toHaveLength(7);
    const correct = [
      'Хозяин леса попутал тропу и водит гостя кругами, снова и снова выводя к тому же замшелому пню.',
      'Вывернуть одежду наизнанку, застегнуть её наоборот — справа налево — и поменять обувь с ноги на ногу.',
      'Хозяин чащи гневается, и его примета — внезапный ветер, смех и крик среди высоких деревьев.',
      'Хозяин лесной чащи то кружит след вокруг того же пня, то сам, старичком в белом, выводит гостя к опушке.',
      'Он бывает ростом выше деревьев и ниже травы, ходит в звериных шкурах, а иногда его выдают копыта и рога.',
      'Над голым деревом без коры у хозяина леса нет власти, а соль в чаще служит путнику надёжным оберегом.',
      'Кладут на замшелый пенёк первую добычу и так благодарят хозяина чащи за удачный выход в лес.',
    ];
    leshiy.questions.forEach((question, index) => {
      expect(question.correctIndex).toBe(0);
      expect(question.options[question.correctIndex].ru).toBe(correct[index]);
    });
    expect(leshiy.questions[0].prompt.ru).toContain('замшелому пню');
    expect(leshiy.miniTale.ru).toContain('вывернутом колокольчике');
  });

  it('should mark Kikimora correct answers as index 0', () => {
    const kikimora = spiritQuizzes.find((q) => q.spiritId === 'kikimora')!;
    expect(kikimora.questions).toHaveLength(5);
    const correct = [
      'Кикимора села к неубранной пряже и спутала нитки, потому что рукоделие оставили на ночь без присмотра.',
      'Смотать нитки, убрать шерсть с прялки и спрятать мотки, чтобы к ночи Кикиморе нечем было портить рукоделие.',
      'Она придирчива к рукоделию и чаще путает неубранную пряжу и валит вещи, чем помогает хозяйке.',
      'Резной узор бережёт прялку и пряжу, потому что такой защитный рисунок как раз от её ночных проказ.',
      'Она живёт в доме — в тёмных углах избы, в хлеву для скота и в сарае, где сушат зерно, — и держится пряжи, а не болотной топи.',
    ];
    kikimora.questions.forEach((question, index) => {
      expect(question.correctIndex).toBe(0);
      expect(question.options[question.correctIndex].ru).toBe(correct[index]);
    });
  });

  it('should mark Vodyanoy correct answers as index 0', () => {
    const vodyanoy = spiritQuizzes.find((q) => q.spiritId === 'vodyanoy')!;
    expect(vodyanoy.questions).toHaveLength(6);
    const correct = [
      'У водяной мельницы за деревней, на самом сильном ручье, где колесо бьёт воду и под ним темнеет омут.',
      'Он является корягой или бревном, чёрной собакой или кошкой, а то и вовсе плеском и хохотом без видимого тела.',
      'Своенравным хозяином омута: даже тихая встреча у воды — не дружба и не помощь, а знак, что река следит за человеком.',
      'Вылить чарку в воду и бросить сало под колесо целиком, не кладя этот дар на семейный стол.',
      'Потому что чёрный цвет в народе считают цветом Водяного, и так двор мельницы держит с ним общий знак.',
      'Остаться на сухом берегу и не идти на голос: он шумит то чтобы подозвать к воде, то просто от своего нрава.',
    ];
    vodyanoy.questions.forEach((question, index) => {
      expect(question.correctIndex).toBe(0);
      expect(question.options[question.correctIndex].ru).toBe(correct[index]);
    });
    expect(vodyanoy.questions[0].prompt.ru).toContain('водяное колесо');
    expect(vodyanoy.loseMessage.ru).toContain('вышел сухой из воды');
    expect(vodyanoy.miniTale.ru).toContain('сала целиком');
  });

  it('should keep post-Vodyanoy grade counts and encyclopedia anchors', () => {
    const byId = Object.fromEntries(
      spiritQuizzes.map((quiz) => [quiz.spiritId, quiz]),
    );
    expect(byId.dedushka_toptygin.questions).toHaveLength(6);
    expect(byId.poludnica.questions).toHaveLength(8);
    expect(byId.rusalka.questions).toHaveLength(8);
    expect(byId.lada.questions).toHaveLength(8);
    expect(byId.veles.questions).toHaveLength(12);
    expect(byId.baba_yaga.questions).toHaveLength(12);
    expect(byId.koschei_immortal.questions).toHaveLength(12);
    expect(byId.chudo_yudo.questions).toHaveLength(12);
    expect(byId.yarilo.questions).toHaveLength(12);
    expect(byId.perun.questions).toHaveLength(13);

    expect(byId.dedushka_toptygin.questions[0].options[0].ru).toContain(
      'нарушение',
    );
    expect(byId.poludnica.questions[1].options[0].ru).toContain('всё поле целиком');
    expect(byId.rusalka.questions[0].options[0].ru).toContain('полурыбой');
    expect(byId.rusalka.questions[5].prompt.ru).toContain('гребень');
    expect(byId.rusalka.catHook.ru).toContain('на сухом бугре');
    expect(byId.lada.questions[0].options[0].ru).toContain('кружка остаётся общей');
    expect(byId.veles.questions[1].options[0].ru).toContain('слово «скот»');
    expect(byId.baba_yaga.questions[1].options[0].ru).toContain('окуренные дымом');
    expect(byId.koschei_immortal.questions[3].options[0].ru).toContain(
      'спрятанной в стороне от тела',
    );
    expect(byId.chudo_yudo.questions[1].options[0].ru).toContain('западная принимает');
    expect(byId.chudo_yudo.catHook.ru).not.toContain('Калинов');
    expect(byId.baba_yaga.catHook.ru).toContain('столбы пахнут дымом');
    expect(byId.poludnica.loseMessage.ru).toContain('Зной накрыл полосу');
  });

  it('should shuffle answers and preserve correct index', () => {
    const brownie = spiritQuizzes.find((q) => q.spiritId === 'brownie')!;
    const shuffled = shuffleQuizQuestions(brownie.questions, () => 0.5);
    expect(shuffled[0].options).toHaveLength(3);
    const correct = shuffled[0].options[shuffled[0].correctIndex];
    const original = brownie.questions[0].options[brownie.questions[0].correctIndex];
    expect(correct).toBe(original);
  });
});
