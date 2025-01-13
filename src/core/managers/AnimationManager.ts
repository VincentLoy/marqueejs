import type { MarqueeOptions, PositionedElement } from "../../types";
import { PositionManager } from "./PositionManager";

export class AnimationManager {
  private wrapper: HTMLElement;
  private options: Partial<MarqueeOptions>;
  private animationFrame: number | null = null;
  private lastTime: number = 0;
  private elements: Array<PositionedElement> = [];
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
        PositionManager.updatePosition(
          item,
          this.elements,
          this.wrapper,
          movement,
          this.options.direction!,
          this.options.gap!
        );
      });

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
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
