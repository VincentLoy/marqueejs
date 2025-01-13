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

  /**
   * Updates the separator elements between marquee content items.
   * If no separator is defined in options or if the marquee is not horizontal direction, the method returns early.
   * This method first removes all existing separators and then creates new ones between each content item.
   * The separators are positioned based on the direction (left/right) and gap settings from the options.
   *
   * @remarks
   * This method is responsible for:
   * - Cleaning up existing separator elements
   * - Creating new separator elements between items
   * - Positioning separators according to direction and gap settings
   *
   * @throws {Error} Implicitly may throw if DOM operations fail
   */
  public updateSeparators(): void {
    if (!this.options.separator || !this.isHorizontal) return;

    this.cleanupSeparatorElements();
    const elements = this.wrapper.querySelectorAll(".marquee-content-item");
    const isLeftDirection = this.options.direction === "left";

    // Create new separators between items
    elements.forEach((el) => {
      const separator = ElementFactory.createSeparatorElement(
        this.options.separator!,
        this.options.separatorStyles
      );
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
