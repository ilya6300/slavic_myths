# Бестиарий (книга) — UX/UI-спека

> **Версия:** 1.1  
> **Дата:** 2026-08-30  
> **Автор:** гейм-дизайнер UI/UX  
> **Mockup:** `instruction/design/book_bestiary_mockup_landscape.png`  
> **Связанные ТЗ:** `instruction/scenario.md` §5 · `instruction/room_01_layout.md` §5.9 · `instruction/assets_catalog.md` · `instruction/list_of_spirits.md`

---

## 1. UX-решение

Книга на подставке в избе — **закрытая**. Клик запускает двухфазную анимацию: книга «летит» в центр экрана и **раскрывается**, затем игрок листает развороты с анимацией перелистывания.

| Состояние | Где | Ассет |
|-----------|-----|-------|
| Закрыта на сцене | `.scene-book` в избе | `assets/furniture/book_of_spirits.png` |
| Открыта (разворот) | `.layer-modal .book-modal` | `assets/furniture/book_of_spirits_open.png` ✅ |
| Иллюстрация духа | правая страница разворота | `assets/illustration_book/[spirit].png` |
| Fallback иллюстрации | викторина, силуэты | `assets/creatures_in_the_book/[spirit].png` |

Контент страниц (тексты, статусы, кнопка «В путь») — `scenario.md` §5.1–5.3.

**Главное изменение v1.1:** убрать тёмную карточку `.book-modal__inner` (generic modal). Контент лежит **поверх пергамента** открытой книги; спрайт `book_of_spirits_open.png` — единственный контейнер.

---

## 1.1. Hover на закрытой книге (сцена)

Пока книга на подставке и **не** в анимации открытия — игрок видит, что объект кликабельный.

| Фаза | Длительность | Визуал |
|------|--------------|--------|
| Idle (без hover) | 2.5 s loop | opacity `1 ↔ 0.92` (как сейчас `.room-book`) |
| Hover / `:focus-visible` | 1.6 s loop | `scale(1.04)` + `translateY(-3px)` + золотое свечение по контуру |
| Hover glow | 1.6 s loop | `drop-shadow(0 0 10px rgba(240,193,74,0.45))` → `drop-shadow(0 0 20px rgba(240,193,74,0.75))` |
| Mouse leave | 0.2 s | возврат к idle-pulse |

**Классы:** `.scene-book--interactive:hover .scene-sprite__img` (не растягивать hit-area через `width`).

**Звук (P2):** тихий шорох кожи при hover.

`prefers-reduced-motion`: только opacity-pulse, без scale и glow.

---

## 2. Анимация открытия (closed → open)

### 2.1. Триггер

Клик по `.room-book` в комнате 1. Пока анимация идёт — повторный клик и pan сцены **заблокированы** (`izba_scene_layers.md` §2.2).

### 2.2. Последовательность

```
[клик по книге на подставке]
        │
        ▼
① Затемнение фона (backdrop rgba(20,12,8,0.55), 0.25 s)
        │
        ▼
② Книга (closed) — FLIP/move из scene-rect → центр viewport
   • длительность: 0.5 s, `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out)
   • масштаб: от натурального размера на подставке до **целевого размера open-спрайта** (см. §2.5)
   • z-index: `.layer-modal` (200)
        │
        ▼
③ **t = 1.0 s** от клика — crossfade closed → open
   • `book_of_spirits.png` → `book_of_spirits_open.png`, 0.25 s
   • лёгкий scale 1.0 → 1.02 → 1.0 (0.15 s) — «хлопок» переплёта
        │
        ▼
④ **t = 1.25 s** — появление UI разворота (текст, иллюстрация, стрелки) — fade-in 0.25 s
```

**Таймлайн (мс):**

| t | Событие |
|---|---------|
| 0 | клик, backdrop 0→0.55 α |
| 0–500 | полёт closed в центр + scale |
| 500–1000 | closed в центре, «держит дыхание» |
| 1000–1250 | crossfade → open |
| 1250–1500 | fade-in контента страниц |

### 2.3. Закрытие

Обратная цепочка: fade-out UI → crossfade open → closed → move в исходные координаты подставки → убрать backdrop. Длительность суммарно **≤ 0.5 s**. После закрытия книга на сцене снова в idle-pulse (`room_01_layout.md` §5.9).

### 2.4. Реализация (рекомендация)

Один DOM-элемент `.book-flight` с `getBoundingClientRect()` старта и `transform: translate + scale` к центру. Не менять `src` до `t=1000ms` — иначе скачок пропорций. `prefers-reduced-motion`: сразу open в центре без полёта.

### 2.5. Размер открытой книги (использовать высоту)

Ассет `book_of_spirits_open.png` — **902×723** (aspect **1.248**). Страницы **уже и выше**, чем в v1.1 (~1.55). Канон пикселей: `src/config/bookStage.ts` + `index.css` `--book-open-aspect`.

```css
/* Целевой контейнер .book-modal__stage */
--book-open-aspect: 1.248;
width: min(94vw, 920px);
height: min(82vh, calc(min(94vw, 920px) / 1.248));
```

Приоритет: **заполнить высоту** на мобильном landscape (`orientation: landscape` и `max-height: 500px`):

```css
@media (orientation: landscape) and (max-height: 500px) {
  .book-modal__stage {
    height: 86vh;
    width: calc(86vh * 1.248);
  }
}
```

Закрытая книга на сцене: `.scene-book { width: 9vw }` (hi-res PNG не должен занимать натуральные 625px). Клик — FLIP scale до размера stage.

Убрать `max-height: 180px` у `.book-illustration` — заменить на `max-height: 58%` высоты правой страницы.

### 2.6. Зоны контента на `book_of_spirits_open.png`

Проценты от **bounding box** спрайта open (safe-area поверх пергамента, не на зелёный шнур). Калибровка под **902×723**:

| Зона | left | top | width | height | Содержимое |
|------|------|-----|-------|--------|------------|
| Левая страница | 8% | 10% | 40% | 76% | имя, описание, награда, CTA — **center** на пергаменте |
| Правая страница | 52% | 10% | 40% | 76% | иллюстрация, бейдж грейда |
| Верхняя полоса | 14% | 2.5% | 72% | 7% | точки глав + счётчик `N / 16` |
| Закладка | 86% | 0% | 11% | 20% | «Следующий квест» (если есть `available`) |
| Закрыть | 93% | 1% | 6% | 9% | деревянная кнопка × (вне пергамента, на коже) |
| Стрелки листания | −5% / 98% | 42% | 7% | 16% | деревянные ← → за краями книги |

**Контент левой страницы** выравнивается **по центру пергамента** (`align-items: center`, `text-align: center`). Это не то же самое, что полёт книги в центр viewport.

«В путь»: компактная плашка, `max-width: 78%` страницы, `object-fit: contain` (запрещён `width: 100%` + `fill`).

**Миграция из текущей модалки (`BookModal.tsx`):**

| Было (generic modal) | Стало (на книге) |
|----------------------|------------------|
| `.book-modal__inner` тёмная карточка | **удалить** — фон = open-PNG |
| `.book-modal__header` с заголовком | счётчик в верхней полосе; заголовок книги **не дублировать** (он на обложке closed) |
| `.book-modal__chapters` | точки над разворотом, по центру |
| `.book-modal__bookmark` | зелёная лента справа (как на mockup) |
| `.book-page--left` | flex-column, **center** на пергаменте, `overflow-y: auto`, текст `#3d2a1a` |
| `.book-page--right` | иллюстрация по центру, грейд в углу |
| `.book-nav` круглые кнопки | деревянные стрелки (ассет P1 `assets/ui/arrow_wood_left.png`) |

Типографика на пергаменте: имя `#8b6914` / gold, body `0.82–0.9rem`, line-height 1.45. Кнопка «В путь» — деревянная плашка, min-height 44px.

### 2.7. Мобильный landscape

Один UI, те же пропорции; отличия только в масштабе:

| Элемент | Портрет / desktop | Landscape ≤500px height |
|---------|-------------------|-------------------------|
| Книга | `min(94vw, 920px)` | `86vh` по высоте |
| Body text | 0.85rem | 0.78rem (min 12px) |
| Иллюстрация | 58% страницы | 62% страницы |
| Стрелки | 48×48 px touch | 44×44 px, `left: -6%` / `right: -6%` |
| Закладка | полная подпись | сокращение «Квест →» при `max-width: 700px` |

Свайп листания: по всей области `.book-modal__spread`, порог 40px.

---

## 3. Анимация перелистывания

### 3.1. Триггер

Стрелки «← / →» по краям разворота; свайп по области страницы (горизонталь > 40 px). На первой / последней странице — соответствующая стрелка скрыта (`scenario.md` §5.1).

### 3.2. Визуал

Имитация **перелистывания правой страницы** (вперёд) или левой (назад):

| Фаза | Длительность | Что видно |
|------|--------------|-----------|
| 0–50% | 0.2 s | Страница поворачивается вокруг левого края (`rotateY` 0° → −90°), лёгкая тень на сгибе |
| 50% | — | **Swap контента** (следующий / предыдущий дух); новая страница с `rotateY(90°)` |
| 50–100% | 0.2 s | Новая страница 90° → 0° |

**Суммарно:** 0.35–0.45 s, `ease-in-out`. Звук — шелест бумаги (опционально, P2).

### 3.3. Ограничения

- Во время flip кнопка «В путь» и стрелки **disabled** (0.45 s).
- Быстрые тапы по стрелке — **очередь из 1** (игнорировать спам).
- `prefers-reduced-motion`: мгновенная смена разворота без 3D.

### 3.4. Разметка (скелет)

```html
<div class="book-modal layer-modal" role="dialog" aria-label="Тайны славянских духов">
  <div class="book-modal__stage">
    <img class="book-modal__cover-open" src="assets/furniture/book_of_spirits_open.png" alt="" />
    <div class="book-modal__ribbon" aria-hidden>…точки глав + счётчик…</div>
    <button class="book-modal__bookmark" type="button">Следующий квест →</button>
    <button class="book-modal__close" type="button" aria-label="Закрыть">×</button>
    <div class="book-modal__spread">
      <div class="book-page book-page--left">…текст…</div>
      <div class="book-page book-page--right book-page--flipping">
        <img class="book-illustration" src="assets/illustration_book/bannik.png" alt="" />
      </div>
    </div>
    <button class="book-nav book-nav--prev" type="button" aria-label="Предыдущая страница"></button>
    <button class="book-nav book-nav--next" type="button" aria-label="Следующая страница"></button>
  </div>
</div>
```

Класс `.book-page--flipping` вешается на уходящую страницу; `transform-style: preserve-3d; perspective: 1200px` на `.book-modal__spread`.

---

## 4. Иллюстрации на странице

Правая страница — **цветная иллюстрация** из `assets/illustration_book/`. Маппинг spirit id → файл — `assets_catalog.md` § `illustration_book`.

| Состояние духа | Иллюстрация |
|----------------|-------------|
| `defeated` | полная `illustration_book` |
| `available` | полная + лапка «В путь» (`scenario.md` §5.2 п.4) |
| `locked` | силуэт + CSS `brightness(0)` / opacity 0.35; fallback — гравюра `creatures_in_the_book` |

Чернильная анимация появления (`scenario.md` §5.2 п.3) — поверх иллюстрации при **первом** открытии страницы после победы.

---

## 5. Чеклист для разработки

- [ ] `bookOpen` в `assetRegistry.ts` → `furniture/book_of_spirits_open.png`
- [ ] Hover: glow + scale на `.scene-book` (§1.1)
- [ ] FLIP/move closed → центр (0.5 s) → пауза до 1.0 s → crossfade open
- [ ] Убрать `.book-modal__inner` card; контент на пергаменте open-PNG (§2.6)
- [ ] Высота книги: `min(82vh, …)` + landscape media (§2.5–2.7)
- [ ] Иллюстрация: `max-height: 58%` страницы, не 180px
- [ ] 3D page-flip при листании, swap на 50%
- [ ] Блок pan избы и повторного клика на время открытия
- [ ] `prefers-reduced-motion` — упрощённые переходы
- [ ] Закрытие по `[×]` и клику по backdrop (вне книги)
- [ ] Деревянные стрелки — ассет `assets/ui/` (P1, см. `design_assets_prompts.md`)

---

## 6. Антипример

❌ Мгновенный fullscreen без полёта книги — теряется связь «книга с полки» → «живая книга в руках».  
❌ Смена страницы без анимации сгиба — ощущение PDF, а не фолианта.

---

*При изменении анимаций обновлять §2–3; ассеты — `assets_catalog.md`.*
