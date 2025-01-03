import type { MarqueeOptions } from '../types';
import { OptionsValidator } from './OptionsValidator';
import { AnimationManager } from './AnimationManager';
import { EventManager } from './EventManager';

export class Marquee {
  private element: HTMLElement;
  private options: Required<MarqueeOptions>;
  private container: HTMLElement | null = null;
  private wrapper: HTMLElement | null = null;
  private clones: HTMLElement[] = [];
  private isPlaying: boolean = false;
  private animationManager: AnimationManager | null = null;
  private eventManager: EventManager | null = null;
  private separatorClasses: WeakMap<HTMLElement, string> = new WeakMap();

  private defaultOptions: Required<MarqueeOptions> = {
    speed: 100,
    direction: 'left',
    pauseOnHover: false,
    gap: 20,
    cloneCount: 4,
    separator: ''
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
    this.init();
  }

  private init(): void {
    this.setupWrapper();
    this.cloneElements();
    if (this.wrapper) {
      this.animationManager = new AnimationManager(this.element, this.wrapper, this.options);
      this.eventManager = new EventManager(
        this.element,
        this.wrapper,
        this.options,
        {
          pause: () => this.pause(),
          resume: () => this.play()
        }
      );
      // Start animation immediately
      this.play();
    }
  }

  private setupWrapper(): void {
    const originalHeight = this.element.offsetHeight

    // Create outer container
    this.container = document.createElement('div');
    this.container.style.width = '100%';
    this.container.style.height = `${originalHeight}px`;
    this.container.style.overflow = 'hidden';
    this.container.style.position = 'relative';
    this.container.classList.add('marquee-container');
    
    // Create inner wrapper
    this.wrapper = document.createElement('div');
    this.wrapper.style.position = 'relative'; // Changed from absolute
    this.wrapper.style.width = '100%';
    this.wrapper.style.height = '100%';
    this.wrapper.classList.add('marquee-wrapper');
    
    // Setup element styles
    this.element.style.position = 'absolute';
    this.element.style.top = '0';
    this.element.style.left = '0';
    this.element.style.flexShrink = '0';
    this.element.style.height = ['up', 'down'].includes(this.options.direction) ? 'auto' : `${originalHeight}px`;
    if (['left', 'right'].includes(this.options.direction)) {
      this.element.style.marginRight = `${this.options.gap}px`;
    } else {
      this.element.style.marginBottom = `${this.options.gap}px`;
    }
    
    // Insert into DOM
    this.element.parentNode?.insertBefore(this.container, this.element);
    this.container.appendChild(this.wrapper);
    this.wrapper.appendChild(this.element);

    // Add separator to original element
    this.addSeparatorStyle(this.element);
  }

  private cloneElements(): void {
    if (this.options.cloneCount === 0) return;
    for (let i = 0; i < this.options.cloneCount; i++) {
      const clone = this.element.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      clone.style.flexShrink = '0';
      if (['left', 'right'].includes(this.options.direction)) {
        clone.style.marginRight = `${this.options.gap}px`;
      } else {
        clone.style.marginBottom = `${this.options.gap}px`;
      }
      // Add separator (except for last clone)
      this.addSeparatorStyle(clone, i === this.options.cloneCount - 1);
      this.clones.push(clone);
      this.wrapper?.appendChild(clone);
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
    this.clones.forEach(clone => clone.remove());
    if (this.wrapper?.parentNode) {
      this.wrapper.parentNode.insertBefore(this.element, this.wrapper);
      this.container?.remove();
    }
    // Remove separator styles
    document.querySelectorAll('style').forEach(style => {
      if (style.textContent?.includes('marquee-item-')) {
        style.remove();
      }
    });
    // Clean up separator styles using tracked classes
    this.clones.forEach(clone => {
      const className = this.separatorClasses.get(clone);
      if (className) {
        document.querySelector(`style[data-for="${className}"]`)?.remove();
      }
    });
    // Clean up all separator styles
    [this.element, ...this.clones].forEach(el => this.cleanupSeparatorStyle(el));
  }

  public updateContent(content: string): void {
    // Update content first
    this.element.innerHTML = content;
    this.clones.forEach(clone => {
      clone.innerHTML = content;
    });

    // Then handle layout updates
    if (this.wrapper && this.animationManager) {
      // ...existing margin updates...
      this.animationManager.recalculatePositions();
    }

    // Finally update separators
    this.addSeparatorStyle(this.element);
    this.clones.forEach((clone, index) => {
      this.addSeparatorStyle(clone, index === this.clones.length - 1);
    });
  }

  private cleanupSeparatorStyle(element: HTMLElement): void {
    // Clean up any existing separator classes
    Array.from(element.classList)
      .filter(className => className.startsWith('marquee-item-'))
      .forEach(className => {
        element.classList.remove(className);
        document.querySelector(`style[data-for="${className}"]`)?.remove();
      });
  }

  private addSeparatorStyle(element: HTMLElement, isLast: boolean = false): void {
    if (
      this.options.gap === 0 || this.options.cloneCount === 0 ||
      !this.options.separator || ['up', 'down'].includes(this.options.direction)
    ) {
      this.cleanupSeparatorStyle(element);
      return;
    }

    // Clean up before adding new style
    this.cleanupSeparatorStyle(element);

    const className = `marquee-item-${Math.random().toString(36).substr(2, 9)}`;
    const style = document.createElement('style');
    
    element.classList.add('marquee-item');
    element.classList.add(className);
    style.setAttribute('data-for', className);
    style.textContent = `
      .${className}::before {
        content: '${this.options.separator}';
        position: absolute;
        left: -${this.options.gap / 2}px;
        transform: translateX(-50%);
        white-space: pre;
      }
    `;
    
    document.head.appendChild(style);
  }
}