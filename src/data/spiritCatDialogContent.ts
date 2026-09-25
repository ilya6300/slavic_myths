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
      'Start with Domovoy. Without him the hut is chaos — with him at least some order holds.',
      'Domovoy ile başla. Onsuz kulübede kaos — onunla hiç olmazsa düzen durur.',
    ),
    loseLine: L(
      'Ох уж эти домашние хранители. Лапу сломишь, пока поймёшь, чем их порадовать. Давай наберёмся сил и зайдём снова.',
      'Oh, these household keepers. You will break a paw before you learn how to please them. Let us gather strength and come back.',
      'Ah şu ev bekçileri. Onları neyin sevindirdiğini anlayana kadar pençeni kırarsın. Güç toplayıp yine gelelim.',
    ),
    lockedHint: L('', '', ''),
  },
  susedko: {
    questHook: L(
      'Слышишь шуршание под половицами? Это Суседко разыгрался. Сундук точно у него под полом.',
      'Hear the rustling under the floorboards? That is Susedko at his games. The chest is surely under the floor with him.',
      'Döşemelerin altındaki hışırtıyı duyuyor musun? Susedko oyun ediyor. Sandık kesin onunla döşemenin altında.',
    ),
    loseLine: L(
      'Юркнул под половицу, только хвост мелькнул! И сундук пока не отдаёт. Ничего, усы расправим и ещё разок покараулим.',
      'He darted under the floorboard, only a tail flashed! And he still will not give up the chest. No matter — we will smooth our whiskers and keep watch once more.',
      'Döşemenin altına daldı, yalnız kuyruk göründü! Sandığı hâlâ vermiyor. Zararı yok, bıyıklarımızı düzeltip bir kez daha nöbet tutarız.',
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
      'In the bathhouse the master is strict. Steam respects order, and the hasty are not welcome here.',
      'Hamamda efendi sıkıdır. Buhar düzeni sever, acelecileri burada sevmezler.',
    ),
    loseLine: L(
      'Не угодили. Теперь паримся… что не попарились...',
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
      'За прялкой снова сухое стрекотание. Я свои клубки спрятал. Твои всё ещё на лавке.',
      'Dry clicking at the spinning wheel again. I hid my yarn. Yours is still on the bench.',
      'Çıkrıkta yine kuru tıkırtı. Ben yumaklarımı sakladım. Seninkiler hâlâ bankta.',
    ),
    loseLine: L(
      'У меня для тебя две новости — плохая и хорошая. Плохая: Кикимора спутала пряжу и утащила носки. Хорошая: и пряжа, и носки были не мои.',
      'Two pieces of news — bad and good. Bad: Kikimora tangled the yarn and stole the socks. Good: neither the yarn nor the socks were mine.',
      'İki haberim var — kötü ve iyi. Kötü: Kikimora ipliği dolaştırdı ve çorapları kaçırdı. İyi: ne iplik ne de çoraplar benimdi.',
    ),
    lockedHint: L(
      'Сначала Банник. Кикимора любит чистые лапы.',
      'Bannik first. Kikimora likes clean paws.',
      'Önce Bannik. Kikimora temiz pençeleri sever.',
    ),
  },
  poludnik: {
    questHook: L(
      'Зной над полосой дрожит. Это его час — я уже в тени, полоса подождёт.',
      'Heat shimmers over the strip. This is his hour — I\'m already in the shade; the strip can wait.',
      'Şerit üzerinde sıcaklık titriyor. Bu onun saati — ben çoktan gölgedeyim, şerit bekler.',
    ),
    loseLine: L(
      'Припекло в самый полдень, а тень я с утра спрятал под лавкой — себе. Отряхнём колосья с шерсти и зайдём снова, когда у тебя тоже найдётся холодок.',
      'Noon scorched us, and I hid the shade under the bench this morning — for myself. Shake the ears off the fur and try again when you have a cool spot too.',
      'Öğle bizi kavurdu, gölgeyi sabah lavanın altına sakladım — kendime. Başakları tüylerden silkip, senin de serin bir yerin olunca yine deneyelim.',
    ),
    lockedHint: L(
      'Сначала Кикимора. Полевой без порядка в избе не выйдет.',
      'Kikimora first. Polevik will not come out without order in the hut.',
      'Önce Kikimora. Kulübede düzen olmadan Polevik çıkmaz.',
    ),
  },
  ovinnik: {
    questHook: L(
      'Пахнет сухим зерном и прогретым деревом. Овинник бережёт хлеб от огня и сырости — заходи с почтением.',
      'It smells of dry grain and warmed wood. Ovinnik keeps the bread from fire and damp — enter with respect.',
      'Kuru tahıl ve ısınmış odun kokuyor. Ovinnik ekmeği ateşten ve nemden korur — saygıyla gir.',
    ),
    loseLine: L(
      'Тихо, слышишь, сзади кто-то шуршит? А, это мой хвост. Всё, больше не отвлекаюсь, а то опять без меня проиграешь... ',
      'Quiet, do you hear someone rustling behind? Oh, that is my tail. That is it, I will not get distracted again, or you will lose without me once more...',
      'Sessiz, duyuyor musun, arkada biri hışırdıyor? Ah, kuyruğum. Tamam, bir daha dalmayacağım, yoksa yine bensiz kaybedersin...',
    ),
    lockedHint: L(
      'Сначала Полевой. Овинник зерно зря не отдаст.',
      'Polevik first. Ovinnik will not give grain for nothing.',
      'Önce Polevik. Ovinnik tahılı boşa vermez.',
    ),
  },
  leshiy: {
    questHook: L(
      'В лесу ты в гостях. Леший ведает всеми тропами и шума не любит — не свисти в чаще.',
      'In the forest you are a guest. Leshy knows every path and dislikes noise — do not whistle in the thicket.',
      'Ormanda konuksun. Leshy bütün patikaları bilir ve gürültü sevmez — sık ormanda ıslık çalma.',
    ),
    loseLine: L(
      'Увёл Леший тропку в густой малинник! Кругами ходим, сосны верхушками качают. Переведём дух и спросим дорогу с почтением.',
      'Leshy led the path into a thick raspberry patch! We walk in circles, the pines nod their tops. Let us catch our breath and ask the way with respect.',
      'Leshy patikayı sık ahududuluğa çekti! Daireler çiziyoruz, çamlar tepelerini sallıyor. Soluklanıp yolu saygıyla soralım.',
    ),
    lockedHint: L(
      'Сначала Овинник. Леший тропу без очереди не даст.',
      'Ovinnik first. Leshy will not give the path out of turn.',
      'Önce Ovinnik. Leshy sırasız yol vermez.',
    ),
  },
  vodyanoy: {
    questHook: L(
      'Омут глубок, вода темна. Водяной бережёт речные тайны и чистую гладь — ступай у берега осторожно.',
      'The pool is deep, the water is dark. Vodyanoy keeps the river secrets and the clear surface — step carefully by the bank.',
      'Girdap derin, su karanlık. Vodyanoy ırmak sırlarını ve duru yüzeyi korur — kıyıda dikkatli bas.',
    ),
    loseLine: L(
      'Водяной пригрозил, а я "вышел сухой из воды". Знаешь почему? Я просто туда не полез.',
      'Vodyanoy threatened me, and I “came out of the water dry.” Know why? I simply never went in.',
      'Vodyanoy tehdit etti, ben ise “sudan kuru çıktım.” Neden mi? Oraya hiç girmedim.',
    ),
    lockedHint: L(
      'Сначала Леший. Водяной без леса не зовёт.',
      'Leshy first. Vodyanoy does not call without the forest.',
      'Önce Leshy. Vodyanoy ormansız çağırmaz.',
    ),
  },
  dedushka_toptygin: {
    questHook: L(
      'Чаща держит один неподвижный центр. К малине не суйся — Хозяин сам гостей не ищет.',
      'The thicket holds one still centre. Don\'t go to the raspberries — the Host does not look for guests.',
      'Sık orman durağan bir merkez tutar. Ahududuya gitme — Ev Sahibi konuk aramaz.',
    ),
    loseLine: L(
      'Хрустнул сучок под лапой — и дедушка недовольно ушёл вглубь малинника. Надо бы вести себя потише. Давай попробуем снова.',
      'A twig snapped under a paw — and grandfather went deeper into the raspberries. Let\'s try again, quieter.',
      'Dal kırıldı — dede ahududu içine çekildi. Daha sessiz deneyelim.',
    ),
    lockedHint: L(
      'Ключ из сундука. Топтыгин сам не придёт.',
      'Key from the chest. Toptygin won\'t come on his own.',
      'Sandıktan anahtar. Toptygin kendi gelmez.',
    ),
  },
  poludnica: {
    questHook: L(
      'Полдень стоит столбом. Нива в этот час хочет тени — я уже под дубом.',
      'Noon stands like a pillar. The field wants shade at this hour — I\'m already under the oak.',
      'Öğle bir sütun gibi duruyor. Tarla bu saatte gölge ister — ben meşenin altındayım.',
    ),
    loseLine: L(
      'Зной накрыл полосу, серп сам выпал из лап. Сядем в холодок под берёзой и зайдём снова, когда зенит спадёт.',
      'The heat covered the strip, the sickle slipped from my paws. Let\'s sit in the birch shade and come back when noon eases.',
      'Sıcak şeridi kapladı, orak patilerden düştü. Huş gölgesinde oturup öğle geçince dönelim.',
    ),
    lockedHint: L(
      'Ключ из сундука. Редкий. Полудница не любит спешку.',
      'Key from the chest. Rare. Poludnitsa hates rush.',
      'Sandıktan anahtar. Nadir. Poludnitsa aceleyi sevmez.',
    ),
  },
  rusalka: {
    questHook: L(
      'Ветка качнулась, рубаха белая, пояса нет. Я уже на сухом бугре — в осоку сам не пойду.',
      'A branch swayed, the shirt is white, no belt. I\'m already on the dry knoll — I won\'t go into the sedge myself.',
      'Dal sallandı, gömlek beyaz, kuşak yok. Ben çoktan kuru tümsekteyim — sazlığa kendim girmem.',
    ),
    loseLine: L(
      'Засмотрелся на венок, шагнул к осоке — и сижу мокрый, а рубаха на берёзе сухая. Берег мой, заводь её. Обсохну и вернусь уже с сухого места.',
      'I stared at the wreath, stepped toward the sedge — and now I\'m wet, while the shirt on the birch is dry. The bank is mine, the backwater is hers. I\'ll dry off and come back from dry ground.',
      'Taca bakarken sazlığa adım attım — ben ıslağım, huştaki gömlek kuru. Kıyı benim, koy onun. Kurulanıp kuru yerden dönerim.',
    ),
    lockedHint: L(
      'Ключ из сундука. Эпик. Русалка сама не поётся.',
      'Key from the chest. Epic. Rusalka won\'t sing herself.',
      'Sandıktan anahtar. Epik. Rusalka kendiliğinden şarkı söylemez.',
    ),
  },
  lada: {
    questHook: L(
      'Слышишь? После спора в горнице снова тихо. Лад — мир своих, а не резной столб на холме.',
      'Hear that? After the quarrel the room is quiet again. Lad is peace among one\'s own, not a carved post on a hill.',
      'Duyuyor musun? Kavgadan sonra oda yine sessiz. Lad kendi aranda barıştır, tepedeki oyma direk değil.',
    ),
    loseLine: L(
      'Не поймали лад. Зато я поймал свою кружку — обеими лапами, пока стол ещё дрожал. Выдохнем и зайдём снова, когда в горнице станет тихо.',
      'We missed the lad. I did catch my mug — both paws, while the table still shook. We\'ll breathe and try again when the room is quiet.',
      'Uyumu tutamadık. Ama bardağımı tuttum — iki pençeyle, masa hâlâ sallanırken. Oda susunca nefeslenip yine deneriz.',
    ),
    lockedHint: L(
      'Лада без лада не придёт.',
      'Lada won\'t come without harmony.',
      'Uyum olmadan Lada gelmez.',
    ),
  },
  veles: {
    questHook: L(
      'На жниве оставляют бородку, на пристани клянутся Волосом. Велес держит стадо и торг.',
      'They leave a beard of ears on the field and swear by Volos at the wharf. Veles holds the herd and the trade.',
      'Hasatta sakal bırakırlar, iskelede Volos\'a yemin ederler. Veles sürü ve ticareti tutar.',
    ),
    loseLine: L(
      'Ух, закружились лесные тени, сосны покачали верхушками — не дослушали мы мудрый завет. Наберёмся терпения и спросим вновь.',
      'Forest shadows spun, pines nodded — we did not hear the counsel through. Let\'s gather patience and ask again.',
      'Orman gölgeleri döndü — öğüdü sonuna kadar dinlemedik. Sabredip yine soralım.',
    ),
    lockedHint: L(
      'Велес терпелив. Тебе стоит поучиться.',
      'Veles is patient. You could learn from that.',
      'Veles sabırlı. Sende de biraz olsun.',
    ),
  },
  baba_yaga: {
    questHook: L(
      'У края чащи столбы пахнут дымом. Это порог, не курица: сначала гостя кормят, потом спрашивают путь.',
      'At the edge of the thicket the posts smell of smoke. This is a threshold, not a hen: they feed the guest first, then ask the way.',
      'Sık ormanın kenarında direkler duman kokar. Bu eşik, tavuk değil: önce konuğu doyururlar, sonra yolu sorarlar.',
    ),
    loseLine: L(
      'Избушка не повернула лица: я сунул нос в ставню, не назвавшись. Подождём у столбов и скажем, кто пришёл.',
      'The hut did not turn its face: I poked the shutter without naming myself. Let\'s wait by the posts and say who came.',
      'Kulübe yüzünü çevirmedi: kepenge adımı söylemeden burnumu soktum. Direklerde bekleyip kim geldiğini söyleyelim.',
    ),
    lockedHint: L(
      'У края чащи столбы пахнут дымом — это порог, не курица.',
      'At the thicket\'s edge the posts smell of smoke — a threshold, not a hen.',
      'Sık ormanın kenarında direkler duman kokar — eşik, tavuk değil.',
    ),
  },
  koschei_immortal: {
    questHook: L(
      'Худой владыка сидит у сундуков и в драку не лезет. Золото блестит — а я лапу прижал: лишняя горсть здесь запирает дверь.',
      'The thin lord sits by the chests and does not pick a fight. The gold gleams — and I kept my paw down: an extra handful locks the door here.',
      'Zayıf hükümdar sandıkların yanında oturur ve kavgaya girmez. Altın parlar — ben de patimi çektim: fazla bir avuç burada kapıyı kilitler.',
    ),
    loseLine: L(
      'Потянулись за лишним сундуком — и замок защёлкнулся! Кощей усмехнулся в сухие усы. Переведём дух и пойдём дорогой разума.',
      'We reached for an extra chest — and the lock snapped shut! Koschei smirked into his dry mustache. Let us catch our breath and go by the road of reason.',
      'Fazla sandığa uzandık — kilit şak diye kapandı! Koschei kuru bıyığına sırıttı. Soluklanıp akıl yoluyla gidelim.',
    ),
    lockedHint: L(
      'В тереме блестят сундуки, а ключ — не в сундуке.',
      'Chests gleam in the terem, but the key is not in a chest.',
      'Teremde sandıklar parlar, anahtar sandıkta değil.',
    ),
  },
  chudo_yudo: {
    questHook: L(
      'У большой воды две головы и солнечное кольцо. Дар бросают целиком — на мост с загадками я не лез.',
      'By the great water: two heads and a sun-ring. They throw the gift whole — I did not climb the bridge with riddles.',
      'Büyük suda iki kafa ve güneş halkası. Armağanı bütün atarlar — bilmeceli köprüye çıkmadım.',
    ),
    loseLine: L(
      'Волна взяла бережок, монета ещё в лапе. Бросим долю целиком и сядем на сухом, пока глубь сама успокоится.',
      'A wave took the bank, the coin still in my paw. Let\'s throw the share whole and sit on dry ground until the deep settles.',
      'Dalga kıyıyı aldı, madeni para hâlâ patide. Payı bütün atıp derinlik durulana dek kuruda oturalım.',
    ),
    lockedHint: L(
      'После него откроется весенняя глава.',
      'After him the spring chapter will open.',
      'Ondan sonra bahar bölümü açılır.',
    ),
  },
  yarilo: {
    questHook: L(
      'Белый конь уже на лугу, а трава лезет ему в морду, будто зимы и не было. Я бы остался у миски, но лист на щите блестит — пойдём, пока его не присвоил ветер.',
      'The white horse is already on the meadow, and the grass is in his muzzle as if winter never was. I would have stayed by the bowl, but the leaf on the shield is shining — let\'s go before the wind claims it.',
      'Beyaz at çoktan çayırda, ot burnuna giriyor, kış hiç olmamış gibi. Tasın başında kalırdım, ama kalkandaki yaprak parlıyor — rüzgâr sahiplenmeden gidelim.',
    ),
    loseLine: L(
      'У меня две новости. Плохая: весна умчалась быстрее, чем я дожевал мысль. Хорошая: хвост я в посев не записал, так что поле ещё твоё. Соберись и зайди снова, пока щит с листом не стал крышкой для моей миски.',
      'I have two bits of news. The bad one: spring raced off faster than I could finish the thought. The good one: I did not sign my tail up as seed, so the field is still yours. Pull yourself together and come back before the leaf shield becomes a lid for my bowl.',
      'İki haberim var. Kötü olan: bahar, düşünceyi bitirmemden hızlı kaçtı. İyi olan: kuyruğu ekine yazmadım, tarla hâlâ senin. Toplan ve yapraklı kalkan tasımın kapağı olmadan yine gel.',
    ),
    lockedHint: L(
      'Белый конь уже ждёт у весеннего поля.',
      'The white horse already waits by the spring field.',
      'Beyaz at bahar tarlasının kenarında bekliyor.',
    ),
  },
  perun: {
    questHook: L(
      'На высокой горе над избой шумит дубрава, а вдали над облаками мягко сверкает молния.',
      'On the high hill above the hut the oak grove rustles, and lightning flashes softly beyond the clouds.',
      'Kulübenin üstündeki yüksek tepede meşe koruluğu hışırdar, bulutların ötesinde yumuşak şimşek çakar.',
    ),
    loseLine: L(
      'Гром уже ушёл за дубы, а я всё слушал, как звенит миска. Соберёмся и вернёмся: даже мой хвост знает, где высокая гора.',
      'The thunder already moved behind the oaks while I listened to my bowl ring. We\'ll return — even my tail knows where the high hill is.',
      'Gök gürültüsü çoktan meşelerin ardına gitti, ben kase sesini dinledim. Döneriz — kuyruk bile yüksek tepeyi bilir.',
    ),
    lockedHint: L(
      'Гром ждёт в дубраве на высокой горе.',
      'Thunder waits in the oak grove on the high hill.',
      'Gök gürültüsü yüksek tepedeki meşe koruluğunda bekliyor.',
    ),
  },
};
