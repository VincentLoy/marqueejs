import type { MarqueeOptions } from "../../types";
import { PositionManager } from "./PositionManager";

export class AnimationManager {
  private animatedElement: HTMLElement;
  private options: Partial<MarqueeOptions>;
  private animationFrame: number | null = null;
  private lastTime: number = 0;
  private elements: Element[];
  public playing: boolean;

  constructor(animatedElement: HTMLElement, options: Partial<MarqueeOptions>) {
    this.animatedElement = animatedElement;
    this.options = options;
    this.playing = false;
    this.elements = [...animatedElement.querySelectorAll(".marquee-content-item")];
  }

  /**
   * Initiates the animation loop for the marquee.
   * This method sets up a recursive animation frame request that:
   * 1. Calculates the time delta between frames
   * 2. Computes the movement distance based on speed and delta time
   * 3. Updates the position of each element in the marquee
   *
   * The animation continues until {@link stopAnimation} is called.
   *
   * @remarks
   * The animation uses requestAnimationFrame for smooth performance
   * and calculates movement based on elapsed time to ensure
   * consistent speed across different frame rates.
   */
  public startAnimation(): void {
    if (this.playing) return;

    this.lastTime = performance.now();
    this.playing = true;

    const animate = (currentTime: number) => {
      const deltaTime = Math.max(0, currentTime - this.lastTime);
      this.lastTime = currentTime;
      const movement = (this.options.speed! * deltaTime) / 1000;

      // Update each element's position independently
      PositionManager.updatePosition(
        this.animatedElement,
        this.elements,
        this.animatedElement,
        movement,
        this.options.direction!,
        this.options.gap!,
        this.updateLastTime.bind(this)
      );

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  protected updateLastTime() {
    this.lastTime = performance.now();
    console.log("lastTime updated", this.lastTime);
  }

  /**
   * Stops the current animation by canceling the animation frame and resetting animation states.
   * This method will:
   * - Set the playing state to false
   * - Cancel any existing animation frame
   * - Reset the last recorded time
   */
  public stopAnimation(): void {
    this.playing = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.lastTime = 0;
  }

  /**
   * Recalculates positions of elements in the animation sequence.
   * This method performs a complete reset of the animation by:
   * 1. Stopping the current animation
   * 2. Reinitializing element positions
   * 3. Restarting the animation
   */
  public recalculatePositions(): void {
    this.stopAnimation();
    this.startAnimation();
  }

  /**
   * Checks whether animations are currently being played.
   * @returns {boolean} True if animations are playing, false otherwise.
   */
  public isPlaying(): boolean {
    return this.playing;
  }
}
