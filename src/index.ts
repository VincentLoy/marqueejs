import { Marquee } from "./core/Marquee";
import type { MarqueeOptions, MarqueeInstance } from "./types";

export function marqueejs(selector: string, options: MarqueeOptions = {}): MarqueeInstance {
  const instance = new Marquee(selector, options);

  return {
    pause() {
      instance.pause();
    },
    resume() {
      instance.play();
    },
    destroy() {
      instance.destroy();
    },
    addContent(
      content: string | string[],
      addToStart: boolean = false,
      reset: boolean = false,
      callback?: () => void
    ) {
      instance.addContent(content, addToStart, reset, callback);
    },
    replaceContent(newContentList: string[], callback?: () => void) {
      instance.replaceContent(newContentList, callback);
    },
    getContentList() {
      return instance.getContentList();
    },
    updateSpeed(speed: number) {
      instance.updateSpeed(speed);
    },
    updateGap(gap: number) {
      instance.updateGap(gap);
    },
    updateSeparator(separator: string) {
      instance.updateSeparator(separator);
    },
    updateSeparatorStyles(styles: Partial<CSSStyleDeclaration>) {
      instance.updateSeparatorStyles(styles);
    },
    updateCloneCount(cloneCount: number) {
      instance.updateCloneCount(cloneCount);
    },
    updateContainerHeight(containerHeight: number) {
      instance.updateContainerHeight(containerHeight);
    },
    updatePauseOnHover(pauseOnHover: boolean) {
      instance.updatePauseOnHover(pauseOnHover);
    },
    recalculatePositions() {
      instance.recalculatePositions();
    },
    randomize() {
      instance.randomize();
    },
    switchDirection() {
      instance.switchDirection();
    },
    patchContent(
      content: string | string[],
      position: "start" | "end",
      reset: boolean = false,
      callback?: () => void
    ) {
      instance.patchContent(content, position, reset, callback);
    },
  };
}

export type { MarqueeOptions, MarqueeInstance };
