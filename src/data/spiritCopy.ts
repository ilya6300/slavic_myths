import type { SpiritId } from '../config/assetRegistry';
import type { LocalizedText } from '../i18n/types';

const L = (ru: string, en: string, tr: string): LocalizedText => ({ ru, en, tr });

export interface SpiritCopy {
  name: LocalizedText;
  bookDescription: LocalizedText;
  bookRewardDescription: LocalizedText;
  loseMessage: LocalizedText;
  trophyDescription: LocalizedText;
  miniTale: LocalizedText;
  lockedHint: LocalizedText;
}

export const spiritCopy: Record<SpiritId, SpiritCopy> = {
  brownie: {
    name: L('Домовой', 'Domovoy', 'Domovoy'),
    bookDescription: L(
      'Хозяин избы. Корми — поможет. Зли — посуда в полёт, ночью кошмары. Без него тут бардак.',
      'Master of the hut. Feed him — he helps. Anger him — dishes fly, nightmares at night. Without him this place is chaos.',
      'Kulübenin efendisi. Besle — yardım eder. Kızdır — tabaklar uçar, geceleri kâbus. Onsuz burada kaos.',
    ),
    bookRewardDescription: L(
      'Задобришь — станет союзником в избе. Бонус удачи с клика: +1% (обычный скин), +2% (редкий), +3% (эпик), +5% (эпический).',
      'Appease him and he becomes an ally in the hut. Luck bonus per click: +1% (common skin), +2% (rare), +3% (epic), +5% (legendary).',
      'Gönlünü alırsan kulübede müttefik olur. Tıklama başına şans: +%1 (yaygın skin), +%2 (nadir), +%3 (epik), +%5 (efsanevi).',
    ),
    loseMessage: L(
      'Ох уж эти домашние хранители. Лапу сломишь, пока поймёшь, чем их порадовать. Давай наберёмся сил и зайдём снова.',
      'Oh, these household keepers. You will break a paw before you learn how to please them. Let us gather strength and come back.',
      'Ah şu ev bekçileri. Onları neyin sevindirdiğini anlayana kadar pençeni kırarsın. Güç toplayıp yine gelelim.',
    ),
    trophyDescription: L(
      'Трофея нет — сам Домовой теперь живёт в избе у печки.',
      'No trophy — Domovoy himself now lives in the hut by the stove.',
      'Kupa yok — Domovoy artık kulübede ocağın yanında yaşıyor.',
    ),
    miniTale: L(
      'Сказ о тёплой печке и сытом хозяине. Я не стал поднимать шум в горнице: налил в блюдце свежего молока, поставил за печку и тихо мурлыкнул. Домовой выглянул из угла, пригладил мохнатую бороду и остался приглядывать за избой. В народе знают: чем сытнее хранитель, тем крепче держится весь дом.',
      'A tale of a warm stove and a well-fed master. I did not raise a fuss in the room: I poured fresh milk into a saucer, set it behind the stove, and purred softly. Domovoy looked out from the corner, smoothed his shaggy beard, and stayed to watch the hut. Folk know: the better fed the keeper, the firmer the whole house stands.',
      'Sıcak ocak ve tok efendi hikâyesi. Odada gürültü etmedim: tabağa taze süt koydum, ocağın arkasına bıraktım ve usulca mırladım. Domovoy köşeden baktı, tüylü sakalını düzeltti ve kulübeye göz kulak olmak için kaldı. Halk bilir: bekçi ne kadar toklarsa ev o kadar sağlam durur.',
    ),
    lockedHint: L('', '', ''),
  },
  susedko: {
    name: L('Суседко (Барабашка)', 'Susedko (Barabashka)', 'Susedko (Barabashka)'),
    bookDescription: L(
      'Мохнатый сосед из-под половиц. Ночью устраивает «тыгыдык», шуршит пакетами и тащит мелочь. Шаги бесшумны — мягкая шерсть на лапках. Сундук утащил именно он.',
      'A shaggy neighbor from under the floorboards. At night he taps tygydyk, rustles bags, and drags off small things. His steps are silent — soft fur on his paws. He is the one who took the chest.',
      'Döşeme altından tüylü komşu. Geceleri tıkırdatır, torbaları hışırdatır, ufak tefek taşır. Adımları sessiz — patilerinde yumuşak tüy. Sandığı o götürdü.',
    ),
    bookRewardDescription: L(
      'Вернул сундук в избу. Первое открытие — сразу, дальше по таймеру. Удача копится, пока ты гуляешь.',
      'He returned the chest to the hut. The first opening is immediate, then on a timer. Luck builds while you wander.',
      'Sandığı kulübeye geri getirdi. İlk açılış hemen, sonrası zamanlayıcıyla. Sen dolaşırken şans birikir.',
    ),
    loseMessage: L(
      'Юркнул под половицу, только хвост мелькнул! И сундук пока не отдаёт. Ничего, усы расправим и ещё разок покараулим.',
      'He darted under the floorboard, only a tail flashed! And he still will not give up the chest. No matter — we will smooth our whiskers and keep watch once more.',
      'Döşemenin altına daldı, yalnız kuyruk göründü! Sandığı hâlâ vermiyor. Zararı yok, bıyıklarımızı düzeltip bir kez daha nöbet tutarız.',
    ),
    trophyDescription: L(
      'Крошечный возвращённый сундук для полки — не тот большой, что копит удачу на полу. Барабашка его вернул… почти добровольно.',
      'A tiny returned chest for the shelf — not the big one that stores luck on the floor. Barabashka gave it back… almost willingly.',
      'Raf için minik geri dönmüş sandık — yerde şans biriktiren büyük olan değil. Barabashka onu geri verdi… neredeyse kendi isteğiyle.',
    ),
    miniTale: L(
      'Сказ о ночном стуке и вернувшемся сундуке. Я не стал колотить по полу и не лез в щель носом: сел у половиц и слушал, как Суседко барабанит в своё удовольствие. К утру стук затих, а сундук стоял на месте — будто сосед сам наигрался. В народе знают: ночной стук в избе — это сосед озорует, когда ему вздумается.',
      'A tale of night tapping and a chest come home. I did not hammer the floor or poke my nose into the crack: I sat by the boards and listened while Susedko drummed for his own pleasure. By morning the tapping had stopped, and the chest stood in its place — as if the neighbor had played himself out. Folk know: a night knock in the hut is the neighbor making mischief whenever he pleases.',
      'Gece tıkırtısı ve yerine dönen sandık hikâyesi. Yere vurmadım, yarığa burnumu sokmadım: döşemenin yanında oturup Susedko keyfine göre tıkırdarken dinledim. Sabaha tıkırtı kesildi, sandık yerindeydi — komşu kendi kendine oynamış gibi. Halk bilir: kulübedeki gece tıkırtısı, komşunun canı istediğinde yaramazlığıdır.',
    ),
    lockedHint: L(
      'Сначала Домовой. Без него сосед не вылезет.',
      'Domovoy first. Without him the neighbor will not come out.',
      'Önce Domovoy. Onsuz komşu çıkmaz.',
    ),
  },
  bannik: {
    name: L('Банник', 'Bannik', 'Bannik'),
    bookDescription: L(
      'Строгий хозяин бани. Любит чистоту, пар и уважение. Придёшь с добром — согреет; без поклона — парком «пожурит». В баню не входят грубо и не ночуют без спроса.',
      'The strict master of the bathhouse. He likes cleanliness, steam, and respect. Come with good will — he warms you; without a bow — the steam scolds you. Do not enter the bath roughly, and do not spend the night without asking.',
      'Hamamın sıkı efendisi. Temizlik, buhar ve saygı sever. İyilikle gelirsen ısıtır; eğilmeden gelirsen buhar azarlar. Hamama kabaca girilmez, izinsiz gece kalınmaz.',
    ),
    bookRewardDescription: L(
      '+5 к максимуму энергии навсегда. В HUD будет видно: текущая / новый макс. (например 100/105).',
      '+5 to maximum energy forever. The HUD shows current / new max (for example 100/105).',
      'Maksimum enerjiye kalıcı +5. HUD gösterir: şu an / yeni maks. (örneğin 100/105).',
    ),
    loseMessage: L(
      'Не угодили. Теперь паримся… что не попарились...',
      'We did not please him. Now we stew… over not having steamed...',
      'Hoşnut etmedik. Şimdi bunalıyoruz… buharlanmadığımıza...',
    ),
    trophyDescription: L(
      'Старый банный веник — ещё тёплый, будто только с полка.',
      'An old bath besom — still warm, as if it just came off the bench.',
      'Eski hamam süpürgesi — hâlâ sıcak, az önce sekipten inmiş gibi.',
    ),
    miniTale: L(
      'Сказ о воде, мыле и венике. Я не полез на верхний полок и не хлопнул дверью: оставил в кадке немного воды, кусок мыла и берёзовый веник. Пар остался ровным, будто хозяин бани кивнул из листьев. В народе знают: за порядок он удачи не сыплет, а воду, мыло и веник после мытья ему оставляют.',
      'A tale of water, soap, and a besom. I did not climb the upper bench or slam the door: I left a little water in the tub, a piece of soap, and a birch besom. The steam stayed even, as if the bathhouse master nodded from the leaves. Folk know: he does not pour luck for tidiness, but they leave him water, soap, and the besom after washing.',
      'Su, sabun ve süpürge hikâyesi. Üst sekiye çıkmadım, kapıyı çarpmadım: teknede biraz su, bir parça sabun ve huş süpürgesi bıraktım. Buhar düzgün kaldı, hamam efendisi yaprakların arasından başını sallamış gibi. Halk bilir: düzen için şans saçmaz; yıkamadan sonra ona su, sabun ve süpürge bırakırlar.',
    ),
    lockedHint: L(
      'Сначала Суседко. Банник пар даром не даёт.',
      'Susedko first. Bannik does not give steam for free.',
      'Önce Susedko. Bannik bedava buhar vermez.',
    ),
  },
  kikimora: {
    name: L('Кикимора', 'Kikimora', 'Kikimora'),
    bookDescription: L(
      'Худая хозяюшка избы и сырых углов. Любит порядок — но если хаос, путает нитки, прячет вещи и шуршит по ночам. Задобрить заботой проще, чем криком.',
      'The thin mistress of the hut and damp corners. She likes order — but if there is chaos, she tangles threads, hides things, and rustles at night. Care pleases her more easily than shouting.',
      'Kulübenin ve nemli köşelerin zayıf hanımı. Düzen sever — kaos varsa ipliği dolaştırır, eşyayı saklar, geceleri hışırdar. Bağırmaktansa özenle gönlünü almak daha kolay.',
    ),
    bookRewardDescription: L(
      '+1 тайный оберег в инвентарь (иконка в HUD).',
      '+1 secret charm in the inventory (icon in the HUD).',
      'Envantere +1 gizli tılsım (HUD simgesi).',
    ),
    loseMessage: L(
      'У меня для тебя две новости — плохая и хорошая. Плохая: Кикимора спутала пряжу и утащила носки. Хорошая: и пряжа, и носки были не мои.',
      'I have two bits of news for you — bad and good. The bad: Kikimora tangled the yarn and carried off the socks. The good: neither the yarn nor the socks were mine.',
      'Sana iki haberim var — kötü ve iyi. Kötü: Kikimora ipliği dolaştırdı ve çorapları götürdü. İyi: ne iplik ne de çoraplar benimdi.',
    ),
    trophyDescription: L(
      'Клубок чёрной спутанной шерсти — не распутывай, пусть лежит трофеем.',
      'A ball of black tangled wool — do not unravel it; let it lie as a trophy.',
      'Siyah dolaşık yün yumağı — çözme, kupa olarak dursun.',
    ),
    miniTale: L(
      'Сказ об убранной пряже и ровном клубке. Я не гонялся за тенью по углам: смотал нитки, спрятал мотки и оставил резную прялку в покое. К утру шерсть лежала гладкая, а на полке тугой клубок — будто из темноты хмыкнули довольно. В народе знают: она путает лишь то, что забыли убрать.',
      'A tale of yarn put away and an even ball. I did not chase a shadow through the corners: I wound the threads, hid the skeins, and left the carved spinning wheel in peace. By morning the wool lay smooth, and a tight ball sat on the shelf — as if someone in the dark had snorted with satisfaction. Folk know: she tangles only what was forgotten and left out.',
      'Kaldırılmış iplik ve düzgün yumak hikâyesi. Köşelerde gölge kovalamadım: iplikleri sardım, yumakları sakladım, oymalı çıkrığı rahat bıraktım. Sabaha yün düzgün yatıyordu, rafta sıkı bir yumak vardı — karanlıktan memnun homurdanmış gibi. Halk bilir: yalnız toplamayı unuttuğunu dolaştırır.',
    ),
    lockedHint: L(
      'Сначала Банник. Кикимора любит чистые лапы.',
      'Bannik first. Kikimora likes clean paws.',
      'Önce Bannik. Kikimora temiz pençe sever.',
    ),
  },
  poludnik: {
    name: L('Полевой', 'Polevik', 'Polevik'),
    bookDescription: L(
      'Весёлый дух лугов и межи. Следит, чтобы урожай рос, а люди в жару не ломали спину без меры. Любит благодарность земле — и не любит, когда поле топчут зря.',
      'A merry spirit of meadows and the field boundary. He watches that the crop grows, and that people do not break their backs in the heat without measure. He likes thanks given to the land — and dislikes a field trampled for nothing.',
      'Çayırların ve sınırın neşeli ruhu. Ekinin büyümesine, insanların sıcakta ölçüsüz bel kırmamasına bakar. Toprağa şükrü sever — tarlanın boşuna çiğnenmesini sevmez.',
    ),
    bookRewardDescription: L(
      'Титул «Полевой кот» и +10 энергии разово (может превысить макс.; в HUD: текущая / макс.).',
      'The title “Polevik Cat” and +10 energy once (may exceed the max; HUD: current / max).',
      '«Polevik Kedisi» unvanı ve bir kez +10 enerji (maksimumu aşabilir; HUD: şu an / maks.).',
    ),
    loseMessage: L(
      'Припекло в самый полдень, а тень я с утра спрятал под лавкой — себе. Отряхнём колосья с шерсти и зайдём снова, когда у тебя тоже найдётся холодок.',
      'Noon scorched us, and I hid the shade under the bench this morning — for myself. Let us shake the ears off our fur and come back when you have a cool spot too.',
      'Tam öğle bizi kavurdu, gölgeyi sabah lavanın altına sakladım — kendime. Başakları tüylerden silkip senin de serin bir yerin olunca yine gelelim.',
    ),
    trophyDescription: L(
      'Круглый венок из колосьев и полевых цветов — дар живому полю; пахнет сеном и победой.',
      'A round wreath of ears and field flowers — a gift of the living field; it smells of hay and victory.',
      'Başak ve tarla çiçeklerinden yuvarlak çelenk — canlı tarlanın armağanı; saman ve zafer kokar.',
    ),
    miniTale: L(
      'Сказ о полуденной тени и венке с полосы. Солнце стояло в самом зените, колосья звенели. Я не полез жать в зной, а лёг в холодке у края семейной полосы и замурлыкал. Полевой выглянул из ржи, будто домашний хозяин своей полосы, и оставил нам сплетённый венок из спелых колосьев. В народе помнят: его сила в полдень, полоса любит покой в этот час — и тогда колос семье впрок.',
      'A tale of noon shade and a wreath from the strip. The sun stood at the zenith, the ears rang. I did not go reaping in the heat; I lay in the cool at the edge of the family strip and purred. Polevik looked out of the rye, like the household master of his own strip, and left us a woven wreath of ripe ears. Folk remember: his power is at noon, the strip likes peace at that hour — and then the grain lasts the family.',
      'Öğle gölgesi ve şeritten çelenk hikâyesi. Güneş tam tepedeydi, başaklar çınlıyordu. Sıcakta biçmeye gitmedim; aile şeridinin kenarında serinde yattım ve mırladım. Polevik çavdardan baktı, kendi şeridinin ev efendisi gibi, ve bize olgun başaklardan örülü bir çelenk bıraktı. Halk hatırlar: gücü öğlededir, şerit o saatte huzur ister — o zaman başak aileye yeter.',
    ),
    lockedHint: L(
      'Сначала Кикимора. Полевой без порядка в избе не выйдет.',
      'Kikimora first. Polevik will not come out without order in the hut.',
      'Önce Kikimora. Kulübede düzen olmadan Polevik çıkmaz.',
    ),
  },
  ovinnik: {
    name: L('Овинник', 'Ovinnik', 'Ovinnik'),
    bookDescription: L(
      'Хранитель овина и зерна. Следит, чтобы урожай оставался сухим и целым. Грязь и небрежность не любит; к хлебу с почтением — поможет.',
      'Keeper of the drying barn and the grain. He watches that the harvest stays dry and whole. He dislikes dirt and carelessness; meet the bread with respect — he will help.',
      'Kurutma ambarının ve tahılın bekçisi. Hasadın kuru ve bütün kalmasına bakar. Kir ve özensizliği sevmez; ekmeğe saygıyla yaklaşırsan yardım eder.',
    ),
    bookRewardDescription: L(
      '+50 энергии разово (может превысить макс.; в HUD: текущая / макс.).',
      '+50 energy once (may exceed the max; HUD: current / max).',
      'Bir kez +50 enerji (maksimumu aşabilir; HUD: şu an / maks.).',
    ),
    loseMessage: L(
      'Тихо, слышишь, сзади кто-то шуршит? А, это мой хвост. Всё, больше не отвлекаюсь, а то опять без меня проиграешь... ',
      'Quiet, do you hear someone rustling behind? Oh, that is my tail. That is it, I will not get distracted again, or you will lose without me once more... ',
      'Sessiz, duyuyor musun, arkada biri hışırdıyor? Ah, kuyruğum. Tamam, bir daha dalmayacağım, yoksa yine bensiz kaybedersin... ',
    ),
    trophyDescription: L(
      'Высокий сноп спелой пшеницы, связанный верёвкой — зерно для зимы в овине, не круглый венок Полевого.',
      'A tall sheaf of ripe wheat, bound with rope — grain for winter in the barn, not Polevik’s round wreath.',
      'İple bağlı uzun olgun buğday demeti — ambarda kışlık tahıl, Polevik’in yuvarlak çelengi değil.',
    ),
    miniTale: L(
      'Сказ о сухом зерне и бережном огоньке. Я осторожно переступил порог сарая для сушки зерна, не стал прыгать по соломе. Овинник глянул из сумерек, кивнул седой головой и протянул нам золотистую связку спелых колосьев. В деревне знают: овин берегут пуще избы, ведь спасённое от огня и сырости зерно кормит всю семью долгую морозную зиму.',
      'A tale of dry grain and a careful flame. I stepped carefully over the threshold of the grain-drying barn and did not jump on the straw. Ovinnik looked out of the dusk, nodded his grey head, and held out a golden bundle of ripe ears. In the village they know: the barn is guarded more dearly than the hut, because grain saved from fire and damp feeds the whole family through a long frosty winter.',
      'Kuru tahıl ve özenli alev hikâyesi. Tahıl kurutma ambarının eşiğini dikkatle geçtim, samanın üstüne zıplamadım. Ovinnik alacakaranlıktan baktı, kır saçlı başını salladı ve bize olgun başaklardan altın bir demet uzattı. Köyde bilirler: ambarı kulübeden çok korurlar, çünkü ateşten ve nemden kurtulan tahıl bütün aileyi uzun ayaz kışta doyurur.',
    ),
    lockedHint: L(
      'Сначала Полевой. Овинник зерно зря не отдаст.',
      'Polevik first. Ovinnik will not give grain for nothing.',
      'Önce Polevik. Ovinnik tahılı boşa vermez.',
    ),
  },
  leshiy: {
    name: L('Леший', 'Leshy', 'Leshy'),
    bookDescription: L(
      'Хозяин леса, повелитель троп и зверья. Неуважительным путает дорогу; заботливым — выводит к опушке. В лесу он — закон, а ты — гость.',
      'Master of the forest, lord of paths and beasts. He tangles the road for the disrespectful; for the careful he leads the way to the edge. In the forest he is the law, and you are a guest.',
      'Ormanın efendisi, patikaların ve hayvanların hâkimi. Saygısızın yolunu karıştırır; özenliyi orman kenarına çıkarır. Ormanda yasa odur, sen konuksun.',
    ),
    bookRewardDescription: L(
      '+5% к скорости восстановления энергии (пассивно, навсегда).',
      '+5% to energy recovery speed (passive, forever).',
      'Enerji yenilenme hızına +%5 (pasif, kalıcı).',
    ),
    loseMessage: L(
      'Увёл Леший тропку в густой малинник! Кругами ходим, сосны верхушками качают. Переведём дух и спросим дорогу с почтением.',
      'Leshy led the path into a thick raspberry patch! We walk in circles, the pines nod their tops. Let us catch our breath and ask the way with respect.',
      'Leshy patikayı sık ahududuluğa çekti! Daireler çiziyoruz, çamlar tepelerini sallıyor. Soluklanıp yolu saygıyla soralım.',
    ),
    trophyDescription: L(
      'Деревянный посох, обвитый плющом — тропа помнит хозяина.',
      'A wooden staff wound with ivy — the path remembers its master.',
      'Sarmaşık sarılı tahta asa — patika efendisini hatırlar.',
    ),
    miniTale: L(
      'Сказ о кривой тропе и вывернутом колокольчике. Я не стал ломать сучья и свистеть на весь бор. Тихо сел на пенёк, вывернул колокольчик на шее наизнанку — больше выворачивать было нечего — и попросил: «Хозяин чащи, укажи дорогу к опушке». Ветерок качнул верхушки берёз — и тропка сама легла под лапы. А на память остался резной посох. В народе знают: Леший в чаще — закон и рост леса; след он может запутать, а гостя — и сам вывести к опушке.',
      'A tale of a crooked path and a bell turned inside out. I did not break twigs or whistle through the whole pine wood. I sat quietly on a stump, turned the bell on my neck inside out — there was nothing else to turn — and asked: “Master of the thicket, show the way to the edge.” A breeze swayed the birch tops — and the path laid itself under my paws. A carved staff remained as a keepsake. Folk know: Leshy in the thicket is the law and the growth of the forest; he can tangle a trail, and he can lead a guest out to the edge himself.',
      'Eğri patika ve ters çevrilmiş çan hikâyesi. Dallar kırmadım, bütün çamlığa ıslık çalmadım. Sessizce kütüğe oturdum, boynumdaki çanı ters çevirdim — ters çevrilecek başka şey yoktu — ve rica ettim: «Sık ormanın efendisi, kenara giden yolu göster». Esinti huş tepelerini salladı — patika kendiliğinden patilerimin altına serildi. Hatıra olarak oymalı bir asa kaldı. Halk bilir: sık ormanda Leshy yasa ve ormanın büyümesidir; izi karıştırabilir, konuğu kenara kendi de çıkarabilir.',
    ),
    lockedHint: L(
      'Сначала Овинник. Леший тропу без очереди не даст.',
      'Ovinnik first. Leshy will not give the path out of turn.',
      'Önce Ovinnik. Leshy sırasız yol vermez.',
    ),
  },
  vodyanoy: {
    name: L('Водяной', 'Vodyanoy', 'Vodyanoy'),
    bookDescription: L(
      'Повелитель рек, омутов и всех, кто плещется. Жадинам прячет рыбу; тем, кто воду уважает, — может и одарить. Без спроса в омут не суйся.',
      'Lord of rivers, pools, and everyone who splashes. He hides the fish from the greedy; those who respect the water he may reward. Do not step into the pool unasked.',
      'Irmakların, girdapların ve su sıçratan herkesin hâkimi. Açgözlüden balığı saklar; suya saygı duyana armağan edebilir. İzinsiz girdaba girme.',
    ),
    bookRewardDescription: L(
      '+1 тайный оберег в инвентарь и раковина на полке.',
      '+1 secret charm in the inventory and a shell on the shelf.',
      'Envantere +1 gizli tılsım ve rafa bir deniz kabuğu.',
    ),
    loseMessage: L(
      'Водяной пригрозил, а я "вышел сухой из воды". Знаешь почему? Я просто туда не полез.',
      'Vodyanoy threatened me, and I “came out of the water dry.” Know why? I simply never went in.',
      'Vodyanoy tehdit etti, ben ise “sudan kuru çıktım.” Neden mi? Oraya hiç girmedim.',
    ),
    trophyDescription: L(
      'Большая речная раковина — внутри шумит дальняя вода.',
      'A large river shell — distant water murmurs inside.',
      'Büyük ırmak kabuğu — içinde uzak su uğuldar.',
    ),
    miniTale: L(
      'Сказ о тихом омуте и сухой лапе. К колесу я не полез: мокрая шерсть мне не к шерсти. Мельник вылил в воду чарку и бросил под лопасти кусок сала целиком, а я сидел на сухом бревне и делал вид, что это моя идея. Водяной плеснул по кругу, будто кивнул, и выкатил к моим лапам большую речную раковину. В народе помнят: дар омуту отдают целиком и на берег сами не напрашиваются.',
      'A tale of a quiet pool and a dry paw. I did not go to the wheel: wet fur is not my fur. The miller poured a cup into the water and threw a piece of fat whole under the blades, while I sat on a dry log and pretended it was my idea. Vodyanoy splashed in a circle, as if he nodded, and rolled a large river shell to my paws. Folk remember: a gift to the pool is given whole, and you do not invite yourself onto the bank.',
      'Sessiz girdap ve kuru pati hikâyesi. Çarka gitmedim: ıslak tüy benim tüyüm değil. Değirmenci suya bir kadeh döktü ve kanatların altına bir parça yağı bütün attı, ben kuru kütükte oturup bunun benim fikrimmiş gibi yaptım. Vodyanoy daire çizerek çalkalandı, başını sallamış gibi, ve patilerime büyük bir ırmak kabuğu yuvarladı. Halk hatırlar: girdaba armağan bütün verilir, kıyıya kendi davet etmezsin.',
    ),
    lockedHint: L(
      'Сначала Леший. Водяной без леса не зовёт.',
      'Leshy first. Vodyanoy does not call without the forest.',
      'Önce Leshy. Vodyanoy ormansız çağırmaz.',
    ),
  },
  dedushka_toptygin: {
    name: L('Дедушка Топтыгин', 'Dedushka Toptygin', 'Dedushka Toptygin'),
    bookDescription: L(
      'Добродушный дух-медведь, сила леса без злобы. Любит мёд и тишину. Заблудшим помогает, жадным — показывает, где выход… другим путём. Настоящая сила рядом с добротой.',
      'A kindly bear-spirit, the strength of the forest without malice. He likes honey and quiet. He helps the lost; the greedy he shows a way out… by another path. Real strength stands next to kindness.',
      'İyi yürekli ayı-ruh, ormanın öfkesiz gücü. Bal ve sessizlik sever. Kaybolana yardım eder, açgözlüye çıkışı gösterir… başka yoldan. Gerçek güç iyiliğin yanındadır.',
    ),
    bookRewardDescription: L(
      '+10 к максимуму энергии навсегда (в HUD: текущая / новый макс.). Открывается ключом из сундука.',
      '+10 to maximum energy forever (HUD: current / new max). Opens with a key from the chest.',
      'Maksimum enerjiye kalıcı +10 (HUD: şu an / yeni maks.). Sandıktan anahtarla açılır.',
    ),
    loseMessage: L(
      'Хрустнул сучок под лапой — и дедушка недовольно ушёл вглубь малинника. Надо бы вести себя потише. Давай попробуем снова.',
      'A twig snapped under a paw — and grandfather went deeper into the raspberries, displeased. We should keep quieter. Let us try again.',
      'Patinin altında dal çıtırdadı — dede hoşnutsuz ahududunun derinlerine gitti. Daha sessiz davranmalı. Yine deneyelim.',
    ),
    trophyDescription: L(
      'Деревянная медвежья лапа — капля мёда ещё блестит.',
      'A wooden bear paw — a drop of honey still shines.',
      'Tahta ayı pençesi — bir damla bal hâlâ parlıyor.',
    ),
    miniTale: L(
      'Сказ о сухой лапе и неподвижном центре. К малине я не полез и в берлогу нос не совал: сел на своей тропе и ждал, пока бор снова станет тихим. К утру на пне лежала резная лапа — будто лес сам оставил знак, а я только усы расправил. В народе помнят: Хозяин остаётся центром чужого леса; кто к нему не напрашивается, тот и шерсть домой несёт сухой.',
      'A tale of a dry paw and a still centre. I did not go to the raspberries or poke my nose into the den: I sat on my own path and waited until the pine wood grew quiet again. By morning a carved paw lay on the stump — as if the forest itself had left a sign, and I only smoothed my whiskers. Folk remember: the Host remains the centre of a forest that is not yours; whoever does not invite himself to him carries his fur home dry.',
      'Kuru pati ve durağan merkez hikâyesi. Ahududuya gitmedim, ine burnumu sokmadım: kendi patikamda oturup çamlık yine susana kadar bekledim. Sabaha kütüğün üstünde oymalı bir pençe yatıyordu — orman kendisi işaret bırakmış, ben yalnız bıyıklarımı düzeltmişim gibi. Halk hatırlar: Ev Sahibi başkasının ormanının merkezi kalır; ona kendini davet etmeyen tüyünü eve kuru taşır.',
    ),
    lockedHint: L(
      'Ключ из сундука. Топтыгин сам не придёт.',
      'A key from the chest. Toptygin will not come on his own.',
      'Sandıktan anahtar. Toptygin kendi gelmez.',
    ),
  },
  poludnica: {
    name: L('Полудница', 'Poludnitsa', 'Poludnitsa'),
    bookDescription: L(
      'Хранительница полей в самый жаркий час. Является в полдень и напоминает: работай с умом, знай меру. Кто слушает землю — того не покарает зноем.',
      'Keeper of the fields at the hottest hour. She appears at noon and reminds you: work with sense, know the measure. Whoever listens to the land, the heat will not punish.',
      'En sıcak saatte tarlaların bekçisi. Öğlede belirir ve hatırlatır: akılla çalış, ölçüyü bil. Toprağı dinleyeni sıcak cezalandırmaz.',
    ),
    bookRewardDescription: L(
      '+15 к максимуму энергии навсегда (в HUD: текущая / новый макс.). Открывается ключом из сундука.',
      '+15 to maximum energy forever (HUD: current / new max). Opens with a key from the chest.',
      'Maksimum enerjiye kalıcı +15 (HUD: şu an / yeni maks.). Sandıktan anahtarla açılır.',
    ),
    loseMessage: L(
      'Зной накрыл полосу, серп сам выпал из лап. Сядем в холодок под берёзой и зайдём снова, когда зенит спадёт.',
      'The heat covered the strip, the sickle slipped from my paws on its own. Let us sit in the cool under the birch and come back when the zenith eases.',
      'Sıcak şeridi kapladı, orak kendiliğinden patilerden düştü. Huşun altında serinde oturup tepe düşünce yine gelelim.',
    ),
    trophyDescription: L(
      'Маленький серп с лентой — полдень помнит тех, кто знает меру.',
      'A small sickle with a ribbon — noon remembers those who know the measure.',
      'Kurdeleli küçük orak — öğle, ölçüyü bilenleri hatırlar.',
    ),
    miniTale: L(
      'Сказ о зените и тени под дубом. Я не стал махать лапой по ржи в самый зной: свернулся в холодке и смотрел, как по меже прошёл лёгкий бег — колос будто вздрогнул и снова стал. К вечеру на траве лежал серп с лентой, а я сделал вид, что это я его стерёг. В народе знают: в полдень нива хочет тени, не лишней спешки.',
      'A tale of the zenith and shade under an oak. I did not wave a paw through the rye in the worst heat: I curled up in the cool and watched a light run pass along the boundary — an ear seemed to shiver and stand again. By evening a sickle with a ribbon lay on the grass, and I pretended I had been guarding it. Folk know: at noon the field wants shade, not extra haste.',
      'Tepe ve meşe altı gölge hikâyesi. En sıcakta çavdarda pati sallamadım: serinde kıvrıldım ve sınır boyunca hafif bir koşu geçerken baktım — başak ürperip yine doğrulmuş gibi. Akşama çimenin üstünde kurdeleli orak yatıyordu, onu ben bekliyormuşum gibi yaptım. Halk bilir: öğlede tarla gölge ister, fazla acele değil.',
    ),
    lockedHint: L(
      'Ключ из сундука. Редкий. Полудница не любит спешку.',
      'A key from the chest. Rare. Poludnitsa dislikes haste.',
      'Sandıktan anahtar. Nadir. Poludnitsa acele sevmez.',
    ),
  },
  rusalka: {
    name: L('Русалка', 'Rusalka', 'Rusalka'),
    bookDescription: L(
      'Дух речных берегов и прибрежных рощ. В белой рубахе и венке, на ветвях берёзы — не «рыбья сказка». Уважай берег и не лезь в омут без нужды.',
      'Spirit of river banks and shore groves. In a white shirt and a wreath, on the birch branches — not a “fish tale.” Respect the bank and do not go into the pool without need.',
      'Irmak kıyılarının ve sahil korularının ruhu. Beyaz gömlek ve çelenkle, huş dallarında — “balık masalı” değil. Kıyıya saygı duy, gerekmeden girdaba girme.',
    ),
    bookRewardDescription: L(
      'Титул «Кот на берегу» и +10 энергии разово (может превысить макс.; в HUD: текущая / макс.). Открывается ключом из сундука.',
      'The title “Cat on the Bank” and +10 energy once (may exceed the max; HUD: current / max). Opens with a key from the chest.',
      '«Kıyıdaki Kedi» unvanı ve bir kez +10 enerji (maksimumu aşabilir; HUD: şu an / maks.). Sandıktan anahtarla açılır.',
    ),
    loseMessage: L(
      'Засмотрелся на венок, шагнул к осоке — и сижу мокрый, а рубаха на берёзе сухая. Берег мой, заводь её. Обсохну и вернусь уже с сухого места.',
      'I stared at the wreath, stepped toward the sedge — and now I sit wet, while the shirt on the birch is dry. The bank is mine, the backwater is hers. I will dry off and come back from dry ground.',
      'Çelenge bakakaldım, sazlığa adım attım — ben ıslak oturuyorum, huştaki gömlek kuru. Kıyı benim, koy onun. Kurulanıp kuru yerden dönerim.',
    ),
    trophyDescription: L(
      'Гребень из речного перламутра — не расчёсывай им чужие сны.',
      'A comb of river mother-of-pearl — do not comb other people’s dreams with it.',
      'Irmak sedefinden tarak — onunla başkasının rüyasını tarama.',
    ),
    miniTale: L(
      'Сказ о белой рубахе и сухом бугре. Я не полез в осоку и не искал хвоста под кувшинками: сел на высоком берегу и пустил по воде венок. На берёзе качнулась белая рубаха без пояса, зелень ушла в заводь, а к лапам прибило перламутровый гребень. В народе помнят: русалка — не рыба с картинки; её неделя на ветках и на ржи, а гостю место на суше.',
      'A tale of a white shirt and a dry knoll. I did not go into the sedge or look for a tail under the water lilies: I sat on the high bank and sent a wreath along the water. A white shirt without a belt swayed on the birch, the greenery went into the backwater, and a mother-of-pearl comb washed up at my paws. Folk remember: a rusalka is not a fish from a picture; her week is on the branches and in the rye, and a guest’s place is on dry land.',
      'Beyaz gömlek ve kuru tümsek hikâyesi. Sazlığa girmedim, nilüferlerin altında kuyruk aramadım: yüksek kıyıda oturup suya bir çelenk saldım. Huşta kuşaksız beyaz gömlek sallandı, yeşillik koya gitti, patilerime sedef bir tarak vurdu. Halk hatırlar: rusalka resimdeki balık değildir; haftası dallarda ve çavdardadır, konuğun yeri karadadır.',
    ),
    lockedHint: L(
      'Ключ из сундука. Эпик. Русалка сама не поётся.',
      'A key from the chest. Epic. Rusalka does not sing herself into being.',
      'Sandıktan anahtar. Epik. Rusalka kendiliğinden söylenmez.',
    ),
  },
  baba_yaga: {
    name: L('Баба-Яга', 'Baba Yaga', 'Baba Yaga'),
    bookDescription: L(
      'Старуха в избушке на курьих ножках. Не просто «злая» — испытует ум, смелость и сердце. Прошедшим испытание может дать совет, дар… или дорогу дальше.',
      'The old woman in a hut on chicken legs. Not simply “wicked” — she tests mind, courage, and heart. Those who pass she may give counsel, a gift… or the road onward.',
      'Tavuk bacaklı kulübedeki kocakarı. Yalnızca “kötü” değil — aklı, yüreği ve cesareti sınar. Sınavı geçenlere öğüt, armağan… ya da ileri yolu verebilir.',
    ),
    bookRewardDescription: L(
      'Титул «Коготь Яги» (в профиле). Трофей — избушка на курьих ножках на полку. Вид из окна «Избушка Яги». Условие: 3 фрагмента.',
      'The title “Yaga’s Claw” (in the profile). Trophy — a hut on chicken legs for the shelf. Window view “Yaga’s Hut.” Requires 3 fragments.',
      '«Yaga’nın Pençesi» unvanı (profilde). Kupa — rafa tavuk bacaklı kulübe. Pencere manzarası «Yaga’nın Kulübesi». Koşul: 3 parça.',
    ),
    loseMessage: L(
      'Избушка не повернула лица: я сунул нос в ставню, не назвавшись. Подождём у столбов и скажем, кто пришёл.',
      'The hut did not turn its face: I poked my nose into the shutter without naming myself. Let us wait by the posts and say who has come.',
      'Kulübe yüzünü çevirmedi: adımı söylemeden kepenge burnumu soktum. Direklerde bekleyip kim geldiğini söyleyelim.',
    ),
    trophyDescription: L(
      'Маленькая избушка на курьих ножках — стоит, куда повернут.',
      'A little hut on chicken legs — it stands whichever way it is turned.',
      'Tavuk bacaklı küçük kulübe — çevrildiği yöne durur.',
    ),
    miniTale: L(
      'Сказ о дымлёных столбах и сытой лапе. К ставням я не стучал и курицей избушку не дразнил: сел у окуренных столбов, назвался и подождал, пока меня накормят да напоят, как гостя на пороге. Хозяйка фыркнула на мой живой дух, хмыкнула — и на лапу легла маленькая избушка. В народе помнят: Яга — рубеж, не курица и не дворовая кумушка; кто пришёл гостем, тому и дорога.',
      'A tale of smoke-cured posts and a fed paw. I did not knock on the shutters or tease the hut like a hen: I sat by the posts smoked with incense, named myself, and waited to be fed and given drink, as a guest at the threshold. The mistress snorted at my living spirit, chuckled — and a little hut settled onto my paw. Folk remember: Yaga is a boundary, not a hen and not a yard gossip; whoever comes as a guest gets the road.',
      'Tütsülenmiş direkler ve tok pati hikâyesi. Kepenklere vurmadım, kulübeyi tavuk gibi kızdırmadım: tütsülü direklerin yanında oturdum, adımı söyledim ve eşikteki konuk gibi doyurulup içirilmeyi bekledim. Hanım canlı ruhuma homurdandı, kıkırdadı — patimin üstüne küçük bir kulübe kondu. Halk hatırlar: Yaga bir sınırdır, tavuk ya da avlu dedikoducusu değil; konuk olarak gelen yolunu bulur.',
    ),
    lockedHint: L(
      'У края чащи столбы пахнут дымом — это порог, не курица.',
      'At the edge of the thicket the posts smell of smoke — this is a threshold, not a hen.',
      'Sık ormanın kenarında direkler duman kokar — bu eşik, tavuk değil.',
    ),
  },
  lada: {
    name: L('Лада', 'Lada', 'Lada'),
    bookDescription: L(
      'Светлая сила красоты, лада и согласия. Где она — там тепло и гармония. Благоволит тем, кто творит доброту и красоту вокруг себя, а не только копит монеты.',
      'A bright power of beauty, harmony, and accord. Where she is, there is warmth and balance. She favors those who make kindness and beauty around them, not only those who hoard coins.',
      'Güzelliğin, uyumun ve anlaşmanın aydınlık gücü. O neredeyse orada sıcaklık ve denge vardır. Yalnız para biriktirene değil, çevresine iyilik ve güzellik katana yüz verir.',
    ),
    bookRewardDescription: L(
      'Трофей — гармония-ваза на полку. Скин избы «Гармония». Условие: 3 фрагмента.',
      'Trophy — a harmony vase for the shelf. Hut skin “Harmony.” Requires 3 fragments.',
      'Kupa — rafa uyum vazosu. Kulübe skini «Uyum». Koşul: 3 parça.',
    ),
    loseMessage: L(
      'Не поймали лад. Зато я поймал свою кружку — обеими лапами, пока стол ещё дрожал. Выдохнем и зайдём снова, когда в горнице станет тихо.',
      'We did not catch the harmony. I did catch my mug — with both paws, while the table was still shaking. Let us breathe out and come back when the room grows quiet.',
      'Uyumu tutamadık. Ama bardağımı tuttum — iki pençeyle, masa hâlâ sallanırken. Nefeslenip oda susunca yine gelelim.',
    ),
    trophyDescription: L(
      'Глиняная гармония-ваза с узким горлом, двумя ручками и простым орнаментом — изба после неё дышит иначе.',
      'A clay harmony vase with a narrow neck, two handles, and a simple ornament — after it the hut breathes differently.',
      'Dar boyunlu, iki kulplu, sade desenli toprak uyum vazosu — ondan sonra kulübe başka türlü nefes alır.',
    ),
    miniTale: L(
      'Сказ о вазе и тихом ладе. В избе снова спорили из-за пустяка, а я не стал разнимать лапами: подвинул на стол глиняную вазу и замолчал, будто дом сам вспомнил слово «лад». Ссора осела, усы остались сухие, а ваза так и стоит — не резной столб с холма, а знак, что своим лучше жить в порядке. В народе помнят: лад — это мир семьи.',
      'A tale of a vase and quiet harmony. They were quarreling in the hut again over a trifle, and I did not pull them apart with my paws: I moved a clay vase onto the table and fell silent, as if the house itself had remembered the word “harmony.” The quarrel settled, my whiskers stayed dry, and the vase still stands — not a carved post from the hill, but a sign that one’s own are better living in order. Folk remember: harmony is the peace of the family.',
      'Vazo ve sessiz uyum hikâyesi. Kulübede yine ufak şey için kavga ettiler, ben patilerimle ayırmadım: masaya toprak vazoyu çektim ve sustum, ev kendisi “uyum” sözünü hatırlamış gibi. Kavga dindi, bıyıklarım kuru kaldı, vazo hâlâ duruyor — tepedeki oymalı direk değil, kendine ait olanların düzende yaşamasının işareti. Halk hatırlar: uyum ailenin barışıdır.',
    ),
    lockedHint: L(
      'Лада без лада не придёт.',
      'Lada will not come without harmony.',
      'Uyum olmadan Lada gelmez.',
    ),
  },
  veles: {
    name: L('Велес', 'Veles', 'Veles'),
    bookDescription: L(
      'Покровитель скота, лесов, тайных троп и земной мудрости. Учит жить в ладу с природой. Уважает заботу о зверях и знание меры — не пустой шум.',
      'Patron of cattle, forests, secret paths, and earthly wisdom. He teaches living in accord with nature. He respects care for beasts and knowledge of measure — not empty noise.',
      'Sığırın, ormanların, gizli patikaların ve yer bilgeliğinin koruyucusu. Doğayla uyum içinde yaşamayı öğretir. Hayvanlara özeni ve ölçüyü bilir — boş gürültüyü değil.',
    ),
    bookRewardDescription: L(
      'Титул «Лапа Велеса» (в профиле). Условие: 6 фрагментов.',
      'The title “Paw of Veles” (in the profile). Requires 6 fragments.',
      '«Veles’in Pençesi» unvanı (profilde). Koşul: 6 parça.',
    ),
    loseMessage: L(
      'Ух, закружились лесные тени, сосны покачали верхушками — не дослушали мы мудрый завет. Наберёмся терпения и спросим вновь.',
      'Ah, the forest shadows spun, the pines swayed their tops — we did not hear the wise counsel through. Let us gather patience and ask again.',
      'Ah, orman gölgeleri döndü, çamlar tepelerini salladı — bilge öğüdü sonuna kadar dinlemedik. Sabredip yine soralım.',
    ),
    trophyDescription: L(
      'Деревянный бюст Велеса с рогами — с полки глядит мудро, без крика.',
      'A wooden bust of Veles with horns — it looks wisely from the shelf, without a shout.',
      'Boynuzlu tahta Veles büstü — raftan bilgece bakar, bağırmadan.',
    ),
    miniTale: L(
      'Сказ о бородке и сухой лапе. Я не кликал его как соседа за печкой и не тащил последние колосья в миску: оставил в поле «Волосу на бородку» и сидел у хлева, где уже висела резная лапа. Стадо перекликнулось, торг на пристани тоже как будто выдохнул, а я сделал вид, что это я сторожил меру. В народе помнят: Велес — скотий и земной, не змей и не песенный дядька.',
      'A tale of a beard of ears and a dry paw. I did not call him like a neighbor behind the stove and did not drag the last ears into my bowl: I left “a beard for Volos” in the field and sat by the barn, where a carved paw already hung. The herd called to one another, the trade at the wharf seemed to breathe out too, and I pretended I had been guarding the measure. Folk remember: Veles is of cattle and of the earth, not a serpent and not a singing uncle.',
      'Sakallık ve kuru pati hikâyesi. Onu ocağın ardındaki komşu gibi çağırmadım, son başakları tasa çekmedim: tarlada “Volos’a sakal” bıraktım ve oymalı pençenin çoktan asılı olduğu ahırın yanında oturdum. Sürü birbirine seslendi, iskeledeki ticaret de nefes vermiş gibi oldu, ben ölçüyü ben bekliyormuşum gibi yaptım. Halk hatırlar: Veles sığırın ve yerindir, yılan ya da türkücü amca değil.',
    ),
    lockedHint: L(
      'Велес терпелив. Тебе стоит поучиться.',
      'Veles is patient. You would do well to learn from that.',
      'Veles sabırlı. Sende de biraz olsun.',
    ),
  },
  koschei_immortal: {
    name: L('Кощей Бессмертный', 'Koschei the Deathless', 'Koschei the Deathless'),
    bookDescription: L(
      'Владыка, чья смерть спрятана далеко. Хранитель тайн и сокровищ. Уважает хитрость и твёрдый дух; грубость и жадность прощает редко — если вообще прощает.',
      'A lord whose death is hidden far away. Keeper of secrets and treasures. He respects cunning and a firm spirit; rudeness and greed he rarely forgives — if he forgives them at all.',
      'Ölümü uzakta saklı hükümdar. Sırların ve hazinelerin bekçisi. Kurnazlığa ve sağlam ruha saygı duyar; kabalığı ve açgözlülüğü nadiren bağışlar — bağışlarsa.',
    ),
    bookRewardDescription: L(
      '+20 к cap монет удачи (до 220) и титул «Разгадчик Смерти». Условие: 5 фрагментов.',
      '+20 to the luck-coin cap (up to 220) and the title “Unraveler of Death.” Requires 5 fragments.',
      'Şans parası tavanına +20 (220’ye kadar) ve «Ölümün Çözücüsü» unvanı. Koşul: 5 parça.',
    ),
    loseMessage: L(
      'Потянулись за лишним сундуком — и замок защёлкнулся! Кощей усмехнулся в сухие усы. Переведём дух и пойдём дорогой разума.',
      'We reached for an extra chest — and the lock snapped shut! Koschei smirked into his dry mustache. Let us catch our breath and go by the road of reason.',
      'Fazla sandığa uzandık — kilit şak diye kapandı! Koschei kuru bıyığına sırıttı. Soluklanıp akıl yoluyla gidelim.',
    ),
    trophyDescription: L(
      'Золотая игла в хрустальном яйце — не ломай, даже из любопытства.',
      'A golden needle in a crystal egg — do not break it, not even from curiosity.',
      'Kristal yumurtada altın iğne — merakından bile kırma.',
    ),
    miniTale: L(
      'Сказ о яйце, которое не цапнули. Я сел напротив худого владыки, знак на камне разобрал сам и на второй сундук даже не посмотрел. Он усмехнулся в сухие усы — и на лапу легло хрустальное яйцо с иглой, целое. В тереме так и помнят: жизнь у него в стороне от плеча, а жадность замок только защёлкивает.',
      'A tale of an egg that was not snatched. I sat opposite the thin lord, read the sign on the stone myself, and did not even look at the second chest. He smirked into his dry mustache — and a crystal egg with a needle, whole, settled onto my paw. In the terem they remember it so: his life lies aside from his shoulder, and greed only snaps the lock shut.',
      'Kapılmayan yumurta hikâyesi. Zayıf hükümdarın karşısına oturdum, taştaki işareti kendim çözdüm, ikinci sandığa bile bakmadım. Kuru bıyığına sırıttı — patimin üstüne iğneli kristal yumurta, bütün, kondu. Teremde böyle hatırlarlar: hayatı omzunun dışında durur, açgözlülük kilidi yalnız kapatır.',
    ),
    lockedHint: L(
      'В тереме блестят сундуки, а ключ — не в сундуке.',
      'Chests gleam in the terem, but the key is not in a chest.',
      'Teremde sandıklar parlar, anahtar sandıkta değil.',
    ),
  },
  chudo_yudo: {
    name: L('Чудо-Юдо', 'Chudo-Yudo', 'Chudo-Yudo'),
    bookDescription: L(
      'Многоголовое чудище вод, древний страж солнечного круга. Его главы смотрят к закату и рассвету, а речную долю ему отдают целиком. После него открывается весенняя глава Ярило, а за ней — финальная глава Перуна.',
      'A many-headed water monster, ancient guardian of the sun circle. Its heads look toward sunset and dawn, and the river’s share is given to it whole. After it the spring chapter of Yarilo opens, and beyond that — the final chapter of Perun.',
      'Çok başlı su yaratığı, güneş dairesinin eski bekçisi. Başları batıya ve şafağa bakar, ırmak payı ona bütün verilir. Ondan sonra Yarilo’nun bahar bölümü açılır, ardından Perun’un son bölümü.',
    ),
    bookRewardDescription: L(
      'Титул «Славянский Герой» (в профиле). Условие: 8 фрагментов.',
      'The title “Slavic Hero” (in the profile). Requires 8 fragments.',
      '«Slav Kahramanı» unvanı (profilde). Koşul: 8 parça.',
    ),
    loseMessage: L(
      'Волна взяла бережок, монета ещё в лапе. Бросим долю целиком и сядем на сухом, пока глубь сама успокоится.',
      'A wave took the little bank, the coin is still in my paw. Let us throw the share whole and sit on dry ground until the deep settles on its own.',
      'Dalga kıyıcığı aldı, madeni para hâlâ patide. Payı bütün atıp derinlik kendiliğinden durulana dek kuruda oturalım.',
    ),
    trophyDescription: L(
      'Фигурка Чудо-Юдо — все головы смотрят в разные стороны, как надо.',
      'A figurine of Chudo-Yudo — every head looks a different way, as it should.',
      'Chudo-Yudo figürü — bütün başlar ayrı yöne bakar, gerektiği gibi.',
    ),
    miniTale: L(
      'Сказ о двух головах и сухой монете. На мост я не лез с загадками и чашу с ним не делил: бросил в воду целую монету и сел на берегу, пока западная гладь приняла закат, а к утру восток будто вернул свет. К лапам прибило каменную фигурку — головы смотрят в разные стороны, как надо. В народе помнят: речному чуду отдают долю целиком и не делают из него школьного стража.',
      'A tale of two heads and a dry coin. I did not climb the bridge with riddles or share a cup with it: I threw a whole coin into the water and sat on the bank while the western surface took the sunset, and by morning the east seemed to return the light. A stone figurine washed up at my paws — the heads look different ways, as they should. Folk remember: the river wonder is given its share whole, and is not made into a schoolroom guardian.',
      'İki baş ve kuru madeni para hikâyesi. Bilmecelerle köprüye çıkmadım, onunla kâse paylaşmadım: suya bütün bir para attım ve batı yüzeyi gün batımını alırken kıyıda oturdum, sabaha doğu ışığı geri vermiş gibi oldu. Patilerime taş bir figür vurdu — başlar ayrı yöne bakar, gerektiği gibi. Halk hatırlar: ırmak mucizesine pay bütün verilir, ondan okul bekçisi yapılmaz.',
    ),
    lockedHint: L(
      'После него откроется весенняя глава.',
      'After him the spring chapter will open.',
      'Ondan sonra bahar bölümü açılır.',
    ),
  },
  yarilo: {
    name: L('Ярило', 'Yarilo', 'Yarilo'),
    bookDescription: L(
      'Игровая глава о весенней силе полей. Имя «Ярило» в русской памяти спорно, зато связь с Яровитом и кругом весны, урожая и смелой силы известна уверенно. Белый конь и зелёные поля напоминают о возвращении весны.',
      'A game chapter about the spring power of the fields. The name “Yarilo” is disputed in Russian memory, but the link with Yarovit and the circle of spring, harvest, and bold strength is known with confidence. A white horse and green fields recall the return of spring.',
      'Tarlaların bahar gücü üzerine bir oyun bölümü. «Yarilo» adı Rus belleğinde tartışmalıdır, ama Yarovit ve bahar, hasat, cesur güç dairesiyle bağı kesindir. Beyaz at ve yeşil tarlalar baharın dönüşünü hatırlatır.',
    ),
    bookRewardDescription: L(
      'Титул «Хранитель весны» (в профиле). Условие: 8 фрагментов.',
      'The title “Keeper of Spring” (in the profile). Requires 8 fragments.',
      '«Baharın Bekçisi» unvanı (profilde). Koşul: 8 parça.',
    ),
    loseMessage: L(
      'У меня две новости. Плохая: весна умчалась быстрее, чем я дожевал мысль. Хорошая: хвост я в посев не записал, так что поле ещё твоё. Соберись и зайди снова, пока щит с листом не стал крышкой для моей миски.',
      'I have two bits of news. The bad one: spring raced off faster than I could finish chewing the thought. The good one: I did not sign my tail up as seed, so the field is still yours. Pull yourself together and come back before the shield with the leaf becomes a lid for my bowl.',
      'İki haberim var. Kötü olan: bahar, düşünceyi çiğnemem bitmeden hızlı kaçtı. İyi olan: kuyruğu ekine yazmadım, tarla hâlâ senin. Toplan ve yapraklı kalkan tasımın kapağı olmadan yine gel.',
    ),
    trophyDescription: L(
      'Небольшой золотой щит с рельефной гравировкой молодого листа — знак Яровита: весенний рост и смелая сила.',
      'A small golden shield with a relief of a young leaf — the sign of Yarovit: spring growth and bold strength.',
      'Genç yaprak kabartmalı küçük altın kalkan — Yarovit’in işareti: bahar büyümesi ve cesur güç.',
    ),
    miniTale: L(
      'Сказ о белом коне и золотом щите. Я вышел на луг, когда трава только поднялась, и не стал спорить с тёплым ветром. Белый конь прошёл по краю, стадо уже тянулось за ним на свежую зелень, а у камня остался небольшой золотой щит с молодым листом — в самый раз накрыть миску, если солнце сядет слишком ярко. В деревне так и помнят: эта сила одевает поле, торопит рост и возвращается по весне, а на полке у нас от неё щит.',
      'A tale of a white horse and a golden shield. I went out to the meadow when the grass had only just risen, and I did not argue with the warm wind. The white horse passed along the edge, the herd already followed him onto the fresh green, and by the stone a small golden shield with a young leaf remained — just right to cover a bowl if the sun sets too brightly. In the village they remember it so: this power clothes the field, hurries growth, and returns in spring, and on our shelf we have its shield.',
      'Beyaz at ve altın kalkan hikâyesi. Çimen yeni kalkınca çayıra çıktım, ılık rüzgârla tartışmadım. Beyaz at kenardan geçti, sürü çoktan taze yeşile onun ardına uzanmıştı, taşın yanında genç yapraklı küçük altın kalkan kaldı — güneş fazla parlak batarsa tası örtmek için tam. Köyde böyle hatırlarlar: bu güç tarlayı giydirir, büyümeyi hızlandırır ve baharda döner, rafta bizde ondan kalkan vardır.',
    ),
    lockedHint: L(
      'Белый конь уже ждёт у весеннего поля.',
      'The white horse already waits by the spring field.',
      'Beyaz at bahar tarlasının kenarında bekliyor.',
    ),
  },
  perun: {
    name: L('Перун', 'Perun', 'Perun'),
    bookDescription: L(
      'Громовержец дружинной руси и славян-воинов. Его имя значит «ударяющий», а священная дубрава на высокой горе хранит память о молнии, дубе и быке. В договорах он стоит рядом с Велесом: это не враги, а разные силы общего мира.',
      'Thunderer of the retinue Rus and of Slavic warriors. His name means “the striker,” and the sacred oak grove on the high hill keeps the memory of lightning, oak, and bull. In the treaties he stands beside Veles: they are not enemies, but different powers of one world.',
      'Drujina Rus’unun ve Slav savaşçılarının gök gürültücüsü. Adı “vuran” demektir, yüksek tepedeki kutsal meşe koruluğu şimşek, meşe ve boğa belleğini tutar. Antlaşmalarda Veles’in yanında durur: düşman değil, tek dünyanın ayrı güçleridir.',
    ),
    bookRewardDescription: L(
      'Атмосфера «Грозовая изба»: мягкое затемнение и редкие вспышки молнии. Владение без авто-включения — выбери во вкладке «Атмосфера». Условие: 10 фрагментов.',
      'Atmosphere “Thunder Hut”: a soft darkening and rare flashes of lightning. Owned, but not switched on by itself — choose it on the Atmosphere tab. Requires 10 fragments.',
      '«Gök Gürültülü Kulübe» atmosferi: yumuşak kararma ve seyrek şimşek. Sahiplik var, kendiliğinden açılmaz — «Atmosfer» sekmesinden seç. Koşul: 10 parça.',
    ),
    loseMessage: L(
      'Гром уже ушёл за дубы, а я всё слушал, как звенит миска. Соберёмся и вернёмся: даже мой хвост знает, где высокая гора.',
      'The thunder has already gone behind the oaks, and I was still listening to the bowl ring. Let us gather and return: even my tail knows where the high hill is.',
      'Gök gürültüsü çoktan meşelerin ardına gitti, ben hâlâ tasın çınlamasını dinliyordum. Toplanıp dönelim: kuyruğum bile yüksek tepenin yerini bilir.',
    ),
    trophyDescription: L(
      'Боевой топор громовержца — тот же знак, что на образе Перуна в книге; трофей для полки.',
      'The thunderer’s battle axe — the same sign as on Perun’s image in the book; a trophy for the shelf.',
      'Gök gürültücünün savaş baltası — kitaptaki Perun suretindeki işaret; raf için kupa.',
    ),
    miniTale: L(
      'Сказ о грозе и далёкой вспышке. Я сидел у окна и считал не громы, а сухие листья — так спокойнее для усов. Над избой вдали мягко сверкнуло, и на траве остался боевой топор — тяжёлый знак громовержца, как в древней памяти. В народе знают: его имя слышно в самой молнии.',
      'A tale of a storm and a distant flash. I sat by the window and counted dry leaves, not thunders — that is calmer for the whiskers. Far above the hut something flashed softly, and a battle axe remained on the grass — a heavy sign of the thunderer, as in ancient memory. Folk know: his name is heard in the lightning itself.',
      'Fırtına ve uzak parıltı hikâyesi. Pencerenin yanında oturup gök gürültülerini değil kuru yaprakları saydım — bıyıklar için daha sakin. Kulübenin üstünde uzakta yumuşakça çaktı, çimenin üstünde bir savaş baltası kaldı — eski bellekteki gibi gök gürültücünün ağır işareti. Halk bilir: adı şimşeğin kendisinde duyulur.',
    ),
    lockedHint: L(
      'Гром ждёт в дубраве на высокой горе.',
      'Thunder waits in the oak grove on the high hill.',
      'Gök gürültüsü yüksek tepedeki meşe koruluğunda bekliyor.',
    ),
  },
};
