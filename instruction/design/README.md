# Визуальные эталоны (mockup и черновики)

Канон вёрстки для сверки: `.cursor/rules/assignment-completeness.mdc` — **mockup важнее %** из `*_layout.md`.

## Папки

| Путь | Назначение |
|------|------------|
| `mockups/` | Mockup экранов (gate A/C дизайнера). Имена: `{экран}_mockup.png`, напр. `book_mockup.png` |
| `drafts/` | Черновики ассетов до приёмки; **не** класть в `assets/` без одобрения |

## Генерация

Агент: skill `.cursor/skills/generate-game-image/SKILL.md` → `GenerateImage` с `reference_image_paths` из `assets/`.

## В коде

Пути mockup указываются в TASK, `designer_done.mockup_paths` и чеклисте ревьювера — не хардкодить в `src/` без задачи.
