# Сундук — кулдаун (мобильный UX v3)

> **TASK-062** (зона кулдаун + согласование с лутом) · Owner DOM 2026-09-25: `812×375`, `ChestCooldownModal`, панель `left=0`, `width=812`, `height=375`  
> Предыдущая спека: `chest_loot_modal_mobile.md` (v2) · Инварианты: `ui-layout-invariants.mdc`

## Решение игрока (обязательно)

| Вопрос | Ответ |
|--------|--------|
| **Решение сейчас** | Узнать, **сколько ждать** до следующего сундука; при желании — шансы выпадения; при наличии заряда — **ускорить рекламой** (−1,5 ч). |
| **Данные без которых нельзя решить** | Оставшееся время (крупно, tabular-nums); видимость CTA «Посмотри сказку…» только если заряд rewarded > 0 (домен Epic 17, не менять в этой задаче). |
| **Где** | Меню поверх избы: `.game-modal.chest-modal.chest-modal--cooldown` |
| **Не показывать** | HUD энергии/монет; широкую «киношную» полосу 16:9; дубль таймера на полу сцены (пол-лейбл §4.4 комнаты 1 остаётся). |
| **Худший кадр** | Landscape **812×375**, ru, длинная CTA в 2 строки, раскрытая таблица шансов, safe-area iPhone. |

## Диагноз (почему «не модалка»)

1. **Смысл разорван:** заголовок `h2` = «Следующий сундук через», время — отдельный `p`. В DOM/скринридере и визуально читается как **одна каша** («…через 2:32:04 Шансы…»), нет **героя-таймера**.
2. **Сцена-«короб»:** `.game-modal__scene--plain` с aspect 16:9 / 2.1 съедает высоту; на кулдауне нужен **только спрайт закрытого сундука**, без широкой плашки.
3. **Landscape:** v2 grid на paper не даёт читаемой **правой колонки** (таймер + шансы + CTA в одном потоке); левая колонка тянет строки 2–5 и давит контент.
4. **CTA:** деревянная кнопка не должна **растягиваться** на всю ширину PNG (`object-fit: fill`); строка grid full-bleed = **ряд**, кнопка **по центру**, max-width ≈ 280–320px.

## Целевая композиция (wireframe)

### Portrait (ширина ≤640px)

```text
┌──────────────────────────────┐  × close (safe-area)
│                              │
│      [закрытый сундук]       │  max ~20vh, без широкой полосы
│                              │
│   Следующий сундук через     │  0.9rem, opacity 0.92
│         2:32:04              │  1.45rem, #f0c14a, tabular-nums
│                              │
│   [ Шансы выпадения ▾ ]      │  min-height 44px
│   (scroll только таблица)    │
│                              │
│      [ Посмотри сказку… ]    │  wood CTA, margin-top: auto
└──────────────────────────────┘
```

### Landscape (max-height ≤520px, эталон 812×375)

```text
┌────────────────────────────────────────────────────────┐ ×
│  Следующий сундук через          │  (заголовок — span 2) │
│  ─────────────────────────────────────────────────────  │
│  [сундук]  │  2:32:04              │  hero: время крупно   │
│   ~28vw    │  [ Шансы ▾ ]          │  drops flex 1        │
│            │  (scroll .drops)      │                      │
│────────────┴──────────────────────│──────────────────────│
│              [ Посмотри сказку… ]  │  CTA row, centered   │
└────────────────────────────────────────────────────────┘
```

## Layout vs mockup (обязательно)

| Зона | Portrait ≤640px | Landscape ≤520px height | CSS / DOM |
|------|-----------------|-------------------------|-----------|
| Оверлей | `padding: 0`, `overflow: hidden`, `100dvh` | то же | `.game-modal.chest-modal.layer-modal` |
| Панель | `flex` column, `100dvh`, `overflow: hidden` | `display: grid`, `100vw×100dvh`, `left: 0`, `width: 100%` | `.chest-modal__panel` |
| Закрыть × | safe-area, 44×44 | то же | `.modal-close` в панели |
| Сундук | центр, **без** 16:9 полосы: сцена `max-height: min(20vh,128px)`, фон сцены минимальный | колонка 1, `~30vw`, сцена **не** span 4 rows — только `grid-row: 2 / 4`, `max-height: min(32vh,140px)` | `.chest-modal__scene`, `.chest-modal__chest-closed` |
| **Hero время** | label + time **один блок**, визуальный центр | col 2, rows 2–3: label 0.82rem, time 1.2–1.35rem | **новый** `.chest-modal__cooldown-hero` (см. DOM) |
| Шансы | collapsible; scroll **только** `.chest-modal__drops` | col 2, row 4, `min-height: 0`, `flex: 1` | `.chest-modal__drops-section` |
| CTA hurry | `margin-top: auto`, inset bottom + safe-area | `grid-column: 1 / -1`, последний row; кнопка `max-width: 320px`, `margin-inline: auto` | `.chest-modal__hurry`, `.wood-quest-btn` |
| Inset текста | ≥ max(12px, safe-area) | то же | padding панели |

### Runtime (owner DOM 812×375)

| Свойство | Факт (owner) | Цель v3 |
|----------|--------------|---------|
| `left` | `0` | `0` |
| `width` | `812` (= viewport) | `100%` панели / viewport |
| `height` | `375` | `100dvh` |
| `display` (landscape) | (проверить в браузере) | **`grid`** на `.chest-modal__panel` |
| `overflow` панели | не `auto` | **`hidden`** |

## DOM (обязательное изменение для кулдауна)

Чистый CSS **не склеивает** «Следующий сундук через» и `2:32:04` в один герой. Разработчик:

1. Заменить пару `h2` + `p.chest-modal__timer--large` на:

```tsx
<div className="chest-modal__cooldown-hero">
  <p className="chest-modal__cooldown-label">
    {resolveText(settingsUiContent.chestCooldown, locale)}
  </p>
  <p className="chest-modal__cooldown-time chest-modal__timer--large">
    {formatCooldownMs(remainingMs)}
  </p>
</div>
```

2. `h2.game-modal__title` на кулдауне **убрать** (дублирует label) или оставить только для a11y с классом visually hidden — предпочтение: **один** видимый hero-блок.

3. Класс сцены на кулдауне: добавить модификатор `.chest-modal__scene--cooldown` — убрать широкий aspect, только центрирование сундука.

**Лут-модалка** (`ChestLootModal`) — без смены hero; v2 grid/flex из `chest_loot_modal_mobile.md` + те же overlay/padding правила.

## Тексты (копирайт)

| Ключ | RU | Примечание |
|------|-----|------------|
| `chestCooldown` | «Следующий сундук через» | строка **над** временем, без двоеточия в конце |
| `chestHurryLuck` | «Посмотри сказку −\nсними 1,5 часа» | нормализовать дефис (тире −), 2 строки на кнопке — OK |
| Таймер | `H:MM:SS` | `font-variant-numeric: tabular-nums` |

Локали EN/TR — те же смыслы; разработчик не меняет тексты без сценариста, только вёрстка.

## Состояния

| Состояние | UI |
|-----------|-----|
| Кулдаун, заряд rewarded > 0 | hero + шансы + CTA hurry |
| Кулдаун, заряд 0 | hero + шансы; **нет** `.chest-modal__hurry` |
| Шансы раскрыты | scroll только `.chest-modal__drops`; панель не крутится |

## Mockup (P1, не блокер кода)

Черновик для приёмки: `instruction/design/mockups/chest_cooldown_mobile_landscape_v3.png` — clay-wood, тёмная панель, сундук слева, золотой таймер справа. Генерация по skill `generate-game-image` после approve владельца.

## Критерии приёмки (для TASK-062 / ревью)

- [ ] visual_check portrait ≤640: hero (label+time), сундук компактный, CTA снизу с inset, нет scroll панели
- [ ] visual_check landscape 812×375: **grid**, сундук слева / hero+шансы справа, CTA внизу по центру, нет overlap
- [ ] Owner: панель `left=0`, full width; содержимое **не** одной строкой в инспекторе (отдельные блоки hero / drops / CTA)
- [ ] `npm run lint:ui-layout` — pass
- [ ] Не трогать `.layer-izba` / комнату 1

## Не путать

- Full-bleed **панели** (owner уже видит `width=812`) ≠ **внутренний** layout; v3 чинит внутренность.
- Пол-таймер у сундука на сцене (TASK-038) ≠ модалка кулдауна.
- Rewarded −1,5 ч / 4 заряда — Epic 17; эта спека только **layout + hero DOM**.
