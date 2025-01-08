import type { MarqueeOptions, ElementMetrics } from "../../types";
import { CloneCalculator } from "./CloneCalculator";

export class DOMManager {
  private container: HTMLElement;
  private wrapper: HTMLElement;
  private element: HTMLElement;
  private options: Partial<MarqueeOptions>;
  private contentElements: HTMLElement[] = [];
  private clones: HTMLElement[] = [];
  private instanceId: string;
  private separatorElements: HTMLElement[] = [];
  private cloneCalculator: CloneCalculator;

  constructor(element: HTMLElement, options: Partial<MarqueeOptions>) {
    this.instanceId = `marquee-${Math.random().toString(36).substring(2, 9)}`;
    this.element = element;
    this.options = options;
    this.container = this.createContainer();
    this.wrapper = this.createWrapper();
    this.cloneCalculator = new CloneCalculator(options.direction!);

    // Clear original element since everything goes through contentList
    this.element.innerHTML = "";

    this.setupDOM();
  }

  private createContainer(): HTMLElement {
    const container = document.createElement("div");
    container.classList.add(this.instanceId, "marquee-container");
    const elementClasses = Array.from(this.element.classList);
    const elementId = this.element.id;
    container.classList.add(...elementClasses);
    if (elementId) container.id = elementId;
    container.style.width = "100%";
    container.style.overflow = "hidden";
    return container;
  }

  private createWrapper(): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.width = "100%";
    wrapper.style.height = "100%";
    wrapper.style.overflow = "visible";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.classList.add("marquee-wrapper");
    return wrapper;
  }

  public setupDOM(): void {
    const originalHeight = this.getMaxContentHeight();

    // Configure container height
    if (["up", "down"].includes(this.options.direction!) && this.options.containerHeight) {
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
      const element = this.createContentElement(content);
      this.contentElements.push(element);
      fragment.appendChild(element);
    });

    this.wrapper.appendChild(fragment);
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
    const isHorizontal = ["left", "right"].includes(this.options.direction!);
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

  private createContentElement(content: string): HTMLElement {
    const element = document.createElement("div");
    element.className = "marquee-content-item";
    element.style.position = "absolute";
    element.style.whiteSpace = ["up", "down"].includes(this.options.direction!)
      ? "normal"
      : "nowrap";
    element.style.width = ["up", "down"].includes(this.options.direction!) ? "100%" : "auto";
    element.innerHTML = content;
    return element;
  }

  private positionElements(): void {
    const metrics = this.calculateMetrics();
    this.contentElements.forEach((el, i) => {
      const { position } = metrics[i];
      el.style.transform = ["left", "right"].includes(this.options.direction!)
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
        clone.style.transform = ["left", "right"].includes(this.options.direction!)
          ? `translate3d(${metrics[index].position + offset}px, 0, 0)`
          : `translate3d(0, ${metrics[index].position + offset}px, 0)`;

        this.clones.push(clone);
        fragment.appendChild(clone);
      });
    }

    this.wrapper.appendChild(fragment);
  }

  private createSeparatorElement(): HTMLElement {
    const separator = document.createElement("span");
    separator.className = "marquee-separator";
    separator.innerHTML = `<span style="display: inline-block; ${this.options.separatorStyles}">${this.options.separator}</span>`;
    separator.style.position = "absolute";
    separator.style.whiteSpace = "pre";
    this.separatorElements.push(separator);
    return separator;
  }

  private updateSeparators(): void {
    // Cleanup existing separators
    this.separatorElements.forEach((el) => el.remove());
    this.separatorElements = [];
    const elements = this.wrapper.querySelectorAll(".marquee-content-item");

    if (!this.options.separator || ["up", "down"].includes(this.options.direction!)) {
      return;
    }

    // Create new separators between items
    elements.forEach((el) => {
      const separator = this.createSeparatorElement();
      el.appendChild(separator);
      const elRect = el.getBoundingClientRect();
      const separatorRect = separator.getBoundingClientRect();

      // Position separator in the middle of the gap
      const left = elRect.width - separatorRect.width / 2 + this.options.gap! / 2;
      separator.style.left = `${left}px`;
      separator.style.top = "50%";
      separator.style.lineHeight = "0.70";
      separator.style.transform = "translateY(-50%)";
    });
  }

  private clearSeparatorElements(): void {
    this.separatorElements.forEach((el) => el.remove());
    this.separatorElements = [];
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
    this.clearSeparatorElements();
    document.querySelector(`.${this.instanceId}`)?.remove();
  }
}
