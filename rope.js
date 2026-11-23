/* Lager (day) / Stout (night) theme. The pull-cord bulb is retired: the header pint (pint.js) is the only switch.
   Night mode = the brewery's lights go out and your cursor becomes a lantern (nightlights.js). */
(function () {
  const KEY = "brew-theme";
  const root = document.documentElement;
  let saved = null; try { saved = localStorage.getItem(KEY); } catch (e) {}
  // no saved choice -> the brewery keeps Portuguese hours (stout after sunset in Portugal)
  root.dataset.theme = saved === "dark" || saved === "light" ? saved : (window.BrewClock && BrewClock.isNight() ? "dark" : "light");
  function flip(next) {
    root.dataset.theme = next; try { localStorage.setItem(KEY, next); } catch (e) {}
    document.dispatchEvent(new CustomEvent("brew:theme", { detail: next }));
  }
  function toggle() {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    // the lights fade via the CSS transition on .night (nightlights.css). The old gsap tween on top of it fought
    // that transition: nothing visibly changed for the tween's 0.5s, then the fade ran (about 1.1s in all).
    flip(next);
  }
  window.BrewTheme = { toggle, set: next => { if (next !== root.dataset.theme) toggle(); } };
})();
