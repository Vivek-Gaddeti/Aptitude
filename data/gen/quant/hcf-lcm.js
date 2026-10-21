/* =====================================================================
   HCF & LCM: question generators (one per catalog pattern marked gen: true).
   Easy / Medium / Hard each, clean answers, wrong options from real mistakes.
   ===================================================================== */
(function () {
  const N = (x) => QB.num(x);
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 95 };
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const sup = (n) => String(n).split("").map((c) => SUP[+c]).join("");
  const G = (...a) => a.reduce((x, y) => QB.gcd(x, y));
  const L = (...a) => a.reduce((x, y) => QB.lcm(x, y));
  const list = (a) => a.join(", ");
  const andList = (a) => a.length === 2 ? a[0] + " and " + a[1] : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("hcf-lcm: no clean question found");
    };
  }
  function mk(rng, f, ans, wrongs, extra, o) {
    o = o || {};
    if (!isFinite(ans)) return null;
    const A = f(ans), seen = new Set([A.toLowerCase()]), pairs = [[A, null]];
    const add = (v, why) => {
      if (pairs.length === 4 || !isFinite(v) || v <= 0 || v > 1e9) return;
      if (Number.isInteger(ans) && !Number.isInteger(v)) return;
      const t = f(v);
      if (seen.has(t.toLowerCase()) || /NaN|undefined|Infinity/.test(t)) return;
      seen.add(t.toLowerCase());
      pairs.push([t, why]);
    };
    wrongs.forEach((w) => add(w[0], w[1]));
    const st = o.step || 1;
    [1, -1, 2, -2, 3, -3, 5, -5, 10, -10].forEach((k) => add(ans + k * st, "A small slip near the end of the working"));
    if (pairs.length < 4) return null;
    return Object.assign({ time: TIME[extra.d] }, extra, QB.options(rng, pairs), { calc: String(Math.round(ans * 1e6) / 1e6) });
  }
  const finish = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });
  const NAMES = ["Anil", "Bhavna", "Chirag", "Divya", "Farhan", "Gita", "Harsh", "Indu", "Jatin", "Kiran", "Lata", "Manoj", "Nisha", "Omkar", "Pooja", "Rahul", "Sana", "Tarun"];

  /* ------------------------------------------------------------------ 1. HCF / LCM by prime factors */
  const PR = [2, 3, 5, 7, 11, 13];
  const facStr = (f) => f.filter(([, e]) => e > 0).map(([p, e]) => e === 1 ? String(p) : p + sup(e)).join(" × ");
  function fmap(n) { const m = {}; for (let p = 2; p * p <= n; p++) while (n % p === 0) { m[p] = (m[p] || 0) + 1; n /= p; } if (n > 1) m[n] = (m[n] || 0) + 1; return m; }
  QB.gen("quant/hcf-lcm/hcf-lcm-by-prime-factors", { title: "HCF / LCM by prime factors", gen: wrap((rng, d) => {
    const wantH = rng.chance(0.5), name = wantH ? "HCF" : "LCM";
    if (d === "Easy" || d === "Medium") {
      const cnt = d === "Easy" ? 2 : 3, hi = d === "Easy" ? 150 : 220;
      const nums = []; while (nums.length < cnt) { const v = rng.int(12, hi); if (!nums.includes(v)) nums.push(v); }
      const h = G(...nums), l = L(...nums);
      if (l > 6000 || (wantH && h === 1) || (!wantH && l === nums.reduce((a, b) => a * b, 1))) return null;
      const prod = nums.reduce((a, b) => a * b, 1), ans = wantH ? h : l;
      const maps = nums.map(fmap), ps = [...new Set(maps.flatMap((m) => Object.keys(m).map(Number)))].sort((a, b) => a - b);
      const lines = nums.map((n, i) => `${n} = ${facStr(Object.entries(maps[i]).map(([p, e]) => [+p, e])) }`);
      const commonOnly = ps.filter((p) => maps.every((m) => m[p])).reduce((a, p) => a * p ** Math.max(...maps.map((m) => m[p] || 0)), 1);
      return mk(rng, N, ans, wantH ? [
        [l, "Took the highest powers (that is the LCM)"],
        [Math.min(...nums), "Gave the smallest number"],
        [ps.filter((p) => maps.every((m) => m[p])).reduce((a, p) => a * p, 1), "Took each common prime once, ignoring its power"],
        [prod, "Multiplied all the numbers"],
      ] : [
        [h, "Took the lowest powers (that is the HCF)"],
        [prod, "Multiplied all the numbers"],
        [Math.max(...nums), "Gave the largest number"],
        [commonOnly, "Used only the primes common to all the numbers"],
      ], finish(d, T(rng, [`Find the ${name} of ${andList(nums.map((x) => "**" + x + "**"))}.`, `What is the ${name} of ${list(nums.slice(0, -1).map((x) => "**" + x + "**"))} and **${nums[nums.length - 1]}**?`, `The ${name} of ${andList(nums.map((x) => "**" + x + "**"))} is:`]),
        [...lines, wantH ? `HCF = product of the common primes with the LOWEST powers = **${N(h)}**` : `LCM = product of all primes with the HIGHEST powers = **${N(l)}**`],
        wantH ? `Common primes, smallest powers.` : `Every prime that appears, largest powers.`,
        `HCF takes the smallest power of each COMMON prime; LCM takes the largest power of EVERY prime that appears.`));
    }
    const np = rng.int(3, 4), ps = rng.shuffle(PR).slice(0, np).sort((a, b) => a - b), cnt = 3;
    const rows = []; for (let i = 0; i < cnt; i++) rows.push(ps.map((p) => [p, rng.int(0, 3)]));
    const val = (r) => r.reduce((a, [p, e]) => a * p ** e, 1);
    const hE = ps.map((p, j) => Math.min(...rows.map((r) => r[j][1]))), lE = ps.map((p, j) => Math.max(...rows.map((r) => r[j][1])));
    const h = ps.reduce((a, p, j) => a * p ** hE[j], 1), l = ps.reduce((a, p, j) => a * p ** lE[j], 1);
    if (rows.some((r) => val(r) < 6 || val(r) > 5000) || l > 2000000 || l === h || (wantH && h === 1) || rows.some((r, i) => rows.some((r2, j) => i < j && val(r) === val(r2)))) return null;
    const ans = wantH ? h : l, prod = rows.reduce((a, r) => a * val(r), 1);
    const common = ps.filter((p, j) => rows.every((r) => r[j][1] > 0));
    const other = wantH ? ps.reduce((a, p, j) => a * p ** lE[j], 1) : h;
    return mk(rng, N, ans, wantH ? [
      [other, "Took the highest powers (that is the LCM)"],
      [common.reduce((a, p) => a * p, 1), "Took each common prime once, ignoring its power"],
      [Math.min(...rows.map(val)), "Gave the smallest of the numbers"],
    ] : [
      [other, "Took the lowest powers (that is the HCF)"],
      [ps.reduce((a, p, j) => a * (rows.every((r) => r[j][1] > 0) ? p ** lE[j] : 1), 1), "Used only the primes common to all three numbers"],
      [Math.max(...rows.map(val)), "Gave the largest of the numbers"],
      [ps.reduce((a, p, j) => a * p ** (lE[j] ? lE[j] - 1 : 0), 1) || 1, "Took one power less than the highest"],
      [prod, "Multiplied all the numbers"],
    ], finish(d, T(rng, [`Find the ${name} of the numbers ${rows.map((r) => "**" + facStr(r) + "**").join(", ")}.`, `The three numbers are written in prime-factor form as ${rows.map((r) => "**" + facStr(r) + "**").join(", ")}. What is their ${name}?`]),
      [`Compare the power of each prime: ${ps.map((p, j) => p + ": " + rows.map((r) => r[j][1]).join(", ")).join("; ")}`, wantH ? `Lowest powers: ${facStr(ps.map((p, j) => [p, hE[j]])) || "1"} = **${N(h)}**` : `Highest powers: ${facStr(ps.map((p, j) => [p, lE[j]]))} = **${N(l)}**`],
      wantH ? `Smallest power of each prime (power 0 if a prime is missing from any number).` : `Largest power of each prime that occurs in any of the numbers.`,
      `A prime missing from one number has power 0 there, so for the HCF it drops out.`));
  }) });

  /* ------------------------------------------------------------------ 2. HCF x LCM = product */
  function coprimePair(rng, lo, hi) { for (;;) { const m = rng.int(lo, hi), n = rng.int(lo, hi); if (m !== n && QB.gcd(m, n) === 1) return [m, n]; } }
  QB.gen("quant/hcf-lcm/hcf-lcm-product", { title: "HCF × LCM = product of the numbers", gen: wrap((rng, d) => {
    const nm = rng.shuffle(NAMES).slice(0, 2);
    if (d === "Easy") {
      const [m, n] = coprimePair(rng, 1, 9), h = rng.int(2, 24), a = h * m, b = h * n, l = h * m * n;
      if (m === 1 && n === 1) return null;
      const askB = rng.chance(0.5), given = askB ? a : b, ans = askB ? b : a;
      return mk(rng, N, ans, [
        [l - given, "Subtracted the given number from the LCM"],
        [h * l / given / h, "Divided the LCM by the given number only"],
        [h + l - given, "Used HCF + LCM − number"],
        [given * l / h, "Inverted the formula"],
      ], finish(d, T(rng, [`The HCF of two numbers is **${h}** and their LCM is **${l}**. If one of the numbers is **${given}**, find the other.`, `Two numbers have HCF **${h}** and LCM **${l}**. One of them is **${given}**. What is the other?`, `${nm[0]} and ${nm[1]} think of two numbers whose HCF is **${h}** and LCM is **${l}**. ${nm[0]}'s number is **${given}**. What is ${nm[1]}'s number?`]),
        [`HCF × LCM = product of the two numbers`, `${h} × ${l} = ${given} × (other), so other = ${h * l} ÷ ${given} = **${ans}**`],
        `Other number = HCF × LCM ÷ the given number.`, `HCF × LCM equals the PRODUCT of the two numbers, not their sum.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 2), [m, n] = coprimePair(rng, 2, 12), h = rng.int(2, 18), a = h * m, b = h * n, l = h * m * n;
      if (k === 0) {
        return mk(rng, N, l, [
          [a * b, "Gave the product of the numbers"],
          [a * b / h / h, "Divided the product by HCF twice"],
          [a + b - h, "Used a + b − HCF"],
          [l / h, "Divided the LCM by the HCF once more"],
        ], finish(d, `The product of two numbers is **${N(a * b)}** and their HCF is **${h}**. What is their LCM?`,
          [`HCF × LCM = product`, `LCM = ${N(a * b)} ÷ ${h} = **${N(l)}**`], `LCM = product ÷ HCF.`, `Only one division by the HCF is needed.`));
      }
      if (k === 1) {
        return mk(rng, N, h, [
          [a * b / l / l * h, "Mis-simplified the division"],
          [l / h, "Divided LCM by the HCF idea backwards"],
          [Math.min(a, b), "Gave the smaller number"],
          [a * b / h, "Divided the product by the HCF instead of the LCM"],
        ], finish(d, `The product of two numbers is **${N(a * b)}** and their LCM is **${N(l)}**. What is their HCF?`,
          [`HCF × LCM = product`, `HCF = ${N(a * b)} ÷ ${N(l)} = **${h}**`], `HCF = product ÷ LCM.`, `Do not confuse which of the two you divide by.`));
      }
      const rr = [m, n];
      return mk(rng, N, a + b, [
        [l, "Gave the LCM"],
        [h * (m * n), "Gave the LCM again after finding the parts"],
        [a * b / h, "Gave the product divided by HCF"],
        [Math.abs(a - b), "Gave the difference of the numbers"],
      ], finish(d, `Two numbers are in the ratio **${m} : ${n}** and their LCM is **${N(l)}**. What is the sum of the two numbers?`,
        [`Let the numbers be ${m}x and ${n}x; since ${m} and ${n} are co-prime, their HCF is x and their LCM is ${m * n}x`, `${m * n}x = ${N(l)} → x = ${h}; the numbers are ${a} and ${b}, sum **${a + b}**`],
        `LCM = (product of ratio terms) × x when the ratio terms are co-prime.`, `Ratio ${rr.join(" : ")} must be in lowest terms (co-prime) before using LCM = mn·x.`));
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      const [m, n] = coprimePair(rng, 2, 12), h = rng.int(2, 15), a = h * m, b = h * n, l = h * m * n, s = a + b;
      const big = Math.max(a, b);
      return mk(rng, N, big, [
        [Math.min(a, b), "Gave the smaller number"],
        [s, "Gave the sum of the numbers"],
        [l / Math.max(m, n), "Mis-solved the quadratic"],
        [Math.abs(a - b), "Gave the difference of the numbers"],
      ], finish(d, `The HCF of two numbers is **${h}**, their LCM is **${N(l)}** and their sum is **${s}**. Find the larger number.`,
        [`Numbers = ${h}m and ${h}n with m, n co-prime; m·n = ${l}/${h} = ${m * n} and m + n = ${s}/${h} = ${m + n}`, `m, n = ${m}, ${n}, so the numbers are ${a} and ${b}; the larger is **${big}**`],
        `Divide the LCM and the sum by the HCF; find two numbers with that product and sum.`, `Multiply back by the HCF at the end.`));
    }
    if (k === 1) {
      const [m, n] = coprimePair(rng, 2, 9), h = rng.int(2, 14), a = h * m, b = h * n, l = h * m * n, s = a + b;
      const f = QB.frac(s, h * l);
      const wr = [[QB.frac(h, l), "Used HCF ÷ LCM"], [QB.frac(s, l), "Divided the sum by the LCM only"], [QB.frac(l, s), "Inverted the answer"], [QB.frac(s, h), "Divided the sum by the HCF only"], [QB.frac(h * s, l), "Multiplied by the HCF"]];
      const seen = new Set([f]), pairs = [[f, null]];
      for (const w of wr) { if (pairs.length === 4) break; if (!seen.has(w[0])) { seen.add(w[0]); pairs.push(w); } }
      if (pairs.length < 4) return null;
      return Object.assign({ time: TIME[d] }, finish(d, `The HCF of two numbers is **${h}**, their LCM is **${N(l)}** and their sum is **${s}**. What is the sum of their reciprocals?`,
        [`1/a + 1/b = (a + b)/(ab), and ab = HCF × LCM = ${h} × ${N(l)} = ${N(h * l)}`, `Sum of reciprocals = ${s}/${N(h * l)} = **${f}**`],
        `(a + b) ÷ (HCF × LCM).`, `ab is the product HCF × LCM, not the LCM alone.`), QB.options(rng, pairs), { calc: `${s}/${h * l}` });
    }
    const [m, n] = coprimePair(rng, 2, 9), h = rng.int(3, 20), a = h * m, b = h * n, l = h * m * n;
    const sm = Math.min(a, b);
    return mk(rng, N, Math.abs(a - b), [
      [a + b, "Gave the sum of the numbers"],
      [l, "Gave the LCM"],
      [Math.abs(m - n), "Forgot to multiply by the HCF"],
      [sm, "Gave the smaller number"],
    ], finish(d, `Two numbers have HCF **${h}**, and their product is **${N(a * b)}**. If the sum of the two numbers is **${a + b}**, what is their positive difference?`,
      [`Product = ${N(a * b)} and sum = ${a + b}, so (a − b)² = (a + b)² − 4ab = ${(a + b) ** 2} − ${4 * a * b} = ${(a - b) ** 2}`, `Difference = **${Math.abs(a - b)}**`],
      `(a − b)² = (a + b)² − 4ab; no need to find the numbers first.`, `The HCF is a hint only; the product and sum already fix the numbers.`));
  }) });

  /* ------------------------------------------------------------------ 3. HCF / LCM of fractions */
  const FRAC = (n, dd) => QB.frac(n, dd);
  function mkFrac(rng, ans, wrongs, extra) {
    const f = (v) => FRAC(v[0], v[1]), A = f(ans), seen = new Set([A]), pairs = [[A, null]];
    for (const w of wrongs) { if (pairs.length === 4) break; const t = f(w[0]); if (!seen.has(t) && w[0][1] !== 0 && w[0][0] > 0) { seen.add(t); pairs.push([t, w[1]]); } }
    for (let k = 1; pairs.length < 4 && k < 8; k++) { const t = FRAC(ans[0] + k, ans[1]); if (!seen.has(t)) { seen.add(t); pairs.push([t, "A slip in the numerator"]); } }
    if (pairs.length < 4) return null;
    return Object.assign({ time: TIME[extra.d] }, extra, QB.options(rng, pairs), { calc: `${ans[0]}/${ans[1]}` });
  }
  function fracList(rng, cnt, nHi, dHi) {
    const out = [];
    for (let i = 0; i < 60 && out.length < cnt; i++) {
      const n = rng.int(1, nHi), dd = rng.int(2, dHi);
      if (n >= dd * 2 || QB.gcd(n, dd) !== 1 || out.some((x) => x[0] === n && x[1] === dd)) continue;
      out.push([n, dd]);
    }
    return out.length === cnt ? out : null;
  }
  QB.gen("quant/hcf-lcm/hcf-lcm-of-fractions", { title: "HCF / LCM of fractions", gen: wrap((rng, d) => {
    const wantH = rng.chance(0.5), name = wantH ? "HCF" : "LCM";
    if (d === "Hard" && rng.chance(0.5)) {
      const cnt = rng.int(2, 3), vals = []; while (vals.length < cnt) { const v = rng.int(2, 150); if (!vals.includes(v) && v % 10) vals.push(v); }
      const dp = T(rng, [1, 2]), sc = 10 ** dp, h = G(...vals), l = L(...vals), ans = (wantH ? h : l) / sc;
      if (l > 3000 || (wantH && h === 1) || l === vals.reduce((a, b) => a * b, 1)) return null;
      const ds = vals.map((v) => (v / sc).toFixed(dp));
      return mk(rng, N, ans, wantH ? [
        [l / sc, "Found the LCM instead of the HCF"], [h, "Forgot to put the decimal point back"], [h / sc / 10, "Put the decimal point one place too far left"], [h / sc * 10, "Put the decimal point one place too far right"],
      ] : [
        [h / sc, "Found the HCF instead of the LCM"], [l, "Forgot to put the decimal point back"], [l / sc / 10, "Put the decimal point one place too far left"], [l / sc * 10, "Put the decimal point one place too far right"],
      ], finish(d, `Find the ${name} of ${andList(ds.map((x) => "**" + x + "**"))}.`,
        [`Remove the decimal point (multiply by ${sc}): ${list(vals)}`, `${name} of ${list(vals)} = ${N(wantH ? h : l)}; divide by ${sc} to restore the decimal: **${N(ans)}**`],
        `Make all numbers whole by the same power of 10, take the ${name}, then undo the scaling.`, `Put the decimal point back at the end, in the same place.`));
    }
    const cnt = d === "Easy" ? 2 : 3, fs = fracList(rng, cnt, d === "Hard" ? 45 : 20, d === "Hard" ? 40 : 24);
    if (!fs) return null;
    const ns = fs.map((x) => x[0]), ds = fs.map((x) => x[1]);
    const hN = G(...ns), lN = L(...ns), hD = G(...ds), lD = L(...ds);
    const ans = wantH ? [hN, lD] : [lN, hD];
    const g = QB.gcd(ans[0], ans[1]); ans[0] /= g; ans[1] /= g;
    const sw = (a, b) => { const gg = QB.gcd(a, b); return [a / gg, b / gg]; };
    return mkFrac(rng, ans, wantH ? [
      [sw(lN, hD), "Used LCM of numerators over HCF of denominators (that is the LCM)"],
      [sw(hN, hD), "Took the HCF of the denominators instead of the LCM"],
      [sw(hN, ds.reduce((a, b) => a * b, 1)), "Multiplied the denominators"],
      [sw(lD, hN), "Inverted the answer"],
    ] : [
      [sw(hN, lD), "Used HCF of numerators over LCM of denominators (that is the HCF)"],
      [sw(lN, lD), "Took the LCM of the denominators instead of the HCF"],
      [sw(lN, ds.reduce((a, b) => a * b, 1)), "Multiplied the denominators"],
      [sw(hD, lN), "Inverted the answer"],
    ], finish(d, T(rng, [`Find the ${name} of ${andList(fs.map((x) => "**" + x[0] + "/" + x[1] + "**"))}.`, `What is the ${name} of the fractions ${list(fs.map((x) => "**" + x[0] + "/" + x[1] + "**"))}?`]),
      [`All fractions are in lowest terms. Numerators: ${list(ns)}; denominators: ${list(ds)}`, wantH ? `HCF = HCF of numerators ÷ LCM of denominators = ${hN}/${lD} = **${FRAC(ans[0], ans[1])}**` : `LCM = LCM of numerators ÷ HCF of denominators = ${lN}/${hD} = **${FRAC(ans[0], ans[1])}**`],
      wantH ? `HCF(numerators) over LCM(denominators).` : `LCM(numerators) over HCF(denominators).`,
      `Fractions must be in lowest terms first. HCF uses HCF over LCM; LCM uses LCM over HCF.`)) ;
  }) });

  /* ------------------------------------------------------------------ 4. greatest number leaving given remainders */
  function mulSet(rng, cnt, lo, hi) { for (let i = 0; i < 100; i++) { const m = []; while (m.length < cnt) { const v = rng.int(lo, hi); if (!m.includes(v)) m.push(v); } if (G(...m) === 1) return m.sort((a, b) => a - b); } return null; }
  const digSum = (n) => String(n).split("").reduce((a, c) => a + +c, 0);
  QB.gen("quant/hcf-lcm/greatest-number-leaving-given-remainders", { title: "Greatest number leaving given remainders", gen: wrap((rng, d) => {
    const H = rng.int(d === "Easy" ? 5 : 8, d === "Easy" ? 30 : 60);
    if (d === "Easy") {
      const r = rng.int(1, Math.min(H - 1, 9)), m = mulSet(rng, 2, 4, 25);
      if (!m) return null;
      const [a, b] = m.map((x) => H * x + r);
      return mk(rng, N, H, [
        [G(a, b), "Took the HCF of the numbers without subtracting the remainder"],
        [G(a, b) === H ? H + 1 : G(a, b), "Used the HCF of the numbers"],
        [H - r, "Subtracted the remainder from the answer"],
        [L(a - r, b - r), "Took the LCM of the reduced numbers"],
        [r, "Gave the remainder"],
      ], finish(d, T(rng, [`Find the greatest number that divides **${a}** and **${b}** leaving remainder **${r}** in each case.`, `What is the largest number which, on dividing **${a}** and **${b}**, leaves a remainder of **${r}** each time?`, `The greatest number that leaves remainder **${r}** when it divides both **${a}** and **${b}** is:`]),
        [`Subtract the remainder: ${a} − ${r} = ${a - r}, ${b} − ${r} = ${b - r}`, `HCF(${a - r}, ${b - r}) = **${H}**`],
        `HCF of (each number − remainder).`, `The numbers ${a} and ${b} leave a remainder, so only ${a - r} and ${b - r} are exactly divisible.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      if (k === 0) {
        const r = rng.int(1, Math.min(H - 1, 12)), m = mulSet(rng, 3, 3, 30);
        if (!m) return null;
        const [a, b, c] = m.map((x) => H * x + r);
        return mk(rng, N, H, [
          [G(a, b, c), "Took the HCF of the numbers without subtracting the remainder"],
          [G(a - r, b - r), "Used only two of the three numbers"],
          [H - r, "Subtracted the remainder from the answer"],
          [L(a - r, b - r, c - r) , "Took the LCM of the reduced numbers"],
        ], finish(d, `What is the greatest number that divides **${a}**, **${b}** and **${c}** leaving the same remainder **${r}** in each case?`,
          [`${a} − ${r} = ${a - r}, ${b} − ${r} = ${b - r}, ${c} − ${r} = ${c - r}`, `HCF(${a - r}, ${b - r}, ${c - r}) = **${H}**`],
          `HCF of (number − remainder) for all three.`, `Subtract the remainder from EVERY number before taking the HCF.`));
      }
      const rs = [rng.int(1, 8), rng.int(1, 8), rng.int(1, 8)], m = mulSet(rng, 3, 3, 24);
      if (!m || rs.some((x) => x >= H)) return null;
      const nums = m.map((x, i) => H * x + rs[i]);
      return mk(rng, N, H, [
        [G(...nums), "Took the HCF of the numbers without subtracting the remainders"],
        [G(nums[0] - rs[0], nums[1] - rs[1]), "Left out the third number"],
        [G(...nums.map((x) => x - rs[0])), "Subtracted the first remainder from all numbers"],
        [H - Math.min(...rs), "Subtracted a remainder from the answer"],
      ], finish(d, `Find the greatest number that divides **${nums[0]}**, **${nums[1]}** and **${nums[2]}** leaving remainders **${rs[0]}**, **${rs[1]}** and **${rs[2]}** respectively.`,
        [`Subtract each remainder from its own number: ${nums.map((x, i) => x - rs[i]).join(", ")}`, `HCF = **${H}**`],
        `HCF of (number − its own remainder).`, `Each number loses its OWN remainder.`));
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      const m = mulSet(rng, 3, 4, 40);
      if (!m) return null;
      const r = rng.int(1, Math.min(H - 1, 20)), nums = m.map((x) => H * x + r);
      const diffs = [nums[1] - nums[0], nums[2] - nums[1]];
      if (G(...diffs) !== H) return null;
      return mk(rng, N, H, [
        [G(...nums), "Took the HCF of the numbers themselves"],
        [diffs[0], "Gave one difference only"],
        [G(nums[0], nums[1]), "Took the HCF of two of the numbers"],
        [Math.min(...diffs) , "Gave the smaller difference"],
      ], finish(d, `Find the greatest number that divides **${nums[0]}**, **${nums[1]}** and **${nums[2]}** leaving the same remainder in each case.`,
        [`Same remainder → the divisor divides every difference: ${nums[1]} − ${nums[0]} = ${diffs[0]}, ${nums[2]} − ${nums[1]} = ${diffs[1]}`, `HCF(${diffs[0]}, ${diffs[1]}) = **${H}**`],
        `HCF of the differences between the numbers (remainder not needed).`, `You do not need the remainder: the differences cancel it out.`));
    }
    const rs = [rng.int(1, 10), rng.int(1, 10), rng.int(1, 10)], m = mulSet(rng, 3, 5, 40);
    if (!m || rs.some((x) => x >= H)) return null;
    const nums = m.map((x, i) => H * x + rs[i]), sd = digSum(H);
    return mk(rng, N, sd, [
      [H, "Gave the number itself, not the sum of its digits"],
      [digSum(G(...nums)), "Used the HCF of the numbers without subtracting remainders"],
      [digSum(H) + 1, "Added an extra 1 when summing digits"],
      [digSum(G(nums[0] - rs[0], nums[1] - rs[1])) , "Left out the third number"],
    ], finish(d, `Let N be the greatest number that divides **${nums[0]}**, **${nums[1]}** and **${nums[2]}** leaving remainders **${rs[0]}**, **${rs[1]}** and **${rs[2]}** respectively. What is the sum of the digits of N?`,
      [`Reduced numbers: ${nums.map((x, i) => x - rs[i]).join(", ")}; N = HCF = ${H}`, `Sum of digits of ${H} = **${sd}**`],
      `Find N = HCF of (number − remainder), then add its digits.`, `The question asks for the digit sum of N, not N.`));
  }) });

  /* ------------------------------------------------------------------ 5. least number leaving given remainders */
  QB.gen("quant/hcf-lcm/least-number-leaving-given-remainders", { title: "Least number leaving given remainders", gen: wrap((rng, d) => {
    const pickDivs = (cnt, pool) => { const out = []; while (out.length < cnt) { const v = T(rng, pool); if (!out.includes(v)) out.push(v); } return out.sort((a, b) => a - b); };
    const pool = [4, 5, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24, 25, 28, 30, 35, 36, 40, 42, 45];
    if (d === "Easy") {
      const ds = pickDivs(rng.int(2, 3), pool), l = L(...ds), r = rng.int(1, Math.min(...ds) - 1);
      if (l > 400 || l === Math.max(...ds)) return null;
      return mk(rng, N, l + r, [
        [l, "Gave the LCM without adding the remainder"],
        [l - r, "Subtracted the remainder from the LCM"],
        [ds.reduce((a, b) => a * b, 1) + r, "Multiplied the divisors instead of taking the LCM"],
        [2 * l + r, "Gave the second such number"],
      ], finish(d, T(rng, [`Find the least number which leaves remainder **${r}** when divided by ${andList(ds.map((x) => "**" + x + "**"))}.`, `What is the smallest number that leaves a remainder of **${r}** on division by each of ${andList(ds.map((x) => "**" + x + "**"))}?`, `The least number which, when divided by ${andList(ds.map((x) => "**" + x + "**"))}, leaves **${r}** as remainder in every case, is:`]),
        [`LCM(${list(ds)}) = ${l}`, `Number = LCM + remainder = ${l} + ${r} = **${l + r}**`], `LCM of the divisors, plus the common remainder.`, `Add the remainder to the LCM; the LCM alone leaves remainder 0.`));
    }
    if (d === "Medium") {
      const ds = pickDivs(3, [4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24, 30]), k = rng.int(1, 4), l = L(...ds);
      if (l > 2500 || ds[0] <= k) return null;
      const rs = ds.map((x) => x - k);
      return mk(rng, N, l - k, [
        [l, "Gave the LCM"],
        [l + k, "Added the gap instead of subtracting it"],
        [2 * l - k, "Gave the second such number"],
        [l - k - ds[0] , "Subtracted a divisor as well"],
      ], finish(d, T(rng, [`Find the smallest number which leaves remainders **${rs[0]}**, **${rs[1]}** and **${rs[2]}** when divided by **${ds[0]}**, **${ds[1]}** and **${ds[2]}** respectively.`, `What is the least number that leaves **${rs[0]}**, **${rs[1]}** and **${rs[2]}** as remainders on division by **${ds[0]}**, **${ds[1]}** and **${ds[2]}** in that order?`]),
        [`Each divisor − remainder = ${k}, a constant gap`, `Number = LCM − ${k} = ${l} − ${k} = **${l - k}**`],
        `If (divisor − remainder) is the same every time, the answer is LCM − that gap.`, `Check the gap: ${ds.map((x, i) => x + " − " + rs[i]).join(", ")} are all ${k}.`));
    }
    const kind = rng.int(0, 3);
    if (kind === 0) {
      const ds = pickDivs(3, [4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30]), l = L(...ds), r = rng.int(1, Math.min(...ds) - 1);
      if (l > 2000) return null;
      let n = 9999; while (!ds.every((x) => n % x === r)) n--;
      return mk(rng, N, n, [
        [Math.floor(9999 / l) * l, "Found the multiple of the LCM but forgot to add the remainder"],
        [Math.floor(9999 / l) * l + r, "Added the remainder to a multiple that is already above 9999 or mis-rounded"],
        [n - l, "Gave the previous such number"],
        [Math.ceil(1000 / l) * l + r, "Found the smallest 4-digit number instead"],
      ], finish(d, T(rng, [`What is the greatest 4-digit number which leaves remainder **${r}** when divided by ${andList(ds.map((x) => "**" + x + "**"))}?`, `Find the largest 4-digit number that leaves a remainder of **${r}** in each of the divisions by ${andList(ds.map((x) => "**" + x + "**"))}.`]),
        [`LCM(${list(ds)}) = ${l}`, `Largest multiple of ${l} not above ${9999 - r}: ${Math.floor((9999 - r) / l)} × ${l} = ${Math.floor((9999 - r) / l) * l}`, `Add the remainder: **${n}**`],
        `Divide ${9999 - r} by the LCM, drop the fraction, multiply back, add ${r}.`, `Make sure that after adding the remainder the number is still a 4-digit number.`));
    }
    if (kind === 1) {
      const ds = pickDivs(3, [6, 8, 9, 12, 15, 16, 18, 20, 24, 25, 30, 36]), l = L(...ds);
      if (l > 5000) return null;
      const n = Math.ceil(10000 / l) * l;
      return mk(rng, N, n, [
        [Math.floor(9999 / l) * l, "Gave the greatest 4-digit multiple"],
        [n + l, "Gave the second 5-digit multiple"],
        [10000 + l, "Added the LCM to 10000"],
        [10000, "Gave the smallest 5-digit number"],
      ], finish(d, `What is the smallest 5-digit number exactly divisible by ${andList(ds.map((x) => "**" + x + "**"))}?`,
        [`LCM(${list(ds)}) = ${l}`, `10000 ÷ ${l} = ${Math.floor(10000 / l)} remainder ${10000 % l}, so round UP: ${Math.ceil(10000 / l)} × ${l} = **${n}**`],
        `Smallest multiple of the LCM that is at least 10000.`, `Round the quotient up, not down.`));
    }
    if (kind === 2) {
      const ds = pickDivs(3, [6, 8, 9, 12, 15, 18, 20, 24, 30, 36, 40]), l = L(...ds);
      if (l > 1500 || l < 50) return null;
      const base = rng.int(2000, 99999);
      if (base % l === 0) return null;
      const add = l - base % l;
      return mk(rng, N, add, [
        [base % l, "Gave the remainder, i.e. what to SUBTRACT"],
        [l, "Gave the LCM"],
        [add + l, "Gave the number to add for the next multiple"],
        [Math.floor(base / l), "Gave the quotient"],
      ], finish(d, T(rng, [`What is the least number that must be added to **${N(base)}** so that the sum is exactly divisible by ${andList(ds.map((x) => "**" + x + "**"))}?`, `Find the smallest number to be added to **${N(base)}** to make it divisible by each of ${andList(ds.map((x) => "**" + x + "**"))}.`]),
        [`LCM(${list(ds)}) = ${l}`, `${N(base)} ÷ ${l} leaves remainder ${base % l}, so add ${l} − ${base % l} = **${add}**`],
        `Add (LCM − remainder).`, `The remainder is what you subtract; to ADD, use LCM minus the remainder.`));
    }
    const ds = pickDivs(3, [4, 5, 6, 8, 9, 10, 12, 15, 18, 20]), k = rng.int(1, 3), l = L(...ds);
    if (l > 1500 || ds[0] <= k) return null;
    let n = 9999 + k; n -= n % l; n -= k;
    if (n > 9999) n -= l;
    const rs = ds.map((x) => x - k);
    return mk(rng, N, n, [
      [Math.floor(9999 / l) * l, "Found a multiple of the LCM but did not subtract the gap"],
      [n - l, "Gave the previous such number"],
      [n + l, "Gave the next such number (more than 4 digits)"],
      [Math.floor(9999 / l) * l + k, "Added the gap instead of subtracting"],
    ], finish(d, `Find the greatest 4-digit number which leaves remainders **${rs[0]}**, **${rs[1]}** and **${rs[2]}** when divided by **${ds[0]}**, **${ds[1]}** and **${ds[2]}** respectively.`,
      [`Divisor − remainder = ${k} each time, so the number is (a multiple of LCM) − ${k}; LCM = ${l}`, `Largest multiple of ${l} up to ${9999 + k} is ${n + k}; subtract ${k}: **${n}**`],
      `Largest multiple of the LCM up to 9999 + gap, then minus the gap.`, `Because we subtract ${k} afterwards, check the multiple against 9999 + ${k}, not 9999.`));
  }) });

  /* ------------------------------------------------------------------ 6. bells / lights together */
  QB.gen("quant/hcf-lcm/bells-traffic-lights-together", { title: "Bells / traffic lights together", gen: wrap((rng, d) => {
    const pickI = (cnt, pool) => { const out = []; while (out.length < cnt) { const v = T(rng, pool); if (!out.includes(v)) out.push(v); } return out.sort((a, b) => a - b); };
    const P = [6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 30, 36, 40, 45, 48, 50, 60, 72, 75, 90];
    const item = T(rng, [["bells", "toll", "tolled"], ["traffic lights", "change", "changed"], ["sirens", "sound", "sounded"], ["lighthouse beams", "flash", "flashed"], ["alarms", "ring", "rang"]]);
    if (d === "Easy") {
      const iv = pickI(2, P), l = L(...iv);
      if (l > 600 || l === iv[1]) return null;
      return mk(rng, N, l, [
        [iv[0] * iv[1], "Multiplied the two intervals"],
        [G(...iv), "Took the HCF of the intervals"],
        [iv[0] + iv[1], "Added the intervals"],
        [iv[1], "Gave the larger interval"],
      ], finish(d, `Two ${item[0]} ${item[1]} at intervals of **${iv[0]} seconds** and **${iv[1]} seconds**. If they ${item[1]} together now, after how many seconds will they ${item[1]} together again?`,
        [`They coincide at common multiples of ${iv[0]} and ${iv[1]}`, `LCM(${iv[0]}, ${iv[1]}) = **${l} seconds**`], `LCM of the two intervals.`, `The next time together is the LCM, not the product.`));
    }
    if (d === "Medium") {
      const iv = pickI(3, P), l = L(...iv);
      if (l > 1800 || l === iv[2]) return null;
      if (rng.chance(0.5)) {
        const min = l / 60;
        if (l % 60 !== 0) return null;
        return mk(rng, N, min, [
          [l, "Gave the answer in seconds"],
          [l / 60 * 2, "Doubled the answer"],
          [Math.round(iv.reduce((a, b) => a + b, 0) / 60) || 1, "Added the intervals and converted"],
          [iv[0] * iv[1] * iv[2] / 60, "Multiplied the intervals before converting"],
        ], finish(d, `Three ${item[0]} ${item[1]} at intervals of **${iv[0]}**, **${iv[1]}** and **${iv[2]} seconds** respectively. If they all ${item[1]} together at 8:00 am, after how many **minutes** will they ${item[1]} together again?`,
          [`LCM(${list(iv)}) = ${l} seconds`, `${l} ÷ 60 = **${min} minutes**`], `LCM in seconds, then divide by 60.`, `Convert to minutes at the end, not before taking the LCM.`));
      }
      const T0 = rng.int(2, 8) * 60, cnt = Math.floor(T0 * 60 / l) + 1;
      if (l > T0 * 60) return null;
      return mk(rng, N, cnt, [
        [cnt - 1, "Left out the one at the start"],
        [cnt + 1, "Counted one extra"],
        [Math.floor(T0 * 60 / iv[0]), "Divided by the smallest interval instead of the LCM"],
        [Math.round(T0 * 60 / l), "Rounded instead of taking the whole number of times"],
      ], finish(d, `Three ${item[0]} ${item[1]} at intervals of **${iv[0]}**, **${iv[1]}** and **${iv[2]} seconds**. If they ${item[1]} together at the start, how many times will they ${item[1]} together in **${T0 / 60} hours**, counting the one at the start?`,
        [`LCM(${list(iv)}) = ${l} s; ${T0 / 60} hours = ${N(T0 * 60)} s`, `${N(T0 * 60)} ÷ ${l} = ${Math.floor(T0 * 60 / l)} complete intervals, plus the start = **${cnt}**`],
        `Time ÷ LCM (whole part), then add 1 for the start.`, `Add 1 for the ring at time 0 when the question says to count it.`));
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      const iv = pickI(4, [8, 10, 12, 15, 16, 18, 20, 24, 30, 36, 40, 45, 48, 60]), l = L(...iv);
      if (l > 1500) return null;
      const bigU = rng.chance(0.5);
      const shown = bigU ? iv.map((x) => (x % 60 === 0 ? x / 60 + " minutes" : x + " seconds")) : iv.map((x) => x + " seconds");
      const mn = G(...iv);
      return mk(rng, N, l, [
        [l / 2, "Missed a factor of 2 in the LCM"],
        [l * 2, "Included an extra factor of 2"],
        [iv.reduce((a, b) => a * b, 1), "Multiplied the intervals"],
        [mn, "Took the HCF of the intervals"],
      ], finish(d, `Four ${item[0]} ${item[1]} at intervals of ${andList(shown.map((x) => "**" + x + "**"))}. If they all ${item[1]} together at midnight, after how many **seconds** will they next ${item[1]} together?`,
        [`LCM(${list(iv)})`, `= **${l} seconds**`], `Prime factorise each interval and take the highest powers.`, `Make sure all the intervals are in seconds before taking the LCM.`));
    }
    if (k === 1) {
      const iv = pickI(3, [10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60]), l = L(...iv);
      if (l > 600) return null;
      const laps = iv.map((x) => l / x), which = rng.int(0, 2), fastest = which === 0;
      const ans = fastest ? laps[0] : laps[2];
      return mk(rng, N, ans, [
        [fastest ? laps[2] : laps[0], fastest ? "Gave the laps of the slowest runner" : "Gave the laps of the fastest runner"],
        [l, "Gave the LCM"],
        [laps[1], "Gave the laps of the middle runner"],
        [ans + 1, "Counted the start as a lap"],
      ], finish(d, `Three runners take **${iv[0]}**, **${iv[1]}** and **${iv[2]} minutes** to complete one round of a circular track. They start together from the same point. When they next meet at the starting point, how many rounds has the ${fastest ? "fastest" : "slowest"} runner completed?`,
        [`They meet after LCM(${list(iv)}) = ${l} minutes`, `${fastest ? "Fastest" : "Slowest"} runner takes ${fastest ? iv[0] : iv[2]} min per round: ${l} ÷ ${fastest ? iv[0] : iv[2]} = **${ans}**`],
        `Meeting time = LCM; rounds = LCM ÷ the runner's time per round.`, `The fastest runner takes the SHORTEST time per round.`));
    }
    const iv = pickI(3, [12, 15, 18, 20, 24, 30, 36, 45, 60]), l = L(...iv), T0 = rng.int(3, 12) * l, cnt = T0 / l;
    if (l > 400 || l === iv[2]) return null;
    return mk(rng, N, cnt, [
      [cnt + 1, "Counted the start as well"],
      [cnt - 1, "Dropped the last coincidence"],
      [Math.floor(T0 / iv[0]), "Divided by the smallest interval instead of the LCM"],
      [cnt * 2, "Doubled the count"],
    ], finish(d, `Three ${item[0]} ${item[1]} at intervals of **${iv[0]}**, **${iv[1]}** and **${iv[2]} seconds**. They ${item[1]} together at 6:00:00 pm. How many times will they ${item[1]} together again in the next **${N(T0)} seconds** (not counting the one at 6:00:00 pm)?`,
      [`LCM(${list(iv)}) = ${l} s`, `${N(T0)} ÷ ${l} = **${cnt}**`], `Total time ÷ LCM, with no +1 because the start is excluded.`, `Read whether the starting ring is counted: here it is not.`));
  }) });

  /* ------------------------------------------------------------------ 7. tiles, rows, cutting into equal pieces */
  QB.gen("quant/hcf-lcm/tiles-rows-cutting-into-equal", { title: "Tiles, rows, cutting into equal pieces", gen: wrap((rng, d) => {
    const nm = T(rng, NAMES);
    if (d === "Easy") {
      const H = rng.int(5, 40), [m, n] = coprimePair(rng, 2, 14), l = H * m, b = H * n;
      const room = T(rng, ["hall", "courtyard", "terrace", "classroom floor", "verandah"]);
      return mk(rng, N, H, [
        [QB.gcd(m, n) === 1 ? m : 1, "Gave a multiplier instead of the side"],
        [Math.min(l, b), "Gave the smaller dimension"],
        [L(l, b), "Took the LCM of the two lengths"],
        [H / 2, "Used half the side by mistake"],
      ], finish(d, T(rng, [`A ${room} is **${l} cm** long and **${b} cm** wide. What is the side of the largest square tile that exactly covers the floor with no cutting?`, `${nm} wants to tile a ${room} measuring **${l} cm × ${b} cm** with identical square tiles, using the largest possible tile and no cutting. What is its side in cm?`]),
        [`Side of tile = HCF(${l}, ${b})`, `= **${H} cm**`], `HCF of length and breadth.`, `The biggest tile that fits exactly is the HCF, not the smaller side.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const H = rng.int(5, 30), [m, n] = coprimePair(rng, 3, 16), l = H * m, b = H * n, cnt = m * n;
        return mk(rng, N, cnt, [
          [l * b, "Gave the area in cm² instead of the number of tiles"],
          [m + n, "Added the numbers of tiles along the two sides"],
          [cnt * 2, "Doubled the count"],
          [2 * (m + n), "Counted tiles on the border only"],
        ], finish(d, `A rectangular floor is **${l} cm** by **${b} cm**. It is to be paved with identical square tiles of the largest possible size. How many tiles are needed?`,
          [`Tile side = HCF(${l}, ${b}) = ${H} cm`, `Number of tiles = (${l} ÷ ${H}) × (${b} ÷ ${H}) = ${m} × ${n} = **${cnt}**`],
          `Tiles = (l ÷ HCF) × (b ÷ HCF).`, `The count is not the area divided by the area of the tile with a smaller side: use the HCF.`));
      }
      if (k === 1) {
        const H = rng.int(3, 25), ms = mulSet(rng, 3, 3, 14);
        if (!ms) return null;
        const ropes = ms.map((x) => H * x), what = T(rng, ["ropes", "wires", "iron rods", "ribbons"]);
        return mk(rng, N, H, [
          [Math.min(...ropes), "Gave the shortest length"],
          [G(ropes[0], ropes[1]), "Used only two of the lengths"],
          [L(...ropes), "Took the LCM of the lengths"],
          [ropes.reduce((a, b) => a + b, 0) / ms.reduce((a, b) => a + b, 0) * 0 + H * 2, "Doubled the HCF"],
        ], finish(d, `Three ${what} of lengths **${ropes[0]} m**, **${ropes[1]} m** and **${ropes[2]} m** are to be cut into pieces of equal length with no waste. What is the greatest possible length of each piece, in metres?`,
          [`Piece length = HCF(${list(ropes)})`, `= **${H} m**`], `HCF of the three lengths.`, `Greatest length means HCF; the LCM would be longer than some of the ${what}.`));
      }
      const H = rng.int(2, 12), [m, n] = coprimePair(rng, 2, 12), a = H * m * 2, b = H * n * 2, pr = 2 * (a + b), g = G(a, b) ;
      return mk(rng, N, pr / g, [
        [pr / g + 4, "Added 4 for the corners"],
        [(a + b) / g, "Used half the perimeter"],
        [a * b / (g * g), "Counted the tiles of the area instead"],
        [pr / (2 * g), "Divided the perimeter by twice the gap"],
      ], finish(d, `A rectangular garden is **${a} m** long and **${b} m** wide. Trees are to be planted along its boundary at equal distances, with one tree at each corner. What is the minimum number of trees required?`,
        [`Greatest equal gap = HCF(${a}, ${b}) = ${g} m`, `Perimeter = 2(${a} + ${b}) = ${pr} m, trees = ${pr} ÷ ${g} = **${pr / g}**`],
        `Trees on a closed boundary = perimeter ÷ gap (no +1).`, `On a closed loop the first and last tree are the same one, so do not add 1.`));
    }
    const k = rng.int(0, 3);
    if (k === 0) {
      const a = rng.int(4, 30), b = rng.int(4, 30);
      const l = L(a, b);
      if (a === b || l > 400 || QB.gcd(a, b) === 1) return null;
      const cnt = l * l / (a * b);
      return mk(rng, N, cnt, [
        [l / a * (l / b) * 2, "Doubled the count"],
        [l, "Gave the side of the square"],
        [Math.round(l * l / (a * b) ) + a, "Added a spare row"],
        [a * b, "Gave the area of one brick"],
      ], finish(d, `Rectangular tiles of size **${a} cm × ${b} cm** are laid side by side, all in the same direction, to form the smallest possible square. How many tiles are needed?`,
        [`Side of square = LCM(${a}, ${b}) = ${l} cm`, `Tiles = (${l} ÷ ${a}) × (${l} ÷ ${b}) = ${l / a} × ${l / b} = **${cnt}**`],
        `Square side = LCM; tiles = (LCM ÷ a) × (LCM ÷ b).`, `Use the LCM (smallest square), not the HCF.`));
    }
    if (k === 1) {
      const a = rng.int(2, 12), b = rng.int(2, 12), c = rng.int(2, 12), l = L(a, b, c);
      if (new Set([a, b, c]).size < 3 || l > 200) return null;
      const cnt = l ** 3 / (a * b * c);
      if (!Number.isInteger(cnt) || cnt > 20000) return null;
      return mk(rng, N, cnt, [
        [l, "Gave the side of the cube"],
        [l * l * l / (a * b * c) / 2, "Halved the number of bricks"],
        [cnt * 2, "Doubled the number of bricks"],
        [(l / a) * (l / b) + (l / c), "Combined the counts incorrectly"],
      ], finish(d, `How many bricks of size **${a} cm × ${b} cm × ${c} cm** are needed to build the smallest possible solid cube?`,
        [`Edge of cube = LCM(${a}, ${b}, ${c}) = ${l} cm`, `Bricks = (${l} ÷ ${a}) × (${l} ÷ ${b}) × (${l} ÷ ${c}) = **${N(cnt)}**`],
        `Cube edge = LCM of the three edges; count along each direction and multiply.`, `The cube's edge is the LCM of the three dimensions.`));
    }
    if (k === 2) {
      const H = rng.int(3, 20), ms = mulSet(rng, 3, 2, 12);
      if (!ms) return null;
      const items = ms.map((x) => H * x * 2), tot = items.reduce((a, b) => a + b, 0) / G(...items);
      const g = G(...items);
      const things = T(rng, [["pencils", "pens", "erasers"], ["apples", "oranges", "bananas"], ["laddus", "barfis", "jalebis"], ["notebooks", "files", "folders"]]);
      return mk(rng, N, g, [
        [items.reduce((a, b) => a + b, 0), "Gave the total number of items"],
        [Math.min(...items), "Gave the smallest number of items"],
        [tot, "Gave the number of items in each packet"],
        [g / 2, "Used half the correct number of packets"],
      ], finish(d, `A shopkeeper has **${items[0]}** ${things[0]}, **${items[1]}** ${things[1]} and **${items[2]}** ${things[2]}. He packs them into identical gift packets, each with the same number of each item and nothing left over. What is the greatest number of packets he can make?`,
        [`Number of packets must divide each count; greatest = HCF(${list(items)})`, `= **${g}**`], `HCF of the three counts.`, `Packets = HCF; items per packet are the counts divided by the HCF.`));
    }
    const a = rng.int(20, 120), b = rng.int(20, 120), c = rng.int(20, 120), g = G(a, b, c), pieces = (a + b + c) / g;
    if (g < 4 || new Set([a, b, c]).size < 3 || !Number.isInteger(pieces)) return null;
    return mk(rng, N, pieces, [
      [pieces - 3, "Counted cuts instead of pieces"],
      [a / g + b / g, "Left out the third piece count"],
      [g, "Gave the length of each piece"],
      [(a * b * c) / (g * g * g) , "Multiplied the counts of pieces"],
    ], finish(d, `Three wires of lengths **${a} m**, **${b} m** and **${c} m** are cut into pieces of the same greatest possible length. What is the total number of pieces?`,
      [`Piece length = HCF(${a}, ${b}, ${c}) = ${g} m`, `Pieces = ${a}/${g} + ${b}/${g} + ${c}/${g} = ${a / g} + ${b / g} + ${c / g} = **${pieces}**`],
      `Total length ÷ HCF.`, `Count pieces, not cuts: n cuts on a wire made in one piece give n + 1 pieces.`));
  }) });
})();
