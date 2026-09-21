import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  companionPetSprites,
  getCompanionPetPoseUrl,
  type CompanionPetId,
} from './assetRegistry';
import { pets } from '../data/pets';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));

const companionPetFiles: Record<CompanionPetId, string> = {
  pet_griffin: 'assets/pets/companion/pet_griffin/pet_griffin_sid.png',
  pet_humpback_horse:
    'assets/pets/companion/pet_humpback_horse/pet_humpback_horse_sid.png',
  pet_firebird: 'assets/pets/companion/pet_firebird/pet_firebird_sid.png',
};

describe('companionPetSprites', () => {
  it('should ship PNG on disk for every Yaga shop pet', () => {
    for (const pet of pets) {
      const rel = companionPetFiles[pet.id as CompanionPetId];
      expect(rel, `missing file map for ${pet.id}`).toBeDefined();
      expect(existsSync(resolve(root, rel))).toBe(true);
    }
  });

  it('should resolve sid and sleep URLs for each companion', () => {
    for (const id of Object.keys(companionPetSprites) as CompanionPetId[]) {
      const sid = getCompanionPetPoseUrl(id, 'sid');
      const sleep = getCompanionPetPoseUrl(id, 'sleep');
      expect(sid).toBeTruthy();
      expect(sleep).toBeTruthy();
      expect(sid).toContain(companionPetFiles[id].replace('assets/', ''));
    }
  });
});
