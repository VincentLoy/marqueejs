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

    return container;
  }

  /**
   * Creates and configures an HTMLElement to serve as a wrapper for the marquee content.
   *
   * @returns {HTMLElement} A configured div element serving as the marquee wrapper
   */
  public static createWrapper(isHorizontal: boolean): HTMLElement {
    const wrapper = document.createElement("div");
    wrapper.classList.add("marquee-wrapper");
    wrapper.style.position = "relative";
    wrapper.style.width = "100%";
    wrapper.style.height = "100%";
    wrapper.style.overflow = "visible";
    wrapper.style.display = isHorizontal ? "flex" : "block";

    if (isHorizontal) {
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
  public static createContentElement(content: string, isHorizontal: boolean): HTMLElement {
    const element = document.createElement("div");
    const contentEl = document.createElement("div");
    element.className = "marquee-content-item";
    contentEl.classList.add("marquee-content");
    element.style.position = "absolute";
    element.style.whiteSpace = !isHorizontal ? "normal" : "nowrap";
    element.style.width = !isHorizontal ? "100%" : "auto";
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
