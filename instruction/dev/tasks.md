# Задачи разработки



> Заполняет **проектировщик** (`.cursor/roles/proektirovshchik.md`).  

> Читают: архитектор, тестировщик, разработчик, ревьювер, оркестратор.  

> Канон: `instruction/scenario.md`, техника: `instruction/scenario_draft.md`, техтребования: `instruction/dev/technical_requirements.md`.



---



## Epic 0 — Каркас и данные



### TASK-001 — Vite/React/MobX/Vitest + конфиги и data

- **Статус:** done

- **Приоритет:** P0

- **Зависит от:** —

- **Канон:** technical_requirements.md §1–2, §6; scenario_draft.md §2.1; list_of_spirits.md; quests.md; tituls.md; loot_tables.md; scenario.md §4.3, §8

- **Суть:** Собираемый проект, gameConstants, spirits/quiz/titles, GameSave, веса обычного сундука, банки реплик.

- **Критерии приёмки:**

  - [x] `npm run dev` / `npm run build` без ошибок

  - [x] `npm test` — зелёные тесты GameSave, lootTables, data

  - [x] 16 духов в `spirits.ts`, викторины из `quests.md`

  - [x] `createDefaultSave()` — onboardingStep 0, brownie available

  - [x] `regularChestTypeWeightsByGrade` в lootTables.ts

  - [x] `isTestMode` из `VITE_TEST_MODE`

- **Вне scope:** GameStore, UI сцены, SDK



---



## Epic 1 — GameStore и persist (следующий)



### TASK-002 — GameStore + SaveService + мок SDK

- **Статус:** done

- **Приоритет:** P0

- **Зависит от:** TASK-001

- **Канон:** scenario_draft.md §2–4; technical_requirements.md §5, §8–9

- **Суть:** toSave/hydrate, debounce persist, реген энергии, AdsService-заглушка.

- **Критерии приёмки:**

  - [x] clickCat, онбординг-гварды, floor энергии 20

  - [x] SaveService debounce 2.5 с + flush

  - [x] pickBestSave по savedAt

  - [x] Мок YaGames в isTestMode

- **Вне scope:** UI избы



---



## Epic 2 — Сцена избы



### TASK-003 — Слои, pan, HUD, клик кота

- **Статус:** done

- **Приоритет:** P0

- **Зависит от:** TASK-002

- **Канон:** izba_scene_layers.md; sceneLayout.ts; profile_layout.md §2

- **Суть:** DOM-стек избы, pan 1↔2, HUD, клик кота + FX монет, sleep, ночной overlay.

- **Критерии приёмки:**

  - [x] Слои и позиции из sceneLayout

  - [x] Inner 200%, pan стрелками и свайпом

  - [x] Fallback окна window-aperture

  - [x] HUD: аватар, титул, энергия, монеты, обереги

  - [x] Клик кота + FX monete_v1, sleep 45–60 с

  - [x] Ночной overlay 20:00–06:00

- **Вне scope:** онбординг-диалог, книга, Жирдяй



---



## Epic 3 — Голос кота и онбординг 0–1



### TASK-004 — CatDialog + шаги 0–1

- **Статус:** done

- **Приоритет:** P0

- **Зависит от:** TASK-003

- **Канон:** cat_dialog_layout.md; scenario.md §4.1–4.3; technical_requirements.md §5

- **Суть:** VN-панель footnote/novel, онбординг шаг 0–1, блокировки UI, заглушка книги.

- **Критерии приёмки:**

  - [x] CatDialog: novel (0–1) и footnote, портрет, «Далее», typewriter

  - [x] Шаг 0: приветствие, книга заблокирована, кот кликабелен

  - [x] Шаг 1: novel + пульс книги, открытие заглушки → step 2

  - [x] `onboardingGuards` — canInteract / highlight / block pan

  - [x] Тексты из `onboardingLines` / scenario §4.3

- **Вне scope:** полный бестиарий, викторина (Epic 4)



---



## Epic 4 — Книга, викторина, очередь духов



### TASK-005 — Бестиарий + викторина + награды §5.5 + онбординг 2–4

- **Статус:** done

- **Приоритет:** P0

- **Зависит от:** TASK-004

- **Канон:** book_layout.md; quiz_layout.md; scenario.md §4.1–4.3, §5.1–5.5; technical_requirements.md §5, §7

- **Суть:** Полный бестиарий, викторина (shuffle, обереги), очередь духов, награды §5.5, онбординг шаги 2–4.

- **Критерии приёмки:**

  - [x] BookModal: разворот, статусы, лента глав, «В путь», закладка следующего

  - [x] QuizModal: фон локации + fallback, shuffle, «Вопрос X из Y», −1 оберег / провал

  - [x] Онбординг Домовой/Суседко: 0 энергии; шаги 2→3→4→5

  - [x] Награды §5.5 через `applySpiritReward`; Домовой на сцене; сундук после Суседко

  - [x] Очередь духов: только следующий `available` после победы

  - [x] Тесты: spiritQueue, applySpiritReward, GameStore quiz flow

- **Вне scope:** открытие сундука (Epic 5), фрагменты UI (Epic 8)



---



## Epic 5 — Обычный сундук, лут, онбординг 5–6



### TASK-006 — Сундук 3 ч, лут, rewarded −30 мин, онбординг 5–6

- **Статус:** done

- **Приоритет:** P0

- **Зависит от:** TASK-005

- **Канон:** scenario.md §4.3, §6; loot_tables.md; technical_requirements.md §5–6; gameConstants BROWNIE_LUCK

- **Суть:** Первый играбельный milestone: открытие сундука, ролл лута, модалка, rewarded-ускорение, шаги 5–6, повторный вход — кот спит.

- **Критерии приёмки:**

  - [x] Первое открытие без кулдауна (`chestReadyAt = null`); далее +3 ч

  - [x] Ролл из `lootTables` + удача домового (+1/2/3/5% rare+); дубликаты по loot_tables.md; epoch-титулы не падают

  - [x] `ChestLootModal`: награда + «Домовой шепчет: поторопи удачу (−30 мин)» через AdsService

  - [x] Онбординг 5: подсветка сундука, таймер 0; шаг 6 → `onboardingCompleted`

  - [x] Повторный вход (`!isFirstLaunch`): кот в `sleep`

  - [x] Тесты: `chestLoot`, `chestCooldown`, GameStore chest flow

- **Вне scope:** кража Суседко (Epic 7), Сундук чудес (Epic 8)



---



## Epic 6 — Трофеи и профиль



### TASK-007 — Комната трофеев + профиль

- **Статус:** done

- **Приоритет:** P0

- **Зависит от:** TASK-006

- **Канон:** room_02_trophies_layout.md; profile_layout.md; scenario.md §9

- **Суть:** 3×5 слотов трофеев, модалка сказа, профиль из HUD (скины + титулы).

- **Критерии приёмки:**

  - [x] Комната 2: полки из `trophySlotLayout`, без Домового, fallback гравюра

  - [x] Пустой слот → «ещё не встречен»; трофей → мини-сказ

  - [x] HUD-профиль: вкладки кот/изба/лес/домовой/титулы, «Выбрать» только owned

  - [x] `equipSkin` / `equipTitle` → `skins` / `titleId`

- **Вне scope:** фрагменты UI (Epic 8)



---



## Epic 7 — Ночь, Жирдяй, кража Суседко



### TASK-008 — Sleep, кража, Жирдяй, титул

- **Статус:** done

- **Приоритет:** P0

- **Зависит от:** TASK-006

- **Канон:** scenario.md §7.2–7.3; technical_requirements.md §6; susedko_dialogs.md

- **Суть:** Кот sleep → предупреждение → кража Суседко; ночной Жирдяй; титул «Гроза Жирдяев».

- **Критерии приёмки:**

  - [x] Sleep 45–60 с; кража 5+5 с, 1 монета/3 с, stop-loss &lt; 15, стоп 5 кликов

  - [x] Слой z 55, позиции `susedkoStealPositions`, реплики susedko_dialogs

  - [x] Жирдяй: ночь + изба, 1/ночь, 8–12 кликов, блок cat/chest/quest

  - [x] Первый Жирдяй → `groza_zhirdyaev`; прогресс в save

  - [x] Тесты domain + store

- **Вне scope:** баннер облака (Epic 9)



---



## Epic 8 — Фрагменты и Сундук чудес



### TASK-009 — Осколки Эпохи + еженедельный сундук чудес

- **Статус:** done

- **Приоритет:** P0

- **Зависит от:** TASK-005, TASK-007

- **Канон:** scenario.md §5.4; loot_tables.md §«Сундук чудес», §«Фрагменты»; room_01_layout.md §4.5

- **Суть:** Выбор locked-духа для дропа осколков, UI «собрано N/M», Сундук чудес (пн 00:00, бесплатный слот, 1000 кликов, pity 8, утешительный пул), фоновые фрагменты с rare+ побед.

- **Критерии приёмки:**

  - [x] Книга: у locked fragment-духов «Собрано N/M», выбор цели дропа, подсветка выбранного

  - [x] Сундук чудес на сцене при Суседко + ≥1 rare+ defeated; fallback `box_*` + hue-rotate

  - [x] Неделя = пн 00:00 локально; 1-е открытие бесплатно; далее 1000 кликов (прогресс не сбрасывается в пн)

  - [x] Ролл 25% фрагмент + pity 8; утешительный пул + рероллы дубликатов

  - [x] HUD `.hud-miracle` при активном сундуке; реплики кота miracle_chest_*

  - [x] Победа rare+ (Леший…Русалка) — +1 фрагмент разово

  - [x] Тесты: `wonderChest`, `miracleChestLoot`, GameStore flow

- **Вне scope:** Яндекс Pay (Epic 9)



---



## Epic 9 — Настройки, удержание, сдача



### TASK-010 — Настройки, облако, крючки удержания

- **Статус:** done

- **Приоритет:** P0

- **Зависит от:** TASK-006, TASK-008, TASK-009

- **Канон:** scenario.md §6.1, §12–13; scenario_draft.md §4; technical_requirements.md §8–9, §12

- **Суть:** Сброс с подтверждением, мок-вход Яндекс, баннер облака после сундука, сноска chest_ready при входе, cloud persist в тесте.

- **Критерии приёмки:**

  - [x] Настройки: язык, «Войти через Яндекс» (мок, только по клику), сброс с confirm

  - [x] Баннер «Сохраним тайны в облаке?» после первого сундука — закрываемый, без auto openAuthDialog

  - [x] При входе: сноска chest_ready если сундук готов

  - [x] saveService cloudWriter + authChecker в bootstrap (isTestMode)

  - [x] Тесты: retention, GameStore reset/banner

- **Вне scope:** реальный SDK, Pay



---



## Epic 10 — Анимация и UX разворота книги (book_layout.md v1.1)



> Источник: `instruction/plans/book_animation_ux_d9729581.plan.md`  
> Mockup: `instruction/design/book_bestiary_mockup_landscape.png`



### TASK-011 — Реестр `bookOpen` + промпты UI-кнопок

- **Статус:** todo

- **Приоритет:** P0

- **Зависит от:** —

- **Канон:** book_layout.md §1, §2.5; assets_catalog.md; `instruction/plans/book_animation_ux_d9729581.plan.md` §0, §0.1

- **Суть:** Подключить уже лежащий в репо `book_of_spirits_open.png` в кодовый реестр и каталог; дописать в `design_assets_prompts.md` три новых P0-промпта (кнопка «В путь», лапка, закрыть ×). Стрелки — промпты уже в реестре.

- **Prerequisite (done):** `assets/furniture/book_of_spirits_open.png` добавлен в репозиторий 30.08.2026.

- **Критерии приёмки:**

  - [ ] `assetRegistry.ts`: `bookOpen: fromAssets('furniture/book_of_spirits_open.png')`

  - [ ] `instruction/assets_catalog.md`: `book_of_spirits_open.png` → статус ✅

  - [ ] `instruction/design_assets_prompts.md`: промпты для `book_quest_btn_wood.png`, `icon_paw.png`, `book_close_wood.png` (текст из плана §0.1)

  - [ ] Стрелки `arrow_left_wood` / `arrow_right_wood` — промпты в реестре не дублировать (уже есть)

  - [ ] Заготовка `bookUi` namespace в `assetRegistry.ts` с путями P0-кнопок (файлы могут отсутствовать до TASK-012)

- **Вне scope:** генерация PNG (TASK-012), CSS/компоненты книги



### TASK-012 — UI-ассеты бестиария P0

- **Статус:** todo

- **Приоритет:** P0

- **Зависит от:** TASK-011

- **Канон:** book_layout.md §2.6; `instruction/plans/book_animation_ux_d9729581.plan.md` §0.1; `instruction/design_assets_prompts.md`

- **Суть:** Сгенерировать и положить в `assets/ui/` пять P0 PNG для разворота книги. Сейчас файлов нет (стрелки описаны в промптах, но не в репо).

- **Критерии приёмки:**

  - [ ] `assets/ui/arrow_left_wood.png` — деревянная стрелка влево (промпт §`arrow_left_wood`)

  - [ ] `assets/ui/arrow_right_wood.png` — деревянная стрелка вправо (промпт §`arrow_right_wood`)

  - [ ] `assets/ui/book_quest_btn_wood.png` — плашка «В путь» (промпт плана §0.1)

  - [ ] `assets/ui/icon_paw.png` — иконка лапки (промпт плана §0.1)

  - [ ] `assets/ui/book_close_wood.png` — кнопка закрыть × (промпт плана §0.1)

  - [ ] Все пути подключены в `assetRegistry.ts` (`bookUi` namespace, см. план §0.1)

  - [ ] Визуально: стиль clay-wood, читаемость touch 44×44 px (стрелки min 48×48)

  - [ ] `instruction/assets_catalog.md`: статус ✅ для каждого файла

- **Вне scope:** `book_bookmark_green.png` и `badge_grade_*.png` (P1, после MVP); CSS-fallback в коде (TASK-016)



### TASK-013 — Hover на закрытой книге (CSS)

- **Статус:** todo

- **Приоритет:** P0

- **Зависит от:** —

- **Канон:** book_layout.md §1.1; `instruction/plans/book_animation_ux_d9729581.plan.md` §Фаза 1; css-styling.mdc (без `width` на `.scene-book`)

- **Суть:** Интерактивный hover на `.scene-book` на сцене: glow + lift; при hover — пауза idle-pulse; `prefers-reduced-motion` — только opacity.

- **Критерии приёмки:**

  - [ ] Hover на `.scene-book.scene-sprite--interactive:hover .scene-sprite__img`: `scale(1.04)`, `translateY(-3px)`, золотой `drop-shadow` pulse 1.6 s (§1.1)

  - [ ] При hover idle opacity-pulse остановлен

  - [ ] `@media (prefers-reduced-motion: reduce)` — без scale/glow, только opacity-pulse

  - [ ] Нет `width`/`height` на `.scene-book` **для hit-area** (масштаб hi-res — TASK-019, `width: 9vw`)

  - [ ] `IzbaSceneLayers.tsx`: класс `scene-sprite--interactive` при `bookAllowed`

- **Вне scope:** анимация открытия, звук шороха (P2)



### TASK-014 — bookUiStore: фазы анимации + тесты

- **Статус:** todo

- **Приоритет:** P0

- **Зависит от:** —

- **Канон:** book_layout.md §2.2–2.3; `instruction/plans/book_animation_ux_d9729581.plan.md` §Фаза 2

- **Суть:** Расширить `bookUiStore`: `BookPhase`, `flightFrom`, `showPageContent`, `coverVariant`; методы `startOpen` / `close`; геттеры `isOverlayActive`, `isInteractionBlocked`; таймеры 1000 ms / 1250 ms; reduced-motion shortcut.

- **Критерии приёмки:**

  - [ ] Фазы: `idle` → `flying` → `crossfading` → `content` → `closing` → `idle` (диаграмма плана)

  - [ ] `startOpen(spiritId, fromRect)`: сохраняет rect, t=1000 ms → crossfade, t=1250 ms → `showPageContent=true`

  - [ ] `close()`: цепочка закрытия, сброс таймеров, phase → `idle`

  - [ ] `isOverlayActive` = phase ≠ `idle`; `isInteractionBlocked` = phase ≠ `content`

  - [ ] `prefers-reduced-motion`: сразу `content` + `coverVariant='open'`

  - [ ] `src/store/bookUiStore.test.ts`: переходы фаз, сброс при close, reduced-motion

- **Вне scope:** DOM/FLIP (TASK-015), разметка пергамента (TASK-016)



### TASK-015 — BookOverlay: полёт closed, crossfade open, блокировки

- **Статус:** todo

- **Приоритет:** P0

- **Зависит от:** TASK-011, TASK-014

- **Канон:** book_layout.md §2.1–2.4; izba_scene_layers.md §2.2; `instruction/plans/book_animation_ux_d9729581.plan.md` §Фаза 3

- **Суть:** Новый `BookOverlay` (или рефактор `BookModal`): FLIP полёт закрытой книги из scene-rect в центр, crossfade на open-PNG, backdrop; блокировка pan и повторного клика на время overlay.

- **Критерии приёмки:**

  - [ ] `IzbaSceneLayers`: `useRef` на `.scene-book`; `handleBookClick` → `getBoundingClientRect()` → `startOpen`; guard при `isOverlayActive`

  - [ ] DOM: `.book-flight` (closed) + `.book-modal__stage` (open); `data-phase` на корне

  - [ ] FLIP: inline `style` только transform на `.book-flight`; transition 0.5 s `cubic-bezier(0.22, 1, 0.36, 1)`

  - [ ] t=1000 ms: crossfade closed → open; t=1250 ms: fade-in spread

  - [ ] Пока `isOverlayActive`: `.scene-book { visibility: hidden }` на сцене

  - [ ] `useOnboardingBootstrap`: pan-block при `isOverlayActive` (не только `isOpen`)

  - [ ] `grep style=` в book-модулях — только FLIP transform

- **Вне scope:** контент страниц на пергаменте (TASK-016), закрытие (TASK-017)



### TASK-016 — Контент на пергаменте open-PNG

- **Статус:** todo

- **Приоритет:** P0

- **Зависит от:** TASK-015; TASK-012 (финальные PNG; до готовности — задокументированный CSS-fallback)

- **Канон:** book_layout.md §2.5–2.7, §2.6; scenario.md §5.1–5.3; `instruction/plans/book_animation_ux_d9729581.plan.md` §Фаза 4

- **Суть:** Убрать generic modal-карточку; контент на пергаменте `book_of_spirits_open.png`; зоны absolute %; mobile landscape; UI-кнопки из ассетов или MVP-fallback.

- **Критерии приёмки:**

  - [ ] Удалены `.book-modal__inner`, дублирующий заголовок «Тайны славянских духов», `cover-open` с opacity 0.12 / `bookClosed`

  - [ ] `.book-modal__stage`: размеры по TASK-019 (`BOOK_OPEN_ASPECT` 1.248; **не** `/ 1.55`)

  - [ ] Landscape `max-height: 500px`: высота `86vh`, ширина `86vh * 1.248` (TASK-019)

  - [ ] Зоны контента по §2.6: ribbon, left/right page, bookmark, close, nav

  - [ ] `.book-page` без `background: rgba(...)`; текст `#3d2a1a`, имя `#8b6914`

  - [ ] Иллюстрация: `max-height: 58%` правой страницы (не 180px); landscape 62%

  - [ ] Левая страница: `overflow-y: auto`

  - [ ] Стрелки: `arrow_*_wood.png` min 48×48; «В путь»: `book_quest_btn_wood` + `icon_paw`; закрыть: `book_close_wood` — или CSS-fallback до TASK-012

  - [ ] `aria-labelledby` → `book-page__name`; контент скрыт до `showPageContent`

  - [ ] Закладка: CSS-лента `#3d7a4a` до P1-ассета; грейд — CSS-классы до `badge_grade_*.png` (P1)

- **Вне scope:** 3D page-flip (TASK-018); звук (P2)



### TASK-017 — Анимация закрытия книги

- **Статус:** todo

- **Приоритет:** P0

- **Зависит от:** TASK-015, TASK-016

- **Канон:** book_layout.md §2.3; `instruction/plans/book_animation_ux_d9729581.plan.md` §Фаза 5

- **Суть:** Обратная цепочка закрытия ≤500 ms: fade-out контента → crossfade open→closed → FLIP в `flightFrom` → idle. Backdrop и × только в phase `content`.

- **Критерии приёмки:**

  - [ ] Суммарная длительность закрытия ≤500 ms (§2.3)

  - [ ] Последовательность: fade-out UI (0.15 s) → crossfade (0.15 s) → FLIP назад (0.2 s) → phase `idle`

  - [ ] Клик backdrop и кнопка × не прерывают полёт/crossfade — только в `content`

  - [ ] После закрытия книга на сцене снова в idle-pulse

  - [ ] `prefers-reduced-motion`: мгновенное закрытие

- **Вне scope:** page-flip (TASK-018)



### TASK-018 — 3D page-flip и свайп листания (P1)

- **Статус:** todo

- **Приоритет:** P1

- **Зависит от:** TASK-017

- **Канон:** book_layout.md §3; `instruction/plans/book_animation_ux_d9729581.plan.md` §Фаза 6

- **Суть:** После MVP: подключить `isFlipping` / `startFlip` / `endFlip` в `goPrev`/`goNext`; CSS 3D rotateY; свайп по spread порог 40 px; очередь из 1 при спаме стрелок.

- **Критерии приёмки:**

  - [ ] Перелистывание: rotateY 0°→−90°→swap→90°→0°, суммарно 0.35–0.45 s (§3.2)

  - [ ] `perspective` на `.book-modal__spread`; `.book-page--flipping` на уходящей странице

  - [ ] Свайп горизонталь >40 px по `.book-modal__spread`

  - [ ] Во время flip: «В путь» и стрелки disabled; быстрые тапы — очередь из 1

  - [ ] `prefers-reduced-motion`: мгновенная смена разворота

  - [ ] Стрелки скрыты на первой/последней странице (scenario.md §5.1)

- **Вне scope:** MVP эпика 10 (фазы 0–5); звук шелеста (P2); P1-ассеты закладки и бейджей грейда



### TASK-019 — Фикс layout бестиария (центр, CTA, новые PNG)

- **Статус:** done
- **Приоритет:** P0
- **Зависит от:** TASK-016, TASK-017
- **Канон:** `instruction/plans/plan.md` §0–9; `book_bestiary_mockup_landscape.png`; `book_bestiary_validation_mockup_v2.png`; book_layout.md §2.5–2.6 (после обновления)
- **Суть:** Hi-res closed book держать `9vw` на сцене и масштабировать при клике; open PNG aspect **1.248**; контент левой страницы и CTA «В путь» — как на mockup (центр, без stretch).

- **Критерии приёмки:**

  - [x] `.scene-book { width: 9vw }` — визуальный размер как до hi-res; не раздувать hit-area отдельно
  - [x] FLIP: старт = scene-rect с `9vw`; финиш = `.book-modal__stage`; closed PNG без blur
  - [x] `BOOK_OPEN_ASPECT = 902/723` (≈ 1.248); в CSS book-modal **нет** `1.55`
  - [x] Stage/flight: `width: min(94vw, 920px)`; `height: min(82vh, calc(… / 1.248))`
  - [x] Landscape ≤500px: `height: 86vh`; `width: calc(86vh * 1.248)`
  - [x] Зоны open v2: left `8%/10%/40%/76%`; right `52%/10%/40%/76%`; progress `14%/2.5%/72%/7%`; bookmark `86%`; close `93%`; nav `−5%` / `98%`
  - [x] Левая страница: `display:flex; flex-direction:column; align-items:center; text-align:center` — имя, текст, награда, CTA на одной оси центра пергамента
  - [x] «В путь»: нет `width: 100%` на кнопке; нет `object-fit: fill`; `max-width: 78%`; bg `contain`; ширина < 80% пергамента
  - [x] Лапка в слоте плашки (`left: 8%` кнопки); не дублировать резной слот PNG отдельной гигантской иконкой
  - [x] Прогресс: `object-position: center`; бусины по центру ленты (`left: 50%; translateX(-50%); width: 38%`)
  - [x] `available`/`defeated`: иллюстрация не из `creatures_in_the_book/` (3D / illustration_book / clay)
  - [x] Грейд MVP: CSS-бейдж **top-center** над иллюстрацией
  - [ ] Скрин vs mockup по зонам: центр левой страницы, компактная CTA, нить по центру, 3D Домовой (код + CSS-контракт зелёные; живой overlay — visual_check владельца: клик по книге после онбординга)
  - [x] `book_layout.md` §2.5–2.6 синхронизирован с 1.248 и зонами v2

- **Вне scope:** TASK-018 page-flip; генерация `book_chapter_progress.png` / `book_bookmark_green.png`; смена ассета Домового на отдельный `illustration_book/brownie.png` если файла нет

---

### TASK-020 — 3D-иллюстрации бестиария + ink-reveal

- **Статус:** done
- **Приоритет:** P0
- **Зависит от:** TASK-019
- **Канон:** `instruction/plans/book_3d_illustrations_c07dc2f8.plan.md`; `scenario.md` §5.2; `book_layout.md` §4; `book_bestiary_validation_mockup_v2.png`
- **Суть:** 16 3D-диорам в `illustration_book/`; до победы — силуэт гравюры; после — цветная диорама + ink-reveal при первом открытии.

- **Критерии приёмки:**

  - [x] До победы (`locked` / `available`): та же 3D из `illustration_book` + CSS-силуэт (не гравюра `creatures_in_the_book`)
  - [x] После победы (`defeated`): цветная диорама из `illustration_book/`
  - [x] Первое открытие после победы: ink-reveal ~0.5 s; повторное — без анимации (`illustrationRevealed`)
  - [x] Все 16 духов: `spiritIllustrationPaths` ≠ `creatures_in_the_book/`
  - [x] Домовой: `illustration_book/brownie.png`, не `brownie_standart`
  - [x] 16 PNG в `assets/illustration_book/` с прозрачным α из черновиков
  - [ ] Visual: иллюстрация по центру правой страницы, `contain`, как mockup v2 (dev check владельца)

- **Вне scope:** перегенерация черновиков; смена layout зон open-PNG

---

## Epic 11 — Удержание, энергия, оживление (plan.md 2026-09-01)

> Источник: `instruction/plans/plan.md`

### TASK-021 — Баланс: 700 кликов, энергия 120/120, миграция

- **Статус:** done
- **Приоритет:** P1
- **Канон:** plan.md §1–2; `gameConstants.ts`; `lootTables.ts`; `saveMigration.ts`
- **Суть:** Сундук чудес 700 кликов; старт/max 120; реген 1.2/мин; миграция v3.
- **Критерии приёмки:**
  - [x] `miracleChest.clicksToOpen === 700`
  - [x] `START_ENERGY/MAX === 120`, `ENERGY_REGEN_PER_MINUTE === 1.2`
  - [x] Миграция: max≤100 → max 120, energy min(e+20,120)
  - [x] HUD: прогресс чуда при eligible онбординга

### TASK-022 — Daily find + реплики на предметы избы

- **Статус:** done
- **Приоритет:** P1
- **Канон:** plan.md §3.1–3.2; `cat_dialogs.md` §Предметы избы
- **Суть:** Монетка +10 энергии раз в день; клики печка/скамейка/окно → footnote.
- **Критерии приёмки:**
  - [x] `dailyFindClaimedDayId` в save; over-cap +10
  - [x] FX монеты при сборе
  - [x] Пул реплик stove/bench/window без повтора подряд

### TASK-023 — CSS оживление сцены (Zzz, idle, 8.x)

- **Статус:** done
- **Приоритет:** P1
- **Канон:** plan.md §4, §6, §8.1/8.3/8.4/8.5/8.7
- **Суть:** Zzz кот sleep; breath/bob; glow сундука; parallax леса; trophy reveal; печка ночью; quiz flash/shield.
- **Критерии приёмки:**
  - [x] `.cat-zzz`, idle кот/домовой
  - [x] `.scene-chest--ready` glow
  - [x] Parallax `.window-aperture__forest` room 2
  - [x] `.room-trophy-slot--reveal`
  - [x] Quiz correct flash + obereg shield
  - [x] `prefers-reduced-motion` отключает анимации

### TASK-024 — Сказки в книге + sparkle/burst

- **Статус:** done
- **Приоритет:** P1
- **Зависит от:** TASK-019
- **Канон:** plan.md §5, §7; `instruction/folktales/*.md`
- **Суть:** Кнопка «Сказка»; режим листания; bannik/leshiy; sparkle при открытии.
- **Критерии приёмки:**
  - [x] «Сказка» под «В путь» для defeated с folktale
  - [x] «К духу» возврат; стрелки листают страницы сказки
  - [x] MVP: bannik, leshiy в `src/data/folktales.ts`
  - [x] `.book-sparkle`, shimmer режима сказки
  - [ ] Звук §8.10 — ждёт выбор A/B/C владельца

---

## Epic 12 — Награды квестов Лада / Яга (plan 2026-09-08)

> Источник: `instruction/plans/quest_rewards_lada_yaga.plan.md`  
> Решение владельца: трофей Лады (`lada_harmony_vase`) + скин окна Яги (`landscape_yaga`). Снимает отмену `landscape_yaga` из `quiz_draft_migration_bd11c388.plan.md`.

### TASK-025 — Лада: приёмка трофея `lada_harmony_vase`

- **Статус:** done
- **Приоритет:** P1
- **Канон:** `design_assets_prompts.md` §419–432; `list_of_spirits.md`; `scenario.md` §5.5
- **Суть:** Визуальная приёмка PNG вазы; обновить `assets_catalog.md`; smoke полки комнаты 2.
- **Критерии приёмки:**
  - [x] PNG: гармония-ваза, две ручки, красно-чёрный орнамент, не generic-ваза
  - [x] `assets_catalog.md`: `lada_harmony_vase.png` → ✅
  - [x] Победа над Ладой → титул «Гость Лада» + ваза на полке + reveal-анимация
- **Вне scope:** скин `hut_harmony`, правки `applySpiritReward` / `spirits.ts` для Лады

### TASK-026 — Яга: ассет `landscape_yaga.jpeg`

- **Статус:** done
- **Приоритет:** P1
- **Зависит от:** —
- **Канон:** `design_assets_prompts.md` §703–736; `izba_scene_layers.md` §1.4; `profile_layout.md` §6.3
- **Суть:** PNG 21:9 — маленькая избушка на курьих ножках в зоне оконного проёма.
- **Критерии приёмки:**
  - [x] Файл `assets/view/landscape_yaga.jpeg` в репозитории
  - [x] Избушка ≈ 60–75% высоты проёма, по центру зоны окна (~38% ширины сцены)
  - [x] Visual: комнаты 1 и 2, `WindowAperture` — диорама за стеклом, не гигант на весь кадр
  - [x] Отличим от `landscape_temnyy_les` (нет избушки)
  - [x] `assets_catalog.md`: `landscape_yaga.jpeg` → ✅
- **Вне scope:** регистрация в коде (TASK-027)

### TASK-027 — Яга: награда скином `landscape_yaga` + синхрон канона

- **Статус:** done
- **Приоритет:** P1
- **Зависит от:** TASK-026
- **Канон:** `quest_rewards_lada_yaga.plan.md` §Фаза 3–4; `итерация_исправлений` §1.2 (без авто-экип)
- **Суть:** `title_and_skin` для Яги; реестр; миграция сейвов; тексты.
- **Критерии приёмки:**
  - [x] `viewSkins.landscape_yaga` + `skinContent` (ru/en/tr)
  - [x] `spirits.ts`: reward `title_and_skin`, `bookRewardDescription` с видом из окна
  - [x] `applySpiritReward`: `ownedSkinIds` += skinId, активный `skins.window` **не** меняется
  - [x] Профиль «Лес»: ячейка `landscape_yaga`, грейд epoch; сундук не выдаёт id
  - [x] Миграция: defeated `baba_yaga` → `landscape_yaga` в owned
  - [x] Тесты: `applySpiritReward.test.ts`, GameStore claim victory
  - [x] `list_of_spirits.md` / `miniTale` Яги: «ключ к виду из окна» согласован с кодом
- **Вне scope:** `hut_harmony`, правки викторины, CSS комнаты 1

---

## Epic 13 — Монетизация, усталый кот, улица, реклама (plan.md 2026-09-10)

> Источник: `instruction/plans/plan.md`; оркестратор: `итерация_монетизация_улица_29dd98c9.plan.md`

### TASK-028 — Дизайнер: арт + UX-спеки + mockup

- **Статус:** in_progress
- **Приоритет:** P1
- **Зависит от:** TASK-029
- **Канон:** plan.md Epic 1, 3, 4; `assets_catalog.md`; `design_assets_prompts.md`
- **Суть:** Снять паузу GenerateImage на эпик; сгенерировать весь арт (скин ларца, ларец, icon_energy/smetana, трава, крафт Кикиморы, mockups 16:9).
- **Критерии приёмки:**
  - [ ] `cat_pilgrim` sid+sleep в `assets/pets/rare/cat_pilgrim/`
  - [ ] `starter_casket.png`, `yard_grass.png`, `kikimora_craft_bg.jpeg`, `kikimora_weaving.png`
  - [ ] `icon_energy.png`, `icon_smetana.png` в `assets/UI/`
  - [ ] Mockups: `starter_pack_mockup.png`, `street_yard_mockup.png`, `kikimora_craft_mockup.png`, `rewarded_wait_mockup.png`
  - [ ] UX-спеки с таблицей Layout vs mockup; `assets_catalog.md` обновлён
- **Вне scope:** Яндекс Payments API

### TASK-029 — Архитектор: tech.md save v9, pan 3, sleepReason, stubs

- **Статус:** in_progress
- **Приоритет:** P1
- **Зависит от:** TASK-028 (параллельно с дизайнером для Epic 2/4)
- **Канон:** plan.md; `izba_scene_layers.md`
- **Суть:** SAVE v9, IzbaRoom street|1|2, catSleepReason, paymentsService/ads overlay.
- **Критерии приёмки:**
  - [ ] `instruction/dev/tech.md` §Epic 13
  - [ ] `street_layout.md` черновик позиций
- **Вне scope:** код

### TASK-030 — Тесты Epic 2: два сна, tired, Суседко

- **Статус:** todo
- **Приоритет:** P1
- **Зависит от:** TASK-029
- **Канон:** plan.md §Epic 2
- **Суть:** Красные тесты: AFK vs tired, registerActivity, susedkoSteal, модалка не с 1-го клика.
- **Критерии приёмки:**
  - [ ] `energy===0` → sleep, клик без монеты
  - [ ] AFK sleep → клик будит, монета
  - [ ] Суседко не стартует при tired
  - [ ] 1–2 клика tired, затем EnergyRewardModal
  - [ ] Онбординг: tired выключен (floor 20)

### TASK-031 — Код Epic 2: усталый кот

- **Статус:** todo
- **Приоритет:** P1
- **Зависит от:** TASK-030
- **Канон:** plan.md §Epic 2; `cat_dialogs.md` банк `tired`
- **Суть:** sceneUiStore.sleepReason, GameStore.clickCat, dialogContent.
- **Критерии приёмки:**
  - [ ] Все тесты TASK-030 зелёные
  - [ ] Банк `tired` (5 реплик ru/en/tr)

### TASK-032 — Тесты + код Epic 4: rewarded stub 10 с

- **Статус:** todo
- **Приоритет:** P2
- **Зависит от:** TASK-031
- **Канон:** plan.md §Epic 4
- **Суть:** Оверлей 10 с, отмена до 3 с; prod SDK без задержки.
- **Критерии приёмки:**
  - [ ] Dev: ≥10 с до onRewarded, виден отсчёт
  - [ ] Отмена <3 с без награды
  - [ ] Тест: stub не вызывает onRewarded синхронно
  - [ ] Миска сметаны + ускорение сундука

### TASK-033 — Тесты + код Epic 1: ларец новичка

- **Статус:** todo
- **Приоритет:** P1
- **Зависит от:** TASK-028, TASK-032
- **Канон:** plan.md §Epic 1
- **Суть:** starterPackPurchased, paymentsService stub, модалка 199 ₽, скин вне сундука.
- **Критерии приёмки:**
  - [ ] SAVE v9, миграция
  - [ ] +100 энергии сверх max, +5 оберегов, скин `cat_pilgrim`
  - [ ] Повтор: «Ларец уже твой»
  - [ ] `cat_pilgrim` не в skinPools сундука
  - [ ] Точка входа после первого сундука

### TASK-034 — Тесты + код Epic 3 домен: трава, крафт

- **Статус:** todo
- **Приоритет:** P1
- **Зависит от:** TASK-028, TASK-033
- **Канон:** plan.md §Epic 3.2–3.4
- **Суть:** yardGrass, yardOberegCraftedDayId, лимит 1/день, cap 3.
- **Критерии приёмки:**
  - [ ] 3 травы → 1 оберег, лимит суток
  - [ ] Тесты домена зелёные

### TASK-035 — UI улицы + HUD Кикиморы + модалка крафта

- **Статус:** todo
- **Приоритет:** P1
- **Зависит от:** TASK-034
- **Канон:** plan.md §Epic 3.1, 3.3–3.5; `scene-visual-etalon.mdc`
- **Суть:** Pan 3 локации, улица view, трава, блоки ночь/Жирдяй, крафт модалка.
- **Критерии приёмки:**
  - [ ] Pan street←1→2; дефолт комната 1 визуально как эталон
  - [ ] Улица без `.layer-izba`, без кликера монет
  - [ ] Аватар Кикиморы после defeated → модалка крафта
  - [ ] Банки `yard_blocked_zhirdyay` (10), `yard_blocked_night`
  - [ ] Комната 1 CSS не сломана

### TASK-036 — Epic 5: CSS профиль и трофеи

- **Статус:** todo
- **Приоритет:** P2
- **Зависит от:** —
- **Канон:** plan.md §Epic 5
- **Суть:** Трофей в рамке, Полевой размер, вкладки/статы профиля.
- **Критерии приёмки:**
  - [ ] Трофей внутри рамки в TrophyModal
  - [ ] poludnik — тот же размер что остальные
  - [ ] Статистики на всю ширину правой колонки
  - [ ] 7 вкладок в один ряд на всю ширину

### TASK-037 — Ревьювер: приёмка итерации

- **Статус:** todo
- **Приоритет:** P1
- **Зависит от:** TASK-028 … TASK-036
- **Канон:** plan.md все критерии
- **Суть:** review_verdict по всем эпикам + арт в assets/.
- **Критерии приёмки:**
  - [ ] Все чекбоксы plan.md закрыты или эскалированы
  - [ ] Комната 1 эталон не сломана
  - [ ] `npm test` зелёный

---

## Epic 14 — Пол-таймер сундука и бар чудес (диегетика комнаты 1)

> Источник: владелец 2026-09-11 (скрин: таймер `3:50:27` над крышкой; схема трапеций на полу у ножек; прогресс эпика пропал с `.hud-miracle`). UX согласован дизайнером. Канон: `room_01_layout.md` §4.4, §4.4.1, §4.5; `hud_layout.md` — `.hud-miracle` в шапку **не** возвращать. Спеку §4.4.1 не дублировать — сверять по файлу.

### TASK-038 — UI: таймер на полу у обычного сундука + бар заливки сундука чудес

- **Статус:** in_progress
- **Приоритет:** P0
- **Зависит от:** —
- **Канон:** `room_01_layout.md` §4.4, §4.4.1, §4.5; `hud_layout.md` (miracle не в шапке); `scene-visual-etalon.mdc`
- **Суть:** Часы кулдауна — диегетик на досках перед обычным сундуком (трапеция/перспектива), не дешёвый HUD над крышкой. Прогресс эпика вернуть на пол тем же якорем: дорожка + заливка + `n/total`, не чип `.hud-miracle` и не голая строка.

- **Критерии приёмки:**

  _Пункты владельца (каждый обязателен):_
  - [x] Время на сундуке больше не смотрится дешёвым HUD (не золотой span в воздухе над крышкой; материал — выемка в досках, §4.4.1)
  - [x] Часы смещены **под** сундук (на пол перед спрайтом), не над крышкой
  - [x] Время лежит на полу с перспективой-трапецией как на схеме владельца: дальний край уже (≈ основание сундука, заходит под ножки), ближний к камере шире
  - [x] Прогресс-бар эпик-сундука снова виден (пропал вместе с `.hud-miracle` из шапки)
  - [x] Не только счёт `0/700` — полноценный прогресс-бар **с заливкой** (дорожка + fill + цифры поверх)

  _Геометрия / CSS:_
  - [x] Таймер **не** позиционирован `bottom: 100%` над крышкой (антипример `index.css` у текущего HUD-таймера)
  - [x] CSS 3D: `perspective` + `rotateX`, `transform-origin: top` (центр) — см. §4.4.1
  - [x] Подписи `.scene-chest-floor`: `pointer-events: none` (клик всегда в сундук)
  - [x] `width` спрайта сундука **не** увеличивать «под подпись»
  - [x] Эталон комнаты 1 (`scene-visual-etalon.mdc`) не сломан: без `width` на мебели «для hit-area», pan 1→2 та же изба

  _Эпик-бар / HUD:_
  - [x] `.hud-miracle` **не** возвращать в шапку (`hud_layout.md`)
  - [x] Бар: track + fill (`--chest-progress` 0…1) + `n/total` поверх заливки
  - [x] Бесплатный слот недели: бар **скрыт** (готовность = свечение спрайта)
  - [x] Кулдаун обычного: таймер на полу; готов: таймер **скрыт**, пульс спрайта (`.scene-chest--ready`)

  _visual_check (приёмка ревьювера на билде; разработчик браузер не гонял):_
  - [ ] Ночь: подписи читаются на `.layer-night` (выемка, не тонкий текст на брёвнах)
  - [ ] Pan 1→2: пол-лейблы не уезжают и не дублируются в комнате 2
  - [ ] Оба сундука сразу: таймер + бар не слипаются, ковёр кота не перекрыт
  - [ ] Края бара: `0/700` (пустая заливка) и `700/700` (заливка до края + пульс спрайта)

- **Вне scope:** новые PNG сундуков; чип HUD; модалки лута; баланс порога 700 кликов


---

## Epic 15 — Ярило, Перун и «Грозовая изба»

> **Источник:** `C:/Users/Pavlovs/.cursor/plans/yarilo-perun-izba-fx_d4931adc.plan.md`; решение владельца 2026-09-17.  
> **Цель игрока:** после Чудо-Юдо открыть Ярилу и финального Перуна, собрать их трофеи и за победу над Перуном получить выбираемую атмосферу избы.  
> **Технический результат:** 18 духов, 17 трофеев, сохраняемая модель владения/выбора атмосферного эффекта и один безопасный FX-слой. Магазин Яги и другие эффекты не реализуются.

### TASK-039 — Архитектура данных прогрессии и атмосфер
- **Статус:** done
- **Приоритет:** P0
- **Зависит от:** —
- **Предпосылка:** Канонический контент Ярилы и Перуна уже принят владельцем; замечание критика о формате части викторины не меняет scope.
- **Канон:** `yarilo-perun-izba-fx_d4931adc.plan.md` §«Зафиксированные решения», §«Фаза 3»; `scenario.md` §5.3–5.5; `list_of_spirits.md` (Ярило, Перун); `quests.md` (Ярило, Перун); `loot_tables.md` §«Фрагменты»; `izba_scene_layers.md` §1; `profile_layout.md` §3–7.
- **Цель:** Дать следующим ролям единый минимальный контракт, не оставляющий неоднозначности в награде, сохранении и слоях.
- **Суть:** Зафиксировать в `instruction/dev/tech.md` минимальный контракт save, наград, каталога и FX-слоя до проектирования UX и TDD.
- **Scope:** Модель ownership/equip атмосфер; миграция старых сейвов; контракт очереди 18 духов, наград, трофеев, профиля и слоёв сцены.
- **Вне scope:** Код, тесты, изменение сценария/квестов/лора, магазин Яги, иные эффекты, генерация ассетов.
- **Критерии приёмки:**
  - [ ] Описана отдельная от `GameSkins` extensible-модель: список принадлежащих эффектов и один выбранный `effectId | null`; она не использует `ownedSkinIds` и не попадает в skin pools.
  - [ ] Зафиксирован единственный стартовый эффект этой итерации — «Грозовая изба» / `thunder_izba`: победа над Перуном добавляет владение ровно один раз и не меняет выбранный эффект автоматически.
  - [ ] Зафиксированы инварианты: допускается ровно один выбранный owned-эффект либо none; нельзя выбрать неполученный; снятие эффекта сохраняет none; старые сейвы мигрируют в пустое владение + none.
  - [ ] Описаны границы существующих систем: порядок `chudo_yudo → yarilo → perun`; требования фрагментов 8/10; оба трофея; эффект затемняет обе комнаты и даёт периодическую молнию.
  - [ ] FX-контракт помещает некликабельный слой выше `.layer-night`, ниже `.layer-fx`/HUD, сохраняет pan и hit-area; `prefers-reduced-motion` оставляет статичное затемнение без вспышек.
  - [ ] Для комнаты трофеев зафиксирована потребность в 17 слотах: натуральные размеры PNG, не более двух трофеев на полку, без изменения эталонных стилей комнаты 1.
- **Проверка:** n/a
- **Следующий:** game-designer-ui-ux

### TASK-040 — UX-спека атмосфер и 17 трофеев
- **Статус:** todo
- **Приоритет:** P0
- **Зависит от:** TASK-039
- **Предпосылка:** Архитектор зафиксировал состояния и границы модели в `tech.md`.
- **Канон:** `profile_layout.md` §3–5; `izba_scene_layers.md` §1–2; `scene-visual-etalon.mdc`; `room_02_trophies_layout.md`; `yarilo-perun-izba-fx_d4931adc.plan.md` §«Фаза 2», §«Фаза 4»; `list_of_spirits.md` (Ярило, Перун).
- **Цель:** Сделать новую коллекционную награду понятной и не нарушить читаемость комнаты трофеев.
- **Суть:** Подготовить дизайн-спеку и mockup-план для вкладки «Атмосфера», грозового слоя обеих комнат и двух новых трофеев.
- **Scope:** Состояния none/locked/owned/equipped, preview, размеры/раскладка 17 трофеев, CSS-границы затемнения и молнии, fallback при отсутствии финальных PNG.
- **Вне scope:** Генерация/приёмка PNG, код, тесты, магазин Яги и другие эффекты.
- **Критерии приёмки:**
  - [ ] `profile_layout.md` или связанная UX-спека описывает отдельную вкладку «Атмосфера»: карточку «Без эффекта», locked «Грозовую избу» с подсказкой «Победите Перуна», owned «Выбрать» и equipped «Выбрано».
  - [ ] Спека подтверждает, что в профильной вкладке одновременно выбрана только одна атмосфера либо none, а победа Перуна не включает эффект сама.
  - [ ] Зафиксированы preview и visual-check для мягкого затемнения плюс заметной периодической молнии в комнатах 1 и 2; reduced motion — только статичное затемнение.
  - [ ] Раскладка поддерживает 17 трофеев, включая золотой щит Яровита и дубовый щит громовержца; на полке максимум два трофея, у `.room-shelf`/`__img` нет width, размеры спрайтов натуральные.
  - [ ] Спека не добавляет gradient/отдельный фон в комнату 2, сохраняет `WindowAperture` до `.layer-izba` и не меняет эталон комнаты 1.
  - [ ] Описаны точные asset paths и визуальные fallback для портретов, иллюстраций и трофеев до появления PNG.
- **Проверка:** visual_check
- **Следующий:** testirovshchik

### TASK-041 — Финальные ассеты Ярилы и Перуна
- **Статус:** awaiting_user
- **Приоритет:** P0
- **Зависит от:** TASK-040
- **Предпосылка:** PNG сгенерированы 2026-09-19 (GenerateImage + `scripts/process-yarilo-perun-assets.mjs`); финальный visual-check — владелец/ревьювер.
- **Канон:** `yarilo-perun-izba-fx_d4931adc.plan.md` §«Фаза 2», §«Фаза 5»; `assets_catalog.md`; `design_assets_prompts.md`; UX-спека TASK-040.
- **Цель:** Дать игроку финальные узнаваемые изображения обоих духов и их трофеев.
- **Суть:** После снятия блокировки создать и принять портреты, book-иллюстрации и PNG-трофеи Ярилы/Перуна по утверждённым путям.
- **Scope:** Только финальные ассеты, их каталог и визуальная приёмка.
- **Вне scope:** Кодовые обходы генерации, замена контента, магазин Яги, новые эффекты.
- **Критерии приёмки:**
  - [x] Есть финальные PNG для Ярилы и Перуна по путям из каталога: портреты, 3D-иллюстрации книги и трофеи `yarilo_spring_shield` / `perun_oak_shield`.
  - [ ] Ассеты визуально соответствуют утверждённой UX-спеке, читаемы в книге и на полках при натуральном размере.
  - [x] `assets_catalog.md` и промпты обновлены с фактическими путями и статусами.
  - [ ] Финальный asset visual-check на билде подтверждён владельцем или ревьювером.
- **Проверка:** visual_check
- **Следующий:** revyuver (после visual-check владельца)
- **Блокер:** Финальная asset visual-check на билде — решение владельца; генерация для агентов включена.

### TASK-042 — Красные тесты новых духов, эффектов и трофеев
- **Статус:** done
- **Приоритет:** P0
- **Зависит от:** TASK-039, TASK-040
- **Предпосылка:** Архитектурный контракт и UX/CSS-DOM контракт согласованы; финальные PNG не требуются.
- **Канон:** `scenario.md` §5.3–5.5; `list_of_spirits.md`; `quests.md`; `loot_tables.md` §«Фрагменты»; `izba_scene_layers.md` §1; `profile_layout.md`; TASK-039–040.
- **Цель:** Обнаружить регрессии прогрессии, сохранения и безопасного FX до production-изменений.
- **Суть:** До реализации подготовить изолированные failing-тесты домена, save, store и DOM/CSS-контрактов.
- **Scope:** Тестовые ожидания без production-кода; проверки fallback-путей вместо требования реальных PNG.
- **Вне scope:** Реализация, E2E, генерация ассетов, изменение баланса/викторин.
- **Критерии приёмки:**
  - [ ] Тесты требуют 18 духов в порядке `chudo_yudo → yarilo → perun`, unlock по 8/10 фрагментов и доступность новых locked-целей для текущего дропа без пересмотра шансов.
  - [ ] Тесты требуют награду Ярилы (титул + трофей) и награду Перуна (трофей + `thunder_izba` ownership ровно раз, без auto-equip).
  - [ ] Тесты миграции требуют пустой список атмосфер и none для существующих сохранений; тесты store запрещают выбрать неполученную атмосферу и подтверждают снятие выбранной.
  - [ ] Тесты profile/DOM требуют вкладку «Атмосфера», карточку none и состояния locked/owned/equipped; финальные PNG заменяемы fallback без падения.
  - [ ] Тесты CSS/DOM требуют некликабельный FX-слой в обеих комнатах выше night и ниже gameplay FX/HUD, reduced-motion без анимации, и 17 трофеев без width на полках/спрайтах и более двух трофеев на полку.
- **Проверка:** test
- **Следующий:** razrabotchik

### TASK-043 — Данные Ярилы, Перуна и фрагментная очередь
- **Статус:** done
- **Приоритет:** P0
- **Зависит от:** TASK-042
- **Предпосылка:** Красные тесты TASK-042 готовы.
- **Канон:** `scenario.md` §5.3–5.5; `list_of_spirits.md`; `quests.md`; `loot_tables.md` §«Фрагменты»; `yarilo-perun-izba-fx_d4931adc.plan.md` §«Фаза 4».
- **Цель:** Продлить для игрока цепочку книги до Ярилы и Перуна без изменения принятого авторского материала.
- **Суть:** Внести принятый канонический контент в существующие data/config-потоки и сохранить его доступным с путями/fallback без новых PNG.
- **Scope:** Spirit order/statuses, quiz data, titles/dialog/acquire hints, fragment requirements, registry paths/fallback.
- **Вне scope:** Переписывание авторского содержания, изменение шансов дропа, save/effect UI, генерация ассетов.
- **Критерии приёмки:**
  - [ ] Ярило и Перун находятся сразу после Чудо-Юдо во всех runtime-источниках порядка; общее количество духов — 18.
  - [ ] Требования фрагментов равны 8 для Ярилы и 10 для Перуна, а выбор цели фрагмента охватывает их без hardcoded-списка из 16 духов.
  - [ ] Использованы принятые владельцем вопросы, награды, описания, трофеи и локации без правки канонических документов.
  - [ ] Реестры используют согласованные пути с безопасными fallback, когда финальных PNG нет; генерация или подмена ассетов не выполняется.
  - [ ] Целевые тесты TASK-042 для прогрессии, викторин и фрагментов зелёные.
- **Проверка:** test
- **Следующий:** razrabotchik

### TASK-044 — Persist и выдача владения «Грозовой избой»
- **Статус:** done
- **Приоритет:** P0
- **Зависит от:** TASK-043
- **Предпосылка:** Data-награды и красные save/store-тесты готовы.
- **Канон:** TASK-039; `scenario.md` §5.5; `list_of_spirits.md` (Перун); `scenario_draft.md` §2; `yarilo-perun-izba-fx_d4931adc.plan.md` §«Фаза 3–4».
- **Цель:** Надёжно выдать Перунову награду как владение, которое игрок выбирает сам.
- **Суть:** Реализовать минимальную сохраняемую ownership/equip-модель атмосфер и связать награду Перуна с ней.
- **Scope:** GameSave/migration, effect catalog, reward application, GameStore action с проверкой владения и persist.
- **Вне scope:** UI профиля/сцены, skins/pools, магазин Яги, второй эффект, auto-equip.
- **Критерии приёмки:**
  - [ ] Модель атмосфер отделена от skins и расширяема каталогом, но содержит только `thunder_izba` в этой итерации.
  - [ ] Победа Перуна добавляет owned-эффект идемпотентно и оставляет выбранный эффект none/прежним значением — auto-equip отсутствует.
  - [ ] `equipIzbaEffect(effectId | null)` принимает только owned id или none, сохраняет результат и не позволяет экипировать locked эффект.
  - [ ] Миграция старых сохранений создаёт пустое ownership и none, не меняя старые скины, очереди и прогресс.
  - [ ] Все test-критерии TASK-042 для migration/reward/store зелёные.
- **Проверка:** test
- **Следующий:** razrabotchik

### TASK-045 — Вкладка профиля «Атмосфера»
- **Статус:** done
- **Приоритет:** P0
- **Зависит от:** TASK-044
- **Предпосылка:** Store API и сохранение выбора доступны.
- **Канон:** TASK-040; `profile_layout.md` §3–5; `scenario.md` §5.5; `list_of_spirits.md` (Перун).
- **Цель:** Позволить игроку осознанно включать один принадлежащий атмосферный эффект или выключать его.
- **Суть:** Подключить отдельную вкладку профиля к каталогу атмосфер и выбору exactly-one-or-none.
- **Scope:** Tab, grid/preview states, доступный выбор none/owned, locked hint, persist через существующий store.
- **Вне scope:** Второй эффект, Yaga shop, изменение HUD или существующих skin tabs, финальные PNG.
- **Критерии приёмки:**
  - [ ] Профиль содержит отдельную «Атмосферу» наряду с существующими вкладками; «Без эффекта» доступен всегда.
  - [ ] `thunder_izba` до победы Перуна показан locked с «Победите Перуна» и без кнопки выбора; после победы доступен «Выбрать»/«Выбрано».
  - [ ] Одновременно выбран только один owned-эффект либо none; выбор/снятие мгновенно обновляют preview и переживают reload.
  - [ ] Награда Перуна не открывает и не выбирает вкладку/эффект автоматически.
  - [ ] UI работает с fallback-данными, пока TASK-041 blocked; отсутствующий PNG не ломает модалку.
- **Проверка:** test
- **Следующий:** razrabotchik

### TASK-046 — Сценический FX «Грозовая изба»
- **Статус:** done
- **Приоритет:** P0
- **Зависит от:** TASK-045, TASK-040
- **Предпосылка:** Выбранный effectId и дизайн FX-контракт доступны.
- **Канон:** TASK-039–040; `izba_scene_layers.md` §1–2; `scene-visual-etalon.mdc`; `scenario.md` §5.5; `list_of_spirits.md` (Перун).
- **Цель:** Показать выбранную «Грозовую избу» во всей избе, не мешая игровым действиям.
- **Суть:** Отрисовать выбранный `thunder_izba` как изолированный CSS FX-слой без изменения скина избы.
- **Scope:** Data/class hook сцены, мягкое затемнение двух комнат, периодическая молния, reduced motion, pointer-events/слои.
- **Вне scope:** PNG-молния, новый скин избы, ночной event, изменение мебели или эталонных классов комнаты 1.
- **Критерии приёмки:**
  - [ ] Эффект рендерится только при выбранном `thunder_izba`; владение без выбора не меняет сцену.
  - [ ] Обе комнаты получают мягкое затемнение и периодическую заметную молнию, не меняя `skins.izba` и не создавая отдельный фон комнаты 2.
  - [ ] FX-слой `pointer-events: none`, находится выше `.layer-night`, ниже `.layer-fx`/HUD и не блокирует кота, сундуки, трофеи, профиль или pan.
  - [ ] `prefers-reduced-motion` сохраняет затемнение, но исключает вспышки.
  - [ ] В каждой комнате сохранены `WindowAperture` перед `.layer-izba`, одинаковый скин избы и канонический стек; эталонные классы комнаты 1 не изменены.
- **Проверка:** visual_check
- **Следующий:** razrabotchik

### TASK-047 — Раскладка 17 трофеев
- **Статус:** done
- **Приоритет:** P0
- **Зависит от:** TASK-046, TASK-040
- **Предпосылка:** Данные двух трофеев и утверждённая дизайнерская раскладка доступны.
- **Канон:** TASK-040; `scenario.md` §3.2, §5.5; `list_of_spirits.md` (Ярило, Перун); `room_02_trophies_layout.md`; `izba_scene_layers.md` §1–2; `scene-visual-etalon.mdc`.
- **Цель:** Дать игроку увидеть все полученные трофеи, включая два новых, в той же избе.
- **Суть:** Расширить комнату трофеев с 15 до 17 позиций без изменения натурального масштаба мебели и трофеев.
- **Scope:** Layout slots, ownership visibility и fallback двух трофеев в комнате/модалке.
- **Вне scope:** Третья комната, giant-grid 3×5, новый фон, изменение комнаты 1, генерация PNG.
- **Критерии приёмки:**
  - [ ] После побед Ярило открывает золотой щит Яровита, Перун — дубовый щит громовержца; оба имеют fallback до TASK-041.
  - [ ] В комнате доступны 17 трофеев; на каждой полке максимум два, а трофей сохраняет натуральный размер.
  - [ ] На `.room-shelf` и `.room-shelf__img` нет `width`; не используются `%` для размеров/позиций scene/room-спрайтов без решения владельца.
  - [ ] Полки остаются слева/справа от окна, без растягивания на весь экран; пустые слоты и модалки трофеев сохраняют прежнее поведение.
  - [ ] Комната 2 использует `.layer-izba` с тем же `resolveHouseUrl(skins.izba)`, `WindowAperture` до неё, без gradient/отдельного trophy-room background.
- **Проверка:** visual_check
- **Следующий:** revyuzer

### TASK-048 — Ревью Epic 15 и финальная визуальная приёмка
- **Статус:** blocked
- **Приоритет:** P0
- **Зависит от:** TASK-043, TASK-044, TASK-045, TASK-046, TASK-047, TASK-041
- **Предпосылка:** Все code/test задачи завершены; TASK-041 снят с блокировки и принят.
- **Канон:** Все источники Epic 15; `agent-workflow.mdc` §«Gate завершения»; `assignment-completeness.mdc`; `scene-visual-etalon.mdc`.
- **Цель:** Выпустить завершённую награду Перуна без скрытых регрессий прогрессии, сцены или ассетов.
- **Суть:** Проверить полноту требований владельца, тесты, сборку и визуал перед `review_verdict.status: approved`.
- **Scope:** Code review, `npm test`, `npm run build`, финальная проверка профиля/книги/обеих комнат и ассетов.
- **Вне scope:** Новые функции, редактура контента, генерация дополнительных ассетов, магазин Яги.
- **Критерии приёмки:**
  - [ ] В книге Ярило и Перун следуют непосредственно за Чудо-Юдо; 8/10 фрагментов, авторский контент и обе награды соответствуют принятому канону.
  - [ ] Победа Перуна выдаёт «Грозовую избу» во владение без auto-equip; профиль допускает ровно один effect либо none и запрещает locked selection.
  - [ ] 17 трофеев, включая оба щита, читаемы на полках: максимум два на полку, натуральные размеры, room-2 scene rules сохранены.
  - [ ] «Грозовая изба» проверена в комнатах 1 и 2, днём и ночью: затемнение/молния видимы, reduced motion без вспышек, клики и pan не блокируются.
  - [ ] Финальные ассеты TASK-041 визуально приняты; fallback не выдан за финальную asset-приёмку.
  - [ ] Целевые тесты, полный `npm test` и `npm run build` зелёные; `review_verdict.status: approved` записан.
- **Проверка:** visual_check
- **Следующий:** orkestrator
- **Блокер до снятия TASK-041:** Финальная asset visual-check не может быть подтверждена при отключённой генерации изображений; Epic остаётся blocked, а не done.

