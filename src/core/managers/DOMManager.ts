import type { MarqueeOptions, ElementMetrics } from '../../types';
import { CloneCalculator } from './CloneCalculator';

export class DOMManager {
  private container: HTMLElement;
  private wrapper: HTMLElement;
  private element: HTMLElement;
  private options: Required<MarqueeOptions>;
  private contentElements: HTMLElement[] = [];
  private clones: HTMLElement[] = [];
  private instanceId: string;
  private separatorStyleElement: HTMLStyleElement | null = null;
  private cloneCalculator: CloneCalculator;

  constructor(element: HTMLElement, options: Required<MarqueeOptions>) {
    this.instanceId = `marquee-${Math.random().toString(36).substr(2, 9)}`;
    this.element = element;
    this.options = options;
    this.container = this.createContainer();
    this.wrapper = this.createWrapper();
    this.cloneCalculator = new CloneCalculator(options.direction);
    
    // Vider l'élément original car tout passe par contentList
    this.element.innerHTML = '';
    
    this.setupDOM();
  }

  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.classList.add(this.instanceId, 'marquee-container');
    container.style.width = '100%';
    container.style.overflow = 'hidden';
    container.style.position = 'relative';
    return container;
  }

  private createWrapper(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.style.overflow = 'visible';
    wrapper.classList.add('marquee-wrapper');
    return wrapper;
  }

  public setupDOM(): void {
    const originalHeight = this.getMaxContentHeight();
    
    // Configure container height
    if (['up', 'down'].includes(this.options.direction) && this.options.containerHeight) {
      this.container.style.height = `${this.options.containerHeight}px`;
    } else {
      this.container.style.height = `${originalHeight}px`;
    }

    // Insert into DOM
    this.element.parentNode?.insertBefore(this.container, this.element);
    this.container.appendChild(this.wrapper);

    // Create content elements from contentList
    this.createContentElements();
  }

  public createContentElements(): void {
    // Clear existing elements
    this.clearElements();

    const fragment = document.createDocumentFragment();
    this.options.contentList.forEach((content, index) => {
      const element = this.createContentElement(content);
      this.contentElements.push(element);
      fragment.appendChild(element);
    });

    this.wrapper.appendChild(fragment);
    this.positionElements();
    this.createClones();
    
    // Ajouter les styles de séparateur après la création des éléments
    this.updateSeparatorStyles();
  }

  private clearElements(): void {
    this.contentElements.forEach(el => el.remove());
    this.clones.forEach(el => el.remove());
    this.contentElements = [];
    this.clones = [];
  }

  private getMaxContentHeight(): number {
    const temp = document.createElement('div');
    temp.style.position = 'absolute';
    temp.style.visibility = 'hidden';
    temp.style.left = '-9999px';
    document.body.appendChild(temp);

    const heights = this.options.contentList.map(content => {
      temp.innerHTML = content;
      return temp.offsetHeight;
    });

    document.body.removeChild(temp);
    return Math.max(...heights, 0);
  }

  private calculateMetrics(): ElementMetrics[] {
    const isHorizontal = ['left', 'right'].includes(this.options.direction);
    const metrics: ElementMetrics[] = [];
    let currentPosition = 0;

    this.contentElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const size = isHorizontal ? rect.width : rect.height;
      const separatorOffset = this.options.separator && index < this.contentElements.length - 1 
        ? this.options.gap / 2 
        : 0;

      metrics.push({
        size,
        spacing: this.options.gap,
        position: currentPosition,
        separatorOffset
      });

      currentPosition += size + this.options.gap;
    });

    return metrics;
  }

  private createContentElement(content: string): HTMLElement {
    const element = document.createElement('div');
    element.className = 'marquee-content-item';
    element.style.position = 'absolute';
    element.style.whiteSpace = ['up', 'down'].includes(this.options.direction) ? 'normal' : 'nowrap';
    element.innerHTML = content;
    return element; // Plus besoin d'ajouter la classe de séparateur ici
  }

  private positionElements(): void {
    const metrics = this.calculateMetrics();
    this.contentElements.forEach((el, i) => {
      const { position } = metrics[i];
      el.style.transform = ['left', 'right'].includes(this.options.direction)
        ? `translateX(${position}px)`
        : `translateY(${position}px)`;
    });
  }

  private createClones(): void {
    // Si cloneCount est 'auto', utiliser CloneCalculator
    const cloneCount = this.options.cloneCount === 'auto'
      ? this.cloneCalculator.calculateOptimalCloneCount(
          this.container,
          this.contentElements,
          this.options.gap
        )
      : this.options.cloneCount;

    if (cloneCount <= 0) return;

    const metrics = this.calculateMetrics();
    const totalSize = metrics.reduce((sum, m) => sum + m.size + m.spacing, 0);
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < cloneCount; i++) {
      const offset = totalSize * (i + 1);
      this.contentElements.forEach((original, index) => {
        const clone = original.cloneNode(true) as HTMLElement;
        clone.setAttribute('aria-hidden', 'true');
        clone.style.transform = ['left', 'right'].includes(this.options.direction)
          ? `translateX(${metrics[index].position + offset}px)`
          : `translateY(${metrics[index].position + offset}px)`;
        
        this.clones.push(clone);
        fragment.appendChild(clone);
      });
    }
    
    this.wrapper.appendChild(fragment);
  }

  private updateSeparatorStyles(): void {
    this.separatorStyleElement?.remove();

    if (!this.options.separator || ['up', 'down'].includes(this.options.direction)) {
      return;
    }

    const style = document.createElement('style');
    style.textContent = `
      .${this.instanceId} .marquee-content-item::before {
        content: '${this.options.separator}';
        position: absolute;
        left: -${this.options.gap / 2}px;
        transform: translateX(-50%);
        white-space: pre;
      }
    `;
    
    document.head.appendChild(style);
    this.separatorStyleElement = style;
  }

  private cleanupSeparatorStyles(): void {
    this.separatorStyleElement?.remove();
    this.separatorStyleElement = null;
  }

  public updateContent(newContent: string[]): void {
    this.options.contentList = newContent;
    this.cloneCalculator.invalidateCache();
    this.createContentElements();
  }

  // Méthode utilitaire pour forcer le recalcul des clones
  public recalculateClones(): void {
    this.cloneCalculator.invalidateCache();
    this.createContentElements();
  }

  public updateContainerHeight(height: number): void {
    if (this.container) {
      this.container.style.height = `${height}px`;
    }
  }

  public updateSeparators(): void {
    this.updateSeparatorStyles();
  }

  public getWrapper(): HTMLElement {
    return this.wrapper;
  }

  public getContainer(): HTMLElement {
    return this.container;
  }

  public getContentElements(): HTMLElement[] {
    return this.contentElements;
  }

  public destroy(): void {
    this.clearElements();
    if (this.wrapper.parentNode) {
      this.wrapper.parentNode.insertBefore(this.element, this.wrapper);
      this.container.remove();
    }
    this.cleanupSeparatorStyles();
    document.querySelector(`.${this.instanceId}`)?.remove();
  }
}