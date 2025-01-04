import type { MarqueeOptions } from '../types'

export class EventManager {
  private wrapper: HTMLElement
  private options: Required<MarqueeOptions>
  private handlers: {
    pause: () => void
    resume: () => void
  }

  constructor(
    _element: HTMLElement, 
    wrapper: HTMLElement, 
    options: Required<MarqueeOptions>,
    handlers: { pause: () => void; resume: () => void }
  ) {
    this.wrapper = wrapper
    this.options = options
    this.handlers = handlers
    this.init()
  }

  private init(): void {
    this.setupHoverEvents()
    this.setupTouchEvents()
    this.setupVisibilityEvents()
  }

  private setupHoverEvents(): void {
    if (this.options.pauseOnHover) {
      this.wrapper.addEventListener('mouseenter', this.handlers.pause)
      this.wrapper.addEventListener('mouseleave', this.handlers.resume)
    }
  }

  private setupTouchEvents(): void {
    let touchStartX: number
    let touchStartY: number

    // Add passive touch start listener
    this.wrapper.addEventListener('touchstart', (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
      this.handlers.pause()
    }, { passive: true })

    // Add passive touch end listener
    this.wrapper.addEventListener('touchend', () => {
      this.handlers.resume()
    }, { passive: true })

    // Separate touch move handler that can prevent default
    const handleTouchMove = (e: TouchEvent) => {
      const deltaX = e.touches[0].clientX - touchStartX
      const deltaY = e.touches[0].clientY - touchStartY
      
      if (Math.abs(deltaX) > Math.abs(deltaY) && 
         ['left', 'right'].includes(this.options.direction)) {
        e.preventDefault()
      } else if (Math.abs(deltaY) > Math.abs(deltaX) && 
                ['up', 'down'].includes(this.options.direction)) {
        e.preventDefault()
      }
    }

    // Add non-passive touch move listener only when needed
    if (['left', 'right', 'up', 'down'].includes(this.options.direction)) {
      this.wrapper.addEventListener('touchmove', handleTouchMove, { passive: false })
    } else {
      this.wrapper.addEventListener('touchmove', handleTouchMove, { passive: true })
    }
  }

  private setupVisibilityEvents(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handlers.pause()
      } else {
        this.handlers.resume()
      }
    })
  }

  public destroy(): void {
    if (this.options.pauseOnHover) {
      this.wrapper.removeEventListener('mouseenter', this.handlers.pause)
      this.wrapper.removeEventListener('mouseleave', this.handlers.resume)
    }
    
    this.wrapper.removeEventListener('touchstart', this.handlers.pause, { passive: true })
    this.wrapper.removeEventListener('touchend', this.handlers.resume, { passive: true })
    document.removeEventListener('visibilitychange', this.handlers.pause)
  }
}
