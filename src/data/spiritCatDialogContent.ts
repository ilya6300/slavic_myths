/**
 * Крючки квестов, проигрыш и подсказки locked — cat_dialogs.md §3–5.
 * Локализованные реплики кота по духам.
 */

import type { SpiritId } from '../config/assetRegistry';
import type { LocalizedText } from '../i18n/types';

const L = (ru: string, en: string, tr: string): LocalizedText => ({ ru, en, tr });

export interface SpiritCatDialogEntry {
  questHook: LocalizedText;
  loseLine: LocalizedText;
  lockedHint: LocalizedText;
}

export const spiritCatDialogContent: Record<SpiritId, SpiritCatDialogEntry> = {
  brownie: {
    questHook: L(
      'Начни с Домового. Без него в избе бардак — а с ним хоть порядок держится.',
      'Start with the Domovoy. Without him the hut is chaos.',
      'Domovoy ile başla. Onsuz kulübede kaos.',
    ),
    loseLine: L(
      'Ох уж эти домашние хранители. Лапу сломишь, пока поймёшь, чем их порадовать. Давай наберёмся сил и зайдём снова.',
      'Oh, these spirits. You\'ll break a paw before you get what they want.',
      'Ah şu ruhlar. Ne istediklerini anlayana kadar pençeni kırarsın.',
    ),
    lockedHint: L('', '', ''),
  },
  susedko: {
    questHook: L(
      'Слышишь шуршание под половицами? Это Суседко разыгрался. Сундук точно у него под полом.',
      'Hear the rustling? That\'s him. The chest — he has it.',
      'Hışırtıyı duyuyor musun? O. Sandık — onda.',
    ),
    loseLine: L(
      'Юркнул под половицу, только хвост мелькнул! И сундук пока не отдаёт. Ничего, усы расправим и ещё разок покараулим.',
      'He fled. No chest. Where do I keep mice now?',
      'Kaçtı. Sandık yok. Fareleri nerede saklayacağım?',
    ),
    lockedHint: L(
      'Сначала Домовой. Без него сосед не вылезет.',
      'Domovoy first. Without him the neighbor won\'t come out.',
      'Önce Domovoy. Onsuz komşu çıkmaz.',
    ),
  },
  bannik: {
    questHook: L(
      'В бане хозяин строгий. Пар уважает порядок, а торопливых здесь не жалуют.',
      'Smells like steam. The Bannik likes order and respect — don\'t play hero.',
      'Buhar kokuyor. Bannik düzen ve saygı sever — kahramanlık oynama.',
    ),
    loseLine: L(
      'Не угодили мы банному духу. Теперь паримся… оттого, что толком не попарились!',
      'We didn\'t please him. Now we steam… without steaming.',
      'Hoşnut etmedik. Şimdi buharlanıyoruz… buharlanmadan.',
    ),
    lockedHint: L(
      'Сначала Суседко. Банник пар даром не даёт.',
      'Susedko first. The Bannik doesn\'t steam for free.',
      'Önce Susedko. Bannik bedava buhar vermez.',
    ),
  },
  kikimora: {
    questHook: L(
      'Слышишь шорох в тёмном углу за прялкой? Кикимора следит за хозяйством по-своему — не разбрасывай шерсть.',
      'Threads in a knot, socks gone. She hints: broom in your paws.',
      'İpler düğüm, çoraplar yok. İpucu: süpürge pençene.',
    ),
    loseLine: L(
      'Шмыгнула за печку, только клубок покатился! Ловкая какая. Давай передахнём немного, ты пока наведёшь порядок и мы попробуем снова.',
      'She raced to the swamp. Dishes? Shards over there. Mice alive — good enough.',
      'Bataklığa uçtu. Tabaklar? Parçalar orada. Fareler sağ — yeter.',
    ),
    lockedHint: L(
      'Сначала Банник. Кикимора любит чистые лапы.',
      'Bannik first. Kikimora likes clean paws.',
      'Önce Bannik. Kikimora temiz pençeleri sever.',
    ),
  },
  poludnik: {
    questHook: L(
      'Зной над нивой дрожит. Полевой следит за каждым колосом — уважай межу и не мни посевы.',
      'Laughter beyond the field. Don\'t trample — ask.',
      'Tarlanın ötesinde kıkırdama. Çiğneme — sor.',
    ),
    loseLine: L(
      'Закружил нас ветерок в густой ржи, сбились с тропки! Отряхнём колосья с шерсти и попробуем снова.',
      'Across the fields, the cat runs from the Field Spirit!',
      'Tarlaya tarlaya, kedi tarla ruhundan kaçıyor!',
    ),
    lockedHint: L(
      'Сначала Кикимора. Полевой без порядка в избе не выйдет.',
      'Kikimora first. The Field Spirit won\'t come without order in the hut.',
      'Önce Kikimora. Tarla ruhu düzensiz kulübeden çıkmaz.',
    ),
  },
  ovinnik: {
    questHook: L(
      'Пахнет сухим зерном и прогретым деревом. Овинник бережёт хлеб от огня и сырости — заходи с почтением.',
      'Smells of grain. The Ovinnik hates damp. And slobs.',
      'Tahıl kokuyor. Ovinnik nemi sevmez. Ve dağınıklığı.',
    ),
    loseLine: L(
      'Тихо, слышишь, сзади кто-то шуршит? А, это мой хвост. Всё, больше не отвлекаюсь, а то опять без меня проиграешь... ',
      'Hide and seek! Quiet, rustle behind… oh, that\'s my tail.',
      'Saklambaç! Sessiz, arkada hışırtı… ah, kuyruğum.',
    ),
    lockedHint: L(
      'Сначала Полевой. Овинник зерно зря не отдаст.',
      'Field Spirit first. Ovinnik won\'t give grain for nothing.',
      'Önce Tarla ruhu. Ovinnik tahılı boşa vermez.',
    ),
  },
  leshiy: {
    questHook: L(
      'В лесу ты в гостях. Леший ведает всеми тропами и шума не любит — не свисти в чаще.',
      'Paths are tangled. The Leshy is near. Don\'t whistle.',
      'Patikalar karıştı. Leşy yakında. Islık çalma.',
    ),
    loseLine: L(
      'Увёл Леший тропку в густой малинник! Кругами ходим, сосны верхушками качают. Переведём дух и спросим дорогу с почтением.',
      'Led us into the thicket. Start over. Wait, how do we get back to the hut? Hm...',
      'Bizi çalılığa çekti. Baştan. Peki kulübeye nasıl döneriz? Hm...',
    ),
    lockedHint: L(
      'Сначала Овинник. Леший тропу без очереди не даст.',
      'Ovinnik first. The Leshy won\'t show the path out of turn.',
      'Önce Ovinnik. Leşy sıra beklemeden yol vermez.',
    ),
  },
  vodyanoy: {
    questHook: L(
      'Омут глубок, вода темна. Водяной бережёт речные тайны и чистую гладь — ступай у берега осторожно.',
      'Dark pool. He likes respect — not splashing.',
      'Karanlık göl. Saygı sever — sıçratma değil.',
    ),
    loseLine: L(
      'Брызнул Водяной прохладной волной, намочил мой пушистый хвост! Сам сухой остался, а мне сушиться на печке. Попробуем снова.',
      'To the bottom? Figuratively. Wet me — literally.',
      'Dibe mi? Mecazi. Islak ben — gerçek.',
    ),
    lockedHint: L(
      'Сначала Леший. Водяной без леса не зовёт.',
      'Leshy first. The Vodyanoy won\'t call without the forest.',
      'Önce Leşy. Vodyanoy ormansız çağırmaz.',
    ),
  },
  dedushka_toptygin: {
    questHook: L(
      'В малиннике раздаётся тяжёлая спокойная поступь. Дедушка Топтыгин ценит мирный лесной покой — ступай без озорства.',
      'Heavy footsteps. Honey and silence. Don\'t tease.',
      'Ağır adımlar. Bal ve sessizlik. Kışkırtma.',
    ),
    loseLine: L(
      'Хрустнул сучок под лапой — и дедушка недовольно ушёл вглубь малинника. Надо бы вести себя потише. Давай попробуем снова.',
      'Was that a bear? When does he hibernate? Maybe we wait?',
      'Bu ayı mıydı? Ne zaman kış uykusuna yatar? Bekleyelim mi?',
    ),
    lockedHint: L(
      'Ключ из сундука. Топтыгин сам не придёт.',
      'Key from the chest. Toptygin won\'t come on his own.',
      'Sandıktan anahtar. Toptygin kendi gelmez.',
    ),
  },
  poludnica: {
    questHook: L(
      'Солнце в самом зените, воздух звенит от зноя. Полудница учит беречь силы — уходи в тень.',
      'Noon burns. She teaches: don\'t torture yourself in the heat.',
      'Öğle kavuruyor. Öğretir: sıcakta kendini yorma.',
    ),
    loseLine: L(
      'Ой, голову припекло на солнце, в глазах золотые круги пошли! Отдохнём в холодке под берёзой и попробуем снова.',
      'She spun our heads. Tails tucked — why so hot? Wait, where\'s Poludnitsa?',
      'Kafamızı döndürdü. Kuyrukları kıvırdık — neden bu kadar sıcak? Poludnitsa nerede?',
    ),
    lockedHint: L(
      'Ключ из сундука. Редкий. Полудница не любит спешку.',
      'Key from the chest. Rare. Poludnitsa hates rush.',
      'Sandıktan anahtar. Nadir. Poludnitsa aceleyi sevmez.',
    ),
  },
  rusalka: {
    questHook: L(
      'У речной заводи шелестит ива. Русалка поёт на ветвях — любуйся с бережка и в омут не лезь.',
      'By the river backwater the willow rustles. Rusalka sings on the branches — admire from the shore and don\'t dive in.',
      'Nehir koyunda söğüt hışırdar. Rusalka dallarda şarkı söyler — kıyıdan bak ve göle atlama.',
    ),
    loseLine: L(
      'Засмотрелся я на белую рубаху среди берёзовых веток, оступился на мокром камушке и бултых в осоку! Обсохну малость и вернусь.',
      'I stared at the white shirt among birch branches, slipped on a wet stone and splashed into the reeds! I\'ll dry off a bit and come back.',
      'Beyaz gömleğe bakarken kaydım, ıslak taşa takılıp sazlığa düştüm! Biraz kurulanıp geri gelirim.',
    ),
    lockedHint: L(
      'Ключ из сундука. Эпик. Русалка сама не поётся.',
      'Key from the chest. Epic. Rusalka won\'t sing herself.',
      'Sandıktan anahtar. Epik. Rusalka kendiliğinden şarkı söylemez.',
    ),
  },
  lada: {
    questHook: L(
      'В избе становится тепло и светло на душе. Лада несёт согласие и лад — береги мир в доме.',
      'Feel how warm and cozy it got? Lada is about harmony, not a pile of coins.',
      'Ne kadar sıcak ve rahat oldu hissediyor musun? Lada uyum içindir, jet yığını değil.',
    ),
    loseLine: L(
      'Разволновался я, задел хвостом глиняную кружку — упала и разбилась. В суете лада не поймаешь. Успокоимся и попробуем снова.',
      'Stop staring. You won\'t catch harmony like that.',
      'Bakmayı kes. Uyumu böyle yakalayamazsın.',
    ),
    lockedHint: L(
      '3 осколка. Лада без лада не придёт.',
      '3 shards. Lada won\'t come without harmony.',
      '3 parça. Uyum olmadan Lada gelmez.',
    ),
  },
  veles: {
    questHook: L(
      'Бор притих, на мшистых тропах чудится рогатый знак. Велес ведает земной мудростью и скотьим миром.',
      'The forest went quiet. Veles likes wit — not empty noise.',
      'Orman sustu. Veles zekâ sever — boş gürültü değil.',
    ),
    loseLine: L(
      'Ух, закружились лесные тени, сосны покачали верхушками — не дослушали мы мудрый завет. Наберёмся терпения и спросим вновь.',
      'Back to the hut. The beasts are laughing at us already.',
      'Kulübeye. Hayvanlar çoktan gülüyor.',
    ),
    lockedHint: L(
      '6 осколков. Велес терпелив. Ты — нет.',
      '4 shards. Veles is patient. You — aren\'t.',
      '4 parça. Veles sabırlı. Sen — değilsin.',
    ),
  },
  baba_yaga: {
    questHook: L(
      'На границе чащи стоит избушка на курьих ножках. Знаешь верное слово — откроется путь, а полезешь напролом — останешься ни с чем.',
      'Hut on chicken legs. Say it right — and don\'t climb in the mortar.',
      'Tavuk ayaklı kulübe. Doğru söyle — ve havanın içine girme.',
    ),
    loseLine: L(
      'Ох, заскрипела избушка, повернулась к лесу передом, а нас крыльцом отмахнула! Надо слово верное вспомнить. Давай ещё разок постучимся.',
      'At least she didn\'t eat us. We\'ll visit when she\'s less hungry.',
      'En azından yemedi. İştahı azalınca geliriz.',
    ),
    lockedHint: L(
      '3 осколка. Яга уже ступу греет.',
      '3 shards. Yaga is already warming the mortar.',
      '3 parça. Yaga havanı ısıtıyor bile.',
    ),
  },
  koschei_immortal: {
    questHook: L(
      'В хрустальном тереме за семью печатями хранится тайна силы. Кощей уважает холодный ум — не поддавайся жадности.',
      'Death is hidden. He likes cunning — not greed.',
      'Ölüm saklı. Kurnazlık sever — açgözlülük değil.',
    ),
    loseLine: L(
      'Потянулись за лишним сундуком — и замок защёлкнулся! Кощей усмехнулся в сухие усы. Переведём дух и пойдём дорогой разума.',
      'He\'s immortal. You aren\'t. Go before the needle finds your tail.',
      'O ölümsüz. Sen değilsin. İğne kuyruğa değmeden gidelim.',
    ),
    lockedHint: L(
      '5 осколков. Смерть прячет — ты ищи.',
      '6 shards. He hides death — you search.',
      '6 parça. Ölümü saklar — sen ara.',
    ),
  },
  chudo_yudo: {
    questHook: L(
      'У Калинова моста через огненную реку высится многоголовый исполин. Это древний страж рубежа — держи ответ без страха.',
      'Many heads — many questions. A guardian, not just a monster.',
      'Çok kafa — çok soru. Bu bir bekçi, sadece canavar değil.',
    ),
    loseLine: L(
      'Качнуло Чудо-Юдо мост, взметнулась речная волна — и мы отступили на бережок! Ничего, дух переведём, слова обдумаем и вернёмся.',
      'A miracle we weren\'t swallowed by miracle.',
      'Mucize bizi mucize yutmadı.',
    ),
    lockedHint: L(
      '6 осколков. Финал. Чудо-Юдо ждёт героя.',
      '6 shards. The finale. Chudo-Yudo awaits a hero.',
      '6 parça. Final. Çudo-Yudo kahraman bekliyor.',
    ),
  },
};
