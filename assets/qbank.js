/* =====================================================================
   qbank.js : the question-bank engine (loaded after site.js, which creates window.QB with add / set / gen)
   - QB.rng(seed)            seeded random numbers (mulberry32) with .int .pick .shuffle .chance
   - QB.options / money / num / pct / frac / gcd / lcm / round   helpers for generators
   - QB.make(key, d, seed)   one full question from a generator (id "g:<key>:<d>:<seed>")
   - QB.fromId / QB.get      rebuild any question from its id (bank or generated)
   - QB.pool(filter)         bank questions + generator keys matching sec / topics / patterns / diff
   - QB.record(q, i, secs)   the one place an answer is saved (question item, pattern item, activity)
   - QB.quizHTML(ids)        inline MCQs for learn pages (clicks are handled here)
   - QB.setHTML(set)         shared stimulus (passage / html / chart) for DI, RC and puzzles
   Runs in Node too (tools/verify.js): nothing here touches the DOM at load time outside the guarded block.
   ===================================================================== */
(function () {
  const root = typeof window !== "undefined" ? window : globalThis;
  const QB = (root.QB = root.QB || {});
  if (!QB.qs) Object.assign(QB, { qs: [], byId: {}, sets: {}, gens: {} });
  if (!QB.add) QB.add = function (list) { list.forEach((q) => { this.qs.push(q); this.byId[q.id] = q; }); };
  if (!QB.set) QB.set = function (id, spec) { this.sets[id] = Object.assign({ id }, spec); };
  if (!QB.gen) QB.gen = function (key, g) { this.gens[key] = Object.assign({ key }, g); };

  /* ---------------------------------------------------------------- numbers */
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; };
  const lcm = (a, b) => (a && b ? Math.abs(a / gcd(a, b) * b) : 0);
  const round = (x, n = 0) => {
    if (!isFinite(x)) return x;
    const f = Math.pow(10, n), v = Math.round(Math.abs(x) * f + 1e-9 * Math.abs(x) * f) / f;   // half away from zero, shielded from 1.005-style float noise
    return x < 0 ? -v : v;
  };
  const MINUS = "−";
  // Indian digit grouping: 1,00,000.  Up to two decimals, only when the value is not a whole number.
  function group(n) {
    n = Number(n);
    if (!isFinite(n)) return { neg: false, s: String(n), dec: "" };
    const neg = n < 0, v = Math.abs(round(n, 2)), whole = Math.floor(v);
    let s = String(whole);
    if (s.length > 3) s = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + s.slice(-3);
    const frac = round(v - whole, 2);
    const dec = frac > 0 ? frac.toFixed(2).slice(1) : "";
    return { neg, s, dec };
  }
  const num = (n) => { const g = group(n); return (g.neg ? MINUS : "") + g.s + g.dec.replace(/0+$/, ""); };
  const money = (n) => { const g = group(n); return (g.neg ? MINUS : "") + "₹" + g.s + g.dec; };
  const pct = (n) => { n = round(Number(n), 2); return (n < 0 ? MINUS : "") + String(Math.abs(n)) + "%"; };
  const frac = (a, b) => {
    if (!b) return "undefined";
    const g = gcd(a, b) || 1; let p = a / g, q = b / g;
    if (q < 0) { p = -p; q = -q; }
    return q === 1 ? (p < 0 ? MINUS : "") + Math.abs(p) : (p < 0 ? MINUS : "") + Math.abs(p) + "/" + q;
  };

  /* ---------------------------------------------------------------- random */
  function hashSeed(s) { let h = 0x811c9dc5; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h >>> 0; }
  function rng(seed) {
    let a = typeof seed === "number" && isFinite(seed) ? seed >>> 0 : hashSeed(seed == null ? Date.now() : seed);
    const f = function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    f.int = (lo, hi) => { if (hi == null) { hi = lo; lo = 0; } return lo + Math.floor(f() * (hi - lo + 1)); };
    f.pick = (arr) => arr[Math.floor(f() * arr.length)];
    f.shuffle = (arr) => { const r = arr.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(f() * (i + 1)); const t = r[i]; r[i] = r[j]; r[j] = t; } return r; };
    f.chance = (p) => f() < p;
    return f;
  }
  const FIXED_LAST = /^\s*(none|all|both|neither)\s+of\s+(these|the\s+above|them)\b/i;
  // pairs = [[text, why], ...], the FIRST pair is the correct one. "None of these"-style texts stay last.
  function options(r, pairs) {
    const seen = new Set();
    pairs.forEach((p) => {
      const k = String(p[0]).trim().toLowerCase();
      if (seen.has(k)) throw new Error("QB.options: duplicate option text \"" + p[0] + "\"");
      seen.add(k);
    });
    const tagged = pairs.map((p, i) => ({ t: String(p[0]), w: p[1] == null || p[1] === "" ? null : p[1], ok: i === 0 }));
    const free = tagged.filter((x) => !FIXED_LAST.test(x.t)), fixed = tagged.filter((x) => FIXED_LAST.test(x.t));
    const order = r.shuffle(free).concat(fixed);
    const ans = order.findIndex((x) => x.ok);
    return { opts: order.map((x) => x.t), ans, why: order.map((x) => (x.ok ? null : x.w)) };
  }

  /* ---------------------------------------------------------------- generators */
  const DEFAULT_TIME = { Easy: 40, Medium: 60, Hard: 90 };
  const GID = /^g:([^:]+):(Easy|Medium|Hard):(\d+)$/;
  function make(key, d, seed) {
    const g = QB.gens[key];
    if (!g) throw new Error("QB.make: no generator for " + key);
    const q = g.gen(rng(seed), d);
    const [sec, topic, pattern] = key.split("/");
    return Object.assign({ time: DEFAULT_TIME[d] || 60 }, q, { id: "g:" + key + ":" + d + ":" + seed, sec, topic, pattern, d, gen: true });
  }
  function fromId(id) {
    const m = GID.exec(String(id));
    if (!m || !QB.gens[m[1]]) return null;
    try { return make(m[1], m[2], +m[3]); } catch (e) { return null; }
  }
  const get = (id) => QB.byId[id] || fromId(id) || null;
  const itemKey = (q) => (String(q.id).slice(0, 2) === "g:" ? q.id : "q:" + q.id);
  const patKey = (q) => q.sec + "/" + q.topic + "/" + q.pattern;

  /* matching sec / topics / patterns / diff.  topics + patterns are arrays of ids (empty = all);
     a pattern may be given as "pattern-id" or as the full key "sec/topic/pattern". */
  function pool(f) {
    f = f || {};
    const topics = f.topics && f.topics.length ? f.topics : null, pats = f.patterns && f.patterns.length ? f.patterns : null;
    const diff = f.diff && f.diff.length ? f.diff : null;
    const ok = (sec, topic, pattern) => (!f.sec || f.sec === sec) && (!topics || topics.includes(topic)) &&
      (!pats || pats.includes(pattern) || pats.includes(sec + "/" + topic + "/" + pattern));
    const bank = QB.qs.filter((q) => ok(q.sec, q.topic, q.pattern) && (!diff || diff.includes(q.d)));
    const gens = Object.keys(QB.gens).filter((k) => { const [s, t, p] = k.split("/"); return ok(s, t, p); })
      .map((k) => { const [sec, topic, pattern] = k.split("/"); return { key: k, sec, topic, pattern, title: QB.gens[k].title || pattern }; });
    return { bank, gens };
  }

  /* ---------------------------------------------------------------- recording
     One call per answered question.  Saves once.  Wrong answer -> status "revise", due now.
     Right answer on a "revise" item -> spaced-repetition step (same maths as Store.review).  Always one activity bump. */
  const INTERVALS = [1, 3, 7, 14, 30, 60], DAY = 86400000;
  function record(q, chosen, seconds) {
    const S = root.Store;
    const ok = chosen === q.ans;
    if (!S || !S.load) return { ok, item: {} };
    const d = S.load(), k = itemKey(q), now = Date.now();
    const it = d.items[k] || {}, p = { n: (it.n || 0) + 1, c: (it.c || 0) + (ok ? 1 : 0), last: ok ? 1 : 0, updated: now };
    if (seconds != null && isFinite(seconds)) p.t = Math.round(seconds * 10) / 10;
    if (!ok) {
      Object.assign(p, { status: "revise", next: now, level: 0, doneAt: it.doneAt || now, lapses: (it.lapses || 0) + 1 });
    } else if (it.status === "revise") {
      const level = Math.min((it.level || 0) + 1, INTERVALS.length - 1);
      Object.assign(p, { level, next: now + INTERVALS[level] * DAY, lastReview: now, reviews: (it.reviews || 0) + 1, status: "done", doneAt: it.doneAt || now });
    }
    d.items[k] = Object.assign({}, it, p);
    const pk = "pat:" + patKey(q), pi = d.items[pk] || {};
    d.items[pk] = Object.assign({}, pi, { n: (pi.n || 0) + 1, c: (pi.c || 0) + (ok ? 1 : 0), ts: Math.round(((pi.ts || 0) + (seconds || 0)) * 10) / 10, seen: now, updated: now });
    S.bump();
    S.save();
    return { ok, item: d.items[k] };
  }

  /* ---------------------------------------------------------------- shared stimulus */
  const escH = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmtH = (t) => (typeof root.fmt === "function" ? root.fmt(t) : escH(t));
  // one passage paragraph: "- " / "• " lines become a list (puzzle clues), other single line breaks stay as line breaks
  const BULLET = /^\s*(?:[-•*]|\d+[.)])\s+/;
  function paraH(p) {
    const lines = p.trim().split(/\n/).map((l) => l.trim()).filter(Boolean);
    const items = lines.filter((l) => BULLET.test(l));
    if (items.length >= 2) {
      const lead = lines.filter((l) => !BULLET.test(l));
      return (lead.length ? "<p>" + lead.map(fmtH).join("<br>") + "</p>" : "") + '<ul class="pr-clues">' + items.map((l) => "<li>" + fmtH(l.replace(BULLET, "")) + "</li>").join("") + "</ul>";
    }
    // clues written on one line as "… - Divya sits … - Farhan …"
    const inline = p.trim().split(/\s+-\s+(?=[A-Z])/);
    if (inline.length >= 3 && /^-\s/.test(p.trim())) return '<ul class="pr-clues">' + inline.map((l) => "<li>" + fmtH(l.replace(/^-\s+/, "")) + "</li>").join("") + "</ul>";
    return "<p>" + lines.map(fmtH).join("<br>") + "</p>";
  }
  function setHTML(s) {
    if (typeof s === "string") s = QB.sets[s];
    if (!s) return "";
    let body;
    if (s.kind === "chart") body = typeof QB.chartHTML === "function" ? QB.chartHTML(s) : '<div class="pr-chart-ph">chart</div>';
    else if (s.kind === "html" || (s.html && s.text == null)) body = s.html || "";
    else body = String(s.text || "").split(/\n\s*\n/).map(paraH).join("");
    return (s.title ? "<h3>" + escH(s.title) + "</h3>" : "") + '<div class="pr-stim-body' + (s.kind === "passage" ? " passage" : "") + '">' + body + "</div>";
  }

  /* ---------------------------------------------------------------- inline quiz blocks (learn pages) */
  function quizHTML(ids) {
    const qs = (ids || []).map((id) => get(id)).filter(Boolean);
    if (!qs.length) return "";
    const L = "ABCD";
    return '<div class="qz">' + qs.map((q, n) =>
      '<div class="qz-q" data-id="' + escH(q.id) + '"><div class="qz-n">' + (n + 1) + '</div><div class="qz-body">' +
      '<div class="qz-text">' + fmtH(q.q) + "</div>" +
      '<div class="qz-opts">' + q.opts.map((o, i) => '<button type="button" class="qz-opt" data-i="' + i + '"><span class="k">' + L[i] + '</span><span class="v">' + fmtH(o) + "</span></button>").join("") + "</div>" +
      '<div class="qz-res" hidden></div></div></div>').join("") + "</div>";
  }

  Object.assign(QB, { rng, mulberry32: rng, options, money, num, pct, frac, gcd, lcm, round, make, fromId, get, itemKey, patKey, pool, record, setHTML, quizHTML });

  /* ---------------------------------------------------------------- DOM part (browser only) */
  if (typeof document !== "undefined") {
    const seen = new WeakSet();
    const watch = (el) => {
      if (seen.has(el) || !("IntersectionObserver" in root)) return;
      seen.add(el);
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.5 && !el._t0) { el._t0 = Date.now(); io.disconnect(); }
      }), { threshold: [0.5] });
      io.observe(el);
    };
    const scan = (n) => { if (n.nodeType !== 1) return; if (n.matches && n.matches(".qz-q")) watch(n); else if (n.querySelectorAll) n.querySelectorAll(".qz-q").forEach(watch); };
    new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach(scan))).observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener("DOMContentLoaded", () => scan(document.body));

    document.addEventListener("click", (e) => {
      const b = e.target.closest && e.target.closest(".qz-opt");
      if (!b) return;
      const box = b.closest(".qz-q");
      if (!box || box.dataset.done) return;
      const q = get(box.dataset.id);
      if (!q) return;
      box.dataset.done = "1";
      const i = +b.dataset.i, secs = box._t0 ? Math.min(300, Math.max(2, (Date.now() - box._t0) / 1000)) : null;
      const r = record(q, i, secs);
      box.querySelectorAll(".qz-opt").forEach((o, k) => {
        o.disabled = true;
        o.classList.toggle("ok", k === q.ans);
        o.classList.toggle("bad", k === i && i !== q.ans);
        o.classList.toggle("dim", k !== q.ans && k !== i);
      });
      const L = "ABCD";
      const sol = (q.sol || []).length ? '<ol class="qz-sol">' + q.sol.map((s) => "<li>" + fmtH(s) + "</li>").join("") + "</ol>" : "";
      const res = box.querySelector(".qz-res");
      res.className = "qz-res " + (r.ok ? "ok" : "bad");
      res.innerHTML = '<div class="qz-v">' + (r.ok ? "Correct" : "Not quite. The answer is " + L[q.ans] + ", " + fmtH(q.opts[q.ans])) + "</div>" + sol +
        (q.short ? '<div class="qz-short"><b>Shortcut</b> ' + fmtH(q.short) + "</div>" : "");
      res.hidden = false;
    });
  }
})();
