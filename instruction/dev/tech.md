# Техническая документация



> Заполняет **технический архитектор**.  

> Опирается на: `instruction/dev/tasks.md`, `instruction/dev/technical_requirements.md`, `instruction/scenario_draft.md`.



---



## Обзор стека (канон)



| Слой | Технология |

|------|------------|

| UI | React + Vite + CSS |

| State | MobX — `GameStore` |

| Persist | localStorage + облако Яндекс.Игр |

| Platform | SDK Яндекс.Игр + `isTestMode` моки |



Поток: действие → MobX action → `SaveService.schedulePersist()` → local (+ cloud если auth).



---



## Epic 0 — Каркас и данные



### Решение



Минимальный Vite-проект с разделением `config/` · `data/` · `domain/` · `ui/`. Геймплей и store — Epic 1+. Викторина генерируется скриптом `scripts/generate-quiz.mjs` из `instruction/quests.md`.



### Структура модулей



```

src/

  config/     gameConstants, assetRegistry, sceneLayout, lootTables

  data/       spirits, quiz, titles, catDialogs, susedkoDialogs

  domain/     GameSave, grade

  ui/         App (заглушка до Epic 2)

  main.tsx

```



### Ключевые типы



- `GameSave` — `src/domain/GameSave.ts`; расширения vs draft: `lastEnergyAt`, `onboardingCompleted`, `spareChestKeys`, `nightId`, `wonderChestWeekId`

- `SpiritDefinition` — награды через `SpiritRewardKind`, не строки в UI

- `TitleDefinition` — `source`: start | quest | chest | event | miracle_chest

- `regularChestTypeWeightsByGrade` — тип×грейд для Epic 5



### Инварианты



- ID духов = `SpiritId` из `assetRegistry` (Полевой → `poludnik`)

- Epoch-титулы не в пуле обычного сундука

- Пустые банки `greet_return`, `click`, … — ждут контент от сценариста



### Соответствие задачам



| Модуль | TASK-001 |

|--------|----------|

| package.json, vite, vitest | ✓ |

| gameConstants.ts | ✓ |

| GameSave.ts | ✓ |

| spirits.ts, quiz.ts, titles.ts | ✓ |

| catDialogs.ts, susedkoDialogs.ts | ✓ |

| lootTables type weights | ✓ |



---



## Epic 1 — GameStore (запланирован)



_Секция заполнится при старте TASK-002._



---



## Epic 4 — Книга, викторина, очередь духов



### Решение



- `domain/spiritQueue.ts` — unlock после `defeated`, мягкая очередь `after_spirit`
- `domain/applySpiritReward.ts` — все `SpiritRewardKind` из §5.5
- `store/quizUiStore.ts` — фаза викторины (вопрос / победа / провал)
- `store/bookUiStore.ts` — страница разворота, навигация
- `GameStore.startQuiz` / `submitQuizAnswer` / `claimQuizVictory` — энергия, обереги, онбординг 2–4
- UI: `BookModal`, `QuizModal`, `BrownieLayer`
- Фоны викторины: `quizBackgrounds` в `assetRegistry` (fallback house/view + CSS filter)



### Соответствие задачам



| Модуль | TASK-005 |

|--------|----------|

| spiritQueue.ts | ✓ |

| applySpiritReward.ts | ✓ |

| quizUiStore, bookUiStore | ✓ |

| GameStore quiz actions | ✓ |

| BookModal, QuizModal | ✓ |

| BrownieLayer | ✓ |

| Тесты domain + store | ✓ |



---



## Epic 5 — Обычный сундук, лут, онбординг 5–6



### Решение



- `domain/brownieLuck.ts` — бонус rare+ по грейду скина домового (`BROWNIE_LUCK_BY_SKIN_GRADE`)
- `domain/chestCooldown.ts` — готовность, остаток кулдауна, skip −30 мин
- `domain/chestLoot.ts` — ролл грейда/типа, дубликаты, применение к state
- `data/skinPools.ts` — пулы скинов по категории×грейд для дропа
- `store/chestUiStore.ts` — фаза модалки, последний лут
- `GameStore.openChest` / `dismissChestLoot` / `skipChestCooldownWithRewarded`
- UI: `ChestLootModal`, клик сундука + `TutorialHighlight` шаг 5
- Повторный вход: `onboardingCompleted && !isFirstLaunch` → `sceneUiStore.catSleeping`



### Соответствие задачам



| Модуль | TASK-006 |

|--------|----------|

| brownieLuck.ts | ✓ |

| chestCooldown.ts | ✓ |

| chestLoot.ts | ✓ |

| chestUiStore | ✓ |

| GameStore chest actions | ✓ |

| ChestLootModal | ✓ |

| Онбординг 5–6 | ✓ |

| Тесты domain + store | ✓ |



---



## Epic 6 — Трофеи и профиль



### Решение



- `TrophyRoom` + `TrophyModal` — комната 2, `trophySlotLayout`
- `ProfileModal` + `profileUiStore` + `data/profileCatalog.ts`
- `GameStore.equipSkin` / `equipTitle` / `isTrophyUnlocked`
- HUD `.hud-profile` кликабелен



---



## Epic 8 — Фрагменты и Сундук чудес



### Решение



- `domain/wonderChest.ts` — неделя (пн 00:00), eligibility, стоимость открытия
- `domain/miracleChestLoot.ts` — ролл 25% / pity 8, утешительный пул, применение лута
- `domain/spiritQueue.applyFragmentUnlocks` — unlock по собранным фрагментам
- `GameSave.fragmentVictoryBonusGranted` — разовый бонус rare+ побед
- `GameStore.openWonderChest` / `selectFragmentSpirit` / прогресс кликов
- UI: сундук на сцене, HUD `.hud-miracle`, фрагменты в `BookModal`, `ChestLootModal` miracle mode



### Соответствие задачам



| Модуль | TASK-009 |

|--------|----------|

| wonderChest.ts | ✓ |

| miracleChestLoot.ts | ✓ |

| spiritQueue fragment unlock | ✓ |

| GameStore wonder actions | ✓ |

| BookModal fragments | ✓ |

| IzbaScene miracle chest | ✓ |

| GameHud miracle progress | ✓ |

| Тесты domain + store | ✓ |



---



## Epic 9 — Настройки и удержание



### Решение



- `domain/retention.ts` — условия баннера облака и сноски chest_ready
- `settingsUiStore` — auth status, confirm сброса
- `GameStore.resetProgress` / `dismissCloudBanner` / `isCloudBannerVisible`
- `CloudBanner` + `useRetentionBootstrap` — баннер и сноска при входе
- `SettingsPanel` — язык, мок-вход, сброс с confirm
- `gameBootstrap` — `saveService.bind` с cloudWriter + `settingsUiStore.refreshAuth`



### Соответствие задачам



| Модуль | TASK-010 |

|--------|----------|

| retention.ts | ✓ |

| settingsUiStore | ✓ |

| GameStore retention actions | ✓ |

| CloudBanner, useRetentionBootstrap | ✓ |

| SettingsPanel | ✓ |

| gameBootstrap cloud persist | ✓ |

| Тесты | ✓ |



---



## Epic 7 — Ночь, Жирдяй, кража



### Решение



- `eventUiStore` — тик кражи и спавна Жирдяя
- `domain/susedkoSteal.ts`, `domain/zhirdyay.ts`
- `SusedkoStealLayer` z-index 55; Жирдяй в `window-aperture`
- `GameSave`: `zhirdyayActive`, `zhirdyayClickProgress`, `zhirdyayClicksRequired`
- `syncNightState` сбрасывает `zhirdyaySeenThisNight` на новую ночь



---



## Epic 10 — Анимация и UX разворота книги



### Решение



Книга на сцене остаётся закрытым спрайтом (`furniture.bookClosed`). Клик запускает **state machine** в `bookUiStore` (`idle` → `flying` → `crossfading` → `content` → `closing` → `idle`): FLIP-полёт closed из rect подставки в центр, crossfade на `bookOpen`, fade-in контента на пергаменте. Generic modal-карточка `.book-modal__inner` удаляется — единственный визуальный контейнер разворота — `book_of_spirits_open.png` в `.book-modal__stage`. UI-кнопки бестиария — namespace `bookUi` в `assetRegistry` (P0 PNG или задокументированный CSS-fallback до TASK-012). Pan избы и повторный клик блокируются на всё время `isOverlayActive`, не только при `isOpen`.



### Структура модулей



| Путь | Ответственность |

|------|-----------------|

| `src/config/assetRegistry.ts` | `furniture.bookOpen`; namespace `bookUi` (стрелки, quest, close, paw; P1: bookmark) |

| `src/store/bookUiStore.ts` | `BookPhase`, таймеры открытия/закрытия, навигация страниц, `isFlipping` (P1) |

| `src/store/bookUiStore.test.ts` | Фазы, таймеры, reduced-motion, сброс при `close` |

| `src/ui/book/BookOverlay.tsx` | Overlay: backdrop, `.book-flight` (FLIP), `.book-modal__stage`, spread-контент |

| `src/ui/book/BookModal.tsx` | **Удалить или слить** в `BookOverlay` — не два параллельных компонента |

| `src/ui/scene/IzbaSceneLayers.tsx` | `useRef` на `.scene-book`; `handleBookClick` → `getBoundingClientRect()` → `startOpen`; guard `isOverlayActive`; `visibility: hidden` на сцене при overlay |

| `src/ui/scene/IzbaScene.tsx` | Монтировать `BookOverlay` вместо `BookModal` |

| `src/ui/onboarding/useOnboardingBootstrap.ts` | `panBlocked` при `isOverlayActive \|\| isOpen` |

| `src/config/bookStage.ts` | `BOOK_OPEN_ASPECT` (902/723 ≈ 1.248), пиксели open-PNG; канон для тестов |
| `src/config/bookStage.test.ts` | aspect ≈ 1.248; CSS book-modal без `1.55` |
| `src/ui/index.css` | Hover §1.1; `.scene-book { width: 9vw }`; `--book-open-aspect: 1.248`; зоны plan.md §5.2 |

| `instruction/design_assets_prompts.md` | P0-промпты `book_quest_btn_wood`, `icon_paw`, `book_close_wood` (TASK-011) |

| `instruction/assets_catalog.md` | Статусы `book_of_spirits_open.png` и UI PNG |



### 1. State machine `BookPhase` и поля store



**Тип фазы** (канон `book_layout.md` §2.2–2.3, план §Фаза 2):



```ts
type BookPhase = 'idle' | 'flying' | 'crossfading' | 'content' | 'closing';
```



**Поля `BookUiStore`** (расширение текущего `isOpen` / `pageIndex` / `isFlipping`):



| Поле | Тип | Назначение |

|------|-----|------------|

| `phase` | `BookPhase` | Текущая фаза анимации; `idle` = книга не в overlay |

| `flightFrom` | `DOMRect \| null` | Rect `.scene-book` при клике; цель FLIP назад при закрытии |

| `showPageContent` | `boolean` | `true` после t=1250 ms от `startOpen`; контент и a11y |

| `coverVariant` | `'closed' \| 'open'` | Какой спрайт виден на stage после crossfade |

| `isOpen` | `boolean` | **Совместимость:** `true` с фазы `flying` до сброса в `idle` (онбординг, pan) |

| `pageIndex` | `number` | Индекс духа в `SPIRIT_ORDER` (как сейчас) |

| `isFlipping` | `boolean` | P1 (TASK-018): блок навигации во время 3D flip |

| `_timers` | `number[]` (private) | `setTimeout` id; очистка в `close()` / `reset()` |



**Геттеры:**



- `isOverlayActive` = `phase !== 'idle'` — overlay в DOM, сцена скрывает книгу, pan blocked, guard клика

- `isInteractionBlocked` = `phase !== 'content'` — backdrop, ×, стрелки, «В путь» неактивны



**Actions:**



| Метод | Поведение |

|-------|-----------|

| `startOpen(spiritId?, fromRect)` | `phase='flying'`, `isOpen=true`, `flightFrom=fromRect`, `showPageContent=false`, `coverVariant='closed'`; `pageIndex` из `spiritId`; t=1000 ms → `crossfading` + `coverVariant='open'`; t=1250 ms → `content`, `showPageContent=true` |

| `close()` | Только из `content` (UI); `phase='closing'`; цепочка ≤500 ms (§2.3); сброс таймеров; финал `idle`, `isOpen=false`, поля анимации в начальное |

| `open(spiritId?)` | **Deprecated для сцены** — заменить вызовы на `startOpen`; оставить для тестов/внешних триггеров с `fromRect=null` → reduced-motion shortcut |

| `goPrev` / `goNext` / `jumpToSpirit` / `setPageIndex` | Как сейчас; в P0 без flip; P1 — через `startFlip`/`endFlip` |

| `reset()` | Очистка таймеров + `idle` (тесты, сброс прогресса) |



**Reduced motion:** при `matchMedia('(prefers-reduced-motion: reduce)')` в `startOpen` — мгновенно `phase='content'`, `coverVariant='open'`, `showPageContent=true` (без таймеров полёта). В `close` — мгновенный `idle`.



**Связь с `GameStore`:** `gameStore.openBook()` (онбординг шаг 1→2) вызывается **до** `startOpen` в `handleBookClick`; store книги не сериализуется в `GameSave`.



### 2. Компонентная структура: `BookOverlay` vs `BookModal`



**Один компонент** — `BookOverlay.tsx` (`observer`). `BookModal.tsx` не оставлять как второй entry: перенести разметку spread и удалить файл или re-export из overlay.



**Условие монтирования:** `bookUiStore.isOverlayActive` (не `isOpen` alone — overlay виден с t=0 полёта).



**DOM-скелет** (канон `book_layout.md` §2.4, §3.4):



```text
.layer-modal.book-modal[data-phase]
  backdrop (клик → close, только phase=content)
  .book-flight                    ← closed PNG, FLIP transform
    img (furniture.bookClosed)
  .book-modal__stage               ← виден после crossfade
    img.book-modal__cover-open (furniture.bookOpen)
    .book-modal__ribbon            ← точки глав + счётчик
    button.book-modal__bookmark     ← P1-ассет / CSS-лента
    button.book-modal__close
    .book-modal__spread             ← opacity по showPageContent
      .book-page--left / --right
    .book-nav--prev / --next
```



**Разделение ответственности:**



| Зона | Кто |

|------|-----|

| Фазы, таймеры, rect | `bookUiStore` |

| FLIP math, `onTransitionEnd` | `BookOverlay` (один inline `transform` на `.book-flight`) |

| Контент духа, квест, фрагменты | JSX в `BookOverlay` (логика из текущего `BookModal`) |

| Сцена: клик, ref, hide sprite | `IzbaSceneLayers` |

| Стили hover, stage, зоны, анимации | `index.css` |



**Слой DOM:** `.layer-modal` z-index 200 (`izba_scene_layers.md` §2.2); монтирование в `IzbaScene` рядом с другими модалками.



### 3. FLIP transform — единственный допустимый inline style



Исключение из `css-styling.mdc` **только** для `.book-flight`:



```tsx
style={{ transform: `translate(${dx}px, ${dy}px) scale(${s})` }}
```



**Алгоритм (mount / phase `flying`):**



1. `flightFrom` из store — rect книги на сцене.

2. Целевой box — `.book-modal__stage` (размеры §2.5).

3. Вычислить `dx`, `dy`, `scale` от центра rect → центр viewport / target size.

4. CSS `transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)` на `.book-flight`.

5. После apply transform — «полёт»; t=1000 ms store → `crossfading` (opacity crossfade в CSS, не смена `src` до этого момента).

6. Закрытие (TASK-017): обратный FLIP в `flightFrom`, 0.2 s.



**Запрещено** в book-модулях: любые другие `style={{ }}` (позиции, opacity, width). Crossfade, backdrop, fade контента — классы / `data-phase` / `data-show-content`.



**Приёмка:** `grep style=` в `src/ui/book/` — одна строка transform на `.book-flight` (или две: open + close FLIP).



### 4. `assetRegistry`: `bookOpen` + namespace `bookUi`



**`furniture`** (дополнение):



```ts
bookOpen: fromAssets('furniture/book_of_spirits_open.png'),
```



Файл в репо (prerequisite TASK-011). `bookClosed` — без изменений (сцена + полёт).



**Namespace `bookUi`** (отдельный export, не внутри `furniture`):



```ts
export const bookUi = {
  arrowLeft: fromAssets('ui/arrow_left_wood.png'),
  arrowRight: fromAssets('ui/arrow_right_wood.png'),
  questBtn: fromAssets('ui/book_quest_btn_wood.png'),
  closeBtn: fromAssets('ui/book_close_wood.png'),
  pawIcon: fromAssets('ui/icon_paw.png'),
  bookmark: fromAssets('ui/book_bookmark_green.png'), // P1
} as const;
```



| Ключ | Файл | Приоритет | TASK |

|------|------|-----------|------|

| `arrowLeft` / `arrowRight` | `arrow_*_wood.png` | P0 | TASK-012 |

| `questBtn` | `book_quest_btn_wood.png` | P0 | TASK-012 |

| `pawIcon` | `icon_paw.png` | P0 | TASK-012 |

| `closeBtn` | `book_close_wood.png` | P0 | TASK-012 |

| `bookmark` | `book_bookmark_green.png` | P1 | после MVP |

| `badge_grade_*` | уже в реестре UI | P1 | CSS-классы до PNG |



TASK-011: пути в реестре **до** появления PNG (как `miracleChestClosed` fallback). TASK-016: `<img>` / `background-image` из `bookUi`; до TASK-012 — CSS-fallback (unicode ← →, плашка quest) **явно временный**.



### 5. Интеграция pan-блокировки (`useOnboardingBootstrap`)



**Текущее:** `book: bookUiStore.isOpen` — не покрывает фазы `flying` / `crossfading` / `closing`.



**Целевое:**



```ts
book: bookUiStore.isOverlayActive || bookUiStore.isOpen,
```



Практически при корректном store `isOpen` true на всём overlay; `isOverlayActive` — главный сигнал. `sceneUiStore.panBlocked = shouldBlockPan(...) || book || quiz`.



**Дополнительно в сцене:**



- `handleBookClick`: early return если `bookUiStore.isOverlayActive`

- `SceneSprite` книги: `interactive={bookAllowed && !bookUiStore.isOverlayActive}`

- CSS: `.izba-scene[data-book-overlay] .scene-book { visibility: hidden }` — data-атрибут на корне сцены из `isOverlayActive` (избежать двойного спрайта)



Онбординг `canInteract(..., 'book')` — без изменений; блокировка pan синхронна overlay.



### 6. Тестовая стратегия (`bookUiStore.test.ts`)



Новый файл по паттерну `sceneUiStore.test.ts`: **vitest**, `vi.useFakeTimers()` для таймеров.



| Тест | Критерий TASK-014 |

|------|-------------------|

| `should start in idle` | `phase === 'idle'`, `isOverlayActive === false` |

| `should transition flying → crossfading at 1000ms` | после `startOpen` + `advanceTimersByTime(1000)` |

| `should show content at 1250ms` | `phase === 'content'`, `showPageContent === true` |

| `should set pageIndex from spiritId` | `startOpen('bannik', mockRect)` |

| `should clear timers on close` | `close()` из content, нет скачка фазы после advance |

| `should return to idle after close sequence` | mock `endClose` или advance ≤500 ms |

| `should block interaction outside content` | `isInteractionBlocked` true в `flying` |

| `should shortcut to content when reduced motion` | mock `matchMedia`; без задержки |

| `goPrev/goNext ignore when isFlipping` | P1 / заготовка для TASK-018 |



**Не тестировать в store-тестах:** FLIP math, DOM rect (оставить для ручной приёмки / опциональный компонентный тест). **Мокать:** `window.matchMedia`, `DOMRect` как `{ left, top, width, height }`.



**GameStore:** существующий тест `openBook` не меняется; интеграция сцена+store — чеклист TASK-015.



### 7. Зависимости между TASK



```text
TASK-011 (реестр + промпты)
    └── TASK-012 (PNG P0)

TASK-013 (hover CSS)          ─┐
TASK-014 (store + тесты)      ─┼── параллельно, без взаимных deps
                               │
TASK-011 + TASK-014 ──► TASK-015 (BookOverlay: полёт, crossfade, блокировки)
                               │
              TASK-015 + TASK-012* ──► TASK-016 (пергамент, зоны, UI-кнопки)
                               │
              TASK-015 + TASK-016 ──► TASK-017 (закрытие ≤500ms)
                               │
              TASK-017 ──► TASK-018 (P1: page-flip, свайп)
```



\* TASK-016 может стартовать после TASK-015 с CSS-fallback; финальные PNG — после TASK-012.



**Порядок разработки (рекомендация):** 011 → 014 ∥ 013 → 015 → 016 (012 параллельно с 015–016) → 017 → 018.



### Инварианты



- Книга на сцене и в overlay — **один** closed спрайт в полёте; сцена скрывает `.scene-book` при overlay.

- Не менять `src` closed→open до t=1000 ms (пропорции §2.4).

- `bookUiStore` не в `GameSave`; `toSave`/`hydrate` без изменений.

- Закрытие и backdrop не прерывают полёт/crossfade — только `phase === 'content'`.

- Нет `width`/`height` на `.scene-book` для hit-area (`css-styling.mdc`, `scene-visual-etalon`).

- Слои избы: overlay в `.layer-modal`, не подменять `.layer-izba` / pan комнат.

- Онбординг: `gameStore.openBook()` сохраняется в `handleBookClick` перед `startOpen`.



### Риски



| Риск | Митигация |

|------|-----------|

| Двойная книга (сцена + overlay) | `visibility: hidden` + guard клика |

| Гонка таймеров при быстром close | очистка `_timers` в `close()`/`reset()` |

| Отсутствие PNG до TASK-012 | реестр с путями + CSS-fallback в TASK-016, не в прод без документации |

| `isOpen` vs `isOverlayActive` расхождение | держать `isOpen=true` на всём overlay lifecycle |

| FLIP на resize / orientation change | rect фиксируется при клике; закрытие в тот же rect |

| Page-flip раздувает diff | TASK-018 отдельно после MVP (P1) |

| Hi-res closed PNG раздувает сцену | `.scene-book { width: 9vw }` — масштаб спрайта, не hit-area hack |

| Устаревший aspect 1.55 | `BOOK_OPEN_ASPECT` + CSS `--book-open-aspect: 1.248`; grep `1.55` в book-modal = 0 |



### TASK-019 — канон пропорций и layout-контракт



**Константы** `src/config/bookStage.ts`:



```ts
export const BOOK_OPEN_PIXEL_WIDTH = 902;
export const BOOK_OPEN_PIXEL_HEIGHT = 723;
export const BOOK_OPEN_ASPECT = BOOK_OPEN_PIXEL_WIDTH / BOOK_OPEN_PIXEL_HEIGHT; // ≈ 1.2476
export const SCENE_BOOK_WIDTH_VW = 9;
```



CSS (`.book-modal`): `--book-open-aspect: 1.248`; `--book-stage-max-w` / `--book-stage-h` из plan.md §4. Число в CSS округлено до 3 знаков; тест сверяет CSS-блок Epic 10 с `1.248` и **запрещает** `1.55`.



**Инварианты layout (assert в тесте CSS-текста):**

- `.scene-book` содержит `width: 9vw`
- `.book-page--left`: `align-items: center`, `text-align: center`, `left: 8%`, `width: 40%`
- `.book-page__quest-btn`: `max-width: 78%`, нет `width: 100%`
- `.book-page__quest-btn-bg`: `object-fit: contain`, нет `fill`
- `.book-modal__progress-track`: `object-position: center`

**Иллюстрации:** `spiritIllustrationUrl(locked)` → гравюра `spiritPortraitPaths`; иначе `spiritIllustrationPaths` (не `creatures_in_the_book/`). Домовой: clay `brownie_standart.png` пока нет `illustration_book/brownie.png`.

**CTA:** текст по центру плашки (`justify-content: center`); лапка встроена в PNG `book_quest_btn_wood`; фон кнопки `contain`.



### Соответствие задачам



| TASK | Модули |

|------|--------|

| TASK-011 | `assetRegistry` (`bookOpen`, `bookUi`), `design_assets_prompts.md`, `assets_catalog.md` |

| TASK-012 | `assets/ui/*.png`, `assetRegistry.bookUi`, `assets_catalog.md` |

| TASK-013 | `index.css` §1.1, `IzbaSceneLayers` (`scene-sprite--interactive`) |

| TASK-014 | `bookUiStore.ts`, `bookUiStore.test.ts` |

| TASK-015 | `BookOverlay.tsx`, `IzbaSceneLayers`, `IzbaScene`, `useOnboardingBootstrap`, `index.css` (flight/crossfade) |

| TASK-016 | `BookOverlay.tsx`, `index.css` §2.5–2.7, `bookUi` ассеты / fallback |

| TASK-017 | `bookUiStore.close`, `BookOverlay`, `index.css` (close chain) |

| TASK-018 | `bookUiStore.isFlipping`, `BookOverlay` swipe, `index.css` §3 |

| TASK-019 | `bookStage.ts`, `index.css` (9vw, 1.248, зоны, CTA contain), `BookOverlay` (paw/illustration), `book_layout.md` §2.5–2.6 |
