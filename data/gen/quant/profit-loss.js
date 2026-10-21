/* =====================================================================
   Profit, loss & discount: nine question generators (one per catalog pattern).
   Easy / Medium / Hard, clean answers, every wrong option comes from a real mistake.
   ===================================================================== */
(function () {
  const M = (x) => QB.money(x), N = (x) => QB.num(x), P = (x) => QB.pct(x);
  const R = (x) => QB.round(x, 2);
  const C = (x) => isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const I = Number.isInteger;
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 95 };
  const ITEMS = ["a wristwatch", "a school bag", "a pair of shoes", "a table fan", "a mixer grinder", "a study lamp", "a cricket bat", "a bicycle", "a backpack", "a steel almirah", "a wall clock", "a sofa set", "a set of kitchen knives", "a printer", "a pair of headphones", "a water purifier"];
  const GOODS = ["rice", "sugar", "wheat flour", "dal", "tea leaves", "cooking oil", "turmeric", "groundnuts", "jaggery", "mangoes"];
  const WHO = ["A shopkeeper", "A trader", "Ramesh", "Meena", "A retailer", "Farhan", "Lakshmi", "A dealer", "Suresh", "Anita", "A stationer", "A wholesaler"];

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 1500; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("profit-loss: no clean question found");
    };
  }
  function mk(rng, f, ans, wrongs, extra) {
    if (!C(ans) || ans <= 0) return null;
    const A = f(R(ans));
    const seen = new Set([A.toLowerCase()]);
    const pairs = [[A, null]];
    for (const w of wrongs) {
      if (pairs.length === 4) break;
      const v = w[0];
      if (!isFinite(v) || v <= 0 || Math.abs(v - ans) < 0.2) continue;
      const t = f(R(v));
      if (seen.has(t.toLowerCase()) || /NaN|undefined|Infinity/.test(t)) continue;
      seen.add(t.toLowerCase());
      pairs.push([t, w[1]]);
    }
    if (pairs.length < 4) return null;
    const o = QB.options(rng, pairs);
    return Object.assign({ time: TIME[extra.d] }, extra, o, { calc: String(R(ans)) });
  }
  const finish = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });

  /* ------------------------------------------------------------ 1. basic profit / loss % */
  QB.gen("quant/profit-loss/basic-profit-loss-pct", { title: "Basic profit / loss %", gen: wrap((rng, d) => {
    const who = T(rng, WHO), it = T(rng, ITEMS);
    if (d === "Easy") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const cp = rng.int(4, 60) * 50, p = T(rng, [5, 10, 12.5, 15, 20, 25, 30, 40, 50]), sp = cp * (1 + p / 100);
        if (!I(sp)) return null;
        return mk(rng, P, p, [
          [(sp - cp) / sp * 100, `Divided the profit by the selling price (${M(sp)}) instead of the cost price`],
          [sp / cp * 100, "Gave SP ÷ CP × 100, which includes the cost itself"],
          [sp - cp, "Quoted the profit in rupees as if it were a percentage"],
          [p * 2, "Doubled the correct figure"],
        ], finish(d, `${who} buys ${it} for **${M(cp)}** and sells it for **${M(sp)}**. Find the profit percent.`,
          [`Profit = ${M(sp)} − ${M(cp)} = ${M(sp - cp)}`, `Profit % = profit ÷ **CP** × 100 = ${sp - cp}/${cp} × 100 = **${P(p)}**`],
          `Reduce profit/CP: ${QB.frac(sp - cp, cp)} = ${P(p)}.`,
          `Profit % is always on the cost price. Using SP as the base gives ${P(R((sp - cp) / sp * 100))}.`));
      }
      if (k === 1) {
        const cp = rng.int(4, 60) * 50, l = T(rng, [5, 10, 12.5, 20, 25, 30, 40]), sp = cp * (1 - l / 100);
        if (!I(sp)) return null;
        return mk(rng, P, l, [
          [(cp - sp) / sp * 100, `Divided the loss by the selling price (${M(sp)}) instead of the cost price`],
          [sp / cp * 100, "Gave SP ÷ CP × 100, which is what remains, not the loss"],
          [cp - sp, "Quoted the loss in rupees as if it were a percentage"],
          [l / 2, "Halved the correct figure"],
        ], finish(d, `${who} bought ${it} for **${M(cp)}** and had to sell it for **${M(sp)}**. Find the loss percent.`,
          [`Loss = ${M(cp)} − ${M(sp)} = ${M(cp - sp)}`, `Loss % = loss ÷ CP × 100 = ${cp - sp}/${cp} × 100 = **${P(l)}**`],
          `Reduce loss/CP: ${QB.frac(cp - sp, cp)} = ${P(l)}.`,
          `Loss % is on the cost price, never on the selling price.`));
      }
      const cp = rng.int(4, 60) * 50, p = T(rng, [10, 20, 25, 30, 40, 5, 15]), sp = cp * (1 + p / 100);
      return mk(rng, M, sp, [
        [cp * (1 - p / 100), "Subtracted the percentage instead of adding it"],
        [cp + p, `Added ${p} rupees instead of ${p}% of the cost`],
        [cp * p / 100, "Gave only the profit, not the selling price"],
        [cp * (1 + p / 10), "Moved the decimal one place wrong"],
      ], finish(d, `${who} buys ${it} for **${M(cp)}** and wants a profit of **${p}%**. At what price should it be sold?`,
        [`SP = CP × (100 + profit%)/100 = ${M(cp)} × ${100 + p}/100`, `= **${M(sp)}**`],
        `Take ${p}% of ${N(cp)} (= ${N(cp * p / 100)}) and add it to the cost.`,
        `The selling price includes the cost: the ${p}% profit is only the extra part.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      const cp = rng.int(6, 60) * 100, rep = rng.int(1, 8) * 50, tr = rng.int(0, 4) * 50, tot = cp + rep + tr;
      if (k === 0) {
        const p = T(rng, [10, 12.5, 15, 20, 25, 30, 8, 16]), sp = tot * (1 + p / 100);
        if (!I(sp)) return null;
        return mk(rng, P, p, [
          [(sp - cp) / cp * 100, "Took the profit on the purchase price alone and forgot the extra expenses"],
          [(sp - tot) / sp * 100, "Divided by the selling price instead of the total cost"],
          [(sp - cp - rep) / (cp + rep) * 100, tr ? "Left out the transport cost" : "Left out part of the cost"],
          [(sp - tot) / tot * 50, "Halved the correct figure"],
        ], finish(d, `${who} buys ${it} for **${M(cp)}**, spends **${M(rep)}** on repairs${tr ? ` and **${M(tr)}** on transport` : ""}, and sells it for **${M(sp)}**. Find the profit percent.`,
          [`Total cost = ${M(cp)} + ${M(rep)}${tr ? ` + ${M(tr)}` : ""} = ${M(tot)}`, `Profit = ${M(sp)} − ${M(tot)} = ${M(sp - tot)}`, `Profit % = ${sp - tot}/${tot} × 100 = **${P(p)}**`],
          `Add every expense to the cost first; the base for profit % is that total, ${N(tot)}.`,
          `Repairs and transport are part of the cost price. Using only ${N(cp)} overstates the profit.`));
      }
      if (k === 1) {
        const l = T(rng, [10, 12.5, 15, 20, 25, 30]), sp = rng.int(5, 60) * 100 * (1 - l / 100);
        if (!I(sp)) return null;
        const c0 = sp / (1 - l / 100), p = T(rng, [10, 20, 25, 30, 40]), target = c0 * (1 + p / 100);
        return mk(rng, M, target, [
          [sp * (1 + p / 100), `Applied the ${p}% to the loss-making SP instead of the cost`],
          [sp * (1 + p / 100 + l / 100), "Added the loss % and the profit % to the SP"],
          [c0 * (1 - p / 100), "Subtracted the profit % instead of adding it"],
          [c0 + (c0 - sp), "Added the earlier loss amount to the cost"],
        ], finish(d, `${who} sold ${it} for **${M(sp)}** at a loss of **${P(l)}**. At what price should it have been sold to make a profit of **${p}%**?`,
          [`SP = ${100 - l}% of CP, so CP = ${M(sp)} × 100/${100 - l} = ${M(c0)}`, `Required SP = ${M(c0)} × ${100 + p}/100 = **${M(target)}**`],
          `Go back to the cost first: CP = ${N(sp)} ÷ ${R((100 - l) / 100)} = ${N(c0)}, then add ${p}%.`,
          `The ${p}% profit is on the cost, not on the selling price at which the loss occurred.`));
      }
      const q = rng.int(4, 40) * 5, cpu = rng.int(2, 18) * 10, n = q * 10 / 10;
      const p = T(rng, [10, 20, 25, 30, 40]);
      const gain = n * cpu * p / 100;
      const g = T(rng, GOODS);
      return mk(rng, M, gain, [
        [n * cpu * (1 + p / 100), "Gave the total selling amount, not the profit"],
        [n * cpu, "Gave the total cost"],
        [n * cpu * p / 10, "Moved the decimal one place wrong"],
        [cpu * p / 100, "Found the profit on a single kilogram only"],
      ], finish(d, `${who} buys **${n} kg** of ${g} at **${M(cpu)} per kg** and sells all of it at a profit of **${p}%**. How much profit does he make in rupees?`,
        [`Total cost = ${n} × ${cpu} = ${M(n * cpu)}`, `Profit = ${p}% of ${M(n * cpu)} = **${M(gain)}**`],
        `Profit = ${p}% of the total cost: ${N(n * cpu)} × ${p}/100.`,
        `The question asks for the profit alone, not the amount he receives.`));
    }
    // Hard
    const k = rng.int(0, 1);
    if (k === 0) {
      const cp1 = rng.int(4, 30) * 100, cp2 = rng.int(4, 30) * 100, p1 = T(rng, [10, 20, 25, 30, 40]), l2 = T(rng, [10, 15, 20, 25, 5]);
      const s1 = cp1 * (1 + p1 / 100), s2 = cp2 * (1 - l2 / 100), tot = cp1 + cp2, net = s1 + s2 - tot;
      if (!I(s1) || !I(s2) || net === 0) return null;
      const pct = net / tot * 100, f = (x) => x < 0 ? "−" + P(R(-x)) : P(R(x));
      if (net < 0) return null;
      return mk(rng, P, pct, [
        [(p1 - l2), `Subtracted the two percentages (${p1} − ${l2}) although the cost prices differ`],
        [(p1 - l2) / 2, "Averaged the two percentages"],
        [net / s1 * 100, "Divided the net gain by the total selling price"],
        [net / cp1 * 100, "Divided the net gain by only the first cost price"],
      ], finish(d, `${who} sells two items: one bought at **${M(cp1)}** at a **${p1}%** profit, the other bought at **${M(cp2)}** at a **${l2}%** loss. What is the overall profit percent?`,
        [`SP1 = ${M(s1)}, SP2 = ${M(s2)}; total SP = ${M(s1 + s2)}`, `Total CP = ${M(tot)}; net profit = ${M(net)}`, `Overall % = ${net}/${tot} × 100 = **${P(R(pct))}**`],
        `Work in rupees: profit ${M(cp1 * p1 / 100)} minus loss ${M(cp2 * l2 / 100)} = ${M(net)}, over total cost ${N(tot)}.`,
        `Percentages with different bases cannot be netted directly; convert to rupees first.`));
    }
    const l = T(rng, [10, 12.5, 20, 25, 30, 40]), p = T(rng, [10, 20, 25, 30, 40, 50]), d1 = rng.int(2, 24) * 50;
    const cp = d1 / (l / 100 + p / 100);
    if (!I(cp) || cp > 20000) return null;
    const lowSP = cp * (1 - l / 100), hiSP = cp * (1 + p / 100);
    return mk(rng, M, cp, [
      [d1 * 100 / p, `Used only the profit % (${p}%) with the difference`],
      [d1 * 100 / Math.abs(p - l), `Subtracted the two percentages (${p} − ${l}) instead of adding them`],
      [lowSP, "Gave the lower selling price"],
      [d1 * 100 / l, `Used only the loss % (${l}%) with the difference`],
    ], finish(d, `${who} finds that selling ${it} at a loss of **${P(l)}** would bring **${M(d1)}** less than selling it at a profit of **${p}%**. What is the cost price?`,
      [`The two selling prices differ by (${l} + ${p})% of CP = ${R(l + p)}% of CP`, `${R(l + p)}% of CP = ${M(d1)}, so CP = ${M(d1)} × 100/${R(l + p)} = **${M(cp)}**`],
      `Gap between the two selling prices = (loss % + profit %) of CP, so CP = gap ÷ ${R((l + p) / 100)}.`,
      `The gap spans from −${l}% to +${p}%, so the percentages add (${R(l + p)}%), they do not subtract.`));
  }) });

  /* ------------------------------------------------------------ 2. CP : SP ratios */
  QB.gen("quant/profit-loss/cp-sp-ratios", { title: "CP : SP ratios", gen: wrap((rng, d) => {
    const who = T(rng, WHO), it = T(rng, ITEMS);
    if (d === "Easy") {
      const a = rng.int(2, 12), b = rng.int(2, 14);
      if (a === b || QB.gcd(a, b) !== 1) return null;
      const pct = (b - a) / a * 100, up = b > a;
      return mk(rng, P, Math.abs(pct), [
        [Math.abs(b - a) / b * 100, "Divided the difference by the selling-price part instead of the cost-price part"],
        [b / a * 100, `Gave SP ÷ CP × 100 (${P(R(b / a * 100))}), which is not the change`],
        [Math.abs(b - a), "Quoted the difference of the ratio terms as the percentage"],
        [Math.abs(pct) / 2, "Halved the correct figure"],
      ], finish(d, `${who} deals in ${it.replace(/^an? /, "")}s. The ratio of cost price to selling price of ${it} is **${a} : ${b}**. Find the ${up ? "profit" : "loss"} percent.`,
        [`Let CP = ${a}k and SP = ${b}k`, `${up ? "Profit" : "Loss"} = ${Math.abs(b - a)}k`, `% = ${Math.abs(b - a)}k/${a}k × 100 = **${P(R(Math.abs(pct)))}**`],
        `Difference of the ratio terms over the CP term: ${Math.abs(b - a)}/${a}.`,
        `The base is the CP term (${a}), not the SP term (${b}).`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      const a = rng.int(3, 14), b = rng.int(3, 16);
      if (a === b || QB.gcd(a, b) !== 1) return null;
      const m = rng.int(2, 40) * 10, up = b > a;
      if (k === 0) {
        const diff = Math.abs(b - a) * m, ans = b * m;
        return mk(rng, M, ans, [
          [a * m, "Gave the cost price instead of the selling price"],
          [diff, "Gave the profit/loss amount itself"],
          [(a + b) * m, "Added the two ratio terms"],
          [b * m + diff, "Added the profit/loss on top of the selling price"],
        ], finish(d, `${who} buys ${it} and sells it so that CP : SP = **${a} : ${b}**. The ${up ? "profit" : "loss"} on the sale is **${M(diff)}**. Find the selling price.`,
          [`${up ? "Profit" : "Loss"} = ${Math.abs(b - a)} parts = ${M(diff)}, so 1 part = ${M(m)}`, `SP = ${b} parts = ${b} × ${m} = **${M(ans)}**`],
          `Value of one part = ${N(diff)} ÷ ${Math.abs(b - a)} = ${N(m)}; multiply by the SP term ${b}.`,
          `The difference of the ratio terms is the profit, not the selling price.`));
      }
      const ans = a * m;
      return mk(rng, M, ans, [
        [b * m, "Gave the selling price instead of the cost price"],
        [Math.abs(b - a) * m, "Gave the profit/loss amount"],
        [(a + b) * m, "Added the two ratio terms"],
        [a * m * 2, "Doubled the cost price"],
      ], finish(d, `For ${it}, the selling price is **${M(b * m)}** and CP : SP is **${a} : ${b}**. Find the cost price.`,
        [`SP = ${b} parts = ${M(b * m)}, so 1 part = ${M(m)}`, `CP = ${a} parts = ${a} × ${m} = **${M(ans)}**`],
        `One part = SP ÷ ${b} = ${N(m)}, and CP is ${a} of those parts.`,
        `The ratio is CP : SP; do not read it the other way round.`));
    }
    const k = rng.int(0, 1);
    if (k === 0) {
      // two ratios chained: CP:MP and MP:SP
      const a = rng.int(2, 9), b = rng.int(2, 12), c = rng.int(2, 12), e = rng.int(2, 12);
      // CP:MP = a:b, MP:SP = c:e ; CP : SP = a*c : b*e
      const cpP = a * c, spP = b * e;
      if (cpP === spP) return null;
      const pct = Math.abs(spP - cpP) / cpP * 100, up = spP > cpP;
      return mk(rng, P, pct, [
        [Math.abs(spP - cpP) / spP * 100, "Divided the difference by the SP term instead of the CP term"],
        [Math.abs(b - a) / a * 100, "Used only the first ratio and ignored the discount step"],
        [Math.abs(e - c) / c * 100, "Used only the second ratio"],
        [pct / 2, "Halved the correct figure"],
      ], finish(d, `For ${it}, the ratio of cost price to marked price is **${a} : ${b}** and the ratio of marked price to selling price is **${c} : ${e}**. Find the ${up ? "profit" : "loss"} percent.`,
        [`Make the marked-price term common: CP : MP : SP = ${a * c} : ${b * c} : ${b * e}`, `CP : SP = ${cpP} : ${spP}`, `${up ? "Profit" : "Loss"} % = ${Math.abs(spP - cpP)}/${cpP} × 100 = **${P(R(pct))}**`],
        `Chain the ratios: multiply CP term by c and SP term by b (here ${a}×${c} : ${b}×${e}).`,
        `You cannot read CP : SP straight from the two ratios; the middle term (marked price) must be matched first.`));
    }
    const a = rng.int(3, 12), b = rng.int(3, 14);
    if (a === b || QB.gcd(a, b) !== 1) return null;
    const m = rng.int(2, 30) * 10, up = b > a;
    const ex = rng.int(2, 6) * 10;  // percent rise in SP
    const sp2 = b * m * (1 + ex / 100), cp = a * m, pct = (sp2 - cp) / cp * 100;
    if (!C(sp2) || pct <= 0) return null;
    return mk(rng, P, pct, [
      [(b - a) / a * 100 + ex, `Added the ${ex}% to the original profit % (they have different bases)`],
      [(sp2 - cp) / sp2 * 100, "Divided by the new selling price instead of the cost"],
      [Math.abs(b - a) / a * 100, "Ignored the extra rise in the selling price"],
      [ex, `Gave the ${ex}% rise itself`],
    ], finish(d, `A trader's CP : SP is **${a} : ${b}**. If he raises the selling price by **${ex}%**, what is his new ${"profit"} percent? (Cost stays the same.)`,
      [`Let CP = ${a * 100}, so SP = ${b * 100}`, `New SP = ${b * 100} × ${100 + ex}/100 = ${R(b * 100 * (1 + ex / 100))}`, `Profit % = (${R(b * 100 * (1 + ex / 100))} − ${a * 100})/${a * 100} × 100 = **${P(R(pct))}**`],
      `Pick convenient values (CP = ${a * 100}), apply the rise to SP, then compare with CP.`,
      `A ${ex}% rise in SP is ${ex}% of SP, not ${ex}% of CP; the profit % cannot simply be added to it.`));
  }) });

  /* ------------------------------------------------------------ 3. marked price & discount */
  QB.gen("quant/profit-loss/marked-price-and-discount", { title: "Marked price & discount", gen: wrap((rng, d) => {
    const who = T(rng, WHO), it = T(rng, ITEMS);
    if (d === "Easy") {
      const k = rng.int(0, 1);
      const mp = rng.int(4, 80) * 50, dsc = T(rng, [5, 10, 12.5, 15, 20, 25, 30, 40]);
      const sp = mp * (1 - dsc / 100);
      if (!I(sp)) return null;
      if (k === 0) return mk(rng, M, sp, [
        [mp * dsc / 100, "Gave the discount amount, not the price paid"],
        [mp * (1 + dsc / 100), "Added the discount instead of subtracting it"],
        [mp - dsc, `Subtracted ${dsc} rupees instead of ${dsc}%`],
        [mp * (1 - dsc / 10), "Moved the decimal one place wrong"],
      ], finish(d, `${it[0].toUpperCase() + it.slice(1)} is marked at **${M(mp)}**. A customer gets a discount of **${P(dsc)}**. How much does the customer pay?`,
        [`Discount = ${P(dsc)} of ${M(mp)} = ${M(mp * dsc / 100)}`, `Price paid = ${M(mp)} − ${M(mp * dsc / 100)} = **${M(sp)}**`],
        `Pay ${100 - dsc}% of the marked price: ${N(mp)} × ${R((100 - dsc) / 100)}.`,
        `The discount is always on the marked price, and the customer pays what is left after it.`));
      return mk(rng, P, dsc, [
        [(mp - sp) / sp * 100, "Divided the discount by the price paid instead of the marked price"],
        [sp / mp * 100, "Gave SP ÷ MP × 100, which is what the customer pays"],
        [mp - sp, "Quoted the discount in rupees as a percentage"],
        [dsc * 2, "Doubled the correct figure"],
      ], finish(d, `${it[0].toUpperCase() + it.slice(1)} marked at **${M(mp)}** is sold for **${M(sp)}**. What is the rate of discount?`,
        [`Discount = ${M(mp)} − ${M(sp)} = ${M(mp - sp)}`, `Discount % = ${mp - sp}/${mp} × 100 = **${P(dsc)}**`],
        `Discount % = (MP − SP)/MP: ${QB.frac(mp - sp, mp)} = ${P(dsc)}.`,
        `The base for a discount is the marked price, not the selling price.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      const cp = rng.int(4, 40) * 100, up = T(rng, [20, 25, 30, 40, 50, 60]), dsc = T(rng, [10, 12.5, 15, 20, 25, 30]);
      const mp = cp * (1 + up / 100), sp = mp * (1 - dsc / 100);
      if (!I(mp) || !C(sp)) return null;
      const pct = (sp - cp) / cp * 100;
      if (k === 0) {
        if (pct === 0) return null;
        const profit = pct > 0;
        return mk(rng, P, Math.abs(pct), [
          [up - dsc, `Subtracted the discount from the mark-up (${up} − ${dsc}), though they have different bases`],
          [Math.abs(sp - cp) / mp * 100, "Divided by the marked price instead of the cost price"],
          [Math.abs(sp - cp) / sp * 100, "Divided by the selling price instead of the cost price"],
          [up + dsc, "Added the mark-up and the discount"],
        ], finish(d, `${who} marks ${it} **${up}%** above its cost price and then allows a discount of **${P(dsc)}**. Find the ${profit ? "profit" : "loss"} percent.`,
          [`Let CP = ${M(cp)}; MP = ${M(mp)}`, `SP = ${100 - dsc}% of MP = ${M(sp)}`, `${profit ? "Profit" : "Loss"} % = ${R(Math.abs(sp - cp))}/${cp} × 100 = **${P(R(Math.abs(pct)))}**`],
          `Net factor = ${(100 + up) / 100} × ${(100 - dsc) / 100} = ${R((100 + up) * (100 - dsc) / 10000)}, so the result is ${P(R(Math.abs(pct)))}.`,
          `The mark-up is on CP but the discount is on MP; the two percentages cannot be subtracted directly.`));
      }
      return mk(rng, M, sp, [
        [mp, "Gave the marked price"],
        [cp * (1 + (up - dsc) / 100), "Used mark-up minus discount on the cost"],
        [mp * (1 - dsc / 100) - cp, "Gave the profit, not the selling price"],
        [cp * (1 - dsc / 100), "Applied the discount on the cost price"],
      ], finish(d, `${who} buys ${it} for **${M(cp)}**, marks it **${up}%** above cost, and sells it after a **${P(dsc)}** discount. What is the selling price?`,
        [`MP = ${M(cp)} × ${100 + up}/100 = ${M(mp)}`, `SP = ${M(mp)} × ${R(100 - dsc)}/100 = **${M(sp)}**`],
        `Multiply the factors in order: ${N(cp)} × ${R(1 + up / 100)} × ${R(1 - dsc / 100)}.`,
        `The discount applies to the marked price (${M(mp)}), not the cost price.`));
    }
    // Hard: find MP to reach target profit after discount
    const k = rng.int(0, 1);
    if (k === 0) {
      const cp = rng.int(4, 50) * 100, p = T(rng, [10, 15, 20, 25, 30, 40]), dsc = T(rng, [10, 20, 25, 30, 40, 5, 15]);
      const sp = cp * (1 + p / 100), mp = sp * 100 / (100 - dsc);
      if (!I(sp) || !C(mp)) return null;
      return mk(rng, M, mp, [
        [cp * (1 + (p + dsc) / 100), `Marked up by profit % plus discount % (${p + dsc}%) on the cost`],
        [sp * (1 + dsc / 100), "Added the discount % on top of the selling price"],
        [sp, "Gave the selling price instead of the marked price"],
        [cp * (1 + p / 100) * (1 - dsc / 100), "Applied the discount a second time instead of reversing it"],
      ], finish(d, `${who} buys ${it} for **${M(cp)}**. At what price should it be marked so that after a discount of **${P(dsc)}** a profit of **${p}%** is still made?`,
        [`Required SP = ${M(cp)} × ${100 + p}/100 = ${M(sp)}`, `SP = ${100 - dsc}% of MP, so MP = ${M(sp)} × 100/${100 - dsc} = **${M(mp)}**`],
        `Find the target SP, then divide by ${R((100 - dsc) / 100)} to get back to the marked price.`,
        `The discount is taken off the marked price, so to reverse it you divide by (1 − discount), not multiply by (1 + discount).`));
    }
    const dsc = T(rng, [10, 20, 25, 30, 40, 15, 12.5]), cp = rng.int(4, 40) * 100, ml = T(rng, [20, 25, 30, 40, 50, 60, 80]);
    const mp = cp * (1 + ml / 100), sp = mp * (1 - dsc / 100), extra = T(rng, [5, 10, 15, 20]), sp2 = sp - mp * extra / 100;
    if (!I(mp) || !C(sp) || !C(sp2)) return null;
    const pct = (sp2 - cp) / cp * 100;
    if (pct <= 0) return null;
    return mk(rng, P, pct, [
      [(sp - cp) / cp * 100, "Ignored the extra discount"],
      [(sp2 - cp) / mp * 100, "Divided the profit by the marked price instead of the cost"],
      [(sp2 - cp) / sp2 * 100, "Divided the profit by the new selling price"],
      [ml - dsc - extra, "Subtracted all the percentages from the mark-up directly"],
    ], finish(d, `${who} marks ${it} **${ml}%** above cost and normally gives a **${P(dsc)}** discount. During a sale, a further **${extra}%** of the marked price is knocked off. Find the profit percent in the sale.`,
      [`Let CP = ${M(cp)}, MP = ${M(mp)}`, `Total discount = ${R(dsc + extra)}% of MP, SP = ${M(sp2)}`, `Profit % = ${R(sp2 - cp)}/${cp} × 100 = **${P(R(pct))}**`],
      `Total discount on MP is ${R(dsc + extra)}%, so SP = ${R((100 - dsc - extra) / 100)} × MP.`,
      `Both discounts are quoted on the marked price, so they add. (They are not chained, unlike the successive-discount pattern.)`));
  }) });

  /* ------------------------------------------------------------ 4. successive discounts */
  QB.gen("quant/profit-loss/successive-discounts", { title: "Successive discounts", gen: wrap((rng, d) => {
    const it = T(rng, ITEMS), who = T(rng, WHO);
    const DS = [5, 10, 12.5, 15, 20, 25, 30, 40, 50];
    if (d === "Easy") {
      const a = T(rng, DS), b = T(rng, DS), net = a + b - a * b / 100;
      return mk(rng, P, net, [
        [a + b, "Added the two discounts without allowing for the second one acting on a smaller price"],
        [a * b / 100, "Gave only the product term"],
        [a + b + a * b / 100, "Added the product term instead of subtracting it"],
        [Math.abs(a - b) || null, "Took the difference of the two discounts"],
      ], finish(d, `A shop offers successive discounts of **${P(a)}** and **${P(b)}** on ${it}. What single discount is equivalent to these?`,
        [`Net = a + b − ab/100 = ${a} + ${b} − ${R(a * b / 100)}`, `= **${P(R(net))}**`],
        `Multiply what is paid: ${R((100 - a) / 100)} × ${R((100 - b) / 100)} = ${R((100 - a) * (100 - b) / 10000)}, so the discount is ${P(R(net))}.`,
        `The second discount works on the reduced price, so ${a} + ${b} = ${a + b}% overstates the saving.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      const a = T(rng, DS), b = T(rng, DS), mp = rng.int(5, 80) * 100, sp = mp * (1 - a / 100) * (1 - b / 100);
      if (!C(sp)) return null;
      if (k === 0) return mk(rng, M, sp, [
        [mp * (1 - (a + b) / 100), "Added the discounts and took one big discount"],
        [mp * (1 - a / 100), "Applied only the first discount"],
        [mp * (1 - a / 100) * (1 + b / 100), "Added the second percentage instead of subtracting it"],
        [mp - mp * a / 100 - b, `Took ${b} rupees off instead of ${P(b)}`],
      ], finish(d, `${who} marks ${it} at **${M(mp)}** and offers successive discounts of **${P(a)}** and **${P(b)}**. What is the final price?`,
        [`After the first: ${M(mp)} × ${R((100 - a) / 100)} = ${M(mp * (1 - a / 100))}`, `After the second: × ${R((100 - b) / 100)} = **${M(sp)}**`],
        `${N(mp)} × ${R((100 - a) / 100)} × ${R((100 - b) / 100)}.`,
        `Each discount acts on the price left by the previous one.`));
      const c = T(rng, [5, 10, 20, 25]), cp = rng.int(4, 40) * 100;
      const sp3 = cp * (1 + 0), mk3 = sp * 0;
      const net = (1 - a / 100) * (1 - b / 100);
      return mk(rng, M, mp * (1 - net), [
        [mp * (a + b) / 100, "Added the two discounts"],
        [mp * a / 100, "Counted only the first discount"],
        [sp, "Gave the final price, not the saving"],
        [mp * (a * b / 100) / 100, "Gave only the product term"],
      ], finish(d, `A ${it.replace(/^an? /, "")} marked at **${M(mp)}** is sold after discounts of **${P(a)}** and **${P(b)}** in succession. How much does the buyer save in total?`,
        [`Price paid = ${M(mp)} × ${R((100 - a) / 100)} × ${R((100 - b) / 100)} = ${M(sp)}`, `Saving = ${M(mp)} − ${M(sp)} = **${M(mp - sp)}**`],
        `Net discount = ${a} + ${b} − ${R(a * b / 100)} = ${R(a + b - a * b / 100)}%; take that % of ${N(mp)}.`,
        `The total saving is less than the sum of the two separate discounts on ${N(mp)}.`));
    }
    const k = rng.int(0, 1);
    if (k === 0) {
      const a = T(rng, [10, 20, 25, 30, 40, 50]), b = T(rng, [10, 20, 25, 30, 40, 50]), c = T(rng, [10, 20, 25, 30, 5, 15]);
      const net = 100 - (100 - a) * (100 - b) * (100 - c) / 10000;
      return mk(rng, P, net, [
        [a + b + c, "Added the three discounts"],
        [100 - (100 - a) * (100 - b) / 100, "Used only the first two discounts"],
        [100 - (100 - a) * (100 - b) * (100 - c) / 10000 + a * b * c / 10000, "Added the three-way product term"],
        [(a + b + c) / 3, "Averaged the three discounts"],
      ], finish(d, `Three successive discounts of **${P(a)}**, **${P(b)}** and **${P(c)}** are given on ${it}. What single discount is equivalent?`,
        [`Fraction paid = ${(100 - a) / 100} × ${(100 - b) / 100} × ${(100 - c) / 100} = ${R((100 - a) * (100 - b) * (100 - c) / 1000000)}`, `Discount = 1 − that = **${P(R(net))}**`],
        `Multiply the three "pay" fractions, then subtract from 1.`,
        `With three discounts the saving is still well below ${a + b + c}%, since each acts on a shrinking price.`));
    }
    const a = T(rng, [10, 20, 25, 30, 40, 50]), net = T(rng, [28, 30, 32, 36, 40, 44, 45, 52, 55, 60, 64, 65, 68, 70]);
    const b = 100 - (100 - net) / (100 - a) * 100;
    if (!(b > 0) || b >= 100 || !C(b) || b === a) return null;
    const mp = rng.int(5, 60) * 100, sp = mp * (100 - net) / 100;
    return mk(rng, P, b, [
      [net - a, `Subtracted the first discount from the total (${net} − ${a})`],
      [net / a * 10, "Divided the discounts"],
      [100 - (100 - net) / 100 * (100 - a), "Mixed up the fractions when reversing"],
      [a, "Assumed the two discounts are equal"],
    ], finish(d, `A ${it.replace(/^an? /, "")} marked at **${M(mp)}** is sold for **${M(sp)}** after two successive discounts, the first being **${P(a)}**. What is the second discount?`,
      [`Overall, the buyer pays ${M(sp)}/${M(mp)} = ${R(100 - net)}% of the mark`, `After the first discount he pays ${100 - a}%, so second factor = ${R(100 - net)}/${100 - a} = ${R((100 - net) / (100 - a))}`, `Second discount = 1 − ${R((100 - net) / (100 - a))} = **${P(R(b))}**`],
      `Divide the overall "pay" fraction by the first: ${R((100 - net) / 100)} ÷ ${R((100 - a) / 100)}, then take it away from 1.`,
      `The overall discount is ${net}%; the second discount is on the reduced price, so it is not ${net} − ${a}.`));
  }) });

  /* ------------------------------------------------------------ 5. dishonest dealer / false weights */
  QB.gen("quant/profit-loss/dishonest-dealer-false-weights", { title: "Dishonest dealer / false weights", gen: wrap((rng, d) => {
    const g = T(rng, GOODS), who = T(rng, ["A dealer", "A grocer", "A shopkeeper", "A trader", "A vendor"]);
    const WTS = [800, 750, 900, 840, 960, 880, 920, 625, 500, 950, 600, 700, 850, 980, 800];
    if (d === "Easy") {
      const w = T(rng, [800, 750, 900, 960, 500, 600, 840, 950, 625]), gain = (1000 - w) / w * 100;
      if (!C(gain)) return null;
      return mk(rng, P, gain, [
        [(1000 - w) / 10, "Took the shortfall as a percentage of 1000 g, not of the weight actually given"],
        [1000 - w, "Quoted the shortfall in grams as a percentage"],
        [w / 10, "Gave the weight as a percentage"],
        [gain / 2, "Halved the correct figure"],
      ], finish(d, `${who} sells ${g} at the cost price of ${M(rng.int(3, 40) * 10)} per kg but uses a weight of **${w} g** in place of 1 kg. Find the gain percent.`,
        [`He gives ${w} g but charges for 1000 g`, `Gain = 1000 − ${w} = ${1000 - w} g on ${w} g actually given`, `Gain % = ${1000 - w}/${w} × 100 = **${P(R(gain))}**`],
        `Gain % = error ÷ (true weight − error) × 100 = ${1000 - w}/${w}.`,
        `The base is the weight he really gives (${w} g), not the 1000 g he claims. ${P((1000 - w) / 10)} would be wrong.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      if (k === 0) {
        const w = T(rng, [800, 750, 900, 960, 500, 600, 840, 950, 625, 700, 850]), cp = rng.int(4, 40) * 10;
        const gain = (1000 - w) / w * 100;
        if (!C(gain)) return null;
        const wordsE = `${M(cp)} per kg`;
        const sp = cp * 1000 / w; // cost of the weight given vs charge
        const profitPerKgClaimed = cp - cp * w / 1000;
        if (!C(profitPerKgClaimed)) return null;
        return mk(rng, M, profitPerKgClaimed, [
          [cp * (1000 - w) / w, "Used the weight given instead of 1000 g as the base"],
          [cp, "Gave the price of a claimed kilogram"],
          [cp * w / 1000, "Gave the true cost of the goods supplied"],
          [cp * (1000 - w) / 100, "Moved the decimal one place wrong"],
        ], finish(d, `${who} buys ${g} at ${wordsE} and sells at the same rate per kg, but his 1 kg weight is really only **${w} g**. How much does he gain on each "kilogram" he sells?`,
          [`For each "kg" he charges ${M(cp)} but supplies goods costing ${M(cp)} × ${w}/1000 = ${M(cp * w / 1000)}`, `Gain = ${M(cp)} − ${M(cp * w / 1000)} = **${M(profitPerKgClaimed)}**`],
          `Gain per claimed kg = price × (1000 − ${w})/1000 = ${cp} × ${(1000 - w) / 1000}.`,
          `He earns the full price for goods that cost less; the shortfall of ${1000 - w} g is the gain.`));
      }
      const w = T(rng, [800, 750, 900, 960, 500, 600, 840, 950, 625, 700, 850]), loss = T(rng, [10, 20, 25, 15, 5]);
      // honest in weights? Here: sells at cost but with loss? Use: dealer sells at p% discount and uses false weight
      const sellFactor = (1 - loss / 100) * 1000 / w - 1;
      const pct = sellFactor * 100;
      if (!C(pct) || pct <= 0) return null;
      return mk(rng, P, pct, [
        [(1000 - w) / w * 100 - loss, "Subtracted the discount from the weight gain directly"],
        [(1000 - w) / w * 100, "Ignored the discount completely"],
        [(1000 - w) / 10 - loss, "Used the shortfall as a percentage of 1000 g, then subtracted"],
        [loss, "Gave the discount itself"],
      ], finish(d, `${who} sells ${g} at a **${loss}% discount** on his cost price per kg, but uses a weight of **${w} g** for 1 kg. What is his overall gain percent?`,
        [`Let the cost of 1000 g = 100. He gives ${w} g, which costs ${R(100 * w / 1000)}`, `He receives ${100 - loss} for it`, `Gain % = (${100 - loss} − ${R(100 * w / 1000)})/${R(100 * w / 1000)} × 100 = **${P(R(pct))}**`],
        `Combine the two effects as factors: (1000/${w}) × ${R((100 - loss) / 100)} = ${R(1000 / w * (100 - loss) / 100)}, so gain = ${P(R(pct))}.`,
        `The gain from the weight and the discount do not subtract percentages; compare receipts to cost of goods actually given.`));
    }
    const k = rng.int(0, 1);
    if (k === 0) {
      const w = T(rng, [800, 900, 960, 500, 600, 750, 840, 625, 950]), p = T(rng, [10, 20, 25, 5, 15, 30, 40]);
      const pct = ((100 + p) * 1000 / w - 100);
      if (!C(pct)) return null;
      return mk(rng, P, pct, [
        [p + (1000 - w) / w * 100 - 0, "Added the stated profit to the weight gain without compounding them"].slice(0, 1).concat(["Added the two gains instead of multiplying"]) ,
        [(1000 - w) / w * 100, "Gave the weight gain only"],
        [p + (1000 - w) / 10, "Used the shortfall over 1000 g and added the profit"],
        [p, "Gave the stated profit only"],
      ], finish(d, `${who} claims to sell ${g} at a profit of **${p}%** on cost, but also uses a weight of **${w} g** instead of 1 kg. What is his real gain percent?`,
        [`Let the cost of 1000 g = 100. For ${w} g his cost is ${R(w / 10)}`, `He charges ${100 + p} (cost plus ${p}%)`, `Real gain % = (${100 + p} − ${R(w / 10)})/${R(w / 10)} × 100 = **${P(R(pct))}**`],
        `Real gain factor = (1 + ${p / 100}) × 1000/${w} = ${R((100 + p) * 10 / w)}, so ${P(R(pct))}.`,
        `The two gains compound; adding ${p}% to the weight gain of ${P(R((1000 - w) / w * 100))} is wrong.`));
    }
    const w = T(rng, [800, 900, 960, 500, 750, 600, 840, 625, 950]), amt = rng.int(2, 20) * 1000;
    const gainAmt = (1000 - w) / w * 100;
    if (!C(gainAmt)) return null;
    const buy = rng.int(8, 40) * 10, kg = rng.int(2, 15) * 10, cpTotal = buy * kg;
    // He sells kg "claimed" kilograms at cost price per kg; actual quantity given = kg*w/1000
    const sellRev = cpTotal, costGiven = cpTotal * w / 1000, prof = sellRev - costGiven;
    if (!C(prof)) return null;
    return mk(rng, M, prof, [
      [cpTotal * (1000 - w) / w / 1, "Computed the gain % on the claimed weight and applied it to the total"],
      [cpTotal, "Gave the total sale amount"],
      [costGiven, "Gave the true cost of the goods handed over"],
      [cpTotal * (1000 - w) / 1000 * 10, "Moved the decimal one place wrong"],
    ].filter((x) => x[0] !== prof), finish(d, `${who} sells **${kg} "kg"** of ${g} to customers at his cost of **${M(buy)} per kg**, using a false weight of **${w} g** for each kg. What is his total profit?`,
      [`Receipts = ${kg} × ${buy} = ${M(cpTotal)}`, `Goods actually given = ${kg} × ${w}/1000 kg, costing ${M(costGiven)}`, `Profit = ${M(cpTotal)} − ${M(costGiven)} = **${M(prof)}**`],
      `Profit = receipts × (1000 − ${w})/1000 = ${N(cpTotal)} × ${(1000 - w) / 1000}.`,
      `Compare the receipts with the cost of the goods he actually handed over.`));
  }) });

  /* ------------------------------------------------------------ 6. buy x get y free */
  QB.gen("quant/profit-loss/buy-x-get-y-free", { title: "Buy x get y free", gen: wrap((rng, d) => {
    const it = T(rng, ["notebooks", "pens", "soap bars", "juice cartons", "candles", "T-shirts", "batteries", "bottles of pickle", "packets of biscuits", "shampoo sachets"]);
    const who = T(rng, WHO);
    const PAIR = [[2, 1], [3, 1], [4, 1], [5, 1], [3, 2], [4, 2], [5, 2], [9, 1], [7, 1], [1, 1], [4, 3], [5, 3], [8, 2], [6, 2], [3, 3]];
    if (d === "Easy") {
      const [x, y] = T(rng, PAIR), disc = y / (x + y) * 100;
      if (!C(disc)) return null;
      return mk(rng, P, disc, [
        [y / x * 100, `Divided the free items by the paid items (${y}/${x}) instead of by all items received`],
        [y * 100 / (x + y) + 5, "Added a stray 5% to the correct value"],
        [x / (x + y) * 100, "Gave the share of paid items instead of free items"],
        [y * 10, "Treated the free count as tens of percent"],
      ], finish(d, `${who} sells ${it} at ${M(rng.int(2, 40) * 5)} each on an offer: **buy ${x}, get ${y} free**. What is the effective discount percent?`,
        [`The customer gets ${x + y} items but pays for ${x}`, `Discount = ${y}/${x + y} × 100 = **${P(R(disc))}**`],
        `Free ÷ total received: ${y}/${x + y}.`,
        `The base is all ${x + y} items received, not just the ${x} paid for. ${P(R(y / x * 100))} would be the extra items as a share of those paid.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      const [x, y] = T(rng, PAIR), price = rng.int(2, 30) * 10, sets = rng.int(2, 8), n = (x + y) * sets;
      const pay = x * sets * price;
      if (k === 0) return mk(rng, M, pay, [
        [n * price, "Paid for every item and ignored the free ones"],
        [(x + y) * sets * price - y * price, `Subtracted only a single set of free items`],
        [x * price, "Paid for one set only"],
        [(n - y) * price, "Subtracted just one batch of free items"],
      ].filter((w) => w[0] !== pay), finish(d, `${who} offers **buy ${x}, get ${y} free** on ${it} priced at **${M(price)} each**. What does a customer pay to take home **${n}** ${it}?`,
        [`Each deal gives ${x + y} items, so ${n} items = ${sets} deals`, `Paid items = ${sets} × ${x} = ${x * sets}`, `Cost = ${x * sets} × ${price} = **${M(pay)}**`],
        `Customer pays for ${x} out of every ${x + y}: ${R(x / (x + y) * 100)}% of ${M(n * price)}.`,
        `Count the full deals first (${n} ÷ ${x + y} = ${sets}); only ${x} per deal are paid for.`));
      const cpFrac = T(rng, [50, 60, 70, 75, 80]), mrp = price;
      const cpu = mrp * cpFrac / 100;
      // sells x+y items for x*mrp ; cost (x+y)*cpu
      const prof = (x * mrp - (x + y) * cpu) / ((x + y) * cpu) * 100;
      if (prof <= 0 || !C(prof) || !C(cpu)) return null;
      return mk(rng, P, prof, [
        [(mrp - cpu) / cpu * 100, "Ignored the free items"],
        [(x * mrp - (x + y) * cpu) / (x * mrp) * 100, "Divided by the money received instead of the cost"],
        [y / (x + y) * 100, "Gave the discount % instead of the profit %"],
        [(mrp - cpu) / cpu * 100 - y / (x + y) * 100, "Subtracted the discount % from the mark-up %"],
      ], finish(d, `${it[0].toUpperCase() + it.slice(1)} cost a trader **${M(cpu)}** each and are priced at **${M(mrp)}**. He announces **buy ${x}, get ${y} free**. Assuming everyone takes the offer, find his profit percent.`,
        [`For each deal: income = ${x} × ${mrp} = ${M(x * mrp)}`, `Cost of ${x + y} items = ${x + y} × ${cpu} = ${M((x + y) * cpu)}`, `Profit % = ${R(x * mrp - (x + y) * cpu)}/${R((x + y) * cpu)} × 100 = **${P(R(prof))}**`],
        `Per deal: received ${x} × ${mrp}, spent ${x + y} × ${cpu}. Compare them.`,
        `The free items are a cost to him, so include them in the cost price.`));
    }
    const [x, y] = T(rng, PAIR.filter((p) => p[1] < p[0] * 2)), extra = T(rng, [5, 10, 20, 25]);
    const k = rng.int(0, 1);
    if (k === 0) {
      const net = 100 - (100 - y / (x + y) * 100) * (100 - extra) / 100;
      if (!C(net)) return null;
      return mk(rng, P, net, [
        [y / (x + y) * 100 + extra, "Added the two discounts"],
        [y / (x + y) * 100, "Ignored the extra discount"],
        [y / x * 100 + extra - y / x * extra, "Used free ÷ paid as the first discount"],
        [extra, "Gave the extra discount only"],
      ], finish(d, `A store runs **buy ${x}, get ${y} free** and also gives a further **${extra}%** off the bill on top. What is the overall discount percent on the items received?`,
        [`First discount = ${y}/${x + y} = ${R(y / (x + y) * 100)}%, so items cost ${R(100 - y / (x + y) * 100)}% of the list value`, `After the further ${extra}%: ${R(100 - y / (x + y) * 100)} × ${R((100 - extra) / 100)} = ${R((100 - net))}`, `Overall discount = **${P(R(net))}**`],
        `Treat it as two successive discounts: ${R(y / (x + y) * 100)}% and ${extra}%.`,
        `The second discount acts on what remains after the free items, so the two cannot be added.`));
    }
    const price = rng.int(2, 20) * 10, sets = rng.int(1, 5), n = (x + y) * sets;
    const total = x * sets * price;
    const spent = rng.int(2, 6) * 100;
    const k2 = Math.floor(spent / (x * price));
    // how many items for a budget: budget = total
    return mk(rng, N, n, [
      [x * sets, "Counted only the paid items"],
      [total / price + y, "Added the free items only once"],
      [n + y, "Added one extra batch of free items"],
      [n - y, "Subtracted one batch of free items"],
    ], finish(d, `On a **buy ${x}, get ${y} free** offer, ${it} cost **${M(price)}** each. How many items can Dhruv take home for **${M(total)}**?`,
      [`Paid items = ${N(total)}/${price} = ${x * sets}`, `That is ${x * sets / x} deals, each giving ${y} free: ${x * sets / x} × ${y} = ${y * sets} free`, `Total = ${x * sets} + ${y * sets} = **${n}**`],
      `Paid ${x * sets} items = ${sets} deals of ${x}; every deal adds ${y} free.`,
      `The free items depend on the number of complete deals, not on the money left over.`));
  }) });

  /* ------------------------------------------------------------ 7. two items at the same SP */
  QB.gen("quant/profit-loss/two-items-at-the-same", { title: "Two items at the same SP (x% gain and x% loss)", gen: wrap((rng, d) => {
    const who = T(rng, WHO);
    const PAIRI = [["a radio", "a clock"], ["two bicycles", "two bicycles"], ["a fan", "a heater"], ["a mixer", "a toaster"], ["a lamp", "an iron"], ["two sofas", "two sofas"], ["a cow", "a buffalo"], ["a bag", "a pair of shoes"]];
    const [i1, i2] = T(rng, PAIRI);
    const what = i1 === i2 ? i1 : `${i1} and ${i2}`;
    if (d === "Easy") {
      const x = T(rng, [5, 10, 15, 20, 25, 30, 40, 50]), l = x * x / 100;
      return mk(rng, P, l, [
        [0.0001, "Said there is no overall loss"],
        [x, `Gave ${x}% itself as the overall loss`],
        [x / 2, "Halved the individual percentage"],
        [x * x / 10, "Moved the decimal one place wrong in x²/100"],
      ].filter((w) => w[0] > 0.001), finish(d, `${who} sells ${what} for ${M(rng.int(2, 60) * 100)} each, making a profit of **${x}%** on one and a loss of **${x}%** on the other. What is the overall loss percent?`,
        [`When two items sell at the same price with equal gain% and loss%, there is always a loss`, `Loss % = x²/100 = ${x}²/100 = **${P(R(l))}**`],
        `Loss % = (${x})²/100 = ${R(l)}%.`,
        `The gain and loss do not cancel: the loss is on the dearer item (bought for more), so the base differs.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      const x = T(rng, [10, 20, 25, 30, 40, 50, 5, 15]), sp = rng.int(5, 40) * 100;
      const cp1 = sp / (1 + x / 100), cp2 = sp / (1 - x / 100), loss = cp1 + cp2 - 2 * sp;
      if (!C(cp1) || !C(cp2)) return null;
      if (k === 0) return mk(rng, M, loss, [
        [2 * sp * x * x / 10000, "Applied x²/100 to the total selling price instead of the total cost"],
        [Math.abs(cp2 - cp1), "Took the difference of the two cost prices"],
        [sp * x / 100, `Took ${x}% of one selling price`],
        [cp1 + cp2, "Gave the total cost"],
      ], finish(d, `${who} sells ${what} at **${M(sp)}** each. One is sold at a gain of **${x}%** and the other at a loss of **${x}%**. Find the net loss in rupees.`,
        [`CP of first = ${M(sp)} × 100/${100 + x} = ${M(cp1)}`, `CP of second = ${M(sp)} × 100/${100 - x} = ${M(cp2)}`, `Total CP = ${M(cp1 + cp2)}, total SP = ${M(2 * sp)}; loss = **${M(loss)}**`],
        `Loss % = ${R(x * x / 100)}% of the total cost ${N(cp1 + cp2)}; or CP1 + CP2 − 2·SP.`,
        `The 2x²/100 loss is on the total COST (${M(cp1 + cp2)}), not the total selling price.`));
      return mk(rng, P, loss / (cp1 + cp2) * 100, [
        [x, `Gave ${x}% as the overall result`],
        [x / 2, "Halved the percentage"],
        [loss / (2 * sp) * 100, "Divided the loss by the total selling price"],
        [x * x / 10, "Moved the decimal one place wrong in x²/100"],
      ], finish(d, `Two ${i1 === i2 ? "items" : "articles"} are sold for **${M(sp)}** each, one at **${x}%** profit and the other at **${x}%** loss. Find the overall loss percent.`,
        [`CP1 = ${M(cp1)}, CP2 = ${M(cp2)}; total CP = ${M(cp1 + cp2)}`, `Total SP = ${M(2 * sp)}; loss = ${M(loss)}`, `Loss % = ${R(loss)}/${R(cp1 + cp2)} × 100 = **${P(R(loss / (cp1 + cp2) * 100))}**`],
        `Loss % = x²/100 = ${x}²/100.`,
        `Equal gain and loss at equal selling prices always produce a net loss.`));
    }
    const k = rng.int(0, 1);
    if (k === 0) {
      // different gain/loss at same SP
      const a = T(rng, [10, 20, 25, 30, 40, 50, 15, 5]), b = T(rng, [10, 20, 25, 30, 40, 15, 5, 12.5]), sp = rng.int(2, 40) * 120;
      const cp1 = sp / (1 + a / 100), cp2 = sp / (1 - b / 100), net = 2 * sp - cp1 - cp2, pct = net / (cp1 + cp2) * 100;
      if (!C(cp1) || !C(cp2) || !C(pct) || a === b) return null;
      const ans = Math.abs(pct), lbl = pct >= 0 ? "profit" : "loss";
      return mk(rng, P, ans, [
        [Math.abs(a - b), `Subtracted the two percentages (${a} − ${b})`],
        [Math.abs(a - b) / 2, "Averaged the two percentages"],
        [Math.abs(net) / (2 * sp) * 100, "Divided by the total selling price"],
        [Math.abs(pct) * 2, "Doubled the correct figure"],
      ], finish(d, `${who} sells ${what} for **${M(sp)}** each: one at a gain of **${P(a)}** and the other at a loss of **${P(b)}**. Find the overall ${lbl} percent.`,
        [`CP1 = ${M(sp)} × 100/${100 + a} = ${M(cp1)}; CP2 = ${M(sp)} × 100/${100 - b} = ${M(cp2)}`, `Total CP = ${M(cp1 + cp2)}; total SP = ${M(2 * sp)}`, `Net ${lbl} = ${M(Math.abs(net))}, so ${lbl} % = **${P(R(ans))}**`],
        `Same SP means CP1 : CP2 = ${100 - b} : ${100 + a}. Weight each percentage by its cost.`,
        `With different rates the overall % is a weighted figure, not the plain difference or average.`));
    }
    const x = T(rng, [10, 20, 25, 30, 40, 5]), loss = T(rng, [40, 60, 80, 90, 100, 150, 160, 200, 250]);
    // total loss given => x^2/100 % of total cost
    const cpTot = loss * 10000 / (x * x);
    if (!I(cpTot) || cpTot > 400000) return null;
    const sp = cpTot - loss;  // total SP
    if (!I(sp / 2)) return null;
    return mk(rng, M, cpTot, [
      [loss * 100 / x, `Used ${x}% instead of ${R(x * x / 100)}%`],
      [sp, "Gave the total selling price"],
      [loss * 100 / (x * x) , "Missed a factor of 100 when dividing by x²"],
      [cpTot / 2, "Gave the cost price of one item"],
    ], finish(d, `${who} sells ${what} at the same price, gaining **${x}%** on one and losing **${x}%** on the other. The net loss is **${M(loss)}**. What is the total cost of the two items?`,
      [`Overall loss % = ${x}²/100 = ${R(x * x / 100)}% of the total cost`, `Total CP = ${M(loss)} × 100/${R(x * x / 100)} = **${M(cpTot)}**`],
      `Total cost = loss ÷ (x²/10000) = ${loss} ÷ ${R(x * x / 10000)}.`,
      `The overall loss is ${R(x * x / 100)}%, not ${x}%, so do not divide by ${x}%.`));
  }) });

  /* ------------------------------------------------------------ 8. profit % on SP vs CP */
  QB.gen("quant/profit-loss/profit-pct-on-sp-vs", { title: "Profit % on SP vs CP", gen: wrap((rng, d) => {
    const who = T(rng, WHO), it = T(rng, ITEMS);
    if (d === "Easy") {
      const p = T(rng, [10, 20, 25, 30, 40, 50, 60, 75, 80]), onCP = 100 * p / (100 - p);
      const k = rng.chance(0.5);
      if (k) {
        if (!C(onCP)) return null;
        return mk(rng, P, onCP, [
          [p, "Assumed the percentage on SP equals the percentage on CP"],
          [100 * p / (100 + p), "Used the formula the wrong way round (p/(100+p))"],
          [100 - p, "Took the cost as the complement of the profit %"],
          [p * 2, "Doubled the percentage"],
        ], finish(d, `${who} makes a profit equal to **${p}%** of the selling price of ${it}. What is the profit percent on the cost price?`,
          [`Let SP = 100, profit = ${p}, so CP = ${100 - p}`, `Profit on CP = ${p}/${100 - p} × 100 = **${P(R(onCP))}**`],
          `Profit % on CP = p/(100 − p) × 100 when p is on SP.`,
          `Same profit, smaller base (CP is less than SP), so the percentage on CP is bigger.`));
      }
      const q = T(rng, [10, 20, 25, 40, 50, 100, 150, 25, 60]), onSP = 100 * q / (100 + q);
      if (!C(onSP)) return null;
      return mk(rng, P, onSP, [
        [q, "Assumed the percentage on CP equals the percentage on SP"],
        [100 * q / (100 - q), "Used the formula the wrong way round (q/(100−q))"],
        [100 - q, "Took the SP-based profit as 100 minus the percentage"],
        [q / 2, "Halved the percentage"],
      ].filter((w) => w[0] > 0), finish(d, `${who} sells ${it} at a profit of **${q}%** on the cost price. What is the profit as a percent of the selling price?`,
        [`Let CP = 100, SP = ${100 + q}, profit = ${q}`, `Profit on SP = ${q}/${100 + q} × 100 = **${P(R(onSP))}**`],
        `Profit % on SP = q/(100 + q) × 100.`,
        `Same profit, bigger base (SP is more than CP), so the percentage on SP is smaller.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      const p = T(rng, [10, 20, 25, 30, 40, 50, 60, 75]), sp = rng.int(2, 60) * 100;
      const cp = sp * (100 - p) / 100;
      if (k === 0) {
        if (!C(cp)) return null;
        return mk(rng, M, cp, [
          [sp / (1 + p / 100), `Treated the ${p}% as profit on CP`],
          [sp * (1 + p / 100), "Added the percentage to the SP"],
          [sp * p / 100, "Gave the profit instead of the cost"],
          [sp - p, `Subtracted ${p} rupees instead of ${p}%`],
        ], finish(d, `${who} sells ${it} for **${M(sp)}** and his profit is **${p}% of the selling price**. What did the item cost him?`,
          [`Profit = ${p}% of SP = ${M(sp * p / 100)}`, `CP = SP − profit = ${M(sp)} − ${M(sp * p / 100)} = **${M(cp)}**`],
          `CP is ${100 - p}% of SP: ${N(sp)} × ${R((100 - p) / 100)}.`,
          `If profit is quoted on SP, CP = SP × (1 − p/100); dividing SP by (1 + p/100) would assume profit on cost.`));
      }
      const q = T(rng, [20, 25, 40, 50, 60, 100, 12.5]), cp2 = rng.int(2, 60) * 100;
      const spp = cp2 * (1 + q / 100), pr = spp - cp2, onSP = pr / spp * 100;
      if (!C(spp) || !C(onSP)) return null;
      return mk(rng, P, onSP, [
        [q, "Assumed both bases give the same percentage"],
        [pr / cp2 * 100 / 2, "Halved the percentage on cost"],
        [100 * q / (100 - q), "Used q/(100−q) instead of q/(100+q)"],
        [100 - onSP, "Gave the cost as a percentage of the selling price"],
      ].filter((w) => w[0] > 0 && w[0] !== onSP), finish(d, `${it[0].toUpperCase() + it.slice(1)} costing **${M(cp2)}** is sold for **${M(spp)}**. What is the profit as a percent of the selling price?`,
        [`Profit = ${M(spp)} − ${M(cp2)} = ${M(pr)}`, `Profit % on SP = ${R(pr)}/${R(spp)} × 100 = **${P(R(onSP))}**`],
        `Profit/SP = ${QB.frac(Math.round(pr), Math.round(spp))} = ${P(R(onSP))}.`,
        `Be sure to divide by the selling price here, not the cost price.`));
    }
    const k = rng.int(0, 1);
    if (k === 0) {
      const p = T(rng, [20, 25, 30, 40, 50, 60, 75, 12.5, 37.5]), mark = T(rng, [10, 20, 25, 30, 40, 50]), cp = rng.int(2, 40) * 100;
      const sp = cp * 100 / (100 - p);
      if (!C(sp)) return null;
      const mp = sp * (100 + mark) / 100;
      if (!C(mp)) return null;
      return mk(rng, M, mp, [
        [cp * (1 + p / 100) * (1 + mark / 100), `Treated the ${p}% as profit on CP`],
        [sp, "Gave the selling price instead of the marked price"],
        [cp * (1 + mark / 100), "Applied the mark-up straight to the cost"],
        [cp + sp * mark / 100, "Added the mark-up on SP to the cost"],
      ], finish(d, `${who} sells ${it} at a profit of **${P(p)} of the selling price**. The item cost **${M(cp)}**, and the price tag shows **${mark}% more** than the selling price. Find the marked price.`,
        [`CP = ${100 - p}% of SP, so SP = ${M(cp)} × 100/${R(100 - p)} = ${M(sp)}`, `Marked price = ${M(sp)} × ${100 + mark}/100 = **${M(mp)}**`],
        `SP = CP ÷ ${R((100 - p) / 100)}; then multiply by ${R(1 + mark / 100)}.`,
        `Profit on SP means CP = SP × (1 − p/100). The ${mark}% is also on the selling price.`));
    }
    const q = T(rng, [20, 25, 40, 50, 60, 75, 100, 12.5]), onSPp = 100 * q / (100 + q);
    const pr = rng.int(2, 40) * 50, sp = pr * 100 / onSPp;
    if (!C(onSPp) || !I(sp)) return null;
    const cp = sp - pr;
    return mk(rng, M, cp, [
      [pr * 100 / q, `Treated ${P(R(onSPp))} as the profit on cost`],
      [sp, "Gave the selling price"],
      [pr, "Gave the profit amount"],
      [sp + pr, "Added the profit to the selling price"],
    ], finish(d, `${who} earns a profit of **${M(pr)}** on ${it}, which is **${P(R(onSPp))} of the selling price**. What is the cost price?`,
      [`SP = ${M(pr)} × 100/${R(onSPp)} = ${M(sp)}`, `CP = SP − profit = ${M(sp)} − ${M(pr)} = **${M(cp)}**`],
      `Find SP first (profit ÷ ${R(onSPp / 100)}), then subtract the profit.`,
      `The percentage is on SP, so profit ÷ percentage gives SP, not CP.`));
  }) });

  /* ------------------------------------------------------------ 9. CP from two selling scenarios */
  QB.gen("quant/profit-loss/finding-cp-from-two-selling", { title: "Finding CP from two selling scenarios", gen: wrap((rng, d) => {
    const who = T(rng, WHO), it = T(rng, ITEMS);
    if (d === "Easy") {
      const l = T(rng, [5, 10, 15, 20, 25, 8, 12]), g = T(rng, [5, 10, 15, 20, 25, 12, 8]), cp = rng.int(4, 40) * 100;
      const s1 = cp * (1 - l / 100), s2 = cp * (1 + g / 100);
      if (!I(s1) || !I(s2)) return null;
      return mk(rng, M, cp, [
        [(s2 - s1) * 100 / Math.abs(g - l) || null, `Subtracted the percentages (${g} − ${l}) instead of adding`],
        [s1 + s2, "Added the two selling prices"],
        [(s2 - s1), "Gave the difference of the selling prices"],
        [(s2 + s1) / 2 * 1.1, "Averaged the two selling prices and added 10%"],
      ].filter((w) => w[0]), finish(d, `${who} would lose **${P(l)}** if ${it} is sold for **${M(s1)}**, but gain **${P(g)}** if sold for **${M(s2)}**. Find the cost price.`,
        [`Difference in SP = ${M(s2)} − ${M(s1)} = ${M(s2 - s1)}`, `This equals (${l} + ${g})% = ${R(l + g)}% of CP`, `CP = ${s2 - s1} × 100/${R(l + g)} = **${M(cp)}**`],
        `CP = difference of SPs ÷ (loss% + gain%) × 100.`,
        `One scenario is below cost and the other above it, so the two percentages add up to the gap.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      if (k === 0) {
        const a = T(rng, [5, 10, 15, 20, 25, 30]), b = T(rng, [5, 10, 15, 20, 25, 30, 40]), diff = rng.int(2, 40) * 10;
        if (a >= b) return null;
        const cp = diff * 100 / (b - a);
        if (!I(cp)) return null;
        return mk(rng, M, cp, [
          [diff * 100 / (a + b), "Added the two profit percentages instead of subtracting"],
          [diff * 100 / b, "Used only the bigger profit percentage"],
          [diff * 100 / a, "Used only the smaller profit percentage"],
          [cp * (1 + b / 100), "Gave the higher selling price"],
        ], finish(d, `${who} sells ${it} at a profit of **${a}%**. Had he sold it for **${M(diff)} more**, the profit would have been **${b}%**. Find the cost price.`,
          [`The extra ${M(diff)} is the extra profit = (${b} − ${a})% of CP = ${b - a}% of CP`, `CP = ${diff} × 100/${b - a} = **${M(cp)}**`],
          `CP = extra money ÷ difference of the percentages × 100.`,
          `Both are profits on the same cost, so the percentages subtract (gap ${b - a}%).`));
      }
      const l = T(rng, [10, 15, 20, 25, 5, 12]), g = T(rng, [10, 15, 20, 25, 30, 8]), cp = rng.int(4, 40) * 100;
      const s1 = cp * (1 - l / 100), s2 = cp * (1 + g / 100), want = T(rng, [10, 20, 25, 30, 40]);
      if (!I(s1) || !I(s2)) return null;
      const ans = cp * (1 + want / 100);
      return mk(rng, M, ans, [
        [(s1 + s2) / 2, "Averaged the two selling prices"],
        [s2 * (1 + want / 100), "Applied the profit to the higher selling price"],
        [cp, "Gave the cost price"],
        [cp * (1 + (want + g) / 100), "Added the earlier gain % to the target"],
      ], finish(d, `By selling ${it} for **${M(s1)}** ${who.toLowerCase().startsWith("a ") || who === "Ramesh" ? "he" : "the seller"} suffers a loss of **${P(l)}**; selling for **${M(s2)}** would give a gain of **${P(g)}**. At what price must it be sold to gain **${want}%**?`,
        [`Gap in SP = ${M(s2 - s1)} = ${R(l + g)}% of CP, so CP = ${M(cp)}`, `Required SP = ${M(cp)} × ${100 + want}/100 = **${M(ans)}**`],
        `Find CP from the gap (${s2 - s1} ÷ ${R((l + g) / 100)}), then add ${want}%.`,
        `Each percentage is measured on the same cost price; find it before applying the target.`));
    }
    const k = rng.int(0, 1);
    if (k === 0) {
      const l = T(rng, [4, 5, 8, 10, 12, 15, 20]), g = T(rng, [6, 8, 10, 12, 15, 20, 25]), cp = rng.int(5, 50) * 100;
      const s1 = cp * (1 - l / 100), s2 = cp * (1 + g / 100);
      if (!I(s1) || !I(s2)) return null;
      const qty = T(rng, [2, 3, 4, 5, 6, 10]);
      const ans = (s2 - s1) * qty;
      return mk(rng, M, ans, [
        [s2 - s1, "Gave the gap for one item only"],
        [(s2 + s1) * qty, "Added the two selling prices for the lot"],
        [cp * qty, "Gave the total cost"],
        [(s2 - s1) * qty / 2, "Halved the answer"],
      ], finish(d, `${who} buys **${qty}** identical units of ${it}. Selling each at **${M(s1)}** gives a loss of **${P(l)}**, while selling each at **${M(s2)}** gives a profit of **${P(g)}**. How much more does he collect on the whole lot at the higher price?`,
        [`Gap for one = ${M(s2)} − ${M(s1)} = ${M(s2 - s1)}`, `For ${qty} items: ${qty} × ${s2 - s1} = **${M(ans)}**`],
        `Gap per item × quantity. (Check: gap = ${R(l + g)}% of CP = ${R((l + g) / 100 * cp)}.)`,
        `Compare the two selling prices; the cost price cancels out when the question only asks for the extra collected.`));
    }
    const p1 = T(rng, [5, 10, 15, 20, 25]), s = rng.int(3, 30) * 100, cp = s * 100 / (100 + p1);
    if (!C(cp) || !I(cp)) return null;
    const l = T(rng, [5, 10, 15, 20]), s2 = cp * (1 - l / 100);
    if (!C(s2)) return null;
    return mk(rng, M, s - s2, [
      [cp * l / 100, `Gave only the ${l}% loss amount`],
      [s - cp, "Gave the profit at the higher price"],
      [s * l / 100, `Took ${l}% of the higher selling price`],
      [s + s2, "Added the two selling prices"],
    ], finish(d, `${who} sells ${it} for **${M(s)}** and makes a profit of **${p1}%**. At what amount less would he have sold it to take a loss of **${l}%** instead?`,
      [`CP = ${M(s)} × 100/${100 + p1} = ${M(cp)}`, `Loss-making SP = ${M(cp)} × ${100 - l}/100 = ${M(s2)}`, `Difference = ${M(s)} − ${M(s2)} = **${M(s - s2)}**`],
      `Gap = (${p1} + ${l})% of CP = ${R(p1 + l)}% of ${N(cp)}.`,
      `The profit % is on cost, so first recover the cost from ${M(s)} by dividing by ${R(1 + p1 / 100)}.`));
  }) });
})();
