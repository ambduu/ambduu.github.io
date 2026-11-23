/* PROTOTYPE · Bar signs that behave like real objects.
   Same jokes / scene logic / SPOTS as signs.js. New:
   - real pendulum physics: planks swing on two chains (parallelogram), tins swing from one nail on a wire;
     entry drop with bounce, the cursor brushing a sign pushes it, scrolling gives it a nudge, idle draught.
   - a real cast shadow on the wall: in lager mode it follows --lx/--ly; in stout mode the cursor lantern is a
     point light, so the shadow falls AWAY from it, grows softer with distance, and the sign dims outside the beam.
   - textures: SVG wood grain + knots + routed letters, chipped enamel with rust drips, chalk that looks like chalk.
   - knock: 1st click snaps ONE chain (the plank dangles and swings from the other), 2nd click / 0.9s later it drops.
   - a tiny synthesised chain squeak at the turning points of big swings + a clank on knock (after a user gesture only;
     set localStorage "brew-sound" = "off" to mute). */
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const root = document.documentElement;
  const HOME = [
    ["Fresh code on tap", "No hangover. No legacy jQuery."], ["Happy hour", "0% broken checkouts, all day."],
    ["Our Liquid is stronger", "Shopify Liquid, that is. Calm down."], ["Bugs?", "Squashed before last call."],
    ["Warning", "Themes may cause sudden sales."], ["checkout.liquid", "has left the building. Extensions only."],
    ["200+ stores served", "And he still remembers every theme name."], ["11 years on tap", "Brewing Shopify since 2015."],
    ["Designed in Figma", "Brewed in Liquid. Served worldwide."], ["Tip jar accepts", "5-star reviews and repeat agencies."],
    ["Last call", "for slow Shopify stores."], ["Today's special", "A theme your team edits without crying."],
    ["Cash only", "Just kidding. Invoices welcome."], ["Free refills", "on bug fixes after launch."],
    ["No apps were harmed", "in the making of this theme."], ["Remote bar", "Open in your timezone too."],
    ["Agencies welcome", "UK, US, Germany, India. Pull up a stool."], ["Hiring?", "Contract, freelance or full-time. Ask the bartender."],
    ["Tap the pint", "Stout mode: lights off, your cursor turns into a lantern."], ["Scroll responsibly", "The brew knows the way."],
    ["Saúde!", "That's 'cheers' in Portuguese. Practise it."], ["Made in Portugal", "Sun, sea and sections."],
    ["Pastel de nata", "Best paired with a fresh theme."], ["Tram 28 is slow", "Your store won't be."],
    ["Cork coasters only", "Portugal makes half the world's cork."]
  ];
  const BY = {
    top: [["Welcome in", "Barril's taking orders. Scroll to start the brew."], ["Now pouring", "Shopify, freshly brewed."]],
    mill: [["House special", "Custom OS 2.0, no artificial apps."], ["Figma → Liquid", "Pixel for pixel, pint for pint."]],
    boil: [["Hot stuff", "Checkout UI extensions on the boil."], ["Goodbye Scripts", "Shopify Functions do it upgrade-safe now."], ["Galo on duty", "Portugal's finest courier. Mostly awake."]],
    chill: [["Microservices", "Small kegs, each on its own tap."], ["Spring Boot on tap", "Java back ends, poured cold."]],
    ferment: [["Aged in oak", "Best before: never."]],
    bottling: [["Bottled & capped", "Ships on purpose, not by accident."], ["No Friday deploys", "Unless you buy the next round."]],
    tram: [["Free delivery", "Anywhere with Wi-Fi."], ["Order here", "We reply faster than a pint warms up."]],
    bar: [["Last orders", "Thanks for scrolling the whole brew."], ["Saúde!", "Now go build something good."]]
  };
  // CLARITY PASS: only three signs on the whole page, one per spot, each with its one best joke, and only where the
  // scene's own text is out of the way: the hero once its copy has floated off, the chiller, and the bar.
  const SPOTS = { top: [{ k: "plank", x: 40 }], chill: [{ k: "tin", y: [48, 54] }], bar: [{ k: "plank", x: 50 }] };
  const BEST = { top: ["Now pouring", "Shopify, freshly brewed."], chill: ["Microservices", "Small kegs, each on its own tap."],
    bar: ["Last orders", "Thanks for scrolling the whole brew."] };
  const MAX = 3, hung = new Set();
  // QA hook: ?sign=plank|tin|chalk|azulejo forces a kind everywhere (prototype only)
  const FORCE = new URLSearchParams(location.search).get("sign");

  /* ---------- sound: chain squeak + clank, synthesised (no files) ---------- */
  let ac = null, lastSq = 0;
  const soundOn = () => { try { return localStorage.getItem("brew-sound") !== "off"; } catch (e) { return true; } };
  // sound removed at the owner's request: no AudioContext is ever created, so squeak()/clank() are silent no-ops
  function squeak(amt) {
    const now = performance.now(); if (!ac || now - lastSq < 380 || !soundOn()) return; lastSq = now;
    const t = ac.currentTime, g = ac.createGain(), bp = ac.createBiquadFilter(), o = ac.createOscillator(), o2 = ac.createOscillator(), lfo = ac.createOscillator(), lg = ac.createGain();
    bp.type = "bandpass"; bp.frequency.value = 2300; bp.Q.value = 6;
    o.type = "sawtooth"; o2.type = "triangle"; const f0 = 820 + Math.random() * 260;
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 1.55, t + .16);
    o2.frequency.setValueAtTime(f0 * 1.51, t); o2.frequency.exponentialRampToValueAtTime(f0 * 2.2, t + .16);
    lfo.frequency.value = 38; lg.gain.value = 60; lfo.connect(lg); lg.connect(o.frequency); lg.connect(o2.frequency);   // the stick-slip judder
    const v = Math.min(.035, .012 + amt * .06);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .03); g.gain.exponentialRampToValueAtTime(.0005, t + .2);
    o.connect(bp); o2.connect(bp); bp.connect(g); g.connect(ac.destination);
    [o, o2, lfo].forEach(x => { x.start(t); x.stop(t + .22); });
  }
  function clank() {
    if (!ac || !soundOn()) return; const t = ac.currentTime;
    [2710, 4130, 6290, 1870].forEach((f, i) => { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f * (.97 + Math.random() * .06);
      g.gain.setValueAtTime(.03 / (i + 1), t); g.gain.exponentialRampToValueAtTime(.0001, t + .35 - i * .05); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + .4); });
  }

  /* ---------- markup ---------- */
  // chalk needs a real SVG filter in the document (Chrome won't resolve filter:url(data:...#id))
  document.body.insertAdjacentHTML("beforeend", `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="sg-chalk" x="-5%" y="-10%" width="110%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" result="d"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.6 1.55" result="holes"/>
    <feComposite in="d" in2="holes" operator="in"/></filter></svg>`);
  const CHAIN = '<i class="sg-chain l"></i><i class="sg-chain r"></i>';
  function make([title, line], spot) {
    let base = FORCE ? (FORCE === "azulejo" ? "tin" : FORCE) : spot.k;
    const az = FORCE ? FORCE === "azulejo" : base === "tin" && Math.random() < .5;
    const el = document.createElement("div");
    el.className = `sign2 sign2--${base}${az ? " sign2--azulejo" : ""}`;
    el.setAttribute("aria-hidden", "true");   // decorative jokes: no screen-reader chatter every 6s
    const words = `<b>${title}</b><span>${line}</span>`;
    el.innerHTML = base === "plank"
      ? `<div class="sg-shadow"></div>${CHAIN}<div class="sg-board"><div class="sg-face">${words}</div><em class="eye l"></em><em class="eye r"></em><i class="sg-spec"></i></div>`
      : base === "tin"
      ? `<div class="sg-shadow"></div><em class="sg-nail"></em><div class="sg-swing"><svg class="sg-wire" viewBox="0 0 250 50" preserveAspectRatio="none"><path d="M13 47 L125 1 L237 47"/></svg><div class="sg-board"><div class="sg-face">${words}</div><em class="screw tl"></em><em class="screw tr"></em><em class="screw bl"></em><em class="screw br"></em><i class="sg-spec"></i></div></div>`
      : `<div class="sg-shadow"></div><div class="sg-swing"><div class="sg-board"><div class="sg-face">${words}</div><i class="sg-dust"></i><i class="sg-ledge"></i></div></div>`;
    if (base === "plank") el.style.left = (innerWidth < 700 ? 50 : spot.x) + "vw";
    if (base === "tin") { const [a, b] = spot.y || [26, 50]; el.style.top = (a + Math.random() * (b - a)) + "vh"; }
    el.addEventListener("click", e => knock(S, e));
    el.style.opacity = 0;                               // fades in as it drops, fades out as it is lifted away
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => { if (!S.leaving) el.style.opacity = ""; }));
    // size the wall shadow to the board it belongs to
    const bd = el.querySelector(".sg-board"), sh = el.querySelector(".sg-shadow");
    sh.style.width = bd.offsetWidth + "px"; sh.style.height = bd.offsetHeight + "px"; sh.style.top = bd.offsetTop + (bd.offsetParent !== el ? bd.offsetParent.offsetTop : 0) + "px";
    if (base === "tin") sh.style.transformOrigin = `50% ${-bd.offsetTop}px`;
    const S = { el, base, th: 0, w: 0, drop: -260, dv: 0, chains: 2, side: 0, gone: false, born: performance.now(),
      board: el.querySelector(".sg-board"), shadow: el.querySelector(".sg-shadow"), swing: el.querySelector(".sg-swing"),
      cl: el.querySelector(".sg-chain.l"), cr: el.querySelector(".sg-chain.r") };
    S.rest = S.board.getBoundingClientRect();   // resting layout box, before any swing/drop transform
    // hung with a little throw so it arrives swinging
    S.th = (Math.random() < .5 ? -1 : 1) * (.18 + Math.random() * .12);
    if (base === "chalk") { S.drop = 0; S.th = 0; S.slide = 1; }
    if (FORCE) { S.drop = -8; S.th *= .6; if (S.slide) S.slide = .05; }
    return S;
  }

  /* ---------- physics + light, one rAF ---------- */
  let live = null, px = -1, py = -1, pvx = 0, lastY = scrollY, lastT = performance.now();
  addEventListener("pointermove", e => { if (px >= 0) pvx = pvx * .5 + (e.clientX - px) * .5; px = e.clientX; py = e.clientY; }, { passive: true });
  addEventListener("resize", () => { if (live) { const t = live.board.style.transform; live.board.style.transform = ""; if (live.swing) live.swing.style.transform = "";
    live.rest = live.board.getBoundingClientRect(); live.board.style.transform = t; } }, { passive: true });
  const num = (v, d) => { const n = parseFloat(v); return isNaN(n) ? d : n; };
  // PERF: the loop only runs while a sign hangs (kick() restarts it), and it never reads layout per frame:
  // the board's screen box is its resting layout box (measured once, the sign is position:fixed) + its live offset
  let raf = 0;
  const kick = () => { if (!raf) { lastT = performance.now(); lastY = scrollY; raf = requestAnimationFrame(step); } };
  function step(now) {
    raf = 0;
    const S = live; const dt = Math.min(.033, (now - lastT) / 1000); lastT = now;
    const sy = scrollY, dy = sy - lastY; lastY = sy;
    if (!S || S.gone) return;
    raf = requestAnimationFrame(step);
    // text can scroll / animate in under a sign after it was hung (scene intros fade copy in): re-check twice a second
    if (!FORCE && !S.leaving && now - (S.chk || 0) > 500) { S.chk = now; if (covers(S) || !settled()) { clearTimeout(timer); leave(S); } }
    const L = S.base === "plank" ? 138 : 70;                     // chain / wire length (px)
    const k = 9.8 / (L / 260);                                  // g / L, with 260px ≈ 1m
    // forces: gravity restoring, damping, scroll nudge, pointer brush, idle draught
    const r0 = S.rest, ox = S.ox || 0, oy = S.oy || 0;
    const r = { left: r0.left + ox, right: r0.right + ox, top: r0.top + oy, bottom: r0.bottom + oy, width: r0.width, height: r0.height };
    let ext = Math.max(-40, Math.min(40, -dy)) * .045;                                                   // scroll nudge
    if (px > r.left - 12 && px < r.right + 12 && py > r.top - 12 && py < r.bottom + 12) ext += pvx * 1.6;   // brushed by the cursor
    ext += Math.sin(now / 1300) * .06 + Math.sin(now / 470) * .03;          // bar draught
    const a = S.base === "chalk" ? -70 * S.th - 10 * S.w + ext * .25          // standing board: stiff, it only rocks
      : -k * Math.sin(S.th) - (S.chains === 1 ? .55 : .9) * S.w + ext;
    const pw = S.w; S.w += a * dt; S.th += S.w * dt;
    if (S.chains === 2 && S.base !== "chalk") S.th = Math.max(-.5, Math.min(.5, S.th));
    pvx *= .85;
    // turning point of a big swing = squeak
    if (Math.sign(pw) !== Math.sign(S.w) && Math.abs(S.th) > .07 && S.base !== "chalk") squeak(Math.abs(S.th));
    // vertical: drop in on a spring (chains catch it, it bounces)
    S.dv += (-S.drop * 120 - S.dv * 11) * dt; S.drop += S.dv * dt;
    if (S.leaving) { S.drop += (S.leaving - S.drop) * .14; }
    if (S.slide != null) { S.slide += ((S.leaving ? 1.3 : 0) - S.slide) * .12; }
    pose(S);
    light(S, r);
  }
  function pose(S) {
    const th = S.th, deg = th * 57.3;
    if (S.base === "plank") {
      if (S.chains === 2) {
        const L = 138, x = Math.sin(th) * L, y = (1 - Math.cos(th)) * L; S.ox = x; S.oy = y + S.drop;
        S.cl.style.transform = S.cr.style.transform = `rotate(${-deg}deg)`;
        S.board.style.transform = `translate(${x}px, ${y + S.drop}px) rotate(${-deg * .18}deg)`;
        S.cl.style.translate = S.cr.style.translate = `0 ${S.drop}px`;
      } else {
        // one chain snapped: the plank pivots around the remaining chain's eye-screw
        const sgn = S.side, ang = sgn * 74 + deg;
        S.board.style.transformOrigin = sgn > 0 ? "34px 10px" : "calc(100% - 34px) 10px";
        S.board.style.transform = `translate(0, ${S.drop}px) rotate(${ang}deg)`;
        (sgn > 0 ? S.cr : S.cl).style.opacity = 0;
        (sgn > 0 ? S.cl : S.cr).style.transform = `rotate(${-deg * .3}deg)`;
      }
    } else if (S.base === "tin") {
      S.swing.style.transform = `translateY(${S.drop}px) rotate(${-deg}deg)`; S.oy = S.drop;
    } else {
      S.swing.style.transform = `translateY(${(S.slide || 0) * 115}%) rotate(${2 - deg}deg)`;
    }
  }
  function light(S, r) {
    const dark = root.dataset.theme === "dark", cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let ox, oy, blur, op, lit = 1, hx = 20, hy = 15;
    if (!dark) {
      const lx = K.lx || 1, ly = K.ly || 1;
      ox = lx * 14; oy = ly * 22; blur = 14; op = .38;
      hx = 50 - lx * 30; hy = 50 - ly * 34;
    } else {
      // the cursor lantern is a point light: shadow points away from it and softens with distance
      const lx = px < 0 ? innerWidth / 2 : px, ly = py < 0 ? innerHeight * .4 : py;
      const dx = cx - lx, dy = cy - ly, d = Math.hypot(dx, dy) || 1, reach = Math.min(70, d * .14);
      ox = dx / d * reach; oy = dy / d * reach + 6; blur = 6 + d * .035; op = Math.max(.12, .6 - d / 1400);
      lit = Math.max(.62, Math.min(1, 1.15 - (d - 120) / 520));
      hx = Math.max(0, Math.min(100, (lx - r.left) / r.width * 100)); hy = Math.max(0, Math.min(100, (ly - r.top) / r.height * 100));
    }
    const st = S.el.style, key = [ox.toFixed(0), oy.toFixed(0), blur.toFixed(0), op.toFixed(2), lit.toFixed(2), hx.toFixed(0), hy.toFixed(0)].join();
    if (key !== S.lkey) { S.lkey = key;   // custom-property writes restyle the whole sign: only when the light really changed
      st.setProperty("--sox", ox.toFixed(1) + "px"); st.setProperty("--soy", oy.toFixed(1) + "px");
      st.setProperty("--sblur", blur.toFixed(1) + "px"); st.setProperty("--sop", op.toFixed(2));
      st.setProperty("--lit", lit.toFixed(2)); st.setProperty("--hx", hx.toFixed(0) + "%"); st.setProperty("--hy", hy.toFixed(0) + "%"); }
    // the shadow follows the board's live transform
    S.shadow.style.transform = (S.swing ? S.swing.style.transform : S.board.style.transform) || "";
    if (S.base === "plank") S.shadow.style.transformOrigin = S.board.style.transformOrigin || "";
  }

  /* ---------- lifecycle (same scheduling as signs.js) ---------- */
  let scene = "top", timer = 0, n = 0, since = performance.now(), lastScroll = 0; const used = new Set();
  addEventListener("scroll", () => { lastScroll = performance.now(); }, { passive: true });
  function pick() {
    if (!FORCE && BEST[scene]) return BEST[scene];
    const own = (BY[scene] || []).filter(p => !used.has(p[0]));
    let pool = own.length && Math.random() < .6 ? own : HOME.filter(p => !used.has(p[0]));
    if (!pool.length) { used.clear(); pool = HOME; }
    const p = pool[Math.floor(Math.random() * pool.length)]; used.add(p[0]); return p;
  }
  function show() {
    if (document.hidden) return schedule(3000);
    if (!FORCE && hung.size >= MAX) return;                                           // all three have been hung: done
    // never while the page is moving or a scene is still bringing its own text in: wait for a settled, idle view
    const now = performance.now();
    if (!FORCE && (hung.has(scene) || now - lastScroll < 1200 || now - since < 2200)) return schedule(700);
    // hero: only once its copy has floated away (the plain "what he does" line must have the stage to itself)
    if (!FORCE && !settled()) return schedule(700);
    const hc = scene === "top" && document.querySelector(".h-copy");
    if (!FORCE && hc && getComputedStyle(hc).visibility !== "hidden") return schedule(900);
    const spots = FORCE ? [{ k: FORCE === "azulejo" ? "tin" : FORCE, x: 44, y: [30, 34] }]
      : innerWidth < 700 || innerHeight < 650 || (innerWidth <= 821 && innerHeight > innerWidth) ? [] : (SPOTS[scene] || []);   // phones: the scenes need all the room
    if (!spots.length) return schedule(2500);
    live = make(pick(), spots[n++ % spots.length]);
    if (!FORCE && covers(live)) { live.gone = true; live.el.remove(); live = null; return schedule(1800); }
    hung.add(scene);
    kick();
    timer = setTimeout(() => leave(live), FORCE ? 1e9 : 6800 + Math.random() * 1800);
  }
  function leave(S) {
    if (!S || S.gone || S.leaving) return;
    S.leaving = S.base === "chalk" ? 1 : -420; S.el.style.opacity = 0;
    setTimeout(() => { S.gone = true; S.el.remove(); if (live === S) live = null; schedule(1200 + Math.random() * 1600); }, 900);
  }
  function knock(S, e) {
    if (S.gone) return; clearTimeout(timer); clank();
    if (S.base === "plank" && S.chains === 2) {
      const r = S.board.getBoundingClientRect();
      S.chains = 1; S.side = e.clientX < r.left + r.width / 2 ? 1 : -1;   // click the left end -> left chain snaps
      S.th = 0; S.w = S.side * -2.4;
      timer = setTimeout(() => fall(S), 900); return;
    }
    fall(S);
  }
  function fall(S) {
    if (S.gone) return; S.gone = true; clearTimeout(timer); clank();
    const el = S.el, tgt = S.base === "plank" ? el : el;
    el.style.pointerEvents = "none";
    if (window.gsap && window.Physics2DPlugin) {
      gsap.to(tgt, { duration: 1.6, physics2D: { velocity: gsap.utils.random(120, 260), angle: gsap.utils.random(-100, -80), gravity: 1700 },
        rotation: gsap.utils.random(-120, 120), ease: "none", onComplete: () => el.remove() });
    } else el.remove();
    if (live === S) live = null; schedule(2600);
  }
  // never hang a sign over story text, labels, forms or the nav (layout box, ignores the drop-in transform)
  // PERF: only the scene on screen + the header are tested (was every text node of all 9 scenes: ~400 rects per sign)
  const TEXT = "h1, h2, h3, p, .kb-label, form, button, .ktag, .h-ctas, .tp-copy, .tp-coaster, .tp-shot, .tp-act, .tp-picks, [class*=store], [class*=card], [class*=sched], [class*=note]";
  function covers(S) {
    // the board's resting box (measured before any swing/drop) plus a 16px margin. (The old box came from the sign
    // root, which is 0px tall for planks, so a plank was never found to cover anything.)
    const r = S.rest, M = 16, b = { l: r.left - M, t: r.top - M, r: r.right + M, btm: r.bottom + M };
    const sec = document.getElementById(scene);
    const cand = [...document.querySelectorAll(".jh-menu a, .jh-cta"), ...(sec ? sec.querySelectorAll(TEXT) : [])];
    return cand.some(t => { const a = t.getBoundingClientRect();
      if (!a.width || a.bottom < 0 || a.top > innerHeight || a.right < b.l || a.left > b.r || a.bottom < b.t || a.top > b.btm) return false;
      return getComputedStyle(t).visibility !== "hidden"; });   // style read only for the few boxes that overlap
  }
  // the scene's paper sheet must fill the screen: not still sliding up over the last one, not being covered by the next
  function settled() {
    const sec = document.getElementById(scene); if (!sec) return false;
    const nx = sec.nextElementSibling, t = sec.getBoundingClientRect().top;
    return t <= 2 && (!nx || nx.getBoundingClientRect().top >= innerHeight - 2);
  }
  function schedule(ms) { clearTimeout(timer); timer = setTimeout(show, ms); }
  addEventListener("load", () => {
    document.querySelectorAll(".jscene").forEach(s => ScrollTrigger.create({ trigger: s, start: "top center", end: "bottom center",
      onToggle: st => { if (st.isActive && scene !== s.id) { scene = s.id; since = performance.now(); if (live && !FORCE) leave(live); } } }));
    schedule(FORCE ? 400 : 3600);
  });
})();
