/* fx.js · GSAP micro-interactions
   1. Beer-foam cursor: a soft foam ring trails the pointer (gsap.quickTo) and swells over anything clickable;
      a paper hop cone trails the pointer, leaning into the motion; a press sends out a golden ripple.
   2. Buttons: magnetic pull toward the pointer, elastic settle on leave, a squish + ripple on press.
   Fine pointers only for the ring/trail/magnet; taps still get the burst. Off for reduced motion. */
(function () {
  if (!window.gsap || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const CLICKABLE = "a, button, [role=button], .bt-b, .tp-pk, label.tr-f, select";
  const MAGNET = ".jh .pill, .h-cta, .h-cta2, .tr-actions button, .bt-visit, .bt-more2, .tp-visit, .tp-all, .bt-pb, .bt-all, .tr-links a, .bt-taste, .st-f, .tp-arr, .bt-tb";

  const css = document.createElement("style");
  css.textContent = `
    .fx-layer { position: fixed; inset: 0; z-index: 95; pointer-events: none; overflow: hidden; }
    .fx-ring { position: absolute; left: 0; top: 0; width: 34px; height: 34px; margin: -17px 0 0 -17px; border-radius: 50%; opacity: 0;
      border: 2px solid rgba(255,248,226,.9); background: radial-gradient(circle, rgba(255,250,235,.18), rgba(242,193,78,.12) 70%, transparent 72%);
      box-shadow: 0 0 0 1px rgba(90,50,10,.25), 0 4px 14px rgba(40,20,0,.18); display: grid; place-items: center; }
    .fx-ring span { font: 800 8px/1 Archivo, sans-serif; letter-spacing: .12em; text-transform: uppercase; color: #2b1a12; background: #ffe27a; padding: 3px 5px; border-radius: 2px; opacity: 0; transform: scale(.6); }
    .fx-hop { position: absolute; left: 0; top: 0; width: 26px; height: 32px; margin: -16px 0 0 -13px; opacity: 0; background: url(img/hop.webp) center / contain no-repeat;
      transform-origin: 50% 10%; filter: drop-shadow(2px 4px 3px rgba(40,20,0,.3)); }
    .fx-rip { position: absolute; left: 0; top: 0; width: 40px; height: 40px; margin: -20px 0 0 -20px; border-radius: 50%; border: 2px solid #f2c14e; box-shadow: 0 0 0 1px rgba(90,50,10,.2); }
    .fx-mag { transition-property: background-color, color, box-shadow, border-color !important; }`;
  document.head.appendChild(css);

  const layer = document.createElement("div"); layer.className = "fx-layer"; layer.setAttribute("aria-hidden", "true");
  // a press sends out two golden ripples (a drop landing in a full glass)
  function burst(x, y) {
    [0, .12].forEach((d, i) => {
      const r = document.createElement("i"); r.className = "fx-rip"; layer.appendChild(r);
      gsap.fromTo(r, { x, y, scale: .2, opacity: .9 }, { scale: i ? 2.6 : 1.8, opacity: 0, duration: .7, delay: d, ease: "power2.out", onComplete: () => r.remove() });
    });
  }

  function start() {
    document.body.appendChild(layer);

    /* ---------- cursor ring + trail (mouse / trackpad only) ---------- */
    if (fine) {
      const ring = document.createElement("i"); ring.className = "fx-ring"; ring.innerHTML = "<span></span>"; layer.appendChild(ring);
      const tag = ring.querySelector("span");
      const rx = gsap.quickTo(ring, "x", { duration: .35, ease: "power3.out" }), ry = gsap.quickTo(ring, "y", { duration: .35, ease: "power3.out" });
      let lx = 0, ly = 0, lt = 0, shown = false, hot = null, hopOn = false;
      const hop = document.createElement("i"); hop.className = "fx-hop"; layer.appendChild(hop);
      const hx = gsap.quickTo(hop, "x", { duration: .7, ease: "power3.out" }), hy = gsap.quickTo(hop, "y", { duration: .7, ease: "power3.out" });
      addEventListener("pointermove", e => {
        if (e.pointerType !== "mouse") return;
        if (!shown) { shown = true; gsap.set(ring, { x: e.clientX, y: e.clientY }); gsap.to(ring, { opacity: 1, duration: .3 }); }
        rx(e.clientX); ry(e.clientY);
        if (!hopOn) { hopOn = true; gsap.set(hop, { x: e.clientX, y: e.clientY }); gsap.to(hop, { opacity: 1, duration: .4 }); }
        hx(e.clientX + 18); hy(e.clientY + 20);
        // lean + stretch with the pointer's speed, settle when it stops
        const vx = e.clientX - lx, vy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
        gsap.to(hop, { rotation: gsap.utils.clamp(-40, 40, vx * 2.2), scaleY: 1 + gsap.utils.clamp(0, .25, Math.hypot(vx, vy) / 120), duration: .35, overwrite: "auto" });
        clearTimeout(lt); lt = setTimeout(() => gsap.to(hop, { rotation: 0, scaleY: 1, duration: 1, ease: "elastic.out(1, .3)" }), 90);
      }, { passive: true });
      document.addEventListener("pointerleave", () => { shown = false; hopOn = false; gsap.to([ring, hop], { opacity: 0, duration: .2 }); });
      // swell over clickable things; bottles / taps get a little "Open" tag
      document.addEventListener("pointerover", e => {
        const el = e.target.closest && e.target.closest(CLICKABLE);
        if (el === hot) return; hot = el;
        const word = el && (el.matches(".bt-b") ? "Open" : el.matches(".tp-pk") ? "Pour" : "");
        tag.textContent = word;
        gsap.to(ring, { scale: el ? (word ? 2.1 : 1.7) : 1, borderColor: el ? "rgba(255,226,122,.95)" : "rgba(255,248,226,.9)", duration: .35, ease: "back.out(2)" });
        gsap.to(tag, { opacity: word ? 1 : 0, scale: word ? 1 : .6, duration: .25 });
      });
      addEventListener("scroll", () => { if (hot) { hot = null; gsap.to(ring, { scale: 1, duration: .25 }); gsap.to(tag, { opacity: 0, duration: .15 }); } }, { passive: true });
      document.addEventListener("pointerdown", () => gsap.fromTo(ring, { scale: "-=.35" }, { scale: hot ? 1.7 : 1, duration: .5, ease: "elastic.out(1,.4)" }));
    }

    /* ---------- magnetic buttons ---------- */
    const wired = new WeakSet();
    function wire(el) {
      if (wired.has(el)) return; wired.add(el);
      el.classList.add("fx-mag");
      const xT = gsap.quickTo(el, "x", { duration: .4, ease: "power3.out" }), yT = gsap.quickTo(el, "y", { duration: .4, ease: "power3.out" });
      el.addEventListener("pointermove", e => {
        if (e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect(), k = Math.min(.22, 14 / Math.max(r.width, r.height) + .08);
        xT((e.clientX - (r.left + r.width / 2)) * k); yT((e.clientY - (r.top + r.height / 2)) * k);
      });
      el.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") gsap.to(el, { scale: 1.05, duration: .3, ease: "back.out(3)" }); });
      el.addEventListener("pointerleave", () => gsap.to(el, { x: 0, y: 0, scale: 1, duration: .8, ease: "elastic.out(1, .35)", overwrite: "auto" }));
      el.addEventListener("pointerdown", () => gsap.fromTo(el, { scale: .93 }, { scale: fine ? 1.05 : 1, duration: .55, ease: "elastic.out(1, .4)", overwrite: "auto" }));
    }
    const scan = () => document.querySelectorAll(MAGNET).forEach(el => { if (fine) wire(el); });
    scan(); setTimeout(scan, 1500); addEventListener("load", scan);
    new MutationObserver(() => { clearTimeout(scan.t); scan.t = setTimeout(scan, 200); }).observe(document.body, { childList: true, subtree: true });

    /* ---------- foam burst on every press of something clickable ---------- */
    document.addEventListener("pointerdown", e => { if (e.target.closest && e.target.closest(CLICKABLE)) burst(e.clientX, e.clientY); }, { passive: true });
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
})();
