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
): { energy: number; lastEnergyAt: number } {
  if (energy >= maxEnergy) {
    return { energy, lastEnergyAt: now };
  }

  const elapsedMs = Math.max(0, now - lastEnergyAt);
  const gained = Math.floor((elapsedMs / MS_PER_MINUTE) * ENERGY_REGEN_PER_MINUTE);

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
