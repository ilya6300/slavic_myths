/**
 * className объектов комнаты 1.
 *
 * Канон позиций — `src/ui/index.css` (визуальная подгонка под 100vw, vw/vh).
 * Эталон ТЗ (%): `instruction/room_01_layout.md` §4–5 (гейм-дизайнер UI/UX).
 *
 * Числа здесь — только для runtime (FX, будущая камера), в тех же единицах, что CSS.
 */

export const stovePlacement = {
  className: 'scene-stove',
} as const;

export const benchPlacement = {
  className: 'scene-bench',
} as const;

export const chestRegularPlacement = {
  className: 'scene-chest-regular',
} as const;

export const chestMiraclePlacement = {
  className: 'scene-chest-miracle',
} as const;

export const bookStandPlacement = {
  className: 'scene-book-stand',
} as const;

export const bookPlacement = {
  className: 'scene-book',
} as const;

/** Якорь FX монет — синхрон с `.scene-cat` в index.css */
export const catPlacement = {
  className: 'scene-cat',
  bubbleClassName: 'scene-cat-bubble',
  coinFx: {
    leftVw: 34,
    bottomVw: 24,
  },
} as const;

/** Позиции Суседко при краже — className в index.css */
export const susedkoStealPlacementClasses: Record<string, string> = {
  floor_left: 'scene-susedko-steal--floor-left',
  under_bench: 'scene-susedko-steal--under-bench',
  floor_center: 'scene-susedko-steal--floor-center',
  window_corner: 'scene-susedko-steal--window-corner',
  near_chest: 'scene-susedko-steal--near-chest',
};
