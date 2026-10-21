/* home.js — the dashboard (index.html), calm layout.
   Top to bottom: Resume (apt:session) → one hero "Today's set" with the streak → three shortcuts → Sections list →
   data-only panels (weak patterns, why you miss, accuracy, mock history) → "Year view" details → Export / Import / Reset.
   Data: data/progress.js (PROGRESS), data/mocks.js, and the Store (items, activity, mocks, meta). Renders fine with an empty Store. */
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
     Top to bottom: resume (if any) → today's set (the one hero) → three shortcuts → sections → panels that have data → year view. */
  const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
  let yearOpen = false;

  function resumeCard() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem("apt:session") || "null"); } catch (e) { s = null; }
    if (!s || typeof s !== "object" || !s.route || !(Date.now() - (+s.at || 0) < 864e5)) return "";
    const href = "practice.html#" + String(s.route).replace(/^#/, "");
    return `<section class="db-resume" aria-label="Resume">
      <div class="db-resume-t"><span class="db-label">Resume</span><b>${esc(s.title || "Practice set")}</b><span class="db-mono db-muted">Q ${+s.idx || 0}/${+s.total || 0}</span></div>
      <a class="btn db-flat" href="${esc(href)}">Resume ${ICON(I.arrow)}</a></section>`;
  }

  function hero(M) {
    const D = M.daily, dDone = D ? Math.min(D.idx || 0, D.ids.length) : 0, dFull = D && dDone >= D.ids.length;
    const done = M.todayN >= M.goal, left = Math.max(0, M.goal - M.todayN);
    const desc = done ? "Goal done for today. Anything more is a bonus."
      : M.todayN ? `${plural(left, "question")} to reach today's goal of ${M.goal}.`
      : `A mixed set of questions picked for you. Goal: ${M.goal} a day.`;
    const cta = dFull ? { t: "Practise more", href: "practice.html#setup" }
      : D && dDone ? { t: `Continue set · ${dDone}/${D.ids.length}`, href: "practice.html#daily" }
      : { t: "Start today's set", href: "practice.html#daily" };
    const week = [];
    for (let i = 6; i >= 0; i--) { const t = Date.now() - i * 864e5; week.push({ l: DAYS[new Date(t).getDay()], on: (M.d.activity[today(t)] || 0) > 0, now: i === 0 }); }
    const w = Math.min(100, (M.todayN / M.goal) * 100);
    return `<section class="is-hero db-hero">
      <div class="db-hero-main">
        <span class="db-label">Today</span>
        <h2 class="db-hero-t">Today's set</h2>
        <p class="db-hero-d">${desc}</p>
        <div class="db-prog"><div class="db-prog-h"><span class="db-label">Daily goal</span><span class="db-mono"><b>${N(Math.min(M.todayN, 9999))}</b> / ${M.goal}</span></div>
          <div class="db-meter" role="progressbar" aria-valuemin="0" aria-valuemax="${M.goal}" aria-valuenow="${Math.min(M.todayN, M.goal)}" aria-label="Questions today"><span style="width:${w.toFixed(1)}%"></span></div></div>
        <div class="db-actions"><a class="btn primary db-cta" href="${cta.href}">${cta.t} ${ICON(I.arrow)}</a>
          <button type="button" class="db-link" data-pop="goal">Change daily goal</button></div>
      </div>
      <div class="db-streak" aria-label="Streak">
        <div class="db-streak-n"><b>${M.streak}</b><span>day streak</span></div>
        <div class="db-week" aria-label="Last 7 days">${week.map((x) => `<span class="${x.on ? "on" : ""}${x.now ? " now" : ""}"><i></i>${x.l}</span>`).join("")}</div>
        <div class="db-mono db-muted">Best ${M.best}${M.tot.n ? ` · ${N(M.tot.n)} answered · ${pct(M.tot.c / M.tot.n)} right` : ""}</div>
      </div>
    </section>`;
  }

  function shortcuts(M) {
    const L = M.nextLesson, sp = M.speedBest;
    const tiles = [
      { k: "Continue learning", t: L ? L.title : "All lessons learned", s: L ? `${L.short} · ${L.group || "lesson"}` : "New lessons appear as they are written", href: L ? L.href : "quant.html" },
      { k: "Speed drill", t: "60-second drill", s: sp ? `Best ${N(sp[1])}` : "Beat the clock", href: "practice.html#speed" },
      { k: "Mock test", t: "Quick 15", s: "15 questions, timed", href: "mock.html#start/quick-15" },
    ];
    return `<div class="db-short">${tiles.map((x) => `<a class="db-tile" href="${x.href}"><span class="db-label">${x.k}</span><b>${esc(x.t)}</b><span class="db-muted">${esc(x.s)}</span></a>`).join("")}</div>`;
  }

  function sectionList(M) {
    return `<section><h2 class="db-h2">Sections</h2><div class="db-secs">${M.sections.map((s) => `
      <div class="db-sec sc-${s.sec}"><i class="db-sq" aria-hidden="true"></i>
        <div class="db-sec-n"><b>${esc(s.name)}</b><span class="db-mono db-muted">${s.done} of ${s.total} learned</span>
          <span class="db-bar" aria-hidden="true"><span style="width:${s.total ? ((s.done / s.total) * 100).toFixed(1) : 0}%"></span></span></div>
        <span class="db-sec-b"><a class="btn db-flat" href="${s.learnHref}" title="${s.learnLabel ? "Next lesson: " + esc(s.learnLabel) : "Open the " + esc(s.short) + " lessons"}">Learn</a>
          <a class="btn db-flat" href="${s.practiseHref}">Practise</a></span></div>`).join("")}</div></section>`;
  }

  function weakCard(M) {
    return `<section class="db-card"><div class="db-card-h"><h3>Weak patterns</h3><span class="db-muted">lowest first</span></div>${M.weak.slice(0, 5).map((p) => {
      const t = TOPIC[p.sec + "/" + p.topic];
      return `<div class="db-wk sc-${p.sec}"><i class="db-sq"></i>
        <span class="db-wk-n"><b>${esc(PAT[p.key] || prettyId(p.pattern))}</b><small>${esc(t ? t.title : prettyId(p.topic))} · ${p.c}/${p.n} right${p.avg > p.tgt ? " · slow" : ""}</small></span>
        <b class="db-mono">${pct(p.acc)}</b>
        <a class="btn db-flat" href="practice.html#drill/${p.key.split("/").map(encodeURIComponent).join("/")}">Drill</a></div>`;
    }).join("")}</section>`;
  }

  function reasonsCard(M) {
    const rows = REASONS.map(([k, label, tip]) => ({ k, label, tip, n: M.why[k] || 0 })).sort((a, z) => z.n - a.n);
    return `<section class="db-card"><div class="db-card-h"><h3>Why you miss</h3><a href="revision.html">Mistake book</a></div><div class="db-why">
      <div class="db-chips">${rows.map((r, i) => `<span class="db-chip${i === 0 ? " top" : ""}">${r.label} · ${r.n}</span>`).join("")}</div>
      <p class="db-tip">${rows[0].tip}</p></div></section>`;
  }

  function accuracyCard(M) {
    return `<section class="db-card"><div class="db-card-h"><h3>Accuracy by section</h3></div>${M.sections.filter((s) => s.n).map((s) => {
      const over = s.avg > s.tgt * 1.1;
      return `<div class="db-wk sc-${s.sec}"><i class="db-sq"></i><span class="db-wk-n"><b>${esc(s.name)}</b><small>${plural(s.n, "answer")} · ${mmss(s.avg)} per question${over ? " · over target" : ""}</small></span><b class="db-mono">${pct(s.c / s.n)}</b></div>`;
    }).join("")}</section>`;
  }

  function mockCard(M) {
    const last = M.mocks.slice(-10), best = M.mocks.reduce((b, m) => (m.p > b.p ? m : b), M.mocks[0]);
    const L = M.mocks[M.mocks.length - 1], avg = M.mocks.reduce((s, m) => s + m.p, 0) / M.mocks.length;
    const sc = (m) => (m.max ? `${+(+m.score || 0).toFixed(2)} / ${m.max}` : pct(m.p));
    return `<section class="db-card"><div class="db-card-h"><h3>Mock history</h3><a href="mock.html">All mocks</a></div>
      <div class="db-mk" role="img" aria-label="Score of the last ${last.length} mocks">
        ${last.map((m) => { const v = Math.max(0, Math.min(1, m.p)); return `<span class="db-mk-c${m === L ? " last" : ""}" title="${esc(m.name)} · ${shortDate(m.at)} · ${sc(m)}">
          <small>${Math.round(m.p * 100)}%</small><i style="height:${Math.max(3, v * 100).toFixed(1)}%"></i><em>${shortDate(m.at)}</em></span>`; }).join("")}
      </div>
      <div class="db-card-f">Last: <b>${esc(L.name)}</b> ${pct(Math.max(0, L.p))} · Best ${pct(Math.max(0, best.p))} · Average ${pct(Math.max(0, avg))} · ${plural(M.mocks.length, "mock")}</div></section>`;
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
      s += `<rect class="hm-c l${lvl}${key > tk ? " fut" : ""}${key === tk ? " now" : ""}" x="${left + w * step}" y="${top + dw * step}" width="${cell}" height="${cell}"><title>${t.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}: ${v} question${v === 1 ? "" : "s"}</title></rect>`;
      if (t.getDate() === 1 && t.getMonth() !== lastM) { lastM = t.getMonth(); months += `<text class="hm-m" x="${left + w * step}" y="11">${t.toLocaleString(undefined, { month: "short" })}</text>`; }
    }
    ["Mon", "Wed", "Fri"].forEach((l, i) => (s += `<text class="hm-m" x="0" y="${top + (1 + i * 2) * step + 9}">${l}</text>`));
    return { svg: `<div class="hm-scroll"><svg class="hm-svg" viewBox="0 0 ${left + 54 * step} ${top + 7 * step}" preserveAspectRatio="xMinYMin meet" role="img" aria-label="Activity in ${year}">${months}${s}</svg></div>`, total, days, years };
  }

  /* ---------- the page ---------- */
  function render() {
    const M = model(), H = heat(M.d.activity, M.goal);
    const hasAct = Object.values(M.d.activity).some((v) => v > 0);
    const panels = [];
    if (M.weak.length) panels.push(weakCard(M));
    if (M.tagged) panels.push(reasonsCard(M));
    if (M.tot.n) panels.push(accuracyCard(M));
    if (M.mocks.length) panels.push(mockCard(M));
    main.innerHTML = `<div class="db">
      <h1 class="db-title">Dashboard</h1>
      ${resumeCard()}
      ${hero(M)}
      ${shortcuts(M)}
      ${sectionList(M)}
      ${panels.length ? `<div class="db-panels">${panels.join("")}</div>` : `<p class="db-muted db-none">Your weak patterns, mistake reasons and mock history show up here after your first 10 answers.</p>`}
      ${hasAct ? `<details class="db-year" id="hm"${yearOpen ? " open" : ""}><summary>Year view</summary>
        <div class="db-year-b"><div class="hm-stats"><span>${plural(H.total, "question")} in ${year}</span><span>Active days <b>${H.days}</b></span>
          <select id="hmYear" aria-label="Year">${H.years.map((y) => `<option ${y === year ? "selected" : ""}>${y}</option>`).join("")}</select></div>
        ${H.svg}
        <div class="hm-foot"><span>Each square is a day. The darkest means you hit your goal of ${M.goal}.</span><span class="hm-legend">Less ${[0, 1, 2, 3, 4].map((l) => `<i class="l${l}"></i>`).join("")} More</span></div></div></details>` : ""}
      <footer class="db-foot"><span class="db-label">Your data</span>
        <button type="button" class="db-link" data-do="export">Export</button>
        <label class="db-link" tabindex="0" role="button">Import<input type="file" data-do="import" accept=".json,application/json" hidden></label>
        <button type="button" class="db-link" data-do="reset">Reset</button>
        <span class="db-muted">Saved only in this browser.</span></footer>
    </div>
    <div class="dash-pop card" id="dashPop" hidden></div>`;
    const yr = $("#hmYear");
    if (yr) yr.onchange = () => { year = +yr.value; yearOpen = true; render(); };
    const dt = $("#hm");
    const fit = () => { const sc = $(".hm-scroll"); if (sc && sc.scrollWidth > sc.clientWidth) sc.scrollLeft = sc.scrollWidth; };
    if (dt) { dt.addEventListener("toggle", () => { yearOpen = dt.open; if (dt.open) fit(); }); if (dt.open) fit(); }
    const imp = main.querySelector('label.db-link');
    if (imp) imp.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); imp.querySelector("input").click(); } });
  }

  /* ---------- daily goal popover ---------- */
  function openPop(kind, btn) {
    const el = $("#dashPop");
    if (pop === kind) { closePop(); return; }
    pop = kind;
    const goal = goalOf(Store.load());
    el.innerHTML = `<div class="dash-h">Daily goal</div><p class="small muted">How many questions a day? Placement prep usually goes well at 20 to 40.</p>
         <div class="btn-row hm-goals">${[10, 15, 25, 40, 60].map((g) => `<button type="button" class="btn db-flat${g === goal ? " db-on" : ""}" data-goal="${g}">${g}</button>`).join("")}</div>
         <form class="hm-goalform" data-goalform><label class="small muted" for="hmGoalIn">Custom</label><input id="hmGoalIn" type="number" min="1" max="500" step="1" value="${goal}"><button type="submit" class="btn primary">Save</button></form>`;
    const r = btn.getBoundingClientRect(), mr = main.getBoundingClientRect();
    el.style.top = r.bottom - mr.top + 8 + "px";
    const w = Math.min(360, mr.width - 16), want = r.left - mr.left;
    el.style.right = ""; el.style.width = w + "px";
    el.style.left = Math.max(8, Math.min(want, mr.width - w - 8)) + "px";
    el.hidden = false;
  }
  function closePop() { pop = null; const el = $("#dashPop"); if (el) el.hidden = true; }
  function setGoal(n) {
    n = Math.round(+n);
    if (!(n >= 1 && n <= 500)) { toast("Pick a goal between 1 and 500"); return; }
    const d = Store.load(); d.meta.goal = n; closePop(); Store.save(); toast(`Daily goal: ${n} questions`, 1800, "check");
    const pg = main.querySelector(".db-prog"); if (pg && window.stamp) window.stamp(pg);
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
  document.addEventListener("store:change", () => { if (!pop) render(); });

  /* ---------- styles (flat; only .btn.primary and .is-hero are loud) ---------- */
  if (!document.getElementById("homeStyle")) {
    const st = document.createElement("style");
    st.id = "homeStyle";
    st.textContent = `
.sc-quant { --sc: var(--f-pink); } .sc-reasoning { --sc: var(--f-green); } .sc-verbal { --sc: var(--f-yellow); } .sc-di { --sc: var(--f-blue); }
.db { position: relative; display: flex; flex-direction: column; gap: 1.75rem; min-width: 0; }
.db .db-mono { font-family: var(--mono); }
.db-meter > span, .db-bar > span { transition: width 150ms linear; }
.db-muted { color: var(--muted); font-size: .88rem; }
.db-title { margin: 0; }
.db-h2 { margin: 0 0 .75rem; font-weight: 800; text-transform: none; }
.db-label { font: 700 12px/1.2 var(--mono); letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.db .btn.db-flat, .db .db-flat { box-shadow: none; transform: none; border: 2px solid var(--ink); background: var(--panel); color: var(--text); min-height: 44px; display: inline-flex; align-items: center; justify-content: center; gap: .4rem; padding: .4rem 1rem; text-decoration: none; font-weight: 700; }
.db .btn.db-flat:hover, .db .db-flat:hover { background: var(--panel-2); color: var(--text); transform: none; box-shadow: none; }
.db .db-flat.db-on { background: var(--ink); color: var(--bg); }
.db .cat-ico { width: 16px; height: 16px; }
.db-link { background: none; border: 0; padding: 0 .25rem; min-height: 44px; display: inline-flex; align-items: center; font: 600 .92rem var(--sans); color: var(--text); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.db-link:hover { color: var(--accent); }
/* resume */
.db-resume { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .75rem 1rem; background: var(--panel); border: 2px solid var(--ink); padding: .75rem 1rem; }
.db-resume-t { display: flex; flex-wrap: wrap; align-items: center; gap: .25rem .9rem; min-width: 0; }
.db-resume-t b { font-weight: 800; }
/* hero */
.db-hero { display: grid; grid-template-columns: minmax(0, 1fr) minmax(220px, 280px); gap: 1.5rem 2rem; padding: 1.5rem; background: var(--panel); }
.db-hero-main { display: flex; flex-direction: column; gap: .75rem; min-width: 0; align-items: flex-start; }
.db-hero-t { margin: 0; font-size: clamp(1.7rem, 3.4vw, 2.3rem); font-weight: 800; text-transform: none; line-height: 1.1; border: 0; padding: 0; }
.db-hero-d { margin: 0; color: var(--muted); }
.db-prog { width: 100%; max-width: 520px; display: flex; flex-direction: column; gap: .4rem; }
.db-prog-h { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; font-size: .9rem; }
.db-prog-h b { font-size: 1.15rem; }
.db-meter { height: 18px; border: 2px solid var(--ink); background: var(--panel); }
.db-meter > span { display: block; height: 100%; background: var(--accent); }
.db-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem 1.25rem; margin-top: .25rem; }
.db-cta { min-height: 48px; display: inline-flex; align-items: center; gap: .5rem; font-size: 1rem; }
.db-streak { border-left: 2px solid var(--ink); padding-left: 2rem; display: flex; flex-direction: column; gap: .8rem; justify-content: center; }
.db-streak-n b { display: block; font: 900 3.6rem/0.9 var(--mono); }
.db-streak-n span { font: 700 12px var(--mono); text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
.db-week { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px; }
.db-week span { display: flex; flex-direction: column; align-items: center; gap: 3px; font: 700 .72rem var(--mono); color: var(--muted); }
.db-week i { width: 100%; aspect-ratio: 1; border: 2px solid var(--ink); background: var(--panel); }
.db-week .on i { background: var(--f-green); }
.db-week .now { color: var(--text); } .db-week .now i { outline: 2px solid var(--ink); outline-offset: 2px; }
/* shortcuts */
.db-short { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.db-tile { display: flex; flex-direction: column; gap: .3rem; padding: .9rem 1rem; min-height: 44px; background: var(--panel); border: 2px solid var(--ink); color: var(--text) !important; text-decoration: none !important; box-shadow: none; transform: none; }
.db-tile:hover { background: var(--panel-2); transform: none; box-shadow: none; }
.db-tile b { font-weight: 800; font-size: 1.1rem; line-height: 1.2; }
/* sections */
.db-secs { border: 2px solid var(--ink); background: var(--panel); }
.db-sec { display: flex; align-items: center; gap: .9rem; padding: .7rem 1rem; border-bottom: 2px solid var(--ink); }
.db-sec:last-child { border-bottom: 0; }
.db-sq { width: 16px; height: 16px; flex: none; background: var(--sc); border: 2px solid var(--ink); display: block; }
.db-sec-n { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: .2rem; }
.db-sec-n b { font-weight: 800; }
.db-bar { display: block; height: 8px; max-width: 260px; border: 2px solid var(--ink); background: var(--panel); box-sizing: content-box; }
.db-bar > span { display: block; height: 100%; background: var(--sc); }
.db-sec-b { display: flex; gap: .5rem; flex: none; }
/* panels */
.db-none { margin: 0; }
.db-panels { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem; align-items: start; }
.db-card { background: var(--panel); border: 2px solid var(--ink); min-width: 0; }
.db-card-h { display: flex; justify-content: space-between; align-items: baseline; gap: .5rem 1rem; padding: .7rem 1rem; border-bottom: 2px solid var(--ink); }
.db-card-h h3 { margin: 0; font-size: 1.05rem; font-weight: 800; text-transform: none; }
.db-card-h a { font-size: .88rem; }
.db-wk { display: flex; align-items: center; gap: .75rem; padding: .6rem 1rem; border-bottom: 1px solid var(--ink); }
.db-wk:last-child { border-bottom: 0; }
.db-wk-n { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.db-wk-n b { font-weight: 800; font-size: .95rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.db-wk-n small { font: 400 .74rem var(--mono); color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.db-why { padding: 1rem; display: flex; flex-direction: column; gap: .8rem; }
.db-chips { display: flex; flex-wrap: wrap; gap: .45rem; }
.db-chip { border: 2px solid var(--ink); padding: .2rem .6rem; font-weight: 700; font-size: .84rem; }
.db-chip.top { background: var(--f-pink); color: #22121A; }
.db-tip { margin: 0; font-size: .92rem; line-height: 1.5; border-top: 1px solid var(--ink); padding-top: .75rem; }
.db-mk { display: flex; align-items: flex-end; gap: clamp(6px, 1.4vw, 14px); height: 190px; padding: 1.2rem 1rem 1.9rem; }
.db-mk-c { position: relative; flex: 1; max-width: 60px; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 4px; }
.db-mk-c small { font: 700 .72rem var(--mono); }
.db-mk-c i { width: 100%; background: var(--accent-soft); border: 2px solid var(--ink); }
.db-mk-c.last i { background: var(--accent); }
.db-mk-c em { position: absolute; bottom: -1.4rem; font: 400 .66rem var(--mono); font-style: normal; color: var(--muted); white-space: nowrap; }
.db-card-f { padding: .7rem 1rem; border-top: 1px solid var(--ink); font-size: .88rem; }
/* year view */
.db-year { background: var(--panel); border: 2px solid var(--ink); }
.db-year > summary { cursor: pointer; padding: .7rem 1rem; min-height: 44px; display: flex; align-items: center; font-weight: 800; }
.db-year-b { padding: 0 1rem 1rem; display: flex; flex-direction: column; gap: .75rem; }
.db .hm-stats { display: flex; flex-wrap: wrap; align-items: center; gap: .4rem 1rem; font-size: .85rem; }
.db .hm-stats select { padding: .3rem .5rem; min-height: 36px; }
.db-foot { display: flex; flex-wrap: wrap; align-items: center; gap: .1rem 1rem; padding-top: 1rem; border-top: 2px solid var(--ink); }
/* goal popover */
.hm-goals { margin: .7rem 0 .6rem; display: flex; flex-wrap: wrap; gap: .5rem; } .hm-goals .btn { min-width: 3rem; }
.hm-goalform { display: flex; align-items: center; gap: .5rem; }
.hm-goalform input { width: 5.5rem; min-height: 44px; padding: .3rem .5rem; background: var(--panel); color: var(--text); font: 600 var(--fs-sm) var(--mono); }
@media (max-width: 760px) {
  .db { gap: 1.4rem; }
  .db-hero { grid-template-columns: minmax(0, 1fr); padding: 1.1rem; }
  .db-streak { border-left: 0; border-top: 2px solid var(--ink); padding: 1rem 0 0; }
  .db-short { grid-template-columns: minmax(0, 1fr); }
  .db-sec { flex-wrap: wrap; }
  .db-sec-b { width: 100%; } .db-sec-b .btn { flex: 1; }
  .db-panels { grid-template-columns: minmax(0, 1fr); }
}
`;
    document.head.appendChild(st);
  }

  render();
})();
