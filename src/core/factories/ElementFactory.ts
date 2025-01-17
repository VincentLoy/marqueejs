/**
 * Factory class responsible for creating and configuring DOM elements for the marquee component.
 *
 * @class ElementFactory
 *
 * @property {string} instanceId - Unique identifier for the marquee instance
 * @property {Partial<MarqueeOptions>} options - Configuration options for the marquee
 * @property {HTMLElement} element - The base HTML element to transform into a marquee
 * @property {boolean} isHorizontal - Indicates if the marquee scrolls horizontally
 */
export class ElementFactory {
  /**
   * Creates a container element for the marquee
   *
   * @returns {HTMLElement} - The container element
   */
  public static createContainer(element: HTMLElement, instanceId: string): HTMLElement {
    const container = document.createElement("div");
    const elementClasses = Array.from(element.classList);
    const elementId = element.id?.length ? element.id : undefined;

    container.classList.add(instanceId, "marquee-container");
    container.classList.add(...elementClasses);

    if (elementId) {
      container.id = elementId;
    }

    container.style.width = "100%";
    container.style.overflow = "hidden";
    container.style.display = "flex";
    container.style.alignItems = "center";

    return container;
  }

  public static createAnimatedElement(isHorizontal: boolean, gap: number): HTMLElement {
    const animatedElement = document.createElement("div");
    animatedElement.classList.add("marquee-animated-element");
    animatedElement.style.display = "flex";
    animatedElement.style.flexWrap = "nowrap";
    animatedElement.style.gap = `${gap}px`;
    animatedElement.style.width = "max-content";
    animatedElement.style.flexDirection = isHorizontal ? "row" : "column";
    animatedElement.style.border = "1px solid red";

    return animatedElement;
  }

  /**
   * Creates a new HTMLElement to contain marquee content.
   *
   * @param content - The string content to be displayed inside the marquee element
   * @returns An HTMLElement configured with the appropriate styling and content
   */
  public static createContentElement(content: string, isHorizontal: boolean): HTMLElement {
    const element = document.createElement("div");
    const contentEl = document.createElement("div");
    element.className = "marquee-content-item";
    contentEl.classList.add("marquee-content");
    contentEl.style.border = "1px solid green";
    element.appendChild(contentEl);
    contentEl.innerHTML = content;
    return element;
  }

  /**
   * Creates and configures a separator element for the marquee.
   * The separator element is a span that contains the configured separator content
   * and styles.
   *
   * @returns {HTMLElement} A new span element configured as a marquee separator
   */
  public static createSeparatorElement(theSeparator: string, separatorStyles: string): HTMLElement {
    const separator = document.createElement("span");
    separator.className = "marquee-separator";
    separator.innerHTML = `<span style="display: inline-block; ${separatorStyles}">${theSeparator}</span>`;
    separator.style.whiteSpace = "pre";
    return separator;
  }
}
