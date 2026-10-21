/* Learn pages for Quantitative Aptitude (part 3): P&C, probability, mensuration, geometry, algebra, progressions. */
window.LEARN = window.LEARN || {}; LEARN.quant = LEARN.quant || []; window.BRIEFS = window.BRIEFS || {};
(function () {
  /* ---- tiny SVG helpers (diagrams use currentColor so they follow the light / dark theme) ---- */
  var svg = function (vb, label, body) {
    return '<svg viewBox="0 0 ' + vb + '" role="img" aria-label="' + label + '" style="max-width:420px;width:100%;height:auto;display:block;margin:10px auto" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" font-family="inherit" font-size="13">' + body + "</svg>";
  };
  var T = function (x, y, s, a) { return '<text x="' + x + '" y="' + y + '"' + (a ? ' text-anchor="' + a + '"' : "") + ' fill="currentColor" stroke="none">' + s + "</text>"; };
  var Ln = function (x1, y1, x2, y2, dash) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"' + (dash ? ' stroke-dasharray="4 4" opacity=".65"' : "") + "/>"; };
  var edge = function (x1, y1, x2, y2, r) {
    var dx = x2 - x1, dy = y2 - y1, d = Math.sqrt(dx * dx + dy * dy), ux = dx / d, uy = dy / d;
    return Ln((x1 + ux * r).toFixed(1), (y1 + uy * r).toFixed(1), (x2 - ux * r).toFixed(1), (y2 - uy * r).toFixed(1));
  };
  var node = function (x, y, s) { return '<circle cx="' + x + '" cy="' + y + '" r="12"/>' + T(x, y + 4.5, s, "middle"); };

  var TREE = (function () {
    var b = "";
    b += edge(20, 125, 150, 62, 12) + edge(20, 125, 150, 188, 12);
    b += edge(150, 62, 290, 30, 12) + edge(150, 62, 290, 94, 12) + edge(150, 188, 290, 156, 12) + edge(150, 188, 290, 220, 12);
    b += '<circle cx="20" cy="125" r="3.5" fill="currentColor"/>';
    b += node(150, 62, "R") + node(150, 188, "B") + node(290, 30, "R") + node(290, 94, "B") + node(290, 156, "R") + node(290, 220, "B");
    b += T(74, 86, "5/8", "middle") + T(74, 174, "3/8", "middle");
    b += T(212, 38, "4/7", "middle") + T(212, 96, "3/7", "middle") + T(212, 164, "5/7", "middle") + T(212, 220, "2/7", "middle");
    b += T(312, 35, "RR  5/14") + T(312, 99, "RB  15/56") + T(312, 161, "BR  15/56") + T(312, 225, "BB  3/28");
    return svg("420 250", "Probability tree: two balls drawn without replacement from a bag of 5 red and 3 blue", b);
  })();

  var PATH2D = svg("420 270", "A rectangular field with a path of equal width running around the outside",
    '<rect x="40" y="10" width="340" height="250"/><rect x="70" y="40" width="280" height="190" stroke-dasharray="5 4"/>' +
    T(210, 30, "path 2 m wide", "middle") + T(210, 255, "outer rectangle 44 m × 34 m", "middle") +
    T(210, 130, "field 40 m × 30 m", "middle") + T(210, 150, "path area = outer − inner", "middle"));

  var SECTOR = svg("420 240", "A sector of a circle with a 60 degree angle, and a ring between two concentric circles",
    '<circle cx="110" cy="120" r="90" stroke-dasharray="3 4" opacity=".55"/>' +
    '<path d="M110 120 L200 120 A90 90 0 0 0 155 42.06 Z" stroke-width="2.2"/>' +
    '<path d="M140 120 A30 30 0 0 0 125 94.02"/>' + T(148, 111, "60°") + T(158, 138, "r") +
    T(110, 228, "sector: arc = (θ/360) × 2πr", "middle") +
    '<circle cx="320" cy="120" r="78"/><circle cx="320" cy="120" r="42"/>' + Ln(320, 120, 398, 120) + Ln(320, 120, 362, 120) +
    T(380, 114, "R") + T(341, 114, "r") + T(320, 228, "ring: π(R² − r²)", "middle"));

  var RHOMBUS = svg("420 190", "A rhombus with its two diagonals meeting at right angles",
    '<path d="M90 95 L210 45 L330 95 L210 145 Z" stroke-width="2.2"/>' + Ln(90, 95, 330, 95, true) + Ln(210, 45, 210, 145, true) +
    '<path d="M210 87 L218 87 L218 95"/>' + T(150, 89, "12", "middle") + T(270, 89, "12", "middle") + T(222, 72, "5") + T(222, 130, "5") +
    T(284, 64, "13") + T(210, 180, "d₁ = 24, d₂ = 10:  area = ½ × 24 × 10 = 120", "middle"));

  var SOLIDS = svg("420 225", "A cylinder with radius r and height h, and a cone with radius r, height h and slant height l",
    '<ellipse cx="110" cy="40" rx="60" ry="16"/>' + Ln(50, 40, 50, 170) + Ln(170, 40, 170, 170) +
    '<path d="M50 170 A60 16 0 0 0 170 170"/><path d="M50 170 A60 16 0 0 1 170 170" stroke-dasharray="4 4" opacity=".6"/>' +
    Ln(110, 40, 170, 40, true) + T(140, 34, "r", "middle") + Ln(110, 40, 110, 170, true) + T(100, 108, "h", "middle") +
    T(110, 210, "V = πr²h", "middle") +
    Ln(330, 25, 270, 170) + Ln(330, 25, 390, 170) + '<path d="M270 170 A60 16 0 0 0 390 170"/><path d="M270 170 A60 16 0 0 1 390 170" stroke-dasharray="4 4" opacity=".6"/>' +
    Ln(330, 25, 330, 170, true) + T(320, 100, "h", "middle") + Ln(330, 170, 390, 170, true) + T(360, 186, "r", "middle") + T(378, 92, "l") +
    T(330, 210, "l = √(r² + h²)", "middle"));

  var PARALLEL = svg("420 220", "Two parallel lines AB and CD cut by a transversal, with the two co-interior angles marked",
    Ln(20, 55, 330, 55) + Ln(20, 165, 330, 165) + Ln(110, 15, 200, 205) +
    '<path d="M148.9 55 A20 20 0 0 1 137.5 73"/><path d="M201 165 A20 20 0 0 0 172.4 147"/>' +
    T(190, 80, "(2x+10)°") + T(196, 147, "(3x−20)°") +
    T(8, 50, "A") + T(334, 50, "B") + T(8, 160, "C") + T(334, 160, "D") + T(210, 18, "AB ∥ CD (not to scale)"));

  var SIMILAR = svg("420 215", "Triangle ABC with DE drawn parallel to BC, AD = 4 and DB = 2",
    '<path d="M180 20 L40 190 L340 190 Z" stroke-width="2.2"/>' + Ln(86.7, 133.3, 286.7, 133.3) +
    T(180, 14, "A", "middle") + T(24, 200, "B") + T(344, 200, "C") + T(66, 138, "D") + T(292, 138, "E") +
    T(118, 70, "4") + T(52, 168, "2") + T(190, 128, "DE ∥ BC", "middle"));

  var CHORD = svg("420 220", "A circle of radius 13 with a chord of length 24 and the perpendicular from the centre",
    '<circle cx="140" cy="110" r="91"/><path d="M56 145 L224 145"/>' + Ln(140, 110, 140, 145) + Ln(140, 110, 56, 145, true) +
    '<path d="M140 138 L147 138 L147 145"/>' + '<circle cx="140" cy="110" r="2.5" fill="currentColor"/>' +
    T(130, 104, "O", "end") + T(46, 158, "A", "end") + T(232, 158, "B") + T(140, 162, "M", "middle") +
    T(150, 131, "5") + T(98, 160, "12", "middle") + T(90, 122, "13") +
    T(250, 84, "OM ⊥ AB, so M is the") + T(250, 102, "midpoint of the chord.") + T(250, 128, "5² + 12² = 13²"));

  var NUMLINE = (function () {
    var b = Ln(20, 70, 71, 70) + Ln(333, 70, 400, 70) + Ln(81, 70, 323, 70).replace('<line', '<line stroke-width="4"');
    b += '<circle cx="76" cy="70" r="5"/><circle cx="328" cy="70" r="5"/>';
    for (var v = -3; v <= 7; v++) { var x = 40 + (v + 3) * 36; b += Ln(x, 64, x, 76).replace("<line", '<line opacity=".5"') + T(x, 96, String(v).replace("-", "−"), "middle"); }
    b += T(202, 40, "−2 < x < 5", "middle");
    return svg("420 110", "Number line showing the solution of the modulus inequality, x between minus 2 and 5", b);
  })();

  /* =====================================================================================
     PERMUTATIONS & COMBINATIONS
     ===================================================================================== */
  LEARN.quant.push({
    id: "pnc", group: "Counting & chance", title: "Permutations & combinations",
    sub: "Counting without listing: the multiplication rule, order versus no order, and a few standard tricks",
    tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "eLitmus"],
    blocks: [
      ["h2", "The idea"],
      ["p", "Counting questions ask “in how many ways?”. You never list the ways. You build the answer from a **multiplication**: if a job is done in stages, and stage 1 can be done in 4 ways and stage 2 in 3 ways, the whole job can be done in 4 × 3 = 12 ways."],
      ["list", [
        "**Multiply for “and”, add for “or”:** a shirt AND a trouser multiply their choices. A bus OR a train adds the options (when you pick just one of them).",
        "**Permutation = order matters** (a row, a code, a rank list, a word). **Combination = order does not matter** (a committee, a hand of cards, a handful of sweets).",
        "**Ask the swap test:** if swapping two chosen items gives a different result, it is a permutation; if it gives the same result, it is a combination.",
        "**Restrictions go first:** whenever one position has a condition (first digit not zero, a person who must sit at the end), fill that position first."
      ]],
      ["note", "A combination is a permutation with the repeats cancelled. Choosing 3 from 8 in order gives 8 × 7 × 6 = 336 lines, but each group of 3 appears 3! = 6 times, so there are 336 / 6 = 56 groups."],

      ["h2", "Formulas"],
      ["formulas", [
        ["Factorial", "n! = n × (n − 1) × … × 2 × 1", "0! = 1 and 1! = 1"],
        ["Permutations (order matters)", "nPr = n! / (n − r)!", "Multiply r numbers going down from n: 8P3 = 8 × 7 × 6"],
        ["Combinations (order ignored)", "nCr = n! / (r! (n − r)!)", "nCr = nC(n − r): 10C8 = 10C2 = 45"],
        ["Arrangements with repeats", "n! / (p! q! r!)", "p, q, r are the counts of each repeated item (BANANA: 6!/(3! 2!))"],
        ["Circular arrangements", "(n − 1)!", "A bead necklace or garland that can be flipped: (n − 1)!/2"],
        ["Items that must be together", "Glue them: (units)! × (inside order)!", "Apart = total − together"],
        ["Distribution of identical objects", "n among r people: (n + r − 1)C(r − 1)", "Everyone gets at least 1: (n − 1)C(r − 1)"],
        ["Distinct objects to r people", "rⁿ", "Each of n objects independently picks one of r people"],
        ["Handshakes and diagonals", "Handshakes: nC2; diagonals: nC2 − n = n(n − 3)/2", "Lines from n points: nC2; triangles: nC3"],
        ["Collinear points (k of n)", "Triangles: nC3 − kC3; lines: nC2 − kC2 + 1", "Collinear points cannot form a triangle and share one single line"]
      ]],

      ["h2", "Shortcuts"],
      ["h", "Which tool? Match the keyword"],
      ["table", ["Words in the question", "Use"], [
        ["arrange, rank, code, word, row, seat", "Permutation, order matters"],
        ["select, choose, committee, team, group, hand", "Combination, order ignored"],
        ["together, side by side", "Glue the items into one block, then multiply by the block's inner order"],
        ["never together, apart", "Total − together"],
        ["at least one, at most", "Complement: total − the unwanted cases"],
        ["round table, circular", "Fix one person, arrange the rest: (n − 1)!"]
      ]],
      ["list", [
        "**Slot method:** draw blanks for each position, write the number of choices in each, and multiply. Fill the most restricted blank first.",
        "**Compute nCr without factorials:** write r numbers going down from n on top, r! below, and cancel. 9C3 = (9 × 8 × 7)/(3 × 2 × 1) = 84.",
        "**Use the smaller side:** 12C10 is the same as 12C2 = 66.",
        "**Pascal check:** nC0 = nCn = 1, nC1 = n, and nCr + nC(r+1) = (n+1)C(r+1).",
        "**Even or odd numbers:** fix the last digit first; if 0 is a choice there, treat “last digit 0” and “last digit non-zero” as two separate cases."
      ]],
      ["tip", "A quick sanity check: the answer for “together” can never be bigger than the answer for “no condition”, and the answer for “apart” plus “together” must give the total."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "quant/pnc/counting-principle", title: "Counting principle",
        spot: "A job is done in independent stages (outfits, codes, routes, menus) and the question asks for the total number of ways or combinations.",
        method: ["List the stages and count the choices at each stage.", "Multiply the counts when all stages happen. Add them when you pick only one of several alternatives.", "Apply any restriction at its stage (for example, the first digit cannot be 0, so it has 9 choices, not 10)."],
        ex: { q: "A code has one letter from A–F followed by two digits. The first digit cannot be 0 and digits may repeat. How many codes are possible?", steps: ["Letter: 6 choices", "First digit: 1–9, so 9 choices", "Second digit: 0–9, so 10 choices", "Total = 6 × 9 × 10"], ans: "540" },
        shortcut: "Draw one blank per stage and multiply the number of choices written in each blank."
      }],
      ["pattern", {
        key: "quant/pnc/arrangements-with-restrictions", title: "Arrangements with restrictions (together / apart)",
        spot: "People or objects stand in a row and some of them must be together, must be apart, or must take fixed positions.",
        method: ["Together: tie them into one block, arrange the units, then multiply by the ways the block can be arranged inside.", "Apart: find the total number of arrangements and subtract the “together” count.", "Fixed position: place that person first, then arrange the rest."],
        ex: { q: "In how many ways can 8 people stand in a row if A and B must NOT stand next to each other?", steps: ["Total arrangements = 8! = 40,320", "Together: block of A and B plus 6 others = 7 units, 7! × 2! = 5,040 × 2 = 10,080", "Apart = 40,320 − 10,080"], ans: "30,240" },
        shortcut: "Apart = total − together. Never forget the inner 2! of the glued pair."
      }],
      ["pattern", {
        key: "quant/pnc/words-from-letters-with-repeats", title: "Words from letters with repeats, vowels together",
        spot: "“How many words can be formed from the letters of …”, with some letters repeated, or with all the vowels (or all the consonants) together.",
        method: ["Count the total letters n and the repeats of each letter.", "No restriction: n! divided by the factorial of each repeat count.", "Vowels together: tie the vowels into one block, arrange the other units (dividing by repeats there too), then multiply by the arrangements inside the vowel block (dividing by its own repeats)."],
        ex: { q: "How many different arrangements of the letters of LETTER keep the two E's together?", steps: ["Treat EE as one block. Units: [EE], L, T, T, R = 5 units", "T repeats twice: 5!/2! = 60", "The two E's are identical, so the block has only 1 internal arrangement: 60 × 1"], ans: "60" },
        shortcut: "Identical letters are not swapped: divide by their factorial, in the block as well as outside it."
      }],
      ["pattern", {
        key: "quant/pnc/circular-arrangements-and-necklaces", title: "Circular arrangements & necklaces",
        spot: "People around a round table, beads on a necklace, flowers in a garland.",
        method: ["Fix one person (or bead) to remove the rotations. The other n − 1 can be arranged freely: (n − 1)!.", "If the circle can be turned over (necklace, garland, bracelet), divide by 2: (n − 1)!/2.", "For “two people not adjacent”, subtract the “together” count (glued pair as one unit, so (n − 2)! × 2)."],
        ex: { q: "In how many ways can 7 people sit around a round table so that two particular people are NOT next to each other?", steps: ["All arrangements = (7 − 1)! = 720", "Together: glue the two, 6 units give (6 − 1)! = 120, and the pair swaps: 120 × 2 = 240", "Apart = 720 − 240"], ans: "480" },
        shortcut: "A necklace of 7 different beads has 6!/2 = 360 designs; a round table of 7 people has 6! = 720 seatings."
      }],
      ["pattern", {
        key: "quant/pnc/selection-ncr-at-least-at", title: "Selection nCr, at least / at most",
        spot: "“In how many ways can r items be selected from n?”, often with conditions such as at least one of a type.",
        method: ["Decide whether order matters. For a selection it does not, so use nCr.", "For “at least one”, work with the complement: total selections − selections with none of that type.", "For “at most”, add the allowed cases (0, 1, … items) or subtract the unwanted ones."],
        ex: { q: "In how many ways can 4 books be chosen from 9 (3 are maths books and 6 are others) if at least one must be a maths book?", steps: ["All choices: 9C4 = 126", "No maths book: all 4 from the 6 others, 6C4 = 15", "At least one maths book = 126 − 15"], ans: "111" },
        shortcut: "“At least one” is almost always total − none."
      }],
      ["pattern", {
        key: "quant/pnc/committees-with-conditions", title: "Committees with conditions",
        spot: "A committee, team or panel is formed from two or more groups (men and women, boys and girls) with a fixed split, or with some people always or never included.",
        method: ["Split the selection by group and compute each part with nCr.", "Multiply the parts (the groups are chosen together).", "A person who must be in: take him out of the pool and choose one fewer. A person who must not be in: remove him from the pool."],
        ex: { q: "A committee of 5 is formed from 6 men and 4 women with exactly 2 women, and Ravi (one of the men) must be on it. How many committees are possible?", steps: ["Women: 4C2 = 6", "Men needed = 5 − 2 = 3; Ravi is one, so choose 2 more from the other 5 men: 5C2 = 10", "Total = 6 × 10"], ans: "60" },
        shortcut: "Multiply the group-wise selections; do not choose from the whole crowd and then try to fix the split."
      }],
      ["pattern", {
        key: "quant/pnc/distribution", title: "Distribution (identical / distinct)",
        spot: "Sharing sweets, balls, or books among children or boxes, with or without a minimum for each.",
        method: ["Identical objects: use stars and bars. Everyone gets at least 1: (n − 1)C(r − 1). Zero allowed: (n + r − 1)C(r − 1).", "Distinct objects: each object chooses its receiver, so r × r × … = rⁿ.", "If a minimum other than 1 is required, hand the minimum out first and distribute the rest freely."],
        ex: { q: "In how many ways can 8 identical chocolates be given to 3 children so that every child gets at least one? How many ways if a child may get none?", steps: ["Each at least one: (8 − 1)C(3 − 1) = 7C2 = 21", "Zero allowed: (8 + 3 − 1)C(3 − 1) = 10C2 = 45"], ans: "21 ways, and 45 if zero is allowed" },
        shortcut: "Identical objects are bars and stars: n stars with r − 1 dividers. Distinct objects are simply rⁿ."
      }],
      ["pattern", {
        key: "quant/pnc/handshakes-diagonals-lines-and-triangles", title: "Handshakes, diagonals, lines & triangles from points",
        spot: "Every pair shakes hands once, diagonals of a polygon, lines or triangles formed from points on a plane, possibly with some points on one line.",
        method: ["Pairs of objects: nC2. Triples: nC3.", "Diagonals of an n-sided polygon: nC2 − n (all pairs minus the sides).", "If k points are collinear: triangles = nC3 − kC3; lines = nC2 − kC2 + 1 (the k points give only one line)."],
        ex: { q: "10 points lie on a plane and exactly 4 of them are on one straight line (no other three are collinear). How many triangles and how many lines can be drawn?", steps: ["Triangles: 10C3 − 4C3 = 120 − 4 = 116", "Lines: 10C2 − 4C2 + 1 = 45 − 6 + 1 = 40"], ans: "116 triangles and 40 lines" },
        shortcut: "12 people shaking hands once each: 12C2 = 66. A 12-sided polygon: 66 − 12 = 54 diagonals."
      }],
      ["pattern", {
        key: "quant/pnc/forming-numbers-from-digits", title: "Forming numbers from digits",
        spot: "How many 3-digit or 4-digit numbers can be formed from given digits, with or without repetition, with a condition such as even, odd or greater than some number.",
        method: ["Draw one blank for each digit place.", "Fill the most restricted place first: the last digit for even or odd, the first digit for “not zero”.", "If 0 is among the digits and can sit in the restricted place, split into cases and add."],
        ex: { q: "How many 3-digit even numbers can be formed from the digits 0, 1, 2, 3, 4, 5 if no digit is repeated?", steps: ["Last digit 0: the other two places 5 × 4 = 20", "Last digit 2 or 4 (2 ways): hundreds place cannot be 0 or the last digit, so 4 choices; tens place 4 choices: 2 × 4 × 4 = 32", "Total = 20 + 32"], ans: "52" },
        shortcut: "Split on the last digit: “0” versus “non-zero even”. The hundreds place loses 0 and the chosen digit."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Order mix-up:** a committee of 3 is 8C3, not 8P3. A 3-letter code is 8P3, not 8C3.",
        "**Forgetting the inner arrangement:** when two people are glued together they can still swap, so multiply by 2!.",
        "**Circle versus row:** around a table the answer is (n − 1)!, not n!.",
        "**Repeated letters:** BANANA is 6!/(3! 2!) = 60, not 6! = 720. Divide for every repeated letter.",
        "**Leading zero:** a 4-digit number cannot start with 0, so the first place has one choice fewer.",
        "**Adding instead of multiplying:** independent stages multiply. 4 shirts and 3 trousers are 12 outfits, not 7.",
        "**Half-done complement:** “at least 2” means total minus the cases with 0 and with 1. Remove both.",
        "**Treating identical objects as distinct:** 8 identical sweets among 3 children is stars and bars (21), not 3⁸."
      ]],
      ["warn", "Before calculating, say it aloud: “Does order matter? Are the objects distinct? Is there a restriction to fill first?” Those three answers pick the formula."],

      ["h2", "Quick check"],
      ["quiz", ["pnc-01", "pnc-03", "pnc-05", "pnc-07", "pnc-10"]]
    ]
  });
  BRIEFS["quant:pnc"] = "Counting questions are built from one idea: stages multiply. A permutation is an arrangement where order matters (rows, codes, words); a combination is a selection where it does not (committees, hands). Glue items that must be together, subtract the “together” count for “apart”, and use total minus unwanted cases for “at least”.\n\nBefore touching a formula ask three things: does order matter, are the objects distinct, and which position has a restriction (fill that one first). Divide by factorials for repeated letters, use (n − 1)! around a circle, and use stars and bars for identical objects.";

  /* =====================================================================================
     PROBABILITY
     ===================================================================================== */
  LEARN.quant.push({
    id: "probability", group: "Counting & chance", title: "Probability",
    sub: "Favourable over total, plus the complement, independence and without-replacement tricks",
    tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "eLitmus"],
    blocks: [
      ["h2", "The idea"],
      ["p", "**Probability** is a fraction: how many outcomes you want, out of all the equally likely outcomes. P(event) = favourable ÷ total. It is always between 0 (impossible) and 1 (certain)."],
      ["list", [
        "**Count carefully:** the total and the favourable outcomes must be counted the same way. If you use combinations (order ignored) for one, use them for the other.",
        "**Complement:** P(not E) = 1 − P(E). When a question says “at least one”, find the chance of “none” and subtract from 1.",
        "**“And” multiplies, “or” adds:** P(A and B) = P(A) × P(B) when the events are independent. P(A or B) = P(A) + P(B) − P(A and B).",
        "**With and without replacement:** with replacement the chances stay the same on every draw. Without replacement the bag shrinks, so the next fraction changes."
      ]],
      ["h", "A tree makes “without replacement” easy"],
      ["p", "A bag holds 5 red and 3 blue balls. Two are drawn one after the other without replacement. Multiply along each branch and add the branches you want."],
      ["html", TREE],
      ["note", "The four ends add up to 1: 5/14 + 15/56 + 15/56 + 3/28 = 1. If your branches do not add to 1 you have missed an outcome."],

      ["h2", "Formulas"],
      ["formulas", [
        ["Basic probability", "P(E) = favourable / total", "Total must be equally likely outcomes"],
        ["Complement", "P(not E) = 1 − P(E)", "Best for “at least one”"],
        ["Addition rule", "P(A or B) = P(A) + P(B) − P(A and B)", "Mutually exclusive: the last term is 0"],
        ["Independent events", "P(A and B) = P(A) × P(B)", "Coin tosses, dice, draws with replacement"],
        ["Conditional probability", "P(A | B) = P(A and B) / P(B)", "“Given that B has happened”: shrink the total to B"],
        ["n coins", "Total = 2ⁿ; k heads: nCk / 2ⁿ", "3 coins, exactly 2 heads: 3/8"],
        ["Two dice", "Total = 36 outcomes", "Doubles: 6/36; sum 7: 6/36"],
        ["Cards", "52 cards, 4 suits of 13", "12 face cards, 4 aces, 26 red, 26 black"],
        ["Odds", "In favour = favourable : unfavourable", "Odds m : n in favour means P = m/(m + n)"],
        ["Without replacement", "Multiply the fractions as the bag shrinks", "Or use nCr for favourable / nCr for total"]
      ]],

      ["h2", "Shortcuts"],
      ["h", "Two dice: how many ways make each sum"],
      ["table", ["Sum", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], [
        ["Ways", "1", "2", "3", "4", "5", "6", "5", "4", "3", "2", "1"]
      ]],
      ["list", [
        "**Use combinations for draws without replacement:** two kings from 52 cards is 4C2 / 52C2 = 6/1326. The same answer as 4/52 × 3/51.",
        "**Symmetry:** the sum 7 is the most likely (6 ways). Sums 6 and 8 have 5 ways each, and so on, rising and falling.",
        "**At least one:** 1 − (chance of none). Three dice and at least one six: 1 − (5/6)³ = 91/216.",
        "**“Exactly one of A, B occurs”:** P(A) × P(not B) + P(not A) × P(B), or P(A) + P(B) − 2 × P(A and B).",
        "**Reduce fractions at the end,** after writing everything as favourable/total. It is easier to spot cancellations."
      ]],
      ["tip", "When the numbers in a draw problem look messy, ask “is this one or two events?”. A pair of cards drawn together is the same as two drawn one after another without replacement."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "quant/probability/coins", title: "Coins",
        spot: "Tossing one or several coins, asking for exactly k heads, at least one head, or a particular sequence.",
        method: ["Total outcomes = 2ⁿ for n coins.", "Exactly k heads = nCk (choose which coins show heads).", "Divide favourable by total, or use the complement for “at least one”."],
        ex: { q: "Four fair coins are tossed together. What is the probability of getting exactly two heads?", steps: ["Total outcomes = 2⁴ = 16", "Favourable = choose which 2 of the 4 coins are heads = 4C2 = 6", "Probability = 6/16"], ans: "3/8" },
        shortcut: "Memorise the patterns for 3 coins: 1, 3, 3, 1 out of 8, and for 4 coins: 1, 4, 6, 4, 1 out of 16."
      }],
      ["pattern", {
        key: "quant/probability/dice", title: "Dice (sums, doubles)",
        spot: "One or more dice, with a sum, a product, doubles, or “a number greater than …”.",
        method: ["Two dice have 36 equally likely outcomes (a, b). One die has 6.", "List the favourable pairs systematically, or use the sum table.", "Probability = favourable / 36 (or / 6)."],
        ex: { q: "Two dice are rolled. What is the probability that the sum is a prime number?", steps: ["Prime sums possible: 2, 3, 5, 7, 11", "Ways: 1 + 2 + 4 + 6 + 2 = 15", "Probability = 15/36"], ans: "5/12" },
        shortcut: "Use the 1-2-3-4-5-6-5-4-3-2-1 ladder for sums 2 to 12 instead of writing every pair."
      }],
      ["pattern", {
        key: "quant/probability/cards", title: "Cards",
        spot: "Cards drawn from a standard pack, with colour, suit, face cards, kings or aces, singly or in pairs.",
        method: ["Recall the pack: 52 cards, 4 suits of 13, 12 face cards, 26 red, 26 black.", "Total = 52Cn for n cards drawn together.", "Favourable = product of the nCr choices for each requirement."],
        ex: { q: "Two cards are drawn together from a well-shuffled pack of 52. What is the probability that both are kings?", steps: ["Total = 52C2 = 1,326", "Favourable = 4C2 = 6", "Probability = 6/1,326 = 1/221"], ans: "1/221" },
        shortcut: "The same result comes one card at a time: 4/52 × 3/51 = 1/221."
      }],
      ["pattern", {
        key: "quant/probability/balls-from-bags-with-without", title: "Balls from bags, with / without replacement",
        spot: "A bag with coloured balls, one or more draws, with the ball put back or not.",
        method: ["With replacement: the fractions are the same on every draw, so multiply them.", "Without replacement: reduce the total (and the colour drawn) after each draw, or use nCr over nCr.", "For “different colours” add the cases (RB and BR)."],
        ex: { q: "A bag has 4 red and 6 blue balls. Two balls are drawn one after another without replacement. What is the probability that they are of different colours?", steps: ["Red then blue: 4/10 × 6/9 = 24/90", "Blue then red: 6/10 × 4/9 = 24/90", "Add: 48/90 = 8/15"], ans: "8/15" },
        shortcut: "Or with combinations: (4C1 × 6C1) / 10C2 = 24/45 = 8/15. Same answer, fewer steps."
      }],
      ["pattern", {
        key: "quant/probability/at-least-one", title: "At least one (complement)",
        spot: "“At least one head / six / defective item”, “not all the same”, “at least one of them succeeds”.",
        method: ["Find P(none): the chance that the thing you want never happens.", "Subtract from 1.", "For independent trials, P(none) is the product of the single “not” probabilities."],
        ex: { q: "Three fair dice are thrown. What is the probability of getting at least one six?", steps: ["P(no six on one die) = 5/6", "P(no six on all three) = (5/6)³ = 125/216", "At least one six = 1 − 125/216"], ans: "91/216" },
        shortcut: "“At least one” = 1 − “none”. It turns a long list of cases into one multiplication."
      }],
      ["pattern", {
        key: "quant/probability/independent-and-conditional-basics", title: "Independent & conditional basics",
        spot: "Probabilities of two events are given and the question asks for “both”, “either”, “exactly one” or “given that”.",
        method: ["Independent events: multiply for “and”.", "Either: P(A) + P(B) − P(A and B).", "Conditional: P(A | B) = P(A and B)/P(B), meaning the total shrinks to the cases where B is true."],
        ex: { q: "A and B are independent events with P(A) = 0.6 and P(B) = 0.5. Find P(A or B) and P(exactly one of them occurs).", steps: ["P(A and B) = 0.6 × 0.5 = 0.3", "P(A or B) = 0.6 + 0.5 − 0.3 = 0.8", "Exactly one = 0.6 × 0.5 + 0.4 × 0.5 = 0.3 + 0.2 = 0.5"], ans: "P(A or B) = 0.8 and P(exactly one) = 0.5" },
        shortcut: "P(A or B) = 1 − P(neither) = 1 − 0.4 × 0.5 = 0.8 for independent events."
      }],
      ["pattern", {
        key: "quant/probability/odds", title: "Odds",
        spot: "“Odds in favour”, “odds against”, “the odds against a team winning are 7 : 3”.",
        method: ["Odds in favour m : n means m favourable to n unfavourable, so P = m/(m + n).", "Odds against m : n means P(win) = n/(m + n).", "To go the other way, odds in favour = P : (1 − P)."],
        ex: { q: "The odds against a team winning a match are 7 : 3. What is the probability that the team wins?", steps: ["Odds against 7 : 3 means 7 unfavourable, 3 favourable", "Total = 7 + 3 = 10", "P(win) = 3/10"], ans: "3/10" },
        shortcut: "Add the two odds numbers to get the total. The favourable number goes on top."
      }],
      ["pattern", {
        key: "quant/probability/arrangement-based-probability", title: "Arrangement-based probability",
        spot: "Letters or people are arranged at random and the question asks for the chance that some condition holds (vowels together, two people adjacent).",
        method: ["Total = number of all arrangements (use the P&C rules, dividing for repeats).", "Favourable = number of arrangements that meet the condition (glue the items that must be together).", "Probability = favourable / total."],
        ex: { q: "The letters of the word SMILE are arranged at random. What is the probability that the two vowels are together?", steps: ["Total arrangements = 5! = 120", "Glue I and E: 4 units, 4! × 2! = 48", "Probability = 48/120"], ans: "2/5" },
        shortcut: "Two named people adjacent in a row of n: 2 × (n − 1)! / n! = 2/n. For n = 5 that is 2/5, as above."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Mixing orders:** if the total uses combinations (order ignored), the favourable count must use combinations too.",
        "**Replacement:** without replacement the second fraction has a smaller total (and a smaller count of the colour just drawn).",
        "**Forgetting the second case:** “different colours” is RB and BR. Add both.",
        "**“At least one”:** do not add the cases. Subtract the “none” case from 1.",
        "**Dice as unordered:** (2, 5) and (5, 2) are different outcomes, so the total is 36, not 21.",
        "**Adding independent events for “and”:** both coins heads is 1/2 × 1/2, not 1/2 + 1/2.",
        "**Odds versus probability:** odds 3 : 5 means probability 3/8, not 3/5.",
        "**Conditional wording:** “given that” shrinks the total. P(king | face card) = 4/12, not 4/52."
      ]],
      ["warn", "Probability can never be more than 1 or less than 0. If your fraction is bigger than 1, a favourable count is wrong."],

      ["h2", "Quick check"],
      ["quiz", ["probability-01", "probability-02", "probability-04", "probability-06", "probability-08"]]
    ]
  });
  BRIEFS["quant:probability"] = "Probability is favourable outcomes divided by total outcomes, as long as both are counted the same way (use combinations for both if order does not matter). Independent events multiply, and “at least one” is easiest as 1 minus the chance of none.\n\nWhen items are drawn without replacement, the bag shrinks after each draw, so the next fraction changes. A small tree or nCr over nCr keeps this tidy. Remember the 36 outcomes for two dice, the 52-card pack facts, and that odds m : n mean probability m/(m + n).";

  /* =====================================================================================
     MENSURATION 2D
     ===================================================================================== */
  LEARN.quant.push({
    id: "mensuration-2d", group: "Geometry & mensuration", title: "Mensuration 2D",
    sub: "Perimeters and areas of the shapes that placement tests keep returning to",
    tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "CoCubes"],
    blocks: [
      ["h2", "The idea"],
      ["p", "**Perimeter** is the length of the boundary (a fence, a border, a wire). **Area** is the surface inside (paint, tiles, carpet, grass). Perimeter is measured in m, cm; area in m², cm². When units are mixed, convert first."],
      ["list", [
        "**Area scales with the square:** double every side and the area becomes 4 times. Percent changes in lengths therefore need care.",
        "**π = 22/7** is used when the radius or diameter is a multiple of 7. Use 3.14 only when the question says so.",
        "**Most questions reduce to a right triangle:** the diagonal of a rectangle, the half-diagonal of a rhombus, the height of an isosceles triangle. Know the Pythagoras triples (3-4-5, 5-12-13, 8-15-17, 7-24-25).",
        "**Area of an odd shape = sum or difference of simple ones:** a path is the outer shape minus the inner shape; a ring is a big circle minus a small one."
      ]],
      ["h", "A path around a field"],
      ["html", PATH2D],
      ["note", "Subtract areas, not lengths. Outer rectangle area minus inner rectangle area is the path, even though the path is only 2 m wide."],

      ["h2", "Formulas"],
      ["formulas", [
        ["Rectangle", "Area = l × b;  Perimeter = 2(l + b)", "Diagonal = √(l² + b²)"],
        ["Square", "Area = a²;  Perimeter = 4a", "Diagonal = a√2;  Area = d²/2"],
        ["Triangle", "Area = ½ × base × height", "Right triangle: ½ × the two shorter sides"],
        ["Heron's formula", "Area = √(s(s − a)(s − b)(s − c)),  s = (a + b + c)/2", "Use when only the three sides are given"],
        ["Equilateral triangle", "Area = (√3/4) a²;  height = (√3/2) a", "√3 ≈ 1.732"],
        ["Circle", "Area = πr²;  Circumference = 2πr", "Diameter = 2r"],
        ["Sector", "Arc = (θ/360) × 2πr;  Area = (θ/360) × πr²", "Area = ½ × arc × r"],
        ["Ring (annulus)", "Area = π(R² − r²) = π(R − r)(R + r)", "R is the outer radius, r the inner one"],
        ["Path outside / inside a rectangle", "Outside: 2w(l + b + 2w);  Inside: 2w(l + b − 2w)", "Crossing roads: w(l + b − w)"],
        ["Parallelogram and rhombus", "Parallelogram = base × height;  Rhombus = ½ d₁d₂", "Rhombus side = √((d₁/2)² + (d₂/2)²)"],
        ["Trapezium", "Area = ½ × (sum of parallel sides) × height", "Height is the distance between the parallel sides"],
        ["Change in area (a% and b% changes)", "a + b + ab/100", "Radius or side up x%: area up 2x + x²/100 %"]
      ]],

      ["h2", "Shortcuts"],
      ["html", SECTOR],
      ["list", [
        "**Use the Pythagoras triples:** a rectangle with diagonal 13 and side 12 has the other side 5, no square roots needed.",
        "**π = 22/7 and multiples of 7:** if r = 21, r² = 441 = 21 × 21, and 22/7 × 441 = 1,386.",
        "**Equilateral triangle area:** 0.433 × a² is a good approximation. For a = 10 that is about 43.3.",
        "**Path formulas save two multiplications:** outside path = 2w(l + b + 2w) and inside path = 2w(l + b − 2w).",
        "**Sector = fraction of a circle:** a 60° sector is 1/6 of the circle, 90° is 1/4, 120° is 1/3. Work with the fraction rather than the degrees."
      ]],
      ["tip", "A percent change in a side is the same as a factor: +20% is × 1.2, −10% is × 0.9. The area changes by the product of the factors, so 1.2 × 0.9 = 1.08, a rise of 8%."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "quant/mensuration-2d/rectangles-and-squares", title: "Rectangles & squares",
        spot: "A rectangle or square with area, perimeter or diagonal given, and a missing side, area or cost of fencing is asked.",
        method: ["Write down which of l, b, area, perimeter, diagonal are known.", "A diagonal creates a right triangle with the sides: d² = l² + b².", "Compute the missing side first, then area or perimeter."],
        ex: { q: "A rectangle has a diagonal of 13 m and a length of 12 m. Find its area and perimeter.", steps: ["Breadth = √(13² − 12²) = √25 = 5 m", "Area = 12 × 5 = 60 m²", "Perimeter = 2 × (12 + 5) = 34 m"], ans: "Area 60 m² and perimeter 34 m" },
        shortcut: "Spot the 5-12-13 triple. A square of side a has diagonal a√2."
      }],
      ["pattern", {
        key: "quant/mensuration-2d/triangles", title: "Triangles (Heron, equilateral)",
        spot: "A triangle with three sides given (scalene), a triangle with an equal side, or the height on a base is wanted.",
        method: ["Three sides given: s = (a + b + c)/2 and Heron's formula.", "Equilateral: area = (√3/4) a².", "To get a height on a side: height = 2 × area ÷ that side."],
        ex: { q: "A triangle has sides 13 cm, 14 cm and 15 cm. Find its area and the height on the 14 cm side.", steps: ["s = (13 + 14 + 15)/2 = 21", "Area = √(21 × 8 × 7 × 6) = √7,056 = 84 cm²", "Height on 14 cm = 2 × 84 / 14 = 12 cm"], ans: "Area 84 cm² and height 12 cm" },
        shortcut: "13-14-15 is the famous triangle: area 84. Also 5-12-13 (area 30) and 3-4-5 (area 6)."
      }],
      ["pattern", {
        key: "quant/mensuration-2d/circles-sectors-rings", title: "Circles, sectors, rings",
        spot: "Circle area or circumference, a sector or an arc defined by an angle, or a ring between two concentric circles.",
        method: ["Write the radius (halve a diameter).", "Sector: take θ/360 of the circle for arc length (2πr) or area (πr²).", "Ring: π(R² − r²). Compute (R − r)(R + r) first."],
        ex: { q: "A sector of angle 60° is cut from a circle of radius 21 cm. Find the arc length and the area of the sector. (π = 22/7)", steps: ["Fraction of circle = 60/360 = 1/6", "Arc = 1/6 × 2 × 22/7 × 21 = 1/6 × 132 = 22 cm", "Area = 1/6 × 22/7 × 441 = 1/6 × 1,386 = 231 cm²"], ans: "Arc 22 cm and area 231 cm²" },
        shortcut: "For a ring with R = 14 and r = 7: π × (14 − 7)(14 + 7) = 22/7 × 7 × 21 = 462 cm²."
      }],
      ["pattern", {
        key: "quant/mensuration-2d/paths-around-inside-a-field", title: "Paths around / inside a field",
        spot: "A path or border of uniform width runs around the outside or the inside of a rectangle, or two roads cross in the middle. A cost per unit area follows.",
        method: ["Outside path: outer sides = l + 2w and b + 2w. Inside path: inner sides = l − 2w and b − 2w.", "Path area = bigger rectangle − smaller rectangle.", "Multiply by the rate per square metre. For crossing roads add the two strips and subtract the shared square: w(l + b − w)."],
        ex: { q: "A path 2 m wide runs around the outside of a 40 m × 30 m field. What does it cost to gravel it at ₹12 per m²?", steps: ["Outer rectangle = (40 + 4) × (30 + 4) = 44 × 34 = 1,496 m²", "Path area = 1,496 − 1,200 = 296 m²", "Cost = 296 × 12"], ans: "₹3,552" },
        shortcut: "Outside: 2w(l + b + 2w) = 4 × 74 = 296. Inside the same field: 4 × 66 = 264. Crossing roads 3 m wide: 3 × (70 − 3) = 201."
      }],
      ["pattern", {
        key: "quant/mensuration-2d/pct-change-in-area", title: "% change in area",
        spot: "Length and breadth (or the radius or the side) are changed by given percents and the change in area is asked.",
        method: ["Write each change as a factor: +20% is 1.2, −10% is 0.9.", "Multiply the factors for a rectangle. For a square or circle, square the factor.", "Subtract 1 and convert back to a percent."],
        ex: { q: "The length of a rectangle is increased by 20% and its breadth is decreased by 10%. What is the change in area?", steps: ["Factors: 1.2 and 0.9", "New area / old area = 1.2 × 0.9 = 1.08", "Area increases by 8%"], ans: "+8% (an increase of 8%)" },
        shortcut: "a + b + ab/100 = 20 − 10 − 2 = 8. For a circle, a 10% rise in radius gives 1.1² = 1.21, so +21% in area."
      }],
      ["pattern", {
        key: "quant/mensuration-2d/trapezium-rhombus-parallelogram", title: "Trapezium, rhombus, parallelogram",
        spot: "A four-sided figure with parallel sides, with diagonals, a side, or the distance between parallel sides given.",
        method: ["Rhombus: the diagonals bisect each other at right angles, so each side is √((d₁/2)² + (d₂/2)²).", "Rhombus area = ½ d₁ d₂. Parallelogram area = base × height.", "Trapezium: ½ × (sum of the parallel sides) × the distance between them."],
        ex: { q: "A rhombus has diagonals of 24 cm and 10 cm. Find its side, perimeter and area.", steps: ["Half diagonals 12 and 5, so side = √(144 + 25) = 13 cm", "Perimeter = 4 × 13 = 52 cm", "Area = ½ × 24 × 10 = 120 cm²"], ans: "Side 13 cm, perimeter 52 cm, area 120 cm²" },
        shortcut: "A trapezium with parallel sides 10 and 14 and height 8 has area (10 + 14)/2 × 8 = 96. A rhombus with diagonals 16 and 12 has side 10."
      }],
      ["html", RHOMBUS],

      ["h2", "Common traps"],
      ["list", [
        "**Perimeter versus area:** a fence is perimeter; paint, tiles and grass are area. Check which one the cost refers to.",
        "**Diameter as radius:** if the circle's diameter is 14, then r = 7. Halve it before squaring.",
        "**Mixed units:** convert 40 cm to 0.4 m before computing the area in m².",
        "**Path width counted once:** a path around the outside adds the width on both sides, so each side grows by 2w.",
        "**Adding percents for area:** +20% length and −10% breadth is +8% area, not +10%.",
        "**Rhombus side:** the diagonals are not the sides. The side is the hypotenuse of the half-diagonals.",
        "**Sector formula:** use θ/360 as a fraction of the circle. Do not multiply by the angle in degrees directly.",
        "**Height of a parallelogram:** it is the perpendicular distance to the base, not the slanted side."
      ]],
      ["warn", "Draw a quick sketch and label every known length. In most 2D mensuration problems, the answer comes from spotting one right triangle."],

      ["h2", "Quick check"],
      ["quiz", ["mensuration-2d-01", "mensuration-2d-03", "mensuration-2d-05", "mensuration-2d-08", "mensuration-2d-09"]]
    ]
  });
  BRIEFS["quant:mensuration-2d"] = "Perimeter measures the boundary and area measures the surface inside. Most questions reduce to a right triangle (a rectangle's diagonal, a rhombus's half-diagonals) or to a difference of two simple shapes (a path is the outer rectangle minus the inner one, a ring is a big circle minus a small one).\n\nUse π = 22/7 when the radius is a multiple of 7, convert units first, and remember that area scales with the square: percent changes in length and breadth combine as a + b + ab/100.";

  /* =====================================================================================
     MENSURATION 3D
     ===================================================================================== */
  LEARN.quant.push({
    id: "mensuration-3d", group: "Geometry & mensuration", title: "Mensuration 3D",
    sub: "Volume and surface area of boxes, cylinders, cones and spheres, and the melting / pouring stories",
    tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "CoCubes"],
    blocks: [
      ["h2", "The idea"],
      ["p", "A solid has **volume** (how much it holds or how much material it is made of) and **surface area** (how much paint or cloth covers it). Volume is in cubic units (m³, cm³); surface area is in square units."],
      ["list", [
        "**Curved surface area (CSA / LSA)** is the side only. **Total surface area (TSA)** adds the flat ends (top and bottom).",
        "**Volume is conserved:** when a solid is melted and recast, or dropped into water, the volume stays the same. Almost every “story” question is one equation: volume before = volume after.",
        "**Conversions:** 1 m³ = 1,000 litres and 1 cm³ = 1 millilitre. 1 m = 100 cm, so 1 m³ = 10,00,000 cm³.",
        "**Cone and cylinder share a base and height:** a cone is exactly one-third of the cylinder with the same radius and height."
      ]],
      ["html", SOLIDS],
      ["note", "The slant height l is not the height h. It is the hypotenuse of the right triangle made by the height and the radius: l² = r² + h²."],

      ["h2", "Formulas"],
      ["formulas", [
        ["Cuboid", "V = lbh;  TSA = 2(lb + bh + hl);  LSA = 2h(l + b)", "Diagonal = √(l² + b² + h²)"],
        ["Cube", "V = a³;  TSA = 6a²;  LSA = 4a²", "Diagonal = a√3"],
        ["Cylinder", "V = πr²h;  CSA = 2πrh;  TSA = 2πr(r + h)", "Open at one end: CSA + πr²"],
        ["Cone", "V = ⅓πr²h;  CSA = πrl;  TSA = πr(r + l)", "l = √(r² + h²)"],
        ["Sphere", "V = (4/3)πr³;  Surface = 4πr²", "Everything is in terms of r"],
        ["Hemisphere", "V = (2/3)πr³;  CSA = 2πr²;  TSA = 3πr²", "TSA includes the flat circle πr²"],
        ["Frustum of a cone", "V = (πh/3)(R² + Rr + r²);  CSA = π(R + r)l", "l = √(h² + (R − r)²)"],
        ["Melting and recasting", "Volume before = volume after", "Number of pieces = big volume ÷ one small volume"],
        ["Water displaced", "Volume of solid = base area × rise in level", "Base area of the vessel, not of the solid"],
        ["Painting and tiling", "Cost = area × rate;  tiles = floor area ÷ one tile", "Subtract doors and windows from the walls"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Cancel π early:** in a melting problem, π appears on both sides, so drop it and compare 4/3 r³ with 1/3 r²h and so on.",
        "**Cone and cylinder:** same r and h means the cone is 1/3 of the cylinder.",
        "**Sphere versus hemisphere:** hemisphere volume is exactly half of the sphere; but its TSA is 3πr², not half of 4πr².",
        "**Use π = 22/7 with 7, 14, 21:** cylinder with r = 7, h = 10 has volume 22/7 × 49 × 10 = 1,540 with no decimals.",
        "**Pythagoras triples for l:** r = 7, h = 24 gives l = 25. r = 6, h = 8 gives l = 10 (the frustum with R − r = 6 and h = 8 also has l = 10).",
        "**Scaling:** if every length is multiplied by k, the surface area is multiplied by k², and the volume by k³."
      ]],
      ["tip", "In a “how many small pieces can be made” question, write the ratio as one fraction and cancel everything common before multiplying anything."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "quant/mensuration-3d/cube-and-cuboid", title: "Cube & cuboid",
        spot: "A box with length, breadth and height, asking for volume, surface area, the longest rod that fits, or the edge of a cube.",
        method: ["Write l, b, h (or the single edge a).", "Volume = lbh. TSA = 2(lb + bh + hl).", "The longest rod inside a cuboid is its space diagonal √(l² + b² + h²)."],
        ex: { q: "A cuboid is 12 cm long, 9 cm wide and 8 cm high. Find its volume, total surface area and the longest rod that fits inside.", steps: ["Volume = 12 × 9 × 8 = 864 cm³", "TSA = 2(12 × 9 + 9 × 8 + 8 × 12) = 2(108 + 72 + 96) = 552 cm²", "Diagonal = √(144 + 81 + 64) = √289 = 17 cm"], ans: "864 cm³, 552 cm² and 17 cm" },
        shortcut: "Cube of edge a: V = a³, TSA = 6a², diagonal = a√3. If the TSA is 150, then a² = 25 and a = 5."
      }],
      ["pattern", {
        key: "quant/mensuration-3d/cylinder", title: "Cylinder",
        spot: "A round tank, pipe, drum or roller, with radius and height given or asked, and curved or total area or capacity needed.",
        method: ["Write r and h (halve a diameter).", "Volume = πr²h; curved surface = 2πrh; total = 2πr(r + h).", "Rollers: area covered in one turn = CSA; area covered in n turns = n × CSA."],
        ex: { q: "A closed cylinder has radius 7 cm and height 10 cm. Find its volume and total surface area. (π = 22/7)", steps: ["Volume = 22/7 × 7 × 7 × 10 = 1,540 cm³", "CSA = 2 × 22/7 × 7 × 10 = 440 cm²", "Two ends = 2 × 22/7 × 49 = 308 cm², TSA = 440 + 308 = 748 cm²"], ans: "Volume 1,540 cm³ and TSA 748 cm²" },
        shortcut: "TSA = 2πr(r + h) = 44 × 17 = 748. Use the factored form so you multiply only once."
      }],
      ["pattern", {
        key: "quant/mensuration-3d/cone", title: "Cone (and frustum basics)",
        spot: "A conical tent, heap, funnel or cap with radius and height (or slant height), and CSA, volume or the canvas needed.",
        method: ["Find the slant height first: l = √(r² + h²).", "CSA = πrl, TSA = πr(r + l), V = ⅓πr²h.", "A frustum is a cone with a small cone cut off the top. Use its own formulas, with l = √(h² + (R − r)²)."],
        ex: { q: "A cone has radius 7 cm and height 24 cm. Find its slant height, curved surface area and volume. (π = 22/7)", steps: ["l = √(7² + 24²) = √625 = 25 cm", "CSA = 22/7 × 7 × 25 = 550 cm²", "Volume = ⅓ × 22/7 × 49 × 24 = 1,232 cm³"], ans: "l = 25 cm, CSA = 550 cm², V = 1,232 cm³" },
        shortcut: "7-24-25 and 6-8-10 are triples you will meet often. A cone of the same r and h as a cylinder holds exactly 1/3 as much."
      }],
      ["pattern", {
        key: "quant/mensuration-3d/sphere-and-hemisphere", title: "Sphere & hemisphere",
        spot: "A ball, a bowl, a dome or a solid hemisphere, with the radius known, asking for area or volume.",
        method: ["Sphere: V = (4/3)πr³, surface = 4πr².", "Hemisphere: V = (2/3)πr³, curved = 2πr², total = 3πr² (it includes the flat top).", "Compute r² and r³ with the 7-multiple in mind for π = 22/7."],
        ex: { q: "A solid hemisphere has radius 21 cm. Find its total surface area and its volume. (π = 22/7)", steps: ["TSA = 3πr² = 3 × 22/7 × 441 = 3 × 1,386 = 4,158 cm²", "Volume = (2/3) × 22/7 × 9,261 = (2/3) × 29,106 = 19,404 cm³"], ans: "TSA 4,158 cm² and volume 19,404 cm³" },
        shortcut: "Hemisphere TSA is 3πr² and not 2πr². The sphere of the same radius has volume 38,808 and surface 5,544."
      }],
      ["pattern", {
        key: "quant/mensuration-3d/melting-and-recasting", title: "Melting & recasting",
        spot: "A solid is melted and reshaped into other solids (balls into a wire, a sphere into cones, a cube into small cubes).",
        method: ["Write the volume of the original and the volume of one new piece.", "Number of pieces = big volume ÷ small volume (assuming no loss).", "Cancel π and common factors first, then divide."],
        ex: { q: "A solid metal sphere of radius 6 cm is melted and recast into small cones of radius 3 cm and height 4 cm. How many cones are made?", steps: ["Sphere = (4/3)π × 216 = 288π", "One cone = ⅓π × 9 × 4 = 12π", "Number = 288π / 12π"], ans: "24 cones" },
        shortcut: "Wire from a sphere: the wire is a very long cylinder, so length = sphere volume / (πr² of the wire)."
      }],
      ["pattern", {
        key: "quant/mensuration-3d/water-level-rise", title: "Water level rise",
        spot: "A solid is dropped into a tank, or water is poured from one container to another, and the rise in water level or the new height is asked.",
        method: ["Volume of water displaced = volume of the submerged solid.", "Rise in level = displaced volume ÷ base area of the vessel.", "For pouring, equate the volumes of the two containers."],
        ex: { q: "A cylindrical vessel has radius 10 cm. A solid sphere of radius 5 cm is dropped in and goes completely under water. By how much does the water level rise?", steps: ["Volume of sphere = (4/3)π × 125 = 500π/3", "Base area of vessel = π × 100 = 100π", "Rise = (500π/3) / 100π = 5/3 cm"], ans: "5/3 cm, about 1.67 cm" },
        shortcut: "Rise = (volume of the solid) ÷ (base area of the vessel). The vessel's area counts, not the solid's."
      }],
      ["pattern", {
        key: "quant/mensuration-3d/cost-of-painting-tiling", title: "Cost of painting / tiling",
        spot: "Painting the walls of a room, tiling a floor, plastering a tank, with a rate per square metre.",
        method: ["Decide which surfaces are painted: four walls (not floor or ceiling) = 2h(l + b).", "Subtract doors, windows and other openings.", "Cost = area × rate. Tiles = floor area ÷ area of one tile (convert the units first)."],
        ex: { q: "A room is 10 m long, 8 m wide and 4 m high. It has one door of 2 m² and two windows of 1.5 m² each. Find the cost of painting the four walls at ₹25 per m².", steps: ["Four walls = 2 × (10 + 8) × 4 = 144 m²", "Openings = 2 + 1.5 + 1.5 = 5 m²", "Paintable area = 144 − 5 = 139 m², cost = 139 × 25"], ans: "₹3,475" },
        shortcut: "Floor 10 × 8 = 80 m² with 40 cm × 40 cm tiles (0.16 m² each) needs 80 / 0.16 = 500 tiles."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Slant height versus height:** the cone's CSA uses l, its volume uses h.",
        "**Hemisphere TSA:** 3πr², not 2πr². The flat circle counts too.",
        "**Open containers:** a cup or tank without a lid has no top surface. Add only the surfaces that exist.",
        "**Forgetting the ⅓:** cone volume is ⅓πr²h. Write the ⅓ down at once.",
        "**Diameter as radius:** convert diameter to radius first. A pipe of diameter 14 has r = 7.",
        "**Units:** m³ to litres is × 1,000. cm³ to m³ divides by 10,00,000.",
        "**Wrong base in water-level questions:** use the base of the vessel, not the base of the solid dropped in.",
        "**Painting:** four walls do not include the floor or ceiling, and doors and windows are removed."
      ]],
      ["warn", "In melting questions, remember that the volume does not change but the surface area does. Do not equate surface areas."],

      ["h2", "Quick check"],
      ["quiz", ["mensuration-3d-01", "mensuration-3d-03", "mensuration-3d-04", "mensuration-3d-06", "mensuration-3d-08"]]
    ]
  });
  BRIEFS["quant:mensuration-3d"] = "Every solid has a volume (how much it holds) and a surface area (how much paint covers it). Learn the formulas for cuboid, cylinder, cone, sphere and hemisphere, find the slant height with Pythagoras (l² = r² + h²), and remember that a hemisphere's total surface is 3πr² because the flat top counts.\n\nMost “story” questions are one equation: the volume stays the same when a solid is melted, recast or dropped into water. Write the two volumes, cancel π and the common factors, and divide. Use the vessel's base area for water rising.";

  /* =====================================================================================
     GEOMETRY BASICS
     ===================================================================================== */
  LEARN.quant.push({
    id: "geometry", group: "Geometry & mensuration", title: "Geometry basics",
    sub: "Angles, triangles, circles, polygons and the coordinate plane, with the facts you actually need",
    tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "eLitmus"],
    blocks: [
      ["h2", "The idea"],
      ["p", "Placement geometry is mostly **a short list of facts** applied to a diagram. There is little to prove. Draw the figure, write every known angle or length on it, and ask which fact connects the unknown to what you know."],
      ["list", [
        "**Angle facts first:** a straight line is 180°, a full turn is 360°, the angles of a triangle add up to 180°.",
        "**Parallel lines:** a transversal makes corresponding angles equal and alternate angles equal; co-interior (same-side) angles add up to 180°.",
        "**Triangles:** Pythagoras for right triangles, and similar triangles for anything that looks like a smaller copy.",
        "**Circles:** the centre is the key point. Radii to chord ends, perpendicular to a chord, tangent meeting the radius all create right triangles or isosceles triangles."
      ]],
      ["h", "Parallel lines and a transversal"],
      ["html", PARALLEL],
      ["note", "Equal angles: corresponding (F shape) and alternate (Z shape). Supplementary angles: co-interior (C shape), adding to 180°."],

      ["h2", "Rules"],
      ["formulas", [
        ["Angles at a point", "On a straight line 180°; around a point 360°; vertically opposite angles are equal", "Linear pair: two angles on a line add up to 180°"],
        ["Parallel lines", "Corresponding = equal;  alternate = equal;  co-interior = 180°", "All the other angles follow from these"],
        ["Triangle", "Sum of angles = 180°;  exterior angle = sum of the two opposite interior angles", "Isosceles: equal sides face equal angles"],
        ["Pythagoras", "a² + b² = c²", "Triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25, 20-21-29, 9-40-41 (and multiples)"],
        ["Similar triangles", "Sides in the same ratio k;  areas in ratio k²;  volumes in ratio k³", "A line parallel to a side cuts the other two sides in the same ratio"],
        ["Circle: chords", "Perpendicular from the centre bisects the chord", "r² = d² + (chord/2)²"],
        ["Circle: tangents", "Tangent ⊥ radius;  tangents from one external point are equal;  tangent length = √(d² − r²)", "d is the distance from the point to the centre"],
        ["Circle: angles", "Angle at the centre = 2 × angle at the circumference;  angle in a semicircle = 90°", "Cyclic quadrilateral: opposite angles add up to 180°"],
        ["Polygon (n sides)", "Interior sum = (n − 2) × 180°;  exterior sum = 360°;  diagonals = n(n − 3)/2", "Regular: each exterior angle = 360°/n"],
        ["Coordinates", "Distance = √((x₂ − x₁)² + (y₂ − y₁)²);  midpoint = (average of x, average of y)", "Slope = (y₂ − y₁)/(x₂ − x₁);  parallel lines have equal slopes"],
        ["Area of a triangle (coordinates)", "½ |x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)|", "Zero area means the three points are on one line"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Add a line:** drawing a line parallel to the given ones, or joining the centre to a point on the circle, often creates the right triangle you need.",
        "**Triples first:** whenever two sides of a right triangle are 3-4-5 or 5-12-13 family numbers, the third is free. 24 and 7 give 25.",
        "**Angle ratios:** angles in the ratio 2 : 3 : 4 split 180° into 9 parts of 20°, giving 40°, 60°, 80°.",
        "**Regular polygon, given interior angle:** exterior = 180° − interior, then sides = 360° ÷ exterior.",
        "**Similar figures:** match the ratio of sides, then square it for area (or cube it for volume). Do not square the ratio twice."
      ]],
      ["tip", "In a coordinate question, a quick sketch often shows the answer: a horizontal or vertical side gives its length by subtraction, so you can use ½ × base × height with no formula."],
      ["html", SIMILAR],

      ["h2", "Patterns"],
      ["pattern", {
        key: "quant/geometry/angles-and-parallel-lines", title: "Angles & parallel lines",
        spot: "Two parallel lines cut by a transversal with some angles given as expressions (2x + 10, 3x − 20), or angles on a straight line and around a point.",
        method: ["Identify the angle relation: equal (corresponding, alternate, vertically opposite) or supplementary (co-interior, linear pair).", "Write the equation, for example sum = 180° or the two angles equal.", "Solve for x, then substitute back to get the angles asked."],
        ex: { q: "AB ∥ CD and a transversal makes co-interior angles of (2x + 10)° and (3x − 20)°. Find x and the two angles.", steps: ["Co-interior angles add up to 180°: (2x + 10) + (3x − 20) = 180", "5x − 10 = 180, so x = 38", "Angles = 2 × 38 + 10 = 86° and 3 × 38 − 20 = 94°"], ans: "x = 38; angles 86° and 94°" },
        shortcut: "Check at the end: the two angles must add up to 180° (86 + 94 = 180)."
      }],
      ["pattern", {
        key: "quant/geometry/triangle-properties-and-pythagorean-triplets", title: "Triangle properties & Pythagorean triplets",
        spot: "A right triangle with two sides known (a ladder against a wall, a diagonal), or angles of a triangle in a ratio, or an exterior angle.",
        method: ["Right triangle: a² + b² = c², with c the longest side (the hypotenuse).", "Look for a triple first; it saves the square root.", "Angles: the three angles sum to 180°, and an exterior angle equals the sum of the two far angles."],
        ex: { q: "A 25 m ladder leans against a wall with its foot 7 m from the wall. How high up the wall does it reach?", steps: ["Ladder is the hypotenuse: height² = 25² − 7² = 625 − 49 = 576", "Height = √576", "Spot the triple: 7, 24, 25"], ans: "24 m" },
        shortcut: "Triples to memorise: 3-4-5, 5-12-13, 8-15-17, 7-24-25, 20-21-29, 9-40-41, and their multiples (6-8-10, 9-12-15)."
      }],
      ["pattern", {
        key: "quant/geometry/similarity-and-area-ratios", title: "Similarity & area ratios",
        spot: "A line parallel to one side of a triangle, two triangles with equal angles (similar), or two similar figures with areas or sides compared.",
        method: ["Match the corresponding sides and write the side ratio.", "Ratio of areas = (ratio of sides)². Ratio of volumes = (ratio of sides)³.", "A part-and-whole question is the whole minus the small piece."],
        ex: { q: "In triangle ABC, D and E lie on AB and AC with DE ∥ BC, AD = 4 cm and DB = 2 cm. If the area of ABC is 54 cm², find the area of triangle ADE and of the trapezium DBCE.", steps: ["AD : AB = 4 : 6 = 2 : 3, so the triangles are similar with ratio 2 : 3", "Area ratio = 4 : 9, so area of ADE = 4/9 × 54 = 24 cm²", "Trapezium DBCE = 54 − 24 = 30 cm²"], ans: "ADE = 24 cm² and DBCE = 30 cm²" },
        shortcut: "The ratio is AD : AB (part to whole), not AD : DB. Here the whole side is 4 + 2 = 6."
      }],
      ["pattern", {
        key: "quant/geometry/circle-theorems", title: "Circle theorems (chords, tangents)",
        spot: "A chord with its distance from the centre, a tangent from an outside point, or angles at the centre and the circumference.",
        method: ["Join the centre to the points that matter; this creates a right triangle with the radius as hypotenuse.", "The perpendicular from the centre to a chord bisects it, so half chord, distance and radius form a right triangle.", "Tangent length from a point at distance d is √(d² − r²), since the radius to the point of contact is perpendicular to the tangent."],
        ex: { q: "A chord of length 24 cm is drawn in a circle of radius 13 cm. How far is the chord from the centre?", steps: ["Half the chord = 12 cm", "Distance² = 13² − 12² = 169 − 144 = 25", "Distance = 5 cm"], ans: "5 cm" },
        shortcut: "Radius 13 and half chord 12 is the 5-12-13 triple. A tangent from a point 17 cm from the centre of a circle of radius 8 is 15 cm long (8-15-17)."
      }],
      ["html", CHORD],
      ["pattern", {
        key: "quant/geometry/polygons", title: "Polygons (angles, diagonals)",
        spot: "A regular polygon with each angle given, the number of sides, the sum of the angles or the number of diagonals.",
        method: ["Interior angle sum = (n − 2) × 180°. A regular polygon has equal angles.", "Each exterior angle = 360°/n and interior + exterior = 180°.", "Diagonals = n(n − 3)/2."],
        ex: { q: "Each interior angle of a regular polygon is 150°. Find the number of sides, the sum of all its interior angles, and the number of diagonals.", steps: ["Exterior angle = 180° − 150° = 30°, so n = 360/30 = 12", "Interior sum = (12 − 2) × 180° = 1,800°", "Diagonals = 12 × 9 / 2 = 54"], ans: "12 sides, 1,800° and 54 diagonals" },
        shortcut: "Use exterior angles: n = 360° ÷ exterior angle. The hexagon has an interior angle of 120° and the octagon 135°."
      }],
      ["pattern", {
        key: "quant/geometry/coordinate-basics", title: "Coordinate basics (distance, midpoint, slope, area)",
        spot: "Points given as (x, y), asking for distance, midpoint, slope, a type of triangle, or the area of a triangle.",
        method: ["Distance = √(Δx² + Δy²). Midpoint = average of the coordinates.", "Slope = Δy/Δx. Parallel lines have equal slopes.", "Area of a triangle = ½ |x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)|, or ½ × base × height if a side is horizontal."],
        ex: { q: "Find the area and perimeter of the triangle with vertices A(1, 2), B(7, 2) and C(4, 6).", steps: ["Area = ½ |1(2 − 6) + 7(6 − 2) + 4(2 − 2)| = ½ |−4 + 28 + 0| = 12", "AB = 6, AC = √(3² + 4²) = 5, BC = √(3² + 4²) = 5", "Perimeter = 6 + 5 + 5 = 16"], ans: "Area 12 square units and perimeter 16 units" },
        shortcut: "AB is horizontal with length 6 and C is 4 units above it: ½ × 6 × 4 = 12. The slope of BC is (6 − 2)/(4 − 7) = −4/3."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Mixing the angle names:** corresponding and alternate angles are equal; co-interior angles add up to 180°. Check the shape (F, Z or C) before writing the equation.",
        "**Hypotenuse:** in Pythagoras, c is the longest side. Do not subtract the two shorter sides from each other.",
        "**Area ratio:** it is the square of the side ratio, not the ratio itself.",
        "**Wrong ratio in similarity:** use part-to-whole (AD : AB), not part-to-part (AD : DB).",
        "**Chord distance:** use half the chord, not the whole chord, in the right triangle.",
        "**Interior versus exterior angle:** a regular polygon's n comes from the exterior angle, 360°/n.",
        "**Coordinate signs:** subtract in the same order for x and y, and watch the minus signs in the area formula.",
        "**Tangent length:** it is √(d² − r²), where d is measured to the centre."
      ]],
      ["warn", "Do not trust the drawing. Exam figures are rarely to scale, so use only what is given in the text and the standard theorems."],

      ["h2", "Quick check"],
      ["quiz", ["geometry-01", "geometry-02", "geometry-04", "geometry-05", "geometry-07"]]
    ]
  });
  BRIEFS["quant:geometry"] = "Placement geometry is a short list of facts applied to a figure: angles on a line add to 180°, the angles of a triangle add to 180°, parallel lines give equal or supplementary angles, and Pythagoras (with triples like 3-4-5 and 5-12-13) handles right triangles. Draw the figure and write every known value on it first.\n\nSimilar figures have areas in the ratio of the square of the sides. For circles, join the centre to make a right triangle (the perpendicular bisects a chord, the tangent meets the radius at 90°). For polygons use exterior angles (360°/n), and for the coordinate plane use the distance, midpoint, slope and area formulas.";

  /* =====================================================================================
     ALGEBRA
     ===================================================================================== */
  LEARN.quant.push({
    id: "algebra", group: "Algebra", title: "Algebra",
    sub: "Equations, quadratics, inequalities and the identities that make hard-looking sums easy",
    tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "eLitmus"],
    blocks: [
      ["h2", "The idea"],
      ["p", "Algebra is arithmetic with a **letter standing in for the unknown number**. You write what the question says as an equation, then do the same thing to both sides until the letter is alone."],
      ["list", [
        "**Balance rule:** whatever you add, subtract, multiply or divide on one side, do on the other.",
        "**Two unknowns need two equations:** eliminate one letter (make its coefficients equal and subtract) and solve for the other.",
        "**Word problems:** name the unknown, translate each sentence into one equation, and check the answer against the story.",
        "**Quadratics:** a quadratic ax² + bx + c = 0 has two roots. Often you only need their sum and product, which come straight from a, b and c, without finding the roots."
      ]],
      ["note", "Identities are your friends. Many “find the value” questions are one identity: (a + b)² = a² + 2ab + b² with a + b and ab given. You never need to find a and b themselves."],

      ["h2", "Formulas"],
      ["formulas", [
        ["Linear equation", "ax + b = c, so x = (c − b)/a", "Same operation on both sides"],
        ["Simultaneous equations", "a₁x + b₁y = c₁ and a₂x + b₂y = c₂", "Eliminate one variable by equalising coefficients"],
        ["Quadratic formula", "x = (−b ± √(b² − 4ac)) / 2a", "Discriminant D = b² − 4ac: D > 0 two real roots, D = 0 equal roots, D < 0 none"],
        ["Roots of a quadratic", "Sum = −b/a;  product = c/a", "Quadratic with roots p, q: x² − (p + q)x + pq = 0"],
        ["Square identities", "(a ± b)² = a² ± 2ab + b²;  a² − b² = (a + b)(a − b)", "a² + b² = (a + b)² − 2ab"],
        ["Cube identities", "a³ + b³ = (a + b)³ − 3ab(a + b);  a³ − b³ = (a − b)³ + 3ab(a − b)", "a³ + b³ = (a + b)(a² − ab + b²)"],
        ["Reciprocal identities", "x² + 1/x² = (x + 1/x)² − 2", "x³ + 1/x³ = (x + 1/x)³ − 3(x + 1/x)"],
        ["Three variables", "a³ + b³ + c³ − 3abc = (a + b + c)(a² + b² + c² − ab − bc − ca)", "If a + b + c = 0 then a³ + b³ + c³ = 3abc"],
        ["Modulus", "|x| < a means −a < x < a;  |x| > a means x < −a or x > a", "|x| is the distance from 0, so it is never negative"],
        ["Inequalities", "Multiply or divide by a negative number: flip the sign", "Add or subtract the same amount: the sign stays"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Plug in the options:** for a linear equation, try the answer choices in the equation. It can be quicker than solving it.",
        "**Add and subtract:** for x + y = 20 and x − y = 6, adding gives 2x = 26, so x = 13.",
        "**Factorise by splitting:** x² − 7x + 12 needs two numbers with product 12 and sum −7, which are −3 and −4.",
        "**Sum and product first:** for expressions like α² + β², use (α + β)² − 2αβ with the sum and product.",
        "**Difference of squares for mental arithmetic:** 101² − 99² = (101 + 99)(101 − 99) = 400.",
        "**Smallest value:** for positive x, x + 1/x is at least 2 (AM ≥ GM); the equality holds when x = 1."
      ]],
      ["tip", "If a question gives you x + 1/x = 3 and asks for x² + 1/x², square the given equation: x² + 2 + 1/x² = 9, so the answer is 7. No solving needed."],
      ["html", NUMLINE],

      ["h2", "Patterns"],
      ["pattern", {
        key: "quant/algebra/linear-equations", title: "Linear equations",
        spot: "One or two equations of degree 1 in x (and y), possibly with fractions, asking for the unknowns or an expression of them.",
        method: ["Clear fractions by multiplying through by the LCM of the denominators.", "Two unknowns: multiply to match the coefficient of one letter, then add or subtract to eliminate it.", "Back-substitute to get the second unknown, and verify in both equations."],
        ex: { q: "Solve 2x + 3y = 13 and 3x − 2y = 0.", steps: ["Multiply the first by 2 and the second by 3: 4x + 6y = 26 and 9x − 6y = 0", "Add: 13x = 26, so x = 2", "From the second equation: 3 × 2 = 2y, so y = 3. Check: 4 + 9 = 13"], ans: "x = 2, y = 3" },
        shortcut: "Eliminate the letter whose coefficients are easy to match (here the y's become +6 and −6). A quick check by substitution catches slips."
      }],
      ["pattern", {
        key: "quant/algebra/word-problems-equations", title: "Word problems → equations",
        spot: "A story about prices, ages, numbers or quantities that translates into one or two linear equations.",
        method: ["Name the unknowns (p for a pen, n for a notebook).", "Translate each sentence into an equation.", "Solve, then check that the answer fits the story (positive, a whole number of items, and so on)."],
        ex: { q: "5 pens and 3 notebooks cost ₹95. 2 pens and 3 notebooks cost ₹65. Find the price of one pen and one notebook.", steps: ["5p + 3n = 95 and 2p + 3n = 65", "Subtract: 3p = 30, so p = 10", "3n = 65 − 20 = 45, so n = 15"], ans: "Pen ₹10 and notebook ₹15" },
        shortcut: "When two equations share a term (3n here), subtract them directly. Ages: “in x years” adds x to everyone."
      }],
      ["pattern", {
        key: "quant/algebra/quadratics", title: "Quadratics (roots, sum / product)",
        spot: "A quadratic equation to solve, or an expression in the roots (α² + β², 1/α + 1/β) without solving.",
        method: ["Sum of roots = −b/a and product = c/a.", "Express the target using the sum S and product P: α² + β² = S² − 2P; 1/α + 1/β = S/P.", "To solve, factorise or use the quadratic formula; check D = b² − 4ac first."],
        ex: { q: "If α and β are the roots of x² − 6x + 4 = 0, find α² + β².", steps: ["Sum = 6 and product = 4", "α² + β² = (α + β)² − 2αβ = 36 − 8", "= 28"], ans: "28" },
        shortcut: "The roots here are 3 ± √5, and the squares add to 28 indeed. Always write S and P first, then substitute."
      }],
      ["pattern", {
        key: "quant/algebra/inequalities-and-modulus", title: "Inequalities & modulus",
        spot: "A linear inequality with a letter, a modulus such as |2x − 3| < 7, and a question such as the number of integer solutions.",
        method: ["Linear inequality: solve like an equation, and flip the sign when multiplying or dividing by a negative.", "|expression| < a means −a < expression < a (one inside range).", "|expression| > a means expression < −a or expression > a (two outside ranges)."],
        ex: { q: "How many integer values of x satisfy |2x − 3| < 7?", steps: ["−7 < 2x − 3 < 7", "Add 3: −4 < 2x < 10, so −2 < x < 5", "Integers: −1, 0, 1, 2, 3, 4"], ans: "6 integers" },
        shortcut: "Sketch the range on a number line and watch the ends: “<” excludes them (open circle), “≤” includes them."
      }],
      ["pattern", {
        key: "quant/algebra/identities", title: "Identities",
        spot: "Values like a + b and ab (or x + 1/x) are given and a higher power or a different expression is asked.",
        method: ["Pick the identity that connects the given with the target: squares, cubes, reciprocals.", "Substitute the given values; never solve for a and b.", "Check with easy numbers (a = 2, b = 5) when the identity is unfamiliar."],
        ex: { q: "If a + b = 7 and ab = 10, find a² + b² and a³ + b³.", steps: ["a² + b² = (a + b)² − 2ab = 49 − 20 = 29", "a³ + b³ = (a + b)³ − 3ab(a + b) = 343 − 3 × 10 × 7 = 343 − 210", "= 133"], ans: "a² + b² = 29 and a³ + b³ = 133" },
        shortcut: "Check with a = 2, b = 5: 4 + 25 = 29 and 8 + 125 = 133. For x + 1/x = 3: x² + 1/x² = 7 and x³ + 1/x³ = 18."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Forgetting to flip:** multiplying or dividing an inequality by a negative number reverses the sign. −3x + 5 > 11 gives x < −2.",
        "**Modulus as one case:** |x| > a has two parts (x < −a or x > a), not one.",
        "**Dropping the minus sign:** −b/a for the sum of roots, not b/a.",
        "**Losing the 2ab:** (a + b)² is not a² + b². The middle term 2ab matters.",
        "**Cube identity slip:** a³ + b³ = (a + b)³ − 3ab(a + b). The coefficient is 3ab, not 2ab.",
        "**Not checking the story:** if the equation gives a negative price or half a person, a sentence was mistranslated.",
        "**Only one root:** a quadratic usually has two roots. Check that both fit the question (a length cannot be negative).",
        "**Strict versus non-strict:** “<” excludes the end points when you count integer solutions."
      ]],
      ["warn", "Substitute your answer back into the original equation. It is the fastest way to catch an arithmetic slip or a sign error."],

      ["h2", "Quick check"],
      ["quiz", ["algebra-01", "algebra-03", "algebra-05", "algebra-07", "algebra-09"]]
    ]
  });
  BRIEFS["quant:algebra"] = "Algebra means writing the question as an equation and doing the same thing to both sides until the letter is alone. Two unknowns need two equations (eliminate one), word problems need the unknowns named first, and a quadratic ax² + bx + c = 0 has roots whose sum is −b/a and product c/a.\n\nIdentities turn hard-looking questions into one line: if a + b and ab are given, a² + b² and a³ + b³ follow without finding a or b. For inequalities flip the sign when multiplying by a negative, and remember |x| < a means a single range while |x| > a means two outer ranges.";

  /* =====================================================================================
     PROGRESSIONS
     ===================================================================================== */
  LEARN.quant.push({
    id: "progressions", group: "Algebra", title: "Progressions",
    sub: "Arithmetic and geometric progressions, their sums, and the three means",
    tags: ["TCS", "Infosys", "Wipro", "AMCAT", "eLitmus", "CoCubes"],
    blocks: [
      ["h2", "The idea"],
      ["p", "A **progression** is a list of numbers that follows a rule. In an **arithmetic progression (AP)** you add the same number (the common difference d) each time: 3, 7, 11, 15, … In a **geometric progression (GP)** you multiply by the same number (the common ratio r) each time: 3, 6, 12, 24, …"],
      ["list", [
        "**AP:** the terms go up or down in equal steps, so the graph is a straight line. Savings that grow by a fixed amount each month form an AP.",
        "**GP:** the terms change by the same factor, so growth is by a percent. Compound growth and halving are GPs.",
        "**Sum of an AP = average × number of terms:** the average of the first and last term, times n.",
        "**Means:** for two positive numbers a and b, the arithmetic mean (AM), geometric mean (GM) and harmonic mean (HM) always satisfy AM ≥ GM ≥ HM."
      ]],
      ["note", "To tell them apart, subtract consecutive terms (same difference means AP) and divide consecutive terms (same ratio means GP)."],

      ["h2", "Formulas"],
      ["formulas", [
        ["AP nth term", "Tₙ = a + (n − 1)d", "a is the first term; Tₘ − Tₙ = (m − n)d"],
        ["AP sum", "Sₙ = (n/2)[2a + (n − 1)d] = (n/2)(a + l)", "l is the last term"],
        ["Number of terms in an AP", "n = (l − a)/d + 1", "From 7 to 100 in steps of 3: (100 − 7)/3 + 1 = 32"],
        ["Special sums", "1 + 2 + … + n = n(n + 1)/2;  odd numbers: n²;  even numbers: n(n + 1)", "Squares: n(n + 1)(2n + 1)/6;  cubes: [n(n + 1)/2]²"],
        ["GP nth term", "Tₙ = a rⁿ⁻¹", "r = any term ÷ the previous term"],
        ["GP sum", "Sₙ = a(rⁿ − 1)/(r − 1) for r > 1;  a(1 − rⁿ)/(1 − r) for r < 1", "For r = 1 the sum is just na"],
        ["Infinite GP", "S∞ = a/(1 − r), valid only when |r| < 1", "The terms shrink towards 0"],
        ["Arithmetic mean", "AM = (a + b)/2", "The middle term of an AP"],
        ["Geometric mean", "GM = √(ab)", "The middle term of a GP"],
        ["Harmonic mean", "HM = 2ab/(a + b)", "GM² = AM × HM, and AM ≥ GM ≥ HM"],
        ["Inserting n AP means", "d = (b − a)/(n + 1)", "Between a and b, a total of n + 2 terms"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Three terms in AP:** take a − d, a, a + d. Their sum is 3a, so the middle term is the sum ÷ 3. Five terms: a − 2d … a + 2d.",
        "**Three terms in GP:** take a/r, a, ar. Their product is a³.",
        "**Two terms known in an AP:** subtract and divide: d = (T₁₂ − T₇)/(12 − 7). Then find a.",
        "**Average × count:** the sum of an AP is (first + last)/2 × n. No need for d if you know both end terms.",
        "**Infinite GP:** 18 + 6 + 2 + … has a = 18, r = 1/3, so S = 18/(2/3) = 27.",
        "**Pairing:** 1 + 2 + … + 100 = 50 pairs of 101 = 5,050."
      ]],
      ["tip", "A GP with |r| ≥ 1 never settles on a total, so “sum to infinity” only makes sense for |r| < 1. For any other ratio, ask for the sum of the first n terms and use the finite formula."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "quant/progressions/ap-nth-term-and-sum", title: "AP nth term & sum",
        spot: "A list with a constant difference, two terms given (7th and 12th), the nth term, the sum of n terms, or the number of terms.",
        method: ["Find d from two terms: (Tₘ − Tₙ)/(m − n). Then a = Tₙ − (n − 1)d.", "Tₙ = a + (n − 1)d.", "Sₙ = (n/2)[2a + (n − 1)d], or (n/2)(first + last)."],
        ex: { q: "The 7th term of an AP is 25 and the 12th term is 45. Find the first term, the common difference and the sum of the first 20 terms.", steps: ["d = (45 − 25)/(12 − 7) = 20/5 = 4", "a = 25 − 6 × 4 = 1", "S₂₀ = (20/2)[2 × 1 + 19 × 4] = 10 × 78 = 780"], ans: "a = 1, d = 4 and S₂₀ = 780" },
        shortcut: "Differences of terms are multiples of d: T₁₂ − T₇ = 5d. Sum = average of the end terms × number of terms."
      }],
      ["pattern", {
        key: "quant/progressions/gp-nth-term-and-sum", title: "GP nth term & sum, infinite GP",
        spot: "A list with a constant ratio (doubling, tripling, halving), the nth term, the sum of n terms, or the sum to infinity.",
        method: ["Find r = any term ÷ the previous one.", "Tₙ = a rⁿ⁻¹.", "Sₙ = a(rⁿ − 1)/(r − 1) when r > 1; for an infinite GP with |r| < 1, S = a/(1 − r)."],
        ex: { q: "A GP has first term 3 and common ratio 2. Find its 8th term and the sum of the first 8 terms.", steps: ["T₈ = 3 × 2⁷ = 3 × 128 = 384", "S₈ = 3(2⁸ − 1)/(2 − 1) = 3 × 255", "= 765"], ans: "T₈ = 384 and S₈ = 765" },
        shortcut: "Infinite GP: 18, 6, 2, … has r = 1/3, so the sum is 18/(1 − 1/3) = 27. For r = 2, the sum of 8 terms is 255 times the first term."
      }],
      ["pattern", {
        key: "quant/progressions/am-gm-hm", title: "AM / GM / HM",
        spot: "Two positive numbers with their arithmetic, geometric or harmonic mean given, or a relation between the three means.",
        method: ["AM = (a + b)/2, GM = √(ab), HM = 2ab/(a + b).", "Use GM² = AM × HM (for two numbers) to find the third mean from the other two.", "Sum and product come from AM and GM: a + b = 2 AM and ab = GM²."],
        ex: { q: "The AM of two positive numbers is 10 and their GM is 8. Find the numbers and their HM.", steps: ["a + b = 20 and ab = 64", "Numbers satisfy t² − 20t + 64 = 0, so t = 16 or 4", "HM = 2ab/(a + b) = 128/20 = 6.4. Check: GM² = 64 = 10 × 6.4"], ans: "The numbers are 16 and 4, and HM = 6.4" },
        shortcut: "HM = GM²/AM = 64/10 = 6.4 straight away. And AM ≥ GM ≥ HM: 10 ≥ 8 ≥ 6.4."
      }],
      ["pattern", {
        key: "quant/progressions/word-problems", title: "Word problems (growing savings)",
        spot: "Savings, loan repayments, salaries or production that grow by a fixed amount (AP) or a fixed percent (GP) each period, and a total over n periods.",
        method: ["Fixed amount each period: it is an AP. Fixed percent each period: it is a GP.", "Write a, d (or r) and n from the story.", "Use the sum formula and read the question for what is asked: the amount in one period or the total."],
        ex: { q: "Priya saves ₹500 in the first month and ₹100 more each following month than in the month before. How much has she saved in 12 months?", steps: ["AP with a = 500, d = 100, n = 12", "S₁₂ = (12/2)[2 × 500 + 11 × 100] = 6 × 2,100", "= 12,600"], ans: "₹12,600" },
        shortcut: "Savings in the last month = 500 + 11 × 100 = 1,600. Average of the first and last: (500 + 1,600)/2 = 1,050, times 12 = 12,600."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Off-by-one:** Tₙ = a + (n − 1)d, not a + nd. The first term already counts.",
        "**Number of terms:** from 7 to 100 in steps of 3 is (100 − 7)/3 + 1 = 32 terms, not 31.",
        "**Wrong sum formula for GP:** use (rⁿ − 1)/(r − 1) when r > 1 and (1 − rⁿ)/(1 − r) when r < 1.",
        "**Infinite GP:** the formula a/(1 − r) works only when |r| < 1.",
        "**AP versus GP:** check the difference first and then the ratio. 2, 4, 8 is a GP, not an AP.",
        "**HM:** HM = 2ab/(a + b), not (a + b)/2. The AM ≥ GM ≥ HM order helps you catch slips.",
        "**Savings story:** if the extra amount is fixed it is an AP; if it is a percent it is a GP.",
        "**Sum of the first n odd numbers is n²,** not n(n + 1)/2 (that is the sum of the first n natural numbers)."
      ]],
      ["warn", "Before using a formula, say which one it is: AP or GP, and what n is. Then count the terms as a check: the first term is n = 1."],

      ["h2", "Quick check"],
      ["quiz", ["progressions-01", "progressions-03", "progressions-05", "progressions-08", "progressions-10"]]
    ]
  });
  BRIEFS["quant:progressions"] = "An arithmetic progression adds the same amount each time (Tₙ = a + (n − 1)d, sum = average of the end terms × n); a geometric progression multiplies by the same ratio each time (Tₙ = a rⁿ⁻¹, infinite sum a/(1 − r) when |r| < 1). Subtract consecutive terms to spot an AP and divide them to spot a GP.\n\nFor two positive numbers, AM = (a + b)/2, GM = √(ab) and HM = 2ab/(a + b), with AM ≥ GM ≥ HM and GM² = AM × HM. Word problems with a fixed amount each period are AP, and those with a fixed percent each period are GP.";
})();
