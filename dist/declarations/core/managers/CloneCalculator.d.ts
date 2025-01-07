export declare class CloneCalculator {
    private direction;
    private cachedMetrics;
    constructor(direction: "left" | "right" | "up" | "down");
    calculateOptimalCloneCount(containerElement: HTMLElement, contentElements: HTMLElement[], gap: number): number;
    private calculateMetrics;
    invalidateCache(): void;
}
