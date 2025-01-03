export interface MarqueeOptions {
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  pauseOnHover?: boolean;
  gap?: number;
  easing?: string;
  cloneCount?: number;
}

export interface MarqueeInstance {
  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
  destroy(): void;
}
