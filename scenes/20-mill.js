/* 20 · MILL & MASH — "Custom Themes"
   The barley from the hero drops into the paper mill's hopper. Scroll cranks the wheel (a real rotating cut-out of the
   sprite's wheel, re-projected onto its ellipse), cracked grain pours from the chute into the mash tun, the paddle stirs,
   and five paper "section" recipe cards (Header, Hero, Product grid, Cart drawer, Footer) assemble into a page and slot
   into the tun: Figma → OS 2.0 sections. The mash turns to amber wort and drains down a copper pipe at bottom-centre.
   The mill sprite is split at runtime (canvas) into mill / wheel / hub / tun / paddle layers so parts can move.
   World coords: mill native px + (500,100); tun native px + (178,513). The camera pans the world up by 450px. */
SCENES.push({
  id: "mill", order: 20, height: 220, bg: "#f1e3c5", headerTone: "dark",
  nav: { label: "Custom Themes", href: "themes.html" },
  html: (K) => {
    const cards = [
      ["Header", "header.liquid", `<i class="ml-logo"></i><i class="ml-nav"></i><i class="ml-nav"></i><i class="ml-nav"></i><i class="ml-bag"></i>`],
      ["Hero", "hero-banner.liquid", `<i class="ml-pic"><i class="ml-sun"></i><i class="ml-mtn"></i></i><i class="ml-h1"></i><i class="ml-p"></i><i class="ml-btn"></i>`],
      ["Product grid", "main-collection.liquid", `<i class="ml-tile"></i><i class="ml-tile"></i><i class="ml-tile"></i><i class="ml-tile"></i>`],
      ["Cart drawer", "cart-drawer.liquid", `<i class="ml-dim"></i><i class="ml-drawer"><i class="ml-row"></i><i class="ml-row"></i><i class="ml-co"></i></i>`],
      ["Footer", "footer.liquid", `<i class="ml-col"></i><i class="ml-col"></i><i class="ml-col"></i><i class="ml-news"></i>`]
    ].map(([t, f, wf], i) => `<div class="ml-card ml-c${i} d2" data-i="${i}"><b>${t}</b><em>sections/${f}</em><div class="ml-wf ml-wf${i}">${wf}</div></div>`).join("");
    const kernels = Array.from({ length: 30 }, (_, i) => `<i class="ml-k" data-i="${i}"></i>`).join("");
    const grist = Array.from({ length: 46 }, (_, i) => `<i class="ml-g" style="--s:${(6 + (i * 37 % 10)).toFixed(0)}px;--c:${["#e9c478", "#f6dfa4", "#d9a24a", "#c98c35", "#fff1cf"][i % 5]};--cp:${["polygon(0 20%,80% 0,100% 70%,30% 100%)", "polygon(10% 0,100% 30%,70% 100%,0 80%)", "polygon(0 0,100% 40%,40% 100%)"][i % 3]}"></i>`).join("");
    const art = `
      <div class="ml-world">
        <div class="ml-millg d2">
          <canvas id="ml-mill" class="ks" width="546" height="722" style="left:500px;top:100px;width:546px;z-index:2"></canvas>
          <img class="ks" src="img/mill-ring.webp" alt="" style="left:580px;top:268px;width:226px;z-index:3">
          <canvas id="ml-wheel" class="ks" width="560" height="780" style="left:560px;top:260px;width:280px;z-index:4"></canvas>
          <img class="ks" src="img/mill-cap.webp" alt="" style="left:628px;top:412px;width:70px;z-index:5">
          <img id="ml-handle" class="ks" src="img/mill-handle.webp" alt="" style="left:500px;top:498px;width:132px;z-index:6">
          <button class="ml-crank" aria-label="Give the mill a crank" title="Give it a crank"></button>
        </div>
        <div class="ml-hopclip">${K.img("barley", { x: 0, y: 0, w: 74, depth: 2, id: "ml-ear", z: 6 })}${kernels}</div>
        <svg class="ml-stream" viewBox="900 680 100 180" width="100" height="180" aria-hidden="true">
          <defs><linearGradient id="ml-strG" x1="0" x2="1"><stop offset="0" stop-color="#d9a24a"/><stop offset=".45" stop-color="#f6dfa4"/><stop offset="1" stop-color="#c98c35"/></linearGradient></defs>
          <path id="ml-str" d="M921 692 C926 745 933 795 928 846 L950 846 C953 795 962 745 972 692 Z" fill="url(#ml-strG)"/>
          <path d="M934 700 C936 760 940 800 938 846" stroke="#fff3d0" stroke-width="3" fill="none" stroke-dasharray="6 14" id="ml-strL"/>
        </svg>
        <div class="ml-grist" aria-hidden="true">${grist}</div>
        <canvas id="ml-tun" class="ks d2" width="565" height="642" style="left:713px;top:593px;width:565px;z-index:5"></canvas>
        <svg class="ml-mash" viewBox="0 0 376 100" width="376" height="100" aria-hidden="true">
          <defs>
            <clipPath id="ml-open"><ellipse cx="188" cy="43" rx="179" ry="36"/></clipPath>
            <radialGradient id="ml-mashG" cx=".45" cy=".35" r=".7"><stop offset="0" stop-color="#f4e0ad"/><stop offset=".7" stop-color="#e2c07c"/><stop offset="1" stop-color="#c89a52"/></radialGradient>
            <radialGradient id="ml-wortG" cx=".42" cy=".3" r=".75"><stop offset="0" stop-color="#ffd27a"/><stop offset=".55" stop-color="#e9a03a"/><stop offset="1" stop-color="#a95a16"/></radialGradient>
            <pattern id="ml-speck" width="22" height="9" patternUnits="userSpaceOnUse"><ellipse cx="5" cy="3" rx="3.2" ry="1.4" fill="#fff3d4" opacity=".8"/><ellipse cx="16" cy="7" rx="2.6" ry="1.1" fill="#b98a43" opacity=".55"/></pattern>
          </defs>
          <g clip-path="url(#ml-open)">
            <g id="ml-surf">
              <ellipse cx="188" cy="43" rx="181" ry="38" fill="url(#ml-mashG)"/>
              <g id="ml-specks"></g>
              <ellipse id="ml-wort" cx="188" cy="43" rx="181" ry="38" fill="url(#ml-wortG)" opacity="0"/>
              <path id="ml-sheen" d="M70 32 Q150 18 250 26" stroke="#fff3cf" stroke-width="5" stroke-linecap="round" fill="none" opacity="0"/>
              <g id="ml-ripples" fill="none" stroke="#fff3d4" stroke-width="2.5" opacity="0"><ellipse cx="200" cy="44" rx="40" ry="8"/><ellipse cx="200" cy="44" rx="80" ry="16"/></g>
            </g>
          </g>
        </svg>
        <i class="ml-glow" aria-hidden="true"></i>
        <canvas id="ml-paddle" class="ks d1" width="210" height="295" style="left:913px;top:588px;width:210px;z-index:7"></canvas>
        <div class="ml-cards">${cards}</div>
        <div class="ml-frame" aria-hidden="true"><span>Figma file</span></div>
        <svg class="ml-pipe" viewBox="0 0 140 330" width="140" height="330" aria-hidden="true">
          <defs><linearGradient id="ml-cu" gradientUnits="userSpaceOnUse" x1="14" x2="46" y1="0" y2="0"><stop offset="0" stop-color="#7a3a12"/><stop offset=".38" stop-color="#e8a066"/><stop offset=".55" stop-color="#c97a3a"/><stop offset="1" stop-color="#6e3210"/></linearGradient>
            <linearGradient id="ml-cuH" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="14" y2="46"><stop offset="0" stop-color="#e8a066"/><stop offset=".5" stop-color="#c97a3a"/><stop offset="1" stop-color="#6e3210"/></linearGradient>
            <linearGradient id="ml-cuE" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#e8a066"/><stop offset="1" stop-color="#7a3a12"/></linearGradient></defs>
          <path d="M120 30 H46" stroke="url(#ml-cuH)" stroke-width="32" fill="none"/>
          <path d="M30 46 V330" stroke="url(#ml-cu)" stroke-width="32" fill="none"/>
          <path d="M14 46 A32 32 0 0 1 46 14 V46 Z" fill="url(#ml-cuE)"/><path d="M14 46 H46 V14 A32 32 0 0 0 14 46" fill="url(#ml-cuE)"/>
          <rect x="116" y="8" width="16" height="44" rx="3" fill="#b8692d"/>
          <rect x="19" y="128" width="22" height="160" rx="11" fill="#3f1f0c"/>
          <rect id="ml-flow" x="21" y="130" width="18" height="156" rx="9" fill="url(#ml-flowG)" opacity="0"/>
          <linearGradient id="ml-flowG" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffd27a"/><stop offset=".5" stop-color="#e9a03a"/><stop offset="1" stop-color="#ffcf6a"/></linearGradient>
          <rect x="24" y="136" width="4" height="144" rx="2" fill="#fff6e2" opacity=".5"/>
          <rect x="11" y="118" width="38" height="13" rx="3" fill="#d9a43a"/><rect x="11" y="284" width="38" height="13" rx="3" fill="#d9a43a"/>
          <circle cx="84" cy="30" r="20" fill="#d9a43a"/><circle cx="84" cy="30" r="12" fill="#a9771f"/><rect x="79" y="2" width="10" height="56" rx="4" fill="#f0c766" id="ml-valve"/>
        </svg>
        <i class="ml-drop" aria-hidden="true"></i>
        ${K.img("barril-wave", { x: 418, y: 1080, w: 232, depth: 2, id: "ml-barril", z: 9, alt: "" })}
        <p class="ml-hint" aria-hidden="true">Psst: give the crank a spin.</p>
        <div class="ml-say" aria-hidden="true">Wort's ready. Next stop: the boil!</div>
      </div>`;
    return K.box(art, { focus: 61 }) + `
      ${K.svc({ step: 1, brew: "Mill &amp; Mash", title: "Custom Themes", href: "themes.html", cls: "ml-label",
        text: "OS 2.0 themes built from Figma, with sections and blocks your team edits without a ticket." })}
      <style>
        #mill .ml-world { position: absolute; left: 0; top: 0; width: 1440px; height: 1500px; will-change: transform; }
        #mill .ml-millg { position: absolute; inset: 0; }
        #mill #ml-wheel { filter: drop-shadow(calc(var(--lx) * 2px) calc(var(--ly) * 3px) 2px rgba(20,10,0,.32)); }
        #mill .ml-millg img { pointer-events: none; }
        #mill .ml-crank { position: absolute; left: 495px; top: 270px; width: 310px; height: 360px; border: 0; padding: 0; background: none; cursor: grab; z-index: 8; border-radius: 45%; }
        #mill .ml-crank:active { cursor: grabbing; }
        #mill .ml-hopclip { position: absolute; inset: 0; z-index: 6; clip-path: polygon(0 0, 1440px 0, 1440px 141px, 1052px 141px, 655px 133px, 0 133px); }
        #mill #ml-ear { left: 790px; top: -260px; transform-origin: 50% 20%; }
        #mill .ml-k { position: absolute; left: 0; top: 0; width: 20px; height: 30px; z-index: 6; background: url(img/kernel-0.webp) center / 100% 100% no-repeat; }
        #mill .ml-k:nth-child(3n+1) { background-image: url(img/kernel-1.webp); } #mill .ml-k:nth-child(3n+2) { background-image: url(img/kernel-2.webp); }
        .ml-courier { position: fixed; inset: 0; z-index: 40; pointer-events: none; visibility: hidden; }
        .ml-courier .ml-ck { position: absolute; left: -12px; top: -18px; width: 24px; height: 36px; opacity: 0; will-change: transform; background: url(img/kernel-0.webp) center / 100% 100% no-repeat; }
        .ml-courier .ml-ck.v1 { background-image: url(img/kernel-1.webp); } .ml-courier .ml-ck.v2 { background-image: url(img/kernel-2.webp); }
        #mill .ml-stream { position: absolute; left: 900px; top: 680px; z-index: 4; opacity: 0; overflow: visible; }
        #mill .ml-grist { position: absolute; inset: 0; z-index: 4; pointer-events: none; }
        #mill .ml-g { position: absolute; left: 0; top: 0; width: var(--s); height: var(--s); background: var(--c); clip-path: var(--cp); opacity: 0; }
        #mill .ml-mash { position: absolute; left: 727px; top: 790px; z-index: 6; overflow: visible; }
        #mill .ml-glow { position: absolute; left: 700px; top: 700px; width: 430px; height: 260px; z-index: 6; pointer-events: none; opacity: 0; border-radius: 50%;
          background: radial-gradient(closest-side, rgba(255,200,90,.55), rgba(255,180,60,.18) 60%, transparent); mix-blend-mode: screen; }
        #mill .ml-cards { position: absolute; inset: 0; z-index: 8; pointer-events: none;
          clip-path: path("M0 0 H1440 V1500 H1093 V833 A178 36 0 0 1 737 833 V1500 H0 Z"); }
        #mill .ml-card { position: absolute; left: 0; top: 0; width: 250px; height: 150px; padding: 40px 14px 10px; display: flex; flex-direction: column; justify-content: center; background: linear-gradient(170deg, #fffaf0, #f6ead2); border-radius: 3px; color: #2b1a12; transform-origin: 50% 50%; }
        #mill .ml-card::before { content: ""; position: absolute; right: 0; top: 0; width: 22px; height: 22px; background: linear-gradient(225deg, #f1e3c5 50%, #e4d0a6 50%); }
        #mill .ml-card b { position: absolute; left: 14px; top: 9px; font: 800 11px Archivo, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #c46a1f; }
        #mill .ml-card em { position: absolute; left: 14px; top: 24px; font: 600 9px ui-monospace, Menlo, monospace; font-style: normal; color: #9b7f60; }
        #mill .ml-wf { position: relative; display: flex; align-items: center; gap: 8px; }
        #mill .ml-wf i { display: block; flex: none; }
        #mill .ml-wf0 { height: 58px; align-items: flex-start; padding-top: 6px; } #mill .ml-wf0::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 26px; background: repeating-linear-gradient(90deg, #ecd6aa 0 52px, transparent 52px 60px); opacity: .55; } .ml-logo { width: 46px; height: 12px; background: #2b1a12; border-radius: 2px; margin-right: auto; }
        #mill .ml-nav { width: 26px; height: 5px; background: #cdb48a; border-radius: 3px; }
        #mill .ml-bag { width: 16px; height: 16px; border: 3px solid #e9a03a; border-radius: 3px 3px 6px 6px; margin-left: 6px; }
        #mill .ml-wf1 { flex-direction: column; align-items: flex-start; gap: 5px; height: 98px; }
        #mill .ml-pic { position: relative; width: 100%; height: 50px; background: #ecd6aa; overflow: hidden; border-radius: 2px; }
        #mill .ml-sun { position: absolute; right: 26px; top: 12px; width: 18px; height: 18px; border-radius: 50%; background: #e9a03a; }
        #mill .ml-mtn { position: absolute; left: 10px; bottom: 0; width: 150px; height: 36px; background: #c89a52; clip-path: polygon(0 100%, 32% 18%, 52% 62%, 70% 30%, 100% 100%); }
        #mill .ml-h1 { width: 70%; height: 10px; background: #2b1a12; border-radius: 2px; }
        #mill .ml-p { width: 50%; height: 5px; background: #cdb48a; border-radius: 3px; }
        #mill .ml-btn { width: 64px; height: 16px; background: #e9a03a; border-radius: 2px; }
        #mill .ml-wf2 { height: 80px; gap: 7px; }
        #mill .ml-tile { position: relative; flex: 1; height: 72px; background: #ecd6aa; border-radius: 2px; }
        #mill .ml-tile::after { content: ""; position: absolute; left: 0; right: 30%; bottom: -1px; height: 14px; background: linear-gradient(#2b1a12 0 4px, transparent 4px 8px, #e9a03a 8px 12px, transparent 12px); background-color: #f9f0dc; border-top: 3px solid #f9f0dc; }
        #mill .ml-wf3 { height: 92px; }
        #mill .ml-dim { flex: 1; height: 92px; background: repeating-linear-gradient(#e7d6b4 0 5px, transparent 5px 13px); opacity: .7; }
        #mill .ml-drawer { width: 46%; height: 92px; background: #fff; padding: 8px; display: flex !important; flex-direction: column; gap: 7px; box-shadow: -4px 0 8px rgba(80,40,0,.12); }
        #mill .ml-row { height: 18px; background: linear-gradient(90deg, #ecd6aa 0 18px, transparent 18px 24px, #cdb48a 24px 70%, transparent 70%); }
        #mill .ml-co { margin-top: auto; height: 16px; background: #2b1a12; border-radius: 2px; }
        #mill .ml-wf4 { height: 70px; gap: 14px; align-items: flex-end; }
        #mill .ml-col { width: 38px; height: 34px; background: repeating-linear-gradient(#cdb48a 0 4px, transparent 4px 10px); }
        #mill .ml-news { flex: 1; height: 20px; border: 2px solid #cdb48a; border-radius: 2px; }
        #mill .ml-frame { position: absolute; left: 160px; top: 716px; width: 250px; height: 380px; z-index: 7; border: 2px dashed rgba(43,26,18,.28); border-radius: 6px; opacity: 0; }
        #mill .ml-frame span { position: absolute; left: -2px; top: -30px; padding: 5px 10px; background: #2b1a12; color: #f1e3c5; font: 800 11px Archivo, sans-serif; letter-spacing: .12em; text-transform: uppercase; }
        #mill .ml-pipe { position: absolute; left: 690px; top: 1120px; z-index: 6; overflow: visible; filter: drop-shadow(calc(var(--lx) * 4px) calc(var(--ly) * 6px) 4px rgba(20,10,0,.3)) drop-shadow(calc(var(--lx) * 18px) calc(var(--ly) * 26px) 16px rgba(20,10,0,.22)); }
        #mill .ml-drop { position: absolute; left: 703px; top: 1250px; width: 34px; height: 44px; z-index: 7; opacity: 0; border-radius: 50% 50% 50% 50% / 62% 62% 40% 40%;
          background: radial-gradient(circle at 36% 30%, #fff1c0 0 12%, #f4b84a 30%, #d9841c 75%); box-shadow: 0 0 30px 8px rgba(255,190,80,.55); }
        #mill .ml-say { position: absolute; left: 560px; top: 1010px; z-index: 10; padding: 12px 16px; max-width: 220px; background: #fffaf0; color: #2b1a12; font: 700 15px/1.3 Archivo, sans-serif; border-radius: 14px; opacity: 0; transform-origin: 0 100%;
          filter: drop-shadow(calc(var(--lx) * 4px) calc(var(--ly) * 7px) 6px rgba(20,10,0,.25)); }
        #mill .ml-say::after { content: ""; position: absolute; left: 22px; bottom: -12px; border: 12px solid transparent; border-top-color: #fffaf0; border-bottom: 0; border-left: 0; }
        #mill .ml-label { left: 6%; top: max(104px, 14%); }
        #mill .ml-kick { display: block; margin-bottom: 14px; font: 800 13px Archivo, sans-serif; letter-spacing: .16em; text-transform: uppercase; font-style: normal; color: #c46a1f; }
        #mill .ml-hint { position: absolute; z-index: 9; left: 330px; top: 640px; width: 200px; margin: 0; font: 700 14px Archivo, sans-serif; color: #8a6a4a; transform: rotate(-3deg); }
        #mill .ml-hint::before { content: "↻ "; color: #c46a1f; }
        @media (max-aspect-ratio: 1/1) {
          #mill .ml-hint { display: none; }
        }
        @media (max-height: 500px) and (min-aspect-ratio: 1/1) {
        }
      </style>`;
  },
  init: (stage, K, st) => {
    const $ = s => stage.querySelector(s), $$ = s => [...stage.querySelectorAll(s)];
    const world = $(".ml-world"), millG = $(".ml-millg"), paddle = $("#ml-paddle");
    const surf = $("#ml-surf"), wort = $("#ml-wort"), sheen = $("#ml-sheen"), ripples = $("#ml-ripples");
    const cards = $$(".ml-card"), kernels = $$(".ml-k"), grist = $$(".ml-g"), ear = $("#ml-ear");
    const handle = $("#ml-handle"), stream = $(".ml-stream"), strL = $("#ml-strL"); stream.style.transformOrigin = "47px 0";
    const portrait = () => innerWidth / innerHeight < 1;

    /* ---------- the mill as separate layers (built offline from the mill sprite, same light/paper) ----------
       mill-body: mill with the wheel removed and the box side behind it painted in; mill-ring: the rim's static
       thickness (tread on the right, inner face on the left); mill-spokes / mill-hub / mill-rim / mill-arm: FACE-ON
       textures that rotate and are projected onto the wheel's tilted plane; mill-cap: axle end (static);
       mill-handle: crank handle, parallel to the axle, so it orbits the hub without turning. */
    const img = new Image(); img.src = "img/mill-body.webp";
    const TILT = -5, KX = .515, WC = { x: 184, y: 350 }, SC = { x: 194.5, y: 350 }, MOUNT = { x: 118, y: 430 };
    const face = (src) => { const i = new Image(); i.src = "img/" + src + ".webp"; return i; };
    const F = { spokes: face("mill-spokes"), hub: face("mill-hub"), rim: face("mill-rim"), arm: face("mill-arm") };
    const dark = (im, a) => { const c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight;
      const x = c.getContext("2d"); x.drawImage(im, 0, 0); x.globalCompositeOperation = "source-atop"; x.fillStyle = `rgba(52,26,6,${a})`; x.fillRect(0, 0, c.width, c.height); return c; };
    const wcv = $("#ml-wheel"), wx = wcv.getContext("2d"); let WR = null, lastTh = NaN;
    const proj = th => new DOMMatrix().rotate(TILT).scale(KX, 1).rotate(th);
    const mountF = proj(0).inverse().transformPoint({ x: MOUNT.x - WC.x, y: MOUNT.y - WC.y });
    // one rotating face, drawn [image, centre, face radius, screen offset]: the dark copies, nudged along the
    // axle, are the spokes'/hub's/arm's sides, so their thickness always shows on the same side
    const drawWheel = th => {
      if (!WR || th === lastTh) return; lastTh = th;
      const m = proj(th); wx.setTransform(1, 0, 0, 1, 0, 0); wx.clearRect(0, 0, wcv.width, wcv.height);
      WR.forEach(([im, c, R, dx, dy]) => {
        wx.setTransform(2, 0, 0, 2, -120, -320); wx.translate(c.x + dx, c.y + dy);
        wx.transform(m.a, m.b, m.c, m.d, 0, 0); wx.drawImage(im, -R, -R, 2 * R, 2 * R);
      });
      const p = m.transformPoint(mountF), p0 = proj(0).transformPoint(mountF);
      handle.style.transform = `translate(${(p.x - p0.x).toFixed(2)}px, ${(p.y - p0.y).toFixed(2)}px)`;
    };
    Promise.all(Object.values(F).map(i => i.decode())).then(() => {
      WR = [[dark(F.spokes, .62), SC, 150, 5, .6], [F.spokes, SC, 150, 0, 0], [dark(F.hub, .6), SC, 52, 9, .8], [F.hub, SC, 52, 0, 0],
            [F.rim, WC, 178, 0, 0], [dark(F.arm, .62), WC, 178, 4, .4], [F.arm, WC, 178, 0, 0]];
      drawWheel(S.turn + S.spin + 1e-6);
    }).catch(() => {});
    const cut = () => {
      const poly = (c, pts) => { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); };
      const PADDLE = [[896, 76], [944, 94], [846, 300], [834, 352], [744, 364], [762, 318], [814, 296]];
      const m = $("#ml-mill").getContext("2d");
      m.drawImage(img, 0, 0, 546, 722, 0, 0, 546, 722); m.clearRect(540, 270, 10, 460);
      // tun (+ sacks) without the paddle
      const t = $("#ml-tun").getContext("2d");
      t.drawImage(img, 535, 80, 565, 642, 0, 0, 565, 642); t.clearRect(0, 0, 14, 642);
      t.globalCompositeOperation = "destination-out"; t.translate(-535, -80); poly(t, PADDLE); t.fill();
      // paddle on its own
      const p = $("#ml-paddle").getContext("2d"); p.translate(-735, -75); poly(p, PADDLE); p.clip(); p.drawImage(img, 0, 0);
    };
    img.decode().then(cut).catch(() => img.onload = cut);

    /* ---------- live state driven by the scrubbed timeline ---------- */
    const S = { cam: 0, camX: 0, turn: 0, spin: 0, shake: 0, pour: 0, boost: 0, level: 0, stir: 0, wort: 0, flow: 0 };
    const grain = grist.map((g, i) => ({ g, ph: (i * 0.6180339) % 1, jx: ((i * 53) % 60) - 30, r: (i * 97) % 360, th: ((i * 29) % 100) / 100 }));
    const LIP = [945, 690], LAND = 840;
    let last = 0, tt = 0;
    const render = (time) => {
      const dt = Math.min(.05, time - last || 0); last = time; tt += dt;
      world.style.transform = P ? `translate(${S.camX}px, ${70 - S.cam * .35}px) scale(${PZ})` : `translate(${S.camX}px, ${-S.cam}px)`;
      drawWheel(S.turn + S.spin);
      const sh = S.shake + S.boost * .6;
      millG.style.transform = sh > .01 ? `translate(${Math.sin(tt * 61) * 1.6 * sh}px, ${Math.cos(tt * 47) * 1.1 * sh}px) rotate(${Math.sin(tt * 33) * .25 * sh}deg)` : "";
      // grist stream
      const amt = Math.min(1, S.pour + S.boost);
      stream.style.opacity = (amt * .9).toFixed(3); if (amt > 0) strL.setAttribute("stroke-dashoffset", (-tt * 160).toFixed(1)); // PERF: no repaint while hidden
      stream.style.transform = `scaleX(${(.55 + .45 * amt).toFixed(3)})`;
      grain.forEach(o => {
        if (amt <= o.th * .95) { o.g.style.opacity = 0; return; }
        o.ph = (o.ph + dt * 1.6) % 1; const f = o.ph;
        const x = LIP[0] + o.jx * (.5 + f * .5) - 14 * f, y = LIP[1] + (LAND - LIP[1]) * f * f + 8 * f;
        o.g.style.opacity = f > .92 ? (1 - f) * 12 : 1;
        o.g.style.transform = `translate(${x}px, ${y}px) rotate(${o.r + f * 400}deg)`;
      });
      // mash surface level, ripples, paddle stir
      surf.setAttribute("transform", `translate(0 ${((1 - S.level) * 62 + 3 + Math.sin(tt * 2.2) * S.stir * 1.5).toFixed(2)})`);
      wort.setAttribute("opacity", S.wort.toFixed(3)); sheen.setAttribute("opacity", (S.wort * .7).toFixed(3));
      ripples.setAttribute("opacity", (Math.max(amt, S.stir) * (.35 + .25 * Math.sin(tt * 5))).toFixed(3));
      paddle.style.transform = `rotate(${(Math.sin(tt * 2.6) * 7 * S.stir).toFixed(2)}deg)`;
    };
    paddle.style.transformOrigin = "65px 250px";
    // organic grain flecks on the mash surface
    let sp = ""; for (let i = 0; i < 90; i++) { const a = i * 2.39996, r = Math.sqrt((i + .5) / 90);
      sp += `<ellipse cx="${(188 + Math.cos(a) * r * 172).toFixed(1)}" cy="${(43 + Math.sin(a) * r * 33).toFixed(1)}" rx="${(2 + (i * 7 % 5) * .6).toFixed(1)}" ry="${(1 + (i % 3) * .35).toFixed(1)}" fill="${["#fff4d6", "#b98a43", "#f7e2b0", "#9c6a2c"][i % 4]}" opacity="${(.45 + (i % 4) * .12).toFixed(2)}" transform="rotate(${(i * 37) % 180} ${(188 + Math.cos(a) * r * 172).toFixed(1)} ${(43 + Math.sin(a) * r * 33).toFixed(1)})"/>`; }
    $("#ml-specks").innerHTML = sp;

    // cards: assemble as a page (the "Figma file"), then slot into the tun like recipe cards
    const P = portrait(), PZ = .56;
    world.style.transformOrigin = "0 0";
    // page stack inside the "Figma file" frame: cascaded, every section title visible
    const stackX = P ? 1012 : 150, stackY = [0, 1, 2, 3, 4].map(i => (P ? 250 : 730) + i * 54);
    // fanned upright in the tun like recipe cards in a box; bottoms hide behind the front rim
    const fan = [[836, 796, -9], [876, 780, -4.5], [916, 772, 0], [956, 782, 4.5], [996, 798, 9]];
    const FS = .74, fanXY = i => ({ x: fan[i][0] - 125, y: fan[i][1] - 75 * (1 - FS), rotation: fan[i][2], scale: FS });
    const frame = $(".ml-frame"); if (P) { frame.style.left = (stackX - 10) + "px"; }
    cards.forEach((c, i) => gsap.set(c, { x: stackX, y: stackY[i], rotation: 0, scale: .9, zIndex: i }));
    gsap.set("#ml-barril", { y: 360, rotation: -8 }); gsap.set(".ml-say", { opacity: 0, scale: .4 }); gsap.set(".ml-drop", { opacity: 0, scale: .4 });
    const setFinal = () => {
      Object.assign(S, { cam: 330, turn: 900, level: 1, wort: 1, stir: 0 });
      cards.forEach((c, i) => gsap.set(c, { ...fanXY(i), y: fanXY(i).y + 150 })); gsap.set(".ml-glow", { opacity: .6 });
      gsap.set("#ml-barril", { y: 0, rotation: 0 });
      gsap.set(ear, { opacity: 0 }); gsap.set(kernels, { opacity: 0 });
      render(0);
    };
    if (K.reduced) { img.decode().then(() => setFinal()); setFinal(); return; }

    gsap.ticker.add(render);
    // grain courier: from the first scroll, Barril's barrel pops paper grains out between his hops; they arc up, tumble
    // down out of the hero and pour into the mill's hopper as this sheet slides up (one screen-space layer over both sheets)
    {
      const lay = document.createElement("div"); lay.className = "ml-courier"; lay.setAttribute("aria-hidden", "true");
      const N = innerWidth < 700 ? 28 : 44, W = .3;
      const gs = Array.from({ length: N }, (_, i) => { const g = document.createElement("i"); g.className = "ml-ck v" + (i % 3); lay.appendChild(g);
        const r = (i * .618034) % 1;
        return { g, t0: (i / N) * (1 - W) + r * .02, sx: (r - .5) * 70, kick: (i % 2 ? 1 : -1) * (30 + (i * 37 % 90)), up: 60 + (i * 53 % 100),
          ex: 720 + (i * 53 % 260), rot0: i * 47, rot: (i % 2 ? 1 : -1) * (320 + i * 19), sc: .8 + (i % 5) * .1, on: false }; });
      document.body.appendChild(lay);
      const box = stage.querySelector(".kbox"), hero = document.getElementById("top");
      let shown = false;
      const place = p => {
        const vis = p > 0 && p < 1;
        if (vis !== shown) { shown = vis; lay.style.visibility = vis ? "visible" : "hidden"; }
        if (!vis) return;
        const b = box.getBoundingClientRect(), k = b.width / 1440, bar = hero && hero.querySelector("#h-barril");
        const a = bar ? bar.getBoundingClientRect() : { left: innerWidth * .6, top: innerHeight * .2, width: 300, height: 360 };
        const hk = hero ? hero.querySelector(".kbox").getBoundingClientRect().width / 1440 : k;
        const x0b = a.left + a.width * .6, y0 = a.top + a.height * .1, top = (document.getElementById("jh")?.offsetHeight || 60) + 6;
        // text cards the grain should pass BEHIND (never over the words)
        const cover = [stage.querySelector(".ml-label"), hero && hero.querySelector("#h-ticketwrap"), hero && hero.querySelector(".h-copy")]
          .filter(Boolean).map(e => e.getBoundingClientRect()).filter(r => r.width && r.bottom > 0 && r.top < innerHeight);
        gs.forEach(o => {
          const t = (p - o.t0) / W;
          if (t <= 0 || t >= 1) { if (o.on) { o.on = false; o.g.style.opacity = 0; } return; }
          o.on = true;
          const x0 = x0b + o.sx * hk, x1 = b.left + o.ex * k, y1 = b.top + 136 * k;
          // ballistic: pop up out of the barrel (ease-out), then fall with gravity into the hopper mouth
          const x = x0 + o.kick * hk * Math.sin(Math.min(1, t / .3) * Math.PI / 2) + (x1 - x0 - o.kick * hk) * Math.max(0, (t - .15) / .85) ** 1.2;
          const up = Math.min(o.up * hk, Math.max(20, y0 - top));
          const y = t < .22 ? y0 - up * Math.sin(t / .22 * Math.PI / 2) : y0 - up + (y1 - y0 + up) * ((t - .22) / .78) ** 2;
          if (cover.some(r => x > r.left - 6 && x < r.right + 6 && y > r.top - 8 && y < r.bottom + 8)) { o.g.style.opacity = 0; return; }
          const s = o.sc * Math.max(hk, k) * (t < .08 ? t / .08 : t > .92 ? 1 - (t - .92) * 8 : 1);
          o.g.style.opacity = t > .95 ? (1 - t) * 20 : 1;
          o.g.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(o.rot0 + o.rot * t).toFixed(0)}deg) scale(${s.toFixed(3)})`;
        });
      };
      ScrollTrigger.create({ trigger: st.trigger, start: () => 1, end: "top top", onUpdate: s => place(s.progress), onLeave: () => place(1), onLeaveBack: () => place(0) });
    }
    // idle: hint wobble, kernels rest at the top of the stage
    gsap.to(".ml-hint", { rotation: 2, y: -4, duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut" });

    // click / tap the wheel: an extra crank with a grain burst
    $(".ml-crank").addEventListener("click", () => {
      gsap.to(S, { spin: "+=540", duration: 1.6, ease: "power3.out" });
      gsap.fromTo(S, { boost: 1 }, { boost: 0, duration: 1.8, ease: "power2.in" });
      gsap.fromTo(ripples, { scale: .6 }, { scale: 1, duration: .6, transformOrigin: "50% 50%" });
    });

    /* ---------- the scrubbed story ---------- */
    const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { ...st, scrub: 1 } });
    // 1. the barley ear + loose kernels from the hero fall into the hopper
    tl.fromTo(ear, { x: 0, y: 0, rotation: -40 }, { y: 420, x: -70, rotation: 12, duration: .1, ease: "power2.in" }, 0)
      .to(ear, { y: 520, duration: .04, ease: "power1.in" }, .1);
    // three waves of grain rain into the hopper: with the ear, while the crank bites, and a last handful
    kernels.forEach((k, i) => {
      const wave = i < 12 ? 0 : i < 24 ? 1 : 2, j = wave ? (wave === 1 ? i - 12 : i - 24) : i;
      const x0 = 730 + (i * 41 % 200), x1 = 770 + (i * 23 % 130), t0 = [.012, .11, .2][wave] + j * .0065;
      tl.fromTo(k, { x: x0, y: -60 - (i * 37 % 260), rotation: i * 40, scale: .85 + (i % 4) * .08 }, { x: x1, y: 190, rotation: i * 40 + 300, duration: .08, ease: "power2.in" }, t0);
    });
    // 2. crank turns, mill shakes, camera rides down
    tl.to(S, { turn: 1440, duration: .5, ease: "power1.inOut" }, .08)
      .to(".ml-hint", { opacity: 0, duration: .03 }, .12)
      .to(S, { shake: 1, duration: .06 }, .1).to(S, { shake: 0, duration: .08 }, .52)
      .to(S, { cam: 450, duration: .66, ease: "power2.inOut" }, .08)
    // 3. grist pours, mash rises
      .to(S, { pour: 1, duration: .05 }, .16).to(S, { pour: 0, duration: .08 }, .5)
      .to(S, { level: 1, duration: .36, ease: "power1.out" }, .18)
    // 4. section cards fly in and assemble into a page (the Figma file)
      .to(frame, { opacity: 1, duration: .04 }, .3);
    cards.forEach((c, i) => {
      const fromX = P ? 1500 : -380, fromY = stackY[i] - 260 - i * 30;
      tl.fromTo(c, { x: fromX, y: fromY, rotation: P ? 30 : -38, scale: .9 }, { x: stackX, y: stackY[i], rotation: (i % 2 ? 1.2 : -1.2), scale: .9, duration: .07, ease: "back.out(1.6)" }, .3 + i * .025);
    });
    // 5. ...then slot into the tun one by one (arc up, tilt, drop behind the front rim, settle)
    tl.to(frame, { opacity: 0, duration: .04 }, .52);
    cards.forEach((c, i) => {
      const t0 = .5 + i * .04, F = fanXY(i);
      tl.to(c, { x: F.x - 40, y: F.y - 260, rotation: F.rotation * .5 - 6, scale: .82, duration: .03, ease: "power2.out" }, t0)
        .to(c, { ...F, duration: .035, ease: "back.in(1.2)" }, t0 + .03)
        .to(c, { y: F.y + 6, duration: .012, ease: "power1.out" }, t0 + .065).to(c, { y: F.y, duration: .015, ease: "power1.inOut" }, t0 + .077)
        .fromTo(ripples, { scale: .5, transformOrigin: "50% 50%" }, { scale: 1.1, duration: .03 }, t0 + .06);
    });
    cards.forEach((c, i) => tl.to(c, { y: "+=150", rotation: "*=0.4", duration: .06, ease: "power2.in" }, .71 + i * .012));
    tl.to(S, { stir: 1, duration: .05 }, .44).to(S, { stir: 0, duration: .06 }, .8)
      .to(".ml-glow", { opacity: 1, duration: .08 }, .76).to(".ml-glow", { opacity: .5, duration: .1 }, .88)
    // 6. mash becomes amber wort; Barril pops up; wort drains down the copper pipe, out the bottom
      .to(S, { wort: 1, duration: .08 }, .76)
      .to("#ml-barril", { y: 0, rotation: 0, duration: .07, ease: "back.out(1.7)" }, .78)
      .to(".ml-say", { opacity: 1, scale: 1, duration: .04, ease: "back.out(2)" }, .84)
      .to("#ml-valve", { rotation: 90, transformOrigin: "50% 50%", duration: .04, ease: "power2.inOut" }, .86)
      .to("#ml-flow", { opacity: 1, duration: .03 }, .88)
      .to(S, { level: .55, duration: .12 }, .88)
      .to(".ml-drop", { opacity: 1, scale: 1, duration: .02 }, .9)
      .to(".ml-drop", { y: 260, duration: .08, ease: "power2.in" }, .91)
      .to({}, { duration: .01 }, .99);

    // landscape phones: the "Figma file" card stack lands right where the label is, so the label steps aside meanwhile
    if (matchMedia("(max-height: 500px) and (min-aspect-ratio: 1/1)").matches) { const lb = stage.querySelector(".ml-label");
      tl.to(lb, { autoAlpha: 0, duration: .03 }, .27).to(lb, { autoAlpha: 1, duration: .03 }, .6); }
    // portrait phones: keep the action centred as the camera moves
    if (P) {
      const fitX = () => { const box = world.parentElement, W = stage.clientWidth, sc = Math.max(W / 1440, stage.clientHeight / 900);
        const m = box.style.transform.match(/translate\(([-\d.]+)px/), tx = m ? +m[1] : 0; S.camX = (-tx / sc + W / sc / 2) - 880 * PZ; };
      fitX(); addEventListener("resize", fitX);
      gsap.set("#ml-barril", { x: 110, y: 700 }); $(".ml-say").style.left = "640px"; frame.style.display = "none";
    }
  }
});
