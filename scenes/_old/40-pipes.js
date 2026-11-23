/* 40 · PIPES — Apps & Back End.
   A copper brew kettle on a brick brewhouse wall. The bottle drops through the kettle's manway, the kettle rumbles,
   and the bottle is sucked into a copper pipe rollercoaster (with vellum "sight glass" sections so you can watch it race,
   a full loop-the-loop and a crossover). Beer fills the glass behind it, handwheels spin, gauges kick and paper
   luggage tags with the tech stack pop off the pipe as it passes. It exits through the floor. */
SCENES.push({
  id: "pipes", order: 40, height: 240, bg: "#6a2e1f", headerTone: "light",
  nav: { label: "Apps & Back End", href: "../apps.html" },
  html: (K) => {
    // seeded random so the wall is the same every load
    let sd = 40; const r = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    // paper brick courses: slightly irregular cut rectangles, two tones, very low contrast
    let bricks = "";
    for (let row = 0, y = -260; y < 1200; row++, y += 46) {
      for (let x = -260 + (row % 2) * 58 - r() * 30; x < 1700; x += 118) {
        if (r() < .3) continue;
        const w = 104 + r() * 8, h = 38 + r() * 3, c = ["#73331f", "#64291b", "#6f3220", "#5c2618"][Math.floor(r() * 4)];
        bricks += `<rect x="${x.toFixed(0)}" y="${(y + r() * 3).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${c}" transform="rotate(${(r() - .5) * 1.4} ${x.toFixed(0)} ${y})"/>`;
      }
    }
    // steam puffs (each a cluster of paper circles)
    const puff = (i) => `<g class="p-puff" data-i="${i}" filter="url(#sh2)"><circle cx="0" cy="0" r="26" fill="#f6efe4"/><circle cx="24" cy="6" r="20" fill="#efe5d4"/><circle cx="-20" cy="8" r="17" fill="#fbf6ec"/><circle cx="6" cy="-18" r="16" fill="#fbf6ec"/></g>`;
    // flames under the kettle
    const flame = (x, s, c1, c2) => `<g class="p-flame" transform="translate(${x} 846) scale(${s})"><path d="M0 0 C-22 -6 -24 -40 0 -78 C 4 -50 26 -36 18 -10 C 14 0 6 2 0 0Z" fill="${c1}"/><path d="M2 -2 C-10 -8 -10 -28 2 -46 C 6 -30 14 -22 10 -8 C 8 -2 5 -1 2 -2Z" fill="${c2}"/></g>`;
    // pipes: A = kettle outlet -> loop; B = crossover -> exit (drawn on top so it really crosses in front)
    const PA = "M740 640 L880 640 C980 640 1150 620 1150 450 C1150 330 1080 280 1010 280 C930 280 860 340 860 440";
    const PB = "M860 440 C860 560 960 660 1100 690 C1200 712 1236 770 1236 846 L1236 1010";
    const pipe = (id, d) => `<g id="p-${id}" filter="url(#sh2)">
        <path class="p-glass" d="${d}" fill="none" stroke="#fbeedb" stroke-opacity=".42" stroke-width="86"/><path d="${d}" fill="none" stroke="#3d160c" stroke-opacity=".5" stroke-width="72"/>
        <path class="p-beer" d="${d}" fill="none" stroke="#e9a03a" stroke-width="58"/>
        <path class="p-foam" d="${d}" fill="none" stroke="#fff6e2" stroke-width="58"/>
        <g class="p-bot">${K.bottle(0, -76, { s: .45 })}</g>
        <g class="p-cu">
          <path d="${d}" fill="none" stroke="#8f4719" stroke-width="88"/>
          <path d="${d}" fill="none" stroke="#c97a3a" stroke-width="70" transform="translate(-3 -5)"/>
          <path d="${d}" fill="none" stroke="#dc9452" stroke-width="22" transform="translate(-8 -20)"/>
        </g>
        <g class="p-gf"><path d="${d}" fill="none" stroke="#ffffff" stroke-opacity=".5" stroke-width="7" transform="translate(-6 -24)"/><path d="${d}" fill="none" stroke="#ffffff" stroke-opacity=".22" stroke-width="16" transform="translate(4 18)"/></g>
        <g class="p-joints"></g>
      </g>`;
    // tech tags: [big, small, paper, ink, anchor fraction on the pipe, hole x, hole y]
    const TAGS = [["GraphQL", "Admin API", "#fff6e2", "#c46a1f", .05, 830, 712], ["Webhooks", "", "#f2c14e", "#2b1a12", .24, 1312, 560],
      ["Java", "Spring Boot", "#fff6e2", "#2b1a12", .44, 1000, 345], ["Node", "", "#9ccf55", "#1f3a10", .74, 985, 762],
      ["PHP", "", "#a9c3e8", "#1f2c48", .82, 1338, 742], ["MySQL", "", "#fff6e2", "#c46a1f", .79, 1122, 796]];
    const tag = ([t, sub, bg, fg, f, hx, hy], i) => {
      const w = Math.max(t.length * 15 + 40, sub.length * 8.5 + 40), h = sub ? 84 : 66;
      return `<g class="p-tag" data-i="${i}" data-f="${f}" data-hx="${hx}" data-hy="${hy}" transform="translate(${hx} ${hy})"><g class="p-swing"><path class="p-tstr" d="M0 0 L0 0" stroke="#efe6d6" stroke-width="3" fill="none"/><g class="p-tagin">
        <g filter="url(#sh3)"><path d="M${-w / 2} 14 L-16 0 H16 L${w / 2} 14 V${h} H${-w / 2}Z" fill="${bg}"/>
        <path d="M${-w / 2} ${h - 10} H${w / 2} V${h} H${-w / 2}Z" fill="#000" opacity=".08"/>
        <circle cx="0" cy="13" r="8" fill="#d6c7a8"/><circle cx="0" cy="13" r="4" fill="#6a2e1f"/>
        ${sub ? `<text x="0" y="${h - 46}" text-anchor="middle" font-family="Archivo, Arial" font-weight="800" font-size="12" letter-spacing="1.5" fill="${fg}" opacity=".7">${sub.toUpperCase()}</text>` : ""}
        <text x="0" y="${h - 18}" text-anchor="middle" font-family="Archivo Black, Arial Black, Arial" font-weight="900" font-size="23" fill="${fg}">${t}</text></g>
      </g></g></g>`;
    };
    return K.svg(`
      <g id="p-world">
        <rect x="-900" y="-400" width="3240" height="1700" fill="#6a2e1f"/>
        <g filter="url(#sh1)">${bricks}</g>
        <!-- swan-neck vapour pipe from the kettle dome into the wall -->
        <g filter="url(#sh2)">
          <path d="M410 400 C410 372 380 372 320 372 L-40 372" fill="none" stroke="#8f4719" stroke-width="52"/>
          <path d="M410 400 C410 372 380 372 320 372 L-40 372" fill="none" stroke="#c97a3a" stroke-width="40" transform="translate(-2 -4)"/>
          <path d="M410 400 C410 372 380 372 320 372 L-40 372" fill="none" stroke="#e39a55" stroke-width="10" transform="translate(-6 -14)"/>
          <rect x="160" y="342" width="20" height="62" fill="#d9a441"/><rect x="160" y="374" width="20" height="30" fill="#b8862e"/>
        </g>
        <!-- floor shelf -->
        <g filter="url(#sh2)"><rect x="-200" y="850" width="1150" height="40" fill="#9c6a3c"/><rect x="-200" y="850" width="1150" height="10" fill="#b98653"/><rect x="-200" y="880" width="1150" height="40" fill="#7b4f2a"/></g>
        <g id="p-steam">${[0, 1, 2, 3, 4].map(puff).join("")}</g>
        ${pipe("A", PA)}
        ${pipe("B", PB)}
        <!-- kettle -->
        <g id="p-kettle">
          <g filter="url(#sh1)"><rect x="392" y="760" width="22" height="92" fill="#5a2a12"/><rect x="706" y="760" width="22" height="92" fill="#5a2a12"/><rect x="549" y="760" width="22" height="92" fill="#4a220e"/></g>
          <g id="p-flames">${flame(470, 1, "#e2463a", "#f2c14e")}${flame(520, 1.25, "#f08a2c", "#ffe27a")}${flame(580, .95, "#e2463a", "#f2c14e")}${flame(640, 1.2, "#f08a2c", "#ffe27a")}${flame(690, .9, "#e2463a", "#f2c14e")}</g>
          <g filter="url(#sh3)">
            <!-- manway collar + hinged lid (behind dome rim) -->
            <rect x="508" y="286" width="104" height="54" fill="#a95f27"/><rect x="508" y="286" width="30" height="54" fill="#8f4b1d"/>
            <g id="p-lid"><rect x="498" y="274" width="124" height="16" fill="#e39a55"/><rect x="498" y="284" width="124" height="6" fill="#c97a3a"/><rect x="546" y="262" width="28" height="14" fill="#d9a441"/></g>
            <!-- dome -->
            <path d="M356 456 Q358 336 560 322 Q762 336 764 456Z" fill="#d88a45"/>
            <path d="M356 456 Q358 336 560 322 Q450 340 420 456Z" fill="#b8672d"/>
            <path d="M600 330 Q720 348 742 420 Q700 360 600 338Z" fill="#f0b071"/>
            <!-- vent -->
            <rect x="678" y="300" width="24" height="44" fill="#a95f27"/><rect x="672" y="294" width="36" height="12" fill="#d9a441"/>
            <!-- body -->
            <path d="M360 450 V716 Q360 800 444 800 H676 Q760 800 760 716 V450Z" fill="#c97a3a"/>
            <path d="M360 450 V716 Q360 800 444 800 H452 Q404 790 408 716 V450Z" fill="#9f5523"/>
            <path d="M624 450 H664 V800 H624Z" fill="#dc9452" opacity=".85"/>
            <path d="M676 450 H692 V800 H676Z" fill="#e8a868" opacity=".7"/>
            <rect x="356" y="446" width="408" height="22" fill="#a95f27"/><rect x="356" y="446" width="408" height="6" fill="#d88a45"/>
            ${Array.from({ length: 13 }, (_, i) => `<circle cx="${376 + i * 31.5}" cy="461" r="3.2" fill="#e8b07a"/>`).join("")}
            <rect x="356" y="740" width="408" height="16" fill="#a95f27" opacity=".7"/>
            <!-- outlet flange -->
            <rect x="756" y="600" width="26" height="80" fill="#d9a441"/><rect x="756" y="640" width="26" height="40" fill="#b8862e"/>
            <!-- sight glass with boiling wort -->
            <circle cx="470" cy="600" r="54" fill="#d9a441"/><circle cx="470" cy="606" r="54" fill="#b8862e" opacity=".5"/>
            <circle cx="470" cy="600" r="44" fill="#3a1a0c"/>
            <clipPath id="p-sgclip"><circle cx="470" cy="600" r="44"/></clipPath>
            <g clip-path="url(#p-sgclip)"><g id="p-wort"><rect x="420" y="606" width="100" height="80" fill="#e9a03a"/><rect x="420" y="606" width="100" height="10" fill="#fff6e2"/></g>
              ${[0, 1, 2, 3, 4, 5].map(i => `<circle class="p-sgb" cx="${440 + i * 12}" cy="660" r="${3 + (i % 3) * 2}" fill="#fff6e2" opacity=".9"/>`).join("")}
              <path d="M430 570 Q450 556 476 558 L470 566 Q452 566 438 576Z" fill="#fff" opacity=".35"/></g>
            <!-- thermometer dial -->
            <circle cx="652" cy="572" r="44" fill="#d9a441"/><circle cx="652" cy="572" r="36" fill="#fff6e2"/>
            ${Array.from({ length: 9 }, (_, i) => { const a = (-210 + i * 30) * Math.PI / 180; return `<rect x="-1.5" y="-30" width="3" height="${i % 2 ? 6 : 10}" fill="#2b1a12" transform="translate(652 572) rotate(${-120 + i * 30})"/>`; }).join("")}
            <g id="p-therm"><path d="M-3 4 L0 -28 L3 4Z" fill="#e2463a" transform="translate(652 572)"/></g>
            <circle cx="652" cy="572" r="5" fill="#2b1a12"/>
            <rect x="618" y="592" width="68" height="14" fill="#f3ead8"/>
            <text x="652" y="603" text-anchor="middle" font-family="Archivo Black, Arial Black, Arial" font-size="10" fill="#c46a1f">°C BOIL</text>
            <!-- brass plate -->
            <rect x="498" y="680" width="124" height="44" fill="#d9a441"/><rect x="498" y="712" width="124" height="12" fill="#b8862e"/>
            <text x="560" y="709" text-anchor="middle" font-family="Archivo Black, Arial Black, Arial" font-size="18" fill="#5a2a12">HOT SIDE</text>
          </g>
        </g>
        <g id="p-gear"></g>
        <g id="p-tags">${TAGS.map(tag).join("")}</g>
      </g>`) +
      K.label({ title: "Apps &amp; Back&nbsp;End", href: "../apps.html", text: "Custom and public apps, APIs and the back end behind them. The bit where the store learns new tricks.", left: "5%", top: "13%" }) +
      `<ul class="p-sr"><li>Admin GraphQL</li><li>Webhooks</li><li>Java · Spring Boot</li><li>Node</li><li>PHP</li><li>MySQL</li></ul>
      <style>
        #pipes .kb-label { max-width: min(34vw, 470px); }
        .p-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
        @media (max-aspect-ratio: 9/10) {
          #pipes .kb-label { left: 16px !important; right: 16px; top: auto !important; bottom: 3vh; max-width: none; font-size: 34px; padding: 18px 20px; background: #4e2015; box-shadow: 3px 5px 0 rgba(0,0,0,.22), 14px 24px 34px rgba(0,0,0,.3); }
          #pipes .kb-label small { max-width: 30em; }
        }
      </style>`;
  },
  init: (stage, K, st) => {
    const $ = (s) => stage.querySelector(s), $$ = (s) => [...stage.querySelectorAll(s)];
    const NS = "http://www.w3.org/2000/svg";
    const world = $("#p-world");
    const pA = $("#p-A .p-beer"), pB = $("#p-B .p-beer");
    const LA = pA.getTotalLength(), LB = pB.getTotalLength(), L = LA + LB;
    const at = (d) => { // point + tangent angle on the joined path
      const p = d <= LA ? pA : pB, l = Math.max(0, Math.min(d <= LA ? d : d - LA, d <= LA ? LA : LB));
      const a = p.getPointAtLength(Math.max(0, l - 1)), b = p.getPointAtLength(l + 1), c = p.getPointAtLength(l);
      return { x: c.x, y: c.y, a: Math.atan2(b.y - a.y, b.x - a.x) };
    };
    // sight-glass (vellum) windows along the run, as distances along the joined path
    const G = [[.12, .27], [.36, .53], [.64, .82]].map(([a, b]) => [a * L, b * L]);
    const dash = (from, len, wantGlass) => { // dasharray for one sub-path
      const segs = []; let cur = 0, on = !wantGlass; const edges = [];
      G.forEach(([a, b]) => { edges.push(a - from, b - from); });
      const e = edges.map(v => Math.max(0, Math.min(len, v)));
      let arr = [], last = 0; // copper first, then glass, alternate
      const bounds = [0, ...e, len];
      for (let i = 0; i < bounds.length - 1; i++) arr.push(Math.max(.001, bounds[i + 1] - bounds[i]));
      if (wantGlass) arr.unshift(0.001); // start with a gap so glass segments are drawn
      return arr.join(" ");
    };
    [["#p-A", 0, LA], ["#p-B", LA, LB]].forEach(([id, from, len]) => {
      $$(`${id} .p-cu path`).forEach(p => p.setAttribute("stroke-dasharray", dash(from, len, false)));
      $$(`${id} .p-gf path`).forEach(p => p.setAttribute("stroke-dasharray", dash(from, len, true)));
      ["p-beer", "p-foam"].forEach(c => { const p = $(`${id} .${c}`); p.setAttribute("stroke-dasharray", `${len} ${len + 200}`); p.setAttribute("stroke-dashoffset", len); });
    });
    // brass joints at every glass edge + a few extra
    const el = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); parent && parent.appendChild(n); return n; };
    const jointAt = (d) => {
      const { x, y, a } = at(d), g = el("g", { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(a * 180 / Math.PI).toFixed(1)})` }, $(d <= LA ? "#p-A .p-joints" : "#p-B .p-joints"));
      el("rect", { x: -12, y: -55, width: 24, height: 110, fill: "#d9a441" }, g);
      el("rect", { x: -12, y: 8, width: 24, height: 47, fill: "#b8862e" }, g);
      el("rect", { x: -12, y: -55, width: 6, height: 110, fill: "#f0c766" }, g);
      [-40, 40].forEach(v => el("circle", { cx: 0, cy: v, r: 4, fill: "#8a6420" }, g));
    };
    G.flat().forEach(jointAt); [.05, .6, .9].forEach(f => jointAt(f * L));
    // little "psst" of paper steam that escapes from a joint as the bottle rushes through it
    const puffs = G.flat().map(d => {
      const { x, y, a } = at(d), nx = Math.sin(a), ny = -Math.cos(a), s = ny < 0 ? 1 : -1; // normal pointing up-ish
      const g = el("g", { filter: "url(#sh2)", opacity: 0 }, $("#p-gear"));
      [[0, 0, 16], [14, -8, 12], [-12, -6, 11]].forEach(([u, v, rr], k) => el("circle", { cx: u, cy: v, r: rr, fill: ["#f6efe4", "#efe5d4", "#fbf6ec"][k] }, g));
      gsap.set(g, { x: x + nx * s * 44, y: y + ny * s * 44, scale: .2 });
      return { g, d, dx: nx * s * 70, dy: ny * s * 70, x: x + nx * s * 44, y: y + ny * s * 44, done: false };
    });
    // handwheel valves and pressure gauges standing on the pipe
    const gear = $("#p-gear");
    // a stem from the pipe surface out to (cx,cy); the fitting itself stays upright
    const stem = (g, x, y, cx, cy, w = 14) => {
      const len = Math.hypot(cx - x, cy - y), ang = Math.atan2(cy - y, cx - x) * 180 / Math.PI;
      el("rect", { x: 30, y: -w / 2, width: len - 30, height: w, fill: "#8a6420", transform: `translate(${x} ${y}) rotate(${ang})` }, g);
      el("rect", { x: 40, y: -w / 2 - 5, width: 16, height: w + 10, fill: "#b8862e", transform: `translate(${x} ${y}) rotate(${ang})` }, g);
    };
    const dirs = { up: [0, -1], right: [1, 0], left: [-1, 0] };
    const wheels = [[.025, "up", 96], [.915, "right", 98]].map(([f, dir, D]) => {
      const { x, y } = at(f * L), [ux, uy] = dirs[dir], cx = x + ux * D, cy = y + uy * D, g = el("g", { filter: "url(#sh3)" }, gear);
      stem(g, x, y, cx, cy);
      const w = el("g", { transform: `translate(${cx} ${cy})` }, g), spin = el("g", {}, w);
      el("path", { d: "M-38 0a38 38 0 1 0 76 0a38 38 0 1 0 -76 0ZM-27 0a27 27 0 1 1 54 0a27 27 0 1 1 -54 0Z", fill: "#e2463a", "fill-rule": "evenodd" }, spin);
      el("path", { d: "M-38 0a38 38 0 0 0 76 0h-11a27 27 0 0 1 -54 0Z", fill: "#b8322a" }, spin);
      [0, 60, 120].forEach(r => el("rect", { x: -32, y: -4, width: 64, height: 8, fill: "#c93a30", transform: `rotate(${r})` }, spin));
      el("circle", { r: 9, fill: "#f2c14e" }, spin);
      return { node: spin, d: f * L };
    });
    const gauges = [[.44, "up", 112], [.3, "right", 118]].map(([f, dir, D]) => {
      const p = at(f * L), [ux, uy] = dirs[dir], x = p.x + ux * D, y = p.y + uy * D, g = el("g", { filter: "url(#sh3)" }, gear);
      stem(g, p.x, p.y, x, y, 12);
      el("circle", { cx: x, cy: y, r: 44, fill: "#d9a441" }, g);
      el("circle", { cx: x + 3, cy: y + 4, r: 44, fill: "#b8862e", opacity: .4 }, g);
      el("circle", { cx: x, cy: y, r: 35, fill: "#fff6e2" }, g);
      el("path", { d: `M${x - 30} ${y} A30 30 0 0 1 ${x - 21} ${y - 21}`, stroke: "#7cc243", "stroke-width": 7, fill: "none" }, g);
      el("path", { d: `M${x + 21} ${y - 21} A30 30 0 0 1 ${x + 30} ${y}`, stroke: "#e2463a", "stroke-width": 7, fill: "none" }, g);
      for (let i = 0; i < 7; i++) el("rect", { x: -1.2, y: -31, width: 2.4, height: 7, fill: "#2b1a12", transform: `translate(${x} ${y}) rotate(${-90 + i * 30})` }, g);
      const n = el("g", { transform: `translate(${x} ${y})` }, g), nd = el("g", {}, n);
      el("path", { d: "M-3 6 L0 -30 L3 6Z", fill: "#2b1a12" }, nd);
      el("circle", { r: 5, fill: "#e2463a" }, n);
      gsap.set(nd, { svgOrigin: "0 0", rotation: -80 });
      return { node: nd, d: f * L };
    });
    // place the tags hanging below their anchor points
    const tags = $$(".p-tag").map((t) => {
      const f = +t.dataset.f, hx = +t.dataset.hx, hy = +t.dataset.hy, { x, y } = at(f * L);
      const str = t.querySelector(".p-tstr"), inner = t.querySelector(".p-tagin");
      str.setAttribute("d", `M${(x - hx).toFixed(1)} ${(y - hy).toFixed(1)} L0 13`); // string from the pipe to the tag hole
      gsap.set(inner, { svgOrigin: "0 13", scale: 0, rotation: -25 }); gsap.set(str, { opacity: 0 });
      return { node: inner, str, swing: t.querySelector(".p-swing"), pivot: `${(x - hx).toFixed(1)} ${(y - hy).toFixed(1)}`, d: f * L, shown: false };
    });

    const botA = $("#p-A .p-bot"), botB = $("#p-B .p-bot");
    const lid = $("#p-lid"), kettle = $("#p-kettle");
    gsap.set(lid, { svgOrigin: "622 282" });
    const S = { d: 0, fall: 0, cam: 560 };
    // mobile "camera": on portrait screens pan the world so the bottle stays in view
    const portrait = () => innerWidth / innerHeight < .9;
    const applyCam = (bx) => {
      if (!portrait()) { gsap.set(world, { x: 0 }); return; }
      const c = Math.max(560, Math.min(1120, bx)); gsap.set(world, { x: 720 - c });
    };
    const render = () => {
      const d = S.d;
      if (d <= 0) { // falling into the manway
        const y = -100 + S.fall * 460; // cap goes from above the stage into the kettle
        gsap.set(botA, { x: 560, y, rotation: 0, scaleX: 1 - S.fall * .15, scaleY: 1 + S.fall * .2, visibility: S.fall > 0 ? "visible" : "hidden" });
        gsap.set(botB, { visibility: "hidden" });
        applyCam(560);
      } else {
        const p = at(Math.min(d, L - 1)), onA = d <= LA;
        const b = onA ? botA : botB, o = onA ? botB : botA;
        let x = p.x, y = p.y, rot = p.a * 180 / Math.PI + 90;
        if (d >= L - 1) { y = p.y + (d - L); }
        gsap.set(b, { x, y, rotation: rot, scaleX: 1, scaleY: 1, visibility: "visible" }); gsap.set(o, { visibility: "hidden" });
        applyCam(x);
      }
      // beer fills the run behind the bottle
      const dA = Math.max(0, Math.min(LA, d - 60)), dB = Math.max(0, Math.min(LB, d - 60 - LA));
      pA.setAttribute("stroke-dashoffset", LA - dA); pB.setAttribute("stroke-dashoffset", LB - dB);
      const fA = $("#p-A .p-foam"), fB = $("#p-B .p-foam");
      const qA = Math.max(0, Math.min(LA, d - 60)), qB = Math.max(0, Math.min(LB, d - 60 - LA));
      // foam = a short white head right behind the bottle
      fA.setAttribute("stroke-dasharray", `0 ${Math.max(0, qA - 26)} ${qA > 0 && qA < LA ? 26 : 0} ${LA * 2}`);
      fB.setAttribute("stroke-dasharray", `0 ${Math.max(0, qB - 26)} ${qB > 0 && qB < LB ? 26 : 0} ${LB * 2}`);
      // valves spin with the flow, gauges kick as the bottle rushes past
      wheels.forEach((w, i) => gsap.set(w.node, { svgOrigin: "0 0", rotation: Math.max(0, d - w.d + 300) * (i % 2 ? -.9 : .9) }));
      gauges.forEach(g => { const k = Math.exp(-(((d - g.d) / 180) ** 2)); gsap.set(g.node, { svgOrigin: "0 0", rotation: -80 + (d > g.d ? 70 : 0) + 90 * k }); });
      puffs.forEach(p => {
        const past = d > p.d;
        if (past && !p.done) { p.done = true; gsap.fromTo(p.g, { x: p.x, y: p.y, scale: .2, opacity: 1 }, { x: p.x + p.dx, y: p.y + p.dy, scale: 1.4, opacity: 0, duration: 1.1, ease: "power2.out" }); }
        if (!past) p.done = false;
      });
      tags.forEach(t => {
        const want = d > t.d - 40;
        if (want !== t.shown) { t.shown = want; gsap.to(t.node, want ? { scale: 1, rotation: 0, duration: 1, ease: "elastic.out(1,.45)" } : { scale: 0, rotation: -25, duration: .3, ease: "power2.in" }); gsap.to(t.str, { opacity: want ? 1 : 0, duration: .2 }); }
      });
    };

    // idle life: steam, flames, boiling sight glass, gently swinging tags
    if (!K.reduced) {
      $$(".p-puff").forEach((p, i) => {
        gsap.fromTo(p, { x: 690, y: 290, scale: .3, opacity: 0 }, { x: 690 + 40 + i * 6, y: 60, scale: 1.5, opacity: 0, keyframes: { opacity: [0, 1, 1, 0] }, duration: 4.2, repeat: -1, delay: i * .84, ease: "sine.out" });
      });
      $$(".p-flame").forEach((f, i) => gsap.to(f, { scaleY: "+=.25", scaleX: "-=.08", duration: .28 + i * .05, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "50% 100%" }));
      $$(".p-sgb").forEach((b, i) => gsap.fromTo(b, { attr: { cy: 650 } }, { attr: { cy: 606 }, duration: 1 + (i % 3) * .3, repeat: -1, delay: i * .2, ease: "none" }));
      gsap.to("#p-wort", { y: -4, duration: .5, yoyo: true, repeat: -1, ease: "sine.inOut" });
      tags.forEach((t, i) => gsap.fromTo(t.swing, { rotation: i % 2 ? -3 : 3 }, { rotation: i % 2 ? 3 : -3, svgOrigin: t.pivot, duration: 1.8 + i * .3, yoyo: true, repeat: -1, ease: "sine.inOut" }));
      gsap.to("#p-therm", { rotation: 6, svgOrigin: "652 572", duration: .9, yoyo: true, repeat: -1, ease: "sine.inOut" });
    }
    if (K.reduced) { S.d = L * .55; render(); tags.forEach(t => { gsap.set(t.node, { scale: 1, rotation: 0 }); gsap.set(t.str, { opacity: 1 }); }); return; }

    CustomWiggle.create("pRumble", { wiggles: 14, type: "uniform" });
    const tl = gsap.timeline({ scrollTrigger: { ...st, scrub: 1 }, onUpdate: render });
    tl.to(lid, { rotation: 118, duration: .06, ease: "back.out(2)" }, 0)
      .to(S, { fall: 1, duration: .14, ease: "power1.in" }, .02)
      .to(lid, { rotation: 0, duration: .04, ease: "bounce.out" }, .16)
      .to(kettle, { x: 5, duration: .1, ease: "pRumble" }, .16)
      .to("#p-therm", { rotation: 200, svgOrigin: "652 572", duration: .1, ease: "power2.out" }, .16)
      .to("#p-flames", { scaleY: 1.5, svgOrigin: "580 846", duration: .08, yoyo: true, repeat: 1 }, .16)
      .to(S, { d: L + 260, duration: .7, ease: CustomEase.create("pRide", "M0,0 C0.18,0.02 0.28,0.18 0.4,0.36 0.52,0.54 0.58,0.56 0.7,0.7 0.84,0.86 0.9,0.94 1,1") }, .26);
    render();
    addEventListener("resize", render);
  }
});
