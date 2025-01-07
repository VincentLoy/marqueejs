import type { MarqueeOptions } from "../../types";
export declare class AnimationManager {
    private wrapper;
    private options;
    private animationFrame;
    private lastTime;
    private elements;
    constructor(wrapper: HTMLElement, options: Partial<MarqueeOptions>);
    private setupElements;
    startAnimation(): void;
    private isPositionAvailable;
    private updateHorizontalPosition;
    private updateVerticalPosition;
    stopAnimation(): void;
    recalculatePositions(): void;
}
