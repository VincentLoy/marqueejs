import { MarqueeOptions, PositionedElement } from "../../types";

export class PositionManager {
  /**
   * Sets up initial positions for an array of HTML elements, either horizontally or vertically.
   * Each element is positioned sequentially with a specified gap between them.
   *
   * @param elements - Array of HTMLElements to be positioned
   * @param isHorizontal - If true, elements are positioned horizontally; if false, vertically
   * @param gap - The spacing between elements in pixels
   * @returns Array of {@link PositionedElement} containing each element and its position
   *
   * @example
   * ```typescript
   * const elements = document.querySelectorAll('.item');
   * const positionedElements = PositionManager.setupElementsInitialPosition(
   *   Array.from(elements),
   *   true,
   *   10
   * );
   * ```
   */
  public static setupElementsInitialPosition(
    elements: HTMLElement[],
    isHorizontal: boolean,
    gap: number
  ): Array<PositionedElement> {
    let currentPosition = 0;
    let maxSize = 0;

    const positionedElements = elements.map((el): PositionedElement => {
      const size = isHorizontal ? el.offsetWidth + gap : el.offsetHeight + gap;
      const position = currentPosition;

      PositionManager.positionElement(el, position, isHorizontal);

      currentPosition += size;
      maxSize = Math.max(maxSize, size);

      return { el, position };
    });

    return positionedElements;
  }
  /**
   * Positions an HTML element using absolute positioning and CSS transforms.
   * @param element - The HTML element to position
   * @param position - The position value in pixels
   * @param isHorizontal - If true, positions horizontally (X axis). If false/undefined, positions vertically (Y axis)
   * @returns void
   */
  public static positionElement(
    element: HTMLElement,
    position: number,
    isHorizontal?: boolean
  ): void {
    if (!element) return;

    element.style.position = "absolute";
    element.style.willChange = "transform";
    element.style.transform = isHorizontal
      ? `translate3d(${position}px, 0, 0)`
      : `translate3d(0, ${position}px, 0)`;
  }

  /**
   * Positions a separator element relative to a target element with specified spacing and direction.
   *
   * @param target - The reference element to position the separator against
   * @param separator - The separator HTML element to be positioned
   * @param gap - The spacing between the target and separator in pixels
   * @param isLeftDirection - If true, positions separator from the left; if false, positions from the right
   *
   * @remarks
   * This method:
   * - Sets absolute positioning for the separator
   * - Aligns the separator vertically in the middle
   * - Applies performance optimizations using will-change
   * - Uses transform for vertical centering
   */
  public static positionSeparator(
    target: Element,
    separator: HTMLElement,
    gap: number,
    isLeftDirection: boolean
  ): void {
    const targetRect = target.getBoundingClientRect();
    const separatorRect = separator.getBoundingClientRect();
    const position = targetRect.width - separatorRect.width / 2 + gap / 2;

    separator.style.position = "absolute";

    if (isLeftDirection) {
      separator.style.left = `${position}px`;
    } else {
      separator.style.right = `${position}px`;
    }

    separator.style.position = "absolute";
    separator.style.top = "50%";
    separator.style.lineHeight = "0.70";
    separator.style.willChange = "transform";
    separator.style.transform = "translate3d(0, -50%, 0)";
  }

  /**
   * Determines if an element is the furthest positioned element in a given array based on direction
   * @param item - Object containing the HTML element and its position
   * @param elements - Array of positioned elements to compare against
   * @param isHorizontal - Boolean indicating if the movement is horizontal
   * @param direction - Direction of movement ("left", "right", "up", or "down")
   * @returns Boolean indicating if the item is the furthest element in the specified direction
   */
  public static isFurthestElement(
    item: {
      el: HTMLElement;
      position: number;
    },
    elements: Array<PositionedElement>,
    isHorizontal: boolean,
    direction: MarqueeOptions["direction"]
  ): boolean {
    return !elements.some((other) => {
      if (other === item) return false;
      if (isHorizontal) {
        return direction === "left"
          ? item.position >= other.position
          : item.position <= other.position;
      } else {
        return direction === "up"
          ? item.position >= other.position
          : item.position <= other.position;
      }
    });
  }

  /**
   * Determines if a new position is available for an element without overlapping other elements.
   *
   * @param newPosition - The proposed position to check
   * @param currentElement - The HTML element being positioned
   * @param elements - Array of existing positioned elements with their positions
   * @param gap - Minimum space required between elements
   * @param isHorizontal - Direction of the marquee (true for horizontal, false for vertical)
   * @returns True if the position is available, false if it would overlap with existing elements
   *
   * @remarks
   * The function checks if placing an element at the new position would cause overlap with any existing
   * elements, taking into account the specified gap between elements. It ignores collision checks with
   * the current element itself.
   */
  public static isPositionAvailable(
    newPosition: number,
    currentElement: HTMLElement,
    elements: Array<PositionedElement>,
    gap: MarqueeOptions["gap"],
    isHorizontal: boolean
  ): boolean {
    const threshold = gap || 0;
    return !elements.some(({ el, position }) => {
      if (el === currentElement) return false;
      const currentElSizeWatcher = isHorizontal
        ? currentElement.offsetWidth
        : currentElement.offsetHeight;
      const elSizeWatcher = isHorizontal ? el.offsetWidth : el.offsetHeight;

      return (
        newPosition < position + elSizeWatcher + threshold &&
        newPosition + currentElSizeWatcher > position - threshold
      );
    });
  }

  /**
   * Updates the position of a given element within a marquee container.
   *
   * @param item - The element to be positioned with its current position data
   * @param elements - Array of all positioned elements in the marquee
   * @param wrapper - The HTML element wrapping all marquee elements
   * @param movement - The amount of pixels to move the element by
   * @param direction - The direction of movement ("left" | "right" | "up" | "down") type: <MarqueeDirectionValue>
   * @param gap - The spacing between elements
   *
   * @remarks
   * This method handles both horizontal and vertical movement.
   * It calculates new positions based on the direction and checks if the element needs to be repositioned
   * when it goes out of bounds. The actual position update only occurs if the new position is available
   * and the element is the furthest in its direction of travel.
   *
   * The position is applied using CSS transform translate3d for better performance.
   */
  public static updatePosition(
    item: PositionedElement,
    elements: Array<PositionedElement>,
    wrapper: HTMLElement,
    movement: number,
    direction: MarqueeOptions["direction"],
    gap: MarqueeOptions["gap"]
  ): void {
    const isHorizontal = ["left", "right"].includes(direction!);
    const wrapperRefSize = isHorizontal
      ? wrapper.parentElement?.offsetWidth || 0
      : wrapper.parentElement?.offsetHeight || 0;
    const elementRefSize = item.el.offsetWidth;
    const isUpOrLeftDirection = ["left", "up"].includes(direction!);
    let isFurthestElement = false;
    let positionAvailable = false;
    let newPosition = 0;

    if (isUpOrLeftDirection) {
      item.position -= movement;

      if (item.position + elementRefSize < 0) {
        newPosition = wrapperRefSize;
      }
    } else {
      // here direction is right or down
      item.position += movement;

      if (item.position > wrapperRefSize) {
        newPosition = -elementRefSize;
      }
    }

    isFurthestElement = PositionManager.isFurthestElement(item, elements, isHorizontal, direction);
    positionAvailable = PositionManager.isPositionAvailable(
      newPosition,
      item.el,
      elements,
      gap,
      isHorizontal
    );

    if (positionAvailable && isFurthestElement) {
      item.position = newPosition;
    }

    if (isHorizontal) {
      item.el.style.transform = `translate3d(${item.position}px, 0, 0)`;
    } else {
      item.el.style.transform = `translate3d(0, ${item.position}px, 0)`;
    }
  }
}
