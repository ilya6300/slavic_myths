import { describe, expect, it } from 'vitest';

import {
  getSkinGrade,
  getWindowSkinIdsByGrade,
} from './skinPools';

describe('skinPools window skins', () => {
  it('should expose chest window skins by grade', () => {
    expect(getWindowSkinIdsByGrade('common')).toEqual(['landscape_omut']);
    expect(getWindowSkinIdsByGrade('rare')).toEqual(['landscape_temnyy_les']);
    expect(getWindowSkinIdsByGrade('epoch')).toEqual(
      expect.arrayContaining(['landscape_omut', 'landscape_cyber_city']),
    );
    expect(getWindowSkinIdsByGrade('epic')).toEqual([]);
  });

  it('should not include default forest in chest pool', () => {
    for (const grade of ['common', 'rare', 'epic', 'epoch'] as const) {
      expect(getWindowSkinIdsByGrade(grade)).not.toContain('landscape_standart');
    }
  });

  it('should resolve display grades for profile frames', () => {
    expect(getSkinGrade('window', 'landscape_standart')).toBe('common');
    expect(getSkinGrade('window', 'landscape_temnyy_les')).toBe('rare');
    expect(getSkinGrade('window', 'landscape_omut')).toBe('common');
    expect(getSkinGrade('window', 'landscape_cyber_city')).toBe('epoch');
  });
});
