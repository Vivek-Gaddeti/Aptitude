/* =====================================================================
   Alphabet test: letter positions and dictionary order.
   Numeric answers are shown as numbers; letter answers show their
   alphabet position in brackets so that every option is checkable.
   ===================================================================== */
(function () {
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const pos = (c) => A.indexOf(c) + 1;
  const ch = (n) => A[(((n - 1) % 26) + 26) % 26];
  const sumOf = (w) => [...w].reduce((a, c) => a + pos(c), 0);
  const lab = (w) => (w.length === 1 ? `${w} (${pos(w)})` : `${w} (position sum ${sumOf(w)})`);
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 95 };
  const N = (x) => QB.num(x);
  const ord = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th");
  const finish = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });
  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 2000; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("alphabet-test: no clean question found");
    };
  }
  function mkL(rng, a, wrongs, extra) {
    if (a.length !== 1) throw new Error("single letters only");
    const used = new Set([a]), pairs = [[lab(a), null]];
    for (const [w, why] of wrongs) { if (pairs.length === 4) break; if (!w || used.has(w)) continue; used.add(w); pairs.push([lab(w), why]); }
    if (pairs.length < 4) return null;
    return Object.assign({ time: TIME[extra.d] }, extra, QB.options(rng, pairs), { calc: String(pos(a)) });
  }
  function mkN(rng, ans, wrongs, extra) {
    if (!(ans >= 0) || !Number.isInteger(ans)) return null;
    const seen = new Set([ans]), pairs = [[N(ans), null]];
    for (const [v, why] of wrongs) { if (pairs.length === 4) break; if (!(v >= 0) || !Number.isInteger(v) || seen.has(v)) continue; seen.add(v); pairs.push([N(v), why]); }
    if (pairs.length < 4) return null;
    return Object.assign({ time: TIME[extra.d] }, extra, QB.options(rng, pairs), { calc: String(ans) });
  }
  const randL = (rng, lo, hi) => ch(rng.int(lo || 1, hi || 26));

  /* ------------------------------------------------------------ 1. letter positions */
  QB.gen("reasoning/alphabet-test/letter-positions", { title: "Letter positions", gen: wrap((rng, d) => {
    const kind = d === "Easy" ? T(rng, [0, 0, 0, 1, 2, 4, 4]) : d === "Medium" ? rng.int(3, 6) : rng.int(7, 10);
    if (kind === 0) {                                     // letters between two letters
      const a = rng.int(1, 22), b = a + rng.int(3, 12);
      if (b > 26) return null;
      const x = ch(a), y = ch(b), ans = b - a - 1;
      const q = T(rng, [`How many letters are there between **${x}** and **${y}** in the English alphabet?`, `In the alphabet, how many letters lie between **${x}** and **${y}**?`, `Count the letters strictly between **${x}** and **${y}** in the alphabet.`, `How many letters come between **${x}** and **${y}** when the alphabet is written from A to Z?`]);
      return mkN(rng, ans, [[b - a, "Counted one end letter as well"], [b - a + 1, "Counted both end letters"], [ans - 1, "Dropped one letter"], [a + b - 1, "Added the positions instead of subtracting"]],
        finish(d, q, [`${x} = ${a}, ${y} = ${b}`, `Letters between = ${b} − ${a} − 1 = **${ans}**`], "Between two letters = difference of positions − 1.", "Subtract the positions, then take away 1 for the end letter that is counted twice."));
    }
    if (kind === 1) {                                     // Nth from the right end
      const n = rng.int(2, 14), ans = ch(27 - n);
      const q = T(rng, [`Which letter is the **${ord(n)}** from the right end of the English alphabet?`, `Counting from Z backwards, which letter is **${ord(n)}**?`, `What is the **${ord(n)}** letter from the end of the alphabet?`, `In the English alphabet, which letter is the **${ord(n)}** counting from the right?`]);
      return mkL(rng, ans, [[ch(n), "Counted from the left end instead"], [ch(26 - n), "Off by one: used 26 − N instead of 27 − N"], [ch(28 - n), "Off by one the other way"]],
        finish(d, q, [`Position from the left = 27 − ${n} = ${27 - n}`, `That letter is **${ans}**.`], "Nth from the right = (27 − N)th from the left.", "27 − N, not 26 − N: Z itself is the 1st from the right."));
    }
    if (kind === 2) {                                     // position from the right end
      const p = rng.int(3, 24), x = ch(p), ans = 27 - p;
      const q = T(rng, [`What is the position of **${x}** from the right end of the English alphabet?`, `If you count from Z backwards, at what number do you reach **${x}**?`, `Counting from the right end of the alphabet (Z = 1), what number does **${x}** get?`]);
      return mkN(rng, ans, [[p, "Gave the position from the left"], [26 - p, "Used 26 − position instead of 27 − position"], [28 - p, "Off by one the other way"]],
        finish(d, q, [`${x} is ${ord(p)} from the left`, `From the right: 27 − ${p} = **${ans}**`], "Left position + right position = 27.", "The two positions add up to 27, not 26."));
    }
    if (kind === 3) {                                     // middle letter
      const a = rng.int(1, 14), g = 2 * rng.int(2, 6), b = a + g;
      if (b > 26) return null;
      const x = ch(a), y = ch(b), ans = ch(a + g / 2);
      const q = T(rng, [`Which letter is exactly in the middle of **${x}** and **${y}** in the alphabet?`, `Find the letter that lies midway between **${x}** and **${y}**.`]);
      return mkL(rng, ans, [[ch(a + g / 2 + 1), "One letter too far"], [ch(a + g / 2 - 1), "One letter too short"], [ch((a + b + 1) / 2 | 0), "Rounded the average wrongly"], [ch(a + g / 2 + 2), "Two letters too far"]],
        finish(d, q, [`${x} = ${a}, ${y} = ${b}`, `Middle position = (${a} + ${b}) ÷ 2 = ${a + g / 2}, which is **${ans}**`], "Average the two positions.", "Check that exactly the same number of letters lies on each side."));
    }
    if (kind === 4) {                                     // Nth to the right / left
      const p = rng.int(3, 24), n = d === "Easy" ? rng.int(2, 5) : rng.int(3, 9), dirR = rng.chance(0.5), np = dirR ? p + n : p - n;
      if (np < 1 || np > 26) return null;
      const x = ch(p), ans = ch(np);
      const q = T(rng, [`Which letter is the **${ord(n)}** to the ${dirR ? "right" : "left"} of **${x}** in the English alphabet?`, `Starting from **${x}** and moving ${n} places to the ${dirR ? "right" : "left"} in the alphabet, which letter do you reach?`]);
      return mkL(rng, ans, [[ch(dirR ? p - n : p + n), "Moved in the wrong direction"], [ch(np + 1), "One place too far"], [ch(np - 1), "One place too short"]],
        finish(d, q, [`${x} = ${p}`, `${p} ${dirR ? "+" : "−"} ${n} = ${np}, which is **${ans}**`], "Right means add, left means subtract on the A-to-Z line.", "Remember the alphabet is written A at the left end and Z at the right."));
    }
    if (kind === 5) {                                     // Nth to the left of Mth from right
      const m = rng.int(3, 12), n = rng.int(2, 8), pp = 27 - m - n;
      if (pp < 1) return null;
      const ans = ch(pp);
      const q = T(rng, [`Which letter is the **${ord(n)}** to the left of the **${ord(m)}** letter from the right end of the alphabet?`, `Find the **${ord(n)}** letter to the left of the letter that is **${ord(m)}** from the right end of the alphabet.`]);
      return mkL(rng, ans, [[ch(27 - m + n), "Moved to the right instead of the left"], [ch(pp + 1), "One place off"], [ch(pp - 1), "One place off"], [ch(m + n), "Counted everything from the left end"]],
        finish(d, q, [`${ord(m)} from the right = position 27 − ${m} = ${27 - m}`, `${n} places to the left = ${27 - m} − ${n} = ${pp}, which is **${ans}**`], "Convert the right-end position to a left position first (27 − M), then move.", "Turn the right-end count into a left-end count before you move."));
    }
    if (kind === 6) {                                     // letters between nth-left and mth-right
      const n = rng.int(3, 11), m = rng.int(3, 11), r = 27 - m;
      if (r - n < 3) return null;
      const ans = r - n - 1;
      const q = T(rng, [`How many letters are there between the **${ord(n)}** letter from the left and the **${ord(m)}** letter from the right of the English alphabet?`, `In the alphabet, count the letters between the letter that is **${ord(n)}** from the left end and the letter that is **${ord(m)}** from the right end.`]);
      return mkN(rng, ans, [[r - n, "Forgot to remove one of the end letters"], [26 - n - m, "Used 26 instead of 27 for the right-end position"], [27 - n - m, "Did not subtract the second end letter"], [ans + 2, "Added both end letters"]],
        finish(d, q, [`${ord(m)} from the right is position 27 − ${m} = ${r}`, `Between position ${n} and ${r}: ${r} − ${n} − 1 = **${ans}**`], "Left position of the second letter = 27 − M, then subtract and take away 1.", "Convert, subtract, then remove 1 for the end letter counted twice."));
    }
    if (kind === 7) {                                     // same position in word as in alphabet
      const len = rng.int(6, 8), k = rng.int(1, 3);
      const idx = rng.shuffle([...Array(len).keys()]).slice(0, k);
      const arr = [];
      for (let i = 0; i < len; i++) { if (idx.includes(i)) arr.push(ch(i + 1)); else { let c; do { c = randL(rng); } while (pos(c) === i + 1); arr.push(c); } }
      const word = arr.join(""), ans = arr.filter((c, i) => pos(c) === i + 1).length;
      const q = T(rng, [`In the letter group **${word}**, how many letters occupy the same position from the left as they do in the English alphabet?`, `How many letters in **${word}** are in the same place (counted from the left) as in the alphabet?`]);
      return mkN(rng, ans, [[ans + 1, "Counted one extra letter"], [Math.max(0, ans - 1), "Missed one letter"], [ans + 2, "Counted letters near their alphabet place as well"], [ans === 0 ? 4 : 0, "Assumed none match"]],
        finish(d, q, [`Compare each letter's place in the group with its alphabet position: ${arr.map((c, i) => `${c}: place ${i + 1}, position ${pos(c)}`).join("; ")}`, `Matches = **${ans}**`], "Number the letters 1, 2, 3… and compare each with its alphabet position.", "Check every letter; a match can hide anywhere, including the last place."));
    }
    if (kind === 8) {                                     // reversed alphabet
      const p = rng.int(5, 24), n = rng.int(3, 9), np = p - n;
      if (np < 1) return null;
      const x = ch(p), ans = ch(np);
      const q = T(rng, [`If the English alphabet is written in reverse order (Z to A), which letter is the **${ord(n)}** to the right of **${x}**?`, `The alphabet is rewritten backwards as Z, Y, X, …, A. Which letter is the **${ord(n)}** to the right of **${x}** in this new order?`]);
      return mkL(rng, ans, [[ch(p + n), "Used the normal A-to-Z order"], [ch(np + 1), "One place too short"], [ch(np - 1), "One place too far"]],
        finish(d, q, [`In reverse order, moving right means moving toward A, so the position falls: ${p} − ${n} = ${np}`, `That letter is **${ans}**.`], "Reverse order: right = down in position, left = up.", "The direction flips when the alphabet is reversed."));
    }
    if (kind === 9) {                                     // odd letters only
      const odd = []; for (let i = 1; i <= 26; i += 2) odd.push(ch(i));
      const i0 = rng.int(1, odd.length - 5), n = rng.int(2, 4);
      if (i0 + n >= odd.length) return null;
      const x = odd[i0], ans = odd[i0 + n];
      const q = T(rng, [`From the English alphabet every second letter, B, D, F, …, is deleted, leaving A, C, E, G, … Which letter is the **${ord(n)}** to the right of **${x}** now?`, `The letters B, D, F, H, … (every even-numbered letter) are removed from the alphabet. In what is left, which letter is the **${ord(n)}** to the right of **${x}**?`]);
      return mkL(rng, ans, [[ch(pos(x) + n), "Used the full alphabet, forgetting the deleted letters"], [odd[i0 + n + 1], "One place too far in the shortened list"], [odd[i0 + n - 1], "One place too short in the shortened list"]],
        finish(d, q, [`Remaining letters: ${odd.join(" ")}`, `Start at ${x} and move ${n} places right in this list: **${ans}**`], "Write out the shortened list and count along it.", "Count in the new list, not in the full alphabet."));
    }
    // kind === 10: pairs with equal gaps in word and alphabet
    const WS = ["PLANET", "BRIDGE", "MARKET", "FLOWER", "DOCTOR", "SILVER", "CANDLE", "ORANGE", "WINDOW", "GARDEN", "TABLES", "HEARTS", "BOUNDS", "STRAND", "FRIEND", "DEFINE", "POINTS", "SMOOTH", "BASKET", "ACTION"];
    const w = T(rng, WS);
    let ans = 0; const found = [];
    for (let i = 0; i < w.length; i++) for (let j = i + 1; j < w.length; j++) if (j - i === Math.abs(pos(w[i]) - pos(w[j]))) { ans++; found.push(w[i] + w[j]); }
    if (ans < 1 || ans > 4) return null;
    const q = T(rng, [`How many pairs of letters in the word **${w}** have as many letters between them in the word as there are between them in the English alphabet?`, `In **${w}**, how many pairs of letters are separated by the same number of letters as in the alphabet?`]);
    return mkN(rng, ans, [[ans + 1, "Counted one pair too many"], [Math.max(1, ans - 1), "Missed a pair"], [ans + 2, "Counted pairs that are only close, not equal"], [ans === 1 ? 3 : 1, "Stopped after the first pair"]],
      finish(d, q, [`Compare every pair: the gap in the word (j − i) must equal the gap in the alphabet.`, `Pairs that match: ${found.join(", ")}`, `Count = **${ans}**`], "Pairs usually need letters with a small gap, so check neighbours and next-but-one neighbours first.", "Compare the number of letters between them, not the positions themselves."));
  }) });

  /* ------------------------------------------------------------ 2. dictionary order */
  const CLUSTERS = [
    ["TRAIN", "TRAY", "TRAP", "TRADE", "TRACK", "TRAM"], ["CAR", "CARE", "CARD", "CART", "CAB", "CAP", "CAT"], ["PLAN", "PLANE", "PLANT", "PLAY", "PLEA"],
    ["STAR", "STAY", "STEP", "STEM", "STAMP", "STAIR"], ["BLUE", "BLOW", "BLOCK", "BLAST", "BLEND"], ["MAN", "MANY", "MANGO", "MAP", "MAT", "MAD"],
    ["FIRE", "FIRM", "FIST", "FISH", "FIT"], ["DOWN", "DOOR", "DOLL", "DOSE", "DOT"], ["SEA", "SEAT", "SEAL", "SEED", "SEEK"], ["BOOK", "BOOT", "BOLD", "BOND", "BONE"],
    ["HAND", "HARD", "HARM", "HAT", "HATE"], ["LAND", "LAMP", "LAKE", "LATE", "LAW"], ["PEN", "PENCIL", "PET", "PEARL", "PEACH"], ["COLD", "COIN", "COOK", "COOL", "COPY"],
  ];
  const DISTINCT = ["APPLE", "BREAD", "CHAIR", "DREAM", "EARTH", "FLAME", "GRAPE", "HOUSE", "INDIA", "JUICE", "KNIFE", "LEMON", "MONEY", "NIGHT", "OCEAN", "PAPER", "QUEEN", "RIVER", "STONE", "TIGER", "UNCLE", "VOICE", "WATER", "YOUTH", "ZEBRA", "CLOUD", "BEACH", "TRAIN", "MANGO", "SUGAR"];
  const PW = ["CODE", "TEAM", "PLAN", "LION", "MARK", "ROSE", "BIRD", "FISH", "GOLD", "WIND", "HOME", "KING", "LAMP", "NAME", "PORT", "SEAT", "TOUR", "DUST", "CASH", "BOLT", "TRAIN", "PLANE", "SMILE", "CHAIR", "BLACK", "FLOUR", "MONEY", "NIGHT"];
  const distinctLetters = (w) => new Set(w).size === w.length;
  const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
  function permRank(w) {                         // 1-based rank among all arrangements of the letters of w
    const s = [...w].sort(), n = w.length; let r = 1; const left = s.slice();
    for (let i = 0; i < n; i++) { const k = left.indexOf(w[i]); r += k * fact(n - 1 - i); left.splice(k, 1); }
    return r;
  }
  QB.gen("reasoning/alphabet-test/dictionary-order", { title: "Dictionary order", gen: wrap((rng, d) => {
    const kind = d === "Easy" ? rng.int(0, 2) : d === "Medium" ? rng.int(3, 5) : rng.int(6, 7);
    if (kind <= 1) {                              // rank of a word in a list (distinct first letters) / from the end
      const n = rng.int(4, 5), words = []; 
      while (words.length < n) { const w = T(rng, DISTINCT); if (!words.some((x) => x[0] === w[0])) words.push(w); }
      const sorted = words.slice().sort(), x = T(rng, words), r = sorted.indexOf(x) + 1;
      const fromEnd = kind === 1, ans = fromEnd ? n - r + 1 : r;
      const list = words.join(", ");
      const q = fromEnd
        ? T(rng, [`The words **${list}** are arranged as in a dictionary. What is the position of **${x}** from the last?`, `Arrange **${list}** in dictionary order. Counting from the end, where does **${x}** come?`])
        : T(rng, [`The words **${list}** are arranged in dictionary order. At which position does **${x}** come?`, `Arrange **${list}** as they appear in a dictionary. What is the position of **${x}** from the start?`]);
      const wr = []; for (let v = 1; v <= n; v++) if (v !== ans) wr.push([v, v === (fromEnd ? r : n - r + 1) ? (fromEnd ? "Counted from the start instead of from the end" : "Counted from the end instead of from the start") : "Placed the word wrongly in the order"]);
      return mkN(rng, ans, wr, finish(d, q, [`Dictionary order: ${sorted.join(" < ")}`, `${x} is ${ord(r)} from the start and ${ord(n - r + 1)} from the end: **${ans}**`], "Compare the first letters; only if they match compare the second letters.", "Check which end the question counts from."));
    }
    if (kind === 2) {                             // letters of a word in alphabetical order
      const w = T(rng, DISTINCT.concat(PW)); if (w.length < 4) return null;
      const s = [...w].sort(), n = rng.int(1, w.length), fromRight = rng.chance(0.4);
      const ans = fromRight ? s[w.length - n] : s[n - 1];
      const q = `The letters of the word **${w}** are arranged in alphabetical order. Which letter is **${ord(n)}** from the ${fromRight ? "right" : "left"}?`;
      const alt = fromRight ? s[n - 1] : s[w.length - n];
      return mkL(rng, ans, [[alt, "Counted from the wrong end"], [w[n - 1], "Took the letter at that place in the original word"], [s[Math.min(w.length - 1, Math.max(0, (fromRight ? w.length - n : n - 1) + 1))], "One place too far"], [s[Math.max(0, (fromRight ? w.length - n : n - 1) - 1)], "One place too short"], [T(rng, [...w].filter((c) => c !== ans)), "Used an unsorted letter"]],
        finish(d, q, [`Sorted letters: ${s.join(" ")}`, `The ${ord(n)} from the ${fromRight ? "right" : "left"} is **${ans}**.`], "Write the letters in A-to-Z order first, then count.", "Count from the end the question names; right and left give different letters."));
    }
    if (kind === 3) {                             // rank in a list sharing prefixes
      const cl = T(rng, CLUSTERS), n = rng.int(4, Math.min(5, cl.length)), words = rng.shuffle(cl).slice(0, n);
      const sorted = words.slice().sort(), x = T(rng, words), r = sorted.indexOf(x) + 1;
      const list = words.join(", ");
      const q = T(rng, [`Arrange **${list}** in dictionary order. At which position does **${x}** come?`, `If the words **${list}** are placed in the order of a dictionary, what is the position of **${x}**?`]);
      const wr = []; for (let v = 1; v <= n; v++) if (v !== r) wr.push([v, "Compared only the first letters or placed a longer word first"]);
      return mkN(rng, r, wr, finish(d, q, [`Dictionary order: ${sorted.join(" < ")}`, `${x} is at position **${r}**.`], "When the first letters match, compare the next letters; a shorter word comes before a longer word that starts with it.", "A word that is a prefix of another comes first (CAR before CARE)."));
    }
    if (kind === 4) {                             // which numbered word comes Nth
      const cl = T(rng, CLUSTERS), n = 4, words = rng.shuffle(cl).slice(0, n);
      const sorted = words.slice().sort(), k = rng.int(1, 4), target = sorted[k - 1], ans = words.indexOf(target);
      const list = words.map((w, i) => `(${i + 1}) ${w}`).join("  ");
      const q = T(rng, [`Arrange the words in dictionary order: **${list}**. Which word comes **${ord(k)}**?`, `The words **${list}** are put in dictionary order. Which one is **${ord(k)}** in the order?`]);
      const o = { opts: words.map((w, i) => `Word ${i + 1}: ${w}`), ans, why: words.map((w, i) => (i === ans ? null : `${w} is at position ${sorted.indexOf(w) + 1}, not ${k}`)) };
      return Object.assign({ time: TIME[d] }, finish(d, q, [`Dictionary order: ${sorted.join(" < ")}`, `The ${ord(k)} word is ${target}, which is **Word ${ans + 1}**.`], "Sort by first letter, then second letter, then third.", "Do not count a longer word before the shorter word it starts with."), o, { calc: String(ans + 1) });
    }
    if (kind === 5) {                             // number of letters that keep their place after sorting
      const w = T(rng, DISTINCT.concat(PW)); const s = [...w].sort();
      const ans = [...w].filter((c, i) => c === s[i]).length;
      const q = T(rng, [`If the letters of the word **${w}** are rearranged in alphabetical order, how many letters keep the same position as in the original word?`, `How many letters of **${w}** stay in the same place when its letters are arranged in alphabetical order?`]);
      return mkN(rng, ans, [[ans + 1, "Counted one letter that moves"], [Math.max(0, ans - 1), "Missed a letter that stays"], [ans + 2, "Counted letters that only come close"], [ans === 0 ? 3 : 0, "Assumed none stay"]],
        finish(d, q, [`Original: ${[...w].join(" ")}`, `Sorted: ${s.join(" ")}`, `Same place: ${ans}, so the answer is **${ans}**`], "Write the sorted word under the original and compare place by place.", "Compare places, not letters: a letter may appear elsewhere in the sorted word."));
    }
    // hard: rank among all arrangements
    let w = T(rng, PW.filter(distinctLetters)), nm = "word";
    if (rng.chance(0.65)) { const L = rng.int(4, 5), set = new Set(); while (set.size < L) set.add(randL(rng)); w = rng.shuffle([...set]).join(""); nm = "letter group"; }
    const r = permRank(w), n = w.length;
    if (!r || r < 3) return null;
    const mode = rng.int(0, 1);
    const ans = mode === 0 ? r : fact(n) - r;
    const q = mode === 0
      ? T(rng, [`All the possible arrangements of the letters of the ${nm} **${w}** are listed in dictionary order. What is the position of **${w}** itself?`, `If every arrangement of the letters of the ${nm} **${w}** is written in alphabetical (dictionary) order, at which position does **${w}** appear?`])
      : T(rng, [`All ${N(fact(n))} arrangements of the letters of the ${nm} **${w}** are written in dictionary order. How many of them come after **${w}**?`, `Every arrangement of the letters of the ${nm} **${w}** is listed in dictionary order. How many arrangements come after **${w}**?`]);
    const wr = mode === 0
      ? [[r - 1, "Counted the words before it but did not add 1 for the word itself"], [r + 1, "Added 1 twice"], [fact(n) - r + 1, "Counted from the end of the list"], [r + fact(n - 1), "Misplaced the first letter's block"], [r - fact(n - 2), "Mistake in a lower block"]]
      : [[fact(n) - r + 1, "Counted the word itself as well"], [r - 1, "Gave the number before instead of the number after"], [fact(n) - r - 1, "Subtracted 1 twice"], [r, "Gave the position instead of the number after"], [fact(n) - r + fact(n - 1), "Mistake in a block"]];
    const s = [...w].sort(); let steps = [], left = s.slice(), tot = 0;
    for (let i = 0; i < n; i++) { const k = left.indexOf(w[i]); if (k) steps.push(`${k} smaller letter${k > 1 ? "s" : ""} could start here: ${k} × ${fact(n - 1 - i)} = ${k * fact(n - 1 - i)}`); tot += k * fact(n - 1 - i); left.splice(k, 1); }
    return mkN(rng, ans, wr, finish(d, q, [`Sorted letters: ${s.join("")}. Count the arrangements that come before ${w}: ${steps.join("; ") || "none"}.`, `Words before = ${tot}, so the position of ${w} = ${tot} + 1 = ${r}.`, mode === 0 ? `Answer = **${r}**` : `Words after = ${fact(n)} − ${r} = **${fact(n) - r}**`],
      "Fix letters one by one: each smaller unused letter in front opens a block of (remaining letters)! arrangements.", "Position = (words before it) + 1; words after = total − position."));
  }) });
})();
