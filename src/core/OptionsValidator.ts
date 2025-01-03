import type { MarqueeOptions } from '../types'

export class OptionsValidator {
  static readonly MAX_CLONES = 50;
  static readonly MIN_CLONES = 0;

  static validate(options: MarqueeOptions): MarqueeOptions {
    this.validateSpeed(options.speed)
    this.validateDirection(options.direction)
    this.validateGap(options.gap)
    
    // Handle clone count separately to return modified options
    if (options.cloneCount !== undefined) {
      if (!Number.isInteger(options.cloneCount) || options.cloneCount < 0) {
        console.warn(`MarqueeJS: Requested ${options.cloneCount} clones, but minimum is ${this.MIN_CLONES}. Using ${this.MIN_CLONES} clones instead.`)
        options.cloneCount = this.MIN_CLONES
      }
      if (options.cloneCount > this.MAX_CLONES) {
        console.warn(`MarqueeJS: Requested ${options.cloneCount} clones, but maximum is ${this.MAX_CLONES}. Using ${this.MAX_CLONES} clones instead.`)
        options.cloneCount = this.MAX_CLONES
      }
    }

    return options
  }

  private static validateSpeed(speed: number | undefined): void {
    if (speed !== undefined && (typeof speed !== 'number' || speed <= 0)) {
      throw new Error('MarqueeJS: Speed must be a positive number')
    }
  }

  private static validateDirection(direction: string | undefined): void {
    const validDirections = ['left', 'right', 'up', 'down']
    if (direction && !validDirections.includes(direction)) {
      throw new Error(`MarqueeJS: Direction must be one of: ${validDirections.join(', ')}`)
    }
  }

  private static validateGap(gap: number | undefined): void {
    if (gap !== undefined && (typeof gap !== 'number' || gap < 0)) {
      throw new Error('MarqueeJS: Gap must be a non-negative number')
    }
  }

  private static validateCloneCount(count: number | undefined): void {
    if (count !== undefined && (!Number.isInteger(count) || count < 1)) {
      throw new Error('MarqueeJS: Clone count must be a positive integer')
    }
  }
}
