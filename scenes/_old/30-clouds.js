/* 30 · CLOUDS — "Shopify Plus".
   The bottle zips down a pulley line into a warm paper sky. On a cloud sleeps a Galo de Barcelos.
   The bottle swings into him (bonk), he wakes, crows "Cocorocó!", grabs the string in his beak and
   flies the bottle stork-style over Lisbon, then lets go so it drops out of the bottom of the stage.
   Parallax: sky bands static, far clouds / skyline slow, balloons mid, near clouds fast.
   Live bits (ticker): real pendulum physics on the hanging bottle, wing flapping driven by a scrubbed amplitude. */
(function () {
  let L = null; // layout, computed in html() from the viewport aspect, reused by init()

  const layout = () => {
    const asp = Math.max(.4, innerWidth / Math.max(1, innerHeight));
    const W = Math.min(1440, 900 * asp), vx0 = 720 - W / 2;
    const narrow = asp < 1.25;
    const kx = Math.min(1, Math.max(.36, W / 1440 * 1.25)); // squeeze for decorative stuff
    const mx = x => 720 + (x - 720) * kx;
    if (!narrow) return { narrow, W, vx0, mx,
      E: [935, 205], u: norm(-1, -.62), R: [1110, 575], rs: .95, bs: .7, L1: 118,
      fly: [[650, 120], [420, 235], [520, 330], [690, 300]], exit: [[900, 120], [1300, -420]],
      label: { left: "7%", top: "56%" } };
    return { narrow, W, vx0, mx,
      E: [668, 175], u: norm(-.55, -1), R: [790, 525], rs: .62, bs: .52, L1: 86,
      fly: [[600, 95], [560, 230], [640, 300], [690, 270]], exit: [[780, 120], [1000, -420]],
      label: { left: "6%", top: "73%" } };
  };
  function norm(x, y) { const l = Math.hypot(x, y); return [x / l, y / l]; }

  // deterministic random
  let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;

  // bumpy paper cloud outline, centred on (0,0) baseline
  const cloudD = (w, h, n) => {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const f = i / n, x = -w / 2 + w * f + (i && i < n ? (rnd() - .5) * w / n * .35 : 0);
      const y = (i === 0 || i === n) ? -h * .12 : -h * Math.pow(Math.sin(Math.PI * f), .75) * (.72 + .28 * rnd());
      pts.push([x, y]);
    }
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], r = Math.hypot(x1 - x0, y1 - y0) / 2 * 1.04;
      d += ` A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    }
    // soft bumpy underside
    d += ` Q${(w * .3).toFixed(1)} ${(h * .16).toFixed(1)} 0 ${(h * .1).toFixed(1)} Q${(-w * .3).toFixed(1)} ${(h * .16).toFixed(1)} ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}Z`;
    return d;
  };
  const TONES = {
    far: ["#f4cf8e", "#f9e2b4", "#fcecc9"],
    mid: ["#f0d4a2", "#fbedd2", "#fff8ea"],
    near: ["#ecd0a0", "#fbf0da", "#fffcf4"]
  };
  // two stacked paper layers + a sliver highlight; inner layer gets its own small shadow on the back layer
  const cloud = (x, y, w, h, depth, { n = 6, flip = false, cls = "" } = {}) => {
    const [t0, t1, t2] = TONES[depth], sh = depth === "far" ? "sh1" : depth === "mid" ? "sh2" : "sh3";
    const back = cloudD(w, h, n), front = cloudD(w * .82, h * .8, Math.max(3, n - 1)), top = cloudD(w * .46, h * .55, 3);
    return `<g class="c-cloud ${cls}" transform="translate(${x} ${y})${flip ? " scale(-1 1)" : ""}" filter="url(#${sh})">
      <path d="${back}" fill="${t0}"/>
      <g filter="url(#sh1)"><path d="${front}" transform="translate(${(-w * .04).toFixed(1)} ${(-h * .1).toFixed(1)})" fill="${t1}"/></g>
      <path d="${top}" transform="translate(${(-w * .12).toFixed(1)} ${(-h * .3).toFixed(1)})" fill="${t2}"/>
    </g>`;
  };

  const heart = (x, y, s, c, r = 0) => `<path transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M0 5 C-7 -1 -6 -8 0 -4 C6 -8 7 -1 0 5Z" fill="${c}"/>`;
  // folk flower: petals of dots round a centre
  const flower = (x, y, s, c, cc) => {
    let p = ""; for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; p += `<circle cx="${(x + Math.cos(a) * 5.2 * s).toFixed(1)}" cy="${(y + Math.sin(a) * 5.2 * s).toFixed(1)}" r="${(2.9 * s).toFixed(1)}" fill="${c}"/>`; }
    return p + `<circle cx="${x}" cy="${y}" r="${(2.6 * s).toFixed(1)}" fill="${cc}"/>`;
  };

  /* GALO DE BARCELOS, facing left, body centre (0,0), beak tip at (-124,-118). */
  const rooster = () => {
    const B = "#1d1918", B2 = "#2b2523", B3 = "#120f0e", R = "#e0352b", R2 = "#b5241d", Y = "#f4c033", Y2 = "#d99a1e", BL = "#2f86c9", W = "#fff6e2";
    // tail sickles (behind body)
    const tail = [
      ["M62 -8 C70 -110 140 -190 200 -170 C150 -160 112 -96 104 4Z", B],
      ["M74 0 C96 -90 160 -140 214 -118 C166 -110 128 -60 112 12Z", B2],
      ["M82 6 C112 -60 170 -84 214 -60 C170 -58 136 -26 118 22Z", B],
      ["M56 -14 C52 -100 92 -170 140 -186 C104 -158 88 -96 92 -10Z", B2]
    ].map(([d, c]) => `<path d="${d}" fill="${c}"/>`).join("");
    const tailPaint = `<path d="M112 -132 C134 -158 162 -170 186 -168 C162 -160 140 -146 120 -124Z" fill="${Y}"/>
      <path d="M132 -78 C152 -102 180 -112 204 -110 C180 -104 160 -92 140 -72Z" fill="${R}"/>
      <path d="M140 -38 C160 -56 184 -64 206 -60 C184 -54 166 -44 148 -30Z" fill="${Y}"/>
      ${heart(92, -120, 1.3, R, 20)}${heart(118, -84, 1.1, BL, 30)}${heart(124, -36, 1.1, Y, 40)}
      <circle cx="104" cy="-150" r="3" fill="${W}"/><circle cx="148" cy="-140" r="3" fill="${W}"/><circle cx="168" cy="-92" r="3" fill="${W}"/>`;
    // far wing (behind body), flaps with the near one
    const wingD = "M-30 -24 C4 -48 70 -40 104 2 C84 8 64 20 38 26 C8 30 -30 14 -34 -6Z";
    const legs = `<g class="c-legs">
      <path d="M-14 50 L-20 92 L-38 102 L-12 100 L-4 98 L-8 92 L-2 50Z" fill="${Y2}"/>
      <path d="M14 50 L10 94 L-8 104 L20 102 L26 100 L22 94 L28 50Z" fill="${Y}"/>
      <path d="M-48 100 h96 a6 6 0 0 1 6 6 v10 h-108 v-10 a6 6 0 0 1 6-6z" fill="${R}"/>
      <path d="M-54 112 h108 v6 h-108z" fill="${R2}"/>
      ${flower(-26, 108, .55, Y, W)}${flower(0, 108, .55, W, BL)}${flower(26, 108, .55, Y, W)}
    </g>`;
    const body = `<path d="M-62 -42 C-96 -12 -88 54 -34 66 C20 78 84 62 106 22 C116 2 104 -20 84 -26 C52 -36 20 -30 -8 -40 C-28 -52 -50 -54 -62 -42Z" fill="${B}"/>
      <path d="M-62 -42 C-96 -12 -88 54 -34 66 C-6 72 22 72 46 66 C10 60 -40 40 -56 -4 C-60 -18 -58 -32 -62 -42Z" fill="${B3}" opacity=".55"/>
      ${heart(-58, 6, 1.9, R, -10)}${heart(-34, 38, 1.6, BL, 10)}${heart(-6, 54, 1.3, Y, 0)}
      ${flower(-66, 34, .8, Y, R)}${flower(-30, 12, .7, W, BL)}
      <circle cx="-48" cy="56" r="3.2" fill="${W}"/><circle cx="-74" cy="-14" r="3" fill="${W}"/><circle cx="20" cy="62" r="3" fill="${W}"/>`;
    const head = `<g class="c-head">
      <path d="M-74 -26 C-86 -60 -92 -92 -86 -112 L-46 -122 C-42 -94 -30 -62 -6 -40Z" fill="${B}"/>
      <path d="M-74 -26 C-86 -60 -92 -92 -86 -112 L-74 -114 C-76 -88 -68 -56 -50 -32Z" fill="${B2}"/>
      ${heart(-70, -70, 1.2, Y, -15)}<circle cx="-62" cy="-48" r="3" fill="${W}"/><circle cx="-58" cy="-92" r="2.6" fill="${R}"/>
      <ellipse cx="-70" cy="-122" rx="29" ry="25" fill="${B}"/>
      <path d="M-96 -136 Q-108 -168 -88 -160 Q-88 -188 -70 -168 Q-62 -194 -50 -166 Q-34 -182 -36 -156 Q-24 -156 -40 -138Z" fill="${R}"/>
      <path d="M-96 -136 Q-108 -168 -88 -160 Q-90 -150 -84 -140Z M-70 -168 Q-66 -160 -66 -144 L-58 -144 Q-58 -156 -50 -166Z" fill="${R2}"/>
      <path d="M-93 -108 Q-104 -78 -88 -72 Q-74 -76 -76 -106Z" fill="${R}"/>
      <path d="M-93 -108 Q-104 -78 -88 -72 Q-94 -84 -86 -106Z" fill="${R2}"/>
      <path d="M-94 -128 L-124 -118 L-94 -110Z" fill="${Y}"/><path d="M-94 -118 L-124 -118 L-94 -110Z" fill="${Y2}"/>
      <g class="c-eyeC"><path d="M-82 -127 Q-74 -120 -66 -127 Q-74 -123 -82 -127Z" fill="${W}"/></g>
      <g class="c-eyeO" opacity="0"><circle cx="-74" cy="-127" r="8" fill="${W}"/><circle cx="-76" cy="-127" r="4.2" fill="${B3}"/><circle cx="-77.5" cy="-128.5" r="1.4" fill="#fff"/></g>
    </g>`;
    const wing = `<path d="${wingD}" fill="${B2}"/>
      <path d="M-30 -24 C4 -48 70 -40 104 2 C70 -18 20 -22 -30 -24Z" fill="#3a3330"/>
      ${heart(4, -14, 1.5, R, -20)}${heart(34, -10, 1.4, Y, -10)}${heart(62, -2, 1.3, BL, 0)}
      ${flower(-12, 0, .6, W, R)}
      <path d="M-14 16 q8 9 16 0 q8 9 16 0 q8 9 16 0 q8 9 16 0 q8 9 16 0 q6 7 12 0 l-2 -6 h-88z" fill="${Y}"/>`;
    return `<g class="c-rbody">
      <g filter="url(#sh1)">${tail}${tailPaint}</g>
      <g class="c-wingF" ><path d="${wingD}" fill="${B3}" transform="translate(8 -10)"/></g>
      ${legs}
      ${body}
      ${head}
      <g class="c-wingN" filter="url(#sh1)">${wing}</g>
    </g>`;
  };

  // paper hot-air balloon with a ribbon label
  const balloon = (x, y, s, a, b, txt, cls) => `<g class="c-bal ${cls}" transform="translate(${x} ${y}) scale(${s})"><g class="c-balIn">
    <g filter="url(#sh2)">
      <path d="M-14 72 L-12 104 M14 72 L12 104 M-4 72 L-5 104 M4 72 L5 104" stroke="#6b4a2b" stroke-width="2"/>
      <path d="M-17 102 h34 l-3 26 h-28z" fill="#b0702f"/><path d="M-17 102 h34 v6 h-34z" fill="#8a5424"/><path d="M-15 116 h30 v3 h-30z" fill="#8a5424"/>
      <path d="M0 -122 C68 -122 96 -72 92 -30 C88 12 44 42 24 66 L-24 66 C-44 42 -88 12 -92 -30 C-96 -72 -68 -122 0 -122Z" fill="${a}"/>
      <path d="M0 -122 C30 -122 40 -60 36 -20 C32 22 16 48 10 66 L-10 66 C-16 48 -32 22 -36 -20 C-40 -60 -30 -122 0 -122Z" fill="${b}"/>
      <path d="M0 -122 C68 -122 96 -72 92 -30 C88 12 44 42 24 66 L10 66 C16 48 32 22 36 -20 C40 -60 30 -122 0 -122Z" fill="#000" opacity=".1"/>
      <path d="M-56 -88 C-70 -64 -72 -40 -66 -18 C-80 -42 -76 -70 -56 -88Z" fill="#fff" opacity=".35"/>
      <path d="M-26 66 h52 v10 h-52z" fill="${b}"/>
    </g>
    <g filter="url(#sh1)"><path d="M-104 -46 h208 l-10 14 l10 14 h-208 l10 -14z" fill="#fff6e2"/><path d="M-104 -18 h208 v-4 h-208z" fill="#e8d6b4"/>
    <text x="0" y="-25" text-anchor="middle" font-family="Archivo Black, Arial Black, Arial" font-size="19" letter-spacing="1" fill="#2b1a12">${txt}</text></g>
  </g></g>`;

  // the sad deflated checkout.liquid balloon
  const deflated = (x, y, s) => `<g class="c-defl" transform="translate(${x} ${y}) scale(${s})"><g class="c-deflIn" filter="url(#sh2)">
    <path d="M-6 30 L-8 74 M6 30 L8 74" stroke="#6b6b70" stroke-width="2"/>
    <path d="M-14 72 h28 l-2 20 h-24z" fill="#8a8a8e"/>
    <path d="M-10 -70 C30 -84 46 -54 34 -40 L46 -28 C40 -8 30 4 26 14 L34 24 C22 30 10 32 6 34 L-6 34 C-18 26 -30 22 -34 12 L-24 4 C-40 -6 -44 -22 -38 -34 L-48 -44 C-40 -66 -26 -72 -10 -70Z" fill="#a3a3a7"/>
    <path d="M-10 -70 C30 -84 46 -54 34 -40 L46 -28 C40 -8 30 4 26 14 L34 24 C22 30 10 32 6 34 L0 34 C6 10 12 -30 -10 -70Z" fill="#88888c"/>
    <path d="M-26 -30 l16 -4 l3 14 l-16 4z" fill="#c4c4c8"/>
    <g transform="translate(10 96) rotate(8)"><path d="M0 0 v10" stroke="#6b6b70" stroke-width="1.5"/><path d="M-62 10 h124 v24 h-124z" fill="#f3ead8"/>
    <text x="0" y="27" text-anchor="middle" font-family="Archivo Black, Arial Black, Arial" font-size="13" fill="#6b6b70">checkout.liquid</text></g>
  </g></g>`;

  // distant Lisbon on its hills: Castelo de São Jorge, Sé towers, a dome, red roofs, azulejo facade, yellow tram 28
  const lisbon = (mx) => {
    const P1 = "#f0c98a", P2 = "#eab873", P3 = "#e3a95f";
    let s = `<g class="c-lisbon" filter="url(#sh1)">`;
    // back hill + castle
    s += `<path d="M-200 1200 L-200 760 Q120 700 360 712 Q520 640 700 646 Q900 652 1040 700 Q1260 690 1640 740 L1640 1200Z" fill="${P1}"/>`;
    const cx = mx(660);
    s += `<g transform="translate(${cx} 600)"><path d="M-90 52 v-52 h12 v-10 h10 v10 h12 v-10 h10 v10 h12 v-10 h10 v10 h12 v-24 h10 v-10 h10 v10 h10 v-10 h10 v10 h4 v34 h12 v-10 h10 v10 h12 v-10 h10 v10 h4 v52z" fill="${P3}"/>
      <path d="M-56 52 v-20 a8 8 0 0 1 16 0 v20z M20 52 v-14 a6 6 0 0 1 12 0 v14z" fill="${P1}"/>
      <path d="M-8 -28 v-30 h3 v30z" fill="${P3}"/><path d="M-5 -58 l26 7 l-26 7z" fill="#e2463a"/></g>`;
    // Sé cathedral twin towers + dome
    const sx = mx(930);
    s += `<g transform="translate(${sx} 640)"><path d="M-60 60 v-70 h-6 v-10 h8 v-6 h6 v6 h6 v-6 h6 v6 h8 v10 h-6 v40 h60 v-40 h-6 v-10 h8 v-6 h6 v6 h6 v-6 h6 v6 h8 v10 h-6 v70z" fill="${P3}"/>
      <circle cx="0" cy="-12" r="11" fill="${P1}"/><path d="M-8 60 v-26 a8 8 0 0 1 16 0 v26z" fill="${P1}"/></g>`;
    const dx = mx(1200);
    s += `<g transform="translate(${dx} 660)"><path d="M-50 60 v-40 h12 a38 38 0 0 1 76 0 h12 v40z" fill="${P2}"/><path d="M-4 -18 v-22 h8 v22z" fill="${P2}"/><circle cx="0" cy="-44" r="6" fill="${P2}"/></g>`;
    s += `</g>`;
    // front rooftops (warmer), with terracotta roofs and one azulejo-tiled facade
    s += `<g filter="url(#sh2)"><path d="M-200 1200 L-200 800 Q300 760 720 770 Q1100 762 1640 800 L1640 1200Z" fill="${P2}"/>`;
    let x = mx(240); const step = 64 * Math.max(.7, (mx(1000) - mx(440)) / 560);
    for (let i = 0; i < 14; i++) {
      const w = step * (.8 + .4 * rnd()), h = 40 + 46 * rnd(), y = 790 - h + 10 * Math.sin(i);
      const wall = ["#fff1d8", "#f7dcae", "#f9e6c4", "#f3d29b"][i % 4];
      s += `<path d="M${x.toFixed(0)} 1200 V${(y).toFixed(0)} h${w.toFixed(0)} V1200z" fill="${wall}"/>`;
      s += `<path d="M${(x - 4).toFixed(0)} ${y.toFixed(0)} L${(x + w / 2).toFixed(0)} ${(y - 16).toFixed(0)} L${(x + w + 4).toFixed(0)} ${y.toFixed(0)}z" fill="${i % 3 ? "#d0663a" : "#b9532b"}"/>`;
      if (i === 5) { // azulejo facade: blue/white tiles
        let t = ""; for (let r = 0; r < 6; r++) for (let c = 0; c < Math.floor(w / 12); c++) {
          const tx = x + 4 + c * 12, ty = y + 8 + r * 12;
          t += `<rect x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" width="10" height="10" fill="${(r + c) % 2 ? "#3f7fc0" : "#dfeaf6"}"/><circle cx="${(tx + 5).toFixed(1)}" cy="${(ty + 5).toFixed(1)}" r="2.2" fill="${(r + c) % 2 ? "#dfeaf6" : "#3f7fc0"}"/>`;
        }
        s += t;
      } else {
        for (let k = 0; k < 2; k++) s += `<rect x="${(x + w * (.22 + k * .36)).toFixed(0)}" y="${(y + 14).toFixed(0)}" width="${(w * .16).toFixed(0)}" height="18" fill="#c98f4c" opacity=".55"/>`;
      }
      x += w + 2;
    }
    s += `<path d="M-200 1200 L-200 828 Q400 818 720 826 Q1100 832 1640 824 L1640 1200Z" fill="${P3}"/></g>`;
    // tram on its rail in front
    s += `<g filter="url(#sh2)"><path d="M-200 846 H1640" stroke="#b5874f" stroke-width="3"/>
      <g class="c-tram" transform="translate(${mx(380)} 846)">
        <path d="M-6 -82 h4 l14 -14 M2 -82 l-10 -14" stroke="#4b3a2a" stroke-width="2.5" fill="none"/>
        <path d="M-58 -10 v-56 q0-14 14-14 h88 q14 0 14 14 v56z" fill="#f2b705"/>
        <path d="M-58 -36 h116 v26 h-116z" fill="#dca10a"/>
        <path d="M-58 -16 h116 v6 h-116z" fill="#fff6e2"/>
        <path d="M-50 -70 h20 v22 h-20z M-24 -70 h20 v22 h-20z M2 -70 h20 v22 h-20z M28 -70 h20 v22 h-20z" fill="#fff1c4"/>
        <text x="0" y="-21" text-anchor="middle" font-family="Archivo Black, Arial Black, Arial" font-size="12" fill="#8a5a08">28</text>
        <circle cx="-34" cy="-6" r="7" fill="#3b2c22"/><circle cx="34" cy="-6" r="7" fill="#3b2c22"/>
      </g></g>`;
    return s;
  };

  SCENES.push({
    id: "clouds", order: 30, height: 260, bg: "#e9a03a", headerTone: "light",
    nav: { label: "Shopify Plus", href: "../shopify-plus.html" },
    html: (K) => {
      sd = 11; L = layout(); const { mx, E, u, R, rs, bs, L1 } = L;
      // sky: paper bands hanging from the top, darkest drawn last so each casts its shadow on the paler one below
      const bands = [[880, "#fae7bf"], [700, "#f7dba5"], [520, "#f4cc87"], [350, "#f0bb67"], [190, "#eca94b"]];
      const sky = `<rect width="1440" height="900" fill="#fcefd2"/>` + bands.map(([y, c], i) => {
        let d = `M-40 -40 H1480 V${y}`; const n = 9;
        for (let k = n; k > 0; k--) { const x0 = 1480 - (1520 / n) * (n - k), x1 = x0 - 1520 / n, r = 1520 / n / 2 * 1.6; d += ` A${r.toFixed(0)} ${r.toFixed(0)} 0 0 1 ${x1.toFixed(0)} ${(y + ((k + i) % 2 ? 6 : -4)).toFixed(0)}`; }
        return `<path d="${d}Z" fill="${c}" filter="url(#sh1)"/>`;
      }).join("");
      // sun
      const sx = L.narrow ? 860 : 1220, sy = L.narrow ? 120 : 150;
      let rays = ""; for (let i = 0; i < 16; i++) rays += `<path d="M-9 -96 L0 -132 L9 -96Z" fill="${i % 2 ? "#ffe3a0" : "#ffd27a"}" transform="rotate(${i * 22.5})"/>`;
      const sun = `<g class="c-par" data-d="60"><g transform="translate(${sx} ${sy})"><g class="c-rays" filter="url(#sh1)">${rays}</g>
        <g filter="url(#sh2)"><circle r="82" fill="#ffe7ae"/><circle r="66" cx="-6" cy="-6" fill="#fff3d0"/><circle r="30" cx="-26" cy="-26" fill="#fffaea"/></g></g></g>`;
      // far clouds + skyline
      const far = [[160, 300, 260, 90], [520, 200, 220, 70], [980, 330, 300, 90], [1340, 400, 240, 80], [700, 470, 260, 80], [300, 560, 300, 90]]
        .map(([x, y, w, h], i) => cloud(mx(x), y, w, h, "far", { n: 5, flip: i % 2 })).join("");
      // balloons
      const bals = L.narrow
        ? [[600, 520, .42, "#e2463a", "#fff6e2", "CHECKOUT", "b1"], [870, 330, .34, "#3fa0d8", "#fff6e2", "FUNCTIONS", "b2"], [560, 860, .44, "#e9a03a", "#c97a3a", "B2B", "b3"], [860, 1000, .4, "#7cc243", "#fff6e2", "MARKETS", "b4"]]
        : [[250, 360, .7, "#e2463a", "#fff6e2", "CHECKOUT", "b1"], [1330, 250, .5, "#3fa0d8", "#fff6e2", "FUNCTIONS", "b2"], [640, 880, .62, "#e9a03a", "#c97a3a", "B2B", "b3"], [1290, 980, .58, "#7cc243", "#fff6e2", "MARKETS", "b4"]];
      const balloons = bals.map(b => balloon(...b)).join("");
      // mid clouds (decor) — rooster cloud built separately
      const mid = (L.narrow ? [[560, 420, 240, 80], [900, 820, 300, 100], [520, 980, 280, 90]] : [[120, 470, 340, 110], [600, 600, 320, 100], [1380, 760, 320, 100], [300, 980, 380, 120], [880, 1060, 340, 110]])
        .map(([x, y, w, h], i) => cloud(x, y, w, h, "mid", { n: 6, flip: i % 2 })).join("");
      const near = (L.narrow ? [[470, 960, 380, 130], [960, 1180, 420, 140], [560, 1420, 460, 150]] : [[-20, 940, 560, 180], [1480, 1020, 600, 190], [700, 1300, 620, 200], [200, 1560, 600, 190], [1250, 1600, 640, 200]])
        .map(([x, y, w, h], i) => cloud(x, y, w, h, "near", { n: 7, flip: i % 2 })).join("");
      // pulley line: comes from off-screen up-left, wraps a pinned pulley wheel, leaves off to the right
      const S = [E[0] + u[0] * 1600, E[1] + u[1] * 1600];
      const rope = `<g filter="url(#sh1)"><path d="M${S[0].toFixed(0)} ${S[1].toFixed(0)} L${E[0]} ${E[1] - 30} M${E[0] + 30} ${E[1]} L1600 ${(E[1] - 300).toFixed(0)}" stroke="#fff3dc" stroke-width="3.5" stroke-linecap="round"/></g>`;
      let spokes = ""; for (let i = 0; i < 5; i++) spokes += `<path d="M-4 0 L-3 -24 L3 -24 L4 0Z" fill="#b5652c" transform="rotate(${i * 72})"/>`;
      const pulley = `<g transform="translate(${E[0]} ${E[1]})"><g filter="url(#sh2)"><circle r="40" fill="#8a4418"/><circle r="34" fill="#c97a3a"/><circle r="28" fill="#a85d22"/><g class="c-pwheel">${spokes}</g><circle r="12" fill="#e0904a"/></g>
        <g filter="url(#sh2)"><circle r="9" fill="#f2efe9"/><circle r="5" fill="#c46a1f"/></g></g>`;
      // trolley + hanging bottle A
      const ang = Math.atan2(u[1], u[0]) * 180 / Math.PI + 180;
      const trolley = `<g class="c-trolley"><g transform="rotate(${ang.toFixed(1)})" filter="url(#sh2)"><path d="M-14 -4 h28 l-6 22 h-16z" fill="#8a4418"/><g class="c-twheel" transform="translate(0 -14)"><circle r="15" fill="#c97a3a"/><circle r="10" fill="#a85d22"/><path d="M-2 -10 h4 v20 h-4z" fill="#e0904a"/><circle r="4" fill="#e0904a"/></g></g>
        <g class="c-hangA" filter="url(#sh3)">${K.string(0, 14, 0, L1)}${K.bottle(0, L1, { s: bs })}</g></g>`;
      // rooster cloud (back), rooster carry group, front lip
      const rc = `${cloud(R[0] + 20, R[1] + 96, 440 * (L.narrow ? .7 : 1), 130 * (L.narrow ? .8 : 1), "mid", { n: 7 })}`;
      const lip = `${cloud(R[0] - 10, R[1] + 104, 300 * (L.narrow ? .66 : 1), 62 * (L.narrow ? .7 : 1), "near", { n: 5, cls: "c-lip" })}`;
      const zzz = `<g class="c-zzz" transform="translate(-110 -190)">${[0, 1, 2].map(i => `<g class="c-z" filter="url(#sh1)"><text font-family="Archivo Black, Arial Black, Arial" font-size="${30 + i * 6}" fill="#fff6e2">Z</text></g>`).join("")}</g>`;
      const bang = `<g class="c-bang" transform="translate(-10 -250)" filter="url(#sh2)"><path d="M-10 -60 h20 l-4 46 h-12z" fill="#e2463a"/><circle cy="0" r="9" fill="#e2463a"/></g>`;
      const bubble = `<g class="c-bubble" transform="translate(-70 -268)" filter="url(#sh2)"><path d="M-130 -42 q0-20 20-20 h220 q20 0 20 20 v54 q0 20-20 20 h-120 l-40 34 l6-34 h-66 q-20 0-20-20z" fill="#fffaf0"/>
        <path d="M-130 4 v8 q0 20 20 20 h66 l-2 12 z" fill="#f0dcb8"/>
        <text x="0" y="-5" text-anchor="middle" font-family="Archivo Black, Arial Black, Arial" font-size="38" fill="#2b1a12">Cocorocó!</text></g>`;
      const carry = `<g class="c-carry"><g class="c-hangB" filter="url(#sh3)"><g class="c-dropB">${K.string(0, 0, 0, L1 - 14)}${K.bottle(0, L1 - 14, { s: bs })}</g></g>
        <g class="c-tilt"><g class="c-flip"><g transform="scale(${rs}) translate(124 118)"><g class="c-bob"><g filter="url(#sh3)">${rooster()}</g>${zzz}${bang}${bubble}</g></g></g></g></g>`;
      return K.svg(`
        ${sky}
        <g class="c-par" data-d="90">${far}</g>
        ${sun}
        <g class="c-par" data-d="120"><g transform="translate(0 40)">${lisbon(mx)}</g></g>
        <g class="c-defl-wrap">${deflated(L.narrow ? 640 : 470, L.narrow ? 260 : 200, L.narrow ? .6 : .85)}</g>
        <g class="c-par" data-d="420">${balloons}</g>
        <g class="c-par" data-d="300">${mid}</g>
        ${rope}${pulley}
        ${rc}
        ${carry}
        ${lip}
        ${trolley}
        <g class="c-par" data-d="140">${L.narrow ? cloud(700, 800, 560, 210, "near", { n: 8 }) : cloud(330, 760, 760, 220, "near", { n: 9 })}</g>
        <g class="c-par" data-d="760">${near}</g>`) +
        K.label({ title: "Shopify Plus", href: "../shopify-plus.html", text: "Checkout extensions, Functions, B2B and Markets. Upgrade-safe, no checkout.liquid hangovers.", left: L.label.left, top: L.label.top, color: "#2b1a12", sub: "#5a3a22" }) +
        `<style>
          #clouds .kb-label { max-width: 42vw; }
          #clouds .c-bubble, #clouds .c-bang { visibility: hidden; }
          @media (max-width: 800px) { #clouds .kb-label { max-width: 88vw; font-size: 40px; } #clouds .kb-label small { max-width: 20em; } }
        </style>`;
    },
    init: (stage, K, st) => {
      const q = s => stage.querySelector(s), qa = s => stage.querySelectorAll(s);
      const { E, u, R, rs, L1, fly, exit } = L;
      const trolley = q(".c-trolley"), hangA = q(".c-hangA"), hangB = q(".c-hangB"), dropB = q(".c-dropB"), carry = q(".c-carry");
      const tilt = q(".c-tilt"), flip = q(".c-flip"), bob = q(".c-bob"), head = q(".c-head"), wingN = q(".c-wingN"), wingF = q(".c-wingF");
      const T = [E[0] + u[0] * 62, E[1] + u[1] * 62];               // trolley rest spot just before the pulley
      const hangLen = L1 + 396 * L.bs;
      const startD = (T[1] + hangLen + 60) / -u[1];                 // far enough up the line that the bottle starts above the top edge
      const T0 = [T[0] + u[0] * startD, T[1] + u[1] * startD];
      const G = [T[0], T[1] + 14];                                  // where the beak grabs the string
      const sit = [R[0] - rs * 124, R[1] - rs * 118];                // carry origin (beak) while sitting
      const paths = [[sit, [sit[0] + 10, sit[1] - 120], [G[0] + 60, G[1] - 60], G], [G, ...fly], [fly[fly.length - 1], ...exit]];
      // catmull-rom through pts, returns [x,y,dx,dy]
      const cr = (P, t) => {
        const n = P.length - 1, f = Math.min(n - 1e-6, Math.max(0, t * n)), i = Math.floor(f), s = f - i;
        const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(n, i + 2)];
        const c = k => .5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * s + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * s * s + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * s * s * s);
        const d = k => .5 * ((-p0[k] + p2[k]) + 2 * (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * s + 3 * (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * s * s);
        return [c(0), c(1), d(0), d(1)];
      };
      const P = { v: 0, flap: 0, face: 1 };
      const place = () => {
        const seg = Math.min(2, Math.floor(P.v)), [x, y, dx, dy] = cr(paths[seg], P.v - seg);
        gsap.set(carry, { x, y });
        if (P.v <= 0.001) { gsap.set(tilt, { rotation: 0 }); gsap.set(flip, { scaleX: 1 }); return; }
        const sp = Math.hypot(dx, dy) || 1;
        if (dx > sp * .25) P.face = -1; else if (dx < -sp * .25) P.face = 1;   // hysteresis so he doesn't flicker
        const a = P.face > 0 ? Math.atan2(-dy, -dx) : -Math.atan2(-dy, dx);
        gsap.set(tilt, { rotation: gsap.utils.clamp(-28, 28, a * 180 / Math.PI * .6), svgOrigin: "0 0" });
        gsap.set(flip, { scaleX: P.face, svgOrigin: "0 0" });
      };
      gsap.set(trolley, { x: T0[0], y: T0[1] }); gsap.set(hangB, { autoAlpha: 0 }); place();
      gsap.set(head, { rotation: -24, svgOrigin: "-40 -40" });
      // parallax groups
      const pars = [...qa(".c-par")];

      if (K.reduced) { // calm final picture: rooster awake on his cloud, bottle hanging from the pulley
        gsap.set(trolley, { x: T[0], y: T[1] }); gsap.set(head, { rotation: 0 });
        gsap.set(q(".c-zzz"), { autoAlpha: 0 }); gsap.set(q(".c-eyeC"), { opacity: 0 }); gsap.set(q(".c-eyeO"), { opacity: 1 });
        return;
      }

      /* idle life */
      gsap.to(q(".c-rays"), { rotation: 360, svgOrigin: "0 0", duration: 80, repeat: -1, ease: "none" });
      qa(".c-balIn").forEach((b, i) => gsap.to(b, { rotation: i % 2 ? 3 : -3, y: -10, svgOrigin: "0 -120", duration: 2.6 + i * .5, yoyo: true, repeat: -1, ease: "sine.inOut" }));
      gsap.to(q(".c-deflIn"), { rotation: 8, svgOrigin: "0 -70", duration: 1.7, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(q(".c-rbody"), { scaleY: 1.025, svgOrigin: "0 60", duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
      qa(".c-z").forEach((z, i) => gsap.fromTo(z, { x: 0, y: 0, opacity: 0, scale: .6 }, { x: -50 - i * 6, y: -90, opacity: 1, scale: 1.1, duration: 3, delay: i, repeat: -1, ease: "sine.out",
        keyframes: { opacity: [0, 1, 1, 0] } }));
      qa(".c-cloud").forEach((c, i) => gsap.to(c, { x: "+=" + (i % 2 ? 8 : -8), duration: 4 + (i % 5), yoyo: true, repeat: -1, ease: "sine.inOut" }));
      gsap.to(q(".c-tram"), { x: "+=" + (L.narrow ? 260 : 700), duration: 26, yoyo: true, repeat: -1, ease: "sine.inOut" });

      /* the scrubbed story (duration 1 = whole section) */
      const tl = gsap.timeline({ scrollTrigger: { ...st, scrub: 1 }, defaults: { ease: "none" } });
      pars.forEach(p => tl.to(p, { y: -(+p.dataset.d), duration: 1 }, 0));
      tl.to(q(".c-defl-wrap"), { y: 760, x: L.narrow ? -40 : -120, rotation: -12, svgOrigin: "470 200", duration: 1, ease: "power1.in" }, 0)
        .from(q(".kb-label"), { y: 60, autoAlpha: 0, duration: .1, ease: "power2.out" }, .04)
        // zip down the line
        .to(trolley, { x: T[0], y: T[1], duration: .27, ease: "power2.in" }, 0)
        .to(q(".c-twheel"), { rotation: 1080, svgOrigin: "0 0", duration: .27, ease: "power2.in" }, 0)
        .to(q(".c-pwheel"), { rotation: 300, svgOrigin: "0 0", duration: .27, ease: "power2.in" }, 0)
        .to(trolley, { x: T[0] - u[0] * -14, y: T[1] - u[1] * -14, duration: .03, ease: "power1.out" }, .27)
        // bonk: wake up
        .to(q(".c-zzz"), { autoAlpha: 0, duration: .02 }, .29)
        .set(q(".c-eyeC"), { opacity: 0 }, .3).set(q(".c-eyeO"), { opacity: 1 }, .3)
        .to(head, { rotation: 6, duration: .03, ease: "back.out(3)" }, .3)
        .to(bob, { y: -16, duration: .02, ease: "power2.out" }, .3).to(bob, { y: 0, duration: .03, ease: "bounce.out" }, .32)
        .fromTo(q(".c-bang"), { autoAlpha: 0, scale: .2, svgOrigin: "-10 -250" }, { autoAlpha: 1, scale: 1, duration: .03, ease: "back.out(3)" }, .3)
        .to(q(".c-bang"), { autoAlpha: 0, duration: .02 }, .37)
        // crow
        .to(head, { rotation: 16, duration: .03, ease: "power2.out" }, .38)
        .fromTo(q(".c-bubble"), { autoAlpha: 0, scale: .3, svgOrigin: "-120 -200" }, { autoAlpha: 1, scale: 1, duration: .04, ease: "back.out(2.5)" }, .385)
        .to(q(".c-bubble"), { autoAlpha: 0, scale: .6, duration: .03 }, .46)
        .to(head, { rotation: 0, duration: .03 }, .46)
        // take off, grab, fly, drop
        .to(P, { flap: 1, duration: .03 }, .46)
        .to(P, { v: 1, duration: .1, ease: "sine.inOut", onUpdate: place }, .48)
        .set(hangA, { autoAlpha: 0 }, .58).set(hangB, { autoAlpha: 1 }, .58)
        .to(P, { v: 2, duration: .24, ease: "sine.inOut", onUpdate: place }, .59)
        .to(dropB, { y: 1250, rotation: 20, svgOrigin: `0 ${L1}`, duration: .17, ease: "power2.in" }, .83)
        .to(P, { v: 3, duration: .17, ease: "power1.in", onUpdate: place }, .83)
        .to(trolley, { x: T0[0], y: T0[1], duration: .3, ease: "power1.in" }, .66); // empty trolley gets hauled back up

      /* ticker: wing flaps + pendulum physics on whichever bottle is hanging */
      let th = 0, om = 0, ph = 0, prev = null, pv = [0, 0], active = null;
      const gpx = 5200, len = 250;
      gsap.ticker.add((time, dms) => {
        const dt = Math.min(.05, Math.max(.001, dms / 1000));
        ph += dt * 15;
        const f = P.flap, a = f * (-38 + 42 * Math.sin(ph));
        wingN.setAttribute("transform", `rotate(${a.toFixed(2)} -24 -22)`);
        wingF.setAttribute("transform", `rotate(${(a * 1.15 - 4 * f).toFixed(2)} -16 -30)`);
        q(".c-legs").setAttribute("transform", `rotate(${(f * 28).toFixed(1)} 0 50)`);
        const grabbed = tl.time() >= .58, el = grabbed ? hangB : hangA;
        const px = grabbed ? gsap.getProperty(carry, "x") : gsap.getProperty(trolley, "x"), py = grabbed ? gsap.getProperty(carry, "y") : gsap.getProperty(trolley, "y");
        if (el !== active || !prev) { prev = [px, py]; pv = [0, 0]; active = el; }
        const v = [(px - prev[0]) / dt, (py - prev[1]) / dt], ac = [(v[0] - pv[0]) / dt, (v[1] - pv[1]) / dt];
        prev = [px, py]; pv = [v[0] * .7 + pv[0] * .3, v[1] * .7 + pv[1] * .3];
        const ax = gsap.utils.clamp(-30000, 30000, ac[0]), g = Math.max(gpx * .25, gpx - ac[1] * .5);
        const damp = grabbed && tl.time() > .83 ? 12 : 1.5;
        om += (-(g / len) * Math.sin(th) + (ax / len) * .35 * Math.cos(th) - damp * om) * dt;
        th = gsap.utils.clamp(-.75, .75, th + om * dt);
        el.setAttribute("transform", `rotate(${(th * 180 / Math.PI).toFixed(2)})`);
        if (f > .01) bob.setAttribute("transform", `translate(0 ${(f * 6 * Math.cos(ph)).toFixed(2)})`);
      });
    }
  });
})();
