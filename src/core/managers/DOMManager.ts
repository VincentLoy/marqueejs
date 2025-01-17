import type { MarqueeOptions, ElementMetrics } from "../../types";
import { CloneCalculator } from "./CloneCalculator";
import { ElementFactory } from "../factories/ElementFactory";
import { SeparatorManager } from "./SeparatorManager";
import { PositionManager } from "./PositionManager";

export class DOMManager {
  private container: HTMLElement;
  private animatedElement: HTMLElement;
  private element: HTMLElement;
  private options: Partial<MarqueeOptions>;
  private contentElements: HTMLElement[] = [];
  private clones: HTMLElement[] = [];
  private instanceId: string;
  private cloneCalculator: CloneCalculator;
  private isHorizontal: boolean;
  private separatorManager: SeparatorManager;

  constructor(element: HTMLElement, options: Partial<MarqueeOptions>) {
    this.isHorizontal = ["left", "right"].includes(options.direction!);
    this.instanceId = `marquee-${Math.random().toString(36).substring(2, 9)}`;
    this.element = element;
    this.options = options;
    this.container = ElementFactory.createContainer(this.element, this.instanceId);
    this.animatedElement = ElementFactory.createAnimatedElement(
      this.isHorizontal,
      this.options.gap!
    );
    this.separatorManager = new SeparatorManager(this.options, this.animatedElement);
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
    this.container.appendChild(this.animatedElement);

    // Create content elements from contentList
    this.createContentElements();
  }

  public async createContentElements(): Promise<void> {
    // Clear existing elements
    this.clearElements();

    const fragment = document.createDocumentFragment();
    this.options.contentList!.forEach((content) => {
      const element = ElementFactory.createContentElement(content, this.isHorizontal);
      this.contentElements.push(element);
      fragment.appendChild(element);
    });

    this.animatedElement.appendChild(fragment);
    this.positionElements();
    await this.createClones();

    // Add separator styles after creating elements
    this.updateSeparators();
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
      PositionManager.positionElement(el, position, this.isHorizontal);
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

        PositionManager.positionElement(clone, metrics[index].position + offset, this.isHorizontal);

        this.clones.push(clone);
        fragment.appendChild(clone);
      });
    }

    this.animatedElement.appendChild(fragment);
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

  public getAnimatedElement(): HTMLElement {
    return this.animatedElement;
  }

  public getContainer(): HTMLElement {
    return this.container;
  }

  public getContentElements(): HTMLElement[] {
    return this.contentElements;
  }

  public updateSeparators(): void {
    this.separatorManager.updateSeparators();
  }

  public destroy(): void {
    this.clearElements();
    if (this.animatedElement.parentNode) {
      this.animatedElement.parentNode.insertBefore(this.element, this.animatedElement);
      this.container.remove();
    }

    document.querySelector(`.${this.instanceId}`)?.remove();
  }
}
