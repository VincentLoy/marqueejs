import type { MarqueeOptions } from "../../types";

export class AnimationManager {
  private wrapper: HTMLElement;
  private options: Partial<MarqueeOptions>;
  private animationFrame: number | null = null;
  private lastTime: number = 0;
  private elements: Array<{ el: HTMLElement; position: number }> = [];
  private isHorizontal: boolean;
  private maxSize: number = 0;
  public playing: boolean;

  constructor(wrapper: HTMLElement, options: Partial<MarqueeOptions>) {
    this.wrapper = wrapper;
    this.options = options;
    this.playing = false;
    this.isHorizontal = ["left", "right"].includes(this.options.direction!);
    this.setupElements();
  }

  private setupElements(): void {
    const groups = Array.from(this.wrapper.children) as HTMLElement[];
    let currentPosition = 0;

    this.elements = groups.map((group) => {
      const size = this.isHorizontal
        ? group.offsetWidth + this.options.gap!
        : group.offsetHeight + this.options.gap!;

      const position = currentPosition;

      group.style.position = "absolute";
      group.style.left = "0";
      group.style.transform = this.isHorizontal
        ? `translate3d(${position}px, 0, 0)`
        : `translate3d(0, ${position}px, 0)`;

      currentPosition += size;

      this.maxSize = Math.max(this.maxSize, size);

      return {
        el: group,
        position,
      };
    });
  }

  public startAnimation(): void {
    this.lastTime = performance.now();
    this.playing = true;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;
      const movement = (this.options.speed! * deltaTime) / 1000;

      // Update each element's position independently
      this.elements.forEach((item) => {
        if (["left", "right"].includes(this.options.direction!)) {
          this.updateHorizontalPosition(item, movement);
        } else {
          this.updateVerticalPosition(item, movement);
        }
      });

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  private isPositionAvailable(newPosition: number, currentElement: HTMLElement): boolean {
    const threshold = this.options.gap || 0;
    return !this.elements.some(({ el, position }) => {
      if (el === currentElement) return false;
      const currentElSizeWatcher = this.isHorizontal
        ? currentElement.offsetWidth
        : currentElement.offsetHeight;
      const elSizeWatcher = this.isHorizontal ? el.offsetWidth : el.offsetHeight;

      return (
        newPosition < position + elSizeWatcher + threshold &&
        newPosition + currentElSizeWatcher > position - threshold
      );
    });
  }

  private isFurthestElement(item: { el: HTMLElement; position: number }): boolean {
    const isHorizontal = this.isHorizontal;
    const direction = this.options.direction;

    return !this.elements.some((other) => {
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

  private updateHorizontalPosition(
    item: { el: HTMLElement; position: number },
    movement: number
  ): void {
    const containerWidth = this.wrapper.parentElement?.offsetWidth || 0;
    const elementWidth = item.el.offsetWidth;
    const isLeftDirection = this.options.direction === "left";

    if (isLeftDirection) {
      item.position -= movement;

      if (item.position + elementWidth < 0) {
        const newPosition = containerWidth;
        // Only reset if there's space available
        if (this.isPositionAvailable(newPosition, item.el) && this.isFurthestElement(item)) {
          item.position = newPosition;
        }
      }
    } else {
      // here this.options.direction === "right"
      item.position += movement;

      if (item.position > containerWidth) {
        const newPosition = -elementWidth;
        // item.el.style.width = `${this.maxSize}px`;
        if (this.isPositionAvailable(newPosition, item.el) && this.isFurthestElement(item)) {
          // item.el.style.width = `auto`;
          item.position = newPosition;
        }
      }
    }

    item.el.style.transform = `translate3d(${item.position}px, 0, 0)`;
  }

  private updateVerticalPosition(
    item: { el: HTMLElement; position: number },
    movement: number
  ): void {
    const containerHeight = this.wrapper.parentElement?.offsetHeight || 0;
    const elementHeight = item.el.offsetHeight;
    const isUpDirection = this.options.direction === "up";

    if (isUpDirection) {
      item.position -= movement;
      if (item.position + elementHeight < 0) {
        const newPosition = containerHeight;
        if (this.isPositionAvailable(newPosition, item.el) && this.isFurthestElement(item)) {
          item.position = newPosition;
        }
      }
    } else {
      item.position += movement;
      if (item.position > containerHeight) {
        const newPosition = -elementHeight;
        if (this.isPositionAvailable(newPosition, item.el) && this.isFurthestElement(item)) {
          item.position = newPosition;
        }
      }
    }

    item.el.style.transform = `translate3d(0, ${item.position}px, 0)`;
  }

  public stopAnimation(): void {
    this.playing = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.lastTime = 0;
  }

  public recalculatePositions(): void {
    // Stop current animation
    this.stopAnimation();

    // Reset and reinitialize positions
    this.setupElements();

    // Restart animation if it was running
    this.startAnimation();
  }

  public isPlaying(): boolean {
    return this.playing;
  }
}
