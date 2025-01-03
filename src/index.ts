import type { MarqueeOptions, MarqueeInstance } from './types'

const defaultOptions: MarqueeOptions = {
  speed: 100,
  direction: 'left',
  pauseOnHover: true,
  gap: 20,
  easing: 'linear',
  cloneCount: 1
}

export function marqueejs(selector: string, options: MarqueeOptions = {}): MarqueeInstance {
  const elements = document.querySelectorAll(selector)
  const mergedOptions = { ...defaultOptions, ...options }
  
  // Basic instance implementation - will be expanded later
  return {
    start() {},
    stop() {},
    pause() {},
    resume() {},
    destroy() {}
  }
}

export type { MarqueeOptions, MarqueeInstance }

console.log("Hello via Bun!");