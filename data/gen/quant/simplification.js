/* =====================================================================
   Simplification & approximation: question generators (BODMAS, bank-style "?" approximation).
   Expressions are built as trees, rendered with the minimum brackets, and every wrong
   option comes from a real mistake (left to right, brackets ignored, + before ×, sign slips).
   ===================================================================== */
(function () {
  const N = (x) => QB.num(x);
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 95 };
  const R6 = (x) => Math.round(x * 1e6) / 1e6;
  const R2 = (x) => Math.round(x * 100) / 100;
  const C = (x) => isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const I = Number.isInteger;

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 1500; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("simplification: no clean question found");
    };
  }
  function mk(rng, f, ans, wrongs, extra, o) {
    o = o || {};
    if (!isFinite(ans)) return null;
    const A = f(R2(ans)), seen = new Set([A.toLowerCase()]), pairs = [[A, null]];
    const add = (v, why) => {
      if (pairs.length === 4 || !isFinite(v)) return;
      if (!o.signed && v < 0) return;
      if (I(ans) && !I(v)) return;
      if (!I(ans) && !C(v)) return;
      if (o.far && Math.abs(v - ans) < o.far * Math.abs(ans)) return;
      const t = f(R2(v));
      if (seen.has(t.toLowerCase()) || /NaN|undefined|Infinity/.test(t)) return;
      seen.add(t.toLowerCase());
      pairs.push([t, why]);
    };
    wrongs.forEach((w) => add(w[0], w[1]));
    const st = o.step || 1;
    [1, -1, 2, -2, 3, -3, 5, -5, 10, -10].forEach((k) => add(ans + k * st, "A small slip near the end of the working"));
    if (pairs.length < 4) return null;
    return Object.assign({ time: TIME[extra.d] }, extra, QB.options(rng, pairs), { calc: String(R6(ans)) });
  }
  const finish = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });

  /* ------------------------------------------------------------------ expression machinery */
  const TOK = /\d+(?:\.\d+)?|√|[²()\[\]{}+−×÷]/g;
  const OPEN = "([{", CLOSE = ")]}";
  function evalStr(str, mode) {
    const t = str.match(TOK); let i = 0; let bad = false;
    const apply = (a, op, b) => { if (op === "+") return a + b; if (op === "−") return a - b; if (op === "×") return a * b; if (b === 0) { bad = true; return NaN; } return a / b; };
    function factor() {
      let v;
      if (t[i] === "√") { i++; v = Math.sqrt(parseFloat(t[i++])); }
      else if (OPEN.includes(t[i])) { i++; v = top(); i++; }
      else v = parseFloat(t[i++]);
      if (t[i] === "²") { i++; v = v * v; }
      return v;
    }
    function seq(sub, ops) { let v = sub(); while (i < t.length && ops.includes(t[i])) { const op = t[i++]; v = apply(v, op, sub()); } return v; }
    const bodmas = () => seq(() => seq(factor, "×÷"), "+−");
    const ltr = () => seq(factor, "+−×÷");
    const inv = () => seq(() => seq(factor, "+−"), "×÷");
    const top = mode === "ltr" ? ltr : mode === "inv" ? inv : bodmas;
    const v = top();
    return bad ? NaN : v;
  }
  const stripBr = (s) => s.replace(/[()\[\]{}]/g, "");

  const sym = (op) => (op === "-" ? "−" : op === "*" ? "×" : op === "/" ? "÷" : "+");
  const leaf = (v, s) => ({ leaf: true, v, s: s == null ? String(v) : s });
  function divisorsOf(n) { const out = []; for (let k = 2; k <= 12; k++) if (n % k === 0) out.push(k); return out; }
  function fix(rng, n) {                                  // returns false if the node cannot be made clean
    const vl = n.l.v, vr = n.r.v;
    if (n.op === "/") {
      if (vr === 0) return false;
      if (!(C(vl / vr) && Math.abs(vl / vr) < 1e5) || (I(vl) && I(vr) && vl % vr !== 0)) {
        if (!n.r.leaf || !I(vl)) return false;
        const ds = divisorsOf(Math.abs(vl)); if (!ds.length) return false;
        n.r = leaf(T(rng, ds));
      }
      if (n.l.v % n.r.v !== 0 && I(n.l.v) && I(n.r.v)) return false;
      n.v = R6(n.l.v / n.r.v);
    } else if (n.op === "-") {
      if (vl < vr) { const t = n.l; n.l = n.r; n.r = t; }
      n.v = R6(n.l.v - n.r.v);
    } else if (n.op === "+") n.v = R6(vl + vr);
    else n.v = R6(vl * vr);
    return Math.abs(n.v) <= 20000;
  }
  function build(rng, k, mkLeaf, ops, pForce) {
    if (k === 1) return mkLeaf();
    const s = rng.int(1, k - 1), l = build(rng, s, mkLeaf, ops, pForce), r = build(rng, k - s, mkLeaf, ops, pForce);
    if (!l || !r) return null;
    const n = { op: T(rng, ops), l, r, forced: rng.chance(pForce) };
    return fix(rng, n) ? n : null;
  }
  const fmtN = (v) => N(R2(v));
  function render(n, pp, right, pop, red, groups, specials) {
    if (n.leaf) { if (specials && /[²√]/.test(n.s)) specials.push(n); return { s: n.s, h: 0 }; }
    const prec = n.op === "+" || n.op === "-" ? 1 : 2;
    const a = render(n.l, prec, false, n.op, red, groups, specials), b = render(n.r, prec, true, n.op, red, groups, specials);
    let s = a.s + " " + sym(n.op) + " " + b.s, h = Math.max(a.h, b.h);
    const need = pp > 0 && (n.forced || prec < pp || (right && prec === pp && (pop === "-" || pop === "/")));
    if (need) {
      if (red) return { s: fmtN(n.v), h: 0 };
      if (groups) groups.push({ inner: s, v: n.v });
      const o = OPEN[Math.min(h, 2)], c = CLOSE[Math.min(h, 2)];
      return { s: o + s + c, h: h + 1 };
    }
    return { s, h };
  }
  const wordsOf = (s) => s;
  const ASK = [(e) => `Simplify: **${e}**`, (e) => `Find the value of **${e}**.`, (e) => `Evaluate: **${e}**`, (e) => `What is the value of **${e}**?`, (e) => `**${e}** = ?`, (e) => `Calculate **${e}**.`];

  function exprQuestion(rng, d, tree) {
    const groups = [], specials = [];
    const full = render(tree, 0, false, null, false, groups, specials).s;
    const red = render(tree, 0, false, null, true, null, null).s;
    const ans = R6(tree.v), v0 = R6(evalStr(full, "bodmas"));
    if (Math.abs(v0 - ans) > 1e-6) return null;
    if (!C(ans) || ans < 0 || ans > 5000 || (d !== "Hard" && !I(ans))) return null;
    const ltr = evalStr(full, "ltr"), inv = evalStr(full, "inv"), nob = evalStr(stripBr(full), "bodmas");
    if (!(Math.abs(ltr - ans) > 1e-6)) return null;
    const hasBr = groups.length > 0;
    const wrongs = [
      [R6(ltr), "Worked strictly left to right, ignoring BODMAS"],
      [R6(inv), "Did the additions and subtractions before the multiplications and divisions"],
      [R6(nob), "Ignored the brackets and followed BODMAS on the bare symbols"],
      [R6(ans + 2 * (tree.op === "-" ? tree.r.v : 0)), "Added instead of subtracted at the last step"],
    ];
    const eqq = T(rng, ASK)(full);
    const sol = ["Order of operations: brackets → powers and roots → ÷ and × (left to right) → + and − (left to right)"];
    if (specials.length) sol.push("Powers and roots first: " + specials.slice(0, 4).map((x) => /√/.test(x.s) ? `${x.s} = ${fmtN(x.v)}` : `${x.s} = ${fmtN(x.v)}`).join(", "));
    groups.slice(0, 4).forEach((g) => sol.push(`${g.inner} = ${fmtN(g.v)}`));
    if (groups.length) sol.push(`The expression becomes ${red}`);
    sol.push(`Now ÷ and × before + and − gives **${fmtN(ans)}**`);
    const q = mk(rng, N, ans, wrongs.filter((w) => isFinite(w[0])),
      finish(d, eqq, sol, hasBr ? "Clear the brackets from the inside out, then ÷ and × before + and −." : "Do the × and ÷ first, then the + and −.",
        hasBr ? "Brackets first, then divide/multiply, then add/subtract. Reading left to right gives a wrong answer." : "Reading left to right treats + and × as equals; × and ÷ come first."), { step: Math.max(1, Math.round(ans / 10)) });
    return q;
  }

  /* ------------------------------------------------------------------ 1. BODMAS */
  const FRQ = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6], [1, 8], [3, 8], [5, 8], [7, 8], [3, 10], [7, 10], [2, 7], [3, 7], [4, 9], [5, 12], [7, 12]];
  QB.gen("quant/simplification/bodmas", { title: "BODMAS", gen: wrap((rng, d) => {
    if (d === "Easy") {
      const k = rng.int(3, 4), ops = ["+", "-", "*", "/"];
      const tree = build(rng, k, () => leaf(rng.int(2, 30)), ops, 0);
      if (!tree) return null;
      // keep the expression flat: no forced brackets, and it must need both kinds of operator
      const full = render(tree, 0, false, null, false, [], null).s;
      if (/[()]/.test(full) || !/[×÷]/.test(full) || !/[+−]/.test(full)) return null;
      return exprQuestion(rng, d, tree);
    }
    if (d === "Medium") {
      if (rng.chance(0.3)) {
        const cnt = rng.int(2, 3), terms = [];
        for (let i = 0; i < cnt; i++) {
          const [a, b] = T(rng, FRQ), m = rng.int(2, 24) * b; terms.push({ a, b, n: m, v: a * m / b });
        }
        const signs = ["+"]; for (let i = 1; i < cnt; i++) signs.push(rng.chance(0.5) ? "+" : "−");
        const extra = rng.int(5, 90), lastOp = rng.chance(0.5) ? "+" : "−";
        let ans = 0; terms.forEach((t, i) => { ans += signs[i] === "+" ? t.v : -t.v; }); ans = lastOp === "+" ? ans + extra : ans - extra;
        if (ans <= 0 || ans > 3000) return null;
        const txt = terms.map((t, i) => (i ? " " + signs[i] + " " : "") + `${t.a}/${t.b} of ${N(t.n)}`).join("") + ` ${lastOp} ${extra}`;
        const flipLast = lastOp === "+" ? ans - 2 * extra : ans + 2 * extra;
        let inv = 0; terms.forEach((t, i) => { inv += (signs[i] === "+" ? 1 : -1) * t.b * t.n / t.a; });
        return mk(rng, N, ans, [
          [flipLast, "Used the wrong sign on the last number"],
          [inv + (lastOp === "+" ? extra : -extra), "Turned each fraction upside down"],
          [ans - (lastOp === "+" ? extra : -extra), "Left out the last number"],
          [terms.reduce((a, t, i) => a + (signs[i] === "+" ? 1 : -1) * (t.a / t.b + t.n), 0) + (lastOp === "+" ? extra : -extra), "Added the fraction to the number instead of taking “of”"],
        ], finish(d, T(rng, [`Find the value of **${txt}**.`, `Simplify: **${txt}**`]),
          [...terms.map((t) => `${t.a}/${t.b} of ${N(t.n)} = ${t.a} × ${N(t.n / t.b)} = ${N(t.v)}`), `Combine: ${terms.map((t, i) => (i ? signs[i] + " " : "") + N(t.v)).join(" ")} ${lastOp} ${extra} = **${N(ans)}**`],
          `“of” means multiply: divide by the denominator first, then multiply by the numerator.`, `“a/b of n” is a/b × n, not a/b + n.`), { step: Math.max(1, Math.round(ans / 10)) });
      }
      const tree = build(rng, 5, () => leaf(rng.int(2, 36)), ["+", "-", "*", "/"], 0.55);
      if (!tree) return null;
      const full = render(tree, 0, false, null, false, [], null).s;
      if (!/[()]/.test(full)) return null;
      return exprQuestion(rng, d, tree);
    }
    // Hard
    const mkLeaf = () => {
      const r = rng.int(0, 9);
      if (r <= 1) { const k = rng.int(2, 15); return { leaf: true, v: k * k, s: k + "²" }; }
      if (r === 2) { const k = rng.int(3, 20); return { leaf: true, v: k, s: "√" + k * k }; }
      if (r === 3) { const k = rng.int(2, 59); return k % 10 ? { leaf: true, v: k / 10, s: (k / 10).toFixed(1) } : leaf(k / 10 + 1); }
      return leaf(rng.int(2, 24));
    };
    const tree = build(rng, rng.int(5, 6), mkLeaf, ["+", "-", "*", "/"], 0.6);
    if (!tree) return null;
    const full = render(tree, 0, false, null, false, [], null).s;
    if (!/[()]/.test(full) || !/[²√]/.test(full)) return null;
    return exprQuestion(rng, d, tree);
  }) });

  /* ------------------------------------------------------------------ 2. approximation ("?" questions) */
  function pert(rng, x, kind) {                              // a believable "ugly" number near x
    if (kind === "pct") { const e = rng.int(1, 4) / 10 * (rng.chance(0.5) ? 1 : -1); return R6(x + e); }
    if (x >= 100) { const m = Math.max(1, Math.floor(x * 0.012)); const e = rng.int(1, m) * (rng.chance(0.5) ? 1 : -1); return x + e; }
    if (x >= 20) return R6(x + rng.int(1, 3) / 10 * (rng.chance(0.5) ? 1 : -1));
    return R6(x + rng.int(1, 2) / 10 * (rng.chance(0.5) ? 1 : -1));
  }
  const show = (v) => (I(v) ? N(v) : String(R2(v)));
  const BIG = [200, 250, 300, 350, 400, 450, 500, 600, 640, 700, 750, 800, 900, 1000, 1200, 1500, 1600, 1800, 2000, 2400, 2500, 3000, 4000, 4500, 5000];
  // each term: { cv: clean value, uv: ugly value, s: ugly text, big: clean text for the solution }
  function tPct(rng) { const p = T(rng, [10, 15, 20, 25, 30, 40, 45, 50, 60, 75, 80, 90]), n = T(rng, BIG), pu = pert(rng, p, "pct"), nu = pert(rng, n); return { cv: p * n / 100, uv: pu * nu / 100, s: `${pu}% of ${show(nu)}`, clean: `${p}% of ${N(n)}` }; }
  function tMul(rng) { const a = rng.int(11, 59), b = rng.int(5, 29), au = pert(rng, a), bu = pert(rng, b); return { cv: a * b, uv: au * bu, s: `${show(au)} × ${show(bu)}`, clean: `${a} × ${b}` }; }
  function tDiv(rng) { const b = rng.int(4, 25), q = rng.int(12, 120), a = b * q, au = pert(rng, a), bu = pert(rng, b); return { cv: q, uv: au / bu, s: `${show(au)} ÷ ${show(bu)}`, clean: `${N(a)} ÷ ${b}` }; }
  function tSq(rng) { const k = rng.int(11, 35), ku = pert(rng, k); return { cv: k * k, uv: ku * ku, s: `${show(ku)}²`, clean: `${k}²` }; }
  function tRoot(rng) { const k = rng.int(12, 90), xu = k * k + rng.int(-Math.floor(k / 3), Math.floor(k / 3)); return { cv: k, uv: Math.sqrt(xu), s: `√${N(xu)}`, clean: `√${N(k * k)}` }; }
  function tNum(rng) { const n = T(rng, BIG), nu = pert(rng, n); return { cv: n, uv: nu, s: show(nu), clean: N(n) }; }
  const asks = [(e) => `What approximate value should replace the question mark (?) in the following? **${e} = ?**`, (e) => `Find the approximate value of **${e}**.`, (e) => `**${e} ≈ ?**`, (e) => `Which value is closest to **${e}**?`, (e) => `Estimate: **${e}**`];
  QB.gen("quant/simplification/approximation", { title: "Approximation (bank-style \"?\")", gen: wrap((rng, d) => {
    let terms, signs, extra = null;
    if (d === "Easy") {
      terms = [T(rng, [tPct, tMul, tSq, tRoot, tDiv])(rng), T(rng, [tNum, tPct, tMul])(rng)];
      signs = [1, rng.chance(0.5) ? 1 : -1];
    } else if (d === "Medium") {
      terms = [T(rng, [tPct, tMul, tSq, tDiv])(rng), T(rng, [tPct, tRoot, tMul, tNum])(rng), T(rng, [tNum, tSq, tRoot, tPct])(rng)];
      signs = [1, rng.chance(0.5) ? 1 : -1, rng.chance(0.5) ? 1 : -1];
    } else {
      terms = [T(rng, [tPct, tMul, tSq, tDiv, tRoot])(rng), T(rng, [tPct, tRoot, tMul, tDiv])(rng), T(rng, [tSq, tRoot, tPct, tNum])(rng), T(rng, [tNum, tSq, tPct, tRoot])(rng)];
      signs = [1, 1, rng.chance(0.5) ? 1 : -1, rng.chance(0.5) ? 1 : -1];
      if (rng.chance(0.4)) {            // chain A × B ÷ C as the first term
        const a = rng.int(12, 45), b = rng.int(4, 18), c = T(rng, [2, 3, 4, 5, 6, 8, 9, 10]);
        if ((a * b) % c) return null;
        const au = pert(rng, a), bu = pert(rng, b), cu = pert(rng, c);
        terms[0] = { cv: a * b / c, uv: au * bu / cu, s: `${show(au)} × ${show(bu)} ÷ ${show(cu)}`, clean: `${a} × ${b} ÷ ${c}` };
      }
    }
    if (terms.some((t) => !I(t.cv) || t.cv <= 0)) return null;
    let ans = 0, uv = 0; terms.forEach((t, i) => { ans += signs[i] * t.cv; uv += signs[i] * t.uv; });
    if (!(ans >= 40 && ans <= 9000) || !I(ans) || Math.abs(uv - ans) / ans > 0.02 || Math.abs(uv - ans) / ans < 0.0005) return null;
    const total = (sg) => terms.reduce((a, t, i) => a + sg[i] * t.cv, 0);
    const txt = terms.map((t, i) => (i === 0 ? "" : signs[i] > 0 ? " + " : " − ") + t.s).join("");
    const flipI = rng.int(1, terms.length - 1);
    const wrongs = [
      [total(signs.map((s, i) => (i === flipI ? -s : s))), `Added instead of subtracted (or the reverse) for the term “${terms[flipI].clean}”`],
      [total(signs.map((s, i) => (i === terms.length - 1 ? 0 : s))), "Left out the last term"],
      [ans + terms[0].cv, "Counted the first term twice"],
      [total(signs.map((s, i) => (i === 0 ? 0 : s))) , "Left out the first term"],
      [ans - terms[flipI].cv * signs[flipI] * 2 + (signs[flipI] < 0 ? 0 : 0), "Reversed the sign of one term"],
    ];
    const st = Math.max(5, Math.round(ans * 0.1 / 5) * 5);
    const out = mk(rng, N, ans, wrongs, finish(d, T(rng, asks)(txt),
      [`Round each number to a friendly value: ${terms.map((t) => t.clean).join(", ")}`, `Terms: ${terms.map((t) => N(t.cv)).join(", ")}`, `Combine: ${terms.map((t, i) => (i === 0 ? "" : signs[i] > 0 ? "+ " : "− ") + N(t.cv)).join(" ")} = **${N(ans)}**`],
      `Round each number to the nearest friendly one (49.8% → 50%, 399 → 400), then calculate.`, `Round BEFORE calculating; do not try to compute the exact value, and keep the signs.`), { far: 0.05, step: st });
    if (!out) return null;
    out.check = `abs(${R6(uv)} - ${ans}) / ${ans} < 0.02`;
    return out;
  }) });
})();
