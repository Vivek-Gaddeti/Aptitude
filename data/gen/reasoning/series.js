/* =====================================================================
   Series: letter series, alphanumeric series, letter clusters, repeating
   patterns. Letter answers are plain text; each generated question carries a
   `check` expression that recomputes the answer and proves it is unique.
   ===================================================================== */
(function () {
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const pos = (c) => A.indexOf(c) + 1;
  const ch = (n) => A[(((n - 1) % 26) + 26) % 26];
  const chkW = (expr) => `q.opts[q.ans]===(${expr})&&q.opts.filter(o=>o===q.opts[q.ans]).length===1`;
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 90 };
  const sg = (x) => (x < 0 ? "−" + -x : "+" + x);
  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("series: no clean question found");
    };
  }
  // ans = correct word, wrongs = [[word, why], ...]
  // chk = JS expression (as a string) that recomputes the answer text independently of the generator's variables
  function mkL(rng, a, wrongs, extra, chk) {
    const words = new Set([a]);
    const pairs = [[a, null]];
    for (const [w, why] of wrongs) {
      if (pairs.length === 4) break;
      if (!w || words.has(w)) continue;
      words.add(w); pairs.push([w, why]);
    }
    if (pairs.length < 4) return null;
    return Object.assign({ time: TIME[extra.d] }, extra, QB.options(rng, pairs), { check: chkW(chk) });
  }
  const finish = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });
  const inRange = (arr) => arr.every((x) => x >= 1 && x <= 26);

  /* ------------------------------------------------------------ 1. letter series */
  QB.gen("reasoning/series/letter-series", { title: "Letter series", gen: wrap((rng, d) => {
    let p = [], rule, hide, steps, pex = null;
    const sign = () => (rng.chance(0.3) ? -1 : 1);
    if (d === "Easy") {
      const s = rng.int(1, 4) * sign(), n = rng.int(6, 7), st = rng.int(1, 26);
      for (let i = 0; i < n; i++) p.push(st + s * i);
      rule = `every letter is ${Math.abs(s)} place${Math.abs(s) > 1 ? "s" : ""} ${s > 0 ? "after" : "before"} the previous one (${sg(s)} each time)`;
      hide = rng.chance(0.6) ? n - 1 : rng.int(2, n - 2);
      pex = `${st}+${s}*${hide}`;
    } else if (d === "Medium") {
      const n = rng.int(7, 8), st = rng.int(1, 26);
      if (rng.chance(0.5)) {
        const a = rng.int(1, 5) * sign(), b = rng.int(1, 5) * sign();
        if (a === b) return null;
        p.push(st); for (let i = 1; i < n; i++) p.push(p[i - 1] + (i % 2 ? a : b));
        rule = `the gaps alternate ${sg(a)}, ${sg(b)}, ${sg(a)}, ${sg(b)}, …`;
        hide = rng.chance(0.6) ? n - 1 : rng.int(3, n - 2);
        pex = `${st}+Math.ceil(${hide}/2)*${a}+Math.floor(${hide}/2)*${b}`;
      } else {
        const a = rng.int(1, 4) * sign(), b = rng.int(1, 4) * sign(), s2 = rng.int(1, 26);
        for (let i = 0; i < n; i++) p.push(i % 2 === 0 ? st + a * (i / 2) : s2 + b * ((i - 1) / 2));
        rule = `two series are woven together: the 1st, 3rd, 5th… letters move ${sg(a)} each time and the 2nd, 4th, 6th… letters move ${sg(b)}`;
        hide = n - 1;
        pex = `${hide % 2 === 0 ? st + "+" + a + "*" + (hide / 2) : s2 + "+" + b + "*" + ((hide - 1) / 2)}`;
      }
    } else {
      const k = rng.int(0, 2), n = k === 2 ? 9 : rng.int(7, 8), st = rng.int(1, 26);
      if (k === 0) {
        const s0 = rng.int(1, 2), inc = rng.int(1, 2) * sign();
        p.push(st); for (let i = 1; i < n; i++) p.push(p[i - 1] + (s0 + inc * (i - 1)));
        rule = `the gaps keep changing: ${sg(s0)}, ${sg(s0 + inc)}, ${sg(s0 + 2 * inc)}, … (each gap is ${inc > 0 ? "bigger" : "smaller"} by ${Math.abs(inc)})`;
        hide = n - 1;
        pex = `${st}+${s0}*${hide}+${inc}*${hide}*(${hide}-1)/2`;
      } else if (k === 1) {
        const a = rng.int(2, 5), b = rng.int(1, 4), s2 = rng.int(1, 26);
        for (let i = 0; i < n; i++) p.push(i % 2 === 0 ? st + a * (i / 2) : s2 - b * ((i - 1) / 2));
        rule = `two series are woven together: the 1st, 3rd, 5th… letters move ${sg(a)} each time, while the 2nd, 4th, 6th… move ${sg(-b)}`;
        hide = n - 1;
        pex = `${hide % 2 === 0 ? st + "+" + a + "*" + (hide / 2) : s2 + "-" + b + "*" + ((hide - 1) / 2)}`;
      } else {
        const g = [rng.int(1, 4), rng.int(1, 4) * sign(), rng.int(1, 4)];
        if (g[0] === g[1] || g[1] === g[2]) return null;
        p.push(st); for (let i = 1; i < n; i++) p.push(p[i - 1] + g[(i - 1) % 3]);
        rule = `the gaps repeat in a cycle of three: ${sg(g[0])}, ${sg(g[1])}, ${sg(g[2])}`;
        hide = n - 1;
        pex = `${st}+Array.from({length:${hide}},(_,i)=>[${g.join(",")}][i%3]).reduce((a,b)=>a+b,0)`;
      }
    }
    if (!inRange(p)) return null;
    const terms = p.map((x, i) => (i === hide ? "?" : ch(x))).join(", ");
    const ans = ch(p[hide]);
    const prevStep = hide >= 2 ? p[hide - 1] - p[hide - 2] : 1;
    const q = T(rng, [
      `Find the missing letter in the series: **${terms}**`,
      `Which letter should replace the question mark? **${terms}**`,
      `Complete the series by choosing the correct letter: **${terms}**`,
      `What comes in place of **?** in this letter series: **${terms}**`,
    ]);
    return mkL(rng, ans, [
      [ch(p[hide - 1] + prevStep), "Repeated the previous gap instead of the gap the pattern needs here"],
      [ch(p[hide] + 1), "One letter too far"],
      [ch(p[hide] - 1), "One letter too short"],
      [ch(p[hide] + 2), "Two letters too far"],
      [ch(p[hide] - 2), "Two letters too short"],
    ], finish(d, q,
      [`Positions: ${p.map((x) => `${ch(x)}=${x}`).join(", ")}`, `Rule: ${rule}`, `The missing letter is **${ans}** (position ${p[hide]}).`],
      "Write the alphabet positions under each letter and look at the gaps; the rule appears at once.",
      "Do not judge the series by the first gap alone: check that the same gap works for every pair."), `String.fromCharCode(64+(${pex || p[hide]}))`);
  }) });

  /* ------------------------------------------------------------ 2. alphanumeric series */
  QB.gen("reasoning/series/alphanumeric-series", { title: "Alphanumeric series", gen: wrap((rng, d) => {
    const sign = () => (rng.chance(0.3) ? -1 : 1);
    const n = d === "Hard" ? 6 : 5;               // shown terms; the answer is term n+1
    const L = [], N = [];
    let lrule, nrule;
    const st = rng.int(2, 22);
    if (d === "Easy") {
      const s = rng.int(1, 3) * sign(), a = rng.int(1, 9), t = rng.int(2, 6);
      for (let i = 0; i <= n; i++) { L.push(st + s * i); N.push(a + t * i); }
      lrule = `letters move ${sg(s)} each time`; nrule = `numbers go up by ${t} each time`;
    } else if (d === "Medium") {
      const s = rng.int(1, 3) * sign(), k = rng.int(0, 2);
      for (let i = 0; i <= n; i++) L.push(st + s * i);
      lrule = `letters move ${sg(s)} each time`;
      if (k === 0) { const a = rng.int(1, 3); for (let i = 0; i <= n; i++) N.push(a * Math.pow(2, i)); nrule = "each number is double the previous one"; }
      else if (k === 1) { const m = rng.int(1, 4); for (let i = 0; i <= n; i++) N.push((m + i) * (m + i)); nrule = "the numbers are consecutive perfect squares"; }
      else { const m = rng.int(1, 3); for (let i = 0; i <= n; i++) N.push((m + i) * (m + i + 1)); nrule = "the numbers are n × (n + 1) for n = " + m + ", " + (m + 1) + ", …"; }
    } else {
      const k = rng.int(0, 2), l = rng.int(0, 1);
      if (l === 0) { for (let i = 0; i <= n; i++) L.push(st + (i * (i + 1)) / 2); lrule = "the letter gaps grow: +1, +2, +3, +4, …"; }
      else { const a = rng.int(1, 3), b = rng.int(1, 3); if (a === b) return null; for (let i = 0; i <= n; i++) L.push(i === 0 ? st : L[i - 1] + (i % 2 ? a : -b)); lrule = `letter gaps alternate ${sg(a)}, ${sg(-b)}`; }
      if (k === 0) { const a = rng.int(1, 4); N.push(a); for (let i = 1; i <= n; i++) N.push(2 * N[i - 1] + 1); nrule = "each number is double the previous one plus 1"; }
      else if (k === 1) { const m = rng.int(1, 3); for (let i = 0; i <= n; i++) N.push(Math.pow(m + i, 3)); nrule = "the numbers are consecutive cubes"; }
      else { const a = rng.int(1, 5); for (let i = 0; i <= n; i++) N.push(a + i * (i + 1)); nrule = "the number gaps grow: +2, +4, +6, +8, …"; }
    }
    if (!inRange(L) || N.some((x) => x > 400)) return null;
    const term = (i) => ch(L[i]) + N[i];
    const shown = []; for (let i = 0; i < n; i++) shown.push(term(i));
    const ans = term(n);
    const lin = N[n - 1] + (N[n - 1] - N[n - 2]);
    const cands = [
      [ch(L[n]), lin, "The letter is right, but the number just repeats the last gap"],
      [ch(L[n] + 1), N[n] + 1, "Both letter and number are one step off"],
      [ch(L[n]), N[n] + 2, "The letter is right but the number is wrong"],
      [ch(L[n] - 1), N[n] - 1, "Both letter and number are one step off the other way"],
      [ch(L[n - 1] + (L[n - 1] - L[n - 2])), N[n] + 3, "Used the previous letter gap instead of the real letter rule"],
      [ch(L[n] + 2), N[n] - 3, "Both parts are off"],
    ];
    const seen = new Set([N[n]]), pairs = [[ans, null]];
    for (const [l, v, why] of cands) {
      if (pairs.length === 4) break;
      if (v < 1 || seen.has(v)) continue;
      seen.add(v); pairs.push([l + v, why]);
    }
    if (pairs.length < 4) return null;
    const q = T(rng, [
      `Find the next term of the series: **${shown.join(", ")}, ?**`,
      `What comes next in this alphanumeric series? **${shown.join(", ")}, ?**`,
      `Choose the term that continues the series: **${shown.join(", ")}, ?**`,
    ]);
    return Object.assign({ time: TIME[d] }, finish(d, q,
      [`Letters: ${L.slice(0, n + 1).map((x) => `${ch(x)}=${x}`).join(", ")}: ${lrule}.`, `Numbers: ${N.slice(0, n + 1).join(", ")}: ${nrule}.`, `Next term = **${ans}**.`],
      "Split every term into its letter and its number and follow each as a separate series.",
      "The letter rule and the number rule are independent: do not assume the number changes by the same amount as the letter."),
    QB.options(rng, pairs), { calc: String(N[n]) });
  }) });

  /* ------------------------------------------------------------ 3. letter clusters */
  QB.gen("reasoning/series/letter-clusters", { title: "Letter clusters", gen: wrap((rng, d) => {
    const sign = () => (rng.chance(0.3) ? -1 : 1);
    const m = d === "Hard" ? 4 : d === "Easy" ? rng.int(3, 4) : 3, shown = d === "Easy" ? rng.int(4, 5) : 5;
    const step = [], base = [];
    if (d === "Easy") {
      const s = rng.int(1, 4) * sign(), gap = rng.int(1, 3), b = rng.int(2, 14);
      let cur = b; for (let j = 0; j < m; j++) { step.push(s); base.push(cur); cur += rng.int(1, 4) * (gap > 0 ? 1 : 1); }
    } else if (d === "Medium") {
      for (let j = 0; j < m; j++) { step.push(rng.int(1, 3) * sign()); base.push(rng.int(5, 15)); }
    } else {
      for (let j = 0; j < m; j++) { step.push(rng.int(0, 3) * sign()); base.push(rng.int(8, 16)); }
    }
    if (new Set(step).size < (d === "Easy" ? 1 : 2) || step.every((x) => x === 0)) return null;
    const cl = (i) => base.map((b, j) => b + step[j] * i);
    const all = []; for (let i = 0; i <= shown; i++) all.push(cl(i));
    if (!all.every(inRange)) return null;
    const w = (v) => v.map(ch).join("");
    const ans = w(all[shown]);
    const wrongs = [];
    wrongs.push([w(cl(shown).map((_, j) => base[j] + step[0] * shown)), "Applied the first letter's step to every position"]);
    for (let j = 0; j < m; j++) { const v = cl(shown); v[j] += 1; wrongs.push([w(v), `Position ${j + 1} is one letter too far`]); const u = cl(shown); u[j] -= 1; wrongs.push([w(u), `Position ${j + 1} is one letter too short`]); }
    const stepTxt = step.map((s, j) => `letter ${j + 1}: ${sg(s)}`).join(", ");
    const q = T(rng, [
      `Find the next cluster: **${all.slice(0, shown).map(w).join(", ")}, ?**`,
      `What comes next in this series of letter groups? **${all.slice(0, shown).map(w).join(", ")}, ?**`,
      `Choose the cluster that continues the series: **${all.slice(0, shown).map(w).join(", ")}, ?**`,
    ]);
    return mkL(rng, ans, wrongs, finish(d, q,
      [`Look at each position separately. From one cluster to the next: ${stepTxt}.`, `Cluster ${shown + 1} = **${ans}**.`],
      "Track the 1st, 2nd and 3rd letters as three small series; each has its own step.",
      "Clusters often look random until you stop reading them as words and track one position at a time."),
      `${JSON.stringify(base)}.map((b,j)=>String.fromCharCode(64+b+${JSON.stringify(step)}[j]*${shown})).join("")`);
  }) });

  /* ------------------------------------------------------------ 4. repeating patterns */
  QB.gen("reasoning/series/repeating-patterns", { title: "Repeating patterns (aab_ab…)", gen: wrap((rng, d) => {
    const cfg = { Easy: [3, 4, 1], Medium: [4, 4, 2], Hard: [5, 4, 3] }[d];
    const [Lg, reps, nb] = cfg;
    const pool = d === "Easy" ? ["A", "B"] : ["A", "B", "C"];
    const names = rng.shuffle("ABCDEFGH".split("")).slice(0, pool.length);
    const unit = []; for (let i = 0; i < Lg; i++) unit.push(T(rng, names));
    if (new Set(unit).size < pool.length) return null;
    // the block must not itself repeat inside (so the period really is Lg)
    for (let per = 1; per < Lg; per++) if (Lg % per === 0 && unit.every((c, i) => c === unit[i % per])) return null;
    const N = Lg * reps, full = []; for (let i = 0; i < N; i++) full.push(unit[i % Lg]);
    // choose blank positions, keeping at least 2 visible letters in every residue class
    const idx = rng.shuffle([...Array(N).keys()]).slice(0, nb).sort((a, b) => a - b);
    for (let r = 0; r < Lg; r++) { let vis = 0; for (let i = r; i < N; i += Lg) if (!idx.includes(i)) vis++; if (vis < 2) return null; }
    if (idx[0] < 2 || idx.some((x, k) => k && x - idx[k - 1] < 2)) return null;
    const shown = full.map((c, i) => (idx.includes(i) ? "_" : c)).join(" ");
    const fill = idx.map((i) => full[i]);
    const ans = fill.join("");
    const wrongs = [];
    if (nb > 1) { wrongs.push([fill.slice().reverse().join(""), "Right letters, wrong order"]); const sw = fill.slice(); [sw[0], sw[1]] = [sw[1], sw[0]]; wrongs.push([sw.join(""), "First two blanks swapped"]); }
    const other = (c) => names.find((x) => x !== c) || "D";
    for (let k = 0; k < nb; k++) { const w = fill.slice(); w[k] = other(fill[k]); wrongs.push([w.join(""), `Blank ${k + 1} filled with the wrong letter`]); const w2 = fill.slice(); w2[k] = names.filter((x) => x !== fill[k])[1] || "D"; wrongs.push([w2.join(""), `Blank ${k + 1} filled with another wrong letter`]); }
    if (nb === 1) wrongs.push(["D", "A letter that is not even in the pattern"]);
    for (let k = 0; k < nb; k++) { const w = fill.slice(); w[k] = "E"; wrongs.push([w.join(""), "A letter that is not in the pattern"]); }
    const q = T(rng, [
      `Which ${nb > 1 ? "letters fill the blanks, in order, to complete" : "letter fills the blank to complete"} the pattern?  **${shown}**`,
      `The letters below follow a repeating pattern. Find the missing ${nb > 1 ? "letters in order" : "letter"}:  **${shown}**`,
      `Fill ${nb > 1 ? "the gaps" : "the gap"} so that the pattern repeats correctly:  **${shown}**`,
    ]);
    return mkL(rng, ans, wrongs, finish(d, q,
      [`The block **${unit.join("")}** repeats (${Lg} letters at a time).`, `Writing it out in full: ${full.join(" ")}`, `Blank${nb > 1 ? "s" : ""} in order: **${ans}**.`],
      `Find the block that repeats (here ${Lg} letters) and read the blank${nb > 1 ? "s" : ""} off from the same place in another repeat.`,
      "Count the position inside the block, not the position from the start of the whole row."),
      `${JSON.stringify(idx)}.map(i=>${JSON.stringify(unit.join(""))}[i%${Lg}]).join("")`);
  }) });
})();
