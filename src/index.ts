import { Marquee } from './core/Marquee'
import type { MarqueeOptions, MarqueeInstance } from './types'

export function marqueejs(selector: string, options: MarqueeOptions = {}): MarqueeInstance {
  const instance = new Marquee(selector, options)
  
  return {
    start() { instance.play() },
    stop() { instance.pause() },
    pause() { instance.pause() },
    resume() { instance.play() },
    destroy() { instance.destroy() },
    updateContent(content: string) { instance.updateContent(content) }
  }
}

export type { MarqueeOptions, MarqueeInstance }
