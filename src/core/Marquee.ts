import type { MarqueeOptions } from "../types";
import { OptionsValidator } from "./OptionsValidator";
import { AnimationManager } from "./managers/AnimationManager";
import { EventManager } from "./managers/EventManager";
import { DOMManager } from "./managers/DOMManager";

export class Marquee {
  private element!: HTMLElement;
  private originalElement: HTMLElement;
  private options!: Partial<MarqueeOptions>;
  private isPlaying: boolean = false;
  private animationManager: AnimationManager | null = null;
  private eventManager: EventManager | null = null;
  private domManager: DOMManager | null = null;
  private htmlContentList: string[] = [];

  private defaultOptions: Partial<MarqueeOptions> = {
    speed: 100,
    direction: "left",
    pauseOnHover: false,
    gap: 20,
    cloneCount: "auto",
    separator: "",
    separatorStyles: "",
    randomize: false,
    contentList: [],
    startAfter: 0,
    heightSecurityMargin: 0,
  };

  constructor(selector: string | HTMLElement, options: MarqueeOptions = {}) {
    const element = typeof selector === "string" ? document.querySelector(selector) : selector;

    if (!element) {
      throw new Error("Invalid element selector");
    }

    // Store a deep copy of the original element
    this.originalElement = element.cloneNode(true) as HTMLElement;
    this.setupInstance(element as HTMLElement, options);
    this.init();
  }

  private setupInstance(element: HTMLElement, options: MarqueeOptions): void {
    const validatedOptions = OptionsValidator.validate(options);
    this.element = element;
    this.options = { ...this.defaultOptions, ...validatedOptions };
    this.htmlContentList = Array.from(this.element.children).map((child) => child.outerHTML);

    // If contentList is empty, populate it with the direct children of the marquee element
    if (!this.options.contentList?.length) {
      this.options.contentList = this.htmlContentList;
    } else if (this.htmlContentList.length && this.options.keepOriginalContent) {
      // If contentList is not empty, but the original content should be kept, append it to the contentList
      this.options.contentList = [...this.htmlContentList, ...this.options.contentList];
    }

    // Randomize contentList if required
    if (this.options.randomize) {
      this.options.contentList = this.randomizeContent();
    }
  }

  private async init(): Promise<void> {
    // Cleanup existing managers if they exist
    this.destroy();

    this.domManager = new DOMManager(this.element, this.options);
    this.domManager.createContentElements();

    const wrapper = this.domManager.getWrapper();
    const contentElements = this.domManager.getContentElements();

    if (wrapper && contentElements.length > 0) {
      this.animationManager = new AnimationManager(wrapper, this.options);
      this.eventManager = new EventManager(this.element, wrapper, this.options, {
        pause: () => this.pause(),
        resume: () => this.play(),
        resize: () => this.resize(),
      });

      setTimeout(() => {
        this.play();
      }, this.options.startAfter);
    }
  }

  private randomizeContent(): string[] {
    const shuffledContent = [...this.options.contentList!];
    for (let i = shuffledContent.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledContent[i], shuffledContent[j]] = [shuffledContent[j], shuffledContent[i]];
    }
    return shuffledContent;
  }

  public async reset(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      // Stop current animation
      this.pause();

      // Recreate element from original
      const newElement = this.originalElement.cloneNode(true) as HTMLElement;

      // Replace old element with new one
      if (this.element.parentElement) {
        this.element.parentElement.replaceChild(newElement, this.element);
      }

      // Wait for cleanup to complete
      await Promise.resolve(this.destroy());

      // Completely reset the instance
      this.setupInstance(newElement, this.options);

      // Wait for initialization to complete
      await this.init();

      resolve();
    });
  }

  public destroy(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.pause();
      this.animationManager?.stopAnimation();
      this.eventManager?.destroy();
      this.domManager?.destroy();

      // S'assurer que le DOM a eu le temps de se mettre à jour
      requestAnimationFrame(() => {
        resolve();
      });
    });
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

  public resize(): void {
    console.log("resize");
    this.domManager?.recalculateClones();
    this.recalculatePositions();
  }

  private startAnimation(): void {
    this.animationManager?.startAnimation();
  }

  private stopAnimation(): void {
    this.animationManager?.stopAnimation();
  }

  public async addContent(
    content: string | string[],
    addToStart: boolean = false,
    reset: boolean = false,
    callback?: () => void
  ): Promise<void> {
    if (!content) return;

    if (reset) {
      this.pause();
    }

    // Convert content to array if it's a string
    const newContent = Array.isArray(content) ? content : [content];

    // Validate new content
    const validationResult = OptionsValidator.validateContentList(newContent, this.options);
    if (!validationResult.isValid) {
      console.warn(
        "MarqueeJS: Content validation failed:",
        validationResult.errors.map((e) => e.message).join(", ")
      );
      return;
    }

    // Add new content to the contentList
    if (addToStart) {
      this.options.contentList = [...newContent, ...this.options.contentList!];
    } else {
      this.options.contentList = [...this.options.contentList!, ...newContent];
    }

    if (reset) {
      // Wait for reset to complete
      await this.reset();
    } else {
      // Recreate content elements
      this.domManager?.createContentElements();

      // Recalculate positions and restart animation
      this.animationManager?.recalculatePositions();
    }

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
      console.warn(
        "MarqueeJS: Content validation failed:",
        validationResult.errors.map((e) => e.message).join(", ")
      );
      return;
    }

    // Replace the contentList with the new one
    this.options.contentList = newContentList;

    // Recreate content elements
    this.domManager?.createContentElements();

    // Recalculate positions and restart animation
    this.animationManager?.recalculatePositions();

    if (callback) {
      requestAnimationFrame(() => {
        callback();
      });
    }
  }

  public getContentList(): string[] {
    return this.options.contentList!;
  }

  public updateSpeed(speed: number): void {
    OptionsValidator.validateSpeed(speed);
    this.options.speed = speed;
  }

  public updateGap(gap: number): void {
    OptionsValidator.validateGap(gap);
    this.options.gap = gap;
    this.domManager?.createContentElements();
    this.animationManager?.recalculatePositions();
  }

  public updateSeparator(separator: string): void {
    this.options.separator = separator;
    this.domManager?.createContentElements();
    this.animationManager?.recalculatePositions();
  }

  public updateSeparatorStyles(styles: string): void {
    this.options.separatorStyles = styles;
    this.domManager?.updateSeparators();
  }

  public updateCloneCount(cloneCount: number): void {
    if (
      !Number.isInteger(cloneCount) ||
      cloneCount < 0 ||
      cloneCount > OptionsValidator.MAX_CLONES
    ) {
      throw new Error(
        `MarqueeJS: cloneCount must be an integer between 0 and ${OptionsValidator.MAX_CLONES}`
      );
    }
    this.options.cloneCount = cloneCount;
    this.domManager?.createContentElements();
    this.animationManager?.recalculatePositions();
  }

  public updateContainerHeight(containerHeight: number): void {
    OptionsValidator.validateContainerHeight(containerHeight, this.options.direction);
    this.options.containerHeight = containerHeight;

    // Apply forced height for 'up' and 'down' directions
    if (["up", "down"].includes(this.options.direction!)) {
      this.domManager?.updateContainerHeight(containerHeight);
    }

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
        resume: () => this.play(),
        resize: () => this.resize(),
      }
    );
  }

  public recalculatePositions(): void {
    this.animationManager?.recalculatePositions();
    this.play();
  }

  public randomize(): void {
    this.options.randomize = true;
    this.reset();
  }

  public switchDirection(): void {
    const oppositeDirection: Record<string, MarqueeOptions["direction"]> = {
      left: "right",
      right: "left",
      up: "down",
      down: "up",
    };

    this.options.direction = oppositeDirection[this.options.direction!];
  }

  public async patchContent(
    content: string | string[],
    position: "start" | "end",
    reset: boolean = false,
    callback?: () => void
  ): Promise<void> {
    if (!content) return;
    if (position !== "start" && position !== "end") {
      throw new Error('MarqueeJS (patchContent): position must be either "start" or "end"');
    }

    if (reset) {
      this.pause();
    }

    // Convert content to array if it's a string
    const newContent = Array.isArray(content) ? content : [content];

    // Validate new content
    const validationResult = OptionsValidator.validateContentList(newContent, this.options);
    if (!validationResult.isValid) {
      console.warn(
        "MarqueeJS: Content validation failed:",
        validationResult.errors.map((e) => e.message).join(", ")
      );
      return;
    }

    // If current content list is empty, just use the new content
    if (!this.options.contentList?.length) {
      this.options.contentList = newContent;
    } else {
      // If new content length is greater or equal to current content
      // replace everything
      if (newContent.length >= this.options.contentList.length) {
        this.options.contentList = newContent;
      } else {
        // Otherwise patch at specified position
        const currentContent = [...this.options.contentList];
        if (position === "start") {
          // Replace elements at start
          currentContent.splice(0, newContent.length, ...newContent);
        } else {
          // Replace elements at end
          const startIndex = currentContent.length - newContent.length;
          currentContent.splice(startIndex, newContent.length, ...newContent);
        }
        this.options.contentList = currentContent;
      }
    }

    if (reset) {
      // Wait for reset to complete
      await this.reset();
    } else {
      // Recreate content elements
      this.domManager?.createContentElements();

      // Recalculate positions and restart animation
      this.animationManager?.recalculatePositions();
    }

    if (callback) {
      requestAnimationFrame(() => {
        callback();
      });
    }
  }
}
