/* =========================================================
   brewdcode — shared engine
   One file for every page: chrome injection, theme knob,
   smooth scroll, loader, reveals, pour transitions,
   ticket rotator, cup shelf, story timeline, stacked cases,
   contact + menu-card modals.
   ========================================================= */

/* ---- 1. Site config: edit your details here ---- */
const SITE = {
  name: "Germanjit Singh Sandhu",
  brand: "germanjit",
  email: "ambduu@gmail.com",                // where project enquiries land
  linkedin: "https://www.linkedin.com/in/germanjit-singh-sandhu/",
  github: "https://github.com/ambduu",
  tz: "Europe/Lisbon",
  pages: [                      // in brewing order: mash → boil → ferment → bottle
    { href: "themes.html",       label: "Themes" },
    { href: "shopify-plus.html", label: "Shopify Plus" },
    { href: "apps.html",         label: "Apps & back end" },
    { href: "launch.html",       label: "Speed & launch" },
  ],
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  sget(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
  sset(k, v) { try { sessionStorage.setItem(k, v); } catch {} },
};
const ARROW = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* ---- 2. Theme: apply before paint ---- */
(function initTheme() {
  const saved = store.get("brew-theme");
  document.documentElement.dataset.theme = saved || "dark";
})();

/* ---- 3. Inject shared chrome ---- */
function chrome() {
  const here = location.pathname.split("/").pop() || "index.html";
  const navLinks = [{ href: "index.html", label: "Home" }, ...SITE.pages, { href: "index.html#story", label: "Brew history" }]
    .map(p => {
      const gi = SITE.pages.indexOf(p);
      const how = gi >= 0 ? `data-glass-nav="${gi}"` : "data-pour";
      return `<a href="${p.href}" ${p.href === here ? 'aria-current="page"' : ""} ${how}>${p.label}</a>`;
    }).join("");

  document.body.insertAdjacentHTML("afterbegin", `
    <a class="skip" href="#main">Skip to content</a>
    <div class="loader" id="loader" aria-hidden="true"><div class="inner">
      <div class="cup-fill"><div class="liquid"></div></div>
      <div class="meta"><div class="pct">0%</div><div class="mono muted">Pouring you a fresh one</div></div>
    </div></div>
    <header class="hdr"><div class="shell">
      <div class="pill">
        <a class="brand" href="index.html" data-pour><i></i>${SITE.brand}</a>
        <nav class="nav" aria-label="Main">${navLinks}<a href="#contact" data-contact>Order up</a></nav>
      </div>
      <div class="right">
      <div class="cord-spot" id="cordSpot" aria-hidden="true"></div>
      <div class="pill">
        <button class="sfx" id="sfx" aria-pressed="false" aria-label="Sound effects: off" title="Bar sounds"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path class="w1" d="M16 9.5a3.5 3.5 0 0 1 0 5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path class="w2" d="M18.5 7a7 7 0 0 1 0 10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path class="mute" d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
        <span class="clock">Lisbon <b id="clock">--:--</b></span>
        <div class="knob-wrap">
          <button class="knob" id="knob" aria-label="Switch stout or lager theme"><span class="puff"></span><span class="puff"></span><span class="puff"></span></button>
          <small id="roast">Stout</small>
        </div>
        <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false"><span></span></button>
      </div>
      </div>
    </div></header>
    <div class="navm" id="navm" aria-hidden="true">
      <button class="close" id="navclose" aria-label="Close menu">×</button>
      <nav>${navLinks}<a href="#contact" data-contact>Order up</a></nav>
      <p class="mono muted">Taps open · shipping worldwide</p>
    </div>
    <canvas class="rope-cv" id="ropeCv" aria-hidden="true"></canvas>
    <button class="bulb-hit" id="bulbHit" role="switch" aria-checked="false" aria-label="Pull the light cord to switch between Stout (dark) and Lager (light)"></button>
    <div class="rays" id="rays" aria-hidden="true"></div>
    <div class="iris" id="iris" aria-hidden="true"></div>
    <div class="beerfill" id="beerfill" aria-hidden="true">
      <svg class="beerfill-head" viewBox="0 0 1200 80" preserveAspectRatio="none"><path d="M0 40 Q75 10 150 40 T300 40 T450 40 T600 40 T750 40 T900 40 T1050 40 T1200 40 V80 H0Z"/></svg>
      <canvas class="beerfill-cv"></canvas>
    </div>
    <div class="bubble" id="bubble">Step inside →</div>
    <div class="scrollpipe" id="scrollpipe" aria-hidden="true"><i class="beer"></i><b class="foam"></b><span class="gauge">0%</span></div>
  `);

  const yr = new Date().getFullYear();
  const work = SITE.pages.map(p => `<li><a href="${p.href}" data-pour>${p.label}</a></li>`).join("");
  document.body.insertAdjacentHTML("beforeend", `
    <footer class="ftr"><div class="shell">
      <div class="cols">
        <div><p class="h2" style="font-size:clamp(28px,3vw,40px);margin:0">Small batches,<br>shipped fast.</p><p class="muted" style="margin:14px 0 0;max-width:34ch">Senior Shopify &amp; Shopify Plus developer, brewing stores since 2015. Based in Portugal, pouring worldwide.</p></div>
        <div><h4 class="mono">On tap</h4><ul>${work}</ul></div>
        <div><h4 class="mono">Find your way</h4><ul><li><a href="index.html" data-pour>Back to the bar</a></li><li><a href="index.html#story" data-pour>Brew history</a></li><li><a href="#contact" data-contact>Order up (contact)</a></li><li><a href="${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn tab ↗</a></li><li><a href="${SITE.github}" target="_blank" rel="noopener">GitHub cellar ↗</a></li></ul></div>
        <div><h4 class="mono">Bar status</h4><ul><li><span class="dot" style="display:inline-block;margin-right:8px"></span>Taps open, taking orders</li><li>Remote across Europe · hybrid PT/DE/FR</li><li>Lisbon time <span id="clock2">--:--</span></li></ul></div>
      </div>
      <div class="wm" aria-hidden="true">${SITE.brand}</div>
      <div class="base"><span>© ${yr} ${SITE.name}. Brewed, bottled and coded in Portugal. Please code responsibly.</span><a href="#top" id="totop-link">Back to the top shelf ↑</a></div>
    </div></footer>
    <button class="totop" id="totop" aria-label="Back to top"><svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M8 13V3M4 7l4-4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>

    <div class="modal" id="contact" role="dialog" aria-modal="true" aria-labelledby="ct-title">
      <div class="scrim" data-close></div>
      <div class="panel" data-lenis-prevent>
        <button class="x" data-close aria-label="Close">×</button>
        <canvas class="pint" id="pint" aria-hidden="true"></canvas>
        <span class="mono muted">Open a tab · start a project</span>
        <form id="ct-form" novalidate>
          <h2 id="ct-title">What are we brewing?</h2>
          <input class="hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
          <div class="field"><label for="ct-name">Your name (for the tab)</label><input id="ct-name" name="name" required autocomplete="name"></div>
          <div class="field"><label for="ct-email">Email (where the bartender replies)</label><input id="ct-email" name="email" type="email" required autocomplete="email"></div>
          <div class="field"><label for="ct-type">What are you thirsty for?</label>
            <select id="ct-type" name="type"><option value="">Pick your poison…</option><option>A Shopify Plus build</option><option>Checkout extensions or Shopify Functions</option><option>A custom OS 2.0 theme</option><option>An app, API or headless build</option><option>A speed fix or theme rescue</option><option>Hiring: contract or full-time role</option><option>Surprise me, something else</option></select></div>
          <div class="field"><label for="ct-msg">Pour your heart out (the project brief)</label><textarea id="ct-msg" name="msg" required></textarea></div>
          <button class="btn" type="submit">Send it to the bar <span class="badge">${ARROW}</span></button>
          <p class="muted" style="font-size:14px;margin:14px 0 0">Fill it up and watch the pint pour. Replies within one business day.</p>
        </form>
        <div class="sent">
          <h2>Order on its way 🍺</h2>
          <p class="muted">Your email app just opened with the message ready to go. Hit send there and I'll reply within one business day.</p>
          <p class="muted">Nothing popped up? The bar's address is <a href="mailto:${SITE.email}" style="color:var(--accent)">${SITE.email}</a>.</p>
        </div>
      </div>
    </div>
  `);
}

/* ---- 4. Clock ---- */
function clock() {
  const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: SITE.tz });
  const tick = () => { const t = fmt.format(new Date()); $$("#clock, #clock2").forEach(el => el.textContent = t); };
  tick(); setInterval(tick, 15000);
}

/* ---- 5. Theme knob ---- */
function knob() {
  const btn = $("#knob"), label = $("#roast");
  const sync = () => { label.textContent = document.documentElement.dataset.theme === "light" ? "Lager" : "Stout"; };
  sync();
  btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    store.set("brew-theme", next);
    btn.classList.remove("steam"); void btn.offsetWidth; btn.classList.add("steam");
    sync();
  });
}

/* ---- 5b. Light cord: verlet rope + Edison bulb (theme switch) ----
   The cord hangs from above the viewport. Brush past it and it sways,
   grab and pull it past the switch's travel and it clicks the theme,
   let go and the spring snaps it back while gravity settles the swing. */
function toggleTheme() { $("#knob").click(); }
function rope() {
  const cv = $("#ropeCv"), hit = $("#bulbHit"), spot = $("#cordSpot");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  const N = 20, G = 3800, STEP = 1 / 120, ITER = 14;
  const CW = 440, CH = 480;
  let dpr = 1, ax = CW / 2, L = 118, ext = 0, extV = 0, armed = true;
  let pts = [], grabbing = false, ptr = null, lastPtr = null, downAt = 0, moved = 0;
  let acc = 0, last = performance.now(), lit = 0;
  const isLight = () => document.documentElement.dataset.theme === "light";

  function place() {
    dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = CW * dpr; cv.height = CH * dpr;
    cv.style.width = CW + "px"; cv.style.height = CH + "px";
    const r = spot.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    cv.style.left = (cx - CW / 2) + "px";
    ax = CW / 2;
    L = innerWidth < 700 ? 34 : 118;
  }
  function init() {
    place();
    pts = Array.from({ length: N + 1 }, (_, i) => { const y = -24 + (L + 24) * i / N; return { x: ax, y, px: ax, py: y }; });
  }
  const seg = () => (L + 24 + ext) / N;

  function physics(dt) {
    // spring that pulls the extension back when not held
    if (!grabbing) { extV += (-ext * 260 - extV * 14) * dt; ext = Math.max(-6, ext + extV * dt); }
    for (let i = 1; i <= N; i++) {
      const p = pts[i], vx = (p.x - p.px) * .992, vy = (p.y - p.py) * .992;
      p.px = p.x; p.py = p.y;
      p.x += vx; p.y += vy + G * dt * dt * (i === N ? 1.6 : 1);
    }
    // pointer brushing the rope: push nearby links along the pointer's motion
    if (ptr && lastPtr && !grabbing) {
      const mvx = ptr.x - lastPtr.x, mvy = ptr.y - lastPtr.y;
      for (let i = 2; i <= N; i++) {
        const p = pts[i], d = Math.hypot(p.x - ptr.x, p.y - ptr.y);
        if (d < 26) { const f = (1 - d / 26) * .55; p.x += mvx * f; p.y += mvy * f * .4; }
      }
    }
    if (grabbing && ptr) {
      const end = pts[N];
      end.x += (ptr.x - end.x) * .5; end.y += (ptr.y - end.y) * .5;
      const reach = Math.hypot(ptr.x - ax, ptr.y + 24);
      ext = Math.max(0, Math.min(60, reach - (L + 24)));
      if (ext > 40 && armed) { armed = false; click(); }
    }
    if (ext < 8) armed = true;
    const s = seg();
    for (let k = 0; k < ITER; k++) {
      pts[0].x = ax; pts[0].y = -24;
      for (let i = 0; i < N; i++) {
        const a = pts[i], b = pts[i + 1];
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .001, diff = (d - s) / d;
        if (i === 0) { b.x -= dx * diff; b.y -= dy * diff; }
        else { a.x += dx * diff * .5; a.y += dy * diff * .5; b.x -= dx * diff * .5; b.y -= dy * diff * .5; }
      }
    }
  }

  function click() {
    Sfx.play("click"); window.__lastCallTap?.();
    toggleTheme();
    hit.setAttribute("aria-checked", String(isLight()));
    // give the bulb a little kick so the switch feels mechanical
    const e = pts[N]; e.px = e.x - 4 + Math.random() * 8;
  }

  function drawRope() {
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    const path = () => { ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < N; i++) { const mx = (pts[i].x + pts[i + 1].x) / 2, my = (pts[i].y + pts[i + 1].y) / 2; ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my); }
      ctx.lineTo(pts[N].x, pts[N].y); };
    // soft shadow on the wall
    ctx.save(); ctx.translate(5, 8); ctx.filter = "blur(3px)"; ctx.strokeStyle = "rgba(0,0,0,.35)"; ctx.lineWidth = 4; path(); ctx.stroke(); ctx.restore();
    // braided cord: base, twist, highlight
    ctx.strokeStyle = "#a8936f"; ctx.lineWidth = 4.2; path(); ctx.stroke();
    ctx.setLineDash([2.6, 2.6]); ctx.strokeStyle = "#e9dcbf"; ctx.lineWidth = 3.2; path(); ctx.stroke();
    ctx.lineDashOffset = 2.6; ctx.strokeStyle = "#7d6a4c"; ctx.lineWidth = 1.2; path(); ctx.stroke();
    ctx.setLineDash([]); ctx.lineDashOffset = 0;
    ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = .8; ctx.save(); ctx.translate(-1, 0); path(); ctx.stroke(); ctx.restore();
  }

  function drawBulb(x, y, ang) {
    const on = lit;
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    // glow halo
    if (on > .01) {
      const g = ctx.createRadialGradient(0, 38, 4, 0, 38, 120);
      g.addColorStop(0, `rgba(255,190,90,${.55 * on})`); g.addColorStop(.4, `rgba(255,170,60,${.18 * on})`); g.addColorStop(1, "rgba(255,160,60,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 38, 120, 0, Math.PI * 2); ctx.fill();
    }
    // knot + brass socket
    ctx.fillStyle = "#6e5b3f"; ctx.beginPath(); ctx.ellipse(0, 0, 3.4, 3, 0, 0, Math.PI * 2); ctx.fill();
    const br = ctx.createLinearGradient(-8, 0, 8, 0);
    br.addColorStop(0, "#5a3f17"); br.addColorStop(.3, "#e8c26e"); br.addColorStop(.55, "#fff1c4"); br.addColorStop(.8, "#a4762c"); br.addColorStop(1, "#4b3311");
    ctx.fillStyle = br; roundRect(-7.5, 2, 15, 18, 3); ctx.fill();
    ctx.strokeStyle = "rgba(60,40,10,.55)"; ctx.lineWidth = 1;
    for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(-7.5, 6 + k * 3.6); ctx.lineTo(7.5, 7.4 + k * 3.6); ctx.stroke(); }
    // glass envelope (Edison teardrop)
    ctx.beginPath();
    ctx.moveTo(-6.5, 20);
    ctx.bezierCurveTo(-7, 26, -17, 32, -17, 46);
    ctx.bezierCurveTo(-17, 60, -8, 67, 0, 67);
    ctx.bezierCurveTo(8, 67, 17, 60, 17, 46);
    ctx.bezierCurveTo(17, 32, 7, 26, 6.5, 20);
    ctx.closePath();
    const gl = ctx.createRadialGradient(-5, 40, 2, 0, 46, 24);
    gl.addColorStop(0, on > .01 ? `rgba(255,236,190,${.35 + .6 * on})` : "rgba(255,255,255,.16)");
    gl.addColorStop(.6, on > .01 ? `rgba(255,186,90,${.15 + .45 * on})` : "rgba(255,240,215,.08)");
    gl.addColorStop(1, on > .01 ? `rgba(200,110,30,${.2 + .3 * on})` : "rgba(255,240,215,.22)");
    ctx.fillStyle = gl; ctx.fill();
    ctx.strokeStyle = "rgba(255,248,230,.55)"; ctx.lineWidth = 1; ctx.stroke();
    // filament: support wires + glowing zigzag loop
    ctx.strokeStyle = "rgba(120,100,80,.8)"; ctx.lineWidth = .8;
    ctx.beginPath(); ctx.moveTo(-2.5, 22); ctx.lineTo(-5, 44); ctx.moveTo(2.5, 22); ctx.lineTo(5, 44); ctx.moveTo(0, 22); ctx.lineTo(0, 52); ctx.stroke();
    ctx.strokeStyle = on > .01 ? `rgba(255,${200 + 40 * on},${120 + 100 * on},1)` : "#7a5a3c";
    ctx.lineWidth = on > .01 ? 1.4 : 1;
    if (on > .01) { ctx.shadowColor = "rgba(255,170,60,.95)"; ctx.shadowBlur = 10 * on; }
    ctx.beginPath(); ctx.moveTo(-5, 44);
    for (let k = 0; k <= 8; k++) ctx.lineTo(-5 + k * 1.25, 44 + (k % 2 ? 4 : 0) + Math.sin(k) * .6);
    ctx.lineTo(0, 52); ctx.stroke(); ctx.shadowBlur = 0;
    // specular highlight
    ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 2; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-11, 38); ctx.quadraticCurveTo(-13, 48, -8, 57); ctx.stroke();
    ctx.restore();
  }
  function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  function frame(now) {
    let dt = Math.min(.05, (now - last) / 1000); last = now; acc += dt;
    while (acc >= STEP) { physics(STEP); acc -= STEP; }
    lastPtr = ptr ? { ...ptr } : null;
    lit += ((isLight() ? 1 : 0) - lit) * .08;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, CW, CH);
    drawRope();
    const a = pts[N - 1], b = pts[N];
    const ang = Math.atan2(b.y - a.y, b.x - a.x) - Math.PI / 2;
    drawBulb(b.x, b.y, ang);
    // keep the invisible hit target on the bulb
    const r = cv.getBoundingClientRect();
    hit.style.transform = `translate(${r.left + b.x - 26}px, ${b.y + 14}px)`;
    requestAnimationFrame(frame);
  }

  const local = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  addEventListener("pointermove", e => { ptr = local(e); if (grabbing) moved++; }, { passive: true });
  hit.addEventListener("pointerdown", e => { grabbing = true; moved = 0; downAt = performance.now(); ptr = local(e); hit.setPointerCapture(e.pointerId); document.body.classList.add("tugging"); });
  const release = () => {
    if (!grabbing) return;
    grabbing = false; document.body.classList.remove("tugging");
    // a quick click without dragging = a short tug
    if (moved < 3 && performance.now() - downAt < 350) tug();
  };
  hit.addEventListener("pointerup", release); hit.addEventListener("pointercancel", release);
  hit.addEventListener("click", e => e.preventDefault());
  hit.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tug(); } });
  function tug() {
    extV = 0; ext = 48; pts[N].y += 40; pts[N].py = pts[N].y - 6;
    if (armed) { armed = false; click(); }
  }
  hit.setAttribute("aria-checked", String(isLight()));
  addEventListener("resize", place);
  init();
  if (reduce) { physics(STEP); }
  requestAnimationFrame(frame);
}

/* ---- 6. Smooth scroll ---- */
let lenis = null;
function smooth() {
  if (reduce || !window.Lenis) return;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}
const goTo = (target) => lenis ? lenis.scrollTo(target, { offset: -90 }) : (typeof target === "number" ? window.scrollTo({ top: target, behavior: "smooth" }) : target.scrollIntoView({ behavior: "smooth" }));

/* ---- 7. Loader (first visit per session only) ---- */
function loader() {
  const el = $("#loader");
  return new Promise(res => {
    const fromPour = store.sget("brew-pour");
    if (store.sget("brew-seen") || reduce || fromPour) { el.remove(); return res(); }
    store.sset("brew-seen", "1");
    const pct = $(".pct", el); let p = 0;
    const step = () => {
      p = Math.min(100, p + Math.random() * 9 + 3);
      el.style.setProperty("--p", p); pct.textContent = Math.round(p) + "%";
      if (p < 100) setTimeout(step, 55);
      else setTimeout(() => { el.classList.add("done"); setTimeout(() => el.remove(), 1000); res(); }, 250);
    };
    step();
  });
}

/* ---- 8. Beer transitions ----
   Links: the screen fills with beer from the bottom (foam line first),
   then the next page drains it away. Glasses: dive() zooms into the glass. */
const BEER = "#e9a22a";
function beerLayer() {
  const el = $("#beerfill"), cv = $(".beerfill-cv", el), ctx = cv.getContext("2d");
  let raf = 0, bubbles = [], density = 0, running = false;
  const size = () => { const d = Math.min(2, devicePixelRatio || 1); cv.width = innerWidth * d; cv.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
  const tick = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const n = Math.round(density * 6);
    for (let i = 0; i < n; i++) bubbles.push({ x: Math.random() * innerWidth, y: innerHeight + 10, r: .6 + Math.random() * 2.6, v: 60 + Math.random() * 160, w: Math.random() * 6.28 });
    bubbles = bubbles.filter(b => b.y > -20);
    for (const b of bubbles) {
      b.v *= 1.012; b.y -= b.v / 60; b.w += .08; b.r = Math.min(5, b.r * 1.004);
      const x = b.x + Math.sin(b.w) * 1.4;
      ctx.beginPath(); ctx.arc(x, b.y, b.r, 0, 6.283);
      ctx.strokeStyle = "rgba(255,248,225,.55)"; ctx.lineWidth = .8; ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.beginPath(); ctx.arc(x - b.r * .35, b.y - b.r * .35, b.r * .3, 0, 6.283); ctx.fill();
    }
    if (running) raf = requestAnimationFrame(tick);
  };
  return {
    el,
    start(color, dens = 1) { el.style.setProperty("--beer", color || BEER); size(); density = dens; if (!running) { running = true; tick(); } },
    density(v) { density = v; },
    stop() { running = false; cancelAnimationFrame(raf); ctx.clearRect(0, 0, innerWidth, innerHeight); bubbles = []; },
  };
}
let beer;
function pour() {
  beer = beerLayer();
  const el = beer.el;
  // arriving: drain the glass
  const came = store.sget("brew-pour");
  if (came && JSON.parse(came).from === "iris") {
    sessionStorage.removeItem("brew-pour");
    IRIS = IRIS || irisCtl();
    IRIS.set(innerWidth / 2, innerHeight / 2, 0);
    document.documentElement.classList.remove("pouring");
    setTimeout(() => IRIS.run(0, IRIS.cover(), 950, easeBack, () => [innerWidth / 2, innerHeight / 2], () => IRIS.off()), 120);
  } else if (came) {
    sessionStorage.removeItem("brew-pour");
    const { color, from } = JSON.parse(came);
    el.style.setProperty("--beer", color || BEER);
    el.classList.add("full"); beer.start(color, from === "dive" ? 1.4 : .8);
    document.documentElement.classList.remove("pouring");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.classList.add("drain");
      setTimeout(() => beer.density(.2), 300);
      setTimeout(() => { el.className = "beerfill"; beer.stop(); }, 1300);
    }));
  }
  document.addEventListener("click", e => {
    const a = e.target.closest("a[data-pour]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    const url = new URL(a.href, location.href);
    if (url.pathname === location.pathname && url.hash) { e.preventDefault(); closeNav(); const t = $(url.hash); if (t) goTo(t); return; }
    if (url.origin !== location.origin || reduce) return;
    e.preventDefault(); closeNav();
    sessionStorage.removeItem("brew-dive");
    el.className = "beerfill"; beer.start(BEER, .9);
    requestAnimationFrame(() => el.classList.add("fill"));
    store.sset("brew-pour", JSON.stringify({ color: BEER, from: "link" }));
    setTimeout(() => { location.href = a.href; }, 820);
  });
  window.addEventListener("pageshow", ev => { if (ev.persisted) { el.className = "beerfill"; beer.stop(); } });
}

/* ---- 8b. The brewhouse ----
   Four vessels, one per step of brewing (and of a project), drawn live on canvas:
   01 Mash tun → 02 Copper kettle → 03 Conical fermenter → 04 Bottling line.
   Hover brings a vessel to life; click dives inside it. */
const GD = { W: 300, H: 600, cx: 150, pipeY: 440, floor: 556 };
const STAGES = {
  mash:    { top: "#9a6430", bot: "#4a2c12", glow: "#f2c27a", foam: "#efe0c2", shade: "#cbb085", focus: [150, 252] },
  boil:    { top: "#c8741f", bot: "#5e2a0b", glow: "#ffb35c", foam: "#ffffff", shade: "#dcdcdc", focus: [150, 372] },
  ferment: { top: "#e2a23a", bot: "#8a4c0e", glow: "#ffd479", foam: "#f8eed8", shade: "#ddcba3", focus: [150, 262] },
  bottle:  { top: "#a85a12", bot: "#3d1c05", glow: "#ffb860", foam: "#fff6e3", shade: "#e3cfa6", focus: [110, 418] },
};
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }

/* ---- cartoon drawing kit: one ink line, flat fills, one shade + one highlight per part ---- */
const INK = "#2b1a12";
const TOON = {
  copper: ["#e58c4c", "#b9622c", "#ffc58f"],
  steel:  ["#cdd5dc", "#9aa6b1", "#f6f9fb"],
  brass:  ["#f2c44c", "#c8922a", "#fff1b3"],
  wood:   ["#c07f44", "#8d5629", "#e2a96e"],
  brick:  ["#cf5a3c", "#a2402a", "#e9805f"],
  dark:   ["#3a3f45", "#262a2e", "#555c63"],
  red:    ["#e2463a", "#b02a20", "#ff8a7a"],
  glass:  ["#e8f2f6", "#c9dbe2", "#ffffff"],
};
function rrPath(x, y, w, h, r) {
  const p = new Path2D(); r = Math.min(r, w / 2, h / 2);
  p.moveTo(x + r, y); p.arcTo(x + w, y, x + w, y + h, r); p.arcTo(x + w, y + h, x, y + h, r);
  p.arcTo(x, y + h, x, y, r); p.arcTo(x, y, x + w, y, r); p.closePath(); return p;
}
function ellPath(x, y, rx, ry) { const p = new Path2D(); p.ellipse(x, y, rx, ry, 0, 0, 6.283); return p; }
/* fill a part cartoon-style: base, a shade band on the right, a highlight stripe on the left, ink outline */
function cel(ctx, path, mat, box, o = {}) {
  const [base, shade, light] = Array.isArray(mat) ? mat : TOON[mat];
  ctx.fillStyle = base; ctx.fill(path);
  ctx.save(); ctx.clip(path);
  if (o.shade !== false) { ctx.fillStyle = shade; ctx.fillRect(box.x + box.w * (o.s ?? .7), box.y - 4, box.w, box.h + 8); }
  if (o.light !== false) { ctx.fillStyle = light; ctx.fillRect(box.x + box.w * (o.l ?? .13), box.y - 4, Math.max(2, box.w * (o.lw ?? .07)), box.h + 8); }
  if (o.bottom) { ctx.fillStyle = shade; ctx.fillRect(box.x - 4, box.y + box.h - o.bottom, box.w + 8, o.bottom + 4); }
  ctx.restore();
  if (o.ink !== false) { ctx.lineWidth = o.lw2 || 3; ctx.strokeStyle = INK; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.stroke(path); }
}
function inkLine(ctx, pts, w = 2.2, col = INK) {
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
}
function dot(ctx, x, y, r, fill, ink = true, w = 1.6) {
  ctx.fillStyle = fill; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  if (ink) { ctx.strokeStyle = INK; ctx.lineWidth = w; ctx.stroke(); }
}
function toonRivets(ctx, y, x0, x1, n) { for (let i = 0; i < n; i++) dot(ctx, x0 + (x1 - x0) * (i + .5) / n, y, 2.2, TOON.steel[2], true, 1.2); }
function toonPlate(ctx, x, y, text) {
  ctx.font = "800 11px Onest, system-ui, sans-serif";
  if ("letterSpacing" in ctx) ctx.letterSpacing = "1.4px";
  const w = ctx.measureText(text).width + 24, h = 22;
  cel(ctx, rrPath(x - w / 2, y - h / 2, w, h, 5), "brass", { x: x - w / 2, y: y - h / 2, w, h }, { lw2: 2.4 });
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = INK; ctx.fillText(text, x, y + 1);
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
}
function toonGauge(ctx, x, y, r, v) {
  dot(ctx, x, y, r + 3, TOON.brass[0], true, 2.4);
  dot(ctx, x, y, r, "#fffaf0", true, 1.6);
  ctx.strokeStyle = "#e2463a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r * .7, Math.PI * 1.9, Math.PI * 2.2); ctx.stroke();
  const a = Math.PI * .75 + Math.min(1, Math.max(0, v)) * Math.PI * 1.5;
  inkLine(ctx, [[x, y], [x + Math.cos(a) * r * .78, y + Math.sin(a) * r * .78]], 2.2);
  dot(ctx, x, y, 2.2, INK, false);
}
function toonStub(ctx, x0, x1, y) {
  const x = Math.min(x0, x1), w = Math.abs(x1 - x0);
  cel(ctx, rrPath(x - 2, y - 7, w + 4, 14, 2), "copper", { x, y: y - 7, w, h: 14 }, { s: 2, light: false, ink: false });
  ctx.fillStyle = TOON.copper[1]; ctx.fillRect(x - 2, y + 3, w + 4, 4);
  ctx.fillStyle = TOON.copper[2]; ctx.fillRect(x - 2, y - 5, w + 4, 2.5);
  inkLine(ctx, [[x - 2, y - 7], [x + w + 2, y - 7]], 2.4); inkLine(ctx, [[x - 2, y + 7], [x + w + 2, y + 7]], 2.4);
  cel(ctx, rrPath(x0 - 4, y - 11, 8, 22, 2), "brass", { x: x0 - 4, y: y - 11, w: 8, h: 22 }, { lw2: 2.2 });
}
function toonShadow(ctx, cx, w) { ctx.fillStyle = "rgba(20,10,5,.16)"; ctx.beginPath(); ctx.ellipse(cx, GD.floor + 2, w, 9, 0, 0, 6.283); ctx.fill(); }
/* cartoon steam: round puffs with a soft ink line */
function toonPuffs() {
  let list = [];
  return {
    add(x, y, vx, vy, r, life = 2.2) { list.push({ x, y, vx, vy, r, life, t: 0 }); },
    step(dt) { list = list.filter(p => (p.t += dt) < p.life); for (const p of list) { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .99; p.r += dt * 7; } },
    draw(ctx) {
      for (const p of list) {
        const f = p.t / p.life, a = Math.min(1, f * 6) * (1 - f * f);
        ctx.globalAlpha = a;
        ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "rgba(43,26,18,.55)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#e9eef2"; ctx.beginPath(); ctx.arc(p.x + p.r * .25, p.y + p.r * .25, p.r * .55, 0, 6.283); ctx.fill();
        ctx.globalAlpha = 1;
      }
    },
  };
}

function makeVessel(cup, idx) {
  const kind = JSON.parse(cup.dataset.glass).t;
  const C = STAGES[kind];
  const box = $(".glass", cup), cv = $("canvas.gl", box), ctx = cv.getContext("2d");
  const R = rng(idx * 997 + 3);
  let dpr = 1, k = 1, p = 0, target = 0, surge = 0, t = 0;
  const steam = toonPuffs();
  const { cx } = GD;
  const size = () => { dpr = Math.min(2, devicePixelRatio || 1); const w = box.clientWidth; k = w / GD.W; cv.width = Math.round(w * dpr); cv.height = Math.round(w * GD.H / GD.W * dpr); };
  size(); addEventListener("resize", size);
  const act = () => Math.min(1.6, p + surge);
  // squash & stretch around the base, so busy vessels wobble like cartoons
  const squash = (amt) => { ctx.translate(cx, GD.floor); ctx.scale(1 + amt, 1 - amt); ctx.translate(-cx, -GD.floor); };

  /* ------------------------------------------------ 01 MASH TUN */
  const specks = Array.from({ length: 46 }, () => { const a = R() * 6.283, d = .2 + Math.sqrt(R()) * .75; return [a, d, R()]; });
  let grains = [], paddleA = 0;
  function mash(dt) {
    const A = act();
    toonShadow(ctx, cx, 112);
    toonStub(ctx, 232, 300, GD.pipeY);
    ctx.save(); squash(Math.sin(t * 6) * .006 * A);
    [[90], [210]].forEach(([x]) => cel(ctx, rrPath(x - 7, 488, 14, 66, 4), "steel", { x: x - 7, y: 488, w: 14, h: 66 }, { lw2: 2.6 }));
    // hopper + chute
    ctx.save(); ctx.translate(100, 150); ctx.rotate(-.48);
    cel(ctx, rrPath(-10, -4, 20, 100, 5), "copper", { x: -10, y: -4, w: 20, h: 100 }, { lw2: 2.6 }); ctx.restore();
    const hop = new Path2D(); hop.moveTo(30, 66); hop.lineTo(164, 66); hop.lineTo(116, 152); hop.lineTo(78, 152); hop.closePath();
    cel(ctx, hop, "copper", { x: 30, y: 66, w: 134, h: 86 });
    const pile = new Path2D(); pile.moveTo(34, 66);
    for (let x = 34; x <= 160; x += 14) pile.quadraticCurveTo(x + 7, 50 - Math.sin(x * .07) * 6, x + 14, 64);
    pile.closePath();
    cel(ctx, pile, ["#e8b96a", "#c48f45", "#fff0c4"], { x: 34, y: 46, w: 126, h: 20 }, { lw2: 2.4 });
    cel(ctx, rrPath(26, 62, 142, 10, 4), "copper", { x: 26, y: 62, w: 142, h: 10 }, { lw2: 2.4, light: false });
    // tun
    const top = 248, bot = 496, x0 = 62, x1 = 238;
    cel(ctx, rrPath(x0, top, x1 - x0, bot - top, 22), "steel", { x: x0, y: top, w: x1 - x0, h: bot - top });
    [302, 448].forEach(y => { cel(ctx, rrPath(x0 - 4, y - 8, x1 - x0 + 8, 16, 5), "steel", { x: x0 - 4, y: y - 8, w: x1 - x0 + 8, h: 16 }, { lw2: 2.4 }); toonRivets(ctx, y, x0, x1, 9); });
    toonGauge(ctx, 114, 376, 17, .3 + .5 * A + Math.sin(t * 3) * .03 * A);
    toonPlate(ctx, 184, 376, "01 · MASH");
    // mash surface
    cel(ctx, ellPath(cx, top, 88, 18), "steel", { x: x0, y: top - 18, w: 176, h: 36 }, { shade: false, light: false });
    const surf = ellPath(cx, top + 1.5, 78, 13);
    ctx.fillStyle = "#9c6532"; ctx.fill(surf);
    ctx.save(); ctx.clip(surf);
    ctx.fillStyle = "#7a4b22"; ctx.beginPath(); ctx.ellipse(cx + 18, top + 6, 70, 11, 0, 0, 6.283); ctx.fill();
    const sw = t * (.2 + A * 1.3);
    for (const [a, d, l] of specks) { const aa = a + sw * (1.1 - d); dot(ctx, cx + Math.cos(aa) * d * 74, top + 1.5 + Math.sin(aa) * d * 11, 1.8 + l * 1.4, l > .5 ? "#f0c47a" : "#c9934e", false); }
    ctx.fillStyle = "rgba(255,240,210,.7)"; ctx.beginPath(); ctx.ellipse(cx - 32, top - 3, 20, 2.6, 0, 0, 6.283); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.stroke(surf);
    // grain falling in
    if (A > .2) for (let i = 0; i < Math.round(A * 3); i++) if (R() < .7) grains.push({ x: 136 + R() * 6, y: 236, vx: 6 + R() * 10, vy: 20 + R() * 20, r: R() * 6 });
    grains = grains.filter(g => g.y < top + 2);
    for (const g of grains) { g.vy += 300 * dt; g.x += g.vx * dt; g.y += g.vy * dt; g.r += dt * 9; ctx.save(); ctx.translate(g.x, g.y); ctx.rotate(g.r); cel(ctx, ellPath(0, 0, 3, 1.8), ["#f0c47a", "#c9934e", "#fff"], { x: -3, y: -2, w: 6, h: 4 }, { lw2: 1.2, light: false }); ctx.restore(); }
    // paddle
    paddleA += ((Math.sin(t * (1 + A * 3)) * (.06 + A * .25)) - paddleA) * Math.min(1, dt * 6);
    ctx.save(); ctx.translate(196, top); ctx.rotate(.5 + paddleA);
    cel(ctx, rrPath(-4.5, -152, 9, 160, 4), "wood", { x: -4.5, y: -152, w: 9, h: 160 }, { lw2: 2.4 });
    cel(ctx, rrPath(-11, -4, 22, 24, 6), "wood", { x: -11, y: -4, w: 22, h: 24 }, { lw2: 2.4 });
    ctx.restore();
    inkLine(ctx, [[x0 + 4, top + 2], [x1 - 4, top + 2]], 0);
    ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(cx, top, 88, 18, 0, .02, Math.PI - .02); ctx.stroke();
    ctx.restore();
    if (R() < dt * (1 + A * 7)) steam.add(cx - 55 + R() * 110, top - 6, (R() - .5) * 8, -16 - R() * 14 - A * 16, 6 + R() * 5, 2.2);
  }

  /* ------------------------------------------------ 02 COPPER KETTLE */
  let boilB = [], flick = 0, chug = 0;
  function boil(dt) {
    const A = act();
    toonShadow(ctx, cx, 118);
    toonStub(ctx, 60, 0, GD.pipeY); toonStub(ctx, 240, 300, GD.pipeY);
    ctx.save(); squash(Math.sin(t * 14) * .012 * A + (A > .6 ? (R() - .5) * .004 : 0));
    // brick firebox
    const fb = rrPath(66, 496, 168, 60, 6);
    cel(ctx, fb, "brick", { x: 66, y: 496, w: 168, h: 60 }, { light: false });
    ctx.save(); ctx.clip(fb); ctx.strokeStyle = "rgba(43,26,18,.55)"; ctx.lineWidth = 1.6;
    for (let r = 1; r < 4; r++) inkLine(ctx, [[66, 496 + r * 15], [234, 496 + r * 15]], 1.4, "rgba(43,26,18,.55)");
    for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) { const x = 66 + c * 28 + (r % 2 ? 14 : 0); inkLine(ctx, [[x, 496 + r * 15], [x, 511 + r * 15]], 1.4, "rgba(43,26,18,.55)"); }
    ctx.restore(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(fb);
    const win = new Path2D(); win.moveTo(118, 556); win.lineTo(118, 530); win.arc(150, 530, 32, Math.PI, 0); win.lineTo(182, 556); win.closePath();
    ctx.fillStyle = "#3a1408"; ctx.fill(win);
    flick += dt;
    ctx.save(); ctx.clip(win);
    const fh = 20 + A * 24;
    for (let i = 0; i < 5; i++) {
      const x = 126 + i * 12, h = fh * (.6 + .4 * Math.abs(Math.sin(flick * (7 + i) + i * 1.7)));
      const fl = new Path2D(); fl.moveTo(x - 9, 557); fl.quadraticCurveTo(x - 7, 557 - h * .55, x + Math.sin(flick * 9 + i) * 2.5, 557 - h); fl.quadraticCurveTo(x + 7, 557 - h * .55, x + 9, 557); fl.closePath();
      ctx.fillStyle = "#ff8a2a"; ctx.fill(fl); ctx.strokeStyle = INK; ctx.lineWidth = 1.8; ctx.stroke(fl);
      const fi = new Path2D(); fi.moveTo(x - 4, 557); fi.quadraticCurveTo(x - 3, 557 - h * .35, x, 557 - h * .6); fi.quadraticCurveTo(x + 3, 557 - h * .35, x + 4, 557); fi.closePath();
      ctx.fillStyle = "#ffe066"; ctx.fill(fi);
    }
    ctx.restore(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(win);
    // body + dome
    const top = 272, bot = 498, x0 = 58, x1 = 242;
    const body = new Path2D();
    body.moveTo(x0, bot - 10); body.lineTo(x0, top);
    body.bezierCurveTo(x0, 206, 108, 196, 136, 152); body.lineTo(164, 152); body.bezierCurveTo(192, 196, x1, 206, x1, top);
    body.lineTo(x1, bot - 10); body.quadraticCurveTo(x1, bot, x1 - 10, bot); body.lineTo(x0 + 10, bot); body.quadraticCurveTo(x0, bot, x0, bot - 10); body.closePath();
    cel(ctx, body, "copper", { x: x0, y: 150, w: x1 - x0, h: bot - 150 }, { lw2: 3.2 });
    ctx.save(); ctx.clip(body); ctx.fillStyle = `rgba(255,140,40,${.1 + A * .18})`; ctx.fillRect(x0, bot - 60, 184, 60); ctx.restore();
    ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(x0, top); ctx.quadraticCurveTo(cx, top + 14, x1, top); ctx.stroke();
    toonRivets(ctx, top + 12, x0 + 6, x1 - 6, 10); toonRivets(ctx, bot - 10, x0 + 6, x1 - 6, 10);
    // chimney
    cel(ctx, rrPath(138, 40, 24, 116, 4), "copper", { x: 138, y: 40, w: 24, h: 116 }, { lw2: 2.6 });
    cel(ctx, rrPath(130, 92, 40, 10, 4), "copper", { x: 130, y: 92, w: 40, h: 10 }, { lw2: 2.4, light: false });
    cel(ctx, rrPath(132, 32, 36, 10, 4), "copper", { x: 132, y: 32, w: 36, h: 10 }, { lw2: 2.4, light: false });
    // porthole
    const px = 150, py = 372, pr = 30;
    dot(ctx, px, py, pr + 9, TOON.brass[0], true, 3);
    for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283 + .3; dot(ctx, px + Math.cos(a) * (pr + 4.5), py + Math.sin(a) * (pr + 4.5), 1.8, TOON.brass[2], true, 1); }
    ctx.save(); ctx.beginPath(); ctx.arc(px, py, pr, 0, 6.283); ctx.clip();
    ctx.fillStyle = "#e48a2a"; ctx.fillRect(px - pr, py - pr, pr * 2, pr * 2);
    ctx.fillStyle = "#b9601c"; ctx.fillRect(px - pr, py + 6, pr * 2, pr);
    const lvl = py - 8 + Math.sin(t * 7) * (1 + A * 2.5);
    ctx.fillStyle = "#fff3dc"; ctx.beginPath(); ctx.moveTo(px - pr, py - pr);
    for (let x = -pr; x <= pr; x += 3) ctx.lineTo(px + x, lvl + Math.sin(x * .3 + t * (4 + A * 10)) * (1.4 + A * 2.2));
    ctx.lineTo(px + pr, py - pr); ctx.fill();
    if (R() < dt * (12 + A * 60)) boilB.push({ x: px + (R() - .5) * pr * 1.6, y: py + pr, r: 1.6 + R() * (2 + A * 2.5), v: 30 + R() * 40 });
    boilB = boilB.filter(b => b.y > lvl);
    for (const b of boilB) { b.y -= b.v * dt; b.v += 90 * dt; dot(ctx, b.x, b.y, b.r, "#ffd69a", true, 1.2); }
    ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.beginPath(); ctx.ellipse(px - 12, py - 13, 8, 4, -.7, 0, 6.283); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(px, py, pr, 0, 6.283); ctx.stroke();
    toonGauge(ctx, 212, 304, 14, .2 + .7 * A + (A > .6 ? Math.sin(t * 20) * .04 : 0));
    toonPlate(ctx, cx, 452, "02 · BOIL");
    ctx.restore();
    chug += dt * (1 + A * 6);
    if (chug > 1) { chug = 0; steam.add(150 + (R() - .5) * 6, 28, (R() - .5) * 10, -26 - A * 36, 7 + A * 5, 1.8 + A * .6); }
  }

  /* ------------------------------------------------ 03 CONICAL FERMENTER */
  let lockB = 0, lockY = -1, sightB = [];
  function ferment(dt) {
    const A = act();
    toonShadow(ctx, cx, 100);
    toonStub(ctx, 104, 0, GD.pipeY); toonStub(ctx, 196, 300, GD.pipeY);
    ctx.save(); squash(Math.sin(t * 4) * .004 * A);
    // legs
    const leg = (xa, xb) => { const l = new Path2D(); l.moveTo(xa - 5, 380); l.lineTo(xa + 5, 380); l.lineTo(xb + 5, 552); l.lineTo(xb - 5, 552); l.closePath(); cel(ctx, l, "steel", { x: Math.min(xa, xb) - 5, y: 380, w: Math.abs(xb - xa) + 10, h: 172 }, { lw2: 2.6 }); cel(ctx, rrPath(xb - 10, 548, 20, 8, 3), "dark", { x: xb - 10, y: 548, w: 20, h: 8 }, { lw2: 2.2, light: false }); };
    leg(100, 90); leg(200, 210);
    // cone + valve
    const cone = new Path2D(); cone.moveTo(78, 384); cone.lineTo(222, 384); cone.lineTo(160, 470); cone.lineTo(140, 470); cone.closePath();
    cel(ctx, cone, "steel", { x: 78, y: 384, w: 144, h: 86 });
    cel(ctx, rrPath(143, 468, 14, 24, 3), "steel", { x: 143, y: 468, w: 14, h: 24 }, { lw2: 2.4 });
    cel(ctx, rrPath(128, 476, 44, 8, 4), "red", { x: 128, y: 476, w: 44, h: 8 }, { lw2: 2.2 });
    // cylinder + dome
    const x0 = 78, x1 = 222, top = 140, bot = 386;
    const tank = new Path2D(); tank.moveTo(x0, bot); tank.lineTo(x0, top); tank.bezierCurveTo(x0, 108, x1, 108, x1, top); tank.lineTo(x1, bot); tank.closePath();
    cel(ctx, tank, "steel", { x: x0, y: 110, w: x1 - x0, h: bot - 110 }, { lw2: 3.2 });
    // cooling jacket bands with frost
    [[170, 198], [250, 278], [330, 358]].forEach(([a, b]) => {
      cel(ctx, rrPath(x0 - 4, a, x1 - x0 + 8, b - a, 6), ["#b7c2cc", "#8c98a3", "#e6edf2"], { x: x0 - 4, y: a, w: x1 - x0 + 8, h: b - a }, { lw2: 2.4 });
      ctx.fillStyle = `rgba(255,255,255,${.25 + A * .55})`;
      for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.ellipse(x0 + 12 + i * 20, a + 5, 7, 2.5, 0, 0, 6.283); ctx.fill(); }
    });
    toonRivets(ctx, top + 2, x0 + 8, x1 - 8, 8);
    // sight glass
    const sx = 200, s0 = 158, s1 = 372;
    cel(ctx, rrPath(sx - 7, s0, 14, s1 - s0, 7), "glass", { x: sx - 7, y: s0, w: 14, h: s1 - s0 }, { shade: false, lw2: 2.4 });
    ctx.save(); ctx.clip(rrPath(sx - 7, s0, 14, s1 - s0, 7));
    const lv = 190 + Math.sin(t * 2) * (.6 + A);
    ctx.fillStyle = "#f2a93a"; ctx.fillRect(sx - 8, lv, 16, s1 - lv);
    ctx.fillStyle = "#fff6e2"; ctx.fillRect(sx - 8, lv - 8 - A * 8, 16, 9 + A * 8);
    if (R() < dt * (6 + A * 30)) sightB.push({ x: sx + (R() - .5) * 6, y: s1, r: .9 + R() * 1.4, v: 22 + R() * 30 });
    sightB = sightB.filter(b => b.y > lv);
    for (const b of sightB) { b.y -= b.v * dt; dot(ctx, b.x, b.y, b.r, "#fff", true, .9); }
    ctx.restore(); ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.stroke(rrPath(sx - 7, s0, 14, s1 - s0, 7));
    toonPlate(ctx, 134, 224, "03 · FERMENT");
    toonGauge(ctx, 118, 300, 13, .3 + .45 * A + Math.sin(t * 1.7) * .03);
    // airlock
    cel(ctx, rrPath(144, 94, 12, 22, 3), "steel", { x: 144, y: 94, w: 12, h: 22 }, { lw2: 2.2 });
    cel(ctx, rrPath(139, 106, 22, 10, 3), "red", { x: 139, y: 106, w: 22, h: 10 }, { lw2: 2.2, light: false });
    const lx = 150, ly = 58;
    [[-10, 0], [10, 0]].forEach(([dx]) => {
      cel(ctx, ellPath(lx + dx, ly + 16, 10, 14), "glass", { x: lx + dx - 10, y: ly + 2, w: 20, h: 28 }, { shade: false, lw2: 2.2 });
      ctx.save(); ctx.clip(ellPath(lx + dx, ly + 16, 10, 14)); ctx.fillStyle = "#8fd0e8"; ctx.fillRect(lx + dx - 11, ly + 18 + (dx > 0 ? -2 : 1), 22, 14); ctx.restore();
      ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.stroke(ellPath(lx + dx, ly + 16, 10, 14));
    });
    inkLine(ctx, [[lx - 3, ly + 30], [lx - 3, ly + 38]], 2.2); inkLine(ctx, [[lx + 3, ly + 30], [lx + 3, ly + 38]], 2.2);
    lockB += dt * (.45 + A * 3);
    if (lockB > 1 && lockY < 0) { lockB = 0; lockY = 0; }
    if (lockY >= 0) {
      lockY += dt * 2.4;
      dot(ctx, lx + 10 + Math.sin(lockY * 9) * 1.5, ly + 28 - lockY * 26, 3.4, "#fff", true, 1.3);
      if (lockY > 1) { lockY = -1; steam.add(lx + 10, ly - 2, (R() - .5) * 6, -18, 3.5, 1.2); }
    }
    ctx.restore();
  }

  /* ------------------------------------------------ 04 BOTTLING LINE */
  let bottles = [], belt = 0, fillHead = 0, capHead = 0;
  for (let x = -10; x < 310; x += 58) bottles.push({ x, fill: x > 112 ? 1 : 0, cap: x > 206, n: 1 + Math.floor(R() * 9) });
  function bottleShape(x, y0) {
    const h = 110, top = y0 - h, b = new Path2D();
    b.moveTo(x - 15, y0 - 4); b.lineTo(x - 15, top + 52); b.quadraticCurveTo(x - 15, top + 34, x - 6.5, top + 25);
    b.lineTo(x - 6, top + 6); b.lineTo(x + 6, top + 6); b.lineTo(x + 6.5, top + 25); b.quadraticCurveTo(x + 15, top + 34, x + 15, top + 52);
    b.lineTo(x + 15, y0 - 4); b.quadraticCurveTo(x + 15, y0, x + 11, y0); b.lineTo(x - 11, y0); b.quadraticCurveTo(x - 15, y0, x - 15, y0 - 4); b.closePath();
    return { b, top, h };
  }
  function bottleDraw(bt, y0) {
    const { b, top, h } = bottleShape(bt.x, y0), x = bt.x;
    ctx.fillStyle = "#e6c79c"; ctx.fill(b);                                     // empty glass
    ctx.save(); ctx.clip(b);
    const lvl = y0 - bt.fill * (h - 16);
    if (bt.fill > 0) {
      ctx.fillStyle = "#b8621c"; ctx.fillRect(x - 16, lvl, 32, y0 - lvl);
      ctx.fillStyle = "#8a4210"; ctx.fillRect(x + 6, lvl, 10, y0 - lvl);
      if (!bt.cap) { ctx.fillStyle = "#fff6e2"; ctx.fillRect(x - 16, lvl - 4, 32, 5); }
    }
    ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fillRect(x - 11, top + 36, 3.5, h - 46);
    ctx.restore();
    ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.lineJoin = "round"; ctx.stroke(b);
    cel(ctx, rrPath(x - 13, top + 58, 26, 26, 3), ["#fbefd2", "#e9d6ac", "#fff"], { x: x - 13, y: top + 58, w: 26, h: 26 }, { lw2: 2 });
    ctx.fillStyle = "#e2463a"; ctx.fillRect(x - 12, top + 59, 24, 5);
    ctx.fillStyle = INK; ctx.font = "800 6.5px Onest, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    ctx.fillText("BREWD", x, top + 74); ctx.font = "700 5px Onest, sans-serif"; ctx.fillText("No." + bt.n, x, top + 81);
    if (bt.cap) cel(ctx, rrPath(x - 8, top + 1, 16, 7, 2), "brass", { x: x - 8, y: top + 1, w: 16, h: 7 }, { lw2: 2, light: false });
  }
  function bottle(dt) {
    const A = act();
    toonShadow(ctx, cx, 135);
    const beltY = 468;
    toonStub(ctx, 22, 0, GD.pipeY);
    cel(ctx, rrPath(14, 96, 16, GD.pipeY - 88, 4), "copper", { x: 14, y: 96, w: 16, h: GD.pipeY - 88 }, { lw2: 2.4 });
    cel(ctx, rrPath(14, 90, 62, 16, 4), "copper", { x: 14, y: 90, w: 62, h: 16 }, { lw2: 2.4, light: false });
    // legs + gantry
    [[34], [266]].forEach(([x]) => cel(ctx, rrPath(x - 6, beltY + 16, 12, 72, 4), "steel", { x: x - 6, y: beltY + 16, w: 12, h: 72 }, { lw2: 2.4 }));
    [[60], [252]].forEach(([x]) => cel(ctx, rrPath(x - 7, 170, 14, beltY - 170, 4), "steel", { x: x - 7, y: 170, w: 14, h: beltY - 170 }, { lw2: 2.6 }));
    cel(ctx, rrPath(46, 160, 220, 24, 6), "steel", { x: 46, y: 160, w: 220, h: 24 }, { lw2: 3 });
    toonRivets(ctx, 172, 52, 260, 12);
    // tank
    const tank = new Path2D(); tank.moveTo(68, 160); tank.lineTo(68, 96); tank.bezierCurveTo(68, 70, 152, 70, 152, 96); tank.lineTo(152, 160); tank.closePath();
    cel(ctx, tank, "steel", { x: 68, y: 74, w: 84, h: 86 }, { lw2: 3 });
    cel(ctx, rrPath(126, 100, 12, 46, 6), "glass", { x: 126, y: 100, w: 12, h: 46 }, { shade: false, lw2: 2.2 });
    ctx.save(); ctx.clip(rrPath(126, 100, 12, 46, 6)); const tl = 114 + Math.sin(t * 1.5) * 2; ctx.fillStyle = "#f2a93a"; ctx.fillRect(124, tl, 16, 50); ctx.fillStyle = "#fff6e2"; ctx.fillRect(124, tl - 3, 16, 4); ctx.restore();
    ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.stroke(rrPath(126, 100, 12, 46, 6));
    // filler + capper housings
    cel(ctx, rrPath(95, 184, 30, 26, 5), "steel", { x: 95, y: 184, w: 30, h: 26 }, { lw2: 2.6 });
    cel(ctx, rrPath(200, 66, 14, 94, 6), "glass", { x: 200, y: 66, w: 14, h: 94 }, { shade: false, lw2: 2.4 });
    for (let i = 0; i < 6; i++) cel(ctx, rrPath(201, 74 + i * 13, 12, 7, 2), "brass", { x: 201, y: 74 + i * 13, w: 12, h: 7 }, { lw2: 1.4, light: false });
    cel(ctx, rrPath(191, 184, 32, 30, 5), "steel", { x: 191, y: 184, w: 32, h: 30 }, { lw2: 2.6 });
    dot(ctx, 236, 196, 5, "#e2463a", true, 2); dot(ctx, 236, 210, 3.5, A > .5 ? "#7bd47f" : "#3d5a3e", true, 1.6);
    // belt
    const speed = 10 + A * 46; belt += speed * dt;
    cel(ctx, rrPath(-4, beltY, GD.W + 8, 16, 6), "dark", { x: 0, y: beltY, w: GD.W, h: 16 }, { light: false, shade: false, lw2: 2.8 });
    ctx.save(); ctx.clip(rrPath(-4, beltY, GD.W + 8, 16, 6)); ctx.fillStyle = "#6a727a"; for (let x = -(belt % 18); x < GD.W; x += 18) ctx.fillRect(x, beltY + 3, 8, 3); ctx.restore();
    cel(ctx, rrPath(-4, beltY + 14, GD.W + 8, 10, 4), "steel", { x: 0, y: beltY + 14, w: GD.W, h: 10 }, { lw2: 2.4, light: false });
    toonPlate(ctx, cx, 515, "04 · BOTTLE");
    // bottles
    let under = 0, capping = 0;
    for (const b of bottles) {
      b.x += speed * dt;
      if (Math.abs(b.x - 110) < 9 && b.fill < 1) { b.fill = Math.min(1, b.fill + dt * (1.2 + A * 4)); under = 1; }
      if (b.x > 119 && b.fill < 1) b.fill = Math.min(1, b.fill + dt * 3);
      if (Math.abs(b.x - 207) < 6 && !b.cap && b.fill >= 1) { capping = 1; if (b.x > 206) b.cap = true; }
    }
    bottles = bottles.filter(b => b.x < 330);
    if (bottles[0].x > 48) bottles.unshift({ x: bottles[0].x - 58, fill: 0, cap: false, n: 1 + Math.floor(R() * 9) });
    fillHead += ((under ? 1 : 0) - fillHead) * Math.min(1, dt * 10);
    capHead += ((capping ? 1 : 0) - capHead) * Math.min(1, dt * 14);
    const ny = 318 + fillHead * 30;
    cel(ctx, rrPath(105, 208, 10, ny - 204, 3), "steel", { x: 105, y: 208, w: 10, h: ny - 204 }, { lw2: 2.2 });
    cel(ctx, rrPath(101, ny, 18, 9, 3), "brass", { x: 101, y: ny, w: 18, h: 9 }, { lw2: 2.2, light: false });
    if (fillHead > .5) { ctx.fillStyle = "#f2a93a"; ctx.fillRect(108, ny + 9, 4, 14); }
    bottles.forEach(b => bottleDraw(b, beltY));
    const cy2 = 330 + capHead * 22;
    cel(ctx, rrPath(201, 212, 12, cy2 - 208, 3), "steel", { x: 201, y: 212, w: 12, h: cy2 - 208 }, { lw2: 2.2 });
    cel(ctx, rrPath(195, cy2, 24, 10, 4), "steel", { x: 195, y: cy2, w: 24, h: 10 }, { lw2: 2.4 });
  }

  const draws = { mash, boil, ferment, bottle };
  /* cartoon extras: hop on hover, sparkles, comic sound-words */
  const WORDS = { mash: ["Stir!", "Mmm, malt!", "Swoosh!"], boil: ["Pssshh!", "Blub blub!", "Toot!"], ferment: ["Glug!", "Blub!", "Fizz!"], bottle: ["Clink!", "Pop!", "Ka-chunk!"] };
  let hopT = 9, words = [], sparks = [], wordT = 0, was = 0;
  const top = { mash: 70, boil: 60, ferment: 80, bottle: 90 }[kind];
  function shout(txt, big) {
    Sfx.play(kind);
    words.push({ txt: txt || WORDS[kind][Math.floor(R() * WORDS[kind].length)], x: 150 + (R() - .3) * 90, y: top + 40 + R() * 60, t: 0, rot: (R() - .5) * .35, big: !!big });
  }
  function sparkle(n) { for (let i = 0; i < n; i++) sparks.push({ x: 30 + R() * 240, y: 120 + R() * 380, t: -R() * .3, s: 5 + R() * 7 }); }
  function star(x, y, s, a) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(a);
    const p = new Path2D(); p.moveTo(0, -s); p.quadraticCurveTo(s * .18, -s * .18, s, 0); p.quadraticCurveTo(s * .18, s * .18, 0, s); p.quadraticCurveTo(-s * .18, s * .18, -s, 0); p.quadraticCurveTo(-s * .18, -s * .18, 0, -s); p.closePath();
    ctx.fillStyle = "#ffe066"; ctx.fill(p); ctx.strokeStyle = INK; ctx.lineWidth = 1.8; ctx.stroke(p); ctx.restore();
  }
  function hop() {                                   // anticipation squash → jump with stretch → landing squash
    if (hopT > .6) return { y: 0, s: 0 };
    const h = hopT;
    if (h < .12) return { y: 0, s: .07 * (h / .12) };
    if (h < .44) { const u = (h - .12) / .32; return { y: -Math.sin(u * Math.PI) * 22, s: -.06 * Math.sin(u * Math.PI) }; }
    const u = (h - .44) / .16; return { y: 0, s: .05 * Math.sin(u * Math.PI) };
  }
  function step(dt) {
    t += dt;
    p += (target - p) * Math.min(1, dt * (target ? 2 : 1.2));
    if (target && !was) { hopT = 0; sparkle(6); shout(); wordT = 0; }
    was = target;
    hopT += dt;
    if (target) { wordT += dt; if (wordT > 1.7) { wordT = 0; shout(); } }
    ctx.setTransform(dpr * k, 0, 0, dpr * k, 0, 0);
    ctx.clearRect(0, 0, GD.W, GD.H);
    steam.step(dt);
    const hp = hop();
    ctx.save(); ctx.translate(0, hp.y); squash(hp.s);
    draws[kind](dt);
    ctx.restore();
    steam.draw(ctx);
    // sparkles
    sparks = sparks.filter(s => (s.t += dt) < .7);
    for (const s of sparks) if (s.t > 0) { const f = s.t / .7; star(s.x, s.y, s.s * Math.sin(f * Math.PI), f * 2); }
    // sound-words: pop in big, wobble, float up and fade
    words = words.filter(w => (w.t += dt) < 1.3);
    for (const w of words) {
      const f = w.t / 1.3, pop = w.t < .18 ? 1.35 * (w.t / .18) : 1 + .35 * Math.exp(-(w.t - .18) * 9) * Math.cos((w.t - .18) * 22);
      ctx.save(); ctx.globalAlpha = 1 - sstep(.7, 1, f);
      ctx.translate(w.x, w.y - f * 28); ctx.rotate(w.rot + Math.sin(w.t * 9) * .04); ctx.scale(pop, pop);
      ctx.font = `400 ${w.big ? 30 : 23}px Rye, "Arial Black", sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.lineJoin = "round"; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.strokeText(w.txt, 0, 0);
      ctx.fillStyle = w.big ? "#ffe066" : "#fff6e2"; ctx.fillText(w.txt, 0, 0);
      ctx.restore();
    }
  }
  return { hover(on) { target = on ? 1 : 0; }, surge(v) { surge = v; }, step, colors: C, focus: C.focus, kind,
    shout(txt) { shout(txt, true); sparkle(12); hopT = 0; } };
}

/* cartoon copper pipes between the vessels, with a glint running along them */
function pipes(cups) {
  const wrap = $(".shelf-wrap"); let cv = $(".pipes", wrap);
  if (!cv) { cv = document.createElement("canvas"); cv.className = "pipes"; wrap.prepend(cv); }
  const ctx = cv.getContext("2d");
  let segs = [], dpr = 1, glints = [0, .33, .66];
  const size = () => {
    dpr = Math.min(2, devicePixelRatio || 1);
    const wr = wrap.getBoundingClientRect();
    cv.width = wr.width * dpr; cv.height = wr.height * dpr;
    segs = [];
    for (let i = 0; i < cups.length - 1; i++) {
      const a = $(".glass", cups[i]).getBoundingClientRect(), b = $(".glass", cups[i + 1]).getBoundingClientRect();
      const k = a.width / GD.W;
      segs.push({ x0: a.right - wr.left - 1, x1: b.left - wr.left + 1, y: a.top - wr.top + GD.pipeY * k, r: 7 * k, k });
    }
  };
  size(); addEventListener("resize", size);
  return (dt, hot) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    segs.forEach((s, i) => {
      const w = s.x1 - s.x0;
      ctx.fillStyle = TOON.copper[0]; ctx.fillRect(s.x0, s.y - s.r, w, s.r * 2);
      ctx.fillStyle = TOON.copper[1]; ctx.fillRect(s.x0, s.y + s.r * .4, w, s.r * .6);
      ctx.fillStyle = TOON.copper[2]; ctx.fillRect(s.x0, s.y - s.r * .7, w, s.r * .35);
      glints[i] = (glints[i] + dt * (.22 + (hot === i ? 1.1 : 0))) % 1;
      const gx = s.x0 + w * glints[i];
      ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(gx - s.r * 1.4, s.y - s.r * .72, s.r * 2.8, s.r * .4, 2) : ctx.rect(gx - s.r * 1.4, s.y - s.r * .72, s.r * 2.8, s.r * .4); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 2.4 * s.k;
      ctx.beginPath(); ctx.moveTo(s.x0, s.y - s.r); ctx.lineTo(s.x1, s.y - s.r); ctx.moveTo(s.x0, s.y + s.r); ctx.lineTo(s.x1, s.y + s.r); ctx.stroke();
      for (let x = s.x0 + 28; x < s.x1 - 24; x += 64) {
        const p = rrPath(x, s.y - s.r * 1.4, s.r * 1.3, s.r * 2.8, 2 * s.k);
        ctx.fillStyle = TOON.brass[0]; ctx.fill(p); ctx.fillStyle = TOON.brass[1]; ctx.fillRect(x + s.r * .8, s.y - s.r * 1.4, s.r * .5, s.r * 2.8);
        ctx.lineWidth = 2 * s.k; ctx.stroke(p);
      }
    });
  };
}

function glasses() {
  const cups = $$(".cup[data-glass]"); if (!cups.length) return;
  const shelfEl = $(".shelf");
  const sims = cups.map((cup, i) => makeVessel(cup, i + 1));
  const pipeDraw = pipes(cups, sims);
  let raf = 0, last = performance.now(), hot = -1;
  const loop = now => {
    const dt = Math.min(.04, (now - last) / 1000); last = now;
    sims.forEach(s => s.step(dt)); pipeDraw(dt, hot);
    raf = requestAnimationFrame(loop);
  };
  new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); if (e.isIntersecting) { last = performance.now(); raf = requestAnimationFrame(loop); } }).observe(shelfEl);
  sims.forEach(s => s.step(0.016)); pipeDraw(0, -1);

  cups.forEach((cup, i) => {
    const on = () => { if (!document.body.classList.contains("diving")) { cup.classList.add("pouring"); sims[i].hover(true); hot = i; } };
    const off = () => { if (!document.body.classList.contains("diving")) { cup.classList.remove("pouring"); sims[i].hover(false); if (hot === i) hot = -1; } };
    cup.addEventListener("pointerenter", on); cup.addEventListener("pointerleave", off);
    cup.addEventListener("focus", on); cup.addEventListener("blur", off);
    cup.addEventListener("click", e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault(); dive(i, cups, sims, shelfEl);
    });
  });

  window.__openGlass = (i, fromAway) => {
    if (document.body.classList.contains("diving")) return;
    const r = shelfEl.getBoundingClientRect();
    const y = Math.max(0, r.top + scrollY - innerHeight * .3);
    if (fromAway) { lenis?.scrollTo(y, { immediate: true, force: true }); window.scrollTo(0, y); }
    else if (Math.abs(scrollY - y) > 6) { lenis ? lenis.scrollTo(y, { duration: .9, easing: x => 1 - Math.pow(1 - x, 3) }) : window.scrollTo({ top: y, behavior: "smooth" }); }
    const t0 = performance.now();
    const settle = () => {
      if (Math.abs(scrollY - y) > 20 && performance.now() - t0 < 1600) return requestAnimationFrame(settle);
      cups[i].dispatchEvent(new Event("pointerenter")); $("#bubble")?.classList.remove("on");
      setTimeout(() => dive(i, cups, sims, shelfEl), fromAway ? 900 : 1100);
    };
    requestAnimationFrame(settle);
  };
  const want = store.sget("brew-open");
  if (want != null) { sessionStorage.removeItem("brew-open"); setTimeout(() => window.__openGlass(+want, true), 350); }

  const nav = performance.getEntriesByType("navigation")[0];
  const back = store.sget("brew-return") || (nav && nav.type === "back_forward" ? store.sget("brew-dive") : null);
  if (back) { sessionStorage.removeItem("brew-return"); emerge(JSON.parse(back).i, cups, sims, shelfEl); }
  addEventListener("pageshow", ev => {
    if (!ev.persisted) return;
    const d = store.sget("brew-dive"); if (d) emerge(JSON.parse(d).i, cups, sims, shelfEl, true);
  });
}

/* cartoon iris: the classic closing circle */
const IRIS_INK = "#1a110b";
function irisCtl() {
  const el = $("#iris");
  const cover = () => Math.hypot(innerWidth, innerHeight) + 20;
  return {
    el, cover,
    set(x, y, r) { el.style.setProperty("--ix", x + "px"); el.style.setProperty("--iy", y + "px"); el.style.setProperty("--ir", Math.max(0, r) + "px"); el.classList.add("on"); },
    off() { el.classList.remove("on"); },
    // animate radius from a → b over ms, centre following fn(k) → [x, y]
    run(a, b, ms, ease, centre, done) {
      const t0 = performance.now();
      const tick = now => {
        const k = Math.min(1, (now - t0) / ms), e = ease(k), [x, y] = centre(k);
        this.set(x, y, a + (b - a) * e);
        if (k < 1) requestAnimationFrame(tick); else done && done();
      };
      requestAnimationFrame(tick);
    },
  };
}
let IRIS = null;

/* the camera move shared by dive (in) and emerge (out) */
function lens(cup, sim) {
  const sec = cup.closest(".section");
  const box = $(".glass", cup).getBoundingClientRect();
  const [fx, fy] = sim ? sim.focus : [150, 250];
  const cx = box.left + box.width * fx / GD.W;
  const cy = box.top + box.height * fy / GD.H;
  const sr = sec.getBoundingClientRect();
  sec.style.transformOrigin = `${cx - sr.left}px ${cy - sr.top}px`;
  const sEnd = 2.6;
  return {
    sec, cx, cy,
    at(e) {
      const sc = Math.exp(Math.log(sEnd) * e);
      sec.style.transform = `translate(${(innerWidth / 2 - cx) * e}px, ${(innerHeight / 2 - cy) * e}px) scale(${sc})`;
    },
    centre(e) { return [cx + (innerWidth / 2 - cx) * e, cy + (innerHeight / 2 - cy) * e]; },
    reset() { sec.style.transform = ""; sec.style.filter = ""; sec.classList.remove("zooming"); },
  };
}
const easeInOut = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const easeIn = x => x * x * x;
const easeOut = x => 1 - Math.pow(1 - x, 3);
const easeBack = x => { const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

/* Click a vessel → "Let's brew!", it hops, the rest bow out, the camera leans in and the iris closes on its opening. */
function dive(i, cups, sims, shelfEl) {
  const cup = cups[i];
  if (reduce) { location.href = cup.href; return; }
  if (document.body.classList.contains("diving")) return;
  document.body.classList.add("diving");
  $("#bubble")?.classList.remove("on"); $("#peek")?.classList.remove("in"); shelfEl.classList.remove("peeking");
  cup.classList.add("pouring", "chosen"); shelfEl.classList.add("focus");
  sims[i].hover(true); sims[i].surge(.9); sims[i].shout("Let's brew!"); setTimeout(() => Sfx.play("iris"), 600);
  lenis?.stop();
  store.sset("brew-dive", JSON.stringify({ i, color: IRIS_INK }));
  IRIS = IRIS || irisCtl();
  setTimeout(() => {
    const cam = lens(cup, sims[i]); cam.sec.classList.add("zooming");
    const D = 1150, t0 = performance.now(), R0 = IRIS.cover();
    const step = now => {
      const k = Math.min(1, (now - t0) / D), e = easeInOut(k);
      cam.at(e);
      const [x, y] = cam.centre(e);
      // iris starts closing a beat after the zoom, overshoots a hair, snaps shut
      const ik = sstep(.15, 1, k), r = k < 1 ? R0 * (1 - easeIn(ik)) + 34 * Math.sin(ik * Math.PI) * (1 - ik) : 0;
      IRIS.set(x, y, k > .97 ? 0 : r);
      if (k < 1) requestAnimationFrame(step);
      else {
        store.sset("brew-pour", JSON.stringify({ color: IRIS_INK, from: "iris" }));
        setTimeout(() => { location.href = cup.href; }, 140);
      }
    };
    requestAnimationFrame(step);
  }, 620);
}

/* Back on the bar: the iris opens on the same vessel's opening, and the camera pulls back out. */
function emerge(i, cups, sims, shelfEl) {
  const cup = cups[i]; if (!cup) return;
  sessionStorage.removeItem("brew-dive");
  document.body.classList.add("diving", "emerging");
  shelfEl.classList.add("focus"); cup.classList.add("pouring", "chosen");
  sims[i].hover(true);
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (location.hash) history.replaceState(null, "", location.pathname);
  const shelfBox = shelfEl.getBoundingClientRect();
  const y = Math.max(0, shelfBox.top + scrollY - innerHeight * .3);
  lenis?.start(); lenis?.scrollTo(y, { immediate: true, force: true }); window.scrollTo(0, y);
  lenis?.stop();
  IRIS = IRIS || irisCtl();
  requestAnimationFrame(() => {
    const cam = lens(cup, sims[i]); cam.sec.classList.add("zooming"); cam.at(1);
    IRIS.set(innerWidth / 2, innerHeight / 2, 0);
    document.documentElement.classList.remove("pouring");
    const D = 1300, t0 = performance.now(), R0 = IRIS.cover();
    const step = now => {
      const k = Math.min(1, (now - t0) / D), back = 1 - easeInOut(sstep(.25, 1, k));
      cam.at(back);
      const [x, yy] = cam.centre(back);
      IRIS.set(x, yy, R0 * easeOut(sstep(0, .75, k)));
      if (k < 1) requestAnimationFrame(step);
      else {
        IRIS.off(); cam.reset();
        shelfEl.classList.remove("focus"); shelfEl.classList.add("return");
        sims[i].shout("Cheers!");
        setTimeout(() => { cup.classList.remove("pouring", "chosen"); sims[i].hover(false); sims[i].surge(0); shelfEl.classList.remove("return"); }, 900);
        document.body.classList.remove("diving", "emerging");
        lenis?.scrollTo(scrollY, { immediate: true, force: true }); lenis?.start();
      }
    };
    requestAnimationFrame(step);
  });
}

/* nav items for skills: on the home page dive through the glass; elsewhere go home and dive from there */
function glassNav() {
  document.addEventListener("click", e => {
    const a = e.target.closest("a[data-glass-nav]"); if (!a) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || reduce) return;
    e.preventDefault();
    const i = +a.dataset.glassNav;
    const go = () => {
      if (window.__openGlass) return window.__openGlass(i);
      store.sset("brew-open", String(i));
      sessionStorage.removeItem("brew-dive");
      const el = beer.el; el.className = "beerfill"; beer.start(BEER, .9);
      requestAnimationFrame(() => el.classList.add("fill"));
      store.sset("brew-pour", JSON.stringify({ color: BEER, from: "link" }));
      setTimeout(() => { location.href = "index.html"; }, 780);
    };
    const m = $("#navm");
    if (m && m.classList.contains("open")) { closeNav(); setTimeout(go, 450); } else go();
  });
}

/* skill pages: "Back to the bar" fills the screen with this page's beer, then the bar pulls out of it */
function backLinks() {
  document.addEventListener("click", e => {
    const a = e.target.closest("a[data-back]"); if (!a) return;
    const d = store.sget("brew-dive"); if (!d) return;     // arrived some other way: plain link
    e.preventDefault();
    store.sset("brew-return", JSON.stringify({ ...JSON.parse(d), color: IRIS_INK }));
    IRIS = IRIS || irisCtl();
    const r = a.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    IRIS.run(IRIS.cover(), 0, 750, easeIn, () => [x, y], () => setTimeout(() => { location.href = a.href; }, 80));  });
}

/* ---- 8c. Spotlight: hover a glass → the rest fade back, its details slide in beside it ---- */
function peek() {
  const wrap = $(".shelf-wrap"), shelfEl = $(".shelf"), panel = $("#peek");
  if (!panel || !matchMedia("(hover: hover)").matches) return;
  const cups = $$(".cup[data-glass]");
  let hideT = 0, current = -1;
  const show = i => {
    if (document.body.classList.contains("diving")) return;
    clearTimeout(hideT);
    const cup = cups[i];
    if (current !== i) {
      panel.classList.remove("in");
      panel.innerHTML = $(".peek-tpl", cup).innerHTML;
      panel.style.setProperty("--tick", "var(--accent)");
      $$("li", panel).forEach((li, k) => li.style.setProperty("--k", k));
      // sit on the open side of the glass, vertically centred on its bowl
      const wr = wrap.getBoundingClientRect(), gr = $(".glass", cup).getBoundingClientRect();
      const right = i < cups.length / 2;
      panel.classList.toggle("left", !right);
      panel.style.left = right ? (gr.right - wr.left + 36) + "px" : "";
      panel.style.right = right ? "" : (wr.right - gr.left + 36) + "px";
      panel.style.top = (gr.top - wr.top + gr.height * .22) + "px";
      void panel.offsetWidth;
      current = i;
    }
    shelfEl.classList.add("peeking");
    cups.forEach((c, k) => c.classList.toggle("lit", k === i));
    panel.classList.add("in");
  };
  const hide = () => {
    hideT = setTimeout(() => {
      shelfEl.classList.remove("peeking"); cups.forEach(c => c.classList.remove("lit"));
      panel.classList.remove("in"); current = -1;
    }, 120);
  };
  cups.forEach((cup, i) => {
    cup.addEventListener("pointerenter", () => show(i));
    cup.addEventListener("pointerleave", hide);
    cup.addEventListener("focus", () => show(i));
    cup.addEventListener("blur", hide);
    cup.addEventListener("click", () => { panel.classList.remove("in"); shelfEl.classList.remove("peeking"); });
  });
}

/* ---- 8d. Bar signs: little rustic signs that swing, slide and pop in with a joke, then leave ---- */
const SIGNS = {
  home: [
    ["Fresh code on tap", "No hangover. No legacy jQuery."],
    ["Happy hour", "0% broken checkouts, all day."],
    ["Our Liquid is stronger", "Shopify Liquid, that is. Calm down."],
    ["Bugs?", "Squashed before last call."],
    ["Warning", "Themes may cause sudden sales."],
    ["checkout.liquid", "has left the building. Extensions only."],
    ["200+ stores served", "And he still remembers every theme name."],
    ["11 years on tap", "Brewing Shopify since 2015."],
    ["Pull the cord", "Lights on = Lager mode. Off = Stout."],
    ["Designed in Figma", "Brewed in Liquid. Served worldwide."],
    ["Tip jar accepts", "5-star reviews and repeat agencies."],
    ["Last call", "for slow Shopify stores."],
    ["Today's special", "A theme your team edits without crying."],
    ["Cash only", "Just kidding. Invoices welcome."],
    ["On London time", "From a sunny corner of Portugal."],
    ["Speaks 4 languages", "English, Hindi, Punjabi & beer-order Portuguese."],
    ["We don't do 'quick fixes'", "We do proper pints."],
    ["Free refills", "on bug fixes after launch."],
    ["Shopify Functions", "Like a bartender who never miscounts."],
    ["B2B & retail", "Same bar, two prices, zero confusion."],
    ["No apps were harmed", "in the making of this theme."],
    ["Lighthouse score", "Brighter than the bulb up there."],
    ["Remote bar", "Open in your timezone too."],
    ["Agencies welcome", "UK, US, Germany, India. Pull up a stool."],
    ["Hiring?", "Contract, freelance or full-time. Ask the bartender."],
    ["Shaken, not stirred", "That's martinis. We ship themes."],
    ["Spring Boot on tap", "Java back ends, poured cold."],
    ["Bilingual bartender", "Fluent in Liquid AND Java."],
    ["Available now", "Freelance, contract or full-time."],
  ],
  themes: [["House special", "Custom OS 2.0, no artificial apps."], ["Sections, not tickets", "Marketing builds the page. Dev finishes his beer."], ["Figma → Liquid", "Pixel for pixel, pint for pint."], ["Horizon builds", "The new theme on the block."], ["Theme rescue", "We've seen worse. Probably."], ["No theme spaghetti", "Clean Liquid, clear head."]],
  "shopify-plus": [["Hot stuff", "Checkout UI extensions on the boil."], ["Goodbye Scripts", "Shopify Functions do it upgrade-safe now."], ["B2B pricing", "Wholesale pint, retail pint, same tap."], ["Discount rules", "That don't break at checkout. Imagine."], ["Delivery & payments", "Custom logic, inside Shopify's own checkout."], ["checkout.liquid", "Deprecated. Retirement party on Friday."]],
  apps: [["Microservices", "Small kegs, each on its own tap."], ["Tested before tapped", "Unit + integration, no flat pints."], ["Off-menu orders", "If Shopify can't, an app can."], ["Headless?", "Storefront API, full design control."], ["Subscriptions", "Recharge keeps the regulars coming back."], ["Webhooks", "The bar bell that never sleeps."], ["GraphQL & REST", "Bilingual APIs, like the bartender."], ["Meta CAPI", "Your ads finally know who bought what."]],
  launch: [["Bottled & capped", "Ships on purpose, not by accident."], ["Faster pours", "Less app code, lighter pages."], ["Shopify CLI", "Git releases you can roll back."], ["No Friday deploys", "Unless you buy the first round."], ["Post-launch support", "We don't ghost after last call."], ["Agency ready", "Slots into your team like a fresh keg."]],
};
function signs() {
  if (reduce) return;
  const page = (location.pathname.split("/").pop() || "index.html").replace(".html", "");
  const pool = (SIGNS[page] || []).concat(SIGNS.home);
  const kinds = ["plank", "tin", "chalk"];
  let order = pool.map((_, i) => i).sort(() => Math.random() - .5), n = 0, last = "", timer = 0, live = null;
  const busy = () => document.body.classList.contains("diving") || $(".modal.open") || $("#navm.open") || document.hidden;

  function make(kind, [title, line]) {
    const el = document.createElement("div");
    el.className = `sign sign--${kind}`;
    el.setAttribute("role", "status");
    el.innerHTML = kind === "plank"
      ? `<i class="chain l"></i><i class="chain r"></i><div class="board"><b>${title}</b><span>${line}</span><em class="nail l"></em><em class="nail r"></em></div>`
      : kind === "tin"
      ? `<div class="board"><b>${title}</b><span>${line}</span><em class="screw tl"></em><em class="screw tr"></em><em class="screw bl"></em><em class="screw br"></em></div>`
      : `<div class="board"><b>${title}</b><span>${line}</span></div>`;
    el.addEventListener("click", () => leave(el));
    return el;
  }
  function leave(el) {
    if (!el || el.classList.contains("out")) return;
    el.classList.add("out"); el.classList.remove("in");
    setTimeout(() => el.remove(), 900);
    if (live === el) live = null;
  }
  function show() {
    clearTimeout(timer);
    if (busy() || live) { timer = setTimeout(show, 2500); return; }
    const kind = kinds.filter(k => k !== last)[Math.floor(Math.random() * 2)]; last = kind;
    if (n && n % order.length === 0) order.sort(() => Math.random() - .5);   // reshuffle each lap
    const msg = pool[order[n++ % order.length]];
    const el = make(kind, msg);
    // where it shows up: plank hangs from the top, tin pops from the right, chalkboard slides up bottom-left
    if (kind === "plank") el.style.left = (12 + Math.random() * 46) + "%";
    if (kind === "tin") el.style.top = (30 + Math.random() * 30) + "%";
    document.body.appendChild(el); live = el; Sfx.play("pop");
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("in")));
    setTimeout(() => leave(el), 4600);
    timer = setTimeout(show, 6500 + Math.random() * 3500);
  }
  timer = setTimeout(show, 3000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { clearTimeout(timer); timer = setTimeout(show, 4000); } });
}

/* ---- 8e. Bar sounds: tiny synthesised effects, off until the visitor turns them on ---- */
const Sfx = (() => {
  let on = false, ac = null;
  try { on = localStorage.getItem("brew-sfx") === "1"; } catch {}
  const ctx = () => (ac = ac || new (window.AudioContext || window.webkitAudioContext)());
  const env = (g, t, a, d, peak = .25) => { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + a + d); };
  const tone = (f0, f1, d, type = "sine", peak = .18) => {
    const c = ctx(), t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + d);
    env(g, t, .005, d, peak); o.connect(g).connect(c.destination); o.start(t); o.stop(t + d + .05);
  };
  const noise = (d, freq, q = 1, peak = .2) => {
    const c = ctx(), t = c.currentTime, len = Math.ceil(c.sampleRate * d), buf = c.createBuffer(1, len, c.sampleRate), ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain();
    src.buffer = buf; bp.type = "bandpass"; bp.frequency.value = freq; bp.Q.value = q;
    env(g, t, .02, d, peak); src.connect(bp).connect(g).connect(c.destination); src.start(t);
  };
  const S = {
    clink() { tone(2400, 2300, .35, "sine", .14); setTimeout(() => tone(3100, 3000, .3, "sine", .1), 60); },
    pop() { tone(700, 180, .09, "sine", .2); },
    click() { tone(1400, 900, .04, "square", .05); },
    mash() { noise(.45, 900, .7, .12); },
    boil() { noise(.6, 3500, .5, .14); },
    ferment() { tone(180, 90, .18, "sine", .22); setTimeout(() => tone(240, 120, .14, "sine", .16), 140); },
    bottle() { tone(2600, 2500, .2, "triangle", .12); setTimeout(() => tone(1800, 1750, .18, "triangle", .08), 90); },
    iris() { tone(500, 1400, .35, "sine", .09); },
  };
  function sync() {
    const b = $("#sfx"); if (!b) return;
    b.setAttribute("aria-pressed", String(on)); b.setAttribute("aria-label", "Sound effects: " + (on ? "on" : "off")); b.classList.toggle("on", on);
  }
  return {
    play(name) { if (!on || reduce || !S[name]) return; try { S[name](); } catch {} },
    init() {
      sync();
      $("#sfx")?.addEventListener("click", () => {
        on = !on; try { localStorage.setItem("brew-sfx", on ? "1" : "0"); } catch {}
        sync(); if (on) { ctx().resume?.(); S.clink(); }
      });
    },
  };
})();

/* ---- 8f. The brewmaster: a cartoon tankard who waves, blinks, watches the cursor and cheers ---- */
function mascot() {
  const cv = $("#mascot"); if (!cv) return;
  const ctx = cv.getContext("2d"), box = cv.parentElement;
  const W = 300, H = 380;
  let dpr = 1, k = 1, t = 0, wave = 2.4, cheer = 0, blink = 0, nextBlink = 2, look = [0, 0], want = [0, 0], hop = 9;
  const steam = toonPuffs();
  const size = () => { dpr = Math.min(2, devicePixelRatio || 1); const w = box.clientWidth, h = box.clientHeight; k = Math.min(w / W, h / H); cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + "px"; cv.style.height = h + "px"; };
  size(); addEventListener("resize", size);
  addEventListener("pointermove", e => {
    const r = cv.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * .45;
    const dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy) || 1;
    want = [dx / d * Math.min(1, d / 300), dy / d * Math.min(1, d / 300)];
  }, { passive: true });
  cv.addEventListener("click", () => { hop = 0; wave = 1.4; Sfx.play("pop"); });
  window.__mascot = { cheers() { cheer = 2; hop = 0; } };

  function draw(dt) {
    t += dt; wave = Math.max(0, wave - dt); cheer = Math.max(0, cheer - dt); hop += dt;
    nextBlink -= dt; if (nextBlink < 0) { blink = .14; nextBlink = 2 + Math.random() * 3; } blink = Math.max(0, blink - dt);
    look[0] += (want[0] - look[0]) * Math.min(1, dt * 6); look[1] += (want[1] - look[1]) * Math.min(1, dt * 6);
    const w = cv.width / dpr, h = cv.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    ctx.translate((w - W * k) / 2, (h - H * k) / 2); ctx.scale(k, k);
    // idle bob + hop
    const hy = hop < .5 ? -Math.sin(hop / .5 * Math.PI) * 26 : 0;
    const bob = Math.sin(t * 2.2) * 3 + hy, sq = hop < .5 ? Math.sin(hop / .5 * Math.PI) * -.05 : Math.sin(t * 2.2) * .01;
    ctx.fillStyle = "rgba(20,10,5,.16)"; ctx.beginPath(); ctx.ellipse(150, 352, 90 * (1 - hy / -120), 10, 0, 0, 6.283); ctx.fill();
    ctx.save(); ctx.translate(150, 350); ctx.scale(1 - sq, 1 + sq); ctx.translate(-150, -350 + bob);
    // handle (right)
    const hd = new Path2D(); hd.moveTo(220, 150); hd.bezierCurveTo(286, 150, 290, 280, 220, 286); hd.lineTo(220, 262); hd.bezierCurveTo(262, 258, 262, 176, 220, 176); hd.closePath();
    cel(ctx, hd, "glass", { x: 220, y: 150, w: 66, h: 136 }, { shade: false, lw2: 4 });
    // body: glass tankard full of beer
    const body = rrPath(70, 110, 156, 236, 26);
    ctx.fillStyle = "#f2a93a"; ctx.fill(body);
    ctx.save(); ctx.clip(body);
    ctx.fillStyle = "#d9861f"; ctx.fillRect(176, 110, 60, 240);
    ctx.fillStyle = "#ffd07a"; ctx.fillRect(86, 110, 12, 240);
    for (let i = 0; i < 9; i++) { const by = 330 - ((t * 40 + i * 37) % 200); dot(ctx, 100 + (i * 23) % 110, by, 2 + (i % 3), "#ffe8b8", true, 1.2); }
    ctx.restore();
    ctx.strokeStyle = INK; ctx.lineWidth = 4.5; ctx.stroke(body);
    [150, 230, 310].forEach(y => inkLine(ctx, [[74, y], [80, y]], 3));
    // foam hat
    const fm = new Path2D(); fm.moveTo(62, 128);
    [[70, 96], [100, 82], [132, 90], [160, 76], [194, 88], [222, 92], [236, 126]].forEach(([x, y], i) => fm.quadraticCurveTo(x - 10, y - 10 - Math.sin(t * 2 + i) * 2, x, y));
    fm.quadraticCurveTo(244, 146, 220, 146); fm.lineTo(80, 146); fm.quadraticCurveTo(56, 146, 62, 128); fm.closePath();
    cel(ctx, fm, ["#fff8ea", "#ecdcc0", "#ffffff"], { x: 56, y: 70, w: 190, h: 78 }, { light: false, lw2: 4.5 });
    // foam drip over the edge
    cel(ctx, rrPath(196, 138, 16, 30 + Math.sin(t * 1.5) * 4, 8), ["#fff8ea", "#ecdcc0", "#fff"], { x: 196, y: 138, w: 16, h: 34 }, { light: false, lw2: 3.5 });
    // face
    const ex = look[0] * 6, ey = look[1] * 5;
    [[118, 200], [178, 200]].forEach(([x, y]) => {
      if (blink > 0 || cheer > 0) { inkLine(ctx, [[x - 11, y + 2], [x, y - 6], [x + 11, y + 2]], 4.5); return; }
      dot(ctx, x, y, 15, "#ffffff", true, 4); dot(ctx, x + ex, y + ey, 7, INK, false); dot(ctx, x + ex - 2.5, y + ey - 3, 2.4, "#fff", false);
    });
    ctx.fillStyle = "rgba(226,70,58,.35)"; ctx.beginPath(); ctx.ellipse(100, 232, 13, 7, 0, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.ellipse(196, 232, 13, 7, 0, 0, 6.283); ctx.fill();
    const mouth = new Path2D(); const open = cheer > 0 || wave > 0 ? 16 : 9;
    mouth.moveTo(126, 236); mouth.quadraticCurveTo(148, 236 + open * 1.6, 170, 236); mouth.quadraticCurveTo(148, 244, 126, 236); mouth.closePath();
    ctx.fillStyle = "#7a2a14"; ctx.fill(mouth); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(mouth);
    // moustache, because brewmaster
    const mo = new Path2D(); mo.moveTo(148, 226); mo.bezierCurveTo(130, 216, 112, 222, 106, 236); mo.bezierCurveTo(120, 230, 136, 232, 148, 232); mo.bezierCurveTo(160, 232, 176, 230, 190, 236); mo.bezierCurveTo(184, 222, 166, 216, 148, 226); mo.closePath();
    ctx.fillStyle = "#5a3418"; ctx.fill(mo); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke(mo);
    // apron
    const ap = new Path2D(); ap.moveTo(96, 262); ap.lineTo(200, 262); ap.lineTo(206, 340); ap.quadraticCurveTo(148, 352, 90, 340); ap.closePath();
    cel(ctx, ap, ["#2f5a4e", "#244639", "#3f7a68"], { x: 90, y: 262, w: 116, h: 88 }, { lw2: 4 });
    ctx.font = "15px Rye, Georgia, serif"; ctx.textAlign = "center"; ctx.fillStyle = "#f2c44c"; ctx.fillText("BREWMASTER", 148, 300);
    ctx.font = "800 10px Onest, sans-serif"; ctx.fillStyle = "#fff6e2"; ctx.fillText("EST. 2015", 148, 318);
    // waving arm (left) — waves on load, on click, and cheers with a tiny glass
    const wa = wave > 0 ? Math.sin(t * 16) * .6 : cheer > 0 ? -1.4 : Math.sin(t * 1.6) * .08;
    ctx.save(); ctx.translate(74, 236); ctx.rotate(-.5 + wa - (cheer > 0 ? .6 : 0));
    cel(ctx, rrPath(-48, -9, 52, 18, 9), ["#f2a93a", "#d9861f", "#ffd07a"], { x: -48, y: -9, w: 52, h: 18 }, { lw2: 4 });
    dot(ctx, -52, 0, 13, "#fff8ea", true, 4);
    if (cheer > 0) { cel(ctx, rrPath(-64, -46, 22, 34, 4), "glass", { x: -64, y: -46, w: 22, h: 34 }, { shade: false, lw2: 3 }); ctx.fillStyle = "#f2a93a"; ctx.fillRect(-62, -36, 18, 22); }
    ctx.restore();
    ctx.restore();
    if (Math.random() < dt * 1.5) steam.add(120 + Math.random() * 60, 70, (Math.random() - .5) * 8, -18, 6, 1.8);
    steam.step(dt); steam.draw(ctx);
    if (cheer > 0 && cheer > 1.9) { /* a burst of sparkles on cheers */ }
  }
  let raf = 0, last = performance.now();
  const loop = now => { const dt = Math.min(.05, (now - last) / 1000); last = now; draw(dt); raf = requestAnimationFrame(loop); };
  new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); if (e.isIntersecting) { last = performance.now(); raf = requestAnimationFrame(loop); } }).observe(cv);
  draw(.016);
}

/* ---- 8g. The contact form pours a pint as it fills up, then foams over on send ---- */
function pintForm() {
  const cv = $("#pint"), f = $("#ct-form"); if (!cv || !f) return;
  const ctx = cv.getContext("2d");
  const W = 120, H = 190;
  let dpr = 1, level = 0, target = 0, t = 0, over = 0, raf = 0, last = 0;
  const bubbles = [];
  const size = () => { dpr = Math.min(2, devicePixelRatio || 1); cv.width = W * dpr; cv.height = H * dpr; };
  size();
  const measure = () => {
    const parts = [f.name.value.trim().length > 1, /.+@.+\..+/.test(f.email.value), !!f.type.value, Math.min(1, f.msg.value.trim().length / 80)];
    target = (parts[0] ? .22 : 0) + (parts[1] ? .22 : 0) + (parts[2] ? .18 : 0) + parts[3] * .38;
  };
  f.addEventListener("input", measure); f.addEventListener("change", measure);
  const glass = new Path2D(); glass.moveTo(22, 20); glass.lineTo(98, 20); glass.lineTo(88, 176); glass.quadraticCurveTo(60, 182, 32, 176); glass.closePath();
  function draw(dt) {
    t += dt; level += (target - level) * Math.min(1, dt * 3); over = Math.max(0, over - dt * .4);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "rgba(20,10,5,.16)"; ctx.beginPath(); ctx.ellipse(60, 182, 36, 5, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = "rgba(232,242,246,.5)"; ctx.fill(glass);
    ctx.save(); ctx.clip(glass);
    const y = 176 - level * 150;
    if (level > .01) {
      ctx.fillStyle = "#f2a93a"; ctx.fillRect(0, y, W, H);
      ctx.fillStyle = "#d9861f"; ctx.fillRect(74, y, 40, H);
      if (Math.random() < dt * 14 * level) bubbles.push({ x: 34 + Math.random() * 52, y: 176, r: 1 + Math.random() * 2 });
      for (const b of bubbles) b.y -= dt * 60;
      while (bubbles.length && bubbles[0].y < y) bubbles.shift();
      for (const b of bubbles) dot(ctx, b.x, b.y, b.r, "#ffe8b8", true, .8);
      const fh = 8 + level * 12 + over * 20;
      ctx.fillStyle = "#fff8ea"; ctx.beginPath(); ctx.moveTo(0, y + 2);
      for (let x = 0; x <= W; x += 6) ctx.lineTo(x, y - fh + Math.sin(x * .3 + t * 4) * 2); ctx.lineTo(W, y + 2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#fff8ea"; ctx.fillRect(0, y - fh + 2, W, fh);
    }
    ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.fillRect(30, 30, 5, 130);
    ctx.restore();
    ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.lineJoin = "round"; ctx.stroke(glass);
    if (over > 0) {                     // foam spilling over the rim
      ctx.fillStyle = "#fff8ea"; ctx.strokeStyle = INK; ctx.lineWidth = 3;
      [[24, 22, 14], [46, 12, 16], [72, 14, 15], [96, 22, 13]].forEach(([x, yy, r]) => { ctx.beginPath(); ctx.arc(x, yy - over * 8, r, 0, 6.283); ctx.fill(); ctx.stroke(); });
      ctx.beginPath(); ctx.ellipse(98, 50 + (1 - over) * 30, 6, 12, 0, 0, 6.283); ctx.fill(); ctx.stroke();
      ctx.font = "20px Rye, Georgia, serif"; ctx.textAlign = "center"; ctx.lineWidth = 5; ctx.strokeText("Cheers!", 60, 110); ctx.fillStyle = "#ffe066"; ctx.fillText("Cheers!", 60, 110);
    }
    ctx.font = "800 10px Onest, sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = INK; ctx.fillText(Math.round(level * 100) + "% poured", 60, 100 + (over > 0 ? 400 : 0));
  }
  const loop = now => { const dt = Math.min(.05, (now - last) / 1000); last = now; draw(dt); if ($("#contact").classList.contains("open")) raf = requestAnimationFrame(loop); };
  new MutationObserver(() => { if ($("#contact").classList.contains("open")) { cancelAnimationFrame(raf); last = performance.now(); measure(); raf = requestAnimationFrame(loop); } }).observe($("#contact"), { attributes: true, attributeFilter: ["class"] });
  window.__pint = { cheers() { target = 1; level = Math.max(level, .9); over = 1; } };
  draw(0);
}

/* ---- 8h. A copper pipe down the side fills with beer as you scroll ---- */
function scrollPipe() {
  const el = $("#scrollpipe"); if (!el) return;
  const g = $(".gauge", el);
  const upd = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    el.style.setProperty("--sp", (p * 100).toFixed(1) + "%");
    g.textContent = Math.round(p * 100) + "%";
    el.classList.toggle("full", p > .985);
  };
  addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
}

/* ---- 8i. Easter egg: pull the light cord 5 times quickly → LAST CALL ---- */
function lastCall() {
  let taps = [];
  window.__lastCallTap = () => {
    const now = performance.now(); taps = taps.filter(x => now - x < 4000); taps.push(now);
    if (taps.length >= 5) { taps = []; fire(); }
  };
  function fire() {
    if ($(".lastcall")) return;
    Sfx.play("clink"); setTimeout(() => Sfx.play("clink"), 220);
    const el = document.createElement("div"); el.className = "lastcall"; el.setAttribute("role", "status");
    el.innerHTML = `<div class="lc-sign"><b>LAST CALL!</b><span>The bartender is impressed. You found the secret cord trick.<br>Drinks (and a reply within a day) are on the house.</span><button class="btn" data-contact>Order the last round <span class="badge">→</span></button></div>`;
    document.body.appendChild(el);
    const caps = document.createElement("canvas"); caps.className = "lc-caps"; el.appendChild(caps);
    const c = caps.getContext("2d"), d = Math.min(2, devicePixelRatio || 1);
    caps.width = innerWidth * d; caps.height = innerHeight * d; c.setTransform(d, 0, 0, d, 0, 0);
    const list = Array.from({ length: 90 }, () => ({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight, v: 120 + Math.random() * 220, r: Math.random() * 6, s: 8 + Math.random() * 7, col: ["#f2c44c", "#e2463a", "#cdd5dc", "#e58c4c"][Math.floor(Math.random() * 4)] }));
    let last = performance.now(), alive = true;
    const step = now => {
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      c.clearRect(0, 0, innerWidth, innerHeight);
      for (const q of list) {
        q.y += q.v * dt; q.r += dt * 4;
        c.save(); c.translate(q.x, q.y); c.rotate(q.r);
        c.fillStyle = q.col; c.strokeStyle = INK; c.lineWidth = 2;
        c.beginPath(); for (let i = 0; i < 21; i++) { const a = i / 21 * 6.283, rr = i % 2 ? q.s : q.s * .82; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.stroke();
        c.restore();
      }
      if (alive) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    requestAnimationFrame(() => el.classList.add("in"));
    const close = () => { alive = false; el.classList.remove("in"); setTimeout(() => el.remove(), 600); };
    el.addEventListener("click", e => { if (!e.target.closest(".btn")) close(); else close(); });
    setTimeout(close, 6500);
  }
}

/* ---- 8j. Skill pages: their brewing vessel bubbles away in the header ---- */
function headVessel() {
  const host = $(".vessel-head"); if (!host) return;
  const sim = makeVessel(host, 7);
  sim.hover(true);
  host.addEventListener("pointerenter", () => sim.shout());
  let raf = 0, last = performance.now();
  const loop = now => { const dt = Math.min(.04, (now - last) / 1000); last = now; sim.step(dt); raf = requestAnimationFrame(loop); };
  new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); if (e.isIntersecting) { last = performance.now(); raf = requestAnimationFrame(loop); } }).observe(host);
  sim.step(.016);
}

/* ---- 8k. Phones: the brewhouse becomes a swipeable row with dots ---- */
function swipeShelf() {
  const s = $(".shelf"), dots = $(".shelf-dots"); if (!s || !dots) return;
  const cups = $$(".cup", s);
  dots.innerHTML = cups.map((_, i) => `<i data-i="${i}"></i>`).join("");
  const set = () => {
    const mid = s.scrollLeft + s.clientWidth / 2; let best = 0, d = Infinity;
    cups.forEach((c, k) => { const cm = c.offsetLeft + c.offsetWidth / 2; if (Math.abs(cm - mid) < d) { d = Math.abs(cm - mid); best = k; } });
    $$("i", dots).forEach((x, k) => x.classList.toggle("on", k === best));
  };
  s.addEventListener("scroll", set, { passive: true }); set();
  dots.addEventListener("click", e => { const i = e.target.dataset.i; if (i == null) return; const c = cups[+i]; s.scrollTo({ left: c.offsetLeft - (s.clientWidth - c.offsetWidth) / 2, behavior: "smooth" }); });
}

/* ---- 9. Mobile nav ---- */
function closeNav() { const m = $("#navm"); if (!m) return; m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); $("#burger")?.setAttribute("aria-expanded", "false"); }
function nav() {
  const m = $("#navm");
  $("#burger").addEventListener("click", () => { m.classList.add("open"); m.setAttribute("aria-hidden", "false"); $("#burger").setAttribute("aria-expanded", "true"); });
  $("#navclose").addEventListener("click", closeNav);
}

/* ---- 10. Reveals + split headings ---- */
function reveals() {
  $$("[data-split]").forEach(el => {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(part); return; }
            const w = document.createElement("span"); w.className = "w";
            const s = document.createElement("span"); s.textContent = part; s.style.setProperty("--i", i++);
            w.append(s); frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    };
    walk(el); el.classList.add("split");
  });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  $$(".rv, .split").forEach(el => io.observe(el));
}

/* ---- 11. Hero ticket rotator ---- */
function tickets() {
  const t = $("#ticket"); if (!t) return;
  const roles = JSON.parse(t.dataset.roles);
  const role = $(".role", t), no = $(".no", t), note = $(".note", t);
  let i = 0;
  const show = () => {
    role.textContent = roles[i].role; note.textContent = roles[i].note;
    no.textContent = `Tab Nº ${String(i + 1).padStart(2, "0")}/${String(roles.length).padStart(2, "0")}`;
    t.classList.remove("tear"); t.classList.remove("show"); void t.offsetWidth; t.classList.add("show");
  };
  show();
  if (reduce) return;
  setInterval(() => {
    t.classList.add("tear");
    setTimeout(() => { i = (i + 1) % roles.length; t.style.transition = "none"; t.classList.remove("show", "tear"); void t.offsetWidth; t.style.transition = ""; show(); }, 520);
  }, 3200);
}

/* ---- 12. Cup shelf: cursor bubble + dots ---- */
function shelf() {
  const s = $(".shelf"); if (!s) return;
  const bubble = $("#bubble");
  if (matchMedia("(hover: hover)").matches) {
    window.addEventListener("pointermove", e => { bubble.style.setProperty("--cx", e.clientX + "px"); bubble.style.setProperty("--cy", e.clientY + "px"); }, { passive: true });
    $$(".cup", s).forEach(c => { c.addEventListener("pointerenter", () => bubble.classList.add("on")); c.addEventListener("pointerleave", () => bubble.classList.remove("on")); c.addEventListener("click", () => bubble.classList.remove("on")); });
  }
  const dots = $(".shelf-dots");
  if (dots) {
    const cups = $$(".cup", s);
    dots.innerHTML = cups.map(() => "<i></i>").join("");
    const set = () => {
      const mid = s.scrollLeft + s.clientWidth / 2;
      let best = 0, d = Infinity;
      cups.forEach((c, k) => { const cm = c.offsetLeft + c.offsetWidth / 2; if (Math.abs(cm - mid) < d) { d = Math.abs(cm - mid); best = k; } });
      $$("i", dots).forEach((x, k) => x.classList.toggle("on", k === best));
    };
    s.addEventListener("scroll", set, { passive: true }); set();
  }
}

/* ---- 13. Story timeline + odometer year ---- */
function story() {
  const items = $$(".timeline > li"); if (!items.length) return;
  const yearEl = $("#year"), range = $("#range"), count = $("#count"), bar = $("#bar");
  // build 4 digit columns 0-9
  yearEl.innerHTML = Array.from({ length: 4 }, () => `<span class="col">${"0123456789".split("").map(n => `<span>${n}</span>`).join("")}</span>`).join("");
  const cols = $$(".col", yearEl);
  const setYear = y => String(y).split("").forEach((d, k) => cols[k].style.transform = `translateY(-${Number(d)}em)`);
  const activate = k => {
    items.forEach((li, j) => li.classList.toggle("on", j === k));
    setYear(items[k].dataset.year);
    range.textContent = items[k].dataset.range;
    count.textContent = `${String(k + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
    bar.style.setProperty("--w", ((k + 1) / items.length) * 100 + "%");
  };
  activate(0);
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) activate(items.indexOf(e.target)); }), { rootMargin: "-45% 0px -50% 0px" });
  items.forEach(li => io.observe(li));
}

/* ---- 14. Stacked case cards: shrink the ones underneath ---- */
function stack() {
  const cases = $$(".case"); if (!cases.length || reduce) return;
  cases.forEach((c, i) => c.style.setProperty("--n", i));
  const desktop = matchMedia("(min-width: 901px)");
  const update = () => {
    if (!desktop.matches) { cases.forEach(c => { c.style.transform = ""; c.style.filter = ""; }); return; }
    cases.forEach((c, i) => {
      const next = cases[i + 1]; if (!next) return;
      const r = next.getBoundingClientRect(), h = innerHeight;
      const p = Math.min(1, Math.max(0, 1 - (r.top - 96) / (h * 0.8)));
      c.style.transform = `scale(${1 - p * 0.06})`;
      c.style.filter = `brightness(${1 - p * 0.35})`;
    });
  };
  addEventListener("scroll", update, { passive: true }); addEventListener("resize", update); update();
}

/* ---- 15. Modals ---- */
let lastFocus = null;
function openModal(id) {
  const m = $(id); if (!m) return;
  lastFocus = document.activeElement;
  m.classList.add("open"); m.classList.remove("done");
  lenis?.stop();
  setTimeout(() => $("input:not(.hp), button.x", m)?.focus(), 80);
}
function closeModal(m) { m.classList.remove("open"); lenis?.start(); lastFocus?.focus?.(); }
function modals() {
  document.addEventListener("click", e => {
    if (e.target.closest("[data-contact]")) { e.preventDefault(); closeNav(); openModal("#contact"); }
    const mc = e.target.closest("[data-menu-card]"); if (mc) { e.preventDefault(); openModal("#menucard"); }
    if (e.target.closest("[data-close]")) closeModal(e.target.closest(".modal"));
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { $$(".modal.open").forEach(closeModal); closeNav(); } });

  const f = $("#ct-form");
  f.addEventListener("submit", e => {
    e.preventDefault();
    if (f.company.value) return; // bot
    if (!f.reportValidity()) return;
    const subject = `New order at the bar: ${f.type.value || "a project"} — ${f.name.value}`;
    const body = `${f.msg.value}\n\n— ${f.name.value}\n${f.email.value}`;
    window.__pint?.cheers(); Sfx.play("clink"); window.__mascot?.cheers();
    setTimeout(() => {
      location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      $("#contact").classList.add("done");
    }, 1100);
  });
}

/* ---- 16. Back to top ---- */
function toTop() {
  const b = $("#totop");
  addEventListener("scroll", () => b.classList.toggle("show", scrollY > innerHeight), { passive: true });
  const go = e => { e.preventDefault(); goTo(0); };
  b.addEventListener("click", go); $("#totop-link").addEventListener("click", go);
}

/* ---- boot ---- */
document.addEventListener("DOMContentLoaded", async () => {
  chrome(); clock(); knob(); rope(); smooth(); pour(); nav(); modals(); toTop();
  shelf(); glasses(); peek(); glassNav(); backLinks(); signs();
  Sfx.init(); mascot(); pintForm(); scrollPipe(); lastCall(); headVessel(); swipeShelf(); story(); stack();
  await loader();
  reveals(); tickets();
  if (!store.sget("brew-open") && !document.body.classList.contains("emerging") && location.hash && location.hash.length > 1) { const t = $(location.hash); if (t && !t.classList.contains("modal")) setTimeout(() => goTo(t), 300); }
});
