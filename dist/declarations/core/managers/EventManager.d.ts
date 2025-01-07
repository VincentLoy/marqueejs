import type { MarqueeOptions } from "../../types";
export declare class EventManager {
    private wrapper;
    private options;
    private handlers;
    constructor(_element: HTMLElement, wrapper: HTMLElement, options: Partial<MarqueeOptions>, handlers: {
        pause: () => void;
        resume: () => void;
    });
    private init;
    private setupHoverEvents;
    private setupTouchEvents;
    private setupVisibilityEvents;
    destroy(): void;
}
