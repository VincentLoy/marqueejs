var g = Object.defineProperty;
var E = (d, t, e) => t in d ? g(d, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : d[t] = e;
var a = (d, t, e) => E(d, typeof t != "symbol" ? t + "" : t, e);
const m = class m {
  static validate(t) {
    if (this.validateSpeed(t.speed), this.validateDirection(t.direction), this.validateGap(t.gap), t.contentValidation ? t.contentValidation = {
      maxLength: t.contentValidation.maxLength || this.DEFAULT_MAX_LENGTH,
      forbiddenTags: [...this.FORBIDDEN_TAGS, ...t.contentValidation.forbiddenTags || []],
      forbiddenAttributes: [
        ...this.FORBIDDEN_ATTRIBUTES,
        ...t.contentValidation.forbiddenAttributes || []
      ]
    } : t.contentValidation = this.DEFAULT_VALIDATION_OPTIONS, t.contentList) {
      const e = this.validateContentList(t.contentList, t);
      e.isValid || (console.warn(
        "MarqueeJS: Content list validation failed:",
        e.errors.map((n) => n.message).join(", ")
      ), t.contentList = t.contentList.filter(
        (n, i) => !e.errors.some((s) => s.index === i)
      ));
    }
    return t.cloneCount !== void 0 && (t.cloneCount === "auto" || (!Number.isInteger(t.cloneCount) || t.cloneCount < 0 ? (console.warn(
      `MarqueeJS: Requested ${t.cloneCount} clones, but minimum is ${this.MIN_CLONES}. Using ${this.MIN_CLONES} clones instead.`
    ), t.cloneCount = this.MIN_CLONES) : typeof t.cloneCount == "number" && t.cloneCount > this.MAX_CLONES && (console.warn(
      `MarqueeJS: Requested ${t.cloneCount} clones, but maximum is ${this.MAX_CLONES}. Using ${this.MAX_CLONES} clones instead.`
    ), t.cloneCount = this.MAX_CLONES))), ["up", "down"].includes(t.direction || "") && t.separator && (console.warn(
      "MarqueeJS: Separator is not supported for vertical directions. Separator will be ignored."
    ), t.separator = ""), this.validateContainerHeight(t.containerHeight, t.direction), this.validateKeepOriginalContent(t.keepOriginalContent), this.validateContentValidationOptions(t.contentValidation), t;
  }
  static validateContentList(t, e) {
    var r, l, c;
    const n = [];
    if (!Array.isArray(t))
      return {
        isValid: !1,
        errors: [
          {
            type: "INVALID_HTML",
            message: "Content list must be an array of strings"
          }
        ]
      };
    const i = {
      ...this.DEFAULT_VALIDATION_OPTIONS,
      ...e.contentValidation,
      forbiddenTags: [...this.FORBIDDEN_TAGS, ...((r = e.contentValidation) == null ? void 0 : r.forbiddenTags) || []],
      forbiddenAttributes: [
        ...this.FORBIDDEN_ATTRIBUTES,
        ...((l = e.contentValidation) == null ? void 0 : l.forbiddenAttributes) || []
      ],
      maxLength: ((c = e.contentValidation) == null ? void 0 : c.maxLength) || this.DEFAULT_MAX_LENGTH
    }, s = new RegExp(
      `</?(?:${i.forbiddenTags.join("|")})\\b[^>]*>`,
      "i"
    ), o = new RegExp(
      i.forbiddenAttributes.map((h) => `${h}\\s*=\\s*["']?[^"']*["']?`).join("|"),
      "i"
    );
    for (let h = 0; h < t.length; h++) {
      const p = t[h];
      if (!p || typeof p != "string") {
        n.push({
          type: "EMPTY_CONTENT",
          message: "Content item must be a non-empty string",
          index: h,
          content: p
        });
        continue;
      }
      if (s.test(p)) {
        n.push({
          type: "UNSAFE_TAG_DETECTED",
          message: "Content contains forbidden HTML tags",
          index: h,
          content: p.substring(0, 50) + "..."
        });
        continue;
      }
      if (o.test(p)) {
        n.push({
          type: "UNSAFE_ATTRIBUTES",
          message: "Content contains forbidden HTML attributes",
          index: h,
          content: p.substring(0, 50) + "..."
        });
        continue;
      }
      p.length > i.maxLength && n.push({
        type: "MAX_LENGTH_EXCEEDED",
        message: `Content item exceeds maximum length of ${i.maxLength} characters`,
        index: h,
        content: p.substring(0, 50) + "..."
      });
    }
    return {
      isValid: n.length === 0,
      errors: n
    };
  }
  static validateContentValidationOptions(t) {
    if (t.maxLength !== void 0 && (typeof t.maxLength != "number" || t.maxLength <= 0))
      throw new Error("MarqueeJS: maxLength must be a positive number");
    if (t.forbiddenTags !== void 0 && (!Array.isArray(t.forbiddenTags) || t.forbiddenTags.some((e) => typeof e != "string")))
      throw new Error("MarqueeJS: forbiddenTags must be an array of strings");
    if (t.forbiddenAttributes !== void 0 && (!Array.isArray(t.forbiddenAttributes) || t.forbiddenAttributes.some((e) => typeof e != "string")))
      throw new Error("MarqueeJS: forbiddenAttributes must be an array of strings");
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
  static validateContainerHeight(t, e) {
    if (t !== void 0) {
      if (typeof t != "number" || t <= 0)
        throw new Error("MarqueeJS: Container height must be a positive number");
      ["up", "down"].includes(e || "") || console.warn(
        'MarqueeJS: Container height is only applicable for "up" and "down" directions. Ignoring containerHeight.'
      );
    }
  }
  static validateKeepOriginalContent(t) {
    if (t !== void 0 && typeof t != "boolean")
      throw new Error("MarqueeJS: keepOriginalContent must be a boolean");
  }
  static validateCloneCount(t) {
    if (t !== "auto" && (!Number.isInteger(t) || t < 0 || t > this.MAX_CLONES))
      throw new Error(
        `MarqueeJS: cloneCount must be 'auto' or an integer between ${this.MIN_CLONES} and ${this.MAX_CLONES}`
      );
  }
};
a(m, "MAX_CLONES", 30), a(m, "MIN_CLONES", 0), a(m, "DEFAULT_MAX_LENGTH", 8500), a(m, "FORBIDDEN_TAGS", [
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "form",
  "svg",
  "input",
  "button",
  "meta",
  "link",
  "head",
  "html",
  "body"
]), a(m, "FORBIDDEN_ATTRIBUTES", [
  "onclick",
  "onmouseover",
  "onmouseout",
  "onload",
  "onerror",
  "onsubmit",
  "formaction",
  "xlink:href",
  "action",
  "javascript"
]), a(m, "DEFAULT_VALIDATION_OPTIONS", {
  maxLength: m.DEFAULT_MAX_LENGTH,
  forbiddenTags: m.FORBIDDEN_TAGS,
  forbiddenAttributes: m.FORBIDDEN_ATTRIBUTES
});
let u = m;
class C {
  constructor(t, e) {
    a(this, "wrapper");
    a(this, "options");
    a(this, "animationFrame", null);
    a(this, "lastTime", 0);
    a(this, "elements", []);
    this.wrapper = t, this.options = e, this.setupElements();
  }
  setupElements() {
    const t = Array.from(this.wrapper.children), e = ["left", "right"].includes(this.options.direction);
    let n = 0;
    this.elements = t.map((i) => {
      const s = e ? i.offsetWidth + this.options.gap : i.offsetHeight + this.options.gap, o = n;
      return i.style.position = "absolute", i.style.top = "0", i.style.left = "0", i.style.transform = e ? `translate3d(${o}px, 0, 0)` : `translate3d(0, ${o}px, 0)`, n += s, {
        el: i,
        position: o
      };
    });
  }
  startAnimation() {
    this.lastTime = performance.now();
    const t = (e) => {
      const n = e - this.lastTime;
      this.lastTime = e;
      const i = this.options.speed * n / 1e3;
      this.elements.forEach((s) => {
        ["left", "right"].includes(this.options.direction) ? this.updateHorizontalPosition(s, i) : this.updateVerticalPosition(s, i);
      }), this.animationFrame = requestAnimationFrame(t);
    };
    this.animationFrame = requestAnimationFrame(t);
  }
  isPositionAvailable(t, e) {
    const n = this.options.gap, i = ["left", "right"].includes(this.options.direction);
    return !this.elements.some(({ el: s, position: o }) => {
      if (s === e) return !1;
      if (i) {
        const r = s.offsetWidth;
        return Math.abs(o - t) < r + n;
      } else {
        const r = s.offsetHeight;
        return Math.abs(o - t) < r + n;
      }
    });
  }
  updateHorizontalPosition(t, e) {
    var s;
    const n = ((s = this.wrapper.parentElement) == null ? void 0 : s.offsetWidth) || 0, i = t.el.offsetWidth;
    if (this.options.direction === "left") {
      if (t.position -= e, t.position + i < 0) {
        const o = n;
        this.isPositionAvailable(o, t.el) && (t.position = o);
      }
    } else if (t.position += e, t.position > n) {
      const o = -i;
      this.isPositionAvailable(o, t.el) && (t.position = o);
    }
    t.el.style.transform = `translate3d(${t.position}px, 0, 0)`;
  }
  updateVerticalPosition(t, e) {
    var s;
    const n = ((s = this.wrapper.parentElement) == null ? void 0 : s.offsetHeight) || 0, i = t.el.offsetHeight;
    if (this.options.direction === "up") {
      if (t.position -= e, t.position + i < 0) {
        const o = n;
        this.isPositionAvailable(o, t.el) && (t.position = o);
      }
    } else if (t.position += e, t.position > n) {
      const o = -i;
      this.isPositionAvailable(o, t.el) && (t.position = o);
    }
    t.el.style.transform = `translate3d(0, ${t.position}px, 0)`;
  }
  stopAnimation() {
    this.animationFrame && (cancelAnimationFrame(this.animationFrame), this.animationFrame = null), this.lastTime = 0;
  }
  recalculatePositions() {
    this.stopAnimation(), this.setupElements(), this.startAnimation();
  }
}
class f {
  constructor(t, e, n, i) {
    a(this, "wrapper");
    a(this, "options");
    a(this, "handlers");
    this.wrapper = e, this.options = n, this.handlers = i, this.init();
  }
  init() {
    this.setupHoverEvents(), this.setupTouchEvents(), this.setupVisibilityEvents();
  }
  setupHoverEvents() {
    this.options.pauseOnHover && (this.wrapper.addEventListener("mouseenter", this.handlers.pause), this.wrapper.addEventListener("mouseleave", this.handlers.resume));
  }
  setupTouchEvents() {
    let t, e;
    this.wrapper.addEventListener(
      "touchstart",
      (i) => {
        t = i.touches[0].clientX, e = i.touches[0].clientY, this.handlers.pause();
      },
      { passive: !0 }
    ), this.wrapper.addEventListener(
      "touchend",
      () => {
        this.handlers.resume();
      },
      { passive: !0 }
    );
    const n = (i) => {
      const s = i.touches[0].clientX - t, o = i.touches[0].clientY - e;
      (Math.abs(s) > Math.abs(o) && ["left", "right"].includes(this.options.direction) || Math.abs(o) > Math.abs(s) && ["up", "down"].includes(this.options.direction)) && i.preventDefault();
    };
    ["left", "right", "up", "down"].includes(this.options.direction) ? this.wrapper.addEventListener("touchmove", n, {
      passive: !1
    }) : this.wrapper.addEventListener("touchmove", n, {
      passive: !0
    });
  }
  setupVisibilityEvents() {
    document.addEventListener("visibilitychange", () => {
      document.hidden ? this.handlers.pause() : this.handlers.resume();
    });
  }
  destroy() {
    this.options.pauseOnHover && (this.wrapper.removeEventListener("mouseenter", this.handlers.pause), this.wrapper.removeEventListener("mouseleave", this.handlers.resume)), this.wrapper.removeEventListener("touchstart", this.handlers.pause), this.wrapper.removeEventListener("touchend", this.handlers.resume), document.removeEventListener("visibilitychange", this.handlers.pause);
  }
}
class v {
  constructor(t) {
    a(this, "cachedMetrics", null);
    this.direction = t;
  }
  calculateOptimalCloneCount(t, e, n) {
    const i = ["left", "right"].includes(this.direction), s = this.calculateMetrics(t, e, n, i);
    if (this.cachedMetrics && this.cachedMetrics.containerSize === s.containerSize && this.cachedMetrics.contentSize === s.contentSize)
      return this.cachedMetrics.calculatedCount;
    const o = Math.ceil(s.containerSize / s.contentSize) + 1;
    return this.cachedMetrics = {
      ...s,
      calculatedCount: o
    }, o;
  }
  calculateMetrics(t, e, n, i) {
    const s = i ? t.offsetWidth : t.offsetHeight, o = e.reduce((r, l) => {
      const c = i ? l.offsetWidth : l.offsetHeight;
      return r + c + n;
    }, 0);
    return {
      containerSize: s,
      contentSize: o
    };
  }
  invalidateCache() {
    this.cachedMetrics = null;
  }
}
class M {
  constructor(t, e) {
    a(this, "container");
    a(this, "wrapper");
    a(this, "element");
    a(this, "options");
    a(this, "contentElements", []);
    a(this, "clones", []);
    a(this, "instanceId");
    a(this, "separatorStyleElement", null);
    a(this, "cloneCalculator");
    this.instanceId = `marquee-${Math.random().toString(36).substring(2, 9)}`, this.element = t, this.options = e, this.container = this.createContainer(), this.wrapper = this.createWrapper(), this.cloneCalculator = new v(e.direction), this.element.innerHTML = "", this.setupDOM();
  }
  createContainer() {
    const t = document.createElement("div");
    t.classList.add(this.instanceId, "marquee-container");
    const e = Array.from(this.element.classList), n = this.element.id;
    return t.classList.add(...e), n && (t.id = n), t.style.width = "100%", t.style.overflow = "hidden", t.style.position = "relative", t;
  }
  createWrapper() {
    const t = document.createElement("div");
    return t.style.position = "relative", t.style.width = "100%", t.style.height = "100%", t.style.overflow = "visible", t.classList.add("marquee-wrapper"), t;
  }
  setupDOM() {
    var e;
    const t = this.getMaxContentHeight();
    ["up", "down"].includes(this.options.direction) && this.options.containerHeight ? this.container.style.height = `${this.options.containerHeight}px` : this.container.style.height = `${t}px`, (e = this.element.parentNode) == null || e.insertBefore(this.container, this.element), this.container.appendChild(this.wrapper), this.createContentElements();
  }
  createContentElements() {
    this.clearElements();
    const t = document.createDocumentFragment();
    this.options.contentList.forEach((e) => {
      const n = this.createContentElement(e);
      this.contentElements.push(n), t.appendChild(n);
    }), this.wrapper.appendChild(t), this.positionElements(), this.createClones(), this.updateSeparatorStyles();
  }
  clearElements() {
    this.contentElements.forEach((t) => t.remove()), this.clones.forEach((t) => t.remove()), this.contentElements = [], this.clones = [];
  }
  getMaxContentHeight() {
    const t = document.createElement("div");
    t.style.position = "absolute", t.style.visibility = "hidden", t.style.left = "-9999px", document.body.appendChild(t);
    const e = this.options.contentList.map((n) => (t.innerHTML = n, t.offsetHeight));
    return document.body.removeChild(t), Math.max(...e, 0);
  }
  calculateMetrics() {
    const t = ["left", "right"].includes(this.options.direction), e = [];
    let n = 0;
    return this.contentElements.forEach((i, s) => {
      const o = i.getBoundingClientRect(), r = t ? o.width : o.height, l = this.options.separator && s < this.contentElements.length - 1 ? this.options.gap / 2 : 0;
      e.push({
        size: r,
        spacing: this.options.gap,
        position: n,
        separatorOffset: l
      }), n += r + this.options.gap;
    }), e;
  }
  createContentElement(t) {
    const e = document.createElement("div");
    return e.className = "marquee-content-item", e.style.position = "absolute", e.style.whiteSpace = ["up", "down"].includes(this.options.direction) ? "normal" : "nowrap", e.style.width = ["up", "down"].includes(this.options.direction) ? "100%" : "auto", e.innerHTML = t, e;
  }
  positionElements() {
    const t = this.calculateMetrics();
    this.contentElements.forEach((e, n) => {
      const { position: i } = t[n];
      e.style.transform = ["left", "right"].includes(this.options.direction) ? `translate3d(${i}px, 0, 0)` : `translate3d(0, ${i}px, 0)`;
    });
  }
  createClones() {
    const t = this.options.cloneCount === "auto" ? this.cloneCalculator.calculateOptimalCloneCount(
      this.container,
      this.contentElements,
      this.options.gap
    ) : this.options.cloneCount;
    if (t <= 0) return;
    const e = this.calculateMetrics(), n = e.reduce((s, o) => s + o.size + o.spacing, 0), i = document.createDocumentFragment();
    for (let s = 0; s < t; s++) {
      const o = n * (s + 1);
      this.contentElements.forEach((r, l) => {
        const c = r.cloneNode(!0);
        c.setAttribute("aria-hidden", "true"), c.classList.add("marquee-cloned-item"), c.style.transform = ["left", "right"].includes(this.options.direction) ? `translate3d(${e[l].position + o}px, 0, 0)` : `translate3d(0, ${e[l].position + o}px, 0)`, this.clones.push(c), i.appendChild(c);
      });
    }
    this.wrapper.appendChild(i);
  }
  updateSeparatorStyles() {
    var e;
    if ((e = this.separatorStyleElement) == null || e.remove(), !this.options.separator || ["up", "down"].includes(this.options.direction))
      return;
    const t = document.createElement("style");
    t.textContent = `
      .${this.instanceId} .marquee-content-item::before {
      content: '${this.options.separator}';
      position: absolute;
      left: -${this.options.gap / 2}px;
      transform: translate3d(-50%, 0, 0);
      white-space: pre;
      }
    `, document.head.appendChild(t), this.separatorStyleElement = t;
  }
  cleanupSeparatorStyles() {
    var t;
    (t = this.separatorStyleElement) == null || t.remove(), this.separatorStyleElement = null;
  }
  // Utility method to force recalculation of clones
  recalculateClones() {
    this.cloneCalculator.invalidateCache(), this.createContentElements();
  }
  updateContainerHeight(t) {
    this.container && (this.container.style.height = `${t}px`);
  }
  updateSeparators() {
    this.updateSeparatorStyles();
  }
  getWrapper() {
    return this.wrapper;
  }
  getContainer() {
    return this.container;
  }
  getContentElements() {
    return this.contentElements;
  }
  destroy() {
    var t;
    this.clearElements(), this.wrapper.parentNode && (this.wrapper.parentNode.insertBefore(this.element, this.wrapper), this.container.remove()), this.cleanupSeparatorStyles(), (t = document.querySelector(`.${this.instanceId}`)) == null || t.remove();
  }
}
class y {
  constructor(t, e = {}) {
    a(this, "element");
    a(this, "originalElement");
    a(this, "options");
    a(this, "isPlaying", !1);
    a(this, "animationManager", null);
    a(this, "eventManager", null);
    a(this, "domManager", null);
    a(this, "htmlContentList", []);
    a(this, "defaultOptions", {
      speed: 100,
      direction: "left",
      pauseOnHover: !1,
      gap: 20,
      cloneCount: "auto",
      separator: "",
      randomize: !1,
      contentList: []
    });
    const n = typeof t == "string" ? document.querySelector(t) : t;
    if (!n)
      throw new Error("Invalid element selector");
    this.originalElement = n.cloneNode(!0), this.setupInstance(n, e), this.init();
  }
  setupInstance(t, e) {
    var i;
    const n = u.validate(e);
    this.element = t, this.options = { ...this.defaultOptions, ...n }, this.htmlContentList = Array.from(this.element.children).map((s) => s.outerHTML), (i = this.options.contentList) != null && i.length ? this.htmlContentList.length && this.options.keepOriginalContent && (this.options.contentList = [...this.htmlContentList, ...this.options.contentList]) : this.options.contentList = this.htmlContentList, this.options.randomize && (this.options.contentList = this.randomizeContent());
  }
  async init() {
    this.destroy(), this.domManager = new M(this.element, this.options), await this.domManager.createContentElements();
    const t = this.domManager.getWrapper(), e = this.domManager.getContentElements();
    t && e.length > 0 && (this.animationManager = new C(t, this.options), this.eventManager = new f(this.element, t, this.options, {
      pause: () => this.pause(),
      resume: () => this.play()
    }), this.play());
  }
  randomizeContent() {
    const t = [...this.options.contentList];
    for (let e = t.length - 1; e > 0; e--) {
      const n = Math.floor(Math.random() * (e + 1));
      [t[e], t[n]] = [t[n], t[e]];
    }
    return t;
  }
  async reset() {
    return new Promise(async (t) => {
      this.pause();
      const e = this.originalElement.cloneNode(!0);
      this.element.parentElement && this.element.parentElement.replaceChild(e, this.element), await Promise.resolve(this.destroy()), this.setupInstance(e, this.options), await this.init(), t();
    });
  }
  destroy() {
    return new Promise((t) => {
      var e, n, i;
      this.pause(), (e = this.animationManager) == null || e.stopAnimation(), (n = this.eventManager) == null || n.destroy(), (i = this.domManager) == null || i.destroy(), requestAnimationFrame(() => {
        t();
      });
    });
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
  async addContent(t, e = !1, n = !1, i) {
    var r, l;
    if (!t) return;
    n && this.pause();
    const s = Array.isArray(t) ? t : [t], o = u.validateContentList(s, this.options);
    if (!o.isValid) {
      console.warn(
        "MarqueeJS: Content validation failed:",
        o.errors.map((c) => c.message).join(", ")
      );
      return;
    }
    e ? this.options.contentList = [...s, ...this.options.contentList] : this.options.contentList = [...this.options.contentList, ...s], n ? await this.reset() : ((r = this.domManager) == null || r.createContentElements(), (l = this.animationManager) == null || l.recalculatePositions()), i && requestAnimationFrame(() => {
      i();
    });
  }
  replaceContent(t, e) {
    var i, s;
    if (!Array.isArray(t)) return;
    const n = u.validateContentList(t, this.options);
    if (!n.isValid) {
      console.warn(
        "MarqueeJS: Content validation failed:",
        n.errors.map((o) => o.message).join(", ")
      );
      return;
    }
    this.options.contentList = t, (i = this.domManager) == null || i.createContentElements(), (s = this.animationManager) == null || s.recalculatePositions(), e && requestAnimationFrame(() => {
      e();
    });
  }
  getContentList() {
    return this.options.contentList;
  }
  updateSpeed(t) {
    u.validateSpeed(t), this.options.speed = t;
  }
  updateGap(t) {
    var e, n;
    u.validateGap(t), this.options.gap = t, (e = this.domManager) == null || e.createContentElements(), (n = this.animationManager) == null || n.recalculatePositions();
  }
  updateSeparator(t) {
    var e, n;
    this.options.separator = t, (e = this.domManager) == null || e.createContentElements(), (n = this.animationManager) == null || n.recalculatePositions();
  }
  updateCloneCount(t) {
    var e, n;
    if (!Number.isInteger(t) || t < 0 || t > u.MAX_CLONES)
      throw new Error(
        `MarqueeJS: cloneCount must be an integer between 0 and ${u.MAX_CLONES}`
      );
    this.options.cloneCount = t, (e = this.domManager) == null || e.createContentElements(), (n = this.animationManager) == null || n.recalculatePositions();
  }
  updateContainerHeight(t) {
    var e, n;
    u.validateContainerHeight(t, this.options.direction), this.options.containerHeight = t, ["up", "down"].includes(this.options.direction) && ((e = this.domManager) == null || e.updateContainerHeight(t)), (n = this.animationManager) == null || n.recalculatePositions(), this.play();
  }
  updatePauseOnHover(t) {
    var e, n;
    this.options.pauseOnHover = t, (e = this.eventManager) == null || e.destroy(), this.eventManager = new f(
      this.element,
      (n = this.domManager) == null ? void 0 : n.getWrapper(),
      this.options,
      {
        pause: () => this.pause(),
        resume: () => this.play()
      }
    );
  }
  recalculatePositions() {
    var t;
    (t = this.animationManager) == null || t.recalculatePositions(), this.play();
  }
  randomize() {
    this.options.randomize = !0, this.reset();
  }
  switchDirection() {
    const t = {
      left: "right",
      right: "left",
      up: "down",
      down: "up"
    };
    this.options.direction = t[this.options.direction];
  }
  async patchContent(t, e, n = !1, i) {
    var r, l, c;
    if (!t) return;
    if (e !== "start" && e !== "end")
      throw new Error('MarqueeJS (patchContent): position must be either "start" or "end"');
    n && this.pause();
    const s = Array.isArray(t) ? t : [t], o = u.validateContentList(s, this.options);
    if (!o.isValid) {
      console.warn(
        "MarqueeJS: Content validation failed:",
        o.errors.map((h) => h.message).join(", ")
      );
      return;
    }
    if (!((r = this.options.contentList) != null && r.length))
      this.options.contentList = s;
    else if (s.length >= this.options.contentList.length)
      this.options.contentList = s;
    else {
      const h = [...this.options.contentList];
      if (e === "start")
        h.splice(0, s.length, ...s);
      else {
        const p = h.length - s.length;
        h.splice(p, s.length, ...s);
      }
      this.options.contentList = h;
    }
    n ? await this.reset() : ((l = this.domManager) == null || l.createContentElements(), (c = this.animationManager) == null || c.recalculatePositions()), i && requestAnimationFrame(() => {
      i();
    });
  }
}
function b(d, t = {}) {
  const e = new y(d, t);
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
    addContent(n, i = !1, s = !1, o) {
      e.addContent(n, i, s, o);
    },
    replaceContent(n, i) {
      e.replaceContent(n, i);
    },
    getContentList() {
      return e.getContentList();
    },
    updateSpeed(n) {
      e.updateSpeed(n);
    },
    updateGap(n) {
      e.updateGap(n);
    },
    updateSeparator(n) {
      e.updateSeparator(n);
    },
    updateCloneCount(n) {
      e.updateCloneCount(n);
    },
    updateContainerHeight(n) {
      e.updateContainerHeight(n);
    },
    updatePauseOnHover(n) {
      e.updatePauseOnHover(n);
    },
    recalculatePositions() {
      e.recalculatePositions();
    },
    randomize() {
      e.randomize();
    },
    switchDirection() {
      e.switchDirection();
    },
    patchContent(n, i, s = !1, o) {
      e.patchContent(n, i, s, o);
    }
  };
}
export {
  b as marqueejs
};
//# sourceMappingURL=marqueejs.es.js.map
