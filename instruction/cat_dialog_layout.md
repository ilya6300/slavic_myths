# Диалоговое окно кота (VN-стиль) — UX/UI-спека

> **Версия:** 1.0  
> **Дата:** 2025-08-26  
> **Автор:** гейм-дизайнер UI/UX  
> **Связанные ТЗ:** `instruction/scenario.md` §4, §8; `instruction/room_01_layout.md`

---

## 1. UX-решение

### Два режима одного компонента

| Режим | Класс | Когда | Блокирует игру? |
|-------|-------|-------|-----------------|
| **Сноска** (по умолчанию) | `.cat-dialog--footnote` | Повторный вход, подсказки, сундук готов, после клика | **Нет** — сцена кликабельна |
| **Новелла** | `.cat-dialog--novel` | Онбординг шаги 0–1, ключевые сюжетные реплики | **Частично** — затемнение фона, но без hard-block на шаге 0 |

**Главная задача на экране:** прочитать реплику кота за 1 тап («Далее» / тап по панели).

Современный VN-стиль = **чистая типографика + полупрозрачная панель + портрет кота**, без ретро-пикселей и без generic Material cards.

---

## 2. Анатомия компонента

```
.cat-dialog (position: fixed, bottom: 0, width: 100%, z-index: 110)

┌──────────────────────────────────────────────────────────────────┐
│ ░░░ необязательный dim-overlay (только .cat-dialog--novel) ░░░░░ │
│                                                                  │
│  ┌────────┐  ┌──────────────────────────────────────────────┐   │
│  │        │  │  Кот · хранитель избы          [имя опц.]   │   │
│  │ портрет│  ├──────────────────────────────────────────────┤   │
│  │  кота  │  │  Текст реплики с эффектом печати…           │   │
│  │ 3D PNG │  │                                              │   │
│  │        │  │                              [ Далее ▶ ]    │   │
│  └────────┘  └──────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
     ↑                    ↑
  96×96 min           деревянная рамка + glass inner
  (mobile 72×72)
```

---

## 3. Визуальный стиль

### 3.1. Панель

| Свойство | Значение |
|----------|----------|
| Фон внутри | `rgba(28, 20, 14, 0.82)` + `backdrop-filter: blur(8px)` |
| Рамка | nine-slice PNG дерево `assets/ui/dialog_frame_wood.png` *(нужен)* |
| Fallback | `border: 2px solid #8b6914`; `border-radius: 16px 16px 0 0` |
| Тень | `0 -4px 24px rgba(0,0,0,0.35)` |
| Высота | `min 120px`, `max 38vh` |
| Отступ снизу | `0` (прилипает к краю); на iOS — `padding-bottom: env(safe-area-inset-bottom)` |

### 3.2. Портрет

| Свойство | Значение |
|----------|----------|
| Источник | Текущий скин кота: `assets/pets/.../[skin]_sid.png` |
| Размер | 88px desktop / 72px mobile |
| Позиция | Выступает **над** верхним краем панели на 24px (классический VN) |
| Рамка | Тонкое золотое кольцо `2px #c9a227` |
| Эмоции (пост-MVP) | `neutral`, `happy`, `worried`, `sleepy` — смена спрайта по тегу реплики |

### 3.3. Типографика

| Элемент | Стиль |
|---------|-------|
| Имя | «Кот» или кастом из титула — 13px, `#c9a87c`, uppercase tracking |
| Реплика | 16–17px, `#f5f0e8`, line-height 1.5 |
| Эффект печати | 25–35 символов/сек; тап — мгновенно показать весь текст |
| Кнопка «Далее» | Деревянная, min 44px, текст «Далее» + опциональная стрелка PNG |

### 3.4. Режим `.cat-dialog--novel`

- Overlay на сцену: `rgba(10, 12, 30, 0.4)` — `pointer-events: none` на overlay (клики в сцену проходят только если не `blocking`).
- Подсветка цели (книга, сундук): отдельный компонент `.tutorial-highlight`, не часть диалога.

### 3.5. Режим `.cat-dialog--footnote`

- Без overlay.
- Меньше высота (`min 96px`).
- Портрет 64px.
- Автоскрытие через 8 с бездействия (fade-out), если не онбординг.

---

## 4. Облачко над котом (короткие реплики)

Для `click`, `idle_nudge`, `susedko_steal` — **не** полная панель, а облачко:

| Свойство | Значение |
|----------|----------|
| Класс | `.cat-bubble` |
| Позиция | Над котом: `bottom: 100%`, `left: 50%`, `transform: translateX(-50%)` |
| z-index | `60` (слой FX сцены) |
| Стиль | Светлый пергамент `rgba(255, 248, 235, 0.95)`, хвостик вниз к коту |
| Текст | max 2 строки, 14px |
| Длительность | 3 с, fade-out |

---

## 4.1. FX монетки при клике по коту

Только если `energy > 0` и кот в состоянии `sit` (не `sleep`):

| Свойство | Значение |
|----------|----------|
| Ассет | `assets/UI/monete_v1.png` |
| Появление | у координат клика (clientX/Y → позиция в viewport) |
| Анимация | `coin-fly-up`: вверх ~80 px за 0.8 с, fade-out |
| Класс | `.coin-fly` |
| Слой | `.layer-fx`, z-index `70` |
| `pointer-events` | `none` |

Не показывать при `energy === 0` или во время `sleep`.

---

## 4.2. Облачко Суседко (`.susedko-bubble`)

При клике по Суседко во время кражи — тот же стиль, что `.cat-bubble`, класс `.susedko-bubble`, позиция над спрайтом Суседко. Тексты — `instruction/susedko_dialogs.md`.

---

## 5. Очередь реплик

```typescript
// Псевдоструктура
type CatDialogLine = {
  text: string;
  mode: 'footnote' | 'novel';
  tag?: 'greet_first' | 'hint_quest' | 'chest_ready' | ...;
  portrait?: 'neutral' | 'happy' | 'worried';
  blocking?: boolean; // только novel + онбординг
};
```

- Несколько строк подряд — кнопка «Далее» листает очередь.
- После последней — `onDismiss` (скрыть панель).

---

## 6. Тексты по контекстам (референс)

| Контекст | Режим | Пример |
|----------|-------|--------|
| Первый вход (шаг 0) | novel | «Ого, человек! Я — Кот…» `cat_dialogs.md` |
| Повторный вход | footnote | `greet_return` из банка §8 |
| Сундук готов | footnote | «Сундук стучит…» §6.1 |
| Сундук чудес | novel | «Сундук чудес снова стучит…» §5.4 |
| Подсказка квеста | footnote | `hint_quest` |
| После победы | footnote | `after_win` + крючок |

---

## 7. Пример разметки

### Сноска (не блокирует)

```html
<aside class="cat-dialog cat-dialog--footnote layer-hud"
       role="complementary" aria-live="polite">
  <div class="cat-dialog__portrait">
    <img src="assets/pets/common/cat_standart/cat_standart_sid.png"
         alt="Кот — хранитель избы" />
  </div>
  <div class="cat-dialog__body">
    <span class="cat-dialog__name">Кот</span>
    <p class="cat-dialog__text">
      Сундук стучит. Пока тебя не было — удача копилась.
    </p>
    <button type="button" class="cat-dialog__next" aria-label="Далее">
      <img src="assets/ui/arrow_right_wood.png" alt="" />
    </button>
  </div>
</aside>
```

### Новелла (онбординг)

```html
<div class="cat-dialog cat-dialog--novel cat-dialog--blocking"
     role="dialog" aria-modal="true" aria-labelledby="cat-dialog-text">
  <div class="cat-dialog__dim" aria-hidden="true"></div>
  <div class="cat-dialog__portrait cat-dialog__portrait--large">
    <img src="assets/pets/common/cat_standart/cat_standart_sid.png"
         alt="Кот приветствует хозяина" />
  </div>
  <div class="cat-dialog__body">
    <span class="cat-dialog__name">Кот</span>
    <p id="cat-dialog-text" class="cat-dialog__text">
      Ого, человек! Я — Кот. Тут по ночам шуршат. Пойдём разберёмся?
    </p>
    <button type="button" class="cat-dialog__next cat-dialog__next--label">
      Далее
    </button>
  </div>
</div>
```

### Облачко (клик)

```html
<div class="cat-bubble layer-fx" role="status">
  <p>Эй! Не жадничай… ладно, ещё.</p>
</div>
```

---

## 8. Адаптив

| Устройство | Изменения |
|------------|-----------|
| Desktop | Панель `max-width: 720px`, центрирована |
| Mobile portrait | Портрет слева 72px, текст переносится; кнопка «Далее» справа внизу |
| Mobile landscape | Как desktop, `max-height: 30vh` |

**Не делать** отдельный мобильный дизайн — только масштаб и safe-area.

---

## 9. Анимации

| Событие | Анимация |
|---------|----------|
| Появление панели | `translateY(100%) → 0`, 0.28s ease-out |
| Скрытие | fade + slide down 0.22s |
| Печать текста | посимвольно; blink курсора `|` опционально |
| Смена реплики | crossfade текста 0.15s |

---

## 10. Чеклист для разработки

- [ ] Два режима: footnote / novel
- [ ] Портрет = текущий скин кота из store
- [ ] Онбординг шаг 0–1 — novel; шаг 6+ — footnote
- [ ] Повторный вход — footnote, кот sleep на сцене
- [ ] Облачко для коротких реплик (не дублировать панель)
- [ ] Тап «Далее» / тап по панели после полного текста
- [ ] `aria-live="polite"` на footnote
- [ ] safe-area-inset на iOS

---

## 11. Промпты на отсутствующие ассеты

> **Полные тексты** — `instruction/design_assets_prompts.md` → `dialog_frame_wood.png`, `arrow_right_wood.png`, `bubble_tail.png` (P0/P2).

---

## 12. Антипример

❌ Полноэкранный белый Alert с системным шрифтом и кнопкой OK — ломает immersion и стиль пластилина.

---

```yaml
designer_done:
  pipeline: ideas
  summary: |
    Диалог кота: VN-панель снизу + портрет 3D-кота, режимы footnote/novel,
    облачко для коротких реплик. Промпты на рамку и стрелку.
  next: kritik-redaktor
```
