import { MarqueeOptions, PositionedElement } from "../../types";
export declare class PositionManager {
    /**
     * Sets up initial positions for an array of HTML elements, either horizontally or vertically.
     * Each element is positioned sequentially with a specified gap between them.
     *
     * @param elements - Array of HTMLElements to be positioned
     * @param isHorizontal - If true, elements are positioned horizontally; if false, vertically
     * @param gap - The spacing between elements in pixels
     * @returns Array of {@link PositionedElement} containing each element and its position
     *
     * @example
     * ```typescript
     * const elements = document.querySelectorAll('.item');
     * const positionedElements = PositionManager.setupElementsInitialPosition(
     *   Array.from(elements),
     *   true,
     *   10
     * );
     * ```
     */
    static setupElementsInitialPosition(elements: HTMLElement[], isHorizontal: boolean, gap: number): Array<PositionedElement>;
    /**
     * Positions an HTML element using absolute positioning and CSS transforms.
     * @param element - The HTML element to position
     * @param position - The position value in pixels
     * @param isHorizontal - If true, positions horizontally (X axis). If false/undefined, positions vertically (Y axis)
     * @returns void
     */
    static positionElement(element: HTMLElement, position: number, isHorizontal?: boolean): void;
    /**
     * Positions a separator element relative to a target element with specified spacing and direction.
     *
     * @param target - The reference element to position the separator against
     * @param separator - The separator HTML element to be positioned
     * @param gap - The spacing between the target and separator in pixels
     * @param isLeftDirection - If true, positions separator from the left; if false, positions from the right
     *
     * @remarks
     * This method:
     * - Sets absolute positioning for the separator
     * - Aligns the separator vertically in the middle
     * - Applies performance optimizations using will-change
     * - Uses transform for vertical centering
     */
    static positionSeparator(target: Element, separator: HTMLElement, gap: number, isLeftDirection: boolean): void;
    /**
     * Determines if an element is the furthest positioned element in a given array based on direction
     * @param item - Object containing the HTML element and its position
     * @param elements - Array of positioned elements to compare against
     * @param isHorizontal - Boolean indicating if the movement is horizontal
     * @param direction - Direction of movement ("left", "right", "up", or "down")
     * @returns Boolean indicating if the item is the furthest element in the specified direction
     */
    static isFurthestElement(item: {
        el: HTMLElement;
        position: number;
    }, elements: Array<PositionedElement>, isHorizontal: boolean, direction: MarqueeOptions["direction"]): boolean;
    /**
     * Determines if a new position is available for an element without overlapping other elements.
     *
     * @param newPosition - The proposed position to check
     * @param currentElement - The HTML element being positioned
     * @param elements - Array of existing positioned elements with their positions
     * @param gap - Minimum space required between elements
     * @param isHorizontal - Direction of the marquee (true for horizontal, false for vertical)
     * @returns True if the position is available, false if it would overlap with existing elements
     *
     * @remarks
     * The function checks if placing an element at the new position would cause overlap with any existing
     * elements, taking into account the specified gap between elements. It ignores collision checks with
     * the current element itself.
     */
    static isPositionAvailable(newPosition: number, currentElement: HTMLElement, elements: Array<PositionedElement>, gap: MarqueeOptions["gap"], isHorizontal: boolean): boolean;
    /**
     * Updates the position of a given element within a marquee container.
     *
     * @param item - The element to be positioned with its current position data
     * @param elements - Array of all positioned elements in the marquee
     * @param wrapper - The HTML element wrapping all marquee elements
     * @param movement - The amount of pixels to move the element by
     * @param direction - The direction of movement ("left" | "right" | "up" | "down") type: <MarqueeDirectionValue>
     * @param gap - The spacing between elements
     *
     * @remarks
     * This method handles both horizontal and vertical movement.
     * It calculates new positions based on the direction and checks if the element needs to be repositioned
     * when it goes out of bounds. The actual position update only occurs if the new position is available
     * and the element is the furthest in its direction of travel.
     *
     * The position is applied using CSS transform translate3d for better performance.
     */
    static updatePosition(item: PositionedElement, elements: Array<PositionedElement>, wrapper: HTMLElement, movement: number, direction: MarqueeOptions["direction"], gap: MarqueeOptions["gap"]): void;
}
