# Сундук (лут / кулдаун) — мобильный UX v2

> TASK-062 · Канон CSS: `src/ui/index.css` · Инварианты: `.cursor/rules/ui-layout-invariants.mdc`  
> **Кулдаун (актуально):** `chest_cooldown_modal_mobile_v3.md` — hero-блок, DOM, landscape 812×375. Этот файл — лут + общие правила overlay.

## Решение игрока (обязательно)

- **Решение сейчас:** понять, что выпало; при желании раскрыть «Шансы выпадения»; нажать «Забрать» (или «Ускорить» на кулдауне).
- **Без каких данных нельзя решить:** текст лута (`chest-modal__loot-text`); для кулдаuna — оставшееся время.
- **Где живёт:** меню поверх сцены (`game-modal.chest-modal`), игрок уже открыл сундук.
- **Что НЕ показывать:** дубли HUD энергии; полноэкранная сцена избы внутри модалки.
- **Худший кадр:** landscape ~908×375 (логический), ru «Вид из окна: …» + таймер «2:59:55» + раскрытая таблица шансов + safe-area iPhone.

## Проблема (owner / DOM)

На landscape панель **400×375**, `left≈258` — узкая карточка по центру, справа и слева пустой оверлей; сцена 16:9 съедает высоту; CTA и блок шансов сжаты в одну колонку.

## Layout vs mockup

| Зона | Portrait ≤640px | Landscape max-height 520px | CSS-классы |
|------|-----------------|----------------------------|------------|
| Оверлей | `overflow: hidden`, stretch | то же | `.game-modal.chest-modal.layer-modal` |
| Панель | **100vw × 100dvh**, radius 0 | **100vw × 100dvh**, **grid 2 col** | `.game-modal__panel.chest-modal__panel` |
| Заголовок | одна строка, 1rem | span 2 cols, компактнее | `.game-modal__title` |
| Сцена / сундук | aspect 2.15/1, max ~18–22vh | **левая колонка** ~32–36vw, без широкой полосы 16:9 | `.game-modal__scene`, `.chest-modal__frame-wrap` |
| Лут + таймер | под сценой, text-align center | **правая колонка**, align start, line-height ≥1.35 | `.chest-modal__loot-text`, `.chest-modal__timer` |
| Шансы | collapsible; scroll **только** `.chest-modal__drops` | та же зона, `min-height: 0`, flex 1 в правой колонке | `.chest-modal__drops-section`, `.chest-modal__drops` |
| CTA «Забрать» | `margin-top: auto`, safe-area bottom | **full width**, последняя строка grid (span 2 cols) | `.chest-modal__take`, `.chest-modal__hurry` |
| Inset | ≥ max(12px, safe-area) | то же | padding на `.game-modal__panel` |

## Не путать

- Центрирование **карточки 400px** на широком landscape ≠ адаптив; на телефоне landscape панель **на всю ширину**.
- Прокрутка оверлея сундука **запрещена** (как профиль / викторина v2).
- Уменьшение шрифта **не заменяет** split-колонку на landscape.

## Состояния

| Состояние | Отличие |
|-----------|---------|
| Лут | FX + открытый сундук, текст лута |
| Кулдаун | приглушённая сцена, крупнее таймер, опционально «Ускорить» |
| Miracle | те же layout-правила; цвет заголовка без смены grid |

## Передача разработчику

1. Portrait: full-bleed panel, flex column, CTA прижат к низу.
2. Landscape: CSS Grid на `.game-modal__panel` без изменения DOM (назначение `grid-row` / `grid-column` дочерним блокам). **Только top-level `@media`** в `index.css` — вложенный `@media` запрещён (`lint:ui-layout` `NESTED_MEDIA`).
3. Оверлей сундука: `padding: 0` на `.game-modal.chest-modal.layer-modal` (базовый `.layer-modal { padding: 1rem }` иначе даёт inset ~16px).
4. Ширина >640px + landscape: flex/grid из блока `@media (max-width: 640px), …` — portrait-only правила не дублировать без combined-блока.
5. Не трогать эталон комнаты избы / `.layer-izba`.
