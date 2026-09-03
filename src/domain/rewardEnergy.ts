/** Наградная энергия — без потолка maxEnergy (plan: over-cap только от наград). */
export function addRewardEnergy(energy: number, amount: number): number {
  return energy + amount;
}
