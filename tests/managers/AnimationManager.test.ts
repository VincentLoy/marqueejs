/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { AnimationManager } from "../../src/core/managers/AnimationManager";
import { MarqueeOptions, MarqueeDirectionValue } from "../../src/types";
describe("AnimationManager", () => {
  let wrapper: HTMLElement;
  let options: Partial<MarqueeOptions>;
  let animationManager: AnimationManager;

  beforeEach(() => {
    wrapper = document.createElement("div");

    // Add sample elements to wrapper
    for (let i = 0; i < 3; i++) {
      const contentItem = document.createElement("div");
      contentItem.classList.add("marquee-content-item");
      contentItem.style.width = "100px";
      contentItem.style.height = "50px";
      wrapper.appendChild(contentItem);
    }

    options = {
      direction: "left",
      speed: 100,
      gap: 20,
    };

    animationManager = new AnimationManager(wrapper, options);
  });

  it("Initialize with correct properties", () => {
    expect(animationManager).toBeDefined();
    expect((animationManager as any).isHorizontal).toBe(true);
    expect((animationManager as any).options).toEqual(options);
    expect(animationManager.isPlaying()).toBe(false);
  });

  it("Should start animation correctly", () => {
    animationManager.startAnimation();
    expect(animationManager.isPlaying()).toBe(true);
    expect((animationManager as any).animationFrame).toBeDefined();
    expect((animationManager as any).lastTime).toBeGreaterThan(0);
  });

  it("Should stop animation correctly", () => {
    animationManager.startAnimation();
    animationManager.stopAnimation();
    expect(animationManager.isPlaying()).toBe(false);
    expect((animationManager as any).animationFrame).toBeNull();
    expect((animationManager as any).lastTime).toBe(0);
  });

  it("Should recalculate positions", () => {
    const setupElementsSpy = vi.spyOn(animationManager as any, "setupElements");
    animationManager.recalculatePositions();
    expect(setupElementsSpy).toHaveBeenCalled();
  });

  it("Should handle vertical direction", () => {
    const verticalOptions: Partial<MarqueeOptions> = {
      direction: "up" as MarqueeDirectionValue,
      speed: 100,
      gap: 20,
    };
    const verticalManager = new AnimationManager(wrapper, verticalOptions);
    expect((verticalManager as any).isHorizontal).toBe(false);
  });
});
