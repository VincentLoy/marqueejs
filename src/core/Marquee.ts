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

  private defaultOptions: Required<MarqueeOptions> = {
    speed: 100,
    direction: 'left',
    pauseOnHover: true,
    gap: 20,
    cloneCount: 1,
    separator: ' - '
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
  }
}