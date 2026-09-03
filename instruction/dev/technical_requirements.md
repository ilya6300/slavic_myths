# Технические требования

> **Для агентов разработки:** архитектор, разработчик, тестировщик, дизайнер (при UX со сценой).  
> **Не дублировать** геймдизайн — лор и баланс в `scenario.md`; здесь — **как устроен код и данные**.  
> **Детали MobX / SDK / localStorage:** `scenario_draft.md` и `tech.md` (модули по epic).

**Связанные файлы:**

| Тема | Файл |
|------|------|
| Лор, прогрессия, тон | `instruction/scenario.md` |
| MobX, GameSave, Яндекс SDK | `instruction/scenario_draft.md` |
| Модули и интерфейсы (epic) | `instruction/dev/tech.md` |
| Задачи | `instruction/dev/tasks.md` |
| Пути ассетов | `instruction/assets_catalog.md` |
| Промпты на отсутствующий арт | `instruction/design_assets_prompts.md` |
| Викторина (вопросы и ответы) | `instruction/quests.md` |
| Духи (контент книги) | `instruction/list_of_spirits.md` |
| Шансы дропа | `instruction/dev/loot_tables.md` |
| Слои локаций, Жирдяй, переход комнат | `instruction/izba_scene_layers.md` |
| HUD-аватар и профиль | `instruction/profile_layout.md` |
| Позиции избы | `instruction/room_01_layout.md` |
| Бестиарий (анимации книги) | `instruction/book_layout.md` |
| Позиции трофеев | `instruction/room_02_trophies_layout.md` |
| Викторина UI | `instruction/quiz_layout.md` |
| Диалог кота | `instruction/cat_dialog_layout.md` |

---

## 1. Принцип: данные отдельно от кода

Следующее **нельзя** захардкоживать в компонентах, store или JSX. Каждый тип — **свой файл** (редактируется вручную без правки логики).

| Что | Спека (читают агенты) | Файл в коде (редактирует разработчик / вы) |
|-----|----------------------|---------------------------------------------|
| Пути ассетов | `assets_catalog.md` | `src/config/assetRegistry.ts` |
| Позиции объектов на сцене | `room_01_layout.md`, `room_02_trophies_layout.md` | `src/config/sceneLayout.ts` |
| Викторина (вопросы, ответы, shuffle) | `quests.md` | `src/data/quiz.ts` |
| Шансы дропа, веса сундуков | `loot_tables.md` | `src/config/lootTables.ts` |
| Духи (тексты книги, награды) | `list_of_spirits.md` | `src/data/spirits.ts` |
| Титулы | `tituls.md` | `src/data/titles.ts` |

**Правило для разработчика:** UI и store **импортируют** конфиги; при смене баланса или пути — правка только в `src/config/` или `src/data/`, не в компонентах.

**Правило для агентов по арту:** отсутствующий ассет → обновить промпт в `design_assets_prompts.md`. **Не** рисовать SVG/CSS/сгенерированные картинки вместо файла из `assets_catalog.md`. Черновики и mockup — skill `.cursor/skills/generate-game-image/SKILL.md` → `instruction/design/`.

---

## 2. Стек

| Слой | Технология |
|------|------------|
| UI | React + Vite + CSS |
| State | MobX — `GameStore` |
| Persist | localStorage + облако Яндекс.Игр |
| Platform | SDK Яндекс.Игр + `isTestMode` моки |

Поток: действие → MobX action → `SaveService.schedulePersist()` → local (+ cloud если auth).

Слои кода: `ui/` · `store/` · `services/` · `platform/` · `domain/` · `config/` · `data/` — см. `.cursor/rules/project-architecture.mdc`.

---

## 3. Сцена избы — DOM-слои (снизу вверх)

Канон порядка и z-index — **`instruction/izba_scene_layers.md`**. Кратко (не менять без правки той спеки):

| z-index | Класс | Содержимое |
|---------|-------|------------|
| 0 | `.layer-forest` | Скин леса (`view/`) |
| 10 | `.layer-fatso` | Жирдяй (`enemy/fatso.png`) — за стеклом |
| 20 | `.layer-izba` | Скин избы; **стёкла α = 0** |
| 30 | `.layer-spirits` | Домовой, Суседко (кража) |
| 40 | `.layer-furniture` | Печка, лавка, сундуки, книга, полки |
| 50 | `.layer-cat` | Кот |
| 60 | `.layer-night` | Ночной overlay (`pointer-events: none`) |
| 80 | `.layer-nav` | Стрелки края экрана (hover / touch) |
| 100 | `.layer-hud` | Аватар+титул, энергия, монеты, обереги |
| 110 | `.cat-dialog` | Диалог кота |
| 200 | `.layer-modal` | Книга, лут, викторина, **профиль** |

**Единая изба:** комнаты 1 и 2 — один скин избы, inner `200%`, переход = **pan** (стрелки по hover края **и** свайп). Камера комнаты 1 держит в кадре окно + кота + книгу (`izba_scene_layers.md` §1.6.1). Домовой — только комната 1, респавн при входе (`§1.7.1`). См. `izba_scene_layers.md` §2.

**Позиции** (%, bottom, left, hit-area ≥ 44px): только в `sceneLayout.ts`, сверка с `room_01_layout.md` §4–5, `room_02_trophies_layout.md` §3.

**HUD / профиль:** титул не отдельный бейдж слева; морда кота слева сверху + титул рядом; клик по аватарке → `profile_layout.md`.

---

## 4. Локации викторины (ID → фон)

| ID | Файл фона | Fallback |
|----|-----------|----------|
| `izba` | `assets/quiz/bg_izba.jpeg` | `hut_standart.png` blur |
| `les` | `assets/quiz/bg_les.jpeg` | `landscape_standart.jpeg` |
| `banya` | `assets/quiz/bg_banya.jpeg` | `izba` + sepia |
| `pole` | `assets/quiz/bg_pole.jpeg` | `les` + warm |
| `voda` | `assets/quiz/bg_voda.jpeg` | `les` + hue-rotate |
| `temnyy_les` | `assets/quiz/bg_temnyy_les.jpeg` | `les` + brightness(0.55) |

Маппинг дух → локация: `list_of_spirits.md` / `quiz.ts`.

---

## 5. Онбординг — флаги и блокировки UI

### Флаги в `GameSave`

| Поле | Назначение |
|------|------------|
| `onboardingStep` | 0–6; после шага 6 = `completed` |
| `isFirstLaunch` | Первый вход |
| `firstChestOpened` | Первый сундук без кулдауна |

### Блокировки по шагам

| Шаг | Подсветка | Заблокировано | Разрешено |
|-----|-----------|---------------|-----------|
| 0 | Кот (сноска) | Книга, квесты | Приветствие, клик по коту |
| 1 | Книга (пульс) | Все духи кроме Домового | Открыть книгу |
| 2 | «В путь» у Домового | Другие духи | Викторина Домового |
| 3 | Домовой + Суседко | Сундук (ещё нет) | Кот, Суседко |
| 4 | «В путь» у Суседко | Остальные духи | Викторина Суседко |
| 5 | Сундук | — | Открыть сундук (таймер 0) |
| 6 | — | — | Свободная игра |

### Защита энергии в онбординге

Пока `onboardingStep !== completed`:

- Клик по коту **не тратит** энергию; монеты капают (cap 200).
- Квесты Домового и Суседко — **0 энергии**.
- Floor энергии — не ниже **20**.

---

## 6. Игровые константы (баланс в коде)

Числа ниже — дефолты для `src/config/gameConstants.ts`. Дроп-сундуков — в `loot_tables.md`.

| Параметр | Значение |
|----------|----------|
| Старт энергии | 100 |
| Клик по коту | −1 энергия, +1 монета |
| Квест | −10 энергии |
| Реген энергии | 1 / мин (`BASE_REGEN_RATE` = 60/час) |
| Cap монет | 200 (Кощей: +20 → 220) |
| Старт оберегов | 3 |
| Кот sleep | бездействие ~45–60 с |
| Сундук кулдаун | 3 ч |
| Ночь | ~20:00–06:00, локальное время |
| Грейды в коде | `common`, `rare`, `epic`, `epoch` (не `legendary`) |

### Суседко-вор (кот спит)

| Параметр | Значение |
|----------|----------|
| Предупреждение | 5 с после sleep |
| Старт кражи | ещё +5 с |
| Скорость | 1 монета / 3 с |
| Stop-loss | монет < 15 |
| Стоп | **5 кликов по Суседко** (энергию не тратит); кот остаётся `sleep` |
| Слой Суседко при краже | `.layer-susedko-steal` z-index **55** — выше мебели и кота |
| Ассет | `assets/enemy/susedko.png` |
| Позиции | `izba_scene_layers.md` §1.7.2 |
| Реплики | `instruction/susedko_dialogs.md` |

### Жирдяй

| Параметр | Значение |
|----------|----------|
| Условие | Ночь + в избе; 1 раз за ночь |
| Прогнать | 8–12 кликов по силуэту |
| Блокирует | клик-кот, сундук, квесты |
| Не блокирует | книга (чтение), трофеи, настройки, **профиль** |

---

## 7. Викторина (техника)

- Данные: `quests.md` → `src/data/quiz.ts`.
- Без букв А/Б/В; shuffle вопросов и ответов каждый старт.
- Индикатор «Вопрос X из Y».
- Ошибка: −1 оберег, квест продолжается; 0 оберегов → провал.
- Рекламы после викторины **нет**.

---

## 8. Сохранение

**Принцип:** игра без входа; localStorage всегда; облако — по желанию.

| Режим | Хранение |
|-------|----------|
| Гость | `localStorage` ключ `slavic_myths_save_v1` |
| Яндекс | `player.setData({ gameSave })`, лимит 200 KB |

`openAuthDialog` — **только** по явному действию игрока.

Поля `GameSave`, debounce 2–3 с, `flush` на `beforeunload` — `scenario_draft.md` §2–4.

---

## 9. Тестовый режим (`isTestMode`)

| Параметр | Поведение |
|----------|-----------|
| Флаг | `isTestMode: true` (env / конфиг) |
| Rewarded-кнопка | Видна; по клику награда **мгновенно**, без видео |
| Interstitial | Не используется (ни в тесте, ни в проде) |
| SDK | Мок; облако = localStorage под капотом |
| Auth | Заглушка `openAuthDialog` |

```typescript
function showRewardedAd(onRewarded: () => void) {
  if (config.isTestMode) {
    onRewarded();
    return;
  }
  yandexAdsService.showRewardedVideo(onRewarded);
}
```

---

## 10. Объём текущей разработки

**В scope (тестовый режим):**

- Изба + трофеи + книга + кот + энергия/удача
- Онбординг 6 шагов
- 16 духов + викторины + фрагменты
- Сундук 3 ч + rewarded-заглушка −30 мин
- Ночь + Жирдяй; sleep + воровство Суседко
- Save localStorage; реклама-заглушка

**Позже:** SDK Яндекс.Игр, облако, реальное видео, «обереги на улице», сезонные ивенты.

---

## 11. Реклама (технические ограничения)

- Только **rewarded** по явной кнопке игрока.
- Запрещено: interstitial, реклама на клик кота, после викторины, при открытии книги/сундука.
- Обёртки: `yandexAdsService` отдельно от `SaveService`.

Точки и лор-тексты кнопок — `scenario.md` §10.

---

## 12. Чеклист перед сдачей фичи

- [ ] Пути ассетов — из `assetRegistry.ts`, не строки в JSX
- [ ] Позиции сцены — из `sceneLayout.ts`
- [ ] Вопросы — из `quiz.ts`, не в компоненте
- [ ] Дроп — из `lootTables.ts`
- [ ] Нет placeholder-арта вместо отсутствующих PNG
- [ ] Слои DOM и z-index по §3 / `izba_scene_layers.md`
- [ ] Профиль: сетка всех скинов/титулов, locked без «Выбрать»
- [ ] `toSave` / `hydrate` — единственный маппинг в `GameSave`
- [ ] Тесты зелёные; `tasks.md` статус обновлён

---

*Версия: 1.1 · Слои — `izba_scene_layers.md`; профиль — `profile_layout.md`.*
