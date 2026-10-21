/* =====================================================================
   revision.js : the Revision page (revision.html). Owner: REVISION.
   Tabs (hash routes):
     #due (default)        questions (q:/g: items) and learn topics (<sec>:<topic>) whose spaced-repetition date has come
     #mistakes[/reason]    mistake book: status "revise" or last answer wrong; grouped by pattern or by why-missed reason
     #bookmarks            starred questions and starred lessons
     #cards[/vocab]        flashcards: formula deck (window.FORMULAS) and vocabulary deck (window.VOCAB)
   Flashcard progress lives in Store meta.fc = { "<cardKey>": { level, next, seen (last review time), n (reviews) } },
   card keys f:<topic>:<index> and v:<word>. Kept out of Store.items so cards never inflate the header's due badge.
   Practice links use practice.html#qs/<id>,<id>,… (ids encodeURIComponent-ed).
   Style: classes from style.css / practice.css plus the rv-* rules injected below as <style id="revStyle">.
   ===================================================================== */
(function () {
  "use strict";
  const DAYMS = 86400000, INTERVALS = [1, 3, 7, 14, 30, 60], NEW_PER = 20;
  const SECS = ["quant", "reasoning", "verbal", "di"];
  const SEC_NAME = { quant: "Quant", reasoning: "Reasoning", verbal: "Verbal", di: "DI", strategy: "Strategy" };
  const SEC_C = { quant: "var(--c-quant)", reasoning: "var(--c-reason)", verbal: "var(--c-verbal)", di: "var(--c-di)", strategy: "var(--page-c, var(--accent))" };
  const SEC_PAGE = { quant: "quant.html", reasoning: "reasoning.html", verbal: "verbal.html", di: "di.html", strategy: "strategy.html" };
  const LEARN_KEY = /^(quant|reasoning|verbal|di|strategy):([a-z0-9][a-z0-9-]*)$/;
  const REASONS = [
    ["concept", "Concept", "Did not know the method", "var(--f-lilac, var(--purple))"],
    ["calc", "Calculation", "Right method, slip in the arithmetic", "var(--f-yellow, var(--amber))"],
    ["misread", "Misread", "Misread the question or an option", "var(--f-blue, var(--accent))"],
    ["time", "Time", "Rushed or ran out of time", "var(--f-orange, var(--red))"],
    ["guess", "Guessed", "Picked without working it out", "var(--f-green, var(--green))"],
    ["untagged", "Untagged", "No reason tagged yet. Open a question and tag why you missed it.", "var(--muted)"],
  ];
  const RMAP = Object.fromEntries(REASONS.map((r) => [r[0], r]));
  const LET = "ABCD";
  const GRADES = [null, ["Again", "g1"], ["Hard", "g2"], ["Good", "g3"], ["Easy", "g4"]];

  const LOCAL_ICONS = {
    chevron: '<path d="m6 9 6 6 6-6"/>',
    bolt: '<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',
    warn: '<path d="M12 3.5 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.2h.01"/>',
    book: '<path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0 0 4h13"/>',
    cards: '<rect x="3.5" y="7" width="13" height="13.5" rx="2.2"/><path d="M8 7V5.5a2 2 0 0 1 2-2h8.5a2 2 0 0 1 2 2V15a2 2 0 0 1-2 2h-2"/>',
    mistake: '<path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0 0 4h13"/><path d="m9.5 8 5 5M14.5 8l-5 5"/>',
    flip: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/>',
    open: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V7.5A1.5 1.5 0 0 1 5.5 6H10"/>',
  };
  const ic = (name, cls) => {
    const s = typeof window.icon === "function" ? window.icon(name, cls || "") : "";
    return s || (LOCAL_ICONS[name] ? `<svg class="ico${cls ? " " + cls : ""}" viewBox="0 0 24 24" aria-hidden="true">${LOCAL_ICONS[name]}</svg>` : "");
  };
  const E = (s) => (typeof window.esc === "function" ? window.esc(s == null ? "" : s) : String(s == null ? "" : s));
  const F = (s) => (typeof window.fmt === "function" ? window.fmt(s) : E(s));
  const body = (t) => F(t).replace(/\n/g, "<br>");
  const line = (t) => F(String(t || "").replace(/\s*\n\s*/g, " "));
  const titleCase = (id) => { const s = String(id || "").replace(/-/g, " "); return s.charAt(0).toUpperCase() + s.slice(1); };
  const plural = (n, w, p) => n + " " + (n === 1 ? w : p || w + "s");
  const stampEl = (el) => { if (el && window.stamp) window.stamp(el); };
  const ss = {
    get(k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  const dayIdx = (t) => Math.round((new Date(today(t)) - new Date(today())) / DAYMS);
  const ago = (t) => { if (!t) return ""; const d = -dayIdx(t); return d <= 0 ? "today" : d === 1 ? "yesterday" : d + " days ago"; };

  /* ---------------------------------------------------------------- catalog lookups */
  let CM = null;
  function cmap() {
    if (CM) return CM;
    CM = { topic: {}, pat: {}, order: {} };
    const cat = window.CATALOG || (window.PROGRESS && PROGRESS.catalog) || [];
    let o = 0;
    cat.forEach((c) => (c.topics || []).forEach((t) => {
      CM.topic[c.sec + "/" + t.id] = t.title; CM.order[c.sec + "/" + t.id] = o++;
      (t.patterns || []).forEach((p) => (CM.pat[c.sec + "/" + t.id + "/" + p.id] = p.title));
    }));
    return CM;
  }
  const topicT = (sec, t) => cmap().topic[sec + "/" + t] || titleCase(t);
  const patT = (q) => {
    const k = q.sec + "/" + q.topic + "/" + q.pattern;
    return cmap().pat[k] || (window.QB && QB.gens && QB.gens[k] && QB.gens[k].title) || titleCase(q.pattern);
  };
  const ordOf = (sec, t) => { const v = cmap().order[sec + "/" + t]; return v == null ? 9999 : v; };
  const secChip = (sec) => `<span class="pr-chip sec" style="--sc:${SEC_C[sec] || "var(--accent)"}">${E(SEC_NAME[sec] || titleCase(sec))}</span>`;
  const dChip = (d) => d ? `<span class="pr-chip ${d === "Easy" ? "easy" : d === "Hard" ? "hard" : "med"}">${E(d)}</span>` : "";

  /* ---------------------------------------------------------------- questions */
  const QC = new Map();
  function qOf(k) {
    if (QC.has(k)) return QC.get(k);
    let q = null;
    try { q = k.slice(0, 2) === "q:" ? (QB.byId || {})[k.slice(2)] : (typeof QB.fromId === "function" ? QB.fromId(k) : null); } catch (e) { q = null; }
    q = q && Array.isArray(q.opts) ? q : null;
    QC.set(k, q);
    return q;
  }
  const qid = (k) => (k.slice(0, 2) === "q:" ? k.slice(2) : k);
  const qsHref = (keys) => "practice.html#qs/" + keys.map((k) => encodeURIComponent(qid(k))).join(",");
  const isMistake = (r) => r.it.status === "revise" || (r.it.last === 0 && !r.it.fixed);

  function model() {
    const d = Store.load(), qs = [], learn = [];
    Object.keys(d.items).forEach((k) => {
      const it = d.items[k] || {};
      if (/^[qg]:/.test(k)) { const q = qOf(k); if (q) qs.push({ k, it, q }); return; }
      const m = LEARN_KEY.exec(k);
      if (m && (it.status || it.star)) learn.push({ k, it, sec: m[1], id: m[2] });
    });
    const M = { qs, learn };
    M.due = qs.filter((r) => Store.isDue(r.it));
    M.dueL = learn.filter((r) => Store.isDue(r.it));
    M.mist = qs.filter(isMistake);
    M.starQ = qs.filter((r) => r.it.star);
    M.starL = learn.filter((r) => r.it.star);
    M.cardsDue = cardCounts(deckCards("formulas")).due + cardCounts(deckCards("vocab")).due;
    return M;
  }

  // the answer you picked last time, when something stored it (practice may save it as `ch`; mocks keep `chosen`)
  function lastPick(r) {
    const it = r.it;
    for (const f of ["ch", "chosen", "pick"]) if (Number.isInteger(it[f]) && it[f] >= 0 && it[f] < r.q.opts.length) return it[f];
    const mocks = Store.load().mocks || [];
    for (let i = mocks.length - 1; i >= 0; i--) {
      const a = (mocks[i].answers || []).find((x) => x && x.qid === r.q.id);
      if (a) return a.chosen != null && !!a.ok === (it.last === 1) ? a.chosen : null;
    }
    return null;
  }

  /* ---------------------------------------------------------------- flashcards */
  const DECKS = {};
  function deckCards(deck) {
    if (deck === "vocab") {
      if (!DECKS.v || DECKS.vSrc !== window.VOCAB) {
        const seen = new Set(), src = Array.isArray(window.VOCAB) ? window.VOCAB : [];
        DECKS.vSrc = window.VOCAB;
        DECKS.v = src.filter((v) => v && v.w && !seen.has(String(v.w).toLowerCase()) && seen.add(String(v.w).toLowerCase()))
          .map((v) => ({ key: "v:" + v.w, kind: "v", w: v.w, pos: v.pos || "", m: v.m || "", ex: v.ex || "", syn: v.syn || [], ant: v.ant || [] }));
      }
      return DECKS.v;
    }
    if (!DECKS.f) {
      DECKS.f = [];
      (window.FORMULAS || []).forEach((f) => (f.items || []).forEach((it, i) => {
        if (!it || !it[0] || !it[1]) return;
        DECKS.f.push({ key: "f:" + f.topic + ":" + i, kind: "f", sec: f.sec, topic: f.topic, ttl: f.title || topicT(f.sec, f.topic),
          front: String(it[0]).replace(/^\d+\.\s+/, ""), back: it[1], note: it[2] || "" });
      }));
    }
    return DECKS.f;
  }
  function fcStore() { const m = Store.load().meta; if (!m.fc || typeof m.fc !== "object") m.fc = {}; return m.fc; }
  const isCardDue = (s) => s && s.next && s.next <= Date.now() + 60000;
  function cardCounts(list) {
    const fc = Store.load().meta.fc || {}; let due = 0, nw = 0, learned = 0;
    list.forEach((c) => { const s = fc[c.key]; if (!s) nw++; else if (isCardDue(s)) due++; else learned++; });
    return { due, nw, learned, total: list.length };
  }
  // the level a grade gives: new cards start below level 0
  function gradeLevel(c, g, lapsed) {
    const s = (Store.load().meta.fc || {})[c.key], base = s ? s.level || 0 : -1;
    if (g === 1) return 0;
    if (g === 2) return Math.max(0, base - 1);
    if (g === 3) return lapsed ? 0 : Math.min(INTERVALS.length - 1, base + 1);
    return Math.min(INTERVALS.length - 1, lapsed ? 1 : base + 2);
  }
  const ivl = (lvl) => { const d = INTERVALS[lvl]; return d < 30 ? d + "d" : Math.round(d / 30) + "mo"; };

  /* ---------------------------------------------------------------- state */
  let main, view = "due", group = "pattern", secF = ss.get("apt:rev:sec") || "", deck = "formulas";
  let cf = ss.get("apt:rev:cf") || { sec: "", topic: "" };
  let sess = null;
  const openRows = new Set();

  function parseHash() {
    const h = (location.hash || "").replace(/^#/, "").split("/");
    view = ["due", "mistakes", "bookmarks", "cards"].includes(h[0]) ? h[0] : "due";
    if (view === "mistakes") group = h[1] === "reason" ? "reason" : "pattern";
    if (view === "cards") deck = h[1] === "vocab" ? "vocab" : h[1] === "formulas" ? "formulas" : deck;
  }

  /* ---------------------------------------------------------------- shared pieces */
  function tabsHTML(M) {
    const n = { due: M.due.length + M.dueL.length, mistakes: M.mist.length, bookmarks: M.starQ.length + M.starL.length, cards: M.cardsDue };
    const T = [["due", "Due", "calendar"], ["mistakes", "Mistakes", "mistake"], ["bookmarks", "Bookmarks", "star"], ["cards", "Flashcards", "cards"]];
    return `<nav class="rv-tabs" role="tablist" aria-label="Revision sections">${T.map(([id, l, i]) =>
      `<a href="#${id}${id === "mistakes" && group === "reason" ? "/reason" : id === "cards" ? "/" + deck : ""}" role="tab" aria-selected="${view === id}" class="${view === id ? "on" : ""}" data-tab="${id}">${ic(i)}<span>${l}</span><b class="n${n[id] ? "" : " z"}">${n[id]}</b></a>`).join("")}</nav>`;
  }
  function empty(ico, title, text, extra) {
    return `<div class="pr-card rv-empty"><div class="rv-empty-i">${ic(ico)}</div><h3>${title}</h3><p class="muted">${text}</p>${extra || ""}</div>`;
  }
  function whenHTML(r, mode) {
    const it = r.it;
    if (mode === "due") {
      const d = -dayIdx(it.next);
      return `<span class="rv-when${d > 0 ? " late" : ""}">${d > 0 ? "overdue " + plural(d, "day") : "due today"}</span>`;
    }
    const why = it.why && RMAP[it.why] ? `<span class="rv-why" style="--rc:${RMAP[it.why][3]}">${RMAP[it.why][1]}</span>` : "";
    return `${why}<span class="rv-when">${E(ago(it.updated))}</span>`;
  }
  function qRow(r, mode) {
    const it = r.it, q = r.q;
    const st = it.last === 1 ? `<span class="pr-si ok" title="Last attempt right">${ic("check")}</span>` : it.last === 0 ? `<span class="pr-si bad" title="Last attempt wrong">${ic("x")}</span>` : `<span class="pr-si" title="Not tried yet">${ic("circle")}</span>`;
    const tries = it.n ? `${it.c || 0}/${it.n} right` : "not tried";
    return `<details class="pr-qrow rv-row" data-k="${E(r.k)}"${openRows.has(r.k) ? " open" : ""}>
      <summary>${st}<span class="rv-sm"><span class="t">${line(q.q)}</span><span class="rv-meta"><span>${E(patT(q))}</span><i>·</i><span>${tries}</span>${it.star ? `<span class="rv-st" title="Starred">${ic("star-fill")}</span>` : ""}</span></span>
      <span class="rv-right">${whenHTML(r, mode)}</span>${ic("chevron", "chev")}</summary>
      <div class="pr-qbody">${openRows.has(r.k) ? qBody(r, mode) : ""}</div></details>`;
  }
  function qBody(r, mode) {
    const q = r.q, it = r.it, pick = it.last === 0 ? lastPick(r) : null;
    const stim = q.set && window.QB && QB.sets && QB.sets[q.set]
      ? `<details class="rv-stim"><summary>${ic("doc")} Show the ${QB.sets[q.set].kind === "chart" ? "chart / data" : QB.sets[q.set].kind === "passage" ? "passage" : "shared data"}</summary><div class="rv-stim-b">${QB.setHTML(q.set)}</div></details>` : "";
    const opts = q.opts.map((o, j) => {
      const ok = j === q.ans, bad = pick === j && !ok;
      return `<div class="pr-ro${ok ? " ok" : bad ? " bad" : ""}"><span class="k">${LET[j]}</span><span>${F(o)}</span>${ok ? "<em>correct</em>" : bad ? "<em>your answer</em>" : ""}${q.why && q.why[j] && !ok && (bad || pick == null) ? `<small>${F(q.why[j])}</small>` : ""}</div>`;
    }).join("");
    const sol = (q.sol && q.sol.length ? `<h4>${ic("check-circle")} Solution</h4><ol>${q.sol.map((s) => `<li>${F(s)}</li>`).join("")}</ol>` : "") +
      (q.short || q.trap ? `<div class="pr-boxes${q.short && q.trap ? "" : " one"}">${q.short ? `<div class="pr-box tip"><div class="lb">${ic("bolt")} Shortcut</div>${F(q.short)}</div>` : ""}${q.trap ? `<div class="pr-box trap"><div class="lb">${ic("warn")} Trap</div>${F(q.trap)}</div>` : ""}</div>` : "");
    const facts = [dChip(q.d), it.n ? `tried ${plural(it.n, "time")}` : "", it.t != null ? `last time ${Math.round(it.t)}s${q.time ? " / target " + q.time + "s" : ""}` : "",
      it.status && it.next ? (Store.isDue(it) ? "review due now" : "next review " + relDay(it.next)) : ""].filter(Boolean).join('<i>·</i>');
    const wrong = isMistake(r) || it.last === 0;
    const reasons = wrong ? `<div class="pr-reasons rv-reasons">Why missed?${REASONS.slice(0, 5).map(([v, l]) => `<button type="button" class="${it.why === v ? "on" : ""}" data-act="why" data-k="${E(r.k)}" data-v="${v}" aria-pressed="${it.why === v}">${l}</button>`).join("")}</div>` : "";
    return `<div class="rv-facts">${secChip(q.sec)}<span>${E(topicT(q.sec, q.topic))}</span><i>·</i>${facts}</div>
      ${stim}<div class="rv-qtext">${body(q.q)}</div>
      <div class="pr-ro-list">${opts}</div>
      ${pick == null && it.last === 0 ? '<div class="rv-note">Your earlier pick was not saved for this one; the correct option is marked.</div>' : ""}
      <div class="pr-sol">${sol || '<span class="muted">No written solution for this one.</span>'}</div>
      <div class="rv-acts">
        ${isMistake(r) ? `<button type="button" class="btn sm on-green" data-act="fix" data-k="${E(r.k)}">${ic("check")} Mark as fixed</button>` : ""}
        <a class="btn sm" href="${qsHref([r.k])}">${ic("play")} Practise this one</a>
        <button type="button" class="btn sm" data-act="star" data-k="${E(r.k)}" aria-pressed="${!!it.star}">${swapLabel([ic("star") + " Star", ic("star-fill", "ico-amber") + " Starred"], it.star ? 1 : 0)}</button>
        ${reasons}
      </div>`;
  }
  function groupCard(head, rows, mode, keys, sub) {
    return `<section class="pr-card rv-grp"><header class="rv-gh"><div class="rv-ght"><div class="rv-ghr">${head}</div>${sub ? `<div class="rv-sub">${sub}</div>` : ""}</div>
      ${keys.length ? `<a class="btn sm" href="${qsHref(keys)}">${ic("play")} Practise ${keys.length > 1 ? "these " + keys.length : "this"}</a>` : ""}</header>
      <div class="pr-qlist">${rows.map((r) => qRow(r, mode)).join("")}</div></section>`;
  }
  function byTopic(rows, sortFn) {
    const g = {};
    rows.forEach((r) => { const k = r.q.sec + "/" + r.q.topic; (g[k] = g[k] || []).push(r); });
    return Object.keys(g).sort((a, b) => { const [s1, t1] = a.split("/"), [s2, t2] = b.split("/"); return ordOf(s1, t1) - ordOf(s2, t2); })
      .map((k) => { const [sec, topic] = k.split("/"); return { sec, topic, rows: g[k].sort(sortFn) }; });
  }
  const topicHead = (sec, topic, n) => `${secChip(sec)}<h3>${E(topicT(sec, topic))}</h3><span class="rv-cnt">${n}</span>`;
  function learnRow(r, mode) {
    const it = r.it, lv = it.level || 0, href = SEC_PAGE[r.sec] + "#" + r.id;
    const dots = `<span class="rv-lv" title="Memory strength ${lv} of 5">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= lv ? "on" : ""}"></i>`).join("")}</span>`;
    const side = mode === "due"
      ? `<button type="button" class="btn sm on-green" data-act="rev" data-k="${E(r.k)}" data-ok="1" title="Remembered: the next review moves further out">${ic("check")} Remembered</button><button type="button" class="btn sm on-red" data-act="rev" data-k="${E(r.k)}" data-ok="0" title="Forgot: it comes back tomorrow">${ic("x")} Forgot</button>`
      : `<button type="button" class="pr-icon on" data-act="star" data-k="${E(r.k)}" title="Remove bookmark" aria-label="Remove bookmark">${ic("star-fill")}</button>`;
    return `<div class="rv-lrow">${secChip(r.sec)}<div class="rv-lt"><a href="${href}">${E(topicT(r.sec, r.id))}</a>
      <span class="rv-meta">${it.status ? dots + `<span>${it.lastReview ? "reviewed " + ago(it.lastReview) : it.doneAt ? "learned " + ago(it.doneAt) : ""}</span>` : "<span>not marked learned</span>"}</span></div>
      <a class="btn sm rv-open" href="${href}" title="Open the lesson">${ic("open")}<span>Lesson</span></a>${side}</div>`;
  }

  /* ---------------------------------------------------------------- #due */
  function viewDue(M) {
    const nQ = M.due.length, nL = M.dueL.length;
    if (!nQ && !nL) return `<div class="rv-grid"><div>${empty("party", "All caught up", "Nothing is due right now. Wrong answers and lessons you mark as learned come back here on a 1, 3, 7, 14, 30, 60-day schedule.",
      `<div class="btn-row rv-ec"><a class="btn primary" href="practice.html#daily">${ic("play")} Today's daily set</a>${M.mist.length ? `<a class="btn" href="#mistakes">${ic("mistake")} Mistake book (${M.mist.length})</a>` : ""}${M.cardsDue ? `<a class="btn" href="#cards/${deck}">${ic("cards")} ${M.cardsDue} flashcards due</a>` : ""}</div>`)}</div>${rail(M)}</div>`;
    const groups = byTopic(M.due, (a, b) => (a.it.next || 0) - (b.it.next || 0));
    const hero = `<div class="pr-card is-hero rv-hero"><div class="rv-big"><b>${nQ + nL}</b><span>due</span></div>
      <div class="rv-hero-t"><b>${nQ ? plural(nQ, "question") : ""}${nQ && nL ? " and " : ""}${nL ? plural(nL, "lesson") : ""}</b> ready for review.
      <div class="muted small">Re-solve each one from memory before you peek at the solution.</div></div><span class="grow"></span>
      ${nQ ? `<a class="btn primary" href="${qsHref(M.due.map((r) => r.k))}">${ic("play")} Practise all due</a>` : ""}</div>`;
    const learn = nL ? `<section class="pr-card rv-grp"><header class="rv-gh"><div class="rv-ghr"><h3>${ic("book")} Lessons to recall</h3><span class="rv-cnt">${nL}</span></div></header>
      <p class="muted small rv-hint">Recall the idea, the formulas and one trap without opening the page. Then be honest.</p>
      <div class="rv-llist">${M.dueL.sort((a, b) => (a.it.next || 0) - (b.it.next || 0)).map((r) => learnRow(r, "due")).join("")}</div></section>` : "";
    return `<div class="rv-grid"><div class="rv-main">${hero}${groups.map((g) => groupCard(topicHead(g.sec, g.topic, g.rows.length), g.rows, "due", g.rows.map((r) => r.k))).join("")}${learn}</div>${rail(M)}</div>`;
  }
  function rail(M) {
    const now = Date.now(), days = {}, F_ = Store.load().meta.fc || {};
    const add = (t, kind) => { if (!t || t <= now + 60000) return; const d = dayIdx(t); if (d >= 1 && d <= 7) { days[d] = days[d] || { q: 0, c: 0 }; days[d][kind]++; } };
    M.qs.concat(M.learn).forEach((r) => r.it.status && add(r.it.next, "q"));
    Object.values(F_).forEach((s) => s && add(s.next, "c"));
    const max = Math.max(1, ...Object.values(days).map((x) => x.q + x.c));
    const up = [1, 2, 3, 4, 5, 6, 7].map((d) => {
      const x = days[d] || { q: 0, c: 0 }, t = new Date(Date.now() + d * DAYMS);
      const lbl = d === 1 ? "Tomorrow" : t.toLocaleDateString(undefined, { weekday: "short", day: "numeric" });
      return `<li><span class="d">${lbl}</span><span class="rv-ub"><i class="q" style="width:${(x.q / max) * 100}%"></i><i class="c" style="width:${(x.c / max) * 100}%"></i></span><span class="v">${x.q + x.c || "-"}</span></li>`;
    }).join("");
    return `<aside class="rv-rail">
      <div class="pr-card"><h5>Coming up <small>next 7 days</small></h5><ul class="rv-up">${up}</ul>
        <div class="pr-legend"><span><i style="background:var(--page-c, var(--accent))"></i>Questions + lessons</span><span><i style="background:var(--purple)"></i>Flashcards</span></div></div>
      <div class="pr-card"><h5>How reviews work</h5><p class="small muted rv-p">A wrong answer lands here the same day. Get it right and it returns after 1, 3, 7, 14, 30, then 60 days. Miss it and it starts again at 1 day.</p>
        <div class="rv-links"><a href="#mistakes">${ic("mistake")} Mistake book <b>${M.mist.length}</b></a><a href="#bookmarks">${ic("star")} Bookmarks <b>${M.starQ.length + M.starL.length}</b></a><a href="#cards/${deck}">${ic("cards")} Flashcards due <b>${M.cardsDue}</b></a></div></div>
    </aside>`;
  }

  /* ---------------------------------------------------------------- #mistakes */
  function viewMistakes(M) {
    const all = M.mist, bySec = {};
    all.forEach((r) => (bySec[r.q.sec] = (bySec[r.q.sec] || 0) + 1));
    if (secF && !bySec[secF]) secF = "";
    const list = all.filter((r) => !secF || r.q.sec === secF);
    const tools = `<div class="rv-tools">
      <div class="pr-segc" role="group" aria-label="Group by"><span class="rv-lbl">Group by</span><button type="button" class="${group === "pattern" ? "on" : ""}" data-act="group" data-v="pattern" aria-pressed="${group === "pattern"}">Pattern</button><button type="button" class="${group === "reason" ? "on" : ""}" data-act="group" data-v="reason" aria-pressed="${group === "reason"}">Reason</button></div>
      <div class="pr-picks" role="group" aria-label="Section"><button type="button" class="pr-pick${secF ? "" : " on"}" data-act="sec" data-v="">All <small>${all.length}</small></button>${SECS.filter((s) => bySec[s]).map((s) =>
        `<button type="button" class="pr-pick sec${secF === s ? " on" : ""}" style="--sc:${SEC_C[s]}" data-act="sec" data-v="${s}"><i></i>${SEC_NAME[s]} <small>${bySec[s]}</small></button>`).join("")}</div></div>`;
    if (!all.length) return `<div class="rv-grid"><div>${empty("trophy", "No open mistakes", "Every question you get wrong is saved here with its solution, grouped by pattern, so you can fix the idea and not just the one question.",
      `<div class="btn-row rv-ec"><a class="btn primary" href="practice.html#daily">${ic("play")} Practise now</a></div>`)}</div>${mixRail(all)}</div>`;
    let groups;
    const recent = (a, b) => (b.it.updated || 0) - (a.it.updated || 0);
    if (group === "reason") {
      const g = {};
      list.forEach((r) => { const w = r.it.why && RMAP[r.it.why] ? r.it.why : "untagged"; (g[w] = g[w] || []).push(r); });
      groups = REASONS.filter(([id]) => g[id]).map(([id, l, d, c]) => ({ head: `<span class="rv-rdot" style="--rc:${c}"></span><h3>${l}</h3><span class="rv-cnt">${g[id].length}</span>`, sub: d, rows: g[id].sort(recent) }));
    } else {
      const g = {};
      list.forEach((r) => { const k = r.q.sec + "/" + r.q.topic + "/" + r.q.pattern; (g[k] = g[k] || []).push(r); });
      groups = Object.keys(g).sort((a, b) => g[b].length - g[a].length || ordOf(...a.split("/")) - ordOf(...b.split("/"))).map((k) => {
        const q = g[k][0].q;
        return { head: `${secChip(q.sec)}<h3>${E(patT(q))}</h3><span class="rv-cnt">${g[k].length}</span>`, sub: E(topicT(q.sec, q.topic)), rows: g[k].sort(recent) };
      });
    }
    return `<div class="rv-grid"><div class="rv-main">${tools}${groups.map((g) => groupCard(g.head, g.rows, "mistakes", g.rows.map((r) => r.k), g.sub)).join("")}</div>${mixRail(all)}</div>`;
  }
  function mixRail(all) {
    const n = all.length, g = {};
    all.forEach((r) => { const w = r.it.why && RMAP[r.it.why] ? r.it.why : "untagged"; g[w] = (g[w] || 0) + 1; });
    const tagged = n - (g.untagged || 0), top = REASONS.slice(0, 5).filter(([id]) => g[id]).sort((a, b) => g[b[0]] - g[a[0]])[0];
    const pats = {};
    all.forEach((r) => { const k = r.q.sec + "/" + r.q.topic + "/" + r.q.pattern; pats[k] = pats[k] || { q: r.q, n: 0 }; pats[k].n++; });
    const worst = Object.keys(pats).sort((a, b) => pats[b].n - pats[a].n).slice(0, 4);
    const TIPS = { concept: "Most misses are method gaps: reread the lesson's pattern card before drilling.", calc: "Most misses are arithmetic slips: write one more line of working and check units.",
      misread: "Most misses are misreads: underline what is asked before you look at the options.", time: "Most misses come from rushing: skip early and come back instead of forcing it.", guess: "Lots of guesses: a quick drill on those patterns will pay off fast." };
    return `<aside class="rv-rail">
      <div class="pr-card"><h5>Why you miss <small>${n ? `${tagged} of ${n} tagged` : "no mistakes yet"}</small></h5>
        <div class="rv-mix">${n ? REASONS.filter(([id]) => g[id]).map(([id, l, , c]) => `<i style="width:${(g[id] / n) * 100}%;background:${c}" title="${l}: ${g[id]}"></i>`).join("") : ""}</div>
        <ul class="rv-rl">${REASONS.map(([id, l, , c]) => `<li><span class="rv-rdot" style="--rc:${c}"></span>${l}<span class="grow"></span><b>${g[id] || 0}</b></li>`).join("")}</ul>
        ${top ? `<p class="small rv-p">${TIPS[top[0]]}</p>` : n ? '<p class="small muted rv-p">Tag a reason under each mistake (concept, calculation, misread, time, guess) to see your habits here.</p>' : ""}
        ${n && group !== "reason" ? `<a class="pr-link rv-l0" href="#mistakes/reason">Group by reason</a>` : ""}</div>
      ${worst.length ? `<div class="pr-card"><h5>Most-missed patterns</h5><ul class="rv-wl">${worst.map((k) => `<li><span>${E(patT(pats[k].q))}<small>${E(topicT(pats[k].q.sec, pats[k].q.topic))}</small></span><b>${pats[k].n}</b></li>`).join("")}</ul>
        <a class="btn sm rv-wbtn" href="practice.html#drill/${E(worst[0])}">${ic("target")} Drill the top one</a></div>` : ""}
    </aside>`;
  }

  /* ---------------------------------------------------------------- #bookmarks */
  function viewBookmarks(M) {
    const q = M.starQ, l = M.starL;
    if (!q.length && !l.length) return `<div class="rv-grid"><div>${empty("star", "No bookmarks yet", "Star a question in practice (the star next to the question) or a lesson (the star in its action bar) and it shows up here for a quick look before an exam.",
      `<div class="btn-row rv-ec"><a class="btn primary" href="practice.html">${ic("play")} Go to practice</a></div>`)}</div>${starRail(M)}</div>`;
    const groups = byTopic(q, (a, b) => (b.it.updated || 0) - (a.it.updated || 0));
    const hero = q.length ? `<div class="pr-card is-hero rv-hero"><div class="rv-big"><b>${q.length}</b><span>starred</span></div><div class="rv-hero-t"><b>${plural(q.length, "question")}</b> you wanted to keep.<div class="muted small">Open one for its solution, or run them all as a set.</div></div><span class="grow"></span>
      <a class="btn primary" href="${qsHref(q.map((r) => r.k))}">${ic("play")} Practise all</a></div>` : "";
    return `<div class="rv-grid"><div class="rv-main">${hero}${groups.map((g) => groupCard(topicHead(g.sec, g.topic, g.rows.length), g.rows, "star", g.rows.length > 1 ? g.rows.map((r) => r.k) : [])).join("")}
      ${!q.length ? empty("star", "No starred questions", "Starred lessons are on the right. Star questions in practice to collect them here.") : ""}</div>${starRail(M)}</div>`;
  }
  function starRail(M) {
    const l = M.starL.slice().sort((a, b) => ordOf(a.sec, a.id) - ordOf(b.sec, b.id));
    return `<aside class="rv-rail"><div class="pr-card"><h5>Starred lessons <small>${l.length}</small></h5>
      ${l.length ? `<div class="rv-llist sm">${l.map((r) => learnRow(r, "star")).join("")}</div>` : '<p class="small muted rv-p">Star a lesson from its action bar to pin it here.</p>'}</div></aside>`;
  }

  /* ---------------------------------------------------------------- #cards */
  function cardList() {
    const all = deckCards(deck);
    if (deck !== "formulas") return all;
    return all.filter((c) => (!cf.sec || c.sec === cf.sec) && (!cf.topic || c.topic === cf.topic));
  }
  const sig = () => deck + "|" + (deck === "formulas" ? cf.sec + "|" + cf.topic : "");
  function newSession(ahead) {
    const list = cardList(), fc = Store.load().meta.fc || {};
    const due = list.filter((c) => isCardDue(fc[c.key])).sort((a, b) => fc[a.key].next - fc[b.key].next);
    let queue = due.concat(list.filter((c) => !fc[c.key]).slice(0, Math.max(0, NEW_PER - Math.min(due.length, NEW_PER / 2))));
    if (!queue.length && ahead) {   // review ahead: the cards due soonest
      queue = list.filter((c) => fc[c.key]).sort((a, b) => fc[a.key].next - fc[b.key].next).slice(0, NEW_PER);
    }
    const map = {}; list.forEach((c) => (map[c.key] = c));
    sess = { sig: sig(), queue: queue.map((c) => c.key), map, i: 0, flipped: false, tally: [0, 0, 0, 0, 0], lapsed: new Set(), fresh: new Set(queue.filter((c) => !fc[c.key]).map((c) => c.key)), ahead: !!ahead, done: 0 };
  }
  const curCard = () => (sess && sess.i < sess.queue.length ? sess.map[sess.queue[sess.i]] : null);

  function viewCards() {
    const fAll = deckCards("formulas"), vAll = deckCards("vocab");
    const fcN = cardCounts(fAll), vcN = cardCounts(vAll);
    if (!sess || sess.sig !== sig()) newSession(false);
    const list = cardList(), C = cardCounts(list);
    let filters = "";
    if (deck === "formulas") {
      const secs = SECS.filter((s) => fAll.some((c) => c.sec === s));
      const topics = []; const seenT = new Set();
      fAll.forEach((c) => { if ((!cf.sec || c.sec === cf.sec) && !seenT.has(c.sec + "/" + c.topic)) { seenT.add(c.sec + "/" + c.topic); topics.push(c); } });
      topics.sort((a, b) => ordOf(a.sec, a.topic) - ordOf(b.sec, b.topic));
      filters = `<div class="rv-cf"><div class="pr-picks" role="group" aria-label="Section"><button type="button" class="pr-pick${cf.sec ? "" : " on"}" data-act="csec" data-v="">All</button>${secs.map((s) => `<button type="button" class="pr-pick sec${cf.sec === s ? " on" : ""}" style="--sc:${SEC_C[s]}" data-act="csec" data-v="${s}"><i></i>${SEC_NAME[s]}</button>`).join("")}</div>
        <select id="rvTopic" aria-label="Topic"><option value="">All topics (${cf.sec ? SEC_NAME[cf.sec] : "every section"})</option>${topics.map((c) => `<option value="${E(c.topic)}"${cf.topic === c.topic ? " selected" : ""}>${E(c.ttl)}</option>`).join("")}</select></div>`;
    }
    const top = `<div class="rv-ctop"><div class="pr-segc" role="group" aria-label="Deck">
        <button type="button" class="${deck === "formulas" ? "on" : ""}" data-act="deck" data-v="formulas" aria-pressed="${deck === "formulas"}">Formulas <small>${fcN.due ? fcN.due + " due" : fAll.length}</small></button>
        <button type="button" class="${deck === "vocab" ? "on" : ""}" data-act="deck" data-v="vocab" aria-pressed="${deck === "vocab"}">Vocabulary <small>${vAll.length ? (vcN.due ? vcN.due + " due" : vAll.length) : "soon"}</small></button></div>${filters}</div>`;
    const stats = `<div class="rv-cstats"><div class="d"><b>${C.due}</b><span>due today</span></div><div class="n"><b>${C.nw}</b><span>new</span></div><div class="l"><b>${C.learned}</b><span>learned</span></div></div>`;
    let stage;
    if (!list.length) {
      stage = deck === "vocab" && !vAll.length
        ? empty("cards", "Vocabulary deck is on its way", "The word list has not been added yet. The formula deck is ready now.", `<div class="btn-row rv-ec"><a class="btn primary" href="#cards/formulas">${ic("cards")} Formula cards</a></div>`)
        : empty("cards", "No cards here", "Nothing matches this filter. Pick another section or topic.");
    } else stage = stageHTML(C);
    return `<div class="rv-cwrap">${top}${stats}<div id="rvStage">${stage}</div>
      <div class="rv-keys"><span><kbd>Space</kbd> flip</span><span><kbd>1</kbd> Again</span><span><kbd>2</kbd> Hard</span><span><kbd>3</kbd> Good</span><span><kbd>4</kbd> Easy</span></div></div>`;
  }
  function stageHTML(C) {
    const c = curCard();
    if (!c) {
      if (sess.done) {
        const t = sess.tally, fc = Store.load().meta.fc || {};
        const tomorrow = cardList().filter((x) => fc[x.key] && dayIdx(fc[x.key].next) === 1).length;
        return `<div class="pr-card rv-sum"><div class="rv-empty-i">${ic("party")}</div><h3>Session done</h3>
          <p class="muted">You went through ${plural(sess.done, "card")}${sess.ahead ? " ahead of schedule" : ""}. ${tomorrow ? `${plural(tomorrow, "card")} come back tomorrow.` : ""}</p>
          <div class="rv-tally">${[1, 2, 3, 4].map((g) => `<div class="${GRADES[g][1]}"><b>${t[g]}</b><span>${GRADES[g][0]}</span></div>`).join("")}</div>
          <div class="btn-row rv-ec">${C.due || C.nw ? `<button type="button" class="btn primary" data-act="round">${ic("restart")} Next ${Math.min(NEW_PER, C.due + C.nw)} cards</button>` : `<button type="button" class="btn" data-act="ahead">${ic("restart")} Review ahead</button>`}
          <a class="btn" href="#cards/${deck === "formulas" ? "vocab" : "formulas"}">${ic("cards")} ${deck === "formulas" ? "Vocabulary" : "Formula"} deck</a></div></div>`;
      }
      return empty("check-circle", "Deck learned for today", `No cards are due and every card in this ${deck === "formulas" ? "selection" : "deck"} has been seen. The next ones come back on their own schedule.`,
        `<div class="btn-row rv-ec"><button type="button" class="btn" data-act="ahead">${ic("restart")} Review ahead (${Math.min(NEW_PER, C.learned)})</button></div>`);
    }
    const fc = Store.load().meta.fc || {}, s = fc[c.key], lapsed = sess.lapsed.has(c.key);
    const tag = lapsed ? '<span class="pr-chip hard">again</span>' : !s ? '<span class="pr-chip rv-new">new</span>' : isCardDue(s) ? '<span class="pr-chip med">due</span>' : '<span class="pr-chip lvl">ahead</span>';
    const n = sess.queue.length, pct = (sess.i / n) * 100;
    let front, back;
    if (c.kind === "f") {
      const lbl = `<div class="rv-ftop">${secChip(c.sec)}<span>${E(c.ttl)}</span></div>`;
      front = `${lbl}<div class="rv-big-t">${F(c.front)}</div><div class="rv-cue">Say the formula or rule out loud, then flip.</div>`;
      back = `${lbl}<div class="rv-sm-t">${F(c.front)}</div><div class="rv-fm">${body(c.back)}</div>${c.note ? `<div class="rv-nt">${F(c.note)}</div>` : ""}`;
    } else {
      const lbl = `<div class="rv-ftop"><span class="pr-chip sec" style="--sc:var(--c-verbal)">Vocabulary</span>${c.pos ? `<span>${E(c.pos)}</span>` : ""}</div>`;
      const chips = (arr, l) => arr && arr.length ? `<div class="rv-tags"><em>${l}</em>${arr.slice(0, 5).map((w) => `<span>${E(w)}</span>`).join("")}</div>` : "";
      front = `${lbl}<div class="rv-big-t rv-word">${E(c.w)}</div><div class="rv-cue">What does it mean? Use it in a sentence, then flip.</div>`;
      back = `${lbl}<div class="rv-sm-t">${E(c.w)}${c.pos ? ` <i>${E(c.pos)}</i>` : ""}</div><div class="rv-fm rv-mean">${F(c.m)}</div>${c.ex ? `<div class="rv-ex">${F(c.ex)}</div>` : ""}${chips(c.syn, "Synonyms")}${chips(c.ant, "Antonyms")}`;
    }
    const rate = [1, 2, 3, 4].map((g) => {
      const lv = gradeLevel(c, g, lapsed);
      return `<button type="button" class="${GRADES[g][1]}" data-act="rate" data-g="${g}"><b>${GRADES[g][0]}</b><small>${g === 1 ? "again soon" : ivl(lv)}</small><kbd>${g}</kbd></button>`;
    }).join("");
    return `<div class="rv-prog"><span>Card <b>${sess.i + 1}</b> of ${n}</span><span class="rv-pbar"><i style="width:${pct}%"></i></span>${tag}</div>
      <div class="rv-scene"><div class="rv-flip${sess.flipped ? " on" : ""}" id="rvCard" role="button" tabindex="0" aria-label="Flashcard, press Space to flip" data-act="flip">
        <div class="rv-face rv-front" aria-hidden="${sess.flipped}">${front}<div class="rv-tap">${ic("flip")} Click or press Space</div></div>
        <div class="rv-face rv-back" aria-hidden="${!sess.flipped}">${back}</div></div></div>
      <div class="rv-flipbar"${sess.flipped ? " hidden" : ""}><button type="button" class="btn primary" data-act="flip">Show answer <kbd>Space</kbd></button></div>
      <div class="rv-rate"${sess.flipped ? "" : " hidden"} role="group" aria-label="How well did you know it?">${rate}</div>`;
  }
  function flip() {
    const c = curCard(), card = document.getElementById("rvCard");
    if (!c || !card) return;
    sess.flipped = !sess.flipped;
    card.classList.toggle("on", sess.flipped);
    card.querySelector(".rv-front").setAttribute("aria-hidden", sess.flipped);
    card.querySelector(".rv-back").setAttribute("aria-hidden", !sess.flipped);
    const fb = main.querySelector(".rv-flipbar"), rb = main.querySelector(".rv-rate");
    if (fb) fb.hidden = sess.flipped;
    if (rb) rb.hidden = !sess.flipped;
  }
  function rate(g) {
    const c = curCard();
    if (!c || !sess.flipped) return;
    const fc = fcStore(), now = Date.now(), s = fc[c.key] || {}, lapsed = sess.lapsed.has(c.key);
    const level = gradeLevel(c, g, lapsed);
    fc[c.key] = { level, next: g === 1 ? now : now + INTERVALS[level] * DAYMS, seen: now, n: (s.n || 0) + 1 };
    if (g === 1) {   // comes back later in this session
      sess.lapsed.add(c.key);
      sess.queue.splice(Math.min(sess.queue.length, sess.i + 4), 0, c.key);
    }
    sess.tally[g]++; sess.done++; sess.i++; sess.flipped = false;
    Store.save();
    render(true);
    const nc = document.getElementById("rvCard");
    if (nc) { stampEl(nc); try { nc.focus({ preventScroll: true }); } catch (e) {} }
    else stampEl(main.querySelector(".rv-sum"));
  }

  /* ---------------------------------------------------------------- render + events */
  function render(keepScroll) {
    const M = model();
    let v;
    if (view === "mistakes") v = viewMistakes(M);
    else if (view === "bookmarks") v = viewBookmarks(M);
    else if (view === "cards") v = viewCards();
    else v = viewDue(M);
    const y = window.scrollY;
    main.innerHTML = `<div class="rv-head"><div><h1 class="pr-h1">Revision</h1>
      <p class="lead">Your due reviews, the mistake book, bookmarks and flashcards, all on one schedule: 1, 3, 7, 14, 30, then 60 days.</p></div></div>
      ${tabsHTML(M)}<div class="rv-view" data-view="${view}">${v}</div>`;
    if (keepScroll) window.scrollTo(0, y);
    document.title = { due: "Due reviews", mistakes: "Mistake book", bookmarks: "Bookmarks", cards: "Flashcards" }[view] + " · Revision · Aptitude Hub";
  }
  function after(el, fn) { fn(); }
  function onClick(e) {
    const b = e.target.closest("[data-act]");
    if (!b || !main.contains(b)) return;
    const act = b.dataset.act, k = b.dataset.k;
    if (act === "flip") { e.preventDefault(); return flip(); }
    if (act === "rate") return rate(+b.dataset.g);
    if (act === "round") { newSession(false); return render(true); }
    if (act === "ahead") { newSession(true); return render(true); }
    if (act === "deck") { location.hash = "#cards/" + b.dataset.v; return; }
    if (act === "csec") { cf = { sec: b.dataset.v, topic: "" }; ss.set("apt:rev:cf", cf); sess = null; return render(true); }
    if (act === "group") { location.hash = b.dataset.v === "reason" ? "#mistakes/reason" : "#mistakes"; return; }
    if (act === "sec") { secF = b.dataset.v; ss.set("apt:rev:sec", secF); return render(true); }
    if (act === "star") {
      const it = Store.toggleStar(k);
      toast(it.star ? "Starred" : "Bookmark removed", 1400, it.star ? "star-fill" : "");
      render(true);
      if (it.star) stampEl(main.querySelector('[data-act="star"][data-k="' + k.replace(/"/g, '\\"') + '"]'));
      return;
    }
    if (act === "why") {
      const it = Store.item(k);
      Store.patch(k, { why: it.why === b.dataset.v ? null : b.dataset.v });
      return render(true);
    }
    if (act === "fix") {
      Store.setStatus(k, "done");
      Store.patch(k, { fixed: Date.now(), next: Date.now() + DAYMS, level: 0 });
      openRows.delete(k);
      toast("Marked as fixed. It comes back for one check tomorrow.", 2200, "check");
      return after(b.closest(".rv-row"), () => render(true));
    }
    if (act === "rev") {
      const ok = b.dataset.ok === "1";
      Store.review(k, ok);
      toast(ok ? "Nice. The next review moves further out" : "No problem. It comes back tomorrow", 2000, ok ? "check" : "repeat");
      return after(b.closest(".rv-lrow"), () => render(true));
    }
  }
  function onToggle(e) {
    const d = e.target;
    if (!d.classList || !d.classList.contains("rv-row")) return;
    const k = d.dataset.k;
    if (d.open) {
      openRows.add(k);
      const bx = d.querySelector(".pr-qbody");
      if (bx && !bx.innerHTML.trim()) { const it = Store.item(k), q = qOf(k); if (q) bx.innerHTML = qBody({ k, it, q }, view); }
    } else openRows.delete(k);
  }
  function onKey(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (t && t.closest && t.closest(".psel, .nav-menu, [role=dialog]")) return;
    // arrow keys move along the tab bar
    if (t && t.closest && t.closest(".rv-tabs") && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      const tabs = [...main.querySelectorAll(".rv-tabs a")], i = tabs.indexOf(t.closest("a"));
      const nx = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      if (nx) { e.preventDefault(); nx.focus(); }
      return;
    }
    if (view !== "cards" || !curCard()) return;
    const onCtl = t && t.closest && t.closest("button, a") && t.id !== "rvCard";
    if (e.key === " " || e.key === "Enter") { if (onCtl) return; e.preventDefault(); flip(); return; }
    if (/^[1-4]$/.test(e.key) && sess.flipped) { e.preventDefault(); rate(+e.key); }
  }

  /* ---------------------------------------------------------------- styles */
  const CSS = `
.rv .rv-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.rv .rv-head .lead { margin: 0 0 .9rem; font-size: var(--fs-md); }
.rv-tabs { display: flex; gap: .3rem; padding: 4px; margin: 0 0 1.25rem; width: fit-content; max-width: 100%; overflow-x: auto; background: var(--panel); border: 1px solid var(--border); border-radius: var(--r-pill); box-shadow: var(--shadow); scrollbar-width: none; }
.rv-tabs a { display: inline-flex; align-items: center; gap: .45rem; padding: .42rem 1rem; border-radius: var(--r-pill); color: var(--muted); font: 700 var(--fs-sm) var(--display); text-decoration: none; white-space: nowrap; }
.rv-tabs a:hover { color: var(--text); background: var(--panel-2); text-decoration: none; }
.rv-tabs a.on { background: var(--accent-soft); color: var(--accent); }
.rv-tabs a .ico { width: 16px; height: 16px; }
.rv-tabs .n { min-width: 1.45rem; padding: 0 .4rem; border-radius: var(--r-pill); background: var(--panel-2); color: var(--text); font-size: var(--fs-2xs); line-height: 1.6; text-align: center; font-variant-numeric: tabular-nums; }
.rv-tabs .n.z { color: var(--muted); opacity: .75; }
.rv-tabs a.on .n { background: var(--page-c, var(--accent)); color: #fff; opacity: 1; }
[data-theme="dark"] .rv-tabs a.on .n { color: #1a1a1d; }

.rv-grid { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 1.25rem; align-items: start; }
.rv-main { min-width: 0; }
.rv-rail { display: grid; gap: 1rem; position: sticky; top: calc(var(--top-h, 56px) + 20px); }
.rv-rail .pr-card { margin: 0; }
.rv .pr-card h5 { margin-bottom: .7rem; }
.rv-p { margin: 0 0 .6rem; line-height: 1.5; }

.rv-hero { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
.rv-big { display: grid; justify-items: center; min-width: 64px; padding: .35rem .6rem; border-radius: var(--r-md); background: var(--accent-soft); color: var(--accent); }
.rv-big b { font: 800 1.9rem var(--display); line-height: 1; }
.rv-big span { font: 700 var(--fs-2xs) var(--display); text-transform: uppercase; letter-spacing: .06em; }
.rv-hero-t { min-width: 0; flex: 1 1 260px; }

.rv-grp { padding: 1rem 1.1rem; }
.rv-gh { display: flex; align-items: center; justify-content: space-between; gap: .5rem .8rem; flex-wrap: wrap; margin-bottom: .75rem; }
.rv-ght { min-width: 0; display: grid; gap: .15rem; }
.rv-ghr { display: flex; align-items: center; gap: .55rem; flex-wrap: wrap; }
.rv-gh h3 { margin: 0; font: 800 var(--fs-lg) var(--display); display: inline-flex; align-items: center; gap: .4rem; }
.rv-cnt { font: 800 var(--fs-xs) var(--display); color: var(--muted); background: var(--panel-2); border-radius: var(--r-pill); padding: .05rem .5rem; }
.rv-sub { font-size: var(--fs-xs); color: var(--muted); }
.rv-hint { margin: -.3rem 0 .6rem; }

.rv-row summary { align-items: center; padding: .6rem .85rem; gap: .75rem; }
.rv-sm { flex: 1; min-width: 0; display: grid; gap: .12rem; }
.rv-sm .t { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: var(--fs-md); }
.rv-meta, .rv-facts { display: flex; gap: .35rem; flex-wrap: wrap; align-items: center; font-size: var(--fs-xs); color: var(--muted); }
.rv-meta i, .rv-facts i { font-style: normal; opacity: .6; }
.rv-st { color: var(--amber); display: inline-flex; } .rv-st .ico { width: 13px; height: 13px; }
.rv-right { display: flex; flex-direction: column; align-items: flex-end; gap: .2rem; flex: none; }
.rv-when { font-size: var(--fs-xs); color: var(--muted); white-space: nowrap; }
.rv-when.late { color: var(--amber); font-weight: 600; }
.rv-why { font-size: var(--fs-2xs); font-weight: 700; padding: 0 .45rem; border-radius: var(--r-pill); color: color-mix(in srgb, var(--rc) 80%, var(--text)); background: color-mix(in srgb, var(--rc) 14%, var(--panel)); }
.rv-row .pr-qbody { border-top: 1px dashed var(--border); padding-top: .8rem; margin-top: .1rem; }
.rv-facts { margin-bottom: .5rem; }
.rv-qtext { font-size: 1.04rem; line-height: 1.65; margin: .4rem 0 .8rem; }
.rv-note { font-size: var(--fs-xs); color: var(--muted); margin: -.2rem 0 .6rem; }
.rv .pr-sol { margin-top: .6rem; }
.rv-acts { display: flex; align-items: center; gap: .45rem; flex-wrap: wrap; margin-top: .9rem; }
.rv-acts .rv-reasons { margin-left: auto; }
.rv-stim { margin: .2rem 0 .6rem; border: 1px solid var(--border); border-radius: var(--r-md); background: var(--panel-2); }
.rv-stim > summary { cursor: pointer; padding: .45rem .8rem; font: 700 var(--fs-sm) var(--display); color: var(--accent); display: flex; align-items: center; gap: .4rem; }
.rv-stim-b { padding: .2rem 1rem 1rem; overflow-x: auto; }
.rv-stim-b h3 { margin: .2rem 0 .5rem; font: 800 var(--fs-md) var(--display); }

.rv-llist { display: grid; }
.rv-lrow { display: flex; align-items: center; gap: .6rem; padding: .6rem .1rem; border-bottom: 1px dashed var(--border); flex-wrap: wrap; }
.rv-lrow:last-child { border-bottom: 0; }
.rv-lt { flex: 1; min-width: 150px; display: grid; gap: .1rem; }
.rv-lt > a { font: 700 var(--fs-md) var(--display); color: var(--text); }
.rv-lt > a:hover { color: var(--accent); }
.rv-lv { display: inline-flex; gap: 3px; } .rv-lv i { width: 7px; height: 7px; border-radius: 50%; background: var(--border); } .rv-lv i.on { background: var(--green); }
.rv-open .ico { width: 14px; height: 14px; }
.rv-llist.sm .rv-lrow { gap: .45rem; padding: .5rem 0; }
.rv-llist.sm .rv-open { display: none; }
.rv-llist.sm .pr-chip { font-size: var(--fs-2xs); }

.rv-up { list-style: none; margin: 0; padding: 0; display: grid; gap: .4rem; }
.rv-up li { display: grid; grid-template-columns: 5.6rem 1fr 1.6rem; gap: .5rem; align-items: center; font-size: var(--fs-xs); }
.rv-up .d { color: var(--muted); white-space: nowrap; }
.rv-up .v { text-align: right; font: 700 var(--fs-xs) var(--display); font-variant-numeric: tabular-nums; }
.rv-ub { display: flex; height: 8px; border-radius: var(--r-pill); background: var(--panel-2); overflow: hidden; }
.rv-ub i { display: block; height: 100%; } .rv-ub i.q { background: var(--page-c, var(--accent)); } .rv-ub i.c { background: var(--purple); opacity: .8; }
.rv-links { display: grid; gap: .15rem; }
.rv-links a { display: flex; align-items: center; gap: .5rem; padding: .35rem .45rem; border-radius: var(--r-sm); color: var(--text); font-size: var(--fs-sm); }
.rv-links a:hover { background: var(--panel-2); text-decoration: none; }
.rv-links b { margin-left: auto; font: 800 var(--fs-xs) var(--display); color: var(--muted); }
.rv-links .ico { color: var(--accent); }

.rv-tools { display: flex; align-items: center; gap: .75rem 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
.rv-lbl { font: 700 var(--fs-xs) var(--display); color: var(--muted); padding: 0 .4rem 0 .6rem; align-self: center; }
.rv-rdot { width: 10px; height: 10px; border-radius: 50%; background: var(--rc); flex: none; display: inline-block; }
.rv-mix { display: flex; height: 10px; border-radius: var(--r-pill); overflow: hidden; background: var(--panel-2); margin-bottom: .7rem; gap: 2px; }
.rv-mix i { display: block; height: 100%; }
.rv-rl, .rv-wl { list-style: none; margin: 0 0 .6rem; padding: 0; display: grid; gap: .3rem; font-size: var(--fs-sm); }
.rv-rl li { display: flex; align-items: center; gap: .5rem; }
.rv-rl b, .rv-wl b { font: 800 var(--fs-sm) var(--display); font-variant-numeric: tabular-nums; }
.rv-wl li { display: flex; align-items: center; gap: .6rem; justify-content: space-between; padding: .25rem 0; border-bottom: 1px dashed var(--border); }
.rv-wl li:last-child { border-bottom: 0; }
.rv-wl small { display: block; color: var(--muted); font-size: var(--fs-2xs); }
.rv-wl b { color: var(--red); }
.rv-l0 { margin-left: 0; }
.rv-wbtn { margin-top: .2rem; }

.rv-empty { text-align: center; padding: 2.4rem 1.5rem 2rem; }
.rv-empty h3 { margin: .5rem 0 .3rem; font: 800 var(--fs-xl) var(--display); }
.rv-empty p { max-width: 52ch; margin: 0 auto; }
.rv-empty-i { width: 64px; height: 64px; margin: 0 auto; border-radius: 50%; display: grid; place-items: center; background: var(--accent-soft); color: var(--accent); }
.rv-empty-i .ico { width: 30px; height: 30px; }
.rv-ec { justify-content: center; margin-top: 1.1rem; }

/* flashcards */
.rv-cwrap { max-width: 720px; margin: 0 auto; }
.rv-ctop { display: flex; align-items: center; gap: .75rem; flex-wrap: wrap; margin-bottom: 1rem; }
.rv-ctop .pr-segc small { font-weight: 600; color: var(--muted); margin-left: .25rem; font-size: var(--fs-2xs); }
.rv-cf { display: flex; align-items: center; gap: .6rem; flex-wrap: wrap; }
.rv-cf .psel-btn { max-width: 230px; }
.rv-cstats { display: grid; grid-template-columns: repeat(3, 1fr); gap: .6rem; margin-bottom: 1rem; }
.rv-cstats > div { background: var(--panel); border: 1px solid var(--border); border-radius: var(--r-md); padding: .55rem .8rem; display: flex; align-items: baseline; gap: .5rem; justify-content: center; }
.rv-cstats b { font: 800 var(--fs-xl) var(--display); font-variant-numeric: tabular-nums; }
.rv-cstats span { font-size: var(--fs-xs); color: var(--muted); }
.rv-cstats .d b { color: var(--accent); } .rv-cstats .n b { color: var(--purple); } .rv-cstats .l b { color: var(--green); }
.rv-prog { display: flex; align-items: center; gap: .7rem; font-size: var(--fs-xs); color: var(--muted); margin-bottom: .7rem; }
.rv-prog b { color: var(--text); }
.rv-pbar { flex: 1; height: 6px; border-radius: var(--r-pill); background: var(--panel-2); overflow: hidden; }
.rv-pbar i { display: block; height: 100%; border-radius: var(--r-pill); background: var(--page-c, var(--accent)); }
 .rv-pbar i { transition: width 150ms linear; }
.pr-chip.rv-new { background: var(--purple-soft); color: var(--purple); }
.rv-flip { display: grid; cursor: pointer; border-radius: 20px; outline: none; }
.rv-flip:focus-visible .rv-face { box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 45%, transparent); }
.rv-face { grid-area: 1 / 1; position: relative; min-height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .7rem; text-align: center;
  padding: 3.2rem 2rem 2.6rem; background: var(--panel); border: 1px solid var(--border); border-radius: 20px; box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 10px 30px rgba(0,0,0,.06); }
[data-theme="dark"] .rv-face { box-shadow: none; }
.rv-back { background: color-mix(in srgb, var(--page-c, var(--accent)) 5%, var(--panel)); border-color: color-mix(in srgb, var(--page-c, var(--accent)) 28%, var(--border)); visibility: hidden; }
.rv-flip.on .rv-front { visibility: hidden; } .rv-flip.on .rv-back { visibility: visible; }
.rv-ftop { position: absolute; top: .95rem; left: 1.1rem; right: 1.1rem; display: flex; align-items: center; gap: .5rem; font-size: var(--fs-xs); color: var(--muted); text-align: left; }
.rv-ftop > span:last-child:not(.pr-chip) { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rv-big-t { font: 800 1.65rem var(--display); line-height: 1.3; max-width: 32ch; overflow-wrap: anywhere; }
.rv-word { font-size: 2.2rem; letter-spacing: -.01em; }
.rv-cue { font-size: var(--fs-sm); color: var(--muted); }
.rv-tap { position: absolute; bottom: .85rem; left: 0; right: 0; display: flex; justify-content: center; align-items: center; gap: .35rem; font-size: var(--fs-2xs); color: var(--muted); opacity: .8; }
.rv-tap .ico { width: 13px; height: 13px; }
.rv-sm-t { font: 700 var(--fs-sm) var(--display); color: var(--muted); }
.rv-sm-t i { font-weight: 600; }
.rv-fm { font-size: 1.35rem; font-weight: 600; line-height: 1.5; max-width: 40ch; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.rv-mean { font-size: 1.2rem; }
.rv-nt { font-size: var(--fs-sm); color: var(--muted); max-width: 52ch; padding: .45rem .8rem; border-radius: var(--r-sm); background: var(--panel-2); }
.rv-ex { font-size: var(--fs-md); font-style: italic; color: var(--text); max-width: 52ch; opacity: .9; }
.rv-ex::before { content: "\\201C"; } .rv-ex::after { content: "\\201D"; }
.rv-tags { display: flex; flex-wrap: wrap; gap: .3rem; justify-content: center; align-items: center; font-size: var(--fs-xs); }
.rv-tags em { font-style: normal; color: var(--muted); font-weight: 700; margin-right: .2rem; }
.rv-tags span { padding: .05rem .55rem; border-radius: var(--r-pill); background: var(--panel-2); border: 1px solid var(--border); }
.rv-flipbar { display: flex; justify-content: center; margin-top: 1rem; }
.rv-flipbar[hidden], .rv-rate[hidden] { display: none; }
.rv-flipbar .btn { padding: .55rem 1.4rem; font-size: var(--fs-md); }
.rv-rate { display: grid; grid-template-columns: repeat(4, 1fr); gap: .55rem; margin-top: 1rem; }
.rv-rate button { position: relative; display: grid; justify-items: center; gap: .05rem; padding: .55rem .3rem .5rem; border-radius: var(--r-md); border: 1.5px solid var(--border); background: var(--panel); color: var(--text); cursor: pointer; font: inherit; }
.rv-rate button b { font: 800 var(--fs-md) var(--display); }
.rv-rate button small { font-size: var(--fs-2xs); color: var(--muted); }
.rv-rate button kbd { position: absolute; top: .3rem; right: .35rem; font-size: .65rem; opacity: .7; }
.rv-rate .g1 b { color: var(--red); } .rv-rate .g2 b { color: var(--amber); } .rv-rate .g3 b { color: var(--green); } .rv-rate .g4 b { color: var(--accent); }
.rv-rate .g1:hover { border-color: var(--red); background: var(--red-soft); } .rv-rate .g2:hover { border-color: var(--amber); background: var(--amber-soft); }
.rv-rate .g3:hover { border-color: var(--green); background: var(--green-soft); } .rv-rate .g4:hover { border-color: var(--accent); background: var(--accent-soft); }
.rv-keys { display: flex; justify-content: center; gap: .9rem; flex-wrap: wrap; margin-top: 1.1rem; font-size: var(--fs-xs); color: var(--muted); }
.rv-sum { text-align: center; padding: 2rem 1.5rem; }
.rv-sum h3 { margin: .5rem 0 .3rem; font: 800 var(--fs-xl) var(--display); }
.rv-tally { display: grid; grid-template-columns: repeat(4, minmax(0, 90px)); gap: .5rem; justify-content: center; margin: 1rem 0 .2rem; }
.rv-tally div { border: 1px solid var(--border); border-radius: var(--r-md); padding: .45rem; display: grid; }
.rv-tally b { font: 800 var(--fs-xl) var(--display); } .rv-tally span { font-size: var(--fs-2xs); color: var(--muted); }
.rv-tally .g1 b { color: var(--red); } .rv-tally .g2 b { color: var(--amber); } .rv-tally .g3 b { color: var(--green); } .rv-tally .g4 b { color: var(--accent); }

@media (max-width: 1000px) {
  .rv-grid { grid-template-columns: minmax(0, 1fr); }
  .rv-rail { position: static; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
}
@media (max-width: 640px) {
  .rv-tabs { width: 100%; border-radius: var(--r-md); }
  .rv-tabs a { padding: .4rem .7rem; flex: 1; justify-content: center; }
  .rv-tabs a .ico { display: none; }
  .rv-grp { padding: .85rem .75rem; }
  .rv-row summary { padding: .55rem .6rem; gap: .5rem; }
  .rv-right .rv-why { display: none; }
  .rv-acts .rv-reasons { margin-left: 0; flex-basis: 100%; }
  .rv-face { min-height: 250px; padding: 3rem 1.1rem 2.4rem; }
  .rv-big-t { font-size: 1.35rem; } .rv-word { font-size: 1.8rem; } .rv-fm { font-size: 1.12rem; }
  .rv-rate { gap: .35rem; } .rv-rate button kbd { display: none; }
  .rv-cstats > div { flex-direction: column; align-items: center; gap: 0; padding: .45rem; }
  .rv-keys { display: none; }
  .rv-hero .btn.primary { width: 100%; justify-content: center; }
}
@media print { .rv-tabs, .rv-rail, .rv-acts, .rv-tools { display: none; } .rv-grid { display: block; } }
/* calm: flat, sentence-case headings, one loud thing (.btn.primary / .is-hero) */
.rv h2, .rv h3, .rv h4 { text-transform: none; letter-spacing: 0; font-weight: 800; border: 0; }
.rv .pr-card, .rv .rv-stim, .rv .pr-qrow, .rv .rv-tally div, .rv .rv-cstats > div { box-shadow: none; border: 2px solid var(--ink); border-radius: 0; }
.rv .pr-card.is-hero { border-width: 3px; box-shadow: 6px 6px 0 var(--ink); }
.rv .pr-card h5, .rv h5 { font: 700 12px var(--mono); text-transform: uppercase; letter-spacing: .04em; color: var(--muted); }
.rv .btn:not(.primary), .rv .pr-icon { box-shadow: none; transform: none !important; border: 2px solid var(--ink) !important; text-transform: none; letter-spacing: 0; font-weight: 800; min-height: 44px; display: inline-flex; align-items: center; justify-content: center; gap: .35rem; }
.rv .btn:not(.primary):hover { background: var(--panel-2); color: var(--text); box-shadow: none; transform: none !important; }
.rv .btn.primary { text-transform: none; letter-spacing: 0; min-height: 44px; }
.rv .btn.sm { min-height: 44px; }
.rv-tabs { box-shadow: none; border: 2px solid var(--ink); border-radius: 0; background: var(--panel); padding: 0; gap: 0; }
.rv-tabs a { border-radius: 0; min-height: 44px; color: var(--text); border-right: 2px solid var(--ink); text-transform: none; }
.rv-tabs a:last-child { border-right: 0; }
.rv-tabs a:hover { background: var(--panel-2); color: var(--text); }
.rv-tabs a.on, .rv-tabs a.on:hover { background: var(--ink); color: var(--bg); box-shadow: none; }
.rv-tabs .n { border-radius: 0; font-family: var(--mono); }
.rv-tabs a.on .n { background: var(--bg); color: var(--ink); }
.rv-big { border-radius: 0; border: 2px solid var(--ink); background: var(--panel-2); color: var(--text); }
.rv-big b { font-family: var(--mono); }
.rv-cnt { border-radius: 0; font-family: var(--mono); border: 1.5px solid var(--ink); background: var(--panel); }
.rv-ub, .rv-pbar, .rv-mix { border-radius: 0; border: 1.5px solid var(--ink); }
.rv-rdot { border-radius: 0; border: 1.5px solid var(--ink); }
.rv-lv i { border-radius: 0; }
.rv-links a { min-height: 44px; border-radius: 0; }
.rv-links a:hover { background: var(--panel-2); }
.rv .rv-wl b, .rv .rv-up .v, .rv-cstats b, .rv-tally b, .rv .rv-rl b { font-family: var(--mono); }
.rv-empty-i { border-radius: 0; border: 2px solid var(--ink); background: var(--panel-2); color: var(--text); }
.rv-face { border-radius: 0; border: 2px solid var(--ink); box-shadow: none; background: var(--panel); }
.rv-flip { border-radius: 0; }
.rv-back { background: var(--panel-2); border-color: var(--ink); }
.rv-flip:focus-visible .rv-face { box-shadow: none; outline: 3px solid var(--accent); outline-offset: 2px; }
.rv-nt { border-radius: 0; border: 2px solid var(--ink); background: var(--green-soft); color: var(--text); }
.rv-tags span { border-radius: 0; }
.rv-rate button { border-radius: 0; border: 2px solid var(--ink); min-height: 56px; box-shadow: none; transform: none; }
.rv-rate button:hover { transform: none; box-shadow: none; }
.rv-rate .g1:hover { background: var(--red-soft); border-color: var(--ink); } .rv-rate .g2:hover { background: var(--amber-soft); border-color: var(--ink); }
.rv-rate .g3:hover { background: var(--green-soft); border-color: var(--ink); } .rv-rate .g4:hover { background: var(--panel-2); border-color: var(--ink); }
.rv-rate .g1 b, .rv-rate .g2 b, .rv-rate .g3 b, .rv-rate .g4 b, .rv-tally .g1 b, .rv-tally .g2 b, .rv-tally .g3 b, .rv-tally .g4 b { color: var(--text); }
.rv-stim > summary { color: var(--text); min-height: 44px; }
.rv .pr-pick, .rv .pr-segc { box-shadow: none; border-radius: 0; }
.rv .pr-pick { border: 2px solid var(--ink); min-height: 44px; }
.rv .pr-pick.on, .rv .pr-segc button.on { background: var(--ink); color: var(--bg); box-shadow: none; }
.rv .pr-segc button { min-height: 40px; }
.rv .pr-chip { box-shadow: none; }
`;

  /* ---------------------------------------------------------------- boot */
  window.RevisionPage = function () {
    main = document.getElementById("content");
    if (!main || main.dataset.rv) return;
    main.dataset.rv = "1";
    if (!window.Store || !window.QB) { main.innerHTML = '<p class="muted">The revision engine could not start (missing common.js or qbank.js).</p>'; return; }
    if (!document.getElementById("revStyle")) {
      const st = document.createElement("style"); st.id = "revStyle"; st.textContent = CSS; document.head.appendChild(st);
    }
    main.classList.add("pr", "rv");
    parseHash();
    main.addEventListener("click", onClick);
    main.addEventListener("toggle", onToggle, true);
    main.addEventListener("change", (e) => {
      if (e.target.id === "rvTopic") { cf = { sec: cf.sec, topic: e.target.value }; ss.set("apt:rev:cf", cf); sess = null; render(true); }
    });
    document.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", () => { const was = view; parseHash(); render(); if (was !== view) window.scrollTo(0, 0); });
    // another tab changed progress: refresh the lists (not mid-card)
    window.addEventListener("storage", (e) => { if (e.key === Store.key) { Store.d = null; if (view !== "cards") render(true); } });
    render();
  };
})();
