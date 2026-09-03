/**
 * Split trophies_grid_all_15.png into 15 PNGs with transparent background.
 * Source: instruction/design/drafts/trophies_grid_all_15.png
 * Output: assets/trophies/*.png
 */
import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const INPUT = path.join(
  root,
  'instruction/design/drafts/trophies_grid_all_15.png',
);
const OUTPUT_DIR = path.join(root, 'assets/trophies');

const COLS = 5;
const ROWS = 3;
/** Внутренние ячейки — отступ от границы клетки */
const CELL_MARGIN_RATIO = 0.06;
/** Край сетки — минимальный отступ, иначе режет сундук (0,0) и чудо (4,2) */
const EDGE_MARGIN_RATIO = 0.015;

/** Row-major 5×3 — matches design_assets_prompts.md */
const FILES = [
  [
    'susedko_chest.png',
    'bannik_broom.png',
    'kikimora_yarn.png',
    'polevoy_wreath.png',
    'ovinnik_sheaf.png',
  ],
  [
    'leshiy_staff.png',
    'vodyanoy_shell.png',
    'toptygin_paw.png',
    'poludnica_sickle.png',
    'rusalka_comb.png',
  ],
  [
    'lada_harmony_vase.png',
    'veles_bust.png',
    'yaga_hut.png',
    'koschei_needle.png',
    'chudo_figurine.png',
  ],
];

function removeNearWhiteBackground(data, channels) {
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const isPureWhite = r >= 248 && g >= 248 && b >= 248;
    const isFloorShadow = min >= 228 && max >= 245 && max - min <= 32;
    if (isPureWhite || isFloorShadow) {
      data[i + 3] = 0;
    }
  }
}

function cellMargins(col, row, cellW, cellH) {
  const innerX = Math.floor(cellW * CELL_MARGIN_RATIO);
  const innerY = Math.floor(cellH * CELL_MARGIN_RATIO);
  const edgeX = Math.floor(cellW * EDGE_MARGIN_RATIO);
  const edgeY = Math.floor(cellH * EDGE_MARGIN_RATIO);

  return {
    left: col === 0 ? edgeX : innerX,
    right: col === COLS - 1 ? edgeX : innerX,
    top: row === 0 ? edgeY : innerY,
    bottom: row === ROWS - 1 ? edgeY : innerY,
  };
}

async function processCell(inputBuffer, meta, col, row, filename) {
  const cellW = Math.floor(meta.width / COLS);
  const cellH = Math.floor(meta.height / ROWS);
  const margin = cellMargins(col, row, cellW, cellH);

  const left = col * cellW + margin.left;
  const top = row * cellH + margin.top;
  const width = cellW - margin.left - margin.right;
  const height = cellH - margin.top - margin.bottom;

  const isEdgeCell =
    col === 0 ||
    col === COLS - 1 ||
    row === 0 ||
    row === ROWS - 1;

  const extracted = await sharp(inputBuffer)
    .extract({ left, top, width, height })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Uint8Array.from(extracted.data);
  removeNearWhiteBackground(pixels, extracted.info.channels);

  const outPath = path.join(OUTPUT_DIR, filename);
  let pipeline = sharp(pixels, {
    raw: {
      width: extracted.info.width,
      height: extracted.info.height,
      channels: 4,
    },
  });

  // trim агрессивно съедает края у объектов у границы сетки
  if (!isEdgeCell) {
    pipeline = pipeline.trim({ threshold: 12 });
  }

  await pipeline.png({ compressionLevel: 9 }).toFile(outPath);

  const outMeta = await sharp(outPath).metadata();
  return {
    file: filename,
    width: outMeta.width,
    height: outMeta.height,
    hasAlpha: outMeta.hasAlpha,
  };
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const inputBuffer = await sharp(INPUT).toBuffer();
  const meta = await sharp(inputBuffer).metadata();
  console.log(`Source: ${meta.width}×${meta.height}`);

  const results = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      results.push(
        await processCell(inputBuffer, meta, col, row, FILES[row][col]),
      );
    }
  }

  console.table(results);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
