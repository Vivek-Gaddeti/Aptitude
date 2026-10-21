/* =====================================================================
   Cubes & dice: painted-cube counting and cubes whose faces are painted
   in different colours. Every answer is found by brute force: the block
   is split into unit cubes and each unit cube's painted faces are read
   off from its coordinates, so the keyed count is the real count.
   ===================================================================== */
(function () {
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 40, Medium: 70, Hard: 100 };
  const N = (x) => QB.num(x);
  const finish = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });
  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 2000; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("cubes-dice: no clean question found");
    };
  }
  function mkN(rng, ans, wrongs, extra) {
    if (!(ans > 0) || !Number.isInteger(ans)) return null;
    const seen = new Set([ans]), pairs = [[N(ans), null]];
    for (const [v, why] of wrongs) { if (pairs.length === 4) break; if (!(v > 0) || !Number.isInteger(v) || seen.has(v)) continue; seen.add(v); pairs.push([N(v), why]); }
    if (pairs.length < 4) return null;
    return Object.assign({ time: TIME[extra.d] }, extra, QB.options(rng, pairs), { calc: String(ans) });
  }
  // faces order: [left, right, front, back, bottom, top]; null = unpainted
  function units(a, b, c, faces) {                  // list of colour lists, one per unit cube
    const out = [];
    for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) for (let k = 0; k < c; k++) {
      const cols = [];
      if (i === 0 && faces[0]) cols.push(faces[0]);
      if (i === a - 1 && faces[1]) cols.push(faces[1]);
      if (j === 0 && faces[2]) cols.push(faces[2]);
      if (j === b - 1 && faces[3]) cols.push(faces[3]);
      if (k === 0 && faces[4]) cols.push(faces[4]);
      if (k === c - 1 && faces[5]) cols.push(faces[5]);
      out.push(cols);
    }
    return out;
  }
  const ALL = (col) => [col, col, col, col, col, col];
  const COLS = ["red", "green", "blue", "yellow", "black", "white", "orange"];
  const BLOCK = ["wooden block", "cuboid of cheese", "block of clay", "brick-shaped block", "cuboid of soap"];
  const THING = ["wooden cube", "solid cube", "cube of cheese", "cube of soap", "block of clay", "ice cube"];
  const SIZES = [2, 3, 4, 5];

  /* ------------------------------------------------------------ 1. painted cube counting */
  const QS = {                                       // queries over the colour lists
    k0: { txt: "no face painted", f: (u) => u.filter((c) => c.length === 0).length },
    k1: { txt: "exactly one face painted", f: (u) => u.filter((c) => c.length === 1).length },
    k2: { txt: "exactly two faces painted", f: (u) => u.filter((c) => c.length === 2).length },
    k3: { txt: "three faces painted", f: (u) => u.filter((c) => c.length === 3).length },
    ge1: { txt: "at least one face painted", f: (u) => u.filter((c) => c.length >= 1).length },
    ge2: { txt: "at least two faces painted", f: (u) => u.filter((c) => c.length >= 2).length },
    le1: { txt: "at most one face painted", f: (u) => u.filter((c) => c.length <= 1).length },
    k12: { txt: "one or two faces painted", f: (u) => u.filter((c) => c.length === 1 || c.length === 2).length },
    k01: { txt: "no paint or only one painted face", f: (u) => u.filter((c) => c.length <= 1).length },
  };
  const PAINT = {
    all: { txt: (col) => `painted ${col} on all six faces`, faces: (c) => ALL(c) },
    nobottom: { txt: (col) => `painted ${col} on all faces except the bottom face`, faces: (c) => [c, c, c, c, null, c] },
    sides: { txt: (col) => `painted ${col} on its four side faces only (the top and bottom are left bare)`, faces: (c) => [c, c, c, c, null, null] },
    topbottom: { txt: (col) => `painted ${col} on the top and bottom faces only`, faces: (c) => [null, null, null, null, c, c] },
    two: { txt: (col) => `painted ${col} on two adjacent faces only`, faces: (c) => [c, null, c, null, null, null] },
    opp: { txt: (col) => `painted ${col} on all faces except two opposite faces`, faces: (c) => [null, null, c, c, c, c] },
  };
  QB.gen("reasoning/cubes-dice/painted-cube-counting", { title: "Painted cube counting", gen: wrap((rng, d) => {
    const col = T(rng, COLS), thing = T(rng, THING);
    let a, b, c, pk, qk;
    if (d === "Easy") { a = b = c = rng.int(3, 9); pk = "all"; qk = T(rng, ["k1", "k2", "k2", "k0", "k1", "k3"]); }
    else if (d === "Medium") { a = b = c = rng.int(3, 8); pk = T(rng, ["all", "all", "nobottom", "sides"]); qk = pk === "all" ? T(rng, ["ge1", "ge2", "le1", "k12", "k01"]) : T(rng, ["k0", "k1", "k2", "k3", "ge1"]); }
    else {
      a = rng.int(3, 8); b = rng.int(3, 8); c = rng.int(3, 8);
      if (a === b && b === c) return null;
      pk = T(rng, ["all", "all", "nobottom", "opp", "topbottom"]); qk = T(rng, ["k0", "k1", "k2", "k3", "ge1", "k12"]);
    }
    const P = PAINT[pk], Q = QS[qk];
    const faces = P.faces(col), U = units(a, b, c, faces), ans = Q.f(U);
    if (!(ans > 0)) return null;
    const cube = a === b && b === c;
    // length-based description for Easy / Medium cubes
    const s = T(rng, SIZES), useLen = cube && rng.chance(0.5);
    const body = useLen ? `A ${thing} of side **${a * s} cm** is ${P.txt(col)}. It is then cut into small cubes of side **${s} cm**.`
      : cube ? `A ${thing} is ${P.txt(col)} and then cut into **${a * a * a}** identical small cubes (${a} along each edge).`
        : `A ${T(rng, BLOCK)} measuring **${a} × ${b} × ${c}** unit cubes is ${P.txt(col)} and then cut into **${a * b * c}** unit cubes.`;
    const q = T(rng, [`${body} How many of the small cubes have ${Q.txt}?`, `${body} Find the number of small cubes with ${Q.txt}.`, `${body} How many small cubes will have ${Q.txt}?`]);
    // wrong answers: other queries, and the same query when an edge count is off by one
    const wrongs = [];
    for (const key of Object.keys(QS)) if (key !== qk && key[0] === "k" && key.length === 2) wrongs.push([QS[key].f(U), `Counted the cubes with ${QS[key].txt} instead`]);
    const mis = [[a - 1, b - 1, c - 1], [a + 1, b + 1, c + 1], [a - 1, b, c]];
    for (const [x, y, z] of mis) if (x >= 2 && y >= 2 && z >= 2) wrongs.push([Q.f(units(x, y, z, faces)), "Used the wrong number of small cubes along an edge"]);
    wrongs.push([a * b * c - ans, "Took the complement of what was asked"], [ans * 2, "Doubled the count"], [Math.round(ans / 2), "Halved the count"]);
    const edge = cube ? `${a} small cubes along each edge` : `${a} × ${b} × ${c} small cubes`;
    const sol = [];
    sol.push(`${edge}; so ${a * b * c} small cubes in all.`);
    if (pk === "all" && cube) sol.push(`Corners: 8 (three faces). Edges: 12 × (${a} − 2) = ${12 * (a - 2)} (two faces). Faces: 6 × (${a} − 2)² = ${6 * (a - 2) * (a - 2)} (one face). Inside: (${a} − 2)³ = ${(a - 2) ** 3} (no face).`);
    else sol.push(`Counting by position: a small cube touches a painted face only if it lies on that outer layer. Count the corner, edge, face and inside cubes separately: ${[0, 1, 2, 3].map((k) => `${k} painted face${k === 1 ? "" : "s"}: ${U.filter((x) => x.length === k).length}`).join("; ")}.`);
    sol.push(`${Q.txt}: **${ans}**.`);
    return mkN(rng, ans, wrongs, finish(d, q, sol,
      "For a fully painted n-cube: 3 faces = 8, 2 faces = 12(n − 2), 1 face = 6(n − 2)², 0 faces = (n − 2)³.", "The cubes along an edge number n, but only n − 2 of them are not corners; the inside block is also (n − 2)."));
  }) });

  /* ------------------------------------------------------------ 2. differently painted faces */
  const CFG = {
    sidesTopBottom: { txt: (c) => `the top and bottom faces are painted ${c[0]} and the four side faces are painted ${c[1]}`, faces: (c) => [c[1], c[1], c[1], c[1], c[0], c[0]], k: 2 },
    pairs: { txt: (c) => `each pair of opposite faces has its own colour: ${c[0]}, ${c[1]} and ${c[2]}`, faces: (c) => [c[0], c[0], c[1], c[1], c[2], c[2]], k: 3 },
    threeKinds: { txt: (c) => `the top is painted ${c[0]}, the bottom ${c[1]}, and the four side faces ${c[2]}`, faces: (c) => [c[2], c[2], c[2], c[2], c[1], c[0]], k: 3 },
    bareBottom: { txt: (c) => `the top face is painted ${c[0]}, the four side faces ${c[1]}, and the bottom face is left unpainted`, faces: (c) => [c[1], c[1], c[1], c[1], null, c[0]], k: 2 },
  };
  QB.gen("reasoning/cubes-dice/cubes-with-differently-painted-faces", { title: "Cubes with differently painted faces", gen: wrap((rng, d) => {
    const cfgKey = d === "Easy" ? "sidesTopBottom" : d === "Medium" ? T(rng, ["pairs", "sidesTopBottom", "bareBottom"]) : T(rng, ["threeKinds", "pairs", "bareBottom"]);
    const CF = CFG[cfgKey], cols = rng.shuffle(["red", "green", "blue", "yellow", "black", "white"]).slice(0, CF.k);
    const n = d === "Easy" ? rng.int(3, 6) : d === "Medium" ? rng.int(3, 7) : rng.int(4, 8);
    const faces = CF.faces(cols), U = units(n, n, n, faces);
    const used = [...new Set(faces.filter(Boolean))];
    const mk = (pred) => U.filter(pred).length;
    const Qs = [];
    const only = (col) => ({ txt: `only one painted face, and that face is ${col}`, f: (u) => u.filter((x) => x.length === 1 && x[0] === col).length });
    const two = (c1, c2) => ({ txt: `exactly two painted faces, one ${c1} and the other ${c2}`, f: (u) => u.filter((x) => x.length === 2 && x.includes(c1) && x.includes(c2) && c1 !== c2).length });
    const twoSame = (c1) => ({ txt: `exactly two painted faces, both ${c1}`, f: (u) => u.filter((x) => x.length === 2 && x[0] === c1 && x[1] === c1).length });
    const anyCol = (c1) => ({ txt: `at least one ${c1} face`, f: (u) => u.filter((x) => x.includes(c1)).length });
    const noPaint = { txt: "no painted face at all", f: (u) => u.filter((x) => x.length === 0).length };
    const diff2 = { txt: "faces of two different colours", f: (u) => u.filter((x) => new Set(x).size === 2).length };
    const all3 = { txt: "faces of three different colours", f: (u) => u.filter((x) => new Set(x).size === 3).length };
    for (const c1 of used) { Qs.push(only(c1)); Qs.push(twoSame(c1)); Qs.push(anyCol(c1)); for (const c2 of used) if (c1 < c2) Qs.push(two(c1, c2)); }
    Qs.push(noPaint, diff2); if (used.length === 3) Qs.push(all3);
    const lvlOK = (q) => d === "Easy" ? /^(only|exactly two painted faces, both|no painted)/.test(q.txt) : d === "Medium" ? !/^at least one/.test(q.txt) || rng.chance(0.3) : true;
    const cand = Qs.filter(lvlOK).filter((x) => x.f(U) > 0);
    if (!cand.length) return null;
    const Q = T(rng, cand), ans = Q.f(U);
    const q = T(rng, [
      `A cube is painted so that ${CF.txt(cols)}. It is cut into **${n * n * n}** equal small cubes (${n} along each edge). How many small cubes have ${Q.txt}?`,
      `The faces of a solid cube are coloured as follows: ${CF.txt(cols)}. The cube is then cut into **${n}** × **${n}** × **${n}** small cubes. Find the number of small cubes with ${Q.txt}.`,
      `A big cube is coloured: ${CF.txt(cols)}. After cutting it into ${n * n * n} identical small cubes, how many of them have ${Q.txt}?`]);
    const wrongs = [];
    for (const o of Qs) if (o !== Q) { const v = o.f(U); if (v > 0) wrongs.push([v, `Counted the cubes with ${o.txt} instead`]); }
    for (const dn of [-1, 1]) { const m = n + dn; if (m >= 3) wrongs.push([Q.f(units(m, m, m, faces)), "Used the wrong number of small cubes along an edge"]); }
    wrongs.push([ans + n, "Slip of one row"], [ans - n, "Slip of one row"], [ans * 2, "Doubled the count"]);
    const byLen = [0, 1, 2, 3].map((k) => `${k} painted face${k === 1 ? "" : "s"}: ${U.filter((x) => x.length === k).length}`).join("; ");
    return mkN(rng, ans, wrongs, finish(d, q,
      [`Split the small cubes by position (corner, edge, face centre, inside) and note which large faces each one touches. ${byLen}.`, `Counting only those with ${Q.txt}: **${ans}**.`],
      "Use the (n − 2) rule per face region: a face region has (n − 2)² one-face cubes, an edge has (n − 2) two-face cubes, a corner has one cube with three faces.", "Keep track of colours as well as numbers: an edge cube gets the colours of the two faces it joins."));
  }) });
})();
