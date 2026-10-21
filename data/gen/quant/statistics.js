/* =====================================================================
   Statistics: generators for the catalog patterns marked gen:true
   (mean-median-mode, range-and-standard-deviation-basics,
   effect-of-adding-multiplying-every). Every wrong option comes from a real mistake.
   ===================================================================== */
(function () {
  const N = (x) => QB.num(x);
  const R = (x) => QB.round(x, 2);
  const C = (x) => isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const I = Number.isInteger;
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 95 };
  const NAMES = ["Aarav", "Meera", "Rohit", "Sneha", "Kiran", "Divya", "Arjun", "Pooja", "Vikram", "Ananya", "Suresh", "Neha", "Imran", "Lakshmi", "Harsh", "Kavya", "Manoj", "Riya", "Farhan", "Tanvi", "Gopal", "Isha", "Naveen", "Shreya", "Deepak", "Nisha", "Rahul", "Swati", "Karthik", "Preeti"];
  const LEAD = ["", "", "Warm-up: ", "Mock test: ", "Try this: ", "Practice question: ", "Campus drive: ", "Interview round: ", "Quick one: "];
  const UNITS = [["student marks", "marks"], ["daily sales figures", "units"], ["employee ages", "years"], ["parcel weights (kg)", "kg"], ["runs scored per match", "runs"], ["daily temperatures (°C)", "°C"], ["delivery times (minutes)", "minutes"], ["plant heights (cm)", "cm"]];
  const ord = (n) => n + ((n % 100 >= 11 && n % 100 <= 13) ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[n % 10] || "th"));

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("statistics: no clean question found");
    };
  }
  function mk(rng, f, ans, wrongs, extra) {
    if (!C(ans)) return null;
    const A = f(R(ans)), seen = new Set([A.toLowerCase()]), pairs = [[A, null]];
    for (const w of wrongs) {
      if (pairs.length === 4) break;
      const v = w[0];
      if (!isFinite(v) || v <= 0) continue;
      if (!C(v) || Math.abs(v - ans) <= 0.051) continue;
      const t = f(R(v));
      if (seen.has(t.toLowerCase())) continue;
      seen.add(t.toLowerCase()); pairs.push([t, w[1]]);
    }
    if (pairs.length < 4) return null;
    const o = QB.options(rng, pairs);
    return Object.assign({ time: TIME[extra.d] }, extra, o, { calc: String(R(ans)) });
  }
  const fin = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });
  const sum = (a) => a.reduce((s, x) => s + x, 0);
  const mean = (a) => sum(a) / a.length;
  const sorted = (a) => a.slice().sort((x, y) => x - y);
  const median = (a) => { const s = sorted(a), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  const list = (a) => a.map(N).join(", ");
  function modeOf(a) { const c = {}; a.forEach((x) => (c[x] = (c[x] || 0) + 1)); const m = Math.max.apply(null, Object.values(c)); const ks = Object.keys(c).filter((k) => c[k] === m); return ks.length === 1 ? +ks[0] : null; }
  const pop = (a) => { const m = mean(a); return sum(a.map((x) => (x - m) * (x - m))) / a.length; };

  /* ------------------------------------------------------------------ 1. mean / median / mode */
  QB.gen("quant/statistics/mean-median-mode", { title: "Mean, median and mode", gen: wrap((rng, d) => {
    const nm = T(rng, NAMES), lead = T(rng, LEAD), U = T(rng, UNITS);
    if (d === "Easy") {
      const k = rng.int(0, 2);
      if (k === 0) {
        const n = T(rng, [5, 6, 8]), a = []; for (let i = 0; i < n; i++) a.push(rng.int(8, 70));
        a[n - 1] += (n - sum(a) % n) % n;
        const m = mean(a);
        return mk(rng, N, m, [
          [median(a), "Gave the median instead of the mean"],
          [sum(a), "Gave the total without dividing by the number of values"],
          [sum(a) / (n + 1), "Divided by one more than the number of values"],
          [sum(a) / (n - 1), "Divided by one less than the number of values"],
          [Math.max.apply(null, a) - m, "Subtracted the mean from the greatest value"],
        ], fin(d, lead + T(rng, [`Find the mean of ${list(a)}.`, `${nm} records these ${U[0]}: ${list(a)}. What is the mean?`, `What is the average of the ${n} values ${list(a)}?`]),
          [`Sum = ${a.join(" + ")} = ${sum(a)}`, `Mean = ${sum(a)} ÷ ${n} = **${N(m)}**`],
          `Guess a mean near ${N(Math.round(median(a)))}, add the small differences, and divide by ${n}.`,
          "Divide by the number of values, not by the number of values plus or minus one."));
      }
      if (k === 1) {
        const n = T(rng, [5, 7, 9]), a = []; for (let i = 0; i < n; i++) a.push(rng.int(5, 90));
        const s = sorted(a), md = median(a);
        if (new Set(a).size < n) return null;
        return mk(rng, N, md, [
          [a[(n - 1) / 2], "Took the middle value of the list as given, without arranging it in order"],
          [mean(a), "Found the mean instead of the median"],
          [s[(n - 1) / 2 + 1], "Took the value just after the middle position"],
          [s[(n - 1) / 2 - 1], "Took the value just before the middle position"],
          [s[n - 1], "Took the greatest value"],
        ], fin(d, lead + T(rng, [`Find the median of ${list(a)}.`, `The ${U[0]} on ${n} days are ${list(a)}. What is the median?`, `${nm} lists ${list(a)}. What is the median of these values?`]),
          [`Arrange in order: ${list(s)}`, `${n} values, so the median is the ${ord((n + 1) / 2)} value = **${N(md)}**`],
          `Sort first, then pick the ${ord((n + 1) / 2)} value.`,
          "The median is the middle of the SORTED list, not the middle of the list as written."));
      }
      const n = rng.int(8, 11), base = []; for (let i = 0; i < 4; i++) base.push(rng.int(5, 60));
      const uniq = Array.from(new Set(base)); if (uniq.length < 4) return null;
      const mo = uniq[0], a = []; for (let i = 0; i < 3; i++) a.push(mo); uniq.slice(1).forEach((x) => { a.push(x); }); a.push(uniq[1]);
      const arr = rng.shuffle(a);
      if (modeOf(arr) !== mo) return null;
      return mk(rng, N, mo, [
        [median(arr), "Found the median instead of the mode"],
        [mean(arr), "Found the mean instead of the mode"],
        [uniq[1], "Took the value that appears twice, not the most often"],
        [Math.max.apply(null, arr), "Took the greatest value"],
        [Math.min.apply(null, arr), "Took the smallest value"],
      ], fin(d, lead + T(rng, [`Find the mode of ${list(arr)}.`, `What is the mode of this data: ${list(arr)}?`, `${nm} collected these ${U[0]}: ${list(arr)}. Which value is the mode?`]),
        [`Count how often each value occurs`, `${N(mo)} occurs 3 times, more often than any other value`, `Mode = **${N(mo)}**`],
        "Tally the repeats; the value with the highest count is the mode.",
        "The mode is the most frequent value, not the largest or the middle one."));
    }
    if (d === "Medium") {
      const k = rng.int(0, 3);
      if (k === 0) {
        const n = T(rng, [6, 8, 10]), a = []; for (let i = 0; i < n; i++) a.push(rng.int(5, 95));
        const s = sorted(a), md = median(a);
        if (!I(md * 2) || I(md)) return null;
        return mk(rng, N, md, [
          [s[n / 2], "Took the upper of the two middle values"],
          [s[n / 2 - 1], "Took the lower of the two middle values"],
          [mean(a), "Found the mean instead of the median"],
          [s[n / 2] + s[n / 2 - 1], "Added the two middle values and forgot to halve"],
          [a[n / 2 - 1], "Used the middle of the unsorted list"],
        ], fin(d, lead + T(rng, [`Find the median of ${list(a)}.`, `The ${U[0]} for ${n} observations are ${list(a)}. Find their median.`, `${nm} has the following data: ${list(a)}. What is the median?`]),
          [`Sorted: ${list(s)}`, `${n} values: the median is the mean of the ${ord(n / 2)} and ${ord(n / 2 + 1)} values`, `(${s[n / 2 - 1]} + ${s[n / 2]}) ÷ 2 = **${N(md)}**`],
          "With an even count, average the two middle values of the sorted list.",
          "With an even number of values there is no single middle value: average the two in the centre."));
      }
      if (k === 1) {
        const n = rng.int(5, 8), m = rng.int(12, 60), a = []; for (let i = 0; i < n - 1; i++) a.push(rng.int(Math.max(2, m - 12), m + 12));
        const x = m * n - sum(a);
        if (x < 1 || x > 150) return null;
        return mk(rng, N, x, [
          [m * (n - 1) - sum(a), "Used n − 1 instead of n for the total"],
          [m, "Assumed the missing value equals the mean"],
          [sum(a) - m * (n - 1), "Subtracted in the wrong order"],
          [sum(a) / (n - 1), "Found the mean of the given values instead"],
          [m * n, "Gave the total instead of the missing value"],
        ], fin(d, lead + T(rng, [`The mean of ${n} numbers is **${m}**. If ${n - 1} of them are ${list(a)}, find the remaining number.`, `${nm} says the average of ${n} values is ${m}; ${n - 1} of them are ${list(a)}. What is the last value?`, `The average of ${n} observations is ${m}; ${n - 1} of them are ${list(a)}. Find the missing observation.`]),
          [`Total of all ${n} = ${m} × ${n} = ${m * n}`, `Total of the known ${n - 1} = ${sum(a)}`, `Missing = ${m * n} − ${sum(a)} = **${x}**`],
          "Missing value = mean × n − sum of the given values.",
          `The total needs all ${n} values, so multiply the mean by ${n}, not ${n - 1}.`));
      }
      if (k === 2) {
        const vals = rng.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30]).slice(0, rng.int(4, 5)).sort((p, q) => p - q);
        const fr = vals.map(() => rng.int(1, 9)), tot = sum(fr), sx = sum(vals.map((v, i) => v * fr[i]));
        const m = sx / tot;
        if (!C(m)) return null;
        const row = vals.map((v, i) => `${v} (${fr[i]} time${fr[i] === 1 ? "" : "s"})`).join(", ");
        return mk(rng, N, m, [
          [mean(vals), "Averaged the values and ignored how often each occurs"],
          [sx, "Gave the total without dividing by the number of observations"],
          [sx / vals.length, "Divided by the number of different values instead of the total frequency"],
          [vals[fr.indexOf(Math.max.apply(null, fr))], "Gave the most frequent value (the mode)"],
          [(sx + vals[0]) / (tot + 1), "Added an extra observation by mistake"],
        ], fin(d, lead + T(rng, [`The values observed were: ${row}. Find the mean.`, `${nm} recorded the ${U[0]}: ${row}. What is the mean of all the observations?`]),
          [`Total frequency = ${fr.join(" + ")} = ${tot}`, `Σfx = ${vals.map((v, i) => v + " × " + fr[i]).join(" + ")} = ${sx}`, `Mean = ${sx} ÷ ${tot} = **${N(R(m))}**`],
          "Weighted mean = Σ(value × frequency) ÷ Σ frequency.",
          "Do not average the distinct values; each one counts as many times as it occurs."));
      }
      const n = rng.int(5, 9), m = rng.int(15, 70), a = rng.int(5, 90), b = rng.int(5, 90);
      if (a === b) return null;
      const nm2 = m + (b - a) / n;
      return mk(rng, N, nm2, [
        [m + (b - a), "Added the whole change to the mean instead of sharing it among the values"],
        [m + (a - b) / n, "Applied the change in the wrong direction"],
        [m + (b - a) / (n + 1), "Shared the change among one extra value"],
        [(m * n - a + b) / (n - 1), "Divided the new total by one less than the number of values"],
        [m, "Assumed the mean stays the same"],
      ], fin(d, lead + T(rng, [`The mean of ${n} numbers is **${m}**. If one number, **${a}**, is replaced by **${b}**, what is the new mean?`, `${nm} computes the average of ${n} values as ${m}, then replaces ${a} by ${b}. Find the new average.`, `In a set of ${n} values with mean ${m}, the value ${a} is changed to ${b}. What is the new mean?`]),
        [`Old total = ${m} × ${n} = ${m * n}`, `New total = ${m * n} − ${a} + ${b} = ${m * n - a + b}`, `New mean = ${m * n - a + b} ÷ ${n} = **${N(R(nm2))}**`],
        "New mean = old mean + (new value − old value) ÷ n.",
        "Only one value changes, so the mean moves by the change divided by n, not by the whole change."));
    }
    // Hard
    const k = rng.int(0, 3);
    if (k === 0) {
      const n1 = rng.int(4, 30), n2 = rng.int(4, 30), m1 = rng.int(20, 80), m2 = rng.int(20, 80);
      const m = (n1 * m1 + n2 * m2) / (n1 + n2);
      if (m1 === m2 || n1 === n2 || !C(m)) return null;
      const g = T(rng, [["boys", "girls"], ["section A", "section B"], ["men", "women"], ["the morning batch", "the evening batch"]]);
      return mk(rng, N, m, [
        [(m1 + m2) / 2, "Took the simple average of the two means"],
        [(n1 * m1 + n2 * m2) / (n1 + n2 + 1), "Divided by one extra student"],
        [(n1 * m2 + n2 * m1) / (n1 + n2), "Swapped the group sizes"],
        [Math.abs(n1 * m1 - n2 * m2) / (n1 + n2), "Subtracted the two totals instead of adding"],
        [(n1 * m1 + n2 * m2) / Math.max(n1, n2), "Divided by the larger group size only"],
      ], fin(d, lead + T(rng, [`The average ${U[1] === "marks" ? "mark" : "value"} of ${n1} ${g[0]} is **${m1}** and of ${n2} ${g[1]} is **${m2}**. Find the average of all ${n1 + n2} together.`, `In a survey, ${n1} ${g[0]} have a mean of ${m1} and ${n2} ${g[1]} have a mean of ${m2}. What is the combined mean?`]),
        [`Total of the first group = ${n1} × ${m1} = ${n1 * m1}`, `Total of the second group = ${n2} × ${m2} = ${n2 * m2}`, `Combined mean = ${n1 * m1 + n2 * m2} ÷ ${n1 + n2} = **${N(R(m))}**`],
        "Combined mean = (n1·m1 + n2·m2) ÷ (n1 + n2); it lies closer to the mean of the bigger group.",
        "Never average the two averages unless the groups have equal size."));
    }
    if (k === 1) {
      const n = T(rng, [5, 7, 9]), m = rng.int(10, 60), p = (n + 1) / 2, f = p, b = n - p + 1;
      const fm = rng.int(10, 60), bm = rng.int(10, 60);
      const x = f * fm + b * bm - n * m;
      if (x < 1 || x > 150 || fm === bm) return null;
      return mk(rng, N, x, [
        [n * m - (f * fm + b * bm), "Subtracted in the wrong order"],
        [(fm + bm) / 2, "Averaged the two partial means"],
        [f * fm + b * bm - (n - 1) * m, "Used n − 1 values for the whole total"],
        [m, "Assumed the middle number equals the overall mean"],
        [f * fm + b * bm, "Gave the sum of the two partial totals"],
      ], fin(d, lead + `The mean of ${n} numbers is **${m}**. The mean of the first ${f} numbers is **${fm}** and the mean of the last ${b} numbers is **${bm}**. Find the ${["", "", "", "", "", "3rd", "", "4th", "", "5th"][n]} (middle) number.`,
        [`Total of all ${n} = ${m} × ${n} = ${n * m}`, `First ${f} total = ${f * fm}; last ${b} total = ${b * bm}`, `The middle number is counted twice in these: ${f * fm} + ${b * bm} − ${n * m} = **${x}**`],
        "Middle number = (sum of the two partial totals) − (total of all).",
        "The middle number belongs to both groups, so it is counted twice when the two partial totals are added."));
    }
    if (k === 2) {
      const n = rng.int(8, 30), m = rng.int(30, 70), a = rng.int(10, 90), b = rng.int(10, 90);
      if (a === b) return null;
      const right = m + (a - b) / n;
      return mk(rng, N, right, [
        [m + (b - a) / n, "Corrected in the wrong direction"],
        [m + (a - b), "Added the whole difference to the mean"],
        [m - (a - b) / n, "Subtracted the error that should have been added"],
        [(m * n + a - b) / (n - 1), "Divided by n − 1"],
        [m, "Left the mean unchanged"],
      ], fin(d, lead + T(rng, [`The mean of ${n} observations was computed as **${m}**, but one observation was wrongly read as **${b}** instead of **${a}**. Find the correct mean.`, `While finding the average of ${n} readings, ${nm} copied ${a} as ${b}, and got ${m}. What is the correct average?`]),
        [`Wrong total = ${m} × ${n} = ${m * n}`, `Correct total = ${m * n} − ${b} + ${a} = ${m * n - b + a}`, `Correct mean = ${m * n - b + a} ÷ ${n} = **${N(R(right))}**`],
        "Correct mean = wrong mean + (right value − wrong value) ÷ n.",
        "Remove the wrong value from the total and add the right one; only then divide."));
    }
    const n = rng.int(10, 40), m = rng.int(30, 60), x = rng.int(20, 80);
    const join = rng.chance(0.5), nm3 = join ? (m * n + x) / (n + 1) : (m * n - x) / (n - 1);
    if (!C(nm3) || x === m) return null;
    return mk(rng, N, nm3, [
      [join ? (m * n + x) / n : (m * n - x) / n, "Divided by the original number of values"],
      [join ? (m * n - x) / (n - 1) : (m * n + x) / (n + 1), "Removed instead of adding (or added instead of removing)"],
      [(m + x) / 2, "Averaged the old mean with the single value"],
      [join ? m + (x - m) / n : m - (x - m) / (n - 1), "Spread the change over the wrong number of values"],
      [m, "Assumed the mean does not change"],
    ], fin(d, lead + (join ? T(rng, [`The average weight of ${n} students is **${m} kg**. A new student weighing **${x} kg** joins. What is the new average?`, `${n} workers have a mean wage of ${m} hundred rupees a day. A new worker earning ${x} hundred joins. Find the new mean (in hundreds).`]) : `The average of ${n} numbers is **${m}**. When the number **${x}** is removed, what is the average of the remaining ${n - 1}?`),
      join ? [`Old total = ${m} × ${n} = ${m * n}`, `New total = ${m * n} + ${x} = ${m * n + x}`, `New mean = ${m * n + x} ÷ ${n + 1} = **${N(R(nm3))}**`] : [`Old total = ${m} × ${n} = ${m * n}`, `Remaining total = ${m * n} − ${x} = ${m * n - x}`, `New mean = ${m * n - x} ÷ ${n - 1} = **${N(R(nm3))}**`],
      join ? "New mean = (old total + new value) ÷ (n + 1)." : "New mean = (old total − removed value) ÷ (n − 1).",
      "Rebuild the total first, then change the count as well as the total."));
  }) });

  /* ------------------------------------------------------------------ 2. range and standard deviation basics */
  // random deviations summing to zero, giving an integer-mean data set
  function dataSet(rng, n, mean0, spread) {
    for (let t = 0; t < 400; t++) {
      const dev = []; for (let i = 0; i < n - 1; i++) dev.push(rng.int(-spread, spread));
      dev.push(-sum(dev));
      if (Math.abs(dev[n - 1]) > spread + 2) continue;
      const a = dev.map((x) => x + mean0);
      if (new Set(a).size < n - 1) continue;
      return a;
    }
    return null;
  }
  const sqrtInt = (x) => { const r = Math.round(Math.sqrt(x)); return r * r === Math.round(x * 1e9) / 1e9 ? r : null; };
  QB.gen("quant/statistics/range-and-standard-deviation-basics", { title: "Range and standard deviation basics", gen: wrap((rng, d) => {
    const nm = T(rng, NAMES), lead = T(rng, LEAD), U = T(rng, UNITS);
    if (d === "Easy") {
      const k = rng.int(0, 1);
      const n = rng.int(6, 10), a = []; for (let i = 0; i < n; i++) a.push(rng.int(4, 99));
      const mx = Math.max.apply(null, a), mn = Math.min.apply(null, a), r = mx - mn;
      if (r < 5) return null;
      if (k === 0) return mk(rng, N, r, [
        [mx + mn, "Added the greatest and smallest values"],
        [mx, "Gave the greatest value"],
        [(mx + mn) / 2, "Gave the mid-range instead of the range"],
        [r + 1, "Counted both ends (range + 1)"],
        [r - 1, "Subtracted one too many"],
      ], fin(d, lead + T(rng, [`Find the range of ${list(a)}.`, `The ${U[0]} over ${n} days are ${list(a)}. What is the range?`, `${nm} noted ${list(a)}. What is the range of the data?`]),
        [`Greatest value = ${mx}, smallest value = ${mn}`, `Range = ${mx} − ${mn} = **${r}**`],
        "Range = maximum − minimum; scan the list once for each.",
        "The range is a difference, not a sum and not the maximum alone."));
      const lo = rng.int(3, 40), hi = lo + rng.int(10, 60), extra = rng.int(2, 9);
      const r2 = hi - lo;
      return mk(rng, N, r2, [
        [hi + lo, "Added the extreme values"],
        [hi, "Gave the greatest value"],
        [(hi + lo) / 2, "Gave the mid-range instead of the range"],
        [r2 + extra, "Added the number of observations"],
        [r2 + 1, "Counted both ends"],
      ], fin(d, lead + `In a group of ${extra + 8} people the youngest is **${lo}** years old and the oldest is **${hi}** years old. What is the range of their ages?`,
        [`Range = oldest − youngest = ${hi} − ${lo} = **${r2}**`],
        "Range = largest − smallest; the other values do not matter.",
        "The number of people is irrelevant to the range."));
    }
    if (d === "Medium") {
      const k = rng.int(0, 2);
      const n = T(rng, [4, 5, 6]), m0 = rng.int(8, 40), a = dataSet(rng, n, m0, 6);
      if (!a || mean(a) !== m0) return null;
      const ssd = sum(a.map((x) => (x - m0) * (x - m0))), v = ssd / n;
      if (k === 0) {
        if (!C(v)) return null;
        return mk(rng, N, v, [
          [ssd / (n - 1), "Divided by n − 1 (the sample formula) instead of n"],
          [ssd, "Gave the sum of squared deviations without dividing"],
          [Math.sqrt(v), "Gave the standard deviation instead of the variance"],
          [sum(a.map((x) => Math.abs(x - m0))) / n, "Gave the mean absolute deviation"],
          [sum(a.map((x) => x * x)) / n, "Averaged the squares of the values without subtracting the mean squared"],
        ], fin(d, lead + T(rng, [`Find the variance of ${list(a)}.`, `${nm} measures ${list(a)} (${U[1]}). Calculate the variance of this data.`]),
          [`Mean = ${sum(a)} ÷ ${n} = ${m0}`, `Deviations: ${a.map((x) => N(x - m0)).join(", ")}`, `Squares: ${a.map((x) => N((x - m0) * (x - m0))).join(" + ")} = ${ssd}`, `Variance = ${ssd} ÷ ${n} = **${N(R(v))}**`],
          "Variance = (sum of squared deviations from the mean) ÷ n.",
          "Square the deviations before adding them; the plain deviations always add up to zero."));
      }
      if (k === 1) {
        return mk(rng, N, ssd, [
          [0, "Added the deviations without squaring them"],
          [ssd / n, "Divided by n, which gives the variance, not the sum of squares"],
          [sum(a.map((x) => x * x)), "Added the squares of the values themselves"],
          [ssd + n, "Added n to the correct total"],
          [ssd - n, "Subtracted n from the correct total"],
          [sum(a.map((x) => Math.abs(x - m0))), "Added the absolute deviations"],
        ], fin(d, lead + `For the data ${list(a)}, find the sum of the squares of the deviations from the mean.`,
          [`Mean = ${m0}`, `Deviations: ${a.map((x) => N(x - m0)).join(", ")}`, `Sum of squares = ${a.map((x) => N((x - m0) * (x - m0))).join(" + ")} = **${ssd}**`],
          "Find the mean, square each gap, then add.",
          "Squaring removes the signs; adding the raw deviations gives 0."));
      }
      const md = sum(a.map((x) => Math.abs(x - m0))) / n;
      return mk(rng, N, md, [
        [v, "Gave the variance (the mean of the squares)"],
        [Math.sqrt(v), "Gave the standard deviation"],
        [sum(a.map((x) => Math.abs(x - m0))), "Did not divide by the number of values"],
        [0.5 * md + md, "Over-counted the deviations"],
        [md + 1, "Slipped by one in the sum of deviations"],
      ], fin(d, lead + `Find the mean deviation about the mean of ${list(a)}.`,
        [`Mean = ${m0}`, `Absolute deviations: ${a.map((x) => Math.abs(x - m0)).join(", ")}`, `Mean deviation = ${sum(a.map((x) => Math.abs(x - m0)))} ÷ ${n} = **${N(R(md))}**`],
        "Mean deviation = average of |x − mean|.",
        "Use the absolute value of each deviation; do not square them."));
    }
    // Hard
    const k = rng.int(0, 3);
    if (k === 0) {
      for (let t = 0; t < 400; t++) {
        const n = T(rng, [4, 5, 6, 8, 10]), m0 = rng.int(10, 50), a = dataSet(rng, n, m0, 7);
        if (!a || mean(a) !== m0) continue;
        const v = pop(a), s = sqrtInt(v);
        if (!s || s < 2) continue;
        return mk(rng, N, s, [
          [v, "Gave the variance and did not take the square root"],
          [Math.sqrt(sum(a.map((x) => (x - m0) * (x - m0))) / (n - 1)), "Used n − 1 instead of n"],
          [sum(a.map((x) => Math.abs(x - m0))) / n, "Gave the mean absolute deviation"],
          [Math.sqrt(v) + 1, "Slipped by one in the squares"],
          [Math.sqrt(v) - 1, "Slipped by one in the squares"],
          [s * 2, "Took twice the standard deviation"],
        ], fin(d, lead + T(rng, [`Find the standard deviation of ${list(rng.shuffle(a))} (treat it as the whole population).`, `${nm} measures ${list(rng.shuffle(a))}. Calculate the population standard deviation.`]),
          [`Mean = ${sum(a)} ÷ ${n} = ${m0}`, `Squared deviations: ${a.map((x) => (x - m0) * (x - m0)).join(" + ")} = ${sum(a.map((x) => (x - m0) * (x - m0)))}`, `Variance = ${sum(a.map((x) => (x - m0) * (x - m0)))} ÷ ${n} = ${N(R(v))}`, `SD = √${N(R(v))} = **${s}**`],
          "SD = √(sum of squared deviations ÷ n).",
          "Remember the final square root; the variance is the squared quantity."));
      }
      return null;
    }
    if (k === 1) {
      const dd = rng.int(1, 12), m0 = rng.int(20, 90), a = []; for (let i = -3; i <= 3; i++) a.push(m0 + i * dd);
      const ans = 2 * dd;
      return mk(rng, N, ans, [
        [4 * dd * dd, "Gave the variance (4d²) instead of the standard deviation"],
        [dd * Math.sqrt(48 / 7), "Used the sample formula"],
        [3 * dd, "Took the largest deviation from the mean"],
        [dd, "Took the common difference as the standard deviation"],
        [6 * dd, "Took the range as the standard deviation"],
      ], fin(d, lead + `Seven numbers are in arithmetic progression with common difference **${dd}**. Find their standard deviation (population formula).`,
        [`Take the numbers as ${a.join(", ")}`, `Deviations from the mean ${m0}: ${[-3, -2, -1, 0, 1, 2, 3].map((i) => N(i * dd)).join(", ")}`, `Sum of squares = ${dd}² × (9+4+1+0+1+4+9) = ${28 * dd * dd}`, `Variance = ${28 * dd * dd} ÷ 7 = ${4 * dd * dd}, so SD = √${4 * dd * dd} = **${ans}**`],
        "For 7 equally spaced numbers, SD = 2 × common difference.",
        "Variance is d² × 4; do not forget to take the square root."));
    }
    if (k === 2) {
      const n = T(rng, [5, 8, 10, 20, 25, 40]), m0 = rng.int(5, 30), s = rng.int(2, 9);
      const sx = n * m0, sx2 = n * (s * s + m0 * m0);
      return mk(rng, N, s, [
        [s * s, "Gave the variance"],
        [Math.sqrt(sx2 / n), "Used the mean of squares without subtracting the squared mean"],
        [Math.sqrt(Math.abs(sx2 / n - m0)), "Subtracted the mean instead of the squared mean"],
        [Math.sqrt(sx2 / (n - 1) - m0 * m0), "Used n − 1 in the mean of squares"],
        [s + 1, "Slipped by one in the arithmetic"],
      ], fin(d, lead + `For ${n} observations, Σx = **${sx}** and Σx² = **${sx2}**. Find the standard deviation.`,
        [`Mean = ${sx} ÷ ${n} = ${m0}`, `Mean of squares = ${sx2} ÷ ${n} = ${N(R(sx2 / n))}`, `Variance = ${N(R(sx2 / n))} − ${m0}² = ${s * s}`, `SD = √${s * s} = **${s}**`],
        "Variance = Σx²/n − (Σx/n)²; then take the square root.",
        "Subtract the SQUARE of the mean from the mean of the squares."));
    }
    const a1 = rng.int(1, 30), b1 = a1 + 2 * rng.int(1, 12);
    const half = (b1 - a1) / 2;
    const cnt = T(rng, [3, 5, 8]);
    return mk(rng, N, half, [
      [b1 - a1, "Gave the range"],
      [half * half, "Gave the variance"],
      [(b1 - a1) / 4, "Divided the range by 4 instead of 2"],
      [(a1 + b1) / 2, "Gave the mean"],
      [Math.sqrt(half), "Took the square root of the half-range"],
    ], fin(d, lead + `A data set has ${cnt} values equal to **${a1}** and ${cnt} values equal to **${b1}**. What is its standard deviation?`,
      [`Mean = (${a1} + ${b1}) ÷ 2 = ${(a1 + b1) / 2}`, `Every value is ${half} away from the mean, so every squared deviation is ${half * half}`, `Variance = ${half * half}, so SD = **${half}**`],
      "Half the values at each end: SD = half the gap between the two values.",
      "The number of copies does not matter when the two groups are equal in size."));
  }) });

  /* ------------------------------------------------------------------ 3. effect of adding / multiplying every value */
  QB.gen("quant/statistics/effect-of-adding-multiplying-every", { title: "Effect of adding or multiplying every value", gen: wrap((rng, d) => {
    const nm = T(rng, NAMES), lead = T(rng, LEAD);
    const ctx = T(rng, [["marks", "mark"], ["salaries (in hundreds of rupees)", "salary"], ["weights (in kg)", "weight"], ["runs", "score"]]);
    if (d === "Easy") {
      const n = rng.int(5, 30), m = rng.int(10, 80), kk = T(rng, [2, 3, 4, 5, 6, 8, 10, 12, 15]);
      const op = rng.int(0, 2);
      const nmean = op === 0 ? m + kk : op === 1 ? m - kk : op === 2 ? m * kk : m;
      if (op === 1 && kk >= m) return null;
      const wt = ["is increased by", "is decreased by", "is multiplied by"][op];
      const nsum = nmean * n;
      return mk(rng, N, nmean, [
        [op === 0 ? m : op === 1 ? m : m + kk, op === 2 ? "Added the number instead of multiplying" : "Left the mean unchanged"],
        [op === 2 ? m * kk * n : m + kk * n, "Added or multiplied the total instead of the mean"],
        [op === 0 ? m - kk : op === 1 ? m + kk : m / kk, "Used the inverse operation"],
        [op === 2 ? m + kk * n : m + kk / n, "Shared the change among the values"],
        [op === 2 ? m * kk / n : (m * n + kk) / n, "Applied the change to one value only"],
      ], fin(d, lead + T(rng, [`The mean of ${n} ${ctx[0]} is **${m}**. If every ${ctx[1]} ${wt} **${kk}**, what is the new mean?`, `${nm} has ${n} numbers with mean ${m}. Each number ${wt} ${kk}. Find the new mean.`]),
        [`The same operation applies to the mean`, `New mean = ${op === 2 ? m + " × " + kk : m + (op === 0 ? " + " : " − ") + kk} = **${N(nmean)}**`],
        `Adding or subtracting k from every value shifts the mean by k; multiplying by k multiplies the mean by k.`,
        "The mean follows the same operation as the data; it is not divided by n again."));
    }
    const sd0 = rng.int(2, 12), m = rng.int(15, 70), n = rng.int(8, 40);
    if (d === "Medium") {
      const kk = T(rng, [2, 3, 4, 5, 10]), add = rng.int(2, 25);
      const q = rng.int(0, 4);
      if (q === 0) return mk(rng, N, sd0, [
        [sd0 + add, "Added the shift to the standard deviation"],
        [sd0 - add > 0 ? sd0 - add : sd0 * add, "Changed the spread by the shift"],
        [sd0 * add, "Multiplied the SD by the shift"],
        [sd0 * sd0, "Squared the standard deviation"],
        [sd0 + 1, "Slipped by one"],
      ], fin(d, lead + `The standard deviation of ${n} ${ctx[0]} is **${sd0}**. If **${add}** is added to every ${ctx[1]}, what is the new standard deviation?`,
        ["Adding the same number to every value moves all of them together", "The gaps between the values, and so the spread, do not change", `New SD = **${sd0}**`],
        "Shifting every value leaves the range, variance and SD unchanged.",
        "Only multiplication changes the spread; adding a constant never does."));
      if (q === 1) return mk(rng, N, sd0 * kk, [
        [sd0 + kk, "Added the multiplier instead of multiplying"],
        [sd0 * kk * kk, "Multiplied the SD by k² (that is the rule for the variance)"],
        [sd0, "Assumed the spread does not change"],
        [sd0 / kk, "Divided instead of multiplied"],
        [sd0 * kk + kk, "Added the multiplier after multiplying"],
      ], fin(d, lead + `The standard deviation of a set of ${ctx[0]} is **${sd0}**. Every value is multiplied by **${kk}**. Find the new standard deviation.`,
        ["Multiplying by k stretches every gap by k", `New SD = ${sd0} × ${kk} = **${sd0 * kk}**`],
        "SD scales by |k|, variance by k².",
        "The SD is multiplied by k, not by k²."));
      if (q === 2) {
        const v = sd0 * sd0;
        return mk(rng, N, v * kk * kk, [
          [v * kk, "Multiplied the variance by k instead of k²"],
          [v + kk, "Added the multiplier to the variance"],
          [sd0 * kk, "Gave the new standard deviation instead of the variance"],
          [v, "Assumed the variance does not change"],
          [v * kk * kk * kk, "Used k³"],
        ], fin(d, lead + `The variance of a data set is **${v}**. If every value is multiplied by **${kk}**, what is the new variance?`,
          [`SD = √${v} = ${sd0}`, `New SD = ${sd0} × ${kk} = ${sd0 * kk}`, `New variance = ${sd0 * kk}² = **${v * kk * kk}**`],
          `Variance is multiplied by k² = ${kk * kk}.`,
          "Variance scales by the SQUARE of the multiplier."));
      }
      if (q === 3) {
        const a = rng.int(10, 60), b = a + rng.int(8, 60);
        return mk(rng, N, (b - a) * kk, [
          [(b - a) + kk, "Added the multiplier to the range"],
          [(b - a) * kk * kk, "Squared the multiplier"],
          [b - a, "Assumed the range does not change"],
          [b * kk - a, "Multiplied only the larger value"],
          [(b + add - a), "Added a shift to only one end"],
        ], fin(d, lead + `The smallest and largest of a set of ${ctx[0]} are **${a}** and **${b}**. Every value is multiplied by **${kk}**. Find the new range.`,
          [`Old range = ${b} − ${a} = ${b - a}`, `New range = ${b - a} × ${kk} = **${(b - a) * kk}**`],
          "Range is multiplied by the multiplier.",
          "Multiply the whole range, not just one end."));
      }
      const md = rng.int(8, 60);
      return mk(rng, N, md * kk + add, [
        [md * (kk + add), "Added the shift before multiplying"],
        [(md + add) * kk, "Added the shift before multiplying"],
        [md * kk, "Forgot the shift"],
        [md + kk + add, "Added both numbers"],
        [md * kk - add, "Subtracted the shift"],
      ], fin(d, lead + `The median of a data set is **${md}**. Every value is multiplied by **${kk}** and then **${add}** is added. What is the new median?`,
        [`After multiplying: ${md} × ${kk} = ${md * kk}`, `After adding: ${md * kk} + ${add} = **${md * kk + add}**`],
        "Median (like the mean and mode) goes through the same operations in the same order.",
        "Do the operations in the stated order: multiply first, then add."));
    }
    // Hard: y = a x + b
    const kind = rng.int(0, 3);
    const a = T(rng, [2, 3, 4, 5, -2, -3, 0.5, 1.5, 1.8, 2.5]), b = T(rng, [5, 10, 12, 20, 32, 50, -5, -10]);
    const mm = m, ss = sd0;
    const nmean = a * mm + b, nsd = Math.abs(a) * ss, nvar = a * a * ss * ss;
    const sgn = (v) => (v < 0 ? "−" + Math.abs(v) : String(v));
    const tr = `y = ${a === 1 ? "" : sgn(a)}x ${b < 0 ? "−" : "+"} ${Math.abs(b)}`.replace("= -", "= −");
    if (kind === 0) {
      if (nmean <= 0) return null;
      return mk(rng, N, nmean, [
        [mm + b, "Added the shift but forgot to multiply the mean"],
        [a * (mm + b), "Added the shift before multiplying"],
        [a * mm, "Forgot the shift"],
        [Math.abs(a) * mm + Math.abs(b), "Dropped a sign"],
        [nsd, "Gave the new standard deviation instead of the mean"],
      ], fin(d, lead + `The mean and standard deviation of ${n} readings x are **${mm}** and **${ss}**. Each reading is transformed by ${tr}. Find the mean of the new readings.`,
        [`New mean = ${sgn(a)} × ${mm} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = **${N(R(nmean))}**`],
        "Mean obeys the same formula: new mean = a·mean + b.",
        "The shift b is added after the multiplication, once, not multiplied."));
    }
    if (kind === 1) {
      if (nsd <= 0) return null;
      return mk(rng, N, nsd, [
        [nsd + Math.abs(b), "Added the shift to the standard deviation"],
        [a * ss + b, "Treated SD like the mean"],
        [nvar, "Gave the variance"],
        [ss, "Assumed the spread does not change"],
        [Math.abs(a) * ss * Math.abs(a), "Used a² on the SD"],
      ], fin(d, lead + `The mean and standard deviation of ${n} readings x are **${mm}** and **${ss}**. Each reading is transformed by ${tr}. Find the standard deviation of the new readings.`,
        [`The shift b = ${b} does not affect the spread`, `New SD = |${sgn(a)}| × ${ss} = **${N(R(nsd))}**`],
        "New SD = |a| × SD; the shift b has no effect.",
        "A negative multiplier gives a positive SD: use the absolute value."));
    }
    if (kind === 2) {
      if (nvar <= 0) return null;
      return mk(rng, N, nvar, [
        [nsd, "Gave the standard deviation instead of the variance"],
        [Math.abs(a) * ss * ss, "Multiplied the variance by |a| instead of a²"],
        [ss * ss, "Assumed the variance does not change"],
        [a * a * ss * ss + b * b, "Added b² to the variance"],
        [(a * ss + b) * (a * ss + b), "Squared the transformed standard deviation"],
      ], fin(d, lead + `The mean and standard deviation of ${n} readings x are **${mm}** and **${ss}**. Each reading is transformed by ${tr}. Find the variance of the new readings.`,
        [`New SD = |${sgn(a)}| × ${ss} = ${N(R(nsd))}`, `New variance = ${N(R(nsd))}² = **${N(R(nvar))}**`],
        "New variance = a² × old variance (b is ignored).",
        "Variance is multiplied by a², and the shift never matters."));
    }
    const tot = nmean * n;
    if (!(tot > 0)) return null;
    return mk(rng, N, tot, [
      [a * mm * n + b, "Added the shift only once to the total"],
      [mm * n, "Gave the original total"],
      [a * mm * n, "Forgot the shift in every value"],
      [nmean, "Gave the new mean instead of the new total"],
      [a * (mm * n + b), "Added the shift once before multiplying"],
    ], fin(d, lead + `The mean of ${n} readings x is **${mm}**. Each reading is transformed by ${tr}. Find the sum of the ${n} new readings.`,
      [`New mean = ${sgn(a)} × ${mm} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${N(R(nmean))}`, `Sum = ${N(R(nmean))} × ${n} = **${N(R(tot))}**`],
      "New sum = a × old sum + b × n.",
      "The shift b is added to EVERY reading, so the total changes by b × n."));
  }) });
})();
