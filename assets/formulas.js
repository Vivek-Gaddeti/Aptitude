/* Cheat sheet page: renders window.FORMULAS (one card per topic) and window.CHEAT_TABLES (memory tables) into #content.
   Data comes from data/formulas/*.js. Search filters live, chips switch sections, "/" focuses the search, Print gives a clean two-column page. */
(function () {
  const SEC_ORDER = ["quant", "reasoning", "verbal", "di"];
  const SEC_NAME = { quant: "Quant", reasoning: "Reasoning", verbal: "Verbal", di: "DI", tables: "Tables" };
  const SEC_COLOR = { quant: "#FF8AB0", reasoning: "#3DDC84", verbal: "#FFD23F", di: "#8EC5FF", tables: "#FF9F5A" };

  const CSS = `
#content.ch-page { max-width: 1240px; }
.ch-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 1rem 2rem; margin-bottom: 1.1rem; }
.ch-head h1 { margin: 0 0 .3rem; font-family: var(--display); font-size: var(--fs-2xl); letter-spacing: -.01em; }
.ch-lead { margin: 0; color: var(--muted); max-width: 46rem; font-size: var(--fs-md); line-height: 1.55; }
.ch-bar { display: flex; flex-wrap: wrap; align-items: center; gap: .6rem; margin-bottom: .9rem; }
.ch-search { position: relative; flex: 1 1 18rem; max-width: 30rem; }
.ch-search .ico { position: absolute; left: .8rem; top: 50%; width: 1.05rem; height: 1.05rem; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
.ch-search input { width: 100%; box-sizing: border-box; padding: .62rem 2.6rem .62rem 2.4rem; border: 1px solid var(--border); border-radius: var(--r-pill); background: var(--panel); color: var(--text); font: inherit; font-size: var(--fs-md); outline: none; }
.ch-search input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
.ch-search kbd { position: absolute; right: .75rem; top: 50%; transform: translateY(-50%); font: inherit; font-size: var(--fs-2xs); color: var(--muted); border: 1px solid var(--border); border-radius: var(--r-xs); padding: .05rem .38rem; background: var(--panel-2); pointer-events: none; }
.ch-search input:not(:placeholder-shown) ~ kbd { display: none; }
.ch-chips { display: flex; flex-wrap: wrap; gap: .4rem; }
.ch-chip { display: inline-flex; align-items: center; gap: .4rem; padding: .42rem .85rem; border: 1px solid var(--border); border-radius: var(--r-pill); background: var(--panel); color: var(--muted); font: inherit; font-size: var(--fs-sm); font-weight: 600; cursor: pointer; }
.ch-chip i { font-style: normal; font-size: var(--fs-2xs); opacity: .75; font-weight: 600; }
.ch-chip:hover { color: var(--text); background: var(--panel-2); }
.ch-chip[aria-pressed="true"] { color: var(--accent); background: var(--accent-soft); border-color: color-mix(in srgb, var(--accent) 40%, var(--border)); }
.ch-print { margin-left: auto; display: inline-flex; align-items: center; gap: .45rem; padding: .5rem .95rem; border: 1px solid var(--border); border-radius: var(--r-pill); background: var(--panel); color: var(--text); font: inherit; font-size: var(--fs-sm); font-weight: 600; cursor: pointer; }
.ch-print:hover { background: var(--panel-2); }
.ch-print .ico { width: 1rem; height: 1rem; }
.ch-body { display: grid; grid-template-columns: 13.5rem minmax(0, 1fr); gap: 1.6rem; align-items: start; }
.ch-toc { position: sticky; top: calc(var(--top-h, 60px) + 1rem); max-height: calc(100vh - var(--top-h, 60px) - 2rem); overflow: auto; font-size: var(--fs-sm); padding-right: .3rem; scrollbar-width: thin; }
.ch-toc h2 { margin: 1rem .5rem .3rem; font-size: var(--fs-2xs); text-transform: uppercase; letter-spacing: .08em; color: var(--muted); font-weight: 700; }
.ch-toc h2:first-child { margin-top: 0; }
.ch-toc a { display: block; padding: .26rem .5rem; border-radius: var(--r-sm); color: var(--muted); text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ch-toc a:hover { color: var(--text); background: var(--panel-2); }
.ch-toc a.on { color: var(--accent); background: var(--accent-soft); }
.ch-toc [hidden] { display: none; }
.ch-cards { display: flex; flex-direction: column; gap: 1rem; min-width: 0; }
.ch-sechead { margin: .6rem 0 -.2rem; display: flex; align-items: center; gap: .6rem; font-family: var(--display); font-size: var(--fs-lg); font-weight: 800; }
.ch-sechead::before { content: ""; width: .6rem; height: .6rem; border-radius: 50%; background: var(--dot); }
.ch-sechead:first-child { margin-top: 0; }
.ch-card { scroll-margin-top: calc(var(--top-h, 60px) + 1rem); background: var(--panel); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); padding: 1rem 1.2rem 1.1rem; min-width: 0; }
.ch-card[hidden], .ch-grid[hidden], .ch-lists[hidden], .ch-lists > div[hidden], .ch-sechead[hidden], .ch-row[hidden], .ch-card li[hidden], .ch-empty[hidden], .ch-empty-all[hidden] { display: none; }
.ch-ct { display: flex; align-items: center; gap: .7rem; margin-bottom: .55rem; }
.ch-ct h3 { margin: 0; font-family: var(--display); font-size: var(--fs-lg); font-weight: 800; }
.ch-tag { font-size: var(--fs-2xs); font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--tagc); background: color-mix(in srgb, var(--tagc) 12%, var(--panel)); padding: .12rem .5rem; border-radius: var(--r-pill); }
.ch-pr { margin-left: auto; display: inline-flex; align-items: center; gap: .3rem; color: var(--accent); font-size: var(--fs-sm); font-weight: 600; text-decoration: none; white-space: nowrap; }
.ch-pr:hover { text-decoration: underline; }
.ch-pr .ico { width: .95rem; height: .95rem; }
.ch-grid { display: grid; grid-template-columns: minmax(7rem, .8fr) minmax(0, 1.9fr) minmax(0, 1.2fr); column-gap: .9rem; }
.ch-row { display: grid; grid-template-columns: subgrid; grid-column: 1 / -1; align-items: start; padding: .42rem 0; border-top: 1px solid var(--border); }
.ch-row:first-child { border-top: 0; }
.ch-n { font-weight: 650; font-size: var(--fs-sm); padding-top: .22rem; }
.ch-f { display: inline-block; justify-self: start; font-family: var(--mono); font-size: .83rem; line-height: 1.5; background: var(--panel-2); border: 1px solid var(--border); border-radius: var(--r-sm); padding: .2rem .55rem; overflow-wrap: anywhere; white-space: pre-wrap; max-width: 100%; }
.ch-card[data-sec="verbal"] .ch-f { font-family: var(--sans); font-size: var(--fs-sm); line-height: 1.5; }
.ch-note { color: var(--muted); font-size: var(--fs-sm); line-height: 1.5; padding-top: .22rem; }
.ch-note code, .ch-card li code { font-family: var(--mono); font-size: .85em; background: var(--panel-2); padding: .04rem .3rem; border-radius: var(--r-xs); }
.ch-lists { display: grid; grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr)); gap: .4rem 1.6rem; margin-top: .7rem; padding-top: .7rem; border-top: 1px dashed var(--border); }
.ch-lists h4 { margin: 0 0 .25rem; font-size: var(--fs-2xs); text-transform: uppercase; letter-spacing: .08em; font-weight: 700; display: flex; align-items: center; gap: .35rem; }
.ch-lists .t h4 { color: var(--green); } .ch-lists .x h4 { color: var(--amber); }
.ch-lists ul { margin: 0; padding: 0; list-style: none; }
.ch-lists li { position: relative; padding: .18rem 0 .18rem 1rem; font-size: var(--fs-sm); line-height: 1.5; }
.ch-lists li::before { content: ""; position: absolute; left: .1rem; top: .75em; width: .35rem; height: .35rem; border-radius: 50%; background: currentColor; opacity: .55; }
.ch-lists .t li::before { color: var(--green); } .ch-lists .x li::before { color: var(--amber); }
.ch-tbl { overflow-x: auto; }
.ch-tbl table { border-collapse: collapse; width: auto; min-width: min(100%, 30rem); font-size: var(--fs-sm); font-variant-numeric: tabular-nums; }
.ch-tbl th { text-align: left; font-size: var(--fs-2xs); letter-spacing: .02em; color: var(--muted); padding: .4rem 1.4rem .4rem .7rem; font-weight: 700; border-bottom: 1px solid var(--border); white-space: nowrap; }
.ch-tbl td { padding: .32rem 1.4rem .32rem .7rem; border-bottom: 1px solid var(--border); }
.ch-tbl tr:last-child td { border-bottom: 0; }
.ch-tbl tbody tr:hover td { background: var(--panel-2); }
.ch-tbl.zebra-cols td:nth-child(2n) { color: var(--accent); font-weight: 600; }
.ch-tnote { margin: .6rem 0 0; color: var(--muted); font-size: var(--fs-sm); line-height: 1.5; }
.ch-empty, .ch-empty-all { text-align: center; color: var(--muted); padding: 2.5rem 1rem; border: 1px dashed var(--border); border-radius: var(--radius); }
mark.ch-hl { background: var(--hl); color: #1d1d1f; border-radius: 3px; padding: 0 .06em; }
[data-anim="on"] .ch-card { transition: border-color .4s ease-out, box-shadow .4s ease-out; }
[data-anim="on"] .ch-card:hover { border-color: color-mix(in srgb, var(--accent) 30%, var(--border)); }
[data-anim="on"] .ch-chip, [data-anim="on"] .ch-toc a, [data-anim="on"] .ch-print { transition: background .35s ease-out, color .35s ease-out, border-color .35s ease-out; }
@media (max-width: 900px) {
  .ch-body { grid-template-columns: minmax(0, 1fr); }
  .ch-toc { display: none; }
  .ch-grid { grid-template-columns: minmax(0, 1fr); }
  .ch-row { grid-template-columns: minmax(0, 1fr); row-gap: .15rem; }
  .ch-n, .ch-note { padding-top: 0; }
  .ch-print { margin-left: 0; }
}
@media print {
  @page { margin: 12mm; }
  html, body { background: #fff !important; color: #000 !important; }
  #topbar, .ch-toc, .ch-bar, .ch-pr, .ch-empty, .ch-empty-all, .ch-print, #roughBtn, #roughPad, .rough-btn, .rough-pad, [id^="fx"], .fx-layer, canvas { display: none !important; }
  #content.ch-page { max-width: none; padding: 0; margin: 0; }
  .ch-head { margin-bottom: 6mm; }
  .ch-head h1 { font-size: 18pt; }
  .ch-lead { color: #000; font-size: 9pt; }
  .ch-body { display: block; }
  .ch-cards { display: block; column-count: 2; column-gap: 8mm; }
  .ch-sechead { break-after: avoid; color: #000; margin: 4mm 0 2mm; font-size: 12pt; column-span: all; }
  .ch-sechead::before { background: #000; }
  .ch-card { break-inside: avoid; page-break-inside: avoid; box-shadow: none; border: 1px solid #999; border-radius: 4px; background: #fff; color: #000; padding: 2.5mm 3mm; margin: 0 0 3mm; }
  .ch-ct h3 { font-size: 11pt; } .ch-tag { color: #000; background: none; border: 1px solid #999; }
  .ch-grid { grid-template-columns: minmax(0, 1fr); }
  .ch-row { grid-template-columns: minmax(0, 1fr); row-gap: 0; padding: 1mm 0; border-color: #ccc; break-inside: avoid; }
  .ch-n { font-size: 8.5pt; padding: 0; }
  .ch-f, .ch-card[data-sec="verbal"] .ch-f { font-size: 8.5pt; background: #fff; border: 1px solid #bbb; color: #000; padding: .3mm 1.5mm; }
  .ch-note { color: #333; font-size: 8pt; padding: 0; }
  .ch-lists { display: block; border-color: #999; margin-top: 1.5mm; padding-top: 1.5mm; }
  .ch-lists h4, .ch-lists .t h4, .ch-lists .x h4 { color: #000; }
  .ch-lists li { font-size: 8.5pt; padding-top: 0; padding-bottom: 0; } .ch-lists li::before { background: #000; }
  .ch-note code, .ch-card li code { background: #eee; color: #000; }
  .ch-tbl table { font-size: 8.5pt; } .ch-tbl th { color: #000; border-color: #999; } .ch-tbl td { border-color: #ccc; padding: .5mm 2mm; }
  .ch-tbl.zebra-cols td:nth-child(2n) { color: #000; }
  .ch-tnote { color: #333; font-size: 8pt; }
  mark.ch-hl { background: none; color: inherit; }
}`;

  const PRINT_ICO = `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V4h10v5M7 17H5a1.5 1.5 0 0 1-1.5-1.5v-5A1.5 1.5 0 0 1 5 9h14a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 19 17h-2"/><rect x="7" y="14" width="10" height="6.5" rx="1"/></svg>`;
  const key = (s) => (s || "").toLowerCase();

  function catalogMap() {
    const m = {};
    (window.CATALOG || []).forEach((s) => s.topics.forEach((t, i) => { m[s.sec + "/" + t.id] = { title: t.title, order: i }; }));
    return m;
  }

  function CheatSheet() {
    const root = document.getElementById("content");
    if (!root) return;
    if (!document.getElementById("cheatStyle")) {
      const st = document.createElement("style"); st.id = "cheatStyle"; st.textContent = CSS; document.head.appendChild(st);
    }
    root.classList.add("ch-page");
    const cmap = catalogMap();
    const forms = (window.FORMULAS || []).slice();
    const tables = window.CHEAT_TABLES || [];
    const bySec = {};
    SEC_ORDER.forEach((s) => (bySec[s] = []));
    forms.forEach((f) => { if (bySec[f.sec]) bySec[f.sec].push(f); });
    SEC_ORDER.forEach((s) => bySec[s].sort((a, b) => ((cmap[s + "/" + a.topic] || {}).order ?? 999) - ((cmap[s + "/" + b.topic] || {}).order ?? 999)));

    const counts = { all: 0, tables: tables.length };
    SEC_ORDER.forEach((s) => { counts[s] = bySec[s].length; counts.all += bySec[s].length; });
    counts.all += tables.length;

    /* ---- cards */
    const cardHTML = (f) => {
      const id = "c-" + f.sec + "-" + f.topic;
      const title = f.title || (cmap[f.sec + "/" + f.topic] || {}).title || f.topic;
      const rows = (f.items || []).map((r) =>
        `<div class="ch-row"><div class="ch-n">${esc(r[0])}</div><div><span class="ch-f">${esc(r[1])}</span></div><div class="ch-note">${r[2] ? fmt(r[2]) : ""}</div></div>`).join("");
      const list = (cls, head, arr) => arr && arr.length ? `<div class="${cls}"><h4>${head}</h4><ul>${arr.map((x) => `<li>${fmt(x)}</li>`).join("")}</ul></div>` : "";
      const lists = list("t", "Tricks", f.tricks) + list("x", "Traps", f.traps);
      return `<section class="ch-card" id="${id}" data-sec="${f.sec}" style="--tagc:${SEC_COLOR[f.sec]}">
        <div class="ch-ct"><h3>${esc(title)}</h3><span class="ch-tag">${SEC_NAME[f.sec]}</span>
        <a class="ch-pr" href="practice.html#topic/${f.sec}/${f.topic}">Practice ${icon("arrow-right")}</a></div>
        ${rows ? `<div class="ch-grid">${rows}</div>` : ""}${lists ? `<div class="ch-lists">${lists}</div>` : ""}</section>`;
    };
    const tableHTML = (t) => {
      const wide = t.head && t.head.length > 4 && t.zebra !== false && /squares|cubes/i.test(t.title);
      return `<section class="ch-card" id="c-tables-${t.id}" data-sec="tables" style="--tagc:${SEC_COLOR.tables}">
        <div class="ch-ct"><h3>${esc(t.title)}</h3><span class="ch-tag">Table</span></div>
        <div class="ch-tbl${wide ? " zebra-cols" : ""}"><table><thead><tr>${t.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
        <tbody>${t.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
        ${t.note ? `<p class="ch-tnote">${fmt(t.note)}</p>` : ""}</section>`;
    };

    let cards = "", toc = "";
    SEC_ORDER.forEach((s) => {
      if (!bySec[s].length) return;
      cards += `<h2 class="ch-sechead" data-sec="${s}" style="--dot:${SEC_COLOR[s]}">${SEC_NAME[s] === "DI" ? "Data interpretation" : SEC_NAME[s] === "Quant" ? "Quantitative aptitude" : SEC_NAME[s]}</h2>` + bySec[s].map(cardHTML).join("");
      toc += `<h2 data-sec="${s}">${SEC_NAME[s]}</h2>` + bySec[s].map((f) => `<a href="#c-${s}-${f.topic}" data-card="c-${s}-${f.topic}" data-sec="${s}">${esc(f.title || (cmap[s + "/" + f.topic] || {}).title || f.topic)}</a>`).join("");
    });
    if (tables.length) {
      cards += `<h2 class="ch-sechead" data-sec="tables" style="--dot:${SEC_COLOR.tables}">Memory tables</h2>` + tables.map(tableHTML).join("");
      toc += `<h2 data-sec="tables">Tables</h2>` + tables.map((t) => `<a href="#c-tables-${t.id}" data-card="c-tables-${t.id}" data-sec="tables">${esc(t.title)}</a>`).join("");
    }
    const chipDefs = [["all", "All"]].concat(SEC_ORDER.map((s) => [s, SEC_NAME[s]]), [["tables", "Tables"]]);

    root.innerHTML = `
      <div class="ch-head"><div><h1>Cheat sheet</h1>
        <p class="ch-lead">Every formula, shortcut and memory table in one place. Search to filter, pick a section, or print the lot (or just the section you filtered to) for the night before the test.</p></div></div>
      <div class="ch-bar">
        <label class="ch-search">${icon("search")}<input id="chQ" type="search" placeholder="Search formulas, rules, topics" autocomplete="off" spellcheck="false" aria-label="Search the cheat sheet"><kbd>/</kbd></label>
        <div class="ch-chips" role="group" aria-label="Section">${chipDefs.map(([k, l]) => `<button type="button" class="ch-chip" data-k="${k}" aria-pressed="${k === "all"}">${l}<i>${counts[k]}</i></button>`).join("")}</div>
        <button type="button" class="ch-print" id="chPrint">${PRINT_ICO}<span>Print</span></button>
      </div>
      <div class="ch-body"><nav class="ch-toc" aria-label="Topics">${toc}</nav>
        <div class="ch-cards" id="chCards">${cards}<div class="ch-empty" hidden>Nothing matches that search. Try a shorter word, like "ratio" or "tense".</div>
        ${counts.all ? "" : '<div class="ch-empty-all">No cheat sheet data loaded.</div>'}</div></div>`;

    const q = document.getElementById("chQ"), cardsEl = document.getElementById("chCards"), tocEl = root.querySelector(".ch-toc");
    const cardEls = Array.from(cardsEl.querySelectorAll(".ch-card"));
    cardEls.forEach((c) => { c._text = key(c.textContent); c._title = key(c.querySelector("h3").textContent); });
    let sec = "all";

    const clearHL = () => cardsEl.querySelectorAll("mark.ch-hl").forEach((m) => { const p = m.parentNode; p.replaceChild(document.createTextNode(m.textContent), m); p.normalize(); });
    function highlight(el, term) {
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentNode.closest("a.ch-pr, mark") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
      const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
      nodes.forEach((n) => {
        const t = n.nodeValue, lo = key(t); let i = lo.indexOf(term); if (i < 0) return;
        const frag = document.createDocumentFragment(); let last = 0;
        while (i >= 0) { frag.appendChild(document.createTextNode(t.slice(last, i))); const m = document.createElement("mark"); m.className = "ch-hl"; m.textContent = t.slice(i, i + term.length); frag.appendChild(m); last = i + term.length; i = lo.indexOf(term, last); }
        frag.appendChild(document.createTextNode(t.slice(last))); n.parentNode.replaceChild(frag, n);
      });
    }

    function apply() {
      clearHL();
      const term = key(q.value.trim().replace(/\s+/g, " ")), words = term ? term.split(" ") : [];
      let shown = 0; const secShown = {};
      cardEls.forEach((c) => {
        const inSec = sec === "all" || c.dataset.sec === sec;
        const ok = inSec && words.every((w) => c._text.includes(w));
        c.hidden = !ok;
        if (ok) { shown++; secShown[c.dataset.sec] = 1; }
        const titleHit = words.every((w) => c._title.includes(w));
        c.querySelectorAll(".ch-row, .ch-lists li").forEach((r) => {
          /* with a search, keep only matching rows unless the whole card is the hit */
          r.hidden = !!(ok && words.length && !titleHit && !words.every((w) => key(r.textContent).includes(w)) && c.dataset.sec !== "tables");
        });
        if (ok && words.length && !titleHit && c.dataset.sec !== "tables" && !c.querySelector(".ch-row:not([hidden]), .ch-lists li:not([hidden])")) {
          /* words spread over several rows: show the whole card instead of an empty one */
          c.querySelectorAll("[hidden]").forEach((r) => (r.hidden = false));
        }
        c.querySelectorAll(".ch-lists > div").forEach((d) => { d.hidden = !d.querySelector("li:not([hidden])"); });
        c.querySelectorAll(".ch-lists").forEach((d) => { d.hidden = !d.querySelector(":scope > div:not([hidden])"); });
        c.querySelectorAll(".ch-grid").forEach((d) => { d.hidden = !d.querySelector(".ch-row:not([hidden])"); });
        if (ok && words.length) words.forEach((w) => highlight(c, w));
      });
      cardsEl.querySelectorAll(".ch-sechead").forEach((h) => (h.hidden = !secShown[h.dataset.sec]));
      tocEl.querySelectorAll("h2").forEach((h) => (h.hidden = !secShown[h.dataset.sec]));
      tocEl.querySelectorAll("a").forEach((a) => (a.hidden = document.getElementById(a.dataset.card).hidden));
      cardsEl.querySelector(".ch-empty").hidden = shown > 0 || !counts.all;
      root.querySelectorAll(".ch-chip").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.k === sec)));
    }

    q.addEventListener("input", apply);
    q.addEventListener("keydown", (e) => { if (e.key === "Escape") { q.value = ""; apply(); q.blur(); } });
    root.querySelector(".ch-chips").addEventListener("click", (e) => { const b = e.target.closest(".ch-chip"); if (!b) return; sec = b.dataset.k; apply(); window.scrollTo({ top: 0 }); });
    document.getElementById("chPrint").addEventListener("click", () => window.print());
    document.addEventListener("keydown", (e) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target; if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault(); q.focus(); q.select();
    });
    tocEl.addEventListener("click", (e) => {
      const a = e.target.closest("a"); if (!a) return; e.preventDefault();
      document.getElementById(a.dataset.card).scrollIntoView({ behavior: "auto", block: "start" });
    });
    /* highlight the TOC entry of the card nearest the top */
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => {
        es.forEach((en) => { if (en.isIntersecting) { tocEl.querySelectorAll("a.on").forEach((a) => a.classList.remove("on")); const a = tocEl.querySelector(`a[data-card="${en.target.id}"]`); if (a) a.classList.add("on"); } });
      }, { rootMargin: "-90px 0px -70% 0px" });
      cardEls.forEach((c) => io.observe(c));
    }
    apply();
  }
  window.CheatSheet = CheatSheet;
})();
