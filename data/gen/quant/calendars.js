/* =====================================================================
   Calendars: generators for the catalog patterns marked gen:true
   (day-of-the-week-for, n-days-after-monday, repeating-calendar-years).
   Weekday answers are shown as "Thursday (4)" (Sunday = 0 ... Saturday = 6) so
   that tools/verify.js can machine-check them against JavaScript's Date (UTC).
   ===================================================================== */
(function () {
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 35, Medium: 60, Hard: 95 };
  const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const NAMES = ["Aarav", "Meera", "Rohit", "Sneha", "Kiran", "Divya", "Arjun", "Pooja", "Vikram", "Ananya", "Suresh", "Neha", "Imran", "Lakshmi", "Harsh", "Kavya", "Manoj", "Riya", "Farhan", "Tanvi", "Gopal", "Isha", "Naveen", "Shreya", "Deepak", "Nisha", "Rahul", "Swati", "Karthik", "Preeti"];
  const LEAD = ["", "", "Warm-up: ", "Mock test: ", "Try this: ", "Practice question: ", "Campus drive: ", "Interview round: ", "Quick one: "];
  const NOTE = " *(In the options, Sunday = 0, Monday = 1, … Saturday = 6.)*";
  const isLeap = (y) => y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  const utc = (y, m, d) => Date.UTC(y, m, d);
  const dow = (y, m, d) => new Date(utc(y, m, d)).getUTCDay();
  const jan1 = (y) => dow(y, 0, 1);
  const same = (a, b) => isLeap(a) === isLeap(b) && jan1(a) === jan1(b);
  const mod7 = (x) => ((x % 7) + 7) % 7;
  const mdays = (y, m) => [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
  const doy = (y, m, d) => { let n = d; for (let i = 0; i < m; i++) n += mdays(y, i); return n; };
  const dstr = (y, m, d) => `${d} ${MON[m]} ${y}`;
  const dayTxt = (i) => `${DAY[i]} (${i})`;

  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 800; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("calendars: no clean question found");
    };
  }
  // ans/wrongs hold raw values; f formats; wrongs = [[value, why], ...]
  function build(rng, f, ans, wrongs, extra) {
    const A = f(ans), seen = new Set([A]), pairs = [[A, null]];
    for (const w of wrongs) {
      if (pairs.length === 4) break;
      const t = f(w[0]);
      if (t == null || seen.has(t)) continue;
      seen.add(t); pairs.push([t, w[1]]);
    }
    if (pairs.length < 4) return null;
    const o = QB.options(rng, pairs);
    return Object.assign({ time: TIME[extra.d] }, extra, o);
  }
  const dayWrongs = (x, extra) => extra.concat([
    [mod7(x + 1), "One odd day too many"],
    [mod7(x - 1), "One odd day too few"],
    [mod7(x + 2), "Two odd days too many"],
    [mod7(x - 2), "Two odd days too few"],
    [mod7(x + 3), "Three odd days too many"],
  ]);
  const fin = (d, q, sol, short, trap, calc, check) => { const r = { d, q, sol, short, trap, calc }; if (check) r.check = check; return r; };

  /* ------------------------------------------------------------------ 1. day of the week for a date */
  const EVT = ["a train ticket is dated", "a certificate was issued on", "an exam was held on", "a letter is dated", "a cricket match began on", "a shop opened on", "a flight was booked for", "an agreement was signed on"];
  QB.gen("quant/calendars/day-of-the-week-for", { title: "Day of the week for a date", gen: wrap((rng, d) => {
    const nm = T(rng, NAMES), lead = T(rng, LEAD), ev = T(rng, EVT);
    let y, m, dd, q, sol, short, trap, wr;
    const rd = (yy) => { const mm = rng.int(0, 11); return [mm, rng.int(1, mdays(yy, mm))]; };
    if (d === "Easy") {
      y = rng.int(2001, 2030); [m, dd] = rd(y);
      if (m === 0 && dd === 1) return null;
      const aw = jan1(y), n = doy(y, m, dd) - 1, ans = dow(y, m, dd);
      q = lead + T(rng, [
        `1 January ${y} was a **${DAY[aw]}**. On which day of the week did **${dstr(y, m, dd)}** fall?`,
        `In ${y}, New Year's Day was a ${DAY[aw]}. ${nm} notes that ${ev} ${dstr(y, m, dd)}. What day of the week is that?`,
        `If 1 January ${y} fell on a ${DAY[aw]}, what day was ${dstr(y, m, dd)}?`,
      ]) + NOTE;
      sol = [`Days from 1 January to ${dstr(y, m, dd)} = ${n}`, `${n} = 7 × ${Math.floor(n / 7)} + ${n % 7}, so ${n % 7} odd days`, `${DAY[aw]} + ${n % 7} = **${DAY[ans]}**`];
      short = `Count the days after 1 January (${n}), take the remainder when divided by 7, and move that many days forward from ${DAY[aw]}.`;
      trap = "Counting 1 January itself as day 1 shifts the answer by one day; the number of days AFTER 1 January is what matters.";
      return build(rng, dayTxt, ans, dayWrongs(ans, [
        [mod7(aw + (n + 1) % 7), "Counted the starting day as well (one day too many)"],
        [mod7(aw + Math.floor(n / 7)), "Moved forward by the number of weeks instead of the remainder"],
        [aw, "Took the number of days as a whole number of weeks"],
      ]), fin(d, q, sol, short, trap, `new Date(Date.UTC(${y},${m},${dd})).getUTCDay()`, `new Date(Date.UTC(${y},0,1)).getUTCDay()===${aw}`));
    }
    if (d === "Medium") {
      y = rng.int(2001, 2040); [m, dd] = rd(y);
      const ay = y + T(rng, [-3, -2, -1, 1, 2, 3]); const [am, ad] = rd(ay);
      const aw = dow(ay, am, ad), ans = dow(y, m, dd);
      const N = Math.round((utc(y, m, dd) - utc(ay, am, ad)) / 86400000), k = mod7(N);
      let lp = 0; const lo = Math.min(ay, y), hi = Math.max(ay, y);
      for (let yy = lo; yy <= hi; yy++) if (isLeap(yy)) { const t = utc(yy, 1, 29); if (t > Math.min(utc(ay, am, ad), utc(y, m, dd)) && t <= Math.max(utc(ay, am, ad), utc(y, m, dd))) lp++; }
      if (N === 0) return null;
      q = lead + T(rng, [
        `**${dstr(ay, am, ad)}** was a **${DAY[aw]}**. What day of the week was **${dstr(y, m, dd)}**?`,
        `${nm} knows that ${dstr(ay, am, ad)} fell on a ${DAY[aw]}. On which day of the week did ${dstr(y, m, dd)} fall?`,
        `Given that ${ev} ${dstr(ay, am, ad)}, a ${DAY[aw]}, find the day of the week on ${dstr(y, m, dd)}.`,
      ]) + NOTE;
      const fw = N > 0 ? "after" : "before";
      sol = [`Days from ${dstr(ay, am, ad)} to ${dstr(y, m, dd)} = ${Math.abs(N)} (${lp} leap day${lp === 1 ? "" : "s"} included)`, `${Math.abs(N)} = 7 × ${Math.floor(Math.abs(N) / 7)} + ${Math.abs(N) % 7}, so ${Math.abs(N) % 7} odd days ${fw}`, `${DAY[aw]} ${N > 0 ? "+" : "−"} ${Math.abs(N) % 7} = **${DAY[ans]}**`];
      short = "Odd days = (ordinary years + 2 × leap years) mod 7, plus the extra days of the months; do not forget 29 February.";
      trap = lp ? `Forgetting the leap day (29 February) in the gap moves the answer by one day.` : "Check carefully whether a 29 February falls between the two dates.";
      return build(rng, dayTxt, ans, dayWrongs(ans, [
        [mod7(ans - (N > 0 ? 1 : -1) * Math.sign(1) * lp), lp ? "Ignored the leap day(s) in the gap" : "Moved in the wrong direction"],
        [mod7(aw - (N > 0 ? -1 : 1) * (Math.abs(N) % 7)), "Moved in the wrong direction (before instead of after, or the reverse)"],
        [aw, "Assumed the gap is a whole number of weeks"],
      ]), fin(d, q, sol, short, trap, `new Date(Date.UTC(${y},${m},${dd})).getUTCDay()`, `new Date(Date.UTC(${ay},${am},${ad})).getUTCDay()===${aw}`));
    }
    // Hard: no anchor, century odd days
    y = T(rng, [rng.int(1801, 1999), rng.int(1901, 2099), rng.int(1951, 2099)]); [m, dd] = rd(y);
    const ans = dow(y, m, dd), Y1 = y - 1;
    const cOdd = [0, 5, 3, 1][Math.floor(Y1 / 100) % 4], r = Y1 % 100, rOdd = (r + Math.floor(r / 4)) % 7;
    const tot = doy(y, m, dd), odd = (cOdd + rOdd + tot) % 7;
    if (odd !== ans) throw new Error("calendars: century method disagrees with Date for " + dstr(y, m, dd));
    q = lead + T(rng, [
      `On which day of the week did **${dstr(y, m, dd)}** fall?`,
      `${nm} reads that ${ev} ${dstr(y, m, dd)}. Which day of the week was that?`,
      `Find the day of the week on ${dstr(y, m, dd)}.`,
    ]) + NOTE;
    const c100 = Math.floor(Y1 / 100) * 100;
    sol = [
      `Take the ${Y1} completed years before ${y}: ${c100 > 0 ? c100 + " years give " + cOdd + " odd day" + (cOdd === 1 ? "" : "s") + " (100 → 5, 200 → 3, 300 → 1, 400 → 0)" : "no full centuries"}`,
      `The remaining ${r} years have ${Math.floor(r / 4)} leap years: ${r} + ${Math.floor(r / 4)} = ${r + Math.floor(r / 4)}, which leaves ${rOdd} odd day${rOdd === 1 ? "" : "s"}`,
      `Days from 1 January to ${dstr(y, m, dd)} (inclusive) = ${tot}, which leaves ${tot % 7} odd day${tot % 7 === 1 ? "" : "s"}`,
      `Total = ${cOdd} + ${rOdd} + ${tot % 7} = ${cOdd + rOdd + tot % 7}, so ${odd} odd day${odd === 1 ? "" : "s"} from Sunday: **${DAY[ans]}**`,
    ];
    short = "Odd days: centuries (5, 3, 1, 0) + years (years + leap years) + days of the current year, all mod 7; 0 means Sunday.";
    trap = "Use the COMPLETED years (the year before the date's year), and count the date itself in the days of the current year.";
    return build(rng, dayTxt, ans, dayWrongs(ans, [
      [mod7(ans - 1), "Counted the completed years up to the date's own year (or missed the date itself)"],
      [mod7(ans + (isLeap(y) && m > 1 ? 0 : 0) + (cOdd === 0 ? 5 : cOdd - 0 === 5 ? -5 : 1)), "Used a wrong odd-day value for the century"],
      [mod7(ans + Math.floor(r / 4)), "Counted the leap years twice"],
    ]), fin(d, q, sol, short, trap, `new Date(Date.UTC(${y},${m},${dd})).getUTCDay()`));
  }) });

  /* ------------------------------------------------------------------ 2. n days after a given day */
  QB.gen("quant/calendars/n-days-after-monday", { title: "\"n days after Monday\"", gen: wrap((rng, d) => {
    const nm = T(rng, NAMES), lead = T(rng, LEAD);
    const x = rng.int(0, 6), dx = DAY[x];
    let q, sol, short, trap, ans, calc, base = x, N, extraW = [];
    if (d === "Easy") {
      N = rng.int(10, 200);
      const k = N % 7;
      ans = mod7(x + N);
      q = lead + T(rng, [
        `Today is **${dx}**. What day of the week will it be **${N} days** from today?`,
        `${nm} starts a course on a ${dx}. What day of the week will it be ${N} days after the start?`,
        `If it is ${dx} today, what will be the day after ${N} days?`,
        `A parcel is booked on a ${dx} and arrives ${N} days later. On which day does it arrive?`,
      ]) + NOTE;
      sol = [`${N} = 7 × ${Math.floor(N / 7)} + ${k}, so only ${k} odd day${k === 1 ? "" : "s"} matter`, `${dx} + ${k} = **${DAY[ans]}**`];
      short = `Divide ${N} by 7 and keep the remainder (${k}); move that many days forward.`;
      trap = "Use the remainder after dividing by 7, not the quotient.";
      calc = `(${x}+${N})%7`;
      extraW = [[mod7(x + Math.floor(N / 7)), "Used the quotient of the division instead of the remainder"], [mod7(x + k - 1), "Counted the starting day as well"]];
    } else if (d === "Medium") {
      const kind = rng.int(0, 2);
      if (kind === 0) {
        N = rng.int(20, 300);
        const back = rng.int(1, 3); // day before yesterday etc.
        const td = mod7(x + 2);       // x = day before yesterday -> today = x + 2
        ans = mod7(td + 1 + N);
        q = lead + `If the day before yesterday was **${dx}**, what day of the week will it be **${N} days** after tomorrow?` + NOTE;
        sol = [`Day before yesterday is ${dx}, so today is ${DAY[td]} and tomorrow is ${DAY[mod7(td + 1)]}`, `${N} = 7 × ${Math.floor(N / 7)} + ${N % 7}`, `${DAY[mod7(td + 1)]} + ${N % 7} = **${DAY[ans]}**`];
        short = "Fix today first, then count from tomorrow with the remainder after dividing by 7.";
        trap = "Counting from today (instead of tomorrow) or from the day before yesterday shifts the answer.";
        calc = `(${x}+2+1+${N})%7`;
        extraW = [[mod7(td + N), "Counted from today instead of tomorrow"], [mod7(x + N), "Counted from the day before yesterday"]];
      } else if (kind === 1) {
        N = rng.int(20, 300);
        ans = mod7(x - N);
        q = lead + T(rng, [
          `Today is **${dx}**. What day of the week was it **${N} days ago**?`,
          `${nm} finds an old receipt dated ${N} days before a ${dx}. On which day of the week was it issued?`,
        ]) + NOTE;
        sol = [`${N} = 7 × ${Math.floor(N / 7)} + ${N % 7}, so ${N % 7} odd days backwards`, `${dx} − ${N % 7} = **${DAY[ans]}**`];
        short = "Going back, subtract the remainder after dividing by 7.";
        trap = "Adding the remainder instead of subtracting it gives the day after.";
        calc = `((${x}-${N})%7+7)%7`;
        extraW = [[mod7(x + N), "Moved forward instead of backward"], [mod7(x - N + 1), "Moved back one day too few"]];
      } else {
        const date = rng.int(1, 9), tgt = date + rng.int(8, 21) + (rng.chance(0.4) ? 7 : 0);
        ans = mod7(x + tgt - date);
        q = lead + `If the **${date}th** of a certain month is a **${dx}**, what day of the week is the **${tgt}th** of the same month?`.replace(/(\d)th/g, (m0, n0) => n0 + ({ 1: "st", 2: "nd", 3: "rd" }[n0] || "th")) + NOTE;
        q = q.replace(/\b(\d+)(st|nd|rd|th)\b/g, (m1, n1) => { const n = +n1, s = (n % 100 >= 11 && n % 100 <= 13) ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[n % 10] || "th"); return n + s; });
        sol = [`Difference in dates = ${tgt} − ${date} = ${tgt - date} days`, `${tgt - date} = 7 × ${Math.floor((tgt - date) / 7)} + ${(tgt - date) % 7}`, `${dx} + ${(tgt - date) % 7} = **${DAY[ans]}**`];
        short = "Same month: the day shifts by (difference in dates) mod 7.";
        trap = "Counting both dates inclusively gives one extra day.";
        calc = `(${x}+${tgt}-${date})%7`;
        extraW = [[mod7(ans + 1), "Counted both dates, one day too many"], [mod7(x + Math.floor((tgt - date) / 7)), "Used the number of weeks instead of the remainder"]];
      }
    } else {
      const kind = rng.int(0, 2);
      if (kind === 0) {
        N = rng.int(300, 3000);
        const td = mod7(x + 1);
        const dir = rng.chance(0.5);
        ans = dir ? mod7(x + 2 + N) : mod7(x + 2 - N);
        q = lead + (dir ? `Yesterday was **${dx}**. What day of the week will it be **${N} days** from tomorrow?`.replace("from tomorrow", "after tomorrow") : `Yesterday was **${dx}**. What day of the week was it **${N} days before** tomorrow?`) + NOTE;
        sol = [`Yesterday was ${dx}, so today is ${DAY[td]} and tomorrow is ${DAY[mod7(td + 1)]}`, `${N} = 7 × ${Math.floor(N / 7)} + ${N % 7}`, `${DAY[mod7(td + 1)]} ${dir ? "+" : "−"} ${N % 7} = **${DAY[ans]}**`];
        short = "Move to tomorrow first, then apply the remainder (forward or backward).";
        trap = "Counting from today or from yesterday shifts the answer by one or two days.";
        calc = dir ? `(${x}+1+1+${N})%7` : `((${x}+1+1-${N})%7+7)%7`;
        extraW = [[dir ? mod7(x + 1 + N) : mod7(x + 1 - N), "Counted from today instead of tomorrow"], [dir ? mod7(x + N) : mod7(x - N), "Counted from yesterday instead of tomorrow"], [dir ? mod7(x + 2 - N) : mod7(x + 2 + N), "Moved in the wrong direction"]];
      } else if (kind === 1) {
        // first day of a later month
        const y = rng.int(2001, 2040), m0 = rng.int(0, 10), span = rng.int(2, 4);
        let days = 0; for (let i = 0; i < span; i++) { const mm = (m0 + i) % 12, yy = y + Math.floor((m0 + i) / 12); days += mdays(yy, mm); }
        const m1 = (m0 + span) % 12, y1 = y + Math.floor((m0 + span) / 12);
        const wk = dow(y, m0, 1);
        ans = dow(y1, m1, 1);
        q = lead + `**1 ${MON[m0]} ${y}** was a **${DAY[wk]}**. What day of the week was **1 ${MON[m1]} ${y1}**?` + NOTE;
        sol = [`Days from 1 ${MON[m0]} to 1 ${MON[m1]}: ${Array.from({ length: span }, (_, i) => mdays(y + Math.floor((m0 + i) / 12), (m0 + i) % 12)).join(" + ")} = ${days}`, `${days} = 7 × ${Math.floor(days / 7)} + ${days % 7}`, `${DAY[wk]} + ${days % 7} = **${DAY[ans]}**`];
        short = "Add up the days of the months in between, keep the remainder mod 7, and move forward.";
        trap = "Using 30 days for every month (or 28 for February in a leap year) shifts the answer.";
        const wrongM = [30 * span, 31 * span, days + 1, days - 1];
        return build(rng, dayTxt, ans, wrongM.map((w, i) => [mod7(wk + w), ["Treated every month as 30 days", "Treated every month as 31 days", "Counted one day too many", "Counted one day too few"][i]]).concat(dayWrongs(ans, [])), fin(d, q, sol, short, trap, `new Date(Date.UTC(${y1},${m1},1)).getUTCDay()`, `new Date(Date.UTC(${y},${m0},1)).getUTCDay()===${wk}`));
      } else {
        const wks = rng.int(3, 40), ex = rng.int(1, 6);
        N = wks * 7 + ex;
        const hrs = rng.int(1, 4);
        ans = mod7(x + N);
        q = lead + `${nm} left home on a **${dx}** and returned **${wks} weeks and ${ex} day${ex === 1 ? "" : "s"}** later. On which day of the week did ${nm} return?` + NOTE;
        sol = [`${wks} weeks is a whole number of weeks, so it leaves 0 odd days`, `Only the extra ${ex} day${ex === 1 ? "" : "s"} count: ${dx} + ${ex} = **${DAY[ans]}**`];
        short = "Whole weeks do not change the day; only the leftover days do.";
        trap = `Adding the ${wks} weeks as days shifts the answer.`;
        calc = `(${x}+${wks}*7+${ex})%7`;
        extraW = [[mod7(x + wks + ex), "Added the weeks as if each were one day"], [mod7(x + wks), "Ignored the extra days"], [mod7(x + ex - 1), "Counted one day too few"]];
      }
    }
    return build(rng, dayTxt, ans, extraW.concat(dayWrongs(ans, [])), fin(d, q, sol, short, trap, calc));
  }) });

  /* ------------------------------------------------------------------ 3. repeating calendar years */
  const firstSame = (Y, dir) => { for (let y = Y + dir; y > 1700 && y < 2400; y += dir) if (same(y, Y)) return y; return null; };
  QB.gen("quant/calendars/repeating-calendar-years", { title: "Repeating calendar years", gen: wrap((rng, d) => {
    const nm = T(rng, NAMES), lead = T(rng, LEAD);
    let Y, dir = 1;
    if (d === "Easy") Y = rng.int(2001, 2030);
    else if (d === "Medium") { Y = rng.int(1905, 2060); if (rng.chance(0.4)) dir = -1; }
    else { Y = T(rng, [rng.int(2085, 2099), rng.int(1885, 1899), rng.int(2065, 2099), rng.int(1990, 2099)]); if (rng.chance(0.3)) dir = -1; }
    if (d === "Easy" && isLeap(Y) && rng.chance(0.5)) return null;
    const A = firstSame(Y, dir);
    if (!A) return null;
    const lo = Math.min(Y, A), hi = Math.max(Y, A);
    const leaps = []; for (let y = lo; y < hi; y++) if (isLeap(y)) leaps.push(y);
    const n = hi - lo, odd = n + leaps.length;
    if (odd % 7 !== 0) throw new Error("calendars: repeating years check failed");
    const word = dir > 0 ? "later" : "earlier", ordw = dir > 0 ? "first" : "most recent";
    const kind = isLeap(Y) ? "a leap year" : "an ordinary year";
    const q = lead + T(rng, [
      `The calendar of the year **${Y}** is the same as the calendar of which ${word} year (the ${ordw} such year)?`,
      `${nm} wants to reuse a ${Y} calendar. What is the ${ordw} ${dir > 0 ? "year after" : "year before"} ${Y} that has exactly the same calendar?`,
      `${Y} is ${kind}. Find the ${ordw} ${word} year whose calendar is identical to that of ${Y}.`,
    ]);
    const gaps = [5, 6, 7, 11, 12, 28, 27, 10, 9, 22, 17, 33, 40];
    const why = (g) => g === 28 ? "Applied the 28-year rule, which is not the first repeat here" : (g === 11 || g === 6 || g === 12 || g === 5 || g === 7) ? "Used a repeat gap that fails the odd-day count for this year" : "Used a gap whose odd days are not a multiple of 7";
    const cands = []; for (const g of gaps) { const w = Y + dir * g; if (w !== A && !same(w, Y) && w > 1700) cands.push([w, why(g)]); }
    cands.push([A + dir, "Took the year next to the correct one"], [A - dir * 6, "Took a nearby year with a different first weekday"]);
    const calc = `(()=>{const L=y=>y%4===0&&(y%100!==0||y%400===0),J=y=>new Date(Date.UTC(y,0,1)).getUTCDay();for(let y=${Y}${dir > 0 ? "+1" : "-1"};;y${dir > 0 ? "++" : "--"})if(L(y)===L(${Y})&&J(y)===J(${Y}))return y})()`;
    const sol = [
      `For the calendars to match, both years must be of the same kind (${isLeap(Y) ? "leap" : "ordinary"}) and the odd days between their 1 January dates must be a multiple of 7`,
      `From 1 January ${lo} to 1 January ${hi}: ${n} years with ${leaps.length} leap year${leaps.length === 1 ? "" : "s"}${leaps.length ? " (" + (leaps.length > 6 ? leaps.slice(0, 3).join(", ") + ", …, " + leaps[leaps.length - 1] : leaps.join(", ")) + ")" : ""}`,
      `Odd days = ${n} + ${leaps.length} = ${odd} = 7 × ${odd / 7}, so ${A} has the same calendar`,
    ];
    return build(rng, (v) => String(v), A, cands, fin(d, q, sol,
      "Add 1 odd day per ordinary year and 2 per leap year until the total is a multiple of 7 (and the kind of year matches).",
      isLeap(Y) ? "A leap year can repeat only in another leap year, usually 28 years away, but a century year like 2100 breaks that." : "The gap is 6, 11 or 12 years depending on where the leap years fall.",
      calc), 0);
  }) });
})();
