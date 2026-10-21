/* =====================================================================
   Direction sense: final direction after turns, distance & direction
   from the start, shadows at sunrise / sunset, coded directions.
   Every answer is a plain compass direction ("North-West") or a distance.
   Each generator simulates the walk / turns so that the keyed answer is the
   real one, and carries a `check` that recomputes the bearing independently
   (North 0, East 90, South 180, West 270) and proves the option is unique.
   ===================================================================== */
(function () {
  const T = (rng, arr) => rng.pick(arr);
  const TIME = { Easy: 40, Medium: 65, Hard: 95 };
  const NAMES = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];
  const mod = (x) => (((x % 360) + 360) % 360);
  const nm = (deg) => NAMES[mod(deg) / 45];
  const NAMEJ = JSON.stringify(NAMES);
  // check: marked option is the compass name of bearing expression `ex` (degrees) and appears once among the options
  const chkD = (ex) => `q.opts[q.ans]===${NAMEJ}[((((${ex})%360)+360)%360)/45]&&q.opts.filter(o=>o===q.opts[q.ans]).length===1`;
  const finish = (d, q, sol, short, trap) => ({ d, q, sol, short, trap });
  function wrap(fn) {
    return function (rng, d) {
      for (let i = 0; i < 3000; i++) { const r = fn(rng, d); if (r) return r; }
      throw new Error("direction-sense: no clean question found");
    };
  }
  // ans = bearing in degrees, wrongs = [[deg, why], ...]; pool = which bearings may fill empty slots
  function mkD(rng, ans, wrongs, extra, cardinal, ex) {
    const used = new Set([mod(ans)]), pairs = [[nm(ans), null]];
    const add = (deg, why) => { deg = mod(deg); if (pairs.length === 4 || used.has(deg)) return; if (cardinal && deg % 90) return; used.add(deg); pairs.push([nm(deg), why]); };
    for (const [deg, why] of wrongs) add(deg, why);
    for (const deg of rng.shuffle(cardinal ? [0, 90, 180, 270] : [0, 45, 90, 135, 180, 225, 270, 315])) add(deg, "Does not follow from the turns");
    return Object.assign({ time: TIME[extra.d] }, extra, QB.options(rng, pairs), { check: chkD(ex) });
  }
  const NM = ["Ravi", "Meena", "Arjun", "Kavya", "Imran", "Sneha", "Rohit", "Divya", "Karan", "Anita", "Suresh", "Pooja", "Vikram", "Lakshmi", "Harish", "Farah"];
  const PLACE = ["a temple in Madurai", "a school in Pune", "a bus stop in Nagpur", "the railway station in Bhopal", "a park in Jaipur", "a market in Kochi", "the library in Lucknow", "a hospital in Indore", "a college gate in Vellore", "a ground in Ranchi"];
  const person = (rng) => { const n = T(rng, NM); return { n, he: ["Meena", "Kavya", "Sneha", "Divya", "Anita", "Pooja", "Lakshmi", "Farah"].includes(n) ? "she" : "he" }; };
  const turnTxt = (deg) => {
    switch (deg) {
      case 90: return T0(["turns right", "takes a right turn", "turns 90° clockwise"]);
      case -90: return T0(["turns left", "takes a left turn", "turns 90° anticlockwise"]);
      case 180: case -180: return T0(["makes a U-turn", "turns around completely (180°)", "turns back"]);
      case 270: return "turns 270° clockwise";
      case -270: return "turns 270° anticlockwise";
      case 45: return "turns 45° clockwise";
      case -45: return "turns 45° anticlockwise";
      case 135: return "turns 135° clockwise";
      case -135: return "turns 135° anticlockwise";
      default: return `turns ${deg} degrees`;
    }
  };
  const sdeg = (t) => `${Math.abs(t)}° ${t > 0 ? "clockwise" : "anticlockwise"}`;
  let _rng = null;
  const T0 = (arr) => _rng.pick(arr);
  const sty = (rng) => { _rng = rng; };

  /* ------------------------------------------------------------ 1. final direction after turns */
  QB.gen("reasoning/direction-sense/final-direction-after-turns", { title: "Final direction after turns", gen: wrap((rng, d) => {
    sty(rng);
    const P = person(rng), card = [0, 90, 180, 270];
    const h0 = T(rng, card);
    const n = d === "Easy" ? rng.int(1, 2) : d === "Medium" ? rng.int(3, 4) : rng.int(4, 5);
    const pool = d === "Easy" ? [90, -90] : d === "Medium" ? [90, -90, 90, -90, 180, 270, -270] : [45, -45, 90, -90, 135, -135, 180];
    const turns = []; for (let i = 0; i < n; i++) turns.push(T(rng, pool));
    if (d === "Hard" && !turns.some((t) => Math.abs(t) % 90 !== 0)) return null;
    if (d === "Medium" && !turns.some((t) => Math.abs(t) > 90)) return null;
    let h = h0; for (const t of turns) h += t;
    h = mod(h);
    if (d !== "Hard" && h % 90) return null;
    const dist = () => rng.int(2, 9);
    const parts = turns.map((t) => `${turnTxt(t)}${rng.chance(0.5) ? ` and walks ${dist()} ${d === "Easy" ? "km" : "m"}` : ""}`);
    const start = `${P.n} starts from ${T(rng, PLACE)} and walks ${dist()} ${d === "Easy" ? "km" : "m"} towards the ${nm(h0)}`;
    const body = parts.map((p, i) => (i === 0 ? "then " : i === parts.length - 1 ? "and finally " : "then ") + p).join(", ");
    const q = T(rng, [`${start}, ${body}. In which direction is ${P.he} facing now?`, `${start}. ${P.n[0].toUpperCase() + P.n.slice(1)} ${parts.map((p, i) => (i === 0 ? "then " : "after that ") + p).join(", ")}. Which direction is ${P.he} facing at the end?`]);
    const mirror = mod(h0 - turns.reduce((a, b) => a + b, 0)), ignoreLast = mod(h - turns[turns.length - 1]);
    const steps = []; let cur = h0;
    turns.forEach((t, i) => { cur += t; steps.push(`${nm(cur - t)} ${t > 0 ? "+" : "−"} ${Math.abs(t)}° ${t > 0 ? "clockwise" : "anticlockwise"} → ${nm(cur)}`); });
    return mkD(rng, h, [[mirror, "Swapped left and right"], [ignoreLast, "Left out the last turn"], [h + 180, "Gave the opposite direction"], [h0, "Gave the starting direction"], [h + 90, "Turned one quarter too far"]],
      finish(d, q, [`Start facing ${nm(h0)}. Right/clockwise adds degrees, left/anticlockwise subtracts (N 0°, E 90°, S 180°, W 270°).`, steps.join("; "), `Final direction: **${nm(h)}**.`],
        "Turn right = add 90°, turn left = subtract 90°, a U-turn = 180°; add them all up and reduce.", "Do not let the walking distances distract you: only the turns change the direction."), d !== "Hard", `${h0}+(${turns.join(")+(")})`);
  }) });

  /* ------------------------------------------------------------ 2. distance and direction from start */
  const DX = [0, 1, 0, -1], DY = [1, 0, -1, 0];              // N, E, S, W for headings 0, 1, 2, 3
  const hyp = (a, b) => Math.sqrt(a * a + b * b);
  const TRI = [[3, 4], [6, 8], [5, 12], [9, 12], [8, 15], [12, 16], [15, 20], [12, 5], [20, 21], [15, 8], [24, 7], [16, 12]];
  QB.gen("reasoning/direction-sense/distance-and-direction-from-start", { title: "Distance & direction from start (Pythagoras)", gen: wrap((rng, d) => {
    sty(rng);
    const P = person(rng), unit = T(rng, d === "Hard" ? ["km", "m"] : ["km", "m", "km"]);
    const legsN = d === "Easy" ? 2 : d === "Medium" ? 3 : rng.int(4, 5);
    let h = rng.int(0, 3);
    const h0 = h, legs = [], turns = [];
    let x = 0, y = 0, total = 0;
    if (d === "Easy") {
      const [a, b] = T(rng, TRI);
      const t = T(rng, [90, -90]);
      legs.push(a, b); turns.push(t);
      x += DX[h] * a; y += DY[h] * a; h = (h + t / 90 + 4) % 4; x += DX[h] * b; y += DY[h] * b; total = a + b;
    } else {
      for (let i = 0; i < legsN; i++) {
        const len = rng.int(2, d === "Medium" ? 12 : 16);
        legs.push(len); total += len; x += DX[h] * len; y += DY[h] * len;
        if (i < legsN - 1) { const t = T(rng, d === "Hard" ? [90, -90, 90, -90, 180] : [90, -90]); turns.push(t); h = (h + t / 90 + 8) % 4; }
      }
    }
    const dirMode = d !== "Easy" && rng.chance(0.3);
    const dist = hyp(x, y);
    const parts = legs.map((len, i) => (i === 0 ? `walks ${len} ${unit} towards the ${nm(h0 * 90)}` : `${turnTxt(turns[i - 1])} and walks ${len} ${unit}`));
    const story = `${P.n} starts from a point A, ${parts.slice(0, -1).join(", ")} and finally ${parts[parts.length - 1]}`;
    const solPath = [`Take A as the origin with North as +y and East as +x. Net East-West = ${Math.abs(x)} ${unit}${x ? (x > 0 ? " East" : " West") : ""}, net North-South = ${Math.abs(y)} ${unit}${y ? (y > 0 ? " North" : " South") : ""}.`];
    if (!dirMode) {
      if (!Number.isInteger(dist) || dist === 0 || (d !== "Easy" && (x === 0 || y === 0))) return null;
      const q = T(rng, [`${story}. How far is ${P.he} from the starting point A?`, `${story}. What is the shortest distance from A to the final position?`, `${story}. Find the straight-line distance between A and ${P.he === "she" ? "her" : "his"} final position.`]);
      const ax = Math.abs(x), ay = Math.abs(y);
      const wrongs = [[ax + ay, "Added the two net distances instead of using Pythagoras"], [total, "Gave the total distance walked"], [Math.max(ax, ay), "Took only the larger net distance"], [Math.abs(ax - ay), "Subtracted the two net distances"], [dist + 1, "Small slip in the square root"], [dist - 1, "Small slip in the square root"], [dist + 2, "Small slip in the square root"]];
      const seen = new Set([dist]), pairs = [[`${dist} ${unit}`, null]];
      for (const [v, why] of wrongs) { if (pairs.length === 4) break; if (!(v > 0) || !Number.isInteger(v) || seen.has(v)) continue; seen.add(v); pairs.push([`${v} ${unit}`, why]); }
      if (pairs.length < 4) return null;
      return Object.assign({ time: TIME[d] }, finish(d, q, solPath.concat([`Distance = √(${ax}² + ${ay}²) = √${ax * ax + ay * ay} = **${dist} ${unit}**.`]),
        "Add up the East-West and North-South movements separately (opposite directions cancel), then use Pythagoras.", "The distance from the start is the straight line, not the length of the path walked."),
      QB.options(rng, pairs), { calc: String(dist) });
    }
    // direction of the final position from A (only diagonal cases are unambiguous)
    if (Math.abs(x) !== Math.abs(y) || x === 0) return null;
    const fromA = Math.atan2(x, y) * 180 / Math.PI;             // bearing of final position from A
    const startFromEnd = rng.chance(0.5), ansDeg = startFromEnd ? fromA + 180 : fromA;
    const q = startFromEnd ? `${story}. In which direction is the starting point A from ${P.he === "she" ? "her" : "his"} final position?` : `${story}. In which direction is ${P.he} now from the starting point A?`;
    return mkD(rng, ansDeg, [[ansDeg + 180, startFromEnd ? "Gave the direction of the final position from A (the other way round)" : "Gave the direction of A from the final position (the other way round)"], [ansDeg + 90, "Mixed up East-West or North-South"], [ansDeg - 90, "Mixed up East-West or North-South"]],
      finish(d, q, solPath.concat([`Equal movements ${x > 0 ? "East" : "West"} and ${y > 0 ? "North" : "South"} put the final position **${nm(fromA)}** of A, so A is ${nm(fromA + 180)} of the final position.`, `Answer: **${nm(ansDeg)}**.`]),
        "Net East-West and net North-South; equal amounts give a diagonal (NE, SE, SW, NW).", "Read carefully whether the question asks for the direction of the end from the start or the start from the end."), false, `Math.round(Math.atan2(${x},${y})*180/Math.PI)${startFromEnd ? "+180" : ""}`);
  }) });

  /* ------------------------------------------------------------ 3. shadows */
  QB.gen("reasoning/direction-sense/shadows-at-sunrise-sunset", { title: "Shadows at sunrise / sunset", gen: wrap((rng, d) => {
    sty(rng);
    const P = person(rng), morning = rng.chance(0.5);
    const sun = morning ? 90 : 270, shadow = mod(sun + 180);
    const when = morning ? T(rng, ["just after sunrise", "early in the morning, soon after sunrise", "at sunrise"]) : T(rng, ["just before sunset", "in the evening, shortly before sunset", "at sunset"]);
    const REL = [["fell exactly in front of", 0], ["fell exactly behind", 180], ["fell to the right of", 90], ["fell to the left of", -90]];
    const [relTxt, rel] = T(rng, REL);
    const the = P.he === "she" ? "her" : "him";
    const sunWord = morning ? "rises in the East, so shadows fall towards the West" : "sets in the West, so shadows fall towards the East";
    if (d === "Easy") {
      const face = mod(shadow - rel);
      const q = T(rng, [`${when[0].toUpperCase() + when.slice(1)}, ${P.n}'s shadow ${relTxt} ${the}. Which direction was ${P.he} facing?`, `${P.n} was standing in a field ${when}. ${P.he[0].toUpperCase() + P.he.slice(1)} noticed that ${P.he === "she" ? "her" : "his"} shadow ${relTxt} ${the}. In which direction was ${P.he} facing?`]);
      return mkD(rng, face, [[face + 180, "Took the shadow on the wrong side of the person"], [mod(sun - rel), "Put the shadow towards the sun"], [mod(shadow + rel), "Swapped left and right"], [shadow, "Gave the direction of the shadow, not the way the person faced"]],
        finish(d, q, [`The sun ${sunWord}. The shadow points ${nm(shadow)}.`, `The shadow ${relTxt.replace("fell ", "falls ")} the person, so ${rel === 0 ? "the person faces the way the shadow points" : rel === 180 ? "the person faces away from the way the shadow points" : rel > 0 ? "the person is turned 90° anticlockwise from the shadow direction" : "the person is turned 90° clockwise from the shadow direction"}: **${nm(face)}**.`],
          "Shadow points away from the sun: West in the morning, East in the evening. Then place the person relative to the shadow.", "Shadows never point to the sun; check East or West by the time of day."), true, `${sun}+180-(${rel})`);
    }
    if (d === "Medium") {
      const face = mod(shadow - rel), turn = T(rng, [90, -90, 180, 270]);
      const end = mod(face + turn);
      const q = `${when[0].toUpperCase() + when.slice(1)}, ${P.n}'s shadow ${relTxt} ${the}. ${P.he[0].toUpperCase() + P.he.slice(1)} then ${turnTxt(turn)}. Which direction is ${P.he} facing now?`;
      return mkD(rng, end, [[face, "Gave the original direction, before the turn"], [mod(face - turn), "Turned the wrong way"], [mod(end + 180), "Gave the opposite direction"], [mod(shadow + rel + turn), "Swapped left and right when placing the shadow"]],
        finish(d, q, [`The sun ${sunWord}; the shadow points ${nm(shadow)}, so ${P.n} first faces ${nm(face)}.`, `After the turn of ${sdeg(turn)}: **${nm(end)}**.`],
          "Find the first direction from the shadow, then apply the turn.", "Work out the direction before the turn first; the turn is applied to that, not to the shadow."), true, `${sun}+180-(${rel})+(${turn})`);
    }
    // Hard: two people
    const Q = person(rng); if (Q.n === P.n) return null;
    const side = T(rng, [["right", 90], ["left", -90]]);
    const askQ = rng.chance(0.5);
    const faceQ = mod(shadow - side[1]), faceP = mod(faceQ + 180);
    const ans = askQ ? faceQ : faceP;
    const q = `${P.n} and ${Q.n} stand facing each other ${when}. ${P.n}'s shadow falls to the ${side[0]} of ${Q.n}. Which direction is ${askQ ? Q.n : P.n} facing?`;
    return mkD(rng, ans, [[mod(ans + 180), askQ ? `Gave ${P.n}'s direction instead of ${Q.n}'s` : `Gave ${Q.n}'s direction instead of ${P.n}'s`], [mod(shadow + side[1] + (askQ ? 0 : 180)), `Swapped ${side[0]} and ${side[0] === "right" ? "left" : "right"}`], [shadow, "Gave the direction of the shadow itself"], [sun, "Used the direction of the sun"]],
      finish(d, q, [`The sun ${sunWord}; ${P.n}'s shadow points ${nm(shadow)}.`, `The shadow falls to the ${side[0]} of ${Q.n}, so ${Q.n} faces ${nm(faceQ)} (${nm(faceQ)} ${side[0]} = ${nm(shadow)}).`, `${P.n} faces ${Q.n}, i.e. the opposite way: ${nm(faceP)}. Answer for ${askQ ? Q.n : P.n}: **${nm(ans)}**.`],
        "The shadow's direction fixes the listener's right or left; the other person faces the opposite way.", "Two people facing each other face opposite directions; read which person the question asks about."), true, `${sun}+180-(${side[1]})${askQ ? "" : "+180"}`);
  }) });

  /* ------------------------------------------------------------ 4. coded directions */
  QB.gen("reasoning/direction-sense/coded-directions", { title: "Coded directions", gen: wrap((rng, d) => {
    sty(rng);
    const P = person(rng), card = [0, 90, 180, 270];
    let perm;                                    // perm[real index] = called index
    if (d === "Easy") { const r = T(rng, [1, 2, 3]); perm = [0, 1, 2, 3].map((i) => (i + r) % 4); }
    else if (d === "Medium") { const r = T(rng, [1, 2, 3]); perm = [0, 1, 2, 3].map((i) => (i + r) % 4); }
    else { perm = rng.shuffle([0, 1, 2, 3]); if (!perm.every((v, i) => v !== i)) return null; }
    const NAME4 = ["North", "East", "South", "West"];
    const clauses = rng.shuffle([0, 1, 2, 3]).map((i) => `${NAME4[i]} is called ${NAME4[perm[i]]}`);
    const rule = `In a certain code language, ${clauses.slice(0, 3).join(", ")} and ${clauses[3]}.`;
    const realOf = (called) => perm.indexOf(called);            // real index of a called name
    const turn = () => T(rng, [90, -90]);
    if (d === "Easy") {
      const c = rng.int(0, 3), ans = realOf(c) * 90;
      const q = T(rng, [`${rule} If ${P.n} walks towards what is called **${NAME4[c]}**, in which actual direction is ${P.he} walking?`, `${rule} ${P.n} walks in the direction called **${NAME4[c]}**. What is the actual direction?`]);
      return mkD(rng, ans, [[perm[c] * 90, "Applied the code the wrong way round"], [c * 90, "Ignored the code"], [ans + 180, "Gave the opposite direction"]],
        finish(d, q, [`The code says: ${clauses.join("; ")}.`, `The direction called ${NAME4[c]} is the actual direction whose name was changed to ${NAME4[c]}: **${NAME4[realOf(c)]}**.`],
          "Find the line of the code whose right-hand name matches the called direction; the left-hand name is the actual one.", "Look the name up on the correct side of 'is called': the actual direction comes first."), true, `${JSON.stringify(perm)}.indexOf(${c})*90`);
    }
    if (d === "Medium") {
      const c = rng.int(0, 3), t = turn();
      const real0 = realOf(c) * 90, ans = mod(real0 + t);
      const q = `${rule} ${P.n} faces what is called **${NAME4[c]}** and then ${turnTxt(t)}. In which actual direction is ${P.he} facing now?`;
      return mkD(rng, ans, [[mod(real0 - t), "Turned the wrong way"], [mod(perm[c] * 90 + t), "Applied the code the wrong way round"], [mod(c * 90 + t), "Ignored the code"], [real0, "Forgot the turn"]],
        finish(d, q, [`The called ${NAME4[c]} is actually ${NAME4[realOf(c)]}.`, `Facing ${NAME4[realOf(c)]} and turning ${sdeg(t)}: **${nm(ans)}**.`],
          "Translate to real directions first, do the turns, and read off the real answer.", "Turns are physical (left and right do not change); only the names of the compass directions are swapped."), true, `${JSON.stringify(perm)}.indexOf(${c})*90+(${t})`);
    }
    const c = rng.int(0, 3), t1 = turn(), t2 = T(rng, [90, -90, 180]);
    const real0 = realOf(c) * 90, mid = mod(real0 + t1), ans = mod(mid + t2);
    const q = `${rule} ${P.n} faces what is called **${NAME4[c]}**, ${turnTxt(t1)} and then ${turnTxt(t2)}. In which actual direction is ${P.he} facing at the end?`;
    return mkD(rng, ans, [[mod(real0 - t1 - t2), "Turned the wrong way both times"], [mod(perm[c] * 90 + t1 + t2), "Applied the code the wrong way round"], [mod(c * 90 + t1 + t2), "Ignored the code"], [mid, "Forgot the second turn"], [mod(ans + 180), "Gave the opposite direction"]],
      finish(d, q, [`The called ${NAME4[c]} is actually ${NAME4[realOf(c)]}.`, `Start ${NAME4[realOf(c)]}; after the first turn: ${nm(mid)}; after the second turn: **${nm(ans)}**.`],
        "Translate once at the start, then work only with real directions.", "Do not translate the final answer back into the code unless the question asks for it."), true, `${JSON.stringify(perm)}.indexOf(${c})*90+(${t1})+(${t2})`);
  }) });
})();
