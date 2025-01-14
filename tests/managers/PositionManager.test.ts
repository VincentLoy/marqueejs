/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { PositionManager } from "../../src/core/managers/PositionManager";
import { PositionedElement } from "../../src/types";
import { mock } from "node:test";

describe("PositionManager", () => {
  let elements: HTMLElement[];
  let wrapper: HTMLElement;
  const mockBoundingClientRect = {
    width: 100,
    height: 50,
    top: 0,
    left: 0,
    right: 100,
    bottom: 50,
    x: 0,
    y: 0,
    toJSON: () => {},
  };

  beforeEach(() => {
    wrapper = document.createElement("div");
    wrapper.style.width = "500px";
    wrapper.style.height = "200px";
    document.body.appendChild(wrapper);

    elements = Array.from({ length: 3 }, () => {
      const el = document.createElement("div");
      wrapper.appendChild(el);
      return el;
    });
  });

  describe("setupElementsInitialPosition", () => {
    it("should position elements horizontally with gaps", () => {
      // Mock getBoundingClientRect for horizontal layout
      elements.forEach((el) => {
        vi.spyOn(el, "getBoundingClientRect").mockImplementation(() => mockBoundingClientRect);
      });

      const positioned = PositionManager.setupElementsInitialPosition(elements, true, 10);

      expect(positioned).toHaveLength(3);
      expect(positioned[0].position).toBe(0);
      expect(positioned[1].position).toBe(110); // 100px + 10px gap
      expect(positioned[2].position).toBe(220); // (100px + 10px) * 2
    });

    it("should position elements vertically with gaps", () => {
      // Mock getBoundingClientRect for vertical layout
      elements.forEach((el) => {
        vi.spyOn(el, "getBoundingClientRect").mockImplementation(() => mockBoundingClientRect);
      });

      const positioned = PositionManager.setupElementsInitialPosition(elements, false, 10);

      expect(positioned).toHaveLength(3);
      expect(positioned[0].position).toBe(0);
      expect(positioned[1].position).toBe(60); // 50px + 10px gap
      expect(positioned[2].position).toBe(120); // (50px + 10px) * 2
    });
  });

  describe("positionElement", () => {
    it("should set correct horizontal position", () => {
      const element = document.createElement("div");
      PositionManager.positionElement(element, 100, true);

      expect(element.style.transform).toBe("translate3d(100px, 0, 0)");
      expect(element.style.position).toBe("absolute");
    });

    it("should set correct vertical position", () => {
      const element = document.createElement("div");
      PositionManager.positionElement(element, 100, false);

      expect(element.style.transform).toBe("translate3d(0, 100px, 0)");
      expect(element.style.position).toBe("absolute");
    });
  });

  describe("isFurthestElement", () => {
    it("should identify furthest element when moving left", () => {
      const items: PositionedElement[] = [
        { el: elements[0], position: 0 },
        { el: elements[1], position: 100 },
        { el: elements[2], position: 200 },
      ];

      expect(PositionManager.isFurthestElement(items[0], items, true, "left")).toBe(true);
      expect(PositionManager.isFurthestElement(items[2], items, true, "left")).toBe(false);
    });

    it("should identify furthest element when moving right", () => {
      const items: PositionedElement[] = [
        { el: elements[0], position: 0 },
        { el: elements[1], position: 100 },
        { el: elements[2], position: 200 },
      ];

      expect(PositionManager.isFurthestElement(items[2], items, true, "right")).toBe(true);
      expect(PositionManager.isFurthestElement(items[0], items, true, "right")).toBe(false);
    });

    it("should identify furthest element when moving up", () => {
      const items: PositionedElement[] = [
        { el: elements[0], position: 0 },
        { el: elements[1], position: 100 },
        { el: elements[2], position: 200 },
      ];

      expect(PositionManager.isFurthestElement(items[0], items, false, "up")).toBe(true);
      expect(PositionManager.isFurthestElement(items[2], items, false, "up")).toBe(false);
    });

    it("should identify furthest element when moving down", () => {
      const items: PositionedElement[] = [
        { el: elements[0], position: 0 },
        { el: elements[1], position: 100 },
        { el: elements[2], position: 200 },
      ];

      expect(PositionManager.isFurthestElement(items[0], items, false, "down")).toBe(false);
      expect(PositionManager.isFurthestElement(items[2], items, false, "down")).toBe(true);
    });
  });

  describe("isPositionAvailable", () => {
    it("should detect position availability correctly", () => {
      const items: PositionedElement[] = [
        { el: elements[0], position: 0 },
        { el: elements[1], position: 150 },
        { el: elements[2], position: 300 },
      ];

      expect(PositionManager.isPositionAvailable(200, elements[0], items, 10, true)).toBe(true);
      expect(PositionManager.isPositionAvailable(145, elements[0], items, 10, true)).toBe(false);
    });
  });
});
