/**
 * Configuration options for MarqueeJS instance
 */
export interface MarqueeOptions {
  /** Animation speed in pixels per second. Must be positive. */
  speed?: number;

  /** Direction of the marquee animation. */
  direction?: "left" | "right" | "up" | "down";

  /** Whether to pause animation on mouse hover. */
  pauseOnHover?: boolean;

  /** Gap between elements in pixels. Must be non-negative. */
  gap?: number;

  /** Number of times each item should be cloned. Maximum 15. */
  cloneCount?: number | "auto"; // Updated type

  /** Character or string to separate items. Not supported for vertical directions. */
  separator?: string;

  /**
   * Custom additional CSS rules for the separator element. Separator element is ::before pseudo-element.
   */
  separatorStyles?: string;

  /**
   * Array of HTML strings to use as marquee items.
   * Each item will be cloned according to cloneCount.
   * @example
   * contentList: [
   *   '<span class="badge">New</span> First item',
   *   'Second item',
   *   '<em>Third item</em>'
   * ]
   */
  contentList?: string[];

  /** Content validation options */
  contentValidation?: ContentValidationOptions;

  /** Height of the marquee container in pixels. Only applicable for 'up' and 'down' directions. */
  containerHeight?: number;

  /** Whether to keep the original HTML content of the marquee element. */
  keepOriginalContent?: boolean;

  /** Randomize order in contentList */
  randomize?: boolean;

  /**
   * Marquee animation will start after the specified time in ms
   */
  startAfter?: number;

  /**
   * Security margin for height calculation in pixels. Only applicable for 'up' and 'down' directions.
   */
  heightSecurityMargin?: number;
}

/**
 * Public API for controlling a MarqueeJS instance
 */
export interface MarqueeInstance {
  pause(): void;
  resume(): void;
  destroy(): void;

  /**
   * Add new content to the content list
   * @param content - New HTML content or array of contents to add
   * @param addToStart - Whether to add the new content at the start of the list
   * @param callback - Function to execute after content is added
   */
  addContent(
    content: string | string[],
    addToStart?: boolean,
    reset?: boolean,
    callback?: () => void
  ): void;

  /**
   * Replace the entire content list with a new one
   * @param newContentList - Array of new HTML contents to replace the existing list
   */
  replaceContent(newContentList: string[], callback?: () => void): void;

  /**
   * Get the current content list
   * @returns The current content list
   */
  getContentList(): string[];

  /**
   * Update the scrolling speed
   * @param speed - New speed in pixels per second
   */
  updateSpeed(speed: number): void;

  /**
   * Update the gap between elements
   * @param gap - New gap in pixels
   */
  updateGap(gap: number): void;

  /**
   * Update the separator between elements
   * @param separator - New separator string
   */
  updateSeparator(separator: string): void;

  /**
   * Update the number of clones
   * @param cloneCount - New number of clones
   */
  updateCloneCount(cloneCount: number): void;

  /**
   * Update the container height
   * @param containerHeight - New container height in pixels
   */
  updateContainerHeight(containerHeight: number): void;

  /**
   * Update the pause on hover option
   * @param pauseOnHover - New pause on hover value
   */
  updatePauseOnHover(pauseOnHover: boolean): void;

  /**
   * Recalculate positions of elements
   */
  recalculatePositions(): void;

  /**
   * Randomize the order of content items
   */
  randomize(): void;

  /**
   * Update the direction of the marquee animation
   * @param direction - New direction value
   */
  switchDirection(): void;

  /**
   * Patch content at specified position
   * @param content - New HTML content or array of contents to patch
   * @param position - Position where to patch ('start' or 'end')
   * @param callback - Function to execute after content is patched
   */
  patchContent(
    content: string | string[],
    position: "start" | "end",
    reset?: boolean,
    callback?: () => void
  ): void;
}

/**
 * Content validation error types
 */
export type ContentValidationErrorType =
  | "EMPTY_CONTENT"
  | "INVALID_HTML"
  | "UNSAFE_TAG_DETECTED"
  | "MAX_LENGTH_EXCEEDED"
  | "UNSAFE_ATTRIBUTES";

/**
 * Content validation result
 */
export interface ContentValidationResult {
  isValid: boolean;
  errors: Array<{
    type: ContentValidationErrorType;
    message: string;
    content?: string;
    index?: number;
  }>;
}

/**
 * Content list validation options
 */
export interface ContentValidationOptions {
  /** Maximum length of each content item. Defaults to 1000. */
  maxLength?: number;
  /** Additional attributes to forbid beyond default security attributes */
  forbiddenAttributes?: string[];
  /** Additional tags to forbid beyond default security tags */
  forbiddenTags?: string[];
}

/**
 * Internal metrics for element positioning and spacing
 */
export interface ElementMetrics {
  size: number;
  spacing: number;
  position: number;
}

// Add new interface for clone calculator
export interface CloneMetrics {
  containerSize: number;
  contentSize: number;
  calculatedCount: number;
}
