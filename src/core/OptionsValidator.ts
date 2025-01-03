import type { MarqueeOptions, ContentValidationResult, ContentValidationErrorType, ContentValidationOptions } from '../types'

export class OptionsValidator {
  static readonly MAX_CLONES = 15;
  static readonly MIN_CLONES = 0;
  static readonly DEFAULT_MAX_LENGTH = 1000;

  private static readonly FORBIDDEN_TAGS = [
    'script', 'style', 'iframe', 'object', 'embed', 'form',
    'input', 'button', 'meta', 'link', 'head', 'html', 'body'
  ];

  private static readonly FORBIDDEN_ATTRIBUTES = [
    'onclick', 'onmouseover', 'onmouseout', 'onload', 'onerror',
    'onsubmit', 'formaction', 'href', 'xlink:href', 'src',
    'data', 'action', 'javascript'
  ];

  private static readonly DEFAULT_VALIDATION_OPTIONS = {
    maxLength: OptionsValidator.DEFAULT_MAX_LENGTH,
    forbiddenTags: OptionsValidator.FORBIDDEN_TAGS,
    forbiddenAttributes: OptionsValidator.FORBIDDEN_ATTRIBUTES
  } as const;

  static validate(options: MarqueeOptions): MarqueeOptions {
    this.validateSpeed(options.speed)
    this.validateDirection(options.direction)
    this.validateGap(options.gap)
    
    // Initialize contentValidation with defaults if not provided
    if (!options.contentValidation) {
      options.contentValidation = this.DEFAULT_VALIDATION_OPTIONS;
    } else {
      options.contentValidation = {
        maxLength: options.contentValidation.maxLength || this.DEFAULT_MAX_LENGTH,
        forbiddenTags: [
          ...this.FORBIDDEN_TAGS,
          ...(options.contentValidation.forbiddenTags || [])
        ],
        forbiddenAttributes: [
          ...this.FORBIDDEN_ATTRIBUTES,
          ...(options.contentValidation.forbiddenAttributes || [])
        ]
      };
    }

    // Add contentList validation
    if (options.contentList) {
      const validationResult = this.validateContentList(options.contentList, options)
      if (!validationResult.isValid) {
        console.warn('MarqueeJS: Content list validation failed:', 
          validationResult.errors.map(e => e.message).join(', '))
        options.contentList = options.contentList.filter((_, index) => 
          !validationResult.errors.some(e => e.index === index)
        )
      }
    }

    // Handle clone count separately to return modified options
    if (options.cloneCount !== undefined) {
      if (!Number.isInteger(options.cloneCount) || options.cloneCount < 0) {
        console.warn(`MarqueeJS: Requested ${options.cloneCount} clones, but minimum is ${this.MIN_CLONES}. Using ${this.MIN_CLONES} clones instead.`)
        options.cloneCount = this.MIN_CLONES
      }
      if (options.cloneCount > this.MAX_CLONES) {
        console.warn(`MarqueeJS: Requested ${options.cloneCount} clones, but maximum is ${this.MAX_CLONES}. Using ${this.MAX_CLONES} clones instead.`)
        options.cloneCount = this.MAX_CLONES
      }
    }

    // Remove separator for vertical directions
    if (['up', 'down'].includes(options.direction || '') && options.separator) {
      console.warn('MarqueeJS: Separator is not supported for vertical directions. Separator will be ignored.')
      options.separator = ''
    }

    return options
  }

  private static validateContentList(contentList: string[], options: MarqueeOptions): ContentValidationResult {
    const errors: {
      type: ContentValidationErrorType;
      message: string;
      content?: string;
      index?: number;
    }[] = [];
    
    if (!Array.isArray(contentList)) {
      return {
        isValid: false,
        errors: [{
          type: 'INVALID_HTML' as ContentValidationErrorType,
          message: 'Content list must be an array of strings',
        }]
      }
    }

    // Create a complete validation options object with all required properties
    const validationOptions = {
      ...this.DEFAULT_VALIDATION_OPTIONS,
      ...options.contentValidation,
      forbiddenTags: [
        ...this.FORBIDDEN_TAGS,
        ...(options.contentValidation?.forbiddenTags || [])
      ],
      forbiddenAttributes: [
        ...this.FORBIDDEN_ATTRIBUTES,
        ...(options.contentValidation?.forbiddenAttributes || [])
      ],
      maxLength: options.contentValidation?.maxLength || this.DEFAULT_MAX_LENGTH
    };

    const forbiddenTagsPattern = new RegExp(
      `</?(?:${validationOptions.forbiddenTags.join('|')})\\b[^>]*>`,
      'i'
    );
    const forbiddenAttrsPattern = new RegExp(
      validationOptions.forbiddenAttributes
        .map(attr => `${attr}\\s*=\\s*["']?[^"']*["']?`)
        .join('|'),
      'i'
    );

    for (let i = 0; i < contentList.length; i++) {
      const content = contentList[i]
      
      // Check for empty or non-string content
      if (!content || typeof content !== 'string') {
        errors.push({
          type: 'EMPTY_CONTENT' as ContentValidationErrorType,
          message: 'Content item must be a non-empty string',
          index: i,
          content
        })
        continue
      }

      // Check for forbidden tags
      if (forbiddenTagsPattern.test(content)) {
        errors.push({
          type: 'UNSAFE_TAG_DETECTED' as ContentValidationErrorType,
          message: 'Content contains forbidden HTML tags',
          index: i,
          content: content.substring(0, 50) + '...'
        });
        continue;
      }

      // Check for forbidden attributes
      if (forbiddenAttrsPattern.test(content)) {
        errors.push({
          type: 'UNSAFE_ATTRIBUTES' as ContentValidationErrorType,
          message: 'Content contains forbidden HTML attributes',
          index: i,
          content: content.substring(0, 50) + '...'
        });
        continue;
      }

      // Check for user-defined or default length
      if (content.length > validationOptions.maxLength) {
        errors.push({
          type: 'MAX_LENGTH_EXCEEDED' as ContentValidationErrorType,
          message: `Content item exceeds maximum length of ${validationOptions.maxLength} characters`,
          index: i,
          content: content.substring(0, 50) + '...'
        })
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  private static validateSpeed(speed: number | undefined): void {
    if (speed !== undefined && (typeof speed !== 'number' || speed <= 0)) {
      throw new Error('MarqueeJS: Speed must be a positive number')
    }
  }

  private static validateDirection(direction: string | undefined): void {
    const validDirections = ['left', 'right', 'up', 'down']
    if (direction && !validDirections.includes(direction)) {
      throw new Error(`MarqueeJS: Direction must be one of: ${validDirections.join(', ')}`)
    }
  }

  private static validateGap(gap: number | undefined): void {
    if (gap !== undefined && (typeof gap !== 'number' || gap < 0)) {
      throw new Error('MarqueeJS: Gap must be a non-negative number')
    }
  }
}
