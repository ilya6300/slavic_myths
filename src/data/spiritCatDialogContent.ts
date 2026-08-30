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
      'Начни с Домового. Без него в избе бардак.',
      'Start with the Domovoy. Without him the hut is chaos.',
      'Domovoy ile başla. Onsuz kulübede kaos.',
    ),
    loseLine: L(
      'Ох уж эти духи. Лапу сломишь, пока поймёшь, чего им надо.',
      'Oh, these spirits. You\'ll break a paw before you get what they want.',
      'Ah şu ruhlar. Ne istediklerini anlayana kadar pençeni kırarsın.',
    ),
    lockedHint: L('', '', ''),
  },
  susedko: {
    questHook: L(
      'Слышишь шуршание? Это он. Сундук — у него.',
      'Hear the rustling? That\'s him. The chest — he has it.',
      'Hışırtıyı duyuyor musun? O. Sandık — onda.',
    ),
    loseLine: L(
      'Сбежал. Сундука нет. Где мне теперь мышей хранить?',
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
      'Пахнет парком. Банник ждёт поклон — не героя.',
      'Smells like steam. The Bannik wants respect — not a hero.',
      'Buhar kokuyor. Bannik kahraman değil, saygı bekliyor.',
    ),
    loseLine: L(
      'Не угодили. Теперь паримся… что не попарились.',
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
      'Нитки в узел, носки пропали. Она намекает: метлу в лапы.',
      'Threads in a knot, socks gone. She hints: broom in your paws.',
      'İpler düğüm, çoraplar yok. İpucu: süpürge pençene.',
    ),
    loseLine: L(
      'Умчалась в болото. Посуда? Вон осколки. Мыши живы — уже хорошо.',
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
      'За межой хихикают. Не топчи — спроси.',
      'Laughter beyond the field. Don\'t trample — ask.',
      'Tarlanın ötesinde kıkırdama. Çiğneme — sor.',
    ),
    loseLine: L(
      'Нырнул в траву. Косилкой? Нет. Колосьями и умом.',
      'He dove into the grass. Scythe? No. Ears and wits.',
      'Otuza daldı. Tırpan mı? Hayır. Başaklar ve akıl.',
    ),
    lockedHint: L(
      'Сначала Кикимора. Полевой без порядка в избе не выйдет.',
      'Kikimora first. The Field Spirit won\'t come without order in the hut.',
      'Önce Kikimora. Tarla ruhu düzensiz kulübeden çıkmaz.',
    ),
  },
  ovinnik: {
    questHook: L(
      'Пахнет зерном. Овинник не любит сырость. И нерях.',
      'Smells of grain. The Ovinnik hates damp. And slobs.',
      'Tahıl kokuyor. Ovinnik nemi sevmez. Ve dağınıklığı.',
    ),
    loseLine: L(
      'Прятки. Сзади шорох… а, это мой хвост.',
      'Hide and seek. Rustle behind… oh, that\'s my tail.',
      'Saklambaç. Arkada hışırtı… ah, kuyruğum.',
    ),
    lockedHint: L(
      'Сначала Полевой. Овинник зерно зря не отдаст.',
      'Field Spirit first. Ovinnik won\'t give grain for nothing.',
      'Önce Tarla ruhu. Ovinnik tahılı boşa vermez.',
    ),
  },
  leshiy: {
    questHook: L(
      'Тропы сбились. Леший рядом. Не свисти.',
      'Paths are tangled. The Leshy is near. Don\'t whistle.',
      'Patikalar karıştı. Leşy yakında. Islık çalma.',
    ),
    loseLine: L(
      'Увёл в чащу. Придётся сначала. И без свиста.',
      'He led us into the thicket. Start over. And no whistling.',
      'Bizi çalılığa çekti. Baştan. Ve ıslık yok.',
    ),
    lockedHint: L(
      'Сначала Овинник. Леший тропу без очереди не даст.',
      'Ovinnik first. The Leshy won\'t show the path out of turn.',
      'Önce Ovinnik. Leşy sıra beklemeden yol vermez.',
    ),
  },
  vodyanoy: {
    questHook: L(
      'Омут тёмный. Он любит уважение — не плеск.',
      'Dark pool. He likes respect — not splashing.',
      'Karanlık göl. Saygı sever — sıçratma değil.',
    ),
    loseLine: L(
      'На дно? В переносном. Мокрый я — в прямом.',
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
      'Тяжёлая походка. Мёд и тишина. Не дразни.',
      'Heavy footsteps. Honey and silence. Don\'t tease.',
      'Ağır adımlar. Bal ve sessizlik. Kışkırtma.',
    ),
    loseLine: L(
      'Ушёл гулять. Мёдом заманить? Сметану куплю — и съем. Идея сырая.',
      'He went for a walk. Lure with honey? I\'ll buy sour cream — and eat it. Raw idea.',
      'Yürüyüşe çıktı. Bal mı? Kaymak alırım — yerim. Ham fikir.',
    ),
    lockedHint: L(
      'Ключ из сундука. Топтыгин сам не придёт.',
      'Key from the chest. Toptygin won\'t come on his own.',
      'Sandıktan anahtar. Toptygin kendi gelmez.',
    ),
  },
  poludnica: {
    questHook: L(
      'Полдень печёт. Она учит: в жару не ломай себя.',
      'Noon burns. She teaches: don\'t break yourself in the heat.',
      'Öğle kavuruyor. Öğretir: sıcakta kendini kırma.',
    ),
    loseLine: L(
      'Заморочила голову. Сворачиваем хвосты — обаяние сработало.',
      'She spun our heads. Tails tucked — charm worked.',
      'Kafamızı döndürdü. Kuyrukları kıvırdık — cazibe tuttu.',
    ),
    lockedHint: L(
      'Ключ из сундука. Редкий. Полудница не любит спешку.',
      'Key from the chest. Rare. Poludnitsa hates rush.',
      'Sandıktan anahtar. Nadir. Poludnitsa aceleyi sevmez.',
    ),
  },
  rusalka: {
    questHook: L(
      'Песня тянет. Слушай с берега — в омут не суйся.',
      'A song pulls. Listen from the shore — don\'t dive in.',
      'Şarkı çekiyor. Kıyıdan dinle — gölgeye atlama.',
    ),
    loseLine: L(
      'В следующий раз удочку? Шучу. Почти.',
      'Fishing rod next time? Kidding. Almost.',
      'Bir dahaki sefere olta mı? Şaka. Neredeyse.',
    ),
    lockedHint: L(
      'Ключ из сундука. Эпик. Русалка сама не поётся.',
      'Key from the chest. Epic. Rusalka won\'t sing herself.',
      'Sandıktan anahtar. Epik. Rusalka kendiliğinden şarkı söylemez.',
    ),
  },
  lada: {
    questHook: L(
      'В воздухе теплее. Лада — про лад, не про кучу монет.',
      'Warmer in the air. Lada is about harmony, not a pile of coins.',
      'Havada daha sıcak. Lada uyum içindir, jet yığını değil.',
    ),
    loseLine: L(
      'Хватит глазеть. Гармонию так не поймаешь.',
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
      'Лес притих. Велес любит ум — не пустой шум.',
      'The forest went quiet. Veles likes wit — not empty noise.',
      'Orman sustu. Veles zekâ sever — boş gürültü değil.',
    ),
    loseLine: L(
      'Пошли в избу. Над нами уже звери ржут.',
      'Back to the hut. The beasts are laughing at us already.',
      'Kulübeye. Hayvanlar çoktan gülüyor.',
    ),
    lockedHint: L(
      '4 осколка. Велес терпелив. Ты — нет.',
      '4 shards. Veles is patient. You — aren\'t.',
      '4 parça. Veles sabırlı. Sen — değilsin.',
    ),
  },
  baba_yaga: {
    questHook: L(
      'Избушка на курьих ножках. Скажи правильно — и не лезь в ступу.',
      'Hut on chicken legs. Say it right — and don\'t climb in the mortar.',
      'Tavuk ayaklı kulübe. Doğru söyle — ve havanın içine girme.',
    ),
    loseLine: L(
      'Хорошо хоть не съела. Зайдём, когда аппетит поменьше.',
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
      'Смерть спрятана. Он любит хитрость — не жадность.',
      'Death is hidden. He likes cunning — not greed.',
      'Ölüm saklı. Kurnazlık sever — açgözlülük değil.',
    ),
    loseLine: L(
      'Он бессмертен. Ты — нет. Пошли, пока игла не в хвосте.',
      'He\'s immortal. You aren\'t. Go before the needle finds your tail.',
      'O ölümsüz. Sen değilsin. İğne kuyruğa değmeden gidelim.',
    ),
    lockedHint: L(
      '6 осколков. Смерть прячет — ты ищи.',
      '6 shards. He hides death — you search.',
      '6 parça. Ölümü saklar — sen ara.',
    ),
  },
  chudo_yudo: {
    questHook: L(
      'Много голов — много вопросов. Это страж, не просто чудище.',
      'Many heads — many questions. A guardian, not just a monster.',
      'Çok kafa — çok soru. Bu bir bekçi, sadece canavar değil.',
    ),
    loseLine: L(
      'Чудо, что нас чудом не проглотило.',
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
