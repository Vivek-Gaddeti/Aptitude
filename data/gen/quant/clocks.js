/* =====================================================================
   Clocks: generators for the catalog patterns marked gen:true
   (angle-at-a-time, coinciding-opposite-right-angle, gaining-and-losing-clocks,
   clock-in-a-mirror). Fractions of a minute are exact (e.g. 32 8/11).
   ===================================================================== */
(function () {
  const N = (x) => QB.num(x);
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 95 };
  const NAMES = ["Aarav", "Meera", "Rohit", "Sneha", "Kiran", "Divya", "Arjun", "Pooja", "Vikram", "Ananya", "Suresh", "Neha", "Imran", "Lakshmi", "Harsh", "Kavya", "Manoj", "Riya", "Farhan", "Tanvi", "Gopal", "Isha", "Naveen", "Shreya", "Deepak", "Nisha", "Rahul", "Swati", "Karthik", "Preeti"];
  const pad = (m) => (m < 10 ? "0" + m : String(m));

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("clocks: no clean question found");
    };
  }
  // exact fraction of a float (denominator <= 1000)
  function fr(x) {
    for (let dn = 1; dn <= 1000; dn++) { const n = Math.round(x * dn); if (Math.abs(x * dn - n) < 1e-6) return [n, dn]; }
    return null;
  }
  function mixed(x) {
    const f = fr(x); if (!f) return null;
    const n = f[0], dn = f[1], w = Math.floor(n / dn), r = n - w * dn;
    if (!r) return String(w);
    return w ? `${w} ${r}/${dn}` : `${r}/${dn}`;
  }
  const minTxt = (x) => { const s = mixed(x); return s == null || x <= 0 ? null : s + " min"; };
  const degTxt = (x) => (x <= 0 || x > 360 ? null : N(Math.round(x * 100) / 100) + "°");
  // clock reading from minutes after 12:00 (0..719); null when the minutes are 00 (cannot be machine-checked as H:MM)
  function tf(x) {
    if (x == null || !isFinite(x) || Math.abs(x - Math.round(x)) > 1e-9) return null;
    x = ((Math.round(x) % 720) + 720) % 720;
    const h = Math.floor(x / 60), m = x % 60;
    if (m === 0) return null;
    return `${h === 0 ? 12 : h}:${pad(m)}`;
  }
  const ratio = (s) => { const p = s.split(":"); return +p[0] / +p[1]; };
  // build options: correct first, wrongs in priority order; f formats a value (null = unusable)
  function build(rng, f, ans, wrongs, extra, isTime) {
    const A = f(ans);
    if (A == null) return null;
    const seen = new Set([A]), vals = [isTime ? ratio(A) : ans], pairs = [[A, null]];
    for (const w of wrongs) {
      if (pairs.length === 4) break;
      if (!isFinite(w[0])) continue;
      const t = f(w[0]);
      if (t == null || seen.has(t)) continue;
      const v = isTime ? ratio(t) : w[0];
      if (vals.some((u) => Math.abs(u - v) < 1e-7)) continue;
      seen.add(t); vals.push(v); pairs.push([t, w[1]]);
    }
    if (pairs.length < 4) return null;
    const o = QB.options(rng, pairs);
    return Object.assign({ time: TIME[extra.d] }, extra, o);
  }
  const LEAD = ["", "", "Warm-up: ", "Mock test: ", "Try this: ", "Practice question: ", "Campus drive: ", "Interview round: ", "Quick one: "];
  const fin = (d, q, sol, short, trap, calc) => ({ d, q, sol, short, trap, calc });
  const clk = (h, m) => `**${h}:${pad(m)}**`;

  /* ------------------------------------------------------------------ 1. angle at a time */
  const red = (a) => { a = ((a % 360) + 360) % 360; return a > 180 ? 360 - a : a; };
  QB.gen("quant/clocks/angle-at-a-time", { title: "Angle between the hands", gen: wrap((rng, d) => {
    const h = rng.int(1, 12), nm = T(rng, NAMES);
    const m = d === "Easy" ? T(rng, [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]) : d === "Medium" ? 2 * rng.int(1, 29) : rng.int(1, 59);
    const hp = 30 * (h % 12) + 0.5 * m, mp = 6 * m;
    const a = red(hp - mp);
    if (a === 0 || a === 180) return null;
    let big = false, H = h;
    if (d === "Hard") {
      if (rng.chance(0.35)) big = true;
      if (h < 12 && rng.chance(0.4)) H = h + 12;
    }
    const ans = big ? 360 - a : a;
    const ctx = T(rng, [
      `What is the angle between the hour hand and the minute hand of a clock at ${clk(h, m)}?`,
      `${nm} looks at a wall clock that shows ${clk(h, m)}. Find the angle between its hands.`,
      `Find the angle formed by the hands of a clock at ${clk(h, m)}.`,
      `At ${clk(h, m)} on a school wall clock, what angle do the two hands make?`,
      `The clock in ${nm}'s office reads ${clk(h, m)}. How many degrees apart are the hour and minute hands?`,
      `A train departs when the station clock shows ${clk(h, m)}. What is the angle between the hands at that moment?`,
    ]);
    let q = ctx;
    if (H > 12) q = `At **${H}:${pad(m)}** hours (24-hour clock), what is the angle between the hour hand and the minute hand?`;
    if (big) q = q.replace(/[?.]$/, "") + ". Give the larger (reflex) angle.";
    const wrongs = [
      [red(30 * (h % 12) - mp), `Placed the hour hand exactly on ${h} and ignored its movement of 0.5° per minute`],
      [big ? a : 360 - a, big ? "Gave the smaller angle instead of the reflex angle" : "Gave the reflex angle (the larger one) instead of the smaller angle"],
      [red(hp + mp), "Added the two hand positions instead of subtracting them"],
      [red(hp - 5 * m), "Moved the minute hand 5° per minute instead of 6°"],
      [Math.abs(hp - mp) > 180 && !big ? Math.abs(hp - mp) : red(hp - mp + 30), "Misplaced the hour hand by one whole hour"],
      [big ? 360 - red(30 * (h % 12) - mp) : red(hp - mp) + 6, "Slipped by one minute-division (6°)"],
    ];
    return build(rng, degTxt, ans, wrongs, fin(d,
      q,
      [`Hour hand from 12: 30° × ${h % 12} + 0.5° × ${m} = ${N(hp)}°`, `Minute hand from 12: 6° × ${m} = ${mp}°`, `Difference = |${N(hp)} − ${mp}| = ${N(Math.abs(hp - mp))}°` + (big ? `, and the reflex angle is 360° − ${N(a)}° = **${N(ans)}°**` : (Math.abs(hp - mp) > 180 ? `, which is more than 180°, so the angle between the hands is 360° − ${N(Math.abs(hp - mp))}° = **${N(a)}°**` : ` = **${N(a)}°**`))],
      `Use θ = |30H − 5.5M|; if the result is above 180°, subtract it from 360°. Here |${30 * (h % 12)} − ${N(5.5 * m)}| = ${N(Math.abs(30 * (h % 12) - 5.5 * m))}°.`,
      "The hour hand keeps moving: it is not exactly on the hour number unless the minutes are 00.",
      String(ans)));
  }) });

  /* ------------------------------------------------------------------ 2. coincide / opposite / right angle */
  // minutes after h o'clock when (minute hand - hour hand) is congruent to th (mod 360)
  const at = (h, th) => ((((30 * h + th) % 360) + 360) % 360) * 2 / 11;
  const okm = (m) => m > 1e-9 && m < 60 - 1e-9;
  QB.gen("quant/clocks/coinciding-opposite-right-angle", { title: "Hands coinciding, opposite or at right angles", gen: wrap((rng, d) => {
    const nm = T(rng, NAMES);
    if (d === "Hard" && rng.chance(0.25)) {
      const kind = T(rng, ["coincide", "opposite", "right"]);
      const ans = kind === "right" ? 360 / 11 : 720 / 11;
      const what = { coincide: "the hands of a correct clock coincide", opposite: "the hands of a correct clock point in exactly opposite directions", right: "the hands of a correct clock are at right angles" }[kind];
      const q = T(rng, [
        `How much time passes between two successive moments when ${what}?`,
        `${nm} notes the moment ${what}. After how long will this next happen?`,
        `Find the interval between two consecutive times at which ${what}.`,
      ]);
      return build(rng, minTxt, ans, [
        [60, "Assumed the hands meet once every hour"],
        [kind === "right" ? 30 : 720 / 12, "Divided 360° by 12 instead of by 11 (relative speed 5.5° per minute)"],
        [kind === "right" ? 720 / 11 : 360 / 11, kind === "right" ? "Used the interval for coinciding hands" : "Used the interval for right angles"],
        [Math.floor(ans), "Dropped the fraction of a minute"],
        [ans + 60 / 11, "Added an extra 5 5/11 minutes"],
      ], fin(d, q,
        [`Relative speed of the minute hand over the hour hand = 6° − 0.5° = 5.5° per minute`, kind === "right" ? `Two successive right angles are 180° of relative motion apart: 180 ÷ 5.5 = **32 8/11 min**` : `One full relative turn of 360°: 360 ÷ 5.5 = **65 5/11 min**`],
        kind === "right" ? "Right angles come twice per relative turn, every 360/11 = 32 8/11 min." : "In every 12 hours the hands coincide 11 times, so the interval is 720/11 = 65 5/11 min.",
        "The hands do not coincide every 60 minutes, because the hour hand has moved on by then.",
        String(ans)), false);
    }
    const h = rng.int(1, 12);
    let th, ans, wr, what, whatB;
    if (d === "Easy") {
      th = 0; ans = at(h, 0); what = "coincide"; wr = at(h, 180);
    } else if (d === "Medium") {
      if (rng.chance(0.5)) { th = 180; ans = at(h, 180); what = "are exactly opposite each other"; whatB = "be exactly opposite each other"; wr = at(h, 0); }
      else {
        const c = [at(h, 90), at(h, 270)].filter(okm);
        if (!c.length) return null;
        ans = Math.min.apply(null, c); th = 90; what = "are at right angles to each other"; whatB = "be at right angles to each other";
        wr = c.length > 1 ? Math.max.apply(null, c) : at(h, 180);
      }
    } else {
      const ang = T(rng, [20, 30, 40, 50, 60, 70, 80, 100, 110, 120, 130, 140, 150]);
      const c = [at(h, ang), at(h, 360 - ang)].filter(okm);
      if (!c.length) return null;
      ans = Math.min.apply(null, c); th = ang; what = `are ${ang}° apart`; whatB = `be ${ang}° apart`;
      wr = c.length > 1 ? Math.max.apply(null, c) : at(h, 90);
    }
    if (!okm(ans)) return null;
    const x = ans * 11 / 2;                    // = 30h + th reduced mod 360 (the relative angle to be covered)
    const hh2 = h === 12 ? 1 : h + 1;
    const nxt = h === 12 ? "12 and 1" : `${h} and ${hh2}`;
    const lead = T(rng, LEAD);
    const ctx = lead + (d === "Easy" ? T(rng, [
      `At what time between ${nxt} o'clock do the hands of a clock coincide? Give the minutes past ${h}.`,
      `After ${h} o'clock, how many minutes pass before the hour hand and minute hand next coincide?`,
      `${nm}'s clock shows exactly ${h} o'clock. After how many minutes will the two hands coincide for the first time?`,
      `Find the time between ${nxt} when the hands of a clock are together, as minutes past ${h}.`,
    ]) : T(rng, [
      `At what time between ${nxt} o'clock will the hands of a clock be such that they ${what}? Give the minutes past ${h}.`,
      `Starting at ${h} o'clock, after how many minutes do the hands of a clock ${whatB} for the first time?`,
      `${nm} starts a stopwatch at exactly ${h} o'clock. How many minutes later will the clock's hands ${whatB} for the first time?`,
      `Between ${nxt} o'clock, the hands of a correct clock ${what} at how many minutes past ${h}?`,
    ]));
    const hp = 30 * (h % 12);
    const wrongs = [
      [x / 6, "Moved the minute hand at 6° per minute but forgot that the hour hand also moves"],
      [x / 5, "Used 5° per minute as the relative speed instead of 5.5°"],
      [wr, "Used the condition for a different relative angle"],
      [ans + 60 / 11, "Stopped one 5 5/11-minute step too late"],
      [ans - 60 / 11, "Stopped one 5 5/11-minute step too early"],
      [Math.floor(ans), "Dropped the fraction of a minute"],
    ];
    const target = d === "Easy" ? `0°` : (d === "Medium" ? (th === 180 ? "180°" : "90°") : `${th}°`);
    const usedTh = d === "Medium" && th === 90 ? (ans === at(h, 90) ? 90 : 270) : (d === "Hard" ? (ans === at(h, th) ? th : 360 - th) : th);
    return build(rng, minTxt, ans, wrongs, fin(d, ctx,
      [`At ${h} o'clock the minute hand is ${(360 - hp) % 360}° behind the hour hand`, `The minute hand gains 5.5° per minute, and the hands must reach a gap of ${usedTh}° (measured as minute hand minus hour hand)`, `Time = (30 × ${h % 12} + ${usedTh}) ÷ 5.5 reduced to one lap = ${N(x)} ÷ 5.5 = **${mixed(ans)} min** past ${h}`],
      `Minutes past h = (30h + required angle) × 2/11 (take the required angle as 0°, 180°, 90° or 270° and keep the result below 60).`,
      "Without the 0.5° movement of the hour hand, the answer would be a plain number of minutes; the hands never meet exactly on a minute mark here.",
      String(ans)), false);
  }) });

  /* ------------------------------------------------------------------ 3. gaining and losing clocks */
  QB.gen("quant/clocks/gaining-and-losing-clocks", { title: "Gaining & losing clocks", gen: wrap((rng, d) => {
    const nm = T(rng, NAMES), gain = rng.chance(0.5), word = gain ? "gains" : "loses", sg = gain ? 1 : -1;
    if (d === "Easy") {
      const g = T(rng, [2, 3, 4, 5, 6, 8, 10]), s = rng.int(6, 9), n = rng.int(2, 6);
      const err = g * n, base = (s + n) * 60;
      if (err % 60 === 0) return null;
      const ans = base + sg * err;
      const q = T(rng, [
        `A clock ${word} **${g} minutes** every hour. ${nm} sets it right at **${s}:00 AM**. What time will the clock show when the true time is **${s + n}:00**?`,
        `A watch ${word} ${g} minutes per hour. It was correct at ${s} o'clock in the morning. What does it show when the correct time is ${s + n} o'clock?`,
        `${nm}'s wall clock ${word} ${g} minutes in every hour. If it was set to the correct time at ${s}:00, what will it show after ${n} hours of true time?`,
      ]);
      return build(rng, tf, ans, [
        [base - sg * err, `Applied the error in the wrong direction (the clock ${gain ? "gains" : "loses"} time)`],
        [base + sg * g, "Counted the error of one hour only, not " + n + " hours"],
        [base + sg * (err + g), "Counted one hour too many"],
        [base + sg * (err - g), "Counted one hour too few"],
        [base + sg * err * 2, "Doubled the total error"],
      ], fin(d, q,
        [`Error after ${n} hours = ${g} × ${n} = ${err} minutes`, `The clock ${word} time, so it shows the true time ${gain ? "plus" : "minus"} ${err} min`, `Shown time = **${tf(ans)}**`],
        `Total error = rate × hours = ${g} × ${n} = ${err} min; ${gain ? "add" : "subtract"} it to the true time.`,
        `A clock that ${word} time is ${gain ? "ahead of" : "behind"} the true time, so the error is ${gain ? "added" : "subtracted"}.`,
        ratioCalc(tf(ans))), true);
    }
    if (d === "Medium") {
      const g = T(rng, gain ? [5, 6, 10, 12, 15, 20] : [4, 5, 6, 10, 12, 15]), n = rng.int(2, 8), m0 = T(rng, [10, 15, 20, 25, 30, 40, 45, 50]), s = rng.int(1, 8);
      const rate = 60 + sg * g, C = n * rate;                 // clock minutes elapsed
      const start = s * 60 + m0, shown = start + C, real = start + n * 60;
      if (!tf(shown) || !tf(real)) return null;
      const q = T(rng, [
        `A clock ${word} **${g} minutes** every hour. It was set right at **${s}:${pad(m0)}**. Later the clock shows **${tf(shown)}**. What is the true time?`,
        `${nm}'s watch ${word} ${g} min in each true hour and was correct at ${s}:${pad(m0)}. Now it reads ${tf(shown)}. What is the correct time now?`,
        `A faulty clock that ${word} ${g} minutes an hour was last set right at ${s}:${pad(m0)}. It now shows ${tf(shown)}. Find the true time.`,
      ]);
      const wrongTrue = start + C * (60 - sg * g) / 60;        // used the wrong direction of the correction
      return build(rng, tf, real, [
        [start + C * (60 + sg * g) / 60 * 1, "Applied the error rate to the clock's own minutes in the wrong way"],
        [shown, "Read the clock time as the true time"],
        [start + n * 60 + sg * g, "Added one hour's error instead of correcting by the total"],
        [start + 60 * C / (60 - sg * g), `Used the rate of a clock that ${gain ? "loses" : "gains"} time`],
        [shown - sg * g * n, "Subtracted the error in the wrong direction"],
        [wrongTrue, "Corrected by the wrong proportion"],
      ], fin(d, q,
        [`In 60 minutes of true time the clock moves ${rate} minutes`, `Clock time elapsed = ${tf(shown)} − ${tf(start)} = ${C} min`, `True time elapsed = ${C} × 60 ÷ ${rate} = ${n * 60} min`, `True time = ${tf(start)} + ${n} h = **${tf(real)}**`],
        `Clock minutes : true minutes = ${rate} : 60. Divide the clock's elapsed time by ${rate} and multiply by 60.`,
        `The clock's elapsed time is NOT the true elapsed time: scale it by 60/${rate}.`,
        ratioCalc(tf(real))), true);
    }
    // Hard
    if (rng.chance(0.5)) {
      const s = rng.int(1, 9), f = rng.int(1, 9), H = rng.int(2, 40) * 2;
      const t = s * H / (s + f);
      if (!Number.isInteger(t) || t >= H) return null;
      const place = T(rng, [["noon on Monday", "noon on Wednesday"], ["8 AM on Friday", "8 AM on Sunday"], ["6 PM on Tuesday", "6 PM on Thursday"], ["9 AM on Monday", "9 AM on Wednesday"]]);
      const q = T(rng, [
        `A watch that gains uniformly is **${s} min slow** at ${place[0]} and **${f} min fast** exactly **${H} hours** later. How many hours after the first reading was it correct?`,
        `${nm}'s clock runs at a constant gain. It was ${s} minutes slow at one instant, and ${H} hours later it was ${f} minutes fast. After how many hours from the first instant did it show the correct time?`,
        `A uniformly gaining clock is ${s} min behind the true time at the first check and ${f} min ahead ${H} hours later. How many hours after the first check was it exactly right?`,
      ]);
      const hrs = (x) => (x <= 0 ? null : N(x) + " hours");
      return build(rng, hrs, t, [
        [f * H / (s + f), "Measured the time before the second reading instead of after the first"],
        [H / 2, "Assumed the clock was right halfway between the checks"],
        [s * H / f, "Divided by the fast error alone instead of the total swing"],
        [H - s, "Subtracted the slow error from the time gap"],
        [s * H / (s + f) + 1, "Off by one hour"],
      ], fin(d, q,
        [`Total swing = ${s} (slow) + ${f} (fast) = ${s + f} min in ${H} hours`, `Gain per hour = ${s + f}/${H} min`, `It must gain the first ${s} min: time = ${s} ÷ (${s + f}/${H}) = **${t} hours**`],
        `Time to correct = slow error × (total hours ÷ total swing) = ${s} × ${H}/${s + f} = ${t} h.`,
        "The slow error must be made up first; it is not the whole swing and not half of it.",
        String(t)), false);
    }
    // faulty clock whose hands coincide every M minutes of true time
    const M = rng.int(60, 70);
    if (M === 65) return null;
    const gnum = 1440 * (720 - 11 * M) / (11 * M), gabs = Math.abs(gnum);
    const f0 = fr(gabs);
    if (!f0 || f0[1] > 90 || gabs < 1) return null;
    const gw = gnum > 0 ? "Gains" : "Loses";
    const txt = (x) => (x <= 0 ? null : gw + " " + mixed(x) + " min");
    const q = T(rng, [
      `The hands of a faulty clock coincide every **${M} minutes** of correct time. How much time does the clock gain or lose in 24 hours?`,
      `In ${nm}'s old clock the minute hand and hour hand meet once every ${M} minutes by the correct time. Find its gain or loss in a day.`,
      `A clock's hands are found to coincide at intervals of ${M} minutes (true time). By how much does it gain or lose in 24 hours?`,
    ]);
    return build(rng, txt, gabs, [
      [22 * Math.abs(720 / 11 - M), "Used 22 coincidences in the day with the rounded 65 5/11 minute interval wrongly"],
      [24 * Math.abs(720 / 11 - M), "Treated the difference per coincidence as the loss per hour"],
      [Math.abs(1440 * (720 / 11 - M) / (720 / 11)), "Divided by the correct interval instead of the faulty clock's interval"],
      [Math.abs(1440 * (65 - M) / 65), "Used 65 minutes as the correct interval"],
      [Math.abs(720 / 11 - M), "Gave the difference for a single coincidence only"],
    ], fin(d, q,
      [`A correct clock has coincidences every 720/11 = 65 5/11 min`, `Here the true interval is ${M} min, so the clock ${gnum > 0 ? "gains" : "loses"} (720/11 − ${M}) = ${mixed(Math.abs(720 / 11 - M))} min per coincidence`, `In 24 h there are 1440/${M} coincidences: ${mixed(gabs)} min, so the clock **${gnum > 0 ? "gains" : "loses"} ${mixed(gabs)} min**`],
      `Gain per day = 1440 × (720/11 − M) ÷ M (a positive value means gain; a negative value means loss).`,
      `If the interval is SHORTER than 65 5/11 min the clock ${"gains"}; if longer it loses. Do not use 65 min as the standard.`,
      String(gabs)), false);
  }) });
  // calc string for a time shown as H:MM: compare as the ratio H/MM
  function ratioCalc(s) { if (s == null) return "0"; const p = s.split(":"); return `${+p[0]}/${+p[1]}`; }

  /* ------------------------------------------------------------------ 4. clock in a mirror */
  QB.gen("quant/clocks/clock-in-a-mirror", { title: "Clock seen in a mirror", gen: wrap((rng, d) => {
    const nm = T(rng, NAMES);
    if (d === "Hard" && rng.chance(0.5)) {
      const R = rng.int(1, 719), n = rng.int(5, 55);
      if (R % 60 === 0) return null;
      const real = (720 - R) % 720, ans = real + n;
      const reading = tf(R);
      if (!reading) return null;
      const q = T(rng, [
        `${nm} sees a clock in a mirror and it appears to show **${reading}**. What will the actual clock show **${n} minutes** later?`,
        `The image of a wall clock in a mirror reads ${reading}. What is the true time ${n} minutes from now?`,
        `A clock is viewed in a mirror and looks like ${reading}. Find the real time after another ${n} minutes.`,
      ]);
      return build(rng, tf, ans, [
        [R + n, "Added the minutes to the mirror reading"],
        [720 - (R + n), "Added the minutes to the mirror reading and then reflected"],
        [real - n, "Subtracted the minutes from the real time"],
        [R - n, "Subtracted the minutes from the mirror reading"],
        [720 - (R - n), "Reflected after subtracting the minutes from the mirror reading"],
        [real + 2 * n, "Doubled the elapsed minutes"],
      ], fin(d, q,
        [`Real time now = 11:60 − ${reading} = ${tf(real)}`, `After ${n} min: ${tf(real)} + ${n} min = **${tf(ans)}**`],
        `Real time = 11:60 − mirror reading; then add the ${n} minutes to the REAL time.`,
        "The elapsed minutes belong to the real clock, not to the mirror image.",
        ratioCalc(tf(ans))), true);
    }
    let t, h, m;
    if (d === "Easy") { h = rng.int(1, 12); m = T(rng, [15, 30, 45]); }
    else { h = rng.int(1, 12); m = rng.int(1, 59); }
    t = (h % 12) * 60 + m;
    const mir = (720 - t) % 720;
    if (mir === t) return null;
    const back = d === "Hard" || (d === "Medium" && rng.chance(0.5));
    const shownT = back ? tf(mir) : tf(t), ansT = back ? t : mir;
    if (!shownT) return null;
    const lead = T(rng, LEAD);
    const q = lead + (back ? T(rng, [
      `A clock seen in a mirror appears to show **${shownT}**. What is the actual time?`,
      `${nm} reads ${shownT} on the reflection of a clock in a mirror. What does the clock really show?`,
      `The mirror image of a clock reads ${shownT}. Find the actual time on the clock.`,
    ]) : T(rng, [
      `A clock shows **${shownT}**. What time will its image in a plane mirror appear to show?`,
      `The actual time is ${shownT}. What time does the reflection of the clock in a mirror show?`,
      `${nm} holds a mirror in front of a clock that reads ${shownT}. What time does the mirror image show?`,
    ]));
    const mm = ansT % 60, hh = Math.floor(ansT / 60), sm = (back ? mir : t);
    const x = back ? mir : t;
    return build(rng, tf, ansT, [
      [(12 - Math.floor(x / 60)) % 12 * 60 + (60 - x % 60) % 60, "Took 12 − H for the hours and 60 − M for the minutes, which is an hour too late"],
      [(11 - Math.floor(x / 60) + 12) % 12 * 60 + x % 60, "Reflected the hour but left the minutes unchanged"],
      [x, "Assumed the mirror shows the same time"],
      [(6 * 60 + x) % 720, "Rotated the dial by 6 hours"],
      [(11 - Math.floor(x / 60) + 12) % 12 * 60 + (60 - x % 60), "Used 11 − H correctly but forgot the minutes borrow in a wrong way"],
      [720 - x + 60, "Reflected the time and added an hour"],
    ], fin(d, q,
      [`Mirror image time = 11:60 − actual time (equivalently 12:00 − time)`, `11:60 − ${shownT.replace(/^(\d+):/, "$1:")} = **${tf(ansT)}**`],
      "Subtract from 11:60 (or from 12:00): the hours go to 11 − H and the minutes to 60 − M.",
      "Subtracting only the hours or only the minutes gives a wrong reflection.",
      ratioCalc(tf(ansT))), true);
  }) });
})();
