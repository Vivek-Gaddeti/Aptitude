/* home.js — the dashboard (index.html).
   One column, top to bottom: today (goal bar, the one big "start" button, streak) → "Up next" (continue learning,
   reviews, speed drill) → one card per section → weak patterns + why you miss → mock history → the year heatmap. Popovers: how-to (?), backup (gear: Export / Import / Reset), daily goal.
   Data: data/progress.js (PROGRESS: catalog, learn, qcount, gens), data/mocks.js (window.MOCKS, optional) and the Store:
   items q:* / g:* (n, c, t, why…), pat:<sec>/<topic>/<pattern> (n, c, ts, seen), learn topics <sec>:<topic> (status),
   activity (day → count), mocks[], meta.goal / meta.daily / meta.speed. Renders fine with an empty Store. */
(function () {
  const main = $("#content");
  const PR = window.PROGRESS || {};
  const CAT = PR.catalog || window.CATALOG;
  if (!main || !CAT) return;

  const ICON = (d, cls = "cat-ico") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const I = {
    walk: '<circle cx="13" cy="4.5" r="1.8"/><path d="M9 21l2.5-5.5L14 17.5V21M11.5 15.5l1-5.5-3.2 1.6L8 15M12.5 10l2.5 3 3 .6"/>',
    flame: '<path d="M12 22c4 0 7-2.7 7-6.8 0-3.6-2.4-6-4.6-8.7-.5 2.5-1.8 3.8-3.2 4.4C11.6 7.4 10 4.5 8 2c.3 3.6-3 6.2-3 11.2C5 18.6 8 22 12 22z"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>',
    pulse: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.6"/><path d="M12 17h.01"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/>',
    book: '<path d="M2.5 5.5h6.5a3 3 0 0 1 3 3V20a2.2 2.2 0 0 0-2.2-2.2H2.5z"/><path d="M21.5 5.5H15a3 3 0 0 0-3 3V20a2.2 2.2 0 0 1 2.2-2.2h7.3z"/>',
    repeat: '<path d="M4.5 11a7.5 7.5 0 0 1 13-4.2L19.5 9"/><path d="M19.5 4v5h-5"/><path d="M19.5 13a7.5 7.5 0 0 1-13 4.2L4.5 15"/><path d="M4.5 20v-5h5"/>',
    bolt: '<path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z"/>',
    alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.2h.01"/>',
    chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
    pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    bulb: '<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
  };
  const TARGET = { quant: 60, reasoning: 60, verbal: 50, di: 70 };   // rough seconds per question (bank averages), for "over target"
  const REASONS = [
    ["concept", "Concept", "Most misses are concept gaps. Reread the pattern card on the learn page (the method and the solved example), then drill that pattern again."],
    ["calc", "Calculation", "Most misses are calculation slips. Write one line of rough work per step, keep fractions instead of long decimals, and check the place value before you click."],
    ["misread", "Misread", "Most misses come from misreading. Before looking at the options, underline what is asked: the units, the word NOT, and \"approximately\"."],
    ["time", "Time pressure", "Time pressure is your top reason. On the first pass skip anything that runs past its target time and come back to it at the end."],
    ["guess", "Guessed", "Many answers are guesses. Cut two options first (wrong units, wrong size, wrong last digit), then back-solve from the options that are left."],
  ];
  let year = new Date().getFullYear(), pop = null;

  /* ---------- small helpers ---------- */
  const N = (n) => Number(n || 0).toLocaleString("en-IN");
  const pct = (x) => Math.round(x * 100) + "%";
  const mmss = (s) => { s = Math.round(s || 0); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
  const plural = (n, w) => `${N(n)} ${w}${n === 1 ? "" : "s"}`;
  const greet = () => { const h = new Date().getHours(); return h < 5 || h >= 22 ? "Late-night grind" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
  const goalOf = (d) => { const g = Math.round(+((d.meta || {}).goal)); return g >= 1 && g <= 500 ? g : 25; };
  const shortDate = (t) => new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const prettyId = (s) => String(s || "").replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());

  // titles for every section / topic / pattern
  const SEC = {}, TOPIC = {}, PAT = {};
  CAT.forEach((c) => {
    SEC[c.sec] = c;
    c.topics.forEach((t) => {
      TOPIC[c.sec + "/" + t.id] = t;
      (t.patterns || []).forEach((p) => (PAT[c.sec + "/" + t.id + "/" + p.id] = p.title));
    });
  });
  const hasQs = (sec, topic) => {                                      // does a topic have any bank questions or generators?
    const pre = sec + "/" + topic + "/";
    return Object.keys(PR.qcount || {}).some((k) => k.startsWith(pre)) || (PR.gens || []).some((k) => k.startsWith(pre));
  };

  /* ---------- everything the page shows ---------- */
  function model() {
    const d = Store.load(), items = d.items, meta = d.meta || {}, goal = goalOf(d);
    // per pattern / per section totals from the pat: items
    const pats = [], secs = {};
    CAT.forEach((c) => (secs[c.sec] = { n: 0, c: 0, ts: 0, topics: {} }));
    Object.keys(items).forEach((k) => {
      if (!k.startsWith("pat:")) return;
      const it = items[k] || {}, key = k.slice(4), [sec, topic, pattern] = key.split("/");
      if (!sec || !topic || !pattern || !(it.n > 0)) return;
      const n = it.n, c = Math.min(it.c || 0, n), ts = it.ts || 0;
      pats.push({ key, sec, topic, pattern, n, c, acc: c / n, avg: ts / n, tgt: TARGET[sec] || 60, seen: it.seen || 0 });
      const S = secs[sec];
      if (S) { S.n += n; S.c += c; S.ts += ts; const T = (S.topics[topic] = S.topics[topic] || { n: 0, c: 0 }); T.n += n; T.c += c; }
    });
    const tot = Object.values(secs).reduce((a, s) => ({ n: a.n + s.n, c: a.c + s.c, ts: a.ts + s.ts }), { n: 0, c: 0, ts: 0 });

    // weak patterns: 3+ answers, lowest accuracy first, then the slowest against the target
    const rated = pats.filter((p) => p.n >= 3);
    const weak = rated.filter((p) => p.acc < 0.85 || p.avg > p.tgt * 1.1)
      .sort((a, z) => a.acc - z.acc || (z.avg - z.tgt) - (a.avg - a.tgt) || z.n - a.n).slice(0, 6);

    // mistake reasons from the question items
    const why = {}; let wrongs = 0, tagged = 0;
    Object.keys(items).forEach((k) => {
      if (!/^(q|g):/.test(k)) return;
      const it = items[k] || {};
      if ((it.n || 0) > (it.c || 0)) wrongs++;
      if (it.why && REASONS.some((r) => r[0] === it.why)) { why[it.why] = (why[it.why] || 0) + 1; tagged++; }
    });

    // learn topics
    const learn = PR.learn || {};
    let nextLesson = null;
    const sections = CAT.map((c) => {
      const ready = new Set((learn[c.sec] || []).map((x) => x.id));
      const done = c.topics.filter((t) => (items[c.sec + ":" + t.id] || {}).status === "done").length;
      const nxt = c.topics.find((t) => ready.has(t.id) && (items[c.sec + ":" + t.id] || {}).status !== "done");
      if (nxt && !nextLesson) nextLesson = { sec: c.sec, short: c.short, title: nxt.title, group: nxt.group, href: c.page + "#" + nxt.id };
      const S = secs[c.sec];
      // where "Practise" goes: the weakest topic you have tried, else the first topic with questions
      const tried = Object.entries(S.topics).filter(([, v]) => v.n >= 3).sort(([, a], [, z]) => a.c / a.n - z.c / z.n)[0];
      const firstQ = c.topics.find((t) => hasQs(c.sec, t.id));
      const pTopic = tried ? tried[0] : firstQ ? firstQ.id : null;
      return { sec: c.sec, name: c.name, short: c.short, page: c.page, done, total: c.topics.length, ready: ready.size,
        n: S.n, c: S.c, avg: S.n ? S.ts / S.n : 0, tgt: TARGET[c.sec] || 60,
        learnHref: nxt ? c.page + "#" + nxt.id : c.page, learnLabel: nxt ? nxt.title : "",
        practiseHref: pTopic ? "practice.html#topic/" + c.sec + "/" + pTopic : "practice.html#setup" };
    });

    // up next
    const daily = meta.daily && meta.daily.date === today() && Array.isArray(meta.daily.ids) ? meta.daily : null;
    const speedBest = Object.entries((meta.speed && meta.speed.best) || {}).filter(([, v]) => isFinite(+v)).sort(([, a], [, z]) => z - a)[0] || null;
    const due = Object.values(items).filter((it) => Store.isDue(it)).length;

    // mocks
    const MK = Array.isArray(window.MOCKS) ? window.MOCKS : [];
    const mocks = (d.mocks || []).filter((m) => m && typeof m === "object").map((m) => {
      const preset = MK.find((p) => p.id === m.preset);
      const p = m.max > 0 ? (m.score || 0) / m.max : m.acc != null ? (m.acc > 1 ? m.acc / 100 : m.acc) : 0;
      return { id: m.id, name: m.name || (preset && preset.name) || "Mock test", at: m.at || 0, p, score: m.score, max: m.max, acc: m.acc };
    }).sort((a, z) => a.at - z.at);

    return { d, goal, todayN: d.activity[today()] || 0, streak: Store.streak(), best: Store.bestStreak(),
      tot, sections, weak, rated: rated.length, why, wrongs, tagged, nextLesson, daily, speedBest, due, mocks, presets: MK.length };
  }

  /* ---------- pieces ----------
     The page reads top to bottom: today (goal + one big start button) → up next → sections → weak spots → mocks → the year.
     One primary action per block; empty blocks say one line instead of filling space. */
  const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

  function hero(M) {
    const D = M.daily, dDone = D ? Math.min(D.idx || 0, D.ids.length) : 0, dFull = D && dDone >= D.ids.length;
    const left = Math.max(0, M.goal - M.todayN), done = M.todayN >= M.goal;
    const line = done ? "Goal done for today" : M.todayN ? `${plural(left, "question")} to go` : "Ready for today's set?";
    const cells = Math.min(M.goal, 30), on = Math.round(Math.min(1, M.todayN / M.goal) * cells);
    const cta = dFull ? { t: "Practise more", href: "practice.html#setup" }
      : D && dDone ? { t: `Continue set · ${dDone}/${D.ids.length}`, href: "practice.html#daily" }
      : { t: "Start today's set", href: "practice.html#daily" };
    const week = [];
    for (let i = 6; i >= 0; i--) { const t = Date.now() - i * 864e5; week.push({ l: DAYS[new Date(t).getDay()], on: (M.d.activity[today(t)] || 0) > 0, now: i === 0 }); }
    const T = M.tot;
    return `<section class="db-hero">
      <div class="db-hello">
        <div class="db-hello-top"><span class="db-tag">${greet()}</span>
          <span class="dash-tools">
            <button type="button" class="icon-btn" data-pop="help" aria-label="How to use this site" title="How to use this site">${ICON(I.help)}</button>
            <button type="button" class="icon-btn" data-pop="gear" aria-label="Backup, import or reset progress" title="Backup / import / reset">${ICON(I.gear)}</button></span></div>
        <h1 class="db-title">${line}</h1>
        <div class="db-goal">
          <div class="db-goal-h"><span>Today's goal</span><span class="db-mono"><b>${N(Math.min(M.todayN, 9999))}</b> / ${M.goal} questions</span></div>
          <div class="db-cells" role="img" aria-label="${M.todayN} of ${M.goal} questions today" style="--n:${cells}">${Array.from({ length: cells }, (_, i) => `<i${i < on ? ' class="on"' : ""}></i>`).join("")}</div>
        </div>
        <div class="db-actions">
          <a class="btn primary db-cta" href="${cta.href}">${cta.t} ${ICON(I.arrow)}</a>
          <button type="button" class="btn" data-pop="goal">Edit goal</button>
          ${T.n ? `<span class="db-mono db-overall">${N(T.n)} answered · ${pct(T.c / T.n)} right</span>` : ""}
        </div>
      </div>
      <div class="db-streak">
        <div class="db-streak-n"><b>${M.streak}</b><span>day streak</span></div>
        <span class="db-pill">Best · ${M.best}</span>
        <div class="db-week" aria-label="Last 7 days">${week.map((w) => `<span class="${w.on ? "on" : ""}${w.now ? " now" : ""}"><i></i>${w.l}</span>`).join("")}</div>
      </div>
    </section>`;
  }

  function upNext(M) {
    const L = M.nextLesson, sp = M.speedBest;
    const tiles = [
      { n: "01", kick: "Continue learning", t: L ? L.title : "All lessons learned", sub: L ? `${L.short} · ${L.group || "lesson"}` : "New lessons appear as they are written", href: L ? L.href : "quant.html", go: M.sections.some((x) => x.done) ? "Resume" : "Start" },
      { n: "02", kick: "Review", t: M.due ? plural(M.due, "item") + " due" : "All caught up", sub: M.due ? "Questions you missed, back on schedule" : "Missed questions come back here", href: "revision.html", go: M.due ? "Review" : "Open", hot: M.due > 0 },
      { n: "03", kick: "Speed drill", t: sp ? `Best · ${N(sp[1])}` : "60-second drill", sub: sp ? `Beat your ${esc(prettyId(sp[0]).toLowerCase())} score` : "Squares, %, fractions against the clock", href: "practice.html#speed", go: "Go" },
    ];
    return `<section class="db-box">
      <div class="db-box-h"><span class="db-label">${ICON(I.arrow)}Up next</span></div>
      <div class="db-next">${tiles.map((x) => `<a class="db-tile${x.hot ? " hot" : ""}" href="${x.href}">
        <span class="db-kick">${x.n} · ${x.kick}</span><b>${esc(x.t)}</b><span class="db-sub">${x.sub}</span>
        <span class="db-go">${x.go} ${ICON(I.arrow)}</span></a>`).join("")}</div>
    </section>`;
  }

  function sectionCards(M) {
    return `<section><h2 class="db-h2">Sections</h2><div class="db-secs">${M.sections.map((s) => {
      const acc = s.n ? s.c / s.n : 0, over = s.n && s.avg > s.tgt * 1.1;
      return `<article class="db-sec sc-${s.sec}">
        <div class="db-sec-h"><b>${esc(s.short)}</b><span class="db-pill">${s.total} topics</span></div>
        <div class="db-sec-b">
          <div class="db-sec-name">${esc(s.name)}</div>
          <div class="db-learned"><span>Learned</span><span class="db-mono">${s.done} / ${s.total}</span></div>
          <span class="db-bar"><span style="width:${s.total ? ((s.done / s.total) * 100).toFixed(1) : 0}%"></span></span>
          <div class="db-stats"><span><b>${s.n ? pct(acc) : "–"}</b><small>accuracy</small></span><span><b class="${over ? "over" : ""}">${s.n ? mmss(s.avg) : "–"}</b><small>per question</small></span></div>
          <div class="db-sec-btns"><a class="btn" href="${s.learnHref}" title="${s.learnLabel ? "Next lesson: " + esc(s.learnLabel) : "Open the " + esc(s.short) + " lessons"}">Learn</a><a class="btn db-dark" href="${s.practiseHref}">Practise</a></div>
        </div></article>`;
    }).join("")}</div></section>`;
  }

  function weakCard(M) {
    const head = `<div class="db-card-h dark"><span>${ICON(I.alert)}Weak patterns</span>${M.weak.length ? `<small>lowest first</small>` : ""}</div>`;
    if (!M.weak.length) return `<section class="db-card">${head}<p class="db-empty">${M.rated
      ? "Nothing weak right now: every pattern you have tried 3+ times is above 85% and on time."
      : "Answer 3 questions in a pattern and it gets rated here, weakest first, with a one-click drill."}</p></section>`;
    return `<section class="db-card">${head}${M.weak.slice(0, 5).map((p) => {
      const t = TOPIC[p.sec + "/" + p.topic];
      return `<div class="db-wk sc-${p.sec}"><i class="db-sq"></i>
        <span class="db-wk-n"><b>${esc(PAT[p.key] || prettyId(p.pattern))}</b><small>${esc(t ? t.title : prettyId(p.topic))} · ${p.c}/${p.n} right${p.avg > p.tgt ? " · slow" : ""}</small></span>
        <b class="db-mono db-wk-a">${pct(p.acc)}</b>
        <a class="btn sm db-yellow" href="practice.html#drill/${p.key.split("/").map(encodeURIComponent).join("/")}">Drill</a></div>`;
    }).join("")}</section>`;
  }

  function reasons(M) {
    const head = `<div class="db-card-h"><span>${ICON(I.bulb)}Why you miss</span>${M.tagged ? `<a class="small" href="revision.html">Mistake book</a>` : ""}</div>`;
    if (!M.tagged) return `<section class="db-card">${head}<p class="db-empty">${M.wrongs ? `${plural(M.wrongs, "wrong answer")}, none tagged yet.` : "No wrong answers yet."} After a miss, tap a reason (Concept, Calculation, Misread, Time, Guessed) to see your pattern here.</p></section>`;
    const rows = REASONS.map(([k, label, tip]) => ({ k, label, tip, n: M.why[k] || 0 })).sort((a, z) => z.n - a.n);
    return `<section class="db-card">${head}<div class="db-why">
      <div class="db-chips">${rows.map((r, i) => `<span class="db-chip${i === 0 ? " top" : ""}">${r.label} · ${r.n}</span>`).join("")}</div>
      <p class="db-tip">${rows[0].tip}</p></div></section>`;
  }

  function mockCard(M) {
    const head = `<div class="db-card-h"><span>${ICON(I.chart)}Mock tests</span><a class="small" href="mock.html">All mocks →</a></div>`;
    if (!M.mocks.length) return `<section class="db-card">${head}<div class="db-empty db-empty-row"><span>No mocks yet. A mock is a timed, company-style test${M.presets ? ` (${M.presets} formats)` : ""} with negative marking and a full analysis.</span>
      <a class="btn" href="mock.html">Take a mock ${ICON(I.arrow)}</a></div></section>`;
    const last = M.mocks.slice(-10), best = M.mocks.reduce((b, m) => (m.p > b.p ? m : b), M.mocks[0]);
    const L = M.mocks[M.mocks.length - 1], avg = M.mocks.reduce((s, m) => s + m.p, 0) / M.mocks.length;
    const sc = (m) => (m.max ? `${+(+m.score || 0).toFixed(2)} / ${m.max}` : pct(m.p));
    return `<section class="db-card">${head}
      <div class="db-mk" role="img" aria-label="Score of the last ${last.length} mocks">
        ${last.map((m) => { const v = Math.max(0, Math.min(1, m.p)); return `<span class="db-mk-c${m === L ? " last" : ""}" title="${esc(m.name)} · ${shortDate(m.at)} · ${sc(m)}">
          <small>${Math.round(m.p * 100)}%</small><i style="height:${Math.max(3, v * 100).toFixed(1)}%"></i><em>${shortDate(m.at)}</em></span>`; }).join("")}
      </div>
      <div class="db-card-f">Last: <b>${esc(L.name)}</b> · ${pct(Math.max(0, L.p))} &nbsp;·&nbsp; Best ${pct(Math.max(0, best.p))} &nbsp;·&nbsp; Average ${pct(Math.max(0, avg))} &nbsp;·&nbsp; ${plural(M.mocks.length, "mock")}</div>
    </section>`;
  }

  function heat(act, goal) {
    const thisYear = new Date().getFullYear();
    const years = [...new Set(Object.keys(act).filter((k) => act[k]).map((k) => +k.slice(0, 4)).concat(thisYear))].sort((a, z) => z - a);
    if (!years.includes(year)) year = thisYear;
    const first = new Date(year, 0, 1), start = new Date(year, 0, 1 - first.getDay()), tk = today();
    const cell = 11, step = 14, left = 28, top = 18;
    let s = "", total = 0, days = 0, months = "", lastM = -1;
    for (let w = 0; w < 54; w++) for (let dw = 0; dw < 7; dw++) {
      const t = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + dw);
      if (t.getFullYear() !== year) continue;
      const key = today(t.getTime()), v = act[key] || 0;
      if (v) { total += v; days++; }
      const lvl = v === 0 ? 0 : v < goal * 0.25 ? 1 : v < goal * 0.6 ? 2 : v < goal ? 3 : 4;
      s += `<rect class="hm-c l${lvl}${key > tk ? " fut" : ""}${key === tk ? " now" : ""}" x="${left + w * step}" y="${top + dw * step}" width="${cell}" height="${cell}" rx="2.5"><title>${t.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}: ${v} question${v === 1 ? "" : "s"}</title></rect>`;
      if (t.getDate() === 1 && t.getMonth() !== lastM) { lastM = t.getMonth(); months += `<text class="hm-m" x="${left + w * step}" y="11">${t.toLocaleString(undefined, { month: "short" })}</text>`; }
    }
    ["Mon", "Wed", "Fri"].forEach((l, i) => (s += `<text class="hm-m" x="0" y="${top + (1 + i * 2) * step + 9}">${l}</text>`));
    return { svg: `<div class="hm-scroll"><svg class="hm-svg" viewBox="0 0 ${left + 54 * step} ${top + 7 * step}" preserveAspectRatio="xMinYMin meet" role="img" aria-label="Activity in ${year}">${months}${s}</svg></div>`, total, days, years };
  }

  /* ---------- the page ---------- */
  function render() {
    const M = model(), H = heat(M.d.activity, M.goal);
    main.innerHTML = `<div class="db">
      ${hero(M)}
      ${upNext(M)}
      ${sectionCards(M)}
      <div class="db-two">${weakCard(M)}${reasons(M)}</div>
      ${mockCard(M)}
      <section class="db-card hm" id="hm">
        <div class="db-card-h"><span>${ICON(I.cal)}${plural(H.total, "question")} in ${year}</span>
          <span class="hm-stats"><span>Active days <b>${H.days}</b></span><span>Best streak <b>${M.best}</b></span>
          <select id="hmYear" aria-label="Year">${H.years.map((y) => `<option ${y === year ? "selected" : ""}>${y}</option>`).join("")}</select></span></div>
        <div class="db-hm-b">${H.svg}
        <div class="hm-foot"><span>Each square is a day. The darkest means you hit your goal of ${M.goal}.</span><span class="hm-legend">Less ${[0, 1, 2, 3, 4].map((l) => `<i class="l${l}"></i>`).join("")} More</span></div></div>
      </section>
    </div>
    <div class="dash-pop card" id="dashPop" hidden></div>`;
    const yr = $("#hmYear");
    if (yr) yr.onchange = () => { year = +yr.value; render(); };
    const sc = $(".hm-scroll");                                         // narrow screens: show the latest months first
    if (sc && sc.scrollWidth > sc.clientWidth) sc.scrollLeft = sc.scrollWidth;
  }

  /* ---------- popovers: how-to, backup, daily goal ---------- */
  function openPop(kind, btn) {
    const el = $("#dashPop");
    if (pop === kind) { closePop(); return; }
    pop = kind;
    const goal = goalOf(Store.load());
    if (kind === "help") el.innerHTML = `<div class="dash-h">How to use this site</div><ol class="clean">
        <li><strong>Quant, Reasoning, Verbal, DI</strong> hold the lessons: the idea, formulas, shortcuts and a card for every question pattern.</li>
        <li><strong>Practice</strong> serves one question at a time. Start with the <strong>daily set</strong>; every pattern also has a drill that gets harder as you improve.</li>
        <li>After a wrong answer, tag <strong>why</strong> you missed it. Missed questions come back in <strong>Revision</strong> after 1, 3, 7, 14, 30 and 60 days.</li>
        <li><strong>Mock tests</strong> copy the format of each company's test, with a timer and negative marking.</li>
        <li>Your goal is ${goal} questions a day (use <strong>Edit goal</strong> to change it). Streaks count every day you practise.</li></ol>
      <p class="small muted">Press <kbd>Ctrl</kbd> <kbd>K</kbd> to find anything, or <kbd>?</kbd> for all keyboard shortcuts.</p>`;
    else if (kind === "gear") el.innerHTML = `<div class="dash-h">Your progress</div><p class="small muted">Answers, mocks, notes and bookmarks are saved only in this browser. Export them now and then, and import the file on another device.</p>
         <div class="btn-row"><button type="button" class="btn primary" data-do="export">${icon("download")} Export</button><label class="btn">${icon("upload")} Import<input type="file" data-do="import" accept=".json,application/json" hidden></label><button type="button" class="btn on-red" data-do="reset">Reset</button></div>`;
    else el.innerHTML = `<div class="dash-h">Daily goal</div><p class="small muted">How many questions a day? Placement prep usually goes well at 20 to 40.</p>
         <div class="btn-row hm-goals">${[10, 15, 25, 40, 60].map((g) => `<button type="button" class="btn sm${g === goal ? " primary" : ""}" data-goal="${g}">${g}</button>`).join("")}</div>
         <form class="hm-goalform" data-goalform><label class="small muted" for="hmGoalIn">Custom</label><input id="hmGoalIn" type="number" min="1" max="500" step="1" value="${goal}"><button type="submit" class="btn sm primary">Save</button></form>`;
    const r = btn.getBoundingClientRect(), mr = main.getBoundingClientRect();
    el.style.top = r.bottom - mr.top + 8 + "px";
    // keep the popover inside the page: under its button, nudged left or right so it never runs off a phone screen
    const w = Math.min(360, mr.width - 16), want = kind === "goal" ? r.left - mr.left - 150 : r.right - mr.left - w;
    el.style.right = ""; el.style.width = w + "px";
    el.style.left = Math.max(8, Math.min(want, mr.width - w - 8)) + "px";
    el.hidden = false;
  }
  function closePop() { pop = null; const el = $("#dashPop"); if (el) el.hidden = true; }
  function setGoal(n) {
    n = Math.round(+n);
    if (!(n >= 1 && n <= 500)) { toast("Pick a goal between 1 and 500"); return; }
    const d = Store.load(); d.meta.goal = n; closePop(); Store.save(); toast(`Daily goal: ${n} questions`, 1800, "check");
  }
  function resetAll() {
    if (!confirm("Delete ALL progress, mocks, bookmarks, notes and question history in this browser? Export first if unsure.")) return;
    closePop(); Store.reset(); toast("Progress reset");
  }

  main.addEventListener("click", (e) => {
    const p = e.target.closest("[data-pop]");
    if (p) { e.stopPropagation(); openPop(p.dataset.pop, p); return; }
    const g = e.target.closest("[data-goal]");
    if (g) { setGoal(g.dataset.goal); return; }
    const doIt = e.target.closest("[data-do]");
    if (doIt && doIt.dataset.do === "export") Store.exportJSON();
    if (doIt && doIt.dataset.do === "reset") resetAll();
  });
  main.addEventListener("submit", (e) => { if (e.target.matches("[data-goalform]")) { e.preventDefault(); setGoal(e.target.querySelector("input").value); } });
  main.addEventListener("change", (e) => { if (e.target.matches('[data-do="import"]') && e.target.files[0]) { Store.importJSON(e.target.files[0]); closePop(); } });
  document.addEventListener("click", (e) => { if (pop && !e.target.closest("#dashPop")) closePop(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && pop) closePop(); });
  document.addEventListener("store:change", () => { if (!pop) render(); });   // goal, import, reset (and anything else that saves)

  /* ---------- styles for the pieces the shared dashboard CSS does not have ---------- */
  if (!document.getElementById("homeStyle")) {
    const st = document.createElement("style");
    st.id = "homeStyle";
    st.textContent = `
.sc-quant { --sc: #FF8AB0; } .sc-reasoning { --sc: #3DDC84; } .sc-verbal { --sc: #FFD23F; } .sc-di { --sc: #8EC5FF; }
.db { --ink-c: var(--ink, var(--text)); --bw-c: var(--bw, 2px); --sh-c: var(--sh, var(--shadow)); position: relative; display: flex; flex-direction: column; gap: 2.25rem; }
.db .db-mono { font-family: var(--mono); }
.db-h2 { margin: 0 0 1rem; }
.db-pill { font: 700 .72rem var(--mono); background: var(--panel); color: var(--text); border: 2px solid var(--ink-c); padding: .1rem .45rem; white-space: nowrap; }
.db-tag { font: 700 .74rem var(--mono); letter-spacing: .1em; text-transform: uppercase; background: var(--green-soft); color: var(--text); border: 2px solid var(--ink-c); padding: .15rem .55rem; }
/* hero: today */
.db-hero { display: flex; flex-wrap: wrap; gap: 1.5rem; }
.db-hello { flex: 999 1 460px; min-width: 0; background: var(--panel); border: var(--bw-c) solid var(--ink-c); box-shadow: var(--sh-c); padding: 1.4rem 1.5rem; display: flex; flex-direction: column; gap: 1.1rem; }
.db-hello-top { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.db-title { margin: 0 !important; font-size: clamp(1.9rem, 4.2vw, 3rem) !important; line-height: 1 !important; border: 0; padding: 0; }
.db-goal { border-top: var(--bw-c) dashed var(--ink-c); padding-top: 1rem; display: flex; flex-direction: column; gap: .55rem; }
.db-goal-h { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; font: 800 .85rem var(--display); text-transform: uppercase; }
.db-goal-h .db-mono { font-weight: 400; text-transform: none; font-size: .85rem; } .db-goal-h b { font-size: 1.3rem; }
.db-cells { display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); gap: 3px; border: var(--bw-c) solid var(--ink-c); padding: 4px; background: var(--panel); }
.db-cells i { height: 22px; background: var(--accent-soft); }
.db-cells i.on { background: var(--accent); }
.db-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; }
.db-cta { font-size: 1rem !important; padding: .7rem 1.3rem !important; min-height: 48px; display: inline-flex; align-items: center; gap: .5rem; }
.db-cta .cat-ico { width: 18px; height: 18px; }
.db-overall { font-size: .8rem; color: var(--muted); margin-left: auto; }
.db-streak { flex: 1 1 250px; background: var(--f-yellow, #FFD23F); color: #22121A; border: var(--bw-c) solid var(--ink-c); box-shadow: var(--sh-c); padding: 1.3rem 1.4rem; display: flex; flex-direction: column; gap: .9rem; position: relative; }
.db-streak .db-pill { position: absolute; top: 1.2rem; right: 1.2rem; background: #fff; color: #22121A; border-color: #22121A; }
.db-streak-n b { display: block; font: 900 4.6rem/0.85 var(--display); }
.db-streak-n span { font: 800 .9rem var(--display); text-transform: uppercase; }
.db-week { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px; margin-top: auto; }
.db-week span { display: flex; flex-direction: column; align-items: center; gap: 3px; font: 700 .72rem var(--mono); }
.db-week i { width: 100%; aspect-ratio: 1; border: 3px solid #22121A; background: #fff; }
.db-week .on i { background: #22121A; }
.db-week .now i { box-shadow: 0 0 0 2px #fff, 0 0 0 4px #22121A; }
/* boxed panels with a label tab */
.db-box, .db-card { background: var(--panel); border: var(--bw-c) solid var(--ink-c); box-shadow: var(--sh-c); min-width: 0; }
.db-box-h { padding: .8rem 1rem; border-bottom: var(--bw-c) solid var(--ink-c); background: var(--accent-soft); }
.db-label { display: inline-flex; align-items: center; gap: .45rem; background: var(--accent); color: #fff; border: var(--bw-c) solid var(--ink-c); padding: .3rem .75rem; font: 900 .95rem var(--display); text-transform: uppercase; letter-spacing: .03em; }
[data-theme="dark"] .db-label { color: #22121A; }
.db-label .cat-ico { width: 16px; height: 16px; }
.db-next { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.db-tile { display: flex; flex-direction: column; gap: .35rem; padding: 1.1rem 1.2rem 1rem; color: var(--text) !important; text-decoration: none !important; border-right: var(--bw-c) solid var(--ink-c); margin-right: calc(-1 * var(--bw-c)); transition: background .15s; }
.db-tile:hover { background: var(--f-yellow, #FFD23F) !important; color: #22121A !important; }
.db-tile.hot { background: var(--accent-soft); }
.db-kick { font: 700 .72rem var(--mono); text-transform: uppercase; letter-spacing: .05em; }
.db-tile b { font: 900 1.25rem/1.1 var(--display); text-transform: uppercase; }
.db-sub { font-size: .86rem; color: var(--muted); }
.db-tile:hover .db-sub { color: #22121A; }
.db-go { margin-top: auto; padding-top: .5rem; display: inline-flex; align-items: center; gap: .35rem; font: 900 .82rem var(--display); text-transform: uppercase; }
.db-go .cat-ico { width: 15px; height: 15px; transition: transform .15s; }
.db-tile:hover .db-go .cat-ico { transform: translateX(3px); }
/* sections */
.db-secs { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.4rem; }
.db-sec { background: var(--panel); border: var(--bw-c) solid var(--ink-c); box-shadow: var(--sh-c); display: flex; flex-direction: column; }
.db-sec-h { background: var(--sc); color: #22121A; border-bottom: var(--bw-c) solid var(--ink-c); padding: .7rem .9rem; display: flex; justify-content: space-between; align-items: center; gap: .5rem; }
.db-sec-h b { font: 900 1.3rem var(--display); text-transform: uppercase; }
.db-sec-h .db-pill { background: #fff; color: #22121A; border-color: #22121A; }
.db-sec-b { padding: .9rem; display: flex; flex-direction: column; gap: .65rem; flex: 1; }
.db-sec-name { font-size: .88rem; color: var(--muted); }
.db-learned { display: flex; justify-content: space-between; font: 800 .78rem var(--display); text-transform: uppercase; }
.db-bar { display: block; height: 14px; border: 2px solid var(--ink-c); background: var(--panel); }
.db-bar > span { display: block; height: 100%; background: var(--ink-c); }
.db-stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .5rem; }
.db-stats > span { border: 2px solid var(--ink-c); padding: .45rem .55rem; display: flex; flex-direction: column; }
.db-stats b { font: 900 1.3rem var(--display); font-variant-numeric: tabular-nums; }
.db-stats b.over { color: var(--amber); }
.db-stats small { font: 400 .7rem var(--mono); color: var(--muted); }
.db-sec-btns { display: flex; gap: .6rem; margin-top: auto; padding-top: .2rem; }
.db-sec-btns .btn { flex: 1; justify-content: center; text-align: center; min-height: 42px; }
.btn.db-dark { background: var(--ink-c); color: var(--bg); box-shadow: 3px 3px 0 var(--sc); }
.btn.db-dark:hover { background: var(--ink-c); color: var(--bg); box-shadow: 5px 5px 0 var(--sc); }
.btn.db-yellow { background: var(--f-yellow, #FFD23F); color: #22121A; }
/* cards */
.db-two { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; align-items: start; }
.db-card-h { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: .5rem 1rem; padding: .75rem 1rem; border-bottom: var(--bw-c) solid var(--ink-c); }
.db-card-h > span:first-child { display: inline-flex; align-items: center; gap: .5rem; font: 900 1rem var(--display); text-transform: uppercase; }
.db-card-h .cat-ico { width: 18px; height: 18px; }
.db-card-h small { font: 400 .78rem var(--mono); }
.db-card-h a { font: 700 .8rem var(--mono); }
.db-card-h.dark { background: var(--ink-c); color: var(--bg); }
.db-card-h.dark .cat-ico { color: var(--f-yellow, #FFD23F); }
.db-empty { margin: 0; padding: 1.1rem 1rem; color: var(--muted); font-size: .92rem; line-height: 1.5; }
.db-empty-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; }
.db-empty-row span { flex: 1 1 320px; }
.db-wk { display: flex; align-items: center; gap: .75rem; padding: .7rem 1rem; border-bottom: 2px solid var(--ink-c); }
.db-wk:last-child { border-bottom: 0; }
.db-sq { width: 13px; height: 13px; flex: none; background: var(--sc); border: 2px solid var(--ink-c); }
.db-wk-n { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.db-wk-n b { font-weight: 800; font-size: .95rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.db-wk-n small { font: 400 .74rem var(--mono); color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.db-wk-a { font-size: 1.05rem; }
.db-why { padding: 1rem; display: flex; flex-direction: column; gap: .8rem; }
.db-chips { display: flex; flex-wrap: wrap; gap: .45rem; }
.db-chip { border: 2px solid var(--ink-c); padding: .2rem .6rem; font-weight: 700; font-size: .84rem; }
.db-chip.top { background: var(--f-pink, #FF8AB0); color: #22121A; }
.db-tip { margin: 0; font-size: .92rem; line-height: 1.5; border-top: 2px dashed var(--ink-c); padding-top: .75rem; }
/* mock bars */
.db-mk { display: flex; align-items: flex-end; gap: clamp(6px, 1.4vw, 16px); height: 200px; padding: 1.2rem 1rem 1.8rem; background-image: linear-gradient(color-mix(in srgb, var(--ink-c) 12%, transparent) 2px, transparent 2px); background-size: 100% 25%; background-origin: content-box; }
.db-mk-c { position: relative; flex: 1; max-width: 64px; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 4px; }
.db-mk-c small { font: 700 .72rem var(--mono); }
.db-mk-c i { width: 100%; background: var(--accent-soft); border: 2px solid var(--ink-c); }
.db-mk-c.last i { background: var(--accent); }
.db-mk-c em { position: absolute; bottom: -1.4rem; font: 400 .66rem var(--mono); font-style: normal; color: var(--muted); white-space: nowrap; }
.db-card-f { padding: .75rem 1rem; border-top: 2px dashed var(--ink-c); font-size: .88rem; }
/* heatmap */
.db .hm-stats { display: flex; flex-wrap: wrap; align-items: center; gap: .4rem 1rem; font-size: .82rem; }
.db .hm-stats select { padding: .2rem .5rem; }
.db-hm-b { padding: 1rem; }
/* popovers + goal form */
.hm-goals { margin: .7rem 0 .6rem; } .hm-goals .btn { min-width: 2.8rem; justify-content: center; }
.hm-goalform { display: flex; align-items: center; gap: .5rem; }
.hm-goalform input { width: 5.5rem; padding: .3rem .5rem; background: var(--panel); color: var(--text); font: 600 var(--fs-sm) var(--mono); }
.text-strong { color: var(--text); }
@media (max-width: 600px) {
  .db { gap: 1.6rem; }
  .db-hello, .db-streak { padding: 1rem; }
  .db-streak-n b { font-size: 3.6rem; }
  .db-cells i { height: 16px; }
  .db-overall { margin-left: 0; width: 100%; }
  .db-tile { border-right: 0; margin-right: 0; border-bottom: var(--bw-c) solid var(--ink-c); }
  .db-tile:last-child { border-bottom: 0; }
}
`;
    document.head.appendChild(st);
  }

  render();
})();
