---
name: generate-game-image
description: >-
  ⏸ TEMPORARILY DISABLED — do not invoke. Generates Slavic Myths game images
  via Cursor GenerateImage with mandatory assets/ style references. Re-enable
  when owner removes the disable block in this file and game-designer-ui-ux.md.
---

# Генерация изображений «Книга славянских духов»

## ⏸ ВРЕМЕННО ОТКЛЮЧЕНО

**Не вызывать `GenerateImage`.** Не использовать этот skill, пока владелец не снимет заглушку здесь и в `.cursor/roles/game-designer-ui-ux.md`.

Дизайнер: только текстовые промпты в `design_assets_prompts.md` и UX-спеки.

---

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

## Handoff (для дизайнера / оркестратора)

```yaml
image_generated:
  mode: mockup | draft_asset
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
