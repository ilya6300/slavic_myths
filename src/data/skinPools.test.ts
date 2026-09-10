import { describe, expect, it } from 'vitest';

import {
  getCatSkinIdsByGrade,
  getIzbaSkinIdsByGrade,
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

  it('should not include IAP-only cat_pilgrim in chest pool', () => {
    for (const grade of ['common', 'rare', 'epic', 'epoch'] as const) {
      expect(getCatSkinIdsByGrade(grade)).not.toContain('cat_pilgrim');
    }
  });

  it('should not include quest-only landscape_yaga in chest pool', () => {
    for (const grade of ['common', 'rare', 'epic', 'epoch'] as const) {
      expect(getWindowSkinIdsByGrade(grade)).not.toContain('landscape_yaga');
    }
  });

  it('should not include quest-only hut_harmony in chest pool', () => {
    for (const grade of ['common', 'rare', 'epic', 'epoch'] as const) {
      expect(getIzbaSkinIdsByGrade(grade)).not.toContain('hut_harmony');
    }
    expect(getSkinGrade('izba', 'hut_harmony')).toBe('epic');
  });

  it('should resolve display grades for profile frames', () => {
    expect(getSkinGrade('window', 'landscape_standart')).toBe('common');
    expect(getSkinGrade('window', 'landscape_temnyy_les')).toBe('rare');
    expect(getSkinGrade('window', 'landscape_omut')).toBe('common');
    expect(getSkinGrade('window', 'landscape_cyber_city')).toBe('epoch');
    expect(getSkinGrade('window', 'landscape_yaga')).toBe('epoch');
  });
});
