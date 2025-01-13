/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from "vitest";
import { ElementFactory } from "../../src/core/factories/ElementFactory";
import { MarqueeOptions } from "../../src/types";
import { mock } from "node:test";

describe("ElementFactory", () => {
  const mockElement = document.createElement("div");
  const mockOptions: Partial<MarqueeOptions> = {
    speed: 100,
    direction: "left",
  };

  it("Create a container element", () => {
    const mockElement = document.createElement("div");
    const mockInstanceId = "marquee-123456789";
    const container = ElementFactory.createContainer(mockElement, mockInstanceId); // Actually tested method
    expect(container).toBeInstanceOf(HTMLElement);
    expect(container.tagName).toBe("DIV");
    expect(container.classList.contains("marquee-container")).toBe(true);
    expect(container.classList.contains(mockInstanceId)).toBe(true);
  });

  it("Create a wrapper element", () => {
    const wrapper = ElementFactory.createWrapper(true); // Actually tested method
    expect(wrapper).toBeInstanceOf(HTMLElement);
    expect(wrapper.classList.contains("marquee-wrapper")).toBe(true);
  });

  it("Create a content element", () => {
    const isHorizontal = ["left", "right"].includes(mockOptions.direction!);
    const mockContent = "Hello, world!";
    const content = ElementFactory.createContentElement(mockContent, isHorizontal);
    expect(content).toBeInstanceOf(HTMLElement);
    expect(isHorizontal).toBe(true);
    expect(content.textContent).toBe(mockContent);
  });

  it("Create a separator element", () => {
    const separator = ElementFactory.createSeparatorElement("-", "color: red; opacity: 0.75;");
    const separatorInnerHtml = separator.firstChild as HTMLElement;

    expect(separator.tagName).toBe("SPAN");
    expect(separator.classList.contains("marquee-separator")).toBe(true);
    expect(separator.style.whiteSpace).toBe("pre");

    expect(separatorInnerHtml.style.color).toBe("red");
    expect(separatorInnerHtml.style.opacity).toBe("0.75");
    expect(separatorInnerHtml.tagName).toBe("SPAN");
    expect(separatorInnerHtml.style.display).toBe("inline-block");
    expect(separatorInnerHtml.textContent).toBe("-");
  });
});
