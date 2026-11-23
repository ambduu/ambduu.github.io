/* 65 · TAPROOM — the portfolio, poured. ("Recent work: real stores, live today")
   After bottling, the run reaches the tasting room. A copper tap tower carries one paper tap handle per STYLE
   (Shopify Plus + 8 industries, from window.WORK). Below it stands one big glass that is also a browser window.
   Scroll walks the tower left → right: a fresh glass slides in, that style's handle is pulled, beer pours (colour per
   style), then the beer clears from the bottom up and leaves the REAL store screenshot behind it, and the domain types
   itself into the browser bar. The pour is quick so the store itself is on show for most of each stop.
   Plain controls for non-technical visitors: labelled store-type buttons (left), a store card with a big
   "Visit store" button and prev/next arrows (right), and "See all 26 stores" → stores.html.
   Everything scroll-driven is a pure function of progress p, rendered by ONE scrubbed timeline. */
(function () {
  const WK = window.WORK, ST = WK.styles, ORDER = WK.order;
  const TOUR = ["abstrax", "dylanlex", "recolution", "blue", "dirtydog", "wearetto", "luxorro", "monte", "vics"]; // one per tap, left → right
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const seg = (u, a, b) => clamp((u - a) / (b - a));
  const ease = t => t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
  const styleOf = w => w.plus ? 0 : ST.findIndex(s => s.id === w.ind);

  // decorative tap handles (mouse/touch can still pull them; keyboard + screen readers use the labelled buttons)
  const tapHTML = (s, i) => `<button class="tp-tap" type="button" data-s="${i}" tabindex="-1" aria-hidden="true" style="--h1:${s.handle[0]};--h2:${s.handle[1]};--beer:${s.beerCol}">
      <span class="tp-handle"><b>${esc(s.short || s.label)}</b><i>${s.stores.length}</i></span>
      <span class="tp-fau"></span><span class="tp-stream"></span></button>`;
  const pickHTML = (s, i) => `<button class="tp-pk" type="button" data-s="${i}" aria-pressed="false" style="--pc:${s.col}">${esc(s.name)} <sup>${s.stores.length}</sup></button>`;

  // section heading: kicker / title / one sentence (uses kit's kicker if it has one, else adds its own)
  const KICK = "Recent work";
  const heading = K => {
    const h = K.label({ kicker: KICK, title: "Real stores, live today", href: "stores.html", left: "0", top: "0",
      text: "Every glass below is a real Shopify store Germanjit has worked on. Pick a store type, or scroll to pour the next one." });
    return h.includes(KICK) ? h : `<p class="tp-kick">${KICK}</p>` + h;
  };

  SCENES.push({
    id: "taproom", order: 65, height: 420, bg: "#3b2216", headerTone: "light",
    nav: { label: "Recent work", href: "stores.html" },
    html: (K) => K.box(`
        <div class="tp-wall"></div>
        ${K.img("hop", { x: 40, y: -120, w: 150, depth: 1, id: "tp-hop1", rot: 8, z: 1 })}
        ${K.img("hop", { x: 1270, y: -150, w: 140, depth: 1, id: "tp-hop2", rot: -10, z: 1 })}
      `, { focus: 50 }) + `
      <div class="tp-room">
        <div class="tp-copy">
          ${heading(K)}
          <div class="tp-picks" role="group" aria-label="Show a store by type">${ST.map(pickHTML).join("")}</div>
          <a class="tp-all" href="stores.html">See all ${WK.stores.length} stores <i>→</i></a>
        </div>
        <div class="tp-tower" aria-hidden="true"><i class="tp-bar"></i><div class="tp-taps">${ST.map(tapHTML).join("")}</div></div>
        <div class="tp-glass-wrap">
          <figure class="tp-glass">
            <div class="tp-chrome" aria-hidden="true"><i></i><i></i><i></i><span class="tp-url"><em class="tp-lock">●</em><span class="tp-dom"></span></span></div>
            <div class="tp-view">
              <img class="tp-shot" alt="" decoding="async">
              <div class="tp-beer"><i class="tp-head"></i><span class="tp-bub"></span><span class="tp-bub b2"></span><span class="tp-bub b3"></span></div>
              <i class="tp-line"></i><i class="tp-sheen"></i>
              <a class="tp-viewlink" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"></a>
            </div>
          </figure>
          <i class="tp-coaster"></i>
        </div>
        <div class="tp-counter"><i></i></div>
        <img class="tp-trav ks d3" src="img/bottle.webp" alt="" draggable="false">
        <aside class="tp-tkt" aria-label="Store on show">
          <small class="tp-tno">Store <span class="tp-n">1</span> of ${ORDER.length}</small>
          <h3 class="tp-name">—</h3>
          <div class="tp-meta"><span class="tp-ind"></span><span class="tp-plus" hidden>Shopify Plus</span></div>
          <p class="tp-note"></p>
          <div class="tp-act">
            <button class="tp-arr tp-prev" type="button" aria-label="Previous store">←</button>
            <a class="tp-visit" target="_blank" rel="noopener"><span>Visit store <i>→</i></span><small class="tp-vdom"></small></a>
            <button class="tp-arr tp-next" type="button" aria-label="Next store">→</button>
          </div>
          <span class="tp-sr" aria-live="polite"></span>
        </aside>
      </div>
      <style>
        #taproom .jstage { background: #3b2216; }
        .tp-wall { position: absolute; inset: -300px -500px; z-index: 0;
          background:
            radial-gradient(ellipse 700px 460px at 720px 470px, rgba(255,214,140,.22), transparent 70%),
            repeating-linear-gradient(90deg, rgba(0,0,0,0) 0 118px, rgba(0,0,0,.22) 118px 120px),
            repeating-linear-gradient(90deg, #4a2b1b 0 40px, #452819 40px 80px, #4d2e1d 80px 120px); }
        .tp-room { position: absolute; inset: 0; z-index: 5;
          --tt: max(88px, 12vh); --taph: clamp(54px, 11vh, 130px); --gtop: calc(var(--tt) + var(--taph) + 92px);
          --gw: min(40vw, calc((100vh - var(--gtop) - 70px) * 1.6)); }
        /* copy + plain controls (left) */
        .tp-copy { position: absolute; left: 4vw; top: max(96px, 13vh); width: min(24vw, 360px); }
        .tp-copy .kb-label { position: relative; left: auto !important; top: auto !important; display: block; max-width: none; font-size: clamp(28px, 3.1vw, 50px); color: #fff6e2 !important; }
        .tp-copy .kb-label small { margin-top: 10px; font-size: clamp(13.5px, 1.05vw, 16px); color: #f3e3c4 !important; }
        .tp-kick { margin: 0 0 8px; font: 800 12px/1 Archivo, sans-serif; letter-spacing: .2em; text-transform: uppercase; color: #ffe27a; }
        .tp-picks { display: flex; flex-wrap: wrap; gap: 7px; margin-top: clamp(14px, 2.4vh, 24px); }
        .tp-pk { display: inline-flex; align-items: center; gap: 5px; min-height: 36px; padding: 6px 11px 6px 9px; border: 0; border-left: 5px solid var(--pc); border-radius: 4px;
          background: #fbf3e2; color: #2b1a12; font: 700 13.5px/1.1 Archivo, sans-serif; cursor: pointer; box-shadow: 0 2px 0 rgba(0,0,0,.25); transition: transform .15s, background .15s; }
        .tp-pk sup { font-size: 10.5px; font-weight: 800; color: #8a5124; vertical-align: 0; }
        .tp-pk:hover { background: #ffe27a; transform: translateY(-2px); }
        .tp-pk[aria-pressed="true"] { background: #2b1a12; color: #ffe27a; box-shadow: 0 0 0 2px #ffe27a; }
        .tp-pk[aria-pressed="true"] sup { color: #ffe27a; }
        .tp-pk:focus-visible, .tp-arr:focus-visible, .tp-visit:focus-visible, .tp-all:focus-visible { outline: 3px solid #ffe27a; outline-offset: 3px; }
        .tp-all { display: inline-block; margin-top: clamp(14px, 2.4vh, 22px); padding: 2px 0; color: #ffe27a; font: 800 clamp(15px, 1.2vw, 18px) Archivo, sans-serif; text-decoration: none; border-bottom: 2px solid currentColor; }
        .tp-all i { font-style: normal; display: inline-block; transition: transform .25s; } .tp-all:hover i { transform: translateX(5px); }
        /* tower (decoration) */
        .tp-tower { position: absolute; z-index: 2; left: 50%; top: var(--tt); width: calc(var(--gw) + 16px); transform: translateX(-50%); }
        .tp-bar { position: absolute; left: 0; right: 0; top: calc(var(--taph) + 4px); height: 26px; border-radius: 13px;
          background: linear-gradient(180deg, #e3995a 0 20%, #c97a3a 20% 55%, #8a4418 55%); box-shadow: 0 3px 0 rgba(0,0,0,.25), 10px 22px 22px rgba(0,0,0,.35); }
        .tp-taps { position: relative; display: flex; justify-content: space-between; padding: 0 12px; }
        .tp-tap { position: relative; flex: 0 0 auto; width: calc((var(--gw) - 8px) / 9 - 4px); height: calc(var(--taph) + 70px); padding: 0; border: 0; background: none; cursor: pointer; -webkit-tap-highlight-color: transparent; }
        .tp-handle { position: absolute; left: 50%; bottom: 66px; width: 78%; height: var(--taph); margin-left: -39%; transform-origin: 50% 100%; border-radius: 12px 12px 6px 6px;
          background: linear-gradient(90deg, rgba(0,0,0,.18), rgba(255,255,255,.18) 35%, rgba(0,0,0,0) 60%, rgba(0,0,0,.22)), linear-gradient(180deg, var(--h2), var(--h1));
          box-shadow: calc(var(--lx) * 3px) calc(var(--ly) * 4px) 3px rgba(0,0,0,.3), calc(var(--lx) * 14px) calc(var(--ly) * 20px) 16px rgba(0,0,0,.3);
          display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 8px 0 6px; transition: filter .2s; }
        .tp-handle b { writing-mode: vertical-rl; transform: rotate(180deg); font: 800 min(clamp(9px, .78vw, 11.5px), calc((var(--taph) - 34px) / 7))/1 Archivo, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #fff6e2; white-space: nowrap; text-shadow: 0 1px 0 rgba(0,0,0,.35); overflow: hidden; text-overflow: ellipsis; max-height: calc(var(--taph) - 34px); }
        .tp-handle i { font: 400 12px/1 "Archivo Black", sans-serif; font-style: normal; color: #2b1a12; background: #fff6e2; border-radius: 50%; width: 22px; height: 22px; display: grid; place-items: center; }
        .tp-tap:hover .tp-handle { filter: brightness(1.12); }
        .tp-tap.on .tp-handle { box-shadow: 0 0 0 3px #ffe27a, calc(var(--lx) * 14px) calc(var(--ly) * 20px) 16px rgba(0,0,0,.3); }
        .tp-fau { position: absolute; left: 50%; bottom: 18px; width: 16px; height: 48px; margin-left: -8px; border-radius: 0 0 6px 6px;
          background: linear-gradient(90deg, #8a4418 0 25%, #e3995a 25% 55%, #a85d22 55%); }
        .tp-fau::before { content: ""; position: absolute; left: -9px; top: -2px; width: 34px; height: 14px; border-radius: 7px; background: linear-gradient(#f0b27a, #a85d22); }
        .tp-stream { position: absolute; left: 50%; top: calc(100% - 20px); width: 10px; margin-left: -5px; height: var(--sl, 200px); transform: scaleY(0); transform-origin: 50% 0; border-radius: 4px;
          background: repeating-linear-gradient(180deg, var(--beer) 0 10px, color-mix(in srgb, var(--beer) 75%, #fff) 10px 20px); background-size: 100% 20px; animation: trflow .3s linear infinite; pointer-events: none; z-index: 1; box-shadow: 0 0 0 1px rgba(255,255,255,.15); }
        @keyframes trflow { to { background-position: 0 20px; } }
        /* the glass / browser */
        .tp-glass-wrap { position: absolute; left: 50%; top: var(--gtop); width: var(--gw); margin-left: calc(var(--gw) / -2); }
        .tp-glass { margin: 0; position: relative; background: #fff6e2; padding: 0 8px 8px; border-radius: 6px 6px 14px 14px; will-change: transform;
          box-shadow: calc(var(--lx) * 4px) calc(var(--ly) * 6px) 4px rgba(0,0,0,.3), calc(var(--lx) * 34px) calc(var(--ly) * 50px) 34px rgba(0,0,0,.32); }
        .tp-chrome { display: flex; align-items: center; gap: 6px; height: 36px; padding: 0 4px; }
        .tp-chrome > i { width: 10px; height: 10px; border-radius: 50%; background: #e2463a; } .tp-chrome > i + i { background: #f2c14e; } .tp-chrome > i + i + i { background: #7cc243; }
        .tp-url { flex: 1; min-width: 0; margin-left: 8px; height: 22px; display: flex; align-items: center; gap: 6px; padding: 0 10px; border-radius: 11px; background: #efe2c6; font: 700 12px Archivo, sans-serif; color: #4a3426; white-space: nowrap; overflow: hidden; }
        .tp-lock { font-style: normal; font-size: 8px; color: #6fb43a; }
        .tp-dom::after { content: "▏"; animation: trblink .8s steps(1) infinite; color: #c46a1f; } @keyframes trblink { 50% { opacity: 0; } }
        .tp-view { position: relative; aspect-ratio: 16 / 10; overflow: hidden; border-radius: 0 0 8px 8px; background: linear-gradient(160deg, #fdf7ea, #eadcbf); }
        .tp-shot { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 0; clip-path: inset(var(--rv, 100%) 0 0 0); }
        .tp-viewlink { position: absolute; inset: 0; z-index: 2; cursor: pointer; }
        .tp-beer { position: absolute; left: 0; right: 0; bottom: 0; height: calc(var(--lv, 0) * 100%); background: linear-gradient(180deg, color-mix(in srgb, var(--beer, #f2c14e) 80%, #fff) 0, var(--beer, #f2c14e) 30%, color-mix(in srgb, var(--beer, #f2c14e) 80%, #000) 100%);
          clip-path: inset(0 0 var(--cl, 0%) 0); }
        .tp-head { position: absolute; left: -4%; right: -4%; top: -16px; height: 22px; border-radius: 50%; background:
          radial-gradient(circle at 12% 60%, #fff 0 9px, transparent 10px), radial-gradient(circle at 34% 40%, #fff 0 11px, transparent 12px), radial-gradient(circle at 58% 55%, #fff 0 10px, transparent 11px), radial-gradient(circle at 82% 45%, #fff 0 12px, transparent 13px), #fff6e2; }
        .tp-bub { position: absolute; left: 20%; bottom: 0; width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,.55); animation: trbub 1.8s linear infinite; }
        .tp-bub.b2 { left: 52%; animation-delay: -.7s; width: 5px; height: 5px; } .tp-bub.b3 { left: 78%; animation-delay: -1.2s; }
        @keyframes trbub { from { transform: translateY(0); opacity: 0; } 15% { opacity: 1; } to { transform: translateY(-420px); opacity: 0; } }
        .tp-line { position: absolute; left: 0; right: 0; height: 14px; top: calc(100% - var(--ln, 0%) - 7px); opacity: var(--lo, 0); pointer-events: none;
          background: radial-gradient(circle at 10% 50%, #fff 0 4px, transparent 5px) 0 0 / 34px 14px, radial-gradient(circle at 60% 40%, rgba(255,255,255,.8) 0 3px, transparent 4px) 0 0 / 22px 14px; }
        .tp-sheen { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(105deg, rgba(255,255,255,0) 0 55%, rgba(255,255,255,.22) 60%, rgba(255,255,255,0) 68%); }
        .tp-coaster { position: absolute; left: 50%; bottom: -26px; width: 70%; height: 30px; margin-left: -35%; z-index: -1; border-radius: 50%; background: #2b1a12; opacity: .4; filter: blur(6px); }
        .tp-counter { position: absolute; left: 0; right: 0; bottom: 0; height: 9vh; z-index: -1;
          background: linear-gradient(180deg, #e0a868 0 8px, #a86d36 8px 20px, #6a3b16 20px), repeating-linear-gradient(90deg, transparent 0 180px, rgba(0,0,0,.15) 180px 183px); }
        .tp-trav { position: absolute; left: 1.5vw; bottom: 7vh; width: auto; height: 18vh; z-index: 2; transform-origin: 50% 100%; }
        /* store card (right) */
        .tp-tkt { position: absolute; right: 3.5vw; top: var(--gtop); width: min(max(22vw, 290px), 340px); padding: 18px 18px 16px; background: #fbf3e2; color: #2b1a12; transform: rotate(.8deg);
          box-shadow: 0 2px 3px rgba(0,0,0,.25), 14px 24px 34px rgba(0,0,0,.35); }
        .tp-tkt::before { content: ""; position: absolute; left: 50%; top: -12px; width: 90px; height: 24px; margin-left: -45px; background: rgba(242,193,78,.75); transform: rotate(-3deg); }
        .tp-tno { display: block; font: 800 11px Archivo, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #a8561a; }
        .tp-name { margin: 8px 0 8px; font: 400 clamp(22px, 2.1vw, 34px)/1 "Archivo Black", sans-serif; text-transform: uppercase; overflow-wrap: anywhere; }
        .tp-meta { display: flex; flex-wrap: wrap; gap: 6px; }
        .tp-meta span { display: inline-block; padding: 4px 9px; font: 800 11px Archivo, sans-serif; letter-spacing: .12em; text-transform: uppercase; }
        .tp-ind { border: 2px solid var(--sc, #2f5a4e); color: #2b1a12; background: color-mix(in srgb, var(--sc, #2f5a4e) 16%, #fbf3e2); }
        .tp-plus { background: #7c171b; color: #fff6e2; border: 2px solid #7c171b; }
        .tp-plus[hidden] { display: none !important; }
        .tp-note { margin: 12px 0 0; font: 600 clamp(13.5px, 1.05vw, 15.5px)/1.5 Archivo, sans-serif; color: #3d2a1f; }
        .tp-act { display: flex; gap: 8px; align-items: stretch; margin-top: 16px; }
        .tp-visit { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px 10px 8px; background: #2b1a12; color: #ffe27a; text-decoration: none; border-radius: 4px; text-align: center; box-shadow: 0 3px 0 #c46a1f; transition: background .15s, transform .15s; }
        .tp-visit span { font: 400 clamp(15px, 1.25vw, 20px)/1 "Archivo Black", sans-serif; text-transform: uppercase; letter-spacing: .02em; white-space: nowrap; }
        .tp-visit i { font-style: normal; display: inline-block; transition: transform .2s; }
        .tp-visit small { margin-top: 4px; font: 700 11.5px Archivo, sans-serif; color: #f3e3c4; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .tp-visit:hover { background: #c46a1f; transform: translateY(-2px); } .tp-visit:hover i { transform: translateX(4px); } .tp-visit:hover small { color: #fff; }
        .tp-arr { flex: none; width: 42px; border: 2px solid #2b1a12; border-radius: 4px; background: #fbf3e2; color: #2b1a12; font: 800 20px/1 Archivo, sans-serif; cursor: pointer; transition: background .15s; }
        .tp-arr:hover { background: #ffe27a; }
        .tp-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
        @media (max-height: 700px) and (min-width: 761px) { .tp-trav { display: none; } .tp-tkt { padding: 14px 16px 14px; } .tp-note { margin-top: 9px; } .tp-act { margin-top: 12px; } }
        /* phones: stacked — heading, type buttons (swipe row), taps, the glass, store card */
        @media (max-width: 760px) {
          .tp-room { --tt: 196px; --taph: 38px; --cardh: 136px; --gtop: calc(var(--tt) + var(--taph) + 58px);
            --gw: min(calc(100vw - 32px), calc((100vh - var(--gtop) - var(--cardh) - 40px) * 1.6)); }
          .tp-copy { left: 16px; right: 16px; top: 64px; width: auto; }
          .tp-kick { margin-bottom: 0; font-size: 11px; line-height: 30px; }
          .tp-copy .kb-label { font-size: 24px; } .tp-copy .kb-label small { display: none; }
          .tp-picks { flex-wrap: nowrap; overflow-x: auto; margin: 10px -16px 0; padding: 2px 16px 6px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
          .tp-picks::-webkit-scrollbar { display: none; }
          .tp-pk { flex: none; min-height: 34px; font-size: 13px; padding: 5px 10px 5px 8px; }
          .tp-all { position: absolute; right: 0; top: 4px; margin: 0; padding: 0; font-size: 13px; line-height: 20px; }
          .tp-taps { padding: 0 6px; }
          .tp-tap { height: calc(var(--taph) + 50px); }
          .tp-handle { bottom: 50px; width: 86%; margin-left: -43%; padding: 4px 0 3px; } .tp-handle b { display: none; } .tp-handle i { width: 16px; height: 16px; font-size: 9px; }
          .tp-fau { height: 34px; bottom: 16px; } .tp-fau::before { left: -7px; width: 30px; height: 12px; }
          .tp-chrome { height: 28px; } .tp-chrome > i { width: 8px; height: 8px; } .tp-url { font-size: 11px; margin-left: 4px; height: 20px; }
          .tp-glass { padding: 0 6px 6px; }
          .tp-tkt { left: 16px; right: 16px; top: auto; bottom: 12px; width: auto; padding: 11px 12px 12px; transform: none; }
          .tp-tkt::before { display: none; }
          .tp-tno { position: absolute; right: 12px; top: 13px; font-size: 10px; letter-spacing: .1em; }
          .tp-name { font-size: 20px; margin: 0 0 6px; padding-right: 92px; }
          .tp-meta span { font-size: 10px; padding: 3px 7px; }
          .tp-note { display: none; }
          .tp-act { margin-top: 10px; } .tp-arr { width: 44px; } .tp-visit { padding: 8px 8px 6px; } .tp-visit span { font-size: 16px; }
          .tp-trav { display: none; }
          .tp-counter { height: 7vh; }
        }
        /* taller phones have room for the sentence + the case line */
        @media (max-width: 760px) and (min-height: 780px) {
          .tp-room { --tt: 238px; --cardh: 196px; }
          .tp-copy .kb-label small { display: block; margin-top: 8px; font-size: 13.5px; }
          .tp-note { display: block; margin-top: 8px; font-size: 13.5px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        }
      </style>`,

    init: (stage, K, st) => {
      const $ = s => stage.querySelector(s);
      const taps = [...stage.querySelectorAll(".tp-tap")], streams = taps.map(t => t.querySelector(".tp-stream")), handles = taps.map(t => t.querySelector(".tp-handle"));
      const picks = [...stage.querySelectorAll(".tp-pk")];
      const glass = $(".tp-glass"), view = $(".tp-view"), shot = $(".tp-shot"), dom = $(".tp-dom"), vlink = $(".tp-viewlink");
      const tName = $(".tp-name"), tInd = $(".tp-ind"), tPlus = $(".tp-plus"), tNote = $(".tp-note"), tNo = $(".tp-n"),
        visit = $(".tp-visit"), vdom = $(".tp-vdom"), sr = $(".tp-sr"), trav = $(".tp-trav");
      const tour = TOUR.map(k => WK.byKey[k]);
      let shown = null, manual = null, manualY = 0, pickS = -1;
      // warm the cache so a pour never reveals a half-loaded screenshot
      const warm = w => { if (w && !w._warm) { w._warm = 1; const i = new Image(); i.decoding = "async"; i.src = w.img; } };

      // stream length: from faucet tip down to the glass's view top
      let base = [], vH = 300;
      const measure = () => { const g = view.getBoundingClientRect(); vH = g.height;
        base = taps.map(t => { const a = t.getBoundingClientRect(); return g.top - (a.bottom - 20); }); };

      function setStore(w, si = styleOf(w)) {
        if (shown === w) return; shown = w;
        const s = ST[styleOf(w)];
        shot.src = w.img; shot.alt = `Screenshot of the live ${w.name} store`;
        view.style.setProperty("--beer", s.beerCol);
        visit.href = vlink.href = w.url; visit.setAttribute("aria-label", `Visit the ${w.name} store (${w.domain}, opens in a new tab)`);
        vdom.textContent = w.domain;
        tName.textContent = w.name;
        tInd.textContent = WK.indFor(w); tInd.style.setProperty("--sc", w.ind ? ST[ST.findIndex(x => x.id === w.ind)].col : s.col);
        tPlus.hidden = !(w.plus && w.ind);           // Plus badge next to the industry (Plus-only stores already say "Shopify Plus")
        tNote.textContent = WK.caseFor(w);
        tNo.textContent = ORDER.indexOf(w) + 1;
        taps.forEach((t, i) => t.classList.toggle("on", i === si));
        pickS = si; picks.forEach((b, i) => b.setAttribute("aria-pressed", String(i === si)));
        const oi = ORDER.indexOf(w); warm(ORDER[(oi + 1) % ORDER.length]); warm(ORDER[(oi - 1 + ORDER.length) % ORDER.length]);
      }
      // the whole pour as a pure function of local progress u (0..1) for store w.
      // Timing: glass lands by .06, pour .08–.28, beer clears .30–.44, store on show .44–.96 (over half of every stop).
      function render(w, u, { slideIn = true, slideOut = true, si = styleOf(w) } = {}) {
        setStore(w, si);
        const xin = slideIn ? 1 - ease(seg(u, 0, .06)) : 0, xout = slideOut ? ease(seg(u, .96, 1)) : 0;
        glass.style.transform = `translateX(${(-xin * 120 + xout * 120).toFixed(2)}vw) rotate(${(xin * -4 + xout * 4).toFixed(2)}deg)`;
        const pull = seg(u, .04, .09) - seg(u, .26, .31);
        handles.forEach((h, i) => h.style.transform = i === si ? `rotate(${(pull * 26).toFixed(2)}deg)` : "");
        const on = seg(u, .07, .1), off = seg(u, .27, .3), lv = ease(seg(u, .08, .28));
        if (base[si] != null) streams[si].style.height = (base[si] + (1 - lv) * vH + 8).toFixed(0) + "px";
        streams.forEach((s, i) => { s.style.transform = i === si ? `scaleY(${(on * (1 - off)).toFixed(3)})` : "scaleY(0)"; s.style.transformOrigin = off > 0 ? "50% 100%" : "50% 0"; });
        const c = ease(seg(u, .3, .44));
        view.style.setProperty("--lv", lv.toFixed(3));
        view.style.setProperty("--cl", (c * 100).toFixed(1) + "%");      // beer clears from the bottom…
        view.style.setProperty("--rv", ((1 - c) * 100).toFixed(1) + "%"); // …revealing the real store underneath
        view.style.setProperty("--ln", (c * 100).toFixed(1) + "%");
        view.style.setProperty("--lo", c > 0 && c < 1 ? 1 : 0);
        const n = Math.round(seg(u, .36, .46) * w.domain.length); dom.textContent = w.domain.slice(0, n);
      }

      // scrub: 9 pours (the first glass is already on the bar), traveller bottle in/out at the ends
      const N = tour.length, P0 = .02, P1 = .96;
      const scrub = p => {
        if (manual) return;
        trav.style.transform = `translateY(${(-(1 - ease(seg(p, 0, .05))) * 110 + ease(seg(p, P1, 1)) * 120).toFixed(1)}vh) rotate(${(seg(p, P1, 1) * 30).toFixed(1)}deg)`;
        const q = clamp((p - P0) / (P1 - P0)) * N, i = Math.min(N - 1, Math.floor(q)), u = i === N - 1 && q >= N ? 1 : q - i;
        warm(tour[i + 1]);
        render(tour[i], u, { slideIn: i > 0, slideOut: i < N - 1 });
      };

      // on-demand pours: a store-type button, a tap handle, or prev/next
      const tw = { u: 1 };
      const pourNow = (w, si) => {
        manual = w; manualY = scrollY; warm(w);
        sr.textContent = `Now showing ${w.name}, ${WK.indFor(w)}.`;
        gsap.killTweensOf(tw); tw.u = .08;
        if (K.reduced) { tw.u = .6; render(w, .6, { slideIn: false, slideOut: false, si }); return; }
        gsap.to(tw, { u: .6, duration: 1.5, ease: "none", onUpdate: () => manual === w && render(w, tw.u, { slideIn: false, slideOut: false, si }) });
      };
      const pourStyle = i => {
        const list = ST[i].stores, cur = shown ? list.indexOf(shown) : -1;
        pourNow(list[(cur + 1) % list.length], i);
      };
      const step = d => {
        const oi = ORDER.indexOf(shown), w = ORDER[(oi + d + ORDER.length) % ORDER.length];
        pourNow(w, styleOf(w));
      };
      taps.forEach((t, i) => t.addEventListener("click", () => pourStyle(i)));
      picks.forEach((b, i) => b.addEventListener("click", () => pourStyle(i)));
      $(".tp-prev").addEventListener("click", () => step(-1));
      $(".tp-next").addEventListener("click", () => step(1));
      // scrolling on resumes the scroll-driven tour (after a manual pick has had its moment)
      addEventListener("scroll", () => { if (manual && Math.abs(scrollY - manualY) > Math.max(160, innerHeight * .3)) { manual = null; gsap.killTweensOf(tw); } }, { passive: true });

      measure(); addEventListener("resize", measure);
      if (K.reduced) { render(tour[0], 1, { slideIn: false, slideOut: false }); trav.style.display = "none"; return; }
      gsap.to("#tp-hop1, #tp-hop2", { rotation: "+=4", duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "50% 0" });
      const prog = { p: 0 };
      scrub(0);
      gsap.timeline({ scrollTrigger: { ...st, scrub: .6, onRefresh: measure } })
        .from(".tp-copy > *", { y: 30, opacity: 0, stagger: .005, duration: .02 }, 0)
        .to(prog, { p: 1, duration: 1, ease: "none", onUpdate: () => scrub(prog.p) }, 0);
    }
  });
})();
