/* =====================================================================
   Partnership: four question generators (one per catalog pattern).
   Easy / Medium / Hard, clean answers, wrong options from real mistakes.
   ===================================================================== */
(function () {
  const M = (x) => QB.money(x), N = (x) => QB.num(x);
  const R = (x) => QB.round(x, 2);
  const C = (x) => isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 95 };
  const NM = ["Arjun", "Meera", "Kiran", "Rohan", "Sneha", "Imran", "Divya", "Harsh", "Lakshmi", "Farhan", "Pooja", "Vikram", "Nisha", "Tarun", "Anita", "Suresh", "Gita", "Rahul", "Bhavna", "Deepak", "Ishaan", "Kavya", "Manoj", "Naina"];
  const names = (rng, n) => rng.shuffle(NM).slice(0, n);
  const BIZ = ["a tiffin service", "a bakery", "a stationery shop", "a printing press", "a dairy booth", "a tailoring unit", "a mobile repair shop", "a vegetable stall", "a cycle workshop", "a web-design studio"];
  const GAIN = ["profit", "annual profit", "net profit", "yearly profit"];
  const gcdA = (a) => a.reduce((x, y) => QB.gcd(x, y));

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("partnership: no clean question found");
    };
  }
  function mk(rng, f, ans, wrongs, extra) {
    if (!C(ans) || ans <= 0) return null;
    const A = f(R(ans)), seen = new Set([A.toLowerCase()]), pairs = [[A, null]];
    for (const w of wrongs) {
      if (pairs.length === 4) break;
      const v = w[0];
      if (!isFinite(v) || v <= 0 || !C(v)) continue;
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
  // profit that splits exactly in the ratio of the weights w: returns { P, sh: [shares] }
  function split(rng, w, lo, hi, step) {
    const g = gcdA(w), r = w.map((x) => x / g), s = r.reduce((a, b) => a + b, 0), u = rng.int(lo, hi) * step;
    return { P: s * u, sh: r.map((x) => x * u), r, s, u };
  }
  const rtxt = (r) => r.join(" : ");

  /* ------------------------------------------------------------------ 1. equal time */
  QB.gen("quant/partnership/equal-time", { title: "Partnership: equal time", gen: wrap((rng, d) => {
    const biz = T(rng, BIZ), gain = T(rng, GAIN);
    if (d === "Easy") {
      const nm = names(rng, 2), a = rng.int(1, 9), b = rng.int(1, 9);
      if (a === b || QB.gcd(a, b) !== 1) return null;
      const unit = T(rng, [5000, 10000, 20000, 25000, 2000]), X = a * unit, Y = b * unit, s = split(rng, [X, Y], 2, 30, 100), who = rng.int(0, 1);
      return mk(rng, M, s.sh[who], [
        [s.P / 2, "Shared the profit equally"],
        [s.sh[1 - who], "Gave the other partner's share"],
        [s.P * [X, Y][who] / (X + Y) * (who ? 1 : 1) + s.u, "Used a rounded ratio"],
        [s.P / [a, b][who], "Divided the profit by the ratio number"],
      ], finish(d, `${nm[0]} and ${nm[1]} start ${biz} with investments of **${M(X)}** and **${M(Y)}**. At the end of the year the ${gain} is **${M(s.P)}**. What is ${nm[who]}'s share?`,
        [`Ratio of investments = ${X} : ${Y} = ${a} : ${b}`, `${nm[who]}'s share = ${[a, b][who]}/${a + b} × ${M(s.P)} = **${M(s.sh[who])}**`],
        `Equal time means profit is divided in the ratio of capitals, ${a} : ${b}.`,
        `Do not split equally; the profit follows the money put in.`));
    }
    if (d === "Medium") {
      const nm = names(rng, 3), a = rng.int(1, 8), b = rng.int(1, 8), c = rng.int(1, 8);
      if (new Set([a, b, c]).size < 3 || QB.gcd(QB.gcd(a, b), c) !== 1) return null;
      const unit = T(rng, [5000, 10000, 20000, 2500, 4000]), cap = [a * unit, b * unit, c * unit], s = split(rng, cap, 2, 25, 100);
      const k = rng.int(0, 1);
      if (k === 0) {
        const w = rng.int(0, 2), g = (w + 1 + rng.int(0, 1)) % 3 === w ? (w + 1) % 3 : (w + 1) % 3;
        const known = w, ask = g;
        return mk(rng, M, s.P, [
          [s.sh[known] * 3, "Multiplied the known share by 3 (assumed equal split)"],
          [s.sh[known] * s.r.reduce((x, y) => x + y) / [a, b, c][ask], "Used the wrong partner's ratio term"],
          [s.sh[ask], "Gave the other partner's share"],
          [s.P - s.sh[known], "Gave what the others receive"],
        ], finish(d, `${nm[0]}, ${nm[1]} and ${nm[2]} invest **${M(cap[0])}**, **${M(cap[1])}** and **${M(cap[2])}** in ${biz} for the same period. ${nm[known]}'s share of the ${gain} is **${M(s.sh[known])}**. What is the total ${gain}?`,
          [`Ratio of investments = ${rtxt(s.r)} (sum ${s.s})`, `${nm[known]}'s ${s.r[known]} parts = ${M(s.sh[known])}, so 1 part = ${M(s.u)}`, `Total = ${s.s} × ${M(s.u)} = **${M(s.P)}**`],
          `Total = share × (sum of ratio terms) ÷ (partner's term) = ${s.sh[known]} × ${s.s} ÷ ${s.r[known]}.`,
          `A partner's share is only part of the total; scale up by ${s.s}/${s.r[known]}.`));
      }
      const w = rng.int(0, 2), o1 = (w + 1) % 3, o2 = (w + 2) % 3;
      return mk(rng, M, s.sh[w], [
        [s.P / 3, "Divided the profit equally among the three"],
        [s.sh[o1], "Gave another partner's share"],
        [s.sh[o2], "Gave the third partner's share"],
        [s.P - s.sh[w], "Gave the total of the other two"],
      ], finish(d, `${nm[0]}, ${nm[1]} and ${nm[2]} invest **${M(cap[0])}**, **${M(cap[1])}** and **${M(cap[2])}** in ${biz} and run it for the same time. The ${gain} is **${M(s.P)}**. Find ${nm[w]}'s share.`,
        [`Ratio = ${rtxt(s.r)}, sum = ${s.s}`, `${nm[w]}'s share = ${s.r[w]}/${s.s} × ${M(s.P)} = **${M(s.sh[w])}**`],
        `Reduce the capitals to ${rtxt(s.r)}, then share ${M(s.P)} in that ratio.`,
        `Reduce the ratio first; large rupee figures make mistakes easy.`));
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      // A invests m times B, B invests n times C
      const nm = names(rng, 3), m = rng.int(2, 5), n = rng.int(2, 4);
      const Cc = 1, B = n, A = m * n, s = split(rng, [A, B, Cc], 2, 40, 100);
      const w = T(rng, [0, 1, 2]);
      return mk(rng, M, s.sh[w], [
        [s.P * [m, n, 1][w] / (m + n + 1), "Used the multipliers directly as the ratio"],
        [s.P / 3, "Divided the profit equally among the three"],
        [s.sh[(w + 1) % 3], "Gave another partner's share"],
        [s.P * [A, B, Cc][w] / (A + B + Cc + 1), "Added an extra part to the denominator"],
      ], finish(d, `In a partnership, ${nm[0]} invests **${m} times** as much as ${nm[1]}, and ${nm[1]} invests **${n} times** as much as ${nm[2]}. All three stay for the full year and the ${gain} is **${M(s.P)}**. How much does ${nm[w]} get?`,
        [`Let ${nm[2]} = 1. Then ${nm[1]} = ${n}, ${nm[0]} = ${m} × ${n} = ${A}`, `Ratio = ${A} : ${B} : ${Cc}, sum = ${A + B + Cc}`, `${nm[w]} = ${[A, B, Cc][w]}/${A + B + Cc} × ${M(s.P)} = **${M(s.sh[w])}**`],
        `Start from the smallest investor (=1) and multiply upward: ${A} : ${B} : 1.`,
        `${nm[1]} is the link: he is ${n} for ${nm[2]} but also 1/${m} of ${nm[0]}. Work outward from ${nm[2]}.`));
    }
    if (k === 1) {
      // third partner invests so that ... half of the other two
      const nm = names(rng, 3), a = rng.int(1, 8), b = rng.int(1, 8);
      if (a === b || QB.gcd(a, b) !== 1 || (a + b) % 2) return null;
      const unit = T(rng, [3000, 5000, 10000, 2000]), cA = a * unit, cB = b * unit, cC = (cA + cB) / 2;
      const s = split(rng, [cA, cB, cC], 2, 20, 100);
      const w = rng.int(0, 2);
      return mk(rng, M, s.sh[w], [
        [s.P * [cA, cB, cC][w] / (cA + cB + cC) * 2, "Doubled a wrong share"],
        [s.P * [cA, cB, cC][w] / (cA + cB), "Ignored the third partner when dividing"],
        [s.P / 3, "Divided the profit equally"],
        [s.sh[(w + 1) % 3], "Gave another partner's share"],
      ], finish(d, `${nm[0]} invests **${M(cA)}** and ${nm[1]} invests **${M(cB)}**. ${nm[2]} joins with an amount equal to **half of their combined investment**. If all are in for the same time and the ${gain} is **${M(s.P)}**, find ${nm[w]}'s share.`,
        [`${nm[2]} invests (${cA} + ${cB})/2 = ${M(cC)}`, `Ratio = ${rtxt(s.r)}, sum = ${s.s}`, `${nm[w]} = ${s.r[w]}/${s.s} × ${M(s.P)} = **${M(s.sh[w])}**`],
        `Work out the third capital first, then reduce the three capitals to a ratio.`,
        `The third partner's capital is half the SUM of the other two, not half of each.`));
    }
    // given two shares of a profit, find an unknown investment
    const nm = names(rng, 2), a = rng.int(1, 8), b = rng.int(1, 8);
    if (a === b || QB.gcd(a, b) !== 1) return null;
    const unit = T(rng, [5000, 10000, 4000, 2500, 20000]), X = a * unit, Y = b * unit, s = split(rng, [X, Y], 2, 20, 100);
    return mk(rng, M, Y, [
      [X * s.sh[1] / s.sh[0] * 0 + X * s.sh[0] / s.sh[1], "Inverted the proportion"],
      [s.sh[1], "Gave the profit share instead of the investment"],
      [X + (s.sh[1] - s.sh[0]), "Added the difference in profit shares to the investment"],
      [X * s.P / s.sh[0], "Scaled by the wrong ratio"],
    ], finish(d, `${nm[0]} and ${nm[1]} run ${biz} for the same period. ${nm[0]} invests **${M(X)}** and receives **${M(s.sh[0])}** of the ${gain}, while ${nm[1]} receives **${M(s.sh[1])}**. How much did ${nm[1]} invest?`,
      [`Equal time: investment ∝ profit share`, `${nm[1]}'s investment = ${M(X)} × ${s.sh[1]} ÷ ${s.sh[0]} = **${M(Y)}**`],
      `Investment ratio = profit ratio = ${s.sh[0]} : ${s.sh[1]}; scale from ${nm[0]}'s ${M(X)}.`,
      `The larger share goes with the larger investment, so multiply by ${s.sh[1]}/${s.sh[0]}, not the reverse.`));
  }) });

  /* ------------------------------------------------------------------ 2. different times */
  QB.gen("quant/partnership/different-times", { title: "Partnership: different times", gen: wrap((rng, d) => {
    const biz = T(rng, BIZ), gain = T(rng, GAIN);
    if (d === "Easy") {
      const nm = names(rng, 2), p = rng.int(1, 8), q = rng.int(1, 8), t1 = T(rng, [12, 12, 9, 8, 6, 10]), t2 = T(rng, [3, 4, 5, 6, 7, 8, 9]);
      if (t1 === t2) return null;
      const unit = T(rng, [2000, 3000, 5000, 10000, 4000]), X = p * unit, Y = q * unit, s = split(rng, [X * t1, Y * t2], 2, 25, 100), w = rng.int(0, 1);
      return mk(rng, M, s.sh[w], [
        [s.P * [X, Y][w] / (X + Y), "Ignored the time and used only the investments"],
        [s.P * [t1, t2][w] / (t1 + t2), "Ignored the investments and used only the time"],
        [s.sh[1 - w], "Gave the other partner's share"],
        [s.P / 2, "Shared the profit equally"],
      ], finish(d, `${nm[0]} invests **${M(X)}** in ${biz} for **${t1} months**, and ${nm[1]} invests **${M(Y)}** for **${t2} months**. The ${gain} is **${M(s.P)}**. Find ${nm[w]}'s share.`,
        [`Capital × time: ${X}×${t1} : ${Y}×${t2} = ${X * t1} : ${Y * t2} = ${rtxt(s.r)}`, `${nm[w]} = ${s.r[w]}/${s.s} × ${M(s.P)} = **${M(s.sh[w])}**`],
        `Profit ratio = (investment × months) for each; reduce and divide.`,
        `Different durations: money × time is what counts, not the money alone.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      if (k === 0) {
        const nm = names(rng, 2), p = rng.int(1, 9), q = rng.int(1, 9), j = rng.int(2, 8), unit = T(rng, [2000, 3000, 5000, 10000, 4000]);
        const X = p * unit, Y = q * unit, wA = X * 12, wB = Y * (12 - j);
        const s = split(rng, [wA, wB], 2, 25, 100), w = rng.int(0, 1);
        return mk(rng, M, s.sh[w], [
          [s.P * [X, Y][w] / (X + Y), "Ignored the late joining and used only the investments"],
          [s.P * [12, 12 - j][w] / (24 - j), "Used only the months"],
          [s.sh[1 - w], "Gave the other partner's share"],
          [s.P * [X * 12, Y * j][w] / (X * 12 + Y * j), "Used the months before joining instead of after"],
        ], finish(d, `${nm[0]} starts ${biz} with **${M(X)}**. After **${j} months**, ${nm[1]} joins with **${M(Y)}**. At the end of the year the ${gain} is **${M(s.P)}**. Find ${nm[w]}'s share.`,
          [`${nm[0]}: ${X} × 12 = ${wA}; ${nm[1]} stays 12 − ${j} = ${12 - j} months: ${Y} × ${12 - j} = ${wB}`, `Ratio = ${rtxt(s.r)}; ${nm[w]} = ${s.r[w]}/${s.s} × ${M(s.P)} = **${M(s.sh[w])}**`],
          `A joining after ${j} months is in for ${12 - j} months of the year.`,
          `The late partner's time is 12 − ${j} = ${12 - j}, not ${j}.`));
      }
      const nm = names(rng, 3), t = [12, rng.int(5, 11), rng.int(2, 8)], unit = T(rng, [2000, 3000, 4000, 5000]);
      const cap = [rng.int(2, 9) * unit, rng.int(2, 9) * unit, rng.int(2, 9) * unit], wt = cap.map((c, i) => c * t[i]);
      const s = split(rng, wt, 2, 20, 100), w = rng.int(0, 2);
      if (new Set(t).size < 3) return null;
      return mk(rng, M, s.sh[w], [
        [s.P * cap[w] / (cap[0] + cap[1] + cap[2]), "Ignored the time and used only the investments"],
        [s.P * t[w] / (t[0] + t[1] + t[2]), "Ignored the investments and used only the time"],
        [s.P / 3, "Divided the profit equally"],
        [s.sh[(w + 1) % 3], "Gave another partner's share"],
      ], finish(d, `${nm[0]}, ${nm[1]} and ${nm[2]} invest **${M(cap[0])}** for **${t[0]} months**, **${M(cap[1])}** for **${t[1]} months** and **${M(cap[2])}** for **${t[2]} months** respectively. The ${gain} is **${M(s.P)}**. Find ${nm[w]}'s share.`,
        [`Capital × months: ${wt.map((x) => N(x)).join(" : ")} = ${rtxt(s.r)}`, `${nm[w]} = ${s.r[w]}/${s.s} × ${M(s.P)} = **${M(s.sh[w])}**`],
        `Multiply each capital by its months, reduce, then divide the profit.`,
        `All three products must be built before you divide, otherwise one partner is left out.`));
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      // investment ratio and time ratio given -> profit ratio -> a share
      const nm = names(rng, 2), a = rng.int(2, 9), b = rng.int(2, 9), c = rng.int(2, 9), e = rng.int(2, 9);
      if (a === b || c === e) return null;
      const wA = a * c, wB = b * e, s = split(rng, [wA, wB], 2, 25, 100), w = rng.int(0, 1);
      return mk(rng, M, s.sh[w], [
        [s.P * [a, b][w] / (a + b), "Used only the investment ratio"],
        [s.P * [c, e][w] / (c + e), "Used only the time ratio"],
        [s.P * [a * e, b * c][w] / (a * e + b * c), "Crossed the investment and time ratios"],
        [s.sh[1 - w], "Gave the other partner's share"],
      ], finish(d, `${nm[0]} and ${nm[1]} invest in ${biz} in the ratio **${a} : ${b}**, and their periods of investment are in the ratio **${c} : ${e}**. The ${gain} is **${M(s.P)}**. Find ${nm[w]}'s share.`,
        [`Profit ratio = (${a}×${c}) : (${b}×${e}) = ${wA} : ${wB} = ${rtxt(s.r)}`, `${nm[w]} = ${s.r[w]}/${s.s} × ${M(s.P)} = **${M(s.sh[w])}**`],
        `Multiply the investment term by the time term of the SAME partner.`,
        `Pair first with first and second with second; crossing them gives the wrong ratio.`));
    }
    if (k === 1) {
      // find months of the second partner
      const nm = names(rng, 2), p = rng.int(1, 9), q = rng.int(1, 9), t1 = T(rng, [12, 10, 8, 6]), t2 = rng.int(2, 11);
      if (p === q || t1 === t2) return null;
      const unit = T(rng, [3000, 5000, 4000, 2000]), X = p * unit, Y = q * unit, g = QB.gcd(X * t1, Y * t2), ra = X * t1 / g, rb = Y * t2 / g;
      return mk(rng, N, t2, [
        [t1 * X / Y * rb / ra * 0 + t1 * X * rb / (Y * ra) * 0 + t1 * ra / rb, "Inverted the profit ratio"],
        [t1 * rb / ra, "Ignored the investments"],
        [t1 * Y / X, "Ignored the profit ratio"],
        [t2 + 1, "Slipped by one month"],
      ], finish(d, `${nm[0]} invests **${M(X)}** for **${t1} months** and ${nm[1]} invests **${M(Y)}** for some months. Their profits are in the ratio **${ra} : ${rb}**. For how many months was ${nm[1]}'s money invested?`,
        [`${X} × ${t1} : ${Y} × t = ${ra} : ${rb}`, `${Y} t × ${ra} = ${X * t1} × ${rb} → t = **${t2}**`],
        `Set (capital × time) ratio equal to the profit ratio and solve for t.`,
        `Write the ratio in the same order as the profits: ${nm[0]} first, ${nm[1]} second.`));
    }
    // three partners with join times, given one share find the total or another share
    const nm = names(rng, 3), j2 = rng.int(1, 5), j3 = j2 + rng.int(1, 5);
    if (j3 > 10) return null;
    const unit = T(rng, [2000, 3000, 5000, 4000]), cap = [rng.int(2, 8) * unit, rng.int(2, 8) * unit, rng.int(2, 8) * unit], mo = [12, 12 - j2, 12 - j3];
    const wt = cap.map((c, i) => c * mo[i]), s = split(rng, wt, 2, 20, 100), w = rng.int(0, 2), ask = (w + 1 + rng.int(0, 1)) % 3;
    if (ask === w) return null;
    return mk(rng, M, s.sh[ask], [
      [s.sh[w], "Gave the known share back"],
      [s.sh[ask] * [cap[w] / cap[ask]][0] , "Scaled by the investments alone"],
      [s.P - s.sh[w] - s.sh[ask], "Gave the third partner's share"],
      [s.sh[w] * mo[ask] / mo[w], "Scaled by the months alone"],
    ], finish(d, `${nm[0]} starts a business with **${M(cap[0])}**. ${nm[1]} joins after **${j2} months** with **${M(cap[1])}** and ${nm[2]} joins after **${j3} months** with **${M(cap[2])}**. At the end of the year, ${nm[w]}'s share of the ${gain} is **${M(s.sh[w])}**. Find ${nm[ask]}'s share.`,
      [`Months in business: ${mo.join(", ")}`, `Capital × months = ${wt.map((x) => N(x)).join(" : ")} = ${rtxt(s.r)}`, `${nm[ask]}'s share = ${s.r[ask]} × ${M(s.u)} = **${M(s.sh[ask])}**`],
      `${nm[w]} has ${s.r[w]} parts = ${M(s.sh[w])}; ${nm[ask]} has ${s.r[ask]} parts.`,
      `Each late partner is in for 12 minus the joining month, not the joining month itself.`));
  }) });

  /* ------------------------------------------------------------------ 3. working partner's salary */
  QB.gen("quant/partnership/working-partner-s-salary", { title: "Working partner's salary", gen: wrap((rng, d) => {
    const biz = T(rng, BIZ), gain = T(rng, ["profit", "annual profit", "net profit"]);
    const nm = names(rng, 2);
    if (d === "Easy") {
      const a = rng.int(1, 9), b = rng.int(1, 9), x = T(rng, [10, 20, 25, 5, 15]);
      if (a === b || QB.gcd(a, b) !== 1) return null;
      const unit = T(rng, [5000, 10000, 2000, 4000]), X = a * unit, Y = b * unit;
      const rest = (a + b) * rng.int(2, 30) * 100 / 4;
      const P = rest / (1 - x / 100);
      if (!Number.isInteger(P) || P % 100) return null;
      const salary = P * x / 100, remain = P - salary, shB = remain * b / (a + b);
      if (!C(shB)) return null;
      return mk(rng, M, shB, [
        [P * b / (a + b), "Forgot to take off the working partner's commission first"],
        [remain * a / (a + b), "Gave the other partner's share of the remainder"],
        [shB + salary, "Added the commission to the non-working partner"],
        [P * x / 100, "Gave the commission itself"],
      ], finish(d, `${nm[0]} and ${nm[1]} invest **${M(X)}** and **${M(Y)}** in ${biz}. ${nm[0]} manages the business and gets **${x}%** of the ${gain} as a fee; the rest is divided in the ratio of investments. If the ${gain} is **${M(P)}**, what does ${nm[1]} receive?`,
        [`Fee = ${x}% of ${M(P)} = ${M(salary)}; remainder = ${M(remain)}`, `Ratio of investments = ${a} : ${b}`, `${nm[1]} = ${b}/${a + b} × ${M(remain)} = **${M(shB)}**`],
        `Remove the fee first, then split what is left in ratio ${a} : ${b}.`,
        `The fee comes off the top. Splitting the whole ${gain} by capital over-pays ${nm[1]}.`));
    }
    if (d === "Medium") {
      const a = rng.int(1, 9), b = rng.int(1, 9), x = T(rng, [10, 20, 25, 5, 15, 12, 8]);
      if (a === b || QB.gcd(a, b) !== 1) return null;
      const unit = T(rng, [5000, 10000, 4000, 2500]), X = a * unit, Y = b * unit;
      const P = rng.int(5, 80) * 1000 + rng.int(0, 1) * 500;
      const fee = P * x / 100, rem = P - fee, shA = rem * a / (a + b), total = fee + shA;
      if (!C(total) || !C(shA)) return null;
      return mk(rng, M, total, [
        [P * a / (a + b), "Ignored the fee for managing"],
        [shA, "Gave only the investment share and left out the fee"],
        [fee + P * a / (a + b), "Added the fee to a share of the whole profit"],
        [fee + rem / 2, "Divided the remainder equally"],
      ], finish(d, `${nm[0]} (investing **${M(X)}**) and ${nm[1]} (investing **${M(Y)}**) run ${biz}. ${nm[0]} works in it and receives **${x}%** of the ${gain} as a fee; the balance is shared in the ratio of capital. The ${gain} is **${M(P)}**. How much does ${nm[0]} get in all?`,
        [`Fee = ${x}% of ${M(P)} = ${M(fee)}; balance = ${M(rem)}`, `${nm[0]}'s capital share = ${a}/${a + b} × ${M(rem)} = ${M(shA)}`, `Total = ${M(fee)} + ${M(shA)} = **${M(total)}**`],
        `Two incomes for the working partner: fee + share of the balance.`,
        `The working partner earns BOTH the fee and a share of the remaining profit.`));
    }
    const k = rng.int(0, 1);
    if (k === 0) {
      // monthly salary
      const a = rng.int(1, 9), b = rng.int(1, 9), sal = rng.int(2, 15) * 1000;
      if (a === b || QB.gcd(a, b) !== 1) return null;
      const unit = T(rng, [5000, 10000, 4000, 2500]), X = a * unit, Y = b * unit;
      const rem = (a + b) * rng.int(5, 40) * 500, P = rem + sal * 12, shA = rem * a / (a + b), total = shA + sal * 12;
      if (!C(P) || !C(total)) return null;
      return mk(rng, M, total, [
        [P * a / (a + b), "Ignored the salary"],
        [shA, "Gave only the investment share"],
        [shA + sal, "Counted only one month's salary"],
        [sal * 12 + P / 2, "Divided the whole profit equally"],
      ], finish(d, `${nm[0]} invests **${M(X)}** and ${nm[1]} invests **${M(Y)}** in ${biz}. ${nm[0]} also manages it and draws a salary of **${M(sal)} per month**; the remaining ${gain} is divided in the ratio of capitals. If the total ${gain} for the year (before the salary) is **${M(P)}**, how much does ${nm[0]} get in the year?`,
        [`Yearly salary = 12 × ${M(sal)} = ${M(sal * 12)}`, `Balance = ${M(P)} − ${M(sal * 12)} = ${M(rem)}; ${nm[0]}'s share = ${a}/${a + b} × ${M(rem)} = ${M(shA)}`, `Total = **${M(total)}**`],
        `Salary for 12 months comes off the top; the rest is split ${a} : ${b}.`,
        `A monthly salary must be multiplied by 12 before it is deducted.`));
    }
    // difference between receipts given -> profit
    const a = rng.int(1, 9), b = rng.int(1, 9), x = T(rng, [10, 20, 25, 5, 15, 40]);
    if (a <= b || QB.gcd(a, b) !== 1) return null;
    const P = (a + b) * rng.int(2, 30) * 100 * 5 / QB.gcd(5, 1), fee = P * x / 100, rem = P - fee;
    const recA = fee + rem * a / (a + b), recB = rem * b / (a + b), diff = recA - recB;
    if (!C(diff) || !C(P) || diff <= 0) return null;
    return mk(rng, M, P, [
      [diff * (a + b) / (a - b), "Ignored the fee"],
      [diff * 100 / x, "Treated the difference as the fee"],
      [diff + rem, "Added the balance to the difference"],
      [recA, "Gave the working partner's total"],
    ], finish(d, `${nm[0]} (working partner) and ${nm[1]} (sleeping partner) invest in the ratio **${a} : ${b}** in ${biz}. ${nm[0]} gets **${x}%** of the ${gain} as a fee and both share the rest in the ratio of investment. ${nm[0]} ends up with **${M(diff)}** more than ${nm[1]}. What is the ${gain}?`,
      [`Let ${gain} = P. Fee = ${x}% of P, balance = ${100 - x}% of P`, `Difference = ${x}% P + (${a} − ${b})/${a + b} × ${100 - x}% P = ${R((x + (a - b) * (100 - x) / (a + b)))}% of P`, `P = ${M(diff)} ÷ ${R((x + (a - b) * (100 - x) / (a + b))) / 100} = **${M(P)}**`],
      `Difference as a fraction of P = fee% + (a − b)/(a + b) × (100 − fee)%.`,
      `${nm[0]} is ahead by the fee AND by the larger capital share of the balance.`));
  }) });

  /* ------------------------------------------------------------------ 4. investment changed midway */
  QB.gen("quant/partnership/investment-changed-midway", { title: "Partnership: investment changed midway", gen: wrap((rng, d) => {
    const biz = T(rng, BIZ), gain = T(rng, ["profit", "annual profit", "yearly profit"]);
    const nm = names(rng, 2);
    if (d === "Easy") {
      const t = T(rng, [3, 4, 6, 8, 9]), unit = T(rng, [1000, 2000, 3000, 5000]);
      const A0 = rng.int(2, 9) * unit, add = rng.int(1, 5) * unit, B = rng.int(2, 12) * unit;
      const wA = A0 * t + (A0 + add) * (12 - t), wB = B * 12, s = split(rng, [wA, wB], 2, 25, 100), w = rng.int(0, 1);
      return mk(rng, M, s.sh[w], [
        [s.P * [A0, B][w] / (A0 + B), "Used only the starting investments"],
        [s.P * [A0 + add, B][w] / (A0 + add + B), "Used the new investment for the whole year"],
        [s.sh[1 - w], "Gave the other partner's share"],
        [s.P * [A0 * t + (A0 + add) * t, wB][w] / (A0 * t + (A0 + add) * t + wB), "Counted the extra investment for the wrong number of months"],
      ], finish(d, `${nm[0]} starts ${biz} with **${M(A0)}** and adds **${M(add)}** more after **${t} months**. ${nm[1]} invests **${M(B)}** for the whole year. The ${gain} is **${M(s.P)}**. Find ${nm[w]}'s share.`,
        [`${nm[0]}: ${A0} × ${t} + ${A0 + add} × ${12 - t} = ${wA}`, `${nm[1]}: ${B} × 12 = ${wB}; ratio = ${rtxt(s.r)}`, `${nm[w]} = ${s.r[w]}/${s.s} × ${M(s.P)} = **${M(s.sh[w])}**`],
        `Split the year: capital × months for each stretch, then add.`,
        `After the change, the NEW capital stays for the remaining ${12 - t} months only.`));
    }
    if (d === "Medium") {
      const t = T(rng, [3, 4, 5, 6, 8]), unit = T(rng, [1000, 2000, 5000, 4000]);
      const k = rng.int(0, 1);
      const A0 = rng.int(3, 10) * unit, out = rng.int(1, 3) * unit, B0 = rng.int(2, 12) * unit;
      if (out >= A0) return null;
      const wA = A0 * t + (A0 - out) * (12 - t), wB = B0 * 12;
      const s = split(rng, [wA, wB], 2, 25, 100), w = rng.int(0, 1);
      if (k === 0) {
        return mk(rng, M, s.sh[w], [
          [s.P * [A0, B0][w] / (A0 + B0), "Used only the starting investments"],
          [s.P * [A0 - out, B0][w] / (A0 - out + B0), "Used the reduced investment for the whole year"],
          [s.sh[1 - w], "Gave the other partner's share"],
          [s.P * [A0 * (12 - t) + (A0 - out) * t, wB][w] / (A0 * (12 - t) + (A0 - out) * t + wB), "Swapped the two periods"],
        ], finish(d, `${nm[0]} invests **${M(A0)}** in ${biz} but withdraws **${M(out)}** after **${t} months**. ${nm[1]} invests **${M(B0)}** throughout the year. The ${gain} is **${M(s.P)}**. Find ${nm[w]}'s share.`,
          [`${nm[0]}: ${A0} × ${t} + ${A0 - out} × ${12 - t} = ${wA}`, `${nm[1]}: ${B0} × 12 = ${wB}; ratio = ${rtxt(s.r)}`, `${nm[w]} = **${M(s.sh[w])}**`],
          `Original capital for ${t} months, reduced capital for ${12 - t} months.`,
          `After a withdrawal the partner's capital falls for the rest of the year.`));
      }
      // find the third item: B's investment from profit ratio
      const g = QB.gcd(wA, wB);
      return mk(rng, M, B0, [
        [B0 * 12 / (12 - t), "Divided the months wrongly"],
        [A0, "Gave the other partner's investment"],
        [wB / 11, "Used 11 months for the second partner"],
        [(A0 + A0 - out) / 2, "Used the average of A's two capitals"],
      ], finish(d, `${nm[0]} invests **${M(A0)}** in ${biz} and withdraws **${M(out)}** after **${t} months**. ${nm[1]} invests for the whole year. At year end the profits are shared **${wA / g} : ${wB / g}** between ${nm[0]} and ${nm[1]}. How much did ${nm[1]} invest?`,
        [`${nm[0]}: ${A0} × ${t} + ${A0 - out} × ${12 - t} = ${wA}`, `${wA} : ${nm[1]}'s capital × 12 = ${wA / g} : ${wB / g}`, `${nm[1]}'s capital = ${wB} ÷ 12 = **${M(B0)}**`],
        `${nm[0]}'s capital-months are ${N(wA)}; scale by the ratio, then divide by 12.`,
        `${nm[1]} is in for the full 12 months, so divide the capital-months by 12.`));
    }
    const k = rng.int(0, 1), unit = T(rng, [1000, 2000, 5000]);
    if (k === 0) {
      // both change midway
      const t = T(rng, [3, 4, 6, 8]), A0 = rng.int(3, 10) * unit, addA = rng.int(1, 4) * unit, B0 = rng.int(3, 10) * unit, outB = rng.int(1, 2) * unit, tb = T(rng, [4, 6, 9]);
      if (outB >= B0 || t === tb) return null;
      const wA = A0 * t + (A0 + addA) * (12 - t), wB = B0 * tb + (B0 - outB) * (12 - tb);
      const s = split(rng, [wA, wB], 2, 25, 100), w = rng.int(0, 1);
      return mk(rng, M, s.sh[w], [
        [s.P * [A0 * 12, B0 * 12][w] / ((A0 + B0) * 12), "Used the starting investments for the full year"],
        [s.P * [A0 + addA, B0 - outB][w] / (A0 + addA + B0 - outB), "Used only the final investments"],
        [s.sh[1 - w], "Gave the other partner's share"],
        [s.P * [A0 * (12 - t) + (A0 + addA) * t, wB][w] / (A0 * (12 - t) + (A0 + addA) * t + wB), "Swapped the periods for the first partner"],
      ], finish(d, `${nm[0]} invests **${M(A0)}** in ${biz} and adds **${M(addA)}** after **${t} months**. ${nm[1]} invests **${M(B0)}** and takes out **${M(outB)}** after **${tb} months**. The yearly ${gain} is **${M(s.P)}**. Find ${nm[w]}'s share.`,
        [`${nm[0]}: ${A0}×${t} + ${A0 + addA}×${12 - t} = ${N(wA)}`, `${nm[1]}: ${B0}×${tb} + ${B0 - outB}×${12 - tb} = ${N(wB)}; ratio = ${rtxt(s.r)}`, `${nm[w]} = ${s.r[w]}/${s.s} × ${M(s.P)} = **${M(s.sh[w])}**`],
        `Build each partner's capital-months in two stretches, then take the ratio.`,
        `Both partners change, so the two stretches are different for each; do not reuse one partner's month split for the other.`));
    }
    // find profit when one share known; capital changes twice
    const t1 = T(rng, [2, 3, 4]), t2 = t1 + T(rng, [2, 3, 4]), A0 = rng.int(3, 8) * unit, A1 = rng.int(2, 10) * unit, A2 = rng.int(2, 10) * unit, B0 = rng.int(3, 10) * unit;
    if (t2 >= 12 || A1 === A0 || A2 === A1) return null;
    const wA = A0 * t1 + A1 * (t2 - t1) + A2 * (12 - t2), wB = B0 * 12, s = split(rng, [wA, wB], 2, 25, 100), w = rng.int(0, 1);
    return mk(rng, M, s.P, [
      [s.sh[w] * 2, "Doubled the known share (assumed an equal split)"],
      [s.sh[w] * (A0 + B0) / [A0, B0][w], "Used only the starting investments"],
      [s.sh[1 - w], "Gave the other partner's share"],
      [s.sh[w] + s.sh[w] * [A2, B0][w] / [B0, A2][w], "Used the final investments only"],
    ], finish(d, `${nm[0]} starts ${biz} with **${M(A0)}**, changes it to **${M(A1)}** after **${t1} months** and to **${M(A2)}** after **${t2} months**. ${nm[1]} keeps **${M(B0)}** invested for the full year. ${nm[w]}'s share of the ${gain} is **${M(s.sh[w])}**. What is the total ${gain}?`,
      [`${nm[0]}: ${A0}×${t1} + ${A1}×${t2 - t1} + ${A2}×${12 - t2} = ${N(wA)}`, `${nm[1]}: ${B0} × 12 = ${N(wB)}; ratio = ${rtxt(s.r)}`, `${nm[w]} has ${s.r[w]} parts = ${M(s.sh[w])}; total = ${s.s} parts = **${M(s.P)}**`],
      `Three stretches for ${nm[0]}: ${t1}, ${t2 - t1} and ${12 - t2} months; they add up to 12.`,
      `Check that the stretch lengths add to 12 months before taking the ratio.`));
  }) });
})();
