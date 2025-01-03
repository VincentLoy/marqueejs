import type { MarqueeOptions } from '../types'

export class OptionsValidator {
  static validate(options: MarqueeOptions): void {
    this.validateSpeed(options.speed)
    this.validateDirection(options.direction)
    this.validateGap(options.gap)
    this.validateCloneCount(options.cloneCount)
    this.validateEasing(options.easing)
  }

  private static validateSpeed(speed: number | undefined): void {
    if (speed !== undefined && (typeof speed !== 'number' || speed <= 0)) {
      throw new Error('Speed must be a positive number')
    }
  }

  private static validateDirection(direction: string | undefined): void {
    const validDirections = ['left', 'right', 'up', 'down']
    if (direction && !validDirections.includes(direction)) {
      throw new Error(`Direction must be one of: ${validDirections.join(', ')}`)
    }
  }

  private static validateGap(gap: number | undefined): void {
    if (gap !== undefined && (typeof gap !== 'number' || gap < 0)) {
      throw new Error('Gap must be a non-negative number')
    }
  }

  private static validateCloneCount(count: number | undefined): void {
    if (count !== undefined && (!Number.isInteger(count) || count < 1)) {
      throw new Error('Clone count must be a positive integer')
    }
  }

  private static validateEasing(easing: string | undefined): void {
    const validEasings = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out']
    if (easing && !validEasings.includes(easing)) {
      throw new Error(`Easing must be one of: ${validEasings.join(', ')}`)
    }
  }
}
