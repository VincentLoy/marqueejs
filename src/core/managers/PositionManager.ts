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
      const boudingRect = el.getBoundingClientRect();
      const size = isHorizontal ? boudingRect.width + gap : boudingRect.height + gap;
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

    element.style.position = "relative";
    element.style.flexShrink = "0";
    // element.style.transform = isHorizontal
    //   ? `translate3d(${position}px, 0, 0)`
    //   : `translate3d(0, ${position}px, 0)`;
    // element.style.position = "absolute";
    // element.style.willChange = "transform";
    // element.style.transform = isHorizontal
    //   ? `translate3d(${position}px, 0, 0)`
    //   : `translate3d(0, ${position}px, 0)`;
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

  public static moveElementToOppositeEdge(
    el: Element,
    direction: MarqueeOptions["direction"],
    parent: HTMLElement
  ) {
    const isUpOrLeftDirection = ["left", "up"].includes(direction!);
    if (isUpOrLeftDirection) {
      parent.appendChild(el);
    } else {
      parent.insertBefore(el, parent.firstChild);
    }
  }

  private static shouldMoveElement(
    el: Element,
    isHorizontal: boolean,
    isUpOrLeftDirection: boolean,
    gap: number,
    parentPosition: number
  ) {
    const securityMargin = 0;
    const elRect = el.getBoundingClientRect();
    const elSize = isHorizontal ? elRect.width : elRect.height;
    if (isUpOrLeftDirection) {
      const elPosition = parentPosition + securityMargin;
      return elPosition + elSize + gap! < 0;
    } else {
      return parentPosition + elSize + gap! > 0;
    }
  }

  /**
   * Updates the position of a given element within a marquee container.
   *
   * @param item - The element to be positioned with its current position data
   * @param elements - Array of all positioned elements in the marquee
   * @param container - The HTML element wrapping animated element
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
    animatedElt: HTMLElement,
    elements: Element[],
    container: HTMLElement,
    movement: number,
    direction: MarqueeOptions["direction"],
    gap: MarqueeOptions["gap"],
    updateLastTime: () => void
  ): void {
    const isHorizontal = ["left", "right"].includes(direction!);
    const containerBoundingRect = container.getBoundingClientRect();
    const containerRefSize = isHorizontal
      ? containerBoundingRect.width || 0
      : containerBoundingRect.height || 0;
    const animatedEltBoundingRect = animatedElt.getBoundingClientRect();
    const elementRefSize = isHorizontal
      ? animatedEltBoundingRect.width + gap!
      : animatedEltBoundingRect.height;
    const isUpOrLeftDirection = ["left", "up"].includes(direction!);
    let currentPosition = 0;
    let position = animatedEltBoundingRect.x;
    let shouldMove = false;

    const transformValues = animatedElt.style.transform
      .match(/\((.*?)\)/)?.[1]
      ?.split(",")
      .map((n) => parseFloat(n)) || [0, 0, 0];
    const speed = movement; // Convert speed to px/frame assuming 60fps

    if (isHorizontal) {
      currentPosition = transformValues[0];
    } else {
      currentPosition = transformValues[1];
    }

    if (isUpOrLeftDirection) {
      position = currentPosition - speed;
      shouldMove = this.shouldMoveElement(
        animatedElt.firstChild as Element,
        isHorizontal,
        isUpOrLeftDirection,
        gap!,
        position
      );

      if (shouldMove) {
        this.moveElementToOppositeEdge(animatedElt.firstChild as Element, direction, animatedElt);
        position = 0;
        // updateLastTime();
      }
    } else {
      position = currentPosition + speed;
      shouldMove = this.shouldMoveElement(
        animatedElt.lastChild as Element,
        isHorizontal,
        isUpOrLeftDirection,
        gap!,
        position
      );

      if (shouldMove) {
        // console.log(shouldMove);

        const elementWidth = animatedElt.lastChild!.getBoundingClientRect().width;
        this.moveElementToOppositeEdge(animatedElt.lastChild as Element, direction, animatedElt);
        // position = position - (animatedElt.lastChild!.getBoundingClientRect().width + gap);
        position -= elementWidth + gap;
        // updateLastTime();
      }
    }

    position = parseInt(parseFloat(position).toFixed(2));

    if (isHorizontal) {
      animatedElt.style.transform = `translate3d(${position}px, 0, 0)`;
    } else {
      animatedElt.style.transform = `translate3d(0, ${position}px, 0)`;
    }
  }
}
