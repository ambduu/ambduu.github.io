/* Assembler: builds each scene's section + sticky stage, runs its init with a scrub range. */
(function () {
  gsap.registerPlugin(ScrollTrigger, CustomEase, CustomWiggle, Physics2DPlugin, ...(window.SplitText ? [SplitText] : []));
  // PERF: a mobile URL bar showing/hiding must not re-measure every trigger mid-scroll (that refresh is the classic "stick")
  ScrollTrigger.config({ ignoreMobileResize: true });
  const main = document.getElementById("journey");
  const scenes = (window.SCENES || []).slice().sort((a, b) => a.order - b.order);
  // scenes are paper sheets stacked on top of each other: each one slides up over the last one (no hard colour cuts).
  // A scene keeps its full story length; the extra 100vh is the stretch where the next sheet covers it.
  const STACK = !K.reduced;
  let scT = 0; // scroll-idle timer (see the scroll listener below)
  scenes.forEach((sc, i) => {
    const sec = document.createElement("section"), last = i === scenes.length - 1;
    sc._last = last;
    sec.className = "jscene"; sec.id = sc.id;
    sec.style.height = (Math.round((sc.height || 200) * (innerWidth < 700 && (sc.height || 200) > 150 ? .78 : 1)) + (STACK && !last ? 100 : 0)) + "vh";
    if (STACK && i) { sec.style.marginTop = "-100vh"; sec.style.zIndex = i + 1;
      sec.insertAdjacentHTML("afterbegin", '<i class="jtear" aria-hidden="true"></i>'); }
    sec.style.setProperty("--bg", sc.bg || "#e9a03a");
    const stage = document.createElement("div");
    stage.className = "jstage"; stage.innerHTML = sc.html(K);
    const night = document.createElement("div"); night.className = "night"; night.setAttribute("aria-hidden", "true"); stage.appendChild(night);
    stage.insertAdjacentHTML("beforeend", '<i class="jshade" aria-hidden="true"></i>');
    sec.appendChild(stage); main.appendChild(sec);
    sc._sec = sec; sc._stage = stage;
  });
  // scale every design box (1440x900) to cover its stage, keeping data-focus (x %) in view on portrait screens
  const fit = () => document.querySelectorAll(".kbox").forEach(b => {
    const st = b.parentElement, W = st.clientWidth, H = st.clientHeight;
    const r = W / H, sc = r >= 1 && r < 1.6 ? W / 1440 : Math.max(W / 1440, H / 900), f = (b.dataset.focus != null && b.dataset.focus !== "" ? +b.dataset.focus : 50) / 100;
    let tx = (W - 1440 * sc) / 2; if (W / H < 1440 / 900) tx = Math.min(0, Math.max(W - 1440 * sc, W / 2 - 1440 * sc * f));
    b.style.transform = `translate(${tx}px, ${r >= 1 && r < 1.6 ? H - 900 * sc - Math.max(0, (H - 900 * sc) * .35) : (H - 900 * sc) / 2}px) scale(${sc})`;
  });
  let fitQ = 0;
  fit(); addEventListener("resize", () => { if (!fitQ) fitQ = requestAnimationFrame(() => { fitQ = 0; fit(); }); });
  // cursor light: shadows fall away from the pointer (or device tilt). --lx/--ly ≈ 1 = light from top-left.
  // quantised + rAF-batched so the heavy drop-shadow filters repaint only when the light really moves
  const root = document.documentElement, light = { x: 1, y: 1 }, shown = { x: 1, y: 1 }; var lightTo;
  const q = v => Math.round(v * 25) / 25;
  // PERF: never move the shadows while the page is scrolling (each move re-rasterises every shadowed cut-out); catch up once it settles
  const paint = () => { if (scT) { clearTimeout(paint.t); paint.t = setTimeout(paint, 220); return; } const x = q(light.x), y = q(light.y);
    if (x === shown.x && y === shown.y) return; shown.x = K.lx = x; shown.y = K.ly = y;
    scenes.forEach(sc => sc._vis && lightTo(sc._stage)); };
  // PERF: write --lx/--ly only on on-screen stages (not :root) so a light change restyles ~1 scene, not the whole document
  lightTo = el => { el.style.setProperty("--lx", shown.x); el.style.setProperty("--ly", shown.y); };
  // PERF: the stout-mode lantern (--mx/--my) is likewise written only on the visible stages, not on :root
  const lantern = () => scenes.forEach(sc => { if (sc._vis) { sc._stage.style.setProperty("--mx", mx + "px"); sc._stage.style.setProperty("--my", my + "px"); } });
  K.lx = K.ly = 1;
  const lx = gsap.quickTo(light, "x", { duration: .8, onUpdate: paint }), ly = gsap.quickTo(light, "y", { duration: .8, onUpdate: paint });
  let mq = 0, mx = 0, my = 0;
  addEventListener("pointermove", e => { lx(1.6 - 1.6 * e.clientX / innerWidth + .2); ly(1.4 - 1.2 * e.clientY / innerHeight + .3);
    mx = e.clientX; my = e.clientY;
    if (!mq && root.dataset.theme === "dark") mq = requestAnimationFrame(() => { mq = 0; lantern(); });
  }, { passive: true });
  document.addEventListener("brew:theme", lantern);
  // (no device-tilt light: on phones the shadows are off for speed, and tilt fired repaints non-stop)
  // loader
  const loader = document.getElementById("loader"), beer = document.getElementById("loaderBeer"), pct = document.getElementById("loaderPct");
  const o = { v: 0 };
  const done = () => {
    gsap.to(loader, { yPercent: -100, duration: 1, ease: "power3.inOut", delay: .2, onComplete: () => loader.remove() });
    // PERF: init each scene inside a gsap.context; pause its idle (repeat:-1) tweens and its ticker callbacks while off screen
    const tAdd = gsap.ticker.add.bind(gsap.ticker), tRem = gsap.ticker.remove.bind(gsap.ticker), wrapped = new Map();
    gsap.ticker.remove = fn => tRem(wrapped.get(fn) || fn);
    scenes.forEach(sc => {
      gsap.ticker.add = (fn, ...a) => { const w = (...args) => { if (sc._vis) fn(...args); }; wrapped.set(fn, w); return tAdd(w, ...a); };
      let ctx;
      try { ctx = gsap.context(() => sc.init && sc.init(sc._stage, K, { trigger: sc._sec, start: "top top", end: sc._last || !STACK ? "bottom bottom" : "bottom 200%" })); }
      catch (e) { console.error("scene " + sc.id, e); }
      gsap.ticker.add = tAdd;
      const idle = ctx ? ctx.getTweens().filter(t => t.repeat && t.repeat() === -1) : [];
      sc._idle = idle;
      const set = v => { sc._vis = v; idle.forEach(t => v && !scT ? t.resume() : t.pause()); if (v) { lightTo(sc._stage); if (root.dataset.theme === "dark") lantern(); } };
      ScrollTrigger.create({ trigger: sc._sec, start: "top bottom", end: "bottom top", onToggle: s => set(s.isActive), onRefresh: s => set(s.isActive) });
    });
    // the covering: the sheet underneath sinks back and darkens while the next one slides over it
    if (STACK) scenes.forEach((sc, i) => { const nx = scenes[i + 1]; if (!nx) return;
      // PERF: only while it is being covered, the sheet underneath gets its own compositor layer, so sinking/darkening
      // it is a GPU transform/opacity instead of re-painting the whole stage (and all its drop-shadow filters) every frame
      gsap.timeline({ scrollTrigger: { trigger: nx._sec, start: "top bottom", end: "top top", scrub: true,
          onToggle: s => sc._stage.classList.toggle("jcover", s.isActive) } })
        .fromTo(sc._stage.querySelector(".jshade"), { opacity: 0 }, { opacity: .5, ease: "power1.in" }, 0)
        .fromTo(sc._stage, { scale: 1, yPercent: 0 }, { scale: .94, yPercent: -4, transformOrigin: "50% 100%", ease: "power1.in" }, 0); });
    ScrollTrigger.refresh();
  };
  gsap.to(o, { v: 100, duration: K.reduced ? .2 : 1.6, ease: "power2.inOut",
    onUpdate: () => { pct.textContent = Math.round(o.v) + "%"; beer.style.height = o.v * .78 + "%"; }, onComplete: done });
  // progress keg
  gsap.to("#jprogFill", { scaleY: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: .3 } });
  // header colour adapts to the scene under it
  scenes.forEach(sc => ScrollTrigger.create({ trigger: sc._sec, start: "top 80", end: () => sc._sec.offsetTop + sc._sec.offsetHeight - (STACK && !sc._last ? innerHeight : 0) - 80,
    onToggle: s => s.isActive && document.getElementById("jh").setAttribute("data-tone", sc.headerTone || "light") }));
  // PERF: while the page is scrolling, the visible scenes' idle loops (needle jitter, sways, shimmer) are held so the
  // frames go to the scrub; they resume 140ms after the last scroll event. (Deliberately no class/style flip here:
  // switching an inherited property on scroll start restyles every stage subtree and is itself a hitch.)
  const idleAll = v => scenes.forEach(sc => sc._vis && sc._idle && sc._idle.forEach(t => v ? t.resume() : t.pause()));
  addEventListener("scroll", () => { if (!scT) idleAll(false); clearTimeout(scT);
    scT = setTimeout(() => { scT = 0; idleAll(true); }, 140); }, { passive: true });
  // smooth anchor jumps
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const t = document.querySelector(a.getAttribute("href")); if (!t) return;
    e.preventDefault(); const h = a.getAttribute("href");
    // #tram lands where the order slip is ready; other chapters a third of the way in
    const top = h === "#top" ? 0 : h === "#tram" ? t.offsetTop + t.offsetHeight - innerHeight * (STACK ? 2 : 1) - 4 : t.offsetTop + Math.min(innerHeight * .35, t.offsetHeight - innerHeight);
    window.scrollTo({ top, behavior: K.reduced ? "auto" : "smooth" });
  }));

  // the scenes are built for one orientation; rebuild when the screen flips between portrait and landscape
  const pq = matchMedia("(max-aspect-ratio: 1/1)");
  pq.addEventListener("change", () => { try { sessionStorage.setItem("brew-y", scrollY / document.documentElement.scrollHeight); } catch (e) {} location.reload(); });
  try { const f = sessionStorage.getItem("brew-y"); if (f) { sessionStorage.removeItem("brew-y"); addEventListener("load", () => setTimeout(() => scrollTo(0, f * document.documentElement.scrollHeight), 50)); } } catch (e) {}
})();
