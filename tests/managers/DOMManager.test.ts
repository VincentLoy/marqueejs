/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { DOMManager } from "../../src/core/managers/DOMManager";
import { MarqueeDirectionValue, MarqueeOptions } from "../../src/types";
describe("DOMManager", () => {
  let element: HTMLElement;
  let options: Partial<MarqueeOptions>;
  let domManager: DOMManager;

  beforeEach(() => {
    element = document.createElement("div");
    element.innerHTML = "<div>Test Content</div>";
    document.body.appendChild(element);

    options = {
      direction: "left",
      contentList: ["Item 1", "Item 2", "Item 3"],
      gap: 20,
      cloneCount: 2,
      containerHeight: 100,
    };

    domManager = new DOMManager(element, options);
  });

  it("should initialize with correct properties", () => {
    expect(domManager).toBeDefined();
    const container = domManager.getContainer();
    const wrapper = domManager.getWrapper();

    expect(container).toBeInstanceOf(HTMLElement);
    expect(wrapper).toBeInstanceOf(HTMLElement);
    expect(container.contains(wrapper)).toBe(true);
  });

  it("should create content elements from contentList", async () => {
    await domManager.createContentElements();
    const contentElements = domManager.getContentElements();

    expect(contentElements.length).toBe(options.contentList!.length);
    contentElements.forEach((el) => {
      expect(el.classList.contains("marquee-content-item")).toBe(true);
    });
  });

  it("should set container height based on options", () => {
    // Test vertical direction
    const verticalOptions = { ...options, direction: "up" as MarqueeDirectionValue };
    const verticalManager = new DOMManager(element, verticalOptions);
    expect(verticalManager.getContainer().style.height).toBe(`${options.containerHeight}px`);
  });

  it("should create clones when cloneCount is specified", async () => {
    await domManager.createContentElements();
    const wrapper = domManager.getWrapper();
    const clones = wrapper.querySelectorAll(".marquee-cloned-item");

    expect(clones.length).toBe(options.contentList!.length * (options.cloneCount! as number));
    clones.forEach((clone) => {
      expect(clone.getAttribute("aria-hidden")).toBe("true");
    });
  });

  it("should cleanup properly on destroy", () => {
    domManager.destroy();
    expect(document.body.contains(domManager.getContainer())).toBe(false);
    expect(element.innerHTML).toBe("");
  });

  it("should handle recalculation of clones", async () => {
    await domManager.createContentElements();
    const initialClones = domManager.getWrapper().querySelectorAll(".marquee-cloned-item");
    const initialCount = initialClones.length;

    initialClones.forEach((clone) => {
      clone.remove();
    });

    expect(domManager.getWrapper().querySelectorAll(".marquee-cloned-item").length).toBe(0);

    domManager.recalculateClones();
    const newClones = domManager.getWrapper().querySelectorAll(".marquee-cloned-item");

    expect(newClones.length).toBe(initialCount);
  });
});
