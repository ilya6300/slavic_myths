/**
 * Позиции объектов на сцене избы — логика, z-index, пулы респавна.
 * Координаты мебели/кота комнаты 1: `src/ui/index.css` + `scenePlacements.ts` (className).
 * Комната 2 (полки, лавка): канон отображения — `index.css` (vw/vh); эталон — `scene-visual-etalon.mdc`.
 * Спеки: instruction/room_01_layout.md · room_02_trophies_layout.md · izba_scene_layers.md
 */

import type { SpiritId } from './assetRegistry';

/** Позиция в процентах от контейнера (якорь bottom center, если не указано иное). */
export interface ScenePlacement {
  left: number;
  bottom: number;
  width: number;
  zIndex: number;
  interactive?: boolean;
}

export interface RectPlacement {
  left: number;
  top: number;
  width: number;
  height?: number;
}

// --- Сцена (pan: index.css .izba-scene__inner + data-room) ---

/** Оконный проём (fallback-clip Жирдяя, пока стёкла не вырезаны). % от комнаты. */
export const windowAperture: RectPlacement = {
  left: 38,
  top: 22,
  width: 24,
};

/** Якоря safe-frame комнаты 1 (izba_scene_layers.md §1.6.1). Канон — index.css. */
export const room1CameraAnchors = {
  window: { leftVw: 38, topVh: 22 },
  cat: { leftVw: 34, bottomVw: 10 },
  book: { leftVw: 80, bottomVh: 20 },
  safeMarginVw: 4,
} as const;

// --- z-index канон (izba_scene_layers.md §1.1) ---

export const layerZIndex = {
  forest: 0,
  fatso: 10,
  izba: 20,
  spirits: 30,
  furniture: 40,
  cat: 50,
  susedkoSteal: 55,
  night: 60,
  fx: 70,
  nav: 80,
  hud: 100,
  catDialog: 110,
  modal: 200,
} as const;

// --- Комната 1: Домовой fallback (room_01_layout.md §5) ---

export const brownieFallbackPlacement = {
  left: 11,
  bottom: 4,
  width: 9,
  zIndex: layerZIndex.spirits,
  interactive: false,
} as const satisfies ScenePlacement;

// --- Домовой: пул зон респавна (izba_scene_layers.md §1.7.1) ---

export interface NamedPlacement extends ScenePlacement {
  id: string;
}

export const brownieSpawnZones: NamedPlacement[] = [
  { id: 'stove_peek', left: 14, bottom: 18, width: 8, zIndex: layerZIndex.spirits },
  { id: 'bench_under', left: 28, bottom: 20, width: 7, zIndex: layerZIndex.spirits },
  { id: 'floor_left', left: 70, bottom: 10, width: 9, zIndex: layerZIndex.spirits },
  { id: 'floor_center', left: 22, bottom: 8, width: 8, zIndex: layerZIndex.spirits },
  { id: 'floor_window', left: 42, bottom: 12, width: 8, zIndex: layerZIndex.spirits },
];

export const BROWNIE_SPAWN_FALLBACK_ID = 'stove_peek';

// --- Суседко при краже (izba_scene_layers.md §1.7.2) ---

/** Канон пикселей — index.css (.scene-susedko-steal--*). left/bottom — справочно (% ≈ vw). */
export const susedkoStealPositions: NamedPlacement[] = [
  { id: 'after_stove', left: 24, bottom: 7, width: 0, zIndex: layerZIndex.susedkoSteal },
  { id: 'under_bench', left: 33, bottom: 12, width: 0, zIndex: layerZIndex.susedkoSteal },
  { id: 'floor_center', left: 44, bottom: 8, width: 0, zIndex: layerZIndex.susedkoSteal },
  { id: 'window_corner', left: 55, bottom: 10, width: 0, zIndex: layerZIndex.susedkoSteal },
  { id: 'near_chest', left: 63, bottom: 11, width: 0, zIndex: layerZIndex.susedkoSteal },
];

// --- Жирдяй (izba_scene_layers.md §1.5) ---

export const fatsoPlacement = {
  widthPercentOfAperture: 65,
  anchor: 'bottom center' as const,
};

// --- Комната 2: настенные полки (канон: room_02_trophies_layout.md v2.1, index.css) ---
// 3 полки слева (30vw) + 3 справа (57vw); ряды 40/50/60vh; лавка — room2Bench.

export const MAX_TROPHIES_PER_WALL_SHELF = 3;

export interface TrophyWallShelf {
  id: string;
  leftVw: number;
  topVh: number;
  spiritIds:
    | [SpiritId]
    | [SpiritId, SpiritId]
    | [SpiritId, SpiritId, SpiritId];
}

/** 6 полок (3 слева + 3 справа), 15 трофеев; порядок — trophySlotLayout. */
export const trophyWallShelves: TrophyWallShelf[] = [
  { id: 'wall-l-1', leftVw: 30, topVh: 40, spiritIds: ['susedko', 'bannik'] },
  { id: 'wall-l-2', leftVw: 30, topVh: 50, spiritIds: ['kikimora', 'poludnik'] },
  { id: 'wall-l-3', leftVw: 30, topVh: 60, spiritIds: ['ovinnik', 'leshiy'] },
  { id: 'wall-r-1', leftVw: 57, topVh: 40, spiritIds: ['vodyanoy', 'dedushka_toptygin', 'poludnica'] },
  { id: 'wall-r-2', leftVw: 57, topVh: 50, spiritIds: ['rusalka', 'lada', 'veles'] },
  { id: 'wall-r-3', leftVw: 57, topVh: 60, spiritIds: ['baba_yaga', 'koschei_immortal'] },
  { id: 'wall-l-4', leftVw: 30, topVh: 70, spiritIds: ['chudo_yudo', 'yarilo'] },
  { id: 'wall-r-4', leftVw: 57, topVh: 70, spiritIds: ['perun'] },
];

export const room2Bench = {
  leftVw: 35,
  topVh: 75,
  widthVw: 14,
  zIndex: layerZIndex.furniture,
} as const;

/** @deprecated Логический порядок; вёрстка — trophyWallShelves */
export const trophySlotWidthPercent = 14;
/** @deprecated */
export const trophySlotXPositions = [10, 26, 42, 58, 74] as const;

export interface TrophySlotLayout {
  spiritId: SpiritId;
  row: 'top' | 'mid' | 'bot';
  slotIndex: 0 | 1 | 2 | 3 | 4;
}

/** Порядок слотов: сверху вниз, слева направо (room_02 §3.2, устаревшая сетка 3×5). */
export const trophySlotLayout: TrophySlotLayout[] = [
  { spiritId: 'susedko', row: 'top', slotIndex: 0 },
  { spiritId: 'bannik', row: 'top', slotIndex: 1 },
  { spiritId: 'kikimora', row: 'top', slotIndex: 2 },
  { spiritId: 'poludnik', row: 'top', slotIndex: 3 },
  { spiritId: 'ovinnik', row: 'top', slotIndex: 4 },
  { spiritId: 'leshiy', row: 'mid', slotIndex: 0 },
  { spiritId: 'vodyanoy', row: 'mid', slotIndex: 1 },
  { spiritId: 'dedushka_toptygin', row: 'mid', slotIndex: 2 },
  { spiritId: 'poludnica', row: 'mid', slotIndex: 3 },
  { spiritId: 'rusalka', row: 'mid', slotIndex: 4 },
  { spiritId: 'lada', row: 'bot', slotIndex: 0 },
  { spiritId: 'veles', row: 'bot', slotIndex: 1 },
  { spiritId: 'baba_yaga', row: 'bot', slotIndex: 2 },
  { spiritId: 'koschei_immortal', row: 'bot', slotIndex: 3 },
  { spiritId: 'chudo_yudo', row: 'bot', slotIndex: 4 },
  { spiritId: 'yarilo', row: 'bot', slotIndex: 0 },
  { spiritId: 'perun', row: 'bot', slotIndex: 1 },
];

/** Минимальный hit-area интерактива (px). */
export const MIN_HIT_AREA_PX = 44;

/** Зона навигации по краю экрана (izba_scene_layers.md §2.1). Ширина — в CSS `.scene-nav`. */
export const edgeNav = {
  arrowMinSizePx: 56,
  fadeInMs: 180,
  fadeOutMs: 150,
} as const;

/** Порог свайпа между комнатами. */
export const swipeThreshold = {
  distancePercent: 18,
  flickVelocityPxPerMs: 0.45,
  clickMaxDxPx: 12,
  clickMaxDtMs: 300,
} as const;
