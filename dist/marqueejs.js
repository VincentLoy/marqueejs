var d = Object.defineProperty;
var m = (r, t, e) => t in r ? d(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var o = (r, t, e) => m(r, typeof t != "symbol" ? t + "" : t, e);
class u {
  static validate(t) {
    return this.validateSpeed(t.speed), this.validateDirection(t.direction), this.validateGap(t.gap), t.cloneCount !== void 0 && ((!Number.isInteger(t.cloneCount) || t.cloneCount < 0) && (console.warn(`MarqueeJS: Requested ${t.cloneCount} clones, but minimum is ${this.MIN_CLONES}. Using ${this.MIN_CLONES} clones instead.`), t.cloneCount = this.MIN_CLONES), t.cloneCount > this.MAX_CLONES && (console.warn(`MarqueeJS: Requested ${t.cloneCount} clones, but maximum is ${this.MAX_CLONES}. Using ${this.MAX_CLONES} clones instead.`), t.cloneCount = this.MAX_CLONES)), ["up", "down"].includes(t.direction || "") && t.separator && (console.warn("MarqueeJS: Separator is not supported for vertical directions. Separator will be ignored."), t.separator = ""), t;
  }
  static validateSpeed(t) {
    if (t !== void 0 && (typeof t != "number" || t <= 0))
      throw new Error("MarqueeJS: Speed must be a positive number");
  }
  static validateDirection(t) {
    const e = ["left", "right", "up", "down"];
    if (t && !e.includes(t))
      throw new Error(`MarqueeJS: Direction must be one of: ${e.join(", ")}`);
  }
  static validateGap(t) {
    if (t !== void 0 && (typeof t != "number" || t < 0))
      throw new Error("MarqueeJS: Gap must be a non-negative number");
  }
}
o(u, "MAX_CLONES", 15), o(u, "MIN_CLONES", 0);
class f {
  constructor(t, e, i) {
    o(this, "element");
    o(this, "wrapper");
    o(this, "options");
    o(this, "animationFrame", null);
    o(this, "lastTime", 0);
    o(this, "elements", []);
    this.element = t, this.wrapper = e, this.options = i, this.setupElements();
  }
  setupElements() {
    var n, a;
    const t = ((n = this.wrapper.parentElement) == null ? void 0 : n.offsetWidth) || 0, e = ((a = this.wrapper.parentElement) == null ? void 0 : a.offsetHeight) || 0, i = this.element.offsetWidth + this.options.gap, s = this.element.offsetHeight + this.options.gap;
    this.elements = Array.from(this.wrapper.children).map((l, c) => {
      const p = l;
      let h = 0;
      switch (this.options.direction) {
        case "left":
          h = c * i;
          break;
        case "right":
          h = t - (c + 1) * i;
          break;
        case "up":
          h = c * s;
          break;
        case "down":
          h = e - (c + 1) * s;
          break;
      }
      return p.style.position = "absolute", p.style.top = "0", p.style.left = "0", p.style.transform = ["left", "right"].includes(this.options.direction) ? `translateX(${h}px)` : `translateY(${h}px)`, p.style.transition = "transform linear", { el: p, position: h };
    });
  }
  startAnimation() {
    this.lastTime = performance.now();
    const t = (e) => {
      const i = e - this.lastTime;
      this.lastTime = e;
      const s = this.options.speed * i / 1e3;
      this.elements.forEach((n) => {
        ["left", "right"].includes(this.options.direction) ? this.updateHorizontalPosition(n, s) : this.updateVerticalPosition(n, s);
      }), this.animationFrame = requestAnimationFrame(t);
    };
    this.animationFrame = requestAnimationFrame(t);
  }
  isPositionAvailable(t, e) {
    const i = this.options.gap, s = ["left", "right"].includes(this.options.direction);
    return !this.elements.some(({ el: n, position: a }) => {
      if (n === e) return !1;
      if (s) {
        const l = n.offsetWidth;
        return Math.abs(a - t) < l + i;
      } else {
        const l = n.offsetHeight;
        return Math.abs(a - t) < l + i;
      }
    });
  }
  updateHorizontalPosition(t, e) {
    var n;
    const i = ((n = this.wrapper.parentElement) == null ? void 0 : n.offsetWidth) || 0, s = t.el.offsetWidth;
    if (this.options.direction === "left") {
      if (t.position -= e, t.position + s < 0) {
        const a = i;
        this.isPositionAvailable(a, t.el) && (t.position = a);
      }
    } else if (t.position += e, t.position > i) {
      const a = -s;
      this.isPositionAvailable(a, t.el) && (t.position = a);
    }
    t.el.style.transform = `translateX(${t.position}px)`;
  }
  updateVerticalPosition(t, e) {
    var n;
    const i = ((n = this.wrapper.parentElement) == null ? void 0 : n.offsetHeight) || 0, s = t.el.offsetHeight;
    if (this.options.direction === "up") {
      if (t.position -= e, t.position + s < 0) {
        const a = i;
        this.isPositionAvailable(a, t.el) && (t.position = a);
      }
    } else if (t.position += e, t.position > i) {
      const a = -s;
      this.isPositionAvailable(a, t.el) && (t.position = a);
    }
    t.el.style.transform = `translateY(${t.position}px)`;
  }
  stopAnimation() {
    this.animationFrame && (cancelAnimationFrame(this.animationFrame), this.animationFrame = null), this.lastTime = 0;
  }
  recalculatePositions() {
    this.stopAnimation(), this.setupElements(), this.startAnimation();
  }
}
class v {
  constructor(t, e, i, s) {
    o(this, "wrapper");
    o(this, "options");
    o(this, "handlers");
    this.wrapper = e, this.options = i, this.handlers = s, this.init();
  }
  init() {
    this.setupHoverEvents(), this.setupTouchEvents(), this.setupVisibilityEvents();
  }
  setupHoverEvents() {
    this.options.pauseOnHover && (this.wrapper.addEventListener("mouseenter", this.handlers.pause), this.wrapper.addEventListener("mouseleave", this.handlers.resume));
  }
  setupTouchEvents() {
    let t, e;
    this.wrapper.addEventListener("touchstart", (s) => {
      t = s.touches[0].clientX, e = s.touches[0].clientY, this.handlers.pause();
    }, { passive: !0 }), this.wrapper.addEventListener("touchend", () => {
      this.handlers.resume();
    }, { passive: !0 });
    const i = (s) => {
      const n = s.touches[0].clientX - t, a = s.touches[0].clientY - e;
      (Math.abs(n) > Math.abs(a) && ["left", "right"].includes(this.options.direction) || Math.abs(a) > Math.abs(n) && ["up", "down"].includes(this.options.direction)) && s.preventDefault();
    };
    ["left", "right", "up", "down"].includes(this.options.direction) ? this.wrapper.addEventListener("touchmove", i, { passive: !1 }) : this.wrapper.addEventListener("touchmove", i, { passive: !0 });
  }
  setupVisibilityEvents() {
    document.addEventListener("visibilitychange", () => {
      document.hidden ? this.handlers.pause() : this.handlers.resume();
    });
  }
  destroy() {
    this.options.pauseOnHover && (this.wrapper.removeEventListener("mouseenter", this.handlers.pause), this.wrapper.removeEventListener("mouseleave", this.handlers.resume)), this.wrapper.removeEventListener("touchstart", this.handlers.pause, { passive: !0 }), this.wrapper.removeEventListener("touchend", this.handlers.resume, { passive: !0 }), document.removeEventListener("visibilitychange", this.handlers.pause);
  }
}
class g {
  constructor(t, e = {}) {
    o(this, "element");
    o(this, "options");
    o(this, "container", null);
    o(this, "wrapper", null);
    o(this, "clones", []);
    o(this, "isPlaying", !1);
    o(this, "animationManager", null);
    o(this, "eventManager", null);
    o(this, "separatorClasses", /* @__PURE__ */ new WeakMap());
    o(this, "defaultOptions", {
      speed: 100,
      direction: "left",
      pauseOnHover: !1,
      gap: 20,
      cloneCount: 4,
      separator: ""
    });
    const i = typeof t == "string" ? document.querySelector(t) : t;
    if (!i)
      throw new Error("Invalid element selector");
    const s = u.validate(e);
    this.element = i, this.options = { ...this.defaultOptions, ...s }, this.init();
  }
  init() {
    this.setupWrapper(), this.cloneElements(), this.wrapper && (this.animationManager = new f(this.element, this.wrapper, this.options), this.eventManager = new v(
      this.element,
      this.wrapper,
      this.options,
      {
        pause: () => this.pause(),
        resume: () => this.play()
      }
    ), this.play());
  }
  setupWrapper() {
    var e;
    const t = this.element.offsetHeight;
    this.container = document.createElement("div"), this.container.style.width = "100%", this.container.style.height = `${t}px`, this.container.style.overflow = "hidden", this.container.style.position = "relative", this.container.classList.add("marquee-container"), this.wrapper = document.createElement("div"), this.wrapper.style.position = "relative", this.wrapper.style.width = "100%", this.wrapper.style.height = "100%", this.wrapper.classList.add("marquee-wrapper"), this.element.style.position = "absolute", this.element.style.top = "0", this.element.style.left = "0", this.element.style.flexShrink = "0", this.element.style.height = ["up", "down"].includes(this.options.direction) ? "auto" : `${t}px`, ["left", "right"].includes(this.options.direction) ? this.element.style.marginRight = `${this.options.gap}px` : this.element.style.marginBottom = `${this.options.gap}px`, (e = this.element.parentNode) == null || e.insertBefore(this.container, this.element), this.container.appendChild(this.wrapper), this.wrapper.appendChild(this.element), this.addSeparatorStyle(this.element);
  }
  cloneElements() {
    var t;
    if (this.options.cloneCount !== 0)
      for (let e = 0; e < this.options.cloneCount; e++) {
        const i = this.element.cloneNode(!0);
        i.setAttribute("aria-hidden", "true"), i.style.flexShrink = "0", ["left", "right"].includes(this.options.direction) ? i.style.marginRight = `${this.options.gap}px` : i.style.marginBottom = `${this.options.gap}px`, this.addSeparatorStyle(i, e === this.options.cloneCount - 1), this.clones.push(i), (t = this.wrapper) == null || t.appendChild(i);
      }
  }
  play() {
    this.isPlaying || (this.isPlaying = !0, this.startAnimation());
  }
  pause() {
    this.isPlaying && (this.isPlaying = !1, this.stopAnimation());
  }
  startAnimation() {
    var t;
    (t = this.animationManager) == null || t.startAnimation();
  }
  stopAnimation() {
    var t;
    (t = this.animationManager) == null || t.stopAnimation();
  }
  destroy() {
    var t, e, i, s;
    this.pause(), (t = this.animationManager) == null || t.stopAnimation(), (e = this.eventManager) == null || e.destroy(), this.clones.forEach((n) => n.remove()), (i = this.wrapper) != null && i.parentNode && (this.wrapper.parentNode.insertBefore(this.element, this.wrapper), (s = this.container) == null || s.remove()), document.querySelectorAll("style").forEach((n) => {
      var a;
      (a = n.textContent) != null && a.includes("marquee-item-") && n.remove();
    }), this.clones.forEach((n) => {
      var l;
      const a = this.separatorClasses.get(n);
      a && ((l = document.querySelector(`style[data-for="${a}"]`)) == null || l.remove());
    }), [this.element, ...this.clones].forEach((n) => this.cleanupSeparatorStyle(n));
  }
  updateContent(t) {
    this.element.innerHTML = t, this.clones.forEach((e) => {
      e.innerHTML = t;
    }), this.wrapper && this.animationManager && this.animationManager.recalculatePositions(), this.addSeparatorStyle(this.element), this.clones.forEach((e, i) => {
      this.addSeparatorStyle(e, i === this.clones.length - 1);
    });
  }
  cleanupSeparatorStyle(t) {
    Array.from(t.classList).filter((e) => e.startsWith("marquee-item-")).forEach((e) => {
      var i;
      t.classList.remove(e), (i = document.querySelector(`style[data-for="${e}"]`)) == null || i.remove();
    });
  }
  addSeparatorStyle(t, e = !1) {
    if (this.options.gap === 0 || this.options.cloneCount === 0 || !this.options.separator || ["up", "down"].includes(this.options.direction)) {
      this.cleanupSeparatorStyle(t);
      return;
    }
    this.cleanupSeparatorStyle(t);
    const i = `marquee-item-${Math.random().toString(36).substr(2, 9)}`, s = document.createElement("style");
    t.classList.add("marquee-item"), t.classList.add(i), s.setAttribute("data-for", i), s.textContent = `
      .${i}::before {
        content: '${this.options.separator}';
        position: absolute;
        left: -${this.options.gap / 2}px;
        transform: translateX(-50%);
        white-space: pre;
      }
    `, document.head.appendChild(s);
  }
}
function y(r, t = {}) {
  const e = new g(r, t);
  return {
    start() {
      e.play();
    },
    stop() {
      e.pause();
    },
    pause() {
      e.pause();
    },
    resume() {
      e.play();
    },
    destroy() {
      e.destroy();
    },
    updateContent(i) {
      e.updateContent(i);
    }
  };
}
export {
  y as marqueejs
};
//# sourceMappingURL=marqueejs.js.map
