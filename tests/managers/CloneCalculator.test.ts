/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { CloneCalculator } from "../../src/core/managers/CloneCalculator";

describe("CloneCalculator", () => {
  let calculator: CloneCalculator;
  let containerElement: HTMLElement;
  let contentElements: HTMLElement[];

  beforeEach(() => {
    calculator = new CloneCalculator("left");

    // Mock container element
    containerElement = document.createElement("div");
    vi.spyOn(containerElement, "offsetWidth", "get").mockReturnValue(1000);
    vi.spyOn(containerElement, "offsetHeight", "get").mockReturnValue(500);

    // Mock content elements
    contentElements = Array.from({ length: 3 }, () => {
      const el = document.createElement("div");
      vi.spyOn(el, "offsetWidth", "get").mockReturnValue(200);
      vi.spyOn(el, "offsetHeight", "get").mockReturnValue(100);
      return el;
    });
  });

  describe("calculateOptimalCloneCount", () => {
    it("should calculate correct number of clones for horizontal scrolling", () => {
      const gap = 20;
      const result = calculator.calculateOptimalCloneCount(containerElement, contentElements, gap);
      // Total content width = (200 + 20) * 3 = 660
      // Container width = 1000
      // Expected clones = ceil(1000/660) + 1 = 3
      expect(result).toBe(3);
    });

    it("should calculate correct number of clones for vertical scrolling", () => {
      calculator = new CloneCalculator("up");
      const gap = 10;
      const result = calculator.calculateOptimalCloneCount(containerElement, contentElements, gap);
      // Total content height = (100 + 10) * 3 = 330
      // Container height = 500
      // Expected clones = ceil(500/330) + 1 = 3
      expect(result).toBe(3);
    });

    it("should use cached metrics when dimensions have not changed", () => {
      const gap = 20;
      const firstResult = calculator.calculateOptimalCloneCount(
        containerElement,
        contentElements,
        gap
      );
      const secondResult = calculator.calculateOptimalCloneCount(
        containerElement,
        contentElements,
        gap
      );
      expect(firstResult).toBe(secondResult);
    });
  });

  describe("invalidateCache", () => {
    it("should force recalculation after cache invalidation", () => {
      const gap = 20;
      calculator.calculateOptimalCloneCount(containerElement, contentElements, gap);
      calculator.invalidateCache();

      // Mock new container size
      vi.spyOn(containerElement, "offsetWidth", "get").mockReturnValue(500);

      const newResult = calculator.calculateOptimalCloneCount(
        containerElement,
        contentElements,
        gap
      );
      // Total content width = (200 + 20) * 3 = 660
      // New container width = 500
      // Expected clones = ceil(500/660) + 1 = 2
      expect(newResult).toBe(2);
    });
  });
});
