# Улица (двор) — layout

> Канон pan: `instruction/dev/tech.md` §Epic 13. Визуал — `instruction/design/mockups/street_yard_mockup.png`.

## Раскладка pan

```
[street 100vw] [izba room 1 100vw] [trophies room 2 100vw]
```

- Дефолт: `activeRoom = 1` → `translateX(-100vw)` на inner.
- Улица — **не** изба: полнокадровый `skins.window`, без `.layer-izba`.
- Кликер монет на улице **нет**.

## Слои улицы (z-index как в `izba_scene_layers.md`)

1. Фон view — `100%` кадра, `object-fit: cover`
2. Пучки травы — `.yard-grass` (натуральный PNG, без width на контейнере)
3. Night overlay — общий `.layer-night` на inner

## Позиции травы (vw/vh)

| Слот | left | bottom |
|------|------|--------|
| 1 | 22vw | 12vh |
| 2 | 48vw | 8vh |
| 3 | 72vw | 14vh |

Спавн: 1–2 пучка днём, не каждый заход (`yardGrassSpawnDayId`).

## Кикимора на улице

Двор — **трава** (диегетик, `.yard-grass`). Спрайт-компаньон Кикиморы (`.hud-rail__kikimora`) на улице **скрыт**: игрок уже у пучков. Крафт — модалка с избы.

Чип **`.hud-grass`** в шапке на улице **виден** (`n/3`): сбор без инвентаря запрещён. Тап по пучку → число тикает. При cap 3 — shake чипа, пучок остаётся. Канон: `hud_layout.md` §4.1.

## Навигация

- Комната 1: стрелка влево → street (если открыта), вправо → трофеи.
- Street: стрелка вправо → комната 1.
- Онбординг 0–6: стрелка на улицу скрыта.
