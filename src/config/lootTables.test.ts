import { describe, expect, it } from 'vitest';
import {
  LOOT_POOL_TOTAL,
  pickRegularChestTypeForGrade,
  regularChestGradeWeights,
  regularChestTypeWeightsByGrade,
} from './lootTables';

describe('lootTables', () => {
  it('should sum grade weights to LOOT_POOL_TOTAL', () => {
    const sum = Object.values(regularChestGradeWeights).reduce((a, b) => a + b, 0);
    expect(sum).toBe(LOOT_POOL_TOTAL);
  });

  it('should not include epoch titles in common chest type pools', () => {
    for (const grade of Object.keys(regularChestTypeWeightsByGrade)) {
      const weights = regularChestTypeWeightsByGrade[grade as keyof typeof regularChestTypeWeightsByGrade];
      expect(weights).not.toHaveProperty('title_epoch');
    }
  });

  it('should pick a reward type for each grade', () => {
    expect(pickRegularChestTypeForGrade('common', () => 0)).toBe('cat_skin');
    expect(pickRegularChestTypeForGrade('epoch', () => 0.99)).toBeTruthy();
  });
});
