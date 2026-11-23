/* 80 · BAR — SERVING. The footer: a cosy tasca at night.
   Azulejo wall in pools of warm bulb light, the bar counter big at the bottom, Barril behind it raising a pint.
   Cork coasters tacked to the wall are the footer links. Barril alternates "Saúde!" / "Cheers!" in a paper bubble;
   click him and he clinks: pint tilt + a Physics2D foam burst. */
(function () {
  const K = window.K;
  const tile = (fg, bg, alt) => {
    const s = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><rect width='40' height='40' fill='${bg}'/>
      <g fill='${fg}'><circle r='9'/><circle cx='40' r='9'/><circle cy='40' r='9'/><circle cx='40' cy='40' r='9'/>
      ${[0, 90, 180, 270].map(a => `<ellipse cx='20' cy='10.5' rx='3.4' ry='6.2' transform='rotate(${a} 20 20)'/>`).join("")}
      <circle cx='20' cy='20' r='3.2'/><circle cx='20' cy='1.5' r='1.6'/><circle cx='20' cy='38.5' r='1.6'/><circle cx='1.5' cy='20' r='1.6'/><circle cx='38.5' cy='20' r='1.6'/></g>
      <g fill='${bg}'><circle r='4.2'/><circle cx='40' r='4.2'/><circle cy='40' r='4.2'/><circle cx='40' cy='40' r='4.2'/><circle cx='20' cy='20' r='1.3'/></g>
      <g fill='${alt || fg}' opacity='.55'>${[45, 135, 225, 315].map(a => `<circle cx='20' cy='9' r='1.4' transform='rotate(${a} 20 20)'/>`).join("")}</g>
      <rect x='.5' y='.5' width='39' height='39' fill='none' stroke='rgba(60,40,20,.14)'/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(s.replace(/\s+/g, " "))}")`;
  };
  const BULBS = [[330, 150, -1], [720, 70, 1], [1180, 40, -1]];          // x, cord length, sway phase
  const COASTERS = [
    ["Themes", "custom brews", "themes.html", "#e9a03a"], ["Shopify Plus", "the big kegs", "shopify-plus.html", "#2457a8"],
    ["Apps", "on tap", "apps.html", "#3e8a4f"], ["Launch", "pop the cap", "launch.html", "#e2463a"],
    ["LinkedIn", "my tab ↗", "https://www.linkedin.com/in/germanjit-singh-sandhu", "#2457a8"], ["GitHub", "the cellar ↗", "https://github.com/ambduu", "#2b1a12"],
    ["Email", "write in", "mailto:ambduu@gmail.com", "#c46a1f"],
  ];

  SCENES.push({
    id: "bar", order: 80, height: 110, bg: "#1d1726", headerTone: "light",
    html: (K) => K.box(`
      <div class="br-wall"></div>
      <div class="br-wains"></div>
      <div class="br-night"></div>
      ${BULBS.map(([x, L], i) => `<div class="br-bulb" style="left:${x}px;--L:${L}px" data-i="${i}"><i class="br-cord"></i><i class="br-glow"></i><i class="br-sock"></i><i class="br-glass"></i></div>`).join("")}
      <button class="br-barril" id="br-barril" type="button" aria-label="Clink glasses with Barril">${K.img("barril-cheers", { w: 360, depth: 2, alt: "" })}</button>
      <div class="br-bubble" id="br-bubble" aria-hidden="true"><span id="br-say">Saúde!</span></div>
      ${K.img("bar", { x: 560, y: 300, w: 820, depth: 3, id: "br-bar", z: 4 })}
      <div class="br-foam" id="br-foam"></div>
    `, { focus: 74 }) + `
      <div class="br-ov" id="br-ov">
        <p class="br-kick">Last stop · Serving</p>
        <h2 class="br-title" id="br-title">Pull up<br>a stool.</h2>
        <p class="br-txt">The bar's open. Grab a coaster to see what's on tap, or just raise a glass.</p>
        <nav class="br-coasters" aria-label="Footer">
          ${COASTERS.map(([t, s, h, c], i) => `<a class="br-co" href="${h}"${/^https/.test(h) ? ' target="_blank" rel="noopener"' : ""} style="--c:${c};--r:${[-8, 5, -3, 9, -6, 4, -10][i]}deg"><b>${t}</b><small>${s}</small></a>`).join("")}
        </nav>
      </div>
      <footer class="br-foot"><span>© Germanjit Singh Sandhu · codebrew.pt</span><a href="#top">Back to the top shelf ↑</a></footer>
      <style>
        /* clip, not hidden: focusing a link/field inside the sticky stage must not scroll the stage itself (it did: tabbing
           to the coasters shifted the bar 236px up on phones, and tabbing the slip slid the tram stage 548px sideways) */
        #bar .jstage { overflow: clip; }
        #bar .jstage { background: #1d1726; }
        .br-wall { position: absolute; left: -40px; top: -40px; width: 1520px; height: 700px; background: ${tile("#2457a8", "#efe8d8", "#7d9fd6")} 0 0/58px 58px; }
        .br-wains { position: absolute; left: -40px; top: 620px; width: 1520px; height: 340px; background: repeating-linear-gradient(90deg, #5a3520 0 58px, #4a2a18 58px 61px, #63402a 61px 64px); box-shadow: 0 -10px 0 #7a4a2a, 0 -14px 0 #3a2012; }
        .br-night { position: absolute; left: -40px; top: -40px; width: 1520px; height: 1000px; mix-blend-mode: multiply; pointer-events: none;
          background: radial-gradient(circle at 370px 290px, #ffe1b0 0, rgba(255,225,176,0) 360px), radial-gradient(circle at 760px 200px, #ffe1b0 0, rgba(255,225,176,0) 330px), radial-gradient(circle at 1220px 160px, #ffe1b0 0, rgba(255,225,176,0) 380px), #3b3150; }
        .br-bulb { position: absolute; top: -20px; width: 0; height: 0; z-index: 3; transform-origin: 0 0; }
        .br-cord { position: absolute; left: -1.5px; top: 0; width: 3px; height: var(--L); background: #241a16; }
        .br-sock { position: absolute; left: -10px; top: var(--L); width: 20px; height: 26px; border-radius: 3px 3px 2px 2px; background: linear-gradient(90deg, #3a2c24, #6a5446 45%, #2a1f1a); }
        .br-glass { position: absolute; left: -22px; top: calc(var(--L) + 22px); width: 44px; height: 58px; border-radius: 50% 50% 46% 46% / 44% 44% 56% 56%;
          background: radial-gradient(circle at 38% 34%, #fffbe8 0 14%, #ffe39a 30%, #ffb648 72%, #e98d2a); box-shadow: 0 0 18px 6px rgba(255,196,96,.75), 0 0 60px 20px rgba(255,170,70,.35); }
        .br-glass::after { content: ""; position: absolute; left: 14px; top: 16px; width: 16px; height: 18px; border: 2px solid rgba(160,70,10,.55); border-top: 0; border-radius: 0 0 8px 8px; }
        .br-glow { position: absolute; left: -230px; top: calc(var(--L) - 180px); width: 460px; height: 460px; border-radius: 50%; mix-blend-mode: screen; pointer-events: none;
          background: radial-gradient(circle, rgba(255,190,100,.42) 0, rgba(255,170,80,.16) 35%, rgba(255,160,70,0) 68%); }
        .br-bulb.off .br-glass { background: #8a6a40; box-shadow: none; } .br-bulb.off .br-glow { opacity: .15; }
        .br-barril { position: absolute; left: 1040px; top: 168px; transform-origin: 50% 90%; width: 360px; height: 424px; z-index: 3; padding: 0; border: 0; background: none; cursor: pointer; }
        .br-barril .ks { left: 0; top: 0; transform-origin: 50% 90%; }
        .br-barril:focus-visible { outline: 3px solid #ffe27a; outline-offset: 4px; border-radius: 30px; }
        .br-bubble { position: absolute; left: 830px; top: 196px; z-index: 5; min-width: 168px; padding: 16px 22px 14px; background: #fff8ea; color: #2b1a12; border-radius: 26px; text-align: center;
          font: 400 34px/1 "Archivo Black", sans-serif; text-transform: uppercase; transform-origin: 100% 100%;
          filter: drop-shadow(calc(var(--lx) * 3px) calc(var(--ly) * 4px) 2px rgba(0,0,0,.35)) drop-shadow(calc(var(--lx) * 14px) calc(var(--ly) * 22px) 14px rgba(0,0,0,.3)); }
        .br-bubble::after { content: ""; position: absolute; right: 18px; bottom: -22px; width: 34px; height: 26px; background: #fff8ea; clip-path: polygon(0 0, 100% 0, 100% 100%); }
        .br-bubble span { display: inline-block; }
        #br-bar { pointer-events: none; }
        .br-foam { position: absolute; left: 0; top: 0; z-index: 6; pointer-events: none; }
        .br-foam i { position: absolute; left: 0; top: 0; border-radius: 50%; background: #fff8ea; box-shadow: inset -3px -3px 0 rgba(233,190,120,.5); }
        /* overlay copy + cork coasters */
        .br-ov { position: absolute; z-index: 6; left: 6vw; top: max(120px, 24vh); width: min(560px, 40vw); color: #fff3d6; }
        .br-wall::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(14,10,24,.78) 0, rgba(14,10,24,.25) 150px, transparent 260px), linear-gradient(90deg, rgba(14,10,24,.82) 0, rgba(14,10,24,.55) 560px, transparent 820px); }
        .br-kick { margin: 0 0 10px; font: 800 13px Archivo, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #ffe27a; }
        .br-title { margin: 0; font: 400 clamp(44px, 5.2vw, 84px)/.9 "Archivo Black", sans-serif; text-transform: uppercase; letter-spacing: -.02em; text-shadow: 4px 8px 18px rgba(0,0,0,.35); }
        .br-txt { margin: 16px 0 26px; max-width: 26em; font: 600 clamp(15px, 1.2vw, 18px)/1.5 Archivo, sans-serif; color: #f2e4cc; }
        .br-coasters { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px 10px; max-width: 520px; }
        .br-coasters a:nth-child(n+5) { transform: translateX(55%); }
        .br-co { position: relative; display: grid; place-content: center; text-align: center; aspect-ratio: 1; width: 100%; max-width: 120px; border-radius: 50%; text-decoration: none; color: #2b1a12; rotate: var(--r);
          background-color: #c9925a;
          background-image: radial-gradient(circle, transparent 0 58%, var(--c) 58.5% 63%, transparent 63.5%),
            radial-gradient(circle at 20% 30%, rgba(90,50,20,.4) 0 1.2px, transparent 1.6px), radial-gradient(circle at 70% 60%, rgba(255,230,190,.4) 0 1px, transparent 1.5px), radial-gradient(circle at 45% 80%, rgba(90,50,20,.32) 0 1.5px, transparent 2px);
          background-size: 100% 100%, 9px 11px, 7px 9px, 13px 10px;
          box-shadow: inset 0 0 0 5px #b98250, inset 0 -6px 10px rgba(80,40,10,.25);
          filter: drop-shadow(calc(var(--lx) * 2px) calc(var(--ly) * 3px) 1.5px rgba(0,0,0,.45)) drop-shadow(calc(var(--lx) * 12px) calc(var(--ly) * 18px) 10px rgba(0,0,0,.4));
          transition: rotate .35s cubic-bezier(.2,1.6,.4,1), translate .35s cubic-bezier(.2,1.6,.4,1); }
        .br-co::before { content: ""; position: absolute; left: 50%; top: 9px; width: 9px; height: 9px; margin-left: -4.5px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #e9e4dc, #8a8178); }
        .br-co b { font: 400 clamp(13px, 1.05vw, 16px)/1 "Archivo Black", sans-serif; text-transform: uppercase; letter-spacing: -.01em; }
        .br-co small { margin-top: 4px; font: 800 9.5px Archivo, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: #6a3a14; }
        .br-co:hover, .br-co:focus-visible { rotate: 0deg; translate: 0 -6px; }
        .br-co:focus-visible { outline: 3px solid #ffe27a; outline-offset: 3px; }
        .br-foot { position: absolute; z-index: 7; left: 0; right: 0; bottom: 0; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;
          padding: 14px 6vw; background: linear-gradient(rgba(20,12,8,0), rgba(20,12,8,.82) 40%); color: #e9dcc4; font: 600 13px Archivo, sans-serif; }
        .br-foot a { color: #ffe27a; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; text-decoration: none; font-size: 12.5px; }
        .br-foot a:hover { text-decoration: underline; text-underline-offset: 5px; }
        /* short landscape screens (1288x586, 1280x720 with browser chrome): keep the coasters clear of the footer */
        @media (min-aspect-ratio: 1/1) and (max-height: 760px) {
          .br-ov { top: max(92px, 16vh); }
          .br-title { font-size: clamp(40px, min(5.2vw, 9vh), 84px); }
          .br-txt { margin: 10px 0 16px; }
          .br-coasters { max-width: min(440px, 36vw); gap: 10px 8px; }
        }
        /* phones held sideways */
        @media (min-aspect-ratio: 1/1) and (max-height: 500px) {
          .br-ov { top: 58px; width: min(460px, 52vw); }
          .br-kick { margin-bottom: 4px; font-size: 11px; } .br-title { font-size: 30px; } .br-txt { display: none; }
          .br-coasters { margin-top: 12px; max-width: 330px; gap: 6px; } .br-co small { display: none; } .br-co b { font-size: 11px; }
          .br-foot { padding: 8px 20px; font-size: 11.5px; }
        }
        @media (max-aspect-ratio: 1/1) {
          .br-ov { left: 20px; right: 20px; width: auto; top: 86px; }
          .br-title { font-size: 44px; } .br-txt { margin: 10px 0 16px; font-size: 14.5px; } .br-kick { font-size: 11.5px; margin-bottom: 6px; }
          .br-coasters { gap: 8px; max-width: 360px; }
          .br-co small { font-size: 8px; } .br-co b { font-size: 12px; }
          .br-foot { padding: 12px 20px; font-size: 12px; }
          #br-bar { left: 790px !important; top: 590px !important; width: 500px !important; }
          .br-barril { left: 1020px; top: 530px; width: 230px; height: 271px; } .br-barril .ks { width: 230px !important; }
          .br-bubble { left: 880px; top: 484px; min-width: 0; padding: 10px 14px 9px; font-size: 22px; }
          .br-coasters a:nth-child(n+5) { transform: translateX(45%); }
        }
        /* ~660px-tall phones (iPhone 12-15, small Androids): the coaster rows reach Barril's head + the bubble, so the counter steps down */
        @media (max-aspect-ratio: 1/1) and (max-height: 720px) {
          #br-bar { top: 690px !important; }
          .br-barril { top: 632px; } .br-bubble { top: 600px; }
        }
      </style>`,

    init: (stage, K, st) => {
      const $ = s => stage.querySelector(s);
      // fallback for engines without overflow:clip: undo any focus-driven scroll of the stage box
      stage.addEventListener("scroll", () => { if (stage.scrollTop || stage.scrollLeft) stage.scrollTop = stage.scrollLeft = 0; }, { passive: true });
      const bulbs = [...stage.querySelectorAll(".br-bulb")], barril = $("#br-barril"), bimg = barril.querySelector(".ks"), bubble = $("#br-bubble"), say = $("#br-say");
      const bar = $("#br-bar"), foam = $("#br-foam"), coasters = [...stage.querySelectorAll(".br-co")];
      const tl = gsap.timeline({ scrollTrigger: { trigger: st.trigger, start: "top bottom", end: "top top", scrub: 1 } });
      if (!K.reduced) {
        tl.from(bulbs, { y: -260, duration: .5, stagger: .08, ease: "power2.out" }, 0)
          .from(bar, { y: 220, duration: .6, ease: "power3.out" }, .1)
          .from(barril, { y: 300, duration: .5, ease: "back.out(1.6)" }, .35)
          .from(bubble, { scale: 0, rotation: -20, duration: .25, ease: "back.out(2)" }, .7)
          .from(".br-ov > :not(nav)", { y: 60, opacity: 0, duration: .4, stagger: .08 }, .2)
          .from(coasters, { y: 120, rotation: (i) => i % 2 ? 40 : -40, opacity: 0, duration: .4, stagger: .05, ease: "back.out(1.4)" }, .45);
        // idle life
        bulbs.forEach((b, i) => gsap.to(b, { rotation: BULBS[i][2] * 2.2, duration: 2.6 + i * .5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: i * .3 }));
        gsap.to(bimg, { y: -6, rotation: -1.2, duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
        const flicker = () => { const b = bulbs[Math.floor(Math.random() * bulbs.length)];
          gsap.timeline().set(b, { className: "br-bulb off" }, 0).set(b, { className: "br-bulb" }, .07).set(b, { className: "br-bulb off" }, .16).set(b, { className: "br-bulb" }, .22);
          gsap.delayedCall(4 + Math.random() * 6, flicker); };
        gsap.delayedCall(5, flicker);
      }
      // speech bubble: Saúde! / Cheers! (SplitText pop)
      const words = ["Saúde!", "Cheers!"]; let wi = 0;
      const speak = (w) => {
        say.textContent = w;
        if (K.reduced) return;
        if (window.SplitText) { const sp = new SplitText(say, { type: "chars" }); gsap.from(sp.chars, { y: 14, scale: .4, opacity: 0, duration: .45, stagger: .04, ease: "back.out(3)", onComplete: () => sp.revert() }); }
        gsap.fromTo(bubble, { scale: .9 }, { scale: 1, duration: .5, ease: "elastic.out(1,.4)" });
      };
      let onScreen = false;
      ScrollTrigger.create({ trigger: st.trigger, start: "top bottom", end: "bottom top", onToggle: s => (onScreen = s.isActive) });
      const cycle = () => { if (!onScreen || document.hidden) return; wi = (wi + 1) % words.length; speak(words[wi]); };
      let timer = setInterval(cycle, 2600);
      // click: clink!
      const pintPos = () => { const r = bimg.getBoundingClientRect(), br = stage.querySelector(".kbox").getBoundingClientRect(), sc = br.width / 1440;
        return [(r.left - br.left + r.width * .14) / sc, (r.top - br.top + r.height * .08) / sc]; };
      barril.addEventListener("click", () => {
        clearInterval(timer); speak(wi ? "Cheers!" : "Saúde!"); timer = setInterval(cycle, 2600);
        if (K.reduced) return;
        gsap.timeline().to(barril, { rotation: -9, scale: 1.03, duration: .16, ease: "power2.out", overwrite: "auto" }).to(barril, { rotation: 0, scale: 1, duration: .9, ease: "elastic.out(1,.35)" });
        const [x, y] = pintPos();
        for (let i = 0; i < 18; i++) {
          const d = document.createElement("i"), s = 8 + Math.random() * 16; d.style.width = d.style.height = s + "px"; foam.appendChild(d);
          gsap.set(d, { x: x - s / 2, y: y - s / 2 });
          gsap.to(d, { physics2D: { velocity: 220 + Math.random() * 320, angle: 215 + Math.random() * 110, gravity: 900 }, duration: 1.1 + Math.random() * .5, ease: "none" });
          gsap.to(d, { opacity: 0, scale: .4, duration: .5, delay: .7 + Math.random() * .5, onComplete: () => d.remove() });
        }
        gsap.fromTo(bar, { y: 0 }, { y: 3, duration: .08, yoyo: true, repeat: 1 });
      });
    }
  });
})();
