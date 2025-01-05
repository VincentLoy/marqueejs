import type { CloneMetrics } from '../../types';

export class CloneCalculator {
  private cachedMetrics: CloneMetrics | null = null;

  constructor(private direction: 'left' | 'right' | 'up' | 'down') {}

  public calculateOptimalCloneCount(
    containerElement: HTMLElement,
    contentElements: HTMLElement[],
    gap: number
  ): number {
    const isHorizontal = ['left', 'right'].includes(this.direction);
    
    const metrics = this.calculateMetrics(containerElement, contentElements, gap, isHorizontal);
    
    // If metrics are identical, return from cache
    if (this.cachedMetrics && 
      this.cachedMetrics.containerSize === metrics.containerSize &&
      this.cachedMetrics.contentSize === metrics.contentSize) {
      return this.cachedMetrics.calculatedCount;
    }

    // Calculate minimum number of clones needed
    // +1 to ensure continuous scrolling
    const minClones = Math.ceil(metrics.containerSize / metrics.contentSize) + 1;

    // Cache the new metrics
    this.cachedMetrics = {
      ...metrics,
      calculatedCount: minClones
    };

    return minClones;
  }

  private calculateMetrics(
    container: HTMLElement,
    elements: HTMLElement[],
    gap: number,
    isHorizontal: boolean
  ): Omit<CloneMetrics, 'calculatedCount'> {
    const containerSize = isHorizontal 
      ? container.offsetWidth 
      : container.offsetHeight;

    const contentSize = elements.reduce((total, el) => {
      const size = isHorizontal ? el.offsetWidth : el.offsetHeight;
      return total + size + gap;
    }, 0);

    return {
      containerSize,
      contentSize
    };
  }

  public invalidateCache(): void {
    this.cachedMetrics = null;
  }
}
