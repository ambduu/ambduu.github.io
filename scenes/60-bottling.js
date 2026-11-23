/* 60 · BOTTLING — "Speed & Launch" + the portfolio showcase.
   Beer pours in from the fermenter tap above into a copper filler. Paper bottles ride a matte belt left → right:
   filler (nozzle dips, foam), capper (bell presses a gold cap; Plus "reserve" bottles get red wax),
   labeller (front roller wraps a label). Every label is a REAL store screenshot + name, so the line carries the whole
   portfolio past. Click / tap a bottle (or "Taste it") → its label zooms up into a paper tasting-note poster.
   End: crates drop in ("200+ stores served · 10+ industries"), the last codebrew bottle tips off the belt end
   and falls out the bottom toward the delivery tram.
   Everything on the line is a pure function of belt position `s`, driven by ONE scrubbed timeline. */
(function () {
  // Interleaved so industries mix on the line; Shopify Plus case studies are "reserve" bottles.
  const SHOPS = [
    ["dylanlex", "Dylan Lex", "Jewellery", "dylanlex.com"], ["monkeeroos", "Monkeeroos", "Clothing", "monkeeroos.com"],
    ["buebchen", "Bübchen", "Cosmetics", "buebchen.de"], ["abstrax", "Abstrax Tech", "Shopify Plus", "abstraxtech.com", "Fully custom Plus build on Horizon, with Lottie animation, HubSpot forms and B2B pricing brewed in."],
    ["myeco", "My Eco World", "Pet", "myecoworld.com"], ["sabah", "Sabah", "Footwear", "sabah.am"],
    ["maitea", "Maitea", "Jewellery", "maitea.de"], ["woolandoak", "Wool & Oak", "Shopify Plus", "woolandoak.com", "A Shopify Plus regular from the bags & covers shelf."],
    ["cheribundi", "Cheribundi", "Shopify Plus", "cheribundi.com", "Poured straight from a Figma design, section by section, with a custom Recharge subscription integration."],
    ["waad", "Waad Skin", "Cosmetics", "waadskin.com"],
    ["mattym", "Shop Matty M", "Clothing", "shopmattym.com"], ["monte", "Monte Design", "Furniture", "montedesign.com"],
    ["miro", "Miro Jewelers", "Jewellery", "mirojewelers.com"], ["dirtydog", "Dirty Dog Beauty Club", "Pet", "dirtydogbeautyclub.com"],
    ["zugu", "Zugu Case", "Shopify Plus", "zugucase.com", "A Shopify Plus regular from the bags & covers shelf, with Markets set up to sell to the world in the right currency."],
    ["wearetto", "Wearetto", "Footwear", "wearetto.com"],
    ["blue", "Blue Skincare", "Cosmetics", "blue-skincare.com"], ["recolution", "Recolution", "Clothing", "recolution.de"],
    ["vics", "Vic's Meat", "Food", "vicsmeat.com.au"], ["brooklyn", "Brooklyn Jewelers", "Jewellery", "brooklynjewelers.com"],
    ["aavrani", "Aavrani", "Shopify Plus", "aavrani.com", "A Shopify Plus cosmetics brand, kept on tap in the reserve cellar."],
    ["luxorro", "Luxorro", "Bags & covers", "luxorro.com"],
    ["purelei", "Purelei", "Jewellery", "purelei.com"], ["phystine", "Phystine", "Cosmetics", "phystine.com"],
    ["ena", "ENA Athletics", "Footwear", "enaathletics.com"], ["aliceeli", "Alice and Eli", "Pet", "aliceandeli.com"]
  ].map(([key, name, ind, domain, plus]) => ({ key, name, ind, domain, plus, res: !!plus }));
  SHOPS.push({ key: "", name: "Your store?", ind: "Next on the line", domain: "", final: true });
  // the plain-button "Featured Shopify Plus work" strip (same tasting card as the bottles)
  const FEATURED = [["abstrax", "Abstrax"], ["cheribundi", "Cheribundi"], ["zugu", "Zugu"], ["aavrani", "Aavrani"], ["woolandoak", "Wool & Oak"]]
    .map(([key, short]) => ({ i: SHOPS.findIndex(sh => sh.key === key), short })).filter(f => f.i >= 0);
  const MORE = "Amyo Jewelry · A Life and Kickin · Grillgott · Sproos · Create Good Sinks · Picard Fashion · Panac Edition · and plenty more";
  const NOTES = { // playful tasting notes per style (bar talk, no claims)
    "Jewellery": "Bright, polished and a little bit extra. Best enjoyed up close.",
    "Clothing": "Easy-drinking, comes in every size. Pairs well with a lookbook.",
    "Cosmetics": "Smooth, clean finish. No harsh additives.",
    "Pet": "Friendly, playful and a bit scruffy around the edges. Good dogs only.",
    "Footwear": "Light on its feet with a long, comfortable finish.",
    "Bags & covers": "Sturdy body. Carries well.",
    "Furniture": "Full-bodied and built to last. Sit down for this one.",
    "Food": "Rich and hearty. Serve next to a hot grill."
  };
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const pad = n => String(n).padStart(2, "0");
  const NSTORES = SHOPS.length - 1;

  // ---- geometry (design-box px) ----
  const BH = 430, BW = Math.round(BH * 316 / 1100);   // bottle 124 x 430
  const BELT = 785, TOP = BELT - BH;                     // bottle stands on the belt
  const XF = 172, XC = 382, XL = 590, XE = 975;         // filler, capper, labeller, belt end (bottle-centre x)
  const SP = 205, START = 930;                           // spacing, bottle 0 centre at s = 0
  const POS = SHOPS.map((sh, i) => sh.final ? i + 1.6 : i);
  const SEND = XE + 300 - START + POS[POS.length - 1] * SP;  // last bottle fully gone
  const A = .03, B = .92;                                // belt runs between these timeline times

  const bottleHTML = (sh, i) => {
    const lab = sh.final
      ? `<span class="bt-lab bt-lab--cb"><b>code</b><b>brew</b><i>your store next?</i></span>`
      : `<span class="bt-lab${sh.res ? " bt-lab--res" : ""}"><span class="bt-shot"><img src="assets/work/${sh.key}-256.webp" width="256" height="160" alt="" decoding="async"></span><span class="bt-nm"><b>${esc(sh.name)}</b><i>${sh.res ? "Plus reserve" : esc(sh.ind)}</i></span></span>`;
    return `<button class="bt-b${sh.res ? " is-res" : ""}${sh.final ? " is-final" : ""}" data-i="${i}" type="button" aria-label="${sh.final ? "Open the next-batch card: your store?" : "Open " + esc(sh.name) + " case"}">
      <span class="bt-in d2"><img class="bt-bi" src="img/bottle.webp" alt="" draggable="false">${sh.res ? `<span class="bt-wax"></span>` : ""}${lab}</span>
      <span class="bt-foam"></span><span class="bt-hint">View store</span></button>`;
  };

  const rollers = Array.from({ length: 21 }, (_, i) => `<i class="bt-rl" style="left:${i * 64 - 4}px"></i>`).join("");
  const legs = [60, 440, 820, 1200].map(x => `<i class="bt-leg" style="left:${x}px"></i>`).join("");

  SCENES.push({
    id: "bottling", order: 60, height: 380, bg: "#2f5a4e", headerTone: "light",
    nav: { label: "Speed & Launch", href: "launch.html" },
    html: (K) => K.box(`
      <div class="bt-pan">
        <div class="bt-wall"></div>
        <!-- beer arrives from the fermenter tap above -->
        <div class="bt-pipe"></div><div class="bt-spout"></div>
        <div class="bt-stream"></div>
        <!-- filler -->
        <div class="bt-fill d2">
          <i class="bt-funnel"></i><i class="bt-tank bt-pp"><i class="bt-glass"><i class="bt-level"></i></i><span class="bt-plate">Filler</span></i>
          <i class="bt-fleg l"></i><i class="bt-fleg r"></i>
        </div>
        <div class="bt-nozzle"><i></i></div>
        <div class="bt-pour"></div>
        <!-- capper -->
        <div class="bt-capper d2"><i class="bt-col"></i><i class="bt-motor bt-pp"><span class="bt-plate">Capper</span></i><i class="bt-arm bt-pp"></i></div>
        <div class="bt-head"><i class="bt-rod"></i><i class="bt-bell"></i><i class="bt-hcap"></i></div>
        <!-- labeller -->
        <div class="bt-lab-m d2"><i class="bt-col"></i><i class="bt-arm2 bt-pp"></i><span class="bt-plate bt-plate--l">Labeller</span></div>
        <div class="bt-reel"><i class="bt-reel-in"></i></div>
        <div class="bt-tape-strip"></div>
        <!-- speed gauge -->
        <div class="bt-gauge" aria-hidden="true">
          <div class="bt-dial"><i class="bt-z1"></i><i class="bt-z2"></i><i class="bt-z3"></i><i class="bt-face"></i>
            <span class="bt-gl l">slow</span><span class="bt-gl r">zippy</span>
            <i class="bt-needle"></i><i class="bt-hub"></i></div>
          <b>Load speed</b>
        </div>
        <!-- belt -->
        <div class="bt-belt"><i class="bt-btop"></i><i class="bt-bfront">${rollers}</i><i class="bt-end"></i><i class="bt-rail"></i>${legs}</div>
        <div class="bt-line">${SHOPS.map(bottleHTML).join("")}</div>
        <div class="bt-roller-arm"><i class="bt-rr"></i></div>
        <!-- catch crate under the belt end + sign -->
        <div class="bt-chute d3"><span>Out to the tram ↓</span></div>
        <div class="bt-sign">${K.tag("To delivery ↓", { color: "#f2c14e" })}</div>
        <!-- end crate stack -->
        <div class="bt-crates">
          <div class="bt-crate bt-c3 d3"><span class="bt-necks">${[0, 1, 2, 3].map(i => `<img src="img/bottle.webp" alt="" style="left:${18 + i * 52}px">`).join("")}</span><i class="bt-cfront"><b>code<em>brew</em></b><small>since 2015</small></i></div>
          <div class="bt-crate bt-c1 d3"><i class="bt-cfront"><b>200+</b><small>stores served</small></i></div>
          <div class="bt-crate bt-c2 d3"><i class="bt-cfront"><b>10+</b><small>industries</small></i></div>
        </div>
      </div>`, { focus: 50 }) + `
      <div class="bt-copy">
        ${K.label({ title: "Speed &amp; Launch", href: "launch.html", left: "0", top: "0", text: "Bottled, capped and out the door. Lighter stores, clean Git + CI/CD releases, and support after launch." })}
        <p class="bt-hint2">Every label is a real store I've poured. <b>Tap any bottle to see it live.</b></p>
        <div class="bt-plus" role="group" aria-labelledby="bt-plus-h">
          <div class="bt-plus-top"><span class="bt-plus-h" id="bt-plus-h">Featured Shopify Plus work</span><a class="bt-all" href="stores.html">See all stores →</a></div>
          <div class="bt-plus-b">${FEATURED.map(f => `<button class="bt-pb" type="button" data-i="${f.i}" aria-label="Open ${esc(SHOPS[f.i].name)} case">${esc(f.short)}</button>`).join("")}</div>
        </div>
        <div class="bt-endc" aria-live="polite">
          <div class="bt-stamps"><span class="bt-stamp">200+ stores served</span><span class="bt-stamp b">10+ industries</span></div>
          <p class="bt-more"><span>Also on the shelf</span>${esc(MORE)} <a class="bt-all" href="stores.html">See all stores →</a></p>
        </div>
      </div>
      <div class="bt-ticket" role="group" aria-label="Stores on the line">
        <button class="bt-tb bt-prev" type="button" aria-label="Previous store">‹</button>
        <div class="bt-tt"><small>On the line · <span class="bt-tn">01</span>/${NSTORES}</small><b class="bt-tname">Dylan Lex</b><span class="bt-tind">Jewellery</span></div>
        <button class="bt-taste" type="button">View store</button>
        <button class="bt-tb bt-next" type="button" aria-label="Next store">›</button>
      </div>
      <!-- tag + hint live on the stage (not in the design box) so they stay readable over the after-hours dark; JS places them
           over the spotlight bottle in design px (translate + scale), and they always sit below the copy and ticket -->
      <!-- passive showcase: the spotlight bottle lifts and wears a readable name tag -->
      <button class="bt-ftag" type="button" tabindex="-1"><span class="bt-ft"><b></b><i>View store →</i></span></button>
      <!-- first-time hint (gone after the first card opens; remembered per tab) -->
      <div class="bt-point" aria-hidden="true">
        <span>Tap a bottle to see the store</span>
        <svg class="bt-hand" viewBox="0 0 34 44" width="34" height="44"><path d="M13 21V6.5a4 4 0 0 1 8 0V18l6.2 1.3A5 5 0 0 1 31 24.2V32a10 10 0 0 1-10 10h-4.5a9 9 0 0 1-7.4-3.9L3.6 30.3a3.3 3.3 0 0 1 5.1-4.2L13 30z" fill="#fff6e2" stroke="#2b1a12" stroke-width="2.4" stroke-linejoin="round"/><path d="M21 19v8M25.5 20.5V27" stroke="#2b1a12" stroke-width="2" stroke-linecap="round"/></svg>
      </div>
      <style>
        #bottling { --bt-fib: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .3 0 0 0 0 .2 0 0 0 0 .1 0 0 0 .7 -.2'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E"); --bt-mot: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.018' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .2 0 0 0 0 .12 0 0 0 0 .05 0 0 0 .55 -.18'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)'/%3E%3C/svg%3E"); --bt-ink: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.55' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -3.2 2.55'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E");
          --bt-lit: linear-gradient(150deg, rgba(255,250,232,.22), rgba(255,250,232,0) 38%, rgba(20,8,0,0) 60%, rgba(20,8,0,.22)); }
        .bt-pp { box-shadow: inset 0 1px 0 rgba(255,255,255,.25), inset 0 -5px 8px rgba(40,15,0,.14); }
        /* ---------- wall ---------- */
        #bottling .jstage { background: #2f5a4e; }
        .bt-pan { position: absolute; inset: 0; }
        .bt-wall { position: absolute; inset: -200px -400px; z-index: 0;
          background:
            radial-gradient(ellipse 620px 420px at 1010px 560px, rgba(255,226,150,.16), transparent 70%),
            radial-gradient(ellipse 380px 300px at 230px 230px, rgba(255,200,120,.10), transparent 70%),
            linear-gradient(180deg, transparent 0 1048px, rgba(0,0,0,.16) 1048px),
            repeating-linear-gradient(90deg, rgba(255,255,255,.018) 0 238px, rgba(0,0,0,.05) 238px 240px),
            radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,.26)); }
        .bt-plate { position: absolute; left: 50%; transform: translateX(-50%); padding: 3px 9px; background: #2b1a12; color: #f2c14e; font: 800 10px/1 Archivo, sans-serif; letter-spacing: .14em; text-transform: uppercase; white-space: nowrap; }

        /* ---------- pipe + filler ---------- */
        .bt-pipe { position: absolute; left: 154px; top: -40px; width: 36px; height: 112px; z-index: 2;
          background: var(--bt-fib), var(--bt-mot), var(--bt-lit), linear-gradient(90deg, #7d3c14 0 18%, #b9692e 18% 42%, #e3995a 42% 62%, #a85d22 62% 84%, #7d3c14 84%);
          filter: drop-shadow(calc(var(--lx) * 10px) calc(var(--ly) * 14px) 10px rgba(10,20,10,.35)); }
        .bt-spout { position: absolute; left: 144px; top: 66px; width: 56px; height: 22px; z-index: 2; border-radius: 4px 4px 10px 10px;
          background: var(--bt-fib), var(--bt-mot), var(--bt-lit), linear-gradient(90deg, #7d3c14 0 15%, #c97a3a 15% 45%, #eaa463 45% 60%, #9a4f1d 60%); }
        .bt-stream { position: absolute; left: 164px; top: 86px; width: 16px; height: 56px; z-index: 1; transform-origin: 50% 0; border-radius: 0 0 8px 8px;
          background: repeating-linear-gradient(180deg, #f2c14e 0 9px, #e9a03a 9px 18px); background-size: 100% 18px; animation: btflow .35s linear infinite; opacity: .95; }
        @keyframes btflow { to { background-position: 0 18px; } }
        .bt-fill { position: absolute; left: 70px; top: 122px; width: 204px; height: 663px; z-index: 2; }
        .bt-funnel { position: absolute; left: 62px; top: 0; width: 80px; height: 34px; clip-path: polygon(0 0, 100% 0, 66% 100%, 34% 100%);
          background: var(--bt-fib), var(--bt-mot), var(--bt-lit), linear-gradient(90deg, #cdbd9b 0 30%, #efe4cc 30% 62%, #ddd0b2 62%); }
        .bt-tank { position: absolute; left: 6px; top: 30px; width: 192px; height: 160px; border-radius: 96px 96px 18px 18px / 46px 46px 18px 18px;
          background: var(--bt-fib), var(--bt-mot), var(--bt-lit), linear-gradient(90deg, #8a4418 0 9%, #b7642a 9% 27%, #d98a46 27% 48%, #e9a463 48% 60%, #c4753a 60% 80%, #95501f 80%); }
        .bt-tank::after { content: ""; position: absolute; left: 0; right: 0; top: 70px; height: 6px; background: rgba(60,20,0,.28); }
        .bt-glass { position: absolute; left: 132px; top: 40px; width: 18px; height: 96px; background: #3b2a1e; border-radius: 9px; overflow: hidden; box-shadow: inset 0 0 0 3px #efe4cc; }
        .bt-level { position: absolute; left: 3px; right: 3px; bottom: 3px; height: 70%; background: linear-gradient(#fff6e2 0 6px, #f2c14e 6px); border-radius: 0 0 6px 6px; transform-origin: 50% 100%; }
        .bt-tank .bt-plate { top: 104px; }
        .bt-fleg { position: absolute; top: 186px; width: 18px; height: 480px; background: var(--bt-fib), var(--bt-mot), var(--bt-lit), linear-gradient(90deg, #cdbd9b 0 40%, #efe4cc 40%); }
        .bt-fleg.l { left: 18px; } .bt-fleg.r { right: 18px; }
        .bt-nozzle { will-change: transform; position: absolute; left: ${XF - 9}px; top: 300px; width: 18px; height: 74px; z-index: 3; }
        .bt-nozzle i { position: absolute; inset: 0; border-radius: 0 0 6px 6px; background: var(--bt-fib), var(--bt-mot), var(--bt-lit), linear-gradient(90deg, #7d3c14 0 25%, #d98a46 25% 60%, #9a4f1d 60%); }
        .bt-pour { position: absolute; left: ${XF - 4}px; top: 370px; width: 8px; height: 26px; z-index: 3; background: #f2c14e; border-radius: 4px; opacity: 0; }

        /* ---------- capper ---------- */
        .bt-capper { position: absolute; left: 0; top: 0; width: 1px; height: 1px; z-index: 2; }
        .bt-col { position: absolute; left: 278px; top: 236px; width: 34px; height: 560px; background: var(--bt-fib), var(--bt-mot), var(--bt-lit), linear-gradient(90deg, #c9b994 0 32%, #efe4cc 32% 70%, #ddd0b2 70%); }
        .bt-motor { position: absolute; left: 252px; top: 178px; width: 92px; height: 70px; border-radius: 10px 10px 4px 4px;
          background: var(--bt-fib), var(--bt-mot), var(--bt-lit), linear-gradient(90deg, #a82820 0 18%, #d23b2f 18% 52%, #e2463a 52% 70%, #b52d24 70%); }
        .bt-motor .bt-plate { top: 26px; }
        .bt-arm { position: absolute; left: 300px; top: 238px; width: 126px; height: 36px; background: var(--bt-fib), var(--bt-mot), var(--bt-lit), linear-gradient(180deg, #efe4cc 0 55%, #d6c8aa 55%); border-radius: 0 6px 6px 0; }
        .bt-head { will-change: transform; position: absolute; left: ${XC - 40}px; top: 272px; width: 80px; height: 120px; z-index: 3; }
        .bt-rod { position: absolute; left: 33px; top: -30px; width: 14px; height: 52px; background: var(--bt-fib), var(--bt-mot), var(--bt-lit), linear-gradient(90deg, #7d3c14 0 30%, #e3995a 30% 60%, #9a4f1d 60%); }
        .bt-bell { position: absolute; left: 6px; top: 18px; width: 68px; height: 44px; clip-path: polygon(14% 0, 86% 0, 100% 100%, 0 100%);
          background: var(--bt-fib), var(--bt-mot), var(--bt-lit), linear-gradient(90deg, #8f231c 0 20%, #d23b2f 20% 55%, #e2463a 55% 72%, #a82820 72%);
          filter: drop-shadow(calc(var(--lx) * 6px) calc(var(--ly) * 10px) 6px rgba(10,20,10,.35)); }
        .bt-hcap { position: absolute; left: ${40 - BW * .3}px; top: 40px; width: ${BW * .6}px; height: ${BH * .073}px;
          background: url(img/bottle.webp) no-repeat; background-size: ${BW}px ${BH}px; background-position: ${-BW * .2}px 0; }

        /* ---------- labeller ---------- */
        .bt-lab-m { position: absolute; left: 0; top: 0; width: 1px; height: 1px; z-index: 2; }
        .bt-lab-m .bt-col { left: 486px; top: 300px; }
        .bt-arm2 { position: absolute; left: 470px; top: 292px; width: 206px; height: 26px; background: var(--bt-fib), var(--bt-mot), var(--bt-lit), linear-gradient(180deg, #efe4cc 0 55%, #d6c8aa 55%); border-radius: 6px; }
        .bt-plate--l { left: 576px !important; top: 299px; }
        .bt-reel { position: absolute; left: 432px; top: 160px; width: 144px; height: 144px; z-index: 2; border-radius: 50%; box-shadow: calc(var(--lx) * 3px) calc(var(--ly) * 4px) 3px rgba(20,10,0,.3), calc(var(--lx) * 20px) calc(var(--ly) * 30px) 22px rgba(20,10,0,.26); }
        .bt-reel-in { will-change: transform; }
        .bt-reel-in { position: absolute; inset: 0; border-radius: 50%; box-shadow: inset 0 0 0 5px #e8dcc2, inset -10px -12px 18px rgba(40,15,0,.18);
          background: var(--bt-fib),
            radial-gradient(circle, #2b1a12 0 9px, #e2463a 10px 20px, #b52d24 21px 25px, transparent 26px),
            repeating-radial-gradient(circle, #fff6e2 0 4px, #e8dcc2 4px 5px),
            #fff6e2; }
        .bt-reel-in::before { content: ""; position: absolute; left: 50%; top: 50%; width: 4px; height: 60px; margin: -2px 0 0 -2px; background: rgba(43,26,18,.35); transform-origin: 2px 2px; }
        .bt-reel-in::after { content: ""; position: absolute; left: 50%; top: 50%; width: 4px; height: 60px; margin: -2px 0 0 -2px; background: rgba(43,26,18,.35); transform-origin: 2px 2px; transform: rotate(120deg); }
        .bt-tape-strip { position: absolute; left: 566px; top: 232px; width: 12px; height: 360px; z-index: 1; background: var(--bt-fib), var(--bt-mot), var(--bt-lit), repeating-linear-gradient(180deg, #fff6e2 0 30px, #e8dcc2 30px 32px); }
        .bt-roller-arm { position: absolute; left: ${XL + 52}px; top: 300px; width: 30px; height: 400px; z-index: 6; pointer-events: none; }
        .bt-roller-arm::before { content: ""; position: absolute; left: 11px; top: 0; width: 8px; height: 292px; background: var(--bt-fib), var(--bt-mot), var(--bt-lit), linear-gradient(90deg, #7d3c14 0 30%, #e3995a 30% 60%, #9a4f1d 60%); }
        .bt-rr { position: absolute; left: 0; top: 282px; width: 30px; height: 120px; border-radius: 8px;
          background: repeating-linear-gradient(180deg, #d23b2f 0 10px, #b52d24 10px 20px); background-size: 100% 20px;
          box-shadow: inset 6px 0 0 rgba(255,255,255,.18), inset -8px 0 0 rgba(0,0,0,.22), calc(var(--lx) * 3px) calc(var(--ly) * 4px) 3px rgba(20,10,0,.3), calc(var(--lx) * 12px) calc(var(--ly) * 18px) 14px rgba(20,10,0,.3); will-change: transform; }

        /* ---------- gauge ---------- */
        .bt-gauge { position: absolute; left: 786px; top: 118px; width: 190px; z-index: 2; text-align: center; }
        .bt-dial { position: relative; width: 190px; height: 110px; overflow: hidden; border-radius: 95px 95px 0 0; box-shadow: calc(var(--lx) * 3px) calc(var(--ly) * 4px) 3px rgba(20,10,0,.3), calc(var(--lx) * 20px) calc(var(--ly) * 30px) 22px rgba(20,10,0,.26); background: var(--bt-fib), var(--bt-mot), var(--bt-lit), #fff6e2; }
        .bt-dial > i[class^="bt-z"] { position: absolute; left: 0; top: 0; width: 190px; height: 190px; border-radius: 50%; }
        .bt-z1 { background: conic-gradient(from -90deg, #e2463a 0 48deg, transparent 48deg); }
        .bt-z2 { background: conic-gradient(from -42deg, #f2c14e 0 66deg, transparent 66deg); }
        .bt-z3 { background: conic-gradient(from 24deg, #7cc243 0 66deg, transparent 66deg); }
        .bt-face { position: absolute; left: 22px; top: 22px; width: 146px; height: 146px; border-radius: 50%; background: #fff6e2; }
        .bt-gl { position: absolute; bottom: 6px; font: 800 10px Archivo, sans-serif; letter-spacing: .12em; text-transform: uppercase; color: #2b1a12; }
        .bt-gl.l { left: 30px; } .bt-gl.r { right: 26px; }
        .bt-needle { position: absolute; left: 92px; top: 26px; width: 6px; height: 72px; background: #2b1a12; border-radius: 3px 3px 0 0; clip-path: polygon(50% 0, 100% 100%, 0 100%); transform-origin: 3px 69px; transform: rotate(-70deg); }
        .bt-hub { position: absolute; left: 82px; top: 84px; width: 26px; height: 26px; border-radius: 50%; background: #e2463a; box-shadow: inset 0 0 0 6px #b52d24; }
        .bt-gauge b { box-shadow: calc(var(--lx) * 3px) calc(var(--ly) * 4px) 3px rgba(20,10,0,.3), calc(var(--lx) * 20px) calc(var(--ly) * 30px) 22px rgba(20,10,0,.26); display: inline-block; margin-top: 8px; padding: 4px 10px; background: #2b1a12; color: #f2c14e; font: 800 11px Archivo, sans-serif; letter-spacing: .16em; text-transform: uppercase; }

        /* ---------- belt ---------- */
        .bt-belt { position: absolute; left: -60px; top: ${BELT}px; width: ${XE + 76}px; height: 200px; z-index: 3; }
        .bt-btop { position: absolute; left: 0; right: 16px; top: 0; height: 10px; background: repeating-linear-gradient(90deg, #45403a 0 38px, #36322d 38px 40px); }
        .bt-bfront { position: absolute; left: 0; right: 16px; top: 10px; height: 30px; overflow: hidden; background: linear-gradient(180deg, #24211e, #1b1917); }
        .bt-rl { position: absolute; top: 3px; width: 24px; height: 24px; border-radius: 50%;
          background: conic-gradient(#5c5650 0 25%, #47423c 25% 50%, #5c5650 50% 75%, #47423c 75%); box-shadow: inset 0 0 0 4px #2f2b27; }
        .bt-end { position: absolute; right: 0; top: 0; width: 40px; height: 40px; border-radius: 50%; background: conic-gradient(#5c5650 0 25%, #403b36 25% 50%, #5c5650 50% 75%, #403b36 75%); box-shadow: inset 0 0 0 6px #24211e; }
        .bt-rail { position: absolute; left: 0; right: 12px; top: 40px; height: 22px; background: var(--bt-fib), var(--bt-mot), var(--bt-lit), linear-gradient(180deg, #efe4cc 0 60%, #d6c8aa 60%); }
        .bt-rail::after { content: ""; position: absolute; left: 0; right: 0; top: 8px; height: 6px; background: repeating-linear-gradient(90deg, transparent 0 58px, #b9a982 58px 64px); opacity: .7; }
        .bt-leg { position: absolute; top: 62px; width: 26px; height: 140px; background: var(--bt-fib), var(--bt-mot), var(--bt-lit), linear-gradient(90deg, #c9b994 0 35%, #e5d8bc 35%); }

        /* ---------- bottles ---------- */
        .bt-line { position: absolute; left: 0; top: ${TOP}px; width: 1px; height: ${BH}px; z-index: 4; }
        .bt-b { position: absolute; left: 0; top: 0; width: ${BW}px; height: ${BH}px; padding: 0; border: 0; background: none; cursor: pointer; transform-origin: 50% 100%; will-change: transform; -webkit-tap-highlight-color: transparent; }
        .bt-b:focus-visible { outline: 3px solid #ffe27a; outline-offset: 6px; }
        .bt-in { position: absolute; inset: 0; transition: transform .35s cubic-bezier(.3,1.6,.5,1); }
        .bt-b:hover .bt-in, .bt-b:focus-visible .bt-in { transform: translateY(-14px) rotate(-2deg); }
        .bt-bi { position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: block; clip-path: inset(7.3% 0 0 0); }
        .bt-b.capped .bt-bi { clip-path: inset(0 0 0 0); }
        .bt-b.is-res .bt-bi { filter: brightness(.5) saturate(.7) hue-rotate(-8deg); }
        .bt-wax { position: absolute; left: 19%; top: 0; width: 62%; height: 16%; opacity: 0;
          background: linear-gradient(90deg, #6e1418 0 22%, #9e2027 22% 55%, #b8262c 55% 70%, #7c171b 70%);
          clip-path: polygon(3% 4%, 50% 0, 97% 4%, 100% 44%, 85% 52%, 85% 74%, 80% 60%, 73% 90%, 67% 60%, 58% 62%, 51% 100%, 44% 64%, 34% 62%, 26% 84%, 20% 60%, 15% 70%, 15% 52%, 0 44%); }
        .bt-b.capped .bt-wax { opacity: 1; }
        .bt-foam { position: absolute; left: 31%; top: 3.6%; width: 38%; height: 4.5%; border-radius: 50% 50% 30% 30%; opacity: 0; transform: scale(.4); transition: opacity .2s, transform .25s;
          background: radial-gradient(circle at 30% 40%, #fff 0 30%, transparent 32%), radial-gradient(circle at 70% 35%, #fff 0 28%, transparent 30%), #fff6e2; }
        .bt-b.foamy .bt-foam { opacity: 1; transform: none; }
        .bt-lab { position: absolute; left: 3.2%; width: 93.6%; top: 53.2%; height: 25.2%; display: flex; flex-direction: column; overflow: hidden;
          mix-blend-mode: multiply; clip-path: inset(0 calc(100% - var(--lw, 0) * 100%) 0 0); background: #fffaf0; }
        .bt-shot { position: relative; flex: 1 1 auto; overflow: hidden; margin: 5px 5px 0; }
        .bt-shot img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; display: block; }
        .bt-nm { flex: 0 0 auto; padding: 4px 4px 5px; text-align: center; line-height: 1; }
        .bt-nm b { display: block; font: 400 12px/1.05 "Archivo Black", sans-serif; color: #2b1a12; text-transform: uppercase; letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .bt-nm i { display: block; margin-top: 3px; font: 800 7.5px Archivo, sans-serif; font-style: normal; letter-spacing: .16em; text-transform: uppercase; color: #c46a1f; }
        .bt-lab--res { background: #f0d28a; }
        .bt-lab--res .bt-shot { margin: 6px 6px 0; box-shadow: 0 0 0 2px #2b1a12; }
        .bt-lab--res .bt-nm i { color: #7c171b; }
        .bt-lab--cb { align-items: center; justify-content: center; background: #fff6e2; }
        .bt-lab--cb b { font: 400 21px/.95 "Archivo Black", sans-serif; color: #c46a1f; letter-spacing: -1px; }
        .bt-lab--cb b + b { color: #2b1a12; }
        .bt-lab--cb i { margin-top: 6px; font: 800 7.5px Archivo, sans-serif; font-style: normal; letter-spacing: .14em; text-transform: uppercase; color: #2b1a12; }
        .bt-hint { position: absolute; left: 50%; top: -6px; transform: translate(-50%, 8px); padding: 5px 9px; background: #ffe27a; color: #2b1a12; font: 800 11px Archivo, sans-serif; letter-spacing: .1em; text-transform: uppercase; white-space: nowrap; opacity: 0; transition: .25s; pointer-events: none; }
        .bt-b:hover .bt-hint, .bt-b:focus-visible .bt-hint { opacity: 1; transform: translate(-50%, -14px); }
        .bt-b.is-feat .bt-in { transform: translateY(-12px); }
        .bt-b.is-feat:hover .bt-in, .bt-b.is-feat:focus-visible .bt-in { transform: translateY(-16px) rotate(-2deg); }
        .bt-b.is-feat .bt-hint { display: none; }   /* the name tag says it already */
        /* name tag over the spotlight bottle */
        .bt-ftag { position: absolute; left: 0; top: 0; z-index: 7; width: 0; height: 0; transform-origin: 0 0; margin: 0; padding: 0; border: 0; background: none; cursor: pointer; opacity: 0; visibility: hidden; transition: opacity .25s, visibility 0s .25s; will-change: transform; -webkit-tap-highlight-color: transparent; }
        .bt-ftag.on { opacity: 1; visibility: visible; transition: opacity .25s; }
        .bt-ft { position: absolute; left: 0; top: -70px; display: block; width: max-content; max-width: 240px; padding: 7px 13px 7px; background: #fff6e2; text-align: center; transform: translateX(calc(-50% + var(--dx, 0px)));
          filter: drop-shadow(0 2px 2px rgba(0,0,0,.25)) drop-shadow(4px 8px 10px rgba(0,0,0,.25)); }
        .bt-ft::after { content: ""; position: absolute; left: 50%; bottom: -7px; margin-left: -7px; border: 7px solid transparent; border-bottom: 0; border-top-color: #fff6e2; }
        .bt-ft b { display: block; color: #2b1a12; font: 400 14px/1.1 "Archivo Black", sans-serif; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .bt-ft i { display: block; margin-top: 3px; color: #c46a1f; font: 800 10.5px/1.1 Archivo, sans-serif; font-style: normal; letter-spacing: .14em; text-transform: uppercase; white-space: nowrap; }
        .bt-ftag:hover .bt-ft i { color: #7c171b; text-decoration: underline 2px; text-underline-offset: 3px; }
        .bt-ftag:focus-visible { outline: none; } .bt-ftag:focus-visible .bt-ft { outline: 3px solid #ffe27a; outline-offset: 3px; }
        /* first-time hint: a hand pointing up at the spotlight label */
        .bt-point { position: absolute; left: 0; top: 0; z-index: 7; width: 0; transform-origin: 0 0; padding-top: 120px; pointer-events: none; opacity: 0; visibility: hidden; transition: opacity .3s, visibility 0s .3s; will-change: transform; }
        .bt-point.on { opacity: 1; visibility: visible; transition: opacity .3s; }
        .bt-hand { display: block; margin: 4px 0 0 -14px; filter: drop-shadow(2px 3px 2px rgba(0,0,0,.3)); transform: scaleY(-1); animation: btpoke 1.1s ease-in-out infinite; }
        .bt-point span { display: block; width: max-content; padding: 7px 11px; background: #ffe27a; color: #2b1a12; font: 800 11.5px/1.15 Archivo, sans-serif; letter-spacing: .08em; text-transform: uppercase; transform: translateX(calc(-50% + var(--dx, 0px))); box-shadow: 0 0 0 0 rgba(255,226,122,.7), 3px 6px 10px rgba(0,0,0,.3); animation: btring 1.6s ease-out infinite; }
        @keyframes btpoke { 0%, 100% { transform: translateY(-4px) scaleY(-1); } 50% { transform: translateY(6px) scaleY(-1); } }
        @keyframes btring { 0% { box-shadow: 0 0 0 0 rgba(255,226,122,.75), 3px 6px 10px rgba(0,0,0,.3); } 100% { box-shadow: 0 0 0 16px rgba(255,226,122,0), 3px 6px 10px rgba(0,0,0,.3); } }
        @media (prefers-reduced-motion: reduce) { .bt-hand, .bt-point span { animation: none; } .bt-in { transition: none; } }

        /* ---------- catch crate + sign ---------- */
        .bt-chute { position: absolute; left: ${XE - 50}px; top: 852px; width: 230px; height: 120px; z-index: 6; transform: rotate(-2deg);
          background: var(--bt-fib), var(--bt-mot), linear-gradient(180deg, #5a3416 0 12px, transparent 12px), repeating-linear-gradient(180deg, #b77a3e 0 34px, #8e5626 34px 38px); }
        .bt-chute span { position: absolute; left: 22px; top: 22px; font: 400 15px "Archivo Black", sans-serif; letter-spacing: .04em; text-transform: uppercase; color: #3a210d; opacity: .8; }
        .bt-sign { will-change: transform; position: absolute; left: ${XE - 10}px; top: 690px; z-index: 2; transform: rotate(6deg); }

        /* ---------- end crates ---------- */
        .bt-crates { position: absolute; left: 520px; top: 470px; width: 470px; height: 430px; z-index: 7; pointer-events: none; }
        .bt-crate { will-change: transform; position: absolute; width: 230px; height: 150px; }
        .bt-c1 { left: 0; top: 280px; } .bt-c2 { left: 236px; top: 280px; } .bt-c3 { left: 118px; top: 130px; }
        .bt-crate::before { content: ""; position: absolute; left: 0; right: 0; top: -16px; height: 16px; clip-path: polygon(0 100%, 100% 100%, 95% 0, 5% 0);
          background: var(--bt-fib), linear-gradient(180deg, #e3ad6d 0 3px, #4a2a10 3px 70%, #a86d36 70%); }
        .bt-cfront { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden;
          background:
            radial-gradient(circle at 7px 18px, #2b1a12 0 2.5px, transparent 3px), radial-gradient(circle at calc(100% - 7px) 18px, #2b1a12 0 2.5px, transparent 3px),
            radial-gradient(circle at 7px calc(100% - 18px), #2b1a12 0 2.5px, transparent 3px), radial-gradient(circle at calc(100% - 7px) calc(100% - 18px), #2b1a12 0 2.5px, transparent 3px),
            var(--bt-fib), var(--bt-mot),
            linear-gradient(90deg, rgba(60,25,0,.0) 0 14px, rgba(60,25,0,.06) 30%, rgba(255,240,210,.08) 60%, rgba(60,25,0,.1)),
            linear-gradient(90deg, #8a5124 0 14px, transparent 14px calc(100% - 14px), #7a4519 calc(100% - 14px)),
            repeating-linear-gradient(180deg, #e0a868 0 2px, #c88d50 2px 44px, #5a3416 44px 47px, #a86d36 47px 49px);
          box-shadow: inset 0 -6px 10px rgba(40,15,0,.25); }
        .bt-cfront b, .bt-cfront small { -webkit-mask: var(--bt-ink); mask: var(--bt-ink); }
        .bt-cfront b { font: 400 50px/.9 "Archivo Black", sans-serif; color: #2b1a12; opacity: .82; letter-spacing: -1px; mix-blend-mode: multiply; }
        .bt-cfront b em { font-style: normal; color: #7a1d14; }
        .bt-c3 .bt-cfront b { font-size: 36px; }
        .bt-cfront small { margin-top: 6px; font: 800 14px Archivo, sans-serif; letter-spacing: .2em; text-transform: uppercase; color: #2b1a12; opacity: .8; }
        .bt-necks { position: absolute; left: 0; top: -118px; width: 100%; height: 130px; overflow: hidden; }
        .bt-necks img { position: absolute; top: 0; width: 46px; }

        /* ---------- copy overlay ---------- */
        .bt-copy { position: absolute; z-index: 8; left: 74vw; top: max(12.5vh, 62px); width: min(23.5vw, 380px); pointer-events: none; }
        .bt-copy .kb-label { font-size: clamp(30px, 3.6vw, 58px); }
        .bt-copy .kb-label { position: relative; left: auto !important; top: auto !important; display: block; max-width: none; pointer-events: auto; }
        .bt-copy .kb-label small { max-width: 25em; }
        .bt-hint2 { margin: 10px 0 0; font: 600 clamp(13px, 1vw, 15px)/1.45 Archivo, sans-serif; color: #ffe27a; text-shadow: 0 1px 2px rgba(0,0,0,.55), 0 0 10px rgba(28,56,48,.95); }
        .bt-hint2 b { font-weight: 800; }
        .bt-endc { position: absolute; left: 0; right: 0; top: 100%; margin-top: 18px; }
        /* featured Shopify Plus strip: plain buttons, same tasting card */
        .bt-plus { margin-top: 12px; padding: 10px 12px 12px; pointer-events: auto; background: rgba(28,56,48,.94); box-shadow: inset 0 0 0 2px rgba(255,246,226,.14), 4px 8px 16px rgba(0,0,0,.28); }
        .bt-plus-top { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 4px 12px; margin-bottom: 8px; }
        .bt-plus-h { font: 800 10.5px/1.2 Archivo, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #fff6e2; }
        .bt-plus-b { display: flex; flex-wrap: wrap; gap: 7px; }
        .bt-pb { position: relative; margin: 0; padding: 7px 10px 7px 22px; border: 0; background: #fff6e2; color: #2b1a12; font: 800 12px/1 Archivo, sans-serif; letter-spacing: .02em; cursor: pointer; box-shadow: 0 2px 0 rgba(0,0,0,.28); transition: transform .2s, background .2s; }
        .bt-pb::before { content: ""; position: absolute; left: 8px; top: 50%; width: 8px; height: 8px; margin-top: -4px; border-radius: 50%; background: #9e2027; box-shadow: inset 0 -2px 0 #6e1418; }
        .bt-pb:hover { background: #ffe27a; transform: translateY(-2px); }
        .bt-pb:focus-visible, .bt-all:focus-visible { outline: 3px solid #ffe27a; outline-offset: 3px; }
        .bt-all { pointer-events: auto; color: #ffe27a; font: 800 12px/1.2 Archivo, sans-serif; letter-spacing: .1em; text-transform: uppercase; text-decoration: underline 2px; text-underline-offset: 4px; white-space: nowrap; }
        .bt-all:hover { color: #fff; }
        .bt-more .bt-all { display: inline-block; margin-left: 6px; font-size: .9em; }
        .bt-stamps { display: flex; flex-wrap: wrap; gap: 12px; }
        .bt-stamp { display: inline-block; padding: 9px 14px; border: 3px solid #ffe27a; color: #ffe27a; font: 400 clamp(15px, 1.35vw, 21px) "Archivo Black", sans-serif; letter-spacing: .02em; text-transform: uppercase; transform: rotate(-3deg); opacity: 0; }
        .bt-stamp.b { transform: rotate(2deg); border-color: #fff6e2; color: #fff6e2; }
        .bt-more { margin: 16px 0 0; max-width: 30em; font: 700 clamp(12px, .95vw, 14px)/1.6 Archivo, sans-serif; color: #fff6e2; opacity: 0; }
        .bt-more span { display: inline-block; margin-right: 8px; padding: 2px 7px; background: #fff6e2; color: #2f5a4e; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; font-size: .85em; }

        /* ---------- ticket ---------- */
        .bt-ticket { position: absolute; z-index: 8; left: 56vw; bottom: max(14px, 2.4vh); display: flex; align-items: stretch; gap: 0; background: #fff6e2; color: #2b1a12;
          filter: drop-shadow(calc(var(--lx) * 4px) calc(var(--ly) * 6px) 4px rgba(0,0,0,.3)) drop-shadow(calc(var(--lx) * 14px) calc(var(--ly) * 22px) 16px rgba(0,0,0,.25));
          -webkit-mask: radial-gradient(circle 7px at 0 50%, transparent 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 7px at 100% 50%, transparent 98%, #000) right / 51% 100% no-repeat;
                  mask: radial-gradient(circle 7px at 0 50%, transparent 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 7px at 100% 50%, transparent 98%, #000) right / 51% 100% no-repeat; }
        .bt-tt { padding: 9px 14px; min-width: 210px; border-left: 2px dashed rgba(43,26,18,.25); border-right: 2px dashed rgba(43,26,18,.25); }
        .bt-tt small { display: block; font: 800 10px Archivo, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #c46a1f; }
        .bt-tt b { display: block; margin-top: 3px; font: 400 17px/1.05 "Archivo Black", sans-serif; text-transform: uppercase; }
        .bt-tt span { font: 700 12px Archivo, sans-serif; color: #6b5444; }
        .bt-tb { width: 44px; border: 0; background: none; font: 400 26px/1 "Archivo Black", sans-serif; color: #2b1a12; cursor: pointer; }
        .bt-tb:hover { color: #c46a1f; }
        .bt-taste { border: 0; margin: 8px 10px; padding: 0 16px; background: #2b1a12; color: #ffe27a; font: 800 12px Archivo, sans-serif; letter-spacing: .12em; text-transform: uppercase; cursor: pointer; }
        .bt-taste:hover { background: #c46a1f; color: #fff; }
        .bt-tb:focus-visible, .bt-taste:focus-visible { outline: 3px solid #e2463a; outline-offset: -3px; }

        @media (max-width: 760px) {
          .bt-copy { left: 20px; right: 20px; top: 84px; width: auto; }
          .bt-copy .kb-label { font-size: 34px; }
          .bt-copy .kb-label small { margin-top: 8px; font-size: 13.5px; }
          .bt-hint2 { margin-top: 8px; font-size: 13px; }
          .bt-endc { right: -20px; left: -20px; top: -10px; margin-top: 0; z-index: 7; background: #2f5a4e; padding: 10px 20px 14px; opacity: 0; }
          .bt-copy::before { content: ""; position: absolute; left: -20px; right: -20px; top: -84px; bottom: -40px; background: linear-gradient(180deg, #2f5a4e 72%, rgba(47,90,78,0)); }
          .bt-hint2 { position: relative; }
          .bt-more { font-size: 12px; line-height: 1.5; }
          .bt-ticket { left: 16px; right: 16px; bottom: 16px; }
          .bt-tt { flex: 1; min-width: 0; padding: 8px 10px; } .bt-tt b { font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .bt-tb { width: 38px; } .bt-taste { margin: 8px 6px; padding: 0 10px; }
          .bt-gauge { display: none; }
          .bt-plus { margin-top: 10px; padding: 0; background: none; box-shadow: none; }
          .bt-plus-top { margin-bottom: 6px; flex-wrap: nowrap; }
          .bt-plus-h { font-size: 10px; letter-spacing: .1em; } .bt-plus-top .bt-all { font-size: 11px; letter-spacing: .06em; }
          .bt-ft { top: 64px; }
          .bt-plus-b { flex-wrap: nowrap; overflow-x: auto; margin: 0 -20px; padding: 0 20px 4px; scrollbar-width: none; }
          .bt-plus-b::-webkit-scrollbar { display: none; }
          .bt-pb { flex: 0 0 auto; padding: 9px 10px 9px 21px; }
        }
      </style>`,

    init: (stage, K, st) => {
      const $ = s => stage.querySelector(s);
      const sec = st.trigger;
      const mobile = matchMedia("(max-width: 760px)");
      const bottles = [...stage.querySelectorAll(".bt-b")];
      const pan = $(".bt-pan"), head = $(".bt-head"), hcap = $(".bt-hcap"), nozzle = $(".bt-nozzle"), pour = $(".bt-pour");
      const reel = $(".bt-reel-in"), rr = $(".bt-rr"), btop = $(".bt-btop"), rls = [...stage.querySelectorAll(".bt-rl, .bt-end")];
      const needle = $(".bt-needle"), tName = $(".bt-tname"), tInd = $(".bt-tind"), tNo = $(".bt-tn");
      const state = bottles.map(() => ({ cap: null, foam: null, lw: -1, vis: null }));
      const belt = { s: 0 }, cam = { x: 360 };
      let cur = 0, tl = null;

      const cxOf = (i, s) => START - POS[i] * SP + s;
      const near = (X, s) => { // signed distance of the nearest bottle centre to station X
        let best = 1e9;
        for (let i = 0; i < POS.length; i++) { const d = cxOf(i, s) - X; if (Math.abs(d) < Math.abs(best)) best = d; }
        return best;
      };
      const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
      const press = (d, r) => { const t = clamp(1 - Math.abs(d) / r, 0, 1); return Math.sin(t * Math.PI / 2); };

      function render(s) {
        for (let i = 0; i < bottles.length; i++) {
          const el = bottles[i], S = state[i], cx = cxOf(i, s);
          let y = 0, r = 0;
          const d = cx - XE;
          if (d > 0) { r = Math.min(d * .28, 50); y = d * d * .04; }
          const vis = cx > -140 && cx < 1720 && y < 640;
          if (vis !== S.vis) { el.style.visibility = vis ? "" : "hidden"; S.vis = vis; }
          if (!vis) continue;
          el.style.transform = `translate3d(${(cx - BW / 2).toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${r.toFixed(2)}deg)`;
          const cap = cx >= XC - 1; if (cap !== S.cap) { el.classList.toggle("capped", cap); S.cap = cap; }
          const foam = cx > XF + 22 && cx < XC - 1; if (foam !== S.foam) { el.classList.toggle("foamy", foam); S.foam = foam; }
          const lw = Math.round(clamp((cx - (XL - 30)) / 92, 0, 1) * 50) / 50;
          if (lw !== S.lw) { el.style.setProperty("--lw", lw); S.lw = lw; }
        }
        // machines
        const dF = near(XF, s), pF = press(dF, 46);
        nozzle.style.transform = `translateY(${(pF * 26).toFixed(1)}px)`;
        pour.style.opacity = pF > .55 ? 1 : 0;
        const dC = near(XC, s), pC = press(dC, 40);
        head.style.transform = `translateY(${(pC * 46).toFixed(1)}px)`;
        hcap.style.opacity = dC >= -1 && dC < 70 ? 0 : 1;
        const dL = near(XL, s), pL = press(dL - 30, 40);
        rr.style.transform = `translateX(${(-pL * 6).toFixed(1)}px) scaleX(${(1 + pL * .12).toFixed(3)})`;
        rr.style.backgroundPositionY = (s * .9).toFixed(1) + "px";
        reel.style.transform = `rotate(${(s * .45).toFixed(1)}deg)`;
        btop.style.backgroundPositionX = (s % 40).toFixed(1) + "px";
        const rot = `rotate(${(s * 4.6).toFixed(1)}deg)`; rls.forEach(e => e.style.transform = rot);
        // ticket: labelled bottle closest to the spotlight
        const spot = spotX();
        let bi = -1, bd = 1e9;
        for (let i = 0; i < NSTORES; i++) { const cx = cxOf(i, s); if (cx < XL + 40 || cx > XE + 20 || !clear(cx)) continue; const dd = Math.abs(cx - spot); if (dd < bd) { bd = dd; bi = i; } }
        if (bi < 0) bi = s < 100 ? 0 : NSTORES - 1;
        if (bi !== cur) setCur(bi);
        deco(s);
      }
      function setCur(bi) { cur = bi; const sh = SHOPS[bi]; tName.textContent = sh.name; tInd.textContent = sh.res ? "Shopify Plus reserve" : sh.ind; tNo.textContent = pad(bi + 1); }

      // ---------- clarity: spotlight name tag + first-time hint ----------
      const ftag = $(".bt-ftag"), ftName = ftag.querySelector("b"), ftSub = ftag.querySelector("i"), point = $(".bt-point");
      const TAP_KEY = "cb-bottle-tapped";
      let tapped = false; try { tapped = sessionStorage.getItem(TAP_KEY) === "1"; } catch (e) {}
      if (matchMedia("(hover: hover) and (pointer: fine)").matches) point.querySelector("span").textContent = "Click a bottle to see the store";
      const S_UI_END = SEND * (.79 - A) / (B - A);       // the end stamps take over from here (timeline .8)
      let feat = -1, hw = null;
      const ftBox = ftag.querySelector(".bt-ft"), ptBox = point.querySelector("span");
      function deco(s) {
        const cx = cxOf(cur, s), sh = SHOPS[cur];
        const f = !sh.final && s < S_UI_END && cx >= XL + 40 && cx <= XE && state[cur].vis && clear(cx) ? cur : -1;
        if (f !== feat) {
          if (feat >= 0) bottles[feat].classList.remove("is-feat");
          feat = f;
          if (f >= 0) { bottles[f].classList.add("is-feat"); ftName.textContent = sh.name; ftSub.textContent = sh.res ? "Shopify Plus · View store →" : "View store →"; ftag.setAttribute("aria-label", `Open ${sh.name} case`); hw = null; }
          ftag.classList.toggle("on", f >= 0);
          point.classList.toggle("on", f >= 0 && !tapped);
        }
        if (f >= 0) {
          const g = getGeo(), px = mobile.matches ? 720 - cam.x : 0, ts = Math.max(g.sc, .9), X = g.L + (px + cx) * g.sc;
          const t = `translate3d(${X.toFixed(1)}px,${(g.T + TOP * g.sc).toFixed(1)}px,0) scale(${ts.toFixed(4)})`;   // never shrink the words below ~readable
          ftag.style.transform = t; point.style.transform = t;
          // keep the tag + hint boxes inside the viewport edge (the hand and the tag's notch stay on the bottle)
          if (!hw) hw = [ftBox.offsetWidth / 2, ptBox.offsetWidth / 2];
          [ftBox, ptBox].forEach((el, k) => {
            const h = hw[k] * ts, d = Math.min(0, g.W - 10 - (X + h)) + Math.max(0, 10 - (X - h));
            const v = (d / ts).toFixed(1) + "px"; if (el._dx !== v) { el._dx = v; el.style.setProperty("--dx", v); }
          });
        }
      }
      ftag.addEventListener("click", () => { if (feat >= 0) open(feat, ftag.querySelector(".bt-ft")); });
      // keyboard: the tag follows the focused bottle (when it is on the line and clear of the copy)
      stage.querySelector(".bt-line").addEventListener("focusin", e => {
        const b = e.target.closest(".bt-b"); if (!b) return;
        const i = +b.dataset.i, cx = cxOf(i, belt.s);
        restT = performance.now();
        if (i < NSTORES && cx >= XL + 40 && cx <= XE && clear(cx)) { setCur(i); deco(belt.s); }
      });
      const applyCam = () => { pan.style.transform = mobile.matches ? `translateX(${(720 - cam.x).toFixed(1)}px)` : ""; if (feat >= 0) deco(belt.s); };

      // ---------- tasting-note poster (Flip-style zoom, done by hand) ----------
      const pop = document.createElement("div");
      pop.className = "bt-pop"; pop.hidden = true;
      pop.innerHTML = `<div class="bt-scrim"></div>
        <article class="bt-card" role="dialog" aria-modal="true" aria-labelledby="bt-pn" tabindex="-1">
          <i class="bt-ctape"></i>
          <div class="bt-cshot"><img alt=""><div class="bt-cblank"><b>code</b><b>brew</b><i>your store here</i></div></div>
          <div class="bt-cbody">
            <span class="bt-cno"></span>
            <h3 id="bt-pn"></h3>
            <span class="bt-cind"></span>
            <p class="bt-cnote"></p>
            <dl><dt>Poured on</dt><dd class="bt-cpl">Shopify</dd><dt>On tap at</dt><dd class="bt-cdom"></dd></dl>
            <div class="bt-cact"><a class="bt-visit" target="_blank" rel="noopener"></a><a class="bt-more2"></a></div>
            <button class="bt-close" type="button">← Back to the line</button>
          </div>
          <button class="bt-x" type="button" aria-label="Close">×</button>
        </article>
        <div class="bt-fly"><img alt=""></div>
        <style>
          .bt-pop { position: fixed; inset: 0; z-index: 80; display: grid; place-items: center; padding: 90px 24px 24px; overflow: auto; overscroll-behavior: contain; }
          .bt-pop[hidden] { display: none; }
          .bt-scrim { position: absolute; inset: 0; background: rgba(22,44,37,.72); backdrop-filter: blur(3px); }
          .bt-card { position: relative; display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 30px; width: min(1040px, 100%); box-sizing: border-box; padding: 28px; background: #fbf3e2; color: #2b1a12; transform: rotate(-.6deg);
            box-shadow: 0 2px 3px rgba(0,0,0,.25), 18px 30px 50px rgba(0,0,0,.35); outline: none; }
          .bt-card::before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .5; mix-blend-mode: multiply;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .55 0 0 0 0 .45 0 0 0 0 .3 0 0 0 .22 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E"); }
          .bt-ctape { position: absolute; left: 50%; top: -14px; width: 120px; height: 30px; margin-left: -60px; background: rgba(242,193,78,.7); transform: rotate(-3deg); }
          .bt-cshot { position: relative; aspect-ratio: 16 / 10; background: #2b1a12; box-shadow: 0 0 0 8px #fff, 4px 8px 18px 8px rgba(0,0,0,.14); }
          .bt-cshot img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; }
          .bt-cblank { position: absolute; inset: 0; display: none; flex-direction: column; align-items: center; justify-content: center; background: #f2c14e; }
          .bt-cblank b { font: 400 clamp(44px, 6vw, 84px)/.9 "Archivo Black", sans-serif; letter-spacing: -3px; color: #fff6e2; } .bt-cblank b + b { color: #2b1a12; }
          .bt-cblank i { margin-top: 12px; font: 800 13px Archivo, sans-serif; font-style: normal; letter-spacing: .2em; text-transform: uppercase; color: #2b1a12; }
          .bt-card.is-final .bt-cblank { display: flex; } .bt-card.is-final .bt-cshot img { display: none; }
          .bt-cbody { display: flex; flex-direction: column; align-items: flex-start; padding-top: 4px; min-width: 0; }
          .bt-cno { font: 800 11px Archivo, sans-serif; letter-spacing: .2em; text-transform: uppercase; color: #c46a1f; }
          .bt-card h3 { margin: 10px 0 10px; max-width: 100%; font: 400 clamp(26px, 2.9vw, 42px)/.95 "Archivo Black", sans-serif; text-transform: uppercase; letter-spacing: -.01em; overflow-wrap: break-word; hyphens: auto; }
          .bt-cind { display: inline-block; padding: 5px 12px; border: 2px solid #2f5a4e; color: #2f5a4e; font: 800 11px Archivo, sans-serif; letter-spacing: .16em; text-transform: uppercase; transform: rotate(-2deg); }
          .bt-card.is-res .bt-cind { border-color: #7c171b; color: #7c171b; }
          .bt-cnote { margin: 16px 0 0; max-width: 100%; font: 600 16px/1.5 Archivo, sans-serif; color: #4a3426; overflow-wrap: break-word; }
          .bt-card dl { display: grid; grid-template-columns: auto 1fr; gap: 6px 14px; margin: 18px 0 0; padding-top: 14px; border-top: 2px dashed rgba(43,26,18,.2); width: 100%; font: 700 14px Archivo, sans-serif; }
          .bt-card dd { min-width: 0; overflow-wrap: anywhere; } .bt-card dt { font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: #9a7a5f; align-self: center; } .bt-card dd { margin: 0; }
          .bt-cact { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 22px; max-width: 100%; }
          .bt-visit, .bt-more2 { display: inline-block; max-width: 100%; box-sizing: border-box; padding: 14px 18px; font: 800 13px Archivo, sans-serif; letter-spacing: .1em; text-transform: uppercase; text-decoration: none; }
          .bt-visit { background: #2b1a12; color: #ffe27a; box-shadow: 6px 10px 18px rgba(0,0,0,.2); } .bt-visit:hover { background: #c46a1f; color: #fff; }
          .bt-more2 { background: #f2c14e; color: #2b1a12; } .bt-more2:not([href]) { display: none; }
          .bt-close { margin-top: auto; padding: 14px 0 0; border: 0; background: none; font: 800 12px Archivo, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #2f5a4e; cursor: pointer; }
          .bt-x { position: absolute; right: -16px; top: -16px; width: 44px; height: 44px; border-radius: 50%; border: 0; background: #e2463a; color: #fff; font: 400 26px/1 "Archivo Black", sans-serif; cursor: pointer; box-shadow: 4px 8px 14px rgba(0,0,0,.3); }
          .bt-fly { position: fixed; left: 0; top: 0; z-index: 2; overflow: hidden; pointer-events: none; visibility: hidden; background: #fff; box-shadow: 10px 20px 40px rgba(0,0,0,.35); }
          .bt-fly img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; display: block; }
          @media (max-width: 980px), (max-height: 560px) { .bt-pop { align-items: start; } .bt-cnote { font-size: 15px; } .bt-visit, .bt-more2 { padding: 12px 16px; font-size: 12px; } }
          @media (max-width: 760px) {
            .bt-pop { padding: 70px 16px 16px; align-items: start; overflow: auto; }
            .bt-card { grid-template-columns: 1fr; gap: 18px; padding: 16px; }
            .bt-cnote { font-size: 14.5px; margin-top: 12px; } .bt-card dl { margin-top: 12px; } .bt-cact { margin-top: 14px; }
            .bt-x { right: -6px; top: -14px; }
          }
        </style>`;
      document.body.appendChild(pop);
      const card = pop.querySelector(".bt-card"), scrim = pop.querySelector(".bt-scrim"), fly = pop.querySelector(".bt-fly"), flyImg = fly.querySelector("img");
      const cImg = pop.querySelector(".bt-cshot img"), cShot = pop.querySelector(".bt-cshot");
      let openI = -1, openY = 0, busy = false, lastFocus = null;
      const rectOf = el => { const r = el.getBoundingClientRect(); return { left: r.left, top: r.top, width: r.width, height: r.height }; };
      const fill = (i) => {
        const sh = SHOPS[i];
        card.classList.toggle("is-res", !!sh.res); card.classList.toggle("is-final", !!sh.final);
        pop.querySelector(".bt-cno").textContent = sh.final ? "Tasting note · next batch" : sh.res ? `Plus reserve · Bottle ${pad(i + 1)}/${NSTORES}` : `Tasting note · Bottle ${pad(i + 1)}/${NSTORES}`;
        pop.querySelector("h3").textContent = sh.name;
        pop.querySelector(".bt-cind").textContent = sh.final ? "Brewed to order" : sh.res ? "Shopify Plus reserve" : sh.ind;
        pop.querySelector(".bt-cnote").textContent = sh.final ? "The next bottle on this line could carry your label. Tell me what you're thirsty for and I'll pour it fresh." : sh.plus || NOTES[sh.ind] || "";
        pop.querySelector(".bt-cpl").textContent = sh.res ? "Shopify Plus" : "Shopify";
        pop.querySelector(".bt-cdom").textContent = sh.final ? "codebrew.pt" : sh.domain;
        const v = pop.querySelector(".bt-visit"), m = pop.querySelector(".bt-more2");
        if (sh.final) { v.textContent = "Order a round →"; v.href = "#tram"; v.removeAttribute("target"); }
        else { v.textContent = "Visit the live store ↗"; v.href = "https://" + sh.domain + "/"; v.target = "_blank"; }
        if (sh.res) { m.href = "shopify-plus.html"; m.textContent = "Plus brew notes →"; } else m.removeAttribute("href");
        if (!sh.final) { cImg.src = flyImg.src = `assets/work/${sh.key}.jpg`; cImg.alt = `${sh.name} storefront`; }
      };
      let openTl = null, closeTl = null;
      function open(i, src) {
        if (closeTl && closeTl.isActive()) closeTl.progress(1);   // a tap during the fly-back: land it now, open the next
        if (busy || openI >= 0) return;
        const btn = bottles[i]; if (!btn) return;
        if (!tapped) { tapped = true; point.classList.remove("on"); try { sessionStorage.setItem(TAP_KEY, "1"); } catch (e) {} }
        try { scrollTo({ top: scrollY, behavior: "instant" }); } catch (e) {}   // stop an in-flight ‹ › glide, or it would close the card at once
        busy = true; openI = i; openY = scrollY; lastFocus = document.activeElement;
        fill(i);
        pop.hidden = false;
        let from = rectOf(btn.querySelector(".bt-lab"));
        const seen = btn.style.visibility !== "hidden" && from.width > 4 && from.left > -from.width && from.left < innerWidth && from.top > -from.height && from.top < innerHeight;
        if (!seen && src) from = rectOf(src);      // opened from the Plus strip while that bottle is off the line
        gsap.set(card, { clearProps: "transform" }); // a previous close leaves the card shrunk: measure the real landing spot
        const to = rectOf(cShot);
        const final = !!SHOPS[i].final;
        gsap.set(card, { opacity: 0, scale: .92, y: 30, rotation: -.6 });
        gsap.set(scrim, { opacity: 0 });
        gsap.set(cShot, { visibility: "hidden" });
        fly.style.background = final ? "#f2c14e" : "#fff"; flyImg.style.display = final ? "none" : "";
        gsap.set(fly, { visibility: "visible", ...from, rotation: 0 });
        const dur = K.reduced ? .01 : .75;
        openTl = gsap.timeline({ onComplete: () => { gsap.set(cShot, { visibility: "visible" }); gsap.set(fly, { visibility: "hidden" }); busy = false; card.focus({ preventScroll: true }); } })
          .to(scrim, { opacity: 1, duration: dur * .6 }, 0)
          .to(fly, { keyframes: { left: [from.left, to.left], top: [from.top, to.top - 60, to.top], width: [from.width, to.width], height: [from.height, to.height], rotation: [0, -6, 0] }, duration: dur, ease: "power3.inOut" }, 0)
          .to(card, { opacity: 1, scale: 1, y: 0, duration: dur * .7, ease: "back.out(1.4)" }, dur * .4);
      }
      function close() {
        if (openTl && openTl.isActive()) openTl.progress(1);      // closing mid-zoom (slow frames / quick tap): finish it first
        if (busy || openI < 0) return;
        busy = true;
        const lab = bottles[openI].querySelector(".bt-lab"), from = rectOf(cShot);
        let to = rectOf(lab);
        const onScreen = to.width > 4 && to.top > -to.height && to.top < innerHeight && to.left > -to.width && to.left < innerWidth && bottles[openI].style.visibility !== "hidden";
        if (!onScreen) to = { left: from.left + from.width / 2, top: innerHeight + 40, width: 20, height: 20 };
        gsap.set(fly, { visibility: "visible", ...from });
        gsap.set(cShot, { visibility: "hidden" });
        const dur = K.reduced ? .01 : .6;
        closeTl = gsap.timeline({ onComplete: () => { pop.hidden = true; gsap.set(fly, { visibility: "hidden" }); openI = -1; busy = false; if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); } })
          .to(card, { opacity: 0, scale: .94, y: 20, duration: dur * .45, ease: "power2.in" }, 0)
          .to(fly, { left: to.left, top: to.top, width: to.width, height: to.height, rotation: 4, duration: dur, ease: "power3.inOut" }, 0)
          .to(scrim, { opacity: 0, duration: dur * .7 }, dur * .3);
      }
      stage.querySelector(".bt-line").addEventListener("click", e => { const b = e.target.closest(".bt-b"); if (b) open(+b.dataset.i); });
      pop.querySelector(".bt-close").addEventListener("click", close);
      pop.querySelector(".bt-x").addEventListener("click", close);
      scrim.addEventListener("click", close);
      addEventListener("keydown", e => { if (e.key === "Escape" && openI >= 0) close(); });
      addEventListener("scroll", () => { if (openI >= 0 && !busy && Math.abs(scrollY - openY) > 160) close(); }, { passive: true });

      // ---------- ticket: prev / next / taste ----------
      const sFor = i => clamp(spotX() - START + POS[i] * SP, 0, SEND);
      const goTo = i => {
        i = clamp(i, 0, NSTORES - 1);
        if (K.reduced) { belt.s = sFor(i); render(belt.s); return; }
        const p = A + (B - A) * sFor(i) / SEND;
        // map through the live trigger: its range is "bottom 200%" (the next sheet covers the last 100vh), not the section height
        const T = tl && tl.scrollTrigger, top = T ? T.start + p * (T.end - T.start) : sec.offsetTop + p * (sec.offsetHeight - 2 * innerHeight);
        scrollTo({ top, behavior: "smooth" });
      };
      $(".bt-prev").addEventListener("click", () => goTo(cur - 1));
      $(".bt-next").addEventListener("click", () => goTo(cur + 1));
      $(".bt-taste").addEventListener("click", () => open(cur, $(".bt-taste")));
      stage.querySelectorAll(".bt-pb").forEach(b => b.addEventListener("click", () => open(+b.dataset.i, b)));

      // ---------- passive showcase: when the line rests, the name tag hops along the visible labelled bottles ----------
      let restS = -1, restT = performance.now();
      setInterval(() => {
        const now = performance.now();
        if (belt.s !== restS) { restS = belt.s; restT = now; return; }
        if (openI >= 0 || document.hidden || now - restT < 3200) return;
        const r = stage.getBoundingClientRect(); if (r.top > innerHeight * .3 || r.bottom < innerHeight * .7) return;
        if (belt.s >= S_UI_END) return;
        const cand = [];
        for (let i = 0; i < NSTORES; i++) {
          const cx = cxOf(i, belt.s); if (!state[i].vis || cx < XL + 62 || cx > XE || !clear(cx)) continue;
          const br = bottles[i].getBoundingClientRect(); if (br.left < 4 || br.right > innerWidth - 4) continue;
          cand.push(i);
        }
        if (!cand.length) return;
        cand.sort((a, b) => cxOf(a, 0) - cxOf(b, 0));
        const k = cand.indexOf(cur), nx = cand[(k + 1) % cand.length];
        restT = now;
        if (nx !== cur) { setCur(nx); deco(belt.s); }
      }, 400);

      // ---------- mobile: centre the scene on the action ----------
      const onMQ = () => { applyCam(); render(belt.s); };
      mobile.addEventListener ? mobile.addEventListener("change", onMQ) : mobile.addListener(onMQ);

      // wide + short desktop windows: the shared cover-fit crops ~250 design px off this line (gauge under the nav, belt
      // below the fold, bottles through the copy). Height-fit the box instead, left-aligned so the copy keeps the right edge.
      const box = stage.querySelector(".kbox"), ticket = $(".bt-ticket"), copy = $(".bt-copy");
      // where the name tag may sit: never under the copy column (label + Plus strip). Geometry in stage px, cached per refit.
      let geo = null;
      const getGeo = () => {
        if (geo) return geo;
        const sr = stage.getBoundingClientRect(), br = box.getBoundingClientRect(), k = sr.width / (stage.offsetWidth || sr.width || 1);  // k: stage's own cover-scale
        const sc = br.width / k / (box.offsetWidth || 1440);
        geo = { sc, W: stage.clientWidth, L: (br.left - sr.left) / k, T: (br.top - sr.top) / k, c: { l: copy.offsetLeft - 12, r: copy.offsetLeft + copy.offsetWidth + 12, t: copy.offsetTop - 12, b: copy.offsetTop + copy.offsetHeight + 12 } };
        return geo;
      };
      const band = () => mobile.matches ? [TOP + 50, TOP + 210] : [TOP - 86, TOP];       // tag (+ hint on phones) rows, design px
      function clear(cx) {
        const g = getGeo(), px = mobile.matches ? 720 - cam.x : 0, x = g.L + (px + cx) * g.sc, [t, b] = band(), hw = 135 * g.sc;
        return x + hw < g.c.l || x - hw > g.c.r || g.T + b * g.sc < g.c.t || g.T + t * g.sc > g.c.b;
      }
      function spotX() {
        if (mobile.matches) return cam.x + 40;
        const g = getGeo(), [t, b] = band();
        if (g.T + b * g.sc < g.c.t || g.T + t * g.sc > g.c.b) return XE - 60;
        return clamp((g.c.l - g.L) / g.sc - 140, XL + 70, XE - 60);
      }
      const refit = () => {
        geo = null;
        const W = stage.clientWidth, H = stage.clientHeight;
        if (!mobile.matches && W / H >= 1.6 && H / Math.max(W / 1440, H / 900) < 780) {
          const sc = H / 860; box.style.transform = `translate(0px, 0px) scale(${sc.toFixed(5)})`;
        }
        // the "On the line" ticket must never sit on the copy (short landscape windows): slide it left of it
        ticket.style.left = "";
        if (!mobile.matches) {
          const tw = ticket.offsetWidth, tt = ticket.offsetTop, cl = copy.offsetLeft, cb = copy.offsetTop + copy.offsetHeight + 12;
          let tl = Math.min(ticket.offsetLeft, stage.clientWidth - 24 - tw);                // never past the right edge / progress keg
          if (tt < cb && tl + tw > cl - 16 && tl < cl + copy.offsetWidth) tl = cl - tw - 24;  // never on the copy
          if (tl !== ticket.offsetLeft) ticket.style.left = Math.max(16, tl) + "px";
        }
      };
      refit(); addEventListener("resize", refit); ScrollTrigger.addEventListener("refreshInit", refit);
      ScrollTrigger.addEventListener("refresh", () => { geo = null; hw = null; render(belt.s); });   // box scale settles after refit
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(refit);

      render(0); applyCam();
      if (K.reduced) { // static: full line, end stamps visible
        cam.x = 840; applyCam();
        gsap.set(".bt-stream", { scaleY: 1 });
        gsap.set(".bt-crates", { display: "none" });
        gsap.set(".bt-endc", { display: "none" });
        return;
      }

      // ---------- idle life ----------
      gsap.to(".bt-sign", { rotation: 2, duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
      // speed gauge: needle follows the belt's real speed, falls back with a little wobble when the line stops
      let lastS = 0, v = 0, ang = -70;
      gsap.ticker.add(() => {
        const ds = Math.abs(belt.s - lastS); lastS = belt.s;
        v += (ds - v) * .08;
        const target = -70 + Math.min(140, v * 9) + Math.sin(performance.now() / 90) * Math.min(3, .4 + v * .3);
        ang += (target - ang) * .12;
        needle.style.transform = `rotate(${ang.toFixed(2)}deg)`;
      });

      // ---------- the one scrubbed timeline ----------
      gsap.set(".bt-stream", { scaleY: 0 });
      gsap.set(".bt-crate", { y: -1100 });
      tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { ...st, scrub: 1 } });
      tl.to(".bt-stream", { scaleY: 1, duration: .03, ease: "power1.in" }, 0)
        .fromTo(".bt-level", { scaleY: .25 }, { scaleY: 1, duration: .06, ease: "power1.out" }, .01)
        .from(".bt-copy > *", { y: 50, opacity: 0, stagger: .015, duration: .05, ease: "power2.out" }, 0)
        .to(belt, { s: SEND, duration: B - A, onUpdate: () => render(belt.s) }, A)
        // mobile camera (only applied under 760px)
        .to(cam, { x: 840, duration: .08, ease: "power1.inOut", onUpdate: applyCam }, .02)
        .to(cam, { x: 755, duration: .06, ease: "power1.inOut", onUpdate: applyCam }, .78)
        // follow the last bottle as it tips off the belt end (it reaches XE at ~.858, is gone by B), then straight back to
        // the crate stack, so the phone never sits on an empty belt end
        .to(cam, { x: XE - 50, duration: .03, ease: "power1.inOut", onUpdate: applyCam }, .845)
        .to(cam, { x: 755, duration: .035, ease: "power1.inOut", onUpdate: applyCam }, .895)
        // crates thump down once the last store has passed
        .to(".bt-c1", { y: 0, duration: .05, ease: "bounce.out" }, .79)
        .to(".bt-c2", { y: 0, duration: .05, ease: "bounce.out" }, .815)
        .to(".bt-c3", { y: 0, duration: .055, ease: "bounce.out" }, .84)
        .to(".bt-ticket", { y: 140, opacity: 0, duration: .03, ease: "power1.in" }, .8)
        .to(".bt-hint2", { opacity: 0, duration: .02 }, .8)
        .to(".bt-plus", { autoAlpha: 0, duration: .02 }, .8)
        .to(".bt-sign", { autoAlpha: 0, duration: .02 }, .8)
        .to(".bt-endc", { opacity: 1, duration: .01 }, .82)
        .fromTo(".bt-stamp", { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: .025, stagger: .02, ease: "back.out(2)" }, .83)
        .to(".bt-more", { opacity: 1, duration: .04 }, .88)
        .to(".bt-stream", { scaleY: 0, transformOrigin: "50% 100%", duration: .03 }, .95)
        .to({}, { duration: .001 }, 1);
    }
  });
})();
