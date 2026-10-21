/* Learn pages for Logical Reasoning, part 1: series, analogies, classification, coding-decoding, alphabet test, blood relations, direction sense. */
window.LEARN = window.LEARN || {}; LEARN.reasoning = LEARN.reasoning || []; window.BRIEFS = window.BRIEFS || {};
(function () {
  /* ---------- small inline diagrams (stroke / fill use currentColor so they follow the theme) ---------- */
  var COMPASS = (function () {
    var cx = 190, cy = 128, R = 88, L = 112, names = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"], s = "";
    s += '<svg viewBox="0 0 380 256" role="img" aria-label="Compass with eight directions and their angles" style="max-width:380px;width:100%;height:auto" font-size="13" text-anchor="middle">';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" stroke="currentColor" stroke-width="1.5" fill="none"/>';
    names.forEach(function (n, i) {
      var a = i * 45 * Math.PI / 180, sx = Math.sin(a), sy = -Math.cos(a);
      s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + R * sx).toFixed(1) + '" y2="' + (cy + R * sy).toFixed(1) + '" stroke="currentColor" stroke-width="' + (i % 2 ? 1 : 2) + '" opacity="' + (i % 2 ? 0.45 : 0.9) + '"/>';
      var tx = cx + L * sx, ty = cy + L * sy + 4;
      s += '<text x="' + tx.toFixed(1) + '" y="' + ty.toFixed(1) + '" fill="currentColor" font-weight="' + (i % 2 ? 400 : 700) + '">' + n + '</text>';
      s += '<text x="' + (cx + (R - 24) * sx).toFixed(1) + '" y="' + (cy + (R - 24) * sy + 4).toFixed(1) + '" fill="currentColor" font-size="11" opacity="0.7">' + (i * 45) + '°</text>';
    });
    s += '<path d="M 232 52 A 90 90 0 0 1 266 82" stroke="currentColor" stroke-width="2" fill="none"/><path d="M 261 74 L 267 83 L 257 84" stroke="currentColor" stroke-width="2" fill="none"/>';
    s += '<text x="318" y="62" fill="currentColor" font-size="12">clockwise = +</text>';
    s += '</svg>';
    return '<div class="diagram">' + s + '<div class="cap">Angles are measured clockwise from North. A right turn adds degrees, a left turn takes them away.</div></div>';
  })();

  var PATH = (function () {
    var s = '<svg viewBox="0 0 380 240" role="img" aria-label="Path 15 East, 9 North, 3 West, 4 South with the straight line back to the start" style="max-width:380px;width:100%;height:auto" font-size="13" text-anchor="middle">';
    var ox = 40, oy = 205, k = 16;
    function X(v) { return ox + k * v; } function Y(v) { return oy - k * v; }
    var i;
    for (i = 0; i <= 16; i += 4) s += '<line x1="' + X(i) + '" y1="' + Y(0) + '" x2="' + X(i) + '" y2="' + Y(10) + '" stroke="currentColor" stroke-width="1" opacity="0.15"/>';
    for (i = 0; i <= 10; i += 5) s += '<line x1="' + X(0) + '" y1="' + Y(i) + '" x2="' + X(16) + '" y2="' + Y(i) + '" stroke="currentColor" stroke-width="1" opacity="0.15"/>';
    s += '<polyline points="' + X(0) + ',' + Y(0) + ' ' + X(15) + ',' + Y(0) + ' ' + X(15) + ',' + Y(9) + ' ' + X(12) + ',' + Y(9) + ' ' + X(12) + ',' + Y(5) + '" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linejoin="round"/>';
    s += '<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(12) + '" y2="' + Y(5) + '" stroke="currentColor" stroke-width="2" stroke-dasharray="6 5" fill="none"/>';
    s += '<circle cx="' + X(0) + '" cy="' + Y(0) + '" r="4.5" fill="currentColor"/><circle cx="' + X(12) + '" cy="' + Y(5) + '" r="4.5" fill="currentColor"/>';
    s += '<text x="' + X(0) + '" y="' + (Y(0) + 20) + '" fill="currentColor" font-weight="700">Start</text>';
    s += '<text x="' + X(12) + '" y="' + (Y(5) - 10) + '" fill="currentColor" font-weight="700">End</text>';
    s += '<text x="' + X(7.5) + '" y="' + (Y(0) + 18) + '" fill="currentColor">15 km East</text>';
    s += '<text x="' + (X(15) + 10) + '" y="' + (Y(4.5) + 4) + '" fill="currentColor" text-anchor="start">9 North</text>';
    s += '<text x="' + X(13.5) + '" y="' + (Y(9) - 8) + '" fill="currentColor">3 W</text>';
    s += '<text x="' + (X(12) + 8) + '" y="' + (Y(7) + 4) + '" fill="currentColor" text-anchor="start">4 S</text>';
    s += '<text x="' + X(4.6) + '" y="' + (Y(2.6) - 4) + '" fill="currentColor" transform="rotate(-' + (Math.atan2(5, 12) * 180 / Math.PI).toFixed(1) + ' ' + X(4.6) + ' ' + (Y(2.6) - 4) + ')" font-weight="700">13 km</text>';
    s += '<path d="M 14 60 L 14 28" stroke="currentColor" stroke-width="2" fill="none"/><path d="M 9 35 L 14 27 L 19 35" stroke="currentColor" stroke-width="2" fill="none"/><text x="14" y="76" fill="currentColor" font-weight="700">N</text>';
    s += '</svg>';
    return '<div class="diagram">' + s + '<div class="cap">Add up East minus West (12 east) and North minus South (5 north). The dashed line is the answer: a 5-12-13 triangle.</div></div>';
  })();

  var TREE = (function () {
    function sq(x, y, t, dash) { return '<rect x="' + (x - 19) + '" y="' + (y - 19) + '" width="38" height="38" rx="3" stroke="currentColor" stroke-width="2" fill="none"' + (dash ? ' stroke-dasharray="4 3"' : '') + '/><text x="' + x + '" y="' + (y + 5) + '" fill="currentColor" font-weight="700">' + t + '</text>'; }
    function ci(x, y, t) { return '<circle cx="' + x + '" cy="' + y + '" r="20" stroke="currentColor" stroke-width="2" fill="none"/><text x="' + x + '" y="' + (y + 5) + '" fill="currentColor" font-weight="700">' + t + '</text>'; }
    function ln(a, b, c, d) { return '<line x1="' + a + '" y1="' + b + '" x2="' + c + '" y2="' + d + '" stroke="currentColor" stroke-width="2" fill="none"/>'; }
    var s = '<svg viewBox="0 0 380 240" role="img" aria-label="Family tree: D is the mother of A and E; A is the father of B and C" style="max-width:380px;width:100%;height:auto" font-size="14" text-anchor="middle">';
    s += ln(120, 62, 120, 84) + ln(70, 84, 200, 84) + ln(70, 84, 70, 101) + ln(200, 84, 200, 101);
    s += ln(70, 139, 70, 170) + ln(30, 170, 110, 170) + ln(30, 170, 30, 185) + ln(110, 170, 110, 185);
    s += ci(120, 42, "D −") + sq(70, 120, "A +") + sq(200, 120, "E +") + sq(30, 205, "B +") + sq(110, 205, "C ?", true);
    s += '<text x="290" y="46" fill="currentColor" font-size="12" text-anchor="start">Legend</text>';
    s += '<rect x="290" y="58" width="20" height="20" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><text x="318" y="73" fill="currentColor" font-size="12" text-anchor="start">+ male</text>';
    s += '<circle cx="300" cy="98" r="10" stroke="currentColor" stroke-width="2" fill="none"/><text x="318" y="103" fill="currentColor" font-size="12" text-anchor="start">− female</text>';
    s += '<rect x="290" y="118" width="20" height="20" rx="2" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3" fill="none"/><text x="318" y="133" fill="currentColor" font-size="12" text-anchor="start">? not known</text>';
    s += '<text x="290" y="168" fill="currentColor" font-size="12" text-anchor="start">line down = parent</text><text x="290" y="186" fill="currentColor" font-size="12" text-anchor="start">bar across = siblings</text>';
    s += '</svg>';
    return '<div class="diagram">' + s + '<div class="cap">The puzzle: A is the father of B; B is the brother of C; D is the mother of A; E is the brother of A. Draw it once and the answer (E is C\'s uncle) can be read off.</div></div>';
  })();

  /* ====================================================================================== SERIES */
  LEARN.reasoning.push({
    id: "series", group: "Patterns & codes", title: "Series",
    sub: "Letters, numbers and clusters in a row: find the hidden step and carry it one place further",
    tags: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "AMCAT"],
    blocks: [
      ["h2", "The idea"],
      ["p", "A **series** is a row of terms that follow one hidden rule. Your job is to find the rule and apply it once more. The rule is almost always simple: add the same step each time, add a step that itself grows, or run two small series side by side."],
      ["p", "The single most useful habit is to **turn letters into numbers first** (A = 1, B = 2 … Z = 26). Once everything is a number, the usual gaps, doubling and squares show up at once. Turn the answer back into a letter at the end."],
      ["list", [
        "**Letter series:** one letter per term, e.g. B, E, H, K. Write the positions and look at the gaps.",
        "**Alphanumeric series:** letters and digits together, e.g. A1, C4, E9. The letter part and the digit part are two separate series.",
        "**Letter clusters:** groups like ACE, FHJ. Look **inside** a cluster for one rule and **between** clusters for another.",
        "**Repeating patterns:** a block that repeats (aab_ab…). Find the block, then fill the blank by its place in the block."
      ]],
      ["note", "Alphabet is a loop for these questions: after Z comes A again. Add 26 or subtract 26 when you step past either end."],

      ["h2", "Rules"],
      ["formulas", [
        ["Letter to number", "A = 1, B = 2 … M = 13, N = 14 … Z = 26", "Position from the right end = 27 − position from the left"],
        ["Constant gap", "term(n+1) = term(n) + k", "B, E, H, K, N: positions 2, 5, 8, 11, 14, step +3"],
        ["Growing gap", "gaps go +1, +2, +3 …", "A, C, F, J, O: gaps 2, 3, 4, 5 so the next gap is 6"],
        ["Two interleaved series", "odd places: rule 1, even places: rule 2", "B, Z, D, X, F, V: B, D, F go forward by 2 while Z, X, V go back by 2"],
        ["Wrap-around", "position − 26 (or + 26)", "X, Z, B, D: after Z (26) the next is 28 − 26 = 2 = B"],
        ["Cluster", "rule inside + rule between", "ACE, FHJ, KMO: inside +2, first letters 1, 6, 11 (+5)"],
        ["Alphanumeric", "letters and digits are independent", "A1, B4, C9, D16: letters +1, digits are squares"],
        ["Repeating block", "blank position mod block length", "Count where the blank sits inside one block"]
      ]],

      ["h2", "Shortcuts"],
      ["h", "Letter positions (learn this cold)"],
      ["table", ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"], [["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"]]],
      ["table", ["N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], [["14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26"]]],
      ["list", [
        "**EJOTY** = 5, 10, 15, 20, 25 (E, J, O, T, Y). From these five anchors you can reach any letter in at most two steps: R is T − 2 = 18.",
        "**M and N are the middle:** M = 13 and N = 14, so the alphabet splits into A–M and N–Z.",
        "**Write the gaps in a row** under the positions. A second row of gaps that is itself +1 each time means a growing gap.",
        "**If the first guess fails, try alternate terms:** put the odd places on one line and the even places on another.",
        "**Clusters:** write each cluster as three numbers. ACE is 1, 3, 5; FHJ is 6, 8, 10. Now it is just numbers.",
        "**Digits in alphanumeric series:** test squares (1, 4, 9, 16), cubes, +k and ×k, in that order."
      ]],
      ["tip", "Do not count on your fingers across more than three letters. Use the position table, add or subtract, and convert back. It is faster and you cannot lose count."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/series/letter-series", title: "Letter series",
        spot: "A single letter per term: “Find the next term: B, D, G, K, P, ?”",
        method: ["Write each letter as its position (A = 1 … Z = 26).", "Write the gaps between neighbours underneath.", "If the gaps are equal, add that gap. If the gaps grow, extend the gap series by one. If it fails, split into odd and even places.", "Convert the new number back to a letter."],
        ex: { q: "Find the next term: B, D, G, K, P, ?", steps: ["Positions: 2, 4, 7, 11, 16", "Gaps: 2, 3, 4, 5, so the next gap is 6", "16 + 6 = 22, and 22 is V"], ans: "V" },
        shortcut: "Gaps that go 2, 3, 4, 5 are the signature of a growing series. Extend the gaps, not the letters."
      }],
      ["pattern", {
        key: "reasoning/series/alphanumeric-series", title: "Alphanumeric series",
        spot: "Terms mix a letter with a number, such as “B2, D4, F8, H16, ?” or “A1Z, B4Y, C9X”.",
        method: ["Split every term into its letter part and its number part.", "Solve each part as its own small series.", "Join the next letter with the next number."],
        ex: { q: "Find the next term: B2, D4, F8, H16, ?", steps: ["Letters: B, D, F, H are positions 2, 4, 6, 8, so the next is 10 = J", "Numbers: 2, 4, 8, 16 double each time, so the next is 32", "Join them"], ans: "J32" },
        shortcut: "Never look for one rule for the whole term. Letters and digits almost always move independently."
      }],
      ["pattern", {
        key: "reasoning/series/letter-clusters", title: "Letter clusters",
        spot: "Groups of two to four letters in a row: “BDF, GIK, LNP, QSU, ?”",
        method: ["Write each cluster as numbers.", "Find the step **inside** one cluster (the same in every cluster).", "Find the step from the first letter of one cluster to the first letter of the next.", "Build the next cluster from the new first letter and the inside step."],
        ex: { q: "Find the next cluster: BDF, GIK, LNP, QSU, ?", steps: ["Inside each cluster the step is +2 (B, D, F is 2, 4, 6)", "First letters: B, G, L, Q is 2, 7, 12, 17, so the step is +5 and the next is 22 = V", "Cluster: V, then V + 2 = X, then X + 2 = Z"], ans: "VXZ" },
        shortcut: "Only track the first letter of each cluster for the between-cluster rule. The rest is the same inside rule every time."
      }],
      ["pattern", {
        key: "reasoning/series/repeating-patterns", title: "Repeating patterns (aab_ab…)",
        spot: "A long string with gaps: “a b c a b b _ a b b b c a _ b b b c”. Letters recur in blocks.",
        method: ["Find the point where the string starts to repeat or restart (often the letter that begins each block).", "Check whether the block is fixed or grows by one each time (abc, abbc, abbbc …).", "For each blank, ask what the block needs at that place, then count."],
        ex: { q: "Fill the two blanks in order: a b c a b b _ a b b b c a _ b b b c", steps: ["Blocks start at each a: abc, abbc, abbbc, abbbbc (one more b every time)", "First blank is the end of the second block abbc, so it is c", "Second blank is inside the fourth block a b b b b c: after a comes b"], ans: "c, b" },
        shortcut: "Mark where each block begins with a slash. Once you can see the blocks, the blanks fill themselves."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Counting the letter itself:** from B to E the gap is 3, not 4 (5 − 2).",
        "**Missing the wrap-around:** after Z comes A, so X, Z, B, D is a +2 series, not random.",
        "**Forcing one rule:** B, E, D, G, F, I has no single step, but B, D, F (+2) and E, G, I (+2) are two series woven together.",
        "**Ignoring direction:** Z, W, T, Q goes backwards. The step is −3, so the next is N, not a letter after Q.",
        "**Alphanumeric terms:** the digits might be squares (1, 4, 9) when you expect doubling. Test before choosing.",
        "**Clusters ending past Z:** wrap round (Z + 1 is A) before you pick an option."
      ]],
      ["warn", "Before you choose an option, check your rule on **every** given term, not just the last two. A rule that fits only part of the series is wrong."],

      ["h2", "Quick check"],
      ["quiz", ["series-01", "series-04", "series-06", "series-07", "series-10"]]
    ]
  });

  /* =================================================================================== ANALOGIES */
  LEARN.reasoning.push({
    id: "analogies", group: "Patterns & codes", title: "Analogies",
    sub: "If A is to B as C is to ?, state the link in words and apply it to C",
    tags: ["TCS", "Infosys", "Wipro", "Cognizant", "AMCAT", "eLitmus"],
    blocks: [
      ["h2", "The idea"],
      ["p", "An analogy is written **A : B :: C : ?** and read “A is to B as C is to what?”. The first pair shows a **relationship**. You find it and then rebuild the same relationship starting from C."],
      ["p", "The trick is to describe the link in one plain sentence. “Pen is the **tool** used to **write**.” Then try the sentence on the second pair: “Knife is the tool used to … cut.” If your sentence works on the first pair but is too vague to apply, make it more exact."],
      ["list", [
        "**Number analogies:** the second number is made from the first by a rule (square, cube, n² + n, ×k …). The rule must work on the first pair and gives the missing number from C.",
        "**Letter analogies:** the same letter rule is applied to each letter (shift, reverse alphabet) or to the whole group.",
        "**Word relationships:** tool and use, worker and tool, part and whole, study and subject, cause and effect, degree of intensity and so on."
      ]],

      ["h2", "Rules"],
      ["table", ["Link between A and B", "Example", "Same link for C"], [
        ["Tool → what it does", "Pen : Write", "Knife : Cut"],
        ["Worker → tool", "Carpenter : Saw", "Painter : Brush"],
        ["Worker → workplace", "Doctor : Hospital", "Teacher : School"],
        ["Part → whole", "Petal : Flower", "Page : Book"],
        ["Study of → subject", "Ornithology : Birds", "Entomology : Insects"],
        ["Instrument → what it measures", "Odometer : Distance", "Thermometer : Temperature"],
        ["Smaller → bigger degree", "Drizzle : Downpour", "Breeze : Gale"],
        ["Cause → effect", "Fire : Smoke", "Rain : Flood"],
        ["Young one → adult", "Puppy : Dog", "Calf : Cow"],
        ["Product → source", "Wool : Sheep", "Milk : Cow"]
      ]],
      ["formulas", [
        ["Squares and cubes", "n → n², n → n³", "4 : 16 :: 6 : 36 and 3 : 27 :: 5 : 125"],
        ["One off a power", "n → n² − 1, n → n³ − 1", "8 : 63 (8² − 1) and 5 : 124 (5³ − 1)"],
        ["Neighbour product", "n → n × (n + 1)", "6 : 42 because 6 × 7 = 42"],
        ["Letter shift", "each letter + k (or − k)", "BAT : DCV adds 2 to every letter"],
        ["Opposite letters", "letter → 27 − position", "AB : ZY, CD : XW"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Say the relation out loud** in one sentence and check it on the first pair. If it does not sound natural, it is probably the wrong relation.",
        "**Number pairs:** test the same short list every time, in this order: n², n³, n² ± 1, n³ ± 1, n(n + 1), ×k, +k.",
        "**Letter pairs:** compare the first letter of each side. If all letters move by the same amount, it is a shift. If they move by different amounts, try reverse alphabet or a position pattern.",
        "**Word options:** cross out options from a different category first (a place when you need a tool). Usually only one or two remain.",
        "**Keep the direction:** A : B means A leads to B. If Pen is the tool and Write is the action, the answer for Knife must be an action, not another tool."
      ]],
      ["tip", "A word analogy can sometimes be flipped to test it: if “Pen : Write” is tool to action, then “Write : Pen” would be action to tool. Use this to confirm which side is which before applying it to C."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/analogies/number-analogies", title: "Number analogies",
        spot: "“6 : 42 :: 9 : ?”. Two numbers separated by a colon, then a third number with a blank.",
        method: ["Test the common rules on the first pair: n², n³, n² ± 1, n(n + 1), ×k.", "Keep the first rule that gives the second number exactly.", "Apply that rule to the third number."],
        ex: { q: "Find the missing number: 6 : 42 :: 9 : ?", steps: ["6² = 36 does not give 42, but 6 × 7 = 42 does", "Rule: n × (n + 1)", "9 × 10"], ans: "90" },
        shortcut: "If the second number is a little above or below a square (36 + 6, 64 − 1), check n² + n and n² − 1 before anything else."
      }],
      ["pattern", {
        key: "reasoning/analogies/letter-analogies", title: "Letter analogies",
        spot: "Groups of letters on both sides: “BAT : DCV :: RUN : ?”",
        method: ["Compare the first letters of the two groups, then the second letters, then the third.", "If every letter moves by the same amount, note the shift. If the movement changes, test reverse alphabet or position pattern.", "Apply the exact same shift to every letter of the third group."],
        ex: { q: "Find the missing word: BAT : DCV :: RUN : ?", steps: ["B → D, A → C, T → V: every letter moves 2 forward", "R + 2 = T, U + 2 = W, N + 2 = P"], ans: "TWP" },
        shortcut: "Write the shift above each letter. If you see +2, +2, +2 you are done; if you see +1, +2, +3 it is a growing shift."
      }],
      ["pattern", {
        key: "reasoning/analogies/word-relationships", title: "Word relationships (tool–worker, part–whole…)",
        spot: "Words, not numbers: “Doctor : Stethoscope :: Carpenter : ?” with four word options.",
        method: ["Say the link between the first two words in one sentence (“a doctor uses a stethoscope”).", "Check it: is the link the same sort of link in both directions of the pair? Fix the direction.", "Apply the same sentence to the third word and pick the option that completes it."],
        ex: { q: "Doctor : Stethoscope :: Carpenter : ?   (Hospital, Saw, Wood, Table)", steps: ["Link: the worker and the tool he uses", "Carpenter, the worker, uses a saw", "Hospital is a workplace, wood is a material, table is a product"], ans: "Saw" },
        shortcut: "Eliminate by category. If the link is worker to tool, only a tool can be right."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Sharing a topic is not a link:** Doctor and Hospital are related, but if the first pair is worker to tool, Hospital is wrong.",
        "**Reversed direction:** “Part : Whole” and “Whole : Part” are different. Keep the order.",
        "**Right answer, wrong type:** if the first pair is worker to workplace, the missing word must be a workplace, not a second worker.",
        "**One pair, many rules:** 3 : 9 fits both n² and ×3. If a second pair is given, test the rule on it too before you commit.",
        "**Letter shifts that differ per letter:** if one letter moves +1 and the next +2, do not assume a constant shift.",
        "**Opposite letters:** AB : ZY is not “shift 25”, it is reverse alphabet (A ↔ Z, B ↔ Y)."
      ]],
      ["warn", "If two options both seem to fit, your sentence is too vague. Make it more exact (“tool that cuts”, not “related to a kitchen”)."],

      ["h2", "Quick check"],
      ["quiz", ["analogies-01", "analogies-02", "analogies-03", "analogies-05", "analogies-09"]]
    ]
  });

  /* ================================================================================ CLASSIFICATION */
  LEARN.reasoning.push({
    id: "classification", group: "Patterns & codes", title: "Classification (odd one out)",
    sub: "Three share a property, one breaks it: find the property that splits the group three to one",
    tags: ["TCS", "Infosys", "Wipro", "Capgemini", "AMCAT", "eLitmus"],
    blocks: [
      ["h2", "The idea"],
      ["p", "In a classification question you get four (sometimes five) items. **All but one** share something. The odd one does not. You are looking for the **property** that splits the group exactly three to one."],
      ["p", "Many items can be grouped in several ways, so do not stop at the first property you spot. The right one is the property that **three** items have and **one** lacks. If a property is shared by two and two, it is the wrong one."],
      ["list", [
        "**Numbers:** primes, squares, cubes, multiples, odd or even, digit sum, palindromes, perfect numbers.",
        "**Letter groups:** equal gaps between the letters, vowels, reverse order, opposite letters, a pair that is the mirror of another.",
        "**Words:** a category (bird, vegetable, planet), a function, a place, a hidden property such as number of letters."
      ]],

      ["h2", "Rules"],
      ["table", ["Type", "Things to test (in this order)"], [
        ["Numbers", "odd or even; prime; perfect square or cube; multiple of 3, 5, 7; digit sum; difference between digits"],
        ["Two-letter groups", "gap between the letters; vowel or consonant; forward or backward; opposite pairs (sum of positions = 27)"],
        ["Three-letter groups", "gaps between 1st and 2nd, 2nd and 3rd; same gap or growing gap; vowels used"],
        ["Words", "category first; then use or function; then place; then spelling facts (letters, vowels)"]
      ]],
      ["formulas", [
        ["Perfect squares to 15²", "1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225", "Last digit never 2, 3, 7 or 8"],
        ["Cubes to 10³", "1, 8, 27, 64, 125, 216, 343, 512, 729, 1000", "Both squares and cubes: 1, 64, 729"],
        ["Primes to 50", "2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47", "2 is the only even prime; 1 is not prime"],
        ["Divisibility", "3: digit sum; 9: digit sum; 11: alternate digit sum", "Quick test for “multiple of …” groupings"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Check the oddities first:** an item that is the only even, the only prime, the only non-square or the only different length is usually the answer.",
        "**Look for the 3 : 1 split:** count how many items have your property. If it is 2 or 4, switch to a new property.",
        "**For letter groups, always write positions** (for example QT is 17, 20). The gap is then a subtraction.",
        "**For words, name the category in one word** (bird, vegetable). If one item will not fit, that is your answer.",
        "**Skip the quick wins:** an item can be the odd one in a surprising way (such as a vowel in a group of consonants). Run through the checklist once before deciding."
      ]],
      ["tip", "Two properties can both look plausible. Take 9, 16, 25, 50: odd or even splits them 2 and 2 (9 and 25 odd, 16 and 50 even), which is useless, but “perfect square” splits them 3 and 1, so 50 is the odd one out."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/classification/numbers", title: "Numbers",
        spot: "“Find the odd one out: 16, 25, 36, 48, 64.” A group of numbers, one does not belong.",
        method: ["Test the usual properties: odd or even, prime, square, cube, multiple.", "Count how many numbers have each property. You need a 3 : 1 (or 4 : 1) split.", "The number that lacks the property is the answer."],
        ex: { q: "Find the odd one out: 16, 25, 36, 48, 64", steps: ["16 = 4², 25 = 5², 36 = 6², 64 = 8²", "48 is not a perfect square (6² = 36, 7² = 49)"], ans: "48" },
        shortcut: "Check perfect squares first. If almost every number is one except for a single odd item, that one is the answer."
      }],
      ["pattern", {
        key: "reasoning/classification/letter-groups", title: "Letter groups",
        spot: "“Find the odd one out: BD, FH, JL, NP, QT.” Each group has two or three letters.",
        method: ["Write the letter positions of every group.", "Find the gap between the letters in each group (and between group neighbours if needed).", "The group whose gap differs from the rest is the answer."],
        ex: { q: "Find the odd one out: BD, FH, JL, NP, QT", steps: ["BD: 2, 4 (gap 2); FH: 6, 8 (gap 2); JL: 10, 12 (gap 2); NP: 14, 16 (gap 2)", "QT: 17, 20 (gap 3)"], ans: "QT" },
        shortcut: "With two-letter groups, subtract the positions. Equal gaps are a pattern, the unequal one is the odd item."
      }],
      ["pattern", {
        key: "reasoning/classification/words", title: "Words",
        spot: "“Which word does not belong: Sparrow, Eagle, Bat, Crow?” Four words from one theme.",
        method: ["Put each word in a category (bird, animal, fruit, vegetable, planet, river …).", "Find the category that holds three of them.", "The fourth, which belongs to a different category, is the odd one out."],
        ex: { q: "Odd one out: Sparrow, Eagle, Bat, Crow", steps: ["Sparrow, Eagle and Crow are birds", "A bat is a flying mammal, not a bird"], ans: "Bat" },
        shortcut: "Use the narrowest category that fits three words. “Can fly” fits all four here, but “bird” fits only three."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Stopping at the first property:** many sets can be split in more than one way. Pick the property with a clean 3 : 1 split.",
        "**Treating 1 as a prime:** 1 is neither prime nor composite. 2 is the only even prime.",
        "**Mixing up squares and multiples:** 49 is a square, 48 is a multiple of 6 and 12 but not a square.",
        "**Skipping the gap in letter groups:** groups that look alike, such as QT and QS, are told apart only by the gap between their letters.",
        "**Too-wide categories:** “can fly” covers a bat and a crow. Narrow it down.",
        "**Relying on size:** the odd number is rarely just the largest or smallest. Look for a property."
      ]],
      ["warn", "If two items could both be called the odd one, you have found the wrong property. Look again for the rule under which exactly three agree."],

      ["h2", "Quick check"],
      ["quiz", ["classification-01", "classification-03", "classification-06", "classification-08", "classification-10"]]
    ]
  });

  /* ================================================================================ CODING-DECODING */
  LEARN.reasoning.push({
    id: "coding-decoding", group: "Patterns & codes", title: "Coding–decoding",
    sub: "Crack the rule from one example, then apply it to a new word, number or sentence",
    tags: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "Capgemini", "AMCAT"],
    blocks: [
      ["h2", "The idea"],
      ["p", "In a coding question one word (or sentence) is turned into a code by a hidden rule. You are shown one or two examples, and you must **find the rule** and then **apply it** to a new item."],
      ["p", "There are only a handful of rules, so the work is recognising which one you are looking at: letters shifted by a fixed amount, the alphabet reversed (A ↔ Z), letter positions added up, one common word renamed, a table of sentences, or a mixture of two steps."],
      ["list", [
        "**Letter shift:** every letter moves forward or backward by the same number of places.",
        "**Opposite letters:** A ↔ Z, B ↔ Y, C ↔ X … (positions add up to 27).",
        "**Position sum and number codes:** letters are replaced by (or added up as) their positions.",
        "**Substitution:** common names are swapped: “if sky is called blue, blue is called red …”.",
        "**Sentence tables:** several coded sentences share words. Match the common word to its common code.",
        "**Mixed operations:** two steps such as swapping halves and then shifting.",
        "**Symbol codes:** letters are replaced by symbols; find each symbol from the words they share."
      ]],

      ["h2", "Rules"],
      ["formulas", [
        ["Letter shift", "code = position ± k (wrap at Z / A)", "CAT → ECV is +2 for every letter"],
        ["Opposite letter", "code = 27 − position", "A (1) ↔ Z (26), M (13) ↔ N (14)"],
        ["Position sum", "value = sum of letter positions", "DOG = 4 + 15 + 7 = 26"],
        ["Number code", "write each letter as its position", "CAB = 3 1 2"],
        ["Substitution", "follow the chain of renamings", "Answer is the NEW name of the real object"],
        ["Sentence table", "common word in two sentences = common code in both", "Then use the remaining words to find the rest"],
        ["Mixed", "do the steps in the stated order", "A step that depends on position (odd places +2, even places −1) gives a different result before and after a reverse"]
      ]],

      ["h2", "Shortcuts"],
      ["h", "Opposite letters (positions add up to 27)"],
      ["table", ["A ↔ Z", "B ↔ Y", "C ↔ X", "D ↔ W", "E ↔ V", "F ↔ U", "G ↔ T"], [["1 + 26", "2 + 25", "3 + 24", "4 + 23", "5 + 22", "6 + 21", "7 + 20"]]],
      ["table", ["H ↔ S", "I ↔ R", "J ↔ Q", "K ↔ P", "L ↔ O", "M ↔ N"], [["8 + 19", "9 + 18", "10 + 17", "11 + 16", "12 + 15", "13 + 14"]]],
      ["list", [
        "**Always check first and last letters of the example.** If both moved by the same amount, it is a shift. If one moved forward and one back, try opposite letters or alternating shifts.",
        "**EJOTY anchors:** E = 5, J = 10, O = 15, T = 20, Y = 25. Count from the nearest one.",
        "**Opposite letters in your head:** M ↔ N is the middle. For C go two steps in from A/Z: C ↔ X. Or subtract from 27.",
        "**Write the shift under each letter** (for example +2, +2, +2). If it changes, the rule is alternating or growing.",
        "**Sentence tables:** the common word is the quickest anchor. Underline it in both sentences and in both codes.",
        "**Substitution:** write each new name beside the original as a chain, then find the real object and read off its new name."
      ]],
      ["warn", "In substitution questions, answer with the **new name** of the real object, not the real object itself. “Sky is blue” is a fact, but the answer uses the coded name of blue."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/coding-decoding/letter-shift", title: "Letter shift",
        spot: "“SHARE is written as UJCTG. How is TRAIN written?” Every letter moves the same number of places.",
        method: ["Compare the first letter of the word with the first letter of the code to get the shift.", "Check it on a second letter.", "Apply the same shift to every letter of the new word, wrapping round after Z."],
        ex: { q: "In a code, SHARE is written as UJCTG. How is TRAIN written?", steps: ["S → U is +2; H → J is +2; so the rule is +2", "T → V, R → T, A → C, I → K, N → P"], ans: "VTCKP" },
        shortcut: "Write the shift above each letter. If it is +2 every time, do the whole new word in one pass."
      }],
      ["pattern", {
        key: "reasoning/coding-decoding/reverse-opposite-letters", title: "Reverse / opposite letters (A↔Z)",
        spot: "The first letter of the code is far from the first letter of the word, and the second letter moves the other way: the alphabet has been reversed.",
        method: ["Test the first letter: if A becomes Z and B becomes Y, the rule is “opposite letter”.", "Opposite of position p is 27 − p.", "Replace every letter by its opposite."],
        ex: { q: "In a code, MIND is written as NRMW. How is FACE written?", steps: ["M (13) → N (14): 13 + 14 = 27, so the rule is opposite letters", "F (6) → 27 − 6 = 21 = U", "A → Z, C (3) → 24 = X, E (5) → 22 = V"], ans: "UZXV" },
        shortcut: "Pair up the alphabet in your head: A-Z, B-Y, … M-N. The two letters in a pair always add up to 27."
      }],
      ["pattern", {
        key: "reasoning/coding-decoding/position-sum-and-number-codes", title: "Position-sum & number codes",
        spot: "The code is a number: “DOG is written as 26” (4 + 15 + 7) or “CAB is written as 312”.",
        method: ["Write down each letter's position.", "Check whether the code adds them (sum) or just lists them (number code).", "Apply the same operation to the new word."],
        ex: { q: "In a code, DOG is written as 26. How is LAKE written?", steps: ["Check: D + O + G = 4 + 15 + 7 = 26, so the code is the sum of positions", "L + A + K + E = 12 + 1 + 11 + 5"], ans: "29" },
        shortcut: "Test the sum on the example before using it. If it does not match, try the product, or positions written side by side."
      }],
      ["pattern", {
        key: "reasoning/coding-decoding/substitution", title: "Substitution (\"sky is called blue\")",
        spot: "A chain of renamings: “red is called blue, blue is called green, green is called yellow”. A question asks for the coloured thing's new name.",
        method: ["Write each rule as an arrow: red → blue, blue → green, green → yellow.", "Find the real object from everyday knowledge (the sky is blue).", "Read off the new name for that real colour and stop. Do not follow the chain again."],
        ex: { q: "If red is called blue, blue is called green and green is called yellow, what is the colour of the sky called?", steps: ["The sky is really blue", "Blue is called green"], ans: "Green" },
        shortcut: "Take exactly one step along the arrows from the real colour. Chains are traps, one hop is the answer."
      }],
      ["pattern", {
        key: "reasoning/coding-decoding/sentence-code-tables", title: "Sentence → code tables",
        spot: "Three coded sentences share words, like “we eat rice = ga lo pu”, and you must find one word's code.",
        method: ["Find a word that appears in two sentences and a code that appears in the matching two codes.", "That word and that code are partners.", "Repeat with the other pairs; the leftover word in each sentence gets the leftover code."],
        ex: { q: "“we eat rice” = ga lo pu; “rice is good” = pu ne ki; “we are good” = ga ta ki. What is the code for “eat”?", steps: ["Common word in sentences 1 and 2 is rice, common code is pu, so rice = pu", "Common in 1 and 3 is we, common code is ga, so we = ga", "Sentence 1 has left only eat and lo, so eat = lo"], ans: "lo" },
        shortcut: "The order of code words need not match the order of sentence words, so match by common elements, not by position."
      }],
      ["pattern", {
        key: "reasoning/coding-decoding/mixed-operations", title: "Mixed operations (swap halves, reverse then shift: TCS-style)",
        spot: "The text says “first do this, then do that”: swap halves, reverse, then shift. Two or more steps in order.",
        method: ["Write the original word.", "Apply the first operation and write the intermediate result.", "Apply the second operation to that result, and check the length is unchanged."],
        ex: { q: "In a code, the two halves of a word are swapped and then each letter is moved one step forward. How is PLANET written?", steps: ["Halves: PLA | NET, swapped: NETPLA", "Shift each letter +1: N → O, E → F, T → U, P → Q, L → M, A → B"], ans: "OFUQMB" },
        shortcut: "Write the intermediate word on its own line. Doing both steps in your head is where most mistakes happen."
      }],
      ["pattern", {
        key: "reasoning/coding-decoding/symbol-codes", title: "Symbol codes",
        spot: "Letters are replaced by symbols: “MOST = #@%&, SHOT = %$@&”. Find the symbol for each letter.",
        method: ["Find the letters shared by the two words and the symbols shared by the two codes.", "Use position in the word to match them (a letter at the end of both words gives the last symbol of both codes).", "The unmatched letters get the unmatched symbols."],
        ex: { q: "In a code, MOST = # @ % & and SHOT = % $ @ &. How is MOTH written?", steps: ["T is last in both words and & is last in both codes, so T = &", "S is third in MOST and first in SHOT, % matches that, so S = %; then O = @", "The unmatched letters M and H take # and $, so M = # and H = $", "MOTH = M O T H"], ans: "# @ & $" },
        shortcut: "List each letter once with its symbol as you find it. Never re-derive a symbol you have already pinned down."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Different shift for different letters:** check at least two letters; some codes alternate +2, −1, +2, −1.",
        "**Forgetting to wrap:** Y + 3 is B, not a symbol past Z.",
        "**Opposite letters vs shift:** a letter far away from its code is probably the reverse alphabet, not a big shift.",
        "**Answering with the real colour** in a substitution question, instead of its new name.",
        "**Following the chain twice:** one hop from the real object, not two.",
        "**Mixed operations in the wrong order:** if one step depends on position (odd places +2, even places −1), doing it before or after a reverse or a swap gives different words. Follow the order in the question.",
        "**Sentence tables:** codes are often shuffled; match by common words, not by position."
      ]],
      ["note", "Check your final answer by decoding it backwards. If the code does not turn back into the original word, there is a slip."],

      ["h2", "Quick check"],
      ["quiz", ["coding-decoding-01", "coding-decoding-02", "coding-decoding-04", "coding-decoding-05", "coding-decoding-06"]]
    ]
  });

  /* ================================================================================ ALPHABET TEST */
  LEARN.reasoning.push({
    id: "alphabet-test", group: "Patterns & codes", title: "Alphabet test",
    sub: "Positions, gaps, dictionary order and words made from letters: all of it is counting on a line of 26",
    tags: ["TCS", "Infosys", "Wipro", "Cognizant", "AMCAT", "eLitmus"],
    blocks: [
      ["h2", "The idea"],
      ["p", "The alphabet is a line of 26 letters, numbered 1 to 26. Alphabet-test questions ask you to move along that line (“7th to the left of M”), count between letters, put words in dictionary order, or check whether a word can be built from another word's letters."],
      ["p", "Once you treat letters as numbers, nearly everything becomes subtraction. “Left” means a smaller number, “right” means a larger number, and “from the right end” means 27 minus the normal position."],
      ["list", [
        "**Letter positions:** move left or right, count between, or work from the left or the right end.",
        "**Dictionary order:** compare words letter by letter from the left; the first difference decides.",
        "**Words from the letters of a word:** each letter can be used only as many times as it appears in the given word."
      ]],

      ["h2", "Rules"],
      ["formulas", [
        ["Position", "A = 1 … Z = 26", "Learn the table below, especially E, J, O, T, Y"],
        ["From the right end", "position from right = 27 − position from left", "H is 8th from the left and 19th from the right"],
        ["Moving", "x places to the right of p: p + x; to the left: p − x", "7th to the left of M: 13 − 7 = 6 = F"],
        ["Letters between", "|p − q| − 1", "Between D (4) and K (11): 11 − 4 − 1 = 6"],
        ["Letters in the span", "|p − q| + 1", "D to K inclusive is 8 letters"],
        ["Dictionary order", "compare 1st letters, then 2nd, then 3rd …", "A shorter word that is a prefix comes first: CHAIN before CHAINS"],
        ["Anagram rank", "sum of (smaller unused letters × (letters left)!) + 1", "TEAR: 3 × 3! + 1 × 2! + 1 = 21"],
        ["Building words", "each letter count in the new word ≤ count in the given word", "NATION needs two N"]
      ]],

      ["h2", "Shortcuts"],
      ["h", "Letter positions"],
      ["table", ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"], [["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"]]],
      ["table", ["N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], [["14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26"]]],
      ["list", [
        "**EJOTY** (E 5, J 10, O 15, T 20, Y 25) are your anchors. Reach any letter from the nearest one.",
        "**Counting from the right end** is simply 27 minus the usual number. 8th from the right is 27 − 8 = 19 = S.",
        "**Mirror pairs:** the letter k-th from the left and the letter k-th from the right add to 27 (A ↔ Z, M ↔ N).",
        "**Dictionary order:** sort by the first letter, then break ties with the second, and so on.",
        "**Words from a word:** make a letter count (tally) of the given word and tick off letters as you use them.",
        "**Rank of a word among its rearrangements:** for each position, count the smaller letters not yet used and multiply by the factorial of the places that remain."
      ]],
      ["table", ["n", "1", "2", "3", "4", "5", "6"], [["n!", "1", "2", "6", "24", "120", "720"]]],
      ["tip", "“Between” never includes the two end letters. “From D to K” does. Check the exact words before you subtract."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/alphabet-test/letter-positions", title: "Letter positions",
        spot: "“Which letter is the 5th to the left of the 8th letter from the right end?”, “how many letters between G and T?”, “mirror letter”.",
        method: ["Translate each described letter into a number (use 27 minus the position when counting from the right).", "Move left (subtract) or right (add).", "Turn the final number back into a letter."],
        ex: { q: "Which letter is the 5th to the left of the 8th letter from the right end of the English alphabet?", steps: ["8th from the right end = 27 − 8 = 19, which is S", "5th to the left of S = 19 − 5 = 14", "14 is N"], ans: "N" },
        shortcut: "Work out the starting letter first and write it down. Then do just one move at a time."
      }],
      ["pattern", {
        key: "reasoning/alphabet-test/dictionary-order", title: "Dictionary order",
        spot: "“Arrange the words in dictionary order. Which is second?” or “arrange the letters of a word alphabetically”.",
        method: ["Compare the first letters. If they match, compare the second letters, and so on.", "Write the words in order on one line.", "Pick the position the question asks for (and watch for “from the right”)."],
        ex: { q: "Arrange CHAIR, CHAIN, CHART, CHASE in dictionary order. Which comes second?", steps: ["All start with CHA; the fourth letters are I, I, R, S (CHAIR, CHAIN, CHART, CHASE)", "CHAIR and CHAIN tie at I, so compare the last letters: N before R", "Order: CHAIN, CHAIR, CHART, CHASE"], ans: "CHAIR" },
        shortcut: "To rank a word among its rearrangements (say TEAR, letters A, E, R, T): T has 3 smaller letters, 3 × 3! = 18; E has 1 smaller, 1 × 2! = 2; A and R add 0. Rank = 18 + 2 + 1 = 21."
      }],
      ["pattern", {
        key: "reasoning/alphabet-test/words-from-the-letters-of", title: "Words from the letters of a word",
        spot: "“Which of these words can (or cannot) be formed from the letters of STATIONARY?”",
        method: ["Tally the given word: how many of each letter.", "Tally each option the same way.", "An option fails if it needs a letter that is missing or more copies than the given word has."],
        ex: { q: "Which of STATION, TOASTY, NATION cannot be formed from the letters of STATIONARY?", steps: ["Tally of STATIONARY: S 1, T 2, A 2, I 1, O 1, N 1, R 1, Y 1", "STATION needs S, T×2, A, I, O, N: fine", "TOASTY needs T×2, O, A, S, Y: fine", "NATION needs N twice but STATIONARY has only one N"], ans: "NATION" },
        shortcut: "Look first for a letter that is missing, then for a doubled letter. These two checks catch almost every failure."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Between vs inclusive:** between D and K is 6 letters; D to K inclusive is 8.",
        "**Left means smaller:** the 4th to the left of H is D, not L.",
        "**Right end confusion:** the 8th from the right is not letter 8 but 27 − 8 = 19 (S).",
        "**Doubled letters in a word:** STATIONARY has two T and two A. Count them, do not just look for the letter.",
        "**Dictionary ties:** if the first letters tie, go to the second. If a word is a prefix of another, the shorter one comes first.",
        "**Rearranged letters:** when you sort the letters of a word with repeats, keep every copy."
      ]],
      ["warn", "In “same position” questions, compare each letter's place in the original word with its place in the rearranged word. Do not compare letter values."],

      ["h2", "Quick check"],
      ["quiz", ["alphabet-test-01", "alphabet-test-02", "alphabet-test-03", "alphabet-test-06", "alphabet-test-10"]]
    ]
  });

  /* ================================================================================ BLOOD RELATIONS */
  LEARN.reasoning.push({
    id: "blood-relations", group: "Relations & directions", title: "Blood relations",
    sub: "Draw the family tree once and every “how is A related to B” question answers itself",
    tags: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "AMCAT", "eLitmus"],
    blocks: [
      ["h2", "The idea"],
      ["p", "A blood-relation question describes a family in words and asks how two people are related. Reading it as a sentence is slow and error-prone. **Drawing the tree** is fast and nearly impossible to get wrong."],
      ["p", "Use one notation always: a **square (or +)** for a male, a **circle (or −)** for a female, a double line (=) for marriage, a vertical line for parent to child and a bar across for siblings. When the gender is not known, mark it “?”."],
      ["html", TREE],
      ["list", [
        "**Direct relations:** one hop or two, such as “my mother's brother's son”.",
        "**Pointing to a photo:** the speaker describes the person in the photograph through his or her own relatives.",
        "**Family puzzles:** several people are described, and you must place each one.",
        "**Coded symbols:** A + B or A − B stand for relationships; you decode them left to right.",
        "**Generation chains:** a long line of “is the father of”, “is the sister of”."
      ]],

      ["h2", "Rules"],
      ["table", ["In words", "Relation"], [
        ["Father's or mother's father", "Grandfather"],
        ["Father's or mother's mother", "Grandmother"],
        ["Father's or mother's brother", "Uncle (paternal or maternal)"],
        ["Father's or mother's sister", "Aunt"],
        ["Uncle's or aunt's son or daughter", "Cousin"],
        ["Brother's or sister's son", "Nephew"],
        ["Brother's or sister's daughter", "Niece"],
        ["Husband's or wife's brother; sister's husband", "Brother-in-law"],
        ["Husband's or wife's sister; brother's wife", "Sister-in-law"],
        ["Husband's or wife's father or mother", "Father-in-law or mother-in-law"],
        ["Son's wife", "Daughter-in-law"],
        ["Daughter's husband", "Son-in-law"],
        ["My mother's (or father's) only son", "Me, if I am male"]
      ]],
      ["formulas", [
        ["Parent's parent", "grandfather / grandmother", "Two generations up"],
        ["Sibling's child", "nephew / niece", "One generation down"],
        ["Parent's sibling", "uncle / aunt", "One generation up"],
        ["Cousin", "child of your uncle or aunt", "Same generation as you"],
        ["Symbols", "A + B, A − B …", "Read the key given in the question, left to right, one link at a time"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Start from the person the sentence starts with** and extend the tree from there. Write the gender sign as soon as it is known (father +, sister −).",
        "**“Only” is a clue:** “my mother's only son” means me (if I am male) because I am a son of my mother and there is no other. “Only daughter” works the same way.",
        "**“Mother's mother's only daughter”** is the mother herself. “Father's only brother” is a different man: the uncle.",
        "**Spouse rule:** the husband of my mother is my father, and the wife of my father is my mother.",
        "**Gender is not always fixed:** “cousin”, “sibling”, “parent”, “child” are gender-neutral. Do not guess a gender the question has not given.",
        "**Count generations:** go up for parents, same level for siblings and cousins, down for children. Match the answer to the right generation."
      ]],
      ["tip", "When a chain is long, collapse it step by step: “A is the father of B, B is the brother of C” becomes “A is the father of C” because B and C share parents. Say each simplified fact out loud as you go."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/blood-relations/direct-relations", title: "Direct relations",
        spot: "A single sentence in which the speaker names relations: “Anil's father's mother's only son's wife is related to Anil as …?”",
        method: ["Start with the speaker or the named person and walk one relation at a time.", "Replace each step by its simple relation (father's mother = grandmother).", "Use the “only” clue to identify exactly who is described."],
        ex: { q: "How is Anil's father's mother's only son's wife related to Anil?", steps: ["Father's mother is Anil's grandmother", "Her only son: Anil's father (he must be that son)", "His wife is Anil's mother"], ans: "Mother" },
        shortcut: "Watch for “only son” and “only daughter”. Often they point straight back to a person already on your tree."
      }],
      ["pattern", {
        key: "reasoning/blood-relations/pointing-to-a-photo", title: "\"Pointing to a photo\"",
        spot: "“Pointing to a woman in a photo, Raju says: ‘Her husband is the only son of my mother-in-law.’ How is the woman related to Raju?”",
        method: ["Place the speaker on the tree first.", "Place the person he describes, link by link, ignoring the photograph itself.", "Finally relate the pointed-at person to the speaker."],
        ex: { q: "Pointing to a woman, Raju says, “Her husband is the only son of my mother-in-law.” How is the woman related to Raju?", steps: ["Raju's mother-in-law is the mother of Raju's wife", "Her only son is the brother of Raju's wife, so he is Raju's brother-in-law", "The woman is that man's wife, so she is the wife of Raju's brother-in-law, that is, Raju's sister-in-law"], ans: "Sister-in-law" },
        shortcut: "The words “pointing to”, “in the photograph” and “this man” are just decoration. Treat the sentence like any other relation chain."
      }],
      ["pattern", {
        key: "reasoning/blood-relations/family-puzzles", title: "Family puzzles",
        spot: "Several people and statements: “A is the father of B. B is the brother of C. D is the mother of A. E is the brother of A. How is E related to C?”",
        method: ["Put the oldest person at the top of the page.", "Add each statement as a line or a bar, with gender signs as you learn them.", "When all lines are drawn, read the answer off the tree."],
        ex: { q: "A is the father of B. B is the brother of C. D is the mother of A. E is the brother of A. How is E related to C?", steps: ["D (−) is the mother of A (+) and E (+): A and E are brothers", "A is the father of B and, as B and C are siblings, of C as well", "E is the brother of C's father, so E is C's uncle"], ans: "Uncle (father's brother)" },
        shortcut: "Draw the generation rows first (grandparents, parents, children) and place each person on a row. The relation is then a matter of reading across rows."
      }],
      ["pattern", {
        key: "reasoning/blood-relations/coded-symbols", title: "Coded symbols (A + B means…)",
        spot: "A key is given: “P + Q means P is the mother of Q, P − Q means P is the brother of Q, P × Q means P is the father of Q.” Then an expression such as A × B − C + D.",
        method: ["Write the key out in a small table.", "Read the expression left to right, one pair at a time, and draw each link.", "Combine the links to get the relation between the first and last person."],
        ex: { q: "With the key above, how is A related to D in A × B − C + D?", steps: ["A × B: A is the father of B", "B − C: B is the brother of C, so A is also the father of C", "C + D: C is the mother of D", "A is the father of D's mother, that is, the maternal grandfather of D"], ans: "Maternal grandfather" },
        shortcut: "Each symbol is a short sentence. Translate every symbol into words before you draw anything."
      }],
      ["pattern", {
        key: "reasoning/blood-relations/generation-chains", title: "Generation chains",
        spot: "A string of “is the … of” statements, each linking only to the previous person: “A is the mother of B. B is the brother of C. C is the father of D. D is the sister of E.”",
        method: ["Simplify each pair: siblings share parents.", "Count generations: up for parents, down for children, level for siblings.", "State the relation of the first person to the last using that count."],
        ex: { q: "A is the mother of B. B is the brother of C. C is the father of D. D is the sister of E. How is A related to E?", steps: ["A is the mother of B, and B is the brother of C, so A is also the mother of C", "C is the father of D, and D is the sister of E, so C is also the father of E", "A is the mother of E's father: E's paternal grandmother"], ans: "Grandmother (father's mother)" },
        shortcut: "After every line, rewrite the first person's link to the newest person. Keep a running total in one short sentence."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**“Only son” can be yourself:** my mother's only son is me, not a brother.",
        "**Assuming gender:** “cousin”, “sibling” and “child” do not tell the gender. Do not choose a gendered answer unless the question allows it.",
        "**Maternal vs paternal:** mother's brother and father's brother are both uncles but are different people.",
        "**Skipping the spouse:** the husband of my mother is my father. This closes many chains.",
        "**Misreading the key:** in a symbol question, use the key given, not the usual meanings.",
        "**Wrong generation:** nephew and uncle are one generation apart. Check that your answer is on the right row."
      ]],
      ["warn", "Take “He is the son of my mother's only daughter.” If the speaker is a woman, her mother's only daughter is herself, so the man is her son. If the speaker is a man, it is his sister, so the man is his nephew. The speaker's gender changes the answer, so check it."],

      ["h2", "Quick check"],
      ["quiz", ["blood-relations-01", "blood-relations-03", "blood-relations-05", "blood-relations-08", "blood-relations-10"]]
    ]
  });

  /* ================================================================================ DIRECTION SENSE */
  LEARN.reasoning.push({
    id: "direction-sense", group: "Relations & directions", title: "Direction sense",
    sub: "Turns, distances, shadows and renamed compass points: all solved by a quick sketch",
    tags: ["TCS", "Infosys", "Wipro", "Capgemini", "Cognizant", "AMCAT"],
    blocks: [
      ["h2", "The idea"],
      ["p", "In a direction question a person walks and turns. You are asked which way they now face, how far they are from the start, or which direction they started in. Always draw it: **North is up, East is right**. A quick sketch removes almost every mistake."],
      ["p", "There are four patterns: final direction after a series of turns, straight-line distance from the start (right-angled triangles), shadows at sunrise or sunset, and codes in which the compass names are swapped."],
      ["html", COMPASS],
      ["list", [
        "**Right** turn = clockwise (adds degrees). **Left** turn = anticlockwise (subtracts).",
        "**Facing North:** right is East, left is West. **Facing East:** right is South, left is North. And so on round the compass.",
        "**Displacement** is the straight line from start to end, not the distance walked."
      ]],

      ["h2", "Rules"],
      ["formulas", [
        ["Compass in degrees", "N 0°, NE 45°, E 90°, SE 135°, S 180°, SW 225°, W 270°, NW 315°", "Turn right: add. Turn left: subtract. Subtract or add 360 to stay in 0 to 359"],
        ["Net movement", "East − West, North − South", "Add opposites with signs and the walk collapses to two numbers"],
        ["Distance from start", "d = √(x² + y²)", "x = net East-West, y = net North-South"],
        ["Pythagorean triples", "3-4-5, 5-12-13, 8-15-17, 7-24-25", "Multiples count too (6-8-10, 9-12-15, 15-20-25)"],
        ["Shadow at sunrise", "falls to the West", "The Sun is in the East, so the shadow points opposite"],
        ["Shadow at sunset", "falls to the East", "The Sun is in the West"],
        ["Coded directions", "write the rename table: real → name", "Move in real directions, then answer in the new names"]
      ]],
      ["table", ["Time of day", "Sun is in the", "Shadow falls to the", "If you face the Sun, your shadow is"], [
        ["Sunrise / morning", "East", "West", "behind you"],
        ["Sunset / evening", "West", "East", "behind you"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Use degrees for turns:** N = 0 and add 45 for each step clockwise. Five turns become one addition mod 360.",
        "**Collapse the walk:** East and West cancel, North and South cancel. What is left is two numbers and one triangle.",
        "**Spot the triple:** 5 and 12 means 13, 8 and 15 means 17, 3 and 4 means 5. No square roots needed.",
        "**Shadow rule:** in the morning your shadow falls West. If you face the Sun in the morning you face East and the shadow is behind you.",
        "**Facing and shadow:** at sunrise, facing North puts the shadow on your left; facing South puts it on your right. In the evening it swaps.",
        "**Coded directions:** make a two-column table (real, called). Convert the walk to real directions, do the question, then convert the answer back."
      ]],
      ["html", PATH],
      ["tip", "When a walk loops back, check the order: “turns right” is relative to the way the person is currently facing, not to North."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/direction-sense/final-direction-after-turns", title: "Final direction after turns",
        spot: "“A man faces North-East, turns 135° clockwise and then 90° anticlockwise. Which way is he facing?”",
        method: ["Put the starting direction in degrees (N 0, NE 45, E 90 …).", "Add for clockwise (right) turns, subtract for anticlockwise (left) turns.", "Reduce to 0 to 359 and read the direction off the compass."],
        ex: { q: "A man faces North-East, turns 135° clockwise and then 90° anticlockwise. Which direction does he face now?", steps: ["North-East = 45°", "45° + 135° = 180°", "180° − 90° = 90°, which is East"], ans: "East" },
        shortcut: "Add all the clockwise turns, subtract all the anticlockwise ones, and do it once: 45 + 135 − 90 = 90."
      }],
      ["pattern", {
        key: "reasoning/direction-sense/distance-and-direction-from-start", title: "Distance & direction from start (Pythagoras)",
        spot: "“Asha walks 15 km East, 9 km North, 3 km West and 4 km South. How far and in which direction is she from the start?”",
        method: ["Add the East-West legs with signs (East +, West −) to get x.", "Add the North-South legs (North +, South −) to get y.", "Distance = √(x² + y²); the direction is the quadrant of (x, y)."],
        ex: { q: "Asha walks 15 km East, 9 km North, 3 km West and 4 km South. How far is she from where she started?", steps: ["x = 15 − 3 = 12 km East", "y = 9 − 4 = 5 km North", "d = √(12² + 5²) = √169 = 13 km, towards the North-East"], ans: "13 km, to the North-East of the start" },
        shortcut: "Recognise 5-12-13 (also 3-4-5, 8-15-17, 7-24-25). If x and y match a triple, the answer drops out without a root."
      }],
      ["pattern", {
        key: "reasoning/direction-sense/shadows-at-sunrise-sunset", title: "Shadows at sunrise / sunset",
        spot: "“At sunset, Ravi's shadow falls to his right. Which direction is he facing?” The time of day fixes the shadow's direction.",
        method: ["Sunrise: Sun in the East, shadow falls West. Sunset: Sun in the West, shadow falls East.", "Say which compass point is on the person's right (or left, front, back).", "Turn that around to find the direction the person faces."],
        ex: { q: "At sunset, Ravi's shadow falls to his right. Which direction is he facing?", steps: ["At sunset the Sun is in the West, so the shadow falls to the East", "His right is East; when you face North, East is on your right", "Check: facing North, right = East"], ans: "North" },
        shortcut: "Write the shadow direction (West morning, East evening) and ask “which way do I face so this is on my right (or left)?” Facing North: right = East, left = West."
      }],
      ["pattern", {
        key: "reasoning/direction-sense/coded-directions", title: "Coded directions",
        spot: "“North is called West, West is called South, South is called East and East is called North.” followed by a walk described in the new names.",
        method: ["Write the table: real direction → name given.", "Turn the named direction into the real one (find the name in the right-hand column).", "Move or turn in real terms, then convert the final real direction to its name."],
        ex: { q: "In a code, North is called West, West is called South, South is called East and East is called North. Rani walks towards what is called ‘North’ and then turns left. Which direction does she now face, in the code's names?", steps: ["The direction called North is really East (East is called North)", "Walking East, a left turn makes her face North (real)", "Real North is called West"], ans: "West" },
        shortcut: "Keep two columns on paper. Real turns happen in the real column; names are only for the start and the end."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Left and right swap with the facing direction:** facing South, your right is West, not East.",
        "**Distance walked vs distance from start:** displacement is the straight line, not the total.",
        "**Forgetting the shadow's side:** the shadow is opposite the Sun. Morning: West. Evening: East.",
        "**Turning relative to North:** a right turn is always relative to the current heading.",
        "**Coded directions:** apply real moves in real directions. Convert names at the start and end only.",
        "**Missing the triple:** if x = 12 and y = 5, the answer is exactly 13. A decimal means you added something wrong."
      ]],
      ["warn", "Sketch every direction question even if it looks easy. A tiny N arrow and the first leg of the walk are enough to prevent a left-right mistake."],

      ["h2", "Quick check"],
      ["quiz", ["direction-sense-01", "direction-sense-03", "direction-sense-04", "direction-sense-05", "direction-sense-07"]]
    ]
  });
})();

/* ---------- Briefs ---------- */
BRIEFS["reasoning:series"] = "A series is a row of letters or numbers built by one hidden rule. Turn every letter into its position (A = 1 … Z = 26), write the gaps underneath, and the rule usually appears: a constant step, a step that grows, or two series woven together.\n\nLearn the position table and the EJOTY anchors (5, 10, 15, 20, 25), remember that the alphabet wraps after Z, and test your rule on every term before you pick an answer. The four patterns here cover letter series, alphanumeric terms, letter clusters and repeating blocks.";
BRIEFS["reasoning:analogies"] = "An analogy A : B :: C : ? asks you to find the link between the first pair and rebuild it from the third item. Say the link in one plain sentence (tool and use, worker and tool, part and whole) and test it on the first pair before you apply it.\n\nFor numbers, test squares, cubes, n² ± 1 and n(n + 1) in order. For letters, compare each letter's movement and apply the same shift to the new group. For words, cross out options from the wrong category first.";
BRIEFS["reasoning:classification"] = "Classification asks for the odd one out: three items share a property and one does not. The right property always splits the group exactly three to one, so if two items have it, look for a different property.\n\nFor numbers, test odd or even, prime, square, cube and multiples. For letter groups, write the positions and compare the gaps. For words, name the category that holds three of them and find the one that does not fit.";
BRIEFS["reasoning:coding-decoding"] = "A coding question hides one rule in an example. Compare the first and last letter of the word with its code to see whether the letters shifted by a fixed step, flipped to the opposite end of the alphabet (A ↔ Z, positions add up to 27), or were replaced by their positions.\n\nSubstitution, sentence-code tables and symbol codes are solved by matching the shared parts of the examples, and mixed codes by doing each step in order on its own line. Check your answer by decoding it back.";
BRIEFS["reasoning:alphabet-test"] = "The alphabet is a line of 26 numbered letters, so most alphabet-test questions are subtraction. Moving left subtracts, moving right adds, counting from the right end uses 27 minus the position, and the letters between two positions number |p − q| − 1.\n\nFor dictionary order, compare letter by letter from the left. For words built from another word's letters, tally each letter and make sure no letter is used more times than it appears.";
BRIEFS["reasoning:blood-relations"] = "Blood-relation questions are best solved by drawing a small family tree: square or + for male, circle or − for female, a vertical line for parent and child, a bar for siblings. Start from the person the sentence starts with, and write each gender as soon as it is known.\n\nWatch for the word “only” (my mother's only son is me), do not guess genders the question has not given, and for symbol questions translate each symbol into words using the key in the question.";
BRIEFS["reasoning:direction-sense"] = "Direction questions are solved with a sketch: North up, East right. A right turn goes clockwise and adds degrees (N 0, E 90, S 180, W 270), a left turn goes anticlockwise and subtracts. For distance, add East minus West and North minus South and use Pythagoras; look for the triples 3-4-5, 5-12-13 and 8-15-17.\n\nShadows fall West in the morning and East in the evening, and in coded directions you move in the real directions and only convert the names at the start and the end.";
