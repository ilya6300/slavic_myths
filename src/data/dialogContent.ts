/**
 * Все реплики диалогов (кот, Суседко, UI настроек) — ru / en / tr.
 * Единственный файл с текстами для локализации реплик.
 * Канон: instruction/cat_dialogs.md, susedko_dialogs.md, scenario.md §4.3, §8
 */

import type { LocalizedLines, LocalizedText } from '../i18n/types';
import type { Grade } from '../domain/grade';

const L = (
  ru: string,
  en: string,
  tr: string,
): LocalizedText => ({ ru, en, tr });

/** Онбординг шаги 0–6 — cat_dialogs.md §1 / scenario.md §4.3 */
export const onboardingLines: LocalizedLines = [
  L(
    'Ого, человек! Я — Кот. Тут по ночам шуршат. Пойдём разберёмся?',
    'Oh, a human! I\'m the Cat. Things rustle here at night. Shall we find out who?',
    'Vay canına, bir insan! Ben Kedi. Geceleri burada hışırdıyorlar. Kimmiş, bakalım mı?',
  ),
  L(
    'Начни с Домового. Без него в избе бардак. Книга — вон, открывай.',
    'Start with the Domovoy. Without him the hut is chaos. The book — there, open it.',
    'Domovoy ile başla. Onsuz kulübede kaos. Kitap — orada, aç.',
  ),
  L(
    'Не торопись. Домовой строгий… но сметану уважает.',
    'Don\'t rush. The Domovoy is strict… but he respects sour cream.',
    'Acele etme. Domovoy katı… ama kaymağa saygı duyar.',
  ),
  L(
    'Вон он, у печки. А сундук? Суседко спрятал. Пора ловить.',
    'There he is, by the stove. And the chest? Susedko hid it. Time to catch him.',
    'İşte o, sobanın yanında. Sandık mı? Susedko sakladı. Yakalamanın zamanı.',
  ),
  L(
    'Слышишь? Под полом шуршит. Это он.',
    'Hear that? Rustling under the floor. That\'s him.',
    'Duyuyor musun? Döşemenin altı hışırdıyor. O.',
  ),
  L(
    'Сундук! Открывай сразу — в первый раз без очереди.',
    'The chest! Open it now — first time, no waiting.',
    'Sandık! Hemen aç — ilk seferde kuyruk yok.',
  ),
  L(
    'Загляни попозже — сундук снова набьётся. А ночью… не бросай меня.',
    'Drop by later — the chest will fill again. And at night… don\'t leave me.',
    'Sonra uğra — sandık yine dolar. Geceleri ise… beni bırakma.',
  ),
];

export const catDialogBanksContent = {
  greet_first: [onboardingLines[0]!],

  greet_return: [
    L(
      'Снова ты! Я как раз дремал… почти.',
      'You again! I was just napping… almost.',
      'Yine sen! Uyukluyordum… neredeyse.',
    ),
    L(
      'О, хозяин. Уши уже на месте.',
      'Oh, the owner. Ears are already in place.',
      'Ah, ev sahibi. Kulaklar yerinde.',
    ),
    L(
      'Изба скучала. Я — особенно.',
      'The hut missed you. Me — especially.',
      'Kulübe seni özledi. Ben özellikle.',
    ),
    L(
      'Ты! Я думал, сундук без меня откроешь.',
      'You! I thought you\'d open the chest without me.',
      'Sen! Sandığı bensiz açacaksın sandım.',
    ),
    L(
      'Ну наконец. Хвост уже затёк.',
      'Finally. My tail went numb.',
      'Nihayet. Kuyruğum uyuşmuştu.',
    ),
    L(
      'Шшш. Я караулил. Честно.',
      'Shhh. I was on watch. Honestly.',
      'Şşş. Nöbetteydim. Cidden.',
    ),
    L(
      'С возвращением. Носки на месте? Проверь.',
      'Welcome back. Socks still there? Check.',
      'Hoş geldin. Çoraplar yerinde mi? Bak.',
    ),
  ],

  click: [
    L('Мур.', 'Purr.', 'Mır.'),
    L('Эй! Не жадничай… ладно, ещё.', 'Hey! Don\'t be greedy… fine, one more.', 'Hey! Açgözlü olma… tamam, bir tane daha.'),
    L('А ну щекотно! Лапу ниже.', 'Cut it out, that tickles! Paw lower.', 'Kes, gıdıklanıyorum! Pençeyi aşağı.'),
    L('Ещё одна. Сметана это одобряет.', 'Another one. Sour cream approves.', 'Bir tane daha. Kaymak onaylıyor.'),
    L('Усы в деле.', 'Whiskers on duty.', 'Bıyıklar iş başında.'),
    L('В смысле стоп? Я только разогрелся.', 'Stop? I just warmed up.', 'Durmak mı? Daha yeni ısındım.'),
    L('Монетка любит руки. Ещё.', 'The coin likes hands. Again.', 'Jet elleri sever. Daha.'),
    L('Ой. Это мой хвост. Не твой.', 'Oi. That\'s my tail. Not yours.', 'Oy. O benim kuyruğum. Senin değil.'),
    L('Тише! Домовой у печки…', 'Quieter! The Domovoy\'s by the stove…', 'Sessiz! Domovoy sobanın yanında…'),
    L('Клик-клик. Я почти не против.', 'Click-click. I almost don\'t mind.', 'Tık-tık. Neredeyse aldırmıyorum.'),
  ],

  click_footnote: [
    L(
      'Пять! Удача уже подслушивает.',
      'Five! Luck is already eavesdropping.',
      'Beş! Şans çoktan kulak kabarttı.',
    ),
    L(
      'Ритм есть. Домовой бы кивнул.',
      'Got the rhythm. The Domovoy would nod.',
      'Ritim var. Domovoy başını sallardı.',
    ),
    L(
      'Монетки копятся. Мыши нервничают.',
      'Coins are piling up. The mice are nervous.',
      'Jetler birikiyor. Fareler geriliyor.',
    ),
    L(
      'Не останавливайся — сундук такое любит.',
      'Don\'t stop — the chest loves this.',
      'Durma — sandık böyle şeyleri sever.',
    ),
    L(
      'Ещё чуть-чуть — и сметану заслужим?',
      'A bit more — and we earn sour cream?',
      'Biraz daha — kaymak hakettik mi?',
    ),
    L(
      'Чую удачу усами. Не сбивай.',
      'I smell luck with my whiskers. Don\'t break the streak.',
      'Şansı bıyıklarımla duyuyorum. Bozma.',
    ),
    L(
      'Эй, хозяин. Руки золотые. Почти.',
      'Hey, owner. Golden hands. Almost.',
      'Hey, ev sahibi. Altın eller. Neredeyse.',
    ),
    L(
      'Ещё пять — и я разрешу подремать.',
      'Five more — and I\'ll allow a nap.',
      'Beş daha — sonra şekerleme izni.',
    ),
  ],

  idle_nudge: [
    L(
      'Эй… книга сама не откроется.',
      'Hey… the book won\'t open itself.',
      'Hey… kitap kendi kendine açılmaz.',
    ),
    L(
      'Скучно. Кликни. Или сундук.',
      'Bored. Click. Or the chest.',
      'Sıkıldım. Tıkla. Ya da sandık.',
    ),
    L(
      'Я тут один. Ну, почти.',
      'I\'m here alone. Well, almost.',
      'Burada yalnızım. Neredeyse.',
    ),
    L(
      'Кто-то шуршит… или это хвост?',
      'Someone\'s rustling… or is it the tail?',
      'Biri hışırdıyor… yoksa kuyruk mu?',
    ),
    L(
      'Ты ещё тут? Я уже почти спал.',
      'You still here? I was almost asleep.',
      'Hâlâ buradasın? Neredeyse uyuyordum.',
    ),
    L(
      'Эй. Не жадничай тишиной.',
      'Hey. Don\'t hog the silence.',
      'Hey. Sessizliği saklama.',
    ),
    L(
      'Печка тёплая. А ты холодный. Кликни.',
      'The stove is warm. You\'re cold. Click.',
      'Soba sıcak. Sen soğuksun. Tıkla.',
    ),
  ],

  afraid_night: [
    L(
      'Там… за окном кто-то большой. Не смотри. Я тоже не буду.',
      'There… someone big is outside. Don\'t look. I won\'t either.',
      'Orada… pencerede büyük biri var. Bakma. Ben de bakmam.',
    ),
    L(
      'Жирдяй? Нет-нет. Ветер. Толстый такой ветер.',
      'ZhirDyay? No-no. Just wind. A fat kind of wind.',
      'JirDyay mı? Yok yok. Rüzgar. Şişman bir rüzgar.',
    ),
    L(
      'Держи меня за лапу. Ну кликни хотя бы.',
      'Hold my paw. Well, at least click.',
      'Pençemi tut. En azından tıkla.',
    ),
    L(
      'Ночь длинная. Гони его — я из-под лавки подстрахую.',
      'Long night. Chase him off — I\'ll cover from under the bench.',
      'Gece uzun. Kov onu — ben sedirin altından desteklerim.',
    ),
    L(
      'В смысле «посмотри в окно»? Сам смотри!',
      'Look out the window? You look!',
      'Pencereye bak mı? Sen bak!',
    ),
    L(
      'Шерсть дыбом. Это не от сквозняка.',
      'Fur standing up. That\'s not a draft.',
      'Tüyler diken diken. Bu cereyan değil.',
    ),
  ],

  hint_quest: [
    L(
      'В книге кто-то ждёт. «В путь» — не я придумал.',
      'Someone\'s waiting in the book. «On the way» — not my idea.',
      'Kitapta biri bekliyor. «Yola çık» — ben uydurmadım.',
    ),
    L(
      'Следующий дух не кусается. Почти.',
      'The next spirit doesn\'t bite. Almost.',
      'Sıradaki ruh ısırmaz. Neredeyse.',
    ),
    L(
      'Книга открыта. Квест сам себя не пройдёт.',
      'The book is open. The quest won\'t finish itself.',
      'Kitap açık. Görev kendi kendine bitmez.',
    ),
    L(
      'Домовой бы одобрил. Следующий — твой.',
      'The Domovoy would approve. Next one\'s yours.',
      'Domovoy onaylardı. Sıradaki senin.',
    ),
    L(
      'Эй. Бестиарий без тебя не толстеет.',
      'Hey. The bestiary won\'t grow without you.',
      'Hey. Bestiary sensiz şişmez.',
    ),
  ],

  chest_ready: [
    L(
      'Сундук стучит. Пока тебя не было — удача копилась.',
      'The chest is knocking. While you were away — luck built up.',
      'Sandık tıklıyor. Yokken şans birikti.',
    ),
    L(
      'Слышишь? Сундук готов. Не заставляй ждать.',
      'Hear that? The chest is ready. Don\'t keep it waiting.',
      'Duyuyor musun? Sandık hazır. Bekletme.',
    ),
    L(
      'Сундук уже стучится. Открой, пока Суседко не услышал.',
      'The chest is already knocking. Open it before Susedko hears.',
      'Sandık çoktan vuruyor. Susedko duymadan aç.',
    ),
  ],

  susedko_steal: [
    L(
      'Кажется, кто-то шуршит под половицами…',
      'Someone seems to be rustling under the floorboards…',
      'Galiba biri döşemelerin altında hışırdıyor…',
    ),
  ],

  after_win: [
    L(
      'Мур! Ещё один в книге. Горжусь.',
      'Purr! Another one in the book. Proud of you.',
      'Mır! Kitapta bir tane daha. Gurur duyuyorum.',
    ),
    L(
      'Победа! Теперь можно сундук подкрутить.',
      'Victory! Now we can nudge the chest.',
      'Zafer! Şimdi sandığa bakabiliriz.',
    ),
    L(
      'Усы торчком — это тебе комплимент.',
      'Whiskers up — that\'s a compliment to you.',
      'Bıyıklar dik — bu sana iltifat.',
    ),
    L(
      'Отлично! Я бы сам ответил, но лапы заняты.',
      'Great! I\'d answer myself, but paws are busy.',
      'Harika! Kendim cevaplarım ama pençeler meşgul.',
    ),
    L(
      'Эй, не зазнавайся. Ладно, зазнавайся чуть-чуть.',
      'Hey, don\'t get cocky. Fine, get a little cocky.',
      'Hey, şımarma. Tamam, biraz şımar.',
    ),
    L(
      'Сказ будет. Потом. Сейчас — сметана.',
      'There\'ll be a tale. Later. Sour cream first.',
      'Masal olacak. Sonra. Şimdi kaymak.',
    ),
  ],

  after_lose: [
    L(
      'Ничего. Оберег сработал — ещё раз.',
      'It\'s fine. The charm worked — one more try.',
      'Sorun değil. Tılsım tuttu — bir kez daha.',
    ),
    L(
      'Духи капризные. Я тоже с первого не всё знаю.',
      'Spirits are fussy. I don\'t know everything first try either.',
      'Ruhlar nazlı. Ben de ilk seferde her şeyi bilmiyorum.',
    ),
    L(
      'Не сдавайся. Сметана потом поможет.',
      'Don\'t give up. Sour cream will help later.',
      'Pes etme. Kaymak sonra yardım eder.',
    ),
    L(
      'Эй. Это не конец. Это… пауза на усы.',
      'Hey. This isn\'t the end. It\'s… a whisker break.',
      'Hey. Bu son değil. Bu… bıyık molası.',
    ),
    L(
      'Ладно. Передохни. Я хвостом прикрою.',
      'Alright. Rest. I\'ll cover with my tail.',
      'Tamam. Dinlen. Kuyruğumla kapatırım.',
    ),
  ],

  miracle_chest_event: [
    L(
      'Сундук чудес снова стучит. Первый раз на неделе — даром.',
      'The miracle chest knocks again. First time this week — free.',
      'Mucize sandığı yine tıklıyor. Bu hafta ilk — bedava.',
    ),
  ],

  miracle_chest_progress: L(
    'До чуда: {progress} из {total}. Или… Домовой знает короткий путь.',
    'Until miracle: {progress} of {total}. Or… the Domovoy knows a shortcut.',
    'Mucizeye: {progress} / {total}. Ya da… Domovoy kısayolu bilir.',
  ),

  fragment_drop: [
    L(
      'Осколок Эпохи. Кощей уже нервничает.',
      'A shard of the Age. Koschei is nervous already.',
      'Çağdan bir parça. Koşçey şimdiden gergin.',
    ),
  ],

  miracle_consolation: [
    L(
      'Не осколок. Зато изба сегодня добрее.',
      'Not a shard. But the hut is kinder today.',
      'Parça değil. Ama kulübe bugün daha iyi.',
    ),
  ],

  fragment_hint: [
    L(
      'Ещё осколок — и Кощей откроется. Если снова смерть не спрячет.',
      'One more shard — and Koschei unlocks. If he doesn\'t hide his death again.',
      'Bir parça daha — Koşçey açılır. Ölümünü yine saklamazsa.',
    ),
  ],

  daily_find: [
    L(
      'Я тут кое-что припрятал. Не спрашивай что.',
      'I hid something here. Don\'t ask what.',
      'Buraya bir şey sakladım. Ne olduğunu sorma.',
    ),
  ],

  folktale_intro: [
    L(
      'Предки у печки так рассказывали. Я только про веник добавил.',
      'Ancestors told it by the stove. I only added the broom.',
      'Atalar sobada böyle anlatırdı. Ben sadece fırçayı ekledim.',
    ),
  ],
} as const;

/** Реплики на клик по предметам избы (plan §3.2). */
export const izbaItemDialogBanks = {
  stove: [
    L('Туда лезь сам. Я уже обжёг ус.', 'You climb in yourself. I burned my whiskers already.', 'Sen gir. Ben bıyıklarımı çoktan yaktım.'),
    L('Печка горячая. Усы — нет.', 'Stove\'s hot. Whiskers — nope.', 'Soba sıcak. Bıyıklar — hayır.'),
    L('Домовой там сидит. Не мешай.', 'Domovoy sits there. Don\'t bother him.', 'Domovoy orada oturuyor. Rahatsız etme.'),
  ],
  bench: [
    L('Садись. Суседко всё равно под половицу залезет.', 'Sit down. Susedko will crawl under the floor anyway.', 'Otur. Susedko yine döşemenin altına girer.'),
    L('Лавка крепкая. Не как мои обещания.', 'Bench is solid. Unlike my promises.', 'Sedir sağlam. Sözlerim gibi değil.'),
    L('Тут я дремал. Почти.', 'I napped here. Almost.', 'Burada uyukladım. Neredeyse.'),
  ],
  window: [
    L('В лесу сегодня тихо. Подозрительно тихо.', 'The forest is quiet today. Suspiciously quiet.', 'Ormanda bugün sessiz. Şüpheli sessiz.'),
    L('Не смотри долго — лес смотрит в ответ.', 'Don\'t stare — the forest stares back.', 'Uzun bakma — orman da bakıyor.'),
    L('За окном ветер. Или кто-то большой дышит.', 'Wind outside. Or someone big breathing.', 'Dışarıda rüzgar. Ya da büyük biri nefes alıyor.'),
  ],
} as const;

export const zhirdyayWinLine = L(
  'Мы справились! Я… почти не прятался под лавкой.',
  'We did it! I… hardly hid under the bench at all.',
  'Başardık! Ben… neredeyse hiç sedirin altına saklanmadım.',
);

export const susedkoDialogContent = {
  catWarning: L(
    'Кажется, кто-то шуршит под половицами…',
    'Someone seems to be rustling under the floorboards…',
    'Galiba biri döşemelerin altında hışırdıyor…',
  ),

  taunts: [
    L('Эй! Не жадничай!', 'Hey! Don\'t be greedy!', 'Hey! Açgözlü olma!'),
    L('Не догонишь! У тебя лапы короткие.', 'You won\'t catch me! Your paws are too short.', 'Yetişemezsin! Pençelerin kısa.'),
    L('Шшш… это кот спит, а я работаю!', 'Shhh… the cat sleeps, I work!', 'Şşş… kedi uyuyor, ben çalışıyorum!'),
    L('Уши слышат каждую монетку. Особенно твою.', 'Ears hear every coin. Especially yours.', 'Kulaklar her jeti duyar. Özellikle seninkini.'),
    L('А ну прекрати! Щекотно же!', 'Stop it! That tickles!', 'Kes şunu! Gıdıklanıyorum!'),
    L('Клик-клик! А я всё равно быстрее!', 'Click-click! I\'m still faster!', 'Tık-tık! Yine de ben daha hızlıyım!'),
    L('Барабашка не шутит — Барабашка берёт!', 'Barabashka doesn\'t joke — Barabashka takes!', 'Barabaşka şaka yapmaz — alır!'),
    L('Твои монетки такие блестящие… жаль, мои!', 'Your coins are so shiny… pity they\'re mine!', 'Jetlerin çok parlak… yazık ki benim!'),
    L('Я же сосед! Сосед имеет право на удачу!', 'I\'m the neighbor! Neighbors deserve luck!', 'Ben komşuyum! Komşunun şans hakkı var!'),
    L('Ещё кликнешь — расскажу Домовому про твои носки!', 'One more click — I\'ll tell the Domovoy about your socks!', 'Bir tık daha — çoraplarını Domovoy\'a söylerim!'),
    L('В смысле? Ты же спал!', 'Wait, what? You were asleep!', 'Ne demek? Sen uyuyordun!'),
    L('Сундук ждёт, а кот храпит — идеальный план!', 'Chest waits, cat snores — perfect plan!', 'Sandık bekliyor, kedi horluyor — mükemmel plan!'),
    L('Носки потом! Сначала монетки!', 'Socks later! Coins first!', 'Çorap sonra! Önce jetler!'),
    L('Эй, это моя щель! Мои правила!', 'Hey, this is my crack! My rules!', 'Hey, bu benim yarık! Benim kurallarım!'),
    L('Тише! Разбудишь Домового — нам обоим влетит!', 'Quiet! Wake the Domovoy — we both get it!', 'Sessiz! Domovoy uyanırsa ikimize de fırça!'),
    L('В смысле «верни»? Я сосед, не грабитель!', 'Give it back? I\'m a neighbor, not a robber!', 'Geri mi vereyim? Komşuyum, hırsız değil!'),
  ] satisfies LocalizedLines,

  fleeLine: L(
    'Ладно-ладно, ухожу! Но я ещё вернусь…',
    'Okay-okay, I\'m leaving! But I\'ll be back…',
    'Tamam-tamam, gidiyorum! Ama dönerim…',
  ),
};

export const settingsUiContent = {
  language: L('Язык', 'Language', 'Dil'),
  clickCat: L('Кликнуть кота', 'Click the cat', 'Kediye tıkla'),
  catClicks: L('Кликов по коту', 'Cat clicks', 'Kedi tıklamaları'),
  energy: L('Энергия', 'Energy', 'Enerji'),
  footnoteHint: L(
    'Каждый 5-й клик — сноска над головой',
    'Every 5th click — footnote above the head',
    'Her 5. tıkta — başın üstünde not',
  ),
  testMode: L('Тестовый режим', 'Test mode', 'Test modu'),
  scaffoldHint: L(
    'Каркас Epic 0 — полная сцена в следующих эпиках.',
    'Epic 0 scaffold — full scene in later epics.',
    'Epic 0 iskeleti — tam sahne sonraki epiklerde.',
  ),
  title: L(
    'Книга славянских духов',
    'Book of Slavic Spirits',
    'Slav Ruhları Kitabı',
  ),
  catName: L('Кот', 'Cat', 'Kedi'),
  dialogNext: L('Далее', 'Next', 'İleri'),
  dialogClose: L('Закрыть', 'Close', 'Kapat'),
  bookTitle: L(
    'Тайны славянских духов',
    'Secrets of Slavic Spirits',
    'Slav Ruhlarının Sırları',
  ),
  bookStubHint: L(
    'Домовой ждёт в книге. Полный бестиарий — в следующем эпике.',
    'The Domovoy awaits in the book. Full bestiary — coming next.',
    'Domovoy kitapta bekliyor. Tam bestiary — sonraki epikte.',
  ),
  bookRewardLabel: L('Награда:', 'Reward:', 'Ödül:'),
  bookGoQuest: L('В путь', 'On the way', 'Yola çık'),
  bookGoFolktale: L('Сказка', 'Folktale', 'Masal'),
  bookBackToSpirit: L('К духу', 'Back to spirit', 'Ruha dön'),
  bookDefeated: L('Побеждён', 'Defeated', 'Yenildi'),
  bookLocked: L('Неактивен', 'Locked', 'Kilitli'),
  bookMiniTale: L('Сказ о победе', 'Victory tale', 'Zafer hikayesi'),
  bookNextQuest: L('Текущий квест', 'Next quest', 'Sonraki görev'),
  bookPrevPage: L('Предыдущая страница', 'Previous page', 'Önceki sayfa'),
  bookNextPage: L('Следующая страница', 'Next page', 'Sonraki sayfa'),
  bookSpiritsCount: L('духов', 'spirits', 'ruh'),
  gradeCommon: L('Обычный', 'Common', 'Yaygın'),
  gradeRare: L('Редкий', 'Rare', 'Nadir'),
  gradeEpic: L('Эпик', 'Epic', 'Epik'),
  gradeEpoch: L('Эпоха чудес', 'Age of Miracles', 'Mucizeler Çağı'),
  quizQuestionOf: L('Вопрос', 'Question', 'Soru'),
  quizOf: L('из', 'of', '/'),
  quizWrongObereg: L(
    'Неверно. Сработал тайный оберег',
    'Wrong. A secret charm saved you',
    'Yanlış. Gizli tılsım korudu',
  ),
  quizVictory: L('Победа!', 'Victory!', 'Zafer!'),
  quizClaimReward: L('Забрать награду', 'Claim reward', 'Ödülü al'),
  quizToIzba: L('В избу', 'Back to hut', 'Kulübeye'),
  quizExit: L('Выход', 'Exit', 'Çık'),
  chestLootTitle: L('Сундук открыт!', 'Chest opened!', 'Sandık açıldı!'),
  chestLootTake: L('Забрать', 'Take', 'Al'),
  chestCooldown: L('Следующий сундук через', 'Next chest in', 'Sonraki sandık'),
  chestHurryLuck: L(
    'Домовой шепчет: поторопи удачу (−30 мин)',
    'Domovoy whispers: hurry luck (−30 min)',
    'Domovoy fısıldıyor: şansı acele ettir (−30 dk)',
  ),
  chestRewardCatSkin: L('Скин кота', 'Cat skin', 'Kedi skini'),
  chestRewardBrownieSkin: L('Скин домового', 'Domovoy skin', 'Domovoy skini'),
  chestRewardIzbaSkin: L('Скин избы', 'Hut skin', 'Kulübe skini'),
  chestRewardWindowSkin: L('Вид из окна', 'Window view', 'Pencere manzarası'),
  chestRewardTitle: L('Титул', 'Title', 'Unvan'),
  chestRewardSpiritKey: L('Ключ к духу', 'Spirit key', 'Ruha anahtar'),
  chestRewardEnergy: L('+{amount} энергии', '+{amount} energy', '+{amount} enerji'),
  chestRewardObereg: L('Тайный оберег', 'Secret charm', 'Gizli tılsım'),
  chestRewardFragment: L('Фрагмент', 'Fragment', 'Parça'),
  chestRewardOberegX2: L('Тайные обереги ×2', 'Secret charms ×2', 'Gizli tılsım ×2'),
  chestDuplicate: L('Дубликат', 'Duplicate', 'Kopya'),
  miracleLootTitle: L('Сундук чудес!', 'Miracle chest!', 'Mucize sandığı!'),
  miracleLootTake: L('Забрать', 'Take', 'Al'),
  bookFragmentProgress: L(
    'Собрано {current} / {total}',
    'Collected {current} / {total}',
    'Toplandı {current} / {total}',
  ),
  bookSelectFragment: L(
    'Собирать осколки для этого духа',
    'Collect shards for this spirit',
    'Bu ruh için parça topla',
  ),
  bookFragmentSelected: L('Цель осколков', 'Shard target', 'Parça hedefi'),
  hudMiracleProgress: L(
    'До чуда: {progress} / {total}',
    'Until miracle: {progress} / {total}',
    'Mucizeye: {progress} / {total}',
  ),
  profileHeading: L('Профиль', 'Profile', 'Profil'),
  profileClose: L('Закрыть профиль', 'Close profile', 'Profili kapat'),
  profileEquip: L('Выбрать', 'Equip', 'Seç'),
  profileEquipped: L('Выбрано', 'Equipped', 'Seçili'),
  profileLocked: L('Ещё не получено', 'Not owned yet', 'Henüz yok'),
  profileTabCat: L('Кот', 'Cat', 'Kedi'),
  profileTabIzba: L('Изба', 'Hut', 'Kulübe'),
  profileTabWindow: L('Лес', 'Forest', 'Orman'),
  profileTabBrownie: L('Домовой', 'Domovoy', 'Domovoy'),
  profileTabTitles: L('Титулы', 'Titles', 'Unvanlar'),
  profileTabSettings: L('Настройки', 'Settings', 'Ayarlar'),
  energyRewardTitle: L('Нет энергии', 'Out of energy', 'Enerji bitti'),
  energyRewardText: L(
    'Посмотри короткую рекламу и получи +50 энергии.',
    'Watch a short ad to get +50 energy.',
    'Kısa bir reklam izle ve +50 enerji kazan.',
  ),
  energyRewardWatch: L(
    'Смотреть рекламу (+50)',
    'Watch ad (+50)',
    'Reklam izle (+50)',
  ),
  energyRewardClose: L('Не сейчас', 'Not now', 'Şimdi değil'),
  settingsCloudHint: L(
    'Прогресс сохраняется на серверах Яндекс.Игр при входе в аккаунт.',
    'Progress is saved to Yandex Games cloud when you sign in.',
    'Giriş yaptığında ilerleme Yandex Oyunlar bulutuna kaydedilir.',
  ),
  trophyNotMet: L('Ещё не встречен', 'Not met yet', 'Henüz tanışılmadı'),
  settingsHeading: L('Настройки', 'Settings', 'Ayarlar'),
  settingsYandexLogin: L(
    'Войти через Яндекс',
    'Sign in with Yandex',
    'Yandex ile giriş',
  ),
  settingsYandexOk: L('В облаке', 'Saved to cloud', 'Bulutta'),
  settingsReset: L('Сбросить прогресс', 'Reset progress', 'İlerlemeyi sıfırla'),
  settingsResetConfirm: L(
    'Точно сбросить весь прогресс? Это нельзя отменить.',
    'Reset all progress? This cannot be undone.',
    'Tüm ilerleme sıfırlansın mı? Geri alınamaz.',
  ),
  settingsResetCancel: L('Отмена', 'Cancel', 'İptal'),
  settingsResetOk: L('Сбросить', 'Reset', 'Sıfırla'),
  cloudBannerText: L(
    'Сохраним тайны в облаке?',
    'Save our secrets to the cloud?',
    'Sırları buluta kaydedelim mi?',
  ),
  cloudBannerSave: L(
    'Сохранить в облако',
    'Save to cloud',
    'Buluta kaydet',
  ),
  cloudBannerDismiss: L('Не сейчас', 'Not now', 'Şimdi değil'),
} as const;

/** Подписи грейдов в бестиарии (profile_layout.md §4). */
export const gradeLabels: Record<Grade, LocalizedText> = {
  common: settingsUiContent.gradeCommon,
  rare: settingsUiContent.gradeRare,
  epic: settingsUiContent.gradeEpic,
  epoch: settingsUiContent.gradeEpoch,
};

export type CatDialogBankKey = keyof typeof catDialogBanksContent;
