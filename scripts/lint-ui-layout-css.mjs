/**
 * Static checks for mobile UI layout anti-patterns (TASK-062 / ui-layout-invariants).
 * Run: npm run lint:ui-layout
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cssPath = join(root, 'src', 'ui', 'index.css');
const css = readFileSync(cssPath, 'utf8');

const errors = [];

function fail(code, message) {
  errors.push(`[${code}] ${message}`);
}

function mediaBlockContaining(selector) {
  const re = /@media[^{]+\{([\s\S]*?)\n\}/g;
  let match;
  while ((match = re.exec(css)) !== null) {
    if (match[1].includes(selector)) return match[0];
  }
  return null;
}

const quiz700 = mediaBlockContaining('.quiz.layer-modal');
if (!quiz700) {
  fail('QUIZ_MEDIA', 'No @media block containing .quiz.layer-modal');
} else {
  if (/overflow-y:\s*auto/.test(quiz700.split('.quiz.layer-modal')[1]?.slice(0, 400) ?? '')) {
    fail('QUIZ_OVERLAY_SCROLL', 'Quiz mobile: .quiz.layer-modal must not use overflow-y: auto');
  }
  if (!/\.quiz\.layer-modal[\s\S]*?overflow:\s*hidden/.test(quiz700)) {
    fail('QUIZ_OVERLAY_HIDDEN', 'Quiz mobile: .quiz.layer-modal should use overflow: hidden');
  }
  if (!/\.quiz-answers[\s\S]*?overflow-y:\s*auto/.test(quiz700)) {
    fail('QUIZ_ANSWERS_SCROLL', 'Quiz mobile: .quiz-answers should have overflow-y: auto');
  }
}

const chest640 = mediaBlockContaining('.game-modal.chest-modal.layer-modal');
if (!chest640) {
  fail('CHEST_MEDIA', 'No @media block containing .game-modal.chest-modal.layer-modal');
} else {
  if (/\.game-modal__panel[\s\S]*?overflow-y:\s*auto/.test(chest640)) {
    fail('CHEST_PANEL_SCROLL', 'Chest mobile: panel must not use overflow-y: auto');
  }
  if (/\.game-modal\.chest-modal\.layer-modal[\s\S]*?overflow-y:\s*auto/.test(chest640)) {
    fail('CHEST_OVERLAY_SCROLL', 'Chest mobile: layer-modal must not use overflow-y: auto');
  }
}

const profileMobileMarker = '/* Профиль на телефоне';
const profileIdx = css.indexOf(profileMobileMarker);
if (profileIdx === -1) {
  fail('PROFILE_MOBILE_BLOCK', 'Missing mobile profile CSS block marker');
} else {
  const block = css.slice(profileIdx, profileIdx + 9000);
  if (!/\.profile-grid[\s\S]*?align-items:\s*start/.test(block)) {
    fail('PROFILE_GRID_ALIGN', 'Mobile profile block: .profile-grid needs align-items: start');
  }
  if (!/grid-template-columns:\s*30%/.test(block)) {
    fail('PROFILE_SPLIT', 'Mobile profile block: expected grid-template-columns 30% preview');
  }
}

const landscape = css.match(
  /@media\s*\(\s*orientation:\s*landscape\s*\)\s*and\s*\(\s*max-height:\s*520px\s*\)\s*\{[\s\S]*?\n\}/,
);
if (landscape) {
  const block = landscape[0];
  if (!/\.layer-modal:not\(\.profile-modal\):not\(\.quiz\):not\(\.game-modal\.chest-modal\)/.test(block)) {
    fail(
      'LANDSCAPE_LAYER_NOT',
      'Landscape block: use :not(.profile-modal):not(.quiz):not(.game-modal.chest-modal) on .layer-modal scroll',
    );
  }
}

if (!/\.profile-grid__cell--cat[\s\S]*?padding-top:\s*100%/.test(css)) {
  fail('PROFILE_CELL_ASPECT', '.profile-grid__cell--cat needs height:0 + padding-top:100% (not ::before on button)');
}

if (!/\.profile-grid\s*\{[\s\S]*?align-items:\s*start/.test(css)) {
  fail('PROFILE_GRID_ALIGN_BASE', '.profile-grid base rule needs align-items: start');
}

function stripCssComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '');
}

function hasNestedMediaQueries(source) {
  const css = stripCssComments(source);
  const re = /@media[^{]+\{/g;
  let m;
  while ((m = re.exec(css))) {
    const start = m.index;
    let depth = 0;
    for (let i = start; i < css.length; i++) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') {
        depth--;
        if (depth === 0) {
          const block = css.slice(start, i + 1);
          const inner = block.slice(block.indexOf('{') + 1, block.lastIndexOf('}'));
          if (/@media/.test(inner)) return true;
          break;
        }
      }
    }
  }
  return false;
}

if (hasNestedMediaQueries(css)) {
  fail(
    'NESTED_MEDIA',
    'Nested @media in index.css is forbidden — flatten (chest landscape grid was silently skipped in some builds)',
  );
}

const chestLandscapeMarker = '/* Сундук landscape (top-level @media';
const chestLandscapeIdx = css.indexOf(chestLandscapeMarker);
if (chestLandscapeIdx === -1) {
  fail('CHEST_LANDSCAPE_BLOCK', 'Missing top-level chest landscape CSS block marker');
} else {
  const chestLandscapeBlock = css.slice(chestLandscapeIdx, chestLandscapeIdx + 4500);
  if (
    !/\.game-modal\.chest-modal \.game-modal__panel[\s\S]*?display:\s*grid/.test(
      chestLandscapeBlock,
    )
  ) {
    fail(
      'CHEST_LANDSCAPE_GRID',
      'Top-level chest landscape block must set .game-modal__panel { display: grid }',
    );
  }
}

if (
  !/\.game-modal\.chest-modal\.layer-modal[\s\S]*?padding:\s*0/.test(css)
) {
  fail('CHEST_LAYER_PADDING', 'Chest overlay must zero .layer-modal padding for full-bleed mobile');
}

if (errors.length > 0) {
  console.error('lint:ui-layout failed:\n');
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}

console.log('lint:ui-layout: OK');
