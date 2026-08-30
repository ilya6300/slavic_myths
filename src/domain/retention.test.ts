import { describe, expect, it } from 'vitest';
import {
  shouldShowChestReadyFootnote,
  shouldShowCloudBanner,
} from './retention';

describe('retention', () => {
  it('should show cloud banner after first chest when not authorized', () => {
    expect(shouldShowCloudBanner(true, false, false)).toBe(true);
    expect(shouldShowCloudBanner(false, false, false)).toBe(false);
    expect(shouldShowCloudBanner(true, true, false)).toBe(false);
    expect(shouldShowCloudBanner(true, false, true)).toBe(false);
  });

  it('should show chest ready footnote when chest is ready after onboarding', () => {
    expect(shouldShowChestReadyFootnote(true, true, true)).toBe(true);
    expect(shouldShowChestReadyFootnote(false, true, true)).toBe(false);
    expect(shouldShowChestReadyFootnote(true, true, false)).toBe(false);
  });
});
