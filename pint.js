/* Lager / Stout: the header pint is THE light switch (the pull-cord bulb is retired).
   1. BrewClock: with no saved choice the brewery keeps Portuguese hours — stout (dark) between sunset and sunrise in Portugal.
   2. The pint: a tiny glass in the header that shows the theme and toggles it (BrewTheme in rope.js).
      Lager bubbles rise; stout beads SINK (the famous surge).
   Load BEFORE rope.js (rope reads BrewClock for the first paint). */
(function () {
  const root = document.documentElement;
    const LAT = 39.6, LON = -8.0, TZ = "Europe/Lisbon";   // Portugal, roughly the middle — good to a few minutes

  // NOAA low-precision sunrise/sunset, in UTC minutes after midnight
  function sun(d = new Date()) {
    const start = Date.UTC(d.getUTCFullYear(), 0, 1), N = Math.floor((d - start) / 864e5) + 1, g = 2 * Math.PI / 365 * (N - 1);
    const eq = 229.18 * (.000075 + .001868 * Math.cos(g) - .032077 * Math.sin(g) - .014615 * Math.cos(2 * g) - .040849 * Math.sin(2 * g));
    const de = .006918 - .399912 * Math.cos(g) + .070257 * Math.sin(g) - .006758 * Math.cos(2 * g) + .000907 * Math.sin(2 * g) - .002697 * Math.cos(3 * g) + .00148 * Math.sin(3 * g);
    const la = LAT * Math.PI / 180, ha = Math.acos(Math.cos(90.833 * Math.PI / 180) / (Math.cos(la) * Math.cos(de)) - Math.tan(la) * Math.tan(de)) * 180 / Math.PI;
    return { rise: 720 - 4 * (LON + ha) - eq, set: 720 - 4 * (LON - ha) - eq };
  }
  window.BrewClock = {
    isNight(d = new Date()) { const s = sun(d), m = d.getUTCHours() * 60 + d.getUTCMinutes(); return m < s.rise || m > s.set; },
    label(d = new Date()) {
      const t = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(d);
      return `${t} in Portugal: ${this.isNight(d) ? "stout o'clock" : "lager weather"}`;
    }
  };

  // the header pint
  function pint() {
    const spot = document.getElementById("cordSpot"); if (!spot) return;
    const b = document.createElement("button");
    b.className = "pint"; b.type = "button";
    b.innerHTML = `<svg viewBox="0 0 28 40" aria-hidden="true"><defs><clipPath id="pintClip"><path d="M3 2H25L22.6 38H5.4Z"/></clipPath>
      <linearGradient id="pintSheen" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset=".18" stop-color="#fff" stop-opacity=".45"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
      <g clip-path="url(#pintClip)"><rect class="p-liq" x="0" y="9" width="28" height="31"/>
      ${[[8, 0], [13, .7], [18, 1.4], [11, 2.1], [20, .35], [15, 1.75]].map(([x, d]) => `<circle class="p-bub" cx="${x}" cy="36" r="${x % 2 ? .9 : 1.2}" style="animation-delay:-${d}s"/>`).join("")}
      <rect class="p-head" x="0" y="2" width="28" height="8"/></g>
      <path d="M3 2H25L22.6 38H5.4Z" fill="url(#pintSheen)"/><path d="M3 2H25L22.6 38H5.4Z" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="1.1"/></svg>
      <span class="pint-tip"></span>`;
    spot.before(b);
    const tip = b.querySelector(".pint-tip");
    const sync = () => {
      const dark = root.dataset.theme === "dark";
      b.dataset.beer = dark ? "stout" : "lager";
      b.setAttribute("aria-label", dark ? "Stout mode (lights off). Switch to lager mode" : "Lager mode (lights on). Switch to stout mode");
      tip.textContent = (dark ? "Stout on · " : "Lager on · ") + BrewClock.label();
    };
    // touch has no hover: flash the tooltip for a moment after a tap so the switch explains itself
    let tipT = 0, fizzT = 0;
    // the bubbles only run for a few seconds after load / a toggle (and on hover): no forever-repainting header
    const fizz = () => { b.classList.add("fizz"); clearTimeout(fizzT); fizzT = setTimeout(() => b.classList.remove("fizz"), 4200); };
    b.addEventListener("click", e => {
      window.BrewTheme && BrewTheme.toggle(); fizz();
      if (e.pointerType === "touch" || matchMedia("(hover: none)").matches) { b.classList.add("tip-on"); clearTimeout(tipT); tipT = setTimeout(() => b.classList.remove("tip-on"), 1800); }
    });
    document.addEventListener("brew:theme", sync); sync(); fizz(); setInterval(sync, 60000);
  }
  document.addEventListener("DOMContentLoaded", pint);
})();
