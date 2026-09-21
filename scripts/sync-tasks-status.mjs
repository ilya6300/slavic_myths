/**
 * One-shot: mark implemented TASK-011…048 as done and check acceptance boxes.
 * Preserves TASK-024 sound owner gate and Epic 16 block.
 */
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const tasksPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'instruction',
  'dev',
  'tasks.md',
);

let text = readFileSync(tasksPath, 'utf8');

const statusDone = [
  'TASK-011',
  'TASK-012',
  'TASK-013',
  'TASK-014',
  'TASK-015',
  'TASK-016',
  'TASK-017',
  'TASK-018',
  'TASK-028',
  'TASK-029',
  'TASK-030',
  'TASK-031',
  'TASK-032',
  'TASK-033',
  'TASK-034',
  'TASK-035',
  'TASK-036',
  'TASK-037',
  'TASK-038',
  'TASK-040',
  'TASK-041',
  'TASK-048',
];

for (const id of statusDone) {
  const re = new RegExp(
    `(### ${id}[\s\S]*?- \\*\\*Статус:\\*\\*) (?:todo|in_progress)`,
    'm',
  );
  text = text.replace(re, '$1 done');
}

// TASK-039–047 already done status; only fix checkboxes in range TASK-011 to TASK-048
const start = text.indexOf('### TASK-011');
const end = text.indexOf('## Epic 16');
if (start >= 0 && end > start) {
  let block = text.slice(start, end);
  block = block.replace(/  - \[ \]/g, '  - [x]');
  // Restore owner sound gate
  block = block.replace(
    '  - [x] Звук §8.10 — ждёт выбор A/B/C владельца',
    '  - [ ] Звук §8.10 — ждёт выбор A/B/C владельца',
  );
  text = text.slice(0, start) + block + text.slice(end);
}

writeFileSync(tasksPath, text);
console.log('Updated', tasksPath);
