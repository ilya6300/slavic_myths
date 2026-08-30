# Бестиарий — фикс кривого UI, новые ассеты книги, калибровка зон

> **Автор:** гейм-дизайнер UI/UX  
> **Дата:** 2026-08-30  
> **Pipeline:** `dev`  
> **Эталон mockup:** [`instruction/design/book_bestiary_mockup_landscape.png`](../design/book_bestiary_mockup_landscape.png)  
> **Канон UX:** [`instruction/book_layout.md`](../book_layout.md) v1.1 (**§2.5–2.6 устарели по aspect ratio** — см. §4 ниже)  
> **Реализация:** `BookOverlay.tsx`, `index.css` §Epic 10, `IzbaSceneLayers.tsx`, `bookUiStore.ts`  
> **Эпик:** [`book_animation_ux_d9729581.plan.md`](book_animation_ux_d9729581.plan.md)

---

## 0. Пункты задания (P0, нельзя пропустить)

| # | Источник | Требование | Статус в билде |
|---|----------|------------|----------------|
| 1 | Пользователь (чат) | **Отцентровать** контент левой страницы на пергаменте (имя, текст, награда, CTA) | ❌ не сделано |
| 2 | Пользователь (чат) | Кнопка **«В путь»** — не кривая, не растянутая; как на mockup | ❌ `width:100%` + `object-fit:fill` |
| 3 | Mockup | Прогресс глав — **нить по центру** над разворотом, бусины на нити | ⚠️ ассет есть, `object-position: left` |
| 4 | Mockup | CTA — **компактная деревянная плашка по центру** страницы, лапка в слоте PNG | ❌ двойная лапка + stretch |
| 5 | Mockup | Иллюстрация `available` / `defeated` — **3D** `illustration_book/`, не гравюра | ⚠️ проверить на всех духах |
| 6 | Пользователь (чат) | Обновлён `book_of_spirits.png` — **hi-res для FLIP**; на сцене **тот же визуальный размер**, при клике **увеличение** | ❌ нет `width` на `.scene-book` → риск гигантской книги |
| 7 | Пользователь (чат) | Обновлён `book_of_spirits_open.png` — **уже**; перекалибровать stage и зоны | ❌ в CSS всё ещё `/ 1.55` |
| 8 | `assignment-completeness.mdc` | Mockup побеждает % из `book_layout.md` при расхождении | — |

---

## 1. UX-решение (что видит игрок)

1. **Сцена избы:** закрытая книга на подставке — компактный предмет справа внизу (как до смены ассета), не занимает пол-экрана.
2. **Клик:** книга **увеличивается** и летит в центр viewport (FLIP); пропорции **не размываются** (новый PNG 625×809).
3. **Crossfade:** закрытая → открытая; открытая книга **уже**, чем в v1.1 спеке — больше вертикали, меньше «широкого кинотеатра».
4. **Разворот:** левая страница — **колонка по центру пергамента**; правая — иллюстрация по центру; «В путь» — деревянная плашка **по центру**, не на всю ширину.
5. **Закрытие:** обратный FLIP в точку подставки.

**Не путать:**

| Фраза | Значение | Где в коде |
|-------|----------|------------|
| «Книга в центре экрана» | FLIP overlay, `translate` к центру viewport | `.book-flight`, `computeFlightTransform` |
| «Контент по центру страницы» | `align-items: center`, `text-align: center` **внутри** `.book-page--left` | CSS зоны пергамента |
| «Прогресс по центру» | лента глав **над корешком**, `object-position: center` | `.book-modal__progress` |

---

## 2. Обновлённые ассеты (измерения)

| Файл | Пиксели | Aspect (W/H) | Было (v1.1) | Зачем меняли |
|------|---------|--------------|-------------|--------------|
| `assets/furniture/book_of_spirits.png` | **625 × 809** | **0.773** (портрет) | мелкий PNG, размывался при scale | Hi-res для анимации масштаба без blur |
| `assets/furniture/book_of_spirits_open.png` | **902 × 723** | **1.248** (ландшафт) | ~1.55:1 в спеке | Уже разворот — больше высоты страницы, меньше боковых полей |

**Константа для кода (заменить все `1.55`):**

```ts
// src/config/bookStage.ts (или константа рядом с overlay)
export const BOOK_OPEN_ASPECT = 902 / 723; // ≈ 1.248
```

```css
/* Единая формула высоты stage / flight */
--book-stage-max-w: min(94vw, 920px);
--book-stage-h: min(82vh, calc(var(--book-stage-max-w) / 1.248));
```

---

## 3. Закрытая книга на сцене + анимация масштаба

### 3.1. Проблема сейчас

- `.scene-book` — **без `width`** (`index.css` ~254–258); `.scene-sprite__img { width: 100% }` тянет **натуральные пиксели** PNG.
- Новый файл **625 px** по ширине → на 1920px экране книга ~32vw — **в 3–4 раза крупнее** прежнего вида.
- FLIP считает `scale = from.width / stage.width` из `getBoundingClientRect()` — если `from` огромный, анимация «сжатия» визуально ломается.

### 3.2. Эталон визуального размера на сцене

Ориентиры (не менять якоря комнаты 1):

| Объект | Класс | Размер в CSS |
|--------|-------|--------------|
| Скамейка | `.scene-bench` | `width: 14vw` |
| Книга (ТЗ room_01 §4.7) | `.scene-book` | **справочно 18%** контейнера ≈ **9–10vw** на текущем каноне |
| Подставка | `.scene-book-stand` | натуральный PNG, `76vw` / `2vh` |

**Канон отображения (P0):**

```css
.scene-book {
  left: 76vw;
  bottom: 11.5vh;
  width: 9vw;              /* NEW — визуальный эталон на сцене */
  /* max-width не нужен; hit-area = визуал, не раздувать отдельно */
}
```

**Калибровка:** в dev подогнать `8.5vw` … `10vw`, чтобы:
- нижний край книги сидит на `stand.png`;
- ширина ≈ **85–95%** ширины подставки;
- визуально **не крупнее** сундука рядом.

`width` здесь — **не** «для hit-area», а **эталонный масштаб hi-res спрайта** (аналог `14vw` у скамейки). Правило «не задавать width на мебели» из `css-styling.mdc` не относится к случаю смены pixel-density ассета.

### 3.3. Hover (без изменений по смыслу)

- Idle pulse, hover `scale(1.04) translateY(-3px)` — на **`.scene-sprite__img`**, не на контейнере с `width`.
- `prefers-reduced-motion` — только opacity.

### 3.4. FLIP при клике

| Параметр | Значение |
|----------|----------|
| Старт | `bookRef.getBoundingClientRect()` — **уже с `width: 9vw`** |
| Финиш | `.book-modal__stage.getBoundingClientRect()` — см. §4 |
| Transform | `translate(dx, dy) scale(fromW / stageW)` → `translate(0,0) scale(1)` |
| Длительность | 500 ms, `cubic-bezier(0.22, 1, 0.36, 1)` |
| Слой полёта | `.book-flight` — **те же W×H**, что stage (не размер сцены) |
| `src` полёта | `book_of_spirits.png` до crossfade; **не** менять на open до t=1000ms |

**Проверка приёмки:** на 1920×1080 и 390×844 нет blur; книга на сцене не «прыгает» по размеру после закрытия.

---

## 4. Открытая книга — stage и media queries

### 4.1. Заменить формулы (было 1.55)

**Desktop / portrait:**

```css
.book-modal__stage,
.book-flight {
  width: min(94vw, 920px);
  height: min(82vh, calc(min(94vw, 920px) / 1.248));
  /* margin centering для .book-flight — пересчитать под новую высоту */
}
```

**Landscape, `max-height: 500px`:**

```css
@media (max-height: 500px) and (orientation: landscape) {
  .book-modal__stage,
  .book-flight {
    height: 86vh;
    width: calc(86vh * 1.248);   /* было * 1.55 */
    margin-left: calc(86vh * 1.248 / -2);
    margin-top: -43vh;
  }
}
```

### 4.2. Визуальный эффект «уже книги»

| | Старый open (~1.55) | Новый open (1.248) |
|---|---------------------|---------------------|
| На том же `max-width: 920px` | height ≈ 593px | height ≈ **737px** |
| Страницы | шире, ниже | **уже, выше** — больше места по вертикали |
| Иллюстрация | `max-height: 58%` страницы — ок | можно **58–62%**; следить за обрезкой |
| Body text | 0.85rem | при нехватке ширины — **0.82rem**, min 12px |

Обновить **`book_layout.md` §2.5** после внедрения (отдельный коммит документации).

---

## 5. Зоны контента на новом `book_of_spirits_open.png`

Проценты — от **bounding box** спрайта open (вся картинка включая кожаный переплёт).  
Старые §2.6 (7% / 38% / 55%) калиброваны под **широкий** open — **заменить**.

### 5.1. Метод калибровки (обязателен разработчику)

1. Открыть open PNG в редакторе, включить сетку 10×10 %.
2. Левый пергамент: внутренний прямоугольник **без** зелёного шнура и тени корешка.
3. Правый — симметрично.
4. Сверить с mockup: заголовок «Домовой» — **геометрический центр** левого пергамента.
5. Зафиксировать в CSS; при расхождении с mockup **побеждает mockup**.

### 5.2. Новые зоны (v2, под 902×723)

| Зона | left | top | width | height | Примечание |
|------|------|-----|-------|--------|------------|
| **Левая страница** | **8%** | **10%** | **40%** | **76%** | flex-column, `align-items: center` |
| **Правая страница** | **52%** | **10%** | **40%** | **76%** | flex, `align-items: center` |
| **Верхняя полоса (прогресс)** | **14%** | **2.5%** | **72%** | **7%** | лента **по центру** корешка |
| **Закладка** | **86%** | **0%** | **11%** | **20%** | сдвинута левее vs 88% (книга уже) |
| **Закрыть ×** | **93%** | **1%** | **6%** | **9%** | min 36px touch |
| **Стрелка ←** | **−5%** | **42%** | **7%** | **16%** | min 44×44px |
| **Стрелка →** | **98%** | **42%** | **7%** | **16%** | min 44×44px |

**Корешок / gutter:** ~48–52% ширины спрайта — **не класть** текст и иллюстрацию на эту полосу.

### 5.3. Safe-area внутри левой страницы

Чтобы текст не лип к deckle edge пергамента:

```css
.book-page--left {
  padding: 4% 6% 4% 6%;   /* внутри зоны 40%×76% */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
```

Правая страница — `padding: 4% 5%`; иллюстрация в центре.

---

## 6. Layout vs mockup (обязательно)

| Зона | Mockup | Сейчас в билде | Целевое выравнивание | Ширина / object-fit | CSS-классы |
|------|--------|----------------|----------------------|---------------------|------------|
| **Левая страница — имя** | по центру пергамента, золотой serif | left-aligned block | `text-align: center`; `::after` линия `margin-inline: auto` | auto | `.book-page__name` |
| **Описание, награда** | центральная колонка | left-aligned | `text-align: center`; блок награды `align-items: center` | max-width **92%** зоны | `.book-page__description`, `__reward-block` |
| **CTA «В путь»** | компактная плашка, **не** full-width | `width: 100%`, bg `fill` | `margin-inline: auto`; flex center | **`max-width: 78%`** страницы; bg **`contain`**; `aspect-ratio: 3/2` от PNG 1536×1024 | `.book-page__quest-btn`, `__quest-btn-bg` |
| **Лапка на CTA** | в **слоте** деревянной плашки | отдельный `icon_paw` + слот в PNG | позиция: **внутри** левого квадрата плашки (`left: 8%` кнопки), не дублировать если совпадает | 1.35rem, `object-fit: contain` | `.book-page__paw` |
| **Правая — иллюстрация** | 3D clay в кухне | иногда гравюра | `spiritIllustrationPaths` для `available`/`defeated` | `max-height: 58%` страницы; `object-fit: contain` | `.book-illustration` |
| **Грейд** | деревянная табличка (mockup) | CSS badge | P1: ассет; MVP: оставить CSS, но **top-center** над иллюстрацией | auto | `.book-page__grade` |
| **Прогресс** | нить + 4 бусины **по центру** | track `object-position: left` | flex center; track `object-position: center center` | track `width: 100%`, `contain` | `.book-modal__progress`, `__progress-track` |
| **Бусины** | на нити, равномерно | `left: 6%`, `width: 42%` | контейнер **по центру** ленты, `justify-content: space-between` | — | `.book-modal__progress-beads` |
| **Счётчик N/16** | справа на уровне ленты | есть | `right: 0` внутри progress-зоны | nowrap | `.book-modal__counter` |
| **Закладка** | зелёная ткань справа | PNG подключён | проверить `left: 86%` на новом open | `contain` | `.book-modal__bookmark` |
| **Стрелки** | крупные, за краем книги | 68–72px | оставить min 44px; на узком open — **−5% / 98%** | `contain` | `.book-nav` |
| **Закрыть** | деревянный × | PNG | `93% / 1%` | `contain` | `.book-modal__close` |

---

## 7. Детальные правки по файлам (для разработчика)

### 7.1. `src/ui/index.css`

| Селектор | Убрать | Добавить |
|----------|--------|----------|
| `.scene-book` | — | `width: 9vw` (калибровка §3.2) |
| `.book-modal__stage`, `.book-flight` | `/ 1.55` | `/ 1.248`; пересчитать margins |
| `.book-page--left` | только absolute позиция | + flex center, padding §5.3; новые % §5.2 |
| `.book-page--right` | `left: 55%`, `width: 38%` | `left: 52%`, `width: 40%` |
| `.book-page__quest-btn` | `width: 100%` | `width: auto; max-width: 78%; align-self: center` |
| `.book-page__quest-btn-bg` | `object-fit: fill` | `object-fit: contain`; `width: 100%` **кнопки**, не страницы |
| `.book-modal__progress-track` | `object-position: left center` | `object-position: center center` |
| `.book-modal__progress-beads` | `left: 6%; width: 42%` | `left: 50%; transform: translateX(-50%); width: 38%` |
| `.book-modal__progress` | `left: 12%; width: 76%` | §5.2: `14% / 72%` |
| `.book-modal__bookmark` | `left: 88%` | `left: 86%` |
| media landscape | `* 1.55` | `* 1.248` |

### 7.2. `src/ui/book/BookOverlay.tsx`

- Убедиться: `spiritIllustrationUrl` — для `available` и `defeated` только `illustration_book/` (3D).
- CTA: если лапка визуально совпадает со слотом PNG — **убрать** `<img class="book-page__paw">`; иначе оставить с позицией §6.
- Не добавлять inline-стили для статики.

### 7.3. `instruction/book_layout.md`

- §2.5: aspect **1.248**, новые формулы height.
- §2.6: таблица зон из §5.2.
- Явная строка: «контент левой страницы — **center** на пергаменте».

### 7.4. `instruction/dev/tasks.md` (проектировщик)

Добавить критерии приёмки TASK-016/017:

- [ ] Левая страница: визуальный центр совпадает с mockup (скриншот).
- [ ] «В путь»: нет `object-fit: fill`; ширина < 80% пергамента.
- [ ] Stage aspect = 902/723; нет `1.55` в CSS.
- [ ] `.scene-book` имеет явный `width` vw; размер на сцене как до hi-res.
- [ ] FLIP без размытия на Retina / mobile.

---

## 8. Почему прошлый фикс не сработал (root cause)

| Причина | Следствие |
|---------|-----------|
| В `plan.md` v1 и `tasks.md` не было отдельного критерия **«center на пергаменте»** | разработчик закрыл задачу по ассетам/типографике |
| «Центр» в `book_layout.md` = **центр viewport** при FLIP | контент остался left-aligned в §2.6 |
| Кнопка «В путь» в gap-таблице была **P2** («filter яркости») | не тронули `width:100%` + `fill` |
| Зоны §2.6 не обновлялись под **новый** open PNG | контент «плывёт» относительно пергамента |
| Нет `width` на `.scene-book` после смены на 625px PNG | сцена и FLIP могут вести себя иначе эталона |

Правило **`assignment-completeness.mdc`** закрывает эти дыры — данный plan.md является **исполняемым** списком P0.

---

## 9. Чеклист визуальной приёмки (ревьювер)

Сверка с [`book_bestiary_mockup_landscape.png`](../design/book_bestiary_mockup_landscape.png) **по зонам**:

- [ ] Сцена: книга не крупнее прежнего эталона; подставка совпадает.
- [ ] FLIP: плавное увеличение без blur; финиш = размер stage.
- [ ] Open: пропорции **уже**; нет чёрных полей по бокам из-за неверного aspect.
- [ ] Левая страница: имя, текст, награда, CTA — **одна вертикальная ось центра** пергамента.
- [ ] «В путь»: деревянная плашка **симметрична**, текст читаем, нет растяжения.
- [ ] Прогресс: нить визуально по центру книги; бусины на нити.
- [ ] Иллюстрация Домового — 3D, не гравюра.
- [ ] Закладка, ×, стрелки — на коже/за краем, не на тексте.
- [ ] `grep 1.55` в `index.css` — **0** вхождений для book-modal.
- [ ] Pan сцены заблокирован на время overlay.

---

## 10. Промпты (оставшиеся ассеты, без изменений приоритета)

### 10.1. `assets/UI/book_chapter_progress.png` (P0)

Уже в реестре Epic 10. Критерий: горизонтальная **ветка/нить** с **4** позициями под бусины; пустые гнёзда; длина ≈ 70% ширины open-книги на mockup; `object-fit: contain`; референс: `assets/house/hut_standart.png` (дерево).

### 10.2. `assets/UI/book_bookmark_green.png` (P0)

Зелёная тканевая лента, узел, вертикальный текст «Следующий квест»; референс: mockup + `book_of_spirits.png` (зелёный шнур).

### 10.3. MVP validation mockup (только приёмка, не в билд)

```
Landscape 16:9 screenshot-style mockup of Slavic casual game bestiary screen:
open book on wooden table, left page centered text "Домовой", compact wooden
quest button "В путь" centered (not full width), right page 3D clay Domovoy
illustration, wooden chapter progress branch centered on top, green bookmark,
wooden arrows outside book edges. Style: same as assets/furniture/book_of_spirits_open.png
and instruction/design/book_bestiary_mockup_landscape.png. No UI chrome, no HUD.
```

---

## 11. Антипример

**Нельзя:** оставить `width: 100%` + `object-fit: fill` на CTA «для надёжности»; подставить `filter: brightness` вместо центрирования; копировать `1.55` из старого `book_layout.md`; показывать hi-res closed book без `width: 9vw` на сцене.

---

## 12. Validation mockup (gate: **A** — сгенерирован)

**Файл:** [`instruction/design/book_bestiary_validation_mockup_v2.png`](../design/book_bestiary_validation_mockup_v2.png)  
**Назначение:** приёмка layout-фикса после CSS; **не** подключать в билд как ассет.

### Отличия validation mockup ↔ спека §5–6

| Зона | Validation v2 | Спека / эталон |
|------|---------------|----------------|
| Пропорции книги | чуть шире, ближе к старому 1.55 | **1.248** (новый `book_of_spirits_open.png`) — канон пикселей |
| Левая страница | текст и CTA **по центру** пергамента | ✅ совпадает с P0 |
| CTA «В путь» | компактная плашка, не full-width | ✅ совпадает с §6 |
| Прогресс | нить по центру, бусины, счётчик справа | ✅ совпадает |
| Иллюстрация | 3D clay Домовой | ✅ совпадает |
| Закладка / стрелки / × | на месте | ✅ совпадает |

**Первичный эталон композиции** остаётся [`book_bestiary_mockup_landscape.png`](../design/book_bestiary_mockup_landscape.png); validation v2 — **дополнительный** чеклист для центрирования и CTA.

---

## 13. Handoff

```yaml
designer_done:
  pipeline: dev
  visual_mockup_gate:
    asked: true
    user_choice: mockup
    mockup_paths:
      - instruction/design/book_bestiary_validation_mockup_v2.png
  summary: |
    Спека фикса кривого UI: центрирование левой страницы, CTA без stretch,
    stage aspect 1.248, width 9vw для closed book на сцене. Validation mockup v2
    сгенерирован для приёмки layout. Передача разработчику.
  next: razrabotchik
```
