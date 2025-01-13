import type { CloneMetrics, MarqueeOptions } from "../../types";

export class CloneCalculator {
  private cachedMetrics: CloneMetrics | null = null;

  constructor(private direction: Partial<MarqueeOptions["direction"]>) {}

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
  public calculateOptimalCloneCount(
    containerElement: HTMLElement,
    contentElements: HTMLElement[],
    gap: number
  ): number {
    const isHorizontal = ["left", "right"].includes(this.direction!);

    const metrics = this.calculateMetrics(containerElement, contentElements, gap, isHorizontal);

    // If metrics are identical, return from cache
    if (
      this.cachedMetrics &&
      this.cachedMetrics.containerSize === metrics.containerSize &&
      this.cachedMetrics.contentSize === metrics.contentSize
    ) {
      return this.cachedMetrics.calculatedCount;
    }

    // Calculate minimum number of clones needed
    // (+1 to ensure continuous scrolling)
    const minClones = Math.ceil(metrics.containerSize / metrics.contentSize) + 1;

    // Cache the new metrics
    this.cachedMetrics = {
      ...metrics,
      calculatedCount: minClones,
    };

    return minClones;
  }

  /**
   * Calculates the size metrics for a container and its elements
   * @param container - The HTML container element to measure
   * @param elements - Array of HTML elements inside the container to measure
   * @param gap - The gap size between elements
   * @param isHorizontal - Boolean flag indicating if the layout is horizontal (true) or vertical (false)
   * @returns An object containing the container size and total content size (including gaps)
   * @private
   */
  private calculateMetrics(
    container: HTMLElement,
    elements: HTMLElement[],
    gap: number,
    isHorizontal: boolean
  ): Omit<CloneMetrics, "calculatedCount"> {
    const containerSize = isHorizontal ? container.offsetWidth : container.offsetHeight;

    const contentSize = elements.reduce((total, el) => {
      const size = isHorizontal ? el.offsetWidth : el.offsetHeight;
      return total + size + gap;
    }, 0);

    return {
      containerSize,
      contentSize,
    };
  }

  /**
   * Invalidates the cached metrics by setting them to null.
   * This forces a recalculation of metrics the next time they are requested.
   */
  public invalidateCache(): void {
    this.cachedMetrics = null;
  }
}
