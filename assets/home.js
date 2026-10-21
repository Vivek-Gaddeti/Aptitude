/* home.js — the dashboard (index.html).
   Left column: hello + today's goal ring (editable goal), streaks, an accuracy gauge, mistake reasons.
   Main column: "Up next" (daily set, continue learning, due reviews, speed drill), one card per section, weak patterns,
   mock history, the year heatmap. Popovers: how-to (?), backup (gear: Export / Import / Reset), daily goal.
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
  const ring = (frac, cls) => `<circle class="${cls}" cx="29" cy="29" r="24" pathLength="100" stroke-dasharray="${Math.max(0, Math.min(100, frac * 100)).toFixed(1)} 100"/>`;
  const accTone = (a) => (a < 0.5 ? "red" : a < 0.75 ? "amber" : "green");
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

  /* ---------- pieces ---------- */
  function hello(M) {
    const frac = Math.min(1, M.todayN / M.goal), left = Math.max(0, M.goal - M.todayN);
    const line = M.todayN >= M.goal ? "Goal done for today. Nice work!" : M.todayN ? `${plural(left, "question")} to go today.` : "Ready for today's session?";
    return `<section class="card dash-card dash-hello">
      <span class="dash-mascot">${ICON(I.walk)}</span>
      <div class="flex-1"><div class="small muted">${greet()}</div><div class="dash-hello-t">${line}</div></div>
      <button type="button" class="dash-goal hm-goalbtn" data-pop="goal" title="Today: ${M.todayN} of ${M.goal} questions. Click to change the daily goal." aria-label="Today ${M.todayN} of ${M.goal} questions. Change daily goal">
        <svg viewBox="0 0 58 58" aria-hidden="true">${ring(1, "goal-track")}${frac > 0 ? ring(frac, "goal-arc") : ""}</svg>
        <div><b>${Math.min(M.todayN, M.goal)}/${M.goal}</b><span>today</span></div>
        <i class="hm-goaledit">${ICON(I.pencil)}</i></button>
    </section>`;
  }

  function streaks(M) {
    return `<div class="dash-pair">
      <section class="card dash-card"><div class="small muted">Current streak</div><div class="dash-big">${ICON(I.flame, "cat-ico ico-amber")}<span class="stat">${plural(M.streak, "day")}</span></div></section>
      <section class="card dash-card"><div class="small muted">Best streak</div><div class="dash-big">${ICON(I.trophy, "cat-ico ico-amber")}<span class="stat">${plural(M.best, "day")}</span></div></section>
    </div>`;
  }

  function gauge(M) {
    const T = M.tot, acc = T.n ? T.c / T.n : 0, len = acc * 75;
    const tone = T.n ? `var(--${accTone(acc)})` : "var(--muted)";
    return `<section class="card dash-card"><div class="dash-h">${ICON(I.target, "cat-ico ico-green")}Accuracy</div>
      <div class="dash-gauge-row"><div class="rm-diff">
        <div><span class="text-accent">Answered</span><b>${N(T.n)}</b></div>
        <div><span class="text-green">Correct</span><b>${N(T.c)}</b></div>
        <div><span class="text-amber">Avg time</span><b>${T.n ? mmss(T.ts / T.n) : "-"}</b></div></div>
      <div class="rm-gauge"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="g-track" cx="60" cy="60" r="48" pathLength="100"/>${T.n ? `<circle class="g-arc" cx="60" cy="60" r="48" pathLength="100" style="stroke:${tone};stroke-dasharray:${len.toFixed(2)} 100"/>` : ""}</svg>
        <div class="rm-gauge-t"><b class="stat">${T.n ? Math.round(acc * 100) + "<small>%</small>" : "-"}</b><span>${T.n ? "overall" : "no answers yet"}</span></div></div></div></section>`;
  }

  function reasons(M) {
    const head = `<div class="dash-h">${ICON(I.alert, "cat-ico ico-red")}Why you miss</div>`;
    if (!M.tagged) return `<section class="card dash-card">${head}
      <p class="small muted dash-due">${M.wrongs ? `You have ${plural(M.wrongs, "wrong answer")} but none tagged yet.` : "No wrong answers yet."} After a wrong answer, tap a reason chip (Concept, Calculation, Misread, Time, Guessed) and the split shows up here with a tip.</p></section>`;
    const rows = REASONS.map(([k, label]) => ({ k, label, n: M.why[k] || 0 }));
    const top = rows.slice().sort((a, z) => z.n - a.n)[0], max = Math.max(...rows.map((r) => r.n));
    return `<section class="card dash-card">${head}
      <div class="hm-mr">${rows.map((r) => `<div class="hm-mr-row${r.k === top.k ? " top" : ""}"><span>${r.label}</span>
        <span class="hm-bar"><span style="width:${max ? ((r.n / max) * 100).toFixed(1) : 0}%"></span></span><b>${pct(r.n / M.tagged)}</b></div>`).join("")}</div>
      <p class="small hm-tip">${ICON(I.bulb, "cat-ico ico-amber")}<span>${REASONS.find((r) => r[0] === top.k)[2]}</span></p>
      <div class="small muted">${plural(M.tagged, "tagged mistake")}${M.wrongs > M.tagged ? ` · ${N(M.wrongs - M.tagged)} untagged` : ""} · <a href="revision.html">Open the mistake book</a></div></section>`;
  }

  function upNext(M) {
    const D = M.daily, dDone = D ? Math.min(D.idx || 0, D.ids.length) : 0;
    const dailySub = D ? (dDone >= D.ids.length ? "Done for today. Come back tomorrow." : `${dDone} of ${D.ids.length} answered. Pick up where you left off.`)
      : "20 questions: your weak patterns, due reviews and new ones.";
    const L = M.nextLesson;
    const sp = M.speedBest;
    const tiles = [
      { cls: "main", ic: I.cal, kick: "Daily set", t: D && dDone >= D.ids.length ? "Daily set done" : D && dDone ? "Continue the daily set" : "Start today's set", sub: dailySub, href: "practice.html#daily" },
      { ic: I.book, kick: "Continue learning", t: L ? L.title : "All written lessons learned", sub: L ? `${L.short} · ${L.group || "lesson"}` : "New lessons appear as they are written.", href: L ? L.href : "quant.html" },
      { ic: I.repeat, kick: "Due for review", t: M.due ? plural(M.due, "item") + " due" : "All caught up", sub: M.due ? "Questions you missed and topics to revise." : "Nothing is waiting. Missed questions come back here.", href: "revision.html", badge: M.due ? `<span class="badge purple">${M.due > 99 ? "99+" : M.due}</span>` : "" },
      { ic: I.bolt, kick: "Speed drill", t: sp ? `Best: ${N(sp[1])}` : "60-second drill", sub: sp ? `Personal best (${esc(prettyId(sp[0]).toLowerCase())}). Beat it.` : "Squares, percentages, fractions and tables against the clock.", href: "practice.html#speed" },
    ];
    return `<section><h2 class="dash-h2">Up next</h2><div class="hm-next">${tiles.map((x) => `<a class="card hm-tile${x.cls ? " " + x.cls : ""}" href="${x.href}">
      <span class="hm-tile-ic">${ICON(x.ic)}</span>
      <span class="hm-tile-b"><span class="dash-kicker">${x.kick}</span><b>${esc(x.t)}</b><span class="small muted">${x.sub}</span></span>
      ${x.badge || ""}<span class="hm-tile-go">${ICON(I.arrow)}</span></a>`).join("")}</div></section>`;
  }

  function sectionCards(M) {
    return `<section><h2 class="dash-h2">Sections</h2><div class="dash-courses hm-secs">${M.sections.map((s) => {
      const acc = s.n ? s.c / s.n : 0, over = s.n && s.avg > s.tgt * 1.1;
      return `<div class="card dash-course hm-sec sc-${s.sec}">
        <span class="dash-kicker hm-sc">${esc(s.short)}</span>
        <b class="dash-course-t">${esc(s.name)}</b>
        <span class="hm-stats3">
          <span><b>${N(s.n)}</b><small>answered</small></span>
          <span><b class="${s.n ? "text-" + accTone(acc) : ""}">${s.n ? pct(acc) : "-"}</b><small>accuracy</small></span>
          <span><b class="${over ? "text-amber" : ""}">${s.n ? mmss(s.avg) : "-"}</b><small>avg / q</small></span></span>
        <span class="row-between small"><span class="muted">Topics learned</span><span class="ct-n">${s.done} / ${s.total}</span></span>
        <span class="ct-bar hm-scbar"><span style="width:${s.total ? ((s.done / s.total) * 100).toFixed(1) : 0}%"></span></span>
        <span class="hm-sec-btns"><a class="btn sm primary hm-scbtn" href="${s.practiseHref}">Practise</a><a class="btn sm" href="${s.learnHref}" title="${s.learnLabel ? "Next lesson: " + esc(s.learnLabel) : "Open the " + esc(s.short) + " lessons"}">Learn</a></span>
      </div>`;
    }).join("")}</div></section>`;
  }

  function weakCard(M) {
    const head = `<div class="row-between"><div class="dash-h">${ICON(I.target, "cat-ico ico-red")}Weak patterns</div>${M.weak.length ? `<span class="small muted">lowest accuracy first</span>` : ""}</div>`;
    if (!M.weak.length) {
      const msg = M.rated ? `No weak patterns right now: every pattern you have answered 3+ times is above 85% and on time. Keep the daily set going.`
        : "Not enough data yet. Answer at least 3 questions in a pattern and it is rated here, weakest first, with a one-click drill.";
      return `<section class="card dash-card">${head}<div class="hm-empty">${ICON(M.rated ? I.trophy : I.chart, "cat-ico")}<p class="small muted">${msg}</p>
        <a class="btn primary" href="practice.html#daily">Start the daily set ${ICON(I.arrow)}</a></div></section>`;
    }
    return `<section class="card dash-card">${head}<div class="hm-weak">${M.weak.map((p) => {
      const t = TOPIC[p.sec + "/" + p.topic], over = p.avg > p.tgt;
      return `<div class="hm-wk sc-${p.sec}">
        <span class="hm-wk-n"><b>${esc(PAT[p.key] || prettyId(p.pattern))}</b><small><i class="hm-dot"></i>${esc((SEC[p.sec] || {}).short || p.sec)} · ${esc(t ? t.title : prettyId(p.topic))} · ${p.c}/${p.n} right</small></span>
        <span class="hm-wk-a"><span class="hm-bar ${accTone(p.acc)}"><span style="width:${Math.max(3, p.acc * 100).toFixed(1)}%"></span></span><b class="text-${accTone(p.acc)}">${pct(p.acc)}</b></span>
        <span class="hm-wk-t${over ? " over" : ""}" title="Average time per question vs the rough target">${mmss(p.avg)}<small> / ${mmss(p.tgt)}</small></span>
        <a class="btn sm hm-wk-go" href="practice.html#drill/${p.key.split("/").map(encodeURIComponent).join("/")}">Drill</a></div>`;
    }).join("")}</div></section>`;
  }

  function mockCard(M) {
    const head = `<div class="row-between"><div class="dash-h">${ICON(I.chart, "cat-ico ico-green")}Mock tests</div><a class="small fw-700" href="mock.html">All mocks</a></div>`;
    if (!M.mocks.length) return `<section class="card dash-card">${head}<div class="hm-empty">${ICON(I.trophy, "cat-ico")}
      <p class="small muted">No mocks yet. A mock is a timed, exam-style test${M.presets ? ` (${M.presets} formats, from TCS NQT-style to a quick 15)` : ""} with negative marking and a full analysis at the end.</p>
      <a class="btn primary" href="mock.html">Take your first mock ${ICON(I.arrow)}</a></div></section>`;
    const last = M.mocks.slice(-10), best = M.mocks.reduce((b, m) => (m.p > b.p ? m : b), M.mocks[0]);
    const L = M.mocks[M.mocks.length - 1], prev = M.mocks[M.mocks.length - 2];
    const avg = M.mocks.reduce((s, m) => s + m.p, 0) / M.mocks.length, delta = prev ? Math.round((L.p - prev.p) * 100) : null;
    const sc = (m) => (m.max ? `${+(+m.score || 0).toFixed(2)} / ${m.max}` : pct(m.p));
    return `<section class="card dash-card">${head}
      <div class="hm-mstats">
        <span><b>${M.mocks.length}</b><small>taken</small></span>
        <span><b class="text-green">${pct(Math.max(0, best.p))}</b><small>best</small></span>
        <span><b>${pct(Math.max(0, L.p))}${delta != null && delta !== 0 ? ` <em class="${delta > 0 ? "text-green" : "text-red"}">${delta > 0 ? "+" : ""}${delta}</em>` : ""}</b><small>last</small></span>
        <span><b>${pct(Math.max(0, avg))}</b><small>average</small></span></div>
      <div class="hm-mk" role="img" aria-label="Score of the last ${last.length} mocks">
        <span class="hm-mk-grid"><i style="bottom:100%"><em>100</em></i><i style="bottom:50%"><em>50</em></i><i style="bottom:0"><em>0</em></i></span>
        ${last.map((m) => { const v = Math.max(0, Math.min(1, m.p)); return `<span class="hm-mk-c${m === best ? " best" : ""}" title="${esc(m.name)} · ${shortDate(m.at)} · ${sc(m)} (${pct(m.p)})">
          <span class="hm-mk-v">${Math.round(m.p * 100)}</span><span class="hm-mk-f" style="height:${Math.max(2, v * 100).toFixed(1)}%"></span><span class="hm-mk-d">${shortDate(m.at)}</span></span>`; }).join("")}
      </div>
      <div class="small muted hm-mbest">${ICON(I.trophy, "cat-ico ico-amber")}<span>Best: <b class="text-strong">${esc(best.name)}</b> on ${new Date(best.at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}, ${sc(best)}</span></div>
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
    main.innerHTML = `
      <div class="dash-top">
        <h1 class="dash-title">Dashboard</h1>
        <div class="dash-tools">
          <button type="button" class="icon-btn" data-pop="help" aria-label="How to use this site" title="How to use this site">${ICON(I.help)}</button>
          <button type="button" class="icon-btn" data-pop="gear" aria-label="Backup, import or reset progress" title="Backup / import / reset">${ICON(I.gear)}</button>
        </div>
      </div>
      <div class="dash">
        <aside class="dash-left">
          ${hello(M)}
          ${streaks(M)}
          ${gauge(M)}
          ${reasons(M)}
        </aside>
        <div class="dash-main">
          ${upNext(M)}
          ${sectionCards(M)}
          ${weakCard(M)}
          ${mockCard(M)}
          <section class="card dash-card hm" id="hm">
            <div class="hm-head"><b>${ICON(I.pulse, "cat-ico ico-green")}${plural(H.total, "question")} in ${year}</b>
              <span class="hm-stats"><span>Active days <b>${H.days}</b></span><span>Current streak <b>${M.streak}</b></span><span>Max streak <b>${M.best}</b></span>
              <select id="hmYear" aria-label="Year">${H.years.map((y) => `<option ${y === year ? "selected" : ""}>${y}</option>`).join("")}</select></span></div>
            ${H.svg}
            <div class="hm-foot"><span>Each square is a day; the darkest green means you hit your goal of ${M.goal}.</span><span class="hm-legend">Less ${[0, 1, 2, 3, 4].map((l) => `<i class="l${l}"></i>`).join("")} More</span></div>
          </section>
        </div>
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
        <li>Your goal is ${goal} questions a day (click the ring to change it). Streaks count every day you practise.</li></ol>
      <p class="small muted">Press <kbd>Ctrl</kbd> <kbd>K</kbd> to find anything, or <kbd>?</kbd> for all keyboard shortcuts.</p>`;
    else if (kind === "gear") el.innerHTML = `<div class="dash-h">Your progress</div><p class="small muted">Answers, mocks, notes and bookmarks are saved only in this browser. Export them now and then, and import the file on another device.</p>
         <div class="btn-row"><button type="button" class="btn primary" data-do="export">${icon("download")} Export</button><label class="btn">${icon("upload")} Import<input type="file" data-do="import" accept=".json,application/json" hidden></label><button type="button" class="btn on-red" data-do="reset">Reset</button></div>`;
    else el.innerHTML = `<div class="dash-h">Daily goal</div><p class="small muted">How many questions a day? Placement prep usually goes well at 20 to 40.</p>
         <div class="btn-row hm-goals">${[10, 15, 25, 40, 60].map((g) => `<button type="button" class="btn sm${g === goal ? " primary" : ""}" data-goal="${g}">${g}</button>`).join("")}</div>
         <form class="hm-goalform" data-goalform><label class="small muted" for="hmGoalIn">Custom</label><input id="hmGoalIn" type="number" min="1" max="500" step="1" value="${goal}"><button type="submit" class="btn sm primary">Save</button></form>`;
    const r = btn.getBoundingClientRect(), mr = main.getBoundingClientRect();
    el.style.top = r.bottom - mr.top + 8 + "px";
    if (kind === "goal") { el.style.right = ""; el.style.left = Math.max(0, Math.min(r.left - mr.left - 150, mr.width - Math.min(360, mr.width))) + "px"; }
    else { el.style.left = ""; el.style.right = mr.right - r.right + "px"; }
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
.sc-quant { --sc: #1fae7a; --si: #177f59; } .sc-reasoning { --sc: #8b6cf0; --si: #785dce; } .sc-verbal { --sc: #e2609a; --si: #b34c7a; } .sc-di { --sc: #22a3b6; --si: #197a88; }
[data-theme="dark"] .sc-quant { --si: #2fc28d; } [data-theme="dark"] .sc-reasoning { --si: #9d84f3; } [data-theme="dark"] .sc-verbal { --si: #e874a8; } [data-theme="dark"] .sc-di { --si: #33b5c8; }
.text-strong { color: var(--text); }
.dash-left > .card, .dash-main > .card { margin: 0; }
button.hm-goalbtn { border: 0; padding: 0; background: none; color: inherit; font: inherit; cursor: pointer; border-radius: 50%; }
.hm-goalbtn:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.hm-goaledit { position: absolute; right: -4px; bottom: -4px; width: 20px; height: 20px; display: grid; place-items: center; border-radius: 50%; background: var(--panel); border: 1px solid var(--border); color: var(--muted); opacity: .85; transition: color .3s ease, border-color .3s ease; }
.hm-goaledit .cat-ico { width: 11px; height: 11px; }
.hm-goalbtn:hover .hm-goaledit { color: var(--accent); border-color: var(--accent); }
.hm-goals { margin: .7rem 0 .6rem; } .hm-goals .btn { min-width: 2.8rem; justify-content: center; }
.hm-goalform { display: flex; align-items: center; gap: .5rem; }
.hm-goalform input { width: 5.5rem; padding: .3rem .5rem; border: 1px solid var(--border); border-radius: var(--r-sm); background: var(--panel); color: var(--text); font: 600 var(--fs-sm) var(--mono); }
.hm-goalform input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
.rm-gauge-t b small { font: 700 var(--fs-md) var(--display); color: var(--muted); }
/* up next */
.hm-next { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: var(--sp-3); }
.hm-tile { display: flex; align-items: center; gap: .85rem; padding: .95rem 1.05rem; color: var(--text); text-decoration: none !important; transition: border-color .3s ease, transform .3s cubic-bezier(.22,1,.36,1); }
.hm-tile:hover { border-color: color-mix(in srgb, var(--accent) 45%, var(--border)); }
:root[data-anim="on"] .hm-tile:hover { transform: translateY(-1px); }
.hm-tile-ic { display: grid; place-items: center; width: 40px; height: 40px; flex: none; border-radius: 12px; background: var(--panel-2); color: var(--accent); }
.hm-tile-ic .cat-ico { width: 20px; height: 20px; }
.hm-tile.main { background: color-mix(in srgb, var(--accent-soft) 70%, var(--panel)); border-color: color-mix(in srgb, var(--accent) 30%, var(--border)); }
.hm-tile.main .hm-tile-ic { background: var(--accent); color: #fff; }
.hm-tile-b { display: flex; flex-direction: column; gap: .1rem; min-width: 0; flex: 1; }
.hm-tile-b b { font: 800 var(--fs-md) var(--display); line-height: 1.3; }
.hm-tile-b .small { line-height: 1.4; font-size: var(--fs-xs); }
.hm-tile-go { color: var(--muted); flex: none; } .hm-tile-go .cat-ico { width: 16px; height: 16px; }
.hm-tile:hover .hm-tile-go { color: var(--accent); }
/* section cards */
.hm-secs { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
.hm-sec { border-top: 3px solid var(--sc); gap: .55rem; }
.hm-sc { color: var(--si); }
.hm-stats3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .3rem; padding: .55rem 0; border-block: 1px dashed var(--border); }
.hm-stats3 > span { display: flex; flex-direction: column; min-width: 0; }
.hm-stats3 b { font: 800 var(--fs-lg) var(--display); font-variant-numeric: tabular-nums; line-height: 1.2; }
.hm-stats3 small { font-size: var(--fs-2xs); color: var(--muted); white-space: nowrap; }
.hm-scbar > span { background: var(--sc); }
.hm-sec-btns { display: flex; gap: .4rem; margin-top: auto; padding-top: .2rem; }
.hm-sec-btns .btn { flex: 1; justify-content: center; text-align: center; }
.btn.hm-scbtn { background: var(--si); border-color: var(--si); color: #fff; }
[data-theme="dark"] .btn.hm-scbtn { color: #111; }
/* bars */
.hm-bar { display: block; height: 7px; border-radius: var(--r-pill); background: var(--panel-2); overflow: hidden; }
.hm-bar > span { display: block; height: 100%; border-radius: var(--r-pill); background: var(--accent); transition: width .6s cubic-bezier(.22,1,.36,1); }
.hm-bar.red > span { background: var(--red); } .hm-bar.amber > span { background: var(--amber); } .hm-bar.green > span { background: var(--green); }
/* weak patterns */
.hm-weak { display: flex; flex-direction: column; margin-top: var(--sp-2); }
.hm-wk { display: grid; grid-template-columns: minmax(0, 1fr) minmax(110px, 170px) 5.6rem auto; gap: .4rem 1rem; align-items: center; padding: .6rem 0; border-bottom: 1px dashed var(--border); }
.hm-wk:last-child { border-bottom: 0; padding-bottom: 0; }
.hm-wk-n { display: flex; flex-direction: column; min-width: 0; }
.hm-wk-n b { font-weight: 600; font-size: var(--fs-sm); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.hm-wk-n small { color: var(--muted); font-size: var(--fs-xs); display: flex; align-items: center; gap: .35rem; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.hm-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--sc); flex: none; }
.hm-wk-a { display: flex; align-items: center; gap: .55rem; }
.hm-wk-a .hm-bar { flex: 1; }
.hm-wk-a b { font: 700 var(--fs-xs) var(--mono); width: 2.6rem; text-align: right; }
.hm-wk-t { font: 600 var(--fs-xs) var(--mono); text-align: right; white-space: nowrap; }
.hm-wk-t small { color: var(--muted); font-weight: 500; }
.hm-wk-t.over { color: var(--amber); }
@media (max-width: 600px) {
  .hm-wk { grid-template-columns: minmax(0, 1fr) auto auto; gap: .35rem .7rem; }
  .hm-wk-n { grid-column: 1 / -1; }
}
/* mistake reasons */
.hm-mr { display: flex; flex-direction: column; gap: .45rem; margin-top: var(--sp-3); }
.hm-mr-row { display: grid; grid-template-columns: 6.6rem minmax(0, 1fr) 2.6rem; gap: .6rem; align-items: center; font-size: var(--fs-sm); }
.hm-mr-row b { font: 700 var(--fs-xs) var(--mono); text-align: right; color: var(--muted); }
.hm-mr-row .hm-bar > span { background: color-mix(in srgb, var(--red) 55%, var(--panel-2)); }
.hm-mr-row.top .hm-bar > span { background: var(--red); }
.hm-mr-row.top span:first-child, .hm-mr-row.top b { color: var(--text); font-weight: 700; }
.hm-tip { display: flex; gap: .55rem; align-items: flex-start; margin: var(--sp-3) 0 var(--sp-2); padding: .65rem .75rem; border-radius: var(--r-sm); background: var(--amber-soft); line-height: 1.45; }
.hm-tip .cat-ico { flex: none; margin-top: .1rem; }
/* empty states */
.hm-empty { display: flex; flex-direction: column; align-items: center; text-align: center; gap: .55rem; padding: var(--sp-4) var(--sp-3) var(--sp-2); }
.hm-empty > .cat-ico { width: 30px; height: 30px; color: var(--muted); opacity: .7; }
.hm-empty p { max-width: 440px; margin: 0; line-height: 1.5; }
.hm-empty .btn .cat-ico, .hm-empty .btn .ico { width: 16px; height: 16px; }
/* mock history */
.hm-mstats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .5rem; margin: var(--sp-3) 0 var(--sp-4); }
.hm-mstats > span { display: flex; flex-direction: column; }
.hm-mstats b { font: 800 var(--fs-xl) var(--display); font-variant-numeric: tabular-nums; line-height: 1.15; }
.hm-mstats em { font: 700 var(--fs-xs) var(--mono); font-style: normal; vertical-align: middle; }
.hm-mstats small { font-size: var(--fs-xs); color: var(--muted); }
.hm-mk { position: relative; display: flex; align-items: stretch; gap: clamp(4px, 1.4vw, 14px); height: 150px; padding: 18px 0 22px 26px; }
.hm-mk-grid { position: absolute; left: 26px; right: 0; top: 18px; bottom: 22px; pointer-events: none; }
.hm-mk-grid i { position: absolute; left: 0; right: 0; border-top: 1px dashed var(--border); }
.hm-mk-grid em { position: absolute; left: -26px; top: -.55em; font: 500 10px var(--mono); font-style: normal; color: var(--muted); }
.hm-mk-c { position: relative; flex: 1; max-width: 56px; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; }
.hm-mk-f { width: 100%; border-radius: 6px 6px 2px 2px; background: color-mix(in srgb, var(--accent) 55%, var(--panel-2)); transition: background .3s ease; }
.hm-mk-c:hover .hm-mk-f { background: var(--accent); }
.hm-mk-c.best .hm-mk-f { background: var(--green); }
.hm-mk-v { font: 700 10.5px var(--mono); color: var(--muted); margin-bottom: 3px; }
.hm-mk-c.best .hm-mk-v { color: var(--green); }
.hm-mk-d { position: absolute; bottom: -19px; left: 50%; transform: translateX(-50%); font-size: 10px; color: var(--muted); white-space: nowrap; }
:root[data-anim="on"] .hm-mk-f { animation: hm-grow .7s cubic-bezier(.22,1,.36,1) backwards; transform-origin: bottom; }
@keyframes hm-grow { from { transform: scaleY(0); } }
.hm-mbest { display: flex; align-items: center; gap: .45rem; margin-top: var(--sp-3); }
.hm-mbest .cat-ico { flex: none; width: 16px; height: 16px; }
@media (max-width: 520px) { .hm-mk-d { display: none; } .hm-mk { padding-bottom: 4px; } .hm-mk-grid { bottom: 4px; } .hm-mstats b { font-size: var(--fs-lg); } }
/* heatmap: scroll sideways on narrow screens instead of shrinking to nothing */
.hm-scroll { overflow-x: auto; }
@media (max-width: 640px) { .hm-scroll .hm-svg { min-width: 640px; } }
`;
    document.head.appendChild(st);
  }

  render();
})();
