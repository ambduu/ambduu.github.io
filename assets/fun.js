/* brewhouse fun layer: GSAP motions (Flip, ScrollTrigger, Draggable, Physics2D, CustomWiggle) */
document.addEventListener("DOMContentLoaded", () => {
  if (!window.gsap) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  gsap.registerPlugin(ScrollTrigger, Flip, Draggable, Physics2DPlugin, CustomEase, CustomWiggle, ...(window.SplitText ? [SplitText] : []));
  document.documentElement.classList.add("gsap-on");
  CustomWiggle.create("tipsy", { wiggles: 6, type: "easeOut" });
  CustomWiggle.create("hiccup", { wiggles: 3, type: "uniform" });

  /* 1. Cheers! a foam burst from any big button (Physics2D) */
  function cheers(x, y, n = 18) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const b = document.createElement("i");
      const s = gsap.utils.random(6, 16);
      b.className = "foam-pop" + (Math.random() < .35 ? " beer" : "");
      Object.assign(b.style, { width: s + "px", height: s + "px", left: x - s / 2 + "px", top: y - s / 2 + "px" });
      document.body.appendChild(b);
      gsap.to(b, { duration: gsap.utils.random(.9, 1.5), physics2D: { velocity: gsap.utils.random(260, 560), angle: gsap.utils.random(-150, -30), gravity: 900 },
        scale: .2, opacity: 0, ease: "none", onComplete: () => b.remove() });
    }
  }
  window.brewCheers = cheers;
  document.addEventListener("click", e => {
    const b = e.target.closest(".btn, .cf, .next-cup, .menu-btn, button[type=submit]");
    if (b) cheers(e.clientX, e.clientY, b.classList.contains("cf") ? 8 : 18);
  });

  if (reduce) return;

  /* 2. Jelly buttons: squash & stretch on hover */
  $$(".btn, .menu-btn, .go, .next-cup b").forEach(b => {
    b.addEventListener("mouseenter", () => gsap.fromTo(b, { scaleX: 1, scaleY: 1 }, { keyframes: [{ scaleX: 1.12, scaleY: .88, duration: .12 }, { scaleX: .94, scaleY: 1.08, duration: .12 }, { scaleX: 1, scaleY: 1, duration: .5, ease: "elastic.out(1.2, .35)" }], overwrite: true }));
  });

  /* 3. Tap list: the board swings in on its hook, beers slide down the bar */
  const mc = $("#menucard");
  if (mc) {
    const panel = $(".panel", mc), rows = $$(".tap", mc), badges = $$(".pour", mc), taps = $$(".tower i", mc);
    new MutationObserver(() => {
      if (!mc.classList.contains("open")) return;
      gsap.timeline()
        .fromTo(panel, { y: -120, rotation: -9, opacity: 0, transformOrigin: "50% -40px" }, { y: 0, rotation: 0, opacity: 1, duration: 1.1, ease: "elastic.out(1, .45)" })
        .fromTo(taps, { y: -30, opacity: 0 }, { y: 0, opacity: 1, stagger: .06, duration: .5, ease: "back.out(3)" }, .15)
        .fromTo($("h2", mc), { scale: .6, rotation: -4 }, { scale: 1, rotation: 0, duration: .8, ease: "elastic.out(1, .4)" }, .2)
        .fromTo(rows, { x: 260, opacity: 0, skewX: -12 }, { x: 0, opacity: 1, skewX: 0, stagger: .07, duration: .7, ease: "back.out(1.6)" }, .3)
        .fromTo(badges, { scale: 0, rotation: -40 }, { scale: 1, rotation: (i) => (i % 2 ? 2 : -3), stagger: .07, duration: .6, ease: "elastic.out(1.1, .4)" }, .6);
    }).observe(mc, { attributes: true, attributeFilter: ["class"] });
    rows.forEach(r => r.addEventListener("mouseenter", () => gsap.fromTo($(".tglass", r), { rotation: 0 }, { rotation: 14, duration: .9, ease: "tipsy" })));
  }

  /* 4. Cellar: kegs drop onto the shelf, Flip-shuffle on filter */
  const cellar = $(".cellar");
  if (cellar) {
    const kegs = $$(".keg", cellar);
    const drops = ScrollTrigger.batch(kegs, { start: "top 92%", once: true,
      onEnter: b => gsap.fromTo(b, { y: -140, opacity: 0, rotation: () => gsap.utils.random(-14, 14) }, { y: 0, opacity: 1, rotation: 0, stagger: .08, duration: 1, ease: "bounce.out" }) });
    let flip;
    $$(".cf", cellar).forEach(btn => btn.addEventListener("click", () => {
      $$(".cf", cellar).forEach(x => { x.classList.toggle("on", x === btn); x.setAttribute("aria-pressed", x === btn); });
      // settle everything first so no half-finished drop or shuffle leaves a keg invisible
      drops.forEach(t => t.kill()); flip?.kill(); gsap.killTweensOf(kegs);
      gsap.set(kegs, { clearProps: "opacity,transform,visibility" });
      const f = btn.dataset.f, state = Flip.getState(kegs);
      kegs.forEach(k => k.hidden = !(f === "all" || k.dataset.ind === f));
      flip = Flip.from(state, { duration: .6, ease: "back.out(1.4)", scale: true, absolute: true,
        onEnter: els => gsap.fromTo(els, { opacity: 0, scale: .5, rotation: -14 }, { opacity: 1, scale: 1, rotation: 0, duration: .6, ease: "back.out(2)" }),
        onLeave: els => gsap.to(els, { opacity: 0, scale: .5, duration: .25, ease: "power2.in" }),
        onComplete: () => { gsap.set(kegs, { clearProps: "opacity,transform,visibility" }); ScrollTrigger.refresh(); } });
    }));
    kegs.forEach(k => k.addEventListener("mouseenter", () => gsap.fromTo($(".tbar", k), { rotation: 0 }, { rotation: 3, duration: .7, ease: "hiccup" })));
  }

  /* 5. Bottles on the case cards: grab one, it springs back like it's had a few */
  $$(".bottle-mock svg").forEach(svg => {
    Draggable.create(svg, { type: "x,y", zIndexBoost: true,
      onDrag() { gsap.set(svg, { rotation: gsap.utils.clamp(-35, 35, this.x / 4) }); },
      onRelease() { gsap.to(svg, { x: 0, y: 0, rotation: 0, duration: 1.4, ease: "elastic.out(1.1, .3)" }); const r = svg.getBoundingClientRect(); cheers(r.left + r.width / 2, r.top + 30, 10); } });
  });

  /* 6. Headings stagger in with a tipsy wobble */
  $$(".cellar-title, .case h2, .h2").forEach(h => {
    gsap.from(h, { scrollTrigger: { trigger: h, start: "top 88%", once: true }, rotation: () => gsap.utils.random(-4, 4), y: 30, duration: 1, ease: "elastic.out(1, .5)" });
  });

  /* 7. Tally numbers count up like a bar tab */
  $$(".tally b").forEach(b => {
    const m = b.textContent.match(/^(\d+)(.*)$/); if (!m) return;
    const end = +m[1], tail = m[2], o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.6, ease: "power3.out", scrollTrigger: { trigger: b, start: "top 95%", once: true },
      onUpdate: () => b.textContent = Math.round(o.v) + tail });
  });


  /* 9. HERO: the keg pours, the belt rolls, every pint is a different service */
  const kg = $("#kegline");
  const tb = kg;
  if (kg) {
    const keg = $("#kgKeg", kg), lever = $("#kgLever", kg), stream = $("#kgStream", kg), mouth = $("#kgMouth", kg), stache = $("#kgStache", kg),
      brows = $("#kgBrows", kg), eyes = $$(".kg-eye", kg), pupils = $$(".kg-pupil", kg), armL = $("#kgArmL", kg), hop = $("#kgHop", kg), say = $("#kgSay", kg), sayText = $("#kgSayText", kg),
      glasses = $$(".kg-glass", kg), rollers = $$(".kg-roll", kg), belt = $("#kgBelt", kg);
    const BEERS = [["Themes", "#e9a325", "Prost!"], ["Plus", "#d9822b", "Saúde!"], ["Apps", "#b5541c", "Cheers!"],
      ["Java", "#3a2216", "Sláinte!"], ["Headless", "#e8bd5a", "Skål!"], ["Speed", "#c98a2a", "Next!"]];
    const SLOT = 150, POUR = 241;
    let beerN = 0;
    const fresh = g => {  // empty glass with the next beer's label
      const [name, col] = BEERS[beerN++ % BEERS.length];
      g._beer = BEERS[(beerN - 1) % BEERS.length];
      $(".kg-liq", g).setAttribute("fill", col); $(".kg-tag text", g).textContent = name;
      gsap.set($(".kg-liq", g), { scaleY: 0, transformOrigin: "50% 100%" });
      gsap.set($(".kg-foam", g), { scale: 0, transformOrigin: "50% 100%" });
      gsap.set($(".kg-tag", g), { scale: 0, transformOrigin: "50% 50%" });
    };
    glasses.forEach((g, i) => { g._x = POUR + (i - 1) * SLOT; gsap.set(g, { x: g._x }); fresh(g); });
    gsap.set([lever], { transformOrigin: "50% 100%" }); gsap.set(stream, { transformOrigin: "50% 0%", scaleY: 0 });
    gsap.set(eyes, { transformOrigin: "50% 50%" }); gsap.set(say, { transformOrigin: "60% 100%" });
    gsap.set(keg, { transformOrigin: "50% 100%" }); gsap.set(stache, { transformOrigin: "50% 50%" });
    // bunting sways, bottles wobble, blinking
    $$(".kg-flag", kg).forEach((f, i) => gsap.to(f, { rotation: i % 2 ? 10 : -10, transformOrigin: "50% 0%", duration: 1.4 + (i % 3) * .3, yoyo: true, repeat: -1, ease: "sine.inOut" }));
    gsap.to($$(".tb-bottle", kg), { y: -5, rotation: (i) => (i % 2 ? 4 : -4), transformOrigin: "50% 100%", duration: 1, yoyo: true, repeat: -1, ease: "sine.inOut", stagger: { each: .3, from: "random" } });
    const blink = () => { gsap.to(eyes, { scaleY: .1, duration: .08, yoyo: true, repeat: 1 }); gsap.delayedCall(gsap.utils.random(2, 5), blink); };
    gsap.delayedCall(1.5, blink);
    // cartoon life: breathing, a wave now and then, the hop sprig bobbing
    gsap.to(keg, { scaleY: 1.025, scaleX: .985, duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.set(armL, { svgOrigin: "50 336" }); gsap.set(hop, { svgOrigin: "92 232" });
    gsap.to(hop, { rotation: 10, duration: 1.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
    const wave = () => { gsap.timeline().to(armL, { rotation: -25, duration: .18, ease: "power2.out" }).to(armL, { rotation: 15, duration: .18, yoyo: true, repeat: 5, ease: "sine.inOut" }).to(armL, { rotation: 0, duration: .5, ease: "elastic.out(1, .4)" }); gsap.delayedCall(gsap.utils.random(6, 10), wave); };
    gsap.delayedCall(1.2, wave);
    const px = pupils.map(p => gsap.quickTo(p, "x", { duration: .4, ease: "power3" }));
    addEventListener("pointermove", e => {
      const r = kg.getBoundingClientRect(); px.forEach(q => q(gsap.utils.clamp(-5, 5, (e.clientX - (r.left + r.width * .27)) / 40)));
    }, { passive: true });
    const sayIt = txt => { sayText.textContent = txt;
      return gsap.timeline().fromTo(say, { scale: 0, opacity: 0, rotation: 10 }, { scale: 1, opacity: 1, rotation: 0, duration: .6, ease: "elastic.out(1, .4)" }).to(say, { opacity: 0, scale: .6, duration: .3, delay: 1 }); };
    let tl;
    const step = () => {
      const under = glasses.find(g => Math.abs(g._x + SLOT - POUR) < 2);  // the glass that will arrive under the tap
      tl = gsap.timeline({ onComplete: step })
        // 1. belt rolls one slot
        .add(() => glasses.forEach(g => { g._x += SLOT; }))
        .to(glasses, { x: g => glasses[g]._x, duration: 1.1, ease: "power2.inOut" })
        .to(rollers, { rotation: "+=360", transformOrigin: "50% 50%", duration: 1.1, ease: "power2.inOut" }, "<")
        .to(belt, { strokeDashoffset: "-=150", duration: 1.1, ease: "power2.inOut" }, "<")
        .to(pupils, { y: 2, duration: .3 }, "<")
        .add(() => glasses.forEach(g => { if (g._x > POUR + SLOT * 1.9) { g._x -= SLOT * 4; gsap.set(g, { x: g._x }); fresh(g); } }))
        // 2. the keg pulls the lever and pours
        .to(keg, { scaleY: .94, scaleX: 1.04, duration: .15, yoyo: true, repeat: 1 })
        .to(lever, { rotation: 32, duration: .3, ease: "back.out(3)" }, "<")
        .to(brows, { y: -5, duration: .2 }, "<")
        .add(() => { if (under) stream.setAttribute("fill", under._beer[1]); Sfx?.play?.("boil"); }, "<")
        .to(stream, { scaleY: 1, duration: .2, ease: "power2.in" }, "<.1")
        .to(mouth, { attr: { d: "M100 368 q8 16 16 0" }, duration: .2 }, "<")
        .to(pupils, { x: 5, y: 3, duration: .3 }, "<")
        .to(under ? $(".kg-liq", under) : {}, { scaleY: 1, duration: 1.5, ease: "power1.inOut" })
        .to(stache, { rotation: 4, duration: .15, yoyo: true, repeat: 7, ease: "sine.inOut" }, "<")
        .to(under ? $(".kg-foam", under) : {}, { scale: 1, duration: .9, ease: "back.out(2)" }, "-=.6")
        .to(lever, { rotation: 0, duration: .6, ease: "elastic.out(1, .35)" }, "-=.3")
        .to(stream, { scaleY: 0, duration: .2 }, "<")
        .to(brows, { y: 0, duration: .3 }, "<")
        .to(mouth, { attr: { d: "M92 368 q16 18 32 0" }, duration: .3, ease: "back.out(3)" }, "<")
        // 3. label slaps on, the keg toasts it
        .to(under ? $(".kg-tag", under) : {}, { scale: 1, rotation: () => gsap.utils.random(-8, 8), duration: .5, ease: "elastic.out(1.2, .4)" })
        .add(() => { if (under) sayIt(under._beer[2]); Sfx?.play?.("clink"); }, "<")
        .to(under || {}, { y: -14, duration: .18, yoyo: true, repeat: 1, ease: "power2.out" }, "<")
        .to(mouth, { attr: { d: "M96 370 q12 12 24 0" }, duration: .4 }, "+=.9");
    };
    step();
    kg.addEventListener("click", e => {
      if (e.target.closest("#kgKeg")) {
        gsap.fromTo(keg, { y: 0 }, { y: -26, duration: .25, yoyo: true, repeat: 1, ease: "power2.out" });
        gsap.fromTo(stache, { rotation: 0 }, { rotation: 12, duration: .9, ease: "tipsy" }); sayIt("Hic!"); Sfx?.play?.("pop");
      } else {
        gsap.to(tl, { timeScale: 3, duration: .2, yoyo: true, repeat: 1, repeatDelay: 1.5 }); Sfx?.play?.("pop");
      }
      cheers(e.clientX, e.clientY, 12);
    });
    window.__mascot = { cheers() { sayIt("Cheers!"); } };
    new IntersectionObserver(([en]) => { tl && (en.isIntersecting ? tl.resume() : tl.pause()); }).observe(kg);
  }

  /* 10. Header & hero entrance */
  gsap.from(".hdr .pill", { y: -90, rotation: (i) => (i ? 6 : -6), duration: 1.1, ease: "bounce.out", stagger: .15, delay: .3, clearProps: "transform" });
  gsap.to(".hero h1 .soft", { rotation: -1.6, x: 6, transformOrigin: "0% 50%", duration: 2.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
  const stamp = $(".portrait .stamp");
  if (stamp) {
    const spin = gsap.to(stamp, { rotation: 360, duration: 24, repeat: -1, ease: "none" });
    ScrollTrigger.create({ onUpdate: s => { spin.timeScale(1 + Math.min(12, Math.abs(s.getVelocity()) / 120)); gsap.to(spin, { timeScale: 1, duration: 1, overwrite: true, delay: .1 }); } });
  }
  $$(".hero-bar span").forEach((el, i) => gsap.from(el, { y: 30, opacity: 0, duration: .8, delay: .5 + i * .08, ease: "back.out(2)", clearProps: "all" }));

  /* 11. Brewhouse vessel names hop in, eyebrows draw their lines */
  $$(".cup-meta").forEach((m, i) => gsap.from(m, { scrollTrigger: { trigger: m, start: "top 95%", once: true }, y: 50, rotation: i % 2 ? 6 : -6, opacity: 0, duration: 1, delay: i * .1, ease: "elastic.out(1, .5)", clearProps: "transform,opacity" }));
  $$(".eyebrow:not(.rv)").forEach(el => gsap.from(el, { scrollTrigger: { trigger: el, start: "top 95%", once: true }, x: -30, opacity: 0, duration: .7, ease: "back.out(2)", clearProps: "transform,opacity" }));

  /* 12. Story: each brew swings in from alternating sides */
  $$(".timeline li").forEach((li, i) => gsap.from(li.children, { scrollTrigger: { trigger: li, start: "top 85%", once: true }, x: i % 2 ? 60 : -60, rotation: i % 2 ? 2 : -2, opacity: 0, stagger: .08, duration: .9, ease: "back.out(1.6)", clearProps: "transform,opacity" }));

  /* 13. Tipsy scroll: cards lean with scroll speed */
  const leaners = $$(".stack .case, .kegs .keg");
  if (leaners.length) {
    const sk = leaners.map(el => gsap.quickTo(el, "skewY", { duration: .5, ease: "power3" }));
    ScrollTrigger.create({ onUpdate: s => { const v = gsap.utils.clamp(-5, 5, s.getVelocity() / -400); sk.forEach(q => q(v)); } });
    ScrollTrigger.addEventListener("scrollEnd", () => sk.forEach(q => q(0)));
  }

  /* 14. Magnetic buttons */
  if (matchMedia("(pointer: fine)").matches) {
    $$(".btn, .menu-btn").forEach(b => {
      const qx = gsap.quickTo(b, "x", { duration: .5, ease: "elastic.out(1, .4)" }), qy = gsap.quickTo(b, "y", { duration: .5, ease: "elastic.out(1, .4)" });
      b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * .25); qy((e.clientY - r.top - r.height / 2) * .35); });
      b.addEventListener("pointerleave", () => { qx(0); qy(0); });
    });

    /* 15. Beer-bubble cursor trail */
    let last = 0;
    addEventListener("pointermove", e => {
      const now = performance.now(); if (now - last < 70) return; last = now;
      const s = gsap.utils.random(5, 11), b = document.createElement("i");
      b.className = "trail-bubble"; Object.assign(b.style, { width: s + "px", height: s + "px", left: e.clientX + "px", top: e.clientY + "px" });
      document.body.appendChild(b);
      gsap.to(b, { y: gsap.utils.random(-60, -110), x: gsap.utils.random(-14, 14), opacity: 0, scale: 1.4, duration: gsap.utils.random(.8, 1.3), ease: "power1.out", onComplete: () => b.remove() });
    }, { passive: true });
  }

  /* 16. Big headings: letters stumble in (SplitText) */
  if (window.SplitText) {
    $$(".cellar-title, .cta-card h2:not([data-split]):not(.split)").forEach(h => {
      if (h.closest("[data-split]") || h.hasAttribute("data-split")) h.removeAttribute("data-split");
      const st = new SplitText(h, { type: "words,chars", wordsClass: "st-w" });
      gsap.from(st.chars, { scrollTrigger: { trigger: h, start: "top 90%", once: true }, y: () => gsap.utils.random(-80, -30), rotation: () => gsap.utils.random(-40, 40), opacity: 0, duration: 1, ease: "bounce.out", stagger: { each: .03, from: "random" } });
      h.addEventListener("mouseenter", () => gsap.fromTo(st.chars, { y: 0 }, { y: -8, rotation: () => gsap.utils.random(-12, 12), duration: .25, yoyo: true, repeat: 1, stagger: .015, ease: "power2.out" }));
    });
  }

  /* 17. CTA card lands with a thud, tally & chips wiggle, step-page vessel bobs */
  $$(".cta-card:not(.rv)").forEach(c => gsap.from(c, { scrollTrigger: { trigger: c, start: "top 88%", once: true }, scale: .8, rotation: -3, opacity: 0, duration: 1.2, ease: "elastic.out(1, .5)", clearProps: "transform,opacity" }));
  $$(".tally > div").forEach((d, i) => gsap.from(d, { scrollTrigger: { trigger: d, start: "top 95%", once: true }, y: 40, scale: .7, opacity: 0, duration: .8, delay: i * .12, ease: "back.out(2.5)", clearProps: "transform,opacity" }));
  $$(".chip").forEach(c => c.addEventListener("mouseenter", () => gsap.fromTo(c, { rotation: 0 }, { rotation: 8, duration: .6, ease: "hiccup" })));
  $$(".vessel-head .glass").forEach(v => gsap.to(v, { y: -12, rotation: 1.5, duration: 1.8, yoyo: true, repeat: -1, ease: "sine.inOut" }));
  $$(".next-cup:not(.rv)").forEach(n => gsap.from(n, { scrollTrigger: { trigger: n, start: "top 92%", once: true }, x: -120, rotation: -4, opacity: 0, duration: 1, ease: "back.out(1.6)", clearProps: "transform,opacity" }));


  /* 18. Bartender's hints: little hand-written notes pointing at the hidden fun */
  const seen = k => { try { return localStorage.getItem("brew-hint-" + k) === "1"; } catch { return false; } };
  const mark = k => { try { localStorage.setItem("brew-hint-" + k, "1"); } catch {} };
  const ARROW = '<svg class="hint-arrow" viewBox="0 0 64 40" aria-hidden="true"><path d="M4 30 C 18 4, 40 2, 56 20" /><path d="M46 20 L57 21 L54 10" /></svg>';
  const hints = [];
  function hint({ key, at, text, side = "left", fixed = false, trigger, events = "click", when = "scroll", host, box }) {
    if (seen(key)) return;
    const el = document.createElement("div");
    el.className = `hint hint-${side}${fixed ? " is-fixed" : ""}`;
    el.innerHTML = `<span class="hint-txt">${text}</span>${ARROW}`;
    el.setAttribute("aria-hidden", "true");
    box = fixed ? null : (box || document.body);
    if (box && box !== document.body && getComputedStyle(box).position === "static") box.style.position = "relative";
    (box || document.body).appendChild(el);
    const h = { el, key, at, side, fixed, gone: false };
    const place = () => {
      const p = at(); if (!p) return;
      const w = el.offsetWidth, ht = el.offsetHeight, gap = 6;
      let x = side === "left" ? p.x - w - gap : side === "right" ? p.x + gap : p.x - w / 2;
      let y = side === "top" ? p.y - ht - gap : side === "bottom" ? p.y + gap : p.y - ht / 2;
      x = gsap.utils.clamp(8, innerWidth - w - 8, x);
      if (fixed) { el.style.left = x + "px"; el.style.top = y + "px"; return; }
      const br = box === document.body ? { left: -scrollX, top: -scrollY } : box.getBoundingClientRect();
      el.style.left = (x - br.left) + "px"; el.style.top = (y - br.top) + "px";
    };
    h.place = place; hints.push(h); place();
    gsap.set(el, { opacity: 0, scale: .4 });
    const show = () => {
      place();
      gsap.timeline().to(el, { opacity: 1, scale: 1, rotation: side === "right" ? 3 : -3, duration: .7, ease: "elastic.out(1, .45)" })
        .fromTo($$(".hint-arrow path", el), { strokeDashoffset: 80 }, { strokeDashoffset: 0, duration: .6, ease: "power2.out" }, "<.15")
        .add(() => gsap.to(el, { y: side === "top" ? -5 : 5, x: side === "left" ? -4 : side === "right" ? 4 : 0, duration: .9, yoyo: true, repeat: -1, ease: "sine.inOut" }));
    };
    const dismiss = () => {
      if (h.gone) return; h.gone = true; mark(key);
      gsap.killTweensOf(el);
      gsap.to(el, { scale: 1.3, opacity: 0, rotation: 10, duration: .35, ease: "back.in(2)", onComplete: () => el.remove() });
    };
    events.split(" ").forEach(ev => (Array.isArray(trigger) ? trigger : [trigger]).forEach(t => t && t.addEventListener(ev, dismiss, { once: true })));
    if (when === "scroll" && host) ScrollTrigger.create({ trigger: host, start: "top 75%", once: true, onEnter: () => gsap.delayedCall(.6, show) });
    else gsap.delayedCall(typeof when === "number" ? when : 2.5, show);
  }
  const ptIn = (el, fx, fy) => () => { if (!el) return null; const r = el.getBoundingClientRect(); if (!r.width) return null; return { x: r.left + r.width * fx, y: r.top + r.height * fy }; };

  if (kg) hint({ key: "keg", box: $(".portrait"), at: innerWidth < 700 ? ptIn($("#kgKeg"), .45, .02) : ptIn($("#kgKeg"), .1, .72), text: "poke the keg!", side: innerWidth < 700 ? "top" : "left", when: 2.2, trigger: kg, events: "click" });
  const bulb = $("#bulbHit");
  if (bulb && innerWidth > 700) hint({ key: "cord", fixed: true, events: "pointerdown keydown", at: ptIn(bulb, .1, .5), text: "pull the cord<br><small>5× fast = last call</small>", side: "left", when: 3.4, trigger: bulb });
  const sfxBtn = $("#sfx");
  if (sfxBtn && innerWidth > 700) hint({ key: "sfx", fixed: true, at: ptIn(sfxBtn, .5, 1), text: "bar sounds?", side: "bottom", when: 5, trigger: sfxBtn });
  const cups = $$(".shelf .cup");
  if (cups.length) hint({ key: "cups", box: cups[0].parentElement, at: ptIn(cups[0], .5, .05), text: matchMedia("(hover: hover)").matches ? "hover a vessel, click to dive in" : "tap a vessel to dive in", side: "top", host: cups[0], trigger: cups, events: matchMedia("(hover: hover)").matches ? "mouseenter click" : "click" });
  const cf = $$(".cellar .cf");
  if (cf.length > 1) hint({ key: "cellar", box: $(".cellar-head"), at: innerWidth < 700 ? ptIn(cf[cf.length - 1], .5, 1) : ptIn(cf[cf.length - 1], 1, .5), text: "pick a style!", side: innerWidth < 700 ? "bottom" : "right", host: cf[1], trigger: cf });
  const bot = $(".bottle-mock svg");
  if (bot) hint({ key: "bottle", box: bot.parentElement, at: innerWidth < 700 ? ptIn(bot, .75, .2) : ptIn(bot, .25, .3), text: "grab the bottle!", side: innerWidth < 700 ? "right" : "left", host: bot, trigger: $$(".bottle-mock svg"), events: "pointerdown" });
  const mbtn = $("[data-menu-card]");
  if (mbtn && innerWidth > 700) hint({ key: "menu", box: $(".portrait"), at: ptIn(mbtn, .5, 1), text: "the full menu", side: "bottom", when: 6, trigger: mbtn });

  const reflow = () => hints.forEach(h => !h.gone && h.place());
  const topOnly = () => hints.forEach(h => h.fixed && h.el.classList.toggle("away", scrollY > 160));
  addEventListener("scroll", topOnly, { passive: true }); topOnly();
  addEventListener("resize", reflow); ScrollTrigger.addEventListener("refresh", reflow);
  addEventListener("load", reflow);
  const base = $(".ftr .base");
  if (base) {
    const a = document.createElement("a"); a.href = "#"; a.className = "hints-again"; a.textContent = "Show the bartender's hints again";
    a.addEventListener("click", e => { e.preventDefault(); try { Object.keys(localStorage).filter(k => k.startsWith("brew-hint-")).forEach(k => localStorage.removeItem(k)); } catch {} location.reload(); });
    base.appendChild(a);
  }

  /* 8. The logo hiccups now and then */
  const brand = $(".brand");
  if (brand) {
    const hic = () => {
      gsap.fromTo(brand, { y: 0, rotation: 0 }, { y: -6, rotation: -6, duration: .6, ease: "hiccup", clearProps: "transform" });
      const r = brand.getBoundingClientRect(), t = document.createElement("span");
      t.className = "hic"; t.textContent = "hic!"; Object.assign(t.style, { left: r.right - 10 + "px", top: r.top + "px" });
      document.body.appendChild(t);
      gsap.fromTo(t, { y: 0, opacity: 0, scale: .4 }, { y: -36, opacity: 1, scale: 1, rotation: 12, duration: .5, ease: "back.out(3)",
        onComplete: () => gsap.to(t, { opacity: 0, y: -60, duration: .5, delay: .4, onComplete: () => t.remove() }) });
      gsap.delayedCall(gsap.utils.random(14, 26), hic);
    };
    gsap.delayedCall(9, hic);
  }
});
