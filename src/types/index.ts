export interface MarqueeOptions {
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  pauseOnHover?: boolean;
  gap?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  cloneCount?: number;
  separator?: string;
}

export interface MarqueeInstance {
  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
  destroy(): void;
}
