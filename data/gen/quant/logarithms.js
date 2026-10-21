/* =====================================================================
   Logarithms: generator for "number of digits via log". The log values
   are always given in the question (4 decimals) and the key is computed
   from those given values, so the answer is exactly what a student gets.
   ===================================================================== */
(function () {
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 45, Medium: 70, Hard: 105 };
  const LG = { 2: 0.3010, 3: 0.4771, 5: 0.6990, 7: 0.8451 };
  const I = Number.isInteger;
  const r4 = (x) => Math.round(x * 10000) / 10000;
  const fr = (x) => x - Math.floor(x);
  const given = (ps) => ps.map((p) => `log ${p} = ${LG[p].toFixed(4)}`).join(", ").replace(/, ([^,]*)$/, " and $1");
  const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const pw = (b, n) => `${b}${String(n).split("").map((c) => SUP[c]).join("")}`;
  const WHO = ["A bank's coding team", "A quiz setter", "A maths teacher", "An examiner", "A student preparing for placements", "A puzzle designer"];

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("logarithms: no clean question found");
    };
  }
  function mk(rng, d, ans, wrongs, body) {
    if (!I(ans) || ans < 0) return null;
    const seen = new Set([ans]), pairs = [[String(ans), null]];
    const fb = [[ans + 1, "Off by one"], [ans - 1, "Off by one"], [ans + 2, "Off by two"], [ans - 2, "Off by two"]];
    for (const w of wrongs.concat(fb)) {
      if (pairs.length === 4) break;
      if (!I(w[0]) || w[0] < 0 || seen.has(w[0])) continue;
      seen.add(w[0]); pairs.push([String(w[0]), w[1]]);
    }
    if (pairs.length < 4) return null;
    const o = QB.options(rng, pairs);
    return Object.assign({ d, time: TIME[d] }, body, o, { calc: String(ans) });
  }
  // value of log for a factor list [[prime, exponent], ...]
  const logOf = (fs) => r4(fs.reduce((s, f) => s + f[1] * LG[f[0]], 0));
  const expr = (fs) => fs.map((f) => (f[1] === 1 ? String(f[0]) : pw(f[0], f[1]))).join(" × ");

  QB.gen("quant/logarithms/number-of-digits-via-log", { title: "Number of digits via log", gen: wrap((rng, d) => {
    const SHORT = "Digits = ⌊n·log a⌋ + 1: multiply, drop the decimal part, add 1.";
    if (d === "Easy") {
      const b = T(rng, [2, 3, 5, 7]), n = rng.int(8, 90), L = r4(n * LG[b]);
      if (fr(L) < 0.06 || fr(L) > 0.94) return null;
      const ans = Math.floor(L) + 1, w = T(rng, WHO);
      return mk(rng, d, ans, [
        [Math.floor(L), "Forgot to add 1 to the integer part"],
        [Math.ceil(L) + 1, "Rounded up and still added 1"],
        [Math.round(L), "Rounded the logarithm instead of taking the integer part"],
        [n, "Assumed the digit count equals the exponent"],
      ], {
        q: T(rng, [`Given ${given([b])}, find the number of digits in **${pw(b, n)}**.`, `${w} notes that ${given([b])}. How many digits does **${pw(b, n)}** have?`, `If ${given([b])}, how many digits are there in the number **${pw(b, n)}**?`]),
        sol: [`log(${pw(b, n)}) = ${n} × ${LG[b].toFixed(4)} = ${L}`, `Integer part is ${Math.floor(L)}, so the number has ${Math.floor(L)} + 1 = **${ans}** digits.`],
        short: SHORT, trap: `The characteristic is ${Math.floor(L)}, but the digit count is one more.`,
      });
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      if (k === 0) {
        const fs = T(rng, [[[2, 1], [3, 1]], [[2, 2], [3, 1]], [[3, 1], [5, 1]], [[2, 1], [7, 1]], [[2, 3], [3, 1]], [[3, 2], [5, 1]], [[2, 1], [5, 1]], [[3, 1], [7, 1]], [[5, 1], [7, 1]], [[2, 2], [5, 1]]]);
        const base = fs.reduce((x, f) => x * Math.pow(f[0], f[1]), 1);
        if (base === 10 || base === 20) return null;
        const n = rng.int(6, 40), lb = logOf(fs), L = r4(n * lb);
        if (fr(L) < 0.06 || fr(L) > 0.94) return null;
        const ans = Math.floor(L) + 1;
        const ps = fs.map((f) => f[0]);
        return mk(rng, d, ans, [
          [Math.floor(L), "Forgot to add 1"],
          [Math.floor(n * LG[ps[0]]) + 1, "Used only one of the prime factors"],
          [Math.ceil(L) + 1, "Rounded up and still added 1"],
          [Math.floor(L) + 2, "Added 2 to the integer part"],
        ], {
          q: `Given ${given(ps)}, find the number of digits in **${base}${String(n).split("").map((c) => SUP[c]).join("")}**.`,
          sol: [`${base} = ${expr(fs)}, so log ${base} = ${lb}`, `log(${pw(base, n)}) = ${n} × ${lb} = ${L}`, `Digits = ${Math.floor(L)} + 1 = **${ans}**.`],
          short: SHORT + " Break the base into primes first.", trap: "Use the log of the whole base (sum of the prime logs), not a single prime's log.",
        });
      }
      const b = T(rng, [2, 3, 5, 7]), n = rng.int(10, 120), L = r4(n * LG[b]);
      if (fr(L) < 0.06 || fr(L) > 0.94) return null;
      const z = Math.floor(L), ans = z;
      return mk(rng, d, ans, [
        [z + 1, "Gave the digit count of 2^n form, not the zeros"],
        [z - 1, "Subtracted one too many"],
        [Math.round(L), "Rounded the logarithm"],
        [z + 2, "Counted one extra position"],
      ], {
        q: `Given ${given([b])}, how many zeros come immediately after the decimal point in **(1/${b})${String(n).split("").map((c) => SUP[c]).join("")}** before the first non-zero digit?`,
        sol: [`log (1/${b})${String(n).split("").map((c) => SUP[c]).join("")} = −${n} × ${LG[b].toFixed(4)} = −${L}`, `−${L} = −${z + 1} + ${r4(1 - fr(L)).toFixed(4)}, so the number is 10^(−${z + 1}) × 10^${r4(1 - fr(L)).toFixed(4)} and the first non-zero digit is in decimal place ${z + 1}`, `Zeros after the point = **${z}**.`],
        short: "Zeros after the decimal point = ⌊n·log b⌋ for the number b^(−n).", trap: "The first non-zero digit is in place ⌊n·log b⌋ + 1, so there are one fewer zeros than that.",
      });
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      const a = T(rng, [2, 3, 5, 7]), b = T(rng, [2, 3, 5, 7]); if (a === b) return null;
      const m = rng.int(5, 40), n = rng.int(5, 40), L = r4(m * LG[a] + n * LG[b]);
      if (fr(L) < 0.06 || fr(L) > 0.94) return null;
      const ans = Math.floor(L) + 1;
      return mk(rng, d, ans, [
        [Math.floor(L), "Forgot to add 1"],
        [Math.floor(m * LG[a]) + Math.floor(n * LG[b]) + 2, "Added the two digit counts"],
        [Math.floor(m * LG[a]) + Math.floor(n * LG[b]) + 1, "Added the integer parts before adding the fractions"],
        [Math.ceil(L) + 1, "Rounded up and still added 1"],
      ], {
        q: `Given ${given([a, b])}, find the number of digits in **${pw(a, m)} × ${pw(b, n)}**.`,
        sol: [`log = ${m} × ${LG[a].toFixed(4)} + ${n} × ${LG[b].toFixed(4)} = ${r4(m * LG[a])} + ${r4(n * LG[b])} = ${L}`, `Digits = ${Math.floor(L)} + 1 = **${ans}**.`],
        short: "Add the full logs first, then take the integer part and add 1.", trap: "Digits of a product are not the sum of the digit counts; add the logs and floor once.",
      });
    }
    if (k === 1) {
      const b = T(rng, [2, 3, 5, 7]), kd = rng.int(8, 60);
      const nmin = Math.ceil((kd - 1) / LG[b] - 1e-9), x = (kd - 1) / LG[b];
      if (fr(x) < 0.05 || fr(x) > 0.95) return null;
      return mk(rng, d, nmin, [
        [Math.floor(x), "Rounded down: that power is still one digit short"],
        [Math.ceil(kd / LG[b]), "Used k instead of k − 1 digits' worth"],
        [Math.round(x), "Rounded to nearest instead of up"],
        [Math.ceil(x) + 1, "Added an extra 1 after rounding up"],
      ], {
        q: `Given ${given([b])}, find the smallest positive integer n for which **${b}ⁿ** has at least **${kd}** digits.`,
        sol: [`${kd} digits means ${b}ⁿ ≥ 10^${kd - 1}, so n × ${LG[b].toFixed(4)} ≥ ${kd - 1}`, `n ≥ ${kd - 1} ÷ ${LG[b].toFixed(4)} = ${QB.round(x, 2)}`, `The smallest integer n is **${nmin}**.`],
        short: "k digits needs n·log b ≥ k − 1; divide and round UP.", trap: "Rounding down gives a number with one digit too few.",
      });
    }
    const fs = T(rng, [[[2, 2], [3, 1]], [[3, 1], [5, 1]], [[2, 1], [7, 1]], [[2, 1], [3, 1]], [[3, 2], [2, 1]], [[5, 1], [7, 1]]]);
    const base = fs.reduce((x, f) => x * Math.pow(f[0], f[1]), 1), n = rng.int(10, 60), ps = fs.map((f) => f[0]);
    const lb = logOf(fs), L = r4(n * lb);
    if (fr(L) < 0.06 || fr(L) > 0.94) return null;
    const ans = Math.floor(L) + 1;
    return mk(rng, d, ans, [
      [Math.floor(L), "Forgot to add 1"],
      [Math.floor(n * LG[ps[0]]) + 1, "Used only one prime's log"],
      [Math.floor(n * lb / 2) + 1, "Halved the logarithm somewhere"],
      [Math.ceil(L) + 1, "Rounded up and still added 1"],
    ], {
      q: `Given ${given(ps)}, find the number of digits in **${pw(base, n)}**.`,
      sol: [`${base} = ${expr(fs)}, so log ${base} = ${lb}`, `log(${pw(base, n)}) = ${n} × ${lb} = ${L}`, `Digits = ${Math.floor(L)} + 1 = **${ans}**.`],
      short: SHORT, trap: "Factorise the base first and add the prime logs; one prime's log alone is not enough.",
    });
  }) });
})();
