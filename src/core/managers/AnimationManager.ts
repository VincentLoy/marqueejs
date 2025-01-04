import type { MarqueeOptions } from '../types'

export class AnimationManager {
  private element: HTMLElement
  private wrapper: HTMLElement
  private options: Required<MarqueeOptions>
  private animationFrame: number | null = null
  private lastTime: number = 0
  private elements: Array<{ el: HTMLElement; position: number }> = []

  constructor(element: HTMLElement, wrapper: HTMLElement, options: Required<MarqueeOptions>) {
    this.element = element
    this.wrapper = wrapper
    this.options = options
    this.setupElements()
  }

  private setupElements(): void {
    const groups = Array.from(this.wrapper.children) as HTMLElement[];
    const isHorizontal = ['left', 'right'].includes(this.options.direction);
    let currentPosition = 0;

    this.elements = groups.map(group => {
      // Calculate size including gap
      const size = isHorizontal 
        ? group.offsetWidth + this.options.gap
        : group.offsetHeight + this.options.gap;

      // Store current position for this element
      const position = currentPosition;
      
      // Position element
      group.style.position = 'absolute';
      group.style.top = '0';
      group.style.left = '0';
      group.style.transform = isHorizontal 
        ? `translate3d(${position}px, 0, 0)`
        : `translate3d(0, ${position}px, 0)`;

      // Update position for next element
      currentPosition += size;

      return {
        el: group,
        position
      };
    });
  }

  public startAnimation(): void {
    this.lastTime = performance.now()
    
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - this.lastTime
      this.lastTime = currentTime
      const movement = (this.options.speed * deltaTime) / 1000

      // Update each element's position independently
      this.elements.forEach((item) => {
        if (['left', 'right'].includes(this.options.direction)) {
          this.updateHorizontalPosition(item, movement)
        } else {
          this.updateVerticalPosition(item, movement)
        }
      })

      this.animationFrame = requestAnimationFrame(animate)
    }

    this.animationFrame = requestAnimationFrame(animate)
  }

  private isPositionAvailable(newPosition: number, currentElement: HTMLElement): boolean {
    const threshold = this.options.gap
    const isHorizontal = ['left', 'right'].includes(this.options.direction)
    
    return !this.elements.some(({ el, position }) => {
      if (el === currentElement) return false
      
      if (isHorizontal) {
        const elementWidth = el.offsetWidth
        return Math.abs(position - newPosition) < (elementWidth + threshold)
      } else {
        const elementHeight = el.offsetHeight
        return Math.abs(position - newPosition) < (elementHeight + threshold)
      }
    })
  }

  private updateHorizontalPosition(item: { el: HTMLElement; position: number }, movement: number): void {
    const containerWidth = this.wrapper.parentElement?.offsetWidth || 0
    const elementWidth = item.el.offsetWidth

    if (this.options.direction === 'left') {
      item.position -= movement
      
      if (item.position + elementWidth < 0) {
        const newPosition = containerWidth
        // Only reset if there's space available
        if (this.isPositionAvailable(newPosition, item.el)) {
          item.position = newPosition
        }
      }
    } else {
      item.position += movement
      
      if (item.position > containerWidth) {
        const newPosition = -elementWidth
        if (this.isPositionAvailable(newPosition, item.el)) {
          item.position = newPosition
        }
      }
    }

    item.el.style.transform = `translate3d(${item.position}px, 0, 0)`
  }

  private updateVerticalPosition(item: { el: HTMLElement; position: number }, movement: number): void {
    const containerHeight = this.wrapper.parentElement?.offsetHeight || 0
    const elementHeight = item.el.offsetHeight

    if (this.options.direction === 'up') {
      item.position -= movement
      if (item.position + elementHeight < 0) {
        const newPosition = containerHeight
        if (this.isPositionAvailable(newPosition, item.el)) {
          item.position = newPosition
        }
      }
    } else {
      item.position += movement
      if (item.position > containerHeight) {
        const newPosition = -elementHeight
        if (this.isPositionAvailable(newPosition, item.el)) {
          item.position = newPosition
        }
      }
    }

    item.el.style.transform = `translate3d(0, ${item.position}px, 0)`
  }

  public stopAnimation(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }
    this.lastTime = 0
  }

  public recalculatePositions(): void {
    // Stop current animation
    this.stopAnimation()
    
    // Reset and reinitialize positions
    this.setupElements()
    
    // Restart animation if it was running
    this.startAnimation()
  }
}
