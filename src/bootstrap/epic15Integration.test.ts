import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { SPIRIT_ORDER } from '../data/spirits';
import { izbaEffects } from '../data/izbaEffects';
import { FRAGMENT_SPIRIT_ORDER } from '../config/fragmentSpiritOrder';
import { spirits } from '../data/spirits';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));

describe('Epic 15 integration contracts', () => {
  it('should keep 18 spirits with yarilo and perun after chudo_yudo', () => {
    expect(SPIRIT_ORDER).toHaveLength(18);
    const yudo = SPIRIT_ORDER.indexOf('chudo_yudo');
    expect(SPIRIT_ORDER[yudo + 1]).toBe('yarilo');
    expect(SPIRIT_ORDER[yudo + 2]).toBe('perun');
    expect(FRAGMENT_SPIRIT_ORDER.at(-2)).toBe('yarilo');
    expect(FRAGMENT_SPIRIT_ORDER.at(-1)).toBe('perun');
  });

  it('should expose thunder_izba in izbaEffects catalog', () => {
    const thunder = izbaEffects.find((e) => e.id === 'thunder_izba');
    expect(thunder).toBeDefined();
  });

  it('should map 17 trophy spirits including yarilo and perun', () => {
    const trophySpirits = spirits.filter((s) => s.hasTrophy);
    expect(trophySpirits).toHaveLength(17);
    expect(trophySpirits.map((s) => s.id)).toContain('yarilo');
    expect(trophySpirits.map((s) => s.id)).toContain('perun');
  });

  it('should grant atmosphere_only reward for perun', () => {
    const perun = spirits.find((s) => s.id === 'perun');
    expect(perun?.reward.kind).toBe('atmosphere_only');
    if (perun?.reward.kind === 'atmosphere_only') {
      expect(perun.reward.effectId).toBe('thunder_izba');
    }
  });

  it('should keep atmosphere tab and FX layer in profile and scene', () => {
    const profile = readFileSync(resolve(root, 'src/ui/profile/ProfileModal.tsx'), 'utf8');
    expect(profile).toMatch(/atmosphere/i);
    const css = readFileSync(resolve(root, 'src/ui/index.css'), 'utf8');
    expect(css).toMatch(/izba-scene--effect-thunder/);
    expect(css).toMatch(/pointer-events:\s*none/);
  });
});
