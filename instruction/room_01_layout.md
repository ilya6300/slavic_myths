# Комната 1 (изба) — техническое описание лейаута

> **Версия:** 2.5  
> **Дата:** 2026-08-29  
> **Автор:** гейм-дизайнер UI/UX  
> **Референс-макет:** концепт первой комнаты (изба, пластилиновый 3D)  
> **Связанные ТЗ:** `instruction/scenario.md`, `instruction/izba_scene_layers.md` (**канон слоёв, перехода, общей сцены, Жирдяя, навигации** — не дублировать здесь), `instruction/book_layout.md` (анимации бестиария), `instruction/profile_layout.md` (HUD-аватар), `instruction/room_02_trophies_layout.md`, `instruction/quiz_layout.md`, `instruction/cat_dialog_layout.md`

---

## 1. UX-решение

### Что видит игрок

Одна главная сцена — **изба-хаб**. Игрок сразу видит кота в центре, книгу справа внизу, слева сверху — **морду кота и титул**, расходники в HUD и (после Суседко) сундуки у стены. Печка, скамейка, Домовой — атмосфера; ночью — Жирдяй **за стеклом** (`izba_scene_layers.md`).

| Элемент | Интерактив | Приоритет |
|---------|------------|-----------|
| Кот | Да — клик, монетки удачи | **Главный** |
| Книга «Тайны славянских духов» | Да — бестиарий | **Высокий** |
| Обычный сундук (3 ч) | Да — лут | Высокий |
| Сундук чудес (еженед.) | Да — фрагменты / эпик-лут | Высокий (когда активен) |
| Стрелка «Трофеи →» | Да — комната 2 | Средний |
| Печка, скамейка, Домовой | Нет | Фон / награда |
| Окно | Нет (клик по окну не нужен) | Фон |
| HUD: аватар кота | Да — открывает профиль | Высокий |
| HUD: сметана | Да — +100 энергии к текущему балансу (cap = макс.) | По необходимости |

### Принцип адаптива

**Один дизайн для ПК и телефона.** Скин избы не совпадает с пропорциями широкоформатного экрана — камера **центрирует** сцену так, чтобы в кадре комнаты 1 всегда были **окно, кот и книга** (safe-frame, `izba_scene_layers.md` §1.6.1).

На узком / portrait экране сцена **горизонтально прокручивается** (swipe / scroll), старт — **центр на коте**. HUD и диалог кота — `position: fixed`, не скроллятся.

### Переход в комнату трофеев

`izba_scene_layers.md` §2 (pan, hover края, свайп, две комнаты на одном inner).

---

## 2. Система координат

Все позиции комнаты 1 — **проценты от** `.izba-scene__inner` (левая половина панорамы, `0–50%` inner). Стек DOM и z-index — **`izba_scene_layers.md` §1**.

- **Ось X:** `0%` — левый край, `100%` — правый.
- **Ось Y:** якорь `transform-origin: bottom center` — объект «стоит на полу».
- **Размер:** `width` в `%`; высота через `aspect-ratio` ассета.

### Базовый viewport

| Устройство | Соотношение | Поведение |
|------------|-------------|-----------|
| Desktop / landscape widescreen | viewport устройства | Inner центрируется по safe-frame (окно + кот + книга); края могут обрезаться |
| Mobile portrait | `16 / 9`, inner `200%` (панорама избы) | Horizontal pan + scroll-snap: печка / кот / книга+сундуки |
| Tablet landscape | Как desktop | Safe-frame + полный pan при необходимости |

---

## 3. HUD — расходники и профиль

HUD **фиксирован** поверх сцены. Не входит в pan.

**Канон левого чипа (аватар + титул) и экрана профиля:** `profile_layout.md`. Ниже — только ресурсы.

```
┌─────────────────────────────────────────────────────────────┐
│ [🐱 морда] Титул     [⚡ 87/120]  [🪙 142/200]   [🛡 3] [🥣] │
│  .hud-profile         энергия      монеты         оберег сметана│
└─────────────────────────────────────────────────────────────┘
```

### 3.1. Элементы HUD

| ID | Класс | Позиция | Поведение |
|----|-------|---------|-----------|
| `profile` | `.hud-profile` | `top: 8px; left: 8px` | Морда активного скина + титул справа. Клик → профиль. **Не** титул отдельным блоком слева/снизу |
| `energy` | `.hud-energy` | `top: 8px; left: 50%; transform: translateX(-50%)` | Формат `текущая/макс.`; при 0 — пульс + rewarded «Миска сметаны» (+100) |
| `coins` | `.hud-coins` | справа от энергии, или `left: 58%` если не хватает места | `текущее / cap`; при воровстве Суседко — красная обводка |
| `oberegs` | `.hud-oberegs` | `top: 8px; right: 8px` | Иконка щита + число; тап → tooltip «Тайные обереги спасают в викторине» |
| `smetana` | `.hud-smetana` | под оберегами | Виден если `smetanaCount > 0`; тап → подтверждение → полная энергия |
| `miracle-progress` | `.hud-miracle` | под монетами | Только если Сундук чудес активен: `Удачи до чуда: 612/700` |

Титул **не** дублировать в `bottom: 8px; left: 8px`.

### 3.2. Размеры иконок HUD

| Параметр | Значение |
|----------|----------|
| Иконка | 32×32 px (PNG пластилин, не emoji в проде) |
| Touch target | min 44×44 px |
| Фон бейджа | `rgba(40, 28, 18, 0.75)` + blur |
| Шрифт числа | 15px, `#f5e6d0` |

### 3.3. Пример разметки HUD

```html
<aside class="layer-hud room-hud">
  <!-- разметка чипа: profile_layout.md §8 -->

  <div class="hud-energy" title="Энергия">
    <img src="assets/ui/icon_energy.png" alt="" />
    <span>87<small>/120</small></span>
  </div>

  <div class="hud-coins" title="Монеты удачи">
    <img src="assets/ui/icon_coin.png" alt="" />
    <span>142<small>/200</small></span>
  </div>

  <div class="hud-oberegs" title="Тайные обереги">
    <img src="assets/ui/icon_obereg.png" alt="" />
    <span>3</span>
  </div>

  <button type="button" class="hud-smetana" hidden
          aria-label="Использовать сметану">
    <img src="assets/ui/icon_smetana.png"
         alt="Сметана — +100 энергии" />
    <span>×1</span>
  </button>

  <div class="hud-miracle" hidden>
    <span>Удачи до чуда: <strong>612</strong>/700</span>
  </div>
</aside>
```

---

## 4. Элементы сцены — координаты (эталон 16:9)

> Лес, изба, Жирдяй, ночной overlay, переход комнат — **`izba_scene_layers.md` §1–2**.  
> Ниже — только позиции **мебели и персонажей комнаты 1** для `sceneLayout.ts`.

**Якорь оконного проёма** (fallback-clip Жирдяя, пока стёкла не вырезаны): `left 38%` / `top 22%` / `width 24%` inner — см. `izba_scene_layers.md` §1.3.

### 4.1. Скамейка

| Свойство | Значение |
|----------|----------|
| Класс | `.room-bench layer-furniture` |
| `left` | `30%` |
| `bottom` | `22%` |
| `width` | `26%` |
| Кликабельность | `pointer-events: none` |
| Ассет | `assets/furniture/bench.png` |

### 4.2. Печка

| Свойство | Значение |
|----------|----------|
| Класс | `.room-stove layer-furniture` |
| `left` | `-2%` |
| `bottom` | `0` |
| `width` | `22%` |
| Кликабельность | `pointer-events: none` |
| Ассет | `assets/furniture/bake.png` |

### 4.3. Домовой (после победы)

| Свойство | Значение |
|----------|----------|
| Класс | `.room-brownie.layer-spirits` |
| Комната | **только** комната 1; в трофеях не рендерится |
| Видимость | `display: none` до `brownieDefeated` |
| Ассет | `assets/brownie/common/brownie_standart.png` (активный скин) |
| Позиция | **случайная** при каждом входе в комнату 1 — пул зон `izba_scene_layers.md` §1.7.1 |
| Поведение | idle, не кликается; бонус удачи пассивный; **не пересекается** с котом |

Эталонные координаты в §5 (`brownie 2/14/9`) — fallback `stove_peek`. Пул зон и валидация — `izba_scene_layers.md` §1.7.1.

### 4.4. Обычный сундук (3 ч)

| Свойство | Значение |
|----------|----------|
| Класс | `.room-chest .room-chest--regular layer-furniture` |
| `left` | `57%` |
| `bottom` | `18%` |
| `width` | `11%` |
| Hit-area | min `48×48px` + padding 8px |
| Состояния | `box_closed.png` / `box_open.png` |
| Видимость | скрыт до победы над Суседко |
| Готов | пульс золотого свечения + бейдж «!» |
| Таймер | под спрайтом: `02:14:33` (14px) |

### 4.5. Сундук чудес (еженедельный, эпик)

| Свойство | Значение |
|----------|----------|
| Класс | `.room-chest .room-chest--miracle layer-furniture` |
| `left` | `68%` |
| `bottom` | `20%` |
| `width` | `13%` |
| Видимость | после Суседко + ≥1 редкий дух побеждён |
| Ассет закрыт | `assets/furniture/miracle_chest_closed.png` *(нужен)* |
| Ассет открыт | `assets/furniture/miracle_chest_open.png` *(нужен)* |
| **MVP-fallback** | `box_closed.png` + CSS `filter: hue-rotate(260deg) saturate(1.4)` + частицы |
| Состояния | `idle` / `free-ready` (бесплатный слот недели) / `progress` (нужны клики) / `open` |
| FX | фиолетово-розовое свечение как у `box_open.png` |
| Прогресс | дублируется в HUD `.hud-miracle` |

**Модалка открытия Сундука чудес** — отдельный layout внутри `.layer-modal`:

```
┌─────────────────────────────────────┐
│     [анимация открытия эпик-сундука] │
│     Осколок Эпохи!  или  Утешение   │
│     [иконка награды]  ×2 оберега    │
│     Pity: 3/8 до гаранта            │
│     [ Забрать ]  [ Открыть ещё ]    │
│       (700 кликов / Pay)           │
└─────────────────────────────────────┘
```

### 4.6. Кот

| Свойство | Значение |
|----------|----------|
| Класс | `.room-cat layer-cat` |
| `left` | `32%` |
| `bottom` | `8%` |
| `width` | `16%` |
| Hit-area | min `56×56px` mobile |
| Спрайты | `sit` / `sleep` / `stand` / `hunt` |
| Облачко | `.cat-bubble` — см. `cat_dialog_layout.md` |

### 4.7. Книга

| Свойство | Значение |
|----------|----------|
| Класс | `.room-book layer-furniture` |
| `left` | `70%` |
| `bottom` | `2%` |
| `width` | `18%` |
| Подставка | `assets/furniture/stand.png` под книгой, `width: 20%`, `bottom: 0`, тот же `.layer-furniture` |
| Ассет книги (закрыта) | `assets/furniture/book_of_spirits.png` |
| Открытие | клик → полёт в центр → `book_of_spirits_open.png` → бестиарий (`book_layout.md` §2) |
| Idle | pulse opacity `0.92↔1`, 2.5s |

---

## 5. Сводная таблица позиций (комната 1)

> **Канон отображения (vw/vh):** `src/ui/index.css` — классы `.scene-*`.  
> Таблица ниже синхронизирована с эталоном CSS (2026-08-29). Проценты из §2 — справочно для ТЗ.

| ID | Элемент | Класс CSS | left | bottom | width | z | interactive |
|----|---------|-----------|------|--------|-------|---|-------------|
| `forest` | Лес | `.window-aperture__forest` | — | — | 100% комнаты | 0 | нет |
| `fatso` | Жирдяй | `.window-aperture__fatso` | в проёме окна | — | ~65% стекла | 12 | да (ночь) |
| `izba` | Изба | `.layer-izba__img` | — | — | 100% комнаты | 20 | нет |
| `brownie` | Домовой | `.scene-brownie` | `11vw` (fallback) | `4vh` | натуральный PNG | 30 | нет |
| `stove` | Печка | `.scene-stove` | `6vw` | `-7vh` | натуральный PNG | 40 | нет |
| `bench` | Скамейка | `.scene-bench` | `39vw` | `20vh` | `14vw` | 40 | нет |
| `chest-reg` | Сундук 3ч | `.scene-chest-regular` | `67vw` | `19vh` | натуральный PNG | 40 | да |
| `chest-mir` | Сундук чудес | `.scene-chest-miracle` | `58vw` | `19vh` | натуральный PNG | 40 | да |
| `stand` | Подставка | `.scene-book-stand` | `76vw` | `2vh` | натуральный PNG | 40 | нет |
| `book` | Книга | `.scene-book` | `76vw` | `11.5vh` | `9vw` (hi-res PNG) | 40 | да |
| `cat` | Кот | `.scene-cat` | `34vw` | `10vh` | натуральный PNG | 50 | да |
| `nav-trophies` | → Трофеи | `izba_scene_layers.md` §2.1 | — | — | — | 80 | да |

Жирдяй, лес, изба, ночь — не в этой таблице; см. **`izba_scene_layers.md` §1**.

---

## 6. Модалка лута — обычный сундук

```
┌──────────────────────────────────────┐
│  [сундук open анимация 0.6s]         │
│  ┌────────┐                          │
│  │ награда│  Рыжий кот (скин)        │
│  │  PNG   │  Обычный · Новый!        │
│  │        │  [ Экипировать ] [ Ок ]  │
│  └────────┘                          │
│  Дубликат → +1 фрагмент / оберег     │
└──────────────────────────────────────┘
```

| Тип награды | Иконка в модалке |
|-------------|------------------|
| Скин кота/домового/избы/окна | превью скина |
| Титул | пергамент + текст |
| Тайный оберег | `icon_obereg.png` |
| Сметана | `icon_smetana.png` |
| Ключ к духу | мини-гравюра духа + ключ |
| Фрагмент | осколок `fragment_shard.png` *(нужен)* |
| Ключ к сундуку | мини `box_closed.png` |

Кнопка rewarded при таймере: «Домовой шепчет: поторопи удачу (−30 мин)» — под модалкой, лор-стиль.

---

## 7. FX — воровство Суседко

Когда кот `sleep` и монет ≥ 15:

| FX | Описание |
|----|----------|
| `.hud-coins--stealing` | красная пульсирующая обводка |
| `.cat-bubble` | «Кажется, кто-то шуршит под половицами…» |
| Суседко | `assets/enemy/susedko.png`, слой `.layer-susedko-steal` (z **55**), позиции — `izba_scene_layers.md` §1.7.2 |
| Монетки | `-1` каждые 3 с, вылетают к Суседко / под пол (`left: 55%`) |
| Клик по Суседко | облачко `.susedko-bubble`, реплики — `susedko_dialogs.md`; **5 кликов** → исчезает, кража стоп; энергию не тратит |
| Кот | остаётся `sleep`; клик по коту **не** останавливает кражу |

### 7.1. FX — клик по коту (монета удачи)

При клике по коту, если `energy > 0`:

| FX | Описание |
|----|----------|
| Спрайт | `assets/UI/monete_v1.png` появляется у точки клика |
| Анимация | `coin-fly-up`: всплывает вверх ~80px за 0.8 с, fade-out |
| Слой | `.layer-fx` (z **70**) |

---

## 8. Ночной режим

Overlay `.layer-night` — **`izba_scene_layers.md` §1.1**. Дополнительно для комнаты 1:

| Свойство | Значение |
|----------|----------|
| Overlay | `rgba(15, 20, 45, 0.45)` |
| `pointer-events` | `none` на overlay |
| Окно | скин `landscape_night.jpeg` *(нужен)* или filter `brightness(0.4) hue-rotate(200deg)` |
| Интерактивы | остаются кликабельны |

---

## 9. Мобильная адаптация (комната 1)

Камера, safe-frame, pan при модалке — **`izba_scene_layers.md` §1.6.1, §2.2**. Только scroll-snap **комнаты 1** на portrait:

| Параметр | Значение |
|----------|----------|
| `.izba-scene__inner` width | `200%` (панорама избы) |
| Ориентация | portrait **разрешён** — горизонтальный scroll / swipe |
| Scroll-snap | `0%` печка, `50%` кот, `100%` книга+сундуки |
| Стартовый scroll | ~25% (кот в центре safe-frame) |
| HUD | fixed, safe-area |
| Диалог кота | см. `cat_dialog_layout.md` |

---

## 10. Пример разметки (фрагмент комнаты 1)

Полный стек избы — **`izba_scene_layers.md` §4**. Ниже — только элементы **комнаты 1** внутри `.izba-scene__inner`:

```html
<!-- внутри .izba-scene__inner — после слоёв §1.1 izba_scene_layers.md -->

      <img class="room-brownie layer-spirits" hidden
           src="assets/brownie/common/brownie_standart.png" alt="Домовой" />

      <img class="room-bench layer-furniture"
           src="assets/furniture/bench.png" alt="" />
      <img class="room-stove layer-furniture"
           src="assets/furniture/bake.png" alt="Печка" />

      <button class="room-chest room-chest--regular layer-furniture" type="button"
              aria-label="Обычный сундук" hidden>
        <img src="assets/furniture/box_closed.png" alt="Сундук с удачей" />
        <span class="room-chest__timer" hidden>02:14:33</span>
      </button>

      <button class="room-chest room-chest--miracle layer-furniture" type="button"
              aria-label="Сундук чудес" hidden>
        <img src="assets/furniture/miracle_chest_closed.png"
             alt="Сундук чудес — эпические награды и осколки Эпохи" />
      </button>

      <img class="room-stand layer-furniture"
           src="assets/furniture/stand.png" alt="" />
      <button class="room-book layer-furniture" type="button"
              aria-label="Книга славянских духов">
        <img src="assets/furniture/book_of_spirits.png"
             alt="Тайны славянских духов" />
      </button>

      <button class="room-cat layer-cat" type="button" aria-label="Кот">
        <img src="assets/pets/common/cat_standart/cat_standart_sid.png" alt="Кот" />
      </button>
```

Стрелка «→ Трофеи», HUD, `.layer-night` — см. **`izba_scene_layers.md` §4**.

---

## 11. Состояния и анимации

| Элемент | Idle | Hover | Active / особое |
|---------|------|-------|-----------------|
| Кот | sit/sleep | scale 1.02 | squash + монетка |
| Книга | pulse | свечение контура | полёт в центр → open → бестиарий (`book_layout.md`) |
| Сундук 3ч | closed | пульс крышки | open + modal |
| Сундук чудес | FX свечение | усиленный FX | open + epic modal |
| Сметана HUD | — | scale 1.05 | confirm → full energy |
| Жирдяй | покачивание 4s | — | scare event (`izba_scene_layers.md` §1.5) |

---

## 12. Чеклист для разработки

- [ ] HUD: аватар+титул (`profile_layout.md`), энергия, монеты, обереги, сметана, прогресс чуда
- [ ] Два сундука с разными модалками
- [ ] Домовой: респавн в комнате 1 (`izba_scene_layers.md` §1.7.1)
- [ ] Книга: анимации open + page-flip (`book_layout.md`)
- [ ] Стек избы, pan, навигация, Жирдяй — **`izba_scene_layers.md`** (не дублировать в коде)
- [ ] Воровство Суседко при sleep
- [ ] Диалог кота — `cat_dialog_layout.md`
- [ ] Portrait scroll-snap комнаты 1 (§9)
- [ ] Hit-area ≥ 44px
- [ ] MVP-fallback для эпик-сундука (hue-rotate на box)

---

## 13. Связанные ассеты

> Полный реестр путей: **`instruction/assets_catalog.md`**

---

## 14. Промпты на отсутствующие ассеты

> **Полный реестр с текстами промптов:** `instruction/design_assets_prompts.md`  
> Ниже — только краткая отсылка по избе; дублирование в лейаутах запрещено (правило дизайнера).

| Ассет | Раздел в реестре |
|-------|------------------|
| HUD-иконки, стрелки, эпик-сундук | P0 |
| `landscape_night.jpeg`, `fragment_shard.png` | P2 |

**Не создавать:** отдельный фон комнаты трофеев — та же `hut_standart.png`.

---

## 15. Антипример

❌ Два сундука одинакового вида без FX — игрок не отличит обычный 3-часовой от еженедельного эпика и пропустит «Сундук чудес».

---

*При изменении координат — §4–5; слои, pan, z-index — только `izba_scene_layers.md`.*

```yaml
designer_done:
  pipeline: ideas
  summary: |
    Изба: канон слоёв в izba_scene_layers.md; HUD-аватар в profile_layout.md;
    переход комнат hover+свайп; Жирдяй под избой.
  next: kritik-redaktor
```
