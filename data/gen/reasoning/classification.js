/* =====================================================================
   Classification (odd one out): numbers and letter groups.
   Each question is checked against a battery of properties: every
   property that singles out one item must single out the intended one.
   ===================================================================== */
(function () {
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const pos = (c) => A.indexOf(c) + 1;
  const ch = (n) => A[n - 1];
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 90 };
  const finish = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });
  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 3000; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("classification: no clean question found");
    };
  }
  // does some property (other than the intended one) single out a different item?
  function clean(items, preds, odd) {
    for (const p of preds) {
      const ok = items.map(p.f);
      const c = ok.filter(Boolean).length;
      if (c === 1 && !ok[odd]) return false;
      if (c === 3 && ok[odd]) return false;
      if (c === 1 && ok[odd] === false) return false;
    }
    return true;
  }

  /* ------------------------------------------------------------ 1. numbers */
  const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  const isSq = (n) => Number.isInteger(Math.sqrt(n));
  const isCube = (n) => Number.isInteger(Math.round(Math.cbrt(n))) && Math.round(Math.cbrt(n)) ** 3 === n;
  const isPal = (n) => n > 10 && String(n) === String(n).split("").reverse().join("");
  const isPow2 = (n) => n > 0 && (n & (n - 1)) === 0;
  const isTri = (n) => { const k = Math.round((Math.sqrt(8 * n + 1) - 1) / 2); return k * (k + 1) / 2 === n; };
  const ds = (n) => String(n).split("").reduce((a, c) => a + +c, 0);
  const NP = [
    { id: "even", lvl: 0, f: (n) => n % 2 === 0, txt: "even", neg: "odd" },
    { id: "odd", lvl: 0, f: (n) => n % 2 === 1, txt: "odd", neg: "even" },
    { id: "prime", lvl: 0, f: isPrime, txt: "prime", neg: "composite (not prime)" },
    { id: "comp", lvl: 0, f: (n) => n > 1 && !isPrime(n), txt: "composite", neg: "prime" },
    { id: "m3", lvl: 0, f: (n) => n % 3 === 0, txt: "multiples of 3", neg: "not a multiple of 3" },
    { id: "m5", lvl: 0, f: (n) => n % 5 === 0, txt: "multiples of 5", neg: "not a multiple of 5" },
    { id: "m4", lvl: 0, f: (n) => n % 4 === 0, txt: "multiples of 4", neg: "not a multiple of 4" },
    { id: "sq", lvl: 0, f: isSq, txt: "perfect squares", neg: "not a perfect square" },
    { id: "cube", lvl: 1, f: isCube, txt: "perfect cubes", neg: "not a perfect cube" },
    { id: "m7", lvl: 1, f: (n) => n % 7 === 0, txt: "multiples of 7", neg: "not a multiple of 7" },
    { id: "m9", lvl: 1, f: (n) => n % 9 === 0, txt: "multiples of 9", neg: "not a multiple of 9" },
    { id: "m11", lvl: 1, f: (n) => n % 11 === 0, txt: "multiples of 11", neg: "not a multiple of 11" },
    { id: "pow2", lvl: 1, f: isPow2, txt: "powers of 2", neg: "not a power of 2" },
    { id: "pal", lvl: 1, f: isPal, txt: "palindromes (read the same both ways)", neg: "not a palindrome" },
    { id: "tri", lvl: 1, f: isTri, txt: "triangular numbers (1, 3, 6, 10, 15, …)", neg: "not a triangular number" },
    { id: "dse", lvl: 1, f: (n) => ds(n) % 2 === 0, txt: "numbers whose digit sum is even", neg: "has an odd digit sum" },
    { id: "sqm1", lvl: 2, f: (n) => isSq(n + 1), txt: "one less than a perfect square", neg: "not one less than a perfect square" },
    { id: "sqp1", lvl: 2, f: (n) => n > 1 && isSq(n - 1), txt: "one more than a perfect square", neg: "not one more than a perfect square" },
    { id: "m13", lvl: 2, f: (n) => n % 13 === 0, txt: "multiples of 13", neg: "not a multiple of 13" },
    { id: "m17", lvl: 2, f: (n) => n % 17 === 0, txt: "multiples of 17", neg: "not a multiple of 17" },
    { id: "dsq", lvl: 2, f: (n) => isSq(ds(n)), txt: "numbers whose digit sum is a perfect square", neg: "has a digit sum that is not a perfect square" },
    { id: "primepal", lvl: 2, f: (n) => isPrime(n) && isPal(n), txt: "palindromic primes", neg: "not a palindromic prime" },
    { id: "m6", lvl: 99, f: (n) => n % 6 === 0 }, { id: "m8", lvl: 99, f: (n) => n % 8 === 0 }, { id: "m12", lvl: 99, f: (n) => n % 12 === 0 },
    { id: "m14", lvl: 99, f: (n) => n % 14 === 0 }, { id: "m15", lvl: 99, f: (n) => n % 15 === 0 }, { id: "m16", lvl: 99, f: (n) => n % 16 === 0 },
    { id: "m19", lvl: 99, f: (n) => n % 19 === 0 }, { id: "m23", lvl: 99, f: (n) => n % 23 === 0 },
    { id: "d9", lvl: 2, f: (n) => ds(n) === 9 || ds(n) === 18, txt: "numbers whose digits add up to 9 or 18", neg: "digit sum is not 9 or 18" },
  ];
  const CACHE = {};
  QB.gen("reasoning/classification/numbers", { title: "Classification: numbers", gen: wrap((rng, d) => {
    const lvl = { Easy: 0, Medium: 1, Hard: 2 }[d];
    const hi = { Easy: 99, Medium: 199, Hard: 999 }[d], lo = { Easy: 5, Medium: 10, Hard: 20 }[d];
    const R = T(rng, NP.filter((p) => p.lvl === lvl));
    const ck = R.id + d;
    if (!CACHE[ck]) { const a = [], b = []; for (let n = lo; n <= hi; n++) (R.f(n) ? a : b).push(n); CACHE[ck] = [a, b]; }
    const [sat, uns] = CACHE[ck];
    if (sat.length < 4 || uns.length < 4) return null;
    const tri = []; while (tri.length < 3) { const x = T(rng, sat); if (!tri.includes(x)) tri.push(x); }
    const one = T(rng, uns);
    const items = rng.shuffle(tri.concat([one])), odd = items.indexOf(one);
    if (new Set(items).size < 4 || !clean(items, NP, odd)) return null;
    const list = items.join(", ");
    const q = T(rng, [
      `Find the odd one out: **${list}**`,
      `Three of these numbers share a property and one does not. Which is the odd one out? **${list}**`,
      `Which number does not belong with the others? **${list}**`,
      `Choose the number that is different from the rest: **${list}**`,
    ]);
    const o = { opts: items.map(String), ans: odd, why: items.map((n, i) => (i === odd ? null : `${n} is ${R.txt.replace(/s$/, "").replace("multiples", "a multiple").replace("perfect squares", "a perfect square").replace("perfect cubes", "a perfect cube")}-type like the other two, so it is not the odd one`)) };
    o.why = items.map((n, i) => (i === odd ? null : `${n} shares the common property (${R.txt}) with the other two`));
    return Object.assign({ time: TIME[d] }, finish(d, q,
      [`Test a property on all four numbers: ${tri.slice().sort((a, b) => a - b).join(", ")} are all ${R.txt}.`, `**${one}** is ${R.neg}, so it is the odd one out.`],
      "Check the quick properties in turn: even or odd, prime, multiple of 3, 5 or 7, perfect square or cube; the one that splits 3 and 1 is the rule.",
      "Do not stop at the first property that fits two numbers: the real rule must fit exactly three."),
    o, { calc: String(one) });
  }) });

  /* ------------------------------------------------------------ 2. letter groups */
  const vow = "AEIOU";
  const wpos = (w) => [...w].map(pos);
  const gaps = (w) => { const p = wpos(w); const g = []; for (let i = 1; i < p.length; i++) g.push(p[i] - p[i - 1]); return g; };
  const apGap = (w) => { const g = gaps(w); return g.every((x) => x === g[0]) ? g[0] : null; };
  const sum = (w) => wpos(w).reduce((a, b) => a + b, 0);
  const GP = [
    { id: "ap1", f: (w) => apGap(w) === 1 }, { id: "ap2", f: (w) => apGap(w) === 2 }, { id: "ap3", f: (w) => apGap(w) === 3 },
    { id: "ap4", f: (w) => apGap(w) === 4 }, { id: "apAny", f: (w) => apGap(w) !== null },
    { id: "asc", f: (w) => gaps(w).every((x) => x > 0) }, { id: "desc", f: (w) => gaps(w).every((x) => x < 0) },
    { id: "vowel", f: (w) => [...w].some((c) => vow.includes(c)) },
    { id: "sumE", f: (w) => sum(w) % 2 === 0 }, { id: "sum3", f: (w) => sum(w) % 3 === 0 },
    { id: "ends27", f: (w) => pos(w[0]) + pos(w[w.length - 1]) === 27 },
    { id: "mid", f: (w) => w.length === 3 && 2 * pos(w[1]) === pos(w[0]) + pos(w[2]) },
  ];
  const cons = [...A].filter((c) => !vow.includes(c));
  function sortedRand(rng, m, from) {
    const set = new Set(); while (set.size < m) set.add(T(rng, from));
    return [...set].sort((a, b) => pos(a) - pos(b)).join("");
  }
  function ap(rng, m, g) {                       // arithmetic group, gap g (negative = descending)
    const span = Math.abs(g) * (m - 1);
    if (span > 24) return null;
    const lo = g > 0 ? rng.int(1, 26 - span) : rng.int(1 + span, 26);
    return Array.from({ length: m }, (_, i) => ch(lo + g * i)).join("");
  }
  QB.gen("reasoning/classification/letter-groups", { title: "Classification: letter groups", gen: wrap((rng, d) => {
    const m = d === "Hard" ? rng.int(3, 4) : 3;
    let rule, mkSat, mkUns, txt, neg;
    if (d === "Easy") {
      const k = T(rng, ["gap", "gap", "cons"]);
      if (k === "gap") {
        const g = rng.int(1, 3), g2 = T(rng, [1, 2, 3, 4].filter((x) => x !== g));
        rule = "gap"; txt = `the letters go up by ${g} place${g > 1 ? "s" : ""} each time`; neg = `its letters go up by ${g2}, not ${g}`;
        mkSat = () => ap(rng, m, g); mkUns = () => ap(rng, m, g2);
      } else {
        rule = "cons"; txt = "all the letters are consonants"; neg = "it contains a vowel";
        mkSat = () => sortedRand(rng, m, cons);
        mkUns = () => { let w; do { w = sortedRand(rng, m, [...A]); } while (![...w].some((c) => vow.includes(c)) || [...w].filter((c) => vow.includes(c)).length > 1); return w; };
      }
    } else if (d === "Medium") {
      const k = T(rng, ["desc", "sumE", "gapmix"]);
      if (k === "desc") {
        const g = rng.int(1, 3), g2 = rng.int(1, 3);
        rule = "desc"; txt = "the letters run backwards through the alphabet"; neg = "its letters run forwards";
        mkSat = () => ap(rng, m, -(rng.int(1, 3))); mkUns = () => ap(rng, m, g2) ;
        void g;
      } else if (k === "sumE") {
        const par = rng.int(0, 1);
        rule = "sumE"; txt = `the positions of the letters add up to an ${par ? "odd" : "even"} number`; neg = `the positions add up to an ${par ? "even" : "odd"} number`;
        mkSat = () => { let w; do { w = sortedRand(rng, m, [...A]); } while (sum(w) % 2 !== par); return w; };
        mkUns = () => { let w; do { w = sortedRand(rng, m, [...A]); } while (sum(w) % 2 === par); return w; };
      } else {
        const g = rng.int(2, 4);
        rule = "gap"; txt = `each letter is ${g} places after the one before it`; neg = `the gaps between its letters are not all ${g}`;
        mkSat = () => ap(rng, m, g); mkUns = () => { let w; do { w = sortedRand(rng, m, [...A]); } while (apGap(w) !== null); return w; };
      }
    } else {
      const k = T(rng, ["ends27", "sum3", "mid"]);
      if (k === "ends27") {
        rule = "ends27"; txt = "the first and last letters are opposite letters (their positions add up to 27)"; neg = "its first and last letters are not opposites";
        mkSat = () => { const a = rng.int(1, 13); const mid = []; for (let i = 0; i < m - 2; i++) mid.push(ch(rng.int(1, 26))); return ch(a) + mid.join("") + ch(27 - a); };
        mkUns = () => { let w; do { w = Array.from({ length: m }, () => ch(rng.int(1, 26))).join(""); } while (pos(w[0]) + pos(w[m - 1]) === 27); return w; };
      } else if (k === "sum3") {
        rule = "sum3"; txt = "the positions of the letters add up to a multiple of 3"; neg = "its positions do not add up to a multiple of 3";
        mkSat = () => { let w; do { w = sortedRand(rng, m, [...A]); } while (sum(w) % 3 !== 0); return w; };
        mkUns = () => { let w; do { w = sortedRand(rng, m, [...A]); } while (sum(w) % 3 === 0); return w; };
      } else {
        if (m !== 3) return null;
        rule = "mid"; txt = "the middle letter is exactly halfway between the other two"; neg = "its middle letter is not halfway between the other two";
        mkSat = () => { const g = rng.int(1, 5) * (rng.chance(0.3) ? -1 : 1); return ap(rng, 3, g); };
        mkUns = () => { let w; do { w = sortedRand(rng, 3, [...A]); } while (apGap(w) !== null); return w; };
      }
    }
    const tri = [], seen = new Set();
    for (let i = 0; i < 3; i++) { const w = mkSat(); if (!w || seen.has(w)) return null; seen.add(w); tri.push(w); }
    const one = mkUns();
    if (!one || seen.has(one)) return null;
    const groups = rng.shuffle(tri.concat([one])), odd = groups.indexOf(one);
    if (!clean(groups, GP, odd)) return null;
    // the intended property must really separate the odd group
    const list = groups.join(", ");
    const q = T(rng, [
      `Find the odd one out: **${list}**`,
      `Three of these letter groups follow the same rule. Which one does not? **${list}**`,
      `Which letter group does not belong with the others? **${list}**`,
      `Choose the letter group that is different from the rest: **${list}**`,
    ]);
    const o = { opts: groups.map((w, i) => `Group ${i + 1}: ${w}`), ans: odd, why: groups.map((w, i) => (i === odd ? null : `${w} follows the common rule, so it is not the odd one`)) };
    return Object.assign({ time: TIME[d] }, finish(d, q,
      [`Write the alphabet positions of each group: ${groups.map((w) => `${w} = ${wpos(w).join("-")}`).join("; ")}.`, `In ${tri.join(", ")} ${txt}; in **${one}** ${neg}.`, `The odd one out is **Group ${odd + 1}: ${one}**.`],
      "Convert each group to alphabet positions, then compare gaps, order, vowels and sums.",
      "More than one property may split the groups 2 and 2; the rule is the one that puts three together."),
    o, { calc: String(odd + 1) });
  }) });
})();
