import type { MarqueeOptions } from '../types';
import { OptionsValidator } from './OptionsValidator';
import { AnimationManager } from './AnimationManager';
import { EventManager } from './EventManager';

export class Marquee {
  private element: HTMLElement;
  private options: Required<MarqueeOptions>;
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
    easing: 'linear',
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

    OptionsValidator.validate(options);
    this.element = element as HTMLElement;
    this.options = { ...this.defaultOptions, ...options };
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
    }
  }

  private setupWrapper(): void {
    this.wrapper = document.createElement('div');
    this.wrapper.style.position = 'relative';
    this.wrapper.style.overflow = 'hidden';
    this.wrapper.style.width = '100%';
    this.element.parentNode?.insertBefore(this.wrapper, this.element);
    this.wrapper.appendChild(this.element);
  }

  private cloneElements(): void {
    for (let i = 0; i < this.options.cloneCount; i++) {
      const clone = this.element.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
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
      this.wrapper.remove();
    }
  }
}