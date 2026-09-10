import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const css = readFileSync(resolve(root, 'src/ui/index.css'), 'utf8');
const gameHud = readFileSync(resolve(root, 'src/ui/scene/GameHud.tsx'), 'utf8');

function ruleBody(selector: string, source: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`));
  expect(match, `missing CSS rule ${selector}`).toBeTruthy();
  return match![1];
}

function widthPercentsFor(selector: string): number[] {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`${escaped}\\s*\\{([^}]+)\\}`, 'g');
  const widths: number[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(css))) {
    for (const prop of match[1].matchAll(/(?:min-)?width:\s*([\d.]+)%/g)) {
      widths.push(Number(prop[1]));
    }
  }
  return widths;
}

function cssRuleBlocks(source: string): { selector: string; body: string }[] {
  const rules: { selector: string; body: string }[] = [];
  const re = /([^{}]+)\{([^}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(source))) {
    rules.push({ selector: match[1].replace(/\s+/g, ' ').trim(), body: match[2] });
  }
  return rules;
}

describe('TASK-038 chest floor CSS contract', () => {
  it('should put perspective and pointer-events none on chest floor', () => {
    const body = ruleBody('.scene-chest-floor', css);
    expect(body).toMatch(/perspective/);
    expect(body).toMatch(/pointer-events:\s*none/);
  });

  it('should not park chest floor at bottom 100% or blend it', () => {
    const body = ruleBody('.scene-chest-floor', css);
    expect(body).not.toMatch(/bottom:\s*100%/);
    expect(body).not.toMatch(/mix-blend-mode/);
  });

  it('should anchor chest floor in front of the sprite via top 100%, not bottom 0', () => {
    const body = ruleBody('.scene-chest-floor', css);
    expect(body).toMatch(/top:\s*(?:100%|calc\(\s*100%)/);
    expect(body).not.toMatch(/bottom:\s*0/);
    expect(body).not.toMatch(/bottom:\s*100%/);
  });

  it('should rotate chest floor plate from top origin', () => {
    const body = ruleBody('.scene-chest-floor__plate', css);
    expect(body).toMatch(/rotateX/);
    expect(body).toMatch(/transform-origin:[^;]*top/);
  });

  it('should drive chest floor fill from --chest-progress variable', () => {
    const body = ruleBody('.scene-chest-floor__fill', css);
    expect(body).toMatch(/var\(--chest-progress/);
  });

  it('should not keep scene-chest__timer at bottom 100% above the lid', () => {
    const escaped = '.scene-chest__timer'.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`));
    const body = match?.[1] ?? '';
    expect(body).not.toMatch(/bottom:\s*100%/);
  });

  it('should not inflate regular chest width beyond 6.8%', () => {
    const widths = [
      ...widthPercentsFor('.scene-chest-regular'),
      ...widthPercentsFor('.scene-chest-wrap.scene-chest-regular'),
    ];
    for (const width of widths) {
      expect(width).toBeLessThanOrEqual(6.8);
    }
  });

  it('should not inflate miracle chest width beyond 6.8%', () => {
    const widths = [
      ...widthPercentsFor('.scene-chest-miracle'),
      ...widthPercentsFor('.scene-chest-wrap.scene-chest-miracle'),
    ];
    for (const width of widths) {
      expect(width).toBeLessThanOrEqual(6.8);
    }
  });

  it('should not restore hud-miracle in GameHud', () => {
    expect(gameHud).not.toMatch(/hud-miracle/);
  });

  it('should keep miracle hue-rotate on sprite img when ready and glow classes combine', () => {
    const combined = cssRuleBlocks(css).filter(
      (rule) =>
        rule.selector.includes('scene-chest-miracle--glow') &&
        rule.selector.includes('scene-chest--ready') &&
        rule.selector.includes('scene-sprite__img'),
    );
    expect(
      combined.length,
      'need one rule whose selector has miracle--glow, --ready, and .scene-sprite__img',
    ).toBeGreaterThan(0);
    expect(combined.some((rule) => /hue-rotate/.test(rule.body))).toBe(true);
  });

  it('should keep hue-rotate in every chest-miracle-ready-glow keyframe', () => {
    const start = css.indexOf('@keyframes chest-miracle-ready-glow');
    expect(start).toBeGreaterThanOrEqual(0);
    const block = css.slice(start, start + 600);
    expect(block).toMatch(/0%,\s*\n?\s*100%\s*\{[^}]*hue-rotate/);
    expect(block).toMatch(/50%\s*\{[^}]*hue-rotate/);
  });

  it('should give progress floor a taller plate for visible fill', () => {
    const progress = ruleBody('.scene-chest-floor--progress .scene-chest-floor__plate', css);
    expect(progress).toMatch(/min-height:\s*30px/);
  });

  it('should style regular chest timer digits like cat zzz without plate background', () => {
    const label = ruleBody('.scene-chest-floor--timer .scene-chest-floor__label--zzz', css);
    expect(label).toMatch(/font-weight:\s*700/);
    expect(label).toMatch(/#e8e0d0/);
    expect(label).toMatch(/text-shadow:\s*0 1px 2px rgba\(0,\s*0,\s*0,\s*0\.6\)/);
    expect(label).toMatch(/rotateX/);
    expect(label).toMatch(/rotate\(-12deg\)/);
    expect(label).toMatch(/transform-origin:[^;]*top/);
    expect(label).toMatch(/background:\s*none/);
    const timerFloor = ruleBody('.scene-chest-floor--timer', css);
    expect(timerFloor).not.toMatch(/perspective:\s*none/);
    expect(css).not.toMatch(
      /\.scene-chest-floor--timer\s+\.scene-chest-floor__plate\s*\{/,
    );
  });
});
