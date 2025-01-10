import type { MarqueeOptions, ElementMetrics } from "../../types";
import { CloneCalculator } from "./CloneCalculator";
import { ElementFactory } from "../factories/ElementFactory";
import { SeparatorManager } from "./SeparatorManager";

export class DOMManager {
  private container: HTMLElement;
  private wrapper: HTMLElement;
  private element: HTMLElement;
  private options: Partial<MarqueeOptions>;
  private contentElements: HTMLElement[] = [];
  private clones: HTMLElement[] = [];
  private instanceId: string;
  private cloneCalculator: CloneCalculator;
  private isHorizontal: boolean;
  private elementFactory: ElementFactory;
  private separatorManager: SeparatorManager;

  constructor(element: HTMLElement, options: Partial<MarqueeOptions>) {
    this.isHorizontal = ["left", "right"].includes(options.direction!);
    this.instanceId = `marquee-${Math.random().toString(36).substring(2, 9)}`;
    this.element = element;
    this.options = options;
    this.elementFactory = new ElementFactory(this.element, this.options);
    this.container = this.elementFactory.createContainer();
    this.wrapper = this.elementFactory.createWrapper();
    this.separatorManager = new SeparatorManager(this.element, this.options, this.wrapper);
    this.cloneCalculator = new CloneCalculator(options.direction!);
    // Clear original element since everything goes through contentList
    this.element.innerHTML = "";

    this.setupDOM();
  }

  public setupDOM(): void {
    const originalHeight = this.getMaxContentHeight();

    // Configure container height
    if (!this.isHorizontal && this.options.containerHeight) {
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

  public async createContentElements(): Promise<void> {
    // Clear existing elements
    this.clearElements();

    const fragment = document.createDocumentFragment();
    this.options.contentList!.forEach((content) => {
      const element = this.elementFactory.createContentElement(content);
      this.contentElements.push(element);
      fragment.appendChild(element);
    });

    this.wrapper.appendChild(fragment);
    this.positionElements();
    await this.createClones();

    // Add separator styles after creating elements
    this.separatorManager.updateSeparators();
  }

  private clearElements(): void {
    this.contentElements.forEach((el) => el.remove());
    this.clones.forEach((el) => el.remove());
    this.contentElements = [];
    this.clones = [];
  }

  private getMaxContentHeight(): number {
    const temp = document.createElement("div");
    const heightSecurityMargin = this.options.heightSecurityMargin || 0;
    temp.style.position = "absolute";
    temp.style.visibility = "hidden";
    temp.style.left = "-9999px";
    document.body.appendChild(temp);

    const heights = this.options.contentList!.map((content) => {
      temp.innerHTML = content;
      return temp.offsetHeight + heightSecurityMargin;
    });

    document.body.removeChild(temp);
    return Math.max(...heights, 0);
  }

  private calculateMetrics(): ElementMetrics[] {
    const isHorizontal = this.isHorizontal;
    const metrics: ElementMetrics[] = [];
    let currentPosition = 0;

    this.contentElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const size = isHorizontal ? rect.width : rect.height;

      metrics.push({
        size,
        spacing: this.options.gap!,
        position: currentPosition,
      });

      currentPosition += size + this.options.gap!;
    });

    return metrics;
  }

  private positionElements(): void {
    const metrics = this.calculateMetrics();
    this.contentElements.forEach((el, i) => {
      const { position } = metrics[i];
      el.style.transform = this.isHorizontal
        ? `translate3d(${position}px, 0, 0)`
        : `translate3d(0, ${position}px, 0)`;
    });
  }

  private async createClones(): Promise<void> {
    // If cloneCount is 'auto', use CloneCalculator
    const cloneCount =
      this.options.cloneCount === "auto"
        ? this.cloneCalculator.calculateOptimalCloneCount(
            this.container,
            this.contentElements,
            this.options.gap!
          )
        : this.options.cloneCount!;

    if (cloneCount! <= 0) return;

    const metrics = this.calculateMetrics();
    const totalSize = metrics.reduce((sum, m) => sum + m.size + m.spacing, 0);
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < cloneCount; i++) {
      const offset = totalSize * (i + 1);
      this.contentElements.forEach((original, index) => {
        const clone = original.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        clone.classList.add("marquee-cloned-item");
        clone.style.transform = this.isHorizontal
          ? `translate3d(${metrics[index].position + offset}px, 0, 0)`
          : `translate3d(0, ${metrics[index].position + offset}px, 0)`;

        this.clones.push(clone);
        fragment.appendChild(clone);
      });
    }

    this.wrapper.appendChild(fragment);
  }

  // Utility method to force recalculation of clones
  public recalculateClones(): void {
    this.cloneCalculator.invalidateCache();
    this.createContentElements();
  }

  public updateContainerHeight(height: number): void {
    if (this.container) {
      this.container.style.height = `${height}px`;
    }
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

    document.querySelector(`.${this.instanceId}`)?.remove();
  }
}
