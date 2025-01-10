/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from "vitest";
import { ElementFactory } from "../../src/core/factories/ElementFactory";
import { MarqueeOptions } from "../../src/types";

describe("ElementFactory", () => {
  const mockElement = document.createElement("div");
  const mockOptions: Partial<MarqueeOptions> = {
    speed: 100,
    direction: "left",
  };

  it("Initialize with correct properties", () => {
    const factory = new ElementFactory(mockElement, mockOptions);
    expect(factory).toBeDefined();
    expect(factory["isHorizontal"]).toBe(true);
  });

  it("Create a container element", () => {
    const factory = new ElementFactory(mockElement, mockOptions);
    const container = factory.createContainer(); // Actually tested method
    expect(container).toBeInstanceOf(HTMLElement);
    expect(container.tagName).toBe("DIV");
    expect(container.classList.contains("marquee-container")).toBe(true);
  });

  it("Create a wrapper element", () => {
    const factory = new ElementFactory(mockElement, mockOptions);
    const wrapper = factory.createWrapper(); // Actually tested method
    expect(wrapper).toBeInstanceOf(HTMLElement);
    expect(wrapper.classList.contains("marquee-wrapper")).toBe(true);
  });

  it("Create a content element", () => {
    const factory = new ElementFactory(mockElement, mockOptions);
    const content = factory.createContentElement("Hello, world!");
    expect(content).toBeInstanceOf(HTMLElement);
    expect(content.textContent).toBe("Hello, world!");
  });

  it("Create a separator element", () => {
    const factory = new ElementFactory(mockElement, mockOptions);
    const separator = factory.createSeparatorElement();
    const separatorInnerHtml = separator.firstChild as HTMLElement;

    expect(separator.tagName).toBe("SPAN");
    expect(separator.classList.contains("marquee-separator")).toBe(true);
    expect(separator.style.position).toBe("absolute");
    expect(separator.style.whiteSpace).toBe("pre");

    expect(separatorInnerHtml.tagName).toBe("SPAN");
    expect(separatorInnerHtml.style.display).toBe("inline-block");
  });
});
