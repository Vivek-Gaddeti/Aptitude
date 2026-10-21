/* =====================================================================
   Ratio, proportion & variation: eight question generators.
   Easy / Medium / Hard, clean answers, wrong options from real mistakes.
   ===================================================================== */
(function () {
  const M = (x) => QB.money(x), N = (x) => QB.num(x);
  const R = (x) => QB.round(x, 2);
  const C = (x) => isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const I = Number.isInteger;
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 95 };
  const NM = ["Arjun", "Meera", "Kiran", "Rohan", "Sneha", "Imran", "Divya", "Harsh", "Lakshmi", "Farhan", "Pooja", "Vikram", "Nisha", "Tarun", "Anita", "Suresh", "Gita", "Rahul", "Bhavna", "Deepak", "Ishaan", "Kavya", "Manoj", "Naina"];
  const names = (rng, n) => { const a = rng.shuffle(NM); return a.slice(0, n); };
  const rt = (v) => { const g = QB.gcd(v[0], v[1]); return `${v[0] / g} : ${v[1] / g}`; };

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("ratio: no clean question found");
    };
  }
  // ans = value (or [a, b] when o.ratio); wrongs = [[value, why], ...]; f = formatter
  function mk(rng, f, ans, wrongs, extra, o) {
    o = o || {};
    const ok = o.ratio ? (v) => Array.isArray(v) && v.every((x) => isFinite(x) && x > 0 && I(x)) : (v) => typeof v === "number" && isFinite(v) && v > 0 && C(v);
    if (!ok(ans)) return null;
    if (o.ratio) { const g = QB.gcd(ans[0], ans[1]); if (Math.max(ans[0], ans[1]) / g > 400) return null; }
    const fm = (v) => (o.ratio ? f(v) : f(R(v)));
    const A = fm(ans), seen = new Set([A.toLowerCase()]), pairs = [[A, null]];
    for (const w of wrongs) {
      if (pairs.length === 4) break;
      if (!ok(w[0])) continue;
      const t = fm(w[0]);
      if (seen.has(t.toLowerCase()) || /NaN|undefined|Infinity/.test(t)) continue;
      seen.add(t.toLowerCase());
      pairs.push([t, w[1]]);
    }
    if (pairs.length < 4) return null;
    const out = QB.options(rng, pairs);
    return Object.assign({ time: TIME[extra.d] }, extra, out, { calc: o.ratio ? `${ans[0]}/${ans[1]}` : String(R(ans)) });
  }
  const finish = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });

  /* ------------------------------------------------------------------ 1. ratio basics */
  const UNITS = [["km", "m", 1000, "distance"], ["kg", "g", 1000, "weight"], ["hours", "minutes", 60, "time"], ["m", "cm", 100, "length"], ["litres", "ml", 1000, "volume"], ["₹", "paise", 100, "money"]];
  const VARS = [["x", "y"], ["a", "b"], ["m", "n"], ["P", "Q"]];
  QB.gen("quant/ratio/ratio-basics", { title: "Ratio basics", gen: wrap((rng, d) => {
    if (d === "Easy") {
      const u = T(rng, UNITS), x = T(rng, [1, 2, 3, 4, 5, 6, 8, 9, 12, 15, 1.5, 2.5, 3.5]), y = rng.int(2, 40) * (u[2] >= 1000 ? 50 : 10), big = x * u[2];
      if (!I(big)) return null;
      const A = [big, y];
      const sh = (a) => (u[0] === "₹" ? `₹${N(a)}` : `${N(a)} ${u[0]}`);
      const q = T(rng, [`Find the ratio of ${sh(x)} to ${N(y)} ${u[1]} (${u[3]}).`, `What is the ratio of **${sh(x)}** to **${N(y)} ${u[1]}**?`, `Express **${sh(x)} : ${N(y)} ${u[1]}** in its simplest form.`]);
      return mk(rng, rt, A, [
        [[x * 10, y], "Compared the numbers without converting to the same unit"],
        [[y, big], "Wrote the ratio the wrong way round"],
        [[big, y * 10], "Mis-converted the units (off by a power of 10)"],
        [[x, y], "Ignored the units and used the raw numbers"],
      ], finish(d, q,
        [`Convert to the same unit: ${sh(x)} = ${N(big)} ${u[1]}`, `Ratio = ${N(big)} : ${N(y)} = **${rt(A)}**`],
        `1 ${u[0]} = ${u[2]} ${u[1]}. Convert first, then cancel the common factor.`,
        `A ratio compares like quantities, so both terms must be in the same unit before simplifying.`), { ratio: true });
    }
    if (d === "Medium") {
      const [v1, v2] = T(rng, VARS), m = rng.int(1, 5), n = rng.int(1, 5), p = rng.int(3, 9), q2 = rng.int(1, p - 1);
      if (QB.gcd(p, q2) !== 1) return null;
      const ans = [n * (p + q2), m * (p - q2)];
      const co = (c, v) => (c === 1 ? v : c + v);
      return mk(rng, rt, ans, [
        [[ans[1], ans[0]], "Gave the ratio the wrong way round"],
        [[p + q2, p - q2], "Ignored the coefficients in front of the variables"],
        [[m * (p + q2), n * (p - q2)], "Attached the coefficients to the wrong variable"],
        [[p, q2], "Read the given ratio as the answer"],
      ], finish(d, `If (${co(m, v1)} + ${co(n, v2)}) : (${co(m, v1)} − ${co(n, v2)}) = ${p} : ${q2}, find **${v1} : ${v2}**.`,
        [`Cross-multiply: ${q2}(${co(m, v1)} + ${co(n, v2)}) = ${p}(${co(m, v1)} − ${co(n, v2)})`, `${m * (p - q2)}${v1} = ${n * (p + q2)}${v2}, so ${v1} : ${v2} = **${rt(ans)}**`],
        `Componendo and dividendo: ${co(m, v1)} : ${co(n, v2)} = (${p} + ${q2}) : (${p} − ${q2}).`,
        `The coefficients ${m} and ${n} belong with the variables, so divide them out at the end.`), { ratio: true });
    }
    const [v1, v2] = T(rng, VARS), m = rng.int(1, 9), n = rng.int(1, 9);
    if (QB.gcd(m, n) !== 1) return null;
    const p = rng.int(1, 5), qq = rng.int(1, 5), r = rng.int(1, 5), s = rng.int(1, 5);
    const ans = [p * m + qq * n, r * m + s * n];
    const co = (c, v) => (c === 1 ? v : c + v);
    return mk(rng, rt, ans, [
      [[p * n + qq * m, r * n + s * m], "Swapped the given ratio (used the first variable as the second)"],
      [[p + qq, r + s], "Added the coefficients and forgot the given ratio"],
      [[p * m - qq * n, r * m - s * n], "Used a minus sign in the numerator and denominator"],
      [[r * m + s * n, p * m + qq * n], "Wrote the answer upside down"],
    ], finish(d, `If **${v1} : ${v2} = ${m} : ${n}**, find the ratio **(${co(p, v1)} + ${co(qq, v2)}) : (${co(r, v1)} + ${co(s, v2)})**.`,
      [`Put ${v1} = ${m}k and ${v2} = ${n}k`, `(${p * m + qq * n}k) : (${r * m + s * n}k) = **${rt(ans)}**`],
      `Substitute ${v1} = ${m}, ${v2} = ${n} directly: the k cancels.`,
      `Keep ${v1} ↔ ${m} and ${v2} ↔ ${n}; swapping them gives a different ratio.`), { ratio: true });
  }) });

  /* ------------------------------------------------------------------ 2. dividing an amount */
  const POTS = [["prize money", "prize"], ["profit", "profit"], ["scholarship fund", "fund"], ["bonus pool", "bonus"], ["inheritance", "inheritance"], ["donation", "donation"]];
  QB.gen("quant/ratio/dividing-an-amount", { title: "Dividing an amount in a ratio", gen: wrap((rng, d) => {
    const [pot] = T(rng, POTS), nm = names(rng, 3);
    if (d === "Easy") {
      const a = rng.int(1, 9), b = rng.int(1, 9);
      if (a === b || QB.gcd(a, b) !== 1) return null;
      const k = rng.int(2, 40) * T(rng, [10, 20, 50]), V = (a + b) * k, big = rng.chance(0.5), sh = (big ? Math.max(a, b) : Math.min(a, b)) * k;
      return mk(rng, M, sh, [
        [V / (a + b), "Gave one part, not the share"],
        [(big ? Math.min(a, b) : Math.max(a, b)) * k, "Gave the other person's share"],
        [V * (big ? Math.max(a, b) : Math.min(a, b)) / Math.max(a, b) / 2, "Halved instead of using the ratio"],
        [V / (big ? Math.max(a, b) : Math.min(a, b)), "Divided the total by that person's ratio number"],
      ], finish(d, `The ${pot} of **${M(V)}** is divided between ${nm[0]} and ${nm[1]} in the ratio **${a} : ${b}**. How much does ${big ? (a > b ? nm[0] : nm[1]) : (a > b ? nm[1] : nm[0])} get? (${big ? "the larger share" : "the smaller share"})`,
        [`Total parts = ${a} + ${b} = ${a + b}`, `One part = ${M(V)} ÷ ${a + b} = ${M(k)}`, `Share = ${big ? Math.max(a, b) : Math.min(a, b)} × ${M(k)} = **${M(sh)}**`],
        `One part = total ÷ sum of ratio terms = ${M(k)}; multiply by the person's number.`,
        `Divide by the SUM of the ratio terms (${a + b}), not by one term.`));
    }
    if (d === "Medium") {
      const a = rng.int(1, 8), b = rng.int(1, 8), c = rng.int(1, 8);
      if (new Set([a, b, c]).size < 3 || QB.gcd(QB.gcd(a, b), c) !== 1) return null;
      const u = rng.int(2, 60) * T(rng, [10, 20, 50]), V = (a + b + c) * u;
      if (rng.chance(0.5)) {
        const who = rng.int(0, 2), r = [a, b, c][who];
        return mk(rng, M, r * u, [
          [u, "Gave one part, not the share"],
          [V / 3, "Divided equally among the three"],
          [V * r / (a + b + c - r), "Divided by the other two's parts"],
          [V - r * u, "Gave the total of the other two"],
        ], finish(d, `A ${pot} of **${M(V)}** is shared among ${nm[0]}, ${nm[1]} and ${nm[2]} in the ratio **${a} : ${b} : ${c}**. Find ${nm[who]}'s share.`,
          [`Sum of parts = ${a + b + c}; one part = ${M(V)} ÷ ${a + b + c} = ${M(u)}`, `${nm[who]} gets ${r} × ${M(u)} = **${M(r * u)}**`],
          `${M(V)} ÷ ${a + b + c} = ${M(u)} per part, then ×${r}.`,
          `Use the sum of all three terms (${a + b + c}) as the divisor.`));
      }
      const hi = Math.max(a, b, c), lo = Math.min(a, b, c), D = (hi - lo) * u;
      return mk(rng, M, V, [
        [D * (hi + lo), "Multiplied the difference by the sum of the two extreme terms"],
        [u * hi, "Gave only the largest share"],
        [D * (a + b + c) / hi, "Divided by the largest term instead of the difference"],
        [D + V / 2, "Added half the total to the difference"],
      ], finish(d, `A ${pot} is divided among ${nm[0]}, ${nm[1]} and ${nm[2]} in the ratio **${a} : ${b} : ${c}**. The difference between the largest and the smallest share is **${M(D)}**. What is the total amount?`,
        [`Difference in parts = ${hi} − ${lo} = ${hi - lo}, so one part = ${M(D)} ÷ ${hi - lo} = ${M(u)}`, `Total = ${a + b + c} × ${M(u)} = **${M(V)}**`],
        `Total = difference × (sum of terms) ÷ (difference in terms) = ${D} × ${a + b + c} ÷ ${hi - lo}.`,
        `The difference matches (${hi} − ${lo}) parts only, not all ${a + b + c} parts.`));
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      const x = rng.int(2, 6), y = rng.int(2, 8), z = rng.int(2, 9);
      if (new Set([x, y, z]).size < 3) return null;
      const l = QB.lcm(QB.lcm(x, y), z), pa = l / x, pb = l / y, pc = l / z, s = pa + pb + pc, g = QB.gcd(QB.gcd(pa, pb), pc);
      const V = rng.int(2, 30) * 100 * s / QB.gcd(s, 100);
      const who = rng.int(0, 2), part = [pa, pb, pc][who], ans = V * part / s;
      return mk(rng, M, ans, [
        [V * [x, y, z][who] / (x + y + z), "Used 1/" + x + " : 1/" + y + " : 1/" + z + " as if it were " + x + " : " + y + " : " + z],
        [V / 3, "Divided equally among the three"],
        [V * part / (s + g), "Added an extra part to the denominator"],
        [V - ans, "Gave what the other two receive"],
      ], finish(d, `A ${pot} of **${M(V)}** is divided among ${nm[0]}, ${nm[1]} and ${nm[2]} in the ratio **1/${x} : 1/${y} : 1/${z}**. How much does ${nm[who]} get?`,
        [`Multiply each fraction by the LCM ${l}: ${pa} : ${pb} : ${pc}`, `Sum = ${s}; ${nm[who]}'s share = ${part}/${s} × ${M(V)} = **${M(ans)}**`],
        `Clear the fractions with the LCM (${l}); then it is an ordinary ratio ${pa} : ${pb} : ${pc}.`,
        `A ratio of unit fractions is the REVERSE order of the denominators: the biggest denominator gets the smallest share.`));
    }
    if (k === 1) {
      const a = rng.int(2, 9), b = rng.int(2, 9), c = rng.int(2, 9), e = rng.int(2, 9);
      const A = a * c, B = b * c, Cc = b * e;           // A:B = a:b, B:C = c:e
      if (QB.gcd(a, b) !== 1 || QB.gcd(c, e) !== 1 || a === b || c === e) return null;
      const s = A + B + Cc, u = rng.int(2, 25) * 10, V = s * u;
      return mk(rng, M, B * u, [
        [V * b / (a + b + e), "Wrote the ratio as a : b : e without matching the middle term"],
        [A * u, "Gave the first person's share"],
        [Cc * u, "Gave the third person's share"],
        [V * c / (a + c + e), "Mixed up the terms when combining"],
      ], finish(d, `A ${pot} of **${M(V)}** is divided among ${nm[0]}, ${nm[1]} and ${nm[2]}. ${nm[0]}'s share to ${nm[1]}'s is **${a} : ${b}** and ${nm[1]}'s to ${nm[2]}'s is **${c} : ${e}**. Find ${nm[1]}'s share.`,
        [`Make ${nm[1]}'s term equal: ${a} : ${b} and ${c} : ${e} → ${a * c} : ${b * c} : ${b * e}`, `Sum = ${s}; ${nm[1]} = ${B}/${s} × ${M(V)} = **${M(B * u)}**`],
        `Multiply the first ratio by ${c} and the second by ${b} so the middle term is ${b * c}.`,
        `You cannot just write ${a} : ${b} : ${e}; the middle terms (${b} and ${c}) must be made equal first.`));
    }
    const a = rng.int(1, 8), b = rng.int(1, 8), c = rng.int(2, 9);
    if (new Set([a, b, c]).size < 3) return null;
    const u = rng.int(2, 60) * 100, S = c * u, ans = (a + b) * u;
    return mk(rng, M, ans, [
      [S * (a + b) / (a + b + c), "Used the total parts as the divisor"],
      [S, "Gave the third person's share"],
      [(a + b) * S / (a + b + c) * 2, "Doubled a wrong figure"],
      [S - (a + b), "Subtracted the ratio numbers from the share"],
    ], finish(d, `The ${pot} is divided among ${nm[0]}, ${nm[1]} and ${nm[2]} in the ratio **${a} : ${b} : ${c}**. If ${nm[2]} receives **${M(S)}**, what is the total received by ${nm[0]} and ${nm[1]} together?`,
      [`${c} parts = ${M(S)}, so 1 part = ${M(u)}`, `${nm[0]} + ${nm[1]} = (${a} + ${b}) × ${M(u)} = **${M(ans)}**`],
      `Find one part from the known share (${M(S)} ÷ ${c}), then multiply by ${a + b}.`,
      `The known share belongs to ${c} parts, not to all ${a + b + c} parts.`));
  }) });

  /* ------------------------------------------------------------------ 3. combining ratios */
  const THINGS = [["students in classes", "students"], ["marbles with", "marbles"], ["money (in ₹) with", "rupees"], ["books in libraries", "books"]];
  QB.gen("quant/ratio/combining-ratios", { title: "Combining ratios", gen: wrap((rng, d) => {
    const nm = names(rng, 4);
    if (d === "Easy") {
      const a = rng.int(1, 9), b = rng.int(1, 9), c = rng.int(1, 9), e = rng.int(1, 9);
      if (QB.gcd(a, b) !== 1 || QB.gcd(c, e) !== 1) return null;
      const ans = [a * c, b * e];
      if (QB.gcd(ans[0], ans[1]) === 1 && ans[0] === a && ans[1] === e) return null;
      return mk(rng, rt, ans, [
        [[a, e], "Dropped the middle ratio instead of linking through it"],
        [[a * e, b * c], "Crossed the terms the wrong way"],
        [[a + c, b + e], "Added the terms"],
        [[b * e, a * c], "Gave the ratio upside down"],
      ], finish(d, T(rng, [`If A : B = ${a} : ${b} and B : C = ${c} : ${e}, find **A : C**.`, `The ratio of A to B is **${a} : ${b}** and that of B to C is **${c} : ${e}**. What is A : C?`, `${nm[0]} : ${nm[1]} = **${a} : ${b}** and ${nm[1]} : ${nm[2]} = **${c} : ${e}**. Find ${nm[0]} : ${nm[2]}.`]),
        [`Make B equal: A : B = ${a * c} : ${b * c} and B : C = ${b * c} : ${b * e}`, `So A : C = ${a * c} : ${b * e} = **${rt(ans)}**`],
        `A : C = (a × c) : (b × e) = ${a * c} : ${b * e}.`,
        `B appears in both ratios with different values (${b} and ${c}); equalise it before linking.`), { ratio: true });
    }
    if (d === "Medium") {
      const a = rng.int(1, 9), b = rng.int(2, 9), c = rng.int(1, 9), e = rng.int(2, 9);
      if (QB.gcd(a, b) !== 1 || QB.gcd(c, e) !== 1) return null;
      const A = a * c, B = b * c, Cc = b * e, s = A + B + Cc, u = rng.int(2, 30) * 5, V = s * u;
      const [what, unit] = T(rng, THINGS), who = rng.int(0, 2);
      const part = [A, B, Cc][who];
      return mk(rng, N, part * u, [
        [V * [a, b, e][who] / (a + b + e), "Joined the ratios without equalising the middle term"],
        [V / 3, "Divided equally among the three"],
        [u, "Gave one part, not the share"],
        [V * [c, b, e][who] / (c + b + e), "Used the wrong terms from the second ratio"],
      ], finish(d, `The ${what} ${nm[0]}, ${nm[1]} and ${nm[2]} are in the ratio: ${nm[0]} : ${nm[1]} = **${a} : ${b}** and ${nm[1]} : ${nm[2]} = **${c} : ${e}**. Together there are **${N(V)}** ${unit}. How many does ${nm[who]} have?`,
        [`${nm[0]} : ${nm[1]} : ${nm[2]} = ${A} : ${B} : ${Cc} (middle made equal)`, `Sum = ${s}; ${nm[who]} = ${part}/${s} × ${N(V)} = **${N(part * u)}**`],
        `Scale the first ratio by ${c} and the second by ${b} so ${nm[1]} is ${B} in both.`,
        `The 3-part ratio is ${A} : ${B} : ${Cc}, not ${a} : ${b} : ${e}.`));
    }
    if (rng.chance(0.5)) {
      const r = [rng.int(1, 6), rng.int(2, 7), rng.int(2, 7), rng.int(2, 7)];   // A:B = r0:r1, B:C = r2:..., simple chain
      const a = rng.int(1, 5), b = rng.int(2, 6), c = rng.int(2, 6), e = rng.int(2, 6), f = rng.int(2, 6), g = rng.int(2, 6);
      // A:B = a:b, B:C = c:e, C:D = f:g
      if (QB.gcd(a, b) !== 1 || QB.gcd(c, e) !== 1 || QB.gcd(f, g) !== 1) return null;
      const A = a * c * f, B = b * c * f, Cc = b * e * f, D = b * e * g, s = A + B + Cc + D, u = rng.int(1, 12) * 5, V = s * u;
      return mk(rng, N, D * u, [
        [V * g / (a + b + e + g), "Strung the ratios together without equalising the linking terms"],
        [Cc * u, "Gave C's share instead of D's"],
        [V * g / (a + c + f + g), "Used the wrong terms from the ratios"],
        [V / 4, "Divided equally among the four"],
      ], finish(d, `A : B = **${a} : ${b}**, B : C = **${c} : ${e}** and C : D = **${f} : ${g}**. If A + B + C + D = **${N(V)}**, find D.`,
        [`Equalise the links: A : B : C : D = ${A} : ${B} : ${Cc} : ${D}`, `Sum = ${s}; D = ${D}/${s} × ${N(V)} = **${N(D * u)}**`],
        `Chain: multiply B-linked ratios step by step: ${A} : ${B} : ${Cc} : ${D}.`,
        `Each link (B, then C) has to be equalised in turn; one pass is not enough.`));
    }
    const a = rng.int(1, 8), b = rng.int(2, 9), c = rng.int(1, 9), e = rng.int(2, 9);
    if (QB.gcd(a, b) !== 1 || QB.gcd(c, e) !== 1) return null;
    const A = a * c, B = b * c, Cc = b * e, u = rng.int(2, 40) * 2, S = (A + Cc) * u;
    return mk(rng, N, B * u, [
      [S * b / (a + e), "Joined the ratios without equalising B"],
      [(A + Cc) * u, "Gave A + C itself"],
      [S * B / (A + B), "Compared B with A only"],
      [A * u, "Gave A's value"],
    ], finish(d, `A : B = **${a} : ${b}** and B : C = **${c} : ${e}**. If A + C = **${N(S)}**, find B.`,
      [`A : B : C = ${A} : ${B} : ${Cc}`, `A + C = ${A + Cc} parts = ${N(S)}, so 1 part = ${N(u)}`, `B = ${B} × ${N(u)} = **${N(B * u)}**`],
      `Combine to ${A} : ${B} : ${Cc}; then B = ${N(S)} × ${B}/${A + Cc}.`,
      `A + C is only ${A + Cc} of the ${A + B + Cc} parts, so B is not found by dividing by the full sum.`));
  }) });

  /* ------------------------------------------------------------------ 4. mean / third / fourth proportional */
  QB.gen("quant/ratio/mean-third-fourth-proportional", { title: "Mean / third / fourth proportional", gen: wrap((rng, d) => {
    const mean = () => { const u = rng.int(1, 12), p = rng.int(1, 9), q = rng.int(1, 9); if (p === q) return null; return { a: u * p * p, b: u * q * q, ans: u * p * q }; };
    const third = () => { const u = rng.int(1, 12), s = rng.int(1, 7), r = rng.int(1, 7); if (s === r) return null; return { a: u * s * s, b: u * s * r, ans: u * r * r }; };
    const fourth = () => { const u = rng.int(2, 15), v = rng.int(2, 15), p = rng.int(1, 9), q = rng.int(1, 9); if (p === q || u === v) return null; return { a: p * u, b: q * u, c: p * v, ans: q * v }; };
    if (d === "Easy") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const m = mean(); if (!m || m.a === m.b) return null;
        return mk(rng, N, m.ans, [
          [(m.a + m.b) / 2, "Took the arithmetic mean instead of the mean proportional"],
          [m.a * m.b, "Multiplied without taking the square root"],
          [m.b * m.b / m.a, "Found the third proportional instead"],
          [Math.abs(m.b - m.a), "Took the difference"],
        ], finish(d, T(rng, [`Find the mean proportional between **${m.a}** and **${m.b}**.`, `What is the mean proportional of **${m.a}** and **${m.b}**?`]),
          [`Mean proportional = √(${m.a} × ${m.b}) = √${m.a * m.b}`, `= **${m.ans}**`],
          `Mean proportional is the geometric mean: √(ab).`,
          `The mean proportional is √(ab), not (a + b)/2.`));
      }
      if (k === 1) {
        const t = third(); if (!t) return null;
        return mk(rng, N, t.ans, [
          [t.b * t.b / t.a / 2, "Halved the answer"],
          [t.a + (t.b - t.a) * 2, "Treated the terms as an arithmetic progression"],
          [t.a * t.b / t.b, "Gave the first term back"],
          [Math.sqrt(t.a * t.b), "Found the mean proportional instead"],
        ], finish(d, `Find the third proportional to **${t.a}** and **${t.b}**.`,
          [`a : b = b : c, so c = b²/a`, `c = ${t.b}² ÷ ${t.a} = ${t.b * t.b} ÷ ${t.a} = **${t.ans}**`],
          `Square the middle term, divide by the first: ${t.b}² ÷ ${t.a}.`,
          `Third proportional to a and b is b²/a, not a different formula like ab.`));
      }
      const f = fourth(); if (!f) return null;
      return mk(rng, N, f.ans, [
        [f.a * f.b / f.c, "Divided in the wrong pairing (a × b ÷ c)"],
        [f.a * f.c / f.b, "Used a × c ÷ b"],
        [f.b + f.c - f.a, "Added and subtracted instead of using the ratio"],
        [f.a * f.b * f.c, "Multiplied all three"],
      ], finish(d, `Find the fourth proportional to **${f.a}, ${f.b}, ${f.c}**.`,
        [`a : b = c : d, so d = (b × c)/a`, `d = ${f.b} × ${f.c} ÷ ${f.a} = **${f.ans}**`],
        `Cross-multiply: d = bc/a.`,
        `Keep the order: first : second = third : fourth.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const m = mean(); if (!m || m.a === m.b) return null;
        const x = rng.int(0, 1);
        return mk(rng, N, m.ans, [
          [(m.a + m.b) / 2, "Took the average instead of the geometric mean"],
          [m.a * m.b / 2, "Halved the product"],
          [m.a * m.b, "Left out the square root"],
          [Math.abs(m.b - m.a) / 2, "Halved the difference"],
        ], finish(d, x ? `If **${m.a}, x, ${m.b}** are in continued proportion, find x.` : `**x** is the mean proportional between **${m.a}** and **${m.b}**. Find x.`,
          [`${m.a} : x = x : ${m.b}, so x² = ${m.a} × ${m.b} = ${m.a * m.b}`, `x = **${m.ans}**`],
          `Continued proportion a, x, b means x² = ab.`,
          `The middle term is √(ab), not (a + b)/2.`));
      }
      if (k === 1) {
        const f = fourth(); if (!f) return null;
        const [n1, n2] = names(rng, 2), unit = T(rng, ["pens", "kg", "metres", "litres"]);
        return mk(rng, N, f.ans, [
          [f.a * f.b / f.c, "Inverted one ratio"],
          [f.a * f.c / f.b, "Paired the wrong terms"],
          [f.c + f.b - f.a, "Added the difference"],
          [f.b * f.b / f.a, "Treated it as a third proportional"],
        ], finish(d, `${f.a} : ${f.b} = ${f.c} : x. Find x. (Think of ${n1} buying ${f.a} ${unit} for ₹${f.b}, and ${n2} buying ${f.c} ${unit}.)`,
          [`x = ${f.b} × ${f.c} ÷ ${f.a}`, `x = **${f.ans}**`],
          `Cross-multiply: x = (second × third) ÷ first.`,
          `Product of means = product of extremes: ${f.b} × ${f.c} = ${f.a} × x.`));
      }
      const t = third(); if (!t) return null;
      return mk(rng, N, t.ans, [
        [t.b * t.b / t.a * 2, "Doubled the answer"],
        [t.a * t.b / t.a, "Gave the second term itself"],
        [t.b + (t.b - t.a), "Assumed an arithmetic progression"],
        [t.a * t.b, "Multiplied the terms"],
      ], finish(d, `**${t.a}, ${t.b}, x** are in continued proportion. Find x.`,
        [`${t.a} : ${t.b} = ${t.b} : x`, `x = ${t.b}² ÷ ${t.a} = **${t.ans}**`],
        `x = b²/a.`,
        `Continued proportion is a GEOMETRIC pattern (constant ratio), not constant difference.`));
    }
    const k = rng.int(0, 1);
    if (k === 0) {
      const u = rng.int(1, 8), s = rng.int(1, 3), r = rng.int(1, 5);
      if (s === r) return null;
      const a = u * s ** 3, b = u * s * s * r, dd = u * r ** 3;
      return mk(rng, N, dd, [
        [b * b / a, "Found only the third term"],
        [b * b * b / a, "Used b³/a instead of b³/a²"],
        [a * b * b / (a + b), "Mixed the formula"],
        [b + (b - a) * 2, "Assumed an arithmetic progression"],
      ], finish(d, `**${a}, ${b}, c, d** are in continued proportion (each term is the same multiple of the one before). Find d.`,
        [`Common ratio = ${b}/${a} = ${QB.frac(b, a)}`, `c = ${R(b * b / a)}, d = c × ${QB.frac(b, a)} = **${dd}**`],
        `d = b³/a² = ${b}³ ÷ ${a}² (the ratio times itself).`,
        `Four terms in continued proportion need the ratio applied three times.`));
    }
    const u = rng.int(1, 9), s = rng.int(1, 6), r = rng.int(1, 6), w = rng.int(1, 9);
    if (s === r) return null;
    const p = u * s * s, q = u * s * r, th = u * r * r, X = u * w * w, ans = u * r * w;
    return mk(rng, N, ans, [
      [Math.sqrt(p * q) * 0 + Math.sqrt(q * X), "Used the second term instead of the third proportional"],
      [(th + X) / 2, "Took the average instead of the geometric mean"],
      [th * X, "Left out the square root"],
      [Math.sqrt(p * X), "Used the first term instead of the third proportional"],
    ], finish(d, `Let T be the third proportional to **${p}** and **${q}**. Find the mean proportional between **T** and **${X}**.`,
      [`T = ${q}² ÷ ${p} = ${th}`, `Mean proportional = √(${th} × ${X}) = √${th * X} = **${ans}**`],
      `Third proportional = b²/a, then take the square root of the product.`,
      `Do the two steps in order: first T, then the mean proportional of T and ${X}.`));
  }) });

  /* ------------------------------------------------------------------ 5. coins and notes */
  QB.gen("quant/ratio/coins-and-notes", { title: "Coins & notes", gen: wrap((rng, d) => {
    const nm = names(rng, 1)[0], vessel = T(rng, ["a piggy bank", "a temple collection box", "a cash box", "a school donation box"]);
    if (d === "Easy") {
      const den = T(rng, [[1, 2], [2, 5], [5, 10], [1, 5], [10, 20], [20, 50], [50, 100]]), a = rng.int(1, 9), b = rng.int(1, 9);
      if (a === b || QB.gcd(a, b) !== 1) return null;
      const k = rng.int(2, 40), V = k * (a * den[0] + b * den[1]), which = rng.int(0, 1), cnt = [a, b][which] * k;
      const kind = den[1] >= 10 ? "notes" : "coins";
      return mk(rng, N, cnt, [
        [V / den[which], "Divided the total value by this denomination only"],
        [[a, b][which] * k * den[which], "Gave the value, not the number"],
        [k * (a + b), "Gave the total count"],
        [V / ([a, b][which] * den[which]), "Divided the total by the value of this part"],
      ], finish(d, `${vessel[0].toUpperCase() + vessel.slice(1)} holds ₹${den[0]} and ₹${den[1]} ${kind} in the ratio **${a} : ${b}**. The total value is **${M(V)}**. How many ₹${den[which]} ${kind} are there?`,
        [`Value per ${a + b} ${kind} (one block) = ${a} × ${den[0]} + ${b} × ${den[1]} = ₹${a * den[0] + b * den[1]}`, `Blocks = ${V} ÷ ${a * den[0] + b * den[1]} = ${k}`, `₹${den[which]} ${kind} = ${[a, b][which]} × ${k} = **${cnt}**`],
        `Value of one ratio block = ₹${a * den[0] + b * den[1]}; blocks = total ÷ that.`,
        `The ratio is of NUMBERS of ${kind}, not of their value, so weight each term by the denomination.`));
    }
    if (d === "Medium") {
      const dens = T(rng, [[1, 2, 5], [1, 5, 10], [2, 5, 10], [5, 10, 20], [10, 20, 50], [20, 50, 100]]);
      const a = rng.int(1, 9), b = rng.int(1, 9), c = rng.int(1, 9);
      if (new Set([a, b, c]).size < 3 || QB.gcd(QB.gcd(a, b), c) !== 1) return null;
      const per = a * dens[0] + b * dens[1] + c * dens[2], k = rng.int(2, 30), V = per * k, total = rng.chance(0.5);
      const kind = dens[1] >= 10 ? "notes" : "coins", w = rng.int(0, 2), cnt = [a, b, c][w] * k;
      return mk(rng, N, total ? (a + b + c) * k : cnt, total ? [
        [V / dens[0], "Assumed every piece is of the smallest denomination"],
        [V / (a + b + c), "Divided the value by the sum of ratio terms"],
        [per * k / dens[2], "Assumed every piece is of the largest denomination"],
        [(a + b + c) * k - k, "Dropped one block"],
      ] : [
        [cnt * dens[w], "Gave the value instead of the number"],
        [V / dens[w], "Divided the total value by this denomination only"],
        [(a + b + c) * k, "Gave the total number"],
        [[a, b, c][w] * per, "Multiplied the ratio term by the block value"],
      ], finish(d, `${nm} finds ₹${dens[0]}, ₹${dens[1]} and ₹${dens[2]} ${kind} in ${vessel} in the ratio **${a} : ${b} : ${c}**; their total value is **${M(V)}**. ${total ? `How many ${kind} are there in all?` : `How many ₹${dens[w]} ${kind} are there?`}`,
        [`One block = ${a}×${dens[0]} + ${b}×${dens[1]} + ${c}×${dens[2]} = ₹${per}`, `Blocks = ${V} ÷ ${per} = ${k}`, total ? `Total ${kind} = (${a} + ${b} + ${c}) × ${k} = **${(a + b + c) * k}**` : `₹${dens[w]} ${kind} = ${[a, b, c][w]} × ${k} = **${cnt}**`],
        `Find the value of one block (₹${per}); divide the total by it to get ${k}.`,
        `Value is count × denomination, so a ratio of counts needs weighting before dividing.`));
    }
    const k = rng.int(0, 1);
    if (k === 0) {
      const a = rng.int(1, 8), b = rng.int(1, 8), c = rng.int(1, 8), t = rng.int(1, 20);
      if (new Set([a, b, c]).size < 3) return null;
      const V = (a + b + c) * t, n1 = a * t, n2 = 2 * b * t, n3 = 4 * c * t;
      const which = rng.int(0, 2), cnt = [n1, n2, n3][which], dl = ["₹1", "50 paise", "25 paise"][which];
      return mk(rng, N, cnt, [
        [[a, b, c][which] * t, "Treated the value ratio as a count ratio"],
        [n1 + n2 + n3, "Gave the total number of coins"],
        [[a, b, c][which] * t * [1, 2, 4][which] * 2, "Doubled the correct count"],
        [V / [1, 0.5, 0.25][which] / 4, "Divided the total by the wrong denomination"],
      ], finish(d, `A bag contains ₹1, 50-paise and 25-paise coins. Their **values** are in the ratio **${a} : ${b} : ${c}** and the total value is **${M(V)}**. How many ${dl} coins are there?`,
        [`Values: ₹${a * t}, ₹${b * t}, ₹${c * t}`, `Counts: ${a * t} (₹1), ${b * t} ÷ 0.5 = ${n2} (50p), ${c * t} ÷ 0.25 = ${n3} (25p)`, `Number of ${dl} coins = **${cnt}**`],
        `Value ÷ denomination = count. ₹1 → ×1, 50p → ×2, 25p → ×4.`,
        `When the ratio is of VALUES, convert to numbers of coins by dividing by each coin's worth; the count ratio is ${n1} : ${n2} : ${n3}.`));
    }
    const dens = [50, 20, 10], a = rng.int(1, 9), b = rng.int(1, 9), c = rng.int(1, 9), kk = rng.int(2, 20);
    if (new Set([a, b, c]).size < 3 || QB.gcd(QB.gcd(a, b), c) !== 1) return null;
    const per = a * 50 + b * 20 + c * 10, V = per * kk, ans = b * 20 * kk;
    return mk(rng, M, ans, [
      [b * kk, "Gave the number of ₹20 notes, not their value"],
      [V * b / (a + b + c), "Shared the value in the count ratio"],
      [V / 3, "Divided the value equally among the three"],
      [ans + kk * 20, "Added one extra block's worth"],
    ], finish(d, `A cashier holds ₹50, ₹20 and ₹10 notes whose **numbers** are in the ratio **${a} : ${b} : ${c}**. The total value of all notes is **${M(V)}**. What is the total value of the ₹20 notes?`,
      [`One block = ${a}×50 + ${b}×20 + ${c}×10 = ₹${per}`, `Blocks = ${V} ÷ ${per} = ${kk}`, `₹20 notes: ${b * kk} notes × 20 = **${M(ans)}**`],
      `Value of ₹20 notes = (${b} × 20 ÷ ${per}) × ${V}.`,
      `Do not split the ${M(V)} in the ratio ${a} : ${b} : ${c}; that ratio is of numbers, not of values.`));
  }) });

  /* ------------------------------------------------------------------ 6. adding / removing to change a ratio */
  const GROUPS = [["boys", "girls", "students in a class"], ["men", "women", "employees at a firm"], ["red balls", "blue balls", "balls in a bag"], ["cows", "buffaloes", "animals on a farm"], ["fiction books", "non-fiction books", "books in a library"]];
  QB.gen("quant/ratio/adding-removing-to-change-a", { title: "Adding / removing to change a ratio", gen: wrap((rng, d) => {
    const g = T(rng, GROUPS);
    if (d === "Easy") {
      const a = rng.int(2, 15), b = rng.int(2, 20), x = rng.int(1, 12);
      if (a === b || QB.gcd(a, b) !== 1) return null;
      const na = a + x, nb = b + x, gg = QB.gcd(na, nb), c = na / gg, e = nb / gg;
      if (c === e || Math.max(c, e) > 15 || (c === a && e === b)) return null;
      return mk(rng, N, x, [
        [x * 2, "Doubled the number to add"],
        [Math.abs(b * c - a * e), "Gave the cross-product difference without dividing"],
        [Math.abs(b - a), "Gave the difference of the original terms"],
        [x + 1, "Made a small slip in the cross-multiplication"],
      ], finish(d, `What number must be added to both terms of the ratio **${a} : ${b}** to make it **${c} : ${e}**?`,
        [`(${a} + x)/(${b} + x) = ${c}/${e}`, `${e}(${a} + x) = ${c}(${b} + x) → ${e * a} + ${e}x = ${c * b} + ${c}x`, `x(${Math.abs(e - c)}) = ${Math.abs(c * b - e * a)} → x = **${x}**`],
        `Cross-multiply and collect x: x = (${c}×${b} − ${e}×${a}) ÷ (${e} − ${c}).`,
        `The same number x goes onto BOTH terms; the ratio does not simply scale.`));
    }
    if (d === "Medium") {
      const a = rng.int(2, 9), b = rng.int(2, 9), k = rng.int(2, 15), add = rng.int(1, 12) * 2;
      if (a === b || QB.gcd(a, b) !== 1) return null;
      const A = a * k, B = b * k, na = A, nb = B + add, gg = QB.gcd(na, nb), c = na / gg, e = nb / gg;
      if (c === a && e === b || Math.max(c, e) > 20) return null;
      const askTotal = rng.chance(0.5);
      return mk(rng, N, askTotal ? A + B : B, askTotal ? [
        [A + B + add, "Gave the total after adding"],
        [B, "Gave one of the groups, not the total"],
        [A, "Gave the other group"],
        [add * (a + b), "Multiplied the number added by the ratio sum"],
      ] : [
        [A, "Gave the other group"],
        [B + add, "Gave the new count, not the original"],
        [add * b, "Multiplied the number added by the ratio term"],
        [(A + B), "Gave the total"],
      ], finish(d, `In ${g[2]}, the number of ${g[0]} to ${g[1]} is **${a} : ${b}**. When **${add}** more ${g[1]} join, the ratio becomes **${c} : ${e}**. ${askTotal ? `How many are there originally in all?` : `How many ${g[1]} were there originally?`}`,
        [`Let ${g[0]} = ${a}k and ${g[1]} = ${b}k`, `${a}k : (${b}k + ${add}) = ${c} : ${e} → ${e * a}k = ${c * b}k + ${c * add}`, `k = ${k}; ${g[0]} = ${A}, ${g[1]} = ${B}${askTotal ? `, total = **${A + B}**` : ` → **${B}**`}`],
        `The unchanged group (${g[0]}) is ${a}k = ${A}; use it to find k from the new ratio.`,
        `Only ${g[1]} changed, so keep ${g[0]} = ${a}k and add ${add} to ${b}k alone.`));
    }
    const kind = rng.int(0, 1);
    if (kind === 0) {
      const a = rng.int(2, 9), b = rng.int(2, 9), k = rng.int(2, 12), x = rng.int(1, 15), y = rng.int(1, 15);
      if (a === b || QB.gcd(a, b) !== 1) return null;
      const A = a * k, B = b * k, na = A + x, nb = B - y;
      if (nb <= 0 || na <= 0) return null;
      const gg = QB.gcd(na, nb), c = na / gg, e = nb / gg;
      if (Math.max(c, e) > 20 || (c === a && e === b)) return null;
      return mk(rng, N, A + B, [
        [na + nb, "Gave the total after the change"],
        [A, "Gave only the first quantity"],
        [B, "Gave only the second quantity"],
        [(a + b) * (x + y), "Multiplied the ratio sum by the total change"],
      ], finish(d, `The ratio of ${g[0]} to ${g[1]} in ${g[2]} is **${a} : ${b}**. If **${x}** ${g[0]} are added and **${y}** ${g[1]} are removed, the ratio becomes **${c} : ${e}**. How many were there originally in all?`,
        [`(${a}k + ${x}) : (${b}k − ${y}) = ${c} : ${e}`, `${e}(${a}k + ${x}) = ${c}(${b}k − ${y}) → k(${Math.abs(e * a - c * b)}) = ${Math.abs(-c * y - e * x)} → k = ${k}`, `Original total = (${a} + ${b}) × ${k} = **${A + B}**`],
        `Set up with k, cross-multiply, solve for k, and finish with (${a} + ${b})k.`,
        `One group goes UP by ${x} and the other goes DOWN by ${y}; watch the signs when cross-multiplying.`));
    }
    const a = rng.int(2, 9), b = rng.int(2, 9), k = rng.int(3, 15), r = rng.int(1, 4);
    if (a === b || QB.gcd(a, b) !== 1) return null;
    const A = a * k, B = b * k, x = r * 2;
    const nb = B + x, na = A - x;
    if (na <= 0) return null;
    const gg = QB.gcd(na, nb), c = na / gg, e = nb / gg;
    if (Math.max(c, e) > 20 || (c === a && e === b)) return null;
    return mk(rng, N, A, [
      [B, "Gave the other quantity"],
      [na, "Gave the new count after the change"],
      [A + B, "Gave the total"],
      [(A - B) * 2, "Gave a multiple of the difference"],
    ], finish(d, `In ${g[2]}, the ratio of ${g[0]} to ${g[1]} is **${a} : ${b}**. After **${x}** ${g[0]} leave and **${x}** ${g[1]} join, the ratio becomes **${c} : ${e}**. How many ${g[0]} were there originally?`,
      [`(${a}k − ${x}) : (${b}k + ${x}) = ${c} : ${e}`, `${e}(${a}k − ${x}) = ${c}(${b}k + ${x}) → k = ${k}`, `${g[0][0].toUpperCase() + g[0].slice(1)} = ${a} × ${k} = **${A}**`],
      `Find k from the cross-multiplication, then multiply by ${a}.`,
      `Total stays the same here (${A + B}), which is a useful check on k.`));
  }) });

  /* ------------------------------------------------------------------ 7. income and expenditure ratios */
  QB.gen("quant/ratio/income-and-expenditure-ratios", { title: "Income & expenditure ratios", gen: wrap((rng, d) => {
    const [n1, n2] = names(rng, 2);
    if (d === "Easy") {
      const a = rng.int(2, 12), b = rng.int(1, a - 1);
      if (QB.gcd(a, b) !== 1) return null;
      const k = rng.int(2, 30) * T(rng, [100, 250, 500]), S = (a - b) * k, I1 = a * k, E = b * k;
      const askExp = rng.chance(0.4);
      return mk(rng, M, askExp ? E : I1, askExp ? [
        [I1, "Gave the income instead of the expenditure"],
        [S, "Gave the savings"],
        [S * b / a, "Used the wrong parts"],
        [S * b, "Multiplied the savings by the expenditure term"],
      ] : [
        [E, "Gave the expenditure instead of the income"],
        [S * a, "Multiplied the savings by the income term"],
        [S * a / b, "Divided by the expenditure term instead of the savings parts"],
        [S + I1 / 2, "Added half the income to the savings"],
      ], finish(d, `${n1}'s income and expenditure are in the ratio **${a} : ${b}**, and ${n1} saves **${M(S)}**. What is ${n1}'s ${askExp ? "expenditure" : "income"}?`,
        [`Savings = income − expenditure = ${a} − ${b} = ${a - b} parts = ${M(S)}`, `1 part = ${M(k)}; ${askExp ? `expenditure = ${b}` : `income = ${a}`} parts = **${M(askExp ? E : I1)}**`],
        `Savings are ${a - b} parts, so ${askExp ? "expenditure" : "income"} = ${M(S)} × ${askExp ? b : a} ÷ ${a - b}.`,
        `Savings correspond to the DIFFERENCE of the terms (${a} − ${b}), not to either term.`));
    }
    if (d === "Medium") {
      // equal savings: (a-b) k = (c-d) m
      const a = rng.int(2, 9), b = rng.int(2, 9), c = rng.int(2, 9), e = rng.int(2, 9);
      if (a === b || c === e || (a - b) * (c - e) <= 0) return null;
      const g = QB.gcd(Math.abs(a - b), Math.abs(c - e)), t = rng.int(1, 6) * 500;
      const k = Math.abs(c - e) / g * t, m = Math.abs(a - b) / g * t;
      const inc1 = a * k, inc2 = b * k, ex1 = c * m, ex2 = e * m, S = inc1 - ex1;
      if (S <= 0 || inc2 - ex2 !== S || a * k < c * m) return null;
      return mk(rng, M, inc1, [
        [inc2, "Gave the other person's income"],
        [ex1, "Gave the expenditure instead of the income"],
        [S, "Gave the savings"],
        [S * a / (a - b), "Used the savings over the income ratio difference only"],
      ], finish(d, `${n1} and ${n2} have incomes in the ratio **${a} : ${b}** and expenditures in the ratio **${c} : ${e}**. Each saves **${M(S)}**. What is ${n1}'s income?`,
        [`Incomes: ${a}k and ${b}k; expenditures: ${c}m and ${e}m`, `${a}k − ${c}m = ${b}k − ${e}m = ${S}`, `Solving: k = ${M(k)}, so ${n1}'s income = ${a}k = **${M(inc1)}**`],
        `Equal savings give (${a} − ${b})k = (${c} − ${e})m; then substitute into ${a}k − ${c}m = ${S}.`,
        `Equal savings do not mean equal income or equal expenditure; use two unknown multipliers.`));
    }
    const kind = rng.int(0, 1);
    if (kind === 0) {
      const a = rng.int(3, 12), b = rng.int(1, a - 1), p = T(rng, [10, 20, 25, 50]), q = T(rng, [5, 10, 20, 25]);
      if (QB.gcd(a, b) !== 1) return null;
      const k = rng.int(1, 12) * 500, I0 = a * k, E0 = b * k, I1 = I0 * (1 + p / 100), E1 = E0 * (1 + q / 100), S1 = I1 - E1;
      if (S1 <= 0 || !C(S1)) return null;
      return mk(rng, M, I0, [
        [S1, "Gave the new savings"],
        [S1 * a / (a - b), "Ignored the change in income and expenditure"],
        [I1, "Gave the new income"],
        [E0, "Gave the old expenditure"],
      ], finish(d, `${n1}'s income and expenditure are in the ratio **${a} : ${b}**. When the income rises by **${p}%** and the expenditure by **${q}%**, the savings become **${M(S1)}**. Find the original income.`,
        [`Income = ${a}k, expenditure = ${b}k`, `New savings = ${R(a * (1 + p / 100))}k − ${R(b * (1 + q / 100))}k = ${R(a * (1 + p / 100) - b * (1 + q / 100))}k = ${M(S1)}`, `k = ${M(k)}; original income = ${a}k = **${M(I0)}**`],
        `New savings = k(${a} × ${R(1 + p / 100)} − ${b} × ${R(1 + q / 100)}); solve for k and multiply by ${a}.`,
        `The two percentages are on DIFFERENT bases (income and expenditure), so apply each to its own term.`));
    }
    const a = rng.int(3, 12), b = rng.int(1, a - 1);
    if (QB.gcd(a, b) !== 1) return null;
    const k = rng.int(2, 20) * 500, I0 = a * k, E0 = b * k, p = T(rng, [10, 20, 25, 50, 40, 30]), I1 = I0 * (1 + p / 100);
    const S1 = I1 - E0;
    if (!C(S1) || !C(I1)) return null;
    const sp = (S1 - (I0 - E0)) / (I0 - E0) * 100;
    return mk(rng, (x) => QB.pct(x), sp, [
      [p, "Assumed the savings rise by the same percent as the income"],
      [p * a / b, "Used the ratio of the terms"],
      [(S1 - (I0 - E0)) / S1 * 100, "Divided the rise by the new savings"],
      [sp / 2, "Halved the correct figure"],
    ], finish(d, `${n1}'s income and expenditure are in the ratio **${a} : ${b}**. If the income rises by **${p}%** while the expenditure stays the same, by what percent do the savings increase?`,
      [`Take income = ${a}k, expenditure = ${b}k; old savings = ${a - b}k`, `New income = ${R(a * (1 + p / 100))}k; new savings = ${R(a * (1 + p / 100) - b)}k`, `Rise = ${R(a * p / 100)}k on ${a - b}k → **${QB.pct(R(sp))}**`],
      `Extra income all becomes extra savings: (${a} × ${p}%) ÷ (${a} − ${b}).`,
      `The base is the OLD savings (${a - b}k), which is smaller than the income, so the percent rise is bigger than ${p}%.`));
  }) });

  /* ------------------------------------------------------------------ 8. direct & inverse variation */
  QB.gen("quant/ratio/direct-and-inverse-variation", { title: "Direct & inverse variation", gen: wrap((rng, d) => {
    const [n1] = names(rng, 1);
    if (d === "Easy") {
      const direct = rng.chance(0.5);
      if (direct) {
        const [it, un] = T(rng, [["notebooks", "₹"], ["pencils", "₹"], ["oranges", "₹"], ["bottles of juice", "₹"], ["samosas", "₹"]]);
        const n = rng.int(2, 15), price = rng.int(2, 40) * n / QB.gcd(n, 2) , m = rng.int(2, 30);
        const ans = price * m / n;
        if (!C(ans) || m === n) return null;
        return mk(rng, M, ans, [
          [price * n / m, "Inverted the proportion"],
          [price + (m - n), "Added the difference in quantity to the price"],
          [price / n, "Gave the price of one only"],
          [price * (m - n), "Multiplied the price by the extra quantity"],
        ], finish(d, `${n} ${it} cost **${M(price)}**. At the same rate, what is the cost of **${m}** ${it}?`,
          [`Cost is directly proportional to quantity`, `Cost = ${M(price)} ÷ ${n} × ${m} = **${M(ans)}**`],
          `Unit rate = ${M(price / n)}; multiply by ${m}.`,
          `More items cost more, so multiply by ${m}/${n}, not ${n}/${m}.`));
      }
      const men = rng.int(2, 20), days = rng.int(2, 24), m2 = rng.int(2, 24), work = T(rng, ["build a wall", "dig a canal", "paint a hall", "harvest a field", "complete a survey"]);
      const ans = men * days / m2;
      if (!C(ans) || !I(ans) || m2 === men) return null;
      return mk(rng, N, ans, [
        [days * m2 / men, "Treated it as direct proportion"],
        [days + (men - m2), "Adjusted the days by the difference in workers"],
        [men * days, "Gave the total man-days"],
        [days * (men - m2) / men + days, "Used a wrong percentage change"],
      ], finish(d, `${men} workers can ${work} in **${days} days**. How many days will **${m2}** workers take, working at the same rate?`,
        [`Total work = ${men} × ${days} = ${men * days} man-days`, `Days = ${men * days} ÷ ${m2} = **${N(ans)}**`],
        `Workers × days is constant: ${men} × ${days} = ${m2} × x.`,
        `More workers means fewer days: this is inverse proportion.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const [it] = T(rng, [["a car", "km", "litres of petrol"], ["a bus", "km", "litres of diesel"]]);
        const L = rng.int(2, 15), dist = rng.int(5, 30) * L / QB.gcd(L, 5), L2 = rng.int(2, 25);
        const ans = dist * L2 / L;
        if (!I(ans) || L2 === L) return null;
        return mk(rng, N, ans, [
          [dist * L / L2, "Inverted the proportion"],
          [dist + (L2 - L), "Added the extra litres to the distance"],
          [dist / L, "Gave the distance per litre"],
          [dist * (L2 - L), "Multiplied by the extra litres"],
        ], finish(d, `${it === "a car" ? "A car" : "A bus"} travels **${N(dist)} km** on **${L} litres** of fuel. How far will it travel on **${L2} litres**?`,
          [`Distance ∝ fuel`, `Distance = ${N(dist)} ÷ ${L} × ${L2} = **${N(ans)} km**`],
          `Distance per litre = ${N(dist / L)}; multiply by ${L2}.`,
          `More fuel gives more distance, so the ratio is ${L2}/${L}.`));
      }
      if (k === 1) {
        const v1 = rng.int(3, 12) * 10, t1 = rng.int(2, 12), v2 = rng.int(3, 12) * 10;
        const ans = v1 * t1 / v2;
        if (!I(ans) || v1 === v2) return null;
        return mk(rng, N, ans, [
          [v2 * t1 / v1, "Treated speed and time as directly proportional"],
          [t1 * (v2 - v1) / v1 + t1, "Mis-applied a percentage change"],
          [t1 + (v1 - v2) / 10, "Shifted the time by a fraction of the speed difference"],
          [v1 * t1, "Gave the distance"],
        ], finish(d, `A train covers a fixed route in **${t1} hours** at **${v1} km/h**. How many hours will it take at **${v2} km/h**?`,
          [`Distance is fixed: ${v1} × ${t1} = ${v1 * t1} km`, `Time = ${v1 * t1} ÷ ${v2} = **${N(ans)} hours**`],
          `Speed × time is constant, so time = ${t1} × ${v1}/${v2}.`,
          `Faster speed means less time, so the time ratio is the REVERSE of the speed ratio.`));
      }
      const p = rng.int(2, 9), q = rng.int(2, 9), x = rng.int(2, 20) * p, y = x * q / p;
      const ans = x * 3;
      if (p === q) return null;
      return mk(rng, N, y * 3, [
        [x * 3 * p / q, "Inverted the ratio"],
        [y + 3, "Added 3 instead of multiplying by 3"],
        [y, "Gave the original y"],
        [y * 9, "Multiplied by 9"],
      ], finish(d, `y is directly proportional to x. When x = **${x}**, y = **${N(y)}**. Find y when x = **${x * 3}**.`,
        [`y/x is constant = ${N(y)}/${x} = ${QB.frac(y, x)}`, `y = ${QB.frac(y, x)} × ${x * 3} = **${N(y * 3)}**`],
        `Tripling x triples y.`,
        `Direct proportion keeps the RATIO y/x fixed, not the difference.`));
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      const m1 = rng.int(2, 10), d1 = rng.int(2, 12), h1 = rng.int(4, 10), w1 = m1 * d1 * h1 * rng.int(1, 5);
      const m2 = rng.int(2, 12), h2 = rng.int(4, 10), ans = w1 / m1 / d1 / h1 * m2 * h2 * rng.int(1, 1);
      // ask days for work W2
      const m3 = rng.int(2, 12), h3 = rng.int(4, 10), rate = w1 / (m1 * d1 * h1), d3 = rng.int(2, 12), w3 = rate * m3 * d3 * h3;
      if (!I(rate) || m3 === m1 || h3 === h1) return null;
      return mk(rng, N, d3, [
        [d3 * m3 * h3 / (m1 * h1) , "Used a mixed-up proportion"],
        [w3 * d1 * m1 * h1 / (w1 * m3 * h1), "Ignored the change in daily hours"],
        [w3 * d1 * m3 * h3 / (w1 * m1 * h1), "Put the workers and hours on the wrong side"],
        [d1 + (w3 / w1), "Added the ratio of work to the days"],
      ], finish(d, `${m1} workers working ${h1} hours a day finish **${N(w1)} units** of work in **${d1} days**. In how many days will ${m3} workers working ${h3} hours a day finish **${N(w3)} units**?`,
        [`Work ∝ workers × days × hours`, `${N(w1)} = k × ${m1} × ${d1} × ${h1} → k = ${rate}`, `Days = ${N(w3)} ÷ (${rate} × ${m3} × ${h3}) = **${d3}**`],
        `Days = ${d1} × (${N(w3)}/${N(w1)}) × (${m1}/${m3}) × (${h1}/${h3}).`,
        `Three factors vary: more work needs more days, but more workers or longer hours need fewer days.`));
    }
    if (k === 1) {
      const a = rng.int(2, 6), b = rng.int(1, 5), mult = rng.int(2, 6);
      if (a === b) return null;
      const x1 = rng.int(2, 6) * 2, y1 = rng.int(2, 6) * 2, z1 = rng.int(1, 5) * 12, x2 = x1 * 3, y2 = y1 * 2;
      // z varies directly as x and inversely as y: z2 = z1 * (x2/x1) * (y1/y2)
      const z2 = z1 * (x2 / x1) * (y1 / y2);
      return mk(rng, N, z2, [
        [z1 * (x2 / x1) * (y2 / y1), "Treated z as directly proportional to y"],
        [z1 * (x1 / x2) * (y1 / y2), "Treated z as inversely proportional to x"],
        [z1 * (x2 / x1), "Ignored the change in y"],
        [z1 * (x1 / x2) * (y2 / y1), "Reversed both variations"],
      ], finish(d, `z varies directly as **x** and inversely as **y**. When x = ${x1} and y = ${y1}, z = **${z1}**. Find z when x = ${x2} and y = ${y2}.`,
        [`z = kx/y, so z₂ = z₁ × (x₂/x₁) × (y₁/y₂)`, `= ${z1} × ${x2 / x1} × ${y1}/${y2} = **${N(z2)}**`],
        `Multiply by x-factor ${x2 / x1} (direct) and by ${y1}/${y2} (inverse).`,
        `Direct variables go on top, inverse variables go upside down.`));
    }
    const w = rng.int(2, 12) * 2, p1 = rng.int(1, 5) * 100, p3 = rng.chance(0.5) ? 2 : 3;
    // price of a round pizza proportional to the square of the diameter
    const d1 = rng.int(2, 6) * 5, p0 = rng.int(1, 9) * 100, d2 = d1 * p3, price = p0 * p3 * p3;
    const what = T(rng, ["pizza", "circular cake", "round steel plate"]);
    return mk(rng, M, price, [
      [p0 * p3, "Assumed the price is directly proportional to the diameter"],
      [p0 * p3 * p3 * p3, "Cubed the diameter ratio"],
      [p0 + (d2 - d1) * 10, "Added a rate per cm"],
      [p0 * Math.sqrt(p3), "Took the square root of the ratio"],
    ], finish(d, `The price of a ${what} is proportional to the **square of its diameter**. A ${d1} cm one costs **${M(p0)}**. What is the price of a **${d2} cm** one?`,
      [`Price ∝ diameter², so price ratio = (${d2}/${d1})² = ${p3}² = ${p3 * p3}`, `Price = ${M(p0)} × ${p3 * p3} = **${M(price)}**`],
      `Diameter ×${p3} means price ×${p3 * p3}.`,
      `A square law: doubling the diameter quadruples the price, it does not double it.`));
  }) });
})();
