/**
 * Configuration options for MarqueeJS instance
 */
export interface MarqueeOptions {
  /** Animation speed in pixels per second. Must be positive. */
  speed?: number;

  /** Direction of the marquee animation. */
  direction?: 'left' | 'right' | 'up' | 'down';

  /** Whether to pause animation on mouse hover. */
  pauseOnHover?: boolean;

  /** Gap between elements in pixels. Must be non-negative. */
  gap?: number;

  /** Number of times each item should be cloned. Maximum 15. */
  cloneCount?: number;

  /** Character or string to separate items. Not supported for vertical directions. */
  separator?: string;

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
}

/**
 * Public API for controlling a MarqueeJS instance
 */
export interface MarqueeInstance {
  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
  destroy(): void;
  
  /** 
   * Update the content of all marquee items
   * @param content - New HTML content to display
   */
  updateContent(content: string): void;
}

/**
 * Content validation error types
 */
export type ContentValidationErrorType = 
  | 'EMPTY_CONTENT'
  | 'INVALID_HTML'
  | 'UNSAFE_TAG_DETECTED'
  | 'MAX_LENGTH_EXCEEDED'
  | 'UNSAFE_ATTRIBUTES';

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
  separatorOffset?: number;
}
