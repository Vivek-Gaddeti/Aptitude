/* Learn pages for Logical Reasoning, part 3: logical deduction, syllogisms, statements, inequalities, critical reasoning. */
window.LEARN = window.LEARN || {}; LEARN.reasoning = LEARN.reasoning || []; window.BRIEFS = window.BRIEFS || {};
(function () {
  /* ---------- small inline diagrams (stroke / fill use currentColor so they follow the theme) ---------- */
  function circ(cx, cy, r, dash) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.07"' + (dash ? ' stroke-dasharray="6 4"' : '') + '/>';
  }
  function txt(x, y, t, bold, size) {
    return '<text x="' + x + '" y="' + y + '" fill="currentColor" text-anchor="middle"' + (bold ? ' font-weight="700"' : '') + (size ? ' font-size="' + size + '"' : '') + '>' + t + '</text>';
  }
  function svg(vb, label, body) {
    return '<svg viewBox="' + vb + '" role="img" aria-label="' + label + '" style="max-width:420px;width:100%;height:auto" font-size="14">' + body + '</svg>';
  }

  /* the four basic statement types */
  var VENN4 = (function () {
    var s = '';
    // All A are B
    s += circ(105, 60, 46) + circ(105, 66, 22) + txt(105, 24, "B", true) + txt(105, 71, "A", true) + txt(105, 128, "All A are B", false, 13);
    // Some A are B
    s += circ(280, 60, 34) + circ(330, 60, 34) + txt(264, 64, "A", true) + txt(346, 64, "B", true) + txt(305, 66, "×", true, 18) + txt(305, 128, "Some A are B", false, 13);
    // No A is B
    s += circ(80, 190, 28) + circ(150, 190, 28) + txt(80, 195, "A", true) + txt(150, 195, "B", true) + txt(115, 244, "No A is B", false, 13);
    // Some A are not B
    s += circ(280, 190, 34) + circ(330, 190, 34) + txt(262, 194, "A", true) + txt(348, 194, "B", true) + txt(268, 175, "×", true, 18) + txt(305, 244, "Some A are not B", false, 13);
    return '<div class="diagram">' + svg("0 0 420 256", "Venn diagrams for the four basic statements: All A are B, Some A are B, No A is B, Some A are not B", s) +
      '<div class="cap">The cross × marks a region that is known to hold at least one member. A plain circle with nothing marked only shows what is possible.</div></div>';
  })();

  /* two statements: All cats are dogs; Some dogs are birds */
  var VENN2 = (function () {
    var s = circ(150, 100, 80) + circ(130, 106, 36) + circ(240, 100, 60, true);
    s += txt(150, 36, "dogs (B)", true) + txt(130, 110, "cats (A)", true, 12) + txt(262, 70, "birds (C)", true, 12);
    s += txt(205, 106, "×", true, 18);
    return '<div class="diagram">' + svg("0 0 420 200", "Venn diagram: all cats are dogs, some dogs are birds", s) +
      '<div class="cap">All cats sit inside dogs. The cross is a dog that is a bird. It is drawn outside the cat circle, but it may equally lie inside it, so “some birds are dogs” is certain and “some cats are birds” is only possible.</div></div>';
  })();

  /* three statements: Some rivers are lakes; all lakes are seas; no sea is a desert */
  var VENN3 = (function () {
    var s = circ(150, 100, 85) + circ(130, 100, 45) + circ(95, 100, 40) + circ(345, 100, 50);
    s += txt(150, 38, "seas", true, 13) + txt(168, 128, "lakes", true, 12) + txt(60, 158, "rivers", true, 12) + txt(345, 104, "deserts", true, 12);
    s += txt(118, 106, "×", true, 18);
    return '<div class="diagram">' + svg("0 0 420 200", "Venn diagram: some rivers are lakes, all lakes are seas, no sea is a desert", s) +
      '<div class="cap">Lakes sit inside seas and deserts stand far outside seas. The cross (a river that is a lake) therefore lies inside seas and outside deserts, which proves the conclusions. The rest of the rivers can be anywhere.</div></div>';
  })();

  /* possibility: Some poets are singers; no singer is a pilot */
  var VENN_POSS = (function () {
    var s = circ(140, 100, 70) + circ(235, 100, 62) + circ(78, 100, 44, true);
    s += txt(150, 24, "poets", true, 13) + txt(255, 24, "singers", true, 13) + txt(50, 50, "pilots ?", true, 12);
    s += txt(190, 106, "×", true, 18);
    return '<div class="diagram">' + svg("0 0 420 200", "Venn diagram showing that a pilot circle can overlap poets but never singers", s) +
      '<div class="cap">The dashed pilot circle may overlap the poets (only where they are not singers) but must stay clear of singers. So “some poets are pilots” is possible, while “all poets are pilots” is impossible.</div></div>';
  })();

  /* ============================================================================ LOGICAL DEDUCTION */
  LEARN.reasoning.push({
    id: "logical-deduction", group: "Arrangements & puzzles", title: "Logical deduction (eLitmus)",
    sub: "Who is lying, which key is right, what digit is what: assume, test, and let one contradiction do the work",
    tags: ["eLitmus", "TCS", "Infosys", "Wipro", "Capgemini", "AMCAT"],
    blocks: [
      ["h2", "The idea"],
      ["p", "A logical-deduction puzzle gives you a small set of statements, some true and some false, and a rule about how many of each. You must find the one arrangement of truth and lies that breaks **no** rule. Nothing is guessed: every wrong case dies by a contradiction, and the one left standing is the answer."],
      ["p", "The method never changes. **Assume** one statement is true (or one person is honest). **Follow** what that forces. If you reach a clash, the assumption was wrong, so flip it and follow again. Work on the person or statement that is mentioned by the most others, because one assumption about them settles the most."],
      ["list", [
        "**Truth-tellers and liars:** each person always tells the truth or always lies, and they talk about one another.",
        "**Binary / flipped statements:** answer keys, switches or yes-no codes where several attempts have known scores. A wrong answer is the flip of a right one.",
        "**Who is lying:** a fixed number of the statements (often exactly one) is true, and you find the culprit or the owner.",
        "**Cryptarithmetic:** letters stand for digits in a sum or product; use carries and last digits to pin them down."
      ]],

      ["h2", "Rules"],
      ["formulas", [
        ["Truth-teller", "says only true things", "If X says “Y lies”, then Y really lies"],
        ["Liar", "says only false things", "If X says “Y lies”, then Y tells the truth"],
        ["Contradiction", "an assumption that forces a clash is false", "Discard it, flip it, continue"],
        ["Exactly k true", "count the true statements in each case", "Keep the case whose count is exactly k"],
        ["Binary flip", "right ↔ wrong is one flip of T / F", "Score 4 of 5 means exactly one answer differs from the key"],
        ["Score of the complement", "score of the opposite answer sheet = total − score", "A sheet scoring 1 of 5 means its flip scores 4"],
        ["Carry", "carry from adding two digits is 0 or 1", "Two 2-digit numbers sum to under 200, so a leading carry digit is 1"],
        ["Units digit", "units digit of the result depends on the units digits only", "B × A ends in B pins down A and B first"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Start with the person who is talked about most.** One assumption about them decides the others.",
        "**Two statements that cannot both be true, or cannot both be false, are a gift.** “C did it” and “C did not do it” are exactly one true.",
        "**Make a small table** (person × true / false) and cross out cases. Three people means only 8 cases at most.",
        "**Binary keys:** compare two answer sheets position by position. Positions where they agree split the error between them; positions where they differ are where one of the two is right.",
        "**Cryptarithmetic:** look at the leading digits and carries first (the top digit is 1 when two numbers are added), then the units column.",
        "**Always plug the answer back into every statement.** One failed check means a slip."
      ]],
      ["tip", "A liar who says “X is lying” tells you X is honest. Two lies in a row do not cancel in the speaker's own statement, only in what the statement says about the next person."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/logical-deduction/truth-tellers-and-liars", title: "Truth-tellers & liars",
        spot: "“A says B is lying. B says C is lying. C says A and B are both lying. Who is telling the truth?” Everyone is either always honest or always lying.",
        method: ["Assume the first person is honest and follow the chain of what each says.", "If you reach a clash, flip the assumption and follow it again.", "Check the surviving case against every statement."],
        ex: { q: "A says “B is lying”. B says “C is lying”. C says “A and B are both lying”. Each person either always tells the truth or always lies. Who tells the truth?", steps: ["Suppose A is honest. Then B lies, so C is honest (B's claim that C lies is false). But C says A is lying, which contradicts A being honest. So A is not honest.", "A lies, so “B is lying” is false: B is honest.", "B is honest, so “C is lying” is true: C lies. Check C: “A and B are both lying” is false because B is honest, and a liar says something false. All consistent."], ans: "Only B tells the truth; A and C lie" },
        shortcut: "Chains of “X says Y lies” alternate honest, liar, honest … so one clash at the end of the chain kills the whole assumption at once."
      }],
      ["pattern", {
        key: "reasoning/logical-deduction/binary-flipped-statements", title: "Binary / flipped statements",
        spot: "“Three students answered five True / False questions. Their answer sheets and scores are given. What is the key?”",
        method: ["Compare two sheets position by position: note where they agree and where they differ.", "Use the high score to say how many positions of that sheet are wrong, then list where that error can sit.", "Test each possibility against the other scores; one survives."],
        ex: { q: "A 5-question True / False test. Ravi answered T T F T F and scored 4. Meena answered T F F T T and scored 2. Sunita answered F T F F T and scored 1. What is the answer to question 3?", steps: ["Ravi scored 4, so exactly one of his answers is wrong. The key is Ravi's sheet with one flip.", "Ravi and Meena differ only at Q2 and Q5. If the flip is at Q2 or Q5, Meena is right on that question and on Q1, Q3, Q4 as well (they agree there), so she scores 4, not 2. So the flip is at Q1, Q3 or Q4.", "Keys: F T F T F, T T T T F, T T F F F. Score Sunita (F T F F T): 3, 1, 3. Only T T T T F gives 1.", "Check Meena against T T T T F: right at Q1 and Q4 only, score 2. Check Ravi: wrong only at Q3, score 4."], ans: "True (the key is T T T T F)" },
        shortcut: "A sheet with score n − 1 gives the key in at most n guesses: flip each position once, then test the cases against the other sheets."
      }],
      ["pattern", {
        key: "reasoning/logical-deduction/who-is-lying", title: "Who is lying",
        spot: "“Four friends are asked who broke the vase. Exactly one of the four statements is true. Who broke it?”",
        method: ["Write the four statements, each as a claim about the culprit.", "Find statements that are opposite (one is true exactly when the other is false); the one true statement is among them.", "That makes the other statements false; use them to name the culprit and check the count."],
        ex: { q: "A vase was broken by one of A, B, C, D. A: “I did not do it.” B: “C did it.” C: “D did it.” D: “C is lying.” Exactly one of the four statements is true. Who broke the vase?", steps: ["C's statement and D's statement are opposites (D says C's statement is false), so exactly one of them is true. That is the one true statement.", "So A's and B's statements are both false. A's is false: A did it.", "Check: B says C did it, false (A did). C says D did it, false. D says C is lying, true. Exactly one statement is true."], ans: "A broke the vase" },
        shortcut: "Look for a pair of statements that are exact opposites. They use up the single truth and make everything else false."
      }],
      ["pattern", {
        key: "reasoning/logical-deduction/cryptarithmetic", title: "Cryptarithmetic (addition, multiplication)",
        spot: "“AB + BA = CAC”, or “AB × A = CBB”, where each letter is a different digit and the first digit is not zero.",
        method: ["Look at the size of the result: the leading letter of an addition is 1 or a small digit.", "Work column by column from the right, using carries.", "Plug the digits back in and make sure every letter has a different digit."],
        ex: { q: "Each letter is a different digit. Find A + B + C if AB + BA = CAC.", steps: ["Two 2-digit numbers add to less than 200, so the 3-digit answer starts with 1: C = 1, and the answer is 1A1.", "Units column: B + A ends in 1, and the sum is at most 17, so A + B = 11 with a carry of 1.", "Tens column: A + B + carry = 11 + 1 = 12, so the tens digit is 2 and the carry is 1 (the leading 1). So A = 2, hence B = 9.", "Check: 29 + 92 = 121, which reads C A C = 1 2 1. A + B + C = 2 + 9 + 1"], ans: "12" },
        shortcut: "Use the extra leading digit as a free clue. An answer longer than its addends must start with 1."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Stopping at the first case that works.** Check the other cases too; a puzzle has one answer, but only if you tested all of them.",
        "**Forgetting a liar's statement is entirely false.** “A and B are both lying” is false when at least one of A, B is honest, not only when both are.",
        "**Assuming two statements are independent.** Opposite statements (“C did it” / “C did not do it”) are tied together.",
        "**Reading “exactly one true” as “at least one true”.** Count the true statements in each case.",
        "**Leading zeros:** the first digit of a number in a cryptarithm is never 0, and different letters are different digits.",
        "**Skipping the final check.** Substitute back into every statement before choosing."
      ]],
      ["warn", "If your case needs a statement to be both true and false, it is wrong. Do not “fix” it by adjusting another statement; discard the case and move on."],

      ["h2", "Quick check"],
      ["quiz", ["logical-deduction-01", "logical-deduction-03", "logical-deduction-04", "logical-deduction-06", "logical-deduction-09"]]
    ]
  });

  /* ================================================================================== SYLLOGISMS */
  LEARN.reasoning.push({
    id: "syllogisms", group: "Logic & statements", title: "Syllogisms",
    sub: "Draw the circles once: a conclusion follows only if it is true in every drawing",
    tags: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "AMCAT", "Capgemini"],
    blocks: [
      ["h2", "The idea"],
      ["p", "A syllogism gives two or three statements about groups (“All pens are books”) and asks which **conclusions** follow. The statements are to be treated as true even if they sound silly in real life, and a conclusion follows only if it is true in **every** way of drawing the groups, not just in your first picture."],
      ["p", "Draw each group as a circle. “All A are B” puts A inside B. “Some A are B” makes the circles overlap. “No A is B” keeps them apart. Then ask of each conclusion: could I redraw the circles so that it is false? If yes, it does not follow."],
      ["html", VENN4],
      ["list", [
        "**Two and three statements:** chain the circles and read off what is forced.",
        "**Possibility cases:** “it is possible that …” is true if at least one drawing allows it.",
        "**“Only a few”:** means some are, and the rest are not.",
        "**Either–or:** two conclusions on the same pair of groups that are opposites; if neither follows alone, one of them must be true."
      ]],

      ["h2", "Rules"],
      ["table", ["Statement", "Meaning", "Reverses to"], [
        ["All A are B", "A is inside B", "Only “Some B are A” in the usual convention; not “All B are A”"],
        ["Some A are B", "At least one A is a B (maybe all)", "Some B are A"],
        ["No A is B", "The circles do not touch", "No B is A"],
        ["Some A are not B", "At least one A is outside B", "Cannot be reversed"],
        ["Only a few A are B", "Some A are B and some A are not B", "Some B are A"]
      ]],
      ["table", ["First", "Second", "Conclusion that follows"], [
        ["All A are B", "All B are C", "All A are C"],
        ["Some A are B", "All B are C", "Some A are C"],
        ["All A are B", "No B is C", "No A is C"],
        ["Some A are B", "No B is C", "Some A are not C"],
        ["Some A are B", "Some B are C", "Nothing (the two B groups may differ)"],
        ["All A are B", "Some B are C", "Nothing (the C's in B may lie outside A)"]
      ]],
      ["note", "Convention: “Some” means at least one and possibly all. An “all” statement alone does not promise that a group is non-empty, so this site accepts a “Some” conclusion only when it is built from a “Some” statement."],

      ["h2", "Shortcuts"],
      ["list", [
        "**Some + All → Some; All + All → All; All + No → No; Some + No → Some-not.** Memorise these four, everything else gives nothing.",
        "**A chain breaks at two “Some” statements or at a “Some” followed by nothing.** If the middle group is reached only by “Some” from both sides, no link is forced.",
        "**Never promote “Some” to “All”**, and never read a “No” into a “Some … not”.",
        "**Conversion first:** turn “Some A are B” into “Some B are A” and “No A is B” into “No B is A” whenever it makes the chain line up.",
        "**Either–or test:** the two conclusions must share the same two groups and be complements (Some / No, or All / Some-not). Neither can follow on its own.",
        "**Possibility:** try to draw the claim. If a drawing exists, “it is possible” is true; if the statements forbid it, it is false."
      ]],
      ["tip", "For a definite conclusion, try to break it. Redraw so that the conclusion is false while all statements still hold. If you manage, it does not follow; if you cannot, it follows."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/syllogisms/two-statements", title: "Two statements",
        spot: "“All cats are dogs. Some dogs are birds. I. Some cats are birds. II. Some birds are dogs.”",
        method: ["Draw the circles for the two statements.", "For each conclusion, ask if it holds in every drawing.", "Remember that a Some statement can be turned round freely."],
        ex: { q: "Statements: All cats are dogs. Some dogs are birds. Conclusions: I. Some cats are birds. II. Some birds are dogs.", steps: ["Cats are inside dogs; the birds that are dogs form a patch in dogs (the cross).", "The patch can lie outside the cat circle or inside it. So “some cats are birds” is possible but not forced: I does not follow.", "“Some dogs are birds” turns round to “Some birds are dogs”: II follows."], ans: "Only conclusion II follows" },
        shortcut: "All + Some gives nothing between the first and the last group. A Some statement reverses freely, and that is the only thing you can say."
      }],
      ["html", VENN2],
      ["pattern", {
        key: "reasoning/syllogisms/three-statements", title: "Three statements",
        spot: "Three statements link four groups: “Some rivers are lakes. All lakes are seas. No sea is a desert.”",
        method: ["Start from the only Some statement; the cross lives there.", "Follow All arrows forward from the cross and No arrows away from it.", "Test each conclusion as a claim about the cross and its neighbours."],
        ex: { q: "Statements: Some rivers are lakes. All lakes are seas. No sea is a desert. Which of these follow? I. Some rivers are not deserts. II. No lake is a desert. III. All rivers are seas.", steps: ["The river that is a lake is inside seas (All lakes are seas) and so cannot be a desert (No sea is a desert): I follows.", "Lakes are inside seas, seas never meet deserts, so no lake is a desert: II follows.", "Only some rivers are lakes. The other rivers need not be seas: III does not follow."], ans: "I and II follow, III does not" },
        shortcut: "Chain from the Some cross. A conclusion that talks about “all” of the first group almost never follows."
      }],
      ["html", VENN3],
      ["pattern", {
        key: "reasoning/syllogisms/possibility-cases", title: "Possibility cases",
        spot: "“It is possible that …” or “it is a possibility that …” conclusions.",
        method: ["Draw the circles required by the statements.", "Try to draw the claimed relation without breaking any statement.", "If one drawing works, it is possible. If every drawing fails, it is not."],
        ex: { q: "Statements: Some poets are singers. No singer is a pilot. Which is a possibility? I. Some poets are pilots. II. All poets are pilots.", steps: ["The poets who are singers can never be pilots (No singer is a pilot).", "Poets who are not singers may be pilots, so I can be drawn: it is possible.", "If all poets were pilots, the poets who are singers would be pilots too, which is forbidden. II is impossible."], ans: "Only I is a possibility" },
        shortcut: "A claim is impossible when it contradicts a statement directly; otherwise it is usually possible. “All” claims about a group that touches a “No” statement fail."
      }],
      ["html", VENN_POSS],
      ["pattern", {
        key: "reasoning/syllogisms/only-a-few", title: "\"Only a few\"",
        spot: "“Only a few doctors are engineers.” It is two statements in one.",
        method: ["Split it: “Some doctors are engineers” and “Some doctors are not engineers”.", "Use the first half to chain forward and the second half for conclusions about non-members.", "A Some half can be reversed (some engineers are doctors)."],
        ex: { q: "Statements: Only a few doctors are engineers. All engineers are teachers. Which follow? I. Some doctors are teachers. II. Some doctors are not engineers. III. All doctors are teachers.", steps: ["Split: some doctors are engineers, and some doctors are not engineers.", "The doctors who are engineers are teachers, so some doctors are teachers: I follows.", "The second half gives II directly.", "The doctors who are not engineers may or may not be teachers: III does not follow."], ans: "I and II follow, III does not" },
        shortcut: "“Only a few” is “some” and “some not” together, so it also reverses to “some B are A”. It never allows “all” or “none”."
      }],
      ["pattern", {
        key: "reasoning/syllogisms/either-or-pairs", title: "Either–or pairs",
        spot: "Two conclusions on the same pair of groups that are opposites: “I. Some shirts are cotton. II. No shirt is cotton.”",
        method: ["First test each conclusion alone; if one follows, you are done.", "If neither follows, check that they are complements on the same pair of groups.", "Then the answer is “either I or II follows”."],
        ex: { q: "Statements: All shirts are cloth. Some cloth is cotton. Conclusions: I. Some shirts are cotton. II. No shirt is cotton.", steps: ["The cotton cloth may or may not be shirts, so neither conclusion is forced on its own.", "But they are complements on the pair (shirts, cotton): “some” and “none”. In every drawing exactly one of them holds."], ans: "Either I or II follows" },
        shortcut: "The pairs that work: Some / No, All / Some-not. Pairs like All / No or Some / Some-not are not complements."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Using real-world facts.** Cats and dogs are separate in real life; in the question, take the statements as given.",
        "**Reading Some as All,** or “All A are B” as “All B are A”.",
        "**Assuming two “Some” statements join up:** “Some A are B, Some B are C” gives no link between A and C.",
        "**Marking a possibility as definite,** and a definite conclusion as merely possible. Read the exact words of the conclusion.",
        "**Either–or with different pairs:** the two conclusions must be about the same two groups.",
        "**Forgetting conversion:** Some A are B also means Some B are A; No A is B also means No B is A."
      ]],
      ["warn", "Check the answer by trying to make the conclusion false with a legal drawing. If a single such drawing exists, the conclusion does not follow."],

      ["h2", "Quick check"],
      ["quiz", ["syllogisms-01", "syllogisms-04", "syllogisms-06", "syllogisms-08", "syllogisms-09"]]
    ]
  });

  /* =================================================================================== STATEMENTS */
  LEARN.reasoning.push({
    id: "statements", group: "Logic & statements", title: "Statements",
    sub: "Read only what is written: conclusions, assumptions, arguments, actions and causes",
    tags: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "AMCAT", "eLitmus"],
    blocks: [
      ["h2", "The idea"],
      ["p", "These questions give a short statement (a notice, a news item, a remark) and then one or more items to judge. The golden rule: **judge only what the statement supports**. Your own knowledge, opinions or guesses are not allowed to decide."],
      ["p", "Each question type asks a different thing of the statement. A conclusion must be **forced** by it. An assumption must be **taken for granted** by it. An argument must be **relevant and strong**. A course of action must **solve the stated problem**. A cause comes **before** its effect."],
      ["list", [
        "**Conclusions:** what definitely follows from the statement.",
        "**Assumptions:** what the speaker silently takes to be true.",
        "**Arguments:** is the reason strong (relevant and important) or weak (silly, vague or irrelevant)?",
        "**Course of action:** steps that an authority should take to deal with the problem.",
        "**Cause and effect:** which of two statements causes the other, or whether both come from a third cause."
      ]],

      ["h2", "Rules"],
      ["table", ["Question type", "Test to apply"], [
        ["Conclusion", "Is it certainly true given only the statement? Extreme words (all, only, never, always, must) usually fail"],
        ["Assumption", "Negate it. If the statement then makes no sense or collapses, the assumption is implicit"],
        ["Argument", "Strong: directly relevant and important, a real reason. Weak: personal opinion, general remark, or about something other than the question"],
        ["Course of action", "Does it directly deal with the problem, and is it practical and proportionate? Drastic or unrelated steps fail"],
        ["Cause and effect", "Cause comes first and makes the effect likely. Two effects of one cause, or two independent happenings, are also possible"]
      ]],
      ["formulas", [
        ["Conclusion", "must be true on the statement alone", "No outside facts, no extremes"],
        ["Assumption", "unstated and needed", "If it is false, the statement is empty"],
        ["Strong argument", "relevant, specific, important", "Gives a direct reason for or against"],
        ["Weak argument", "vague, irrelevant or trivial", "“Because everybody does it”"],
        ["Action", "addresses the problem described", "Not a punishment, not a vague wish"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Underline the key words** of the statement. A conclusion that uses a stronger word (“all”, “never”) than the statement is almost always wrong.",
        "**Assumption by negation:** put “not” in front of the assumption. If the statement falls apart, it was implicit.",
        "**Advertisements, notices and appeals** assume that the audience will read and follow them, and that the product or step has the claimed effect.",
        "**Arguments:** ask “is this the reason the question is about?”. Mention of money, fairness, safety and health is usually strong; “it is the trend” is weak.",
        "**Course of action:** the best actions investigate, repair or inform. Punishing everyone or doing something unrelated is out.",
        "**Cause and effect:** ask “which one makes the other happen?”. If they are unrelated, say so."
      ]],
      ["tip", "In a pair of statements, ask the question in plain words: “Because of I, did II happen?” Then try the reverse. If neither fits, they are independent or both effects of one cause."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/statements/conclusions", title: "Conclusions",
        spot: "“Statement: … Conclusions: I. … II. … Which follows?”",
        method: ["Read the statement and mark its facts.", "For each conclusion ask: is it definitely true from these facts alone?", "Reject conclusions with extreme words, new facts, or guesses about the future."],
        ex: { q: "Statement: All buses on route 21 will run only until 9 pm from next Monday. Conclusions: I. Passengers wanting to travel on route 21 after 9 pm may have to use other transport. II. Route 21 will be closed permanently.", steps: ["The statement limits timing, not existence of the route.", "After 9 pm there are no buses on route 21, so travellers then need another way: I follows.", "A shorter timetable does not mean permanent closure: II is an unsupported leap."], ans: "Only I follows" },
        shortcut: "A conclusion that restates the statement in other words follows. One that goes beyond it (“permanently”, “everyone”) does not."
      }],
      ["pattern", {
        key: "reasoning/statements/assumptions", title: "Assumptions",
        spot: "“Statement: … Assumptions: I. … II. … Which is implicit?”",
        method: ["Ask what the speaker must believe for the statement to make sense.", "Negate each assumption: does the statement lose its point?", "Keep only those that are needed, and not merely related."],
        ex: { q: "Statement: “Please show your ID card at the gate before you enter the campus.” (notice). Assumptions: I. Entrants have ID cards. II. Without ID cards no one can be a good student.", steps: ["Negate I: nobody has an ID card. The notice becomes pointless, so I is implicit.", "II talks about being a good student, which the notice never mentions: not implicit."], ans: "Only I is implicit" },
        shortcut: "Negation test: if “not I” makes the statement silly, I is an assumption. An assumption is something quietly needed, not something merely true."
      }],
      ["pattern", {
        key: "reasoning/statements/arguments", title: "Arguments (strong / weak)",
        spot: "“Should …? I. Yes, because … II. No, because …”",
        method: ["Look at the question being asked, not at the topic in general.", "Strong: a direct, important reason connected to the question. Weak: opinion, trivial point or unrelated fact.", "Judge each argument separately; both may be strong or both weak."],
        ex: { q: "Should mobile phones be banned inside classrooms? I. Yes, they distract students from the lesson. II. No, because phones were invented only recently.", steps: ["I is a direct reason connected to learning: strong.", "II says nothing about the effect of phones in a class: weak (the age of an invention is irrelevant)."], ans: "Only I is strong" },
        shortcut: "A strong argument answers the question asked. If it would fit any question on the topic, it is weak."
      }],
      ["pattern", {
        key: "reasoning/statements/course-of-action", title: "Course of action",
        spot: "“Statement: a problem is described. Courses of action: I. … II. … Which should be taken?”",
        method: ["Name the problem in a few words.", "A good action investigates, fixes or informs, and is proportionate.", "Reject actions that are drastic, unrelated, or only blame people."],
        ex: { q: "Statement: Many residents of Ward 7 have fallen ill after drinking municipal tap water. Courses: I. The water board should test the supply and fix any contamination at once. II. All residents of the ward should be told to leave the ward.", steps: ["The problem is unsafe tap water. Testing and repairing deals with it directly: I.", "Evacuating a whole ward is drastic and does not fix the water: II."], ans: "Only I should be taken" },
        shortcut: "Pick the step that fixes the cause. Extreme or unrelated steps (shutting a whole town, punishing everybody) are out."
      }],
      ["pattern", {
        key: "reasoning/statements/cause-and-effect", title: "Cause & effect",
        spot: "“Two statements I and II are given. Which is the cause and which the effect?”",
        method: ["Put each statement in simple words.", "Ask which one could make the other happen. Try both directions.", "If neither does, check for a common cause or for independence."],
        ex: { q: "I. Sales of umbrellas rose sharply in the city this month. II. The monsoon arrived two weeks early this year.", steps: ["An early monsoon makes people buy umbrellas.", "Umbrella sales cannot bring the rains."], ans: "II is the cause and I is the effect" },
        shortcut: "Cause first, effect after. If both look like effects, look for the one event behind them."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Using outside knowledge** to accept a conclusion that the statement does not support.",
        "**Extreme words:** “all”, “only”, “never”, “permanently” rarely appear in correct conclusions.",
        "**Confusing assumption with conclusion.** An assumption is needed before the statement; a conclusion comes after it.",
        "**Marking arguments strong because you agree.** Strength is about relevance, not opinion.",
        "**Picking drastic actions** like closing everything or punishing everyone.",
        "**Reversing cause and effect,** or forcing a link between two unrelated events."
      ]],
      ["warn", "“Follows” does not mean “sounds sensible”. Put your finger on the words in the statement that support the conclusion. If you cannot, it does not follow."],

      ["h2", "Quick check"],
      ["quiz", ["statements-01", "statements-04", "statements-06", "statements-08", "statements-10"]]
    ]
  });

  /* ================================================================================= INEQUALITIES */
  LEARN.reasoning.push({
    id: "inequalities", group: "Logic & statements", title: "Inequalities",
    sub: "Chain the symbols, and a conclusion is true only if the chain forces it",
    tags: ["TCS", "Infosys", "Wipro", "Cognizant", "AMCAT", "Capgemini"],
    blocks: [
      ["h2", "The idea"],
      ["p", "An inequality question gives a chain such as **P ≥ Q > R = S ≤ T < U** and asks whether conclusions like “P > S” or “Q > T” are true. You must decide whether the chain **forces** the conclusion, not whether it could be true for some numbers."],
      ["p", "The chain is a path. Two letters are comparable only if you can walk from one to the other with the arrows all pointing the same way. If the path turns round (up and then down), nothing can be said and the answer is “does not follow”."],
      ["list", [
        "**Direct chains:** the symbols are written out as ≥, >, =, ≤, <.",
        "**Coded symbols:** letters like @, #, $, % stand for the relations; translate first.",
        "**Either–or conclusions:** two conclusions that are complements; if neither follows alone, one of them is true."
      ]],

      ["h2", "Rules"],
      ["table", ["Walking the chain", "Result"], [
        ["Same direction, any mix of > and ≥", "Strict (>) if at least one link is strict, otherwise ≥"],
        ["Same direction with = in it", "= passes the relation on unchanged"],
        ["Directions turn round (> then <)", "No relation can be concluded"],
        ["All links are = ", "Equal"],
        ["Only ≥ and ≤ in the chain, same direction", "≥ (or ≤), never strict"]
      ]],
      ["formulas", [
        ["A > B and B ≥ C", "A > C", "At least one strict link makes it strict"],
        ["A ≥ B and B ≥ C", "A ≥ C", "Never A > C"],
        ["A ≥ B and B ≤ C", "nothing", "Turned round"],
        ["A ≥ B and A ≤ B", "A = B", "Opposite signs between the same two letters force equality"],
        ["A ≥ B ≥ C", "A ≥ C; equal only if all are equal", "Never A > C"],
        ["Complement pair", "X ≥ Y and X < Y", "Exactly one is true, always"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Find the two letters of the conclusion on the chain.** Walk between them. Are all arrows the same way? If so, the conclusion may follow; if not, it does not.",
        "**Strict or not:** a “>” conclusion needs at least one strict link on the walk. A “≥” conclusion is happy with any mix.",
        "**Equal letters are one letter:** replace S by R when R = S; then walk.",
        "**Opposite arrows kill a link:** a conclusion mixing a “greater” and a “less” along the walk never follows.",
        "**Coded symbols:** write the key as a small table and replace every symbol with its sign before you read the chain.",
        "**Either–or:** the two conclusions share the same two letters and are complements (> with ≤, ≥ with <, = with ≠). Neither must follow alone, but one of them must be true."
      ]],
      ["tip", "If a conclusion says “=” and the chain has no “=” on the walk, it does not follow; at most “≥” or “≤” is possible."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/inequalities/direct", title: "Direct (A > B ≥ C)",
        spot: "“P ≥ Q > R = S ≤ T < U. Conclusions: I. P > S II. R < U III. Q ≥ T”",
        method: ["Mark each conclusion's two letters on the chain.", "Walk between them and check the arrows go the same way.", "Decide if the strength (strict or not) matches the conclusion."],
        ex: { q: "Statement: P ≥ Q > R = S ≤ T < U. Which of these follow? I. P > S  II. R < U  III. Q ≥ T", steps: ["I: P ≥ Q > R = S gives P > S (one strict link): follows.", "II: R = S ≤ T < U gives R < U (the strict link is T < U): follows.", "III: Q is above S, and T is also above S, but the chain turns round at S. Nothing connects Q and T: does not follow."], ans: "I and II follow, III does not" },
        shortcut: "Walk between the two letters. One turn-round in the walk means “does not follow”."
      }],
      ["pattern", {
        key: "reasoning/inequalities/coded-symbols", title: "Coded symbols",
        spot: "“A # B means A > B, A $ B means A ≥ B, A @ B means A < B, A * B means A = B.” Then “P # Q $ R * S @ T”.",
        method: ["Write the key as a table of symbol → sign.", "Rewrite the whole expression with ordinary signs.", "Treat the conclusions the same way and use the rules for chains."],
        ex: { q: "Key: # is >, $ is ≥, @ is <, * is =. Statement: P # Q $ R * S @ T. Which follow? I. P # S  II. T # R  III. Q # S", steps: ["Rewrite: P > Q ≥ R = S < T.", "I: P > Q ≥ S gives P > S (P > Q is strict): follows.", "II: R = S < T gives T > R: follows.", "III: Q ≥ R = S gives Q ≥ S only. “Q > S” is not forced (Q may equal S): does not follow."], ans: "I and II follow, III does not" },
        shortcut: "Write the plain-sign chain beneath the coded one before you read a single conclusion. Mistakes happen when you translate in your head."
      }],
      ["pattern", {
        key: "reasoning/inequalities/either-or-conclusions", title: "Either–or conclusions",
        spot: "“Statement: P ≥ Q = R < S ≤ T. Conclusions: I. P ≥ S II. P < S. Which follows?”",
        method: ["Test each conclusion alone first.", "If neither follows, check that they are complements on the same two letters.", "If so, either I or II follows."],
        ex: { q: "Statement: P ≥ Q = R < S ≤ T. Conclusions: I. P ≥ S  II. P < S", steps: ["The chain turns round at R: P and S are both above or below R in different directions, so P versus S is open. Neither I nor II follows alone.", "But P ≥ S and P < S are complements on the same pair: exactly one of them is true."], ans: "Either I or II follows" },
        shortcut: "Complements: > with ≤, ≥ with <, = with ≠. Same two letters, opposite meaning, together they cover all cases."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Treating ≥ as >:** P ≥ Q and Q ≥ R does not give P > R.",
        "**Walking past a turn-round:** P ≥ Q ≤ R tells you nothing about P and R.",
        "**Believing “possible” equals “follows”.** The question asks for what is forced.",
        "**Mixing up the direction of a coded symbol,** especially @ and $ in the same question.",
        "**Either–or on different pairs:** the two conclusions must involve the same letters.",
        "**Forgetting that = merges two letters** and so lets you walk across them."
      ]],
      ["warn", "A conclusion with “=” or with “>” needs the right kind of link on the walk. Look at the strength of each link, not just the direction."],

      ["h2", "Quick check"],
      ["quiz", ["inequalities-01", "inequalities-04", "inequalities-05", "inequalities-07", "inequalities-08"]]
    ]
  });

  /* ============================================================================ CRITICAL REASONING */
  LEARN.reasoning.push({
    id: "critical-reasoning", group: "Logic & statements", title: "Critical reasoning",
    sub: "Split a short argument into evidence and conclusion, then strengthen, weaken or test it",
    tags: ["eLitmus", "TCS", "Infosys", "Wipro", "Capgemini", "AMCAT"],
    blocks: [
      ["h2", "The idea"],
      ["p", "A critical-reasoning question gives you a short argument of four or five lines and asks something about it. Every such argument has a **conclusion** (what the author wants you to believe), **evidence** (the reasons offered) and a hidden **assumption** (the gap between the two). All six question types are really about that gap."],
      ["p", "Before you look at the options, find the conclusion. Words like *therefore*, *so*, *hence*, *clearly* and *should* usually flag it. Then say in your own words what must be true for the evidence to support it. Now the options can be judged quickly."],
      ["list", [
        "**Strengthen / weaken:** make the gap between evidence and conclusion safer or riskier.",
        "**Inference:** what must be true, given only the passage.",
        "**Assumption:** what the argument silently needs.",
        "**Main point:** the conclusion itself.",
        "**Paradox:** two facts that seem to clash; pick what lets both be true."
      ]],

      ["h2", "Rules"],
      ["table", ["Question", "What the answer does", "Typical wrong option"], [
        ["Strengthen", "Closes the gap or removes an alternative explanation", "Repeats the evidence or is irrelevant"],
        ["Weaken", "Shows the evidence could arise without the conclusion", "Attacks something the argument never claimed"],
        ["Inference", "Must be true on the passage alone", "Plausible but needs outside facts"],
        ["Assumption", "Needed: its negation breaks the argument", "True and related, but not needed"],
        ["Main point", "The conclusion the rest supports", "A piece of evidence or a side remark"],
        ["Paradox", "Explains why both surprising facts hold", "Denies one of the facts"]
      ]],
      ["formulas", [
        ["Argument", "evidence + assumption → conclusion", "The assumption is the unstated link"],
        ["Strengthen", "support the assumption, or rule out an alternative", "Does not add a brand-new topic"],
        ["Weaken", "attack the assumption, or offer an alternative cause", "Shows another way the evidence can happen"],
        ["Negation test", "negate the option; does the argument fail?", "If yes, it is the assumption"],
        ["Inference", "must be true, not could be true", "Extremes usually fail"]
      ]],

      ["h2", "Shortcuts"],
      ["list", [
        "**Mark the conclusion and the evidence first,** then name the gap in one sentence. Only then read the options.",
        "**Weakening patterns:** an alternative cause, a biased sample, a different cause for the same effect, or the effect appearing without the cause.",
        "**Strengthening patterns:** other causes are ruled out, the sample is representative, or the cause is shown to work in a second case.",
        "**Inference:** use only the words of the passage. Options with “all”, “never”, “only” are suspicious unless the passage says so.",
        "**Assumption by negation:** put “not” in the option. If the argument then falls, it is the assumption.",
        "**Paradox:** look for the option that introduces a new fact explaining both surprising results at once."
      ]],
      ["tip", "Evidence tells you what happened. The conclusion tells you why it happened or what to do. Weakening and strengthening attack the *why*, not the evidence itself."],

      ["h2", "Patterns"],
      ["pattern", {
        key: "reasoning/critical-reasoning/strengthen", title: "Strengthen",
        spot: "“Which of the following, if true, most strengthens the argument?”",
        method: ["State the conclusion and the evidence.", "Name the gap (what else could explain the evidence).", "Choose the option that closes the gap or rules out an alternative."],
        ex: { q: "A council says its new flyover cut travel time: peak-hour trips on the highway fell from 50 to 35 minutes after it opened. Which strengthens the claim? (a) The flyover was built at a high cost. (b) Traffic volume on the highway was the same before and after. (c) Residents prefer a flyover. (d) Fuel prices fell the same year.", steps: ["Conclusion: the flyover caused the faster trips. Gap: maybe fewer vehicles used the road.", "(b) rules out that alternative: with the same traffic, the flyover is the likely cause.", "(a) and (c) do not touch the cause. (d) is irrelevant to the time taken."], ans: "(b) Traffic volume on the highway was the same before and after" },
        shortcut: "Strengthening usually removes an alternative cause. Ask “what else could have produced this?” and pick the option that says it did not."
      }],
      ["pattern", {
        key: "reasoning/critical-reasoning/weaken", title: "Weaken",
        spot: "“Which of the following, if true, most seriously weakens the argument?”",
        method: ["State the conclusion and the evidence.", "Look for an alternative explanation or a flaw in the sample.", "Choose the option that makes the evidence arise without the conclusion."],
        ex: { q: "A company says its new training programme raised sales, because the 40 salespeople who attended earned 20% more than last year. Which weakens the claim? (a) The 40 were picked because they were already the top performers. (b) The programme lasted five days. (c) Some trainees found it tiring. (d) The training was held in Pune.", steps: ["Conclusion: the training raised sales. Gap: perhaps those trained would have sold more anyway.", "(a) gives exactly that alternative: top performers tend to do well regardless.", "(b), (c) and (d) say nothing about whether sales changed because of the training."], ans: "(a) The 40 were picked because they were already the top performers" },
        shortcut: "The strongest weakener offers another reason for the same evidence. Details about length, place or mood are noise."
      }],
      ["pattern", {
        key: "reasoning/critical-reasoning/inference", title: "Inference",
        spot: "“Which of the following can be inferred from the passage?” or “must be true”.",
        method: ["Restate each fact in the passage in short form.", "For each option ask: does this have to be true on these facts alone?", "Reject options that need an outside fact or use an extreme word the passage does not support."],
        ex: { q: "Every employee who completes the safety course receives a badge. Rohit has no badge. Which must be true? (a) Rohit did not complete the safety course. (b) Rohit refused to attend the course. (c) Only employees with a badge are safe. (d) Rohit is a new employee.", steps: ["Course ⇒ badge. Take the contrapositive: no badge ⇒ course not completed.", "(a) follows. (b) adds a reason for not completing; it is not stated. (c) and (d) bring in new facts."], ans: "(a) Rohit did not complete the safety course" },
        shortcut: "“If X then Y” also gives “if not Y then not X”, but never “if Y then X”."
      }],
      ["pattern", {
        key: "reasoning/critical-reasoning/assumption", title: "Assumption",
        spot: "“The argument above assumes which of the following?” or “depends on which assumption?”",
        method: ["State the conclusion and the evidence.", "Name what must be true to link them.", "Check the option by negating it: if the argument collapses, it is the assumption."],
        ex: { q: "Meera argues that because her company's website crashed on sale day, the company should buy more servers. Which does she assume? (a) The crash was caused by too much traffic, not a software fault. (b) The sale was a great success. (c) Competitors have more servers. (d) Servers are cheap.", steps: ["Conclusion: buy more servers. Evidence: the website crashed.", "She needs the crash to be a capacity problem. Negate (a): the crash was a software fault, and then more servers would not help. The argument fails, so (a) is the assumption.", "Negating (b), (c) or (d) leaves the argument standing."], ans: "(a) The crash was caused by too much traffic, not a software fault" },
        shortcut: "Negate each option. The one whose negation breaks the argument is the assumption; the rest are merely related."
      }],
      ["pattern", {
        key: "reasoning/critical-reasoning/main-point", title: "Main point",
        spot: "“Which of the following best states the main point (conclusion) of the passage?”",
        method: ["Look for indicator words: therefore, so, hence, thus, should.", "Ask which sentence the others support. That is the main point.", "Reject options that are just evidence or a side comment."],
        ex: { q: "Disturbed sleep raises the risk of heart disease. Many night-shift workers sleep poorly for days after a shift change. Therefore employers should limit the number of consecutive night shifts. What is the main point?", steps: ["The word “therefore” marks the conclusion.", "The first two sentences are evidence that supports it."], ans: "Employers should limit the number of consecutive night shifts" },
        shortcut: "Ask “why should I believe this sentence?”. A sentence that the others answer is the conclusion; one that answers questions is evidence."
      }],
      ["pattern", {
        key: "reasoning/critical-reasoning/paradox", title: "Paradox",
        spot: "“Which of the following, if true, best resolves the apparent discrepancy?”",
        method: ["State the two facts that seem to clash.", "Look for a new fact that lets both be true together.", "Reject options that deny one of the facts or explain only one."],
        ex: { q: "After a state introduced a helmet law, helmet use among two-wheeler riders rose sharply, yet the recorded number of head injuries in accidents also rose in the next year. Which resolves this? (a) Hospitals began recording every minor head injury, which were earlier left unrecorded. (b) Helmets are made of plastic. (c) The law was passed by the state assembly. (d) Some riders still do not wear helmets.", steps: ["Facts: helmet use up, recorded head injuries also up. We need a reason both can be true.", "(a) says the count changed because of better recording, not because injuries truly rose: both facts fit.", "(d) is true but does not explain a rise. (b) and (c) are irrelevant."], ans: "(a) Hospitals began recording every minor head injury, which were earlier left unrecorded" },
        shortcut: "The right option usually changes what is counted, who is counted, or when it is counted, so both facts hold."
      }],

      ["h2", "Common traps"],
      ["list", [
        "**Choosing an option because it is true,** when it does not touch the gap in the argument.",
        "**Confusing strengthen and weaken** because you forgot to read the question stem.",
        "**Treating a related option as the assumption.** Only the one whose negation breaks the argument counts.",
        "**Extreme words** (“all”, “never”, “only”) in an inference option.",
        "**Picking evidence as the main point.** The conclusion is what the rest tries to prove.",
        "**Resolving a paradox by denying a fact.** The right option accepts both facts."
      ]],
      ["warn", "Read the stem again before choosing. “Weakens”, “strengthens”, “must be true” and “assumes” ask for different things, and the same option can be right for one and wrong for another."],

      ["h2", "Quick check"],
      ["quiz", ["critical-reasoning-01", "critical-reasoning-03", "critical-reasoning-07", "critical-reasoning-09", "critical-reasoning-10"]]
    ]
  });

  /* ================================================================================ BRIEFS */
  BRIEFS["reasoning:logical-deduction"] = "Logical deduction puzzles give you statements from a few people, with a rule such as “exactly one is lying”. You assume one thing, follow what it forces, and drop the case the moment two statements clash. The case that survives every check is the answer.\n\nStart with the person or statement mentioned most often, and look for pairs of statements that are exact opposites. In cryptarithmetic, begin with the carry and the units digit. Always plug the final answer back in.";
  BRIEFS["reasoning:syllogisms"] = "A syllogism gives statements about groups and asks which conclusions follow. Draw each group as a circle: All puts one circle inside another, Some makes them overlap, No keeps them apart. A conclusion follows only if it holds in every legal drawing.\n\nLearn the four safe combinations: Some + All gives Some, All + All gives All, All + No gives No, Some + No gives Some-not. Two Some statements never join up. For either–or, the two conclusions must be complements on the same pair of groups.";
  BRIEFS["reasoning:statements"] = "Statement questions test whether you can stay inside the text. A conclusion must be forced by the statement, an assumption must be needed for it to make sense, an argument must be relevant and important, and a course of action must solve the problem described.\n\nUse the negation test for assumptions, watch for extreme words such as all, only and never, and prefer actions that investigate or fix. For cause and effect, ask which one could make the other happen.";
  BRIEFS["reasoning:inequalities"] = "An inequality question gives a chain of signs and asks what must be true of two letters in it. Walk between them: if all links point the same way the relation follows (strict if any link is strict), and if the chain turns round, nothing follows.\n\nFor coded symbols, translate into ordinary signs first. For either–or conclusions, check that the two statements are complements on the same letters; then one of them is always true.";
  BRIEFS["reasoning:critical-reasoning"] = "A critical-reasoning passage is a short argument: evidence, a conclusion, and a hidden assumption linking them. Find the conclusion first, then name the gap, and judge the options against it.\n\nStrengthening closes the gap or removes another explanation, weakening opens it, an assumption is what breaks the argument when negated, an inference must be true from the passage alone, and a paradox is resolved by a fact that lets both claims hold.";
})();
