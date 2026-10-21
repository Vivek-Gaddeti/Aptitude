/* =====================================================================
   Analogies: number analogies and letter analogies.
   Number analogies always give two worked pairs and every rival rule in
   the pool is checked so that exactly one answer fits both pairs.
   Letter analogies enumerate the rule family to prove the answer unique.
   ===================================================================== */
(function () {
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const pos = (c) => A.indexOf(c) + 1;
  const ch = (n) => A[(((n - 1) % 26) + 26) % 26];
  const chkW = (expr) => `q.opts[q.ans]===(${expr})&&q.opts.filter(o=>o===q.opts[q.ans]).length===1`;
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 90 };
  const N = (x) => QB.num(x);
  const sg = (x) => (x < 0 ? "−" + -x : "+" + x);
  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 1500; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("analogies: no clean question found");
    };
  }
  // chk = JS expression (as a string) that recomputes the answer text independently of the generator's variables
  function mkL(rng, a, wrongs, extra, chk) {
    const words = new Set([a]);
    const pairs = [[a, null]];
    for (const [w, why] of wrongs) {
      if (pairs.length === 4) break;
      if (!w || words.has(w)) continue;
      words.add(w); pairs.push([w, why]);
    }
    if (pairs.length < 4) return null;
    return Object.assign({ time: TIME[extra.d] }, extra, QB.options(rng, pairs), { check: chkW(chk) });
  }
  const finish = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });

  /* ------------------------------------------------------------ 1. number analogies */
  const RULES = [
    { id: "sq", lvl: 0, f: (n) => n * n, txt: "n²" },
    { id: "cu", lvl: 0, f: (n) => n * n * n, txt: "n³" },
    { id: "2p1", lvl: 0, f: (n) => 2 * n + 1, txt: "2n + 1" },
    { id: "3m1", lvl: 0, f: (n) => 3 * n - 1, txt: "3n − 1" },
    { id: "sq1", lvl: 0, f: (n) => n * n + 1, txt: "n² + 1" },
    { id: "nn1", lvl: 0, f: (n) => n * (n + 1), txt: "n × (n + 1)" },
    { id: "sqm1", lvl: 1, f: (n) => n * n - 1, txt: "n² − 1" },
    { id: "nn2", lvl: 1, f: (n) => n * (n + 2), txt: "n × (n + 2)" },
    { id: "4m3", lvl: 1, f: (n) => 4 * n - 3, txt: "4n − 3" },
    { id: "sqn", lvl: 1, f: (n) => n * n + n + 1, txt: "n² + n + 1" },
    { id: "nm1", lvl: 1, f: (n) => n * (n - 1), txt: "n × (n − 1)" },
    { id: "sq2", lvl: 1, f: (n) => n * n + 2, txt: "n² + 2" },
    { id: "cu1", lvl: 2, f: (n) => n * n * n + 1, txt: "n³ + 1" },
    { id: "cum1", lvl: 2, f: (n) => n * n * n - 1, txt: "n³ − 1" },
    { id: "cun", lvl: 2, f: (n) => n * n * n - n, txt: "n³ − n" },
    { id: "cun2", lvl: 2, f: (n) => n * n * n + n, txt: "n³ + n" },
    { id: "np1sq", lvl: 2, f: (n) => (n + 1) * (n + 1) - 1, txt: "(n + 1)² − 1" },
    { id: "2sq", lvl: 2, f: (n) => 2 * n * n + 1, txt: "2n² + 1" },
  ];
  QB.gen("reasoning/analogies/number-analogies", { title: "Number analogies", gen: wrap((rng, d) => {
    const lvl = { Easy: 0, Medium: 1, Hard: 2 }[d];
    const mine = RULES.filter((r) => (d === "Hard" ? r.lvl >= 1 : r.lvl === lvl));
    const R = T(rng, mine);
    const x1 = rng.int(2, 9), x2 = rng.int(2, 9), x3 = rng.int(3, 12);
    if (x1 === x2 || x3 === x1 || x3 === x2) return null;
    if (R.f(x1) > 1500 || R.f(x2) > 1500 || R.f(x3) > 1500) return null;
    const ans = R.f(x3);
    const consistent = RULES.filter((g) => g.f(x1) === R.f(x1) && g.f(x2) === R.f(x2));
    if (consistent.some((g) => g.f(x3) !== ans)) return null;       // another rule also fits both pairs
    const wrongs = [];
    for (const g of RULES) if (g.id !== R.id && g.f(x1) === R.f(x1) && g.f(x3) !== ans) wrongs.push([g.f(x3), `Fits the first pair (${x1} → ${R.f(x1)}) but not the second`]);
    for (const g of RULES) if (g.id !== R.id && g.f(x2) === R.f(x2) && g.f(x3) !== ans) wrongs.push([g.f(x3), `Fits the second pair (${x2} → ${R.f(x2)}) but not the first`]);
    wrongs.push([ans + x3, "Slip in the last step of the working"], [ans - 1, "Arithmetic slip of 1"], [ans + 1, "Arithmetic slip of 1"], [ans - x3, "Slip in the last step of the working"], [ans + 10, "Arithmetic slip of 10"]);
    const seen = new Set([ans]), pairs = [[N(ans), null]];
    for (const [v, why] of wrongs) { if (pairs.length === 4) break; if (v <= 0 || seen.has(v)) continue; seen.add(v); pairs.push([N(v), why]); }
    if (pairs.length < 4) return null;
    const q = T(rng, [
      `In a certain pattern, **${x1} : ${R.f(x1)}** and **${x2} : ${R.f(x2)}**. Following the same pattern, **${x3} : ?**`,
      `Find the missing number if **${x1} : ${R.f(x1)} :: ${x2} : ${R.f(x2)} :: ${x3} : ?**`,
      `The numbers in each pair are related in the same way: **${x1} : ${R.f(x1)}**, **${x2} : ${R.f(x2)}**, **${x3} : ?**. Find the missing number.`,
      `Choose the number that completes the analogy: **${x1} : ${R.f(x1)}** as **${x2} : ${R.f(x2)}** as **${x3} : ?**`,
    ]);
    return Object.assign({ time: TIME[d] }, finish(d, q,
      [`Test the rule on the first pair: ${x1} → ${R.f(x1)} fits **${R.txt}**.`, `Check it on the second pair: ${x2} → ${R.f(x2)}. It fits.`, `Apply it: ${x3} → **${N(ans)}**.`],
      "Find a rule that works for the first pair, then test it on the second; the rule that survives both is the one.",
      "A rule that explains only one pair is a coincidence: always test the second pair before answering."),
    QB.options(rng, pairs), { calc: String(ans) });
  }) });

  /* ------------------------------------------------------------ 2. letter analogies */
  // a rule maps a word to a word
  const shiftBy = (v) => (w) => [...w].map((c, i) => ch(pos(c) + v[i])).join("");
  const opp = (w) => [...w].map((c) => ch(27 - pos(c))).join("");
  const rev = (w) => [...w].reverse().join("");
  function family(ex, src, tgt) {            // every rule of the family that explains `src → tgt`; returns list of word-functions
    const n = src.length, list = [];
    const v1 = [...tgt].map((c, i) => pos(c) - pos(src[i]));
    list.push(shiftBy(v1));
    list.push(opp);
    if (ex) { const v2 = [...tgt].map((c, i) => pos(c) - pos(src[n - 1 - i])); list.push((w) => shiftBy(v2)(rev(w))); list.push((w) => opp(rev(w))); list.push(rev); }
    return list;
  }
  QB.gen("reasoning/analogies/letter-analogies", { title: "Letter analogies", gen: wrap((rng, d) => {
    const n = d === "Easy" ? rng.int(2, 3) : rng.int(3, 4);
    const sign = () => (rng.chance(0.35) ? -1 : 1);
    const randW = () => { let w = ""; for (let i = 0; i < n; i++) w += ch(rng.int(3, 24)); return w; };
    let kind, v;
    if (d === "Easy") { const k = rng.int(1, 5) * sign(); v = Array(n).fill(k); kind = "shift"; }
    else if (d === "Medium") {
      if (rng.chance(0.5)) { v = []; for (let i = 0; i < n; i++) v.push(rng.int(1, 3) * sign()); kind = "shift"; if (new Set(v).size < 2) return null; }
      else { const a = rng.int(1, 3), b = rng.int(1, 3); v = []; for (let i = 0; i < n; i++) v.push(i % 2 ? -b : a); kind = "shift"; if (a === b && false) return null; }
    } else { kind = T(rng, ["opp", "revshift", "revopp", "shift"]); v = []; for (let i = 0; i < n; i++) v.push(rng.int(1, 3) * sign()); if (kind === "revshift") { const k = rng.int(1, 3) * sign(); v = Array(n).fill(k); } }
    const rule = (w) => kind === "shift" ? shiftBy(v)(w) : kind === "opp" ? opp(w) : kind === "revshift" ? shiftBy(v)(rev(w)) : opp(rev(w));
    const nex = d === "Hard" ? 2 : 1;
    const srcs = []; for (let i = 0; i <= nex; i++) srcs.push(randW());
    if (new Set(srcs).size < srcs.length) return null;
    const tg = srcs.map(rule);
    if (kind === "shift" && !srcs.concat(tg).every((w) => [...w].every((c) => pos(c) >= 1))) return null;
    if (d !== "Hard") {                       // keep Easy / Medium inside the alphabet (no wrap-around)
      const okRange = srcs.every((w) => [...w].every((c, i) => pos(c) + v[i] >= 1 && pos(c) + v[i] <= 26));
      const raw = srcs.every((w) => [...w].every((c, i) => pos(c) + v[i] >= 1 && pos(c) + v[i] <= 26));
      if (!okRange || !raw) return null;
    }
    // uniqueness: every rule of the family that explains all examples gives the same new word
    const answers = new Set();
    const fams = family(d === "Hard", srcs[0], tg[0]);
    for (const f of fams) if (srcs.slice(0, nex).every((s, i) => f(s) === tg[i])) answers.add(f(srcs[nex]));
    const ans = tg[nex];
    if (answers.size !== 1 || !answers.has(ans)) return null;
    const x = srcs[nex];
    const wrongs = [];
    if (kind === "shift") {
      wrongs.push([shiftBy(v.map((s) => -s))(x), "Shifted the letters the wrong way"]);
      wrongs.push([shiftBy(Array(n).fill(v[0]))(x), "Applied the first letter's shift to every letter"]);
      wrongs.push([opp(x), "Used opposite letters instead of the shift"]);
    } else {
      wrongs.push([opp(x) === ans ? rev(x) : opp(x), "Used the wrong operation"]);
      wrongs.push([rev(x), "Only reversed the word"]);
      wrongs.push([shiftBy(Array(n).fill(1))(x), "Shifted every letter by one place"]);
    }
    for (let j = 0; j < n; j++) { const a = [...ans]; a[j] = ch(pos(a[j]) + 1); wrongs.push([a.join(""), `Letter ${j + 1} is one place too far`]); const b = [...ans]; b[j] = ch(pos(b[j]) - 1); wrongs.push([b.join(""), `Letter ${j + 1} is one place too short`]); }
    const exTxt = srcs.slice(0, nex).map((s, i) => `**${s} : ${tg[i]}**`).join(nex === 2 ? " and " : "");
    const q = nex === 1
      ? T(rng, [`Choose the letter group that completes the analogy: **${srcs[0]} : ${tg[0]} :: ${x} : ?**`, `**${srcs[0]}** is related to **${tg[0]}** in the same way as **${x}** is related to which letter group?`, `Find the missing group: **${srcs[0]} : ${tg[0]} :: ${x} : ?**`])
      : T(rng, [`In a certain pattern ${exTxt}. Following the same pattern, **${x} : ?**`, `Two pairs follow one rule: ${exTxt}. What should **${x}** be paired with?`]);
    const how = kind === "shift" ? `Compare letter by letter: the shifts are ${v.map(sg).join(", ")}.` :
      kind === "opp" ? "Each letter becomes its opposite (A↔Z, B↔Y, …): the two letters' positions add up to 27." :
      kind === "revshift" ? `The word is reversed and then every letter moves ${sg(v[0])}.` : "The word is reversed and each letter is replaced by its opposite (positions add up to 27).";
    return mkL(rng, ans, wrongs, finish(d, q,
      [`Work out the rule from the first pair${nex === 2 ? " and confirm it with the second" : ""}: ${how}`, `Apply it to **${x}**: **${ans}**.`],
      "Write the alphabet positions of both words and compare them letter by letter; if they do not match in order, try the reversed word.",
      "Check the direction of every shift and whether the word was reversed; a correct shift on the wrong order gives a tempting wrong option."),
      (() => {
        const src = (kind === "revshift" || kind === "revopp") ? `[...${JSON.stringify(x)}].reverse()` : `[...${JSON.stringify(x)}]`;
        const op = (kind === "opp" || kind === "revopp") ? "String.fromCharCode(155-c.charCodeAt(0))" : `String.fromCharCode(65+((c.charCodeAt(0)-65+${JSON.stringify(v)}[i])%26+26)%26)`;
        return `${src}.map((c,i)=>${op}).join("")`;
      })());
  }) });
})();
