/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach } from "vitest";
import { SeparatorManager } from "../../src/core/managers/SeparatorManager";
import { ElementFactory } from "../../src/core/factories/ElementFactory";
import { MarqueeOptions } from "../../src/types";

describe("SeparatorManager", () => {
  let element: HTMLElement;
  let wrapper: HTMLElement;
  let options: Partial<MarqueeOptions>;
  let separatorManager: SeparatorManager;

  beforeEach(() => {
    element = document.createElement("div");

    wrapper = document.createElement("div");
    element.appendChild(wrapper);

    // Ajoute des éléments simulés au wrapper
    for (let i = 0; i < 3; i++) {
      const contentItem = document.createElement("div");
      contentItem.classList.add("marquee-content-item");
      contentItem.style.width = "100px"; // Largeur simulée
      contentItem.style.height = "50px"; // Hauteur simulée
      wrapper.appendChild(contentItem);
    }

    options = {
      direction: "left",
      separator: "--",
      gap: 20,
    };

    separatorManager = new SeparatorManager(options, wrapper);
  });

  it("Initialize with correct properties", () => {
    expect(separatorManager).toBeDefined();
    expect((separatorManager as any).isHorizontal).toBe(true);
    expect((separatorManager as any).options).toEqual(options);
  });

  it("Add separators between content items", () => {
    separatorManager.updateSeparators();

    const contentItems = wrapper.querySelectorAll(".marquee-content-item");
    contentItems.forEach((item) => {
      const separator = item.querySelector(".marquee-separator") as HTMLElement;
      expect(separator).toBeInstanceOf(HTMLElement);
      expect(separator!.style.left).toBeDefined();
      expect(separator!.style.top).toBe("50%");
      expect(separator!.style.transform).toBe("translate3d(0, -50%, 0)");
    });
  });

  it("Should add one separator for each content item", () => {
    separatorManager.updateSeparators();

    const contentItems = wrapper.querySelectorAll(".marquee-content-item");
    const separators = wrapper.querySelectorAll(".marquee-separator");
    expect(separators.length).toBeGreaterThan(0);
    expect(contentItems.length).toBe(separators.length);
  });

  it("Should not add separators if separator not set", () => {
    let opt: Partial<MarqueeOptions> = {
      direction: "up",
    };
    let sep = new SeparatorManager(opt, wrapper);
    sep.updateSeparators();

    const separators = wrapper.querySelectorAll(".marquee-separator");
    expect(separators.length).toBe(0);
  });

  it("Should cleanup separators", () => {
    // Call cleanup when no separators exist
    separatorManager.cleanupSeparatorElements();

    const separators = wrapper.querySelectorAll(".marquee-separator");
    expect(separators.length).toBe(0);
  });
});
