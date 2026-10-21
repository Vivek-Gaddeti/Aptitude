/* =====================================================================
   Mensuration 3D: seven generators (cube/cuboid, cylinder, cone, sphere,
   melting & recasting, water level rise, painting / tiling cost).
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
  const U = (u) => (x) => N(x) + " " + u;
  const V3 = (u) => (x) => N(x) + " " + u + "³";
  const A2 = (u) => (x) => N(x) + " " + u + "²";
  const WHO = ["Ravi", "Meena", "Arjun", "Kavya", "Imran", "Sneha", "Gopal", "Divya", "Harish", "Lakshmi", "Farhan", "Nisha"];

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 1500; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("mensuration-3d: no clean question found");
    };
  }
  const rv = (x) => (Number.isInteger(x) ? x : R(x));
  const snap = (x) => { const r0 = Math.round(x); return Math.abs(x - r0) < 1e-9 * Math.max(1, Math.abs(x)) ? r0 : x; };
  function mk(rng, f, ans, wrongs, extra, signed) {
    ans = snap(ans); wrongs = wrongs.map((w) => [snap(w[0]), w[1]]);
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
    const calc = extra.calc != null ? extra.calc : String(R(ans));
    return Object.assign({ time: TIME[extra.d] }, extra, o, { calc });
  }
  const fin = (d, q, sol, short, trap, calc) => ({ d, q, sol, short, trap, calc });

  const BOX = ["wooden box", "water tank", "packing carton", "storage crate", "iron block", "fish tank", "brick", "cardboard box", "toolbox", "godown"];
  const CYL = ["cylindrical tank", "cylindrical drum", "metal pipe", "water bottle", "oil can", "cylindrical pillar", "steel rod", "cylindrical container"];

  /* ---------------------------------------------------------------- 1. cube & cuboid */
  const DIAG = [[1, 2, 2], [2, 3, 6], [4, 4, 7], [2, 10, 11], [6, 6, 7], [2, 6, 9], [1, 4, 8], [4, 8, 8]];
  QB.gen("quant/mensuration-3d/cube-and-cuboid", { title: "Cube & cuboid", gen: wrap((rng, d) => {
    const u = T(rng, ["cm", "m", "cm", "m", "mm"]), f1 = U(u), f2 = A2(u), f3 = V3(u), ob = T(rng, BOX), w = T(rng, WHO);
    if (d === "Easy") {
      const t = rng.int(0, 2);
      if (t === 0) {
        const a = rng.int(2, 40);
        return mk(rng, f3, a * a * a, [
          [6 * a * a, "Found the surface area"],
          [3 * a, "Multiplied by 3 instead of cubing"],
          [a * a, "Squared the edge"],
          [12 * a, "Gave the total edge length"],
        ], fin(d, T(rng, [`Find the volume of a cube of edge **${a} ${u}**.`, `A cubical ${ob} has each edge **${a} ${u}**. What is its volume?`, `${w} has a cube-shaped ${ob} of side **${a} ${u}**. Find its volume.`]),
          [`Volume = a³ = ${a}³`, `= **${f3(a * a * a)}**`], `Cube the edge: ${a} × ${a} × ${a}.`, `Volume is cubed (${u}³); squaring gives the area of one face.`, `Math.pow(${a},3)`));
      }
      if (t === 1) {
        const l = rng.int(4, 40), b = rng.int(3, 30), h = rng.int(2, 25);
        return mk(rng, f3, l * b * h, [
          [2 * (l * b + b * h + h * l), "Found the total surface area"],
          [l * b + b * h + h * l, "Added the three face areas once"],
          [l + b + h, "Added the dimensions"],
          [2 * h * (l + b), "Found the lateral surface area"],
        ], fin(d, T(rng, [`A ${ob} is **${l} ${u}** long, **${b} ${u}** wide and **${h} ${u}** high. Find its volume.`, `Find the volume of a cuboid measuring **${l} ${u} × ${b} ${u} × ${h} ${u}**.`, `${w}'s ${ob} has length **${l} ${u}**, breadth **${b} ${u}** and height **${h} ${u}**. How much space does it occupy?`]),
          [`Volume = l × b × h`, `= ${l} × ${b} × ${h} = **${f3(l * b * h)}**`], `Multiply the three dimensions.`, `Surface area adds face areas; volume multiplies the three lengths.`, `${l}*${b}*${h}`));
      }
      const a = rng.int(2, 40);
      return mk(rng, f2, 6 * a * a, [
        [a * a * a, "Found the volume"],
        [4 * a * a, "Counted only four faces"],
        [a * a, "Found the area of one face"],
        [12 * a * a, "Doubled the surface area"],
      ], fin(d, T(rng, [`Find the total surface area of a cube of edge **${a} ${u}**.`, `A cubical ${ob} has edge **${a} ${u}**. What is its total surface area?`]),
        [`A cube has 6 equal square faces`, `TSA = 6a² = 6 × ${a * a} = **${f2(6 * a * a)}**`], `Area of one face × 6.`, `Six faces, not four: the top and bottom count in a TSA.`, `6*${a}*${a}`));
    }
    if (d === "Medium") {
      const t = rng.int(0, 3);
      if (t === 0) {
        const l = rng.int(4, 40), b = rng.int(3, 30), h = rng.int(2, 25), tsa = 2 * (l * b + b * h + h * l);
        return mk(rng, f2, tsa, [
          [l * b + b * h + h * l, "Forgot to double the face areas"],
          [2 * h * (l + b), "Found only the four side faces"],
          [l * b * h, "Gave the volume"],
          [2 * (l * b + b * h), "Left out one pair of faces"],
        ], fin(d, T(rng, [`Find the total surface area of a cuboid **${l} ${u} × ${b} ${u} × ${h} ${u}**.`, `A closed ${ob} measures **${l} ${u} × ${b} ${u} × ${h} ${u}**. Find the total area of its outer surface.`]),
          [`TSA = 2(lb + bh + hl)`, `= 2(${l * b} + ${b * h} + ${h * l}) = **${f2(tsa)}**`], `Three pairs of faces: add lb, bh, hl and double.`, `Every face has an equal partner, so the sum must be doubled.`, `2*(${l}*${b}+${b}*${h}+${h}*${l})`));
      }
      if (t === 1) {
        const [p, q, r] = T(rng, DIAG), k = rng.int(1, 8), dg = (p * p + q * q + r * r) ** 0.5 * k;
        return mk(rng, f1, dg, [
          [(p + q + r) * k, "Added the three dimensions"],
          [(p * p + q * q + r * r) * k * k, "Forgot the square root"],
          [Math.sqrt(p * p + q * q) * k + r * k, "Used a face diagonal and added the height"],
          [dg * 2, "Doubled the diagonal"],
        ], fin(d, `Find the length of the longest rod that fits inside a ${ob} measuring **${p * k} ${u} × ${q * k} ${u} × ${r * k} ${u}**.`,
          [`Space diagonal = √(l² + b² + h²)`, `= √(${p * p * k * k} + ${q * q * k * k} + ${r * r * k * k}) = √${dg * dg} = **${f1(dg)}**`], `Look for a quadruple like 1-2-2-3, 2-3-6-7, 4-4-7-9 scaled by ${k}.`, `The longest rod is the space diagonal, shorter than l + b + h but longer than any face diagonal.`, `Math.sqrt(${p * k}*${p * k}+${q * k}*${q * k}+${r * k}*${r * k})`));
      }
      if (t === 2) {
        const a = rng.int(2, 40);
        return mk(rng, f3, a * a * a, [
          [a * a, "Gave the area of a face"],
          [6 * a * a, "Gave the surface area itself"],
          [a * 6, "Gave 6 times the edge"],
          [Math.pow(a, 3) / 6, "Divided the volume by 6"],
        ], fin(d, `The total surface area of a cube is **${N(6 * a * a)} ${u}²**. Find its volume.`,
          [`6a² = ${N(6 * a * a)}, so a² = ${a * a} and a = ${a}`, `Volume = ${a}³ = **${f3(a * a * a)}**`], `Divide by 6, take the root, cube it.`, `The root of TSA/6 is the edge, not the volume.`, `Math.pow(Math.sqrt(${6 * a * a}/6),3)`));
      }
      const l = rng.int(4, 40), b = rng.int(3, 30), h = rng.int(2, 25);
      return mk(rng, f2, 2 * h * (l + b), [
        [2 * (l * b + b * h + h * l), "Gave the total surface area"],
        [h * (l + b), "Forgot to double"],
        [2 * l * b, "Gave top and bottom only"],
        [2 * h * l, "Used one pair of walls only"],
      ], fin(d, `The four walls of a room **${l} m × ${b} m** and **${h} m** high are to be whitewashed. Find the area of the walls in square metres.`.replace(/\bm\b/g, u),
        [`Walls = 2h(l + b)`, `= 2 × ${h} × (${l} + ${b}) = **${f2(2 * h * (l + b))}**`], `Perimeter of the floor × height.`, `Walls exclude the floor and ceiling.`, `2*${h}*(${l}+${b})`));
    }
    // Hard
    const t = rng.int(0, 2);
    if (t === 0) {
      const g = rng.int(2, 9), p = rng.int(1, 6), q = rng.int(1, 6), r = rng.int(1, 6);
      if (QB.gcd(QB.gcd(p, q), r) !== 1 || p * q * r < 4) return null;
      const n = p * q * r;
      return mk(rng, N, n, [
        [n * g, "Multiplied by the edge as well"],
        [p + q + r, "Added the counts along each edge"],
        [(g * p * g * q * g * r) / (g * g), "Divided by the face area instead of the cube volume"],
        [n + g, "Added the edge to the count"],
      ], fin(d, T(rng, [`A solid ${ob} **${g * p} ${u} × ${g * q} ${u} × ${g * r} ${u}** is cut into equal cubes of the largest possible size. How many cubes are obtained?`, `${w} cuts a block of **${g * p} × ${g * q} × ${g * r} ${u}** into identical cubes of the greatest possible edge. Find the number of cubes.`]),
        [`Largest edge = HCF(${g * p}, ${g * q}, ${g * r}) = ${g} ${u}`, `Count = (${p}) × (${q}) × (${r}) = **${n}**`], `HCF gives the edge; divide each dimension by it and multiply.`, `Divide each side by the edge first; dividing the volumes of different shapes is not enough without a common edge.`, `${p}*${q}*${r}`));
    }
    if (t === 1) {
      const [p, q, r] = T(rng, DIAG), k = rng.int(1, 6), l = p * k, b = q * k, h = r * k, s = l + b + h, dg = Math.sqrt(l * l + b * b + h * h);
      return mk(rng, f2, s * s - dg * dg, [
        [s * s, "Forgot to subtract the diagonal squared"],
        [s * s - dg, "Subtracted the diagonal, not its square"],
        [(s * s - dg * dg) / 2, "Halved the answer"],
        [dg * dg, "Gave the diagonal squared"],
      ], fin(d, `The sum of the length, breadth and height of a cuboid is **${s} ${u}** and its space diagonal is **${dg} ${u}**. Find its total surface area.`,
        [`(l + b + h)² = l² + b² + h² + 2(lb + bh + hl)`, `TSA = 2(lb + bh + hl) = ${s}² − ${dg}²`, `= ${s * s} − ${dg * dg} = **${f2(s * s - dg * dg)}**`], `TSA = (sum)² − (diagonal)².`, `2(lb + bh + hl) is exactly the cross terms of the square; no halving is needed.`, `${s}*${s}-${dg}*${dg}`));
    }
    const x = T(rng, [10, 20, 30, 40, 50, 100, 5, 15, 25, 60, 12, 8]), v = ((1 + x / 100) ** 3 - 1) * 100;
    return mk(rng, P, v, [
      [3 * x, "Tripled the percentage"],
      [x, "Assumed volume changes by the same percentage"],
      [((1 + x / 100) ** 2 - 1) * 100, "Gave the surface-area change"],
      [x * 3 + x * x / 100, "Left out the last cross term"],
    ], fin(d, `Each edge of a cube is increased by **${x}%**. Find the percentage increase in its volume.`,
      [`New volume = (1 + ${x}/100)³ = ${R((1 + x / 100) ** 3)} times`, `Increase = **${P(R(v))}**`], `Cube the growth factor and subtract 1.`, `Volume depends on the cube of the edge, so 3x% is only the first-order guess.`, `(Math.pow(1+${x}/100,3)-1)*100`));
  }) });

  /* ---------------------------------------------------------------- 2. cylinder */
  QB.gen("quant/mensuration-3d/cylinder", { title: "Cylinder", gen: wrap((rng, d) => {
    const ob = T(rng, CYL), k = rng.int(1, 12), r = 7 * k, w = T(rng, WHO);
    if (d === "Easy") {
      const t = rng.int(0, 2), u = T(rng, ["cm", "m"]), h = rng.int(2, 40);
      if (t === 0) {
        return mk(rng, V3(u), 154 * k * k * h, [
          [44 * k * h, "Used the curved-surface formula"],
          [22 * k * h, "Used πrh"],
          [154 * k * k, "Left out the height"],
          [154 * k * k * h * 2, "Doubled the volume"],
        ], fin(d, T(rng, [`A ${ob} has radius **${r} ${u}** and height **${h} ${u}**. Find its volume (π = 22/7).`, `${w} measures a ${ob} of base radius **${r} ${u}** and height **${h} ${u}**. What is the volume? (π = 22/7)`]),
          [`V = πr²h = 22/7 × ${r}² × ${h}`, `= 22 × ${7 * k * k} × ${h}/7 … = **${N(154 * k * k * h)} ${u}³**`.replace("22 × " + 7 * k * k + " × " + h + "/7 … ", "154 × " + k * k + " × " + h + " ")], `With r = 7k: V = 154k²h.`, `Volume uses r², not r.`, `22/7*${r}*${r}*${h}`));
      }
      if (t === 1) {
        return mk(rng, A2(u), 44 * k * h, [
          [154 * k * k * h, "Found the volume"],
          [22 * k * h, "Used πrh instead of 2πrh"],
          [44 * k * (r + h), "Gave the total surface area"],
          [44 * k + h, "Added instead of multiplying"],
        ], fin(d, `Find the curved surface area of a ${ob} with radius **${r} ${u}** and height **${h} ${u}** (π = 22/7).`,
          [`CSA = 2πrh = 2 × 22/7 × ${r} × ${h}`, `= 44 × ${k} × ${h} = **${N(44 * k * h)} ${u}²**`], `CSA = circumference × height = ${44 * k} × ${h}.`, `The curved surface leaves out the circular ends.`, `2*22/7*${r}*${h}`));
      }
      return mk(rng, A2(u), 44 * k * (r + h), [
        [44 * k * h, "Gave only the curved surface"],
        [44 * k * (2 * r + h), "Used 2r + h inside"],
        [44 * k * r + h, "Added h outside the bracket"],
        [154 * k * k * h, "Gave the volume"],
      ], fin(d, `Find the total surface area of a closed ${ob} with radius **${r} ${u}** and height **${h} ${u}** (π = 22/7).`,
        [`TSA = 2πr(r + h) = ${44 * k} × (${r} + ${h})`, `= **${N(44 * k * (r + h))} ${u}²**`], `2πr(r + h): circumference × (r + h).`, `A closed cylinder has two circular ends as well as the curved wall.`, `2*22/7*${r}*(${r}+${h})`));
    }
    if (d === "Medium") {
      const t = rng.int(0, 2);
      if (t === 0) {
        const h = rng.int(2, 60), V = 154 * k * k * h;
        return mk(rng, U("cm"), h, [
          [V / (22 * k), "Divided by 2πr instead of πr²"],
          [V / (154 * k), "Divided by πr once only"],
          [V / (44 * k * k), "Used 2πr² as the base area"],
          [h * 2, "Doubled the height"],
        ], fin(d, `The volume of a ${ob} of radius **${r} cm** is **${N(V)} cm³**. Find its height (π = 22/7).`,
          [`V = πr²h, so h = V ÷ πr²`, `πr² = ${154 * k * k}, so h = ${N(V)} ÷ ${154 * k * k} = **${h} cm**`], `Divide the volume by the base area ${154 * k * k}.`, `Divide by the base AREA (r²), not the circumference.`, `${V}/(22/7*${r}*${r})`));
      }
      if (t === 1) {
        const h = rng.int(2, 40) * 5, L = 154 * k * k * h / 1000;
        return mk(rng, (x) => N(x) + " litres", L, [
          [154 * k * k * h, "Forgot to convert cm³ to litres"],
          [L * 10, "Divided by 100 instead of 1000"],
          [L / 10, "Divided by 10,000"],
          [44 * k * h / 1000, "Used the curved surface"],
        ], fin(d, `A ${ob} has inner radius **${r} cm** and height **${h} cm**. How many litres of water can it hold? (π = 22/7; 1 litre = 1000 cm³)`,
          [`V = 22/7 × ${r}² × ${h} = ${N(154 * k * k * h)} cm³`, `Litres = ${N(154 * k * k * h)} ÷ 1000 = **${N(L)} litres**`], `Volume in cm³ ÷ 1000.`, `1 litre = 1000 cm³ (not 100 or 10,000).`, `22/7*${r}*${r}*${h}/1000`));
      }
      const b = rng.int(5, 60);
      return mk(rng, V3("cm"), 154 * k * k * b, [
        [44 * k * b, "Gave the curved area"],
        [154 * k * k * b * 2, "Doubled the volume"],
        [44 * k * 44 * k * b, "Used the circumference as the radius"],
        [154 * k * b, "Used πr·b"],
      ], fin(d, `A rectangular sheet **${44 * k} cm × ${b} cm** is rolled into a cylinder so that its **${44 * k} cm** side forms the circumference of the base. Find the volume of the cylinder (π = 22/7).`,
        [`2πr = ${44 * k}, so r = ${r} cm; height = ${b} cm`, `V = 22/7 × ${r}² × ${b} = **${N(154 * k * k * b)} cm³**`], `Circumference ${44 * k} gives r = ${r}; the other side is the height.`, `The rolled side becomes the circumference, not the radius.`, `22/7*${r}*${r}*${b}`));
    }
    // Hard
    const t = rng.int(0, 2);
    if (t === 0) {
      const a = rng.int(2, 14), b = rng.int(1, a - 1), h = rng.int(3, 60), R1 = 7 * a, r1 = 7 * b, V = PI * h * (R1 * R1 - r1 * r1);
      return mk(rng, V3("cm"), V, [
        [PI * h * (R1 - r1) * (R1 - r1), "Squared the thickness instead of using R² − r²"],
        [PI * h * R1 * R1, "Ignored the hollow"],
        [PI * h * (R1 * R1 + r1 * r1), "Added instead of subtracted"],
        [2 * PI * h * (R1 - r1), "Used circumference-style terms"],
      ], fin(d, `A hollow ${T(rng, ["metal pipe", "iron tube", "cylindrical pillar", "concrete pipe"])} is **${h} cm** long with outer radius **${R1} cm** and inner radius **${r1} cm**. Find the volume of the material (π = 22/7).`,
        [`V = πh(R² − r²) = 22/7 × ${h} × (${R1 * R1} − ${r1 * r1})`, `= **${N(R(V))} cm³**`], `π h (R − r)(R + r).`, `(R − r)² is not R² − r².`, `22/7*${h}*(${R1}*${R1}-${r1}*${r1})`));
    }
    if (t === 1) {
      const v = rng.int(1, 6) * (rng.chance(0.5) ? 1 : 2), L = 924 * k * k * v;
      return mk(rng, (x) => N(x) + " litres", L, [
        [154 * k * k * v * 100, "Forgot the minute conversion"],
        [L * 10, "Slipped a factor of 10"],
        [L / 10, "Slipped a factor of 10"],
        [154 * k * k * v * 6, "Divided by 1000 twice by mistake"],
      ], fin(d, `Water flows at **${v} m/s** through a cylindrical pipe of radius **${r} cm**. How many litres flow out in one minute? (π = 22/7)`,
        [`Cross-section = 22/7 × ${r}² = ${154 * k * k} cm²`, `Length per minute = ${v} × 100 × 60 = ${6000 * v} cm`, `Volume = ${154 * k * k} × ${6000 * v} = ${N(154 * k * k * 6000 * v)} cm³ = **${N(L)} litres**`], `Volume per minute = area × speed (cm/min), then ÷ 1000.`, `Keep units consistent: cm for the area, cm per minute for the speed.`, `22/7*${r}*${r}*${v}*100*60/1000`));
    }
    const h = rng.int(2, 40), V = 154 * k * k * h, tsa = 44 * k * (r + h);
    return mk(rng, A2("cm"), tsa, [
      [44 * k * h, "Gave the curved surface only"],
      [V / h, "Gave the base area"],
      [44 * k * (2 * r + h), "Counted the base twice"],
      [V / r, "Divided the volume by the radius"],
    ], fin(d, `A closed ${ob} has volume **${N(V)} cm³** and base radius **${r} cm**. Find its total surface area (π = 22/7).`,
      [`h = ${N(V)} ÷ (22/7 × ${r}²) = ${h} cm`, `TSA = 2πr(r + h) = ${44 * k} × (${r} + ${h}) = **${N(tsa)} cm²**`], `Get h from V first, then 2πr(r + h).`, `The surface area needs h, which must be found first.`, `2*22/7*${r}*(${r}+${V}/(22/7*${r}*${r}))`));
  }) });

  /* ---------------------------------------------------------------- 3. cone */
  const T3 = [[7, 24, 25], [21, 20, 29], [21, 28, 35], [14, 48, 50], [35, 12, 37], [28, 45, 53], [63, 16, 65], [42, 56, 70]];
  QB.gen("quant/mensuration-3d/cone", { title: "Cone (and frustum basics)", gen: wrap((rng, d) => {
    const ob = T(rng, ["conical tent", "ice-cream cone", "conical heap of sand", "conical vessel", "party hat", "conical funnel", "conical tower roof"]), w = T(rng, WHO);
    const sc = rng.int(1, 3), tr = T(rng, T3).map((v) => v * sc);
    if (d === "Easy") {
      const [r, h, l] = tr, t = rng.int(0, 2), u = T(rng, ["cm", "m"]);
      if (t === 0) {
        return mk(rng, V3(u), PI * r * r * h / 3, [
          [PI * r * r * h, "Forgot the factor 1/3"],
          [PI * r * l / 3, "Used the slant height in place of the height and r not squared"],
          [PI * r * r * l / 3, "Used the slant height instead of the height"],
          [PI * r * h / 3, "Used r instead of r²"],
        ], fin(d, T(rng, [`A ${ob} has base radius **${r} ${u}** and height **${h} ${u}**. Find its volume (π = 22/7).`, `${w} models a ${ob} with radius **${r} ${u}** and vertical height **${h} ${u}**. Find the volume. (π = 22/7)`]),
          [`V = ⅓πr²h = ⅓ × 22/7 × ${r}² × ${h}`, `= **${N(R(PI * r * r * h / 3))} ${u}³**`], `One third of the cylinder with the same base and height.`, `Use the vertical height, not the slant height.`, `22/7*${r}*${r}*${h}/3`));
      }
      if (t === 1) {
        return mk(rng, U(u), l, [
          [r + h, "Added radius and height"],
          [h - r > 0 ? h - r : l + 1, "Subtracted the sides"],
          [Math.sqrt(Math.abs(h * h - r * r)) || l + 2, "Subtracted the squares"],
          [l * l, "Forgot to take the root"],
        ], fin(d, `A cone has base radius **${r} ${u}** and height **${h} ${u}**. Find its slant height.`,
          [`l² = r² + h² = ${r * r} + ${h * h} = ${l * l}`, `l = **${U(u)(l)}**`], `Spot the triple ${r}-${h}-${l}.`, `The slant height is the hypotenuse, so add the squares.`, `Math.sqrt(${r}*${r}+${h}*${h})`));
      }
      return mk(rng, A2(u), PI * r * l, [
        [PI * r * h, "Used the height instead of the slant height"],
        [PI * r * l / 3, "Added the factor 1/3 from the volume formula"],
        [PI * r * (r + l), "Gave the total surface area"],
        [PI * r * r, "Gave the base area"],
      ], fin(d, `A ${ob} has base radius **${r} ${u}** and slant height **${l} ${u}**. Find its curved surface area (π = 22/7).`,
        [`CSA = πrl = 22/7 × ${r} × ${l}`, `= **${N(R(PI * r * l))} ${u}²**`], `CSA = πrl, no 1/3.`, `The curved area uses the slant height l, and no ⅓.`, `22/7*${r}*${l}`));
    }
    if (d === "Medium") {
      const [r, h, l] = tr, t = rng.int(0, 2);
      if (t === 0) {
        return mk(rng, A2("cm"), PI * r * (l + r), [
          [PI * r * l, "Gave the curved surface only"],
          [PI * r * (h + r), "Used height instead of slant height"],
          [PI * r * l + 2 * PI * r * r, "Counted two bases"],
          [PI * r * r * h / 3, "Gave the volume"],
        ], fin(d, T(rng, [`A solid cone has base radius **${r} cm** and height **${h} cm**. Find its total surface area (π = 22/7).`, `A ${ob} has base radius **${r} cm** and height **${h} cm**. Find the total surface area of the solid (π = 22/7).`]),
          [`l = √(${r}² + ${h}²) = ${l} cm`, `TSA = πr(l + r) = 22/7 × ${r} × ${l + r}`, `= **${N(R(PI * r * (l + r)))} cm²**`], `πr(l + r), with l from Pythagoras.`, `A solid cone has one base: add πr² once.`, `22/7*${r}*(Math.sqrt(${r}*${r}+${h}*${h})+${r})`));
      }
      if (t === 1) {
        const V = PI * r * r * h / 3;
        return mk(rng, U("cm"), h, [
          [3 * V / (PI * r), "Divided by πr instead of πr²"],
          [V / (PI * r * r), "Forgot the factor 3"],
          [l, "Gave the slant height"],
          [h * 3, "Multiplied by 3 twice"],
        ], fin(d, T(rng, [`The volume of a cone of base radius **${r} cm** is **${N(R(V))} cm³**. Find its height (π = 22/7).`, `A ${ob} of base radius **${r} cm** has volume **${N(R(V))} cm³**. What is its vertical height? (π = 22/7)`]),
          [`⅓πr²h = ${N(R(V))}`, `h = 3 × ${N(R(V))} ÷ (22/7 × ${r}²) = **${h} cm**`], `h = 3V ÷ πr².`, `Do not forget to multiply the volume by 3 when making h the subject.`, `3*${R(V)}/(22/7*${r}*${r})`));
      }
      return mk(rng, V3("cm"), PI * r * r * h / 3, [
        [PI * r * r * l / 3, "Used the slant height as the height"],
        [PI * r * r * h, "Forgot the factor 1/3"],
        [PI * r * l, "Gave the curved area"],
        [PI * r * r * (l - h) / 3, "Subtracted the heights"],
      ], fin(d, T(rng, [`A ${ob} has base radius **${r} cm** and slant height **${l} cm**. Find its volume (π = 22/7).`, `${w} measures a ${ob}: base radius **${r} cm**, slant height **${l} cm**. Find its volume. (π = 22/7)`]),
        [`h = √(${l}² − ${r}²) = ${h} cm`, `V = ⅓ × 22/7 × ${r}² × ${h} = **${N(R(PI * r * r * h / 3))} cm³**`], `Find h first: ${r}-${h}-${l}.`, `Volume needs the vertical height, not the slant.`, `22/7*${r}*${r}*Math.sqrt(${l}*${l}-${r}*${r})/3`));
    }
    // Hard
    const t = rng.int(0, 2);
    if (t === 0) {
      const a = rng.int(2, 8), b = rng.int(1, a - 1), R1 = 7 * a, r1 = 7 * b, h = rng.int(1, 14) * 3, V = PI * h / 3 * (R1 * R1 + R1 * r1 + r1 * r1);
      return mk(rng, V3("cm"), V, [
        [PI * h / 3 * (R1 * R1 + r1 * r1), "Left out the middle term Rr"],
        [PI * h * (R1 * R1 + R1 * r1 + r1 * r1), "Forgot the factor 1/3"],
        [PI * h / 3 * (R1 + r1) * (R1 + r1), "Used (R + r)²"],
        [PI * h * (R1 * R1 - r1 * r1) / 3, "Used R² − r² (hollow cylinder style)"],
      ], fin(d, `A ${T(rng, ["bucket", "flower pot", "lampshade", "water container"])} is a frustum of a cone with top radius **${R1} cm**, bottom radius **${r1} cm** and height **${h} cm**. Find its volume (π = 22/7).`,
        [`V = (πh/3)(R² + Rr + r²)`, `= (22/7 × ${h}/3) × (${R1 * R1} + ${R1 * r1} + ${r1 * r1})`, `= **${N(R(V))} cm³**`], `(πh/3)(R² + Rr + r²).`, `Do not drop the Rr term.`, `22/7*${h}/3*(${R1}*${R1}+${R1}*${r1}+${r1}*${r1})`));
    }
    if (t === 1) {
      const L = T(rng, [21, 28, 35, 42, 49, 56, 63, 70]), th = T(rng, [90, 120, 144, 180, 216, 240, 270, 72, 60, 150, 168]), r = L * th / 360;
      if (!I(r) || r < 3) return null;
      return mk(rng, U("cm"), r, [
        [L * th / 180, "Divided by 180 instead of 360"],
        [L, "Assumed the base radius equals the sector radius"],
        [L * (360 - th) / 360, "Used the other sector"],
        [r * 2, "Gave the diameter"],
      ], fin(d, `A sector of a circle of radius **${L} cm** and angle **${th}°** is bent to form a cone. Find the base radius of the cone.`,
        [`Arc length of the sector = (${th}/360) × 2π × ${L}`, `This becomes the base circumference 2πr, so r = ${L} × ${th}/360 = **${r} cm**`], `r = L × θ/360; the sector radius becomes the slant height.`, `The sector radius is the slant height, not the base radius.`, `${L}*${th}/360`));
    }
    const a = rng.int(2, 6), b = rng.int(1, a - 1), R1 = 7 * a, r1 = 7 * b, l = rng.int(3, 30), cs = PI * (R1 + r1) * l;
    return mk(rng, A2("cm"), cs, [
      [PI * (R1 - r1) * l, "Subtracted the radii"],
      [cs + PI * r1 * r1, "Added the bottom base as well"],
      [PI * R1 * l, "Used the larger radius only"],
      [2 * PI * (R1 + r1) * l, "Doubled the curved surface"],
    ], fin(d, `A frustum of a cone has radii **${R1} cm** and **${r1} cm** and slant height **${l} cm**. Find its curved surface area (π = 22/7).`,
      [`CSA = π(R + r)l = 22/7 × ${R1 + r1} × ${l}`, `= **${N(R(cs))} cm²**`], `π(R + r)l; the sum of the radii, not the difference.`, `Frustum CSA adds the radii.`, `22/7*(${R1}+${r1})*${l}`));
  }) });

  /* ---------------------------------------------------------------- 4. sphere & hemisphere */
  QB.gen("quant/mensuration-3d/sphere-and-hemisphere", { title: "Sphere & hemisphere", gen: wrap((rng, d) => {
    const ob = T(rng, ["metal ball", "football", "steel sphere", "globe", "solid sphere", "cricket-ball model", "spherical water tank"]), w = T(rng, WHO);
    const k = rng.int(1, 60), r = 7 * k, k3 = 3 * rng.int(1, 10), r3 = 7 * k3;
    if (d === "Easy") {
      const t = rng.int(0, 2), u = T(rng, ["cm", "m"]);
      if (t === 0) {
        return mk(rng, A2(u), 616 * k * k, [
          [PI * r * r, "Used πr² (area of a great circle)"],
          [2 * PI * r * r, "Used 2πr²"],
          [4 / 3 * PI * r * r * r, "Gave the volume formula"],
          [2 * PI * r, "Used the circumference"],
        ], fin(d, T(rng, [`Find the surface area of a ${ob} of radius **${r} ${u}** (π = 22/7).`, `${w} paints a ${ob} of radius **${r} ${u}**. What is the area to be painted? (π = 22/7)`]),
          [`SA = 4πr² = 4 × 22/7 × ${r}²`, `= **${N(616 * k * k)} ${u}²**`], `With r = 7k: SA = 616k².`, `Four times the area of the great circle.`, `4*22/7*${r}*${r}`));
      }
      if (t === 1) {
        const V = 4 / 3 * PI * r3 * r3 * r3;
        return mk(rng, V3(u), V, [
          [4 * PI * r3 * r3, "Gave the surface area"],
          [2 / 3 * PI * r3 * r3 * r3, "Gave a hemisphere's volume"],
          [PI * r3 * r3 * r3, "Used πr³"],
          [4 / 3 * PI * r3 * r3, "Used r² instead of r³"],
        ], fin(d, `Find the volume of a sphere of radius **${r3} ${u}** (π = 22/7).`,
          [`V = 4/3 × πr³ = 4/3 × 22/7 × ${r3}³`, `= **${N(R(V))} ${u}³**`], `4/3 × 22/7 × r³; cancel the 3 against a factor in r.`, `Volume has r³ and 4/3, not 4 and r².`, `4/3*22/7*Math.pow(${r3},3)`));
      }
      return mk(rng, A2(u), 308 * k * k, [
        [462 * k * k, "Gave the total surface area"],
        [616 * k * k, "Gave a full sphere"],
        [154 * k * k, "Gave only the flat face"],
        [44 * k * k, "Used 2πr with r in place of r²"],
      ], fin(d, `Find the curved surface area of a solid hemisphere of radius **${r} ${u}** (π = 22/7).`,
        [`Curved surface = 2πr² = 2 × 22/7 × ${r}²`, `= **${N(308 * k * k)} ${u}²**`], `Hemisphere curved area is half the sphere's: 308k².`, `The flat circular face is not part of the CURVED surface.`, `2*22/7*${r}*${r}`));
    }
    if (d === "Medium") {
      const t = rng.int(0, 2);
      if (t === 0) {
        return mk(rng, A2("cm"), 462 * k * k, [
          [308 * k * k, "Left out the flat circular face"],
          [616 * k * k, "Used the full sphere"],
          [154 * k * k * 4 / 3, "Mixed up with the volume formula"],
          [462 * k * k * 2, "Doubled"],
        ], fin(d, T(rng, [`Find the total surface area of a solid hemisphere of radius **${r} cm** (π = 22/7).`,`A ${T(rng, ['wooden bowl', 'solid dome', 'metal paperweight', 'solid hemispherical weight'])} is a solid hemisphere of radius **${r} cm**. Find its total surface area (π = 22/7).`, `A solid hemisphere has radius **${r} cm**. Find its total surface area, including the flat face (π = 22/7).`]),
          [`TSA = 2πr² + πr² = 3πr²`, `= 3 × 22/7 × ${r}² = **${N(462 * k * k)} cm²**`], `3πr² = 462k².`, `Solid hemisphere: curved part plus the flat circle.`, `3*22/7*${r}*${r}`));
      }
      if (t === 1) {
        const S = 616 * k * k;
        return mk(rng, U("cm"), r, [
          [r * 2, "Gave the diameter"],
          [S / (4 * PI) / r, "Mis-divided"],
          [Math.sqrt(S / (2 * PI)), "Used 2πr² instead of 4πr²"],
          [S / (4 * PI), "Forgot the square root"],
        ], fin(d, T(rng, [`The surface area of a sphere is **${N(S)} cm²**. Find its radius (π = 22/7).`, `A ${ob} has surface area **${N(S)} cm²**. Find its radius. (π = 22/7)`]),
          [`4πr² = ${N(S)}`, `r² = ${N(S)} ÷ (88/7) = ${r * r}`, `r = **${r} cm**`], `r² = S ÷ (4π) = S × 7/88.`, `Take the square root after dividing.`, `Math.sqrt(${S}/(4*22/7))`));
      }
      const V = 2 / 3 * PI * r3 * r3 * r3 / 1000;
      return mk(rng, (x) => N(x) + " litres", V, [
        [V * 2, "Used the full sphere"],
        [V * 1000, "Forgot the cm³ to litre conversion"],
        [V / 10, "Slipped a factor of 10"],
        [PI * r3 * r3 * r3 / 3000, "Used πr³/3"],
      ], fin(d, T(rng, [`A hemispherical bowl has internal radius **${r3} cm**. How many litres does it hold? (π = 22/7; 1 litre = 1000 cm³)`, `A ${T(rng, ['hemispherical tank', 'hemispherical vessel', 'dome-shaped cooking pot', 'hemispherical water bowl'])} has an inner radius of **${r3} cm**. Find its capacity in litres. (π = 22/7; 1 litre = 1000 cm³)`, `${w} fills a hemispherical ${T(rng, ['bowl', 'basin', 'pot'])} of internal radius **${r3} cm** with milk. How many litres of milk does it hold? (π = 22/7; 1 litre = 1000 cm³)`]),
        [`V = 2/3 × πr³ = 2/3 × 22/7 × ${r3}³ = ${N(R(V * 1000))} cm³`, `Litres = **${N(R(V))}**`], `Hemisphere = 2/3 πr³.`, `A hemisphere is half the sphere's 4/3: so 2/3.`, `2/3*22/7*Math.pow(${r3},3)/1000`));
    }
    // Hard
    const t = rng.int(0, 2);
    if (t === 0) {
      const a = 3 * rng.int(1, 3) + rng.int(0, 1) * 0, b = a - 3 * rng.int(1, 1);
      const A = rng.int(2, 30), B = rng.int(1, A - 1);
      if ((A - B) % 3) return null;
      const Ro = 7 * A, ri = 7 * B, V = 4 / 3 * PI * (Ro ** 3 - ri ** 3);
      return mk(rng, V3("cm"), V, [
        [4 / 3 * PI * (Ro - ri) ** 3, "Cubed the thickness"],
        [4 / 3 * PI * Ro ** 3, "Ignored the hollow"],
        [4 * PI * (Ro * Ro - ri * ri), "Used the surface-area difference"],
        [4 / 3 * PI * (Ro ** 3 + ri ** 3), "Added the cubes"],
      ], fin(d, `A hollow ${T(rng, ['spherical shell', 'metal ball', 'iron sphere', 'spherical tank'])} has outer radius **${Ro} cm** and inner radius **${ri} cm**. Find the volume of the metal (π = 22/7).`,
        [`V = 4/3 π (R³ − r³) = 4/3 × 22/7 × (${Ro ** 3} − ${ri ** 3})`, `= **${N(R(V))} cm³**`], `Subtract the cubes, then apply 4/3 π.`, `(R − r)³ is not R³ − r³.`, `4/3*22/7*(${Ro}**3-${ri}**3)`));
    }
    if (t === 1) {
      const TS = 462 * k3 * k3, V = 2 / 3 * PI * r3 ** 3;
      return mk(rng, V3("cm"), V, [
        [4 / 3 * PI * r3 ** 3, "Used the full sphere's volume"],
        [TS * r3 / 3, "Used a wrong formula for volume"],
        [2 / 3 * PI * r3 ** 2, "Used r² in the volume"],
        [PI * r3 ** 3 / 3, "Used πr³/3"],
      ], fin(d, `The total surface area of a ${T(rng, ['solid hemisphere', 'solid hemispherical dome', 'hemispherical weight', 'hemispherical block'])} is **${N(TS)} cm²**. Find its volume (π = 22/7).`,
        [`3πr² = ${N(TS)}, so r² = ${r3 * r3} and r = ${r3} cm`, `V = 2/3 × 22/7 × ${r3}³ = **${N(R(V))} cm³**`], `3πr² gives r; then 2/3 πr³.`, `Find the radius first; the TSA is not the CURVED area.`, `2/3*22/7*Math.pow(Math.sqrt(${TS}/(3*22/7)),3)`));
    }
    return mk(rng, A2("cm"), 2 * PI * r * r, [
      [PI * r * r, "Added only one cut face"],
      [4 * PI * r * r, "Doubled"],
      [PI * r * r * 3, "Gave the hemisphere TSA"],
      [2 * PI * r, "Used a circumference"],
    ], fin(d, T(rng, [`A ${ob} of radius **${r} cm** is cut into two equal hemispheres. By how much does the total surface area increase? (π = 22/7)`, `${w} saws a solid ${ob} of radius **${r} cm** exactly through its centre. Find the increase in the total surface area of the pieces. (π = 22/7)`, `A solid sphere of radius **${r} cm** is split into two identical halves. How much extra surface area (in cm²) is created? (π = 22/7)`]),
      [`Cutting exposes two new circular faces, each πr²`, `Increase = 2πr² = 2 × 22/7 × ${r}² = **${N(R(2 * PI * r * r))} cm²**`], `Two new flat faces: 2πr² = 308k².`, `The cut adds two circles (one on each half).`, `2*22/7*${r}*${r}`));
  }) });

  /* ---------------------------------------------------------------- 5. melting & recasting */
  QB.gen("quant/mensuration-3d/melting-and-recasting", { title: "Melting & recasting", gen: wrap((rng, d) => {
    const w = T(rng, WHO), met = T(rng, ["copper", "iron", "lead", "silver", "brass", "steel", "gold", "aluminium"]);
    if (d === "Easy") {
      const t = rng.int(0, 2);
      if (t === 0) {
        const rr = rng.int(1, 8), q = rng.int(2, 7), Rr = rr * q;
        return mk(rng, N, q ** 3, [
          [q * q, "Used the ratio of areas"],
          [q, "Used the ratio of radii"],
          [q ** 3 * 2, "Doubled the count"],
          [q ** 3 / 2 + 1, "Used a hemisphere-style halving"],
        ], fin(d, T(rng, [`A solid ${met} sphere of radius **${Rr} cm** is melted and recast into small spheres of radius **${rr} cm**. How many small spheres are made?`, `${w} melts a ${met} ball of radius **${Rr} cm** into identical balls of radius **${rr} cm**. How many balls can be made?`]),
          [`Number = (R/r)³ = (${Rr}/${rr})³`, `= ${q}³ = **${q ** 3}**`], `Volumes scale as radius cubed: (R/r)³.`, `Volume, not radius or area, is conserved.`, `Math.pow(${Rr}/${rr},3)`));
      }
      if (t === 1) {
        const a = rng.int(2, 12) * 2, l = a * 2, b = rng.int(1, a / 2) * 2, h = a * a * a / (l * b);
        if (!I(h) || b === a) return null;
        return mk(rng, U("cm"), h, [
          [a, "Assumed the height stays the same"],
          [a * a * a / (l + b), "Divided by the sum of the dimensions"],
          [a * a / b, "Used areas"],
          [h * 2, "Doubled"],
        ], fin(d, `A ${met} cube of edge **${a} cm** is melted and recast into a cuboid with length **${l} cm** and breadth **${b} cm**. Find the height of the cuboid.`,
          [`Volume stays the same: ${a}³ = ${l} × ${b} × h`, `h = ${a ** 3} ÷ ${l * b} = **${h} cm**`], `Equate volumes: a³ = l b h.`, `Melting preserves volume, not surface area.`, `${a}**3/(${l}*${b})`));
      }
      const c = rng.int(1, 6), q = rng.int(2, 8), a = c * q;
      return mk(rng, N, q ** 3, [
        [q * q, "Used the ratio of face areas"],
        [q, "Used the ratio of edges"],
        [q ** 3 * 6, "Multiplied by 6"],
        [q ** 3 - 1, "Subtracted one"],
      ], fin(d, `A ${met} cube of edge **${a} cm** is melted into small cubes of edge **${c} cm**. How many small cubes are made?`,
        [`Number = (${a}/${c})³ = ${q}³ = **${q ** 3}**`], `(big edge ÷ small edge) cubed.`, `Count by volume: edges cubed.`, `Math.pow(${a}/${c},3)`));
    }
    if (d === "Medium") {
      const t = rng.int(0, 2);
      if (t === 0) {
        const m = rng.int(1, 12), Rr = 3 * m, rw = T(rng, [1, 2, 3, 6]), len = 4 * Rr ** 3 / (3 * rw * rw);
        if (!I(len)) return null;
        return mk(rng, U("cm"), len, [
          [4 * Rr ** 3 / (3 * rw), "Divided by r instead of r²"],
          [4 * Rr * Rr / (3 * rw * rw), "Used R² instead of R³"],
          [Rr ** 3 / (rw * rw), "Dropped the 4/3"],
          [len * 2, "Doubled"],
        ], fin(d, `A ${met} sphere of radius **${Rr} cm** is drawn into a wire of circular cross-section with radius **${rw} cm**. Find the length of the wire.`,
          [`4/3 π ${Rr}³ = π ${rw}² × L`, `L = 4 × ${Rr ** 3} ÷ (3 × ${rw * rw}) = **${N(len)} cm**`], `L = 4R³ ÷ (3r²).`, `The wire is a cylinder: its volume uses r² × length.`, `4*${Rr}**3/(3*${rw}*${rw})`));
      }
      if (t === 1) {
        const rho = rng.int(1, 5), n = rng.int(2, 20) * 3, rc = rng.int(2, 12) * 3;
        const h = 4 * n * rho ** 3 / (3 * rc * rc);
        if (!I(h)) return null;
        return mk(rng, U("cm"), h, [
          [h * 3 / 4, "Used the sphere volume as πr³"],
          [n * rho ** 3 / (rc * rc), "Dropped the 4/3"],
          [h * 2, "Doubled"],
          [4 * n * rho * rho / (3 * rc * rc), "Used ρ² for the sphere"],
        ], fin(d, `${n} solid ${met} spheres, each of radius **${rho} cm**, are melted and cast into one solid cylinder of radius **${rc} cm**. Find the height of the cylinder.`,
          [`${n} × 4/3 π ${rho}³ = π ${rc}² × h`, `h = 4 × ${n} × ${rho ** 3} ÷ (3 × ${rc * rc}) = **${h} cm**`], `h = 4 n ρ³ ÷ (3 r²).`, `Spheres have 4/3 πρ³ each; do not drop the 4/3.`, `4*${n}*${rho}**3/(3*${rc}*${rc})`));
      }
      const rr = rng.int(2, 14), h = rng.int(1, 12) * 3, Rc = rng.int(1, 8) * 2, hc = rr * rr * h / (3 * Rc * Rc);
      if (!C(hc)) return null;
      return mk(rng, U("cm"), hc, [
        [rr * rr * h / (Rc * Rc), "Forgot the 1/3 of the cone"],
        [rr * rr * h / (3 * Rc), "Divided by R, not R²"],
        [3 * rr * rr * h / (Rc * Rc), "Multiplied by 3 instead of dividing"],
        [h / 3, "Assumed the radius is unchanged"],
      ], fin(d, `A solid ${met} cone of base radius **${rr} cm** and height **${h} cm** is melted and recast into a cylinder of radius **${Rc} cm**. Find the height of the cylinder.`,
        [`⅓π ${rr}² × ${h} = π ${Rc}² × H`, `H = ${rr * rr} × ${h} ÷ (3 × ${Rc * Rc}) = **${N(R(hc))} cm**`], `H = r² h ÷ (3 R²).`, `A cone holds one third of a cylinder with the same base and height.`, `${rr}*${rr}*${h}/(3*${Rc}*${Rc})`));
    }
    // Hard
    const t = rng.int(0, 2);
    if (t === 0) {
      const [a, b, c, s] = T(rng, [[3, 4, 5, 6], [1, 6, 8, 9], [6, 8, 10, 12], [9, 12, 15, 18], [12, 16, 20, 24]]);
      const k = T(rng, [1, 1, 1]);
      return mk(rng, U("cm"), s, [
        [a + b + c, "Added the radii"],
        [Math.round(Math.sqrt(a * a + b * b + c * c)), "Combined the radii like sides of a box"],
        [Math.round(Math.cbrt(a ** 3 + b ** 3 + c ** 3 + a * b * c)), "Mis-added one of the cubes"],
        [s + 1, "Rounded the cube root wrongly"],
      ], fin(d, `Three solid ${met} spheres of radii **${a} cm**, **${b} cm** and **${c} cm** are melted into one sphere. Find the radius of the new sphere.`,
        [`R³ = ${a}³ + ${b}³ + ${c}³ = ${a ** 3} + ${b ** 3} + ${c ** 3} = ${s ** 3}`, `R = **${s} cm**`], `Add the cubes, then take the cube root.`, `Radii do not add; volumes do (radius cubed).`, `Math.cbrt(${a}**3+${b}**3+${c}**3)`));
    }
    if (t === 1) {
      const r = rng.int(2, 16), h = rng.int(1, 12) * 3, hh = h / 3, n = 3 * h / hh;
      const hc = T(rng, [hh, hh]), cnt = rng.int(2, 8);
      const hcone = h / cnt * 3;
      if (!I(hcone)) return null;
      return mk(rng, N, cnt, [
        [cnt * 3, "Forgot the 1/3 of the cone"],
        [Math.round(cnt / 3) || cnt + 1, "Divided by 3 instead of multiplying"],
        [cnt * 2, "Used a hemisphere-like factor"],
        [cnt + 1, "Off by one"],
      ], fin(d, `A solid ${met} cylinder of radius **${r} cm** and height **${h} cm** is melted and recast into cones, each of the same radius **${r} cm** and height **${hcone} cm**. How many cones are made?`,
        [`Cylinder = πr²h; one cone = ⅓πr²(${hcone})`, `Number = ${h} ÷ (${hcone}/3) = **${cnt}**`], `Same base: count = 3h ÷ h(cone).`, `A cone is a third of the cylinder on the same base and height.`, `3*${h}/${hcone}`));
    }
    const c = rng.int(1, 8), q = rng.int(2, 5), a = c * q, inc = 6 * a * a * (q - 1);
    return mk(rng, N, inc, [
      [6 * a * a, "Gave the original surface area"],
      [6 * a * a * q * q, "Used q² times the surface area"],
      [6 * a * a * (q * q - 1), "Used the area ratio q²"],
      [6 * c * c * q ** 3, "Gave the new total instead of the increase"],
    ], fin(d, `A ${met} cube of edge **${a} cm** is melted and recast into **${q ** 3}** equal small cubes. By how many cm² does the total surface area increase?`,
      [`Small edge = ${a} ÷ ${q} = ${c} cm`, `Old area = 6 × ${a}² = ${6 * a * a}; new area = ${q ** 3} × 6 × ${c}² = ${6 * c * c * q ** 3}`, `Increase = **${N(inc)} cm²**`], `New total = q × old total when the edge is divided by q.`, `Volume is conserved but surface area is not.`, `${q ** 3}*6*${c}*${c}-6*${a}*${a}`));
  }) });

  /* ---------------------------------------------------------------- 6. water level rise */
  QB.gen("quant/mensuration-3d/water-level-rise", { title: "Water level rise", gen: wrap((rng, d) => {
    const w = T(rng, WHO);
    if (d === "Easy") {
      const t = rng.int(0, 2);
      if (t === 0) {
        const a = rng.int(2, 20), l = rng.int(2, 25) * 5, b = rng.int(2, 20) * 5, rise = a ** 3 / (l * b);
        return mk(rng, U("cm"), rise, [
          [a ** 3 / (l + b), "Divided by the sum of the sides"],
          [a * a / (l * b), "Used the cube's face area"],
          [a ** 3 / l, "Divided by the length only"],
          [rise * 10, "Slipped a decimal place"],
        ], fin(d, T(rng, [`A cube of edge **${a} cm** is dropped into a rectangular tank of base **${l} cm × ${b} cm** containing water. By how much does the water level rise?`, `${w} drops a metal cube of side **${a} cm** into a tank with a base of **${l} cm × ${b} cm**. Find the rise in water level.`]),
          [`Displaced volume = ${a}³ = ${a ** 3} cm³`, `Rise = volume ÷ base area = ${a ** 3} ÷ ${l * b} = **${N(R(rise))} cm**`], `Rise = displaced volume ÷ base area of the tank.`, `The level rises over the whole tank base, not the cube's base.`, `${a}**3/(${l}*${b})`));
      }
      if (t === 1) {
        const lit = rng.int(1, 40) * 50, l = rng.int(2, 12) * 10, b = rng.int(2, 10) * 10, rise = lit * 1000 / (l * b);
        return mk(rng, U("cm"), rise, [
          [lit / (l * b), "Forgot to convert litres to cm³"],
          [rise / 10, "Slipped a factor of 10"],
          [rise * 10, "Slipped a factor of 10"],
          [lit * 100 / (l * b), "Used 100 cm³ per litre"],
        ], fin(d, `A rectangular tank has a base of **${l} cm × ${b} cm**. By how many cm does the water level rise when **${N(lit)} litres** are poured in? (1 litre = 1000 cm³)`,
          [`Volume = ${N(lit)} × 1000 = ${N(lit * 1000)} cm³`, `Rise = ${N(lit * 1000)} ÷ ${l * b} = **${N(R(rise))} cm**`], `Litres × 1000 ÷ base area.`, `1 litre = 1000 cm³.`, `${lit}*1000/(${l}*${b})`));
      }
      const l = rng.int(3, 15) * 10, b = rng.int(3, 12) * 10, h = rng.int(2, 10) * 5, rise = l * b * h / (l * b * 2);
      const a = rng.int(2, 10), L2 = rng.int(1, 6) * 20, B2 = rng.int(1, 6) * 20, x = a * a * a * rng.int(1, 5);
      return mk(rng, U("cm"), x / (L2 * B2), [
        [x / (L2 + B2), "Divided by the sum of the sides"],
        [x / L2, "Divided by the length only"],
        [x / (L2 * B2) * 10, "Slipped a decimal place"],
        [x * L2 * B2, "Multiplied instead of dividing"],
      ], fin(d, `A stone of volume **${N(x)} cm³** is lowered into a tank with base **${L2} cm × ${B2} cm**, fully under the water. Find the rise in the water level.`,
        [`Rise = volume ÷ base area = ${N(x)} ÷ ${L2 * B2}`, `= **${N(R(x / (L2 * B2)))} cm**`], `Rise = displaced volume ÷ base area.`, `Divide by the base area; multiplying makes no sense dimensionally.`, `${x}/(${L2}*${B2})`));
    }
    if (d === "Medium") {
      const t = rng.int(0, 2);
      if (t === 0) {
        const k = rng.int(1, 6), rc = 7 * k, rho = rng.int(1, 12), rise = 4 * rho ** 3 / (3 * rc * rc);
        return mk(rng, U("cm"), rise, [
          [rho ** 3 / (rc * rc), "Dropped the 4/3"],
          [4 * rho * rho / (3 * rc * rc), "Used ρ² for the sphere"],
          [4 * rho ** 3 / (3 * rc), "Divided by r instead of r²"],
          [rise * 2, "Doubled"],
        ], fin(d, `A solid sphere of radius **${rho} cm** is dropped into a cylindrical vessel of radius **${rc} cm** partly filled with water. Find the rise in the water level.`,
          [`Sphere volume = 4/3 π ${rho}³; rise × π ${rc}² = that`, `Rise = 4 × ${rho ** 3} ÷ (3 × ${rc * rc}) = **${N(R(rise))} cm**`], `Rise = 4ρ³ ÷ (3 r²).`, `The π cancels; the sphere volume has r³ and the vessel's area has r².`, `4*${rho}**3/(3*${rc}*${rc})`));
      }
      if (t === 1) {
        const rho = 3, n = rng.int(1, 6) * 3, rc = rng.int(1, 4) * 3, rise = 4 * n * rho ** 3 / (3 * rc * rc);
        if (!C(rise)) return null;
        return mk(rng, U("cm"), rise, [
          [n * rho ** 3 / (rc * rc), "Dropped the 4/3"],
          [4 * rho ** 3 / (3 * rc * rc), "Counted one marble only"],
          [4 * n * rho * rho / (3 * rc * rc), "Used ρ² for the marbles"],
          [rise * 2, "Doubled"],
        ], fin(d, `${n} marbles, each of radius **${rho} cm**, are dropped one by one into a cylindrical glass of radius **${rc} cm** with water. By how much does the water rise?`,
          [`Volume of ${n} marbles = ${n} × 4/3 π ${rho}³`, `Rise = 4 × ${n} × ${rho ** 3} ÷ (3 × ${rc * rc}) = **${N(R(rise))} cm**`], `Rise = 4nρ³ ÷ (3 r²).`, `Do not forget to multiply by the number of marbles.`, `4*${n}*${rho}**3/(3*${rc}*${rc})`));
      }
      const l = rng.int(2, 10) * 10, b = rng.int(2, 8) * 10, rise = rng.int(2, 15), vol = l * b * rise, a = rng.int(2, 10), c = vol / (a * a);
      if (!I(c)) return null;
      return mk(rng, U("cm"), c, [
        [vol / a, "Divided by one edge"],
        [vol / (a * a * a), "Divided by a³ (volume of a cube)"],
        [vol, "Gave the displaced volume"],
        [c / 2, "Halved"],
      ], fin(d, `A cuboid block with a square base of side **${a} cm** is lowered into a tank with base **${l} cm × ${b} cm**. The water rises by **${rise} cm**. Find the height of the block, if it is fully submerged.`,
        [`Displaced volume = ${l * b} × ${rise} = ${N(vol)} cm³`, `Block volume = ${a}² × h = ${N(vol)}, so h = **${N(R(c))} cm**`], `Rise × tank base = block volume.`, `Divide by the block's base area (a²), not a single edge.`, `${l}*${b}*${rise}/(${a}*${a})`));
    }
    // Hard
    const t = rng.int(0, 2);
    if (t === 0) {
      const rc = T(rng, [7, 14, 21]), v = rng.int(1, 6), l = rng.int(2, 20), b = rng.int(2, 12), h = rng.int(1, 6);
      const flow = PI * rc * rc * v / 10, tm = l * b * h / flow;
      if (!C(tm) || tm < 1) return null;
      return mk(rng, (x) => N(x) + " hours", tm, [
        [tm / 10, "Slipped a factor of 10"],
        [tm * 10, "Slipped a factor of 10"],
        [l * b * h / (PI * rc * rc * v / 100), "Mis-converted units"],
        [tm * 2, "Doubled"],
      ], fin(d, `Water flows through a pipe of radius **${rc} cm** at **${v} km/h** into a rectangular tank **${l} m × ${b} m × ${h} m**. How many hours does it take to fill the tank? (π = 22/7)`,
        [`Flow per hour = π(${rc}/100)² × ${v * 1000} = ${R(flow)} m³`, `Tank volume = ${l * b * h} m³`, `Time = ${l * b * h} ÷ ${R(flow)} = **${N(R(tm))} hours**`], `Convert to metres: area in m² × speed in m/h.`, `Convert cm to m before squaring (÷100 gives 10,000 for the area).`, `${l}*${b}*${h}/(22/7*(${rc}/100)*(${rc}/100)*${v * 1000})`));
    }
    if (t === 1) {
      const k = rng.int(1, 5), rc = 7 * k, h = rng.int(2, 20), n = 3 * rng.int(1, 5), rise = 3 * h / (rc * rc) * 0 + 0;
      const cr = 7 * rng.int(1, 3), ch = rng.int(1, 6) * 3, vol = PI * cr * cr * ch / 3, rs = vol / (PI * rc * rc);
      if (!C(rs) || rs < 0.05) return null;
      return mk(rng, U("cm"), rs, [
        [vol / (PI * rc * rc) * 3, "Forgot the 1/3 of the cone"],
        [cr * cr * ch / (rc * rc), "Forgot the 1/3 of the cone"],
        [cr * ch / (3 * rc), "Used r instead of r²"],
        [rs * 2, "Doubled"],
      ], fin(d, `A metal cone of base radius **${cr} cm** and height **${ch} cm** is completely immersed in a cylindrical tank of radius **${rc} cm**. Find the rise in the water level.`,
        [`Cone volume = ⅓π ${cr}² × ${ch}`, `Rise = (r² h / 3) ÷ R² = ${cr * cr * ch} ÷ (3 × ${rc * rc}) = **${N(R(rs))} cm**`], `Rise = r² h ÷ (3 R²).`, `Cone volume has the ⅓; the cylinder's base area does not.`, `${cr}*${cr}*${ch}/(3*${rc}*${rc})`));
    }
    const l = rng.int(3, 12) * 10, b = rng.int(3, 10) * 10, rise = rng.int(1, 12), n = rng.int(2, 8), vol = l * b * rise, each = vol / n;
    if (!I(each)) return null;
    return mk(rng, V3("cm"), each, [
      [vol, "Gave the total displaced volume"],
      [each * 2, "Doubled"],
      [vol * n, "Multiplied by the count"],
      [each / 10, "Slipped a decimal place"],
    ], fin(d, `${n} identical solid blocks are lowered into a tank with base **${l} cm × ${b} cm**, raising the water level by **${rise} cm**. Find the volume of each block.`,
      [`Total displaced = ${l} × ${b} × ${rise} = ${N(vol)} cm³`, `Each = ${N(vol)} ÷ ${n} = **${N(each)} cm³**`], `Total volume = base area × rise; divide by the count.`, `The rise corresponds to ALL the blocks together.`, `${l}*${b}*${rise}/${n}`));
  }) });

  /* ---------------------------------------------------------------- 7. cost of painting / tiling */
  QB.gen("quant/mensuration-3d/cost-of-painting-tiling", { title: "Cost of painting / tiling", gen: wrap((rng, d) => {
    const w = T(rng, WHO), room = T(rng, ["hall", "classroom", "bedroom", "shop", "auditorium", "office room", "kitchen", "godown"]);
    if (d === "Easy") {
      const t = rng.int(0, 2);
      if (t === 0) {
        const l = rng.int(4, 20), b = rng.int(3, 15), rate = T(rng, [20, 25, 30, 40, 45, 50, 60, 75, 80, 120]);
        return mk(rng, M, l * b * rate, [
          [2 * (l + b) * rate, "Used the perimeter instead of the area"],
          [(l + b) * rate, "Used the sum of the sides"],
          [l * b * rate * 2, "Doubled the area"],
          [l * b * (rate + 10), "Used a wrong rate"],
        ], fin(d, T(rng, [`Find the cost of flooring a ${room} **${l} m × ${b} m** at **${M(rate)} per m²**.`, `${w} wants to lay flooring in a ${room} measuring **${l} m by ${b} m**. The rate is **${M(rate)} per square metre**. What is the cost?`]),
          [`Floor area = ${l} × ${b} = ${l * b} m²`, `Cost = ${l * b} × ${rate} = **${M(l * b * rate)}**`], `Area × rate.`, `Floors are priced by area, not by perimeter.`, `${l}*${b}*${rate}`));
      }
      if (t === 1) {
        const l = rng.int(4, 16), b = rng.int(3, 12), h = rng.int(3, 5), rate = T(rng, [8, 10, 12, 15, 18, 20, 25]), A = 2 * h * (l + b);
        return mk(rng, M, A * rate, [
          [2 * (l * b + b * h + h * l) * rate, "Painted the floor and ceiling too"],
          [h * (l + b) * rate, "Forgot to double"],
          [l * b * rate, "Used the floor area"],
          [A * (rate + 2), "Used a wrong rate"],
        ], fin(d, `The four walls of a ${room} **${l} m × ${b} m** and **${h} m** high are to be painted at **${M(rate)} per m²**. Find the cost.`,
          [`Wall area = 2h(l + b) = 2 × ${h} × ${l + b} = ${A} m²`, `Cost = ${A} × ${rate} = **${M(A * rate)}**`], `Walls = perimeter × height.`, `Walls only: no floor, no ceiling.`, `2*${h}*(${l}+${b})*${rate}`));
      }
      const L = rng.int(2, 10) * 2, B = rng.int(2, 8) * 2, s = T(rng, [20, 25, 40, 50]), n = (L * 100 / s) * (B * 100 / s);
      return mk(rng, N, n, [
        [L * B / s, "Mixed metres with centimetres"],
        [L * B * 100 / s, "Converted only once"],
        [(L + B) * 100 / s, "Added the dimensions"],
        [n * 2, "Doubled"],
      ], fin(d, `How many square tiles of side **${s} cm** are needed to cover the floor of a ${room} **${L} m × ${B} m**?`,
        [`Floor = ${L * 100} cm × ${B * 100} cm`, `Tiles = (${L * 100} ÷ ${s}) × (${B * 100} ÷ ${s}) = **${n}**`], `Tiles along each side, then multiply.`, `Convert metres to cm first (or tile side to m).`, `${L}*100/${s}*${B}*100/${s}`));
    }
    if (d === "Medium") {
      const t = rng.int(0, 2);
      if (t === 0) {
        const l = rng.int(5, 16), b = rng.int(4, 12), h = rng.int(3, 5), nd = rng.int(1, 3), nw = rng.int(1, 3), rate = T(rng, [10, 12, 15, 18, 20, 24, 30]);
        const A = 2 * h * (l + b) - nd * 2 * 1 * 2 - nw * 1.5 * 1;
        const dd = nd * 4, ww = nw * 1.5, net = 2 * h * (l + b) - dd - ww;
        return mk(rng, M, net * rate, [
          [2 * h * (l + b) * rate, "Did not deduct the doors and windows"],
          [(2 * h * (l + b) - dd) * rate, "Deducted the doors only"],
          [(2 * h * (l + b) + dd + ww) * rate, "Added the doors and windows"],
          [(net + l * b) * rate, "Included the ceiling"],
        ], fin(d, `A ${room} is **${l} m × ${b} m × ${h} m**. It has ${nd} door${nd > 1 ? "s" : ""} of **2 m × 2 m** and ${nw} window${nw > 1 ? "s" : ""} of **1.5 m × 1 m**. Find the cost of painting the walls at **${M(rate)} per m²**, excluding doors and windows.`,
          [`Walls = 2 × ${h} × ${l + b} = ${2 * h * (l + b)} m²`, `Openings = ${dd} + ${ww} = ${dd + ww} m²`, `Cost = (${2 * h * (l + b)} − ${dd + ww}) × ${rate} = **${M(net * rate)}**`], `Gross wall area − openings, then × rate.`, `Openings are not painted; subtract them.`, `(2*${h}*(${l}+${b})-${nd}*4-${nw}*1.5)*${rate}`));
      }
      if (t === 1) {
        const L = rng.int(2, 8) * 2, B = rng.int(2, 8) * 2, s = T(rng, [20, 25, 40, 50]), price = T(rng, [8, 10, 12, 15, 20, 25, 30]);
        const n = (L * 100 / s) * (B * 100 / s);
        return mk(rng, M, n * price, [
          [L * B * price, "Priced the area as if each tile were 1 m²"],
          [L * B * 100 / s * price, "Converted only once"],
          [n * price * 2, "Doubled"],
          [n * (price + 2), "Used a wrong price"],
        ], fin(d, `A ${room} floor **${L} m × ${B} m** is to be covered with square tiles of side **${s} cm**, each costing **${M(price)}**. Find the total cost of the tiles.`,
          [`Tiles = (${L * 100} ÷ ${s}) × (${B * 100} ÷ ${s}) = ${n}`, `Cost = ${n} × ${price} = **${M(n * price)}**`], `Count the tiles, then × price per tile.`, `Price is per tile, not per m².`, `${L}*100/${s}*${B}*100/${s}*${price}`));
      }
      const a = rng.int(2, 12), rate = T(rng, [5, 6, 8, 10, 12, 15, 20, 25]);
      return mk(rng, M, 6 * a * a * rate, [
        [4 * a * a * rate, "Painted four faces only"],
        [a ** 3 * rate, "Used the volume"],
        [a * a * rate, "Painted one face only"],
        [5 * a * a * rate, "Left out one face"],
      ], fin(d, `All the outer faces of a cubical ${T(rng, ["box", "water tank", "crate", "cabinet"])} of edge **${a} m** are to be painted at **${M(rate)} per m²**. Find the cost.`,
        [`TSA = 6 × ${a}² = ${6 * a * a} m²`, `Cost = ${6 * a * a} × ${rate} = **${M(6 * a * a * rate)}**`], `6a² × rate.`, `All six faces are painted.`, `6*${a}*${a}*${rate}`));
    }
    // Hard
    const t = rng.int(0, 2);
    if (t === 0) {
      const k = rng.int(1, 5), r = 7 * k, h = rng.int(2, 10), lh = [[24, 25], [20, 29], [28, 35]][0];
      const cone = T(rng, [[7, 24, 25], [21, 20, 29], [21, 28, 35]]);
      const rr = cone[0], hc = cone[1], l = cone[2], hcyl = rng.int(2, 9), rate = T(rng, [10, 12, 15, 20, 25, 30, 40]);
      const area = PI * rr * (2 * hcyl) + PI * rr * l;
      return mk(rng, M, area * rate, [
        [PI * rr * 2 * hcyl * rate, "Counted the cylinder only"],
        [(area + PI * rr * rr) * rate, "Included a base that is not part of the canvas"],
        [(PI * rr * 2 * hcyl + PI * rr * hc) * rate, "Used the cone height instead of the slant height"],
        [area * (rate + 5), "Used a wrong rate"],
      ], fin(d, `A tent is a cylinder of radius **${rr} m** and height **${hcyl} m** surmounted by a cone of the same radius whose vertical height is **${hc} m**. Find the cost of the canvas at **${M(rate)} per m²** (π = 22/7; no base cloth).`,
        [`Slant height of the cone = √(${rr}² + ${hc}²) = ${l} m`, `Canvas = 2π${rr}×${hcyl} + π${rr}×${l} = ${N(R(area))} m²`, `Cost = ${N(R(area))} × ${rate} = **${M(R(area * rate))}**`], `Cylinder curved area + cone curved area.`, `Use the slant height for the cone's cloth, not the vertical height.`, `(2*22/7*${rr}*${hcyl}+22/7*${rr}*Math.sqrt(${rr}*${rr}+${hc}*${hc}))*${rate}`));
    }
    if (t === 1) {
      const n = rng.int(3, 12), c = n * n * n, one = 6 * (n - 2) ** 2, two = 12 * (n - 2), three = 8, none = (n - 2) ** 3;
      const kind = rng.int(0, 2);
      const q = [
        ["exactly one face painted", one, [[two, "Counted the cubes on the edges"], [three, "Counted the corner cubes"], [none, "Counted the unpainted inner cubes"]]],
        ["exactly two faces painted", two, [[one, "Counted the face cubes"], [three, "Counted the corner cubes"], [12 * (n - 1), "Used n − 1 instead of n − 2"]]],
        ["no face painted", none, [[one, "Counted the face cubes"], [(n - 1) ** 3, "Used n − 1 instead of n − 2"], [c - none, "Counted the painted ones"]]]][kind];
      return mk(rng, N, q[1], q[2], fin(d, `A cube is painted on all faces and then cut into **${c}** equal small cubes (${n} × ${n} × ${n}). How many small cubes have **${q[0]}**?`,
        [`Each edge is cut into ${n} parts`, `${kind === 0 ? `Face cubes (not on edges): 6 × (${n} − 2)²` : kind === 1 ? `Edge cubes: 12 × (${n} − 2)` : `Inner cubes: (${n} − 2)³`} = **${q[1]}**`], `Face: 6(n−2)², edge: 12(n−2), corner: 8, inner: (n−2)³.`, `Corner and edge cubes lose their place to the (n − 2) count.`, `${[`6*(${n}-2)**2`, `12*(${n}-2)`, `(${n}-2)**3`][kind]}`));
    }
    const k = rng.int(1, 6), r = 7 * k, h = rng.int(2, 12), rate = T(rng, [10, 12, 15, 20, 25, 30, 40]);
    const area = 2 * PI * r * h + PI * r * r;
    return mk(rng, M, area * rate, [
      [2 * PI * r * h * rate, "Left out the top"],
      [(2 * PI * r * h + 2 * PI * r * r) * rate, "Painted the bottom as well"],
      [PI * r * r * h * rate, "Used the volume"],
      [area * (rate + 5), "Used a wrong rate"],
    ], fin(d, `The outside of a ${T(rng, ["cylindrical tank", "cylindrical water tank", "cylindrical oil drum", "cylindrical silo"])} of radius **${r} m** and height **${h} m** is painted, including the top but not the bottom, at **${M(rate)} per m²**. Find the cost (π = 22/7).`,
      [`Curved area = 2 × 22/7 × ${r} × ${h} = ${N(44 * k * h)} m²`, `Top = 22/7 × ${r}² = ${N(154 * k * k)} m²`, `Cost = ${N(44 * k * h + 154 * k * k)} × ${rate} = **${M((44 * k * h + 154 * k * k) * rate)}**`], `Curved wall + one circle.`, `Read which ends are painted: here the top only.`, `(2*22/7*${r}*${h}+22/7*${r}*${r})*${rate}`));
  }) });
})();
