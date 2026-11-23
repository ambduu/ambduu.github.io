/* 60 · BOTTLING — "Speed & Launch".
   Upper line: the codebrew bottle drops in from the top, rides a belt under three paper machines
   (filler -> capper -> labeller) that act as you scroll. Lower line: a long crate belt slides the real
   portfolio past right-to-left, each store printed on paper and tucked in a wooden crate (links to the live store).
   A ticket counts crates out; the belt ends in a "200+ stores served" stack and an empty "your store?" crate.
   The finished bottle tips off the end of its line into that crate, which sinks through the floor (exit bottom). */
(function () {
  const SHOPS = [
    ["dylanlex", "Dylan Lex", "Jewellery", "dylanlex.com"], ["monkeeroos", "Monkeeroos", "Clothing", "monkeeroos.com"],
    ["buebchen", "Bübchen", "Cosmetics", "buebchen.de"], ["abstrax", "Abstrax Tech", "Shopify Plus", "abstraxtech.com"],
    ["myeco", "My Eco World", "Pet", "myecoworld.com"], ["sabah", "Sabah", "Footwear", "sabah.am"],
    ["maitea", "Maitea", "Jewellery", "maitea.de"], ["woolandoak", "Wool & Oak", "Bags & covers", "woolandoak.com"],
    ["cheribundi", "Cheribundi", "Shopify Plus", "cheribundi.com"], ["waad", "Waad Skin", "Cosmetics", "waadskin.com"],
    ["mattym", "Shop Matty M", "Clothing", "shopmattym.com"], ["monte", "Monte Design", "Furniture", "montedesign.com"],
    ["miro", "Miro Jewelers", "Jewellery", "mirojewelers.com"], ["dirtydog", "Dirty Dog Beauty Club", "Pet", "dirtydogbeautyclub.com"],
    ["zugu", "Zugu Case", "Shopify Plus", "zugucase.com"], ["wearetto", "Wearetto", "Footwear", "wearetto.com"],
    ["blue", "Blue Skincare", "Cosmetics", "blue-skincare.com"], ["recolution", "Recolution", "Clothing", "recolution.de"],
    ["vics", "Vic's Meat", "Food", "vicsmeat.com.au"], ["brooklyn", "Brooklyn Jewelers", "Jewellery", "brooklynjewelers.com"],
    ["aavrani", "Aavrani", "Shopify Plus", "aavrani.com"], ["luxorro", "Luxorro", "Bags & covers", "luxorro.com"],
    ["purelei", "Purelei", "Jewellery", "purelei.com"], ["phystine", "Phystine", "Cosmetics", "phystine.com"],
    ["ena", "ENA Athletics", "Footwear", "enaathletics.com"], ["aliceeli", "Alice and Eli", "Pet", "aliceandeli.com"]
  ];
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

  // geometry (viewBox units)
  const Y1 = 530;              // bottling belt top
  const Y2 = 845;              // crate belt top
  const BS = .52, BH = 396 * BS; // bottle scale / height
  const X = { drop: 470, fill: 690, cap: 910, label: 1130, end: 1300, crate: 1290, land: 1372 };
  const CW = 320, GAP = 352, C0 = 990;   // crate width, pitch, first crate x (left edge)
  const N = SHOPS.length;
  const STACK_X = C0 + N * GAP + 40, STACK_W = 440; // stack left edge on the track

  // ---------- paper pieces ----------
  const roller = (x, y, r, cls) => `<g class="${cls}" data-cx="${x}" data-cy="${y}">
    <circle cx="${x}" cy="${y}" r="${r}" fill="#cfc6b2"/><circle cx="${x}" cy="${y}" r="${r * .62}" fill="#a79d87"/>
    <rect x="${x - r * .16}" y="${y - r * .92}" width="${r * .32}" height="${r * .5}" fill="#efe8d8"/><circle cx="${x}" cy="${y}" r="${r * .2}" fill="#5d564a"/></g>`;

  const crate = (k, name, ind, dom, i) => {
    const r = [-2.6, 1.8, -1.2, 2.6, -2, 1.1][i % 6], img = CW - 64, ih = img / 1.6;
    const fs = Math.min(20, (CW - 40) / (name.length * .74));
    return `<a class="b-crate" href="https://${dom}/" target="_blank" rel="noopener" aria-label="${esc(name)} (${esc(ind)}), live store, opens in a new tab" data-x="${C0 + i * GAP}">
      <g transform="translate(${C0 + i * GAP} ${Y2})" filter="url(#sh3)">
        <rect x="8" y="-128" width="${CW - 16}" height="66" fill="#b47c45"/><rect x="8" y="-62" width="${CW - 16}" height="62" fill="#a46c38"/>
        <rect x="0" y="-136" width="18" height="136" fill="#8f5a2c"/><rect x="${CW - 18}" y="-136" width="18" height="136" fill="#8f5a2c"/>
        <g transform="rotate(${r} ${CW / 2} -120)">
          <rect x="22" y="${-56 - ih - 24}" width="${img + 20}" height="${ih + 34}" fill="#fbf5e8"/>
          <rect x="22" y="${-56 - ih - 24}" width="${img + 20}" height="6" fill="#efe5cf"/>
          <image href="../assets/work/${k}.jpg" x="32" y="${-56 - ih - 14}" width="${img}" height="${ih}" preserveAspectRatio="xMidYMin slice"/>
          <rect x="4" y="${-56 - ih - 34}" width="58" height="20" fill="#f2c14e" opacity=".78" transform="rotate(-28 33 ${-56 - ih - 24})"/>
          <rect x="${CW - 62}" y="${-56 - ih - 34}" width="58" height="20" fill="#f2c14e" opacity=".78" transform="rotate(26 ${CW - 33} ${-56 - ih - 24})"/>
        </g>
        <rect x="0" y="-54" width="${CW}" height="54" fill="#dba468"/><rect x="0" y="-10" width="${CW}" height="10" fill="#c58c50"/>
        <rect x="0" y="-54" width="${CW}" height="5" fill="#e8b97f"/>
        <circle cx="10" cy="-44" r="3" fill="#8a5a2c"/><circle cx="${CW - 10}" cy="-44" r="3" fill="#8a5a2c"/>
        <text x="${CW / 2}" y="-25" text-anchor="middle" font-family="Archivo Black, Arial Black, Arial" font-size="${fs.toFixed(1)}" letter-spacing="1" fill="#3b2414" opacity=".86">${esc(name.toUpperCase())}</text>
        <text x="${CW / 2}" y="-13" text-anchor="middle" font-family="Archivo, Arial" font-weight="800" font-size="10" letter-spacing="1.6" fill="#7a4a22">${esc(dom.toUpperCase())} ↗</text>
        <g transform="translate(${CW - 6} -96) rotate(14)"><path d="M0 0 h64 l10 11 l-10 11 h-64z" fill="#f3ead8"/><circle cx="62" cy="11" r="3" fill="#a46c38"/>
          <text x="6" y="15" font-family="Archivo, Arial" font-weight="800" font-size="9" letter-spacing=".8" fill="#5a3a1c">${esc(ind.toUpperCase())}</text></g>
      </g></a>`;
  };

  const mini = (x, y, n, t) => `<g transform="translate(${x} ${y})">
    <rect x="0" y="-76" width="130" height="76" fill="#b47c45"/><rect x="0" y="-76" width="12" height="76" fill="#8f5a2c"/><rect x="118" y="-76" width="12" height="76" fill="#8f5a2c"/>
    <rect x="0" y="-36" width="130" height="36" fill="${t ? "#dba468" : "#d39a5c"}"/><rect x="0" y="-8" width="130" height="8" fill="#c58c50"/>
    <text x="65" y="-15" text-anchor="middle" font-family="Archivo Black, Arial Black" font-size="13" fill="#3b2414" opacity=".8">CODEBREW</text>
    <text x="65" y="-50" text-anchor="middle" font-family="Archivo, Arial" font-weight="800" font-size="10" letter-spacing="1.5" fill="#f3ead8" opacity=".7">№ ${n}</text></g>`;

  const stack = () => {
    const x = STACK_X, b = Y2;
    return `<g class="b-stack" data-x="${x}" filter="url(#sh3)">
      ${mini(x + 20, b, "0118")}${mini(x + 155, b, "0142", 1)}${mini(x + 290, b, "0207")}
      ${mini(x + 86, b - 78, "0066", 1)}${mini(x + 222, b - 78, "0173")}
      <g transform="translate(${x + 222} ${b - 156}) rotate(-3)">
        <rect x="-118" y="-112" width="236" height="112" fill="#fff6e2"/><rect x="-118" y="-112" width="236" height="9" fill="#f2c14e"/>
        <rect x="-118" y="-12" width="236" height="12" fill="#efe2c4"/>
        <text x="0" y="-44" text-anchor="middle" font-family="Archivo Black, Arial Black" font-size="62" fill="#c46a1f" letter-spacing="-2">200+</text>
        <text x="0" y="-20" text-anchor="middle" font-family="Archivo Black, Arial Black" font-size="16" fill="#2b1a12" letter-spacing="1.5">STORES SERVED</text>
      </g></g>`;
  };

  // final empty crate (lives in the camera space so it lines up with the bottle)
  const lastCrateBack = () => `<g filter="url(#sh3)">
      <rect x="8" y="-128" width="${CW - 16}" height="66" fill="#b47c45"/><rect x="8" y="-62" width="${CW - 16}" height="62" fill="#a46c38"/>
      <rect x="0" y="-136" width="18" height="136" fill="#8f5a2c"/><rect x="${CW - 18}" y="-136" width="18" height="136" fill="#8f5a2c"/>
      <g transform="rotate(-2.4 ${CW / 2} -120)"><rect x="26" y="-214" width="${CW - 52}" height="150" fill="#fff6e2"/><rect x="26" y="-214" width="${CW - 52}" height="8" fill="#f2c14e"/>
        <text x="44" y="-166" font-family="Archivo Black, Arial Black" font-size="27" fill="#2b1a12">YOUR</text>
        <text x="44" y="-136" font-family="Archivo Black, Arial Black" font-size="27" fill="#2b1a12">STORE</text>
        <text x="44" y="-106" font-family="Archivo Black, Arial Black" font-size="27" fill="#c46a1f">NEXT?</text>
        <text x="44" y="-80" font-family="Archivo, Arial" font-weight="800" font-size="10" letter-spacing="2" fill="#7a4a22">ORDER A ROUND →</text></g></g>`;
  const lastCrateFront = () => `<g filter="url(#sh3)"><rect x="0" y="-54" width="${CW}" height="54" fill="#dba468"/><rect x="0" y="-10" width="${CW}" height="10" fill="#c58c50"/>
      <rect x="0" y="-54" width="${CW}" height="5" fill="#e8b97f"/><circle cx="10" cy="-44" r="3" fill="#8a5a2c"/><circle cx="${CW - 10}" cy="-44" r="3" fill="#8a5a2c"/>
      <text x="${CW / 2}" y="-22" text-anchor="middle" font-family="Archivo Black, Arial Black" font-size="19" letter-spacing="1" fill="#3b2414" opacity=".86">FRESH · CODEBREW</text></g>`;

  // the traveller, built from K.bottle (no label: the labeller adds it). Local origin = bottle bottom-centre.
  const bottle = (K) => `<g id="b-bot" filter="url(#sh2)"><g id="b-tilt"><g id="b-wob"><g transform="translate(0 ${-BH}) scale(${BS})">
      <g id="b-foam">${[[-14, -6, 13], [6, -14, 16], [20, -2, 12], [-4, -26, 12], [-24, 6, 9], [14, -32, 9]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff6e2"/>`).join("")}<circle cx="2" cy="-10" r="10" fill="#f6e7c6"/></g>
      ${K.bottle(0, 0, { label: false })}
      <g id="b-lab"><rect x="-49" y="190" width="98" height="96" fill="#f6ead2"/><rect x="-49" y="190" width="30" height="96" fill="#fff8ea"/><rect x="-49" y="276" width="98" height="10" fill="#e8b84a"/>
        <text x="0" y="234" text-anchor="middle" font-family="Archivo Black, Arial Black, Arial" font-size="19" fill="#c46a1f">code</text><text x="0" y="258" text-anchor="middle" font-family="Archivo Black, Arial Black, Arial" font-size="19" fill="#2b1a12">brew</text></g>
      <g id="b-crown"><path d="M-21 -6 l3 -5 l4 4 l4 -5 l4 5 l4 -5 l4 5 l4 -5 l4 4 l3 5 v18 h-42z" fill="#e2463a"/><rect x="-21" y="2" width="42" height="6" fill="#b8342a"/><circle cx="0" cy="-2" r="5" fill="#f2c14e"/></g>
      <g id="b-spark">${[0, 50, 110, 180, 240, 300].map(a => `<path d="M0 -6 l5 -22 l5 22z" fill="#f2c14e" transform="rotate(${a} 5 0) translate(0 -26)"/>`).join("")}</g>
    </g></g></g></g>`;

  SCENES.push({
    id: "bottling", order: 60, height: 420, bg: "#3f6a34", headerTone: "light",
    nav: { label: "Speed & Launch", href: "../launch.html" },
    html: (K) => {
      const rolls1 = []; for (let x = 410; x <= 1310; x += 60) rolls1.push(roller(x, Y1 + 35, 13, "b-r1"));
      const rolls2 = []; for (let x = 20; x <= 1440; x += 64) rolls2.push(roller(x, Y2 + 22, 14, "b-r2"));
      const cleats = (x0, x1, y, h, step, c) => { let s = ""; for (let x = x0; x < x1; x += step) s += `<rect x="${x}" y="${y}" width="${step * .45}" height="${h}" fill="${c}"/>`; return s; };
      const crates = SHOPS.map((s, i) => crate(...s, i)).join("");
      const svg = K.svg(`
        <clipPath id="b-clip1"><rect x="380" y="${Y1}" width="960" height="14"/></clipPath>
        <clipPath id="b-clip2"><rect x="-400" y="${Y2}" width="2240" height="12"/></clipPath>
        <g aria-hidden="true">
          <!-- wall: two layered paper panels -->
          <rect width="1440" height="900" fill="#3f6a34"/>
          <g filter="url(#sh1)"><path d="M-20 640 H1460 V920 H-20z" fill="#38602e"/></g>
          <g filter="url(#sh1)"><circle cx="1290" cy="120" r="250" fill="#447339"/></g>
        </g>
        <g class="b-cam" aria-hidden="true">
          <g transform="translate(0 -30)"><!-- machines hang from the ceiling --><!-- feed pipes from the ceiling -->
          <g filter="url(#sh1)"><path d="M600 -20 V60 Q600 84 624 84 H660" fill="none" stroke="#a85d22" stroke-width="16"/><path d="M600 -20 V60 Q600 84 624 84 H660" fill="none" stroke="#d98a4a" stroke-width="5" transform="translate(-4 -3)"/>
            <rect x="1020" y="-10" width="8" height="140" fill="#2f2f32"/><path d="M1024 130 q0 30 -30 30" fill="none" stroke="#2f2f32" stroke-width="6"/></g>
          <!-- belt legs (behind crates) -->
          <g filter="url(#sh1)">${[440, 860, 1260].map(x => `<rect x="${x}" y="${Y1 + 50}" width="20" height="290" fill="#2f2f32"/><rect x="${x}" y="${Y1 + 50}" width="6" height="290" fill="#45454a"/>`).join("")}</g>
          <!-- FILLER -->
          <g filter="url(#sh2)">
            <rect x="${X.fill - 52}" y="-20" width="9" height="120" fill="#4b4b4e"/><rect x="${X.fill + 43}" y="-20" width="9" height="120" fill="#4b4b4e"/>
            <path d="M${X.fill - 76} 150 Q${X.fill - 76} 82 ${X.fill} 82 Q${X.fill + 76} 82 ${X.fill + 76} 150 V206 L${X.fill + 18} 252 H${X.fill - 18} L${X.fill - 76} 206z" fill="#c97a3a"/>
            <path d="M${X.fill - 76} 150 Q${X.fill - 76} 82 ${X.fill} 82 Q${X.fill - 44} 96 ${X.fill - 46} 150 V214 L${X.fill - 18} 252 L${X.fill - 76} 206z" fill="#e0904a"/>
            <path d="M${X.fill + 76} 150 V206 L${X.fill + 18} 252 H${X.fill + 6} L${X.fill + 48} 210 V150 Q${X.fill + 48} 100 ${X.fill + 20} 84 Q${X.fill + 76} 92 ${X.fill + 76} 150z" fill="#a85d22"/>
            <rect x="${X.fill - 80}" y="150" width="160" height="10" fill="#8a4418"/>
            <circle cx="${X.fill + 22}" cy="190" r="19" fill="#fff6e2"/><circle cx="${X.fill + 22}" cy="190" r="4" fill="#2b1a12"/>
            <g id="b-needle"><rect x="${X.fill + 21}" y="175" width="3" height="16" fill="#e2463a"/></g>
            <rect x="${X.fill - 20}" y="250" width="40" height="26" fill="#58585b"/><rect x="${X.fill - 20}" y="250" width="12" height="26" fill="#6c6c70"/>
          </g>
          <g id="b-wheel" filter="url(#sh2)"><circle cx="${X.fill - 40}" cy="262" r="17" fill="#e2463a"/><circle cx="${X.fill - 40}" cy="262" r="10" fill="#3f6a34"/>
            <rect x="${X.fill - 42}" y="245" width="4" height="34" fill="#e2463a"/><rect x="${X.fill - 57}" y="260" width="34" height="4" fill="#e2463a"/><circle cx="${X.fill - 40}" cy="262" r="5" fill="#b8342a"/></g>
          <g id="b-nozzle" filter="url(#sh1)"><rect x="${X.fill - 7}" y="270" width="14" height="62" fill="#9a9aa0"/><rect x="${X.fill - 7}" y="270" width="5" height="62" fill="#c4c4c8"/><path d="M${X.fill - 7} 332 h14 l-3 12 h-8z" fill="#6c6c70"/></g>
          <!-- CAPPER -->
          <g id="b-piston" filter="url(#sh2)"><rect x="${X.cap - 9}" y="200" width="18" height="92" fill="#9a9aa0"/><rect x="${X.cap - 9}" y="200" width="6" height="92" fill="#c4c4c8"/>
            <path d="M${X.cap - 28} 290 h56 l-6 14 h-44z" fill="#4b4b4e"/><rect x="${X.cap - 28}" y="288" width="56" height="6" fill="#6c6c70"/></g>
          <g filter="url(#sh2)">
            <rect x="${X.cap - 46}" y="-20" width="9" height="140" fill="#4b4b4e"/><rect x="${X.cap + 37}" y="-20" width="9" height="140" fill="#4b4b4e"/>
            <path d="M${X.cap - 62} 112 Q${X.cap - 62} 98 ${X.cap - 48} 98 H${X.cap + 48} Q${X.cap + 62} 98 ${X.cap + 62} 112 V206 H${X.cap - 62}z" fill="#e2463a"/>
            <path d="M${X.cap + 34} 98 H${X.cap + 48} Q${X.cap + 62} 98 ${X.cap + 62} 112 V206 H${X.cap + 34}z" fill="#b8342a"/>
            <rect x="${X.cap - 62}" y="98" width="14" height="108" fill="#ef6a5c"/>
            <rect x="${X.cap - 70}" y="200" width="140" height="12" fill="#4b4b4e"/>
            <circle cx="${X.cap - 30}" cy="124" r="4" fill="#ffb3a8"/><circle cx="${X.cap}" cy="124" r="4" fill="#ffb3a8"/><circle cx="${X.cap + 30}" cy="124" r="4" fill="#ffb3a8"/>
            <circle cx="${X.cap - 12}" cy="160" r="13" fill="#8a2a22"/><circle id="b-lamp" cx="${X.cap - 12}" cy="160" r="9" fill="#f2c14e"/>
            <rect x="${X.cap + 74}" y="40" width="26" height="180" fill="#c4c4c8"/><rect x="${X.cap + 74}" y="40" width="8" height="180" fill="#e2e2e4"/>
            ${[0, 1, 2, 3, 4, 5].map(j => `<rect x="${X.cap + 78}" y="${206 - j * 11}" width="18" height="8" fill="${j % 2 ? "#b8342a" : "#e2463a"}"/>`).join("")}
            <path d="M${X.cap + 62} 196 h16 v12 h-16z" fill="#9a9aa0"/>
          </g>
          <!-- LABELLER -->
          <g filter="url(#sh2)">
            <rect x="${X.label + 34}" y="-20" width="10" height="190" fill="#4b4b4e"/>
            <rect x="${X.label + 10}" y="170" width="150" height="100" rx="10" fill="#f2c14e"/><rect x="${X.label + 120}" y="170" width="40" height="100" fill="#d9a93a"/>
            <rect x="${X.label + 10}" y="170" width="150" height="12" fill="#f7d77e"/>
          </g>
          <g id="b-spool" filter="url(#sh2)" data-cx="${X.label + 86}" data-cy="150">
            <circle cx="${X.label + 86}" cy="150" r="46" fill="#fff6e2"/><circle cx="${X.label + 86}" cy="150" r="34" fill="#f6ead2"/><circle cx="${X.label + 86}" cy="150" r="14" fill="#c46a1f"/>
            <rect x="${X.label + 83}" y="104" width="6" height="22" fill="#e8b84a"/><rect x="${X.label + 83}" y="174" width="6" height="22" fill="#e8b84a"/></g>
          <g id="b-arm" filter="url(#sh2)" data-hx="${X.label + 40}" data-hy="262">
            <rect x="${X.label + 34}" y="256" width="190" height="14" fill="#4b4b4e"/><rect x="${X.label + 34}" y="256" width="190" height="5" fill="#6c6c70"/>
            <circle cx="${X.label + 216}" cy="263" r="20" fill="#fff6e2"/><circle cx="${X.label + 216}" cy="263" r="10" fill="#e8b84a"/>
            <circle cx="${X.label + 40}" cy="263" r="12" fill="#2f2f32"/></g>
          </g><!-- bottling belt -->
          <g filter="url(#sh2)">
            <rect x="380" y="${Y1}" width="960" height="14" fill="#2b2b2e"/>
            <g clip-path="url(#b-clip1)"><g id="b-cleat1">${cleats(-600, 1500, Y1 + 3, 5, 36, "#444449")}</g></g>
            <rect x="380" y="${Y1 + 14}" width="960" height="40" fill="#58585b"/><rect x="380" y="${Y1 + 14}" width="960" height="6" fill="#6c6c70"/>
            <circle cx="1340" cy="${Y1 + 27}" r="27" fill="#4b4b4e"/><circle cx="380" cy="${Y1 + 27}" r="27" fill="#4b4b4e"/>
            ${rolls1.join("")}
          </g>
        </g>
        <!-- crate belt (screen space) -->
        <g aria-hidden="true">
          <g filter="url(#sh1)"><rect x="-20" y="${Y2}" width="1480" height="12" fill="#2b2b2e"/><g clip-path="url(#b-clip2)"><g id="b-cleat2">${cleats(-100, 1560, Y2 + 3, 5, 40, "#444449")}</g></g></g>
        </g>
        <g id="b-track">${crates}<g aria-hidden="true">${stack()}</g></g>
        <g class="b-cam" id="b-endcrate-wrap">
          <a href="#hills" aria-label="Your store next? Order a round"><g id="b-endback" transform="translate(${X.crate - CW / 2} ${Y2})">${lastCrateBack()}</g></a>
          <g aria-hidden="true">${bottle(K)}</g>
          <g id="b-endfront" aria-hidden="true" transform="translate(${X.crate - CW / 2} ${Y2})">${lastCrateFront()}</g>
        </g>
        <!-- floor lip: the crate belt's front frame, in front of everything -->
        <g aria-hidden="true" filter="url(#sh2)"><rect x="-20" y="${Y2 + 12}" width="1480" height="60" fill="#58585b"/><rect x="-20" y="${Y2 + 12}" width="1480" height="7" fill="#6c6c70"/>${rolls2.join("")}</g>
      `, "b-art").replace('aria-hidden="true"', "");
      return svg + `
      <div class="b-copy">
        <span class="b-kick">Line 06 · Bottling hall</span>
        ${K.label({ title: "Speed &amp; Launch", href: "../launch.html", text: "Lighter stores, clean Git + CI/CD releases, and support after launch." })}
        <div class="b-tally" aria-live="off"><span>Crates shipped</span><b id="b-count">000</b><em>Hover a crate, taste it live ↗</em></div>
      </div>
      <style>
        #bottling .b-copy { position: absolute; z-index: 5; left: 6vw; top: 13vh; width: min(470px, 34vw); pointer-events: none; }
        #bottling .b-copy > * { pointer-events: auto; }
        #bottling .b-copy .kb-label { position: relative; left: auto !important; top: auto !important; display: block; max-width: none; }
        #bottling .b-kick { display: inline-block; margin-bottom: 14px; font: 800 12px Archivo, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #cfe8a8; }
        #bottling .b-tally { display: inline-grid; grid-template-columns: auto auto; align-items: baseline; column-gap: 14px; row-gap: 2px; margin-top: 20px; padding: 10px 16px 11px; background: #fff6e2; color: #2b1a12; transform: rotate(-1.5deg);
          box-shadow: 1px 2px 3px rgba(0,0,0,.35), 10px 16px 18px rgba(0,0,0,.22); }
        #bottling .b-tally span { font: 800 11px Archivo, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #7a4a22; }
        #bottling .b-tally b { font: 400 30px/1 "Archivo Black", sans-serif; color: #c46a1f; font-variant-numeric: tabular-nums; min-width: 2.6em; }
        #bottling .b-tally em { grid-column: 1 / -1; font: 600 12px Archivo, sans-serif; font-style: normal; color: #7a4a22; }
        #bottling .b-crate { cursor: pointer; }
        #bottling .b-crate > g { transition: transform .25s; }
        #bottling .b-crate:hover image, #bottling .b-crate:focus image { filter: brightness(1.06); }
        #bottling .b-crate:focus { outline: none; }
        #bottling .b-crate:focus-visible rect:first-child { fill: #f2c14e; }
        @media (max-width: 800px) {
          #bottling .b-copy { left: 20px; right: 20px; top: 9vh; width: auto; }
          #bottling .b-copy .kb-label { font-size: 34px; }
          #bottling .b-copy .kb-label small { font-size: 14px; max-width: 22em; }
          #bottling .b-kick { margin-bottom: 8px; }
          #bottling .b-tally { margin-top: 12px; padding: 7px 12px; } #bottling .b-tally b { font-size: 22px; } #bottling .b-tally em { display: none; }
        }
      </style>`;
    },
    init: (stage, K, st) => {
      const $ = s => stage.querySelector(s), $$ = s => [...stage.querySelectorAll(s)];
      const cams = $$(".b-cam"), track = $("#b-track");
      const E = { bot: $("#b-bot"), tilt: $("#b-tilt"), wob: $("#b-wob"), lab: $("#b-lab"), crown: $("#b-crown"), foam: $("#b-foam"), spark: $("#b-spark"),
        noz: $("#b-nozzle"), pis: $("#b-piston"), arm: $("#b-arm"), spool: $("#b-spool"), needle: $("#b-needle"), wheel: $("#b-wheel"),
        cleat1: $("#b-cleat1"), cleat2: $("#b-cleat2"), endBack: $("#b-endback"), endFront: $("#b-endfront") };
      const r1 = $$(".b-r1"), r2 = $$(".b-r2"), crates = $$(".b-crate"), stackG = $(".b-stack"), count = $("#b-count");
      const AH = [+E.arm.dataset.hx, +E.arm.dataset.hy], SP = [+E.spool.dataset.cx, +E.spool.dataset.cy], ND = [X.fill + 22, 190], WH = [X.fill - 40, 262];

      // visible slice of the 1440x900 viewBox for this stage (xMidYMid slice)
      const vis = () => { const w = stage.clientWidth || innerWidth, h = stage.clientHeight || innerHeight, s = Math.max(w / 1440, h / 900), vw = w / s; return { vw, x0: 720 - vw / 2, x1: 720 + vw / 2 }; };
      // camera: keep the bottle in view on narrow screens, never show past the art edges
      const cam = bx => { const v = vis(); if (v.vw >= 1430) return 0; return gsap.utils.clamp(v.x1 - 1440, v.x0, 720 - bx); };
      const narrow = () => vis().vw < 900;
      const trackEnd = () => { const v = vis(); return (narrow() ? v.x0 - 60 - STACK_W : Math.max(v.x0 + 40, 380)) - STACK_X; };
      const trackMid = () => { const v = vis(); return (720 - STACK_W / 2) - STACK_X; };

      // all motion goes through this proxy; render() writes plain SVG transform attributes (exact pivots, no bbox maths)
      const S = { bx: X.drop, by: -40, tilt: -14, sx: 1, sy: 1, wob: 0, lab: 0, crown: -40, crownO: 0, foam: 0, spark: .2, sparkO: 0,
        noz: 0, pis: 0, arm: -8, spool: 0, needle: -60, jit: 0, wheel: 0, cam: 0, track: 0, endx: X.crate - CW / 2 + 900, endy: Y2 };
      const set = (el, t) => el.setAttribute("transform", t);
      let lastN = -1;
      const render = () => {
        const v = vis();
        set(E.bot, `translate(${S.bx} ${S.by})`);
        set(E.tilt, `rotate(${S.tilt}) scale(${S.sx} ${S.sy})`);
        set(E.wob, `rotate(${S.wob})`);
        set(E.lab, `scale(${Math.max(.001, S.lab)} 1)`);
        set(E.crown, `translate(0 ${S.crown})`); E.crown.setAttribute("opacity", S.crownO);
        set(E.foam, `translate(0 4) scale(${Math.max(.001, S.foam)}) translate(0 -4)`);
        set(E.spark, `scale(${S.spark})`); E.spark.setAttribute("opacity", S.sparkO);
        set(E.noz, `translate(0 ${S.noz})`); set(E.pis, `translate(0 ${S.pis})`);
        set(E.arm, `rotate(${S.arm} ${AH})`); set(E.spool, `rotate(${S.spool} ${SP})`);
        set(E.needle, `rotate(${S.needle + S.jit} ${ND})`); set(E.wheel, `rotate(${S.wheel} ${WH})`);
        cams.forEach(c => set(c, `translate(${S.cam} 0)`));
        set(track, `translate(${S.track} 0)`);
        set(E.endBack, `translate(${S.endx} ${S.endy})`); set(E.endFront, `translate(${S.endx} ${S.endy})`);
        const a1 = (Math.min(S.bx, X.end) - X.drop) / 13 * 57.3, a2 = S.track / 14 * 57.3;
        r1.forEach(r => set(r, `rotate(${a1.toFixed(1)} ${r.dataset.cx} ${r.dataset.cy})`));
        r2.forEach(r => set(r, `rotate(${a2.toFixed(1)} ${r.dataset.cx} ${r.dataset.cy})`));
        set(E.cleat1, `translate(${Math.min(S.bx, X.end) - X.drop} 0)`); set(E.cleat2, `translate(${S.track % 40} 0)`);
        // crate culling + shipped counter (a crate counts once it passes mid-screen)
        let n = 0;
        crates.forEach(c => { const x = +c.dataset.x + S.track; c.style.display = (x > v.x0 - CW - 140 && x < v.x1 + 140) ? "" : "none"; if (x + CW / 2 < 720) n++; });
        const sx = STACK_X + S.track; stackG.style.display = (sx > v.x0 - STACK_W - 140 && sx < v.x1 + 140) ? "" : "none";
        const out = sx + STACK_W / 2 < v.x1 ? 200 : n;
        if (out !== lastN) { lastN = out; count.textContent = out >= 200 ? "200+" : String(out).padStart(3, "0"); }
      };

      // idle life: only ticks while the section is near the viewport
      let near = true;
      ScrollTrigger.create({ trigger: st.trigger, start: "top bottom", end: "bottom top", onToggle: s => (near = s.isActive) });
      if (!K.reduced) {
        gsap.to(S, { wob: 1.4, duration: .9, yoyo: true, repeat: -1, ease: "sine.inOut" });
        gsap.to(S, { jit: 7, duration: .23, yoyo: true, repeat: -1, ease: "sine.inOut" });
        gsap.to(S, { wheel: 360, duration: 9, repeat: -1, ease: "none" });
        gsap.ticker.add(() => near && render());
      }

      // ---------- the one scrubbed timeline (duration 1 = whole section) ----------
      const tl = gsap.timeline({ defaults: { ease: "none" }, onUpdate: render,
        scrollTrigger: K.reduced ? undefined : { ...st, scrub: 1, invalidateOnRefresh: true } });
      const camTo = (bx, at, d, ease = "power2.inOut") => tl.to(S, { cam: () => cam(bx), duration: d, ease }, at);
      tl.set(S, { cam: () => cam(X.drop) }, 0);
      const move = (x, at, d) => { tl.to(S, { bx: x, duration: d, ease: "power2.inOut" }, at); camTo(x, at, d); };

      // crates roll right -> left the whole way; on phones the stack stops centre-stage, then the belt clears it
      tl.fromTo(S, { track: 0 }, { track: () => (narrow() ? trackMid() : trackEnd()), duration: .8 }, 0);
      tl.to(S, { track: () => trackEnd(), duration: .12, ease: "power1.inOut" }, .82);

      // 1 · drop in from the top edge, land with a squash
      tl.fromTo(S, { by: -40 }, { by: Y1, duration: .06, ease: "power2.in" }, 0)
        .fromTo(S, { tilt: -14 }, { tilt: 0, duration: .06, ease: "power1.in" }, 0)
        .to(S, { keyframes: [{ sy: .88, sx: 1.1, duration: .01 }, { sy: 1, sx: 1, duration: .025, ease: "back.out(3)" }] }, .06);

      // 2 · filler: nozzle in, gauge swings, foam rises, bottle shivers
      move(X.fill, .09, .06);
      tl.to(S, { noz: 46, duration: .025, ease: "power2.inOut" }, .155)
        .to(S, { needle: 60, duration: .07, ease: "power1.inOut" }, .16)
        .to(S, { foam: 1, duration: .05, ease: "back.out(2)" }, .175)
        .to(S, { keyframes: [{ by: Y1 - 2, duration: .01 }, { by: Y1, duration: .01 }, { by: Y1 - 1.5, duration: .01 }, { by: Y1, duration: .01 }] }, .18)
        .to(S, { noz: 0, duration: .025, ease: "power2.inOut" }, .235)
        .to(S, { needle: -60, duration: .04 }, .25)
        .to(S, { foam: .6, duration: .03 }, .255);

      // 3 · capper: piston slams, foam squashed, crown on, sparks
      move(X.cap, .28, .06);
      tl.to(S, { pis: 50, duration: .03, ease: "power4.in" }, .36)
        .to(S, { foam: 0, duration: .006 }, .384)
        .set(S, { crown: 0, crownO: 1 }, .39)
        .to(S, { spark: 1.3, sparkO: 1, duration: .012, ease: "power2.out" }, .39)
        .to(S, { spark: 2, sparkO: 0, duration: .02 }, .402)
        .to(S, { keyframes: [{ sy: .92, sx: 1.06, duration: .008 }, { sy: 1, sx: 1, duration: .025, ease: "elastic.out(1,.4)" }] }, .39)
        .to(S, { pis: 0, duration: .05, ease: "power2.inOut" }, .42);

      // 4 · labeller: spool feeds, arm swings down and slaps the label on
      move(X.label, .48, .06);
      tl.to(S, { spool: -220, duration: .1, ease: "power1.inOut" }, .55)
        .to(S, { arm: 92, duration: .035, ease: "power3.in" }, .56)
        .to(S, { lab: 1, duration: .02, ease: "power2.out" }, .59)
        .to(S, { keyframes: [{ tilt: -5, duration: .01 }, { tilt: 2.5, duration: .015 }, { tilt: 0, duration: .02 }] }, .594)
        .to(S, { arm: -8, duration: .05, ease: "power2.inOut" }, .63);

      // 5 · the empty crate rolls in, the bottle tips in, the crate sinks through the floor
      tl.to(S, { endx: X.crate - CW / 2, duration: .14, ease: "power2.out" }, .7);
      move(X.end, .72, .1);
      tl.to(S, { bx: X.land, duration: .07, ease: "power1.in" }, .845)
        .to(S, { by: Y2 - 12, duration: .07, ease: "power2.in" }, .845)
        .to(S, { keyframes: [{ tilt: 34, duration: .035, ease: "power1.out" }, { tilt: -6, duration: .025 }, { tilt: 0, duration: .02 }] }, .845);
      camTo(X.land - 40, .845, .07);
      tl.to(S, { by: "+=360", endy: "+=360", duration: .07, ease: "power2.in" }, .93);

      if (K.reduced) tl.progress(.66).pause();
      render();
    }
  });
})();
