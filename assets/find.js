/* find.js: Ctrl + K (or the search button in the header) opens one search box for the whole site:
   every page, lesson topic, practice pattern, cheat-sheet topic, practice entry point (daily set, speed drill)
   and mock preset (when data/mocks.js is on the page, or PROGRESS.mocks exists). Up/Down to move, Enter to open, Esc to close.
   With nothing typed it shows the pages and what you touched last.
   Data: data/progress.js (titles only, so it is small) and data/catalog.js. */
(function () {
  const PR = window.PROGRESS || {};
  const CAT = PR.catalog || window.CATALOG || [];
  const ICO = (d) => `<svg class="cat-ico" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const LENS = '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>';
  const KIND = { page: "Page", topic: "Topic", pattern: "Pattern", practice: "Practice", cheat: "Cheat sheet", mock: "Mock test" };

  // everything you can jump to: [key in Store, kind, title, small text under it, link]
  const all = [
    ["", "page", "Dashboard", "Your progress, streak and goal", "index.html"],
    ["", "page", "Quant", "Quantitative aptitude lessons", "quant.html"],
    ["", "page", "Reasoning", "Logical reasoning lessons", "reasoning.html"],
    ["", "page", "Verbal", "Verbal ability lessons", "verbal.html"],
    ["", "page", "DI", "Data interpretation lessons", "di.html"],
    ["", "page", "Practice", "Drills, topic sets, daily set", "practice.html"],
    ["", "page", "Mock tests", "Company-style timed tests", "mock.html"],
    ["", "page", "Placement strategy", "Company patterns and exam technique", "strategy.html"],
    ["", "page", "Review & mistakes", "Due questions and your mistake book", "revision.html"],
    ["", "page", "Cheat sheet", "Every formula, shortcut and table on one page", "formulas.html"],
  ];
  // practice entry points (shown with the pages when nothing is typed)
  const PRAC = [
    ["Daily set", "20 questions picked for you today", "practice.html#daily"],
    ["Speed drill", "60 seconds of mental maths", "practice.html#speed"],
    ["Speed drill: Squares & cubes", "n², n³ and square roots", "practice.html#speed/squares"],
    ["Speed drill: Percentages", "x% of y, fraction ↔ %", "practice.html#speed/percent"],
    ["Speed drill: Multiplication tricks", "×5, ×25, ×125, squares near 100", "practice.html#speed/tricks"],
    ["Speed drill: Tables & addition", "Tables to 20, quick sums", "practice.html#speed/tables"],
  ];
  PRAC.forEach(([t, sub, href], i) => all.push(["", "practice", t, sub, href, null, i < 2]));
  const seen = new Set();
  CAT.forEach((c) => c.topics.forEach((t) => {
    seen.add(c.sec + ":" + t.id);
    all.push([c.sec + ":" + t.id, "topic", t.title, c.short + " · " + t.group, c.page + "#" + t.id]);
  }));
  Object.entries(PR.learn || {}).forEach(([sec, list]) => list.forEach((s) => {
    const c = CAT.find((x) => x.sec === sec);
    if (!seen.has(sec + ":" + s.id) && c) all.push([sec + ":" + s.id, "topic", s.title, c.short + " · " + (s.group || ""), c.page + "#" + s.id]);
  }));
  CAT.forEach((c) => c.topics.forEach((t) => t.patterns.forEach((p) => {
    const key = c.sec + "/" + t.id + "/" + p.id;
    all.push(["pat:" + key, "pattern", p.title, "Practice pattern · " + t.title, "practice.html#drill/" + key]);
  })));
  // cheat-sheet cards: formulas.html gives every card the id c-<sec>-<topic> (tables: c-tables-<id>)
  const cheat = Array.isArray(PR.cheat) && PR.cheat.length ? PR.cheat
    : [].concat(...CAT.map((c) => c.topics.map((t) => ({ sec: c.sec, id: t.id, title: t.title }))),
      (window.CHEAT_TABLES || []).map((t) => ({ sec: "tables", id: t.id, title: t.title })));
  const SHORT = {}; CAT.forEach((c) => (SHORT[c.sec] = c.short));
  cheat.forEach((x) => all.push(["", "cheat", x.title, "Cheat sheet · " + (x.sec === "tables" ? "Memory table" : SHORT[x.sec] || x.sec), "formulas.html#c-" + x.sec + "-" + x.id]));
  // mock presets
  const mocks = Array.isArray(window.MOCKS) && window.MOCKS.length ? window.MOCKS : Array.isArray(PR.mocks) ? PR.mocks : [];
  mocks.forEach((m) => m && m.id && all.push(["", "mock", m.name || m.id, [m.company, m.kind === "company" ? "company-style" : m.kind, m.minutes ? m.minutes + " min" : ""].filter(Boolean).join(" · ") || "Mock test", "mock.html#start/" + encodeURIComponent(m.id)]));
  const items = all.map(([key, kind, title, sub, href, d, home]) => ({ key, kind, title, sub: sub || "", href, d, home: !!home, low: title.toLowerCase(), hay: (title + " " + (sub || "") + " " + KIND[kind] + " " + (d || "")).toLowerCase() }));
  all.length = 0; items.forEach((x) => all.push(x));

  // a title that starts with what you typed beats one that only contains it, and pages come first on a tie
  function score(x, q, words) {
    if (!words.every((w) => x.hay.includes(w))) return -1;
    let s = x.low === q ? 100 : x.low.startsWith(q) ? 60 : new RegExp("\\b" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(x.low) ? 40 : x.low.includes(q) ? 25 : 0;
    if (x.kind === "page" || x.home) s += 5;
    return s - x.title.length / 100;
  }
  function results(q) {
    q = q.trim().toLowerCase();
    if (!q) {
      const items = Store.load().items;
      const recent = all.filter((x) => x.key && items[x.key] && items[x.key].updated).sort((a, z) => items[z.key].updated - items[a.key].updated).slice(0, 5);
      return [...recent.map((x) => ({ ...x, recent: true })), ...all.filter((x) => x.kind === "page" || x.home)];
    }
    const words = q.split(/\s+/);
    return all.map((x) => [score(x, q, words), x]).filter(([s]) => s >= 0).sort((a, z) => z[0] - a[0]).slice(0, 40).map(([, x]) => x);
  }

  let bg = null, sel = 0, list = [];
  function row(x, i) {
    const it = x.key ? Store.item(x.key) : {};
    const mark = x.kind === "pattern" ? (it.n ? `<span class="fd-sub">${it.n} tried</span>` : "") : it.status === "done" ? `<span class="fd-st ok" title="Done">${icon("check")}</span>` : it.status === "revise" ? `<span class="fd-st rv" title="Needs revision">${icon("repeat")}</span>` : "";
    return `<a class="fd-row${i === sel ? " on" : ""}" href="${x.href}" data-i="${i}" role="option" aria-selected="${i === sel}">
      <span class="fd-kind k-${x.kind}">${x.recent ? "Recent" : KIND[x.kind]}</span>
      <span class="fd-t"><b>${esc(x.title)}</b>${x.sub ? `<small>${esc(x.sub)}</small>` : ""}</span>
      ${x.d ? `<span class="badge ${x.d.toLowerCase()}">${x.d}</span>` : ""}${mark}</a>`;
  }
  function paint() {
    const box = bg.querySelector(".fd-list"), q = bg.querySelector("input").value;
    list = results(q);
    sel = Math.min(sel, Math.max(0, list.length - 1));
    box.innerHTML = list.length ? (q.trim() ? "" : `<div class="fd-h">${list.some((x) => x.recent) ? "Recent, pages and practice" : "Pages and practice"}</div>`) + list.map(row).join("")
      : `<div class="fd-empty">Nothing matches “${esc(q)}”.</div>`;
  }
  function move(d) {
    if (!list.length) return;
    sel = (sel + d + list.length) % list.length;
    bg.querySelectorAll(".fd-row").forEach((r) => { const on = +r.dataset.i === sel; r.classList.toggle("on", on); r.setAttribute("aria-selected", on); if (on) r.scrollIntoView({ block: "nearest" }); });
  }
  function go(x) {
    if (!x) return;
    close();
    const u = new URL(x.href, location.href);
    if (u.pathname === location.pathname && u.hash === location.hash) return;
    location.href = x.href;
  }
  function open() {
    if (bg) { bg.querySelector("input").select(); return; }
    bg = document.createElement("div");
    bg.className = "fd-bg";
    bg.innerHTML = `<div class="fd" role="dialog" aria-label="Find anything">
      <label class="fd-in">${ICO(LENS)}<input type="search" placeholder="Find a topic, pattern or page…" aria-label="Find" autocomplete="off" spellcheck="false"><kbd>Esc</kbd></label>
      <div class="fd-list" role="listbox"></div>
      <div class="fd-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></div></div>`;
    document.body.appendChild(bg);
    const inp = bg.querySelector("input");
    sel = 0; paint();
    requestAnimationFrame(() => bg.classList.add("show"));
    inp.focus();
    inp.addEventListener("input", () => { sel = 0; paint(); });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter") { e.preventDefault(); go(list[sel]); }
    });
    bg.addEventListener("mousedown", (e) => { if (e.target === bg) close(); });
    bg.addEventListener("mousemove", (e) => { const r = e.target.closest(".fd-row"); if (r && +r.dataset.i !== sel) { sel = +r.dataset.i; move(0); } });
    bg.addEventListener("click", (e) => { const r = e.target.closest(".fd-row"); if (r) { e.preventDefault(); go(list[+r.dataset.i]); } });
  }
  function close() {
    if (!bg) return;
    const el = bg; bg = null;
    el.classList.remove("show");
    setTimeout(() => el.remove(), 180);
  }

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === "k") { e.preventDefault(); bg ? close() : open(); }
    else if (e.key === "Escape" && bg) { e.preventDefault(); e.stopPropagation(); close(); }
  }, true);

  window.FindBox = { open, close };   // used by the tablet rail

  // a small 🔍 button in the header, next to the theme switch
  const theme = document.getElementById("themeBtn");
  if (theme) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "icon-btn"; b.id = "findBtn";
    b.title = "Find anything (Ctrl K)"; b.setAttribute("aria-label", "Find anything");
    b.innerHTML = ICO(LENS);
    b.onclick = open;
    (document.querySelector(".tb-slot") || theme).before(b);
  }
})();
