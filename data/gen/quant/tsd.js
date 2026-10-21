/* =====================================================================
   Time, speed & distance: thirteen question generators (one per pattern).
   Easy / Medium / Hard all supported; every wrong option is a real mistake.
   ===================================================================== */
(function () {
  const N = (x) => QB.num(x), R = (x) => QB.round(x, 2);
  const C = (x) => isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const I = Number.isInteger;
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 40, Medium: 70, Hard: 100 };
  const KMH = (x) => N(x) + " km/h", MS = (x) => N(x) + " m/s", MT = (x) => N(x) + " m", KM = (x) => N(x) + " km";
  const SEC = (x) => N(x) + " s", MIN = (x) => N(x) + " min", HR = (x) => N(x) + (x === 1 ? " hour" : " hours");
  const c5 = (v) => v * 5 / 18, c18 = (m) => m * 18 / 5;   // km/h -> m/s, m/s -> km/h

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 1500; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("tsd: no clean question found");
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

  const NAMES = ["Ravi", "Meena", "Arjun", "Sunita", "Kiran", "Farhan", "Divya", "Harish", "Pooja", "Imran", "Lakshmi", "Gurpreet", "Naveen", "Anita", "Rohit", "Neha", "Suresh", "Kavya"];
  const NAME2 = ["Mohan", "Priya", "Vikram", "Asha", "Deepak", "Shreya", "Karthik", "Zoya", "Manoj", "Ritu", "Sanjay", "Tara", "Ajay", "Bhavna", "Faisal", "Isha"];
  const CITY = ["Pune", "Nashik", "Jaipur", "Indore", "Coimbatore", "Madurai", "Lucknow", "Kanpur", "Surat", "Vadodara", "Mysuru", "Hubballi", "Nagpur", "Bhopal", "Ranchi", "Patna"];
  const VEH = ["car", "bus", "scooter", "tempo", "motorcycle", "van", "truck", "taxi"];
  const TRN = ["The Rajdhani", "A goods train", "A local train", "An express train", "A passenger train", "A freight train", "A metro train"];
  const pair = (rng) => { const a = T(rng, NAMES); let b = T(rng, NAME2); return [a, b]; };
  const two = (rng) => { const c1 = T(rng, CITY); let c2 = T(rng, CITY); while (c2 === c1) c2 = T(rng, CITY); return [c1, c2]; };
  const lcm = QB.lcm, gcd = QB.gcd;

  /* ---------------------------------------------------------------- 1. basics & km/h <-> m/s */
  QB.gen("quant/tsd/basics-and-km-h-m", { title: "Basics & km/h ↔ m/s", gen: wrap((rng, d) => {
    const nm = T(rng, NAMES), veh = T(rng, VEH);
    if (d === "Easy") {
      const t = rng.int(0, 2);
      if (t === 0) {
        const v = T(rng, [18, 36, 54, 72, 90, 108, 126, 144, 162, 180]), a = c5(v);
        return mk(rng, MS, a, [
          [c18(v), "Multiplied by 18/5 instead of 5/18"],
          [v / 3, "Divided by 3 instead of 3.6"],
          [v / 6, "Divided by 6"],
          [v * 5 / 9, "Used 5/9 instead of 5/18"],
        ], finish(d, `A ${veh} moves at **${N(v)} km/h**. Express its speed in metres per second.`,
          [`km/h → m/s: multiply by 5/18`, `${N(v)} × 5/18 = **${MS(a)}**`],
          `Divide by 3.6: ${N(v)} ÷ 3.6 = ${N(a)}. Multiples of 18 give whole numbers.`,
          `To go from km/h to m/s you multiply by 5/18; the 18/5 factor is for the opposite direction.`));
      }
      if (t === 1) {
        const m = rng.int(3, 40), a = c18(m);
        return mk(rng, KMH, a, [
          [c5(m), "Multiplied by 5/18 instead of 18/5"],
          [m * 3, "Used 3 instead of 3.6"],
          [m * 4, "Used 4 instead of 3.6"],
          [m * 6, "Used 6 instead of 3.6"],
        ], finish(d, `${nm} cycles at **${N(m)} m/s**. What is this speed in km/h?`,
          [`m/s → km/h: multiply by 18/5`, `${N(m)} × 18/5 = **${KMH(R(a))}**`],
          `Multiply by 3.6: ${N(m)} × 3.6 = ${N(R(a))}.`,
          `Do not use 3 as a rough factor; the exact factor is 3.6.`));
      }
      const v = rng.int(2, 18) * 5, h = rng.int(2, 9), a = v * h;
      return mk(rng, KM, a, [
        [v / h, "Divided speed by time"],
        [v + h, "Added speed and time"],
        [v * h * 2, "Doubled the answer"],
        [v * (h - 1), "Used one hour less"],
      ], finish(d, `A ${veh} travels at a steady **${N(v)} km/h** for **${h} hours**. How far does it go?`,
        [`Distance = speed × time = ${N(v)} × ${h} = **${KM(a)}**`],
        `Distance = speed × time.`, `Speed × time gives distance; speed ÷ time has no meaning here.`));
    }
    if (d === "Medium") {
      const t = rng.int(0, 2);
      if (t === 0) {
        const v = rng.int(4, 24) * 5, m = T(rng, [12, 15, 18, 20, 24, 30, 36, 40, 45, 48]), a = v * m / 60;
        return mk(rng, KM, a, [
          [v * m, "Forgot to convert minutes into hours"],
          [v * m / 100, "Divided by 100 instead of 60"],
          [v / m, "Divided speed by time"],
          [v * m / 6, "Divided by 6"],
        ], finish(d, `${nm} drives a ${veh} at **${N(v)} km/h** for **${m} minutes**. How many kilometres does ${nm} cover?`,
          [`${m} minutes = ${m}/60 hour`, `Distance = ${N(v)} × ${m}/60 = **${KM(R(a))}**`],
          `Speed × minutes ÷ 60 = ${N(v)} × ${m} ÷ 60.`, `Always put the time in the same unit as the speed (hours with km/h).`));
      }
      if (t === 1) {
        const m = rng.int(5, 30), s = rng.int(5, 40), D = m * s, a = c18(D / s);
        return mk(rng, KMH, a, [
          [D / s, "Left the answer in m/s"],
          [c5(D / s), "Used 5/18 instead of 18/5"],
          [D / s * 3, "Used 3 instead of 3.6"],
          [D / (s * 60) * 18 / 5, "Treated the seconds as minutes"],
        ], finish(d, `A runner covers **${N(D)} metres** in **${s} seconds**. Find the speed in km/h.`,
          [`Speed = ${N(D)}/${s} = ${N(R(D / s))} m/s`, `In km/h: ${N(R(D / s))} × 18/5 = **${KMH(R(a))}**`],
          `Distance ÷ time gives m/s; then multiply by 3.6.`, `The final step of converting to km/h is easy to forget.`));
      }
      const D = rng.int(2, 30) * 10, v = T(rng, [20, 24, 30, 36, 40, 45, 48, 50, 60, 72, 80]), a = 60 * D / v;
      return mk(rng, MIN, a, [
        [D / v, "Left the time in hours"],
        [D * v / 60, "Multiplied distance by speed"],
        [100 * D / v, "Converted hours to minutes with 100"],
        [60 * v / D, "Inverted the formula"],
      ], finish(d, `${nm} has to cover **${N(D)} km** on a ${veh} that moves at **${N(v)} km/h**. How many minutes will the journey take?`,
        [`Time = ${N(D)}/${v} hours`, `In minutes: ${N(D)}/${v} × 60 = **${MIN(R(a))}**`],
        `Distance ÷ speed × 60 for minutes.`, `The ratio D/v is in hours; multiply by 60 to get minutes.`));
    }
    // Hard
    const t = rng.int(0, 1);
    if (t === 0) {
      const s1 = T(rng, [20, 30, 40, 45, 50, 60, 72]), s2 = T(rng, [20, 30, 40, 45, 50, 60, 72, 90]), x = rng.int(1, 12) * 10, y = rng.int(1, 12) * 10;
      const a = x / s1 + y / s2;
      if (s1 === s2) return null;
      const [c1, c2] = two(rng);
      return mk(rng, (z) => N(z) + " hours", a, [
        [(x + y) * 2 / (s1 + s2), "Used the arithmetic mean of the two speeds for the whole journey"],
        [(x + y) / s1, "Used the first speed for the whole distance"],
        [x / s2 + y / s1, "Swapped the two speeds"],
        [(x / s1 + y / s2) * 60, "Gave the time in minutes"],
      ], finish(d, `A bus goes from ${c1} to ${c2} in two stretches: **${x} km** at **${s1} km/h** and then **${y} km** at **${s2} km/h**. What is the total running time in hours?`,
        [`Time for stretch 1 = ${x}/${s1} = ${N(R(x / s1))} h`, `Time for stretch 2 = ${y}/${s2} = ${N(R(y / s2))} h`, `Total = **${N(R(a))} hours**`],
        `Add the two times: each is distance ÷ its own speed.`, `Never average speeds; add times for each stretch separately.`));
    }
    const [p, q] = T(rng, [[2, 3], [3, 4], [4, 5], [5, 6], [3, 5], [5, 7], [2, 5], [6, 7]]);
    const e = rng.int(1, 12) * 5, a = e * p / (q - p);
    const what = rng.chance(0.5);
    const ans = what ? a : a * q / p;
    return mk(rng, MIN, ans, [
      [what ? a * q / p : a, what ? "Gave the slower (new) time instead of the usual time" : "Gave the usual time instead of the new time"],
      [e * q / (q - p), "Used q/(q−p) in place of p/(q−p)"],
      [e, "Took the extra delay itself as the answer"],
      [e * (q - p), "Multiplied the delay by the difference of the numbers"],
    ], finish(d, `${nm} walks to office at **${p}/${q}** of the usual speed and arrives **${e} minutes late**. ${what ? "How many minutes does the usual walk take?" : "How many minutes does the slower walk take?"}`,
      [`Time is inversely proportional to speed, so new time = (${q}/${p}) × usual time`, `Extra = (${q}/${p} − 1) × usual = ${q - p}/${p} × usual = ${e}`, `Usual time = ${e} × ${p}/${q - p} = ${N(R(a))} min${what ? "" : `, new time = ${N(R(a * q / p))} min`}`, `Answer: **${MIN(R(ans))}**`],
      `Speed ratio ${p}:${q} means time ratio ${q}:${p}. The ${q - p} extra parts equal ${e} min, so one part is ${R(e / (q - p))} min.`,
      `Slower speed means MORE time, in the inverse ratio. The delay is the difference between the two times, not either time.`));
  }) });

  /* ---------------------------------------------------------------- 2. average speed */
  QB.gen("quant/tsd/average-speed", { title: "Average speed (equal distances)", gen: wrap((rng, d) => {
    const nm = T(rng, NAMES), veh = T(rng, VEH), [c1, c2] = two(rng);
    const SP = [10, 12, 15, 16, 18, 20, 24, 25, 30, 32, 36, 40, 45, 48, 50, 54, 60, 64, 72, 75, 80, 90];
    if (d === "Easy") {
      const a = T(rng, SP), b = T(rng, SP);
      if (a === b) return null;
      const ans = 2 * a * b / (a + b);
      if (!I(ans)) return null;
      return mk(rng, KMH, ans, [
        [(a + b) / 2, "Took the simple average of the two speeds"],
        [a * b / (a + b), "Forgot the factor 2 in 2ab/(a+b)"],
        [Math.abs(a - b), "Subtracted the speeds"],
        [(a + b) / 2 + 2, "Adjusted the simple average by guesswork"],
      ], finish(d, `${nm} drives from ${c1} to ${c2} at **${a} km/h** and returns along the same road at **${b} km/h**. What is the average speed for the whole trip?`,
        [`For equal distances, average = 2ab/(a+b)`, `= 2 × ${a} × ${b}/(${a} + ${b}) = **${KMH(ans)}**`],
        `Harmonic mean: 2 × ${a} × ${b} ÷ ${a + b} = ${N(ans)}.`, `Average of the speeds (${N((a + b) / 2)}) is wrong because more time is spent at the slower speed.`));
    }
    if (d === "Medium") {
      const t = rng.int(0, 1);
      if (t === 0) {
        const a = T(rng, SP), b = T(rng, SP), c = T(rng, SP);
        if (a === b || b === c || a === c) return null;
        const ans = 3 / (1 / a + 1 / b + 1 / c);
        return mk(rng, KMH, ans, [
          [(a + b + c) / 3, "Took the simple average of three speeds"],
          [3 * a * b * c / (a + b + c), "Used the wrong combination of the speeds"],
          [2 * a * c / (a + c), "Used only the first and last speeds"],
          [a * b * c / (a * b + b * c + c * a), "Forgot the factor 3 in the numerator"],
        ], finish(d, `A ${veh} covers three equal stretches of a highway at **${a}**, **${b}** and **${c} km/h** respectively. Find its average speed over the whole distance.`,
          [`Let each stretch be D. Total distance = 3D`, `Total time = D(1/${a} + 1/${b} + 1/${c})`, `Average = 3 ÷ (1/${a} + 1/${b} + 1/${c}) = **${KMH(R(ans))}**`],
          `Use the LCM ${lcm(lcm(a, b), c)} as D: times are ${lcm(lcm(a, b), c) / a}, ${lcm(lcm(a, b), c) / b}, ${lcm(lcm(a, b), c) / c}; speed = 3D ÷ total time.`,
          `Equal distances: average speed = total distance ÷ total time, never the mean of speeds.`));
      }
      const a = T(rng, SP), D = rng.int(2, 20) * 20, b = T(rng, SP), x = D / 2;
      if (a === b) return null;
      const ans = 2 * a * b / (a + b);
      if (!C(ans)) return null;
      return mk(rng, KMH, ans, [
        [(a + b) / 2, "Took the simple average"],
        [D / (D / a + D / b), "Treated the full distance as covered at each speed"],
        [Math.sqrt(a * b), "Used the geometric mean"],
        [2 * a * b / (a + b) + 1, "Rounded the correct value"],
      ], finish(d, `A train journey of **${D} km** has the first half at **${a} km/h** and the second half at **${b} km/h**. What is the average speed for the journey?`,
        [`Time = ${x}/${a} + ${x}/${b} = ${N(R(x / a))} + ${N(R(x / b))} = ${N(R(x / a + x / b))} h`, `Average = ${D} ÷ ${N(R(x / a + x / b))} = **${KMH(R(ans))}**`],
        `Equal halves: 2ab ÷ (a + b). The ${D} km is not needed.`, `The distance cancels out; do not average the two speeds.`));
    }
    const t = rng.int(0, 1);
    if (t === 0) {
      const a = T(rng, SP), b = T(rng, SP);
      if (a === b) return null;
      const avg = 2 * a * b / (a + b);
      if (!I(avg) || avg <= a / 2 + 0.5) return null;
      return mk(rng, KMH, b, [
        [2 * avg - a, "Treated the average as the mean of the two speeds"],
        [avg * a / (a - avg) > 0 ? avg * a / (a - avg) : 0, "Used the wrong sign in the harmonic relation"],
        [avg + a, "Added the average and the first speed"],
        [a * avg / (2 * a - avg) + 0 === b ? 0 : (a + avg) / 2, "Averaged the given numbers"],
      ], finish(d, `${nm} travels from ${c1} to ${c2} at **${a} km/h** and returns at a different speed. The average speed for the round trip is **${avg} km/h**. What was the return speed?`,
        [`2ab/(a+b) = avg gives 1/a + 1/b = 2/avg`, `1/b = 2/${avg} − 1/${a}`, `b = ${avg} × ${a} ÷ (2 × ${a} − ${avg}) = **${KMH(b)}**`],
        `Return speed = a × avg ÷ (2a − avg) = ${a} × ${avg} ÷ ${2 * a - avg}.`, `Do not use the arithmetic mean to reverse the problem: 2 × avg − a is wrong.`));
    }
    const a = T(rng, SP), b = T(rng, SP), c = T(rng, SP), tt = rng.int(2, 6);
    if (a === b || b === c || a === c) return null;
    // equal time vs equal distance
    const ans = (a + b + c) / 3;
    if (!C(ans)) return null;
    const alt = 3 / (1 / a + 1 / b + 1 / c);
    return mk(rng, KMH, ans, [
      [alt, "Used the equal-distance formula, but the times are equal"],
      [(a + b) / 2, "Dropped the third speed"],
      [a + b + c, "Added the speeds without dividing"],
      [Math.max(a, b, c) - (Math.max(a, b, c) - Math.min(a, b, c)) / 3, "Guessed from the extremes"],
    ], finish(d, `A cyclist rides for **${tt} hours** at **${a} km/h**, then **${tt} hours** at **${b} km/h**, then **${tt} hours** at **${c} km/h**. What is the average speed over the ${3 * tt} hours?`,
      [`Distances: ${a * tt}, ${b * tt}, ${c * tt} km; total = ${(a + b + c) * tt} km`, `Total time = ${3 * tt} h`, `Average = ${(a + b + c) * tt}/${3 * tt} = **${KMH(R(ans))}**`],
      `Equal TIMES: the average speed is just the plain mean of the speeds.`, `Equal times use the simple mean; equal distances use the harmonic mean. Check which is given.`));
  }) });

  /* ---------------------------------------------------------------- 3. late / early at two speeds */
  QB.gen("quant/tsd/late-early-at-two-speeds", { title: "Late / early at two speeds", gen: wrap((rng, d) => {
    const nm = T(rng, NAMES), veh = T(rng, VEH), place = T(rng, ["office", "college", "station", "airport", "the market", "school", "the factory"]);
    const SP = [3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 25, 30, 32, 36, 40, 45, 48, 50, 60];
    const s1 = T(rng, SP), s2 = T(rng, SP);
    if (s2 <= s1) return null;
    const D = rng.int(1, 40) * (s1 <= 6 ? 1 : 2);
    const tot0 = D * (1 / s1 - 1 / s2) * 60;                  // minutes between the two journeys
    const tot = Math.round(tot0);
    if (Math.abs(tot0 - tot) > 1e-9 || tot < 4 || tot > 90) return null;
    const sched = D / s2 * 60 + 0;                              // time at faster speed (minutes)
    if (d === "Easy") {
      const t2 = rng.int(1, Math.floor(tot) - 1), t1 = tot - t2;
      if (t1 < 1) return null;
      return mk(rng, KM, D, [
        [D * (s1 + s2) / (s1 * s2) * 10, "Mis-scaled the combined time"],
        [(s1 * s2 / (s2 - s1)) * tot / 100, "Divided by 100 instead of 60"],
        [(s1 * s2 / (s2 - s1)) * tot, "Forgot to convert minutes into hours"],
        [(s1 * s2 / (s1 + s2)) * tot / 60, "Added the speeds instead of subtracting them"],
      ], finish(d, `${nm} goes to ${place} on a ${veh}. At **${s1} km/h** ${nm} is **${t1} min late**, and at **${s2} km/h** ${nm} is **${t2} min early**. What is the distance to ${place}?`,
        [`Total time difference = ${t1} + ${t2} = ${tot} min = ${N(R(tot / 60))} h`, `D/${s1} − D/${s2} = ${N(R(tot / 60))}`, `D × ${s2 - s1}/${s1 * s2} = ${N(R(tot / 60))}`, `D = **${KM(D)}**`],
        `Distance = (s1 × s2 ÷ (s2 − s1)) × total gap in hours = ${s1 * s2}/${s2 - s1} × ${N(R(tot / 60))} = ${N(D)}.`,
        `Late and early ADD to give the total time gap: the two cases are on opposite sides of the schedule.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      if (k === 0) {                       // late at s1, on time at s2
        const t1 = tot;
        return mk(rng, KM, D, [
          [(s1 * s2 / (s2 - s1)) * tot, "Forgot to convert minutes into hours"],
          [(s1 * s2 / (s1 + s2)) * tot / 60, "Added the speeds instead of subtracting them"],
          [D * 2, "Doubled the answer"],
          [(s1 * s2 / (s2 - s1)) * tot / 100, "Divided by 100 instead of 60"],
        ], finish(d, `${nm} walks to ${place} at **${s1} km/h** and reaches **${t1} minutes late**. Walking at **${s2} km/h** ${nm} reaches exactly on time. How far is ${place}?`,
          [`Extra time at ${s1} km/h = ${t1} min = ${N(R(t1 / 60))} h`, `D/${s1} − D/${s2} = ${N(R(t1 / 60))}`, `D = **${KM(D)}**`],
          `D = (${s1} × ${s2} ÷ ${s2 - s1}) × ${N(R(t1 / 60))}.`,
          `On time at the faster speed means the whole gap is the lateness at the slower speed.`));
      }
      const ontime = D / s2 * 60 + 0;       // minutes at the faster speed
      return mk(rng, MIN, D / s1 * 60, [
        [D / s2 * 60, "Gave the time at the faster speed"],
        [D / s1, "Left the time in hours"],
        [D / s1 * 60 - tot, "Subtracted the time gap from the slow time"],
        [D / s1 * 60 + tot, "Added the gap on top of the slow time"],
      ], finish(d, `A ${veh} covers the distance to ${place} at **${s1} km/h**. If it travelled at **${s2} km/h**, it would arrive **${N(tot)} minutes** earlier. How long does the journey take at ${s1} km/h?`,
        [`Distance D: D/${s1} − D/${s2} = ${N(tot)}/60`, `D = ${N(D)} km`, `Time at ${s1} km/h = ${N(D)}/${s1} h = **${MIN(R(D / s1 * 60))}**`],
        `First find D = ${s1} × ${s2} ÷ (${s2} − ${s1}) × ${N(tot)}/60 = ${N(D)}, then D ÷ ${s1} × 60.`,
        `The ${N(tot)} minutes is the DIFFERENCE between the two times, not the time itself.`));
    }
    const k = rng.int(0, 1);
    if (k === 0) {                         // speed needed to be on time, late at s1, early at s2
      const t2 = rng.int(1, Math.floor(tot) - 1), t1 = tot - t2;
      const planned = D / s1 - t1 / 60;      // hours scheduled
      if (planned <= 0) return null;
      const need = D / planned;
      return mk(rng, KMH, need, [
        [(s1 + s2) / 2, "Averaged the two speeds"],
        [D / (D / s1 + t1 / 60), "Added the delay instead of removing it"],
        [Math.sqrt(s1 * s2), "Used the geometric mean"],
        [2 * s1 * s2 / (s1 + s2), "Used the harmonic mean of the two speeds"],
      ], finish(d, `A ${veh} reaches ${place} **${t1} minutes late** at **${s1} km/h** and **${t2} minutes early** at **${s2} km/h**. At what speed must it travel to arrive exactly on time?`,
        [`Gap = ${t1} + ${t2} = ${N(tot)} min = ${N(R(tot / 60))} h`, `D = ${s1} × ${s2}/${s2 - s1} × ${N(R(tot / 60))} = ${N(D)} km`, `Scheduled time = ${N(D)}/${s1} − ${t1}/60 = ${N(R(planned))} h`, `Speed = ${N(D)} ÷ ${N(R(planned))} = **${KMH(R(need))}**`],
        `Find D, then the scheduled time, then D ÷ scheduled time.`,
        `The on-time speed is not an average of the two speeds; compute it from D and the scheduled time.`));
    }
    const t2 = rng.int(1, Math.floor(tot) - 1), t1 = tot - t2;
    const planned = D / s1 - t1 / 60;
    if (planned <= 0) return null;
    return mk(rng, (x) => N(x) + " hours", planned, [
      [D / s1, "Gave the time at the slower speed"],
      [D / s2, "Gave the time at the faster speed"],
      [D / s1 + t1 / 60, "Added the lateness instead of subtracting it"],
      [(D / s1 + D / s2) / 2, "Averaged the two journey times"],
    ], finish(d, `${nm} leaves home for ${place} on a ${veh}. Going at **${s1} km/h** gets there **${t1} minutes late**; going at **${s2} km/h** gets there **${t2} minutes early**. What is the scheduled travel time, in hours?`,
      [`Gap = ${t1} + ${t2} = ${N(tot)} min = ${N(R(tot / 60))} h`, `D = ${s1} × ${s2}/${s2 - s1} × ${N(R(tot / 60))} = ${N(D)} km`, `Scheduled time = ${N(D)}/${s1} − ${t1}/60 = **${N(R(planned))} hours**`],
      `D first. Then scheduled time = D/${s1} − late time (or D/${s2} + early time).`,
      `Being late means the actual time is MORE than scheduled, so subtract the lateness from the slow journey.`));
  }) });

  /* ---------------------------------------------------------------- 4. relative speed */
  QB.gen("quant/tsd/relative-speed", { title: "Relative speed", gen: wrap((rng, d) => {
    const [n1, n2] = pair(rng), [c1, c2] = two(rng), veh = T(rng, VEH), veh2 = T(rng, VEH);
    if (d === "Easy") {
      const a = rng.int(2, 16) * 5, b = rng.int(2, 16) * 5, t = rng.int(2, 8);
      if (rng.chance(0.5)) {
        const D = (a + b) * t;
        return mk(rng, (x) => N(x) + " hours", t, [
          [D / (a * b / (a + b)), "Used a wrong combined speed"],
          [D / Math.abs(a - b) > 0 && a !== b ? D / Math.abs(a - b) : 0, "Subtracted the speeds, as if they travelled the same way"],
          [D / a, "Used only the first speed"],
          [D / (a + b) * 2, "Doubled the meeting time"],
        ], finish(d, `${c1} and ${c2} are **${N(D)} km** apart. A ${veh} leaves ${c1} at **${a} km/h** and another ${veh2} leaves ${c2} at **${b} km/h** at the same time, heading towards each other. After how many hours do they meet?`,
          [`They approach each other, so relative speed = ${a} + ${b} = ${a + b} km/h`, `Time = ${N(D)}/${a + b} = **${N(t)} hours**`],
          `Opposite directions: add the speeds, then distance ÷ relative speed.`, `Towards each other means ADD; the same direction means subtract.`));
      }
      if (a === b) return null;
      const hi = Math.max(a, b), lo = Math.min(a, b), D = (hi - lo) * t;
      return mk(rng, (x) => N(x) + " hours", t, [
        [D / (hi + lo), "Added the speeds although they move the same way"],
        [D / hi, "Used only the faster speed"],
        [D / lo, "Used only the slower speed"],
        [D / (hi - lo) * 2, "Doubled the catch-up time"],
      ], finish(d, `${n1} is **${N(D)} km** behind ${n2} on the same road. ${n1} rides at **${hi} km/h** and ${n2} at **${lo} km/h**, both in the same direction. In how many hours does ${n1} catch up with ${n2}?`,
        [`Same direction: relative speed = ${hi} − ${lo} = ${hi - lo} km/h`, `Time = ${N(D)}/${hi - lo} = **${N(t)} hours**`],
        `Gap ÷ (difference of speeds).`, `Same direction: subtract the speeds.`));
    }
    if (d === "Medium") {
      const a = rng.int(3, 24) * 5, b = rng.int(3, 24) * 5, t = T(rng, [1.5, 2, 2.5, 3, 4, 4.5, 5, 6]);
      if (a === b) return null;
      const k = rng.int(0, 1);
      if (k === 0) {
        const dist = (a + b) * t;
        return mk(rng, KM, dist, [
          [Math.abs(a - b) * t, "Subtracted the speeds although they move apart in opposite directions"],
          [a * t, "Counted only one vehicle"],
          [(a + b) * t / 2, "Halved the total"],
          [(a + b) + t, "Added speeds and time"],
        ], finish(d, `Two cars start from the same point at the same time and move in **opposite directions** at **${a} km/h** and **${b} km/h**. How far apart are they after **${N(t)} hours**?`,
          [`Opposite directions: they separate at ${a} + ${b} = ${a + b} km/h`, `Distance = ${a + b} × ${N(t)} = **${KM(R(dist))}**`],
          `Relative speed × time.`, `Opposite directions: add the speeds.`));
      }
      const dist = Math.abs(a - b) * t;
      return mk(rng, KM, dist, [
        [(a + b) * t, "Added the speeds although they move in the same direction"],
        [a * t, "Counted only the first vehicle"],
        [b * t, "Counted only the second vehicle"],
        [Math.abs(a - b) * t * 2, "Doubled the answer"],
      ], finish(d, `${n1} and ${n2} leave the same bus stop together and travel along the same road in the **same direction** at **${Math.max(a, b)} km/h** and **${Math.min(a, b)} km/h**. How far apart are they after **${N(t)} hours**?`,
        [`Same direction: gap grows at ${Math.max(a, b)} − ${Math.min(a, b)} = ${Math.abs(a - b)} km/h`, `Distance = ${Math.abs(a - b)} × ${N(t)} = **${KM(R(dist))}**`],
        `Difference of speeds × time.`, `Same direction: subtract the speeds.`));
    }
    const k = rng.int(0, 1);
    if (k === 0) {                         // after meeting
      const [x, y] = T(rng, [[4, 9], [9, 16], [4, 25], [9, 25], [16, 25], [4, 16], [1, 4], [1, 9], [16, 36], [25, 36], [9, 4], [16, 9], [25, 16]]);
      const sb = rng.int(2, 14) * 5, va = sb * Math.sqrt(y) / Math.sqrt(x);
      if (!C(va)) return null;
      return mk(rng, KMH, va, [
        [sb * y / x, "Used the ratio of times instead of its square root"],
        [sb * x / y, "Inverted the ratio of times"],
        [sb * Math.sqrt(x) / Math.sqrt(y), "Inverted the square-root ratio"],
        [sb + (y - x), "Added the time difference to B's speed"],
      ], finish(d, `${n1} leaves ${c1} for ${c2} and ${n2} leaves ${c2} for ${c1} at the same moment, on the same road. After they meet, ${n1} takes **${y} hours** to reach ${c2} and ${n2} takes **${x} hours** to reach ${c1}. If ${n2} travels at **${sb} km/h**, what is ${n1}'s speed?`,
        [`After meeting: (speed of ${n1}) : (speed of ${n2}) = √(${y}) : √(${x})`, `= ${N(Math.sqrt(y))} : ${N(Math.sqrt(x))}`, `${n1}'s speed = ${sb} × ${N(Math.sqrt(y))}/${N(Math.sqrt(x))} = **${KMH(R(va))}**`],
        `Speeds are in the ratio √(time of the other) : √(own time after meeting).`, `The ratio of speeds is the SQUARE ROOT of the inverse ratio of the post-meeting times.`));
    }
    const a = rng.int(2, 16) * 5, b = rng.int(2, 16) * 5, t = rng.int(2, 6), gap = (a + b) * t;
    const m = a * t, ex = rng.int(1, 3) * 10;
    if (a === b) return null;
    // moving towards, after meeting continue; distance apart T hours later
    const t2 = t + rng.int(1, 3), apart = (a + b) * t2 - gap;
    return mk(rng, KM, apart, [
      [(a + b) * t2, "Ignored the initial distance"],
      [gap - (a + b) * t2 > 0 ? gap - (a + b) * t2 : 0, "Subtracted in the wrong order"],
      [(a + b) * (t2 - t), "Counted only the time after the meeting but with a wrong start"],
      [Math.abs(a - b) * t2, "Subtracted the speeds"],
    ], finish(d, `${n1} and ${n2} start from towns **${N(gap)} km** apart and drive towards each other at **${a}** and **${b} km/h**. They pass each other and keep going. How far apart will they be **${t2} hours** after starting?`,
      [`Closing speed = ${a} + ${b} = ${a + b} km/h`, `In ${t2} hours they have covered ${a + b} × ${t2} = ${(a + b) * t2} km`, `Distance past each other = ${(a + b) * t2} − ${N(gap)} = **${KM(apart)}**`],
      `Relative distance covered minus the original gap = distance between them after crossing.`, `After the cars pass each other the gap starts to open again; do not stop at the meeting.`));
  }) });

  /* ---------------------------------------------------------------- 5. trains: pole / man */
  QB.gen("quant/tsd/trains-pole-man", { title: "Trains: pole / man", gen: wrap((rng, d) => {
    const tr = T(rng, TRN), post = T(rng, ["a telegraph pole", "a signal post", "a lamp post", "a standing man", "a tree beside the track", "a kilometre stone"]);
    if (d === "Easy") {
      const v = T(rng, [36, 54, 72, 90, 108, 126, 144]), m = c5(v), t = rng.int(3, 20), L = m * t, k = rng.int(0, 2);
      if (k === 0) return mk(rng, MT, L, [
        [v * t, "Forgot to convert km/h into m/s"],
        [c18(v) * t, "Converted with 18/5 instead of 5/18"],
        [m + t, "Added speed and time"],
        [L / 2, "Halved the length"],
      ], finish(d, `${tr} running at **${v} km/h** crosses ${post} in **${t} seconds**. What is the length of the train?`,
        [`Speed = ${v} × 5/18 = ${N(m)} m/s`, `Length = speed × time = ${N(m)} × ${t} = **${MT(L)}**`],
        `Length = speed (m/s) × time (s).`, `Convert km/h to m/s first.`));
      if (k === 1) return mk(rng, SEC, t, [
        [L / v, "Divided by the speed in km/h without converting"],
        [L / c18(v), "Converted with 18/5 instead of 5/18"],
        [t * 2, "Doubled the time"],
        [L / (m * 2), "Used half the speed"],
      ], finish(d, `A **${N(L)} m** long train moves at **${v} km/h**. How many seconds does it take to cross ${post}?`,
        [`Speed = ${v} × 5/18 = ${N(m)} m/s`, `Time = length/speed = ${N(L)}/${N(m)} = **${SEC(t)}**`],
        `Time = length ÷ speed in m/s.`, `Time and distance must be in matching units (m and m/s).`));
      return mk(rng, KMH, v, [
        [L / t, "Left the speed in m/s"],
        [L / t * 5 / 18, "Used 5/18 instead of 18/5"],
        [L / t * 3, "Used 3 instead of 3.6"],
        [L / t * 4, "Used 4 instead of 3.6"],
      ], finish(d, `${tr} of length **${N(L)} m** passes ${post} in **${t} seconds**. Find its speed in km/h.`,
        [`Speed = ${N(L)}/${t} = ${N(m)} m/s`, `In km/h: ${N(m)} × 18/5 = **${KMH(v)}**`],
        `Length ÷ time, then × 3.6.`, `The answer asked is in km/h; m/s is only the first step.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      if (k === 0) {
        const v = rng.int(8, 28) * 5, t = rng.int(3, 30), L = v * 5 * t / 18;
        if (!I(L)) return null;
        return mk(rng, MT, L, [
          [v * t, "Forgot to convert km/h into m/s"],
          [v * t * 18 / 5, "Converted with 18/5 instead of 5/18"],
          [v * t / 6, "Divided by 6 instead of 3.6"],
          [v * t / 3, "Divided by 3 instead of 3.6"],
        ], finish(d, `${tr} moving at **${v} km/h** takes **${t} seconds** to pass ${post}. Find the length of the train in metres.`,
          [`${v} km/h = ${v} × 5/18 = ${N(R(c5(v)))} m/s`, `Length = ${N(R(c5(v)))} × ${t} = **${MT(L)}**`],
          `Length = v × 5/18 × t = ${v} × 5 × ${t} ÷ 18.`, `Convert before multiplying.`));
      }
      const L = rng.int(4, 40) * 10, t = rng.int(4, 30), v = c18(L / t);
      return mk(rng, KMH, v, [
        [L / t, "Left the speed in m/s"],
        [L / t * 5 / 18, "Used 5/18 instead of 18/5"],
        [L / t * 3, "Used 3 instead of 3.6"],
        [L * t * 18 / 5 / 100, "Multiplied length and time"],
      ], finish(d, `${tr} of length **${N(L)} m** crosses ${post} in **${t} seconds**. What is its speed in km/h?`,
        [`Speed = ${N(L)}/${t} = ${N(R(L / t))} m/s`, `× 18/5 = **${KMH(R(v))}**`],
        `Length ÷ time × 3.6.`, `Convert the final speed to km/h.`));
    }
    const k = rng.int(0, 2);
    const [n1, n2] = pair(rng);
    if (k === 0) {
      const m1 = rng.int(8, 30), m2 = rng.int(8, 30), t1 = rng.int(6, 20), t2 = rng.int(6, 20), L1 = m1 * t1, L2 = m2 * t2;
      if (m1 === m2) return null;
      const diff = c18(Math.abs(m1 - m2));
      return mk(rng, KMH, diff, [
        [Math.abs(m1 - m2), "Gave the difference in m/s"],
        [c18(m1 + m2), "Added the two speeds"],
        [Math.abs(m1 - m2) * 3, "Used 3 instead of 3.6"],
        [c5(Math.abs(m1 - m2)), "Used 5/18 instead of 18/5"],
      ], finish(d, `Train P of length **${N(L1)} m** crosses a pole in **${t1} s**, and train Q of length **${N(L2)} m** crosses the same pole in **${t2} s**. By how many km/h is the faster train quicker than the slower?`,
        [`P: ${N(L1)}/${t1} = ${N(m1)} m/s`, `Q: ${N(L2)}/${t2} = ${N(m2)} m/s`, `Difference = ${N(Math.abs(m1 - m2))} m/s = ${N(Math.abs(m1 - m2))} × 18/5 = **${KMH(R(diff))}**`],
        `Speeds in m/s first (length ÷ time), subtract, then × 3.6.`, `Convert at the end; both speeds are already in the same unit so subtract directly.`));
    }
    if (k === 1) {
      const m = rng.int(8, 30), t = rng.int(8, 24), L = m * t, t2 = rng.int(4, t - 1);
      const v2 = c18(L / t2);
      return mk(rng, KMH, v2, [
        [c18(m), "Gave the original speed"],
        [L / t2, "Left the speed in m/s"],
        [c18(m) * t / t2 + 5, "Added a guessed correction"],
        [c18(m) * (t - t2), "Multiplied by the time saved"],
      ], finish(d, `${tr} **${N(L)} m** long crosses ${post} in **${t} seconds**. At what speed in km/h must it run to cross it in **${t2} seconds**?`,
        [`Required speed = ${N(L)}/${t2} = ${N(R(L / t2))} m/s`, `In km/h = ${N(R(L / t2))} × 18/5 = **${KMH(R(v2))}**`],
        `Length ÷ new time × 3.6. (Speed × time is constant for a fixed length.)`, `The length stays the same; only the time and speed change, inversely.`));
    }
    const v = T(rng, [36, 54, 72, 90, 108]), t = rng.int(4, 20), x = T(rng, [20, 25, 50, 75, 100]);
    const t2 = t * 100 / (100 + x);
    return mk(rng, SEC, t2, [
      [t * (100 - x) / 100, `Reduced the time by ${x}% instead of dividing by ${(100 + x) / 100}`],
      [t * (100 + x) / 100, "Increased the time"],
      [t - x * t / 100 / 2, "Used half the percentage"],
      [t / 2, "Halved the time"],
    ], finish(d, `${tr} running at **${v} km/h** crosses ${post} in **${t} seconds**. If its speed were **${x}% higher**, how many seconds would it take?`,
      [`Time is inversely proportional to speed`, `New time = ${t} × 100/${100 + x} = **${SEC(R(t2))}**`],
      `Speed up by ${x}% → multiply time by 100/${100 + x}.`, `A ${x}% speed rise does not mean a ${x}% fall in time.`));
  }) });

  /* ---------------------------------------------------------------- 6. trains: platform / bridge */
  QB.gen("quant/tsd/trains-platform-bridge", { title: "Trains: platform / bridge", gen: wrap((rng, d) => {
    const tr = T(rng, TRN), obj = T(rng, ["platform", "bridge", "tunnel", "flyover"]), st = T(rng, CITY);
    if (d === "Easy") {
      const v = T(rng, [36, 54, 72, 90, 108, 126, 144]), m = c5(v), t = rng.int(8, 40), tot = m * t;
      const L = rng.int(2, Math.floor(tot / 10) - 1) * 10, P = tot - L;
      if (P < 20) return null;
      return mk(rng, SEC, t, [
        [L / m, "Counted only the train's own length"],
        [P / m, `Counted only the length of the ${obj}`],
        [tot / v, "Divided by the speed in km/h without converting"],
        [tot / c18(v), "Converted with 18/5 instead of 5/18"],
      ], finish(d, `${tr} **${N(L)} m** long runs at **${v} km/h**. How many seconds does it take to completely cross a **${N(P)} m** ${obj} at ${st}?`,
        [`Distance to cover = ${N(L)} + ${N(P)} = ${N(tot)} m`, `Speed = ${v} × 5/18 = ${N(m)} m/s`, `Time = ${N(tot)}/${N(m)} = **${SEC(t)}**`],
        `Time = (train + ${obj}) ÷ speed in m/s.`, `To cross a ${obj}, the train must travel its own length PLUS the length of the ${obj}.`));
    }
    if (d === "Medium") {
      const m = rng.int(8, 30), t1 = rng.int(6, 20), dt = rng.int(4, 20), L = m * t1, P = m * dt, t2 = t1 + dt;
      const k = rng.int(0, 2);
      if (k === 0) return mk(rng, MT, L, [
        [P, "Gave the platform length"],
        [L + P, "Gave the train plus platform"],
        [P * t2 / t1, "Mixed up the ratio of the times"],
        [P * t1 / t2, "Used t1/t2 in place of t1/(t2−t1)"],
      ], finish(d, `${tr} crosses a pole in **${t1} seconds** and a **${N(P)} m** ${obj} in **${t2} seconds**. Find the length of the train.`,
        [`Extra ${t2 - t1} s is the time to cover the ${obj} (${N(P)} m), so speed = ${N(P)}/${t2 - t1} = ${N(m)} m/s`, `Length = ${N(m)} × ${t1} = **${MT(L)}**`],
        `Length : ${obj} = t1 : (t2 − t1) = ${t1} : ${t2 - t1}.`, `The ${t2 - t1} extra seconds belong to the ${obj} only.`));
      if (k === 1) return mk(rng, KMH, c18(m), [
        [m, "Left the speed in m/s"],
        [c18(L / t2), "Used the train length only over the full time"],
        [c18((L + P) / t1), "Used the total length with the pole time"],
        [c5(m), "Used 5/18 instead of 18/5"],
      ], finish(d, `${tr} crosses a pole in **${t1} seconds** and a **${N(P)} m** ${obj} in **${t2} seconds**. What is its speed in km/h?`,
        [`Extra time = ${t2} − ${t1} = ${t2 - t1} s for ${N(P)} m`, `Speed = ${N(P)}/${t2 - t1} = ${N(m)} m/s = ${N(m)} × 18/5 = **${KMH(R(c18(m)))}**`],
        `Speed = ${obj} length ÷ (difference of times); then × 3.6.`, `Use the difference of the two times, not either time on its own.`));
      return mk(rng, MT, P, [
        [L, "Gave the train length"],
        [L + P, "Gave the total distance"],
        [P - L > 0 ? P - L : P + L, "Subtracted instead of using the speed"],
        [m * t2, "Gave the total distance covered, including the train"],
      ], finish(d, `${tr} **${N(L)} m** long passes a pole in **${t1} seconds** and takes **${t2} seconds** to cross a ${obj}. How long is the ${obj}?`,
        [`Speed = ${N(L)}/${t1} = ${N(m)} m/s`, `Distance in ${t2} s = ${N(m)} × ${t2} = ${N(m * t2)} m`, `${obj[0].toUpperCase() + obj.slice(1)} = ${N(m * t2)} − ${N(L)} = **${MT(P)}**`],
        `Total distance = speed × time; subtract the train's own length.`, `The total distance includes the train; subtract it to get the ${obj}.`));
    }
    const k = rng.int(0, 2);
    if (k === 0) {                         // two bridges
      const m = rng.int(8, 30), L = m * rng.int(5, 20), P1 = rng.int(3, 20) * 10, dP = m * rng.int(3, 15), P2 = P1 + dP;
      const t1 = (L + P1) / m, t2 = (L + P2) / m;
      if (!I(t1) || !I(t2)) return null;
      return mk(rng, KMH, c18(m), [
        [m, "Left the speed in m/s"],
        [c18((L + P1) / t1 * 0 + dP / (t2 + t1)), "Divided by the sum of times"],
        [c18(P2 / t2), "Ignored the train length"],
        [c18(P1 / t1), "Ignored the train length and used the first time"],
      ], finish(d, `${tr} crosses a **${N(P1)} m** ${obj} in **${t1} seconds** and a **${N(P2)} m** ${obj} in **${t2} seconds**. What is its speed in km/h?`,
        [`Extra distance = ${N(P2)} − ${N(P1)} = ${N(dP)} m`, `Extra time = ${t2} − ${t1} = ${t2 - t1} s`, `Speed = ${N(dP)}/${t2 - t1} = ${N(m)} m/s = **${KMH(R(c18(m)))}**`],
        `Speed = difference of lengths ÷ difference of times; the train length cancels.`, `The train's own length is the same in both, so it drops out of the difference.`));
    }
    if (k === 1) {                         // tunnel: entry to exit t1, fully inside t2
      const m = rng.int(8, 25), t1 = rng.int(15, 40), t2 = rng.int(4, t1 - 4);
      const L = m * (t1 - t2) / 2, Tn = m * (t1 + t2) / 2;
      if (!I(L) || !I(Tn) || L < 40) return null;
      return mk(rng, MT, L, [
        [Tn, "Gave the tunnel length"],
        [m * t2, "Used the inside time as the train's length"],
        [m * t1, "Took the whole crossing distance as the length"],
        [m * (t1 - t2), "Forgot to halve the difference"],
      ], finish(d, `${tr} moving at **${N(m)} m/s** takes **${t1} seconds** to cross a tunnel from the moment its engine enters to the moment its last coach leaves. It is **completely inside** the tunnel for **${t2} seconds**. Find the length of the train.`,
        [`Crossing: train + tunnel = ${N(m)} × ${t1} = ${N(m * t1)} m`, `Fully inside: tunnel − train = ${N(m)} × ${t2} = ${N(m * t2)} m`, `Subtract: 2 × train = ${N(m * (t1 - t2))} m, so train = **${MT(L)}**`],
        `Train = speed × (t1 − t2) ÷ 2 and tunnel = speed × (t1 + t2) ÷ 2.`, `Being fully inside covers only (tunnel − train); crossing covers (tunnel + train).`));
    }
    const m = rng.int(8, 28), L = m * rng.int(4, 14), P = m * rng.int(3, 15), v = c18(m), t = (L + P) / m, mn = rng.int(1, 3) * 2;
    if (!I(t)) return null;
    // a man in the train / different speed
    const tt = t, spd = v;
    return mk(rng, SEC, (L + P) / (m * (100 + mn * 10) / 100), [
      [t, "Used the original speed"],
      [t * (100 + mn * 10) / 100, `Increased the time when speed rose`],
      [t - mn * 10 / 100 * t, `Reduced the time by ${mn * 10}% instead of dividing`],
      [L / (m * (100 + mn * 10) / 100), "Counted only the train's length"],
    ].filter((w) => w[0] > 0), finish(d, `${tr} **${N(L)} m** long crosses a **${N(P)} m** ${obj} at **${N(R(spd))} km/h**. How many seconds will it take if its speed rises by **${mn * 10}%**?`,
      [`Distance = ${N(L)} + ${N(P)} = ${N(L + P)} m`, `New speed = ${N(R(m * (100 + mn * 10) / 100))} m/s`, `Time = ${N(L + P)}/${N(R(m * (100 + mn * 10) / 100))} = **${SEC(R((L + P) / (m * (100 + mn * 10) / 100)))}**`],
      `Old time × 100/${100 + mn * 10}.`, `The distance is train + ${obj} and does not change when the speed does.`));
  }) });

  /* ---------------------------------------------------------------- 7. trains: two trains */
  QB.gen("quant/tsd/trains-two-trains", { title: "Trains: two trains", gen: wrap((rng, d) => {
    const n1 = T(rng, ["Train A", "The Shatabdi", "The Duronto", "The Intercity", "The Garib Rath"]), n2 = T(rng, ["Train B", "A goods train", "A local", "The Mail", "A freight train"]);
    if (d === "Easy") {
      const v1 = rng.int(4, 14) * 6, v2 = rng.int(4, 14) * 6, L1 = rng.int(4, 30) * 10, L2 = rng.int(4, 30) * 10;
      const opp = rng.chance(0.55), rel = opp ? v1 + v2 : Math.abs(v1 - v2);
      if (!opp && v1 === v2) return null;
      const m = c5(rel), t = (L1 + L2) / m;
      if (!I(t)) return null;
      return mk(rng, SEC, t, [
        [(L1 + L2) / (opp ? Math.abs(v1 - v2) * 5 / 18 || 1 : (v1 + v2) * 5 / 18), opp ? "Subtracted the speeds although the trains move towards each other" : "Added the speeds although the trains move the same way"],
        [(L1 + L2) / rel, "Forgot to convert km/h into m/s"],
        [Math.max(L1, L2) / m, "Used only the longer train's length"],
        [(L1 + L2) / (c18(rel)), "Converted with 18/5 instead of 5/18"],
      ], finish(d, `Two trains of lengths **${N(L1)} m** and **${N(L2)} m** run ${opp ? "on parallel tracks in **opposite directions**" : "on parallel tracks in the **same direction**"} at **${v1} km/h** and **${v2} km/h**. How many seconds do they take to cross each other completely?`,
        [`Relative speed = ${opp ? `${v1} + ${v2}` : `|${v1} − ${v2}|`} = ${rel} km/h = ${N(R(m))} m/s`, `Distance = ${N(L1)} + ${N(L2)} = ${N(L1 + L2)} m`, `Time = ${N(L1 + L2)}/${N(R(m))} = **${SEC(t)}**`],
        `Sum of lengths ÷ relative speed (in m/s).`, `${opp ? "Opposite directions: add" : "Same direction: subtract"} the speeds; the distance is always the SUM of the lengths.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      if (k === 0) {
        const v1 = rng.int(4, 14) * 6, v2 = rng.int(2, 12) * 6, L1 = rng.int(4, 30) * 10, t = rng.int(4, 20), opp = rng.chance(0.5);
        const rel = opp ? v1 + v2 : v1 - v2;
        if (rel <= 0) return null;
        const L2 = c5(rel) * t - L1;
        if (!I(L2) || L2 < 30) return null;
        return mk(rng, MT, L2, [
          [c5(rel) * t, "Forgot to subtract the first train's length"],
          [(c5(opp ? Math.abs(v1 - v2) : v1 + v2) * t) - L1 > 0 ? c5(opp ? Math.abs(v1 - v2) : v1 + v2) * t - L1 : 0, opp ? "Subtracted the speeds although the trains move towards each other" : "Added the speeds although the trains move the same way"],
          [rel * t - L1, "Did not convert km/h to m/s"],
          [L1 + c5(rel) * t, "Added the first train's length instead of subtracting it"],
        ], finish(d, `${n1}, **${N(L1)} m** long, runs at **${v1} km/h** and ${n2} runs at **${v2} km/h** ${opp ? "in the opposite direction on the next track" : "in the same direction on the next track"}. They take **${t} seconds** to cross each other. Find the length of ${n2}.`,
          [`Relative speed = ${rel} km/h = ${N(R(c5(rel)))} m/s`, `Distance in ${t} s = ${N(R(c5(rel) * t))} m`, `Length of ${n2} = ${N(R(c5(rel) * t))} − ${N(L1)} = **${MT(L2)}**`],
          `Total distance = relative speed × time; subtract the known train.`, `The distance covered is the SUM of the two lengths, so subtract the known one.`));
      }
      const v1 = rng.int(6, 16) * 6, L1 = rng.int(4, 30) * 10, L2 = rng.int(4, 30) * 10, t = rng.int(4, 20);
      const rel = (L1 + L2) / t, v2 = c18(rel) - v1;
      if (!C(v2) || v2 <= 0) return null;
      return mk(rng, KMH, v2, [
        [c18(rel) + v1, "Added instead of subtracting the known speed"],
        [rel - v1, "Took the relative speed in m/s as km/h"],
        [c18(rel), "Gave the relative speed"],
        [Math.abs(v1 - c18(rel)) * 5 / 18, "Converted the answer back to m/s"],
      ], finish(d, `${n1} (**${N(L1)} m**, speed **${v1} km/h**) and ${n2} (**${N(L2)} m**) run in opposite directions and cross each other in **${t} seconds**. Find the speed of ${n2} in km/h.`,
        [`Relative speed = ${N(L1 + L2)}/${t} = ${N(R(rel))} m/s = ${N(R(c18(rel)))} km/h`, `Speed of ${n2} = ${N(R(c18(rel)))} − ${v1} = **${KMH(R(v2))}**`],
        `Relative speed = (sum of lengths) ÷ time; subtract ${n1}'s speed.`, `Opposite directions add, so the unknown speed is relative speed MINUS the known speed.`));
    }
    const k = rng.int(0, 1);
    if (k === 0) {                         // equal-length trains: pole times
      const t1 = rng.int(6, 30), t2 = rng.int(6, 30);
      if (t1 === t2) return null;
      const opp = rng.chance(0.6), ans = opp ? 2 * t1 * t2 / (t1 + t2) : 2 * t1 * t2 / Math.abs(t1 - t2);
      return mk(rng, SEC, ans, [
        [opp ? 2 * t1 * t2 / Math.abs(t1 - t2) : 2 * t1 * t2 / (t1 + t2), opp ? "Used the same-direction formula" : "Used the opposite-direction formula"],
        [(t1 + t2) / 2, "Took the average of the two times"],
        [t1 * t2 / (t1 + t2), "Forgot the factor 2"],
        [Math.abs(t1 - t2), "Subtracted the times"],
      ], finish(d, `Two trains of equal length take **${t1} s** and **${t2} s** respectively to pass a pole. In how many seconds will they cross each other if they run in ${opp ? "**opposite directions**" : "the **same direction**"}?`,
        [`Let the length be L. Speeds are L/${t1} and L/${t2}`, `Relative speed = ${opp ? "L/" + t1 + " + L/" + t2 : "|L/" + t1 + " − L/" + t2 + "|"}; distance = 2L`, `Time = 2 ÷ (${opp ? `1/${t1} + 1/${t2}` : `|1/${t1} − 1/${t2}|`}) = **${SEC(R(ans))}**`],
        `Equal lengths: ${opp ? "2 t1 t2 ÷ (t1 + t2)" : "2 t1 t2 ÷ (t2 − t1)"}.`, `The distance to cover is 2L (two lengths), not L.`));
    }
    const v1 = rng.int(6, 16) * 6, v2 = rng.int(6, 16) * 6, L1 = rng.int(4, 30) * 10, L2 = rng.int(4, 30) * 10;
    if (v1 === v2) return null;
    const rel = v1 + v2, t = (L1 + L2) / c5(rel), m = L2 / c5(rel);
    if (!C(m) || !I(t)) return null;
    return mk(rng, SEC, m, [
      [t, "Gave the time to cross completely"],
      [L1 / c5(rel), "Used the wrong train's length"],
      [L2 / c5(Math.abs(v1 - v2)), "Subtracted the speeds although they move towards each other"],
      [L2 / rel, "Forgot to convert km/h into m/s"],
    ], finish(d, `A passenger sits in a train running at **${v1} km/h**. A goods train **${N(L2)} m** long approaches from the opposite direction at **${v2} km/h** (the passenger's own train is ${N(L1)} m). How many seconds does the passenger see the goods train pass the window?`,
      [`Relative speed = ${v1} + ${v2} = ${rel} km/h = ${N(R(c5(rel)))} m/s`, `The passenger is a point, so only the goods train's length matters`, `Time = ${N(L2)}/${N(R(c5(rel)))} = **${SEC(R(m))}**`],
      `A person in the other train is a point: use only the length of the train being watched.`, `Distance = the length of the train that passes the observer, not the sum of both.`));
  }) });

  /* ---------------------------------------------------------------- 8. trains: train and a walking man */
  QB.gen("quant/tsd/trains-train-and-a-walking", { title: "Trains: train and a walking man", gen: wrap((rng, d) => {
    const tr = T(rng, TRN), man = T(rng, ["a man", "a porter", "a cyclist", "a jogger", "a farmer", "a boy"]);
    const w = (x) => x;
    if (d === "Easy") {
      const vt = rng.int(4, 20) * 6, vm = T(rng, [3, 4, 5, 6, 7.5, 9]), toward = rng.chance(0.5);
      const rel = toward ? vt + vm : vt - vm, t = rng.int(4, 20), L = c5(rel) * t;
      if (rel <= 0 || !I(L)) return null;
      return mk(rng, MT, L, [
        [c5(toward ? vt - vm : vt + vm) * t, toward ? "Subtracted the man's speed although he walks towards the train" : "Added the man's speed although he walks away from the train"],
        [c5(vt) * t, "Ignored the man's speed"],
        [rel * t, "Forgot to convert km/h into m/s"],
        [c18(rel) * t, "Converted with 18/5 instead of 5/18"],
      ], finish(d, `${tr} running at **${vt} km/h** passes ${man} walking ${toward ? "**towards** it" : "**in the same direction**"} at **${N(vm)} km/h** in **${t} seconds**. Find the length of the train.`,
        [`Relative speed = ${vt} ${toward ? "+" : "−"} ${N(vm)} = ${N(rel)} km/h = ${N(R(c5(rel)))} m/s`, `Length = ${N(R(c5(rel)))} × ${t} = **${MT(L)}**`],
        `Length = relative speed × time. ${toward ? "Opposite: add" : "Same direction: subtract"}.`, `${toward ? "Walking towards the train adds" : "Walking the same way subtracts"} his speed.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      if (k === 0) {
        const L = rng.int(4, 40) * 10, vm = T(rng, [3, 4, 5, 6, 7.5, 9]), t = rng.int(4, 30), toward = rng.chance(0.5);
        const rel = c18(L / t), vt = toward ? rel - vm : rel + vm;
        if (!C(vt) || vt <= 0) return null;
        return mk(rng, KMH, vt, [
          [toward ? rel + vm : rel - vm, toward ? "Added the man's speed although he walks towards the train" : "Subtracted the man's speed although he walks the same way"],
          [rel, "Gave the relative speed"],
          [L / t, "Left the speed in m/s"],
          [c18(L / t - vm), "Subtracted a km/h value from a m/s value"],
        ].filter((x) => x[0] > 0), finish(d, `${tr} **${N(L)} m** long passes ${man} walking ${toward ? "**towards** the train" : "**in the direction of the train**"} at **${N(vm)} km/h** in **${t} seconds**. What is the speed of the train in km/h?`,
          [`Relative speed = ${N(L)}/${t} = ${N(R(L / t))} m/s = ${N(R(rel))} km/h`, `Train = ${N(R(rel))} ${toward ? "−" : "+"} ${N(vm)} = **${KMH(R(vt))}**`],
          `Relative speed = L ÷ t (× 3.6). ${toward ? "Subtract" : "Add"} the man's speed to find the train.`, `Keep everything in km/h before adding or subtracting the man's speed.`));
      }
      const vt = rng.int(4, 20) * 6, vm = T(rng, [3, 4, 5, 6, 7.5, 9]), t = rng.int(4, 24), toward = rng.chance(0.5);
      const rel = toward ? vt + vm : vt - vm, L = c5(rel) * t;
      if (rel <= 0 || !I(L)) return null;
      const t2 = rng.int(0, 1) ? 0 : 1;
      const rel2 = toward ? vt - vm : vt + vm, ans = L / c5(rel2);
      if (!C(ans) || rel2 <= 0) return null;
      return mk(rng, SEC, ans, [
        [t, "Gave the time of the first case"],
        [L / c5(vt), "Ignored the man's speed"],
        [L / rel2, "Forgot to convert km/h into m/s"],
        [t * 2, "Doubled the time"],
      ], finish(d, `${tr} at **${vt} km/h** passes ${man} who walks ${toward ? "towards" : "away from"} the train at **${N(vm)} km/h** in **${t} seconds**. How long would it take to pass the same man if he walked ${toward ? "away from it" : "towards it"} at the same pace?`,
        [`Length = ${N(R(c5(rel)))} × ${t} = ${N(R(L))} m`, `New relative speed = ${vt} ${toward ? "−" : "+"} ${N(vm)} = ${N(rel2)} km/h = ${N(R(c5(rel2)))} m/s`, `Time = ${N(R(L))}/${N(R(c5(rel2)))} = **${SEC(R(ans))}**`],
        `Time is length ÷ relative speed: swap + and − when the man reverses.`, `The length of the train stays the same; only the relative speed changes.`));
    }
    const a = T(rng, [3, 4, 5, 6]), b = a + T(rng, [1, 2, 3]), t1 = rng.int(6, 30), t2 = rng.int(6, 30);
    if (t2 <= t1) return null;
    const vt = (b * t2 - a * t1) / (t2 - t1), L = c5(vt - a) * t1;
    if (!C(vt) || vt <= b + 2 || !I(L) || !I(R(vt))) return null;
    const x = rng.int(0, 1);
    return mk(rng, x ? MT : KMH, x ? L : vt, [
      x ? [c5(vt) * t1, "Ignored the man's speed"] : [(a * t1 + b * t2) / (t1 + t2), "Averaged the walking speeds with the times"],
      x ? [c5(vt - a) * t2, "Used the second time with the first speed"] : [c18(L / t1), "Gave the first relative speed"],
      x ? [c5(vt + a) * t1, "Added the man's speed"] : [vt - a, "Subtracted the man's speed from the train speed"],
      x ? [L * 5 / 18, "Converted twice"] : [vt + a, "Added the man's speed"],
    ], finish(d, `${tr} overtakes two men walking in the same direction at **${a} km/h** and **${b} km/h**, taking **${t1} s** and **${t2} s** respectively to pass them. ${x ? "What is the length of the train in metres?" : "What is the speed of the train in km/h?"}`,
      [`Let the train's speed be v km/h; length is the same in both passes`, `(v − ${a}) × ${t1} = (v − ${b}) × ${t2}`, `v = ${vt} km/h, and length = ${N(R(c5(vt - a)))} × ${t1} = ${N(L)} m`, `Answer: **${x ? MT(L) : KMH(vt)}**`],
      `Equate the lengths: (v − a) t1 = (v − b) t2, solve for v, then L = (v − a) × 5/18 × t1.`,
      `The train's length is the same in both cases: set the two products equal.`));
  }) });

  /* ---------------------------------------------------------------- 9. boats & streams */
  QB.gen("quant/tsd/boats-and-streams", { title: "Boats & streams", gen: wrap((rng, d) => {
    const nm = T(rng, NAMES), river = T(rng, ["Ganga", "Godavari", "Krishna", "Narmada", "Kaveri", "Yamuna", "Mahanadi", "Brahmaputra"]), boat = T(rng, ["boat", "motorboat", "ferry", "launch", "rowing boat"]);
    if (d === "Easy") {
      const b = rng.int(6, 30), c = rng.int(1, Math.min(8, b - 2)), t = rng.int(0, 3);
      if (t === 0) return mk(rng, KMH, b + c, [
        [b - c, "Used the upstream speed"],
        [b, "Ignored the current"],
        [c, "Gave the speed of the stream"],
        [b * c, "Multiplied the two speeds"],
      ], finish(d, `A ${boat} goes at **${b} km/h** in still water. The ${river} flows at **${c} km/h**. What is the speed of the ${boat} downstream?`,
        [`Downstream = still water + current = ${b} + ${c} = **${KMH(b + c)}**`], `Downstream: add. Upstream: subtract.`, `Downstream speed adds the current; upstream subtracts it.`));
      if (t === 1) return mk(rng, KMH, b - c, [
        [b + c, "Used the downstream speed"],
        [b, "Ignored the current"],
        [c, "Gave the speed of the stream"],
        [b - 2 * c, "Subtracted the current twice"],
      ], finish(d, `A ${boat} goes at **${b} km/h** in still water. The ${river} flows at **${c} km/h**. What is the speed of the ${boat} upstream?`,
        [`Upstream = still water − current = ${b} − ${c} = **${KMH(b - c)}**`], `Upstream: subtract the current.`, `Against the current, the effective speed is lower.`));
      const dn = b + c, up = b - c;
      if (t === 2) return mk(rng, KMH, c, [
        [b, "Gave the still-water speed"],
        [dn + up, "Added the two speeds"],
        [(dn - up), "Forgot to halve the difference"],
        [dn * up, "Multiplied the two speeds"],
      ], finish(d, `A ${boat} covers a stretch of the ${river} at **${dn} km/h** downstream and **${up} km/h** upstream. What is the speed of the stream?`,
        [`Stream = (downstream − upstream)/2 = (${dn} − ${up})/2 = **${KMH(c)}**`], `Half the difference of the two speeds.`, `The difference of the two speeds is TWICE the current.`));
      return mk(rng, KMH, b, [
        [c, "Gave the speed of the stream"],
        [dn + up, "Forgot to halve the sum"],
        [dn - up, "Gave the difference"],
        [dn * up / (dn + up), "Used the harmonic combination"],
      ], finish(d, `A ${boat} covers a stretch of the ${river} at **${dn} km/h** downstream and **${up} km/h** upstream. What is its speed in still water?`,
        [`Still water = (downstream + upstream)/2 = (${dn} + ${up})/2 = **${KMH(b)}**`], `Average of the two speeds.`, `Still-water speed is the AVERAGE of downstream and upstream speeds.`));
    }
    if (d === "Medium") {
      const b = rng.int(5, 25), c = rng.int(1, Math.min(8, b - 2)), D = rng.int(2, 12) * (b + c) * (b - c) / gcd(b + c, b - c);
      const k = rng.int(0, 1);
      if (k === 0) {
        const t = D / (b + c);
        if (!I(D) || D > 400 || !C(t)) return null;
        return mk(rng, (x) => N(x) + " hours", t, [
          [D / (b - c), "Used the upstream speed"],
          [D / b, "Ignored the current"],
          [D / (b + c) + D / (b - c), "Gave the time for the round trip"],
          [D / c, "Used the speed of the stream"],
        ], finish(d, `${nm} rows a ${boat} whose still-water speed is **${b} km/h** down the ${river}, which flows at **${c} km/h**. How many hours does ${nm} need to cover **${D} km** downstream?`,
          [`Downstream speed = ${b} + ${c} = ${b + c} km/h`, `Time = ${D}/${b + c} = **${N(R(t))} hours**`],
          `Time = distance ÷ (b + c).`, `Use the downstream speed, not the still-water speed.`));
      }
      const t = D / (b + c) + D / (b - c);
      if (!I(D) || D > 400 || !C(t)) return null;
      return mk(rng, (x) => N(x) + " hours", t, [
        [2 * D / b, "Ignored the current"],
        [2 * D / (b + c), "Used the downstream speed both ways"],
        [2 * D / (b - c), "Used the upstream speed both ways"],
        [D / (b + c), "Counted only the downstream leg"],
      ], finish(d, `A ${boat} with still-water speed **${b} km/h** goes **${D} km** downstream on the ${river} (current **${c} km/h**) and comes back to the starting point. How long does the round trip take?`,
        [`Downstream = ${D}/${b + c} = ${N(R(D / (b + c)))} h`, `Upstream = ${D}/${b - c} = ${N(R(D / (b - c)))} h`, `Total = **${N(R(t))} hours**`],
        `Add the two legs: D/(b + c) + D/(b − c).`, `The current does not cancel out: the upstream leg takes longer than the downstream leg saves.`));
    }
    const k = rng.int(0, 2);
    if (k === 0) {                         // distance from total time
      const b = rng.int(6, 24), c = rng.int(1, Math.min(8, b - 2)), D = rng.int(1, 12) * 10;
      const tt = D / (b + c) + D / (b - c);
      if (!C(tt)) return null;
      return mk(rng, KM, D, [
        [tt * b / 2, "Used the still-water speed for both legs"],
        [tt * (b + c) / 2, "Used the downstream speed for both legs"],
        [tt * (b - c) / 2, "Used the upstream speed for both legs"],
        [tt * b, "Used the still-water speed and forgot the round trip"],
      ], finish(d, `${nm} rows a ${boat} (still-water speed **${b} km/h**) to a village on the ${river} and back, a round trip of **${N(R(tt))} hours**. The current is **${c} km/h**. How far is the village?`,
        [`D/${b + c} + D/${b - c} = ${N(R(tt))}`, `D(${2 * b})/(${b * b - c * c}) = ${N(R(tt))}`, `D = ${N(R(tt))} × ${b * b - c * c}/${2 * b} = **${KM(D)}**`],
        `D = T (b² − c²) ÷ 2b.`, `Both legs have the same distance, so put D in a single equation.`));
    }
    if (k === 1) {                         // time ratio
      const [p, q] = T(rng, [[2, 1], [3, 1], [3, 2], [4, 3], [5, 3], [5, 2]]);
      const b = rng.int(2, 12) * (p + q), up = p, dn = q;
      const cs = b * (up - dn) / (up + dn);
      if (!C(cs)) return null;
      return mk(rng, KMH, cs, [
        [b * (up - dn) / up, "Divided by the upstream part only"],
        [b * (up + dn) / (up - dn), "Inverted the formula"],
        [b / (up - dn), "Divided the speed by the difference of the ratio terms"],
        [b, "Gave the still-water speed"],
      ], finish(d, `A ${boat} takes **${up} hours** to cover a stretch of the ${river} upstream and **${dn} hours** to cover the same stretch downstream. Its still-water speed is **${b} km/h**. Find the speed of the current.`,
        [`Same distance, so speeds are in the inverse ratio of times: upstream : downstream = ${dn} : ${up}`, `Upstream = ${dn}k, downstream = ${up}k, and still water = (${dn}k + ${up}k)/2 = ${b}`, `k = ${N(R(2 * b / (up + dn)))}, current = (${up}k − ${dn}k)/2 = **${KMH(R(cs))}**`],
        `Current = still-water speed × (${up} − ${dn})/(${up} + ${dn}) = ${b} × ${up - dn}/${up + dn}.`,
        `Speeds are in the INVERSE ratio of the times for the same distance.`));
    }
    const b = rng.int(6, 24), c = rng.int(1, Math.min(8, b - 2)), t1 = rng.int(2, 6) * 2;
    const D = (b + c) * t1, t2 = D / (b - c);
    if (!C(t2)) return null;
    return mk(rng, (x) => N(x) + " hours", t2, [
      [t1, "Assumed the same time both ways"],
      [D / b, "Ignored the current"],
      [t1 * (b + c) / b, "Used the still-water speed for the return"],
      [t1 * (b - c) / (b + c), "Inverted the speed ratio"],
    ], finish(d, `${nm}'s ${boat} goes downstream on the ${river} in **${t1} hours** and returns along the same route. Still-water speed is **${b} km/h** and the current is **${c} km/h**. How long does the return trip (upstream) take?`,
      [`Distance = ${b + c} × ${t1} = ${N(D)} km`, `Upstream speed = ${b} − ${c} = ${b - c} km/h`, `Time = ${N(D)}/${b - c} = **${N(R(t2))} hours**`],
      `Time upstream = time downstream × (b + c) ÷ (b − c).`, `Same distance: the slower upstream speed means a longer time, in the inverse ratio.`));
  }) });

  /* ---------------------------------------------------------------- 10. races & head starts */
  QB.gen("quant/tsd/races-and-head-starts", { title: "Races & head starts", gen: wrap((rng, d) => {
    const [a, b] = pair(rng), [c0] = pair(rng);
    const cn = T(rng, ["Vikash", "Sheela", "Amit", "Noor", "Rekha", "Jatin"]);
    if (d === "Easy") {
      const D = T(rng, [100, 200, 400, 500, 1000]), m = T(rng, [5, 10, 20, 25, 40, 50]), tA = rng.int(5, 40) * 2;
      if (m >= D / 2) return null;
      const diff = tA * m / (D - m);
      if (!C(diff)) return null;
      const k = rng.int(0, 1);
      if (k === 0) return mk(rng, SEC, diff, [
        [tA * m / D, "Divided by the whole race instead of what B has covered"],
        [tA * D / (D - m) , "Gave B's whole time"],
        [m / (D / tA), "Used A's whole speed with the lead"],
        [tA / m, "Divided the time by the distance"],
      ], finish(d, `In a **${N(D)} m** race ${a} beats ${b} by **${N(m)} m**. ${a} finishes in **${tA} seconds**. By how many seconds does ${a} beat ${b}?`,
        [`When ${a} finishes, ${b} has run ${N(D - m)} m in ${tA} s`, `${b} needs ${N(m)} m more at ${N(R((D - m) / tA))} m/s`, `Time = ${N(m)} ÷ ${N(R((D - m) / tA))} = **${SEC(R(diff))}**`],
        `${b}'s speed = ${N(D - m)}/${tA}. Time to cover the last ${N(m)} m = ${N(m)} ÷ that speed.`,
        `The winning margin in time uses the LOSER's speed, because the loser is the one still running.`));
      const tB = tA + diff;
      return mk(rng, SEC, tB, [
        [tA + tA * m / D, "Used the whole race length for B's last stretch"],
        [tA * D / m, "Inverted the fraction"],
        [tA + m, "Added the metres to the time"],
        [tA * (D + m) / D, "Added the lead to the full race"],
      ], finish(d, `In a **${N(D)} m** race ${a} beats ${b} by **${N(m)} m**. If ${a} runs the race in **${tA} seconds**, how many seconds does ${b} take?`,
        [`${b} covers ${N(D - m)} m in ${tA} s`, `Time for ${N(D)} m = ${tA} × ${N(D)}/${N(D - m)} = **${SEC(R(tB))}**`],
        `B's time = A's time × D ÷ (D − lead).`, `${b} runs ${N(D - m)} m in ${tA} s, not the full ${N(D)} m.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      if (k === 0) {                       // head start win margin
        const va = T(rng, [5, 6, 8, 10]), vb = T(rng, [3, 4, 5, 6, 8, 9]), D = T(rng, [100, 200, 400, 500, 800, 1000]), h = T(rng, [10, 20, 25, 40, 50, 60, 80, 100]);
        if (va <= vb) return null;
        const bCover = vb * D / va, win = D - h - bCover;
        if (!C(win) || win <= 0 || h >= D / 2) return null;
        return mk(rng, MT, win, [
          [D - bCover, "Ignored the head start"],
          [D - bCover + h, "Added the head start instead of subtracting it"],
          [h, "Gave the head start as the winning margin"],
          [(va - vb) * D / va - 2 * h > 0 ? (va - vb) * D / va - 2 * h : D / 10, "Subtracted the head start twice"],
        ], finish(d, `${a} runs at **${N(va)} m/s** and ${b} at **${N(vb)} m/s** in a **${N(D)} m** race. ${a} gives ${b} a head start of **${N(h)} m**. By how many metres does ${a} win?`,
          [`${a} takes ${N(D)}/${N(va)} = ${N(R(D / va))} s`, `${b} covers ${N(vb)} × ${N(R(D / va))} = ${N(R(bCover))} m in that time, plus the ${N(h)} m start = ${N(R(bCover + h))} m`, `${a} wins by ${N(D)} − ${N(R(bCover + h))} = **${MT(R(win))}**`],
          `Margin = D − h − (vb/va) × D.`, `The head start already counts as part of ${b}'s distance, so deduct it from what ${b} still has to run.`));
      }
      const D = T(rng, [100, 200, 400, 500, 1000]), x = T(rng, [10, 20, 25, 40, 50]), tA = rng.int(8, 60) * 2;
      const vB = (D - x) / tA;
      if (x >= D / 2 || !C(vB)) return null;
      return mk(rng, MS, vB, [
        [D / tA, "Gave the winner's speed"],
        [x / tA, "Divided the start by the time"],
        [(D + x) / tA, "Added the start to the distance"],
        [(D - x) / (tA + 1), "Used a time that is one second longer"],
      ], finish(d, `${a} can run **${N(D)} m** in **${tA} seconds**. In a **${N(D)} m** race ${a} gives ${b} a start of **${N(x)} m** and the two finish together. What is ${b}'s speed in m/s?`,
        [`${b} runs only ${N(D)} − ${N(x)} = ${N(D - x)} m in the same ${tA} s`, `Speed = ${N(D - x)}/${tA} = **${MS(R(vB))}**`],
        `Distance ${b} actually runs ÷ the common time.`, `With a head start, ${b} runs less than the full ${N(D)} m.`));
    }
    // Hard
    const k = rng.int(0, 1);
    if (k === 0) {
      const D = T(rng, [100, 200, 400, 500, 1000]), x = T(rng, [5, 10, 20, 25, 40, 50]), y = T(rng, [5, 10, 20, 25, 40, 50]);
      const cdist = (D - x) * (D - y) / D, win = D - cdist;
      if (!C(win) || x >= D / 2 || y >= D / 2) return null;
      return mk(rng, MT, win, [
        [x + y, "Added the two margins"],
        [D - (D - x) * (D - y) / (D * D) * D, "Mixed up the ratio"],
        [Math.abs(x - y), "Subtracted the margins"],
        [x * y / D, "Multiplied the margins"],
      ].filter((w) => w[0] > 0), finish(d, `In a **${N(D)} m** race ${a} beats ${b} by **${N(x)} m**, and ${b} beats ${cn} by **${N(y)} m** over the same distance. By how many metres does ${a} beat ${cn} in a **${N(D)} m** race?`,
        [`When ${a} runs ${N(D)} m, ${b} runs ${N(D - x)} m`, `When ${b} runs ${N(D)} m, ${cn} runs ${N(D - y)} m. So when ${b} runs ${N(D - x)} m, ${cn} runs ${N(D - x)} × ${N(D - y)}/${N(D)} = ${N(R(cdist))} m`, `${a} beats ${cn} by ${N(D)} − ${N(R(cdist))} = **${MT(R(win))}**`],
        `Chain the ratios: A : C = D × D : (D − x)(D − y).`, `You cannot add the margins: ${b} covers a shorter distance in the second race, so the margin shrinks proportionally.`));
    }
    const D = T(rng, [100, 200, 400, 500, 1000]), m = T(rng, [10, 20, 25, 40, 50]), t = T(rng, [2, 4, 5, 8, 10]);
    if (m >= D / 2) return null;
    const vB = m / t, tBfull = D / vB, tA = tBfull - t;
    if (!C(tA)) return null;
    return mk(rng, SEC, tA, [
      [tBfull, "Gave B's time"],
      [tBfull + t, "Added the winning margin to B's time"],
      [D * t / (D - m), "Used the winner's distance with the margin in a wrong ratio"],
      [t * (D - m) / m, "Gave the time for B to run D − m"],
    ], finish(d, `In a **${N(D)} m** race ${a} beats ${b} by **${N(m)} m** or by **${t} seconds**. What time does ${a} take to run the race?`,
      [`${b} covers the last ${N(m)} m in ${t} s, so ${b}'s speed = ${N(m)}/${t} = ${N(R(m / t))} m/s`, `${b}'s time for ${N(D)} m = ${N(D)} ÷ ${N(R(m / t))} = ${N(R(tBfull))} s`, `${a}'s time = ${N(R(tBfull))} − ${t} = **${SEC(R(tA))}**`],
      `Loser's speed = m/t. Loser's full time minus t is the winner's time.`, `"Beats by t seconds" means the winner is t seconds faster than the loser over the full distance.`));
  }) });

  /* ---------------------------------------------------------------- 11. circular track meetings */
  QB.gen("quant/tsd/circular-track-meetings", { title: "Circular track meetings", gen: wrap((rng, d) => {
    const [a, b] = pair(rng), spot = T(rng, ["park", "stadium", "school ground", "jogging track", "cycling velodrome", "college campus loop"]);
    if (d === "Easy") {
      const va = rng.int(2, 9), vb = rng.int(2, 9), opp = rng.chance(0.5), rel = opp ? va + vb : Math.abs(va - vb), t = rng.int(10, 120), L = rel * t;
      if (!opp && va === vb) return null;
      return mk(rng, SEC, t, [
        [L / (opp ? Math.abs(va - vb) || 1 : va + vb), opp ? "Subtracted the speeds although they run in opposite directions" : "Added the speeds although they run the same way"],
        [L / Math.max(va, vb), "Used only the faster speed"],
        [L / Math.min(va, vb), "Used only the slower speed"],
        [L / (rel * 2), "Halved the time"],
      ], finish(d, `${a} and ${b} start together from the same point of a circular ${spot} **${N(L)} m** around and run ${opp ? "in **opposite directions**" : "in the **same direction**"} at **${va} m/s** and **${vb} m/s**. After how many seconds do they meet for the first time?`,
        [`${opp ? "Opposite directions: the gap closes at " + va + " + " + vb : "Same direction: the faster gains " + Math.abs(va - vb) + " m/s"} = ${rel} m/s`, `They meet when the gap equals one full lap: ${N(L)}/${rel} = **${SEC(t)}**`],
        `Time = lap length ÷ relative speed.`, `They first meet when the relative distance is ONE lap, not zero.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      if (k === 0) {
        const va = rng.int(4, 20) * 3, vb = rng.int(4, 20) * 3, opp = rng.chance(0.5), rel = opp ? va + vb : Math.abs(va - vb), L = rng.int(2, 30) * 100;
        if (!opp && va === vb) return null;
        const t = L / c5(rel);
        if (!I(t)) return null;
        return mk(rng, SEC, t, [
          [L / rel, "Forgot to convert km/h into m/s"],
          [L / c5(opp ? Math.abs(va - vb) || 1 : va + vb), opp ? "Subtracted the speeds although they run in opposite directions" : "Added the speeds although they run the same way"],
          [L / c18(rel), "Converted with 18/5 instead of 5/18"],
          [L / (2 * c5(rel)), "Halved the time"],
        ], finish(d, `Two cyclists start from the same point of a **${N(L)} m** circular ${spot} and ride ${opp ? "in opposite directions" : "in the same direction"} at **${va} km/h** and **${vb} km/h**. How many seconds pass before they meet again?`,
          [`Relative speed = ${rel} km/h = ${N(R(c5(rel)))} m/s`, `Time = ${N(L)}/${N(R(c5(rel)))} = **${SEC(t)}**`],
          `Lap length ÷ (relative speed in m/s).`, `Convert km/h to m/s because the track length is in metres.`));
      }
      const va = rng.int(3, 12), vb = va + rng.int(1, 6), L = rng.int(1, 12) * 50, per = L / (vb - va), n = rng.int(3, 9), T0 = per * n;
      if (!I(per)) return null;
      return mk(rng, (x) => N(x) + " times", n, [
        [n + 1, "Counted the start as a meeting"],
        [n - 1, "Missed the last meeting"],
        [T0 * (va + vb) / L, "Used the opposite-direction relative speed"],
        [n * 2, "Doubled the count"],
      ].filter((w) => w[0] > 0), finish(d, `${a} and ${b} run in the same direction on a **${N(L)} m** circular ${spot} at **${va} m/s** and **${vb} m/s**, starting together. How many times does the faster runner overtake the slower in **${N(T0)} seconds** (not counting the start)?`,
        [`Relative speed = ${vb} − ${va} = ${vb - va} m/s`, `One overtaking every ${N(L)}/${vb - va} = ${N(per)} s`, `In ${N(T0)} s: ${N(T0)}/${N(per)} = **${n}**`],
        `Number of meetings = time ÷ (lap ÷ relative speed).`, `The start itself is not an overtaking.`));
    }
    const k = rng.int(0, 1);
    if (k === 0) {                         // meeting at the starting point
      const L = T(rng, [120, 180, 240, 300, 360, 400, 480, 600]), ta = T(rng, [20, 24, 30, 36, 40, 45, 48, 50, 60, 72, 80]), tb = T(rng, [20, 24, 30, 36, 40, 45, 48, 50, 60, 72, 80]);
      if (ta === tb || L % ta || L % tb) return null;
      const ans = lcm(ta, tb);
      return mk(rng, SEC, ans, [
        [ta * tb, "Multiplied the two lap times"],
        [QB.gcd(ta, tb), "Used the HCF of the two lap times"],
        [(ta + tb) / 2, "Averaged the two lap times"],
        [L / (L / ta + L / tb), "Used the first meeting anywhere on the track"],
      ], finish(d, `${a} and ${b} start together from the starting line of a **${N(L)} m** circular track and run in the same direction at **${N(L / ta)} m/s** and **${N(L / tb)} m/s**. After how many seconds will they be together at the starting line again?`,
        [`Lap times: ${N(L)}/${N(L / ta)} = ${ta} s and ${N(L)}/${N(L / tb)} = ${tb} s`, `They are both at the start together at the LCM of the lap times`, `LCM(${ta}, ${tb}) = **${SEC(ans)}**`],
        `Find each lap time, then LCM.`, `Meeting anywhere on the track needs relative speed; meeting at the START needs the LCM of the lap times.`));
    }
    const va = T(rng, [4, 5, 6, 8, 10, 12, 15]), vb = T(rng, [3, 4, 5, 6, 8, 9, 10, 12, 15, 18]), n = rng.int(2, 8);
    if (va === vb) return null;
    const cnt = n * (va + vb) / va;
    if (!I(cnt)) return null;
    return mk(rng, (x) => N(x) + " times", cnt, [
      [n, "Counted only the laps of the first runner"],
      [n * (va - vb) / va > 0 ? n * (va - vb) / va : n + 3, "Used the same-direction relative speed"],
      [cnt - 1, "Did not count the final meeting"],
      [cnt + 1, "Counted the start as a meeting"],
    ], finish(d, `${a} and ${b} start together from one point of a circular ${spot} and run in **opposite directions** at **${va} m/s** and **${vb} m/s**. By the time ${a} completes **${n} laps**, how many times have they met in all (not counting the start)?`,
      [`In the time ${a} runs ${n} laps, the total distance covered by both = ${n} × (${va} + ${vb})/${va} laps`, `They meet every time their combined distance increases by one lap`, `Number of meetings = ${n} × ${va + vb}/${va} = **${N(cnt)}**`],
      `Meetings = laps of A × (sum of speeds) ÷ (A's speed).`, `Opposite directions: combined laps = meetings, not laps of one runner.`));
  }) });

  /* ---------------------------------------------------------------- 12. chase */
  QB.gen("quant/tsd/chase", { title: "Chase (police & thief)", gen: wrap((rng, d) => {
    const cop = T(rng, ["A policeman", "A security guard", "A constable", "A traffic officer", "A forest guard"]), thief = T(rng, ["a thief", "a pickpocket", "a chain-snatcher", "a runaway scooter-rider", "a poacher"]);
    if (d === "Easy") {
      const vp = rng.int(5, 20) * 3, vt = rng.int(2, 16) * 3, t = rng.int(1, 8), gap = (vp - vt) * t;
      if (vp <= vt + 3) return null;
      const k = rng.int(0, 1);
      if (k === 0) return mk(rng, (x) => N(x) + " hours", t, [
        [gap / (vp + vt), "Added the speeds although both move the same way"],
        [gap / vp, "Used only the chaser's speed"],
        [gap / vt, "Used only the runner's speed"],
        [gap * (vp - vt), "Multiplied instead of dividing"],
      ], finish(d, `${cop} spots ${thief} **${N(gap)} km** ahead. The fugitive runs at **${vt} km/h** and the chaser follows at **${vp} km/h**. In how many hours is the thief caught?`,
        [`Closing speed = ${vp} − ${vt} = ${vp - vt} km/h`, `Time = ${N(gap)}/${vp - vt} = **${N(t)} hours**`],
        `Gap ÷ (difference of speeds).`, `Same direction: subtract the speeds.`));
      return mk(rng, KM, vp * t, [
        [vt * t, "Gave the distance the thief ran"],
        [gap, "Gave the initial gap"],
        [(vp - vt) * t * 2, "Doubled the gap"],
        [vp * t + vt * t, "Added the two distances"],
      ], finish(d, `${cop} spots ${thief} **${N(gap)} km** ahead. ${thief[0].toUpperCase() + thief.slice(1)} runs at **${vt} km/h** and the chaser follows at **${vp} km/h**. How far does the chaser run before catching the thief?`,
        [`Time to catch = ${N(gap)}/(${vp} − ${vt}) = ${t} h`, `Chaser's distance = ${vp} × ${t} = **${KM(vp * t)}**`],
        `First the catch-up time, then speed × time for the chaser.`, `The chaser covers the gap PLUS what the thief runs meanwhile.`));
    }
    if (d === "Medium") {
      const vt = rng.int(2, 14) * 3, vp = vt + rng.int(1, 6) * 3, lead = T(rng, [10, 15, 20, 30, 40, 45, 60]);
      const gap = vt * lead / 60;
      if (!C(gap)) return null;
      const t = gap / (vp - vt) * 60;
      if (!C(t)) return null;
      const k = rng.int(0, 1);
      if (k === 0) return mk(rng, MIN, t, [
        [lead, "Gave the head-start time"],
        [gap / (vp - vt), "Left the time in hours"],
        [gap / (vp + vt) * 60, "Added the speeds"],
        [gap / vp * 60, "Used only the chaser's speed"],
      ], finish(d, `${thief[0].toUpperCase() + thief.slice(1)} escapes on a ${T(rng, VEH)} at **${vt} km/h**. **${lead} minutes** later ${cop.toLowerCase().replace(/^an? /, "a ")} starts after the thief at **${vp} km/h**. After how many minutes (from the officer's start) is the thief caught?`,
        [`Head start = ${vt} × ${lead}/60 = ${N(R(gap))} km`, `Closing speed = ${vp} − ${vt} = ${vp - vt} km/h`, `Time = ${N(R(gap))}/${vp - vt} h = **${MIN(R(t))}**`],
        `Head-start distance, then ÷ the difference of speeds, × 60 for minutes.`, `The head start is a distance (speed × time), not a time to add at the end.`));
      return mk(rng, KM, vp * t / 60, [
        [vt * t / 60, "Gave the thief's running distance after the officer started"],
        [gap, "Gave the head-start distance"],
        [vp * (t + lead) / 60, "Counted the officer's speed over the head-start time as well"],
        [(vp - vt) * t / 60, "Used the closing speed as the officer's speed"],
      ], finish(d, `${thief[0].toUpperCase() + thief.slice(1)} runs at **${vt} km/h**. **${lead} minutes** later ${cop.toLowerCase().replace(/^an? /, "a ")} sets out in pursuit at **${vp} km/h**. How far from the starting point is the thief caught?`,
        [`Head start = ${vt} × ${lead}/60 = ${N(R(gap))} km`, `Time to catch = ${N(R(gap))}/${vp - vt} h = ${N(R(t))} min`, `Distance = ${vp} × ${N(R(t))}/60 = **${KM(R(vp * t / 60))}**`],
        `Catch-up time × the chaser's speed.`, `Measure from the same starting point for both; the chaser's distance equals the thief's total distance.`));
    }
    const k = rng.int(0, 1);
    if (k === 0) {                         // find thief's speed
      const vp = rng.int(8, 24) * 3, gap = rng.int(2, 12) * 30, T0 = rng.int(2, 10) * 5, vt = vp - gap / T0 * 3.6;
      if (!C(vt) || vt <= 0) return null;
      return mk(rng, KMH, vt, [
        [vp + gap / T0 * 3.6, "Added the closing speed instead of subtracting"],
        [gap / T0 * 3.6, "Gave the closing speed only"],
        [vp - gap / T0, "Subtracted a m/s value from a km/h value"],
        [vp - gap / T0 * 5 / 18, "Converted with 5/18 instead of 18/5"],
      ].filter((w) => w[0] > 0), finish(d, `${cop} runs at **${vp} km/h** and catches ${thief} who was **${N(gap)} m** ahead, in exactly **${T0} seconds**. How fast was the thief running, in km/h?`,
        [`Closing speed = ${N(gap)}/${T0} = ${N(R(gap / T0))} m/s = ${N(R(gap / T0 * 3.6))} km/h`, `Thief = ${vp} − ${N(R(gap / T0 * 3.6))} = **${KMH(R(vt))}**`],
        `Closing speed (gap ÷ time, × 3.6) is subtracted from the chaser's speed.`, `Convert the closing speed to km/h before subtracting.`));
    }
    const vp = rng.int(4, 20), vt = rng.int(2, vp - 1), gap = (vp - vt) * rng.int(3, 20), tunl = rng.int(1, 3);
    const t = gap / (vp - vt);
    const dvp = vp * t;
    if (!I(t)) return null;
    // chase with a dog running between? use turn-back: thief changes speed
    const gap2 = gap - (vp - vt) * (t / 2);
    return mk(rng, MT, vp * t, [
      [vt * t, "Gave the distance the thief ran"],
      [gap, "Gave the initial gap"],
      [(vp + vt) * t, "Added the two speeds' distances"],
      [vp * t / 2, "Used half the catch-up time"],
    ], finish(d, `${cop} is **${N(gap)} m** behind ${thief}. The officer runs at **${vp} m/s** and the thief at **${vt} m/s**. How many metres does the officer run before the thief is caught?`,
      [`Closing speed = ${vp} − ${vt} = ${vp - vt} m/s`, `Time = ${N(gap)}/${vp - vt} = ${N(t)} s`, `Distance = ${vp} × ${N(t)} = **${MT(dvp)}**`],
      `Officer's distance = gap × vp ÷ (vp − vt) = ${N(gap)} × ${vp}/${vp - vt}.`, `The chaser's distance is more than the gap: the thief keeps running while the gap closes.`));
  }) });

  /* ---------------------------------------------------------------- 13. stoppages per hour */
  QB.gen("quant/tsd/stoppages-per-hour", { title: "Stoppages per hour", gen: wrap((rng, d) => {
    const veh = T(rng, ["bus", "train", "tempo", "coach", "truck", "tourist van", "city bus"]);
    if (d === "Easy") {
      const a = T(rng, [30, 40, 45, 48, 50, 54, 60, 72, 75, 80, 90]), s = T(rng, [5, 6, 10, 12, 15, 20]), b = a * (60 - s) / 60;
      if (!C(b)) return null;
      return mk(rng, MIN, s, [
        [a - b, "Gave the speed difference as minutes"],
        [60 * b / a, "Gave the minutes of running time"],
        [60 * (a - b) / b, "Divided by the speed with stoppages"],
        [(a - b) / a * 100, "Gave the percentage instead of minutes"],
      ], finish(d, `${T(rng, ["On the " + two(rng).join("–") + " route", "On a long highway", "On the ghat section", "On the expressway", "During a school trip", "On a night service"])}, a ${veh} runs at **${a} km/h** without stoppages; including stoppages its average speed is **${N(R(b))} km/h**. For how many minutes per hour does the ${veh} stop?`,
        [`Distance lost per hour = ${a} − ${N(R(b))} = ${N(R(a - b))} km`, `Time to cover that at ${a} km/h = ${N(R(a - b))}/${a} h`, `Stoppage = ${N(R(a - b))}/${a} × 60 = **${MIN(s)}**`],
        `Stoppage per hour = (difference of speeds ÷ speed without stoppages) × 60.`, `Divide the lost distance by the speed WITHOUT stoppages.`));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1);
      if (k === 0) {
        const a = T(rng, [30, 40, 45, 48, 50, 54, 60, 72, 75, 80, 90]), s = T(rng, [4, 5, 6, 8, 10, 12, 15, 18, 20, 24]), b = a * (60 - s) / 60;
        if (!C(b)) return null;
        return mk(rng, KMH, b, [
          [a - s, "Subtracted the minutes from the speed"],
          [a * (60 + s) / 60, "Added the stoppage"],
          [a * s / 60, "Gave the distance lost in the stoppage"],
          [a - a * s / 100, `Took ${s}% instead of ${s} minutes out of 60`],
        ], finish(d, `A ${veh} runs at **${a} km/h** without stoppages but halts for **${s} minutes** every hour. What is its average speed including stoppages?`,
          [`Running time per hour = 60 − ${s} = ${60 - s} min`, `Distance per hour = ${a} × ${60 - s}/60 = **${KMH(R(b))}**`],
          `Speed × (60 − stoppage) ÷ 60.`, `The ${s} minutes is out of 60 minutes, not 100.`));
      }
      const a = T(rng, [30, 40, 45, 48, 50, 54, 60, 72, 75, 80, 90]), s = T(rng, [5, 6, 10, 12, 15, 20, 30]), b = a * (60 - s) / 60;
      if (!C(b)) return null;
      return mk(rng, KMH, a, [
        [b + s, "Added the minutes to the speed"],
        [b * (60 - s) / 60, "Applied the stoppage factor the wrong way"],
        [b * (60 + s) / 60, "Added the stoppage fraction"],
        [b / (1 - s / 100), `Treated ${s} minutes as ${s}%`],
      ], finish(d, `Including stoppages a ${veh} averages **${N(R(b))} km/h**. It stops for **${s} minutes** every hour. What is its speed without stoppages?`,
        [`Running time per hour = ${60 - s} min`, `${N(R(b))} = speed × ${60 - s}/60`, `Speed = ${N(R(b))} × 60/${60 - s} = **${KMH(a)}**`],
        `Speed with stops ÷ (running fraction of the hour).`, `The stops reduce the average, so the running speed must be higher than the average.`));
    }
    const k = rng.int(0, 1);
    if (k === 0) {                         // total journey time with stoppages
      const a = T(rng, [40, 45, 48, 50, 54, 60, 72, 75, 80, 90]), s = T(rng, [5, 6, 10, 12, 15, 20]), D = rng.int(2, 12) * a * (60 - s) / gcd(a * (60 - s), 60);
      const tr = D / a, total = tr * 60 / (60 - s);
      if (!C(total) || D > 1500) return null;
      return mk(rng, (x) => N(x) + " hours", total, [
        [tr, "Ignored the stoppages"],
        [tr + tr * s / 60, "Added the stoppage for the running time only, not the whole trip"],
        [tr + s / 60, "Added only one stoppage"],
        [tr * (60 + s) / 60 + 0.01 > 0 ? tr * 60 / (60 + s) : 0, "Divided by the wrong factor"],
      ], finish(d, `A ${veh} covers **${N(D)} km** at a running speed of **${a} km/h** and stops **${s} minutes in every hour**. How long, in hours, does the journey take including stoppages?`,
        [`Running time = ${N(D)}/${a} = ${N(R(tr))} h`, `Out of every hour, ${60 - s} min is running, so total time = ${N(R(tr))} × 60/${60 - s}`, `= **${N(R(total))} hours**`],
        `Running time × 60 ÷ (60 − stoppage).`, `Stoppages occur every hour of TOTAL time, not every hour of running time.`));
    }
    const a = T(rng, [40, 45, 48, 50, 54, 60, 72, 75, 80, 90]), s1 = T(rng, [5, 6, 10, 12, 15, 20]), s2 = T(rng, [6, 10, 12, 15, 18, 20, 24, 30]);
    if (s1 === s2) return null;
    const b1 = a * (60 - s1) / 60, b2 = a * (60 - s2) / 60;
    if (!C(b1) || !C(b2)) return null;
    const t = rng.int(2, 8) * 5, dist1 = b1 * t / 60;
    const ans = a * (60 - s1) / (60 - s2) ;
    // speed of train B without stoppage if same average speed as A
    return mk(rng, KMH, a * (60 - s1) / (60 - s2), [
      [a * (60 - s2) / (60 - s1), "Used the ratio the wrong way round"],
      [a + (s2 - s1), "Added the difference of the stoppage times"],
      [a * s2 / s1, "Compared the stoppage times directly"],
      [a, "Assumed the same running speed"],
    ].filter((w) => w[0] > 0), finish(d, `Train P runs at **${a} km/h** without stoppages and stops **${s1} minutes per hour**. Train Q stops **${s2} minutes per hour** but has the same average speed including stoppages as P. What is Q's speed without stoppages?`,
      [`P's average = ${a} × ${60 - s1}/60 = ${N(R(b1))} km/h`, `Q: speed × ${60 - s2}/60 = ${N(R(b1))}`, `Q's speed = ${a} × ${60 - s1}/${60 - s2} = **${KMH(R(ans))}**`],
      `Equate the averages: v_Q × (60 − ${s2}) = ${a} × (60 − ${s1}).`, `Equal averages mean the running speeds are in the inverse ratio of the running minutes.`));
  }) });
})();
