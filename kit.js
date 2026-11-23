/* CodeBrew "Brew Run" shared kit.
   Every scene uses this so the whole page looks like ONE papercraft world:
   matte solid paper cut-outs, real two-layer cast shadows on the wall behind,
   faint paper grain, warm brewery palette.

   SCENE CONTRACT (scenes/NN-name.js):
     window.SCENES.push({
       id: "tanks",                 // unique, used as section id
       order: 20,                   // sort key (hero 10, tanks 20, clouds 30, pipes 40, ferment 50, bottling 60, hills 70, bar 80)
       height: 220,                 // section height in vh (>=100). Stage is sticky for the whole section.
       bg: "#58585b",               // stage background colour
       nav: { label: "Custom Themes", href: "themes.html" },  // optional section label shown via kit.label()
       html: (K) => "<svg ...>...</svg> + any HTML overlay",  // returns markup for the STAGE
       init: (stage, K, st) => {}   // build GSAP timeline(s). `st` = { trigger: section, start, end } to use for scrub.
     });
   - Draw in a 1440x900 SVG viewBox using K.svg(inner) which wraps with preserveAspectRatio="xMidYMid slice" and the shared <defs>.
   - Text/labels/buttons go in HTML overlays (use K.label()) so they stay crisp & accessible.
   - Animate with ONE scrubbed timeline:  gsap.timeline({ scrollTrigger: { ...st, scrub: 1 } })
   - The TRAVELLER (amber codebrew bottle, K.bottle()) must ENTER from the top edge of your stage and EXIT through the bottom
     (or be handed to the next scene off-screen) so the journey feels continuous.
   - Shadows: wrap groups in filter="url(#sh1|sh2|sh3)" (sh1 = close to wall, sh3 = far from wall). Moving pieces nearer the
     viewer use sh3. Never use outlines/strokes for edges: shapes are matte paper, depth comes from shadow + 2-3 flat tones.
   - Respect K.reduced: if true, skip scrubbed motion and just show the scene's final state.
*/
(function () {
  const K = {};
  // The scroll story IS the site and is driven by the visitor's own scrolling, so it runs even with
  // "Reduce Motion" on (iPhones with that setting used to get a completely still page). K.calm keeps the preference
  // for anything that moves on its own (cursor fizz, idle loops) to opt out of.
  K.calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  K.reduced = false;
  K.C = { // palette
    amber: "#e9a03a", amberDeep: "#d98a22", honey: "#f2c14e", cream: "#fff6e2", paper: "#f3ead8",
    ink: "#2b1a12", charcoal: "#58585b", charcoalDeep: "#4b4b4e", copper: "#c97a3a", copperDark: "#8a4418",
    hop: "#7cc243", hopDark: "#6fb43a", hill1: "#b9dc7a", hill2: "#97c95a", hill3: "#76b043", hill4: "#558f30",
    red: "#e2463a", blue: "#3fa0d8", steel: "#6c6c70", white: "#ffffff"
  };
  K.defs = `<defs>
 <filter id="sh1" x="-30%" y="-30%" width="180%" height="190%"><feGaussianBlur in="SourceAlpha" stdDeviation="1.4"/><feOffset dx="1" dy="2" result="a"/><feComponentTransfer in="a" result="a1"><feFuncA type="linear" slope=".45"/></feComponentTransfer><feGaussianBlur in="SourceAlpha" stdDeviation="7"/><feOffset dx="10" dy="16" result="b"/><feComponentTransfer in="b" result="b1"><feFuncA type="linear" slope=".30"/></feComponentTransfer><feMerge><feMergeNode in="b1"/><feMergeNode in="a1"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="sh2" x="-40%" y="-40%" width="200%" height="220%"><feGaussianBlur in="SourceAlpha" stdDeviation="2"/><feOffset dx="2" dy="3" result="a"/><feComponentTransfer in="a" result="a1"><feFuncA type="linear" slope=".5"/></feComponentTransfer><feGaussianBlur in="SourceAlpha" stdDeviation="14"/><feOffset dx="22" dy="34" result="b"/><feComponentTransfer in="b" result="b1"><feFuncA type="linear" slope=".34"/></feComponentTransfer><feMerge><feMergeNode in="b1"/><feMergeNode in="a1"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="sh3" x="-50%" y="-50%" width="220%" height="240%"><feGaussianBlur in="SourceAlpha" stdDeviation="2.5"/><feOffset dx="3" dy="4" result="a"/><feComponentTransfer in="a" result="a1"><feFuncA type="linear" slope=".5"/></feComponentTransfer><feGaussianBlur in="SourceAlpha" stdDeviation="22"/><feOffset dx="40" dy="60" result="b"/><feComponentTransfer in="b" result="b1"><feFuncA type="linear" slope=".36"/></feComponentTransfer><feMerge><feMergeNode in="b1"/><feMergeNode in="a1"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <linearGradient id="steelV" x1="0" x2="1"><stop offset="0" stop-color="#3a3a3d"/><stop offset=".3" stop-color="#5d5d61"/><stop offset=".55" stop-color="#6c6c70"/><stop offset="1" stop-color="#2f2f32"/></linearGradient>
 <linearGradient id="copperV" x1="0" x2="1"><stop offset="0" stop-color="#9a4f1d"/><stop offset=".45" stop-color="#e0904a"/><stop offset="1" stop-color="#8a4418"/></linearGradient>
 <linearGradient id="copperH" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e0904a"/><stop offset="1" stop-color="#8a4418"/></linearGradient>
 <radialGradient id="vig" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></radialGradient>
</defs>`;
  // wrap scene art; vignette added on top. (Paper grain is a page-level CSS overlay, not per scene.)
  K.svg = (inner, cls = "") => `<svg class="art ${cls}" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${K.defs}${inner}<rect width="1440" height="900" fill="url(#vig)" pointer-events="none"/></svg>`;

  // quadratic bezier point + tangent angle
  K.bez = (p0, p1, p2, t) => {
    const x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0];
    const y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1];
    const dx = 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
    const dy = 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
    return [x, y, Math.atan2(dy, dx)];
  };
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const leaflet = (x, y, a, L, W, col) => {
    const ex = x + L * Math.cos(a), ey = y + L * Math.sin(a), nx = -Math.sin(a) * W, ny = Math.cos(a) * W;
    const mx = x + L * .45 * Math.cos(a), my = y + L * .45 * Math.sin(a);
    return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} Q${(mx + nx).toFixed(1)} ${(my + ny).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)} Q${(mx - nx).toFixed(1)} ${(my - ny).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}Z" fill="${col}"/>`;
  };
  // a fern/hop-bine frond along a quadratic curve (like the paper leaf on alfredservice)
  K.frond = (p0, p1, p2, { n = 30, Lmax = 120, spread = 1.05, col = K.C.hop, col2 = K.C.hopDark, stem = 7 } = {}) => {
    let s = `<path d="M${p0} Q${p1} ${p2}" fill="none" stroke="${col2}" stroke-width="${stem}" stroke-linecap="round"/>`;
    for (let i = 0; i < n; i++) {
      const t = .12 + .88 * i / (n - 1), [x, y, a] = K.bez(p0, p1, p2, t), L = Lmax * (1 - .55 * t) * (.9 + .2 * rnd());
      for (const sg of [1, -1]) s += leaflet(x, y, a + sg * spread + sg * .12 * t, L, L * .12, (i + (sg > 0)) % 2 ? col : col2);
    }
    return s;
  };
  // hop cone of overlapping paper scales; (cx,cy) = cone centre
  K.hopCone = (cx, cy, sc = 1) => {
    const base = "#9ccf55", dark = "#7fb53f", light = "#b6df6f";
    let s = `<g transform="translate(${cx} ${cy}) scale(${sc})">`;
    const rows = [[-28, 3, 10], [-14, 4, 14], [2, 4, 16], [18, 3, 13], [32, 2, 9]];
    rows.forEach(([y, k, w], r) => { for (let j = 0; j < k; j++) { const x = (j - (k - 1) / 2) * w * .9, c = [base, dark, light][(r + j) % 3];
      s += `<path d="M${(x - w * .6).toFixed(1)} ${y - 10} Q${x.toFixed(1)} ${y + 18} ${(x + w * .6).toFixed(1)} ${y - 10} Q${x.toFixed(1)} ${y - 4} ${(x - w * .6).toFixed(1)} ${y - 10}Z" fill="${c}"/>`; } });
    return s + "</g>";
  };
  // the TRAVELLER: amber codebrew bottle. Origin = top-centre of the cap. Natural size ~110 x 340 at s=1.
  K.bottle = (x = 0, y = 0, { rot = 0, s = 1, label = true, id = "" } = {}) => `<g ${id ? `id="${id}"` : ""} class="kb-bottle" transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
  <path d="M-14 0 h28 v12 h-28z" fill="#d6a43a"/><path d="M-14 0 h10 v12 h-10z" fill="#f0c766"/>
  <path d="M-12 12 h24 l3 70 q46 26 46 86 v210 q0 18-18 18 h-86 q-18 0-18-18 v-210 q0-60 46-86z" fill="#6a3511"/>
  <path d="M-4 12 h8 l2 72 q12 14 12 40 v268 h-26 v-268 q0-26 2-40z" fill="#8d4a18" opacity=".9"/>
  <path d="M-52 120 q4-22 16-30 l4 6 q-10 10-12 26 v200 h-8z" fill="#a85d22" opacity=".8"/>
  ${label ? `<rect x="-49" y="190" width="98" height="96" fill="#f6ead2"/><rect x="-49" y="190" width="30" height="96" fill="#fff8ea"/><rect x="-49" y="276" width="98" height="10" fill="#e8b84a"/><text x="0" y="234" text-anchor="middle" font-family="Archivo Black, Arial Black, Arial" font-size="19" fill="#c46a1f">code</text><text x="0" y="258" text-anchor="middle" font-family="Archivo Black, Arial Black, Arial" font-size="19" fill="#2b1a12">brew</text>` : ""}
</g>`;
  // paper push-pin like alfredservice's
  K.pin = (x, y, c = "#c46a1f") => `<g filter="url(#sh2)"><circle cx="${x}" cy="${y}" r="30" fill="#f2efe9"/><circle cx="${x}" cy="${y}" r="26" fill="#e4e0d8"/><circle cx="${x}" cy="${y}" r="16" fill="${c}"/></g>`;
  // string (for hanging things)
  K.string = (x1, y1, x2, y2, c = "#efe6d6") => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
  // section label overlay, Alfred style: big caps + arrow link + small description. pos in % of stage.
  K.label = ({ title, href = "#", text = "", left = "8%", top = "60%", color = "#fff", sub = "rgba(255,255,255,.85)", align = "left" }) =>
    `<a class="kb-label" href="${href}" style="left:${left};top:${top};color:${color};text-align:${align}"><span class="kb-label-t">${title.replace(/(\S+)$/, '<span class="svc-nw">$1&nbsp;<i>→</i></span>')}</span>${text ? `<small style="color:${sub}">${text}</small>` : ""}</a>`;

  // SERVICE LINE (one per service scene, same look everywhere; styles in journey.css "service line"):
  //   kicker "Step 0X · <brew step>", big title = the service, ONE short plain sentence of what he delivers.
  //   Sits on a paper slip so it reads over any art. Position with left/top (stage %) or the scene's own CSS.
  //   Markup (if a scene writes it by hand, keep exactly this):
  //   <a class="kb-label svc" href="…"><em class="svc-kick">Step 01 · Mill &amp; Mash</em>
  //     <span class="kb-label-t">Custom Themes <i>→</i></span><small>One plain sentence.</small></a>
  K.svc = ({ step, brew, title, text = "", href = "#", left = "", top = "", cls = "", id = "" }) =>
    `<a class="kb-label svc ${cls}"${id ? ` id="${id}"` : ""} href="${href}"${left || top ? ` style="${left ? `left:${left};` : ""}${top ? `top:${top};` : ""}"` : ""}>` +
    `<em class="svc-kick">Step ${String(step).padStart(2, "0")} · ${brew}</em><span class="kb-label-t">${title.replace(/(\S+)$/, '<span class="svc-nw">$1&nbsp;<i>→</i></span>')}</span>${text ? `<small>${text}</small>` : ""}</a>`;

  /* ===== PHOTOREAL PAPER SPRITES (v2) =====
     Scenes are composed in a 1440x900 DESIGN BOX (div.kbox) that journey.js scales to cover the viewport
     (like preserveAspectRatio slice). Place sprites in box pixels.
     Sprites live in journey/img/*.webp (transparent cut-outs):
       barril-wave (807x978)  barril-cheers (820x964)  barley (324x1100)  mill (1100x722, mill+mash tun+sacks)
       kettle (652x1100, copper kettle on azulejo plinth)  hop (595x868)  rooster (1100x853, flying Barcelos rooster, faces right)
       chiller (1100x528, copper coil + gauges)  fermenter (506x1100)  yeast (811x769, sleepy yeast in nightcap)
       bottle (316x1100, amber paper bottle, blank cream label)  tram (1100x681, Lisbon tram, faces right)
       bar (1100x885, bar counter with taps, pint, pastéis de nata)  douro.webp (1536x864 full-bleed backdrop plate, not a cut-out)
     depth 1..3 = how far the object stands off the wall (bigger, softer cast shadow). Shadows follow the cursor-light
     automatically via CSS vars --lx/--ly (set by journey.js), so never bake shadows yourself.
  */
  K.box = (inner, { focus = 50 } = {}) => `<div class="kbox" data-focus="${focus}">${inner}</div>`;
  K.img = (name, { x = 0, y = 0, w = 300, depth = 2, id = "", cls = "", rot = 0, z = 2, alt = "" } = {}) =>
    `<img ${id ? `id="${id}"` : ""} class="ks d${depth} ${cls}" src="img/${name}.webp" alt="${alt}" draggable="false" style="left:${x}px;top:${y}px;width:${w}px;z-index:${z};${rot ? `rotate:${rot}deg;` : ""}">`;
  // absolutely positioned HTML block inside the box (for paper tags, labels on objects, etc.)
  K.at = (html, { x = 0, y = 0, w = "auto", z = 3, cls = "", id = "" } = {}) =>
    `<div ${id ? `id="${id}"` : ""} class="kat ${cls}" style="left:${x}px;top:${y}px;width:${typeof w === "number" ? w + "px" : w};z-index:${z}">${html}</div>`;
  // paper tag (kraft luggage tag on a string) — HTML so it's crisp
  K.tag = (text, { color = "#e8d3a8" } = {}) => `<span class="ktag" style="--tc:${color}">${text}</span>`;
  window.K = K;
  window.SCENES = window.SCENES || [];
})();
