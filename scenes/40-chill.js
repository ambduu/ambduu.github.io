/* 40 · CHILL — "Apps & Back End".
   The hot wort drops in from the top-right pipe and races through the copper wort chiller:
   an amber glow travels the coil (SVG path seen "through" the copper via blend + sprite-alpha mask),
   gauges swing, valve wheels spin, the wall warms where the hot wort passes, and paper luggage tags
   (the stack) pop off the coil one by one onto a twine. Brew leaves through the pipe at bottom-centre. */
(function () {
  // chiller sprite placement in the 1440x900 box
  const CX = 244, CY = 360, S = 960 / 1100;
  const X = x => CX + x * S, Y = y => CY + y * S;
  const ORIGIN = [724, 600];               // rig scale origin (portrait)
  const ENTRY_X = 1250, EXIT_X = 709;
  const TOP = -900, BOTTOM = 1600;         // pipes run far off-stage so the rig can be scaled on portrait screens
  // PERF: the glow paths change stroke-dashoffset every scroll frame. With SVG feGaussianBlur on each masked
  // full-size path, every frame re-rasterised five blurs (+ a 16px bloom): the heaviest paint on the page and the main
  // "scroll gets stuck" cause. Now the paths are plain strokes and the blur is a CSS filter on their own composited
  // layer (applied by the compositor, no re-raster). Touch screens also skip the bloom layer and the shimmer tween.
  const LITE = matchMedia("(pointer: coarse)").matches || innerWidth < 900;
  const BLUR = "";

  // ---- coil centre-line (sprite coords, traced on chiller.webp) ----
  const pts = [];
  const P = (x, y) => pts.push([x, y]);
  const sp = (x, y) => P(X(x), Y(y));
  const L1 = [267, 367, 102, 114], L2 = [532, 367, 102, 114], L3 = [795, 367, 100, 114];
  const E = (L, a) => [L[0] + L[2] * Math.cos(a * Math.PI / 180), L[1] + L[3] * Math.sin(a * Math.PI / 180)];
  const ell = (L, a0, a1) => { const n = Math.ceil(Math.abs(a1 - a0) / 5); for (let i = 1; i <= n; i++) sp(...E(L, a0 + (a1 - a0) * i / n)); };
  const cub = (p0, p1, p2, p3, design) => { for (let i = 1; i <= 12; i++) { const t = i / 12, m = 1 - t;
    const x = m ** 3 * p0[0] + 3 * m * m * t * p1[0] + 3 * m * t * t * p2[0] + t ** 3 * p3[0];
    const y = m ** 3 * p0[1] + 3 * m * m * t * p1[1] + 3 * m * t * t * p2[1] + t ** 3 * p3[1];
    design ? P(x, y) : sp(x, y); } };
  // entry pipe (design coords) → elbow → nozzle mouth
  P(ENTRY_X, TOP); P(ENTRY_X, 650);
  cub([ENTRY_X, 650], [ENTRY_X, 680], [ENTRY_X - 12, 700], [ENTRY_X - 45, 700], true);
  sp(1085, 390); sp(1000, 390);
  cub([1000, 390], [950, 390], [905, 400], E(L3, 30));
  ell(L3, 30, 585);                                                   // right loop (and a bit)
  cub(E(L3, 225), [700, 262], [690, 190], [640, 164]); sp(551, 164); sp(460, 164);   // over the sight glass
  cub([460, 164], [405, 167], [372, 200], E(L1, -45));
  ell(L1, -45, -315);                                                 // left loop
  cub(E(L1, -315), [370, 404], [420, 424], E(L2, 150));
  ell(L2, 150, 450);                                                  // middle loop
  cub(E(L2, 450), [532, 492], [532, 505], [532, 528]);
  P(EXIT_X, BOTTOM);
  const D = "M" + pts.map(p => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L");
  const PIPE_IN = `M${ENTRY_X} ${TOP} L${ENTRY_X} 650 Q${ENTRY_X} 700 ${ENTRY_X - 50} 700 L${X(1060)} 700`;
  const PIPE_OUT = `M${EXIT_X} ${Y(470)} L${EXIT_X} ${BOTTOM}`;

  // gauges + valve wheels (sprite coords → design)
  const gauges = [[92, 65], [940, 80]].map(([x, y]) => [X(x), Y(y)]);
  const wheels = [[55, 228, 52], [987, 225, 52]];

  // stack tags on the twine. hang point (desktop) + portrait position
  const TAGS = [
    ["Admin GraphQL", "#e8d3a8", 20], ["Webhooks", "#f3ead8", 112], ["Java · Spring Boot", "#e8d3a8", 20],
    ["Node.js", "#f2c14e", 112], ["PHP", "#e8d3a8", 20], ["MySQL", "#f3ead8", 112], ["Custom &amp; public apps", "#f2c14e", 20]
  ];
  const TW = { a: [600, 150], c: [905, 262], b: [1200, 168] };      // twine: quadratic a → (c) → b
  const twAt = t => [(1 - t) ** 2 * TW.a[0] + 2 * (1 - t) * t * TW.c[0] + t * t * TW.b[0], (1 - t) ** 2 * TW.a[1] + 2 * (1 - t) * t * TW.c[1] + t * t * TW.b[1]];
  // portrait: tags pinned in two columns inside the visible window (x≈512..928)
  const MOB = [[615, 300], [828, 300], [640, 370], [835, 370], [600, 440], [800, 440], [720, 506]];   // portrait: rows start below the service line

  const brick = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="96"><g fill="#fff">
    <rect x="2" y="2" width="116" height="44" opacity=".035"/><rect x="122" y="2" width="116" height="44" opacity=".06"/>
    <rect x="-58" y="50" width="116" height="44" opacity=".05"/><rect x="62" y="50" width="116" height="44" opacity=".025"/><rect x="182" y="50" width="116" height="44" opacity=".05"/></g></svg>`);

  SCENES.push({
    id: "chill", order: 40, height: 240, bg: "#47474a", headerTone: "light",
    nav: { label: "Apps & Back End", href: "apps.html" },
    html: (K) => {
      const tags = TAGS.map(([t, c, len], i) => {
        const [hx, hy] = twAt(.04 + .92 * i / (TAGS.length - 1));
        return `<div class="ch-tw" data-i="${i}" style="--x:${hx.toFixed(0)};--y:${hy.toFixed(0)};--mx:${MOB[i][0]};--my:${MOB[i][1]};--len:${len}px">
          <div class="ch-swing"><i class="ch-str"></i>${K.tag(t, { color: c })}</div></div>`;
      }).join("");
      const gaugeHtml = gauges.map(([x, y], i) => `<div class="ch-gauge" style="left:${x}px;top:${y}px"><i class="ch-face"></i><b class="ch-needle" id="ch-n${i}"><s></s></b><i class="ch-hub"></i></div>`).join("");
      const wheelHtml = wheels.map(([x, y, r], i) => `<i class="ch-wheel" id="ch-w${i}" style="left:${X(x - r)}px;top:${Y(y - r)}px;width:${2 * r * S}px;height:${2 * r * S}px;
        background-size:${1100 * S}px ${528 * S}px;background-position:${-(x - r) * S}px ${-(y - r) * S}px"></i>`).join("");
      const pipeSvg = (d, extra = "") => `
        <path d="${d}" stroke="#6e3412" stroke-width="54" fill="none" stroke-linejoin="round"/>
        <path d="${d}" stroke="#b9612f" stroke-width="44" fill="none" stroke-linejoin="round"/>
        <path d="${d}" stroke="#d98552" stroke-width="22" fill="none" stroke-linejoin="round"/>
        <path d="${d}" stroke="#eeac7c" stroke-width="6" fill="none" stroke-linejoin="round" opacity=".8"/>
        <path d="${d}" stroke="#5a2a0e" stroke-width="54" fill="none" stroke-dasharray="2 46" opacity=".35"/>${extra}`;
      return K.box(`
        <div class="ch-wall"></div>
        <div class="ch-heat" id="ch-heat"></div>
        <svg class="ch-twine" viewBox="0 0 1440 900" width="1440" height="900" aria-hidden="true">
          <path d="M${TW.a} Q${TW.c} ${TW.b}" fill="none" stroke="#efe6d6" stroke-width="2.5" stroke-linecap="round"/></svg>
        <i class="ch-tack" style="left:${TW.a[0]}px;top:${TW.a[1]}px"></i><i class="ch-tack" style="left:${TW.b[0]}px;top:${TW.b[1]}px"></i>
        <div class="ch-rig">
          <svg class="ch-pipes d2" viewBox="0 0 1440 900" width="1440" height="900" aria-hidden="true">${pipeSvg(PIPE_IN)}${pipeSvg(PIPE_OUT)}
            <rect x="${ENTRY_X - 38}" y="236" width="76" height="22" rx="3" fill="#2f2f31"/><rect x="${ENTRY_X - 38}" y="236" width="76" height="7" rx="3" fill="#4a4a4e"/>
            <circle cx="${ENTRY_X - 30}" cy="247" r="4" fill="#9a9aa0"/><circle cx="${ENTRY_X + 30}" cy="247" r="4" fill="#9a9aa0"/></svg>
          ${K.img("chiller", { x: CX, y: CY, w: 960, depth: 2, id: "ch-coil", z: 2, alt: "Copper wort chiller" })}
          <i class="ch-collar" style="left:${X(1064)}px;top:${700 - 32}px"></i>
          <i class="ch-collar ch-collar--h" style="left:${EXIT_X - 31}px;top:${Y(508)}px"></i>
          <svg class="ch-liq" viewBox="0 0 1440 900" width="1440" height="900" aria-hidden="true">
            <defs>
              <mask id="ch-mask" maskUnits="userSpaceOnUse" x="-200" y="${TOP}" width="1900" height="${BOTTOM - TOP}" style="mask-type:alpha">
                <image href="img/chiller.webp" x="${CX}" y="${CY}" width="960" height="${528 * S}"/>
                <path d="${PIPE_IN}" stroke="#000" stroke-width="42" fill="none"/><path d="${PIPE_OUT}" stroke="#000" stroke-width="42" fill="none"/>
              </mask>
            </defs>
            <g mask="url(#ch-mask)">
              <path id="ch-warm" d="${D}" fill="none" stroke="#ffa63a" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"${BLUR} opacity=".42"/>
              <path id="ch-trail" d="${D}" fill="none" stroke="#ff8a2a" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"${BLUR}/>
              <path id="ch-flow" d="${D}" fill="none" stroke="#ffd98a" stroke-width="12" stroke-linecap="round" stroke-dasharray="10 70"${BLUR} opacity="0"/>
            </g>
          </svg>
          <svg class="ch-hot" viewBox="0 0 1440 900" width="1440" height="900" aria-hidden="true">
            <g mask="url(#ch-mask)">
              <path id="ch-head" d="${D}" fill="none" stroke="#ffd27a" stroke-width="40" stroke-linecap="round"${BLUR}/>
              <path id="ch-core" d="${D}" fill="none" stroke="#fff4d0" stroke-width="14" stroke-linecap="round"${BLUR}/>
            </g>
          </svg>
          ${LITE ? "" : `<svg class="ch-bloom" viewBox="0 0 1440 900" width="1440" height="900" aria-hidden="true">
            <path id="ch-bloomp" d="${D}" fill="none" stroke="#ff9a3c" stroke-width="70" stroke-linecap="round"/>
          </svg>`}
          ${wheelHtml}${gaugeHtml}
          <div class="ch-temp"><small>Wort</small><b id="ch-deg">98°</b><small>°C</small></div>
        </div>
        <div class="ch-tags">${tags}</div>
        <p class="ch-note">Hot ideas in.<br>Cool, tested code out.</p>
      `, { focus: 50 }) + K.svc({ step: 3, brew: "Chill", title: "Apps &amp; Back&nbsp;End", href: "apps.html", left: "5%", top: "max(104px, 13%)",
        text: "Custom and public apps, APIs and integrations, plus the back ends that run them." }) + `
      <style>
        #chill .jstage { background: radial-gradient(120% 90% at 55% 60%, #545458 0%, #47474a 45%, #353538 100%); }
        #chill .ch-wall { position: absolute; inset: -400px; background: url("data:image/svg+xml,${brick}"); opacity: .9; }
        #chill .ch-heat { position: absolute; left: 0; top: 0; width: 1100px; height: 1100px; margin: -550px 0 0 -550px; border-radius: 50%; pointer-events: none; will-change: transform, opacity;
          background: radial-gradient(closest-side, rgba(255,150,60,.42), rgba(255,110,30,.16) 45%, rgba(255,110,30,0) 100%); mix-blend-mode: screen; opacity: 0; }
        #chill .ch-twine, #chill .ch-liq, #chill .ch-bloom, #chill .ch-pipes { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }
        #chill .ch-pipes { z-index: 1; }
        #chill .ch-hot, #chill .ch-liq { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }
        #chill .ch-liq { z-index: 3; mix-blend-mode: overlay; opacity: 1; }
        #chill .ch-hot { z-index: 3; mix-blend-mode: screen; }
        #chill .ch-bloom { z-index: 1; mix-blend-mode: screen; opacity: .0; filter: blur(14px); will-change: transform, opacity; }
        #chill .ch-liq, #chill .ch-hot { filter: blur(6px); will-change: transform; }
        ${LITE ? `#chill .ch-liq, #chill .ch-hot { filter: none; will-change: auto; }` : ""}
        #chill .ch-rig { position: absolute; left: 0; top: 0; width: 1440px; height: 900px; transform-origin: ${ORIGIN[0]}px ${ORIGIN[1]}px; }
        #chill .ch-tack { position: absolute; z-index: 3; width: 18px; height: 18px; margin: -9px; border-radius: 50%; background: radial-gradient(circle at 38% 32%, #fff 0 18%, #e7e2d9 20% 55%, #b5afa5 70%); box-shadow: 3px 5px 6px rgba(0,0,0,.35); }
        #chill .ch-collar { position: absolute; z-index: 3; width: 20px; height: 64px; border-radius: 4px; background: linear-gradient(90deg, #8a6420, #e2b860 40%, #b88a32 70%, #7a561a); box-shadow: 3px 6px 8px rgba(0,0,0,.35); }
        #chill .ch-collar--h { width: 62px; height: 18px; z-index: 1; background: linear-gradient(#e2b860, #b88a32 60%, #7a561a); }
        #chill .ch-gauge { position: absolute; z-index: 4; width: 0; height: 0; }
        #chill .ch-face { position: absolute; left: -30px; top: -30px; width: 60px; height: 60px; border-radius: 50%; background: radial-gradient(closest-side, #e6cfb6 0 80%, rgba(230,207,182,0) 100%); }
        #chill .ch-needle { position: absolute; left: -2px; top: -27px; width: 4px; height: 30px; transform-origin: 2px 27px; will-change: transform; }
        #chill .ch-needle s { position: absolute; inset: 0; background: #2a1d17; clip-path: polygon(50% 0, 100% 85%, 100% 100%, 0 100%, 0 85%); transform-origin: 2px 27px; }
        #chill .ch-hub { position: absolute; left: -5px; top: -5px; width: 10px; height: 10px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #f1d48a, #9a7424); box-shadow: 1px 2px 2px rgba(0,0,0,.4); }
        #chill .ch-wheel { position: absolute; z-index: 4; border-radius: 50%; will-change: transform; background-image: url(img/chiller.webp); background-repeat: no-repeat; }
        #chill .ch-temp { position: absolute; z-index: 4; left: 748px; top: 812px; display: flex; align-items: baseline; gap: 6px; padding: 8px 14px 10px; background: #f3ead8; color: #2b1a12; rotate: -3deg;
          font: 800 11px Archivo, sans-serif; letter-spacing: .12em; text-transform: uppercase; filter: drop-shadow(calc(var(--lx) * 3px) calc(var(--ly) * 5px) 3px rgba(0,0,0,.35)) drop-shadow(calc(var(--lx) * 12px) calc(var(--ly) * 18px) 12px rgba(0,0,0,.25)); }
        #chill .ch-temp b { font: 400 30px/1 "Archivo Black", sans-serif; letter-spacing: -.02em; color: #c0461c; min-width: 2.3em; text-align: right; }
        #chill .ch-tags { position: absolute; inset: 0; z-index: 6; pointer-events: none; }
        #chill .ch-tw { position: absolute; left: calc(var(--x) * 1px); top: calc(var(--y) * 1px); width: 0; height: 0; transform-origin: 0 0; }
        #chill .ch-swing { position: absolute; left: 0; top: 0; transform-origin: 0 0; will-change: transform;
          filter: drop-shadow(calc(var(--lx) * 2px) calc(var(--ly) * 3px) 2px rgba(0,0,0,.35)) drop-shadow(calc(var(--lx) * 14px) calc(var(--ly) * 22px) 12px rgba(0,0,0,.28)); }
        #chill .ch-str { position: absolute; left: -1px; top: 0; width: 2px; height: calc(var(--len) + 14px); background: #efe6d6; z-index: 2; }
        #chill .ktag { position: absolute; left: 0; top: var(--len); transform: translateX(-50%); white-space: nowrap; filter: none;
          padding: 28px 20px 13px; font-size: 15px; letter-spacing: .05em;
          clip-path: polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%, 0 16px);
          background-image: linear-gradient(100deg, rgba(255,255,255,.22), rgba(255,255,255,0) 40%, rgba(0,0,0,.06) 41%, rgba(0,0,0,0) 70%); }
        #chill .ktag::before { left: 50%; top: 14px; width: 9px; height: 9px; margin: 0 0 0 -4.5px; background: #3a2a22; box-shadow: 0 0 0 4px rgba(255,255,255,.45); }
        #chill .ch-note { position: absolute; z-index: 5; left: 1268px; top: 760px; margin: 0; font: 700 15px/1.35 Archivo, sans-serif; color: #f2c14e; rotate: -4deg; opacity: 0; }
        #chill .kb-label { max-width: min(420px, 31vw); }
        @media (max-height: 650px) and (min-aspect-ratio: 1/1) { #chill .kb-label { max-width: min(340px, 27vw); } }   /* short desktops: clear of the twine tags */
        /* phones in landscape: shrink the rig to the right so the label doesn't sit on the coil */
        @media (max-height: 500px) and (min-aspect-ratio: 1/1) {
          #chill .ch-rig { transform: translate(190px, -80px) scale(.66); }
          #chill .ch-note { display: none; }
          #chill .ch-tags, #chill .ch-twine, #chill .ch-tack { translate: 0 110px; } /* the twine hung behind the header */
        }
        @media (max-aspect-ratio: 1/1) {
          #chill .ch-rig { transform: translateY(90px) scale(.43); }
          #chill .ch-twine, #chill .ch-tack, #chill .ch-note { display: none; }
          #chill .ch-tw { left: calc(var(--mx) * 1px); top: calc(var(--my) * 1px); --len: 0px !important; }
          #chill .ch-str { display: none; }
          #chill .ktag { font-size: 13px; padding: 24px 14px 10px; }
          #chill .ch-temp { left: 760px; top: 905px; scale: 2.1; transform-origin: 0 0; }
        }
      </style>`;
    },
    init: (stage, K, st) => {
      const $ = s => stage.querySelector(s), $$ = s => [...stage.querySelectorAll(s)];
      const head = $("#ch-head"), trail = $("#ch-trail"), flow = $("#ch-flow"), bloom = $("#ch-bloomp") || document.createElementNS("http://www.w3.org/2000/svg", "path"), heat = $("#ch-heat");
      const rig = $(".ch-rig"), box = $(".kbox"), deg = $("#ch-deg"), needles = [$("#ch-n0"), $("#ch-n1")], wheelsEl = [$("#ch-w0"), $("#ch-w1")];
      const tagEls = $$(".ch-tw");
      const LT = head.getTotalLength(), HEAD = 190;
      const warm = $("#ch-warm"), HOT = 820;
      warm.style.strokeDasharray = `${LT} ${LT}`; trail.style.strokeDasharray = `${HOT} ${LT}`;
      const core = $("#ch-core");
      bloom.style.strokeDasharray = head.style.strokeDasharray = `${HEAD} ${LT}`; core.style.strokeDasharray = `${HEAD * .6} ${LT}`;

      // visible portion of the path depends on rig scale (portrait shrinks the rig)
      // rig → box mapping (portrait screens shrink/shift the rig via CSS)
      const map = () => { const rb = rig.getBoundingClientRect(), bb = box.getBoundingClientRect(), sc = bb.width / 1440;
        return { r: rb.width / bb.width, ox: (rb.left - bb.left) / sc, oy: (rb.top - bb.top) / sc }; };
      const range = () => { const m = map(), top = -m.oy / m.r, bot = (900 - m.oy) / m.r;
        return [Math.max(0, top - TOP - 40), LT - Math.max(0, BOTTOM - bot - 40)]; };
      const toBox = ([x, y]) => { const m = map(); return [m.ox + x * m.r, m.oy + y * m.r]; };
      const pt = l => { const p = head.getPointAtLength(Math.max(0, Math.min(LT, l))); return [p.x, p.y]; };

      const s = { len: 0 };
      let lastL = NaN;
      const render = (force) => {
        const L = s.len, [a, b] = range();
        // PERF: the scrub tween fires onUpdate every tick while easing; skip identical frames (each one repaints the coil)
        if (L === lastL && force !== true) return; lastL = L;
        warm.style.strokeDashoffset = LT - L; trail.style.strokeDashoffset = -(L - HOT);
        head.style.strokeDashoffset = bloom.style.strokeDashoffset = -(L - HEAD); core.style.strokeDashoffset = -(L - HEAD * .75);
        const k = Math.max(0, Math.min(1, (L - a) / (b - a)));
        head.setAttribute("stroke", gsap.utils.interpolate("#ff8a2a", "#ffc451", k));
        trail.setAttribute("stroke", gsap.utils.interpolate("#ff5a10", "#ffb02e", k));
        deg.textContent = Math.round(98 - 78 * gsap.parseEase("power1.inOut")(k)) + "°";
        const [hx, hy] = toBox(pt(L - HEAD * .5));
        gsap.set(heat, { x: hx, y: hy, opacity: L > a && L < b + 200 ? .55 + .45 * (1 - k) : 0 });
      };
      const setFinal = () => { s.len = range()[1] + 400; render(true); gsap.set(heat, { opacity: 0 }); gsap.set(flow, { opacity: .9 });
        gsap.set(needles[0], { rotation: 20 }); gsap.set(needles[1], { rotation: -20 }); };

      // tag start states: they sit inside the coil until popped
      const startPoint = i => { const [a, b] = range(); return toBox(pt(a + (b - a) * (.22 + .085 * i))); };
      const tagRest = el => { const r = el.getBoundingClientRect(), bx = box.getBoundingClientRect(), sc = bx.width / 1440;
        return [(r.left - bx.left) / sc - gsap.getProperty(el, "x"), (r.top - bx.top) / sc - gsap.getProperty(el, "y")]; };

      gsap.set(needles, { rotation: -125 });
      if (K.reduced) { setFinal(); gsap.set(".ch-note", { opacity: 1 }); return; }
      s.len = range()[0]; render(true);

      // idle life: needle jitter, tag sway, liquid shimmer, flowing dashes
      needles.forEach((n, i) => gsap.to(n.firstChild, { rotate: i ? 4 : -4, duration: .09 + i * .03, repeat: -1, yoyo: true, ease: "sine.inOut", repeatRefresh: true }));
      tagEls.forEach((el, i) => gsap.to(el.firstElementChild, { rotate: i % 2 ? 3 : -3, duration: 1.6 + (i % 3) * .4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * .2 }));
      // flowing dashes: only while the cooled flow is actually showing (it is opacity 0 for most of the scene, but the
      // endless dash tween used to repaint the masked coil every frame regardless)
      let off = 0, tl; gsap.ticker.add((t, dt) => { if (!tl || tl.progress() < .82) return;
        off = (off - dt * .133) % 80; flow.style.strokeDashoffset = off.toFixed(1); });
      if (!LITE) gsap.to(".ch-liq", { opacity: .78, duration: 1.3, repeat: -1, yoyo: true, ease: "sine.inOut" });
      CustomWiggle.create("chWig", { wiggles: 5, type: "easeOut" });

      tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { ...st, scrub: 1, invalidateOnRefresh: true, onRefresh: () => render(true) } });
      tl.fromTo(s, { len: () => range()[0] }, { len: () => range()[1] + 300, duration: .92, onUpdate: render }, 0)
        .to(flow, { opacity: .85, duration: .1 }, .82)
        // gauges: inlet one jumps as the hot wort hits, outlet one creeps up later
        .to(needles[1], { rotation: 55, duration: .2, ease: "power2.out" }, .08)
        .to(needles[1], { rotation: -20, duration: .35, ease: "power1.inOut" }, .45)
        .to(needles[0], { rotation: 70, duration: .25, ease: "power2.out" }, .42)
        .to(needles[0], { rotation: 20, duration: .2, ease: "power1.inOut" }, .72)
        // valves crank open
        .to(wheelsEl[1], { rotation: 720, duration: .3, ease: "power2.inOut" }, .02)
        .to(wheelsEl[0], { rotation: -720, duration: .3, ease: "power2.inOut" }, .36)
        .to(".ch-note", { opacity: 1, y: -10, duration: .08 }, .86);
      const cb = $(".ch-bloom"); if (cb) tl.to(cb, { opacity: .55, duration: .08 }, .02).to(cb, { opacity: 0, duration: .08 }, .9);
      // tags pop off the coil where the hot wort currently is, arc up and land on the twine with a wiggle
      tagEls.forEach((el, i) => {
        const t0 = .2 + .085 * i;
        const dx = () => startPoint(i)[0] - tagRest(el)[0], dy = () => startPoint(i)[1] - tagRest(el)[1];
        gsap.set(el, { scale: .15, opacity: 0 });
        tl.set(el, { x: dx, y: dy }, 0)
          .to(el, { opacity: 1, duration: .015 }, t0)
          .to(el, { x: 0, duration: .09, ease: "sine.inOut" }, t0)
          .to(el, { y: 0, duration: .09, ease: "back.out(1.6)" }, t0)
          .fromTo(el, { scale: .15, rotation: -40 }, { scale: 1, rotation: 0, duration: .07, ease: "back.out(2)" }, t0)
          .to(el, { rotation: i % 2 ? -16 : 16, duration: .12, ease: "chWig" }, t0 + .07);
      });
    }
  });
})();
