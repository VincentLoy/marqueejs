import type { MarqueeOptions } from "../../types";
export declare class CloneCalculator {
    private direction;
    private cachedMetrics;
    constructor(direction: Partial<MarqueeOptions["direction"]>);
    /**
     * Calculates the optimal number of clones needed for smooth infinite scrolling.
     *
     * This method determines the minimum number of element clones required to ensure
     * continuous scrolling based on the container and content dimensions.
     * It includes caching optimization to avoid recalculation when metrics haven't changed.
     *
     * @param containerElement - The HTML element that serves as the scrolling container
     * @param contentElements - Array of HTML elements representing the content to be cloned
     * @param gap - The spacing between content elements in pixels
     * @returns The minimum number of clones needed for continuous scrolling
     *
     * @example
     * const cloneCount = calculator.calculateOptimalCloneCount(container, items, 10);
     */
    calculateOptimalCloneCount(containerElement: HTMLElement, contentElements: HTMLElement[], gap: number): number;
    /**
     * Calculates the size metrics for a container and its elements
     * @param container - The HTML container element to measure
     * @param elements - Array of HTML elements inside the container to measure
     * @param gap - The gap size between elements
     * @param isHorizontal - Boolean flag indicating if the layout is horizontal (true) or vertical (false)
     * @returns An object containing the container size and total content size (including gaps)
     * @private
     */
    private calculateMetrics;
    /**
     * Invalidates the cached metrics by setting them to null.
     * This forces a recalculation of metrics the next time they are requested.
     */
    invalidateCache(): void;
}
