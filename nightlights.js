/* PROTOTYPE · "After hours" stout mode.
   Lights off no longer means "navy veil + one torch". Each scene's REAL light sources (bar bulbs, kettle fire,
   tram lamps, the fermenter porthole, a QC inspection strip) punch warm holes in the dark and follow the sprites
   they belong to, the cursor is a small hand lantern, and phosphor/neon "after-hours" notes appear that only
   exist when the lights are off.  Desktop + touch: on coarse pointers the lantern parks on the scene's subject.

   Integration: load after journey.js (needs .jstage/.kbox/.night built). Pure DOM + CSS masks, no canvas. */
(function () {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(pointer: coarse)").matches;
  const WARM = "255,176,92", FIRE = "255,120,40", MOON = "150,180,255", COOL = "200,235,255", NEON = "255,70,140", PHOS = "140,255,190";

  /* light sources per scene. sel = follow a sprite (fx/fy = point inside its box), or x/y in the 1440x900 design box.
     r = radius in design px, a = bloom strength, f = flicker, sx = horizontal stretch (ellipse). */
  const LIGHTS = {
    top:      [{ sel: ".ah-neon", fx: .5, fy: .5, r: 300, c: NEON, a: .30 }, { sel: "#h-ticket", fit: .62, c: WARM, a: .06 }],
    mill:     [{ sel: "#ml-tun", fx: .5, fy: .22, r: 300, c: WARM, a: .30, f: .05 }, { sel: ".ml-card", fit: .7, c: WARM, a: .05, max: 6 }, { sel: ".ah-neon", fx: .5, fy: .5, r: 240, c: PHOS, a: .22 }],
    boil:     [{ sel: "#bo-kettle", fx: .5, fy: .97, r: 330, c: FIRE, a: .55, f: .22 }, { x: 285, y: 250, r: 280, c: MOON, a: .22 }, { sel: ".bo-sched", fit: .7, c: WARM, a: .06 }],
    chill:    [{ x: 960, y: 660, r: 380, c: FIRE, a: .40, f: .08, sx: 1.7 }, { sel: ".ah-neon", fx: .5, fy: .5, r: 220, c: PHOS, a: .2 }],
    ferment:  [{ x: 740, y: 416, r: 260, c: WARM, a: .5, f: .04 }, { x: 1200, y: 132, r: 120, c: WARM, a: .25 }, { sel: ".fe-card", fit: .62, c: WARM, a: .08, max: 6 }],
    bottling: [{ x: 1060, y: 640, r: 360, c: COOL, a: .28, sx: 2.2, f: .02 }, { sel: ".ah-neon", fx: .5, fy: .5, r: 240, c: NEON, a: .25 }],
    tram:     [{ sel: ".tr-lamp", fx: .5, fy: .4, r: 150, c: WARM, a: .45, f: .05, max: 8 }, { sel: ".tr-win.on, .tr-win.ah-on", fx: .5, fy: .5, r: 90, c: WARM, a: .25, max: 10 }, { x: 1300, y: 90, r: 260, c: MOON, a: .2 }, { sel: ".tr-post-l", fx: .5, fy: .6, r: 230, c: WARM, a: .5, f: .04, max: 4 }, { sel: "#tr-form", fit: .62, c: WARM, a: .05 }],
    bar:      [{ sel: ".br-glass", fx: .5, fy: .5, r: 300, c: WARM, a: .45, f: .03, max: 6 }, { sel: ".ah-neon", fx: .5, fy: .5, r: 260, c: NEON, a: .3 }]
  };
  /* notes that glow only when the lights are out (decorative: aria-hidden). kind neon = bent tube, phos = glow chalk */
  // CLARITY PASS: at most ONE per scene, parked where no text ever sits (checked against labels, cards, forms)
  const NOTES = {
    top: [["neon", "aberto", 1180, 150, -4]],
    mill: [["neon", "fresh grind", 1040, 640, 3]],
    boil: [["phos", "{% comment %} don't tell the client {% endcomment %}", 560, 862, -1]],
    chill: [["phos", "200 OK · 200 OK · (it's 2am)", 140, 690, -2]],
    ferment: [["phos", "yeast never sleeps.\nbarril does.", 1010, 800, 3]],
    bottling: [["neon", "QC", 90, 440, -3]],
    tram: [["phos", "last tram 23:40 · last commit 23:41", 80, 760, -2]],
    bar: [["neon", "fechado? nunca.", 150, 742, -3]]
  };
  // where the lantern parks on touch screens (design coords), per scene
  const PARK = { top: [935, 360], mill: [1050, 300], boil: [990, 360], chill: [960, 560], ferment: [720, 420], bottling: [1000, 540], tram: [720, 450], bar: [1100, 420] };

  const stages = [...document.querySelectorAll(".jscene")].map(sec => {
    const stage = sec.querySelector(".jstage"), box = stage.querySelector(".kbox"), night = stage.querySelector(".night");
    // the after-hours layer: a second design box over the night, mirroring the scene box transform
    const ah = document.createElement("div"); ah.className = "kbox ah-box"; ah.setAttribute("aria-hidden", "true");
    ah.innerHTML = (NOTES[sec.id] || []).map(([k, t, x, y, r]) => `<div class="ah-${k}" style="left:${x}px;top:${y}px;rotate:${r}deg">${t.replace(/\n/g, "<br>")}</div>`).join("");
    const bloom = document.createElement("div"); bloom.className = "night-bloom"; bloom.setAttribute("aria-hidden", "true");
    night.after(bloom); bloom.after(ah);
    return { id: sec.id, sec, stage, box, night, bloom, ah };
  });

  /* PERF: the loop only does real work while something moves (scroll, pointer, a theme flip, the scrub settling
     ~1.5s after), and flicker / the touch lantern's breathing tick at ~10fps on cached geometry. Writes are skipped
     unless a light moved >= 2px. The active scene is a hit test at the viewport centre: sticky stages under the
     covering sheet stay 100% "intersecting", so an IntersectionObserver never hands the light back on scroll-up. */
  let active = null, mx = innerWidth / 2, my = innerHeight / 2, hasPtr = false, t0 = performance.now();
  let hotUntil = 0, lastTick = 0, lastPick = 0, lastY = -1, geo = null, geoFor = null;
  const heat = (ms = 1500) => { hotUntil = Math.max(hotUntil, performance.now() + ms); };
  addEventListener("pointermove", e => { if (e.pointerType === "mouse" || !coarse) { mx = e.clientX; my = e.clientY; hasPtr = true; heat(300); } }, { passive: true });
  addEventListener("pointerdown", e => { if (coarse) { mx = e.clientX; my = e.clientY; hasPtr = true; heat(300); } }, { passive: true });
  addEventListener("scroll", () => heat(), { passive: true });
  addEventListener("resize", () => heat(), { passive: true });
  document.addEventListener("brew:theme", () => { heat(); if (active) active._key = ""; });
  const bySec = new Map(stages.map(s => [s.sec, s]));
  function pick() {
    const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2), sec = el && el.closest(".jscene"), s = sec && bySec.get(sec);
    if (s && s !== active) { if (active) active._key = ""; active = s; geo = null; if (coarse) hasPtr = false; }
  }
  // the design box transform is an inline "translate(..px, ..px) scale(..)" written by journey.js: parse it, no getComputedStyle
  const mCache = new Map();
  const matrixOf = el => { const t = el.style.transform || ""; let m = mCache.get(t); if (!m) { try { m = new DOMMatrix(t || undefined); } catch (e) { m = new DOMMatrix(); } mCache.clear(); mCache.set(t, m); } return m; };
  const noise = (t, k) => Math.sin(t * 7.1 + k) * .5 + Math.sin(t * 13.3 + k * 2.1) * .3 + Math.sin(t * 23.7 + k * 3.7) * .2;
  const q2 = v => Math.round(v / 2) * 2;

  // geometry (where each light sits, in stage px): the expensive part, only while hot
  function measure(s) {
    const sr = s.stage.getBoundingClientRect(), m = matrixOf(s.box), sc = m.a || 1, out = [], now = performance.now();
    // element lists are re-queried at most once a second (tram windows switch .on with the dusk)
    s._els = s._els || {}; const fresh = now - (s._elsAt || 0) < 1000; if (!fresh) s._elsAt = now;
    (LIGHTS[s.id] || []).forEach((L, k) => {
      if (L.sel) {
        const els = s._els[k] = fresh && s._els[k] ? s._els[k] : [...s.stage.querySelectorAll(L.sel)].slice(0, L.max || 1);
        els.forEach(el => {
          const r = el.getBoundingClientRect(); if (!r.width) return;
          const x = r.left - sr.left + r.width * (L.fx ?? .5), y = r.top - sr.top + r.height * (L.fy ?? .5);
          if (x < -200 || y < -200 || x > sr.width + 200 || y > sr.height + 200) return;
          out.push({ L, k, x, y, r: L.fit ? Math.max(r.width, r.height) * L.fit + 40 : L.r * sc });
        });
      } else { const p = m.transformPoint(new DOMPoint(L.x, L.y)); out.push({ L, k, x: p.x, y: p.y, r: L.r * sc }); }
    });
    geoFor = s;
    return { sr, m, sc, out };
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (root.dataset.theme !== "dark") return;
    const hot = now < hotUntil;
    if (hot && (now - lastPick > 120 || scrollY !== lastY)) { lastPick = now; lastY = scrollY; pick(); }
    if (!active) { pick(); if (!active) return; }
    const s = active;
    const animated = !reduce && !coarse && (LIGHTS[s.id] || []).some(L => L.f);   // phones: a still lantern, no flicker repaints
    if (!hot && geo && geoFor === s) { if (!animated || now - lastTick < 100) return; }   // idle: ~10fps flicker on cached geometry
    if (hot || !geo || geoFor !== s) geo = measure(s);
    lastTick = now;
    const { sr, m, sc } = geo, t = (now - t0) / 1000;
    if (s.ah.style.transform !== s.box.style.transform) {
      s.ah.style.transform = s.box.style.transform;
      // phones / short windows crop the design box: hide any after-hours note that would be cut off at an edge or sit under the header
      [...s.ah.children].forEach(n => { n.style.visibility = ""; const r = n.getBoundingClientRect();
        n.style.visibility = r.left < sr.left + 8 || r.right > sr.right - 8 || r.top < sr.top + 96 || r.bottom > sr.bottom - 8 ? "hidden" : ""; });
    }
    const pts = geo.out.map((g, i) => { const L = g.L, fl = L.f && !reduce ? 1 + noise(t, g.k + i) * L.f : 1;
      return { x: g.x, y: g.y, r: g.r * fl, a: L.a * fl, c: L.c, sx: L.sx || 1 }; });
    // the hand lantern (cursor) — on touch it parks on the scene's subject and breathes slowly
    let lx = mx - sr.left, ly = my - sr.top;
    if (coarse && !hasPtr) { const P = PARK[s.id] || [720, 450], p = m.transformPoint(new DOMPoint(P[0], P[1])); lx = p.x; ly = p.y; }
    const lr = coarse ? 150 : 175 * (reduce ? 1 : 1 + noise(t, 99) * .025);
    pts.push({ x: lx, y: ly, r: lr, a: .22, c: WARM, sx: 1, lantern: true });
    // skip the (full-stage) mask + screen-blend repaint unless a light moved/grew >= 2px or dimmed visibly
    const key = pts.map(p => q2(p.x) + "," + q2(p.y) + "," + q2(p.r) + "," + Math.round(p.a * 50)).join(";");
    if (key === s._key) return; s._key = key;
    const f0 = v => v.toFixed(0);
    // mask: every light is a transparent hole in the dark; intersect = multiply their alphas
    s.night.style.webkitMaskImage = s.night.style.maskImage = pts.map(p => `radial-gradient(${p.sx === 1 ? "circle " + f0(p.r) + "px" : "ellipse " + f0(p.r * p.sx) + "px " + f0(p.r) + "px"} at ${f0(p.x)}px ${f0(p.y)}px, rgba(0,0,0,${p.lantern ? 0 : .08}) 0, rgba(0,0,0,.55) 55%, #000 100%)`).join(",");
    // bloom: coloured light spilling onto the papercraft (screen blend)
    s.bloom.style.background = pts.map(p => `radial-gradient(${p.sx === 1 ? "circle " + f0(p.r * .9) + "px" : "ellipse " + f0(p.r * p.sx * .9) + "px " + f0(p.r * .9) + "px"} at ${f0(p.x)}px ${f0(p.y)}px, rgba(${p.c},${p.a.toFixed(2)}) 0, rgba(${p.c},${(p.a * .35).toFixed(2)}) 40%, rgba(${p.c},0) 100%)`).join(",");
  }
  heat(); requestAnimationFrame(frame);
  // tram: when the lights go out, it's dusk already — light a deterministic half of the windows
  const tramDusk = () => document.querySelectorAll("#tram .tr-win").forEach((w, i) => w.classList.toggle("ah-on", root.dataset.theme === "dark" && (i * 7919 % 13) < 6));
  document.addEventListener("brew:theme", tramDusk); addEventListener("load", () => setTimeout(tramDusk, 3500));
  window.NightLights = { LIGHTS, NOTES, get active() { return active && active.id; } };
})();
