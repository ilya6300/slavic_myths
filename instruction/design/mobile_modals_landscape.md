# Модалки — мобильный landscape (UX/UI)

> Gate mockup: **open** (генерация разрешена владельцем 2026-09-20). Канон CSS: `src/ui/index.css` блок «Мобильный landscape — модалки».

## Решение игрока

- **Сейчас:** прочитать текст / выбрать ответ / экипировать / закрыть модалку на телефоне в горизонтали.
- **Данные:** те же, что в portrait; меняется только плотность и прокрутка.
- **Где:** меню (игрок вошёл) — `game-modal`, книга, викторина, профиль.
- **Не показывать:** дублировать HUD сцены внутри модалки (викторина — компактная сцена, не полноэкранный фон).
- **Худший кадр:** landscape ~320×568 logical, safe-area, длинный ru-текст викторины + 4 ответа.

## Принципы landscape

| Проблема | Решение |
|----------|---------|
| Двойная прокрутка (панель + сетка) | **Одна** вертикальная прокрутка на `.layer-modal` или `.game-modal__panel` |
| `min-height: 55vh` на широкой панели | Сброс `min-height` в landscape |
| Сцена 16:9 съедает высоту | `max-height: 24–28vh`, aspect-ratio шире (2:1) |
| Книга на весь экран | Стадия ≤ ~68vh, мельче шрифты на пергаменте, левая страница scroll |
| Мелкий текст | 0.78–0.88rem body, заголовки 0.95–1rem, line-height ≥ 1.35 |

## Portrait (ширина ≤640px)

| Проблема | Решение |
|----------|---------|
| Сцена сундука 16:9 на узком экране | `aspect-ratio: 2.15/1`, `max-height: ~22vh` |
| Кнопка «Забрать» вплотную к низу | `padding-bottom` + safe-area; панель `max-height: 100dvh` с одним scroll |
| Оверлей обрезает низ | `.layer-modal` — `align-items: flex-start`, прокрутка оверлея |

**Канон инвариантов:** `.cursor/rules/ui-layout-invariants.mdc` (overlap, inset, когда inner scroll допустим).

CSS: `src/ui/index.css` — `@media (max-width: 640px)` блок «Сундук / кулдаун»; профиль — блок в конце файла.

## Layout vs реализация

| Зона | Landscape | CSS |
|------|-----------|-----|
| Оверлей | Прокрутка всего окна, `align-items: flex-start` | `.layer-modal` **кроме** profile / chest / quiz |
| Профиль / сундук / викторина | `overflow: hidden` на оверлее; панель `100dvh` | см. конец `index.css` `@media (max-width: 640px), (orientation: landscape)…` |
| Викторина | Scroll **только** `.quiz-answers` (и result при победе/поражении) | не scroll `.quiz.layer-modal` |
| Панель сундука | Portrait: колонка full-bleed; **landscape: grid** сцена слева / текст+шансы справа, CTA span 2 | `.game-modal.chest-modal .game-modal__panel` — см. `chest_loot_modal_mobile.md` |
| Панель крафт / дар | Одна колонка, padding ↓ | `.game-modal__panel` |
| Профиль | Превью сверху, сетка без `max-height` | `.profile-modal__*` |
| Викторина | Узкая сцена + вопросы ниже | `.quiz-modal__*` |
| Книга | Меньше stage, текст на странице | `.book-modal`, `.book-page--left` |

## Не путать

- Прокрутка **оверлея** ≠ `overflow` на ячейке сетки профиля.
- Уменьшение шрифта книги на portrait (`max-width: 700px`) дополняется, не заменяется landscape-правилами.
