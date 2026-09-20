/**
 * Питомцы лавки Яги — каталог (draft §6).
 */

import type { LocalizedText } from '../i18n/types';

const L = (ru: string, en: string, tr: string): LocalizedText => ({ ru, en, tr });

export const YAGA_PET_PRICE_CRUMBS = 25;

export const pets = [
  {
    id: 'pet_griffin',
    name: L('Грифон', 'Griffin', 'Grifon'),
    description: L(
      'Сторож резьбы: сидит у книги или порога, не кликабельный.',
      'Guardian of carvings: sits by the book or threshold, not clickable.',
      'Oyma bekçisi: kitabın veya eşikte, tıklanamaz.',
    ),
    sceneClassName: 'scene-pet--griffin',
  },
  {
    id: 'pet_humpback_horse',
    name: L('Конёк-Горбунок', 'Humpback Horse', 'Huşatı At'),
    description: L(
      'Крошечный спутник у кота, топчется рядом.',
      'Tiny companion by the cat, trotting nearby.',
      'Kedinin yanında minik yoldaş.',
    ),
    sceneClassName: 'scene-pet--humpback',
  },
  {
    id: 'pet_firebird',
    name: L('Жар-птица', 'Firebird', 'Ateş Kuşu'),
    description: L(
      'Тёплый свет у рамы или на печи; свечение у птицы, не FX избы.',
      'Warm glow by the frame or stove; light on the bird, not hut FX.',
      'Çerçeve veya ocakta sıcak ışık; kuşta parıltı, izba FX değil.',
    ),
    sceneClassName: 'scene-pet--firebird',
  },
] as const;

export type PetId = (typeof pets)[number]['id'];

export function getPetById(id: string) {
  return pets.find((p) => p.id === id);
}
