/* =====================================================================
   Progressions: generators for AP nth term & sum, GP nth term & sum
   (including infinite GP), and word problems (growing savings, bounces,
   rows of seats). Terms are built forward from chosen integers so every
   key is clean; wrong options are the classic slips (n instead of n - 1,
   forgetting the 1/2, using the wrong ratio, ...), each with a "why".
   ===================================================================== */
(function () {
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 45, Medium: 75, Hard: 110 };
  const R = (x) => QB.round(x, 2);
  const C = (x) => isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const sN = (x) => (x < 0 ? "−" + QB.num(R(-x)) : QB.num(R(x)));
  const M = (x) => QB.money(x);
  const NAMES = ["Ravi", "Meena", "Arjun", "Sneha", "Karthik", "Divya", "Imran", "Pooja", "Suresh", "Anita", "Vikram", "Nisha"];
  const ord = (n) => { const t = n % 100; return n + (t >= 11 && t <= 13 ? "th" : { 1: "st", 2: "nd", 3: "rd" }[n % 10] || "th"); };
  const LEAD = ["", "", "", "Quick one. ", "Aptitude drill. ", "From a placement paper: ", "Warm-up: ", "Revision set. ", "Timed round. "];
  const fix = (l) => l.replace(/(^|[\s(=])-(?=\d)/g, "$1−");

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("progressions: no clean question found");
    };
  }
  function mk(rng, d, f, ans, wrongs, body) {
    if (!C(ans) || Math.abs(ans) > 1e9) return null;
    const A = f(R(ans)), seen = new Set([A.toLowerCase()]), pairs = [[A, null]];
    const fb = [[ans + 1, "A small arithmetic slip"], [ans - 1, "A small arithmetic slip"], [ans + 2, "A small arithmetic slip"], [ans * 2, "Doubled the correct value"]];
    for (const w of wrongs.concat(fb)) {
      if (pairs.length === 4) break;
      if (!isFinite(w[0]) || !C(w[0]) || Math.abs(w[0]) > 1e9) continue;
      const t = f(R(w[0]));
      if (seen.has(t.toLowerCase())) continue;
      seen.add(t.toLowerCase()); pairs.push([t, w[1]]);
    }
    if (pairs.length < 4) return null;
    const o = QB.options(rng, pairs);
    body.sol = body.sol.map(fix);
    body.q = T(rng, LEAD) + body.q;
    return Object.assign({ d, time: TIME[d] }, body, o, { calc: String(R(ans)) });
  }
  const seqG = (a, r, k) => Array.from({ length: k }, (_, i) => a * Math.pow(r, i)).map((x) => (x < 0 ? "−" + (-x) : String(x))).join(", ");
  const seqText = (a, d, k) => Array.from({ length: k }, (_, i) => a + i * d).join(", ");
  

  /* ------------------------------------------------------------------ 1. AP */
  QB.gen("quant/progressions/ap-nth-term-and-sum", { title: "AP nth term & sum", gen: wrap((rng, d) => {
    if (d === "Easy") {
      const a = rng.int(2, 30), dd = rng.int(2, 12) * (rng.chance(0.2) ? -1 : 1), n = rng.int(8, 45);
      const v = a + (n - 1) * dd; if (v <= 0) return null;
      return mk(rng, d, sN, v, [
        [a + n * dd, "Used n instead of (n − 1) in the formula"],
        [a + (n - 2) * dd, "Used (n − 2) instead of (n − 1)"],
        [n * dd, "Left out the first term"],
        [a * n + dd, "Multiplied the first term by n"],
      ], {
        q: T(rng, [`Find the **${ord(n)}** term of the AP **${seqText(a, dd, 4)}, ...**`, `What is the ${ord(n)} term of the arithmetic progression ${seqText(a, dd, 4)}, ... ?`, `In the AP **${seqText(a, dd, 4)}, ...**, what is the value of the **${ord(n)}** term?`]),
        sol: [`a = ${a}, d = ${dd}, n = ${n}`, `Tₙ = a + (n − 1)d = ${a} + ${n - 1} × (${dd}) = **${v}**`],
        short: `The ${ord(n)} term is ${n - 1} steps after the first: ${a} + ${n - 1}×${dd}.`,
        trap: "There are (n − 1) steps from the first term to the n-th, not n.",
      });
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const a = rng.int(1, 25), dd = rng.int(1, 9), n = rng.int(2, 18) * 2, S = (n * (2 * a + (n - 1) * dd)) / 2;
        return mk(rng, d, sN, S, [
          [n * (2 * a + (n - 1) * dd), "Forgot to halve"],
          [(n * (2 * a + n * dd)) / 2, "Used n instead of (n − 1) in the common-difference term"],
          [(n * (a + (n - 1) * dd)) / 2, "Used a instead of 2a"],
          [n * (a + (n - 1) * dd), "Used a for 2a and forgot to halve"],
        ], {
          q: T(rng, [`Find the sum of the first **${n}** terms of the AP **${seqText(a, dd, 3)}, ...**`, `What is the sum of the first ${n} terms of the arithmetic progression ${seqText(a, dd, 3)}, ... ?`]),
          sol: [`a = ${a}, d = ${dd}, n = ${n}`, `Sₙ = n/2 × [2a + (n − 1)d] = ${n / 2} × [${2 * a} + ${(n - 1) * dd}] = **${S}**`],
          short: `Sum = number of terms × average of first and last = ${n} × (${a} + ${a + (n - 1) * dd}) ÷ 2.`,
          trap: "The formula has 2a inside the bracket, and a ½ outside.",
        });
      }
      if (k === 1) {
        const a = rng.int(2, 30), dd = rng.int(2, 9), n = rng.int(10, 60), l = a + (n - 1) * dd;
        return mk(rng, d, sN, n, [
          [n - 1, "Divided the gap by d but forgot to add 1"],
          [n + 1, "Added 1 twice"],
          [(l - a) / dd + 2, "Added 2 instead of 1"],
          [l / dd, "Divided the last term by d"],
        ], {
          q: T(rng, [`How many terms are there in the AP **${a}, ${a + dd}, ${a + 2 * dd}, ..., ${l}**?`, `The AP **${seqText(a, dd, 3)}, ...** ends at **${l}**. How many terms does it have?`, `Which term of the AP **${seqText(a, dd, 3)}, ...** is equal to **${l}**?`]),
          sol: [`Tₙ = a + (n − 1)d, so ${l} = ${a} + (n − 1) × ${dd}`, `n − 1 = ${l - a} ÷ ${dd} = ${n - 1}, so n = **${n}**`],
          short: "(Last − first) ÷ d + 1.", trap: "Count the first term as well: add 1 after dividing.",
        });
      }
      const a = rng.int(3, 40), dd = rng.int(2, 8), m = rng.int(5, 20), l = a + (m - 1) * dd, S2 = (m * (a + l)) / 2;
      return mk(rng, d, sN, S2, [
        [(m - 1) * (a + l) / 2, "Used one term fewer"],
        [m * (a + l), "Forgot to halve"],
        [((m + 1) * (a + l)) / 2, "Used one term more"],
        [m * l, "Multiplied the last term by the count"],
      ], {
        q: `Find the sum of the series **${a} + ${a + dd} + ${a + 2 * dd} + ... + ${l}**.`,
        sol: [`Number of terms n = (${l} − ${a}) ÷ ${dd} + 1 = ${m}`, `Sum = n/2 × (first + last) = ${m}/2 × (${a} + ${l}) = **${S2}**`],
        short: "Find n first, then n × (first + last) ÷ 2.", trap: "Do not use the last term as if it were n.",
      });
    }
    const k = rng.int(0, 3);
    if (k === 0) {
      const a = rng.int(-10, 25), dd = rng.int(2, 9), p = rng.int(3, 9), q = p + rng.int(3, 8), r = q + rng.int(4, 14);
      const tp = a + (p - 1) * dd, tq = a + (q - 1) * dd, tr = a + (r - 1) * dd;
      return mk(rng, d, sN, tr, [
        [tq + (r - q) * ((tq - tp) / (q - p)) - dd, "Slipped by one step"],
        [tq + (r - p) * dd, "Counted steps from the wrong term"],
        [tq + (tq - tp), "Added the 'gap between the two terms' once"],
        [tr + dd, "Went one term too far"],
      ], {
        q: `In an AP the **${ord(p)}** term is **${tp}** and the **${ord(q)}** term is **${tq}**. Find the **${ord(r)}** term.`,
        sol: [`d = (${tq} − ${tp}) ÷ (${q} − ${p}) = ${dd}`, `T${r} = T${q} + (${r} − ${q}) × ${dd} = ${tq} + ${(r - q) * dd} = **${tr}**`],
        short: "Common difference = difference of terms ÷ difference of positions; then step from the nearest term.",
        trap: "The difference of the two terms is several steps, not one common difference.",
      });
    }
    if (k === 1) {
      const pp = rng.int(2, 8), qq = rng.int(-6, 10), r = rng.int(8, 25), tr = pp * (2 * r - 1) + qq;
      return mk(rng, d, sN, tr, [
        [pp * r * r + qq * r, `Gave S${r} instead of T${r}`],
        [pp * (2 * r + 1) + qq, "Used (2r + 1) instead of (2r − 1)"],
        [pp * (2 * r - 1) - qq, "Flipped the sign of the linear part"],
        [pp * r * r - pp * (r - 1) * (r - 1) + qq * (r - 1), "Subtracted the wrong partial sum"],
      ], {
        q: `The sum of the first n terms of a series is **Sₙ = ${pp}n² ${qq < 0 ? "−" : "+"} ${Math.abs(qq)}n**. Find its **${ord(r)}** term.`,
        sol: [`Tₙ = Sₙ − Sₙ₋₁ = ${pp}(2n − 1) ${qq < 0 ? "−" : "+"} ${Math.abs(qq)}`, `T${r} = ${pp} × ${2 * r - 1} ${qq < 0 ? "−" : "+"} ${Math.abs(qq)} = **${tr}**`],
        short: "Tₙ = Sₙ − Sₙ₋₁, which for pn² + qn simplifies to p(2n − 1) + q.",
        trap: "The sum of n terms is not the n-th term; subtract the sum of the previous (n − 1) terms.",
      });
    }
    if (k === 2) {
      const m = rng.int(3, 12), lo = rng.int(10, 60), hi = lo + m * 0 + rng.int(30, 160);
      const first = Math.ceil(lo / m) * m, last = Math.floor(hi / m) * m; if (last <= first || first === lo || last === hi) return null;
      const n = (last - first) / m + 1, S = (n * (first + last)) / 2;
      return mk(rng, d, sN, S, [
        [(Math.floor(hi / m) - Math.floor(lo / m)) * (first + last) / 2, "Counted one multiple too few"],
        [((n + 1) * (first + last)) / 2, "Counted one multiple too many"],
        [n * (first + last), "Forgot to halve"],
        [(n * (lo + hi)) / 2, "Used the range ends instead of the first and last multiples"],
      ], {
        q: `Find the sum of all multiples of **${m}** between **${lo}** and **${hi}**.`,
        sol: [`First multiple ≥ ${lo} is ${first}; last multiple ≤ ${hi} is ${last}`, `n = (${last} − ${first}) ÷ ${m} + 1 = ${n}`, `Sum = ${n}/2 × (${first} + ${last}) = **${S}**`],
        short: "Locate the first and last multiples inside the range, count them, then n × (first + last) ÷ 2.",
        trap: "The range ends themselves are usually not multiples; use the first and last multiples inside.",
      }) ;
    }
    const a = rng.int(2, 12), dd = rng.int(2, 6), n = rng.int(10, 40), Sn = (n * (2 * a + (n - 1) * dd)) / 2;
    const t = rng.int(3, 8);
    const L = a + (n - 1) * dd; if (n < t * 2) return null;
    const lastT = Array.from({ length: t }, (_, i) => L - i * dd).reduce((x, y) => x + y, 0);
    return mk(rng, d, sN, lastT, [
      [Array.from({ length: t }, (_, i) => a + i * dd).reduce((x, y) => x + y, 0), "Added the first terms instead of the last"],
      [(t * (a + L)) / 2, "Averaged the first and last terms of the whole AP"],
      [lastT + dd * t, "Shifted the block by one position"],
      [t * L, `Took ${t} times the last term`],
    ], {
      q: `An AP has first term **${a}**, common difference **${dd}** and **${n}** terms. Find the sum of its last **${t}** terms.`,
      sol: [`Last term = ${a} + ${n - 1} × ${dd} = ${L}`, `The last ${t} terms form an AP with first term ${L}, difference −${dd}: sum = ${t}/2 × [2×${L} − ${t - 1}×${dd}]`, `= **${lastT}**`],
      short: `Sum of the last ${t} = ${t} × last − d × (1 + 2 + ... + ${t - 1}).`,
      trap: "Count backward from the last term; the difference becomes −d.",
    });
  }) });

  /* ------------------------------------------------------------------ 2. GP */
  const SMALLF = (x) => QB.num(R(x));
  QB.gen("quant/progressions/gp-nth-term-and-sum", { title: "GP nth term & sum, infinite GP", gen: wrap((rng, d) => {
    if (d === "Easy") {
      const r = T(rng, [2, 3, 4, 5, 6]), a = rng.int(1, 20), n = rng.int(4, r === 2 ? 10 : 6), v = a * Math.pow(r, n - 1);
      return mk(rng, d, sN, v, [
        [a * Math.pow(r, n), "Used rⁿ instead of rⁿ⁻¹"],
        [a * r * (n - 1), "Multiplied r by (n − 1) instead of raising it to that power"],
        [a * Math.pow(r, n - 2), "Used rⁿ⁻² instead of rⁿ⁻¹"],
        [a + (n - 1) * r, "Treated the GP as an AP"],
      ], {
        q: T(rng, [`Find the **${ord(n)}** term of the GP **${seqG(a, r, 3)}, ...**`, `What is the ${ord(n)} term of the geometric progression ${seqG(a, r, 3)}, ... ?`, `In the GP **${seqG(a, r, 3)}, ...**, find the **${ord(n)}** term.`]),
        sol: [`a = ${a}, r = ${r}, n = ${n}`, `Tₙ = a·rⁿ⁻¹ = ${a} × ${r}^${n - 1} = **${v}**`],
        short: `Start at ${a}, multiply by ${r} exactly ${n - 1} times.`, trap: "The exponent is (n − 1): the first term has no multiplier.",
      });
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const r = T(rng, [2, 3, 4, 5]), a = rng.int(1, 15), n = rng.int(4, r === 2 ? 9 : 6), S = (a * (Math.pow(r, n) - 1)) / (r - 1);
        return mk(rng, d, sN, S, [
          [(a * (Math.pow(r, n + 1) - 1)) / (r - 1), "Summed one term too many"],
          [(a * (Math.pow(r, n - 1) - 1)) / (r - 1), "Summed one term too few"],
          [a * Math.pow(r, n) - a, "Forgot to divide by (r − 1)"],
          [a * Math.pow(r, n - 1), "Gave only the last term"],
        ], {
          q: T(rng, [`Find the sum of the first **${n}** terms of the GP **${seqG(a, r, 3)}, ...**`, `What is the sum of the first ${n} terms of ${seqG(a, r, 3)}, ... (a geometric progression)?`]),
          sol: [`a = ${a}, r = ${r}, n = ${n}`, `Sₙ = a(rⁿ − 1)/(r − 1) = ${a}(${Math.pow(r, n)} − 1)/${r - 1} = **${S}**`],
          short: "For r > 1 use a(rⁿ − 1)/(r − 1); for r < 1 use a(1 − rⁿ)/(1 − r).", trap: "Do not forget to divide by (r − 1).",
        });
      }
      if (k === 1) {
        const dn = T(rng, [2, 3, 4, 5]), nm = T(rng, [1, 1, 2]), num = nm >= dn ? 1 : nm, mul = rng.int(2, 30) * dn, a = mul;
        const r = num / dn, S = a / (1 - r);
        if (!Number.isInteger(S)) return null;
        return mk(rng, d, sN, S, [
          [a * (1 + r), "Added only the first two terms"],
          [a / r, "Divided by r instead of 1 − r"],
          [a / (1 + r), "Divided by 1 + r"],
          [a * (1 - r), "Multiplied by (1 − r) instead of dividing"],
        ], {
          q: `Find the sum to infinity of the GP **${a}, ${a * r}, ${a * r * r}, ...**`.replace(/(\d+\.\d{3,})/g, (m) => String(R(+m))),
          sol: [`First term a = ${a}, ratio r = ${R(r)} (|r| < 1, so the sum converges)`, `S∞ = a/(1 − r) = ${a} ÷ ${R(1 - r)} = **${S}**`],
          short: "S∞ = a ÷ (1 − r), provided |r| < 1.", trap: "The infinite sum divides by (1 − r), not by r.",
        });
      }
      const r = T(rng, [2, 3]), a = rng.int(2, 6), n = rng.int(5, 9), L = a * Math.pow(r, n - 1);
      return mk(rng, d, sN, n, [
        [n - 1, "Forgot to add 1 after finding the power"],
        [n + 1, "Added 1 twice"],
        [L / a, "Gave the ratio's power rather than the count"],
        [Math.round(L / r), "Divided the last term by r"],
      ], {
        q: `How many terms does the GP **${a}, ${a * r}, ${a * r * r}, ..., ${L}** have?`,
        sol: [`${L} = ${a} × ${r}^(n − 1), so ${r}^(n − 1) = ${L / a}`, `n − 1 = ${n - 1}, so n = **${n}**`],
        short: `Divide last by first (${L / a}) and count how many ${r}s multiply to that, then add 1.`,
        trap: "The power is n − 1, so add 1 to find the number of terms.",
      });
    }
    const k = rng.int(0, 3);
    if (k === 0) {
      const dn = T(rng, [3, 4, 5, 6, 7]), nm = rng.int(1, dn - 1);
      if (QB.gcd(nm, dn) !== 1) return null;
      const a = dn * dn * rng.int(1, 6), S = (a * dn) / (dn - nm);
      if (!Number.isInteger(S)) return null;
      const t3 = a * nm * nm / (dn * dn);
      if (!Number.isInteger(t3)) return null;
      return mk(rng, d, sN, t3, [
        [a * nm / dn, "Gave the second term"],
        [a * Math.pow(nm / dn, 3), "Gave the fourth term"],
        [S * (nm / dn) * (nm / dn), "Used the sum instead of the first term"],
        [a * nm * nm / dn, "Forgot to square the denominator of r"],
      ], {
        q: `The first term of an infinite GP is **${a}** and its sum to infinity is **${S}**. Find the **third** term.`,
        sol: [`S∞ = a/(1 − r), so 1 − r = ${a}/${S}, giving r = ${nm}/${dn}`, `T₃ = a·r² = ${a} × (${nm}/${dn})² = **${t3}**`],
        short: "r = 1 − a/S∞; then T₃ = a r².", trap: "Find r first from the sum; do not use S∞ as the starting term.",
      });
    }
    if (k === 1) {
      const p = rng.int(2, 4), r = T(rng, [2, 3]), a = rng.int(1, 6), i = rng.int(2, 3), j = i + p;
      const ti = a * Math.pow(r, i - 1), tj = a * Math.pow(r, j - 1), tn = a * Math.pow(r, j + 1);
      const ask = T(rng, ["first term", "common ratio", (j + 2) + "th term"]);
      const val = ask === "first term" ? a : ask === "common ratio" ? r : tn;
      return mk(rng, d, sN, val, [
        [ask === "first term" ? ti : ask === "common ratio" ? tj / ti : tj * r, "Gave a neighbouring quantity"],
        [ask === "first term" ? a * r : ask === "common ratio" ? r + 1 : tn * r, "Slipped by one power of r"],
        [ask === "first term" ? ti / r : ask === "common ratio" ? tj / ti / p : tn / r, "Divided by the wrong power"],
        [ask === "first term" ? tj / ti : ask === "common ratio" ? Math.pow(tj / ti, 1 / 2) : tn + tj - ti, "Used the ratio of the terms directly"],
      ], {
        q: `In a GP the **${ord(i)}** term is **${ti}** and the **${ord(j)}** term is **${tj}**. Find the ${ask}.`,
        sol: [`T${j}/T${i} = r^${p} = ${tj / ti}, so r = ${r}`, `a = T${i} ÷ r^${i - 1} = ${a}; T${j + 2} = ${tn}`, `The ${ask} is **${val}**.`],
        short: `Divide the two terms: the ratio is r raised to the gap in positions (${p}).`,
        trap: `The quotient of the two terms is r^${p}, not r.`,
      });
    }
    if (k === 2) {
      const r = T(rng, [-2, -3]), a = rng.int(1, 6), n = rng.int(4, 7), S = (a * (1 - Math.pow(r, n))) / (1 - r);
      return mk(rng, d, sN, S, [
        [(a * (Math.pow(r, n) - 1)) / (r - 1) + 0 === S ? S + 1 : a * (Math.pow(Math.abs(r), n) - 1) / (Math.abs(r) - 1), "Ignored the negative sign of r"],
        [(a * (1 - Math.pow(r, n - 1))) / (1 - r), "Summed one term too few"],
        [a * (1 - Math.pow(r, n)), "Forgot to divide by (1 − r)"],
        [(a * (1 - Math.pow(r, n))) / (1 + r), "Divided by (1 + r)"],
      ], {
        q: `Find the sum of the first **${n}** terms of the GP **${seqG(a, r, 3)}, ...**`,
        sol: [`a = ${a}, r = ${r}`, `Sₙ = a(1 − rⁿ)/(1 − r) = ${a}(1 − (${r})^${n}) / ${1 - r} = **${S}**`],
        short: "With a negative ratio the terms alternate in sign; use a(1 − rⁿ)/(1 − r) with the sign kept.",
        trap: "(−2)ⁿ is negative when n is odd; keep the sign inside the power.",
      });
    }
    // recurring decimal as infinite GP
    const dg = rng.int(1, 8), d2 = rng.int(1, 9);
    const num = 10 * dg + d2, den = 99;
    if (dg === d2) return null;
    const g = QB.gcd(num, den), sn = num / g, sd = den / g;
    const f = (x) => x;
    const ans = num / den;
    const cand = [[`${sn}/${sd}`, null], [`${num}/${den + 1}`, "Divided by 100 instead of 99"], [`${num}/100`, "Treated the repeating part as a terminating decimal"], [`${dg}/${den - 9}`, "Used only the first digit"], [`${d2}${dg}/${den}`, "Reversed the repeating digits"]];
    const seen = new Set(), pairs = [];
    for (const c of cand) { const v = c[0]; if (seen.has(v) || pairs.length === 4) continue; seen.add(v); pairs.push(c); }
    const vals = pairs.map((p) => { const [x, y] = p[0].split("/").map(Number); return x / y; });
    if (pairs.length < 4 || new Set(vals.map((v) => Math.round(v * 1e9))).size < 4) return null;
    const o = QB.options(rng, pairs);
    return Object.assign({ d, time: TIME[d], q: `Express the recurring decimal **0.${dg}${d2}${dg}${d2}${dg}${d2}...** (that is, 0.̅${dg}${d2}) as a fraction in lowest terms.`,
      sol: [`0.${dg}${d2}${dg}${d2}... = ${num}/100 + ${num}/10000 + ... , an infinite GP with a = ${num}/100 and r = 1/100`, `S∞ = (${num}/100) ÷ (99/100) = ${num}/99 = **${sn}/${sd}**`],
      short: "A two-digit repeating block ab gives the fraction ab/99, then reduce.", trap: "Use 99 for a two-digit repeat (not 100), and keep the digit order." }, o, { calc: String(ans) });
  }) });

  /* ------------------------------------------------------------------ 3. word problems */
  QB.gen("quant/progressions/word-problems", { title: "Word problems (growing savings)", gen: wrap((rng, d) => {
    const nm = T(rng, NAMES);
    if (d === "Easy") {
      const k = rng.int(0, 1);
      if (k === 0) {
        const a = rng.int(2, 10) * 100, dd = rng.int(1, 5) * 50, n = rng.int(6, 14), v = a + (n - 1) * dd;
        return mk(rng, d, M, v, [
          [a + n * dd, "Added the increase n times instead of (n − 1)"],
          [a + (n - 2) * dd, "Added the increase one time too few"],
          [(n * (2 * a + (n - 1) * dd)) / 2, "Gave the total saved instead of the last month's saving"],
          [a * n, "Ignored the monthly increase"],
        ], {
          q: `${nm} saves **${M(a)}** in the first month and **${M(dd)}** more each month than in the previous one. How much does ${nm} save in month **${n}**?`,
          sol: [`This is an AP: a = ${a}, d = ${dd}`, `T${n} = ${a} + ${n - 1} × ${dd} = **${M(v)}**`],
          short: "n-th term = first + (n − 1) × increase.", trap: "Month 1 has no increase, so there are (n − 1) increases by month n.",
        });
      }
      const a = rng.int(5, 20), dd = rng.int(2, 5), n = rng.int(6, 14), S = (n * (2 * a + (n - 1) * dd)) / 2;
      return mk(rng, d, QB.num, S, [
        [n * a + dd * n * (n - 1), "Doubled the extra seats"],
        [(n * (2 * a + n * dd)) / 2, "Used n instead of (n − 1)"],
        [n * (a + (n - 1) * dd), "Forgot to halve"],
        [a + (n - 1) * dd, "Gave only the last row"],
      ], {
        q: `In a lecture hall the first row has **${a}** seats and each next row has **${dd}** more seats than the row in front of it. How many seats are there in **${n}** rows?`,
        sol: [`AP with a = ${a}, d = ${dd}, n = ${n}`, `S = n/2 × [2a + (n − 1)d] = ${n}/2 × [${2 * a} + ${(n - 1) * dd}] = **${S}**`],
        short: "Total = rows × average of first and last row.", trap: "The last row, not the total, is a + (n − 1)d.",
      });
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const a = rng.int(2, 8) * 100, dd = rng.int(1, 6) * 100 / 2, n = rng.int(8, 20), S = (n * (2 * a + (n - 1) * dd)) / 2;
        return mk(rng, d, M, S, [
          [n * a + dd * n * (n - 1), "Doubled the extra amounts"],
          [(n * (2 * a + n * dd)) / 2, "Used n instead of (n − 1)"],
          [n * (a + (n - 1) * dd), "Forgot to halve"],
          [a + (n - 1) * dd, "Gave only the last month's saving"],
        ], {
          q: `${nm} starts saving **${M(a)}** in January and raises the monthly saving by **${M(dd)}** every month. How much does ${nm} save in total over the first **${n}** months?`,
          sol: [`AP with a = ${a}, d = ${dd}, n = ${n}`, `S = ${n}/2 × [2×${a} + ${n - 1}×${dd}] = **${M(S)}**`],
          short: "Total = n × (first month + last month) ÷ 2.", trap: "Total saving is a sum of n terms, not the n-th term.",
        });
      }
      if (k === 1) {
        const a = rng.int(1, 4) * 1000, r = T(rng, [2, 3]), n = rng.int(3, 6), v = a * Math.pow(r, n);
        return mk(rng, d, QB.num, v, [
          [a * Math.pow(r, n - 1), "Applied the growth one time too few"],
          [a * Math.pow(r, n + 1), "Applied the growth one time too many"],
          [a + a * r * n, "Treated growth as repeated addition"],
          [a * r * n, "Multiplied by r × n"],
        ], {
          q: `A colony of **${QB.num(a)}** bacteria ${r === 2 ? "doubles" : "triples"} every hour. How many bacteria are there after **${n}** hours?`,
          sol: [`GP: starts at ${QB.num(a)}, ratio ${r}`, `After ${n} hours: ${QB.num(a)} × ${r}^${n} = **${QB.num(v)}**`],
          short: `Multiply by ${r} once per hour: ${r}^${n} = ${Math.pow(r, n)}.`, trap: `${r}${n} is not the growth; the factor is ${r} raised to the power ${n}.`,
        });
      }
      const n = rng.int(4, 12), a = rng.int(1, 5) * 100, dd = rng.int(1, 4) * 100;
      const S = (n * (2 * a + (n - 1) * dd)) / 2; // find n from S
      return mk(rng, d, QB.num, n, [
        [n - 1, "Stopped one month early"],
        [n + 1, "Went one month too far"],
        [Math.round(S / (a + dd)), "Divided by an average-looking amount"],
        [2 * n, "Mistook the quadratic's other factor for the answer"],
      ], {
        q: `${nm} saves **${M(a)}** in month 1, **${M(a + dd)}** in month 2, **${M(a + 2 * dd)}** in month 3 and so on, adding **${M(dd)}** more every month. After how many months will the total saved be exactly **${M(S)}**?`,
        sol: [`S = n/2 × [2×${a} + (n − 1)×${dd}] = ${S}`, `${dd}n² + ${2 * a - dd}n − ${2 * S} = 0`, `Try n = ${n}: ${n}/2 × [${2 * a} + ${(n - 1) * dd}] = ${S} ✓. So n = **${n}**`],
        short: "Plug the options into the sum formula; the one that gives the total is the answer.",
        trap: "A quadratic gives two roots: reject the negative one and check the positive one by substitution.",
      });
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      const fr = T(rng, [[1, 2], [2, 3], [3, 4], [3, 5], [1, 3], [4, 5]]), H = rng.int(2, 12) * 5 * fr[1];
      const [p, q] = fr, tot = H * (q + p) / (q - p);
      if (!Number.isInteger(tot)) return null;
      return mk(rng, d, QB.num, tot, [
        [H / (1 - p / q), "Counted only the downward drops (a single infinite GP)"],
        [H * (1 + p / q), "Added only the first bounce"],
        [H * (q + p) / q , "Used 1 + r with no infinite sum"],
        [2 * H / (1 - p / q) - 0 === tot ? tot + 5 : 2 * H / (1 - p / q) , "Doubled the drops without removing the first"],
      ], {
        q: `A ball is dropped from a height of **${H} m**. After each bounce it rises to **${p}/${q}** of the height it fell from. Find the total vertical distance it travels before coming to rest, in metres.`,
        sol: [`Down: ${H} + ${H}r + ${H}r² + ... = H/(1 − r) with r = ${p}/${q}; up (after the first drop): Hr + Hr² + ... = Hr/(1 − r)`, `Total = H(1 + r)/(1 − r) = ${H} × (${q + p}/${q}) ÷ (${q - p}/${q}) = **${tot}** m`],
        short: "Total = H(1 + r)/(1 − r): every bounce is travelled twice, the first drop once.",
        trap: "Each bounce is climbed and descended, so it counts twice; the very first drop counts once.",
      });
    }
    if (k === 1) {
      const n = rng.int(10, 24), a = rng.int(40, 90) , dd = rng.int(1, 4), tp = a + (n - 1) * dd;
      // pile of pipes: bottom row b, each row above has one fewer, down to top row t
      const b = rng.int(14, 40), t = rng.int(2, 8), rows = b - t + 1, tot = (rows * (b + t)) / 2;
      return mk(rng, d, QB.num, tot, [
        [(rows - 1) * (b + t) / 2, "Counted one row too few"],
        [rows * (b + t), "Forgot to halve"],
        [((rows + 1) * (b + t)) / 2, "Counted one row too many"],
        [(b - t) * (b + t) / 2, "Used the difference b − t as the number of rows"],
      ], {
        q: `Pipes are stacked in rows: the bottom row has **${b}** pipes and each row above has one pipe fewer than the row below, up to a top row of **${t}** pipes. How many pipes are in the stack?`,
        sol: [`Rows: ${b}, ${b - 1}, ..., ${t}: number of rows = ${b} − ${t} + 1 = ${rows}`, `Total = ${rows}/2 × (${b} + ${t}) = **${tot}**`],
        short: "Count rows as (bottom − top + 1), then rows × (bottom + top) ÷ 2.", trap: "From 12 down to 5 is 8 rows (12 − 5 + 1), not 7.",
      });
    }
    const X = rng.int(5, 400) * 100, n = Math.ceil(Math.log2(X + 1));
    if (X < 2000) return null;
    const total = (m) => Math.pow(2, m) - 1;
    if (total(n - 1) >= X || total(n) < X) return null;
    return mk(rng, d, QB.num, n, [
      [n - 1, "Stopped one day early: that total is still below the target"],
      [n + 1, "Went one day too far"],
      [Math.round(Math.log2(X)), "Compared a single day's amount with the target"],
      [Math.floor(X / 2), "Divided the target by 2"],
    ], {
      q: `${nm} saves **₹1** on day 1, **₹2** on day 2, **₹4** on day 3, doubling the amount every day. On which day will the total saved first reach or cross **${M(X)}**?`,
      sol: [`After n days the total is 2ⁿ − 1 (a GP with a = 1, r = 2)`, `2ⁿ − 1 ≥ ${X}: 2^${n - 1} − 1 = ${QB.num(total(n - 1))} < ${QB.num(X)} and 2^${n} − 1 = ${QB.num(total(n))} ≥ ${QB.num(X)}`, `So the day is **${n}**.`],
      short: "Total after n days = 2ⁿ − 1; find the first power of 2 above the target + 1.",
      trap: "The amount saved on day n and the total saved up to day n are different; the target is on the total.",
    });
  }) });
})();
