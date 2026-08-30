import { describe, expect, it } from 'vitest';
import {
  BOOK_OPEN_ASPECT,
  BOOK_OPEN_PIXEL_HEIGHT,
  BOOK_OPEN_PIXEL_WIDTH,
  SCENE_BOOK_WIDTH_VW,
} from './bookStage';

describe('TASK-019 bookStage', () => {
  it('should match the measured open-book PNG aspect 902/723', () => {
    expect(BOOK_OPEN_PIXEL_WIDTH).toBe(902);
    expect(BOOK_OPEN_PIXEL_HEIGHT).toBe(723);
    expect(BOOK_OPEN_ASPECT).toBeCloseTo(902 / 723, 5);
    expect(BOOK_OPEN_ASPECT).toBeCloseTo(1.248, 3);
  });

  it('should pin the closed book on the scene to 9vw', () => {
    expect(SCENE_BOOK_WIDTH_VW).toBe(9);
  });
});
