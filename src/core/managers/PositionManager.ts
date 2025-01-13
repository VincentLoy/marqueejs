import { MarqueeOptions, PositionedElement } from "../../types";

export class PositionManager {
  public static positionElement(
    element: HTMLElement,
    position: number,
    isHorizontal?: boolean
  ): void {
    if (!element) return;

    element.style.willChange = "transform";
    element.style.transform = isHorizontal
      ? `translate3d(${position}px, 0, 0)`
      : `translate3d(0, ${position}px, 0)`;
  }

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
