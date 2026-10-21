/* =====================================================================
   Number system: question generators (cyclicity, last two digits, remainders,
   factors, factorials, base conversion). Easy / Medium / Hard each, clean
   answers, wrong options built from real mistakes with a "why" text.
   ===================================================================== */
(function () {
  const N = (x) => QB.num(x);
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 95 };
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹", SUB = "₀₁₂₃₄₅₆₇₈₉";
  const sup = (n) => String(n).split("").map((c) => SUP[+c]).join("");
  const sub = (n) => String(n).split("").map((c) => SUB[+c]).join("");
  const pad2 = (x) => String(x).padStart(2, "0");

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("number-system: no clean question found");
    };
  }
  // ans = correct value, wrongs = [[value, why], ...], f = formatter
  function mk(rng, f, ans, wrongs, extra, o) {
    o = o || {};
    if (!isFinite(ans)) return null;
    const A = f(ans), seen = new Set([A.toLowerCase()]), pairs = [[A, null]];
    const add = (v, why) => {
      if (pairs.length === 4 || !isFinite(v)) return;
      if (!o.signed && v < 0) return;
      if (Number.isInteger(ans) && !Number.isInteger(v)) return;
      if (Math.abs(v) > 1e9) return;
      if (o.lo != null && v < o.lo) return;
      if (o.hi != null && v > o.hi) return;
      const t = f(v);
      if (seen.has(t.toLowerCase()) || /NaN|undefined|Infinity/.test(t)) return;
      seen.add(t.toLowerCase());
      pairs.push([t, why]);
    };
    wrongs.forEach((w) => add(w[0], w[1]));
    const st = o.step || 1;
    [1, -1, 2, -2, 3, -3, 5, -5, 10, -10].forEach((k) => add(ans + k * st, "A small slip near the end of the working"));
    if (pairs.length < 4) return null;
    return Object.assign({ time: TIME[extra.d] }, extra, QB.options(rng, pairs), { calc: String(Math.round(ans * 1e6) / 1e6) });
  }
  // string answers (base conversion): first pair is correct
  function mkS(rng, ansStr, wrongs, extra) {
    if (ansStr.length > 8) return null;
    const seen = new Set([ansStr]), pairs = [[ansStr, null]];
    for (const w of wrongs) {
      if (pairs.length === 4) break;
      const t = String(w[0]);
      if (!/^\d+$/.test(t) || t.length > 8 || seen.has(t)) continue;
      seen.add(t); pairs.push([t, w[1]]);
    }
    if (pairs.length < 4) return null;
    return Object.assign({ time: TIME[extra.d] }, extra, QB.options(rng, pairs), { calc: String(Number(ansStr)) });
  }
  const finish = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });

  const mp = (b, e, m) => {                       // (b^e) mod m with BigInt
    b = BigInt(b); e = BigInt(e); m = BigInt(m);
    let r = 1n % m; b %= m;
    while (e > 0n) { if (e & 1n) r = r * b % m; b = b * b % m; e >>= 1n; }
    return Number(r);
  };
  const ud = (b, e) => mp(b % 10, e, 10);
  const cyc = (d) => { const a = []; let x = d % 10; do { a.push(x); x = x * d % 10; } while (x !== d % 10 && a.length < 6); return a; };
  const vf = (n, p) => { let s = 0; while (n >= p) { n = Math.floor(n / p); s += n; } return s; };   // power of p in n!
  const fac = (n) => { const m = new Map(); for (let p = 2; p * p <= n; p++) while (n % p === 0) { m.set(p, (m.get(p) || 0) + 1); n /= p; } if (n > 1) m.set(n, (m.get(n) || 0) + 1); return m; };
  const BASE_D = [2, 3, 4, 7, 8, 9];
  const baseEnding = (rng, lo, hi, ends) => { for (;;) { const b = rng.int(lo, hi); if (ends.includes(b % 10)) return b; } };

  /* ------------------------------------------------------------------ 1. unit digit by cyclicity */
  const UDQ = [(b, e) => `What is the unit digit of **${b}${sup(e)}**?`, (b, e) => `Find the digit in the units place of **${b}${sup(e)}**.`,
    (b, e) => `The last digit of **${b}${sup(e)}** is:`, (b, e) => `If **${b}${sup(e)}** were written out in full, what would its last digit be?`];
  function cycSol(b, e) {
    const c = cyc(b), L = c.length;
    return [`The last digits of powers of ${b % 10} repeat: ${c.join(", ")} (cycle length ${L})`, `${e} ÷ ${L} leaves remainder ${e % L}, so take position ${e % L || L} of the cycle: **${ud(b, e)}**`];
  }
  QB.gen("quant/number-system/unit-digit-by-cyclicity", { title: "Unit digit by cyclicity", gen: wrap((rng, d) => {
    if (d === "Easy") {
      const b = baseEnding(rng, 12, 299, BASE_D), e = rng.int(12, 99), a = ud(b, e);
      return mk(rng, N, a, [
        [b % 10, "Took the unit digit of the base itself"],
        [ud(b, e + 1), "Moved one place too far along the cycle"],
        [ud(b, e - 1), "Stopped one place short in the cycle"],
        [ud(b, e % 4), "Used the remainder of the exponent as the power (a remainder 0 gives 1)"],
      ], finish(d, T(rng, UDQ)(b, e), cycSol(b, e), `Only the unit digit ${b % 10} matters. Cycle length ${cyc(b).length}: reduce the exponent ${e} by it.`,
        `A remainder of 0 means the LAST digit of the cycle, not the first.`), { lo: 0, hi: 9 });
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const b = baseEnding(rng, 12, 499, BASE_D), c = baseEnding(rng, 12, 499, BASE_D), m = rng.int(11, 150), n = rng.int(11, 150);
        const x = ud(b, m), y = ud(c, n), a = x * y % 10;
        return mk(rng, N, a, [
          [(b % 10) * (c % 10) % 10, "Multiplied the unit digits of the bases and ignored the powers"],
          [(x + y) % 10, "Added the two unit digits instead of multiplying"],
          [x * y, "Left the product of the two unit digits un-reduced to a single digit"],
          [ud(b, m % 4) * ud(c, n % 4) % 10, "Used the exponent remainders (0 treated as power 0)"],
        ], finish(d, T(rng, [`Find the unit digit of **${b}${sup(m)} × ${c}${sup(n)}**.`, `What is the last digit of the product **${b}${sup(m)} × ${c}${sup(n)}**?`, `The unit digit of **(${b}${sup(m)}) (${c}${sup(n)})** is:`]),
          [`Unit digit of ${b}${sup(m)} = ${x}; unit digit of ${c}${sup(n)} = ${y}`, `${x} × ${y} = ${x * y}, so the unit digit is **${a}**`],
          `Find each unit digit by its cycle, multiply them, keep the last digit.`, `The last digit of a product depends only on the last digits of the factors.`), { lo: 0, hi: 9 });
      }
      if (k === 1) {
        const b = baseEnding(rng, 12, 999, BASE_D), e = rng.int(101, 9999), a = ud(b, e);
        return mk(rng, N, a, [
          [b % 10, "Took the unit digit of the base itself"],
          [ud(b, e + 1), "Moved one place too far along the cycle"],
          [ud(b, e - 1), "Stopped one place short in the cycle"],
          [ud(b, e % 4), "Used the remainder of the exponent as the power (a remainder 0 gives 1)"],
        ], finish(d, T(rng, [`Find the unit digit of **${b}${sup(e)}**.`, `What digit occupies the units place in **${b}${sup(e)}**?`, `Units digit of **${b}${sup(e)}** = ?`]), cycSol(b, e),
          `Look at the last two digits of the exponent only: ${e} ÷ 4 leaves ${e % 4}.`, `Divide by the cycle length (not by the exponent's size). Remainder 0 means the last number in the cycle.`), { lo: 0, hi: 9 });
      }
      const b = baseEnding(rng, 12, 299, BASE_D), c = baseEnding(rng, 12, 299, BASE_D), m = rng.int(11, 120), n = rng.int(11, 120);
      const x = ud(b, m), y = ud(c, n), a = (x + y) % 10;
      return mk(rng, N, a, [
        [x * y % 10, "Multiplied the two unit digits instead of adding"],
        [x + y, "Left the sum of the unit digits un-reduced"],
        [(b + c) % 10, "Added the bases and ignored the powers"],
        [Math.abs(x - y), "Subtracted the two unit digits"],
      ], finish(d, T(rng, [`Find the unit digit of **${b}${sup(m)} + ${c}${sup(n)}**.`, `What is the last digit of the sum **${b}${sup(m)} + ${c}${sup(n)}**?`]),
        [`Unit digit of ${b}${sup(m)} = ${x}; unit digit of ${c}${sup(n)} = ${y}`, `${x} + ${y} = ${x + y}, so the unit digit is **${a}**`],
        `Unit digit of each power by cycle, add, keep the last digit.`, `After adding the unit digits, keep only the last digit of the total.`), { lo: 0, hi: 9 });
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      const b = baseEnding(rng, 12, 399, BASE_D), c = baseEnding(rng, 12, 399, BASE_D), g = baseEnding(rng, 12, 399, BASE_D);
      const m = rng.int(21, 300), n = rng.int(21, 300), p = rng.int(21, 300);
      const x = ud(b, m), y = ud(c, n), z = ud(g, p), a = (x + y + z) % 10;
      return mk(rng, N, a, [
        [x * y * z % 10, "Multiplied the three unit digits instead of adding"],
        [(x + y) % 10, "Left out the third term"],
        [x + y + z, "Left the sum of the three unit digits un-reduced"],
        [(ud(b, m % 4) + ud(c, n % 4) + ud(g, p % 4)) % 10, "Used exponent remainders (0 treated as power 0)"],
      ], finish(d, `Find the unit digit of **${b}${sup(m)} + ${c}${sup(n)} + ${g}${sup(p)}**.`,
        [`Unit digits: ${b}${sup(m)} → ${x}, ${c}${sup(n)} → ${y}, ${g}${sup(p)} → ${z}`, `${x} + ${y} + ${z} = ${x + y + z}, last digit **${a}**`],
        `Three cycles, three digits, one addition, keep the last digit.`, `Do not skip a term; each power needs its own cycle.`), { lo: 0, hi: 9 });
    }
    if (k === 1) {
      const a0 = baseEnding(rng, 2, 99, BASE_D), b = rng.int(2, 13), c = rng.int(2, 5), E = BigInt(b) ** BigInt(c);
      const a = ud(a0, E), r4 = Number(E % 4n);
      return mk(rng, N, a, [
        [ud(a0, r4), "Used the exponent remainder as the power (0 treated as power 0)"],
        [ud(a0, b * c), `Multiplied ${b} and ${c} instead of finding ${b}${sup(c)}`],
        [ud(a0, b), `Used only the exponent ${b} and ignored the top power`],
        [a0 % 10, "Took the unit digit of the base itself"],
      ], finish(d, T(rng, [`Find the unit digit of **${a0}^(${b}${sup(c)})**.`, `What is the last digit of **${a0}** raised to the power **${b}${sup(c)}**?`]),
        [`The exponent is ${b}${sup(c)} = ${N(E)}; the cycle of ${a0 % 10} has length ${cyc(a0).length}`, `${N(E)} leaves remainder ${Number(E % BigInt(cyc(a0).length))} on division by ${cyc(a0).length}, so the digit is **${a}**`],
        `Find ${b}${sup(c)} mod ${cyc(a0).length} first (only its last two digits matter for mod 4).`, `The exponent is itself a power: work it out (or reduce it) before using the cycle.`), { lo: 0, hi: 9 });
    }
    const b = baseEnding(rng, 12, 299, BASE_D), c = baseEnding(rng, 12, 299, BASE_D), g = baseEnding(rng, 12, 299, BASE_D);
    const m = rng.int(21, 200), n = rng.int(21, 200), p = rng.int(21, 200);
    const x = ud(b, m), y = ud(c, n), z = ud(g, p), a = (x * y + z) % 10;
    return mk(rng, N, a, [
      [x * (y + z) % 10, "Added before multiplying (wrong order of operations)"],
      [(x + y + z) % 10, "Added all three unit digits"],
      [x * y % 10, "Dropped the last term"],
      [x * y * z % 10, "Multiplied all three"],
    ], finish(d, `Find the unit digit of **${b}${sup(m)} × ${c}${sup(n)} + ${g}${sup(p)}**.`,
      [`Unit digits: ${x}, ${y}, ${z}`, `${x} × ${y} + ${z} = ${x * y + z}, last digit **${a}**`],
      `Reduce every power to its unit digit, then follow BODMAS on single digits.`, `Multiply first, then add; the unit digit of the product is all you need before adding.`), { lo: 0, hi: 9 });
  }) });

  /* ------------------------------------------------------------------ 2. last two digits */
  QB.gen("quant/number-system/last-two-digits", { title: "Last two digits", gen: wrap((rng, d) => {
    if (d === "Easy") {
      if (rng.chance(0.65)) {
        const a = rng.int(101, 999), b = rng.int(101, 999), r = a * b % 100;
        return mk(rng, pad2, r, [
          [(a % 10) * (b % 10) % 100, "Multiplied only the unit digits"],
          [(a % 100 + b % 100) % 100, "Added the last two digits instead of multiplying"],
          [Number(pad2(r).split("").reverse().join("")), "Wrote the two digits in the wrong order"],
          [a % 100, `Took the last two digits of ${a} alone`],
        ], finish(d, T(rng, [`What are the last two digits of **${a} × ${b}**?`, `Find the last two digits of the product **${a} × ${b}**.`, `The product **${a} × ${b}** ends in which two digits?`]),
          [`Only the last two digits of each number matter: ${pad2(a % 100)} × ${pad2(b % 100)}`, `${a % 100} × ${b % 100} = ${(a % 100) * (b % 100)}, last two digits **${pad2(r)}**`],
          `Multiply the last two digits only, then keep the last two digits of that.`, `Do not multiply the unit digits alone: the tens digit of each number affects the tens place of the answer.`), { lo: 0, hi: 99 });
      }
      const a = rng.int(102, 998), r = a * a % 100;
      return mk(rng, pad2, r, [
        [(a % 10) ** 2 % 100, "Squared the unit digit only"],
        [(a % 100) * 2 % 100, "Doubled the last two digits instead of squaring"],
        [Number(pad2(r).split("").reverse().join("")), "Wrote the two digits in the wrong order"],
        [a % 100, `Took the last two digits of ${a} itself`],
      ], finish(d, T(rng, [`Find the last two digits of **${a}²**.`, `What are the last two digits of the square of **${a}**?`]),
        [`Use only the last two digits: ${a % 100}²`, `${a % 100}² = ${(a % 100) ** 2}, so the last two digits are **${pad2(r)}**`],
        `Square the last two digits and keep the last two digits of the result.`, `The tens digit of ${a} matters; squaring the unit digit alone is not enough.`), { lo: 0, hi: 99 });
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const t = rng.int(1, 9), a = 10 * t + 1 + 100 * rng.int(0, 9), n = rng.int(11, 300), r = mp(a, n, 100);
        const tens = (t * n) % 10;
        return mk(rng, pad2, r, [
          [10 * t + 1, "Kept the original last two digits"],
          [10 * ((t + n) % 10) + 1, "Added n to the tens digit instead of multiplying"],
          [(t * n) % 100, "Used tens digit × power as the last two digits"],
          [mp(a, n % 4 || 4, 100), "Used the exponent remainder mod 4"],
        ], finish(d, T(rng, [`Find the last two digits of **${a}${sup(n)}**.`, `What are the last two digits of **${a}** raised to the power **${n}**?`, `The number **${a}${sup(n)}** ends in which two digits?`]),
          [`For a number ending in 1, the unit digit stays 1 and the tens digit becomes (tens digit × power) mod 10`, `${t} × ${n} = ${t * n} → tens digit ${tens}, so the last two digits are **${pad2(r)}**`],
          `Ends in 1: tens digit = last digit of (tens digit × exponent).`, `The unit digit is always 1; it is the tens digit that changes.`), { lo: 0, hi: 99 });
      }
      if (k === 1) {
        const e = T(rng, [25, 75, 76, 49, 99, 51]), a = e + 100 * rng.int(1, 9), n = rng.int(11, 200), r = mp(a, n, 100);
        const odd = n % 2 === 1;
        const rule = { 25: "any power of a number ending in 25 ends in 25", 75: "powers of a number ending in 75 end in 75 (odd power) or 25 (even power)", 76: "any power of a number ending in 76 ends in 76",
          49: "49 raised to an odd power ends in 49, to an even power ends in 01", 99: "99 raised to an odd power ends in 99, to an even power ends in 01", 51: "51 raised to an odd power ends in 51, to an even power ends in 01" }[e];
        return mk(rng, pad2, r, [
          [e, "Assumed the last two digits never change"],
          [mp(a, n + 1, 100), "Used the next power"],
          [Number(pad2(r).split("").reverse().join("")), "Wrote the two digits in the wrong order"],
          [(a % 10) ** (n % 4 || 4) % 100, "Used the unit digit cycle only"],
        ], finish(d, T(rng, [`Find the last two digits of **${a}${sup(n)}**.`, `What are the last two digits of **${a}${sup(n)}**?`]),
          [`${a} ends in ${e}: ${rule}`, `The power ${n} is ${odd ? "odd" : "even"}, so the answer is **${pad2(r)}**`],
          `Learn the special endings: 25, 76 (fixed), and 49, 51, 75, 99 (alternate with the parity of the power).`, `Check whether the exponent is odd or even before deciding.`), { lo: 0, hi: 99 });
      }
      const a = 10 * rng.int(1, 9) + T(rng, [3, 7, 9]), n = rng.int(2, 6), r = mp(a, n, 100);
      return mk(rng, pad2, r, [
        [(a % 10) ** n % 100, "Used only the unit digit"],
        [a * n % 100, "Multiplied by the power instead of raising to it"],
        [Number(pad2(r).split("").reverse().join("")), "Wrote the two digits in the wrong order"],
        [mp(a, n + 1, 100), "Used the next power"],
      ], finish(d, `Find the last two digits of **${a}${sup(n)}**.`,
        [`Keep only two digits at each multiplication: ${Array.from({ length: n }, (_, i) => pad2(mp(a, i + 1, 100))).join(" → ")}`, `So the last two digits are **${pad2(r)}**`],
        `Multiply step by step, trimming to two digits each time.`, `Every multiplication step must keep the tens digit, not just the units digit.`), { lo: 0, hi: 99 });
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      const a = T(rng, [3, 7, 13, 17, 19, 23, 27, 29, 31, 33, 37, 39, 41, 43, 47, 53, 57, 63, 67, 69, 73, 77, 83, 87, 91, 93, 97]) + 100 * rng.int(0, 4), n = rng.int(30, 999), r = mp(a, n, 100);
      return mk(rng, pad2, r, [
        [mp(a, n % 4 || 4, 100), "Reduced the exponent mod 4 (right for the unit digit, not for two digits)"],
        [mp(a, n % 10 || 10, 100), "Reduced the exponent mod 10"],
        [mp(a, n % 20, 100), "Treated a remainder of 0 as power 0, giving 01"],
        [Number(pad2(r).split("").reverse().join("")), "Wrote the two digits in the wrong order"],
      ], finish(d, T(rng, [`Find the last two digits of **${a}${sup(n)}**.`, `What are the last two digits of **${a}${sup(n)}**?`, `**${a}${sup(n)}** ends in which two digits?`]),
        [`For any number coprime to 10, a²⁰ ends in 01, so only n mod 20 matters`, `${n} mod 20 = ${n % 20}, so use power ${n % 20 || 20}: the last two digits are **${pad2(r)}**`],
        `Reduce the exponent mod 20 (the last two digits repeat every 20 powers); remainder 0 means 01.`, `For two digits the cycle is 20 (not 4); a remainder of 0 gives ...01.`), { lo: 0, hi: 99 });
    }
    if (k === 1) {
      const n = rng.int(30, 400), r = mp(2, n, 100);
      return mk(rng, pad2, r, [
        [mp(2, n % 20, 100), "Treated a remainder of 0 as power 0"],
        [mp(2, n % 4 || 4, 100), "Reduced the exponent mod 4"],
        [mp(2, n + 1, 100), "Used the next power"],
        [Number(pad2(r).split("").reverse().join("")), "Wrote the two digits in the wrong order"],
      ], finish(d, T(rng, [`Find the last two digits of **2${sup(n)}**.`, `What are the last two digits of **2${sup(n)}**?`]),
        [`2²⁰ = 1048576 ends in 76, and 76 × 76 ends in 76, so the pattern repeats every 20 powers from 2² on`, `Use ${((n - 2) % 20) + 2}: the last two digits are **${pad2(r)}**`],
        `Powers of 2 from 2² onward repeat every 20 in the last two digits.`, `2 is not coprime to 100, so the "n mod 20" shortcut needs the exponent shifted: use n ≥ 2.`), { lo: 0, hi: 99 });
    }
    const a = T(rng, [3, 7, 9, 11, 13, 17, 19, 21, 23, 27]) , b = T(rng, [3, 7, 9, 13, 17, 19, 21, 23, 27, 29]), m = rng.int(11, 120), n = rng.int(11, 120), r = mp(a, m, 100) * mp(b, n, 100) % 100;
    return mk(rng, pad2, r, [
      [(mp(a, m, 100) + mp(b, n, 100)) % 100, "Added the two last-two-digit results instead of multiplying"],
      [ud(a, m) * ud(b, n) % 100, "Used the unit digits only"],
      [mp(a, m % 4 || 4, 100) * mp(b, n % 4 || 4, 100) % 100, "Reduced both exponents mod 4"],
      [Number(pad2(r).split("").reverse().join("")), "Wrote the two digits in the wrong order"],
    ], finish(d, `Find the last two digits of **${a}${sup(m)} × ${b}${sup(n)}**.`,
      [`${a}${sup(m)} ends in ${pad2(mp(a, m, 100))}; ${b}${sup(n)} ends in ${pad2(mp(b, n, 100))}`, `${mp(a, m, 100)} × ${mp(b, n, 100)} = ${mp(a, m, 100) * mp(b, n, 100)}, last two digits **${pad2(r)}**`],
      `Find each power's last two digits (cycle 20), multiply, trim to two digits.`, `Each power must be reduced with the 20-cycle first; then multiply the two-digit results.`), { lo: 0, hi: 99 });
  }) });

  /* ------------------------------------------------------------------ 3. remainders: basic & remainder theorem */
  const polyStr = (c) => {                            // c = [a3, a2, a1, a0]
    const names = ["x³", "x²", "x", ""]; let s = "";
    c.forEach((v, i) => {
      if (v === 0) return;
      const mag = Math.abs(v), body = names[i] === "" ? String(mag) : (mag === 1 ? "" : String(mag)) + names[i];
      s += s === "" ? (v < 0 ? "−" : "") + body : (v < 0 ? " − " : " + ") + body;
    });
    return s;
  };
  QB.gen("quant/number-system/remainders-basic-and-remainder-theorem", { title: "Remainders: basic & remainder theorem", gen: wrap((rng, d) => {
    if (d === "Easy") {
      if (rng.chance(0.5)) {
        const dv = T(rng, [7, 9, 11, 12, 13, 15, 17, 19, 23]), n = rng.int(300, 9999), r = n % dv, q = Math.floor(n / dv);
        if (r === 0) return null;
        return mk(rng, N, r, [
          [dv - r, "Gave the amount needed to reach the next multiple"],
          [q % dv, "Took the remainder of the quotient"],
          [n % (dv + 1), `Divided by ${dv + 1} by mistake`],
          [Math.floor(r / 2), "Halved the remainder"],
        ], finish(d, T(rng, [`What is the remainder when **${N(n)}** is divided by **${dv}**?`, `Find the remainder on dividing **${N(n)}** by **${dv}**.`, `**${N(n)} ÷ ${dv}** leaves what remainder?`]),
          [`${dv} × ${q} = ${N(dv * q)}`, `${N(n)} − ${N(dv * q)} = **${r}**`],
          `Subtract the nearest multiple of ${dv} below ${N(n)}.`, `The remainder is always less than the divisor (${dv}).`), { lo: 0 });
      }
      const dv = rng.int(5, 19), r = rng.int(1, dv - 1), k = rng.int(2, dv + 6), mult = rng.chance(0.5);
      const a = mult ? r * k % dv : (r + k) % dv;
      if (a === r) return null;
      const t = mult ? `${k}x` : `x + ${k}`;
      return mk(rng, N, a, [
        [mult ? r * k : r + k, "Left the remainder un-reduced (it must be less than the divisor)"],
        [mult ? (r + k) % dv : r * k % dv, "Used the wrong operation on the remainder"],
        [r, "Assumed the remainder does not change"],
        [dv - a, "Gave the complement of the remainder"],
      ], finish(d, `A number x leaves remainder **${r}** when divided by **${dv}**. What is the remainder when **${t}** is divided by **${dv}**?`,
        [`Take x = ${dv} + ${r} = ${dv + r}`, `${mult ? k + " × " + (dv + r) : (dv + r) + " + " + k} = ${mult ? k * (dv + r) : dv + r + k}, and the remainder on division by ${dv} is **${a}**`],
        `Do the same operation on the remainder (${r}${mult ? " × " + k : " + " + k} = ${mult ? r * k : r + k}), then reduce mod ${dv}.`, `If the result is ${dv} or more, reduce it by ${dv}.`), { lo: 0 });
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const dv = rng.int(5, 19), a = rng.int(100, 999), b = rng.int(100, 999), prod = rng.chance(0.6);
        const r1 = a % dv, r2 = b % dv, ans = (prod ? r1 * r2 : r1 + r2) % dv;
        return mk(rng, N, ans, [
          [prod ? r1 * r2 : r1 + r2, "Did not reduce the combined remainder"],
          [prod ? (r1 + r2) % dv : r1 * r2 % dv, "Added where the product was needed (or the reverse)"],
          [Math.abs(r1 - r2), "Subtracted the two remainders"],
          [(a % dv) , `Used only the first number's remainder`],
        ], finish(d, `Find the remainder when **${a} ${prod ? "×" : "+"} ${b}** is divided by **${dv}**.`,
          [`${a} ÷ ${dv} leaves ${r1}; ${b} ÷ ${dv} leaves ${r2}`, `${r1} ${prod ? "×" : "+"} ${r2} = ${prod ? r1 * r2 : r1 + r2}, and its remainder on ${dv} is **${ans}**`],
          `Replace each number by its remainder, ${prod ? "multiply" : "add"}, then reduce again.`, `After combining remainders, reduce once more by ${dv}.`), { lo: 0 });
      }
      if (k === 1) {
        const d1 = T(rng, [24, 28, 30, 36, 40, 42, 48, 56, 60, 72, 84]), divs = []; for (let i = 2; i < d1; i++) if (d1 % i === 0) divs.push(i);
        const d2 = T(rng, divs), r = rng.int(d2 + 1, d1 - 1), ans = r % d2;
        if (ans === 0 && rng.chance(0.7)) return null;
        return mk(rng, N, ans, [
          [r, "Gave the original remainder"],
          [d2 - ans, "Gave the complement of the remainder"],
          [Math.floor(r / d2), "Gave the quotient of the remainder instead"],
          [r % (d2 + 1), `Divided by ${d2 + 1} instead`],
        ], finish(d, `A number leaves remainder **${r}** when divided by **${d1}**. What is the remainder when the same number is divided by **${d2}**?`,
          [`${d2} divides ${d1}, so the number = ${d1}k + ${r}`, `${d1}k is a multiple of ${d2}; the remainder is that of ${r} ÷ ${d2} = **${ans}**`],
          `When the new divisor is a factor of the old one, just reduce the remainder by it.`, `This works only because ${d2} is a factor of ${d1}.`), { lo: 0 });
      }
      const dv = rng.int(5, 17), a = rng.int(50, 400), b = rng.int(50, 400), c = rng.int(20, 300);
      const ans = (a % dv) * (b % dv) % dv * (c % dv) % dv;
      return mk(rng, N, ans, [
        [(a % dv + b % dv + c % dv) % dv, "Added the remainders instead of multiplying"],
        [(a % dv) * (b % dv) % dv, "Left out the third number"],
        [(a % dv) * (b % dv) * (c % dv), "Did not reduce the product of remainders"],
        [Math.abs(a % dv - b % dv) , "Subtracted two remainders"],
      ], finish(d, `Find the remainder when **${a} × ${b} × ${c}** is divided by **${dv}**.`,
        [`Remainders: ${a} → ${a % dv}, ${b} → ${b % dv}, ${c} → ${c % dv}`, `${a % dv} × ${b % dv} × ${c % dv} reduced mod ${dv} = **${ans}**`],
        `Multiply the three remainders, reducing mod ${dv} after each step.`, `Never multiply the big numbers: take remainders first.`), { lo: 0 });
    }
    const k = rng.int(0, 2);
    if (k === 0 || k === 1) {
      const c = [1, rng.int(-6, 6), rng.int(-9, 9), rng.int(-12, 12)], a = rng.int(1, 5) * (rng.chance(0.5) ? 1 : -1);
      const f = (x) => ((c[0] * x + c[1]) * x + c[2]) * x + c[3], ans = f(a);
      const lin = a > 0 ? `x − ${a}` : `x + ${-a}`;
      if (c[1] === 0 || c[2] === 0) return null;
      return mk(rng, N, ans, [
        [f(-a), `Substituted x = ${-a} (sign slip) instead of x = ${a}`],
        [c[3], "Gave the constant term"],
        [ans + a, "Mis-added when evaluating the polynomial"],
        [c[0] + c[1] + c[2] + c[3], "Substituted x = 1"],
      ], finish(d, T(rng, [`Find the remainder when **${polyStr(c)}** is divided by **(${lin})**.`, `What remainder does **${polyStr(c)}** leave on division by **(${lin})**?`]),
        [`Remainder theorem: put ${lin} = 0, i.e. x = ${a}`, `f(${a}) = ${c[0]}(${a})³ ${c[1] < 0 ? "−" : "+"} ${Math.abs(c[1])}(${a})² ${c[2] < 0 ? "−" : "+"} ${Math.abs(c[2])}(${a}) ${c[3] < 0 ? "−" : "+"} ${Math.abs(c[3])} = **${N(ans)}**`],
        `Substitute the root of the divisor into the polynomial.`, `For (x + k) the root is −k: the sign flips.`), { signed: true });
    }
    const dv = rng.int(5, 13), r = rng.int(2, dv - 1), aa = rng.int(1, 6), bb = rng.int(1, 9);
    const ans = (r * r + aa * r + bb) % dv;
    return mk(rng, N, ans, [
      [r * r + aa * r + bb, "Did not reduce by the divisor"],
      [(r + aa + bb) % dv, "Forgot to square the remainder"],
      [(r * r) % dv, "Dropped the other terms"],
      [(r * r - aa * r + bb + dv * 10) % dv, "Used the wrong sign on the middle term"],
    ], finish(d, `A number n leaves remainder **${r}** when divided by **${dv}**. What is the remainder when **n² + ${aa}n + ${bb}** is divided by **${dv}**?`,
      [`Replace n by its remainder ${r}`, `${r}² + ${aa}×${r} + ${bb} = ${r * r + aa * r + bb}, and mod ${dv} that is **${ans}**`],
      `Substitute the remainder into the expression, then reduce.`, `Reduce mod ${dv} at the end: a result of ${dv} or more is not a valid remainder.`), { lo: 0 });
  }) });

  /* ------------------------------------------------------------------ 4. remainders of large powers */
  QB.gen("quant/number-system/remainders-of-large-powers", { title: "Remainders of large powers", gen: wrap((rng, d) => {
    if (d === "Easy") {
      const dv = T(rng, [3, 4, 5, 6, 7, 8, 9, 10, 11]), a = rng.int(2, 19), n = rng.int(12, 99);
      if (a % dv === 0) return null;
      const r = mp(a, n, dv);
      const orders = []; let x = a % dv; for (let i = 1; i <= 12; i++) { orders.push(x); x = x * a % dv; }
      let L = 1; while (mp(a, L, dv) !== 1 % dv && L < 12) L++;
      return mk(rng, N, r, [
        [a % dv, "Took the remainder of the base alone"],
        [mp(a, n + 1, dv), "Used the next power"],
        [mp(a, n - 1, dv), "Used the previous power"],
        [dv - r, "Gave the complement of the remainder"],
      ], finish(d, T(rng, [`What is the remainder when **${a}${sup(n)}** is divided by **${dv}**?`, `Find the remainder of **${a}${sup(n)}** on division by **${dv}**.`, `**${a}${sup(n)} ÷ ${dv}** leaves remainder:`]),
        [`Remainders of ${a}, ${a}², ${a}³, … on ${dv}: ${orders.slice(0, 6).join(", ")}, …`, `The pattern repeats; ${a}${sup(n)} leaves **${r}**`],
        `Write the first few remainders, spot the repeat length and reduce the exponent.`, `Count positions carefully: power 1 is the first remainder.`), { lo: 0 });
    }
    if (d === "Medium") {
      const dv = T(rng, [7, 9, 11, 13, 6, 8, 12]), a = rng.int(2, 30), n = rng.int(30, 400);
      if (QB.gcd(a, dv) !== 1 && rng.chance(0.7)) return null;
      const r = mp(a, n, dv);
      if (r === a % dv && rng.chance(0.7)) return null;
      let L = 1; while (mp(a, L, dv) !== 1 % dv && L <= 24) L++;
      const cycle = QB.gcd(a, dv) === 1 && L <= 24;
      return mk(rng, N, r, [
        [a % dv, "Took the remainder of the base alone"],
        [mp(a, n % (dv - 1) , dv), `Reduced the exponent mod ${dv - 1} without checking it is a valid cycle`],
        [mp(a, n + 1, dv), "Used the next power"],
        [dv - r, "Gave the complement of the remainder"],
      ], finish(d, T(rng, [`Find the remainder when **${a}${sup(n)}** is divided by **${dv}**.`, `What is **${a}${sup(n)}** mod **${dv}**?`, `The remainder of **${a}${sup(n)} ÷ ${dv}** is:`]),
        cycle ? [`${a}${sup(L)} leaves remainder 1 on division by ${dv}, so the remainders repeat every ${L} powers`, `${n} = ${L} × ${Math.floor(n / L)} + ${n % L}, so the remainder is that of ${a}${sup(n % L)}: **${r}**`]
          : [`Find the repeating pattern of the remainders of ${a}, ${a}², … on ${dv}`, `The remainder for power ${n} is **${r}**`],
        `Find the smallest power leaving remainder 1; the exponent is then reduced by that cycle length.`, `If the exponent is a multiple of the cycle, the remainder is 1.`), { lo: 0 });
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      const p = T(rng, [7, 11, 13, 17, 19, 23]), a = rng.int(2, 60), n = rng.int(40, 999);
      if (a % p === 0) return null;
      const r = mp(a, n, p);
      return mk(rng, N, r, [
        [mp(a, n % p, p), `Reduced the exponent mod ${p} instead of mod ${p - 1}`],
        [a % p, "Took the remainder of the base alone"],
        [mp(a, n % (p - 1), p) === 1 ? p - 1 : 1, "Treated a zero exponent remainder wrongly"],
        [p - r, "Gave the complement of the remainder"],
      ], finish(d, T(rng, [`Find the remainder when **${a}${sup(n)}** is divided by **${p}**.`, `What remainder does **${a}${sup(n)}** leave on division by the prime **${p}**?`]),
        [`Fermat: ${a}${sup(p - 1)} leaves remainder 1 on division by ${p} (since ${p} is prime and does not divide ${a})`, `${n} = ${p - 1} × ${Math.floor(n / (p - 1))} + ${n % (p - 1)}, so the remainder is that of ${a}${sup(n % (p - 1))}: **${r}**`],
        `Prime p: reduce the exponent mod (p − 1).`, `The cycle is p − 1 = ${p - 1}, not p.`), { lo: 0 });
    }
    if (k === 1) {
      const p = T(rng, [7, 11, 13]), a = rng.int(2, 20), b = rng.int(2, 20), m = rng.int(20, 300), n = rng.int(20, 300);
      if (a % p === 0 || b % p === 0) return null;
      const r = mp(a, m, p) * mp(b, n, p) % p;
      if (r === 0) return null;
      return mk(rng, N, r, [
        [(mp(a, m, p) + mp(b, n, p)) % p, "Added the two remainders instead of multiplying"],
        [mp(a, m, p) * mp(b, n, p), "Did not reduce the product of the remainders"],
        [mp(a * b, m + n, p), "Merged the bases and exponents"],
        [mp(a, m, p), "Used only the first power"],
      ], finish(d, `Find the remainder when **${a}${sup(m)} × ${b}${sup(n)}** is divided by **${p}**.`,
        [`${a}${sup(m)} leaves ${mp(a, m, p)}; ${b}${sup(n)} leaves ${mp(b, n, p)} on division by ${p}`, `${mp(a, m, p)} × ${mp(b, n, p)} = ${mp(a, m, p) * mp(b, n, p)}, remainder **${r}**`],
        `Find each power's remainder (Fermat with exponent mod ${p - 1}), multiply, reduce.`, `You may not merge different bases: ${a}${sup(m)} × ${b}${sup(n)} is not (${a * b})${sup(m + n)}.`), { lo: 0 });
    }
    const p = T(rng, [5, 7, 11, 13]), a = rng.int(2, 25), b = rng.int(2, 7), c = rng.int(2, 4);
    if (a % p === 0) return null;
    const E = BigInt(b) ** BigInt(c), r = mp(a, E, p);
    return mk(rng, N, r, [
      [mp(a, b * c, p), `Multiplied ${b} and ${c} instead of finding ${b}${sup(c)}`],
      [mp(a, Number(E % BigInt(p)), p), `Reduced the exponent mod ${p} instead of mod ${p - 1}`],
      [a % p, "Took the remainder of the base alone"],
      [p - r, "Gave the complement of the remainder"],
    ], finish(d, `Find the remainder when **${a}^(${b}${sup(c)})** is divided by **${p}**.`,
      [`The exponent is ${b}${sup(c)} = ${N(E)}. By Fermat, only ${N(E)} mod ${p - 1} matters`, `${N(E)} mod ${p - 1} = ${Number(E % BigInt(p - 1))}, so the remainder is that of ${a}${sup(Number(E % BigInt(p - 1)))}: **${r}**`],
      `Work out the exponent mod (p − 1), then the base to that small power.`, `The exponent itself is a power: find ${b}${sup(c)} before reducing.`), { lo: 0 });
  }) });

  /* ------------------------------------------------------------------ 5. factors */
  const PR = [2, 3, 5, 7, 11, 13];
  function numOf(f) { return f.reduce((a, [p, e]) => a * p ** e, 1); }
  function divisors(f) { let ds = [1]; f.forEach(([p, e]) => { const n = []; ds.forEach((x) => { for (let i = 0; i <= e; i++) n.push(x * p ** i); }); ds = n; }); return ds; }
  const facStr = (f) => f.map(([p, e]) => e === 1 ? String(p) : p + sup(e)).join(" × ");
  function pickF(rng, np, emax, cap) {
    for (let i = 0; i < 50; i++) {
      const ps = rng.shuffle(PR).slice(0, np).sort((a, b) => a - b), f = ps.map((p) => [p, rng.int(1, emax)]);
      if (numOf(f) <= cap && numOf(f) >= 12) return f;
    }
    return null;
  }
  const subjects = ["a number", "the number"];
  QB.gen("quant/number-system/factors-count-sum-even-odd", { title: "Factors: count / sum / even-odd / perfect-square", gen: wrap((rng, d) => {
    const nf = d === "Easy" ? pickF(rng, rng.int(2, 3), 3, 8000) : d === "Medium" ? pickF(rng, rng.int(2, 3), 4, 200000) : pickF(rng, rng.int(3, 4), 4, 3000000);
    if (!nf) return null;
    const F = nf, n = numOf(F), ds = divisors(F), show = (n <= 20000 && rng.chance(0.55)) || d === "Easy" && rng.chance(0.6) ? N(n) : facStr(F);
    const cnt = F.reduce((a, [, e]) => a * (e + 1), 1);
    const two = F.find(([p]) => p === 2);
    const lab = show === N(n) ? `**${show}**` : `**${show}**`;
    if (d === "Easy") {
      const prodE = F.reduce((a, [, e]) => a * e, 1);
      return mk(rng, N, cnt, [
        [prodE, "Multiplied the exponents without adding 1"],
        [F.reduce((a, [, e]) => a + e, 0), "Added the exponents instead of multiplying (e + 1)"],
        [cnt - 1, "Left out the factor 1 or the number itself"],
        [cnt - 2, "Excluded both 1 and the number"],
        [F.reduce((a, [, e]) => a * (e + 2), 1), "Added 2 instead of 1 to each exponent"],
      ], finish(d, T(rng, [`How many factors does ${lab} have?`, `Find the number of positive divisors of ${lab}.`, `The total number of factors of ${lab} is:`]),
        [`Prime factorisation: ${facStr(F)}`, `Number of factors = ${F.map(([, e]) => "(" + e + " + 1)").join(" × ")} = **${cnt}**`],
        `Add 1 to each exponent and multiply.`, `Count 1 and the number itself as factors, and add 1 to every exponent.`), { lo: 1 });
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const sum = ds.reduce((a, b) => a + b, 0);
        return mk(rng, N, sum, [
          [sum - n, "Left out the number itself"],
          [sum - 1, "Left out the factor 1"],
          [cnt, "Gave the count of factors, not their sum"],
          [F.reduce((a, [p, e]) => a * (p ** e - 1) / (p - 1), 1), "Used the sum of powers up to e − 1 only"],
          [sum + n, "Counted the number twice"],
        ], finish(d, T(rng, [`What is the sum of all positive factors of ${lab}?`, `Find the sum of the divisors of ${lab}.`]),
          [`Prime factorisation: ${facStr(F)}`, `Sum = ${F.map(([p, e]) => "(" + Array.from({ length: e + 1 }, (_, i) => p ** i).join(" + ") + ")").join(" × ")} = **${N(sum)}**`],
          `Multiply, for each prime, the sum 1 + p + p² + … + pᵉ.`, `The sum includes 1 and the number itself.`), { lo: 1 });
      }
      const odd = ds.filter((x) => x % 2).length, even = ds.length - odd;
      if (!two) return null;
      const wantEven = rng.chance(0.5), ans = wantEven ? even : odd;
      return mk(rng, N, ans, [
        [wantEven ? odd : even, wantEven ? "Gave the number of odd factors" : "Gave the number of even factors"],
        [cnt, "Gave the total number of factors"],
        [wantEven ? two[1] * (cnt / (two[1] + 1)) : cnt / (two[1] + 1) - 1, "Mixed up the exponent of 2 in the count"],
        [ans + 1, "Counted one factor too many"],
      ], finish(d, `How many ${wantEven ? "even" : "odd"} factors does ${lab} have?`,
        [`Prime factorisation: ${facStr(F)}`, wantEven ? `Even factors need at least one 2: ${two[1]} × ${F.filter(([p]) => p !== 2).map(([, e]) => "(" + e + " + 1)").join(" × ") || "1"} = **${even}**` : `Odd factors use no 2: ${F.filter(([p]) => p !== 2).map(([, e]) => "(" + e + " + 1)").join(" × ") || "1"} = **${odd}**`],
        wantEven ? `Even = total − odd = ${cnt} − ${odd}.` : `Odd factors: ignore the power of 2 and count the rest.`, `${wantEven ? "Even" : "Odd"} factors need a different count from the total; separate the prime 2 first.`), { lo: 1 });
    }
    const k = rng.int(0, 3);
    if (k === 0) {
      const sq = F.reduce((a, [, e]) => a * (Math.floor(e / 2) + 1), 1);
      return mk(rng, N, sq, [
        [F.reduce((a, [, e]) => a * Math.floor(e / 2), 1) || 1, "Used floor(e/2) without adding 1"],
        [cnt, "Gave the total number of factors"],
        [F.reduce((a, [, e]) => a * Math.ceil((e + 1) / 2), 1), "Rounded the half-count up instead of using floor(e/2) + 1"],
        [Math.sqrt(cnt), "Took the square root of the number of factors"],
      ], finish(d, `How many factors of ${lab} are perfect squares?`,
        [`Prime factorisation: ${facStr(F)}`, `A square factor has even exponents: choices for each prime = ⌊e/2⌋ + 1, so ${F.map(([, e]) => "(" + Math.floor(e / 2) + " + 1)").join(" × ")} = **${sq}**`],
        `Each exponent: floor(e ÷ 2) + 1 choices; multiply.`, `Exponent 0 is allowed (gives 1, itself a square).`), { lo: 1 });
    }
    if (k === 1) {
      const sumOdd = ds.filter((x) => x % 2).reduce((a, b) => a + b, 0);
      if (!two) return null;
      return mk(rng, N, sumOdd, [
        [ds.reduce((a, b) => a + b, 0), "Gave the sum of all factors"],
        [sumOdd - 1, "Left out the factor 1"],
        [ds.filter((x) => x % 2 === 0).reduce((a, b) => a + b, 0), "Gave the sum of even factors"],
        [ds.filter((x) => x % 2).length, "Counted the odd factors instead of adding them"],
      ], finish(d, `What is the sum of all odd factors of ${lab}?`,
        [`Prime factorisation: ${facStr(F)}`, `Ignore the prime 2: sum of odd factors = ${F.filter(([p]) => p !== 2).map(([p, e]) => "(" + Array.from({ length: e + 1 }, (_, i) => p ** i).join(" + ") + ")").join(" × ") || "1"} = **${N(sumOdd)}**`],
        `Odd factors never use the prime 2, so drop it and use the sum formula for the other primes.`, `Odd factors include 1.`), { lo: 1 });
    }
    if (k === 2) {
      const m = T(rng, [2, 3, 4, 6, 5]), ms = fac(m);
      const okM = [...ms].every(([p, e]) => { const q = F.find(([pp]) => pp === p); return q && q[1] >= e; });
      if (!okM) return null;
      const mult = ds.filter((x) => x % m === 0).length;
      return mk(rng, N, mult, [
        [cnt, "Gave the total number of factors"],
        [ds.filter((x) => x % m !== 0).length, `Counted the factors that are NOT multiples of ${m}`],
        [cnt - Math.floor(cnt / m), "Assumed a fixed fraction of factors are multiples"],
        [mult + 1, "Counted one factor too many"],
      ], finish(d, `How many factors of ${lab} are divisible by **${m}**?`,
        [`Prime factorisation: ${facStr(F)}`, `Fix ${m} out of the number: the remaining part ${facStr(F.map(([p, e]) => [p, e - (ms.get(p) || 0)]).filter(([, e]) => e > 0)) || "1"} has ${mult} factors, so the answer is **${mult}**`],
        `Divide out ${m} once from N, then count the factors of what is left.`, `A factor divisible by ${m} must contain all of ${m}'s primes, so its available exponents are fewer.`), { lo: 1 });
    }
    const pairs = Math.ceil(cnt / 2), sqn = Math.sqrt(n) % 1 === 0;
    return mk(rng, N, pairs, [
      [cnt, "Gave the number of factors instead of the number of pairs"],
      [cnt - 1, "Subtracted 1 from the number of factors"],
      [Math.floor(cnt / 2) , sqn ? "Left out the pair that uses the square root" : "Rounded down"],
      [cnt * 2, "Doubled the number of factors"],
    ], finish(d, `In how many ways can ${lab} be written as a product of two natural numbers (the order of the two numbers does not matter)?`,
      [`Number of factors = ${cnt}`, `They pair up as (f, N/f): ${sqn ? "N is a perfect square, so the middle factor pairs with itself: (" + cnt + " + 1) / 2" : cnt + " / 2"} = **${pairs}**`],
      `Ways = (factors) ÷ 2, rounded up when N is a perfect square.`, `For a perfect square, the pair (√N, √N) counts once.`), { lo: 1 });
  }) });

  /* ------------------------------------------------------------------ 6. trailing zeros */
  const tz = (n) => vf(n, 5);
  QB.gen("quant/number-system/trailing-zeros-in-n", { title: "Trailing zeros in n!", gen: wrap((rng, d) => {
    if (d === "Easy" || d === "Medium") {
      const n = d === "Easy" ? rng.int(25, 499) : rng.int(500, 4999), r = tz(n);
      const pw = []; for (let p = 5; p <= n; p *= 5) pw.push(`⌊${n}/${p}⌋ = ${Math.floor(n / p)}`);
      return mk(rng, N, r, [
        [Math.floor(n / 5), "Counted only the multiples of 5, not 25, 125, …"],
        [Math.floor(n / 10), "Divided by 10 instead of counting the fives"],
        [r + 1, "Counted one extra five"],
        [Math.floor(n / 5) + Math.floor(n / 10), "Added the multiples of 5 and of 10"],
        [n - Math.floor(n / 5), "Counted numbers not divisible by 5"],
      ], finish(d, T(rng, [`How many zeros are there at the end of **${N(n)}!**?`, `Find the number of trailing zeros in **${N(n)}!**.`, `**${N(n)}!** ends with how many zeros?`, `The factorial **${N(n)}!** has how many consecutive zeros at its right end?`]),
        [`Each zero needs one 2 and one 5; the 5s are fewer, so count the 5s in ${N(n)}!`, `${pw.join(" + ")} → **${r}**`],
        `Keep dividing ${N(n)} by 5 (ignore remainders) and add the quotients.`, `Numbers like 25 and 125 contain more than one 5.`), { lo: 0 });
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      const n = rng.int(3, 400) * 5, z = tz(n);
      return mk(rng, N, n, [
        [z * 5, "Multiplied the zeros by 5"],
        [n + 5, "Chose the next multiple of 5 (more zeros than needed)"],
        [n - 5, "Chose the previous multiple of 5 (fewer zeros)"],
        [n + 1, "Chose a number just above the multiple of 5"],
      ], finish(d, T(rng, [`What is the smallest positive integer n for which **n!** ends in exactly **${z}** zeros?`, `Find the least n such that **n!** has exactly **${z}** trailing zeros.`]),
        [`n! gains a zero only when n is a multiple of 5, so the smallest n is a multiple of 5`, `${N(n)}! has ${tz(n)} zeros and ${N(n - 5)}! has ${tz(n - 5)}, so n = **${N(n)}**`],
        `Estimate n ≈ 4 × zeros, then adjust to the multiple of 5 that gives exactly ${z}.`, `The smallest n is a multiple of 5; later numbers up to n + 4 give the same count.`), { lo: 1, step: 5 });
    }
    if (k === 1) {
      const a = rng.int(10, 120), b = rng.int(10, 120), r = tz(a) + tz(b);
      return mk(rng, N, r, [
        [tz(a + b), `Used (${a} + ${b})! instead`],
        [tz(a) * tz(b), "Multiplied the zero counts"],
        [Math.max(tz(a), tz(b)), "Used only the bigger factorial"],
        [Math.floor(a / 5) + Math.floor(b / 5), "Counted only multiples of 5, not 25, 125, …"],
      ], finish(d, `Find the number of trailing zeros in the product **${a}! × ${b}!**.`,
        [`${a}! has ${tz(a)} zeros (fives); ${b}! has ${tz(b)}`, `In a product the counts of 5s (and 2s) add: ${tz(a)} + ${tz(b)} = **${r}**`],
        `Count the fives in each factorial, then add.`, `Zeros of a product add; they are not the zeros of the sum of the numbers.`), { lo: 0 });
    }
    const nums = []; const pool = [12, 15, 16, 18, 20, 24, 25, 28, 30, 32, 35, 36, 40, 45, 48, 50, 55, 60, 64, 75, 80, 96, 100, 125, 128, 144, 150, 160, 200, 225, 250];
    const cnt = rng.int(4, 5); while (nums.length < cnt) { const v = T(rng, pool); if (!nums.includes(v)) nums.push(v); }
    const v = (x, p) => { let c = 0; while (x % p === 0) { x /= p; c++; } return c; };
    const v2 = nums.reduce((a, x) => a + v(x, 2), 0), v5 = nums.reduce((a, x) => a + v(x, 5), 0), r = Math.min(v2, v5);
    if (v2 === v5) return null;
    return mk(rng, N, r, [
      [Math.max(v2, v5), "Used the larger of the counts of 2s and 5s"],
      [nums.filter((x) => x % 10 === 0).length, "Counted only the numbers that end in 0"],
      [v5 === r ? v2 : v5, "Used the wrong prime"],
      [nums.filter((x) => x % 5 === 0).length, "Counted the multiples of 5, ignoring higher powers"],
      [v2 + v5, "Added the counts of 2s and 5s"],
    ], finish(d, `How many zeros are there at the end of the product **${nums.join(" × ")}**?`,
      [`Count the primes: 2s = ${v2}, 5s = ${v5}`, `Each zero needs a pair (2, 5), so zeros = min(${v2}, ${v5}) = **${r}**`],
      `Total power of 2 and of 5 in the product; the smaller is the number of zeros.`, `Do not count only the zeros in the factors: 12 × 25 already makes a zero.`), { lo: 0 });
  }) });

  /* ------------------------------------------------------------------ 7. highest power of a prime in n! */
  QB.gen("quant/number-system/highest-power-of-a-prime", { title: "Highest power of a prime in n!", gen: wrap((rng, d) => {
    if (d === "Easy") {
      const p = T(rng, [2, 3, 5, 7]), n = rng.int(p * 3, p === 2 ? 150 : 400), r = vf(n, p), steps = []; for (let q = p; q <= n; q *= p) steps.push(`⌊${n}/${q}⌋ = ${Math.floor(n / q)}`);
      return mk(rng, N, r, [
        [Math.floor(n / p), `Counted only the multiples of ${p}`],
        [r - Math.floor(n / (p * p)), "Left out the highest-power term"],
        [r + 1, "Counted one extra"],
        [Math.floor(n / (p - 1)), `Divided by ${p - 1} instead of ${p}`],
        [n - Math.floor(n / p), `Counted numbers that are not multiples of ${p}`],
      ], finish(d, T(rng, [`What is the highest power of **${p}** that divides **${N(n)}!**?`, `Find the largest k such that **${p}ᵏ** divides **${N(n)}!**.`, `The exponent of the prime ${p} in the prime factorisation of **${N(n)}!** is:`]),
        [`Legendre: add ⌊n/p⌋ + ⌊n/p²⌋ + ⌊n/p³⌋ + …`, `${steps.join(" + ")} = **${r}**`],
        `Divide ${N(n)} by ${p} repeatedly (floor each time) and add the quotients.`, `Multiples of ${p * p} give a second ${p}; do not stop after the first division.`), { lo: 0 });
    }
    const comps = d === "Medium" ? [6, 10, 12, 14, 15, 18, 20, 21, 22, 26, 28, 30] : [24, 36, 40, 45, 48, 54, 56, 60, 72, 75, 80, 90, 96, 100, 108, 120, 144];
    const m = T(rng, comps), n = d === "Medium" ? rng.int(m, 400) : rng.int(30, 800), f = fac(m);
    const per = [...f].map(([p, e]) => ({ p, e, v: vf(n, p), k: Math.floor(vf(n, p) / e) })), r = Math.min(...per.map((x) => x.k));
    const bigp = Math.max(...f.keys());
    return mk(rng, N, r, [
      [vf(n, Math.max(...f.keys())), `Used only the largest prime (${bigp}) and ignored its exponent`],
      [Math.max(...per.map((x) => x.k)), "Took the larger count instead of the smaller"],
      [Math.floor(n / m), `Took ⌊n/${m}⌋ instead`],
      [Math.min(...per.map((x) => x.v)), "Ignored the exponents in the number"],
      [per.reduce((a, x) => a + x.k, 0), "Added the counts of the separate primes"],
    ], finish(d, T(rng, [`What is the highest power of **${m}** that divides **${N(n)}!**?`, `Find the largest k for which **${m}ᵏ** divides **${N(n)}!**.`, `${N(n)}! is divisible by ${m}ᵏ. What is the largest k?`]),
      [`${m} = ${facStr([...f].map(([p, e]) => [p, e]))}`, ...per.map((x) => `Power of ${x.p} in ${N(n)}! = ${x.v}, and ${x.v} ÷ ${x.e} → ${x.k}`), `The smallest is the answer: **${r}**`],
      `Find each prime's power in n!, divide by its exponent in ${m}, take the minimum.`, `The scarcest prime decides; the exponent in ${m} must also be divided out.`), { lo: 0 });
  }) });

  /* ------------------------------------------------------------------ 8. base conversion */
  const toB = (n, b) => n.toString(b).toUpperCase();
  const HEXD = (n, b) => b <= 9 ? toB(n, b) : toB(n, b);
  QB.gen("quant/number-system/base-conversion", { title: "Base conversion", gen: wrap((rng, d) => {
    const rev = (s) => s.split("").reverse().join("").replace(/^0+/, "") || "0";
    const asDec = (s, b) => parseInt(s, b);
    if (d === "Easy") {
      if (rng.chance(0.5)) {
        const n = rng.int(9, 126), s = toB(n, 2), steps = []; let x = n; while (x > 0) { steps.push(`${x} ÷ 2 = ${Math.floor(x / 2)} rem ${x % 2}`); x = Math.floor(x / 2); }
        return mkS(rng, s, [
          [rev(s), "Read the remainders from top to bottom instead of bottom to top"],
          [toB(n + 1, 2), "Converted the next number"],
          [toB(n - 1, 2), "Converted the previous number"],
          [toB(n, 3), "Wrote the base-3 form"],
          [String(n), "Left the number in decimal"],
        ], finish(d, T(rng, [`Convert **${n}** (decimal) to binary.`, `What is the binary form of the decimal number **${n}**?`, `Express **${n}** in base 2.`, `Write **${n}** as a binary number.`, `A computer stores the decimal number **${n}** in binary. What does it store?`, `Which binary number equals **${n}** in decimal?`]),
          [...steps, `Read the remainders upwards: **${s}**`], `Subtract the largest powers of 2: ${n} = ${[...s].map((c, i) => c === "1" ? 2 ** (s.length - 1 - i) : null).filter(Boolean).join(" + ")}.`, `Remainders are read from the last division to the first.`));
      }
      const n = rng.int(9, 126), s = toB(n, 2);
      return mk(rng, N, n, [
        [asDec(rev(s), 2), "Read the binary digits in reverse order"],
        [n + 1, "Added an extra 1"],
        [n - 1, "Left out the last 1"],
        [Number(s), "Read the binary digits as a decimal number"],
      ], finish(d, T(rng, [`Convert the binary number **${s}₂** to decimal.`, `What is the decimal value of **${s}₂**?`, `Express **${s}** (base 2) in base 10.`, `Which decimal number is written **${s}** in binary?`, `A register holds the bits **${s}**. What decimal number is that?`, `Find the base-10 value of **${s}₂**.`]),
        [`Place values from the right: ${[...s].map((c, i) => c + "×" + 2 ** (s.length - 1 - i)).join(" + ")}`, `= **${n}**`],
        `Add the powers of 2 under every digit 1.`, `The rightmost place is 2⁰ = 1, not 2.`), { lo: 1, hi: 200 });
    }
    if (d === "Medium") {
      const k = rng.int(0, 2), b = T(rng, [3, 4, 5, 6, 7, 8, 9]);
      if (k === 0) {
        const n = rng.int(20, 500), s = toB(n, b);
        return mkS(rng, s, [
          [rev(s), "Read the remainders from top to bottom"],
          [toB(n, b === 9 ? 8 : b + 1), `Used base ${b === 9 ? 8 : b + 1} instead of ${b}`],
          [toB(n + b, b), "Added a spare unit in the last place"],
          [toB(n - 1, b), "Converted the previous number"],
          [toB(n, 2), "Wrote the binary form"],
        ], finish(d, T(rng, [`Convert **${n}** (decimal) to base **${b}**.`, `Write the decimal number **${n}** in base **${b}**.`, `What is **${n}** in base ${b}?`]),
          [`Divide repeatedly by ${b} and note remainders`, `Reading them from the last division up: **${s}${sub(b)}**`],
          `Find the largest power of ${b} that fits and work down.`, `Remainders are read bottom to top.`));
      }
      if (k === 1) {
        const n = rng.int(20, 500), s = toB(n, b);
        return mk(rng, N, n, [
          [asDec(rev(s), b), "Read the digits in reverse order"],
          [Number(s), "Read the digits as a decimal number"],
          [[...s].reduce((a, c) => a * (b + 1) + +c, 0), `Used place value ${b + 1} instead of ${b}`],
          [[...s].reduce((a, c) => a + +c, 0), "Added the digits"],
        ], finish(d, T(rng, [`Convert **${s}${sub(b)}** to decimal.`, `What is the decimal value of the base-${b} number **${s}**?`]),
          [`Place values from the right: ${[...s].map((c, i) => c + "×" + b + sup(s.length - 1 - i)).join(" + ")}`, `= **${n}**`],
          `Multiply each digit by its power of ${b} and add.`, `Place values are powers of the BASE (${b}), not of 10.`), { lo: 1 });
      }
      const b1 = T(rng, [2, 3, 4, 5]), b2 = T(rng, [6, 7, 8, 9]), n = rng.int(20, 300), s = toB(n, b1), t = toB(n, b2);
      return mkS(rng, t, [
        [toB(n, b2 === 9 ? 8 : b2 + 1), `Converted to base ${b2 === 9 ? 8 : b2 + 1}`],
        [rev(t), "Reversed the digits"],
        [toB(n + 1, b2), "Converted the next number"],
        [s, "Left the number in its original base"],
      ], finish(d, `Convert **${s}${sub(b1)}** to base **${b2}**.`,
        [`Base ${b1} → decimal: ${s}${sub(b1)} = ${n}`, `Decimal → base ${b2}: **${t}${sub(b2)}**`],
        `Go through decimal: base ${b1} to 10, then 10 to base ${b2}.`, `Never convert digit by digit between different bases.`));
    }
    const k = rng.int(0, 3);
    if (k === 0) {
      const b = T(rng, [2, 3, 4, 5, 6, 7, 8]), x = rng.int(10, 120), y = rng.int(10, 120), sum = toB(x + y, b);
      return mkS(rng, sum, [
        [String(Number(toB(x, b)) + Number(toB(y, b))), "Added the digits as ordinary decimal numbers (no carrying in the base)"],
        [toB(x + y + 1, b), "Added an extra carry"],
        [toB(x + y - 1, b), "Missed a carry"],
        [toB(x + y, b === 8 ? 7 : b + 1), `Used base ${b === 8 ? 7 : b + 1} for the answer`],
      ], finish(d, `Add **${toB(x, b)}${sub(b)}** and **${toB(y, b)}${sub(b)}**, and give the answer in base ${b}.`,
        [`Convert: ${toB(x, b)}${sub(b)} = ${x}, ${toB(y, b)}${sub(b)} = ${y}`, `Sum = ${x + y} = **${sum}${sub(b)}**`],
        `Add column by column, carrying when a column reaches ${b}.`, `A carry happens at ${b}, not at 10.`));
    }
    if (k === 1) {
      const b = T(rng, [2, 3, 4, 5, 6, 7, 8]), x = rng.int(4, 40), y = rng.int(3, 20), p = toB(x * y, b);
      return mkS(rng, p, [
        [String(Number(toB(x, b)) * Number(toB(y, b))), "Multiplied the digits as ordinary decimal numbers"],
        [toB(x * y + 1, b), "Added one extra"],
        [toB(x * y - 1, b), "Missed one"],
        [toB(x + y, b), "Added instead of multiplying"],
      ], finish(d, `Multiply **${toB(x, b)}${sub(b)}** by **${toB(y, b)}${sub(b)}** and give the answer in base ${b}.`,
        [`Convert: ${toB(x, b)}${sub(b)} = ${x}, ${toB(y, b)}${sub(b)} = ${y}`, `Product = ${x * y} = **${p}${sub(b)}**`],
        `Go through decimal, multiply, convert back.`, `Do not multiply the written digits as if they were base-10 numbers.`));
    }
    if (k === 2) {
      const b = rng.int(5, 9), n1 = rng.int(1, b - 1), n2 = rng.int(0, b - 1), val = n1 * b + n2, base10 = n1 * 10 + n2;
      const dd = val; if (dd === base10) return null;
      return mk(rng, N, b, [
        [b + 1, `Tried base ${b + 1}`],
        [b - 1, `Tried base ${b - 1}`],
        [base10 % 10 + n1, "Added the digits"],
        [val, "Gave the decimal value rather than the base"],
      ], finish(d, `In which base does the number **${n1}${n2}** represent the decimal number **${val}**?`,
        [`In base x: ${n1}${n2} = ${n1}x + ${n2} = ${val}`, `x = (${val} − ${n2}) ÷ ${n1} = **${b}**`],
        `Write the number as (first digit) × base + (second digit) and solve for the base.`, `The base must be larger than every digit.`), { lo: 2 });
    }
    const b1 = T(rng, [2, 3, 4, 5]), b2 = T(rng, [6, 7, 8, 9]), n = rng.int(60, 250), s = toB(n, b2), t = toB(n, b1);
    return mkS(rng, t, [
      [toB(n, b1 + 1), `Converted to base ${b1 + 1}`],
      [rev(t), "Reversed the digits"],
      [toB(n + 1, b1), "Converted the next number"],
      [s, "Left the number in its original base"],
    ], finish(d, `Convert **${s}${sub(b2)}** to base **${b1}**.`,
      [`Base ${b2} → decimal: ${s}${sub(b2)} = ${n}`, `Decimal → base ${b1}: **${t}${sub(b1)}**`],
      `Go through decimal: base ${b2} to 10, then 10 to base ${b1}.`, `There is no direct digit-by-digit conversion between unrelated bases.`));
  }) });
})();
