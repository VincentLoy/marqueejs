import type { MarqueeOptions } from "../../types";
export declare class DOMManager {
    private container;
    private wrapper;
    private element;
    private options;
    private contentElements;
    private clones;
    private instanceId;
    private cloneCalculator;
    private isHorizontal;
    private separatorManager;
    constructor(element: HTMLElement, options: Partial<MarqueeOptions>);
    setupDOM(): void;
    createContentElements(): Promise<void>;
    private clearElements;
    private getMaxContentHeight;
    private calculateMetrics;
    private positionElements;
    private createClones;
    recalculateClones(): void;
    updateContainerHeight(height: number): void;
    getWrapper(): HTMLElement;
    getContainer(): HTMLElement;
    getContentElements(): HTMLElement[];
    updateSeparators(): void;
    destroy(): void;
}
