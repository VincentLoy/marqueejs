(function(h,r){typeof exports=="object"&&typeof module<"u"?r(exports):typeof define=="function"&&define.amd?define(["exports"],r):(h=typeof globalThis<"u"?globalThis:h||self,r(h.MarqueeJS={}))})(this,function(h){"use strict";var w=Object.defineProperty;var y=(h,r,p)=>r in h?w(h,r,{enumerable:!0,configurable:!0,writable:!0,value:p}):h[r]=p;var a=(h,r,p)=>y(h,typeof r!="symbol"?r+"":r,p);class r{static validate(e){this.validateSpeed(e.speed),this.validateDirection(e.direction),this.validateGap(e.gap),this.validateCloneCount(e.cloneCount),this.validateEasing(e.easing)}static validateSpeed(e){if(e!==void 0&&(typeof e!="number"||e<=0))throw new Error("Speed must be a positive number")}static validateDirection(e){const t=["left","right","up","down"];if(e&&!t.includes(e))throw new Error(`Direction must be one of: ${t.join(", ")}`)}static validateGap(e){if(e!==void 0&&(typeof e!="number"||e<0))throw new Error("Gap must be a non-negative number")}static validateCloneCount(e){if(e!==void 0&&(!Number.isInteger(e)||e<1))throw new Error("Clone count must be a positive integer")}static validateEasing(e){const t=["linear","ease","ease-in","ease-out","ease-in-out"];if(e&&!t.includes(e))throw new Error(`Easing must be one of: ${t.join(", ")}`)}}class p{constructor(e,t,i){a(this,"element");a(this,"wrapper");a(this,"options");a(this,"animationFrame",null);a(this,"lastTime",0);a(this,"elements",[]);this.element=e,this.wrapper=t,this.options=i,this.setupElements()}setupElements(){var n,o;const e=((n=this.wrapper.parentElement)==null?void 0:n.offsetWidth)||0,t=((o=this.wrapper.parentElement)==null?void 0:o.offsetHeight)||0,i=this.element.offsetWidth+this.options.gap,s=this.element.offsetHeight+this.options.gap;this.elements=Array.from(this.wrapper.children).map((d,m)=>{const u=d;let l=0;switch(this.options.direction){case"left":l=m*i;break;case"right":l=e-(m+1)*i;break;case"up":l=m*s;break;case"down":l=t-(m+1)*s;break}return u.style.position="absolute",u.style.top="0",u.style.left="0",u.style.transform=["left","right"].includes(this.options.direction)?`translateX(${l}px)`:`translateY(${l}px)`,u.style.transition="transform linear",{el:u,position:l}})}startAnimation(){this.lastTime=performance.now();const e=t=>{const i=t-this.lastTime;this.lastTime=t;const s=this.options.speed*i/1e3;this.elements.forEach(n=>{["left","right"].includes(this.options.direction)?this.updateHorizontalPosition(n,s):this.updateVerticalPosition(n,s)}),this.animationFrame=requestAnimationFrame(e)};this.animationFrame=requestAnimationFrame(e)}isPositionAvailable(e,t){const i=this.options.gap,s=["left","right"].includes(this.options.direction);return!this.elements.some(({el:n,position:o})=>{if(n===t)return!1;if(s){const d=n.offsetWidth;return Math.abs(o-e)<d+i}else{const d=n.offsetHeight;return Math.abs(o-e)<d+i}})}updateHorizontalPosition(e,t){var n;const i=((n=this.wrapper.parentElement)==null?void 0:n.offsetWidth)||0,s=e.el.offsetWidth;if(this.options.direction==="left"){if(e.position-=t,e.position+s<0){const o=i;this.isPositionAvailable(o,e.el)&&(e.position=o)}}else if(e.position+=t,e.position>i){const o=-s;this.isPositionAvailable(o,e.el)&&(e.position=o)}e.el.style.transform=`translateX(${e.position}px)`}updateVerticalPosition(e,t){var n;const i=((n=this.wrapper.parentElement)==null?void 0:n.offsetHeight)||0,s=e.el.offsetHeight;if(this.options.direction==="up"){if(e.position-=t,e.position+s<0){const o=i;this.isPositionAvailable(o,e.el)&&(e.position=o)}}else if(e.position+=t,e.position>i){const o=-s;this.isPositionAvailable(o,e.el)&&(e.position=o)}e.el.style.transform=`translateY(${e.position}px)`}stopAnimation(){this.animationFrame&&(cancelAnimationFrame(this.animationFrame),this.animationFrame=null),this.lastTime=0}}class f{constructor(e,t,i,s){a(this,"wrapper");a(this,"options");a(this,"handlers");this.wrapper=t,this.options=i,this.handlers=s,this.init()}init(){this.setupHoverEvents(),this.setupTouchEvents(),this.setupVisibilityEvents()}setupHoverEvents(){this.options.pauseOnHover&&(this.wrapper.addEventListener("mouseenter",this.handlers.pause),this.wrapper.addEventListener("mouseleave",this.handlers.resume))}setupTouchEvents(){let e,t;this.wrapper.addEventListener("touchstart",s=>{e=s.touches[0].clientX,t=s.touches[0].clientY,this.handlers.pause()},{passive:!0}),this.wrapper.addEventListener("touchend",()=>{this.handlers.resume()},{passive:!0});const i=s=>{const n=s.touches[0].clientX-e,o=s.touches[0].clientY-t;(Math.abs(n)>Math.abs(o)&&["left","right"].includes(this.options.direction)||Math.abs(o)>Math.abs(n)&&["up","down"].includes(this.options.direction))&&s.preventDefault()};["left","right","up","down"].includes(this.options.direction)?this.wrapper.addEventListener("touchmove",i,{passive:!1}):this.wrapper.addEventListener("touchmove",i,{passive:!0})}setupVisibilityEvents(){document.addEventListener("visibilitychange",()=>{document.hidden?this.handlers.pause():this.handlers.resume()})}destroy(){this.options.pauseOnHover&&(this.wrapper.removeEventListener("mouseenter",this.handlers.pause),this.wrapper.removeEventListener("mouseleave",this.handlers.resume)),this.wrapper.removeEventListener("touchstart",this.handlers.pause,{passive:!0}),this.wrapper.removeEventListener("touchend",this.handlers.resume,{passive:!0}),document.removeEventListener("visibilitychange",this.handlers.pause)}}class v{constructor(e,t={}){a(this,"element");a(this,"options");a(this,"container",null);a(this,"wrapper",null);a(this,"clones",[]);a(this,"isPlaying",!1);a(this,"animationManager",null);a(this,"eventManager",null);a(this,"defaultOptions",{speed:100,direction:"left",pauseOnHover:!0,gap:20,easing:"linear",cloneCount:1,separator:" - "});const i=typeof e=="string"?document.querySelector(e):e;if(!i)throw new Error("Invalid element selector");r.validate(t),this.element=i,this.options={...this.defaultOptions,...t},this.init()}init(){this.setupWrapper(),this.cloneElements(),this.wrapper&&(this.animationManager=new p(this.element,this.wrapper,this.options),this.eventManager=new f(this.element,this.wrapper,this.options,{pause:()=>this.pause(),resume:()=>this.play()}),this.play())}setupWrapper(){var t;const e=this.element.offsetHeight;this.container=document.createElement("div"),this.container.style.width="100%",this.container.style.height=`${e}px`,this.container.style.overflow="hidden",this.container.style.position="relative",this.container.classList.add("marquee-container"),this.wrapper=document.createElement("div"),this.wrapper.style.position="relative",this.wrapper.style.width="100%",this.wrapper.style.height="100%",this.wrapper.classList.add("marquee-wrapper"),this.element.style.position="absolute",this.element.style.top="0",this.element.style.left="0",this.element.style.flexShrink="0",this.element.style.height=["up","down"].includes(this.options.direction)?"auto":`${e}px`,["left","right"].includes(this.options.direction)?this.element.style.marginRight=`${this.options.gap}px`:this.element.style.marginBottom=`${this.options.gap}px`,(t=this.element.parentNode)==null||t.insertBefore(this.container,this.element),this.container.appendChild(this.wrapper),this.wrapper.appendChild(this.element)}cloneElements(){var e;if(this.options.cloneCount!==0)for(let t=0;t<this.options.cloneCount;t++){const i=this.element.cloneNode(!0);i.setAttribute("aria-hidden","true"),i.style.flexShrink="0",["left","right"].includes(this.options.direction)?i.style.marginRight=`${this.options.gap}px`:i.style.marginBottom=`${this.options.gap}px`,this.clones.push(i),(e=this.wrapper)==null||e.appendChild(i)}}play(){this.isPlaying||(this.isPlaying=!0,this.startAnimation())}pause(){this.isPlaying&&(this.isPlaying=!1,this.stopAnimation())}startAnimation(){var e;(e=this.animationManager)==null||e.startAnimation()}stopAnimation(){var e;(e=this.animationManager)==null||e.stopAnimation()}destroy(){var e,t,i,s;this.pause(),(e=this.animationManager)==null||e.stopAnimation(),(t=this.eventManager)==null||t.destroy(),this.clones.forEach(n=>n.remove()),(i=this.wrapper)!=null&&i.parentNode&&(this.wrapper.parentNode.insertBefore(this.element,this.wrapper),(s=this.container)==null||s.remove())}}function g(c,e={}){const t=new v(c,e);return{start(){t.play()},stop(){t.pause()},pause(){t.pause()},resume(){t.play()},destroy(){t.destroy()}}}h.marqueejs=g,Object.defineProperty(h,Symbol.toStringTag,{value:"Module"})});
//# sourceMappingURL=marqueejs.umd.cjs.map
