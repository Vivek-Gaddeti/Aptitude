/* =====================================================================
   Geometry basics: generators for polygons and coordinate basics.
   Every wrong option is built from a real mistake with a "why" text.
   ===================================================================== */
(function () {
  const N = (x) => QB.num(x);
  const R = (x) => QB.round(x, 2);
  const C = (x) => isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const I = Number.isInteger;
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 95 };
  const rv = (x) => (Number.isInteger(x) ? x : R(x));
  const DEG = (x) => N(x) + "°";
  const PT = (x, y) => `(${N(x)}, ${N(y)})`;

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 1500; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("geometry: no clean question found");
    };
  }
  function mk(rng, f, ans, wrongs, extra, signed) {
    if (!C(ans)) return null;
    const A = f(rv(ans));
    const seen = new Set([A.toLowerCase()]);
    const pairs = [[A, null]];
    for (const w of wrongs) {
      if (pairs.length === 4) break;
      const v = w[0];
      if (!isFinite(v) || (!signed && v <= 0)) continue;
      const t = f(rv(v));
      if (seen.has(t.toLowerCase()) || /NaN|undefined|Infinity/.test(t)) continue;
      seen.add(t.toLowerCase());
      pairs.push([t, w[1]]);
    }
    if (pairs.length < 4) return null;
    const o = QB.options(rng, pairs);
    const calc = (extra.calc != null ? extra.calc : String(rv(ans))).replace(/--/g, "- -");
    return Object.assign({ time: TIME[extra.d] }, extra, o, { calc });
  }
  const fin = (d, q, sol, short, trap, calc) => ({ d, q, sol, short, trap, calc });

  const NAME = { 3: "triangle", 4: "quadrilateral", 5: "pentagon", 6: "hexagon", 7: "heptagon", 8: "octagon", 9: "nonagon", 10: "decagon", 12: "dodecagon" };
  const poly = (n) => NAME[n] ? NAME[n] : `polygon with ${n} sides`;
  const DIV = [3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 180];
  const diag = (n) => n * (n - 3) / 2;
  const WHO = ["Ravi", "Meena", "Arjun", "Kavya", "Imran", "Sneha", "Gopal", "Divya", "Harish", "Lakshmi"];

  /* ---------------------------------------------------------------- polygons */
  QB.gen("quant/geometry/polygons", { title: "Polygons (angles, diagonals)", gen: (rng, d) => {
    const lead = T(rng, ["", "", "", "Quick one: ", "From a practice sheet: ", "In an aptitude test: ", "Consider this. ", "Exam style: "]);
    const r = polyGen(rng, d);
    r.q = lead + r.q;
    return r;
  } });
  const polyGen = wrap((rng, d) => {
    const w = T(rng, WHO);
    if (d === "Easy") {
      const t = rng.int(0, 2);
      if (t === 0) {
        const n = rng.int(5, 120), S = (n - 2) * 180;
        return mk(rng, DEG, S, [
          [n * 180, "Used n × 180 instead of (n − 2) × 180"],
          [(n - 1) * 180, "Used (n − 1) × 180"],
          [(n - 2) * 360, "Used 360 in place of 180"],
          [(n - 3) * 180, "Used (n − 3) × 180"],
        ], fin(d, T(rng, [`Find the sum of the interior angles of a ${poly(n)}.`, `What is the total of all interior angles of a convex polygon with **${n}** sides?`, `${w} draws a convex polygon with **${n}** sides. Find the sum of its interior angles.`]),
          [`Sum = (n − 2) × 180°`, `= (${n} − 2) × 180° = **${S}°**`], `Split from one vertex into n − 2 triangles of 180° each.`, `Use n − 2, not n: the triangles number two fewer than the sides.`, `(${n}-2)*180`));
      }
      if (t === 1) {
        const n = T(rng, DIV), e = 360 / n, i = 180 - e;
        const ask = rng.chance(0.5);
        return mk(rng, DEG, ask ? i : e, [
          [ask ? e : i, ask ? "Gave the exterior angle" : "Gave the interior angle"],
          [(n - 2) * 180, "Gave the sum of interior angles"],
          [ask ? 360 / (n - 1) : 180 - 360 / (n - 1), "Used n − 1 sides"],
          [ask ? 180 + e : 360 - e, "Mixed up the angle sums"],
        ], fin(d, ask ? `Find each interior angle of a regular ${poly(n)}.` : `Find each exterior angle of a regular ${poly(n)}.`,
          [`Exterior angle = 360° ÷ ${n} = ${e}°`, ask ? `Interior angle = 180° − ${e}° = **${i}°**` : `So each exterior angle is **${e}°**`], ask ? `180 − 360/n.` : `360 ÷ n.`, `Interior and exterior angles at a vertex add up to 180°.`, ask ? `180-360/${n}` : `360/${n}`));
      }
      const n = rng.int(4, 90);
      return mk(rng, N, diag(n), [
        [n * (n - 1) / 2, "Counted every pair of vertices, including the sides"],
        [n * (n - 3), "Forgot to halve (each diagonal counted twice)"],
        [n * (n - 2) / 2, "Used n(n − 2)/2"],
        [n * (n - 3) / 2 + n, "Added the sides"],
      ], fin(d, T(rng, [`How many diagonals does a ${poly(n)} have?`, `Find the number of diagonals in a convex polygon of **${n}** sides.`]),
        [`Diagonals = n(n − 3)/2`, `= ${n} × ${n - 3} ÷ 2 = **${diag(n)}**`], `From each vertex, n − 3 diagonals; halve the total.`, `Each diagonal joins two vertices, so n(n − 3) counts it twice.`, `${n}*(${n}-3)/2`));
    }
    if (d === "Medium") {
      const t = rng.int(0, 3);
      if (t === 0) {
        const n = T(rng, DIV.filter((x) => x >= 5)), a = 180 - 360 / n;
        return mk(rng, N, n, [
          [360 / a, "Divided 360 by the interior angle"],
          [180 / (180 - a), "Used 180 instead of 360"],
          [n + 2, "Added 2 to the count"],
          [n - 2, "Subtracted 2 from the count"],
        ], fin(d, T(rng, [`Each interior angle of a regular polygon is **${a}°**. How many sides does it have?`, `${w} finds that every interior angle of a regular polygon measures **${a}°**. Find the number of sides.`]),
          [`Exterior angle = 180° − ${a}° = ${180 - a}°`, `n = 360 ÷ ${180 - a} = **${n}**`], `n = 360 ÷ (180 − interior).`, `Convert to the exterior angle first; 360 divided by the interior angle is wrong.`, `360/(180-${a})`));
      }
      if (t === 1) {
        const n = rng.int(5, 120), S = (n - 2) * 180;
        return mk(rng, N, n, [
          [S / 180, "Forgot to add the 2"],
          [S / 180 + 1, "Added 1 instead of 2"],
          [S / 360 + 2, "Divided by 360 instead of 180"],
          [S / 180 + 3, "Added 3"],
        ], fin(d, `The sum of the interior angles of a polygon is **${N(S)}°**. How many sides does it have?`,
          [`(n − 2) × 180 = ${N(S)}`, `n − 2 = ${S / 180}, so n = **${n}**`], `n = sum ÷ 180 + 2.`, `Add 2 back after dividing.`, `${S}/180+2`));
      }
      if (t === 2) {
        const n = rng.int(5, 90), D = diag(n);
        return mk(rng, N, n, [
          [D / 2, "Halved the number of diagonals"],
          [n + 1, "Off by one"],
          [n - 1, "Off by one"],
          [Math.round(Math.sqrt(2 * D)), "Took a rough square root of 2D"],
        ], fin(d, T(rng, [`A polygon has **${N(D)}** diagonals. How many sides does it have?`, `A convex polygon has exactly **${N(D)}** diagonals. Find its number of sides.`]),
          [`n(n − 3)/2 = ${N(D)}, so n(n − 3) = ${2 * D}`, `${n} × ${n - 3} = ${2 * D}, so n = **${n}**`], `Find two numbers differing by 3 whose product is 2D.`, `Remember n and n − 3 differ by 3; test factor pairs.`, `${n}`));
      }
      const n = T(rng, DIV.filter((x) => x >= 5)), e = 360 / n;
      return mk(rng, N, n, [
        [180 / e, "Used 180 instead of 360"],
        [360 / (180 - e), "Used the interior-angle formula with the exterior angle"],
        [n + 2, "Added 2"],
        [n - 2, "Subtracted 2"],
      ], fin(d, `Each exterior angle of a regular polygon is **${e}°**. Find the number of sides.`,
        [`n = 360 ÷ ${e} = **${n}**`], `Exterior angles of any convex polygon add to 360°.`, `The exterior angle sum is 360°, not 180°.`, `360/${e}`));
    }
    // Hard
    const t = rng.int(0, 3);
    if (t === 0) {
      const k = rng.int(2, 15), n = 2 * k + 2;
      return mk(rng, N, n, [
        [2 * k, "Solved n − 2 = 2k incorrectly"],
        [k + 2, "Used n = k + 2"],
        [2 * k + 1, "Off by one"],
        [2 * k + 3, "Off by one"],
      ], fin(d, `Each interior angle of a regular polygon is **${k}** times its exterior angle. Find the number of sides.`,
        [`Interior + exterior = 180°, so exterior = 180° ÷ ${k + 1}`, `n = 360 ÷ exterior = 360 × ${k + 1} ÷ 180 = **${n}**`], `n = 2(k + 1) = 2k + 2.`, `Interior and exterior angles are supplementary, so they sum to ${k + 1} equal parts.`, `2*${k}+2`));
    }
    if (t === 1) {
      const n = rng.int(5, 12), A = [];
      let tot = (n - 2) * 180, rem = tot;
      for (let i = 0; i < n - 1; i++) {
        const lo = 60, hi = 175, maxLeft = rem - (n - 1 - i) * 60;
        const v = Math.min(hi, Math.max(lo, Math.round((rem / (n - i)) / 5) * 5 + rng.int(-4, 4) * 5));
        A.push(v); rem -= v;
      }
      if (rem < 20 || rem > 179 || A.some((v) => v < 20)) return null;
      const sum = A.reduce((a, b) => a + b, 0);
      return mk(rng, DEG, rem, [
        [n * 180 - sum, "Used n × 180 for the sum"],
        [360 - sum % 360, "Used a 360° rule"],
        [(n - 1 - 2) * 180 - sum > 0 ? (n - 3) * 180 - sum : rem + 10, "Used (n − 3) × 180"],
        [rem + 20, "Arithmetic slip"],
      ], fin(d, `${n - 1} interior angles of a convex ${poly(n)} are ${A.map((v) => `**${v}°**`).join(", ")}. Find the remaining angle.`,
        [`Total = (${n} − 2) × 180° = ${(n - 2) * 180}°`, `Sum of given = ${sum}°`, `Remaining = ${(n - 2) * 180} − ${sum} = **${rem}°**`], `Total minus the known angles.`, `The total depends on n − 2 triangles, not n.`, `(${n}-2)*180-${sum}`));
    }
    if (t === 2) {
      const k = rng.int(2, 15), n = 2 * k + 3;
      return mk(rng, N, n, [
        [2 * k + 2, "Dropped the 3 in n − 3"],
        [2 * k, "Used n − 3 = 2k"],
        [k + 3, "Divided by 2 twice"],
        [2 * k + 4, "Off by one"],
      ], fin(d, `A polygon has **${k}** times as many diagonals as it has sides. How many sides does it have?`,
        [`n(n − 3)/2 = ${k}n`, `n − 3 = ${2 * k}, so n = **${n}**`], `Divide both sides by n: (n − 3)/2 = ${k}.`, `Cancel n carefully; do not divide the sides by 2 twice.`, `2*${k}+3`));
    }
    const n = T(rng, DIV.filter((x) => x >= 5)), e = 360 / n;
    return mk(rng, N, diag(n), [
      [n * (n - 3), "Forgot to halve"],
      [n * (n - 1) / 2, "Counted every pair of vertices"],
      [diag(n + 1), "Used n + 1 sides"],
      [diag(n - 1), "Used n − 1 sides"],
    ], fin(d, `Each exterior angle of a regular polygon is **${e}°**. How many diagonals does it have?`,
      [`n = 360 ÷ ${e} = ${n}`, `Diagonals = ${n} × ${n - 3} ÷ 2 = **${diag(n)}**`], `Get n from 360/e, then n(n − 3)/2.`, `Find the number of sides first.`, `${n}*(${n}-3)/2`));
  });

  /* ---------------------------------------------------------------- coordinate basics */
  const TRIP = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15]];
  const rc = (rng, lo, hi) => rng.int(lo, hi);
  QB.gen("quant/geometry/coordinate-basics", { title: "Coordinate basics (distance, midpoint, slope, area)", gen: wrap((rng, d) => {
    const sgn = (rng) => (rng.chance(0.5) ? 1 : -1);
    if (d === "Easy") {
      const t = rng.int(0, 2);
      if (t === 0) {
        const [a, b, c] = T(rng, TRIP), k = rng.int(1, 3), x1 = rc(rng, -12, 12), y1 = rc(rng, -12, 12);
        const x2 = x1 + sgn(rng) * a * k, y2 = y1 + sgn(rng) * b * k;
        return mk(rng, N, c * k, [
          [a * k + b * k, "Added the horizontal and vertical gaps"],
          [(a * a + b * b) * k * k, "Forgot the square root"],
          [Math.abs(b * k - a * k), "Subtracted the gaps"],
          [Math.abs(x2 - x1 + y2 - y1) || c * k + 1, "Added signed differences"],
        ], fin(d, `Find the distance between the points **A${PT(x1, y1)}** and **B${PT(x2, y2)}**.`,
          [`Horizontal gap = ${Math.abs(x2 - x1)}, vertical gap = ${Math.abs(y2 - y1)}`, `Distance = √(${Math.abs(x2 - x1)}² + ${Math.abs(y2 - y1)}²) = **${c * k}**`], `Spot the triple ${a}-${b}-${c} scaled by ${k}.`, `Distance is the hypotenuse, so squares are added before rooting.`, `Math.sqrt(${x2 - x1}*${x2 - x1}+${y2 - y1}*${y2 - y1})`), true);
      }
      if (t === 1) {
        const x1 = rc(rng, -20, 20), y1 = rc(rng, -20, 20), x2 = x1 + 2 * rc(rng, -12, 12), y2 = y1 + 2 * rc(rng, -12, 12), isx = rng.chance(0.5);
        if (x2 === x1 || y2 === y1) return null;
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        return mk(rng, N, isx ? mx : my, [
          [isx ? x1 + x2 : y1 + y2, "Gave the sum without halving"],
          [isx ? my : mx, "Gave the other coordinate"],
          [isx ? (x2 - x1) / 2 : (y2 - y1) / 2, "Halved the difference instead of the sum"],
          [isx ? x2 - x1 : y2 - y1, "Gave the difference"],
        ], fin(d, `The line segment joining **A${PT(x1, y1)}** and **B${PT(x2, y2)}** has midpoint M. Find the ${isx ? "x" : "y"}-coordinate of M.`,
          [`Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2)`, isx ? `x = (${N(x1)} + ${N(x2)})/2 = **${N(mx)}**` : `y = (${N(y1)} + ${N(y2)})/2 = **${N(my)}**`], `Average the two ${isx ? "x" : "y"} values.`, `The midpoint averages the coordinates; it does not use their difference.`, isx ? `(${x1}+${x2})/2` : `(${y1}+${y2})/2`), true);
      }
      const x1 = rc(rng, -10, 10), y1 = rc(rng, -10, 10), dx = rc(rng, 1, 8) * sgn(rng), m = rc(rng, -4, 4);
      if (m === 0) return null;
      const x2 = x1 + dx, y2 = y1 + m * dx;
      return mk(rng, N, m, [
        [1 / m, "Inverted the slope (run over rise)"],
        [-m, "Wrong sign (took the differences in different orders)"],
        [y2 - y1, "Gave the rise only"],
        [m + 1, "Arithmetic slip"],
      ], fin(d, `Find the slope of the line through **P${PT(x1, y1)}** and **Q${PT(x2, y2)}**.`,
        [`Slope = (y₂ − y₁)/(x₂ − x₁)`, `= (${N(y2)} − ${N(y1)})/(${N(x2)} − ${N(x1)}) = ${N(y2 - y1)}/${N(dx)} = **${N(m)}**`], `Rise over run, with both differences in the same order.`, `Subtract in the same order top and bottom, or the sign flips.`, `(${y2}-${y1})/(${x2}-${x1})`), true);
    }
    if (d === "Medium") {
      const t = rng.int(0, 3);
      if (t === 0) {
        const x1 = rc(rng, -10, 10), y1 = rc(rng, -10, 10), x2 = x1 + rc(rng, 1, 12) * sgn(rng), y2 = y1 + rc(rng, 1, 12) * sgn(rng), x3 = rc(rng, -10, 10), y3 = rc(rng, -10, 10);
        const twice = Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)), A = twice / 2;
        if (twice === 0) return null;
        return mk(rng, N, A, [
          [twice, "Forgot to halve"],
          [A / 2, "Halved twice"],
          [Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2) + 2) / 2, "Arithmetic slip inside the bracket"],
          [Math.abs((x2 - x1) * (y3 - y1)) / 2, "Used only part of the formula"],
        ], fin(d, `Find the area of the triangle with vertices **${PT(x1, y1)}**, **${PT(x2, y2)}** and **${PT(x3, y3)}** (square units).`,
          [`Area = ½ |x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)|`, `= ½ |${N(x1)}(${N(y2 - y3)}) + ${N(x2)}(${N(y3 - y1)}) + ${N(x3)}(${N(y1 - y2)})|`, `= ½ × ${twice} = **${N(A)}**`], `Shoelace formula; do not forget the modulus and the ½.`, `The absolute value keeps the area positive.`, `Math.abs(${x1}*(${y2}-${y3})+${x2}*(${y3}-${y1})+${x3}*(${y1}-${y2}))/2`));
      }
      if (t === 1) {
        const [a, b, c] = T(rng, TRIP), k = rng.int(1, 4), px = a * k * sgn(rng), py = b * k * sgn(rng);
        return mk(rng, N, c * k, [
          [a * k + b * k, "Added the coordinates' absolute values"],
          [(a * a + b * b) * k * k, "Forgot the square root"],
          [Math.max(a, b) * k, "Took the larger coordinate"],
          [c * k + a * k, "Added a coordinate to the distance"],
        ], fin(d, `Find the distance of the point **P${PT(px, py)}** from the origin.`,
          [`Distance = √(x² + y²) = √(${px * px} + ${py * py}) = √${(a * a + b * b) * k * k}`, `= **${c * k}**`], `Origin distance = √(x² + y²).`, `The negative signs vanish when squared.`, `Math.sqrt(${px}*${px}+${py}*${py})`), true);
      }
      if (t === 2) {
        const x1 = rc(rng, -10, 10), y1 = rc(rng, -10, 10), x2 = x1 + rc(rng, 1, 9) * sgn(rng), y2 = y1 + rc(rng, 1, 9) * sgn(rng), x3 = rc(rng, -10, 10), y3 = rc(rng, -10, 10), s = x1 + x2 + x3;
        if (s % 3) return null;
        return mk(rng, N, s / 3, [
          [s, "Forgot to divide by 3"],
          [(x1 + y1 + x2 + y2 + x3 + y3) / 3, "Averaged all six coordinates together"],
          [(y1 + y2 + y3) / 3, "Found the y-coordinate"],
          [s / 2, "Divided by 2"],
        ], fin(d, `The vertices of a triangle are **${PT(x1, y1)}**, **${PT(x2, y2)}** and **${PT(x3, y3)}**. Find the x-coordinate of its centroid.`,
          [`Centroid x = (x₁ + x₂ + x₃)/3`, `= (${N(x1)} + ${N(x2)} + ${N(x3)})/3 = **${N(s / 3)}**`], `Average of the three x-coordinates.`, `Divide by 3 for three vertices, not 2.`, `(${x1}+${x2}+${x3})/3`), true);
      }
      const x1 = rc(rng, -8, 8), y1 = rc(rng, -8, 8), dx = rc(rng, 1, 8), dy = rc(rng, 1, 12) * sgn(rng);
      if (QB.gcd(dx, Math.abs(dy)) === 1 && dx > 1 && Math.abs(dy) > 1 && false) return null;
      const m = dy / dx;
      return mk(rng, N, m, [
        [dx / dy, "Inverted (run over rise)"],
        [-m, "Wrong sign"],
        [dy - dx, "Subtracted the gaps"],
        [dy + dx, "Added the gaps"],
      ], fin(d, `Find the slope of the line joining **A${PT(x1, y1)}** and **B${PT(x1 + dx, y1 + dy)}**.`,
        [`Slope = ${N(dy)}/${N(dx)} = **${N(R(m))}**`], `Rise over run.`, `Slope is rise ÷ run, never run ÷ rise.`, `${dy}/${dx}`), true);
    }
    // Hard
    const t = rng.int(0, 3);
    if (t === 0) {
      const m1 = rc(rng, 1, 4), n1 = rc(rng, 1, 4), x1 = rc(rng, -10, 10), y1 = rc(rng, -10, 10);
      const sx = (m1 + n1) * rc(rng, 1, 4), sy = (m1 + n1) * rc(rng, 1, 4) * sgn(rng);
      const x2 = x1 + sx, y2 = y1 + sy, px = (m1 * x2 + n1 * x1) / (m1 + n1), isx = rng.chance(0.5);
      const py = (m1 * y2 + n1 * y1) / (m1 + n1);
      return mk(rng, N, isx ? px : py, [
        [isx ? (n1 * x2 + m1 * x1) / (m1 + n1) : (n1 * y2 + m1 * y1) / (m1 + n1), "Swapped m and n in the section formula"],
        [isx ? (x1 + x2) / 2 : (y1 + y2) / 2, "Used the midpoint"],
        [isx ? m1 * x2 + n1 * x1 : m1 * y2 + n1 * y1, "Forgot to divide by m + n"],
        [isx ? py : px, "Gave the other coordinate"],
      ], fin(d, `The point P divides the segment joining **A${PT(x1, y1)}** and **B${PT(x2, y2)}** internally in the ratio **${m1} : ${n1}** (A to B). Find the ${isx ? "x" : "y"}-coordinate of P.`,
        [`P = ((m·x₂ + n·x₁)/(m + n), (m·y₂ + n·y₁)/(m + n)) with m = ${m1}, n = ${n1}`, isx ? `x = (${m1}×${N(x2)} + ${n1}×${N(x1)})/${m1 + n1} = **${N(px)}**` : `y = (${m1}×${N(y2)} + ${n1}×${N(y1)})/${m1 + n1} = **${N(py)}**`], `Move ${m1}/${m1 + n1} of the way from A to B.`, `The ratio m : n pairs m with the FAR point B's coordinate.`, isx ? `(${m1}*${x2}+${n1}*${x1})/${m1 + n1}` : `(${m1}*${y2}+${n1}*${y1})/${m1 + n1}`), true);
    }
    if (t === 1) {
      const m = rc(rng, -4, 4), c0 = rc(rng, -6, 6), xa = rc(rng, -6, 4), xb = xa + rc(rng, 1, 5), xc = xb + rc(rng, 1, 5);
      if (m === 0) return null;
      const f = (x) => m * x + c0, k = f(xb);
      return mk(rng, N, k, [
        [(f(xa) + f(xc)) / 2 + 1, "Averaged the y values and slipped"],
        [-k, "Sign error"],
        [f(xb) + m, "Used the wrong step"],
        [xb, "Gave the x-coordinate"],
      ], fin(d, `The points **${PT(xa, f(xa))}**, **(${N(xb)}, k)** and **${PT(xc, f(xc))}** lie on one straight line. Find k.`,
        [`Slope between the outer points = (${N(f(xc))} − ${N(f(xa))})/(${N(xc)} − ${N(xa)}) = ${N(m)}`, `k = ${N(f(xa))} + ${N(m)} × (${N(xb)} − ${N(xa)}) = **${N(k)}**`], `Equal slopes; use the outer pair to find the slope.`, `Collinear points have the same slope between any two of them.`, `${f(xa)}+${m}*(${xb}-${xa})`), true);
    }
    if (t === 2) {
      const xa = rc(rng, -6, 6), ya = rc(rng, 1, 9) * sgn(rng), xb = xa + rc(rng, 1, 5) * 2, yb = rc(rng, 1, 9) * sgn(rng);
      const num = xb * xb + yb * yb - xa * xa - ya * ya, den = 2 * (xb - xa);
      if (num % den) return null;
      const x = num / den;
      return mk(rng, N, x, [
        [-x, "Sign error"],
        [(xa + xb) / 2, "Gave the midpoint's x-coordinate"],
        [num / (xb - xa), "Forgot the factor 2 in the denominator"],
        [num / den + 1, "Slipped by one"],
      ], fin(d, `Find the x-coordinate of the point on the x-axis that is equidistant from **A${PT(xa, ya)}** and **B${PT(xb, yb)}**.`,
        [`Let the point be (x, 0): (x − ${N(xa)})² + ${ya * ya} = (x − ${N(xb)})² + ${yb * yb}`, `Expand: ${N(-2 * xa)}x + ${xa * xa + ya * ya} = ${N(-2 * xb)}x + ${xb * xb + yb * yb}`, `x = **${N(x)}**`], `Set the squared distances equal; the x² terms cancel.`, `The point is not the midpoint unless the y-coordinates match.`, `(${xb}*${xb}+${yb}*${yb}-${xa}*${xa}-${ya}*${ya})/(2*(${xb}-${xa}))`), true);
    }
    const ax = rc(rng, -8, 8), ay = rc(rng, -8, 8), bx = ax + rc(rng, 2, 10), by = ay + rc(rng, -6, 6), cx = bx + rc(rng, 1, 8), cy = by + rc(rng, 1, 8), isx = rng.chance(0.5);
    const dx = ax + cx - bx, dy = ay + cy - by;
    return mk(rng, N, isx ? dx : dy, [
      [isx ? ax + bx - cx : ay + by - cy, "Opposite vertex found with the wrong pairing"],
      [isx ? bx + cx - ax : by + cy - ay, "Opposite vertex found with the wrong pairing"],
      [isx ? (ax + cx) / 2 : (ay + cy) / 2, "Gave the centre of the parallelogram"],
      [isx ? dy : dx, "Gave the other coordinate"],
    ], fin(d, `**A${PT(ax, ay)}**, **B${PT(bx, by)}** and **C${PT(cx, cy)}** are three consecutive vertices of a parallelogram ABCD. Find the ${isx ? "x" : "y"}-coordinate of D.`,
      [`Diagonals bisect each other: midpoint of AC = midpoint of BD`, `D = A + C − B`, isx ? `x = ${N(ax)} + ${N(cx)} − ${N(bx)} = **${N(dx)}**` : `y = ${N(ay)} + ${N(cy)} − ${N(by)} = **${N(dy)}**`], `D = A + C − B (B is the vertex opposite D).`, `The diagonals are AC and BD, so D is paired with B, not with A or C.`, isx ? `${ax}+${cx}-${bx}` : `${ay}+${cy}-${by}`), true);
  }) });
})();
