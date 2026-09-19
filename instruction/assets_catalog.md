# Реестр ассетов

> **Единая точка правды** по путям изображений. Агенты ищут ассеты **только здесь** и в `design_assets_prompts.md` (промпты на отсутствующие).  
> **Канон пути:** всегда `assets/` (нижний регистр), прямые слэши `/`.  
> **Дефолт избы:** `assets/house/hut_standart.png`.

**Связанные файлы:** `design_assets_prompts.md` (промпты) · `hud_layout.md` (шапка и рельс HUD) · `izba_scene_layers.md` (слои) · `book_layout.md` (анимации бестиария) · `profile_layout.md` (рамки, сетка) · `room_01_layout.md` / `room_02_trophies_layout.md` (позиции) · `list_of_spirits.md` (портреты духов) · `technical_requirements.md` (реестр в коде).

---

## Правила для агентов

1. **Не придумывать пути** — брать из этой таблицы или добавить строку сюда перед использованием.
2. **Не рисовать заглушки** вместо отсутствующих PNG/JPEG: не генерировать арт в коде, не SVG/CSS-картинки. Промпт → `design_assets_prompts.md`; черновик/mockup → skill `.cursor/skills/generate-game-image/` → `instruction/design/`.
3. **MVP-fallback** (до появления файла): `alt` + CSS-фильтр на существующий ассет — см. `design_assets_prompts.md` § «MVP-fallback».
4. **Одна изба** — комната 1 и 2 используют один `assets/house/` (+ активный скин), без отдельного фона трофеев.

---

## Структура папок

| Папка | Назначение | Грейды / примечание |
|-------|------------|---------------------|
| `assets/house/` | Скины интерьера избы | Дефолт: `hut_standart.png`. Суффикс **`rate`** = грейд `rare` |
| `assets/view/` | Вид из окна (пейзаж) | Дефолт: `landscape_standart.jpeg` |
| `assets/pets/` | Скины кота | `common`, `rate` (= rare), `epic`, `the_age_of_miracles` |
| `assets/brownie/` | Скины домового | те же грейд-папки |
| `assets/furniture/` | Мебель, сундуки, книга | — |
| `assets/enemy/` | Враги: за окном и в избе | Жирдяй: `fatso.png`; Суседко при краже: `susedko.png` |
| `assets/creatures_in_the_book/` | Портреты духов (гравюра) | Один PNG на духа; викторина, силуэты, fallback |
| `assets/illustration_book/` | Цветные иллюстрации для разворота бестиария | Один PNG на духа; правая страница книги |
| `assets/trophies/` | 3D-трофеи на полках | 15 файлов (без Домового) |
| `assets/quiz/` | Фоны викторины | По ID локации духа |
| `assets/frame/` | Рамки грейда (профиль, HUD-аватар, сетка) | `common.png`, `rate.png`, `epic.png`, `the_age_of_miracles.png` |
| `assets/UI/` | Иконки HUD (факт на диске, PascalCase) | см. § UI |
| `assets/ui/` | Канон путей для нового UI (стрелки, nine-slice) | См. § UI |

---

## `assets/house/` — скины избы

Стёкла **должны быть α = 0** (`izba_scene_layers.md` §1.3). Сейчас проём чёрный — P0 вырезать.

| Файл | Грейд (код) | Статус | Примечание |
|------|-------------|--------|------------|
| `hut_standart.png` | `common` | ✅ есть | **Дефолт.** Комнаты 1 и 2, pan камеры |
| `hut_rate.png` | `rare` | ✅ есть | Суффикс `rate`, не `rare` |
| `hut_epic.png` | `epic` | ✅ есть | Камень / неон — другой материал, тот же слот окна |
| `hut_the_age_of_miracles.png` | `epoch` | ✅ есть | |
| `hut_harmony.png` | `epic` | ✅ | Квест Лады; id `hut_harmony`; **не** `hut_rate` / **не** `hut_epic`; 21:9, α-стёкла |

---

## `assets/view/` — вид из окна

| Файл | Статус | Примечание |
|------|--------|------------|
| `landscape_standart.jpeg` | ✅ есть | День, дефолт |
| `landscape_night.jpeg` | ⏳ нужен (P2) | Ночь текущего скина; не отдельная ячейка профиля |
| `landscape_yaga.jpeg` | ✅ | Квест Бабы-Яги; id `landscape_yaga`; избушка **в проёме окна**, 21:9 |

---

## `assets/pets/` — кот

**Структура:** `assets/pets/{grade_folder}/{skin_id}/`  
Папка **`rate`** = грейд `rare`. Полный список id для сетки профиля — `profile_layout.md` §6.1.

| Путь | Статус | Примечание |
|------|--------|------------|
| `common/cat_standart/cat_standart_sid.png` | ✅ есть | Сидит, кликабельный; кроп морды = HUD-аватар |
| `common/cat_standart/cat_standart_sleep.png` | ✅ есть | Сон |
| `rare/cat_pilgrim/cat_pilgrim_sid.png` | ✅ есть | IAP «Дар путника», путник |
| `rare/cat_pilgrim/cat_pilgrim_sleep.png` | ✅ есть | Сон |
| прочие `*_sid.png` / `*_sleep.png` | ✅ есть | См. `profile_layout.md` |

Референс для диалога кота: `[skin]_sid.png` из активного скина. HUD не использует sleep.

---

## `assets/brownie/` — домовой

| Путь | Грейд | Статус |
|------|-------|--------|
| `common/brownie_standart.png` | `common` | ✅ есть |
| `rate/brownie_rate.png` | `rare` | ✅ есть |
| `epic/brownie_epic.png` | `epic` | ✅ есть |
| `the_age_of_miracles/the_age_of_miracles_brownie.png` | `epoch` | ✅ есть |

---

## `assets/furniture/` — предметы избы

| Файл | Статус | Элемент |
|------|--------|---------|
| `bake.png` | ✅ есть | Печка |
| `bench.png` | ✅ есть | Скамейка |
| `stand.png` | ✅ есть | Подставка под книгу |
| `book_of_spirits.png` | ✅ есть | Книга бестиария **закрытая** (на подставке в избе) |
| `book_of_spirits_open.png` | ⏳ нужен (P0) | Книга **открытая** (модалка бестиария); см. `book_layout.md` §2 |
| `box_closed.png` | ✅ есть | Обычный сундук (закрыт) |
| `box_open.png` | ✅ есть | Обычный сундук (открыт) |
| `shelf.png` | ✅ есть | Полки трофеев |
| `miracle_chest_closed.png` | ⏳ нужен (P0) | Сундук чудес (закрыт) |
| `miracle_chest_open.png` | ⏳ нужен (P0) | Сундук чудес (открыт) |
| `starter_casket.png` | ✅ есть | Дар путника: рельс HUD + модалка IAP (`hud_layout.md`) |
| `yard_grass.png` | ✅ есть | Пучок травы на улице |
| `kikimora_weaving.png` | ✅ есть | Кикимора в модалке крафта; fallback bust рельса |

---

## `assets/enemy/`

| Файл | Статус | Примечание |
|------|--------|------------|
| `fatso.png` | ✅ есть | Жирдяй **за стеклом** (слой `.layer-fatso`, под избой) |
| `susedko.png` | ✅ есть | Суседко при **воровстве монет** (слой `.layer-susedko-steal`, z 55). Не путать с гравюрой `creatures_in_the_book/susedko.png` (книга, викторина) |

---

## `assets/creatures_in_the_book/` — портреты духов

Белая гравюра на чёрном. Используются в книге, викторине, MVP-fallback трофеев.

| Файл | Дух |
|------|-----|
| `brownie.png` | Домовой |
| `susedko.png` | Суседко |
| `bannik.png` | Банник |
| `kikimora.png` | Кикимора |
| `poludnik.png` | Полевой (`spiritId`: `poludnik`; не путать с Полудницей `poludnica`) |
| `ovinnik.png` | Овинник |
| `leshiy.png` | Леший |
| `vodyanoy.png` | Водяной |
| `dedushka_toptygin.png` | Топтыгин |
| `poludnica.png` | Полудница |
| `rusalka.png` | Русалка |
| `lada.png` | Лада |
| `veles.png` | Велес |
| `baba_yaga.png` | Баба-Яга |
| `koschei_immortal.png` | Кощей |
| `chudo_yudo.png` | Чудо-Юдо |
| `yarilo.png` | Ярило |
| `perun.png` | Перун |

---

## `assets/illustration_book/` — иллюстрации бестиария

Цветные иллюстрации духов для **правой страницы** открытой книги (`book_layout.md` §4). Белые гравюры `creatures_in_the_book/` остаются для викторины, силуэтов и fallback.

**Правило путей в коде:** маппинг `spiritId` → файл через реестр ниже; не хардкодить PascalCase с диска.

| spirit id (код) | Файл на диске | Дух | Статус |
|-----------------|---------------|-----|--------|
| `baba_yaga` | `Baba_Yaga.png` | Баба-Яга | ✅ есть |
| `bannik` | `bannik.png` | Банник | ✅ есть |
| `chudo_yudo` | `chudo_yodo.png` | Чудо-Юдо | ✅ есть |
| `dedushka_toptygin` | `Grandpa_Toptygin.png` | Топтыгин | ✅ есть |
| `kikimora` | `kikimora.png` | Кикимора | ✅ есть |
| `koschei_immortal` | `koschei.png` | Кощей | ✅ есть |
| `lada` | `lada.png` | Лада | ✅ есть |
| `leshiy` | `leschii.png` | Леший | ✅ есть |
| `ovinnik` | `ovinnik.png` | Овинник | ✅ есть |
| `poludnica` | `poludnica.png` | Полудница | ✅ есть |
| `poludnik` | `poludnik.png` | Полевой | ✅ есть | `spiritId` poludnik, не poludnica |
| `rusalka` | `rusalka.png` | Русалка | ✅ есть |
| `susedko` | `susedko.png` | Суседко | ✅ есть |
| `veles` | `veles.png` | Велес | ✅ есть |
| `vodyanoy` | `waterman.png` | Водяной | ✅ есть |
| `brownie` | `brownie.png` | Домовой | ✅ есть |
| `yarilo` | `yarilo.png` | Ярило | ✅ есть |
| `perun` | `perun.png` | Перун | ✅ есть |

---

## `assets/trophies/` — 3D-трофеи (комната 2)

По одному файлу на дух. **Домовой — без трофея.**

| Файл | Дух | Статус | Примечание (канон трофея) |
|------|-----|--------|---------------------------|
| `susedko_chest.png` | Суседко | ✅ | Крошечный сундук для полки, не игровой сундук на полу |
| `bannik_broom.png` | Банник | ✅ | |
| `kikimora_yarn.png` | Кикимора | ✅ | |
| `polevoy_wreath.png` | Полевой | ✅ | Круглый венок; контраст с вертикальным снопом Овинника |
| `ovinnik_sheaf.png` | Овинник | ✅ | Вертикальный сноп; контраст с круглым венком Полевого |
| `leshiy_staff.png` | Леший | ✅ |
| `vodyanoy_shell.png` | Водяной | ✅ |
| `toptygin_paw.png` | Топтыгин | ✅ |
| `poludnica_sickle.png` | Полудница | ✅ | Серп с лентой; не венок (венок — у Полевого) |
| `rusalka_comb.png` | Русалка | ✅ | Гребень из речного перламутра; канон v2 (белая рубаха, берёза) |
| `lada_harmony_vase.png` | Лада | ✅ | Глиняная гармония-ваза, две ручки, красно-чёрный орнамент |
| `veles_bust.png` | Велес | ✅ | Бюст на полке; титул «Лапа Велеса» — в профиле |
| `yaga_hut.png` | Баба-Яга | ✅ |
| `koschei_needle.png` | Кощей | ✅ |
| `chudo_figurine.png` | Чудо-Юдо | ✅ | |
| `yarilo_spring_shield.png` | Ярило | ✅ | Золотой щит, рельефная гравировка молодого листа (Яровит) |
| `perun_oak_shield.png` | Перун | ✅ | Боевой топор (id файла исторический) |

**MVP-fallback:** `assets/creatures_in_the_book/[spirit].png` + CSS-рамка, `data-asset-pending="true"`.

---

## `assets/quiz/` — фоны викторины

| Файл | ID локации | Статус | Fallback |
|------|------------|--------|----------|
| `bg_izba.jpeg` | `izba` | ✅ | `hut_standart.png` blur |
| `bg_les.jpeg` | `les` | ✅ | `landscape_standart.jpeg` |
| `bg_banya.jpeg` | `banya` | ✅ | `bg_izba` + sepia |
| `bg_pole.jpeg` | `pole` | ✅ | `bg_les` + warm filter |
| `bg_voda.jpeg` | `voda` | ✅ | `bg_les` + hue-rotate |
| `bg_temnyy_les.jpeg` | `temnyy_les` | ✅ | `bg_les` + brightness(0.55) |
| `kikimora_craft_bg.jpeg` | крафт оберега | ✅ есть | **Только** модалка крафта Кикиморы |
| `trophy_tale_bg.jpeg` | сказ о трофее | ✅ есть | `TrophyModal` |

**Запрещено:** подменять `kikimora_craft_bg.jpeg` в других модалках. Сундук — **без** JPEG; juice через CSS confetti (`ChestLootFx`).

Портрет духа на экране викторины: `assets/creatures_in_the_book/[spirit].png`.

---

## `assets/ui/` — интерфейс

### HUD

| Файл | Назначение | Статус |
|------|------------|--------|
| `icon_energy.png` | Энергия | ✅ есть |
| `icon_coin.png` | Монеты удачи | ⏳ P0; факт: `assets/UI/monete_v1.png` (лапа на монете) |
| `icon_obereg.png` | Тайные обереги | ⏳ P0; факт: `assets/UI/secret_amulet.png` |
| `icon_smetana.png` | Сметана | ✅ есть |
| `icon_grass.png` | Пучки травы (чип HUD `n/3`) | ⏳ P1; fallback: `furniture/yard_grass.png` |
| `kikimora_companion.png` | Bust Кикиморы на левом рельсе HUD | ⏳ P0; fallback: кроп `kikimora_weaving.png` (**не** гравюра книги) |
| `assets/UI/amulet_against_the_house_spirit.png` | оберег (вариант) | ✅ есть |
| `fragment_shard.png` | Осколок фрагмента Эпохи | ⏳ P2 |

### Навигация

| Файл | Назначение | Статус |
|------|------------|--------|
| `arrow_right_wood.png` | Стрелка в трофеи | ⏳ P0 |
| `arrow_left_wood.png` | Стрелка в избу | ⏳ P0 |

### Диалог и викторина

| Файл | Назначение | Статус |
|------|------------|--------|
| `dialog_frame_wood.png` | Рамка диалога кота (nine-slice) | ⏳ P0 |
| `bubble_tail.png` | Хвостик облачка реплики | ⏳ P2 |
| `quiz_panel_wood.png` | Панель вопроса (nine-slice) | ✅ |
| `quiz_answer_wood.png` | Кнопка ответа (nine-slice) | ✅ |

### Трофеи (UI)

| Файл | Назначение | Статус |
|------|------------|--------|
| `trophy_silhouette.png` | Пустой слот на полке | ✅ |

### Рамки грейда (профиль, HUD-аватар, сетка)

**Факт на диске:** `assets/frame/`. Не `assets/ui/frame_item_*` — таких файлов нет.

Центр PNG сейчас чёрный — P0 вырезать в альфу (`profile_layout.md` §5.2).

| Файл | Грейд (код) | Статус |
|------|-------------|--------|
| `assets/frame/common.png` | `common` | ✅ есть |
| `assets/frame/rate.png` | `rare` | ✅ есть |
| `assets/frame/epic.png` | `epic` | ✅ есть |
| `assets/frame/the_age_of_miracles.png` | `epoch` | ✅ есть |

Имена `frame_item_*` / `frame_avatar_*` в старых промптах — не использовать в коде.

### Профиль (UI)

Отдельных PNG панели профиля нет. Сборка: дерево как у диалога/викторины + рамки `assets/frame/`. Крестик закрытия — P2.

### Бейджи грейда

| Файл | Грейд | Статус |
|------|-------|--------|
| `badge_grade_common.png` | Обычный | ⏳ P2 |
| `badge_grade_rare.png` | Редкий | ⏳ P2 |
| `badge_grade_epic.png` | Эпик | ⏳ P2 |
| `badge_grade_epoch.png` | Эпоха чудес | ⏳ P2 |

---

## Быстрый индекс по экранам

| Экран | Основные пути |
|-------|---------------|
| Изба (комн. 1) | `house/`, `view/`, `furniture/`, `pets/`, `brownie/`, `enemy/fatso.png`, HUD (`hud_layout.md`: ларец, `ui/kikimora_companion`) |
| Трофеи (комн. 2) | тот же `house/` + `furniture/shelf`, `trophies/` |
| Викторина | фон из `Локация квеста` духа → `quiz/bg_*.jpeg` |
| Диалог кота | `pets/..._sid.png`, `ui/dialog_frame_wood` |
| Профиль | `profile_layout.md`: `frame/*.png`, скины pets/house/view/brownie, `tituls.md` |
| Книга | `furniture/book_of_spirits` (+ `book_of_spirits_open`), `illustration_book/`, `creatures_in_the_book/`, `badge_grade_*` |

---

## Легенда статусов

| Метка | Значение |
|-------|----------|
| ✅ есть | Файл в репозитории, можно использовать в коде |
| ⏳ нужен | Промпт в `design_assets_prompts.md`; в коде — только fallback из § MVP |

---

*Версия: 1.3 · HUD = `hud_layout.md`. Иллюстрации бестиария = `assets/illustration_book/`. Анимации книги = `book_layout.md`. Слои избы = `izba_scene_layers.md`. Профиль = `profile_layout.md`.*
