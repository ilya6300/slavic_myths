/**
 * Реген энергии по lastEnergyAt.
 */

import { ENERGY_REGEN_PER_MINUTE } from '../config/gameConstants';

const MS_PER_MINUTE = 60_000;

export function applyEnergyRegen(
  energy: number,
  maxEnergy: number,
  lastEnergyAt: number,
  now: number = Date.now(),
  regenBonusPercent: number = 0,
): { energy: number; lastEnergyAt: number } {
  if (energy >= maxEnergy) {
    return { energy, lastEnergyAt: now };
  }

  const elapsedMs = Math.max(0, now - lastEnergyAt);
  const ratePerMinute =
    ENERGY_REGEN_PER_MINUTE * (1 + Math.max(0, regenBonusPercent) / 100);
  const gained = Math.floor((elapsedMs / MS_PER_MINUTE) * ratePerMinute);

  if (gained <= 0) {
    return { energy, lastEnergyAt };
  }

  const newEnergy = Math.min(maxEnergy, energy + gained);
  const consumedMs = Math.min(elapsedMs, gained * MS_PER_MINUTE);

  return {
    energy: newEnergy,
    lastEnergyAt: lastEnergyAt + consumedMs,
  };
}
