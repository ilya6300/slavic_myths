# Модалка «Тайный оберег» (крафт Кикиморы) — мобильный UX

> **TASK-066** · Триггер: кнопка «Кикимора» / «Сплести» в `.hud-rail` на избе  
> Референсы: `chest_cooldown_modal_mobile_v3.md`, `energy_reward_modal_mobile.md`, `mobile_modals_landscape.md`, `ui-layout-invariants.mdc`  
> Owner screenshot 2026-09-25: desktop landscape, плавающая карточка `max-width: 480px` — на телефоне **не эталон** (нужен full-bleed как сундук).

## Решение игрока (обязательно)

| Вопрос | Ответ |
|--------|--------|
| **Решение сейчас** | Понять, хватает ли **3 пучков травы** (`yardGrass`); **сплести 1 оберег** или закрыть окно. |
| **Данные** | 3 слота рецепта (заполнены при `yardGrass ≥ 3`); счётчик запаса травы справа; подсказка; сцена с Кикиморой; CTA «Сплести оберег» (disabled если `< 3` или идёт анимация). |
| **Где** | Меню поверх избы: `.kikimora-craft-modal.layer-modal` |
| **Не показывать** | Дубль HUD; прокрутку всего оверлея; широкую полосу 16:9 без ограничения высоты; растянутую на всю ширину деревянную CTA (`object-fit: fill`). |
| **Худший кадр** | Landscape **812×375**, ru подсказка в 2 строки, `yardGrass = 5`, safe-area, кот/рейл под полупрозрачным фоном. |

## Диагноз (текущий UI)

1. Панель **карточка** (`94vw`, `max-width: 480px`, `border-radius: 16px`) на узком portrait — мало места, отступы `.layer-modal { padding: 1rem }` дают «островок», не immersive меню.
2. В landscape модалка попадает под правило scroll **всего** `.layer-modal` (нет `:not(.kikimora-craft-modal)`) → антиpattern из `ui-layout-invariants.mdc`.
3. Сцена **16:9** без mobile cap съедает высоту; на landscape только слабый `max-height: 24vh` без grid split.
4. Нет явного flex-островка: CTA не прижата к низу на full-height панели.

## Целевая композиция

### Portrait (ширина ≤640px)

```text
┌──────────────────────────────┐  × close (44px, safe-area)
│     Тайный оберег            │  h2, 1rem, центр
│  ┌────────────────────────┐  │
│  │  сцена: фон + ткач     │  │  max-height min(20vh,128px), ratio 2.15/1
│  └────────────────────────┘  │
│  [🌿][🌿][🌿]  5             │  слоты + счёт запаса
│  Кикимора знает узел…        │  0.85rem, inset
│                              │
│    [ Сплести оберег ]        │  wood CTA, max-width 280px, margin-top: auto
└──────────────────────────────┘
```

### Landscape (max-height ≤520px, эталон 812×375)

```text
┌────────────────────────────────────────────────────────┐ ×
│              Тайный оберег (span 2)                     │
│  ┌─────────────┐  [🌿][🌿][🌿]  5                      │
│  │   сцена     │  Кикимора знает узел. Три пучка…      │
│  │  ~34vw      │  (текст слева, align-self end)        │
│  └─────────────┘                                        │
│              [ Сплести оберег ]  (span 2, centered)     │
└────────────────────────────────────────────────────────┘
```

## Layout vs mockup (обязательно)

| Зона | Portrait ≤640px | Landscape ≤520px height | CSS / DOM |
|------|-----------------|-------------------------|-----------|
| Оверлей | `padding: 0`, `overflow: hidden`, stretch | то же | `.kikimora-craft-modal.layer-modal` |
| Панель | `flex` column, `100dvh`, `width: 100%`, `border-radius: 0`, `overflow: hidden` | `display: grid`, cols `minmax(6.5rem,34vw) 1fr`, rows title / body / cta | `.kikimora-craft-modal__panel` |
| Закрыть × | safe-area, 44×44 | то же | `.modal-close` |
| Сцена | `max-height: min(20vh,128px)`, `aspect-ratio: 2.15/1`, `flex-shrink: 0` | col 1, rows 2–3, `max-height: min(32vh,140px)` | `.kikimora-craft-modal__scene` |
| Слоты + счёт | центр, gap 0.5rem | col 2, row 2, start | `.kikimora-craft-modal__slots` |
| Подсказка | центр, padding inline | col 2, row 3, `text-align: left`, `align-self: end` | `.kikimora-craft-modal__hint` |
| CTA | `margin-top: auto`, wood, max 280px | `grid-column: 1 / -1`, last row | `.kikimora-craft-modal__cta` + `.wood-quest-btn` |
| Inset | ≥ max(12px, safe-area) | то же | padding панели |

### Runtime (owner screenshot desktop)

| Свойство | Факт | Цель mobile |
|----------|------|-------------|
| Панель | карточка ~480px по центру | full-bleed `100dvh` |
| Scroll оверлея | возможен в landscape | **`hidden`** |
| CTA | wood, не stretch PNG | `object-fit: contain` на `__bg` (уже в `.wood-quest-btn`) |

## DOM (разработчик)

1. Обернуть слоты + hint в `.kikimora-craft-modal__main`.
2. CTA в `.kikimora-craft-modal__cta` (кнопка без смены логики craft).
3. Класс корня без смены: `kikimora-craft-modal layer-modal`.
4. Landscape scroll-guard: добавить `.kikimora-craft-modal` в `:not(...)` рядом с chest/quiz/profile.

## Состояния

| Состояние | UI |
|-----------|-----|
| `yardGrass < 3` | пустые слоты, CTA disabled |
| `yardGrass ≥ 3` | заполненные слоты, CTA active |
| crafting 1.2s | анимация ткачества + всплытие оберега; CTA disabled |
| после craft | модалка закрывается (как сейчас) |

## Тексты

Без смены ключей `settingsUiContent.kikimoraCraft*` (`dialogContent.ts`).

## Связь с plan.md

П.9 («Сплести» не уводит на улицу) — **логика навигации**, не layout. В этой задаче: не вызывать `tryEnterStreet` / `setRoom('street')` из craft; закрытие модалки только `kikimoraCraftUiStore.close()`. Если баг останется — отдельный TASK на store/click-through.

## Mockup

Gate **B** (спека + owner screenshot как anti-reference). Существующий `instruction/design/mockups/kikimora_craft_mockup.png` — desktop; mobile — wireframe выше.

## Критерии visual_check (TASK-066)

- [ ] portrait ≤640: full-bleed панель, сцена ≤20vh, CTA внизу, текст с inset, нет scroll `.layer-modal`
- [ ] landscape ≤520: grid сцена слева / текст справа, CTA span 2
- [ ] `npm run lint:ui-layout` pass
