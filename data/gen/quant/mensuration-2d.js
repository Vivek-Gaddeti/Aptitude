/* =====================================================================
   Mensuration 2D: six generators (rectangles, triangles, circles, paths,
   % change in area, trapezium / rhombus / parallelogram).
   pi = 22/7 with radii that are multiples of 7. Wrong options come from
   real mistakes, each with a "why" text.
   ===================================================================== */
(function () {
  const M = (x) => QB.money(x), N = (x) => QB.num(x), P = (x) => QB.pct(x);
  const R = (x) => QB.round(x, 2);
  const C = (x) => isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const I = Number.isInteger;
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 95 };
  const PI = 22 / 7;
  const sg = (x) => (x < 0 ? "−" + P(R(-x)) : P(R(x)));
  const U = (u) => (x) => N(x) + " " + u;
  const A2 = (u) => (x) => N(x) + " " + u + "²";
  const UNITS = ["m", "cm", "m", "m", "cm"];
  const SQ = ["square tile", "square photo frame", "square signboard", "square rangoli", "square handkerchief", "square plot", "square carpet", "square chessboard", "square table-top", "square garden", "square window pane", "square paving stone"];

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("mensuration-2d: no clean question found");
    };
  }
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
    const calc = extra.calc != null ? extra.calc : String(R(ans));
    return Object.assign({ time: TIME[extra.d] }, extra, o, { calc });
  }
  const fin = (d, q, sol, short, trap, calc) => ({ d, q, sol, short, trap, calc });

  const PLACES = ["plot", "field", "hall floor", "playground", "courtyard", "garden", "farm", "terrace", "sports ground", "school lawn"];
  const WHO = ["Ravi", "Meena", "Arjun", "Kavya", "Imran", "Sneha", "Gopal", "Divya", "Harish", "Lakshmi", "Farhan", "Nisha"];
  const TRIP = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];

  /* ---------------------------------------------------------------- 1. rectangles & squares */
  QB.gen("quant/mensuration-2d/rectangles-and-squares", { title: "Rectangles & squares", gen: wrap((rng, d) => {
    const u = T(rng, UNITS), f2 = A2(u), f1 = U(u), pl = T(rng, PLACES), w = T(rng, WHO);
    if (d === "Easy") {
      const t = rng.int(0, 2), b = rng.int(4, 48), l = b + rng.int(1, 40);
      if (t === 0) {
        return mk(rng, f2, l * b, [
          [2 * (l + b), "Found the perimeter instead of the area"],
          [l + b, "Added the sides"],
          [l * b * 2, "Doubled the area"],
          [l * l, "Squared the length only"],
        ], fin(d, T(rng, [
          `A rectangular ${pl} is **${l} ${u}** long and **${b} ${u}** wide. Find its area.`,
          `${w} measures a rectangular ${pl}: length **${l} ${u}**, breadth **${b} ${u}**. What is its area?`,
          `The sides of a rectangle are **${l} ${u}** and **${b} ${u}**. Its area is:`]),
          [`Area = length × breadth`, `= ${l} × ${b} = **${f2(l * b)}**`],
          `Multiply the two sides; units become square units.`,
          `Perimeter adds lengths (${f1(2 * (l + b))}); area multiplies them.`, `${l}*${b}`));
      }
      if (t === 1) {
        return mk(rng, f1, 2 * (l + b), [
          [l * b, "Found the area instead of the perimeter"],
          [l + b, "Forgot to double the sum of length and breadth"],
          [2 * l + b, "Counted the breadth only once"],
          [4 * l, "Treated the rectangle as a square of the longer side"],
        ], fin(d, T(rng, [
          `A rectangular ${pl} has length **${l} ${u}** and breadth **${b} ${u}**. How much fencing is needed to go once around it?`,
          `${w} walks once around a rectangular ${pl} of **${l} ${u} × ${b} ${u}**. How far does ${w} walk?`,
          `Find the perimeter of a rectangle with sides **${l} ${u}** and **${b} ${u}**.`]),
          [`Perimeter = 2 × (length + breadth)`, `= 2 × (${l} + ${b}) = **${f1(2 * (l + b))}**`],
          `Add the two sides, then double.`,
          `Do not forget the doubling: ${l} + ${b} is only half of the way round.`, `2*(${l}+${b})`));
      }
      const a = rng.int(5, 60);
      return mk(rng, f2, a * a, [
        [4 * a, "Gave the perimeter"],
        [2 * a, "Doubled the side instead of squaring it"],
        [4 * a * a, "Used (2 × side)² as the area"],
        [a * a * a, "Cubed the side"],
      ], fin(d, T(rng, [
        `A square ${pl} has a perimeter of **${4 * a} ${u}**. Find its area.`,
        `The perimeter of a square is **${4 * a} ${u}**. What is the area of the square?`,
        `${w} fences a square ${pl} using **${4 * a} ${u}** of wire, with none left. What is its area?`]),
        [`Side = perimeter ÷ 4 = ${4 * a} ÷ 4 = ${a} ${u}`, `Area = ${a}² = **${f2(a * a)}**`],
        `Quarter the perimeter to get the side, then square it.`,
        `${f1(4 * a)} is the perimeter, not the area.`, `Math.pow(${4 * a}/4,2)`));
    }
    if (d === "Medium") {
      const t = rng.int(0, 2);
      if (t === 0) {
        const l = rng.int(10, 60), b = rng.int(5, l - 1), Pm = 2 * (l + b);
        return mk(rng, f2, l * b, [
          [l * (Pm / 2), "Used the semi-perimeter as the breadth"],
          [l * (Pm - l), "Subtracted only one length from the perimeter"],
          [(Pm / 2) * (Pm / 2) / 4, "Assumed the rectangle is a square"],
          [l * (Pm / 2 - l) * 2, "Doubled the area"],
        ], fin(d, T(rng, [
          `The perimeter of a rectangular ${pl} is **${Pm} ${u}** and its length is **${l} ${u}**. Find its area.`,
          `A rectangle has perimeter **${Pm} ${u}**. If one side is **${l} ${u}**, what is its area?`,
          `${w} has a rectangular ${pl} of perimeter **${Pm} ${u}**. Its longer side is **${l} ${u}**. Find the area.`]),
          [`l + b = ${Pm} ÷ 2 = ${Pm / 2}, so b = ${Pm / 2} − ${l} = ${b}`, `Area = ${l} × ${b} = **${f2(l * b)}**`],
          `Half the perimeter minus the known side gives the other side.`,
          `Perimeter = 2(l + b): halve it before subtracting.`, `${l}*(${Pm}/2-${l})`));
      }
      if (t === 1) {
        const [a, b, c] = T(rng, TRIP), k = rng.int(1, 6);
        if (rng.chance(0.5)) {
          return mk(rng, f1, c * k, [
            [(a + b) * k, "Added the two sides instead of using Pythagoras"],
            [Math.sqrt(a * a * k * k + b * b * k * k) + a * k, "Added a side to the diagonal"],
            [a * b * k * k, "Multiplied the sides"],
            [2 * (a + b) * k, "Gave the perimeter"],
          ], fin(d, `A rectangular ${pl} measures **${a * k} ${u} × ${b * k} ${u}**. Find the length of its diagonal.`,
            [`Diagonal² = ${a * k}² + ${b * k}²`, `= ${a * a * k * k} + ${b * b * k * k} = ${c * c * k * k}`, `Diagonal = **${f1(c * k)}**`],
            `Spot the triple ${a}-${b}-${c} scaled by ${k}.`,
            `The diagonal is shorter than the sum of the sides (${f1((a + b) * k)}).`, `Math.sqrt(${a * k}*${a * k}+${b * k}*${b * k})`));
        }
        return mk(rng, f2, a * b * k * k, [
          [a * k * c * k, "Multiplied a side by the diagonal"],
          [c * c * k * k / 2, "Used the formula for a square (d²/2)"],
          [(a + b) * k, "Added the sides"],
          [a * b * k, "Forgot to scale one side"],
        ], fin(d, `The diagonal of a rectangle is **${c * k} ${u}** and one side is **${a * k} ${u}**. Find its area.`,
          [`Other side² = ${c * k}² − ${a * k}² = ${b * b * k * k}, so the other side = ${b * k} ${u}`, `Area = ${a * k} × ${b * k} = **${f2(a * b * k * k)}**`],
          `Recognise ${a}-${b}-${c} scaled by ${k}; the missing side is ${b * k}.`,
          `The diagonal is not a side of the rectangle, so it cannot be multiplied in directly.`, `${a * k}*${b * k}`));
      }
      const h = rng.int(3, 25) * 2;
      return mk(rng, f2, h * h / 2, [
        [h * h, "Squared the diagonal without halving"],
        [h * h / 4, "Divided by 4 instead of 2"],
        [h * h * 2, "Doubled instead of halving"],
        [h, "Gave the diagonal itself"],
      ], fin(d, T(rng, [
        `The diagonal of a square ${pl} is **${h} ${u}**. Find its area.`,
        `A square has a diagonal of **${h} ${u}**. What is its area?`,
        `${w} measures the diagonal of a square tile as **${h} ${u}**. Find the area of the tile.`]),
        [`Area of a square = d²/2`, `= ${h}² ÷ 2 = ${h * h} ÷ 2 = **${f2(h * h / 2)}**`],
        `Square the diagonal and halve it.`,
        `d²/2, not d²: the diagonal splits the square into two right triangles.`, `${h}*${h}/2`));
    }
    // Hard
    const t = rng.int(0, 2);
    if (t === 0) {
      const [p, q] = T(rng, [[3, 2], [5, 3], [4, 3], [5, 2], [7, 4], [8, 5], [7, 3], [9, 4], [5, 4], [7, 5]]), k = rng.int(2, 14), Pm = 2 * k * (p + q);
      return mk(rng, f2, p * q * k * k, [
        [p * q * k, "Forgot to square the common multiplier"],
        [Pm / 2 * Pm / 2, "Squared the semi-perimeter"],
        [Pm, "Gave the perimeter"],
        [p * q * k * k * 2, "Doubled the area"],
      ], fin(d, T(rng, [
        `The sides of a rectangular ${pl} are in the ratio **${p} : ${q}** and its perimeter is **${Pm} ${u}**. Find its area.`,
        `A rectangle has sides in the ratio **${p} : ${q}**. If its perimeter is **${Pm} ${u}**, what is the area?`]),
        [`Let the sides be ${p}x and ${q}x. Perimeter = 2(${p}x + ${q}x) = ${2 * (p + q)}x = ${Pm}, so x = ${k}`, `Sides = ${p * k} and ${q * k}`, `Area = ${p * k} × ${q * k} = **${f2(p * q * k * k)}**`],
        `x = perimeter ÷ ${2 * (p + q)}; area = ${p * q}x².`,
        `x is a multiplier on both sides, so it is squared in the area.`, `${p * q}*Math.pow(${Pm}/${2 * (p + q)},2)`));
    }
    if (t === 1) {
      const l = rng.int(6, 40) * 2, b = rng.int(3, 30) * 2, rate = T(rng, [12, 15, 18, 20, 25, 30, 35, 40, 45, 50, 60]);
      if (l === b) return null;
      const cost = 2 * (l + b) * rate;
      return mk(rng, M, cost, [
        [l * b * rate, "Used the area instead of the perimeter"],
        [(l + b) * rate, "Fenced only half of the boundary"],
        [2 * (l + b) * rate + 4 * rate, "Added extra for the corners"],
        [2 * (l + b) * (rate + 5), "Used a wrong rate"],
      ], fin(d, T(rng, [
        `A rectangular ${pl} **${l} m × ${b} m** is to be fenced on all four sides at **${M(rate)} per metre**. Find the total cost.`,
        `${w} wants to fence a rectangular ${pl} of length **${l} m** and breadth **${b} m**. The fencing costs **${M(rate)} per metre**. What is the cost?`]),
        [`Perimeter = 2 × (${l} + ${b}) = ${2 * (l + b)} m`, `Cost = ${2 * (l + b)} × ${rate} = **${M(cost)}**`],
        `Fencing is a length job: perimeter × rate.`,
        `Area is for covering the floor; fencing needs the perimeter.`, `2*(${l}+${b})*${rate}`));
    }
    const l = rng.int(6, 50), b = l - 2 * rng.int(1, Math.max(1, Math.min(8, Math.floor((l - 2) / 2))));
    if (b < 2 || (l + b) % 2) return null;
    const s = (l + b) / 2, diff = s * s - l * b;
    return mk(rng, f2, diff, [
      [s * s, "Gave the area of the square instead of the difference"],
      [(l - b) * (l - b), "Squared the difference of the sides"],
      [l * b, "Gave the area of the rectangle"],
      [(l - b) * s, "Mixed up the two areas"],
    ], fin(d, T(rng, [
      `A rectangle **${l} ${u} × ${b} ${u}** is reshaped into a square of the same perimeter. By how much does the area increase?`,
      `${w} has a wire bent into a rectangle of sides **${l} ${u}** and **${b} ${u}**. It is re-bent into a square. Find the gain in area.`]),
      [`Perimeter = ${2 * (l + b)}, so square side = ${s} ${u}`, `Square area = ${s}² = ${s * s}; rectangle area = ${l * b}`, `Gain = **${f2(diff)}**`],
      `The gain equals ((l − b)/2)² = ${((l - b) / 2) ** 2}.`,
      `Equal perimeter does not mean equal area; the square always has more.`, `Math.pow((${l}-${b})/2,2)`));
  }) });

  /* ---------------------------------------------------------------- 2. triangles */
  const HERON = [[3, 4, 5], [5, 5, 6], [5, 5, 8], [13, 14, 15], [9, 10, 17], [8, 15, 17], [10, 13, 13], [7, 15, 20], [6, 25, 29], [5, 12, 13]];
  const heron = (a, b, c) => { const s = (a + b + c) / 2; return Math.sqrt(s * (s - a) * (s - b) * (s - c)); };
  QB.gen("quant/mensuration-2d/triangles", { title: "Triangles (Heron, equilateral)", gen: wrap((rng, d) => {
    const u = T(rng, UNITS), f2 = A2(u), f1 = U(u), pl = T(rng, ["triangular plot", "triangular park", "triangular sheet", "triangular flower bed", "triangular signboard"]);
    if (d === "Easy") {
      const t = rng.int(0, 2);
      if (t === 0) {
        const b = rng.int(4, 60), h = rng.int(3, 48);
        if ((b * h) % 2) return null;
        return mk(rng, f2, b * h / 2, [
          [b * h, "Forgot the factor 1/2"],
          [b + h, "Added base and height"],
          [b * h / 4, "Halved twice"],
          [(b + h) / 2 * 2, "Used a perimeter-like sum"],
        ], fin(d, T(rng, [
          `A ${pl} has base **${b} ${u}** and height **${h} ${u}**. Find its area.`,
          `Find the area of a triangle whose base is **${b} ${u}** and whose perpendicular height is **${h} ${u}**.`,
          `The base of a ${pl} is **${b} ${u}** and the altitude on it is **${h} ${u}**. What is the area?`]),
          [`Area = ½ × base × height`, `= ½ × ${b} × ${h} = **${f2(b * h / 2)}**`],
          `Half of base × height.`,
          `Base × height alone is the area of the rectangle around it, which is double.`, `0.5*${b}*${h}`));
      }
      if (t === 1) {
        const [a, b, c] = T(rng, TRIP.slice(0, 4)), k = rng.int(1, 8);
        return mk(rng, f2, a * b * k * k / 2, [
          [a * b * k * k, "Forgot the factor 1/2"],
          [a * c * k * k / 2, "Used a leg and the hypotenuse"],
          [b * c * k * k / 2, "Used a leg and the hypotenuse"],
          [(a + b + c) * k, "Gave the perimeter"],
        ], fin(d, `A right-angled triangle has legs **${a * k} ${u}** and **${b * k} ${u}** and hypotenuse **${c * k} ${u}**. Find its area.`,
          [`Legs are perpendicular, so one is the base and the other the height`, `Area = ½ × ${a * k} × ${b * k} = **${f2(a * b * k * k / 2)}**`],
          `Use the two legs; the hypotenuse is not needed.`,
          `The hypotenuse is never the base-and-height pair in a right triangle.`, `0.5*${a * k}*${b * k}`));
      }
      const a = rng.int(4, 60);
      return mk(rng, f1, a, [
        [3 * a, "Gave the perimeter"],
        [a * a, "Squared the side"],
        [a / 3, "Divided the side by 3 again"],
        [a * 2, "Doubled the side"],
      ], fin(d, `The perimeter of an equilateral triangle is **${3 * a} ${u}**. Find the length of each side.`,
        [`All three sides are equal`, `Side = ${3 * a} ÷ 3 = **${f1(a)}**`],
        `Divide the perimeter by 3.`, `${f1(3 * a)} is the perimeter, not a side.`, `${3 * a}/3`));
    }
    if (d === "Medium") {
      const t = rng.int(0, 2);
      if (t === 0) {
        const [a0, b0, c0] = T(rng, HERON), k = rng.int(1, 3), a = a0 * k, b = b0 * k, c = c0 * k, A = heron(a, b, c);
        if (!I(A)) return null;
        const s = (a + b + c) / 2;
        return mk(rng, f2, A, [
          [Math.sqrt(s * (s - a) * (s - b)), "Left out one factor under the root"],
          [A * 2, "Doubled the area"],
          [s * (s - a) * (s - b) * (s - c), "Forgot to take the square root"],
          [(a + b + c), "Gave the perimeter"],
          [A + s, "Added the semi-perimeter"],
        ], fin(d, T(rng, [
          `The sides of a ${pl} are **${a} ${u}**, **${b} ${u}** and **${c} ${u}**. Find its area.`,
          `Find the area of a triangle with sides **${a} ${u}**, **${b} ${u}** and **${c} ${u}**.`]),
          [`s = (${a} + ${b} + ${c}) ÷ 2 = ${s}`, `Area = √[s(s−a)(s−b)(s−c)] = √(${s} × ${s - a} × ${s - b} × ${s - c})`, `= √${s * (s - a) * (s - b) * (s - c)} = **${f2(A)}**`],
          `Heron's formula; spot familiar triples (13-14-15 gives 84, 5-5-6 gives 12).`,
          `Do not forget the final square root.`, `Math.sqrt(${s}*${s - a}*${s - b}*${s - c})`));
      }
      if (t === 1) {
        const b = rng.int(5, 40), h = rng.int(4, 36), A = b * h / 2;
        if (!I(A) || (2 * A) % b) return null;
        return mk(rng, f1, h, [
          [A / b, "Divided the area by the base without doubling"],
          [A * 2 * b, "Multiplied instead of dividing"],
          [A / h, "Divided by the height instead of the base"],
          [A * b / 2, "Mixed the formula up"],
        ], fin(d, `The area of a ${pl} is **${N(A)} ${u}²** and its base is **${b} ${u}**. Find its height.`,
          [`Area = ½ × base × height`, `${N(A)} = ½ × ${b} × h`, `h = 2 × ${N(A)} ÷ ${b} = **${f1(h)}**`],
          `Height = 2 × area ÷ base.`, `Remember the ½: height is twice the area over the base.`, `2*${A}/${b}`));
      }
      const m = rng.int(2, 40), side = 4 * m;
      return mk(rng, f1, side, [
        [side / 2, "Took the root before multiplying by 4"],
        [side * side, "Gave a² instead of a"],
        [side * 2, "Doubled the side"],
        [side / 4, "Divided by 4 instead of multiplying"],
      ], fin(d, `The area of an equilateral ${T(rng, ["signboard", "tile", "flag", "park", "sheet", "plot"])} is **${m * m * 4}√3 ${u}²**. Find the length of its side.`,
        [`Area = (√3/4) × a² = ${m * m * 4}√3`, `a² = ${m * m * 4} × 4 = ${m * m * 16}`, `a = **${f1(side)}**`],
        `Divide out √3, multiply by 4, take the square root.`,
        `The 4 in √3/4 must be moved across before rooting.`, `Math.sqrt(${m * m * 4}*4)`));
    }
    // Hard
    const t = rng.int(0, 2);
    if (t === 0) {
      const [a0, b0, c0] = T(rng, HERON), k = rng.int(1, 4), a = a0 * k, b = b0 * k, c = c0 * k, A = heron(a, b, c), s = (a + b + c) / 2, r = A / s;
      if (!I(A)) return null;
      return mk(rng, f1, r, [
        [A / (s / 2), "Divided by half the semi-perimeter"],
        [A / (a + b + c), "Divided by the full perimeter"],
        [A, "Gave the area"],
        [2 * A / s, "Doubled the inradius"],
      ], fin(d, `A triangle has sides **${a} ${u}**, **${b} ${u}** and **${c} ${u}**. Find the radius of its inscribed circle (inradius).`,
        [`s = ${s}; area by Heron = ${A} ${u}²`, `Inradius r = area ÷ s = ${A} ÷ ${s} = **${f1(r)}**`],
        `r = Area / s. Find the area first with Heron.`, `Divide by the semi-perimeter s, not the perimeter.`, `${A}/${s}`));
    }
    if (t === 1) {
      const a = rng.int(3, 40) * 2, b = rng.int(3, 40) * 2;
      return mk(rng, f2, a * b / 4, [
        [a * b / 2, "Used sin 90° = 1 instead of sin 30° = 1/2"],
        [a * b, "Forgot both the ½ and sin 30°"],
        [a * b / 8, "Halved one extra time"],
        [(a + b) / 2, "Averaged the sides"],
      ], fin(d, `Two sides of a triangle are **${a} ${u}** and **${b} ${u}**, and the angle between them is **30°**. Find its area.`,
        [`Area = ½ × a × b × sin C`, `= ½ × ${a} × ${b} × ½ = **${f2(a * b / 4)}**`],
        `With a 30° included angle the area is ab/4.`, `sin 30° = 1/2 gives a second halving.`, `0.5*${a}*${b}*0.5`));
    }
    const m = rng.int(2, 20);
    return mk(rng, f1, 6 * m, [
      [3 * m, "Took the altitude's coefficient as the side"],
      [12 * m, "Doubled the perimeter"],
      [4 * m, "Used 2m as the side"],
      [9 * m, "Used 3m as the side"],
    ], fin(d, `The altitude of an equilateral triangle is **${m}√3 ${u}**. Find its perimeter.`,
      [`Altitude = (√3/2) × a = ${m}√3, so a = ${2 * m}`, `Perimeter = 3 × ${2 * m} = **${f1(6 * m)}**`],
      `Altitude = a√3/2, so side = 2 × (the number before √3).`, `The altitude is not the side; the side is longer.`, `3*2*${m}`));
  }) });

  /* ---------------------------------------------------------------- 3. circles */
  QB.gen("quant/mensuration-2d/circles-sectors-rings", { title: "Circles, sectors, rings", gen: wrap((rng, d) => {
    const u = T(rng, ["cm", "m", "cm", "m"]), f2 = A2(u), f1 = U(u), ob = T(rng, ["circular garden", "round table", "circular pond", "round park", "circular ground", "round plate"]);
    if (d === "Easy") {
      const k = rng.int(1, 30), r = 7 * k, t = rng.int(0, 2);
      if (t === 0) {
        return mk(rng, f2, 154 * k * k, [
          [2 * 22 * k, "Used the circumference formula"],
          [PI * 2 * r * r, "Doubled the area"],
          [PI * r, "Used πr instead of πr²"],
          [PI * r * r / 2, "Halved the area"],
        ], fin(d, `A ${ob} has radius **${r} ${u}**. Find its area (π = 22/7).`,
          [`Area = πr² = 22/7 × ${r} × ${r}`, `= 22 × ${k} × ${r} = **${f2(154 * k * k)}**`],
          `With r = 7k, the area is 154k².`, `Do not use 2πr; that is the length around.`, `22/7*${r}*${r}`));
      }
      if (t === 1) {
        return mk(rng, f1, 44 * k, [
          [154 * k * k, "Found the area"],
          [22 * k, "Used πr instead of 2πr"],
          [88 * k, "Used 4πr"],
          [PI * r * r * 2, "Doubled the area"],
        ], fin(d, `Find the circumference of a circle of radius **${r} ${u}** (π = 22/7).`,
          [`C = 2πr = 2 × 22/7 × ${r}`, `= **${f1(44 * k)}**`],
          `With r = 7k, C = 44k.`, `Circumference is a length (${u}), not an area.`, `2*22/7*${r}`));
      }
      return mk(rng, f1, r, [
        [r * 2, "Gave the diameter"],
        [r / 2, "Halved twice"],
        [44 * k / 22, "Divided by 22 only"],
        [r * r, "Squared the radius"],
      ], fin(d, `The circumference of a ${ob} is **${44 * k} ${u}**. Find its radius (π = 22/7).`,
        [`2πr = ${44 * k}`, `r = ${44 * k} × 7 ÷ (2 × 22) = **${f1(r)}**`],
        `Divide the circumference by 44 and multiply by 7.`, `Dividing by 2π gives the radius; the diameter is double.`, `${44 * k}*7/44`));
    }
    if (d === "Medium") {
      const t = rng.int(0, 2), k = rng.int(1, 8), r = 7 * k;
      if (t === 0) {
        const th = T(rng, [30, 45, 60, 90, 120, 150, 180, 240, 270, 36, 72]);
        const A = th / 360 * 154 * k * k;
        return mk(rng, f2, A, [
          [154 * k * k, "Gave the full circle"],
          [th / 360 * 44 * k, "Found the arc length instead"],
          [th / 180 * 154 * k * k, "Divided by 180 instead of 360"],
          [(360 - th) / 360 * 154 * k * k, "Found the other (major) sector"],
        ], fin(d, T(rng, [
          `Find the area of a sector of a circle of radius **${r} ${u}** with a central angle of **${th}°** (π = 22/7).`,
          `A sector of angle **${th}°** is cut from a ${ob} of radius **${r} ${u}**. What is the area of the sector? (π = 22/7)`]),
          [`Area = (θ/360) × πr²`, `= (${th}/360) × 22/7 × ${r}²`, `= (${th}/360) × ${154 * k * k} = **${f2(R(A))}**`],
          `Take the fraction ${QB.frac(th, 360)} of the whole circle (${154 * k * k}).`, `The sector is only a fraction of the full circle's area.`, `${th}/360*22/7*${r}*${r}`));
      }
      if (t === 1) {
        const th = T(rng, [45, 60, 90, 120, 180, 270, 72, 36]);
        const L = th / 360 * 44 * k;
        return mk(rng, f1, L, [
          [th / 360 * 154 * k * k, "Used the sector-area formula"],
          [44 * k, "Gave the full circumference"],
          [th / 360 * 22 * k, "Used πr instead of 2πr"],
          [th / 180 * 44 * k, "Divided by 180 instead of 360"],
        ], fin(d, `Find the length of the arc subtending **${th}°** at the centre of a circle of radius **${r} ${u}** (π = 22/7).`,
          [`Arc = (θ/360) × 2πr`, `= (${th}/360) × ${44 * k} = **${f1(R(L))}**`],
          `Fraction of the circumference: ${QB.frac(th, 360)} × ${44 * k}.`, `Arc length uses 2πr (a length), not πr².`, `${th}/360*2*22/7*${r}`));
      }
      const dist = rng.int(2, 30) * 44 * k * rng.int(1, 4) / 4;
      const rev = dist / (44 * k);
      if (!I(rev)) return null;
      return mk(rng, N, rev, [
        [dist / (154 * k * k), "Divided by the area instead of the circumference"],
        [dist / (22 * k), "Used πr as the circumference"],
        [dist / (88 * k), "Used the diameter-based wrong formula 4πr"],
        [dist / r, "Divided by the radius"],
      ], fin(d, `A wheel of radius **${r} cm** rolls along a road. How many complete revolutions does it make in **${N(dist)} cm**? (π = 22/7)`,
        [`One revolution covers the circumference = 2 × 22/7 × ${r} = ${44 * k} cm`, `Revolutions = ${N(dist)} ÷ ${44 * k} = **${N(rev)}**`],
        `Revolutions = distance ÷ circumference.`, `A rolling wheel covers its circumference per turn, not its area.`, `${dist}/(2*22/7*${r})`));
    }
    // Hard
    const t = rng.int(0, 3);
    if (t === 0) {
      const a = rng.int(2, 24), b = rng.int(1, a - 1), R1 = 7 * a, r1 = 7 * b, A = PI * (R1 * R1 - r1 * r1);
      return mk(rng, f2, A, [
        [PI * (R1 - r1) * (R1 - r1), "Squared the width instead of using R² − r²"],
        [PI * R1 * R1, "Gave the outer circle only"],
        [2 * PI * (R1 - r1), "Used circumference-style terms"],
        [PI * (R1 * R1 + r1 * r1), "Added the squares"],
      ], fin(d, T(rng, [
        `A circular ring has outer radius **${R1} ${u}** and inner radius **${r1} ${u}**. Find the area of the ring (π = 22/7).`,
        `Two concentric circles have radii **${R1} ${u}** and **${r1} ${u}**. Find the area between them (π = 22/7).`]),
        [`Area = π(R² − r²) = 22/7 × (${R1 * R1} − ${r1 * r1})`, `= 22/7 × ${R1 * R1 - r1 * r1} = **${f2(A)}**`],
        `π(R − r)(R + r) = 22/7 × ${R1 - r1} × ${R1 + r1}.`, `(R − r)² is not R² − r².`, `22/7*(${R1}*${R1}-${r1}*${r1})`));
    }
    if (t === 1) {
      const k = rng.int(1, 30), r = 7 * k, per = PI * r + 2 * r;
      return mk(rng, f1, per, [
        [PI * r, "Gave only the curved part"],
        [2 * PI * r + 2 * r, "Used the full circumference plus the diameter"],
        [PI * r * r / 2, "Gave the area of the semicircle"],
        [PI * r + r, "Added only one radius"],
      ], fin(d, `Find the perimeter of a semicircular ${T(rng, ["park", "plate", "window", "lawn"])} of radius **${r} ${u}** (π = 22/7).`,
        [`Curved part = πr = ${22 * k} ${u}`, `Straight edge = diameter = ${2 * r} ${u}`, `Perimeter = ${22 * k} + ${2 * r} = **${f1(per)}**`],
        `Semicircle perimeter = (π + 2)r = 36k when r = 7k.`, `A semicircle has a straight edge too; add the diameter.`, `22/7*${r}+2*${r}`));
    }
    if (t === 2) {
      const k = rng.int(1, 20), s = 14 * k, A = s * s - PI * s * s / 4;
      return mk(rng, f2, A, [
        [PI * s * s / 4, "Gave the area of the circle"],
        [s * s - PI * s * s, "Used the diameter as the radius"],
        [s * s, "Gave the whole square"],
        [s * s - PI * s / 2, "Subtracted the wrong quantity"],
      ], fin(d, `The largest possible circle is cut from a square sheet of side **${s} ${u}**. Find the area of the sheet that is wasted (π = 22/7).`,
        [`Circle radius = ${s}/2 = ${s / 2} ${u}`, `Circle area = 22/7 × ${s / 2}² = ${R(PI * s * s / 4)}`, `Waste = ${s * s} − ${R(PI * s * s / 4)} = **${f2(A)}**`],
        `Waste = (1 − π/4) × side² = 3/14 × ${s * s}.`, `The radius is half the side, not the full side.`, `${s}*${s}-22/7*(${s}/2)*(${s}/2)`));
    }
    const k = rng.int(1, 20), r = 7 * k;
    const rate = T(rng, [20, 25, 30, 40, 50]);
    return mk(rng, M, 2 * PI * r * rate, [
      [PI * r * r * rate, "Used the area instead of the circumference"],
      [PI * r * rate, "Used πr instead of 2πr"],
      [2 * r * rate, "Used the diameter, ignoring π"],
      [4 * PI * r * rate, "Used 4πr"],
    ], fin(d, `A circular ${T(rng, ["pond", "garden", "ground"])} of radius **${r} m** is to be fenced all the way round at **${M(rate)} per metre**. What is the cost? (π = 22/7)`,
      [`Circumference = 2 × 22/7 × ${r} = ${44 * k} m`, `Cost = ${44 * k} × ${rate} = **${M(44 * k * rate)}**`],
      `Fencing a circle uses the circumference, 44k metres here.`, `Fencing is length-based: circumference, not area.`, `2*22/7*${r}*${rate}`));
  }) });

  /* ---------------------------------------------------------------- 4. paths */
  QB.gen("quant/mensuration-2d/paths-around-inside-a-field", { title: "Paths around / inside a field", gen: wrap((rng, d) => {
    const pl = T(rng, ["rectangular lawn", "rectangular park", "rectangular garden", "rectangular playground", "rectangular pond"]);
    if (d === "Easy") {
      const l = rng.int(10, 60), b = rng.int(6, 40), w = rng.int(1, 4), out = rng.chance(0.5);
      if (out) {
        const A = (l + 2 * w) * (b + 2 * w) - l * b;
        return mk(rng, A2("m"), A, [
          [2 * w * (l + b), "Left out the four corner squares"],
          [(l + w) * (b + w) - l * b, "Added the width on one side only"],
          [(l + 2 * w) * (b + 2 * w), "Gave the area of the whole including the lawn"],
          [(l - 2 * w) * (b - 2 * w), "Used the inside-path formula"],
        ], fin(d, `A ${pl} **${l} m × ${b} m** has a path **${w} m** wide running all around it on the outside. Find the area of the path.`,
          [`Outer rectangle = (${l} + ${2 * w}) × (${b} + ${2 * w}) = ${(l + 2 * w) * (b + 2 * w)}`, `Path = ${(l + 2 * w) * (b + 2 * w)} − ${l * b} = **${A2("m")(A)}**`],
          `Path = 2w(l + b + 2w) for an outside path.`, `Outside paths add 2w to each side, not w.`, `(${l}+2*${w})*(${b}+2*${w})-${l}*${b}`));
      }
      const L = l + 2 * w + 4, B = b + 2 * w + 2, A = L * B - (L - 2 * w) * (B - 2 * w);
      return mk(rng, A2("m"), A, [
        [2 * w * (L + B), "Left out the four corner squares"],
        [L * B - (L - w) * (B - w), "Subtracted w only once from each side"],
        [(L - 2 * w) * (B - 2 * w), "Gave the area of the inner lawn"],
        [L * B, "Gave the whole area"],
      ], fin(d, `A ${pl} **${L} m × ${B} m** has a **${w} m** wide path running along the inside of its boundary. Find the area of the path.`,
        [`Inner rectangle = (${L} − ${2 * w}) × (${B} − ${2 * w}) = ${(L - 2 * w) * (B - 2 * w)}`, `Path = ${L * B} − ${(L - 2 * w) * (B - 2 * w)} = **${A2("m")(A)}**`],
        `Path = whole − inner rectangle.`, `An inside path takes w from both ends of each side: 2w.`, `${L}*${B}-(${L}-2*${w})*(${B}-2*${w})`));
    }
    if (d === "Medium") {
      const t = rng.int(0, 1);
      if (t === 0) {
        const l = rng.int(12, 60), b = rng.int(8, 40), w = rng.int(1, 5), rate = T(rng, [8, 10, 12, 15, 20, 25, 30, 40]);
        const A = (l + 2 * w) * (b + 2 * w) - l * b;
        return mk(rng, M, A * rate, [
          [(l + w) * (b + w) * rate - l * b * rate, "Added the path width once instead of twice"],
          [2 * w * (l + b) * rate, "Left out the corner squares"],
          [(l + 2 * w) * (b + 2 * w) * rate, "Charged for the whole area"],
          [A * (rate + 2), "Used a wrong rate"],
        ], fin(d, `A ${pl} measures **${l} m × ${b} m**. A **${w} m** wide path is built around it on the outside. Find the cost of paving the path at **${M(rate)} per m²**.`,
          [`Outer area = ${l + 2 * w} × ${b + 2 * w} = ${(l + 2 * w) * (b + 2 * w)} m²`, `Path area = ${(l + 2 * w) * (b + 2 * w)} − ${l * b} = ${A} m²`, `Cost = ${A} × ${rate} = **${M(A * rate)}**`],
          `Find the path's area first, then multiply by the rate.`, `The outer rectangle grows by 2w in each direction.`, `((${l}+2*${w})*(${b}+2*${w})-${l}*${b})*${rate}`));
      }
      const l = rng.int(15, 70), b = rng.int(10, 50), w = rng.int(1, 4);
      const A = w * (l + b - w);
      return mk(rng, A2("m"), A, [
        [w * (l + b), "Did not subtract the overlapping square"],
        [w * (l + b - 2 * w), "Subtracted the overlap twice"],
        [2 * w * (l + b), "Counted each road twice"],
        [l * b - (l - w) * (b - w) + w * w, "Added the overlap back"],
      ], fin(d, `Two roads, each **${w} m** wide, cross at the middle of a ${pl} **${l} m × ${b} m**, one parallel to each side. Find the area of the roads.`,
        [`Road along the length = ${l} × ${w} = ${l * w}`, `Road along the breadth = ${b} × ${w} = ${b * w}`, `Overlap = ${w} × ${w} = ${w * w}, counted twice`, `Area = ${l * w} + ${b * w} − ${w * w} = **${A2("m")(A)}**`],
        `Cross roads: w × (l + b − w).`, `The crossing square belongs to both roads; count it once.`, `${w}*(${l}+${b}-${w})`));
    }
    // Hard
    const t = rng.int(0, 2);
    if (t === 0) {
      const l = rng.int(10, 50), b = rng.int(8, 40), w = rng.int(1, 6), A = (l + 2 * w) * (b + 2 * w) - l * b;
      return mk(rng, U("m"), w, [
        [A / (2 * (l + b)), "Ignored the corner squares in the path area"],
        [w * 2, "Used the total added to each side as w"],
        [Math.max(1, w - 1), "Mis-solved the quadratic"],
        [w + 1, "Mis-solved the quadratic"],
      ], fin(d, `A ${pl} **${l} m × ${b} m** is surrounded on the outside by a path of uniform width. The area of the path is **${N(A)} m²**. Find the width of the path.`,
        [`Let the width be w: (${l} + 2w)(${b} + 2w) − ${l * b} = ${A}`, `4w² + ${2 * (l + b)}w − ${A} = 0`, `Testing w = ${w}: ${(l + 2 * w) * (b + 2 * w)} − ${l * b} = ${A}, so w = **${w} m**`],
        `Build the outer rectangle and test the options; the right w makes the outer area ${N(A + l * b)}.`,
        `A path adds 2w to both dimensions, so the formula is a quadratic, not a simple division.`, `${w}`));
    }
    if (t === 1) {
      const k = rng.int(1, 4), r = 7 * k, w = 7 * rng.int(1, 3), A = PI * ((r + w) * (r + w) - r * r);
      return mk(rng, A2("m"), A, [
        [PI * w * w, "Used the width as the radius"],
        [2 * PI * r * w, "Used circumference × width, ignoring the curve"],
        [PI * (r + w) * (r + w), "Gave the whole outer circle"],
        [PI * (r * r + w * w), "Added the squares"],
      ], fin(d, `A circular lawn of radius **${r} m** has a path **${w} m** wide running around it on the outside. Find the area of the path (π = 22/7).`,
        [`Outer radius = ${r} + ${w} = ${r + w} m`, `Area = π(${r + w}² − ${r}²) = 22/7 × ${(r + w) ** 2 - r * r}`, `= **${A2("m")(A)}**`],
        `π(R − r)(R + r) = 22/7 × ${w} × ${2 * r + w}.`, `The outer radius is r + w, and (r + w)² is not r² + w².`, `22/7*((${r}+${w})*(${r}+${w})-${r}*${r})`));
    }
    const l = rng.int(15, 60), b = rng.int(10, 40), w = rng.int(1, 4), rate = T(rng, [5, 6, 8, 10, 12, 15]);
    const A = (l - 2 * w) * (b - 2 * w);
    return mk(rng, M, A * rate, [
      [l * b * rate, "Used the whole area"],
      [(l * b - A) * rate, "Charged for the path instead of the lawn"],
      [(l - w) * (b - w) * rate, "Subtracted w once from each side"],
      [(l - 2 * w) * (b - 2 * w) * (rate + 1), "Used a wrong rate"],
    ], fin(d, `A ${pl} **${l} m × ${b} m** has a **${w} m** wide path inside its boundary all round. The remaining lawn is to be turfed at **${M(rate)} per m²**. Find the cost.`,
      [`Lawn = (${l} − ${2 * w}) × (${b} − ${2 * w}) = ${l - 2 * w} × ${b - 2 * w} = ${A} m²`, `Cost = ${A} × ${rate} = **${M(A * rate)}**`],
      `Shrink each side by 2w, multiply, then apply the rate.`, `Only the lawn is turfed; the path is excluded.`, `(${l}-2*${w})*(${b}-2*${w})*${rate}`));
  }) });

  /* ---------------------------------------------------------------- 5. % change in area */
  QB.gen("quant/mensuration-2d/pct-change-in-area", { title: "% change in area", gen: wrap((rng, d) => {
    const w = T(rng, WHO);
    if (d === "Easy") {
      const x = T(rng, [10, 20, 30, 40, 50, 100, 5, 25, 60, 80, 15, 12, 8, 16, 24, 32, 36, 44, 48, 64, 70, 90]), t = rng.int(0, 2), sq = T(rng, SQ);
      const A = (2 * x + x * x / 100);
      if (t === 0) {
        return mk(rng, P, A, [
          [x, "Assumed area changes by the same percentage"],
          [2 * x, "Doubled the percentage and ignored the cross term"],
          [x * x / 100, "Gave only the cross term"],
          [x / 2, "Halved the percentage"],
        ], fin(d, T(rng, [
          `The side of a ${sq} is increased by **${x}%**. By what percentage does its area increase?`,
          `Each side of a ${sq} is made **${x}%** longer. Find the percentage increase in its area.`,
          `${w} enlarges a square photograph by increasing every side by **${x}%**. What is the % increase in area?`]),
          [`New side = ${100 + x}% of the old, so new area = (1 + ${x}/100)² = ${R((1 + x / 100) ** 2)} times`, `Increase = **${P(R(A))}**`],
          `a + b + ab/100 with a = b = ${x}: ${x} + ${x} + ${R(x * x / 100)}.`,
          `${x}% longer sides do not give ${x}% more area; area depends on the product.`, `(1+${x}/100)*(1+${x}/100)*100-100`));
      }
      if (t === 1) {
        return mk(rng, P, A, [
          [x, "Assumed area changes by the same percentage"],
          [2 * x, "Doubled the percentage"],
          [x * x / 100, "Gave only the cross term"],
          [x * 3, "Tripled the percentage"],
        ], fin(d, T(rng, [`The radius of a circle is increased by **${x}%**. Find the percentage increase in its area.`, `The radius of a ${T(rng, ['round table', 'circular pond', 'pizza', 'round rangoli', 'circular lawn', 'coin'])} grows by **${x}%**. By what percentage does its area grow?`]),
          [`Area ∝ r², new area = (1 + ${x}/100)² = ${R((1 + x / 100) ** 2)} times`, `Increase = **${P(R(A))}**`],
          `Same as a + b + ab/100 with a = b = ${x}.`, `Area depends on r², so it grows faster than the radius.`, `(1+${x}/100)*(1+${x}/100)*100-100`));
      }
      const dd = T(rng, [10, 20, 30, 40, 50, 5, 15, 25, 12, 8, 16, 24]), dec = 2 * dd - dd * dd / 100;
      return mk(rng, P, dec, [
        [dd, "Assumed the area falls by the same percentage"],
        [2 * dd, "Doubled the percentage"],
        [2 * dd + dd * dd / 100, "Added the cross term instead of subtracting"],
        [dd * dd / 100, "Gave only the cross term"],
      ], fin(d, `Each side of a ${T(rng, SQ)} is **decreased by ${dd}%**. By what percentage does its area decrease?`,
        [`New side = ${100 - dd}%, so new area = ${R((1 - dd / 100) ** 2)} of the old`, `Decrease = 1 − ${R((1 - dd / 100) ** 2)} = **${P(R(dec))}**`],
        `−a − a + a²/100 = −${2 * dd} + ${R(dd * dd / 100)}.`, `A decrease gives a smaller loss than 2a because the cross term is added back.`, `100-(100-${dd})*(100-${dd})/100`));
    }
    if (d === "Medium") {
      const t = rng.int(0, 2);
      if (t === 0) {
        const a = T(rng, [10, 12, 15, 20, 25, 30, 40, 50, 60]), b = T(rng, [10, 12, 15, 20, 25, 30, 40, 50]), ch = a - b - a * b / 100;
        if (a === b) return null;
        return mk(rng, sg, ch, [
          [a - b, "Ignored the cross term"],
          [a + b - a * b / 100, "Treated the decrease as an increase"],
          [a - b + a * b / 100, "Added the cross term instead of subtracting"],
          [-(a - b - a * b / 100), "Reversed the sign of the answer"],
        ], fin(d, T(rng, [
          `The length of a ${T(rng, ['rectangle', 'rectangular plot', 'rectangular sheet', 'rectangular screen', 'rectangular carpet'])} is increased by **${a}%** and its breadth is decreased by **${b}%**. Find the net percentage change in its area (a "−" means a decrease).`,
          `${w} lengthens a rectangular sheet by **${a}%** but trims its width by **${b}%**. What is the net % change in the area? (A "−" means a decrease.)`]),
          [`Net change = a + b + ab/100 with a = +${a}, b = −${b}`, `= ${a} − ${b} − ${R(a * b / 100)} = **${sg(R(ch))}**`],
          `Use x + y + xy/100 with signs included.`, `The cross term takes the sign of the product (here negative).`, `${a}-${b}-${a}*${b}/100`), true);
      }
      if (t === 1) {
        const x = T(rng, [25, 100, 150, 300, 400, 900, 20, 60, 80, 40, 10, 50, 200, 700]), dec = 100 * x / (100 + x);
        if (!C(dec)) return null;
        return mk(rng, P, dec, [
          [x, "Used the same percentage for the decrease"],
          [100 - x, "Subtracted the increase from 100"],
          [x / 2, "Halved the percentage"],
          [100 * x / (100 - x > 0 ? 100 - x : 1), "Divided by the wrong base"],
        ], fin(d, `The length of a ${T(rng, ['rectangle', 'rectangular plot', 'rectangular sheet', 'rectangular screen', 'rectangular carpet'])} is increased by **${x}%**. By what percentage must the breadth be decreased so that the area stays the same?`,
          [`New length = ${100 + x}% of the old, so breadth must become 100/${100 + x} of the old`, `Decrease = (100 × ${x}) ÷ ${100 + x} = **${P(R(dec))}**`],
          `Required decrease = 100x/(100 + x).`, `The decrease is taken on the NEW (larger) length, so it is smaller than ${x}%.`, `100*${x}/(100+${x})`));
      }
      const x = T(rng, [10, 20, 30, 40, 50, 25, 60, 80, 15, 12, 24, 16]);
      const A = (200 * x + x * x) / 100;
      const k = rng.int(2, 60) * 20;
      return mk(rng, N, k * (1 + A / 100), [
        [k * (1 + 2 * x / 100), "Ignored the cross term"],
        [k * (1 + x / 100), "Used the same percentage for the area"],
        [k * A / 100, "Gave only the increase in area"],
        [k * (1 - A / 100), "Subtracted the increase"],
      ], fin(d, `A ${T(rng, SQ)} has area **${N(k)} ${T(rng, ["m²", "cm²"])}**. If every side is increased by **${x}%**, what is the new area?`,
        [`New area = ${N(k)} × (1 + ${x}/100)² = ${N(k)} × ${R((1 + x / 100) ** 2)}`, `= **${N(R(k * (1 + x / 100) ** 2))}**`],
        `Multiply the area by (1 + x/100)².`, `Squaring the factor is essential; do not just add ${x}%.`, `${k}*(1+${x}/100)*(1+${x}/100)`));
    }
    // Hard
    const t = rng.int(0, 2);
    if (t === 0) {
      const a = T(rng, [20, 25, 30, 40, 50, 60, 10, 15, 35, 45]), b = T(rng, [10, 20, 25, 30, 40, 5, 15]), k = rng.int(2, 60) * 100;
      const nA = k * (100 + a) * (100 - b) / 10000;
      if (!C(nA)) return null;
      return mk(rng, N, nA, [
        [k * (100 + a - b) / 100, "Ignored the cross term"],
        [k * (100 + a) * (100 + b) / 10000, "Treated the decrease as an increase"],
        [k * (100 - a) * (100 - b) / 10000, "Treated both changes as decreases"],
        [k * (a - b) / 100, "Gave only the net percentage of the area"],
      ], fin(d, `The area of a ${T(rng, ['rectangle', 'rectangular field', 'rectangular sheet', 'rectangular wall'])} is **${N(k)} m²**. Its length is increased by **${a}%** and breadth decreased by **${b}%**. Find the new area.`,
        [`New area = ${N(k)} × ${(100 + a) / 100} × ${(100 - b) / 100}`, `= **${N(R(nA))} m²**`],
        `Multiply by the two factors ${R((100 + a) / 100)} and ${R((100 - b) / 100)}.`, `Changes in length and breadth multiply; they do not add.`, `${k}*(100+${a})*(100-${b})/10000`));
    }
    if (t === 1) {
      const s = T(rng, [10, 20, 30, 40, 50, 60, 70, 80, 100, 5, 15, 25]), A1 = R(2 * s + s * s / 100);
      return mk(rng, P, s, [
        [A1, "Gave the area increase"],
        [A1 / 2, "Halved the area increase"],
        [A1 / 4, "Divided by 4"],
        [Math.sqrt(A1) * 2, "Mis-estimated the root"],
      ], fin(d, `The area of a ${T(rng, SQ)} increases by **${A1}%**. By what percentage did its side increase?`,
        [`New area = ${100 + A1}% of the old = ${R(1 + A1 / 100)} times`, `Side factor = √${R(1 + A1 / 100)} = ${R(Math.sqrt(1 + A1 / 100))}`, `Increase = **${P(s)}**`],
        `Side factor = √(1 + A/100).`, `Area grows as the square of the side, so take a root; do not copy the percentage.`, `(Math.sqrt(1+${A1}/100)-1)*100`));
    }
    const x = T(rng, [20, 25, 40, 50, 60, 100, 30, 10, 80, 120]), y = T(rng, [20, 25, 50, 10, 40, 30, 5]);
    const ch = (1 + x / 100) * (1 - y / 100) * 100 - 100;
    if (!C(ch) || x === y) return null;
    return mk(rng, sg, ch, [
      [x - y, "Ignored the cross term"],
      [x - y + x * y / 100, "Added the cross term with the wrong sign"],
      [(1 + x / 100) * (1 + y / 100) * 100 - 100, "Treated the decrease as an increase"],
      [-ch, "Reversed the sign"],
    ], fin(d, `A rectangular ${T(rng, ['carpet', 'banner', 'screen', 'bedsheet', 'poster'])} is made **${x}%** longer and **${y}%** narrower. What is the percentage change in its area? (A "−" means a decrease.)`,
      [`Factor = ${R(1 + x / 100)} × ${R(1 - y / 100)} = ${R((1 + x / 100) * (1 - y / 100))}`, `Change = **${sg(R(ch))}**`],
      `x − y − xy/100 (use signed values).`, `Changes multiply, so the area change is not simply x − y.`, `(1+${x}/100)*(1-${y}/100)*100-100`), true);
  }) });

  /* ---------------------------------------------------------------- 6. trapezium, rhombus, parallelogram */
  QB.gen("quant/mensuration-2d/trapezium-rhombus-parallelogram", { title: "Trapezium, rhombus, parallelogram", gen: wrap((rng, d) => {
    const u = T(rng, UNITS), f2 = A2(u), f1 = U(u);
    if (d === "Easy") {
      const t = rng.int(0, 2);
      if (t === 0) {
        const a = rng.int(6, 40), b = a + rng.int(2, 20), h = rng.int(4, 30);
        if (((a + b) * h) % 2) return null;
        return mk(rng, f2, (a + b) * h / 2, [
          [(a + b) * h, "Forgot the factor 1/2"],
          [a * b * h / 2, "Multiplied the parallel sides"],
          [(a + b) / 2, "Averaged the sides but left out the height"],
          [b * h, "Used one parallel side only"],
        ], fin(d, `The parallel sides of a trapezium are **${a} ${u}** and **${b} ${u}**, and the distance between them is **${h} ${u}**. Find its area.`,
          [`Area = ½ × (sum of parallel sides) × height`, `= ½ × (${a} + ${b}) × ${h} = **${f2((a + b) * h / 2)}**`],
          `Average the parallel sides, then multiply by the height.`, `Use the perpendicular distance, not a slanting side.`, `0.5*(${a}+${b})*${h}`));
      }
      if (t === 1) {
        const b = rng.int(5, 50), h = rng.int(4, 36), sl = h + rng.int(1, 6);
        return mk(rng, f2, b * h, [
          [b * sl, "Used the slant side instead of the height"],
          [b * h / 2, "Used the triangle formula"],
          [2 * (b + sl), "Gave the perimeter"],
          [b + h, "Added base and height"],
        ], fin(d, `A parallelogram has base **${b} ${u}**, a slanting side of **${sl} ${u}** and a perpendicular height of **${h} ${u}**. Find its area.`,
          [`Area = base × perpendicular height`, `= ${b} × ${h} = **${f2(b * h)}**`],
          `Base times the PERPENDICULAR height.`, `The slanting side is longer than the height; it must not be used for area.`, `${b}*${h}`));
      }
      const d1 = rng.int(3, 30) * 2, d2 = rng.int(3, 30);
      return mk(rng, f2, d1 * d2 / 2, [
        [d1 * d2, "Forgot the factor 1/2"],
        [d1 + d2, "Added the diagonals"],
        [d1 * d2 / 4, "Halved twice"],
        [2 * (d1 + d2), "Gave a perimeter-like sum"],
      ], fin(d, `The diagonals of a rhombus are **${d1} ${u}** and **${d2} ${u}**. Find its area.`,
        [`Area = ½ × d₁ × d₂`, `= ½ × ${d1} × ${d2} = **${f2(d1 * d2 / 2)}**`],
        `Half the product of the diagonals.`, `Without the ½ you get the rectangle around the rhombus.`, `0.5*${d1}*${d2}`));
    }
    if (d === "Medium") {
      const t = rng.int(0, 2), k = rng.int(1, 40);
      if (t === 0) {
        return mk(rng, f1, 20 * k, [
          [10 * k, "Gave the side instead of the perimeter"],
          [28 * k, "Added the diagonals"],
          [14 * k, "Added the half-diagonals once"],
          [24 * k * 2, "Used the area"],
        ], fin(d, `The diagonals of a ${T(rng, ['rhombus', 'rhombus-shaped kite', 'rhombus-shaped tile', 'rhombus-shaped flower bed', 'rhombus-shaped signboard'])} are **${6 * k} ${u}** and **${8 * k} ${u}**. Find its perimeter.`,
          [`Diagonals bisect at right angles: half-diagonals ${3 * k} and ${4 * k}`, `Side = √(${9 * k * k} + ${16 * k * k}) = ${5 * k}`, `Perimeter = 4 × ${5 * k} = **${f1(20 * k)}**`],
          `Half-diagonals form a 3-4-5 triangle with the side.`, `The side is the hypotenuse of a triangle on the HALF-diagonals.`, `4*Math.sqrt(${3 * k}*${3 * k}+${4 * k}*${4 * k})`));
      }
      if (t === 1) {
        return mk(rng, f2, 24 * k * k, [
          [30 * k * k, "Used side × diagonal"],
          [48 * k * k, "Forgot the ½"],
          [12 * k * k, "Halved twice"],
          [25 * k * k, "Gave the area of the square on the side"],
        ], fin(d, `A ${T(rng, ['rhombus', 'rhombus-shaped kite', 'rhombus-shaped tile', 'rhombus-shaped flower bed', 'rhombus-shaped signboard'])} has side **${5 * k} ${u}** and one diagonal **${6 * k} ${u}**. Find its area.`,
          [`Half of the known diagonal = ${3 * k}, so half of the other = √(${25 * k * k} − ${9 * k * k}) = ${4 * k}`, `Other diagonal = ${8 * k}`, `Area = ½ × ${6 * k} × ${8 * k} = **${f2(24 * k * k)}**`],
          `Side 5k with diagonal 6k gives the other diagonal 8k.`, `Use the half-diagonal in Pythagoras, not the whole diagonal.`, `0.5*${6 * k}*2*Math.sqrt(${25 * k * k}-${9 * k * k})`));
      }
      const a = rng.int(6, 60), b = rng.int(4, 40), h1 = rng.int(3, 30) * 2;
      if (a === b || (a * h1) % b) return null;
      const h2 = a * h1 / b;
      return mk(rng, f1, h2, [
        [b * h1 / a, "Inverted the ratio"],
        [h1, "Assumed both heights are equal"],
        [a * h1, "Gave the area"],
        [a + b - h1 > 0 ? a + b - h1 : h1 + 1, "Added and subtracted lengths"],
      ], fin(d, `A ${T(rng, ['parallelogram', 'parallelogram-shaped field', 'parallelogram-shaped plot', 'parallelogram-shaped tile'])} has adjacent sides **${a} ${u}** and **${b} ${u}**. The height on the side of **${a} ${u}** is **${h1} ${u}**. Find the height on the side of **${b} ${u}**.`,
        [`Area = ${a} × ${h1} = ${a * h1}`, `Height on ${b} = ${a * h1} ÷ ${b} = **${f1(h2)}**`],
        `Same area: base₁ × height₁ = base₂ × height₂.`, `The longer base has the smaller height.`, `${a}*${h1}/${b}`));
    }
    // Hard
    const t = rng.int(0, 2), k = rng.int(1, 8);
    if (t === 0) {
      const mid = rng.int(3, 20) * k;
      const b = mid, a = b + 6 * k;
      return mk(rng, f2, (a + b) * 4 * k / 2, [
        [(a + b) * 5 * k / 2, "Used the slant leg as the height"],
        [(a + b) * 4 * k, "Forgot the ½"],
        [(a + b) * 3 * k / 2, "Used the overhang as the height"],
        [a * b / 2, "Multiplied the parallel sides"],
      ], fin(d, `An isosceles trapezium has parallel sides **${a} ${u}** and **${b} ${u}** and equal slanting sides of **${5 * k} ${u}**. Find its area.`,
        [`Overhang on each side = (${a} − ${b}) ÷ 2 = ${3 * k}`, `Height = √(${5 * k}² − ${3 * k}²) = ${4 * k}`, `Area = ½ × (${a} + ${b}) × ${4 * k} = **${f2((a + b) * 2 * k)}**`],
        `Drop perpendiculars; the leg, overhang and height form a 3-4-5 triangle.`, `The slant side is not the height.`, `0.5*(${a}+${b})*Math.sqrt(${25 * k * k}-${9 * k * k})`));
    }
    if (t === 1) {
      const a = rng.int(4, 40) * 2, b = rng.int(3, 30) * 2;
      return mk(rng, f2, a * b / 2, [
        [a * b, "Used sin 90° instead of sin 30°"],
        [a * b / 4, "Halved twice"],
        [a * b * 0.866, "Used sin 60°"],
        [(a + b) * 2, "Gave the perimeter"],
      ], fin(d, `Two adjacent sides of a parallelogram are **${a} ${u}** and **${b} ${u}**, and the angle between them is **30°**. Find its area.`,
        [`Area = a × b × sin θ`, `= ${a} × ${b} × ½ = **${f2(a * b / 2)}**`],
        `Area = ab sin θ; at 30° it is ab/2.`, `Without a right angle, area is less than ab.`, `${a}*${b}*0.5`));
    }
    const a = rng.int(6, 40), h = rng.int(3, 20) * 2, df = rng.int(2, 10) * 2;
    const sum = (a + df) + a, A = sum * h / 2;
    return mk(rng, f1, a, [
      [a + df, "Gave the longer parallel side"],
      [A / h, "Divided the area by the height without doubling"],
      [a - df, "Subtracted instead of adding"],
      [sum, "Gave the sum of the parallel sides"],
    ], fin(d, `A trapezium has area **${N(A)} ${u}²** and height **${h} ${u}**. Its parallel sides differ by **${df} ${u}**. Find the shorter parallel side.`,
      [`Sum of parallel sides = 2 × ${N(A)} ÷ ${h} = ${sum}`, `Let the sides be x and x + ${df}: 2x + ${df} = ${sum}`, `x = **${f1(a)}**`],
      `Sum = 2A/h, then (sum − difference)/2.`, `2A/h gives the SUM of the parallel sides, not one of them.`, `(2*${A}/${h}-${df})/2`));
  }) });
})();
