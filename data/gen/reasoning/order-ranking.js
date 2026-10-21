/* =====================================================================
   Order & ranking: rank from both ends, positions swapped, minimum
   number of people, rank among those who passed. All answers are
   counts; the minimum-people generator finds its answer by brute force.
   ===================================================================== */
(function () {
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 90 };
  const N = (x) => QB.num(x);
  const ord = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th");
  const finish = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });
  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 2000; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("order-ranking: no clean question found");
    };
  }
  function mkN(rng, ans, wrongs, extra) {
    if (!(ans >= 0) || !Number.isInteger(ans)) return null;
    const seen = new Set([ans]), pairs = [[N(ans), null]];
    for (const [v, why] of wrongs) { if (pairs.length === 4) break; if (!(v > 0) || !Number.isInteger(v) || seen.has(v)) continue; seen.add(v); pairs.push([N(v), why]); }
    if (pairs.length < 4) return null;
    return Object.assign({ time: TIME[extra.d] }, extra, QB.options(rng, pairs), { calc: String(ans) });
  }
  const NM = ["Aman", "Bhavna", "Chetan", "Deepa", "Esha", "Farhan", "Gita", "Harsh", "Isha", "Jatin", "Kiran", "Leela", "Manoj", "Nisha", "Omkar", "Pallavi", "Rahul", "Sana", "Tarun", "Uma", "Varun", "Yash"];
  const CTX = [
    { unit: "students", group: "a class", a: "from the top", b: "from the bottom", rankWord: "ranks", kind: "rank" },
    { unit: "candidates", group: "an entrance test", a: "from the top", b: "from the bottom", rankWord: "ranks", kind: "rank" },
    { unit: "people", group: "a queue at a ticket counter", a: "from the front", b: "from the back", rankWord: "stands", kind: "pos" },
    { unit: "children", group: "a row for the morning assembly", a: "from the left", b: "from the right", rankWord: "stands", kind: "pos" },
    { unit: "runners", group: "a marathon, listed by finishing order", a: "from the first", b: "from the last", rankWord: "finishes", kind: "pos" },
    { unit: "employees", group: "a performance list", a: "from the top", b: "from the bottom", rankWord: "is placed", kind: "rank" },
  ];
  const names = (rng, k) => rng.shuffle(NM).slice(0, k);

  /* ------------------------------------------------------------ 1. rank from both ends -> total */
  QB.gen("reasoning/order-ranking/rank-from-both-ends-total", { title: "Rank from both ends → total", gen: wrap((rng, d) => {
    const c = T(rng, CTX), [X, Y] = names(rng, 2);
    if (d === "Easy") {
      const p = rng.int(5, 35), q = rng.int(5, 35), n = p + q - 1;
      const t = rng.int(0, 1);
      const q1 = t === 0 ? `${X} ${c.rankWord} **${ord(p)}** ${c.a} and **${ord(q)}** ${c.b} in ${c.group}. How many ${c.unit} are there in all?`
        : `In ${c.group}, ${X} is **${ord(p)}** ${c.a} and **${ord(q)}** ${c.b}. What is the total number of ${c.unit}?`;
      return mkN(rng, n, [[p + q, "Added the two positions without removing the person counted twice"], [p + q - 2, "Removed the person twice"], [Math.abs(p - q), "Subtracted the two positions"], [Math.max(p, q), "Took only the larger position"]],
        finish(d, q1, [`${X} is counted in both positions, so total = ${p} + ${q} − 1`, `= **${n}**`], "Total = (rank from one end) + (rank from the other end) − 1.", "Add the two ranks and subtract 1 because the person is counted in both."));
    }
    if (d === "Medium") {
      const n = rng.int(25, 70), p = rng.int(5, n - 5), q = n - p + 1;
      const fromTop = rng.chance(0.5);
      const given = fromTop ? p : q, ans = fromTop ? q : p;
      const q1 = T(rng, [
        `In ${c.group} of **${n}** ${c.unit}, ${X} is **${ord(given)}** ${fromTop ? c.a : c.b}. What is ${X}'s position ${fromTop ? c.b : c.a}?`,
        `There are **${n}** ${c.unit} in ${c.group}. If ${X} is **${ord(given)}** ${fromTop ? c.a : c.b}, find ${X}'s position ${fromTop ? c.b : c.a}.`]);
      return mkN(rng, ans, [[n - given, "Gave the number of people beyond the person, not the position"], [n - given + 2, "Added 2 instead of 1"], [n + given, "Added instead of subtracting"], [given, "Repeated the given position"]],
        finish(d, q1, [`Position from the other end = total − given position + 1`, `= ${n} − ${given} + 1 = **${ans}**`], "Other-end position = total − given position + 1.", "Subtracting gives only the people beyond the person; add 1 to include the person."));
    }
    const k = rng.int(0, 2);
    if (k === 0) {                      // people between two persons, from opposite ends
      const n = rng.int(30, 70), p = rng.int(5, 25), q = rng.int(5, 25), btw = n - p - q;
      if (btw < 1) return null;
      const q1 = `In ${c.group} of **${n}** ${c.unit}, ${X} is **${ord(p)}** ${c.a} and ${Y} is **${ord(q)}** ${c.b}. How many ${c.unit} are there between ${X} and ${Y}?`;
      return mkN(rng, btw, [[btw + 1, "Counted one of the two people as well"], [btw + 2, "Counted both people"], [btw - 1, "Removed one person too many"], [n - p - q + 1 + 1 + 1, "Added 3 instead of subtracting"]],
        finish(d, q1, [`${X} has ${p - 1} ${c.unit} before ${X === Y ? "" : "him/her"}and ${Y} has ${q - 1} after, so the rest are between them.`.replace("before him/herand", "ahead,").replace("have ", ""), `Between = ${n} − ${p} − ${q} = **${btw}**`], "People between = total − (position from one end) − (position from the other end).", "Subtract both positions; do not add 1 here because neither person belongs in the count."));
    }
    if (k === 1) {                      // total known from X; Y's position
      const p = rng.int(8, 25), q = rng.int(8, 25), n = p + q - 1, r = rng.int(3, n - 3);
      if (r === p) return null;
      const ans = n - r + 1;
      const q1 = `${X} is **${ord(p)}** ${c.a} and **${ord(q)}** ${c.b} in ${c.group}. If ${Y} is **${ord(r)}** ${c.a}, what is ${Y}'s position ${c.b}?`;
      return mkN(rng, ans, [[n - r, "Gave the number of people beyond, not the position"], [q + r - p, "Mixed up the two people's positions"], [n + r - 1, "Added the positions"], [q - r, "Subtracted from the wrong total"]].map((x) => x),
        finish(d, q1, [`Total = ${p} + ${q} − 1 = ${n}`, `${Y}'s position ${c.b} = ${n} − ${r} + 1 = **${ans}**`], "Find the total first, then convert the other person's position.", "Find the total from the first person only; then switch ends for the second person."));
    }
    const p = rng.int(8, 25), q = rng.int(8, 25), n = p + q - 1, x = rng.int(3, 9);
    if (x >= p) return null;
    const q1 = `${X} is **${ord(p)}** ${c.a} and **${ord(q)}** ${c.b} in ${c.group}. If **${x}** ${c.unit} ahead of ${X} (${c.a.replace("from the ", "")} side) leave, how many ${c.unit} remain?`;
    return mkN(rng, n - x, [[n + x, "Added the people who left"], [n, "Forgot that some left"], [p + q - x, "Forgot to remove the person counted twice"], [n - x - 1, "Took one person away too many"]],
      finish(d, q1, [`Total = ${p} + ${q} − 1 = ${n}`, `After ${x} leave: ${n} − ${x} = **${n - x}**`], "Find the total first; then change it as the question says.", "Count the total with the −1 rule before adding or removing anybody."));
  }) });

  /* ------------------------------------------------------------ 2. positions swapped */
  QB.gen("reasoning/order-ranking/positions-swapped", { title: "Positions swapped", gen: wrap((rng, d) => {
    const c = T(rng, CTX.filter((x) => x.kind === "pos" || x.kind === "rank")), [X, Y] = names(rng, 2);
    const A = c.a.replace("from the ", ""), B = c.b.replace("from the ", "");
    const n = rng.int(24, 50);
    if (d === "Easy") {
      const p = rng.int(3, n - 3), rl = rng.int(3, n - 3);
      if (p === rl) return null;
      const q = n - rl + 1, r = rl;
      const q1 = `In ${c.group}, ${X} is **${ord(p)}** ${c.a} and ${Y} is **${ord(q)}** ${c.b}. After ${X} and ${Y} exchange their places, ${X} becomes **${ord(r)}** ${c.a}. How many ${c.unit} are there in all?`;
      return mkN(rng, n, [[r + q, "Forgot to remove the person counted twice"], [p + q - 1, "Used ${X}'s old position instead of the new one".replace("${X}", X)], [r + q - 2, "Removed the person twice"], [p + q, "Used the old position and forgot the −1"]],
        finish(d, q1, [`${X} takes ${Y}'s old place, so ${Y}'s old position ${c.a} was ${r}.`, `${Y} was ${ord(q)} ${c.b}, so total = ${r} + ${q} − 1 = **${n}**`], "The swap tells you where the other person stood before: use that with their other-end position.", "After a swap use the new position of the person who moved onto the other person's place."));
    }
    if (d === "Medium") {
      const p = rng.int(3, n - 8), rl = rng.int(p + 2, n - 2), q = n - rl + 1;
      const kind = rng.int(0, 1);
      if (kind === 0) {
        const r = rl, ans = r + q - p;       // Y's new position from the right = n - p + 1
        const q1 = `${X} is **${ord(p)}** ${c.a} and ${Y} is **${ord(q)}** ${c.b} in ${c.group}. When they exchange places, ${X} becomes **${ord(r)}** ${c.a}. What is ${Y}'s new position ${c.b}?`;
        return mkN(rng, n - p + 1, [[n - p, "Gave the number of people beyond, not the position"], [r + q, "Forgot to remove the person counted twice"], [p + q, "Used the old positions"], [q, "Repeated Y's old position"]],
          finish(d, q1, [`Total = ${r} + ${q} − 1 = ${n}`, `${Y} is now where ${X} stood (${ord(p)} ${c.a}), so position ${c.b} = ${n} − ${p} + 1 = **${n - p + 1}**`], "Find the total from the new position of the first person, then convert the other person's place.", "The second person now stands where the first used to stand, so use the first person's old position."));
      }
      const btw = rl - p - 1;
      const q1 = `In ${c.group}, ${X} is **${ord(p)}** ${c.a} and ${Y} is **${ord(rl)}** ${c.a}. After they exchange places, how many ${c.unit} are between ${X} and ${Y}?`;
      return mkN(rng, btw, [[btw + 1, "Counted one of them"], [btw + 2, "Counted both of them"], [rl - p, "Subtracted the positions without removing one"], [btw - 1, "Removed one person too many"]],
        finish(d, q1, [`The two places do not change, only who stands in them.`, `Between = ${rl} − ${p} − 1 = **${btw}**`], "A swap never changes how many people lie between the two places.", "Do not recompute anything after the exchange: the places themselves are unchanged."));
    }
    const p = rng.int(3, n - 10), k = rng.int(4, 12), rl = p + k, q = n - rl + 1;
    if (rl > n - 2) return null;
    const kind = rng.int(0, 2);
    if (kind === 0) {
      const q1 = `${X} is **${ord(p)}** ${c.a} and ${Y} is **${ord(q)}** ${c.b} in ${c.group}. After they exchange places, ${X} moves **${k}** places towards the ${B} end. How many ${c.unit} are there in all?`;
      return mkN(rng, n, [[n - 1, "Forgot the person counted twice in the other direction"], [p + k + q, "Forgot to remove the person counted twice"], [p + q - 1 + k + 1, "Added one place too many"], [p + k + q - 2, "Removed the person twice"]],
        finish(d, q1, [`${X} moves ${k} places, so ${Y} was at position ${p} + ${k} = ${rl} ${c.a}.`, `Total = ${rl} + ${q} − 1 = **${n}**`], "A move of k places gives the other person's old position directly.", "Count the move as k places, not k + 1."));
    }
    if (kind === 1) {
      const q1 = `${X} is **${ord(p)}** ${c.a} and ${Y} is **${ord(q)}** ${c.b} in ${c.group}. When they exchange places, ${X} becomes **${ord(rl)}** ${c.a}. How many ${c.unit} are there between them?`;
      return mkN(rng, rl - p - 1, [[rl - p, "Counted one of the two people"], [rl - p + 1, "Counted both of them"], [rl - p - 2, "Removed one person too many"], [n - p - q, "Used the original total in a wrong formula"]],
        finish(d, q1, [`${X} takes ${Y}'s place, so ${Y} stood ${ord(rl)} ${c.a}.`, `Between = ${rl} − ${p} − 1 = **${rl - p - 1}**`], "Subtract the two positions on the same side and take away 1.", "Always remove 1 when counting only the people strictly between."));
    }
    const q1 = `In ${c.group}, ${X} is **${ord(p)}** ${c.a} and ${Y} is **${ord(q)}** ${c.b}. If they exchange places, ${X} becomes **${ord(rl)}** ${c.a} and ${Y} becomes **${ord(n - p + 1)}** ${c.b}. Find the total number of ${c.unit}.`;
    return mkN(rng, n, [[rl + q, "Forgot to remove the person counted twice"], [p + n - p + 1 + 1, "Added instead of working it out"], [n - 1, "Took one person away"], [n + 1, "Counted one extra person"]],
      finish(d, q1, [`Both exchanges give the same total: ${rl} + ${q} − 1 = ${n} and ${p} + ${n - p + 1} − 1 = ${n}.`, `Total = **${n}**`], "Either exchanged pair gives the total; use the simpler one and check with the other.", "Check both statements: they must agree on the total."));
  }) });

  /* ------------------------------------------------------------ 3. minimum number of people */
  function minPeople(p, q, cond) {              // p-th from left (A), q-th from right (B), different persons
    for (let n = 2; n <= 400; n++) {
      const b = n - q + 1;
      if (p > n || b < 1 || b === p) continue;
      if (cond(p, b)) return n;
    }
    return null;
  }
  QB.gen("reasoning/order-ranking/minimum-number-of-people", { title: "Minimum number of people", gen: wrap((rng, d) => {
    const c = T(rng, CTX.filter((x) => x.kind === "pos")), [X, Y] = names(rng, 2);
    let p, q, cond, extra = "", sol, wrongs;
    if (d === "Easy") {
      p = rng.int(4, 25); q = rng.int(4, 25);
      cond = () => true;
      const ans = minPeople(p, q, cond);
      return mkN(rng, ans, [[p + q - 1, "Assumed they are on opposite sides of the row"], [p + q, "Added the positions"], [Math.min(p, q), "Took the smaller position"], [Math.max(p, q) + 1, "Added a person unnecessarily"]].concat([[p + q - 2, "Subtracted 2"]]),
        finish(d, `In ${c.group}, ${X} is **${ord(p)}** ${c.a} and ${Y} is **${ord(q)}** ${c.b}. What is the minimum number of ${c.unit} there can be?`,
          [`The smallest row is when the two positions overlap as much as possible but ${X} and ${Y} are different people.`, `That needs at least max(${p}, ${q}) = ${Math.max(p, q)} ${c.unit}${ans > Math.max(p, q) ? `, and one more because ${Y} would stand at the same place as ${X}` : ""}: **${ans}**`],
          "Minimum = the larger of the two positions (they overlap), unless that puts both people on the same spot.", "The two ranks may overlap: do not add them unless the question says they are on different sides."));
    }
    if (d === "Medium") {
      p = rng.int(4, 25); q = rng.int(4, 25);
      const leftOf = rng.chance(0.5);
      cond = leftOf ? (a, b) => b < a : (a, b) => b > a;
      const ans = minPeople(p, q, cond);
      if (!ans) return null;
      const alt = minPeople(p, q, leftOf ? (a, b) => b > a : (a, b) => b < a);
      return mkN(rng, ans, [[alt, "Placed " + Y + " on the wrong side"], [p + q - 1, "Assumed no overlap"], [p + q, "Added the positions"], [Math.max(p, q) + 1, "Added a person unnecessarily"], [Math.max(p, q), "Took the larger position without checking the side"]],
        finish(d, `In ${c.group}, ${X} is **${ord(p)}** ${c.a}. ${Y} is **${ord(q)}** ${c.b} and stands ${c.a.replace("from the ", "")}-${leftOf ? "ward of" : "side behind"} ${X}. What is the minimum number of ${c.unit}?`.replace(`${c.a.replace("from the ", "")}-${leftOf ? "ward of" : "side behind"}`, leftOf ? `ahead of (towards the ${c.a.replace("from the ", "")} end from)` : `behind (towards the ${c.b.replace("from the ", "")} end from)`),
          [`Check the smallest row in which ${Y} stands ${leftOf ? "ahead of" : "behind"} ${X}: ${Y}'s place from the ${c.a.replace("from the ", "")} end is n − ${q} + 1.`, `The condition first holds at n = **${ans}**.`],
          "Write ‘place of Y = n − q + 1’ and find the smallest n that satisfies the side condition.", "The side condition can force a bigger row than simply taking the larger position."));
    }
    p = rng.int(4, 20); q = rng.int(4, 20);
    const m = rng.int(2, 8);
    cond = (a, b) => Math.abs(a - b) - 1 === m;
    const ans = minPeople(p, q, cond);
    if (!ans) return null;
    const n1 = p + m + q, n2 = p - m - 1 >= 1 ? (p - m - 1) + q - 1 : null;
    return mkN(rng, ans, [[n1 === ans ? (n2 || n1 + 2) : n1, "Took the other arrangement, which is not the minimum"], [p + q + m + 1, "Counted both people as well"], [p + q + m - 1, "Subtracted 1 too many"], [p + q - 1, "Ignored the people between them"], [p + q + m + 2, "Counted too many people"]],
      finish(d, `In ${c.group}, ${X} is **${ord(p)}** ${c.a} and ${Y} is **${ord(q)}** ${c.b}. If there are exactly **${m}** ${c.unit} between ${X} and ${Y}, what is the minimum number of ${c.unit}?`,
        [`${Y} can be ${m + 1} places behind ${X}: total = ${p} + ${m} + ${q} = ${n1}.`, n2 ? `Or ${Y} can be ${m + 1} places ahead of ${X}: ${Y} is ${ord(p - m - 1)} ${c.a}, total = ${p - m - 1} + ${q} − 1 = ${n2}.` : `${Y} cannot stand ahead of ${X} because there is not enough room.`, `Minimum = **${ans}**`],
        "Try both sides: Y behind X gives p + m + q, Y ahead gives (p − m − 1) + q − 1; take the smaller valid one.", "Both arrangements can work; the minimum is the smaller one, not the first one you try."));
  }) });

  /* ------------------------------------------------------------ 4. rank among those who passed */
  QB.gen("reasoning/order-ranking/rank-among-those-who-passed", { title: "Rank among those who passed", gen: wrap((rng, d) => {
    const c = T(rng, CTX.filter((x) => x.kind === "rank")), [X] = names(rng, 1);
    if (d === "Easy") {
      const p = rng.int(5, 25), q = rng.int(8, 30), f = rng.int(2, q - 3), n = p + q - 1;
      const q1 = `${X} ${c.rankWord} **${ord(p)}** ${c.a} and **${ord(q)}** ${c.b} in an examination. The **${f}** ${c.unit} at the bottom failed. What is ${X}'s rank ${c.b} among those who passed?`;
      return mkN(rng, q - f, [[q + f, "Added the failures instead of removing them"], [q - f - 1, "Removed one person too many"], [n - f, "Gave the number of passers, not the rank"], [f, "Gave the number who failed"]],
        finish(d, q1, [`The ${f} failed ${c.unit} were all below ${X}, so remove them from the bottom count.`, `Rank ${c.b} among passers = ${q} − ${f} = **${q - f}**`], "Failures at the bottom reduce the rank from the bottom; the rank from the top stays the same.", "Failed candidates at the bottom lower the bottom rank; they do not change the top rank."));
    }
    if (d === "Medium") {
      const n = rng.int(40, 90), f = rng.int(5, 15), pass = n - f, p = rng.int(4, pass - 3);
      const ans = pass - p + 1;
      const q1 = `In ${c.group} of **${n}** ${c.unit}, **${f}** failed. ${X} ${c.rankWord} **${ord(p)}** ${c.a} among those who passed. What is ${X}'s rank ${c.b} among those who passed?`;
      return mkN(rng, ans, [[n - p + 1, "Forgot that the failed ones are not ranked"], [pass - p, "Gave the number of passers below, not the rank"], [n - f - p - 1, "Removed one extra person"], [pass + p, "Added instead of subtracting"]],
        finish(d, q1, [`Passed = ${n} − ${f} = ${pass}`, `Rank ${c.b} = ${pass} − ${p} + 1 = **${ans}**`], "Rank from the other end = (number of passers) − (given rank) + 1.", "Use the number who passed, not the total, as the base for the new rank."));
    }
    const p = rng.int(6, 25), f = rng.int(3, 12), q = rng.int(f + 4, f + 22), pass = p + q - 1 - f, n = p + q - 1;
    const kind = rng.int(0, 1);
    const ask = kind === 0 ? pass : n;
    const q1 = kind === 0
      ? `${X} ${c.rankWord} **${ord(p)}** ${c.a} among those who passed and **${ord(q)}** ${c.b} among all ${c.unit}. If the **${f}** who failed were all below ${X}, how many ${c.unit} passed?`
      : `${X} ${c.rankWord} **${ord(p)}** ${c.a} among those who passed and **${ord(q)}** ${c.b} among all ${c.unit}. If the **${f}** who failed were all below ${X}, how many ${c.unit} appeared in all?`;
    return mkN(rng, ask, kind === 0
      ? [[n, "Gave the total instead of the passers"], [pass + f * 2, "Added the failures twice"], [pass + 1, "Off by one"], [pass - 1, "Off by one"], [p + q - 1 + f, "Added the failures instead of subtracting"]]
      : [[pass, "Gave only the number who passed"], [n + f, "Added the failures a second time"], [n - 1, "Took one person away"], [p + q, "Forgot to remove the person counted twice"], [n + 1, "Counted one extra person"]],
      finish(d, q1, [`Below ${X} in the whole list: ${q} − 1 = ${q - 1}, of whom ${f} failed, so ${q - 1 - f} passed below ${X}.`, `Passers = ${p} + ${q - 1 - f} = ${pass}${kind === 1 ? `; with the ${f} who failed, total = ${pass} + ${f} = **${n}**` : ` → **${pass}**`}`],
        "Everyone below X in the whole list = q − 1. Remove the failures from that to get the passers below X.", "Keep track of which rank counts only the passers and which counts everybody."));
  }) });
})();
