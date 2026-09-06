import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { spiritIllustrationPaths } from './assetRegistry';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const css = readFileSync(resolve(root, 'src/ui/index.css'), 'utf8');

function epic10Block(): string {
  const start = css.indexOf('/* --- Epic 10:');
  const end = css.indexOf('/* --- Epic 4:');
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return css.slice(start, end);
}

function ruleBody(selector: string, source: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`));
  expect(match, `missing CSS rule ${selector}`).toBeTruthy();
  return match![1];
}

describe('TASK-019 book layout CSS contract', () => {
  const bookCss = epic10Block();

  it('should keep scene book compact (6vw) so hi-res PNG does not fill the izba', () => {
    const body = ruleBody('.scene-book', css);
    expect(body).toMatch(/width:\s*6vw/);
  });

  it('should use open-book aspect 1.248 and not the obsolete 1.55 in Epic 10 CSS', () => {
    expect(bookCss).toMatch(/1\.248/);
    expect(bookCss).not.toMatch(/1\.55/);
  });

  it('should center left-page content on the parchment', () => {
    const body = ruleBody('.book-page--left', bookCss);
    expect(body).toMatch(/left:\s*8%/);
    expect(body).toMatch(/width:\s*40%/);
    expect(body).toMatch(/align-items:\s*center/);
    expect(body).toMatch(/text-align:\s*center/);
  });

  it('should place the right page at 52% / 40% for the narrower open PNG', () => {
    const body = ruleBody('.book-page--right', bookCss);
    expect(body).toMatch(/left:\s*52%/);
    expect(body).toMatch(/width:\s*40%/);
  });

  it('should keep the quest CTA compact with contain, not stretch fill', () => {
    const btn = ruleBody('.book-page__quest-btn', bookCss);
    expect(btn).toMatch(/max-width:\s*78%/);
    expect(btn).toMatch(/aspect-ratio:\s*418\s*\/\s*133/);
    expect(btn).not.toMatch(/width:\s*100%/);
    expect(btn).not.toMatch(/grid-template-columns/);
    expect(btn).not.toMatch(/padding-bottom/);
    const bg = ruleBody('.book-page__quest-btn-bg', bookCss);
    expect(bg).toMatch(/object-fit:\s*contain/);
    expect(bg).not.toMatch(/object-fit:\s*fill/);
    const copy = ruleBody('.book-page__quest-btn-copy', bookCss);
    expect(copy).toMatch(/position:\s*absolute/);
    expect(copy).toMatch(/justify-content:\s*center/);
    expect(bookCss).not.toMatch(/\.book-page__quest-btn-slot/);
  });

  it('should center the chapter progress track and beads', () => {
    const track = ruleBody('.book-modal__progress-track', bookCss);
    expect(track).toMatch(/object-position:\s*center/);
    const beads = ruleBody('.book-modal__progress-beads', bookCss);
    expect(beads).toMatch(/left:\s*50%/);
    expect(beads).toMatch(/width:\s*38%/);
  });

  it('should not use engraving portraits as unlocked bestiary illustrations', () => {
    for (const path of Object.values(spiritIllustrationPaths)) {
      expect(path).not.toMatch(/creatures_in_the_book/);
    }
  });

  it('should define ink-reveal animation for first defeated illustration', () => {
    expect(bookCss).toMatch(/book-illustration-reveal/);
    expect(bookCss).toMatch(/book-illustration--revealing/);
  });
});
