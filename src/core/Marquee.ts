import type { MarqueeOptions } from '../types';
import { OptionsValidator } from './OptionsValidator';
import { AnimationManager } from './AnimationManager';
import { EventManager } from './EventManager';
import type { ElementMetrics } from '../types';

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
  private contentElements: HTMLElement[] = [];

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
    this.init();
  }

  private init(): void {
    this.setupWrapper();
    
    if (this.options.contentList?.length) {
      this.handleOriginalContent();
      this.createContentElements();
    } else {
      this.cloneElements();
    }

    if (this.wrapper) {
      this.animationManager = new AnimationManager(
        this.options.contentList?.length ? this.contentElements[0] : this.element,
        this.wrapper,
        this.options
      );
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

  private handleOriginalContent(): void {
    if (this.options.keepOriginalContent) {
      const originalContent = this.element.innerHTML.trim();
      if (originalContent) {
        this.options.contentList = [originalContent, ...this.options.contentList];
      }
    }
    this.element.innerHTML = '';
  }

  private setupWrapper(): void {
    // Calculate max height from content if using contentList
    const originalHeight = this.options.contentList?.length 
      ? this.getMaxContentHeight()
      : this.element.offsetHeight;

    // Create outer container
    this.container = document.createElement('div');
    this.container.style.width = '100%';

    // Apply forced height for 'up' and 'down' directions
    if (['up', 'down'].includes(this.options.direction) && this.options.containerHeight) {
      this.container.style.height = `${this.options.containerHeight}px`;
    } else {
      this.container.style.height = `${originalHeight}px`;
    }

    this.container.style.overflow = 'hidden';
    this.container.style.position = 'relative';
    this.container.classList.add('marquee-container');
    
    // Update wrapper styles for better content handling
    this.wrapper = document.createElement('div');
    this.wrapper.style.position = 'relative';
    this.wrapper.style.width = '100%';
    this.wrapper.style.height = '100%';
    this.wrapper.style.overflow = 'visible';
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
      this.element.style.whiteSpace = 'normal'; // Allow line breaks for vertical directions
    }
    
    // Insert into DOM
    this.element.parentNode?.insertBefore(this.container, this.element);
    this.container.appendChild(this.wrapper);

    // Don't append original element if using contentList
    if (!this.options.contentList?.length) {
      this.wrapper?.appendChild(this.element);
    }

    // Add separator to original element
    this.addSeparatorStyle(this.element);
  }

  private getMaxContentHeight(): number {
    if (!this.options.contentList?.length) return this.element.offsetHeight;

    // Create temporary container to measure heights
    const temp = document.createElement('div');
    temp.style.position = 'absolute';
    temp.style.visibility = 'hidden';
    temp.style.left = '-9999px';
    document.body.appendChild(temp);

    const heights = this.options.contentList.map(content => {
      temp.innerHTML = content;
      return temp.offsetHeight;
    });

    document.body.removeChild(temp);
    return Math.max(...heights);
  }

  private calculateMetrics(): ElementMetrics[] {
    const isHorizontal = ['left', 'right'].includes(this.options.direction);
    const metrics: ElementMetrics[] = [];
    let currentPosition = 0;

    const elements = this.options.contentList?.length 
      ? this.contentElements 
      : [this.element, ...this.clones];

    elements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const size = isHorizontal ? rect.width : rect.height;
      const separatorOffset = this.options.separator && index < elements.length - 1 
        ? this.options.gap / 2 
        : 0;

      metrics.push({
        size,
        spacing: this.options.gap,
        position: currentPosition,
        separatorOffset
      });

      currentPosition += size + this.options.gap;
    });

    return metrics;
  }

  private createContentElements(): void {
    if (!this.options.contentList?.length || !this.wrapper) return;

    // Clear existing elements
    this.contentElements.forEach(el => el.remove());
    this.clones.forEach(el => el.remove());
    this.contentElements = [];
    this.clones = [];

    // Create content elements
    this.options.contentList.forEach((content, index) => {
      const element = document.createElement('div');
      element.className = 'marquee-content-item';
      element.style.position = 'absolute';
      element.style.whiteSpace = ['up', 'down'].includes(this.options.direction) ? 'normal' : 'nowrap'; // Allow line breaks for vertical directions
      element.innerHTML = content;

      // Add separator style if not last element
      this.addSeparatorStyle(element);

      this.contentElements.push(element);
      this.wrapper?.appendChild(element);
    });

    // Position elements and create clones
    const metrics = this.calculateMetrics();
    const totalSize = metrics.reduce((sum, m) => sum + m.size + m.spacing, 0);

    // Position original elements
    this.contentElements.forEach((el, i) => {
      const { position } = metrics[i];
      el.style.transform = ['left', 'right'].includes(this.options.direction)
        ? `translateX(${position}px)`
        : `translateY(${position}px)`;
    });

    // Create and position clones
    if (this.options.cloneCount > 0) {
      for (let i = 0; i < this.options.cloneCount; i++) {
        const offset = totalSize * (i + 1);
        
        this.contentElements.forEach((original, index) => {
          const clone = original.cloneNode(true) as HTMLElement;
          clone.setAttribute('aria-hidden', 'true');
          clone.style.transform = ['left', 'right'].includes(this.options.direction)
            ? `translateX(${metrics[index].position + offset}px)`
            : `translateY(${metrics[index].position + offset}px)`;
          
          // Add separator style to clone if not last element
          this.addSeparatorStyle(clone);
          
          this.clones.push(clone);
          this.wrapper?.appendChild(clone);
        });
      }
    }
  }

  private cloneElements(): void {
    if (this.options.cloneCount === 0) return;

    const metrics = this.calculateMetrics();
    const totalSize = metrics[0].size + metrics[0].spacing;

    for (let i = 0; i < this.options.cloneCount; i++) {
      const clone = this.element.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      clone.style.position = 'absolute';
      clone.style.transform = ['left', 'right'].includes(this.options.direction)
        ? `translateX(${totalSize * (i + 1)}px)`
        : `translateY(${totalSize * (i + 1)}px)`;
      
      // Add separator style if not last clone
      this.addSeparatorStyle(clone);

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
    this.contentElements.forEach(el => el.remove());
    this.contentElements = [];
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

  private addSeparatorStyle(element: HTMLElement): void {
    if (!this.options.separator || ['up', 'down'].includes(this.options.direction)) {
      return;
    }

    const className = `marquee-item-${Math.random().toString(36).substr(2, 9)}`;
    const style = document.createElement('style');
    
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
    this.separatorClasses.set(element, className);
  }

  // Add new methods for content list management
  public addContent(content: string): void {
    // Implementation will come in next step
  }

  public replaceContentList(newContentList: string[]): void {
    // Implementation will come in next step
  }
}

interface ElementMetrics {
  size: number;
  spacing: number;
  separatorSpace: number;
}