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
    const swapLabel = (l, s = 0) => l[s];
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
    const persist = () => { if (R && view !== "suspended") ssx.set(RUNK, R); };
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
    function cardHTML(p, primary) {
      const st = statsFor(p.id), n = totalQ(p), mins = totalMin(p);
      const secs = p.sections.map((s) => `<li><i style="--sc:var(${SEC_VAR[s.sec] || "--accent"})"></i>${esc(s.title)} <b>${s.count}</b></li>`).join("");
      return `<li class="mk-row">
        <div class="mk-r-main"><h3>${esc(p.name)}${p.company ? `<span class="mk-co">${esc(p.company)}</span>` : `<span class="mk-co">${p.kind === "section" ? "Sectional" : "Mixed"}</span>`}${p.negative ? `<span class="mk-neg">${esc(negShort(p.negative))}</span>` : ""}</h3>
          <p class="mk-blurb">${esc(p.blurb || "")}</p>
          <ul class="mk-secs">${secs}</ul></div>
        <div class="mk-r-meta">${n} questions · ${mins} min${p.minutes ? "" : " (per section)"}<small>${st ? `Best ${scoreTxt(st.best.score)}/${st.best.max} · ${plural(st.n, "attempt")}` : "Not attempted yet"}</small></div>
        <a class="btn${primary ? " primary" : ""} mk-start" href="#start/${encodeURIComponent(p.id)}" aria-label="Start ${esc(p.name)}">Start</a></li>`;
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
      const gf = galleryFilter();
      const chips = [["all", "All"], ["company", "Company"], ["section", "Sectional"], ["full", "Full"]];
      main.innerHTML = `<div>
        <h1 class="pr-h1">Mock tests</h1>
        <p class="lead">Timed, exam-style tests with section timers, a question palette and negative marking where the real test has it. Every answer also counts towards your practice stats.</p>
        ${liveBanner()}
        <div class="pr-picks mk-gfilter" role="group" aria-label="Filter tests">${chips.map(([k, t]) => `<button type="button" class="pr-pick${gf === k ? " on" : ""}" data-act="gfilter" data-f="${k}" aria-pressed="${gf === k}">${t}</button>`).join("")}</div>
        ${groups.map(([k, t, sub]) => {
          const ps = presets().filter((p) => (p.kind || "company") === k);
          return ps.length ? `<section class="mk-group" data-kind="${k}"${gf !== "all" && gf !== k ? " hidden" : ""}><div class="mk-gh"><h2>${t}</h2><span class="muted small">${sub}</span></div><ul class="mk-list">${ps.map((p) => cardHTML(p, p.id === "quick-15" && !(R && !R.done))).join("")}</ul></section>` : "";
        }).join("")}
        <section class="mk-group"><div class="mk-gh"><h2>Your mock history</h2>${ms.length > 8 ? `<a class="small" href="#history">See all ${ms.length}</a>` : ""}</div>
          <div class="pr-card">${ms.length ? historyTable(ms.slice(0, 8)) : `<p class="muted" style="margin:0">No mocks yet. Start with <a href="#start/quick-15">Quick 15</a> to get a feel for the exam screen.</p>`}</div></section>
      </div>`;
      window.scrollTo(0, 0);
    }
    function galleryFilter() { const v = ssx.get("apt:mock:gf"); return ["company", "section", "full"].includes(v) ? v : "all"; }
    function setGalleryFilter(f) {
      ssx.set("apt:mock:gf", f);
      main.querySelectorAll(".mk-gfilter .pr-pick").forEach((b) => { const on = b.dataset.f === f; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); });
      main.querySelectorAll(".mk-group[data-kind]").forEach((g) => { g.hidden = !(f === "all" || g.dataset.kind === f); });
    }
    function historyView() {
      view = "history";
      const ms = mocks().slice().reverse();
      main.innerHTML = `<div><div class="pr-sbar"><a class="pr-back" href="#">${ic("back")} Mock tests</a></div>
        <h1 class="pr-h1">Your mock history</h1>
        <p class="lead">${ms.length ? plural(ms.length, "finished mock") + ", newest first." : "Nothing here yet."}</p>
        <div class="pr-card">${ms.length ? historyTable(ms) : `<p class="muted" style="margin:0"><a href="#">Pick a test</a> to start.</p>`}</div></div>`;
      window.scrollTo(0, 0);
    }

    /* ================================================================ INSTRUCTIONS */
    let pendingStart = null, freshId = null;
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
      main.innerHTML = `<div>
        <div class="pr-sbar"><a class="pr-back" href="#">${ic("back")} All mock tests</a></div>
        <h1 class="pr-h1">${esc(p.name)}</h1>
        <p class="lead">${esc(p.blurb || "")}</p>
        ${live ? `<div class="pr-card pr-resume mk-live">${ic("warn")}<div><b>${esc(R.p.name)} is still in progress</b><div class="muted small">Starting a new test discards it.</div></div><span class="grow"></span><a class="btn" href="#run">Resume that test</a></div>` : ""}
        <div class="pr-setup">
          <div>
            <div class="pr-card"><h5>Sections</h5><div class="pr-tbl-wrap"><table class="pr-table mk-setup-t"><thead><tr><th>Section</th><th>Questions</th><th>Time</th><th>Draws from</th></tr></thead><tbody>${rows}</tbody></table></div></div>
            <details class="pr-card mk-more" open><summary>How the test works</summary><ul class="mk-rules">
              <li>${ic("clock")}<span><b>${totalMin(p)} minutes</b> for ${totalQ(p)} questions. ${esc(lockTxt)}</span></li>
              <li>${ic("check")}<span><b>+${p.marks || 1}</b> for each right answer. <b>${esc(negTxt(p.negative))}</b>${p.negative ? ". Leave a question blank rather than guess blindly." : ". Answer every question, even a guess."}</span></li>
              <li>${ic("timer")}<span>You get a warning at 5 minutes and at 1 minute. At 0:00 the ${secMode ? "section ends" : "test is submitted"} automatically.</span></li>
              <li>${ic("flag")}<span>The palette shows each question's state: not visited, not answered, answered, marked for review, and answered &amp; marked. Marked answers are still scored.</span></li>
              <li>${ic("pencil")}<span>The rough-work pad opens with <kbd>W</kbd>. ${p.calculator ? "This test allows an on-screen calculator, so the pad's calculator is fair game." : "The real test has no calculator: turn on <b>Exam mode</b> in the pad to hide its calculator."}</span></li>
              <li>${ic("keyboard")}<span><kbd>1</kbd>–<kbd>4</kbd> or <kbd>A</kbd>–<kbd>D</kbd> choose (press again to clear), <kbd>Enter</kbd> save &amp; next, <kbd>M</kbd> mark for review, <kbd>Backspace</kbd> clear response, <kbd>←</kbd> <kbd>→</kbd> move.</span></li>
              <li>${ic("restart")}<span>The page hides the header while the test runs. Reloading the page resumes the test with the clock still running.</span></li>
            </ul>${p.note ? `<p class="mk-note">${ic("bulb")}<span>${esc(p.note)}</span></p>` : ""}</details>
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
    let palOpen = false;
    window.addEventListener("beforeunload", (e) => {
      if (view === "run" && R && !R.done) { e.preventDefault(); e.returnValue = ""; return ""; }
    });
    function enterFocus() {
      if (document.body.classList.contains("mk-focus")) return;
      document.body.classList.add("mk-focus");
      document.body.classList.add("in-session");
    }
    function exitFocus() {
      if (!document.body.classList.contains("mk-focus")) return;
      document.body.classList.remove("mk-focus");
      document.body.classList.remove("in-session");
      palOpen = false;
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
    function paint(fresh, enter) {
      if (!R || view !== "run") return;
      const y = window.scrollY;
      main.innerHTML = examHTML();
      if (fresh) {
        const q = getQ(R.items[R.idx].id);
        if (root.RoughPad && RoughPad.setContext) RoughPad.setContext("mock:" + q.id);
        window.scrollTo(0, 0);
        if (enter && root.Motion && Motion.enter) { const qe = document.getElementById("mkQ"); if (qe) Motion.enter(qe); }
      } else window.scrollTo(0, y);
      tick();
    }
    // fullscreen toggle: common.js handles every [data-fs-btn] click and repaints it when the state changes
    function fsBtn(cls) {
      const F = root.Fullscreen;
      let ok = false, on = false;
      try { ok = !!(F && F.supported && F.supported()); on = !!(F && F.active && F.active()); } catch (e) {}
      if (!ok) return "";
      const t = on ? "Exit fullscreen" : "Fullscreen";
      return `<button type="button" class="${cls}" data-fs-btn="act" aria-pressed="${on}" title="${t}" aria-label="${t}">${ic(on ? "collapse" : "expand")}<span>${t}</span></button>`;
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
          <button class="btn t-hide" data-act="clear"${a == null ? " disabled" : ""}>Clear response</button>
          <button class="btn t-hide mk-markbtn${marked ? " on" : ""}" data-act="marknext">${swapLabel(["Mark for review &amp; next", "Unmark &amp; next"], marked ? 1 : 0)}</button>
          <span class="grow"></span>
          <button class="btn primary t-hide" data-act="next">${swapLabel(["Save &amp; next", "Save &amp; next section", "Save &amp; submit"], ["Save & next", "Save & next section", "Save & submit"].indexOf(nextLbl))} <kbd>Enter</kbd></button>
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
      const sessRail = `<aside class="session-rail" aria-label="Exam controls">
        <div class="sr-top"><button type="button" class="sr-end" data-act="submit" title="End the test and submit">${ic("x")} End</button>
          <div class="mk-rt" id="mkRT" title="${sectional() ? "Time left in this section" : "Time left"}">0:00</div></div>
        <div class="sr-sec">${nonEmpty().length > 1 ? p.sections.map((sx, si) => {
          const [f2, l2] = range(si);
          if (f2 < 0) return "";
          const c2 = counts(f2, l2), cur = si === R.sec;
          return `<button type="button" class="sr-tab${cur ? " on" : ""}" data-act="tab" data-s="${si}"${!cur && locked() ? " disabled" : ""} aria-pressed="${cur}"><span>${esc(sx.title)}</span><small>${c2.an + c2.am}/${c2.n}</small></button>`;
        }).join("") : ""}</div>
        <div class="sr-mid">
          <button type="button" data-act="pal" aria-expanded="${palOpen}" class="${palOpen ? "on" : ""}">${ic("list")} Palette</button>
          <button type="button" data-act="rough" title="Rough-work pad (W)">${ic("pencil")} Rough</button>
          ${fsBtn("")}
          <button type="button" data-act="clear"${a == null ? " disabled" : ""}>Clear</button>
          <button type="button" data-act="mark" class="${marked ? "on" : ""}" aria-pressed="${marked}">${ic("flag")} ${marked ? "Unmark" : "Mark"}</button>
        </div>
        <button type="button" class="sr-go" data-act="next">${nextLbl.replace("&", "&amp;")}</button></aside>
        <div class="mk-palpop${palOpen ? " open" : ""}" id="mkPalPop"><h5>${esc(sec.title)} <small>${c.an + c.am} of ${c.n} answered</small></h5>${paletteHTML(f, l)}${legendHTML(c)}
          ${locked() && !lastSec ? `<button class="btn mk-wide" data-act="nextsec">Finish section ${ic("arrow-right")}</button>` : ""}
          <button class="btn mk-wide" data-act="quit">Quit without saving</button></div>`;
      const bar = `<div class="mk-bar">
        <div class="mk-title"><b>${esc(p.name)}</b><span>${locked() ? `Section ${nonEmpty().indexOf(s) + 1} of ${nonEmpty().length}` : "Sections open"} · ${esc(negShort(p.negative))}</span></div>
        ${tabsHTML()}<span class="grow"></span>
        <button type="button" class="btn sm mk-rough" data-act="rough" title="Rough-work pad (W)">${ic("pencil")}<span>Rough</span> <kbd>W</kbd></button>
        ${timerHTML()}
        ${fsBtn("btn sm mk-fs")}
        <button type="button" class="btn sm mk-quit" data-act="quit" title="Quit without saving">Quit</button>
      </div>`;
      return `<div class="mk-exam">${bar}<div class="mk-grid"><div class="mk-main">${mainCol}</div>${rail}</div>${sessRail}</div>`;
    }

    function tick() {
      if (view !== "run" || !R || R.done) return;
      const rem = remaining(), dur = durMs();
      const t = document.getElementById("mkT");
      if (t) {
        t.textContent = mmss(Math.ceil(Math.max(0, rem) / 1000));
        const ttl = t.textContent + " \u00b7 " + R.p.name;
        if (document.title !== ttl) document.title = ttl;
        const ring = document.getElementById("mkRing"), box = document.getElementById("mkTimer");
        ring.style.strokeDashoffset = String(RING * clamp(1 - rem / dur, 0, 1));
        box.classList.toggle("over", rem <= 5 * 60000 && rem > 60000);
        box.classList.toggle("crit", rem <= 60000);
        const rt = document.getElementById("mkRT");
        if (rt) { rt.textContent = t.textContent; rt.classList.toggle("over", rem <= 5 * 60000 && rem > 60000); rt.classList.toggle("crit", rem <= 60000); }
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
      paint(true, true);
    }
    function choose(k) {
      const q = getQ(R.items[R.idx].id);
      if (k < 0 || k >= q.opts.length) return;
      if (R.ans[R.idx] === k) delete R.ans[R.idx]; else R.ans[R.idx] = k;
      persist();
      paint(false);
    }
    function clearResp() { if (R.ans[R.idx] == null) return; delete R.ans[R.idx]; persist(); paint(false); }
    function toggleMark() {
      if (R.mark[R.idx]) delete R.mark[R.idx]; else R.mark[R.idx] = true;
      persist(); paint(false);
      if (R.mark[R.idx] && root.stamp) main.querySelectorAll('[data-act="mark"]').forEach((b) => stamp(b));
    }
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
      freshId = res.id;
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

      main.innerHTML = `<div>
        <div class="pr-sbar"><a class="pr-back" href="#">${ic("back")} Mock tests</a><div class="pr-crumb"><b>${esc(m.name || p.name)}</b> <span class="sep">·</span> ${esc(dateTxt(m.at))}</div><span class="grow"></span><span class="pr-chip mode">${esc(negShort(m.negative))}</span></div>
        <h1 class="pr-h1">Your result</h1>
        <div class="pr-card pr-hero is-hero mk-hero${pct >= 80 ? " hot" : ""}">
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
        <div class="pr-actions pr-final mk-final">
          <a class="btn" href="#start/${encodeURIComponent(m.preset)}?seed=${encodeURIComponent(m.seed)}">${ic("restart")} Retake same paper</a>
          <a class="btn" href="#start/${encodeURIComponent(m.preset)}">New paper</a>
          ${nBad + nSkip ? `<button class="btn" data-act="mistakes" data-id="${esc(m.id)}">${swapLabel(["Add wrong to mistake book", "Added to mistake book"], 0)}</button>` : ""}
          <span class="grow"></span><a class="btn primary" href="#">All mock tests</a></div></div>`;
      window.scrollTo(0, 0);
      const fresh = freshId === m.id;
      freshId = null;
      const sc = main.querySelector(".pr-score b");
      if (sc && root.Motion && Motion.on && Motion.on() && Motion.countUp) Motion.countUp(sc, m.score, { ms: 700, fmt: scoreTxt });
      if (fresh && root.Motion && Motion.on && Motion.on()) {
        const hero = main.querySelector(".mk-hero");
        if (pct >= 80 && Motion.confetti) { const r = hero ? hero.getBoundingClientRect() : { left: innerWidth / 2, top: 120, width: 0, height: 0 }; Motion.confetti({ x: r.left + r.width / 2, y: r.top + Math.min(r.height / 2, 80) }); }
        if (others.length && others.every((x) => x.score < m.score) && Motion.celebrate) Motion.celebrate("best", "New best");
      }
    }
    function applyFilter(f, btn) {
      main.querySelectorAll(".mk-filters .pr-pick").forEach((b) => b.classList.toggle("on", b.dataset.f === f));
      main.querySelectorAll("#mkList .pr-qrow").forEach((d) => {
        const show = f === "all" || d.dataset.st === f || d.dataset.s === f || (f === "m" && d.dataset.m === "1");
        d.hidden = !show;
      });
      if (btn && btn.closest("table")) { const l = document.getElementById("mkList"); if (l) l.scrollIntoView({ block: "start" }); }
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
      if (btn) { btn.textContent = "Added to mistake book"; if (root.stamp) stamp(btn); }
      toast(plural(n, "question") + " (wrong and not attempted) in your mistake book", 2000, "check");
    }

    /* ================================================================ events */
    main.addEventListener("click", (e) => {
      const el = e.target.closest("[data-act]");
      if (!el || !main.contains(el) || el.disabled) return;
      const act = el.dataset.act;
      if (act === "discard") { R = null; ssx.del(RUNK); return route(); }
      if (view === "start" && act === "begin") return begin();
      if (view === "gallery" && act === "gfilter") return setGalleryFilter(el.dataset.f);
      if (view === "run" && R) {
        if (act === "opt") return choose(+el.dataset.i);
        if (act === "next") return saveNext();
        if (act === "prev") return step(-1);
        if (act === "clear") return clearResp();
        if (act === "mark") return toggleMark();
        if (act === "marknext") return markNext();
        if (act === "go") { palOpen = false; return goTo(+el.dataset.i); }
        if (act === "tab") return switchTab(+el.dataset.s);
        if (act === "nextsec") return nextSectionFlow();
        if (act === "submit") return submitFlow();
        if (act === "quit") return quitFlow();
        if (act === "pal") { palOpen = !palOpen; return paint(false); }
        if (act === "rough") { if (root.RoughPad && RoughPad.toggle) RoughPad.toggle(); return; }
      }
      if (view === "result") {
        if (act === "filter") return applyFilter(el.dataset.f, el);
        if (act === "mistakes") return addMistakes(el.dataset.id, el);
        if (act === "row") {
          e.preventDefault();
          applyFilter("all");
          const d = document.getElementById("mkRow" + el.dataset.i);
          if (d) { d.open = true; d.scrollIntoView({ block: "center" }); }
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

    /* the app shell (fullscreen) replaces this page with a frame of itself: save the exam, stop the timer, and stay inert
       (no ticks, no time-up submit, no routing, no unload prompt). The frame continues the same exam from sessionStorage. */
    document.addEventListener("apt:suspend", () => {
      try { if (R) { flush(); persist(); } } catch (e) {}
      clearInterval(T.iv); T.iv = null;
      view = "suspended";
    });
    window.addEventListener("hashchange", () => { if (view !== "suspended") safeRoute(); });
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
/* calm: flat cards, no lifts, one loud thing (.btn.primary / .is-hero) */
.mk .pr-card, .mk .mk-list, .mk .pr-qrow, .mk .pr-stim { box-shadow: none; border: 2px solid var(--line); }
.mk .pr-card.is-hero { border-width: 3px; box-shadow: 6px 6px 0 var(--ink); }
.mk .btn:not(.primary), .mk .pr-back, .mk-modal .btn:not(.primary) { box-shadow: none; border: 2px solid var(--line-control) !important; transform: none !important; text-transform: none; letter-spacing: 0; font-weight: 800; min-height: 44px; display: inline-flex; align-items: center; justify-content: center; gap: .35rem; }
.mk .btn:not(.primary):hover, .mk .pr-back:hover, .mk-modal .btn:not(.primary):hover { background: var(--panel-2); color: var(--text); box-shadow: none; transform: none !important; }
.mk .btn.primary, .mk-modal .btn.primary { min-height: 44px; text-transform: none; letter-spacing: 0; display: inline-flex; align-items: center; justify-content: center; gap: .4rem; }
.mk .btn.sm { min-height: 44px; }
.mk h2, .mk h3 { text-transform: none; font-weight: 800; letter-spacing: 0; }
.mk h5 { font: 700 12px var(--mono); text-transform: uppercase; letter-spacing: .04em; color: var(--muted); }
.mk .lead { max-width: 62ch; }
.mk-group { margin: 1.8rem 0 .6rem; }
.mk-gh { display: flex; align-items: baseline; gap: .8rem; flex-wrap: wrap; margin-bottom: .6rem; }
.mk-gh h2 { margin: 0; border: 0; padding: 0; font-family: var(--display); font-size: var(--fs-xl); }
.mk-list { list-style: none; margin: 0; padding: 0; background: var(--panel); }
.mk-row { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; gap: .4rem 1.4rem; align-items: center; padding: .9rem 1.1rem; border-bottom: 2px solid var(--line); }
.mk-row:last-child { border-bottom: 0; }
.mk-row:hover { background: var(--panel-2); }
.mk-r-main { min-width: 0; }
.mk-r-main h3 { margin: 0; font: 800 var(--fs-md) var(--display); display: flex; flex-wrap: wrap; align-items: center; gap: .2rem .6rem; }
.mk-co { font: 700 12px var(--mono); text-transform: uppercase; letter-spacing: .04em; color: var(--muted); }
.mk-neg { font: 700 12px var(--mono); color: var(--muted); }
.mk-blurb { margin: .15rem 0 0; font-size: var(--fs-sm); color: var(--muted); line-height: 1.45; }
.mk-secs { list-style: none; margin: .35rem 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: .15rem 1rem; font-size: var(--fs-xs); color: var(--muted); }
.mk-secs li { display: inline-flex; align-items: center; gap: .35rem; }
.mk-secs li i { width: 10px; height: 10px; border: 1.5px solid var(--line); background: var(--sc); flex: none; }
.mk-secs li b { color: var(--text); font-family: var(--mono); }
html .mk .mk-secs { border-top: 0; padding-top: 0; }
html .mk .mk-rank { border-top: 2px solid var(--line); }
.mk-r-meta { font: 700 13px var(--mono); text-align: right; white-space: nowrap; }
.mk-r-meta small { display: block; font: 600 12px var(--mono); color: var(--muted); }
.mk-live { border-color: var(--line); background: var(--amber-soft); }
.mk-live > .ico { width: 22px; height: 22px; flex: none; }
.mk-hist td { white-space: nowrap; }
.mk-hist td.pn { white-space: normal; }
.mk-rules { list-style: none; margin: 0; padding: 0; display: grid; gap: .7rem; }
.mk-rules li { display: flex; gap: .7rem; align-items: flex-start; line-height: 1.55; }
.mk-rules li > .ico { width: 18px; height: 18px; flex: none; margin-top: .2rem; color: var(--muted); }
.mk-more { margin-bottom: 1rem; }
.mk-more > summary { cursor: pointer; font-weight: 800; min-height: 44px; display: flex; align-items: center; }
.mk-note { display: flex; gap: .5rem; align-items: flex-start; margin: 1rem 0 0; padding: .7rem .9rem; border: 2px solid var(--line); background: var(--green-soft); font-size: var(--fs-sm); }
.mk-note .ico { width: 17px; height: 17px; flex: none; margin-top: .15rem; }
.mk-alt { width: 100%; margin-top: .5rem; }
.mk .pr-start .pr-go { width: 100%; font-size: var(--fs-md); }
.mk .pr-start .pr-big b { font: 900 2.6rem var(--display); }
.mk .pr-chip { box-shadow: none; }

/* exam screen (focus mode: header hidden, motion off) */
body.mk-focus { --top-h: 0px; background-image: none; }
body.mk-focus #topbar { display: none; }
body.mk-focus .page.mk { max-width: 1440px; padding-top: 0; }
.mk-bar { position: sticky; top: 0; z-index: 30; display: flex; align-items: center; gap: .6rem 1rem; flex-wrap: wrap; padding: .65rem 0; margin-bottom: 1rem;
  background: var(--bg); border-bottom: 2px solid var(--line); }
.mk-title { display: flex; flex-direction: column; line-height: 1.25; min-width: 0; }
.mk-title b { font: 800 var(--fs-md) var(--display); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mk-title span { font: 600 12px var(--mono); color: var(--muted); }
.mk-tabs { display: flex; gap: .35rem; overflow-x: auto; scrollbar-width: none; min-width: 0; max-width: 100%; }
.mk-tabs::-webkit-scrollbar { display: none; }
.mk-tab { border: 2px solid var(--line-control); background: var(--panel); color: var(--text); border-radius: 0; padding: .3rem .8rem; min-height: 44px; font: 800 var(--fs-sm) var(--display); white-space: nowrap; display: inline-flex; align-items: center; gap: .4rem; cursor: pointer; flex: none; }
.mk-tab small { font: 700 12px var(--mono); color: var(--muted); }
.mk-tab:hover:not(:disabled) { background: var(--panel-2); }
.mk-tab.cur { background: var(--ink); color: var(--bg); }
.mk-tab.cur small { color: inherit; }
.mk-tab:disabled { cursor: default; opacity: .6; }
.mk-tab.done { opacity: .75; }
.mk-tab .ico { width: 13px; height: 13px; }
.mk-rough { display: inline-flex; align-items: center; gap: .35rem; }
.mk-rough .ico { width: 15px; height: 15px; }
.mk-quit { color: var(--muted); }
.mk-fs { display: inline-flex; align-items: center; gap: .35rem; } .mk-fs .ico { width: 15px; height: 15px; }
@media (max-width: 640px) { .mk-fs span { display: none; } }
.mk-timer { min-width: 8.6rem; box-shadow: none; border: 2px solid var(--line); background: var(--panel); }
.mk-timer .t, .session-rail .mk-rt { font-family: var(--mono); font-weight: 700; }
.mk-timer .tg { font-size: 12px; }
.pr-timer.crit .t { color: var(--red); }
.mk-grid { display: grid; grid-template-columns: minmax(0, 1fr) 290px; gap: 1.25rem; align-items: start; }
.mk-main { min-width: 0; }
.mk-rail { display: grid; gap: 1rem; position: sticky; top: 84px; }
.mk-rail .pr-card { margin: 0; padding: 1rem 1.1rem; }
.mk-exam .pr-stim { top: 84px; max-height: calc(100vh - 104px); }
.mk-split { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
.mk-qcard .pr-qhead { flex-wrap: wrap; }
.mk-marks { font: 700 12px var(--mono); color: var(--muted); border: 2px solid var(--line); padding: .05rem .5rem; }
.mk-actions .btn { display: inline-flex; align-items: center; gap: .35rem; }
.mk-markbtn.on { background: var(--purple-soft); }
.mk-exam .pr-opt { box-shadow: none; transform: none; border: 2px solid var(--line-control); background: var(--panel); min-height: 52px; }
.mk-exam .pr-opt:hover:not(:disabled) { background: var(--panel-2); transform: none; box-shadow: none; }
.mk-exam .pr-opt.sel, .mk-exam .pr-opt.sel:hover { background: var(--ink); color: var(--bg); transform: none; box-shadow: none; }
.mk-exam .pr-opt.sel .k { background: var(--bg); color: var(--ink); border-color: var(--bg); }
.mk-exam .pr-icon { min-width: 44px; min-height: 44px; }
.mk-wide { width: 100%; justify-content: center; display: flex; align-items: center; gap: .35rem; }
.mk-secbox { display: grid; gap: .5rem; }
.mk-pal { display: grid; grid-template-columns: repeat(auto-fill, minmax(44px, 1fr)); gap: .4rem; }
.mk-pal button { aspect-ratio: 1; min-width: 0; min-height: 44px; width: 100%; border-radius: 0; border: 2px solid var(--line-control); background: var(--panel); font: 700 var(--fs-xs) var(--mono); color: var(--text); position: relative; cursor: pointer; padding: 0; }
.mk-pal button:hover { background: var(--panel-2); }
.mk-pal .na, .mk-sw.na { background: var(--red-soft); color: var(--text); }
.mk-pal .an, .mk-sw.an { background: var(--green-soft); color: var(--text); }
.mk-pal .mr, .mk-sw.mr { background: var(--purple-soft); color: var(--text); border-radius: 50%; }
.mk-pal .am, .mk-sw.am { background: var(--purple-soft); color: var(--text); border-radius: 50%; }
.mk-pal .am::after, .mk-sw.am::after { content: ""; position: absolute; right: 2px; bottom: 2px; width: 8px; height: 8px; border-radius: 50%; background: var(--green); border: 1.5px solid var(--line-control); }
.mk-pal .cur { outline: 3px solid var(--accent); outline-offset: 1px; }
.mk-legend { display: grid; grid-template-columns: 1fr; gap: .3rem; margin-top: .8rem; font-size: var(--fs-xs); color: var(--muted); }
.mk-legend span { display: flex; align-items: center; gap: .5rem; }
.mk-legend b { margin-left: auto; color: var(--text); font-family: var(--mono); }
.mk-sw { display: inline-block; width: 16px; height: 13px; border: 1.5px solid var(--line-control); background: var(--panel); position: relative; flex: none; }
.mk-sw.am::after { width: 6px; height: 6px; right: -2px; bottom: -2px; }
.mk-modal .pr-modal-box { width: min(560px, calc(100vw - 2rem)); box-shadow: none; border: 3px solid var(--line); }
.mk-ctable { margin-bottom: .7rem; }
.mk-ctable td, .mk-ctable th { padding: .35rem .5rem; }
.mk-modal p { margin: .4rem 0 1rem; }
.btn.primary.mk-danger { background: var(--red); }

/* result */
.mk-hero { row-gap: 1rem; }
.mk-rank { flex-basis: 100%; display: flex; align-items: center; gap: .55rem; padding-top: .8rem; border-top: 2px solid var(--line); font-size: var(--fs-sm); color: var(--muted); }
.mk-rank b { color: var(--text); }
.mk-rank .ico { width: 18px; height: 18px; flex: none; }
.mk .pr-score b, .mk .pr-stats b { font-family: var(--mono); }
.mk-two { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 1rem; align-items: start; }
.mk-two > .pr-card { margin-bottom: 1rem; }
.mk-heat { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: .45rem; }
.mk-hc { display: grid; grid-template-columns: 1fr auto; gap: 0 .4rem; padding: .5rem .65rem; min-height: 44px; border: 2px solid var(--line); color: var(--text); text-decoration: none !important; min-width: 0; background: var(--panel); }
.mk-hc .nm { font-size: var(--fs-xs); font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mk-hc .v { font: 700 var(--fs-sm) var(--mono); text-align: right; }
.mk-hc .s { grid-column: 1 / -1; font: 600 12px var(--mono); color: var(--muted); }
.mk-hc.g { background: var(--green-soft); }
.mk-hc.a { background: var(--amber-soft); }
.mk-hc.r { background: var(--red-soft); }
.mk-hc.none { border-style: dashed; } .mk-hc.none .v { color: var(--muted); font-weight: 600; font-size: var(--fs-xs); }
.mk-hc:hover { background-color: var(--panel-2); }
.mk-heat-key { display: flex; flex-wrap: wrap; gap: .3rem .9rem; margin-top: .7rem; font-size: var(--fs-xs); color: var(--muted); }
.mk-heat-key i { display: inline-block; width: 10px; height: 10px; margin-right: .3rem; vertical-align: -1px; border: 1.5px solid var(--line); }
.mk-heat-key i.g { background: var(--green-soft); } .mk-heat-key i.a { background: var(--amber-soft); }
.mk-heat-key i.r { background: var(--red-soft); } .mk-heat-key i.none { border-style: dashed; }
.mk-sinks { display: grid; gap: .35rem; }
.mk-sink { display: grid; grid-template-columns: auto auto minmax(0, 1fr) 70px auto; gap: .6rem; align-items: center; padding: .45rem .6rem; min-height: 44px; border: 2px solid var(--line); color: var(--text); text-decoration: none !important; }
.mk-sink:hover { background: var(--panel-2); }
.mk-sink .n { font: 700 var(--fs-sm) var(--mono); }
.mk-sink .t { min-width: 0; font-size: var(--fs-xs); font-weight: 700; }
.mk-sink .t small { display: block; font-weight: 500; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mk-sink .bar { height: 8px; border: 1.5px solid var(--line); background: var(--panel); overflow: hidden; }
.mk-sink .bar i { display: block; height: 100%; background: var(--ink); }
.mk-sink .tm { font: 700 var(--fs-xs) var(--mono); text-align: right; white-space: nowrap; }
.mk-sink .tm small { display: block; font-weight: 400; color: var(--muted); font-size: 12px; }
.mk-filters { margin-bottom: .8rem; }
.mk .pr-pick { border: 2px solid var(--line-control); background: var(--panel); color: var(--text); box-shadow: none; min-height: 44px; border-radius: 0; }
.mk .pr-pick:hover:not(:disabled) { background: var(--panel-2); color: var(--text); }
.mk .pr-pick.on, .mk .pr-pick.on:hover { background: var(--ink); color: var(--bg); box-shadow: none; }
.mk .pr-pick.on small { color: inherit; }
.pr-qrow[hidden] { display: none; }
.mk-flag { display: inline-flex; } .mk-flag .ico { width: 14px; height: 14px; }
.mk-stimd { margin: .5rem 0; }
.mk-stimd > summary { cursor: pointer; font-size: var(--fs-sm); display: inline-flex; align-items: center; gap: .3rem; min-height: 44px; }
.mk-stimd > summary .ico { width: 13px; height: 13px; }
.mk-stim-inline { position: static; max-height: none; margin-top: .5rem; border: 2px solid var(--line); }
.mk-final { margin-top: 1rem; }

/* tablet session rail (contract: aside.session-rail on the html[data-hand] side) */
.session-rail { display: none; }
.mk-palpop { display: none; }
html[data-device="tablet"] body.in-session .session-rail {
  display: flex; flex-direction: column; gap: .5rem; position: fixed; top: 0; bottom: 0; right: 0; z-index: 60;
  width: var(--rail-w-session, 132px); padding: .6rem; background: var(--panel); border-left: 3px solid var(--line); box-sizing: border-box; }
html[data-device="tablet"][data-hand="left"] body.in-session .session-rail { right: auto; left: 0; border-left: 0; border-right: 3px solid var(--line); }
html[data-device="tablet"] body.in-session .page.mk { max-width: none; width: auto; margin: 0; box-sizing: border-box; --mk-side: max(28px, calc((100% - var(--rail-w-session, 132px) - 904px) / 2));
  padding: 24px calc(var(--rail-w-session, 132px) + var(--mk-side)) 96px var(--mk-side) !important; }
html[data-device="tablet"][data-hand="left"] body.in-session .page.mk { padding: 24px var(--mk-side) 96px calc(var(--rail-w-session, 132px) + var(--mk-side)) !important; }
.session-rail .sr-top { display: grid; gap: .5rem; }
.session-rail .sr-mid { display: grid; gap: .5rem; align-content: end; margin-top: auto; overflow-y: auto; min-height: 0; }
.session-rail .sr-sec { display: grid; gap: .35rem; align-content: start; overflow-y: auto; min-height: 0; }
.session-rail button { min-height: 52px; border: 2px solid var(--line-control); background: var(--panel); color: var(--text); font: 800 var(--fs-sm) var(--display); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: .35rem; padding: .25rem .4rem; border-radius: 0; text-align: center; line-height: 1.15; }
.session-rail button:hover:not(:disabled) { background: var(--panel-2); }
.session-rail button:disabled { opacity: .45; cursor: default; }
.session-rail button.on, .session-rail button.on:hover:not(:disabled) { background: var(--ink); color: var(--bg); }
.session-rail .sr-tab { min-height: 44px; font-size: 13px; flex-direction: column; gap: 0; }
.session-rail .sr-tab small { font: 700 11px var(--mono); }
.session-rail .sr-end { color: var(--red); }
.session-rail .mk-rt { display: flex; align-items: center; justify-content: center; min-height: 52px; border: 2px solid var(--line); font-size: 1.35rem; background: var(--panel); }
.session-rail .mk-rt.over { background: var(--amber-soft); }
.session-rail .mk-rt.crit { background: var(--red-soft); }
.session-rail button.sr-go { min-height: 112px; background: var(--accent); color: #fff; border: 3px solid var(--ink); box-shadow: 4px 4px 0 var(--ink); font-size: 1.05rem; font-weight: 900; flex: none; flex-direction: column; }
[data-theme="dark"] .session-rail button.sr-go { color: var(--on-fill); }
.session-rail .ico { width: 18px; height: 18px; }
html[data-device="tablet"] body.in-session .mk-palpop.open {
  display: block; position: fixed; top: .6rem; right: calc(var(--rail-w-session, 132px) + .6rem); z-index: 61; width: min(340px, calc(100vw - 180px)); max-height: calc(100vh - 1.2rem); overflow-y: auto;
  background: var(--panel); border: 3px solid var(--line-control); padding: 1rem; box-sizing: border-box; }
html[data-device="tablet"][data-hand="left"] body.in-session .mk-palpop.open { right: auto; left: calc(var(--rail-w-session, 132px) + .6rem); }
.mk-palpop .mk-pal { grid-template-columns: repeat(auto-fill, minmax(48px, 1fr)); }
.mk-gfilter { margin: 1rem 0 0; }
.mk-palpop .btn { margin-top: .6rem; }
html[data-device="tablet"] body.in-session .mk-bar .mk-tabs,
html[data-device="tablet"] body.in-session .mk-bar .mk-timer,
html[data-device="tablet"] body.in-session .mk-bar .mk-rough,
html[data-device="tablet"] body.in-session .mk-bar .mk-quit,
html[data-device="tablet"] body.in-session .mk-bar > .grow,
html[data-device="tablet"] body.in-session .mk-rail,
html[data-device="tablet"] body.in-session .mk-actions .t-hide { display: none; }
html[data-device="tablet"] body.in-session .mk-grid { grid-template-columns: minmax(0, 1fr); }
html[data-device="tablet"] body.in-session .mk-bar { position: static; border-bottom: 0; padding: .75rem 0 0; }
html[data-device="tablet"] body.in-session .mk-exam .pr-qtext { font-size: 1.3rem; }
@media (orientation: landscape) { html[data-device="tablet"] body.in-session .mk-qcard { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: .5rem 1.5rem; align-items: start; }
  html[data-device="tablet"] body.in-session .mk-qcard > .pr-qhead, html[data-device="tablet"] body.in-session .mk-qcard > .pr-setnav, html[data-device="tablet"] body.in-session .mk-qcard > .mk-actions { grid-column: 1 / -1; }
  html[data-device="tablet"] body.in-session .mk-qcard .pr-opts { grid-column: 2; grid-row: 2 / span 2; }
  html[data-device="tablet"] body.in-session .mk-qcard .pr-qtext { grid-column: 1; grid-row: 2 / span 2; } }

/* portrait tablet: the session rail becomes a bottom bar */
html[data-device="tablet"][data-orient="portrait"] body.in-session { --sbar-h: 88px; }
html[data-device="tablet"][data-orient="portrait"] body.in-session .session-rail {
  top: auto; bottom: 0; left: 0; right: 0; width: auto; height: var(--sbar-h); flex-direction: row; align-items: stretch; gap: .5rem; padding: .5rem .6rem;
  border-left: 0; border-right: 0; border-top: 3px solid var(--line); }
html[data-device="tablet"][data-orient="portrait"][data-hand="left"] body.in-session .session-rail { left: 0; right: 0; border-right: 0; }
html[data-device="tablet"][data-orient="portrait"][data-hand="left"] body.in-session .session-rail .sr-go { order: -1; }
html[data-device="tablet"][data-orient="portrait"] body.in-session .session-rail .sr-top { display: flex; flex-direction: row; align-items: stretch; gap: .5rem; flex: none; text-align: left; }
html[data-device="tablet"][data-orient="portrait"] body.in-session .session-rail .sr-end { min-height: 0; width: 72px; }
html[data-device="tablet"][data-orient="portrait"] body.in-session .session-rail .mk-rt { min-height: 0; min-width: 104px; font-size: 1.7rem; padding: 0 .5rem; }
html[data-device="tablet"][data-orient="portrait"] body.in-session .session-rail .sr-sec { display: flex; flex: 1 1 0; min-width: 0; overflow-x: auto; overflow-y: hidden; gap: .35rem; align-content: normal; scrollbar-width: none; }
html[data-device="tablet"][data-orient="portrait"] body.in-session .session-rail .sr-sec:empty { display: none; }
html[data-device="tablet"][data-orient="portrait"] body.in-session .session-rail .sr-tab { min-height: 0; min-width: 64px; flex: 0 0 auto; font-size: 12px; padding: .2rem .5rem; }
html[data-device="tablet"][data-orient="portrait"] body.in-session .session-rail .sr-mid { display: flex; flex: none; gap: .35rem; margin: 0 0 0 auto; overflow: visible; align-content: normal; }
html[data-device="tablet"][data-orient="portrait"] body.in-session .session-rail .sr-mid button { min-height: 0; min-width: 62px; flex-direction: column; gap: .1rem; font-size: 12px; padding: .2rem .35rem; }
html[data-device="tablet"][data-orient="portrait"] body.in-session .session-rail button.sr-go { min-height: 0; width: 176px; flex: none; box-shadow: 3px 3px 0 var(--ink); font-size: 1rem; }
html[data-device="tablet"][data-orient="portrait"] body.in-session .page.mk { --mk-side: max(24px, calc((100% - 904px) / 2));
  padding: 16px var(--mk-side) calc(var(--sbar-h) + 16px) !important; }
html[data-device="tablet"][data-orient="portrait"][data-hand="left"] body.in-session .page.mk { padding: 16px var(--mk-side) calc(var(--sbar-h) + 16px) !important; }
html[data-device="tablet"][data-orient="portrait"] body.in-session .mk-palpop.open { top: auto; bottom: calc(var(--sbar-h) + .6rem); right: .6rem; left: auto; width: min(460px, calc(100vw - 1.2rem)); max-height: calc(100vh - var(--sbar-h) - 1.4rem); }
html[data-device="tablet"][data-orient="portrait"][data-hand="left"] body.in-session .mk-palpop.open { right: auto; left: .6rem; }

@media (max-width: 1100px) {
  .mk-grid, .mk-split, .mk-two { grid-template-columns: minmax(0, 1fr); }
  .mk-rail, .mk-exam .pr-stim { position: static; max-height: none; }
  .mk-pal { grid-template-columns: repeat(auto-fill, minmax(48px, 1fr)); }
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
  .mk-setup-t th:nth-child(4), .mk-setup-t td:nth-child(4) { display: none; }
  .mk-row { grid-template-columns: minmax(0, 1fr) auto; }
  .mk-r-meta { text-align: left; grid-column: 1; grid-row: 2; }
  .mk-row > .btn, .mk-row > .mk-start { grid-column: 2; grid-row: 1 / span 2; }
  .mk-sink { grid-template-columns: auto auto minmax(0, 1fr) auto; }
  .mk-sink .bar { display: none; }
  .mk-hist th:nth-child(4), .mk-hist td:nth-child(4), .mk-hist th:nth-child(6), .mk-hist td:nth-child(6) { display: none; }
}
`;
    document.head.appendChild(st);
  }

  root.MockPage = MockPage;
  MockPage.build = buildPaper;
  MockPage.topicsOf = topicsOf;
  MockPage.score = scoreRun;
})();
