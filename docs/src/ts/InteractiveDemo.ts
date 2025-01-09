import { MarqueeInstance } from "../../../src/types";
import { marqueejs } from "../../../src/index";

export class InteractiveDemo {
  private instance: MarqueeInstance;
  private speedControl: HTMLInputElement;
  private speedValue: HTMLElement;
  private separatorInput: HTMLInputElement;
  private separatorSize: HTMLSelectElement;
  private separatorPreview: HTMLElement;
  private contentInput: HTMLInputElement;
  private contentPreview: HTMLElement;
  private patchIndex: HTMLInputElement;

  constructor() {
    this.init();
    this.bindEvents();
  }

  private init(): void {
    this.instance = marqueejs("#interactive-marquee", {
      speed: 100,
      direction: "left",
      contentList: ["Interactive Demo", "Play With The controls", "yes it's fun"],
      separator: " | ",
      gap: 75,
      heightSecurityMargin: 50,
    });

    // Get DOM elements
    this.speedControl = document.getElementById("speed-control") as HTMLInputElement;
    this.speedValue = document.getElementById("speed-value") as HTMLElement;
    this.separatorInput = document.getElementById("separator-input") as HTMLInputElement;
    this.separatorSize = document.getElementById("separator-size") as HTMLSelectElement;
    this.separatorPreview = document.getElementById("separator-preview") as HTMLElement;
    this.contentInput = document.getElementById("content-input") as HTMLInputElement;
    this.contentPreview = document.getElementById("content-preview") as HTMLElement;
    this.patchIndex = document.getElementById("patch-index") as HTMLInputElement;

    this.updateContentPreview();
    this.updateSeparatorPreview();
  }

  private updateSeparatorPreview(): void {
    const separator = this.separatorInput.value || "•";
    const size = this.separatorSize.value;
    this.separatorPreview.textContent = separator;
    this.separatorPreview.style.fontSize = size;
  }

  private updateContentPreview(): void {
    const currentContent = this.instance.getContentList();
    this.contentPreview.innerHTML = currentContent
      .map(
        (item, index) => `
      <div class="flex items-center gap-2 p-2 bg-gray-50 rounded">
        <span class="text-xs font-mono bg-gray-200 px-2 py-1 rounded">${index}</span>
        <span class="text-sm">${item}</span>
      </div>
    `
      )
      .join("");

    // Update patch index max
    this.patchIndex.max = (currentContent.length - 1).toString();
  }

  private bindEvents(): void {
    // Basic Controls
    document.getElementById("pause-btn")?.addEventListener("click", () => this.instance.pause());
    document.getElementById("resume-btn")?.addEventListener("click", () => this.instance.resume());
    document
      .getElementById("direction-btn")
      ?.addEventListener("click", () => this.instance.switchDirection());

    // Speed Control
    this.speedControl.addEventListener("input", (e) => {
      const speed = parseInt((e.target as HTMLInputElement).value);
      this.instance.updateSpeed(speed);
      this.speedValue.textContent = `${speed} px/s`;
    });

    // Content Management
    document.getElementById("add-start-btn")?.addEventListener("click", () => {
      const content = this.contentInput.value;
      if (content) {
        this.instance.addContent(content, true);
        this.updateContentPreview();
        this.contentInput.value = "";
      }
    });

    document.getElementById("add-end-btn")?.addEventListener("click", () => {
      const content = this.contentInput.value;
      if (content) {
        this.instance.addContent(content, false);
        this.updateContentPreview();
        this.contentInput.value = "";
      }
    });

    document.getElementById("replace-btn")?.addEventListener("click", () => {
      const content = this.contentInput.value;
      if (content) {
        this.instance.replaceContent([content]);
        this.updateContentPreview();
        this.contentInput.value = "";
      }
    });

    // Patch Content
    document.getElementById("patch-btn")?.addEventListener("click", () => {
      const content = this.contentInput.value;
      const index = parseInt(this.patchIndex.value);

      if (content && !isNaN(index)) {
        const currentContent = this.instance.getContentList();
        if (index >= 0 && index < currentContent.length) {
          currentContent[index] = content;
          this.instance.replaceContent(currentContent);
          this.updateContentPreview();
          this.contentInput.value = "";
        }
      }
    });

    // Separator Controls
    this.separatorInput.addEventListener("input", () => {
      this.updateSeparatorPreview();
    });

    this.separatorSize.addEventListener("change", () => {
      this.updateSeparatorPreview();
    });

    document.getElementById("apply-separator-btn")?.addEventListener("click", () => {
      const separator = this.separatorInput.value || "•";
      const size = this.separatorSize.value;
      this.instance.updateSeparator(separator);
      this.instance.updateSeparatorStyles(`font-size: ${size};`);
    });
  }
}
