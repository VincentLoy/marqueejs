import type { MarqueeOptions, EventHandlers } from "../../types";

export class EventManager {
  private animatedElement: HTMLElement;
  private options: Partial<MarqueeOptions>;
  private handlers: EventHandlers;

  constructor(
    _element: HTMLElement,
    animatedElement: HTMLElement,
    options: Partial<MarqueeOptions>,
    handlers: EventHandlers
  ) {
    this.animatedElement = animatedElement;
    this.options = options;
    this.handlers = handlers;
    this.init();
  }

  private init(): void {
    this.setupHoverEvents();
    this.setupTouchEvents();
    this.setupVisibilityEvents();
    this.setupResizeEvent();
  }

  private setupHoverEvents(): void {
    if (this.options.pauseOnHover) {
      this.animatedElement.addEventListener("mouseenter", this.handlers.pause);
      this.animatedElement.addEventListener("mouseleave", this.handlers.resume);
    }
  }

  private setupTouchEvents(): void {
    let touchStartX: number;
    let touchStartY: number;

    // Add passive touch start listener
    this.animatedElement.addEventListener(
      "touchstart",
      (e: TouchEvent) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        this.handlers.pause();
      },
      { passive: true }
    );

    // Add passive touch end listener
    this.animatedElement.addEventListener(
      "touchend",
      () => {
        this.handlers.resume();
      },
      { passive: true }
    );

    // Separate touch move handler that can prevent default
    const handleTouchMove = (e: TouchEvent) => {
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;

      if (
        Math.abs(deltaX) > Math.abs(deltaY) &&
        ["left", "right"].includes(this.options.direction!)
      ) {
        e.preventDefault();
      } else if (
        Math.abs(deltaY) > Math.abs(deltaX) &&
        ["up", "down"].includes(this.options.direction!)
      ) {
        e.preventDefault();
      }
    };

    // Add non-passive touch move listener only when needed
    if (["left", "right", "up", "down"].includes(this.options.direction!)) {
      this.animatedElement.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
    } else {
      this.animatedElement.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
    }
  }

  private setupVisibilityEvents(): void {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.handlers.pause();
      } else {
        this.handlers.resume();
      }
    });
  }

  private setupResizeEvent(): void {
    window.addEventListener("resize", this.debounce(this.handlers.resize, 200));
  }

  private debounce(fn: Function, delay: number): () => void {
    let timer: number | null = null;
    return (...args: any[]) => {
      if (timer) clearTimeout(timer);

      timer = window.setTimeout(() => fn(...args), delay);
    };
  }

  public destroy(): void {
    if (this.options.pauseOnHover) {
      this.animatedElement.removeEventListener("mouseenter", this.handlers.pause);
      this.animatedElement.removeEventListener("mouseleave", this.handlers.resume);
    }

    this.animatedElement.removeEventListener("touchstart", this.handlers.pause);
    this.animatedElement.removeEventListener("touchend", this.handlers.resume);
    document.removeEventListener("visibilitychange", this.handlers.pause);
  }
}
