/* =====================================================================
   Simple & compound interest: seven question generators (one per catalog pattern).
   Easy / Medium / Hard, clean answers, every wrong option comes from a real mistake.
   ===================================================================== */
(function () {
  const M = (x) => QB.money(x), N = (x) => QB.num(x), P = (x) => QB.pct(x);
  const R = (x) => QB.round(x, 2);
  const C = (x) => isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const I = Number.isInteger;
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 95 };
  const WHO = ["Ravi", "Meena", "Farhan", "Lakshmi", "Suresh", "Anita", "Kiran", "Deepa", "Imran", "Pooja", "Harish", "Nisha", "Vikram", "Sana"];
  const WHERE = ["a bank", "a cooperative society", "a post-office scheme", "a finance company", "a credit union", "a local lender"];
  const yrs = (t) => t + (t === 1 ? " year" : " years");
  const pw = (x, n) => Math.pow(x, n);

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 2000; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("interest: no clean question found");
    };
  }
  function mk(rng, f, ans, wrongs, extra) {
    if (!C(ans) || ans <= 0) return null;
    const A = f(R(ans));
    const seen = new Set([A.toLowerCase()]);
    const pairs = [[A, null]];
    for (const w of wrongs) {
      if (pairs.length === 4) break;
      const v = w[0];
      if (!isFinite(v) || v <= 0 || Math.abs(v - ans) < 0.2) continue;
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
  // prefix a context sentence (random name, place, amount) for variety; the maths does not depend on it
  const LEADS = [
    (w, b) => `${w} is comparing schemes at ${b}.`,
    (w, b) => `${w} has a little money to put aside with ${b}.`,
    (w, b) => `After a festival bonus, ${w} visits ${b} to ask about interest.`,
    (w, b) => `${w}'s family keeps its savings with ${b}.`,
    (w, b) => `${w} reads an offer from ${b}.`,
    (w, b) => `While planning a purchase, ${w} asks ${b} about interest rates.`,
    (w, b) => `${w} wants to understand how ${b} works out interest.`,
    (w, b) => `A notice at ${b} caught ${w}'s eye.`,
  ];
  function lead(fn) {
    return function (rng, d) {
      const r = fn(rng, d);
      const w = T(rng, WHO), b = T(rng, WHERE);
      r.q = T(rng, LEADS)(w, b) + " " + r.q;
      return r;
    };
  }
  const ci = (p, r, t) => p * pw(1 + r / 100, t);

  /* ------------------------------------------------------------ 1. SI basics: find SI / P / R / T */
  QB.gen("quant/interest/si-basics-find-p-r", { title: "SI basics; find P / R / T", gen: wrap((rng, d) => {
    const w = T(rng, WHO), bk = T(rng, WHERE);
    const Rs = d === "Easy" ? [5, 6, 8, 10, 12, 4, 15] : [4, 5, 6, 7, 8, 9, 10, 12, 12.5, 15, 7.5, 6.25, 3.5, 4.5, 11];
    if (d === "Easy") {
      const p = rng.int(2, 60) * 500, r = T(rng, Rs), t = rng.int(1, 6), si = p * r * t / 100;
      if (!C(si)) return null;
      const k = rng.int(0, 1);
      if (k === 0) return mk(rng, M, si, [
        [p + si, "Gave the amount (P + SI) instead of the interest"],
        [p * r / 100, "Found the interest for one year only"],
        [p * r * t / 10, "Moved the decimal one place wrong"],
        [p * (r + t) / 100, "Added the rate and time instead of multiplying"],
      ], finish(d, `${w} borrows **${M(p)}** from ${bk} at **${P(r)}** simple interest per annum for **${yrs(t)}**. Find the interest.`,
        [`SI = P × R × T / 100 = ${p} × ${r} × ${t} / 100`, `= **${M(si)}**`],
        `Interest for 1 year = ${N(p * r / 100)}; multiply by ${t}.`,
        `The question asks for the interest, not the total amount to be repaid (${M(p + si)}).`));
      return mk(rng, M, p + si, [
        [si, "Gave only the interest, not the amount"],
        [p + p * r / 100, "Added the interest for one year only"],
        [p * r * t / 100 + 2 * p, "Added the principal twice"],
        [p - si, "Subtracted the interest from the principal"],
      ].filter((x) => x[0] > 0), finish(d, `${w} deposits **${M(p)}** with ${bk} at **${P(r)}** simple interest per annum. How much will she get back after **${yrs(t)}**?`,
        [`SI = ${p} × ${r} × ${t} / 100 = ${M(si)}`, `Amount = P + SI = ${M(p)} + ${M(si)} = **${M(p + si)}**`],
        `Amount = P × (1 + RT/100) = ${N(p)} × ${R(1 + r * t / 100)}.`,
        `"How much will she get back" means principal plus interest.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      const p = rng.int(2, 60) * 500, r = T(rng, Rs), t = rng.int(2, 8), si = p * r * t / 100;
      if (!C(si)) return null;
      if (k === 0) return mk(rng, P, r, [
        [si * 100 / (p * t) / 2, "Halved the correct rate"],
        [si * 100 / p, "Divided by the principal only and ignored the time"],
        [si * 100 / ((p + si) * t), "Used the amount as the principal"],
        [si / (p * t), "Forgot to multiply by 100"],
      ], finish(d, `A sum of **${M(p)}** earns simple interest of **${M(si)}** in **${yrs(t)}**. Find the rate percent per annum.`,
        [`R = SI × 100 / (P × T) = ${si} × 100 / (${p} × ${t})`, `= **${P(r)}**`],
        `Interest per year = ${N(si / t)}; as a share of ${N(p)} that is ${P(r)}.`,
        `The interest is for ${t} years; divide by T to get the yearly rate.`));
      if (k === 1) return mk(rng, M, p, [
        [si * 100 / r, "Ignored the number of years"],
        [si * 100 / (r + t), "Added the rate and time in the denominator"],
        [si * t / r, "Multiplied by T instead of dividing"],
        [p + si, "Gave the amount instead of the principal"],
      ], finish(d, `${w} earns simple interest of **${M(si)}** in **${yrs(t)}** at **${P(r)}** per annum. What principal did she invest?`,
        [`P = SI × 100 / (R × T) = ${si} × 100 / (${r} × ${t})`, `= **${M(p)}**`],
        `Interest per year = ${N(si / t)}, which is ${P(r)} of P, so P = ${N(si / t)} × 100/${r}.`,
        `Divide by R × T. Leaving out T gives ${M(R(si * 100 / r))}.`));
      const tt = t, rr = r;
      return mk(rng, N, tt, [
        [si * 100 / (p * rr) * 12, "Converted to months by mistake"],
        [si / (p * rr), "Forgot to multiply by 100"],
        [si * 100 / p, "Divided by the principal only"],
        [tt + 1, "Off by one year"],
      ], finish(d, `In how many years will **${M(p)}** earn simple interest of **${M(si)}** at **${P(rr)}** per annum?`,
        [`T = SI × 100 / (P × R) = ${si} × 100 / (${p} × ${rr})`, `= **${tt}** years`],
        `Yearly interest = ${N(p * rr / 100)}; ${N(si)} ÷ ${N(p * rr / 100)} = ${tt}.`,
        `Compute the interest for one year first and see how many such years make up the total.`));
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      // sum becomes A in t years, find rate
      const p = rng.int(2, 40) * 500, r = T(rng, [4, 5, 6, 8, 10, 12, 15, 7.5, 12.5]), t = rng.int(2, 8), a = p * (1 + r * t / 100);
      if (!C(a)) return null;
      return mk(rng, P, r, [
        [(a - p) * 100 / (a * t), "Divided by the amount instead of the principal"],
        [(a - p) * 100 / p, "Forgot to divide by the number of years"],
        [a * 100 / (p * t), "Used the amount instead of the interest"],
        [r * 2, "Doubled the correct figure"],
      ], finish(d, `A sum of **${M(p)}** grows to **${M(a)}** in **${yrs(t)}** at simple interest. What is the rate percent per annum?`,
        [`SI = ${M(a)} − ${M(p)} = ${M(a - p)}`, `R = SI × 100 / (P × T) = ${a - p} × 100 / (${p} × ${t}) = **${P(r)}**`],
        `Interest per year = ${N((a - p) / t)}; divide by ${N(p)} and convert to %.`,
        `The amount includes the principal. Subtract it first to find the interest.`));
    }
    if (k === 1) {
      // months
      const p = rng.int(2, 40) * 1000, r = T(rng, [6, 8, 9, 10, 12, 15, 7.5, 18, 24]), m = T(rng, [3, 4, 6, 9, 15, 18, 30, 27]);
      const si = p * r * m / 1200;
      if (!C(si)) return null;
      return mk(rng, M, si, [
        [p * r * m / 100, "Treated the months as years"],
        [p * r * m / 120, "Divided by 120 instead of 1200"],
        [p * r / 100 * (m / 12) * 2, "Doubled the correct figure"],
        [p * r * (m / 12 + 1) / 100, "Added a year to the converted time"],
      ], finish(d, `${w} lends **${M(p)}** at **${P(r)}** simple interest per annum. How much interest does it earn in **${m} months**?`,
        [`T = ${m}/12 years`, `SI = ${p} × ${r} × (${m}/12) / 100 = **${M(si)}**`],
        `Use SI = P × R × months / 1200.`,
        `The rate is per annum, so convert months to years (÷ 12) before multiplying.`));
    }
    // two parts at different rates
    const p1 = rng.int(2, 30) * 1000, p2 = rng.int(2, 30) * 1000, r1 = T(rng, [4, 5, 6, 8, 10]), r2 = T(rng, [6, 7, 8, 9, 10, 12]), t = rng.int(1, 5);
    if (r1 === r2) return null;
    const si = (p1 * r1 + p2 * r2) * t / 100;
    return mk(rng, M, si, [
      [(p1 + p2) * (r1 + r2) / 2 * t / 100, "Used the average of the two rates on the whole sum"],
      [(p1 * r1 + p2 * r2) / 100, "Ignored the time"],
      [(p1 + p2) * r1 * t / 100, "Used the first rate for both sums"],
      [(p1 + p2) * r2 * t / 100, "Used the second rate for both sums"],
    ], finish(d, `${w} lends **${M(p1)}** at **${P(r1)}** and **${M(p2)}** at **${P(r2)}**, both at simple interest per annum. Find the total interest earned in **${yrs(t)}**.`,
      [`SI on first = ${p1} × ${r1} × ${t}/100 = ${M(p1 * r1 * t / 100)}`, `SI on second = ${p2} × ${r2} × ${t}/100 = ${M(p2 * r2 * t / 100)}`, `Total = **${M(si)}**`],
      `Work each loan separately: yearly interest ${N(p1 * r1 / 100)} + ${N(p2 * r2 / 100)}, times ${t}.`,
      `Different sums at different rates cannot use a simple average of the rates unless the sums are equal.`));
  }) });

  /* ------------------------------------------------------------ 2. CI annual */
  QB.gen("quant/interest/ci-annual", { title: "CI annual", gen: lead(wrap((rng, d) => {
    const w = T(rng, WHO), bk = T(rng, WHERE);
    if (d === "Easy") {
      const r = T(rng, [10, 20, 5, 25, 50, 40]), t = 2, mult = { 10: 100, 20: 25, 5: 400, 25: 16, 50: 4, 40: 25 }[r];
      const p = rng.int(1, 12) * mult * T(rng, [1, 2, 5]);
      const a = ci(p, r, t), cI = a - p;
      if (!C(a)) return null;
      const k = rng.chance(0.5);
      if (k) return mk(rng, M, cI, [
        [p * r * t / 100, "Calculated simple interest instead"],
        [a, "Gave the amount, not the interest"],
        [p * r / 100 * (t + 1), "Used three years of simple interest"],
        [a - p * (1 + r / 100), "Gave only the second year's interest"],
      ], finish(d, `${w} deposits **${M(p)}** in ${bk} at **${P(r)}** per annum compounded annually. Find the compound interest after **${yrs(t)}**.`,
        [`Amount = P(1 + R/100)ⁿ = ${p} × (${R(1 + r / 100)})² = ${M(a)}`, `CI = ${M(a)} − ${M(p)} = **${M(cI)}**`],
        `Year 1 interest = ${N(p * r / 100)}; year 2 is on ${N(p + p * r / 100)}, so ${N(R((p + p * r / 100) * r / 100))}. Add them.`,
        `Compound interest is more than simple interest (${M(p * r * t / 100)}), because year 2's interest is charged on year 1's interest too.`));
      return mk(rng, M, a, [
        [p + p * r * t / 100, "Used simple interest"],
        [cI, "Gave only the interest, not the amount"],
        [p * (1 + r * t / 100) + p * r / 100, "Added an extra year of simple interest"],
        [p * (1 + r / 100) * 2, "Doubled the first-year amount"],
      ], finish(d, `${w} puts **${M(p)}** in ${bk} at **${P(r)}** per annum, interest compounded yearly. What is the amount after **${yrs(t)}**?`,
        [`Amount = ${p} × (1 + ${r}/100)² = ${p} × ${R(pw(1 + r / 100, 2))}`, `= **${M(a)}**`],
        `Multiply by ${R(1 + r / 100)} twice: ${N(p)} → ${N(p * (1 + r / 100))} → ${N(a)}.`,
        `Do not use P(1 + 2R/100): that is simple interest.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      const r = T(rng, [10, 20, 5, 25, 12, 8, 4]), t = T(rng, [2, 3]);
      const base = { 10: 1000, 20: 125, 5: 8000, 25: 64, 12: 625, 8: 625, 4: 625 }[r];
      const p = base * rng.int(1, 6);
      const a = ci(p, r, t), cI = a - p;
      if (!C(a) || p > 400000) return null;
      if (k === 0) return mk(rng, M, cI, [
        [p * r * t / 100, "Calculated simple interest"],
        [a, "Gave the amount, not the interest"],
        [p * pw(r / 100, t), "Used (R/100)ⁿ without the 1 +"],
        [ci(p, r, t - 1) - p, `Used ${t - 1} year${t - 1 > 1 ? "s" : ""} only`],
      ], finish(d, `Find the compound interest on **${M(p)}** for **${yrs(t)}** at **${P(r)}** per annum, compounded annually.`,
        [`Amount = ${p} × (${R(1 + r / 100)})^${t} = ${M(a)}`, `CI = ${M(a)} − ${M(p)} = **${M(cI)}**`],
        `Multiply by ${R(1 + r / 100)} ${t} times, then subtract the principal.`,
        `Subtract the principal at the end; the compounding formula gives the amount.`));
      if (k === 1) {
        // find amount with ratio check
        return mk(rng, M, a, [
          [p * (1 + r * t / 100), "Used simple interest"],
          [cI, "Gave the interest, not the amount"],
          [p * pw(1 + r / 100, t - 1), `Compounded for ${t - 1} year${t - 1 > 1 ? "s" : ""} only`],
          [p * pw(1 + r / 100, t + 1), `Compounded for ${t + 1} years`],
        ], finish(d, `What will **${M(p)}** amount to in **${yrs(t)}** at **${P(r)}** per annum compound interest (annual compounding)?`,
          [`A = P(1 + R/100)ⁿ = ${p} × ${R(1 + r / 100)}^${t}`, `= **${M(a)}**`],
          `Repeated ${r}% increases: multiply by ${R(1 + r / 100)} each year.`,
          `Count the years correctly: ${t} years means ${t} multiplications.`));
      }
      // CI is X, SI is Y: find rate? Simple: given amount after 2 yrs find P? do reverse
      const t2 = 2;
      const aa = ci(p, r, t2);
      if (!C(aa)) return null;
      return mk(rng, M, p, [
        [aa / (1 + r * t2 / 100), "Treated the growth as simple interest"],
        [aa * (1 - r * t2 / 100), "Subtracted the interest as a percent of the amount"],
        [aa / (1 + r / 100), "Undid only one year of growth"],
        [aa - p * r * t2 / 100, "Subtracted the simple interest from the amount"],
      ].filter((x) => x[0] > 0), finish(d, `${w}'s deposit grows to **${M(aa)}** in **${yrs(t2)}** at **${P(r)}** per annum compounded annually. What was the principal?`,
        [`P = A / (1 + R/100)ⁿ = ${aa} / ${R(pw(1 + r / 100, 2))}`, `= **${M(p)}**`],
        `Divide by ${R(1 + r / 100)} twice to undo the two years.`,
        `Divide by the growth factor; subtracting ${r * t2}% of the amount is not the reverse of compounding.`));
    }
    const k = rng.int(0, 1);
    if (k === 0) {
      const r = T(rng, [10, 20, 5, 25, 12.5]), t = 3, base = { 10: 1000, 20: 125, 5: 8000, 25: 64, 12.5: 512 }[r];
      const a = base * rng.int(1, 4) * pw(1 + r / 100, 3) , p = a / pw(1 + r / 100, 3);
      const cI = a - p;
      if (!I(p) || !C(a)) return null;
      return mk(rng, M, p, [
        [a / (1 + r * t / 100), "Treated it as simple interest"],
        [a / pw(1 + r / 100, 2), "Undid only two years"],
        [a - cI / t, "Subtracted one year's average interest"],
        [a * (1 - r / 100) , "Reduced the amount by one year's rate"],
      ], finish(d, `The compound interest on a sum for **3 years** at **${P(r)}** per annum (compounded annually) is **${M(cI)}**. Find the sum.`,
        [`CI = P[(1 + R/100)³ − 1] = P × ${R(pw(1 + r / 100, 3) - 1)}`, `P = ${M(cI)} / ${R(pw(1 + r / 100, 3) - 1)} = **${M(p)}**`],
        `3-year growth factor = ${R(pw(1 + r / 100, 3))}, so CI is ${R(pw(1 + r / 100, 3) - 1)} of P.`,
        `CI is the growth only, so divide by (factor − 1), not by the factor itself.`));
    }
    const r1 = T(rng, [10, 20, 5, 25]), base = { 10: 100, 20: 25, 5: 400, 25: 16 }[r1];
    const p = base * rng.int(2, 30), t = 2;
    const si = p * r1 * t / 100, cI = ci(p, r1, t) - p;
    if (!C(cI)) return null;
    const extra = cI - si;
    return mk(rng, M, cI, [
      [si, "Gave simple interest"],
      [cI + p, "Gave the amount"],
      [si + p * r1 / 100 * r1 / 100 * 2, "Doubled the interest-on-interest"],
      [ci(p, r1, 3) - p, "Used three years"],
    ], finish(d, `${w} invests a sum with ${bk} for 2 years at **${P(r1)}** compounded annually and earns **${M(si)}** simple-interest equivalent over the same period at the same rate. How much compound interest does the deposit earn?`.replace(/earns .* over the same period at the same rate\. /, `would have earned **${M(si)}** if the interest were simple. `),
      [`Simple interest = ${M(si)} on P = ${M(p)}`, `Amount with compounding = ${p} × ${R(pw(1 + r1 / 100, 2))} = ${M(ci(p, r1, 2))}`, `CI = **${M(cI)}**`],
      `Back out P = SI × 100/(R × 2) = ${N(p)}, then CI = P × (${R(pw(1 + r1 / 100, 2))} − 1).`,
      `CI exceeds SI by the interest-on-interest (${M(R(extra))} here), so ${M(si)} cannot be the answer.`));
  })) });

  /* ------------------------------------------------------------ 3. CI half-yearly & quarterly */
  QB.gen("quant/interest/ci-half-yearly-and-quarterly", { title: "CI half-yearly & quarterly", gen: lead(wrap((rng, d) => {
    const w = T(rng, WHO), bk = T(rng, WHERE);
    const mode = d === "Easy" ? 2 : (rng.chance(0.5) ? 2 : 4);
    const name = mode === 2 ? "half-yearly" : "quarterly", per = mode === 2 ? "half-year" : "quarter";
    if (d === "Easy") {
      const r = T(rng, [10, 20, 8, 12, 16, 24, 40]), t = 1;
      const rp = r / mode, n = mode * t;
      const base = { 10: 400, 20: 100, 8: 625, 12: 400, 16: 625, 24: 100, 40: 25 }[r];
      const p = base * rng.int(1, 8) * T(rng, [1, 5]);
      const a = ci(p, rp, n);
      if (!C(a)) return null;
      return mk(rng, M, a, [
        [p * (1 + r / 100), "Compounded annually instead"],
        [p * (1 + r * t / 100) + 0 * 1, "Used simple interest"],
        [p * pw(1 + r / 100, 2), "Used the annual rate for two periods"],
        [a - p, "Gave only the interest"],
      ].filter((x) => x[0] > 0), finish(d, `${w} deposits **${M(p)}** in ${bk} at **${P(r)}** per annum, interest compounded **half-yearly**. Find the amount after **1 year**.`,
        [`Rate per half-year = ${r}/2 = ${rp}%, number of half-years = 2`, `A = ${p} × (${R(1 + rp / 100)})² = **${M(a)}**`],
        `Two steps of ${rp}% each: multiply by ${R(1 + rp / 100)} twice.`,
        `Halve the rate and double the periods. Using ${r}% for one period gives ${M(p * (1 + r / 100))}, which is the annual result.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      const r = T(rng, [10, 20, 8, 12, 16, 24, 40, 4]), t = T(rng, [1, 1.5, 2]);
      const rp = r / mode, n = mode * t;
      if (!I(n)) return null;
      const base = { 10: 400, 20: 100, 8: 625, 12: 400, 16: 625, 24: 100, 40: 25, 4: 2500 }[r];
      const p = base * rng.int(1, 6) * T(rng, [1, 5, 10]);
      const a = ci(p, rp, n), cI = a - p;
      if (!C(a) || p > 600000) return null;
      if (k === 0) return mk(rng, M, cI, [
        [ci(p, r, t) - p, "Compounded annually instead of " + name],
        [p * r * t / 100, "Calculated simple interest"],
        [ci(p, rp, t) - p, "Used the " + per + " rate but only " + t + " period" + (t > 1 ? "s" : "")],
        [a, "Gave the amount, not the interest"],
      ], finish(d, `Find the compound interest on **${M(p)}** for **${t === 1.5 ? "1½ years" : yrs(t)}** at **${P(r)}** per annum, compounded **${name}**.`,
        [`Rate per ${per} = ${P(rp)}, periods = ${n}`, `A = ${p} × (${R(1 + rp / 100)})^${n} = ${M(a)}`, `CI = ${M(a)} − ${M(p)} = **${M(cI)}**`],
        `Rate ÷ ${mode}, years × ${mode}: ${P(rp)} for ${n} periods.`,
        `Compounding ${name} gives more than annual compounding (${M(R(ci(p, r, t) - p))}), so that cannot be the answer.`));
      return mk(rng, M, a, [
        [ci(p, r, t), "Compounded annually instead of " + name],
        [p * (1 + r * t / 100), "Used simple interest"],
        [p * pw(1 + rp / 100, n - 1), "Used one period too few"],
        [p * pw(1 + rp / 100, n + 1), "Used one period too many"],
      ], finish(d, `${w} invests **${M(p)}** for **${t === 1.5 ? "1½ years" : yrs(t)}** at **${P(r)}** per annum, compounded **${name}**. What is the maturity amount?`,
        [`R = ${P(rp)} per ${per}, n = ${n} ${per}s`, `A = ${p} × ${R(1 + rp / 100)}^${n} = **${M(a)}**`],
        `${n} steps of ${P(rp)}: multiply ${n} times by ${R(1 + rp / 100)}.`,
        `Count the periods: ${t} years × ${mode} = ${n}.`));
    }
    const k = rng.int(0, 1);
    if (k === 0) {
      const r = T(rng, [10, 20, 8, 12, 16, 24, 40, 4]), t = T(rng, [1, 1.5, 2]);
      const rp = r / mode, n = mode * t;
      if (!I(n)) return null;
      const base = { 10: 400, 20: 100, 8: 625, 12: 400, 16: 625, 24: 100, 40: 25, 4: 2500 }[r];
      const p = base * rng.int(1, 5) * T(rng, [1, 5, 10]);
      const ann = ci(p, r, t), hy = ci(p, rp, n), diff = hy - ann;
      if (!C(ann) || !C(hy) || diff <= 0 || p > 600000) return null;
      return mk(rng, M, diff, [
        [hy - p, "Gave the " + name + " interest alone"],
        [ann - p, "Gave the annual interest alone"],
        [hy - p * (1 + r * t / 100), "Compared with simple interest"],
        [diff * 2, "Doubled the correct difference"],
      ], finish(d, `How much more does **${M(p)}** earn in **${t === 1.5 ? "1½ years" : yrs(t)}** at **${P(r)}** per annum when interest is compounded **${name}** rather than annually?`,
        [`Annual compounding: ${p} × ${R(1 + r / 100)}^${t} = ${M(ann)}`, `${name[0].toUpperCase() + name.slice(1)}: ${p} × ${R(1 + rp / 100)}^${n} = ${M(hy)}`, `Difference = **${M(diff)}**`],
        `Compute both amounts; the principal cancels in the difference.`,
        `Subtract the two amounts (or two interests), not an amount and an interest.`));
    }
    // Hard: find P or rate
    const r = T(rng, [10, 20, 8, 12, 16, 24, 40, 4]), t = T(rng, [1, 2]);
    const rp = r / mode, n = mode * t;
    const base = { 10: 400, 20: 100, 8: 625, 12: 400, 16: 625, 24: 100, 40: 25, 4: 2500 }[r];
    const p = base * rng.int(1, 6) * T(rng, [1, 5]);
    const a = ci(p, rp, n);
    if (!C(a) || p > 600000) return null;
    return mk(rng, M, p, [
      [a / pw(1 + r / 100, t), "Treated the interest as compounded annually"],
      [a / (1 + r * t / 100), "Treated the interest as simple"],
      [a / pw(1 + rp / 100, n - 1), "Undid one period too few"],
      [a - a * r * t / 100, "Subtracted a simple percentage"],
    ], finish(d, `A sum grows to **${M(a)}** in **${yrs(t)}** at **${P(r)}** per annum compounded **${name}**. Find the sum.`,
      [`Rate per ${per} = ${P(rp)}, n = ${n}`, `P = ${a} / ${R(pw(1 + rp / 100, n))} = **${M(p)}**`],
      `Divide by ${R(1 + rp / 100)} ${n} times.`,
      `The "per ${per}" rate and the number of ${per}s must both be adjusted before dividing.`));
  })) });

  /* ------------------------------------------------------------ 4. CI - SI for 2 and 3 years */
  QB.gen("quant/interest/ci-si-for-2-and", { title: "CI − SI for 2 and 3 years", gen: wrap((rng, d) => {
    const w = T(rng, WHO);
    const Rs = [5, 8, 10, 12, 15, 20, 25, 4, 6, 40];
    if (d === "Easy") {
      const r = T(rng, Rs), p = rng.int(1, 40) * 500 * T(rng, [1, 2, 4]);
      const diff = p * r * r / 10000;
      if (!C(diff)) return null;
      return mk(rng, M, diff, [
        [p * r / 100, "Gave one year's interest"],
        [p * r * r / 1000, "Moved the decimal one place wrong"],
        [p * r * 2 / 100, "Gave two years of simple interest"],
        [p * r * r * 2 / 10000, "Doubled the correct difference"],
      ], finish(d, `Find the difference between the compound interest and the simple interest on **${M(p)}** for **2 years** at **${P(r)}** per annum.`,
        [`For 2 years, CI − SI = P(R/100)² = ${p} × (${r}/100)²`, `= **${M(diff)}**`],
        `The difference is interest on the first year's interest: ${N(p * r / 100)} × ${r}% = ${N(R(diff))}.`,
        `Use P(R/100)², not P × R/100.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      if (k === 0) {
        const r = T(rng, [5, 10, 20, 25, 4, 8, 12, 15, 40]), p = rng.int(1, 40) * 1000 * T(rng, [1, 2, 5]);
        const diff = p * r * r * (300 + r) / 1e6;
        if (!C(diff)) return null;
        return mk(rng, M, diff, [
          [p * r * r / 10000, "Used the 2-year formula for 3 years"],
          [p * r * r * 3 / 10000, "Multiplied the 2-year difference by 3"],
          [p * r * r * (300 - r) / 1e6, "Used (300 − R) instead of (300 + R)"],
          [p * r * r * (100 + r) / 1e6, "Used (100 + R) instead of (300 + R)"],
        ], finish(d, `${w} wants the difference between compound and simple interest on **${M(p)}** for **3 years** at **${P(r)}** per annum. Find it.`,
          [`CI − SI (3 yrs) = P × R² × (300 + R) / 100³`, `= ${p} × ${r * r} × ${300 + r} / 1,000,000 = **${M(diff)}**`],
          `Year-by-year check: CI − SI = ${N(R(diff))}.`,
          `The 3-year formula has an extra factor (300 + R)/100; the 2-year formula is not enough.`));
      }
      const r = T(rng, Rs), p = rng.int(2, 40) * 1000;
      const diff = p * r * r / 10000, si = p * r * 2 / 100;
      if (!C(diff)) return null;
      const ci2 = si + diff;
      return mk(rng, M, ci2, [
        [si, "Gave the simple interest"],
        [diff, "Gave the difference only"],
        [si - diff, "Subtracted the difference from SI"],
        [p + ci2, "Gave the amount"],
      ], finish(d, `The simple interest on a sum for 2 years at **${P(r)}** per annum is **${M(si)}**. What is the compound interest on the same sum for the same period?`,
        [`P = ${si} × 100 / (2 × ${r}) = ${M(p)}`, `CI − SI = P(R/100)² = ${M(diff)}`, `CI = ${M(si)} + ${M(diff)} = **${M(ci2)}**`],
        `Extra over SI = SI × R/200 = ${N(si)} × ${r}/200 = ${N(R(diff))}.`,
        `CI is larger than SI. Compounding adds the interest earned on the first year's interest.`));
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      const r = T(rng, [5, 10, 20, 25, 4, 8, 12, 15, 40]), p = rng.int(1, 40) * 1000 * T(rng, [1, 2, 5]);
      const diff = p * r * r / 10000;
      if (!C(diff) || diff < 1) return null;
      return mk(rng, M, p, [
        [diff * 100 / r, "Divided by R instead of R²/10000"],
        [diff * 10000 / (r * r) * 2, "Doubled the correct principal"],
        [diff * 100 / (r * r), "Missed a factor of 100"],
        [diff * 10000 / r, "Used R instead of R²"],
      ], finish(d, `The difference between the compound interest and the simple interest on a sum for **2 years** at **${P(r)}** per annum is **${M(diff)}**. Find the sum.`,
        [`CI − SI = P(R/100)² → ${diff} = P × (${r}/100)²`, `P = ${diff} × 10000 / ${r * r} = **${M(p)}**`],
        `P = difference ÷ (R/100)² = ${N(diff)} ÷ ${R(r * r / 10000)}.`,
        `The square of the rate is essential: (${r}/100)² = ${R(r * r / 10000)}, not ${r}/100.`));
    }
    if (k === 1) {
      const r = T(rng, [5, 10, 20, 25, 4, 8, 12, 15, 40]), p = rng.int(1, 30) * 1000 * T(rng, [1, 2, 5]);
      const diff = p * r * r * (300 + r) / 1e6;
      if (!C(diff) || diff < 1) return null;
      return mk(rng, M, p, [
        [diff * 10000 / (r * r), "Used the 2-year formula"],
        [diff * 1e6 / (r * r * (300 - r)), "Used (300 − R) instead of (300 + R)"],
        [diff * 1e6 / (r * r * 300), "Dropped R from (300 + R)"],
        [diff * 100 / r, "Divided by R instead of the 3-year factor"],
      ], finish(d, `The difference between CI and SI for **3 years** at **${P(r)}** per annum is **${M(diff)}**. Find the principal.`,
        [`CI − SI = P R² (300 + R)/100³ → P = ${diff} × 1,000,000 / (${r * r} × ${300 + r})`, `= **${M(p)}**`],
        `Factor: ${R(r * r * (300 + r) / 1e6)} × P = ${N(diff)}.`,
        `For 3 years the difference is larger than for 2 years; use the (300 + R) factor.`));
    }
    const r = T(rng, [5, 10, 20, 25, 4, 8, 12, 15, 40]), p = rng.int(1, 30) * 1000 * T(rng, [1, 2, 5]);
    const diff2 = p * r * r / 10000, diff3 = p * r * r * (300 + r) / 1e6;
    if (!C(diff2) || !C(diff3)) return null;
    const ratio = diff3 - diff2;
    return mk(rng, M, diff3 - diff2, [
      [diff3, "Gave the 3-year difference"],
      [diff2, "Gave the 2-year difference"],
      [diff3 + diff2, "Added the two differences"],
      [diff2 * 3, "Multiplied the 2-year difference by 3"],
    ], finish(d, `On **${M(p)}** at **${P(r)}** per annum, by how much does the (CI − SI) gap for 3 years exceed the gap for 2 years?`,
      [`2-year gap = P(R/100)² = ${M(diff2)}`, `3-year gap = P R²(300 + R)/100³ = ${M(diff3)}`, `Excess = **${M(ratio)}**`],
      `The extra gap is the interest on (2-year gap + 2nd-year interest-on-interest): ${N(R(diff3))} − ${N(R(diff2))}.`,
      `Compute both gaps with their own formulas; the 3-year gap is not just 3 × the 2-year gap.`));
  }) });

  /* ------------------------------------------------------------ 5. becomes n times / doubling */
  QB.gen("quant/interest/becomes-n-times-doubling", { title: "Becomes n times / doubling (rule of 72)", gen: lead(wrap((rng, d) => {
    const w = T(rng, WHO);
    if (d === "Easy") {
      const k = rng.int(0, 1);
      if (k === 0) {
        const t = T(rng, [4, 5, 8, 10, 20, 25, 2, 12.5]), r = 100 / t;
        if (!C(r)) return null;
        return mk(rng, P, r, [
          [t, "Gave the time in years as the rate"],
          [200 / t, "Used 200 instead of 100 (that is for tripling)"],
          [50 / t, "Used 50 instead of 100"],
          [100 / (t + 1), "Off by one year"],
        ], finish(d, `A sum of money doubles itself in **${t} years** at simple interest. What is the rate percent per annum?`,
          [`Doubling means SI = P, so P = P × R × ${t} / 100`, `R = 100/${t} = **${P(r)}**`],
          `Doubling at simple interest: R × T = 100.`,
          `The interest needed is equal to P, which is 100% of P; not 200%.`));
      }
      const r = T(rng, [5, 10, 20, 25, 8, 4, 12.5]), t = 100 / r;
      if (!C(t)) return null;
      return mk(rng, N, t, [
        [200 / r, "Used 200 instead of 100 (that is for tripling)"],
        [100 / r / 2, "Halved the time"],
        [r, "Gave the rate as the time"],
        [72 / r, "Applied the rule of 72, which is for compound interest"],
      ], finish(d, `In how many years will a sum double at **${P(r)}** simple interest per annum?`,
        [`SI = P → P R T / 100 = P`, `T = 100/${r} = **${N(t)}** years`],
        `T = 100 ÷ R for doubling at simple interest.`,
        `The rule of 72 (72 ÷ R) is for compound interest; at SI the answer is 100 ÷ R.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const n = T(rng, [3, 4, 5, 6]), t = T(rng, [4, 5, 8, 10, 12, 15, 20]), r = (n - 1) * 100 / t;
        if (!C(r)) return null;
        return mk(rng, P, r, [
          [n * 100 / t, `Used ${n} instead of ${n - 1} in the interest`],
          [100 / t, "Used the doubling formula"],
          [(n - 1) * 100 / (t * 2), "Halved the correct figure"],
          [(n + 1) * 100 / t, `Used ${n + 1} instead of ${n - 1}`],
        ], finish(d, `At simple interest a sum becomes **${n} times** itself in **${t} years**. Find the rate percent per annum.`,
          [`Becoming ${n} times means SI = ${n - 1}P`, `R = (${n} − 1) × 100 / ${t} = **${P(r)}**`],
          `R × T = (n − 1) × 100 = ${(n - 1) * 100}.`,
          `"Becomes ${n} times" gives interest of ${n - 1} times the principal, not ${n}.`));
      }
      if (k === 1) {
        const n1 = T(rng, [2, 3]), t1 = T(rng, [4, 5, 6, 8, 10, 12]), m = T(rng, [4, 5, 6, 7, 8, 9, 10]);
        if (m <= n1) return null;
        const t2 = (m - 1) / (n1 - 1) * t1;
        if (!C(t2)) return null;
        return mk(rng, N, t2, [
          [m / n1 * t1, "Scaled the multiple instead of the interest"],
          [m * t1, `Multiplied by ${m} directly`],
          [(m - 1) * t1 / (n1) , `Divided by ${n1} instead of ${n1 - 1}`],
          [t1 * (m - n1), "Subtracted the multiples"],
        ].filter((x) => x[0] !== t2), finish(d, `A sum becomes **${n1} times** itself in **${t1} years** at simple interest. In how many years will it become **${m} times**?`,
          [`Interest earned in ${t1} years = ${n1 - 1}P; so yearly interest = ${R((n1 - 1) / t1)}P`, `For ${m} times, interest needed = ${m - 1}P`, `Time = ${m - 1} ÷ ${R((n1 - 1) / t1)} = **${N(t2)}** years`],
          `Time ∝ (n − 1): T₂ = ${t1} × ${m - 1}/${n1 - 1}.`,
          `Only the interest (n − 1) grows with time; the principal part stays.`));
      }
      const t = T(rng, [2, 3, 4, 5, 6, 8, 9, 12]), r = 72 / t;
      if (!C(r)) return null;
      return mk(rng, P, r, [
        [100 / t, "Used the simple-interest doubling rule (100/T)"],
        [t, "Gave the time as the rate"],
        [144 / t, "Used 144 instead of 72"],
        [r / 2, "Halved the correct figure"],
      ], finish(d, `At compound interest, a sum doubles in about **${t} years**. Using the rule of 72, estimate the annual rate of interest.`,
        [`Rule of 72: years to double ≈ 72 / R`, `R ≈ 72/${t} = **${P(r)}**`],
        `R ≈ 72 ÷ years to double.`,
        `Use 72 for compound interest. 100 ÷ T would be the simple-interest figure.`));
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      const t1 = T(rng, [2, 3, 4, 5, 6, 7]), nn = T(rng, [[4, 2], [8, 3], [16, 4]]);
      const ans = t1 * nn[1];
      return mk(rng, N, ans, [
        [t1 * nn[0], `Multiplied the time by ${nn[0]}`],
        [t1 * (nn[0] - 1), `Used ${nn[0] - 1} doublings`],
        [t1 * nn[1] + t1, "Counted one doubling too many"],
        [t1 * nn[1] / 2, "Halved the time"],
      ], finish(d, `At compound interest a sum doubles in **${t1} years**. In how many years will it become **${nn[0]} times**?`,
        [`${nn[0]} = 2^${nn[1]}, so it needs ${nn[1]} doublings`, `Time = ${nn[1]} × ${t1} = **${ans}** years`],
        `Each doubling takes ${t1} years; count how many doublings give ${nn[0]}.`,
        `With compound interest the growth is by a factor each period; 4 times is two doublings, not three.`));
    }
    if (k === 1) {
      const n = T(rng, [3, 4, 5]), t = T(rng, [3, 4, 5, 6, 8, 10]), m = T(rng, [[n, n], [n, n]])[0];
      // SI: n times in t years; time for sum to earn interest equal to ... use "simple interest equals p times principal"
      const r = (n - 1) * 100 / t, x = T(rng, [2, 3, 5, 6]);  // SI equals x/10... interest = x/2 of principal?
      const frac = T(rng, [[1, 2], [3, 4], [1, 4], [3, 2], [5, 2]]);
      const t2 = (frac[0] / frac[1]) * 100 / r;
      if (!C(r) || !C(t2) || t2 <= 0) return null;
      return mk(rng, N, t2, [
        [100 / r, "Used the doubling formula"],
        [frac[0] / frac[1] * t, "Scaled the time directly by the fraction"],
        [(frac[0] / frac[1] + 1) * 100 / r, "Added the principal to the required interest"],
        [t2 * 2, "Doubled the correct time"],
      ], finish(d, `At simple interest a sum becomes **${n} times** itself in **${t} years**. In how many years will the interest alone equal **${frac[0]}/${frac[1]}** of the principal?`,
        [`Rate = (${n} − 1) × 100 / ${t} = ${P(R(r))}`, `Required interest = ${frac[0]}/${frac[1]} P = P × ${R(r)} × T / 100`, `T = ${R(frac[0] / frac[1] * 100)} / ${R(r)} = **${N(R(t2))}** years`],
        `Yearly interest = ${R((n - 1) / t)} P, so T = ${frac[0]}/${frac[1]} ÷ ${R((n - 1) / t)}.`,
        `The question asks about interest only, so do not add the principal back.`));
    }
    const t1 = T(rng, [3, 4, 5, 6, 8]), r = 72 / t1;
    const m = T(rng, [2, 3]);
    if (!C(r)) return null;
    const ans = t1 * m;
    return mk(rng, N, ans, [
      [t1 * pw(2, m), "Doubled the time each step instead of adding"],
      [t1 * (m + 1), "Counted one doubling too many"],
      [100 / r * m, "Used the simple-interest rule (100/R)"],
      [t1 * m * 2, "Doubled the correct answer"],
    ], finish(d, `A sum doubles in about **${t1} years** at some compound rate (the rule-of-72 rate is ${P(R(r))}). Roughly how many years will it take to become **${pw(2, m)} times**?`,
      [`${pw(2, m)} = 2^${m}, so ${m} doublings`, `Time = ${m} × ${t1} = **${ans}** years`],
      `Number of doublings × years per doubling.`,
      `At compound interest each doubling takes the same time; the time grows additively with the number of doublings.`));
  })) });

  /* ------------------------------------------------------------ 6. equal instalments */
  QB.gen("quant/interest/equal-instalments", { title: "Equal instalments", gen: wrap((rng, d) => {
    const w = T(rng, WHO), it = T(rng, ["a two-wheeler loan", "a loan for a refrigerator", "a home-appliance loan", "an education loan", "a loan for a laptop", "a tractor loan", "a loan for a sewing machine"]);
    const Rs = d === "Hard" ? [10, 20, 25, 5, 12.5, 8] : [10, 20, 5, 25];
    const r = T(rng, Rs);
    const f = 100 / (100 + r);
    if (d === "Easy") {
      const n = 2, den = (100 + r) / QB.gcd(100, 100 + r);
      const x = (100 + r) * (100 + r) * rng.int(1, 3);
      const principal = x * f + x * f * f;
      if (!C(principal)) return null;
      return mk(rng, M, principal, [
        [x * 2, "Added the instalments without removing the interest"],
        [x * f * 2, "Discounted both instalments by one year only"],
        [x / (1 + r * 2 / 100) + x / (1 + r / 100), "Used simple-interest factors"],
        [x * f, "Counted only the first instalment"],
      ], finish(d, `${w} repays ${it} in **2 equal annual instalments of ${M(x)}** each. If the interest is **${P(r)}** per annum compounded annually, what was the loan?`,
        [`Present value of the 1st = ${x} × 100/${100 + r} = ${M(x * f)}`, `Present value of the 2nd = ${x} × (100/${100 + r})² = ${M(x * f * f)}`, `Loan = **${M(principal)}**`],
        `Divide the first instalment by ${R(1 + r / 100)} once and the second twice, then add.`,
        `The 2nd instalment is paid a year later, so it is worth less today. Adding ${M(x * 2)} ignores that.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      if (k === 0) {
        const x = (100 + r) * (100 + r) * rng.int(1, 4);
        const principal = x * f + x * f * f;
        if (!C(principal)) return null;
        return mk(rng, M, x, [
          [principal / 2, "Divided the loan by 2 and ignored interest"],
          [principal * (1 + r / 100) / 2, "Added one year of interest then divided by 2"],
          [principal * pw(1 + r / 100, 2) / 2, "Compounded the loan for 2 years then divided by 2"],
          [principal * (100 + r) / 100 / (1 + f) / 2 * 0 + principal / (1 + f) , "Used 1 and the discount factor instead of the two factors"],
        ].filter((q) => q[0] > 0), finish(d, `${w} takes ${it} of **${M(principal)}** at **${P(r)}** per annum compounded annually, to be repaid in **2 equal annual instalments**. Find each instalment.`,
          [`Let each instalment = x. Then x × 100/${100 + r} + x × (100/${100 + r})² = ${principal}`, `x × ${R(f + f * f)} = ${principal}`, `x = **${M(x)}**`],
          `Add the discount factors ${R(f)} + ${R(f * f)} = ${R(f + f * f)}, then divide the loan by it.`,
          `Dividing the loan by 2 ignores that the interest keeps running on the unpaid balance.`));
      }
      const n3 = 3, f3 = f;
      const x = pw(100 + r, 3) * rng.int(1, 2);
      const pr = x * (f3 + f3 * f3 + f3 * f3 * f3);
      if (!C(pr) || pr > 5e6) return null;
      return mk(rng, M, x, [
        [pr / 3, "Divided the loan by 3 and ignored interest"],
        [pr * (1 + r / 100) / 3, "Added one year of interest then divided by 3"],
        [pr / (f3 + f3 * f3), "Used only two discount factors"],
        [pr * pw(1 + r / 100, 3) / 3, "Compounded the loan for 3 years then divided by 3"],
      ], finish(d, `${w} takes ${it} of **${M(pr)}** at **${P(r)}** per annum compounded annually, to be repaid in **3 equal annual instalments**. Find each instalment.`,
        [`x[100/${100 + r} + (100/${100 + r})² + (100/${100 + r})³] = ${pr}`, `x × ${R(f3 + f3 * f3 + f3 * f3 * f3)} = ${pr}`, `x = **${M(x)}**`],
        `Add the three discount factors (${R(f3)}, ${R(f3 * f3)}, ${R(f3 * f3 * f3)}) and divide the loan by their sum.`,
        `Each instalment is discounted for a different number of years: 1, 2 and 3.`));
    }
    // Hard
    const k = rng.int(0, 2);
    if (k === 0) {
      const r3 = T(rng, [10, 20, 5, 25]), f3 = 100 / (100 + r3);
      const x = pw(100 + r3, 3) * 1 * rng.int(1, 2);
      const principal = x * (f3 + f3 * f3 + f3 * f3 * f3);
      if (!C(principal) || principal > 5e6) return null;
      return mk(rng, M, principal, [
        [x * 3, "Added the three instalments"],
        [x * (f3 + f3 * f3), "Counted only two instalments"],
        [x * 3 * f3 * f3, "Discounted every instalment twice"],
        [x * (f3 + 2 * f3 * f3), "Mis-weighted the instalments"],
      ], finish(d, `${w} repays ${it} in **3 equal annual instalments of ${M(x)}**. The interest rate is **${P(r3)}** per annum compounded annually. Find the amount borrowed.`,
        [`PV = x[100/${100 + r3} + (100/${100 + r3})² + (100/${100 + r3})³]`, `= ${x} × ${R(f3 + f3 * f3 + f3 * f3 * f3)}`, `= **${M(principal)}**`],
        `Discount the instalments by 1, 2 and 3 years and add.`,
        `Each instalment is discounted by a different number of years: 1, 2 and 3.`));
    }
    if (k === 1) {
      const x = (100 + r) * (100 + r) * rng.int(1, 3);
      const si_rate = r;
      // SI instalments: 2 equal instalments, first after 1 year, second after 2 years, loan P: P = x/(1+r) + x/(1+2r) -- skip; use value comparison
      const pr = x * f + x * f * f, tot = 2 * x, intr = tot - pr;
      return mk(rng, M, intr, [
        [pr * r * 2 / 100, "Used 2 years of simple interest on the whole loan"],
        [tot, "Gave the total repaid"],
        [pr, "Gave the loan"],
        [tot - pr * (1 + r / 100), "Subtracted the one-year amount"],
      ], finish(d, `${w} repays ${it} in **2 equal annual instalments of ${M(x)}** at **${P(r)}** compounded annually. How much total interest does the lender earn?`,
        [`Loan = ${x} × ${R(f)} + ${x} × ${R(f * f)} = ${M(pr)}`, `Total repaid = 2 × ${x} = ${M(tot)}`, `Interest = ${M(tot)} − ${M(pr)} = **${M(intr)}**`],
        `Find the loan first, then interest = total paid − loan.`,
        `Interest is not ${r}% × 2 years of the full loan: part of it is repaid after year 1, so it stops earning.`));
    }
    const r2 = T(rng, [10, 20, 5, 25]), f2 = 100 / (100 + r2);
    const x = (100 + r2) * (100 + r2) * rng.int(1, 3), pr = x * f2 + x * f2 * f2;
    if (!C(pr)) return null;
    const bal1 = pr * (1 + r2 / 100) - x;
    return mk(rng, M, bal1, [
      [pr - x, "Subtracted the instalment from the loan without adding interest"],
      [pr, "Gave the loan"],
      [x, "Gave the instalment"],
      [pr * (1 + r2 / 100), "Gave the amount before the first instalment"],
    ], finish(d, `A loan of **${M(pr)}** at **${P(r2)}** per annum compounded annually is cleared in 2 equal instalments of **${M(x)}**, paid at the end of year 1 and year 2. What is the outstanding balance just after the first instalment?`,
      [`Amount owed at end of year 1 = ${pr} × ${R(1 + r2 / 100)} = ${M(pr * (1 + r2 / 100))}`, `Balance after paying ${M(x)} = **${M(bal1)}**`],
      `Grow the loan one year, then subtract the instalment.`,
      `Interest is added before the instalment is subtracted; check: ${N(R(bal1))} × ${R(1 + r2 / 100)} = ${N(x)}.`));
  }) });

  /* ------------------------------------------------------------ 7. different rates each year */
  QB.gen("quant/interest/different-rates-each-year", { title: "Different rates each year", gen: wrap((rng, d) => {
    const w = T(rng, WHO), bk = T(rng, WHERE);
    const RR = [5, 10, 20, 25, 4, 8, 12, 15, 40, 50];
    if (d === "Easy") {
      const r1 = T(rng, [10, 20, 5, 25, 50]), r2 = T(rng, [10, 20, 5, 25, 50]);
      if (r1 === r2) return null;
      const base = 400 * rng.int(1, 5) * T(rng, [1, 5, 10]);
      const p = base, a = p * (1 + r1 / 100) * (1 + r2 / 100);
      if (!C(a)) return null;
      return mk(rng, M, a, [
        [p * (1 + (r1 + r2) / 100), "Added the two rates (simple interest)"],
        [p * (1 + (r1 + r2) / 200) * (1 + (r1 + r2) / 200), "Used the average rate for both years"],
        [a - p, "Gave the interest, not the amount"],
        [p * (1 + r1 / 100) * (1 + r1 / 100), "Used the first year's rate twice"],
      ], finish(d, `${w} invests **${M(p)}** with ${bk} at **${P(r1)}** for the first year and **${P(r2)}** for the second year, compounded annually. Find the amount after 2 years.`,
        [`After year 1: ${p} × ${R(1 + r1 / 100)} = ${M(p * (1 + r1 / 100))}`, `After year 2: × ${R(1 + r2 / 100)} = **${M(a)}**`],
        `Multiply the two growth factors: ${R(1 + r1 / 100)} × ${R(1 + r2 / 100)}.`,
        `Apply each year's rate in turn on the grown balance; adding the rates is simple interest.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      const r1 = T(rng, RR), r2 = T(rng, RR), r3 = T(rng, RR);
      const p = 400 * rng.int(1, 8) * T(rng, [1, 5, 10]);
      if (k === 0) {
        const a = p * (1 + r1 / 100) * (1 + r2 / 100), cI = a - p;
        if (!C(a) || r1 === r2) return null;
        return mk(rng, M, cI, [
          [p * (r1 + r2) / 100, "Added the simple interests"],
          [a, "Gave the amount, not the interest"],
          [p * ((1 + r1 / 100) * (1 + r1 / 100) - 1), "Used the first year's rate twice"],
          [p * ((1 + r2 / 100) * (1 + r2 / 100) - 1), "Used the second year's rate twice"],
        ], finish(d, `A sum of **${M(p)}** is lent at compound interest, **${P(r1)}** for the 1st year and **${P(r2)}** for the 2nd year. Find the compound interest earned in 2 years.`,
          [`Amount = ${p} × ${R(1 + r1 / 100)} × ${R(1 + r2 / 100)} = ${M(a)}`, `CI = ${M(a)} − ${M(p)} = **${M(cI)}**`],
          `Net growth = ${r1} + ${r2} + ${r1}×${r2}/100 = ${R(r1 + r2 + r1 * r2 / 100)}%.`,
          `The 2nd year's interest is on the new balance, so CI is more than the sum of two simple interests (${M(p * (r1 + r2) / 100)}).`));
      }
      const a = p * (1 + r1 / 100) * (1 + r2 / 100) * (1 + r3 / 100);
      if (!C(a) || r1 === r2 || r2 === r3 || r1 === r3) return null;
      return mk(rng, M, a, [
        [p * (1 + (r1 + r2 + r3) / 100), "Added the three rates"],
        [p * pw(1 + (r1 + r2 + r3) / 300, 3), "Used the average rate for three years"],
        [a - p, "Gave the interest, not the amount"],
        [p * (1 + r1 / 100) * (1 + r2 / 100), "Stopped after two years"],
      ], finish(d, `${w} deposits **${M(p)}** in ${bk}. The interest, compounded yearly, is **${P(r1)}**, **${P(r2)}** and **${P(r3)}** in years 1, 2 and 3. What is the amount after 3 years?`,
        [`A = ${p} × ${R(1 + r1 / 100)} × ${R(1 + r2 / 100)} × ${R(1 + r3 / 100)}`, `= **${M(a)}**`],
        `Multiply three growth factors one after the other.`,
        `Three different rates: use each factor once. A single average rate is not the same.`));
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      const r1 = T(rng, RR), r2 = T(rng, RR), r3 = T(rng, RR);
      const p = 400 * rng.int(1, 8) * T(rng, [1, 5, 10]);
      const a = p * (1 + r1 / 100) * (1 + r2 / 100) * (1 + r3 / 100);
      if (!C(a) || r1 === r2 || r2 === r3 || r1 === r3) return null;
      return mk(rng, M, p, [
        [a / (1 + (r1 + r2 + r3) / 100), "Treated the rates as simple interest"],
        [a * (1 - (r1 + r2 + r3) / 100), "Reduced the amount by the total of the rates"],
        [a / ((1 + r1 / 100) * (1 + r2 / 100)), "Undid only two of the three years"],
        [a / pw(1 + (r1 + r2 + r3) / 300, 3), "Used the average rate"],
      ].filter((q) => q[0] > 0), finish(d, `${w}'s deposit grows to **${M(a)}** in 3 years with compound interest of **${P(r1)}**, **${P(r2)}** and **${P(r3)}** in the successive years. Find the original deposit.`,
        [`Growth factor = ${R(1 + r1 / 100)} × ${R(1 + r2 / 100)} × ${R(1 + r3 / 100)} = ${R((1 + r1 / 100) * (1 + r2 / 100) * (1 + r3 / 100))}`, `P = ${a} / ${R((1 + r1 / 100) * (1 + r2 / 100) * (1 + r3 / 100))} = **${M(p)}**`],
        `Divide the amount by the combined factor.`,
        `Reversing needs division by each year's factor; subtracting percentages is wrong.`));
    }
    if (k === 1) {
      const r1 = T(rng, RR), r2 = T(rng, RR);
      const p = 400 * rng.int(1, 8) * T(rng, [1, 5, 10]);
      const a = p * (1 + r1 / 100) * (1 + r2 / 100), si = p * (r1 + r2) / 100;
      const diff = a - p - si;
      if (!C(a) || diff <= 0) return null;
      return mk(rng, M, diff, [
        [a - p, "Gave the compound interest, not the difference"],
        [si, "Gave the simple interest"],
        [p * r1 * r2 / 100 / 10, "Moved the decimal one place wrong"],
        [diff * 2, "Doubled the correct difference"],
      ], finish(d, `A sum of **${M(p)}** is invested for 2 years, earning **${P(r1)}** in year 1 and **${P(r2)}** in year 2. By how much does the compounded interest exceed the interest if the rates were applied to the original sum each year?`,
        [`Compounded: ${p} × ${R(1 + r1 / 100)} × ${R(1 + r2 / 100)} − ${p} = ${M(a - p)}`, `Flat: ${p} × (${r1} + ${r2})/100 = ${M(si)}`, `Difference = **${M(diff)}**`],
        `The excess is just r1 × r2 / 100 % of P = ${R(r1 * r2 / 100)}% of ${N(p)}.`,
        `The extra is the interest earned in year 2 on year 1's interest.`));
    }
    const r1 = T(rng, RR), r2 = T(rng, RR), r3 = T(rng, RR);
    const p = 400 * rng.int(1, 8) * T(rng, [1, 5, 10]);
    const a = p * (1 + r1 / 100) * (1 + r2 / 100) * (1 + r3 / 100), cI = a - p;
    if (!C(a) || r1 === r2 || r2 === r3 || r1 === r3) return null;
    return mk(rng, M, cI, [
      [p * (r1 + r2 + r3) / 100, "Added the three simple interests"],
      [a, "Gave the amount, not the interest"],
      [p * (pw(1 + (r1 + r2 + r3) / 300, 3) - 1), "Used the average rate"],
      [p * ((1 + r1 / 100) * (1 + r2 / 100) - 1), "Stopped after two years"],
    ], finish(d, `Find the compound interest on **${M(p)}** for 3 years if the rates for the successive years are **${P(r1)}**, **${P(r2)}** and **${P(r3)}** per annum.`,
      [`A = ${p} × ${R(1 + r1 / 100)} × ${R(1 + r2 / 100)} × ${R(1 + r3 / 100)} = ${M(a)}`, `CI = ${M(a)} − ${M(p)} = **${M(cI)}**`],
      `Multiply the three factors, then subtract the principal.`,
      `The principal must be subtracted at the end, and each rate applies to the balance at that time.`));
  }) });
})();
