var d = Object.defineProperty;
var m = (r, e, t) => e in r ? d(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var n = (r, e, t) => m(r, typeof e != "symbol" ? e + "" : e, t);
class u {
  static validate(e) {
    return this.validateSpeed(e.speed), this.validateDirection(e.direction), this.validateGap(e.gap), e.cloneCount !== void 0 && ((!Number.isInteger(e.cloneCount) || e.cloneCount < 0) && (console.warn(`MarqueeJS: Requested ${e.cloneCount} clones, but minimum is ${this.MIN_CLONES}. Using ${this.MIN_CLONES} clones instead.`), e.cloneCount = this.MIN_CLONES), e.cloneCount > this.MAX_CLONES && (console.warn(`MarqueeJS: Requested ${e.cloneCount} clones, but maximum is ${this.MAX_CLONES}. Using ${this.MAX_CLONES} clones instead.`), e.cloneCount = this.MAX_CLONES)), e;
  }
  static validateSpeed(e) {
    if (e !== void 0 && (typeof e != "number" || e <= 0))
      throw new Error("MarqueeJS: Speed must be a positive number");
  }
  static validateDirection(e) {
    const t = ["left", "right", "up", "down"];
    if (e && !t.includes(e))
      throw new Error(`MarqueeJS: Direction must be one of: ${t.join(", ")}`);
  }
  static validateGap(e) {
    if (e !== void 0 && (typeof e != "number" || e < 0))
      throw new Error("MarqueeJS: Gap must be a non-negative number");
  }
  static validateCloneCount(e) {
    if (e !== void 0 && (!Number.isInteger(e) || e < 1))
      throw new Error("MarqueeJS: Clone count must be a positive integer");
  }
}
n(u, "MAX_CLONES", 50), n(u, "MIN_CLONES", 0);
class f {
  constructor(e, t, i) {
    n(this, "element");
    n(this, "wrapper");
    n(this, "options");
    n(this, "animationFrame", null);
    n(this, "lastTime", 0);
    n(this, "elements", []);
    this.element = e, this.wrapper = t, this.options = i, this.setupElements();
  }
  setupElements() {
    var o, a;
    const e = ((o = this.wrapper.parentElement) == null ? void 0 : o.offsetWidth) || 0, t = ((a = this.wrapper.parentElement) == null ? void 0 : a.offsetHeight) || 0, i = this.element.offsetWidth + this.options.gap, s = this.element.offsetHeight + this.options.gap;
    this.elements = Array.from(this.wrapper.children).map((p, c) => {
      const l = p;
      let h = 0;
      switch (this.options.direction) {
        case "left":
          h = c * i;
          break;
        case "right":
          h = e - (c + 1) * i;
          break;
        case "up":
          h = c * s;
          break;
        case "down":
          h = t - (c + 1) * s;
          break;
      }
      return l.style.position = "absolute", l.style.top = "0", l.style.left = "0", l.style.transform = ["left", "right"].includes(this.options.direction) ? `translateX(${h}px)` : `translateY(${h}px)`, l.style.transition = "transform linear", { el: l, position: h };
    });
  }
  startAnimation() {
    this.lastTime = performance.now();
    const e = (t) => {
      const i = t - this.lastTime;
      this.lastTime = t;
      const s = this.options.speed * i / 1e3;
      this.elements.forEach((o) => {
        ["left", "right"].includes(this.options.direction) ? this.updateHorizontalPosition(o, s) : this.updateVerticalPosition(o, s);
      }), this.animationFrame = requestAnimationFrame(e);
    };
    this.animationFrame = requestAnimationFrame(e);
  }
  isPositionAvailable(e, t) {
    const i = this.options.gap, s = ["left", "right"].includes(this.options.direction);
    return !this.elements.some(({ el: o, position: a }) => {
      if (o === t) return !1;
      if (s) {
        const p = o.offsetWidth;
        return Math.abs(a - e) < p + i;
      } else {
        const p = o.offsetHeight;
        return Math.abs(a - e) < p + i;
      }
    });
  }
  updateHorizontalPosition(e, t) {
    var o;
    const i = ((o = this.wrapper.parentElement) == null ? void 0 : o.offsetWidth) || 0, s = e.el.offsetWidth;
    if (this.options.direction === "left") {
      if (e.position -= t, e.position + s < 0) {
        const a = i;
        this.isPositionAvailable(a, e.el) && (e.position = a);
      }
    } else if (e.position += t, e.position > i) {
      const a = -s;
      this.isPositionAvailable(a, e.el) && (e.position = a);
    }
    e.el.style.transform = `translateX(${e.position}px)`;
  }
  updateVerticalPosition(e, t) {
    var o;
    const i = ((o = this.wrapper.parentElement) == null ? void 0 : o.offsetHeight) || 0, s = e.el.offsetHeight;
    if (this.options.direction === "up") {
      if (e.position -= t, e.position + s < 0) {
        const a = i;
        this.isPositionAvailable(a, e.el) && (e.position = a);
      }
    } else if (e.position += t, e.position > i) {
      const a = -s;
      this.isPositionAvailable(a, e.el) && (e.position = a);
    }
    e.el.style.transform = `translateY(${e.position}px)`;
  }
  stopAnimation() {
    this.animationFrame && (cancelAnimationFrame(this.animationFrame), this.animationFrame = null), this.lastTime = 0;
  }
}
class v {
  constructor(e, t, i, s) {
    n(this, "wrapper");
    n(this, "options");
    n(this, "handlers");
    this.wrapper = t, this.options = i, this.handlers = s, this.init();
  }
  init() {
    this.setupHoverEvents(), this.setupTouchEvents(), this.setupVisibilityEvents();
  }
  setupHoverEvents() {
    this.options.pauseOnHover && (this.wrapper.addEventListener("mouseenter", this.handlers.pause), this.wrapper.addEventListener("mouseleave", this.handlers.resume));
  }
  setupTouchEvents() {
    let e, t;
    this.wrapper.addEventListener("touchstart", (s) => {
      e = s.touches[0].clientX, t = s.touches[0].clientY, this.handlers.pause();
    }, { passive: !0 }), this.wrapper.addEventListener("touchend", () => {
      this.handlers.resume();
    }, { passive: !0 });
    const i = (s) => {
      const o = s.touches[0].clientX - e, a = s.touches[0].clientY - t;
      (Math.abs(o) > Math.abs(a) && ["left", "right"].includes(this.options.direction) || Math.abs(a) > Math.abs(o) && ["up", "down"].includes(this.options.direction)) && s.preventDefault();
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
class w {
  constructor(e, t = {}) {
    n(this, "element");
    n(this, "options");
    n(this, "container", null);
    n(this, "wrapper", null);
    n(this, "clones", []);
    n(this, "isPlaying", !1);
    n(this, "animationManager", null);
    n(this, "eventManager", null);
    n(this, "defaultOptions", {
      speed: 100,
      direction: "left",
      pauseOnHover: !0,
      gap: 20,
      cloneCount: 1,
      separator: " - "
    });
    const i = typeof e == "string" ? document.querySelector(e) : e;
    if (!i)
      throw new Error("Invalid element selector");
    const s = u.validate(t);
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
    var t;
    const e = this.element.offsetHeight;
    this.container = document.createElement("div"), this.container.style.width = "100%", this.container.style.height = `${e}px`, this.container.style.overflow = "hidden", this.container.style.position = "relative", this.container.classList.add("marquee-container"), this.wrapper = document.createElement("div"), this.wrapper.style.position = "relative", this.wrapper.style.width = "100%", this.wrapper.style.height = "100%", this.wrapper.classList.add("marquee-wrapper"), this.element.style.position = "absolute", this.element.style.top = "0", this.element.style.left = "0", this.element.style.flexShrink = "0", this.element.style.height = ["up", "down"].includes(this.options.direction) ? "auto" : `${e}px`, ["left", "right"].includes(this.options.direction) ? this.element.style.marginRight = `${this.options.gap}px` : this.element.style.marginBottom = `${this.options.gap}px`, (t = this.element.parentNode) == null || t.insertBefore(this.container, this.element), this.container.appendChild(this.wrapper), this.wrapper.appendChild(this.element);
  }
  cloneElements() {
    var e;
    if (this.options.cloneCount !== 0)
      for (let t = 0; t < this.options.cloneCount; t++) {
        const i = this.element.cloneNode(!0);
        i.setAttribute("aria-hidden", "true"), i.style.flexShrink = "0", ["left", "right"].includes(this.options.direction) ? i.style.marginRight = `${this.options.gap}px` : i.style.marginBottom = `${this.options.gap}px`, this.clones.push(i), (e = this.wrapper) == null || e.appendChild(i);
      }
  }
  play() {
    this.isPlaying || (this.isPlaying = !0, this.startAnimation());
  }
  pause() {
    this.isPlaying && (this.isPlaying = !1, this.stopAnimation());
  }
  startAnimation() {
    var e;
    (e = this.animationManager) == null || e.startAnimation();
  }
  stopAnimation() {
    var e;
    (e = this.animationManager) == null || e.stopAnimation();
  }
  destroy() {
    var e, t, i, s;
    this.pause(), (e = this.animationManager) == null || e.stopAnimation(), (t = this.eventManager) == null || t.destroy(), this.clones.forEach((o) => o.remove()), (i = this.wrapper) != null && i.parentNode && (this.wrapper.parentNode.insertBefore(this.element, this.wrapper), (s = this.container) == null || s.remove());
  }
}
function y(r, e = {}) {
  const t = new w(r, e);
  return {
    start() {
      t.play();
    },
    stop() {
      t.pause();
    },
    pause() {
      t.pause();
    },
    resume() {
      t.play();
    },
    destroy() {
      t.destroy();
    }
  };
}
export {
  y as marqueejs
};
//# sourceMappingURL=marqueejs.js.map
