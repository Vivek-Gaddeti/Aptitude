/* =====================================================================
   practice.js : the practice page  (setup -> player -> review)
   Routes (hash):  #  or  #setup          choose what to practise
                   #topic/<sec>/<topic>   setup with that topic preselected
                   #drill/<sec>/<topic>/<pattern>   endless pattern drill (adapts Easy -> Hard)
                   #run                   the player (session kept in sessionStorage, a reload resumes)
                   #review                end-of-set review
   Needs: site.js, common.js, data/catalog.js, qbank.js, the question data.   Styles: practice.css
   ===================================================================== */
(function () {
  "use strict";
  const main = document.getElementById("content");
  const QB = window.QB;
  if (!main || !QB || !QB.pool) return;
  const Store = window.Store;
  const esc = window.esc || ((s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])));
  const fmt = window.fmt || esc;
  const toast = window.toast || (() => {});
  const swapLabel = window.swapLabel || ((l, s = 0) => `<span class="swap" data-s="${s}">${l.map((x) => `<span>${x}</span>`).join("")}</span>`);

  const SK = "apt:prac:sess", LK = "apt:prac:setup", SPK = "apt:prac:speed";
  const DIFFS = ["Easy", "Medium", "Hard"], DCLS = { Easy: "easy", Medium: "med", Hard: "hard" };
  const SEC_VAR = { quant: "--c-quant", reasoning: "--c-reason", verbal: "--c-verbal", di: "--c-di" };
  const SEC_ALL = [["quant", "Quant"], ["reasoning", "Reasoning"], ["verbal", "Verbal"], ["di", "DI"]];
  const REASONS = [["concept", "Concept"], ["calc", "Calculation"], ["misread", "Misread"], ["time", "Time"], ["guess", "Guessed"]];
  const LET = "ABCD";
  const RING = 88;

  /* ---------------------------------------------------------------- small helpers */
  const store = (area) => ({
    get(k) { try { return JSON.parse(window[area].getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { window[area].setItem(k, JSON.stringify(v)); } catch (e) {} },
    del(k) { try { window[area].removeItem(k); } catch (e) {} },
  });
  const ss = store("sessionStorage"), ls = store("localStorage");
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const titleCase = (id) => cap(String(id).replace(/-/g, " "));
  const mmss = (s) => {
    s = Math.max(0, Math.floor(s));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(x).padStart(2, "0");
  };
  const LOCAL_ICONS = {
    warn: '<path d="M12 3.5 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.2h.01"/>',
    bolt: '<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    solution: '<path d="M9 11.5l3 3 8-8"/><path d="M20 12.5v6.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10"/>',
    pin: '<path d="M12 17v5M5 17h14l-2-5V4H7v8z"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    skip: '<path d="M5 5l9 7-9 7zM18 5v14"/>',
    book: '<path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0 0 4h13"/>',
  };
  const ic = (name, cls) => {
    const s = typeof window.icon === "function" ? window.icon(name, cls || "") : "";
    return s || (LOCAL_ICONS[name] ? `<svg class="ico${cls ? " " + cls : ""}" viewBox="0 0 24 24" aria-hidden="true">${LOCAL_ICONS[name]}</svg>` : "");
  };
  const body = (t) => fmt(t).replace(/\n/g, "<br>");

  /* ---------------------------------------------------------------- catalog helpers */
  const CAT = () => window.CATALOG || [];
  const secInfo = (sec) => CAT().find((s) => s.sec === sec);
  const topicInfo = (sec, t) => ((secInfo(sec) || {}).topics || []).find((x) => x.id === t);
  const secName = (sec) => (secInfo(sec) || {}).short || (SEC_ALL.find((x) => x[0] === sec) || [0, cap(sec)])[1];
  const topicTitle = (sec, t) => (topicInfo(sec, t) || {}).title || titleCase(t);
  const patTitle = (sec, t, p) => { const ti = topicInfo(sec, t), pi = ti && ti.patterns.find((x) => x.id === p); return pi ? pi.title : titleCase(p); };
  const learnHref = (sec, t) => ((secInfo(sec) || {}).page || sec + ".html") + "#" + t;
  const pk = (q) => q.sec + "/" + q.topic + "/" + q.pattern;

  function contentIndex() {
    const bank = {}, gens = {};
    QB.qs.forEach((q) => { const k = pk(q), b = bank[k] || (bank[k] = { Easy: 0, Medium: 0, Hard: 0, n: 0 }); b[q.d]++; b.n++; });
    Object.keys(QB.gens).forEach((k) => (gens[k] = true));
    const has = (k) => !!(bank[k] || gens[k]);
    const secHas = (sec) => Object.keys(bank).concat(Object.keys(gens)).some((k) => k.split("/")[0] === sec);
    const topicHas = (sec, t) => Object.keys(bank).concat(Object.keys(gens)).some((k) => k.indexOf(sec + "/" + t + "/") === 0);
    return { bank, gens, has, secHas, topicHas };
  }

  /* ---------------------------------------------------------------- state */
  let S = ss.get(SK);          // the session (or null)
  let view = "";               // "setup" | "run" | "review"
  let SETUP = null;            // the setup choices shown on screen
  const qc = new Map();
  const getQ = (id) => {
    if (qc.has(id)) return qc.get(id);
    const q = QB.get(id) || { id, sec: "quant", topic: "", pattern: "", d: "Medium", q: "This question is no longer in the bank.", opts: ["-", "-", "-", "-"], ans: 0, time: 45, sol: [] };
    qc.set(id, q);
    return q;
  };
  const persist = () => { if (S) { ss.set(SK, S); syncDaily(); } };
  const total = () => S.items.length;
  const cur = () => getQ(S.items[S.idx]);
  const isTest = () => S.cfg.feedback === "test";
  const itemKey = (q) => QB.itemKey(q);
  const qItem = (q) => (Store ? Store.item(itemKey(q)) : {});
  const answeredCount = () => Object.keys(S.ans).filter((i) => S.ans[i].c != null).length;

  /* ---------------------------------------------------------------- routes */
  function go(h, replace) {
    if (replace) { try { history.replaceState(null, "", "#" + h); } catch (e) {} route(); return; }
    if ((location.hash || "").replace(/^#/, "") === h) route(); else location.hash = h;
  }
  function route() {
    stopTick();
    stopSpeed();
    closeModal(true);
    const h = (location.hash || "").replace(/^#\/?/, ""), parts = h.split("/");
    main.classList.add("pr");
    document.title = "Practice · " + ((window.SITE && SITE.brand) || "Aptitude Hub");
    if (parts[0] === "daily") return startDaily();
    if (parts[0] === "speed") return speedView(parts[1]);
    if (parts[0] === "qs") return startQs(h.slice(3));
    if (parts[0] === "drill") return parts.length >= 4 ? startDrill(parts[1], parts[2], parts[3]) : emptyView("drill", parts[1], parts[2], parts[3]);
    if (parts[0] === "topic" && parts.length >= 3) return setupView({ sec: parts[1], topics: [parts[2]], patterns: [] });
    if (parts[0] === "run") {
      if (S && !S.done && S.items.length) return playerView();
      if (S && S.done) return go("review", true);
      return go("", true);
    }
    if (parts[0] === "review") return S && S.done ? reviewView() : go("", true);
    setupView();
  }
  function safeRoute() {
    try { route(); } catch (err) {
      console.error(err);
      stopTick();
      main.innerHTML = `<div class="card empty-state"><div class="big">${ic("puzzle")}</div><h2 class="dash-h2">This page didn't load properly</h2>
        <p class="muted">Usually an old cached file. Press <kbd>Ctrl</kbd> + <kbd>F5</kbd> to reload everything.</p>
        <p class="small muted">Details: ${esc(String((err && err.message) || err))}</p>
        <div class="btn-row" style="justify-content:center"><a class="btn primary" href="#setup" data-reset="1">Back to setup</a></div></div>`;
    }
  }

  /* ================================================================ SETUP */
  function loadCfg() {
    const d = { sec: "quant", topics: [], patterns: [], diff: DIFFS.slice(), count: 20, source: "mix", feedback: "instant", timing: "target" };
    return Object.assign(d, ls.get(LK) || {});
  }
  function sanitize(c, ix) {
    const secs = SEC_ALL.map((x) => x[0]).filter((s) => ix.secHas(s));
    if (!secs.includes(c.sec)) c.sec = secs[0] || "quant";
    const topics = ((secInfo(c.sec) || {}).topics || []).filter((t) => ix.topicHas(c.sec, t.id)).map((t) => t.id);
    c.topics = (c.topics || []).filter((t) => topics.includes(t));
    if (!c.topics.length && topics.length) c.topics = [topics[0]];
    const keys = [];
    c.topics.forEach((t) => ((topicInfo(c.sec, t) || { patterns: [] }).patterns.forEach((p) => { const k = c.sec + "/" + t + "/" + p.id; if (ix.has(k)) keys.push(k); })));
    c.patterns = (c.patterns || []).map((p) => (p.indexOf("/") < 0 ? c.topics.map((t) => c.sec + "/" + t + "/" + p) : [p])).reduce((a, b) => a.concat(b), []).filter((k) => keys.includes(k));
    if (c.patterns.length === keys.length) c.patterns = [];
    c.diff = DIFFS.filter((d) => (c.diff || []).includes(d));
    if (!c.diff.length) c.diff = DIFFS.slice();
    if (![10, 20, 30].includes(+c.count)) c.count = 20;
    if (!["bank", "gen", "mix"].includes(c.source)) c.source = "mix";
    if (!["instant", "test"].includes(c.feedback)) c.feedback = "instant";
    if (!["none", "target", "total"].includes(c.timing)) c.timing = "target";
    c.count = +c.count;
    c._keys = keys;
    return c;
  }
  function seg(field, opts, val) {
    return `<div class="pr-segc" role="group">${opts.map(([v, l, dis]) => `<button type="button" class="${String(val) === String(v) ? "on" : ""}" data-act="set" data-f="${field}" data-v="${v}"${dis ? " disabled" : ""}>${l}</button>`).join("")}</div>`;
  }
  function patStats(key) {
    const it = Store ? Store.item("pat:" + key) : {};
    return { n: it.n || 0, c: it.c || 0, avg: it.n ? (it.ts || 0) / it.n : 0 };
  }
  function setupView(pre) {
    view = "setup";
    const ix = contentIndex();
    const cfg = sanitize(Object.assign(loadCfg(), pre || {}), ix);
    SETUP = cfg;
    const info = secInfo(cfg.sec);
    const topicsAll = (info && info.topics) || [];
    const pool = QB.pool({ sec: cfg.sec, topics: cfg.topics, patterns: cfg.patterns, diff: cfg.diff });
    const bankN = pool.bank.length, genN = pool.gens.length;
    const avail = cfg.source === "gen" ? (genN ? Infinity : bankN) : cfg.source === "bank" ? (bankN || (genN ? Infinity : 0)) : bankN + (genN ? Infinity : 0);
    const nQ = Math.min(cfg.count, avail);
    const live = !!(S && !S.done && S.items.length);

    // sections
    const secChips = SEC_ALL.map(([s]) => {
      const on = ix.secHas(s), sel = s === cfg.sec;
      return `<button type="button" class="pr-pick sec${sel ? " on" : ""}" style="--sc:var(${SEC_VAR[s]})" data-act="sec" data-v="${s}"${on ? "" : ` disabled title="Coming soon"`}><i></i>${esc(secName(s))}${on ? "" : '<small>soon</small>'}</button>`;
    }).join("");
    // topics
    const topicChips = topicsAll.map((t) => {
      const on = ix.topicHas(cfg.sec, t.id), sel = cfg.topics.includes(t.id);
      return `<button type="button" class="pr-pick${sel ? " on" : ""}" data-act="topic" data-v="${t.id}"${on ? "" : ` disabled title="Coming soon"`}>${esc(t.title)}</button>`;
    }).join("");
    // patterns of the chosen topics
    const multiT = cfg.topics.length > 1;
    const patChips = cfg.topics.map((tid) => {
      const t = topicInfo(cfg.sec, tid);
      if (!t) return "";
      return (multiT ? `<div class="pr-sub">${esc(t.title)}</div>` : "") + `<div class="pr-picks">` + t.patterns.map((p) => {
        const k = cfg.sec + "/" + tid + "/" + p.id, on = ix.has(k), sel = on && (!cfg.patterns.length || cfg.patterns.includes(k)), b = ix.bank[k];
        return `<button type="button" class="pr-pick${sel ? " on" : ""}" data-act="pat" data-v="${k}"${on ? "" : " disabled"}>${esc(p.title)}<small>${on ? (b ? b.n : 0) + (ix.gens[k] ? " + gen" : "") : "soon"}</small></button>`;
      }).join("") + `</div>`;
    }).join("");
    // pattern table
    const table = cfg.topics.map((tid) => {
      const t = topicInfo(cfg.sec, tid);
      if (!t) return "";
      return `<div class="pr-tbl-wrap">${multiT || true ? `<div class="pr-tbl-h"><b>${esc(t.title)}</b><a class="btn sm" href="${learnHref(cfg.sec, tid)}">${ic("book")} Learn this topic</a></div>` : ""}
        <table class="pr-table"><thead><tr><th>Pattern</th><th>Bank (E / M / H)</th><th>Accuracy</th><th>Avg time</th><th></th></tr></thead><tbody>` + t.patterns.map((p) => {
        const k = cfg.sec + "/" + tid + "/" + p.id, b = ix.bank[k], g = ix.gens[k], st = patStats(k), on = ix.has(k);
        const acc = st.n ? Math.round((st.c / st.n) * 100) : null;
        return `<tr class="${on ? "" : "soon"}"><td class="pn">${esc(p.title)}${g ? ' <span class="pr-tag">gen</span>' : ""}</td>
          <td class="num">${b ? `${b.Easy} / ${b.Medium} / ${b.Hard}` : on ? "0" : "-"}</td>
          <td>${acc == null ? '<span class="muted">-</span>' : `<span class="pr-mini"><i style="width:${acc}%"></i></span> ${acc}% <span class="muted small">(${st.n})</span>`}</td>
          <td class="num">${st.n ? mmss(st.avg) : "-"}</td>
          <td class="act">${on ? `<a class="btn sm" href="#drill/${k}">Drill</a>` : '<span class="muted small">soon</span>'}</td></tr>`;
      }).join("") + `</tbody></table></div>`;
    }).join("");

    const resume = live
      ? `<div class="pr-card pr-resume"><div><b>Set in progress</b><div class="muted small">${esc(sessionLabel())} · question ${S.idx + 1}${S.mode === "drill" ? "" : " of " + total()} · ${answeredCount()} answered</div></div>
          <span class="grow"></span><button class="btn" data-act="discard">Discard</button><button class="btn primary" data-act="resume">Resume</button></div>`
      : S && S.done
        ? `<div class="pr-card pr-resume"><div><b>Last set finished</b><div class="muted small">${esc(sessionLabel())} · ${scoreOf().ok} of ${scoreOf().n} correct</div></div>
          <span class="grow"></span><button class="btn" data-act="review-last">See review</button></div>` : "";

    const hint = [];
    if (cfg.source !== "bank" && !genN && bankN) hint.push("No generators for this selection yet, so Generated and Mix will use the bank.");
    if (cfg.source === "gen" && genN === 0) hint.push("Nothing is generated here yet; the bank will be used.");
    if (cfg.source === "bank" && bankN < cfg.count && bankN) hint.push(`The bank has ${bankN} question${bankN === 1 ? "" : "s"} here, so the set will be shorter.`);
    if (!bankN && !genN) hint.push("Nothing matches these choices.");

    main.innerHTML = `
      <div class="pr-enter">
      <h1 class="pr-h1">Practice</h1>
      <p class="lead">Choose what to practise, then start. Every answer you give is remembered, so the weak spots find you.</p>
      ${tilesHTML(ix)}
      ${resume}
      <div class="pr-setup">
        <div class="pr-card pr-build">
          <div class="pr-field"><h5>Section</h5><div class="pr-picks">${secChips}</div></div>
          <div class="pr-field"><h5>Topics <small>pick one or more</small></h5><div class="pr-picks">${topicChips || '<span class="muted">No topics yet.</span>'}</div></div>
          <div class="pr-field"><h5>Patterns <small>${cfg.patterns.length ? cfg.patterns.length + " chosen" : "all"}</small>${cfg.patterns.length ? '<button type="button" class="pr-link" data-act="pat-all">Select all</button>' : ""}</h5>${patChips || '<span class="muted">Choose a topic first.</span>'}</div>
          <div class="pr-row">
            <div class="pr-field"><h5>Difficulty</h5><div class="pr-picks">${DIFFS.map((d) => `<button type="button" class="pr-pick d-${DCLS[d]}${cfg.diff.includes(d) ? " on" : ""}" data-act="diff" data-v="${d}">${d}</button>`).join("")}</div></div>
            <div class="pr-field"><h5>Questions</h5>${seg("count", [[10, "10"], [20, "20"], [30, "30"]], cfg.count)}</div>
          </div>
          <div class="pr-row">
            <div class="pr-field"><h5>Source</h5>${seg("source", [["bank", "Bank"], ["gen", "Generated"], ["mix", "Mix"]], cfg.source)}</div>
            <div class="pr-field"><h5>Feedback</h5>${seg("feedback", [["instant", "Instant"], ["test", "Test"]], cfg.feedback)}</div>
          </div>
          <div class="pr-field"><h5>Timing</h5>${seg("timing", [["none", "Untimed"], ["target", "Target per question"], ["total", "Total timer"]], cfg.timing)}</div>
          ${hint.length ? `<p class="pr-hint">${ic("bulb")} ${esc(hint.join(" "))}</p>` : ""}
        </div>
        <aside class="pr-side"><div class="pr-card pr-start">
          <h5>Your set</h5>
          <div class="pr-big"><b>${nQ}</b><span>question${nQ === 1 ? "" : "s"}</span></div>
          <ul class="pr-sum">
            <li>${esc(secName(cfg.sec))} · ${cfg.topics.length} topic${cfg.topics.length === 1 ? "" : "s"}</li>
            <li>${cfg.patterns.length || cfg._keys.length} pattern${(cfg.patterns.length || cfg._keys.length) === 1 ? "" : "s"} · ${cfg.diff.length === 3 ? "all levels" : cfg.diff.join(", ")}</li>
            <li>${bankN} in the bank${genN ? " + unlimited generated" : ""}</li>
            <li>${cfg.feedback === "instant" ? "Answers explained as you go" : "Test: results at the end"} · ${cfg.timing === "none" ? "untimed" : cfg.timing === "target" ? "target per question" : "total timer"}</li>
          </ul>
          <button class="btn primary pr-go" data-act="start"${nQ ? "" : " disabled"}>Start <kbd>Enter</kbd></button>
        </div></aside>
      </div>
      <div class="pr-card pr-patcard"><h5>Patterns in ${cfg.topics.length > 1 ? "these topics" : esc(cfg.topics.length ? topicTitle(cfg.sec, cfg.topics[0]) : "this topic")}</h5>${table || '<p class="muted">Pick a topic to see its patterns.</p>'}</div>
      </div>`;
  }
  /* quick-start tiles above the builder: daily set, speed drill, mock tests, weakest pattern */
  function weakPatterns(ix) {
    const items = Store ? Store.load().items : {};
    return Object.keys(items).filter((k) => k.indexOf("pat:") === 0 && (items[k].n || 0) >= 3 && ix.has(k.slice(4)))
      .map((k) => ({ k: k.slice(4), n: items[k].n, acc: (items[k].c || 0) / items[k].n }))
      .sort((a, b) => a.acc - b.acc || b.n - a.n);
  }
  function tilesHTML(ix) {
    const D = dailyMeta(), streak = Store && Store.streak ? Store.streak() : 0;
    const dAns = D ? Object.keys(D.ans || {}).length : 0, dN = D ? D.ids.length : 20;
    const dState = !D ? "20 questions, built fresh today" : D.done ? `Done today · ${D.ok || 0} / ${dN} right` : dAns ? `${dAns} / ${dN} answered · continue` : "Ready · 20 questions";
    const sp = speedMeta(), bestMode = SPEED_MODES.map((m) => [m, sp.best[m[0]] || 0]).sort((a, b) => b[1] - a[1])[0];
    const weak = weakPatterns(ix).filter((p) => p.acc < 1)[0];
    const wk = weak ? weak.k.split("/") : null;
    const tile = (href, cls, icn, title, sub, state, extra) => `<a class="pr-tile ${cls}" href="${href}"${extra || ""}><span class="ti">${ic(icn)}</span><span class="tb"><b>${title}</b><small>${sub}</small><em>${state}</em></span></a>`;
    return `<div class="pr-tiles">
      ${tile("#daily", "t-daily" + (D && D.done ? " done" : ""), D && D.done ? "check-circle" : "calendar", "Daily set", "Weak spots, reviews and new questions", esc(dState) + (streak ? ` <span class="pr-streak">${ic("flame")}${streak}</span>` : ""))}
      ${tile("#speed", "t-speed", "bolt", "Speed drill", "60 seconds of mental maths", bestMode && bestMode[1] ? `Best ${bestMode[1]} · ${esc(bestMode[0][1])}` : "Set your first score")}
      ${tile("mock.html", "t-mock", "timer", "Mock tests", "Company-style timed papers", "TCS, Infosys, AMCAT and more")}
      ${weak ? tile("#drill/" + weak.k, "t-weak", "target", "Weakest pattern", esc(patTitle(wk[0], wk[1], wk[2])), `${Math.round(weak.acc * 100)}% over ${weak.n} answers`)
        : `<div class="pr-tile t-weak off"><span class="ti">${ic("target")}</span><span class="tb"><b>Weakest pattern</b><small>A drill on your lowest-accuracy pattern</small><em>Unlocks after a few answers</em></span></div>`}
    </div>`;
  }

  function setupChange(act, v, el) {
    const c = SETUP;
    if (act === "sec") { c.sec = v; c.topics = []; c.patterns = []; }
    else if (act === "topic") {
      c.topics = c.topics.includes(v) ? (c.topics.length > 1 ? c.topics.filter((x) => x !== v) : c.topics) : c.topics.concat(v);
      c.patterns = [];
    } else if (act === "pat") {
      const all = c._keys;
      let sel = c.patterns.length ? c.patterns.slice() : all.slice();
      sel = sel.includes(v) ? sel.filter((x) => x !== v) : sel.concat(v);
      c.patterns = sel.length ? sel : [];
      if (!sel.length) c.patterns = [v];
    } else if (act === "pat-all") c.patterns = [];
    else if (act === "diff") {
      const d = c.diff.includes(v) ? c.diff.filter((x) => x !== v) : c.diff.concat(v);
      c.diff = d.length ? d : c.diff;
    } else if (act === "set") c[el.dataset.f] = el.dataset.f === "count" ? +v : v;
    const out = Object.assign({}, c); delete out._keys;
    ls.set(LK, out);
    setupView();
  }

  /* ---------------------------------------------------------------- building a set */
  function buildItems(cfg) {
    const rng = QB.rng((Date.now() ^ (Math.random() * 1e9)) >>> 0);
    const pool = QB.pool({ sec: cfg.sec, topics: cfg.topics, patterns: cfg.patterns, diff: cfg.diff });
    const nOf = (q) => (Store ? (Store.item(itemKey(q)).n || 0) : 0);
    const bankBy = {};
    pool.bank.forEach((q) => (bankBy[pk(q)] || (bankBy[pk(q)] = [])).push(q));
    Object.keys(bankBy).forEach((k) => (bankBy[k] = rng.shuffle(bankBy[k]).sort((a, b) => nOf(a) - nOf(b))));
    const genKeys = pool.gens.map((g) => g.key), genSet = new Set(genKeys);
    let source = cfg.source;
    if (source === "gen" && !genKeys.length) source = "bank";
    if (source === "bank" && !pool.bank.length) source = "gen";
    const keys = rng.shuffle(Array.from(new Set(Object.keys(bankBy).concat(genKeys))));
    if (!keys.length) return [];
    const items = [], used = new Set();
    const take = (q) => {
      if (used.has(q.id)) return;
      used.add(q.id); items.push(q.id);
      if (q.set) QB.qs.filter((x) => x.set === q.set && !used.has(x.id)).forEach((x) => { used.add(x.id); items.push(x.id); });
    };
    const tryBank = (k) => { const arr = bankBy[k]; while (arr && arr.length) { const c = arr.shift(); if (!used.has(c.id)) return c; } return null; };
    const tryGen = (k) => { if (!genSet.has(k)) return null; for (let t = 0; t < 6; t++) { const q = QB.make(k, rng.pick(cfg.diff), rng.int(1, 999999)); if (!used.has(q.id)) return q; } return null; };
    let i = 0, miss = 0;
    while (items.length < cfg.count && miss <= keys.length) {
      const k = keys[i++ % keys.length];
      const q = source === "gen" ? tryGen(k) : source === "bank" ? tryBank(k) : (items.length % 2 ? (tryGen(k) || tryBank(k)) : (tryBank(k) || tryGen(k)));
      if (q) { take(q); miss = 0; } else miss++;
    }
    return items;
  }
  function newSession(o) {
    S = Object.assign({ v: 1, mode: "topic", cfg: {}, items: [], idx: 0, far: 0, ans: {}, tq: {}, mark: {}, done: false, started: Date.now(), showSol: true, drill: null }, o);
    qc.clear();
    persist();
  }
  function start() {
    const cfg = SETUP;
    const items = buildItems(cfg);
    if (!items.length) { toast("Nothing matches those choices yet"); return; }
    const out = Object.assign({}, cfg, { label: "Topic practice" }); delete out._keys;
    newSession({ mode: "topic", cfg: out, items });
    go("run");
  }
  function sessionLabel() {
    if (!S) return "";
    const c = S.cfg;
    const what = S.mode === "drill" ? patTitle(S.drill.key.split("/")[0], S.drill.key.split("/")[1], S.drill.key.split("/")[2]) : (c.topics || []).map((t) => topicTitle(c.sec, t)).join(", ");
    return (c.label || "Practice") + (what ? " · " + what : "");
  }

  /* ---------------------------------------------------------------- pattern drill */
  function startDrill(sec, topic, pattern) {
    const key = sec + "/" + topic + "/" + pattern, ix = contentIndex();
    if (!ix.has(key)) return emptyView("drill", sec, topic, pattern);
    const cfg = { sec, topics: [topic], patterns: [key], diff: DIFFS.slice(), count: 0, source: ix.gens[key] ? "gen" : "bank", feedback: "instant", timing: "none", label: "Pattern drill" };
    newSession({ mode: "drill", cfg, items: [], drill: { key, d: "Easy", good: 0, bad: 0, seen: [], best: 0, changed: null } });
    S.items.push(drillPick());
    persist();
    go("run", true);
  }
  function drillPick() {
    const D = S.drill, k = D.key, rng = QB.rng((Date.now() ^ (S.items.length * 7919) ^ Math.floor(Math.random() * 1e9)) >>> 0);
    if (QB.gens[k]) {
      for (let t = 0; t < 8; t++) { const q = QB.make(k, D.d, rng.int(1, 999999)); if (!S.items.includes(q.id)) { qc.set(q.id, q); return q.id; } }
    }
    const all = QB.qs.filter((q) => pk(q) === k);
    const order = [D.d].concat(DIFFS.filter((d) => d !== D.d).sort((a, b) => Math.abs(DIFFS.indexOf(a) - DIFFS.indexOf(D.d)) - Math.abs(DIFFS.indexOf(b) - DIFFS.indexOf(D.d))));
    let cand = [];
    for (const d of order) { cand = all.filter((q) => q.d === d && !D.seen.includes(q.id)); if (cand.length) break; }
    if (!cand.length) { D.seen = []; cand = all.filter((q) => q.d === D.d); if (!cand.length) cand = all; }
    const nOf = (q) => (Store ? Store.item(itemKey(q)).n || 0 : 0);
    cand = rng.shuffle(cand).sort((a, b) => nOf(a) - nOf(b));
    D.seen.push(cand[0].id);
    return cand[0].id;
  }
  function drillAdapt(ok) {
    const D = S.drill;
    if (ok) { D.good = (D.good || 0) + 1; D.bad = 0; } else { D.bad = (D.bad || 0) + 1; D.good = 0; }
    const lvl = DIFFS.indexOf(D.d);
    if (D.good >= 3 && lvl < 2) { D.d = DIFFS[lvl + 1]; D.good = 0; D.changed = "up"; toast("Level up: " + D.d, 1600, "up"); }
    else if (D.bad >= 2 && lvl > 0) { D.d = DIFFS[lvl - 1]; D.bad = 0; D.changed = "down"; toast("Easing off: " + D.d, 1600); }
    else if (D.good >= 3) D.good = 0;
  }

  /* ---------------------------------------------------------------- friendly empty states (#drill on a "soon" pattern, #qs with nothing usable) */
  function emptyView(kind, sec, topic, pattern) {
    view = "empty";
    const ix = contentIndex(), ti = sec && topic ? topicInfo(sec, topic) : null, si = sec ? secInfo(sec) : null;
    let title, text;
    const links = [];
    if (kind === "drill") {
      const known = !!(ti && ti.patterns.some((p) => p.id === pattern));
      title = known ? `No questions for “${esc(patTitle(sec, topic, pattern))}” yet` : "That pattern isn't in the catalogue";
      text = known ? `This pattern is planned, but its questions and generator haven't been written yet. Meanwhile you can read the lesson, use the cheat sheet, or practise the rest of ${esc(topicTitle(sec, topic))}.`
        : "The link may be old. Pick a topic from the practice page instead.";
      if (ti && ix.topicHas(sec, topic)) links.push(`<a class="btn primary" href="#topic/${esc(sec)}/${esc(topic)}">Practise ${esc(ti.title)}</a>`);
      if (ti) links.push(`<a class="btn" href="${learnHref(sec, topic)}">${ic("book")} Learn ${esc(ti.title)}</a>`, `<a class="btn" href="formulas.html#c-${esc(sec)}-${esc(topic)}">${ic("sigma")} Cheat sheet</a>`);
      else if (si) links.push(`<a class="btn" href="${esc(si.page)}">${esc(si.short)} lessons</a>`);
    } else {
      title = "None of those questions could be found";
      text = "The link points at questions that are no longer in the bank. Your progress is safe; start a fresh set instead.";
      links.push(`<a class="btn primary" href="#daily">Daily set</a>`, `<a class="btn" href="revision.html">Review & mistakes</a>`);
    }
    links.push(`<a class="btn" href="#setup">Back to practice</a>`);
    main.innerHTML = `<div class="pr-enter"><div class="pr-card pr-empty"><span class="pe-ic">${ic(kind === "drill" ? "puzzle" : "search")}</span>
      <h2>${title}</h2><p class="muted">${text}</p><div class="btn-row">${links.join("")}</div></div></div>`;
    window.scrollTo(0, 0);
  }

  /* ---------------------------------------------------------------- #qs/<id>,<id>  practise exactly these questions */
  function startQs(raw) {
    const ids = String(raw || "").split(",").map((s) => { s = s.trim(); try { return decodeURIComponent(s); } catch (e) { return s; } }).filter(Boolean);
    const uniq = Array.from(new Set(ids)).filter((id) => !!QB.get(id));
    if (!uniq.length) return emptyView("qs");
    if (S && !S.done && S.mode === "qs" && S.items.join(",") === uniq.join(",")) return go("run", true);
    newSession({ mode: "qs", cfg: { label: "Review set", feedback: "instant", timing: "target" }, items: uniq });
    go("run", true);
  }

  /* ---------------------------------------------------------------- daily set (meta.daily = { date, ids, idx, ans, done, ok }) */
  const dayKey = () => (typeof window.today === "function" ? window.today() : new Date().toISOString().slice(0, 10));
  function dailyMeta() {
    if (!Store) return null;
    const D = Store.load().meta.daily;
    return D && D.date === dayKey() && Array.isArray(D.ids) && D.ids.length ? D : null;
  }
  function buildDailyIds() {
    const N = 20, items = Store.load().items, now = Date.now(), ix = contentIndex();
    const rng = QB.rng("daily:" + dayKey() + ":" + Object.keys(items).length);
    const out = [], used = new Set();
    const add = (q) => { if (!q || used.has(q.id) || out.length >= N) return false; used.add(q.id); out.push(q.id); return true; };
    const nOf = (q) => (items[itemKey(q)] || {}).n || 0;
    const isDue = (q) => { const it = items[itemKey(q)]; return !!(it && it.status && it.next && it.next <= now); };
    const byPat = {};
    QB.qs.forEach((q) => (byPat[pk(q)] || (byPat[pk(q)] = [])).push(q));

    // ~40 %: the weakest patterns (n >= 3, lowest accuracy), a couple of questions each
    const weak = weakPatterns(ix).filter((p) => p.acc < 1).slice(0, 4);
    let left = 8;
    for (let round = 0; left > 0 && weak.length && round < 6; round++) {
      weak.forEach((p) => {
        if (left <= 0) return;
        const bank = rng.shuffle((byPat[p.k] || []).filter((q) => !used.has(q.id) && !isDue(q))).sort((a, b) => nOf(a) - nOf(b));
        let q = null;
        if (QB.gens[p.k] && (round % 2 || !bank.length)) {
          try { q = QB.make(p.k, p.acc < 0.5 ? "Easy" : "Medium", rng.int(1, 999999)); } catch (e) { q = null; }
        }
        if (!q || used.has(q.id)) q = bank[0] || null;
        if (add(q)) left--;
      });
    }
    // ~30 %: due reviews (oldest first); takes some of the weak share when that came up short
    const dueCap = 6 + Math.floor(Math.max(0, left) / 2);
    Object.keys(items).filter((k) => (k.indexOf("q:") === 0 || k.indexOf("g:") === 0) && items[k].status && items[k].next && items[k].next <= now)
      .sort((a, b) => items[a].next - items[b].next)
      .map((k) => QB.get(k.indexOf("q:") === 0 ? k.slice(2) : k)).filter(Boolean)
      .slice(0, dueCap).forEach(add);
    // ~30 %: unseen questions from topics you have touched, or a balanced mix of all four sections if you are new
    const touched = new Set(Object.keys(items).filter((k) => k.indexOf("pat:") === 0 && items[k].n).map((k) => k.slice(4).split("/").slice(0, 2).join("/")));
    const unseen = QB.qs.filter((q) => !used.has(q.id) && !nOf(q));
    const groups = {};
    unseen.forEach((q) => {
      const g = touched.size ? (touched.has(q.sec + "/" + q.topic) ? q.sec + "/" + q.topic : null) : q.sec;
      if (g) (groups[g] || (groups[g] = [])).push(q);
    });
    const gk = rng.shuffle(Object.keys(groups));
    gk.forEach((g) => (groups[g] = rng.shuffle(groups[g])));
    for (let i = 0; out.length < N && gk.some((g) => groups[g].length); i++) { const g = gk[i % gk.length]; if (groups[g].length) add(groups[g].shift()); }
    // still short: anything unseen, then anything at all, then generated
    rng.shuffle(unseen).forEach((q) => out.length < N && add(q));
    rng.shuffle(QB.qs).forEach((q) => out.length < N && add(q));
    const gkeys = Object.keys(QB.gens);
    for (let t = 0; out.length < N && gkeys.length && t < 200; t++) { try { add(QB.make(rng.pick(gkeys), rng.pick(DIFFS), rng.int(1, 999999))); } catch (e) {} }
    return rng.shuffle(out);
  }
  function startDaily() {
    if (!Store) return go("", true);
    let D = dailyMeta();
    if (!D) {
      const ids = buildDailyIds();
      if (!ids.length) return emptyView("qs");
      D = Store.load().meta.daily = { date: dayKey(), ids, idx: 0, ans: {} };
      Store.save();
    }
    if (S && S.mode === "daily" && S.date === D.date && S.items.join(",") === D.ids.join(",")) {
      if (S.done || D.done) { S.done = true; S.celebrated = true; return go("review", true); }
      return go("run", true);
    }
    const ans = {}, tq = {};
    let far = D.idx || 0;
    Object.keys(D.ans || {}).forEach((i) => { ans[i] = Object.assign({}, D.ans[i]); tq[i] = D.ans[i].secs || 0; far = Math.max(far, +i); });
    newSession({ mode: "daily", date: D.date, cfg: { label: "Daily set", feedback: "instant", timing: "target" }, items: D.ids.slice(), idx: clamp(D.idx || 0, 0, D.ids.length - 1), far, ans, tq,
      done: !!D.done, celebrated: !!D.done });
    lastDailySig = "";
    go(D.done ? "review" : "run", true);
  }
  let lastDailySig = "";
  function syncDaily() {
    if (!S || S.mode !== "daily" || !Store) return;
    const D = Store.load().meta.daily;
    if (!D || D.date !== S.date) return;              // the day rolled over: leave the new day's set alone
    const ans = {};
    let ok = 0;
    Object.keys(S.ans).forEach((i) => {
      const a = S.ans[i], o = { c: a.c == null ? null : a.c, secs: Math.round((a.secs || 0) * 10) / 10 };
      if (a.ok) { o.ok = true; ok++; }
      if (a.skip) o.skip = true;
      if (a.rev) o.rev = true;
      ans[i] = o;
    });
    const sig = JSON.stringify([S.idx, ans, !!S.done]);
    if (sig === lastDailySig) return;
    lastDailySig = sig;
    Object.assign(D, { idx: S.idx, ans, ok });
    if (S.done) D.done = true;
    Store.save();
  }
  const dailyChip = () => {
    const n = Store && Store.streak ? Store.streak() : 0;
    return `<span class="pr-chip daily">${ic("flame")}Daily set${n ? ` · ${n}-day streak` : ""}</span>`;
  };

  /* ================================================================ PLAYER */
  const T = { since: null, iv: null, n: 0 };
  const canTime = () => {
    const a = S.ans[S.idx];
    return isTest() ? true : !(a && (a.c != null || a.rev));
  };
  const running = () => view === "run" && S && !S.done && document.visibilityState === "visible" && canTime() && !modalOpen();
  const secsOf = (i) => (S.tq[i] || 0) + (i === S.idx && T.since ? (Date.now() - T.since) / 1000 : 0);
  function flush() { if (S && T.since) { S.tq[S.idx] = secsOf(S.idx); T.since = null; } }
  function resume() { if (S && running() && !T.since) T.since = Date.now(); }
  function stopTick() { flush(); clearInterval(T.iv); T.iv = null; persist(); }
  const elapsed = () => { let s = 0; for (let i = 0; i < total(); i++) s += secsOf(i); return s; };
  const totalTarget = () => S.items.reduce((s, id) => s + (getQ(id).time || 60), 0);

  function playerView() {
    view = "run";
    S.idx = clamp(S.idx, 0, total() - 1);
    S.far = Math.max(S.far || 0, S.idx);
    resume();
    clearInterval(T.iv);
    T.iv = setInterval(tick, 250);
    paint(true);
  }
  function paint(fresh) {
    if (!S || view !== "run") return;
    const y = window.scrollY;
    main.innerHTML = playerHTML(fresh);
    if (fresh) {
      const q = cur();
      if (window.RoughPad && RoughPad.setContext) RoughPad.setContext(q.id);
      const top = main.getBoundingClientRect().top + window.scrollY - 70;
      if (window.scrollY > top) window.scrollTo(0, Math.max(0, top));
    } else window.scrollTo(0, y);
    tick();
  }
  const modeName = () => (S.cfg.label || (S.mode === "drill" ? "Pattern drill" : "Topic practice"));

  function timerHTML() {
    return `<div class="pr-timer" id="prTimer"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" fill="none" stroke="var(--panel-2)" stroke-width="4"/>
      <circle id="prRing" cx="18" cy="18" r="14" fill="none" stroke="var(--page-c, var(--accent))" stroke-width="4" stroke-linecap="round" stroke-dasharray="${RING}" stroke-dashoffset="${RING}" transform="rotate(-90 18 18)"/></svg>
      <span class="t" id="prT">0:00</span><span class="tg" id="prTg"></span></div>`;
  }
  function segHTML() {
    const n = total();
    if (S.mode === "drill") {
      const idxs = []; for (let i = Math.max(0, n - 30); i < n; i++) idxs.push(i);
      return idxs.map((i) => `<i class="${segCls(i)}"></i>`).join("");
    }
    return Array.from({ length: n }, (_, i) => `<i class="${segCls(i)}"></i>`).join("");
  }
  function segCls(i) {
    const a = S.ans[i];
    if (i === S.idx && !(a && a.c != null && !isTest())) return "cur";
    if (!a) return "";
    if (isTest()) return a.c != null ? "a" : "";
    return a.c == null ? (a.rev || a.skip ? "s" : "") : a.ok ? "c" : "w";
  }
  function crumbHTML(q) {
    return `<span class="pr-chip sec" style="--sc:var(${SEC_VAR[q.sec] || "--accent"})">${esc(secName(q.sec))}</span><b>${esc(topicTitle(q.sec, q.topic))}</b> <span class="sep">›</span> ${esc(patTitle(q.sec, q.topic, q.pattern))} <span class="pr-chip ${DCLS[q.d] || "med"}">${esc(q.d)}</span>`;
  }

  function playerHTML(fresh) {
    const q = cur(), i = S.idx, n = total(), a = S.ans[i] || null;
    const test = isTest(), drill = S.mode === "drill";
    const answered = !!(a && a.c != null), revealed = !!(a && a.rev), fb = !test && (answered || revealed);
    const set = q.set && QB.sets[q.set] ? QB.sets[q.set] : null;
    const it = qItem(q), starred = !!it.star, marked = !!S.mark[i];

    const opts = q.opts.map((o, k) => {
      let cls = "", mk = "", why = "";
      if (fb) {
        if (k === q.ans) { cls = "ok"; mk = ic("check", "mk"); }
        else if (answered && a.c === k) { cls = "bad"; mk = ic("x", "mk"); }
        else cls = "dim";
        if (k !== q.ans && q.why && q.why[k]) why = `<span class="why">${fmt(q.why[k])}</span>`;
      } else if (test && answered && a.c === k) cls = "sel";
      return `<button type="button" class="pr-opt ${cls}" data-act="opt" data-i="${k}"><span class="k">${LET[k]}</span><span class="v">${fmt(o)}</span>${why}${mk}</button>`;
    }).join("");

    let after = "";
    if (fb) after = feedbackHTML(q, a, answered);

    // actions
    const last = !drill && i >= n - 1;
    const nextBtn = `<button class="btn primary" data-act="next"${!test && !(answered || revealed || (a && a.skip)) ? " disabled" : ""}>${swapLabel([test && last ? "Finish" : last ? "Finish" : "Next", "Finish"], last ? 1 : 0)} <kbd>Enter</kbd></button>`;
    let acts;
    if (test) {
      acts = `<button class="btn" data-act="prev"${i === 0 ? " disabled" : ""}>${ic("back")} Previous</button>
        ${answered ? `<button class="btn" data-act="clear">Clear answer</button>` : ""}<span class="grow"></span>${nextBtn}`;
    } else if (!(answered || revealed)) {
      acts = `<button class="btn" data-act="reveal">Show solution <kbd>S</kbd></button><button class="btn" data-act="skip">Skip</button><span class="grow"></span>${nextBtn}`;
    } else {
      const wrong = revealed || (answered && !a.ok), inBook = it.status === "revise";
      const hasSol = !!((q.sol && q.sol.length) || q.short || q.trap);
      acts = `${hasSol ? `<button class="btn" data-act="sol">${swapLabel(["Hide solution <kbd>S</kbd>", "Show solution <kbd>S</kbd>"], S.showSol ? 0 : 1)}</button>` : ""}
        ${wrong ? `<button class="btn${inBook ? " on-red" : ""}" data-act="book">${swapLabel(["Add to mistake book", "In mistake book"], inBook ? 1 : 0)}</button>` : ""}
        ${drill ? "" : `<a class="btn" href="#drill/${pk(q)}" data-act="drill">Drill this pattern</a>`}<span class="grow"></span>${nextBtn}`;
    }

    const head = `<div class="pr-qhead"><span class="pr-qno">Q${i + 1}</span><span class="pr-pat">Pattern: <b>${esc(patTitle(q.sec, q.topic, q.pattern))}</b></span><span class="grow"></span>
      <button class="pr-icon${starred ? " on" : ""}" data-act="star" title="Bookmark (F)" aria-label="Bookmark">${ic(starred ? "star-fill" : "star")}</button>
      <button class="pr-icon${marked ? " mk" : ""}" data-act="mark" title="Mark for review (M)" aria-label="Mark for review">${ic("flag")}</button></div>`;
    const qcard = (extraTop, small) => `<div class="pr-card pr-qcard${fb ? " answered" : ""}${test ? " test" : ""}" id="prQ">${extraTop || ""}${head}
        <div class="pr-qtext${small ? " sm" : ""}">${body(q.q)}</div><div class="pr-opts">${opts}</div>${after}<div class="pr-actions">${acts}</div></div>`;

    // session bar
    const prog = drill ? `Q <b>${i + 1}</b>` : `Q <b>${i + 1}</b> / ${n}`;
    const lvl = drill ? `<span class="pr-chip lvl">Level <b>${S.drill.d}</b></span>` : "";
    const daily = S.mode === "daily";
    const bar = `<div class="pr-sbar"><button type="button" class="pr-back" data-act="end">${ic("back")} ${daily ? "Save and exit" : "End session"}</button>
      <div class="pr-crumb">${crumbHTML(q)}</div><span class="grow"></span>${lvl}
      ${daily ? dailyChip() : `<span class="pr-chip mode">${esc(modeName())} · ${test ? "Test" : "Instant"}</span>`}${timerHTML()}<span class="pr-qcount">${prog}</span></div>
      <div class="pr-seg${drill ? " drill" : ""}">${segHTML()}</div>`;

    let mainCol;
    if (set) {
      const sibs = S.items.map((id, k) => [id, k]).filter(([id]) => getQ(id).set === q.set), pos = sibs.findIndex(([, k]) => k === i);
      const nav = `<div class="pr-setnav">Set question ${pos + 1} of ${sibs.length} ${sibs.map(([, k]) => `<i class="${k === i ? "cur" : S.ans[k] && S.ans[k].c != null ? (test ? "c" : S.ans[k].ok ? "c" : "w") : ""}"></i>`).join("")}</div>`;
      mainCol = `<div class="pr-split"><div class="pr-card pr-stim"><span class="pr-pin">${ic("pin")}stays in view</span>${QB.setHTML(set)}</div>${qcard(nav, true)}</div>
        <div class="pr-card pr-strip"><h5>Questions</h5>${paletteHTML()}${legendHTML()}</div>`;
    } else {
      mainCol = `<div class="pr-grid"><div class="pr-main">${qcard()}</div>${railHTML()}</div>`;
    }
    return `<div class="${fresh ? "pr-enter" : ""}">${bar}${mainCol}</div>`;
  }

  function feedbackHTML(q, a, answered) {
    const secs = a.secs != null ? a.secs : S.tq[S.idx] || 0, tgt = q.time || 60, d = secs - tgt;
    let res;
    const timeLine = `Your time <b class="${d > 0 ? "over" : ""}">${mmss(secs)}</b> · target ${mmss(tgt)}${S.cfg.timing === "none" ? "" : d > 0 ? ` · <b class="over">${Math.round(d)} s over</b>` : ` · ${Math.round(-d)} s under`}`;
    const rushed = answered && !a.ok && secs > 0 && secs < tgt * 0.3 ? `<div class="pr-rushed">${ic("timer")} Answered in ${Math.max(1, Math.round(secs))} s. Rushed? Try reading the question once more before choosing.</div>` : "";
    if (answered && a.ok) {
      res = `<div class="pr-result ok"><span class="pr-ri">${ic("check-circle")}</span><div><div class="big">Correct</div><div class="tm">${timeLine}</div></div></div>`;
    } else if (answered) {
      res = `<div class="pr-result bad"><span class="pr-ri">${ic("x")}</span><div><div class="big">Not quite. It's ${LET[q.ans]}, ${fmt(q.opts[q.ans])}</div><div class="tm">${timeLine}</div>${rushed}</div>
        <div class="pr-reasons">Why missed?${REASONS.map(([v, l]) => `<button type="button" class="${a.why === v ? "on" : ""}" data-act="why" data-v="${v}">${l}</button>`).join("")}</div></div>`;
    } else {
      res = `<div class="pr-result skip"><span class="pr-ri">${ic("bulb")}</span><div><div class="big">Solution shown. It's ${LET[q.ans]}, ${fmt(q.opts[q.ans])}</div><div class="tm">This one isn't counted. Try it again later.</div></div></div>`;
    }
    let sol = "";
    if (S.showSol && ((q.sol && q.sol.length) || q.short || q.trap)) {
      sol = `<div class="pr-sol"><h4>${ic("solution")} Solution</h4>${q.sol && q.sol.length ? `<ol>${q.sol.map((s) => `<li>${fmt(s)}</li>`).join("")}</ol>` : ""}
        ${q.short || q.trap ? `<div class="pr-boxes${q.short && q.trap ? "" : " one"}">${q.short ? `<div class="pr-box tip"><div class="lb">${ic("bolt")} Shortcut</div>${fmt(q.short)}</div>` : ""}${q.trap ? `<div class="pr-box trap"><div class="lb">${ic("warn")} Trap</div>${fmt(q.trap)}</div>` : ""}</div>` : ""}</div>`;
    }
    return res + sol;
  }

  function paletteHTML() {
    const n = total(), test = isTest();
    let h = "";
    for (let i = 0; i < n; i++) {
      const a = S.ans[i];
      let c = "";
      if (test) c = a && a.c != null ? "a" : "";
      else if (a) c = a.c == null ? "s" : a.ok ? "c" : "w";
      if (i === S.idx) c += " cur";
      if (S.mark[i]) c += " m";
      const lock = !test && i > S.far;
      h += `<button type="button" class="${c}" data-act="go" data-i="${i}"${lock ? " disabled" : ""} title="Question ${i + 1}">${i + 1}</button>`;
    }
    return `<div class="pr-pal">${h}</div>`;
  }
  function legendHTML() {
    return isTest()
      ? `<div class="pr-legend"><span><i style="background:var(--accent-soft);border:1px solid var(--accent)"></i>answered</span><span><i style="background:var(--purple);border-radius:50%"></i>marked</span><span><i style="border:1px solid var(--border)"></i>not answered</span></div>`
      : `<div class="pr-legend"><span><i style="background:var(--green)"></i>correct</span><span><i style="background:var(--red)"></i>wrong</span><span><i style="background:var(--purple);border-radius:50%"></i>marked</span><span><i style="border:1px solid var(--border)"></i>not seen</span></div>`;
  }
  function scoreOf() {
    let ok = 0, n = 0, secs = 0, wrong = 0;
    Object.keys(S.ans).forEach((i) => { const a = S.ans[i]; if (a.c != null) { n++; if (a.ok) ok++; else wrong++; secs += a.secs || 0; } });
    return { ok, n, wrong, secs, acc: n ? Math.round((ok / n) * 100) : 0, avg: n ? secs / n : 0 };
  }
  function railHTML() {
    const test = isTest(), drill = S.mode === "drill";
    let stats;
    if (test) {
      const ans = answeredCount(), mk = Object.keys(S.mark).filter((k) => S.mark[k]).length;
      stats = `<div class="pr-card"><h5>Your test</h5><div class="pr-stats"><div><b>${ans}/${total()}</b><span>answered</span></div><div><b>${mk}</b><span>marked</span></div><div><b>${mmss(elapsed())}</b><span>time</span></div></div></div>`;
    } else {
      const sc = scoreOf();
      stats = `<div class="pr-card"><h5>${drill ? "This drill" : "This session"}</h5><div class="pr-stats"><div><b>${sc.ok}/${sc.n}</b><span>correct</span></div><div><b>${sc.n ? sc.acc + "%" : "-"}</b><span>accuracy</span></div><div><b>${sc.n ? mmss(sc.avg) : "-"}</b><span>avg / Q</span></div></div>
        ${drill ? `<div class="pr-lvl"><span>Difficulty</span>${DIFFS.map((d) => `<i class="${d === S.drill.d ? "on " : ""}${DCLS[d]}">${d}</i>`).join("")}</div><div class="pr-note">3 right in a row moves you up, 2 wrong in a row eases off.</div>` : ""}</div>`;
    }
    return `<aside class="pr-rail">${stats}<div class="pr-card"><h5>Questions</h5>${paletteHTML()}${legendHTML()}</div>
      <div class="pr-card"><h5>Keys</h5><div class="pr-keys">
        <span><kbd>1</kbd>–<kbd>4</kbd> <kbd>A</kbd>–<kbd>D</kbd></span><span>${test ? "choose (again to clear)" : "answer"}</span>
        <kbd>Enter</kbd><span>next question</span>
        ${test ? "" : "<kbd>S</kbd><span>show solution</span>"}
        <kbd>M</kbd><span>mark for review</span>
        <kbd>F</kbd><span>bookmark</span>
        <span><kbd>←</kbd> <kbd>→</kbd></span><span>previous / next</span>
        <kbd>W</kbd><span>rough-work pad</span></div></div></aside>`;
  }

  /* timer / ring: updated in place every 250 ms, never re-renders the page */
  function tick() {
    if (view !== "run" || !S) return;
    const t = document.getElementById("prT");
    if (!t) return;
    if (++T.n % 20 === 0) persist();
    const q = cur(), i = S.idx, secs = secsOf(i), tgt = q.time || 60, mode = S.cfg.timing;
    const tg = document.getElementById("prTg"), ring = document.getElementById("prRing"), box = document.getElementById("prTimer");
    let big = secs, sub = "", frac = 0, over = false, showRing = true;
    if (mode === "target") { sub = "/ " + mmss(tgt); frac = clamp(secs / tgt, 0, 1); over = secs > tgt; }
    else if (mode === "total") {
      const tt = totalTarget(), rem = tt - elapsed();
      big = Math.max(0, rem); sub = "/ " + mmss(tt); frac = clamp(1 - rem / tt, 0, 1); over = rem < Math.min(60, tt * 0.1);
      if (rem <= 0 && !S.done) { timeUp(); return; }
    } else showRing = false;
    t.textContent = mmss(big);
    tg.textContent = sub;
    box.classList.toggle("over", over);
    box.classList.toggle("noring", !showRing);
    box.classList.toggle("still", !T.since);
    ring.style.strokeDashoffset = String(RING * (1 - frac));
    ring.style.stroke = over ? "var(--amber)" : "var(--page-c, var(--accent))";
    if (!isTest()) { /* instant feedback block shows its own time; nothing else to update */ }
    const st = main.querySelector(".pr-stats div:nth-child(3) b");
    if (st && isTest()) st.textContent = mmss(elapsed());
  }
  function timeUp() {
    toast("Time is up", 2200, "timer");
    finish(true);
  }
  document.addEventListener("visibilitychange", () => {
    if (!S || view !== "run") return;
    if (document.visibilityState === "hidden") { flush(); persist(); } else resume();
  });
  window.addEventListener("pagehide", () => { if (S) { flush(); persist(); } });

  /* ---------------------------------------------------------------- player actions */
  function goTo(i) {
    flush();
    S.idx = clamp(i, 0, total() - 1);
    S.far = Math.max(S.far || 0, S.idx);
    resume();
    persist();
    paint(true);
  }
  function answer(k) {
    if (view !== "run" || !S) return;
    const q = cur(), i = S.idx, a = S.ans[i];
    if (k < 0 || k >= q.opts.length) return;
    if (isTest()) {
      flush(); resume();
      S.ans[i] = Object.assign({}, a, { c: a && a.c === k ? null : k });
      if (S.ans[i].c == null) delete S.ans[i];
      persist(); paint(false); return;
    }
    if (a && (a.c != null || a.rev)) return;                       // locked
    flush();
    const secs = S.tq[i] || 0, r = QB.record(q, k, secs);
    S.ans[i] = { c: k, ok: r.ok, secs };
    if (S.mode === "drill") drillAdapt(r.ok);
    if (r.ok && window.FX && FX.confetti && window.matchMedia && !matchMedia("(prefers-reduced-motion: reduce)").matches && Math.random() < 0.0) FX.confetti();
    persist();
    paint(false);
  }
  function reveal() {
    if (isTest()) return;
    const i = S.idx, a = S.ans[i];
    if (a && (a.c != null || a.rev)) return;
    flush();
    S.ans[i] = { c: null, rev: true, skip: true, secs: S.tq[i] || 0 };
    S.showSol = true;
    persist(); paint(false);
  }
  function skip() {
    if (isTest()) return;
    const i = S.idx, a = S.ans[i];
    if (a && (a.c != null || a.rev)) return;
    flush();
    S.ans[i] = { c: null, skip: true, secs: S.tq[i] || 0 };
    persist();
    next(true);
  }
  function next(fromSkip) {
    if (!S || view !== "run") return;
    const a = S.ans[S.idx], test = isTest();
    if (!test && !fromSkip && !(a && (a.c != null || a.rev || a.skip))) return;
    if (S.mode === "drill") {
      if (S.idx < total() - 1) return goTo(S.idx + 1);
      flush();
      S.items.push(drillPick());
      S.drill.changed = null;
      return goTo(total() - 1);
    }
    if (S.idx >= total() - 1) return finishFlow();
    goTo(S.idx + 1);
  }
  function prev() { if (S && view === "run" && S.idx > 0) goTo(S.idx - 1); }
  function step(dir) {
    if (!S) return;
    const lim = isTest() ? total() - 1 : S.far;
    const j = S.idx + dir;
    if (j >= 0 && j <= lim) goTo(j);
  }
  function toggleMark() {
    const i = S.idx, q = cur();
    S.mark[i] = !S.mark[i];
    if (Store) Store.patch(itemKey(q), { mark: !!S.mark[i] });
    persist(); paint(false);
  }
  function toggleStar() {
    const q = cur();
    if (!Store) return;
    const it = Store.toggleStar(itemKey(q));
    toast(it.star ? "Bookmarked" : "Bookmark removed", 1200, it.star ? "star-fill" : "star");
    paint(false);
  }
  function setReason(v) {
    const i = S.idx, a = S.ans[i], q = cur();
    if (!a || a.c == null || a.ok) return;
    a.why = a.why === v ? null : v;
    if (Store) Store.patch(itemKey(q), { why: a.why });
    persist(); paint(false);
  }
  function toggleBook() {
    const q = cur();
    if (!Store) return;
    const it = Store.item(itemKey(q)), now = Date.now();
    if (it.status === "revise") Store.patch(itemKey(q), { status: it.doneAt ? "done" : null, next: now + 86400000 });
    else Store.patch(itemKey(q), { status: "revise", next: now, level: 0, doneAt: it.doneAt || now });
    toast(it.status === "revise" ? "Removed from the mistake book" : "Added to the mistake book", 1400, "check");
    paint(false);
  }

  /* ending */
  function endSession() {
    if (S.mode === "daily") {                       // the daily set pauses instead of ending: it resumes from #daily all day
      flush(); persist();
      toast("Daily set saved. Pick it up any time today.", 1800, "check");
      return go("setup");
    }
    const ans = answeredCount();
    if (!ans) {
      confirmBox({ title: "Leave this set?", text: "You haven't answered anything yet.", ok: "Leave", cancel: "Keep going" }).then((y) => {
        if (y) { S = null; ss.del(SK); go("", true); }
      });
      return;
    }
    confirmBox({ title: "End this session?", text: `You've answered ${ans} of ${S.mode === "drill" ? "the questions so far" : total()}. Your answers are already saved to your progress.`, ok: "End and review", cancel: "Keep going" })
      .then((y) => { if (y) finish(); });
  }
  function finishFlow() {
    const n = total(), ans = answeredCount(), un = n - ans, marked = Object.keys(S.mark).filter((k) => S.mark[k]).length;
    if (isTest() || un > 0) {
      confirmBox({
        title: isTest() ? "Submit the test?" : "Finish the set?",
        text: `Answered ${ans} of ${n}${un ? ` · ${un} not answered` : ""}${marked ? ` · ${marked} marked for review` : ""}.`,
        ok: isTest() ? "Submit" : "Finish", cancel: "Keep working",
      }).then((y) => { if (y) finish(); });
    } else finish();
  }
  function finish() {
    if (!S || S.done) return;
    flush();
    if (isTest()) {
      for (let i = 0; i < total(); i++) {
        const a = S.ans[i];
        if (!a || a.c == null) continue;
        const q = getQ(S.items[i]);
        a.secs = S.tq[i] || 0;
        a.ok = a.c === q.ans;
        QB.record(q, a.c, a.secs);
      }
    }
    S.done = true; S.endedAt = Date.now();
    clearInterval(T.iv); T.iv = null; T.since = null;
    persist();
    go("review");
  }

  /* ---------------------------------------------------------------- confirm box */
  let modalRes = null, modalEl = null;
  function ensureModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement("div");
    modalEl.className = "pr-modal";
    modalEl.innerHTML = `<div class="pr-modal-box" role="dialog" aria-modal="true" aria-labelledby="prMT"><h3 id="prMT"></h3><p id="prMP"></p>
      <div class="pr-modal-actions"><button type="button" class="btn" data-m="0"></button><button type="button" class="btn primary" data-m="1"></button></div></div>`;
    document.body.appendChild(modalEl);
    modalEl.addEventListener("click", (e) => { const b = e.target.closest("[data-m]"); if (b) closeModal(b.dataset.m === "1"); else if (e.target === modalEl) closeModal(false); });
    return modalEl;
  }
  const modalOpen = () => !!(modalEl && modalEl.classList.contains("show"));
  function confirmBox(o) {
    ensureModal();
    flush();
    modalEl.querySelector("#prMT").textContent = o.title;
    modalEl.querySelector("#prMP").textContent = o.text;
    modalEl.querySelector('[data-m="0"]').textContent = o.cancel || "Cancel";
    modalEl.querySelector('[data-m="1"]').textContent = o.ok || "OK";
    modalEl.classList.add("show");
    setTimeout(() => { const b = modalEl.querySelector('[data-m="1"]'); if (b) b.focus({ preventScroll: true }); }, 30);
    return new Promise((res) => { modalRes = res; });
  }
  function closeModal(val) {
    if (!modalEl || !modalEl.classList.contains("show")) { return; }
    modalEl.classList.remove("show");
    const a = document.activeElement; if (a && modalEl.contains(a)) a.blur();
    const r = modalRes; modalRes = null;
    if (view === "run") resume();
    if (r) r(val === true);
  }

  /* ================================================================ REVIEW */
  function reviewRows() {
    return S.items.map((id, i) => {
      const q = getQ(id), a = S.ans[i] || null;
      const st = !a ? "none" : a.c == null ? (a.skip || a.rev ? "skip" : "none") : a.ok ? "ok" : "bad";
      return { i, q, a, st, secs: a ? (a.secs != null ? a.secs : S.tq[i] || 0) : S.tq[i] || 0 };
    }).filter((r) => S.mode !== "drill" || r.st !== "none");
  }
  function reviewView() {
    view = "review";
    flush();
    const rows = reviewRows(), asked = rows.filter((r) => r.st !== "none");
    const okN = rows.filter((r) => r.st === "ok").length, badN = rows.filter((r) => r.st === "bad").length, skipN = rows.filter((r) => r.st === "skip" || r.st === "none").length;
    const answered = okN + badN, n = rows.length;
    const acc = answered ? Math.round((okN / answered) * 100) : 0, tot = rows.reduce((s, r) => s + (r.st === "none" ? 0 : r.secs), 0);
    const avg = answered ? rows.filter((r) => r.st === "ok" || r.st === "bad").reduce((s, r) => s + r.secs, 0) / answered : 0;
    const avgTgt = n ? rows.reduce((s, r) => s + (r.q.time || 60), 0) / n : 0;

    // time strip
    const scale = Math.max(10, ...rows.map((r) => Math.max(r.secs, r.q.time || 60)));
    const strip = rows.map((r, k) => {
      const h = clamp((r.secs / scale) * 100, r.st === "none" ? 0 : 5, 100), tk = clamp(((r.q.time || 60) / scale) * 100, 0, 100);
      return `<a class="pr-bar ${r.st}" href="#" data-act="row" data-i="${k}" title="Q${r.i + 1} · ${mmss(r.secs)} · target ${mmss(r.q.time || 60)} · ${r.st === "ok" ? "correct" : r.st === "bad" ? "wrong" : "not answered"}"><span class="fill" style="height:${h}%"></span><span class="tick" style="bottom:${tk}%"></span><em>${r.i + 1}</em></a>`;
    }).join("");

    // per pattern
    const pats = {};
    rows.forEach((r) => {
      if (r.st === "none") return;
      const k = pk(r.q), p = pats[k] || (pats[k] = { k, q: r.q, n: 0, c: 0, t: 0, tg: 0 });
      p.n++; if (r.st === "ok") p.c++; p.t += r.secs; p.tg += r.q.time || 60;
    });
    const plist = Object.values(pats).sort((a, b) => a.c / a.n - b.c / b.n || b.n - a.n);
    const ptable = plist.map((p) => {
      const pc = Math.round((p.c / p.n) * 100), a = p.t / p.n, g = p.tg / p.n;
      return `<tr><td class="pn">${esc(patTitle(p.q.sec, p.q.topic, p.q.pattern))}<div class="muted small">${esc(topicTitle(p.q.sec, p.q.topic))}</div></td><td class="num">${p.n}</td><td class="num">${p.c}</td>
        <td><span class="pr-mini ${pc >= 70 ? "g" : pc >= 40 ? "a" : "r"}"><i style="width:${pc}%"></i></span> ${pc}%</td>
        <td class="num">${mmss(a)} <span class="muted small">/ ${mmss(g)}</span></td><td class="act"><a class="btn sm" href="#drill/${p.k}">Drill</a></td></tr>`;
    }).join("");
    const weakest = plist.find((p) => p.c < p.n);

    const list = rows.map((r, k) => {
      const q = r.q, a = r.a;
      const icn = r.st === "ok" ? `<span class="pr-si ok">${ic("check")}</span>` : r.st === "bad" ? `<span class="pr-si bad">${ic("x")}</span>` : `<span class="pr-si">${ic("skip")}</span>`;
      const opts = q.opts.map((o, j) => `<div class="pr-ro${j === q.ans ? " ok" : a && a.c === j ? " bad" : ""}"><span class="k">${LET[j]}</span><span>${fmt(o)}</span>${j === q.ans ? '<em>correct</em>' : a && a.c === j ? "<em>your answer</em>" : ""}${q.why && q.why[j] && (!a || a.c === j || r.st !== "ok") ? `<small>${fmt(q.why[j])}</small>` : ""}</div>`).join("");
      const sol = (q.sol && q.sol.length ? `<ol>${q.sol.map((s) => `<li>${fmt(s)}</li>`).join("")}</ol>` : "") +
        (q.short ? `<div class="pr-box tip"><div class="lb">${ic("bolt")} Shortcut</div>${fmt(q.short)}</div>` : "") + (q.trap ? `<div class="pr-box trap"><div class="lb">${ic("warn")} Trap</div>${fmt(q.trap)}</div>` : "");
      return `<details class="pr-qrow" id="prRow${k}"><summary>${icn}<span class="n">Q${r.i + 1}</span><span class="t">${fmt(q.q.replace(/\n/g, " "))}</span><span class="pr-chip ${DCLS[q.d] || "med"}">${esc(q.d)}</span><span class="tm">${r.st === "none" ? "-" : mmss(r.secs)}</span>${ic("chevron", "chev")}</summary>
        <div class="pr-qbody"><div class="muted small">${esc(patTitle(q.sec, q.topic, q.pattern))}</div><div class="pr-qtext sm">${body(q.q)}</div><div class="pr-ro-list">${opts}</div><div class="pr-sol">${sol || '<span class="muted">No written solution for this one.</span>'}</div></div></details>`;
    }).join("");

    const hot = acc >= 80 && answered >= 3;
    main.innerHTML = `<div class="pr-enter">
      <div class="pr-sbar"><a class="pr-back" href="#setup" data-act="newset">${ic("back")} Practice</a><div class="pr-crumb"><b>${esc(sessionLabel())}</b></div><span class="grow"></span><span class="pr-chip mode">${isTest() ? "Test" : "Instant"}</span></div>
      <h1 class="pr-h1">${S.mode === "drill" ? "Drill finished" : S.mode === "daily" ? "Daily set done" : "Set finished"}</h1>
      ${S.mode === "daily" ? `<p class="lead pr-dailydone">${dailyChip()} Nice work showing up today. A fresh set is built tomorrow from what you get wrong now.</p>` : ""}
      <div class="pr-card pr-hero ${hot ? "hot" : ""}">
        <div class="pr-score"><b>${okN}</b><span>/ ${n}${S.mode === "drill" ? "" : ""}</span><div class="muted small">${answered ? (acc >= 80 ? "Strong set." : acc >= 50 ? "Decent. The slips below are the quick wins." : "Rough one. Work through the solutions below.") : "Nothing answered."}</div></div>
        <div class="pr-stats big">
          <div><b>${acc}%</b><span>accuracy</span></div>
          <div><b>${mmss(tot)}</b><span>total time</span></div>
          <div><b>${answered ? mmss(avg) : "-"}</b><span>avg / question <small>(target ${mmss(avgTgt)})</small></span></div>
          <div><b>${badN}</b><span>wrong${skipN ? ` · ${skipN} skipped` : ""}</span></div>
        </div></div>
      <div class="pr-card"><h5>Time per question <small>bar = your time, line = target. Green right, red wrong.</small></h5><div class="pr-strip-t">${strip}</div></div>
      ${ptable ? `<div class="pr-card"><h5>By pattern <small>weakest first</small></h5><div class="pr-tbl-wrap"><table class="pr-table"><thead><tr><th>Pattern</th><th>Asked</th><th>Right</th><th>Accuracy</th><th>Avg time / target</th><th></th></tr></thead><tbody>${ptable}</tbody></table></div></div>` : ""}
      <div class="pr-card"><h5>Questions <small>tap one for the solution</small></h5><div class="pr-qlist">${list}</div></div>
      <div class="pr-actions pr-final">
        ${badN + skipN ? `<button class="btn" data-act="retry">${ic("restart")} Retry wrong ones</button><button class="btn" data-act="mistakes">${swapLabel(["Add wrong to mistake book", "Added " + ic("check")], 0)}</button>` : ""}
        ${weakest ? `<a class="btn" href="#drill/${weakest.k}">Drill weakest pattern</a>` : ""}
        ${S.mode === "daily" ? `<a class="btn" href="#speed">${ic("bolt")} Speed drill</a>` : ""}
        <span class="grow"></span><a class="btn primary" href="#setup" data-act="newset">New set</a></div></div>`;
    window.scrollTo(0, 0);
    if (S.mode === "daily" && !S.celebrated) {        // finishing the daily set always earns a soft celebration
      S.celebrated = true; persist();
      setTimeout(() => { if (typeof window.fxConfetti === "function") window.fxConfetti(); toast("Daily set done. See you tomorrow!", 2200, "check"); }, 350);
    } else if (hot && !S.celebrated) {
      S.celebrated = true; persist();
      setTimeout(() => { if (window.FX && FX.bigConfetti) FX.bigConfetti(); else if (typeof window.fxConfetti === "function") window.fxConfetti(); }, 350);
    }
  }
  function retryWrong() {
    const rows = reviewRows().filter((r) => r.st === "bad" || r.st === "skip");
    if (!rows.length) return;
    const cfg = Object.assign({}, S.cfg, { feedback: "instant", label: "Retry wrong ones", timing: S.cfg.timing === "total" ? "target" : S.cfg.timing });
    newSession({ mode: "topic", cfg, items: rows.map((r) => r.q.id) });
    go("run");
  }
  function addMistakes(btn) {
    if (!Store) return;
    const now = Date.now();
    const rows = reviewRows().filter((r) => r.st === "bad" || r.st === "skip");
    rows.forEach((r) => { const k = itemKey(r.q), it = Store.item(k); Store.patch(k, { status: "revise", next: now, level: 0, doneAt: it.doneAt || now }); });
    if (window.setSwap && btn) setSwap(btn, 1);
    toast(`${rows.length} question${rows.length === 1 ? "" : "s"} in your mistake book`, 1600, "check");
  }

  /* ================================================================ SPEED DRILL  (#speed, #speed/<mode>)
     60 seconds of typed mental maths. Questions come from a seeded RNG (the seed is kept with the run).
     meta.speed = { best: { <mode>: score }, runs: [ { mode, score, n, at, seed } ] (newest first, 20 kept) } */
  const SPEED_MODES = [
    ["mixed", "Mixed", "A bit of everything below"],
    ["squares", "Squares & cubes", "n², n³ and square roots"],
    ["percent", "Percentages", "x% of y, fraction ↔ %"],
    ["tricks", "Multiplication tricks", "×5, ×25, ×125, squares near 100"],
    ["tables", "Tables & addition", "Tables to 20, quick sums"],
  ];
  const SPEED_SECS = 60;
  const speedName = (m) => (SPEED_MODES.find((x) => x[0] === m) || SPEED_MODES[0])[1];
  function speedMeta() {
    const m = Store ? Store.load().meta : {};
    const sp = m.speed && typeof m.speed === "object" ? m.speed : {};
    sp.best = sp.best || {};
    sp.runs = Array.isArray(sp.runs) ? sp.runs : [];
    return sp;
  }
  const SPGEN = {
    squares(r) {
      const t = r();
      if (t < 0.5) { const n = r.chance(0.2) ? r.int(4, 10) : r.int(11, 30); return { q: n + "²", a: n * n, tip: n > 10 ? `(a + b)² = a² + 2ab + b²: ${n}² = ${Math.floor(n / 10) * 10}² + 2·${Math.floor(n / 10) * 10}·${n % 10} + ${n % 10}²` : "Squares to 30 are worth knowing by heart." }; }
      if (t < 0.75) { const n = r.int(2, 15); return { q: n + "³", a: n * n * n, tip: "Learn cubes 1–15 by heart; they turn up in series and volumes." }; }
      const n = r.int(11, 32); return { q: "√" + n * n, a: n, tip: `The last digit narrows it down, then compare with the nearest tens: ${n}² = ${n * n}.` };
    },
    percent(r) {
      const t = r();
      if (t < 0.45) {
        const xs = [[5, 20], [10, 10], [12.5, 8], [15, 20], [20, 5], [25, 4], [30, 10], [35, 20], [37.5, 8], [40, 5], [45, 20], [50, 2], [60, 5], [62.5, 8], [75, 4], [80, 5], [120, 5], [125, 4], [150, 2]];
        const [x, q] = r.pick(xs), y = q * r.int(2, Math.max(3, Math.floor(1000 / q)));
        return { q: `${x}% of ${y}`, a: QB.round((x * y) / 100, 4), tip: x === 12.5 || x === 37.5 || x === 62.5 ? `${x}% = ${x / 12.5}/8, so take ${y} ÷ 8 × ${x / 12.5}.` : `Find 10% (or 1%) first and build up; x% of y also equals y% of x.` };
      }
      const fr = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [5, 8], [7, 8], [1, 10], [3, 10], [7, 10], [9, 10], [1, 16], [3, 16], [1, 20], [3, 20], [7, 20], [1, 25], [4, 25], [1, 40], [3, 40]];
      const [a, b] = r.pick(fr), p = QB.round((100 * a) / b, 4);
      if (t < 0.75) return { q: `${a}/${b} = ?%`, a: p, tip: `${a}/${b} = ${a} × (100/${b})% = ${p}%.` + (b === 8 ? " The eighths: 12.5, 37.5, 62.5, 87.5." : "") };
      if (t < 0.9) return { q: `${p}% = ?/${b}`, a, tip: `${p}% = ${p}/100 = ${a}/${b}.` };
      const base = r.pick([20, 25, 40, 50, 60, 80, 120, 150, 200, 250]), up = r.pick([10, 20, 25, 40, 50, 60, 75]);
      return { q: `${base} → ${QB.round(base * (1 + up / 100), 4)}: % rise`, a: up, tip: `Change ÷ original × 100 = ${QB.round((base * up) / 100, 4)} ÷ ${base} × 100.` };
    },
    tricks(r) {
      const t = r();
      if (t < 0.18) { const n = r.int(13, 999); return { q: `${n} × 5`, a: n * 5, tip: `×5 = ×10 then halve: ${n * 10} ÷ 2.` }; }
      if (t < 0.36) { const n = r.int(12, 96); return { q: `${n} × 25`, a: n * 25, tip: `×25 = ×100 then ÷4: ${n * 100} ÷ 4.` }; }
      if (t < 0.5) { const n = r.chance(0.6) ? 8 * r.int(1, 12) : r.int(4, 40); return { q: `${n} × 125`, a: n * 125, tip: `×125 = ×1000 then ÷8: ${n * 1000} ÷ 8.` }; }
      if (t < 0.72) { let n = r.int(88, 112); if (n === 100) n = 103; const d = n - 100; return { q: n + "²", a: n * n, tip: `(100 ${d < 0 ? "−" : "+"} ${Math.abs(d)})² = 10000 ${d < 0 ? "−" : "+"} ${200 * Math.abs(d)} + ${d * d}.` }; }
      if (t < 0.86) { const k = r.int(1, 11), n = k * 10 + 5; return { q: n + "²", a: n * n, tip: `Ends in 5: ${k} × ${k + 1} = ${k * (k + 1)}, then write 25.` }; }
      const n = r.int(12, 98); return { q: `${n} × 11`, a: n * 11, tip: "Two-digit × 11: write the digits apart and put their sum in the middle (carry if 10 or more)." };
    },
    tables(r) {
      const t = r();
      if (t < 0.55) {
        const a = r.int(11, 20), b = r.int(2, 12), tip = `Split it: 10 × ${b} + ${a - 10} × ${b} = ${10 * b} + ${(a - 10) * b}.`;
        return r.chance(0.5) ? { q: `${a} × ${b}`, a: a * b, tip } : { q: `${b} × ${a}`, a: a * b, tip };
      }
      if (t < 0.8) { const a = r.int(23, 89), b = r.int(17, 89); return { q: `${a} + ${b}`, a: a + b, tip: `Round and adjust: ${a} + ${Math.ceil(b / 10) * 10} − ${Math.ceil(b / 10) * 10 - b}.` }; }
      if (t < 0.92) { const a = r.int(105, 899), b = r.int(17, 99); return { q: `${a} + ${b}`, a: a + b, tip: "Add the tens first, then the units." }; }
      const a = r.int(12, 49), b = r.int(12, 49), c = r.int(12, 49); return { q: `${a} + ${b} + ${c}`, a: a + b + c, tip: "Pair numbers that make round tens first." };
    },
  };
  const SP = { mode: "mixed", phase: "pick", raf: 0, used: 0, since: 0, list: [], q: null, rng: null, seed: 0, score: 0, saved: null };
  function stopSpeed() {
    if (SP.raf) cancelAnimationFrame(SP.raf);
    SP.raf = 0;
    if (SP.phase === "run") SP.phase = "pick";
  }
  function speedView(mode) {
    view = "speed";
    const pick = SPEED_MODES.some((m) => m[0] === mode) ? mode : ls.get(SPK) || SP.mode;
    SP.mode = SPEED_MODES.some((m) => m[0] === pick) ? pick : "mixed";
    SP.phase = "pick";
    paintSpeed();
  }
  function speedRuns(n) {
    const sp = speedMeta();
    if (!sp.runs.length) return `<p class="muted small">No runs yet. Your last five show up here.</p>`;
    return `<div class="sp-runs">${sp.runs.slice(0, n || 5).map((r) => `<div class="sp-run-row"><span class="m">${esc(speedName(r.mode))}</span><span class="w muted small">${esc(typeof window.relDay === "function" ? relDay(r.at) : new Date(r.at).toLocaleDateString())}</span>
      <span class="s"><b>${r.score}</b><small> / ${r.n}</small></span><span class="a muted small">${r.n ? Math.round((r.score / r.n) * 100) : 0}%</span></div>`).join("")}</div>`;
  }
  function paintSpeed() {
    const sp = speedMeta();
    window.scrollTo(0, 0);
    if (SP.phase === "pick") {
      main.innerHTML = `<div class="pr-enter">
        <div class="pr-sbar"><a class="pr-back" href="#setup">${ic("back")} Practice</a><div class="pr-crumb"><b>Speed drill</b></div></div>
        <h1 class="pr-h1">Speed drill</h1>
        <p class="lead">${SPEED_SECS} seconds, as many as you can. Type the answer, press <kbd>Enter</kbd>, and the next one appears at once. No options to lean on, just quick sums.</p>
        <div class="sp-pick">
          <div class="pr-card"><h5>Choose a mode <small>keys 1–5</small></h5><div class="sp-modes">${SPEED_MODES.map(([id, name, sub], k) => `<button type="button" class="sp-mode${id === SP.mode ? " on" : ""}" data-act="sp-mode" data-v="${id}" aria-pressed="${id === SP.mode}">
              <kbd>${k + 1}</kbd><span class="nm">${esc(name)}</span><span class="sb">${esc(sub)}</span><span class="bs">${sp.best[id] ? `Best <b>${sp.best[id]}</b>` : "No best yet"}</span></button>`).join("")}</div>
            <div class="pr-actions"><span class="muted small">Decimals are fine (37.5). Commas and % signs are ignored.</span><span class="grow"></span><button class="btn primary sp-go" data-act="sp-start">Start ${esc(speedName(SP.mode))} <kbd>Enter</kbd></button></div></div>
          <div class="pr-card"><h5>Last 5 runs</h5>${speedRuns(5)}</div>
        </div></div>`;
      return;
    }
    if (SP.phase === "run") {
      main.innerHTML = `<div>
        <div class="pr-sbar"><button type="button" class="pr-back" data-act="sp-stop">${ic("back")} Stop <kbd>Esc</kbd></button><div class="pr-crumb"><b>Speed drill</b> <span class="sep">›</span> ${esc(speedName(SP.mode))}</div>
          <span class="grow"></span>${sp.best[SP.mode] ? `<span class="pr-chip mode">Best ${sp.best[SP.mode]}</span>` : ""}</div>
        <div class="pr-card sp-box">
          <div class="sp-bar" aria-hidden="true"><i id="spBar"></i></div>
          <div class="sp-top"><span class="sp-clock"><b id="spClock">${SPEED_SECS}</b> s left</span><span class="sp-score">Score <b id="spScore">0</b></span></div>
          <div class="sp-q" id="spQ" aria-live="polite"></div>
          <form class="sp-form" id="spForm" autocomplete="off"><input id="spIn" class="sp-in" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" aria-label="Your answer" placeholder="?">
            <button class="btn primary" type="submit">${ic("enter") || "Go"}<span class="sr">Submit</span></button></form>
          <div class="sp-fb" id="spFb">Type the answer and press Enter.</div>
        </div></div>`;
      const inp = document.getElementById("spIn");
      document.getElementById("spForm").addEventListener("submit", (e) => { e.preventDefault(); speedSubmit(); });
      inp.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.preventDefault(); speedStop(); } });
      showSpeedQ();
      inp.focus({ preventScroll: true });
      return;
    }
    // results
    const L = SP.list, n = L.length, ok = L.filter((x) => x.ok).length, misses = L.filter((x) => !x.ok);
    const best = sp.best[SP.mode] || 0, saved = SP.saved;
    const newBest = saved && saved.newBest;
    main.innerHTML = `<div class="pr-enter">
      <div class="pr-sbar"><button type="button" class="pr-back" data-act="sp-modes">${ic("back")} Modes</button><div class="pr-crumb"><b>Speed drill</b> <span class="sep">›</span> ${esc(speedName(SP.mode))}</div></div>
      <h1 class="pr-h1">${saved ? "Time!" : "Stopped early"}</h1>
      <div class="pr-card pr-hero${newBest ? " hot" : ""}">
        <div class="pr-score"><b>${ok}</b><span>correct</span><div class="muted small">${saved ? (newBest ? "New best for this mode." : best ? `Your best here is ${best}.` : "") : "Runs you stop early are not saved."}</div></div>
        <div class="pr-stats big">
          <div><b>${n ? Math.round((ok / n) * 100) + "%" : "-"}</b><span>accuracy</span></div>
          <div><b>${n}</b><span>answered</span></div>
          <div><b>${ok ? (SPEED_SECS / ok).toFixed(1) + " s" : "-"}</b><span>per correct answer</span></div>
          <div><b>${best || "-"}</b><span>best · ${esc(speedName(SP.mode))}</span></div>
        </div></div>
      <div class="sp-pick">
        <div class="pr-card"><h5>Misses <small>${misses.length ? "the right answer and the quick way" : ""}</small></h5>
          ${misses.length ? `<div class="sp-miss">${misses.map((x) => `<div class="sp-mrow"><span class="q">${esc(x.q)}</span><span class="y">you: <s>${esc(x.given)}</s></span><span class="r">${esc(QB.num(x.a))}</span><small>${esc(x.tip || "")}</small></div>`).join("")}</div>`
            : `<p class="muted">${n ? "No misses. Clean run." : "Nothing answered this time."}</p>`}</div>
        <div class="pr-card"><h5>Last 5 runs</h5>${speedRuns(5)}</div>
      </div>
      <div class="pr-actions pr-final"><button class="btn" data-act="sp-modes">Change mode</button><a class="btn" href="#setup">Back to practice</a><span class="grow"></span>
        <button class="btn primary" data-act="sp-start">Go again <kbd>Enter</kbd></button></div></div>`;
  }
  function speedStart() {
    SP.seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;
    SP.rng = QB.rng(SP.seed);
    SP.list = []; SP.score = 0; SP.used = 0; SP.since = performance.now(); SP.q = null; SP.saved = null; SP.lastClock = -1;
    SP.phase = "run";
    ls.set(SPK, SP.mode);
    paintSpeed();
    cancelAnimationFrame(SP.raf);
    SP.raf = requestAnimationFrame(speedFrame);
  }
  function speedNextQ() {
    const keys = ["squares", "percent", "tricks", "tables"];
    let q = null;
    for (let t = 0; t < 8; t++) {
      const m = SP.mode === "mixed" ? SP.rng.pick(keys) : SP.mode;
      q = SPGEN[m](SP.rng);
      if (!SP.q || q.q !== SP.q.q) break;
    }
    SP.q = q;
    SP.qAt = performance.now();
  }
  function showSpeedQ() {
    if (!SP.q) speedNextQ();
    const el = document.getElementById("spQ");
    if (el) el.textContent = SP.q.q;
  }
  const speedLeft = () => SPEED_SECS - (SP.used + (SP.since ? performance.now() - SP.since : 0)) / 1000;
  function speedFrame() {
    SP.raf = 0;
    if (view !== "speed" || SP.phase !== "run") return;
    const left = speedLeft();
    if (left <= 0) return speedEnd(true);
    const bar = document.getElementById("spBar"), clock = document.getElementById("spClock");
    if (bar) { bar.style.transform = `scaleX(${clamp(left / SPEED_SECS, 0, 1)})`; bar.classList.toggle("low", left < 10); }
    const c = Math.ceil(left);
    if (clock && c !== SP.lastClock) { clock.textContent = c; SP.lastClock = c; }
    SP.raf = requestAnimationFrame(speedFrame);
  }
  function parseAns(s) {
    s = String(s).replace(/[\s,%₹]/g, "").replace(/−/g, "-");
    if (!s) return null;
    const f = /^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/.exec(s);
    const v = f ? +f[1] / +f[2] : Number(s);
    return isFinite(v) ? v : NaN;
  }
  function speedSubmit() {
    if (SP.phase !== "run") return;
    const inp = document.getElementById("spIn"), fb = document.getElementById("spFb");
    const raw = inp.value.trim(), v = parseAns(raw);
    if (v === null) return;                                     // empty Enter does nothing
    const q = SP.q, ok = !isNaN(v) && Math.abs(v - q.a) < 1e-6;
    SP.list.push({ q: q.q, a: q.a, given: raw, ok, tip: q.tip, ms: Math.round(performance.now() - SP.qAt) });
    if (ok) SP.score++;
    document.getElementById("spScore").textContent = SP.score;
    fb.className = "sp-fb " + (ok ? "ok" : "bad");
    fb.innerHTML = ok ? `${ic("check")} ${esc(q.q)} = ${esc(QB.num(q.a))}` : `${ic("x")} ${esc(q.q)} = <b>${esc(QB.num(q.a))}</b>, not ${esc(raw)}`;
    inp.value = "";
    speedNextQ();
    showSpeedQ();
  }
  function speedStop() {
    if (SP.phase !== "run") return;
    speedEnd(false);
  }
  function speedEnd(timeUp) {
    if (SP.raf) cancelAnimationFrame(SP.raf);
    SP.raf = 0;
    SP.phase = "done";
    SP.saved = null;
    if (timeUp && Store) {
      const d = Store.load(), sp = speedMeta(), n = SP.list.length, score = SP.score;
      const was = sp.best[SP.mode] || 0, newBest = score > was && n > 0;
      if (newBest) sp.best[SP.mode] = score;
      if (n) sp.runs.unshift({ mode: SP.mode, score, n, at: Date.now(), seed: SP.seed });
      sp.runs = sp.runs.slice(0, 20);
      d.meta.speed = sp;
      if (n) Store.bump();                                      // one activity tick per run keeps the streak honest without flooding the goal
      Store.save();
      SP.saved = { newBest };
      if (newBest && was && typeof window.fxConfetti === "function") setTimeout(window.fxConfetti, 300);
    }
    paintSpeed();
  }
  document.addEventListener("visibilitychange", () => {
    if (view !== "speed" || SP.phase !== "run") return;
    if (document.visibilityState === "hidden") { if (SP.since) { SP.used += performance.now() - SP.since; SP.since = 0; } }
    else if (!SP.since) { SP.since = performance.now(); if (!SP.raf) SP.raf = requestAnimationFrame(speedFrame); }
  });
  function speedKey(e, k) {
    if (SP.phase === "run") {
      if (k === "Escape") { e.preventDefault(); return speedStop(); }
      if (/^[0-9.\-]$/.test(k)) { const inp = document.getElementById("spIn"); if (inp) inp.focus({ preventScroll: true }); }   // the key then lands in the box
      return;
    }
    if (SP.phase === "pick") {
      if ("12345".includes(k) && k.length === 1) { e.preventDefault(); SP.mode = SPEED_MODES[+k - 1][0]; ls.set(SPK, SP.mode); return paintSpeed(); }
      if (k === "Enter" && !(e.target && e.target.closest && e.target.closest("button,a"))) { e.preventDefault(); return speedStart(); }
      return;
    }
    if (k === "Enter" && !(e.target && e.target.closest && e.target.closest("a,button:not([data-act='sp-start'])"))) { e.preventDefault(); return speedStart(); }
    if (k === "Escape") { e.preventDefault(); SP.phase = "pick"; return paintSpeed(); }
  }

  /* ================================================================ events */
  main.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el || !main.contains(el)) return;
    const act = el.dataset.act;
    if (el.tagName === "A" && act !== "row" && act !== "drill" && act !== "newset") return;
    if (el.disabled) return;
    if (view === "speed") {
      if (act === "sp-mode") { SP.mode = el.dataset.v; ls.set(SPK, SP.mode); return paintSpeed(); }
      if (act === "sp-start") return speedStart();
      if (act === "sp-stop") return speedStop();
      if (act === "sp-modes") { SP.phase = "pick"; return paintSpeed(); }
      return;
    }
    if (view === "setup") {
      if (["sec", "topic", "pat", "pat-all", "diff", "set"].includes(act)) return setupChange(act, el.dataset.v, el);
      if (act === "start") return start();
      if (act === "resume") return go("run");
      if (act === "discard") { S = null; ss.del(SK); return setupView(); }
      if (act === "review-last") return go("review");
    }
    if (view === "run") {
      if (act === "opt") return answer(+el.dataset.i);
      if (act === "next") return next();
      if (act === "prev") return prev();
      if (act === "skip") return skip();
      if (act === "reveal") return reveal();
      if (act === "clear") { delete S.ans[S.idx]; persist(); return paint(false); }
      if (act === "sol") { S.showSol = !S.showSol; persist(); return paint(false); }
      if (act === "star") return toggleStar();
      if (act === "mark") return toggleMark();
      if (act === "why") return setReason(el.dataset.v);
      if (act === "book") return toggleBook();
      if (act === "go") return goTo(+el.dataset.i);
      if (act === "end") return endSession();
      if (act === "drill") {
        e.preventDefault();
        const href = el.getAttribute("href");
        return confirmBox({ title: "Leave this set?", text: "Your answers so far are saved to your progress. A pattern drill starts a fresh set.", ok: "Start the drill", cancel: "Stay here" }).then((y) => { if (y) { S = null; ss.del(SK); location.hash = href.replace(/^#/, ""); } });
      }
    }
    if (view === "review") {
      if (act === "retry") return retryWrong();
      if (act === "mistakes") return addMistakes(el);
      if (act === "row") { e.preventDefault(); const d = document.getElementById("prRow" + el.dataset.i); if (d) { d.open = true; d.scrollIntoView({ block: "center", behavior: "smooth" }); } return; }
      if (act === "newset") { e.preventDefault(); S = S && S.done ? S : S; return go("", true); }
    }
  });
  main.addEventListener("click", (e) => { const r = e.target.closest("[data-reset]"); if (r) { S = null; ss.del(SK); } });

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target;
    if (t && t.closest && (t.closest("input,textarea,select,[contenteditable='true'],.rw-drawer,.psel-menu") || t.isContentEditable)) return;
    if (modalOpen()) {
      if (e.key === "Escape") { e.preventDefault(); closeModal(false); }
      else if (e.key === "Enter") { /* the focused button decides */ }
      return;
    }
    if (view === "speed") return speedKey(e, e.key);
    if (view === "setup") {
      if (e.key === "Enter" && !(t && t.closest && t.closest("button,a"))) { const go_ = main.querySelector('[data-act="start"]'); if (go_ && !go_.disabled) { e.preventDefault(); start(); } }
      return;
    }
    if (view !== "run" || !S) return;
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if ("1234".includes(k) && k.length === 1) { e.preventDefault(); return answer(+k - 1); }
    if ("abcd".includes(k) && k.length === 1) { e.preventDefault(); return answer("abcd".indexOf(k)); }
    if (k === "Enter") { e.preventDefault(); return next(); }
    if (k === "s") { e.preventDefault(); const a = S.ans[S.idx]; if (a && (a.c != null || a.rev)) { S.showSol = !S.showSol; persist(); paint(false); } else reveal(); return; }
    if (k === "m") { e.preventDefault(); return toggleMark(); }
    if (k === "f") { e.preventDefault(); return toggleStar(); }
    if (k === "ArrowLeft") { e.preventDefault(); return step(-1); }
    if (k === "ArrowRight") { e.preventDefault(); return step(1); }
  });

  window.addEventListener("hashchange", safeRoute);
  safeRoute();
})();
