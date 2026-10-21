/* =====================================================================
   Algebra: generators for linear equations, word problems -> equations
   and quadratics (roots, sum / product). Answers are built forward from
   chosen integer solutions so every key is clean; wrong options are
   sign slips, skipped steps and swapped quantities, each with a "why".
   ===================================================================== */
(function () {
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 40, Medium: 70, Hard: 105 };
  const R = (x) => QB.round(x, 2);
  const C = (x) => isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const sN = (x) => (x < 0 ? "−" + QB.num(R(-x)) : QB.num(R(x)));
  const sg = (x) => (x < 0 ? "−" : "+");
  // "+ 5" / "− 5" tail for an equation
  const tail = (b) => (b === 0 ? "" : ` ${sg(b)} ${Math.abs(b)}`);
  const coef = (a, v) => (a === 1 ? v : a === -1 ? "−" + v : a + v);

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("algebra: no clean question found");
    };
  }
  // ans, wrongs [[v, why]], f = formatter; body = {q, sol, short, trap}
  function mk(rng, d, f, ans, wrongs, body) {
    if (!C(ans)) return null;
    const A = f(ans), seen = new Set([A.toLowerCase()]), pairs = [[A, null]];
    const fb = [[ans + 1, "A small arithmetic slip"], [ans - 1, "A small arithmetic slip"], [ans + 2, "A small arithmetic slip"], [ans - 2, "A small arithmetic slip"], [ans * 2, "Doubled the correct value"]];
    for (const w of wrongs.concat(fb)) {
      if (pairs.length === 4) break;
      if (!isFinite(w[0]) || !C(w[0])) continue;
      const t = f(R(w[0]));
      if (seen.has(t.toLowerCase())) continue;
      seen.add(t.toLowerCase());
      pairs.push([t, w[1]]);
    }
    if (pairs.length < 4) return null;
    const o = QB.options(rng, pairs);
    if (body.sol) body.sol = body.sol.map((l) => l.replace(/(^|[\s(=])-(?=\d)/g, "$1−"));
    return Object.assign({ d, time: TIME[d] }, body, o, { calc: String(R(ans)) });
  }

  /* ------------------------------------------------------------------ 1. linear equations */
  QB.gen("quant/algebra/linear-equations", { title: "Linear equations", gen: wrap((rng, d) => {
    const lead = () => T(rng, ["Solve for x:", "Find x if", "Find the value of x:", "If", "What is x in the equation"]);
    const wrapQ = (eq) => { const l = lead(); return l === "If" ? `If **${eq}**, what is x?` : `${l} **${eq}**${l.endsWith("equation") ? "?" : ""}`; };
    if (d === "Easy") {
      const x = rng.int(2, 25), a = rng.int(2, 9), b = rng.int(-20, 25);
      if (b === 0) return null;
      const c = a * x + b; if (c <= 0) return null;
      return mk(rng, d, sN, x, [
        [(c + b) / a, `Moved ${b > 0 ? "+" : "−"}${Math.abs(b)} across without changing its sign`],
        [c - b, `Subtracted ${Math.abs(b)} but forgot to divide by ${a}`],
        [(c - b) * a, `Multiplied by ${a} instead of dividing`],
        [(c - b) / (a + 1), "Divided by the wrong coefficient"],
      ], {
        q: wrapQ(`${a}x${tail(b)} = ${c}`),
        sol: [`${a}x${tail(b)} = ${c}`, `${a}x = ${c} ${b > 0 ? "−" : "+"} ${Math.abs(b)} = ${c - b}`, `x = ${c - b} ÷ ${a} = **${x}**`],
        short: `Undo the ${b > 0 ? "addition" : "subtraction"} first, then divide by ${a}. Check by putting x = ${x} back.`,
        trap: `When ${Math.abs(b)} crosses the equals sign its sign flips.`,
      });
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const x = rng.int(2, 20), a = rng.int(3, 12), c = rng.int(1, a - 1), b = rng.int(-15, 15), dd = (a - c) * x + b;
        if (dd === 0 || b === 0) return null;
        return mk(rng, d, sN, x, [
          [(dd + b) / (a - c), "Moved a constant across without flipping its sign"],
          [(dd - b) / (a + c), "Added the x-coefficients instead of subtracting"],
          [(b - dd) / (a - c), "Reversed the sign of the answer"],
          [(dd - b) / a, "Forgot to collect the x-terms on one side"],
        ], {
          q: wrapQ(`${a}x${tail(b)} = ${c}x${tail(dd)}`),
          sol: [`Collect x-terms on the left: ${a}x − ${c}x = ${dd} ${b > 0 ? "−" : "+"} ${Math.abs(b)}`, `${a - c}x = ${dd - b}`, `x = **${x}**`],
          short: "x-terms to one side, numbers to the other; every term that crosses flips its sign.",
          trap: `The x-terms are subtracted (${a}x − ${c}x), not added.`,
        });
      }
      if (k === 1) {
        const x = rng.int(2, 15), a = rng.int(2, 7), b = rng.int(1, 9) * (rng.chance(0.5) ? 1 : -1), c = a * (x + b); if (c <= 0) return null;
        return mk(rng, d, sN, x, [
          [c / a + b, `Added ${b} instead of removing it`],
          [c - b, "Forgot to divide by the multiplier"],
          [c / a, "Ignored the bracket constant"],
          [c - a * b, `Subtracted ${a}×${b} but did not divide by ${a}`],
        ], {
          q: wrapQ(`${a}(x ${sg(b)} ${Math.abs(b)}) = ${c}`),
          sol: [`Divide both sides by ${a}: x ${sg(b)} ${Math.abs(b)} = ${c / a}`, `x = ${c / a} ${b > 0 ? "−" : "+"} ${Math.abs(b)} = **${x}**`],
          short: `If the bracket multiplies cleanly, divide first: ${c} ÷ ${a} = ${c / a}.`,
          trap: "Remember to apply the multiplier to both terms in the bracket if you expand.",
        });
      }
      const p = T(rng, [2, 3, 4, 5, 6]), q = T(rng, [3, 4, 5, 6, 8, 9, 10]); if (p === q) return null;
      const L = QB.lcm(p, q), x = L * rng.int(1, 4), r = x / p + x / q;
      return mk(rng, d, sN, x, [
        [r * p * q, "Multiplied r by both denominators and never divided by their sum"],
        [r * (p + q), "Added the denominators but multiplied instead of dividing"],
        [(r * p * q) / (p + q) + L, "Cleared fractions with a wrong common multiple"],
        [r * L, "Multiplied r by the LCM instead of solving"],
      ], {
        q: wrapQ(`x/${p} + x/${q} = ${r}`),
        sol: [`Multiply by the LCM ${L}: ${L / p}x + ${L / q}x = ${r * L}`, `${L / p + L / q}x = ${r * L}, so x = **${x}**`],
        short: `Combine: x(1/${p} + 1/${q}) = x·${L / p + L / q}/${L}. Then x = r × ${L} ÷ ${L / p + L / q}.`,
        trap: "Never add denominators: 1/p + 1/q is not 1/(p+q).",
      });
    }
    // Hard
    const k = rng.int(0, 2);
    if (k === 0) {
      const x = rng.int(1, 12), y = rng.int(1, 12), a1 = rng.int(1, 6), b1 = rng.int(1, 6), a2 = rng.int(1, 6), b2 = rng.int(1, 6);
      if (a1 * b2 - a2 * b1 === 0 || x === y) return null;
      const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
      const ask = T(rng, ["x", "y", "x + y", "x − y"]);
      const val = { x, y, "x + y": x + y, "x − y": x - y }[ask];
      return mk(rng, d, sN, val, [
        [{ x: y, y: x, "x + y": x + y + 1, "x − y": y - x }[ask], ask === "x − y" ? "Subtracted in the wrong order" : "Swapped the values of x and y"],
        [{ x: x + 1, y: y + 1, "x + y": x * y, "x − y": x + y }[ask], ask === "x + y" ? "Multiplied instead of adding" : "Slipped in the elimination step"],
        [{ x: -x, y: -y, "x + y": x - y, "x − y": x + y }[ask], "Mixed up the sign or operation"],
        [{ x: c1 - y, y: c2 - x, "x + y": c1 + c2, "x − y": c1 - c2 }[ask], "Used an equation's right side instead of solving"],
      ], {
        q: `If **${coef(a1, "x")} + ${coef(b1, "y")} = ${c1}** and **${coef(a2, "x")} + ${coef(b2, "y")} = ${c2}**, find the value of **${ask}**.`,
        sol: [`Eliminate one variable: multiply so the y-coefficients (or x-coefficients) match, then subtract.`, `This gives x = ${x} and y = ${y}.`, `So ${ask} = **${val}**.`],
        short: "Multiply the equations to equalise one coefficient, subtract, back-substitute, then check in the other equation.",
        trap: "Check which quantity is asked: the question wants " + ask + ", not necessarily x.",
      });
    }
    if (k === 1) {
      const x = rng.int(2, 15), a = rng.int(1, 6), c = rng.int(1, 5), dd = rng.int(c + 1, 9);
      const num = (x + a) * dd;
      if (num % c !== 0) return null;
      const b = num / c - x; if (b <= 0 || b === a) return null;
      return mk(rng, d, sN, x, [
        [(c * b - dd * a) / (dd - c) + 1, "Slipped by one in the cross-multiplication"],
        [(dd * b - c * a) / (c - dd), "Cross-multiplied the wrong way round"],
        [(c * a + dd * b) / (dd + c), "Added instead of subtracting x-terms"],
        [(a * dd) / c, "Cancelled x terms wrongly"],
      ], {
        q: `Solve: **(x + ${a}) / (x + ${b}) = ${c} / ${dd}**`,
        sol: [`Cross-multiply: ${dd}(x + ${a}) = ${c}(x + ${b})`, `${dd}x + ${dd * a} = ${c}x + ${c * b}`, `${dd - c}x = ${c * b - dd * a}, so x = **${x}**`],
        short: "Cross-multiply, collect x-terms on one side, and check by substituting.",
        trap: "Do not cancel the x's across the fraction: (x + a)/(x + b) does not simplify.",
      });
    }
    const p = T(rng, [2, 3, 4, 5]), q = T(rng, [3, 4, 5, 6, 7]), x = rng.int(3, 20), a = rng.int(1, 9);
    if (p === q) return null;
    const lhs = (x + a) / p, rhs = (x - a) / q;
    const m = x * 0 + QB.lcm(p, q);
    const diff = lhs - rhs; if (!C(diff)) return null;
    // choose difference to be integer, equation: (x+a)/p - (x-a)/q = diff
    if (!Number.isInteger(diff)) return null;
    return mk(rng, d, sN, x, [
      [(diff * m - a * (m / p) - a * (m / q)) / (m / p - m / q), "Treated −(x − a) as −x − a"],
      [(diff * p * q) / (q - p), "Multiplied by pq but dropped the a-terms"],
      [x + a, "Stopped after clearing one denominator"],
      [x - a, "Reversed the sign of a"],
    ], {
      q: `Solve for x: **(x + ${a})/${p} − (x − ${a})/${q} = ${diff}**`,
      sol: [`Multiply by ${m}: ${m / p}(x + ${a}) − ${m / q}(x − ${a}) = ${diff * m}`, `${m / p - m / q}x + ${a * (m / p + m / q)} = ${diff * m}`, `x = (${diff * m} − ${a * (m / p + m / q)}) ÷ ${m / p - m / q} = **${x}**`],
      short: "Clear both denominators with the LCM; the minus sign hits every term of the second bracket.",
      trap: `−(x − ${a}) becomes −x + ${a}; the sign on the ${a} flips.`,
    });
  }) });

  /* ------------------------------------------------------------------ 2. word problems -> equations */
  const NAMES = ["Ravi", "Meena", "Arjun", "Sneha", "Karthik", "Divya", "Imran", "Pooja", "Suresh", "Anita", "Vikram", "Nisha"];
  QB.gen("quant/algebra/word-problems-equations", { title: "Word problems → equations", gen: wrap((rng, d) => {
    const n1 = T(rng, NAMES); let n2 = T(rng, NAMES); if (n2 === n1) return null;
    if (d === "Easy") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const x = rng.int(3, 30), a = rng.int(2, 6), b = rng.int(2, 25), r = a * x + b;
        const word = { 2: "doubles it", 3: "triples it", 4: "multiplies it by 4", 5: "multiplies it by 5", 6: "multiplies it by 6" }[a];
        return mk(rng, d, sN, x, [
          [(r + b) / a, "Added the number instead of subtracting it when undoing"],
          [r - b, "Forgot to divide by the multiplier"],
          [(r - b) * a, "Multiplied instead of dividing"],
          [r / (a + 1) - b, "Wrong order of undoing operations"],
        ], {
          q: `${n1} thinks of a number, ${word}, and then adds **${b}**. The result is **${r}**. What was the number?`,
          sol: [`Let the number be x: ${a}x + ${b} = ${r}`, `${a}x = ${r - b}, so x = **${x}**`],
          short: "Undo the steps in reverse order: subtract the add-on, then divide.",
          trap: "Undo the last operation first.",
        });
      }
      if (k === 1) {
        const big = rng.int(20, 80), small = rng.int(5, big - 8), S = big + small, D = big - small;
        const ask = rng.chance(0.5) ? "larger" : "smaller", v = ask === "larger" ? big : small;
        return mk(rng, d, sN, v, [
          [ask === "larger" ? small : big, "Gave the other number"],
          [S / 2, "Took the average of the two numbers"],
          [D, "Gave the difference instead"],
          [ask === "larger" ? big + 1 : small + 1, "Slipped by one"],
        ], {
          q: `The sum of two numbers is **${S}** and their difference is **${D}**. Find the ${ask} number.`,
          sol: [`Larger = (sum + difference) ÷ 2 = (${S} + ${D}) ÷ 2 = ${big}`, `Smaller = (sum − difference) ÷ 2 = ${small}`, `The ${ask} number is **${v}**.`],
          short: "Larger = (S + D)/2; smaller = (S − D)/2.",
          trap: "The average of the two numbers is S/2, which is neither of them (unless D = 0).",
        });
      }
      const p = rng.int(5, 20), cnt = rng.int(3, 15), tot = rng.int(1, 4) * 50 + p * cnt, xx = cnt;
      return mk(rng, d, sN, xx, [
        [tot / p, "Ignored the fixed charge"],
        [(tot + 50) / p, "Added the fixed charge instead of removing it"],
        [tot - p, "Subtracted the unit price from the total"],
        [(tot - p * 2) / p, "Removed the unit price twice"],
      ].filter(() => true), (() => { const fx = tot - p * cnt; return {
        q: `${n1} pays **₹${tot}** at a stall: a fixed entry fee of **₹${fx}** plus **₹${p}** per game played. How many games did ${n1} play?`,
        sol: [`Let the number of games be x: ${fx} + ${p}x = ${tot}`, `${p}x = ${tot - fx} = ${p * cnt}, so x = **${cnt}**`],
        short: "Subtract the fixed part first, then divide by the unit price.",
        trap: "The entry fee is paid once, not per game.",
      }; })());
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const cnt = T(rng, [3, 4, 5]), x = rng.int(5, 60), sum = cnt * x + (cnt * (cnt - 1)) / 2;
        const ask = T(rng, ["smallest", "largest"]);
        const v = ask === "smallest" ? x : x + cnt - 1;
        return mk(rng, d, sN, v, [
          [ask === "smallest" ? x + cnt - 1 : x, "Gave the other end of the run"],
          [Math.round(sum / cnt), "Gave the middle value (average)"],
          [ask === "smallest" ? x - 1 : x + cnt, "Off by one at the end"],
          [sum - (cnt * (cnt - 1)) / 2 - x * (cnt - 1), "Slipped in the sum of offsets"],
        ], {
          q: `The sum of **${cnt}** consecutive integers is **${sum}**. What is the ${ask} of them?`,
          sol: [`Let the integers be x, x + 1, ..., x + ${cnt - 1}: sum = ${cnt}x + ${(cnt * (cnt - 1)) / 2} = ${sum}`, `x = ${x}, and the largest is ${x + cnt - 1}.`, `The ${ask} is **${v}**.`],
          short: `The mean (${sum}/${cnt}) is the middle term; step out from it.`,
          trap: "The mean is not the smallest or the largest term unless there is only one number.",
        });
      }
      if (k === 1) {
        const s = rng.int(6, 20), m = T(rng, [3, 4, 5]), n = rng.int(3, 10), f = m * s;
        const S = f + s;
        const ask = T(rng, ["son", "father"]);
        const v = ask === "son" ? s : f;
        return mk(rng, d, sN, v, [
          [ask === "son" ? f : s, "Gave the other person's age"],
          [ask === "son" ? S / 2 : S / 2 + s, "Split the total equally"],
          [ask === "son" ? s + n : f + n, "Gave the age after some years"],
          [ask === "son" ? S - m : S - s - 1, "Subtracted the multiple instead of the sum parts"],
        ].filter((w) => w[0] !== v), {
          q: `${n1}'s age is **${m}** times the age of ${n1}'s son. Together their ages add up to **${S}** years. What is the ${ask}'s present age?`,
          sol: [`Let the son be x: father = ${m}x, so ${m}x + x = ${S}`, `${m + 1}x = ${S}, so son = ${s} and father = ${f}`, `The ${ask}'s age is **${v}**.`],
          short: `Share the total in ratio ${m} : 1; one part = ${S} ÷ ${m + 1}.`,
          trap: "The ages add to the total; the father's age is the multiple, not the total.",
        });
      }
      const b = rng.int(5, 30), more = rng.int(2, 12), P = 2 * (2 * b + more);
      const ask = T(rng, ["length", "breadth"]);
      const v = ask === "length" ? b + more : b;
      return mk(rng, d, sN, v, [
        [ask === "length" ? b : b + more, "Gave the other side"],
        [P / 4, "Treated the shape as a square"],
        [ask === "length" ? P / 2 - b : P / 2 - b - more, "Used the semi-perimeter incorrectly"],
        [ask === "length" ? b + 2 * more : b - more, "Applied the extra length twice"],
      ], {
        q: `The perimeter of a rectangular plot is **${P} m**. Its length is **${more} m** more than its breadth. Find the ${ask} of the plot, in metres.`,
        sol: [`Let breadth = x, length = x + ${more}: 2(x + x + ${more}) = ${P}`, `2x + ${more} = ${P / 2}, so breadth = ${b} and length = ${b + more}`, `The ${ask} is **${v}** m.`],
        short: "Half the perimeter is length + breadth: subtract the extra, halve what is left.",
        trap: "Perimeter counts all four sides, so half of it is length + breadth, not one side.",
      });
    }
    // Hard
    const k = rng.int(0, 2);
    if (k === 0) {
      const a = rng.int(2, 9) * 10, b = a + rng.int(2, 7) * 10, cnt = rng.int(20, 90), x = rng.int(5, cnt - 5);
      const tot = a * x + b * (cnt - x);
      const ask = rng.chance(0.5) ? "cheaper" : "dearer";
      const v = ask === "cheaper" ? x : cnt - x;
      return mk(rng, d, sN, v, [
        [ask === "cheaper" ? cnt - x : x, "Gave the count of the other kind"],
        [Math.round(tot / ((a + b) / 2)), "Used the simple average price for all tickets"],
        [ask === "cheaper" ? x + 1 : cnt - x + 1, "Slipped by one"],
        [ask === "cheaper" ? (tot - a * cnt) / (b - a) : (b * cnt - tot) / (b - a) + 1, "Wrong direction in the price gap"],
      ], {
        q: `A theatre sold **${cnt}** tickets for a total of **₹${QB.num(tot)}**. Some tickets cost **₹${a}** and the rest cost **₹${b}**. How many ${ask} (₹${ask === "cheaper" ? a : b}) tickets were sold?`,
        sol: [`Let ₹${a} tickets = x, so ₹${b} tickets = ${cnt} − x: ${a}x + ${b}(${cnt} − x) = ${tot}`, `${b * cnt} − ${b - a}x = ${tot}, so x = ${x}`, `Cheaper = ${x}, dearer = ${cnt - x}; answer **${v}**.`],
        short: `If all were ₹${a}: total ${a * cnt}; the excess ${tot - a * cnt} ÷ ${b - a} = number of dearer tickets.`,
        trap: "Do not use the average of the two prices unless the counts are equal.",
      });
    }
    if (k === 1) {
      const s = rng.int(6, 18), n = rng.int(2, 8), kk = T(rng, [3, 4, 5, 6]), f = kk * s;
      const m = (f + n) / (s + n);
      if (!Number.isInteger(m) || m >= kk || m < 2) return null;
      return mk(rng, d, sN, s, [
        [f, "Gave the father's age"],
        [s + n, "Gave the son's age after the years"],
        [(f + n) / m, "Divided without removing the years first"],
        [Math.round((kk * n - m * n) / (kk - m)) + 1, "Slipped in solving"],
      ], {
        q: `${n1}'s age is **${kk}** times the age of ${n1}'s son. After **${n}** years it will be **${m}** times the son's age. Find the son's present age.`,
        sol: [`Son = x, father = ${kk}x. After ${n} years: ${kk}x + ${n} = ${m}(x + ${n})`, `${kk - m}x = ${m * n - n} = ${(m - 1) * n}`, `x = **${s}**`],
        short: "Set up the second statement with +n on both ages; the difference of the multipliers divides the extra.",
        trap: "The multiple applies to the ages after the years, not to today's ages.",
      });
    }
    const c = rng.int(5, 20) * 10, bm = T(rng, [2, 3, 4]), ex = rng.int(1, 6) * 20;
    const bb = bm * c, aa = bb + ex, tot = aa + bb + c;
    const n3 = T(rng, NAMES); if (n3 === n1 || n3 === n2) return null;
    const who = T(rng, ["first", "second", "third"]);
    const val = { first: aa, second: bb, third: c }[who];
    return mk(rng, d, sN, val, [
      [{ first: bb, second: aa, third: bb }[who], "Gave a different person's share"],
      [Math.round(tot / 3), "Split the total equally"],
      [{ first: aa - ex, second: bb + ex, third: c + ex }[who], "Applied the extra amount to the wrong person"],
      [{ first: tot - bb - c - ex, second: (tot - ex) / (bm + 1), third: (tot - ex) / (2 * bm + 1) }[who], "Left out the extra amount from the equation"],
    ], {
      q: `Three friends share **₹${QB.num(tot)}**. ${n1} gets **₹${ex}** more than ${n2}, and ${n2} gets **${bm}** times what ${n3} gets. How much does ${who === "first" ? n1 : who === "second" ? n2 : n3} get, in rupees?`,
      sol: [`${n3} = x, ${n2} = ${bm}x, ${n1} = ${bm}x + ${ex}`, `Total: x + ${bm}x + ${bm}x + ${ex} = ${tot}, so ${2 * bm + 1}x = ${tot - ex}, x = ${c}`, `${n3} ₹${c}, ${n2} ₹${bb}, ${n1} ₹${aa}; answer **${val}**.`],
      short: "Call the smallest share x, express the others in x, add them and equate to the total.",
      trap: "The extra ₹ is added to ONE share only; subtract it before dividing by the number of x's.",
    });
  }) });

  /* ------------------------------------------------------------------ 3. quadratics */
  function poly(a, b, c) {
    let s = a === 1 ? "x²" : a === -1 ? "−x²" : a + "x²";
    if (b) s += ` ${sg(b)} ${Math.abs(b) === 1 ? "" : Math.abs(b)}x`;
    if (c) s += ` ${sg(c)} ${Math.abs(c)}`;
    return s + " = 0";
  }
  QB.gen("quant/algebra/quadratics", { title: "Quadratics (roots, sum / product)", gen: wrap((rng, d) => {
    if (d === "Easy") {
      const p = rng.int(1, 16), q = rng.int(1, 16); if (p === q) return null;
      const lo = Math.min(p, q), hi = Math.max(p, q);
      const ask = T(rng, ["larger", "smaller"]); const v = ask === "larger" ? hi : lo;
      const neg = rng.chance(0.4);
      const [r1, r2] = neg ? [-p, -q] : [p, q];
      const S = r1 + r2, Pd = r1 * r2;
      const roots = [r1, r2].sort((x, y) => x - y), vv = ask === "larger" ? roots[1] : roots[0];
      return mk(rng, d, sN, vv, [
        [-vv, "Took the root with the wrong sign"],
        [ask === "larger" ? roots[0] : roots[1], "Gave the other root"],
        [S, "Gave the sum of the roots"],
        [Pd, "Gave the product of the roots"],
      ], {
        q: T(rng, [`Find the ${ask} root of **${poly(1, -S, Pd)}**.`, `What is the ${ask} of the two roots of **${poly(1, -S, Pd)}**?`, `The equation **${poly(1, -S, Pd)}** has two real roots. Which is the ${ask} one?`]),
        sol: [`Find two numbers with sum ${S} and product ${Pd}: ${r1} and ${r2}`, `So (x ${sg(-r1)} ${Math.abs(r1)})(x ${sg(-r2)} ${Math.abs(r2)}) = 0, roots ${r1} and ${r2}`, `The ${ask} root is **${vv}**.`],
        short: "Look for two numbers that add to −b and multiply to c; the roots are those numbers.",
        trap: "A factor (x − 3) gives root +3, not −3.",
      });
    }
    if (d === "Medium") {
      const a = T(rng, [1, 2, 3, 4, 5]), r1 = rng.int(-9, 9), r2 = rng.int(-9, 9);
      if (r1 === r2 || r1 === 0 || r2 === 0 || r1 + r2 === 0) return null;
      const b = -a * (r1 + r2), c = a * r1 * r2, S = r1 + r2, Pd = r1 * r2;
      const k = rng.int(0, 3);
      const eq = poly(a, b, c);
      if (k === 0) return mk(rng, d, sN, S, [
        [-S, "Used b/a instead of −b/a"], [Pd, "Gave the product of the roots"], [b, "Forgot to divide by a"], [-b, "Forgot to divide by a and flipped the sign"],
      ], {
        q: `What is the sum of the roots of **${eq}**?`,
        sol: [`For ax² + bx + c = 0, sum of roots = −b/a`, `= −(${b}) / ${a} = **${S}**`],
        short: "Sum = −b/a; no need to solve the equation.",
        trap: "The sign: sum of roots is −b/a, so a positive b gives a negative sum.",
      });
      if (k === 1) return mk(rng, d, sN, Pd, [
        [c, "Forgot to divide by a"], [-Pd, "Flipped the sign of the product"], [S, "Gave the sum of the roots"], [Pd * a, "Multiplied by a instead of dividing"],
      ], {
        q: `Find the product of the roots of **${eq}**.`,
        sol: [`Product of roots = c/a`, `= ${c} / ${a} = **${Pd}**`],
        short: "Product = c/a, unaffected by b.",
        trap: "Product is c/a (with its sign), not −c/a.",
      });
      if (k === 2) {
        const diff = Math.abs(r1 - r2);
        return mk(rng, d, sN, diff, [
          [S, "Gave the sum of the roots"], [Math.abs(Pd), "Gave the product's size"], [diff + 1, "Slipped by one when taking the square root"], [Math.abs(r1) + Math.abs(r2) === diff ? diff + 2 : Math.abs(r1) + Math.abs(r2), "Added the sizes of the roots"],
        ], {
          q: `Find the positive difference between the two roots of **${eq}**.`,
          sol: [`Roots are ${r1} and ${r2} (sum ${S}, product ${Pd})`, `Positive difference = |${r1} − ${r2}| = **${diff}**`],
          short: "(difference)² = (sum)² − 4 × product; then take the square root.",
          trap: "Subtract the roots with their signs: |−3 − 4| = 7, not 1.",
        });
      }
      const rr = T(rng, [r1, r2]), other = S - rr;
      return mk(rng, d, sN, other, [
        [-other, "Gave the other root with the wrong sign"], [rr, "Gave the root already supplied"], [Pd, "Gave the product of the roots"], [-S, "Used −sum instead of sum"],
      ], {
        q: `One root of **${eq}** is **${sN(rr)}**. Find the other root.`,
        sol: [`Sum of roots = −b/a = ${S}`, `Other root = ${S} − (${sN(rr)}) = **${other}**`],
        short: "Use sum = −b/a (or product = c/a) with the known root.",
        trap: "Sum of the roots is −b/a: keep that sign when subtracting the known root.",
      });
    }
    // Hard
    const k = rng.int(0, 4);
    if (k === 4) {
      const c = rng.int(2, 9), u = rng.int(1, 4), b = 2 * c * u, kk = c * u * u;
      return mk(rng, d, sN, kk, [
        [b * b / (2 * c) , "Used b² = 2ac instead of b² = 4ac"], [4 * c * u, "Used 4ac as if it were b"], [u * c, "Missed a factor in the discriminant"], [b / 2, "Took half of b"],
      ], {
        q: `For what value of k does **kx² − ${b}x + ${c} = 0** have two equal roots?`,
        sol: [`Equal roots need b² = 4ac: (${b})² = 4 × k × ${c}`, `${b * b} = ${4 * c}k, so k = **${kk}**`],
        short: "Equal roots mean discriminant 0: b² = 4ac. Solve for k.",
        trap: "Discriminant is b² − 4ac; the k sits in 'a', so divide, do not square.",
      });
    }
    const a = 1, r1 = rng.int(-8, 9), r2 = rng.int(-8, 9);
    if (r1 === r2 || r1 === 0 || r2 === 0 || r1 + r2 === 0) return null;
    const S = r1 + r2, Pd = r1 * r2, eq = poly(1, -S, Pd);
    const [A, B] = T(rng, [["α", "β"], ["p", "q"], ["m", "n"], ["a", "b"]]);
    const lead = T(rng, [`If ${A} and ${B} are the roots of **${eq}**,`, `Given that ${A} and ${B} are the roots of **${eq}**,`, `For the equation **${eq}** with roots ${A} and ${B},`]);
    if (k === 0) { const v = S * S - 2 * Pd; return mk(rng, d, sN, v, [
      [S * S, "Forgot to subtract 2 × product"], [S * S + 2 * Pd, "Added 2 × product instead of subtracting"], [S * S - Pd, "Subtracted the product once, not twice"], [-v + 2 * S * S - 4 * Pd === v ? v + 2 : Pd * Pd, "Squared the product"],
    ], {
      q: `${lead} find **${A}² + ${B}²**.`,
      sol: [`${A} + ${B} = ${S}, ${A}${B} = ${Pd}`, `${A}² + ${B}² = (${A} + ${B})² − 2${A}${B} = ${S * S} − (${2 * Pd}) = **${v}**`],
      short: "${A}² + ${B}² = S² − 2P; never solve the equation.",
      trap: "(${A} + ${B})² has the extra 2${A}${B} in it; remove it.",
    }); }
    if (k === 1) {
      const f = (n, dn) => { const g = QB.gcd(Math.abs(n), Math.abs(dn)); n /= g; dn /= g; if (dn < 0) { n = -n; dn = -dn; } return (n < 0 ? "−" : "") + (dn === 1 ? Math.abs(n) : Math.abs(n) + "/" + dn); };
      const cand = [[f(S, Pd), null], [f(Pd, S), "Inverted the fraction"], [f(-S, Pd), "Flipped the sign of the sum"], [f(S, -Pd), "Flipped the sign of the product"], [f(S * S, Pd), "Squared the sum"], [f(S + 1, Pd), "Slipped on the sum"]];
      const seen = new Set(), pairs = [];
      for (const c of cand) { if (seen.has(c[0]) || pairs.length === 4) continue; seen.add(c[0]); pairs.push(c); }
      if (pairs.length < 4) return null;
      const o = QB.options(rng, pairs);
      return Object.assign({ d, time: TIME[d], q: `${lead} find **1/${A} + 1/${B}**.`,
        sol: [`${A} + ${B} = ${S}, ${A}${B} = ${Pd}`, `1/${A} + 1/${B} = (${A} + ${B})/(${A}${B}) = ${S}/${Pd} = **${f(S, Pd)}**`].map((l) => l.replace(/(^|[\s(=])-(?=\d)/g, "$1−")),
        short: `1/${A} + 1/${B} = sum ÷ product.`, trap: "Do not invert: it is sum over product, not product over sum." }, o, { calc: String(S / Pd) });
    }
    if (k === 2) { const v = S * S * S - 3 * S * Pd; return mk(rng, d, sN, v, [
      [S * S * S, "Forgot the −3${A}${B}(${A} + ${B}) term"], [S * S * S + 3 * S * Pd, "Added the 3${A}${B}(${A} + ${B}) term instead of subtracting"], [S * S * S - 3 * Pd, "Left out a factor of (${A} + ${B}) in the middle term"], [S * S - 2 * Pd, "Computed ${A}² + ${B}² instead"],
    ], {
      q: `${lead} find **${A}³ + ${B}³**.`,
      sol: [`${A} + ${B} = ${S}, ${A}${B} = ${Pd}`, `${A}³ + ${B}³ = (${A} + ${B})³ − 3${A}${B}(${A} + ${B}) = ${S * S * S} − 3(${Pd})(${S}) = **${v}**`],
      short: "${A}³ + ${B}³ = S³ − 3PS.",
      trap: "The middle term is 3${A}${B}(${A} + ${B}): all three factors.",
    }); }
    const diff = Math.abs(r1 - r2), v = diff * diff;
    return mk(rng, d, sN, v, [
      [diff, "Forgot to square the difference"], [S * S, "Gave (${A} + ${B})² instead"], [S * S + 4 * Pd, "Added 4${A}${B} instead of subtracting"], [S * S - 2 * Pd, "Subtracted 2${A}${B} (gave ${A}² + ${B}²)"],
    ], {
      q: `${lead} find **(${A} − ${B})²**.`,
      sol: [`${A} + ${B} = ${S}, ${A}${B} = ${Pd}`, `(${A} − ${B})² = (${A} + ${B})² − 4${A}${B} = ${S * S} − (${4 * Pd}) = **${v}**`],
      short: "(${A} − ${B})² = S² − 4P, which is the discriminant when a = 1.",
      trap: "(${A} − ${B})² needs −4${A}${B}, not −2${A}${B} (that is for ${A}² + ${B}²).",
    });
  }) });
})();
