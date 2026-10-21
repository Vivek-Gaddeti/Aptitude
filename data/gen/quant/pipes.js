/* =====================================================================
   Pipes & cisterns: five question generators (one per catalog pattern).
   Easy / Medium / Hard all supported; every wrong option is a real mistake.
   ===================================================================== */
(function () {
  const N = (x) => QB.num(x), R = (x) => QB.round(x, 2);
  const C = (x) => isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const I = Number.isInteger;
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 40, Medium: 70, Hard: 100 };
  const lcm3 = (a, b, c) => QB.lcm(QB.lcm(a, b), c || 1);

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("pipes: no clean question found");
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
      if (!isFinite(v) || v <= 0) continue;
      const t = f(R(v));
      const dm = /\d+\.(\d+)/.exec(t), tol = 0.5 * Math.pow(10, -(dm ? dm[1].length : 0));
      if (Math.abs(v - ans) <= tol + 1e-9) continue;   // would also pass as the right answer once rounded
      if (seen.has(t.toLowerCase()) || /NaN|undefined|Infinity/.test(t)) continue;
      seen.add(t.toLowerCase());
      pairs.push([t, w[1]]);
    }
    if (pairs.length < 4) return null;
    const o = QB.options(rng, pairs);
    return Object.assign({ time: TIME[extra.d] }, extra, o, { calc: String(R(ans)) });
  }
  const finish = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });

  // context pieces
  const TANK = ["tank", "cistern", "reservoir", "water tank", "storage tank", "swimming pool", "overhead tank"];
  const WHO = ["A factory", "A housing society", "A hostel", "A farm", "A textile mill", "A school", "A dairy plant", "A village panchayat"];
  const UNIT = (rng) => (rng.chance(0.5) ? ["hours", "hours"] : ["minutes", "minutes"]);
  const uf = (u) => (x) => N(x) + " " + u;
  const PN = [["A", "B", "C"], ["P", "Q", "R"], ["X", "Y", "Z"], ["inlet 1", "inlet 2", "the outlet"]];

  /* ---------------------------------------------------------------- 1. fill / empty together */
  const TIMES = [6, 8, 10, 12, 15, 20, 24, 30, 36, 40, 45, 60];
  QB.gen("quant/pipes/fill-empty-together", { title: "Fill / empty together", gen: wrap((rng, d) => {
    const u = UNIT(rng)[0], f = uf(u), tk = T(rng, TANK), who = T(rng, WHO), [pa, pb, pc] = T(rng, PN.slice(0, 3));
    if (d === "Easy") {
      const a = rng.int(2, 30), b = rng.int(2, 30);
      if (rng.chance(0.55)) {
        if (a === b && rng.chance(0.5)) return null;
        const ans = a * b / (a + b);
        return mk(rng, f, ans, [
          [a + b, "Added the two times instead of adding the rates"],
          [(a + b) / 2, "Took the average of the two times"],
          [Math.abs(a - b), "Subtracted the times"],
          [a * b / Math.abs(a - b), "Treated one pipe as emptying"],
        ], finish(d, `${who} has a ${tk} with two inlet pipes. Pipe ${pa} alone can fill it in **${N(a)} ${u}** and pipe ${pb} alone in **${N(b)} ${u}**. If both are opened together, in how much time is the empty ${tk} full?`,
          [`Rate of ${pa} = 1/${a}, rate of ${pb} = 1/${b} of the ${tk} per ${u.slice(0, -1)}`, `Together = 1/${a} + 1/${b} = ${a + b}/${a * b}`, `Time = ${a * b}/${a + b} = **${f(R(ans))}**`],
          `Product over sum: ${a} × ${b} ÷ (${a} + ${b}) = ${f(R(ans))}.`,
          `Pipes work together, so add the RATES (1/${a} + 1/${b}), never the times.`));
      }
      const x = Math.min(a, b), y = Math.max(a, b);
      if (x === y) return null;
      const ans = x * y / (y - x);
      return mk(rng, f, ans, [
        [x * y / (x + y), `Treated both pipes as filling, so ${pa} and ${pb} both add water`],
        [y - x, "Subtracted the times instead of the rates"],
        [x + y, "Added the two times"],
        [(x + y) / 2, "Averaged the two times"],
      ], finish(d, `A ${tk} is empty. Pipe ${pa} fills it in **${N(x)} ${u}**, while outlet pipe ${pb} can empty a full ${tk} in **${N(y)} ${u}**. If both are opened together, how long will it take to fill the ${tk}?`,
        [`Net rate = 1/${x} − 1/${y} = ${y - x}/${x * y} per ${u.slice(0, -1)}`, `Time = ${x * y}/${y - x} = **${f(R(ans))}**`],
        `Product over difference: ${x} × ${y} ÷ (${y} − ${x}) = ${f(R(ans))}.`,
        `The emptying pipe subtracts its rate; since it is slower (${y} > ${x}) the tank still fills.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      if (k === 0) {                       // two fill, one empties
        const a = T(rng, TIMES), b = T(rng, TIMES), c = T(rng, TIMES);
        const net = 1 / a + 1 / b - 1 / c;
        if (net <= 1e-9 || a === b) return null;
        const ans = 1 / net;
        return mk(rng, f, ans, [
          [1 / (1 / a + 1 / b + 1 / c), "Added the outlet's rate as well, as if it were an inlet"],
          [a * b / (a + b), "Ignored the outlet pipe"],
          [(a + b - c) > 0 ? a + b - c : 0, "Added and subtracted the times directly"],
          [1 / (1 / a - 1 / c + 0) > 0 ? 1 / (1 / a - 1 / c) : 0, "Left out the second inlet"],
        ], finish(d, `A ${tk} has two inlets ${pa} and ${pb} that fill it in **${a}** and **${b} ${u}** respectively, and an outlet ${pc} that empties it in **${c} ${u}**. If all three are opened together on an empty ${tk}, how long will it take to fill it?`,
          [`Net rate = 1/${a} + 1/${b} − 1/${c}`, `= ${N(R(net * lcm3(a, b, c)))}/${lcm3(a, b, c)} = ${N(R(net))} per ${u.slice(0, -1)} (approx)`, `Time = **${f(R(ans))}**`],
          `Use the LCM ${lcm3(a, b, c)} as the tank volume: inlets give ${lcm3(a, b, c) / a} and ${lcm3(a, b, c) / b}, outlet takes ${lcm3(a, b, c) / c} per ${u.slice(0, -1)}.`,
          `Inlets add, outlets subtract. Check the net rate is positive before dividing.`));
      }
      if (k === 1) {                       // given A and together, find B
        const a = T(rng, TIMES), b = T(rng, TIMES);
        if (a === b) return null;
        const tog = a * b / (a + b);
        return mk(rng, f, b, [
          [tog - a > 0 ? tog - a : 0, "Subtracted the times instead of the rates"],
          [a + tog, "Added the times"],
          [a * tog / (a + tog), "Combined the two times as if both were filling"],
          [a * tog / Math.abs(a - tog), "Used the formula with the sign of the rate reversed"],
        ], finish(d, `Pipe ${pa} can fill a ${tk} in **${a} ${u}**. Pipes ${pa} and ${pb} together fill it in **${N(R(tog))} ${u}**. How long would ${pb} alone take to fill the ${tk}?`,
          [`Rate of ${pb} = 1/${N(R(tog))} − 1/${a}`, `= ${N(R(1 / tog - 1 / a))} per ${u.slice(0, -1)} (approx)`, `Time for ${pb} = **${f(b)}**`],
          `1/B = 1/T − 1/A, so B = A × T ÷ (A − T) = ${a} × ${N(R(tog))} ÷ ${N(R(a - tog))} = ${f(b)}.`,
          `Subtract RATES (1/T − 1/A), not times.`));
      }
      const a = T(rng, TIMES), c = T(rng, TIMES);
      if (c >= a) return null;                // pipe fills slower than the outlet empties it: pick ordering for a clean question
      const net = 1 / c - 1 / a, ans = 1 / net;
      return mk(rng, f, ans, [
        [a * c / (a + c), "Added the rates, forgetting the second pipe empties"],
        [a - c, "Subtracted the times"],
        [a + c, "Added the times"],
        [(a + c) / 2, "Averaged the times"],
      ], finish(d, `${who} runs a ${tk} with inlet ${pa} (fills it in **${a} ${u}**) and outlet ${pb} (empties a full ${tk} in **${c} ${u}**). If the ${tk} is full and both pipes are open, in how long will it be completely empty?`,
        [`Net emptying rate = 1/${c} − 1/${a} = ${a - c}/${a * c}`, `Time = ${a * c}/${a - c} = **${f(R(ans))}**`],
        `Product over difference: ${a} × ${c} ÷ (${a} − ${c}) = ${f(R(ans))}.`,
        `The faster pipe decides the direction: here the outlet (${c} ${u}) beats the inlet (${a} ${u}), so the ${tk} empties.`));
    }
    // Hard: pair times for three pipes, or 4-pipe mixes
    if (rng.chance(0.6)) {
      const x = T(rng, TIMES), y = T(rng, TIMES), z = T(rng, TIMES);
      const s = 1 / x + 1 / y + 1 / z, ans = 2 / s;
      if (x === y || y === z || x === z) return null;
      return mk(rng, f, ans, [
        [1 / s, "Forgot that every pipe appears in two pairs, so the sum of pair rates is double"],
        [(x + y + z) / 3, "Averaged the three times"],
        [x * y * z / (x * y + y * z + z * x), "Used 1/x + 1/y + 1/z as the rate of all three together"],
        [(x + y + z) / 2, "Halved the sum of the times"],
      ], finish(d, `Three pipes ${pa}, ${pb} and ${pc} are fitted to a ${tk}. ${pa} and ${pb} together fill it in **${x} ${u}**, ${pb} and ${pc} together in **${y} ${u}**, and ${pc} and ${pa} together in **${z} ${u}**. How long will all three take together?`,
        [`(A+B) + (B+C) + (C+A) = 2(A+B+C)`, `2(A+B+C) = 1/${x} + 1/${y} + 1/${z} = ${N(R(s))} (approx)`, `A+B+C = ${N(R(s / 2))} per ${u.slice(0, -1)}, so time = **${f(R(ans))}**`],
        `Add the three pair rates and halve: time = 2 ÷ (1/${x} + 1/${y} + 1/${z}) = ${f(R(ans))}.`,
        `Each pipe is counted twice in the three pairs, so halve the total before taking the reciprocal.`));
    }
    const a = T(rng, TIMES), b = T(rng, TIMES), c = T(rng, TIMES), e = T(rng, TIMES);
    const net = 1 / a + 1 / b - 1 / c - 1 / e;
    if (net <= 1e-9 || a === b || c === e) return null;
    const ans = 1 / net;
    return mk(rng, f, ans, [
      [1 / (1 / a + 1 / b - 1 / c), "Counted only one of the two outlets"],
      [1 / (1 / a + 1 / b + 1 / c + 1 / e), "Added all four rates, treating outlets as inlets"],
      [a * b / (a + b), "Ignored both outlets"],
      [1 / (1 / c + 1 / e - 1 / a - 1 / b > 0 ? 1 / c + 1 / e - 1 / a - 1 / b : 1), "Subtracted the inlet rates from the outlet rates"],
    ], finish(d, `A ${tk} has two inlets that fill it in **${a}** and **${b} ${u}**, and two outlets that empty it in **${c}** and **${e} ${u}**. With all four open, in how long is the empty ${tk} filled?`,
      [`Net rate = 1/${a} + 1/${b} − 1/${c} − 1/${e}`, `= ${N(R(net))} per ${u.slice(0, -1)} (approx)`, `Time = 1 ÷ net rate = **${f(R(ans))}**`],
      `Take LCM ${lcm3(lcm3(a, b), lcm3(c, e))} as the volume, add the inlet shares and subtract the outlet shares, then divide.`,
      `Four rates, two signs: write them down with + and − before combining.`));
  }) });

  /* ---------------------------------------------------------------- 2. a leak */
  QB.gen("quant/pipes/a-leak", { title: "A leak", gen: wrap((rng, d) => {
    const u = UNIT(rng)[0], f = uf(u), tk = T(rng, TANK), who = T(rng, WHO), s = u.slice(0, -1);
    if (d === "Easy") {
      const a = rng.int(2, 20), b = a + rng.int(1, 12);
      const ans = a * b / (b - a);
      if (!I(ans) && rng.chance(0.9)) return null;
      return mk(rng, f, ans, [
        [b - a, "Subtracted the two filling times"],
        [a + b, "Added the two filling times"],
        [(a + b) / 2, "Averaged the two times"],
        [a * b / (a + b), "Added the rates instead of subtracting the leak"],
      ], finish(d, `A pipe fills a ${tk} in **${a} ${u}**. Because of a leak at the bottom it takes **${b} ${u}** to fill it. If the ${tk} is full, in how long will the leak alone empty it?`,
        [`Leak rate = 1/${a} − 1/${b} = ${b - a}/${a * b}`, `Time to empty = ${a * b}/${b - a} = **${f(R(ans))}**`],
        `Product over difference: ${a} × ${b} ÷ (${b} − ${a}) = ${f(R(ans))}.`,
        `The ${b - a} ${u} of delay is not the leak's emptying time; work with rates.`));
    }
    if (d === "Medium") {
      const a = rng.int(2, 24), c = a + rng.int(1, 30);
      const ans = a * c / (c - a);
      if (!C(ans)) return null;
      return mk(rng, f, ans, [
        [a * c / (a + c), "Added the leak's rate to the pipe's rate"],
        [c - a, "Subtracted the times"],
        [a + c, "Added the times"],
        [(a + c) / 2, "Averaged the two times"],
      ], finish(d, `${who} fills its ${tk} through a pipe in **${a} ${u}**, but a leak can empty the full ${tk} in **${c} ${u}**. If the pipe is opened with the leak present, how long will the empty ${tk} take to fill?`,
        [`Net rate = 1/${a} − 1/${c} = ${c - a}/${a * c}`, `Time = ${a * c}/${c - a} = **${f(R(ans))}**`],
        `Product over difference: ${a} × ${c} ÷ (${c} − ${a}) = ${f(R(ans))}.`,
        `The leak works against the pipe: subtract its rate. Adding it would make the ${tk} fill faster than the pipe alone.`));
    }
    const k = rng.int(0, 2);
    if (k === 0) {                         // litres per hour of leak
      const a = T(rng, [4, 5, 6, 8, 10, 12, 15]), b = a + T(rng, [1, 2, 3, 4, 5, 6]), cap = rng.int(2, 40) * 60;
      const leak = cap * (b - a) / (a * b);
      return mk(rng, (x) => N(x) + " L per " + s, leak, [
        [cap / b, "Took the filling rate with the leak as the leak rate"],
        [cap / a - cap / b + cap / a, "Added the pipe's rate on top of the difference"],
        [cap / (b - a), "Divided by the delay instead of using rates"],
        [cap / a, "Used the pipe's own rate as the leak rate"],
      ], finish(d, `A ${tk} of **${N(cap)} litres** is filled by an inlet in **${a} ${u}**. Because of a leak it takes **${b} ${u}**. At what rate (litres per ${s}) does the leak lose water?`,
        [`Inlet rate = ${N(cap)}/${a} = ${N(R(cap / a))} L per ${s}`, `Net rate with leak = ${N(cap)}/${b} = ${N(R(cap / b))} L per ${s}`, `Leak = ${N(R(cap / a))} − ${N(R(cap / b))} = **${N(R(leak))} L per ${s}**`],
        `Leak = capacity × (b − a) ÷ (a × b) = ${N(cap)} × ${b - a} ÷ ${a * b} = ${N(R(leak))}.`,
        `The leak rate is the DIFFERENCE of the two filling rates, not of the two times.`));
    }
    if (k === 1) {                         // extra time, find time to empty
      const a = rng.int(3, 20), e = rng.int(1, 8), b = a + e;
      const ans = a * b / e;
      if (!I(ans) && !C(ans)) return null;
      return mk(rng, f, ans, [
        [e, "Took the delay itself as the emptying time"],
        [a * b / (a + b), "Added the rates instead of subtracting"],
        [a * e, "Multiplied the filling time by the delay"],
        [b * e, "Multiplied the slower time by the delay"],
      ], finish(d, `An inlet pipe fills a ${tk} in **${a} ${u}**. When a leak develops, it takes **${e} ${u} longer**. How long would the leak take to empty the full ${tk} on its own?`,
        [`Filling time with leak = ${a} + ${e} = ${b} ${u}`, `Leak rate = 1/${a} − 1/${b} = ${e}/${a * b}`, `Time = ${a * b}/${e} = **${f(R(ans))}**`],
        `Leak time = a × (a + e) ÷ e = ${a} × ${b} ÷ ${e} = ${f(R(ans))}.`,
        `"${e} ${u} longer" means the new time is ${b} ${u}, not ${e} ${u}.`));
    }
    // fraction left after leak: pipe fills, then leak runs; portion of tank full
    const a = T(rng, [4, 6, 8, 10, 12, 15, 20]), c = T(rng, [6, 8, 10, 12, 15, 20, 24, 30, 40]), t = rng.int(1, 4) * 2;
    if (c <= a) return null;
    const frac = t * (1 / a - 1 / c), ans = 100 * frac;
    if (frac >= 1 || frac <= 0) return null;
    return mk(rng, (x) => N(x) + "%", ans, [
      [100 * t / a, "Ignored the leak"],
      [100 * (t / a + t / c), "Added the leak's share instead of subtracting"],
      [100 * (1 / a - 1 / c), "Found the net rate for one " + s + " only"],
      [100 * t * (c - a) / (a + c) / 1, "Used the difference of times instead of rates"],
    ], finish(d, `A ${tk} has an inlet that fills it in **${a} ${u}** and a leak that empties a full ${tk} in **${c} ${u}**. If both work together for **${t} ${u}** starting with an empty ${tk}, what percentage of the ${tk} is full?`,
      [`Net rate = 1/${a} − 1/${c} = ${N(R(1 / a - 1 / c))} per ${s} (approx)`, `In ${t} ${u}: ${t} × ${N(R(1 / a - 1 / c))} = ${N(R(frac))}`, `Percentage = **${N(R(ans))}%**`],
      `Compute the net fraction per ${s}, multiply by ${t}, then convert to a percentage.`,
      `Both pipes run for the whole ${t} ${u}; subtract the leak's share from the inlet's share.`));
  }) });

  /* ---------------------------------------------------------------- 3. alternate opening */
  // simulate pipes opened one after another, each for 1 slot (rates as integers per slot, tank = cap)
  function simulate(rates, cap) {
    let level = 0, t = 0;
    for (let i = 0; i < 20000; i++) {
      const r = rates[i % rates.length];
      if (r > 0 && level + r >= cap) return t + (cap - level) / r;
      level += r; t += 1;
      if (level < 0) level = 0;
    }
    return NaN;
  }
  QB.gen("quant/pipes/alternate-opening", { title: "Alternate opening", gen: wrap((rng, d) => {
    const tk = T(rng, TANK), who = T(rng, WHO), [pa, pb, pc] = T(rng, PN.slice(0, 3));
    if (d !== "Hard") {
      const u = UNIT(rng)[0], f = uf(u), s = u.slice(0, -1);
      const a = d === "Easy" ? T(rng, [6, 8, 10, 12, 15, 20, 24, 30]) : rng.int(6, 40), b = d === "Easy" ? T(rng, [6, 8, 10, 12, 15, 20, 24, 30]) : rng.int(6, 40);
      if (a === b) return null;
      const cap = QB.lcm(a, b), ra = cap / a, rb = cap / b;
      const ans = simulate([ra, rb], cap);
      if (!isFinite(ans) || !C(ans) || (d === "Easy" && !I(ans)) || ans > 80) return null;
      const naive = a * b / (a + b);
      const cyc = (ra + rb);
      return mk(rng, f, ans, [
        [naive, "Treated the pipes as opened together"],
        [cap / cyc, "Counted the number of cycles but forgot each cycle lasts 2 " + u],
        [ans + 1, "Added a spare " + s + " by rounding the last cycle up"],
        [ans - 1 > 0 ? ans - 1 : ans + 2, "Stopped one " + s + " too early in the last cycle"],
        [(a + b), "Added the two filling times"],
      ], finish(d, `${who} fills a ${tk} using pipes ${pa} and ${pb}, which alone take **${a}** and **${b} ${u}**. They are opened **alternately for 1 ${s} each**, ${pa} first. How long does it take to fill the empty ${tk}?`,
        [`Take the ${tk} as ${cap} units: ${pa} adds ${ra}, ${pb} adds ${rb} per ${s}`, `One 2-${s} cycle adds ${ra + rb} units`, `Run the cycles until ${cap} is reached: total time **${f(R(ans))}**`],
        `Find the volume added in one cycle, count full cycles, then see how much of the next cycle is needed.`,
        `Alternate opening is not the same as opening together: each pipe works only half of the time.`));
    }
    // Hard: three pipes alternately, litres, one drains
    const n = rng.int(0, 1);
    const ra = rng.int(6, 20), rb = rng.int(4, 16), rc = rng.int(2, 12), cap = rng.int(10, 60) * 10;
    const rates = n === 0 ? [ra, rb, -rc] : [ra, -rc, rb];
    if (ra + rb - rc <= 0 || ra === rb) return null;
    const ans = simulate(rates, cap);
    if (!isFinite(ans) || !C(ans) || ans > 150) return null;
    const names = n === 0 ? [pa, pb, pc] : [pa, pc, pb];
    const verb = (r, nm) => (r > 0 ? `${nm} fills ${r} litres` : `${nm} drains ${-r} litres`);
    const nets = ra + rb - rc;
    return mk(rng, (x) => N(x) + " min", ans, [
      [cap / nets * 3, "Ignored the partial last cycle and assumed a full number of cycles"],
      [cap / (ra + rb - rc), "Used the combined (all open together) rate"],
      [Math.ceil(cap / nets) * 3, "Rounded the cycle count up and charged the full cycle"],
      [ans + 3, "Added an extra pipe turn"],
      [ans - 1 > 0 ? ans - 1 : ans + 4, "Counted one minute too few in the last cycle"],
    ], finish(d, `A ${tk} of capacity **${N(cap)} litres** is initially empty. Pipes are opened in turn, **1 minute each**, in this order, repeating: ${names.map((nm, i) => verb(rates[i], nm) + " per minute").join(", ")}. After how many minutes is the ${tk} full?`,
      [`One cycle of 3 minutes changes the level by ${ra} + ${rb} − ${rc} = ${nets} litres`, `Find when the level reaches ${N(cap)} litres, remembering that it can overflow within a cycle before the drain pipe opens`, `Total time = **${N(R(ans))} minutes**`],
      `Net per cycle × number of cycles gets close; then check the last cycle minute by minute because the peak comes before the drain.`,
      `The tank is full the instant it reaches ${N(cap)} litres; do not wait for the cycle to finish if the drain pipe has not yet opened.`));
  }) });

  /* ---------------------------------------------------------------- 4. closed after some time */
  QB.gen("quant/pipes/closed-after-some-time", { title: "Closed after some time", gen: wrap((rng, d) => {
    const u = UNIT(rng)[0], f = uf(u), s = u.slice(0, -1), tk = T(rng, TANK), [pa, pb, pc] = T(rng, PN.slice(0, 3));
    const CT = [6, 8, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60];
    if (d === "Easy") {
      const a = T(rng, CT), b = T(rng, CT), t = rng.int(2, 10);
      if (a === b) return null;
      const cap = QB.lcm(a, b), ra = cap / a, rb = cap / b;
      const done = t * (ra + rb);
      if (done >= cap) return null;
      const ans = t + (cap - done) / ra;
      return mk(rng, f, ans, [
        [(cap - done) / ra, `Gave only the time ${pa} works after ${pb} is closed`],
        [a * b / (a + b), "Assumed both pipes stay open until the end"],
        [t + (cap - done) / rb, `Finished with ${pb}, but ${pb} was the pipe that was closed`],
        [t + (cap - done) / (ra + rb), "Kept both pipes running after the closure"],
        [a - t, "Subtracted the open time from the first pipe's own time"],
      ], finish(d, `Pipes ${pa} and ${pb} can fill an empty ${tk} in **${a}** and **${b} ${u}** respectively. Both are opened together, but ${pb} is closed after **${t} ${u}**. In how much time (from the start) is the ${tk} full?`,
        [`Take ${tk} = ${cap} units. ${pa} adds ${ra}, ${pb} adds ${rb} per ${s}`, `In ${t} ${u} both add ${t} × ${ra + rb} = ${done} units`, `Remaining ${cap - done} units by ${pa} alone: ${N(R((cap - done) / ra))} ${u}`, `Total = ${t} + ${N(R((cap - done) / ra))} = **${f(R(ans))}**`],
        `LCM ${cap} as the volume; fill with both for ${t} ${u}, then finish with the remaining pipe.`,
        `The question asks for the total time from the start, so add the ${t} ${u} to the finishing time.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      if (k === 0) {                       // A fills, B empties, B closed after t
        const a = T(rng, CT), b = T(rng, CT), t = rng.int(2, 12);
        if (b <= a) return null;
        const cap = QB.lcm(a, b), ra = cap / a, rb = cap / b, done = t * (ra - rb);
        if (done >= cap) return null;
        const ans = t + (cap - done) / ra;
        return mk(rng, f, ans, [
          [(cap - done) / ra, `Only counted ${pa} after the outlet was shut`],
          [a * b / (b - a), `Assumed the outlet ${pb} stays open throughout`],
          [t + (cap - done) / (ra - rb), "Kept the outlet running for the rest of the time"],
          [a, `Used ${pa}'s own filling time and ignored the outlet`],
        ], finish(d, `An inlet ${pa} fills a ${tk} in **${a} ${u}** and an outlet ${pb} empties a full ${tk} in **${b} ${u}**. Both are opened together on an empty ${tk}; after **${t} ${u}** the outlet is closed. How long in all does the ${tk} take to fill?`,
          [`Volume = ${cap} units; ${pa} adds ${ra}, ${pb} removes ${rb} per ${s}`, `After ${t} ${u}: ${t} × (${ra} − ${rb}) = ${done} units`, `Remaining ${cap - done} units at ${ra} per ${s} = ${N(R((cap - done) / ra))} ${u}`, `Total = **${f(R(ans))}**`],
          `Net fill during the open period, then the rest at the inlet's full rate.`,
          `After the outlet is closed the inlet works at its full rate, not at the net rate.`));
      }
      const a = T(rng, CT), b = T(rng, CT), t = T(rng, [2, 3, 4, 5, 6, 8, 10]);
      if (a === b) return null;
      const cap = QB.lcm(a, b), ra = cap / a, rb = cap / b, done = ra * t;
      const rem = cap - done;
      if (rem <= 0) return null;
      const ans = t + rem / (ra + rb);
      return mk(rng, f, ans, [
        [rem / (ra + rb), `Forgot the ${t} ${u} for which ${pa} ran alone`],
        [t + rem / ra, `Kept ${pa} alone and never let ${pb} help`],
        [a * b / (a + b), "Assumed both were open from the very beginning"],
        [t + rem / rb, `Finished with ${pb} alone`],
      ], finish(d, `Pipe ${pa} alone can fill a ${tk} in **${a} ${u}** and pipe ${pb} alone in **${b} ${u}**. ${pa} is opened first, and **${t} ${u}** later ${pb} is also opened. In how much time from the start is the ${tk} full?`,
        [`Volume = ${cap} units; ${pa}: ${ra}, ${pb}: ${rb} per ${s}`, `${pa} alone for ${t} ${u} = ${done} units; remaining ${rem}`, `Together: ${rem}/${ra + rb} = ${N(R(rem / (ra + rb)))} ${u}`, `Total = **${f(R(ans))}**`],
        `Work out what ${pa} has already filled, then divide the rest by the combined rate.`,
        `The total time includes the ${t} ${u} before ${pb} was opened.`));
    }
    // Hard
    const k = rng.int(0, 1);
    if (k === 0) {                         // 3 pipes, C closed after t
      const a = T(rng, CT), b = T(rng, CT), c = T(rng, CT), t = rng.int(2, 10);
      if (a === b) return null;
      const cap = lcm3(a, b, c), ra = cap / a, rb = cap / b, rc = cap / c;
      if (ra + rb - rc <= 0) return null;
      const done = t * (ra + rb - rc);
      if (done >= cap) return null;
      const ans = t + (cap - done) / (ra + rb);
      return mk(rng, f, ans, [
        [(cap - done) / (ra + rb), "Forgot the time before the outlet was closed"],
        [cap / (ra + rb - rc), "Assumed the outlet is never closed"],
        [t + (cap - done) / ra, "Finished with only one inlet"],
        [cap / (ra + rb), "Ignored the outlet completely"],
      ], finish(d, `A ${tk} has two inlets ${pa} and ${pb} (filling it in **${a}** and **${b} ${u}**) and an outlet ${pc} (emptying it in **${c} ${u}**). All three are opened on the empty ${tk}. After **${t} ${u}**, ${pc} is closed. What is the total time to fill the ${tk}?`,
        [`Volume = ${cap} units; ${pa}: +${ra}, ${pb}: +${rb}, ${pc}: −${rc} per ${s}`, `${t} ${u} at net ${ra + rb - rc}: ${done} units; remaining ${cap - done}`, `Then ${cap - done}/${ra + rb} = ${N(R((cap - done) / (ra + rb)))} ${u}`, `Total = **${f(R(ans))}**`],
        `Net rate with all three for the first ${t} ${u}; then inlets only for the rest. Add the two times.`,
        `After ${pc} is shut, the rate jumps to ${ra + rb} units per ${s}; do not keep using ${ra + rb - rc}.`));
    }
    const a = T(rng, CT), b = T(rng, CT), pn = T(rng, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5]]);
    if (a === b) return null;
    const cap = QB.lcm(a, b) * pn[1], ra = cap / a, rb = cap / b;
    const part = cap * pn[0] / pn[1];
    const ans = part / (ra + rb) + (cap - part) / ra;
    return mk(rng, f, ans, [
      [cap / (ra + rb), "Assumed both pipes run until the end"],
      [part / (ra + rb), `Counted only the time to reach ${pn[0]}/${pn[1]} of the ${tk}`],
      [(cap - part) / ra, `Counted only the time ${pa} works alone`],
      [part / ra + (cap - part) / (ra + rb), "Swapped the two stages"],
    ], finish(d, `Pipes ${pa} and ${pb} fill a ${tk} in **${a}** and **${b} ${u}** respectively. Both are opened together, and ${pb} is closed as soon as the ${tk} is **${pn[0]}/${pn[1]}** full. The rest is filled by ${pa} alone. Find the total time.`,
      [`Volume = ${cap} units; ${pa}: ${ra}, ${pb}: ${rb} per ${s}`, `${pn[0]}/${pn[1]} of the ${tk} = ${part} units, at ${ra + rb} per ${s}: ${N(R(part / (ra + rb)))} ${u}`, `Remaining ${cap - part} units by ${pa}: ${N(R((cap - part) / ra))} ${u}`, `Total = **${f(R(ans))}**`],
      `Split into two stages: combined rate up to ${pn[0]}/${pn[1]}, then ${pa}'s rate for the remaining ${pn[1] - pn[0]}/${pn[1]}.`,
      `The closure happens at a volume, not at a time: convert the fraction into units first.`));
  }) });

  /* ---------------------------------------------------------------- 5. tank capacity from rates */
  QB.gen("quant/pipes/tank-capacity-from-rates", { title: "Tank capacity from rates", gen: wrap((rng, d) => {
    const u = UNIT(rng)[0], s = u.slice(0, -1), tk = T(rng, TANK), who = T(rng, WHO), L = (x) => N(x) + " litres";
    if (d === "Easy") {
      const x = rng.int(5, 40), y = rng.int(1, x - 1), t = rng.int(4, 40);
      if (rng.chance(0.5)) {
        const cap = (x - y) * t;
        return mk(rng, L, cap, [
          [(x + y) * t, "Added the outlet rate instead of subtracting it"],
          [x * t, "Ignored the outlet pipe"],
          [(x - y) * t * 2, "Doubled the net rate"],
          [x * t - y, "Subtracted the outlet rate only once, not for the full time"],
        ], finish(d, `${who} fills a ${tk} using an inlet that delivers **${x} litres per ${s}** while an outlet drains **${y} litres per ${s}**. With both open, an empty ${tk} gets filled in **${t} ${u}**. What is the capacity of the ${tk}?`,
          [`Net rate = ${x} − ${y} = ${x - y} litres per ${s}`, `Capacity = ${x - y} × ${t} = **${L(cap)}**`],
          `Capacity = (inflow − outflow) × time = ${x - y} × ${t} = ${N(cap)}.`,
          `Use the net rate, not the inflow alone.`));
      }
      const cap2 = x * t;
      return mk(rng, L, cap2, [
        [(x + y) * t, "Added an outlet that does not exist in this question"],
        [x * t / 60, "Converted units that did not need converting"],
        [x + t, "Added the rate and the time"],
        [x * t * 2, "Doubled the answer"],
      ], finish(d, `A pipe pours water into a ${tk} at **${x} litres per ${s}**. It takes **${t} ${u}** to fill the empty ${tk}. What is the capacity of the ${tk}?`,
        [`Capacity = rate × time = ${x} × ${t} = **${L(cap2)}**`],
        `Rate × time = ${x} × ${t} = ${N(cap2)}.`,
        `Distance-style formula: quantity = rate × time.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      if (k === 0) {                       // two inlets, one outlet in L/min, with time
        const x = rng.int(8, 40), y = rng.int(5, 30), z = rng.int(3, 20), t = rng.int(5, 30);
        const net = x + y - z;
        if (net <= 0 || z >= x) return null;
        const cap = net * t;
        return mk(rng, L, cap, [
          [(x + y + z) * t, "Treated the outlet as a third inlet"],
          [(x + y) * t, "Ignored the outlet"],
          [(x - z) * t, "Dropped one of the inlets"],
          [(x + y - z) * t / 2, "Halved the answer"],
        ], finish(d, `A ${tk} has two inlets delivering **${x}** and **${y} litres per ${s}** and an outlet that removes **${z} litres per ${s}**. If all three are open, the empty ${tk} fills in **${t} ${u}**. Find its capacity.`,
          [`Net rate = ${x} + ${y} − ${z} = ${net} litres per ${s}`, `Capacity = ${net} × ${t} = **${L(cap)}**`],
          `Net rate × time: (${x} + ${y} − ${z}) × ${t} = ${N(cap)}.`,
          `Add inflows, subtract outflows, then multiply by time.`));
      }
      const pctn = T(rng, [20, 25, 40, 50, 60, 75]), x = rng.int(6, 30), t = rng.int(3, 20);
      const cap = x * t * 100 / pctn;
      if (!I(cap)) return null;
      return mk(rng, L, cap, [
        [x * t, `Took the water poured (${x * t}) as the full capacity`],
        [x * t * pctn / 100, "Multiplied by the percentage instead of dividing"],
        [x * t * (100 - pctn) / 100, "Used the empty part instead"],
        [x * t * 100 / (100 - pctn), "Used the complement of the percentage"],
      ], finish(d, `An inlet delivers **${x} litres per ${s}**. In **${t} ${u}** it fills **${pctn}%** of a ${tk}. What is the full capacity of the ${tk}?`,
        [`Water in ${t} ${u} = ${x} × ${t} = ${x * t} litres`, `That is ${pctn}% of the capacity, so capacity = ${x * t} × 100/${pctn} = **${L(cap)}**`],
        `Water delivered ÷ fraction filled: ${x * t} ÷ ${pctn / 100} = ${N(cap)}.`,
        `${x * t} litres is the PART; divide by the fraction to get the whole.`));
    }
    const k = rng.int(0, 1);
    if (k === 0) {                         // leak L/hour with fill times
      const a = T(rng, [4, 5, 6, 8, 10, 12]), b = a + T(rng, [1, 2, 3, 4]), lk = rng.int(2, 30) * 5;
      const cap = lk * a * b / (b - a);
      if (!I(cap)) return null;
      return mk(rng, L, cap, [
        [lk * a, "Used only the fill time without the leak"],
        [lk * b, "Used only the slower time"],
        [lk * (b - a), "Multiplied the leak rate by the delay"],
        [lk * a * b / (a + b), "Added the rates instead of subtracting"],
      ], finish(d, `An inlet fills a ${tk} in **${a} ${u}**. A leak drains **${lk} litres per ${s}**, so with the leak the same ${tk} takes **${b} ${u}**. Find the capacity of the ${tk}.`,
        [`Let capacity = C. Inlet rate = C/${a}, net rate = C/${b}`, `Leak rate = C/${a} − C/${b} = C(${b - a})/${a * b} = ${lk}`, `C = ${lk} × ${a * b}/${b - a} = **${L(cap)}**`],
        `Capacity = leak rate × a × b ÷ (b − a) = ${lk} × ${a * b} ÷ ${b - a} = ${N(cap)}.`,
        `Express both filling rates in terms of the unknown capacity, then subtract.`));
    }
    const x = rng.int(10, 50), y = rng.int(5, 40), t1 = rng.int(3, 15), t2 = rng.int(3, 15);
    // inlet x L/min for t1, then inlet + outlet y for t2, then full
    if (y >= x) return null;
    const cap = x * t1 + (x - y) * t2;
    return mk(rng, L, cap, [
      [(x - y) * (t1 + t2), "Used the net rate for the whole time"],
      [x * (t1 + t2), "Ignored the outlet for the second stage"],
      [x * t1 + (x + y) * t2, "Added the outlet's rate in the second stage"],
      [x * t1 - (x - y) * t2, "Subtracted the second stage"],
    ], finish(d, `A ${tk} is empty. An inlet delivering **${x} litres per ${s}** is opened alone for **${t1} ${u}**. Then an outlet draining **${y} litres per ${s}** is also opened and the ${tk} is full after another **${t2} ${u}**. What is its capacity?`,
      [`Stage 1: ${x} × ${t1} = ${x * t1} litres`, `Stage 2 (net ${x - y} per ${s}): ${x - y} × ${t2} = ${(x - y) * t2} litres`, `Capacity = **${L(cap)}**`],
      `Add the two stages: inlet alone, then net rate.`,
      `The outlet only works in the second stage; do not use the net rate for the whole period.`));
  }) });
})();
