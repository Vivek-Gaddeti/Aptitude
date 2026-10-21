/* =====================================================================
   Sets & Venn: generators for the catalog patterns marked gen:true
   (two-set, three-set, max-and-min-overlap). Three-set data are built from
   the seven Venn regions, so every question is consistent.
   ===================================================================== */
(function () {
  const N = (x) => QB.num(x);
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 95 };
  const NAMES = ["Aarav", "Meera", "Rohit", "Sneha", "Kiran", "Divya", "Arjun", "Pooja", "Vikram", "Ananya", "Suresh", "Neha", "Imran", "Lakshmi", "Harsh", "Kavya", "Manoj", "Riya", "Farhan", "Tanvi", "Gopal", "Isha", "Naveen", "Shreya", "Deepak", "Nisha", "Rahul", "Swati", "Karthik", "Preeti"];
  const LEAD = ["", "", "Warm-up: ", "Mock test: ", "Try this: ", "Practice question: ", "Campus drive: ", "Interview round: ", "Quick one: "];
  // [group of people, a verb phrase for A, for B, noun]
  const CTX2 = [
    ["students in a class", "play cricket", "play football", "students"],
    ["employees in an office", "know Python", "know Java", "employees"],
    ["families in a society", "read The Hindu", "read the Times of India", "families"],
    ["people surveyed", "drink tea", "drink coffee", "people"],
    ["residents of a colony", "own a car", "own a bike", "residents"],
    ["candidates in a hiring drive", "cleared the aptitude round", "cleared the coding round", "candidates"],
    ["members of a club", "like badminton", "like table tennis", "members"],
    ["customers in a shop", "bought rice", "bought wheat", "customers"],
    ["students in a hostel", "speak Hindi", "speak Tamil", "students"],
    ["commuters on a metro train", "use the Metro card", "use UPI for fares", "commuters"],
  ];
  const CTX3 = [
    ["people surveyed", ["tea", "coffee", "juice"], "like", "people"],
    ["students of a school", ["cricket", "football", "hockey"], "play", "students"],
    ["employees of a firm", ["Python", "Java", "SQL"], "know", "employees"],
    ["families in a society", ["The Hindu", "the Times of India", "the Indian Express"], "read", "families"],
    ["candidates in a drive", ["the aptitude test", "the coding test", "the interview"], "cleared", "candidates"],
    ["members of a club", ["chess", "carrom", "table tennis"], "play", "members"],
  ];

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("sets-ds: no clean question found");
    };
  }
  function mk(rng, f, ans, wrongs, extra) {
    if (!Number.isInteger(ans) || ans < 0) return null;
    const A = f(ans), seen = new Set([A]), pairs = [[A, null]];
    for (const w of wrongs) {
      if (pairs.length === 4) break;
      const v = w[0];
      if (!isFinite(v) || v < 0) continue;
      const t = f(v);
      if (seen.has(t)) continue;
      seen.add(t); pairs.push([t, w[1]]);
    }
    if (pairs.length < 4) return null;
    const o = QB.options(rng, pairs);
    return Object.assign({ time: TIME[extra.d] }, extra, o, { calc: String(ans) });
  }
  const fin = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });
  const num = (x) => N(x);
  const pc = (x) => N(x) + "%";

  /* ------------------------------------------------------------------ 1. two-set */
  QB.gen("quant/sets-ds/two-set", { title: "Two-set Venn problems", gen: wrap((rng, d) => {
    const lead = T(rng, LEAD), c = T(rng, CTX2), nm = T(rng, NAMES);
    if (d === "Easy") {
      const k = rng.int(0, 2);
      const tot = rng.int(8, 30) * 10, a = rng.int(2, 8) * 10 + rng.int(0, 1) * 5, b = rng.int(2, 8) * 10 + rng.int(0, 1) * 5, x = rng.int(1, Math.min(a, b) - 1);
      const uni = a + b - x;
      if (uni > tot - 5) return null;
      if (k === 0) return mk(rng, num, uni, [
        [a + b, "Added the two sets without removing the overlap"],
        [a + b - 2 * x, "Removed the overlap twice (exactly one set only)"],
        [tot - uni, "Gave the number in neither set"],
        [Math.max(a, b), "Took the larger set only"],
        [a + b + x, "Added the overlap"],
      ], fin(d, lead + `Of ${tot} ${c[0]}, **${a}** ${c[1]}, **${b}** ${c[2]} and **${x}** do both. How many ${c[1]} or ${c[2]} (or both)?`,
        [`n(A ∪ B) = n(A) + n(B) − n(A ∩ B)`, `= ${a} + ${b} − ${x} = **${uni}**`],
        "Union = A + B − both.",
        "People who do both are counted in each set, so they must be subtracted once."));
      if (k === 1) return mk(rng, num, tot - uni, [
        [tot - a - b, "Forgot to add back the overlap"],
        [uni, "Gave the number in at least one set"],
        [tot - a - b + 2 * x, "Added the overlap twice"],
        [tot - Math.max(a, b), "Subtracted only the larger set"],
        [tot - uni + x, "Added the overlap to the answer"],
      ], fin(d, lead + `In a group of ${tot} ${c[3]}, **${a}** ${c[1]}, **${b}** ${c[2]} and **${x}** do both. How many do neither?`,
        [`At least one = ${a} + ${b} − ${x} = ${uni}`, `Neither = ${tot} − ${uni} = **${tot - uni}**`],
        "Neither = total − (A + B − both).",
        "First find the union; the 'neither' group is whatever is left of the total."));
      return mk(rng, num, a - x, [
        [a, "Gave the whole set A, including the overlap"],
        [b - x, "Found the part of B only"],
        [a + b - 2 * x, "Gave the number in exactly one set"],
        [a - x + b, "Mixed the two sets"],
        [x, "Gave the overlap"],
      ], fin(d, lead + `Of ${tot} ${c[0]}, **${a}** ${c[1]}, **${b}** ${c[2]} and **${x}** do both. How many ${c[1]} but are not among those who ${c[2]}?`,
        [`Only A = n(A) − n(A ∩ B) = ${a} − ${x} = **${a - x}**`],
        "Only A = A − both.",
        "The overlap belongs to A, but not to 'A only'."));
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      const tot = rng.int(10, 40) * 5, z = rng.int(1, 8) * 5, a = rng.int(10, 30) * 2 + 1 * 0, b = rng.int(10, 30) * 2;
      const x = a + b - (tot - z);
      if (x < 2 || x >= Math.min(a, b) || a >= tot || b >= tot) return null;
      if (k === 0) return mk(rng, num, x, [
        [a + b - tot, "Ignored the people who do neither"],
        [tot - z, "Gave the number in at least one set"],
        [a + b - (tot - z) + z, "Added the 'neither' group to the overlap"],
        [Math.min(a, b) - z, "Subtracted the 'neither' group from the smaller set"],
        [a + b, "Gave the sum of the two sets"],
      ], fin(d, lead + `In a group of ${tot} ${c[3]}, **${a}** ${c[1]}, **${b}** ${c[2]}, and **${z}** do neither. How many do both?`,
        [`At least one = ${tot} − ${z} = ${tot - z}`, `Both = ${a} + ${b} − ${tot - z} = **${x}**`],
        "Both = A + B − (total − neither).",
        "Remove the 'neither' group from the total before using the union formula."));
      if (k === 1) return mk(rng, num, a + b - 2 * x, [
        [a + b - x, "Gave the union (everyone in at least one set)"],
        [a + b, "Added the two sets"],
        [tot - z - x, "Subtracted the overlap once from the union"],
        [a + b - 3 * x, "Subtracted the overlap three times"],
        [a - x, "Gave only A"],
      ], fin(d, lead + `Of ${tot} ${c[3]}, **${z}** do neither of two activities, **${a}** ${c[1]} and **${b}** ${c[2]}. How many do exactly one of the two?`,
        [`Both = ${a} + ${b} − (${tot} − ${z}) = ${x}`, `Exactly one = (${a} − ${x}) + (${b} − ${x}) = **${a + b - 2 * x}**`],
        "Exactly one = A + B − 2 × both.",
        "The overlap is subtracted from EACH set to get 'exactly one'."));
      return mk(rng, num, b - x, [
        [b, "Gave the whole set B"],
        [a - x, "Found the part of A only"],
        [b - x + z, "Added the 'neither' group"],
        [tot - a, "Gave everyone outside A"],
        [x, "Gave the overlap"],
      ], fin(d, lead + `In a group of ${tot} ${c[3]}, ${a} ${c[1]} and ${b} ${c[2]}; ${z} do neither. How many ${c[2]} but are not among those who ${c[1]}?`,
        [`Both = ${a} + ${b} − (${tot} − ${z}) = ${x}`, `Only B = ${b} − ${x} = **${b - x}**`],
        "Only B = B − both, and both = A + B − (total − neither).",
        "Find the overlap first; it is hidden in the 'neither' data."));
    }
    // Hard: percentages and ratio conditions
    const k = rng.int(0, 2);
    if (k === 0) {
      const a = rng.int(5, 17) * 5, b = rng.int(5, 17) * 5, z = rng.int(1, 5) * 5;
      const x = a + b - (100 - z);
      if (x < 5 || x >= Math.min(a, b) || a >= 100 || b >= 100) return null;
      const tot = T(rng, [200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000]);
      return mk(rng, num, tot * x / 100, [
        [x, "Gave the percentage, not the number of people"],
        [tot * (a + b - 100) / 100, "Ignored the people who do neither"],
        [tot * (100 - z) / 100, "Gave the number in at least one set"],
        [tot * (a + b) / 100, "Added the two percentages and took that share"],
        [tot * (x + z) / 100, "Added the 'neither' group to the overlap"],
      ], fin(d, lead + `In a survey of ${num(tot)} ${c[3]}, **${a}%** ${c[1]}, **${b}%** ${c[2]} and **${z}%** do neither. How many do both?`,
        [`At least one = 100% − ${z}% = ${100 - z}%`, `Both = ${a}% + ${b}% − ${100 - z}% = ${x}%`, `Number = ${x}% of ${num(tot)} = **${num(tot * x / 100)}**`],
        "Work in percentages first: both% = A% + B% − (100 − neither%), then take that share.",
        "The answer asks for a NUMBER of people, not the percentage."));
    }
    if (k === 1) {
      // only-A is p times both; neither given
      const x = rng.int(2, 12), p = T(rng, [2, 3, 4]), q2 = T(rng, [2, 3]), z = rng.int(1, 10) * 2;
      const oa = p * x, ob = q2 * x, tot = oa + ob + x + z;
      return mk(rng, num, tot, [
        [oa + ob + x, "Forgot the people who do neither"],
        [oa + ob + z, "Forgot the people who do both"],
        [oa + ob + 2 * x + z, "Counted the people who do both twice"],
        [oa + ob + x + z + x, "Added the overlap one time too many"],
        [(p + q2 + 1) * x, "Forgot the people who do neither"],
      ], fin(d, lead + `In a group, the number who ${c[1]} only is **${p}** times the number who do both, the number who ${c[2]} only is **${q2}** times the number who do both, and **${z}** do neither. If ${x} do both, how many are in the group?`,
        [`Only A = ${p} × ${x} = ${oa}`, `Only B = ${q2} × ${x} = ${ob}`, `Total = ${oa} + ${ob} + ${x} (both) + ${z} (neither) = **${tot}**`],
        "Total = only A + only B + both + neither.",
        "Add all four regions, and count the overlap exactly once."));
    }
    const x = rng.int(3, 20) * 2, a = x + rng.int(2, 14) * 2, b = x + rng.int(2, 14) * 2, z = rng.int(1, 8) * 2;
    const tot = a + b - x + z, one = a + b - 2 * x;
    return mk(rng, num, one, [
      [a + b - x, "Gave everyone in at least one set"],
      [a + b, "Gave the sum of the two sets"],
      [tot - one, "Gave the number NOT in exactly one set"],
      [a + b - 3 * x, "Subtracted the overlap three times"],
      [one + z, "Added the 'neither' group"],
    ], fin(d, lead + `${nm} surveyed ${tot} ${c[3]}. **${a}** ${c[1]}, **${b}** ${c[2]} and **${z}** do neither. How many do exactly one of the two?`,
      [`At least one = ${tot} − ${z} = ${tot - z}`, `Both = ${a} + ${b} − ${tot - z} = ${x}`, `Exactly one = ${tot - z} − ${x} = **${one}**`],
      "Exactly one = (at least one) − both.",
      "Subtract the overlap from the union, not from the total."));
  }) });

  /* ------------------------------------------------------------------ 2. three-set */
  function regions(rng, d) {
    const r = { abc: rng.int(2, 10), ab: rng.int(1, 12), ac: rng.int(1, 12), bc: rng.int(1, 12), a: rng.int(5, 30), b: rng.int(5, 30), c: rng.int(5, 30), z: rng.int(0, 15) };
    if (d === "Easy") { r.abc = rng.int(2, 6); }
    return r;
  }
  QB.gen("quant/sets-ds/three-set", { title: "Three-set Venn problems", gen: wrap((rng, d) => {
    const lead = T(rng, LEAD), c = T(rng, CTX3), nm = T(rng, NAMES);
    const r = regions(rng, d);
    const A = r.a + r.ab + r.ac + r.abc, B = r.b + r.ab + r.bc + r.abc, Cc = r.c + r.ac + r.bc + r.abc;
    const AB = r.ab + r.abc, BC = r.bc + r.abc, AC = r.ac + r.abc, ABC = r.abc;
    const uni = r.a + r.b + r.c + r.ab + r.ac + r.bc + r.abc, tot = uni + r.z;
    const e1 = r.a + r.b + r.c, e2 = r.ab + r.ac + r.bc;
    const [grp, items, vb] = c, [x1, x2, x3] = items;
    const given = `**${A}** ${vb} ${x1}, **${B}** ${vb} ${x2}, **${Cc}** ${vb} ${x3}, **${AB}** ${vb} ${x1} and ${x2}, **${BC}** ${vb} ${x2} and ${x3}, **${AC}** ${vb} ${x1} and ${x3}, and **${ABC}** ${vb} all three`;
    const frame = `Among ${grp}, ${given}.`;
    if (d === "Easy") {
      const k = rng.int(0, 1);
      if (k === 0) return mk(rng, num, uni, [
        [A + B + Cc - AB - BC - AC, "Forgot to add back the triple overlap"],
        [A + B + Cc - AB - BC - AC + 2 * ABC, "Added the triple overlap twice"],
        [A + B + Cc, "Added the three sets without removing any overlap"],
        [A + B + Cc - AB - BC - AC - ABC, "Subtracted the triple overlap instead of adding it"],
        [A + B + Cc - 2 * (AB + BC + AC) + ABC, "Subtracted each pair twice"],
      ], fin(d, lead + `${frame} How many ${c[3]} ${vb} at least one of the three?`,
        [`n(A ∪ B ∪ C) = A + B + C − (AB + BC + AC) + ABC`, `= ${A} + ${B} + ${Cc} − (${AB} + ${BC} + ${AC}) + ${ABC}`, `= **${uni}**`],
        "Union = singles − pairs + triple.",
        "The triple overlap is subtracted three times as part of the pairs and must be added back once."));
      return mk(rng, num, tot - uni, [
        [tot - (A + B + Cc - AB - BC - AC), "Forgot to add back the triple overlap"],
        [uni, "Gave the number in at least one set"],
        [tot - (A + B + Cc), "Subtracted the three sets without correcting overlaps"],
        [tot - uni + ABC, "Added the triple overlap to the answer"],
        [tot - (A + B + Cc - AB - BC - AC + 2 * ABC), "Added the triple overlap twice"],
      ], fin(d, lead + `${frame} If there are ${tot} ${c[3]} in all, how many ${vb} none of the three?`,
        [`At least one = ${A} + ${B} + ${Cc} − ${AB + BC + AC} + ${ABC} = ${uni}`, `None = ${tot} − ${uni} = **${tot - uni}**`],
        "None = total − union, with union = singles − pairs + triple.",
        "First find the union carefully; the 'none' group is the rest."));
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      if (k === 0) return mk(rng, num, r.a, [
        [A - AB - AC, "Subtracted both pair overlaps but forgot to add back the triple overlap"],
        [A - AB - AC + 2 * ABC, "Added the triple overlap twice"],
        [A - ABC, "Removed only the triple overlap"],
        [A, "Gave the whole set"],
        [A - AB - AC - ABC, "Subtracted the triple overlap a third time"],
      ], fin(d, lead + `${frame} How many ${vb} only ${x1}?`,
        [`Only A = A − (A∩B) − (A∩C) + (A∩B∩C)`, `= ${A} − ${AB} − ${AC} + ${ABC} = **${r.a}**`],
        "Only A = A − AB − AC + ABC (the triple overlap was subtracted twice).",
        "The triple overlap sits inside both pair overlaps, so removing both pairs removes it twice."));
      if (k === 1) return mk(rng, num, e2, [
        [AB + BC + AC, "Added the pair overlaps; the triple overlap is counted three times"],
        [AB + BC + AC - ABC, "Subtracted the triple overlap only once"],
        [AB + BC + AC - 2 * ABC, "Subtracted the triple overlap twice"],
        [AB + BC + AC + ABC, "Added the triple overlap"],
        [e2 + ABC, "Included those in all three"],
      ].map((w, i) => (i === 2 ? [w[0], w[1]] : w)), fin(d, lead + `${frame} How many ${vb} exactly two of the three?`,
        [`Exactly two = (AB + BC + AC) − 3 × ABC`, `= ${AB + BC + AC} − 3 × ${ABC} = **${e2}**`],
        "Exactly two = sum of the pair overlaps − 3 × triple.",
        "Each person in all three is inside all three pair overlaps, so remove the triple overlap three times."));
      return mk(rng, num, e1, [
        [A + B + Cc - 2 * (AB + BC + AC) + ABC, "Used +ABC instead of +3·ABC"],
        [A + B + Cc - (AB + BC + AC), "Subtracted the pairs only once"],
        [A + B + Cc - 2 * (AB + BC + AC) + 2 * ABC, "Used +2·ABC instead of +3·ABC"],
        [uni, "Gave the number in at least one set"],
        [A + B + Cc - 2 * e2 - ABC, "Mixed up exactly-two and all-three counts"],
      ], fin(d, lead + `${frame} How many ${vb} exactly one of the three?`,
        [`Exactly one = A + B + C − 2(AB + BC + AC) + 3·ABC`, `= ${A + B + Cc} − 2 × ${AB + BC + AC} + 3 × ${ABC} = **${e1}**`],
        "Exactly one = singles − 2 × pairs + 3 × triple.",
        "Pair overlaps count people in all three three times, so the triple needs a correction of +3."));
    }
    // Hard: exactly-two / union data given in a different form
    const k = rng.int(0, 2);
    const S = A + B + Cc;
    if (k === 0) {
      // total, none, A, B, C, exactly two -> all three
      return mk(rng, num, ABC, [
        [S - uni - e2, "Forgot to halve (the membership gap counts those in all three twice)"],
        [(S - uni - e2) / 2 + 1, "Slipped by one"],
        [(S - uni) / 2, "Ignored the people who are in exactly two sets"],
        [(S - e2) / 3, "Divided by 3 instead of using the union"],
        [e2, "Gave the number in exactly two"],
      ], fin(d, lead + `Of ${tot} ${c[3]}, **${r.z}** ${vb} none of ${x1}, ${x2} and ${x3}. **${A}** ${vb} ${x1}, **${B}** ${x2}, **${Cc}** ${x3}, and **${e2}** ${vb} exactly two of the three. How many ${vb} all three?`,
        [`At least one = ${tot} − ${r.z} = ${uni}`, `Sum of the three sets = ${A} + ${B} + ${Cc} = ${S}`, `Sum counts exactly-two people twice and all-three people three times, so S − union = exactly two + 2 × all three`, `${S} − ${uni} = ${e2} + 2 × ABC, so ABC = (${S - uni} − ${e2}) ÷ 2 = **${ABC}**`],
        "All three = (A + B + C − union − exactly two) ÷ 2.",
        "Compare the sum of the sets with the union: the surplus is E2 + 2·E3."));
    }
    if (k === 1) {
      const atLeast2 = e2 + ABC;
      return mk(rng, num, atLeast2, [
        [AB + BC + AC, "Added the pair overlaps; those in all three get counted three times"],
        [AB + BC + AC - ABC, "Subtracted the triple overlap only once"],
        [e2, "Left out those in all three"],
        [AB + BC + AC - 3 * ABC, "Subtracted the triple overlap three times (that gives exactly two)"],
        [AB + BC + AC + ABC, "Added the triple overlap"],
      ], fin(d, lead + `${frame} How many ${vb} at least two of the three?`,
        [`Exactly two = ${AB + BC + AC} − 3 × ${ABC} = ${e2}`, `At least two = exactly two + all three = ${e2} + ${ABC} = **${atLeast2}**`],
        "At least two = (AB + BC + AC) − 2 × ABC.",
        "Those in all three count as 'at least two' too."));
    }
    // total memberships
    const tm = S;
    return mk(rng, num, e1, [
      [tm - 2 * e2 - ABC, "Counted each person in all three twice"],
      [tm - e2 - 3 * ABC, "Counted people in exactly two once"],
      [tm - 2 * e2 - 2 * ABC, "Counted people in all three twice"],
      [uni - e2, "Forgot the people in all three"],
      [uni, "Gave the number in at least one set"],
    ], fin(d, lead + `${nm} finds ${A} ${vb} ${x1}, ${B} ${vb} ${x2} and ${Cc} ${vb} ${x3}. Of ${tot} ${c[3]}, ${r.z} ${vb} none; ${e2} ${vb} exactly two of the three and ${ABC} ${vb} all three. How many ${vb} exactly one?`,
      [`Total memberships = ${A} + ${B} + ${Cc} = ${tm}`, `Memberships = E1 + 2·E2 + 3·E3`, `E1 = ${tm} − 2 × ${e2} − 3 × ${ABC} = **${e1}**`],
      "E1 = (A + B + C) − 2·E2 − 3·E3.",
      "Every person in exactly two sets contributes 2 memberships; everyone in all three contributes 3."));
  }) });

  /* ------------------------------------------------------------------ 3. maximum and minimum overlap */
  QB.gen("quant/sets-ds/max-and-min-overlap", { title: "Maximum and minimum overlap", gen: wrap((rng, d) => {
    const lead = T(rng, LEAD), c = T(rng, CTX2), nm = T(rng, NAMES);
    if (d === "Easy") {
      const tot = rng.int(6, 20) * 10, a = rng.int(5, 18) * 5, b = rng.int(5, 18) * 5;
      if (a >= tot || b >= tot || a + b <= tot + 4) return null;
      const mx = Math.min(a, b), mn = a + b - tot;
      if (rng.chance(0.5)) return mk(rng, num, mn, [
        [mx, "Gave the maximum overlap"],
        [a + b, "Added the two sets"],
        [tot - mn, "Took the total minus the answer"],
        [Math.abs(a - b), "Took the difference between the two sets"],
        [mn + 5, "Slipped by 5"],
      ], fin(d, lead + `Of ${tot} ${c[0]}, **${a}** ${c[1]} and **${b}** ${c[2]}. What is the minimum possible number who do both?`,
        [`Even if the two groups overlap as little as possible, they must share ${a} + ${b} − ${tot}`, `Minimum = **${mn}**`],
        "Minimum overlap = A + B − total (if positive).",
        "The overlap is forced by the numbers: the two groups cannot fit into the total without sharing members."));
      return mk(rng, num, mx, [
        [mn, "Gave the minimum overlap"],
        [a + b - tot + Math.abs(a - b), "Mixed up the two formulas"],
        [Math.max(a, b), "Took the larger set"],
        [a + b, "Added the two sets"],
        [(a + b) / 2 + 5, "Took a mean"],
      ], fin(d, lead + `Of ${tot} ${c[0]}, **${a}** ${c[1]} and **${b}** ${c[2]}. What is the maximum possible number who do both?`,
        [`The overlap cannot exceed the smaller group`, `Maximum = min(${a}, ${b}) = **${mx}**`],
        "Maximum overlap = the smaller set.",
        "The overlap is at most the smaller set; the total does not matter for the maximum."));
    }
    if (d === "Medium") {
      const a = rng.int(11, 19) * 5, b = rng.int(11, 19) * 5;
      if (a + b <= 105) return null;
      const mx = Math.min(a, b), mn = a + b - 100;
      const tot = T(rng, [200, 400, 500, 800, 1000, 1200, 2000]);
      const kind = rng.int(0, 2);
      if (kind === 0) return mk(rng, pc, mn, [
        [mx, "Gave the maximum overlap"],
        [a + b, "Added the two percentages"],
        [100 - mn, "Gave 100 minus the answer"],
        [Math.abs(a - b), "Took the difference between the two percentages"],
        [mn + 5, "Slipped by 5"],
      ], fin(d, lead + `In a town, **${a}%** of the ${c[3]} ${c[1]} and **${b}%** ${c[2]}. What is the least possible percentage who do both?`,
        [`Least both = A% + B% − 100% = ${a}% + ${b}% − 100% = **${mn}%**`],
        "Least overlap = A% + B% − 100%.",
        "The two shares add to more than 100%, so they must overlap by the excess."));
      if (kind === 1) return mk(rng, num, tot * mn / 100, [
        [tot * mx / 100, "Gave the maximum overlap"],
        [mn, "Gave the percentage instead of the number"],
        [tot * (a + b) / 100, "Added the two percentages"],
        [tot * (100 - mn) / 100, "Took 100% minus the answer"],
        [tot * Math.abs(a - b) / 100, "Took the difference between the two percentages"],
      ], fin(d, lead + `Out of ${num(tot)} ${c[3]}, **${a}%** ${c[1]} and **${b}%** ${c[2]}. What is the minimum number who do both?`,
        [`Least both% = ${a} + ${b} − 100 = ${mn}%`, `Number = ${mn}% of ${num(tot)} = **${num(tot * mn / 100)}**`],
        "Least both = (A% + B% − 100%) of the total.",
        "Convert the percentage into a number of people at the end."));
      return mk(rng, pc, mx, [
        [mn, "Gave the minimum overlap"],
        [Math.max(a, b), "Took the larger set"],
        [a + b - 100 + Math.abs(a - b), "Mixed up the formulas"],
        [(a + b) / 2, "Took the mean of the two"],
        [100 - mx, "Gave 100 minus the answer"],
      ], fin(d, lead + `In a survey, **${a}%** of the ${c[3]} ${c[1]} and **${b}%** ${c[2]}. What is the greatest possible percentage who do both?`,
        [`The overlap cannot exceed either group, so it is at most the smaller: min(${a}%, ${b}%) = **${mx}%**`],
        "Greatest overlap = the smaller percentage.",
        "The greatest overlap happens when the smaller group sits wholly inside the larger one."));
    }
    // Hard: three sets, four sets
    const kind = rng.int(0, 3);
    if (kind === 0) {
      const tot = rng.int(8, 20) * 10, a = rng.int(5, 9) * 10 + tot / 10 * 0, b = rng.int(5, 9) * 10, cc = rng.int(5, 9) * 10;
      const A = Math.min(a, tot - 10), B = Math.min(b, tot - 10), Cx = Math.min(cc, tot - 10);
      const mn = A + B + Cx - 2 * tot;
      if (mn <= 0) return null;
      return mk(rng, num, mn, [
        [Math.min(A, B, Cx), "Gave the maximum overlap"],
        [A + B + Cx - tot, "Subtracted the total once instead of twice"],
        [A + B + Cx - 3 * tot, "Subtracted the total three times"],
        [A + B + Cx - 2 * tot + 10, "Slipped by 10"],
        [Math.min(A, B, Cx) - mn, "Took the gap between maximum and minimum"],
      ], fin(d, lead + `Out of ${tot} ${c[3]}, **${A}** are in group P, **${B}** in group Q and **${Cx}** in group R. What is the minimum number that must belong to all three groups?`,
        [`Outside the three groups: ${tot - A}, ${tot - B} and ${tot - Cx}`, `At most ${tot - A} + ${tot - B} + ${tot - Cx} = ${3 * tot - A - B - Cx} can miss at least one group`, `Least in all three = ${tot} − ${3 * tot - A - B - Cx} = **${mn}**`],
        "Least in all three = A + B + C − 2 × total (if positive).",
        "Work with the people who are MISSING from each group: the missing numbers can overlap least, so they add up."));
    }
    if (kind === 1) {
      const tot = rng.int(8, 20) * 10, a = rng.int(4, 8) * 10, b = rng.int(4, 8) * 10, cc = rng.int(4, 8) * 10;
      const mx = Math.min(a, b, cc);
      return mk(rng, num, mx, [
        [Math.max(a, b, cc), "Took the largest set"],
        [a + b + cc - 2 * tot > 0 ? a + b + cc - 2 * tot : tot - a - b - cc + 10, "Gave the minimum overlap"],
        [Math.round((a + b + cc) / 3), "Took the mean of the three sets"],
        [a + b - tot > 0 ? a + b - tot : mx + 10, "Used the two-set minimum"],
        [mx + 10, "Slipped by 10"],
      ], fin(d, lead + `In a group of ${tot} ${c[3]}, **${a}** are in the first club, **${b}** in the second and **${cc}** in the third. What is the maximum possible number in all three clubs?`,
        [`Those in all three cannot exceed the smallest club`, `Maximum = min(${a}, ${b}, ${cc}) = **${mx}**`],
        "Greatest overlap of several sets = the smallest set.",
        "The total number of people does not limit the maximum."));
    }
    if (kind === 2) {
      const tot = rng.int(10, 30) * 10, a = rng.int(2, 6) * 10, b = rng.int(2, 6) * 10, cc = rng.int(2, 6) * 10;
      const none = tot - Math.max(a, b, cc), minNone = Math.max(0, tot - a - b - cc);
      return mk(rng, num, none, [
        [minNone === 0 ? tot - a - b - cc + 10 : minNone, "Gave the minimum number who are in none"],
        [tot - Math.min(a, b, cc), "Subtracted the smallest set"],
        [tot - a - b - cc + 10, "Subtracted all three sets and slipped by 10"],
        [tot - Math.round((a + b + cc) / 3), "Subtracted the mean of the sets"],
        [tot, "Gave the whole total"],
      ], fin(d, lead + `Of ${tot} ${c[3]}, **${a}** are in group P, **${b}** in group Q and **${cc}** in group R. What is the maximum possible number who are in none of the three groups?`,
        [`To leave as many as possible out, the three groups must overlap as much as possible, so the union is as small as possible`, `Smallest union = the largest group = ${Math.max(a, b, cc)}`, `Maximum none = ${tot} − ${Math.max(a, b, cc)} = **${none}**`],
        "Max none = total − (largest set).",
        "To maximise the outsiders, make the groups nest inside each other."));
    }
    // four items, percentages
    const ps = [rng.int(12, 19) * 5, rng.int(12, 19) * 5, rng.int(12, 19) * 5, rng.int(12, 19) * 5].map((p) => Math.min(p, 95));
    const gap = ps.reduce((s, p) => s + (100 - p), 0), mn = 100 - gap;
    if (mn <= 0 || new Set(ps).size < 3) return null;
    const items = T(rng, [["a TV", "a fridge", "a washing machine", "a cooker"], ["a phone", "a laptop", "a tablet", "a smartwatch"], ["rice", "dal", "oil", "sugar"]]);
    return mk(rng, pc, mn, [
      [Math.min.apply(null, ps), "Gave the maximum overlap"],
      [100 - gap + 10, "Slipped by 10"],
      [gap, "Gave the total of the missing percentages"],
      [ps.reduce((s, p) => s + p, 0) - 300, "Subtracted 300 from the sum of percentages and then ignored the fourth set"],
      [ps.reduce((s, p) => s + p, 0) - 400, "Subtracted 400 from the sum of percentages"],
    ].map((w) => [Math.abs(w[0]) === 0 ? 5 : Math.abs(w[0]), w[1]]), fin(d, lead + `In a survey, **${ps[0]}%** of households own ${items[0]}, **${ps[1]}%** own ${items[1]}, **${ps[2]}%** own ${items[2]} and **${ps[3]}%** own ${items[3]}. What is the minimum percentage that own all four?`,
      [`Percentages that do NOT own: ${ps.map((p) => 100 - p + "%").join(", ")}`, `At most ${gap}% can be missing at least one item`, `Minimum owning all four = 100% − ${gap}% = **${mn}%**`],
      "Minimum in all = 100 − (sum of the 'not owning' percentages).",
      "Add the missing percentages; they overlap least when they are all different people."));
  }) });
})();
