/* 50 · FERMENT — "Brew history".
   A dim cellar. The chilled wort drops into the big paper fermenter and the porthole fills.
   As you scroll, big paper bubbles escape the porthole and pop into pinned paper cards: first pint → Now.
   At "Now" the sleepy yeast wakes up (eyes open, "!"), hops down, shoves the tap lever and the beer pours
   out of the bottom of the stage toward the bottling line. */
(function () {
  const FS = 396 / 506;                    // fermenter scale (desktop)
  const MILESTONES = [
    { y: "Nº 1", eb: "The first pint", t: "Bachelor of Computer Applications", w: "Guru Nanak Dev University, Amritsar", p: "Where Germanjit and code first met. Love at first semicolon." },
    { y: "Nº 2", eb: "Second fermentation", t: "Master of Computer Applications", w: "Guru Nanak Dev University, Amritsar", p: "" },
    { y: "Nº 3", eb: "Aged in oak", t: "M.Tech, Computer Science &amp; Engineering", w: "Lovely Professional University", p: "Published in IJCA (2014): software effort estimation with a Bayesian network and particle swarm optimisation." },
    { y: "2015", eb: "Opened the taps", t: "Goes freelance", w: "Self-employed ever since", p: "" },
    { y: "Now", eb: "Now pouring", t: "Senior Shopify / Shopify Plus &amp; app developer", w: "200+ stores across 10+ industries", p: "Agency contract work for CTI Digital (UK), Elev8 Experience (US), Helping Brands (Germany) and Uplers (India).", now: true }
  ];
  // sprite-coord crop helper for fermenter overlays (rig is in sprite px)
  const crop = (cls, x, y, w, h, sx = x, sy = y, extra = "") =>
    `<i class="${cls}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background-position:${-sx}px ${-sy}px;${extra}"></i>`;

  SCENES.push({
    id: "ferment", order: 50, height: 260, bg: "#2a1d17", headerTone: "light",
    nav: { label: "Brew history", href: "#ferment" },
    html: (K) => {
      const cards = MILESTONES.map((m, i) => `
        <article class="fe-card${m.now ? " fe-card--now" : ""}" data-i="${i}">
          <div class="fe-paper"><i class="fe-pin"></i>
            <div class="fe-top"><span class="fe-yr">${m.y}</span><span class="fe-eb">${m.eb}</span></div>
            <h3>${m.t}</h3><div class="fe-where">${m.w}</div>${m.p ? `<p>${m.p}</p>` : ""}
          </div></article>`).join("");
      const bubbles = MILESTONES.map((m, i) => `<i class="fe-bub" data-i="${i}"><b>${m.y}</b></i>`).join("");
      const minis = Array.from({ length: 14 }, (_, i) => `<i class="fe-mb" style="left:${8 + (i * 37) % 130}px;--d:${(1.6 + (i % 5) * .45).toFixed(2)}s;--dl:${(-i * .37).toFixed(2)}s;--s:${4 + (i % 4) * 2}px"></i>`).join("");
      const zs = [0, 1, 2].map(i => `<i class="fe-z" data-i="${i}">z</i>`).join("");
      return K.box(`
        <div class="fe-wall"></div>
        <div class="fe-lamp"></div>
        <div class="fe-pipe"><i class="fe-inflow"></i></div>
        <div class="fe-rig">
          <img class="ks d3 fe-tank" src="img/fermenter.webp" alt="Paper fermenter" draggable="false" decoding="sync" width="506" height="1100" style="left:0;top:0;width:506px">
          <div class="fe-port">${minis}<i class="fe-head"></i></div>
          ${crop("fe-patch", 254, 742, 70, 24, 265, 706)}
          ${crop("fe-lever", 247, 743, 68, 22)}
          <div class="fe-gauge"><i class="fe-face"></i><b class="fe-needle"><s></s></b><i class="fe-hub"></i></div>
          <i class="fe-stream"><i></i></i>
        </div>
        <div class="fe-shelf"></div>
        <div class="fe-ypos"><div class="fe-yeast"><div class="fe-breath">
          <img class="ks d2" src="img/yeast.webp" alt="Sleepy yeast in a nightcap" draggable="false" style="left:0;top:0;width:811px">
          <div class="fe-awake"><i class="fe-skin l"></i><i class="fe-skin r"></i><i class="fe-skin m"></i>
            <i class="fe-eye l"></i><i class="fe-eye r"></i><i class="fe-mouth"></i></div>
        </div><div class="fe-zzz">${zs}</div><i class="fe-bang">!</i></div></div>
        <div class="fe-bubs">${bubbles}</div>
        <div class="fe-cards">${cards}</div>
      `, { focus: 50 }) + K.svc({ step: 4, brew: "Ferment", title: "Experience", href: "#ferment", left: "4.6%", top: "max(104px, 12%)",
        text: "Freelance since 2015: 200+ stores across 10+ industries, plus agency work in the UK, US, Germany and India." }) + `
      <style>
        #ferment .jstage { background: radial-gradient(90% 80% at 50% 38%, #3d2a20 0%, #2a1d17 55%, #1c130f 100%); }
        #ferment .fe-wall { position: absolute; inset: -300px; opacity: .55;
          background: repeating-linear-gradient(0deg, transparent 0 58px, rgba(0,0,0,.25) 58px 60px),
                      repeating-linear-gradient(90deg, rgba(255,255,255,.012) 0 120px, rgba(0,0,0,.05) 120px 240px); }
        #ferment .fe-lamp { position: absolute; left: 160px; top: -260px; width: 1100px; height: 1100px; border-radius: 50%;
          background: radial-gradient(closest-side, rgba(255,190,110,.16), rgba(255,170,80,.05) 55%, transparent); pointer-events: none; }
        /* inlet pipe from the chiller above */
        #ferment .fe-pipe { position: absolute; left: 687px; top: -40px; width: 44px; height: 80px; z-index: 1; overflow: hidden;
          background: repeating-linear-gradient(0deg, rgba(60,25,5,.35) 0 2px, transparent 2px 48px), linear-gradient(90deg, #6e3412, #b9612f 18%, #e39a64 42%, #c06a38 62%, #8a4418 85%, #6e3412);
          filter: drop-shadow(calc(var(--lx) * 10px) calc(var(--ly) * 16px) 12px rgba(0,0,0,.4)); }
        #ferment .fe-inflow { position: absolute; left: 6px; right: 6px; top: 0; height: 100%; background: linear-gradient(transparent, #ffb84d 30%, #ffd98a 70%, transparent); mix-blend-mode: screen; filter: blur(3px); opacity: 0; }
        /* fermenter rig: everything inside is in fermenter sprite pixels */
        #ferment .fe-rig { position: absolute; left: 541px; top: 28px; width: 506px; height: 1100px; transform-origin: 0 0; transform: scale(${FS}); z-index: 2; }
        /* the tank never moves on its own: no promoted layer. A will-change layer of a 1100px sprite plus a 34px drop-shadow
           is the one sprite here whose backing store blows past the tiling limit at DPR 2 (1100 x 2 + filter outsets > 2048),
           and composited filters on tiled layers are not drawn (the tank vanished while its port/lever siblings stayed). */
        #ferment .fe-tank, #ferment .fe-ypos .ks { will-change: auto; }
        #ferment .fe-port { position: absolute; left: 176px; top: 300px; width: 148px; height: 150px; border-radius: 50%; overflow: hidden; }
        #ferment .fe-mb { position: absolute; bottom: -10px; width: var(--s); height: var(--s); border-radius: 50%; background: rgba(255,244,210,.75); box-shadow: inset -1px -1px 0 rgba(160,90,10,.4);
          animation: fe-rise var(--d) linear var(--dl) infinite; }
        @keyframes fe-rise { 0% { transform: translate(0, 0); opacity: 0; } 15% { opacity: 1; } 50% { transform: translate(5px, -80px); } 100% { transform: translate(-3px, -150px); opacity: .2; } }
        #ferment .fe-head { position: absolute; left: 0; right: 0; top: 0; height: 100%; background: radial-gradient(120% 90% at 35% 25%, #5d5650, #2f2a26 70%);
          box-shadow: inset 0 -10px 0 #f3e6c6, inset 0 -14px 6px rgba(255,255,255,.35); }
        #ferment .fe-patch, #ferment .fe-lever { position: absolute; background-image: url(img/fermenter.webp); background-repeat: no-repeat; background-size: 506px 1100px; }
        #ferment .fe-lever { transform-origin: 2px 11px; }
        #ferment .fe-patch { -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 86%, transparent); mask-image: linear-gradient(90deg, transparent, #000 12%, #000 86%, transparent); }
        #ferment .fe-gauge { position: absolute; left: 455px; top: 170px; width: 0; height: 0; }
        #ferment .fe-face { position: absolute; left: -30px; top: -30px; width: 60px; height: 60px; border-radius: 50%; background: radial-gradient(closest-side, #e9dcc9 0 78%, rgba(233,220,201,0) 100%); }
        #ferment .fe-needle { position: absolute; left: -2.5px; top: -28px; width: 5px; height: 31px; transform-origin: 2.5px 28px; }
        #ferment .fe-needle s { position: absolute; inset: 0; background: #2a1d17; clip-path: polygon(50% 0, 100% 85%, 100% 100%, 0 100%, 0 85%); transform-origin: 2.5px 28px; }
        #ferment .fe-hub { position: absolute; left: -6px; top: -6px; width: 12px; height: 12px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #f1d48a, #9a7424); }
        #ferment .fe-stream { position: absolute; left: 224px; top: 884px; width: 17px; height: 900px; transform-origin: 50% 0; transform: scaleY(0); overflow: hidden; border-radius: 0 0 8px 8px; }
        #ferment .fe-stream i { position: absolute; inset: 0 -4px; background: linear-gradient(90deg, rgba(200,110,15,.85), #f2b23a 30%, #ffe9a8 48%, #f0a42f 66%, rgba(180,95,10,.9));
          animation: fe-pour .35s ease-in-out infinite alternate; }
        @keyframes fe-pour { to { transform: scaleX(.82) translateY(6px); } }
        /* shelf + yeast */
        #ferment .fe-shelf { position: absolute; left: 990px; top: 758px; width: 290px; height: 20px; z-index: 2; border-radius: 3px;
          background: linear-gradient(#a8622b 0 40%, #8d4f20 40% 100%); filter: drop-shadow(calc(var(--lx) * 6px) calc(var(--ly) * 12px) 8px rgba(0,0,0,.5)); }
        #ferment .fe-shelf::before, #ferment .fe-shelf::after { content: ""; position: absolute; top: 20px; width: 12px; height: 44px; background: linear-gradient(90deg, #6e6e72, #a3a3a8 50%, #5d5d61); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 30%); }
        #ferment .fe-shelf::before { left: 36px; } #ferment .fe-shelf::after { right: 36px; }
        #ferment .fe-ypos { position: absolute; left: 1015px; top: 532px; width: 811px; height: 769px; transform-origin: 0 0; transform: scale(.296); z-index: 4; }
        #ferment .fe-yeast, #ferment .fe-breath { position: absolute; inset: 0; transform-origin: 50% 100%; }
        #ferment .fe-awake { position: absolute; inset: 0; opacity: 0; }
        #ferment .fe-skin { position: absolute; border-radius: 50%; }
        #ferment .fe-skin.l { left: 178px; top: 350px; width: 128px; height: 76px; background: radial-gradient(closest-side, #eed3b4 0 70%, rgba(238,211,180,0)); }
        #ferment .fe-skin.r { left: 420px; top: 386px; width: 130px; height: 82px; background: radial-gradient(closest-side, #dcbf9f 0 70%, rgba(220,191,159,0)); }
        #ferment .fe-skin.m { left: 300px; top: 418px; width: 104px; height: 64px; background: radial-gradient(closest-side, #e6c8a5 0 70%, rgba(230,200,165,0)); }
        #ferment .fe-eye { position: absolute; width: 44px; height: 58px; border-radius: 50%; background: radial-gradient(circle at 38% 30%, #fff 0 16%, #3a2418 18%); box-shadow: 0 0 0 5px rgba(255,255,255,.55); }
        #ferment .fe-eye.l { left: 218px; top: 357px; } #ferment .fe-eye.r { left: 460px; top: 396px; }
        #ferment .fe-mouth { position: absolute; left: 334px; top: 432px; width: 34px; height: 36px; border-radius: 50%; background: #4a2a1a; }
        #ferment .fe-zzz { position: absolute; left: 640px; top: 120px; width: 0; height: 0; }
        #ferment .fe-z { position: absolute; left: 0; top: 0; font: 400 120px/1 "Archivo Black", sans-serif; color: #f3ead8; opacity: 0; }
        #ferment .fe-bang { position: absolute; left: 700px; top: -120px; width: 120px; height: 190px; display: grid; place-items: center; font: 400 150px/1 "Archivo Black", sans-serif; font-style: normal;
          color: #2b1a12; background: #f2c14e; clip-path: polygon(12% 0, 100% 6%, 90% 100%, 0 92%); transform: scale(0); transform-origin: 30% 100%; }
        /* bubbles */
        #ferment .fe-bubs { position: absolute; inset: 0; z-index: 5; pointer-events: none; }
        #ferment .fe-bub { position: absolute; left: 0; top: 0; width: 96px; height: 96px; margin: -48px 0 0 -48px; border-radius: 50%; opacity: 0; display: grid; place-items: center;
          background: radial-gradient(circle at 34% 28%, #fffdf5 0 9%, rgba(255,250,235,.95) 11%, rgba(255,240,205,.82) 45%, rgba(242,193,78,.78) 80%, rgba(217,138,34,.85));
          box-shadow: inset -8px -10px 14px rgba(160,90,10,.25), inset 6px 6px 10px rgba(255,255,255,.5);
          filter: drop-shadow(calc(var(--lx) * 10px) calc(var(--ly) * 16px) 12px rgba(0,0,0,.45)); }
        #ferment .fe-bub b { font: 400 20px "Archivo Black", sans-serif; color: #7a3f0c; letter-spacing: -.01em; }
        /* cards */
        #ferment .fe-cards { position: absolute; inset: 0; z-index: 6; pointer-events: none; perspective: 1200px; }
        #ferment .fe-card { position: absolute; width: 360px; transform-origin: 50% 0; pointer-events: auto; }
        #ferment .fe-card[data-i="0"] { left: 66px; top: 300px; --r: -1.4deg; width: 440px; }
        #ferment .fe-card[data-i="1"] { left: 96px; top: 506px; --r: 1.1deg; width: 420px; }
        #ferment .fe-card[data-i="2"] { left: 60px; top: 668px; --r: -.7deg; width: 452px; }
        #ferment .fe-card[data-i="3"] { left: 1082px; top: 100px; --r: 1.6deg; width: 296px; }
        #ferment .fe-card[data-i="4"] { left: 994px; top: 226px; --r: -1deg; width: 400px; }
        #ferment .fe-paper { position: relative; padding: 18px 24px 16px; background: #f4ead6; color: #2b1a12; rotate: var(--r);
          background-image: linear-gradient(115deg, rgba(255,255,255,.35), rgba(255,255,255,0) 38%, rgba(0,0,0,.035) 38.5%, rgba(0,0,0,0) 75%);
          filter: drop-shadow(calc(var(--lx) * 2px) calc(var(--ly) * 3px) 2px rgba(0,0,0,.4)) drop-shadow(calc(var(--lx) * 16px) calc(var(--ly) * 26px) 16px rgba(0,0,0,.42)); }
        #ferment .fe-pin { position: absolute; left: 50%; top: -9px; width: 22px; height: 22px; margin-left: -11px; border-radius: 50%;
          background: radial-gradient(circle at 36% 30%, #ffe9a8 0 15%, #e0a43a 30%, #9a6416 80%); box-shadow: 3px 6px 5px rgba(0,0,0,.45); }
        #ferment .fe-top { display: flex; align-items: baseline; gap: 14px; margin-bottom: 6px; }
        #ferment .fe-yr { font: 400 40px/1 "Archivo Black", sans-serif; color: #c46a1f; letter-spacing: -.03em; }
        #ferment .fe-eb { font: 800 11px/1.2 Archivo, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #9a7a5c; }
        #ferment .fe-card h3 { margin: 4px 0 2px; font: 800 16.5px/1.25 Archivo, sans-serif; }
        #ferment .fe-where { font: 600 13px/1.35 Archivo, sans-serif; color: #7a5a40; }
        #ferment .fe-card p { margin: 10px 0 0; padding-top: 10px; border-top: 1px dashed rgba(43,26,18,.2); font: 600 13.5px/1.45 Archivo, sans-serif; color: #4a3020; }
        #ferment .fe-card--now .fe-paper { background-color: #f2c14e; padding: 24px 26px 22px; }
        #ferment .fe-card--now .fe-yr { color: #2b1a12; font-size: 52px; }
        #ferment .fe-card--now .fe-eb, #ferment .fe-card--now .fe-where { color: #6a4300; }
        #ferment .fe-card--now h3 { font-size: 19px; }
        #ferment .fe-card--now .fe-where { font-size: 14px; font-weight: 800; }
        #ferment .fe-card--now p { border-color: rgba(43,26,18,.3); color: #3a2414; font-size: 14px; }
        #ferment .kb-label { max-width: min(440px, 31vw); }
        @media (max-aspect-ratio: 1/1) {
          #ferment .fe-rig { left: 620px; top: 482px; transform: scale(.415); }
          #ferment .fe-pipe { top: -40px; height: 540px; }
          #ferment .fe-lamp { left: 170px; top: -100px; }
          #ferment .fe-shelf { left: 512px; top: 760px; width: 126px; height: 12px; }
          #ferment .fe-shelf::before { left: 16px; height: 26px; top: 12px; } #ferment .fe-shelf::after { right: 16px; height: 26px; top: 12px; }
          #ferment .fe-ypos { left: 526px; top: 664px; transform: scale(.128); }
          #ferment .fe-card, #ferment .fe-card[data-i] { left: 536px; top: 318px; width: 370px; }
          #ferment .fe-paper { padding: 18px 20px 16px; }
          #ferment .fe-card--now .fe-paper { padding: 18px 20px 16px; }
          #ferment .fe-card--now .fe-yr { font-size: 46px; }
          #ferment .fe-card p { font-size: 13px; }
          #ferment .fe-bub { width: 70px; height: 70px; margin: -35px 0 0 -35px; } #ferment .fe-bub b { font-size: 15px; }
        }
      </style>`;
    },
    init: (stage, K, st) => {
      const $ = s => stage.querySelector(s), $$ = s => [...stage.querySelectorAll(s)];
      const box = $(".kbox"), cards = $$(".fe-card"), bubs = $$(".fe-bub"), yeast = $(".fe-yeast"), lever = $(".fe-lever");
      const head = $(".fe-head"), stream = $(".fe-stream"), needle = $(".fe-needle"), port = $(".fe-port");
      // rect → design-box coords
      const D = el => { const r = el.getBoundingClientRect(), b = box.getBoundingClientRect(), s = b.width / 1440;
        return { x: (r.left - b.left) / s, y: (r.top - b.top) / s, w: r.width / s, h: r.height / s }; };
      const portC = () => { const r = D(port); return [r.x + r.w / 2, r.y + r.h * .45]; };
      const pinC = c => { const r = D(c.querySelector(".fe-pin")); return [r.x + r.w / 2, r.y + r.h / 2 + 30]; };
      const ys = () => D($(".fe-ypos")).w / 811;                        // yeast sprite → design scale

      // wide/short landscape windows (cover fit crops the 1440x900 box top and bottom): keep every card inside the visible
      // band and below the title. Columns that fit keep their design spots, else they are re-spaced, else they stack.
      const label = stage.querySelector(".kb-label"), hdr = document.getElementById("jh");
      const COLS = [[0, 1, 2], [3, 4]], colOf = i => i < 3 ? 0 : 1, stackCol = [false, false];
      const portrait = matchMedia("(max-aspect-ratio: 1/1)");
      const layout = () => {
        const was = cards.map(c => c.style.top).join() + stackCol;
        cards.forEach(c => c.style.top = ""); stackCol[0] = stackCol[1] = false;
        if (!portrait.matches && label) {
          const m = new DOMMatrix(getComputedStyle(box).transform), s = m.a || 1, H = stage.clientHeight, toD = y => (y - m.f) / s;
          const vBot0 = toD(H) - 16, gap = 22;
          COLS.forEach((col, ci) => {
            const top0 = Math.max(toD((hdr ? hdr.offsetHeight : 80) + 16), ci ? 0 : toD(label.offsetTop + label.offsetHeight + 26));
            const hs = col.map(i => cards[i].offsetHeight), tops = col.map(i => cards[i].offsetTop), n = col.length;
            const vBot = ci ? Math.min(vBot0, 540) : vBot0;                                  // right column stays above the yeast's shelf

            if (tops[0] >= top0 && tops[n - 1] + hs[n - 1] <= vBot) return;                 // design spots fit
            const need = hs.reduce((a, b) => a + b, 0) + gap * (n - 1);
            if (need <= vBot - top0) { let y = Math.max(top0, Math.min(tops[0], vBot - need));
              col.forEach((i, k) => { cards[i].style.top = y.toFixed(0) + "px"; y += hs[k] + gap; }); return; }
            stackCol[ci] = true;                                                             // pile them, newest on top
            const y = Math.max(toD(64), Math.min(top0, vBot - Math.max(...hs)));
            col.forEach(i => cards[i].style.top = y.toFixed(0) + "px");
          });
        }
        return was !== cards.map(c => c.style.top).join() + stackCol;
      };
      layout();
      ScrollTrigger.addEventListener("refreshInit", layout);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (layout()) ScrollTrigger.refresh(); });

      gsap.set(head, { yPercent: -18 });           // porthole mostly empty before the wort arrives
      gsap.set(needle, { rotation: -120 });
      gsap.set(cards, { rotationX: -95, opacity: 0 });

      const finalState = () => { gsap.set(head, { yPercent: -100 }); gsap.set(cards, { rotationX: 0, opacity: 1 }); gsap.set(".fe-awake", { opacity: 1 });
        gsap.set(stream, { scaleY: 1 }); gsap.set(needle, { rotation: 30 }); };
      if (K.reduced) { finalState(); return; }

      // idle life
      gsap.to(".fe-breath", { scaleY: 1.035, scaleX: .985, duration: 1.9, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(needle.firstChild, { rotation: 3, duration: .12, repeat: -1, yoyo: true, ease: "sine.inOut" });
      $$(".fe-z").forEach((z, i) => gsap.fromTo(z, { x: 0, y: 0, scale: .4, opacity: 0, rotation: -10 },
        { keyframes: [{ opacity: 1, duration: .5 }, { opacity: 0, duration: 1.4, delay: .7 }], x: 160 + i * 20, y: -260, scale: 1.1 - i * .15, rotation: 12,
          duration: 2.6, ease: "sine.out", repeat: -1, delay: i * .9 }));
      cards.forEach((c, i) => gsap.to(c.firstElementChild, { rotation: i % 2 ? .8 : -.8, duration: 2.4 + i * .3, repeat: -1, yoyo: true, ease: "sine.inOut" }));
      CustomWiggle.create("feWig", { wiggles: 4, type: "easeOut" });

      const mm = gsap.matchMedia();
      mm.add({ p: "(max-aspect-ratio: 1/1)", l: "(min-aspect-ratio: 1/1)" }, ctx => {
        const P = ctx.conditions.p;
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { ...st, scrub: 1, invalidateOnRefresh: true } });
        // wort arrives from the chiller: glow down the inlet pipe, porthole fills, gauge climbs
        tl.fromTo(".fe-inflow", { yPercent: -100, opacity: 1 }, { yPercent: 100, duration: .08 }, 0)
          .to(head, { yPercent: -100, duration: .1, ease: "power1.out" }, .03)
          .to(needle, { rotation: 10, duration: .15, ease: "power2.out" }, .03);
        // milestones: a bubble leaves the porthole, drifts to the card's pin and pops into the card
        MILESTONES.forEach((m, i) => {
          const t = .1 + i * .125, b = bubs[i], c = cards[i];
          const from = () => portC(), to = () => pinC(c);
          tl.set(b, { x: () => from()[0], y: () => from()[1], scale: .2, opacity: 0 }, t - .001)
            .to(b, { opacity: 1, scale: .7, y: () => from()[1] - 60, duration: .025, ease: "power1.out" }, t)
            .to(b, { x: () => to()[0], duration: .065, ease: "sine.inOut" }, t + .02)
            .to(b, { y: () => to()[1], duration: .065, ease: "power2.inOut" }, t + .02)
            .to(b, { scale: 1, duration: .05, ease: "sine.inOut" }, t + .025)
            .to(b, { scale: 1.6, opacity: 0, duration: .012, ease: "power2.out" }, t + .085)
            .to(c, { opacity: 1, duration: .01 }, t + .085)
            .to(c, { rotationX: 0, duration: .04, ease: "back.out(1.8)" }, t + .085)
            .fromTo(c, { rotation: 0 }, { rotation: i % 2 ? -5 : 5, duration: .07, ease: "feWig" }, t + .1);
          // a new card lands on top of the pile: older cards in the same pile step back (portrait, or a stacked column)
          const pile = P ? cards.slice(0, i) : COLS[colOf(i)].filter(k => k < i).map(k => cards[k]);
          const S = () => P || stackCol[colOf(i)];
          if (pile.length) tl.to(pile, { y: k => S() ? (pile.length - k) * 14 : 0, scale: k => S() ? 1 - (pile.length - k) * .04 : 1,
              filter: () => S() ? "brightness(.72)" : "brightness(1)", duration: .03 }, t + .08)
            .to(pile[pile.length - 1].querySelector(".fe-pin"), { opacity: () => S() ? 0 : 1, duration: .02 }, t + .08);
        });
        // Now: the yeast wakes up, hops down to the tap, shoves the lever, beer pours out the bottom
        const jump = () => { const lv = D(lever), y0 = D($(".fe-ypos")), s = ys();
          const tx = lv.x + lv.w + 20 - y0.x - 811 * s * .08, floor = P ? 900 : 888;   // land just right of the lever end
          return { x: tx / s, y: (floor - (y0.y + 769 * s)) / s }; };
        tl.to(".fe-zzz", { opacity: 0, duration: .02 }, .73)
          .to(".fe-awake", { opacity: 1, duration: .01 }, .735)
          .fromTo(".fe-bang", { scale: 0, rotation: -20 }, { scale: 1, rotation: 6, duration: .03, ease: "back.out(3)" }, .735)
          .to(".fe-bang", { scale: 0, duration: .02 }, .79)
          .to(yeast, { scaleY: .82, scaleX: 1.12, duration: .02, ease: "power2.in" }, .77)
          .to(yeast, { scaleY: 1.12, scaleX: .92, duration: .02, ease: "power2.out" }, .79)
          .to(yeast, { x: () => jump().x, duration: .06, ease: "power1.inOut" }, .79)
          .to(yeast, { y: () => jump().y - 260, duration: .025, ease: "power2.out" }, .79)
          .to(yeast, { y: () => jump().y, duration: .035, ease: "power2.in" }, .815)
          .to(yeast, { rotation: -14, duration: .06, ease: "sine.inOut" }, .79)
          .to(yeast, { scaleY: .78, scaleX: 1.15, rotation: 0, duration: .015, ease: "power2.out" }, .85)
          .to(yeast, { scaleY: 1.18, scaleX: .9, duration: .025, ease: "back.out(2)" }, .865)
          .to(lever, { rotation: -42, duration: .025, ease: "power2.out" }, .87)
          .to(yeast, { scaleY: 1, scaleX: 1, duration: .03, ease: "power1.out" }, .9)
          .to(stream, { scaleY: 1, duration: .08, ease: "power1.in" }, .885)
          .to(head, { yPercent: -70, duration: .1 }, .9)
          .to(needle, { rotation: 35, duration: .1 }, .88);
        return () => {};
      });
    }
  });
})();
