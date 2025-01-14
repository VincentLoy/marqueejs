import type { MarqueeOptions } from "../../types";
export declare class AnimationManager {
    private wrapper;
    private options;
    private animationFrame;
    private lastTime;
    private elements;
    private isHorizontal;
    playing: boolean;
    constructor(wrapper: HTMLElement, options: Partial<MarqueeOptions>);
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
    private setupElements;
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
    startAnimation(): void;
    /**
     * Stops the current animation by canceling the animation frame and resetting animation states.
     * This method will:
     * - Set the playing state to false
     * - Cancel any existing animation frame
     * - Reset the last recorded time
     */
    stopAnimation(): void;
    /**
     * Recalculates positions of elements in the animation sequence.
     * This method performs a complete reset of the animation by:
     * 1. Stopping the current animation
     * 2. Reinitializing element positions
     * 3. Restarting the animation
     */
    recalculatePositions(): void;
    /**
     * Checks whether animations are currently being played.
     * @returns {boolean} True if animations are playing, false otherwise.
     */
    isPlaying(): boolean;
}
