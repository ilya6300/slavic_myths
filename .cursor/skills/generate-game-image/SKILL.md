---
name: generate-game-image
description: >-
  Generates Slavic Myths game images via Cursor GenerateImage with mandatory
  assets/ style references. Mockups → instruction/design/mockups/; drafts →
  instruction/design/drafts/; production → assets/ only after owner approval.
---

# Генерация изображений «Книга славянских духов»

Skill для **качественной** картинки в стиле проекта. Без референсов из `assets/` генерация **запрещена**.

## Два режима (не путать)

| Режим | Куда сохранять | В код / `assets/` |
|-------|----------------|-------------------|
| **mockup** | `instruction/design/mockups/` | Нет — эталон вёрстки для дизайнера и разработчика |
| **draft_asset** | `instruction/design/drafts/` | Нет — черновик до ручной приёмки и постобработки |
| **production** | Только после приёмки Ильи → целевой путь из `assets_catalog.md` | Да |

Канон: `instruction/design_assets_prompts.md` — *не подменять* отсутствующий PNG сгенерированным файлом в `assets/` без явного одобрения владельца.

## Инструмент

1. `GetDynamicTools` → `cursor` / `GenerateImage` (если схема ещё не известна).
2. `CallDynamicTool` → `namespace: cursor`, `toolName: GenerateImage`.

### Обязательные параметры

| Параметр | Правило |
|----------|---------|
| `description` | Полный промпт по шаблону из `.cursor/roles/game-designer-ui-ux.md` §«Как писать промпты» |
| `reference_image_paths` | **Минимум 1**, лучше 2 файла из `assets/` (см. `reference-anchors.md`) |
| `filename` | Без пути; см. именование ниже |
| `aspect_ratio` | mockup экрана → `16:9`; иконка/объект → `1:1`; книга/портрет → `3:4` или `4:3` |

Пути референсов — **абсолютные** или от корня workspace, файлы должны существовать (`Read` / проверка перед вызовом).

## Алгоритм (строго по порядку)

### 1. Классифицировать тип стиля

| Тип | Папка ассетов | Якорь-референс |
|-----|---------------|----------------|
| `clay_3d` | pets, brownie, furniture, house, enemy, trophies | `assets/furniture/box_closed.png` |
| `engraving` | creatures_in_the_book | `assets/creatures_in_the_book/brownie.png` |
| `landscape` | view | `assets/view/landscape_standart.jpeg` |
| `book_leather` | обложка, премиум UI | `assets/furniture/book_of_spirits.png` |
| `ui_wood` | кнопки, рамки, стрелки | `assets/house/hut_standart.png` + `assets/furniture/book_of_spirits.png` |

Полная таблица: [reference-anchors.md](reference-anchors.md).

### 2. Собрать description

Структура — **исключительно на русском**, развёрнуто (см. `.cursor/roles/game-designer-ui-ux.md` §«Как писать промпты»):

```text
[ПРЕДМЕТ — предмет, ракурс, состояние; 2–3 предложения],
[БЛОК СТИЛЯ из шаблона game-designer-ui-ux — материалы, свет, палитра],
Повторить визуальный стиль приложенных референсов из assets/ —
тот же материал, палитра, освещение и уровень детализации.
[Чего не должно быть: развёрнутый список на русском, 8+ пунктов]
```

Для **mockup целого экрана** добавить в description:

- список зон (HUD, книга, кнопки, фон);
- «composition reference only» — не требовать pixel-perfect UI;
- привязку к `*_layout.md` (имя файла).

### 3. Вызвать GenerateImage

После генерации **переместить** файл из места по умолчанию в целевую папку, если инструмент сохранил не туда:

- mockup → `instruction/design/mockups/{task_or_screen}_mockup.png`
- draft → `instruction/design/drafts/{catalog_basename}_draft.png`

### 4. Самопроверка (до сдачи)

- [ ] Референсы из `assets/` были переданы в `reference_image_paths`
- [ ] Стиль не смешан (нет 3D рядом с гравюрой на одном объекте)
- [ ] Нет векторного/generic mobile UI
- [ ] Файл лежит в `instruction/design/`, **не** в `src/` и не в `assets/` (кроме production после одобрения)
- [ ] Для mockup: кратко описаны отличия mockup ↔ UX-спека (таблица Layout vs mockup)

### 4.1. **До** `GenerateImage` (pre-flight, обязательно)

- [ ] Прочитан промпт в `design_assets_prompts.md` / бриф (`instruction/design/*_brief.md`)
- [ ] Для `illustration_book/*`: чёрная подложка **или** `#FFFFFF` если так в `design_assets_prompts.md` / решение владельца (`perun.png` — белая); внутри фигуры — без «дырявых» прозрачных карманов до постобработки
- [ ] Для трофеев: изолированный предмет, **без** полки/комнаты; белый фон #FFF
- [ ] Negative-список и референсы совпадают с `.cursor/roles/game-designer-ui-ux.md`

### 4.2. **После** постобработки (production) — gate + критик

1. Постобработка α (см. таблицу ниже).
2. **`node scripts/verify-book-illustration.mjs`** для `illustration_book/*.png` — exit 0 обязателен.
3. При провале — `fill-internal-alpha-holes.mjs` **или** перегенерация (≤3 попытки).
4. **Вердикт критика** (шаблон ниже) в ответ пользователю / handoff — **до** объявления «готово».

```yaml
asset_critic_verdict:
  path: assets/illustration_book/perun.png
  verify_script: pass | fail
  blockers: []      # 🔴 просветы, JPEG без α, не тот символ
  on_review: []     # 🟡
  approved: true    # только если verify pass и нет 🔴
```

Критик **не переписывает** ассет — только блокирует/пропускает (`.cursor/roles/kritik-redaktor.md`: визуал vs `assets/`, канон `design_assets_prompts.md`).

### 5. Итерация при плохом результате

Не более **3** попыток за сессию без эскалации пользователю.

Менять по приоритету:

1. Другой/второй референс из той же категории
2. Уточнить subject (ракурс, «chunky silhouette», «matte clay»)
3. Усилить negative (vector, flat, icon, glassmorphism)
4. Сменить `aspect_ratio`

Если после 3 попыток стиль не совпадает с `assets/` — записать в handoff: `image_generation: needs_external_pipeline` и оставить промпт в `design_assets_prompts.md`.

## Постобработка (production-ассеты)

GenerateImage **не** заменяет:

| Задача | Действие |
|--------|----------|
| Прозрачный фон (α) | Photoshop / GIMP / remove.bg — см. § P0 в `design_assets_prompts.md` |
| Точный размер (32px icon, 280×72 shelf) | Resize после приёмки композиции |
| Правка существующего PNG (окно избы, рамки) | Ручное вырезание α, **не** перегенерация |

| Тип ассета | Скрипт |
|------------|--------|
| Белая подложка #FFF (трофеи) | `node scripts/process-hud-icon.mjs assets/trophies/....png` |
| Чёрный фон (иллюстрации книги, гравюры) | `remove-border-black-alpha.mjs` → `fill-internal-alpha-holes.mjs` → **`verify-book-illustration.mjs`** |
| Белый фон (`perun.png` по решению владельца) | `remove-border-white-alpha.mjs` → `fill-internal-alpha-holes.mjs` → **`verify-book-illustration.mjs white`** |

## Handoff (для дизайнера / оркестратора)

```yaml
image_generated:
  mode: mockup | draft_asset | production
  path: instruction/design/mockups/...
  style_type: clay_3d | engraving | landscape | ui_wood | book_leather
  references_used:
    - assets/furniture/box_closed.png
  attempts: 1
  mockup_vs_spec: |
    [отличия или «совпадает по зонам»]
  production_ready: false
```

## Связанные файлы

- Стиль и шаблоны промптов: `.cursor/roles/game-designer-ui-ux.md`
- Реестр путей: `instruction/assets_catalog.md`
- Промпты на отсутствующие файлы: `instruction/design_assets_prompts.md`
- Якоря референсов: [reference-anchors.md](reference-anchors.md)
