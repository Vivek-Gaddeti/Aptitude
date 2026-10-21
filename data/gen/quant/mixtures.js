/* =====================================================================
   Mixtures & alligation: four question generators (the "three-mixtures"
   pattern has no generator by design).
   Easy / Medium / Hard, clean answers, wrong options from real mistakes.
   ===================================================================== */
(function () {
  const M = (x) => QB.money(x), N = (x) => QB.num(x), P = (x) => QB.pct(x);
  const R = (x) => QB.round(x, 2);
  const C = (x) => isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const I = Number.isInteger;
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 95 };
  const rt = (v) => { const g = QB.gcd(v[0], v[1]); return `${v[0] / g} : ${v[1] / g}`; };
  const L = (x) => N(x) + " litres";
  const KG = (x) => N(x) + " kg";

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("mixtures: no clean question found");
    };
  }
  function mk(rng, f, ans, wrongs, extra, o) {
    o = o || {};
    const ok = o.ratio ? (v) => Array.isArray(v) && v.every((x) => isFinite(x) && x > 0 && I(x)) : (v) => typeof v === "number" && isFinite(v) && v > 0 && C(v);
    if (!ok(ans)) return null;
    if (o.ratio && Math.max(ans[0], ans[1]) / QB.gcd(ans[0], ans[1]) > 300) return null;
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

  /* ------------------------------------------------------------------ 1. alligation (mean price) */
  const GOODS = [["rice", "kg"], ["tea", "kg"], ["sugar", "kg"], ["wheat", "kg"], ["dal", "kg"], ["coffee powder", "kg"], ["ghee", "kg"], ["cooking oil", "litre"], ["basmati rice", "kg"], ["cashew nuts", "kg"]];
  const WHO = ["A grocer", "A shopkeeper", "A trader", "A caterer", "A wholesaler", "A canteen manager", "A tea-stall owner"];
  QB.gen("quant/mixtures/alligation", { title: "Alligation (mean price)", gen: wrap((rng, d) => {
    const [g, u] = T(rng, GOODS), who = T(rng, WHO);
    const prices = () => { const a = rng.int(2, 40) * 5, b = a + rng.int(1, 16) * 5; return [a, b]; };
    if (d === "Easy") {
      const [a, b] = prices(), m = rng.int(1, 5), n = rng.int(1, 5);
      if (m === n || QB.gcd(m, n) !== 1) return null;
      const mean = (a * m + b * n) / (m + n);
      return mk(rng, M, mean, [
        [(a + b) / 2, "Took the simple average of the two prices"],
        [(a * n + b * m) / (m + n), "Weighted the prices the wrong way round"],
        [b - a, "Gave the difference of the prices"],
        [(a * m + b * n) / (m + n) + (b - a) / 10, "Made a slip in the weighted total"],
      ], finish(d, `${who} mixes two kinds of ${g} costing **${M(a)}** and **${M(b)}** per ${u} in the ratio **${m} : ${n}**. What is the cost of the mixture per ${u}?`,
        [`Total cost of ${m + n} ${u} = ${m}×${a} + ${n}×${b} = ${M(a * m + b * n)}`, `Cost per ${u} = ${M(a * m + b * n)} ÷ ${m + n} = **${M(mean)}**`],
        `Weighted mean: (${a}×${m} + ${b}×${n}) ÷ ${m + n}.`,
        `The simple average ${M((a + b) / 2)} is right only when the ratio is 1 : 1.`));
    }
    if (d === "Medium") {
      const [a, b] = prices(), m = rng.int(1, 8), n = rng.int(1, 8);
      if (m === n || QB.gcd(m, n) !== 1) return null;
      const g2 = QB.gcd(m + n, 1), mean = (a * m + b * n) / (m + n);
      if (!C(mean) || mean === Math.floor(mean) + 0.5 && false) return null;
      const ans = [b - mean, mean - a];
      return mk(rng, rt, ans, [
        [[ans[1], ans[0]], "Took the differences the wrong way round"],
        [[mean - a, b - a], "Used the wrong pair of differences"],
        [[b - a, mean - a], "Used the full price gap for one side"],
        [[a, b], "Gave the prices as the ratio"],
      ], finish(d, `In what ratio must ${g} at **${M(a)}** per ${u} be mixed with ${g} at **${M(b)}** per ${u} so that the mixture is worth **${M(mean)}** per ${u}? (cheaper : dearer)`,
        [`Cheaper ${M(a)}, dearer ${M(b)}, mean ${M(mean)}`, `Cheaper : dearer = (dearer − mean) : (mean − cheaper) = (${b} − ${R(mean)}) : (${R(mean)} − ${a}) = **${rt(ans)}**`],
        `Alligation cross: each quantity is in proportion to the OPPOSITE price gap.`,
        `The cheaper variety gets the gap to the DEARER price (b − mean), not its own gap.`), { ratio: true });
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      const [a, b] = prices(), m = rng.int(1, 6), n = rng.int(1, 6), pr = T(rng, [10, 15, 20, 25, 12.5, 5]);
      if (m === n || QB.gcd(m, n) !== 1) return null;
      const mean = (a * m + b * n) / (m + n), sp = mean * (1 + pr / 100);
      return mk(rng, M, sp, [
        [mean, "Gave the cost price of the mixture, not the selling price"],
        [(a + b) / 2 * (1 + pr / 100), "Used the simple average of the prices"],
        [mean + pr, "Added the percent as rupees"],
        [mean * (1 - pr / 100), "Took the percent off instead of adding it"],
      ], finish(d, `${who} mixes ${g} costing **${M(a)}** and **${M(b)}** per ${u} in the ratio **${m} : ${n}** and sells the mixture at a profit of **${P(pr)}**. What is the selling price per ${u}?`,
        [`Cost per ${u} = (${m}×${a} + ${n}×${b}) ÷ ${m + n} = ${M(R(mean))}`, `Selling price = ${M(R(mean))} × ${R(1 + pr / 100)} = **${M(R(sp))}**`],
        `Find the mean cost first, then multiply by ${R(1 + pr / 100)}.`,
        `Profit applies to the cost of the MIXTURE, which is a weighted, not simple, average.`));
    }
    if (k === 1) {
      const [a, b] = prices(), m = rng.int(1, 8), n = rng.int(1, 8);
      if (m === n || QB.gcd(m, n) !== 1) return null;
      const s = m + n, mean = (a * m + b * n) / s, tot = s * rng.int(1, 8) * (QB.gcd(s, 2) === 1 ? 2 : 1), cheap = tot * m / s;
      if (!I(cheap) || !I(tot * n / s)) return null;
      const ask = rng.chance(0.5), qty = ask ? tot * n / s : cheap;
      return mk(rng, KG, qty, [
        [ask ? cheap : tot * n / s, "Gave the quantity of the other variety"],
        [tot / 2, "Assumed equal quantities"],
        [tot * (mean - a) / (b - a) * 0 + tot * Math.abs(ask ? m : n) / (b - a), "Divided by the price gap"],
        [tot - qty + 1, "Made an off-by-one slip"],
      ], finish(d, `${who} wants **${tot} ${u}** of mixed ${g} worth **${M(mean)}** per ${u} by mixing ${g} costing **${M(a)}** and **${M(b)}** per ${u}. How many ${u} of the ${ask ? "dearer" : "cheaper"} kind are needed?`,
        [`Cheaper : dearer = (${b} − ${R(mean)}) : (${R(mean)} − ${a}) = ${m} : ${n}`, `${ask ? "Dearer" : "Cheaper"} = ${ask ? n : m}/${s} × ${tot} = **${N(qty)} ${u}**`],
        `Alligation gives ${m} : ${n}; share ${tot} ${u} in that ratio.`,
        `The ratio is of quantities, not prices; the cheaper kind gets the larger share when the mean is nearer to the cheaper price.`));
    }
    const [a, b] = prices(), m = rng.int(1, 8), n = rng.int(1, 8), pr = T(rng, [10, 20, 25, 5, 40]);
    if (m === n || QB.gcd(m, n) !== 1) return null;
    const mean = (a * m + b * n) / (m + n), sp = mean * (1 + pr / 100);
    if (!C(sp)) return null;
    const ans = [b - mean, mean - a];
    return mk(rng, rt, ans, [
      [[ans[1], ans[0]], "Took the differences the wrong way round"],
      [[b - sp, sp - a], "Used the selling price as the mean price"],
      [[b - a, sp - a], "Used the full gap on one side"],
      [[a, b], "Gave the prices as the ratio"],
    ], finish(d, `${who} mixes ${g} at **${M(a)}** and **${M(b)}** per ${u} and wants a profit of **${P(pr)}** by selling the mixture at **${M(R(sp))}** per ${u}. In what ratio (cheaper : dearer) must the two kinds be mixed?`,
      [`Cost of mixture = ${M(R(sp))} ÷ ${R(1 + pr / 100)} = ${M(R(mean))}`, `Cheaper : dearer = (${b} − ${R(mean)}) : (${R(mean)} − ${a}) = **${rt(ans)}**`],
      `Strip the profit off the selling price to get the cost, then alligate.`,
      `Alligation works on COST prices. Using the selling price as the mean gives the wrong ratio.`), { ratio: true });
  }) });

  /* ------------------------------------------------------------------ 2. mixing two solutions to a target % */
  const SOL = [["acid", "acid solution"], ["salt", "salt solution"], ["sugar", "sugar syrup"], ["alcohol", "alcohol mixture"], ["milk", "milk-water mixture"], ["juice concentrate", "juice blend"]];
  QB.gen("quant/mixtures/mixing-two-solutions-to-a", { title: "Mixing two solutions to a target %", gen: wrap((rng, d) => {
    const [sub, sol] = T(rng, SOL), cont = T(rng, ["A lab technician", "A chemist", "A kitchen manager", "A student", "A factory worker"]);
    if (d === "Easy") {
      const x = rng.int(1, 9) * 5, y = rng.int(1, 9) * 5, v1 = rng.int(1, 12) * 5, v2 = rng.int(1, 12) * 5;
      if (x >= y) return null;
      const conc = (x * v1 + y * v2) / (v1 + v2);
      return mk(rng, P, conc, [
        [(x + y) / 2, "Took the simple average of the two percentages"],
        [(x * v2 + y * v1) / (v1 + v2), "Weighted the percentages the wrong way round"],
        [(x * v1 + y * v2) / 100, "Divided by 100 instead of the total volume"],
        [y - x, "Gave the difference of the percentages"],
      ], finish(d, `${cont} mixes **${v1} litres** of a **${x}%** ${sol} with **${v2} litres** of a **${y}%** ${sol}. What is the percentage of ${sub} in the mixture?`,
        [`${sub[0].toUpperCase() + sub.slice(1)} = ${x}% of ${v1} + ${y}% of ${v2} = ${R(x * v1 / 100)} + ${R(y * v2 / 100)} = ${R((x * v1 + y * v2) / 100)} litres`, `Total = ${v1 + v2} litres → ${R((x * v1 + y * v2) / 100)} ÷ ${v1 + v2} × 100 = **${P(R(conc))}**`],
        `Weighted mean: (${x}×${v1} + ${y}×${v2}) ÷ ${v1 + v2}.`,
        `The two volumes differ, so the answer is not the simple average ${P((x + y) / 2)}.`));
    }
    if (d === "Medium") {
      const x = rng.int(1, 15) * 5, y = x + rng.int(2, 16) * 5, p = rng.int(1, 7), q = rng.int(1, 7);
      if (p === q || QB.gcd(p, q) !== 1) return null;
      const z = (x * p + y * q) / (p + q);
      if (!C(z)) return null;
      const ans = [y - z, z - x];
      return mk(rng, rt, ans, [
        [[ans[1], ans[0]], "Took the differences the wrong way round"],
        [[z - x, y - x], "Used the wrong pair of gaps"],
        [[y, x], "Gave the percentages as the ratio"],
        [[y - x, z - x], "Used the full gap on one side"],
      ], finish(d, `In what ratio must a **${x}%** ${sol} be mixed with a **${y}%** ${sol} to get a **${P(R(z))}** solution? (weaker : stronger)`,
        [`Weaker ${x}%, stronger ${y}%, target ${P(R(z))}`, `Weaker : stronger = (${y} − ${R(z)}) : (${R(z)} − ${x}) = **${rt(ans)}**`],
        `Alligation cross: quantity of the weaker ∝ (stronger − target).`,
        `Each quantity is proportional to the gap on the OPPOSITE side of the target.`), { ratio: true });
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      // how much of x% to mix with V litres of y% to get z%
      const x = rng.int(1, 12) * 5, y = x + rng.int(2, 12) * 5, p = rng.int(1, 6), q = rng.int(1, 6);
      if (p === q || QB.gcd(p, q) !== 1) return null;
      const z = (x * p + y * q) / (p + q);
      if (!C(z)) return null;
      const V = q * rng.int(2, 15) * 2, ask = p * V / q;
      return mk(rng, L, ask, [
        [V * (y - z) / (z - x) * 0 + V * q / p, "Inverted the quantity ratio"],
        [V * (z - x) / (y - x), "Used a fraction of the volume instead of the ratio"],
        [V, "Assumed equal volumes"],
        [V * (y - x) / (z - x), "Used the full gap on one side"],
      ], finish(d, `${cont} has **${V} litres** of a **${y}%** ${sol}. How many litres of a **${x}%** ${sol} must be added to get a **${P(R(z))}** solution?`,
        [`Weaker : stronger = (${y} − ${R(z)}) : (${R(z)} − ${x}) = ${p} : ${q}`, `Weaker needed = ${p}/${q} × ${V} = **${N(ask)} litres**`],
        `Find the ratio by alligation, then scale to the known ${V} litres.`,
        `The ${V} litres belongs to the stronger solution (${q} parts), so each part is ${R(V / q)} litres.`));
    }
    if (k === 1) {
      // add pure solute / pure water
      const V = rng.int(2, 25) * 10, x = rng.int(1, 8) * 5, z = x + rng.int(1, 6) * 5;
      if (z >= 100) return null;
      const add = V * (z - x) / (100 - z), pure = rng.chance(0.5);
      if (!pure) {
        const t = rng.int(2, 8) * 5, V2 = rng.int(2, 20) * 10, zz = x * V2 / (V2 + V2 * (x - t) / t) * 0;
        // add water to dilute x% down to t%
        const w = V2 * (x - t) / t;
        if (t >= x || !C(w) || w <= 0) return null;
        return mk(rng, L, w, [
          [V2 * (x - t) / x, "Divided by the original percent instead of the target"],
          [V2 * t / x, "Inverted the dilution"],
          [V2 * (x - t) / 100, "Treated the percent change as a percent of the volume"],
          [w + V2 / 10, "Added an extra tenth of the volume"],
        ], finish(d, `How many litres of water must be added to **${V2} litres** of a **${x}%** ${sol} to dilute it to **${t}%**?`,
          [`${sub[0].toUpperCase() + sub.slice(1)} in it = ${x}% of ${V2} = ${R(x * V2 / 100)} litres (stays the same)`, `New volume = ${R(x * V2 / 100)} ÷ ${t}% = ${R(x * V2 / t)} litres → water added = **${N(R(w))} litres**`],
          `${sub[0].toUpperCase() + sub.slice(1)} amount stays fixed; new volume = amount ÷ target %.`,
          `Only the water changes; the amount of ${sub} stays the same, so divide that fixed amount by the new percent.`));
      }
      return mk(rng, L, add, [
        [V * (z - x) / 100, "Treated the rise in percent as a percent of the original volume"],
        [V * (z - x) / z, "Divided by the target percent instead of the water percent"],
        [V * (z - x) / (100 - x), "Divided by the original water percent"],
        [add * 2, "Doubled the correct amount"],
      ], finish(d, `How many litres of pure ${sub} must be added to **${V} litres** of a **${x}%** ${sol} to make it **${z}%**?`,
        [`Non-${sub} part = ${100 - x}% of ${V} = ${R(V * (100 - x) / 100)} litres (stays the same)`, `It must be ${100 - z}% of the new volume, so new volume = ${R(V * (100 - x) / (100 - z))} → added = **${N(R(add))} litres**`],
        `Added = V(z − x) ÷ (100 − z) = ${V} × ${z - x} ÷ ${100 - z}.`,
        `Pure ${sub} is 100% ${sub}, so it counts in both the volume and the ${sub}; the water amount is what stays fixed.`));
    }
    // three-step: two solutions, then a final target with water
    const v1 = rng.int(1, 10) * 10, v2 = rng.int(1, 10) * 10, x = rng.int(2, 9) * 10, y = rng.int(1, 9) * 5, w = rng.int(1, 8) * 10;
    if (x <= y) return null;
    const amt = (x * v1 + y * v2) / 100, vol = v1 + v2 + w, conc = amt / vol * 100;
    return mk(rng, P, conc, [
      [(x * v1 + y * v2) / (v1 + v2), "Forgot the water that was added at the end"],
      [(x + y) / 2, "Took the simple average of the two percentages"],
      [(x * v1 + y * v2) / (v1 + v2 + w) / 2, "Halved the final figure"],
      [amt / (v1 + v2) * 100 * (v1 + v2) / (vol + w), "Counted the water twice"],
    ], finish(d, `${cont} mixes **${v1} litres** of a **${x}%** ${sol} with **${v2} litres** of a **${y}%** ${sol}, and then adds **${w} litres** of water. What is the strength of the final ${sol}?`,
      [`${sub[0].toUpperCase() + sub.slice(1)} = ${R(x * v1 / 100)} + ${R(y * v2 / 100)} = ${R(amt)} litres`, `Total volume = ${v1} + ${v2} + ${w} = ${vol} litres`, `Strength = ${R(amt)} ÷ ${vol} × 100 = **${P(R(conc))}**`],
      `Add the ${sub} amounts; divide by the FINAL volume (water included).`,
      `Adding water changes the volume but not the amount of ${sub}.`));
  }) });

  /* ------------------------------------------------------------------ 3. repeated replacement */
  const LIQ = [["milk", "water"], ["pure milk", "water"], ["wine", "water"], ["oil", "water"], ["fruit juice", "water"], ["pure spirit", "water"]];
  QB.gen("quant/mixtures/repeated-replacement", { title: "Repeated replacement", gen: wrap((rng, d) => {
    const [liq, rep] = T(rng, LIQ), vess = T(rng, ["A can", "A jar", "A container", "A tank", "A barrel"]);
    const setup = (n) => {
      const q = T(rng, [3, 4, 5, 6, 8]), p = rng.int(1, q - 1);
      if (QB.gcd(p, q) !== 1) return null;
      const V = q ** n * rng.int(1, n === 1 ? 20 : n === 2 ? 4 : 1) * (n === 1 ? 2 : 1), x = V * (q - p) / q;
      return { p, q, V, x, milk: V * (p / q) ** n };
    };
    if (d === "Easy") {
      const s = setup(1); if (!s || !I(s.x)) return null;
      const askRatio = rng.chance(0.4);
      if (askRatio) {
        const w = s.V - s.milk, ans = [s.milk, w];
        return mk(rng, rt, ans, [
          [[w, s.milk], "Gave the ratio the wrong way round"],
          [[s.V - s.x, s.x], "Used the quantity removed in place of the water"],
          [[s.V, s.x], "Compared the whole with the amount removed"],
          [[s.milk, s.V], "Compared the milk with the whole"],
        ], finish(d, `${vess} contains **${s.V} litres** of ${liq}. **${s.x} litres** are drawn out and replaced with ${rep}. What is the ratio of ${liq} to ${rep} now?`,
          [`${liq[0].toUpperCase() + liq.slice(1)} left = ${s.V} − ${s.x} = ${s.milk} litres`, `${rep[0].toUpperCase() + rep.slice(1)} = ${s.x} litres → ratio = **${rt(ans)}**`],
          `After one replacement the ${liq} is (V − x) and the ${rep} is x.`,
          `Compare ${liq} with ${rep} (${s.milk} : ${s.x}), not with the whole ${s.V}.`), { ratio: true });
      }
      return mk(rng, L, s.milk, [
        [s.x, "Gave the amount removed"],
        [s.V - s.milk - 0, "Gave the amount of water now"],
        [s.milk + s.x / 2, "Counted half of the added " + rep + " as " + liq],
        [s.V * (s.p / s.q) ** 2, "Applied the replacement twice"],
      ], finish(d, `${vess} contains **${s.V} litres** of ${liq}. **${s.x} litres** are taken out and replaced with ${rep}. How many litres of ${liq} are left?`,
        [`Fraction removed = ${s.x}/${s.V} = ${QB.frac(s.x, s.V)}`, `${liq[0].toUpperCase() + liq.slice(1)} left = ${s.V} × ${QB.frac(s.p, s.q)} = **${N(s.milk)} litres**`],
        `${liq[0].toUpperCase() + liq.slice(1)} left = V − x = ${s.V} − ${s.x}.`,
        `The ${s.x} litres added is ${rep}, so it does not count as ${liq}.`));
    }
    if (d === "Medium") {
      const s = setup(2); if (!s || !I(s.x) || !I(s.milk)) return null;
      const askRatio = rng.chance(0.5);
      if (askRatio) {
        const w = s.V - s.milk, ans = [s.milk, w];
        return mk(rng, rt, ans, [
          [[w, s.milk], "Gave the ratio the wrong way round"],
          [[s.V - 2 * s.x, 2 * s.x], "Subtracted the removed amount twice without allowing for the water drawn out"],
          [[s.milk, s.V], "Compared the milk with the whole"],
          [[s.q ** 2 - s.p ** 2, s.p ** 2], "Reversed milk and water"],
        ], finish(d, `${vess} holds **${s.V} litres** of ${liq}. **${s.x} litres** are removed and replaced with ${rep}; the same operation is repeated once more. Find the ratio of ${liq} to ${rep} now.`,
          [`Each time ${liq} is multiplied by (1 − ${s.x}/${s.V}) = ${QB.frac(s.p, s.q)}`, `${liq[0].toUpperCase() + liq.slice(1)} = ${s.V} × (${QB.frac(s.p, s.q)})² = ${N(s.milk)}; ${rep} = ${N(w)}`, `Ratio = **${rt(ans)}**`],
          `Milk : total = (${s.p}/${s.q})² = ${s.p ** 2} : ${s.q ** 2}, so milk : water = ${s.p ** 2} : ${s.q ** 2 - s.p ** 2}.`,
          `The second draw removes some ${liq} AND some ${rep}; the ${liq} shrinks by the same FRACTION each time, not the same amount.`), { ratio: true });
      }
      return mk(rng, L, s.milk, [
        [s.V - 2 * s.x, "Subtracted the removed amount twice"],
        [s.V - s.x, "Applied the replacement only once"],
        [s.V * (s.p / s.q), "Multiplied by the fraction only once"],
        [s.V - s.milk, "Gave the amount of water now"],
      ], finish(d, `${vess} holds **${s.V} litres** of ${liq}. **${s.x} litres** are drawn out and replaced with ${rep}, and then **${s.x} litres** of the new mixture are drawn out and replaced with ${rep} again. How much ${liq} is in the container finally?`,
        [`Remaining fraction each time = 1 − ${s.x}/${s.V} = ${QB.frac(s.p, s.q)}`, `${liq[0].toUpperCase() + liq.slice(1)} = ${s.V} × (${QB.frac(s.p, s.q)})² = **${N(s.milk)} litres**`],
        `Final = V(1 − x/V)² = ${s.V} × ${s.p ** 2}/${s.q ** 2}.`,
        `After the first replacement the container is a mixture, so the second draw removes less than ${s.x} litres of ${liq}.`));
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      const s = setup(3); if (!s || !I(s.x) || !I(s.milk) || s.V > 2000) return null;
      return mk(rng, L, s.milk, [
        [s.V - 3 * s.x, "Subtracted the removed amount three times"],
        [s.V * (s.p / s.q) ** 2, "Applied the replacement only twice"],
        [s.V - s.milk, "Gave the amount of water now"],
        [s.V * (s.p / s.q), "Applied the replacement only once"],
      ], finish(d, `${vess} contains **${s.V} litres** of ${liq}. **${s.x} litres** are removed and replaced with ${rep}, and this is done **three times** in all. How many litres of ${liq} remain?`,
        [`Fraction left each time = ${QB.frac(s.p, s.q)}`, `${liq[0].toUpperCase() + liq.slice(1)} = ${s.V} × (${QB.frac(s.p, s.q)})³ = **${N(s.milk)} litres**`],
        `Final = V × (1 − x/V)³ = ${s.V} × ${s.p ** 3}/${s.q ** 3}.`,
        `Repeated replacement is a power, not a repeated subtraction of ${s.x}.`));
    }
    if (k === 1) {
      // find x given V and final milk
      const n = T(rng, [2, 2, 3]), s = setup(n); if (!s || !I(s.x) || !I(s.milk) || s.V > 2000) return null;
      return mk(rng, L, s.x, [
        [s.V - s.milk, "Gave the total amount of milk that left the vessel"],
        [(s.V - s.milk) / n, "Divided the total fall by the number of draws"],
        [s.V * s.p / s.q, "Gave the amount of milk after one draw"],
        [s.milk, "Gave the final amount of milk"],
      ], finish(d, `${vess} contains **${s.V} litres** of ${liq}. A fixed quantity is drawn out and replaced with ${rep}, and this is done **${n} times**, leaving **${s.milk} litres** of ${liq}. How many litres were drawn out each time?`,
        [`(1 − x/${s.V})^${n} = ${s.milk}/${s.V} = (${s.p}/${s.q})^${n}`, `1 − x/${s.V} = ${s.p}/${s.q} → x = ${s.V} × ${s.q - s.p}/${s.q} = **${N(s.x)} litres**`],
        `Take the ${n}th root of milk/total (${QB.frac(s.milk, s.V)}) to get the per-draw fraction ${s.p}/${s.q}.`,
        `The fall is spread unevenly across the draws, so you cannot divide it by ${n}.`));
    }
    // find V
    const n = 2, s = setup(n); if (!s || !I(s.x) || !I(s.milk) || s.V > 2000) return null;
    return mk(rng, L, s.V, [
      [s.x * s.q / s.p, "Used x ÷ (milk fraction)"],
      [s.milk + 2 * s.x, "Added the removed amounts to the final milk"],
      [s.milk * s.q / s.p, "Undid only one draw"],
      [s.x * s.q, "Multiplied the amount drawn by the denominator"],
    ], finish(d, `A vessel is filled with ${liq}. **${s.x} litres** are drawn out and replaced with ${rep}; this is done twice, and the vessel finally holds **${s.milk} litres** of ${liq}. What is the capacity of the vessel?`,
      [`Let capacity = V: V(1 − ${s.x}/V)² = ${s.milk}`, `(V − ${s.x})² = ${s.milk}V → try V = ${s.V}: (${s.V - s.x})² = ${(s.V - s.x) ** 2} = ${s.milk} × ${s.V}`, `V = **${N(s.V)} litres**`],
      `Milk left = V(1 − x/V)², so (V − x)² = ${s.milk} × V; test the capacity that satisfies it.`,
      `Draw-out amount x is fixed, but the fraction is not given; set up the equation (V − x)² = milk × V.`));
  }) });

  /* ------------------------------------------------------------------ 4. removing and adding water */
  QB.gen("quant/mixtures/removing-and-adding-water", { title: "Removing & adding water", gen: wrap((rng, d) => {
    const [liq] = T(rng, [["milk"], ["fruit juice"], ["lemonade concentrate"], ["sugar syrup"], ["acid"]]), vess = T(rng, ["A mixture", "A drum", "A can", "A tank", "A bottle"]);
    if (d === "Easy") {
      const a = rng.int(1, 9), b = rng.int(1, 9), k = rng.int(2, 15) * 2, w = rng.int(1, 12) * 2;
      if (a === b || QB.gcd(a, b) !== 1) return null;
      const m0 = a * k, w0 = b * k, ans = [m0, w0 + w];
      return mk(rng, rt, ans, [
        [[m0 + w, w0], "Added the water to the wrong part"],
        [[m0, w0], "Left the added water out"],
        [[a, b + w], "Added the water to the ratio term, not to the quantity"],
        [[w0 + w, m0], "Gave the ratio the wrong way round"],
      ], finish(d, `${vess} has ${liq} and water in the ratio **${a} : ${b}**, with **${m0 + w0} litres** in all. If **${w} litres** of water are added, what is the new ratio of ${liq} to water?`,
        [`${liq[0].toUpperCase() + liq.slice(1)} = ${a}/${a + b} × ${m0 + w0} = ${m0}; water = ${w0}`, `New water = ${w0} + ${w} = ${w0 + w}`, `New ratio = ${m0} : ${w0 + w} = **${rt(ans)}**`],
        `Work with actual litres, add the water, then form the ratio and reduce.`,
        `Adding water changes only the water; the ${liq} stays at ${m0} litres.`), { ratio: true });
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      if (k === 0) {
        const a = rng.int(1, 9), b = rng.int(1, 9), kk = rng.int(2, 15) * 2, add = rng.int(2, 15) * 2, c = null;
        if (a === b || QB.gcd(a, b) !== 1) return null;
        const m0 = a * kk, w0 = b * kk, nw = w0 + add, g = QB.gcd(m0, nw), c1 = m0 / g, c2 = nw / g;
        if (Math.max(c1, c2) > 20 || (c1 === a && c2 === b)) return null;
        return mk(rng, L, add, [
          [add + kk, "Added one ratio unit too many"],
          [Math.abs(c2 - b) * kk, "Used the change in the ratio term times k"],
          [add * 2, "Doubled the correct amount"],
          [(m0 + w0) / 2, "Gave half of the original mixture"],
        ], finish(d, `A ${liq}-water mixture of **${m0 + w0} litres** has the ratio **${a} : ${b}**. How many litres of water must be added to make the ratio **${c1} : ${c2}**?`,
          [`${liq[0].toUpperCase() + liq.slice(1)} = ${m0} litres (unchanged); water = ${w0}`, `${m0} : (${w0} + w) = ${c1} : ${c2} → ${w0} + w = ${m0} × ${c2}/${c1} = ${nw}`, `w = **${add} litres**`],
          `${liq[0].toUpperCase() + liq.slice(1)} stays fixed: new water = ${m0} × ${c2}/${c1}.`,
          `Match the unchanged ${liq} (${m0} litres) to its new ratio term (${c1}) to find the new water.`));
      }
      const a = rng.int(1, 9), b = rng.int(1, 9), kk = rng.int(2, 15), rem = rng.int(1, 6);
      if (a === b || QB.gcd(a, b) !== 1) return null;
      const tot = (a + b) * kk * 2, x = (a + b) * rem, m0 = tot * a / (a + b), w0 = tot - m0, mNew = m0 - x * a / (a + b), wNew = w0 - x * b / (a + b) + x;
      if (!I(mNew) || !I(wNew) || mNew <= 0) return null;
      const ans = [mNew, wNew];
      return mk(rng, rt, ans, [
        [[wNew, mNew], "Gave the ratio the wrong way round"],
        [[m0, w0], "Gave the original ratio"],
        [[m0 - x, w0 + x], "Took the whole removed amount out of the " + liq],
        [[mNew, w0 + x], "Took the proper amount from the " + liq + " but forgot to take water out"],
      ], finish(d, `${vess} has **${tot} litres** of ${liq} and water in the ratio **${a} : ${b}**. **${x} litres** of the mixture are drawn out and replaced with **${x} litres** of water. What is the new ratio of ${liq} to water?`,
        [`Removed: ${liq} ${R(x * a / (a + b))}, water ${R(x * b / (a + b))}`, `${liq[0].toUpperCase() + liq.slice(1)} = ${m0} − ${R(x * a / (a + b))} = ${mNew}; water = ${w0} − ${R(x * b / (a + b))} + ${x} = ${wNew}`, `Ratio = **${rt(ans)}**`],
        `The ${x} litres drawn out keeps the old ratio ${a} : ${b}; only then add the ${x} litres of water.`,
        `What is drawn out is a mixture, so it contains both ${liq} and water in the old ratio.`), { ratio: true });
    }
    const k = rng.int(0, 2);
    if (k === 0) {
      // add water to p% water to reach q%
      const V = rng.int(2, 20) * 10, p = rng.int(1, 6) * 5, q = p + rng.int(1, 6) * 5;
      if (q >= 90) return null;
      const w = V * (q - p) / (100 - q);
      return mk(rng, L, w, [
        [V * (q - p) / 100, "Treated the rise in water percent as a percent of the original volume"],
        [V * (q - p) / q, "Divided by the target water percent"],
        [V * (q - p) / (100 - p), "Divided by the original " + liq + " percent"],
        [w * 2, "Doubled the correct amount"],
      ], finish(d, `A mixture of **${V} litres** contains **${p}%** water and the rest ${liq}. How many litres of water must be added to make the water **${q}%**?`,
        [`${liq[0].toUpperCase() + liq.slice(1)} = ${100 - p}% of ${V} = ${R(V * (100 - p) / 100)} litres (fixed)`, `After adding w: ${R(V * (100 - p) / 100)} = ${100 - q}% of (${V} + w) → ${V} + w = ${R(V * (100 - p) / (100 - q))}`, `w = **${N(R(w))} litres**`],
        `The ${liq} is fixed, so track IT: new total = ${liq} ÷ ${100 - q}%.`,
        `Water going from ${p}% to ${q}% means ${liq} going from ${100 - p}% to ${100 - q}% of a larger total.`));
    }
    if (k === 1) {
      // evaporation: water % falls
      const V = rng.int(2, 20) * 20, p = rng.int(4, 9) * 10, q = p - rng.int(1, 4) * 10;
      if (q <= 0) return null;
      const rest = V * (100 - p) / 100, newV = rest / ((100 - q) / 100), ev = V - newV;
      if (!C(ev) || ev <= 0) return null;
      return mk(rng, L, ev, [
        [V * (p - q) / 100, "Treated the fall in percent as a percent of the original volume"],
        [V * (p - q) / p, "Divided by the original water percent"],
        [newV, "Gave the final volume, not the amount evaporated"],
        [ev / 2, "Halved the answer"],
      ], finish(d, `**${V} litres** of ${liq} solution contain **${p}%** water. How many litres of water must evaporate so that the water content becomes **${q}%**?`,
        [`${liq[0].toUpperCase() + liq.slice(1)} (non-water) = ${100 - p}% of ${V} = ${R(rest)} litres (unchanged)`, `New volume = ${R(rest)} ÷ ${100 - q}% = ${R(newV)} litres`, `Evaporated = ${V} − ${R(newV)} = **${N(R(ev))} litres**`],
        `Non-water part is fixed: ${V} × ${100 - p} = (${V} − e) × ${100 - q}.`,
        `Track the part that does NOT change (the ${liq}), not the water.`));
    }
    // ratio after drawing out, ask original water or quantity
    const a = rng.int(1, 9), b = rng.int(1, 9), kk = rng.int(2, 10), add = rng.int(1, 8) * 2;
    if (a === b || QB.gcd(a, b) !== 1) return null;
    const m0 = a * kk * 2, w0 = b * kk * 2, nw = w0 + add, g = QB.gcd(m0, nw), c1 = m0 / g, c2 = nw / g;
    if (Math.max(c1, c2) > 25 || (c1 === a && c2 === b)) return null;
    return mk(rng, L, m0 + w0, [
      [m0, "Gave only the " + liq],
      [w0, "Gave only the water"],
      [m0 + nw, "Gave the final volume"],
      [add * (a + b), "Multiplied the water added by the ratio sum"],
    ], finish(d, `The ratio of ${liq} to water in a mixture is **${a} : ${b}**. When **${add} litres** of water are added, the ratio becomes **${c1} : ${c2}**. What was the volume of the original mixture?`,
      [`Let ${liq} = ${a}k, water = ${b}k: ${a}k : (${b}k + ${add}) = ${c1} : ${c2}`, `${c2 * a}k = ${c1 * b}k + ${c1 * add} → k = ${kk * 2}`, `Original = (${a} + ${b}) × ${kk * 2} = **${N(m0 + w0)} litres**`],
      `Keep the ${liq} fixed: ${a}k = ${c1}·m, ${b}k + ${add} = ${c2}·m; solve for k.`,
      `Only the water changes; set up the equation with the unchanged ${liq} as the anchor.`));
  }) });
})();
