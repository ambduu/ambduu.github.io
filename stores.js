/* stores.html: every store from work.js as a filterable grid + a lightbox with the full screenshot. */
(function () {
  const WK = window.WORK, ST = WK.styles, ORDER = WK.order;
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const colOf = w => (ST.find(s => s.id === w.ind) || ST[0]).col;
  const $ = id => document.getElementById(id);
  const grid = $("grid"), chips = $("chips"), count = $("count"), lb = $("lb");

  // theme toggle (same localStorage key + values as the journey's header pint)
  document.querySelector(".sh-theme").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next; try { localStorage.setItem("brew-theme", next); } catch (e) {}
  });

  // chips: All + Shopify Plus + each industry
  const F = [{ id: "all", name: "All stores", n: ORDER.length }].concat(ST.map(s => ({ id: s.id, name: s.name, n: s.stores.length, col: s.col })));
  chips.innerHTML = F.map(f => `<button class="chip" type="button" data-f="${esc(f.id)}" aria-pressed="false"${f.col ? ` style="--c:${f.col}"` : ""}>${esc(f.name)} <sup>${f.n}</sup></button>`).join("");

  grid.innerHTML = ORDER.map((w, i) => `<li class="card" data-k="${w.key}">
      <button class="shot" type="button" data-i="${i}" aria-label="Larger screenshot of ${esc(w.name)}">
        <img src="${WK.thumb(w)}" srcset="${WK.thumb(w)} 256w, ${w.img} 1024w" sizes="(max-width: 640px) calc(100vw - 32px), 300px" data-full="${w.img}" width="256" height="160" alt="Screenshot of the live ${esc(w.name)} store" ${i > 5 ? 'loading="lazy"' : ""} decoding="async">
        ${w.plus ? '<span class="plus">Shopify Plus</span>' : ""}<span class="zoom" aria-hidden="true">View larger</span>
      </button>
      <div class="meta"><div><h2>${esc(w.name)}</h2><p><i style="--c:${colOf(w)}"></i>${esc(WK.indFor(w))}</p></div>
        <a class="btn" href="${w.url}" target="_blank" rel="noopener" aria-label="Visit the ${esc(w.name)} store (${w.domain}, opens in a new tab)">Visit store →</a></div>
    </li>`).join("");
  $("more").innerHTML = `Also on the shelf: ${WK.more.map(esc).join(" · ")} · and plenty more.`;

  const cards = [...grid.children];
  function filter(id, push) {
    const s = ST.find(x => x.id === id), set = s ? new Set(s.stores) : null;
    let n = 0;
    cards.forEach((c, i) => { const on = !set || set.has(ORDER[i]); c.hidden = !on; n += on; });
    chips.querySelectorAll(".chip").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.f === (s ? id : "all"))));
    count.textContent = s ? `${n} ${s.name} ${n === 1 ? "store" : "stores"}` : `All ${n} stores`;
    if (push) { try { history.replaceState(null, "", s ? "#" + encodeURIComponent(id) : location.pathname); } catch (e) {} }
  }
  chips.addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) filter(b.dataset.f, true); });
  filter(decodeURIComponent(location.hash.slice(1)) || "all", false);

  // sharper image on hover (swap the 256px thumb for the full capture once it has loaded)
  const sharpen = img => { if (img.dataset.done || /\.jpg/.test(img.currentSrc)) return; img.dataset.done = 1; const p = new Image(); p.onload = () => { img.removeAttribute("srcset"); img.src = p.src; }; p.src = img.dataset.full; };
  grid.addEventListener("pointerover", e => { const im = e.target.closest(".card")?.querySelector(".shot img"); if (im) sharpen(im); });

  // lightbox
  let last = null;
  const open = w => {
    $("lbImg").src = w.img; $("lbImg").alt = `Screenshot of the live ${w.name} store`;
    $("lbDom").textContent = w.domain; $("lbName").textContent = w.name;
    $("lbInd").textContent = WK.indFor(w) + (w.plus && w.ind ? " · Shopify Plus" : "");
    $("lbNote").textContent = WK.caseFor(w);
    $("lbGo").href = w.url; $("lbGo").setAttribute("aria-label", `Visit the ${w.name} store (${w.domain}, opens in a new tab)`);
    if (lb.showModal) lb.showModal(); else lb.setAttribute("open", "");
    $("lbGo").focus();
  };
  grid.addEventListener("click", e => { const b = e.target.closest(".shot"); if (b) { last = b; open(ORDER[+b.dataset.i]); } });
  const close = () => { lb.close ? lb.close() : lb.removeAttribute("open"); };
  $("lbX").addEventListener("click", close);
  lb.addEventListener("click", e => { if (e.target === lb) close(); });
  lb.addEventListener("close", () => last && last.focus());
})();
