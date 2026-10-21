/* =====================================================================
   Permutations & combinations: eight question generators (one per catalog
   pattern marked gen: true). Every wrong option is a real mistake with a
   "why" text. Counting formulas live in X (checked by brute force offline).
   ===================================================================== */
(function () {
  const N = (x) => QB.num(x);
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 40, Medium: 65, Hard: 100 };
  const F = (n) => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
  const nPr = (n, r) => { if (r < 0 || r > n) return 0; let x = 1; for (let i = 0; i < r; i++) x *= (n - i); return x; };
  const nCr = (n, r) => { if (r < 0 || r > n) return 0; r = Math.min(r, n - r); let x = 1; for (let i = 1; i <= r; i++) x = x * (n - r + i) / i; return Math.round(x); };
  const prodF = (counts) => counts.reduce((a, c) => a * F(c), 1);
  const cap = (s) => s[0].toUpperCase() + s.slice(1);

  /* ---- formulas (X) ---- */
  const X = {
    F, nPr, nCr,
    together: (n, k) => F(n - k + 1) * F(k),
    apart2: (n) => F(n) - 2 * F(n - 1),
    altern: (b, g) => (b === g ? 2 * F(b) * F(g) : Math.abs(b - g) === 1 ? F(b) * F(g) : 0),
    aBeforeB: (n) => F(n) / 2,
    ends: (n) => 2 * F(n - 2),
    inOrder3: (n) => F(n) / 6,
    msPerm: (counts) => F(counts.reduce((a, b) => a + b, 0)) / prodF(counts),
    circ: (n) => F(n - 1),
    circTogether: (n, k) => F(n - k) * F(k),
    necklace: (n) => F(n - 1) / 2,
    circApart2: (n) => F(n - 1) - 2 * F(n - 2),
    circAlt: (m) => F(m - 1) * F(m),
    atLeast: (m, w, k, j) => { let s = 0; for (let i = j; i <= Math.min(k, w); i++) s += nCr(w, i) * nCr(m, k - i); return s; },
    atMost: (m, w, k, j) => { let s = 0; for (let i = 0; i <= Math.min(j, w, k); i++) s += nCr(w, i) * nCr(m, k - i); return s; },
    exact: (m, w, a, b) => nCr(m, a) * nCr(w, b),
    diag: (n) => n * (n - 3) / 2,
    lines: (n, p) => nCr(n, 2) - nCr(p, 2) + (p >= 2 ? 1 : 0),
    tri: (n, p) => nCr(n, 3) - nCr(p, 3),
    triTwoLines: (a, b) => nCr(a, 2) * b + nCr(b, 2) * a,
    numCount(D, len, rep, last) {
      const ok = last === "even" ? D.filter((x) => x % 2 === 0) : last === "five" ? D.filter((x) => x % 5 === 0) : D.slice();
      if (rep) return D.filter((x) => x > 0).length * Math.pow(D.length, len - 2) * ok.length;
      let tot = 0;
      for (const l of ok) { const R = D.filter((x) => x !== l); tot += R.filter((x) => x > 0).length * nPr(R.length - 1, len - 2); }
      return tot;
    },
    numAbove: (D, len, lead) => D.filter((x) => x >= lead).length * nPr(D.length - 1, len - 1),
  };

  // a short lead-in (who is asking, and from where) so that the same counting idea reads differently each time
  const CITIES = ["Pune", "Nagpur", "Madurai", "Jaipur", "Lucknow", "Kochi", "Indore", "Surat", "Patna", "Mysuru", "Bhopal", "Ranchi", "Guwahati", "Vizag", "Raipur", "Dehradun", "Agra", "Nashik", "Udaipur", "Coimbatore", "Kanpur", "Vadodara", "Cuttack", "Thrissur", "Jodhpur", "Amritsar", "Hubballi", "Shillong", "Belagavi", "Salem"];
  const JOBS = ["teacher", "trainee", "librarian", "shopkeeper", "coach", "student", "clerk", "event planner", "engineer", "quiz host"];
  const VENUES = ["coaching class", "college fest", "club meeting", "office training", "school assembly", "workshop"];
  const lead = (rng) => {
    const c = T(rng, CITIES), k = rng.int(0, 2);
    return k === 0 ? `A ${T(rng, JOBS)} in ${c} asks: ` : k === 1 ? `${cap(T(rng, JOBS))} from ${c}: ` : `At a ${T(rng, VENUES)} in ${c}: `;
  };
  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) { r.q = lead(rng) + r.q; return r; } }
      throw new Error("pnc: no clean question found");
    };
  }
  // ans = correct count, wrongs = [[value, why], ...] in priority order
  function mk(rng, ans, wrongs, extra) {
    if (!Number.isInteger(ans) || ans <= 0 || ans > 5e6) return null;
    const A = N(ans), seen = new Set([A]), pairs = [[A, null]];
    for (const w of wrongs) {
      if (pairs.length === 4) break;
      const v = w[0];
      if (!Number.isInteger(v) || v <= 0 || v > 1e8) continue;
      const t = N(v);
      if (seen.has(t)) continue;
      seen.add(t); pairs.push([t, w[1]]);
    }
    if (pairs.length < 4) return null;
    return Object.assign({ time: TIME[extra.d] }, extra, QB.options(rng, pairs), { calc: String(ans) });
  }
  const finish = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });
  const fl = (n) => (n <= 1 ? "1" : Array.from({ length: n }, (_, i) => n - i).join(" × "));

  /* ------------------------------------------------------------------ 1. counting principle */
  QB.gen("quant/pnc/counting-principle", { title: "Counting principle", gen: wrap((rng, d) => {
    if (d === "Easy") {
      const k = rng.int(0, 3);
      if (k === 0) {
        const a = rng.int(3, 9), b = rng.int(2, 8), c = rng.int(2, 6), th = T(rng, [["shirts", "trousers", "pairs of shoes", "outfits"], ["kurtas", "pyjamas", "dupattas", "sets"], ["blazers", "ties", "belts", "formal looks"]]);
        return mk(rng, a * b * c, [[a + b + c, "Added the choices instead of multiplying them"], [a * b, `Ignored the ${th[2]}`], [b * c, `Ignored the ${th[0]}`], [a * b * c - a * b, "Subtracted a stage"]],
          finish(d, `Meera has **${a}** ${th[0]}, **${b}** ${th[1]} and **${c}** ${th[2]}. How many different ${th[3]} can she make by choosing one of each?`,
            [`Three independent choices, so multiply`, `${a} × ${b} × ${c} = **${a * b * c}**`], `Stage choices multiply: ${a} × ${b} × ${c}.`, `Adding (${a + b + c}) is for "either-or" choices, not "and then" choices.`));
      }
      if (k === 1) {
        const a = rng.int(3, 8), b = rng.int(3, 9), c = rng.int(2, 6);
        return mk(rng, a * b * c, [[a + b + c, "Added instead of multiplying"], [a * b, "Left out the desserts"], [a * c, "Left out the main courses"], [b * c, "Left out the starters"]],
          finish(d, `A canteen thali lets you pick one starter from **${a}**, one main course from **${b}** and one dessert from **${c}**. How many different thalis are possible?`,
            [`Pick a starter, then a main, then a dessert: choices multiply`, `${a} × ${b} × ${c} = **${a * b * c}**`], `Multiply the three counts.`, `Each extra stage multiplies the total; it does not add to it.`));
      }
      if (k === 2) {
        const a = rng.int(3, 9), b = rng.int(3, 9);
        return mk(rng, a * b, [[a + b, "Added the routes"], [a * b * 2, "Doubled for a return trip nobody asked for"], [a * a, "Used the first road count twice"], [b * b, "Used the second road count twice"]],
          finish(d, `There are **${a}** roads from Nagpur to Wardha and **${b}** roads from Wardha to Yavatmal. In how many ways can a person go from Nagpur to Yavatmal via Wardha?`,
            [`Choose a road for each leg: ${a} choices, then ${b} choices`, `${a} × ${b} = **${a * b}**`], `Legs one after another: multiply.`, `Roads on two successive legs multiply; ${a + b} would be the answer if the person used only one leg.`));
      }
      const a = rng.int(4, 9), b = rng.int(3, 8), c = rng.int(2, 7);
      return mk(rng, a + b + c, [[a * b * c, "Multiplied although only one item is chosen"], [a + b, "Left out the magazines"], [a * b + c, "Mixed multiplication and addition"], [a + b + c + 1, "Counted one extra"]],
        finish(d, `A library shelf has **${a}** novels, **${b}** textbooks and **${c}** magazines. A student wants to borrow just **one** item. In how many ways can she choose it?`,
          [`She picks one item from any one type: the options add`, `${a} + ${b} + ${c} = **${a + b + c}**`], `"Either this or that" means add.`, `Multiply only when the choices are made one after another. Here only one item is taken.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 3);
      if (k === 0) {
        const m = rng.int(4, 12), pl = T(rng, [["Pune", "Nashik", "bus services"], ["Chennai", "Madurai", "train services"], ["Jaipur", "Udaipur", "buses"]]);
        return mk(rng, m * (m - 1), [[m * m, "Allowed the same service for the return trip"], [2 * m, "Added instead of multiplying"], [m * (m - 1) / 2, "Halved the count as if order did not matter"], [m * (m - 2), "Removed one service twice"]],
          finish(d, `There are **${m}** ${pl[2]} between ${pl[0]} and ${pl[1]}. In how many ways can a person go from ${pl[0]} to ${pl[1]} and return by a **different** service?`,
            [`Going: ${m} choices`, `Returning: any one except the one used going = ${m - 1} choices`, `${m} × ${m - 1} = **${m * (m - 1)}**`], `m(m − 1): the second choice has one fewer option.`, `The return trip cannot reuse the outward service, so it has ${m - 1} options, not ${m}.`));
      }
      if (k === 1) {
        const m = rng.int(3, 7), n = rng.int(3, 7);
        if (m === n) return null;
        return mk(rng, m * n * (m - 1) * (n - 1), [[m * n * m * n, "Allowed routes to be reused on the return"], [m * n * 2, "Treated the return as a single choice"], [m * n * (m - 1) * n, "Removed the reuse restriction only on one leg"], [m * n * (m + n - 2), "Added the remaining routes"]],
          finish(d, `There are **${m}** routes from town A to town B and **${n}** routes from B to C. A trader goes from A to C and comes back along the same towns, using a **different route on every leg**. In how many ways can he do the round trip?`,
            [`A → B: ${m}, B → C: ${n}`, `C → B: ${n - 1} (not the same route), B → A: ${m - 1}`, `${m} × ${n} × ${n - 1} × ${m - 1} = **${m * n * (m - 1) * (n - 1)}**`], `Each leg: full count going, count − 1 returning.`, `The restriction applies to each pair of legs separately: A–B uses ${m} then ${m - 1}, B–C uses ${n} then ${n - 1}.`));
      }
      if (k === 2) {
        const len = rng.int(3, 5);
        return mk(rng, nPr(10, len), [[Math.pow(10, len), "Allowed digits to repeat"], [nPr(9, len), "Treated 0 as not allowed"], [nPr(10, len) / F(len), "Divided by r! as if order did not matter"], [10 * len, "Multiplied digits by positions"]],
          finish(d, `How many **${len}-digit** PIN codes can be made from the digits 0–9 if no digit may be repeated? (A PIN may begin with 0.)`,
            [`First digit: 10 ways; each next digit has one fewer option`, `${Array.from({ length: len }, (_, i) => 10 - i).join(" × ")} = **${nPr(10, len)}**`], `Count down from 10, ${len} times.`, `Repetition is banned, so ${Math.pow(10, len)} (which allows repeats) is too large.`));
      }
      const l = rng.int(3, 5), b = rng.int(3, 5);
      if (l === b) return null;
      return mk(rng, Math.pow(b, l), [[Math.pow(l, b), "Swapped the objects and the places"], [nPr(b, l) || l * b, "Assumed each place must get a different choice"], [l * b, "Multiplied instead of using a power"], [Math.pow(b, l) - b, "Subtracted an extra case"]],
        finish(d, `**${l}** letters are to be posted, and there are **${b}** different letter boxes. In how many ways can the letters be posted if any box may take any number of letters?`,
          [`Each letter has ${b} choices, independently`, `${b}^${l} = **${Math.pow(b, l)}**`], `Number of boxes ^ number of letters.`, `Do not mix up the two: each LETTER chooses a box, so the base is the number of boxes.`));
    }
    // Hard
    const k = rng.int(0, 3);
    if (k === 0) {
      const nd = rng.int(2, 3), nl = rng.int(2, 3);
      const ans = Math.pow(26, nl) * nPr(10, nd);
      return mk(rng, ans, [[Math.pow(26, nl) * Math.pow(10, nd), "Allowed digits to repeat"], [nPr(26, nl) * nPr(10, nd), "Banned repeated letters as well"], [Math.pow(26, nl) + nPr(10, nd), "Added the letter and digit counts"], [Math.pow(26, nl) * nPr(10, nd) / F(nd), "Divided by the digits' arrangements"]],
        finish(d, `A club badge has **${nl}** letters (A–Z, letters may repeat) followed by **${nd}** digits (0–9, **no digit may repeat**). How many different badges are possible?`,
          [`Letters: 26^${nl} = ${N(Math.pow(26, nl))}`, `Digits without repeating: ${Array.from({ length: nd }, (_, i) => 10 - i).join(" × ")} = ${nPr(10, nd)}`, `Total = ${N(Math.pow(26, nl))} × ${nPr(10, nd)} = **${N(ans)}**`], `Handle the letters and digits separately and multiply.`, `The "no repeat" rule is for digits only; letters may repeat.`));
    }
    if (k === 1) {
      const q = rng.int(4, 7), o = rng.int(3, 4);
      return mk(rng, o * Math.pow(o - 1, q - 1), [[Math.pow(o, q), "Allowed any option for each question"], [nPr(o, q) || F(o), "Treated the options as all different"], [o * (o - 1) * q, "Multiplied the counts instead of using a power"], [Math.pow(o - 1, q), "Removed an option for the first question too"]],
        finish(d, `A feedback form has **${q}** questions, each with **${o}** options. A student answers every question but never picks the same option twice in a row. In how many ways can she fill the form?`,
          [`First question: ${o} options`, `Each later question: ${o - 1} options (not the one just used)`, `${o} × ${o - 1}^${q - 1} = **${o * Math.pow(o - 1, q - 1)}**`], `First free, every later one has (options − 1).`, `Only the first question has all ${o} options.`));
    }
    if (k === 2) {
      const c = rng.int(4, 6), s = rng.int(3, 5);
      return mk(rng, c * Math.pow(c - 1, s - 1), [[Math.pow(c, s), "Allowed neighbouring stripes to match"], [nPr(c, s), "Used every colour only once"], [c * (c - 1) * s, "Multiplied instead of using a power"], [Math.pow(c - 1, s), "Restricted the first stripe too"]],
        finish(d, `A flag is made of **${s}** vertical stripes, each painted with one of **${c}** colours. Adjacent stripes must have different colours (a colour may be used again elsewhere). How many flags are possible?`,
          [`First stripe: ${c} colours; each next stripe: ${c - 1}`, `${c} × ${c - 1}^${s - 1} = **${c * Math.pow(c - 1, s - 1)}**`], `c × (c − 1)^(s − 1).`, `Colours can repeat if they are not adjacent, so P(${c}, ${s}) is too small.`));
    }
    const a = rng.int(4, 8), b = rng.int(3, 7), c = rng.int(2, 6);
    return mk(rng, a * b + b * c + a * c, [[a * b * c, "Multiplied all three, but only two items are taken"], [a + b + c, "Added the counts"], [a * b + b * c, "Missed one pair of types"], [2 * (a * b + b * c + a * c), "Counted each pair twice"]],
      finish(d, `A shop has **${a}** pens, **${b}** notebooks and **${c}** folders, all different. A customer buys exactly **two items of different types**. In how many ways can she choose them?`,
        [`Pen + notebook: ${a} × ${b} = ${a * b}`, `Notebook + folder: ${b} × ${c} = ${b * c}`, `Pen + folder: ${a} × ${c} = ${a * c}`, `Total = **${a * b + b * c + a * c}**`], `Add the products of each pair of types.`, `Pairs of types are separate cases (add), and within a case the choices multiply.`));
  }) });

  /* ------------------------------------------------------------------ 2. arrangements with restrictions */
  const NP = [["Asha", "Bala", "Chitra"], ["Ravi", "Sunil", "Tarun"], ["Imran", "Joseph", "Kiran"], ["Meena", "Nikhil", "Omkar"]];
  QB.gen("quant/pnc/arrangements-with-restrictions", { title: "Arrangements with restrictions", gen: wrap((rng, d) => {
    const ctx = T(rng, [{ g: (n) => `${n} friends`, v: "stand in a row for a photograph" }, { g: (n) => `${n} students`, v: "sit in a row on a bench" }, { g: (n) => `${n} people`, v: "stand in a queue at a ticket counter" }]);
    const [a, b, c] = T(rng, NP);
    if (d === "Easy") {
      const n = rng.int(4, 7);
      return mk(rng, X.together(n, 2), [[F(n - 1), "Forgot that the glued pair can swap places"], [F(n), "Ignored the restriction"], [F(n - 2) * 2, "Glued the pair but counted the wrong number of units"], [F(n) / 2, "Halved the total instead of gluing"]],
        finish(d, `In how many ways can ${ctx.g(n)} ${ctx.v} if ${a} and ${b} must stand **together**?`,
          [`Treat ${a} and ${b} as one block: ${n - 1} units arrange in ${n - 1}! = ${F(n - 1)} ways`, `The block can be ordered 2! = 2 ways: ${F(n - 1)} × 2 = **${X.together(n, 2)}**`], `Glue, arrange, then multiply by the glued group's own arrangements.`, `Multiply by 2! at the end: ${a} and ${b} can swap inside the block.`));
    }
    if (d === "Medium") {
      if (rng.chance(0.5)) {
        const n = rng.int(5, 8);
        return mk(rng, X.together(n, 3), [[F(n - 2), "Forgot the internal arrangements of the glued trio"], [F(n - 2) * 3, "Used 3 instead of 3! for the trio"], [F(n), "Ignored the restriction"], [F(n - 1) * 2, "Glued only two of them"]],
          finish(d, `In how many ways can ${ctx.g(n)} ${ctx.v} if ${a}, ${b} and ${c} must all stand **together**?`,
            [`Glue the three: ${n - 2} units arrange in ${n - 2}! = ${F(n - 2)} ways`, `The trio can be ordered 3! = 6 ways: ${F(n - 2)} × 6 = **${X.together(n, 3)}**`], `(n − 2)! × 3!.`, `The block of three has 3! = 6 internal orders, not 3.`));
      }
      const n = rng.int(5, 8);
      return mk(rng, X.apart2(n), [[2 * F(n - 1), "Gave the number of ways they ARE together"], [F(n) - F(n - 1), "Subtracted the together-case without counting the swap"], [F(n) / 2, "Halved the total"], [F(n), "Ignored the restriction"]],
        finish(d, `In how many ways can ${ctx.g(n)} ${ctx.v} if ${a} and ${b} must **not** stand next to each other?`,
          [`Total arrangements = ${n}! = ${F(n)}`, `Together: (${n - 1})! × 2 = ${2 * F(n - 1)}`, `Not together = ${F(n)} − ${2 * F(n - 1)} = **${X.apart2(n)}**`], `Total − together.`, `"Not together" is the complement of "together": subtract the whole together count, including the swap.`));
    }
    const k = rng.int(0, 3);
    if (k === 0) {
      const m = rng.int(3, 5), eq = rng.chance(0.5), bo = eq ? m : m + 1, gi = m;
      return mk(rng, X.altern(bo, gi), eq ? [[F(m) * F(m), "Forgot that either group can start"], [F(2 * m), "Ignored the restriction"], [2 * F(m), "Arranged only one group"], [F(m) * F(m + 1), "Used a different number of seats"]] : [[2 * F(bo) * F(gi), "Doubled although only the larger group can start"], [F(bo + gi), "Ignored the restriction"], [F(bo), "Arranged only the boys"], [F(bo) * F(bo)]],
        finish(d, `**${bo} boys** and **${gi} girls** are to stand in a row so that no two boys and no two girls are next to each other. In how many ways can this be done?`,
          eq ? [`Equal numbers: the row can start with a boy or a girl (2 patterns)`, `Each pattern: ${m}! × ${m}! = ${F(m) * F(m)}`, `2 × ${F(m) * F(m)} = **${X.altern(bo, gi)}**`] : [`${bo} boys and ${gi} girls: the row must be B G B G … B, only one pattern`, `Boys ${bo}! × girls ${gi}! = ${F(bo)} × ${F(gi)} = **${X.altern(bo, gi)}**`],
          eq ? `2 × m! × m!.` : `Only one pattern is possible: (m+1)! × m!.`, eq ? `With equal groups you can start with either gender, so double the product.` : `With one extra boy the row must start and end with a boy, so there is no doubling.`));
    }
    if (k === 1) {
      const n = rng.int(5, 8);
      return mk(rng, X.ends(n), [[F(n - 2), "Forgot that the two can swap ends"], [F(n), "Ignored the restriction"], [2 * F(n - 1), "Fixed only one person at an end"], [F(n - 2) * (n - 1)]],
        finish(d, `In how many ways can ${n} different books be arranged on a shelf if the Maths book and the Physics book must be at the **two ends**?`,
          [`The two special books fill the ends in 2! = 2 ways`, `The other ${n - 2} books fill the middle in ${n - 2}! = ${F(n - 2)} ways`, `2 × ${F(n - 2)} = **${X.ends(n)}**`], `2! × (n − 2)!.`, `Don't forget the two end books can be swapped.`));
    }
    if (k === 2) {
      const n = rng.int(5, 8);
      return mk(rng, X.aBeforeB(n), [[F(n), "Ignored the restriction"], [F(n - 1), "Fixed one person's place"], [F(n) / 6, "Divided by 3! instead of 2!"], [F(n - 1) / 2]],
        finish(d, `In how many ways can ${ctx.g(n)} ${ctx.v} if ${a} must be somewhere to the **left of** ${b}?`,
          [`Total arrangements = ${n}! = ${F(n)}`, `In exactly half of them ${a} is left of ${b} (by symmetry)`, `${F(n)} ÷ 2 = **${X.aBeforeB(n)}**`], `Half of n!.`, `The two orders of ${a} and ${b} are equally likely, so the answer is exactly half.`));
    }
    const n = rng.int(6, 8);
    return mk(rng, X.inOrder3(n), [[F(n), "Ignored the order condition"], [F(n) / 2, "Divided by 2! instead of 3!"], [F(n - 2) * 6, "Glued the three together"], [F(n) / 3]],
      finish(d, `In how many ways can ${ctx.g(n)} ${ctx.v} if ${a}, ${b} and ${c} must appear in this order from left to right (not necessarily next to each other)?`,
        [`Total = ${n}! = ${F(n)}`, `The three can appear in 3! = 6 orders, equally often; only one order is wanted`, `${F(n)} ÷ 6 = **${X.inOrder3(n)}**`], `n! ÷ 3!.`, `They need not be adjacent, so do not glue them.`));
  }) });

  /* ------------------------------------------------------------------ 3. words from letters */
  const WE = ["DELHI", "MUMBAI", "GARDEN", "CRICKET", "LETTER", "APPLE", "MADRAS", "CHENNAI", "PUNJAB", "TRIANGLE"];
  const WM = ["BANANA", "PEPPER", "BALLOON", "SUCCESS", "COMMITTEE", "KOLKATA", "RAJASTHAN", "HYDERABAD", "BENGALURU", "MISSION", "ENGINEER"];
  const WH = ["DELHI", "MUMBAI", "GARDEN", "CRICKET", "LETTER", "APPLE", "MADRAS", "CHENNAI", "PUNJAB", "TRIANGLE", "KOLKATA", "RAJASTHAN", "BENGALURU", "MISSION", "COMMITTEE", "HYDERABAD", "ENGINEER"];
  const isV = (ch) => "AEIOU".includes(ch);
  const cnts = (w, f) => { const m = {}; for (const ch of w) if (!f || f(ch)) m[ch] = (m[ch] || 0) + 1; return m; };
  const vals = (m) => Object.values(m);
  const msw = (w) => X.msPerm(vals(cnts(w)));
  const wTog = (w) => { const nC = [...w].filter((c) => !isV(c)).length, nV = w.length - nC; return F(nC + 1) / prodF(vals(cnts(w, (c) => !isV(c)))) * (F(nV) / prodF(vals(cnts(w, isV)))); };
  const wSE = (w) => { // starts with a vowel, ends with a consonant
    let t = 0; const c0 = cnts(w);
    for (const v of Object.keys(c0)) if (isV(v)) for (const c of Object.keys(c0)) if (!isV(c)) { const m = Object.assign({}, c0); m[v]--; m[c]--; t += X.msPerm(vals(m)); }
    return t;
  };
  X.wTog = wTog; X.wSE = wSE; X.msw = msw;
  const repLine = (w) => { const c = cnts(w), r = Object.keys(c).filter((k) => c[k] > 1); return r.length ? r.map((k) => `${k} ×${c[k]}`).join(", ") : "no repeated letters"; };
  const denomOf = (w) => vals(cnts(w)).filter((c) => c > 1).map((c) => c + "!").join(" × ") || "1";
  QB.gen("quant/pnc/words-from-letters-with-repeats", { title: "Words from letters with repeats", gen: wrap((rng, d) => {
    const ph = T(rng, ["distinct arrangements of all the letters", "different words (meaningful or not) using all the letters"]);
    if (d === "Easy") {
      const w = T(rng, WE), n = w.length, tot = msw(w), c = cnts(w), mx = Math.max(...vals(c));
      return mk(rng, tot, [[F(n), "Treated every letter as different"], [F(n) / (mx > 1 ? mx : 2), "Divided by the repeat count, not its factorial"], [F(n - 1), "Used (n − 1)!"], [F(n) / 2, "Halved without reason"]],
        finish(d, `How many ${ph} of the word **${w}**?`,
          [`${w} has ${n} letters (${repLine(w)})`, mx > 1 ? `${n}! ÷ ${denomOf(w)} = ${F(n)} ÷ ${prodF(vals(c))} = **${tot}**` : `All letters differ, so ${n}! = **${tot}**`], `n! ÷ (factorial of each repeat count).`, mx > 1 ? `A letter appearing twice needs 2!, not 2.` : `No letter repeats, so no division is needed.`));
    }
    if (d === "Medium") {
      const w = T(rng, WM), n = w.length, c = cnts(w), tot = msw(w);
      if (rng.chance(0.65)) {
        return mk(rng, tot, [[F(n), "Treated every letter as different"], [F(n) / Math.max(...vals(c)), "Divided by the highest repeat count, not its factorial"], [F(n) / F(Math.max(...vals(c))), "Divided only by the biggest repeat factorial"], [tot * 2]],
          finish(d, `How many ${ph} of the word **${w}**?`, [`${w}: ${n} letters (${repLine(w)})`, `${n}! ÷ (${denomOf(w)}) = ${F(n)} ÷ ${prodF(vals(c))} = **${tot}**`], `n! ÷ product of repeat factorials.`, `Divide by the factorial of EVERY repeated letter's count, not just one of them.`));
      }
      const L = T(rng, Object.keys(c)), m = Object.assign({}, c); m[L]--;
      const ans = X.msPerm(vals(m));
      return mk(rng, ans, [[tot, "Ignored the condition on the first letter"], [tot / n, "Used total ÷ n (only valid for all-different letters)"], [F(n - 1), "Treated the remaining letters as all different"], [ans * c[L]]],
        finish(d, `How many arrangements of the letters of **${w}** begin with the letter **${L}**?`,
          [`Fix ${L} at the front; arrange the other ${n - 1} letters`, `${n - 1}! ÷ (${denomOf(w).replace(new RegExp("^"), "")}${c[L] > 1 ? " with " + L + " reduced by 1" : ""}) = **${ans}**`], `Remove the fixed letter and arrange the rest.`, `After fixing ${L}, its count drops by one; recompute the repeat factorials.`));
    }
    const w = T(rng, WH), n = w.length, tot = msw(w), tg = wTog(w), nC = [...w].filter((c) => !isV(c)).length, nV = n - nC;
    if (nV < 2 || nC < 2) return null;
    const k = rng.int(0, 2);
    if (k === 0) {
      return mk(rng, tg, [[tot, "Ignored the condition"], [F(nC + 1) / prodF(vals(cnts(w, (c) => !isV(c)))), "Forgot to arrange the vowels inside the block"], [tot - tg, "Gave the number of arrangements where vowels are NOT all together"], [F(nC + 1) * F(nV), "Ignored repeated letters"]],
        finish(d, `In how many distinct arrangements of the letters of **${w}** do all the vowels come **together**?`,
          [`Vowels (${[...w].filter(isV).join(", ")}): ${nV}; consonants: ${nC}`, `Glue the vowels into 1 block: arrange ${nC} consonants + 1 block = ${nC + 1} units`, `Units: ${F(nC + 1)} ÷ ${prodF(vals(cnts(w, (c) => !isV(c))))} = ${F(nC + 1) / prodF(vals(cnts(w, (c) => !isV(c))))}`, `Inside the block: ${F(nV)} ÷ ${prodF(vals(cnts(w, isV)))} = ${F(nV) / prodF(vals(cnts(w, isV)))}`, `Total = **${tg}**`],
          `(units arrangement) × (vowel arrangement), both divided by repeats.`, `Repeated letters reduce BOTH counts, so remember to divide each part by its own repeat factorials.`));
    }
    if (k === 1) {
      const ans = tot - tg;
      return mk(rng, ans, [[tg, "Gave the number where vowels ARE together"], [tot, "Ignored the condition"], [tot - F(nC + 1) / prodF(vals(cnts(w, (c) => !isV(c)))), "Subtracted the glued count without the vowels' internal arrangements"], [tot - 2 * tg]],
        finish(d, `In how many distinct arrangements of the letters of **${w}** are the vowels **not** all together?`,
          [`Total = ${n}! ÷ ${prodF(vals(cnts(w)))} = ${tot}`, `Vowels together = ${tg}`, `Not all together = ${tot} − ${tg} = **${ans}**`], `Total − (vowels together).`, `"Not together" is the complement: subtract the vowels-together count.`));
    }
    const ans = wSE(w);
    return mk(rng, ans, [[tot, "Ignored the condition"], [tg, "Mixed this up with 'vowels together'"], [nV * nC * F(n - 2), "Counted each letter as different"], [Math.round(tot * nV * nC / (n * (n - 1)))]],
      finish(d, `How many distinct arrangements of all the letters of **${w}** begin with a **vowel** and end with a **consonant**?`,
        [`Pick the first letter (a vowel) and the last letter (a consonant), then arrange the remaining ${n - 2} letters`, `Add up over every choice of vowel-letter and consonant-letter, dividing each case by its repeat factorials`, `Total = **${ans}**`],
        `Sum over the distinct vowel/consonant pairs; each case is a smaller word-count.`, `With repeated letters, choose by distinct letter (not by position), or the same arrangement gets counted twice.`));
  }) });

  /* ------------------------------------------------------------------ 4. circular */
  QB.gen("quant/pnc/circular-arrangements-and-necklaces", { title: "Circular arrangements & necklaces", gen: wrap((rng, d) => {
    const [a, b] = T(rng, NP);
    if (d === "Easy") {
      const n = rng.int(4, 9), thing = T(rng, [["people", "sit around a round table"], ["guests", "sit around a circular dining table"], ["children", "stand in a circle for a game"]]);
      return mk(rng, F(n - 1), [[F(n), "Used n! as for a row"], [F(n - 2), "Used (n − 2)!"], [F(n - 1) / 2, "Halved it as if flipping gave the same circle"], [F(n + 1)]],
        finish(d, `In how many ways can **${n}** ${thing[0]} ${thing[1]}?`,
          [`In a circle, only relative positions matter: fix one person`, `The remaining ${n - 1} can be arranged in (${n} − 1)! = **${F(n - 1)}** ways`], `Circular arrangement of n objects = (n − 1)!.`, `Rotations of the same seating are one arrangement, so n! over-counts by a factor of n.`));
    }
    if (d === "Medium") {
      if (rng.chance(0.5)) {
        const n = rng.int(5, 9);
        return mk(rng, X.circTogether(n, 2), [[F(n - 1), "Ignored the restriction"], [F(n - 2), "Forgot that the pair can swap"], [F(n - 1) * 2, "Used (n − 1)! then doubled"], [F(n - 2) * F(n - 2)]],
          finish(d, `In how many ways can **${n}** people sit around a circular table if ${a} and ${b} must sit **next to each other**?`,
            [`Glue the pair: ${n - 1} units around a circle = (${n - 1} − 1)! = ${F(n - 2)}`, `The pair swaps inside: × 2 = **${X.circTogether(n, 2)}**`], `(n − 2)! × 2.`, `After gluing there are n − 1 units, so the circle formula gives (n − 2)!, not (n − 1)!.`));
      }
      const n = rng.int(5, 8), obj = T(rng, [["beads", "a necklace"], ["flowers", "a garland"], ["different gems", "a bracelet"]]);
      return mk(rng, X.necklace(n), [[F(n - 1), "Forgot that a necklace can be turned over"], [F(n), "Used n!"], [F(n - 1) * 2, "Doubled instead of halving"], [F(n) / 2]],
        finish(d, `In how many different ways can **${n}** ${obj[0]}, all different, be strung to make ${obj[1]}?`,
          [`Circular arrangements: (${n} − 1)! = ${F(n - 1)}`, `${obj[1][0] === "a" ? cap(obj[1]) : obj[1]} can be flipped over, so each pattern appears twice`, `${F(n - 1)} ÷ 2 = **${X.necklace(n)}**`], `Necklace: (n − 1)! ÷ 2.`, `A necklace has no 'clockwise' direction, so mirror images are the same.`));
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      const n = rng.int(5, 8);
      return mk(rng, X.circApart2(n), [[2 * F(n - 2), "Gave the number of ways they ARE together"], [F(n - 1) - F(n - 2), "Subtracted the together-case without the swap"], [F(n - 1), "Ignored the restriction"], [F(n - 1) / 2]],
        finish(d, `In how many ways can **${n}** people sit around a round table if ${a} and ${b} must **not** sit next to each other?`,
          [`Total = (${n} − 1)! = ${F(n - 1)}`, `Together = (${n} − 2)! × 2 = ${2 * F(n - 2)}`, `Not together = ${F(n - 1)} − ${2 * F(n - 2)} = **${X.circApart2(n)}**`], `(n − 1)! − 2 (n − 2)!.`, `Use the complement: all seatings minus the seatings in which the two are adjacent.`));
    }
    if (k === 1) {
      const m = rng.int(3, 6);
      return mk(rng, X.circAlt(m), [[F(m) * F(m), "Arranged both groups without fixing one seat"], [2 * F(m - 1) * F(m), "Doubled for starting gender (rotations already cover it)"], [F(2 * m - 1), "Ignored the restriction"], [F(m - 1) * F(m - 1)]],
        finish(d, `**${m} men** and **${m} women** are to sit around a round table so that men and women sit **alternately**. In how many ways can this be done?`,
          [`Seat the men first around the table: (${m} − 1)! = ${F(m - 1)}`, `The ${m} women go in the ${m} gaps: ${m}! = ${F(m)}`, `${F(m - 1)} × ${F(m)} = **${X.circAlt(m)}**`], `(m − 1)! × m!.`, `Fix the circle with the men, then the women have distinct gaps, so no further doubling.`));
    }
    const n = rng.int(6, 9);
    return mk(rng, X.circTogether(n, 3), [[F(n - 2), "Forgot the internal arrangements of the trio"], [F(n - 1), "Ignored the restriction"], [F(n - 2) * 3, "Used 3 instead of 3!"], [F(n - 3) * 6]],
      finish(d, `In how many ways can **${n}** people sit around a round table if three particular people must sit **together**?`,
        [`Glue the three: ${n - 2} units around the table = (${n - 2} − 1)! = ${F(n - 3)}`, `The three can be ordered 3! = 6 ways: ${F(n - 3)} × 6 = **${X.circTogether(n, 3)}**`], `(n − k)! × k! for k together.`, `Gluing three leaves n − 2 units, and the circle formula takes one off again.`));
  }) });

  /* ------------------------------------------------------------------ 5. selections */
  QB.gen("quant/pnc/selection-ncr-at-least-at", { title: "Selection (nCr), at least / at most", gen: wrap((rng, d) => {
    if (d === "Easy") {
      const n = rng.int(6, 12), r = rng.int(2, 4), it = T(rng, [["books", "choose", "from a shelf of"], ["players", "pick", "from a squad of"], ["questions", "attempt", "out of"]]);
      return mk(rng, nCr(n, r), [[nPr(n, r), "Counted order (used nPr)"], [n * r, "Multiplied n by r"], [nCr(n, r - 1), "Used r − 1 items"], [nCr(n + 1, r), "Used one extra item"]],
        finish(d, `In how many ways can you ${it[1]} **${r}** ${it[0]} ${it[2]} **${n}**?`,
          [`Order does not matter, so use nCr`, `${n}C${r} = ${Array.from({ length: r }, (_, i) => n - i).join(" × ")} ÷ ${fl(r)} = **${nCr(n, r)}**`], `nCr: multiply r numbers down from n, divide by r!.`, `A group of items is the same group in any order: do not use permutations.`));
    }
    if (d === "Medium") {
      const m = rng.int(4, 8), w = rng.int(3, 6), k = rng.int(3, 4);
      if (rng.chance(0.5)) {
        const ans = nCr(m + w, k) - nCr(m, k);
        return mk(rng, ans, [[nCr(m + w, k), "Ignored the 'at least one' condition"], [nCr(w, 1) * nCr(m + w - 1, k - 1), "Chose one woman first then anyone (double counts)"], [nCr(w, k), "Counted only all-women groups"], [nCr(m + w, k) - nCr(m, k) - 1]],
          finish(d, `A group has **${m} boys** and **${w} girls**. In how many ways can a team of **${k}** be chosen so that it has **at least one girl**?`,
            [`All teams: ${m + w}C${k} = ${nCr(m + w, k)}`, `Teams with no girl: ${m}C${k} = ${nCr(m, k)}`, `At least one girl = ${nCr(m + w, k)} − ${nCr(m, k)} = **${ans}**`], `Total − (none of that kind).`, `Picking one girl first and then anyone counts a team with 2 girls twice.`));
      }
      const j = 1, ans = X.atMost(m, w, k, j);
      return mk(rng, ans, [[nCr(m + w, k), "Ignored the 'at most' limit"], [nCr(m, k), "Counted only teams with no girl"], [nCr(w, 1) * nCr(m, k - 1), "Counted only teams with exactly one girl"], [X.atMost(m, w, k, 2)]],
        finish(d, `A group has **${m} boys** and **${w} girls**. In how many ways can a team of **${k}** be chosen with **at most one girl**?`,
          [`No girl: ${m}C${k} = ${nCr(m, k)}`, `Exactly one girl: ${w}C1 × ${m}C${k - 1} = ${w * nCr(m, k - 1)}`, `Add the cases: **${ans}**`], `"At most 1" = 0 or 1: add the two cases.`, `"At most one" includes the case of NO girl as well.`));
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      const n = rng.int(5, 9);
      return mk(rng, Math.pow(2, n) - 1, [[Math.pow(2, n), "Included the empty selection"], [F(n), "Counted arrangements"], [n * n, "Used n²"], [Math.pow(2, n) - 2]],
        finish(d, `A tray holds **${n}** different sweets. In how many ways can a customer take **one or more** of them?`,
          [`Each sweet is either taken or left: 2^${n} = ${Math.pow(2, n)} subsets`, `Remove the empty selection: ${Math.pow(2, n)} − 1 = **${Math.pow(2, n) - 1}**`], `2^n − 1.`, `"One or more" excludes taking nothing.`));
    }
    if (k === 1) {
      const m = rng.int(4, 8), w = rng.int(4, 7), kk = rng.int(4, 5), j = 2;
      const ans = X.atLeast(m, w, kk, j);
      return mk(rng, ans, [[nCr(w, j) * nCr(m + w - j, kk - j), "Chose two women then anyone (double counts)"], [nCr(m + w, kk), "Ignored the condition"], [nCr(w, j) * nCr(m, kk - j), "Counted only teams with exactly two women"], [nCr(m + w, kk) - nCr(m, kk)]],
        finish(d, `A club has **${m} men** and **${w} women**. In how many ways can a committee of **${kk}** be formed with **at least ${j} women**?`,
          [`Add the cases: ${Array.from({ length: Math.min(kk, w) - j + 1 }, (_, i) => `${j + i}W: ${nCr(w, j + i)} × ${nCr(m, kk - j - i)}`).join(" ; ")}`, `Total = **${ans}**`], `Sum the exact cases from the minimum upward, or Total − (too few).`, `"At least 2" is 2 or 3 or more: adding only the exact-2 case undercounts.`));
    }
    const dft = rng.int(1, 3), good = rng.int(6, 10), kk = rng.int(3, 4), tot = dft + good;
    const ans = nCr(tot, kk) - nCr(good, kk);
    return mk(rng, ans, [[nCr(tot, kk), "Ignored the 'at least one defective' condition"], [dft * nCr(tot - 1, kk - 1), "Picked a defective first then anyone (double counts)"], [nCr(good, kk), "Counted only all-good samples"], [nCr(dft, 1) * nCr(good, kk - 1)]],
      finish(d, `A box has **${tot}** bulbs, of which **${dft}** are defective. In how many ways can **${kk}** bulbs be drawn so that **at least one** is defective?`,
        [`All draws: ${tot}C${kk} = ${nCr(tot, kk)}`, `Draws with no defective: ${good}C${kk} = ${nCr(good, kk)}`, `${nCr(tot, kk)} − ${nCr(good, kk)} = **${ans}**`], `Total − none.`, `Counting "one defective first, then any" double-counts draws with two defectives.`));
  }) });

  /* ------------------------------------------------------------------ 6. committees */
  QB.gen("quant/pnc/committees-with-conditions", { title: "Committees with conditions", gen: wrap((rng, d) => {
    const [pa, pb] = T(rng, [["Mr. Rao", "Ms. Iyer"], ["Anil", "Bhavna"], ["Dr. Khan", "Prof. Nair"]]);
    if (d === "Easy") {
      const m = rng.int(4, 8), w = rng.int(3, 6), a = rng.int(2, 3), b = rng.int(1, 3);
      if (a > m || b > w) return null;
      const ans = X.exact(m, w, a, b);
      return mk(rng, ans, [[nCr(m + w, a + b), "Ignored the gender split"], [nCr(m, a) + nCr(w, b), "Added instead of multiplying"], [nPr(m, a) * nPr(w, b), "Counted order"], [nCr(m + w, a) * nCr(m + w, b)]],
        finish(d, `A committee of **${a + b}** is to be formed from **${m} men** and **${w} women** with exactly **${a} men** and **${b} ${b === 1 ? "woman" : "women"}**. In how many ways can this be done?`,
          [`Men: ${m}C${a} = ${nCr(m, a)}`, `Women: ${w}C${b} = ${nCr(w, b)}`, `Both choices are made, so multiply: **${ans}**`], `mCa × wCb.`, `Independent selections multiply; adding would be for "either-or".`));
    }
    if (d === "Medium") {
      const n = rng.int(7, 12), k = rng.int(3, 5), kind = rng.int(0, 2);
      if (kind === 0) return mk(rng, nCr(n - 1, k - 1), [[nCr(n, k), "Ignored the condition"], [nCr(n - 1, k), "Excluded the person instead of including"], [nCr(n - 1, k - 1) * k, "Multiplied by an extra k"], [nCr(n, k - 1)]],
        finish(d, `A committee of **${k}** is to be chosen from **${n}** members, and ${pa} **must be on it**. In how many ways can it be formed?`,
          [`${pa} is already in; choose the other ${k - 1} from the remaining ${n - 1}`, `${n - 1}C${k - 1} = **${nCr(n - 1, k - 1)}**`], `Fix the person, choose the rest: (n−1)C(k−1).`, `Choosing "the person plus anyone" would double-count; just reduce n and k by one.`));
      if (kind === 1) return mk(rng, nCr(n - 1, k), [[nCr(n, k), "Ignored the condition"], [nCr(n - 1, k - 1), "Chose the person instead of excluding"], [nCr(n - 2, k), "Removed two people"], [nCr(n - 1, k) + 1]],
        finish(d, `A committee of **${k}** is to be chosen from **${n}** members, but ${pa} **cannot be on it**. In how many ways can it be formed?`,
          [`Set ${pa} aside: choose all ${k} from the other ${n - 1}`, `${n - 1}C${k} = **${nCr(n - 1, k)}**`], `Remove the person: (n−1)Ck.`, `Excluding someone only reduces n; k stays the same.`));
      return mk(rng, nCr(n, k) - nCr(n - 2, k - 2), [[nCr(n, k), "Ignored the condition"], [nCr(n - 2, k - 2), "Counted the committees that DO have both"], [nCr(n - 2, k), "Excluded both people"], [nCr(n, k) - nCr(n - 2, k - 1)]],
        finish(d, `A committee of **${k}** is to be chosen from **${n}** members. ${pa} and ${pb} do not get along, so they **cannot both be on** the committee. In how many ways can it be formed?`,
          [`All committees: ${n}C${k} = ${nCr(n, k)}`, `Committees with both: ${n - 2}C${k - 2} = ${nCr(n - 2, k - 2)}`, `${nCr(n, k)} − ${nCr(n - 2, k - 2)} = **${nCr(n, k) - nCr(n - 2, k - 2)}**`], `Total − (both together).`, `They may still be chosen separately; only the case with both is removed.`));
    }
    const k = rng.int(0, 3);
    if (k === 0) {
      const m = rng.int(4, 7), w = rng.int(4, 7), kk = rng.int(4, 5), ans = nCr(m + w, kk) - nCr(m, kk) - nCr(w, kk);
      return mk(rng, ans, [[nCr(m + w, kk) - nCr(m, kk), "Removed only the all-men teams"], [nCr(m + w, kk), "Ignored the condition"], [nCr(m, 1) * nCr(w, 1) * nCr(m + w - 2, kk - 2), "Picked one of each first (double counts)"], [nCr(m + w, kk) - nCr(m, kk) - nCr(w, kk) + 1]],
        finish(d, `A panel of **${kk}** is chosen from **${m} men** and **${w} women** so that it has **at least one man and at least one woman**. In how many ways can this be done?`,
          [`All panels: ${m + w}C${kk} = ${nCr(m + w, kk)}`, `All men: ${nCr(m, kk)}; all women: ${nCr(w, kk)}`, `${nCr(m + w, kk)} − ${nCr(m, kk)} − ${nCr(w, kk)} = **${ans}**`], `Total − all of one kind − all of the other.`, `Both extreme cases (all men, all women) must be removed.`));
    }
    if (k === 1) {
      const m = rng.int(4, 7), w = rng.int(4, 7), ans = X.atLeast(m, w, 5, 3);
      return mk(rng, ans, [[nCr(w, 3) * nCr(m + w - 3, 2), "Chose three women first (double counts)"], [nCr(m + w, 5), "Ignored the majority condition"], [nCr(w, 3) * nCr(m, 2), "Counted only exactly three women"], [X.atLeast(m, w, 5, 2)]],
        finish(d, `A committee of **5** is formed from **${m} men** and **${w} women** so that **women are in the majority**. In how many ways can this be done?`,
          [`Women must be 3, 4 or 5`, `3W2M: ${nCr(w, 3)} × ${nCr(m, 2)}; 4W1M: ${nCr(w, 4)} × ${m}; 5W: ${nCr(w, 5)}`, `Total = **${ans}**`], `Majority of 5 = at least 3: add the three cases.`, `Majority means 3 or more women, not exactly 3.`));
    }
    if (k === 2) {
      const n = rng.int(8, 12), kk = rng.int(4, 5), ans = nCr(n - 2, kk - 1);
      return mk(rng, ans, [[nCr(n - 2, kk), "Chose all members from the others (nobody included)"], [nCr(n - 1, kk - 1), "Excluded nobody"], [nCr(n - 2, kk - 2), "Excluded the wrong person count"], [nCr(n, kk)]],
        finish(d, `A committee of **${kk}** is chosen from **${n}** members. ${pa} **must** be on it and ${pb} **must not** be. How many committees are possible?`,
          [`${pa} is in, ${pb} is out: ${n - 2} members remain`, `Choose the other ${kk - 1}: ${n - 2}C${kk - 1} = **${ans}**`], `Remove both people, reduce k by one.`, `Both special people are settled, so n drops by 2 but k drops by only 1.`));
    }
    const m = rng.int(5, 8), w = rng.int(4, 7), ans = (nCr(m + w - 2, 3) ) + 0;
    const both = nCr(m + w, 4) - nCr(m + w - 2, 2);
    return mk(rng, both, [[nCr(m + w - 2, 2), "Counted the committees with neither of them"], [nCr(m + w, 4), "Ignored the condition"], [nCr(m + w - 1, 3), "Counted those with a particular person"], [ans]],
      finish(d, `A committee of **4** is chosen from **${m + w}** members (including ${pa} and ${pb}). It must include **at least one of ${pa} and ${pb}**. How many committees are possible?`,
        [`All committees: ${m + w}C4 = ${nCr(m + w, 4)}`, `With neither: ${m + w - 2}C4 = ${nCr(m + w - 2, 4)}`, `${nCr(m + w, 4)} − ${nCr(m + w - 2, 4)} = **${nCr(m + w, 4) - nCr(m + w - 2, 4)}**`], `Total − (neither).`, `Do not add "with ${pa}" and "with ${pb}": committees with both get counted twice.`));
  }) });

  /* ------------------------------------------------------------------ 7. handshakes, diagonals, lines, triangles */
  QB.gen("quant/pnc/handshakes-diagonals-lines-and-triangles", { title: "Handshakes, diagonals, lines & triangles", gen: wrap((rng, d) => {
    if (d === "Easy") {
      const n = rng.int(5, 16), k = rng.int(0, 2);
      if (k === 0) return mk(rng, nCr(n, 2), [[n * (n - 1), "Counted every handshake twice"], [n * n, "Used n²"], [nCr(n, 3), "Used nC3"], [n - 1, "Counted one person's handshakes only"]],
        finish(d, `At a party, **${n}** guests each shake hands with every other guest exactly once. How many handshakes take place?`,
          [`Each handshake is a pair of people: ${n}C2`, `${n} × ${n - 1} ÷ 2 = **${nCr(n, 2)}**`], `n(n − 1)/2.`, `${n} × ${n - 1} counts each handshake twice (A with B, and B with A).`));
      if (k === 1) return mk(rng, nCr(n, 2), [[n * (n - 1), "Counted home and away as separate matches"], [n, "Gave the number of teams"], [nCr(n + 1, 2), "Used one extra team"], [n * (n - 1) / 4]],
        finish(d, `**${n}** teams play a league in which every team plays every other team **once**. How many matches are played?`,
          [`Each match is a pair of teams: ${n}C2`, `${n}(${n - 1})/2 = **${nCr(n, 2)}**`], `n(n − 1)/2 for a single round-robin.`, `If teams met twice (home and away), the count would double to ${n * (n - 1)}.`));
      return mk(rng, nCr(n, 2), [[n * (n - 1), "Counted each line twice (AB and BA)"], [n, "Gave the number of points"], [nCr(n, 3), "Used nC3"], [nCr(n - 1, 2)]],
        finish(d, `**${n}** points are marked on a plane, no three of them in a straight line. How many straight lines can be drawn by joining pairs of points?`,
          [`A line is fixed by choosing 2 points: ${n}C2`, `= **${nCr(n, 2)}**`], `nC2.`, `Line AB is the same as line BA, so do not use permutations.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const n = rng.int(6, 15), nm = { 6: "hexagon", 7: "heptagon", 8: "octagon", 9: "nonagon", 10: "decagon" };
        return mk(rng, X.diag(n), [[nCr(n, 2), "Counted the sides as diagonals too"], [n * (n - 3), "Counted each diagonal twice"], [nCr(n, 2) - n - 1], [n * (n - 1) / 2 - 2 * n]],
          finish(d, `How many diagonals does a convex polygon with **${n} sides**${nm[n] ? ` (a ${nm[n]})` : ""} have?`,
            [`Pairs of vertices: ${n}C2 = ${nCr(n, 2)}`, `Subtract the ${n} sides: ${nCr(n, 2)} − ${n} = **${X.diag(n)}**`], `n(n − 3)/2.`, `Joining adjacent vertices gives the sides, not diagonals.`));
      }
      if (k === 1) {
        const n = rng.int(6, 11), ans = nCr(n, 3);
        return mk(rng, ans, [[nPr(n, 3), "Counted order of the vertices"], [nCr(n, 2), "Used nC2"], [n * 3, "Multiplied n by 3"], [nCr(n, 4)]],
          finish(d, `**${n}** points lie in a plane, no three on a line. How many triangles can be formed with these points as vertices?`,
            [`A triangle needs 3 points: ${n}C3`, `= **${ans}**`], `nC3.`, `The triangle ABC is the same as BCA: order is irrelevant.`));
      }
      const n = rng.int(6, 14), H = nCr(n, 2);
      return mk(rng, n, [[n + 1, "Off by one"], [n - 1, "Off by one the other way"], [Math.round(Math.sqrt(H)), "Took the square root of the total"], [Math.round(H / 2)]],
        finish(d, `At a reunion, every person shook hands with every other person once, and there were **${H}** handshakes in all. How many people attended?`,
          [`n(n − 1)/2 = ${H}, so n(n − 1) = ${2 * H}`, `Two consecutive numbers with product ${2 * H}: ${n} × ${n - 1}`, `n = **${n}**`], `Find consecutive integers whose product is 2 × the total.`, `Do not forget the factor 2: n(n − 1) = 2 × ${H}.`));
    }
    const k = rng.int(0, 3);
    if (k === 0) {
      const n = rng.int(8, 14), p = rng.int(4, 6), ans = X.lines(n, p);
      return mk(rng, ans, [[nCr(n, 2), "Ignored the collinear points"], [nCr(n, 2) - nCr(p, 2), "Removed the collinear pairs but forgot the one line they make"], [nCr(n, 2) - nCr(p, 2) + 2], [nCr(n - p, 2) + 1]],
        finish(d, `**${n}** points are in a plane. Exactly **${p}** of them lie on one straight line and no other three are collinear. How many distinct straight lines can be drawn through pairs of these points?`,
          [`All pairs: ${n}C2 = ${nCr(n, 2)}`, `The ${p} collinear points give ${p}C2 = ${nCr(p, 2)} pairs but only 1 line`, `${nCr(n, 2)} − ${nCr(p, 2)} + 1 = **${ans}**`], `nC2 − pC2 + 1.`, `Those pairs all give the same single line, so add that 1 line back.`));
    }
    if (k === 1) {
      const n = rng.int(8, 13), p = rng.int(4, 6), ans = X.tri(n, p);
      return mk(rng, ans, [[nCr(n, 3), "Ignored the collinear points"], [nCr(n, 3) - nCr(p, 2)], [nCr(n, 3) - p, "Removed p instead of pC3"], [nCr(n - p, 3)]],
        finish(d, `**${n}** points are in a plane. **${p}** of them are collinear and no other three are. How many triangles can be formed?`,
          [`All triples: ${n}C3 = ${nCr(n, 3)}`, `Triples from the collinear points make no triangle: ${p}C3 = ${nCr(p, 3)}`, `${nCr(n, 3)} − ${nCr(p, 3)} = **${ans}**`], `nC3 − pC3.`, `Three collinear points do not form a triangle, so remove those triples.`));
    }
    if (k === 2) {
      const a = rng.int(3, 7), b = rng.int(3, 7), ans = X.triTwoLines(a, b);
      return mk(rng, ans, [[nCr(a + b, 3), "Ignored that points on one line are collinear"], [nCr(a, 3) + nCr(b, 3), "Counted the degenerate triples instead of removing them"], [nCr(a, 2) * nCr(b, 2), "Chose two points on each line"], [nCr(a + b, 3) - nCr(a, 3)]],
        finish(d, `**${a}** points are marked on one line and **${b}** points on a parallel line. How many triangles can be formed with these points as vertices?`,
          [`A triangle takes 2 points from one line and 1 from the other`, `${a}C2 × ${b} + ${b}C2 × ${a} = ${nCr(a, 2) * b} + ${nCr(b, 2) * a}`, `= **${ans}**`], `aC2 × b + bC2 × a.`, `Three points on the same line never form a triangle.`));
    }
    const sd = rng.int(6, 14), D = X.diag(sd);
    return mk(rng, sd, [[sd + 1, "Off by one"], [sd - 1, "Off by one the other way"], [Math.round(Math.sqrt(2 * D)), "Mixed up n(n − 3) with n²"], [Math.round(D / 2)]],
      finish(d, `A convex polygon has **${D}** diagonals. How many sides does it have?`,
        [`n(n − 3)/2 = ${D}, so n(n − 3) = ${2 * D}`, `Two numbers differing by 3 with product ${2 * D}: ${sd} × ${sd - 3}`, `n = **${sd}**`], `Solve n(n − 3) = 2 × diagonals.`, `The two factors differ by 3 (not 1 as for handshakes).`));
  }) });

  /* ------------------------------------------------------------------ 8. numbers from digits */
  const pickD = (rng, size, zero) => { const pool = rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, zero ? size - 1 : size); return (zero ? [0].concat(pool) : pool).sort((x, y) => x - y); };
  const setTxt = (D) => D.join(", ");
  QB.gen("quant/pnc/forming-numbers-from-digits", { title: "Forming numbers from digits", gen: wrap((rng, d) => {
    if (d === "Easy") {
      const n = rng.int(5, 8), len = rng.int(2, 3), D = pickD(rng, n, false);
      if (rng.chance(0.5)) return mk(rng, nPr(n, len), [[Math.pow(n, len), "Allowed digits to repeat"], [nCr(n, len), "Ignored the order of the digits"], [n * len, "Multiplied digits by places"], [nPr(n, len + 1)]],
        finish(d, `How many **${len}-digit** numbers can be formed from the digits **${setTxt(D)}** if no digit is repeated?`,
          [`${n} digits for the first place, then one fewer each time`, `${Array.from({ length: len }, (_, i) => n - i).join(" × ")} = **${nPr(n, len)}**`], `nPr: count down from n, r times.`, `Numbers 123 and 321 are different, so use permutations, not combinations.`));
      return mk(rng, Math.pow(n, len), [[nPr(n, len), "Banned repeated digits"], [nCr(n, len)], [n * len], [Math.pow(n, len) - n]],
        finish(d, `How many **${len}-digit** numbers can be formed from the digits **${setTxt(D)}** if digits **may be repeated**?`,
          [`Each of the ${len} places can take any of the ${n} digits`, `${n}^${len} = **${Math.pow(n, len)}**`], `n^r when repetition is allowed.`, `With repetition every place has the full ${n} choices.`));
    }
    if (d === "Medium") {
      const n = rng.int(5, 7), D = pickD(rng, n, true), len = rng.int(3, 4), k = rng.int(0, 2);
      if (k === 0) { const ans = X.numCount(D, len, false, null);
        return mk(rng, ans, [[nPr(n, len), "Allowed 0 as the first digit"], [(n - 1) * Math.pow(n, len - 1), "Allowed digits to repeat"], [nPr(n - 1, len), "Dropped 0 completely"], [ans * 2]],
          finish(d, `How many **${len}-digit** numbers can be formed from the digits **${setTxt(D)}** without repeating a digit?`,
            [`The first digit cannot be 0: ${n - 1} choices`, `Remaining places: ${Array.from({ length: len - 1 }, (_, i) => n - 1 - i).join(" × ")}`, `${n - 1} × ${Array.from({ length: len - 1 }, (_, i) => n - 1 - i).join(" × ")} = **${ans}**`], `(n − 1) for the first place, then (n − 1), (n − 2), …`, `A number cannot start with 0: it would then have fewer digits.`)); }
      if (k === 1) { const ans = X.numCount(D, len, true, null);
        return mk(rng, ans, [[Math.pow(n, len), "Allowed 0 as the first digit"], [X.numCount(D, len, false, null), "Banned repeated digits"], [(n - 1) * (n - 1) * (n - 2)], [(n - 1) * Math.pow(n - 1, len - 1)]],
          finish(d, `How many **${len}-digit** numbers can be formed from the digits **${setTxt(D)}** if digits **may repeat**?`,
            [`First digit: ${n - 1} choices (not 0)`, `Other places: ${n} choices each`, `${n - 1} × ${n}^${len - 1} = **${ans}**`], `(n − 1) × n^(len − 1).`, `Only the first place loses the digit 0.`)); }
      const D2 = pickD(rng, n, false), ans = X.numCount(D2, len, false, null);
      const ev = D2.filter((x) => x % 2 === 0).length;
      if (!ev) return null;
      const ans2 = X.numCount(D2, len, false, "even");
      return mk(rng, ans2, [[ans, "Ignored the 'even' condition"], [ans / 2, "Assumed half the numbers are even"], [ev * nPr(n - 1, len - 1) + 1], [ev * Math.pow(n, len - 1), "Allowed repetition"]],
        finish(d, `How many **even ${len}-digit** numbers can be formed from the digits **${setTxt(D2)}** with no digit repeated?`,
          [`Even digits available for the units place: ${ev}`, `Fill that place first, then the other ${len - 1} places from the remaining ${n - 1} digits: ${nPr(n - 1, len - 1)} ways`, `${ev} × ${nPr(n - 1, len - 1)} = **${ans2}**`], `Fill the restricted place (units) first.`, `Start with the place that has the condition; filling left to right muddles the count.`));
    }
    const k = rng.int(0, 3);
    if (k === 0) {
      const n = rng.int(5, 7), len = rng.int(3, 4), D = pickD(rng, n, true), ans = X.numCount(D, len, false, "even");
      return mk(rng, ans, [[X.numCount(D, len, false, null) / 2, "Assumed half are even"], [X.numCount(D, len, false, null), "Ignored the 'even' condition"], [D.filter((x) => x % 2 === 0).length * nPr(n - 1, len - 1), "Allowed 0 as the first digit"], [(n - 1) * nPr(n - 1, len - 1)]],
        finish(d, `How many **even ${len}-digit** numbers can be formed from the digits **${setTxt(D)}** with no repetition?`,
          [`Case 1: last digit 0 → the other ${len - 1} places from ${n - 1} digits: ${nPr(n - 1, len - 1)}`, `Case 2: last digit is another even digit (${D.filter((x) => x % 2 === 0 && x > 0).length} choices): first digit can't be 0 → (${n - 2}) × ${nPr(n - 2, len - 2)} each`, `Total = **${ans}**`],
          `Split on the units digit (0 or non-zero even).`, `0 as the units digit and 0 elsewhere behave differently: treat them as separate cases.`));
    }
    if (k === 1) {
      const n = rng.int(5, 7), len = rng.int(3, 4), D = pickD(rng, n, true).slice(0, n); if (!D.includes(5)) { D[D.length - 1] = 5; D.sort((x, y) => x - y); if (new Set(D).size < n) return null; }
      const ans = X.numCount(D, len, false, "five");
      return mk(rng, ans, [[X.numCount(D, len, false, null), "Ignored the divisibility condition"], [nPr(n - 1, len - 1) * 2, "Allowed 0 as the first digit"], [X.numCount(D, len, false, null) / 2], [ans + nPr(n - 2, len - 2)]],
        finish(d, `How many **${len}-digit** numbers divisible by **5** can be formed from the digits **${setTxt(D)}** without repetition?`,
          [`A number is divisible by 5 if it ends in 0 or 5`, `Ends in 0: ${nPr(n - 1, len - 1)}; ends in 5: ${(n - 2)} × ${nPr(n - 2, len - 2)} (first digit not 0)`, `Total = **${ans}**`], `Units digit 0 or 5; handle 5 separately because of the leading-zero rule.`, `When 5 is the units digit, 0 cannot lead; when 0 is the units digit, there is no such restriction.`));
    }
    if (k === 2) {
      const n = rng.int(6, 8), len = 4, D = pickD(rng, n, false), lead = rng.int(3, 5), ans = X.numAbove(D, len, lead);
      if (D.filter((x) => x >= lead).length < 1) return null;
      return mk(rng, ans, [[nPr(n, len), "Ignored the 'greater than' condition"], [D.filter((x) => x > lead).length * nPr(n - 1, len - 1), "Left out numbers starting with the boundary digit"], [D.filter((x) => x >= lead).length * Math.pow(n, len - 1), "Allowed digits to repeat"], [D.filter((x) => x >= lead).length * nPr(n - 1, len - 1) / 2]],
        finish(d, `How many **4-digit numbers greater than ${lead}000** can be formed from the digits **${setTxt(D)}** with no digit repeated?`,
          [`A 4-digit number above ${lead}000 must start with a digit of ${lead} or more`, `Such digits in the set: ${D.filter((x) => x >= lead).join(", ")} (${D.filter((x) => x >= lead).length})`, `Other three places: ${nPr(n - 1, len - 1)}`, `${D.filter((x) => x >= lead).length} × ${nPr(n - 1, len - 1)} = **${ans}**`], `Count the allowed leading digits, then fill the rest freely.`, `Numbers starting with ${lead} are all above ${lead}000 (they have no repeated digits), so ${lead} is allowed.`));
    }
    const n = rng.int(5, 7), D = pickD(rng, n, false), len = n;
    return mk(rng, F(n), [[Math.pow(n, n), "Allowed digits to repeat"], [F(n - 1), "Used (n − 1)!"], [F(n) / 2], [n * (n - 1)]],
      finish(d, `How many **${n}-digit** numbers can be formed using **each** of the digits **${setTxt(D)}** exactly once?`,
        [`${n} different digits fill ${n} places`, `${n}! = **${F(n)}**`], `All digits used once: n!.`, `This is the full permutation of n objects, not nPr with r < n.`));
  }) });

  QB.__x = QB.__x || {}; QB.__x.pnc = X;
})();
