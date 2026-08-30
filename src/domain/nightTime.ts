/**
 * Локальное время суток для ночного overlay.
 * Канон: gameConstants NIGHT_START_HOUR / NIGHT_END_HOUR
 */

import { NIGHT_END_HOUR, NIGHT_START_HOUR } from '../config/gameConstants';

export function isNightTime(date: Date = new Date()): boolean {
  const hour = date.getHours();
  if (NIGHT_START_HOUR > NIGHT_END_HOUR) {
    return hour >= NIGHT_START_HOUR || hour < NIGHT_END_HOUR;
  }
  return hour >= NIGHT_START_HOUR && hour < NIGHT_END_HOUR;
}
