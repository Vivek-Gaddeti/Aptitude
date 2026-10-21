/* =====================================================================
   Probability: four question generators (coins, dice, balls from bags,
   at least one). Answers are reduced fractions (QB.frac); each wrong
   option is a real mistake with a "why" text. Counting helpers live in X
   (checked against brute-force enumeration offline).
   ===================================================================== */
(function () {
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 40, Medium: 65, Hard: 100 };
  const nCr = (n, r) => { if (r < 0 || r > n) return 0; r = Math.min(r, n - r); let x = 1; for (let i = 1; i <= r; i++) x = x * (n - r + i) / i; return Math.round(x); };
  const fr = (a, b) => QB.frac(a, b);
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  const X = {
    nCr, isPrime,
    coinsAtLeast: (n, k) => { let s = 0; for (let i = k; i <= n; i++) s += nCr(n, i); return s; },
    coinsAtMost: (n, k) => { let s = 0; for (let i = 0; i <= k; i++) s += nCr(n, i); return s; },
    pairs: (pred) => { let c = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (pred(a, b)) c++; return c; },
    triples: (pred) => { let c = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let e = 1; e <= 6; e++) if (pred(a, b, e)) c++; return c; },
  };

  const CITIES = ["Pune", "Nagpur", "Madurai", "Jaipur", "Lucknow", "Kochi", "Indore", "Surat", "Patna", "Mysuru", "Bhopal", "Ranchi", "Guwahati", "Vizag", "Raipur", "Dehradun", "Agra", "Nashik", "Udaipur", "Coimbatore", "Kanpur", "Vadodara", "Cuttack", "Thrissur", "Jodhpur", "Amritsar", "Hubballi", "Shillong", "Belagavi", "Salem"];
  const JOBS = ["teacher", "trainee", "librarian", "shopkeeper", "coach", "student", "clerk", "game-stall owner", "engineer", "quiz host"];
  const VENUES = ["coaching class", "college fest", "club meeting", "office training", "school fair", "workshop"];
  const lead = (rng) => {
    const c = T(rng, CITIES), k = rng.int(0, 2);
    return k === 0 ? `A ${T(rng, JOBS)} in ${c} asks: ` : k === 1 ? `${cap(T(rng, JOBS))} from ${c}: ` : `At a ${T(rng, VENUES)} in ${c}: `;
  };
  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) { r.q = lead(rng) + r.q; return r; } }
      throw new Error("probability: no clean question found");
    };
  }
  // ans = [num, den]; wrongs = [[num, den, why], ...] in priority order
  function mk(rng, ans, wrongs, extra) {
    const v = ans[0] / ans[1];
    if (!(v > 0 && v < 1) || !Number.isInteger(ans[0]) || !Number.isInteger(ans[1])) return null;
    const A = fr(ans[0], ans[1]), seen = new Set([A]), pairs = [[A, null]];
    for (const w of wrongs) {
      if (pairs.length === 4) break;
      const [n, dn, why] = w;
      if (!Number.isInteger(n) || !Number.isInteger(dn) || n <= 0 || dn <= 0 || n >= dn) continue;
      const t = fr(n, dn);
      if (seen.has(t)) continue;
      seen.add(t); pairs.push([t, why || null]);
    }
    if (pairs.length < 4) return null;
    return Object.assign({ time: TIME[extra.d] }, extra, QB.options(rng, pairs), { calc: ans[0] + "/" + ans[1] });
  }
  const finish = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });

  /* ------------------------------------------------------------------ 1. coins */
  QB.gen("quant/probability/coins", { title: "Coins", gen: wrap((rng, d) => {
    const hd = rng.chance(0.5), W = hd ? "heads" : "tails", w1 = hd ? "head" : "tail", O = hd ? "tails" : "heads";
    const sub = (n) => T(rng, [`A fair coin is tossed **${n}** times.`, `**${n}** fair coins are tossed together.`, `A fair coin is flipped **${n}** times in a row.`, `An unbiased coin is tossed **${n}** times.`]);
    const plural = (k) => (k === 1 ? w1 : W);
    if (d === "Easy") {
      const n = rng.int(2, 4), k = rng.int(0, n), f = nCr(n, k), tot = Math.pow(2, n);
      if (f === tot) return null;
      return mk(rng, [f, tot], [[1, tot, "Counted only one favourable outcome"], [k, n, "Used k ÷ n instead of counting outcomes"], [f, tot - 1, "Used 2^n − 1 as the total"], [1, 2, "Assumed it is just 50-50"], [k + 1, tot, "Counted one extra outcome"]],
        finish(d, `${sub(n)} What is the probability of getting exactly **${k}** ${plural(k)}?`,
          [`Total outcomes = 2^${n} = ${tot}`, `Favourable (exactly ${k} ${plural(k)}) = ${n}C${k} = ${f}`, `P = ${f}/${tot} = **${fr(f, tot)}**`], `Favourable = nCk; total = 2^n.`, `The tosses are ordered, so HT and TH are different outcomes: use nCk, not 1.`));
    }
    if (d === "Medium") {
      const n = rng.int(4, 5), k = rng.int(2, n - 1), kind = rng.int(0, 2), tot = Math.pow(2, n);
      if (kind === 0) { const f = X.coinsAtLeast(n, k);
        return mk(rng, [f, tot], [[nCr(n, k), tot, `Counted only exactly ${k} ${W}`], [(n - k + 1), tot, "Counted the wrong number of outcomes"], [1, tot, "Counted a single outcome"], [tot - f, tot, "Gave the complement"], [k, n, "Used k ÷ n"]],
          finish(d, `${sub(n)} What is the probability of getting **at least ${k}** ${W}?`,
            [`Total outcomes = 2^${n} = ${tot}`, `At least ${k} ${W}: ${Array.from({ length: n - k + 1 }, (_, i) => `${n}C${k + i}`).join(" + ")} = ${f}`, `P = ${f}/${tot} = **${fr(f, tot)}**`], `Add the cases from k up to n.`, `"At least ${k}" includes ${k}, ${k + 1}, … ${n} ${W}: adding only one case is the classic slip.`)); }
      if (kind === 1) { const f = nCr(n, k);
        return mk(rng, [f, tot], [[1, tot, "Counted a single outcome"], [k, n, "Used k ÷ n"], [X.coinsAtLeast(n, k), tot, `Counted "at least ${k}"`], [f, tot / 2, "Used half the true total"], [1, 2]],
          finish(d, `${sub(n)} Find the probability of getting **exactly ${k}** ${W}.`,
            [`Total outcomes = 2^${n} = ${tot}`, `Ways to choose which ${k} tosses are ${W}: ${n}C${k} = ${f}`, `P = **${fr(f, tot)}**`], `nCk ÷ 2^n.`, `Different positions of the ${W} are different outcomes, so one pattern is not enough.`)); }
      return mk(rng, [2, tot], [[1, tot, "Counted only all-same-face once"], [1, 2], [n, tot, "Counted n outcomes"], [2, tot - 1, "Used 2^n − 1 as the total"]],
        finish(d, `${sub(n)} What is the probability that **all ${n} tosses show the same face**?`,
          [`Total outcomes = 2^${n} = ${tot}`, `Favourable: all ${W} or all ${O} = 2`, `P = 2/${tot} = **${fr(2, tot)}**`], `2 ÷ 2^n.`, `Both "all ${W}" and "all ${O}" count, so the numerator is 2.`));
    }
    const n = rng.int(5, 6), tot = Math.pow(2, n), kind = rng.int(0, 2);
    if (kind === 0) { const k = rng.int(1, n - 3), f = X.coinsAtMost(n, k);
      return mk(rng, [f, tot], [[nCr(n, k), tot, `Counted only exactly ${k} ${W}`], [X.coinsAtLeast(n, k), tot, `Counted "at least ${k}" instead`], [f - 1, tot, "Left out one case"], [tot - f, tot, "Gave the complement"], [k, n]],
        finish(d, `${sub(n)} What is the probability of getting **at most ${k}** ${W}?`,
          [`Total outcomes = 2^${n} = ${tot}`, `At most ${k}: ${Array.from({ length: k + 1 }, (_, i) => `${n}C${i}`).join(" + ")} = ${f}`, `P = ${f}/${tot} = **${fr(f, tot)}**`], `Add nC0 up to nCk.`, `"At most ${k}" includes zero ${W} as well.`)); }
    if (kind === 1) { const k = rng.int(2, n - 2), f = nCr(n - 1, k - 1);
      return mk(rng, [f, tot], [[nCr(n, k), tot, "Ignored the condition on the first toss"], [nCr(n - 1, k), tot, `Chose ${k} ${W} from the other tosses`], [nCr(n - 1, k - 1), Math.pow(2, n - 1), "Used the total for n − 1 tosses"], [nCr(n, k), tot / 2]],
        finish(d, `${sub(n)} What is the probability that the first toss is a ${w1} and there are **exactly ${k}** ${W} in all?`,
          [`First toss is a ${w1}: it uses up 1 of the ${k} ${W}`, `Choose the other ${k - 1} ${W} from the remaining ${n - 1} tosses: ${n - 1}C${k - 1} = ${f}`, `P = ${f}/${tot} = **${fr(f, tot)}**`], `(n−1)C(k−1) ÷ 2^n.`, `The total is still 2^${n}: all ${n} tosses are random, even though one is specified.`)); }
    const f = tot / 2;
    return mk(rng, [f, tot], [[f - 1, tot, "Left out one outcome"], [nCr(n, n / 2 | 0), tot, "Counted only the middle case"], [1, 3, "Treated even/odd/none as three equal cases"], [f + 1, tot]],
      finish(d, `${sub(n)} What is the probability that the number of ${W} is **even** (0 counts as even)?`,
        [`Total outcomes = 2^${n} = ${tot}`, `Outcomes with an even number of ${W} = outcomes with an odd number, by symmetry = ${f}`, `P = ${f}/${tot} = **${fr(f, tot)}**`], `Exactly half of all outcomes have an even count: 1/2.`, `Even and odd counts split the 2^n outcomes equally, so no heavy addition is needed.`));
  }) });

  /* ------------------------------------------------------------------ 2. dice */
  const ONE = [["an even number", (x) => x % 2 === 0], ["an odd number", (x) => x % 2 === 1], ["a prime number", (x) => isPrime(x)], ["a multiple of 3", (x) => x % 3 === 0], ["a number greater than 4", (x) => x > 4], ["a number less than 3", (x) => x < 3], ["a perfect square", (x) => x === 1 || x === 4], ["a number greater than 2", (x) => x > 2], ["a factor of 6", (x) => 6 % x === 0]];
  const DICE2 = ["Two fair dice are thrown together.", "A pair of unbiased dice is rolled once.", "Two dice are rolled at the same time.", "Two fair six-faced dice are thrown."];
  const listPairs = (pred) => { const a = []; for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) if (pred(i, j)) a.push(`(${i},${j})`); return a; };
  function diceQ(rng, d, cond, pred, kind) {
    const fav = X.pairs(pred);
    if (fav === 0 || fav === 36) return null;
    const lp = listPairs(pred);
    const wr = [[fav, 12, "Treated the 11 possible sums as equally likely / used 12"], [fav, 6, "Used 6 as the total instead of 36"], [fav + 1, 36, "Counted one extra outcome"], [fav - 1, 36, "Missed one outcome"], [36 - fav, 36, "Gave the complement"], [1, fav, "Used 1 ÷ favourable"]];
    if (kind === "sum") wr[0] = [fav, 11, "Treated the 11 possible sums (2 to 12) as equally likely"];
    return mk(rng, [fav, 36], wr, finish(d, `${T(rng, DICE2)} What is the probability that ${cond}?`,
      [`Total outcomes = 6 × 6 = 36`, lp.length <= 10 ? `Favourable: ${lp.join(" ")} = ${fav}` : `Favourable outcomes = ${fav}`, `P = ${fav}/36 = **${fr(fav, 36)}**`],
      `Count the favourable pairs, divide by 36.`, `Dice are distinguishable: (2,5) and (5,2) are two different outcomes.`));
  }
  QB.gen("quant/probability/dice", { title: "Dice (sums, doubles)", gen: wrap((rng, d) => {
    if (d === "Easy") {
      if (rng.chance(0.45)) {
        const [txt, p] = T(rng, ONE), fav = [1, 2, 3, 4, 5, 6].filter(p).length;
        if (fav === 6 || fav === 0) return null;
        return mk(rng, [fav, 6], [[fav + 1, 6, "Counted one extra face"], [fav - 1, 6, "Missed a face"], [fav, 5, "Used 5 as the total"], [1, 6, "Counted only one face"], [6 - fav, 6, "Gave the complement"], [fav, 12]],
          finish(d, `${T(rng, ["A fair die is thrown once.", "An unbiased die is rolled.", "A standard six-faced die is thrown."])} What is the probability of getting ${txt}?`,
            [`Total outcomes = 6`, `Favourable faces: ${[1, 2, 3, 4, 5, 6].filter(p).join(", ")} = ${fav}`, `P = ${fav}/6 = **${fr(fav, 6)}**`], `Count the faces that qualify, divide by 6.`, `Check each of the six faces against the wording (1 is not prime, for instance).`));
      }
      const k = rng.int(0, 2);
      if (k === 0) { const s = T(rng, [3, 4, 5, 6, 8, 9, 10, 11]); return diceQ(rng, d, `the **sum** of the two numbers is **${s}**`, (a, b) => a + b === s, "sum"); }
      if (k === 1) return diceQ(rng, d, "both dice show the **same number**", (a, b) => a === b);
      const s = T(rng, [5, 6, 7, 8, 9, 10]);
      return diceQ(rng, d, `the sum of the numbers is **${s}**`, (a, b) => a + b === s, "sum");
    }
    if (d === "Medium") {
      const k = rng.int(0, 5);
      if (k === 0) { const s = rng.int(8, 11); return diceQ(rng, d, `the sum of the two numbers is **at least ${s}**`, (a, b) => a + b >= s, "sum"); }
      if (k === 1) { const s = rng.int(3, 6); return diceQ(rng, d, `the sum of the two numbers is **less than ${s}**`, (a, b) => a + b < s, "sum"); }
      if (k === 2) return diceQ(rng, d, "the **product** of the two numbers is **even**", (a, b) => (a * b) % 2 === 0);
      if (k === 3) return diceQ(rng, d, "the **product** of the two numbers is **odd**", (a, b) => (a * b) % 2 === 1);
      if (k === 4) { const s = rng.int(5, 9); return diceQ(rng, d, `the first die shows a **larger** number than the second and the sum is **${s}**`, (a, b) => a > b && a + b === s, "sum"); }
      return diceQ(rng, d, "the numbers on the two dice are **different**", (a, b) => a !== b);
    }
    const k = rng.int(0, 6);
    if (k === 0) return diceQ(rng, d, "the **sum** of the two numbers is a **prime number**", (a, b) => isPrime(a + b), "sum");
    if (k === 1) { const m = T(rng, [3, 4]); return diceQ(rng, d, `the sum of the two numbers is a **multiple of ${m}**`, (a, b) => (a + b) % m === 0, "sum"); }
    if (k === 2) { const g = rng.int(1, 3); return diceQ(rng, d, `the two numbers **differ by exactly ${g}**`, (a, b) => Math.abs(a - b) === g); }
    if (k === 3) return diceQ(rng, d, "one number is **exactly twice** the other", (a, b) => a === 2 * b || b === 2 * a);
    if (k === 4) { const t = rng.int(15, 24); return diceQ(rng, d, `the **product** of the two numbers is **more than ${t}**`, (a, b) => a * b > t); }
    // three dice
    const s = rng.int(6, 15), fav = X.triples((a, b, c) => a + b + c === s);
    if (k === 5) return mk(rng, [fav, 216], [[fav, 36, "Used 36 as the total"], [fav, 18, "Used 3 × 6 = 18 as the total"], [fav + 1, 216, "Counted one extra outcome"], [fav - 1, 216, "Missed one outcome"], [fav, 16, "Used 16 possible sums as equally likely"]],
      finish(d, `Three fair dice are thrown together. What is the probability that the **sum** of the three numbers is **${s}**?`,
        [`Total outcomes = 6 × 6 × 6 = 216`, `Count the ordered triples with sum ${s}: **${fav}**`, `P = ${fav}/216 = **${fr(fav, 216)}**`], `List triples by type: all different (6 orders), two same (3 orders), all same (1).`, `Triples are ordered: (1,2,6) can occur in 6 ways, not 1.`));
    const dist = X.triples((a, b, c) => a !== b && b !== c && a !== c);
    return mk(rng, [dist, 216], [[1, 2, "Guessed"], [dist, 6 * 6, "Used 36 as the total"], [20, 216, "Counted unordered combinations (C(6,3) = 20)"], [dist + 6, 216], [6 * 5 * 4 - 1, 216]],
      finish(d, `Three fair dice are thrown together. What is the probability that **all three show different numbers**?`,
        [`Total outcomes = 216`, `First die: any (6); second: different from the first (5); third: different from both (4)`, `Favourable = 6 × 5 × 4 = ${dist}`, `P = ${dist}/216 = **${fr(dist, 216)}**`], `(6 × 5 × 4) ÷ 216 = 5/9.`, `The dice are distinct, so count ordered choices (6 × 5 × 4), not combinations.`));
  }) });

  /* ------------------------------------------------------------------ 3. balls from bags */
  const COL = [["red", "blue", "green"], ["white", "black", "yellow"], ["pink", "orange", "violet"], ["red", "white", "green"], ["blue", "yellow", "black"]];
  const BAG = ["A bag", "A box", "An urn", "A jar", "A pouch"];
  const SW = (n, v) => (n === 1 ? v.replace(/s$/, "") : v);
  QB.gen("quant/probability/balls-from-bags-with-without", { title: "Balls from bags, with / without replacement", gen: wrap((rng, d) => {
    const [c1, c2, c3] = T(rng, COL), bag = T(rng, BAG);
    if (d === "Easy") {
      const r = rng.int(2, 9), b = rng.int(2, 9), g = rng.chance(0.5) ? rng.int(2, 6) : 0, t = r + b + g, k = rng.int(0, 2);
      const desc = `${bag} contains **${r} ${c1}**, **${b} ${c2}**${g ? ` and **${g} ${c3}**` : ""} balls`;
      if (k === 0) return mk(rng, [r, t], [[r, b, `Used ${c1} ÷ ${c2} (odds) instead of ${c1} ÷ total`], [b, t, `Found the probability of ${c2}`], [r, t - 1, "Used total − 1 in the denominator"], [r + 1, t, "Counted one extra ball"], [r, t + 1]],
        finish(d, `${desc}. One ball is drawn at random. What is the probability that it is **${c1}**?`,
          [`Total balls = ${t}`, `${c1} balls = ${r}`, `P = ${r}/${t} = **${fr(r, t)}**`], `Favourable ÷ total.`, `Divide by ALL the balls, not by the other colour alone.`));
      if (k === 1) return mk(rng, [t - r, t], [[r, t, `Gave the probability of ${c1}`], [t - r, t - 1], [b, t, `Counted only ${c2}`], [t - r, r, "Used odds instead of probability"], [t - r + 1, t]],
        finish(d, `${desc}. One ball is drawn at random. What is the probability that it is **not ${c1}**?`,
          [`Balls that are not ${c1} = ${t} − ${r} = ${t - r}`, `P = ${t - r}/${t} = **${fr(t - r, t)}**`], `1 − P(${c1}).`, `"Not ${c1}" is the complement, so use the other balls, not the ${c1} ones.`));
      if (!g) return null;
      return mk(rng, [r + b, t], [[r * b, t * t, "Multiplied instead of adding for 'or'"], [r + b, t - 1], [g, t, `Gave P(${c3})`], [r, t], [r + b + 1, t]],
        finish(d, `${desc}. One ball is drawn at random. What is the probability that it is **${c1} or ${c2}**?`,
          [`Favourable = ${r} + ${b} = ${r + b}`, `P = ${r + b}/${t} = **${fr(r + b, t)}**`], `Add the favourable balls (one ball cannot be both).`, `"Or" for a single draw means add the counts.`));
    }
    if (d === "Medium") {
      const r = rng.int(3, 8), b = rng.int(3, 8), t = r + b, k = rng.int(0, 3);
      const desc = `${bag} contains **${r} ${c1}** and **${b} ${c2}** balls`;
      if (k === 0) return mk(rng, [r * (r - 1), t * (t - 1)], [[r * r, t * t, "Forgot that the first ball is not put back"], [r, t, `Gave P(first is ${c1}) only`], [2 * r, t * (t - 1) / 1, "Doubled the count"], [r * (r - 1), t * t], [nCr(r, 2), t * (t - 1)]],
        finish(d, `${desc}. Two balls are drawn one after the other **without replacement**. What is the probability that **both are ${c1}**?`,
          [`P(first ${c1}) = ${r}/${t}`, `P(second ${c1}) = ${r - 1}/${t - 1} (one ${c1} ball is gone)`, `P = ${r}/${t} × ${r - 1}/${t - 1} = **${fr(r * (r - 1), t * (t - 1))}**`], `Both red: rC2 ÷ tC2.`, `Without replacement the second fraction changes: (${r - 1})/(${t - 1}).`));
      if (k === 1) return mk(rng, [r * r, t * t], [[r * (r - 1), t * (t - 1), "Used 'without replacement' numbers"], [2 * r, 2 * t, "Added the fractions"], [r, t, "Gave one draw only"], [r * r, t * (t - 1)]],
        finish(d, `${desc}. Two balls are drawn one after the other **with replacement**. What is the probability that **both are ${c1}**?`,
          [`Each draw: P(${c1}) = ${r}/${t}, and the ball is put back`, `P = (${r}/${t})² = **${fr(r * r, t * t)}**`], `(r/t)².`, `With replacement, the two draws are independent: the second fraction does not change.`));
      if (k === 2) return mk(rng, [r * b, nCr(t, 2)], [[r * b, t * t, "Used the with-replacement total"], [2 * r * b, t * t, "Doubled for order but kept the replacement total"], [nCr(r, 2) + nCr(b, 2), nCr(t, 2), "Counted same-colour pairs"], [r * b, t * (t - 1)], [r + b, nCr(t, 2)]],
        finish(d, `${desc}. Two balls are drawn together at random. What is the probability that **one is ${c1} and one is ${c2}**?`,
          [`Total pairs = ${t}C2 = ${nCr(t, 2)}`, `Favourable = ${r}C1 × ${b}C1 = ${r * b}`, `P = ${r * b}/${nCr(t, 2)} = **${fr(r * b, nCr(t, 2))}**`], `(rC1 × bC1) ÷ tC2.`, `Drawing together is the same as drawing without replacement with order ignored: the denominator is tC2.`));
      return mk(rng, [2 * r * b, t * (t - 1)], [[r * b, t * (t - 1), "Counted only one order"], [2 * r * b, t * t, "Used the with-replacement total"], [nCr(r, 2) + nCr(b, 2), nCr(t, 2), "Counted same-colour pairs"], [r * b, nCr(t, 2) * 2]],
        finish(d, `${desc}. Two balls are drawn one after the other **without replacement**. What is the probability that they are of **different colours**?`,
          [`${c1} then ${c2}: ${r}/${t} × ${b}/${t - 1}`, `${c2} then ${c1}: ${b}/${t} × ${r}/${t - 1}`, `Add: ${2 * r * b}/${t * (t - 1)} = **${fr(2 * r * b, t * (t - 1))}**`], `Different colours = 2 × r × b ÷ t(t − 1).`, `Both orders (${c1} first or ${c2} first) count, so double the single-order product.`));
    }
    const r = rng.int(2, 6), b = rng.int(2, 6), g = rng.int(2, 6), t = r + b + g, k = rng.int(0, 3);
    const desc3 = `${bag} has **${r} ${c1}**, **${b} ${c2}** and **${g} ${c3}** balls`;
    if (k === 0) return mk(rng, [r * b * g, nCr(t, 3)], [[r * b * g, t * (t - 1) * (t - 2), "Used ordered total without counting orders"], [r * b * g, Math.pow(t, 3), "Used the with-replacement total"], [6 * r * b * g, t * t * t, "Used replacement numbers"], [r + b + g, nCr(t, 3)], [3 * r * b * g, nCr(t, 3)]],
      finish(d, `${desc3}. Three balls are drawn together at random. What is the probability that **one ball of each colour** is drawn?`,
        [`Total ways = ${t}C3 = ${nCr(t, 3)}`, `Favourable = ${r} × ${b} × ${g} = ${r * b * g}`, `P = ${r * b * g}/${nCr(t, 3)} = **${fr(r * b * g, nCr(t, 3))}**`], `(r × b × g) ÷ tC3.`, `Choosing together ignores order, so use combinations in both numerator and denominator.`));
    if (k === 1) { const f = nCr(r, 3) + nCr(b, 3) + nCr(g, 3), den = nCr(t, 3);
      if (f === 0) return null;
      return mk(rng, [f, den], [[nCr(r, 3), den, `Counted only ${c1}`], [(r * r * r + b * b * b + g * g * g), t * t * t, "Used the with-replacement values"], [f, den - 1], [r * b * g, den, "Gave P(one of each)"]],
        finish(d, `${desc3}. Three balls are drawn together at random. What is the probability that **all three have the same colour**?`,
          [`Total ways = ${t}C3 = ${den}`, `Favourable = ${r}C3 + ${b}C3 + ${g}C3 = ${nCr(r, 3)} + ${nCr(b, 3)} + ${nCr(g, 3)} = ${f}`, `P = ${f}/${den} = **${fr(f, den)}**`], `Add the same-colour triples of each colour.`, `Include every colour that has at least 3 balls, not just one.`)); }
    if (k === 2) { const f = nCr(r, 2) * (b + g), den = nCr(t, 3);
      return mk(rng, [f, den], [[nCr(r, 2) * (t - 2), den, "Allowed the third ball to be any ball (incl. a third " + c1 + ")"], [nCr(r, 2), den, "Forgot to choose the third ball"], [nCr(r, 2) * (b + g), t * (t - 1) * (t - 2) / 2, "Used the wrong total"], [nCr(r, 2) * (b + g) + nCr(r, 3), den, "Added the 'all three red' case"]],
        finish(d, `${desc3}. Three balls are drawn together at random. What is the probability that **exactly two are ${c1}**?`,
          [`Total ways = ${t}C3 = ${den}`, `Two ${c1}: ${r}C2 = ${nCr(r, 2)}; one non-${c1}: ${b + g} choices`, `Favourable = ${nCr(r, 2)} × ${b + g} = ${f}`, `P = ${f}/${den} = **${fr(f, den)}**`], `rC2 × (others) ÷ tC3.`, `The third ball must NOT be ${c1}, otherwise it would be three of that colour.`));
    }
    return mk(rng, [r * b, t * (t - 1)], [[r * b, t * t, "Used the with-replacement total"], [r * b, t * (t - 1) / 2, "Used the unordered total for an ordered event"], [r, t, "Gave P(first is " + c1 + ")"], [r * (b - 1), t * (t - 1)], [r * g, t * (t - 1)]],
      finish(d, `${desc3}. Two balls are drawn one after the other **without replacement**. What is the probability that the first is **${c1}** and the second is **${c2}**?`,
        [`P(first ${c1}) = ${r}/${t}`, `P(second ${c2} | first ${c1}) = ${b}/${t - 1}`, `P = ${r}/${t} × ${b}/${t - 1} = **${fr(r * b, t * (t - 1))}**`], `Multiply along the path: r/t × b/(t − 1).`, `The order is fixed here (${c1} first), so there is no doubling.`));
  }) });

  /* ------------------------------------------------------------------ 4. at least one */
  QB.gen("quant/probability/at-least-one", { title: "At least one (complement)", gen: wrap((rng, d) => {
    const hd = rng.chance(0.5), W = hd ? "head" : "tail";
    if (d === "Easy") {
      const k = rng.int(0, 1);
      if (k === 0) { const n = rng.int(2, 4), tot = Math.pow(2, n);
        return mk(rng, [tot - 1, tot], [[1, tot, `Gave P(no ${W})`], [n, tot, "Counted n outcomes"], [1, 2, "Assumed 1/2"], [tot - 2, tot, "Removed two outcomes"], [n, n + 1]],
          finish(d, `A fair coin is tossed **${n}** times. What is the probability of getting **at least one ${W}**?`,
            [`P(no ${W}) = (1/2)^${n} = 1/${tot}`, `P(at least one ${W}) = 1 − 1/${tot} = **${fr(tot - 1, tot)}**`], `1 − (1/2)^n.`, `"At least one" is easiest as 1 − P(none).`));
      }
      const n = rng.int(2, 3), tot = Math.pow(6, n), f = tot - Math.pow(5, n);
      return mk(rng, [f, tot], [[n, 6, "Added the probabilities 1/6 each time"], [Math.pow(5, n), tot, "Gave P(no six)"], [1, 6, "Gave a single throw"], [f - 1, tot], [n, tot]],
        finish(d, `A fair die is thrown **${n}** times. What is the probability of getting **at least one six**?`,
          [`P(no six in one throw) = 5/6`, `P(no six in ${n} throws) = (5/6)^${n} = ${Math.pow(5, n)}/${tot}`, `P(at least one six) = 1 − ${Math.pow(5, n)}/${tot} = **${fr(f, tot)}**`], `1 − (5/6)^n.`, `Adding 1/6 + 1/6 … over-counts the throws where more than one six appears.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      if (k === 0) { const n = rng.int(5, 6), tot = Math.pow(2, n);
        return mk(rng, [tot - 1, tot], [[1, tot, `Gave P(no ${W})`], [n, tot], [tot - 2, tot], [n, n + 1], [(n - 1), n]],
          finish(d, `**${n}** fair coins are tossed together. What is the probability that **at least one** shows a ${W}?`,
            [`P(no ${W}) = (1/2)^${n} = 1/${tot}`, `1 − 1/${tot} = **${fr(tot - 1, tot)}**`], `1 − (1/2)^n.`, `Listing the cases with 1, 2, … ${W}s is slow and error-prone; use the complement.`));
      }
      if (k === 1) { const f = 216 - 125;
        return mk(rng, [f, 216], [[125, 216, "Gave P(no six)"], [1, 2, "Added 1/6 three times"], [3, 36, "Used 3 × 1/12"], [f - 5, 216], [91, 200]],
          finish(d, `Three fair dice are rolled together. What is the probability that **at least one die shows a six**?`,
            [`P(no six on a die) = 5/6`, `P(no six on all three) = 125/216`, `P(at least one six) = 1 − 125/216 = **${fr(f, 216)}**`], `1 − (5/6)³.`, `Adding 1/6 three times gives 1/2, which counts double sixes more than once.`));
      }
      const pa = T(rng, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5]]), pb = T(rng, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5]]);
      const [na, da] = pa, [nb, db] = pb, num = da * db - (da - na) * (db - nb), den = da * db;
      const [n1, n2] = T(rng, [["Karan", "Leela"], ["Mehul", "Nisha"], ["Pooja", "Qadir"], ["Rohan", "Sana"]]);
      return mk(rng, [num, den], [[(da - na) * (db - nb), den, "Gave P(neither hits)"], [na * nb, den, "Gave P(both hit)"], [na * db + nb * da, den, "Added the two probabilities (double-counts 'both')"], [num - 1, den], [na * (db - nb) + nb * (da - na), den, "Gave P(exactly one)"]],
        finish(d, `${n1} hits a target with probability **${fr(na, da)}** and ${n2} independently with probability **${fr(nb, db)}**. If each shoots once, what is the probability that the target is hit **at least once**?`,
          [`P(${n1} misses) = ${fr(da - na, da)}, P(${n2} misses) = ${fr(db - nb, db)}`, `P(both miss) = ${fr((da - na) * (db - nb), den)}`, `P(at least one hit) = 1 − ${fr((da - na) * (db - nb), den)} = **${fr(num, den)}**`], `1 − P(miss) × P(miss).`, `Adding ${fr(na, da)} + ${fr(nb, db)} counts the 'both hit' case twice.`));
    }
    const k = rng.int(0, 3);
    if (k === 0) { const dft = rng.int(1, 3), good = rng.int(4, 9), t = dft + good, s = rng.int(2, 3), f = nCr(t, s) - nCr(good, s);
      if (good < s) return null;
      return mk(rng, [f, nCr(t, s)], [[nCr(good, s), nCr(t, s), "Gave P(no defective)"], [dft * s, t, "Added the single-draw probabilities"], [f, t * (t - 1), "Used the wrong total"], [dft * nCr(t - 1, s - 1), nCr(t, s), "Chose a defective first then anyone (double counts)"], [f - 1, nCr(t, s)]],
        finish(d, `A box has **${t}** bulbs, of which **${dft}** are defective. **${s}** bulbs are drawn at random together. What is the probability that **at least one is defective**?`,
          [`Total ways = ${t}C${s} = ${nCr(t, s)}`, `No defective: ${good}C${s} = ${nCr(good, s)}`, `P(at least one defective) = 1 − ${fr(nCr(good, s), nCr(t, s))} = **${fr(f, nCr(t, s))}**`], `1 − (good C s) ÷ (total C s).`, `Picking a defective one first and then any other double-counts the draws with two defectives.`));
    }
    if (k === 1) { const ps = [T(rng, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]), T(rng, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]), T(rng, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]])];
      const miss = ps.reduce((a, p) => a * (p[1] - p[0]), 1), den = ps.reduce((a, p) => a * p[1], 1), hit = ps.reduce((a, p) => a * p[0], 1);
      return mk(rng, [den - miss, den], [[miss, den, "Gave P(all three miss)"], [hit, den, "Gave P(all three hit)"], [ps.reduce((a, p) => a + p[0] / p[1], 0) < 1 ? Math.round(ps.reduce((a, p) => a + p[0] / p[1], 0) * den) : den - miss + 1, den, "Added the three probabilities"], [den - miss - 1, den]],
        finish(d, `Three friends try independently to solve a puzzle, with success probabilities **${fr(ps[0][0], ps[0][1])}**, **${fr(ps[1][0], ps[1][1])}** and **${fr(ps[2][0], ps[2][1])}**. What is the probability that the puzzle is solved by **at least one** of them?`,
          [`P(all fail) = ${ps.map((p) => fr(p[1] - p[0], p[1])).join(" × ")} = ${fr(miss, den)}`, `P(at least one solves) = 1 − ${fr(miss, den)} = **${fr(den - miss, den)}**`], `1 − product of the failure probabilities.`, `Independent events multiply for "all fail"; adding the success probabilities can even exceed 1.`));
    }
    if (k === 2) { const n = rng.int(3, 5), tot = Math.pow(2, n);
      return mk(rng, [tot - 2, tot], [[tot - 1, tot, "Used only 'at least one head'"], [2, tot, "Gave P(all same)"], [n, tot], [tot - 4, tot, "Removed too many cases"], [1, 2]],
        finish(d, `A fair coin is tossed **${n}** times. What is the probability of getting **at least one head and at least one tail**?`,
          [`Failing outcomes: all heads or all tails = 2`, `P = 1 − 2/${tot} = **${fr(tot - 2, tot)}**`], `1 − 2/2^n.`, `Two outcomes fail (all heads, all tails), not one.`));
    }
    const sx = rng.int(2, 4), tot = Math.pow(6, sx), f = tot - Math.pow(4, sx);
    return mk(rng, [f, tot], [[Math.pow(4, sx), tot, "Gave P(no 1 or 2)"], [2 * sx, 6, "Added 2/6 for each throw"], [f - 1, tot], [1, 3, "Gave a single throw"], [sx, 3]],
      finish(d, `A fair die is thrown **${sx}** times. What is the probability of getting a number **greater than 4 at least once**?`,
        [`P(greater than 4 on one throw) = 2/6 = 1/3, so P(not) = 4/6 = 2/3`, `P(never greater than 4 in ${sx} throws) = (2/3)^${sx} = ${Math.pow(2, sx)}/${Math.pow(3, sx)}`, `P(at least once) = 1 − ${fr(Math.pow(4, sx), tot)} = **${fr(f, tot)}**`], `1 − (2/3)^n.`, `Repeated "success" chances are not added: use 1 − P(failure every time).`));
  }) });

  QB.__x = QB.__x || {}; QB.__x.prob = X;
})();
