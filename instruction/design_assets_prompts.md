# Промпты на отсутствующие изображения

> **Версия:** 1.2  
> **Дата:** 2026-08-28  
> **Автор:** гейм-дизайнер UI/UX (исправлено по ревью критика)  
> **Правило:** изображения **не генерируем в коде**. До появления файла — только fallback из § «MVP-fallback» или `alt`; **не** рисовать SVG/CSS/сгенерированный арт вместо PNG.  
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

### `assets/trophies/susedko_chest.png`

```
small returned treasure chest trophy collectible, wooden chest slightly ajar,
stylized 3D clay/plasticine, hand-sculpted, warm studio light, black background,
Slavic izba folklore, symbol of Baraбашka returning loot,
style reference: assets/furniture/box_closed.png + assets/creatures_in_the_book/susedko.png
--no vector, flat, line art, giant chest, text
```

### `assets/trophies/bannik_broom.png`

```
old bath broom with faint steam wisps, trophy collectible on shelf,
stylized 3D clay/plasticine render, matte, Slavic bathhouse aesthetic,
solid black background, no text,
style reference: assets/furniture/box_closed.png + assets/creatures_in_the_book/bannik.png
--no vector, flat, line art, photorealistic, anime
```

### `assets/trophies/kikimora_yarn.png`

```
tangled black wool yarn ball trophy, messy cozy horror cute,
stylized 3D clay render, matte tactile, black background,
style reference: assets/creatures_in_the_book/kikimora.png + assets/furniture/shelf.png
--no vector, flat, line art, bright colors, text
```

### `assets/trophies/polevoy_wreath.png`

```
wreath of wheat ears and wild field flowers, harvest trophy,
stylized 3D clay/plasticine, golden straw tones, matte,
solid black background, no text,
style reference: assets/creatures_in_the_book/poludnik.png + assets/view/landscape_standart.jpeg meadow tones
--no vector, flat, line art, plastic flowers
```

### `assets/trophies/ovinnik_sheaf.png`

```
golden wheat sheaf bound with twine, heavy harvest trophy,
stylized 3D clay render, warm amber grain texture, matte,
black background, no text,
style reference: assets/creatures_in_the_book/ovinnik.png + assets/furniture/box_closed.png wood tone
--no vector, flat, line art, realistic photo
```

### `assets/trophies/leshiy_staff.png`

```
wooden walking staff wrapped with ivy vine, forest spirit trophy,
stylized 3D clay/plasticine, green ivy on brown wood, matte,
solid black background, no text,
style reference: assets/creatures_in_the_book/leshiy.png + assets/furniture/bench.png wood
--no vector, flat, line art, metal staff, fantasy RPG prop
```

### `assets/trophies/vodyanoy_shell.png`

```
large river mussel shell trophy, subtle water droplets, pearlescent clay finish,
stylized 3D plasticine, matte, black background,
style reference: assets/creatures_in_the_book/vodyanoy.png + assets/furniture/box_closed.png
--no vector, flat, line art, realistic seashell photo
```

### `assets/trophies/toptygin_paw.png`

```
carved wooden bear paw trophy with single drop of honey on claw,
stylized 3D clay render, warm brown wood, matte tactile,
solid black background, no text,
style reference: assets/creatures_in_the_book/dedushka_toptygin.png + assets/brownie/common/brownie_standart.png
--no vector, flat, line art, realistic bear claw, gore
```

### `assets/trophies/poludnica_wreath.png`

```
wreath of cornflowers and daisies, midday field trophy,
stylized 3D clay/plasticine, blue and white petals, matte,
black background, no text,
style reference: assets/creatures_in_the_book/poludnica.png + assets/view/landscape_standart.jpeg
--no vector, flat, line art, plastic wreath
```

### `assets/trophies/rusalka_comb.png`

```
ornate river comb with seaweed strands, silver-blue clay tones,
stylized 3D plasticine trophy, matte, black background,
style reference: assets/creatures_in_the_book/rusalka.png + assets/furniture/book_of_spirits.png gold trim accent
--no vector, flat, line art, modern hair comb product photo
```

### `assets/trophies/lada_wreath.png`

```
flower wreath with ribbons, harmony and beauty trophy, soft pastel clay flowers,
stylized 3D render, matte, warm light, black background,
style reference: assets/creatures_in_the_book/lada.png + assets/pets/common/cat_standart/cat_standart_sid.png warm palette
--no vector, flat, line art, wedding generic clipart
```

### `assets/trophies/veles_amulet.png`

```
horn amulet on leather cord, Slavic Veles talisman trophy,
stylized 3D clay, dark horn and brown cord, matte,
solid black background, no text,
style reference: assets/creatures_in_the_book/veles.png + assets/furniture/book_of_spirits.png
--no vector, flat, line art, Viking metal pendant photo
```

### `assets/trophies/yaga_hut.png`

```
tiny hut on chicken legs figurine trophy, folklore Baba Yaga house,
stylized 3D clay/plasticine, chunky cute-scary, matte,
black background, no text,
style reference: assets/creatures_in_the_book/baba_yaga.png + assets/house/hut_standart.png wood
--no vector, flat, line art, realistic architectural model
```

### `assets/trophies/koschei_needle.png`

```
golden needle inside crystal egg trophy, Koschei death secret symbol,
stylized 3D clay render, delicate egg and thin needle, matte glow,
solid black background, no text,
style reference: assets/creatures_in_the_book/koschei_immortal.png + assets/furniture/box_open.png gold light
--no vector, flat, line art, Faberge photo realistic
```

### `assets/trophies/chudo_figurine.png`

```
small multi-headed water monster figurine trophy Chudo-Yudo,
three heads on one body stylized cute-scary, stylized 3D clay,
matte tactile, black background, no text,
style reference: assets/creatures_in_the_book/chudo_yudo.png + assets/enemy/fatso.png claymation rawness
--no vector, flat, line art, hyper realistic horror
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

```
Russian bathhouse interior steam banya wide 16:9, birch benches faint steam,
warm humid painterly stylized, no people, no UI,
style reference: assets/furniture/bake.png warm tones + assets/house/hut_standart.png wood
--no vector, flat, modern spa, characters
```

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

## P2 — Полировка

### `assets/view/landscape_yaga.jpeg`

**Экран:** скин леса (вкладка «Лес» в профиле), награда Яги. Приоритет P1.

```
Slavic forest at dusk from izba window, Baba Yaga hut on chicken legs visible in the distance among pines,
same painterly realism and golden-to-cool light as assets/view/landscape_standart.jpeg,
no characters in foreground, no UI, no text,
chicken-leg izba small in midground, folkloric not horror gore
--no vector, cartoon, photoreal modern house, urban, watermark
```

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

## MVP-fallback без генерации

| Нужен | Временно |
|-------|----------|
| `miracle_chest_*.png` | `box_closed/open` + `filter: hue-rotate(260deg) saturate(1.4)` |
| `assets/trophies/*.png` | `creatures_in_the_book/[spirit].png` + CSS wooden frame |
| `bg_*.jpeg` | `landscape_standart.jpeg` / `hut_standart.png` + CSS filters |
| `landscape_night.jpeg` | `landscape_standart.jpeg` + `brightness(0.4) hue-rotate(200deg)` |
| HUD-иконки | Цветной круг + `alt` (только dev, не прод) |

---

## Таблица покрытия (аудит)

Каждый пункт из лейаутов должен иметь строку выше.

| Файл | P | Раздел | Статус |
|------|---|--------|--------|
| `icon_energy.png` | P0 | HUD | ✅ |
| `icon_coin.png` | P0 | HUD | ✅ |
| `icon_obereg.png` | P0 | HUD | ✅ |
| `icon_smetana.png` | P0 | HUD | ✅ |
| `arrow_right_wood.png` | P0 | Навигация | ✅ |
| `arrow_left_wood.png` | P0 | Навигация | ✅ |
| `dialog_frame_wood.png` | P0 | Диалог кота | ✅ |
| `miracle_chest_closed.png` | P0 | Изба | ✅ |
| `miracle_chest_open.png` | P0 | Изба | ✅ |
| `trophy_silhouette.png` | P1 | Трофеи | ✅ |
| `trophies/*.png` ×15 | P1 | Трофеи | ✅ |
| `quiz_panel_wood.png` | P1 | Викторина | ✅ |
| `quiz_answer_wood.png` | P1 | Викторина | ✅ |
| `quiz/bg_*.jpeg` ×6 | P1 | Викторина | ✅ |
| `landscape_night.jpeg` | P2 | Окно | ✅ |
| `landscape_yaga.jpeg` | P1 | Скин леса (Яга) | ✅ |
| α-стёкла `hut_*.png` | P0 | Композитинг избы | ✅ задача |
| α-центр `frame/*.png` | P0 | Профиль | ✅ задача |
| ~~`trophy_room_bg.png`~~ | — | — | ❌ удалён (та же изба) |
| `bubble_tail.png` | P2 | Диалог | ✅ |
| `badge_grade_*.png` ×4 | P2 | UI | ✅ |
| ~~`trophy_room_bg.png`~~ | — | — | ❌ удалён (та же изба) |

---

## Чеклист арт-директора

- [ ] Каждый промпт содержит `style reference: assets/...`
- [ ] Каждый промпт содержит `--no vector, flat...`
- [ ] PNG объектов — чёрный/прозрачный фон
- [ ] Фоны — без персонажей и UI
- [ ] Все 15 трофеев из `list_of_spirits.md` перечислены
- [ ] Нет лишних фонов комнат при единой избе
- [ ] Стёкла избы и центр рамок — альфа, не чёрная заливка
