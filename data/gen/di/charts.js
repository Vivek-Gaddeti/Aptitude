/* =====================================================================
   DI generators: 10 topics x 10 patterns = 100 generators in one shared engine.
   Topics: di-table, di-multi-table, di-bar, di-line, di-pie, di-mixed, di-caselet, di-missing, di-radar, di-venn.
   Every chart type has a data builder (Indian business contexts, clean numbers) and a stimulus writer
   (table html / chart / passage / SVG); every question pattern asks about the same data model
   (direct read, % change, ratio, share, average, max/min, years above average, approximation, CAGR, combined).
   Each generated question registers its own stimulus with QB.set under a content-derived id.
   ===================================================================== */
(function () {
  "use strict";
  const N = (x) => QB.num(x), P = (x) => QB.pct(x), R = (x) => QB.round(x, 2);
  const I = Number.isInteger;
  const C = (x) => isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;      // at most 2 decimals
  const C1 = (x) => isFinite(x) && Math.abs(x * 10 - Math.round(x * 10)) < 1e-6;       // at most 1 decimal
  const sum = (a) => a.reduce((s, x) => s + x, 0);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const gcd = (a, b) => QB.gcd(a, b);
  const TIME = { Easy: 45, Medium: 75, Hard: 105 };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const MIN = "−";

  /* ------------------------------------------------------------------ stimulus registry (content-derived ids) */
  function hash(s) { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
  const lru = new Map();
  function register(tag, spec) {
    const id = "gdi-" + tag + "-" + hash(JSON.stringify([spec.title, spec.chart || "", spec.html || "", spec.text || "", spec.tableHTML || ""]));
    QB.set(id, spec);
    lru.delete(id); lru.set(id, 1);
    if (lru.size > 700) { const old = lru.keys().next().value; lru.delete(old); delete QB.sets[old]; }
    return id;
  }

  /* ------------------------------------------------------------------ contexts (packs) */
  const FR = [4, 5, 6, 7.5, 8, 10, 12, 12.5, 15, 16, 18, 20, 24, 25, 30, 32, 36, 40, 45, 48, 50, 60, 64, 75, 80, 90, 100, 120, 125, 150];
  const SINGLES = [
    { id: "sales", head: (o) => "Annual turnover of the divisions of " + o, owners: ["Sundaram Industries", "Kaveri Group", "Mehta Enterprises", "Bharat Holdings", "Narmada Group", "Himalaya Corp"],
      noun: "turnover", prep: "of", pl: "divisions", unit: "₹ crore", fmt: (v) => "₹" + N(v) + " crore",
      ents: ["Textiles", "Steel", "Cement", "Pharma", "Plastics", "Paper", "Fertilisers", "Auto parts"], ref: (e) => "the " + e + " division", sc: 10, lo: 80, hi: 900, step: 10 },
    { id: "prod", head: (o) => "Two-wheelers produced at the plants of " + o, owners: ["Rajdhani Motors", "Veera Auto", "Hindustan Cycles", "Sagar Motors", "Anand Wheels"],
      noun: "production", prep: "at", pl: "plants", unit: "thousand units", fmt: (v) => N(v) + " thousand units",
      ents: ["Pune", "Chennai", "Gurugram", "Sanand", "Hosur", "Haridwar", "Bhopal", "Nashik"], ref: (e) => "the " + e + " plant", sc: 4, lo: 40, hi: 400, step: 5 },
    { id: "place", head: (o) => "Students placed from the departments of " + o, owners: ["Vidyasagar Engineering College", "Kaveri Institute of Technology", "Nalanda College of Engineering", "Shivalik Institute", "Gomti Technical Campus"],
      noun: "number of students placed", prep: "from", pl: "departments", unit: "students", fmt: (v) => N(v) + " students",
      ents: ["CSE", "ECE", "Mechanical", "Civil", "Electrical", "IT", "Chemical", "Biotech"], ref: (e) => "the " + e + " department", sc: 4, lo: 40, hi: 300, step: 5 },
    { id: "exp", head: () => "Exports from selected states", owners: [""],
      noun: "exports", prep: "from", pl: "states", unit: "₹ crore", fmt: (v) => "₹" + N(v) + " crore",
      ents: ["Gujarat", "Maharashtra", "Tamil Nadu", "Karnataka", "Kerala", "Punjab", "Haryana", "Rajasthan"], ref: (e) => e, sc: 20, lo: 200, hi: 2400, step: 25 },
    { id: "grain", head: () => "Foodgrain production in selected states", owners: [""],
      noun: "foodgrain production", prep: "of", pl: "states", unit: "lakh tonnes", fmt: (v) => N(v) + " lakh tonnes",
      ents: ["Punjab", "Uttar Pradesh", "Madhya Pradesh", "Haryana", "West Bengal", "Bihar", "Odisha", "Assam"], ref: (e) => e, sc: 4, lo: 40, hi: 400, step: 5 },
    { id: "tour", head: () => "Tourists visiting selected cities", owners: [""],
      noun: "number of tourists", prep: "to", pl: "cities", unit: "lakh tourists", fmt: (v) => N(v) + " lakh",
      ents: ["Jaipur", "Goa", "Kochi", "Shimla", "Agra", "Varanasi", "Udaipur", "Mysuru"], ref: (e) => e, sc: 2, lo: 20, hi: 200, step: 5 },
  ];
  const PAIRS = [
    { id: "revexp", head: () => "Revenue and expenditure of some companies", unit: "₹ crore", prep: "of", pl: "companies",
      ents: ["P", "Q", "R", "S", "T", "U"], ref: (e) => "Company " + e, sc: 10, lo: 100, hi: 900, step: 10,
      M: [{ noun: "revenue", fmt: (v) => "₹" + N(v) + " crore" }, { noun: "expenditure", fmt: (v) => "₹" + N(v) + " crore" }],
      diff: { noun: "profit", def: "profit = revenue − expenditure", sign: "profit" }, rate: { name: "profit percentage", on: 1, def: "profit percentage = profit ÷ expenditure × 100" },
      make1: (rng, v0, st) => { const f = rng.pick([0.5, 0.6, 0.7, 0.75, 0.8, 0.9]); let v = Math.round(v0 * f / st) * st; if (v >= v0) v = v0 - st; return v < st ? st : v; } },
    { id: "apq", head: () => "Candidates who appeared and qualified at recruitment test centres", unit: "candidates", prep: "at", pl: "centres",
      ents: ["Delhi", "Pune", "Jaipur", "Kolkata", "Hyderabad", "Indore"], ref: (e) => "the " + e + " centre", sc: 20, lo: 200, hi: 1800, step: 20,
      M: [{ noun: "number of candidates who appeared", fmt: (v) => N(v) }, { noun: "number of candidates who qualified", fmt: (v) => N(v) }],
      diff: { noun: "number of candidates who did not qualify", def: "candidates who did not qualify = appeared − qualified", sign: "gap" }, rate: { name: "percentage of candidates who qualified", on: 0, def: "qualifying percentage = qualified ÷ appeared × 100" },
      make1: (rng, v0) => { for (const p of rng.shuffle([20, 25, 30, 40, 50, 60, 75, 80])) if ((v0 * p) % 100 === 0) return v0 * p / 100; return Math.floor(v0 / 2); } },
    { id: "prodsold", head: (o) => "Units produced and sold at the plants of " + o, unit: "thousand units", prep: "at", pl: "plants", owners: ["Veera Auto", "Rajdhani Motors", "Sagar Motors"],
      ents: ["Pune", "Chennai", "Gurugram", "Sanand", "Hosur", "Nashik"], ref: (e) => "the " + e + " plant", sc: 4, lo: 40, hi: 400, step: 5,
      M: [{ noun: "number of units produced", fmt: (v) => N(v) + " thousand" }, { noun: "number of units sold", fmt: (v) => N(v) + " thousand" }],
      diff: { noun: "number of unsold units", def: "unsold units = produced − sold", sign: "gap" }, rate: { name: "percentage of production that was sold", on: 0, def: "sold percentage = sold ÷ produced × 100" },
      make1: (rng, v0) => { for (const p of rng.shuffle([50, 60, 70, 75, 80, 90, 40])) if ((v0 * p) % 100 === 0) return v0 * p / 100; return Math.floor(v0 / 2); } },
  ];
  SINGLES.concat(PAIRS).forEach((p) => { p.fr = FR.map((x) => x * p.sc).filter((x) => x >= p.lo && x <= p.hi); });

  /* ------------------------------------------------------------------ data builders */
  function genV(rng, pk, nP, nE, plain) {
    const V = Array.from({ length: nP }, () => new Array(nE));
    for (let e = 0; e < nE; e++) {
      if (!plain) {
        const fr = pk.fr; let i = rng.int(1, fr.length - 2);
        for (let t = 0; t < nP; t++) { V[t][e] = fr[i]; i = Math.max(0, Math.min(fr.length - 1, i + rng.pick([-2, -1, -1, 0, 1, 1, 2]))); }
      } else {
        const st = pk.step, k = Math.max(1, Math.round((pk.hi - pk.lo) / st / 14));
        let x = st * rng.int(Math.ceil(pk.lo / st), Math.floor(pk.hi * 0.7 / st));
        for (let t = 0; t < nP; t++) { V[t][e] = x; x = Math.max(pk.lo, Math.min(pk.hi, x + st * rng.int(-k, k))); }
      }
    }
    return V;
  }
  const FACT = { "10,2": [121, 100], "20,2": [36, 25], "25,2": [25, 16], "40,2": [49, 25], "50,2": [9, 4], "60,2": [64, 25], "20,3": [216, 125], "25,3": [125, 64] };
  const CG = { Easy: [[10, 2], [20, 2], [25, 2]], Medium: [[20, 3], [25, 3], [40, 2], [50, 2], [60, 2]], Hard: [[20, 3], [25, 3], [50, 2]] };

  const expandLeads = (a) => {
    const b = a.slice();
    a.forEach((l) => { if (/^According to /.test(l)) { b.push(l.replace("According to", "As per"), l.replace("According to", "Based on"), l.replace("According to", "Going by")); } });
    return b.concat(b.filter(Boolean).map((l) => l.replace(/, $/, " for {per}, ")));
  };
  // cfg: { pair, nP:{E,M,H}, nE:{E,M,H}, shape: "series" | "pie" | "radar" }
  function makeD(rng, d, cfg, o) {
    o = o || {};
    const pk = rng.pick(cfg.pair ? PAIRS : SINGLES), nP = cfg.nP[d], nE = Math.min(cfg.nE[d], pk.ents.length);
    const E = rng.shuffle(pk.ents).slice(0, nE);
    const owner = pk.owners ? rng.pick(pk.owners) : "";
    let P, gapY = 1;
    if (cfg.shape === "series") { const y0 = rng.int(2015, 2025 - nP); P = Array.from({ length: nP }, (_, i) => String(y0 + i)); }
    else { gapY = o.cg ? o.cg.rn[1] : rng.pick([2, 3]); const y0 = rng.int(2015, 2024 - gapY * (nP - 1)); P = Array.from({ length: nP }, (_, i) => String(y0 + i * gapY)); }
    const M = (cfg.pair ? pk.M : [{ noun: pk.noun, fmt: pk.fmt }]).map((m) => ({ noun: m.noun, fmt: m.fmt, unit: pk.unit }));
    const D = { topic: cfg.topic, pack: pk, pair: !!cfg.pair, P, E, M, prep: pk.prep, ref: (i) => pk.ref(E[i]), pl: pk.pl, head: pk.head(owner), unit: pk.unit,
      leads: expandLeads(cfg.leads), per: cfg.shape === "series" ? P[0] + "\u2013" + P[nP - 1] : P.join(" and "), temporal: cfg.shape === "series" && nP >= 4, shape: cfg.shape, used: [], gapY, cfg, owner };
    let V;
    if (cfg.shape === "pie") {
      const out = buildPie(rng, d, pk, nP, nE, o.cg, gapY); if (!out) return null;
      V = out.V; D.shares = out.shares; D.totals = out.totals;
      if (o.cg) D.cg = { e: o.cg.e, t0: 0, t1: 1, r: o.cg.rn[0], n: o.cg.rn[1] };
    } else {
      V = genV(rng, pk, nP, nE, !!o.plain);
      if (o.cg) {
        const [r, n] = o.cg.rn, [a, b] = FACT[r + "," + n], e = rng.int(0, nE - 1);
        const t0 = cfg.shape === "series" ? rng.int(0, nP - 1 - n) : 0, t1 = cfg.shape === "series" ? t0 + n : 1;
        const kLo = Math.ceil(pk.lo / b), kHi = Math.floor(pk.hi / b); if (kHi < kLo) return null;
        const k = rng.int(kLo, kHi); V[t0][e] = b * k; V[t1][e] = a * k;
        D.cg = { e, t0, t1, r, n, a, b };
      }
    }
    D.M[0].V = V;
    if (cfg.pair) {
      const st = pk.step;
      D.M[1].V = V.map((row) => row.map((v0) => pk.make1(rng, v0, st)));
    }
    return D;
  }

  function buildPie(rng, d, pk, nP, nE, cg, gapY) {
    const chunks = 20, totals = [], shares = [], TL = [200, 300, 400, 500, 600, 800];
    const split = (n) => { const s = new Array(n).fill(1); for (let i = n; i < chunks; i++) s[rng.int(0, n - 1)]++; return s.map((x) => x * 5); };
    const withShare = (e, sh) => { const others = new Array(nE - 1).fill(5); let left = (100 - sh) / 5 - (nE - 1); if (left < 0) return null; while (left-- > 0) others[rng.int(0, nE - 2)] += 5; const row = []; let j = 0; for (let i = 0; i < nE; i++) row.push(i === e ? sh : others[j++]); return row; };
    if (cg) {
      const [r, n] = cg.rn, [a, b] = FACT[r + "," + n], e = rng.int(0, nE - 1), cands = [];
      for (const T0 of TL) for (const s0 of [10, 15, 20, 25, 30, 35, 40]) if ((s0 * T0 / 100) % b === 0) cands.push([T0, s0]);
      for (const [T0, s0] of rng.shuffle(cands)) {
        const v1 = s0 * T0 / 100 * a / b;
        for (const s1 of rng.shuffle([10, 15, 20, 25, 30, 35, 40])) {
          const T1 = v1 * 100 / s1;
          if (I(T1) && T1 % 20 === 0 && T1 >= T0 * 0.5 && T1 <= T0 * 2.6 && T1 <= 2400) {
            const r0 = withShare(e, s0), r1 = withShare(e, s1); if (!r0 || !r1) continue;
            cg.e = e;
            const V = [r0.map((x) => x * T0 / 100), r1.map((x) => x * T1 / 100)];
            return { V, shares: [r0, r1], totals: [T0, T1] };
          }
        }
      }
      return null;
    }
    const t0 = rng.pick(TL);
    totals.push(t0); shares.push(split(nE));
    for (let t = 1; t < nP; t++) { totals.push(rng.pick(TL.filter((x) => x !== totals[t - 1] && x >= t0 * 0.6 && x <= t0 * 2))); shares.push(split(nE)); }
    const V = shares.map((row, t) => row.map((s) => s * totals[t] / 100));
    if (V.some((row) => row.some((v) => !I(v)))) return null;
    return { V, shares, totals };
  }

  /* ------------------------------------------------------------------ stimulus writers */
  function tbl(D, mi, hid, totals, caption) {
    const M = D.M[mi], th = (s, r) => "<th" + (r ? ' style="text-align:right"' : "") + ">" + esc(s) + "</th>";
    const td = (s, b) => '<td class="num" style="text-align:right">' + (b ? "<strong>" + s + "</strong>" : s) + "</td>";
    let h = '<table class="pr-table">' + (caption ? "<caption>" + esc(caption) + "</caption>" : "") + "<thead><tr>" + th(D.temporal || D.shape === "series" ? "Year" : "Year");
    D.E.forEach((e) => { h += th(e, 1); });
    if (totals) h += th("Total", 1);
    h += "</tr></thead><tbody>";
    D.P.forEach((y, t) => {
      h += "<tr><td>" + y + "</td>";
      D.E.forEach((_, e) => { h += td(hid && hid.has(t + "," + e) ? "?" : N(M.V[t][e])); });
      if (totals) h += td(N(sum(M.V[t])), 1);
      h += "</tr>";
    });
    if (totals) { h += "<tr><td><strong>Total</strong></td>"; D.E.forEach((_, e) => { h += td(N(sum(M.V.map((r) => r[e]))), 1); }); h += td(N(sum(M.V.map(sum))), 1) + "</tr>"; }
    return h + "</tbody></table>";
  }
  const yrRange = (D) => D.P[0] + "–" + D.P[D.P.length - 1];
  const series = (D, mi) => D.E.map((n, e) => ({ name: n, data: D.M[mi].V.map((r) => r[e]) }));

  const TOPICS = {
    "di-table": { cfg: { topic: "di-table", shape: "series", nP: { Easy: 4, Medium: 5, Hard: 6 }, nE: { Easy: 3, Medium: 4, Hard: 4 },
      leads: ["According to the table, ", "Referring to the table, ", "From the table given, ", "Using the data in the table, ", ""] },
      stim(D) { return { title: D.head + ", " + yrRange(D) + " (" + D.unit + ")", kind: "html", html: tbl(D, 0, null, false) }; } },
    "di-multi-table": { cfg: { topic: "di-multi-table", pair: true, shape: "series", nP: { Easy: 4, Medium: 4, Hard: 5 }, nE: { Easy: 3, Medium: 3, Hard: 4 },
      leads: ["According to the two tables, ", "Using Table 1 and Table 2, ", "From the tables given, ", "Referring to both tables, ", ""] },
      stim(D) { return { title: D.head + ", " + yrRange(D) + " (" + D.unit + ")", kind: "html", html: tbl(D, 0, null, false, "Table 1: " + cap(D.M[0].noun)) + tbl(D, 1, null, false, "Table 2: " + cap(D.M[1].noun)) }; } },
    "di-bar": { cfg: { topic: "di-bar", shape: "series", nP: { Easy: 4, Medium: 5, Hard: 6 }, nE: { Easy: 3, Medium: 3, Hard: 4 },
      leads: ["According to the bar chart, ", "Referring to the bar graph, ", "From the bar chart given, ", "Using the bar graph, ", ""] },
      stim(D, rng) { let ty = rng.pick(["bar", "bar", "bar", "stacked", "hbar"]);
        if (ty === "stacked") { const mx = Math.max.apply(null, D.M[0].V.map(sum)), mn = Math.min.apply(null, D.M[0].V.map((r) => Math.min.apply(null, r))); if (mn < 0.09 * mx) ty = "bar"; }
        return { title: D.head + ", " + yrRange(D) + " (" + D.unit + ")", kind: "chart", chart: { type: ty, labels: D.P, series: series(D, 0), unit: D.unit,
          note: ty === "stacked" ? "Stacked bars: the label above each bar is the total of all the series for that year." : "Each group of bars shows one year." } }; } },
    "di-line": { cfg: { topic: "di-line", shape: "series", nP: { Easy: 5, Medium: 5, Hard: 6 }, nE: { Easy: 2, Medium: 3, Hard: 3 },
      leads: ["According to the line graph, ", "Referring to the line chart, ", "From the line graph given, ", "Using the graph, ", ""] },
      stim(D) { return { title: D.head + ", " + yrRange(D) + " (" + D.unit + ")", kind: "chart", chart: { type: "line", labels: D.P, series: series(D, 0), unit: D.unit } }; } },
    "di-pie": { cfg: { topic: "di-pie", shape: "pie", nP: { Easy: 2, Medium: 2, Hard: 2 }, nE: { Easy: 4, Medium: 5, Hard: 6 },
      leads: ["According to the pie charts, ", "Referring to the pie charts, ", "From the pie charts given, ", "Using the two pie charts, ", ""] },
      stim(D, rng) { const donut = rng.chance(0.4);
        return { title: D.head + " (share of the total, " + D.P.join(" and ") + ")", kind: "chart", chart: { type: donut ? "donut" : "pie", labels: D.E,
          series: D.P.map((y, t) => ({ name: y, data: D.shares[t] })),
          note: "Total " + D.M[0].noun + " (" + D.unit + "): " + D.P.map((y, t) => y + " = " + N(D.totals[t])).join("; ") + ". Each slice shows its percentage of that year's total." } }; } },
    "di-mixed": { cfg: { topic: "di-mixed", pair: true, shape: "series", nP: { Easy: 4, Medium: 5, Hard: 5 }, nE: { Easy: 2, Medium: 3, Hard: 3 },
      leads: ["According to the chart and the table, ", "Using the graph and the table, ", "From the chart and table given, ", "Referring to the figure and the table, ", ""] },
      stim(D, rng) { const ty = rng.pick(["bar", "line"]);
        return { title: D.head + ", " + yrRange(D) + " (" + D.unit + ")", kind: "chart", chart: { type: ty, labels: D.P, series: series(D, 0), unit: cap(D.M[0].noun) + " (" + D.unit + ")",
          note: (ty === "bar" ? "Bar chart" : "Line graph") + ": " + D.M[0].noun + ". The table below gives the " + D.M[1].noun + "." }, tableHTML: tbl(D, 1, null, false, cap(D.M[1].noun) + " (" + D.unit + ")") }; } },
    "di-caselet": { cfg: { topic: "di-caselet", shape: "series", nP: { Easy: 3, Medium: 4, Hard: 4 }, nE: { Easy: 3, Medium: 3, Hard: 4 },
      leads: ["According to the passage, ", "Based on the passage, ", "From the information given, ", "Using the data in the passage, ", ""] },
      stim(D, rng) { return { title: "Case study: " + D.head.toLowerCase() + ", " + yrRange(D), kind: "passage", text: caselet(D, rng) }; } },
    "di-missing": { cfg: { topic: "di-missing", shape: "series", nP: { Easy: 4, Medium: 4, Hard: 5 }, nE: { Easy: 3, Medium: 3, Hard: 4 },
      leads: ["Using the table, and finding any missing entries from the totals, ", "According to the table, ", "Referring to the table, ", "From the table given, ", ""] },
      stim(D, rng, hid) { return { title: D.head + ", " + yrRange(D) + " (" + D.unit + "; ? = missing entry)", kind: "html",
        html: tbl(D, 0, hid, true) + "<p><em>A \"?\" marks an entry that is not given. Each can be worked out from the row and column totals.</em></p>" }; } },
    "di-radar": { cfg: { topic: "di-radar", shape: "radar", nP: { Easy: 2, Medium: 2, Hard: 3 }, nE: { Easy: 5, Medium: 5, Hard: 6 },
      leads: ["According to the radar chart, ", "Referring to the radar chart, ", "From the radar chart given, ", "Using the radar chart, ", ""] },
      stim(D) { return { title: D.head + ", " + D.P.join(" and ") + " (" + D.unit + ")", kind: "chart", chart: { type: "radar", labels: D.E, series: D.P.map((y, t) => ({ name: y, data: D.M[0].V[t] })), unit: D.unit, note: "Values are not marked on the chart; the table below gives the plotted figures." }, tableHTML: tbl(D, 0, null, false, "Plotted values (" + D.unit + ")") }; } },
  };

  /* caselet text: all figures written out, either year by year, or as a starting value with % changes */
  function caselet(D, rng) {
    const M = D.M[0], f = M.fmt, nP = D.P.length;
    const intro = D.head + ". The figures below are for " + yrRange(D) + " (" + D.unit + ").";
    const parts = [];
    if (D.chain) {
      D.E.forEach((n, e) => {
        const g = D.chain[e]; let s = cap(D.ref(e)) + " started at " + f(M.V[0][e]) + " in " + D.P[0];
        s += g.map((x, i) => (i === 0 ? ", then " : i === g.length - 1 ? " and " : ", ") + (x > 0 ? "rose by " : "fell by ") + Math.abs(x) + "% in " + D.P[i + 1]).join("");
        parts.push(s + ".");
      });
      return intro + "\n\n" + parts.join(" ");
    }
    if (rng.chance(0.5)) {
      D.E.forEach((n, e) => { parts.push(cap(D.ref(e)) + " recorded " + D.P.map((y, t) => f(M.V[t][e]) + " in " + y).join(", ").replace(/, ([^,]*)$/, " and $1") + "."); });
      return intro + "\n\n" + parts.join(" ");
    }
    D.P.forEach((y, t) => { parts.push("In " + y + ", " + D.E.map((n, e) => D.ref(e) + " " + (D.pack.id === "tour" ? "drew " : "recorded ") + f(M.V[t][e])).join(", ").replace(/, ([^,]*)$/, " and $1") + "."); });
    return intro + "\n\n" + parts.join(" ");
  }
  function chainV(rng, D) {
    const pk = D.pack, nP = D.P.length, nE = D.E.length, chain = [], V = Array.from({ length: nP }, () => new Array(nE));
    for (let e = 0; e < nE; e++) {
      let x = 20 * rng.int(Math.ceil(pk.lo / 20), Math.floor(pk.hi * 0.55 / 20)); V[0][e] = x; const g = [];
      for (let t = 1; t < nP; t++) {
        const opts = [10, 20, 25, -10, -20, -25, 5, -5, 50, 15, -15, 30].filter((p) => (x * (100 + p)) % 100 === 0);
        if (!opts.length) return false;
        const p = rng.pick(opts); g.push(p); x = x * (100 + p) / 100; V[t][e] = x;
      }
      chain.push(g);
    }
    D.M[0].V = V; D.chain = chain; return true;
  }

  /* ------------------------------------------------------------------ question context */
  function ctx(rng, d, D) {
    const c = { rng, d, D };
    c.lead = D.leads ? rng.pick(D.leads).replace("{per}", D.per) : "";
    c.pm = () => (D.M.length > 1 ? rng.int(0, D.M.length - 1) : 0);
    c.ents = (n) => rng.shuffle(D.E.map((_, i) => i)).slice(0, n);
    c.ts = (n) => rng.shuffle(D.P.map((_, i) => i)).slice(0, n).sort((a, b) => a - b);
    c.v = (m, t, e) => { D.used.push([t, e]); return D.M[m].V[t][e]; };
    c.row = (m, t) => D.E.map((_, e) => c.v(m, t, e));
    c.col = (m, e, a, b) => { const o = []; for (let t = a == null ? 0 : a; t <= (b == null ? D.P.length - 1 : b); t++) o.push(c.v(m, t, e)); return o; };
    c.np = (m, e) => D.M[m].noun + " " + D.prep + " " + D.ref(e);
    c.na = (m) => D.M[m].noun + " " + D.prep + " all " + D.pl;
    c.adj = (t) => (t + 1 < D.P.length ? t + 1 : t - 1);
    c.junk = (m, n, not) => { const o = []; for (let i = 0; i < n * 3 && o.length < n; i++) { const t = rng.int(0, D.P.length - 1), e = rng.int(0, D.E.length - 1); o.push([D.M[m].V[t][e], "Read a value from the wrong row or column"]); } return o; };
    return c;
  }
  const first = (c, list, fn) => { for (const x of c.rng.shuffle(list)) { const n = c.D.used.length, r = fn(x); if (r) return r; c.D.used.length = n; } return null; };
  const pairsOf = (n) => { const o = []; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j) o.push([i, j]); return o; };
  const winOf = (nP, len) => { const o = []; for (let a = 0; a + len - 1 < nP; a++) o.push([a, a + len - 1]); return o; };
  const range = (a, b) => { const o = []; for (let i = a; i <= b; i++) o.push(i); return o; };
  const spanTxt = (D, t1, t2) => (D.shape === "series" ? "from " + D.P[t1] + " to " + D.P[t2] : "in " + D.P[t1] + " and " + D.P[t2] + " together");
  const pcOf = (a, b) => a / b * 100;
  const rt = (a, b) => { const g = gcd(a, b); return [a / g, b / g]; };
  const rtx = (p) => p[0] + " : " + p[1];

  /* ------------------------------------------------------------------ turning a spec into a question */
  function finish(c, r) {
    const { rng, d, D } = c;
    let pairs, calc;
    if (r.pairs) { pairs = r.pairs; calc = r.calc; }
    else {
      const f = r.f; let A, ansV;
      if (r.shown != null) { A = f(r.shown); ansV = r.shown; calc = String(r.ans); }
      else { if (!(r.loose ? C(r.ans) : C(r.ans))) return null; if (r.c1 && !C1(r.ans)) return null; ansV = R(r.ans); A = f(ansV); calc = String(ansV); }
      const seen = new Set([A.toLowerCase()]), kept = [ansV]; pairs = [[A, null]];
      for (const w of r.wrongs) {
        if (pairs.length === 4) break;
        const v = w[0];
        if (!isFinite(v) || (!r.signed && v <= 0) || (r.int && !I(v))) continue;
        const vv = r.shown != null ? Math.round(v) : R(v);
        if (Math.abs(vv - ansV) < 0.11 || (r.gap && kept.some((k) => Math.abs(k - vv) < r.gap(k)))) continue;
        const t = f(vv);
        if (seen.has(t.toLowerCase()) || /NaN|undefined|Infinity/.test(t)) continue;
        seen.add(t.toLowerCase()); kept.push(vv); pairs.push([t, w[1]]);
      }
      if (pairs.length < 4) return null;
    }
    const o = QB.options(rng, pairs);
    let sol = r.sol.slice(), hid = null;
    if (D.topic === "di-missing") {
      const seen = new Set(), cells = [];
      for (const [t, e] of rng.shuffle(D.used)) if (!seen.has(t + "," + e)) { seen.add(t + "," + e); cells.push([t, e]); }
      const rows = new Set(), cols = new Set(); hid = new Set(); const hs = [];
      const lim = d === "Easy" ? 1 : 2;
      for (const [t, e] of cells) if (!rows.has(t) && !cols.has(e) && hs.length < lim) { rows.add(t); cols.add(e); hs.push([t, e]); hid.add(t + "," + e); }
      const extra = d === "Easy" ? 0 : d === "Medium" ? 1 : 2;
      for (let k = 0; k < extra; k++) {
        const t = rng.int(0, D.P.length - 1), e = rng.int(0, D.E.length - 1);
        if (!rows.has(t) && !cols.has(e) && hs.length < Math.min(D.P.length, D.E.length) - 1) { rows.add(t); cols.add(e); hid.add(t + "," + e); }
      }
      const M0 = D.M[0], f0 = M0.fmt;
      hs.forEach(([t, e]) => { const tot = sum(M0.V[t]), v = M0.V[t][e];
        sol.unshift("The missing entry for " + D.E[e] + " in " + D.P[t] + " = row total " + N(tot) + " − the other entries " + N(tot - v) + " = **" + N(v) + "**"); });
      void f0;
    }
    if (D.topic === "di-pie") sol.unshift("Each slice is a share of that year's total (given in the note), so amount = share \u00D7 total \u00F7 100.");
    const stim = TOPICS[D.topic].stim(D, rng, hid);
    const set = register(D.topic.slice(3), stim);
    return { q: cap(c.lead + r.body), opts: o.opts, ans: o.ans, why: o.why, time: TIME[d], sol, short: r.short, trap: r.trap, calc, set };
  }

  /* ------------------------------------------------------------------ the ten question patterns (shared by every table/chart topic) */
  const QS = {};

  /* 1. direct read */
  QS["direct-read"] = (c) => {
    const { rng, d, D } = c, mi = c.pm(), M = D.M[mi], f = M.fmt, V = M.V;
    if (d === "Easy") {
      const [e, e2] = c.ents(2), [t] = c.ts(1), t2 = c.adj(t), a = c.v(mi, t, e);
      const w = [[V[t][e2], "Read the " + D.E[e2] + " entry instead of " + D.E[e]], [V[t2][e], "Read the " + D.P[t2] + " entry instead of " + D.P[t]], [V[t2][e2], "Read the wrong series and the wrong year"]];
      if (D.M.length > 1) w.unshift([D.M[1 - mi].V[t][e], "Read the other table instead of the one asked"]);
      return { body: rng.pick(["what was the " + c.np(mi, e) + " in " + D.P[t] + "?", "how much was the " + c.np(mi, e) + " in " + D.P[t] + "?", "find the " + c.np(mi, e) + " in " + D.P[t] + "."]),
        ans: a, f, wrongs: w.concat(c.junk(mi, 3)), sol: ["Locate " + D.E[e] + " and " + D.P[t] + " in the data.", "Value = **" + f(a) + "**."], short: "Match the right row and the right column; nothing to calculate.", trap: "Reading the neighbouring year or series." };
    }
    if (d === "Medium") {
      if (rng.chance(0.5)) {
        const [e] = c.ents(1), [t1, t2] = c.ts(2), a = c.v(mi, t1, e), b = c.v(mi, t2, e), t3 = c.adj(t2);
        return { body: "what was the total " + c.np(mi, e) + " in " + D.P[t1] + " and " + D.P[t2] + " together?", ans: a + b, f,
          wrongs: [[Math.abs(a - b), "Subtracted instead of adding"], [(a + b) / 2, "Found the average instead of the total"], [a + V[t3][e], "Added the wrong second year (" + D.P[t3] + ")"]].concat(c.junk(mi, 3)),
          sol: [D.P[t1] + " = " + f(a) + ", " + D.P[t2] + " = " + f(b), "Total = " + N(a) + " + " + N(b) + " = **" + f(a + b) + "**"], short: "Two reads and one addition.", trap: "Taking the difference instead of the total." };
      }
      const [e1, e2] = c.ents(2), [t] = c.ts(1), a = c.v(mi, t, e1), b = c.v(mi, t, e2), t3 = c.adj(t);
      return { body: "what was the combined " + c.np(mi, e1) + " and " + D.ref(e2) + " in " + D.P[t] + "?", ans: a + b, f,
        wrongs: [[Math.abs(a - b), "Subtracted instead of adding"], [(a + b) / 2, "Found the average instead of the total"], [V[t3][e1] + V[t3][e2], "Added the entries of " + D.P[t3] + " instead of " + D.P[t]]].concat(c.junk(mi, 3)),
        sol: [D.E[e1] + " = " + f(a) + ", " + D.E[e2] + " = " + f(b), "Combined = " + N(a) + " + " + N(b) + " = **" + f(a + b) + "**"], short: "Read both, add.", trap: "Subtracting, or reading the wrong year." };
    }
    const [t1, t2] = c.ts(2), T1 = sum(c.row(mi, t1)), T2 = sum(c.row(mi, t2)), up = T2 > T1, df = Math.abs(T2 - T1);
    if (df < 0.05 * Math.max(T1, T2)) return null;
    const wr = [[T2, "Gave the total of " + D.P[t2] + " only"], [T1 + T2, "Added the two yearly totals instead of subtracting"], [df - Math.abs(V[t2][0] - V[t1][0]), "Left out one entity from the change"]];
    return { body: "by how much did the total " + c.na(mi) + " " + (up ? "increase" : "decrease") + " from " + D.P[t1] + " to " + D.P[t2] + "?", ans: df, f, wrongs: wr.concat(c.junk(mi, 3)),
      sol: [D.P[t1] + " total = " + N(T1), D.P[t2] + " total = " + N(T2), "Change = |" + N(T2) + " − " + N(T1) + "| = **" + f(df) + "**"], short: "Add each year's column of figures, then subtract.", trap: "Finding the change for one entity only." };
  };

  /* 2. % change / growth */
  QS["pct-change-growth"] = (c) => {
    const { rng, d, D } = c, mi = c.pm(), M = D.M[mi], V = M.V, nP = D.P.length, nE = D.E.length;
    const pf = (x) => P(x);
    const chg = (o, n) => (n - o) / o * 100;
    if (d === "Easy") {
      const cand = []; for (let e = 0; e < nE; e++) for (let t = 0; t + 1 < nP; t++) cand.push([e, t]);
      return first(c, cand, ([e, t]) => {
        const o = V[t][e], n = V[t + 1][e], ch = chg(o, n); if (!C(ch) || ch === 0) return null;
        c.v(mi, t, e); c.v(mi, t + 1, e);
        const up = ch > 0, a = Math.abs(ch);
        return { body: rng.pick(["by what percent did the " + c.np(mi, e) + " " + (up ? "increase" : "decrease") + " from " + D.P[t] + " to " + D.P[t + 1] + "?",
            "what was the percentage " + (up ? "increase" : "decrease") + " in the " + c.np(mi, e) + " between " + D.P[t] + " and " + D.P[t + 1] + "?"]),
          ans: a, f: pf, wrongs: [[Math.abs(n - o) / n * 100, "Divided the change by the new value instead of the old"], [Math.abs(n - o), "Gave the actual change as the percentage"], [n / o * 100, "Gave the new value as a percentage of the old"], [o / n * 100, "Gave the old value as a percentage of the new"]],
          sol: [D.P[t] + " = " + N(o) + ", " + D.P[t + 1] + " = " + N(n), "Change = " + N(Math.abs(n - o)) + "; " + N(Math.abs(n - o)) + " ÷ " + N(o) + " × 100 = **" + P(a) + "**"],
          short: "Change ÷ OLD value × 100.", trap: "Dividing by the new value." };
      });
    }
    if (d === "Medium") {
      const [e1, e2] = c.ents(2);
      return first(c, winOf(nP, 2).concat(nP > 3 ? winOf(nP, 3) : []), ([t1, t2]) => {
        const o1 = V[t1][e1] + V[t1][e2], n1 = V[t2][e1] + V[t2][e2], ch = chg(o1, n1); if (!C(ch) || ch === 0) return null;
        [t1, t2].forEach((t) => { c.v(mi, t, e1); c.v(mi, t, e2); });
        const ind = (chg(V[t1][e1], V[t2][e1]) + chg(V[t1][e2], V[t2][e2])) / 2, up = ch > 0, a = Math.abs(ch);
        return { body: "by what percent did the combined " + c.np(mi, e1) + " and " + D.ref(e2) + " " + (up ? "increase" : "decrease") + " from " + D.P[t1] + " to " + D.P[t2] + "?",
          ans: a, f: pf, wrongs: [[Math.abs(ind), "Averaged the two separate percentage changes"], [Math.abs(n1 - o1) / n1 * 100, "Divided by the later total instead of the earlier"], [Math.abs(chg(V[t1][e1], V[t2][e1])), "Used only " + D.E[e1]], [Math.abs(n1 - o1), "Gave the change itself as the percentage"]],
          sol: [D.P[t1] + " combined = " + N(V[t1][e1]) + " + " + N(V[t1][e2]) + " = " + N(o1), D.P[t2] + " combined = " + N(V[t2][e1]) + " + " + N(V[t2][e2]) + " = " + N(n1), N(Math.abs(n1 - o1)) + " ÷ " + N(o1) + " × 100 = **" + P(a) + "**"],
          short: "Add first, then take one percentage change on the combined figures.", trap: "Averaging the two separate percentage changes." };
      });
    }
    if (rng.chance(0.5)) {
      return first(c, pairsOf(nE), ([e1, e2]) => first(c, range(0, nP - 1), (t) => {
        const a = V[t][e1], b = V[t][e2]; if (a <= b) return null;
        const more = rng.chance(0.5), ch = more ? (a - b) / b * 100 : (a - b) / a * 100; if (!C(ch)) return null;
        c.v(mi, t, e1); c.v(mi, t, e2);
        return { body: more ? "the " + c.np(mi, e1) + " in " + D.P[t] + " was what percent more than the " + c.np(mi, e2) + " in the same year?" : "the " + c.np(mi, e2) + " in " + D.P[t] + " was what percent less than the " + c.np(mi, e1) + " in the same year?",
          ans: ch, f: pf, wrongs: [[more ? (a - b) / a * 100 : (a - b) / b * 100, "Used the wrong base (the other figure)"], [a - b, "Gave the plain difference as the percentage"], [a / b * 100, "Gave one figure as a percentage of the other"], [b / a * 100, "Gave the smaller figure as a percentage of the larger"]],
          sol: [D.E[e1] + " = " + N(a) + ", " + D.E[e2] + " = " + N(b), "Difference = " + N(a - b) + "; base = " + N(more ? b : a) + " (the figure that follows “than” / the one compared against)", N(a - b) + " ÷ " + N(more ? b : a) + " × 100 = **" + P(ch) + "**"],
          short: "“More than B” means divide by B; “less than A” means divide by A.", trap: "Choosing the wrong base." };
      }));
    }
    return first(c, winOf(nP, 2).concat(nP > 3 ? winOf(nP, 3) : []), ([t1, t2]) => {
      const T1 = sum(c.row(mi, t1)), T2 = sum(c.row(mi, t2)), ch = chg(T1, T2); if (!C(ch) || ch === 0) return null;
      return { body: "by what percent did the total " + c.na(mi) + " " + (ch > 0 ? "increase" : "decrease") + " from " + D.P[t1] + " to " + D.P[t2] + "?", ans: Math.abs(ch), f: pf,
        wrongs: [[Math.abs(T2 - T1) / T2 * 100, "Divided by the later total"], [Math.abs(T2 - T1), "Gave the plain change as the percentage"], [T2 / T1 * 100, "Gave the later total as a percentage of the earlier"], [Math.abs(chg(V[t1][0], V[t2][0])), "Used only the first series"]],
        sol: [D.P[t1] + " total = " + N(T1), D.P[t2] + " total = " + N(T2), N(Math.abs(T2 - T1)) + " ÷ " + N(T1) + " × 100 = **" + P(Math.abs(ch)) + "**"], short: "Totals first, then one percentage change.", trap: "Mixing up old and new base." };
    });
  };

  /* 3. ratio of two values */
  const ratioQ = (c, body, a, b, sol, short, trap, extraW) => {
    if (!I(a) || !I(b) || a <= 0 || b <= 0) return null;
    const p = rt(a, b); if (p[0] > 40 || p[1] > 40 || (p[0] === 1 && p[1] === 1)) return null;
    const pairs = [[rtx(p), null], [rtx([p[1], p[0]]), "Wrote the ratio the wrong way round"]];
    (extraW || []).forEach(([x, y, w]) => { const q = rt(x, y); if (x > 0 && y > 0) pairs.push([rtx(q), w]); });
    const seen = new Set(), out = [];
    for (const pr of pairs) if (!seen.has(pr[0])) { seen.add(pr[0]); out.push(pr); }
    if (out.length < 4) return null;
    return { body, pairs: out.slice(0, 4), calc: p[0] + "/" + p[1], sol: sol.concat(["Ratio = " + a + " : " + b + " = **" + rtx(p) + "**"]), short, trap };
  };
  QS["ratio-of-two-values"] = (c) => {
    const { rng, d, D } = c, mi = c.pm(), M = D.M[mi], V = M.V, nP = D.P.length, nE = D.E.length;
    if (d === "Easy") {
      return first(c, pairsOf(nE), ([e1, e2]) => first(c, range(0, nP - 1), (t) => {
        const a = c.v(mi, t, e1), b = c.v(mi, t, e2), t2 = c.adj(t);
        return ratioQ(c, "what is the ratio of the " + c.np(mi, e1) + " to that of " + D.ref(e2) + " in " + D.P[t] + "?", a, b, [D.E[e1] + " = " + N(a) + ", " + D.E[e2] + " = " + N(b)], "Divide both by their common factor.", "Writing the ratio upside down.",
          [[V[t2][e1], V[t2][e2], "Used the figures of " + D.P[t2] + " instead of " + D.P[t]], [a + b, b, "Compared the combined figure with the second one"], [a, a + b, "Compared the first with the combined figure"]]);
      }));
    }
    if (d === "Medium") {
      return first(c, pairsOf(nE), ([e1, e2]) => first(c, winOf(nP, 3).concat(winOf(nP, 2)), ([t1, t2]) => {
        const a = sum(c.col(mi, e1, t1, t2)), b = sum(c.col(mi, e2, t1, t2));
        return ratioQ(c, "what is the ratio of the total " + c.np(mi, e1) + " to the total " + c.np(mi, e2) + " " + spanTxt(D, t1, t2) + "?", a, b,
          [D.E[e1] + " total = " + N(a), D.E[e2] + " total = " + N(b)], "Add each series over the years, then cancel.", "Using a single year instead of the total.",
          [[V[t2][e1], V[t2][e2], "Used only the last year's figures"], [V[t1][e1], V[t1][e2], "Used only the first year's figures"], [a + b, b, "Compared the combined figure with the second one"]]);
      }));
    }
    return first(c, pairsOf(nE), ([e1, e2]) => first(c, winOf(nP, 2).concat(nP > 3 ? winOf(nP, 3) : []), ([t1, t2]) => {
      const a = V[t2][e1] - V[t1][e1], b = V[t2][e2] - V[t1][e2]; if (a <= 0 || b <= 0) return null;
      c.v(mi, t1, e1); c.v(mi, t2, e1); c.v(mi, t1, e2); c.v(mi, t2, e2);
      return ratioQ(c, "what is the ratio of the increase in the " + c.np(mi, e1) + " to the increase in the " + c.np(mi, e2) + " from " + D.P[t1] + " to " + D.P[t2] + "?", a, b,
        [D.E[e1] + ": " + N(V[t2][e1]) + " − " + N(V[t1][e1]) + " = " + N(a), D.E[e2] + ": " + N(V[t2][e2]) + " − " + N(V[t1][e2]) + " = " + N(b)], "Subtract first, then compare the two increases.", "Comparing the final values instead of the increases.",
        [[V[t2][e1], V[t2][e2], "Compared the final values instead of the increases"], [V[t1][e1], V[t1][e2], "Compared the starting values"], [a + b, b, "Compared the combined increase with the second one"]]);
    }));
  };

  /* 4. share of total */
  QS["share-of-total"] = (c) => {
    const { rng, d, D } = c, mi = c.pm(), M = D.M[mi], V = M.V, nP = D.P.length, nE = D.E.length;
    const pf = (x) => P(x);
    if (d === "Easy") {
      return first(c, pairsOf(nE).map((x) => x[0]), (e) => first(c, range(0, nP - 1), (t) => {
        const row = c.row(mi, t), T = sum(row), a = row[e], s = pcOf(a, T); if (!C(s)) return null;
        return { body: rng.pick(["what percent of the total " + c.na(mi) + " in " + D.P[t] + " was contributed by " + D.ref(e) + "?", "the " + c.np(mi, e) + " in " + D.P[t] + " was what percent of the total " + c.na(mi) + " that year?"]),
          ans: s, f: pf, wrongs: [[pcOf(a, T - a), "Compared with the rest instead of the total"], [100 - s, "Gave the share of all the others"], [pcOf(a, Math.max.apply(null, row)), "Compared with the largest figure instead of the total"], [pcOf(a, T / nE), "Compared with the average instead of the total"]],
          sol: ["Total in " + D.P[t] + " = " + N(T), D.E[e] + " = " + N(a), N(a) + " ÷ " + N(T) + " × 100 = **" + P(s) + "**"], short: "Part ÷ whole × 100, where the whole is the total of the whole row.", trap: "Dividing by the sum of the others." };
      }));
    }
    if (d === "Medium") {
      return first(c, pairsOf(nE).filter((p) => p[0] < p[1]), ([e1, e2]) => first(c, range(0, nP - 1), (t) => {
        const row = c.row(mi, t), T = sum(row), a = row[e1] + row[e2], s = pcOf(a, T); if (!C(s) || a === T) return null;
        return { body: "what percent of the total " + c.na(mi) + " in " + D.P[t] + " came from " + D.ref(e1) + " and " + D.ref(e2) + " together?", ans: s, f: pf,
          wrongs: [[pcOf(a, T - a), "Compared with the rest instead of the total"], [100 - s, "Gave the share of the remaining series"], [(pcOf(row[e1], T) + pcOf(row[e2], T)) / 2, "Averaged the two shares instead of adding them"], [pcOf(row[e1], T), "Used only the first series"]],
          sol: [D.E[e1] + " + " + D.E[e2] + " = " + N(row[e1]) + " + " + N(row[e2]) + " = " + N(a), "Total = " + N(T), N(a) + " ÷ " + N(T) + " × 100 = **" + P(s) + "**"], short: "Add the two parts, then one division.", trap: "Averaging the two shares." };
      }));
    }
    return first(c, range(0, nE - 1), (e) => first(c, winOf(nP, Math.min(3, nP)).concat(winOf(nP, 2)), ([t1, t2]) => {
      const a = sum(c.col(mi, e, t1, t2)); let T = 0; for (let t = t1; t <= t2; t++) T += sum(c.row(mi, t));
      const s = pcOf(a, T); if (!C(s)) return null;
      return { body: "what percent of the total " + c.na(mi) + " " + (D.shape === "series" ? "over " + D.P[t1] + " to " + D.P[t2] : "in " + D.P[t1] + " and " + D.P[t2] + " together") + " was contributed by " + D.ref(e) + "?", ans: s, f: pf,
        wrongs: [[pcOf(V[t2][e], sum(V[t2])), "Used only the last year's share"], [pcOf(a, T - a), "Compared with the rest instead of the total"], [100 - s, "Gave the share of all the others"], [pcOf(a, T / D.E.length), "Compared with an average entity"]],
        sol: [D.E[e] + " over the years = " + N(a), "All series over the years = " + N(T), N(a) + " ÷ " + N(T) + " × 100 = **" + P(s) + "**"], short: "Add the series over the years, add the grand total, then one division.", trap: "Using one year's share for a multi-year question." };
    }));
  };

  /* 5. average */
  QS["average"] = (c) => {
    const { rng, d, D } = c, mi = c.pm(), M = D.M[mi], f = M.fmt, V = M.V, nP = D.P.length, nE = D.E.length;
    const dv = (s, n) => s / n;
    if (d === "Easy") {
      return first(c, range(0, nE - 1), (e) => {
        if (D.temporal || D.shape === "series") {
          const xs = c.col(mi, e), s = sum(xs), a = dv(s, nP); if (!C1(a)) return null;
          return { body: "what was the average annual " + c.np(mi, e) + " over " + yrRange(D) + "?", ans: a, f, c1: true, wrongs: [[s, "Gave the total without dividing"], [dv(s, nP + 1), "Divided by one more than the number of years"], [dv(s - xs[nP - 1], nP - 1), "Left out the last year"], [(xs[0] + xs[nP - 1]) / 2, "Averaged only the first and last years"]],
            sol: ["Sum over " + nP + " years = " + xs.map(N).join(" + ") + " = " + N(s), N(s) + " ÷ " + nP + " = **" + f(R(a)) + "**"], short: "Add the values, divide by how many there are.", trap: "Dividing by the wrong count." };
        }
        const [t] = c.ts(1), xs = c.row(mi, t), s = sum(xs), a = dv(s, nE); if (!C1(a)) return null;
        return { body: "what was the average " + c.na(mi) + " per " + D.pl.replace(/s$/, "").replace(/ie$/, "y") + " in " + D.P[t] + "?", ans: a, f, c1: true, wrongs: [[s, "Gave the total without dividing"], [dv(s, nE + 1), "Divided by one more than the number of items"], [dv(s - xs[nE - 1], nE - 1), "Left out one item"], [(Math.max.apply(null, xs) + Math.min.apply(null, xs)) / 2, "Averaged only the largest and smallest"]],
          sol: ["Sum = " + xs.map(N).join(" + ") + " = " + N(s), N(s) + " ÷ " + nE + " = **" + f(R(a)) + "**"], short: "Add the values, divide by how many there are.", trap: "Dividing by the wrong count." };
      });
    }
    if (d === "Medium") {
      if (D.shape === "series") {
        const [e1, e2] = c.ents(2);
        return first(c, winOf(nP, Math.min(3, nP)).concat(winOf(nP, 4)), ([t1, t2]) => {
          const n = t2 - t1 + 1, xs1 = c.col(mi, e1, t1, t2), xs2 = c.col(mi, e2, t1, t2), s = sum(xs1) + sum(xs2), a = s / n; if (!C(a)) return null;
          return { body: "what was the average yearly combined " + c.np(mi, e1) + " and " + D.ref(e2) + " from " + D.P[t1] + " to " + D.P[t2] + "?", ans: a, f, wrongs: [[s / (2 * n), "Divided by the number of values (" + 2 * n + "), giving the average per series-year"], [s, "Gave the total without dividing"], [sum(xs1) / n, "Averaged only the first series"], [s / (n + 1), "Divided by one more than the number of years"]],
            sol: [D.E[e1] + ": " + xs1.map(N).join(" + ") + " = " + N(sum(xs1)), D.E[e2] + ": " + xs2.map(N).join(" + ") + " = " + N(sum(xs2)), "Combined total = " + N(s) + "; ÷ " + n + " years = **" + f(R(a)) + "**"], short: "Add both series, divide by the number of years.", trap: "Dividing by the number of values rather than the number of years." };
        });
      }
      return first(c, range(0, nP - 1), (t) => {
        const xs = c.row(mi, t), s = sum(xs), a = s / nE; if (!C(a)) return null;
        const t2 = c.adj(t);
        return { body: "what was the average " + c.na(mi) + " per item in " + D.P[t] + " (the mean of all " + nE + " " + D.pl + ")?", ans: a, f, wrongs: [[s, "Gave the total without dividing"], [s / (nE - 1), "Divided by one less than the number of items"], [sum(V[t2]) / nE, "Used the " + D.P[t2] + " figures"], [(Math.max.apply(null, xs) + Math.min.apply(null, xs)) / 2, "Averaged only the largest and smallest"]],
          sol: ["Sum = " + xs.map(N).join(" + ") + " = " + N(s), N(s) + " ÷ " + nE + " = **" + f(R(a)) + "**"], short: "Total ÷ count.", trap: "Averaging only the extremes." };
      });
    }
    if (D.shape === "series") {
      return first(c, pairsOf(nE), ([e1, e2]) => {
        const x1 = c.col(mi, e1), x2 = c.col(mi, e2), a1 = sum(x1) / nP, a2 = sum(x2) / nP, a = a1 - a2; if (a <= 0 || !C(a)) return null;
        return { body: "by how much is the average annual " + c.np(mi, e1) + " greater than the average annual " + c.np(mi, e2) + " over " + yrRange(D) + "?", ans: a, f,
          wrongs: [[sum(x1) - sum(x2), "Compared the totals without dividing"], [a1 + a2, "Added the two averages"], [(sum(x1) - sum(x2)) / (nP - 1), "Divided the difference by one less than the number of years"], [a / 2, "Halved the difference"]],
          sol: [D.E[e1] + " average = " + N(sum(x1)) + " ÷ " + nP + " = " + N(R(a1)), D.E[e2] + " average = " + N(sum(x2)) + " ÷ " + nP + " = " + N(R(a2)), "Difference = **" + f(R(a)) + "**"], short: "Difference of totals ÷ number of years.", trap: "Forgetting to divide the totals." };
      });
    }
    return first(c, range(0, nE - 1), (e) => {
      const [a0, a1] = [V[0][e], V[nP - 1][e]]; c.v(mi, 0, e); c.v(mi, nP - 1, e);
      const gap = D.P[nP - 1] - D.P[0], a = (a1 - a0) / gap; if (a <= 0 || !C(a)) return null;
      return { body: "by how much, on average, did the " + c.np(mi, e) + " grow per year from " + D.P[0] + " to " + D.P[nP - 1] + "?", ans: a, f,
        wrongs: [[a1 - a0, "Gave the total growth without dividing"], [(a1 - a0) / (gap + 1), "Divided by one more than the number of years"], [(a1 - a0) / nP, "Divided by the number of charts instead of the number of years"], [(a1 + a0) / 2, "Averaged the two end values"]],
        sol: [D.P[0] + " = " + N(a0) + ", " + D.P[nP - 1] + " = " + N(a1), "Growth = " + N(a1 - a0) + " over " + gap + " years", N(a1 - a0) + " ÷ " + gap + " = **" + f(R(a)) + "**"], short: "Total growth ÷ years between.", trap: "Dividing by the number of data points." };
    });
  };

  /* 6. max / min / rank */
  const optYears = (c, ansT, others, why) => others.filter((t) => t !== ansT).map((t) => [+c.D.P[t], why]);
  QS["max-min-rank"] = (c) => {
    const { rng, d, D } = c, mi = c.pm(), M = D.M[mi], f = M.fmt, V = M.V, nP = D.P.length, nE = D.E.length;
    const arg = (xs, hi) => { let b = 0; xs.forEach((x, i) => { if (hi ? x > xs[b] : x < xs[b]) b = i; }); return b; };
    const uniq = (xs, hi) => { const b = arg(xs, hi); return xs.filter((x) => x === xs[b]).length === 1; };
    const sorted = (xs, hi) => xs.slice().sort((a, b) => (hi ? b - a : a - b));
    const T = D.temporal;
    if (d === "Easy") {
      if (T && rng.chance(0.55)) {
        const e = rng.int(0, nE - 1), xs = c.col(mi, e), hi = rng.chance(0.5); if (!uniq(xs, hi)) return null;
        const b = arg(xs, hi), s = sorted(xs, hi);
        return { body: "in which year was the " + c.np(mi, e) + " the " + (hi ? "highest" : "lowest") + "?", ans: +D.P[b], f: (x) => String(x), int: true,
          wrongs: [[+D.P[xs.indexOf(s[1])], "Picked the " + (hi ? "second highest" : "second lowest") + " year"], [+D.P[arg(xs, !hi)], "Picked the " + (hi ? "lowest" : "highest") + " year instead"], [+D.P[Math.min(nP - 1, b + 1)], "Picked the neighbouring year"], [+D.P[Math.max(0, b - 1)], "Picked the neighbouring year"]],
          sol: [D.E[e] + " by year: " + D.P.map((y, t) => y + " = " + N(xs[t])).join(", "), "The " + (hi ? "highest" : "lowest") + " is " + N(xs[b]) + ", in **" + D.P[b] + "**"], short: "Scan the series once for the " + (hi ? "tallest" : "shortest") + " point.", trap: "Confusing highest with lowest." };
      }
      const [t] = c.ts(1), xs = c.row(mi, t), hi = rng.chance(0.5); if (!uniq(xs, hi)) return null;
      const s = sorted(xs, hi);
      return { body: "what was the " + (hi ? "highest" : "lowest") + " " + D.M[mi].noun + " among all " + D.pl + " in " + D.P[t] + "?", ans: s[0], f,
        wrongs: [[s[1], "Picked the " + (hi ? "second highest" : "second lowest")], [sorted(xs, !hi)[0], "Picked the " + (hi ? "lowest" : "highest") + " instead"], [sum(xs) / nE, "Gave the average instead"], [s[2] != null ? s[2] : s[1] + 5, "Picked the third entry"]],
        sol: [D.P[t] + " values: " + xs.map(N).join(", "), "The " + (hi ? "highest" : "lowest") + " is **" + f(s[0]) + "**"], short: "Scan once; compare with the running best.", trap: "Picking the wrong end of the range." };
    }
    if (d === "Medium") {
      if (T && rng.chance(0.5)) {
        const e = rng.int(0, nE - 1), xs = c.col(mi, e), df = Math.max.apply(null, xs) - Math.min.apply(null, xs); if (!uniq(xs, true) || !uniq(xs, false)) return null;
        return { body: "what is the difference between the highest and the lowest " + c.np(mi, e) + " over " + yrRange(D) + "?", ans: df, f,
          wrongs: [[Math.max.apply(null, xs), "Gave the highest value only"], [Math.max.apply(null, xs) + Math.min.apply(null, xs), "Added the highest and lowest"], [df - sorted(xs, true)[0] + sorted(xs, true)[1], "Used the second highest instead of the highest"], [sum(xs) / nP, "Gave the average instead"]],
          sol: [D.E[e] + ": highest = " + N(Math.max.apply(null, xs)) + ", lowest = " + N(Math.min.apply(null, xs)), "Difference = **" + f(df) + "**"], short: "Range = highest − lowest.", trap: "Adding instead of subtracting." };
      }
      const [t] = c.ts(1), xs = c.row(mi, t), s = sorted(xs, true); if (!uniq(xs, true) || !uniq(xs, false)) return null;
      const df = s[0] - s[s.length - 1];
      return { body: "in " + D.P[t] + ", by how much did the highest " + D.M[mi].noun + " exceed the lowest among the " + D.pl + "?", ans: df, f, wrongs: [[s[0], "Gave the highest value only"], [s[0] - s[1], "Compared the highest with the second highest"], [s[0] + s[s.length - 1], "Added the highest and the lowest"], [s[1] - s[s.length - 1], "Started from the second highest"]],
        sol: [D.P[t] + " values: " + xs.map(N).join(", "), "Highest = " + N(s[0]) + ", lowest = " + N(s[s.length - 1]), "Difference = **" + f(df) + "**"], short: "Find both ends, subtract.", trap: "Using the second highest." };
    }
    if (T && rng.chance(0.55)) {
      const tot = V.map((r) => sum(r)); tot.forEach((_, t) => c.row(mi, t)); const hi = rng.chance(0.5); if (!uniq(tot, hi)) return null;
      const b = arg(tot, hi), s = sorted(tot, hi);
      return { body: "in which year was the total " + c.na(mi) + " the " + (hi ? "highest" : "lowest") + "?", ans: +D.P[b], f: (x) => String(x), int: true,
        wrongs: [[+D.P[tot.indexOf(s[1])], "Picked the " + (hi ? "second highest" : "second lowest") + " year"], [+D.P[arg(tot, !hi)], "Picked the " + (hi ? "lowest" : "highest") + " year"], [+D.P[arg(V.map((r) => r[0]), hi)], "Looked at the first series only"], [+D.P[arg(V.map((r) => Math.max.apply(null, r)), hi)], "Looked at the single biggest entry rather than the total"]],
        sol: ["Yearly totals: " + D.P.map((y, t) => y + " = " + N(tot[t])).join(", "), "The " + (hi ? "highest" : "lowest") + " is **" + D.P[b] + "**"], short: "Add each column of figures, then compare the totals.", trap: "Judging by one series instead of the total." };
    }
    if (T) {
      const e = rng.int(0, nE - 1), xs = c.col(mi, e), ch = xs.slice(1).map((x, i) => x - xs[i]), mx = Math.max.apply(null, ch);
      if (ch.filter((x) => x === mx).length > 1 || mx <= 0) return null;
      const i = ch.indexOf(mx), srt = ch.slice().sort((a, b) => b - a);
      return { body: "what was the largest year-on-year rise in the " + c.np(mi, e) + " during " + yrRange(D) + "?", ans: mx, f, wrongs: [[srt[1], "Gave the second largest rise"], [Math.max.apply(null, xs) - Math.min.apply(null, xs), "Gave the overall range, not the rise between consecutive years"], [xs[i + 1], "Gave the new level rather than the rise"], [xs[nP - 1] - xs[0], "Gave the total rise over the whole period"]],
        sol: ["Year-on-year changes: " + ch.map((x, k) => D.P[k + 1] + ": " + (x >= 0 ? "+" : MIN) + N(Math.abs(x))).join(", "), "Largest rise = **" + f(mx) + "** (" + D.P[i] + " to " + D.P[i + 1] + ")"], short: "Subtract neighbouring values; do not compare the heights.", trap: "Taking the tallest bar instead of the biggest jump." };
    }
    return first(c, pairsOf(nE), ([e1]) => {
      const ch = D.E.map((_, e) => V[nP - 1][e] - V[0][e]); D.E.forEach((_, e) => { c.v(mi, 0, e); c.v(mi, nP - 1, e); });
      const mx = Math.max.apply(null, ch); if (ch.filter((x) => x === mx).length > 1 || mx <= 0) return null;
      const srt = ch.slice().sort((a, b) => b - a);
      return { body: "what is the largest increase in " + D.M[mi].noun + " between " + D.P[0] + " and " + D.P[nP - 1] + " shown for any one of the " + D.pl + "?", ans: mx, f,
        wrongs: [[srt[1], "Gave the second largest increase"], [Math.max.apply(null, V[nP - 1]), "Gave the highest final value, not the increase"], [Math.abs(srt[srt.length - 1]), "Gave the smallest change"], [mx + srt[1], "Added the two largest increases"]],
        sol: ["Changes: " + D.E.map((n, e) => n + " " + (ch[e] >= 0 ? "+" : MIN) + N(Math.abs(ch[e]))).join(", "), "Largest = **" + f(mx) + "**"], short: "Compute each change, then compare the changes.", trap: "Picking the series with the highest final value." };
    });
  };

  /* 7. years above average */
  QS["years-above-average"] = (c) => {
    const { rng, d, D } = c, mi = c.pm(), M = D.M[mi], V = M.V, nP = D.P.length, nE = D.E.length;
    const T = D.shape === "series";
    const wr = (cnt, n, what) => [[n - cnt, "Counted the " + what + " below the average instead of above"], [cnt + 1, "Counted one " + what.replace(/s$/, "") + " too many"], [cnt - 1, "Missed one " + what.replace(/s$/, "")], [cnt + 2, "Counted two " + what + " too many"], [n, "Counted every one"]];
    const mkq = (body, cnt, n, what, sol, short, trap) => ({ body, ans: cnt, f: (x) => String(x), int: true, signed: true, wrongs: wr(cnt, n, what).filter((w) => w[0] >= 0 && w[0] <= n), sol, short, trap });
    if (T) {
      if (d === "Easy") {
        const e = rng.int(0, nE - 1), xs = c.col(mi, e), av = sum(xs) / nP; if (xs.some((x) => x === av)) return null;
        const cnt = xs.filter((x) => x > av).length;
        return mkq("in how many years during " + yrRange(D) + " was the " + c.np(mi, e) + " above its own average for the period?", cnt, nP, "years",
          ["Average = " + N(sum(xs)) + " ÷ " + nP + " = " + N(R(av)), "Years above it: " + D.P.filter((_, t) => xs[t] > av).join(", "), "Count = **" + cnt + "**"], "Find the mean once, then tick the years above it.", "Counting years that are equal to or below the average.");
      }
      if (d === "Medium") {
        const [e1, e2] = c.ents(2), xs = c.col(mi, e1), ys = c.col(mi, e2); if (xs.some((x, t) => x === ys[t])) return null;
        const cnt = xs.filter((x, t) => x > ys[t]).length;
        return mkq("in how many years from " + D.P[0] + " to " + D.P[nP - 1] + " was the " + c.np(mi, e1) + " greater than the " + c.np(mi, e2) + "?", cnt, nP, "years",
          ["Compare year by year: " + D.P.map((y, t) => y + ": " + N(xs[t]) + (xs[t] > ys[t] ? " > " : " < ") + N(ys[t])).join("; "), "Count = **" + cnt + "**"], "Compare the two series year by year.", "Comparing with the average instead of with the other series.");
      }
      const [e] = c.ents(1); let cnt = 0, tie = false; const list = [];
      for (let t = 0; t < nP; t++) { const row = c.row(mi, t), others = (sum(row) - row[e]) / (nE - 1); if (row[e] === others) tie = true; if (row[e] > others) { cnt++; list.push(D.P[t]); } }
      if (tie) return null;
      return mkq("in how many of the years " + yrRange(D) + " was the " + c.np(mi, e) + " above the average of the other " + (nE - 1) + " " + D.pl + " in that year?", cnt, nP, "years",
        ["For each year compare " + D.E[e] + " with the mean of the other " + (nE - 1) + " " + D.pl, "Years above: " + (list.join(", ") || "none"), "Count = **" + cnt + "**"], "Take the mean of the others once per year; compare.", "Including " + D.E[e] + " itself in the average.");
    }
    // pie / radar: items across one period
    if (d === "Easy") {
      const [t] = c.ts(1), xs = c.row(mi, t), av = sum(xs) / nE; if (xs.some((x) => x === av)) return null;
      const cnt = xs.filter((x) => x > av).length;
      return mkq("in " + D.P[t] + ", for how many of the " + nE + " " + D.pl + " was the " + D.M[mi].noun + " above the average of all " + D.pl + "?", cnt, nE, D.pl,
        ["Average = " + N(sum(xs)) + " ÷ " + nE + " = " + N(R(av)), "Above it: " + D.E.filter((_, e) => xs[e] > av).join(", "), "Count = **" + cnt + "**"], "Mean first, then compare each one.", "Counting items equal to or below the mean.");
    }
    const [ta, tb] = d === "Medium" ? [0, nP - 1] : [0, 1];
    const a = c.row(mi, ta), b = c.row(mi, tb);
    if (d === "Medium") {
      const all = a.concat(b), av = sum(all) / all.length; if (b.some((x) => x === av)) return null;
      const cnt = b.filter((x) => x > av).length;
      return mkq("the average of all " + all.length + " figures (both years) is taken as the benchmark. For how many of the " + nE + " " + D.pl + " was the " + D.P[tb] + " figure above it?", cnt, nE, D.pl,
        ["Benchmark = " + N(sum(all)) + " ÷ " + all.length + " = " + N(R(av)), "Above it in " + D.P[tb] + ": " + D.E.filter((_, e) => b[e] > av).join(", "), "Count = **" + cnt + "**"], "One benchmark for both years.", "Using each year's own average.");
    }
    const ava = sum(a) / nE, avb = sum(b) / nE; if (a.some((x) => x === ava) || b.some((x) => x === avb)) return null;
    const cnt = D.E.filter((_, e) => a[e] > ava && b[e] > avb).length;
    return mkq("for how many of the " + nE + " " + D.pl + " was the " + D.M[mi].noun + " above that year's average in BOTH " + D.P[ta] + " and " + D.P[tb] + "?", cnt, nE, D.pl,
      [D.P[ta] + " average = " + N(R(ava)) + ", " + D.P[tb] + " average = " + N(R(avb)), "Above both: " + (D.E.filter((_, e) => a[e] > ava && b[e] > avb).join(", ") || "none"), "Count = **" + cnt + "**"], "Mark the above-average ones for each year, then keep the overlap.", "Counting those above in only one of the years.");
  };

  /* 8. approximate value (plain data; options far apart; answer is the nearest whole number) */
  QS["approximate-value"] = (c) => {
    const { rng, d, D } = c, mi = c.pm(), M = D.M[mi], V = M.V, nP = D.P.length, nE = D.E.length;
    const pf = (x) => "≈ " + x + "%", chg = (o, n) => (n - o) / o * 100;
    const mkA = (body, x, wrongs, sol, short, trap, f) => {
      if (!isFinite(x) || x < 4 || x > 400) return null;
      const fr = x - Math.floor(x); if (Math.abs(fr - 0.5) < 0.12 || fr < 0.03 || fr > 0.97) return null;
      return { body, ans: x, shown: Math.round(x), f: f || pf, wrongs, gap: (k) => Math.max(4, k * 0.18), sol, short, trap };
    };
    if (d === "Easy") {
      const cand = []; for (let e = 0; e < nE; e++) for (let t = 0; t + 1 < nP; t++) cand.push([e, t]);
      return first(c, cand, ([e, t]) => {
        const o = V[t][e], n = V[t + 1][e], ch = chg(o, n), up = ch > 0; c.v(mi, t, e); c.v(mi, t + 1, e);
        return mkA("by approximately what percent did the " + c.np(mi, e) + " " + (up ? "increase" : "decrease") + " from " + D.P[t] + " to " + D.P[t + 1] + "?", Math.abs(ch),
          [[Math.abs(n - o) / n * 100, "Divided the change by the new value instead of the old"], [n / o * 100, "Gave the new value as a percentage of the old"], [Math.abs(n - o), "Gave the plain change as the percentage"], [o / n * 100, "Gave the old value as a percentage of the new"]],
          [D.P[t] + " = " + N(o) + ", " + D.P[t + 1] + " = " + N(n), "Change = " + N(Math.abs(n - o)) + "; " + N(Math.abs(n - o)) + " ÷ " + N(o) + " × 100 = " + N(R(Math.abs(ch))) + "%", "Nearest whole number: **" + Math.round(Math.abs(ch)) + "%**"],
          "Round the figures first (e.g. 237 ≈ 240) and divide the change by the old value.", "Using the new value as the base.");
      });
    }
    if (d === "Medium" && D.shape === "pie") {
      return first(c, range(0, nE - 1), (e) => {
        const a = c.v(mi, 0, e), T = sum(c.row(mi, 1)), x = pcOf(a, T);
        return mkA("the " + c.np(mi, e) + " in " + D.P[0] + " was approximately what percent of the total " + c.na(mi) + " in " + D.P[1] + "?", x,
          [[pcOf(a, sum(V[0])), "Used the " + D.P[0] + " total as the base"], [pcOf(V[1][e], T), "Used the " + D.P[1] + " figure of the same item"], [100 - x, "Gave the percentage of the rest"], [pcOf(a, T / nE), "Compared with an average item instead of the total"]],
          [D.P[0] + " figure = " + N(a), D.P[1] + " total = " + N(T), N(a) + " \u00F7 " + N(T) + " \u00D7 100 = " + N(R(x)) + "%", "Nearest whole number: **" + Math.round(x) + "%**"], "Read the two amounts from the pies (share \u00D7 total), round, and divide.", "Dividing by the total of the wrong year.");
      });
    }
    if (d === "Medium") {
      return first(c, range(0, nE - 1), (e) => first(c, range(0, nP - 1), (t) => {
        const row = c.row(mi, t), T = sum(row), a = row[e], x = pcOf(a, T);
        return mkA("approximately what percent of the total " + c.na(mi) + " in " + D.P[t] + " was contributed by " + D.ref(e) + "?", x,
          [[pcOf(a, T - a), "Compared with the rest instead of the total"], [100 - x, "Gave the share of all the others"], [pcOf(a, Math.max.apply(null, row)), "Compared with the largest figure instead of the total"], [pcOf(a, T / nE), "Compared with the average instead of the total"]],
          ["Total = " + N(T) + ", " + D.E[e] + " = " + N(a), N(a) + " ÷ " + N(T) + " × 100 = " + N(R(x)) + "%", "Nearest whole number: **" + Math.round(x) + "%**"], "Round both figures to round numbers and simplify the fraction.", "Dividing by the sum of the others.");
      }));
    }
    return first(c, pairsOf(nE).filter((p) => p[0] < p[1]), ([e1, e2]) => first(c, winOf(nP, 2).concat(nP > 3 ? winOf(nP, 3) : []), ([t1, t2]) => {
      const o = c.v(mi, t1, e1) + c.v(mi, t1, e2), n = c.v(mi, t2, e1) + c.v(mi, t2, e2), ch = chg(o, n), up = ch > 0, g = (t2 - t1 > 0 ? D.P[t2] - D.P[t1] : 1);
      return mkA("by approximately what percent did the combined " + c.np(mi, e1) + " and " + D.ref(e2) + " " + (up ? "increase" : "decrease") + " from " + D.P[t1] + " to " + D.P[t2] + "?", Math.abs(ch),
        [[Math.abs(n - o) / n * 100, "Divided by the later total instead of the earlier"], [Math.abs(n - o), "Gave the plain change as the percentage"], [n / o * 100, "Gave the later total as a percentage of the earlier"], [Math.abs(ch) / g, "Divided the total change by the number of years"]],
        [D.P[t1] + " combined = " + N(o), D.P[t2] + " combined = " + N(n), N(Math.abs(n - o)) + " ÷ " + N(o) + " × 100 = " + N(R(Math.abs(ch))) + "%", "Nearest whole number: **" + Math.round(Math.abs(ch)) + "%**"],
        "Add first, round the totals, then one percentage change.", "Mixing up old and new base.");
    }));
  };

  /* 9. CAGR (data are built so that the end value is start x (1 + r)^n) */
  QS["cagr-roughly"] = (c) => {
    const { rng, d, D } = c, g = D.cg; if (!g) return null;
    const M = D.M[0], f = M.fmt, v0 = c.v(0, g.t0, g.e), v1 = c.v(0, g.t1, g.e), r = g.r, n = D.shape === "series" ? g.n : +D.P[g.t1] - +D.P[g.t0], ratio = v1 / v0, tot = (ratio - 1) * 100;
    const pf = (x) => P(x), y0 = D.P[g.t0], y1 = D.P[g.t1], rr = r / 100;
    const base = [[tot, "Gave the total growth over the whole period"], [tot / n, "Divided the total growth by " + n + " (simple average, ignoring compounding)"], [(Math.pow(ratio, 1 / (n + 1)) - 1) * 100, "Counted both end years, giving " + (n + 1) + " periods"], [r + 10, "Guessed a rate close to the right one"]];
    if (d === "Hard" && rng.chance(0.6)) {
      const nxt = v1 * (1 + rr), y2 = +y1 + 1;
      return { body: "the " + c.np(0, g.e) + " grew at a constant compound annual rate from " + y0 + " to " + y1 + ". If the same rate continues, what will it be in " + y2 + "?", ans: nxt, f,
        wrongs: [[v1 + (v1 - v0) / n, "Added the average yearly rise (simple growth) instead of compounding"], [v1 * (1 + tot / 100), "Applied the total growth for the whole period again"], [v1 * (1 + rr) * (1 + rr), "Grew it by two years instead of one"], [v1 + v0 * rr, "Applied the rate to the starting value"]],
        sol: [y0 + " = " + N(v0) + ", " + y1 + " = " + N(v1), "(1 + g)^" + n + " = " + String(QB.round(ratio, 3)) + " → g = " + r + "%", "Next value = " + N(v1) + " × " + R(1 + rr) + " = **" + f(R(nxt)) + "**"], short: "Find g from the ratio of end to start, then multiply once more.", trap: "Compounding the total growth again." };
    }
    return { body: "what was the compound annual growth rate (CAGR) of the " + c.np(0, g.e) + " from " + y0 + " to " + y1 + "?", ans: r, f: pf, wrongs: base,
      sol: [y0 + " = " + N(v0) + ", " + y1 + " = " + N(v1) + ", so the ratio is " + String(QB.round(ratio, 3)) + " over " + n + " years", "(1 + g)^" + n + " = " + String(QB.round(ratio, 3)) + " → 1 + g = " + R(1 + rr) + " (since " + R(1 + rr) + "^" + n + " = " + String(QB.round(ratio, 3)) + ")", "CAGR = **" + P(r) + "**"],
      short: "Match the ratio with a known power: 1.1² = 1.21, 1.2² = 1.44, 1.25² = 1.5625, 1.2³ = 1.728.", trap: "Dividing the total growth by the number of years." };
  };

  /* 10. combined */
  QS["combined"] = (c) => {
    const { rng, d, D } = c, nP = D.P.length, nE = D.E.length;
    if (D.pair) {
      const pk = D.pack, A = D.M[0].V, B = D.M[1].V, f = D.M[0].fmt, dn = pk.diff.noun, df = (t, e) => { c.v(0, t, e); c.v(1, t, e); return A[t][e] - B[t][e]; };
      const nm = (e) => D.ref(e);
      if (d === "Easy") {
        const [e] = c.ents(1), [t] = c.ts(1), v = df(t, e);
        return { body: "what was the " + dn + " " + D.prep + " " + nm(e) + " in " + D.P[t] + "? (" + pk.diff.def + ")", ans: v, f, wrongs: [[A[t][e] + B[t][e], "Added the two figures instead of subtracting"], [A[t][e], "Gave the first figure only"], [B[t][e], "Gave the second figure only"], [Math.abs(A[t][e] - B[c.adj(t)][e]), "Subtracted the figure of " + D.P[c.adj(t)] + " by mistake"]],
          sol: [D.M[0].noun + " = " + N(A[t][e]) + ", " + D.M[1].noun + " = " + N(B[t][e]), "Answer = " + N(A[t][e]) + " − " + N(B[t][e]) + " = **" + f(v) + "**"], short: "Read the same cell in both tables and subtract.", trap: "Reading both figures from the same table." };
      }
      if (d === "Medium") {
        if (rng.chance(0.5)) {
          const [e] = c.ents(1);
          return first(c, winOf(nP, 3).concat(winOf(nP, 2)), ([t1, t2]) => {
            let s = 0; for (let t = t1; t <= t2; t++) s += df(t, e);
            return { body: "what was the total " + dn + " " + D.prep + " " + nm(e) + " from " + D.P[t1] + " to " + D.P[t2] + "? (" + pk.diff.def + ")", ans: s, f, wrongs: [[sum(A.slice(t1, t2 + 1).map((r) => r[e])), "Added only the first table"], [sum(B.slice(t1, t2 + 1).map((r) => r[e])), "Added only the second table"], [s / (t2 - t1 + 1), "Gave the yearly average instead of the total"], [s + df(Math.min(nP - 1, t2 + 1), e) * (t2 + 1 < nP ? 1 : 0) + 10, "Included an extra year"]],
              sol: D.P.slice(t1, t2 + 1).map((y, k) => y + ": " + N(A[t1 + k][e]) + " − " + N(B[t1 + k][e]) + " = " + N(A[t1 + k][e] - B[t1 + k][e])).concat(["Total = **" + f(s) + "**"]), short: "Subtract year by year, then add.", trap: "Adding the two tables first and subtracting once at the end gives the same answer, but skipping a year does not." };
          });
        }
        const rate = pk.rate, on = rate.on, [e] = c.ents(1);
        return first(c, range(0, nP - 1), (t) => {
          const a = A[t][e], b = B[t][e], x = rate.on === 1 ? (a - b) / b * 100 : b / a * 100; if (!C(x)) return null;
          c.v(0, t, e); c.v(1, t, e);
          const other = rate.on === 1 ? (a - b) / a * 100 : (a - b) / a * 100;
          return { body: "what was the " + rate.name + " " + D.prep + " " + nm(e) + " in " + D.P[t] + "? (" + rate.def + ")", ans: x, f: P, wrongs: [[other, "Used the wrong base"], [rate.on === 1 ? b / a * 100 : a / b * 100, "Inverted the fraction"], [Math.abs(a - b), "Gave the plain difference as the percentage"], [a / b * 100 - (rate.on === 1 ? 0 : 100), "Gave one figure as a percentage of the other"]],
            sol: [D.M[0].noun + " = " + N(a) + ", " + D.M[1].noun + " = " + N(b), "Using the formula: **" + P(x) + "**"], short: "Mind which table is the base: the denominator is the " + (rate.on === 1 ? "expenditure" : "first table's figure") + ".", trap: "Choosing the wrong base." };
        });
      }
      const rr = rng.int(0, 2);
      if (rr === 0) {
        return first(c, pairsOf(nE), ([e1, e2]) => first(c, range(0, nP - 1), (t) => {
          const a = df(t, e1), b = df(t, e2); if (a <= 0 || b <= 0) return null;
          const p = rt(a, b); if (p[0] > 30 || p[1] > 30 || (p[0] === 1 && p[1] === 1)) return null;
          const alt = rt(A[t][e1], A[t][e2]), pairs = [[rtx(p), null], [rtx([p[1], p[0]]), "Wrote the ratio the wrong way round"], [rtx(alt), "Used the first table's figures instead of the " + dn], [rtx(rt(B[t][e1], B[t][e2])), "Used the second table's figures instead of the " + dn]];
          if (new Set(pairs.map((x) => x[0])).size < 4) return null;
          return { body: "what is the ratio of the " + dn + " " + D.prep + " " + nm(e1) + " to that of " + nm(e2) + " in " + D.P[t] + "? (" + pk.diff.def + ")", pairs, calc: p[0] + "/" + p[1],
            sol: [D.E[e1] + ": " + N(A[t][e1]) + " − " + N(B[t][e1]) + " = " + N(a), D.E[e2] + ": " + N(A[t][e2]) + " − " + N(B[t][e2]) + " = " + N(b), "Ratio = " + a + " : " + b + " = **" + rtx(p) + "**"], short: "Find both differences first; then cancel.", trap: "Taking the ratio of the original figures." };
        }));
      }
      if (rr === 1) {
        return first(c, range(0, nE - 1), (e) => first(c, winOf(nP, 2).concat(nP > 3 ? winOf(nP, 3) : []), ([t1, t2]) => {
          const a = df(t1, e), b = df(t2, e); if (a <= 0 || b <= 0 || a === b) return null;
          const ch = (b - a) / a * 100; if (!C(ch)) return null;
          return { body: "by what percent did the " + dn + " " + D.prep + " " + nm(e) + " " + (ch > 0 ? "increase" : "decrease") + " from " + D.P[t1] + " to " + D.P[t2] + "? (" + pk.diff.def + ")", ans: Math.abs(ch), f: P,
            wrongs: [[Math.abs(b - a) / b * 100, "Divided by the later figure"], [Math.abs(b - a), "Gave the plain change as the percentage"], [Math.abs((A[t2][e] - A[t1][e]) / A[t1][e] * 100), "Used the first table's figures instead of the " + dn], [b / a * 100, "Gave the later " + dn + " as a percentage of the earlier"]],
            sol: [D.P[t1] + ": " + N(A[t1][e]) + " − " + N(B[t1][e]) + " = " + N(a), D.P[t2] + ": " + N(A[t2][e]) + " − " + N(B[t2][e]) + " = " + N(b), N(Math.abs(b - a)) + " ÷ " + N(a) + " × 100 = **" + P(Math.abs(ch)) + "**"], short: "Get the two differences, then one percentage change.", trap: "Computing the change on the first table alone." };
        }));
      }
      return first(c, range(0, nP - 1), (t) => {
        let s = 0, sa = 0, sb = 0; for (let e = 0; e < nE; e++) { s += df(t, e); sa += A[t][e]; sb += B[t][e]; }
        return { body: "what was the total " + dn + " " + D.prep + " all " + D.pl + " in " + D.P[t] + "? (" + pk.diff.def + ")", ans: s, f, wrongs: [[sa, "Added only the first table"], [sb, "Added only the second table"], [sa + sb, "Added both tables instead of subtracting"], [s / nE, "Gave the average per item"]],
          sol: ["First table total = " + N(sa) + ", second table total = " + N(sb), "Answer = " + N(sa) + " − " + N(sb) + " = **" + f(s) + "**"], short: "Total of one table minus total of the other.", trap: "Subtracting only for one item." };
      });
    }
    // single measure
    const mi = 0, M = D.M[0], f = M.fmt, V = M.V;
    if (d === "Easy") {
      return first(c, pairsOf(nE), ([e1, e2]) => {
        const [t1, t2] = rng.shuffle(range(0, nP - 1)).slice(0, 2), a = c.v(0, t1, e1), b = c.v(0, t2, e2); if (a === b) return null;
        const big = a > b;
        return { body: "how much " + (big ? "more" : "less") + " was the " + c.np(0, e1) + " in " + D.P[t1] + " than the " + c.np(0, e2) + " in " + D.P[t2] + "?", ans: Math.abs(a - b), f,
          wrongs: [[a + b, "Added the two figures instead of finding the difference"], [Math.abs(V[t1][e1] - V[t1][e2]), "Compared both entities within " + D.P[t1] + " only"], [Math.abs(V[t2][e1] - V[t2][e2]), "Compared both entities within " + D.P[t2] + " only"], [Math.abs(a - V[t2][e1]), "Compared the same entity across the two years"]],
          sol: [D.E[e1] + " in " + D.P[t1] + " = " + N(a), D.E[e2] + " in " + D.P[t2] + " = " + N(b), "Difference = **" + f(Math.abs(a - b)) + "**"], short: "Read two cells (note the different year for each) and subtract.", trap: "Using the same year for both." };
      });
    }
    if (d === "Medium") {
      const [e1, e2] = c.ents(2);
      return first(c, winOf(nP, 2).concat(nP > 3 ? winOf(nP, 3) : []), ([t1, t2]) => {
        const o = c.v(0, t1, e1) + c.v(0, t1, e2), n = c.v(0, t2, e1) + c.v(0, t2, e2), df = Math.abs(n - o); if (!df) return null;
        return { body: "by how much did the combined " + c.np(0, e1) + " and " + D.ref(e2) + " in " + D.P[n > o ? t2 : t1] + " exceed that in " + D.P[n > o ? t1 : t2] + "?", ans: df, f,
          wrongs: [[n + o, "Added the two years instead of finding the difference"], [Math.abs(V[t2][e1] - V[t1][e1]), "Used only " + D.E[e1]], [Math.abs(V[t2][e2] - V[t1][e2]), "Used only " + D.E[e2]], [Math.max(n, o), "Gave the larger combined figure itself"]],
          sol: [D.P[t1] + ": " + N(V[t1][e1]) + " + " + N(V[t1][e2]) + " = " + N(o), D.P[t2] + ": " + N(V[t2][e1]) + " + " + N(V[t2][e2]) + " = " + N(n), "Difference = **" + f(df) + "**"], short: "Add the pair in each year, then subtract.", trap: "Finding the difference for one entity only." };
      });
    }
    return first(c, pairsOf(nE), ([e1, e2]) => first(c, winOf(nP, 2).concat(nP > 3 ? winOf(nP, 3) : []), ([t1, t2]) => {
      const inc = V[t2][e1] - V[t1][e1], base = V[t1][e2]; if (inc <= 0) return null;
      c.v(0, t1, e1); c.v(0, t2, e1); c.v(0, t1, e2);
      const x = inc / base * 100; if (!C(x)) return null;
      return { body: "the increase in the " + c.np(0, e1) + " from " + D.P[t1] + " to " + D.P[t2] + " is what percent of the " + c.np(0, e2) + " in " + D.P[t1] + "?", ans: x, f: P,
        wrongs: [[inc / V[t1][e1] * 100, "Used the first entity's own earlier value as the base"], [inc / V[t2][e2] * 100, "Used the second entity's later value as the base"], [V[t2][e1] / base * 100, "Used the final value instead of the increase"], [inc, "Gave the plain increase as the percentage"]],
        sol: [D.E[e1] + ": " + N(V[t2][e1]) + " − " + N(V[t1][e1]) + " = " + N(inc), D.E[e2] + " in " + D.P[t1] + " = " + N(base), N(inc) + " ÷ " + N(base) + " × 100 = **" + P(x) + "**"], short: "Find the increase first; the base is the figure named after “of”.", trap: "Using the wrong base." };
    }));
  };

  /* ------------------------------------------------------------------ registration of the 90 table / chart generators */
  const PATS = [["direct-read", "Direct read"], ["pct-change-growth", "% change / growth"], ["ratio-of-two-values", "Ratio of two values"], ["share-of-total", "Share of total"], ["average", "Average"],
    ["max-min-rank", "Max / min / rank"], ["years-above-average", "Years above average"], ["approximate-value", "Approximate value"], ["cagr-roughly", "CAGR roughly"], ["combined", "Combined (e.g. profit from income and expense)"]];

  function buildQ(topicId, pat, rng, d) {
    const T = TOPICS[topicId];
    for (let i = 0; i < 400; i++) {
      const o = {};
      if (pat === "approximate-value") o.plain = true;
      else if (d === "Hard" && rng.chance(0.4)) o.plain = true;
      if (pat === "cagr-roughly") o.cg = { rn: rng.pick(CG[d]) };
      if (pat === "combined" && !T.cfg.pair && d !== "Easy" && !o.plain) o.plain = rng.chance(0.3);
      const D = makeD(rng, d, T.cfg, o);
      if (!D) continue;
      if (topicId === "di-caselet" && !o.cg && rng.chance(0.4)) { if (!chainV(rng, D)) continue; }
      const c = ctx(rng, d, D);
      const r = QS[pat](c);
      if (!r) continue;
      const q = finish(c, r);
      if (q) return q;
    }
    throw new Error(topicId + "/" + pat + ": no clean question found");
  }

  Object.keys(TOPICS).forEach((tid) => {
    PATS.forEach(([pat, title]) => {
      QB.gen("di/" + tid + "/" + pat, { title, gen(rng, d) { return buildQ(tid, pat, rng, d); } });
    });
  });

  /* ------------------------------------------------------------------ Venn diagrams */
  const VCTX = [
    { who: "students", verb: "learn", names: ["Python", "Java", "SQL"] },
    { who: "members", verb: "play", names: ["Cricket", "Football", "Hockey"] },
    { who: "employees", verb: "know", names: ["Tally", "Excel", "SAP"] },
    { who: "customers", verb: "buy", names: ["Soap", "Shampoo", "Cream"] },
    { who: "people", verb: "drink", names: ["Tea", "Coffee", "Juice"] },
    { who: "students", verb: "study", names: ["Maths", "Physics", "Chemistry"] },
  ];
  function vennData(rng, d, cg) {
    const cx = rng.pick(VCTX), unit = d === "Hard" ? 1 : 5;
    const g = (lo, hi) => unit * rng.int(Math.ceil(lo / unit), Math.floor(hi / unit));
    const r = { a: g(10, 40), b: g(10, 40), c: g(10, 40), ab: g(5, 20), bc: g(5, 20), ac: g(5, 20), abc: g(5, 15), none: g(10, 40) };
    if (cg) { // make |A| = a multiple of the numerator of the growth factor
      const [num] = FACT[cg.r + "," + cg.n], tA = r.a + r.ab + r.ac + r.abc; let target = Math.ceil(tA / num) * num; if (target < r.ab + r.ac + r.abc + 5) target += num;
      r.a = target - r.ab - r.ac - r.abc; if (r.a < 5 || target > 160) return null;
    }
    return { cx, r, names: cx.names, who: cx.who, verb: cx.verb, cg };
  }
  const vt = (r) => ({ A: r.a + r.ab + r.ac + r.abc, B: r.b + r.ab + r.bc + r.abc, Cc: r.c + r.bc + r.ac + r.abc });
  const vN = (r) => r.a + r.b + r.c + r.ab + r.bc + r.ac + r.abc + r.none;
  function vennSVG(V) {
    const { r, names } = V, tx = (x, y, s) => '<text x="' + x + '" y="' + y + '">' + s + "</text>";
    return '<svg viewBox="0 0 360 300" width="100%" style="max-width:380px" role="img" aria-label="Venn diagram of ' + esc(names.join(", ")) + '"><g stroke="currentColor" fill="none" stroke-width="1.5"><circle cx="130" cy="110" r="80"/><circle cx="230" cy="110" r="80"/><circle cx="180" cy="190" r="80"/><rect x="2" y="2" width="356" height="296" rx="6" stroke-opacity=".4"/></g>' +
      '<g fill="currentColor" font-size="15" text-anchor="middle" font-family="sans-serif">' + tx(90, 95, r.a) + tx(270, 95, r.b) + tx(180, 240, r.c) + tx(180, 82, r.ab) + tx(133, 172, r.ac) + tx(227, 172, r.bc) + tx(180, 138, r.abc) +
      '<text x="50" y="28" font-weight="bold">' + esc(names[0]) + '</text><text x="310" y="28" font-weight="bold">' + esc(names[1]) + '</text><text x="310" y="282" font-weight="bold">' + esc(names[2]) + '</text><text x="52" y="270" font-size="13">None: ' + r.none + "</text></g></svg>" +
      "<p><em>Numbers are " + esc(V.who) + " in each region (the overlaps are the " + esc(V.who) + " who " + esc(V.verb) + " both or all three). " + vN(r) + " " + esc(V.who) + " were surveyed in all.</em></p>";
  }

  // named quantities: value + the arithmetic written out
  function vq(V) {
    const r = V.r, nm = V.names, T = vt(r), tot = [T.A, T.B, T.Cc], who = V.who, vb = V.verb, N0 = vN(r), U = N0 - r.none;
    const ow = [r.a, r.b, r.c], pw = { "01": [r.ab, "ab"], "12": [r.bc, "bc"], "02": [r.ac, "ac"] };
    const key = (i, j) => (i < j ? "" + i + j : "" + j + i), k3 = (i, j) => 3 - i - j;
    const Q = {
      only: (i) => ({ v: ow[i], t: who + " who " + vb + " only " + nm[i], s: "read the " + nm[i] + "-only region = " + ow[i] }),
      two: (i, j) => ({ v: pw[key(i, j)][0], t: who + " who " + vb + " " + nm[i] + " and " + nm[j] + " but not " + nm[k3(i, j)], s: "read the overlap of " + nm[i] + " and " + nm[j] + " outside " + nm[k3(i, j)] + " = " + pw[key(i, j)][0] }),
      all: () => ({ v: r.abc, t: who + " who " + vb + " all three (" + nm.join(", ") + ")", s: "read the centre region = " + r.abc }),
      both: (i, j) => ({ v: pw[key(i, j)][0] + r.abc, t: who + " who " + vb + " both " + nm[i] + " and " + nm[j], s: pw[key(i, j)][0] + " (only these two) + " + r.abc + " (all three) = " + (pw[key(i, j)][0] + r.abc) }),
      tot: (i) => ({ v: tot[i], t: who + " who " + vb + " " + nm[i], s: "add the four regions inside the " + nm[i] + " circle = " + tot[i] }),
      but: (i, j) => ({ v: tot[i] - (pw[key(i, j)][0] + r.abc), t: who + " who " + vb + " " + nm[i] + " but not " + nm[j], s: tot[i] + " (all in " + nm[i] + ") − " + (pw[key(i, j)][0] + r.abc) + " (those who also " + vb + " " + nm[j] + ") = " + (tot[i] - pw[key(i, j)][0] - r.abc) }),
      exTwo: () => ({ v: r.ab + r.bc + r.ac, t: who + " who " + vb + " exactly two of the three", s: r.ab + " + " + r.bc + " + " + r.ac + " = " + (r.ab + r.bc + r.ac) }),
      exOne: () => ({ v: r.a + r.b + r.c, t: who + " who " + vb + " exactly one of the three", s: r.a + " + " + r.b + " + " + r.c + " = " + (r.a + r.b + r.c) }),
      atTwo: () => ({ v: r.ab + r.bc + r.ac + r.abc, t: who + " who " + vb + " at least two of the three", s: r.ab + " + " + r.bc + " + " + r.ac + " + " + r.abc + " = " + (r.ab + r.bc + r.ac + r.abc) }),
      atOne: () => ({ v: U, t: who + " who " + vb + " at least one of the three", s: N0 + " − " + r.none + " (none) = " + U }),
      either: (i, j) => ({ v: tot[i] + tot[j] - (pw[key(i, j)][0] + r.abc), t: who + " who " + vb + " " + nm[i] + " or " + nm[j] + " (or both)", s: tot[i] + " + " + tot[j] + " − " + (pw[key(i, j)][0] + r.abc) + " (counted twice) = " + (tot[i] + tot[j] - pw[key(i, j)][0] - r.abc) }),
      orNot: (i, j) => { const kk = k3(i, j), v = ow[i] + ow[j] + pw[key(i, j)][0]; return { v, t: who + " who " + vb + " " + nm[i] + " or " + nm[j] + " but not " + nm[kk], s: "only " + nm[i] + " + only " + nm[j] + " + (" + nm[i] + " and " + nm[j] + " only) = " + ow[i] + " + " + ow[j] + " + " + pw[key(i, j)][0] + " = " + v }; },
      notAll: () => ({ v: U - r.abc, t: who + " who " + vb + " at least one of the three but not all three", s: U + " − " + r.abc + " = " + (U - r.abc) }),
      none: () => ({ v: r.none, t: who + " who " + vb + " none of the three", s: "read the outside region = " + r.none }),
      twoOrNone: () => ({ v: r.ab + r.bc + r.ac + r.none, t: who + " who " + vb + " exactly two of the three or none", s: r.ab + " + " + r.bc + " + " + r.ac + " + " + r.none + " = " + (r.ab + r.bc + r.ac + r.none) }),
    };
    return Q;
  }
  const VP = [[0, 1], [0, 2], [1, 2], [1, 0], [2, 0], [2, 1]];
  const VQ = {};
  const intF = (x) => N(x);
  const vpick = (rng, a) => rng.pick(a);
  function mkV(V, rng, d, r) {
    const ask = "Out of " + vN(V.r) + " " + V.who + " surveyed, ";
    const o = QB.options(rng, r.pairs || []);
    void o;
    return { ask };
  }
  void mkV;
  function vfinish(V, rng, d, r) {
    let pairs, calc;
    if (r.pairs) { pairs = r.pairs; calc = r.calc; }
    else {
      const f = r.f || intF; let A, ansV;
      if (r.shown != null) { A = f(r.shown); ansV = r.shown; calc = String(r.ans); } else { if (!C(r.ans)) return null; ansV = R(r.ans); A = f(ansV); calc = String(ansV); }
      const seen = new Set([A.toLowerCase()]), kept = [ansV]; pairs = [[A, null]];
      for (const w of r.wrongs) {
        if (pairs.length === 4) break;
        const v = w[0]; if (!isFinite(v) || (!r.signed && v <= 0)) continue;
        const vv = r.shown != null ? Math.round(v) : R(v);
        if (Math.abs(vv - ansV) < 0.11 || (r.gap && kept.some((k) => Math.abs(k - vv) < r.gap(k)))) continue;
        const t = f(vv); if (seen.has(t.toLowerCase())) continue;
        seen.add(t.toLowerCase()); kept.push(vv); pairs.push([t, w[1]]);
      }
      if (pairs.length < 4) return null;
    }
    const o = QB.options(rng, pairs);
    const VL = rng.pick(VLEAD), VS = rng.pick(VSURV)(vN(V.r), V.who);
    const set = register("venn", { title: "Venn diagram: " + V.who + " and " + V.names.join(", "), kind: "html", html: vennSVG(V) });
    return { q: cap(VL + (/\. $|^$/.test(VL) ? cap(VS) : VS) + r.body), opts: o.opts, ans: o.ans, why: o.why, time: TIME[d], sol: r.sol, short: r.short, trap: r.trap, calc, set };
  }
  const VLEAD = ["Study the Venn diagram. ", "Look at the Venn diagram. ", "Refer to the Venn diagram. ", "In the Venn diagram shown, ", "From the diagram given, ", "Using the Venn diagram, ", "Observe the diagram carefully. ", ""];
  const VSURV = [(n, w) => "out of " + n + " " + w + " surveyed, ", (n, w) => "among " + n + " " + w + " who were surveyed, ", (n, w) => "in a survey of " + n + " " + w + ", "];
  const nameP = (V, i) => V.who + " who " + V.verb + " " + V.names[i];
  const cleanRt = (a, b) => { if (!I(a) || !I(b) || a <= 0 || b <= 0) return null; const p = rt(a, b); return p[0] > 40 || p[1] > 40 || (p[0] === 1 && p[1] === 1) ? null : p; };

  VQ["direct-read"] = (V, rng, d) => {
    const Q = vq(V), [i, j] = vpick(rng, VP);
    const list = d === "Easy" ? [Q.only(i), Q.two(i, j), Q.all(), Q.none()] : d === "Medium" ? [Q.both(i, j), Q.but(i, j), Q.tot(i), Q.either(i, j)] : [Q.exTwo(), Q.exOne(), Q.atTwo(), Q.atOne()];
    const x = vpick(rng, list), r = V.r, T = vt(r);
    const wr = [[x.v + r.abc, "Added the centre region once too often"], [Math.abs(x.v - r.abc) || x.v + 5, "Left out (or double counted) the all-three region"], [x.v + r.none, "Included those outside every circle"], [x.v + 10, "Slipped in the addition"], [T.A, "Gave the total of the first circle"], [x.v - 5, "Missed a region"]];
    return { body: "how many are the " + x.t + "?", ans: x.v, wrongs: wr, sol: ["To find the number of " + x.t + ": " + x.s, "Answer = **" + x.v + "**"], short: "Say in words which regions are wanted, then add exactly those.", trap: "Counting the all-three region twice, or not at all." };
  };
  VQ["pct-change-growth"] = (V, rng, d) => {
    const Q = vq(V), [i, j] = vpick(rng, VP);
    const pairsL = d === "Easy" ? [[Q.tot(i), Q.tot(j)]] : d === "Medium" ? [[Q.exOne(), Q.exTwo()], [Q.both(i, j), Q.all()], [Q.atTwo(), Q.all()]] : [[Q.either(i, j), Q.tot(i)], [Q.atOne(), Q.exOne()], [Q.but(i, j), Q.but(j, i)]];
    const [x, y] = vpick(rng, pairsL); if (x.v === y.v) return null;
    const hi = x.v > y.v ? x : y, lo = x.v > y.v ? y : x, more = rng.chance(0.5), ch = more ? (hi.v - lo.v) / lo.v * 100 : (hi.v - lo.v) / hi.v * 100;
    return { body: more ? "the number of the " + hi.t + " is what percent more than the number of the " + lo.t + "?" : "the number of the " + lo.t + " is what percent less than the number of the " + hi.t + "?", ans: ch, f: P,
      wrongs: [[more ? (hi.v - lo.v) / hi.v * 100 : (hi.v - lo.v) / lo.v * 100, "Used the wrong base"], [hi.v - lo.v, "Gave the plain difference as the percentage"], [hi.v / lo.v * 100, "Gave one number as a percentage of the other"], [lo.v / hi.v * 100, "Gave the smaller as a percentage of the larger"]],
      sol: [hi.t + ": " + hi.v + "; " + lo.t + ": " + lo.v, "Difference = " + (hi.v - lo.v) + "; base = " + (more ? lo.v : hi.v), (hi.v - lo.v) + " ÷ " + (more ? lo.v : hi.v) + " × 100 = **" + P(ch) + "**"], short: "“More than B”: divide by B. “Less than A”: divide by A.", trap: "Choosing the wrong base." };
  };
  VQ["ratio-of-two-values"] = (V, rng, d) => {
    const Q = vq(V), [i, j] = vpick(rng, VP), r = V.r;
    const L = d === "Easy" ? [[Q.only(i), Q.only(j)], [Q.tot(i), Q.tot(j)], [Q.only(i), Q.two(i, j)]] : d === "Medium" ? [[Q.both(i, j), Q.all()], [Q.exTwo(), Q.exOne()], [Q.but(i, j), Q.but(j, i)]] : [[Q.atOne(), Q.none()], [Q.either(i, j), Q.tot(j)], [Q.notAll(), Q.all()]];
    const [x, y] = vpick(rng, L), p = cleanRt(x.v, y.v); if (!p) return null;
    const alts = [[x.v + r.abc, y.v], [x.v, y.v + r.abc], [x.v, x.v + y.v]].map((q) => cleanRt(q[0], q[1])).filter(Boolean);
    const pairs = [[rtx(p), null], [rtx([p[1], p[0]]), "Wrote the ratio the wrong way round"]];
    const whys = ["Counted the all-three region in only one of the two numbers", "Counted the all-three region in only one of the two numbers", "Compared the first number with the sum of the two"];
    alts.forEach((q, k) => pairs.push([rtx(q), whys[k]]));
    const seenR = new Set(), pd = pairs.filter((q) => (seenR.has(q[0]) ? false : (seenR.add(q[0]), true)));
    if (pd.length < 4) return null;
    return { body: "what is the ratio of the number of the " + x.t + " to the number of the " + y.t + "?", pairs: pd.slice(0, 4), calc: p[0] + "/" + p[1], sol: [x.t + ": " + x.v + " (" + x.s + ")", y.t + ": " + y.v + " (" + y.s + ")", "Ratio = " + x.v + " : " + y.v + " = **" + rtx(p) + "**"], short: "Find both counts, then cancel the common factor.", trap: "Writing the ratio upside down." };
  };
  VQ["share-of-total"] = (V, rng, d) => {
    const Q = vq(V), [i, j] = vpick(rng, VP), r = V.r, N0 = vN(r);
    let x, base, bt;
    if (d === "Easy") { x = vpick(rng, [Q.atOne(), Q.tot(i), Q.exOne(), Q.none()]); base = N0; bt = "all " + N0 + " " + V.who + " surveyed"; }
    else if (d === "Medium") { x = vpick(rng, [Q.both(i, j), Q.all(), Q.atTwo()]); base = N0; bt = "all " + N0 + " " + V.who + " surveyed"; }
    else { const k = rng.int(0, 2); if (k === 0) { x = Q.both(i, j); base = vt(r)[["A", "B", "Cc"][i]]; bt = "the " + Q.tot(i).t; } else if (k === 1) { x = Q.all(); base = vq(V).atOne().v; bt = "the " + Q.atOne().t; } else { x = Q.exTwo(); base = Q.atOne().v; bt = "the " + Q.atOne().t; } }
    const s = x.v / base * 100; if (!C(s) || x.v === base) return null;
    return { body: (base === N0 ? "what percent are the " + x.t : "what percent of " + bt + " are the " + x.t) + "?", ans: s, f: P, wrongs: [[x.v / N0 * 100, "Divided by everyone surveyed, not by the group named"], [x.v / (base - x.v) * 100, "Compared with the rest instead of the whole group"], [100 - s, "Gave the percentage of the rest"], [(x.v + r.abc) / base * 100, "Counted the all-three region once too often"]],
      sol: ["Part: " + x.t + " = " + x.v + " (" + x.s + ")", "Whole: " + bt + " = " + base, x.v + " ÷ " + base + " × 100 = **" + P(s) + "**"], short: "Part ÷ whole × 100; be sure what the whole is.", trap: "Dividing by the wrong whole (everybody surveyed vs the named group)." };
  };
  VQ["average"] = (V, rng, d) => {
    const Q = vq(V), r = V.r, T = vt(r), idx = [0, 1, 2];
    let xs, w;
    if (d === "Easy") { xs = [T.A, T.B, T.Cc]; w = "the number of " + V.who + " per subject (the average of the three circle totals)"; }
    else if (d === "Medium") { xs = [r.a, r.b, r.c]; w = "the number of " + V.who + " per subject who " + V.verb + " only that one (average of the three “only” regions)"; }
    else { xs = [r.ab + r.abc, r.bc + r.abc, r.ac + r.abc]; w = "the number of " + V.who + " who " + V.verb + " both of a given pair (average over the three pairs, counting those who do all three)"; }
    void idx;
    const s = sum(xs), a = s / 3; if (!C(a) || !C1(a)) return null;
    return { body: "what is the average of " + w + "?", ans: a, wrongs: [[s, "Gave the total without dividing"], [s / 2, "Divided by 2 instead of 3"], [s / 4, "Divided by 4 instead of 3"], [(xs[0] + xs[2]) / 2, "Averaged only two of the three"]],
      sol: ["Values: " + xs.join(", "), "Sum = " + s + "; ÷ 3 = **" + N(R(a)) + "**"], short: "Add the three numbers, divide by 3.", trap: "Dividing by the wrong count." };
  };
  VQ["max-min-rank"] = (V, rng, d) => {
    const r = V.r, T = vt(r), srt = (xs) => xs.slice().sort((a, b) => b - a);
    let xs, body, why;
    if (d === "Easy") { xs = [r.a, r.b, r.c]; body = "what is the largest number of " + V.who + " who " + V.verb + " only ONE of the three subjects?"; }
    else if (d === "Medium") { xs = [T.A, T.B, T.Cc]; body = "what is the difference between the largest and the smallest number of " + V.who + " among the three circles?"; }
    else { xs = [r.a, r.b, r.c, r.ab, r.bc, r.ac, r.abc]; body = "what is the difference between the largest and the smallest of the seven numbers written inside the circles?"; }
    const s = srt(xs); if (new Set(xs).size < xs.length) return null; void why;
    if (d === "Easy") return { body, ans: s[0], wrongs: [[s[1], "Picked the second largest"], [s[2], "Picked the smallest"], [s[0] + r.ab + r.ac, "Included the overlaps"], [Math.max(T.A, T.B, T.Cc), "Gave a circle total, not an “only” region"]], sol: ["The “only” regions are " + xs.join(", "), "Largest = **" + s[0] + "**"], short: "Look only at the regions that belong to a single circle.", trap: "Using circle totals instead of the single-circle regions." };
    const df = s[0] - s[s.length - 1];
    return { body, ans: df, wrongs: [[s[0], "Gave the largest value only"], [s[0] + s[s.length - 1], "Added the largest and the smallest"], [s[1] - s[s.length - 1], "Started from the second largest"], [s[0] - s[s.length - 2], "Used the second smallest"]],
      sol: ["Values: " + xs.join(", "), "Largest = " + s[0] + ", smallest = " + s[s.length - 1], "Difference = **" + df + "**"], short: "Find both ends, subtract.", trap: "Adding instead of subtracting." };
  };
  VQ["years-above-average"] = (V, rng, d) => {
    const r = V.r, T = vt(r);
    let xs, n, body, av;
    if (d === "Easy") { xs = [T.A, T.B, T.Cc]; body = "for how many of the three subjects is the number of " + V.who + " above the average of the three subject totals?"; n = 3; av = sum(xs) / 3; }
    else if (d === "Medium") { xs = [r.a, r.b, r.c, r.ab, r.bc, r.ac, r.abc]; body = "how many of the seven numbers written inside the circles are above the average of those seven numbers?"; n = 7; av = sum(xs) / 7; }
    else { xs = [r.ab + r.abc, r.bc + r.abc, r.ac + r.abc]; av = (r.a + r.b + r.c) / 3; n = 3; body = "how many of the three “both” counts (each pair, including those who do all three) exceed the average of the three “only” regions?"; }
    if (xs.some((x) => x === av)) return null;
    const cnt = xs.filter((x) => x > av).length;
    const wr = [[n - cnt, "Counted those below the average instead"], [cnt + 1, "Counted one too many"], [cnt - 1, "Missed one"], [cnt + 2, "Counted two too many"], [0, "Assumed none is above"]].filter((w) => w[0] >= 0 && w[0] <= n);
    return { body, ans: cnt, wrongs: wr, signed: true, int: true, sol: ["Benchmark average = " + N(R(av)), "Above it: " + xs.filter((x) => x > av).join(", "), "Count = **" + cnt + "**"], short: "Work out the benchmark once, then compare each number.", trap: "Counting numbers equal to, or below, the average." };
  };
  VQ["approximate-value"] = (V, rng, d) => {
    const Q = vq(V), [i, j] = vpick(rng, VP), r = V.r, N0 = vN(r);
    const L = d === "Easy" ? [[Q.exOne(), Q.atOne()], [Q.tot(i), { v: N0, t: "all " + V.who + " surveyed" }]] : d === "Medium" ? [[Q.exTwo(), Q.atOne()], [Q.both(i, j), Q.tot(j)]] : [[Q.notAll(), Q.either(i, j)], [Q.but(i, j), Q.atOne()]];
    const [x, y] = vpick(rng, L), s = x.v / y.v * 100; if (s < 4 || s > 96) return null;
    const fr = s - Math.floor(s); if (Math.abs(fr - 0.5) < 0.12 || fr < 0.03 || fr > 0.97) return null;
    return { body: "approximately what percent of " + (y.t.indexOf("all ") === 0 ? y.t : "the " + y.t) + " are the " + x.t + "?", ans: s, shown: Math.round(s), f: (q) => "≈ " + q + "%", gap: (k) => Math.max(4, k * 0.18),
      wrongs: [[x.v / N0 * 100, "Divided by everyone surveyed"], [x.v / (y.v - x.v) * 100, "Compared with the rest instead of the whole group"], [100 - s, "Gave the percentage of the rest"], [(x.v + r.abc) / y.v * 100, "Counted the all-three region once too often"]],
      sol: ["Part = " + x.v + " (" + x.s + ")", "Whole = " + y.v + (y.s ? " (" + y.s + ")" : ""), x.v + " ÷ " + y.v + " × 100 = " + N(R(s)) + "%", "Nearest whole number: **" + Math.round(s) + "%**"], short: "Round both counts to friendly numbers and simplify the fraction.", trap: "Using everyone surveyed as the whole." };
  };
  VQ["cagr-roughly"] = (V, rng, d) => {
    const g = V.cg; if (!g) return null;
    const [a, b] = FACT[g.r + "," + g.n], X = vt(V.r).A, X0 = X * b / a; if (!I(X0)) return null;
    const ratio = X / X0, tot = (ratio - 1) * 100, nm = V.names[0], ex = rng.pick(["two", "three"]); void ex;
    return { body: "the total inside the " + nm + " circle is the number of " + V.who + " who " + V.verb + " " + nm + ". " + g.n + " years ago it was " + X0 + ". If it grew at a constant compound rate every year, what was the yearly growth rate?", ans: g.r, f: P,
      wrongs: [[tot, "Gave the total growth over the whole period"], [tot / g.n, "Divided the total growth by " + g.n + " (simple average)"], [(Math.pow(ratio, 1 / (g.n + 1)) - 1) * 100, "Counted " + (g.n + 1) + " periods instead of " + g.n], [g.r + 10, "Guessed a rate close to the right one"]],
      sol: ["Total now (all four regions inside the " + nm + " circle) = " + X, "Ratio = " + X + " ÷ " + X0 + " = " + String(QB.round(ratio, 3)) + " over " + g.n + " years", "(1 + g)^" + g.n + " = " + String(QB.round(ratio, 3)) + " → g = **" + P(g.r) + "**"], short: "Match the ratio with a known power: 1.2² = 1.44, 1.25² = 1.5625, 1.2³ = 1.728.", trap: "Dividing the total growth by the number of years." };
  };
  VQ["combined"] = (V, rng, d) => {
    const Q = vq(V), [i, j] = vpick(rng, VP);
    const list = d === "Easy" ? [Q.either(i, j), Q.notAll()] : d === "Medium" ? [Q.orNot(i, j), Q.but(i, j)] : [Q.twoOrNone(), Q.notAll(), Q.orNot(i, j)];
    const x = vpick(rng, list), r = V.r, T = vt(r);
    return { body: "how many are the " + x.t + "?", ans: x.v, wrongs: [[T.A + T.B + T.Cc, "Added the three circle totals (overlaps counted repeatedly)"], [x.v + r.abc, "Counted the all-three region once too often"], [x.v - r.abc > 0 ? x.v - r.abc : x.v + 10, "Left out the all-three region"], [x.v + r.none, "Included those outside every circle"], [Math.abs(x.v - 5), "Slipped in the addition"]],
      sol: ["To find the number of " + x.t + ": " + x.s, "Answer = **" + x.v + "**"], short: "Shade (mentally) exactly the regions wanted; add them once.", trap: "Adding circle totals counts overlaps twice." };
  };
  PATS.forEach(([pat, title]) => {
    QB.gen("di/di-venn/" + pat, { title, gen(rng, d) {
      for (let i = 0; i < 400; i++) {
        const cg = pat === "cagr-roughly" ? (() => { const rn = rng.pick(CG[d].filter((x) => x[0] !== 10 && x[0] !== 40 && x[0] !== 60)); return { r: rn[0], n: rn[1] }; })() : null;
        const V = vennData(rng, d, cg); if (!V) continue;
        const r = VQ[pat](V, rng, d); if (!r) continue;
        const q = vfinish(V, rng, d, r); if (q) return q;
      }
      throw new Error("di-venn/" + pat + ": no clean question found");
    } });
  });
})();
