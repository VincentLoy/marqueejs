import { MarqueeOptions } from "../../types";
import { ElementFactory } from "../factories/ElementFactory";
import { PositionManager } from "./PositionManager";

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

    this.cleanupSeparatorElements();
    const elements = this.wrapper.querySelectorAll(".marquee-content-item");
    const isLeftDirection = this.options.direction === "left";

    // Create new separators between items
    elements.forEach((el) => {
      const separator = this.elementFactory.createSeparatorElement();
      el.appendChild(separator);
      PositionManager.positionSeparator(el, separator, this.options.gap!, isLeftDirection);
    });
  }

  /**
   * Removes all separator elements from the DOM that have the 'marquee-separator' class.
   * @returns {void}
   */
  public cleanupSeparatorElements(): void {
    const separators = this.wrapper.querySelectorAll(".marquee-separator");
    separators?.forEach((separator) => separator.remove());
  }
}
