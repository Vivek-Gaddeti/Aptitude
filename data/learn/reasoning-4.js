/* Learn pages for Logical Reasoning, part 4: data sufficiency, Venn reasoning, cubes & dice, counting figures, non-verbal reasoning. */
window.LEARN = window.LEARN || {}; LEARN.reasoning = LEARN.reasoning || []; window.BRIEFS = window.BRIEFS || {};
(function () {
  /* ---------- inline diagrams (stroke / fill use currentColor so they follow the theme) ---------- */
  function wrapSvg(svg, cap) { return '<div class="diagram">' + svg + '<div class="cap">' + cap + '</div></div>'; }
  var HEAD = 'style="max-width:420px;width:100%;height:auto" font-size="13" text-anchor="middle"';
  function T(x, y, t, extra) { return '<text x="' + x + '" y="' + y + '" fill="currentColor"' + (extra || '') + '>' + t + '</text>'; }
  function L(x1, y1, x2, y2, w, dash) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="currentColor" stroke-width="' + (w || 2) + '" fill="none"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>'; }

  /* Three-circle Venn diagram with the seven regions numbered */
  var VENN3 = (function () {
    var s = '<svg viewBox="0 0 360 250" role="img" aria-label="Three overlapping circles A, B and C with the seven regions numbered 1 to 7" ' + HEAD + '>';
    s += '<circle cx="150" cy="100" r="62" stroke="currentColor" stroke-width="2" fill="none"/>';
    s += '<circle cx="210" cy="100" r="62" stroke="currentColor" stroke-width="2" fill="none"/>';
    s += '<circle cx="180" cy="152" r="62" stroke="currentColor" stroke-width="2" fill="none"/>';
    s += '<rect x="40" y="14" width="280" height="224" rx="6" stroke="currentColor" stroke-width="1" opacity="0.4" fill="none"/>';
    s += T(112, 78, "1", ' font-weight="700"') + T(248, 78, "2", ' font-weight="700"') + T(180, 208, "3", ' font-weight="700"');
    s += T(180, 70, "4", ' font-weight="700"') + T(143, 142, "5", ' font-weight="700"') + T(217, 142, "6", ' font-weight="700"') + T(180, 118, "7", ' font-weight="700"');
    s += T(92, 46, "A", ' font-size="15"') + T(268, 46, "B", ' font-size="15"') + T(180, 232, "C", ' font-size="15"') + T(64, 32, "outside = 8", ' font-size="11" opacity="0.7"');
    s += '</svg>';
    return wrapSvg(s, 'Three sets cut the page into **7 regions** inside the circles (1 only A, 2 only B, 3 only C, 4 = A and B only, 5 = A and C only, 6 = B and C only, 7 = all three), plus the outside.'.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'));
  })();

  /* Doctors / Women / Mothers */
  var DWM = (function () {
    var s = '<svg viewBox="0 0 360 210" role="img" aria-label="Mothers drawn inside Women, with Doctors overlapping both" ' + HEAD + '>';
    s += '<circle cx="120" cy="105" r="72" stroke="currentColor" stroke-width="2" fill="none"/>';
    s += '<circle cx="110" cy="112" r="34" stroke="currentColor" stroke-width="2" fill="none"/>';
    s += '<ellipse cx="205" cy="105" rx="68" ry="44" stroke="currentColor" stroke-width="2" stroke-dasharray="7 4" fill="none"/>';
    s += T(80, 60, "Women") + T(104, 116, "Mothers") + T(240, 109, "Doctors");
    s += '</svg>';
    return wrapSvg(s, 'Every mother is a woman, so Mothers sits wholly inside Women. A doctor may or may not be a woman or a mother, so Doctors overlaps both.');
  })();

  /* Cube net (cross) with opposite faces */
  var NET = (function () {
    var s = '<svg viewBox="0 0 400 190" role="img" aria-label="A cross-shaped cube net with squares A to F; A and C, B and D, E and F are opposite" ' + HEAD + '>';
    function sqr(x, y, t) { return '<rect x="' + x + '" y="' + y + '" width="46" height="46" stroke="currentColor" stroke-width="2" fill="none"/>' + T(x + 23, y + 29, t, ' font-weight="700" font-size="16"'); }
    s += sqr(20, 72, "A") + sqr(66, 72, "B") + sqr(112, 72, "C") + sqr(158, 72, "D") + sqr(66, 26, "E") + sqr(66, 118, "F");
    s += T(302, 56, "Opposite pairs", ' font-weight="700"') + T(302, 84, "A and C") + T(302, 104, "B and D") + T(302, 124, "E and F");
    s += '<path d="M 43 66 Q 89 40 135 66" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>';
    s += T(89, 60, "one square between", ' font-size="10" opacity="0.8"');
    s += '</svg>';
    return wrapSvg(s, 'In a straight row, two squares with exactly one square between them end up on opposite faces of the cube. Squares E and F are the two ends of the column through B.');
  })();

  /* Painted 3x3x3 cube, oblique view */
  var CUBE = (function () {
    var c = 40, x0 = 30, y0 = 90, DX = 42, DY = -36, n = 3, i, j, t, s;
    s = '<svg viewBox="0 0 400 220" role="img" aria-label="A 3 by 3 by 3 cube cut into 27 small cubes: corners, edges, face centres and one hidden centre cube" ' + HEAD + '>';
    for (i = 0; i <= n; i++) {
      t = i / n; var w = (i % n) ? 1 : 2;
      s += L(x0, y0 + i * c, x0 + n * c, y0 + i * c, w); // front horizontals
      s += L(x0 + i * c, y0, x0 + i * c, y0 + n * c, w); // front verticals
      s += L(x0 + i * c, y0, x0 + i * c + DX, y0 + DY, w); // top depth lines
      s += L(x0 + DX * t, y0 + DY * t, x0 + n * c + DX * t, y0 + DY * t, w); // top cross lines
      s += L(x0 + n * c, y0 + i * c, x0 + n * c + DX, y0 + i * c + DY, w); // right depth lines
      s += L(x0 + n * c + DX * t, y0 + DY * t, x0 + n * c + DX * t, y0 + n * c + DY * t, w); // right verticals
    }
    var lab = [["C", "E", "C"], ["E", "F", "E"], ["C", "E", "C"]];
    for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) s += T(x0 + j * c + c / 2, y0 + i * c + c / 2 + 5, lab[i][j], ' font-weight="700"');
    s += T(236, 60, "C  corner: 3 faces", ' text-anchor="start"') + T(236, 84, "E  edge: 2 faces", ' text-anchor="start"') + T(236, 108, "F  face centre: 1 face", ' text-anchor="start"') + T(236, 132, "1 hidden cube: 0 faces", ' text-anchor="start"');
    s += T(236, 164, "8 + 12 + 6 + 1 = 27", ' text-anchor="start" font-weight="700"');
    s += '</svg>';
    return wrapSvg(s, 'A painted 3 × 3 × 3 cube cut into 27 unit cubes (front face labelled). For side n the counts are 8 corners, 12(n − 2) edges, 6(n − 2)² face centres and (n − 2)³ hidden.');
  })();

  /* Triangle with 4 rays from the apex and 2 horizontal lines */
  var TRI = (function () {
    var s = '<svg viewBox="0 0 360 200" role="img" aria-label="A triangle with two lines from the apex to the base and one line across: 12 triangles" ' + HEAD + '>';
    s += '<polygon points="180,16 40,170 320,170" stroke="currentColor" stroke-width="2" fill="none"/>';
    s += L(180, 16, 133.3, 170, 2) + L(180, 16, 226.7, 170, 2);
    s += L(110, 93, 250, 93, 2);
    s += T(180, 10, "apex", ' font-size="11"') + T(36, 186, "P", ' font-size="12"') + T(133, 186, "Q", ' font-size="12"') + T(227, 186, "R", ' font-size="12"') + T(324, 186, "S", ' font-size="12"');
    s += '</svg>';
    return wrapSvg(s, 'Four lines meet at the apex (the two sides and two inside lines), and there are two horizontal lines (the middle one and the base). Triangles = C(4, 2) × 2 = 6 × 2 = <b>12</b>.');
  })();

  /* Mirror image and water image of the letter F */
  var MIRROR = (function () {
    function F(tx, ty, sx, sy) {
      function p(x, y) { return (tx + sx * x) + ',' + (ty + sy * y); }
      return '<polyline points="' + p(0, 60) + ' ' + p(0, 0) + ' ' + p(26, 0) + '" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<line x1="' + (tx) + '" y1="' + (ty + sy * 28) + '" x2="' + (tx + sx * 18) + '" y2="' + (ty + sy * 28) + '" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>';
    }
    var s = '<svg viewBox="0 0 400 190" role="img" aria-label="The letter F reflected in a vertical mirror (left to right) and in water (top to bottom)" ' + HEAD + '>';
    s += F(30, 20, 1, 1) + L(90, 6, 90, 150, 1.5, "5 4") + F(150, 20, -1, 1);
    s += T(90, 172, "Mirror image: left and right swap");
    s += F(250, 15, 1, 1) + L(225, 95, 330, 95, 1.5, "5 4") + F(250, 175, 1, -1);
    s += T(300, 11, "Water image: top and bottom swap", ' font-size="11"');
    s += '</svg>';
    return wrapSvg(s, 'The dashed line is the mirror or the water surface. A mirror image flips the figure left to right; a water image flips it top to bottom. The two are never the same flip.');
  })();

  /* Paper folding and punching */
  var FOLD = (function () {
    var s = '<svg viewBox="0 0 400 190" role="img" aria-label="Paper folded once with a hole punched, and the unfolded sheet showing two holes" ' + HEAD + '>';
    s += '<rect x="20" y="40" width="70" height="100" stroke="currentColor" stroke-width="2" fill="none"/>' + L(90, 40, 90, 140, 3);
    s += '<circle cx="55" cy="90" r="7" stroke="currentColor" stroke-width="2" fill="none"/>';
    s += T(55, 160, "folded in half", ' font-size="11"') + T(90, 32, "fold", ' font-size="11"');
    s += '<path d="M 112 90 L 140 90 M 132 84 L 141 90 L 132 96" stroke="currentColor" stroke-width="2" fill="none"/>';
    s += '<rect x="160" y="40" width="140" height="100" stroke="currentColor" stroke-width="2" fill="none"/>' + L(230, 40, 230, 140, 1.5, "5 4");
    s += '<circle cx="195" cy="90" r="7" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="265" cy="90" r="7" stroke="currentColor" stroke-width="2" fill="none"/>';
    s += T(230, 160, "unfolded: two holes, equal distance from the fold", ' font-size="11"');
    s += '</svg>';
    return wrapSvg(s, 'One fold means each hole is repeated once, as its mirror image across the fold line. Fold twice and every hole becomes four.');
  })();

  /* ============================================================================ DATA SUFFICIENCY */
  LEARN.reasoning.push({
    id: "data-sufficiency", group: "Logic & statements", title: "Data sufficiency (reasoning)",
    sub: "Decide if the statements give enough to answer, without solving for a full answer you do not need",
    tags: ["TCS", "Infosys", "Cognizant", "AMCAT", "CAT"],
    blocks: [
      ["h2", "The idea"],
      ["p", "In a **data sufficiency** question you are given a question and two statements, **I** and **II**. You are *not* asked for the answer. You are asked only whether the statements **contain enough information** to find it. Often the trick is that one statement is enough, or that neither is, even though the question looks easy."],
      ["p", "Treat the two statements as separate witnesses. First test **I alone**, then **II alone**, and only then pool them. Never let what you learned from I leak into your reading of II, or you will choose “both together” when one alone was enough."],
      ["list", [
        "**Sufficient** means the statement leads to **one** definite answer to the question (a clear yes or a clear no is also definite).",
        "**Not sufficient** means two or more answers remain possible: gender unknown, order unknown, direction unknown, or a letter not linked to any code.",
        "The four verdicts you will meet: I alone, II alone, either alone, both together needed. Some papers add “even together, not sufficient”."
      ]],
      ["note", "Do the minimum. Stop as soon as you know the verdict. You are checking whether an answer exists, not computing it in full."],

      ["h2", "Rules"],
      ["formulas", [
        ["Test order", "I alone → II alone → together", "Mark each as Yes (sufficient) or No before you combine"],
        ["Verdict map", "Yes/No → I alone; No/Yes → II alone; Yes/Yes → either; No/No then Yes → both together", "No/No and still stuck together → not sufficient"],
        ["Blood relations", "needs gender and generation gap", "“Sibling of my father” is an uncle only if male"],
        ["Ranking", "needs a complete chain", "P > Q and Q > R gives P > R; P > Q and R > S gives nothing"],
        ["Direction", "needs a distance or direction link", "Two bearings that never share a point cannot be joined"],
        ["Coding", "needs an overlap", "A common word in two coded sentences isolates its code"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Write the verdict beside each statement** (Y or N) before you pick an option. This stops the “both together” reflex.",
        "**Hunt for the hidden gap:** words like “child”, “sibling”, “cousin”, “friend” and names without gender are the usual reasons a statement fails.",
        "**Ranking:** draw a chain with > signs. If the chain does not link the two people asked about, it is not sufficient.",
        "**Direction:** sketch North up. If a statement fixes a single point relative to another, it is enough; if it only gives distance, it is not.",
        "**Coding:** underline the repeated word across the two statements. A code that appears in both sentences gives you the unique link.",
        "**“Only”, “exactly”, “the tallest”:** such words usually make a statement sufficient; “one of”, “some” usually do not."
      ]],
      ["tip", "If a statement gives you information that is true but irrelevant to the question asked (for example how many sisters, when the question asks about gender), it adds nothing. Cross it out."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/data-sufficiency/blood-relations", title: "Blood relations",
        spot: "“How is X related to Y?” or “Is X the uncle of Y?” with two statements describing one link each.",
        method: ["Draw the tree for statement I only; decide if the relation (including gender) is fixed.", "Do the same for statement II alone.", "If neither is complete, join the two trees and check again.", "Pick the verdict."],
        ex: { q: "Is Chetan the uncle of Dipa?  I. Chetan is the brother of Dipa's mother.  II. Dipa is the daughter of Chetan's sister.", steps: ["I: brother of Dipa's mother is her maternal uncle. Male is stated, so it is a clear **yes**", "II: Dipa's mother is Chetan's sister, so Chetan is a sibling of her mother, but Chetan could be a brother or a sister. Not fixed", "Only I answers it"], ans: "Statement I alone is sufficient" },
        shortcut: "The word “brother” or “sister” fixes gender; “sibling”, “child”, “cousin” and a bare name do not. Look for that word first."
      }],
      ["pattern", {
        key: "reasoning/data-sufficiency/ranking", title: "Ranking",
        spot: "“Who is the tallest / lightest / who is above whom?” with comparisons in the statements.",
        method: ["Write each statement as a chain using > or <.", "Check whether a single chain contains everyone the question asks about.", "Join the two chains if they share a person.", "If the question names a specific position (e.g. rank 5th), check whether the numbers add up."],
        ex: { q: "Who is the tallest among P, Q and R?  I. P is taller than Q.  II. Q is taller than R.", steps: ["I alone: P > Q, but R is not placed, so R could be taller than P", "II alone: Q > R, but P is not placed", "Together: P > Q > R, so P is the tallest"], ans: "Both statements together are needed" },
        shortcut: "Two comparisons sharing a middle person (P > Q, Q > R) link into one chain. Two comparisons that share nobody do not."
      }],
      ["pattern", {
        key: "reasoning/data-sufficiency/direction", title: "Direction",
        spot: "“In which direction is B from A?” or “Is B to the north-west of A?” with distances or turns in the statements.",
        method: ["Mark A at the centre of a small sketch.", "Add what statement I tells you; check whether B's position relative to A is fixed.", "Do the same for II alone, then both on one sketch.", "A distance alone never fixes a direction; a bearing alone never fixes a distance."],
        ex: { q: "Is B to the north-west of A?  I. B is 5 m north of C.  II. C is 5 m west of A.", steps: ["I alone: B is north of C, but C's position relative to A is unknown", "II alone: C is west of A, but B is not placed", "Together: C is 5 m west of A and B is 5 m north of C, so B is 5 m west and 5 m north of A: north-west"], ans: "Both statements together are needed" },
        shortcut: "Chain the points A → C → B on a sketch. If the chain reaches B from A, the statements are sufficient together."
      }],
      ["pattern", {
        key: "reasoning/data-sufficiency/coding", title: "Coding",
        spot: "“What is the code for ‘sweet’?” with coded sentences in the statements.",
        method: ["Write the coded sentences under each other.", "Find a word common to two sentences and the code common to the same two coded sentences; that pair is matched.", "Remove matched pairs; if the target word's code is left alone, it is found.", "If a statement alone has two unmatched words and two unmatched codes, it cannot decide."],
        ex: { q: "What is the code for ‘sweet’?  I. ‘sweet tea’ is written ‘ko la’.  II. ‘hot tea’ is written ‘ma la’.", steps: ["I alone: two words, two codes. ‘sweet’ could be ko or la", "II alone: says nothing about ‘sweet’", "Together: ‘tea’ is common to both, and ‘la’ is common to both, so tea = la. Then sweet = ko"], ans: "Both statements together are needed" },
        shortcut: "The word that repeats across the statements and the code that repeats are the same thing. Cancel them and the rest is forced."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Mixing the statements** before testing each alone, so you answer “both together” when I alone was enough.",
        "**Assuming gender** from a name (Mala, Chetan, Jay) when the statement does not say it.",
        "**Solving fully:** you only need to know whether an answer exists, so stop at the verdict.",
        "**Reading “either alone” as “both together”:** choose “either” only when each statement alone gives the answer.",
        "**Chains that do not meet:** P > Q and R > S feel like information but link nobody.",
        "**Using outside knowledge** instead of the statements (for example assuming a boss is older)."
      ]],
      ["warn", "Both statements can be true and consistent with each other and still not answer the question. “Not contradictory” is not the same as “sufficient”."],

      ["h2", "Quick check"],
      ["quiz", ["data-sufficiency-01", "data-sufficiency-04", "data-sufficiency-07", "data-sufficiency-09", "data-sufficiency-02"]]
    ]
  });

  /* ============================================================================ VENN REASONING */
  LEARN.reasoning.push({
    id: "venn-reasoning", group: "Logic & statements", title: "Venn-diagram reasoning",
    sub: "Pick the circles that fit three or four everyday words, and count what lies in each region",
    tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "Cognizant"],
    blocks: [
      ["h2", "The idea"],
      ["p", "A **Venn diagram** draws each group as a circle. How the circles sit tells you the relationship: one circle **inside** another means “every one of these is also one of those”; **overlapping** circles mean some members are shared; **separate** circles mean no overlap at all."],
      ["p", "Two kinds of question appear. In **which diagram fits**, you are given three or four words and must pick the picture whose circles match how the words really relate. In **counting regions**, numbers are placed in a diagram and you must read or add the right regions."],
      ["html", VENN3],
      ["list", [
        "**Inside:** every Pen is a Stationery item. Draw Pen inside Stationery.",
        "**Overlap:** some Doctors are Women, some are not. Draw two crossing circles.",
        "**Separate:** no Cat is a Dog. Draw two circles that do not touch (but both may sit inside a bigger circle such as Animals)."
      ]],

      ["h2", "Rules"],
      ["formulas", [
        ["Two sets", "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)", "40 + 30 − 10 = 60 people in at least one"],
        ["Neither", "total − n(A ∪ B)", "100 − 60 = 40 in neither"],
        ["Only A", "n(A) − n(A ∩ B)", "40 − 10 = 30 speak only Hindi"],
        ["Three sets", "regions inside = 7, plus 1 outside", "Two sets give 3 inside, three sets give 7"],
        ["Exactly two of three", "sum of the three pair-only regions", "Regions 4 + 5 + 6 in the diagram above"],
        ["Total in at least one", "add every region inside the circles", "Never add whole circles, or you count overlaps twice"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Ask “is every X a Y?”** If yes, X goes inside Y. If sometimes, overlap. If never, separate.",
        "**Two things in the same family** (Pen, Pencil, Stationery) sit as separate circles inside the family circle.",
        "**A person can have two roles:** Doctors, Women and Mothers need overlap, because a doctor is not always a woman.",
        "**Fill from the middle outwards** in counting questions: start with the triple overlap, then the pair overlaps, then the single-set parts.",
        "**Whole circle − overlap:** a circle's total includes the overlap, so “only A” always means subtract the shared parts."
      ]],
      ["tip", "Try the extremes. If a diagram would let a thing that is clearly impossible happen (such as a Mother outside Women), eliminate it at once."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/venn-reasoning/which-diagram-fits", title: "Which diagram fits (e.g. doctors, women, mothers)",
        spot: "Three or four words, and several pictures of circles. “Which diagram best shows Doctors, Women, Mothers?”",
        method: ["Take the words two at a time and ask: all, some or none?", "Place any word that is wholly part of another inside it.", "Make overlapping circles for words that share only some members.", "Compare with the options and reject any picture that breaks one of your pairs."],
        ex: { q: "Which diagram represents Doctors, Women, Mothers?", steps: ["Mothers → Women: every mother is a woman, so Mothers inside Women", "Doctors → Women: some doctors are women, some are not, so Doctors overlaps Women", "Doctors → Mothers: a doctor may be a mother, so Doctors also overlaps Mothers"], ans: "Mothers inside Women, and Doctors crossing both (see diagram)" },
        shortcut: "Find the word that is a *type of* another (Mothers of Women) first. That pair fixes the biggest part of the picture."
      }],
      ["html", DWM],
      ["pattern", {
        key: "reasoning/venn-reasoning/counting-regions", title: "Counting regions",
        spot: "Numbers placed in a diagram, with questions like “How many speak only Hindi?” or “How many are in exactly two groups?”",
        method: ["Label each region with its number (or an unknown).", "Work from the overlap that touches the most circles outwards.", "For “only X”, take the circle total and subtract every overlap it shares.", "For “neither”, take the total and subtract everything inside the circles."],
        ex: { q: "Among 100 students, 40 take Hindi, 30 take French and 10 take both. How many take neither?", steps: ["At least one: 40 + 30 − 10 = 60", "Neither = 100 − 60 = 40", "Check: only Hindi 30, only French 20, both 10, neither 40: total 100"], ans: "40" },
        shortcut: "Add the circles, subtract the overlap once, and the rest of the universe is “neither”."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Forcing inside when it is only overlap:** not every doctor is a woman.",
        "**Adding whole circles** and counting the shared part twice.",
        "**Forgetting the outside** region (people in none of the groups).",
        "**Ignoring wording:** “only”, “at least one”, “exactly two” select different regions.",
        "**Treating separate families as overlapping** (Cat and Dog do not overlap, even though both are Animals).",
        "**Believing “some” means “not all”:** in a diagram “some” leaves room for all."
      ]],
      ["warn", "In a three-circle diagram, “belongs to A and B” includes the centre region 7; “belongs to A and B only” does not."],

      ["h2", "Quick check"],
      ["quiz", ["venn-reasoning-01", "venn-reasoning-03", "venn-reasoning-06", "venn-reasoning-07", "venn-reasoning-08"]]
    ]
  });

  /* ============================================================================ CUBES AND DICE */
  LEARN.reasoning.push({
    id: "cubes-dice", group: "Visual reasoning", title: "Cubes & dice",
    sub: "Count painted faces after cutting, read opposite faces from views, and fold nets in your head",
    tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "eLitmus"],
    blocks: [
      ["h2", "The idea"],
      ["p", "A cube has **6 faces, 12 edges and 8 corners**. Cube questions come in two flavours. In **counting questions** a large painted cube is cut into small unit cubes and you count how many have a given number of painted faces. In **dice and net questions** you work out which faces lie opposite each other from several views or from a flat pattern."],
      ["p", "For counting, the whole job is sorting the small cubes by position: corner, edge, face centre or inside. Position tells you how many faces are painted."],
      ["html", CUBE],

      ["h2", "Formulas"],
      ["formulas", [
        ["Cube cut into n × n × n small cubes", "total = n³", "n = 4 gives 64 small cubes"],
        ["3 faces painted (corners)", "8 (for n ≥ 2)", "Always 8, however big the cube"],
        ["2 faces painted (edges)", "12 (n − 2)", "n = 5: 12 × 3 = 36"],
        ["1 face painted (face centres)", "6 (n − 2)²", "n = 5: 6 × 9 = 54"],
        ["0 faces painted (inside)", "(n − 2)³", "n = 5: 27"],
        ["Check", "8 + 12(n − 2) + 6(n − 2)² + (n − 2)³ = n³", "n = 4: 8 + 24 + 24 + 8 = 64"],
        ["Opposite faces of a standard die", "sum = 7", "1–6, 2–5, 3–4"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Think “peel two layers”:** unpainted cubes form an inner cube of side n − 2.",
        "**Corners are always 8**, so you never calculate them.",
        "**Cut cubes before painting?** Then the painted counts change. Read whether the cube is painted *first*, then cut.",
        "**Two colours on opposite faces:** the cubes lying on the top or bottom layer carry the first colour; side-face cubes carry the second.",
        "**Views of a die:** if two faces both touch the same two other faces, they are opposite each other. Faces that share a view are never opposite.",
        "**Nets:** in a straight row, the faces one apart are opposite. In a cross net, the end squares of the long row are adjacent in fold-up, not opposite.",
        "**Standard die:** 1, 2, 3 meet at one corner, and the opposites are 6, 5, 4 respectively."
      ]],
      ["tip", "If a face is visible in a view, the face opposite it cannot be in the same view. Use this to cross out impossible pairings."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/cubes-dice/painted-cube-counting", title: "Painted cube counting",
        spot: "“A cube painted on all faces is cut into 1 cm cubes. How many have exactly two painted faces?”",
        method: ["Find n = side of big cube ÷ side of small cube.", "Pick the right formula by position: corner 8, edge 12(n − 2), face 6(n − 2)², inside (n − 2)³.", "Substitute and check that the four groups add to n³."],
        ex: { q: "A 5 cm cube painted on all faces is cut into 1 cm cubes. How many cubes have exactly one face painted?", steps: ["n = 5, so n − 2 = 3", "One-face cubes: 6 × 3² = 54", "Check: 8 + 36 + 54 + 27 = 125 = 5³"], ans: "54" },
        shortcut: "Always run the check 8 + 12(n−2) + 6(n−2)² + (n−2)³ = n³. If it fails, a formula is wrong."
      }],
      ["pattern", {
        key: "reasoning/cubes-dice/cubes-with-differently-painted-faces", title: "Cubes with differently painted faces",
        spot: "“Top and bottom are red, the four sides are green. How many small cubes have exactly one red face and no green?”",
        method: ["Assign each face its colour and sort cubes by which layers they sit in.", "Cubes on the top or bottom layer carry red; cubes on a side layer carry green.", "Count by layers: first the layer type, then its position (corner, edge or middle).", "Add the groups that satisfy the question."],
        ex: { q: "A 4 cm cube has its top and bottom faces red and its four side faces green. It is cut into 1 cm cubes. How many cubes have exactly one red face and no green face?", steps: ["Red-only cubes lie on the top or bottom layer, in the middle 2 × 2 (not touching a side face)", "Per face: (4 − 2)² = 4", "Two red faces: 4 × 2 = 8"], ans: "8" },
        shortcut: "A cube with no green face must be at least one cube away from every side wall, so only the inner (n − 2)² block on the top or bottom counts."
      }],
      ["pattern", {
        key: "reasoning/cubes-dice/opposite-faces-from-several-views", title: "Opposite faces from several views",
        spot: "Two or three pictures of the same die or cube from different angles; “which face is opposite to 3?”",
        method: ["List the faces visible together in each view; those faces are all adjacent to each other.", "A face that is adjacent to the one you are asking about cannot be opposite to it.", "Find the face that never appears with it in any view.", "Confirm that the remaining pairs are consistent."],
        ex: { q: "Three views of a die show the faces (1, 2, 3), (1, 3, 5) and (1, 2, 4). Which face is opposite 3?", steps: ["1 appears with 2, 3, 4 and 5, so 1 is opposite 6", "2 appears with 1, 3 and 4, so 2 is not opposite 3 or 4: it is opposite 5", "That leaves 3 and 4 as the last pair"], ans: "4" },
        shortcut: "The face that appears with every other face in some view except one has that one as its opposite."
      }],
      ["pattern", {
        key: "reasoning/cubes-dice/standard-dice-rules", title: "Standard dice rules",
        spot: "“On a standard die, what is opposite 2?” or “top shows 4, what is on the bottom?”",
        method: ["Use opposite pairs summing to 7: 1–6, 2–5, 3–4.", "Take the visible face and subtract it from 7 for the hidden one.", "For rolls, remember which face moves to the bottom with each roll."],
        ex: { q: "A standard die shows 2 on top and 3 in front. What is on the bottom and what is on the back?", steps: ["Bottom is opposite top: 7 − 2 = 5", "Back is opposite front: 7 − 3 = 4"], ans: "Bottom 5, back 4" },
        shortcut: "Opposite faces add to 7, so the hidden face is always 7 minus the face you can see. Total of all six faces is 21."
      }],
      ["pattern", {
        key: "reasoning/cubes-dice/nets", title: "Nets",
        spot: "A flat arrangement of six squares; “which cube can be made?” or “which face is opposite to A?”",
        method: ["Find the longest straight row: faces one square apart in that row are opposite.", "For squares above or below the row, the pair on the same column are opposite.", "Check that no two squares of the net lie on top of each other when folded (a 2 × 2 block cannot fold).", "Compare opposite pairs with the cube shown in the options."],
        ex: { q: "In the cross net shown below, which face is opposite to B?", steps: ["The long row is A, B, C, D. B and D have exactly one square (C) between them", "So B is opposite D", "Check the others: A and C are opposite, and E and F (above and below B) are opposite"], ans: "D" },
        shortcut: "Count the squares between two faces in a row: exactly one in between means opposite; none means adjacent."
      }],
      ["html", NET],

      ["h2", "Common traps"],
      ["list", [
        "**Using n instead of n − 2** in the one-face and inside formulas.",
        "**Forgetting corners** are always 8 and not part of the edge count.",
        "**Painting vs cutting:** counts differ if the cube is cut first and painted afterwards.",
        "**Assuming the unseen face:** in a view you see only three faces; the other three are hidden.",
        "**Adjacent vs opposite in a net:** two squares touching in the flat pattern are adjacent on the cube.",
        "**Mixing dice type:** some questions use a non-standard die, so check whether “opposite faces sum to 7” is given."
      ]],
      ["warn", "Never use the 7-rule on a puzzle die unless the question says it is a standard die. Read opposite faces from the views instead."],

      ["h2", "Quick check"],
      ["quiz", ["cubes-dice-01", "cubes-dice-04", "cubes-dice-06", "cubes-dice-08", "cubes-dice-10"]]
    ]
  });

  /* ============================================================================ COUNTING FIGURES */
  LEARN.reasoning.push({
    id: "counting-figures", group: "Visual reasoning", title: "Counting figures",
    sub: "Count triangles, squares, rectangles and line segments systematically, not by eye",
    tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "Capgemini"],
    blocks: [
      ["h2", "The idea"],
      ["p", "In a **counting figure** question you are shown a drawing made of many lines and asked how many triangles, squares, rectangles or straight lines it contains. Counting by eye misses shapes and counts some twice. The reliable way is to **count by the lines that form the shape**, not by looking at the picture."],
      ["p", "A triangle needs three lines; a rectangle needs two horizontal and two vertical lines. Choosing the lines gives each shape exactly once. This turns a visual search into a little arithmetic."],
      ["html", TRI],

      ["h2", "Formulas"],
      ["formulas", [
        ["Triangles with a fan", "C(a, 2) × b", "a lines through the apex, b lines across the base: 4 lines, 2 across gives 6 × 2 = 12"],
        ["Triangles on one base, n parts", "n(n + 1) ÷ 2", "Base cut in 4 parts: 4 × 5 ÷ 2 = 10"],
        ["Squares in an n × n grid", "1² + 2² + … + n²", "4 × 4 grid: 1 + 4 + 9 + 16 = 30"],
        ["Rectangles in an m × n grid", "C(m + 1, 2) × C(n + 1, 2)", "3 × 5: 6 × 15 = 90"],
        ["Squares in an m × n grid", "Σ (m − k + 1)(n − k + 1), k = 1 … min(m, n)", "3 × 4: 12 + 6 + 2 = 20"],
        ["Segments on a line with n points", "n(n − 1) ÷ 2", "5 points on a line: 10 segments"],
        ["Lines through p points, no three in line", "p(p − 1) ÷ 2", "6 points: 15 lines"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Label every point** (A, B, C …) before you count. Then list triangles as triples such as ABC.",
        "**Count by size:** all smallest first, then those made of two parts, then three, and so on.",
        "**Fan with many lines:** use the formula C(a, 2) × b and skip listing.",
        "**Rectangles include squares.** If the question says “rectangles”, add squares in; if it says “other than squares”, subtract.",
        "**Lines with points on them:** a line carrying k points hides k(k − 1)/2 segments, even if only the whole line is drawn.",
        "**Triangles need non-collinear points.** Three points on one line do not make a triangle."
      ]],
      ["tip", "Always check a formula by counting a simple case by hand (for example a 2 × 2 grid has 4 + 1 = 5 squares) before trusting it on the exam figure."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/counting-figures/triangles", title: "Triangles",
        spot: "A big triangle cut by lines from the apex and lines across: “How many triangles are there?”",
        method: ["Count the lines through the apex (a), including the two sides.", "Count the lines across, including the base (b).", "Triangles = C(a, 2) × b: pick two lines from the apex, and one line across.", "If the figure has extra lines, count them separately."],
        ex: { q: "A triangle has two lines drawn from the apex to the base (so four lines meet at the apex counting the two sides) and one line across the middle. How many triangles are there?", steps: ["Lines at apex: a = 4. Pairs: C(4, 2) = 6", "Lines across: the middle one and the base, so b = 2", "Triangles = 6 × 2 = 12"], ans: "12" },
        shortcut: "Pairs of lines at the apex times lines across. Without a cross line you get just C(a, 2) from the base."
      }],
      ["pattern", {
        key: "reasoning/counting-figures/squares-and-rectangles", title: "Squares & rectangles",
        spot: "A grid or a rectangle cut by lines: “How many squares / rectangles are in the figure?”",
        method: ["Count the rows (m) and columns (n) of small boxes.", "Squares: add (m − k + 1)(n − k + 1) for every side size k.", "Rectangles: choose 2 of m + 1 horizontal lines and 2 of n + 1 vertical lines.", "Subtract squares from rectangles if “rectangles that are not squares” is asked."],
        ex: { q: "A 4 × 4 grid. How many squares of every size, and how many rectangles in all?", steps: ["Squares: 16 + 9 + 4 + 1 = 30", "Rectangles: C(5, 2) × C(5, 2) = 10 × 10 = 100", "Non-square rectangles = 100 − 30 = 70"], ans: "30 squares, 100 rectangles" },
        shortcut: "Rectangles = (sum of 1 to m) × (sum of 1 to n). For a 4 × 4 that is 10 × 10."
      }],
      ["pattern", {
        key: "reasoning/counting-figures/lines", title: "Lines",
        spot: "A figure of straight segments or points: “How many straight lines are in the figure?” or “How many line segments?”",
        method: ["Group the segments by direction (horizontal, vertical, slanting each way).", "On each line, count points and use n(n − 1)/2 for segments.", "For points placed apart, use p(p − 1)/2, then subtract the extra when points are collinear."],
        ex: { q: "Six points are marked, and four of them lie on one straight line (no other three are collinear). How many different straight lines pass through at least two of the points?", steps: ["All pairs: C(6, 2) = 15", "The 4 collinear points would give C(4, 2) = 6 pairs but they all lie on a single line, so replace 6 by 1", "15 − 6 + 1 = 10"], ans: "10" },
        shortcut: "Collinear points collapse many pairs into one line: subtract their pairs, add one."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Counting by eye:** shapes made of two or three small parts are the ones you miss.",
        "**Forgetting the big shape** (the whole figure is itself a triangle or square).",
        "**Skipping the side lines** when counting apex lines in a triangle fan.",
        "**Forgetting squares are rectangles** when the question says “rectangles”.",
        "**Counting open shapes:** lines that do not meet inside the figure do not close a triangle or rectangle.",
        "**Counting a collinear triple as a triangle.**"
      ]],
      ["warn", "Do the count twice by different methods (for example by size, then by formula). If the totals differ, one of them has a mistake."],

      ["h2", "Quick check"],
      ["quiz", ["counting-figures-01", "counting-figures-02", "counting-figures-05", "counting-figures-06", "counting-figures-08"]]
    ]
  });

  /* ============================================================================ NON-VERBAL */
  LEARN.reasoning.push({
    id: "non-verbal", group: "Visual reasoning", title: "Non-verbal reasoning",
    sub: "Reflections, folded paper, hidden figures and figure patterns: see the rule, not the picture",
    tags: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "AMCAT", "eLitmus"],
    blocks: [
      ["h2", "The idea"],
      ["p", "**Non-verbal reasoning** replaces words and numbers with figures. There is always a rule underneath: a reflection, a rotation, a count that grows, or a part that moves. Your job is to name the rule in plain words and apply it to the last figure."],
      ["p", "These questions reward a **method over a glance**. Track one feature at a time (the shape, then the shading, then the position), compare it between figures, and eliminate options that break the rule."],
      ["html", MIRROR],

      ["h2", "Rules"],
      ["formulas", [
        ["Mirror image", "left and right swap; top stays top", "Vertical mirror at the side of the figure"],
        ["Water image", "top and bottom swap; left stays left", "Mirror lying flat below the figure"],
        ["Clock in a mirror", "mirror time = 11:60 − time", "4:25 looks like 7:35"],
        ["Paper fold", "holes = layers × punches", "Fold twice, one punch, 4 holes (if the punch is away from the folds)"],
        ["Rotation per step", "360° ÷ number of positions", "90° clockwise each step: 4 positions"],
        ["Symmetric letters (mirror)", "vertical axis: A H I M O T U V W X Y", "These look the same in a side mirror"],
        ["Symmetric letters (water)", "horizontal axis: B C D E H I K O X", "These look the same in water"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Mirror image of a word:** read it backwards, and flip each letter left to right. Letters like A, H, I, M, O, T, U, V, W, X, Y do not change.",
        "**Water image of a word:** the order stays the same and each letter flips top to bottom. B, C, D, E, H, I, K, O, X do not change.",
        "**Paper folding:** unfold in reverse order of folding, copying each hole across the fold line to the other side.",
        "**Embedded figures:** use the unusual angle or corner of the hidden figure as a key and find it in the big one in the same size and orientation.",
        "**Figure series:** compare one feature at a time (rotation, shading, number of sides) between neighbouring figures.",
        "**Pattern completion:** check where lines enter the missing piece and whether the picture needs a particular part to continue."
      ]],
      ["tip", "When two options look very similar, compare the one feature that differs (a gap, a tail, the direction an arrow points) with the original. The odd feature is the answer's tell."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/non-verbal/mirror-images", title: "Mirror images",
        spot: "“Which figure is the mirror image of the given figure (mirror on the right)?”",
        method: ["Imagine the mirror line (vertical, at the side shown).", "Flip the figure left to right; the right-most part of the original becomes the left-most.", "For text, reverse the letter order and flip each letter.", "For a clock, use 11:60 − time."],
        ex: { q: "A clock shows 4:25. What time does its mirror image show?", steps: ["Mirror time = 11:60 − 4:25", "= 7:35"], ans: "7:35" },
        shortcut: "For a clock, subtract from 11:60. For a word in a mirror at the right, the last letter comes first and every letter is flipped."
      }],
      ["pattern", {
        key: "reasoning/non-verbal/water-images", title: "Water images",
        spot: "“Which figure is the water image of the given figure?” (the reflection from the surface below).",
        method: ["Imagine the water as a horizontal line under the figure.", "Flip top to bottom, keeping left and right where they are.", "Letters that are symmetric about a horizontal axis look unchanged."],
        ex: { q: "What is the water image of the word CODE?", steps: ["Water flips top to bottom, so each letter is flipped vertically", "C, O, D and E are all symmetric about a horizontal axis, so each looks the same", "The order stays unchanged"], ans: "CODE (unchanged)" },
        shortcut: "Mirror reverses the left and right order; water leaves the order alone and turns the figure upside down."
      }],
      ["pattern", {
        key: "reasoning/non-verbal/paper-folding-and-punching", title: "Paper folding & punching",
        spot: "A sheet is folded one or two times and a hole is punched; “which shows the unfolded paper?”",
        method: ["Note the order and direction of each fold.", "Unfold the last fold first.", "Reflect each hole across the fold line when you unfold.", "A hole on the fold line becomes one hole spanning both sides."],
        ex: { q: "A square sheet is folded in half (left over right) and a hole is punched near the middle. How many holes appear when it is unfolded, and where?", steps: ["One fold gives two layers, so the punch goes through two layers", "Unfolding copies the hole to the other side of the fold line", "Two holes, equal distance on either side of the crease"], ans: "2 holes, symmetric about the fold line" },
        shortcut: "Holes after unfolding = number of layers at the punch. Fold twice, away from the creases: 4 holes."
      }],
      ["html", FOLD],
      ["pattern", {
        key: "reasoning/non-verbal/embedded-figures", title: "Embedded figures",
        spot: "“Which of the figures (A to D) is hidden in the given figure?”",
        method: ["Look at the answer figure and note its most unusual part (a sharp angle, a tail).", "Search for that part in the big figure.", "Check that the rest of the lines match in size and orientation.", "Reject any option that needs a line the big figure does not have."],
        ex: { q: "A figure is a plain square with a diagonal drawn from corner to corner. Which of these is hidden in it: a right-angled triangle, a pentagon, a circle?", steps: ["The diagonal splits the square into two right-angled triangles", "A pentagon and a circle need lines and curves not in the figure"], ans: "A right-angled triangle" },
        shortcut: "Search for the **odd angle or corner** first. The ordinary lines match almost anything."
      }],
      ["pattern", {
        key: "reasoning/non-verbal/pattern-completion", title: "Pattern completion",
        spot: "A large picture with a piece missing; “which piece completes it?”",
        method: ["Look at where lines or shapes touch the edge of the gap.", "Check which options continue those lines.", "Reject any piece with extra marks or the wrong shading.", "Confirm the symmetry (if the picture is symmetrical, the piece must be too)."],
        ex: { q: "A picture is a circle with a dot at its centre, and a quarter is missing. The edges of the gap show the dot's boundary and the circle's arc. Which piece completes it?", steps: ["The piece must carry the circle's arc on its outer edge", "It must carry part of the central dot at its inner corner", "Reject any piece with a straight outer edge"], ans: "The quarter with the arc outside and the dot's edge inside" },
        shortcut: "Match the **edge crossings** first: every line that reaches the gap must continue into the piece."
      }],
      ["pattern", {
        key: "reasoning/non-verbal/figure-series", title: "Figure series",
        spot: "Four or five figures in a row; “which figure comes next?”",
        method: ["List the features (shape, shading, size, orientation, count).", "Compare neighbouring figures, one feature at a time.", "State the change as a rule (rotates 90° clockwise, gains one side, shading alternates).", "Apply the rule to the last figure."],
        ex: { q: "An arrow points up, right, down, left in the first four figures. Which direction does the fifth figure point?", steps: ["Each step turns the arrow 90° clockwise", "After left comes up again (a full turn is four steps)"], ans: "Up" },
        shortcut: "Rotation usually repeats after 360° ÷ angle steps. A 90° turn has a cycle of 4, so the 5th figure looks like the 1st."
      }],
      ["pattern", {
        key: "reasoning/non-verbal/figure-analogy-and-classification", title: "Figure analogy & classification",
        spot: "“A is to B as C is to ?” with pictures, or “which figure is the odd one out?”",
        method: ["Name how A turns into B (rotate, add a part, change shading, shrink).", "Apply the same change to C.", "For odd-one-out, find the feature three figures share (sides, shading, symmetry).", "Reject options that fit only part of the rule."],
        ex: { q: "A triangle becomes a square, and a square becomes a pentagon. What does a pentagon become?", steps: ["Each step adds one side", "Pentagon (5 sides) becomes a figure with 6 sides"], ans: "A hexagon" },
        shortcut: "Say the change in one sentence before you look at the options."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Mixing mirror and water:** one swaps left and right, the other swaps top and bottom.",
        "**Ignoring the mirror line:** a mirror lying along the top or bottom of the figure acts like water, so check where the line is.",
        "**Unfolding in the wrong order:** you must undo the last fold first.",
        "**Holes on the crease** make one hole across both sides, not two.",
        "**Matching only shape** when the hidden figure also needs the same size and orientation.",
        "**Following one feature** in a series when two features change together (rotation and shading)."
      ]],
      ["warn", "Only the clock-face shortcut 11:60 − time works for mirrors; there is no tidy formula for water images of clocks, so draw them if asked."],

      ["h2", "Quick check"],
      ["quiz", ["non-verbal-01", "non-verbal-03", "non-verbal-05", "non-verbal-08", "non-verbal-10"]]
    ]
  });

  /* ---------- briefs ---------- */
  BRIEFS["reasoning:data-sufficiency"] = "A data-sufficiency question asks only whether the statements give enough information, not what the answer is. Test statement I alone, then II alone, write a Yes or No beside each, and only then combine them. Stop as soon as you know the verdict.\n\nWatch for the hidden gap: unknown gender in blood relations, chains that do not link in ranking, distances without directions, and codes with no overlap. The four patterns here cover blood relations, ranking, direction and coding.";
  BRIEFS["reasoning:venn-reasoning"] = "A Venn diagram shows how groups relate: a circle inside another means every member belongs to both, overlapping circles share some members, and separate circles share none. To pick the right picture, take the words two at a time and ask all, some or none.\n\nFor counting, fill the overlaps first, then subtract them to get the only-parts, and remember the outside region. Add circles and subtract the overlap once: n(A ∪ B) = n(A) + n(B) − n(A ∩ B).";
  BRIEFS["reasoning:cubes-dice"] = "For a cube painted outside and cut into n × n × n pieces, sort the small cubes by position: 8 corners with three faces, 12(n − 2) edge cubes with two, 6(n − 2)² face cubes with one and (n − 2)³ inner cubes with none. Check that they add up to n³.\n\nFor dice, a standard die has opposite faces summing to 7, and faces seen together in one view are never opposite. In a net, two squares with exactly one square between them in a straight row are opposite.";
  BRIEFS["reasoning:counting-figures"] = "Never count shapes by eye. Label the points, then count by the lines that make the shape: two lines through the apex and one line across make a triangle, two horizontal and two vertical lines make a rectangle. Formulas like C(a, 2) × b for a triangle fan do the work for you.\n\nFor grids, squares are the sum of squares 1² + 2² + … + n² and rectangles are C(m + 1, 2) × C(n + 1, 2). For lines, a line with n points hides n(n − 1) ÷ 2 segments.";
  BRIEFS["reasoning:non-verbal"] = "Non-verbal questions hide a simple rule: a mirror swaps left and right, water swaps top and bottom, a fold doubles each hole across the crease, and a series rotates or grows by a fixed step. Name the rule in one plain sentence before you look at the options.\n\nTrack one feature at a time (shape, shading, position), eliminate options that break it, and undo paper folds in reverse order. For a clock in a mirror, subtract the time from 11:60.";
})();
