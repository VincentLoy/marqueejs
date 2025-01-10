import { MarqueeOptions } from "../../types";
import { ElementFactory } from "../factories/ElementFactory";

export class SeparatorManager {
  private elementFactory: ElementFactory;
  private element: HTMLElement;
  private wrapper: HTMLElement;
  private options: Partial<MarqueeOptions>;
  private isHorizontal: boolean;

  constructor(element: HTMLElement, options: Partial<MarqueeOptions>, wrapper: HTMLElement) {
    this.options = options;
    this.element = element;
    this.wrapper = wrapper;
    this.isHorizontal = ["left", "right"].includes(options.direction!);
    this.elementFactory = new ElementFactory(this.element, this.options);
  }

  public updateSeparators(): void {
    if (!this.options.separator || !this.isHorizontal) return;

    const elements = this.wrapper.querySelectorAll(".marquee-content-item");

    // Create new separators between items
    elements.forEach((el) => {
      const separator = this.elementFactory.createSeparatorElement();
      el.appendChild(separator);
      const elRect = el.getBoundingClientRect();
      const separatorRect = separator.getBoundingClientRect();

      // Position separator in the middle of the gap
      const left = elRect.width - separatorRect.width / 2 + this.options.gap! / 2;
      separator.style.left = `${left}px`;
      separator.style.top = "50%";
      separator.style.lineHeight = "0.70";
      separator.style.willChange = "transform";
      separator.style.transform = "translate3d(0, -50%, 0)";
    });
  }
}
