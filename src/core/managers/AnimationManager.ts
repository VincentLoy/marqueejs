import type { MarqueeOptions, PositionedElement } from "../../types";
import { PositionManager } from "./PositionManager";

export class AnimationManager {
  private wrapper: HTMLElement;
  private options: Partial<MarqueeOptions>;
  private animationFrame: number | null = null;
  private lastTime: number = 0;
  private elements: Array<PositionedElement> = [];
  private isHorizontal: boolean;
  public playing: boolean;

  constructor(wrapper: HTMLElement, options: Partial<MarqueeOptions>) {
    this.wrapper = wrapper;
    this.options = options;
    this.playing = false;
    this.isHorizontal = ["left", "right"].includes(this.options.direction!);
    this.setupElements();
  }

  /**
   * Sets up the initial positions of the wrapper's child elements.
   * This method processes all direct children of the wrapper element,
   * positions them using the PositionManager, and stores them for animation.
   *
   * The positioning is done according to:
   * - The horizontal/vertical orientation specified
   * - The gap between elements defined in options
   *
   * @private
   */
  private setupElements(): void {
    const groups = [...this.wrapper.children] as HTMLElement[];

    const positionedElements = PositionManager.setupElementsInitialPosition(
      groups,
      this.isHorizontal,
      this.options.gap!
    );

    this.elements = positionedElements;
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
    this.setupElements();
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
