/* Learn pages for Logical Reasoning, part 2: order & ranking, seating arrangement, puzzles, input-output machine. */
window.LEARN = window.LEARN || {}; LEARN.reasoning = LEARN.reasoning || []; window.BRIEFS = window.BRIEFS || {};
(function () {
  /* ---------- small inline diagrams (stroke / fill use currentColor so they follow the theme) ---------- */
  function wrapSvg(vb, label, body, cap, maxw) {
    return '<div class="diagram"><svg viewBox="' + vb + '" role="img" aria-label="' + label + '" style="max-width:' + (maxw || 420) + 'px;width:100%;height:auto" font-size="13" text-anchor="middle">' + body + '</svg><div class="cap">' + cap + '</div></div>';
  }
  function box(x, y, w, h, t, o) {
    o = o || {};
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" stroke="currentColor" stroke-width="' + (o.bold ? 2.5 : 1.5) + '" fill="' + (o.fill ? 'currentColor' : 'none') + '"' + (o.fill ? ' fill-opacity="0.14"' : '') + '/>' +
      (t === '' ? '' : '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 4.5) + '" fill="currentColor" font-weight="' + (o.bold ? 700 : 400) + '"' + (o.fs ? ' font-size="' + o.fs + '"' : '') + '>' + t + '</text>');
  }
  function txt(x, y, t, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="currentColor"' + (o.fs ? ' font-size="' + o.fs + '"' : '') + (o.b ? ' font-weight="700"' : '') + (o.op ? ' opacity="' + o.op + '"' : '') + (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') + '>' + t + '</text>';
  }
  function line(a, b, c, d, o) {
    o = o || {};
    return '<line x1="' + a + '" y1="' + b + '" x2="' + c + '" y2="' + d + '" stroke="currentColor" stroke-width="' + (o.w || 1.5) + '"' + (o.dash ? ' stroke-dasharray="5 4"' : '') + (o.op ? ' opacity="' + o.op + '"' : '') + ' fill="none"/>';
  }

  /* Rank from both ends: 9 boxes, X is 4th from the left and 6th from the right. */
  var RANKBAR = (function () {
    var s = '', i, x0 = 20, w = 40, g = 2;
    for (i = 0; i < 9; i++) s += box(x0 + i * (w + g), 70, w, 40, i === 3 ? 'X' : '', { bold: i === 3, fill: i === 3 });
    // left bracket 1..4 and right bracket 4..9
    s += line(x0, 54, x0 + 4 * (w + g) - g, 54, { w: 2 }) + line(x0, 54, x0, 64, { w: 2 }) + line(x0 + 4 * (w + g) - g, 54, x0 + 4 * (w + g) - g, 64, { w: 2 });
    s += txt(x0 + 2 * (w + g) - 1, 44, '4th from the left', { b: 1 });
    var rx = x0 + 3 * (w + g);
    s += line(rx, 126, x0 + 9 * (w + g) - g, 126, { w: 2 }) + line(rx, 116, rx, 126, { w: 2 }) + line(x0 + 9 * (w + g) - g, 116, x0 + 9 * (w + g) - g, 126, { w: 2 });
    s += txt(rx + 3 * (w + g), 148, '6th from the right', { b: 1 });
    s += txt(210, 178, '4 + 6 = 10, but X was counted twice, so 9 people in all', { fs: 12, op: 0.85 });
    return wrapSvg('0 0 400 190', 'A row of nine people, X is fourth from the left and sixth from the right', s, 'Rank from one end + rank from the other end counts the person in question twice. Total = sum − 1.');
  })();

  /* Mixed-facing row: D B A C E ; A, B, E face north; C, D face south. */
  var MIXROW = (function () {
    var names = ['D', 'B', 'A', 'C', 'E'], face = [0, 1, 1, 0, 1], s = '', i, x0 = 30, w = 56;
    for (i = 0; i < 5; i++) {
      s += box(x0 + i * (w + 8), 78, w, 44, names[i], { bold: true });
      s += txt(x0 + i * (w + 8) + w / 2, face[i] ? 66 : 142, face[i] ? '↑ faces N' : '↓ faces S', { fs: 11, op: 0.85 });
    }
    s += txt(24, 26, 'Reader’s left', { fs: 12, anchor: 'start', op: 0.8 });
    s += txt(396, 26, 'Reader’s right', { fs: 12, anchor: 'end', op: 0.8 });
    s += line(24, 34, 396, 34, { op: 0.35 });
    s += txt(210, 168, 'C faces south, so C’s left is the reader’s right.', { fs: 12, op: 0.85 });
    s += txt(210, 186, 'E is on C’s left: the seat to C’s right on the page.', { fs: 12, op: 0.85 });
    return wrapSvg('0 0 420 198', 'A row of five people, some facing north and some facing south', s, 'In a mixed-facing row, a person facing south has their left and right swapped compared with the page. Always ask: which way is THAT person facing?');
  })();

  /* Circle facing the centre, six seats clockwise from the top. */
  var CIRCLE = (function () {
    var cx = 170, cy = 122, R = 84, s = '', i, a, x, y;
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R - 18) + '" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.4"/>';
    var names = ['A', 'F', 'E', 'C', 'B', 'D'];
    for (i = 0; i < 6; i++) {
      a = i * Math.PI / 3; x = cx + R * Math.sin(a); y = cy - R * Math.cos(a);
      s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="17" stroke="currentColor" stroke-width="2" fill="none"/>' + txt(x.toFixed(1), (y + 5).toFixed(1), names[i], { b: 1 });
      var ix = cx + (R - 36) * Math.sin(a), iy = cy - (R - 36) * Math.cos(a), ox = cx + (R - 19) * Math.sin(a), oy = cy - (R - 19) * Math.cos(a);
      s += line(ox.toFixed(1), oy.toFixed(1), ix.toFixed(1), iy.toFixed(1), { w: 1.5, op: 0.7 });
    }
    s += '<path d="M 130 108 A 42 42 0 0 1 210 108" stroke="currentColor" stroke-width="2" fill="none"/><path d="M 203 100 L 211 109 L 200 112" stroke="currentColor" stroke-width="2" fill="none"/>';
    s += txt(cx, 132, 'clockwise', { fs: 12 }) + txt(cx, 148, '= LEFT', { fs: 12, b: 1 });
    s += txt(268, 74, 'Facing the centre:', { fs: 12, anchor: 'start', b: 1 });
    s += txt(268, 92, 'left = next seat', { fs: 12, anchor: 'start' }) + txt(268, 108, 'clockwise', { fs: 12, anchor: 'start' });
    s += txt(268, 134, 'right = next seat', { fs: 12, anchor: 'start' }) + txt(268, 150, 'anticlockwise', { fs: 12, anchor: 'start' });
    s += txt(268, 182, 'Facing out: reversed', { fs: 12, anchor: 'start', b: 1 });
    return wrapSvg('0 0 420 236', 'Six people around a circular table facing the centre; left is clockwise', s, 'Seats A, F, E, C, B, D run clockwise. Short strokes show everyone facing the centre. For people facing outward, left and right swap.');
  })();

  /* Rectangular table with six seats: D B A E C F. */
  var RECT = (function () {
    var s = '';
    s += '<rect x="100" y="84" width="180" height="80" rx="6" stroke="currentColor" stroke-width="2" fill="none"/>' + txt(190, 129, 'table', { fs: 12, op: 0.6 });
    var seats = [[150, 52, 'D'], [230, 52, 'B'], [322, 124, 'A'], [230, 196, 'E'], [150, 196, 'C'], [58, 124, 'F']];
    seats.forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="17" stroke="currentColor" stroke-width="2" fill="none"/>' + txt(p[0], p[1] + 5, p[2], { b: 1 }); });
    s += line(150, 70, 150, 178, { dash: 1, op: 0.55 }) + line(230, 70, 230, 178, { dash: 1, op: 0.55 }) + line(76, 124, 304, 124, { dash: 1, op: 0.55 });
    s += txt(190, 20, 'dashed lines join people who sit opposite', { fs: 12, op: 0.85 });
    s += txt(190, 240, 'Opposite pairs: D–C, B–E, F–A (a plain circle would pair D–E)', { fs: 12, op: 0.85 });
    return wrapSvg('0 0 380 252', 'A rectangular table with six seats; opposite pairs joined by dashed lines', s, 'On a rectangular table the two end seats face each other along the length; the long-side seats face across the width. Everyone faces the table.');
  })();

  /* Floors: five-storey building, D A C B E from bottom. */
  var FLOORS = (function () {
    var s = '', ppl = ['D', 'A', 'C', 'B', 'E'], i;
    for (i = 0; i < 5; i++) {
      var y = 14 + (4 - i) * 38;
      s += box(110, y, 150, 38, ppl[i], { bold: true });
      s += txt(96, y + 24, 'Floor ' + (i + 1), { fs: 12, anchor: 'end' });
    }
    s += '<path d="M 280 190 L 280 24" stroke="currentColor" stroke-width="2" fill="none"/><path d="M 274 32 L 280 22 L 286 32" stroke="currentColor" stroke-width="2" fill="none"/>' + txt(306, 110, 'up', { fs: 12 });
    return wrapSvg('0 0 340 214', 'A five-storey building with residents D, A, C, B, E from floor 1 to floor 5', s, 'Draw the building as a column, number the floors from the bottom, and write each name in as soon as a clue fixes it.', 340);
  })();

  /* ================================================================================ ORDER & RANKING */
  LEARN.reasoning.push({
    id: "order-ranking", group: "Relations & directions", title: "Order & ranking",
    sub: "Rank from the top and from the bottom, swapped places, minimum counts and pass lists",
    tags: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "AMCAT", "Bank PO"],
    blocks: [
      ["h2", "The idea"],
      ["p", "Order and ranking questions put people (or things) in a line and give you their place counted from one end. The line has a **left end and a right end**, or a **top and a bottom**, and every person has a place number from each end. The two numbers are linked by the length of the line."],
      ["p", "Almost every question reduces to one idea: **the person in question is counted from both ends, so the total is the two places added together minus 1.** Once you can move between the two ends, the rest is bookkeeping on a number line."],
      ["html", RANKBAR],
      ["list", [
        "**Rank from top / bottom** in a class and **place from left / right** in a row are the same thing in different words.",
        "**Between** means the people strictly inside the two places; the two end people are not counted.",
        "**Above / below / ahead / behind** just tells you which of two people has the smaller number from the top.",
        "**Passed / failed** splits the line: the top group passed, the bottom group failed (unless told otherwise)."
      ]],
      ["note", "Draw a line of boxes and tick the people you know. A five-second sketch beats a three-minute mental count."],

      ["h2", "Formulas"],
      ["formulas", [
        ["Total", "Total = (place from one end) + (place from the other end) − 1", "Same person, counted twice"],
        ["Other end", "Place from the right = Total − (place from the left) + 1", "The same formula turned around"],
        ["People between", "|p − q| − 1", "p, q: places counted from the same end"],
        ["Different people, minimum", "Total ≥ (place from top) + (place from bottom)", "The two groups just touch and no one is shared"],
        ["Among those passed", "Place from bottom among passed = place from bottom overall − number failed", "Valid when the person passed"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Always convert to the same end first.** Mixed ends (top for one person, bottom for another) are the whole trick of the harder questions.",
        "**“Total + 1” rule:** place from left + place from right = Total + 1. Memorise it and you never need a drawing for the plain case.",
        "**Swapping two people does not change the number of people between them** or the total. Only their own place numbers change.",
        "**Different people:** if the question says A and B are different (or one is above the other), the two groups cannot overlap, so Total ≥ sum of the two places.",
        "**Position after a swap:** the person who moves now stands where the other stood; use that place for the new count."
      ]],
      ["tip", "Check an answer by plugging it back: with a total of 36, someone 14th from the top must be 36 − 14 + 1 = 23rd from the bottom."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/order-ranking/rank-from-both-ends-total", title: "Rank from both ends → total",
        spot: "“Neeraj is 14th from the top and 23rd from the bottom. How many students are there?” One person, a rank from each end, or a total plus one rank.",
        method: ["Mark the person in question.", "Add the two ranks.", "Subtract 1, because that person has been counted twice.", "If the total is given instead, use Other end = Total − known place + 1."],
        ex: { q: "Neeraj is 14th from the top and 23rd from the bottom in his class. How many students are in the class?", steps: ["Rank from top + rank from bottom = 14 + 23 = 37", "Neeraj is counted in both, so subtract 1: 37 − 1 = 36"], ans: "36 students" },
        shortcut: "Top rank + bottom rank − 1. If the person ranks 5 above someone else, convert to one end first and then step 5 places."
      }],
      ["pattern", {
        key: "reasoning/order-ranking/positions-swapped", title: "Positions swapped",
        spot: "“After they exchange places, A becomes 21st from the left.” Two people swap seats and the question gives the new place of one of them.",
        method: ["Sketch the line with the two seats marked.", "After the swap, A stands in B’s old seat, so A’s new place from the left is the seat number of B’s old seat.", "That seat’s place from the right is what B’s original rank from the right described; the seat keeps both numbers, only the person changes.", "Total = (new place of A from the left) + (B’s old place from the right) − 1."],
        ex: { q: "In a row, Kunal is 11th from the left and Lalit is 16th from the right. When they exchange places, Kunal becomes 21st from the left. How many people are in the row?", steps: ["After the swap Kunal sits in Lalit’s old seat, which is 21st from the left", "Lalit’s old seat is 16th from the right", "Total = 21 + 16 − 1 = 36"], ans: "36 people" },
        shortcut: "The seat keeps its numbers, the people move. Use the NEW place of one person with the OLD place of the other from the opposite end."
      }],
      ["pattern", {
        key: "reasoning/order-ranking/minimum-number-of-people", title: "Minimum number of people",
        spot: "“What is the minimum number of persons in the line?” Two different people, one counted from each end, with their order given or free.",
        method: ["Convert both to places from the same end, leaving the second one as an unknown total N.", "Use the order given (A above B) to say A’s place < B’s place.", "Turn that into an inequality on N and take the smallest whole number that works.", "If a number of people between them is stated, get two cases and compare them."],
        ex: { q: "Tara is 10th from the top and Uma is 14th from the bottom. Tara ranks above Uma. What is the minimum number of students?", steps: ["Uma’s place from the top = N − 14 + 1 = N − 13", "She is below Tara, so N − 13 ≥ 11 (at least one place after Tara’s 10th)", "N ≥ 24, so the minimum is 24"], ans: "24 students" },
        shortcut: "Different people with no overlap: minimum = top place + bottom place. With 10 and 14 the answer is 24, two groups that just touch."
      }],
      ["pattern", {
        key: "reasoning/order-ranking/rank-among-those-who-passed", title: "Rank among those who passed",
        spot: "“Out of 60 candidates, 15 failed. Dev is 22nd from the bottom overall. What is his rank from the bottom among those who passed?”",
        method: ["Write the total, the number who passed and the number who failed.", "Failed people occupy the bottom places, so they sit before every passed person when counting from the bottom.", "Rank from bottom among passed = overall rank from bottom − number failed.", "Check that the person is really in the passed group: overall rank from bottom must be greater than the number failed."],
        ex: { q: "In an exam, 60 students appeared and the bottom 15 failed. Dev is 22nd from the bottom among all students. What is his rank from the bottom among the students who passed?", steps: ["Failed students take bottom places 1 to 15", "Dev is 22nd, so he is past the failed group: he passed", "Rank among passed = 22 − 15 = 7", "Check: top rank = 60 − 22 + 1 = 39; passed = 45; 45 − 39 + 1 = 7"], ans: "7th from the bottom among the passed" },
        shortcut: "Take the failed off the bottom end, or take the passed off from the top. Same answer, so use whichever is shorter."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Forgetting the − 1:** adding 12 and 18 gives 30, but the person is in both groups, so the total is 29.",
        "**Mixing ends:** subtracting a rank from the top and a rank from the bottom as if they were on the same side.",
        "**Off-by-one on “between”:** the people between ranks 12 and 40 number 40 − 12 − 1 = 27, not 28.",
        "**Believing the swap changes the gap:** two people exchanging seats keep the same number of people between their seats.",
        "**Minimum questions:** forgetting that the two people are different and allowing them to share a place.",
        "**Using the overall rank for a passed-only question:** subtract the failed first."
      ]],
      ["warn", "If a question says “above”, “ahead of” or “senior to”, check which end the ranks are counted from before you add or subtract."],

      ["h2", "Quick check"],
      ["quiz", ["order-ranking-01", "order-ranking-03", "order-ranking-05", "order-ranking-06", "order-ranking-08"]]
    ]
  });

  /* ================================================================================ SEATING */
  LEARN.reasoning.push({
    id: "seating", group: "Arrangements & puzzles", title: "Seating arrangement",
    sub: "Rows, circles and tables: place everyone from a few clues, and work out who faces which way",
    tags: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "AMCAT", "eLitmus", "Bank PO"],
    blocks: [
      ["h2", "The idea"],
      ["p", "A seating question gives a handful of clues about who sits where, and then asks one or two things about the final arrangement. There is **exactly one valid arrangement**, so the job is to find it by starting with the clue that pins down the most, and placing people one at a time."],
      ["p", "The whole subject is about **left and right**. Left and right always belong to the person who is sitting, not to you looking at the page. Everything else (rows, circles, tables) is a way of numbering the seats."],
      ["list", [
        "**One row, same direction:** everyone faces north (or everyone south). Left and right match the page.",
        "**One row, mixed facing:** some face north, some south. For the south-facing ones, left and right are swapped.",
        "**Two rows facing each other:** one row faces north, the other south. Each person faces exactly one person in the other row.",
        "**Circle:** facing the centre, your left is the next seat clockwise. Facing outward it is the other way round.",
        "**Rectangular / square table:** like a circle with a fixed number of seats per side. Corners and ends need care."
      ]],
      ["note", "Unless the question says otherwise, everyone in a circle or table puzzle faces the centre and “opposite” means the seat directly across."],

      ["h2", "Rules"],
      ["table", ["Arrangement", "Who faces which way", "Left of a person is"], [
        ["Row facing north", "Everyone north", "the seat on the page-left"],
        ["Row facing south", "Everyone south", "the seat on the page-right"],
        ["Row, mixed", "Each person has a facing", "page-left if north, page-right if south"],
        ["Circle, facing centre", "All inward", "next seat clockwise"],
        ["Circle, facing outside", "All outward", "next seat anticlockwise"],
        ["Circle, mixed", "Some in, some out", "clockwise if facing in, anticlockwise if facing out"]
      ]],
      ["formulas", [
        ["People between", "|p − q| − 1", "In a row, p and q are seat numbers"],
        ["Opposite (circle of n, n even)", "seat + n/2", "6 seats: opposite of seat 0 is seat 3"],
        ["Position from the other end", "n + 1 − p", "In a row of n"],
        ["Third to the right of X", "In a circle facing centre: 3 seats anticlockwise from X", "Left of X: clockwise"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Fix one person to start a circle.** Everyone is the same in a circle until someone is anchored, so put the most-mentioned person at the top and work clockwise.",
        "**Start with the strongest clue:** an exact seat (“third from the left”), an “opposite”, or a chain of “immediately”. Soft clues like “is not a neighbour of” go last, to choose between the two options they leave.",
        "**Draw empty seats first** (numbered boxes or circles) and write in names lightly in pencil. If two places remain for two names, a soft clue will choose.",
        "**Mark each person with their facing** (↑ or ↓, in or out) the moment you place them. Left/right questions depend on it.",
        "**Check the answer by reading every clue once more** against your finished diagram. One broken clue means a mistake early on."
      ]],
      ["tip", "In a puzzle with two possible cases, carry both on paper until a clue kills one. Do not guess early."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/seating/one-row-same-direction", title: "One row, same direction",
        spot: "“Six friends sit in a row facing north. C sits second from the left…” Everyone faces the same way; the clues use left, right, between and ends.",
        method: ["Draw n empty boxes numbered from the left.", "Place the clue that gives an exact seat or an end first.", "Add “immediately right of” and “between” clues in a chain.", "Fill the last seats with the soft clues, then answer."],
        ex: { q: "Six friends A, B, C, D, E, F sit in a row facing north. A sits at the extreme left end. C sits second from the left. D sits immediately to the right of C. B sits two places to the right of D. F sits to the right of E. Who sits at the extreme right end?", steps: ["A is 1st, C is 2nd, D is 3rd (immediately right of C)", "B is two places right of D: 5th", "E and F take the places 4th and 6th; F is right of E, so E is 4th and F is 6th", "Row: A C D E B F"], ans: "F" },
        shortcut: "“Immediately right” always means +1 seat in a north-facing row. Build the chain A, C, D and the rest drops into place."
      }],
      ["pattern", {
        key: "reasoning/seating/one-row-mixed-facing", title: "One row, mixed facing",
        spot: "“Some face north and some face south.” The clues use left and right of people with different facings.",
        method: ["Write each person’s facing next to their name.", "Translate every “left of X” using X’s facing: left is the page-left if X faces north, the page-right if X faces south.", "Place anchored people, then chain.", "Re-read each left/right clue with the right person’s facing."],
        ex: { q: "Five people D, B, A, C, E sit in a row. A, B and E face north; C and D face south. B sits second from the left end. A sits immediately to the right of B. E sits immediately to the left of C. Who sits at the extreme left end?", steps: ["B is 2nd. A faces north and is immediately right of B: A is 3rd", "C faces south, so C’s left is the page-right. E is on C’s left, so E is one seat to the page-right of C", "Free seats are 1, 4, 5: E right of C means C 4th and E 5th", "D takes the extreme left end: D B A C E"], ans: "D" },
        shortcut: "For a person facing south, swap left and right before you use the clue. Write ↑ or ↓ under each name."
      }],
      ["html", MIXROW],
      ["pattern", {
        key: "reasoning/seating/two-rows-facing-each-other", title: "Two rows facing each other",
        spot: "“Two rows of three; A, B, C face south and P, Q, R face north.” Each person faces one person in the other row.",
        method: ["Draw two rows, one above the other, with matching columns.", "Facing pairs are the same column: if X faces Y, put them one above the other.", "Use left and right according to the facing of the person named (north row: page-left; south row: page-right).", "Solve one row completely, then the other."],
        ex: { q: "Row 1 (A, B, C) faces south; Row 2 (P, Q, R) faces north. A sits immediately to the right of B. C faces Q. R sits immediately to the right of Q. Who faces A?", steps: ["Row 1 faces south, so a person’s right is the page-left: A is one column to the page-left of B. So (A, B) take columns (1, 2) or (2, 3) and C takes the remaining one", "Row 2 faces north, so right is the page-right: R is one column right of Q, which means Q is in column 1 or 2", "C faces Q (same column), so C cannot be in column 3; C is in column 1, hence A in 2 and B in 3", "Row 1 left to right: C, A, B. Row 2: Q (column 1), R (column 2), P (column 3). A is in column 2, so A faces R"], ans: "R" },
        shortcut: "Column numbers settle it. Write each row’s columns 1, 2, 3 from the page-left, then match the people who share a column."
      }],
      ["pattern", {
        key: "reasoning/seating/circle-facing-the-centre", title: "Circle facing the centre",
        spot: "“Six persons sit around a circular table, all facing the centre.” Clues: second to the right of, opposite, immediate left, neighbour.",
        method: ["Draw a circle of n seats and anchor one person at the top.", "Facing the centre, left is clockwise and right is anticlockwise.", "Place the “second to the right of A” and “opposite A” clues straight away.", "Use the remaining clues to settle who is on which side of the anchor."],
        ex: { q: "Six friends A, B, C, D, E, F sit around a circular table facing the centre. B sits second to the right of A. C sits opposite A. D sits immediately to the left of B. E is not a neighbour of A. Who sits immediately to the left of A?", steps: ["Put A at the top (seat 0) and number clockwise 0 to 5. Right = anticlockwise, left = clockwise", "B is two seats anticlockwise of A: seat 4. C is opposite A: seat 3", "D is immediately left (clockwise) of B: seat 5", "Seats 1 and 2 are left for E and F. E is not next to A, so E is seat 2 and F is seat 1", "A’s immediate left is the next seat clockwise, seat 1: F"], ans: "F" },
        shortcut: "Left is clockwise, right is anticlockwise. Write 0 to n − 1 clockwise round the circle and use arithmetic mod n."
      }],
      ["html", CIRCLE],
      ["pattern", {
        key: "reasoning/seating/circle-facing-outside-mixed", title: "Circle facing outside / mixed",
        spot: "“Some face the centre and others face outward.” Same circle, but each person has an in/out facing.",
        method: ["Mark every person IN or OUT as soon as the question states it.", "For an IN person, left = clockwise; for an OUT person, left = anticlockwise.", "Translate every clue using the facing of the person it is about.", "Anchor one person, build the circle, then answer."],
        ex: { q: "Six people P, Q, R, S, T, U sit round a table. Q and S face outward; the others face the centre. P sits immediately to the left of Q. R sits immediately to the right of Q. T sits opposite Q. S sits immediately to the right of T. Who sits immediately to the left of S?", steps: ["Anchor Q at seat 0 and number clockwise. Q faces out: left = anticlockwise = seat 5 (P); right = clockwise = seat 1 (R)", "T is opposite Q: seat 3. T faces in: right = anticlockwise, so S is seat 2", "U takes seat 4. Circle clockwise: Q, R, S, T, U, P", "S faces out, so S’s left is anticlockwise: seat 1, R"], ans: "R" },
        shortcut: "Only the person the clue is about decides what left and right mean. Mark in/out on your drawing before anything else."
      }],
      ["pattern", {
        key: "reasoning/seating/square-and-rectangular-tables", title: "Square & rectangular tables",
        spot: "“Six people sit around a rectangular table, two on each long side and one at each end.” Opposite means across the table, which is not always n/2 seats away.",
        method: ["Draw the table and number the seats clockwise from the top-left seat.", "List the opposite pairs from the drawing before reading the clues.", "Everyone faces the table, so left is clockwise as in a circle.", "Solve as a circle, but use the table’s own opposite pairs."],
        ex: { q: "Six people A, B, C, D, E, F sit around a rectangular table, two on each long side and one at each end, all facing the table. A sits at the right-hand end. F sits opposite A. B sits immediately to the right of A. E sits opposite B. D sits immediately to the left of F. Who sits opposite D?", steps: ["Number clockwise: 0 top-left, 1 top-right, 2 right end, 3 bottom-right, 4 bottom-left, 5 left end. Opposite pairs: 0 and 4, 1 and 3, 2 and 5", "A is seat 2, so F is seat 5. B is immediately right (anticlockwise) of A: seat 1. E is opposite B: seat 3", "D is immediately left (clockwise) of F: seat 0. C is left with seat 4", "Opposite of seat 0 is seat 4: C (a plain circle rule would have wrongly said E)"], ans: "C" },
        shortcut: "Draw the table and list the opposite pairs first. A rectangle with 6 seats does not pair seat k with seat k + 3."
      }],
      ["html", RECT],

      ["h2", "Common traps"],
      ["list", [
        "**Left and right from your own view:** the question always means the seated person’s left and right.",
        "**Swapped sides in mixed rows:** forgetting that a south-facing person’s left is the page-right.",
        "**Not anchoring a circle:** placing people without fixing one makes every clue ambiguous.",
        "**“Second to the right” counted as one seat:** second to the right is two seats away; “immediately” is one.",
        "**Using n/2 for a rectangular table:** opposite seats follow the table’s shape, so list them from a drawing.",
        "**Reading a negative clue as a positive one:** “E is not a neighbour of A” removes seats, it does not place E."
      ]],
      ["warn", "Before you answer, test your finished seating plan against every clue once more. A single clue that fails means a wrong turn earlier, not a trick question."],

      ["h2", "Quick check"],
      ["quiz", ["seating-01", "seating-04", "seating-05", "seating-07", "seating-09"]]
    ]
  });

  /* ================================================================================ PUZZLES */
  LEARN.reasoning.push({
    id: "puzzles", group: "Arrangements & puzzles", title: "Puzzles",
    sub: "Floors, stacks, days, heights and grids: turn clues into a table and solve by elimination",
    tags: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "AMCAT", "eLitmus", "Bank PO"],
    blocks: [
      ["h2", "The idea"],
      ["p", "A **puzzle** is a seating question with the seats replaced by something else: floors of a building, boxes in a pile, days of a week, heights, or a table of person, city and colour. Every clue is a small fact. The answer is the **only** arrangement that satisfies all of them."],
      ["p", "The method never changes: **draw the frame, write in the sure facts, cross out the impossible, and repeat.** Do not try to hold the whole puzzle in your head. The first fact you can place for certain is worth more than any clever idea."],
      ["list", [
        "**Linear frames** (floors, stacks, days) behave like a row: you have numbered places and clues about above, below, between and immediately next to.",
        "**Comparison puzzles** have no places at all, only “taller than” links. Build a chain with arrows.",
        "**Grid puzzles** give each person several attributes. Use a table with a tick for yes and a cross for no."
      ]],
      ["note", "In almost every puzzle, each person has exactly one of each attribute and no two share one. That is why a cross in a row often forces a tick elsewhere."],

      ["h2", "Rules"],
      ["table", ["Clue wording", "What it means"], [
        ["A lives immediately above B", "A’s floor = B’s floor + 1"],
        ["A lives two floors below B", "A’s floor = B’s floor − 2"],
        ["A is between B and C", "A is somewhere in the middle; B and C are on opposite sides (order not fixed unless told)"],
        ["A is the day after B", "A = B + 1; in a week, Sunday is followed by Monday (cyclic)"],
        ["A is taller than B", "Write A → B (an arrow from taller to shorter)"],
        ["Neither X nor Y", "Two crosses at once"],
        ["Exactly one of them", "One tick, one cross; no third person is involved"]
      ]],
      ["formulas", [
        ["Between", "Places between p and q = |p − q| − 1", "Same as a row"],
        ["Days later", "Day + k (mod 7)", "Friday + 4 = Tuesday"],
        ["Months later", "Month + k (mod 12)", "November + 3 = February"],
        ["Number of arrangements", "n! for a straight line", "Clues cut this down to one"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Start with the most specific clue:** “lives on the top floor”, “Wednesday”, “is the Designer”. Place it first.",
        "**Chain “immediately” clues** into blocks (A directly above B directly above C), then slide the block into the only place where it fits.",
        "**Use the extremes:** the person who is “not at the bottom” cannot be at the bottom, so cross out one seat.",
        "**Elimination in grids:** once a person has a city, cross that city out of every other row, and cross out that person’s other cities.",
        "**For comparison, find the person with no arrow into them (tallest) and the one with none out (shortest).** Put the rest between.",
        "**Keep two cases open** if a clue gives you a choice, and run each until one contradicts a clue."
      ]],
      ["tip", "Write clues as short symbols on a single line before you start: D = 5, B = E − 1, C = A + 2. Symbols are quicker to combine than sentences."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/puzzles/floors-and-flats", title: "Floors & flats",
        spot: "“Five people live on different floors of a five-storey building…” Clues about above, below, between and top floor.",
        method: ["Draw a column of floors, numbering from the bottom.", "Place the top-floor or ground-floor clue first.", "Convert “immediately below / two floors above” into arithmetic on floor numbers.", "Place the rest by elimination."],
        ex: { q: "Five people A, B, C, D, E live on different floors (1 is the ground floor, 5 is the top) of a building. E lives on the top floor. B lives immediately below E. C lives two floors above D. A lives below C. Who lives on the 2nd floor?", steps: ["E is on floor 5; B is immediately below, floor 4", "Floors 1, 2, 3 are left for A, C, D with C = D + 2", "D = 1 and C = 3 is the only fit (D = 2 would give C = 4, already B)", "A lives below C, and floor 2 is the only one left: A = 2", "Column from the bottom: D, A, C, B, E"], ans: "A" },
        shortcut: "Fix the top (or bottom) floor, then chain the “immediately” clues. Write the column on paper."
      }],
      ["html", FLOORS],
      ["pattern", {
        key: "reasoning/puzzles/box-stacking", title: "Box stacking",
        spot: "“Five boxes P, Q, R, S, T are kept one above the other.” Clues about directly above, directly below, middle, top and bottom.",
        method: ["Draw a vertical stack and number from the bottom.", "Place the middle, top and bottom clues first.", "Merge “directly above” clues into blocks.", "Cross out places the rules forbid and fill the rest."],
        ex: { q: "Five boxes P, Q, R, S, T are placed in a stack, one above another. R is exactly in the middle. S is directly above R. P is below R but not at the bottom. Q is above S. How many boxes are between T and S?", steps: ["Number the places 1 (bottom) to 5 (top). R is in the middle: 3", "S is directly above R: 4", "P is below R but not at the bottom: 2", "T and Q have places 1 and 5; Q is above S, so Q = 5 and T = 1", "Stack from the bottom: T, P, R, S, Q. Between T (1) and S (4): P and R"], ans: "2 boxes" },
        shortcut: "Same as floors: draw the stack, place the middle and extremes first, and then the blocks."
      }],
      ["pattern", {
        key: "reasoning/puzzles/scheduling", title: "Scheduling (days / months)",
        spot: "“Five talks are held on Monday to Friday.” Clues about before, after, a gap of two days, and a fixed day.",
        method: ["List the days (or months) in a row.", "Write in any fixed day first.", "Turn “two days after” and “the day before” into arithmetic on the day numbers.", "Use “earlier / later than” to place the remaining items."],
        ex: { q: "Five talks P, Q, R, S, T are held on one day each, Monday to Friday. R is held on Wednesday. T is held two days after R. P is held the day before R. Q is held earlier than P. On which day is S held?", steps: ["Number the days: Mon 1 … Fri 5. R is Wednesday (3)", "T is two days after R: Friday (5)", "P is the day before R: Tuesday (2)", "Q is earlier than P: Monday (1)", "S gets the day that is left: Thursday"], ans: "Thursday" },
        shortcut: "Convert days to numbers and use + and −. For months or a full week, remember the wrap: after Saturday comes Sunday, after December comes January."
      }],
      ["pattern", {
        key: "reasoning/puzzles/comparison", title: "Comparison (heights, weights)",
        spot: "“P is taller than Q. R is taller than P…” Clues only compare people; no place numbers.",
        method: ["Write each clue as an arrow: A → B means A is taller (heavier, older) than B.", "Link the arrows into one chain wherever the same name appears.", "Read the chain from tallest to shortest.", "If two people are not linked, the question cannot be answered about them; check whether it asks for a pair that is."],
        ex: { q: "P is taller than Q. R is taller than P. Q is taller than S. T is shorter than S. Who is the second tallest?", steps: ["Arrows: P → Q, R → P, Q → S, S → T", "Join them: R → P → Q → S → T", "Tallest to shortest: R, P, Q, S, T", "The second tallest is P"], ans: "P" },
        shortcut: "Draw arrows, then join them end to end. The first name in the chain is the tallest; the last is the shortest."
      }],
      ["pattern", {
        key: "reasoning/puzzles/multi-attribute-grids", title: "Multi-attribute grids (person–colour–city)",
        spot: "“Three friends each live in a different city and like a different colour.” Several attributes to match to each person.",
        method: ["Draw a table: one row per person, one column per attribute, with the choices written out.", "Put a tick for every fixed fact and a cross for every “not”.", "After each tick, cross out the rest of that row and column.", "A choice with just one place left is a forced tick."],
        ex: { q: "Ira, Jay and Kia each live in a different city (Pune, Delhi, Goa) and each like a different colour (Red, Blue, Green). Ira lives in Pune. The person who likes Red lives in Delhi. Kia likes Blue. Who lives in Goa and what colour does Ira like?", steps: ["Ira = Pune. Kia = Blue", "The Red-lover lives in Delhi, so Ira (Pune) does not like Red; Ira is not Blue (Kia), so Ira likes Green", "Jay is left with Red, so Jay lives in Delhi", "Kia gets Goa"], ans: "Kia lives in Goa; Ira likes Green" },
        shortcut: "Tick and cross in a table, and use the “each choice used once” rule: when one place is left for a name, it is forced."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Mixing up above and below:** floor 1 is the bottom. Number from the bottom and keep the same direction throughout.",
        "**“Between” read as “adjacent”:** between means somewhere inside, and not necessarily right next to either person.",
        "**Cyclic days and months:** Saturday + 2 is Monday, not “day 8”.",
        "**Reading “not” as a placement:** “A is not on floor 2” only removes a possibility.",
        "**Comparison with a gap in the chain:** without a link between two names, you cannot compare them.",
        "**Missing the second case:** a clue like “A lives next to B” gives two directions; keep both until one fails."
      ]],
      ["warn", "If your finished arrangement breaks even one clue, the arrangement is wrong. Do not “fix” the clue to fit."],

      ["h2", "Quick check"],
      ["quiz", ["puzzles-01", "puzzles-04", "puzzles-06", "puzzles-08", "puzzles-10"]]
    ]
  });

  /* ================================================================================ INPUT-OUTPUT */
  LEARN.reasoning.push({
    id: "input-output", group: "Arrangements & puzzles", title: "Input–output machine",
    sub: "A machine rearranges a line step by step: find the rule, then run it forwards or backwards",
    tags: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "Bank PO", "AMCAT"],
    blocks: [
      ["h2", "The idea"],
      ["p", "In an **input–output** question a machine takes a line of words and/or numbers and changes it in **steps**. Each step applies one simple rule: move the smallest number to the left, put the last word in dictionary order at the right end, swap two positions, and so on. You are given the input and a step or two, and you are asked for another step."],
      ["p", "The key is that **each step does a little and keeps the rest unchanged.** Compare two consecutive lines, see exactly what moved, and that is the rule. Then write every step on its own line; skipping a line is how mistakes happen."],
      ["list", [
        "**Word rearrangement:** words are sorted into dictionary order, one per step, or alternately from each end.",
        "**Number sorting:** numbers move by size, parity or position, one per step.",
        "**Words + numbers:** numbers and words are treated by different rules in different steps.",
        "**Finding a step / the previous step:** you are asked for step k, the step at which a result appears, or the input behind a final output."
      ]],
      ["note", "A sorted block builds up at one or both ends. The rest of the line keeps its original order. That is the signature of this question type."],

      ["h2", "Rules"],
      ["table", ["What you see", "What it usually means"], [
        ["One element jumps to the left end", "Smallest number / first word in dictionary order is placed; the others keep their order"],
        ["One element jumps to the right end", "Largest number / last word in dictionary order is placed"],
        ["Left and right ends grow alternately", "Odd steps use one end, even steps the other"],
        ["Numbers first, words after", "Numbers are moved to the left in a given order; words follow"],
        ["Two elements trade places", "A swap of fixed positions (for example 1st and last)"],
        ["Same step repeats until sorted", "Total steps are about n − 1 for n elements"]
      ]],
      ["formulas", [
        ["Dictionary order", "Compare letter by letter from the left; a shorter word comes first if the rest matches", "apple < apples < apt"],
        ["Number of steps", "At most n − 1 for a line of n elements", "The line can finish sorted earlier"],
        ["Digit sum", "Add the digits", "54 → 9; 13 → 4"],
        ["Undoing a swap or reversal", "Do it again; it undoes itself", "Applying the steps backwards finds the input"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Compare Step I with the input and Step II with Step I.** What moved is the rule; what did not move is irrelevant.",
        "**Mark the placed block** at the end of each line (underline or bracket). It shows exactly how far the sort has gone.",
        "**For a late step, extend the pattern** one step at a time. For step 6 of a 7-element line, the last two steps are nearly always forced.",
        "**Work backwards for “what was the input?”:** undo the last step first, then the one before.",
        "**Write each line out in full.** Mental shortcuts on a 7-element line fail more often than they save time."
      ]],
      ["tip", "Alternate-end rules (smallest to the left in odd steps, largest to the right in even steps) usually finish earlier than you expect, because the middle sorts itself on the way."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/input-output/word-rearrangement", title: "Word rearrangement",
        spot: "“Input: dog ant fox cow bee. In each step the word that comes last in dictionary order goes to the right…” Words are sorted into dictionary order one step at a time.",
        method: ["Write the words in dictionary order beside the question.", "Check the rule against Step I: which word moved, and to which end.", "Apply the rule once per step, to the words not yet placed.", "Keep a placed block at the end that moves no more."],
        ex: { q: "Input: dog ant fox cow bee. In each step the word that is last in dictionary order (among those not yet placed) is moved to the right end, next to the words already placed; the others keep their order. What is Step III?", steps: ["Dictionary order: ant, bee, cow, dog, fox", "Step I: fox goes to the right end: dog ant cow bee fox", "Step II: dog is the last of the rest: ant cow bee dog fox", "Step III: cow is the last of the rest: ant bee cow dog fox"], ans: "ant bee cow dog fox" },
        shortcut: "One word joins the sorted block per step. Write the sorted order first and count steps off it."
      }],
      ["pattern", {
        key: "reasoning/input-output/number-sorting", title: "Number sorting",
        spot: "“Input: 48 31 76 15 62 27. Step I: all odd numbers in ascending order at the left…” Numbers are grouped or sorted by size, parity or position.",
        method: ["Split the numbers by the property the rule uses (odd/even, size, position).", "Apply each step to the group it names and leave the others untouched.", "Read the next step from the previous line, not from the input.", "When asked for a count or a position, finish the line first."],
        ex: { q: "Input: 48 31 76 15 62 27. Step I: the odd numbers are arranged in ascending order and moved to the left; the even numbers keep their order. Step II: the even numbers are arranged in descending order. What is Step II?", steps: ["Odd numbers: 31, 15, 27; ascending: 15, 27, 31", "Even numbers in the input order: 48, 76, 62", "Step I: 15 27 31 48 76 62", "Even numbers in descending order: 76, 62, 48", "Step II: 15 27 31 76 62 48"], ans: "15 27 31 76 62 48" },
        shortcut: "Handle each group on its own line (odds, evens), then join them in the order the rule states."
      }],
      ["pattern", {
        key: "reasoning/input-output/words-numbers", title: "Words + numbers",
        spot: "“Input: 29 tiger 54 apple 13 mango. Step I: numbers to the left in ascending order…” A mix of words and numbers, with a separate rule for each type.",
        method: ["Separate the line into numbers and words in your head (or on paper).", "Do exactly what each step says to its group.", "Write the whole line again after each step.", "Replace numbers by digit sums, products, etc. only when the step says so."],
        ex: { q: "Input: 29 tiger 54 apple 13 mango. Step I: the numbers are arranged in ascending order at the left end; the words keep their order. Step II: the words are arranged in reverse dictionary order. Step III: every number is replaced by the sum of its digits. What is the sum of the numbers in Step III?", steps: ["Step I: 13 29 54 tiger apple mango", "Step II: reverse dictionary order of tiger, apple, mango is tiger, mango, apple: 13 29 54 tiger mango apple", "Step III: digit sums 13 → 4, 29 → 11, 54 → 9: 4 11 9 tiger mango apple", "Sum of the numbers: 4 + 11 + 9 = 24"], ans: "24" },
        shortcut: "One rule per group, one line per step. A step that touches only words never changes the numbers."
      }],
      ["pattern", {
        key: "reasoning/input-output/find-a-step-the-previous", title: "Find a step / the previous step",
        spot: "“What will Step IV be?”, “At which step does the line read …?”, “Which of these was the input?” You are given some steps and asked for another, or for the starting line.",
        method: ["Compare the lines you are given and write the rule in one sentence.", "Run the rule forwards, line by line, to the step asked.", "For the input, undo the last step first and go backwards (swaps and reversals undo themselves).", "Test your answer by running the rule forward once."],
        ex: { q: "A machine rearranges a line by a fixed rule. Input: 71 24 56 13 38. Step I: 13 71 24 56 38. Step II: 13 24 71 56 38. At which step is the line first fully in ascending order?", steps: ["Step I brings the smallest number (13) to the left; Step II brings the next smallest (24) next to it. The rest keep their order", "Step III: the next smallest, 38, joins: 13 24 38 71 56", "Step IV: 56 joins: 13 24 38 56 71 (ascending)", "Step III is not yet sorted (71 before 56), so Step IV is the first"], ans: "Step IV" },
        shortcut: "Read the rule from the first two steps. To find an input, undo the steps in reverse: for example Step I swaps 1st and 4th, Step II reverses the first three, Step III swaps 2nd and 5th; the output rice salt oil tea milk comes from tea milk rice oil salt."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Sorting the whole line at once:** each step places only one element (or one per end); the rest stay as they were.",
        "**Moving the wrong end:** smallest to the left and largest to the right are different rules.",
        "**Dictionary order slips:** compare letter by letter; “cat” comes before “cattle”, and “bee” before “bird”.",
        "**Reading the rule off the first step only:** check it against the second step too, as one step can fit two rules.",
        "**Undoing steps in the original order:** to find the input, reverse the order of the steps as well.",
        "**Stopping at n − 1 steps:** the line may be sorted earlier, so check after each step."
      ]],
      ["warn", "Do not skip steps. Writing each line costs ten seconds and saves a wrong answer."],

      ["h2", "Quick check"],
      ["quiz", ["input-output-01", "input-output-03", "input-output-05", "input-output-07", "input-output-09"]]
    ]
  });
})();

BRIEFS["reasoning:order-ranking"] = "In an order-and-ranking question, every person has a place counted from each end of the line, and the two places are linked by the total: left place + right place = total + 1. Convert everyone to the same end first, and remember that the person in question is counted twice when you add the two ranks.\n\nFor a swap, the person who moves stands in the other person's old seat, so use that seat's place. For a minimum count, the two different people cannot share a place, so the two groups just touch. For a pass list, take the number who failed off the bottom rank before you quote a rank among those who passed.";
BRIEFS["reasoning:seating"] = "Seating questions have exactly one valid arrangement. Draw the empty seats (a row, a circle, or a table), place the clue that pins the most first, and chain the \"immediately\" clues outward. Soft clues such as \"is not a neighbour of\" are used last to choose between the two options left.\n\nLeft and right belong to the person sitting. Facing north in a row, your left is the page-left; facing south it is the page-right. Facing the centre of a circle, your left is the next seat clockwise; facing out it is anticlockwise. On a rectangular table list the opposite pairs from the drawing, because they are not n/2 seats apart.";
BRIEFS["reasoning:puzzles"] = "A reasoning puzzle is a set of small facts about floors, stacks, days, heights or a table of attributes, and only one arrangement fits them all. Draw the frame, write in the sure facts, cross out the impossible, and repeat. Place the most specific clue first and chain the \"immediately\" clues into blocks.\n\nFor comparison puzzles use arrows from taller to shorter and join them into one chain. For grids use ticks and crosses and the rule that each choice is used once. Check the final arrangement against every clue before you answer.";
BRIEFS["reasoning:input-output"] = "An input-output machine changes a line of words or numbers one small step at a time and keeps the rest of the line as it was. Compare Step I with the input and Step II with Step I, say in one sentence what moved, and that is the rule. A sorted block usually grows from one or both ends.\n\nWrite out every line in full, apply the rule only to the elements not yet placed, and check whether the line is already sorted before the last step. To find the input, undo the steps in reverse order; swaps and reversals undo themselves.";
