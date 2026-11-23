/* 20 · TANKS — "Custom Themes". A row of folded-paper fermentation tanks on a charcoal brewery wall.
   The Figma "recipe" is pinned on the wall. The bottle drops in from above, tank 1's hatch swallows it,
   it is seen through each porthole while copper transfer pipes pulse it from FIGMA → SECTIONS → BLOCKS,
   gauges swing, sight tubes fill, status lamps light, and tank 3's chute pops it out the bottom. */
SCENES.push({
  id: "tanks", order: 20, height: 220, bg: "#58585b", headerTone: "light",
  nav: { label: "Custom Themes", href: "../themes.html" },
  html: (K) => {
    const CX = [640, 900, 1160], NAMES = ["FIGMA", "SECTIONS", "BLOCKS"];
    const W = 200, T = 230, B = 560, CB = 680, FLOOR = 790;
    const f = (n) => +n.toFixed(1);
    // rounded orthogonal pipe path
    const rpath = (pts, r = 22) => {
      let d = `M${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length - 1; i++) {
        const [ax, ay] = pts[i - 1], [bx, by] = pts[i], [cx, cy] = pts[i + 1];
        const l1 = Math.hypot(bx - ax, by - ay), l2 = Math.hypot(cx - bx, cy - by), rr = Math.min(r, l1 / 2, l2 / 2);
        const p = [bx - (bx - ax) / l1 * rr, by - (by - ay) / l1 * rr], q = [bx + (cx - bx) / l2 * rr, by + (cy - by) / l2 * rr];
        d += ` L${f(p[0])} ${f(p[1])} Q${bx} ${by} ${f(q[0])} ${f(q[1])}`;
      }
      const e = pts[pts.length - 1]; return d + ` L${e[0]} ${e[1]}`;
    };
    const copperPipe = (d, w = 18) => `<path d="${d}" fill="none" stroke="#c4773a" stroke-width="${w}" stroke-linejoin="round"/>
      <path d="${d}" fill="none" stroke="#93501f" stroke-width="${w * .32}" stroke-linejoin="round" transform="translate(${w * .26} ${w * .26})"/>
      <path d="${d}" fill="none" stroke="#e8a265" stroke-width="${w * .2}" stroke-linejoin="round" transform="translate(${-w * .24} ${-w * .24})"/>`;
    const rivet = (x, y) => `<circle cx="${x}" cy="${y + .8}" r="2.6" fill="#4d4d52"/><circle cx="${x}" cy="${y}" r="2.3" fill="#a9a9af"/>`;
    const tones = ["#727278", "#84848a", "#8e8e94", "#828288", "#76767c", "#69696f", "#5c5c61"];
    const conet = ["#66666c", "#76767c", "#7e7e84", "#727278", "#68686e", "#5d5d62", "#525257"];

    // ---------- one tank ----------
    const legs = (cx) => {
      const x0 = cx - W / 2, x1 = cx + W / 2;
      const leg = (x, c1, c2) => `<rect x="${x - 8}" y="${B - 40}" width="16" height="${FLOOR - B + 38}" fill="${c1}"/><rect x="${x - 8}" y="${B - 40}" width="5" height="${FLOOR - B + 38}" fill="${c2}"/>
        <rect x="${x - 18}" y="${FLOOR - 4}" width="36" height="9" fill="#3e3e42"/><rect x="${x - 18}" y="${FLOOR - 4}" width="36" height="3" fill="#6a6a70"/>`;
      return `<g filter="url(#sh1)">${leg(cx, "#4b4b50", "#56565b")}
        <path d="M${x0 + 16} ${FLOOR - 60} L${cx} ${FLOOR - 110} L${x1 - 16} ${FLOOR - 60} L${x1 - 16} ${FLOOR - 52} L${cx} ${FLOOR - 102} L${x0 + 16} ${FLOOR - 52}Z" fill="#48484c"/>
        ${leg(x0 + 16, "#606066", "#77777d")}${leg(x1 - 16, "#55555a", "#66666c")}</g>`;
    };
    const tank = (i) => {
      const cx = CX[i], x0 = cx - W / 2, x1 = cx + W / 2, n = tones.length, bw = W / n;
      const sil = `M${x0} ${T} C${x0} ${T - 70} ${x1} ${T - 70} ${x1} ${T} L${x1} ${B} L${cx + 15} ${CB} L${cx - 15} ${CB} L${x0} ${B}Z`;
      let bands = "", cone = "", rv = "", dimples = "";
      for (let k = 0; k < n; k++) {
        bands += `<rect x="${f(x0 + k * bw)}" y="150" width="${f(bw + .6)}" height="${B - 150}" fill="${tones[k]}"/>`;
        cone += `<path d="M${f(x0 + k * bw)} ${B} L${f(x0 + (k + 1) * bw + .6)} ${B} L${f(cx - 15 + (k + 1) * 30 / n)} ${CB} L${f(cx - 15 + k * 30 / n)} ${CB}Z" fill="${conet[k]}"/>`;
      }
      for (let x = x0 + 12; x < x1 - 4; x += 22) rv += rivet(f(x), T + 8) + rivet(f(x), B - 8);
      for (let r = 0; r < 3; r++) for (let x = x0 + 14 + (r % 2) * 10; x < x1 - 6; x += 20) {
        const y = 474 + r * 20;
        dimples += `<circle cx="${x + 1}" cy="${y + 1.4}" r="3.4" fill="rgba(0,0,0,.2)"/><circle cx="${x}" cy="${y}" r="3" fill="rgba(255,255,255,.1)"/>`;
      }
      const py = 322; // porthole
      const top = i === 0
        ? `<g class="t-hatch"><rect x="${cx - 31}" y="164" width="62" height="20" fill="#8a8a90"/><rect x="${cx + 8}" y="164" width="23" height="20" fill="#6d6d73"/><rect x="${cx - 31}" y="164" width="62" height="4" fill="#a5a5ab"/>
           <rect x="${cx - 26}" y="166" width="52" height="5" fill="#1f1d1c"/>
           <g id="t-lid"><rect x="${cx - 37}" y="156" width="74" height="11" fill="#a3a3a9"/><rect x="${cx - 37}" y="163" width="74" height="4" fill="#77777d"/><rect x="${cx - 12}" y="150" width="24" height="6" fill="#5c5c61"/><circle cx="${cx + 37}" cy="162" r="5" fill="#4f4f54"/></g></g>`
        : `<rect x="${cx - 20}" y="170" width="40" height="12" fill="#8a8a90"/><rect x="${cx}" y="170" width="20" height="12" fill="#6d6d73"/>`;
      const chute = i === 2
        ? `<rect x="${cx - 22}" y="${CB - 4}" width="44" height="28" fill="#7c7c82"/><rect x="${cx + 4}" y="${CB - 4}" width="18" height="28" fill="#606066"/>
           <rect x="${cx - 30}" y="${CB + 22}" width="60" height="8" fill="#8f8f95"/><rect x="${cx - 30}" y="${CB + 27}" width="60" height="3" fill="#56565b"/>
           <g id="t-flap"><rect x="${cx - 26}" y="${CB + 30}" width="52" height="7" fill="#a3a3a9"/><rect x="${cx - 26}" y="${CB + 34}" width="52" height="3" fill="#6d6d73"/></g>`
        : `<rect x="${cx - 12}" y="${CB - 4}" width="24" height="26" fill="#7c7c82"/><rect x="${cx + 2}" y="${CB - 4}" width="10" height="26" fill="#606066"/><rect x="${cx - 18}" y="${CB + 18}" width="36" height="7" fill="#8f8f95"/>`;
      return `<g class="t-tank" data-i="${i}">
        <g filter="url(#sh2)">
          <clipPath id="t-clip${i}"><path d="${sil}"/></clipPath>
          <g clip-path="url(#t-clip${i})">${bands}${cone}
            <path d="M${x0} ${T + 2} C${x0} ${T - 68} ${x1} ${T - 68} ${x1} ${T + 2}Z" fill="rgba(255,255,255,.07)"/>
            <rect x="${x0}" y="${T - 1}" width="${W}" height="4" fill="rgba(0,0,0,.18)"/><rect x="${x0}" y="${B - 2}" width="${W}" height="4" fill="rgba(0,0,0,.22)"/>
            <rect x="${x0}" y="460" width="${W}" height="72" fill="rgba(0,0,0,.09)"/><rect x="${x0}" y="460" width="${W}" height="3" fill="rgba(255,255,255,.12)"/><rect x="${x0}" y="530" width="${W}" height="3" fill="rgba(0,0,0,.18)"/>
            ${dimples}${rv}
            <path d="M${x0} 150 L${x0 + 6} 150 L${x0 + 6} ${B} L${x0} ${B}Z" fill="rgba(255,255,255,.06)"/>
          </g>
          ${top}
          <rect x="${cx - 56}" y="174" width="10" height="38" fill="#8f8f95"/><rect x="${cx - 51}" y="174" width="5" height="38" fill="#6d6d73"/><rect x="${cx - 61}" y="168" width="20" height="7" fill="#a5a5ab"/>
          ${chute}
          <!-- sight tube -->
          <rect x="${x0 + 12}" y="250" width="14" height="10" fill="#c99a3e"/><rect x="${x0 + 12}" y="${B - 30}" width="14" height="10" fill="#c99a3e"/>
          <rect x="${x0 + 14}" y="260" width="10" height="${B - 290}" fill="#2c2a29"/>
          <rect class="t-level" x="${x0 + 15}" y="260" width="8" height="${B - 290}" fill="#e9a03a"/>
          <rect x="${x0 + 15}" y="262" width="2" height="${B - 294}" fill="rgba(255,255,255,.35)"/>
          <!-- status lamp -->
          <rect x="${cx + 52}" y="198" width="16" height="8" fill="#4f4f54"/><circle class="t-glowdot" cx="${cx + 60}" cy="194" r="15" fill="#ffd36b" opacity="0"/><circle class="t-lamp" cx="${cx + 60}" cy="194" r="7" fill="#6b2b25"/>
          <!-- porthole -->
          <g class="t-port">
            <circle cx="${cx}" cy="${py + 1.5}" r="41" fill="#7d5d1f"/><circle cx="${cx}" cy="${py}" r="40" fill="#c99a3e"/><path d="M${cx - 40} ${py} A40 40 0 0 1 ${cx + 28} ${py - 28.5}L${cx} ${py}Z" fill="#dcb25a"/>
            ${[0, 45, 90, 135, 180, 225, 270, 315].map(a => { const r = a * Math.PI / 180; return `<circle cx="${f(cx + 35 * Math.cos(r))}" cy="${f(py + 35 * Math.sin(r))}" r="2.4" fill="#8a6a26"/>`; }).join("")}
            <clipPath id="t-pc${i}"><circle cx="${cx}" cy="${py}" r="30"/></clipPath>
            <g clip-path="url(#t-pc${i})">
              <rect x="${cx - 32}" y="${py - 32}" width="64" height="64" fill="#3a2a1a"/>
              <rect x="${cx - 32}" y="${py - 14}" width="64" height="48" fill="#b8701f"/><rect x="${cx - 32}" y="${py - 14}" width="64" height="16" fill="#c98124"/>
              <path d="M${cx - 32} ${py - 14} q8 -6 16 0 t16 0 t16 0 t16 0 v-5 h-64z" fill="#f3e2bd"/>
              ${[[-14, 18, 2.4], [6, 24, 1.8], [16, 10, 2.8], [-4, 6, 1.6], [-20, 28, 2]].map(([dx, dy, r]) => `<circle class="t-bub" cx="${cx + dx}" cy="${py + dy}" r="${r}" fill="#f5d48a" opacity=".7"/>`).join("")}
              <g class="t-pbottle">${K.bottle(0, 0, { s: .36 })}</g>
            </g>
            <path d="M${cx - 22} ${py - 12} A26 26 0 0 1 ${cx - 4} ${py - 25} L${cx - 3} ${py - 20} A20 20 0 0 0 ${cx - 17} ${py - 9}Z" fill="#fff" opacity=".35"/>
          </g>
          <!-- brass plate -->
          <g><rect x="${cx - 64}" y="398" width="128" height="46" fill="#a9802f"/><rect x="${cx - 64}" y="396" width="128" height="46" fill="#cfa34a"/><rect x="${cx - 64}" y="396" width="128" height="14" fill="#ddb560"/>
            ${[[-58, 402], [58, 402], [-58, 436], [58, 436]].map(([dx, y]) => `<circle cx="${cx + dx}" cy="${y}" r="2.2" fill="#7d5d1f"/>`).join("")}
            <text x="${cx}" y="418" text-anchor="middle" font-family="Archivo Black, Arial Black, Arial" font-size="15" fill="#2b1a12">code<tspan fill="#7a3d0e">brew</tspan></text>
            <text x="${cx}" y="434" text-anchor="middle" font-family="Archivo, Arial" font-weight="800" font-size="9.5" letter-spacing="1.6" fill="#5a3e10">FV-0${i + 1} · ${NAMES[i]}</text></g>
          <!-- gauge -->
          <g><rect x="${cx + 52}" y="474" width="8" height="18" fill="#a9802f"/>
            <circle cx="${cx + 57}" cy="${500 + 1.5}" r="25" fill="#7d5d1f"/><circle cx="${cx + 56}" cy="500" r="25" fill="#c99a3e"/><circle cx="${cx + 56}" cy="500" r="20" fill="#f6ecd6"/>
            <path d="M${cx + 56} 500 L${f(cx + 56 + 19 * Math.cos(-.35))} ${f(500 + 19 * Math.sin(-.35))} A19 19 0 0 1 ${f(cx + 56 + 19 * Math.cos(.55))} ${f(500 + 19 * Math.sin(.55))}Z" fill="#e2463a" opacity=".9"/>
            <path d="M${cx + 56} 500 L${f(cx + 56 + 19 * Math.cos(-1.4))} ${f(500 + 19 * Math.sin(-1.4))} A19 19 0 0 1 ${f(cx + 56 + 19 * Math.cos(-.35))} ${f(500 + 19 * Math.sin(-.35))}Z" fill="#7cc243" opacity=".85"/>
            <circle cx="${cx + 56}" cy="500" r="14" fill="#f6ecd6"/>
            ${Array.from({ length: 9 }, (_, k) => { const a = (-210 + k * 30) * Math.PI / 180; return `<rect x="-1" y="-1" width="5" height="2" fill="#2b1a12" transform="translate(${f(cx + 56 + 14 * Math.cos(a))} ${f(500 + 14 * Math.sin(a))}) rotate(${-210 + k * 30})"/>`; }).join("")}
            <g class="t-needle" data-cx="${cx + 56}"><g class="t-needle-j"><path d="M${cx + 54.6} 501 L${cx + 56} 483 L${cx + 57.4} 501Z" fill="#2b1a12"/></g></g>
            <circle cx="${cx + 56}" cy="500" r="3.2" fill="#c46a1f"/></g>
        </g></g>`;
    };

    // ---------- wall ----------
    let panels = "";
    for (let x = -40, k = 0; x < 1500; x += 232, k++) panels += `<rect x="${x}" y="-1200" width="236" height="${FLOOR + 1200}" fill="${k % 2 ? "#5b5b5e" : "#565659"}"/>`;
    let tiles = "";
    for (let r = 0; r < 5; r++) for (let x = -60 + (r % 2) * 32; x < 1500; x += 64) tiles += `<rect x="${x}" y="${612 + r * 36}" width="60" height="32" fill="${(r + Math.floor(x / 64)) % 3 ? "#646468" : "#6b6b6f"}"/>`;

    // ---------- pipes ----------
    const p1 = rpath([[640, 702], [640, 752], [770, 752], [770, 118], [900, 118], [900, 172]]);
    const p2 = rpath([[900, 702], [900, 752], [1030, 752], [1030, 118], [1160, 118], [1160, 172]]);
    const flange = (x, y, v) => v ? `<rect x="${x - 16}" y="${y - 4}" width="32" height="8" fill="#8a4418"/><rect x="${x - 16}" y="${y - 4}" width="32" height="3" fill="#d88a4c"/>`
      : `<rect x="${x - 4}" y="${y - 16}" width="8" height="32" fill="#8a4418"/><rect x="${x - 4}" y="${y - 16}" width="3" height="32" fill="#d88a4c"/>`;
    const wheel = (x, y, cls) => `<g class="${cls}" data-x="${x}" data-y="${y}" filter="url(#sh2)"><path d="M${x - 17} ${y} a17 17 0 1 0 34 0 a17 17 0 1 0 -34 0Z M${x - 12} ${y} a12 12 0 1 1 24 0 a12 12 0 1 1 -24 0Z" fill="#e2463a" fill-rule="evenodd"/>
      <path d="M${x - 17} ${y} a17 17 0 0 1 17 -17 v5 a12 12 0 0 0 -12 12Z" fill="#f2695d"/>
      ${[0, 60, 120].map(a => `<rect x="${x - 13}" y="${y - 2}" width="26" height="4" fill="#b8322a" transform="rotate(${a} ${x} ${y})"/>`).join("")}<circle cx="${x}" cy="${y}" r="5" fill="#8a1f19"/></g>`;

    // ---------- the Figma recipe pinned on the wall ----------
    const recipe = `<g id="t-recipe" filter="url(#sh2)" transform="rotate(-3 260 270)">
      <rect x="112" y="150" width="296" height="232" fill="#f3ead8"/><path d="M372 382 L408 346 L408 382Z" fill="#d9ccb2"/><path d="M372 382 L408 346 L372 346Z" fill="#fbf4e6"/>
      <text x="130" y="184" font-family="Archivo Black, Arial Black, Arial" font-size="15" fill="#2b1a12">RECIPE <tspan fill="#c46a1f">#204</tspan></text>
      <text x="130" y="202" font-family="Archivo, Arial" font-weight="700" font-size="10.5" letter-spacing="1" fill="#8a6a4a">FIGMA → OS 2.0 · BREW TIME 3 WKS</text>
      <rect x="130" y="214" width="260" height="14" fill="#2b1a12"/><rect x="136" y="219" width="34" height="4" fill="#f2c14e"/><rect x="330" y="219" width="54" height="4" fill="#8a6a4a"/>
      <rect x="130" y="232" width="260" height="58" fill="#e9a03a"/><rect x="142" y="246" width="110" height="9" fill="#fff6e2"/><rect x="142" y="260" width="80" height="6" fill="#fff6e2" opacity=".7"/><rect x="142" y="272" width="44" height="10" fill="#2b1a12"/>
      ${[0, 1, 2, 3].map(k => `<rect x="${130 + k * 67}" y="296" width="59" height="46" fill="${["#d8c9ab", "#cbb994", "#d8c9ab", "#cbb994"][k]}"/><rect x="${130 + k * 67}" y="346" width="40" height="5" fill="#b9a786"/>`).join("")}
      <circle cx="372" cy="250" r="7" fill="#e2463a" opacity=".85"/><rect x="358" y="262" width="14" height="14" fill="#3fa0d8" opacity=".85"/><path d="M376 262 h12 v14z" fill="#7cc243"/>
      <path d="M210 360 q20 12 40 0" stroke="#c46a1f" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <text x="258" y="368" font-family="Archivo, Arial" font-weight="800" font-size="10" fill="#c46a1f">pixel-perfect, please</text>
    </g>${K.pin(258, 154, "#e2463a").replace('r="16"', 'r="8"').replace('r="30"', 'r="16"').replace('r="26"', 'r="13"')}`;

    // ---------- pendant lamps ----------
    const lamp = (x, len, id) => `<g class="t-lamp-h" id="${id}" data-x="${x}"><rect x="${x - 1.5}" y="-400" width="3" height="${400 + len}" fill="#2b2b2e"/>
      <g filter="url(#sh3)"><rect x="${x - 8}" y="${len - 6}" width="16" height="14" fill="#2f2f33"/>
      <path d="M${x - 16} ${len + 8} L${x + 16} ${len + 8} L${x + 52} ${len + 52} L${x - 52} ${len + 52}Z" fill="#2f5a4e"/><path d="M${x} ${len + 8} L${x + 16} ${len + 8} L${x + 52} ${len + 52} L${x} ${len + 52}Z" fill="#244a40"/>
      <rect x="${x - 54}" y="${len + 50}" width="108" height="5" fill="#f3ead8"/><circle cx="${x}" cy="${len + 58}" r="10" fill="#ffe7a3"/></g></g>`;

    return K.svg(`
      <defs>
        <radialGradient id="t-pool" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd98a" stop-opacity=".24"/><stop offset=".55" stop-color="#ffd98a" stop-opacity=".09"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>
        <filter id="t-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
        <clipPath id="t-cin"><rect x="-2000" y="-4000" width="6000" height="${4000 + 168}"/></clipPath>
        <clipPath id="t-cout"><rect x="-2000" y="${CB + 30}" width="6000" height="6000"/></clipPath>
      </defs>
      <g filter="url(#sh1)">${panels}</g>
      <rect x="-1000" y="${FLOOR}" width="4000" height="3000" fill="#3f3f43"/><rect x="-1000" y="${FLOOR}" width="4000" height="6" fill="#4d4d51"/>
      <g filter="url(#sh1)">${tiles}</g>
      <rect x="-1000" y="600" width="4000" height="10" fill="#4a4a4e"/>
      <ellipse cx="300" cy="260" rx="420" ry="380" fill="url(#t-pool)"/>
      <ellipse cx="1330" cy="250" rx="380" ry="380" fill="url(#t-pool)"/>
      ${recipe}
      ${CX.map(legs).join("")}
      ${CX.map((_, i) => tank(i)).join("")}
      <g filter="url(#sh1)">${copperPipe(p1)}${copperPipe(p2)}
        ${flange(640, 728, 1)}${flange(900, 728, 1)}${flange(770, 400, 1)}${flange(1030, 400, 1)}${flange(835, 118, 0)}${flange(1095, 118, 0)}
        <rect x="886" y="160" width="28" height="9" fill="#8a4418"/><rect x="1146" y="160" width="28" height="9" fill="#8a4418"/>
        <rect x="762" y="${FLOOR - 230}" width="16" height="10" fill="#6d6d73"/><rect x="1022" y="${FLOOR - 230}" width="16" height="10" fill="#6d6d73"/></g>
      <path id="t-pulse1" d="${p1}" fill="none" stroke="#ffd36b" stroke-width="10" stroke-linecap="round" filter="url(#t-blur)" opacity="0"/>
      <path id="t-pulse1b" d="${p1}" fill="none" stroke="#fff1c2" stroke-width="6" stroke-linecap="round" opacity="0"/>
      <path id="t-pulse2" d="${p2}" fill="none" stroke="#ffd36b" stroke-width="10" stroke-linecap="round" filter="url(#t-blur)" opacity="0"/>
      <path id="t-pulse2b" d="${p2}" fill="none" stroke="#fff1c2" stroke-width="6" stroke-linecap="round" opacity="0"/>
      ${wheel(705, 752, "t-wheel t-w1")}${wheel(965, 752, "t-wheel t-w2")}${wheel(1218, 700, "t-wheel t-w3")}
      <rect x="1196" y="696" width="20" height="8" fill="#6d6d73"/>
      <g id="t-steam" fill="#efe6d6" filter="url(#sh1)"></g>
      ${lamp(300, 70, "t-lampA")}${lamp(1330, 40, "t-lampB")}
      <g clip-path="url(#t-cin)"><g id="t-bin" filter="url(#sh3)"><g class="t-sw">${K.bottle(0, 0, { s: .45 })}</g></g></g>
      <g id="t-hoist" filter="url(#sh3)"><g class="t-sw">${Array.from({ length: 110 }, (_, k) => k % 2
        ? `<rect x="-1.6" y="${-24 - k * 12}" width="3.2" height="15" fill="#5d5d62"/>`
        : `<rect x="-4" y="${-24 - k * 12}" width="8" height="15" rx="4" fill="#9a9aa0"/><rect x="-1.2" y="${-20 - k * 12}" width="2.4" height="7" fill="#3a3a3e"/>`).join("")}
        <path d="M-9 -12 Q-9 -26 0 -26 Q9 -26 9 -12 L9 12 L5 12 L5 -12 Q5 -21 0 -21 Q-5 -21 -5 -12 L-5 12 L-9 12Z" fill="#b0b0b6"/><path d="M5 -12 L9 -12 L9 12 L5 12Z" fill="#7a7a80"/>
        <rect x="-11" y="10" width="22" height="7" fill="#c99a3e"/><rect x="-11" y="14" width="22" height="3" fill="#8a6a26"/></g></g>
      <g clip-path="url(#t-cout)"><g id="t-bout" filter="url(#sh3)">${K.bottle(0, 0, { s: .45 })}</g></g>
    `) + K.label({ title: "Custom Themes", href: "../themes.html", left: "6%", top: "54%",
      text: "OS 2.0 themes built from Figma: sections and blocks your team edits without a ticket." }) + `
      <style>
        #tanks .kb-label { max-width: min(30vw, 440px); }
        #tanks svg.art .kb-bottle { pointer-events: none; }
        @media (max-aspect-ratio: 19/20) {
          #tanks .kb-label { left: 6% !important; right: 6%; top: auto !important; bottom: 7%; max-width: none; font-size: clamp(30px, 8.4vw, 54px); }
        }
      </style>`;
  },
  init: (stage, K, st) => {
    const $ = (s) => stage.querySelector(s), $$ = (s) => [...stage.querySelectorAll(s)];
    const svg = $("svg.art"), CX = [640, 900, 1160], CB = 680;
    // ---- portrait: re-frame the viewBox around the tank row instead of letting "slice" crop it away
    let vb = { x: 0, y: 0, w: 1440, h: 900 };
    const frame = () => {
      const a = stage.clientWidth / stage.clientHeight;
      if (a < .95) {
        const w = Math.max(800, 1450 * a), h = w / a;
        vb = { x: 900 - w / 2, y: 790 - .57 * h, w, h };
      } else vb = { x: 0, y: 0, w: 1440, h: 900 };
      svg.setAttribute("viewBox", `${vb.x.toFixed(0)} ${vb.y.toFixed(0)} ${vb.w.toFixed(0)} ${vb.h.toFixed(0)}`);
      const vig = svg.lastElementChild; vig.setAttribute("x", vb.x); vig.setAttribute("y", vb.y); vig.setAttribute("width", vb.w); vig.setAttribute("height", vb.h);
    };
    frame();
    const topIn = Math.min(-260, vb.y - 200), exitY = Math.max(1000, vb.y + vb.h + 60);

    const hoist = $("#t-hoist"), bin = $("#t-bin"), bout = $("#t-bout"), lid = $("#t-lid"), flap = $("#t-flap");
    const pb = $$(".t-pbottle"), needles = $$(".t-needle"), levels = $$(".t-level"), lamps = $$(".t-lamp"), dots = $$(".t-glowdot");
    const tanks = $$(".t-tank");
    gsap.set([bin, hoist], { x: CX[0], y: topIn });
    gsap.set(bout, { x: CX[2], y: CB + 30 - 160, rotation: 0 });
    pb.forEach((b, i) => gsap.set(b, { x: CX[i], y: 322 - 30 - 125 }));
    gsap.set(lid, { svgOrigin: `${CX[0] + 37} 162` });
    gsap.set(flap, { svgOrigin: `${CX[2] - 26} ${CB + 33}` });
    needles.forEach(n => gsap.set(n, { svgOrigin: `${n.dataset.cx} 500`, rotation: -125 }));
    levels.forEach(l => gsap.set(l, { scaleY: .22, transformOrigin: "50% 100%" }));
    tanks.forEach((t, i) => gsap.set(t, { svgOrigin: `${CX[i]} 790` }));
    $$(".t-wheel").forEach(w => gsap.set(w, { svgOrigin: `${w.dataset.x} ${w.dataset.y}` }));
    ["#t-pulse1", "#t-pulse1b", "#t-pulse2", "#t-pulse2b"].forEach(s => { const p = $(s), L = p.getTotalLength(); p.dataset.l = L; gsap.set(p, { strokeDasharray: `110 ${L + 200}`, strokeDashoffset: 110 }); });
    const lampOn = (i) => [gsap.to(lamps[i], { fill: "#ffd36b", duration: .02 }), gsap.to(dots[i], { opacity: .55, duration: .02 })];

    if (K.reduced) {
      gsap.set(needles, { rotation: 30 }); gsap.set(levels, { scaleY: .92 }); gsap.set(lamps, { fill: "#ffd36b" }); gsap.set(dots, { opacity: .55 });
      gsap.set(pb[2], { y: 322 - 70 });
      return;
    }

    // ---- steam puffs (paper clouds) ----
    const steamG = $("#t-steam");
    const puff = (x, y, s = 1, big = false) => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.innerHTML = `<circle cx="0" cy="0" r="9"/><circle cx="9" cy="-4" r="7"/><circle cx="-8" cy="-3" r="6"/>`;
      steamG.appendChild(g);
      gsap.fromTo(g, { x, y, scale: .3 * s, opacity: .95 }, { x: x + gsap.utils.random(-14, 22), y: y - (big ? 110 : 70), scale: (big ? 2.2 : 1.4) * s, opacity: 0,
        duration: big ? 1.6 : 2.4, ease: "power1.out", onComplete: () => g.remove() });
    };
    CX.forEach((cx, i) => gsap.delayedCall(i * .9, function loop() { puff(cx - 51, 162, .8); gsap.delayedCall(2.4 + Math.random() * 1.8, loop); }));

    // ---- idle life ----
    $$(".t-bub").forEach((b, k) => gsap.fromTo(b, { y: 0, opacity: .75 }, { y: -44, opacity: 0, duration: 1.6 + (k % 3) * .5, repeat: -1, delay: k * .3, ease: "none" }));
    $$(".t-needle-j").forEach((n, k) => { gsap.set(n, { svgOrigin: `${needles[k].dataset.cx} 500` });
      gsap.to(n, { rotation: 4, duration: .18, repeat: -1, yoyo: true, ease: "sine.inOut", repeatDelay: .4 + k * .2 }); });
    $$(".t-lamp-h").forEach((l, k) => { gsap.set(l, { svgOrigin: `${l.dataset.x} -400` });
      gsap.to(l, { rotation: k ? -.5 : .6, duration: 3 + k, yoyo: true, repeat: -1, ease: "sine.inOut" }); });
    gsap.to("#t-recipe", { rotation: -1.6, svgOrigin: "258 154", duration: 3.4, yoyo: true, repeat: -1, ease: "sine.inOut" });

    // ---- the scrubbed story ----
    const sw = { r: 9 }, swEls = $$(".t-sw"), swing = () => swEls.forEach(e => e.setAttribute("transform", `rotate(${sw.r.toFixed(2)} 0 -700)`));
    swing();
    CustomWiggle.create("t-wig", { wiggles: 5, type: "easeOut" });
    let burst = false, popped = false;
    const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { ...st, scrub: 1,
      onUpdate: (s) => {
        const p = s.progress;
        if (p > .21 && !burst) { burst = true; for (let k = 0; k < 4; k++) gsap.delayedCall(k * .08, () => puff(CX[0] + gsap.utils.random(-20, 20), 158, 1.1, true)); }
        if (p < .17) burst = false;
        if (p > .86 && !popped) { popped = true; for (let k = 0; k < 3; k++) gsap.delayedCall(k * .07, () => puff(CX[2] + gsap.utils.random(-24, 24), CB + 40, .9, true)); }
        if (p < .8) popped = false;
      } } });
    // 1 · hatch opens, bottle drops in
    // the hoist lowers the bottle over the open hatch, swings, dips it in, lets go and winches back up
    tl.to([bin, hoist], { y: -6, duration: .1, ease: "power2.out" }, 0)
      .fromTo(sw, { r: 9 }, { r: 0, duration: .11, ease: "elastic.out(1,.3)", onUpdate: swing }, 0)
      .to(lid, { rotation: -112, duration: .05, ease: "back.out(2)" }, .05)
      .to([bin, hoist], { y: 112, duration: .05, ease: "sine.inOut" }, .11)
      .to(bin, { y: 178, duration: .03, ease: "power2.in" }, .165)
      .to(hoist, { y: topIn - 200, duration: .12, ease: "power2.in" }, .17)
      .to(lid, { rotation: 0, duration: .04, ease: "bounce.out" }, .19)
      .to(tanks[0], { rotation: 1.2, duration: .08, ease: "t-wig" }, .19);
    // per tank: porthole pass, needle, level, lamp
    const inTank = (i, t0) => {
      tl.to(pb[i], { y: 322 + 34, duration: .13, ease: "sine.inOut" }, t0)
        .to(needles[i], { rotation: 28, duration: .12, ease: "back.out(1.6)" }, t0)
        .to(levels[i], { scaleY: .92, duration: .14, ease: "power1.inOut" }, t0)
        .add(lampOn(i), t0 + .08);
    };
    inTank(0, .21);
    // 2 · transfer 1 → 2
    const pulse = (n, t0) => {
      const a = $(`#t-pulse${n}`), b = $(`#t-pulse${n}b`), L = +a.dataset.l;
      tl.to([a, b], { opacity: 1, duration: .01 }, t0)
        .to([a, b], { strokeDashoffset: -L, duration: .14, ease: "power1.inOut" }, t0)
        .to([a, b], { opacity: 0, duration: .01 }, t0 + .14)
        .to(`.t-w${n}`, { rotation: 360, duration: .14, ease: "power1.inOut" }, t0);
    };
    pulse(1, .34);
    tl.to(tanks[1], { rotation: -1, duration: .07, ease: "t-wig" }, .48);
    inTank(1, .47);
    // 3 · transfer 2 → 3
    pulse(2, .60);
    tl.to(tanks[2], { rotation: 1, duration: .07, ease: "t-wig" }, .74);
    inTank(2, .73);
    // 4 · tank 3 chute: wheel spins, flap drops, bottle pops out and falls out of the scene
    tl.to(".t-w3", { rotation: -300, duration: .06, ease: "power2.inOut" }, .80)
      .to(flap, { rotation: 100, duration: .04, ease: "back.out(2)" }, .83)
      .to(bout, { y: CB + 40, duration: .06, ease: "back.out(1.4)" }, .85)
      .to(bout, { y: exitY, rotation: 16, x: CX[2] + 30, duration: .09, ease: "power2.in" }, .91)
      .to(flap, { rotation: 0, duration: .03 }, .97);
    tl.set({}, {}, 1);
  }
});
