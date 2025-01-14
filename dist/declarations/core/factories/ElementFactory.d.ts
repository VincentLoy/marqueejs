/**
 * Factory class responsible for creating and configuring DOM elements for the marquee component.
 *
 * @class ElementFactory
 *
 * @property {string} instanceId - Unique identifier for the marquee instance
 * @property {Partial<MarqueeOptions>} options - Configuration options for the marquee
 * @property {HTMLElement} element - The base HTML element to transform into a marquee
 * @property {boolean} isHorizontal - Indicates if the marquee scrolls horizontally
 */
export declare class ElementFactory {
    /**
     * Creates a container element for the marquee
     *
     * @returns {HTMLElement} - The container element
     */
    static createContainer(element: HTMLElement, instanceId: string): HTMLElement;
    /**
     * Creates and configures an HTMLElement to serve as a wrapper for the marquee content.
     *
     * @returns {HTMLElement} A configured div element serving as the marquee wrapper
     */
    static createWrapper(isHorizontal: boolean): HTMLElement;
    /**
     * Creates a new HTMLElement to contain marquee content.
     *
     * @param content - The string content to be displayed inside the marquee element
     * @returns An HTMLElement configured with the appropriate styling and content
     */
    static createContentElement(content: string, isHorizontal: boolean): HTMLElement;
    /**
     * Creates and configures a separator element for the marquee.
     * The separator element is a span that contains the configured separator content
     * and styles.
     *
     * @returns {HTMLElement} A new span element configured as a marquee separator
     */
    static createSeparatorElement(theSeparator: string, separatorStyles: string): HTMLElement;
}
