/* =====================================================================
   Averages: seven question generators (one per catalog pattern).
   ===================================================================== */
(function () {
  const N = (x) => QB.num(x), R = (x) => QB.round(x, 2), M = (x) => QB.money(x);
  const C = (x) => isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const T = (rng, a) => rng.pick(a);
  const TIME = { Easy: 35, Medium: 60, Hard: 95 };
  const NAMES = ["Arjun", "Meera", "Kabir", "Sneha", "Rohit", "Divya", "Imran", "Lakshmi", "Vikram", "Pooja", "Farhan", "Nisha"];

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("averages: no clean question found");
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
      seen.add(t.toLowerCase());
      pairs.push([t, w[1]]);
    }
    if (pairs.length < 4) return null;
    const o = QB.options(rng, pairs);
    return Object.assign({ time: TIME[extra.d] }, extra, o, { calc: String(R(ans)) });
  }
  const fin = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });
  const list = (a) => a.map(N).join(", ");

  /* 1. basic averages */
  QB.gen("quant/averages/basic-averages", { title: "Basic averages", gen: wrap((rng, d) => {
    if (d === "Easy") {
      const n = rng.int(4, 6), xs = Array.from({ length: n }, () => rng.int(8, 60) * (T(rng, [1, 5]))), s = xs.reduce((a, b) => a + b, 0);
      const ctx = T(rng, [
        `The marks of ${n} students are **${list(xs)}**. What is their average mark?`,
        `A shopkeeper's sales on ${n} days were **${list(xs)}** items. Find the average daily sales.`,
        `Find the average of the numbers **${list(xs)}**.`,
        `A bus carried **${list(xs)}** passengers on ${n} trips. What is the average number of passengers per trip?`]);
      return mk(rng, N, s / n, [
        [s, "Gave the total and forgot to divide by the count"],
        [s / (n + 1), `Divided by ${n + 1} instead of ${n}`],
        [s / (n - 1), `Divided by ${n - 1} instead of ${n}`],
        [(Math.max(...xs) + Math.min(...xs)) / 2, "Took the middle of the largest and smallest values"],
      ], fin(d, ctx, [`Sum = ${N(s)}`, `Average = sum ÷ count = ${N(s)} ÷ ${n} = **${N(s / n)}**`],
        "Pick a guess near the middle, add each number's gap from it, then divide the total gap by the count.",
        "Average is the total divided by how many values there are, not the total itself."));
    }
    if (d === "Medium") {
      const k = rng.int(0, 1), n = rng.int(5, 12), a = rng.int(20, 70);
      if (k === 0) {
        const nm = T(rng, NAMES), s = n * a;
        return mk(rng, N, s, [
          [a * (n + 1), `Multiplied by ${n + 1} instead of ${n}`], [a + n, "Added the average and the count"],
          [a * (n - 1), `Multiplied by ${n - 1} instead of ${n}`], [s / n, "Divided instead of multiplying"],
        ], fin(d, `The average age of **${n}** members of a club is **${a}** years. What is the sum of their ages?`,
          [`Sum = average × count = ${a} × ${n} = **${N(s)}**`], `${a} × ${n} = ${N(s)}.`, "Sum = average × number of items. Dividing gives a tiny number."));
      }
      const xs = Array.from({ length: n - 1 }, () => rng.int(a - 12, a + 12)), s = n * a, miss = s - xs.reduce((p, q) => p + q, 0);
      return mk(rng, N, miss, [
        [a, "Assumed the missing value equals the average"],
        [miss + a, "Subtracted only part of the known values"],
        [Math.abs(xs.reduce((p, q) => p + q, 0) - s + 2 * a) , "Mixed up the signs while subtracting"],
        [s / n + (n - 1), "Added the count to the average"],
      ], fin(d, `The average of **${n}** numbers is **${a}**. Of these, **${n - 1}** numbers are **${list(xs)}**. Find the remaining number.`,
        [`Total of all ${n} = ${a} × ${n} = ${N(s)}`, `Known sum = ${N(xs.reduce((p, q) => p + q, 0))}`, `Missing = ${N(s)} − ${N(xs.reduce((p, q) => p + q, 0))} = **${N(miss)}**`],
        "Add each known number's gap from the average; the missing number's gap cancels the total gap.",
        "Do not forget that the total is average × all n numbers, including the missing one."));
    }
    const k = rng.int(0, 1);
    if (k === 0) {
      const n = rng.int(5, 9), a = rng.int(2, 15), d0 = rng.int(2, 9);
      // average of first n multiples of a  = a(n+1)/2 ; asked: average of first n terms of AP
      const first = rng.int(3, 20), diff = d0, avg = first + diff * (n - 1) / 2;
      return mk(rng, N, avg, [
        [first + diff * (n - 1), "Gave the last term"], [first + diff * n / 2, `Used ${n}/2 instead of (${n}−1)/2 for the middle gap`],
        [first + diff * (n - 1) , "Took the last term as the average"], [(first + diff * (n - 1)) / 2, "Halved the last term only"],
      ], fin(d, `Find the average of the first **${n}** terms of the series that starts at **${first}** and goes up by **${diff}** each time.`,
        [`Terms are evenly spaced, so average = (first + last) ÷ 2`, `Last = ${first} + ${n - 1} × ${diff} = ${N(first + diff * (n - 1))}`, `Average = (${first} + ${N(first + diff * (n - 1))}) ÷ 2 = **${N(avg)}**`],
        "For evenly spaced values the average is the middle value, (first + last) ÷ 2.",
        "The average of an evenly spaced list is not the last term; it sits halfway."));
    }
    const n1 = rng.int(3, 8), n2 = rng.int(3, 8), a1 = rng.int(20, 60), a2 = rng.int(20, 60), tot = n1 + n2;
    const ans = (n1 * a1 + n2 * a2) / tot;
    return mk(rng, N, ans, [
      [(a1 + a2) / 2, "Averaged the two averages without weighting"], [n1 * a1 + n2 * a2, "Forgot to divide by the total count"],
      [(n1 * a1 + n2 * a2) / (tot - 1), `Divided by ${tot - 1} instead of ${tot}`], [(n1 * a1 + n2 * a2) / (tot + 1), `Divided by ${tot + 1} instead of ${tot}`],
    ], fin(d, `The average of the first **${n1}** numbers is **${a1}** and the average of the next **${n2}** numbers is **${a2}**. What is the average of all **${tot}** numbers?`,
      [`Sum of first group = ${n1} × ${a1} = ${n1 * a1}`, `Sum of second group = ${n2} × ${a2} = ${n2 * a2}`, `Overall = ${n1 * a1 + n2 * a2} ÷ ${tot} = **${N(ans)}**`],
      "Weight each average by its count; the answer lies closer to the larger group's average.",
      "Averaging the two averages is only right when both groups have the same size."));
  }) });

  /* 2. new member replaces one */
  QB.gen("quant/averages/new-member-replaces-one", { title: "New member replaces one", gen: wrap((rng, d) => {
    const n = d === "Easy" ? rng.int(4, 8) : rng.int(5, 15);
    const up = rng.chance(0.55), ch = d === "Hard" ? T(rng, [1.5, 2.5, 0.5, 3.5, 2, 3]) : rng.int(1, 5);
    const old = rng.int(40, 75), delta = n * ch;
    const nw = up ? old + delta : old - delta;
    const mode = d === "Easy" ? 0 : rng.int(0, 1) + (d === "Hard" ? 1 : 0);
    const ctx = T(rng, ["weight of a rowing team", "age of a cricket squad", "marks of a group", "height of a team"]);
    const unit = ctx.startsWith("weight") ? "kg" : ctx.startsWith("age") ? "years" : ctx.startsWith("height") ? "cm" : "marks";
    const word = up ? "increases" : "decreases";
    if (nw <= 0 || !C(nw)) return null;
    if (mode === 0 || mode === 1) {
      // find new member
      const q = mode === 0
        ? `The average ${ctx} of **${n}** members is calculated. When one member of **${old} ${unit}** is replaced by a new member, the average ${word} by **${N(ch)} ${unit}**. Find the value for the new member.`
        : `In a group of **${n}** people the average is some value. A person scoring **${old}** leaves and a new person joins, so the group average ${word} by **${N(ch)}**. What does the new person score?`;
      return mk(rng, N, nw, [
        [up ? old - delta : old + delta, `${up ? "Subtracted" : "Added"} the total change instead of ${up ? "adding" : "subtracting"}`],
        [up ? old + ch : old - ch, "Applied the change in average directly, not the change in total"],
        [up ? old + delta + n : old - delta - n, "Used n + 1 instead of n"], [old + delta + ch, "Added both the total change and the average change"],
        [old, "Assumed the new member has the same value as the old"],
      ], fin(d, q, [`Change in total = ${n} × ${N(ch)} = ${N(delta)}`, `New = ${old} ${up ? "+" : "−"} ${N(delta)} = **${N(nw)}**`],
        `Replacement changes the total by n × (change in average) = ${N(delta)}; adjust the old value by that.`,
        "The average moves by the total change divided by n, so multiply the average change by n to get the swap difference."));
    }
    // find the old member
    const q = `A team of **${n}** has its average ${word} by **${N(ch)}** when a member is replaced by a new one valued **${N(nw)}**. What was the value of the member who left?`;
    return mk(rng, N, old, [
      [up ? nw + delta : nw - delta, "Moved the change in the wrong direction"], [up ? nw - ch : nw + ch, "Used the change in average instead of the change in total"],
      [nw, "Gave the new member's value"], [up ? old + n : old - n, "Added n by mistake"],
    ], fin(d, q, [`Change in total = ${n} × ${N(ch)} = ${N(delta)}`, `Old = ${N(nw)} ${up ? "−" : "+"} ${N(delta)} = **${N(old)}**`],
      `Total changed by ${N(delta)} because of the swap, so old and new differ by ${N(delta)}.`,
      "If the average went up, the newcomer is larger than the one who left."));
  }) });

  /* 3. members added / removed */
  QB.gen("quant/averages/members-added-removed", { title: "Members added / removed", gen: wrap((rng, d) => {
    const n = rng.int(4, 12), a = rng.int(20, 60);
    const kind = d === "Easy" ? 0 : d === "Medium" ? rng.int(1, 2) : rng.int(3, 4);
    const S = n * a;
    if (kind === 0) {
      const b = rng.int(a + 2, a + 25), k = rng.int(1, 3);
      const na = (S + k * b) / (n + k);
      return mk(rng, N, na, [
        [(a + b) / 2, "Took a simple average of a and b"], [(S + k * b) / n, `Divided by ${n} instead of ${n + k}`],
        [S + k * b, "Forgot to divide"], [(S + b) / (n + 1), "Added only one person instead of all new people"],
      ], fin(d, `The average age of **${n}** friends is **${a}** years. **${k}** more friend${k > 1 ? "s" : ""} aged **${b}** each join${k > 1 ? "" : "s"} them. What is the new average age?`,
        [`Old total = ${n} × ${a} = ${S}`, `New total = ${S} + ${k} × ${b} = ${S + k * b}`, `New average = ${S + k * b} ÷ ${n + k} = **${N(na)}**`],
        `Each newcomer is ${b - a} above the old average; spread ${k * (b - a)} over ${n + k} people.`,
        "Count the new members in the denominator."));
    }
    if (kind === 1) {
      const ch = rng.int(1, 4), nw = a + ch * (n + 1);
      return mk(rng, N, nw, [
        [a + ch, "Added the change to the old average only"], [a + ch * n, `Used ${n} instead of ${n + 1} people`],
        [a + ch * (n + 2), "Used one person too many"], [a + ch * (n + 1) - ch, "Subtracted the change once more"],
      ], fin(d, `The average salary (in thousands of ₹) of **${n}** employees is **${a}**. When a new employee joins, the average rises by **${ch}**. What is the new employee's salary (in thousands)?`,
        [`Old total = ${n} × ${a} = ${S}`, `New total = ${n + 1} × ${a + ch} = ${(n + 1) * (a + ch)}`, `New employee = ${(n + 1) * (a + ch)} − ${S} = **${N(nw)}**`],
        `New person = old average + (n + 1) × rise = ${a} + ${n + 1} × ${ch} = ${nw}.`,
        "After the newcomer there are n + 1 people, so the rise is multiplied by n + 1."));
    }
    if (kind === 2) {
      const ch = rng.int(1, 4), lv = a - ch * (n - 1);
      if (lv <= 0) return null;
      return mk(rng, N, lv, [
        [a - ch * n, `Used ${n} instead of ${n - 1}`], [a + ch * (n - 1), "Applied the rise in the wrong direction"],
        [a - ch, "Subtracted the change in average only"], [a - ch * (n + 1), `Used ${n + 1} remaining people`],
      ], fin(d, `The average height of **${n}** students is **${a}** cm. When one student leaves, the average becomes **${a + ch}** cm. What is the height of the student who left?`,
        [`Old total = ${n} × ${a} = ${S}`, `New total = ${n - 1} × ${a + ch} = ${(n - 1) * (a + ch)}`, `Leaver = ${S} − ${(n - 1) * (a + ch)} = **${N(lv)}**`],
        `Leaver = old average − (n − 1) × rise = ${a} − ${n - 1} × ${ch} = ${lv}.`,
        "When someone leaves there are n − 1 people left, not n."));
    }
    if (kind === 3) {
      const k = rng.int(2, 4), b = rng.int(a - 10, a + 15), m = n + k;
      const newAvg = (S + k * b) / m;
      if (b === a) return null;
      const dev = newAvg - a;
      return mk(rng, N, newAvg, [
        [(a + b) / 2, "Took a simple average of the two group averages"], [(S + k * b) / n, `Divided by ${n} not ${m}`],
        [a + (b - a) / 2, "Used the midpoint of the two averages"], [a + (b - a) * k / n, `Weighted by k/n = ${k}/${n} instead of ${k}/${m}`],
      ], fin(d, `A class of **${n}** students has an average mark of **${a}**. Another section of **${k}** students with an average of **${b}** is merged into it. Find the average of the combined class.`,
        [`Total = ${n} × ${a} + ${k} × ${b} = ${S + k * b}`, `Average = ${S + k * b} ÷ ${m} = **${N(newAvg)}**`],
        `Shift from ${a} by (${b} − ${a}) × ${k}/${m}.`, "Weights are the group sizes, with the combined size as the divisor."));
    }
    const out = rng.int(2, 3), b = rng.int(a - 8, a + 12);
    if (out >= n - 1) return null;
    const rest = (S - out * b) / (n - out);
    return mk(rng, N, rest, [
      [(S - b) / (n - 1), "Removed only one person"], [(S - out * b) / n, `Divided by ${n} instead of ${n - out}`],
      [a - (b - a), "Reflected the gap about the old average"], [S - out * b, "Forgot to divide"],
    ], fin(d, `The average weight of **${n}** boys is **${a}** kg. **${out}** of them, whose average weight is **${b}** kg, leave. What is the average weight of the remaining boys?`,
      [`Total = ${S}`, `Leavers' total = ${out} × ${b} = ${out * b}`, `Remaining = (${S} − ${out * b}) ÷ ${n - out} = **${N(rest)}**`],
      `Remaining average = ${a} + ${out} × (${a} − ${b}) ÷ ${n - out}.`, "Subtract the leavers' total, then divide by those still present."));
  }) });

  /* 4. consecutive numbers */
  QB.gen("quant/averages/consecutive-numbers", { title: "Consecutive numbers", gen: wrap((rng, d) => {
    if (d === "Easy") {
      const n = T(rng, [5, 7, 9, 11, 13, 15]), first = rng.int(3, 400), last = first + n - 1, avg = (first + last) / 2;
      const q = T(rng, [`Find the average of **${n}** consecutive integers starting from **${first}**.`, `What is the mean of the **${n}** consecutive whole numbers beginning with **${first}**?`]);
      return mk(rng, N, avg, [[last, "Gave the last number"], [first, "Gave the first number"], [avg + 1, "Counted one step too far"], [avg - 1, "Stopped one step short"]],
        fin(d, q, [`Numbers: ${first} to ${last}`, `Average = (${first} + ${last}) ÷ 2 = **${N(avg)}**`], `Average of consecutive numbers = the middle number = ${N(avg)}.`, "The average is the middle term, not the last."));
    }
    if (d === "Medium") {
      const kind = rng.int(0, 2), n = T(rng, [5, 7, 9, 11]), step = kind === 0 ? 1 : 2, first = rng.int(2, 300);
      const f0 = kind === 1 ? first * 2 : kind === 2 ? first * 2 + 1 : first;
      const last = f0 + step * (n - 1), avg = (f0 + last) / 2;
      const nm = kind === 0 ? "consecutive integers" : kind === 1 ? "consecutive even numbers" : "consecutive odd numbers";
      return mk(rng, N, last, [
        [f0, "Gave the smallest number"], [avg, "Gave the average, not the largest"], [avg + step * (n - 1), "Added the whole spread to the average"],
        [last + step, "Took one term too many"],
      ], fin(d, `The average of **${n}** ${nm} is **${N(avg)}**. What is the largest of them?`,
        [`Average is the middle term; there are ${(n - 1) / 2} terms on each side`, `Largest = ${N(avg)} + ${(n - 1) / 2} × ${step} = **${N(last)}**`],
        `Largest = average + ${(n - 1) / 2} × ${step}.`, "Count the steps from the middle to the end, not all n − 1."));
    }
    const kind = rng.int(0, 1);
    if (kind === 0) {
      const n = T(rng, [4, 6, 8, 10, 12]), first = rng.int(5, 300), last = first + n - 1, avg = (first + last) / 2;
      return mk(rng, N, last, [
        [avg, "Gave the average instead of the largest"], [first, "Gave the smallest"], [last + 1, "Counted one step too far"], [last - 1, "Stopped one step short"],
      ], fin(d, `The sum of **${n}** consecutive integers is **${N(n * avg)}**. What is the largest of them?`, [`Average = ${N(n * avg)} ÷ ${n} = ${N(avg)}`, `The middle falls between ${first + n / 2 - 1} and ${first + n / 2}; largest = ${N(avg)} + ${N(n / 2 - 0.5)} = **${N(last)}**`], `Average ${N(avg)}; the largest is ${N(n / 2 - 0.5)} above it.`, "With an even count the average is a half-integer between the two middle terms."));
    }
    const n = T(rng, [5, 7, 9]), mid = rng.int(10, 300) * 2, step = 2, first = mid - step * (n - 1) / 2, last = mid + step * (n - 1) / 2;
    const prodS = first + last;
    return mk(rng, N, first, [
      [first + step, "Counted one place from the middle too few"], [mid, "Gave the middle value"], [mid - (n - 1) * step, "Subtracted the full spread from the middle"], [first - step, "Counted one place from the middle too many"],
    ], fin(d, `The sum of **${n}** consecutive even numbers is **${N(n * mid)}**. What is the smallest of them?`,
      [`Average = ${N(n * mid)} ÷ ${n} = ${N(mid)} (the middle term)`, `Smallest = ${N(mid)} − ${(n - 1) / 2} × 2 = **${N(first)}**`],
      `Middle ${N(mid)} minus ${(n - 1) / 2} gaps of 2.`, "Only half the spread lies below the middle."));
  }) });

  /* 5. cricket averages */
  QB.gen("quant/averages/cricket-averages", { title: "Cricket averages", gen: wrap((rng, d) => {
    const nm = T(rng, ["Rahul", "Virat", "Smriti", "Shubman", "Harmanpreet", "Ruturaj", "Mandhana", "Ishan"]);
    const n = rng.int(6, 14), a = rng.int(25, 55), S = n * a;
    const kind = d === "Easy" ? 0 : d === "Medium" ? rng.int(1, 2) : rng.int(3, 4);
    if (kind === 0) {
      const sc = rng.int(a + 5, a + 40), na = (S + sc) / (n + 1);
      return mk(rng, N, na, [[(a + sc) / 2, "Took a simple average of the average and the new score"], [(S + sc) / n, `Divided by ${n} not ${n + 1}`], [S + sc, "Forgot to divide"], [(S + sc) / (n + 2), "Divided by one extra innings"]],
        fin(d, `${nm}'s average after **${n}** innings is **${a}**. He scores **${sc}** in the next innings. What is his new average?`,
          [`Total = ${n} × ${a} = ${S}`, `New total = ${S + sc}`, `New average = ${S + sc} ÷ ${n + 1} = **${N(na)}**`],
          `New average = ${a} + (${sc} − ${a}) ÷ ${n + 1}.`, "The new innings is included, so divide by n + 1."));
    }
    if (kind === 1) {
      const ch = rng.int(1, 4), sc = a + ch * (n + 1);
      return mk(rng, N, sc, [[a + ch, "Added the rise to the old average"], [a + ch * n, `Used ${n} instead of ${n + 1}`], [a + ch * (n + 2), "Used one innings too many"], [(n + 1) * (a + ch), "Gave the new total"]],
        fin(d, `${nm} has an average of **${a}** runs after **${n}** innings. How many runs must he score in the next innings to raise his average by **${ch}**?`,
          [`Target total = ${n + 1} × ${a + ch} = ${(n + 1) * (a + ch)}`, `Needed = ${(n + 1) * (a + ch)} − ${S} = **${N(sc)}**`],
          `Needed = ${a} + ${n + 1} × ${ch} = ${sc}.`, "The rise must be earned by every one of the n + 1 innings."));
    }
    if (kind === 2) {
      const ch = rng.int(1, 3), sc = a - ch * (n + 1);
      if (sc < 0) return null;
      return mk(rng, N, a - ch, [[sc, "Gave the score that caused the fall instead of the new average"], [a + ch, "Moved the average the wrong way"], [a - ch * 2, "Doubled the drop"], [a - ch * (n + 1), "Gave the innings score"]],
        fin(d, `${nm} scores **${sc}** in his latest innings, which lowers his average by **${ch}**. What is his average after that innings?`,
          [`Old avg = ${N(a)}, drop = ${ch}`, `New average = **${N(a - ch)}**`], "New average = old average − drop.", "Check what the question actually asks: the new average, not the score."));
    }
    if (kind === 3) {
      const m = rng.int(n, n + 6), tot = (n + 1) * (a + 2), sc = tot - S;
      const goal = a + 2;
      const after = (n + 1) * goal;
      return mk(rng, N, sc, [[goal, "Gave the target average"], [sc + n, "Added n to the answer"], [sc - 2, "Subtracted the rise once"], [sc + 2, "Added the rise once"]],
        fin(d, `${nm}'s batting average after **${n}** innings is **${a}**. What score in the **${n + 1}th** innings raises his average to **${goal}**?`,
          [`Needed total = ${n + 1} × ${goal} = ${after}`, `Score = ${after} − ${S} = **${N(sc)}**`], `Score = ${a} + ${n + 1} × 2 = ${sc}.`, "Use n + 1 innings for the new total."));
    }
    // dismissed for 0 or reduced average, find innings
    const sc2 = rng.int(8, 14) * 5, ch = rng.int(1, 3), nn = (sc2 - 0) / ch; // dummy
    const inn = rng.int(7, 16), av = rng.int(20, 50), ch2 = rng.int(1, 3);
    // avg increases by ch2 after scoring s: s = av + ch2*(inn+1)
    const s = av + ch2 * (inn + 1), avNew = av + ch2;
    return mk(rng, N, avNew, [[av, "Gave the old average"], [av + ch2 * 2, "Doubled the rise"], [s, "Gave the latest score"], [av - ch2, "Subtracted the rise"]],
      fin(d, `After **${inn}** innings a player averages **${av}**. In the **${inn + 1}th** innings he scores **${s}**. What is his new average?`,
        [`Total = ${inn} × ${av} = ${inn * av}`, `New total = ${inn * av + s}`, `Average = ${inn * av + s} ÷ ${inn + 1} = **${N(avNew)}**`],
        `Excess over average = ${s} − ${av} = ${s - av}; share it among ${inn + 1} innings = ${ch2}.`, "Divide the excess over the average by the new innings count."));
  }) });

  /* 6. weighted average */
  QB.gen("quant/averages/weighted-average", { title: "Weighted average", gen: wrap((rng, d) => {
    const kind = d === "Easy" ? 0 : d === "Medium" ? rng.int(1, 2) : rng.int(3, 4);
    if (kind === 0) {
      const n1 = rng.int(2, 6) * 5, n2 = rng.int(2, 6) * 5, a1 = rng.int(40, 80), a2 = rng.int(40, 80);
      const ans = (n1 * a1 + n2 * a2) / (n1 + n2);
      return mk(rng, N, ans, [[(a1 + a2) / 2, "Averaged the two averages without weights"], [n1 * a1 + n2 * a2, "Forgot to divide by the number of students"], [(n1 * a1 + n2 * a2) / (n1 + n2 + 1), "Divided by one too many"], [(n1 * a2 + n2 * a1) / (n1 + n2), "Swapped the weights"]],
        fin(d, `Section A has **${n1}** students with an average of **${a1}** marks and Section B has **${n2}** students with an average of **${a2}** marks. Find the average of all students.`,
          [`Total = ${n1} × ${a1} + ${n2} × ${a2} = ${n1 * a1 + n2 * a2}`, `Average = ${n1 * a1 + n2 * a2} ÷ ${n1 + n2} = **${N(ans)}**`], "The answer lies nearer the average of the larger group.", "A plain average of two averages ignores group sizes."));
    }
    if (kind === 1) {
      const a1 = rng.int(30, 60), a2 = a1 + rng.int(2, 6) * 5, n1 = rng.int(1, 4), n2 = rng.int(1, 4), n = n1 + n2, ans = a1 + (a2 - a1) * n2 / n;
      return mk(rng, N, ans, [[(a1 + a2) / 2, "Took the simple midpoint"], [a2 - (a2 - a1) * n2 / n, "Used the wrong weights"], [a1 * n1 + a2 * n2, "Gave the sum of price × quantity without dividing"], [(a1 + a2) * n / 2, "Multiplied the midpoint by the count"]],
        fin(d, `A shopkeeper mixes **${n1} kg** of rice at ₹**${a1}**/kg with **${n2} kg** of rice at ₹**${a2}**/kg. What is the average cost per kg of the mixture (in ₹)?`,
          [`Total cost = ${n1} × ${a1} + ${n2} × ${a2} = ${n1 * a1 + n2 * a2}`, `Weight = ${n}`, `Average = **${N(ans)}**`], "Move from the cheaper price by the gap × (quantity of dearer ÷ total).", "The mixture price is weighted by kilograms, not simply the midpoint."));
    }
    if (kind === 2) {
      const speed1 = T(rng, [30, 40, 50, 60]), s2 = speed1 + T(rng, [10, 20]), t1 = rng.int(1, 4), t2 = rng.int(1, 4), ans = (speed1 * t1 + s2 * t2) / (t1 + t2);
      return mk(rng, N, ans, [[(speed1 + s2) / 2, "Took the simple midpoint of the speeds"], [speed1 * t1 + s2 * t2, "Gave the total distance"], [ans + 1, "Rounded up"], [ans - 1, "Rounded down"]],
        fin(d, `A car travels for **${t1}** hours at **${speed1} km/h** and then **${t2}** hours at **${s2} km/h**. What is its average speed for the whole trip (km/h)?`,
          [`Distance = ${speed1 * t1} + ${s2 * t2} = ${speed1 * t1 + s2 * t2}`, `Time = ${t1 + t2}`, `Average = **${N(ans)}**`], "Weight each speed by the time spent at it.", "Equal times give the simple midpoint; unequal times do not."));
    }
    if (kind === 3) {
      const g = [rng.int(2, 5) * 4, rng.int(2, 5) * 4, rng.int(2, 5) * 4], av = [rng.int(40, 70), rng.int(40, 70), rng.int(40, 70)];
      const s = g[0] * av[0] + g[1] * av[1] + g[2] * av[2], n = g[0] + g[1] + g[2], ans = s / n;
      return mk(rng, N, ans, [[(av[0] + av[1] + av[2]) / 3, "Took a simple average of the three averages"], [s / (n - g[2]), "Left out the third group in the divisor"], [s, "Forgot to divide"], [s / (n + 1), "Divided by one extra"]],
        fin(d, `Three classes have **${g[0]}**, **${g[1]}** and **${g[2]}** students with average marks **${av[0]}**, **${av[1]}** and **${av[2]}**. Find the overall average.`,
          [`Total = ${g[0]}×${av[0]} + ${g[1]}×${av[1]} + ${g[2]}×${av[2]} = ${s}`, `Count = ${n}`, `Average = **${N(ans)}**`], "Weighted by class sizes.", "Do not average the three averages directly."));
    }
    // missing group
    const n1 = rng.int(3, 6) * 4, n2 = rng.int(2, 5) * 4, a1 = rng.int(50, 80), a2 = rng.int(40, 75), ov = rng.int(52, 72);
    const n = n1 + n2, ans = (ov * n - n1 * a1) / n2;
    if (ans <= 0) return null;
    return mk(rng, N, ans, [[2 * ov - a1, "Treated both groups as equal size"], [ov * n - n1 * a1, "Forgot to divide by the second group's size"], [(ov * n - n1 * a1) / n, "Divided by the whole count"], [ov, "Assumed the missing average equals the overall average"]],
      fin(d, `In a group of **${n}** workers, **${n1}** have an average salary of ₹**${a1}**00 and the group's overall average is ₹**${ov}**00. What is the average salary (in hundreds of ₹) of the other **${n2}** workers?`,
        [`Overall total = ${n} × ${ov} = ${n * ov}`, `Known part = ${n1} × ${a1} = ${n1 * a1}`, `Other group = (${n * ov} − ${n1 * a1}) ÷ ${n2} = **${N(ans)}**`], "Use deviations from the overall average: the groups' weighted deviations cancel.", "The unknown group's size is the divisor."));
  }) });

  /* 7. correcting a wrongly copied value */
  QB.gen("quant/averages/correcting-a-wrongly-copied-value", { title: "Correcting a wrongly copied value", gen: wrap((rng, d) => {
    const n = rng.int(5, 20), a = rng.int(20, 60), S = n * a;
    const nm = T(rng, ["marks", "weights", "ages", "heights"]);
    if (d === "Easy" || d === "Medium") {
      const wrong = rng.int(10, 50), right = d === "Easy" ? wrong + rng.int(2, 6) * n : rng.int(10, 60);
      if (right === wrong || (right - wrong) % n !== 0 && d === "Easy") return null;
      const ca = (S - wrong + right) / n;
      return mk(rng, N, ca, [[a, "Kept the old average"], [(S + right) / n, "Added the right value without removing the wrong one"], [(S - wrong + right) / (n + 1), `Divided by ${n + 1}`], [a - (right - wrong) / n, "Applied the correction in the wrong direction"]],
        fin(d, `The mean of **${n}** ${nm} was found to be **${a}**. Later it was found that one value was copied as **${wrong}** instead of **${right}**. What is the correct mean?`,
          [`Wrong total = ${n} × ${a} = ${S}`, `Correct total = ${S} − ${wrong} + ${right} = ${S - wrong + right}`, `Correct mean = ${S - wrong + right} ÷ ${n} = **${N(ca)}**`],
          `Change in mean = (${right} − ${wrong}) ÷ ${n}.`, "Subtract the wrong value and add the right one; the count stays the same."));
    }
    const kind = rng.int(0, 1);
    if (kind === 0) {
      const w1 = rng.int(10, 60), r1 = rng.int(10, 60), w2 = rng.int(10, 60), r2 = rng.int(10, 60), ds = (r1 - w1) + (r2 - w2);
      if (ds === 0 || ds % n !== 0) return null;
      const ca = a + ds / n;
      return mk(rng, N, ca, [[a + (r1 - w1) / n, "Fixed only the first error"], [a - ds / n, "Corrected in the wrong direction"], [a, "Ignored the errors"], [a + ds / (n - 1), `Divided by ${n - 1}`]],
        fin(d, `The average of **${n}** numbers is **${a}**. Two numbers were wrongly read as **${w1}** and **${w2}** instead of **${r1}** and **${r2}**. Find the correct average.`,
          [`Net correction = (${r1} − ${w1}) + (${r2} − ${w2}) = ${ds}`, `Correct total = ${S} + ${ds} = ${S + ds}`, `Correct average = **${N(ca)}**`],
          `Mean shifts by ${ds}/${n}.`, "Net the two corrections together before dividing."));
    }
    const wrong = rng.int(30, 60), diff = rng.int(1, 4), ca = a + diff, right = wrong + diff * n;
    return mk(rng, N, right, [[wrong + diff, "Added the rise in average, not the rise in total"], [wrong - diff * n, "Subtracted instead of adding"], [wrong + diff * (n - 1), `Used ${n - 1} instead of ${n}`], [wrong + diff * (n + 1), `Used ${n + 1} instead of ${n}`]],
      fin(d, `The average of **${n}** numbers was calculated as **${a}**. It was later found that one number was read as **${wrong}**, and the correct average is **${ca}**. What is the correct value of that number?`,
        [`Correct total − wrong total = ${n} × ${diff} = ${n * diff}`, `Right value = ${wrong} + ${n * diff} = **${N(right)}**`], `Right = wrong + n × (change in average) = ${right}.`, "Convert the change in average to a change in total by multiplying by n."));
  }) });
})();
