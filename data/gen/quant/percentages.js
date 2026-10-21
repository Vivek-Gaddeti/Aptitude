/* =====================================================================
   Percentages: ten question generators (one per catalog pattern).
   Every generator supports Easy / Medium / Hard, keeps answers clean,
   and builds each wrong option from a real mistake (with a "why" text).
   ===================================================================== */
(function () {
  const M = (x) => QB.money(x), N = (x) => QB.num(x), P = (x) => QB.pct(x);
  const R = (x) => QB.round(x, 2);
  const C = (x) => isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;   // at most 2 decimals
  const I = Number.isInteger;
  const sg = (x) => (x < 0 ? "−" + P(R(-x)) : P(R(x)));                              // signed percent: −9% / 12%
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 95 };

  // try again (with fresh random numbers) until the builder returns a clean question
  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("percentages: no clean question found");
    };
  }
  // ans = correct value, wrongs = [[value, why], ...] in priority order, f = formatter
  function mk(rng, f, ans, wrongs, extra, signed) {
    if (!C(ans)) return null;
    const A = f(R(ans));
    const seen = new Set([A.toLowerCase()]);
    const pairs = [[A, null]];
    for (const w of wrongs) {
      if (pairs.length === 4) break;
      const v = w[0];
      if (!isFinite(v) || (!signed && v <= 0)) continue;
      const t = f(R(v));
      if (seen.has(t.toLowerCase()) || /NaN|undefined|Infinity/.test(t)) continue;
      seen.add(t.toLowerCase());
      pairs.push([t, w[1]]);
    }
    if (pairs.length < 4) return null;
    const o = QB.options(rng, pairs);
    return Object.assign({ time: TIME[extra.d] }, extra, o, { calc: String(R(ans)) });
  }
  const finish = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });

  /* ------------------------------------------------------------------ 1. % of a number, % <-> fraction */
  const HINT = { 5: "5% is half of 10%", 10: "10% is the decimal point moved one place", 15: "15% = 10% + 5%", 20: "20% is double 10%", 25: "25% is one quarter", 30: "30% is three times 10%", 40: "40% is four times 10%", 60: "60% is six times 10%", 75: "75% is three quarters" };
  const QUART = { 25: "a quarter", 50: "half", 75: "three quarters", 20: "one fifth", 40: "two fifths", 10: "one tenth", 30: "three tenths", 60: "three fifths", 80: "four fifths" };
  const FR = [[3, 8], [5, 8], [7, 8], [3, 16], [9, 16], [7, 16], [3, 40], [11, 40], [17, 40], [7, 25], [13, 20], [9, 20], [3, 25], [19, 25], [7, 50], [11, 25], [13, 40], [1, 8], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [9, 10], [1, 16], [5, 16], [11, 16], [13, 16], [15, 16], [1, 20], [3, 20], [1, 25], [2, 25], [1, 40], [1, 50]];
  QB.gen("quant/percentages/percent-of", { title: "% of a number & % ↔ fraction", gen: wrap((rng, d) => {
    if (d === "Easy") {
      const p = T(rng, [5, 10, 15, 20, 25, 30, 40, 60, 75]), b = T(rng, [40, 60, 80, 100, 120, 150, 160, 200, 240, 250, 300, 360, 400, 480, 500, 600, 640, 720, 800, 900, 1200, 1500]);
      const a = b * p / 100, t = rng.int(0, 4);
      let f = N, q;
      if (t === 0) q = `What is **${p}%** of **${N(b)}**?`;
      else if (t === 1) q = `In a class of **${b}** students, **${p}%** are girls. How many girls are in the class?`;
      else if (t === 2) { f = M; q = `A shirt marked at **${M(b)}** is sold at a **${p}%** discount. How much is the discount, in rupees?`; }
      else if (t === 3) q = `Calculate **${p}%** of **${N(b)}**.`;
      else q = `A library has **${N(b)}** books and **${p}%** of them are in Hindi. How many books are in Hindi?`;
      return mk(rng, f, a, [
        [b - a, `That is what is left after taking ${p}% away, not the ${p}% itself`],
        [a * 10, "Moved the decimal point one place too far to the right"],
        [a / 10, "Moved the decimal point one place too far to the left"],
        [b / p, `Divided by ${p} instead of multiplying by ${p}/100`],
      ], finish(d, q,
        [`${p}% means ${p} out of every 100, so ${p}% of ${N(b)} = ${p}/100 × ${N(b)}`, `= **${f(a)}**`],
        `10% of ${N(b)} is ${N(b / 10)}; ${HINT[p]}. So the answer is ${f(a)}.`,
        `Do not subtract: ${f(b - a)} is what remains, while the question asks for the ${p}% part itself.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const p = T(rng, [12.5, 37.5, 62.5, 87.5, 35, 45, 85, 16, 12, 18, 24, 36, 72, 125, 15, 30, 60, 65, 55, 95, 8, 110, 150]), b = rng.int(2, 160) * 20, a = b * p / 100;
        if (!I(a)) return null;
        const small = { 12.5: "1/8", 37.5: "3/8", 62.5: "5/8", 87.5: "7/8", 125: "5/4" }[p];
        return mk(rng, N, a, [
          [a * 10, "Moved the decimal point one place too far to the right"],
          [a / 10, "Moved the decimal point one place too far to the left"],
          [b - a, `Gave what is left after removing ${p}%`],
          [b / p, `Divided by ${p} instead of multiplying by ${p}/100`],
        ], finish(d, `Find **${p}%** of **${N(b)}**.`,
          [`${p}% = ${p}/100`, `${p}/100 × ${N(b)} = **${N(a)}**`],
          small ? `${p}% = ${small}, so take ${small} of ${N(b)} = ${N(a)}.` : `Find 10% (${N(b / 10)}) and 1% (${N(b / 100)}) first, then add the right pieces.`,
          `A slipped decimal gives ${N(a * 10)} or ${N(R(a / 10))}: check that the answer is sensible (${p}% should be ${p < 100 ? "less than" : "more than"} the number).`));
      }
      if (k === 1) {
        const [n, dn] = T(rng, FR), a = 100 * n / dn;
        return mk(rng, P, a, [
          [a / 10, "Put the decimal point one place too far to the left"],
          [100 * dn / n, "Turned the fraction upside down before converting"],
          [100 - a, "Found the percentage of the remaining part"],
          [n * dn, "Multiplied numerator and denominator instead of dividing"],
        ], finish(d, `Express **${n}/${dn}** as a percentage.`,
          [`n/d × 100 = ${n}/${dn} × 100`, `100 ÷ ${dn} = ${R(100 / dn)}, and ${R(100 / dn)} × ${n} = **${P(R(a))}**`],
          `Learn the unit fractions (1/8 = 12.5%, 1/16 = 6.25%, 1/20 = 5%, 1/40 = 2.5%) and multiply by the numerator.`,
          `The percentage of ${n}/${dn} is not ${dn}/${n}: keep the numerator on top.`));
      }
      // x% of y = y% of x
      const p = T(rng, [16, 24, 32, 36, 44, 52, 64, 28, 48, 56, 68, 84, 12, 18, 20, 40, 60, 72, 76, 80, 88, 92, 96]), q = T(rng, [25, 50, 75, 20, 40, 10, 30, 60, 80]);
      const a = p * q / 100;
      return mk(rng, N, a, [
        [a * 10, "Moved the decimal point one place too far to the right"],
        [a / 10, "Moved the decimal point one place too far to the left"],
        [p - a, `Subtracted the answer from ${p}`],
        [q - a, `Subtracted the answer from ${q}`],
      ], finish(d, `Find **${p}%** of **${q}**.`,
        [`x% of y = y% of x, so ${p}% of ${q} = ${q}% of ${p}`, `${q}% of ${p} = ${q}/100 × ${p} = **${N(a)}**`],
        `Swap them: ${q}% of ${p} is easier, since ${q}% is ${QUART[q]}. ${q}% of ${p} = ${N(a)}.`,
        `Both versions give the same answer, so pick the one with the friendlier base.`));
    }
    // Hard
    const k = rng.int(0, 2);
    if (k === 0) {
      const p1 = T(rng, [12, 15, 18, 20, 25, 35, 45, 60, 65, 75]), p2 = T(rng, [12, 15, 18, 20, 25, 35, 45, 60, 65, 75]);
      const n1 = rng.int(2, 24) * 20, n2 = rng.int(2, 24) * 20;
      const a1 = n1 * p1 / 100, a2 = n2 * p2 / 100;
      if (!I(a1) || !I(a2) || p1 === p2) return null;
      return mk(rng, N, a1 + a2, [
        [Math.abs(a1 - a2), "Subtracted the two parts instead of adding them"],
        [(a1 + a2) * 10, "Moved the decimal point one place too far to the right"],
        [(p1 + p2) * (n1 + n2) / 100, "Added the percentages and the bases separately, then multiplied"],
        [a1 + a2 + (a1 + a2) / 10, "Added an extra 10% of the total"],
      ], finish(d, `Find the value of **${p1}% of ${N(n1)} + ${p2}% of ${N(n2)}**.`,
        [`${p1}% of ${N(n1)} = ${N(a1)}`, `${p2}% of ${N(n2)} = ${N(a2)}`, `Sum = ${N(a1)} + ${N(a2)} = **${N(a1 + a2)}**`],
        `Do each part with the 10% method, then add. Never merge the two percentages: they have different bases.`,
        `${p1}% + ${p2}% = ${p1 + p2}% only works when both are percentages of the same number.`));
    }
    if (k === 1) {
      const p1 = T(rng, [10, 20, 25, 30, 40, 50, 60, 75, 80]), p2 = T(rng, [10, 20, 25, 30, 40, 50, 60, 75, 80]), b = rng.int(1, 40) * 100;
      const a = b * p1 * p2 / 10000;
      if (!C(a)) return null;
      return mk(rng, N, a, [
        [b * (p1 + p2) / 100, "Added the two percentages instead of chaining them"],
        [b * p1 / 100, `Stopped after the first step (${p1}% of ${N(b)})`],
        [b * p1 * p2 / 100, "Forgot to divide by 100 the second time"],
        [b * Math.min(p1, p2) / 100, "Used only the smaller percentage"],
      ], finish(d, `What is **${p1}% of ${p2}% of ${N(b)}**?`,
        [`${p2}% of ${N(b)} = ${N(b * p2 / 100)}`, `${p1}% of ${N(b * p2 / 100)} = **${N(a)}**`],
        `Multiply the two fractions: ${p1}/100 × ${p2}/100 = ${R(p1 * p2 / 100)}%, then take that % of ${N(b)}.`,
        `"% of % of" means multiply, not add: ${p1}% of ${p2}% is ${R(p1 * p2 / 100)}%, not ${p1 + p2}%.`));
    }
    const p = T(rng, [10, 15, 20, 25, 30, 40, 60, 75]), q = T(rng, [25, 30, 35, 40, 45, 50, 60, 75, 80]), b = rng.int(2, 30) * 20;
    const x = q * b / p;
    if (p === q || !I(x)) return null;
    return mk(rng, N, x, [
      [p * b / q, "Inverted the ratio of the two percentages"],
      [q * b / 100, `Worked out ${q}% of ${N(b)} but never found the unknown number`],
      [b, "Assumed both numbers are equal"],
      [p * b / 100, `Worked out ${p}% of ${N(b)} by mistake`],
    ], finish(d, `If **${p}%** of a number is equal to **${q}%** of **${N(b)}**, find the number.`,
      [`${q}% of ${N(b)} = ${N(q * b / 100)}`, `So ${p}% of the number = ${N(q * b / 100)}`, `Number = ${N(q * b / 100)} × 100/${p} = **${N(x)}**`],
      `p% of A = q% of B means A : B = q : p. Here A = ${N(b)} × ${q}/${p} = ${N(x)}.`,
      `The smaller percentage must go with the bigger number. Check: ${p}% of ${N(x)} should equal ${q}% of ${N(b)}.`));
  }) });

  /* ------------------------------------------------------------------ 2. percentage change */
  const UP = [
    (o, n) => `The price of a book rose from **${M(o)}** to **${M(n)}**. What is the percentage increase?`,
    (o, n) => `A town's population grew from **${N(o)}** to **${N(n)}**. Find the percentage increase.`,
    (o, n) => `Riya's score went up from **${o}** marks to **${n}** marks in a retest. What is the percentage increase in her marks?`,
    (o, n) => `A mobile plan that cost **${M(o)}** a month now costs **${M(n)}**. By what percent has it gone up?`,
    (o, n) => `Last year a shop's monthly sales were **${M(o)}**; this year they are **${M(n)}**. Find the percentage increase.`,
    (o, n) => `The number of members in a library grew from **${N(o)}** to **${N(n)}**. What is the percentage growth?`,
  ];
  const DOWN = [
    (o, n) => `The price of a bag was cut from **${M(o)}** to **${M(n)}**. What is the percentage decrease?`,
    (o, n) => `A college's intake fell from **${o}** seats to **${n}** seats. Find the percentage decrease.`,
    (o, n) => `A factory's daily output dropped from **${N(o)}** units to **${N(n)}** units. What is the percentage decrease?`,
    (o, n) => `A household's electricity bill came down from **${M(o)}** to **${M(n)}**. By what percent did it fall?`,
    (o, n) => `Last month a cab's fare was **${M(o)}**; this month it is **${M(n)}**. By what percent did the fare drop?`,
    (o, n) => `The number of visitors to a park fell from **${N(o)}** to **${N(n)}**. What is the percentage decrease?`,
  ];
  function changeQ(rng, d, o, n, dir, r) {
    const pool = dir > 0 ? UP : DOWN, diff = Math.abs(n - o), q = pool[rng.int(0, pool.length - 1)](o, n);
    const word = dir > 0 ? "increase" : "decrease";
    return mk(rng, P, r, [
      [diff / n * 100, `Divided the change by the new value (${n}) instead of the original (${o})`],
      [diff, `Quoted the raw change (${diff}) as if it were a percentage`],
      [dir > 0 ? 100 + r : 100 - r, `Gave new ÷ original × 100 (${dir > 0 ? 100 + r : 100 - r}%), which is not the change`],
      [r * 2, "Doubled the correct figure"],
    ], finish(d, q,
      [`Change = |${n} − ${o}| = ${diff}`,
        `% ${word} = change ÷ **original** × 100 = ${diff}/${o} × 100 = **${P(R(r))}**`],
      `Reduce change/original to a simple fraction: ${QB.frac(diff, o)} = ${P(R(r))}.`,
      `The base is always the starting value (${o}). Dividing by ${n} would give ${P(R(diff / n * 100))}, which is wrong.`));
  }
  QB.gen("quant/percentages/pct-change", { title: "Percentage change", gen: wrap((rng, d) => {
    const dir = rng.chance(0.5) ? 1 : -1;
    if (d === "Easy") {
      const r = T(rng, [5, 10, 15, 20, 25, 30, 40, 50, 60, 75]), o = T(rng, [40, 50, 60, 80, 100, 120, 150, 160, 200, 240, 250, 300, 360, 400, 480, 500, 600]);
      const n = o * (1 + dir * r / 100);
      if (!I(n) || dir < 0 && r === 100) return null;
      return changeQ(rng, d, o, n, dir, r);
    }
    if (d === "Medium") {
      const r = T(rng, [12.5, 16, 24, 36, 37.5, 60, 75, 40, 15, 35, 45, 80, 8, 12]), o = rng.int(2, 30) * 40;
      const n = o * (1 + dir * r / 100);
      if (!I(n)) return null;
      return changeQ(rng, d, o, n, dir, r);
    }
    if (rng.chance(0.5)) {
      // percentage points vs relative change
      const p1 = T(rng, [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 64, 70, 75, 80, 90]), p2 = p1 + T(rng, [5, 10, 15, 20, 25]);
      if (p2 > 95) return null;
      const r = (p2 - p1) / p1 * 100;
      return mk(rng, P, r, [
        [p2 - p1, `Gave the rise in percentage points (${p2} − ${p1}), not the percent increase`],
        [(p2 - p1) / p2 * 100, `Divided by this year's rate (${p2}%) instead of last year's (${p1}%)`],
        [p2 / p1 * 100, "Gave new rate ÷ old rate × 100 instead of the change"],
        [r / 2, "Halved the correct figure"],
      ], finish(d, T(rng, [`In an entrance test, **${p1}%** of candidates passed last year and **${p2}%** passed this year. By what percent has the pass rate increased?`, `In a district exam, **${p1}%** of candidates passed last year and **${p2}%** passed this year. By what percent has the pass rate increased?`, `A coaching centre reports that **${p1}%** of its students passed last year and **${p2}%** passed this year. By what percent has the pass rate gone up?`]),
        [`Rise in points = ${p2} − ${p1} = ${p2 - p1} percentage points`, `Relative increase = ${p2 - p1}/${p1} × 100 = **${P(R(r))}**`],
        `"Percent increase" compares the two rates: (${p2} − ${p1})/${p1} = ${QB.frac(p2 - p1, p1)}.`,
        `${p2 - p1} is a rise of ${p2 - p1} percentage points. A percent increase is measured against ${p1}%, so it is ${P(R(r))}.`));
    }
    const x = rng.int(2, 40) * 100, item2 = T(rng, ["laptop bag", "water purifier", "bicycle", "steel almirah"]), r1 = T(rng, [10, 15, 20, 25, 30, 35, 40, 50, 60, 75]), r2 = T(rng, [10, 15, 20, 25, 30, 35, 40, 50, 60, 75]);
    const y = x * (1 + r1 / 100), z = y * (1 - r2 / 100), ov = (z - x) / x * 100;
    if (!I(y) || !I(z) || ov === 0) return null;
    if (Math.abs((z - x) / z * 100 - ov) < 0.5 || Math.abs((z - y) / y * 100 - ov) < 0.5) return null;   // keep every wrong option clearly apart from the answer
    const lbl = ov < 0 ? "fall" : "rise";
    return mk(rng, sg, ov, [
      [r1 - r2, `Added the two percent changes (${r1} − ${r2}) without noticing the second one works on a new base`],
      [(z - x) / z * 100, `Divided by the final value (${M(z)}) instead of the original (${M(x)})`],
      [-ov, `Got the direction the wrong way round`],
      [(z - y) / y * 100, "Gave only the second change"],
    ], finish(d, `The price of a ${item2} was **${M(x)}**. It was raised to **${M(y)}** in the festival season, and later reduced to **${M(z)}**. What is the overall percentage change from the original price? (Write a fall as a negative value.)`,
      [`Overall change = ${M(z)} − ${M(x)} = ${M(z - x)}`, `Percent = (${z - x})/${x} × 100 = **${sg(ov)}**`],
      `Skip the middle step: compare final with the first price only. ${QB.frac(z - x, x)} = ${sg(ov)}.`,
      `The two percent changes (${r1}% up, ${r2}% down) have different bases, so they cannot be added or subtracted directly: overall it is a ${lbl} of ${P(R(Math.abs(ov)))}.`),
      true);
  }) });

  /* ------------------------------------------------------------------ 3. base change */
  const PAIRS = [["Ravi's salary", "Sunil's salary"], ["Tower P's height", "Tower Q's height"], ["Priya's marks", "Kavya's marks"], ["Plant X's output", "Plant Y's output"], ["Asha's savings", "Bala's savings"], ["Hostel A's fee", "Hostel B's fee"], ["Mohan's weight", "Naveen's weight"], ["Shop M's turnover", "Shop N's turnover"], ["Zoya's speed", "Yash's speed"], ["Bus route 1's fare", "Bus route 2's fare"], ["Dev's pocket money", "Esha's pocket money"], ["Library X's collection", "Library Y's collection"]];
  const LEAD = [(a, b, x, w) => `${a} is **${x}% ${w}** than ${b}.`, (a, b, x, w) => `Compared with ${b}, ${a} is **${x}% ${w}**.`, (a, b, x, w) => `It is known that ${a} is **${x}% ${w}** than ${b}.`];
  const lessOf = (x) => 100 * x / (100 + x), moreOf = (x) => 100 * x / (100 - x);
  QB.gen("quant/percentages/base-change", { title: "A is x% more than B, so B is ?% less", gen: wrap((rng, d) => {
    const [a, b] = T(rng, PAIRS);
    if (d === "Easy" || d === "Medium") {
      const more = rng.chance(0.5);
      const x = d === "Easy" ? (more ? T(rng, [25, 100, 150, 300, 400, 900, 60]) : T(rng, [20, 50, 60, 75, 80, 37.5, 12.5])) : T(rng, [10, 15, 20, 24, 30, 35, 40, 45, 50, 60, 70, 75, 80, 90, 120, 125, 140, 160, 175, 200, 250, 350, 500, 12, 16, 28, 32, 36, 44, 48, 56, 64, 72, 84, 96, 108, 112, 132, 144, 150, 180, 225, 275, 300, 450]);
      const ans = more ? lessOf(x) : moreOf(x);
      if (!C(ans) || !(x < 100 || more)) return null;
      const hi = more ? 100 + x : 100, lo = more ? 100 : 100 - x, g = QB.gcd(hi, lo);
      const A = (more ? 100 + x : 100) / g, B = (more ? 100 : 100 - x) / g;     // A : B reduced, where A is the bigger
      const flip = more ? moreOf(x) : lessOf(x);
      const lead = LEAD[rng.int(0, 2)](a, b, x, more ? "more" : "less");
      const q = more ? `${lead} ${rng.chance(0.5) ? `${b} is what percent **less** than ${a}?` : `By what percent is ${b} **less** than ${a}?`}`
        : `${lead} ${rng.chance(0.5) ? `${b} is what percent **more** than ${a}?` : `By what percent is ${b} **more** than ${a}?`}`;
      const bigName = more ? a : b, smallName = more ? b : a;
      return mk(rng, P, ans, [
        [x, `Assumed the percent is the same in both directions`],
        [flip, `Used the formula for the opposite case (the base is the wrong one)`],
        [100 - x, `Took the “remaining” percent instead of the gap`],
        [x / 2, "Averaged the two bases"],
        [100 - ans, "Gave the complement of the answer"],
      ], finish(d, q,
        more ? [`Take ${b} = 100. Then ${a} = ${100 + x}.`, `${b} is less than ${a} by ${x} out of ${100 + x}: ${x}/${100 + x} × 100 = **${P(R(ans))}**`]
          : [`Take ${b} = 100. Then ${a} = ${100 - x}.`, `${b} is more than ${a} by ${x} out of ${100 - x}: ${x}/${100 - x} × 100 = **${P(R(ans))}**`],
        `Ratio ${bigName.split("'")[0]} : ${smallName.split("'")[0]} = ${A} : ${B}. The gap ${A - B} is measured on ${more ? A : B} here: ${A - B}/${more ? A : B} = ${P(R(ans))}.`,
        `“More” and “less” use different bases (the one being compared with), so the two percents are never equal.`));
    }
    const kind = rng.int(0, 1);
    if (kind === 0) {
      const lo = rng.int(4, 40) * 5, hi = lo + T(rng, [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 100]);
      const who = T(rng, [["Neha", "Om"], ["Isha", "Jay"], ["Tara", "Uday"], ["Kiran", "Lata"], ["Sameer", "Dipa"], ["Gita", "Harsh"], ["Vikram", "Meera"]]), u = T(rng, ["marks", "runs", "points"]);
      const lessQ = rng.chance(0.5), ans = lessQ ? (hi - lo) / hi * 100 : (hi - lo) / lo * 100;
      const base = lessQ ? hi : lo;
      const q = lessQ ? `${who[0]} scored **${lo}** ${u} and ${who[1]} scored **${hi}** ${u}. ${who[0]}'s ${u} are what percent **less** than ${who[1]}'s?`
        : `${who[0]} scored **${lo}** ${u} and ${who[1]} scored **${hi}** ${u}. ${who[1]}'s ${u} are what percent **more** than ${who[0]}'s?`;
      return mk(rng, P, ans, [
        [(hi - lo) / (lessQ ? lo : hi) * 100, `Divided the gap by ${lessQ ? lo : hi}, the wrong person's marks`],
        [hi - lo, "Gave the difference in marks as a percent"],
        [lo / hi * 100, `Found ${who[0]}'s marks as a percent of ${who[1]}'s, not the gap`],
        [hi / lo * 100 - 100, `Used the other base`],
      ], finish(d, q,
        [`Gap = ${hi} − ${lo} = ${hi - lo}`, `The comparison is with ${lessQ ? who[1] : who[0]} (${base}), so ${hi - lo}/${base} × 100 = **${P(R(ans))}**`],
        `Gap ÷ the number after “than”: ${QB.frac(hi - lo, base)} = ${P(R(ans))}.`,
        `Always divide by the number that comes after “than”.`));
    }
    const p = T(rng, [5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80, 90]), q2 = T(rng, [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90]);
    if (q2 <= p) return null;
    const moreQ = rng.chance(0.5), ans = moreQ ? (q2 - p) / p * 100 : (q2 - p) / q2 * 100;
    const Q = T(rng, moreQ ? [`If **${p}%** of A equals **${q2}%** of B, then A is what percent **more** than B?`, `Suppose **${p}%** of A is equal to **${q2}%** of B. By what percent is A **more** than B?`] : [`If **${p}%** of A equals **${q2}%** of B, then B is what percent **less** than A?`, `Suppose **${p}%** of A is equal to **${q2}%** of B. By what percent is B **less** than A?`]);
    return mk(rng, P, ans, [
      [moreQ ? (q2 - p) / q2 * 100 : (q2 - p) / p * 100, "Compared with the wrong number (used the other base)"],
      [q2 - p, "Gave the difference of the two percentages"],
      [p / q2 * 100, `Gave B as a percent of A rather than the gap`],
      [100 - ans, "Gave the complement of the answer"],
    ], finish(d, Q,
      [`${p}% of A = ${q2}% of B, so A : B = ${q2} : ${p}`, `Take A = ${q2}, B = ${p}; gap = ${q2 - p}`, moreQ ? `A is more than B by ${q2 - p}/${p} × 100 = **${P(R(ans))}**` : `B is less than A by ${q2 - p}/${q2} × 100 = **${P(R(ans))}**`],
      `The bigger percentage goes with the smaller number: A : B = ${q2} : ${p}. Then it is gap ÷ base.`,
      `A : B is ${q2} : ${p}, not ${p} : ${q2}. Get this right first and the rest is routine.`));
  }) });

  /* ------------------------------------------------------------------ 4. successive change */
  const net = (a, b) => a + b + a * b / 100;
  QB.gen("quant/percentages/successive-change", { title: "Successive change", gen: wrap((rng, d) => {
    if (d === "Easy") {
      const a = T(rng, [5, 10, 12, 15, 20, 25, 30, 40, 50]), b = T(rng, [5, 10, 12, 15, 20, 25, 30, 40, 50]), up = rng.chance(0.5), gd = T(rng, ["phone", "scooter", "television", "fridge", "tablet"]);
      const n = up ? net(a, b) : -net(-a, -b);
      if (!C(n)) return null;
      const q = up ? `The price of a ${gd} is increased by **${a}%**, and a month later it is increased by another **${b}%**. What is the net percentage increase?`
        : `A shop gives a **${a}%** discount on a ${gd} and then a further **${b}%** off the reduced price. What is the single equivalent discount?`;
      return mk(rng, P, n, [
        [a + b, `Added ${a}% and ${b}% directly (the second change works on a new base)`],
        [up ? a + b - a * b / 100 : a + b + a * b / 100, `Used the wrong sign for the ab/100 term`],
        [(a + b) / 2, "Averaged the two percents"],
        [a * b / 100, "Kept only the ab/100 term"],
      ], finish(d, q,
        up ? [`Net = a + b + ab/100 = ${a} + ${b} + ${a}×${b}/100`, `= ${a + b} + ${R(a * b / 100)} = **${P(R(n))}**`]
          : [`Take 100: after ${a}% off → ${100 - a}; after ${b}% off → ${R((100 - a) * (100 - b) / 100)}`, `Total discount = 100 − ${R((100 - a) * (100 - b) / 100)} = **${P(R(n))}**`],
        up ? `Multiplying factors: ${R(1 + a / 100)} × ${R(1 + b / 100)} = ${R((1 + a / 100) * (1 + b / 100))}, so +${P(R(n))}.` : `Multiplying factors: ${R(1 - a / 100)} × ${R(1 - b / 100)} = ${R((1 - a / 100) * (1 - b / 100))}, so ${P(R(n))} off.`,
        `${a}% and ${b}% never simply add: the second percent acts on the already-changed value.`));
    }
    if (d === "Medium") {
      const kind = rng.int(0, 2);
      if (kind === 0) {
        const a = T(rng, [10, 12, 15, 20, 25, 30, 35, 40, 50, 60]), b = T(rng, [10, 12, 15, 20, 25, 30, 35, 40, 50, 60]);
        const n = net(a, -b);
        if (n === 0) return null;
        return mk(rng, sg, n, [
          [a - b, "Ignored the ab/100 term and just subtracted"],
          [a - b + a * b / 100, "Used the wrong sign for the ab/100 term"],
          [-n, "Gave the right size but the wrong direction"],
          [a + b, "Added the two percents"],
        ], finish(d, `Sales of a snack brand rose by **${a}%** in the first year and then fell by **${b}%** in the second year. What is the net change over the two years? (A fall is written with a minus sign.)`,
          [`Net = a + b + ab/100 with a = +${a}, b = −${b}`, `= ${a} − ${b} − ${R(a * b / 100)} = **${sg(n)}**`],
          `Factors: ${R(1 + a / 100)} × ${R(1 - b / 100)} = ${R((1 + a / 100) * (1 - b / 100))}, so the net change is ${sg(n)}.`,
          `A rise of ${a}% followed by a fall of ${b}% does not bring you back: the fall acts on the bigger value.`), true);
      }
      if (kind === 1) {
        const a = T(rng, [10, 15, 20, 25, 30, 35, 40, 50, 60]), b = T(rng, [10, 15, 20, 25, 30, 35, 40, 50, 60]), P0 = rng.int(2, 80) * 100;
        const fin = P0 * (1 + a / 100) * (1 - b / 100);
        if (!C(fin) || a === b) return null;
        return mk(rng, M, fin, [
          [P0 * (1 + (a - b) / 100), `Used a net change of ${a} − ${b} = ${a - b}%`],
          [P0, "Assumed the rise and fall cancel out"],
          [P0 * (1 + a / 100) - P0 * b / 100, `Took ${b}% of the original instead of the raised price`],
          [P0 * (1 - b / 100) * (1 + b / 100), "Mixed up the two percentages"],
        ], finish(d, T(rng, [`A shopkeeper marks up a lamp costing **${M(P0)}** by **${a}%**, and then offers a **${b}%** discount on the marked price. What is the final selling price?`, `A trader raises the price of a cycle that cost **${M(P0)}** by **${a}%**. Later he gives a **${b}%** discount on the new price. What is the final selling price?`, `A cloth merchant marks up a bolt of cloth priced at **${M(P0)}** by **${a}%**, then allows a **${b}%** discount on the marked price. What is the final selling price?`]),
          [`After mark-up: ${M(P0)} × ${R(1 + a / 100)} = ${M(R(P0 * (1 + a / 100)))}`, `After discount: ${M(R(P0 * (1 + a / 100)))} × ${R(1 - b / 100)} = **${M(R(fin))}**`],
          `Multiply once: ${P0} × ${R(1 + a / 100)} × ${R(1 - b / 100)}.`,
          `The ${b}% discount is on the marked price (${M(R(P0 * (1 + a / 100)))}), not on ${M(P0)}.`));
      }
      const a = T(rng, [10, 15, 20, 25, 30, 35, 40, 50, 60]), b = T(rng, [10, 15, 20, 25, 30, 35, 40, 50, 60]), shrink = rng.chance(0.5);
      const n = net(a, shrink ? -b : b);
      if (n === 0) return null;
      return mk(rng, sg, n, [
        [shrink ? a - b : a + b, "Ignored the ab/100 term"],
        [shrink ? a - b + a * b / 100 : a + b - a * b / 100, "Used the wrong sign for the ab/100 term"],
        [a * b / 100, "Gave only the ab/100 term"],
        [-n, "Gave the right size but the wrong direction"],
      ], finish(d, `The length of a rectangle is increased by **${a}%** and its breadth is ${shrink ? "decreased" : "increased"} by **${b}%**. What is the percentage change in its area? (A fall is written with a minus sign.)`,
        [`Area = length × breadth, so the two changes multiply`, `Net = ${a} ${shrink ? "−" : "+"} ${b} ${shrink ? "−" : "+"} ${R(a * b / 100)} = **${sg(n)}**`],
        `Area factor = ${R(1 + a / 100)} × ${R(shrink ? 1 - b / 100 : 1 + b / 100)} = ${R((1 + a / 100) * (shrink ? 1 - b / 100 : 1 + b / 100))}.`,
        `Area is a product of two lengths, so the percents combine with the ab/100 term, not by simple addition.`), true);
    }
    // Hard
    const kind = rng.int(0, 2);
    if (kind === 0) {
      const ch = [T(rng, [10, 20, 25, 30, 40, 50]), T(rng, [10, 20, 25, 30, 40, 50]), T(rng, [10, 20, 25, 30, 40, 50])].map((v) => (rng.chance(0.5) ? v : -v));
      const f = ch.reduce((acc, v) => acc * (1 + v / 100), 1), n = (f - 1) * 100;
      if (!C(n) || n === 0 || ch.every((v) => v > 0) || ch.every((v) => v < 0)) return null;
      const [a, b, c] = ch, s = (v) => (v > 0 ? "+" : "−") + Math.abs(v) + "%";
      const word = (v) => (v > 0 ? `rose by ${v}%` : `fell by ${-v}%`);
      return mk(rng, sg, n, [
        [a + b + c, "Added the three percents"],
        [net(net(a, b), 0), `Combined only the first two changes`],
        [-n, "Gave the right size but the wrong direction"],
        [a + b + c + (a * b + b * c + a * c) / 100, "Added the pairwise terms but forgot the abc/10000 term"],
      ], finish(d, `In three consecutive years the footfall at a mall ${word(a)}, then ${word(b)}, then ${word(c)}. What is the overall percentage change over the three years? (A fall is written with a minus sign.)`,
        [`Multiply the factors: ${R(1 + a / 100)} × ${R(1 + b / 100)} × ${R(1 + c / 100)} = ${R(f * 10000) / 10000}`, `Overall change = ${R(f * 10000) / 10000} − 1 → **${sg(n)}**`],
        `Do it two at a time with a + b + ab/100: first ${s(a)}, ${s(b)} → ${sg(net(a, b))}; then combine with ${s(c)}.`,
        `Three percents need the factor method (or two applications of the formula). The sum ${a + b + c}% is wrong.`), true);
    }
    if (kind === 1) {
      const a = T(rng, [10, 20, 30, 40, 50]), shape = rng.int(0, 1), up = rng.chance(0.5);
      const s = up ? a : -a, n = net(s, s);
      return mk(rng, sg, n, [
        [2 * s, `Doubled the side's change (${s > 0 ? "+" : "−"}${a}% × 2) and ignored the second term`],
        [s, `Gave the change in the ${shape ? "radius" : "side"} itself`],
        [-n, "Gave the right size but the wrong direction"],
        [s * s / 100 * (up ? 1 : -1), "Gave only the s²/100 term"],
      ], finish(d, shape ? `The radius of a circular pizza base is ${up ? "increased" : "decreased"} by **${a}%**. What is the percentage change in its area? (A fall is written with a minus sign.)`
        : `The side of a square tile is ${up ? "increased" : "decreased"} by **${a}%**. What is the percentage change in its area? (A fall is written with a minus sign.)`,
        [`Area depends on ${shape ? "radius²" : "side²"}, so the change applies twice: a + a + a²/100`, `= ${2 * s} + ${R(a * a / 100)} = **${sg(n)}**`],
        `Factor method: ${R(1 + s / 100)}² = ${R((1 + s / 100) ** 2)}, so ${sg(n)}.`,
        `Area changes by 2a ± a²/100, not by 2a. For a = ${a}, that extra term is ${R(a * a / 100)}%.`), true);
    }
    const ds = [T(rng, [10, 20, 25, 30, 40]), T(rng, [10, 20, 25, 30, 40]), T(rng, [10, 20, 25, 30, 40])], P0 = rng.int(1, 40) * 1000;
    const fin = ds.reduce((acc, v) => acc * (1 - v / 100), P0), tot = (1 - fin / P0) * 100;
    if (!C(fin) || new Set(ds).size < 3) return null;
    return mk(rng, M, fin, [
      [P0 * (1 - (ds[0] + ds[1] + ds[2]) / 100), `Added the three discounts (${ds[0] + ds[1] + ds[2]}%) and took them off once`],
      [P0 * (1 - ds[0] / 100) * (1 - ds[1] / 100), "Applied only two of the three discounts"],
      [P0 * (1 - Math.max(...ds) / 100), "Applied only the biggest discount"],
      [P0 * (1 - tot / 100) + P0 * 0.01, "Rounded the equivalent discount"],
    ], finish(d, `A festival sale offers three successive discounts of **${ds[0]}%**, **${ds[1]}%** and **${ds[2]}%** on a laptop marked **${M(P0)}**. What is the final price?`,
      [`Factors: ${R(1 - ds[0] / 100)} × ${R(1 - ds[1] / 100)} × ${R(1 - ds[2] / 100)}`, `${M(P0)} × ${R(fin / P0 * 10000) / 10000} = **${M(fin)}**`],
      `Multiply the three factors once. Equivalent discount = ${P(R(tot))}.`,
      `Each discount works on the reduced price, so the total is ${P(R(tot))}, not ${ds[0] + ds[1] + ds[2]}%.`));
  }) });

  /* ------------------------------------------------------------------ 5. price x consumption constant */
  const ITEMS = ["sugar", "rice", "cooking oil", "petrol", "milk", "tea powder", "wheat flour", "dal", "diesel", "onions", "coffee powder", "mustard oil"];
  QB.gen("quant/percentages/product-constant", { title: "Price × consumption constant", gen: wrap((rng, d) => {
    const item = T(rng, ITEMS);
    if (d === "Easy") {
      const up = rng.chance(0.5);
      const x = up ? T(rng, [25, 60, 100, 150, 300, 400, 900]) : T(rng, [20, 37.5, 50, 60, 75, 80, 90]);
      const ans = up ? 100 * x / (100 + x) : 100 * x / (100 - x);
      return mk(rng, P, ans, [
        [x, "Assumed the percent is the same on both sides"],
        [up ? 100 * x / (100 - x) : 100 * x / (100 + x), "Used the formula for the opposite case"],
        [100 - x, "Took the “remaining” percent"],
        [x / 2, "Halved the price change"],
        [100 - ans, "Gave the complement of the answer"],
      ], finish(d, up ? T(rng, [`The price of ${item} rises by **${x}%**. By what percent must a family cut its consumption of ${item} to keep the monthly spending unchanged?`, `${item[0].toUpperCase() + item.slice(1)} becomes **${x}%** costlier. A household wants its ${item} bill to stay the same. By what percent should it reduce the quantity bought?`, `A hostel mess is told that ${item} now costs **${x}%** more. To keep the monthly expense on ${item} unchanged, by what percent must it cut usage?`, `In a mess, ${item} is now **${x}%** dearer. By what percent must the quantity bought come down so that the total spend stays unchanged?`, `The price of ${item} goes up by **${x}%**. Keeping the monthly bill on ${item} the same, by what percent should the family cut the quantity it buys?`])
        : T(rng, [`The price of ${item} falls by **${x}%**. By what percent can a family increase its consumption of ${item} without spending more?`, `${item[0].toUpperCase() + item.slice(1)} becomes **${x}%** cheaper. Keeping the same bill, by what percent can the household increase its purchase?`, `A canteen finds that ${item} now costs **${x}%** less. By what percent can it raise its usage and still spend the same amount?`, `${item[0].toUpperCase() + item.slice(1)} is now **${x}%** cheaper. Keeping the same spend, by what percent can the family buy more?`, `After a price cut of **${x}%** on ${item}, by what percent can a household increase its quantity without spending more?`]),
        up ? [`Spending = price × quantity must stay constant. New price = ${100 + x}% of old.`, `Quantity must fall to 100/${100 + x} of old: reduction = ${x}/${100 + x} × 100 = **${P(R(ans))}**`]
          : [`New price = ${100 - x}% of old.`, `Quantity can rise to 100/${100 - x} of old: increase = ${x}/${100 - x} × 100 = **${P(R(ans))}**`],
        `Use x/(100 ${up ? "+" : "−"} x) × 100 = ${x}/${up ? 100 + x : 100 - x} × 100 = ${P(R(ans))}.`,
        `Price and quantity are inversely linked, so a ${x}% price ${up ? "rise" : "fall"} does not mean a ${x}% change in quantity.`));
    }
    if (d === "Medium") {
      const kind = rng.int(0, 2);
      if (kind === 0) {
        const KG = T(rng, ["sugar", "rice", "dal", "wheat flour", "onions", "tea powder"]);
        const a = T(rng, [20, 25, 30, 40, 45, 50, 60, 75, 80]), b = a + T(rng, [5, 10, 15, 20]), qty = rng.int(1, 12) * b;
        const fin = qty * a / b;
        if (!I(fin)) return null;
        return mk(rng, N, fin, [
          [qty * b / a, "Turned the ratio upside down: the price rose, so you can buy less"],
          [qty - (b - a), `Took off the rupee rise (${b - a}) from the quantity`],
          [qty * (1 - (b - a) / a), "Cut the quantity by the same percent as the price rose"],
          [qty * a / b + 1, "Rounded up"],
        ], finish(d, `${KG[0].toUpperCase() + KG.slice(1)} costs **${M(a)}** per kg now, but the price rises to **${M(b)}** per kg. A hostel used **${qty} kg** a month before. How many kg can it buy now with the same monthly budget?`,
          [`Budget = ${a} × ${qty} = ${M(a * qty)}`, `New quantity = ${M(a * qty)} ÷ ${b} = **${N(fin)} kg**`],
          `Quantity × price is constant: new quantity = ${qty} × ${a}/${b} = ${N(fin)}.`,
          `Quantity moves opposite to price: if the price goes up, the same money buys fewer kg.`));
      }
      const x = T(rng, [25, 60, 150, 300, 400, 20, 50]), ans = 100 * x / (100 + x);
      const ctx = kind === 1 ? [`A bus company raises its average speed by **${x}%**. By what percent is the time for the same journey reduced?`, "time", `Speed × time = distance, which stays the same.`]
        : [`The length of a rectangle is increased by **${x}%** while its area is kept the same. By what percent must the breadth be decreased?`, "breadth", `Length × breadth = area, which stays the same.`];
      return mk(rng, P, ans, [
        [x, "Assumed the percent is the same on both sides"],
        [100 * x / (100 - x), "Used the wrong direction of the formula"],
        [100 - x, "Took the “remaining” percent"],
        [x / 2, "Halved the change"],
        [100 - ans, "Gave the complement of the answer"],
      ], finish(d, ctx[0],
        [ctx[2], `New value = 100/${100 + x} of the old one; reduction = ${x}/${100 + x} × 100 = **${P(R(ans))}**`],
        `Reduction = x/(100 + x) × 100 = ${x}/${100 + x} × 100 = ${P(R(ans))}.`,
        `If one factor goes up by ${x}%, the other must come down by less than ${x}%, not by ${x}%.`));
    }
    const kind = rng.int(0, 1);
    if (kind === 0) {
      const x = T(rng, [20, 25, 30, 40, 50, 60, 75, 80]), z = T(rng, [5, 10, 15, 20, 25, 30]), ans = 100 * (1 - (100 + z) / (100 + x));
      if (z >= x) return null;
      return mk(rng, P, ans, [
        [x - z, `Subtracted the two percents (${x} − ${z})`],
        [100 * x / (100 + x), "Found the cut needed to keep spending exactly the same, ignoring the allowed rise"],
        [100 * (x - z) / (100 + x) + z, "Mixed up the rise and the cut"],
        [100 * (x - z) / (100 + z), "Divided by the wrong base"],
      ], finish(d, T(rng, [`The price of ${item} goes up by **${x}%**. By what percent must a family reduce its consumption so that its spending on ${item} rises by only **${z}%**?`, `${item[0].toUpperCase() + item.slice(1)} gets **${x}%** dearer. A family allows its spending on ${item} to rise by just **${z}%**. By what percent must it cut the quantity bought?`, `A canteen's ${item} bill is to rise by only **${z}%**, though the price of ${item} goes up by **${x}%**. By what percent must usage be reduced?`]),
        [`New spending = ${100 + z}% of old; new price = ${100 + x}% of old`, `Quantity factor = ${100 + z}/${100 + x}, so the reduction = 1 − ${100 + z}/${100 + x} = **${P(R(ans))}**`],
        `Quantity factor = (100 + ${z})/(100 + ${x}) = ${R((100 + z) / (100 + x) * 10000) / 10000}, so the cut is ${P(R(ans))}.`,
        `Here the target spending is ${100 + z}% (not 100%), so the usual x/(100 + x) formula must be adjusted.`));
    }
    const x = T(rng, [10, 15, 20, 25, 30, 35, 40, 45, 50, 60]), y = T(rng, [5, 10, 12, 15, 20, 25, 30]), n = net(x, -y);
    if (n === 0) return null;
    return mk(rng, sg, n, [
      [x - y, "Subtracted the two percents"],
      [-y, "Looked only at the fall in consumption"],
      [x, "Looked only at the price rise"],
      [-n, "Gave the right size but the wrong direction"],
    ], finish(d, T(rng, [`The price of ${item} rises by **${x}%** and a family reduces its consumption by **${y}%**. What is the percentage change in its monthly spending? (A fall is written with a minus sign.)`, `A household's ${item} bill is affected in two ways: the price goes up **${x}%**, and the family buys **${y}%** less. What is the percentage change in its monthly spending? (A fall is written with a minus sign.)`]),
      [`Spending = price × quantity, so the changes combine: ${x} − ${y} − ${R(x * y / 100)}`, `= **${sg(n)}**`],
      `Factor method: ${R(1 + x / 100)} × ${R(1 - y / 100)} = ${R((1 + x / 100) * (1 - y / 100))} → ${sg(n)}.`,
      `Spending depends on both price and quantity; the net change is ${sg(n)}, not ${x - y}%.`), true);
  }) });

  /* ------------------------------------------------------------------ 6. growth & depreciation */
  function growth(N0, rates) { let num = N0, den = 1; for (const r of rates) { num *= 100 + r; den *= 100; } return num / den; }
  function unitFor(rates) {
    let prod = 1, den = 1;
    for (const r of rates) { prod *= 100 + r; den *= 100; }
    return den / QB.gcd(den, prod);
  }
  function pickN(rng, rates, lo, hi) {
    const u0 = unitFor(rates);
    for (const step of [1000, 100, 10, 1]) {
      const u = QB.lcm(u0, step), a = Math.ceil(lo / u), b = Math.floor(hi / u);
      if (a <= b) return u * rng.int(a, b);
    }
    return null;
  }
  const yrs = (n) => (n === 1 ? "1 year" : n + " years");
  QB.gen("quant/percentages/growth-depreciation", { title: "Population growth / depreciation", gen: wrap((rng, d) => {
    const dep = rng.chance(0.5), town = T(rng, ["Nandur", "Palasa", "Kovai Nagar", "Ranipet", "Wardha", "Muzaffar Nagar"]);
    const thing = T(rng, ["a laptop", "a scooter", "a printer", "a tractor"]);
    const money = dep, f = money ? M : N;
    const sign = dep ? -1 : 1;
    const ask = (n0, r, n) => money ? `${thing[0].toUpperCase() + thing.slice(1)} bought for **${M(n0)}** loses **${r}%** of its value every year.` : `The population of ${town} is **${N(n0)}** today and grows by **${r}%** every year.`;
    if (d === "Easy" || d === "Medium") {
      const n = d === "Easy" ? 2 : T(rng, [2, 3, 3]), r = d === "Easy" ? T(rng, [10, 20, 25]) : T(rng, [5, 8, 10, 12, 15, 20, 25]);
      const rates = Array(n).fill(sign * r), n0 = pickN(rng, rates, money ? 10000 : 2000, money ? 600000 : 400000);
      if (!n0) return null;
      const fin = growth(n0, rates), diffAsk = d === "Medium" && rng.chance(0.4);
      const ans = diffAsk ? Math.abs(fin - n0) : fin;
      const simple = n0 * (1 + sign * n * r / 100), one = n0 * (1 + sign * r / 100), prev = growth(n0, Array(n - 1).fill(sign * r)), opp = growth(n0, Array(n).fill(-sign * r));
      const wr = diffAsk ? [
        [fin, `Gave the final value, not the ${dep ? "fall" : "increase"}`],
        [Math.abs(simple - n0), "Used simple (same amount each year) change"],
        [Math.abs(one - n0), "Applied the change only once"],
        [Math.abs(opp - n0), "Used the opposite direction"],
      ] : [
        [simple, `Used the same ${r}% of the original every year (simple, not compound)`],
        [one, "Applied the change only once"],
        [prev, `Applied it for only ${yrs(n - 1)}`],
        [opp, `Went the wrong way (${dep ? "increased" : "decreased"} instead of ${dep ? "decreased" : "increased"})`],
      ];
      return mk(rng, f, ans, wr, finish(d, `${ask(n0, r, n)} ${diffAsk ? `By how much ${dep ? "does its value fall" : "does it increase"} in ${yrs(n)}?` : `What is ${money ? "its value" : "the population"} after ${yrs(n)}?`}`,
        [`Each year the value is multiplied by ${R(1 + sign * r / 100)}`, `After ${yrs(n)}: ${f(n0)} × ${R(1 + sign * r / 100)}${n > 1 ? "^" + n : ""} = **${f(fin)}**`, ...(diffAsk ? [`Change = ${f(fin)} vs ${f(n0)} → **${f(ans)}**`] : [])],
        `Year by year: ${Array.from({ length: n }, (_, i) => f(growth(n0, Array(i + 1).fill(sign * r)))).join(" → ")}.`,
        `Compound change works on the new value each year; “${n} × ${r}%” of the original is only an approximation.`));
    }
    // Hard
    const kind = rng.int(0, 2);
    if (kind === 0) {
      const rr = [T(rng, [5, 10, 20, 25]), T(rng, [5, 10, 20, 25]), T(rng, [5, 10, 20, 25])];
      const dirs = rng.shuffle([1, 1, -1]), rates = rr.map((r, i) => r * dirs[i]);
      const n0 = pickN(rng, rates, 20000, 800000);
      if (!n0) return null;
      const fin = growth(n0, rates), txt = rates.map((r) => (r > 0 ? `grows by ${r}%` : `falls by ${-r}%`));
      return mk(rng, N, fin, [
        [n0 * (1 + rates.reduce((a, b) => a + b, 0) / 100), "Added the three percents and applied the total once"],
        [growth(n0, rates.slice().sort((a, b) => b - a).slice(0, 2)), "Left out one of the three years"],
        [n0, "Assumed the rises and the fall cancel out"],
        [growth(n0, rates.map((r) => -r)), "Reversed every rate"],
      ], finish(d, `The membership of a fitness club is **${N(n0)}**. In the next three years it ${txt[0]} in year 1, ${txt[1]} in year 2 and ${txt[2]} in year 3. How many members are there at the end of year 3?`,
        [`Multiply the three factors: ${rates.map((r) => R(1 + r / 100)).join(" × ")}`, `${N(n0)} × ${R(rates.reduce((a, r) => a * (1 + r / 100), 1) * 1e6) / 1e6} = **${N(fin)}**`],
        `Apply the factors one after another: ${[1, 2, 3].map((k) => N(growth(n0, rates.slice(0, k)))).join(" → ")}.`,
        `Each year's percent acts on that year's starting number; the order does not matter for the result, but a plain sum of percents is wrong.`));
    }
    if (kind === 1) {
      const n = T(rng, [2, 3]), r = T(rng, [10, 20, 25, 5]), rates = Array(n).fill(sign * r), n0 = pickN(rng, rates, money ? 20000 : 5000, money ? 500000 : 300000);
      if (!n0) return null;
      const fin = growth(n0, rates);
      return mk(rng, f, n0, [
        [fin * (1 - sign * n * r / 100), `Reversed with simple percent (${n} × ${r}%)`],
        [growth(fin, Array(n).fill(sign * r)), `Applied the ${dep ? "fall" : "growth"} again instead of undoing it`],
        [fin / (1 + sign * r / 100), "Undid only one year"],
        [fin * (1 - sign * r / 100) ** n, "Took off the percent from the final value each time"],
      ], finish(d, money ? `A machine loses **${r}%** of its value every year. After ${yrs(n)} its value is **${M(fin)}**. What was its value at the start?` : `The population of ${town} grows by **${r}%** every year. After ${yrs(n)} it is **${N(fin)}**. What was it ${yrs(n)} ago?`,
        [`After ${yrs(n)}: start × ${R(1 + sign * r / 100)}${n > 1 ? "^" + n : ""} = ${f(fin)}`, `Start = ${f(fin)} ÷ ${R((1 + sign * r / 100) ** n * 1e6) / 1e6} = **${f(n0)}**`],
        `Divide by the growth factor ${yrs(n)} in a row: ${[...Array(n)].map(() => R(1 + sign * r / 100)).join(" ÷ ")}.`,
        `To go back, divide by ${R(1 + sign * r / 100)} each year. Multiplying by ${R(1 - sign * r / 100)} does not undo a ${r}% ${dep ? "fall" : "rise"}.`));
    }
    const n = 2, r1 = T(rng, [10, 20, 25]), r2 = T(rng, [10, 20, 25]), rates = [r1, -r2], n0 = pickN(rng, rates, 5000, 400000);
    if (!n0 || r1 === r2 && false) return null;
    const fin = growth(n0, rates);
    return mk(rng, N, fin, [
      [n0, `Assumed +${r1}% then −${r2}% cancel out`],
      [n0 * (1 + (r1 - r2) / 100), `Used a single net change of ${r1 - r2}%`],
      [growth(n0, [-r2, -r2]), "Used the fall in both years"],
      [growth(n0, [r1, r1]), "Used the rise in both years"],
    ], finish(d, `A village has **${N(n0)}** people. Its population rises by **${r1}%** in one year and falls by **${r2}%** the next year. What is the population after the two years?`,
      [`After year 1: ${N(n0)} × ${R(1 + r1 / 100)} = ${N(n0 * (1 + r1 / 100))}`, `After year 2: ${N(n0 * (1 + r1 / 100))} × ${R(1 - r2 / 100)} = **${N(fin)}**`],
      `Net factor = ${R(1 + r1 / 100)} × ${R(1 - r2 / 100)} = ${R((1 + r1 / 100) * (1 - r2 / 100) * 10000) / 10000}.`,
      `Up ${r1}% then down ${r2}% is a net change of ${sg(net(r1, -r2))}, not ${sg(r1 - r2)}.`));
  }) });

  /* ------------------------------------------------------------------ 7. elections */
  QB.gen("quant/percentages/elections", { title: "Elections & votes", gen: wrap((rng, d) => {
    const body = T(rng, ["college union", "students' council", "hostel committee", "residents' association"]);
    if (d === "Easy") {
      const V = rng.int(2, 24) * 500, p = T(rng, [55, 60, 65, 70, 75, 80]);
      const win = V * p / 100, lose = V - win, marg = win - lose, k = rng.int(0, 2);
      const asks = [[`By how many votes did the winner win?`, marg, "margin"], [`How many votes did the loser get?`, lose, "loser"], [`How many votes did the winner get?`, win, "winner"]][k];
      if (!I(win) || !I(lose) || !I(marg)) return null;
      const cand = [[win, "Gave the winner's votes"], [lose, "Gave the loser's votes"], [marg, "Gave the margin"], [V * (p - 50) / 100, "Halved the margin"], [V * p / 100 - 100, "Slipped in the arithmetic"]].filter((c) => c[0] !== asks[1]);
      return mk(rng, N, asks[1], cand.map((c, i) => [c[0], c[1]]), finish(d, `In a ${body} election with two candidates, **${N(V)}** valid votes were cast and the winner got **${p}%** of them. ${asks[0]}`,
        [`Winner = ${p}% of ${N(V)} = ${N(win)}; loser = ${100 - p}% = ${N(lose)}`, `Margin = ${N(win)} − ${N(lose)} = ${N(marg)}`, `Answer: **${N(asks[1])}**`],
        `Margin = (${p} − ${100 - p})% = ${2 * p - 100}% of ${N(V)} = ${N(marg)}.`,
        `Winner's votes, loser's votes and the margin are three different numbers: read which one the question wants.`));
    }
    if (d === "Medium") {
      const T0 = rng.int(2, 30) * 500, inv = T(rng, [10, 20, 25, 5, 8, 12]), p = T(rng, [52, 55, 60, 64, 65, 70, 75]);
      const valid = T0 * (100 - inv) / 100, win = valid * p / 100;
      if (!I(valid) || !I(win)) return null;
      const kind = rng.int(0, 1);
      if (kind === 0) return mk(rng, N, win, [
        [T0 * p / 100, "Took the percent of all votes cast, forgetting the invalid ones"],
        [valid, "Stopped at the valid votes"],
        [T0 * (p - inv) / 100, "Subtracted the percents instead of chaining them"],
        [valid - win, "Gave the loser's votes"],
      ], finish(d, `In a ${body} election, **${N(T0)}** votes were polled and **${inv}%** of them were invalid. The winner got **${p}%** of the valid votes. How many votes did the winner get?`,
        [`Valid votes = ${100 - inv}% of ${N(T0)} = ${N(valid)}`, `Winner = ${p}% of ${N(valid)} = **${N(win)}**`],
        `Chain the percents: ${N(T0)} × ${R((100 - inv) / 100)} × ${R(p / 100)}.`,
        `${p}% applies to the valid votes (${N(valid)}), not to all ${N(T0)} that were polled.`));
      const marg = valid * (2 * p - 100) / 100;
      if (!I(marg)) return null;
      return mk(rng, N, marg, [
        [T0 * (2 * p - 100) / 100, "Used all polled votes instead of valid votes"],
        [win, "Gave the winner's votes"],
        [valid - win, "Gave the loser's votes"],
        [valid * (p - 50) / 100, "Halved the margin"],
      ], finish(d, `**${N(T0)}** people voted in a ${body} election and **${inv}%** of the votes were rejected as invalid. Of the valid votes, the winner received **${p}%** and the only other candidate received the rest. By how many votes did the winner win?`,
        [`Valid votes = ${N(valid)}`, `Margin = (${p} − ${100 - p})% of ${N(valid)} = ${2 * p - 100}% of ${N(valid)} = **${N(marg)}**`],
        `Margin% = 2p − 100 = ${2 * p - 100}%, applied on the valid votes only.`,
        `Invalid votes belong to nobody: remove them before using ${p}%.`));
    }
    if (rng.chance(0.55)) {
      const T0 = rng.int(1, 16) * 1000, inv = T(rng, [10, 20, 25, 5]), p = T(rng, [55, 60, 65, 70, 75]);
      const valid = T0 * (100 - inv) / 100, marg = valid * (2 * p - 100) / 100;
      if (!I(valid) || !I(marg)) return null;
      return mk(rng, N, T0, [
        [valid, "Stopped at the valid votes and forgot the invalid ones"],
        [marg * 100 / p, "Treated the margin as the winner's votes"],
        [valid * 2, "Used p − 50 instead of 2p − 100 for the margin"],
        [valid / (1 + inv / 100) , "Divided by (1 + invalid%) instead of (1 − invalid%)"],
      ], finish(d, `In a ${body} election between two candidates, **${inv}%** of the votes polled were invalid. The winner got **${p}%** of the valid votes and won by **${N(marg)}** votes. How many votes were polled in all?`,
        [`Margin = (${p} − ${100 - p})% = ${2 * p - 100}% of valid votes, so valid votes = ${N(marg)} × 100/${2 * p - 100} = ${N(valid)}`, `Valid = ${100 - inv}% of polled, so polled = ${N(valid)} × 100/${100 - inv} = **${N(T0)}**`],
        `Two steps backward: margin → valid (÷ ${2 * p - 100}%) → polled (÷ ${100 - inv}%).`,
        `The margin is ${2 * p - 100}% of the valid votes, not ${p}%.`));
    }
    const a = T(rng, [40, 45, 50, 55]), b = T(rng, [20, 25, 30, 35]), c = 100 - a - b, g = a - b;
    const marg = rng.int(1, 12) * 300;
    if (g <= 0 || c <= 0) return null;
    const V = marg * 100 / g, cv = V * c / 100;
    if (!I(V) || !I(cv)) return null;
    return mk(rng, N, cv, [
      [V, "Gave the total number of votes"],
      [marg * c / 100, `Took ${c}% of the margin`],
      [V * b / 100, "Gave B's votes"],
      [V * a / 100, "Gave A's votes"],
    ], finish(d, `Three candidates A, B and C contested a society election and every vote was valid. A got **${a}%** of the votes, B got **${b}%** and C got the rest. If A beat B by **${N(marg)}** votes, how many votes did C get?`,
      [`A − B = ${a}% − ${b}% = ${g}% of the total = ${N(marg)}, so total = ${N(V)}`, `C got ${c}% of ${N(V)} = **${N(cv)}**`],
      `1% of the votes = ${N(marg)}/${g} = ${N(marg / g)}. C's share is ${c} × ${N(marg / g)}.`,
      `The margin is a percent of the total number of votes, not of one candidate's votes.`));
  }) });

  /* ------------------------------------------------------------------ 8. income, expenditure, savings */
  QB.gen("quant/percentages/income-savings", { title: "Income, expenditure & savings", gen: wrap((rng, d) => {
    const who = T(rng, ["Meena", "Karthik", "Farhan", "Divya", "Gurpreet", "Lakshmi", "Ananya", "Nisha", "Sunita", "Harpreet", "Pallavi", "Revathi"]);
    if (d === "Easy") {
      const S = rng.int(2, 15) * 4000, a = T(rng, [20, 25, 30, 35, 40]), b = T(rng, [10, 15, 20, 25]);
      if (a + b >= 90) return null;
      const spent = S * (a + b) / 100, save = S - spent;
      if (!I(save)) return null;
      return mk(rng, M, save, [
        [spent, "Gave the amount spent, not saved"],
        [S * (100 - a) / 100, "Subtracted only the first expense"],
        [S * (100 - b) / 100, "Subtracted only the second expense"],
        [S * (100 - a - b) / 1000, "Slipped a decimal place"],
      ], finish(d, `${who} earns **${M(S)}** a month. She spends **${a}%** on rent and **${b}%** on food and saves the rest. How much does she save each month?`,
        [`Spent = ${a}% + ${b}% = ${a + b}% of ${M(S)} = ${M(spent)}`, `Savings = ${M(S)} − ${M(spent)} = **${M(save)}**`],
        `Savings% = 100 − ${a} − ${b} = ${100 - a - b}%, and ${100 - a - b}% of ${M(S)} = ${M(save)}.`,
        `Do not stop at ${M(spent)}: that is what leaves the account, not what stays.`));
    }
    if (d === "Medium") {
      const s = T(rng, [20, 25, 30, 40, 60, 75, 80]), X = rng.int(2, 24) * 1000, inc = X * 100 / (100 - s), exp = inc - X;
      // s is the spending percent here
      if (!I(inc) || !I(exp)) return null;
      const askInc = rng.chance(0.5);
      return mk(rng, M, askInc ? inc : exp, askInc ? [
        [X * 100 / s, `Treated the savings as ${s}% of income`],
        [X * (100 + s) / 100, `Added ${s}% to the savings`],
        [exp, "Gave the expenditure"],
        [X * (100 - s) / 100, "Took the percent of savings"],
      ] : [
        [inc, "Gave the income"],
        [X * s / 100, `Took ${s}% of the savings`],
        [X * 100 / s, `Treated the savings as ${s}% of income`],
        [X * (100 - s) / 100, "Took the savings percent of the savings"],
      ], finish(d, `${who} spends **${s}%** of her income and saves **${M(X)}**. ${askInc ? "What is her income?" : "How much does she spend?"}`,
        [`Savings = ${100 - s}% of income = ${M(X)}`, `Income = ${M(X)} × 100/${100 - s} = ${M(inc)}`, askInc ? `**${M(inc)}**` : `Spending = ${s}% of ${M(inc)} = **${M(exp)}**`],
        `${100 - s}% ↔ ${M(X)}, so 1% = ${M(R(X / (100 - s)))}. Income = 100 × that.`,
        `The ${M(X)} is the ${100 - s}% that is NOT spent: do not treat it as ${s}%.`));
    }
    if (rng.chance(0.5)) {
      const s = T(rng, [10, 15, 20, 25, 30, 40]), i = T(rng, [10, 20, 25, 30, 40, 50]), e = T(rng, [5, 10, 15, 20, 25, 30]);
      const newS = 100 * (1 + i / 100) - (100 - s) * (1 + e / 100), ch = (newS - s) / s * 100;
      if (!C(ch) || newS <= 0 || ch === 0) return null;
      return mk(rng, sg, ch, [
        [i - e, "Subtracted the two percents"],
        [i, "Assumed savings rise by the same percent as income"],
        [newS / (1 + i / 100), "Gave the new savings rate, not the change in savings"],
        [(newS - s), "Gave the change in rupee units (taking income as 100), not a percent"],
      ], finish(d, T(rng, [`${who} saves **${s}%** of her income. Her income rises by **${i}%** and her expenditure rises by **${e}%**. By what percent does her savings amount change? (A fall is written with a minus sign.)`, `Each month ${who} puts aside **${s}%** of her income. Next, her income rises by **${i}%** and her spending rises by **${e}%**. By what percent does the amount she saves change? (A fall is written with a minus sign.)`]),
        [`Take income = 100: expenditure = ${100 - s}, savings = ${s}`, `New income = ${100 + i}, new expenditure = ${R((100 - s) * (1 + e / 100))}, new savings = ${R(newS)}`, `Change = (${R(newS)} − ${s})/${s} × 100 = **${sg(ch)}**`],
        `Savings is a small difference of two big numbers, so it moves much more than income does. Always rebuild it from income = 100.`,
        `Savings change is not i − e. The two changes apply to different bases (income and expenditure).`), true);
    }
    const S = rng.int(2, 30) * 10000, s = T(rng, [10, 20, 25, 30, 40, 45]), i = T(rng, [10, 15, 20, 25, 30]), e = T(rng, [5, 10, 12, 15, 20, 25]);
    const E = S * (100 - s) / 100, ns = S * (1 + i / 100) - E * (1 + e / 100), oldS = S - E;
    if (!C(ns) || ns <= 0) return null;
    return mk(rng, M, ns, [
      [S * (1 + i / 100) * s / 100, "Kept the old saving rate on the new income"],
      [S * (1 + i / 100) - E, "Forgot that the expenditure also rose"],
      [oldS * (1 + i / 100), "Raised the savings by the income percent"],
      [S * (1 + i / 100) - E * (1 + i / 100), "Raised expenditure by the income percent instead of its own"],
    ], finish(d, T(rng, [`${who} earns **${M(S)}** a month and saves **${s}%** of it. Next year her income goes up by **${i}%** and her expenditure goes up by **${e}%**. How much will she save per month?`, `${who}'s monthly income is **${M(S)}**, and she saves **${s}%** of it. Her income rises by **${i}%** next year and her spending rises by **${e}%**. What will her monthly savings be?`, `Last year ${who} had a monthly income of **${M(S)}** and saved **${s}%**. This year her income is up **${i}%** and her expenses are up **${e}%**. How much does she save each month now?`]),
      [`Expenditure now = ${100 - s}% of ${M(S)} = ${M(E)}`, `New income = ${M(R(S * (1 + i / 100)))}, new expenditure = ${M(R(E * (1 + e / 100)))}`, `Savings = **${M(ns)}**`],
      `Savings = income − expenditure: each is changed by its own percent.`,
      `The saving rate (${s}%) does not stay fixed when income and expenditure rise at different rates.`));
  }) });

  /* ------------------------------------------------------------------ 9. exam marks */
  QB.gen("quant/percentages/exam-marks", { title: "Exam marks, pass / fail", gen: wrap((rng, d) => {
    const who = T(rng, ["Arjun", "Sneha", "Imran", "Keerthi", "Rohit", "Pooja"]);
    if (d === "Easy") {
      const Mx = T(rng, [100, 150, 200, 250, 300, 400, 500, 600]), q = T(rng, [30, 35, 40, 45, 50]), pass = Mx * q / 100;
      if (!I(pass)) return null;
      const kind = rng.int(0, 1);
      if (kind === 0) {
        const gap = rng.int(2, 12), X = pass - gap;
        if (X <= 0) return null;
        return mk(rng, N, gap, [
          [pass, "Gave the pass mark itself"],
          [pass + X, "Added the scored marks to the pass mark"],
          [Mx - X, "Subtracted from the maximum marks"],
          [X * q / 100, `Took ${q}% of the scored marks`],
        ], finish(d, `An exam is out of **${Mx}** marks and the pass mark is **${q}%**. ${who} scored **${X}** marks. By how many marks did ${who} fail?`,
          [`Pass mark = ${q}% of ${Mx} = ${pass}`, `Shortfall = ${pass} − ${X} = **${gap}**`],
          `${q}% of ${Mx} = ${pass} (10% = ${Mx / 10}, then scale). Subtract the score.`,
          `${q}% is of the maximum marks, not of the marks the student scored.`));
      }
      const p = q - T(rng, [5, 10]), X = Mx * p / 100, gap = pass - X;
      if (!I(X) || p <= 0) return null;
      return mk(rng, N, gap, [
        [pass, "Gave the pass mark itself"],
        [X, "Gave the marks scored"],
        [Mx * (q + p) / 100, "Added the two percentages"],
        [Mx * (q - p) / 10, "Slipped a decimal place"],
      ], finish(d, `${who} got **${p}%** in an exam of **${Mx}** marks. The pass mark is **${q}%**. How many more marks did ${who} need to pass?`,
        [`Marks needed = ${q}% − ${p}% = ${q - p}% of ${Mx}`, `= **${N(gap)}**`],
        `The gap is only ${q - p}% of ${Mx}; no need to find either mark separately.`,
        `Both percentages are of the same maximum marks, so subtract them first.`));
    }
    if (d === "Medium") {
      const kind = rng.int(0, 1);
      if (kind === 0) {
        const Mx = T(rng, [200, 250, 300, 400, 500, 600, 800, 1000]), p = T(rng, [28, 30, 32, 35, 38]), q = p + T(rng, [5, 7, 10]);
        const gap = Mx * (q - p) / 100;
        if (!I(gap)) return null;
        return mk(rng, N, Mx, [
          [gap * 100 / q, "Divided the shortfall by the pass percentage only"],
          [gap * 100 / (q + p), "Added the two percentages"],
          [gap * 100 / p, "Divided the shortfall by the score percentage only"],
          [gap / (q - p), "Forgot to multiply by 100"],
        ], finish(d, `${who} scored **${p}%** of the total marks and failed by **${gap}** marks. The pass mark is **${q}%**. What are the maximum marks?`,
          [`Difference in percent = ${q}% − ${p}% = ${q - p}%`, `${q - p}% of Max = ${gap}, so Max = ${gap} × 100/${q - p} = **${N(Mx)}**`],
          `${q - p}% ↔ ${gap}, so 1% = ${N(R(gap / (q - p)))} and 100% = ${N(Mx)}.`,
          `The ${gap} marks are the gap between the two percentages, not ${q}% or ${p}% of the paper.`));
      }
      const Mx = T(rng, [200, 250, 300, 400, 500, 600, 750, 800]), q = T(rng, [30, 35, 40, 45]), pass = Mx * q / 100, a = rng.int(5, 25), X = pass - a;
      if (!I(pass) || X <= 0) return null;
      return mk(rng, N, Mx, [
        [(X - a) * 100 / q, "Subtracted the shortfall from the score"],
        [pass, "Gave the pass mark"],
        [X * 100 / q, "Ignored that the student failed by some marks"],
        [(X + a) * q / 100, "Multiplied instead of dividing"],
      ], finish(d, `To pass, a candidate needs **${q}%** of the maximum marks. ${who} got **${X}** marks and failed by **${a}** marks. Find the maximum marks.`,
        [`Pass mark = ${X} + ${a} = ${pass}`, `${q}% of Max = ${pass}, so Max = ${pass} × 100/${q} = **${N(Mx)}**`],
        `Pass mark = score + shortfall. Then divide by ${q}% (= ${QB.frac(q, 100)}).`,
        `Failing by ${a} marks means the pass mark is ${a} MORE than the score.`));
    }
    const Mx = T(rng, [200, 250, 300, 400, 500, 600, 800, 1000]), p1 = T(rng, [25, 30, 32, 35]), q = p1 + T(rng, [5, 8, 10]), p2 = q + T(rng, [5, 8, 10]);
    const a = Mx * (q - p1) / 100, b = Mx * (p2 - q) / 100, pass = Mx * q / 100;
    if (!I(a) || !I(b) || !I(pass)) return null;
    const askMax = rng.chance(0.5), ans = askMax ? Mx : pass;
    return mk(rng, N, ans, askMax ? [
      [(b - a) * 100 / (p2 - p1), "Subtracted the two margins instead of adding them"],
      [(a + b) * 100 / (p2 + p1), "Added the two percentages"],
      [(a + b) * 100 / p2, "Used only the higher percentage"],
      [(a + b) / (p2 - p1), "Forgot to multiply by 100"],
    ] : [
      [Mx, "Gave the maximum marks"],
      [Mx * p1 / 100, "Gave the first student's marks"],
      [Mx * p2 / 100, "Gave the second student's marks"],
      [pass + a, "Added the shortfall to the pass mark"],
    ], finish(d, `Two students sat the same paper. ${who} got **${p1}%** and failed by **${a}** marks, while a friend got **${p2}%** and passed by **${b}** marks. ${askMax ? "What are the maximum marks?" : "What is the pass mark (in marks)?"}`,
      [`The two scores differ by ${p2} − ${p1} = ${p2 - p1}% of Max, which is ${a} + ${b} = ${a + b} marks`, `Max = ${a + b} × 100/${p2 - p1} = ${N(Mx)}`, askMax ? `**${N(Mx)}**` : `Pass mark = ${p1}% of ${N(Mx)} + ${a} = **${N(pass)}**`],
      `The gap between the scores spans the pass mark: shortfall + surplus = ${a + b} marks = ${p2 - p1}% of Max.`,
      `Add the shortfall and the surplus (the pass mark lies between the two scores); subtracting them is a common slip.`));
  }) });

  /* ------------------------------------------------------------------ 10. back-calculating the original */
  QB.gen("quant/percentages/back-calc", { title: "Back-calculating the original value", gen: wrap((rng, d) => {
    if (d === "Easy") {
      const O = rng.int(2, 40) * 100, r = T(rng, [10, 20, 25, 40, 50]), dis = rng.chance(0.5);
      const F = O * (dis ? 1 - r / 100 : 1 + r / 100);
      if (!I(F)) return null;
      const item = T(rng, ["a school bag", "a pair of shoes", "a jacket", "a mixer grinder"]);
      return mk(rng, M, O, [
        [dis ? F * (1 + r / 100) : F * (1 - r / 100), `Took ${r}% of the final price and ${dis ? "added" : "removed"} it`],
        [dis ? F / (1 + r / 100) : F / (1 - r / 100), "Divided by the wrong factor"],
        [F * 100 / r, `Treated ${M(F)} as ${r}% of the original`],
        [F + r, `Added ${r} to the final price`],
      ], finish(d, dis ? `After a **${r}%** discount, ${item} costs **${M(F)}**. What was its original price?`
        : `After a **${r}%** price hike, ${item} costs **${M(F)}**. What was its price before the hike?`,
        [dis ? `After ${r}% off, the price is ${100 - r}% of the original` : `After ${r}% rise, the price is ${100 + r}% of the original`, `Original = ${M(F)} × 100/${dis ? 100 - r : 100 + r} = **${M(O)}**`],
        `${dis ? 100 - r : 100 + r}% ↔ ${M(F)}, so 1% = ${M(R(F / (dis ? 100 - r : 100 + r)))}; 100% = ${M(O)}.`,
        `Percents are taken on the ORIGINAL price, so you must divide by the factor, not apply ${r}% to ${M(F)}.`));
    }
    if (d === "Medium") {
      const kind = rng.int(0, 2);
      if (kind === 0) {
        const O = rng.int(2, 60) * 400, r = T(rng, [5, 8, 12, 15, 20, 25, 35]), F = O * (1 + r / 100);
        if (!I(F)) return null;
        const town = T(rng, ["Hubballi", "Gonda", "Bhilai", "Tirur", "Sambalpur"]);
        return mk(rng, N, O, [
          [F * (1 - r / 100), `Reduced ${M(F).slice(1)} by ${r}% of itself`],
          [F - r, `Subtracted ${r} from the population`],
          [F * 100 / r, `Treated ${N(F)} as ${r}% of last year's population`],
          [F / (1 - r / 100), "Divided by the wrong factor"],
        ], finish(d, `The population of ${town} grew by **${r}%** this year and is now **${N(F)}**. What was it last year?`,
          [`This year = ${100 + r}% of last year`, `Last year = ${N(F)} × 100/${100 + r} = **${N(O)}**`],
          `Divide by ${R(1 + r / 100)}: ${N(F)} ÷ ${R(1 + r / 100)} = ${N(O)}.`,
          `Subtracting ${r}% of ${N(F)} gives ${N(R(F * (1 - r / 100)))}, because ${r}% was taken on last year's population, not this year's.`));
      }
      if (kind === 1) {
        const x = rng.int(2, 60) * 20, p = T(rng, [12, 15, 18, 24, 35, 45, 60, 75, 8]), y = x * p / 100;
        if (!I(y)) return null;
        return mk(rng, N, x, [
          [y * p / 100, `Found ${p}% of ${N(y)} instead`],
          [y / p, "Divided by the percent without multiplying by 100"],
          [y * (100 + p) / 100, `Added ${p}% to ${N(y)}`],
          [y + p, `Added ${p} to ${N(y)}`],
        ], finish(d, `**${p}%** of a certain number is **${N(y)}**. What is the number?`,
          [`${p}% of x = ${N(y)}`, `x = ${N(y)} × 100/${p} = **${N(x)}**`],
          `1% = ${N(R(y / p))}, so the number is 100 × ${N(R(y / p))}.`,
          `${N(y)} is the small part; the number is bigger. If your answer is smaller than ${N(y)}, you went the wrong way.`));
      }
      const r = T(rng, [12.5, 20, 25, 40, 37.5, 62.5]), O = rng.int(2, 40) * 40, F = O * (1 - r / 100);
      if (!I(F)) return null;
      return mk(rng, N, O, [
        [F * (1 + r / 100), `Added ${r}% of the reduced number back`],
        [F + r, `Added ${r} to the reduced number`],
        [F / (1 + r / 100), "Divided by the wrong factor"],
        [F * 100 / r, `Treated ${N(F)} as ${r}% of the number`],
      ], finish(d, `A number reduced by **${r}%** becomes **${N(F)}**. Find the number.`,
        [`Remaining = ${100 - r}% of the number`, `Number = ${N(F)} × 100/${100 - r} = **${N(O)}**`],
        `${100 - r}% = ${QB.frac(Math.round((100 - r) * 100), 10000)} of the number, so multiply ${N(F)} by the reciprocal.`,
        `A ${r}% reduction leaves ${100 - r}%: the original is bigger by a factor of 100/${100 - r}, not by ${r}% of ${N(F)}.`));
    }
    const kind = rng.int(0, 2);
    if (kind === 0) {
      const a = T(rng, [10, 20, 25, 30, 40]), b = T(rng, [10, 20, 25, 40, 50]), O = rng.int(1, 30) * 1000, L = O * (1 - a / 100) * (1 - b / 100);
      if (!I(L) || a + b >= 90) return null;
      return mk(rng, M, O, [
        [L * 100 / (100 - a - b), `Added the two spending percents (${a + b}%)`],
        [L * (1 + (a + b) / 100), `Added ${a + b}% to what is left`],
        [L * 100 / (100 - a), `Undid only the first step`],
        [L * 100 / (100 - b), `Undid only the second step`],
      ], finish(d, `Tanvi spends **${a}%** of her salary on rent. From what remains she spends **${b}%** on groceries. She is left with **${M(L)}**. What is her salary?`,
        [`After rent: ${100 - a}% left. After groceries: ${100 - b}% of that.`, `Left = ${R((100 - a) * (100 - b) / 100)}% of salary = ${M(L)}`, `Salary = ${M(L)} × 100/${R((100 - a) * (100 - b) / 100)} = **${M(O)}**`],
        `Multiply the remaining fractions: ${R(1 - a / 100)} × ${R(1 - b / 100)} = ${R((1 - a / 100) * (1 - b / 100))}. Then divide.`,
        `The ${b}% is of what remains after rent, so the two percents cannot be added (${a + b}% would be wrong).`));
    }
    if (kind === 1) {
      const a = T(rng, [10, 20, 25, 30, 40, 50]), b = T(rng, [10, 20, 25, 30, 40, 50]), O = rng.int(2, 40) * 100, F = O * (1 + a / 100) * (1 - b / 100);
      if (!C(F) || a === b) return null;
      return mk(rng, M, O, [
        [F * 100 / (100 + a - b), `Used a single net change of ${a} − ${b} = ${a - b}%`],
        [F, "Assumed the rise and fall cancel out"],
        [F / (1 + a / 100) * (1 + b / 100) , "Undid the steps in the wrong order with the wrong factors"],
        [F * (1 - a / 100) / (1 - b / 100), "Took the percents off the final value"],
      ], finish(d, `The price of a camera was increased by **${a}%** and then reduced by **${b}%**. It now sells for **${M(F)}**. What was the price before the increase?`,
        [`Net factor = ${R(1 + a / 100)} × ${R(1 - b / 100)} = ${R((1 + a / 100) * (1 - b / 100) * 10000) / 10000}`, `Original = ${M(F)} ÷ ${R((1 + a / 100) * (1 - b / 100) * 10000) / 10000} = **${M(O)}**`],
        `Net change ${sg(net(a, -b))}. Divide the final price by (1 ${net(a, -b) < 0 ? "−" : "+"} ${R(Math.abs(net(a, -b)) / 100)}).`,
        `The net change is ${sg(net(a, -b))}, not ${sg(a - b)}: the ab/100 term matters.`));
    }
    const r = T(rng, [10, 20, 25]), O = rng.int(1, 20) * 100, Fi = O * (1 + r / 100) * (1 - r / 100);
    if (!C(Fi)) return null;
    return mk(rng, M, O, [
      [Fi, "Assumed +x% and −x% cancel out"],
      [Fi * 100 / (100 - r), `Undid only the ${r}% fall`],
      [Fi * 100 / (100 + r), `Undid only the ${r}% rise`],
      [Fi * (1 + r * r / 10000), `Added back only the ${R(r * r / 100)}% loss to the final price`],
    ], finish(d, `A trader raised the price of a tablet by **${r}%** and, when it did not sell, cut the new price by **${r}%**. It now costs **${M(Fi)}**. What was the original price?`,
      [`Net change = +${r} − ${r} − ${R(r * r / 100)} = −${P(R(r * r / 100))}`, `Original = ${M(Fi)} ÷ ${R(1 - r * r / 10000)} = **${M(O)}**`],
      `Up x% then down x% is always a loss of x²/100 %: here ${P(R(r * r / 100))}.`,
      `The same percent up and down does not cancel; the final price is ${P(R(r * r / 100))} below the original.`));
  }) });
})();
