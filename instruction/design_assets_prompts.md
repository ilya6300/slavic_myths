# Промпты на отсутствующие изображения

> **Версия:** 1.6  
> **Дата:** 2026-09-10  
> **Автор:** гейм-дизайнер UI/UX (HUD 2.0: дар путника + компаньон Кикиморы)  
> **Правило:** изображения **не генерируем в коде**. До появления файла — только fallback из § «MVP-fallback» или `alt`; **не** рисовать SVG/CSS/сгенерированный арт вместо PNG.  
> **Генерация черновиков/mockup:** skill `.cursor/skills/generate-game-image/SKILL.md` → `instruction/design/`; в `assets/` — только после приёмки.  
> **Агенты:** при отсутствии ассета — обновить промпт здесь; пути — в `assets_catalog.md`.

**Единая точка правды** для художника и генерации. Каждый отсутствующий ассет из `*_layout.md` — **строка с полным промптом** ниже.

---

## Легенда приоритетов

| Приоритет | Когда нужен |
|-----------|-------------|
| P0 | Блокирует MVP избы / онбординг |
| P1 | Полный scope: трофеи, викторина, эпик-сундук |
| P2 | Полировка; допустим CSS-fallback |

---

## Не нужны отдельные промпты

| Ассет | Почему |
|-------|--------|
| `trophy_room_bg.png` | **Удалён.** Комната трофеев = та же изба, камера pan (`izba_scene_layers.md` §2) |
| Фон избы для комнаты 2 | Использовать активный скин `assets/house/` |
| `frame_item_*.png` / `frame_avatar_*.png` | Есть `assets/frame/{common,rate,epic,the_age_of_miracles}.png` |

---

## P0 — правка существующих PNG (не генерация с нуля)

### Стёкла скинов избы — альфа

**Файлы:** `assets/house/hut_standart.png`, `hut_rate.png`, `hut_epic.png`, `hut_the_age_of_miracles.png`  
**Задача:** в проёме окна сейчас чёрная заливка. Заменить на **α = 0**, сохранив наличник и переплёт (крест). Иначе канон «лес → Жирдяй → изба» не собирается (`izba_scene_layers.md` §1.3).

Не генерировать новую избу. Вырезать канал.

### Чёрный центр рамок грейда — альфа

**Файлы:** `assets/frame/common.png`, `rate.png`, `epic.png`, `the_age_of_miracles.png`  
**Задача:** внутренний квадрат прозрачный, резная рама непрозрачная. Нужно для сетки профиля (`profile_layout.md` §5.2).

### Чёрный фон Жирдяя — альфа (если ещё непрозрачный)

**Файл:** `assets/enemy/fatso.png`  
Ладони и силуэт без чёрного прямоугольника.

---

## P0 — HUD и изба

### `assets/ui/icon_energy.png`

**Экран:** HUD, викторина.

```
game HUD icon energy spark, small stylized 3D clay amber hearth spark or lightning curl,
matte tactile finish, warm glow, isolated on solid black background,
readable at 32px, cozy Slavic izba aesthetic,
style reference: assets/furniture/bake.png
--no vector icon, flat design, emoji, line art, photorealistic, neon
```

---

### `assets/ui/icon_coin.png`

```
lucky gold coin disc for casual game HUD, subtle Slavic knot embossing on edge,
stylized 3D clay/plasticine render, warm amber gold matte,
small icon size, solid black background, no text,
style reference: assets/furniture/box_closed.png metal bands
--no vector icon, flat, emoji, realistic coin photograph, UI glyph
```

---

### `assets/ui/icon_obereg.png`

```
small Slavic folk protective amulet talisman, green stone or woven cord on leather,
stylized 3D clay HUD icon, matte tactile, cozy casual game,
isolated black background, no text,
style reference: assets/furniture/book_of_spirits.png green border ornament
--no vector shield icon, flat, emoji, photorealistic jewelry photo
```

---

### `assets/ui/icon_smetana.png`

```
small clay bowl of sour cream smetana, white cream in terracotta bowl,
HUD inventory icon, stylized 3D plasticine, matte, warm tones,
solid black background, no text,
style reference: assets/furniture/bake.png samovar and pots
--no vector, flat, emoji, spoon, text
```

---

### `assets/ui/kikimora_companion.png`

**Экран:** левый рельс HUD главной комнаты (`hud_layout.md` §6). Приоритет **P0**.  
**Не путать** с гравюрой `creatures_in_the_book/kikimora.png` (книга) и полнофигурной `furniture/kikimora_weaving.png` (модалка крафта).

```
Предмет: Кикимора — домашний дух пряжи для казуальной игры «Книга славянских духов». Нужен поясной портрет-компаньон (bust по грудь) для левого края экрана избы, читаемый при высоте около семидесяти двух пикселей на телефоне. Ракурс три четверти, чуть повёрнута к игроку, взгляд хитрый и внимательный, не злой и не комический клоун. В руках или у груди — моток шерсти и намёк на прядение: клубки, нить, тонкая веретено или путаница ниток, чтобы с первого взгляда было ясно: «эта про пряжу и оберег», а не профиль кота.

Стиль: объёмный стилизованный 3D-рендер, будто фигурку вылепили из пластилина или полимерной глины вручную. Формы мягкие, округлые, «толстые», силуэт читается без мелкой штриховки. Поверхность матовая, без глянца и неона; видны следы лепки, лёгкая зернистость, тактильная ткань (домотканый платок, льняная рубаха) и тусклая шерсть клубков. Это тот же пластилин, что у кота и мебели избы, а не белая гравюра на чёрном и не плоская иконка.

Освещение: мягкий студийный свет сверху-сбоку, тёплые объёмные тени под подбородком и под клубками, без жёстких бликов на глазах. Палитра тёплая, насыщенная, но не кислотная: терракота, мёд, беж, коричневый, приглушённый серый, тусклая шерсть цвета неотбелённого льна и чуть зеленоватый домашний платок — в духе избы, не болотный хоррор.

Атмосфера: уютная славянская народная сказка, капризная хозяйка угла, которая может сплести оберег. Без мрака, без диснеевской милоты, без пауков-монстров.

Композиция и фон: только персонаж по грудь, центр кадра, руки с пряжей входят в силуэт. Сплошной чёрный или полностью прозрачный фон, как у PNG в assets/furniture/. На изображении нет текста, водяных знаков, рамок, круглой медальонной обводки и UI-кнопок. Края силуэта чистые — спрайт встанет на рельс без подложки.

Референс стиля: assets/furniture/kikimora_weaving.png (тот же персонаж и пряжа, но здесь только bust, крупнее лицо) и assets/pets/common/cat_standart/cat_standart_sid.png (плотность пластилина, свет, скруглённые формы). Новый файл должен выглядеть так, будто лежал в папке UI рядом с иконками HUD с самого начала — тот же уровень детализации, та же «глиняная» плотность.

Чего не должно быть: векторная графика, плоский flat design, линейная гравюра как в книге духов, белые штрихи на чёрном, иконка UI, круглая рамка, Material Design, тонкие контурные линии, фотореализм, аниме, low poly, неон, глянцевый пластик, рыбий хвост, болото с клюквой, современная одежда, текст на картинке, водяной знак, второй персонаж, кот, изба в кадре.
```

**Технические требования:** PNG, прозрачный фон (генерация на чёрном/белом — вырезать α), без текста на арте, целевой путь `assets/ui/kikimora_companion.png`. Силуэт читается на ночном overlay.

---

### `assets/ui/icon_grass.png`

**Экран:** чип шапки `.hud-grass` (`hud_layout.md` §4.1). Приоритет **P1** (до файла — `yard_grass.png` в 32×32 `contain`).

```
Предмет: иконка ресурса «пучок травы» для HUD казуальной игры «Книга славянских духов». Это не пейзажный куст на дворе, а узнаваемый значок инвентаря: один короткий пучок луговой травы, связанный тонкой ниткой или былинкой, читается как монета или миска сметаны — силуэт с первого взгляда при размере тридцать два пикселя. Ракурс чуть сверху-сбоку, пучок стоит вертикально, несколько стеблей и два-три колоска или широких лезвия, без цветов-букетов и без земли в горшке.

Стиль: объёмный стилизованный 3D-рендер, пластилин / полимерная глина, как у остальных иконок HUD. Формы мягкие, толстые, матовая поверхность со следами лепки. Трава не фотореалистичная осока и не плоский листочек из icon-font.

Освещение: мягкий студийный свет сверху-сбоку, тёплая объёмная тень у основания пучка, без неонового свечения. Палитра: живой луговой зелёный, приглушённый мёд на сухих кончиках, не кислотный салатовый и не болотный чёрный.

Композиция и фон: только пучок в центре кадра, сплошной чёрный или полностью прозрачный фон. Нет текста, рамок, UI, избы, Кикиморы, кота и земли-поляны на весь кадр.

Референс стиля: assets/furniture/yard_grass.png (тот же предмет, но здесь — компактная иконка, крупнее стебли, меньше «куста») и assets/UI/icon_smetana.png (масштаб HUD-иконки, плотность глины, обрезка). Новый файл должен лежать рядом с icon_energy и icon_smetana — тот же уровень детализации.

Чего не должно быть: векторный листок, emoji 🌿, плоский flat, Material Icons, фотография газона, горшок, цветы в букете, текст, водяной знак, рамка, гравюра, неон, глянцевый пластик, персонаж в кадре.
```

**Технические требования:** PNG, прозрачный фон, без текста, путь `assets/ui/icon_grass.png`. Читаемость на ночном overlay в чипе `rgba(40,28,18,0.72)`.

---

### `assets/ui/arrow_right_wood.png`

```
game UI wood arrow button pointing right, carved honey brown clay wood texture,
stylized 3D tactile, matte, cozy casual game navigation,
isolated black background, no text baked in,
style reference: assets/furniture/bench.png
--no vector chevron, flat, material design, thin line icon
```

---

### `assets/ui/arrow_left_wood.png`

```
game UI wood arrow button pointing left, carved honey brown clay wood texture,
stylized 3D tactile, matte, cozy casual game navigation,
isolated black background, no text baked in,
style reference: assets/furniture/bench.png
--no vector chevron, flat, material design, thin line icon
```

---

### `assets/ui/dialog_frame_wood.png`

**Экран:** диалог кота (VN). Nine-slice.

```
visual novel dialogue box frame for bottom screen, carved warm honey wood border,
dark translucent inner area for text, modern clean VN layout,
stylized 3D tactile wood matte, Slavic folk subtle corner carving,
top corners rounded, flat bottom edge, isolated black background,
style reference: assets/house/hut_standart.png + assets/furniture/book_of_spirits.png
--no vector, flat material card, neon, anime frame, text in image
```

---

### `assets/furniture/miracle_chest_closed.png`

```
epic miracle treasure chest closed, dark wood with purple and gold mystical runes,
faint magical glow seeping from lid cracks, stylized 3D clay/plasticine render,
hand-sculpted tactile texture, Slavic folklore magic aesthetic,
solid black background, no text,
style reference: assets/furniture/box_closed.png + purple glow from assets/furniture/box_open.png
--no vector, flat, sci-fi, cyber, anime chest
```

---

### `assets/furniture/miracle_chest_open.png`

```
epic miracle chest open, purple pink golden magical flames and floating stars erupting,
same wood and rune style as closed miracle chest, stylized 3D clay render,
solid black background, no text,
style reference: assets/furniture/box_open.png + assets/furniture/miracle_chest_closed.png
--no vector, flat, watermark, text
```

---

## P1 — Комната трофеев (UI)

### `assets/furniture/shelf.png` (переработка)

> **Текущий файл:** 1024×1024 — placeholder, ломает вёрстку без `width: 11vw` в CSS.  
> **Целевой исходник:** горизонтальная настенная доска **≈ 280×72 px** (соотношение ~4:1).

```
small wall-mounted wooden trophy shelf bracket, single horizontal plank,
two subtle pegs underneath for hanging items, stylized 3D clay/plasticine render,
hand-sculpted warm honey-toned log wood, matte tactile grain,
Slavic izba interior folk craft, compact readable silhouette,
solid black background, no trophies on shelf, no text,
style reference: assets/furniture/bench.png wood tone + assets/house/hut_standart.png
--no vector, flat, giant log stack, full wall bookcase, 3D room mockup, text
```

### `assets/ui/trophy_silhouette.png`

```
empty trophy placeholder blob silhouette, simple rounded clay jar-like shape,
matte dark brown low contrast on solid black background,
stylized 3D clay, no question mark in image,
style reference: assets/furniture/shelf.png
--no vector flat icon, detailed object, text, color fills, bright colors
```

---

## P1 — Трофеи 3D (`assets/trophies/`)

По одному файлу на дух из `list_of_spirits.md` (Домовой — без трофея).  
**MVP-fallback:** `creatures_in_the_book/[spirit].png` в CSS-рамке до появления 3D.

**Handoff сценариста (2026-08-30):** канон трофеев — `list_of_spirits.md` §описание для трофея + мини-сказ. Не путать: **Полевой** = круглый венок; **Овинник** = вертикальный сноп; **Полудница** = серп с лентой (не венок). Суседко = **крошечный** сундук для полки, не игровой `box_closed`.

### Технические требования (все трофеи)

| Параметр | Значение |
|----------|----------|
| Стиль | Пластилиновый 3D (`assets/furniture/box_closed.png`) |
| Ракурс | Фронтальный или лёгкий 3/4, объект «стоит» на полке |
| Масштаб | Palm-sized collectible (~6–8 cm в мире избы); **одинаковый визуальный вес** в сетке |
| В игре | `height: 3.8vh`, `width: auto` (`room_02_trophies_layout.md` §3.3) |
| Фон генерации | **Чистый белый `#FFFFFF`**, однородный, без градиента и тени на фоне |
| Пост-продакшн | Вырезка по ячейкам → `assets/trophies/*.png` с **прозрачным** α (удалить белый) |
| Запрещено | Текст, водяные знаки, подставки/тени на белом поле сетки |

### Мастер-сетка (одно изображение для вырезки)

**Файл черновика:** `instruction/design/drafts/trophies_grid_all_15.png`  
**После вырезки:** 15 файлов в `assets/trophies/` (таблица ниже).

**Сетка:** 5 колонок × 3 строки, **15 ячеек**, равные отступы, объекты по центру ячейки, не пересекают границы.

| Col 1 | Col 2 | Col 3 | Col 4 | Col 5 |
|-------|-------|-------|-------|-------|
| R1: `susedko_chest` | `bannik_broom` | `kikimora_yarn` | `polevoy_wreath` | `ovinnik_sheaf` |
| R2: `leshiy_staff` | `vodyanoy_shell` | `toptygin_paw` | `poludnica_sickle` | `rusalka_comb` |
| R3: `lada_harmony_vase` | `veles_bust` | `yaga_hut` | `koschei_needle` | `chudo_figurine` |

**Aspect ratio генерации:** `16:9` или `3:2` (skill `generate-game-image`, режим `draft_asset`).

**Референсы GenerateImage:** `assets/furniture/box_closed.png`, `assets/house/hut_standart.png`, `assets/creatures_in_the_book/susedko.png` (как эталон духа).

```
SPRITE SHEET: 15 Slavic folklore trophy collectibles for izba wall shelf, arranged in strict 5×3 grid on pure flat white background #FFFFFF,
equal cell spacing, each object centered in its cell, no overlap between cells, no cast shadows on white floor, no labels, no numbers,
ALL objects same visual scale (palm-sized shelf trophies ~6-8cm), stylized 3D clay/plasticine render, hand-sculpted tactile matte texture,
soft rounded chunky shapes, warm studio lighting ON OBJECT ONLY, high readability silhouette,
Slavic izba cozy folk atmosphere, warm terracotta honey beige brown palette,

ROW 1 left to right:
(1) tiny wooden treasure chest slightly open one gold coin peeking — Barabashka returned loot, NOT full gameplay chest,
(2) old bath birch broom faint steam wisps, warm damp wood,
(3) messy tangled black wool yarn ball, cozy creepy,
(4) ROUND circular wreath of wheat ears and wild meadow flowers — NOT vertical sheaf,
(5) TALL vertical golden wheat sheaf bound with twine upright — NOT round wreath,

ROW 2:
(6) wooden walking staff wrapped with green ivy vine,
(7) large river mussel shell pearlescent with tiny water droplets,
(8) carved wooden bear paw trophy one honey drop on claw,
(9) small field sickle with blue ribbon on handle — NOT wreath NOT giant scythe,
(10) ornate silver-blue river comb with seaweed strands,

ROW 3:
(11) terracotta Slavic harmony vase garmoniya narrow neck two side handles red-black folk ornament tiny wildflowers inside,
(12) small wooden bust of Veles with horns wise expression,
(13) tiny hut on chicken legs figurine chunky cute-scary,
(14) delicate crystal egg with golden needle inside Koschei symbol,
(15) small three-headed water monster figurine Chudo-Yudo all heads visible cute-scary clay,

solid uniform white background only, ready for cutout, game asset sheet,
style reference: assets/furniture/box_closed.png + assets/house/hut_standart.png + assets/creatures_in_the_book/brownie.png
--no vector, flat design, line art, black background, grey background, gradient background, drop shadow on background, text, watermark, grid lines, border frame, giant furniture scale, photorealistic, anime, neon, gore, separate ground plane
```

---

### Индивидуальные промпты (после вырезки или отдельная генерация)

Каждый промпт — **белый фон** для единого пайплайна; финальный PNG — с прозрачным α.

#### `assets/trophies/susedko_chest.png` — Суседко (Барабашка)

**Канон сценариста:** крошечный **возвращённый** сундук для полки; не большой сундук удачи на полу. Барабашка вернул почти добровольно.

```
tiny returned treasure chest trophy for izba wall shelf, palm-sized collectible 6-8cm NOT full-size gameplay floor chest,
dark honey-toned wood chest lid slightly ajar, one lucky gold coin peeking from inside gap,
chunky hand-sculpted stylized 3D clay/plasticine render, matte tactile grain, soft rounded edges,
front view slight 3/4, warm studio light on object only,
pure flat white background #FFFFFF uniform no shadow on background,
Slavic izba folklore Barabashka Susedko symbol of returned loot after deal with cat,
style reference: assets/furniture/box_closed.png scale down + assets/creatures_in_the_book/susedko.png character mood
--no vector, flat, line art, giant chest, full furniture chest, floor chest, text, watermark, black background, drop shadow on white
```

#### `assets/trophies/bannik_broom.png` — Банник

**Канон:** старый банный веник, тёплый, будто только с полка; пар и чистота бани.

```
old Russian bathhouse birch broom venik trophy for shelf, still warm from steam,
bundled birch twigs tied with cord, faint translucent steam wisps rising, damp wood texture,
palm-sized collectible stylized 3D clay/plasticine, matte tactile, chunky readable silhouette,
front view, warm humid golden light on object,
pure flat white background #FFFFFF no background shadow,
Slavic banya Bannik spirit trophy, respect and steam aesthetic,
style reference: assets/furniture/box_closed.png clay style + assets/creatures_in_the_book/bannik.png
--no vector, flat, line art, photorealistic, anime, modern plastic broom, text, black background
```

#### `assets/trophies/kikimora_yarn.png` — Кикимора

**Канон:** клубок чёрной спутанной шерсти; не распутывать — трофей хаоса в избе.

```
tangled black wool yarn ball trophy, messy chaotic strands sticking out, cozy horror cute not scary gore,
palm-sized sphere stylized 3D clay render, matte tactile black-grey wool texture,
front view, soft studio light,
pure flat white background #FFFFFF uniform,
Kikimora spirit trophy tangled threads domestic chaos,
style reference: assets/creatures_in_the_book/kikimora.png + assets/furniture/box_closed.png clay material
--no vector, flat, line art, bright rainbow yarn, neat ball, text, black background
```

#### `assets/trophies/polevoy_wreath.png` — Полевой

**Канон:** **круглый** венок из колосьев и полевых цветов; пахнет сеном. **Не** вертикальный сноп (это Овинник).

```
ROUND circular wreath trophy of wheat ears and wild meadow flowers, closed ring shape NOT vertical bundle,
golden straw and small blue yellow wildflowers woven in, harvest field gift Poludnik field spirit,
palm-sized diameter stylized 3D clay/plasticine, matte golden tones,
front view wreath flat facing camera,
pure flat white background #FFFFFF,
style reference: assets/creatures_in_the_book/poludnik.png + assets/view/landscape_standart.jpeg meadow warmth
--no vector, flat, line art, vertical sheaf, bound grain bundle, plastic flowers, black background, oval wreath
```

#### `assets/trophies/ovinnik_sheaf.png` — Овинник

**Канон:** **высокий вертикальный** сноп спелой пшеницы, связан верёвкой. Зерно для овина. **Не** круглый венок.

```
TALL vertical upright golden wheat sheaf trophy bound with rough twine, narrow harvest bundle standing on cut stalk ends,
heavy stored barn grain Ovinnik spirit NOT round wreath NOT horizontal,
palm-sized height taller than width stylized 3D clay render, warm amber grain matte texture,
front view,
pure flat white background #FFFFFF,
style reference: assets/creatures_in_the_book/ovinnik.png + assets/furniture/box_closed.png warm wood tone harmony
--no vector, flat, line art, circular wreath, horizontal sheaf, realistic photo, black background
```

#### `assets/trophies/leshiy_staff.png` — Леший

**Канон:** деревянный посох, обвитый плющом; тропа помнит хозяина леса.

```
wooden forest walking staff trophy wrapped with green ivy vine leaves curling around shaft,
rough brown log wood staff top slightly gnarled, Leshiy forest lord symbol,
palm-sized collectible stylized 3D clay/plasticine, matte green and brown,
slight 3/4 view standing upright,
pure flat white background #FFFFFF,
style reference: assets/creatures_in_the_book/leshiy.png + assets/furniture/bench.png wood grain
--no vector, flat, line art, metal wizard staff, fantasy RPG glowing staff, black background
```

#### `assets/trophies/vodyanoy_shell.png` — Водяной

**Канон:** большая речная раковина; внутри шумит дальняя вода (визуально — глубина, капли).

```
large river mussel shell trophy open slightly showing dark pearlescent interior like distant water,
subtle water droplets on shell surface, blue-grey pearlescent clay finish,
palm-sized collectible stylized 3D plasticine, matte tactile,
front view shell,
pure flat white background #FFFFFF,
Vodyanoy river spirit trophy respect for water,
style reference: assets/creatures_in_the_book/vodyanoy.png + assets/furniture/box_closed.png
--no vector, flat, line art, tropical seashell photo, ocean clam, black background
```

#### `assets/trophies/toptygin_paw.png` — Дедушка Топтыгин

**Канон:** деревянная медвежья лапа; капля мёда на когте. Вырезанная, не живая лапа.

```
carved wooden bear paw trophy flat relief sculpture NOT realistic severed paw no gore,
warm brown carved wood bear paw pad and claws, single golden honey drop glistening on one claw,
palm-sized wall trophy Dedushka Toptygin bear spirit gift,
stylized 3D clay render matte tactile folk carving,
front view,
pure flat white background #FFFFFF,
style reference: assets/creatures_in_the_book/dedushka_toptygin.png + assets/brownie/common/brownie_standart.png warm clay
--no vector, flat, line art, realistic bear claw, blood, fur tuft, black background
```

#### `assets/trophies/poludnica_sickle.png` — Полудница

**Канон:** **маленький серп** с лентой на рукояти. Полдень, мера в работе. **Не** венок (Полевой), **не** большой коса.

```
small field sickle trophy curved blade with short wooden handle, blue fabric ribbon tied on handle end,
midday harvest tool Poludnica spirit NOT wreath NOT giant scythe,
palm-sized collectible stylized 3D clay/plasticine, matte metal-grey blade warm wood handle,
front view blade curving left,
pure flat white background #FFFFFF,
style reference: assets/creatures_in_the_book/poludnica.png + assets/view/landscape_standart.jpeg golden field mood
--no vector, flat, line art, giant scythe, wreath, gore, black background
```

#### `assets/trophies/rusalka_comb.png` — Русалка

**Канон:** гребень из речного перламутра; не расчёсывать чужие сны.

```
ornate Slavic river pearl comb trophy silver-pearl clay tones, decorative folk patterns on spine,
river mother-of-pearl sheen on comb teeth, water spirit Rusalka gift from quiet backwater,
palm-sized collectible stylized 3D plasticine matte pearlescent accents,
front view comb teeth downward,
pure flat white background #FFFFFF,
style reference: assets/creatures_in_the_book/rusalka.png + assets/furniture/book_of_spirits.png subtle gold trim accent
--no vector, flat, line art, modern plastic hair comb product, green seaweed, mermaid, black background
```

#### `assets/trophies/lada_harmony_vase.png` — Лада

**Канон:** глиняная **гармония-ваза** — узкое горло, две ручки, простой орнамент; изба дышит иначе.

```
terracotta Slavic folk harmony vase garmoniya trophy, narrow neck bulbous body TWO side loop handles,
red-black geometric folk ornament painted on clay NOT modern glass NOT western porcelain,
tiny pastel wildflowers inside neck opening, Lada harmony spirit izba trophy,
palm-sized collectible stylized 3D clay render matte warm light on object,
front view,
pure flat white background #FFFFFF,
style reference: assets/creatures_in_the_book/lada.png + assets/pets/common/cat_standart/cat_standart_sid.png warm palette
--no vector, flat, line art, wedding clipart vase, greek amphora, black background
```

#### `assets/trophies/veles_bust.png` — Велес

**Канон:** деревянный бюст с рогами; мудрый взгляд, без крика. Титул «Лапа Велеса» — отдельно в профиле.

```
small wooden bust figurine trophy of Veles Slavic deity, curved horns on head, wise calm face,
earthy brown carved wood texture, shelf figurine NOT metal pendant,
palm-sized height stylized 3D clay matte tactile,
front view bust shoulders included,
pure flat white background #FFFFFF,
style reference: assets/creatures_in_the_book/veles.png + assets/furniture/book_of_spirits.png earthy premium tone
--no vector, flat, line art, Viking metal pendant, realistic marble bust, black background
```

#### `assets/trophies/yaga_hut.png` — Баба-Яга

**Канон:** маленькая избушка на курьих ножках; стоит, куда повернут (фигурка, не архитектурная модель комнаты).

```
tiny Baba Yaga hut on chicken legs figurine trophy, two chicken legs visible under small log hut,
chunky cute-scary folklore house small windows crooked roof, palm-sized collectible,
stylized 3D clay/plasticine matte tactile Slavic fairy tale NOT realistic architecture diorama,
slight 3/4 view,
pure flat white background #FFFFFF,
style reference: assets/creatures_in_the_book/baba_yaga.png + assets/house/hut_standart.png log texture
--no vector, flat, line art, full size izba, modern house, black background
```

#### `assets/trophies/koschei_needle.png` — Кощей Бессмертный

**Канон:** золотая игла в хрустальном яйце; не ломать даже из любопытства.

```
crystal egg trophy with golden needle visible inside egg, delicate translucent egg shell thin golden needle suspended inside,
Koschei death secret symbol fragile precious NOT Faberge luxury overload,
palm-sized collectible stylized 3D clay render soft inner glow in egg only,
front view egg upright,
pure flat white background #FFFFFF,
style reference: assets/creatures_in_the_book/koschei_immortal.png + assets/furniture/box_open.png gold light accent
--no vector, flat, line art, Faberge photo realistic, cracked egg, black background
```

#### `assets/trophies/chudo_figurine.png` — Чудо-Юдо

**Канон:** фигурка со **всеми головами** в разные стороны; многоголовый страж вод.

```
small Chudo-Yudo multi-headed water monster figurine trophy, THREE heads on one chunky body each head looking different direction,
cute-scary stylized folklore NOT hyper horror gore, water guardian final boss collectible,
palm-sized figurine stylized 3D clay matte tactile slight raw claymation finger marks like fatso enemy,
front view all three faces partially visible,
pure flat white background #FFFFFF,
style reference: assets/creatures_in_the_book/chudo_yudo.png + assets/enemy/fatso.png claymation rawness
--no vector, flat, line art, hyper realistic horror, single head, black background
```

---

## P1 — Викторина

### `assets/ui/quiz_panel_wood.png`

```
game UI quiz question panel frame, carved warm honey wood nine-slice border,
empty dark inner area for text, stylized 3D tactile matte,
Slavic folk subtle carving, isolated black background,
style reference: assets/house/hut_standart.png + assets/furniture/book_of_spirits.png
--no vector, flat material card, glassmorphism, text in image
```

### `assets/ui/quiz_answer_wood.png`

```
game UI quiz answer button plank, horizontal carved wood plank,
stylized 3D clay wood, soft shadow, nine-slice capable,
isolated black background, no text,
style reference: assets/furniture/bench.png
--no vector, flat, text baked in, neon button
```

### ~~`assets/quiz/chest_loot_bg.jpeg`~~ — отменён ❌

**Статус:** не используется. Модалка сундука — **без JPEG**; juice через CSS confetti (`ChestLootFx`).

```
Фон модального окна «Сундук удачи» для казуальной игры «Книга славянских духов». Композиция горизонтальная 16:9. Уютный угол русской избы: деревянный пол с тёплым соломенным или льняным ковром, стена из брёвен сруба с грубой фактурой дерева и следами топора. Мягкий золотой свет падает слева, как из окна вне кадра — только тёплое световое пятно на полу и стене, без видимого окна и без леса. В правой нижней трети кадра — пустое чистое место на полу, куда поверх наложат 3D-спрайт сундука; там не должно быть сундука, мебели и персонажей. Слева можно намекнуть на край печи или скамьи, но не доминировать в кадре.

Стиль: кинематографичная живопись, painterly stylized realism — как фоны викторины и интерьер избы в проекте. Тёплая палитра: мёд, терракота, коричневый, беж, приглушённый янтарный свет. Мягкие объёмные тени, без неона и HDR-пересвета. Атмосфера славянской народной сказки: безопасность, предвкушение награды, уют.

Референс стиля: assets/house/hut_standart.png (дерево, тепло интерьера), assets/furniture/box_closed.png (материалы), assets/quiz/bg_banya.jpeg (живописность фона викторины). Повторить стиль референсов по материалу, палитре, освещению и детализации.

Чего не должно быть: векторная графика, flat cartoon, low poly, anime, sci-fi, неон, люди, кот, домовой, готовый сундук на полу, текст, водяной знак, UI-элементы, чёрный студийный фон, зима и снег, сцена пряжи Кикиморы, клубки шерсти, веретено.
```

### `assets/quiz/trophy_tale_bg.jpeg` — модалка «Сказ о победе» ✅

**Экран:** `TrophyModal` — блок `__scene` 16∶9. **Не** комната 2 целиком, **не** Кикимора.

```
Фон модального окна «Сказ о победе» (просмотр трофея) для игры «Книга славянских духов». Композиция горизонтальная 16:9. Фрагмент стены избы с двумя небольшими деревянными полками для трофеев — как комната трофеев при pan, но без всей комнаты целиком. Полки грубого необработанного дерева, следы топора, не современная мебель. Между полками или под ними — свободное центральное место, куда UI наложит один 3D-трофей в рамке; на полках нет предметов, трофеев, статуэток. Тёплый свет свечи или луча создаёт мягкие тени на бревенчатой стене. Фон стены — сруб, медовые и коричневые тона.

Стиль: painterly stylized realism, кинематографичная живопись интерьера — не 3D-рендер UI и не flat. Палитра избы: терракота, мёд, тёмно-коричневый, беж. Без окна с лесом (лес отвлекает от предмета), без персонажей.

Референс стиля: assets/house/hut_standart.png (материал дерева), assets/trophies/rusalka_comb.png (масштаб предметов на полке), assets/quiz/bg_banya.jpeg (живописность). Повторить стиль референсов по тактильности, теплу, детализации.

Чего не должно быть: вектор, flat design, гигантские полки на весь экран, готовые трофеи на полках, люди, кот, текст, watermark, sci-fi, anime, неон, чёрный фон, gradient без текстуры, сцена крафта Кикиморы, клубки шерсти, сундук на полу.
```

### `assets/quiz/bg_izba.jpeg`

```
cozy Slavic izba interior wide 16:9 quest background, warm wooden walls stove bench,
soft painterly stylized realism, golden warm light, no characters, no UI,
style reference: assets/house/hut_standart.png
--no vector, cartoon flat, characters, cat, text
```

### `assets/quiz/bg_les.jpeg`

```
Slavic Russian forest clearing wide 16:9 quest background, birch pine meadow golden hour,
cinematic painterly realism, no characters, no UI,
style reference: assets/view/landscape_standart.jpeg
--no vector, cartoon, izba interior, characters, text
```

### `assets/quiz/bg_banya.jpeg`

> Полный промпт 21:9 — § **P1 — Пейзажи 21:9** ниже (только квест Банника, не скин профиля).

### `assets/quiz/bg_pole.jpeg`

```
wheat field at noon wide 16:9, golden stalks blue sky heat haze,
painterly stylized realism, Poludnitsa field vibe, no characters, no UI,
style reference: assets/view/landscape_standart.jpeg + golden crops
--no vector, cartoon, forest only, characters
```

### `assets/quiz/bg_voda.jpeg`

```
river bank and dark pool omut wide 16:9, reeds calm water reflection,
painterly stylized cool blue-green tones, no characters, no UI,
style reference: assets/view/landscape_standart.jpeg water variant
--no vector, cartoon, ocean beach, characters
```

### `assets/quiz/bg_temnyy_les.jpeg`

```
dark dense Slavic forest wide 16:9, twisted trees low light mist,
painterly stylized ominous but cozy fairy tale, no characters, no UI,
style reference: assets/view/landscape_standart.jpeg brightness 40 percent mood
--no vector, cartoon, bright sunny, urban, horror gore
```

---

## P1 — Скин избы «Гармония» (квест Лады)

> ⏸ **Отложено (2026-09-05):** награда квеста Лады — титул «Гость Лада» + трофей; скин `hut_harmony` не нужен для MVP.

### `assets/house/hut_harmony.png` — изба Лады

**Приоритет:** P1 · **Экран:** `.layer-izba__img`, комнаты 1 и 2 (pan), вкладка «Изба» в профиле.  
**Дроп:** квест Лады (`izba_skin_harmony`, 3 фрагмента). **ID:** `hut_harmony`, грейд `epic`.  
**После PNG (код):** `assetRegistry`, `skinContent.ts`, `profileCatalog.ts`, `skinPools.ts`; в `spirits.ts` — `skinId: 'hut_harmony'` вместо заглушки `hut_rate`.

**Формат:** **21:9** ultrawide panoramic izba interior (как широкий кадр для safe-frame §1.6.1).  
**Окно:** проём с **α = 0** на стёклах; сохранить наличник и перекладину-крест. **Чёрная заливка проёма запрещена** (`izba_scene_layers.md` §1.3, §1.6).

**Композиция:** та же расстановка якорей, что у `hut_standart.png` — окно ~38% / кот ~32% / книга ~70% (`room_01_layout.md` §5). Отличие — **настроение и декор**, не сдвиг мебели.

**Смысл:** тёплая изба гармонии — мягкий свет, лад, красно-чёрный славянский орнамент на брусах, **небольшой букет полевых цветов у порога**, ощущение согласия и уюта. **Не** копировать `hut_rate.png` (холоднее/другой декор) и **не** каменно-неоновый `hut_epic.png`.

**GenerateImage:** `aspect_ratio: "21:9"` · `reference_image_paths`: `assets/house/hut_standart.png`, `assets/trophies/lada_harmony_vase.png` (если черновик есть — иначе `assets/creatures_in_the_book/lada.png`)

```
Slavic izba hut interior panoramic skin ultrawide 21:9, same camera framing and anchor layout as hut_standart,
warm golden harmonious sunlight, soft cozy atmosphere of Lada spirit harmony and beauty,
hand-carved log walls with red-black geometric folk ornament bands, small wildflower bouquet at threshold step,
window opening with TRANSPARENT glass alpha zero showing forest layer behind, preserve wooden cross mullions,
stylized 3D clay/plasticine render hand-sculpted tactile matte finish warm terracotta honey palette,
no characters no cat no furniture overlays baked in, izba shell only,
Match attached reference hut_standart silhouette and window position exactly; ornament mood from Lada harmony vase warm folk red-black patterns.
style reference: assets/house/hut_standart.png + assets/creatures_in_the_book/lada.png
--no vector, flat, line art, black window fill, neon epic stone hut, copy of hut_rate, photorealistic, text, watermark
```

**Постобработка (обязательно):** вырезать α стёкол; проверить композитинг леса через окно в билде. Калибровка книги на подставке — строка `hut_harmony` в `book_stand_skin_adaptive.md` (старт Δ = 0, уточнить по скрину).

**Антипример:** переиспользовать `hut_rate.png` с фильтром; залить окно чёрным; сдвинуть проём относительно standart.

---

## P1 — Пейзажи 21:9 (окно + викторина)

**Формат:** строго **21:9** (ultrawide). Генерация: `GenerateImage`, `aspect_ratio: "21:9"`, референс `assets/view/landscape_standart.jpeg` (+ второй якорь по таблице).

**Композиция для `assets/view/`:** центр кадра — зона оконного проёма избы (~38% ширины сцены); края кадра тоже видны через стёкла с α=0 (`izba_scene_layers.md` §1.4). Без рамки окна на PNG — только пейзаж.

### Источники дропа (канон / рекомендация)

| Файл | ID скина | Где используется | Откуда игрок получает |
|------|----------|------------------|------------------------|
| `landscape_standart.jpeg` | `landscape_standart` | Окно избы, дефолт профиля «Лес» | Старт; **файл заменяется** (обновлённый арт) |
| `landscape_temnyy_les.jpeg` | `landscape_temnyy_les` | Вкладка «Лес» в профиле | **Обычный сундук** (`window_skin`, грейд `rare`). **Не** с квеста: квест Яги даёт `landscape_yaga` (избушка), викторина Яги/Кощея — `bg_temnyy_les` |
| `landscape_omut.jpeg` | `landscape_omut` | Вкладка «Лес» | **Обычный сундук** (`window_skin`, `common` + `epoch`) |
| `landscape_cyber_city.jpeg` | `landscape_cyber_city` | Вкладка «Лес» | **Обычный сундук**, редкий: `window_skin` только в пуле `epoch`, низкий вес (≈ вдвое реже остальных epoch-скинов окна) |
| `landscape_yaga.jpeg` | `landscape_yaga` | Вкладка «Лес» | **Квест Бабы-Яги** (3 фрагмента); избушка **в проёме окна**, не гигант вдали; не путать с `landscape_temnyy_les` |
| `hut_harmony.png` | `hut_harmony` | Вкладка «Изба» | **Квест Лады** (3 фрагмента); грейд `epic`; **не** `hut_rate` / **не** `hut_epic` |
| `quiz/bg_banya.jpeg` | — | Только фон викторины Банника | Квест; **не** в профиле и **не** в сундуке |

> **Код сейчас:** `getWindowSkinIdsByGrade()` возвращает `[]` — сундук не выдаёт скины окна, награда Яги (`window_skin_yaga_hut`) — заглушка. После появления PNG — зарегистрировать id в `viewSkins` / `skinPools` / `skinContent.ts`.

---

### `assets/view/landscape_standart.jpeg` — поле + дальний лес (v3, замена дефолта)

**Приоритет:** P0 · **Экран:** `.layer-forest` / `.window-aperture__forest`, вкладка «Лес» (дефолт).

**Проблема v1–v2:** крупные берёзы и ели в среднем плане — в оконном проёме (~38% ширины сцены) выглядят «в упор к стеклу» и растянуто; нет ощущения глубины «из избы на поле».

**Композиция v3 (канон):**

| Зона кадра | Содержание |
|------------|------------|
| Нижние **50–55%** | Открытое **поле** — золотистая трава, редкие белые полевые цветы, ровный уход к горизонту; **без** стволов и крупных деревьев |
| **Горизонт** ~55% высоты | Чёткая линия холмов |
| Верхние **30–35%** | **Мелкий** дальний лес — сплошная полоска берёз и сосен на холме, атмосферная дымка, деревья маленькие, не доминируют |
| Верх **15%** | Тёплое золотое небо, лёгкая дымка |

**GenerateImage:** `aspect_ratio: "16:9"` → постобработка crop центр **21:9** (1536×658) · `reference_image_paths`: `assets/view/landscape_standart.jpeg`

```
Сюжет: вид из окна русской избы на славянское поле в золотой час — не «лес в лицо», а «избы на луг смотрят».

Композиция: нижняя половина кадра (50–55%) — только открытое золотистое поле с высокой травой и редкими белыми полевыми цветами; ровная перспектива, трава уходит к горизонту. На линии горизонта (~55% высоты) — пологие холмы. За горизонтом — сплошная полоска **мелкого** дальнего леса: берёзы и сосны как маленькие силуэты на гребне холма, лёгкая атмосферная дымка, без отдельных крупных стволов в среднем плане. Верхние 15% — тёплое бледно-золотое небо с мягкой дымкой заката.

Стиль: кинематографичная живопись, painterly realism — не мультяшный flat и не вектор. Свет тёплый, «золотой час»: солнечные блики на траве, длинные мягкие тени, тёплые зелёные и золотистые тона, ощущение сказочной, но живой природы средней полосы России. **Резкость:** читаемая фактура травы в нижней трети; горизонт и дальний лес — чёткие силуэты; **без** тяжёлой дымки, bloom и «мыльного» soft-focus (в оконном проёме ~24% ширины кадра артефакт размытия критичен).

**Постобработка:** crop 21:9 → **2560×1097**, `sharpen sigma≈1.2`, JPEG q95.

Настроение: уют, безопасность, магия леса без угрозы — фон за стеклом избы, не отвлекает от HUD. Центр кадра — зона оконного проёма (~38% ширины сцены); края кадра тоже видны через α-стёкла.

Технические требования: ultrawide 21:9 после crop; без персонажей, животных, построек, рамки окна, UI и текста.

Референс стиля: assets/view/landscape_standart.jpeg — повторить палитру, мягкость мазка, золотой час; **изменить** только перспективу: поле вместо крупных берёз у стекла.

Чего не должно быть: крупные стволы берёз или сосен в переднем и среднем плане; деревья «в упор» к окну; вектор; плоский cartoon; low poly; зима и снег; город; дороги; машины; неон; HDR-пересвет; люди; животные; рамка окна; водяной знак; текст.
```

---

### `assets/view/landscape_temnyy_les.jpeg` — тёмный лес (скин окна, v3)

**Приоритет:** P1 · **Дроп:** обычный сундук, `window_skin`, грейд `rare`.

**Композиция v3:** **не поле**, **не обычная ночь** — **мифический лес тридесятого царства**: узкая лесная тропа/мох внизу (~25%), дальше — глубокий чащобный лес, лунный свет, лёгкое **сказочное** свечение между стволами, дымка **в глубине леса**, не на лугу. Искривлённые берёзы и ели, звёзды сквозь кроны.

**GenerateImage:** `aspect_ratio: "16:9"` → crop **21:9** **2560×1097**, sharpen · `reference_image_paths`: `assets/creatures_in_the_book/leshiy.png`

```
Сюжет: вид из окна на лес **тридесятого царства** — сказочный, мистический, не «ночное поле» и не бытовая ночь за окном.

Композиция: низ (~25%) — тёмная лесная подстилка, мох, корни, тропа; **без** открытого луга и без поля. Основной кадр — глубокий тёмный лес: искривлённые берёзы и ели, синий лунный свет сквозь ветви, едва заметное **магическое** свечение между деревьями (не неон), низкая дымка в **глубине** чащи. Дальние ярусы крон уходят в mystery. Палитра: глубокий сине-зелёный, чёрный, ~40% яркости; уютная славянская сказка, не хоррор.

Стиль: painterly realism, резкие стволы и мох внизу, без bloom на всём кадре. Только пейзаж, без рамки окна, без персонажей.

Референс настроения: assets/creatures_in_the_book/leshiy.png (мифический лес).

Чего не должно быть: открытое поле; луг; «обычная» лунная ночь над поляной; город; неон; крупные стволы вплотную к нижнему краю «как в окно»; рамка окна; текст.
```

---

### `assets/view/landscape_omut.jpeg` — омут (скин окна, v5)

**Приоритет:** P1 · **Дроп:** обычный сундук, `window_skin`, грейды `common` и `epoch`.

**Композиция v5 (разметка владельца):**

| Зона | Высота | Содержание |
|------|--------|------------|
| **Красная** (низ) | ~55% | Только луг с волнами травы |
| **Синяя** (середина) | ~12–15% | **Компактный омут** — овальное зеркало воды по центру, дымка |
| **Верх** | ~30% | Дальний лес + сумеречное небо |

Порядок снизу вверх: **поле → омут → лес**. Без ряда елей между полем и водой.

**GenerateImage:** `aspect_ratio: "16:9"` → crop **21:9** **2560×1097**, sharpen · `reference_image_paths`: mockup владельца + `assets/view/landscape_standart.jpeg`

**GenerateImage:** `aspect_ratio: "16:9"` → crop **21:9** **2560×1097**, sharpen · `reference_image_paths`: `assets/view/landscape_standart.jpeg`

```
Сюжет: вид из окна — луг уходит к **далёкому** омуту; Водяной, без угрозы.

Композиция: **низ ~55%** — только луг (красная зона разметки). **Середина ~28–42% от верха** — компактный овальный омут по центру, ~12% высоты кадра, зеркальная вода, лёгкий туман (синяя зона). **Верх** — дальний лес и сумеречное небо. Снизу вверх: поле → омут → лес; **без** ряда деревьев между полем и водой.

Стиль: только пейзаж (без рамки окна, без стен избы на PNG), painterly, резкая трава. Центр — оконный проём.

Чего не должно быть: крупное озеро в среднем плане; рамка окна; близкий берег; океан; персонажи; текст.
```

---

### `assets/view/landscape_cyber_city.jpeg` — киберпанк-город (скин окна, v7)

**Приоритет:** P1 · **Дроп:** обычный сундук, `window_skin`, грейд `epoch`.

**Композиция v7:** **только улица** — узкий кибер-переулок 2–3 этажа, крупные неоновые вывески magenta/cyan, мокрый асфальт в перспективе. **Без** леса, поля, небоскрёбов-«игл», vertical streak glitch. **Без** персонажей и кота.

**CSS (окно смотрит на верхнюю часть 21:9):** `.window-aperture[data-window-skin='landscape_cyber_city'] .window-aperture__forest { transform: translateY(-62%); }` — сдвиг к уровню улицы.

**GenerateImage:** `aspect_ratio: "16:9"` → crop **21:9** **2560×1097**, sharpen · **не** использовать `cyberpank_sid` (тянет кота в кадр)

```
Сюжет: за окном избы — **только** кибerpunk-улица (конtrast сказки и мегаполиса).

Композиция: узкий кибerpunk-переулок ночью — **низкая** застройка 2–3 этажа, крупные прямоугольные неоновые вывески magenta и cyan, мокрый асфальт с отражениями в перспективе. **Без** леса, поля, небоскрёбов-игл, vertical glitch, персонажей. Палитра неона — как cyberpank, но **без** кота в кадре.

Стиль: painterly cinematic cyberpunk, читаемые фасады и вывески. Центр — оконный проём; в коде `translateY(-62%)` для этого скина.

Чего не должно быть: лес; поле; парк; деревья; трава; medieval; рамка окна; логотипы; текст.
```

---

### `assets/view/landscape_yaga.jpeg` — избушка в окне (скин леса, квест Яги)

> ✅ **В плане (2026-09-08):** `instruction/plans/quest_rewards_lada_yaga.plan.md` — TASK-026/027. Награда Яги: титул + трофей `yaga_hut` + скин `landscape_yaga`.

**Приоритет:** P1 · **Экран:** `.window-aperture__forest`, вкладка «Лес» в профиле.  
**Дроп:** квест Бабы-Яги (`window_skin_yaga_hut`, 3 фрагмента). **ID:** `landscape_yaga`. **Не** сундук; **не** путать с `landscape_temnyy_les` (тёмный лес без избушки).

**GenerateImage:** `aspect_ratio: "21:9"` · `reference_image_paths`: `assets/view/landscape_standart.jpeg`, `assets/creatures_in_the_book/baba_yaga.png`

**Композиция (канон TASK-asset-yaga-window-hut):**

| Параметр | Значение |
|----------|----------|
| Ракурс | Вид **за окном** (слой `WindowAperture`), не фон всей сцены |
| Избушка | **Маленькая**, на курьих ножках, **целиком в зоне оконного проёма** — как диорама за стеклом |
| Масштаб | Высота избушки ≈ **60–75%** высоты оконного проёма на макете (`room_01_layout.md`: проём ~24% ширины inner, `top 22%`) |
| Центр кадра 21:9 | Зона проёма (~38% ширины сцены) — избушка по центру этой зоны |
| Фон | Сумеречный славянский лес вокруг; без персонажей, без рамки окна на PNG |

```
Slavic forest at dusk panorama ultrawide 21:9, view as seen through izba window aperture,
SMALL Baba Yaga hut on chicken legs centered in window zone, entire hut fits inside window opening like miniature diorama behind glass,
hut height roughly 65 percent of window aperture height, two chicken legs visible, crooked log roof tiny windows folkloric cute-scary,
dense pine and birch forest background around hut, cinematic painterly realism warm-to-cool dusk light,
center-weighted composition for window frame at 38 percent scene width, no characters no Baba Yaga figure no window frame on PNG no UI no text,
NOT giant hut dominating whole forest NOT hut far on horizon tiny speck
Match painterly forest language of assets/view/landscape_standart.jpeg; hut folklore scale like palm figurine in window not architecture hero shot.
style reference: assets/view/landscape_standart.jpeg + assets/creatures_in_the_book/baba_yaga.png
--no vector, cartoon, photoreal modern suburban house, giant hut filling frame, hut as tiny dot in distance, urban, horror gore, chicken legs cut off, watermark
```

**После PNG (код):** `viewSkins` / `skinPools` / `skinContent.ts`; заменить заглушку `window_skin_yaga_hut` без ассета.

**Антипример:** избушка на весь кадр 21:9; избушка «где-то вдали» точкой; тот же кадр, что `landscape_temnyy_les` без избушки.

---

### `assets/quiz/bg_banya.jpeg` — баня (только викторина)

**Приоритет:** P1 · **Дроп:** нет · **Квест:** Банник (`locationId: banya`).

**GenerateImage:** `aspect_ratio: "21:9"` · `reference_image_paths`: `assets/furniture/bake.png`, `assets/house/hut_standart.png`

```
Russian bathhouse banya interior panorama ultrawide 21:9 quest background,
wooden walls and birch bench tiers, faint steam haze, warm humid golden light,
stylized painterly realism cozy folk bath not modern spa,
venik birch broom hanging on hook, stove stones glow soft,
no people, no characters, no UI, no text,
Match warm wood and clay tactile mood of izba assets.
style reference: assets/furniture/bake.png + assets/house/hut_standart.png
--no vector, flat, glass shower, marble spa, characters, neon, watermark
```

---

## P2 — Полировка

> `landscape_yaga.jpeg` — перенесён в § **P1 — Пейзажи 21:9** (композиция «избушка в проёме»).

### `assets/view/landscape_night.jpeg`

```
Slavic forest at night from izba window viewpoint, birch silhouettes blue moonlight,
soft painterly realism, magical cozy night, no characters, no UI,
style reference: assets/view/landscape_standart.jpeg
--no vector, cartoon, day scene, urban, bright
```

### `assets/ui/fragment_shard.png`

```
magical epoch era crystal shard fragment, purple-gold inner glow,
small collectible HUD icon, stylized 3D clay crystal, black background,
style reference: assets/furniture/box_open.png star particles
--no vector, flat, realistic diamond stock photo
```

### `assets/ui/bubble_tail.png`

```
speech bubble tail pointer small cream parchment clay shape pointing down,
stylized 3D matte, isolated black background,
style reference: assets/pets/common/cat_standart/cat_standart_sid.png cream fur tone
--no vector sharp triangle, emoji
```

### `assets/ui/badge_grade_common.png`

```
game UI grade badge ribbon common tier, small carved wood fabric tag beige accent,
stylized 3D clay 24px height readable, Slavic folk subtle pattern, black background,
style reference: assets/furniture/book_of_spirits.png
--no vector flat icon, text in image, neon
```

### `assets/ui/badge_grade_rare.png`

```
game UI grade badge ribbon rare tier, carved wood tag soft blue accent,
stylized 3D clay 24px height, Slavic folk pattern, black background,
style reference: assets/furniture/book_of_spirits.png
--no vector flat icon, text in image, neon
```

### `assets/ui/badge_grade_epic.png`

```
game UI grade badge ribbon epic tier, carved wood tag purple gold accent,
stylized 3D clay 24px height, Slavic folk pattern, black background,
style reference: assets/furniture/book_of_spirits.png + assets/furniture/box_open.png purple glow
--no vector flat icon, text in image, neon
```

### `assets/ui/badge_grade_epoch.png`

```
game UI grade badge ribbon epoch era miracles tier, carved wood tag rich gold accent,
stylized 3D clay 24px height, Slavic folk pattern, black background,
style reference: assets/furniture/book_of_spirits.png gold lettering texture
--no vector flat icon, text in image, neon
```

---

## P0 — `assets/illustration_book/` — объёмные иллюстрации бестиария (3D-диорама)

> **Эталон композиции:** `instruction/design/book_bestiary_validation_mockup_v2.png`  
> **Стиль:** volumetric clay/plasticine diorama miniature (НЕ гравюра `creatures_in_the_book/`).  
> **Назначение:** правая страница разворота книги (`book_layout.md` §4).  
> **Черновики:** `instruction/design/drafts/{spirit_id}_illustration_draft.png` → после приёмки → `assets/illustration_book/`.  
> **Фон:** `#000000` для вырезки α; пергамент даёт UI книги.  
> **aspect_ratio:** `3:4` (портрет, `max-height: 58%` страницы).  
> **Референсы (все):** `assets/brownie/common/brownie_standart.png` + `assets/furniture/box_closed.png` + гравюра духа из `assets/creatures_in_the_book/`.

### Общий шаблон (поля `[…]` — уникальны для духа)

```
[ИМЯ / SUBJECT], Slavic folklore spirit in volumetric stylized 3D clay/plasticine diorama miniature scene,
hand-sculpted tactile texture, soft rounded chunky silhouette, matte finish, visible sculpt marks,
miniature themed environment niche: [СЦЕНА / DIORAMA],
warm hearth studio lighting, soft grounded shadow at base, centered portrait composition,
cozy Slavic folk fairy tale atmosphere, bestiary book illustration asset,
Match attached references exactly — same clay material, warm terracotta-honey palette, lighting level as Domovoy mockup.
solid black background, no text, no watermark, no UI, no book spread, no parchment frame, no grade badge,
style reference: assets/brownie/common/brownie_standart.png + assets/furniture/box_closed.png + assets/creatures_in_the_book/[spirit].png
--no vector, flat design, line art engraving, photorealistic, anime, low poly, neon, glossy plastic, horror gore
```

### Layout vs mockup (иллюстрация на странице)

| Зона | Выравнивание | Ширина / object-fit | Примечание |
|------|--------------|---------------------|------------|
| Правая страница (диорама) | center | `max-height: 58%` страницы; `object-fit: contain` | не stretch на всю колонку |
| Бейдж грейда | top-right страницы | отдельный UI (`badge_grade_*`) | **не** в PNG иллюстрации |
| Левая страница | center text block | CTA `max-width`, не 100% | см. mockup v2 |

---

### `assets/illustration_book/brownie.png` — Домовой

**Грейд:** Обычный · **Приоритет:** P0 (эталон серии)

```
Domovoy house spirit, short stout elderly man, huge bushy brown beard and hair, large friendly green eyes, bulbous nose,
coarse patched grey-brown tunic, rope belt, woven bast shoes lapti,
miniature izba kitchen niche diorama: wooden barrel with rope handle, brick pech oven, tiny clay pots on shelf, striped woven rug,
volumetric stylized 3D clay/plasticine diorama miniature, hand-sculpted tactile matte finish,
warm hearth studio lighting, soft shadow at base, centered portrait,
Match book_bestiary_validation_mockup_v2 Domovoy diorama composition and material quality.
solid black background, no text, no badge, no book UI,
style reference: assets/brownie/common/brownie_standart.png + assets/furniture/box_closed.png + assets/creatures_in_the_book/brownie.png
--no vector, flat, line art engraving, photorealistic, anime, neon
```

---

### `assets/illustration_book/susedko.png` — Суседко (Барабашка)

**Грейд:** Обычный

```
Susedko Barabashka house spirit, small furry mischievous creature with fluffy dark brown fur, tiny paws, beady clever eyes, peeking from under floorboards,
miniature diorama under wooden floor gap: floor plank edge, stolen wool sock, tiny wooden chest, dust and crumbs,
volumetric stylized 3D clay/plasticine diorama miniature, hand-sculpted tactile matte finish,
warm studio lighting, soft shadow, centered portrait,
solid black background, no text,
style reference: assets/brownie/common/brownie_standart.png + assets/furniture/box_closed.png + assets/creatures_in_the_book/susedko.png
--no vector, flat, line art, photorealistic, anime, neon, horror
```

---

### `assets/illustration_book/bannik.png` — Банник

**Грейд:** Обычный

```
Bannik bathhouse spirit, stern elderly man with wet grey beard, birch whisk in hand, steam rising, towel on shoulder,
miniature Russian banya diorama: wooden bench, hot stones with steam, birch branches, wooden bucket, dim warm interior,
volumetric stylized 3D clay/plasticine diorama miniature, hand-sculpted tactile matte finish,
warm steamy golden lighting, soft shadow, centered portrait,
solid black background, no text,
style reference: assets/brownie/common/brownie_standart.png + assets/furniture/bake.png + assets/creatures_in_the_book/bannik.png
--no vector, flat, line art, photorealistic, anime, neon
```

---

### `assets/illustration_book/kikimora.png` — Кикимора

**Грейд:** Обычный

```
Kikimora house spirit, thin spindly woman with tangled black hair, sharp nose, spindle in hands, mischievous half-smile,
miniature dark izba corner diorama: tangled black yarn ball, clay pots, broom, shadowy shelf,
volumetric stylized 3D clay/plasticine diorama miniature, hand-sculpted tactile matte finish,
warm dim hearth-side lighting, soft shadow, centered portrait,
solid black background, no text,
style reference: assets/brownie/common/brownie_standart.png + assets/furniture/box_closed.png + assets/creatures_in_the_book/kikimora.png
--no vector, flat, line art, photorealistic, anime, neon, horror gore
```

---

### `assets/illustration_book/poludnik.png` — Полевой

**Грейд:** Обычный · **spiritId:** `poludnik` (не Полудница)

```
Polevoy field spirit Poludnik, cheerful short peasant man in simple shirt, wheat wreath on head, friendly wave,
miniature sunny meadow diorama: rye stalks, wildflowers, wooden boundary stake, green grass mound,
volumetric stylized 3D clay/plasticine diorama miniature, hand-sculpted tactile matte finish,
warm golden hour lighting, soft shadow, centered portrait,
solid black background, no text,
style reference: assets/brownie/common/brownie_standart.png + assets/view/landscape_standart.jpeg + assets/creatures_in_the_book/poludnik.png
--no vector, flat, line art, photorealistic, anime, neon
```

---

### `assets/illustration_book/ovinnik.png` — Овинник

**Грейд:** Обычный

```
Ovinnik granary spirit, sturdy farmer figure with straw in hair and beard, serious protective eyes, arms crossed,
miniature granary barn diorama: tall wheat sheaf tied with rope, wooden barn door, scattered golden grain on floor,
volumetric stylized 3D clay/plasticine diorama miniature, hand-sculpted tactile matte finish,
warm amber barn lighting, soft shadow, centered portrait,
solid black background, no text,
style reference: assets/brownie/common/brownie_standart.png + assets/furniture/box_closed.png + assets/creatures_in_the_book/ovinnik.png
--no vector, flat, line art, photorealistic, anime, neon
```

---

### `assets/illustration_book/leschii.png` — Леший

**Грейд:** Редкий

```
Leshiy forest lord spirit, tall wild man with moss and leaves in long beard and hair, bark-like skin patches, wooden staff with ivy,
miniature forest glade diorama: pine trunk, red mushrooms, ferns, soft moss ground,
volumetric stylized 3D clay/plasticine diorama miniature, hand-sculpted tactile matte finish,
dappled warm forest lighting, soft shadow, centered portrait,
solid black background, no text,
style reference: assets/brownie/common/brownie_standart.png + assets/view/landscape_standart.jpeg + assets/creatures_in_the_book/leshiy.png
--no vector, flat, line art, photorealistic, anime, neon
```

---

### `assets/illustration_book/waterman.png` — Водяной

**Грейд:** Редкий

```
Vodyanoy water spirit, greenish elderly man with algae beard, wet slick skin, frog-like features, kind but eerie eyes,
miniature river omut diorama: murky water pool, reeds, large river shell, lily pad, pebbles,
volumetric stylized 3D clay/plasticine diorama miniature, hand-sculpted tactile matte finish,
cool-warm mixed watery lighting, soft shadow, centered portrait,
solid black background, no text,
style reference: assets/brownie/common/brownie_standart.png + assets/furniture/box_closed.png + assets/creatures_in_the_book/vodyanoy.png
--no vector, flat, line art, photorealistic, anime, neon, horror gore
```

---

### `assets/illustration_book/Grandpa_Toptygin.png` — Дедушка Топтыгин

**Грейд:** Редкий · **spiritId:** `dedushka_toptygin`

```
Dedushka Toptygin bear spirit, friendly anthropomorphic brown bear standing upright, round belly, gentle smile, honey on paw,
miniature forest clearing diorama: tree stump beehive, clay honey pot, wild berries, soft moss,
volumetric stylized 3D clay/plasticine diorama miniature, hand-sculpted tactile matte finish,
warm sunny forest lighting, soft shadow, centered portrait,
solid black background, no text,
style reference: assets/brownie/common/brownie_standart.png + assets/enemy/fatso.png + assets/creatures_in_the_book/dedushka_toptygin.png
--no vector, flat, line art, photorealistic, anime, neon
```

---

### `assets/illustration_book/poludnica.png` — Полудница

**Грейд:** Эпический

```
Poludnitsa midday field guardian, beautiful young woman in white embroidered shirt, flower wreath, holding small sickle with ribbon,
miniature blazing noon rye field diorama: golden wheat, harsh vertical sun rays, heat shimmer suggested softly,
volumetric stylized 3D clay/plasticine diorama miniature, hand-sculpted tactile matte finish,
bright warm midday lighting, soft shadow, centered portrait,
solid black background, no text,
style reference: assets/brownie/common/brownie_standart.png + assets/view/landscape_standart.jpeg + assets/creatures_in_the_book/poludnica.png
--no vector, flat, line art, photorealistic, anime, neon
```

---

### `assets/illustration_book/rusalka.png` — Русалка

**Грейд:** Эпический

```
Rusalka Slavic folk river spirit, fair-haired young woman in loose white linen shirt, wildflower wreath, loose flowing hair,
sitting on bent birch branch above quiet river backwater diorama, pearl comb on small wooden footbridge stone,
calm reflective water, reeds, willow, birch leaves,
volumetric stylized 3D clay/plasticine diorama miniature, hand-sculpted tactile matte finish,
soft cool moonlit warm mix lighting, soft shadow, centered portrait,
solid black background, no text,
style reference: assets/brownie/common/brownie_standart.png + assets/furniture/box_closed.png + assets/creatures_in_the_book/rusalka.png
--no fish tail, mermaid, green seaweed hair, bare shoulders, horror, vector, flat, line art, photorealistic, anime, neon
```

---

### `assets/creatures_in_the_book/rusalka.png` — Русалка (силуэт в книге)

**Канон:** белая гравюра/силуэт — девушка в рубахе и венке на ветке берёзы, без хвоста (стиль серии `creatures_in_the_book/`).

```
white engraved silhouette Rusalka folk spirit, young woman in white shirt and flower wreath sitting on birch branch,
simple book illustration cutout style matching creatures_in_the_book series,
clean high-contrast white figure on transparent or dark cutout, no fish tail,
style reference: assets/creatures_in_the_book/brownie.png + assets/creatures_in_the_book/lada.png
--no mermaid, green hair, horror, color fill, 3D render, photorealistic
```

---

### `assets/illustration_book/lada.png` — Лада

**Грейд:** Эпический

```
Lada goddess of harmony and beauty, radiant gentle woman with flowers in braided hair, warm smile, woven folk dress with red embroidery,
miniature cozy izba windowsill diorama: clay harmony vase with wildflowers, warm sunlight, soft curtains hint,
volumetric stylized 3D clay/plasticine diorama miniature, hand-sculpted tactile matte finish,
warm golden harmonious lighting, soft shadow, centered portrait,
solid black background, no text,
style reference: assets/brownie/common/brownie_standart.png + assets/house/hut_standart.png + assets/creatures_in_the_book/lada.png
--no vector, flat, line art, photorealistic, anime, neon
```

---

### `assets/illustration_book/veles.png` — Велес

**Грейд:** Эпоха чудес

```
Veles Slavic deity of cattle and forest wisdom, horned wise figure with brown fur cloak, calm knowing eyes, wooden staff,
miniature forest shrine diorama: carved wooden horns on post, tiny clay animals at feet, sacred birch trunk,
volumetric stylized 3D clay/plasticine diorama miniature, hand-sculpted tactile matte finish,
mystical warm twilight lighting, soft shadow, centered portrait,
solid black background, no text,
style reference: assets/brownie/common/brownie_standart.png + assets/view/landscape_standart.jpeg + assets/creatures_in_the_book/veles.png
--no vector, flat, line art, photorealistic, anime, neon, horror gore
```

---

### `assets/illustration_book/Baba_Yaga.png` — Баба-Яга

**Грейд:** Эпоха чудес

```
Baba Yaga witch, ancient bony woman with iron-tooth grin, colorful kerchief, gnarled hands, mortar and pestle nearby,
miniature chicken-legged hut diorama: tiny spinning izba on chicken legs, stylized bone fence soft not gory, dark pine trees hint,
volumetric stylized 3D clay/plasticine diorama miniature, hand-sculpted tactile matte finish,
moody warm fairy-tale lighting, soft shadow, centered portrait,
solid black background, no text,
style reference: assets/brownie/common/brownie_standart.png + assets/house/hut_standart.png + assets/creatures_in_the_book/baba_yaga.png
--no vector, flat, line art, photorealistic, anime, neon, horror gore
```

---

### `assets/illustration_book/koschei.png` — Кощей Бессмертный

**Грейд:** Эпоха чудес · **spiritId:** `koschei_immortal`

**Образ (паспорт сценариста, v2):**

| Поле | Канон |
|------|--------|
| **Кто** | Один из великих владык **тридевятого царства**; ему **более 1000 лет** |
| **Тело** | **Скелет** — не живой старец; древний бессмертный воин-царь |
| **Корона** | **Зубчатая** (шипастая) корона на черепе |
| **Поза** | **Сидит** на троне в тронном зале |
| **Доспехи** | **Разбитые** латные доспехи — в них выиграл **не одну тысячу битв**; трещины, вмятины, отсутствующие куски |
| **Фон** | **За спиной — сокровища:** золото, сундуки, цепи, монеты (намёк на владыку тайн, не жадность ради жадности) |
| **Без яйца** | На портрете книги **нет яйца и иглы** — трофей `koschei_needle` отдельно |
| **Тон** | Эпос эпохи чудес: древность, сила, тайна — но в **пластилиновой диораме** книги, не хоррор-арт |

```
Koschei the Deathless, ancient skeleton lord over 1000 years old, great ruler of the three-ninth fairy kingdom,
skeletal face and bony hands visible, spiked toothed iron crown on skull, sitting on stone throne in throne hall,
wearing cracked broken battle-worn plate armor with dents and missing pieces, won over one thousand battles,
treasure hoard behind his back: gold coins piles wooden chests chains glowing softly,
miniature throne hall diorama on circular base, volumetric stylized 3D clay plasticine miniature,
hand-sculpted tactile matte finish, dramatic warm torchlight with soft purple epoch accent, soft shadow, centered portrait,
NO egg NO needle NO orb in scene,
solid black background, no text,
style reference: assets/brownie/common/brownie_standart.png + instruction/design/drafts/brownie_illustration_draft.png + assets/creatures_in_the_book/koschei_immortal.png
--no vector, flat, line art, photorealistic, anime, neon, cute, egg, needle, crystal ball, modern armor
```

---

### `assets/illustration_book/chudo_yodo.png` — Чудо-Юдо

**Грейд:** Эпоха чудес

```
Chudo-Yudo multi-headed water monster, three friendly-serious clay heads on one stout body, scaly texture stylized soft, ancient guardian pose,
miniature river ford diorama: rocky shore, shallow water, each head looking different direction,
volumetric stylized 3D clay/plasticine diorama miniature, hand-sculpted tactile matte finish,
mystical watery warm lighting, soft shadow, centered portrait,
solid black background, no text,
style reference: assets/brownie/common/brownie_standart.png + assets/furniture/box_closed.png + assets/creatures_in_the_book/chudo_yudo.png
--no vector, flat, line art, photorealistic, anime, neon, horror gore
```

---

## MVP-fallback без генерации

| Нужен | Временно |
|-------|----------|
| `miracle_chest_*.png` | `box_closed/open` + `filter: hue-rotate(260deg) saturate(1.4)` |
| `assets/trophies/*.png` | `creatures_in_the_book/[spirit].png` + CSS wooden frame |
| `bg_*.jpeg` | `landscape_standart.jpeg` / `hut_standart.png` + CSS filters |
| `landscape_night.jpeg` | `landscape_standart.jpeg` + `brightness(0.4) hue-rotate(200deg)` |
| HUD-иконки | Цветной круг + `alt` (только dev, не прод) |
| `kikimora_companion.png` | кроп bust `furniture/kikimora_weaving.png` (`object-position: 50% 12%`), **не** `creatures_in_the_book/kikimora.png`, **не** круг с бордером `#8b6914` |
| `icon_grass.png` | `furniture/yard_grass.png` 32×32 `contain` в `.hud-grass` |

---

## Таблица покрытия (аудит)

Каждый пункт из лейаутов должен иметь строку выше.

| Файл | P | Раздел | Статус |
|------|---|--------|--------|
| `icon_energy.png` | P0 | HUD | ✅ |
| `icon_coin.png` | P0 | HUD | ✅ |
| `icon_obereg.png` | P0 | HUD | ✅ |
| `icon_smetana.png` | P0 | HUD | ✅ |
| `kikimora_companion.png` | P0 | HUD рельс | ⏳ промпт §P0 |
| `icon_grass.png` | P1 | HUD ресурс травы | ⏳ промпт §P0; fallback `yard_grass.png` |
| `arrow_right_wood.png` | P0 | Навигация | ✅ |
| `arrow_left_wood.png` | P0 | Навигация | ✅ |
| `dialog_frame_wood.png` | P0 | Диалог кота | ✅ |
| `miracle_chest_closed.png` | P0 | Изба | ✅ |
| `miracle_chest_open.png` | P0 | Изба | ✅ |
| `trophy_silhouette.png` | P1 | Трофеи | ✅ |
| `trophies_grid_all_15.png` (draft) | P1 | Трофеи сетка | ✅ |
| `trophies/*.png` ×15 | P1 | Трофеи | ✅ |
| `quiz_panel_wood.png` | P1 | Викторина | ✅ |
| `quiz_answer_wood.png` | P1 | Викторина | ✅ |
| `quiz/bg_*.jpeg` ×6 | P1 | Викторина | ✅ |
| `landscape_night.jpeg` | P2 | Окно | ✅ |
| `landscape_standart.jpeg` (v2, 21:9) | P0 | Окно дефолт | ✅ §P1 |
| `landscape_temnyy_les.jpeg` | P1 | Скин окна; сундук rare | ✅ §P1 |
| `landscape_omut.jpeg` | P1 | Скин окна; сундук | ✅ §P1 |
| `landscape_cyber_city.jpeg` | P1 | Скин окна; сундук epoch редкий | ✅ §P1 |
| `quiz/bg_banya.jpeg` (21:9) | P1 | Викторина Банник | ✅ §P1 |
| ~~`quiz/chest_loot_bg.jpeg`~~ | — | Отменён; сундук без JPEG + confetti | ❌ |
| `quiz/trophy_tale_bg.jpeg` | P0 | Модалка трофея | ✅ §quiz/trophy_tale |
| `quiz/kikimora_craft_bg.jpeg` | P0 | **Только** крафт Кикиморы | ✅ не переиспользовать |
| `landscape_yaga.jpeg` | P1 | Скин леса (квест Яга); избушка в проёме | ✅ §P1 |
| `hut_harmony.png` | P1 | Скин избы (квест Лада) | ✅ §P1 |
| α-стёкла `hut_*.png` | P0 | Композитинг избы | ✅ задача |
| α-центр `frame/*.png` | P0 | Профиль | ✅ задача |
| ~~`trophy_room_bg.png`~~ | — | — | ❌ удалён (та же изба) |
| `bubble_tail.png` | P2 | Диалог | ✅ |
| `badge_grade_*.png` ×4 | P2 | UI | ✅ |
| `illustration_book/*.png` ×16 | P0 | Книга бестиарий | ✅ промпты §3D-диорама |
| ~~`trophy_room_bg.png`~~ | — | — | ❌ удалён (та же изба) |

---

## Чеклист арт-директора

- [ ] Каждый промпт содержит `style reference: assets/...`
- [ ] Каждый промпт содержит `--no vector, flat...`
- [ ] PNG объектов — прозрачный α в `assets/`; генерация на **белом** `#FFFFFF`, вырезка из сетки
- [ ] Фоны — без персонажей и UI
- [ ] Все 15 трофеев из `list_of_spirits.md` перечислены
- [ ] Нет лишних фонов комнат при единой избе
- [ ] Стёкла избы и центр рамок — альфа, не чёрная заливка
