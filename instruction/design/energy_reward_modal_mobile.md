# Модалка «Нет энергии» — rewarded +50 (мобильный UX)

> **TASK-064** · Триггер: клик по уставшему коту при `energy < ENERGY_PER_CLICK` · Канон логики: TASK-063  
> Референсы: `chest_cooldown_modal_mobile_v3.md`, `mobile_modals_landscape.md`, `.cursor/rules/ui-layout-invariants.mdc`  
> Owner screenshot 2026-09-25: узкая колонка, иконка энергии без `max-width`, белые системные кнопки — **баг вёрстки**, не эталон.

## Решение игрока (обязательно)

| Вопрос | Ответ |
|--------|--------|
| **Решение сейчас** | Понять, что энергии нет; **посмотреть короткую рекламу** и получить +50 энергии **или** отложить. |
| **Данные** | Заголовок «Нет энергии»; пояснение с **+50**; активный скин кота в pose `sleep` (узнаваемость); CTA с тем же числом. |
| **Где** | Меню поверх избы: `.game-modal.chest-modal.chest-modal--energy` |
| **Не показывать** | HUD дублем; гигантскую HUD-иконку без обрезки; generic white `<button>`; широкую полосу 16:9 без кота. |
| **Худший кадр** | Landscape **812×375**, ru длинная строка пояснения, safe-area. |

## Диагноз (root cause UI)

1. `EnergyRewardModal` использует `.chest-modal__reward` / `.chest-modal__energy-icon` **без правил в `index.css`** → PNG `icon_energy.png` рисуется в натуральном размере.
2. CTA — нативные `<button>` без `.wood-quest-btn` → не в стиле игры.
3. Нет модификатора `--energy` → mobile full-bleed / landscape grid сундука не применяются осмысленно к контенту.

## Целевая композиция

### Portrait (≤640px)

```text
┌──────────────────────────────┐  × close
│        Нет энергии           │
│   [кот sleep + badge +50]    │  сцена ≤20vh, без 16:9 полосы
│                              │
│  Посмотри короткую рекламу   │
│  и получи +50 энергии.       │
│                              │
│    [ Смотреть рекламу (+50) ]│  WoodQuestButton, max 320px
│         Не сейчас            │  text link, min-height 44px
└──────────────────────────────┘
```

### Landscape (max-height ≤520px)

```text
┌────────────────────────────────────────────────────────┐ ×
│              Нет энергии (span 2)                       │
│  [кот sleep]  │  Посмотри короткую рекламу…            │
│   + badge     │  (текст слева, align-self end)          │
│───────────────┴────────────────────────────────────────│
│         [ Смотреть рекламу (+50) ]                     │
│              Не сейчас                                   │
└────────────────────────────────────────────────────────┘
```

## Layout vs mockup (обязательно)

| Зона | Portrait | Landscape | CSS / DOM |
|------|----------|-----------|-----------|
| Оверлей | `padding: 0`, `overflow: hidden`, `100dvh` | то же | `.game-modal.chest-modal.layer-modal` (общий с сундуком) |
| Панель | flex column, `overflow: hidden` | grid 30vw \| 1fr; rows title / body / CTA | `.chest-modal--energy` overrides |
| Заголовок | центр, 1rem | span 2, row 1 | `h2.game-modal__title` |
| Герой | кот `getCatPoseUrl(skin, 'sleep')` + чип `+50` с `icon_energy` **≤40px** | col 1, rows 2–3 | `.chest-modal__scene--energy`, `.energy-modal__cat`, `.energy-modal__bonus` |
| Пояснение | центр, 0.88–0.95rem, padding inline | col 2, row 2, text-align left | `.chest-modal__loot-text.energy-modal__pitch` |
| CTA watch | `margin-top: auto`, wood, max-width 320px | span 2, row 4 | `.chest-modal__hurry` + `WoodQuestButton` |
| Отказ | под CTA, underline link | span 2, row 5 | `.energy-modal__dismiss` (как `.chest-modal__drops-toggle`) |
| Inset | ≥ max(12px, safe-area) | то же | padding панели |

## DOM (разработчик)

- Класс корня: `game-modal chest-modal chest-modal--energy layer-modal`.
- Сцена: `game-modal__scene game-modal__scene--plain chest-modal__scene chest-modal__scene--energy`.
- Убрать `.chest-modal__reward` / `.chest-modal__energy-icon` без стилей.
- `REWARDED_ENERGY_BONUS` из `gameConstants` для чипа и текста кнопки (не хардкод в TSX).

## Состояния

| Состояние | UI |
|-----------|-----|
| default | как wireframe |
| loading rewarded | `RewardedWaitOverlay` (существующий), модалка может оставаться под оверлеем |
| error ads | без изменений домена TASK-063 |

## Тексты

Без смены ключей `settingsUiContent.energyReward*` (`dialogContent.ts`).

## Mockup

P1: owner screenshot = anti-reference. Визуальный эталон — parity с кулдауном сундука (дерево, тёмная панель, full-bleed mobile).

## Критерии visual_check (TASK-064)

- [ ] portrait ≤640: нет обрезанной молнии; кот и +50 читаемы; wood CTA; текст с inset
- [ ] landscape ≤520: grid; нет scroll `.layer-modal`
- [ ] `npm run lint:ui-layout` pass
