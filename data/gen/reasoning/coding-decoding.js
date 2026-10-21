/* =====================================================================
   Coding-decoding: letter shift, reverse / opposite letters, position-sum
   and number codes, mixed operations (TCS style).
   Letter-word answers show their alphabet-position sum in brackets; the
   generators enumerate the whole rule family so the intended rule is the
   only one that explains the worked example(s).
   ===================================================================== */
(function () {
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const pos = (c) => A.indexOf(c) + 1;
  const ch = (n) => A[(((n - 1) % 26) + 26) % 26];
  const sumOf = (w) => [...w].reduce((a, c) => a + pos(c), 0);
  const lab = (w) => (w.length === 1 ? `${w} (${pos(w)})` : `${w} (position sum ${sumOf(w)})`);
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 40, Medium: 65, Hard: 95 };
  const sg = (x) => (x < 0 ? "−" + -x : "+" + x);
  const N = (x) => QB.num(x);
  const finish = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });
  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 2000; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("coding-decoding: no clean question found");
    };
  }
  function mkL(rng, a, wrongs, extra) {
    const sums = new Set([sumOf(a)]), words = new Set([a]);
    const pairs = [[lab(a), null]];
    for (const [w, why] of wrongs) {
      if (pairs.length === 4) break;
      if (!w || words.has(w) || sums.has(sumOf(w))) continue;
      words.add(w); sums.add(sumOf(w)); pairs.push([lab(w), why]);
    }
    if (pairs.length < 4) return null;
    return Object.assign({ time: TIME[extra.d] }, extra, QB.options(rng, pairs), { calc: String(sumOf(a)) });
  }
  const W3 = ["CAT", "DOG", "SUN", "MAP", "PEN", "BOX", "FAN", "JAR", "KEY", "TEA", "BAT", "RAT", "HEN", "COW", "PIG", "BUS", "CAR", "INK", "OIL", "FOG", "LAW", "MUD", "NET", "OAK", "TIN", "WAX", "ZIP", "GEM", "HUT", "RUG"];
  const W4 = ["RAIN", "BOOK", "FISH", "LAMP", "MILK", "DOOR", "TREE", "ROAD", "SHIP", "COLD", "GOLD", "HAND", "LION", "MOON", "STAR", "WIND", "BELL", "CAKE", "DESK", "FARM", "GATE", "HILL", "JUNK", "KITE", "LAKE", "MANGO".slice(0, 4), "NAIL", "PARK", "ROSE", "SAND", "TENT", "WOOL", "YARN", "CORN", "DIAL", "FORK"];
  const W5 = ["CLOUD", "TRAIN", "PLANT", "WATER", "BREAD", "CHAIR", "TABLE", "GRAPE", "MANGO", "SMILE", "HOUSE", "DELHI", "PAPER", "RIVER", "STONE", "TIGER", "BEACH", "CANDY", "DAISY", "EARTH", "FLAME", "GLASS", "HEART", "LEMON", "MONEY", "NIGHT", "PIZZA", "QUEEN", "SUGAR", "TOAST"];
  const W6 = ["BRIDGE", "CAMERA", "DOCTOR", "FLOWER", "GARDEN", "ISLAND", "JUNGLE", "KERALA", "LADDER", "MARKET", "NUMBER", "ORANGE", "PENCIL", "RABBIT", "SILVER", "TICKET", "WINDOW", "YELLOW", "BUTTER", "CIRCLE"];
  const BY = { 3: W3, 4: W4, 5: W5, 6: W6 };
  function twoWords(rng, len) {
    const L = BY[len]; const a = T(rng, L); let b = T(rng, L), k = 0;
    while (b === a && k++ < 20) b = T(rng, L);
    return a === b ? null : [a, b];
  }
  const shiftBy = (v) => (w) => [...w].map((c, i) => ch(pos(c) + v[i % v.length])).join("");
  const opp1 = (c) => ch(27 - pos(c));
  const rev = (w) => [...w].reverse().join("");

  /* ------------------------------------------------------------ 1. letter shift */
  QB.gen("reasoning/coding-decoding/letter-shift", { title: "Letter shift", gen: wrap((rng, d) => {
    const len = d === "Easy" ? rng.int(3, 4) : d === "Medium" ? rng.int(4, 5) : rng.int(4, 6);
    const sign = () => (rng.chance(0.35) ? -1 : 1);
    let v;
    if (d === "Easy") v = Array(len).fill(rng.int(1, 5) * sign());
    else if (d === "Medium") {
      if (rng.chance(0.5)) v = Array.from({ length: len }, (_, i) => i + 1);                 // +1, +2, +3 ...
      else { const a = rng.int(1, 4), b = rng.int(1, 4); if (a === b) return null; v = Array.from({ length: len }, (_, i) => (i % 2 ? -b : a)); }
    } else {
      const k = rng.int(0, 2);
      if (k === 0) v = Array.from({ length: len }, (_, i) => (rng.chance(0.5) ? 1 : -1) * (i + 1));
      else if (k === 1) v = Array.from({ length: len }, () => rng.int(1, 5) * sign());
      else v = Array.from({ length: len }, (_, i) => (len - i) * (i % 2 ? -1 : 1));
      if (new Set(v).size < 3) return null;
    }
    const ws = twoWords(rng, len);
    if (!ws) return null;
    const [ex, tgt] = ws, f = shiftBy(v);
    if (d !== "Hard") for (const w of ws) if ([...w].some((c, i) => pos(c) + v[i] < 1 || pos(c) + v[i] > 26)) return null;
    const code = f(ex);
    const decode = d !== "Easy" && rng.chance(0.35);
    const vTxt = v.every((x) => x === v[0]) ? `every letter moves ${sg(v[0])}` : `the shifts, letter by letter, are ${v.map(sg).join(", ")}`;
    if (!decode) {
      const ans = f(tgt);
      const wrongs = [
        [shiftBy(v.map((x) => -x))(tgt), "Moved the letters in the opposite direction"],
        [shiftBy([v[0]])(tgt), "Applied the first letter's shift to every letter"],
      ];
      for (let j = 0; j < len; j++) { const a = [...ans]; a[j] = ch(pos(a[j]) + 1); wrongs.push([a.join(""), `Letter ${j + 1} is one place too far`]); const b = [...ans]; b[j] = ch(pos(b[j]) - 1); wrongs.push([b.join(""), `Letter ${j + 1} is one place short`]); }
      const q = T(rng, [
        `In a certain code language, **${ex}** is written as **${code}**. How will **${tgt}** be written in that code?`,
        `If **${ex}** becomes **${code}** in a code, what will **${tgt}** become?`,
        `A secret code writes **${ex}** as **${code}**. Using the same code, write **${tgt}**.`,
      ]);
      return mkL(rng, ans, wrongs, finish(d, q,
        [`Compare ${ex} with ${code} letter by letter (using positions): ${vTxt}.`, `Apply the same shifts to ${tgt}: **${ans}**.`],
        "Subtract the alphabet positions of the two words letter by letter; the differences are the code.",
        "Check whether the shift is the same for every letter; if it changes, it follows a pattern by position."));
    }
    const code2 = f(tgt), ans = tgt;
    const inv = shiftBy(v.map((x) => -x));
    const wrongs = [[inv(inv(code2)), "Moved the letters the wrong way (twice)"], [shiftBy(v)(code2), "Applied the code again instead of undoing it"]];
    for (let j = 0; j < len; j++) { const a = [...ans]; a[j] = ch(pos(a[j]) + 1); wrongs.push([a.join(""), `Letter ${j + 1} is one place too far`]); const b = [...ans]; b[j] = ch(pos(b[j]) - 1); wrongs.push([b.join(""), `Letter ${j + 1} is one place short`]); }
    const q = T(rng, [
      `In a certain code, **${ex}** is written as **${code}**. Which word is written as **${code2}** in that code?`,
      `A code turns **${ex}** into **${code}**. Decode **${code2}**.`,
    ]);
    return mkL(rng, ans, wrongs, finish(d, q,
      [`From ${ex} → ${code}: ${vTxt}.`, `To decode ${code2}, undo each shift: **${ans}**.`],
      "Find the shift from the example, then move every letter of the code back by the same amount.",
      "Decoding means going the opposite way: add where the code subtracted and subtract where it added."));
  }) });

  /* ------------------------------------------------------------ 2. reverse / opposite letters */
  const opp = (w) => [...w].map(opp1).join("");
  const altOpp = (odd) => (w) => [...w].map((c, i) => ((i % 2 === 0) === odd ? opp1(c) : c)).join("");
  const RULES2 = [
    { id: "opp", f: opp, txt: "each letter is replaced by its opposite (A↔Z, B↔Y, …; positions add up to 27)" },
    { id: "rev", f: rev, txt: "the word is written backwards" },
    { id: "revopp", f: (w) => opp(rev(w)), txt: "the word is reversed and every letter is replaced by its opposite" },
    { id: "oddopp", f: altOpp(true), txt: "the 1st, 3rd, 5th… letters are replaced by their opposites; the others stay" },
    { id: "evenopp", f: altOpp(false), txt: "the 2nd, 4th, 6th… letters are replaced by their opposites; the others stay" },
    { id: "revodd", f: (w) => altOpp(true)(rev(w)), txt: "the word is reversed, then the 1st, 3rd, 5th… letters are replaced by their opposites" },
    { id: "revfirst", f: (w) => { const r = [...rev(w)]; r[0] = opp1(r[0]); r[r.length - 1] = opp1(r[r.length - 1]); return r.join(""); }, txt: "the word is reversed, then the first and last letters of the result are replaced by their opposites" },
  ];
  QB.gen("reasoning/coding-decoding/reverse-opposite-letters", { title: "Reverse / opposite letters (A↔Z)", gen: wrap((rng, d) => {
    const pool = { Easy: ["opp", "rev", "revopp"], Medium: ["opp", "revopp", "oddopp", "evenopp"], Hard: ["revodd", "revfirst", "oddopp", "evenopp", "revopp"] }[d];
    const rid = T(rng, pool), R = RULES2.find((r) => r.id === rid);
    const len = d === "Easy" ? rng.int(3, 4) : rng.int(4, 6);
    const ws = twoWords(rng, len);
    if (!ws) return null;
    const [ex, tgt] = ws, code = R.f(ex), ans = R.f(tgt);
    const answers = new Set();
    for (const r of RULES2) if (r.f(ex) === code) answers.add(r.f(tgt));
    if (answers.size !== 1) return null;
    const wrongs = [];
    for (const r of RULES2) if (r.id !== R.id) wrongs.push([r.f(tgt), `Used the wrong operation (${r.id === "rev" ? "only reversed the word" : r.id === "opp" ? "opposite letters without the other step" : "a different rearrangement"})`]);
    wrongs.push([[...tgt].map((c) => ch(26 - pos(c))).join(""), "Used 26 − position instead of 27 − position for the opposite letter"]);
    const stated = d === "Easy" && rng.chance(0.4) && R.id !== "rev";
    const q = stated
      ? T(rng, [`In a code, ${R.txt}. How will **${tgt}** be written?`, `A code works like this: ${R.txt}. Write **${tgt}** in that code.`])
      : T(rng, [
        `In a certain code language, **${ex}** is written as **${code}**. How will **${tgt}** be written in that code?`,
        `If **${ex}** is coded as **${code}**, then **${tgt}** is coded as?`,
        `A code writes **${ex}** as **${code}**. Find the code for **${tgt}**.`,
      ]);
    return mkL(rng, ans, wrongs, finish(d, q,
      [stated ? `Rule: ${R.txt}.` : `Compare ${ex} with ${code}: ${R.txt}.`, `Apply it to ${tgt}: **${ans}**.`],
      "Opposite letter = 27 − position (A↔Z, B↔Y, C↔X, …M↔N).",
      "The opposite of a letter is 27 − its position, not 26 − its position."));
  }) });

  /* ------------------------------------------------------------ 3. position sum and number codes */
  const vowelsOf = (w) => [...w].filter((c) => "AEIOU".includes(c));
  const consOf = (w) => [...w].filter((c) => !"AEIOU".includes(c));
  const NR = [
    { id: "S", lvl: 0, f: (w) => sumOf(w), txt: "the sum of the alphabet positions of the letters" },
    { id: "SR", lvl: 0, f: (w) => [...w].reduce((a, c) => a + 27 - pos(c), 0), txt: "the sum of the reverse positions (A = 26, B = 25, …, Z = 1)" },
    { id: "FpL", lvl: 0, f: (w) => pos(w[0]) + pos(w[w.length - 1]), txt: "the sum of the positions of the first and last letters" },
    { id: "SpL", lvl: 1, f: (w) => sumOf(w) + w.length, txt: "the sum of the positions plus the number of letters" },
    { id: "SxL", lvl: 1, f: (w) => sumOf(w) * w.length, txt: "the sum of the positions multiplied by the number of letters" },
    { id: "FxL", lvl: 1, f: (w) => pos(w[0]) * pos(w[w.length - 1]), txt: "the product of the positions of the first and last letters" },
    { id: "FmL", lvl: 1, f: (w) => Math.abs(pos(w[0]) - pos(w[w.length - 1])), txt: "the difference between the positions of the first and last letters" },
    { id: "SV", lvl: 2, f: (w) => vowelsOf(w).reduce((a, c) => a + pos(c), 0), txt: "the sum of the positions of the vowels only" },
    { id: "SC", lvl: 2, f: (w) => consOf(w).reduce((a, c) => a + pos(c), 0), txt: "the sum of the positions of the consonants only" },
    { id: "CmV", lvl: 2, f: (w) => consOf(w).reduce((a, c) => a + pos(c), 0) - vowelsOf(w).reduce((a, c) => a + pos(c), 0), txt: "the sum of the consonant positions minus the sum of the vowel positions" },
    { id: "SxV", lvl: 2, f: (w) => sumOf(w) * vowelsOf(w).length, txt: "the sum of the positions multiplied by the number of vowels" },
  ];
  QB.gen("reasoning/coding-decoding/position-sum-and-number-codes", { title: "Position-sum & number codes", gen: wrap((rng, d) => {
    const lvl = { Easy: 0, Medium: 1, Hard: 2 }[d];
    const R = T(rng, NR.filter((r) => r.lvl === lvl));
    const len = d === "Easy" ? rng.int(3, 6) : rng.int(3, 5);
    const nx = d === "Easy" ? 0 : 2;
    const words = []; for (let i = 0; i <= nx; i++) words.push(T(rng, BY[len]));
    if (new Set(words).size < words.length) return null;
    if (d === "Hard" && words.some((w) => !vowelsOf(w).length || !consOf(w).length)) return null;
    const tgt = words[nx], ans = R.f(tgt);
    if (!(ans > 0) || ans > 1500 || words.slice(0, nx).some((w) => !(R.f(w) > 0))) return null;
    if (nx) {
      const answers = new Set();
      for (const r of NR) if (words.slice(0, nx).every((w) => r.f(w) === R.f(w))) answers.add(r.f(tgt));
      if (answers.size !== 1) return null;
    }
    const wrongs = [];
    for (const r of NR) if (r.id !== R.id) wrongs.push([r.f(tgt), `Used a different rule (${r.txt})`]);
    wrongs.push([ans + pos(tgt[0]), "Counted the first letter twice"], [ans - pos(tgt[tgt.length - 1]), "Left out the last letter"], [ans + 1, "Off by one"], [ans - 1, "Off by one"], [ans + len, "Added the number of letters by mistake"]);
    const seen = new Set([ans]), pairs = [[N(ans), null]];
    for (const [v, why] of wrongs) { if (pairs.length === 4) break; if (!(v > 0) || seen.has(v)) continue; seen.add(v); pairs.push([N(v), why]); }
    if (pairs.length < 4) return null;
    let q, solA;
    if (!nx) {
      q = T(rng, [
        `In a code, each word is given the value of ${R.txt}. What is the value of **${tgt}**?`,
        `If the value of a word is ${R.txt}, find the value of **${tgt}**.`,
        `Each word is coded as ${R.txt}. What number codes **${tgt}**?`,
        `A word's code is ${R.txt}. Find the code number of **${tgt}**.`,
        `Find the code number for **${tgt}** if the code of a word is ${R.txt}.`,
      ]);
      solA = [`Rule: ${R.txt}.`, `${tgt}: ${[...tgt].map((c) => `${c}=${pos(c)}`).join(", ")}`];
    } else {
      const e = words.slice(0, nx);
      q = T(rng, [
        `In a certain code, **${e[0]}** is written as **${R.f(e[0])}** and **${e[1]}** as **${R.f(e[1])}**. How will **${tgt}** be written in that code?`,
        `If **${e[0]} = ${R.f(e[0])}** and **${e[1]} = ${R.f(e[1])}** in a code, what is the code for **${tgt}**?`,
      ]);
      solA = [`Test the rule on both examples: ${e.map((w) => `${w} → ${R.f(w)}`).join(", ")} fit ${R.txt}.`, `${tgt}: ${[...tgt].map((c) => `${c}=${pos(c)}`).join(", ")}`];
    }
    return Object.assign({ time: TIME[d] }, finish(d, q, solA.concat([`Code for ${tgt} = **${N(ans)}**.`]),
      "Write each letter's alphabet position first; most number codes are built from those positions.",
      "Test the guessed rule on every example, not just the first: two rules often agree on one word."),
    QB.options(rng, pairs), { calc: String(ans) });
  }) });

  /* ------------------------------------------------------------ 4. mixed operations */
  const PERMS = [
    { id: "id", f: (w) => w, txt: null, ev: false },
    { id: "rev", f: rev, txt: "the word is reversed", ev: false },
    { id: "ends", f: (w) => w[w.length - 1] + w.slice(1, -1) + w[0], txt: "the first and last letters are swapped", ev: false },
    { id: "halves", f: (w) => w.slice(w.length / 2) + w.slice(0, w.length / 2), txt: "the two halves of the word are swapped", ev: true },
    { id: "pairs", f: (w) => [...w].map((c, i) => w[i % 2 ? i - 1 : i + 1]).join(""), txt: "each pair of neighbouring letters is swapped", ev: true },
    { id: "revhalves", f: (w) => rev(w.slice(0, w.length / 2)) + rev(w.slice(w.length / 2)), txt: "each half of the word is reversed on its own", ev: true },
  ];
  const SH = [];
  for (let k = -4; k <= 4; k++) if (k) SH.push({ id: "u" + k, v: [k], txt: `every letter moves ${sg(k)}` });
  for (let k = 1; k <= 4; k++) { SH.push({ id: "a" + k, v: [k, -k], txt: `the letters alternately move ${sg(k)} and ${sg(-k)}, starting with ${sg(k)}` }); SH.push({ id: "b" + k, v: [-k, k], txt: `the letters alternately move ${sg(-k)} and ${sg(k)}, starting with ${sg(-k)}` }); }
  const mixRule = (p, s, shiftFirst) => (w) => shiftFirst ? p.f(shiftBy(s.v)(w)) : shiftBy(s.v)(p.f(w));
  QB.gen("reasoning/coding-decoding/mixed-operations", { title: "Mixed operations (swap halves, reverse then shift)", gen: wrap((rng, d) => {
    const len = d === "Easy" ? rng.int(4, 5) : rng.int(4, 6);
    const okP = PERMS.filter((p) => p.id !== "id" && (!p.ev || len % 2 === 0));
    const P = d === "Easy" ? T(rng, okP.filter((p) => p.id === "rev" || p.id === "ends")) : T(rng, okP);
    const S = d === "Hard" ? T(rng, SH.filter((s) => s.id[0] !== "u")) : T(rng, SH.filter((s) => s.id[0] === "u" && Math.abs(s.v[0]) <= (d === "Easy" ? 2 : 4)));
    const ws = twoWords(rng, len);
    if (!ws) return null;
    const [ex, tgt] = ws, f = mixRule(P, S, false);
    const code = f(ex), ans = f(tgt);
    if (new Set([...ex]).size < len - 1) return null;
    // every other rule (any rearrangement, any shift, either order) that explains the example must give the same answer
    const answers = new Set();
    for (const p of PERMS) { if (p.ev && len % 2) continue; for (const s of SH) for (const first of [false, true]) { const g = mixRule(p, s, first); if (g(ex) === code) answers.add(g(tgt)); } }
    for (const p of PERMS) if (!(p.ev && len % 2) && p.f(ex) === code) answers.add(p.f(tgt));
    if (answers.size !== 1) return null;
    const wrongs = [
      [P.f(tgt), "Only rearranged the letters; forgot the shift"],
      [shiftBy(S.v)(tgt), "Only shifted the letters; forgot the rearrangement"],
      [mixRule(P, S, true)(tgt) !== ans ? mixRule(P, S, true)(tgt) : null, "Did the two steps in the wrong order"],
      [shiftBy(S.v.map((x) => -x))(P.f(tgt)), "Shifted in the wrong direction"],
    ];
    for (let j = 0; j < len; j++) { const a = [...ans]; a[j] = ch(pos(a[j]) + 1); wrongs.push([a.join(""), `Letter ${j + 1} is one place too far`]); }
    const q = T(rng, [
      `In a certain code, **${ex}** is written as **${code}**. How will **${tgt}** be written in that code?`,
      `A two-step code turns **${ex}** into **${code}**. Using the same steps, what does **${tgt}** become?`,
      `If **${ex}** is coded as **${code}**, find the code for **${tgt}**.`,
    ]);
    return mkL(rng, ans, wrongs, finish(d, q,
      [`${ex} → ${code}: first ${P.txt}, then ${S.txt}.`, `Do the same to ${tgt}: ${P.f(tgt)} → **${ans}**.`],
      "Undo the shift in the code to see which rearrangement was used, then apply both steps in the same order.",
      "Rearrange first and shift second (or the reverse) in the same order as the example, otherwise alternating shifts land on the wrong letters."));
  }) });
})();
