// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';

import { swipeThreshold } from '../../config/sceneLayout';
import {
  isSceneInteractiveTarget,
  resolvePanRoomAfterGesture,
} from './useSceneInteraction';

describe('isSceneInteractiveTarget', () => {
  it('should return true when target is inside interactive sprite', () => {
    document.body.innerHTML = `
      <div class="scene-sprite scene-sprite--interactive scene-cat">
        <img class="scene-sprite__img" alt="Кот" />
      </div>
    `;
    const img = document.querySelector('img')!;
    expect(isSceneInteractiveTarget(img)).toBe(true);
  });

  it('should return false for non-interactive sprite', () => {
    document.body.innerHTML = `
      <div class="scene-sprite scene-stove">
        <img class="scene-sprite__img" alt="" />
      </div>
    `;
    const img = document.querySelector('img')!;
    expect(isSceneInteractiveTarget(img)).toBe(false);
  });
});

describe('resolvePanRoomAfterGesture', () => {
  const width = 400;

  it('should not switch room on short tap', () => {
    expect(
      resolvePanRoomAfterGesture(5, swipeThreshold.clickMaxDtMs - 1, width, 1),
    ).toBeNull();
  });

  it('should not switch room on fast micro-move tap', () => {
    expect(resolvePanRoomAfterGesture(2, 1, width, 1)).toBeNull();
  });

  it('should not switch room on swipe (navigation is arrow-only)', () => {
    const dx = -(width * swipeThreshold.distancePercent) / 100;
    expect(resolvePanRoomAfterGesture(dx, 300, width, 1)).toBeNull();
    expect(resolvePanRoomAfterGesture(-dx, 300, width, 2)).toBeNull();
    expect(resolvePanRoomAfterGesture(-dx, 300, width, 1)).toBeNull();
  });
});
