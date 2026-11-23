/* 70 · HILLS — "Order a round" (the contact section).
   Paper hop hills at golden hour. The bottle drops in from the top, slides down three zig-zag paper chutes,
   lands on a see-saw that catapults a bottle cap into a hanging "STILL BREWING" sign (it spins round to "WE'RE OPEN"),
   then tumbles into the back of an orange codebrew delivery truck that drives off over the hills.
   A real order slip (contact form) is pinned on the right; a paper pint on it fills as you write. */
(function () {
  const K = window.K, C = K.C;
  const S = .42, BH = 396 * S, BW = 108 * S;                 // traveller scale + size
  const rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI;
  const cl = v => Math.max(0, Math.min(1, v)), lerp = (a, b, k) => a + (b - a) * k;
  const seg = (t, a, b) => cl((t - a) / (b - a));
  const eIn = k => k * k, eOut = k => 1 - (1 - k) * (1 - k), eIO = k => k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
  const backOut = k => 1 + 2.70158 * (k - 1) ** 3 + 1.70158 * (k - 1) ** 2;
  const f = v => (+v).toFixed(1);

  /* ---------- smooth paper hills ---------- */
  const crSegs = pts => { const s = []; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    s.push([p1, [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6], p2]); } return s; };
  const crD = pts => crSegs(pts).map((c, i) => (i ? "" : `M${c[0][0]} ${c[0][1]}`) + `C${f(c[1][0])} ${f(c[1][1])} ${f(c[2][0])} ${f(c[2][1])} ${c[3][0]} ${c[3][1]}`).join("");
  const hill = (pts, col) => `<path d="${crD(pts)}L${pts.at(-1)[0]} 980L${pts[0][0]} 980Z" fill="${col}"/>`;
  const cub = (c, t) => { const u = 1 - t; return [0, 1].map(k => u * u * u * c[0][k] + 3 * u * u * t * c[1][k] + 3 * u * t * t * c[2][k] + t * t * t * c[3][k]); };
  const lut = pts => { const o = []; crSegs(pts).forEach(c => { for (let i = 0; i < 40; i++) o.push(cub(c, i / 40)); }); o.push(pts.at(-1)); return o; };
  const atX = (L, x) => { let i = 1; while (i < L.length - 1 && L[i][0] < x) i++;
    const a = L[i - 1], b = L[i], k = cl((x - a[0]) / ((b[0] - a[0]) || 1)); return [lerp(a[1], b[1], k), Math.atan2(b[1] - a[1], b[0] - a[0])]; };
  const shift = (P, d) => P.map(([x, y]) => [x, y + d]);

  const H1 = [[-140, 500], [120, 462], [380, 498], [640, 452], [900, 486], [1180, 446], [1580, 480]];
  const H2 = [[-140, 592], [180, 552], [480, 600], [780, 550], [1080, 592], [1360, 552], [1580, 575]];
  const H3 = [[-140, 684], [240, 644], [560, 692], [880, 652], [1200, 690], [1580, 655]];
  const H4 = [[-140, 772], [260, 740], [640, 770], [1040, 738], [1400, 764], [1580, 752]];
  const L1 = lut(H1), L2 = lut(H2), ROAD = lut(shift(H4, 62));

  /* ---------- machine geometry ---------- */
  const R = [[[90, 172], [520, 256]], [[655, 340], [255, 425]], [[150, 472], [478, 532]]];
  const onRamp = (i, u) => { const [a, b] = R[i], ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    let n = [Math.sin(ang), -Math.cos(ang)]; if (n[1] > 0) n = [-n[0], -n[1]];
    return [lerp(a[0], b[0], u) + n[0] * (BW / 2 + 2), lerp(a[1], b[1], u) + n[1] * (BW / 2 + 2), deg(ang) + 90]; };
  const PV = [650, 585], HALF = 150;
  const onPlank = (th, d, lift) => { const a = rad(th), lx = d, ly = -9 - lift;
    return [PV[0] + lx * Math.cos(a) - ly * Math.sin(a), PV[1] + lx * Math.sin(a) + ly * Math.cos(a)]; };
  const X0 = 372, XEND = 1820;                                       // truck parked x / exit x
  const truckAt = x => { const [y, a] = atX(ROAD, x); return [x, y, deg(a)]; };
  const toWorld = ([tx, ty, ta], [lx, ly]) => { const a = rad(ta); return [tx + lx * Math.cos(a) - ly * Math.sin(a), ty + lx * Math.sin(a) + ly * Math.cos(a)]; };
  const CARGO = [-78, -60 - BH / 2], CARGO_R = -7;
  const bz = (p0, p1, p2, t) => K.bez(p0, p1, p2, t);

  /* ---------- little paper props ---------- */
  const pinS = (x, y, c = "#c46a1f") => `<g filter="url(#sh1)"><circle cx="${x}" cy="${y}" r="13" fill="#f2efe9"/><circle cx="${x}" cy="${y}" r="11" fill="#e4e0d8"/><circle cx="${x}" cy="${y}" r="7" fill="${c}"/></g>`;
  const cloud = (x, y, s) => { const b = (dx, dy, col) => `<g fill="${col}" transform="translate(${x + dx} ${y + dy}) scale(${s})"><circle cx="-46" cy="-6" r="30"/><circle cx="-6" cy="-26" r="42"/><circle cx="42" cy="-10" r="32"/><rect x="-78" y="-8" width="152" height="32" rx="16"/></g>`;
    return `<g class="hl-cloud" filter="url(#sh2)">${b(5, 7, "#e7dccb")}${b(0, 0, "#fffaf0")}</g>`; };
  const tree = (x, y, s, c1 = "#6aa83a", c2 = "#57902d") => `<g filter="url(#sh1)" transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="-34" width="8" height="36" fill="#8a5a32"/><circle cx="0" cy="-58" r="30" fill="${c1}"/><path d="M0 -88 A30 30 0 0 1 0 -28 Z" fill="${c2}"/></g>`;
  const cap = (r = 13) => { let d = ""; for (let i = 0; i < 42; i++) { const a = i / 42 * Math.PI * 2, rr = i % 2 ? r : r * .86; d += (i ? "L" : "M") + f(Math.cos(a) * rr) + " " + f(Math.sin(a) * rr); }
    return `<path d="${d}Z" fill="#d6a43a"/><circle r="${r * .68}" fill="#f0c766"/><path d="M${-r * .3} ${-r * .3} h${r * .6} v${r * .2} h${-r * .6}z" fill="#d6a43a"/>`; };
  const ramp = ([a, b]) => `<g filter="url(#sh2)">
    <path d="M${a[0]} ${a[1] - 8} L${b[0]} ${b[1] - 8} L${b[0]} ${b[1]} L${a[0]} ${a[1]}Z" fill="#dcc79c"/>
    <path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${b[0]} ${b[1] + 16} L${a[0]} ${a[1] + 16}Z" fill="#e3cfa6"/>
    <path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${b[0]} ${b[1] + 9} L${a[0]} ${a[1] + 9}Z" fill="#f7eedb"/></g>`;
  const yard = (x0, x1, L, top, sc) => {                     // hop yard: poles, wire, bines, cones
    const P = []; for (let x = x0; x <= x1; x += 120 * sc) P.push([x, atX(L, x)[0] + 6]);
    let back = "", poles = "", wire = `<path d="M${P.map(([x, y]) => `${x} ${f(y - top)}`).join(" L")}" stroke="#6b4a2e" stroke-width="${2 * sc}" fill="none"/>`;
    P.forEach(([x, y], i) => {
      poles += `<rect x="${f(x - 4 * sc)}" y="${f(y - top - 6)}" width="${f(8 * sc)}" height="${f(top + 10)}" fill="#9a6a3c"/><rect x="${f(x)}" y="${f(y - top - 6)}" width="${f(4 * sc)}" height="${f(top + 10)}" fill="#b98450"/>`;
      if (i === P.length - 1) return;
      const [nx, ny] = P[i + 1];
      [.3, .7].forEach((k, j) => { const gx = lerp(x, nx, k), gy = lerp(y, ny, k), tx = lerp(x, nx, k + (j ? -.18 : .18)), ty = lerp(y, ny, k) - top + 2;
        back += `<g class="hl-bine">${K.string(f(gx), f(gy), f(tx), f(ty), "#c9b48c")}${K.frond([gx, gy], [lerp(gx, tx, .5) + 6, lerp(gy, ty, .5)], [tx, ty], { n: 9, Lmax: 15 * sc, stem: 2, spread: 1.15, col: "#6fb43a", col2: "#5e9e31" })}
          ${K.hopCone(lerp(gx, tx, .55) + 8 * sc, lerp(gy, ty, .55), .2 * sc)}${K.hopCone(lerp(gx, tx, .8) - 7 * sc, lerp(gy, ty, .8), .17 * sc)}</g>`; });
    });
    return `<g filter="url(#sh1)">${back}${wire}${poles}</g>`;
  };
  // Lisbon-style yellow tram (tiny, far hill)
  const tram = () => `<g id="hl-tram"><g filter="url(#sh1)" transform="scale(.62)">
    <path d="M-2 -66 L-2 -92" stroke="#3a2a22" stroke-width="2"/><path d="M-2 -92 L22 -104" stroke="#3a2a22" stroke-width="2"/>
    <rect x="-46" y="-66" width="92" height="10" rx="4" fill="#e9e0cf"/>
    <rect x="-44" y="-58" width="88" height="44" rx="6" fill="#f3c21b"/><rect x="-44" y="-30" width="88" height="16" fill="#e3a90f"/>
    ${[-36, -18, 0, 18].map(x => `<rect x="${x}" y="-52" width="14" height="16" rx="2" fill="#fff6e2"/>`).join("")}
    <rect x="-44" y="-16" width="88" height="5" fill="#3a2a22"/>
    <circle cx="-26" cy="-9" r="6" fill="#3a2a22"/><circle cx="26" cy="-9" r="6" fill="#3a2a22"/></g></g>`;
  // Santo António sardine bunting
  const bunting = (a, b, sag) => { let s = `<path d="M${a[0]} ${a[1]} Q${(a[0] + b[0]) / 2} ${(a[1] + b[1]) / 2 + sag * 2} ${b[0]} ${b[1]}" stroke="#efe6d6" stroke-width="2.5" fill="none"/>`;
    const cols = [["#3fa0d8", "#2f86bd"], ["#e2463a", "#c43a2f"], ["#f2c14e", "#d9a43a"], ["#7cc243", "#62a533"], ["#f08a3c", "#d6702a"]];
    for (let i = 1; i < 10; i++) { const t = i / 10, [x, y] = K.bez(a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag * 2], b, t), [c1, c2] = cols[i % 5];
      s += `<g class="hl-sardine" transform="translate(${f(x)} ${f(y)})"><g transform="rotate(${i % 2 ? 84 : 96})">
        <path d="M-4 0 Q14 -11 34 -2 L44 -9 L42 0 L44 9 L34 2 Q14 11 -4 0Z" fill="${c1}"/><path d="M-4 0 Q14 11 34 2 L34 0 L-4 0Z" fill="${c2}"/><circle cx="3" cy="-1.5" r="2" fill="#fff6e2"/></g></g>`; }
    return `<g filter="url(#sh1)">${s}</g>`; };

  /* ---------- the truck (local origin = road contact point, facing right) ---------- */
  const wheel = (x, id) => `<g class="hl-wheel" data-x="${x}"><g id="${id}" transform="translate(${x} -30)"><circle r="30" fill="#2f2624"/><circle r="18" fill="#efe6d6"/><circle r="18" fill="#d9cdb8" clip-path="inset(0 0 0 50%)"/>
    ${[0, 72, 144, 216, 288].map(a => `<rect x="-2.5" y="-16" width="5" height="10" rx="2" fill="#a89a88" transform="rotate(${a})"/>`).join("")}<circle r="6" fill="#8a7d70"/></g></g>`;
  const truck = () => `<g id="hl-truck" filter="url(#sh3)"><g id="hl-truckT"><g id="hl-truckBody">
    <g id="hl-cargo" opacity="0" transform="translate(${CARGO[0]} ${CARGO[1]}) rotate(${CARGO_R})">${K.bottle(0, -BH / 2, { s: S })}</g>
    <rect x="-176" y="-50" width="14" height="7" rx="3" fill="#5a524c"/>
    <rect x="-166" y="-64" width="330" height="22" rx="4" fill="#3d3330"/>
    <path d="M-170 -126 H14 V-50 H-154 Q-170 -50 -170 -66Z" fill="#ef7b2e"/>
    <rect x="-170" y="-126" width="184" height="9" fill="#f89a52"/>
    <path d="M-170 -62 H14 V-50 H-154 Q-166 -50 -170 -58Z" fill="#d8641f"/>
    <circle cx="-105" cy="-50" r="38" fill="#c45a1a"/><circle cx="100" cy="-50" r="38" fill="#c45a1a"/>
    <text x="-78" y="-80" text-anchor="middle" font-family="Archivo Black, Arial Black, Arial" font-size="27" fill="#fff6e2" letter-spacing="-.5">code<tspan fill="#2b1a12">brew</tspan></text>
    <text x="-78" y="-64" text-anchor="middle" font-family="Archivo, Arial" font-weight="800" font-size="9.5" letter-spacing="2" fill="#fff0d8">FRESH DELIVERIES · EST. 2015</text>
    <path d="M14 -50 V-150 Q14 -162 26 -162 H94 Q106 -162 112 -151 L132 -110 H152 Q168 -110 168 -94 V-50Z" fill="#ef7b2e"/>
    <path d="M14 -72 H168 V-50 H14Z" fill="#d8641f"/>
    <path d="M30 -150 H90 Q97 -150 101 -142 L117 -110 H30Z" fill="#bfe2ee"/><path d="M58 -150 H74 L50 -110 H34Z" fill="#e6f6fb"/>
    <g transform="translate(84 -136)">${K.string(0, -10, 0, 2, "#3a2a22")}${K.hopCone(0, 12, .22)}</g>
    <rect x="34" y="-100" width="14" height="5" rx="2" fill="#c45a1a"/>
    <circle cx="160" cy="-96" r="8" fill="#f2c14e"/><circle cx="160" cy="-96" r="4" fill="#fff6e2"/>
    <rect x="150" y="-64" width="24" height="14" rx="4" fill="#a7a7ab"/><rect x="150" y="-64" width="24" height="5" rx="2" fill="#c9c9cc"/>
    <g transform="translate(60 -176)">${cap(16)}</g><rect x="57" y="-162" width="6" height="12" fill="#3d3330"/>
    </g>${wheel(-105, "hl-w1")}${wheel(100, "hl-w2")}</g></g>`;

  /* ---------- scene ---------- */
  SCENES.push({
    id: "hills", order: 70, height: 260, bg: "#cfe8e3", headerTone: "dark",
    html: (K) => {
      const dashes = []; for (let x = -100; x < 1540; x += 74) { const [y1] = atX(ROAD, x), [y2] = atX(ROAD, x + 30); dashes.push(`M${x} ${f(y1 - 2)} L${x + 30} ${f(y2 - 2)} L${x + 30} ${f(y2 + 2)} L${x} ${f(y1 + 2)}Z`); }
      const tbases = [[60, .8], [250, .95], [450, .75]].map(([x, s]) => tree(x, atX(L1, x)[0] + 8, s)).join("");
      const art = K.svg(`
        <rect id="hl-sky" width="1440" height="900" fill="#cfe8e3"/>
        <g id="hl-sun" filter="url(#sh1)"><circle id="hl-sunA" cx="330" cy="140" r="74" fill="#f8d26a"/><circle id="hl-sunB" cx="330" cy="140" r="54" fill="#fbe08f"/></g>
        ${cloud(820, 150, .9)}${cloud(1210, 80, 1.1)}${cloud(80, 360, .8)}
        ${bunting([700, 70], [1440, 120], 40)}
        <g filter="url(#sh1)">${hill(H1, C.hill1)}</g>
        ${tbases}
        <g filter="url(#sh1)" transform="translate(0 0)">
          <rect x="812" y="404" width="52" height="66" fill="#f4efe4"/><rect x="838" y="404" width="26" height="66" fill="#e2dccd"/>
          <path d="M806 406 L838 336 L870 406Z" fill="#c0623a"/><path d="M838 336 L870 406 H838Z" fill="#a5502e"/>
          <path d="M830 340 L846 330 L850 346 L834 350Z" fill="#fbf8f0"/>
          <rect x="864" y="428" width="70" height="42" fill="#f4efe4"/><path d="M858 430 L880 404 H930 L940 430Z" fill="#c0623a"/>
          <rect x="884" y="440" width="14" height="30" fill="#8a4a2a"/><rect x="824" y="420" width="12" height="14" fill="#8a4a2a"/>
        </g>
        ${tram()}
        <g filter="url(#sh1)">${hill(H2, C.hill2)}</g>
        ${yard(700, 1440, L2, 150, 1)}
        ${tree(1010, atX(L2, 1010)[0] + 10, .7, "#5d9a33", "#4f862a")}
        <g filter="url(#sh2)"><rect x="186" y="520" width="9" height="180" fill="#9a6a3c"/><rect x="434" y="560" width="9" height="140" fill="#9a6a3c"/></g>
        <g filter="url(#sh1)">${hill(H3, C.hill3)}</g>
        <!-- see-saw stand -->
        <g filter="url(#sh2)"><path d="M650 585 L590 742 H614 L650 622 L686 742 H710Z" fill="#a8703d"/><path d="M650 585 L686 742 H710Z" fill="#8e5c30"/><rect x="606" y="680" width="88" height="10" fill="#8e5c30"/></g>
        <!-- strings + pins -->
        ${K.string(130, 96, 130, 180)}${K.string(470, 96, 470, 246)}${K.string(280, 224, 280, 418)}
        ${K.string(588, 96, 640, 168)}${K.string(692, 96, 640, 168)}${K.string(640, 280, 640, 342)}
        ${ramp(R[0])}${ramp(R[1])}${ramp(R[2])}
        ${pinS(130, 96)}${pinS(470, 96)}${pinS(588, 96, "#3fa0d8")}${pinS(692, 96, "#3fa0d8")}
        <!-- hanging sign: STILL BREWING ⇄ WE'RE OPEN -->
        <g id="hl-sign" filter="url(#sh2)"><g id="hl-signT" transform="translate(640 225)">
          <circle cx="0" cy="-57" r="5" fill="#8a7d70"/>
          <g id="hl-signF"><rect x="-104" y="-55" width="208" height="112" rx="6" fill="#f6ecd6"/><rect x="-104" y="30" width="208" height="27" rx="6" fill="#e6d6b4"/>
            <text y="-10" text-anchor="middle" font-family="Archivo Black, Arial Black" font-size="24" fill="#2b1a12">STILL</text>
            <text y="18" text-anchor="middle" font-family="Archivo Black, Arial Black" font-size="24" fill="#2b1a12">BREWING…</text>
            <text y="48" text-anchor="middle" font-family="Archivo, Arial" font-weight="800" font-size="11" letter-spacing="1.5" fill="#8a6a3c">KEEP SCROLLING</text></g>
          <g id="hl-signB" transform="scale(-1 1)" opacity="0"><rect x="-104" y="-55" width="208" height="112" rx="6" fill="#e9a03a"/><rect x="-104" y="30" width="208" height="27" rx="6" fill="#d98a22"/>
            <text y="-8" text-anchor="middle" font-family="Archivo Black, Arial Black" font-size="31" fill="#fff6e2">WE'RE</text>
            <text y="24" text-anchor="middle" font-family="Archivo Black, Arial Black" font-size="31" fill="#fff6e2">OPEN!</text>
            <text y="49" text-anchor="middle" font-family="Archivo, Arial" font-weight="800" font-size="12" letter-spacing="1.5" fill="#2b1a12">ORDER A ROUND →</text></g>
        </g></g>
        <!-- see-saw plank + cap -->
        <g filter="url(#sh2)"><g id="hl-plank" transform="translate(${PV[0]} ${PV[1]}) rotate(10)">
          <rect x="${-HALF - 10}" y="-9" width="${2 * HALF + 20}" height="18" rx="3" fill="#c98d52"/><rect x="${-HALF - 10}" y="-9" width="${2 * HALF + 20}" height="6" rx="3" fill="#dea468"/><rect x="${-HALF - 10}" y="5" width="${2 * HALF + 20}" height="4" fill="#a86f3a"/>
        </g><circle cx="${PV[0]}" cy="${PV[1]}" r="8" fill="#5a3a22"/></g>
        <g id="hl-cap" filter="url(#sh2)"><g id="hl-capT">${cap(13)}</g></g>
        <!-- front hill + road -->
        <g filter="url(#sh1)">${hill(H4, C.hill4)}</g>
        <g filter="url(#sh1)">${hill(shift(H4, 40), "#e2c58f")}<path d="${dashes.join("")}" fill="#fff3d6"/></g>
        <g filter="url(#sh1)">${hill(shift(H4, 84), "#4f8a2c")}</g>
        <!-- traveller -->
        <g id="hl-trav" filter="url(#sh3)"><g id="hl-travT">${K.bottle(0, -BH / 2, { s: S })}</g></g>
        ${truck()}
        <g id="hl-puffs" filter="url(#sh1)">${Array.from({ length: 10 }, () => `<circle r="0" fill="#fffaf0" opacity="0"/>`).join("")}</g>
        <!-- foreground bushes -->
        <g filter="url(#sh3)">
          <path d="M-40 900 Q-30 812 40 818 Q70 772 128 806 Q176 790 196 840 Q236 846 238 900Z" fill="#3f7726"/><path d="M40 818 Q70 772 128 806 Q120 850 60 860Z" fill="#4c8a2e"/>
          <path d="M1250 900 Q1252 836 1310 830 Q1340 790 1394 812 Q1452 800 1480 850 V900Z" fill="#3f7726"/><path d="M1310 830 Q1340 790 1394 812 Q1380 850 1330 862Z" fill="#4c8a2e"/>
          ${K.hopCone(150, 812, .45)}${K.hopCone(1300, 820, .5)}
        </g>
      `, "hl-art");
      return art + `
      <div class="hl-slipwrap" id="hl-slipwrap">
        <i class="hl-pin" aria-hidden="true"></i>
        <form class="hl-slip" id="hl-form" novalidate aria-labelledby="hl-title">
          <div class="hl-head"><span>codebrew · order slip</span><span>No. <b id="hl-no">0042</b></span></div>
          <h2 id="hl-title">Order a round</h2>
          <p class="hl-lead">Tell me what you're thirsty for. I reply within one business day, usually before the foam settles.</p>
          <svg class="hl-pint" viewBox="0 0 70 104" aria-hidden="true"><defs><clipPath id="hl-glass"><path d="M6 8 H64 L57 96 Q35 100 13 96Z"/></clipPath></defs>
            <path d="M6 8 H64 L57 96 Q35 100 13 96Z" fill="#eadcc0"/>
            <g clip-path="url(#hl-glass)"><g id="hl-beer" transform="translate(0 100)"><rect y="0" width="70" height="110" fill="#e9a03a"/><rect x="44" y="0" width="30" height="110" fill="#d98a22"/>
              <path d="M0 2 Q6 -8 12 0 Q18 -9 25 -1 Q32 -9 39 -1 Q46 -9 53 -1 Q60 -9 70 0 V8 H0Z" fill="#fffaf0"/></g>
              <rect x="13" y="16" width="5" height="70" fill="#fff" opacity=".45"/></g>
          </svg>
          <span class="hl-pct" id="hl-pct">0% poured</span>
          <input class="hl-hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">
          <div class="hl-row">
            <label class="hl-f"><span>Name on the tab</span><input name="name" required autocomplete="name" placeholder="Ana Sousa"></label>
            <label class="hl-f"><span>Your email</span><input name="email" type="email" required autocomplete="email" placeholder="ana@store.com"></label>
          </div>
          <label class="hl-f"><span>What are you thirsty for?</span>
            <select name="type" required><option value="">Pick your poison…</option><option>New custom theme</option><option>Shopify Plus</option><option>App or integration</option><option>Speed fix</option><option>Hiring</option><option>Just saying cheers</option></select></label>
          <label class="hl-f"><span>Pour your heart out (the brief)</span><textarea name="msg" rows="3" required placeholder="Store link, what's broken or what you dream of, rough timeline…"></textarea></label>
          <div class="hl-actions"><button type="submit">Send it to the bar <i>→</i></button>
            <span class="hl-or">or write to <a href="mailto:ambduu@gmail.com">ambduu@gmail.com</a></span></div>
          <p class="hl-done" id="hl-done" role="status" aria-live="polite"></p>
          <div class="hl-stamp" aria-hidden="true">Poured!<small>Saúde · cheers</small></div>
        </form>
        <a class="hl-mat" href="https://www.linkedin.com/in/germanjit-singh-sandhu" target="_blank" rel="noopener"><b>LinkedIn</b><small>my tab ↗</small></a>
        <a class="hl-mat g" href="https://github.com/ambduu" target="_blank" rel="noopener"><b>GitHub</b><small>the cellar ↗</small></a>
      </div>
      <style>
        #hills .jstage { background: #cfe8e3; }
        .hl-slipwrap { position: absolute; z-index: 6; right: 5vw; top: max(92px, 12vh); width: clamp(330px, 30vw, 440px);
          filter: drop-shadow(1px 2px 1.5px rgba(40,25,10,.35)) drop-shadow(16px 26px 16px rgba(40,25,10,.26)); }
        .hl-pin { position: absolute; z-index: 3; left: 50%; top: -12px; width: 38px; height: 38px; margin-left: -19px; border-radius: 50%;
          background: radial-gradient(circle, #c46a1f 0 9px, #e4e0d8 9.5px 15px, #f2efe9 15.5px 19px); filter: drop-shadow(3px 5px 4px rgba(0,0,0,.35)); }
        .hl-slip { position: relative; margin: 0; padding: 30px 26px 22px; background: #fbf4e4; color: #2b1a12; font-family: Archivo, sans-serif;
          -webkit-mask: radial-gradient(circle 6px at 9px 0, transparent 97%, #000) 0 0/18px 100% repeat-x; mask: radial-gradient(circle 6px at 9px 0, transparent 97%, #000) 0 0/18px 100% repeat-x; }
        .hl-slip::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 8px; background: #e9a03a; }
        .hl-head { display: flex; justify-content: space-between; font: 800 10.5px Archivo, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #c46a1f; padding-right: 64px; }
        .hl-head b { color: #2b1a12; }
        .hl-slip h2 { margin: 8px 0 6px; font: 400 clamp(30px, 2.8vw, 42px)/.95 "Archivo Black", sans-serif; text-transform: uppercase; letter-spacing: -.01em; padding-right: 60px; }
        .hl-lead { margin: 0 0 12px; font: 600 14px/1.45 Archivo, sans-serif; color: #5a4636; padding-right: 54px; }
        .hl-pint { position: absolute; right: 18px; top: 22px; width: 50px; height: 74px; filter: drop-shadow(4px 6px 4px rgba(40,25,10,.25)); }
        .hl-pct { position: absolute; right: 8px; top: 98px; width: 70px; text-align: center; font: 800 9.5px Archivo, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #8a6a3c; }
        .hl-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
        .hl-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .hl-f { display: block; margin: 0 0 10px; }
        .hl-f span { display: block; font: 800 10.5px Archivo, sans-serif; letter-spacing: .12em; text-transform: uppercase; color: #8a6a3c; margin-bottom: 2px; }
        .hl-f input, .hl-f select, .hl-f textarea { width: 100%; border: 0; border-bottom: 2px solid #e2d0aa; border-radius: 0; background: transparent; padding: 6px 0 5px; font: 600 15.5px/1.35 Archivo, sans-serif; color: #2b1a12; outline: none; transition: border-color .2s, background-color .2s; }
        .hl-f textarea { resize: none; background-image: repeating-linear-gradient(transparent 0 24px, #efe2c6 24px 26px); line-height: 26px; padding-top: 0; }
        .hl-f select { appearance: none; -webkit-appearance: none; cursor: pointer; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M0 0h12L6 8z' fill='%23c46a1f'/%3E%3C/svg%3E") no-repeat right 4px center; }
        .hl-f input::placeholder, .hl-f textarea::placeholder { color: #c9b591; }
        .hl-f input:focus, .hl-f select:focus, .hl-f textarea:focus { border-bottom-color: #e9a03a; background-color: rgba(242,193,78,.12); }
        .hl-f input:user-invalid, .hl-f textarea:user-invalid, .hl-f select:user-invalid { border-bottom-color: #e2463a; }
        .hl-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 14px; margin-top: 6px; }
        .hl-actions button { border: 0; cursor: pointer; background: #2b1a12; color: #ffe27a; padding: 14px 20px; font: 800 13px Archivo, sans-serif; letter-spacing: .1em; text-transform: uppercase; box-shadow: 2px 3px 2px rgba(0,0,0,.25), 8px 14px 18px rgba(0,0,0,.18); transition: transform .2s, box-shadow .2s; }
        .hl-actions button i { font-style: normal; display: inline-block; transition: transform .25s; }
        .hl-actions button:hover { transform: translateY(-2px); } .hl-actions button:hover i { transform: translateX(5px); }
        .hl-actions button:focus-visible, .hl-mat:focus-visible, .hl-or a:focus-visible { outline: 3px solid #3fa0d8; outline-offset: 3px; }
        .hl-or { font: 600 13px Archivo, sans-serif; color: #7a6450; } .hl-or a { color: #c46a1f; font-weight: 800; }
        .hl-done { margin: 10px 0 0; font: 600 13px/1.4 Archivo, sans-serif; color: #2f6d1f; min-height: 0; }
        .hl-done:empty { display: none; }
        .hl-stamp { position: absolute; right: 26px; bottom: 70px; padding: 8px 14px 6px; border: 4px solid #e2463a; color: #e2463a; font: 400 28px/1 "Archivo Black", sans-serif; text-transform: uppercase; text-align: center; transform: rotate(-12deg) scale(2.2); opacity: 0; pointer-events: none; mix-blend-mode: multiply; }
        .hl-stamp small { display: block; font: 800 10px Archivo, sans-serif; letter-spacing: .2em; margin-top: 3px; }
        .hl-slip.sent .hl-stamp { animation: hlstamp .5s cubic-bezier(.2,1.6,.4,1) forwards; }
        @keyframes hlstamp { to { opacity: .9; transform: rotate(-12deg) scale(1); } }
        .hl-mat { position: absolute; z-index: 2; bottom: -54px; width: 96px; height: 96px; border-radius: 50%; display: grid; place-content: center; text-align: center; text-decoration: none;
          background: radial-gradient(circle, #fff6e2 0 36px, #e9a03a 36.5px 42px, #f2c14e 42.5px); color: #2b1a12; box-shadow: 1px 2px 2px rgba(0,0,0,.3), 10px 16px 16px rgba(40,25,10,.25); transition: transform .3s; }
        .hl-mat { right: 92px; transform: rotate(-9deg); } .hl-mat.g { right: -18px; bottom: -36px; transform: rotate(7deg); background: radial-gradient(circle, #fff6e2 0 36px, #3fa0d8 36.5px 42px, #6db8e3 42.5px); }
        .hl-mat b { font: 400 15px/1 "Archivo Black", sans-serif; } .hl-mat small { font: 800 9.5px Archivo, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: #c46a1f; margin-top: 3px; }
        .hl-mat:hover { transform: rotate(0) translateY(-4px) scale(1.05); }
        @media (max-height: 760px) and (min-width: 821px) { .hl-lead { display: none; } .hl-slip { padding-top: 24px; } .hl-f { margin-bottom: 6px; } }
        @media (max-width: 820px) {
          .hl-slipwrap { left: 16px; right: 16px; width: auto; top: auto; bottom: 64px; }
          .hl-slip { padding: 24px 18px 18px; } .hl-lead { font-size: 13px; } .hl-f input, .hl-f select, .hl-f textarea { font-size: 16px; }
          .hl-mat { width: 76px; height: 76px; bottom: -50px; right: 74px; background: radial-gradient(circle, #fff6e2 0 28px, #e9a03a 28.5px 33px, #f2c14e 33.5px); }
          .hl-mat.g { right: -6px; bottom: -40px; background: radial-gradient(circle, #fff6e2 0 28px, #3fa0d8 28.5px 33px, #6db8e3 33.5px); }
          .hl-mat b { font-size: 12px; } .hl-mat small { font-size: 8px; }
        }
      </style>`;
    },

    init: (stage, K, st) => {
      const $ = s => stage.querySelector(s), svg = $("svg.art");
      const trav = $("#hl-travT"), travG = $("#hl-trav"), cargo = $("#hl-cargo"), plank = $("#hl-plank"), capT = $("#hl-capT"), capG = $("#hl-cap");
      const signT = $("#hl-signT"), signF = $("#hl-signF"), signB = $("#hl-signB"), truckT = $("#hl-truckT"), body = $("#hl-truckBody");
      const w1 = $("#hl-w1"), w2 = $("#hl-w2"), sky = $("#hl-sky"), sunA = $("#hl-sunA"), sunB = $("#hl-sunB"), tramG = $("#hl-tram"), slip = $("#hl-slipwrap");
      const skyMix = gsap.utils.interpolate("#cfe8e3", "#f6c793"), sunMix = gsap.utils.interpolate("#f8d26a", "#f29a4a"), sunMix2 = gsap.utils.interpolate("#fbe08f", "#f7b465");
      const P = { t: K.reduced ? 1 : 0 }, clock = { s: 0 }, cam = { on: false, x: 0, want: 0, k: 1, w: 0, W: 0 };
      let mobile = false, visible = true, lastTruckX = X0;

      const fit = () => {
        const W = stage.clientWidth, H = stage.clientHeight; mobile = W <= 820; cam.on = W / H < 1.15; cam.W = W;
        if (cam.on) { cam.w = H * 1.6; cam.k = H / 900; svg.style.width = cam.w + "px"; }
        else { svg.style.width = ""; svg.style.transform = ""; cam.x = 0; }
      };
      fit(); addEventListener("resize", fit);

      const cargoWorld = (() => { const tp = truckAt(X0), c = toWorld(tp, CARGO); return [c[0], c[1], tp[2] + CARGO_R]; })();
      const set = (el, tr) => el.setAttribute("transform", tr);

      function render() {
        const t = P.t, time = clock.s;
        /* --- bottle --- */
        let b, th = 10, capPos = null, capRot = 0;
        const u1 = onRamp(0, .24), up = [176, 172 + 84 * .2 * .24 * 0 - BH / 2 + 4, 0];
        if (t < .06) { const k = eIn(seg(t, 0, .06)); b = [176, lerp(-BH, up[1], k), 0]; }
        else if (t < .09) { const k = eIn(seg(t, .06, .09)); b = [lerp(up[0], u1[0], k), lerp(up[1], u1[1], k), lerp(0, u1[2], k)]; }
        else if (t < .18) b = onRamp(0, lerp(.24, 1, eIn(seg(t, .09, .18))));
        else if (t < .215) { const k = seg(t, .18, .215), a = onRamp(0, 1), c = onRamp(1, .1); b = [lerp(a[0], c[0], k), lerp(a[1], c[1], eIn(k)), lerp(a[2], c[2], eIO(k))]; }
        else if (t < .31) b = onRamp(1, lerp(.1, 1, eIn(seg(t, .215, .31))));
        else if (t < .345) { const k = seg(t, .31, .345), a = onRamp(1, 1), c = onRamp(2, .2); b = [lerp(a[0], c[0], k), lerp(a[1], c[1], eIn(k)), lerp(a[2], c[2], eIO(k))]; }
        else if (t < .44) b = onRamp(2, lerp(.2, 1, eIn(seg(t, .345, .44))));
        // plank angle
        if (t >= .47) th = lerp(10, -15, backOut(seg(t, .47, .52)));
        if (t >= .44 && t < .47) { const k = seg(t, .44, .47), a = onRamp(2, 1), c = onPlank(10, -90, BW / 2 + 1); b = [lerp(a[0], c[0], k), lerp(a[1], c[1], eIn(k)), lerp(a[2], 100, k)]; }
        else if (t >= .47 && t < .555) { const d = lerp(-90, -178, eIn(seg(t, .5, .555))), c = onPlank(th, d, BW / 2 + 1); b = [c[0], c[1], th + 90]; }
        else if (t >= .555 && t < .615) { const k = seg(t, .555, .615), a = onPlank(-15, -178, BW / 2 + 1); b = [lerp(a[0], cargoWorld[0], eOut(k)), lerp(a[1], cargoWorld[1], eIn(k)), lerp(75, cargoWorld[2], eIO(k))]; }
        const inTruck = t >= .615;
        travG.style.visibility = inTruck ? "hidden" : ""; cargo.setAttribute("opacity", inTruck ? 1 : 0);
        if (b) set(trav, `translate(${f(b[0])} ${f(b[1])}) rotate(${f(b[2])})`);
        set(plank, `translate(${PV[0]} ${PV[1]}) rotate(${f(th)})`);
        /* --- cap --- */
        const launch = [790, 548], hit = [706, 268];
        if (t < .505) { capPos = onPlank(th, 128, 12); capRot = th; }
        else if (t < .575) { const k = seg(t, .505, .575), p = bz(launch, [800, 230], hit, eOut(k)); capPos = p; capRot = 720 * k; }
        else { const k = seg(t, .575, .68), p = bz(hit, [640, 200], [560, 1000], eIn(k)); capPos = p; capRot = 720 + 540 * k; }
        set(capT, `translate(${f(capPos[0])} ${f(capPos[1])}) rotate(${f(capRot)})`);
        /* --- sign --- */
        const ks = seg(t, .575, .65), sx = Math.cos(Math.PI * eOut(ks)), swing = Math.sin(time * 1.3) * 1.6 + Math.sin(ks * Math.PI * 3) * 7 * (1 - ks);
        signF.setAttribute("opacity", sx >= 0 ? 1 : 0); signB.setAttribute("opacity", sx < 0 ? 1 : 0);
        set(signT, `translate(640 168) rotate(${f(swing)}) translate(0 57) scale(${(Math.abs(sx) < .02 ? .02 * Math.sign(sx || 1) : sx).toFixed(3)} 1)`);
        /* --- truck --- */
        const tx = t < .63 ? X0 : lerp(X0, XEND, eIn(seg(t, .63, .97))), tp = truckAt(tx);
        const moving = Math.abs(tx - lastTruckX) > .3; lastTruckX = tx;
        set(truckT, `translate(${f(tp[0])} ${f(tp[1])}) rotate(${f(tp[2])})`);
        const bob = moving ? Math.sin(time * 22) * 1.2 : Math.sin(time * 40) * .7;
        set(body, `translate(0 ${f(bob)})`);
        const wr = deg((tx - X0) / 30);
        set(w1, `translate(-105 -30) rotate(${f(wr)})`); set(w2, `translate(100 -30) rotate(${f(wr)})`);
        render.tp = tp; render.moving = moving;
        /* --- sky, sun, tram --- */
        sky.setAttribute("fill", skyMix(t)); stage.style.background = skyMix(t);
        const sy = lerp(140, 470, eIn(t)); [sunA, sunB].forEach(c => c.setAttribute("cy", f(sy)));
        sunA.setAttribute("fill", sunMix(t)); sunB.setAttribute("fill", sunMix2(t));
        const trx = 1440 - ((time * 18) % 1800); const [ty, ta] = atX(L1, trx); set(tramG, `translate(${f(trx)} ${f(ty + 4)}) rotate(${f(deg(ta))})`);
        /* --- form (mobile slides up after the truck leaves) --- */
        if (mobile) { const k = K.reduced ? 1 : seg(t, .64, .72); gsap.set(slip, { yPercent: (1 - eOut(k)) * 130, rotation: 0, opacity: k > 0 ? 1 : 0, pointerEvents: k > .9 ? "auto" : "none" }); }
        else { const k = K.reduced ? 1 : seg(t, 0, .07); gsap.set(slip, { y: (1 - backOut(k)) * -innerHeight, rotation: lerp(-10, 1.2, k), yPercent: 0, opacity: 1, pointerEvents: "auto" }); }
        /* --- mobile camera follows the action --- */
        if (cam.on) { const fx = inTruck ? Math.min(tp[0], 1100) : (b ? b[0] : 400); cam.want = Math.max(cam.W - cam.w, Math.min(0, cam.W / 2 - fx * cam.k)); }
      }

      // exhaust puffs
      const puffs = [...stage.querySelectorAll("#hl-puffs circle")]; let pi = 0, nextPuff = 0;
      const puff = () => { const tp = render.tp; if (!tp || tp[0] > 1600) return; const [x, y] = toWorld(tp, [-180, -46]), c = puffs[pi++ % puffs.length];
        gsap.fromTo(c, { attr: { cx: x, cy: y, r: 4 }, opacity: .95 }, { attr: { cx: x - 30 - Math.random() * 30, cy: y - 18 - Math.random() * 18, r: 11 + Math.random() * 7 }, opacity: 0, duration: 1.2, ease: "power1.out" }); };

      // idle life (only while on screen)
      ScrollTrigger.create({ trigger: st.trigger, start: "top bottom", end: "bottom top", onToggle: s => (visible = s.isActive) });
      gsap.ticker.add((tm, dt) => {
        if (!visible) return; clock.s += dt / 1000; render();
        if (cam.on) { cam.x += (cam.want - cam.x) * .1; svg.style.transform = `translate3d(${cam.x.toFixed(1)}px,0,0)`; }
        if (!K.reduced && clock.s > nextPuff) { nextPuff = clock.s + (render.moving ? .12 : .45); puff(); }
      });
      if (!K.reduced) {
        stage.querySelectorAll(".hl-cloud").forEach((c, i) => gsap.to(c, { x: i % 2 ? 26 : -22, duration: 7 + i * 2, yoyo: true, repeat: -1, ease: "sine.inOut" }));
        stage.querySelectorAll(".hl-sardine > g").forEach((s, i) => gsap.to(s, { rotation: `+=${i % 2 ? 10 : -10}`, svgOrigin: "0 0", duration: 1.4 + (i % 3) * .3, yoyo: true, repeat: -1, ease: "sine.inOut" }));
        stage.querySelectorAll(".hl-bine").forEach((g, i) => { const bb = g.getBBox(); gsap.set(g, { svgOrigin: `${bb.x + bb.width / 2} ${bb.y + bb.height}` }); gsap.to(g, { skewX: i % 2 ? 3 : -3, duration: 2 + (i % 4) * .4, yoyo: true, repeat: -1, ease: "sine.inOut" }); });
        gsap.timeline({ scrollTrigger: { ...st, scrub: 1 } }).to(P, { t: 1, ease: "none", duration: 1 });
      }
      render();

      /* ---------- the order slip ---------- */
      const form = $("#hl-form"), beer = $("#hl-beer"), pct = $("#hl-pct"), done = $("#hl-done");
      $("#hl-no").textContent = String(1000 + Math.floor(Math.random() * 9000));
      const lvl = { v: 0 };
      const measure = () => {
        const v = (form.name.value.trim().length > 1 ? .22 : 0) + (/.+@.+\..+/.test(form.email.value) ? .22 : 0) + (form.type.value ? .18 : 0) + Math.min(1, form.msg.value.trim().length / 80) * .38;
        gsap.to(lvl, { v, duration: .8, ease: "power2.out", overwrite: true, onUpdate: () => { beer.setAttribute("transform", `translate(0 ${f(100 - lvl.v * 88)})`); pct.textContent = Math.round(lvl.v * 100) + "% poured"; } });
      };
      form.addEventListener("input", measure); form.addEventListener("change", measure);
      form.addEventListener("submit", e => {
        e.preventDefault();
        if (form.company.value) return;
        if (!form.reportValidity()) return;
        const no = $("#hl-no").textContent, type = form.type.value || "a project";
        const subject = `Order #${no} at the bar: ${type} (${form.name.value.trim()})`;
        const bodyTxt = `${form.msg.value.trim()}\n\nThirsty for: ${type}\n\n${form.name.value.trim()}\n${form.email.value.trim()}`;
        gsap.to(lvl, { v: 1.08, duration: .6, ease: "power2.out", overwrite: true, onUpdate: () => { beer.setAttribute("transform", `translate(0 ${f(100 - Math.min(1, lvl.v) * 92)})`); pct.textContent = "100% poured"; } });
        form.classList.remove("sent"); void form.offsetWidth; form.classList.add("sent");
        done.innerHTML = `Your mail app should open with the order ready. Nothing popped up? Write to <a href="mailto:ambduu@gmail.com">ambduu@gmail.com</a>.`;
        setTimeout(() => { location.href = `mailto:ambduu@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyTxt)}`; }, 900);
      });
    }
  });
})();
