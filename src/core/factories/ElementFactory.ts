import { MarqueeOptions } from "../../types";

export class ElementFactory {
  private instanceId: string;
  private options: Partial<MarqueeOptions>;
  private element: HTMLElement;
  private isHorizontal: boolean;

  constructor(element: HTMLElement, options: Partial<MarqueeOptions>) {
    this.isHorizontal = ["left", "right"].includes(options.direction!);
    this.options = options;
    this.instanceId = `marquee-${Math.random().toString(36).substring(2, 9)}`;
    this.element = element;
  }

  /**
   * Creates a container element for the marquee
   *
   * @returns {HTMLElement} - The container element
   */
  public createContainer(): HTMLElement {
    const container = document.createElement("div");
    const elementClasses = Array.from(this.element.classList);
    const elementId = this.element.id;

    container.classList.add(this.instanceId, "marquee-container");
    container.classList.add(...elementClasses);

    if (elementId) {
      container.id = elementId;
    }

    container.style.width = "100%";
    container.style.overflow = "hidden";

    return container;
  }

  /**
   * Creates and configures an HTMLElement to serve as a wrapper for the marquee content.
   *
   * @returns {HTMLElement} A configured div element serving as the marquee wrapper
   */
  public createWrapper(): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.classList.add("marquee-wrapper");
    wrapper.style.position = "relative";
    wrapper.style.width = "100%";
    wrapper.style.height = "100%";
    wrapper.style.overflow = "visible";
    wrapper.style.display = this.isHorizontal ? "flex" : "block";

    if (this.isHorizontal) {
      wrapper.style.alignItems = "center";
    }

    return wrapper;
  }

  /**
   * Creates a new HTMLElement to contain marquee content.
   *
   * @param content - The string content to be displayed inside the marquee element
   * @returns An HTMLElement configured with the appropriate styling and content
   */
  public createContentElement(content: string): HTMLElement {
    const element = document.createElement("div");
    element.className = "marquee-content-item";
    element.style.position = "absolute";
    element.style.whiteSpace = !this.isHorizontal ? "normal" : "nowrap";
    element.style.width = !this.isHorizontal ? "100%" : "auto";
    element.style.willChange = "transform";
    element.innerHTML = content;
    return element;
  }

  /**
   * Creates and configures a separator element for the marquee.
   * The separator element is a span that contains the configured separator content
   * and styles.
   *
   * @returns {HTMLElement} A new span element configured as a marquee separator
   */
  public createSeparatorElement(): HTMLElement {
    const separator = document.createElement("span");
    separator.className = "marquee-separator";
    separator.innerHTML = `<span style="display: inline-block; ${this.options.separatorStyles}">${this.options.separator}</span>`;
    separator.style.position = "absolute";
    separator.style.whiteSpace = "pre";
    return separator;
  }
}
