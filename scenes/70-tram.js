/* 70 · TRAM — "Order a round" (the contact section). DELIVERY.
   A steep Lisbon street at golden hour, built from layered matte paper: azulejo façades stepping up the hill,
   terracotta roofs, Santos Populares bunting, calçada portuguesa pavements, rails and the overhead wire.
   The finished codebrew bottle drops from the top edge into the crate on the yellow tram's back platform.
   Scroll and the tram climbs the hill (bobbing on the setts, sparks spitting from the trolley pole), outruns the
   camera, and pulls up at the door of "Tasca do Barril", where Barril steps out to wave. The real order slip
   (contact form) is pinned on the tram-stop cork board in the foreground. */
(function () {
  const K = window.K;
  const WW = 2760, STEP = 4, R0 = 836;                       // world width (design px), rail table step, rail y at the bottom of the hill
  const TW = 540, TS = TW / 1100;                            // tram width + sprite scale
  const TX0 = 330, TX1 = 1990;                               // tram centre: start / stop
  const ss = (a, b, x) => { const k = Math.max(0, Math.min(1, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  const slope = x => .21 * ss(470, 820, x) * (1 - ss(1480, 1880, x));
  const RT = []; { let y = R0; for (let x = -400; x <= WW + 400; x += STEP) { RT.push(y); y -= slope(x) * STEP; } }
  const rail = x => { const i = (x + 400) / STEP, i0 = Math.max(0, Math.min(RT.length - 2, Math.floor(i))), k = Math.min(1, i - i0); return RT[i0] + (RT[i0 + 1] - RT[i0]) * k; };
  const base = x => rail(x) - 96;                            // back-pavement line where the façades stand
  const f1 = v => (+v).toFixed(1);
  let sd = 23; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const pick = a => a[Math.floor(rnd() * a.length)];

  /* azulejo tile as an SVG data-URI (shared look with the bar) */
  const tile = (fg, bg, alt) => {
    const s = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><rect width='40' height='40' fill='${bg}'/>
      <g fill='${fg}'><circle r='9'/><circle cx='40' r='9'/><circle cy='40' r='9'/><circle cx='40' cy='40' r='9'/>
      ${[0, 90, 180, 270].map(a => `<ellipse cx='20' cy='10.5' rx='3.4' ry='6.2' transform='rotate(${a} 20 20)'/>`).join("")}
      <circle cx='20' cy='20' r='3.2'/><circle cx='20' cy='1.5' r='1.6'/><circle cx='20' cy='38.5' r='1.6'/><circle cx='1.5' cy='20' r='1.6'/><circle cx='38.5' cy='20' r='1.6'/></g>
      <g fill='${bg}'><circle r='4.2'/><circle cx='40' r='4.2'/><circle cy='40' r='4.2'/><circle cx='40' cy='40' r='4.2'/><circle cx='20' cy='20' r='1.3'/></g>
      <g fill='${alt || fg}' opacity='.55'>${[45, 135, 225, 315].map(a => `<circle cx='20' cy='9' r='1.4' transform='rotate(${a} 20 20)'/>`).join("")}</g>
      <rect x='.5' y='.5' width='39' height='39' fill='none' stroke='rgba(60,40,20,.12)'/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(s.replace(/\s+/g, " "))}")`;
  };
  const FACADES = [
    // soft, sun-washed pastels: the street is the backdrop, the slip + tram are the subject
    { bg: `${tile("#8ea6c4", "#f4f1ea", "#bccbdc")} 0 0/30px 30px, #f4f1ea`, trim: "#f7f3ec", sh: "#6f8c7c" },
    { bg: "#ecd0c6", trim: "#f8f2ea", sh: "#6f8c80" },
    { bg: `${tile("#94b3a2", "#f1f2ec", "#c2d4c9")} 0 0/30px 30px, #f1f2ec`, trim: "#f7f4ec", sh: "#8a6a58" },
    { bg: "#efdcae", trim: "#f8f3ea", sh: "#6f8c7c" },
    { bg: `${tile("#d2b68a", "#f7f2e4", "#9fb2cc")} 0 0/30px 30px, #f7f2e4`, trim: "#fbf8f0", sh: "#7d93b0" },
    { bg: "#d8e2cf", trim: "#f7f4ec", sh: "#957064" },
    { bg: "#e2b9aa", trim: "#f8f1e8", sh: "#6b8577" },
    { bg: "#f3eee5", trim: "#e6dccb", sh: "#7d93b0" },
  ];

  /* ---------- façades ---------- */
  const FH = 108;
  const wins = [];
  function house(x, w, floors, F, opts = {}) {
    const bR = base(x + w), bL = base(x), top = bR - floors * FH - 30, h = bL - top + 30, gnd = 30 + (floors - 1) * FH;
    let s = `<div class="tr-h" style="left:${x}px;top:${f1(top)}px;width:${w}px;height:${f1(h)}px;background:${F.bg.replace(/"/g, "&quot;")};--trim:${F.trim};--sh:${F.sh}">`;
    s += `<i class="tr-roof" style="--rw:${w + 22}px"></i>`;
    if (rnd() > .45) s += `<i class="tr-chim" style="left:${Math.round(w * (.2 + rnd() * .6))}px"></i>`;
    s += `<i class="tr-corn"></i><i class="tr-socle" style="top:${gnd + FH - 6}px"></i>`;
    const n = Math.max(2, Math.round(w / 92)), gap = w / n;
    for (let j = 0; j < floors - 1; j++) {
      const y = 30 + j * FH + 18, bal = (j === floors - 2 && rnd() > .35) || (j === floors - 3 && rnd() > .7);
      for (let k = 0; k < n; k++) {
        const cx = gap * (k + .5), id = wins.length; wins.push(rnd());
        s += `<i class="tr-win${bal ? " bal" : ""}" data-w="${id}" style="left:${f1(cx - 21)}px;top:${y}px"><b></b><u></u><u class="r"></u>${bal ? `<em></em>` : ""}${bal && rnd() > .5 ? `<i class="tr-pot" style="--pc:${pick(["#d98c80", "#ecd08e", "#e0a9bf"])}"></i>` : ""}</i>`;
      }
      if (j === 1 && rnd() > .55 && n > 1) { // laundry line
        const y2 = y + 70; s += `<i class="tr-line" style="top:${y2}px;left:${f1(gap * .5)}px;width:${f1(gap * (n - 1))}px">${[0, 1, 2, 3].map(q => `<s style="left:${12 + q * (gap * (n - 1) - 30) / 4}px;--lc:${pick(["#fff", "#e3a49a", "#a8c8de", "#f0dca4", "#f3d3da"])};--lh:${16 + rnd() * 14}px"></s>`).join("")}</i>`;
      }
    }
    // ground floor: a door down to the (sloping) pavement + a shop window
    const dx = opts.door ?? Math.round(gap * (rnd() > .5 ? .5 : n - .5)), dB = base(x + dx) - top;
    s += `<i class="tr-door" style="left:${dx - 26}px;top:${gnd + 16}px;height:${f1(dB - gnd - 16)}px;--dc:${pick(["#2f5a46", "#6b3a22", "#2457a8", "#8a2a22"])}"></i>`;
    if (opts.lamp ?? rnd() > .5) s += `<i class="tr-lamp" style="left:${dx + 34}px;top:${gnd - 10}px"></i>`;
    s += "</div>";
    return s;
  }
  let streetHTML = "", hx = -30;
  const tops = [];
  while (hx < 2120) {
    const w = 190 + Math.round(rnd() * 80), fl = hx < 900 ? 4 + (rnd() > .6) : 3 + (rnd() > .55);
    streetHTML += house(hx, w, fl, FACADES[tops.length % FACADES.length]);
    tops.push([hx, base(hx + w) - fl * FH - 30, w]); hx += w;
  }
  const TAX = hx, TAW = WW - TAX + 40, TDX = 150;           // the tasca façade, door at TAX+TDX
  const doorX = TAX + TDX;

  /* bunting between façades */
  const flags = () => {
    let s = "", cols = ["#e08a7e", "#f0d590", "#93bdd8", "#b2cf9a", "#fff8ea", "#e3abc2"], c = 0;
    for (let x = 40; x < WW - 300; x += 250) {
      const x2 = x + 250, y1 = base(x) - 372, y2 = base(x2) - 372, sag = 46, N = 11;
      s += `<path d="M${x} ${f1(y1)} Q${(x + x2) / 2} ${f1((y1 + y2) / 2 + sag * 2)} ${x2} ${f1(y2)}" fill="none" stroke="#efe6d6" stroke-width="2"/>`;
      for (let i = 1; i < N; i++) {
        const t = i / N, px = (1 - t) * (1 - t) * x + 2 * (1 - t) * t * (x + x2) / 2 + t * t * x2, py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * ((y1 + y2) / 2 + sag * 2) + t * t * y2;
        s += `<path class="tr-flag" style="animation-delay:${f1(-rnd() * 2)}s" d="M${f1(px - 9)} ${f1(py)} L${f1(px + 9)} ${f1(py)} L${f1(px)} ${f1(py + 24)}Z" fill="${cols[c++ % cols.length]}"/>`;
      }
    }
    return s;
  };

  /* road bands */
  const band = (o1, o2, x0 = -60, x1 = WW + 60) => {
    let a = [], b = [];
    for (let x = x0; x <= x1; x += 20) { a.push(`${x} ${f1(rail(x) + o1)}`); b.unshift(`${x} ${f1(rail(x) + o2)}`); }
    return `M${a.join(" L")} L${b.join(" L")}Z`;
  };
  const line = (o, x0 = -60, x1 = WW + 60) => { let a = []; for (let x = x0; x <= x1; x += 20) a.push(`${x} ${f1(rail(x) + o)}`); return `M${a.join(" L")}`; };
  const WIRE = -326;

  /* far city: castle hill, cathedral, the red bridge over the river */
  const far = () => {
    let s = `<rect x="0" y="560" width="2400" height="200" fill="#cfe1ea"/>`;  // river haze
    s += `<g filter="url(#sh1)"><path d="M0 600 L140 560 L300 300 L330 300 L345 560 L640 560 L655 300 L685 300 L840 560 L1000 600Z" fill="none" stroke="#c98a80" stroke-width="7"/>
      <path d="M300 300 Q470 520 655 300 M685 300 Q760 470 840 520 M300 300 Q220 470 140 520" fill="none" stroke="#c98a80" stroke-width="3"/>
      <rect x="0" y="552" width="1000" height="12" fill="#c98a80"/></g>`;
    s += `<g filter="url(#sh1)"><path d="M900 900 L900 520 Q1050 380 1260 360 Q1460 330 1600 420 Q1760 360 1940 420 Q2160 380 2400 470 V900Z" fill="#b9cad5"/>`;
    for (let i = 0; i < 44; i++) { const x = 940 + i * 32 + rnd() * 10, y = 470 - Math.sin(i / 44 * Math.PI) * 120 + rnd() * 40, w = 22 + rnd() * 14;
      s += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="300" fill="${pick(["#cbd8e0", "#d6e1e8", "#c3d2dc"])}"/><path d="M${f1(x - 2)} ${f1(y)} L${f1(x + w / 2)} ${f1(y - 8)} L${f1(x + w + 2)} ${f1(y)}Z" fill="#aebfcb"/>`; }
    s += `<g fill="#a9bccb"><rect x="1240" y="268" width="260" height="90"/>${[1240, 1300, 1360, 1420, 1470].map(x => `<rect x="${x}" y="240" width="30" height="40"/>`).join("")}<rect x="1340" y="214" width="44" height="70"/></g>
      <g fill="#b8c9d5"><rect x="1700" y="318" width="34" height="110"/><rect x="1780" y="318" width="34" height="110"/><rect x="1700" y="360" width="114" height="80"/></g></g>`;
    return s;
  };

  /* foreground: Lisbon bollards + two iron street lamps on the front pavement */
  const fore = () => {
    let s = "";
    for (let x = 120; x < WW; x += 230) { const y = rail(x) + 44; s += `<g transform="translate(${x} ${f1(y)})"><rect x="-7" y="-34" width="14" height="38" rx="3" fill="#2d3a33"/><rect x="-7" y="-34" width="6" height="38" fill="#3f5046"/><circle cy="-36" r="8" fill="#2d3a33"/></g>`; }
    return s;
  };
  const post = (x) => { const y = rail(x) + 120; return `<div class="tr-post" style="left:${x - 14}px;top:${f1(y - 470)}px"><i class="tr-post-l"></i></div>`; };

  SCENES.push({
    id: "tram", order: 70, height: 250, bg: "#dcedf6", headerTone: "dark",
    nav: { label: "Order a round", href: "#tram" },
    html: (K) => {
      const bot = `<img class="ks d1" src="img/bottle.webp" alt="" draggable="false"`;
      return K.box(`
      <div class="tr-sky" id="tr-sky"></div>
      <div class="tr-sun" id="tr-sun"></div>
      <div class="tr-clouds" id="tr-clouds">${[[160, 120, 1], [620, 70, .8], [1080, 150, 1.15], [1500, 60, .9], [1900, 130, 1]].map(([x, y, s]) => `<i class="tr-cloud" style="left:${x}px;top:${y}px;--s:${s}"></i>`).join("")}</div>
      <svg class="tr-far" id="tr-far" width="2400" height="900" viewBox="0 0 2400 900" aria-hidden="true">${K.defs}${far()}</svg>
      <div class="tr-world" id="tr-world">
        <div class="tr-street">${streetHTML}
          <div class="tr-h tr-tasca" style="left:${TAX}px;top:${f1(base(TAX) - 360)}px;width:${TAW}px;height:${f1(400)}px">
            <i class="tr-roof" style="--rw:${TAW + 22}px"></i><i class="tr-corn"></i>
            <i class="tr-win" data-w="${wins.push(.05) - 1}" style="left:${TDX - 100}px;top:56px"><b></b><u></u><u class="r"></u></i>
            <i class="tr-win bal" data-w="${wins.push(.1) - 1}" style="left:${TDX + 44}px;top:56px"><b></b><u></u><u class="r"></u><em></em><i class="tr-pot" style="--pc:#e2463a"></i></i>
            <i class="tr-win" data-w="${wins.push(.15) - 1}" style="left:${TDX + 190}px;top:56px"><b></b><u></u><u class="r"></u></i>
            <i class="tr-barra"></i>
            <div class="tr-tdoor" style="left:${TDX - 70}px"><b></b></div>
            <div class="tr-menu" style="left:${TDX + 110}px"><span>Petiscos</span><small>bifana · caldo verde<br>pastéis de nata<br>código fresco</small></div>
            <i class="tr-lamp on" style="left:${TDX + 82}px;top:150px"></i>
          </div>
          <div class="tr-sign" id="tr-sign" style="left:${doorX - 150}px;top:${f1(base(TAX) - 262)}px"><i></i><b>Tasca<small>do Barril</small></b></div>
          <svg class="tr-bunt" width="${WW}" height="900" viewBox="0 0 ${WW} 900" aria-hidden="true">${flags()}</svg>
        </div>
        <svg class="tr-road" width="${WW}" height="1100" viewBox="0 0 ${WW} 1100" aria-hidden="true">
          <defs>
            <pattern id="tr-calc" width="120" height="44" patternUnits="userSpaceOnUse"><rect width="120" height="44" fill="#eee6d6"/><path d="M0 22 Q30 10 60 22 T120 22" fill="none" stroke="#45403d" stroke-width="6.5" stroke-linecap="round"/><path d="M0 7.5H120M0 36.5H120M15 0V44M45 0V44M75 0V44M105 0V44" stroke="rgba(90,60,30,.07)" stroke-width="1.2"/></pattern>
            <linearGradient id="tr-fshade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3a2210" stop-opacity="0"/><stop offset="1" stop-color="#3a2210" stop-opacity=".22"/></linearGradient>
            <pattern id="tr-calcS" width="48" height="20" patternUnits="userSpaceOnUse"><rect width="48" height="20" fill="#ebe3d3"/><path d="M0 10 Q12 2 24 10 T48 10" fill="none" stroke="#3a3533" stroke-width="4"/></pattern>
            <pattern id="tr-sett" width="26" height="14" patternUnits="userSpaceOnUse"><rect width="26" height="14" fill="#6f665c"/><rect x="1" y="1" width="24" height="12" rx="3" fill="#8f857a"/><rect x="1" y="1" width="24" height="4" rx="2" fill="#9d9387"/></pattern>
          </defs>
          <path d="${band(-100, -70)}" fill="url(#tr-calcS)"/>
          <path d="${band(-72, -64)}" fill="#e2d9c9"/><path d="${band(-64, -58)}" fill="#b9ad9b"/>
          <path d="${band(-58, 32)}" fill="url(#tr-sett)"/>
          <path d="${band(-58, -46)}" fill="rgba(40,25,10,.18)"/>
          <path d="${line(-24)}" fill="none" stroke="#5b534b" stroke-width="7"/><path d="${line(-26)}" fill="none" stroke="#d8d2c8" stroke-width="2.5"/>
          <path d="${line(3)}" fill="none" stroke="#5b534b" stroke-width="8"/><path d="${line(1)}" fill="none" stroke="#e4ded4" stroke-width="3"/>
          <path d="${band(32, 40)}" fill="#ebe4d6"/><path d="${band(40, 50)}" fill="#b3a794"/>
          <path d="${band(50, 400)}" fill="url(#tr-calc)"/>
          <path d="${band(50, 400)}" fill="url(#tr-fshade)"/><path d="${band(50, 58)}" fill="rgba(40,25,10,.14)"/>
          ${fore()}
          <path d="${line(WIRE)}" fill="none" stroke="#2b2523" stroke-width="2.5"/>
          ${[260, 760, 1260, 1760, 2260].map(x => { const y = rail(x) + WIRE; return `<path d="M${x} ${f1(y)} L${x - 60} ${f1(y - 70)}" stroke="#2b2523" stroke-width="1.6"/><rect x="${x - 4}" y="${f1(y - 3)}" width="8" height="6" fill="#2b2523"/>`; }).join("")}
        </svg>
        <div class="tr-sparks" id="tr-sparks"></div>
        <button class="tr-barril" id="tr-barril" type="button" aria-label="Barril waves from the tasca door" style="left:${doorX - 92}px;top:${f1(base(doorX) - 214)}px">${K.img("barril-wave", { w: 184, depth: 2 })}</button>
        <div class="tr-rig" id="tr-rig"><div class="tr-bob" id="tr-bob">
          ${K.img("tram", { x: -TW / 2, y: -672 * TS, w: TW, depth: 3, z: 1, id: "tr-tram", alt: "" })}
          <div class="tr-cargo" id="tr-cargo">
            ${bot} style="left:6px;top:-6px;width:26px;rotate:-6deg">${bot} style="left:58px;top:-2px;width:26px;rotate:5deg">
            <img id="tr-trav" class="ks d2" src="img/bottle.webp" alt="" draggable="false" style="left:31px;top:-50px;width:32px;z-index:2">
            <i class="tr-crate"><b>codebrew</b></i><i class="tr-shelf"></i>
          </div>
        </div></div>
        ${post(700)}${post(1010)}
      </div>`, { focus: .01 }) + `
      ${K.svc({ step: 7, brew: "Last orders", title: "Contact", href: "#tram", cls: "tr-label", left: "4.5vw", top: "max(96px, 14vh)",
        text: "Tell me about your store or role. I answer within one working day." })}
      <div class="tr-stop" id="tr-stop">
        <i class="tr-stopPole" aria-hidden="true"></i>
        <div class="tr-plate" aria-hidden="true"><b>Paragem</b><span>28 · Tasca do Barril</span></div>
        <div class="tr-cork">
          <form class="tr-slip" id="tr-form" novalidate aria-labelledby="tr-title">
            <i class="tr-pin a" aria-hidden="true"></i><i class="tr-pin b" aria-hidden="true"></i>
            <div class="tr-band"><span>Contact form · Bilhete</span><span>Nº <b id="tr-no">0028</b></span></div>
            <h2 id="tr-title">Order a round</h2>
            <p class="tr-lead">Tell me what you're thirsty for. I answer within one working day, usually before the foam settles.</p>
            <svg class="tr-pint" viewBox="0 0 70 104" aria-hidden="true"><defs><clipPath id="tr-glass"><path d="M6 8 H64 L57 96 Q35 100 13 96Z"/></clipPath></defs>
              <path d="M6 8 H64 L57 96 Q35 100 13 96Z" fill="#eadcc0"/>
              <g clip-path="url(#tr-glass)"><g id="tr-beer" transform="translate(0 100)"><rect width="70" height="110" fill="#e9a03a"/><rect x="44" width="30" height="110" fill="#d98a22"/>
                <path d="M0 2 Q6 -8 12 0 Q18 -9 25 -1 Q32 -9 39 -1 Q46 -9 53 -1 Q60 -9 70 0 V8 H0Z" fill="#fffaf0"/></g>
                <rect x="13" y="16" width="5" height="70" fill="#fff" opacity=".45"/></g></svg>
            <span class="tr-pct" id="tr-pct">0% poured</span>
            <input class="tr-hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
            <div class="tr-row">
              <label class="tr-f"><span>Your name <em>*</em></span><input name="name" required autocomplete="name" placeholder="Ana Sousa"></label>
              <label class="tr-f"><span>Email <em>*</em></span><input name="email" type="email" required autocomplete="email" placeholder="ana@store.com"></label>
            </div>
            <label class="tr-f"><span>What do you need? <em>*</em></span>
              <select name="type" required><option value="">Choose a service…</option><option>New custom theme</option><option>Shopify Plus build</option><option>App or integration</option><option>Speed fix</option><option>Hiring</option><option>Just saying Saúde</option></select></label>
            <label class="tr-f"><span>Project details <em>*</em></span><textarea name="msg" rows="3" required placeholder="Your store link, what you need built or fixed, and a rough timeline"></textarea></label>
            <div class="tr-actions"><button type="submit">Send message <i>→</i></button>
              <span class="tr-or">or <a href="mailto:ambduu@gmail.com">ambduu@gmail.com</a></span></div>
            <p class="tr-done" id="tr-done" role="status" aria-live="polite"></p>
            <div class="tr-links"><a href="https://www.linkedin.com/in/germanjit-singh-sandhu" target="_blank" rel="noopener"><span>LinkedIn ↗</span></a><a href="https://github.com/ambduu" target="_blank" rel="noopener"><span>GitHub ↗</span></a></div>
            <div class="tr-stamp" aria-hidden="true">Pago!<small>Saúde · cheers</small></div>
          </form>
        </div>
      </div>
      <style>
        /* clip, not hidden: focusing a link/field inside the sticky stage must not scroll the stage itself (it did: tabbing
           to the coasters shifted the bar 236px up on phones, and tabbing the slip slid the tram stage 548px sideways) */
        #tram .jstage { overflow: clip; }
        #tram .jstage { background: #dcedf6; }
        .tr-sky { position: absolute; inset: -40px; background: linear-gradient(#7fb8e0, #b9dbef 45%, #e3f1f7 75%); }
        .tr-sun { position: absolute; left: 980px; top: 150px; width: 210px; height: 210px; border-radius: 50%; background: radial-gradient(circle, #fffbe8 0 50%, #fff0b8 51% 66%, rgba(255,240,190,0) 70%); box-shadow: 0 0 120px 50px rgba(255,248,215,.55); }
        .tr-clouds { position: absolute; left: 0; top: 0; }
        .tr-cloud { position: absolute; width: 190px; height: 54px; border-radius: 40px; background: #ffffff; transform: scale(var(--s)); transform-origin: 0 0;
          filter: drop-shadow(calc(var(--lx) * 6px) calc(var(--ly) * 10px) 8px rgba(60,100,140,.16)); }
        .tr-cloud::before, .tr-cloud::after { content: ""; position: absolute; border-radius: 50%; background: inherit; }
        .tr-cloud::before { width: 90px; height: 90px; left: 30px; top: -46px; } .tr-cloud::after { width: 64px; height: 64px; left: 96px; top: -28px; }
        .tr-far { position: absolute; left: 0; top: 40px; opacity: .92; }
        .tr-world { position: absolute; left: 0; top: 0; width: ${WW}px; height: 900px; will-change: transform; }
        .tr-street, .tr-road, .tr-sparks { position: absolute; left: 0; top: 0; }
        .tr-street { z-index: 1; } .tr-road { z-index: 2; pointer-events: none; } .tr-barril { z-index: 3; } .tr-rig { z-index: 4; } .tr-sparks { z-index: 5; } .tr-post { z-index: 6; }
        /* façades: matte paper slabs, each standing a little off the next */
        .tr-h { position: absolute; filter: drop-shadow(calc(var(--lx) * 3px) calc(var(--ly) * 3px) 2px rgba(60,30,10,.28)) drop-shadow(calc(var(--lx) * 12px) calc(var(--ly) * 8px) 10px rgba(60,30,10,.18)); }
        .tr-h > i, .tr-h > div { position: absolute; display: block; }
        .tr-roof { left: -11px; top: -28px; width: var(--rw); height: 30px; background:
          repeating-linear-gradient(90deg, rgba(255,255,255,.14) 0 7px, rgba(0,0,0,.08) 7px 14px), linear-gradient(#c8613e, #a8462a);
          clip-path: polygon(3% 0, 97% 0, 100% 100%, 0 100%); }
        .tr-chim { top: -58px; width: 22px; height: 34px; background: linear-gradient(90deg, #efe6d6 0 60%, #d8ccb8 60%); }
        .tr-chim::before { content: ""; position: absolute; left: -4px; top: -6px; width: 30px; height: 8px; background: #b54d30; }
        .tr-corn { left: -4px; right: -4px; top: 0; height: 14px; background: var(--trim); box-shadow: 0 4px 0 rgba(60,30,10,.12); }
        .tr-socle { left: 0; right: 0; bottom: 0; background: linear-gradient(#ded3c1, #cfc2ad); }
        .tr-win { width: 42px; height: 70px; background: var(--trim); padding: 5px; }
        .tr-win b { position: absolute; inset: 5px; background: linear-gradient(#3a2a24, #4c382c); transition: background .8s; }
        .tr-win b::after { content: ""; position: absolute; left: 50%; top: 0; bottom: 0; width: 3px; margin-left: -1.5px; background: var(--trim); box-shadow: 0 -14px 0 0 var(--trim); }
        .tr-win.on b { background: linear-gradient(#ffd27a, #f3a94a); box-shadow: 0 0 18px 4px rgba(255,190,90,.45); }
        .tr-win u { position: absolute; top: 3px; left: -14px; width: 13px; height: 64px; background: var(--sh); background-image: repeating-linear-gradient(transparent 0 5px, rgba(0,0,0,.16) 5px 7px); }
        .tr-win u.r { left: auto; right: -14px; }
        .tr-win em { position: absolute; left: -18px; right: -18px; bottom: -8px; height: 30px;
          background: linear-gradient(#26201e 0 3px, transparent 3px), repeating-linear-gradient(90deg, #26201e 0 2px, transparent 2px 9px); }
        .tr-win em::after { content: ""; position: absolute; left: -2px; right: -2px; bottom: -6px; height: 6px; background: var(--trim); box-shadow: 0 5px 6px rgba(60,30,10,.25); }
        .tr-pot { position: absolute; right: -16px; bottom: 16px; width: 14px; height: 12px; background: #b5532f; }
        .tr-pot::before { content: ""; position: absolute; left: -5px; top: -14px; width: 24px; height: 16px; border-radius: 50%; background: #5d9a35; box-shadow: 4px -3px 0 -3px var(--pc), -3px -1px 0 -3px var(--pc); }
        .tr-line { position: absolute; height: 2px; background: #efe6d6; }
        .tr-line s { position: absolute; top: 1px; width: 16px; height: var(--lh); background: var(--lc); transform-origin: 50% 0; animation: trsway 2.6s ease-in-out infinite alternate; box-shadow: 3px 5px 5px rgba(60,30,10,.18); }
        .tr-line s:nth-child(2n) { animation-duration: 2s; animation-delay: -.7s; }
        @keyframes trsway { from { transform: rotate(-6deg); } to { transform: rotate(6deg); } }
        .tr-door { width: 52px; background: var(--dc); border: 5px solid var(--trim); border-bottom: 0; border-radius: 26px 26px 0 0;
          background-image: linear-gradient(90deg, transparent 48%, rgba(0,0,0,.25) 48% 52%, transparent 52%), repeating-linear-gradient(transparent 0 16px, rgba(255,255,255,.07) 16px 18px); }
        .tr-lamp { width: 14px; height: 26px; background: #2b2523; border-radius: 3px 3px 6px 6px; }
        .tr-lamp::before { content: ""; position: absolute; left: -14px; top: 4px; width: 16px; height: 3px; background: #2b2523; }
        .tr-lamp::after { content: ""; position: absolute; left: 2px; top: 5px; width: 10px; height: 14px; border-radius: 2px; background: #6d5e4a; transition: background .6s, box-shadow .6s; }
        .tr-lamp.on::after { background: #ffe3a0; box-shadow: 0 0 22px 10px rgba(255,200,110,.55); }
        .tr-flag { transform-box: fill-box; transform-origin: 50% 0; animation: trflag 1.8s ease-in-out infinite alternate; }
        @keyframes trflag { from { transform: rotate(-9deg) skewX(-4deg); } to { transform: rotate(9deg) skewX(4deg); } }
        .tr-bunt { position: absolute; left: 0; top: 0; filter: drop-shadow(calc(var(--lx) * 4px) calc(var(--ly) * 7px) 4px rgba(60,30,10,.22)); }
        /* the tasca */
        .tr-tasca { background: #f4eee3; }
        .tr-barra { left: 0; right: 0; bottom: 0; height: 132px; background: ${tile("#2457a8", "#f6f2ea", "#6b8fcf")} 0 0/34px 34px; box-shadow: inset 0 6px 0 #2457a8, inset 0 10px 0 #f6f2ea, inset 0 14px 0 #2457a8; }
        .tr-tdoor { bottom: 0; width: 140px; height: 232px; padding: 10px 10px 0; background: #e3d6c0; border-radius: 70px 70px 0 0; }
        .tr-tdoor b { display: block; height: 100%; border-radius: 60px 60px 0 0; background: radial-gradient(120% 70% at 50% 100%, #ffcf7a, #e48a34 55%, #6b3a22); box-shadow: inset 0 0 0 4px #4a2a18; }
        .tr-menu { bottom: 150px; width: 128px; padding: 12px 10px; background: #2f3a33; color: #f4f1e8; text-align: center; border: 6px solid #8a5a2b; font: 600 12px/1.35 Archivo, sans-serif; }
        .tr-menu span { display: block; font: 400 17px "Archivo Black", sans-serif; text-transform: uppercase; color: #ffe27a; margin-bottom: 4px; }
        .tr-sign { position: absolute; z-index: 2; width: 160px; transform-origin: 140px 0; filter: drop-shadow(calc(var(--lx) * 3px) calc(var(--ly) * 4px) 2px rgba(40,20,10,.35)) drop-shadow(calc(var(--lx) * 16px) calc(var(--ly) * 22px) 12px rgba(40,20,10,.22)); }
        .tr-sign i { position: absolute; left: 20px; top: -10px; width: 150px; height: 6px; background: #2b2523; }
        .tr-sign b { display: block; margin: 0 14px 0 0; padding: 12px 10px 10px; text-align: center; background: #a8622b; background-image: linear-gradient(transparent 48%, rgba(0,0,0,.12) 48% 52%, transparent 52%); color: #ffe27a; font: 400 24px/1 "Archivo Black", sans-serif; text-transform: uppercase; border-radius: 4px; }
        .tr-sign b::before, .tr-sign b::after { content: ""; position: absolute; top: -10px; width: 2px; height: 14px; background: #efe6d6; }
        .tr-sign b::before { left: 22px; } .tr-sign b::after { left: 120px; }
        .tr-sign small { display: block; font: 800 11px Archivo, sans-serif; letter-spacing: .16em; color: #fff3d6; margin-top: 4px; }
        .tr-post { position: absolute; width: 28px; height: 560px; background: linear-gradient(90deg, #2d3a33 0 55%, #22302a 55%); border-radius: 6px 6px 0 0;
          filter: drop-shadow(calc(var(--lx) * 30px) calc(var(--ly) * 40px) 18px rgba(40,20,10,.3)); }
        .tr-post-l { position: absolute; left: -22px; top: -74px; width: 72px; height: 80px; background: linear-gradient(90deg, #2d3a33 0 12%, #ffe9b0 12% 88%, #2d3a33 88%); clip-path: polygon(0 0, 100% 0, 86% 100%, 14% 100%); }
        .tr-post-l::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 12px; background: #2d3a33; }
        .tr-post-l::after { content: ""; position: absolute; left: 30px; top: -26px; width: 12px; height: 26px; background: #2d3a33; border-radius: 6px 6px 0 0; }
        .tr-post.on .tr-post-l { box-shadow: 0 0 60px 26px rgba(255,205,120,.4); }
        /* tram rig */
        .tr-rig { position: absolute; left: 0; top: 0; transform-origin: 0 0; will-change: transform; }
        .tr-bob { position: absolute; left: 0; top: 0; }
        .tr-cargo { position: absolute; left: -${TW / 2 - 4}px; top: -102px; width: 96px; height: 56px; z-index: 3; }
        .tr-cargo .ks { transform-origin: 50% 100%; }
        .tr-crate { position: absolute; left: 0; top: 44px; width: 96px; height: 56px; z-index: 3; display: grid; place-content: center;
          background: repeating-linear-gradient(#c49a62 0 15px, #a87c46 15px 18px); box-shadow: inset 6px 0 0 #b88b52, inset -6px 0 0 #b88b52;
          filter: drop-shadow(calc(var(--lx) * 3px) calc(var(--ly) * 4px) 2px rgba(40,20,10,.35)) drop-shadow(calc(var(--lx) * 10px) calc(var(--ly) * 14px) 8px rgba(40,20,10,.22)); }
        .tr-shelf { position: absolute; left: -6px; top: 98px; width: 118px; height: 8px; z-index: 2; background: linear-gradient(#3b3330 0 50%, #2a2321 50%); border-radius: 2px; }
        .tr-shelf::before { content: ""; position: absolute; left: 10px; top: 8px; width: 6px; height: 14px; background: #2a2321; transform: skewX(18deg); }
        .tr-crate b { font: 400 13px "Archivo Black", sans-serif; color: rgba(60,30,10,.7); letter-spacing: -.02em; text-transform: lowercase; }
        .tr-spark { position: absolute; left: 0; top: 0; width: 5px; height: 5px; margin: -2.5px; border-radius: 50%; background: #fff7c2; box-shadow: 0 0 6px 2px #ffd25a, 0 0 14px 4px rgba(255,160,40,.5); pointer-events: none; }
        .tr-barril { position: absolute; width: 184px; height: 224px; padding: 0; border: 0; background: none; cursor: pointer; transform-origin: 50% 100%; }
        .tr-barril .ks { position: absolute; left: 0; top: 0; }
        /* the tram stop + order slip */
        .tr-stop { position: absolute; z-index: 6; left: 4.5vw; top: max(84px, 11vh); width: clamp(340px, 31vw, 450px); will-change: transform; }
        .tr-stopPole { position: absolute; left: 50%; top: 10px; width: 22px; margin-left: -11px; height: 120vh; background: linear-gradient(90deg, #3c4a42 0 50%, #2d3a33 50%);
          filter: drop-shadow(calc(var(--lx) * 26px) calc(var(--ly) * 30px) 16px rgba(40,20,10,.3)); }
        .tr-plate { position: relative; z-index: 2; width: 220px; margin: 0 auto 10px; padding: 8px 12px 9px; text-align: center; background: #f2c230; color: #2b1a12; border-radius: 10px;
          box-shadow: inset 0 0 0 3px #f2c230, inset 0 0 0 5px #2b1a12, 2px 3px 2px rgba(0,0,0,.25), 10px 16px 16px rgba(40,25,10,.22); }
        .tr-plate b { display: block; font: 400 22px/1 "Archivo Black", sans-serif; text-transform: uppercase; letter-spacing: .02em; }
        .tr-plate span { font: 800 10.5px Archivo, sans-serif; letter-spacing: .14em; text-transform: uppercase; }
        .tr-cork { position: relative; z-index: 2; padding: 14px; border-radius: 6px; background-color: #c9925a;
          background-image: radial-gradient(circle at 20% 30%, rgba(90,50,20,.35) 0 1.2px, transparent 1.6px), radial-gradient(circle at 70% 60%, rgba(255,230,190,.35) 0 1px, transparent 1.5px), radial-gradient(circle at 45% 80%, rgba(90,50,20,.3) 0 1.5px, transparent 2px);
          background-size: 9px 11px, 7px 9px, 13px 10px; box-shadow: inset 0 0 0 7px #8a5a2b, inset 0 0 0 9px #6d4520, 2px 3px 2px rgba(0,0,0,.3), 16px 26px 22px rgba(40,25,10,.28); }
        .tr-slip { position: relative; margin: 0; padding: 0 22px 18px; background: #fbf4e4; color: #2b1a12; font-family: Archivo, sans-serif; transform: rotate(-.8deg);
          box-shadow: 1px 2px 1.5px rgba(40,25,10,.3), 8px 12px 12px rgba(40,25,10,.2);
          -webkit-mask: radial-gradient(circle 5px at 8px 100%, transparent 97%, #000) 0 0/16px 100% repeat-x; mask: radial-gradient(circle 5px at 8px 100%, transparent 97%, #000) 0 0/16px 100% repeat-x; }
        .tr-pin { position: absolute; z-index: 3; top: 10px; width: 18px; height: 18px; border-radius: 50%; background: radial-gradient(circle at 40% 35%, #fff 0 18%, #e2463a 20% 62%, #a82820 64%); filter: drop-shadow(3px 5px 3px rgba(0,0,0,.35)); }
        .tr-pin.a { left: 10px; } .tr-pin.b { right: 10px; }
        .tr-band { display: flex; justify-content: space-between; margin: 0 -22px 10px; padding: 9px 36px; background: #f2c230; font: 800 10.5px Archivo, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #6a4300; }
        .tr-band b { color: #2b1a12; }
        .tr-slip h2 { margin: 6px 0 4px; font: 400 clamp(28px, 2.5vw, 38px)/.95 "Archivo Black", sans-serif; text-transform: uppercase; letter-spacing: -.01em; padding-right: 62px; }
        .tr-lead { margin: 0 0 10px; font: 600 13.5px/1.45 Archivo, sans-serif; color: #5a4636; padding-right: 58px; }
        .tr-pint { position: absolute; right: 16px; top: 50px; width: 48px; height: 70px; filter: drop-shadow(4px 6px 4px rgba(40,25,10,.25)); }
        .tr-pct { position: absolute; right: 6px; top: 122px; width: 70px; text-align: center; font: 800 9px Archivo, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #8a6a3c; }
        .tr-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
        .tr-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .tr-f { display: block; margin: 0 0 11px; }
        .tr-f span { display: block; font: 700 12px Archivo, sans-serif; letter-spacing: .02em; color: #4a3220; margin-bottom: 5px; }
        .tr-f span em { font-style: normal; color: #c4421f; }
        .tr-f input, .tr-f select, .tr-f textarea { width: 100%; box-sizing: border-box; border: 1.5px solid #cdb68c; border-radius: 8px; background: #fff; padding: 10px 12px; font: 500 15px/1.35 Archivo, sans-serif; color: #2b1a12; outline: none;
          box-shadow: inset 0 1px 2px rgba(60,35,10,.08); transition: border-color .2s, box-shadow .2s; }
        .tr-f input:hover, .tr-f select:hover, .tr-f textarea:hover { border-color: #b09468; }
        .tr-f textarea { resize: vertical; min-height: 84px; }
        .tr-f select { appearance: none; -webkit-appearance: none; cursor: pointer; padding-right: 34px; background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M0 0h12L6 8z' fill='%23c46a1f'/%3E%3C/svg%3E") no-repeat right 12px center; }
        .tr-f select:invalid { color: #9a8462; }
        .tr-f input::placeholder, .tr-f textarea::placeholder { color: #a8916b; }
        .tr-f input:focus, .tr-f select:focus, .tr-f textarea:focus { border-color: #e9a03a; box-shadow: 0 0 0 3px rgba(233,160,58,.28); }
        .tr-f input:user-invalid, .tr-f textarea:user-invalid, .tr-f select:user-invalid { border-color: #e2463a; box-shadow: 0 0 0 3px rgba(226,70,58,.15); }
        .tr-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 12px; margin-top: 4px; }
        .tr-actions button { border: 0; cursor: pointer; background: #2b1a12; color: #ffe27a; padding: 13px 18px; font: 800 12.5px Archivo, sans-serif; letter-spacing: .1em; text-transform: uppercase; box-shadow: 2px 3px 2px rgba(0,0,0,.25), 8px 14px 18px rgba(0,0,0,.18); transition: transform .2s; }
        .tr-actions button i { font-style: normal; display: inline-block; transition: transform .25s; }
        .tr-actions button:hover { transform: translateY(-2px); } .tr-actions button:hover i { transform: translateX(5px); }
        .tr-slip :focus-visible, .tr-barril:focus-visible { outline: 3px solid #3fa0d8; outline-offset: 3px; }
        .tr-or { font: 600 12.5px Archivo, sans-serif; color: #7a6450; } .tr-or a { color: #c46a1f; font-weight: 800; }
        .tr-done { margin: 8px 0 0; font: 600 12.5px/1.4 Archivo, sans-serif; color: #2f6d1f; } .tr-done:empty { display: none; }
        .tr-links { display: flex; gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 2px dashed #e2d0aa; }
        .tr-links a { flex: 1; padding: 4px; text-decoration: none; background: ${tile("#2457a8", "#f6f2ea", "#6b8fcf")} 0 0/22px 22px; transition: transform .2s; }
        .tr-links a span { display: block; padding: 7px 6px; text-align: center; background: #fbf4e4; font: 800 11px Archivo, sans-serif; letter-spacing: .12em; text-transform: uppercase; color: #2457a8; }
        .tr-links a:hover { transform: translateY(-2px) rotate(-1deg); } .tr-links a:hover span { background: #fff; }
        .tr-stamp { position: absolute; right: 22px; bottom: 74px; padding: 8px 14px 6px; border: 4px solid #e2463a; color: #e2463a; font: 400 28px/1 "Archivo Black", sans-serif; text-transform: uppercase; text-align: center; transform: rotate(-12deg) scale(2.2); opacity: 0; pointer-events: none; mix-blend-mode: multiply; }
        .tr-stamp small { display: block; font: 800 10px Archivo, sans-serif; letter-spacing: .2em; margin-top: 3px; }
        .tr-slip.sent .tr-stamp { animation: trstamp .5s cubic-bezier(.2,1.6,.4,1) forwards; }
        @keyframes trstamp { to { opacity: .9; transform: rotate(-12deg) scale(1); } }
        @media (max-height: 780px) and (min-width: 821px) { .tr-lead { display: none; } .tr-plate { display: none; } .tr-stop { top: 76px; } .tr-pct { top: 112px; } .tr-pint { top: 40px; } }
        @media (max-width: 820px) {
          .tr-stop { left: 10px; right: 10px; width: auto; top: auto; bottom: 10px; }
          .tr-stopPole, .tr-plate { display: none; }
          .tr-cork { padding: 9px; }
          .tr-slip { padding: 0 16px 14px; transform: none; }
          .tr-band { margin: 0 -16px 8px; padding: 8px 30px; }
          .tr-lead { display: none; } .tr-pint { top: 34px; width: 26px; height: 38px; right: 14px; } .tr-pct { display: none; }
          .tr-slip h2 { padding-right: 40px; }
          .tr-slip h2 { font-size: 27px; }
          .tr-f { margin-bottom: 7px; } .tr-f span { margin-bottom: 3px; }
          .tr-f input, .tr-f select, .tr-f textarea { font-size: 16px; padding: 7px 10px; }
          .tr-f textarea { min-height: 0; height: 62px; }
          .tr-links { margin-top: 8px; padding-top: 8px; }
        }
      </style>`;
    },

    init: (stage, K, st) => {
      const $ = s => stage.querySelector(s);
      // fallback for engines without overflow:clip: undo any focus-driven scroll of the stage box
      stage.addEventListener("scroll", () => { if (stage.scrollTop || stage.scrollLeft) stage.scrollTop = stage.scrollLeft = 0; }, { passive: true });
      const box = $(".kbox"), world = $("#tr-world"), far = $("#tr-far"), clouds = $("#tr-clouds"), sky = $("#tr-sky"), sun = $("#tr-sun");
      const rig = $("#tr-rig"), bob = $("#tr-bob"), trav = $("#tr-trav"), cargo = $("#tr-cargo"), sparks = $("#tr-sparks");
      const barril = $("#tr-barril"), sign = $("#tr-sign"), stop = $("#tr-stop"), lab = $(".tr-label");
      // the Contact service line steps aside as the order slip arrives (desktop: slides in from the right; phones: bottom sheet)
      let LG = null; addEventListener("resize", () => { LG = null; }, { passive: true });
      const labFade = (v) => { const a = Math.max(0, Math.min(1, v)); if (a === lab._a) return; lab._a = a;
        lab.style.opacity = a.toFixed(3); lab.style.visibility = a < .02 ? "hidden" : ""; };
      // keyboard / deep links: jump to the end of the ride so the order slip is in place
      // the ride ends where the scrub ends: "bottom 200%" when the bar sheet stacks over us (then the bar covers the slip), else "bottom bottom"
      const slipY = () => { const sec = st.trigger; return sec.offsetTop + sec.offsetHeight - innerHeight * (/200%/.test(st.end) ? 2 : 1) - 4; };
      const toSlip = () => { const y = slipY(); if (Math.abs(scrollY - y) > 40) scrollTo({ top: y }); };
      stop.addEventListener("focusin", toSlip);
      if (location.hash === "#tram") setTimeout(toSlip, 60);
      const winEls = [...stage.querySelectorAll(".tr-win")], lamps = [...stage.querySelectorAll(".tr-h .tr-lamp:not(.on)"), ...stage.querySelectorAll(".tr-post")];

      const S = { drop: 0, tx: TX0, cam: 0, dusk: 0, out: 0, sheet: 0 };
      if (K.reduced) Object.assign(S, { drop: 1, tx: TX1, cam: 1, dusk: 1, out: 1, sheet: 1 });
      const V = { W: 0, H: 0, sc: 1, visW: 1440, mobile: false };
      const measure = () => { V.W = stage.clientWidth; V.H = stage.clientHeight; V.sc = Math.max(V.W / 1440, V.H / 900); V.visW = Math.min(1440, V.W / V.sc); V.mobile = V.W <= 820; };
      measure(); addEventListener("resize", measure);

      // physical state for weight: pitch spring, bottle wobble, distance for bobbing
      const P = { lastX: S.tx, v: 0, pitch: 0, pv: 0, dist: 0, wob: 0, wv: 0, time: 0, landed: false, camX: 0 };
      const lerp = (a, b, k) => a + (b - a) * k, cl = v => Math.max(0, Math.min(1, v));
      const skyTop = gsap.utils.interpolate("#7fb8e0", "#8c9cc8"), skyBot = gsap.utils.interpolate("#e3f1f7", "#f6cfa8");
      const rigAt = x => { const a = rail(x - 170), b = rail(x + 170); return [x, (a + b) / 2, Math.atan2(b - a, 340) * 180 / Math.PI]; };
      const tipLocal = [95 * TS - TW / 2, -(672 - 14) * TS];

      function render(dt) {
        const t = P.time;
        /* tram: position on the rail, speed → pitch spring (it squats when pulling away, nods when braking) */
        const [x, y, ang] = rigAt(S.tx);
        const v = dt > 0 ? (S.tx - P.lastX) / dt : 0; const acc = (v - P.v) / Math.max(dt, .001);
        P.v = v; P.lastX = S.tx; P.dist += Math.abs(v * dt);
        const target = gsap.utils.clamp(-3.2, 3.2, -acc * .0016);
        P.pv += ((target - P.pitch) * 90 - P.pv * 9) * dt; P.pitch += P.pv * dt;
        const moving = Math.min(1, Math.abs(v) / 120);
        const bobY = Math.sin(P.dist * .09) * 1.6 * moving + Math.sin(t * 31) * .5 * moving + (Math.sin(P.dist * .021) > .97 ? 1.5 : 0) * moving;
        rig.style.transform = `translate(${f1(x)}px, ${f1(y)}px) rotate(${(ang + P.pitch).toFixed(2)}deg)`;
        bob.style.transform = `translate(0, ${bobY.toFixed(2)}px) rotate(${(Math.sin(P.dist * .05) * .35 * moving).toFixed(2)}deg)`;
        /* bottles in the crate: lag behind the tram (wobble spring) */
        P.wv += ((-P.pitch * 3 - acc * .002 - P.wob) * 120 - P.wv * 7) * dt; P.wob += P.wv * dt;
        /* the traveller drops in from the top edge of the stage */
        const restTop = -50, fromTop = -(y + 140) + 102;
        const dk = S.drop;
        if (dk < 1) { trav.style.top = f1(lerp(fromTop, restTop, dk)) + "px"; trav.style.rotate = f1(lerp(-24, 0, Math.min(1, dk * 1.2))) + "deg"; }
        else { trav.style.top = restTop + "px"; trav.style.rotate = f1(gsap.utils.clamp(-14, 14, P.wob)) + "deg"; }
        cargo.children[0].style.rotate = f1(-6 + P.wob * .8) + "deg"; cargo.children[1].style.rotate = f1(5 + P.wob * .7) + "deg";
        if (dk >= .999 && !P.landed) { P.landed = true; P.wv -= 260; gsap.fromTo(cargo.querySelector(".tr-crate"), { scaleY: .9, scaleX: 1.04, transformOrigin: "50% 100%" }, { scaleY: 1, scaleX: 1, duration: .6, ease: "elastic.out(1,.4)" }); }
        if (dk < .9) P.landed = false;
        /* camera */
        let camX;
        if (V.mobile || V.visW < 900) {
          const follow = lerp(S.tx + (S.drop < 1 ? -150 : 60), doorX - 120, ss(.35, 1, S.cam));
          const want = Math.max(0, Math.min(WW - V.visW, follow - V.visW / 2));
          camX = want;
        } else {
          const end = Math.min(WW - V.visW, doorX + 280 - V.visW);
          camX = lerp(0, end, S.cam);
        }
        P.camX = camX;
        const yShift = (R0 - rail(camX + V.visW * .5)) * .55 - (V.mobile ? lerp(0, 250, S.sheet) : 0);
        world.style.transform = `translate3d(${f1(-camX)}px, ${f1(yShift)}px, 0)`;
        far.style.transform = `translate3d(${f1(-camX * .32)}px, ${f1(yShift * .4 + 40 * S.dusk)}px, 0)`;
        clouds.style.transform = `translate3d(${f1(-camX * .12 - t * 4)}px, ${f1(yShift * .2)}px, 0)`;
        sun.style.transform = `translate3d(${f1(-camX * .08)}px, ${f1(S.dusk * 240 + yShift * .2)}px, 0)`;
        /* stop + slip: anchored in the foreground (parallax 1.45 on desktop), bottom sheet on phones */
        if (V.mobile) { stop.style.transform = `translate3d(0, ${f1((1 - S.sheet) * 115)}%, 0)`; stop.style.pointerEvents = S.sheet > .9 ? "auto" : "none"; labFade(1 - S.sheet * 1.8); }
        else {
          const end = Math.min(WW - V.visW, doorX + 280 - V.visW), off = (end - camX) * V.sc * 1.45;
          if (!LG) LG = { sl: stop.offsetLeft, lr: lab.offsetLeft + lab.offsetWidth };
          labFade((LG.sl + off - LG.lr - 30) / 180);
          stop.style.transform = `translate3d(${f1(off)}px, 0, 0) rotate(${f1(Math.min(8, off * .006))}deg)`;
          stop.style.pointerEvents = off < 40 ? "auto" : "none";
        }
        /* trolley-pole sparks */
        if (!K.reduced && moving > .35 && Math.random() < .35 * moving) {
          const a = (ang + P.pitch) * Math.PI / 180, lx = tipLocal[0], ly = tipLocal[1] + bobY;
          spark(x + lx * Math.cos(a) - ly * Math.sin(a), y + lx * Math.sin(a) + ly * Math.cos(a), Math.random() < .12 ? 7 : 2);
        }
        /* barril steps out of the door when the tram arrives */
        barril.style.transform = `translate(${f1(lerp(-6, 26, S.out))}px, ${f1(lerp(30, 0, S.out))}px) scale(${f1(lerp(.82, 1, S.out))})`;
        barril.style.opacity = S.out > .02 ? 1 : 0;
      }
      let spi = 0; const pool = [];
      for (let i = 0; i < 26; i++) { const s = document.createElement("i"); s.className = "tr-spark"; s.style.opacity = 0; sparks.appendChild(s); pool.push(s); }
      function spark(x, y, n) {
        for (let i = 0; i < n; i++) { const s = pool[spi++ % pool.length];
          gsap.killTweensOf(s); gsap.set(s, { x, y, opacity: 1, scale: 1 + Math.random() });
          gsap.to(s, { physics2D: { velocity: 120 + Math.random() * 260, angle: 180 + Math.random() * 150, gravity: 900 }, opacity: 0, scale: .3, duration: .45 + Math.random() * .35, ease: "none" }); }
      }
      // dusk: sky, windows and lamps light up one by one
      const applyDusk = () => {
        sky.style.background = `linear-gradient(${skyTop(S.dusk)}, ${skyBot(S.dusk)} 75%)`; stage.style.background = skyBot(S.dusk);
        winEls.forEach(w => w.classList.toggle("on", wins[+w.dataset.w] * .9 + .12 < S.dusk && wins[+w.dataset.w] < .55));
        lamps.forEach((l, i) => l.classList.toggle("on", S.dusk > .35 + (i % 5) * .08));
      };

      /* one scrubbed timeline */
      if (!K.reduced) {
        gsap.timeline({ scrollTrigger: { ...st, scrub: 1, onUpdate: applyDusk } })
          .to(S, { drop: 1, duration: .1, ease: CustomEase.create("trdrop", "M0,0 C0.38,0 0.62,0.62 0.78,1 0.84,0.9 0.92,0.9 1,1") }, .02)
          .to(S, { tx: TX1, duration: .56, ease: "power2.inOut" }, .14)
          .to(S, { cam: 1, duration: .6, ease: "power2.inOut" }, .2)
          .to(S, { out: 1, duration: .08, ease: "back.out(2)" }, .68)
          .to(S, { sheet: 1, duration: .08, ease: "power2.out" }, .74)
          .to(S, { dusk: 1, duration: 1, ease: "none" }, 0);
      }
      applyDusk();

      /* idle life (only while on screen) */
      let visible = false;
      ScrollTrigger.create({ trigger: st.trigger, start: "top bottom", end: "bottom top", onToggle: s => (visible = s.isActive) });
      gsap.ticker.add((tm, dms) => { if (!visible) return; const dt = Math.min(.05, dms / 1000); P.time += dt; render(dt); });
      render(0);
      if (!K.reduced) {
        gsap.to(sign, { rotation: 3, duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
        gsap.to(barril.querySelector(".ks"), { rotation: 4, transformOrigin: "50% 100%", duration: .9, yoyo: true, repeat: -1, ease: "sine.inOut" });
      }
      barril.addEventListener("click", () => gsap.fromTo(barril.querySelector(".ks"), { y: 0 }, { y: -40, duration: .25, yoyo: true, repeat: 1, ease: "power2.out" }));

      /* header CTA / any #tram link: journey.js scrolls to the end of the ride (same target as slipY) */

      /* ---------- the order slip ---------- */
      const form = $("#tr-form"), beer = $("#tr-beer"), pct = $("#tr-pct"), done = $("#tr-done");
      $("#tr-no").textContent = String(1000 + Math.floor(Math.random() * 9000));
      const lvl = { v: 0 }, touched = { msg: false, type: false };
      const pour = (v, d = .8) => gsap.to(lvl, { v, duration: d, ease: "power2.out", overwrite: true, onUpdate: () => { beer.setAttribute("transform", `translate(0 ${f1(100 - Math.min(1, lvl.v) * 90)})`); pct.textContent = Math.round(Math.min(1, lvl.v) * 100) + "% poured"; } });
      const level = () => pour((form.name.value.trim().length > 1 ? .22 : 0) + (/.+@.+\..+/.test(form.email.value) ? .22 : 0) + (form.type.value ? .18 : 0) + Math.min(1, form.msg.value.trim().length / 80) * .38);
      form.addEventListener("input", e => { if (e.target.name === "msg") touched.msg = true; if (e.target.name === "type") touched.type = true; level(); });
      form.addEventListener("change", level);
      // live order ticket from the hero
      const guess = s => /plus/i.test(s) ? "Shopify Plus build" : /speed|slow|fast|core web|lighthouse/i.test(s) ? "Speed fix" : /\bapp\b|integrat|api|erp|sync/i.test(s) ? "App or integration" : /hir|job|role|position|contract/i.test(s) ? "Hiring" : /theme|design|redesign|store/i.test(s) ? "New custom theme" : "";
      const prefill = v => {
        v = (typeof v === "string" ? v : window.BREW_ORDER || "").trim(); if (!v) return;
        if (!touched.msg) form.msg.value = v;
        if (!touched.type && !form.type.value) { const g = guess(v); if (g) form.type.value = g; }
        level();
      };
      prefill(window.BREW_ORDER);
      const onOrder = e => prefill(e && typeof e.detail === "string" ? e.detail : window.BREW_ORDER);
      document.addEventListener("brew:order", onOrder); window.addEventListener("brew:order", onOrder);
      form.addEventListener("submit", e => {
        e.preventDefault();
        if (form.company.value) return;
        if (!form.reportValidity()) return;
        const no = $("#tr-no").textContent, type = form.type.value || "a round", name = form.name.value.trim();
        const subject = `Order Nº ${no} on the 28: ${type} (${name})`;
        const body = `${form.msg.value.trim()}\n\nThirsty for: ${type}\n\n${name}\n${form.email.value.trim()}`;
        pour(1.08, .6);
        form.classList.remove("sent"); void form.offsetWidth; form.classList.add("sent");
        done.innerHTML = `Your mail app should open with the order ready. Nothing popped up? Write to <a href="mailto:ambduu@gmail.com">ambduu@gmail.com</a>.`;
        if (!K.reduced) { gsap.fromTo(form, { rotation: -.8 }, { rotation: 1.2, duration: .5, ease: "elastic.out(1,.3)" }); }
        setTimeout(() => { location.href = `mailto:ambduu@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; }, 900);
      });
    }
  });
})();
