var u = Object.defineProperty;
var d = (r, t, e) => t in r ? u(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var a = (r, t, e) => d(r, typeof t != "symbol" ? t + "" : t, e);
class m {
  static validate(t) {
    this.validateSpeed(t.speed), this.validateDirection(t.direction), this.validateGap(t.gap), this.validateCloneCount(t.cloneCount), this.validateEasing(t.easing);
  }
  static validateSpeed(t) {
    if (t !== void 0 && (typeof t != "number" || t <= 0))
      throw new Error("Speed must be a positive number");
  }
  static validateDirection(t) {
    const e = ["left", "right", "up", "down"];
    if (t && !e.includes(t))
      throw new Error(`Direction must be one of: ${e.join(", ")}`);
  }
  static validateGap(t) {
    if (t !== void 0 && (typeof t != "number" || t < 0))
      throw new Error("Gap must be a non-negative number");
  }
  static validateCloneCount(t) {
    if (t !== void 0 && (!Number.isInteger(t) || t < 1))
      throw new Error("Clone count must be a positive integer");
  }
  static validateEasing(t) {
    const e = ["linear", "ease", "ease-in", "ease-out", "ease-in-out"];
    if (t && !e.includes(t))
      throw new Error(`Easing must be one of: ${e.join(", ")}`);
  }
}
class f {
  constructor(t, e, i) {
    a(this, "element");
    a(this, "wrapper");
    a(this, "options");
    a(this, "animationFrame", null);
    a(this, "lastTime", 0);
    a(this, "elements", []);
    this.element = t, this.wrapper = e, this.options = i, this.setupElements();
  }
  setupElements() {
    var n, o;
    const t = ((n = this.wrapper.parentElement) == null ? void 0 : n.offsetWidth) || 0, e = ((o = this.wrapper.parentElement) == null ? void 0 : o.offsetHeight) || 0, i = this.element.offsetWidth + this.options.gap, s = this.element.offsetHeight + this.options.gap;
    this.elements = Array.from(this.wrapper.children).map((p, c) => {
      const l = p;
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
      return l.style.position = "absolute", l.style.top = "0", l.style.left = "0", l.style.transform = ["left", "right"].includes(this.options.direction) ? `translateX(${h}px)` : `translateY(${h}px)`, l.style.transition = "transform linear", { el: l, position: h };
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
    return !this.elements.some(({ el: n, position: o }) => {
      if (n === e) return !1;
      if (s) {
        const p = n.offsetWidth;
        return Math.abs(o - t) < p + i;
      } else {
        const p = n.offsetHeight;
        return Math.abs(o - t) < p + i;
      }
    });
  }
  updateHorizontalPosition(t, e) {
    var n;
    const i = ((n = this.wrapper.parentElement) == null ? void 0 : n.offsetWidth) || 0, s = t.el.offsetWidth;
    if (this.options.direction === "left") {
      if (t.position -= e, t.position + s < 0) {
        const o = i;
        this.isPositionAvailable(o, t.el) && (t.position = o);
      }
    } else if (t.position += e, t.position > i) {
      const o = -s;
      this.isPositionAvailable(o, t.el) && (t.position = o);
    }
    t.el.style.transform = `translateX(${t.position}px)`;
  }
  updateVerticalPosition(t, e) {
    var n;
    const i = ((n = this.wrapper.parentElement) == null ? void 0 : n.offsetHeight) || 0, s = t.el.offsetHeight;
    if (this.options.direction === "up") {
      if (t.position -= e, t.position + s < 0) {
        const o = i;
        this.isPositionAvailable(o, t.el) && (t.position = o);
      }
    } else if (t.position += e, t.position > i) {
      const o = -s;
      this.isPositionAvailable(o, t.el) && (t.position = o);
    }
    t.el.style.transform = `translateY(${t.position}px)`;
  }
  stopAnimation() {
    this.animationFrame && (cancelAnimationFrame(this.animationFrame), this.animationFrame = null), this.lastTime = 0;
  }
}
class v {
  constructor(t, e, i, s) {
    a(this, "wrapper");
    a(this, "options");
    a(this, "handlers");
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
      const n = s.touches[0].clientX - t, o = s.touches[0].clientY - e;
      (Math.abs(n) > Math.abs(o) && ["left", "right"].includes(this.options.direction) || Math.abs(o) > Math.abs(n) && ["up", "down"].includes(this.options.direction)) && s.preventDefault();
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
    a(this, "element");
    a(this, "options");
    a(this, "container", null);
    a(this, "wrapper", null);
    a(this, "clones", []);
    a(this, "isPlaying", !1);
    a(this, "animationManager", null);
    a(this, "eventManager", null);
    a(this, "defaultOptions", {
      speed: 100,
      direction: "left",
      pauseOnHover: !0,
      gap: 20,
      easing: "linear",
      cloneCount: 1,
      separator: " - "
    });
    const i = typeof t == "string" ? document.querySelector(t) : t;
    if (!i)
      throw new Error("Invalid element selector");
    m.validate(e), this.element = i, this.options = { ...this.defaultOptions, ...e }, this.init();
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
    this.container = document.createElement("div"), this.container.style.width = "100%", this.container.style.height = `${t}px`, this.container.style.overflow = "hidden", this.container.style.position = "relative", this.container.classList.add("marquee-container"), this.wrapper = document.createElement("div"), this.wrapper.style.position = "relative", this.wrapper.style.width = "100%", this.wrapper.style.height = "100%", this.wrapper.classList.add("marquee-wrapper"), this.element.style.position = "absolute", this.element.style.top = "0", this.element.style.left = "0", this.element.style.flexShrink = "0", this.element.style.height = ["up", "down"].includes(this.options.direction) ? "auto" : `${t}px`, ["left", "right"].includes(this.options.direction) ? this.element.style.marginRight = `${this.options.gap}px` : this.element.style.marginBottom = `${this.options.gap}px`, (e = this.element.parentNode) == null || e.insertBefore(this.container, this.element), this.container.appendChild(this.wrapper), this.wrapper.appendChild(this.element);
  }
  cloneElements() {
    var t;
    if (this.options.cloneCount !== 0)
      for (let e = 0; e < this.options.cloneCount; e++) {
        const i = this.element.cloneNode(!0);
        i.setAttribute("aria-hidden", "true"), i.style.flexShrink = "0", ["left", "right"].includes(this.options.direction) ? i.style.marginRight = `${this.options.gap}px` : i.style.marginBottom = `${this.options.gap}px`, this.clones.push(i), (t = this.wrapper) == null || t.appendChild(i);
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
    this.pause(), (t = this.animationManager) == null || t.stopAnimation(), (e = this.eventManager) == null || e.destroy(), this.clones.forEach((n) => n.remove()), (i = this.wrapper) != null && i.parentNode && (this.wrapper.parentNode.insertBefore(this.element, this.wrapper), (s = this.container) == null || s.remove());
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
    }
  };
}
export {
  y as marqueejs
};
//# sourceMappingURL=marqueejs.js.map
