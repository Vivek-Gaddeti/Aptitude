/* =====================================================================
   Time & work: eight question generators (one per catalog pattern).
   ===================================================================== */
(function () {
  const N = (x) => QB.num(x), R = (x) => QB.round(x, 2), M = (x) => QB.money(x);
  const C = (x) => isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const T = (rng, a) => rng.pick(a);
  const gcd = QB.gcd, lcm = QB.lcm;
  const TIME = { Easy: 40, Medium: 70, Hard: 105 };
  const JOBS = ["paint a boundary wall", "dig a drainage trench", "stitch an order of school uniforms", "pack a consignment of cartons", "lay a stretch of road", "assemble a batch of chairs", "print a set of question papers", "plaster a new house", "harvest a field of wheat", "load a goods truck"];
  const WK = ["Arun", "Bala", "Chitra", "Dev", "Esha", "Faisal", "Gita", "Hari", "Indu", "Jai", "Kavya", "Lokesh", "Mina", "Nikhil", "Om", "Priya"];
  const names = (rng, k) => rng.shuffle(WK).slice(0, k);
  const LS = [60, 72, 90, 120, 144, 180, 240, 360];
  const divs = (L) => { const r = []; for (let i = 1; i <= L; i++) if (L % i === 0) r.push(i); return r; };

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 1500; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("time-work: no clean question found");
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
      if (!isFinite(v) || v <= 0 || !C(v) || Math.abs(v - ans) < 0.11) continue;
      const t = f(R(v));
      if (seen.has(t.toLowerCase())) continue;
      seen.add(t.toLowerCase()); pairs.push([t, w[1]]);
    }
    if (pairs.length < 4) return null;
    const o = QB.options(rng, pairs);
    return Object.assign({ time: TIME[extra.d] }, extra, o, { calc: String(R(ans)) });
  }
  const fin = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  // nice pairs: x = m p (p+q), y = m q (p+q), together = m p q
  function pq(rng, small) {
    const p = rng.int(1, small ? 3 : 5), q = rng.int(1, small ? 3 : 5);
    if (p === q || gcd(p, q) !== 1) return null;
    const m = rng.int(1, small ? 2 : 3);
    return { x: m * p * (p + q), y: m * q * (p + q), t: m * p * q };
  }

  /* 1. days -> efficiency */
  QB.gen("quant/time-work/days-efficiency", { title: "Days → efficiency", gen: wrap((rng, d) => {
    const [A, B, Cn] = names(rng, 3), job = T(rng, JOBS);
    if (d === "Easy") {
      const r = pq(rng, true); if (!r) return null;
      return mk(rng, N, r.t, [[(r.x + r.y) / 2, "Averaged the two times"], [r.x + r.y, "Added the two times"], [Math.min(r.x, r.y) / 2, "Halved the faster worker's time"], [Math.abs(r.x - r.y), "Subtracted the two times"]],
        fin(d, `${A} can ${job} in **${r.x}** days and ${B} can do it in **${r.y}** days. Working together, in how many days will they finish it?`,
          [`${A}'s one-day work = 1/${r.x}, ${B}'s = 1/${r.y}`, `Together = 1/${r.x} + 1/${r.y} = ${r.x + r.y}/${r.x * r.y}`, `Days = ${r.x * r.y}/${r.x + r.y} = **${r.t}**`],
          "Two workers: days = (x × y) ÷ (x + y).", "Times cannot be added; rates (work per day) can."));
    }
    if (d === "Medium") {
      const r = pq(rng, false); if (!r) return null;
      const askB = rng.chance(0.6);
      return mk(rng, N, askB ? r.y : r.x, [[askB ? r.x : r.y, "Gave the other worker's time"], [r.x - r.t, "Subtracted the times directly"], [r.x + r.t, "Added the times"], [r.t * 2, "Doubled the joint time"]],
        fin(d, `${A} and ${B} together can ${job} in **${r.t}** days. ${A} alone can do it in **${r.x}** days. In how many days can ${B} alone do it?`,
          [`Together rate = 1/${r.t}, ${A}'s rate = 1/${r.x}`, `${B}'s rate = 1/${r.t} − 1/${r.x} = ${r.x - r.t}/${r.t * r.x}`, `${B} alone = ${r.t * r.x}/${r.x - r.t} = **${r.y}**`],
          "Take LCM as total work, subtract efficiencies: (total ÷ (joint rate − A's rate)).", "Subtract the rates, never the days."));
    }
    const L = T(rng, LS), dv = divs(L).filter((v) => v >= 2 && v <= L / 3);
    const a = T(rng, dv), b = T(rng, dv), c = T(rng, dv);
    if (new Set([a, b, c]).size < 3) return null;
    const s = a + b + c, days = L / s;
    return mk(rng, N, days, [[(L / a + L / b + L / c) / 3, "Averaged the three times"], [L / a + L / b + L / c, "Added the three times"], [L / (a + b), "Left out the third worker"], [Math.min(L / a, L / b, L / c) / 3, "Divided the fastest time by 3"]],
      fin(d, `${A}, ${B} and ${Cn} can ${job} in **${L / a}**, **${L / b}** and **${L / c}** days respectively. In how many days will all three finish it together?`,
        [`Take total work = LCM-style ${L} units`, `Efficiencies: ${a}, ${b}, ${c} units/day = ${s} per day`, `Days = ${L} ÷ ${s} = **${N(days)}**`],
        "Pick a total that every time divides into; efficiencies are total ÷ days.", "Averaging the three times is not the joint time."));
  }) });

  /* 2. LCM method */
  QB.gen("quant/time-work/lcm-method", { title: "LCM (total-work) method", gen: wrap((rng, d) => {
    const [A, B, Cn] = names(rng, 3), job = T(rng, JOBS);
    const L = T(rng, LS), dv = divs(L).filter((v) => v >= 2 && v <= L / 4);
    const a = T(rng, dv), b = T(rng, dv), c = T(rng, dv);
    if (new Set([a, b, c]).size < 3) return null;
    const da = L / a, db = L / b, dc = L / c;
    if (d === "Easy") {
      const days = L / (a + b);
      return mk(rng, N, days, [[(da + db) / 2, "Averaged the two times"], [da + db, "Added the two times"], [L / a - L / b < 0 ? L / b - L / a : L / a - L / b, "Subtracted the times"], [L / (a + b + c), "Included a third worker who is not working"]],
        fin(d, `${A} takes **${da}** days and ${B} takes **${db}** days to ${job}. How long will they take working together?`,
          [`Total work = LCM(${da}, ${db}) = ${lcm(da, db)} units`, `Rates: ${lcm(da, db) / da} and ${lcm(da, db) / db}`, `Days = ${lcm(da, db)} ÷ ${lcm(da, db) / da + lcm(da, db) / db} = **${N(days)}**`],
          "Assume total work = LCM of the days.", "Do not add times."));
    }
    if (d === "Medium") {
      const t = rng.int(1, 4), done = (a + b) * t, rem = L - done;
      if (rem <= 0) return null;
      const dd = rem / c;
      return mk(rng, N, dd, [[dc - t, "Subtracted the days from the third worker's time"], [rem / (a + b), "Used the first two workers' rate for the remainder"], [L / c - t * (a + b) / c * 0 - t, "Took the days already worked off the total"], [dc, "Used the full time of the third worker"]],
        fin(d, `${A}, ${B} and ${Cn} can complete a job alone in **${da}**, **${db}** and **${dc}** days. ${A} and ${B} work together for **${t}** days and then leave. How many more days will ${Cn} need to finish the rest?`,
          [`Total = ${L} units; rates = ${a}, ${b}, ${c}`, `Done = (${a} + ${b}) × ${t} = ${done}; left = ${rem}`, `${Cn} needs ${rem} ÷ ${c} = **${N(dd)}** days`],
          "Total work, minus work done, divided by the new worker's rate.", "The remaining work is not the third worker's whole job."));
    }
    const t = rng.int(1, 4), x = a * t, rem = L - x, days = t + rem / (b + c);
    if (rem <= 0) return null;
    return mk(rng, N, days, [[rem / (b + c), `Forgot the days ${A} worked alone`], [L / (a + b + c), "Assumed all three worked from the start"], [t + rem / b, "Left out the third worker's help"], [t + rem / (a + b + c), `Left ${A} working after the others joined`]],
      fin(d, `${A} can finish a job alone in **${da}** days and works on it for **${t}** day${t > 1 ? "s" : ""}. Then ${A} stops and ${B} (alone **${db}** days) and ${Cn} (alone **${dc}** days) take over together. How many days in all does the job take?`,
        [`Total = ${L} units`, `${A} alone ${t} days → ${x} units; left ${rem}`, `${B} + ${Cn}: ${b + c}/day → ${N(rem / (b + c))} days`, `Total = ${t} + ${N(rem / (b + c))} = **${N(days)}**`],
        "Handle each stage with units and rates, then add the days.", "Do not forget the first stage when asked for the total time."));
  }) });

  /* 3. together, then one leaves */
  QB.gen("quant/time-work/together-then-one-leaves", { title: "Together, then one leaves", gen: wrap((rng, d) => {
    const [A, B, Cn] = names(rng, 3), job = T(rng, JOBS);
    const L = T(rng, LS), dv = divs(L).filter((v) => v >= 2 && v <= L / 5);
    const a = T(rng, dv), b = T(rng, dv), c = T(rng, dv);
    if (a === b) return null;
    const da = L / a, db = L / b, dc = L / c;
    if (d !== "Hard") {
      const t = rng.int(2, 8), rem = L - (a + b) * t;
      if (rem <= 0) return null;
      const stay = T(rng, [[A, B, a, b, da, db], [B, A, b, a, db, da]]);
      const [gone, kept, ga, kb, dg, dk] = stay;
      const more = rem / kb;
      if (d === "Easy") {
        return mk(rng, N, more, [[dk - t, "Subtracted the days from the staying worker's time"], [rem / (ga + kb), "Used the joint rate for the rest"], [dk, "Used the full solo time"], [more + t, "Added the days already worked"]],
          fin(d, `${A} and ${B} can ${job} in **${da}** and **${db}** days. They work together for **${t}** days, then ${gone} leaves. In how many more days will ${kept} finish the work?`,
            [`Total = ${L} units; rates ${a} and ${b}`, `Done in ${t} days = ${(a + b) * t}; left = ${rem}`, `${kept} needs ${rem} ÷ ${kb} = **${N(more)}** days`],
            "Left-over work ÷ the remaining person's rate.", "After one leaves, only one rate counts."));
      }
      const tot = t + more;
      return mk(rng, N, tot, [[more, "Gave only the days after the leave"], [L / (a + b), "Assumed both stayed to the end"], [dk, "Used the staying worker's solo time"], [t + rem / (ga + kb), "Kept both workers for the rest"]],
        fin(d, `${A} and ${B} can ${job} alone in **${da}** and **${db}** days. They start together, but ${gone} leaves after **${t}** days. In how many days in all is the work finished?`,
          [`Total = ${L} units; rates ${a} and ${b}`, `After ${t} days: left ${rem}`, `${kept} takes ${N(more)} more days`, `Total = ${t} + ${N(more)} = **${N(tot)}**`],
          "Total days = days together + (left-over ÷ remaining rate).", "The question wants the total days, not just the extra days."));
    }
    // Hard: A leaves t days before the end; A, B, C together
    const e = [a, b, c], s = a + b + c;
    for (let tries = 0; tries < 1; tries++) {
      const Tt = rng.int(6, 20), t = rng.int(1, 5);
      if (t >= Tt) return null;
      const W = a * (Tt - t) + (b + c) * Tt;
      if (W % a || W % b || W % c) return null;
      const dA = W / a, dB = W / b, dC = W / c;
      return mk(rng, N, Tt, [[W / s, "Assumed all three worked to the end"], [Tt - t, "Gave the days that A worked"], [Tt + t, "Added the days instead of subtracting them"], [W / (b + c), "Used only the two who stay"]],
        fin(d, `${A}, ${B} and ${Cn} can do a job alone in **${N(dA)}**, **${N(dB)}** and **${N(dC)}** days. They start together, but ${A} leaves **${t}** days before the work is finished. In how many days is the job completed?`,
          [`Total = ${N(W)} units; rates ${a}, ${b}, ${c}`, `Let total time be x: ${a}(x − ${t}) + ${b + c}x = ${N(W)}`, `${s}x = ${N(W + a * t)} → x = **${Tt}**`],
          "Write the equation with the shorter time for the one who leaves early.", "The leaver works (x − t) days, the others x days."));
    }
  }) });

  /* 4. alternate days */
  function alt(L, effs) { let left = L, day = 0, i = 0; while (left > 1e-9) { const e = effs[i % effs.length]; if (left <= e) { return day + left / e; } left -= e; day++; i++; } return day; }
  QB.gen("quant/time-work/alternate-days", { title: "Alternate days", gen: wrap((rng, d) => {
    const [A, B, Cn] = names(rng, 3), job = T(rng, JOBS);
    const L = T(rng, [30, 60, 90, 120, 180, 36, 48, 72, 24]);
    const dv = divs(L).filter((v) => v >= 2 && v <= L / 4);
    const a = T(rng, dv), b = T(rng, dv);
    if (a === b) return null;
    const da = L / a, db = L / b;
    if (d === "Easy") {
      if (L % (a + b)) return null;
      const days = 2 * L / (a + b);
      return mk(rng, N, days, [[L / (a + b), "Treated it as working together"], [(da + db) / 2, "Averaged the two times"], [days / 2, "Counted cycles, not days"], [days + 2, "Added a spare cycle"]],
        fin(d, `${A} and ${B} can ${job} in **${da}** and **${db}** days. They work on alternate days, ${A} on day 1. In how many days is it finished?`,
          [`Total = ${L} units; in 2 days they do ${a} + ${b} = ${a + b}`, `Cycles = ${L} ÷ ${a + b} = ${L / (a + b)}`, `Days = 2 × ${L / (a + b)} = **${N(days)}**`], "Treat two days as one cycle of (a + b) work.", "Alternate days takes about twice as long as working together."));
    }
    if (d === "Medium") {
      const order = rng.chance(0.5) ? [a, b] : [b, a];
      const first = order[0] === a ? A : B, ans = alt(L, order);
      if (!C(ans) || L % (a + b) === 0) return null;
      return mk(rng, N, ans, [[L / (a + b), "Treated it as working together"], [Math.ceil(ans), "Rounded up to a whole day"], [Math.floor(ans), "Rounded down"], [2 * L / (a + b), "Assumed every cycle completes"]],
        fin(d, `${A} can ${job} in **${da}** days and ${B} in **${db}** days. They work on alternate days, starting with ${first}. How many days does the work take?`,
          [`Total = ${L} units; ${A} does ${a}/day, ${B} does ${b}/day`, `Per 2 days: ${a + b}`, `Full cycles and the remainder give **${N(ans)}** days`], "Do whole cycles, then finish the remainder on the right worker's day.", "The last cycle is usually incomplete; look at who works on that day."));
    }
    const c = T(rng, dv); if (c === a || c === b) return null;
    const effs = [a, b, c], ans = alt(L, effs);
    if (!C(ans)) return null;
    return mk(rng, N, ans, [[L / (a + b + c), "Treated it as all three working together"], [Math.ceil(ans), "Rounded up"], [Math.floor(ans), "Rounded down"], [3 * L / (a + b + c), "Assumed every cycle completes"]],
      fin(d, `${A}, ${B} and ${Cn} can ${job} alone in **${da}**, **${db}** and **${L / c}** days. They work one day each in turn (${A}, ${B}, ${Cn}, ${A}, …). How many days does the whole work take?`,
        [`Total = ${L} units; rates ${a}, ${b}, ${c}`, `Per 3-day cycle: ${a + b + c}`, `After the full cycles, the remaining units are done on the next worker's day → **${N(ans)}** days`], "Use cycles of 3 days, then look at the remainder.", "Check which worker is on duty when the last units are done."));
  }) });

  /* 5. M1 D1 H1 / W1 = M2 D2 H2 / W2 */
  QB.gen("quant/time-work/m-d-h-w-m", { title: "M₁D₁H₁/W₁ = M₂D₂H₂/W₂", gen: wrap((rng, d) => {
    const job = T(rng, ["dig a canal", "build a compound wall", "weave a lot of carpets", "paint a hostel", "assemble machines", "lay a pipeline"]);
    if (d === "Easy") {
      const m1 = rng.int(2, 20) * 2, d1 = rng.int(3, 24), m2 = m1 * T(rng, [2, 3, 4]) / T(rng, [1]), ans = m1 * d1 / m2;
      return mk(rng, N, ans, [[m2 * d1 / m1, "Treated men and days as directly proportional"], [d1 + (m2 - m1), "Added the extra men to the days"], [d1 - (m2 - m1), "Subtracted the extra men from the days"], [d1 * 2, "Doubled the days"]],
        fin(d, `**${m1}** men can ${job} in **${d1}** days. In how many days can **${m2}** men do the same job?`,
          [`Man-days of work = ${m1} × ${d1} = ${m1 * d1}`, `Days = ${m1 * d1} ÷ ${m2} = **${N(ans)}**`], "More men, fewer days: men × days is constant.", "More workers means fewer days, not more."));
    }
    if (d === "Medium") {
      const m1 = rng.int(3, 15), d1 = rng.int(6, 30), h1 = rng.int(4, 9), m2 = rng.int(2, 20), h2 = rng.int(4, 12);
      const ans = m1 * d1 * h1 / (m2 * h2);
      return mk(rng, N, ans, [[m1 * d1 * h2 / (m2 * h1), "Put hours per day on the wrong side"], [m1 * d1 / m2, "Ignored the change in hours per day"], [m2 * d1 * h2 / (m1 * h1), "Inverted the men ratio"], [d1 * h1 / h2, "Ignored the change in men"]],
        fin(d, `**${m1}** men working **${h1}** hours a day can ${job} in **${d1}** days. How many days will **${m2}** men working **${h2}** hours a day need for the same job?`,
          [`Work = ${m1} × ${d1} × ${h1} = ${m1 * d1 * h1} man-hours`, `Days = ${m1 * d1 * h1} ÷ (${m2} × ${h2}) = **${N(ans)}**`], "M × D × H is the total work; equate the two sides.", "Hours per day and men both sit inversely to days."));
    }
    const kind = rng.int(0, 1);
    if (kind === 0) {
      const m1 = rng.int(3, 20), d1 = rng.int(8, 30), t = rng.int(2, d1 - 2), k = rng.int(2, 10);
      const rem = m1 * (d1 - t), ans = rem / (m1 + k);
      return mk(rng, N, ans, [[d1 - t, "Ignored the extra men"], [rem / (m1 - k), "Subtracted men instead of adding"], [m1 * d1 / (m1 + k), "Forgot the days already worked"], [(d1 - t) * m1 / k, "Used only the extra men"]],
        fin(d, `**${m1}** men start to ${job} that they can finish in **${d1}** days. After **${t}** days, **${k}** more men join. In how many more days will the job be finished?`,
          [`Left = ${m1} × (${d1} − ${t}) = ${rem} man-days`, `New strength = ${m1 + k}`, `Days = ${rem} ÷ ${m1 + k} = **${N(ans)}**`], "Remaining man-days ÷ the new number of men.", "Work out what is left before changing the team."));
    }
    const m1 = rng.int(4, 16), d1 = rng.int(6, 20), w = rng.int(2, 4), m2 = rng.int(3, 20), h = rng.int(1, 3) * 0 + rng.int(2, 3);
    // W2 = w * W1, hours/day change from 6 to 6*h/..., simple: m1 men, d1 days -> w times work with m2 men
    const ans = m1 * d1 * w / m2;
    return mk(rng, N, ans, [[m1 * d1 / (m2 * w), "Divided by the larger work instead of multiplying"], [m1 * d1 / m2, "Ignored that the work is bigger"], [m2 * d1 * w / m1, "Inverted the men ratio"], [d1 * w, "Ignored the change in men"]],
      fin(d, `**${m1}** men can ${job} in **${d1}** days. How many days will **${m2}** men take to do a job that is **${w}** times as big?`,
        [`W₂ = ${w} W₁`, `${m1} × ${d1} / 1 = ${m2} × D / ${w}`, `D = ${m1 * d1 * w} ÷ ${m2} = **${N(ans)}**`], "M₁D₁/W₁ = M₂D₂/W₂; a bigger job means more days.", "A bigger work puts W on the opposite side."));
  }) });

  /* 6. work and wages */
  QB.gen("quant/time-work/work-and-wages", { title: "Work & wages", gen: wrap((rng, d) => {
    const [A, B, Cn] = names(rng, 3), job = T(rng, JOBS);
    if (d === "Easy") {
      const r = pq(rng, true); if (!r) return null;
      const W = rng.int(2, 40) * 100 * (r.x + r.y);
      const share = W * r.y / (r.x + r.y);
      return mk(rng, M, share, [[W * r.x / (r.x + r.y), `Gave the share of the slower worker`], [W / 2, "Split the wages equally"], [W * r.x / r.y, "Used the time ratio directly"], [share + 100, "Rounded the share"]],
        fin(d, `${A} can ${job} in **${r.x}** days and ${B} in **${r.y}** days. They do it together and are paid ${M(W)}. What is ${A}'s share?`,
          [`Work ratio A : B = 1/${r.x} : 1/${r.y} = ${r.y} : ${r.x}`, `${A}'s share = ${r.y}/${r.x + r.y} × ${M(W)} = **${M(share)}**`], "Wages are shared in the ratio of work done, i.e. the inverse of days.", "The faster worker (fewer days) gets the larger share."));
    }
    const L = T(rng, LS), dv = divs(L).filter((v) => v >= 2 && v <= L / 4);
    const a = T(rng, dv), b = T(rng, dv), c = T(rng, dv);
    if (new Set([a, b, c]).size < 3) return null;
    if (d === "Medium") {
      const s = a + b + c, W = rng.int(2, 30) * 100 * s / gcd(s, 100), share = W * c / s;
      return mk(rng, M, share, [[W / 3, "Split the wages equally"], [W * a / s, "Gave another worker's share"], [W * (L / c) / (L / a + L / b + L / c), "Used the days as weights instead of the rates"], [W * c / (a + b), "Divided by the other two only"]],
        fin(d, `${A}, ${B} and ${Cn} can ${job} alone in **${L / a}**, **${L / b}** and **${L / c}** days. They complete it together for ${M(W)}. What does ${Cn} get?`,
          [`Rates (units/day with total ${L}): ${a} : ${b} : ${c}`, `${Cn}'s share = ${c}/${s} × ${M(W)} = **${M(share)}**`], "Shares are proportional to the daily rates.", "More days alone means less efficient, so a smaller share."));
    }
    // Hard: A works t days, then B joins to finish with the pay in proportion to work
    const t = rng.int(1, 3), tog = (L - a * t) / (a + b);
    if (!Number.isInteger(tog) || tog <= 0) return null;
    const wA = a * (t + tog), wB = b * tog, W = rng.int(2, 30) * 100 * L / gcd(L, 100), shareB = W * wB / L;
    return mk(rng, M, shareB, [[W * b / (a + b), "Used the efficiency ratio and ignored A's head start"], [W / 2, "Split the wages equally"], [W * wA / L, "Gave A's share"], [W * tog / (t + 2 * tog), "Used the days ratio instead of the work done"]],
      fin(d, `${A} (alone **${L / a}** days) starts a job. After **${t}** day${t > 1 ? "s" : ""} ${B} (alone **${L / b}** days) joins and they finish together. The total pay is ${M(W)}. What is ${B}'s share?`,
        [`Total = ${L} units; ${A} does ${a}/day, ${B} does ${b}/day`, `Together phase: ${N(tog)} days; ${B} does ${b} × ${N(tog)} = ${wB} units`, `${B}'s share = ${wB}/${L} × ${M(W)} = **${M(shareB)}**`], "Pay follows the units of work each person actually did.", "A's head start counts as extra work for A."));
  }) });

  /* 7. "A is twice as efficient as B" */
  QB.gen("quant/time-work/a-is-twice-as-efficient", { title: "\"A is twice as efficient as B\"", gen: wrap((rng, d) => {
    const [A, B] = names(rng, 2), job = T(rng, JOBS);
    const k = T(rng, d === "Easy" ? [2, 3] : [2, 3, 4, 5]);
    const word = k === 2 ? "twice" : k === 3 ? "three times" : k === 4 ? "four times" : "five times";
    if (d === "Easy") {
      const x = k * rng.int(2, 12); // B alone
      return mk(rng, N, x / k, [[x * k, "Multiplied instead of dividing"], [x / (k + 1), "Gave the joint time"], [x - k, "Subtracted the factor from the days"], [x + x / k, "Added the two times"]],
        fin(d, `${A} is **${word}** as efficient as ${B}. ${B} alone can ${job} in **${x}** days. How many days does ${A} alone need?`,
          [`Efficiency ratio A : B = ${k} : 1, so times are in the ratio 1 : ${k}`, `${A} = ${x} ÷ ${k} = **${N(x / k)}**`], "More efficient means proportionally fewer days.", "Twice as efficient means half the time, not double."));
    }
    if (d === "Medium") {
      const t = rng.int(2, 12), askA = rng.chance(0.5);
      const B2 = t * (k + 1), A2 = B2 / k;
      return mk(rng, N, askA ? A2 : B2, [[askA ? B2 : A2, "Gave the other worker's time"], [t * k, "Multiplied the joint time by the factor"], [t * (k - 1), "Used the efficiency difference"], [t * (k + 2), "Added the wrong number of parts"]],
        fin(d, `${A} is **${word}** as efficient as ${B}. Together they can ${job} in **${t}** days. How many days will ${askA ? A : B} take alone?`,
          [`Rates A : B = ${k} : 1 → ${k + 1} units per day together`, `Total work = ${t} × ${k + 1} = ${t * (k + 1)} units`, `${askA ? A : B} alone = ${t * (k + 1)} ÷ ${askA ? k : 1} = **${N(askA ? A2 : B2)}**`],
          `Total work = joint days × (k + 1). The slow worker takes ${k + 1} × the joint time.`, "Parts add up to k + 1, not k."));
    }
    const x = k * rng.int(2, 10), n = x - x / k, tog = x / (k + 1);
    return mk(rng, N, tog, [[x / k, "Gave the faster worker's solo time"], [n, "Gave the difference in days"], [x, "Gave the slower worker's solo time"], [n / k, "Divided the difference by k"]],
      fin(d, `${A} is **${word}** as efficient as ${B}, and ${A} takes **${n}** days less than ${B} to ${job}. How many days will they take together?`,
        [`Times are in the ratio 1 : ${k}, so the gap is ${k - 1} parts = ${n}`, `One part = ${N(n / (k - 1))}; ${A} = ${N(x / k)}, ${B} = ${N(x)}`, `Together = ${N(x)} ÷ ${k + 1} = **${N(tog)}**`],
        `B = n × k ÷ (k − 1); together = B ÷ (k + 1).`, "The difference in days equals k − 1 parts of the time ratio, not k."));
  }) });

  /* 8. men, women and children groups */
  QB.gen("quant/time-work/men-women-and-children-groups", { title: "Men, women & children groups", gen: wrap((rng, d) => {
    const job = T(rng, JOBS);
    if (d === "Easy") {
      const k = T(rng, [2, 3, 4]), m = rng.int(2, 8), w = rng.int(2, 10), D = rng.int(4, 20), w2 = rng.int(3, 20);
      const ans = (m * k + w) * D / w2;
      return mk(rng, N, ans, [[(m + w) * D / w2, "Treated a man and a woman as equally efficient"], [(m * k + w) * D / (w2 * k), "Counted women as men"], [(m * k + w) * D * w2, "Multiplied instead of dividing"], [(m * k + w + 1) * D / w2, "Miscounted the work-units"]],
        fin(d, `**${m}** men and **${w}** women can ${job} in **${D}** days. If **1 man = ${k} women** in work, how many days will **${w2}** women take?`,
          [`Convert to women: ${m} men = ${m * k} women, so the group = ${m * k + w} women`, `Women-days = ${m * k + w} × ${D} = ${(m * k + w) * D}`, `Days = ${(m * k + w) * D} ÷ ${w2} = **${N(ans)}**`], "Convert everybody to one unit, then use men × days = constant.", "Count each man as k women."));
    }
    if (d === "Medium") {
      const x = rng.int(2, 3), y = rng.int(2, 3), m = rng.int(1, 4), w = rng.int(1, 5), c = rng.int(2, 8), D = rng.int(3, 15);
      const unit = (m * x * y + w * y + c);   // in children
      const c2 = rng.int(4, 24);
      const ans = unit * D / c2;
      return mk(rng, N, ans, [[(m + w + c) * D / c2, "Treated everyone as equally efficient"], [unit * D * c2 / 1, "Multiplied instead of dividing"], [(m * x + w + c) * D / c2, "Missed the second conversion step"], [unit * D / (c2 * y), "Divided by an extra factor"]],
        fin(d, `**${m}** men, **${w}** women and **${c}** children together can ${job} in **${D}** days. If **1 man = ${x} women** and **1 woman = ${y} children** in work, how many days will **${c2}** children alone take?`,
          [`1 man = ${x * y} children, 1 woman = ${y} children`, `Group = ${m * x * y} + ${w * y} + ${c} = ${unit} children`, `Days = ${unit} × ${D} ÷ ${c2} = **${N(ans)}**`], "Convert all to the weakest worker.", "Remember to multiply the two conversions for men to children."));
    }
    // Hard: two equal-work groups; find the man:woman ratio then third group
    const x = rng.int(2, 4);
    const m1 = rng.int(2, 10), w1 = rng.int(2, 10), D1 = rng.int(6, 20), W = (m1 * x + w1) * D1;
    const D2 = T(rng, divs(W).filter((v) => v >= 2 && v <= 20 && v !== D1));
    if (!D2) return null;
    const cap2 = W / D2, m2 = rng.int(1, 14), w2 = cap2 - m2 * x;
    if (!Number.isInteger(w2) || w2 <= 0 || m1 * D1 === m2 * D2) return null;
    const m3 = rng.int(2, 15), w3 = rng.int(2, 15), ans = W / (m3 * x + w3);
    return mk(rng, N, ans, [[W / (m3 + w3), "Treated a man and a woman as equal"], [W / (m3 * x + w3) * x, "Mixed up the conversion"], [(m1 + w1) * D1 / (m3 + w3), "Used head-counts only"], [W / (m3 + w3 * x), "Applied the factor to women instead of men"]],
      fin(d, `**${m1}** men and **${w1}** women can ${job} in **${D1}** days, while **${m2}** men and **${w2}** women can do the same in **${D2}** days. How many days will **${m3}** men and **${w3}** women take?`,
        [`Let 1 man = x women. Work = (${m1}x + ${w1}) × ${D1} = (${m2}x + ${w2}) × ${D2}`, `${m1 * D1}x + ${w1 * D1} = ${m2 * D2}x + ${w2 * D2} → x = ${x}`, `Work = ${W} woman-days; days = ${W} ÷ (${m3} × ${x} + ${w3}) = **${N(ans)}**`],
        "Equate the two work totals to find the man : woman efficiency ratio, then convert.", "Both groups finish the same work, so the equation uses equal totals."));
  }) });
})();
