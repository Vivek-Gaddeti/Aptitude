/* =====================================================================
   mock.js : the mock-test page (mock.html calls window.MockPage())
   Routes (hash):  #                     preset gallery (company / sectional / full) + your mock history
                   #start/<id>[?seed=N]   instructions + Start (seed = retake that exact paper)
                   #run                   the exam screen (state in sessionStorage "apt:mock:run", a reload resumes;
                                          deadlines are stored as timestamps so the clock stays right)
                   #result/<runId>        analysis of one finished mock (Store.load().mocks)
                   #history               every finished mock
   Needs: site.js, common.js, data/catalog.js, qbank.js, the question data, data/mocks.js.
   Styles: reuses practice.css (.pr-*) plus its own injected <style id="mockStyle"> (.mk-*).
   The paper builder (MockPage.build) has no DOM access, so it can be tested in Node.
   ===================================================================== */
(function () {
  "use strict";
  const root = typeof window !== "undefined" ? window : globalThis;
  const RUNK = "apt:mock:run";
  const LET = "ABCD";
  const RING = 88;
  const SETCAP = 5;                                  // at most this many questions from one shared stimulus
  const GEN_D = ["Easy", "Medium", "Medium", "Hard"];
  const SEC_VAR = { quant: "--c-quant", reasoning: "--c-reason", verbal: "--c-verbal", di: "--c-di" };

  /* ---------------------------------------------------------------- data helpers (no DOM) */
  const presets = () => root.MOCKS || [];
  const presetById = (id) => presets().find((p) => p.id === id) || null;
  const CAT = () => root.CATALOG || [];
  const secInfo = (sec) => CAT().find((s) => s.sec === sec);
  const topicInfo = (sec, t) => ((secInfo(sec) || {}).topics || []).find((x) => x.id === t);
  const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);
  const topicTitle = (sec, t) => (topicInfo(sec, t) || {}).title || cap(String(t).replace(/-/g, " "));
  const secName = (sec) => (secInfo(sec) || {}).short || cap(sec);
  const totalQ = (p) => p.sections.reduce((s, x) => s + (+x.count || 0), 0);
  const totalMin = (p) => p.minutes || p.sections.reduce((s, x) => s + (+x.minutes || 0), 0);

  // a section's topics as [{ sec, topic }]; "all" = every topic of the section; "sec/topic" borrows from another section
  function topicsOf(s) {
    const QB = root.QB;
    if (!s.topics || s.topics === "all") {
      const info = secInfo(s.sec);
      const ids = info ? info.topics.map((t) => t.id) : Array.from(new Set(QB.qs.filter((q) => q.sec === s.sec).map((q) => q.topic)));
      return ids.map((t) => ({ sec: s.sec, topic: t }));
    }
    return s.topics.map((t) => (t.indexOf("/") > 0 ? { sec: t.split("/")[0], topic: t.split("/")[1] } : { sec: s.sec, topic: t }));
  }

  /* Build a paper: [{ id, s }] (s = section index).  Same seed + same avoid set = same paper.
     Per section: topics in a seeded order, taken round-robin; bank questions not in `avoid` come first;
     a question with a shared stimulus brings its set along (up to SETCAP, kept together);
     topics with generators may also give a generated question (seeded, so it can be rebuilt from its id). */
  function buildPaper(p, seed, avoid) {
    const QB = root.QB;
    const rng = QB.rng((+seed || 1) >>> 0);
    avoid = avoid || new Set();
    const used = new Set(), items = [];
    p.sections.forEach((s, si) => {
      const lanes = rng.shuffle(topicsOf(s)).map(({ sec, topic }) => {
        const bank = rng.shuffle(QB.qs.filter((q) => q.sec === sec && q.topic === topic));
        bank.sort((a, b) => (avoid.has(a.id) ? 1 : 0) - (avoid.has(b.id) ? 1 : 0));   // stable: fresh ones first, shuffled within
        const gens = Object.keys(QB.gens).filter((k) => k.indexOf(sec + "/" + topic + "/") === 0).sort();
        return { sec, topic, bank, gens };
      }).filter((L) => L.bank.length || L.gens.length);
      const out = [];
      const fromGen = (L) => {
        for (let t = 0; t < 8; t++) {
          const key = rng.pick(L.gens), d = rng.pick(GEN_D), sd = rng.int(1, 999999);
          let q = null;
          try { q = QB.make(key, d, sd); } catch (e) { q = null; }
          if (q && !used.has(q.id)) return [q.id];
        }
        return [];
      };
      const fromBank = (L, rem) => {
        while (L.bank.length) {
          const q = L.bank.shift();
          if (used.has(q.id)) continue;
          if (!q.set) return [q.id];
          const mem = QB.qs.filter((x) => x.set === q.set && !used.has(x.id));
          const n = Math.min(mem.length, rem, SETCAP);
          const st = mem.length > n ? rng.int(0, mem.length - n) : 0;
          return mem.slice(st, st + n).map((x) => x.id);
        }
        return [];
      };
      let i = 0;
      while (out.length < s.count && lanes.length) {
        const k = i % lanes.length, L = lanes[k], rem = s.count - out.length;
        const fresh = L.bank.some((q) => !used.has(q.id) && !avoid.has(q.id));
        let got = [];
        if (L.gens.length && (!fresh || rng() < 0.4)) got = fromGen(L);
        if (!got.length) got = fromBank(L, rem);
        if (!got.length && L.gens.length) got = fromGen(L);
        if (got.length) { got.forEach((id) => { used.add(id); out.push(id); }); i++; }
        else lanes.splice(k, 1);
      }
      out.forEach((id) => items.push({ id, s: si }));
    });
    return items;
  }

  // what a finished mock looks like (shape in docs/SPEC-final.md)
  function scoreRun(R, getQ, now) {
    const p = R.p, neg = +p.negative || 0, mk = +p.marks || 1;
    const answers = R.items.map((it, i) => {
      const q = getQ(it.id), c = R.ans[i] != null ? R.ans[i] : null;
      return { qid: q.id, sec: q.sec, topic: q.topic, pattern: q.pattern, chosen: c, ok: c != null && c === q.ans, secs: Math.round((R.tq[i] || 0) * 10) / 10, marked: !!R.mark[i], s: it.s };
    });
    const r2 = (x) => Math.round(x * 100) / 100;
    const secs = p.sections.map((s, si) => {
      const A = answers.filter((a) => a.s === si), c = A.filter((a) => a.ok).length, w = A.filter((a) => a.chosen != null && !a.ok).length;
      return { title: s.title, sec: s.sec, n: A.length, correct: c, wrong: w, skipped: A.length - c - w, score: r2(c * mk - w * neg), max: A.length * mk, time: Math.round(A.reduce((t, a) => t + a.secs, 0)) };
    });
    const correct = answers.filter((a) => a.ok).length, attempted = answers.filter((a) => a.chosen != null).length, wrong = attempted - correct;
    const minutes = totalMin(p);
    return {
      id: "m" + now, preset: R.preset, name: p.name, at: now, seed: R.seed, minutes,
      timeUsed: Math.min(Math.round((now - R.started) / 1000), minutes * 60), negative: neg,
      score: r2(correct * mk - wrong * neg), max: answers.length * mk, acc: attempted ? Math.round((correct / attempted) * 100) : 0,
      attempted, correct, wrong, secs, answers,
    };
  }

  /* ================================================================ the page */
  function MockPage() {
    if (typeof document === "undefined") return;
    const main = document.getElementById("content");
    const QB = root.QB;
    if (!main || !QB || !QB.pool) return;
    if (main.dataset.mk) return;
    main.dataset.mk = "1";
    const Store = root.Store;
    const esc = root.esc || ((s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])));
    const fmt = root.fmt || esc;
    const toast = root.toast || (() => {});
    const swapLabel = root.swapLabel || ((l, s = 0) => `<span class="swap" data-s="${s}">${l.map((x) => `<span>${x}</span>`).join("")}</span>`);
    const LOCAL_ICONS = {
      warn: '<path d="M12 3.5 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.2h.01"/>',
      bolt: '<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',
      back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
      pin: '<path d="M12 17v5M5 17h14l-2-5V4H7v8z"/>',
      chevron: '<path d="m6 9 6 6 6-6"/>',
      skip: '<path d="M5 5l9 7-9 7zM18 5v14"/>',
      lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
      list: '<path d="M8 6.5h12M8 12h12M8 17.5h12"/><path d="M4 6.5h.01M4 12h.01M4 17.5h.01"/>',
      clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
      building: '<path d="M4.5 20.5v-15l7-2.5v17.5M11.5 8.5h8v12"/><path d="M3 20.5h18M7.5 8h1M7.5 11.5h1M7.5 15h1M14.5 12h2M14.5 15.5h2"/>',
    };
    const ic = (name, cls) => {
      const s = typeof root.icon === "function" ? root.icon(name, cls || "") : "";
      return s || (LOCAL_ICONS[name] ? `<svg class="ico${cls ? " " + cls : ""}" viewBox="0 0 24 24" aria-hidden="true">${LOCAL_ICONS[name]}</svg>` : "");
    };
    const body = (t) => fmt(t).replace(/\n/g, "<br>");
    const ssx = {
      get(k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } },
      set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
      del(k) { try { sessionStorage.removeItem(k); } catch (e) {} },
    };
    const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
    const mmss = (s) => {
      s = Math.max(0, Math.floor(s));
      const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
      return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(x).padStart(2, "0");
    };
    const plural = (n, w) => n + " " + w + (n === 1 ? "" : "s");
    const negTxt = (n) => (!n ? "No negative marking" : "−" + (Math.abs(n - 1 / 3) < 1e-9 ? "1/3" : String(+n)) + " per wrong answer");
    const negShort = (n) => (!n ? "no negative" : "−" + (Math.abs(n - 1 / 3) < 1e-9 ? "1/3" : String(+n)) + " per wrong");
    const dateTxt = (t) => { const d = new Date(t); return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) + ", " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }); };
    const mocks = () => (Store ? Store.load().mocks : []);
    const pctOf = (m) => (m.max ? Math.round((Math.max(0, m.score) / m.max) * 100) : 0);
    const scoreTxt = (x) => String(Math.round(x * 100) / 100).replace("-", "−");

    injectStyle();
    main.classList.add("pr", "mk");

    /* ------------------------------------------------------------ state */
    let R = ssx.get(RUNK);
    if (R && (!R.v || !Array.isArray(R.items) || !R.p)) { R = null; ssx.del(RUNK); }
    let view = "";
    const qc = new Map();
    const getQ = (id) => {
      if (qc.has(id)) return qc.get(id);
      const q = QB.get(id) || { id, sec: "quant", topic: "", pattern: "", d: "Medium", q: "This question is no longer in the bank.", opts: ["-", "-", "-", "-"], ans: 0, time: 45, sol: [] };
      qc.set(id, q);
      return q;
    };
    const persist = () => { if (R) ssx.set(RUNK, R); };
    const sectional = () => !R.p.minutes;
    const locked = () => sectional() || !!R.p.sectionLock;
    const range = (s) => { let f = -1, l = -1; R.items.forEach((it, i) => { if (it.s === s) { if (f < 0) f = i; l = i; } }); return [f, l]; };
    const nonEmpty = () => R.p.sections.map((_, s) => s).filter((s) => range(s)[0] >= 0);
    const nextSec = (s) => nonEmpty().find((x) => x > s);
    const state = (i) => {
      const a = R.ans[i] != null, m = !!R.mark[i];
      return a && m ? "am" : m ? "mr" : a ? "an" : R.seen[i] ? "na" : "nv";
    };
    const counts = (f, l) => {
      const c = { an: 0, na: 0, mr: 0, am: 0, nv: 0, n: 0 };
      for (let i = f; i <= l; i++) { c[state(i)]++; c.n++; }
      return c;
    };

    /* ------------------------------------------------------------ routes */
    function go(h, replace) {
      if (replace) { try { history.replaceState(null, "", "#" + h); } catch (e) {} route(); return; }
      if ((location.hash || "").replace(/^#/, "") === h) route(); else location.hash = h;
    }
    function route() {
      stopTick();
      closeModal(false, true);
      const raw = (location.hash || "").replace(/^#\/?/, "");
      const [path, qs] = raw.split("?");
      const parts = path.split("/").map((x) => decodeURIComponent(x));
      const query = {};
      (qs || "").split("&").forEach((kv) => { const [k, v] = kv.split("="); if (k) query[k] = decodeURIComponent(v || ""); });
      document.title = "Mock tests · " + ((root.SITE && SITE.brand) || "Aptitude Hub");
      if (parts[0] === "run") {
        if (R && !R.done && R.items.length) return examView();
        return go("", true);
      }
      exitFocus();
      if (parts[0] === "start" && parts[1]) return startView(parts[1], query.seed);
      if (parts[0] === "result" && parts[1]) return resultView(parts[1]);
      if (parts[0] === "history") return historyView();
      galleryView();
    }
    function safeRoute() {
      try { route(); } catch (err) {
        console.error(err);
        stopTick();
        exitFocus();
        main.innerHTML = `<div class="pr-card empty-state"><div class="big">${ic("puzzle")}</div><h2>This page didn't load properly</h2>
          <p class="muted">Usually an old cached file. Press <kbd>Ctrl</kbd> + <kbd>F5</kbd> to reload everything.</p>
          <p class="small muted">Details: ${esc(String((err && err.message) || err))}</p>
          <div class="btn-row" style="justify-content:center"><a class="btn primary" href="#">All mock tests</a></div></div>`;
      }
    }

    /* ================================================================ GALLERY */
    function statsFor(id) {
      const ms = mocks().filter((m) => m.preset === id);
      if (!ms.length) return null;
      const best = ms.reduce((b, m) => (pctOf(m) > pctOf(b) ? m : b), ms[0]);
      return { n: ms.length, best, last: ms[ms.length - 1] };
    }
    function liveBanner() {
      if (!R || R.done) return "";
      const c = counts(0, R.items.length - 1);
      return `<div class="pr-card pr-resume mk-live">${ic("timer")}<div><b>${esc(R.p.name)} is in progress</b><div class="muted small">${c.an + c.am} of ${c.n} answered · the clock keeps running while you're away</div></div>
        <span class="grow"></span><button class="btn" data-act="discard">Discard</button><a class="btn primary" href="#run">Resume test</a></div>`;
    }
    function cardHTML(p) {
      const st = statsFor(p.id), n = totalQ(p), mins = totalMin(p);
      const secs = p.sections.map((s) => `<li><i style="--sc:var(${SEC_VAR[s.sec] || "--accent"})"></i>${esc(s.title)}<b>${s.count}</b>${s.minutes ? `<span>${s.minutes} min</span>` : ""}</li>`).join("");
      return `<article class="mk-card">
        <div class="mk-card-top">${p.company ? `<span class="mk-co">${esc(p.company)}</span>` : `<span class="mk-co plain">${p.kind === "section" ? "Sectional" : "Mixed"}</span>`}${p.negative ? `<span class="mk-neg">${ic("warn")}${esc(negShort(p.negative))}</span>` : ""}</div>
        <h3>${esc(p.name)}</h3>
        <p class="mk-blurb">${esc(p.blurb || "")}</p>
        <div class="mk-meta"><span>${ic("list")}<b>${n}</b> questions</span><span>${ic("clock")}<b>${mins}</b> min${p.minutes ? "" : " (per section)"}</span>${p.calculator ? `<span>Calculator</span>` : ""}</div>
        <ul class="mk-secs">${secs}</ul>
        <div class="mk-card-foot">${st ? `<span class="mk-best">Best <b>${scoreTxt(st.best.score)}</b>/${st.best.max} <span class="muted">· ${plural(st.n, "attempt")}</span></span>` : `<span class="muted small">Not attempted yet</span>`}
          <span class="grow"></span><a class="btn primary sm" href="#start/${encodeURIComponent(p.id)}">Start</a></div></article>`;
    }
    function historyRows(list) {
      return list.map((m) => {
        const p = presetById(m.preset);
        return `<tr><td>${esc(dateTxt(m.at))}</td><td class="pn">${esc(m.name || (p && p.name) || m.preset)}</td>
          <td class="num"><b>${scoreTxt(m.score)}</b> / ${m.max} <span class="muted small">(${pctOf(m)}%)</span></td><td class="num">${m.acc}%</td>
          <td class="num">${m.attempted}/${(m.answers || []).length || m.max}</td><td class="num">${mmss(m.timeUsed || 0)}</td>
          <td class="act"><a class="btn sm" href="#result/${encodeURIComponent(m.id)}">View</a></td></tr>`;
      }).join("");
    }
    function historyTable(list) {
      return `<div class="pr-tbl-wrap"><table class="pr-table mk-hist"><thead><tr><th>When</th><th>Test</th><th>Score</th><th>Accuracy</th><th>Attempted</th><th>Time</th><th></th></tr></thead><tbody>${historyRows(list)}</tbody></table></div>`;
    }
    function galleryView() {
      view = "gallery";
      const groups = [["company", "Company-style tests", "Practice formats modelled on each company's public pattern."],
        ["section", "Sectional tests", "One section, one clock. Good for a focused weekly check."],
        ["full", "Full-length and quick", "Every section together, or a fifteen-minute warm-up."]];
      const ms = mocks().slice().reverse();
      main.innerHTML = `<div class="pr-enter">
        <h1 class="pr-h1">Mock tests</h1>
        <p class="lead">Timed, exam-style tests with section timers, a question palette and negative marking where the real test has it. Every answer also counts towards your practice stats.</p>
        ${liveBanner()}
        ${groups.map(([k, t, sub]) => {
          const ps = presets().filter((p) => (p.kind || "company") === k);
          return ps.length ? `<section class="mk-group"><div class="mk-gh"><h2>${t}</h2><span class="muted small">${sub}</span></div><div class="mk-cards">${ps.map(cardHTML).join("")}</div></section>` : "";
        }).join("")}
        <section class="mk-group"><div class="mk-gh"><h2>Your mock history</h2>${ms.length > 8 ? `<a class="small" href="#history">See all ${ms.length}</a>` : ""}</div>
          <div class="pr-card">${ms.length ? historyTable(ms.slice(0, 8)) : `<p class="muted" style="margin:0">No mocks yet. Start with <a href="#start/quick-15">Quick 15</a> to get a feel for the exam screen.</p>`}</div></section>
      </div>`;
      window.scrollTo(0, 0);
    }
    function historyView() {
      view = "history";
      const ms = mocks().slice().reverse();
      main.innerHTML = `<div class="pr-enter"><div class="pr-sbar"><a class="pr-back" href="#">${ic("back")} Mock tests</a></div>
        <h1 class="pr-h1">Your mock history</h1>
        <p class="lead">${ms.length ? plural(ms.length, "finished mock") + ", newest first." : "Nothing here yet."}</p>
        <div class="pr-card">${ms.length ? historyTable(ms) : `<p class="muted" style="margin:0"><a href="#">Pick a test</a> to start.</p>`}</div></div>`;
      window.scrollTo(0, 0);
    }

    /* ================================================================ INSTRUCTIONS */
    let pendingStart = null;
    function startView(id, seedQ) {
      view = "start";
      const p = presetById(id);
      if (!p) { toast("That test isn't available"); return go("", true); }
      const seed = seedQ != null && /^\d+$/.test(seedQ) ? +seedQ : null;
      const prior = seed != null ? mocks().filter((m) => m.preset === id && +m.seed === seed).pop() : null;
      pendingStart = { id, seed, prior: prior ? prior.id : null };
      const secMode = !p.minutes, lockTxt = secMode ? "Each section has its own timer. When it runs out you move to the next section automatically, and you can't go back."
        : p.sectionLock ? "One clock for the whole test. Sections are taken in order: once you move to the next section you can't come back."
          : "One clock for the whole test. Move between sections freely with the tabs at the top.";
      const rows = p.sections.map((s) => {
        const tps = topicsOf(s).map((t) => topicTitle(t.sec, t.topic));
        const shown = tps.slice(0, 6).join(", ") + (tps.length > 6 ? " +" + (tps.length - 6) + " more" : "");
        return `<tr><td class="pn"><span class="pr-chip sec" style="--sc:var(${SEC_VAR[s.sec] || "--accent"})">${esc(secName(s.sec))}</span> <b>${esc(s.title)}</b></td><td class="num">${s.count}</td><td class="num">${s.minutes ? s.minutes + " min" : "shared"}</td><td class="muted small">${esc(shown)}</td></tr>`;
      }).join("");
      const live = R && !R.done;
      main.innerHTML = `<div class="pr-enter">
        <div class="pr-sbar"><a class="pr-back" href="#">${ic("back")} All mock tests</a></div>
        <h1 class="pr-h1">${esc(p.name)}</h1>
        <p class="lead">${esc(p.blurb || "")}</p>
        ${live ? `<div class="pr-card pr-resume mk-live">${ic("warn")}<div><b>${esc(R.p.name)} is still in progress</b><div class="muted small">Starting a new test discards it.</div></div><span class="grow"></span><a class="btn" href="#run">Resume that test</a></div>` : ""}
        <div class="pr-setup">
          <div>
            <div class="pr-card"><h5>Sections</h5><div class="pr-tbl-wrap"><table class="pr-table"><thead><tr><th>Section</th><th>Questions</th><th>Time</th><th>Draws from</th></tr></thead><tbody>${rows}</tbody></table></div></div>
            <div class="pr-card"><h5>Rules</h5><ul class="mk-rules">
              <li>${ic("clock")}<span><b>${totalMin(p)} minutes</b> for ${totalQ(p)} questions. ${esc(lockTxt)}</span></li>
              <li>${ic("check")}<span><b>+${p.marks || 1}</b> for each right answer. <b>${esc(negTxt(p.negative))}</b>${p.negative ? ". Leave a question blank rather than guess blindly." : ". Answer every question, even a guess."}</span></li>
              <li>${ic("timer")}<span>You get a warning at 5 minutes and at 1 minute. At 0:00 the ${secMode ? "section ends" : "test is submitted"} automatically.</span></li>
              <li>${ic("flag")}<span>The palette shows each question's state: not visited, not answered, answered, marked for review, and answered &amp; marked. Marked answers are still scored.</span></li>
              <li>${ic("pencil")}<span>The rough-work pad opens with <kbd>W</kbd>. ${p.calculator ? "This test allows an on-screen calculator, so the pad's calculator is fair game." : "The real test has no calculator: turn on <b>Exam mode</b> in the pad to hide its calculator."}</span></li>
              <li>${ic("keyboard")}<span><kbd>1</kbd>–<kbd>4</kbd> or <kbd>A</kbd>–<kbd>D</kbd> choose (press again to clear), <kbd>Enter</kbd> save &amp; next, <kbd>M</kbd> mark for review, <kbd>Backspace</kbd> clear response, <kbd>←</kbd> <kbd>→</kbd> move.</span></li>
              <li>${ic("restart")}<span>The page hides the header while the test runs. Reloading the page resumes the test with the clock still running.</span></li>
            </ul>${p.note ? `<p class="mk-note">${ic("bulb")}<span>${esc(p.note)}</span></p>` : ""}</div>
          </div>
          <aside class="pr-side"><div class="pr-card pr-start">
            <h5>Your paper</h5>
            <div class="pr-big"><b>${totalQ(p)}</b><span>questions · ${totalMin(p)} min</span></div>
            <ul class="pr-sum">
              <li>${p.sections.length === 1 ? "One section" : plural(p.sections.length, "section")} · ${esc(negShort(p.negative))}</li>
              <li>${seed != null ? (prior ? "Same paper as your attempt on " + esc(dateTxt(mocks().find((m) => m.id === prior.id).at)) : "Paper number " + seed) : "A new paper, avoiding questions from your last 3 mocks"}</li>
              ${statsFor(p.id) ? `<li>Your best so far: ${scoreTxt(statsFor(p.id).best.score)} / ${statsFor(p.id).best.max}</li>` : ""}
            </ul>
            <button class="btn primary pr-go" data-act="begin">Start the test <kbd>Enter</kbd></button>
            ${seed != null ? `<a class="btn mk-alt" href="#start/${encodeURIComponent(p.id)}">New paper instead</a>` : ""}
          </div></aside>
        </div></div>`;
      window.scrollTo(0, 0);
    }
    function snap(p) {
      return { id: p.id, name: p.name, minutes: p.minutes || null, negative: +p.negative || 0, marks: +p.marks || 1, sectionLock: !!p.sectionLock, calculator: !!p.calculator,
        sections: p.sections.map((s) => ({ title: s.title, sec: s.sec, count: s.count, minutes: s.minutes || null })) };
    }
    function recentAvoid() {
      const set = new Set();
      mocks().slice(-3).forEach((m) => (m.answers || []).forEach((a) => { if (a.chosen != null) set.add(a.qid); }));
      return set;
    }
    function begin() {
      const st = pendingStart;
      if (!st) return;
      const p = presetById(st.id);
      if (!p) return;
      let seed = st.seed, items;
      if (st.prior) {
        const m = mocks().find((x) => x.id === st.prior);
        items = (m.answers || []).map((a) => ({ id: a.qid, s: a.s != null ? a.s : Math.max(0, p.sections.findIndex((s) => s.sec === a.sec)) }));
      } else if (seed != null) items = buildPaper(p, seed, null);
      else { seed = 1 + Math.floor(Math.random() * 2147483000); items = buildPaper(p, seed, recentAvoid()); }
      if (!items.length) { toast("No questions available for this test yet"); return; }
      const now = Date.now();
      R = { v: 1, preset: p.id, p: snap(p), seed, items, idx: 0, sec: 0, ans: {}, mark: {}, seen: {}, tq: {}, started: now,
        deadline: p.minutes ? now + p.minutes * 60000 : null, secEnd: {}, secAt: {}, warned: {}, done: false };
      qc.clear();
      enterSection(nonEmpty()[0]);
      persist();
      go("run");
    }

    /* ================================================================ EXAM */
    const T = { since: null, iv: null, n: 0 };
    let prevAnim = null;
    function enterFocus() {
      if (document.body.classList.contains("mk-focus")) return;
      prevAnim = document.documentElement.dataset.anim || null;
      document.documentElement.dataset.anim = "off";
      document.body.classList.add("mk-focus");
    }
    function exitFocus() {
      if (!document.body.classList.contains("mk-focus")) return;
      document.body.classList.remove("mk-focus");
      if (prevAnim) document.documentElement.dataset.anim = prevAnim;
      prevAnim = null;
    }
    const running = () => view === "run" && R && !R.done && document.visibilityState === "visible" && !modalOpen();
    const secsOf = (i) => (R.tq[i] || 0) + (i === R.idx && T.since ? (Date.now() - T.since) / 1000 : 0);
    function flush() { if (R && T.since) { R.tq[R.idx] = Math.round(secsOf(R.idx) * 10) / 10; T.since = null; } }
    function resume() { if (R && running() && !T.since) T.since = Date.now(); }
    function stopTick() { flush(); clearInterval(T.iv); T.iv = null; persist(); }

    const scope = () => (sectional() ? "s" + R.sec : "all");
    const durMs = () => (sectional() ? (R.p.sections[R.sec].minutes || 10) * 60000 : R.p.minutes * 60000);
    const remaining = () => (sectional() ? R.secEnd[R.sec] : R.deadline) - Date.now();
    function enterSection(s) {
      if (s == null) return;
      R.sec = s;
      const [f] = range(s);
      R.idx = f;
      R.seen[f] = true;
      R.secAt[s] = R.secAt[s] || Date.now();
      if (sectional() && !R.secEnd[s]) R.secEnd[s] = Date.now() + durMs();
      const sc = scope(), d = sectional() ? durMs() : remaining();
      if (d <= 5 * 60000 + 2000) R.warned[sc + ":5"] = true;
      if (d <= 60000 + 2000) R.warned[sc + ":1"] = true;
    }

    function examView() {
      view = "run";
      enterFocus();
      R.idx = clamp(R.idx, 0, R.items.length - 1);
      R.sec = R.items[R.idx].s;
      R.seen[R.idx] = true;
      resume();
      clearInterval(T.iv);
      T.iv = setInterval(tick, 250);
      paint(true);
    }
    function paint(fresh) {
      if (!R || view !== "run") return;
      const y = window.scrollY;
      main.innerHTML = examHTML();
      if (fresh) {
        const q = getQ(R.items[R.idx].id);
        if (root.RoughPad && RoughPad.setContext) RoughPad.setContext("mock:" + q.id);
        window.scrollTo(0, 0);
      } else window.scrollTo(0, y);
      tick();
    }
    function timerHTML() {
      return `<div class="pr-timer mk-timer" id="mkTimer" title="${sectional() ? "Time left in this section" : "Time left"}"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" fill="none" stroke="var(--panel-2)" stroke-width="4"/>
        <circle id="mkRing" cx="18" cy="18" r="14" fill="none" stroke="var(--page-c, var(--accent))" stroke-width="4" stroke-linecap="round" stroke-dasharray="${RING}" stroke-dashoffset="0" transform="rotate(-90 18 18)"/></svg>
        <span class="t" id="mkT">0:00</span><span class="tg">${sectional() ? "section" : "left"}</span></div>`;
    }
    function tabsHTML() {
      const p = R.p, live = nonEmpty();
      return `<div class="mk-tabs" role="tablist">${p.sections.map((s, si) => {
        const [f, l] = range(si);
        if (f < 0) return "";
        const c = counts(f, l), cur = si === R.sec, done = locked() && live.indexOf(si) < live.indexOf(R.sec), ahead = locked() && live.indexOf(si) > live.indexOf(R.sec);
        const dis = !cur && locked();
        return `<button type="button" role="tab" class="mk-tab${cur ? " cur" : ""}${done ? " done" : ""}" data-act="tab" data-s="${si}"${dis ? " disabled" : ""} aria-selected="${cur}" title="${esc(s.title)}${done ? " (finished)" : ahead ? " (locked until you get there)" : ""}">${dis ? ic(done ? "check" : "lock") : ""}<span class="nm">${esc(s.title)}</span><small>${c.an + c.am}/${c.n}</small></button>`;
      }).join("")}</div>`;
    }
    function paletteHTML(f, l) {
      let h = "";
      for (let i = f; i <= l; i++) h += `<button type="button" class="${state(i)}${i === R.idx ? " cur" : ""}" data-act="go" data-i="${i}" title="Question ${i - f + 1}">${i - f + 1}</button>`;
      return `<div class="mk-pal">${h}</div>`;
    }
    function legendHTML(c) {
      const L = [["an", "Answered"], ["na", "Not answered"], ["nv", "Not visited"], ["mr", "Marked for review"], ["am", "Answered & marked"]];
      return `<div class="mk-legend">${L.map(([k, t]) => `<span><i class="mk-sw ${k}"></i>${t}<b>${c[k]}</b></span>`).join("")}</div>`;
    }
    function examHTML() {
      const p = R.p, i = R.idx, it = R.items[i], q = getQ(it.id), s = it.s, sec = p.sections[s];
      const [f, l] = range(s), pos = i - f + 1, n = l - f + 1, a = R.ans[i];
      const set = q.set && QB.sets[q.set] ? QB.sets[q.set] : null;
      const lastSec = nextSec(s) == null;
      const atEnd = locked() ? i >= l : i >= R.items.length - 1;
      const opts = q.opts.map((o, k) => `<button type="button" class="pr-opt${a === k ? " sel" : ""}" data-act="opt" data-i="${k}" aria-pressed="${a === k}"><span class="k">${LET[k]}</span><span class="v">${fmt(o)}</span></button>`).join("");
      let setNav = "";
      if (set) {
        const sibs = []; for (let k = f; k <= l; k++) if (getQ(R.items[k].id).set === q.set) sibs.push(k);
        setNav = `<div class="pr-setnav">Set question ${sibs.indexOf(i) + 1} of ${sibs.length} ${sibs.map((k) => `<i class="${k === i ? "cur" : R.ans[k] != null ? "c" : ""}"></i>`).join("")}</div>`;
      }
      const marked = !!R.mark[i];
      const nextLbl = atEnd ? (locked() && !lastSec ? "Save & next section" : "Save & submit") : "Save & next";
      const qcard = `<div class="pr-card pr-qcard mk-qcard" id="mkQ">${setNav}
        <div class="pr-qhead"><span class="pr-qno">Q${pos}</span><span class="pr-pat">of ${n} · ${esc(sec.title)}</span><span class="grow"></span>
          <span class="mk-marks" title="Marking">+${p.marks}${p.negative ? ` / −${Math.abs(p.negative - 1 / 3) < 1e-9 ? "1/3" : p.negative}` : ""}</span>
          <button class="pr-icon${marked ? " mk" : ""}" data-act="mark" title="Mark for review (M)" aria-label="Mark for review" aria-pressed="${marked}">${ic("flag")}</button></div>
        <div class="pr-qtext${set ? " sm" : ""}">${body(q.q)}</div>
        <div class="pr-opts">${opts}</div>
        <div class="pr-actions mk-actions">
          <button class="btn" data-act="prev"${(locked() ? i <= f : i <= 0) ? " disabled" : ""}>${ic("back")} Previous</button>
          <button class="btn" data-act="clear"${a == null ? " disabled" : ""}>Clear response</button>
          <button class="btn mk-markbtn${marked ? " on" : ""}" data-act="marknext">${swapLabel(["Mark for review &amp; next", "Unmark &amp; next"], marked ? 1 : 0)}</button>
          <span class="grow"></span>
          <button class="btn primary" data-act="next">${swapLabel(["Save &amp; next", "Save &amp; next section", "Save &amp; submit"], ["Save & next", "Save & next section", "Save & submit"].indexOf(nextLbl))} <kbd>Enter</kbd></button>
        </div></div>`;
      const c = counts(f, l);
      const rail = `<aside class="mk-rail">
        <div class="pr-card"><h5>${esc(sec.title)} <small>${c.an + c.am} of ${c.n} answered</small></h5>${paletteHTML(f, l)}${legendHTML(c)}</div>
        <div class="pr-card mk-secbox">${locked() && !lastSec ? `<button class="btn mk-wide" data-act="nextsec">Finish section ${ic("arrow-right")}</button>` : ""}
          <button class="btn primary mk-wide" data-act="submit">Submit test</button></div>
        <div class="pr-card"><h5>Keys</h5><div class="pr-keys">
          <span><kbd>1</kbd>–<kbd>4</kbd> <kbd>A</kbd>–<kbd>D</kbd></span><span>choose (again to clear)</span>
          <kbd>Enter</kbd><span>save &amp; next</span>
          <kbd>M</kbd><span>mark for review</span>
          <kbd>Backspace</kbd><span>clear response</span>
          <span><kbd>←</kbd> <kbd>→</kbd></span><span>previous / next</span>
          <kbd>W</kbd><span>rough-work pad</span></div></div></aside>`;
      const mainCol = set
        ? `<div class="pr-split mk-split"><div class="pr-card pr-stim"><span class="pr-pin">${ic("pin")}stays in view</span>${QB.setHTML(set)}</div>${qcard}</div>`
        : qcard;
      const bar = `<div class="mk-bar">
        <div class="mk-title"><b>${esc(p.name)}</b><span>${locked() ? `Section ${nonEmpty().indexOf(s) + 1} of ${nonEmpty().length}` : "Sections open"} · ${esc(negShort(p.negative))}</span></div>
        ${tabsHTML()}<span class="grow"></span>
        <button type="button" class="btn sm mk-rough" data-act="rough" title="Rough-work pad (W)">${ic("pencil")}<span>Rough</span> <kbd>W</kbd></button>
        ${timerHTML()}
        <button type="button" class="btn sm mk-quit" data-act="quit" title="Quit without saving">Quit</button>
      </div>`;
      return `<div class="mk-exam">${bar}<div class="mk-grid"><div class="mk-main">${mainCol}</div>${rail}</div></div>`;
    }

    function tick() {
      if (view !== "run" || !R || R.done) return;
      const rem = remaining(), dur = durMs();
      const t = document.getElementById("mkT");
      if (t) {
        t.textContent = mmss(Math.ceil(Math.max(0, rem) / 1000));
        const ring = document.getElementById("mkRing"), box = document.getElementById("mkTimer");
        ring.style.strokeDashoffset = String(RING * clamp(1 - rem / dur, 0, 1));
        box.classList.toggle("over", rem <= 5 * 60000 && rem > 60000);
        box.classList.toggle("crit", rem <= 60000);
        ring.style.stroke = rem <= 60000 ? "var(--red)" : rem <= 5 * 60000 ? "var(--amber)" : "var(--page-c, var(--accent))";
      }
      if (rem <= 0) return timeUp();
      const sc = scope(), where = sectional() ? " in this section" : "";
      if (rem <= 60000 && !R.warned[sc + ":1"]) { R.warned[sc + ":1"] = R.warned[sc + ":5"] = true; toast("1 minute left" + where, 2800, "timer"); persist(); }
      else if (rem <= 5 * 60000 && !R.warned[sc + ":5"]) { R.warned[sc + ":5"] = true; toast("5 minutes left" + where, 2800, "timer"); persist(); }
      if (++T.n % 16 === 0 && T.since) { flush(); resume(); persist(); }
    }
    function timeUp() {
      closeModal(false, true);
      flush();
      const nx = nextSec(R.sec);
      if (sectional() && nx != null) {
        toast("Time is up for " + R.p.sections[R.sec].title + ". On to the next section.", 3000, "timer");
        enterSection(nx);
        persist();
        resume();
        return paint(true);
      }
      toast("Time is up. Your test has been submitted.", 3000, "timer");
      submit();
    }
    document.addEventListener("visibilitychange", () => {
      if (!R || view !== "run") return;
      if (document.visibilityState === "hidden") { flush(); persist(); } else { resume(); tick(); }
    });
    window.addEventListener("pagehide", () => { if (R && view === "run") { flush(); persist(); } });

    /* actions */
    function goTo(i) {
      if (!R) return;
      i = clamp(i, 0, R.items.length - 1);
      if (locked() && R.items[i].s !== R.sec) return;
      flush();
      R.idx = i;
      R.sec = R.items[i].s;
      R.seen[i] = true;
      resume();
      persist();
      paint(true);
    }
    function choose(k) {
      const q = getQ(R.items[R.idx].id);
      if (k < 0 || k >= q.opts.length) return;
      if (R.ans[R.idx] === k) delete R.ans[R.idx]; else R.ans[R.idx] = k;
      persist();
      paint(false);
    }
    function clearResp() { if (R.ans[R.idx] == null) return; delete R.ans[R.idx]; persist(); paint(false); }
    function toggleMark() { if (R.mark[R.idx]) delete R.mark[R.idx]; else R.mark[R.idx] = true; persist(); paint(false); }
    function step(dir) {
      const [f, l] = locked() ? range(R.sec) : [0, R.items.length - 1];
      const j = R.idx + dir;
      if (j >= f && j <= l) goTo(j);
    }
    function saveNext() {
      const i = R.idx, [, l] = range(R.sec);
      if (locked()) {
        if (i < l) return goTo(i + 1);
        return nextSec(R.sec) == null ? submitFlow() : nextSectionFlow();
      }
      if (i < R.items.length - 1) return goTo(i + 1);
      submitFlow();
    }
    function markNext() {
      if (R.mark[R.idx]) delete R.mark[R.idx]; else R.mark[R.idx] = true;
      persist();
      const [, l] = range(R.sec);
      if ((locked() && R.idx >= l) || R.idx >= R.items.length - 1) return paint(false);
      goTo(R.idx + 1);
    }
    function switchTab(s) {
      if (locked() || s === R.sec) return;
      const [f, l] = range(s);
      if (f < 0) return;
      let j = f;
      for (let k = f; k <= l; k++) if (R.seen[k] && R.ans[k] == null) { j = k; break; }
      goTo(j);
    }
    function countsTable(secs) {
      return `<table class="pr-table mk-ctable"><thead><tr><th>Section</th><th>Answered</th><th>Not answered</th><th>Marked</th><th>Not visited</th></tr></thead><tbody>${secs.map((s) => {
        const [f, l] = range(s), c = counts(f, l);
        return `<tr><td class="pn">${esc(R.p.sections[s].title)}</td><td class="num"><b>${c.an + c.am}</b>${c.am ? ` <span class="muted small">(${c.am} marked)</span>` : ""}</td><td class="num">${c.na}</td><td class="num">${c.mr}</td><td class="num">${c.nv}</td></tr>`;
      }).join("")}</tbody></table>`;
    }
    function nextSectionFlow() {
      const s = R.sec, nx = nextSec(s);
      if (nx == null) return submitFlow();
      openModal({ title: "Finish " + R.p.sections[s].title + "?", html: countsTable([s]) + `<p class="muted small">You can't come back to this section${sectional() ? ", and its unused time is lost" : ""}. Next: <b>${esc(R.p.sections[nx].title)}</b>.</p>`, ok: "Go to next section", cancel: "Stay here" })
        .then((y) => { if (!y || !R) return; flush(); enterSection(nx); persist(); resume(); paint(true); });
    }
    function submitFlow() {
      const secs = nonEmpty(), c = counts(0, R.items.length - 1);
      const left = locked() ? secs.filter((s) => s > R.sec) : [];
      openModal({
        title: "Submit the test?",
        html: countsTable(locked() ? secs.filter((s) => s <= R.sec) : secs) +
          `<p class="muted small">${c.an + c.am} of ${c.n} answered${left.length ? ` · ${plural(left.length, "section")} not started yet (${esc(left.map((s) => R.p.sections[s].title).join(", "))})` : ""}. ${remaining() > 0 ? mmss(remaining() / 1000) + " left on the clock." : ""}</p>`,
        ok: "Submit", cancel: "Keep working",
      }).then((y) => { if (y) submit(); });
    }
    function quitFlow() {
      openModal({ title: "Quit this test?", html: `<p class="muted">Nothing from this attempt is saved: no score, and your answers don't count towards practice stats.</p>`, ok: "Quit without saving", cancel: "Keep going", danger: true })
        .then((y) => { if (!y) return; const id = R.preset; R = null; ssx.del(RUNK); clearInterval(T.iv); T.iv = null; T.since = null; exitFocus(); go("start/" + id, true); });
    }
    function submit() {
      if (!R || R.done) return;
      flush();
      clearInterval(T.iv); T.iv = null; T.since = null;
      R.done = true;
      const now = Date.now();
      const res = scoreRun(R, getQ, now);
      if (Store) {
        R.items.forEach((it, i) => { if (R.ans[i] != null) QB.record(getQ(it.id), R.ans[i], R.tq[i] || 0); });
        const d = Store.load();
        d.mocks.push(res);
        Store.save();
      }
      R = null;
      ssx.del(RUNK);
      exitFocus();
      go("result/" + res.id, true);
    }

    /* ---------------------------------------------------------------- modal */
    let modalEl = null, modalRes = null;
    function ensureModal() {
      if (modalEl) return modalEl;
      modalEl = document.createElement("div");
      modalEl.className = "pr-modal mk-modal";
      modalEl.innerHTML = `<div class="pr-modal-box" role="dialog" aria-modal="true" aria-labelledby="mkMT"><h3 id="mkMT"></h3><div id="mkMB"></div>
        <div class="pr-modal-actions"><button type="button" class="btn" data-m="0"></button><button type="button" class="btn primary" data-m="1"></button></div></div>`;
      document.body.appendChild(modalEl);
      modalEl.addEventListener("click", (e) => { const b = e.target.closest("[data-m]"); if (b) closeModal(b.dataset.m === "1"); else if (e.target === modalEl) closeModal(false); });
      return modalEl;
    }
    const modalOpen = () => !!(modalEl && modalEl.classList.contains("show"));
    function openModal(o) {
      ensureModal();
      flush();
      modalEl.querySelector("#mkMT").textContent = o.title;
      modalEl.querySelector("#mkMB").innerHTML = o.html || "";
      modalEl.querySelector('[data-m="0"]').textContent = o.cancel || "Cancel";
      const ok = modalEl.querySelector('[data-m="1"]');
      ok.textContent = o.ok || "OK";
      ok.classList.toggle("mk-danger", !!o.danger);
      modalEl.classList.add("show");
      setTimeout(() => { if (modalOpen()) ok.focus({ preventScroll: true }); }, 30);
      return new Promise((res) => { modalRes = res; });
    }
    function closeModal(val, silent) {
      if (!modalOpen()) return;
      modalEl.classList.remove("show");
      const a = document.activeElement; if (a && modalEl.contains(a)) a.blur();
      const r = modalRes; modalRes = null;
      if (view === "run") resume();
      if (r) r(silent ? false : val === true);
    }

    /* ================================================================ RESULT */
    function resultView(id) {
      view = "result";
      const m = mocks().find((x) => x.id === id);
      if (!m) { toast("That result isn't on this device"); return go("", true); }
      const p = presetById(m.preset) || { id: m.preset, name: m.name, sections: (m.secs || []).map((s) => ({ title: s.title, sec: s.sec })) };
      const answers = m.answers || [];
      const rows = answers.map((a, i) => ({ a, i, q: getQ(a.qid), st: a.chosen == null ? "skip" : a.ok ? "ok" : "bad" }));
      // rank against your other attempts of this preset
      const others = mocks().filter((x) => x.preset === m.preset && x.id !== m.id);
      const beat = others.filter((x) => x.score < m.score).length;
      const rank = others.length ? `Better than <b>${Math.round((beat / others.length) * 100)}%</b> of your ${plural(others.length, "other attempt")} at this test` +
        (others.filter((x) => x.score > m.score).length === 0 ? " · your best so far" : "") : "Your first attempt at this test. Retake it later to see your progress.";
      const pct = pctOf(m);
      const verdict = pct >= 80 ? "Strong paper." : pct >= 60 ? "Solid. The wrong ones below are your quick wins." : pct >= 40 ? "Halfway there. Work through the topic map below." : "A tough one. Start with the weakest topics below.";

      // per section
      const secRows = (m.secs || []).map((s, si) => {
        const acc = s.correct + s.wrong ? Math.round((s.correct / (s.correct + s.wrong)) * 100) : 0;
        return `<tr><td class="pn"><span class="pr-chip sec" style="--sc:var(${SEC_VAR[s.sec] || "--accent"})">${esc(secName(s.sec))}</span> ${esc(s.title)}</td><td class="num"><b>${scoreTxt(s.score)}</b> / ${s.max}</td>
          <td class="num">${s.correct}</td><td class="num">${s.wrong}</td><td class="num">${s.skipped}</td><td><span class="pr-mini ${acc >= 70 ? "g" : acc >= 40 ? "a" : "r"}"><i style="width:${acc}%"></i></span> ${s.correct + s.wrong ? acc + "%" : "-"}</td><td class="num">${mmss(s.time)}</td>
          <td class="act"><button class="btn sm" data-act="filter" data-f="s${si}">Questions</button></td></tr>`;
      }).join("");

      // topic heatmap
      const tmap = {};
      rows.forEach((r) => {
        const k = r.q.sec + "/" + r.q.topic, t = tmap[k] || (tmap[k] = { sec: r.q.sec, topic: r.q.topic, n: 0, att: 0, c: 0 });
        t.n++; if (r.st !== "skip") t.att++; if (r.st === "ok") t.c++;
      });
      const topics = Object.values(tmap).sort((a, b) => (a.att ? a.c / a.att : -1) - (b.att ? b.c / b.att : -1) || b.n - a.n);
      const heat = topics.map((t) => {
        const acc = t.att ? Math.round((t.c / t.att) * 100) : null;
        const cls = acc == null ? "none" : acc >= 75 ? "g" : acc >= 50 ? "a" : "r";
        const strength = acc == null ? 0 : cls === "g" ? 14 + Math.round((acc - 75) * 0.6) : cls === "a" ? 18 : 14 + Math.round((50 - acc) * 0.3);
        return `<a class="mk-hc ${cls}" style="--h:${strength}%" href="${((secInfo(t.sec) || {}).page || t.sec + ".html")}#${encodeURIComponent(t.topic)}" title="${esc(topicTitle(t.sec, t.topic))}: ${t.c} right of ${t.att} attempted (${t.n} asked)">
          <span class="nm">${esc(topicTitle(t.sec, t.topic))}</span><span class="v">${acc == null ? "skipped" : acc + "%"}</span><span class="s">${t.c}/${t.att}${t.att < t.n ? ` · ${t.n - t.att} skipped` : ""}</span></a>`;
      }).join("");

      // time sinks
      const sinks = rows.filter((r) => r.a.secs > 0).sort((a, b) => b.a.secs - a.a.secs).slice(0, 5);
      const maxS = sinks.length ? sinks[0].a.secs : 1;
      const sinkHTML = sinks.map((r) => `<a class="mk-sink" href="#" data-act="row" data-i="${r.i}"><span class="pr-si ${r.st === "ok" ? "ok" : r.st === "bad" ? "bad" : ""}">${ic(r.st === "ok" ? "check" : r.st === "bad" ? "x" : "skip")}</span>
        <span class="n">Q${r.i + 1}</span><span class="t">${esc(topicTitle(r.q.sec, r.q.topic))}<small>${fmt(String(r.q.q).replace(/\n/g, " "))}</small></span>
        <span class="bar"><i style="width:${Math.round((r.a.secs / maxS) * 100)}%"></i></span><span class="tm">${mmss(r.a.secs)}<small>target ${mmss(r.q.time || 60)}</small></span></a>`).join("");

      // review list
      const list = rows.map((r) => {
        const q = r.q, a = r.a;
        const icn = r.st === "ok" ? `<span class="pr-si ok">${ic("check")}</span>` : r.st === "bad" ? `<span class="pr-si bad">${ic("x")}</span>` : `<span class="pr-si">${ic("skip")}</span>`;
        const opts = q.opts.map((o, j) => `<div class="pr-ro${j === q.ans ? " ok" : a.chosen === j ? " bad" : ""}"><span class="k">${LET[j]}</span><span>${fmt(o)}</span>${j === q.ans ? (a.chosen === j ? "<em>your answer · correct</em>" : "<em>correct</em>") : a.chosen === j ? "<em>your answer</em>" : ""}${q.why && q.why[j] && a.chosen === j && j !== q.ans ? `<small>${fmt(q.why[j])}</small>` : ""}</div>`).join("");
        const sol = (q.sol && q.sol.length ? `<ol>${q.sol.map((s) => `<li>${fmt(s)}</li>`).join("")}</ol>` : "") +
          (q.short ? `<div class="pr-box tip"><div class="lb">${ic("bolt")} Shortcut</div>${fmt(q.short)}</div>` : "") + (q.trap ? `<div class="pr-box trap"><div class="lb">${ic("warn")} Trap</div>${fmt(q.trap)}</div>` : "");
        const set = q.set && QB.sets[q.set] ? `<details class="mk-stimd"><summary>${ic("pin")} Show the ${esc(QB.sets[q.set].kind === "chart" ? "chart" : QB.sets[q.set].kind === "passage" ? "passage" : "figure")}</summary><div class="pr-stim mk-stim-inline">${QB.setHTML(q.set)}</div></details>` : "";
        return `<details class="pr-qrow" id="mkRow${r.i}" data-st="${r.st}" data-s="s${a.s != null ? a.s : ""}" data-m="${a.marked ? 1 : 0}"><summary>${icn}<span class="n">Q${r.i + 1}</span><span class="t">${fmt(String(q.q).replace(/\n/g, " "))}</span>${a.marked ? `<span class="mk-flag" title="Marked for review">${ic("flag")}</span>` : ""}<span class="pr-chip ${q.d === "Easy" ? "easy" : q.d === "Hard" ? "hard" : "med"}">${esc(q.d || "")}</span><span class="tm">${a.secs ? mmss(a.secs) : "-"}</span>${ic("chevron", "chev")}</summary>
          <div class="pr-qbody"><div class="muted small">${esc(secName(q.sec))} · ${esc(topicTitle(q.sec, q.topic))}${a.chosen == null ? " · not attempted" : ""}</div>${set}<div class="pr-qtext sm">${body(q.q)}</div><div class="pr-ro-list">${opts}</div><div class="pr-sol">${sol || '<span class="muted">No written solution for this one.</span>'}</div></div></details>`;
      }).join("");
      const nBad = rows.filter((r) => r.st === "bad").length, nSkip = rows.filter((r) => r.st === "skip").length, nMark = rows.filter((r) => r.a.marked).length;
      const filters = [["all", "All", rows.length], ["bad", "Wrong", nBad], ["skip", "Not attempted", nSkip], ["ok", "Right", rows.length - nBad - nSkip]].concat(nMark ? [["m", "Marked", nMark]] : []);

      main.innerHTML = `<div class="pr-enter">
        <div class="pr-sbar"><a class="pr-back" href="#">${ic("back")} Mock tests</a><div class="pr-crumb"><b>${esc(m.name || p.name)}</b> <span class="sep">·</span> ${esc(dateTxt(m.at))}</div><span class="grow"></span><span class="pr-chip mode">${esc(negShort(m.negative))}</span></div>
        <h1 class="pr-h1">Your result</h1>
        <div class="pr-card pr-hero mk-hero${pct >= 80 ? " hot" : ""}">
          <div class="pr-score"><b>${scoreTxt(m.score)}</b><span>/ ${m.max}</span><div class="muted small">${verdict}</div></div>
          <div class="pr-stats big">
            <div><b>${m.acc}%</b><span>accuracy</span></div>
            <div><b>${m.attempted}/${answers.length}</b><span>attempted</span></div>
            <div><b>${mmss(m.timeUsed || 0)}</b><span>time used <small>of ${m.minutes} min</small></span></div>
            <div><b>${m.wrong}</b><span>wrong${m.negative ? ` <small>cost ${scoreTxt(m.wrong * m.negative)}</small>` : ""}</span></div>
          </div>
          <div class="mk-rank">${ic("trophy")}<span>${rank}</span></div></div>
        <div class="pr-card"><h5>By section</h5><div class="pr-tbl-wrap"><table class="pr-table"><thead><tr><th>Section</th><th>Score</th><th>Right</th><th>Wrong</th><th>Skipped</th><th>Accuracy</th><th>Time</th><th></th></tr></thead><tbody>${secRows}</tbody></table></div></div>
        <div class="mk-two">
          <div class="pr-card"><h5>Topic map <small>accuracy on attempted questions, weakest first · tap to learn</small></h5><div class="mk-heat">${heat || '<span class="muted">Nothing attempted.</span>'}</div>
            <div class="mk-heat-key"><span><i class="g"></i>75%+</span><span><i class="a"></i>50–74%</span><span><i class="r"></i>below 50%</span><span><i class="none"></i>not attempted</span></div></div>
          <div class="pr-card"><h5>Time sinks <small>your 5 slowest questions</small></h5><div class="mk-sinks">${sinkHTML || '<span class="muted">No timing recorded.</span>'}</div></div>
        </div>
        <div class="pr-card"><h5>Questions <small>tap one for the solution</small></h5>
          <div class="pr-picks mk-filters">${filters.map(([k, t, c], j) => `<button type="button" class="pr-pick${j === 0 ? " on" : ""}" data-act="filter" data-f="${k}">${t}<small>${c}</small></button>`).join("")}</div>
          <div class="pr-qlist" id="mkList">${list}</div></div>
        <div class="pr-actions pr-final">
          <a class="btn" href="#start/${encodeURIComponent(m.preset)}?seed=${encodeURIComponent(m.seed)}">${ic("restart")} Retake same paper</a>
          <a class="btn" href="#start/${encodeURIComponent(m.preset)}">New paper</a>
          ${nBad + nSkip ? `<button class="btn" data-act="mistakes" data-id="${esc(m.id)}">${swapLabel(["Add wrong to mistake book", "Added to mistake book"], 0)}</button>` : ""}
          <span class="grow"></span><a class="btn primary" href="#">All mock tests</a></div></div>`;
      window.scrollTo(0, 0);
      if (pct >= 80 && !sessionStorage.getItem("apt:mock:cel:" + m.id)) {
        try { sessionStorage.setItem("apt:mock:cel:" + m.id, "1"); } catch (e) {}
        setTimeout(() => { if (root.FX && FX.bigConfetti) FX.bigConfetti(); else if (typeof root.fxConfetti === "function") root.fxConfetti(); }, 350);
      }
    }
    function applyFilter(f, btn) {
      main.querySelectorAll(".mk-filters .pr-pick").forEach((b) => b.classList.toggle("on", b.dataset.f === f));
      main.querySelectorAll("#mkList .pr-qrow").forEach((d) => {
        const show = f === "all" || d.dataset.st === f || d.dataset.s === f || (f === "m" && d.dataset.m === "1");
        d.hidden = !show;
      });
      if (btn && btn.closest("table")) { const l = document.getElementById("mkList"); if (l) l.scrollIntoView({ block: "start", behavior: "smooth" }); }
    }
    function addMistakes(id, btn) {
      const m = mocks().find((x) => x.id === id);
      if (!m || !Store) return;
      const now = Date.now();
      let n = 0;
      (m.answers || []).forEach((a) => {
        if (a.ok) return;
        const q = getQ(a.qid), k = QB.itemKey(q), it = Store.item(k);
        Store.load().items[k] = Object.assign({}, it, { status: "revise", next: now, level: 0, doneAt: it.doneAt || now, updated: now });
        n++;
      });
      Store.save();
      if (root.setSwap && btn) setSwap(btn, 1);
      toast(plural(n, "question") + " (wrong and not attempted) in your mistake book", 2000, "check");
    }

    /* ================================================================ events */
    main.addEventListener("click", (e) => {
      const el = e.target.closest("[data-act]");
      if (!el || !main.contains(el) || el.disabled) return;
      const act = el.dataset.act;
      if (act === "discard") { R = null; ssx.del(RUNK); return route(); }
      if (view === "start" && act === "begin") return begin();
      if (view === "run" && R) {
        if (act === "opt") return choose(+el.dataset.i);
        if (act === "next") return saveNext();
        if (act === "prev") return step(-1);
        if (act === "clear") return clearResp();
        if (act === "mark") return toggleMark();
        if (act === "marknext") return markNext();
        if (act === "go") return goTo(+el.dataset.i);
        if (act === "tab") return switchTab(+el.dataset.s);
        if (act === "nextsec") return nextSectionFlow();
        if (act === "submit") return submitFlow();
        if (act === "quit") return quitFlow();
        if (act === "rough") { if (root.RoughPad && RoughPad.toggle) RoughPad.toggle(); return; }
      }
      if (view === "result") {
        if (act === "filter") return applyFilter(el.dataset.f, el);
        if (act === "mistakes") return addMistakes(el.dataset.id, el);
        if (act === "row") {
          e.preventDefault();
          applyFilter("all");
          const d = document.getElementById("mkRow" + el.dataset.i);
          if (d) { d.open = true; d.scrollIntoView({ block: "center", behavior: "smooth" }); }
        }
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t && t.closest && (t.closest("input,textarea,select,[contenteditable='true'],.rw-drawer") || t.isContentEditable)) return;
      if (modalOpen()) {
        if (e.key === "Escape") { e.preventDefault(); closeModal(false); }
        return;
      }
      if (view === "start") {
        if (e.key === "Enter" && !(t && t.closest && t.closest("button,a"))) { e.preventDefault(); begin(); }
        return;
      }
      if (view !== "run" || !R) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k.length === 1 && "1234".includes(k)) { e.preventDefault(); return choose(+k - 1); }
      if (k.length === 1 && "abcd".includes(k)) { e.preventDefault(); return choose("abcd".indexOf(k)); }
      if (k === "Enter") { e.preventDefault(); return saveNext(); }
      if (k === "m") { e.preventDefault(); return toggleMark(); }
      if (k === "Backspace" || k === "Delete") { e.preventDefault(); return clearResp(); }
      if (k === "ArrowLeft") { e.preventDefault(); return step(-1); }
      if (k === "ArrowRight") { e.preventDefault(); return step(1); }
    });

    window.addEventListener("hashchange", safeRoute);
    safeRoute();
  }

  /* ================================================================ styles */
  function injectStyle() {
    if (document.getElementById("mockStyle")) return;
    const st = document.createElement("style");
    st.id = "mockStyle";
    st.textContent = `
.page.mk { max-width: 1240px; }
.mk .pr-h1 { margin-bottom: .2em; }
.mk-group { margin: 1.6rem 0 .6rem; }
.mk-gh { display: flex; align-items: baseline; gap: .8rem; flex-wrap: wrap; margin-bottom: .7rem; }
.mk-gh h2 { margin: 0; border: 0; padding: 0; font-family: var(--display); font-size: var(--fs-xl); }
.mk-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
.mk-card { background: var(--panel); border: 1px solid var(--border); border-radius: var(--r-md); box-shadow: var(--shadow); padding: 1rem 1.15rem; display: flex; flex-direction: column; gap: .55rem; min-width: 0; }
:root[data-anim="on"] .mk-card { transition: border-color .35s ease, transform .45s cubic-bezier(.22,1,.36,1); }
.mk-card:hover { border-color: color-mix(in srgb, var(--page-c, var(--accent)) 45%, var(--border)); }
:root[data-anim="on"] .mk-card:hover { transform: translateY(-2px); }
.mk-card h3 { margin: 0; font: 800 var(--fs-lg) var(--display); }
.mk-card-top { display: flex; align-items: center; gap: .5rem; min-height: 1.4rem; }
.mk-co { font: 800 var(--fs-2xs) var(--display); text-transform: uppercase; letter-spacing: .07em; color: var(--accent); background: var(--accent-soft); border-radius: var(--r-pill); padding: .1rem .55rem; }
.mk-co.plain { color: var(--muted); background: var(--panel-2); }
.mk-neg { margin-left: auto; display: inline-flex; align-items: center; gap: .25rem; font-size: var(--fs-2xs); font-weight: 700; color: var(--amber); }
.mk-neg .ico { width: 13px; height: 13px; }
.mk-blurb { margin: 0; font-size: var(--fs-sm); color: var(--muted); line-height: 1.5; }
.mk-meta { display: flex; flex-wrap: wrap; gap: .3rem .9rem; font-size: var(--fs-sm); color: var(--muted); }
.mk-meta span { display: inline-flex; align-items: center; gap: .3rem; }
.mk-meta b { color: var(--text); }
.mk-meta .ico { width: 15px; height: 15px; }
.mk-secs { list-style: none; margin: 0; padding: .55rem 0 0; border-top: 1px dashed var(--border); display: grid; gap: .25rem; font-size: var(--fs-sm); }
.mk-secs li { display: flex; align-items: center; gap: .5rem; min-width: 0; }
.mk-secs li i { width: 7px; height: 7px; border-radius: 50%; background: var(--sc); flex: none; }
.mk-secs li b { margin-left: auto; font-variant-numeric: tabular-nums; }
.mk-secs li span { color: var(--muted); font-size: var(--fs-xs); min-width: 3.6rem; text-align: right; }
.mk-card-foot { margin-top: auto; display: flex; align-items: center; gap: .5rem; padding-top: .4rem; }
.mk-best { font-size: var(--fs-sm); }
.mk-live { border-color: color-mix(in srgb, var(--amber) 45%, var(--border)); }
.mk-live > .ico { width: 22px; height: 22px; color: var(--amber); flex: none; }
.mk-hist td { white-space: nowrap; }
.mk-hist td.pn { white-space: normal; }
.mk-rules { list-style: none; margin: 0; padding: 0; display: grid; gap: .7rem; }
.mk-rules li { display: flex; gap: .7rem; align-items: flex-start; line-height: 1.55; }
.mk-rules li > .ico { width: 18px; height: 18px; flex: none; margin-top: .2rem; color: var(--accent); }
.mk-note { display: flex; gap: .5rem; align-items: flex-start; margin: 1rem 0 0; padding: .7rem .9rem; border-radius: var(--r-md); background: var(--amber-soft); font-size: var(--fs-sm); }
.mk-note .ico { width: 17px; height: 17px; flex: none; color: var(--amber); margin-top: .15rem; }
.mk-alt { width: 100%; justify-content: center; margin-top: .5rem; }

/* exam screen (focus mode: header hidden, motion off) */
body.mk-focus { --top-h: 0px; }
body.mk-focus #topbar { display: none; }
body.mk-focus .page.mk { max-width: 1440px; padding-top: 0; }
.mk-bar { position: sticky; top: 0; z-index: 30; display: flex; align-items: center; gap: .6rem 1rem; flex-wrap: wrap; padding: .65rem 0; margin-bottom: 1rem;
  background: color-mix(in srgb, var(--bg) 94%, transparent); backdrop-filter: blur(6px); border-bottom: 1px solid var(--border); }
.mk-title { display: flex; flex-direction: column; line-height: 1.25; min-width: 0; }
.mk-title b { font: 800 var(--fs-md) var(--display); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mk-title span { font-size: var(--fs-2xs); color: var(--muted); }
.mk-tabs { display: flex; gap: .35rem; overflow-x: auto; scrollbar-width: none; min-width: 0; max-width: 100%; }
.mk-tabs::-webkit-scrollbar { display: none; }
.mk-tab { border: 1px solid var(--border); background: var(--panel); color: var(--muted); border-radius: var(--r-pill); padding: .28rem .8rem; font: 700 var(--fs-sm) var(--display); white-space: nowrap; display: inline-flex; align-items: center; gap: .4rem; cursor: pointer; flex: none; }
.mk-tab small { font: 700 var(--fs-2xs) var(--mono); background: var(--panel-2); border-radius: var(--r-pill); padding: 0 .4rem; }
.mk-tab:hover:not(:disabled) { border-color: color-mix(in srgb, var(--page-c, var(--accent)) 55%, var(--border)); color: var(--text); }
.mk-tab.cur { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }
.mk-tab.cur small { background: var(--panel); }
.mk-tab:disabled { cursor: default; opacity: .6; }
.mk-tab.done { opacity: .75; }
.mk-tab .ico { width: 13px; height: 13px; }
.mk-rough { display: inline-flex; align-items: center; gap: .35rem; }
.mk-rough .ico { width: 15px; height: 15px; }
.mk-quit { color: var(--muted); }
.mk-timer { min-width: 8.6rem; }
.mk-timer .tg { font-size: var(--fs-2xs); }
.pr-timer.crit .t { color: var(--red); }
.mk-grid { display: grid; grid-template-columns: minmax(0, 1fr) 290px; gap: 1.25rem; align-items: start; }
.mk-main { min-width: 0; }
.mk-rail { display: grid; gap: 1rem; position: sticky; top: 84px; }
.mk-rail .pr-card { margin: 0; padding: 1rem 1.1rem; }
.mk-exam .pr-stim { top: 84px; max-height: calc(100vh - 104px); }
.mk-split { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
.mk-qcard .pr-qhead { flex-wrap: wrap; }
.mk-marks { font: 700 var(--fs-2xs) var(--mono); color: var(--muted); border: 1px solid var(--border); border-radius: var(--r-pill); padding: .05rem .5rem; }
.mk-actions .btn { display: inline-flex; align-items: center; gap: .35rem; }
.mk-markbtn.on { border-color: var(--purple); color: var(--purple); }
.mk-wide { width: 100%; justify-content: center; display: flex; align-items: center; gap: .35rem; }
.mk-secbox { display: grid; gap: .5rem; }
.mk-pal { display: grid; grid-template-columns: repeat(5, 1fr); gap: .4rem; }
.mk-pal button { aspect-ratio: 1.25; border-radius: var(--r-sm); border: 1px solid var(--border); background: var(--panel); font: 700 var(--fs-xs) var(--display); color: var(--muted); position: relative; cursor: pointer; padding: 0; }
.mk-pal button:hover { border-color: var(--accent); }
.mk-pal .na, .mk-sw.na { background: var(--red-soft); border-color: color-mix(in srgb, var(--red) 50%, transparent); color: var(--red); }
.mk-pal .an, .mk-sw.an { background: var(--green-soft); border-color: color-mix(in srgb, var(--green) 50%, transparent); color: var(--green); }
.mk-pal .mr, .mk-sw.mr { background: var(--purple-soft); border-color: color-mix(in srgb, var(--purple) 55%, transparent); color: var(--purple); border-radius: var(--r-pill); }
.mk-pal .am, .mk-sw.am { background: var(--purple-soft); border-color: color-mix(in srgb, var(--purple) 55%, transparent); color: var(--purple); border-radius: var(--r-pill); }
.mk-pal .am::after, .mk-sw.am::after { content: ""; position: absolute; right: 2px; bottom: 2px; width: 7px; height: 7px; border-radius: 50%; background: var(--green); border: 1.5px solid var(--panel); }
.mk-pal .cur { outline: 2px solid var(--accent); outline-offset: 1px; }
.mk-legend { display: grid; grid-template-columns: 1fr; gap: .3rem; margin-top: .8rem; font-size: var(--fs-xs); color: var(--muted); }
.mk-legend span { display: flex; align-items: center; gap: .5rem; }
.mk-legend b { margin-left: auto; color: var(--text); font-variant-numeric: tabular-nums; }
.mk-sw { display: inline-block; width: 16px; height: 13px; border-radius: 4px; border: 1px solid var(--border); background: var(--panel); position: relative; flex: none; }
.mk-sw.am::after { width: 6px; height: 6px; right: -2px; bottom: -2px; }
.mk-modal .pr-modal-box { width: min(560px, calc(100vw - 2rem)); }
.mk-ctable { margin-bottom: .7rem; }
.mk-ctable td, .mk-ctable th { padding: .35rem .5rem; }
.mk-modal p { margin: .4rem 0 1rem; }
.btn.primary.mk-danger { background: var(--red); }

/* result */
.mk-hero { row-gap: 1rem; }
.mk-rank { flex-basis: 100%; display: flex; align-items: center; gap: .55rem; padding-top: .8rem; border-top: 1px dashed var(--border); font-size: var(--fs-sm); color: var(--muted); }
.mk-rank b { color: var(--text); }
.mk-rank .ico { width: 18px; height: 18px; color: var(--amber); flex: none; }
.mk-two { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 1rem; align-items: start; }
.mk-two > .pr-card { margin-bottom: 1rem; }
.mk-heat { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: .45rem; }
.mk-hc { display: grid; grid-template-columns: 1fr auto; gap: 0 .4rem; padding: .5rem .65rem; border-radius: var(--r-sm); border: 1px solid var(--border); color: var(--text); text-decoration: none !important; min-width: 0; }
.mk-hc .nm { font-size: var(--fs-xs); font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mk-hc .v { font: 800 var(--fs-sm) var(--display); text-align: right; }
.mk-hc .s { grid-column: 1 / -1; font-size: var(--fs-2xs); color: var(--muted); }
.mk-hc.g { background: color-mix(in srgb, var(--green) var(--h, 18%), var(--panel)); border-color: color-mix(in srgb, var(--green) 40%, transparent); } .mk-hc.g .v { color: var(--green); }
.mk-hc.a { background: color-mix(in srgb, var(--amber) var(--h, 18%), var(--panel)); border-color: color-mix(in srgb, var(--amber) 40%, transparent); } .mk-hc.a .v { color: var(--amber); }
.mk-hc.r { background: color-mix(in srgb, var(--red) var(--h, 18%), var(--panel)); border-color: color-mix(in srgb, var(--red) 40%, transparent); } .mk-hc.r .v { color: var(--red); }
.mk-hc.none { border-style: dashed; } .mk-hc.none .v { color: var(--muted); font-weight: 600; font-size: var(--fs-xs); }
.mk-hc:hover { border-color: var(--accent); }
.mk-heat-key { display: flex; flex-wrap: wrap; gap: .3rem .9rem; margin-top: .7rem; font-size: var(--fs-2xs); color: var(--muted); }
.mk-heat-key i { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: .3rem; vertical-align: -1px; border: 1px solid var(--border); }
.mk-heat-key i.g { background: color-mix(in srgb, var(--green) 30%, var(--panel)); } .mk-heat-key i.a { background: color-mix(in srgb, var(--amber) 30%, var(--panel)); }
.mk-heat-key i.r { background: color-mix(in srgb, var(--red) 30%, var(--panel)); } .mk-heat-key i.none { border-style: dashed; }
.mk-sinks { display: grid; gap: .35rem; }
.mk-sink { display: grid; grid-template-columns: auto auto minmax(0, 1fr) 70px auto; gap: .6rem; align-items: center; padding: .45rem .6rem; border: 1px solid var(--border); border-radius: var(--r-sm); color: var(--text); text-decoration: none !important; }
.mk-sink:hover { border-color: var(--accent); }
.mk-sink .n { font: 800 var(--fs-sm) var(--display); color: var(--accent); }
.mk-sink .t { min-width: 0; font-size: var(--fs-xs); font-weight: 700; }
.mk-sink .t small { display: block; font-weight: 500; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mk-sink .bar { height: 6px; border-radius: var(--r-pill); background: var(--panel-2); overflow: hidden; }
.mk-sink .bar i { display: block; height: 100%; background: var(--amber); border-radius: var(--r-pill); }
.mk-sink .tm { font: 700 var(--fs-xs) var(--mono); text-align: right; white-space: nowrap; }
.mk-sink .tm small { display: block; font-weight: 400; color: var(--muted); font-size: var(--fs-2xs); }
.mk-filters { margin-bottom: .8rem; }
.pr-qrow[hidden] { display: none; }
.mk-flag { color: var(--purple); display: inline-flex; } .mk-flag .ico { width: 14px; height: 14px; }
.mk-stimd { margin: .5rem 0; }
.mk-stimd > summary { cursor: pointer; font-size: var(--fs-sm); color: var(--accent); display: inline-flex; align-items: center; gap: .3rem; }
.mk-stimd > summary .ico { width: 13px; height: 13px; }
.mk-stim-inline { position: static; max-height: none; margin-top: .5rem; border: 1px solid var(--border); border-radius: var(--r-md); }

@media (max-width: 1100px) {
  .mk-grid, .mk-split, .mk-two { grid-template-columns: minmax(0, 1fr); }
  .mk-rail, .mk-exam .pr-stim { position: static; max-height: none; }
  .mk-pal { grid-template-columns: repeat(auto-fill, minmax(42px, 1fr)); }
  .mk-legend { grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); }
}
@media (max-width: 640px) {
  .mk-bar { gap: .5rem; padding: .5rem 0; }
  .mk-title { flex-basis: 100%; }
  .mk-tabs { order: 5; flex-basis: 100%; }
  .mk-rough span, .mk-rough kbd { display: none; }
  .mk-timer { min-width: 0; margin-left: auto; }
  .mk-bar > .grow { display: none; }
  .mk-actions .btn { flex: 1 1 auto; justify-content: center; }
  .mk-actions .grow { display: none; }
  .mk-actions .btn.primary { flex-basis: 100%; }
  .mk-cards { grid-template-columns: minmax(0, 1fr); }
  .mk-sink { grid-template-columns: auto auto minmax(0, 1fr) auto; }
  .mk-sink .bar { display: none; }
  .mk-hist th:nth-child(4), .mk-hist td:nth-child(4), .mk-hist th:nth-child(6), .mk-hist td:nth-child(6) { display: none; }
}`;
    document.head.appendChild(st);
  }

  root.MockPage = MockPage;
  MockPage.build = buildPaper;
  MockPage.topicsOf = topicsOf;
  MockPage.score = scoreRun;
})();
