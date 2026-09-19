## Epic 15 — Ярило, Перун и «Грозовая изба»

> Контракт для TASK-040…047. Канон контента: `list_of_spirits.md` (Ярило, Перун), `quests.md`, `dev/loot_tables.md`. В этой итерации единственный runtime-ID эффекта — **`thunder_izba`**; старое имя `grozovaya_izba` из плана не использовать.

### Решение

Прогрессия остаётся data-driven: `SPIRIT_ORDER` и `spirits` получают Ярилу и Перуна сразу после `chudo_yudo`, а existing generic-потоки очереди и фрагментов читают их без списка из 16 ID. Атмосфера — отдельная коллекция, не вариант `GameSkins`: save хранит owned IDs и один выбранный ID либо `null`; каталог в `data/` пока содержит ровно один entry. Победа над Перуном выдаёт ownership через reward patch, но не меняет selection. Сцена читает только выбранный ID и рисует в каждой комнате один некликабельный FX-слой между night и gameplay FX.

### Структура модулей

| Path | Ответственность / изменение |
|---|---|
| `src/data/izbaEffects.ts` | **Новый** единый каталог эффектов, типы `IzbaEffectId` / `IzbaEffectDefinition`, lookup. Не импортирует skins, loot или UI. |
| `src/domain/GameSave.ts` | Добавить persist-поля атмосфер; default statuses для `yarilo`/`perun` = `locked`. |
| `src/config/gameConstants.ts` | Поднять `SAVE_VERSION` с 11 до 12. |
| `src/domain/saveMigration.ts` | v11→v12: добавить отсутствующие statuses и пустое владение/`null`, не меняя текущую прогрессию, скины или выбор фрагмента. |
| `src/data/spirits.ts` | Расширить `SpiritId`, `SPIRIT_ORDER`, `SpiritRewardKind` и определения двух духов; порядок `chudo_yudo → yarilo → perun`. |
| `src/config/assetRegistry.ts` | Добавить accepted portrait/illustration/trophy paths Ярилы и Перуна как partial registry entries; `getTrophyUrl` продолжает fallback на portrait при отсутствии PNG. Не регистрировать effect как house skin. |
| `src/config/lootTables.ts` | Добавить `yarilo: 8`, `perun: 10` в `fragmentRequirements`; existing consumers используют `Object.keys(fragmentRequirements)`, без отдельного списка. Шансы и pity не менять. |
| `src/domain/applySpiritReward.ts` | Reward state / patch получает только `ownedIzbaEffectIds`; обработчик `atmosphere_only` добавляет effect идемпотентно и не содержит поля equipped. |
| `src/store/GameStore.ts` | Единственная runtime-точка ownership/equip, `toSave`/`hydrate`, применение reward patch и persist. |
| `src/store/profileUiStore.ts`, `src/data/profileCatalog.ts`, `src/ui/profile/ProfileModal.tsx`, `src/ui/profile/ProfilePreview.tsx` | Отдельная вкладка `atmosphere`; каталог формирует presentation data, UI не хранит selection и не изменяет save напрямую. |
| `src/ui/scene/IzbaEffectLayer.tsx` | **Новый** чистый observer-слой: получает effect ID, возвращает `null` для `null`; не содержит наград, persist или profile-логики. |
| `src/ui/scene/IzbaSceneLayers.tsx`, `src/ui/scene/IzbaScene.tsx`, `src/ui/index.css` | Монтировать FX в обе `izba-room`; CSS hook и строгий z-order. |
| `src/config/sceneLayout.ts`, `src/ui/trophies/TrophyRoom.tsx`, `src/ui/index.css` | После UX-решения TASK-040 — 17-slot layout; не менять эталонные классы комнаты 1. |

### Ключевые типы и публичные API

```ts
// src/data/izbaEffects.ts
export const izbaEffects = [
  {
    id: 'thunder_izba',
    name: { ru: 'Грозовая изба', en: 'Thunder Hut', tr: 'Gök Gürültülü İzba' },
    description: { /* локализованное описание */ },
    grade: 'epoch',
    source: { kind: 'spirit_victory', spiritId: 'perun' },
    sceneClassName: 'izba-effect--thunder',
  },
] as const satisfies readonly IzbaEffectDefinition[];

export type IzbaEffectId = (typeof izbaEffects)[number]['id'];
export interface IzbaEffectDefinition {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  grade: Grade;
  source: { kind: 'spirit_victory'; spiritId: SpiritId };
  sceneClassName: string;
}
export function getIzbaEffectById(id: string): IzbaEffectDefinition | undefined;
```

`LocalizedText` uses the existing locale-content shape; import that type rather than create a second localization abstraction. The catalog is extensible by entries, but this Epic adds no Yaga shop, price, currency, entitlement service, or second effect.

```ts
// src/domain/GameSave.ts
interface GameSave {
  // existing fields
  ownedIzbaEffectIds: IzbaEffectId[];
  equippedIzbaEffectId: IzbaEffectId | null;
}

// src/data/spirits.ts
type SpiritRewardKind = /* existing kinds */ | 'atmosphere_only';
interface SpiritReward {
  kind: SpiritRewardKind;
  effectId?: IzbaEffectId; // required for atmosphere_only
}

// src/domain/applySpiritReward.ts
interface RewardState {
  // existing fields
  ownedIzbaEffectIds: IzbaEffectId[];
}
type RewardPatch = Partial<RewardState>;

// src/store/GameStore.ts
isIzbaEffectOwned(effectId: string): boolean;
equipIzbaEffect(effectId: IzbaEffectId | null): boolean;
```

The Perun definition is `{ kind: 'atmosphere_only', effectId: 'thunder_izba' }`. `applySpiritReward` uses an add-if-absent helper and returns `ownedIzbaEffectIds` only; it must never return or mutate `equippedIzbaEffectId`.

`equipIzbaEffect(null)` always clears selection and persists. For a non-null ID, it returns `false` unless the ID is both present in `izbaEffects` and owned; on success it sets that one ID and schedules persist. There is no toggle API or multi-equip state. `hydrate` defensively normalizes an unknown selected ID to `null` and deduplicates/filter-validates owned IDs against the catalog; `toSave` is the only reverse mapping.

### Progression, rewards, and persist flow

1. `createDefaultSpiritStatuses()` includes 18 IDs. Existing and new saves start `yarilo` and `perun` as `locked`; they do not become available merely because the client updates.
2. The accepted definitions are fragment unlocks: `yarilo` needs 8, `perun` needs 10. `SPIRIT_ORDER` is the runtime order and ends `… koschei_immortal, chudo_yudo, yarilo, perun`. `applyFragmentUnlocks`, chest candidate selection, and book fragment selection derive targets from `spirits`/`fragmentRequirements`; the current hardcoded `GameStore.selectFragmentSpirit` list must be removed in TASK-043.
3. On quiz victory, `GameStore.claimQuizVictory()` must first reject an already `defeated` spirit. It then applies status/unlocks, one-time fragment bonus where applicable, `applySpiritReward`, trophy unlock/reveal, closes quiz, and schedules one persist. This guard is the reward boundary: retrying/calling victory after completion cannot issue a second reward.
4. `applyRewardPatch` copies an `ownedIzbaEffectIds` patch to the store. The Perun grant is set-like (exactly one `thunder_izba` ID) and preserves `equippedIzbaEffectId` exactly. Defeating Perun neither enables the effect nor opens/selects the profile tab.
5. `toSave()` serializes both atmosphere fields; `hydrate()` restores normalized values. Existing `SaveService`, local/cloud storage, debounce, and flush behavior remain unchanged.

### Migration and existing-save behavior

`SAVE_VERSION = 12`. The migration branch is `if (save.version < 12)`:

```ts
save.spiritStatuses = {
  ...save.spiritStatuses,
  yarilo: save.spiritStatuses?.yarilo ?? 'locked',
  perun: save.spiritStatuses?.perun ?? 'locked',
};
save.ownedIzbaEffectIds = [];
save.equippedIzbaEffectId = null;
save.version = 12;
```

The implementation must preserve valid effect values when a v12 save is hydrated again; migration only initializes missing fields for pre-v12 saves. It must not infer Perun victory, grant `thunder_izba`, modify `ownedSkinIds`/`skins`, alter fragment counts or selected target, or retroactively unlock the new spirits. A future catalog rename needs an explicit ID mapping, never a skin migration.

### Profile and scene boundaries

`ProfileTab` gains `'atmosphere'`; `profileUiStore.selectedItemId` remains transient UI selection. `profileCatalog` exposes all catalog entries, including locked `thunder_izba`, plus a virtual always-owned `none` card. `ProfileModal` determines locked/owned/equipped from `GameStore`, sends only `null` or an `IzbaEffectId` to `equipIzbaEffect`, and renders copy/preview from catalog data. A preview is isolated to the profile preview container; it must not write to `GameStore` or change the live scene until the user chooses it.

The live scene reads `gameStore.equippedIzbaEffectId` only. Ownership without selection is visually inert. `IzbaEffectLayer` is mounted once in each `Room1Scene` and `Room2Scene`, not in `GameHud`, `WindowAperture`, `GameSkins`, or a separate room-2 background. Both room instances use the same effect ID and move with their rooms during pan.

### FX DOM/CSS contract

```text
.izba-room
  WindowAperture
  .layer-izba                         z 20
  .layer-furniture / cat              z 40 / 50
  .layer-night (existing shared)      z 60
  .layer-izba-effect[effectId]        z 65, pointer-events: none
  .layer-fx (coin/gameplay effects)   z 70
HUD                                    z 100
```

The implementation may keep the existing shared `.layer-night`; the effect layer belongs to each izba room so it darkens rooms 1 and 2 only. It must have `position: absolute; inset: 0; z-index: 65; pointer-events: none`, must not establish hit areas, and must not modify `skins.izba`, `WindowAperture`, `.layer-izba`, furniture dimensions, or pan transforms. `thunder_izba` is CSS-only: a persistent soft darken plus a periodic lightning pseudo-element. At `prefers-reduced-motion: reduce`, retain only static darken and disable/hide lightning animation and flash; no timer-based JavaScript fallback.

### Trophy capacity constraint

There will be 17 trophies: all 18 spirits except Domovoy, including `yarilo_spring_shield` and `perun_oak_shield`; each uses `getTrophyUrl` → portrait fallback until TASK-041 supplies PNG. TASK-039 fixes the stricter Epic-15 rule of **at most two trophies per support**, with natural sprite dimensions. The current accepted room-2 layout has six wall shelves and 15 slots (including three-slot shelves), so it has capacity 12 under this rule; 17 requires **at least nine support surfaces**.

Design input is mandatory before TASK-047: `room_02_trophies_layout.md` provides neither coordinates nor accepted composition for three additional supports. Its extension rule permits only added `bench.png` in the lower zone (`top ≥ 75vh`), while its current per-bench capacity of three conflicts with the Epic-15 two-trophy maximum. TASK-040 must choose and document three or more support positions (or another owner-approved layout), each with at most two trophies, clear of window and controls. Until then, implementation must not invent coordinates, add wall shelves, use the obsolete 3×5 grid, or change room-1 CSS. Shelf PNGs and trophy sprites remain natural-sized: no `width` on `.room-shelf`, `.room-shelf__img`, or trophy sprites for hit-area/layout expansion; positions use approved `vw`/`vh` layout data.

### Verification notes for TASK-042 and implementation

**Unit/domain/save tests**

- Assert exactly 18 unique `SPIRIT_ORDER` IDs and tail `chudo_yudo, yarilo, perun`; both default statuses are locked.
- Assert `fragmentRequirements.yarilo === 8`, `fragmentRequirements.perun === 10`, `isSpiritUnlockMet`/`applyFragmentUnlocks`, and fragment target selection work without a 16-ID allowlist.
- Assert the Yarilo title + trophy and Perun trophy; Perun reward produces one `thunder_izba` ownership entry after repeated reward/victory attempts and leaves `equippedIzbaEffectId === null`.
- Migrate representative v11 saves: old state is retained, new statuses are locked, effects are `[]`/`null`, and migration yields version 12.
- Assert `equipIzbaEffect('thunder_izba')` rejects unowned/unknown IDs, accepts owned, `equipIzbaEffect(null)` clears, and each success persists through `toSave`/`hydrate`.

**Profile / DOM-CSS contract tests**

- Catalog and profile render the always-available none card and locked/owned/equipped `thunder_izba` states; absence of final PNG never throws.
- Require an effect layer in both izba rooms only when selected, `pointer-events: none`, z 65 (above 60 night, below 70 gameplay FX and HUD 100), with no effect child in HUD.
- Require reduced-motion CSS to retain darken but suppress lightning animation/flash; verify no interactive element loses its hit-area.
- Require 17 configured trophy IDs with no duplicate, no support containing more than two, no width rule on shelves/shelf images or trophy sprites, and `WindowAperture` before `.layer-izba` in room 2. Exact support coordinates and final visual readability remain TASK-040/TASK-047 visual checks.

### Соответствие задачам

| TASK | Architectural handoff |
|---|---|
| TASK-039 | This section: data model, APIs, v12 migration, reward/store boundary, FX stack, 17-trophy constraint. |
| TASK-040 | Resolve profile wording/preview and mandatory 9+ support-surface trophy layout; specify fallbacks and exact CSS composition. |
| TASK-042 | Write red tests against the public seams and DOM/CSS contract above. |
| TASK-043 | Add canonical 18-spirit data, 8/10 requirements, generic fragment targeting, registry fallbacks. |
| TASK-044 | Implement GameSave v12, catalog, reward patch, exact-once victory guard, and `equipIzbaEffect`. |
| TASK-045 | Implement profile tab using catalog/store boundary; do not auto-open or auto-equip after Perun. |
| TASK-046 | Implement two room-scoped `IzbaEffectLayer` instances at z 65 and reduced-motion behavior. |
| TASK-047 | Implement only TASK-040-approved 17-trophy layout; visual review validates natural scale and both-room rules. |
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

---

## Epic 13 — Монетизация, усталый кот, улица, реклама

> Источник: `instruction/plans/plan.md`; tasks TASK-028…037.

### SAVE v9

Новые поля `GameSave`:

| Поле | Тип | Default |
|------|-----|---------|
| `starterPackPurchased` | `boolean` | `false` |
| `yardGrass` | `number` | `0` (cap 3) |
| `yardOberegCraftedDayId` | `string \| null` | `null` |
| `yardGrassSpawnDayId` | `string \| null` | `null` |

Миграция v8→v9: инициализация полей; `version = 9`.

### IzbaRoom и pan (3 кадра)

```ts
export type IzbaRoom = 'street' | 1 | 2;
```

Inner `300vw`, три `.izba-room` по `100vw`:

| `data-room` | `translateX(inner)` | Содержимое |
|-------------|---------------------|------------|
| `street` | `0` | view `skins.window` fullscreen, трава, без `.layer-izba` |
| `1` | `-100vw` | изба (эталон комнаты 1 без изменений) |
| `2` | `-200vw` | трофеи (эталон комнаты 2) |

Дефолт `activeRoom = 1` — визуально та же изба, что раньше при `translateX(0)`.

`resolvePanRoomAfterGesture`: свайп вправо с комнаты 1 → street (если `canEnterStreet`); влево → 2; обратные жесты с street/2.

Блокировка улицы: онбординг (!completed), `zhirdyayActive`, `isNightTime()` — pan и стрелка; кот показывает `yard_blocked_*`.

### catSleepReason

```ts
export type CatSleepReason = 'afk' | 'tired';
```

`sceneUiStore`: `catSleeping`, `catSleepReason: CatSleepReason | null`, `tiredClickCount`.

| Причина | Условие | Клик | registerActivity | Суседко |
|---------|---------|------|------------------|---------|
| `afk` | tickIdle 45–60 с | будит, монета | будит | да |
| `tired` | `energy === 0`, onboarding done | tired bubble, не монета | не будит | нет |

`tiredClickCount`: 1–2 клика — только bubble; с 3-го — `energyUiStore.open()`.

### paymentsService (stub)

`src/services/paymentsService.ts` — не в SaveService:

```ts
purchaseStarterPack(): Promise<'success' | 'already_owned' | 'cancelled'>
```

Dev: модалка «Оплатить 199 ₽» → `success`. `GameStore.purchaseStarterPack()`: +100 energy (`addRewardEnergy`), +5 talismans, `ownedSkinIds += cat_pilgrim`, `starterPackPurchased = true`.

`cat_pilgrim` — `rare`, только IAP; исключить из `getCatSkinIdsByGrade` / сундуков.

### adsService stub overlay

`adsUiStore` + `RewardedWaitOverlay`: в DEV/`isTestMode` — 10 с отсчёт, отмена до 3 с без награды. Прод SDK — прямой `showRewardedVideo`.

### Домен двора

`src/domain/yardCraft.ts`: cap 3, craft 3→1 obereg, `yardOberegCraftedDayId` лимит 1/сутки.

`src/domain/yardAccess.ts`: `canEnterStreet`, `getStreetBlockTag`.

### UI новые модули

| Модуль | Назначение |
|--------|------------|
| `StreetYard.tsx` | комната street, спавн/сбор травы |
| `KikimoraCraftModal.tsx` | крафт оберега |
| `KikimoraHudAvatar.tsx` | аватар под HUD (если kikimora defeated) |
| `StarterPackModal.tsx` | ларец 199 ₽ |
| `RewardedWaitOverlay.tsx` | 10 с заглушка рекламы |

### Соответствие задачам

| TASK | Модули |
|------|--------|
| TASK-030–031 | `sceneUiStore`, `GameStore.clickCat`, `susedkoSteal`, `dialogContent` |
| TASK-032 | `adsService`, `adsUiStore`, `RewardedWaitOverlay` |
| TASK-033 | `paymentsService`, `StarterPackModal`, save v9, `skinPools` |
| TASK-034–035 | `yardCraft`, `StreetYard`, pan CSS, `ScenePanNav` |
| TASK-036 | `index.css` trophy-modal, profile-tabs |

---

## Epic 14 — Пол-таймер сундука и бар чудес (диегетика комнаты 1)

> Источник: TASK-038; канон визуала — `room_01_layout.md` §4.4, §4.4.1, §4.5 (числа 3D/цвета **не** дублировать здесь — сверять по файлу). Пиксели на экране — `index.css`. Epic 8 HUD-чип `.hud-miracle` **снят** (`hud_layout.md`); этот эпик его **не** возвращает.

### Решение

Только сцена комнаты 1: общий CSS-якорь `.scene-chest-floor` (диегетик на досках, CSS 3D трапеция) внутри уже существующего wrap сундука. Обычный сундук — перенос кулдаун-таймера с «золотого span над крышкой» на пол; видимость **как сейчас** (`firstChestOpened && cooldown`). Сундук чудес — тот же wrap-паттерн, что `RegularChestSprite`, плюс бар (дорожка + заливка + `n/total`) когда слот недели уже потрачен. Данных, store, save, SDK, PNG **не** добавляем: прогресс читается из `GameStore` / `domain/wonderChest.ts` (поля Epic 8). `--chest-progress` — единственный runtime inline, по образцу `--rewarded-progress` в `RewardedWaitOverlay`.

### Структура модулей

| Path | Ответственность | Менять? |
|------|----------------|---------|
| `src/domain/wonderChest.ts` | Чистый шов видимости бара + ratio заливки 0…1. Существующие `canOpenWonderChest` / `wonderChestClicksRequired` / `syncWonderChestWeekState` **не** ломать | **дописать** 2 функции |
| `src/ui/scene/RegularChestSprite.tsx` | Таймер в `.scene-chest-floor--timer` **под** спрайтом; тик 1 с и `formatCooldownMs` без изменений | да |
| `src/ui/scene/MiracleChestSprite.tsx` | **новый** презентационный observer (не god): wrap + `SceneSprite` + пол-бар. Клик/онбординг остаются в `IzbaSceneLayers` | **создать** |
| `src/ui/scene/IzbaSceneLayers.tsx` | Заменить голый `SceneSprite` чуда на `MiracleChestSprite`; `handleMiracleChestClick` / `showMiracleChest` без новой логики | тонкая замена |
| `src/ui/index.css` | `.scene-chest-floor*` (perspective + rotateX); снять антипример `.scene-chest__timer { bottom: 100% }`; wrap чуда по аналогии `.scene-chest-wrap.scene-chest-regular` | да |
| `src/ui/scene/GameHud.tsx` | Не трогать. `.hud-miracle` **не** возвращать | нет |
| `src/store/GameStore.ts` | Геттеры уже есть: `getWonderChestClickProgress`, `getWonderChestClicksRequired`, `canOpenWonderChest`, `isWonderChestFreeThisWeek`, `wonderChestWeekSlotUsed` | нет |
| `src/config/lootTables.ts` | `miracleChest.clicksToOpen` (700) — источник `required`, **не** хардкодить 700 в UI | нет |
| `src/config/scenePlacements.ts` | Классы `scene-chest-regular` / `scene-chest-miracle` без новых координат | нет |
| `src/domain/GameSave.ts` / SaveService / platform | — | нет |

Не плодить: общий React-компонент «ChestFloor» (два разных интерьера; CSS-класс общий достаточен). Не плодить store/`chestFloorUiStore`.

### Ключевые типы / интерфейсы

Новых типов save **нет**. Публичный доменный шов:

```ts
/** Бар на полу. Скрыт на бесплатном слоте недели — даже если clicks > 0 после sync понедельника. */
export function shouldShowWonderChestProgress(
  weekSlotUsed: boolean,
  clicks: number,
  required: number,
): boolean;

/** Источник `--chest-progress` (clamp 0…1). 0/required → 0; required/required → 1. */
export function wonderChestFillRatio(clicks: number, required: number): number;
```

Реализация видимости: `return weekSlotUsed`. Аргументы `clicks` / `required` — контракт матрицы тестов (гриндинг и `700/700` не прячут бар; бесплатный слот прячет даже при leftover-кликах).

`MiracleChestSprite` — props как у обычного (тонкий): `interactive`, `onClick`, опционально `className`. Ready/cooldown/прогресс читает из `gameStore` (observer). Не прокидывать клики через новый store.

Runtime inline (единственный `style=` на поле):

```tsx
style={{ '--chest-progress': wonderChestFillRatio(clicks, required) } as CSSProperties}
```

Комментарий в TSX: `runtime fill 0…1 (css-styling.mdc)`. CSS: `width: calc(var(--chest-progress, 0) * 100%)`; `transition: width 180ms ease-out` — в stylesheet, не в JS.

### Поток данных

```
Кот / тик кулдауна
  → GameStore (уже есть: clickCat → wonderChestClickProgress; chestReadyAt)
  → observer RegularChestSprite | MiracleChestSprite
  → DOM пола в том же wrap, что спрайт
  → persist не меняется
```

**Обычный (`RegularChestSprite`):**

1. `showTimer = firstChestOpened && onCooldown && !isChestReady()` — **не** менять условие.
2. DOM: пол **перед** спрайтом (раньше в дереве → спрайт рисуется поверх дальнего края). Удалить `span.scene-chest__timer`.
3. Готов: пол скрыт; пульс `.scene-chest--ready` как сейчас.
4. Текст: `formatCooldownMs(remainingMs)` (`h:mm:ss` / `m:ss`), `aria-live="polite"`.

**Чудо (`MiracleChestSprite`):**

1. `required = getWonderChestClicksRequired()` (= `lootTables.miracleChest.clicksToOpen`).
2. `clicks = getWonderChestClickProgress()`.
3. Бар в DOM ⇔ `shouldShowWonderChestProgress(wonderChestWeekSlotUsed, clicks, required)`.
   - бесплатный слот (`!weekSlotUsed` / `isWonderChestFreeThisWeek()`): бар **нет**; готовность = свечение спрайта.
   - гриндинг (`weekSlotUsed && clicks < required`): track + fill + `n/total`.
   - набор (`weekSlotUsed && clicks >= required`, ещё не открыт): заливка 1 + `required/required` + пульс спрайта.
4. После `openWonderChest` прогресс уже сбрасывается в store (−700, `weekSlotUsed` остаётся true) → бар снова `0/required`. UI только читает.
5. Спрайт: сохранить `scene-chest-miracle--glow`; `--cooldown` когда `!canOpenWonderChest()`; `.scene-chest--ready` когда `canOpenWonderChest()` (бесплатный слот **или** 700/700).
6. `interactive` / `onClick` — с родителя, как сейчас (`miracleAllowed && canOpenWonderChest`).

**`IzbaSceneLayers`:** `{showMiracleChest && <MiracleChestSprite … />}` вместо голого `SceneSprite`. Хендлер открытия без изменений.

### CSS / DOM-контракт

Пиксели (`rotateX` 55–65°, ширина ближнего края ×1.15–1.3, цвета выемки/аметиста, высота ~10–12px) — `room_01_layout.md` §4.4.1 + дизайнер. Здесь — **классы и запреты**.

| Класс | Роль |
|-------|------|
| `.scene-chest-wrap` | якорь; `overflow: visible`; **без** `perspective` на wrap (иначе 3D сломает спрайт) |
| `.scene-chest-wrap.scene-chest-miracle` | `left`/`bottom` как у текущего `.scene-chest-miracle` (`58vw` / `19vh`); зеркало `.scene-chest-wrap.scene-chest-regular` |
| `.scene-chest-wrap__sprite` | спрайт; `z-index` выше пола |
| `.scene-chest-floor` | позиция у ножек (`bottom: 0`, не `bottom: 100%`); `z-index` ниже спрайта; `pointer-events: none`; **`perspective` здесь** |
| `.scene-chest-floor__plate` | ребёнок: `rotateX` + `transform-origin: top center` — трапеция (дальний край уже, заходит под ножки) |
| `.scene-chest-floor--timer` / `--progress` | модификаторы |
| `.scene-chest-floor__track` | выемка дорожки |
| `.scene-chest-floor__fill` | заливка; только `var(--chest-progress)` |
| `.scene-chest-floor__label` | цифры поверх (`tabular-nums`); таймер или `n/total` |

A11y бара: `role="progressbar"`, `aria-valuemin={0}`, `aria-valuemax={required}`, `aria-valuenow={clicks}` на `.scene-chest-floor--progress`.

Удалить правило `.scene-chest__timer { bottom: 100%; … color: #f0c14a; text-shadow }`. Класс `.scene-chest__timer` не использовать.

**Запрещено в CSS/TSX этого эпика:** `.hud-miracle`; `mix-blend-mode` на поле/таймере; `width`/`min-width` на `.scene-chest-regular` / `.scene-chest-miracle` / `__sprite` «под подпись» (эталон `6.8%` не увеличивать); новые PNG; Material-progress; инлайн `transform`/`width` кроме `--chest-progress`.

Ночь: читаемость через непрозрачную выемку на `__plate`, не тонкий текст на брёвнах и не blend. Подписи живут в `.izba-room` комнаты 1 → pan 1→2 уезжает вместе со сценой, в комнате 2 не дублировать.

### Инварианты

- Save / `GameSave.version` / hydrate / SDK / `clicksToOpen` — без изменений.
- Онбординг и `canInteract(..., 'chest' | 'chestMiracle')` — без изменений.
- `syncWonderChestWeekState` по-прежнему сбрасывает `weekSlotUsed`, **клики оставляет**: на новой неделе бар скрыт, даже если leftover ≥ 700.
- Слои: пол-лейбл внутри мебельного wrap (z 40), не HUD, не `.layer-night`. `pointer-events: none` — хит всегда в `SceneSprite`.
- Эталон комнаты 1 (`scene-visual-etalon.mdc`): не трогать `.scene-stove`…`.scene-cat`; не ставить `width` на мебель для hit-area.
- Juice: клик по коту уже инкрементит `wonderChestClickProgress` → observer двигает `--chest-progress` (transition 180ms). Новый action не нужен.
- Модалки лута / баланс 700 — вне scope.

### Риски

| Риск | Как не словить |
|------|----------------|
| `perspective` на `.scene-chest-wrap` искажает PNG сундука | perspective только на `.scene-chest-floor`, rotateX на `__plate` |
| Таймер снова «в воздухе» | нет `bottom: 100%`; пол `bottom: 0` у ножек |
| Бар на бесплатном слоте / после понедельника | только `shouldShowWonderChestProgress`; не `clicks > 0` |
| Слипание двух подписей / ковёр кота | ширина плиты ≈ основание спрайта (rotateX даёт ближний край шире); не раздувать wrap |
| Регрессия Epic 8 | `openWonderChest` / eligibility / glow/hue-rotate fallback не рефакторить «заодно» |
| Дизайнер ещё не зафиксировал vw | разработчик ставит классы + 3D-контракт; точный `rotateX`/цвет — после UI/UX; не выдумывать PNG |

### Test-seams (для тестировщика)

**Импорт / мок (unit, без DOM-снапшотов сцены):**

| Шов | Где | Что assert |
|-----|-----|------------|
| `shouldShowWonderChestProgress` | импорт из `domain/wonderChest.ts` | `(false, 0, 700) → false`; `(false, 700, 700) → false` (free week + leftover); `(true, 0, 700) → true`; `(true, 350, 700) → true`; `(true, 700, 700) → true` |
| `wonderChestFillRatio` | импорт оттуда же | `(0, 700) → 0`; `(350, 700) → 0.5`; `(700, 700) → 1`; `(800, 700) → 1` (clamp) |
| `formatCooldownMs` | уже есть | длинный `12:00:00` / короткий `m:ss` — не регрессировать |
| `GameStore` | **не** мокать новый API; существующих геттеров достаточно | не требовать новых actions |

Не мокать CSS. Не мокать SDK.

**DOM/CSS assert (текст `index.css` / разметка, паттерн `bookLayoutCss.test.ts`):**

Допустимо:

- `.scene-chest-floor` содержит `perspective`, `pointer-events: none`; **нет** `bottom: 100%`; **нет** `mix-blend-mode`
- `.scene-chest-floor__plate` содержит `rotateX`, `transform-origin: top` (center)
- `.scene-chest-floor__fill` содержит `var(--chest-progress`
- селектор `.scene-chest__timer` отсутствует **или** его body не содержит `bottom: 100%`
- в `GameHud.tsx` нет класса `hud-miracle`
- `.scene-chest-regular` / `.scene-chest-miracle`: ширина не выше текущего эталона `6.8%` (не раздувать «под подпись»)
- `MiracleChestSprite` / `RegularChestSprite`: пол — sibling спрайта внутри `.scene-chest-wrap`; `--chest-progress` только как CSS variable в `style`

Не делать: снапшот всей избы; E2E на каждую секунду таймера; тесты реализации имён хуков.

**visual_check (ревьювер / билд, не автотест):** ночь; pan 1→2 (лейблы не в комнате 2); оба сундука сразу; `0/700` пустая заливка и `700/700` до края + пульс.

### Соответствие задачам

| Критерий TASK-038 | Модуль |
|-------------------|--------|
| Таймер не HUD над крышкой; материал выемка §4.4.1 | `index.css` `.scene-chest-floor*`; `RegularChestSprite` |
| Часы под сундуком, трапеция perspective+rotateX, origin top | `.scene-chest-floor` + `__plate` |
| `pointer-events: none`; width спрайта не увеличивать | CSS-контракт; эталон `6.8%` |
| Бар эпика снова виден, track+fill+`n/total`, не чип | `MiracleChestSprite` + `shouldShowWonderChestProgress` |
| `--chest-progress` 0…1 runtime | `wonderChestFillRatio` + inline как `--rewarded-progress` |
| Бесплатный слот: бар скрыт | `shouldShowWonderChestProgress` |
| Кулдаун: таймер на полу; готов: скрыт + `.scene-chest--ready` | `RegularChestSprite` (условие showTimer как сейчас) |
| `.hud-miracle` не в шапке | `GameHud` не трогать |
| Эталон комнаты 1, pan, ночь | только wrap сундуков + CSS пола; без правок эталона печки/кота |
| Вне scope: PNG, HUD-чип, модалки, баланс 700 | не открывать |

---
