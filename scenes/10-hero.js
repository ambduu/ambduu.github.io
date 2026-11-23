/* 10 · HERO — Barril the barrel brewmaster takes your order (Alfred-style layout).
   The order ticket is LIVE: what you type rides along the whole brew and arrives pre-filled in the contact form.
   On scroll, Barril plucks a barley grain from the stalks and flicks it down into the mill below. */
SCENES.push({
  id: "top", order: 10, height: 170, bg: "#e9a03a", headerTone: "light",
  html: (K) => K.box(`
      ${K.img("barley", { x: 1210, y: 300, w: 120, depth: 1, id: "h-barley1", rot: -8, z: 1 })}
      ${K.img("barley", { x: 1262, y: 330, w: 110, depth: 1, id: "h-barley2", rot: 6, z: 1 })}
      <div class="h-crate"></div>
      ${K.img("barril-wave", { x: 700, y: 170, w: 470, depth: 3, id: "h-barril", z: 3 })}
      <i class="h-grain" id="h-grain"></i>
      ${K.at(`<form class="h-ticket" id="h-ticket" autocomplete="off" onsubmit="return false">
          <b>Order #1001</b><small>Table: your store · Server: Barril</small>
          <label for="h-order">What are we brewing?</label>
          <textarea id="h-order" rows="3" maxlength="240" placeholder="e.g. a Shopify Plus checkout revamp"></textarea>
          <span class="h-tk-foot">Barril will carry this all the way to the bar ↓</span>
        </form>`, { x: 1130, y: 470, w: 250, z: 4, id: "h-ticketwrap" })}
    `, { focus: 64 }) + `
    <div class="h-copy">
      <p class="h-kick">Shopify &amp; Shopify Plus developer · 200+ stores since 2015</p>
      <h1 class="h-title">Olá! Germanjit,<br>on tap.</h1>
      <p class="h-txt">I build custom themes, Shopify Plus checkouts, apps and the back ends behind them, for brands and agencies, from a sunny corner of Portugal.</p>
      <p class="h-ctas"><a class="h-cta" href="#taproom">See my work <i>↓</i></a><a class="h-cta2" href="#tram">Start a project</a></p>
      <a class="h-partner" href="https://www.shopify.com/partners/directory/partner/ambduu" target="_blank" rel="noopener" aria-label="Shopify Partner: view Germanjit's Shopify Partner Directory profile (opens in a new tab)"><i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z" fill="#5e8e3e"/></svg></i><span><b>Shopify Partner</b><small>Shopify &amp; Shopify Plus · view profile ↗</small></span></a>
    </div>
    <a class="h-arrow" href="#mill" aria-label="Scroll down to start the brew"><i></i></a>
    <div class="h-bar">
      <a href="mailto:ambduu@gmail.com"><small>Ask</small>Germanjit</a>
      <a class="h-bar-partner" href="https://www.shopify.com/partners/directory/partner/ambduu" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z" fill="#5e8e3e"/></svg><span><small>Shopify</small>Partner ↗</span></a>
      <a href="#taproom"><small>The</small>Tap room</a>
      <a href="#tram"><small>Hire him for</small>Your next store</a>
      <span class="h-bar-social"><a href="https://www.linkedin.com/in/germanjit-singh-sandhu" target="_blank" rel="noopener" aria-label="LinkedIn">in</a><a href="https://github.com/ambduu" target="_blank" rel="noopener" aria-label="GitHub">gh</a></span>
    </div>
    <style>
      .h-copy { position: absolute; z-index: 5; left: 8vw; top: 18vh; width: min(470px, 36vw); }
      .h-kick { display: inline-block; margin: 0 0 16px; padding: 7px 12px; background: #2b1a12; color: #ffe27a; font: 800 clamp(11.5px, .92vw, 14px)/1.25 Archivo, sans-serif; letter-spacing: .1em; text-transform: uppercase; }
      .h-title { margin: 0; font-family: "Archivo Black", sans-serif; font-weight: 400; font-size: clamp(44px, 5.2vw, 84px); line-height: .9; letter-spacing: -.02em; text-transform: uppercase; }
      .h-txt { margin: 18px 0 20px; font: 700 clamp(15px, 1.2vw, 18px)/1.5 Archivo, sans-serif; color: #2b1a12; }
      @media (min-width: 1101px) and (min-height: 501px) { .h-kick { white-space: nowrap; } }
      .h-ctas { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 20px; margin: 0; }
      .h-cta { display: inline-flex; align-items: center; gap: 10px; padding: 14px 22px; background: #2b1a12; color: #ffe27a; text-decoration: none; font: 800 15px Archivo, sans-serif; letter-spacing: .08em; text-transform: uppercase; box-shadow: 4px 8px 16px rgba(60,30,0,.25); }
      .h-cta i { font-style: normal; display: inline-block; transition: transform .25s; } .h-cta:hover i { transform: translateY(4px); }
      .h-partner { display: inline-flex; align-items: center; gap: 10px; margin-top: 18px; padding: 8px 14px 8px 9px; background: #fffaf0; color: #2b1a12; text-decoration: none; border-radius: 999px;
        box-shadow: 0 2px 0 rgba(43,26,18,.18), 4px 10px 18px rgba(60,30,0,.16); transition: transform .2s, box-shadow .2s; }
      .h-partner:hover { transform: translateY(-2px); box-shadow: 0 3px 0 rgba(43,26,18,.2), 6px 14px 22px rgba(60,30,0,.2); }
      .h-partner:focus-visible { outline: 3px solid #2b1a12; outline-offset: 3px; }
      .h-partner i { width: 30px; height: 30px; flex: none; } .h-partner svg { width: 100%; height: 100%; display: block; }
      .h-partner span { display: flex; flex-direction: column; line-height: 1.1; }
      .h-partner b { font: 800 13px Archivo, sans-serif; letter-spacing: .06em; text-transform: uppercase; }
      .h-partner small { margin-top: 2px; font: 600 12px Archivo, sans-serif; color: #8a5a2a; }
      .h-partner i { display: grid; place-items: center; background: #fff; border-radius: 50%; box-shadow: inset 0 0 0 1.5px rgba(94,142,62,.35); } .h-partner svg { width: 64%; height: 64%; }
      .h-bar-partner { display: none !important; align-items: center; gap: 8px; } .h-bar-partner svg { width: 22px; height: 22px; flex: none; } .h-bar-partner span { display: block; white-space: nowrap; }
      /* no room above Barril (small phones, short laptop windows): the badge moves into the bottom bar, in place of "Ask Germanjit" */
      @media (max-width: 600px), (max-height: 650px) and (min-width: 801px) { .h-partner { display: none; } .h-bar-partner { display: flex !important; } .h-bar a[href^="mailto"] { display: none; } }
      @media (max-width: 800px) { .h-partner { margin-top: 12px; gap: 8px; padding: 5px 12px 5px 6px; } .h-partner i { width: 24px; height: 24px; } .h-partner b { font-size: 11.5px; } .h-partner small { font-size: 10.5px; } }
      @media (max-height: 560px) and (min-width: 801px) { .h-partner { margin-top: 10px; padding: 4px 10px 4px 5px; } .h-partner i { width: 22px; height: 22px; } .h-partner small { display: none; } }
      [data-theme="dark"] .h-partner { box-shadow: 0 0 0 1px rgba(255,226,122,.35), 4px 10px 22px rgba(0,0,0,.4); }
      .h-cta2 { color: #2b1a12; font: 800 14px Archivo, sans-serif; letter-spacing: .06em; text-transform: uppercase; text-underline-offset: 5px; }
      [data-theme="dark"] .h-txt { color: #fff6e2; } [data-theme="dark"] .h-cta2 { color: #ffe27a; } [data-theme="dark"] .h-kick { background: #ffe27a; color: #2b1a12; } [data-theme="dark"] .h-cta { background: #ffe27a; color: #2b1a12; }
      .h-arrow { position: absolute; z-index: 5; left: 50%; bottom: 13vh; width: 40px; height: 64px; margin-left: -20px; }
      .h-arrow i, .h-arrow i::after { position: absolute; left: 50%; display: block; background: #2b1a12; }
      .h-arrow i { top: 0; width: 3px; height: 52px; margin-left: -1.5px; animation: harrow 1.8s ease-in-out infinite; }
      .h-arrow i::after { content: ""; top: 36px; width: 22px; height: 22px; margin-left: -11px; background: none; border: solid #2b1a12; border-width: 0 3px 3px 0; transform: rotate(45deg); }
      @keyframes harrow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
      .h-bar { position: absolute; z-index: 6; left: 0; right: 0; bottom: 0; height: 9vh; min-height: 62px; display: flex; align-items: center; gap: 4vw; padding: 0 8vw; background: #f3f0ea; color: #2b1a12; }
      .h-bar a { text-decoration: none; font: 800 14px/1.05 Archivo, sans-serif; text-transform: uppercase; letter-spacing: .04em; border-left: 2px solid #e9a03a; padding-left: 12px; }
      .h-bar small { display: block; font-weight: 600; opacity: .6; }
      .h-bar-social { margin-left: auto; display: flex; gap: 10px; } .h-bar-social a { border: 0; padding: 8px 10px; background: #2b1a12; color: #f3f0ea; border-radius: 4px; text-transform: none; }
      .h-crate { position: absolute; left: 1196px; top: 640px; width: 190px; height: 120px; z-index: 2; border-radius: 4px;
        background: repeating-linear-gradient(180deg, #b77a3f 0 34px, #9c6331 34px 38px); filter: drop-shadow(calc(var(--lx) * 3px) calc(var(--ly) * 4px) 3px rgba(20,10,0,.34)) drop-shadow(calc(var(--lx) * 22px) calc(var(--ly) * 34px) 22px rgba(20,10,0,.26)); }
      .h-crate::after { content: "CODEBREW · GRÃO"; position: absolute; left: 0; right: 0; top: 46px; text-align: center; font: 800 13px Archivo, sans-serif; letter-spacing: .18em; color: rgba(60,30,10,.55); }
      .h-grain { position: absolute; left: 1258px; top: 312px; width: 24px; height: 36px; z-index: 5; background: url(img/kernel-0.webp) center / 100% 100% no-repeat; opacity: 0; }
      .h-ticket { position: relative; display: block; padding: 20px 18px 16px; background: #fffaf0; color: #2b1a12; rotate: 4deg;
        background-image: repeating-linear-gradient(180deg, transparent 0 25px, rgba(43,26,18,.08) 25px 26px);
        clip-path: polygon(0 6px, 4% 0, 8% 6px, 12% 0, 16% 6px, 20% 0, 24% 6px, 28% 0, 32% 6px, 36% 0, 40% 6px, 44% 0, 48% 6px, 52% 0, 56% 6px, 60% 0, 64% 6px, 68% 0, 72% 6px, 76% 0, 80% 6px, 84% 0, 88% 6px, 92% 0, 96% 6px, 100% 0, 100% 100%, 0 100%); }
      #h-ticketwrap { filter: drop-shadow(calc(var(--lx) * 3px) calc(var(--ly) * 4px) 3px rgba(20,10,0,.3)) drop-shadow(calc(var(--lx) * 18px) calc(var(--ly) * 28px) 18px rgba(20,10,0,.25)); }
      .h-ticket b { display: block; font-family: "Rye", Georgia, serif; font-weight: 400; font-size: 22px; color: #a8281a; }
      .h-ticket small { display: block; font: 600 11px Archivo, sans-serif; letter-spacing: .06em; text-transform: uppercase; opacity: .55; margin: 2px 0 10px; }
      .h-ticket label { display: block; font: 800 12px Archivo, sans-serif; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 4px; }
      .h-ticket textarea:focus-visible { outline: 2px dashed #a8281a; outline-offset: 4px; }
      .h-ticket textarea { width: 100%; border: 0; resize: none; background: transparent; font: 700 20px/26px "Caveat", cursive; color: #1f4e9c; outline: none; padding: 0; }
      .h-tk-foot { display: block; margin-top: 6px; font: 600 11px Archivo, sans-serif; opacity: .6; }
      @media (max-width: 800px) {
        .h-copy { left: 6vw; top: 80px; width: 88vw; } .h-kick { margin-bottom: 10px; font-size: 11px; } .h-title { font-size: 42px; } .h-txt { margin: 10px 0 14px; font-size: 14.5px; } .h-cta { padding: 12px 18px; font-size: 14px; }
        #h-barril { scale: .6; translate: 0 84px; } .h-crate, #h-barley1, #h-barley2 { translate: 0 84px; } .h-arrow { display: none; }
        #h-ticketwrap { left: 760px !important; top: 612px !important; }
        .h-bar { gap: 16px; padding: 0 5vw; overflow-x: auto; } .h-bar-social { display: none; }
      }
      /* phones in landscape (~390px tall): the title ran into the header and the copy over Barril */
      @media (max-height: 500px) and (min-aspect-ratio: 1/1) {
        .h-copy { top: 54px; width: 44vw; } .h-title { font-size: 30px; } .h-kick { margin-bottom: 6px; padding: 4px 8px; font-size: 10px; }
        .h-txt { margin: 6px 0 8px; font-size: 12.5px; line-height: 1.4; } .h-cta { padding: 8px 12px; font-size: 12px; } .h-cta2 { font-size: 11.5px; } .h-arrow { display: none; }
        .h-bar { height: 44px; min-height: 44px; } .h-bar a { font-size: 12px; }
        #h-ticketwrap { top: 330px !important; } /* textarea was hidden behind the bottom bar */
      }
    </style>`,
  init: (stage, K, st) => {
    const barril = stage.querySelector("#h-barril"), grain = stage.querySelector("#h-grain"), tk = stage.querySelector("#h-order");
    // live order ticket
    let saved = ""; try { saved = sessionStorage.getItem("brew-order") || ""; } catch (e) {}
    if (saved) tk.value = saved;
    window.BREW_ORDER = tk.value.trim();
    tk.addEventListener("input", () => {
      window.BREW_ORDER = tk.value.trim();
      try { sessionStorage.setItem("brew-order", tk.value); } catch (e) {}
      document.dispatchEvent(new CustomEvent("brew:order", { detail: window.BREW_ORDER }));
    });
    if (K.reduced) return;
    gsap.from(".h-copy > *", { y: 40, opacity: 0, stagger: .1, duration: 1, ease: "power3.out", delay: 1.9 });
    // resting y (portrait CSS gives Barril a `translate`, which gsap folds into y): every scrubbed tween starts from it
    const BY = gsap.getProperty(barril, "y") || 0, P = innerWidth / innerHeight < 1;
    const intro = [
      gsap.from(barril, { y: BY + 120, opacity: 0, rotation: -6, duration: 1.4, ease: "elastic.out(1, .5)", delay: 2.1 }),
      gsap.from("#h-ticketwrap", { y: -60, rotation: -20, opacity: 0, duration: 1.1, ease: "back.out(2)", delay: 2.5 })];
    // scrolling during the entrance used to let the scrub tweens record Barril/the ticket mid-bounce, so after scrolling
    // back up the ticket stayed invisible and tilted and Barril floated 14px high. Finish the entrance on first scroll.
    ScrollTrigger.create({ trigger: st.trigger, start: "top top-=2", onEnter: () => intro.forEach(t => t.progress() < 1 && t.progress(1)) });
    // idle: breathing + a wave now and then + barley swaying
    gsap.set(barril, { transformOrigin: "50% 100%" });
    // breathe relative to the resting scale: portrait CSS gives Barril `scale: .62`, which gsap folds into scaleX/Y, so the
    // old absolute 1.018/.99 made him pulse between 62% and 100% size on phones
    const BS = gsap.getProperty(barril, "scaleX") || 1;
    gsap.to(barril, { scaleY: BS * 1.018, scaleX: BS * .99, duration: 1.7, yoyo: true, repeat: -1, ease: "sine.inOut" });
    // (relative + only at the top: an absolute rotation:0 here used to snap Barril out of his scrolled pose)
    const wave = () => { if (scrollY < 4 && !intro[0].isActive()) gsap.to(barril, { rotation: "-=3", duration: .25, yoyo: true, repeat: 3, ease: "sine.inOut" }); gsap.delayedCall(gsap.utils.random(5, 9), wave); };
    gsap.delayedCall(4, wave);
    ["#h-barley1", "#h-barley2"].forEach((s, i) => gsap.to(stage.querySelector(s), { rotation: `+=${i ? -4 : 4}`, transformOrigin: "50% 100%", duration: 2.2 + i * .5, yoyo: true, repeat: -1, ease: "sine.inOut" }));
    // eyes on the ticket while typing: a little nod
    // (yPercent, not y: y:0 used to wipe the portrait offset and leave Barril 34px too high after typing)
    tk.addEventListener("input", () => gsap.fromTo(barril, { yPercent: 0 }, { yPercent: -1.2, duration: .12, yoyo: true, repeat: 1, overwrite: "auto" }));
    // scroll: copy floats away, the grain pops off the barley and drops out of the bottom into the mill
    const tlG = gsap.timeline({ scrollTrigger: { ...st, scrub: 1 } });
    tlG.to({}, { duration: 1 }, 0);
    gsap.timeline({ scrollTrigger: { ...st, scrub: 1 } })
      .to(".h-copy", { y: -120, autoAlpha: 0, ease: "power1.in", duration: .35 }, 0)
      .to(".h-arrow, .h-bar", { autoAlpha: 0, y: 30, duration: .15 }, 0)
      // portrait phones: the ticket sits bottom-right, so sliding it 260px left parked half of it on the screen edge.
      // There it drops away down-left (fading) instead.
      .fromTo("#h-ticketwrap", { x: 0, y: 0, rotation: 0, autoAlpha: 1 }, P ? { x: -120, y: 360, rotation: -14, autoAlpha: 0, duration: .3, ease: "power2.in", immediateRender: false } : { x: -260, y: 60, rotation: -8, duration: .35, ease: "power2.inOut", immediateRender: false }, .05)
      .fromTo(barril, { x: 0, y: BY, rotation: 0 }, { x: 120, y: BY, rotation: 4, duration: .3, ease: "power2.inOut", immediateRender: false }, .1)
      .set(grain, { opacity: 1 }, .32)
      .to(grain, { keyframes: [{ x: -60, y: -90, rotation: -200, duration: .12, ease: "power2.out" }, { x: -520, y: 760, rotation: -720, duration: .38, ease: "power2.in" }] }, .32)
      .fromTo(barril, { x: 120, y: BY, rotation: 4 }, { x: 160, y: BY - 10, rotation: -3, duration: .3, immediateRender: false }, .55);
    // (the paper-grain shower from Barril's barrel into the mill lives in 20-mill.js: one screen-space layer across both sheets)
  }
});
