# Якоря референсов для GenerateImage

Использовать **существующие файлы** в `reference_image_paths`. Если целевой ассет похож на категорию — брать якорь категории + ближайший сосед.

## clay_3d — пластилиновый объект

| Назначение | Файл |
|------------|------|
| Универсальный объект / сундук / металл | `assets/furniture/box_closed.png` |
| Интерьер / дерево / мебель | `assets/house/hut_standart.png` |
| Персонаж-кот | `assets/pets/common/cat_standart/cat_standart_sid.png` |
| Домовой | `assets/brownie/common/brownie_standart.png` |
| Враг за окном | `assets/enemy/fatso.png` |
| Печь / тепло | `assets/furniture/bake.png` |

**Пары для сложных объектов:** сундук + изба; кот + мебель той же комнаты.

## engraving — бестиарий

| Назначение | Файл |
|------------|------|
| Эталон штриха | `assets/creatures_in_the_book/brownie.png` |
| Конкретный дух | `assets/creatures_in_the_book/{spirit_id}.png` если есть |

## landscape — вид из окна

| Назначение | Файл |
|------------|------|
| Лес, золотой час | `assets/view/landscape_standart.jpeg` |

## book_leather — книга, премиум

| Назначение | Файл |
|------------|------|
| Обложка, золото, кожа | `assets/furniture/book_of_spirits.png` |
| Открытая книга (если есть) | `assets/furniture/book_of_spirits_open.png` |

## ui_wood — HUD, кнопки, стрелки

| Назначение | Файл |
|------------|------|
| Дерево, тёплые панели | `assets/house/hut_standart.png` |
| Кожа + золото UI | `assets/furniture/book_of_spirits.png` |
| Рамки грейда | `assets/frame/common.png` |

## mockup целого экрана

Минимум **2** референса разного типа по содержимому экрана:

| Экран | Референсы |
|-------|-----------|
| Изба (комната 1) | `hut_standart.png` + `cat_standart_sid.png` + при необходимости `box_closed.png` |
| Комната трофеев | `hut_standart.png` + один трофей/полка из `assets/furniture/` |
| Бестиарий / книга | `book_of_spirits.png` + `creatures_in_the_book/brownie.png` |
| Викторина | `hut_standart.png` или `quiz/` фон если есть + `box_closed.png` |
| HUD | `bake.png` (энергия) + `box_closed.png` (монета) |

## Запрещено как единственный референс

- SVG, скриншоты из других игр, stock icons
- Файлы вне `assets/` и `instruction/design/` (кроме уже принятых mockup)
