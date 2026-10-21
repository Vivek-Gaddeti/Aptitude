/* =====================================================================
   Problems on ages: four question generators (one per catalog pattern).
   ===================================================================== */
(function () {
  const N = (x) => QB.num(x), R = (x) => QB.round(x, 2);
  const C = (x) => isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const T = (rng, a) => rng.pick(a);
  const TIME = { Easy: 35, Medium: 60, Hard: 95 };
  const PAIRS = [["Anil", "Bhavna"], ["Ravi", "Sunita"], ["Kiran", "Deepak"], ["Asha", "Mohan"], ["Tanvi", "Gaurav"], ["Harish", "Jaya"], ["Neha", "Suresh"], ["Pranav", "Ishita"], ["Zoya", "Karthik"], ["Omkar", "Radha"]];
  const PAR = [["Mr Sharma", "his son"], ["Mrs Iyer", "her daughter"], ["Mr Khan", "his son"], ["Mrs Reddy", "her son"], ["Mr Bose", "his daughter"], ["Mrs Gill", "her daughter"]];
  const gcd = QB.gcd;
  const rat = (a, b) => { const g = gcd(a, b); return `${a / g} : ${b / g}`; };

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("ages: no clean question found");
    };
  }
  function mk(rng, ans, wrongs, extra) {
    if (!Number.isInteger(ans) || ans <= 0) return null;
    const seen = new Set([N(ans)]);
    const pairs = [[N(ans), null]];
    for (const w of wrongs) {
      if (pairs.length === 4) break;
      const v = w[0];
      if (!Number.isInteger(v) || v <= 0 || seen.has(N(v))) continue;
      seen.add(N(v)); pairs.push([N(v), w[1]]);
    }
    if (pairs.length < 4) return null;
    const o = QB.options(rng, pairs);
    return Object.assign({ time: TIME[extra.d] }, extra, o, { calc: String(ans) });
  }
  const fin = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });

  /* 1. ratio now / then */
  QB.gen("quant/ages/ratio-now-then", { title: "Ratio now / then", gen: wrap((rng, d) => {
    const [p, q] = T(rng, PAIRS);
    const A = rng.int(d === "Easy" ? 12 : 10, d === "Easy" ? 40 : 60), B = rng.int(6, 50), t = rng.int(2, d === "Hard" ? 12 : 8);
    const back = d === "Hard" && rng.chance(0.5);
    if (A <= B || (back && B - t < 2)) return null;
    const A2 = back ? A - t : A + t, B2 = back ? B - t : B + t;
    if (A2 <= B2 || gcd(A, B) === 1 && false) return null;
    // solve: (A/B ratio now a:b ; later c:d) unknown multiplier x:  a x ± t = c y ...
    const g = gcd(A, B), a = A / g, b = B / g, g2 = gcd(A2, B2), c = A2 / g2, dd = B2 / g2;
    if (a === c && b === dd) return null;
    if (g === 1 && g2 === 1 && d === "Easy") { /* fine */ }
    // solve for x: (a x + s)/(b x + s) = c/dd , s = ±t   =>  dd(a x + s) = c(b x + s)
    const s = back ? -t : t, den = dd * a - c * b;
    if (den === 0) return null;
    const x = (c * s - dd * s) / den;
    if (Math.abs(x - g) > 1e-9) return null;
    const askOlder = rng.chance(0.5), ans = askOlder ? A : B;
    const when = back ? `**${t}** years ago` : `after **${t}** years`;
    const ctx = d === "Easy" ? `The present ages of ${p} and ${q} are in the ratio **${rat(A, B)}**. ${back ? `${t} years ago` : `After ${t} years`} the ratio becomes **${rat(A2, B2)}**.` : `${p} and ${q} are of ages in the ratio **${rat(A, B)}** now, and ${when} their ages will ${back ? "have been" : "be"} in the ratio **${rat(A2, B2)}**.`;
    const who = askOlder ? p : q;
    return mk(rng, ans, [
      [askOlder ? B : A, "Gave the other person's age"], [ans + (back ? -t : t), `Gave the age ${back ? "then" : "later"}, not the present age`],
      [askOlder ? a * ((A2 + B2) / (c + dd)) : b * ((A2 + B2) / (c + dd)), "Used the new ratio on the present total"], [ans + t * 2 * (back ? 1 : -1), "Adjusted by the wrong number of years"], [ans + g, "Was off by one ratio unit"],
    ], fin(d, `${ctx} What is the present age of ${who} (in years)?`,
      [`Let the present ages be ${a}x and ${b}x`, `(${a}x ${back ? "−" : "+"} ${t}) : (${b}x ${back ? "−" : "+"} ${t}) = ${c} : ${dd}`, `${dd}(${a}x ${back ? "−" : "+"} ${t}) = ${c}(${b}x ${back ? "−" : "+"} ${t}) → x = ${g}`, `${who}'s age = ${askOlder ? a : b} × ${g} = **${ans}**`],
      "Write ages as ax and bx, add (or subtract) the years to both, cross-multiply, and solve for x.",
      `The years are added to each actual age, not to each ratio part: ${a}x + ${t}, not ${a + t}x.`));
  }) });

  /* 2. sum and ratio */
  QB.gen("quant/ages/sum-and-ratio", { title: "Sum and ratio", gen: wrap((rng, d) => {
    const [p, q] = T(rng, PAIRS);
    const g = rng.int(2, d === "Easy" ? 8 : 12);
    const a = rng.int(2, 7), b = rng.int(a + 1, 9);
    if (gcd(a, b) !== 1) return null;
    const A = a * g, B = b * g, S = A + B, t = rng.int(2, 9);
    const kind = d === "Easy" ? 0 : d === "Medium" ? rng.int(1, 2) : rng.int(3, 4);
    const ctx = T(rng, ["siblings", "cousins", "friends", "colleagues"]);
    if (kind === 0) {
      return mk(rng, B, [[A, "Gave the smaller age"], [S / (a + b) * a + 0, "Gave the other person's age"], [S / 2, "Split the sum equally"], [B + g, "Added one ratio unit"], [B - g, "Subtracted one ratio unit"]],
        fin(d, `The sum of the ages of ${p} and ${q} is **${S}** years, and their ages are in the ratio **${a} : ${b}**. How old is ${q}?`,
          [`Total parts = ${a} + ${b} = ${a + b}`, `One part = ${S} ÷ ${a + b} = ${g}`, `${q} = ${b} × ${g} = **${B}**`], `Divide ${S} by ${a + b} and multiply by ${b}.`, "The older one takes the larger part of the ratio."));
    }
    if (kind === 1) {
      return mk(rng, B + t, [[B, "Gave the present age"], [B - t, "Subtracted the years"], [A + t, "Gave the other person's age after the years"], [B + 2 * t, "Added the years twice"]],
        fin(d, `The ages of two ${ctx}, ${p} and ${q}, sum to **${S}** years and are in the ratio **${a} : ${b}**. How old will ${q} be after **${t}** years?`,
          [`One part = ${S} ÷ ${a + b} = ${g}`, `${q} now = ${b} × ${g} = ${B}`, `After ${t} years = ${B} + ${t} = **${B + t}**`], "Find the present age first, then shift.", "The question asks for the age in the future, not now."));
    }
    if (kind === 2) {
      const dif = B - A;
      return mk(rng, S, [[dif, "Gave the difference instead of the sum"], [B, "Gave the elder's age"], [S + t, "Added extra years"], [S - t, "Subtracted years"]],
        fin(d, `${p} is **${a} : ${b}** as old as ${q}, and the difference between their ages is **${dif}** years. What is the sum of their ages?`,
          [`Ratio difference = ${b - a} parts = ${dif}`, `One part = ${dif} ÷ ${b - a} = ${g}`, `Sum = (${a} + ${b}) × ${g} = **${S}**`], `Difference ${dif} covers ${b - a} parts.`, "Use the difference of the ratio parts, not their sum, to find one part."));
    }
    if (kind === 3) {
      const S2 = S + 2 * t;
      return mk(rng, A, [[B, "Gave the older person's age"], [A + t, `Gave the age after ${t} years`], [A - t, `Subtracted ${t}`], [S2 / (a + b) * a, "Used the future sum as if it were the present sum"]],
        fin(d, `The sum of the ages of ${p} and ${q} will be **${S2}** years after **${t}** years. Their present ages are in the ratio **${a} : ${b}**. Find ${p}'s present age.`,
          [`Present sum = ${S2} − 2 × ${t} = ${S}`, `One part = ${S} ÷ ${a + b} = ${g}`, `${p} = ${a} × ${g} = **${A}**`], "Each person gains t years, so the sum gains 2t.", "Two people age together: subtract 2t, not t."));
    }
    const S0 = S - 2 * t, ok = A - t > 0 && B - t > 0;
    if (!ok) return null;
    return mk(rng, B, [[B - t, "Gave the age then"], [A, "Gave the other person's age"], [S0 / (a + b) * b, "Used the earlier sum as the present sum"], [B + t, "Moved in the wrong direction"]],
      fin(d, `${t} years ago the sum of the ages of ${p} and ${q} was **${S0}**. Their present ages are in the ratio **${a} : ${b}**. What is ${q}'s present age?`,
        [`Present sum = ${S0} + 2 × ${t} = ${S}`, `One part = ${S} ÷ ${a + b} = ${g}`, `${q} = ${b} × ${g} = **${B}**`], "Present sum = past sum + 2t.", "Both people were younger: add 2t, not t."));
  }) });

  /* 3. n years ago it was k times */
  QB.gen("quant/ages/n-years-ago-it-was", { title: "\"n years ago it was k times\"", gen: wrap((rng, d) => {
    const [fa, so] = T(rng, PAR);
    const n = rng.int(2, d === "Easy" ? 8 : 12), k = rng.int(2, d === "Easy" ? 4 : 7);
    const sonNow = rng.int(n + 2, 30), fNow = k * (sonNow - n) + n;
    if (fNow > 85) return null;
    const m = rng.int(2, 10);
    const kind = d === "Easy" ? 0 : d === "Medium" ? rng.int(0, 1) : rng.int(2, 3);
    if (kind === 0) {
      // n years ago father was k times son; son now x; find father's age now
      return mk(rng, fNow, [[k * sonNow, `Multiplied the present age by ${k}`], [k * (sonNow - n), "Gave the age n years ago"], [fNow + n, "Added the years twice"], [k * (sonNow + n) - n, "Added instead of subtracted the years"]],
        fin(d, `${n} years ago, ${fa} was **${k}** times as old as ${so}. ${so[0].toUpperCase() + so.slice(1)} is now **${sonNow}**. How old is ${fa} now?`,
          [`${so[0].toUpperCase() + so.slice(1)} ${n} years ago = ${sonNow} − ${n} = ${sonNow - n}`, `Parent then = ${k} × ${sonNow - n} = ${k * (sonNow - n)}`, `Parent now = ${k * (sonNow - n)} + ${n} = **${fNow}**`], "Step back, multiply, step forward.", "The multiple applies to the ages n years ago, not the present ages."));
    }
    if (kind === 1) {
      const diff = fNow - sonNow, x = diff / (k - 1);
      return mk(rng, sonNow, [[sonNow - n, "Gave the age n years ago"], [fNow, "Gave the parent's age"], [sonNow + n, "Added n instead of using the difference"], [diff, "Gave the age gap"]],
        fin(d, `${fa[0].toUpperCase() + fa.slice(1)} is **${diff}** years older than ${so}. ${n} years ago ${fa} was **${k}** times as old as ${so}. Find the present age of ${so}.`,
          [`The gap stays ${diff}`, `Then: ${k}y − y = ${diff} → y = ${diff / (k - 1)}`, `Present age = ${diff / (k - 1)} + ${n} = **${sonNow}**`], `Use the gap: younger person then = gap ÷ (k − 1) = ${diff / (k - 1)}.`, "The age gap never changes, so use it to find the earlier ages."));
    }
    if (kind === 2) {
      const sum = fNow + sonNow;
      return mk(rng, sonNow, [[fNow, "Gave the older person's age"], [sonNow - n, "Gave the age n years ago"], [sum - 2 * n, "Gave the sum n years ago"], [(sum) / (k + 1), "Applied the multiple to the present ages"]],
        fin(d, `The sum of the present ages of ${fa} and ${so} is **${sum}**. ${n} years ago, ${fa} was **${k}** times as old as ${so}. Find ${so}'s present age.`,
          [`Sum ${n} years ago = ${sum} − 2 × ${n} = ${sum - 2 * n}`, `Parts: ${k} + 1 = ${k + 1} → younger then = ${(sum - 2 * n) / (k + 1)}`, `Present = ${(sum - 2 * n) / (k + 1)} + ${n} = **${sonNow}**`], "Past sum = present sum − 2n; split it in ratio k : 1.", "The condition holds n years ago, so take away n from each age."));
    }
    // future condition: after m years, father is j times
    const j = rng.int(2, 4), s0 = rng.int(4, 20), f0 = j * (s0 + m) - m;
    if (f0 <= s0 + 15 || f0 > 80) return null;
    const diff = f0 - s0, x = diff / (j - 1);
    const ask = 1;
    return mk(rng, s0, [[s0 + m, "Gave the age after the years"], [f0, "Gave the parent's age"], [x, "Forgot to step back to the present"], [diff / j, "Divided the gap by the multiple only"]],
      fin(d, `${fa[0].toUpperCase() + fa.slice(1)} is **${diff}** years older than ${so}. After **${m}** years ${fa} will be **${j}** times as old as ${so}. Find ${so}'s present age.`,
        [`Gap stays ${diff}; later: ${j}y − y = ${diff} → y = ${x}`, `Present = ${x} − ${m} = **${s0}**`], `Younger later = gap ÷ (j − 1); subtract ${m}.`, "The multiple applies to the future ages; subtract the years at the end."));
  }) });

  /* 4. parent and children */
  QB.gen("quant/ages/parent-and-children", { title: "Parent & children", gen: wrap((rng, d) => {
    const [fa, ch] = T(rng, PAR);
    const Fa = fa;
    const kind = d === "Easy" ? 0 : d === "Medium" ? rng.int(1, 2) : rng.int(2, 3);
    if (kind === 0) {
      const k = rng.int(2, 5), sn = rng.int(8, 20), F = k * sn, t = rng.int(3, 12);
      return mk(rng, F + t, [[sn + t, "Gave the child's age after the years"], [F, "Gave the present age"], [F - t, "Subtracted the years"], [k * (sn + t), `Multiplied the future age by ${k}`]],
        fin(d, `${Fa} is **${k}** times as old as ${ch}, who is **${sn}** years old. How old will ${Fa} be after **${t}** years?`,
          [`${Fa} now = ${k} × ${sn} = ${F}`, `After ${t} years = ${F} + ${t} = **${F + t}**`], "Find the present age, then add the years.", "The multiple holds only now, not after the years."));
    }
    if (kind === 1) {
      const k = rng.int(2, 5), a1 = rng.int(3, 14), a2 = rng.int(a1 + 1, 20), t = rng.int(3, 12);
      const F = a1 + a2 + 2 * t + 0; // after t years father = sum of kids' ages after t: F+t = a1+a2+2t -> F = a1+a2+t
      const F2 = a1 + a2 + t;
      if (F2 < a2 + 18) return null;
      return mk(rng, F2, [[a1 + a2, "Gave the sum of the children's present ages"], [a1 + a2 + 2 * t, "Added the years twice"], [a1 + a2 + t + 1, "Was off by one"], [a1 + a2 - t, "Subtracted the years"]],
        fin(d, `${Fa} has two children aged **${a1}** and **${a2}**. After **${t}** years ${Fa}'s age will equal the sum of the two children's ages. How old is ${Fa} now?`,
          [`Children's sum after ${t} years = ${a1} + ${a2} + 2 × ${t} = ${a1 + a2 + 2 * t}`, `Parent after ${t} years = ${a1 + a2 + 2 * t}`, `Parent now = ${a1 + a2 + 2 * t} − ${t} = **${F2}**`], "Two children gain 2t, the parent gains t.", "Both children grow, so the sum rises by twice the years."));
    }
    if (kind === 2) {
      const k = rng.int(3, 7), sn = rng.int(5, 25), F = k * sn, t = rng.int(4, 15);
      if (F + t > 90) return null;
      // after t years, father = j times son? choose number ratio
      const f2 = F + t, s2 = sn + t;
      const diff = F - sn;
      return mk(rng, sn, [[F, "Gave the parent's age"], [diff, "Gave the age gap"], [sn + t, "Gave the child's age after the years"], [diff / k, "Divided the gap by k, not k − 1"]],
        fin(d, `${Fa} is **${k}** times as old as ${ch}. The difference between their ages is **${diff}** years. Find ${ch}'s age.`,
          [`k y − y = ${diff}`, `${k - 1}y = ${diff}`, `y = **${sn}**`], `Child = gap ÷ (k − 1) = ${diff} ÷ ${k - 1}.`, "The gap is (k − 1) times the child's age, not k times."));
    }
    if (kind === 3) {
      // father age = k * (sum of children) now ; after t years etc
      const c1 = rng.int(3, 10), c2 = rng.int(c1 + 1, 14), t = rng.int(5, 14), k = rng.int(2, 3);
      const F = k * (c1 + c2);
      // after t years father = sum of kids + extra? choose: father is currently k times the sum; in t years father equals sum+... use ask: father's age after t years
      const ans = F + t;
      if (F > 80 || F < c2 + 18) return null;
      return mk(rng, ans, [[F, "Gave the present age"], [F - t, "Subtracted the years"], [k * (c1 + c2 + 2 * t), "Multiplied the future sum of children by k"], [k * (c1 + c2) + 2 * t, "Added the years twice"]],
        fin(d, `${Fa} is **${k}** times as old as the sum of the ages of ${Fa.startsWith("Mr") ? "his" : "her"} two children, aged **${c1}** and **${c2}**. How old will ${Fa} be after **${t}** years?`,
          [`Present age = ${k} × (${c1} + ${c2}) = ${F}`, `After ${t} years = ${F} + ${t} = **${ans}**`], "Multiply the present sum, then add the years once.", "The k-times rule only holds at the present moment."));
    }
    // kind 4 unreachable
    return null;
  }) });
})();
