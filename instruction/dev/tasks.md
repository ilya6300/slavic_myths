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




```markdown

### TASK-XXX — заголовок

- **Статус:** todo

- **Приоритет:** P0

- **Зависит от:** —

- **Канон:** scenario.md §… / scenario_draft.md §…

- **Суть:**

- **Критерии приёмки:**

  - [ ] …

- **Вне scope:**

```


