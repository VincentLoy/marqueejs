import type { MarqueeOptions } from '../types'

export class AnimationManager {
  private element: HTMLElement
  private wrapper: HTMLElement
  private options: Required<MarqueeOptions>
  private animationFrame: number | null = null

  constructor(element: HTMLElement, wrapper: HTMLElement, options: Required<MarqueeOptions>) {
    this.element = element
    this.wrapper = wrapper
    this.options = options
  }

  public startAnimation(): void {
    let position = 0
    const animate = () => {
      position -= this.options.speed / 60 // 60fps
      
      switch (this.options.direction) {
        case 'left':
          this.animateHorizontal(position)
          break
        case 'right':
          this.animateHorizontal(-position)
          break
        case 'up':
          this.animateVertical(position)
          break
        case 'down':
          this.animateVertical(-position)
          break
      }

      this.animationFrame = requestAnimationFrame(animate)
    }

    this.animationFrame = requestAnimationFrame(animate)
  }

  public stopAnimation(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }
  }

  private animateHorizontal(position: number): void {
    const elements = [this.element, ...Array.from(this.wrapper.children)] as HTMLElement[]
    elements.forEach((el, index) => {
      el.style.transform = `translateX(${position + (index * (el.offsetWidth + this.options.gap))}px)`
      el.style.transition = `transform ${this.options.easing}`
    })
  }

  private animateVertical(position: number): void {
    const elements = [this.element, ...Array.from(this.wrapper.children)] as HTMLElement[]
    elements.forEach((el, index) => {
      el.style.transform = `translateY(${position + (index * (el.offsetHeight + this.options.gap))}px)`
      el.style.transition = `transform ${this.options.easing}`
    })
  }
}
