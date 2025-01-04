import type { MarqueeOptions } from '../types';
import { OptionsValidator } from './OptionsValidator';
import { AnimationManager } from './managers/AnimationManager';
import { EventManager } from './managers/EventManager';
import { DOMManager } from './managers/DOMManager';

export class Marquee {
  private element: HTMLElement;
  private options: Required<MarqueeOptions>;
  private isPlaying: boolean = false;
  private animationManager: AnimationManager | null = null;
  private eventManager: EventManager | null = null;
  private domManager: DOMManager | null = null;
  private htmlContentList: string[] = [];

  private defaultOptions: Required<MarqueeOptions> = {
    speed: 100,
    direction: 'left',
    pauseOnHover: false,
    gap: 20,
    cloneCount: 4,
    separator: '',
    contentList: []  // Default to empty array
  };

  constructor(selector: string | HTMLElement, options: MarqueeOptions = {}) {
    const element = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector;

    if (!element) {
      throw new Error('Invalid element selector');
    }

    const validatedOptions = OptionsValidator.validate(options);
    this.element = element as HTMLElement;
    this.options = { ...this.defaultOptions, ...validatedOptions };
    this.htmlContentList = Array.from(this.element.children).map(child => child.outerHTML);

    // If contentList is empty, populate it with the direct children of the marquee element
    if (!this.options.contentList.length) {
      this.options.contentList = this.htmlContentList;
    } else if (this.htmlContentList.length && this.options.keepOriginalContent) {
      // If contentList is not empty, but the original content should be kept, append it to the contentList
      this.options.contentList = [...this.htmlContentList, ...this.options.contentList];
    }

    this.init();
  }

  private init(): void {
    this.domManager = new DOMManager(this.element, this.options);
    const wrapper = this.domManager.getWrapper();
    const contentElements = this.domManager.getContentElements();

    if (wrapper && contentElements.length > 0) {
      this.animationManager = new AnimationManager(
        contentElements[0],
        wrapper,
        this.options
      );
      this.eventManager = new EventManager(
        this.element,
        wrapper,
        this.options,
        {
          pause: () => this.pause(),
          resume: () => this.play()
        }
      );
      this.play();
    }
  }

  public play(): void {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.startAnimation();
  }

  public pause(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.stopAnimation();
  }

  private startAnimation(): void {
    this.animationManager?.startAnimation();
  }

  private stopAnimation(): void {
    this.animationManager?.stopAnimation();
  }

  public destroy(): void {
    this.pause();
    this.animationManager?.stopAnimation();
    this.eventManager?.destroy();
    this.domManager?.destroy();
  }

  public updateContent(content: string | string[]): void {
    const newContent = Array.isArray(content) ? content : [content];
    
    // Validate new content
    const validationResult = OptionsValidator.validateContentList(newContent, this.options);
    if (!validationResult.isValid) {
      console.warn('MarqueeJS: Content validation failed:', validationResult.errors.map(e => e.message).join(', '));
      return;
    }

    this.options.contentList = newContent;
    this.domManager?.updateContent(newContent);
    this.animationManager?.recalculatePositions();
    this.play();
  }

  public addContent(content: string | string[], addToStart: boolean = false, callback?: () => void): void {
    if (!content) return;
    this.pause();

    // Convert content to array if it's a string
    const newContent = Array.isArray(content) ? content : [content];

    // Validate new content
    const validationResult = OptionsValidator.validateContentList(newContent, this.options);
    if (!validationResult.isValid) {
      console.warn('MarqueeJS: Content validation failed:', validationResult.errors.map(e => e.message).join(', '));
      return;
    }

    // Add new content to the contentList
    if (addToStart) {
      this.options.contentList = [...newContent, ...this.options.contentList];
    } else {
      this.options.contentList = [...this.options.contentList, ...newContent];
    }

    // Recreate content elements
    this.domManager?.createContentElements();

    // Recalculate positions and restart animation
    this.animationManager?.recalculatePositions();
    this.play();

    // Execute callback if provided, ensuring it runs after DOM updates
    if (callback) {
      requestAnimationFrame(() => {
        callback();
      });
    }
  }

  public replaceContent(newContentList: string[], callback?: () => void): void {
    if (!Array.isArray(newContentList)) return;

    // Validate new content list
    const validationResult = OptionsValidator.validateContentList(newContentList, this.options);
    if (!validationResult.isValid) {
      console.warn('MarqueeJS: Content validation failed:', validationResult.errors.map(e => e.message).join(', '));
      return;
    }

    // Replace the contentList with the new one
    this.options.contentList = newContentList;

    // Recreate content elements
    this.domManager?.createContentElements();

    // Recalculate positions and restart animation
    this.animationManager?.recalculatePositions();
    this.play();
  }

  public getContentList(): string[] {
    return this.options.contentList;
  }

  public updateSpeed(speed: number): void {
    OptionsValidator.validateSpeed(speed);
    this.options.speed = speed;
    this.animationManager?.recalculatePositions();
    this.play();
  }

  public updateGap(gap: number): void {
    OptionsValidator.validateGap(gap);
    this.options.gap = gap;
    this.domManager?.createContentElements(); // Cela va recréer les éléments avec le nouveau gap
    this.animationManager?.recalculatePositions();
    this.play();
  }

  public updateSeparator(separator: string): void {
    this.options.separator = separator;
    this.domManager?.createContentElements(); // Cela va recréer les éléments avec le nouveau séparateur
    this.animationManager?.recalculatePositions();
    this.play();
  }

  public updateCloneCount(cloneCount: number): void {
    if (!Number.isInteger(cloneCount) || cloneCount < 0 || cloneCount > OptionsValidator.MAX_CLONES) {
      throw new Error(`MarqueeJS: cloneCount must be an integer between 0 and ${OptionsValidator.MAX_CLONES}`);
    }
    this.options.cloneCount = cloneCount;
    this.domManager?.createContentElements();
    this.animationManager?.recalculatePositions();
    this.play();
  }

  public updateContainerHeight(containerHeight: number): void {
    OptionsValidator.validateContainerHeight(containerHeight, this.options.direction);
    this.options.containerHeight = containerHeight;

    // Apply forced height for 'up' and 'down' directions
    if (['up', 'down'].includes(this.options.direction)) {
      this.domManager?.updateContainerHeight(containerHeight);
    }

    this.domManager?.setupWrapper();
    this.animationManager?.recalculatePositions();
    this.play();
  }

  public updatePauseOnHover(pauseOnHover: boolean): void {
    this.options.pauseOnHover = pauseOnHover;
    this.eventManager?.destroy();
    this.eventManager = new EventManager(
      this.element,
      this.domManager?.getWrapper()!,
      this.options,
      {
        pause: () => this.pause(),
        resume: () => this.play()
      }
    );
  }

  public recalculatePositions(): void {
    this.animationManager?.recalculatePositions();
    this.play();
  }
}

interface ElementMetrics {
  size: number;
  spacing: number;
  separatorSpace: number;
}