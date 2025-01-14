import { MarqueeOptions } from "../../types";
export declare class SeparatorManager {
    private wrapper;
    private options;
    private isHorizontal;
    constructor(options: Partial<MarqueeOptions>, wrapper: HTMLElement);
    /**
     * Updates the separator elements between marquee content items.
     * If no separator is defined in options or if the marquee is not horizontal direction, the method returns early.
     * This method first removes all existing separators and then creates new ones between each content item.
     * The separators are positioned based on the direction (left/right) and gap settings from the options.
     *
     * @remarks
     * This method is responsible for:
     * - Cleaning up existing separator elements
     * - Creating new separator elements between items
     * - Positioning separators according to direction and gap settings
     *
     * @throws {Error} Implicitly may throw if DOM operations fail
     */
    updateSeparators(): void;
    /**
     * Removes all separator elements from the DOM that have the 'marquee-separator' class.
     * @returns {void}
     */
    cleanupSeparatorElements(): void;
}
