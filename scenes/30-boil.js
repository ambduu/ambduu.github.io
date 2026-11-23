/* 30 · THE BOIL — "Shopify Plus"
   The wort from the mash tun arrives down a copper pipe (top, x≈720) into the big copper kettle on its azulejo plinth.
   A Barcelos rooster flies out of the Douro valley (seen through an azulejo-framed window), carrying four hop cones.
   It drops them into the kettle hatch one by one: Checkout extensions, Shopify Functions, B2B, Markets. Each drop:
   splash puff, lid rattle, and the matching line on the paper "hop schedule" lights up with a one-line explanation.
   Hops are clickable too (toss one in early). Paper steam curls rise from the chimney the whole time.
   The hot wort leaves through the kettle's brass outlet and a copper pipe at the bottom edge, x≈1250 (toward the chiller). */
SCENES.push({
  id: "boil", order: 30, height: 260, bg: "#9cc2e2", headerTone: "dark",
  nav: { label: "Shopify Plus", href: "shopify-plus.html" },
  html: (K) => {
    const HOPS = [
      ["Checkout extensions", "Checkout", "60 min", "Custom blocks in checkout and the thank-you page, built as extensions instead of checkout.liquid edits."],
      ["Shopify Functions", "Functions", "30 min", "Discount, delivery and payment rules that run inside Shopify's own checkout. Scripts, retired politely."],
      ["B2B", "B2B", "15 min", "Company accounts, price lists and payment terms, so wholesale buyers order from the same store."],
      ["Markets", "Markets", "Flameout", "One store selling across countries with local currencies, languages and domains."]
    ];
    const puff = (i) => `<div class="bo-puff" data-i="${i}"><svg viewBox="0 0 120 84" width="120" height="84"><g fill="#fff8ea"><circle cx="34" cy="50" r="24"/><circle cx="60" cy="34" r="28"/><circle cx="88" cy="50" r="22"/><circle cx="60" cy="56" r="24"/></g><path d="M14 58 Q60 86 108 58 Q100 74 60 76 Q22 76 14 58Z" fill="#efe1c8"/><circle cx="52" cy="26" r="9" fill="#fffdf6" opacity=".8"/></svg></div>`;
    const hops = HOPS.map(([n, s], i) => `<button class="bo-hop" data-i="${i}" aria-label="Toss the ${n} hop into the kettle"><img class="ks d2" src="img/hop.webp" alt="" draggable="false" style="position:relative;left:0;top:0;width:62px;rotate:${[-8, 6, -4, 10][i]}deg"><span class="bo-mini">${s}</span></button>`).join("");
    const rows = HOPS.map(([n, s, m, t], i) => `<li class="bo-row" data-i="${i}"><span class="bo-min">${m}</span>${K.tag(n, { color: "#e8d3a8" })}<p>${t}</p></li>`).join("");
    const art = `<div class="bo-world">
      <div class="bo-winwrap" aria-hidden="true">
        <div class="bo-tiles"></div>
        <div class="bo-win"><img src="img/douro.webp" alt="" draggable="false"><i class="bo-haze"></i></div>
        <div class="bo-sill"></div>
      </div>
      <svg class="bo-inlet" viewBox="0 0 150 900" width="150" height="900" aria-hidden="true">
        <defs><linearGradient id="bo-cu" gradientUnits="userSpaceOnUse" x1="4" x2="36" y1="0" y2="0"><stop offset="0" stop-color="#7a3a12"/><stop offset=".38" stop-color="#e8a066"/><stop offset=".55" stop-color="#c97a3a"/><stop offset="1" stop-color="#6e3210"/></linearGradient>
          <linearGradient id="bo-cuH" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="508" y2="540"><stop offset="0" stop-color="#e8a066"/><stop offset=".5" stop-color="#c97a3a"/><stop offset="1" stop-color="#6e3210"/></linearGradient></defs>
        <path d="M20 0 V300" stroke="url(#bo-cu)" stroke-width="32" fill="none"/><g transform="translate(0 300)">
        <path d="M20 0 V494" stroke="url(#bo-cu)" stroke-width="32" fill="none"/>
        <path d="M4 494 Q4 540 50 540 V508 Q36 508 36 494 Z" fill="#b8692d"/>
        <path d="M50 524 H140" stroke="url(#bo-cuH)" stroke-width="32" fill="none"/>
        <rect x="128" y="502" width="14" height="44" rx="3" fill="#d9a43a"/>
        <rect x="9" y="150" width="22" height="170" rx="11" fill="#3f1f0c"/>
        <rect id="bo-in" x="11" y="152" width="18" height="166" rx="9" fill="#e9a03a"/>
        <rect x="14" y="158" width="4" height="154" rx="2" fill="#fff6e2" opacity=".5"/>
        <rect x="1" y="140" width="38" height="13" rx="3" fill="#d9a43a"/><rect x="1" y="316" width="38" height="13" rx="3" fill="#d9a43a"/></g>
      </svg>
      ${K.img("kettle", { x: 818, y: 140, w: 440, depth: 2, id: "bo-kettle", z: 3, alt: "Copper brew kettle on an azulejo plinth" })}
      <canvas id="bo-hatch" class="ks d1" width="187" height="95" style="left:942.8px;top:379.6px;width:126.2px;z-index:4"></canvas>
      <i class="bo-slit" aria-hidden="true"></i>
      <svg class="bo-out" viewBox="0 0 60 360" width="60" height="360" aria-hidden="true">
        <defs><linearGradient id="bo-cu2" gradientUnits="userSpaceOnUse" x1="14" x2="46" y1="0" y2="0"><stop offset="0" stop-color="#7a3a12"/><stop offset=".38" stop-color="#e8a066"/><stop offset=".55" stop-color="#c97a3a"/><stop offset="1" stop-color="#6e3210"/></linearGradient></defs>
        <path d="M30 20 V360" stroke="url(#bo-cu2)" stroke-width="30" fill="none"/>
        <rect x="8" y="6" width="44" height="30" rx="6" fill="#c9952c"/><rect x="12" y="10" width="36" height="8" rx="3" fill="#f0c766" opacity=".6"/>
        <rect x="20" y="120" width="20" height="170" rx="10" fill="#3f1f0c"/>
        <rect id="bo-flow" x="22" y="122" width="16" height="166" rx="8" fill="#e9a03a" opacity="0"/>
        <rect x="24" y="128" width="4" height="154" rx="2" fill="#fff6e2" opacity=".5"/>
        <rect x="11" y="110" width="38" height="13" rx="3" fill="#d9a43a"/><rect x="11" y="286" width="38" height="13" rx="3" fill="#d9a43a"/>
      </svg>
      <i class="bo-drop" aria-hidden="true"></i>
      <div class="bo-steam" aria-hidden="true">${Array.from({ length: 16 }, (_, i) => puff(i)).join("")}</div>
      <svg class="bo-strings" viewBox="0 0 1440 900" width="1440" height="900" aria-hidden="true">${HOPS.map((_, i) => `<line data-i="${i}" stroke="#d8c39a" stroke-width="2.2" stroke-linecap="round"/>`).join("")}</svg>
      <div class="bo-hops">${hops}</div>
      <img id="bo-rooster" class="ks d3" src="img/rooster.webp" alt="Barcelos rooster carrying hops" draggable="false" style="left:0;top:0;width:360px;z-index:9">
      <div class="bo-sched" id="bo-sched">
        <h3>Hop schedule</h3>
        <ol>${rows}</ol>
      </div></div>`;
    return K.box(art, { focus: 70 }) + `
      ${K.svc({ step: 2, brew: "The Boil", title: "Shopify Plus", href: "shopify-plus.html", cls: "bo-label",
        text: "Checkout extensions, Shopify Functions, B2B and Markets, built upgrade-safe." })}
      <div class="bo-toast" aria-live="polite"></div>
      <style>
        #boil .bo-world { position: absolute; left: 0; top: 0; width: 1440px; height: 900px; transform-origin: 0 0; }
        #boil .bo-winwrap { position: absolute; left: 70px; top: 92px; width: 400px; height: 400px; z-index: 1; }
        #boil .bo-tiles { position: absolute; inset: 0; border-radius: 200px 200px 6px 6px;
          background: radial-gradient(circle at 50% 50%, #1f4e9c 0 5px, transparent 6px), radial-gradient(circle at 0 0, #2c5aa8 0 9px, transparent 10px),
            radial-gradient(circle at 100% 0, #2c5aa8 0 9px, transparent 10px), radial-gradient(circle at 0 100%, #2c5aa8 0 9px, transparent 10px), radial-gradient(circle at 100% 100%, #2c5aa8 0 9px, transparent 10px),
            conic-gradient(from 45deg at 50% 50%, #fdfaf2 0 25%, #f1f4fa 0 50%, #fdfaf2 0 75%, #f1f4fa 0);
          background-size: 34px 34px;
          filter: drop-shadow(calc(var(--lx) * 3px) calc(var(--ly) * 4px) 3px rgba(10,20,40,.3)) drop-shadow(calc(var(--lx) * 18px) calc(var(--ly) * 28px) 20px rgba(10,20,40,.22)); }
        #boil .bo-win { position: absolute; inset: 24px 24px 24px; border-radius: 176px 176px 2px 2px; overflow: hidden; background: #d9cdb5; box-shadow: inset 6px 10px 18px rgba(0,0,0,.35); }
        #boil .bo-win img { position: absolute; left: -40%; top: -6%; width: 190%; max-width: none; will-change: transform; }
        #boil .bo-haze { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255,240,215,.0) 40%, rgba(255,236,205,.16)); box-shadow: inset 0 0 40px rgba(60,30,0,.25); }
        #boil .bo-sill { position: absolute; left: -16px; right: -16px; bottom: -14px; height: 26px; background: linear-gradient(#f6efe2, #ddd1bb); border-radius: 3px;
          filter: drop-shadow(calc(var(--lx) * 4px) calc(var(--ly) * 8px) 6px rgba(10,20,40,.3)); }
        #boil .bo-inlet { position: absolute; left: 700px; top: -320px; z-index: 2; overflow: visible; filter: drop-shadow(calc(var(--lx) * 4px) calc(var(--ly) * 6px) 4px rgba(10,20,40,.3)) drop-shadow(calc(var(--lx) * 16px) calc(var(--ly) * 24px) 16px rgba(10,20,40,.2)); }
        #boil #bo-in { transform-box: fill-box; transform-origin: 50% 0; }
        #boil .bo-out { position: absolute; left: 1220px; top: 590px; z-index: 2; overflow: visible; filter: drop-shadow(calc(var(--lx) * 4px) calc(var(--ly) * 6px) 4px rgba(10,20,40,.3)) drop-shadow(calc(var(--lx) * 16px) calc(var(--ly) * 24px) 16px rgba(10,20,40,.2)); }
        #boil .bo-drop { position: absolute; left: 1233px; top: 700px; width: 34px; height: 44px; z-index: 3; opacity: 0; border-radius: 50% 50% 50% 50% / 62% 62% 40% 40%;
          background: radial-gradient(circle at 36% 30%, #fff1c0 0 12%, #f4b84a 30%, #d9841c 75%); box-shadow: 0 0 30px 8px rgba(255,190,80,.6); }
        #boil .bo-slit { position: absolute; left: 952px; top: 398px; width: 106px; height: 24px; z-index: 3; border-radius: 50%; will-change: opacity; background: radial-gradient(closest-side, #1d0c03, #4a1f08 70%, transparent); opacity: 0; }
        #boil .bo-steam { position: absolute; inset: 0; z-index: 6; pointer-events: none; }
        #boil .bo-puff { position: absolute; left: 0; top: 0; width: 120px; height: 84px; opacity: 0; will-change: transform, opacity;
          filter: drop-shadow(calc(var(--lx) * 2px) calc(var(--ly) * 3px) 2px rgba(20,40,70,.18)) drop-shadow(calc(var(--lx) * 10px) calc(var(--ly) * 16px) 12px rgba(20,40,70,.16)); }
        #boil .bo-puff svg { display: block; width: 100%; height: 100%; }
        #boil .bo-strings { position: absolute; left: 0; top: 0; z-index: 7; pointer-events: none; overflow: visible; will-change: transform; }
        #boil .bo-hops { position: absolute; inset: 0; z-index: 8; pointer-events: none; }
        #boil .bo-hop { position: absolute; left: 0; top: 0; padding: 0; border: 0; background: none; cursor: pointer; pointer-events: auto; transform-origin: 22px 12px; will-change: transform, opacity; }
        #boil .bo-hop img { display: block; transition: scale .25s; }
        #boil .bo-hop:hover img, #boil .bo-hop:focus-visible img { scale: 1.12; }
        #boil .bo-hop:focus-visible { outline: 2px dashed #1f4e9c; outline-offset: 4px; }
        #boil .bo-mini { position: absolute; left: 31px; top: 86px; translate: -50% 0; white-space: nowrap; padding: 4px 9px 4px 15px; background: #f3e3bf; color: #3a2414; font: 800 10.5px Archivo, sans-serif; letter-spacing: .06em; text-transform: uppercase;
          clip-path: polygon(8px 0, 100% 0, 100% 100%, 8px 100%, 0 50%); filter: drop-shadow(2px 3px 2px rgba(0,0,0,.25)); }
        #boil .bo-sched { position: absolute; left: 470px; top: 512px; width: 262px; z-index: 5; padding: 16px 16px 10px; background: linear-gradient(170deg, #fffaf0, #f5e9d1); color: #2b1a12; border-radius: 3px; rotate: -1.2deg;
          filter: drop-shadow(calc(var(--lx) * 3px) calc(var(--ly) * 4px) 3px rgba(10,20,40,.28)) drop-shadow(calc(var(--lx) * 16px) calc(var(--ly) * 26px) 18px rgba(10,20,40,.22)); }
        #boil .bo-sched::before { content: ""; position: absolute; left: 50%; top: -9px; width: 18px; height: 18px; margin-left: -9px; border-radius: 50%; background: radial-gradient(circle at 40% 35%, #fff 0 20%, #e2463a 24% 70%, #a8281a 72%); }
        #boil .bo-sched h3 { margin: 0 0 10px; font: 400 17px "Archivo Black", Archivo, sans-serif; text-transform: uppercase; letter-spacing: .01em; color: #1f4e9c; }
        #boil .bo-sched h3 small { display: block; margin-top: 2px; font: 700 11px Archivo, sans-serif; letter-spacing: .06em; color: #8a6a4a; text-transform: none; }
        #boil .bo-sched ol { list-style: none; margin: 0; padding: 0; }
        #boil .bo-row { position: relative; padding: 7px 0 7px 64px; border-top: 1px dashed rgba(43,26,18,.2); cursor: pointer; }
        #boil .bo-min { position: absolute; left: 0; top: 13px; font: 800 10.5px Archivo, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: #8a6a4a; }
        #boil .bo-row .ktag { font-size: 11.5px; padding: 6px 11px 6px 19px; opacity: .38; filter: grayscale(1); transition: opacity .4s, filter .4s; transform-origin: 0 50%; }
        #boil .bo-row p { margin: 0; max-height: 0; overflow: hidden; font: 600 12.5px/1.4 Archivo, sans-serif; color: #4a3424; transition: max-height .5s ease, margin .5s ease; }
        #boil .bo-row.on .ktag { opacity: 1; filter: none; --tc: #f2c14e; }
        #boil .bo-row.on .bo-min { color: #c46a1f; }
        #boil .bo-row.open p { max-height: 130px; margin-top: 6px; }
        #boil .bo-label { left: 5.4%; top: 58%; max-width: min(370px, 25.5vw); }
        #boil .bo-toast { display: none; }
        /* phones in landscape: label text and the hop schedule ran off the bottom */
        @media (max-height: 500px) and (min-aspect-ratio: 1/1) {
          #boil .bo-label { top: auto; bottom: 10px; }
          #boil .bo-sched { top: 250px; }
        }
        @media (max-aspect-ratio: 1/1) {
          #boil .bo-sched { display: none; }
          #boil .bo-toast { display: block; position: absolute; z-index: 7; left: 16px; right: 16px; top: auto; bottom: 18px; padding: 12px 14px; background: #fffaf0; color: #2b1a12; border-radius: 6px; font: 600 13.5px/1.4 Archivo, sans-serif;
            box-shadow: 6px 12px 24px rgba(10,30,60,.18); opacity: 0; transform: translateY(-10px); transition: opacity .35s, transform .35s; }
          #boil .bo-toast.show { opacity: 1; transform: none; }
          #boil .bo-toast b { display: block; font: 400 15px "Archivo Black", sans-serif; text-transform: uppercase; color: #1f4e9c; margin-bottom: 2px; }
        }
      </style>`;
  },
  init: (stage, K, st) => {
    const $ = s => stage.querySelector(s), $$ = s => [...stage.querySelectorAll(s)];
    const rooster = $("#bo-rooster"), hopsEl = $$(".bo-hop"), lines = $$(".bo-strings line"), rows = $$(".bo-row");
    const puffs = $$(".bo-puff"), hatch = $("#bo-hatch"), slit = $(".bo-slit"), douro = $(".bo-win img"), toast = $(".bo-toast");
    const NAMES = ["Checkout extensions", "Shopify Functions", "B2B", "Markets"];
    const P = innerWidth / innerHeight < 1;
    if (P) { // portrait phones: shrink the world so kettle, rooster and the exit pipe all fit above the label
      const world = $(".bo-world"), fitP = () => { const box = world.parentElement, W = stage.clientWidth, sc = Math.max(W / 1440, stage.clientHeight / 900);
        const m = box.style.transform.match(/translate\(([-\d.]+)px/), tx = m ? +m[1] : 0, z = .6;
        world.style.transform = `translate(${(-tx / sc + W / sc / 2 - 1010 * z).toFixed(1)}px, 150px) scale(${z})`; };
      fitP(); addEventListener("resize", fitP);
    }

    // cut the hatch lid out of the kettle sprite so it can rattle
    const kimg = new Image(); kimg.src = "img/kettle.webp";
    kimg.decode().then(() => {
      // real azulejo tiles for the window frame, sampled from the plinth
      const tc = document.createElement("canvas"); tc.width = tc.height = 120; const tx = tc.getContext("2d");
      tx.drawImage(kimg, 262, 945, 128, 128, 0, 0, 120, 120);
      $(".bo-tiles").style.background = `url(${tc.toDataURL("image/jpeg", .85)}) 0 0 / 50px 50px`;
      const c = hatch.getContext("2d"); c.translate(-185, -355); c.beginPath();
      [[190, 437], [222, 362], [352, 363], [368, 427], [345, 445], [203, 445]].forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
      c.closePath(); c.clip(); c.drawImage(kimg, 0, 0);
    }).catch(() => {});

    /* ---------- live state ---------- */
    const S = { cx: 270, cy: 290, rs: .12, boil: .35, drop: [0, 0, 0, 0], click: [0, 0, 0, 0], rattle: 0, par: 0, gone: 0 };
    const RT = { v: 0 }, HATCH = [1006, 410], FEET = [-16, 99];
    const HANG = [[-72, 30], [-24, 88], [24, 34], [72, 92]];
    const landed = [false, false, false, false];
    const steam = puffs.map((el, i) => ({ el, ph: i / puffs.length, dx: ((i * 61) % 140) - 70, sp: .1 + ((i * 17) % 10) / 100, hatch: i >= 12, life: 0 }));
    let tt = 0, last = 0;

    const pop = (i, open = true) => {
      const r = rows[i]; r.classList.add("on"); if (open) { rows.forEach(o => o !== r && o.classList.remove("open")); r.classList.add("open"); }
      gsap.fromTo(r.querySelector(".ktag"), { scale: .6, rotation: -6 }, { scale: 1, rotation: 0, duration: .7, ease: "elastic.out(1,.45)" });
      if (P) { toast.innerHTML = `<b>${NAMES[i]}</b>${r.querySelector("p").textContent}`; toast.classList.add("show"); clearTimeout(pop.t); pop.t = setTimeout(() => toast.classList.remove("show"), 3800); }
    };
    const splash = () => {
      RT.v = 1; gsap.to(RT, { v: 0, duration: .9, ease: "power2.out", overwrite: true });
      steam.filter(s => s.hatch).forEach((s, k) => { s.life = 1; s.ph = 0; s.dx = (k - 1.5) * 50; });
    };

    const render = (time) => {
      const dt = Math.min(.05, time - last || 0); last = time; tt += dt;
      // rooster: flight path from the timeline + wing-bob idle
      const bob = Math.sin(tt * 6.5), flap = Math.sin(tt * 13);
      const rx = S.cx - 180, ry = S.cy - 140 + bob * 7 * S.rs;
      rooster.style.transform = `translate(${rx}px, ${ry}px) scale(${S.rs}, ${S.rs * (1 + flap * .025)}) rotate(${(bob * 3 - 4).toFixed(2)}deg)`;
      rooster.classList.toggle("d3", S.rs > .45); rooster.style.filter = S.rs > .45 ? "" : "none";
      const fx = S.cx + FEET[0] * S.rs, fy = S.cy + (FEET[1] + bob * 7) * S.rs;
      // hops: hang from the feet, or fall into the hatch
      hopsEl.forEach((h, i) => {
        const d = Math.min(1, Math.max(S.drop[i], S.click[i]));
        const sway = Math.sin(tt * 2.4 + i * 1.3) * 7;
        const hx = fx + HANG[i][0] * S.rs + sway * .4, hy = fy + HANG[i][1] * S.rs;
        let x = hx, y = hy, r = sway, sc = S.rs, o = 1;
        if (d > 0) {
          x = hx + (HATCH[0] - hx) * d; y = hy + (HATCH[1] - hy) * d * d - Math.sin(Math.PI * d) * 70;
          r = sway + d * 300; sc = S.rs + (.55 - S.rs) * d; o = d > .9 ? (1 - d) * 10 : 1;
        }
        h.style.transform = `translate(${(x - 22).toFixed(1)}px, ${(y - 12).toFixed(1)}px) rotate(${r.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
        h.style.opacity = o; h.style.pointerEvents = d > 0 || S.rs < .8 ? "none" : "auto";
        h.querySelector(".bo-mini").style.opacity = d > 0 ? Math.max(0, 1 - d * 4) : (S.rs > .8 ? 1 : 0);
        const ln = lines[i];
        if (d > 0 || S.gone) ln.setAttribute("opacity", 0);
        else { ln.setAttribute("opacity", Math.min(1, S.rs * 1.4)); ln.setAttribute("x1", fx); ln.setAttribute("y1", fy); ln.setAttribute("x2", hx); ln.setAttribute("y2", hy); }
        if (d >= .96 && !landed[i]) { landed[i] = true; splash(); pop(i, true); }
        if (d < .5 && landed[i]) { landed[i] = false; rows[i].classList.remove("on", "open"); }
      });
      // lid rattle + steam
      const rat = Math.max(RT.v, Math.max(0, S.boil - .75) * 1.6);
      hatch.style.transform = rat > .02 ? `translateY(${(-Math.abs(Math.sin(tt * 38)) * 5 * rat).toFixed(2)}px) rotate(${(Math.sin(tt * 29) * 2.2 * rat).toFixed(2)}deg)` : "";
      slit.style.opacity = (rat * .9).toFixed(3);
      steam.forEach((s, i) => {
        let ox, oy, h, vis;
        if (s.hatch) { if (s.life <= 0) { s.el.style.opacity = 0; return; } s.ph += dt * .55; if (s.ph >= 1) { s.life = 0; s.el.style.opacity = 0; return; } ox = HATCH[0] + s.dx * s.ph; oy = HATCH[1] - 10 - s.ph * 200; h = 1; vis = 1; }
        else { s.ph = (s.ph + dt * s.sp * (.6 + S.boil)) % 1; ox = 1027 + s.dx * s.ph * 1.3 + Math.sin(tt * .8 + i) * 22 * s.ph; oy = 136 - s.ph * 420; vis = i / 12 < .25 + S.boil * .9 ? 1 : 0; h = 1; }
        const f = s.ph, sc = .5 + f * 1.9;
        s.el.style.opacity = (vis * Math.min(1, f * 6) * Math.min(1, (1 - f) * 2.2) * .88).toFixed(3);
        s.el.style.transform = `translate(${(ox - 60).toFixed(1)}px, ${(oy - 42).toFixed(1)}px) scale(${sc.toFixed(3)}) rotate(${((i % 2 ? 1 : -1) * f * 14).toFixed(1)}deg)`;
      });
      douro.style.transform = `translate(${(-S.par * 60 + ((K.lx || 1) - 1) * -8).toFixed(1)}px, ${(S.par * 16).toFixed(1)}px)`;
    };

    // clicks: toss a hop in early; clicking a schedule line re-opens its note
    hopsEl.forEach((h, i) => h.addEventListener("click", () => gsap.to(S.click, { [i]: 1, duration: .75, ease: "power1.in" })));
    rows.forEach((r, i) => r.addEventListener("click", () => {
      if (r.classList.contains("on")) { r.classList.contains("open") ? r.classList.remove("open") : pop(i, true); }
      else gsap.to(S.click, { [i]: 1, duration: .75, ease: "power1.in" });
    }));

    if (K.reduced) {
      Object.assign(S, { cx: 1180, cy: 150, rs: 1, boil: .6, drop: [1, 1, 1, 1] });
      rows.forEach(r => r.classList.add("on")); rows[0].classList.add("open");
      gsap.set("#bo-flow", { opacity: 1 }); landed.fill(true); render(0); return;
    }
    gsap.ticker.add(render);

    /* ---------- the scrubbed story ---------- */
    const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { ...st, scrub: 1 } });
    tl.fromTo("#bo-in", { scaleY: 0 }, { scaleY: 1, duration: .1 }, 0)
      .to(S, { par: 1, duration: 1 }, 0)
      .to(S, { boil: .7, duration: .3 }, .05)
    // rooster flies out of the Douro window toward the kettle
      .to(S, { cx: 560, duration: .14, ease: "power1.in" }, .02).to(S, { cy: 120, rs: .62, duration: .14, ease: "power1.inOut" }, .02)
      .to(S, { cx: 840, duration: .14, ease: "power1.out" }, .16).to(S, { cy: 170, rs: 1, duration: .14, ease: "power2.out" }, .16)
    // ...drifts slowly right over the kettle, dropping hops one at a time
      .to(S, { cx: 1190, cy: 196, duration: .3, ease: "sine.inOut" }, .3);
    [.38, .48, .58, .68].forEach((t, i) => tl.to(S.drop, { [i]: 1, duration: .06, ease: "power1.in" }, t));
    tl.to(S, { boil: 1, duration: .1 }, .72)
    // rooster heads off; hot wort leaves at the bottom (x≈1250) toward the chiller
      .to(S, { cx: 1700, cy: -120, rs: .7, duration: .12, ease: "power2.in" }, .8)
      .set(S, { gone: 1 }, .8)
      .to("#bo-flow", { opacity: 1, duration: .04 }, .86)
      .to(".bo-drop", { opacity: 1, scale: 1, duration: .02 }, .88)
      .to(".bo-drop", { y: 260, duration: .1, ease: "power2.in" }, .9)
      .to({}, { duration: .01 }, .99);
    gsap.set(".bo-drop", { opacity: 0, scale: .4 });
  }
});
