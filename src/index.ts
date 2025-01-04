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
    addContent(content: string | string[], addToStart: boolean = false) { instance.addContent(content, addToStart) },
    replaceContentList(newContentList: string[]) { instance.replaceContentList(newContentList) },
    getContentList() { return instance.getContentList() },
    updateSpeed(speed: number) { instance.updateSpeed(speed) },
    updateGap(gap: number) { instance.updateGap(gap) },
    updateDirection(direction: 'left' | 'right' | 'up' | 'down') { instance.updateDirection(direction) },
    updateSeparator(separator: string) { instance.updateSeparator(separator) },
    updateCloneCount(cloneCount: number) { instance.updateCloneCount(cloneCount) },
    updateContainerHeight(containerHeight: number) { instance.updateContainerHeight(containerHeight) },
    updatePauseOnHover(pauseOnHover: boolean) { instance.updatePauseOnHover(pauseOnHover) }
  }
}

export type { MarqueeOptions, MarqueeInstance }
