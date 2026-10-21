/* =====================================================================
   Number series: eight generators (differences, multiplicative, squares/
   cubes ± k, interleaved, mixed, prime-based, wrong number, missing number).
   Each series is built from one explicit hidden rule, shown with enough
   terms for the rule to be the only sensible reading; wrong options come
   from the usual wrong rules (repeat the gap, skip a term, forget the +b ...).
   ===================================================================== */
(function () {
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 40, Medium: 65, Hard: 95 };
  const ASK = ["Find the next term in the series", "What comes next in the series", "Complete the series", "Which number replaces the question mark in the series", "Find the number that continues the series", "Which number should come next in the series", "Identify the pattern and find the next number", "Work out the next term of the series", "Choose the number that fits the blank in the series", "Find the missing last term of the series", "Decide the next number in the sequence", "Pick the term that follows in the series"];
  const LEAD = ["", "", "", "Aptitude test item. ", "Warm-up round. ", "Placement paper style. ", "Online assessment question. ", "Speed round. ", "Practice set. "];
  const I = Number.isInteger;
  const prm = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113];
  const isPrime = (n) => prm.includes(n) || (n > 113 && (() => { for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; })());

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("number-series: no clean question found");
    };
  }
  // ans = correct integer, wrongs = [[value, why], ...] in priority order
  function mk(rng, d, ans, wrongs, body) {
    if (!I(ans) || ans < 0 || ans > 99999) return null;
    const seen = new Set([ans]);
    const pairs = [[String(ans), null]];
    const fb = [[ans + 1, "A small slip in the last step"], [ans - 1, "A small slip in the last step"], [ans + 2, "Off by a couple in the last step"], [ans - 2, "Off by a couple in the last step"], [ans + 10, "Slipped a ten in the last step"]];
    for (const w of wrongs.concat(fb)) {
      if (pairs.length === 4) break;
      const v = w[0];
      if (!I(v) || v < 0 || v > 99999 || seen.has(v)) continue;
      seen.add(v);
      pairs.push([String(v), w[1]]);
    }
    if (pairs.length < 4) return null;
    const o = QB.options(rng, pairs);
    return Object.assign({ d, time: TIME[d] }, body, o, { calc: String(ans) });
  }
  const nextQ = (rng, terms) => `${T(rng, LEAD)}${T(rng, ASK)}: ${terms.join(", ")}, **?**`;
  const list = (a) => a.join(", ");

  /* ---------------------------------------------------------------- 1. differences */
  QB.gen("quant/number-series/differences", { title: "Differences (1st / 2nd order)", gen: wrap((rng, d) => {
    let D, m, a = rng.int(1, 40), how, gname;
    if (d === "Easy") {
      m = 5;
      if (rng.chance(0.5)) { const g = rng.int(3, 15); D = () => g; how = `the gap is always ${g}`; gname = "constant gap"; }
      else { const f = rng.int(1, 5), e = rng.int(1, 2); D = (i) => f + i * e; how = `the gaps grow by ${e} each time`; gname = "growing gap"; }
    } else if (d === "Medium") {
      m = 6;
      if (rng.chance(0.7)) { const f = rng.int(1, 9), e = rng.int(2, 5); D = (i) => f + i * e; how = `the gaps themselves grow by ${e} each time`; }
      else { const f = rng.int(22, 40), e = rng.int(2, 4); D = (i) => f - i * e; how = `the gaps shrink by ${e} each time`; }
    } else {
      m = 6;
      const k = rng.int(0, 4);
      if (k === 0) { const c = rng.int(1, 4); D = (i) => (c + i) * (c + i); how = "the gaps are consecutive perfect squares"; }
      else if (k === 1) { const c = rng.int(0, 3); D = (i) => prm[c + i]; how = "the gaps are consecutive prime numbers"; }
      else if (k === 2) { const g = rng.int(1, 3), r = T(rng, [2, 3]); D = (i) => g * Math.pow(r, i); how = `the gaps are multiplied by ${r} each time`; }
      else if (k === 3) { const c = rng.int(1, 2); D = (i) => Math.pow(c + i, 3); how = "the gaps are consecutive perfect cubes"; }
      else { const f = rng.int(1, 3), g = rng.int(1, 3); const F = [f, g]; for (let i = 2; i < 8; i++) F.push(F[i - 1] + F[i - 2]); D = (i) => F[i]; how = "each gap is the sum of the two gaps before it"; }
    }
    const t = [a]; for (let i = 0; i < m; i++) t.push(t[i] + D(i));
    const shown = t.slice(0, m), last = shown[m - 1], ans = t[m];
    if (D(m - 1) <= 0) return null;
    const gaps = []; for (let i = 0; i < m - 1; i++) gaps.push(D(i));
    return mk(rng, d, ans, [
      [last + D(m - 2), "Repeated the last gap instead of letting the gap pattern continue"],
      [last + D(m), "Skipped one step of the gap pattern"],
      [last + 2 * D(m - 1) - D(m - 2), "Assumed the gaps change by a constant amount"],
      [last + D(m - 1) + 1, "Used the right gap but slipped by one"],
    ], {
      q: nextQ(rng, shown),
      sol: [`Gaps between terms: ${list(gaps)}. Here ${how}.`, `The next gap is ${D(m - 1)}, so the next term is ${last} + ${D(m - 1)} = **${ans}**.`],
      short: "Write the gaps under the series; if they are not constant, take the gaps of the gaps.",
      trap: `Repeating the last gap (${D(m - 2)}) gives ${last + D(m - 2)}; the gap itself follows a pattern.`,
    });
  }) });

  /* ---------------------------------------------------------------- 2. multiplicative */
  QB.gen("quant/number-series/multiplicative", { title: "Multiplicative series", gen: wrap((rng, d) => {
    let t, how, short, wrongs, m;
    if (d === "Easy") {
      const r = T(rng, [2, 3, 4, 5]), a = rng.int(1, 6); m = 5;
      if (rng.chance(0.7)) {
        t = []; for (let i = 0; i <= m; i++) t.push(a * Math.pow(r, i));
        how = `each term is ${r} times the one before`;
        wrongs = (last) => [[last + t[m - 1] - t[m - 2], "Added the last gap instead of multiplying"], [last * (r - 1), `Multiplied by ${r - 1} instead of ${r}`], [last * (r + 1), `Multiplied by ${r + 1} instead of ${r}`], [last + r, `Added ${r} instead of multiplying`]];
      } else {
        const b = a * Math.pow(r, m); t = []; for (let i = 0; i <= m; i++) t.push(b / Math.pow(r, i));
        how = `each term is the previous one divided by ${r}`;
        wrongs = (last) => [[last - r, `Subtracted ${r} instead of dividing`], [last * r, `Multiplied by ${r}`], [last / r * 2, "Divided by the wrong number"], [last - t[m - 2] + t[m - 1] , "Used the last gap"]];
      }
      short = "Divide a term by the one before it; the same ratio each time means a multiplicative series.";
    } else if (d === "Medium") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const c = rng.int(1, 2), a = rng.int(1, 4); m = 6; t = [a];
        for (let i = 0; i < m; i++) t.push(t[i] * (c + i));
        how = `the multipliers go ${list([0, 1, 2, 3].map((i) => "×" + (c + i)))}, rising by 1 each time`;
        wrongs = (last) => [[last * (c + m - 1), "Used the previous multiplier again"], [last * (c + m + 1), "Skipped a multiplier"], [last * 2, "Assumed a constant ×2"], [last + (t[m - 1] - t[m - 2]), "Added the last gap"]];
        short = "Ratios between neighbouring terms (×1, ×2, ×3 ...) climb by one each step.";
      } else if (k === 1) {
        const x = rng.int(2, 4), y = T(rng, [2, 3, 5]), a = rng.int(1, 4); if (x === y) return null; m = 6; t = [a];
        for (let i = 0; i < m; i++) t.push(t[i] * (i % 2 === 0 ? x : y));
        how = `the multipliers alternate between ×${x} and ×${y}`;
        const nxt = (m - 1) % 2 === 0 ? x : y, oth = nxt === x ? y : x;
        wrongs = (last) => [[last * oth, "Used the wrong one of the two multipliers"], [last * (x + y), "Added the multipliers"], [last * Math.round((x + y) / 2), "Used an average multiplier"], [last + (t[m - 1] - t[m - 2]), "Added the last gap"]];
        short = "If the ratio is not constant, check whether two ratios alternate.";
      } else {
        const r = T(rng, [2, 3, 4, 6]), a = rng.int(1, 3); m = 6; const b = a * Math.pow(r, m); t = [];
        for (let i = 0; i <= m; i++) t.push(b / Math.pow(r, i));
        how = `each term is the previous one divided by ${r}`;
        wrongs = (last) => [[last - r, `Subtracted ${r}`], [last * r, `Multiplied by ${r}`], [last / r * 2, "Divided by the wrong number"], [last - (t[m - 2] - t[m - 1]) , "Subtracted the last gap"]];
        short = "A steady fall by a big factor is a division series: divide neighbouring terms.";
      }
    } else {
      const k = rng.int(0, 2);
      if (k === 0) {
        const num = T(rng, [3, 5]), den = 2; m = 6; let a = rng.int(1, 3) * Math.pow(den, m); t = [a];
        for (let i = 0; i < m; i++) t.push(t[i] / den * num);
        how = `each term is ${num}/${den} of the previous one (multiply by ${num}, halve)`;
        wrongs = (last) => [[last + (t[m - 1] - t[m - 2]), "Added the last gap"], [last * 2, "Doubled the last term"], [last * num, `Multiplied by ${num} but forgot to halve`], [last + t[m - 1] / 2 + 1, "Added half the term wrongly"]];
        short = `Ratio of neighbours is ${num}/${den}: take half the term and multiply by ${num}.`;
      } else if (k === 1) {
        const c = rng.int(2, 3), a = rng.int(1, 3); m = 6; t = [a];
        for (let i = 0; i < m; i++) t.push(t[i] * (c + i));
        how = `the multipliers are ${list([0, 1, 2, 3, 4].map((i) => "×" + (c + i)))}, rising by 1 each time`;
        wrongs = (last) => [[last * (c + m - 1), "Used the previous multiplier again"], [last * (c + m + 1), "Skipped a multiplier"], [last * (c + m - 1) + t[m - 1], "Mixed adding and multiplying"], [last * c, "Restarted the multipliers"]];
        short = "Divide each term by the one before: 3, 4, 5, 6 ... shows the rising multipliers.";
      } else {
        const x = rng.int(2, 3), y = rng.int(4, 6), a = rng.int(1, 3); m = 6; t = [a];
        for (let i = 0; i < m; i++) t.push(t[i] * (i % 2 === 0 ? x : y));
        how = `the multipliers alternate: ×${x}, ×${y}, ×${x}, ×${y} ...`;
        const nxt = (m - 1) % 2 === 0 ? x : y, oth = nxt === x ? y : x;
        wrongs = (last) => [[last * oth, "Used the wrong multiplier in the alternation"], [last * (x * y), "Applied both multipliers at once"], [last * (x + y), "Added the multipliers"], [last + (t[m - 1] - t[m - 2]), "Added the last gap"]];
        short = "Ratios that swap between two values mean an alternating-multiplier series.";
      }
    }
    const shown = t.slice(0, m), last = shown[m - 1], ans = t[m];
    if (t.some((x) => !I(x) || x <= 0)) return null;
    const rat = []; for (let i = 1; i < m; i++) rat.push(t[i] / t[i - 1]);
    return mk(rng, d, ans, wrongs(last), {
      q: nextQ(rng, shown),
      sol: [`Ratios of neighbouring terms: ${list(rat.map((x) => QB.round(x, 2)))}, so ${how}.`, `Next term = **${ans}**.`],
      short,
      trap: "Adding the last gap works for additive series only; test the ratio of neighbours first.",
    });
  }) });

  /* ---------------------------------------------------------------- 3. squares / cubes ± k */
  function specQ(rng, d, sp, s) {
    const m = 5, t = []; for (let i = 0; i <= m; i++) t.push(sp.f(s + i));
    if (t.some((x) => !(x > 0) || !I(x))) return null;
    const shown = t.slice(0, m), last = shown[m - 1], ans = t[m];
    const d1 = last - shown[m - 2], d0 = shown[m - 2] - shown[m - 3];
    const wr = [
      [sp.f(s + m + 1), "Skipped one base number"],
      [last + d1, "Repeated the last gap"],
      [last + d1 + (d1 - d0), "Assumed the gaps grow by a steady amount"],
    ];
    if (sp.alt) wr.unshift([sp.alt(s + m), "Used the wrong sign for the added number"]);
    return mk(rng, d, ans, wr, {
      q: nextQ(rng, shown),
      sol: [`Compare each term with a nearby power: ${sp.show(s)} = ${t[0]}, ${sp.show(s + 1)} = ${t[1]}, ${sp.show(s + 2)} = ${t[2]}. So the n-th term is ${sp.name}.`, `The next term is ${sp.show(s + m)} = **${ans}**.`],
      short: sp.tip, trap: `A constant-gap guess fails here: the gaps are ${list([1, 2, 3, 4].map((i) => shown[i] - shown[i - 1]))} and they keep changing.`,
    });
  }
  QB.gen("quant/number-series/squares-cubes-k", { title: "Squares / cubes ± k", gen: wrap((rng, d) => {
    let sp, s;
    const k = rng.int(1, 9), sg = rng.chance(0.5) ? 1 : -1, op = sg > 0 ? "+" : "−";
    if (d === "Easy") {
      s = rng.int(3, 9); const kk = Math.min(k, 8);
      sp = { f: (n) => n * n + sg * kk, alt: (n) => n * n - sg * kk, show: (n) => `${n}² ${op} ${kk}`, name: `n² ${op} ${kk}`, tip: "Spot the squares (1, 4, 9, 16, 25 ...) near each term; the leftover is the same k every time." };
    } else if (d === "Medium") {
      const c = rng.int(0, 3);
      if (c === 0) { s = rng.int(2, 6); sp = { f: (n) => n * n * n + sg * k, alt: (n) => n * n * n - sg * k, show: (n) => `${n}³ ${op} ${k}`, name: `n³ ${op} ${k}`, tip: "Know the cubes (1, 8, 27, 64, 125, 216); each term sits k away from one." }; }
      else if (c === 1) { s = rng.int(1, 8); sp = { f: (n) => n * n + n, show: (n) => `${n}² + ${n}`, name: "n² + n = n(n + 1)", tip: "Each term is a product of two consecutive numbers: n(n + 1)." }; }
      else if (c === 2) { s = rng.int(2, 8); sp = { f: (n) => n * n - n, show: (n) => `${n}² − ${n}`, name: "n² − n = n(n − 1)", tip: "Each term is a product of two consecutive numbers: (n − 1)n." }; }
      else { s = rng.int(2, 9); sp = { f: (n) => n * n + sg * k, alt: (n) => n * n - sg * k, show: (n) => `${n}² ${op} ${k}`, name: `n² ${op} ${k}`, tip: "Look for squares near each term." }; }
    } else {
      const c = rng.int(0, 5);
      if (c === 0) { s = rng.int(2, 6); sp = { f: (n) => n * n * n - n, show: (n) => `${n}³ − ${n}`, name: "n³ − n", tip: "n³ − n = (n − 1)·n·(n + 1), the product of three consecutive numbers." }; }
      else if (c === 1) { s = rng.int(1, 6); sp = { f: (n) => n * n * n + n, show: (n) => `${n}³ + ${n}`, name: "n³ + n", tip: "Each term is a cube plus its own base." }; }
      else if (c === 2) { s = rng.int(1, 6); sp = { f: (n) => n * n * n + n * n, show: (n) => `${n}³ + ${n}²`, name: "n³ + n² = n²(n + 1)", tip: "n³ + n² = n²(n + 1): a square times the next number." }; }
      else if (c === 3) { s = rng.int(2, 6); sp = { f: (n) => n * n * n - n * n, show: (n) => `${n}³ − ${n}²`, name: "n³ − n² = n²(n − 1)", tip: "n³ − n² = n²(n − 1): a square times one less." }; }
      else if (c === 4) { s = rng.int(2, 8); const a2 = T(rng, [2, 3]); sp = { f: (n) => a2 * n * n + sg * k, alt: (n) => a2 * n * n - sg * k, show: (n) => `${a2}×${n}² ${op} ${k}`, name: `${a2}n² ${op} ${k}`, tip: `Divide out the multiplier: ${a2} times a square, then ${op} ${k}.` }; }
      else { s = rng.int(1, 8); sp = { f: (n) => n * (n + 2), show: (n) => `${n}×${n + 2}`, name: "n(n + 2) = (n + 1)² − 1", tip: "n(n + 2) is one less than the square of (n + 1)." }; }
    }
    return specQ(rng, d, sp, s);
  }) });

  /* ---------------------------------------------------------------- 4. two interleaved series */
  const SER = {
    ap: (rng) => { const a = rng.int(2, 30), p = rng.int(2, 9); return { f: (i) => a + i * p, name: `${p} added each time`, p }; },
    dn: (rng) => { const p = rng.int(2, 7), a = rng.int(40, 70); return { f: (i) => a - i * p, name: `${p} taken off each time`, p: -p }; },
    gp: (rng) => { const r = T(rng, [2, 3]), a = rng.int(1, 5); return { f: (i) => a * Math.pow(r, i), name: `multiplied by ${r} each time`, p: 0 }; },
    sq: (rng) => { const c = rng.int(2, 6); return { f: (i) => (c + i) * (c + i), name: "consecutive perfect squares", p: 0 }; },
    cu: (rng) => { const c = rng.int(1, 3); return { f: (i) => Math.pow(c + i, 3), name: "consecutive perfect cubes", p: 0 }; },
    pr: (rng) => { const c = rng.int(0, 4); return { f: (i) => prm[c + i], name: "consecutive primes", p: 0 }; },
  };
  QB.gen("quant/number-series/two-interleaved-series", { title: "Two interleaved series", gen: wrap((rng, d) => {
    let A, B, total;
    if (d === "Easy") { A = SER.ap(rng); B = rng.chance(0.5) ? SER.ap(rng) : SER.dn(rng); total = 7; if (A.p === B.p) return null; }
    else if (d === "Medium") { const k = rng.int(0, 2); A = k === 2 ? SER.dn(rng) : SER.ap(rng); B = k === 0 ? SER.gp(rng) : (k === 1 ? SER.sq(rng) : SER.gp(rng)); total = rng.chance(0.5) ? 7 : 8; if (rng.chance(0.5)) { const x = A; A = B; B = x; } }
    else { const ks = [["sq", "ap"], ["cu", "dn"], ["gp", "dn"], ["pr", "ap"], ["sq", "cu"], ["gp", "sq"]]; const kk = T(rng, ks); A = SER[kk[0]](rng); B = SER[kk[1]](rng); total = 8; if (rng.chance(0.5)) { const x = A; A = B; B = x; } }
    const val = (i) => (i % 2 === 0 ? A.f(i / 2) : B.f((i - 1) / 2));
    const t = []; for (let i = 0; i <= total; i++) t.push(val(i));
    const shown = t.slice(0, total), ans = t[total], last = shown[total - 1], prev = shown[total - 2];
    if (t.some((x) => !(x > 0) || x > 99999 || !I(x))) return null;
    const mine = total % 2 === 0 ? A : B, other = total % 2 === 0 ? B : A, mi = Math.floor(total / 2), oi = total % 2 === 0 ? mi : mi + 1;
    const oddPlace = [], evenPlace = []; shown.forEach((x, i) => (i % 2 === 0 ? oddPlace : evenPlace).push(x));
    const myLast = t[total - 2], myPrev = t[total - 4];
    return mk(rng, d, ans, [
      [other.f(oi), "Continued the other series instead"],
      [last + (last - prev), "Treated the whole list as one series"],
      [myLast + (myLast - myPrev), "Applied a constant gap to the right series"],
      [myLast + Math.abs(other.p || 0) + (other.p ? 0 : 1), "Used the other series' step"],
    ], {
      q: nextQ(rng, shown),
      sol: [`Two series are mixed. Terms in odd places: ${list(oddPlace)} (${A.name}); terms in even places: ${list(evenPlace)} (${B.name}).`, `The next term is in place ${total + 1}, so it continues the ${total % 2 === 0 ? "odd" : "even"}-place series: **${ans}**.`],
      short: "Split the list into odd-place and even-place terms and read each as its own small series.",
      trap: "The list as a whole looks irregular; do not look for a single rule across all the terms.",
    });
  }) });

  /* ---------------------------------------------------------------- 5. mixed (×a + b) */
  QB.gen("quant/number-series/mixed", { title: "Mixed (×a + b)", gen: wrap((rng, d) => {
    let t, how, wrongs, m, step;
    if (d === "Easy") {
      const a = 2, b = rng.int(1, 4), t0 = rng.int(1, 6); m = 5; t = [t0];
      for (let i = 0; i < m; i++) t.push(a * t[i] + b);
      how = `each term is ${a} × the previous + ${b}`; step = (x) => a * x + b;
      wrongs = (last) => [[a * last, `Forgot to add ${b}`], [a * last - b, `Subtracted ${b} instead of adding`], [last + (t[m - 1] - t[m - 2]), "Added the last gap"], [a * last + b + 1, "Slipped by one"]];
    } else if (d === "Medium") {
      const a = T(rng, [2, 3, 4]), b = rng.int(1, 6) * (rng.chance(0.5) ? 1 : -1), t0 = rng.int(2, 9); m = rng.int(5, 6); t = [t0];
      for (let i = 0; i < m; i++) t.push(a * t[i] + b);
      how = `each term is ${a} × the previous ${b > 0 ? "+" : "−"} ${Math.abs(b)}`; step = (x) => a * x + b;
      wrongs = (last) => [[a * last, `Forgot the ${b > 0 ? "+" : "−"} ${Math.abs(b)}`], [a * last - b, "Used the wrong sign for the added number"], [last + (t[m - 1] - t[m - 2]), "Added the last gap"], [(a + 1) * last + b, `Multiplied by ${a + 1} instead of ${a}`]];
    } else {
      const k = rng.int(0, 1);
      if (k === 0) {
        const a = T(rng, [2, 3]), t0 = rng.int(1, 5); m = 6; t = [t0];
        for (let i = 0; i < m; i++) t.push(a * t[i] + (i + 1));
        how = `each term is ${a} × the previous + n, where n = 1, 2, 3, ... counts the step`;
        wrongs = (last) => [[a * last + m - 1, "Added the previous step number again"], [a * last + m + 1, "Skipped a step number"], [a * last, "Forgot the step number"], [a * last + 1, "Added a constant 1"]];
      } else {
        const c = rng.int(1, 4) * (rng.chance(0.5) ? 1 : -1), t0 = rng.int(2, 3); m = 6; t = [t0];
        for (let i = 0; i < m; i++) t.push((i + 2) * t[i] + c);
        how = `the multiplier rises each time (×2, ×3, ×4 ...) and ${c > 0 ? "+" : "−"} ${Math.abs(c)} is applied`;
        wrongs = (last) => [[(m) * last + c, "Used the previous multiplier again"], [(m + 2) * last + c, "Skipped a multiplier"], [(m + 1) * last, `Forgot the ${c > 0 ? "+" : "−"} ${Math.abs(c)}`], [(m + 1) * last - c, "Used the wrong sign for the added number"]];
      }
    }
    if (t.some((x) => !I(x) || x <= 0 || x > 99999)) return null;
    const shown = t.slice(0, m), last = shown[m - 1], ans = t[m];
    if (!(ans > last) || (t[1] - t[0]) <= 0) return null;
    return mk(rng, d, ans, wrongs(last), {
      q: nextQ(rng, shown),
      sol: [`Test the pattern on the first terms: ${how}. Check: ${t[0]} → ${t[1]} → ${t[2]}.`, `Apply it once more to ${last}: **${ans}**.`],
      short: "If the gaps are growing fast and doubling or tripling, the series multiplies and then adds or subtracts a small number.",
      trap: "Look at the gaps: they are not constant, nor do they simply multiply; both a multiplier and an add-on are at work.",
    });
  }) });

  /* ---------------------------------------------------------------- 6. prime-based */
  QB.gen("quant/number-series/prime-based", { title: "Prime-based series", gen: wrap((rng, d) => {
    let t, how, wrongs, m, i0 = rng.int(0, 12), g;
    if (d === "Easy") {
      m = rng.int(5, 7); t = prm.slice(i0, i0 + m + 1); how = "these are consecutive prime numbers";
      const last = t[m - 1], ans = t[m];
      wrongs = [[prm[i0 + m + 1], "Skipped a prime"], [last + 2 === ans ? last + 4 : last + 2, "Took the next odd number, which is not prime"], [last + 1, "Took the next number"], [last + (t[m - 1] - t[m - 2]), "Added the last gap"]];
      return build(rng, d, t, m, how, wrongs, "Primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37 ... know the list up to 100.", "The next odd number is not always prime (for example 9, 15, 21, 25).");
    }
    if (d === "Medium") {
      m = 5;
      const k = rng.int(0, 4), c = rng.int(1, 4);
      if (k === 0) { g = (p) => p + c; how = `each term is a prime plus ${c}`; }
      else if (k === 1) { g = (p) => p * 2; how = "each term is twice a prime"; }
      else if (k === 2) { g = (p) => p * 2 + 1; how = "each term is twice a prime, plus 1"; }
      else if (k === 3) { g = (p) => p + 1; how = "each term is a prime plus 1"; }
      else { g = (p) => p * 3; how = "each term is 3 times a prime"; }
      t = prm.slice(i0, i0 + m + 1).map(g);
      const P = prm.slice(i0, i0 + m + 1);
      wrongs = [[g(prm[i0 + m + 1]), "Skipped a prime in the base list"], [g(P[m - 1] + 2), "Used the next odd number instead of the next prime"], [g(P[m - 1] + 1), "Used the next whole number instead of the next prime"], [t[m - 1] + (t[m - 1] - t[m - 2]), "Added the last gap"]];
      return build(rng, d, t, m, how, wrongs, "Strip the pattern off: subtract or divide to get back to 2, 3, 5, 7, 11 ...", "Gaps look random because primes are irregular, so do not search for a constant gap.");
    }
    m = 6;
    const k = rng.int(0, 2), P = prm.slice(i0, i0 + m + 3);
    if (k === 0) {
      t = P.slice(0, m + 1).map((p) => p * p); how = "each term is the square of a prime";
      wrongs = [[P[m + 1] * P[m + 1], "Skipped a prime before squaring"], [(P[m - 1] + 2) * (P[m - 1] + 2), "Squared the next odd number, which is not prime"], [(P[m - 1] + 1) * (P[m - 1] + 1), "Squared the next whole number"], [t[m - 1] + (t[m - 1] - t[m - 2]), "Added the last gap"]];
      return build(rng, d, t, m, how, wrongs, "Take square roots mentally: the roots are consecutive primes.", "The squares of consecutive whole numbers are not what is wanted; only primes are squared.");
    }
    if (k === 1) {
      t = []; let s = 0; for (let i = 0; i <= m; i++) { s += P[i]; t.push(s); } how = "each term adds the next prime to the running total";
      wrongs = [[t[m - 1] + P[m + 1], "Skipped a prime"], [t[m - 1] + P[m] + 2, "Added the next odd number instead of the next prime"], [t[m - 1] + P[m] - 1, "Slipped on the prime added"], [t[m - 1] + (t[m - 1] - t[m - 2]), "Repeated the last gap"]];
      return build(rng, d, t, m, how, wrongs, "Find the gaps first: if they are 2, 3, 5, 7, 11 ... the gaps are the primes.", "The gaps are primes, not a constant or a steadily growing amount.");
    }
    t = []; for (let i = 0; i <= m; i++) t.push(P[i] * P[i + 1]); how = "each term is the product of two consecutive primes";
    wrongs = [[P[m] * P[m + 2], "Multiplied two primes with one skipped between them"], [P[m + 1] * P[m + 2], "Started one prime too late"], [P[m - 1] * P[m + 1], "Went back one prime"], [t[m - 1] + (t[m - 1] - t[m - 2]), "Added the last gap"]];
    return build(rng, d, t, m, how, wrongs, "Factorise the terms: each one is p × (next prime).", "The gaps are irregular; think factors, not differences.");
    function build(rng, d, t, m, how, wrongs, short, trap) {
      const shown = t.slice(0, m), ans = t[m];
      return mk(rng, d, ans, wrongs, {
        q: nextQ(rng, shown),
        sol: [`Look for the primes inside the terms: ${how}.`, `Continue the pattern to get the next term: **${ans}**.`],
        short, trap,
      });
    }
  }) });

  /* ---------------------------------------------------------------- families for wrong / missing number */
  function famAP(rng, n) { const a = rng.int(3, 40), p = rng.int(3, 15); return { s: rr(n, (i) => a + i * p), rule: `each term is ${p} more than the one before`, tip: "Constant gaps: check the differences." }; }
  function famGP(rng, n) { const r = T(rng, [2, 3]), a = rng.int(1, 5); return { s: rr(n, (i) => a * Math.pow(r, i)), rule: `each term is ${r} times the one before`, tip: "Constant ratio: divide neighbouring terms." }; }
  function famDiff(rng, n) { const f = rng.int(1, 5), e = rng.int(2, 5), a = rng.int(1, 20); const s = [a]; for (let i = 1; i < n; i++) s.push(s[i - 1] + f + (i - 1) * e); return { s, rule: `the gaps are ${f}, ${f + e}, ${f + 2 * e}, ${f + 3 * e}, ... (growing by ${e})`, tip: "Write the gaps; the gaps of the gaps are constant." }; }
  function famSq(rng, n) { const s0 = rng.int(3, 9), k = rng.int(1, 8), sg = rng.chance(0.5) ? 1 : -1; return { s: rr(n, (i) => (s0 + i) * (s0 + i) + sg * k), rule: `the terms are squares ${sg > 0 ? "+" : "−"} ${k}: ${s0}² ${sg > 0 ? "+" : "−"} ${k}, ${s0 + 1}² ${sg > 0 ? "+" : "−"} ${k}, ...`, tip: "Spot the perfect squares near each term." }; }
  function famCube(rng, n) { const s0 = rng.int(2, 5), k = rng.int(1, 9), sg = rng.chance(0.5) ? 1 : -1; return { s: rr(n, (i) => Math.pow(s0 + i, 3) + sg * k), rule: `the terms are cubes ${sg > 0 ? "+" : "−"} ${k}: ${s0}³ ${sg > 0 ? "+" : "−"} ${k}, ${s0 + 1}³ ${sg > 0 ? "+" : "−"} ${k}, ...`, tip: "Spot the perfect cubes near each term." }; }
  function famMixed(rng, n) {
    const a = T(rng, [2, 3]), b = rng.int(1, 5) * (rng.chance(0.5) ? 1 : -1), t0 = rng.int(2, 9), s = [t0];
    for (let i = 1; i < n; i++) s.push(a * s[i - 1] + b);
    return { s, rule: `each term is ${a} × the previous ${b > 0 ? "+" : "−"} ${Math.abs(b)}`, tip: "Gaps that roughly multiply suggest a ×a ± b rule." };
  }
  function famInter(rng, n) {
    const a = rng.int(2, 30), p = rng.int(2, 9), b = rng.int(3, 20), q = T(rng, [2, 3]);
    return { s: rr(n, (i) => (i % 2 === 0 ? a + (i / 2) * p : b * Math.pow(q, (i - 1) / 2))), rule: `two series are mixed: odd places add ${p} each time, even places multiply by ${q}`, tip: "Separate the odd-place and even-place terms." };
  }
  function rr(n, f) { const a = []; for (let i = 0; i < n; i++) a.push(f(i)); return a; }
  const okSeq = (s) => s.every((x) => I(x) && x > 0 && x <= 99999) && new Set(s).size === s.length;

  /* ---------------------------------------------------------------- 7. wrong number */
  QB.gen("quant/number-series/wrong-number", { title: "Wrong number", gen: wrap((rng, d) => {
    const fams = d === "Easy" ? [famAP, famGP] : d === "Medium" ? [famDiff, famSq, famMixed, famGP] : [famCube, famMixed, famDiff, famSq];
    const F = T(rng, fams)(rng, 7);
    if (!okSeq(F.s)) return null;
    const pos = rng.int(2, 5), tr = F.s[pos];
    const dl = d === "Easy" ? rng.int(3, 9) : d === "Medium" ? rng.int(2, 6) : rng.int(1, 3);
    const w = tr + (rng.chance(0.5) ? dl : -dl);
    if (w <= 0 || F.s.includes(w)) return null;
    const s = F.s.slice(); s[pos] = w;
    const idx = [pos - 1, pos + 1]; const rest = [0, 1, 2, 3, 4, 5, 6].filter((i) => i !== pos && !idx.includes(i));
    idx.push(rng.pick(rest));
    const pairs = [[String(w), null]].concat(idx.map((i) => [String(s[i]), "This term fits the rule; the pattern holds here"]));
    const o = QB.options(rng, pairs);
    return Object.assign({ d, time: TIME[d] + 10, q: `Exactly one number in this series does not belong to the pattern. Find it: ${list(s)}`,
      sol: [`The rule is that ${F.rule}.`, `Following it, the term in place ${pos + 1} should be ${tr}, but the series shows ${w}. So **${w}** is wrong.`],
      short: F.tip + " The term that breaks the rule is the culprit; the rest of the list will agree with each other.",
      trap: "A wrong term also spoils the gap before it and after it, so those neighbours look suspicious; they are fine." }, o, { calc: String(w) });
  }) });

  /* ---------------------------------------------------------------- 8. missing number */
  QB.gen("quant/number-series/missing-number", { title: "Missing number", gen: wrap((rng, d) => {
    const fams = d === "Easy" ? [famAP, famGP, famDiff] : d === "Medium" ? [famDiff, famSq, famMixed, famInter] : [famCube, famMixed, famInter, famSq];
    const F0 = T(rng, fams), n = F0 === famInter ? 8 : 7;
    const F = F0(rng, n);
    if (!okSeq(F.s)) return null;
    const pos = F0 === famInter ? rng.int(2, 5) : rng.int(2, 4), ans = F.s[pos];
    const sh = F.s.map((x, i) => (i === pos ? "?" : String(x)));
    const L = F.s[pos - 1], R2 = F.s[pos + 1], LL = F.s[pos - 2], RR = F.s[pos + 2];
    const wr = [[(L + R2) / 2, "Took the average of the two neighbours"], [L + (L - LL), "Continued the previous gap"], [R2 - (RR - R2), "Worked back using the gap after it"], [R2 - (L - LL), "Mixed up the gaps on either side"]];
    return mk(rng, d, ans, wr, {
      q: `Find the missing number in the series: ${sh.join(", ")}`,
      sol: [`Work out the pattern from the visible terms: ${F.rule}.`, `Using it at the blank place gives **${ans}**.`],
      short: F.tip, trap: "Averaging the two neighbours only works for constant-gap series.",
    });
  }) });
})();
