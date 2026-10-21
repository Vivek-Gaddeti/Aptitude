/* Learn pages for Quantitative Aptitude (part 4): logarithms, number series, clocks, calendars, statistics, sets and data sufficiency. */
window.LEARN = window.LEARN || {}; LEARN.quant = LEARN.quant || []; window.BRIEFS = window.BRIEFS || {};

/* ---------------------------------------------------------------- Logarithms */
LEARN.quant.push({
  id: "logarithms", group: "Algebra", title: "Logarithms",
  sub: "A logarithm is just a power in disguise, and five laws do almost everything",
  tags: ["TCS", "Infosys", "Wipro", "AMCAT", "eLitmus", "CAT-style"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A **logarithm** answers one question: “to what power must I raise the base to get this number?” Since 2³ = 8, we write **log₂ 8 = 3**. That is all the notation means: log_a N = x is the same statement as aˣ = N."],
    ["p", "Logs matter because they turn **multiplication into addition** and **powers into multiplication**. That is why the laws below are so short, and why a huge number like 3⁴⁰ can be handled with one multiplication."],
    ["list", [
      "**Read it as a question:** log₃ 81 means “3 to what power is 81?” Answer: 4, because 3⁴ = 81.",
      "**Base and number have rules:** the base must be positive and not 1, and the number inside must be positive. You cannot take the log of 0 or of a negative number.",
      "**“log” with no base** means base 10 in these tests. “ln” means base e (rare in placement papers).",
      "**Two anchors to remember:** log_a 1 = 0 (because a⁰ = 1) and log_a a = 1 (because a¹ = a)."
    ]],
    ["note", "If you can write the number as a power of the base (or both as powers of one small number such as 2 or 3), the log is just a ratio of exponents. Try that first before using any formula."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Definition", "log_a N = x  ⇔  aˣ = N", "a > 0, a ≠ 1, N > 0"],
      ["Anchors", "log_a 1 = 0,   log_a a = 1", "also log₁₀ 10ᵏ = k"],
      ["Product law", "log_a (MN) = log_a M + log_a N", "Same base only. Never log(M + N)"],
      ["Quotient law", "log_a (M/N) = log_a M − log_a N", "Not the same as log M ÷ log N"],
      ["Power law", "log_a (Mᵖ) = p · log_a M", "Brings the exponent to the front"],
      ["Change of base", "log_a N = log_b N / log_b a", "Pick any convenient base b (10, or a common power)"],
      ["Reciprocal and chain", "log_a b × log_b a = 1,   log_a b × log_b c = log_a c", "Chains telescope: the middle bases cancel"],
      ["Base as a power", "log_(aᵐ) (Nⁿ) = (n/m) · log_a N", "log₉ 27 = 3/2, log₈ 4 = 2/3"],
      ["Inverse", "a^(log_a N) = N", "Raising to a log undoes the log"],
      ["Number of digits", "Digits of N = ⌊log₁₀ N⌋ + 1", "Whole part of log₁₀ N, plus 1"]
    ]],

    ["h2", "Shortcuts"],
    ["h", "Log values to remember (base 10)"],
    ["table", ["Number", "log₁₀", "Number", "log₁₀"], [
      ["2", "0.3010", "6 = 2 × 3", "0.7781"],
      ["3", "0.4771", "8 = 2³", "0.9030"],
      ["5 = 10 ÷ 2", "0.6990", "9 = 3²", "0.9542"],
      ["7", "0.8451", "12 = 2² × 3", "1.0791"],
      ["4 = 2²", "0.6020", "15 = 3 × 5", "1.1761"],
      ["10", "1", "25 = 5²", "1.3980"]
    ]],
    ["list", [
      "**Only four values are needed:** log 2, log 3, log 5 (= 1 − log 2) and log 7. Break any number into those primes and add. Example: log 12 = 2 log 2 + log 3 = 0.6020 + 0.4771 = 1.0791.",
      "**Same-base sum or difference:** log 25 + log 4 = log 100 = 2. Multiply (or divide) inside and look for a round number.",
      "**Different bases, same family:** write 4, 8, 16 as powers of 2, and 9, 27, 81 as powers of 3. Then log_(aᵐ)(aⁿ) = n/m settles it.",
      "**Equations:** collapse all the logs to one log on each side, then drop the logs. After solving, throw away any value that makes a log argument zero or negative.",
      "**Digit counting:** multiply the exponent by the log of the base, take the whole part and add 1."
    ]],
    ["tip", "Powers of 2 you will use constantly: 2⁵ = 32, 2⁶ = 64, 2⁷ = 128, 2⁸ = 256, 2⁹ = 512, 2¹⁰ = 1024. A question like “log₂ x = 7” is answered at once if these are cold."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/logarithms/laws", title: "Laws of logarithms",
      spot: "A sum or difference of logs to the same base, or “given log 2 and log 3, find log of something else”.",
      method: ["Check that every log has the same base.", "Combine: a sum becomes the log of a product, a difference becomes the log of a quotient, and a coefficient becomes a power.", "Look for a round number inside the log (10, 100, 1000, or a power of the base)."],
      ex: { q: "Simplify log₁₀ 8 + log₁₀ 125 − log₁₀ 10.", steps: ["Sum becomes a product: log₁₀ (8 × 125) = log₁₀ 1000", "Subtracting log₁₀ 10 divides by 10: log₁₀ (1000 / 10) = log₁₀ 100", "log₁₀ 100 = 2"], ans: "2" },
      shortcut: "8 × 125 = 1000 is the classic pair. Also 25 × 4 = 100 and 5 × 2 = 10: look for factors that make a power of 10."
    }],
    ["pattern", {
      key: "quant/logarithms/change-of-base", title: "Change of base",
      spot: "Logs with different bases that are powers of each other, or a chain such as log₃ 5 × log₅ 7 × log₇ 81.",
      method: ["Write each base and number as a power of one small prime if you can.", "Use log_(aᵐ)(aⁿ) = n/m, or change everything to one base.", "For a chain, cancel the middle terms: log_a b × log_b c = log_a c."],
      ex: { q: "Find the value of log₃ 5 × log₅ 7 × log₇ 81.", steps: ["The chain telescopes: log₃ 5 × log₅ 7 × log₇ 81 = log₃ 81", "81 = 3⁴, so log₃ 81 = 4"], ans: "4" },
      shortcut: "In a chain, the first base and the last number are all that survive. Remember log_a b = 1 / log_b a to flip a term."
    }],
    ["pattern", {
      key: "quant/logarithms/log-equations", title: "Logarithmic equations",
      spot: "“Solve for x” where x sits inside a log, or the same unknown appears in two logs.",
      method: ["Combine the logs on each side into a single log (product law for a sum, quotient law for a difference).", "Drop the log, or convert with log_a N = x ⇔ aˣ = N.", "Solve the resulting equation, then reject any root that makes a log argument ≤ 0."],
      ex: { q: "Solve for x: log₃ x + log₃ (x + 6) = 3.", steps: ["Combine: log₃ [x (x + 6)] = 3, so x (x + 6) = 3³ = 27", "x² + 6x − 27 = 0, so (x + 9)(x − 3) = 0, giving x = 3 or x = −9", "x = −9 makes log₃ x undefined, so reject it"], ans: "x = 3" },
      shortcut: "Always substitute back. The squaring step often creates a negative root that does not belong."
    }],
    ["pattern", {
      key: "quant/logarithms/number-of-digits-via-log", title: "Number of digits via log",
      spot: "“How many digits are in aᵇ?” with log 2, log 3 or log 5 given.",
      method: ["Write log₁₀ of the number: exponent × log of the base.", "Take the whole part of the answer.", "Number of digits = whole part + 1."],
      ex: { q: "Using log₁₀ 3 = 0.4771, find the number of digits in 3⁴⁰.", steps: ["log₁₀ 3⁴⁰ = 40 × 0.4771 = 19.084", "Whole part = 19", "Digits = 19 + 1 = 20"], ans: "20 digits (3⁴⁰ = 12,157,665,459,056,928,801)" },
      shortcut: "For a product such as 2ᵃ × 5ᵇ, add the two terms: log = a × 0.3010 + b × 0.6990. If a = b you simply get 10ᵃ."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Splitting a sum:** log (M + N) is not log M + log N. Only log (M × N) splits.",
      "**Confusing quotient with ratio:** log (M/N) = log M − log N, which is not (log M) ÷ (log N).",
      "**Power of a log:** (log M)² is not 2 log M. The power law needs the power inside: log (M²) = 2 log M.",
      "**Digits:** the answer is the whole part **plus 1**. log₁₀ 1000 = 3 and 1000 has 4 digits.",
      "**Flipping the ratio:** log₉ 27 = 3/2 (27 is the bigger number, so the log is more than 1), not 2/3.",
      "**Extraneous roots:** a log equation can give a root that makes some argument negative. Always substitute back.",
      "**Different bases:** you cannot add log₂ 8 and log₃ 9 inside one log. Work each out separately.",
      "**Sign slips:** log of a number below 1 is negative. log₁₀ 0.01 = −2."
    ]],
    ["warn", "Before using any law, check the base. If the bases differ, convert them first. If x is inside a log, check the domain at the end."],

    ["h2", "Quick check"],
    ["quiz", ["logarithms-02", "logarithms-03", "logarithms-05", "logarithms-07", "logarithms-06"]]
  ]
});
BRIEFS["quant:logarithms"] = "A logarithm is a power in disguise: log₂ 8 = 3 because 2³ = 8. Five laws cover almost everything: the log of a product is a sum, of a quotient a difference, a power comes to the front, a different base can be switched with a ratio, and log of the base itself is 1.\n\nIn practice the questions are short. Combine logs into one, spot a round number such as 100 or 1000, write bases as powers of 2 or 3, or count digits as the whole part of the log plus 1. Remember the four values log 2, log 3, log 5 and log 7, and always check the domain when you solve an equation.";

/* ------------------------------------------------------------- Number series */
LEARN.quant.push({
  id: "number-series", group: "Series, clocks & calendars", title: "Number series",
  sub: "Find the rule in under 20 seconds by trying the same short checklist every time",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "Cognizant"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A number series is a list of numbers that follow one hidden rule. Your job is to find the rule and apply it once more. Placement tests set a handful of rule types again and again, so the fastest approach is a **fixed checklist**, not inspiration."],
    ["list", [
      "**Look at the growth first:** slow growth usually means addition or differences, fast growth means multiplication or cubes.",
      "**Test the cheap ideas in order:** differences, then ratios, then squares and cubes, then primes, then a mix.",
      "**If nothing fits, split the series:** odd positions and even positions are often two separate series.",
      "**A rule must work on every term:** if it fails at one place, it is the wrong rule (or that term is the wrong number)."
    ]],
    ["note", "Write the differences between neighbours under the series every time. It takes five seconds and solves about half of all questions."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Arithmetic series (AP)", "Tₙ = a + (n − 1) d", "Constant first difference d"],
      ["Geometric series (GP)", "Tₙ = a rⁿ⁻¹", "Constant ratio r between neighbours"],
      ["Quadratic series", "Tₙ = an² + bn + c", "First differences form an AP, second differences are constant"],
      ["Squares and cubes", "n² ± k, n³ ± k, n³ ± n", "Compare each term with the nearest square or cube"],
      ["Triangular numbers", "n(n + 1)/2", "1, 3, 6, 10, 15, 21, 28, 36 ..."],
      ["Product of neighbours", "n(n + 1), n(n − 1)", "2, 6, 12, 20, 30, 42 ..."],
      ["Growing multiplier", "×1, ×2, ×3, ×4 ...", "Factorial-like: each step uses the next whole number"],
      ["Linear recurrence", "Tₙ₊₁ = a Tₙ + b", "Mixed rule: multiply then add (or subtract)"],
      ["Fibonacci-type", "Tₙ = Tₙ₋₁ + Tₙ₋₂", "Each term is the sum of the previous two"],
      ["Prime-based", "pₙ, pₙ², pₙ³, 2pₙ, pₙ ± 1", "2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37 ..."]
    ]],

    ["h2", "Shortcuts"],
    ["h", "Reference table: squares, cubes and primes"],
    ["table", ["n", "n²", "n³", "n", "n²", "n³"], [
      ["1", "1", "1", "11", "121", "1331"],
      ["2", "4", "8", "12", "144", "1728"],
      ["3", "9", "27", "13", "169", "2197"],
      ["4", "16", "64", "14", "196", "2744"],
      ["5", "25", "125", "15", "225", "3375"],
      ["6", "36", "216", "16", "256", "4096"],
      ["7", "49", "343", "17", "289", "4913"],
      ["8", "64", "512", "18", "324", "5832"],
      ["9", "81", "729", "19", "361", "6859"],
      ["10", "100", "1000", "20", "400", "8000"]
    ]],
    ["p", "**Primes up to 50:** 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47."],
    ["list", [
      "**Checklist order:** (1) differences, (2) differences of differences, (3) ratios, (4) squares / cubes ± k, (5) primes, (6) two interleaved series, (7) ×a + b.",
      "**Differences double or triple?** If the differences themselves are 3, 6, 12, 24 (a GP), the rule is “add a growing amount”.",
      "**Almost a square:** if terms sit one or two away from perfect squares (3, 8, 15, 24 are all one less), the rule is n² − 1.",
      "**Almost double:** if each term is a bit more than twice the previous, try ×2 + 1 or ×2 − 1. Slightly more than triple suggests ×3 + 1.",
      "**Alternating jumps:** if the jumps go up and down regularly, split into odd and even positions."
    ]],
    ["tip", "For a wrong-number question, find the rule from the terms that agree with each other, then check each term. The odd one out is the culprit."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/number-series/differences", title: "Differences (first and second order)",
      spot: "The numbers grow slowly. The gaps between neighbours are a pattern: constant, rising by a fixed step, or squares.",
      method: ["Write the gaps between neighbouring terms.", "If the gaps are not constant, write the gaps of the gaps (second differences).", "Extend the pattern in the last row and add back up."],
      ex: { q: "Find the next number: 3, 7, 13, 21, 31, ?", steps: ["Gaps: 4, 6, 8, 10", "Second gaps are all 2, so the next gap is 12", "Next term = 31 + 12 = 43"], ans: "43" },
      shortcut: "A constant second difference means the series is n² + something. Here the terms are n² + n + 1: 3, 7, 13, 21, 31, 43."
    }],
    ["pattern", {
      key: "quant/number-series/multiplicative", title: "Multiplicative series",
      spot: "Fast growth. Ratios between neighbours are a fixed number, or a number that grows by 1 each time.",
      method: ["Divide each term by the one before it.", "If the ratios are constant it is a GP. If they are 2, 3, 4, 5 ..., the multiplier itself grows.", "Apply the next ratio."],
      ex: { q: "Find the next number: 5, 10, 30, 120, 600, ?", steps: ["Ratios: 10/5 = 2, 30/10 = 3, 120/30 = 4, 600/120 = 5", "The next multiplier is 6", "600 × 6 = 3600"], ans: "3600" },
      shortcut: "A series that grows more than a fixed ratio each step usually has a growing multiplier (×1, ×2, ×3 ...) or a factorial-like rule."
    }],
    ["pattern", {
      key: "quant/number-series/squares-cubes-k", title: "Squares and cubes ± k",
      spot: "Every term is just next to a perfect square or cube, such as 7, 26, 63, 124 (all one less than a cube).",
      method: ["Compare each term with the nearest square (or cube).", "Check that the gap k is the same for every term.", "Continue the base numbers n and apply the same ± k."],
      ex: { q: "Find the next number: 7, 26, 63, 124, ?", steps: ["Terms are one less than cubes: 8 − 1, 27 − 1, 64 − 1, 125 − 1", "The next cube is 6³ = 216", "216 − 1 = 215"], ans: "215" },
      shortcut: "Learn the cubes up to 20 (the table above). Terms that sit one below (or above) each cube follow n³ − 1 (or n³ + 1); likewise 2 or 3 away from squares."
    }],
    ["pattern", {
      key: "quant/number-series/two-interleaved-series", title: "Two interleaved series",
      spot: "The series zigzags (up, down, up) or has gaps that do not follow one rule, but the odd-numbered terms (and the even-numbered terms) each look simple.",
      method: ["Mark positions 1, 3, 5 ... and positions 2, 4, 6 ... separately.", "Find the rule for each sub-series on its own.", "Identify which sub-series the missing term belongs to and extend it."],
      ex: { q: "Find the next number: 5, 3, 10, 6, 15, 12, 20, 24, ?", steps: ["Odd positions (1st, 3rd, 5th, 7th): 5, 10, 15, 20 add 5 each time", "Even positions: 3, 6, 12, 24 double each time", "The 9th term is an odd position, so it is 20 + 5 = 25"], ans: "25" },
      shortcut: "Count positions before you extend. The missing term belongs to whichever sub-series the next position falls in."
    }],
    ["pattern", {
      key: "quant/number-series/mixed", title: "Mixed series (×a + b)",
      spot: "Each term is a bit more (or less) than a multiple of the previous term: 2, 7, 22, 67 is about triple each time.",
      method: ["Divide term 2 by term 1 and look at the remainder. If the ratio is about a, the rule is ×a then ± b.", "Find b from the first pair: b = term₂ − a × term₁.", "Test the same a and b on all other pairs, then apply once more."],
      ex: { q: "Find the next number: 2, 7, 22, 67, 202, ?", steps: ["7 = 2 × 3 + 1, 22 = 7 × 3 + 1, 67 = 22 × 3 + 1, 202 = 67 × 3 + 1", "Rule: multiply by 3 and add 1", "202 × 3 + 1 = 607"], ans: "607" },
      shortcut: "Try ×2 ± 1, ×3 ± 1, ×2 + n (a growing add-on) first. Check the rule on at least three pairs before trusting it."
    }],
    ["pattern", {
      key: "quant/number-series/prime-based", title: "Prime-based series",
      spot: "The terms look random, but are multiples of, or close to, 2, 3, 5, 7, 11, 13, 17 ...",
      method: ["Divide every term by a small number (2 or 3) to see if primes appear.", "Also test squares or cubes of primes, and primes ± 1.", "Take the next prime in the list and apply the same rule."],
      ex: { q: "Find the next number: 6, 10, 14, 22, 26, ?", steps: ["Halve each term: 3, 5, 7, 11, 13, which are consecutive primes", "The next prime is 17", "2 × 17 = 34"], ans: "34" },
      shortcut: "Primes in order: 2, 3, 5, 7, 11, 13, 17, 19, 23. Squares of primes: 4, 9, 25, 49, 121, 169. Memorise both."
    }],
    ["pattern", {
      key: "quant/number-series/wrong-number", title: "Wrong number in the series",
      spot: "“One number in this series is wrong. Which one?” Almost every term follows a clear rule except one.",
      method: ["Find the rule from the terms that obviously agree with each other.", "Check every term against the rule.", "The term that breaks the rule is the answer; the correct value is what the rule gives."],
      ex: { q: "One number is wrong: 2, 6, 12, 20, 31, 42, 56", steps: ["The rule is n(n + 1): 1×2, 2×3, 3×4, 4×5, 5×6, 6×7, 7×8 = 2, 6, 12, 20, 30, 42, 56", "The fifth term should be 30, not 31"], ans: "31 (it should be 30)" },
      shortcut: "Check the ends and the middle against the rule first. The wrong number is often the one that breaks the pattern of the gaps."
    }],
    ["pattern", {
      key: "quant/number-series/missing-number", title: "Missing number inside the series",
      spot: "A gap in the middle, with terms known on both sides, so you can use the end value to confirm the rule.",
      method: ["Find the rule from the terms around the gap, and from the gaps between them.", "Fill the gap with the rule.", "Check that the next known term follows from your answer."],
      ex: { q: "Find the missing number: 1, 4, 10, 22, ?, 94", steps: ["Gaps: 3, 6, 12 (each double the last), so the next gaps are 24 and 48", "Missing term = 22 + 24 = 46", "Check: 46 + 48 = 94, which matches"], ans: "46" },
      shortcut: "Use the known term after the gap as a free check on your answer."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Fitting a rule to the first three terms only:** test it on every pair. Many rules look right early on.",
      "**Missing the second layer:** if the gaps are not constant, look at the gaps of the gaps before giving up.",
      "**Counting positions wrongly in interleaved series:** the 9th term of a 2-series list belongs to the series of odd positions.",
      "**Confusing n² and n(n + 1):** 25 is a square, 30 is 5 × 6. Neighbouring squares differ by odd numbers (3, 5, 7, 9).",
      "**Forgetting primes ± 1:** 4, 6, 8, 12, 14 are each one more than a prime (3, 5, 7, 11, 13). Test p ± 1 as well as p.",
      "**Believing the wrong number:** in a wrong-number question, do not rebuild the rule from the suspicious term.",
      "**Arithmetic slips in big steps:** 600 × 6 is 3600, not 3000. Re-multiply once before choosing."
    ]],
    ["warn", "If two different rules fit the given terms, keep the simpler one, and make sure the answer you choose is among the options."],

    ["h2", "Quick check"],
    ["quiz", ["number-series-02", "number-series-04", "number-series-05", "number-series-06", "number-series-09"]]
  ]
});
BRIEFS["quant:number-series"] = "A number series hides one rule. Placement papers use the same few rules again and again: constant or growing differences, a fixed or growing multiplier, squares and cubes with a small adjustment, primes, two separate series woven together, and the mixed rule multiply-then-add.\n\nDo not guess. Write the gaps under the numbers, then the gaps of the gaps, then the ratios, then compare with squares, cubes and primes. If nothing fits, split the odd and even positions. For a wrong number, find the rule from the terms that agree and test every term; for a missing number, check your answer against the next known term.";

/* -------------------------------------------------------------------- Clocks */
LEARN.quant.push({
  id: "clocks", group: "Series, clocks & calendars", title: "Clocks",
  sub: "Two hands, two speeds: everything follows from 6° and 0.5° per minute",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "Cognizant"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A clock face is a circle of **360°** with 12 numbers, so each hour mark is **30°** apart and each minute mark is **6°**. Everything in this topic comes from how fast the two hands move."],
    ["list", [
      "**Minute hand:** goes round 360° in 60 minutes, so **6° per minute**.",
      "**Hour hand:** goes round 360° in 12 hours, so **30° per hour** and **0.5° per minute**.",
      "**Relative speed:** the minute hand gains 6 − 0.5 = **5.5° per minute** on the hour hand. Every “when will the hands …” question uses this number.",
      "**Angle between hands** is always measured as the smaller angle (at most 180°). If you get more than 180°, subtract it from 360°."
    ]],
    ["html", `<div style="text-align:center;margin:.8rem 0"><svg viewBox="0 0 200 200" width="100%" style="max-width:300px" role="img" aria-label="Clock face at 10:10. The minute hand points at 60 degrees from 12, the hour hand at 305 degrees, and the angle between them across the 12 is 115 degrees." stroke="currentColor" fill="none" stroke-width="1.6" stroke-linecap="round">
<circle cx="100" cy="100" r="88"/>
<g stroke-width="1.2"><line x1="100" y1="12" x2="100" y2="22"/><line x1="144" y1="23.8" x2="139" y2="32.5"/><line x1="176.2" y1="56" x2="167.5" y2="61"/><line x1="188" y1="100" x2="178" y2="100"/><line x1="176.2" y1="144" x2="167.5" y2="139"/><line x1="144" y1="176.2" x2="139" y2="167.5"/><line x1="100" y1="188" x2="100" y2="178"/><line x1="56" y1="176.2" x2="61" y2="167.5"/><line x1="23.8" y1="144" x2="32.5" y2="139"/><line x1="12" y1="100" x2="22" y2="100"/><line x1="23.8" y1="56" x2="32.5" y2="61"/><line x1="56" y1="23.8" x2="61" y2="32.5"/></g>
<g fill="currentColor" stroke="none" font-size="13" text-anchor="middle" font-family="inherit"><text x="100" y="40">12</text><text x="166" y="105">3</text><text x="100" y="170">6</text><text x="34" y="105">9</text></g>
<line x1="100" y1="100" x2="153.7" y2="69" stroke-width="2.4"/>
<line x1="100" y1="100" x2="67.2" y2="77.1" stroke-width="4.2"/>
<circle cx="100" cy="100" r="3" fill="currentColor"/>
<path d="M80.3 86.2 A24 24 0 0 1 120.8 88" stroke-dasharray="3 3" stroke-width="1.4"/>
<g fill="currentColor" stroke="none" font-family="inherit"><text x="100" y="66" font-size="13" font-weight="600" text-anchor="middle">115°</text><text x="100" y="140" font-size="12" text-anchor="middle">10:10</text></g>
</svg></div>`],
    ["p", "At 10:10 the minute hand is at 10 × 6 = 60° from the 12, and the hour hand is at 10 × 30 + 10 × 0.5 = 305°. They are 245° apart one way, so the smaller angle is 360 − 245 = **115°**, the arc drawn through the 12."],
    ["note", "Think of the minute hand as chasing the hour hand at 5.5° per minute. “Coincide” means a gap of 0°, “opposite” a gap of 180°, and “right angle” a gap of 90°."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Angle at h : m", "θ = |30h − 5.5 m|", "If θ > 180°, use 360° − θ. Treat 12 as 0 for h"],
      ["Hands coincide", "m = 60h / 11 minutes past h", "Table below. Happens every 720/11 = 65 5/11 min"],
      ["Hands opposite", "m = (60h − 360)/11, add 720/11 if negative", "h < 6: (60h + 360)/11.  h ≥ 6: (60h − 360)/11. One time per hour"],
      ["Hands at 90°", "m = (60h − 180)/11 or (60h − 540)/11", "Add 720/11 to a negative value, then keep 0 ≤ m < 60"],
      ["Any angle θ", "m = (60h − 2θ)/11 or (60h − 2(360 − θ))/11", "Same rule: add 720/11 if negative, keep 0 ≤ m < 60"],
      ["Gain or loss", "Clock time = true time × (60 + g)/60", "g = minutes gained per hour (use − g for a slow clock)"],
      ["Correct again", "12 hours (720 min) of error", "Time = 720 ÷ (minutes gained or lost per hour) hours"],
      ["Mirror image", "Actual time = 11 : 60 − shown time", "Subtract from 12:00 if you prefer. 12:xx → treat 12 as 0"],
      ["Counts in 12 h / 24 h", "Coincide 11 / 22, opposite 11 / 22, right angle 22 / 44", "Hands coincide once every 65 5/11 min"]
    ]],

    ["h2", "Shortcuts"],
    ["h", "When do the hands coincide after h o'clock?"],
    ["table", ["After", "Minutes past", "After", "Minutes past"], [
      ["12", "0 (exactly at 12)", "6", "32 8/11"],
      ["1", "5 5/11", "7", "38 2/11"],
      ["2", "10 10/11", "8", "43 7/11"],
      ["3", "16 4/11", "9", "49 1/11"],
      ["4", "21 9/11", "10", "54 6/11"],
      ["5", "27 3/11", "11", "none (next is 12:00)"]
    ]],
    ["list", [
      "**Angle at h:m:** compute 30h − 5.5 m. At 10:10 that is 300 − 55 = 245, and 360 − 245 = 115°.",
      "**Whole hours:** the angle at h o'clock is 30h (or 360 − 30h if bigger). 4 o'clock is 120°, 8 o'clock is also 120°.",
      "**Gain per day:** a clock gaining g minutes per hour is g × 24 minutes ahead after a day.",
      "**Mirror:** subtract the shown time from 11:60 (that is 12:00). 3:40 in the mirror means 11:60 − 3:40 = 8:20.",
      "**Counting:** in 12 hours the hands coincide 11 times, not 12, because the 11th and 12th meetings are the same moment (12:00)."
    ]],
    ["tip", "A clock that is correct now is correct again after gaining or losing 12 hours. A clock gaining 2 minutes per hour loses synchronisation after 720 ÷ 2 = 360 hours = 15 days."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/clocks/angle-at-a-time", title: "Angle at a given time",
      spot: "“What is the angle between the hands at 10:10?” or “at 4:50”. A specific time is given.",
      method: ["Hour hand position = 30h + 0.5 m degrees from the 12.", "Minute hand position = 6 m degrees from the 12.", "Take the difference, and if it exceeds 180° subtract it from 360°."],
      ex: { q: "Find the angle between the hands at 10:10.", steps: ["Hour hand = 30 × 10 + 0.5 × 10 = 305°", "Minute hand = 6 × 10 = 60°", "Difference = 245°, so the angle is 360° − 245° = 115°"], ans: "115°" },
      shortcut: "Use |30h − 5.5 m|: at 10:10 it is |300 − 55| = 245°, then 360 − 245 = 115°."
    }],
    ["pattern", {
      key: "quant/clocks/coinciding-opposite-right-angle", title: "Coinciding, opposite and right-angle times",
      spot: "“At what time between 5 and 6 are the hands at right angles?” or “when do they first coincide after 7?”",
      method: ["At h o'clock the hour hand leads by 30h degrees. The minute hand must gain (or lose) the right amount.", "At h o'clock the minute hand (on the 12) is 30h° behind the hour hand. For a right angle it must gain 30h − 90° (to be 90° behind) or 30h + 90° (to be 90° ahead). Time = gain ÷ 5.5.", "So a right angle usually happens twice in an hour; coinciding and opposite happen once."],
      ex: { q: "At what times between 5 and 6 are the hands at right angles?", steps: ["At 5:00 the hour hand is 150° ahead. Gain needed: 150 − 90 = 60° or 150 + 90 = 240°", "m = 60 / 5.5 = 10 10/11 minutes, or m = 240 / 5.5 = 43 7/11 minutes", "Times: 5:10 10/11 and 5:43 7/11"], ans: "5:10 10/11 and 5:43 7/11" },
      shortcut: "For 90°, m = (60h − 180)/11 or (60h − 540)/11 (add 720/11 if negative): h = 5 gives 120/11 = 10 10/11 and −240/11 + 720/11 = 480/11 = 43 7/11. For coincidence, m = 60h/11, so after 7 it is 420/11 = 38 2/11 min past."
    }],
    ["pattern", {
      key: "quant/clocks/gaining-and-losing-clocks", title: "Gaining and losing clocks",
      spot: "A clock gains or loses some minutes per hour, set right at a certain time, and you want the time shown (or the true time) later.",
      method: ["Work out the clock minutes per true hour: 60 + g for a fast clock, 60 − g for a slow clock.", "Equate clock time and true time through that ratio: clock elapsed ÷ true elapsed = (60 ± g)/60.", "Add the elapsed time to the starting time."],
      ex: { q: "A clock loses 5 minutes every hour. It was set right at 7 AM and now shows 6 PM. What is the true time?", steps: ["Clock elapsed = 11 hours = 660 clock minutes", "In one true hour the clock moves 55 minutes, so true time = 660 ÷ 55 = 12 hours", "True time = 7 AM + 12 h = 7 PM"], ans: "7 PM" },
      shortcut: "A fast clock shows more time than the true time, a slow clock less. For a total error of 12 hours the clock is correct again."
    }],
    ["pattern", {
      key: "quant/clocks/clock-in-a-mirror", title: "Clock seen in a mirror",
      spot: "“The clock seen in a mirror shows 4:25. What is the actual time?”",
      method: ["Mirror time and actual time add up to 12 hours (11:60).", "Subtract the mirror time from 11:60.", "Treat 12 as 0 when subtracting."],
      ex: { q: "A clock in a mirror shows 4:25. What is the actual time?", steps: ["Actual = 11:60 − 4:25", "= 7:35"], ans: "7:35" },
      shortcut: "Hours: subtract from 11. Minutes: subtract from 60. For 12:20 in a mirror, the actual time is 11:40."
    }],
    ["pattern", {
      key: "quant/clocks/how-many-times-a-day", title: "How many times in a day or interval",
      spot: "“How many times do the hands coincide (or are opposite, or at right angles) between two given times, or in a day?”",
      method: ["Use the standard counts: in 12 hours 11 coincidences, 11 opposite positions, 22 right angles. In 24 hours: 22, 22, 44.", "For a shorter interval, list the actual times (use the coincide table) and count those inside it.", "Check the endpoints: a time exactly at the boundary is counted only if the question includes it."],
      ex: { q: "How many times do the hands coincide between 3 PM and 9 PM?", steps: ["Coincide times after 3, 4, 5, 6, 7, 8 o'clock: 3:16 4/11, 4:21 9/11, 5:27 3/11, 6:32 8/11, 7:38 2/11, 8:43 7/11", "The next one is 9:49 1/11, which falls after 9:00 PM", "Count = 6"], ans: "6 times" },
      shortcut: "In 12 hours the hands coincide 11 times, are opposite 11 times and are at right angles 22 times. In a day, double those: 22, 22, 44."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Forgetting the hour hand moves:** at 4:20 the hour hand is not on the 4. It has moved 0.5° × 20 = 10° past it.",
      "**Giving the reflex angle:** the answer is the smaller angle. If you get 245°, say 115°.",
      "**12 as 12:** in 30h − 5.5 m use h = 0 for 12 o'clock. At 12:30 the angle is |0 − 165| = 165°.",
      "**Counting 12 coincidences in 12 hours:** it is 11, because the 12th coincidence is the same as the first of the next cycle.",
      "**Mixing up fast and slow:** when a clock gains time, it shows MORE than the true time. Check the sign before answering.",
      "**Mirror at exact hours:** 6:00 and 12:00 look the same in a mirror, while 3:00 looks like 9:00. Use 11:60 − time and simplify.",
      "**Right angles at 3:00 and 9:00:** at those exact times the hands are already at 90°, so “between 3 and 4” can also include 3:00 itself. Read the question for inclusive or not.",
      "**True minutes vs clock minutes:** gain-and-loss answers depend on which time the question asks for. Write which is which."
    ]],
    ["warn", "Before you answer, ask: is it the smaller angle, which hand is ahead, and is the time asked in true minutes or in minutes shown by the faulty clock?"],

    ["h2", "Quick check"],
    ["quiz", ["clocks-01", "clocks-05", "clocks-03", "clocks-06", "clocks-08"]]
  ]
});
BRIEFS["quant:clocks"] = "The minute hand moves 6 degrees per minute and the hour hand 0.5 degrees per minute, so the minute hand gains 5.5 degrees per minute. The angle at h:m is |30h − 5.5m|, shown as the smaller angle. Coinciding, opposite and right-angle questions all ask how long the minute hand needs to gain a particular angle.\n\nFor a clock that gains or loses time, think in clock minutes per true hour. For mirror images, subtract the shown time from 11:60. In 12 hours the hands coincide 11 times and are opposite 11 times, and they make a right angle 22 times; double those for a full day.";

/* ----------------------------------------------------------------- Calendars */
LEARN.quant.push({
  id: "calendars", group: "Series, clocks & calendars", title: "Calendars",
  sub: "Count odd days, take the remainder after dividing by 7, and read off the weekday",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "Cognizant"],
  blocks: [
    ["h2", "The idea"],
    ["p", "Weekdays repeat every 7 days. So to find a weekday, you only need to know how many days are **left over** after you remove complete weeks. Those left-over days are called **odd days**."],
    ["list", [
      "**An ordinary year** has 365 days = 52 weeks + **1** odd day. So the same date moves one weekday forward each year.",
      "**A leap year** has 366 days = 52 weeks + **2** odd days. A leap year is divisible by 4, but a century year (1700, 1800, 1900, 2100) is a leap year only if divisible by 400. So 2000 was a leap year and 1900 was not.",
      "**Numbering the days:** Sunday = 0, Monday = 1, Tuesday = 2, Wednesday = 3, Thursday = 4, Friday = 5, Saturday = 6. Add the odd days, divide by 7, and the remainder is the day.",
      "**n days after a weekday:** the weekday moves forward by (n mod 7), no matter how large n is."
    ]],
    ["note", "100 years have 24 leap years and 76 ordinary years: 76 + 24 × 2 = 124 odd days = 17 weeks + 5 days, so 100 years have 5 odd days. Learn the century table below and you can handle any date."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Odd days in a year", "Ordinary = 1,  Leap = 2", "365 = 52 × 7 + 1, 366 = 52 × 7 + 2"],
      ["Odd days in n years", "(n + number of leap years) mod 7", "Count leap years carefully in the range"],
      ["Leap year rule", "Divisible by 4; centuries only if divisible by 400", "1900 and 2100 are not leap years; 2000 and 2400 are"],
      ["Odd days in centuries", "100 yr → 5, 200 → 3, 300 → 1, 400 → 0", "A 400-year cycle is a whole number of weeks"],
      ["Day of the week", "(century odd days + year odd days + days elapsed in the year) mod 7", "Sun = 0, Mon = 1 ... Sat = 6"],
      ["n days later", "Shift by n mod 7", "100 days = 14 weeks + 2 days, so + 2"],
      ["Same calendar, ordinary year", "Repeats after 6, 11 (or 12) years", "When the total odd days of the years in between is a multiple of 7"],
      ["Same calendar, leap year", "Repeats after 28 years", "12 or 40 years across a non-leap century"]
    ]],

    ["h2", "Shortcuts"],
    ["h", "Odd days of the months (ordinary year)"],
    ["table", ["Month", "Days", "Odd days", "Odd days before the month starts"], [
      ["January", "31", "3", "0"],
      ["February", "28 (29)", "0 (1)", "3"],
      ["March", "31", "3", "3 (4 in a leap year)"],
      ["April", "30", "2", "6 (0)"],
      ["May", "31", "3", "1 (2)"],
      ["June", "30", "2", "4 (5)"],
      ["July", "31", "3", "6 (0)"],
      ["August", "31", "3", "2 (3)"],
      ["September", "30", "2", "5 (6)"],
      ["October", "31", "3", "0 (1)"],
      ["November", "30", "2", "3 (4)"],
      ["December", "31", "3", "5 (6)"]
    ]],
    ["h", "Odd days of the centuries"],
    ["table", ["Years completed", "Odd days", "Check: the century ended on"], [
      ["100 years", "5", "31 Dec 1700 was a Friday"],
      ["200 years", "3", "31 Dec 1800 was a Wednesday"],
      ["300 years", "1", "31 Dec 1900 was a Monday"],
      ["400 years", "0", "31 Dec 1600 and 31 Dec 2000 were Sundays"]
    ]],
    ["p", "Counting is cumulative from the start of the calendar: 1600 years (a whole number of 400-year blocks) gives 0, so 1700, 1800 and 1900 end with 5, 3 and 1 odd days. To handle the years before a date, split them as 1600 + 300 = 1900 years, which gives 0 + 1 = 1."],
    ["list", [
      "**Recipe:** (odd days of the completed centuries) + (odd days of the completed years in the current century) + (days elapsed in the current year, including the date) and take the remainder after dividing by 7.",
      "**For dates from 2001 onwards:** the 2000 completed years are 5 whole 400-year blocks and give 0 odd days, so you only need the odd days of the years since 2000 plus the days elapsed. 15 August 2001 gives 0 + 0 + 227 mod 7 = 3, a Wednesday.",
      "**Quick anchors:** 1 Jan 2000 was a Saturday and 1 Jan 2001 was a Monday. From a known date, shift by (years + leap days).",
      "**Same-weekday months (ordinary year):** January = October, February = March = November, April = July, September = December.",
      "**One-line step:** from a known date, ordinary year later = + 1 weekday, leap year later = + 2 (when crossing 29 February)."
    ]],
    ["tip", "The 28-year rule works for a leap year only inside the same century. Around a non-leap century year such as 2100, the gap becomes 12 or 40 years."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/calendars/odd-days-and-leap-years", title: "Odd days and leap years",
      spot: "“How many odd days in n years / between two dates?” or “how many leap years are there between …?”",
      method: ["Count the ordinary and leap years in the range (leap if divisible by 4; century years only if divisible by 400).", "Odd days = (years + number of leap years) mod 7.", "For a part of a year, add the odd days of the months."],
      ex: { q: "How many odd days are there in the 30 years from 1991 to 2020?", steps: ["Leap years: 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020, so 8", "Odd days = 30 + 8 = 38", "38 mod 7 = 3"], ans: "3 odd days" },
      shortcut: "Years + leap years, then mod 7. For 100 years the answer is 5, for 200 it is 3, for 300 it is 1 and for 400 it is 0."
    }],
    ["pattern", {
      key: "quant/calendars/day-of-the-week-for", title: "Day of the week for a date",
      spot: "“On what day of the week was 15 August 1947?” A date far from any known reference date.",
      method: ["Odd days of the completed centuries (for 1947: 1900 completed years, which give 1).", "Odd days of the completed years in the current century (46 years, 11 of them leap).", "Odd days of the days elapsed in the current year, including the date, then add and take the remainder mod 7."],
      ex: { q: "On what day of the week was India's independence declared on 15 August 1947?", steps: ["1900 years = 1600 + 300, odd days = 0 + 1 = 1", "1901 to 1946: 46 years with 11 leap years, so 46 + 11 = 57 and 57 mod 7 = 1", "Days elapsed in 1947: 31 + 28 + 31 + 30 + 31 + 30 + 31 + 15 = 227 and 227 mod 7 = 3", "Total = 1 + 1 + 3 = 5, which is Friday"], ans: "Friday" },
      shortcut: "With the “before the month” column of the table: 1 + 1 + 2 + 15 = 19, and 19 mod 7 = 5, again Friday."
    }],
    ["pattern", {
      key: "quant/calendars/n-days-after-monday", title: "“n days after Monday”",
      spot: "A weekday is given and the question asks the weekday n days later (or earlier). It may be given through “day before yesterday”.",
      method: ["First fix today's weekday from the clue.", "Divide n by 7 and keep only the remainder.", "Move forward (or back) that many days."],
      ex: { q: "Today is Thursday. What day of the week will it be 1000 days from now?", steps: ["1000 ÷ 7 = 142 weeks and 6 days left over", "Thursday + 6 days = Wednesday"], ans: "Wednesday" },
      shortcut: "Moving +6 is the same as moving −1. So Thursday + 1000 days is one day before Thursday: Wednesday."
    }],
    ["pattern", {
      key: "quant/calendars/repeating-calendar-years", title: "Repeating calendar years",
      spot: "“The calendar of year Y will be the same as the calendar of which later year?”",
      method: ["The year must be the same type (leap or ordinary).", "Add 1 for each ordinary year and 2 for each leap year after Y, until the total is a multiple of 7.", "The year at which the total is 0 mod 7 and the type matches is the answer."],
      ex: { q: "The calendar of 2021 will be the same as the calendar of which later year?", steps: ["Odd days: 2021 gives 1, 2022 gives 1, 2023 gives 1, 2024 (leap) gives 2, 2025 gives 1, 2026 gives 1", "Running total: 1, 2, 3, 5, 6, 7", "After 2026 the total is 7, which is 0 mod 7, so the calendar repeats in 2027 (also an ordinary year)"], ans: "2027" },
      shortcut: "An ordinary year repeats after 6 years if only one leap year is between, and after 11 years if two leap years are between. A leap year repeats after 28 years (for example 2016 and 2044)."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Treating 1900 or 2100 as leap years:** they are not, because century years must be divisible by 400.",
      "**Counting 25 leap years in 100 years:** it is 24, because the century year is not a leap year.",
      "**Including the date itself twice or not at all:** days elapsed in the year include the date you are asked about, but not any later day.",
      "**Using the wrong February:** in a leap year February has 29 days, which changes every date from March onwards.",
      "**Adding odd days without reducing:** always reduce mod 7 at the end, and be careful with negative shifts when going backwards.",
      "**“Day before yesterday” confusion:** convert the clue to today's weekday first, then count.",
      "**Inclusive ranges:** “1 Jan 1901 to 31 Dec 1950, both days included” is exactly 50 complete years. Do not add an extra day at either end."
    ]],
    ["warn", "Three checks before answering: which centuries are complete, whether the year is a leap year, and whether the day you want is counted inside or outside the range."],

    ["h2", "Quick check"],
    ["quiz", ["calendars-01", "calendars-02", "calendars-04", "calendars-05", "calendars-10"]]
  ]
});
BRIEFS["quant:calendars"] = "Weekdays repeat every 7 days, so only the leftover days after complete weeks, the odd days, matter. An ordinary year has 1 odd day, a leap year 2, and 100, 200, 300 and 400 years have 5, 3, 1 and 0. Century years are leap years only if divisible by 400.\n\nTo find the weekday of a date, add the odd days of the completed centuries, the completed years of the current century, and the days elapsed in the year, then take the remainder after dividing by 7. For a shift of n days, use n mod 7. A calendar repeats when the odd days between two years total a multiple of 7.";

/* ---------------------------------------------------------------- Statistics */
LEARN.quant.push({
  id: "statistics", group: "Stats, sets & DS", title: "Statistics",
  sub: "Mean, median, mode, range and standard deviation, and what happens when every value changes",
  tags: ["TCS", "Infosys", "Wipro", "AMCAT", "eLitmus", "Capgemini"],
  blocks: [
    ["h2", "The idea"],
    ["p", "Statistics here means summarising a list of numbers with one or two values. The three “averages” answer different questions, and you only need to know **how each one is calculated** and **how it reacts when numbers change**."],
    ["list", [
      "**Mean** (the ordinary average): add everything and divide by how many. Sum = mean × count.",
      "**Median:** the middle value once the numbers are sorted. With an even count, take the average of the two middle values.",
      "**Mode:** the value that appears most often. There can be more than one, or none.",
      "**Range:** largest − smallest. It tells you the spread but only uses two values.",
      "**Standard deviation (SD):** how far values typically sit from the mean. Bigger SD means more scattered data."
    ]],
    ["note", "Most questions are about **sums**: if you know mean × count, you can add or remove numbers easily. Rebuild the total, change it, divide again."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Mean", "Mean = sum of values / number of values", "Sum = mean × n"],
      ["Median", "Sort, then middle value (or average of the two middle values)", "n odd: item (n + 1)/2.  n even: average of items n/2 and n/2 + 1"],
      ["Mode", "Most frequent value", "A set can have two modes (bimodal) or none"],
      ["Range", "Largest − smallest", "Unchanged by adding the same number to every value"],
      ["Variance and SD (population)", "σ² = Σ(x − mean)² / n,   SD = √σ²", "Faster form: σ² = Σx²/n − mean²"],
      ["Combined mean", "(n₁ m₁ + n₂ m₂)/(n₁ + n₂)", "Weighted by group size, not a plain average of means"],
      ["Mean of an AP", "(first + last)/2 = middle term", "1 to n: (n + 1)/2"],
      ["Change one value", "New mean = old mean + (change in value)/n", "Replace 12 by 36 in 8 numbers: mean rises by 24/8 = 3"],
      ["Adding / removing a number", "New mean = (old sum ± x)/(n ± 1)", "Rebuild the sum first"],
      ["Empirical relation", "Mode = 3 × Median − 2 × Mean", "For a moderately skewed distribution"]
    ]],

    ["h2", "Shortcuts"],
    ["h", "What happens to the summary when every value changes"],
    ["table", ["Operation on every value", "Mean", "Median", "Range", "SD"], [
      ["Add k", "mean + k", "median + k", "unchanged", "unchanged"],
      ["Multiply by k", "k × mean", "k × median", "|k| × range", "|k| × SD"],
      ["Multiply by k, then add c", "k × mean + c", "k × median + c", "|k| × range", "|k| × SD"]
    ]],
    ["list", [
      "**Keep a running total:** to find a missing value, rebuild the sum (mean × n) and subtract.",
      "**Deviation method:** for an evenly spread set, guess the mean, add the deviations (+ and −), and divide by n. 82, 86, 90, 94, 98 with a guessed mean of 90 gives deviations −8, −4, 0, 4, 8, sum 0, so the mean is exactly 90.",
      "**Equally spaced numbers:** the mean and the median are both the middle value.",
      "**Median needs sorting:** sort first, then count to the middle, even if the numbers are already nearly in order.",
      "**Spread is unaffected by a shift:** adding 10 to every mark does not change the range or the SD."
    ]],
    ["tip", "For standard deviation, use the identity σ² = (mean of squares) − (square of the mean): for 7, 7, 7, 15, 15, 15 that is 137 − 121 = 16, so SD = 4."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/statistics/mean-median-mode", title: "Mean, median and mode",
      spot: "A list of numbers, or a mean plus a few facts about the numbers (a group removed, two groups combined, a value replaced).",
      method: ["Mean: total ÷ count.", "Median: sort, then take the middle (or the average of the two middle values).", "Mode: the value with the highest count. For “find the missing number”, rebuild the total first."],
      ex: { q: "For 6, 11, 4, 11, 8, 11, 15, 10 find the mean, median and mode.", steps: ["Sum = 76, so mean = 76 / 8 = 9.5", "Sorted: 4, 6, 8, 10, 11, 11, 11, 15. The 4th and 5th are 10 and 11, so the median = 10.5", "11 appears three times, so the mode = 11"], ans: "Mean 9.5, median 10.5, mode 11" },
      shortcut: "Mean of equally spaced numbers = average of the first and last. When one value is replaced, the mean changes by (new − old) ÷ n."
    }],
    ["pattern", {
      key: "quant/statistics/range-and-standard-deviation-basics", title: "Range and standard deviation basics",
      spot: "The question asks for the spread of a data set: range, variance, or standard deviation.",
      method: ["Range = largest − smallest.", "Find the mean, then each deviation (x − mean).", "Square the deviations, average them (divide by n for a population), then take the square root."],
      ex: { q: "Find the range and the standard deviation of 7, 7, 7, 15, 15, 15.", steps: ["Range = 15 − 7 = 8", "Mean = 66 / 6 = 11, so every deviation is ±4", "Variance = (6 × 16)/6 = 16 and SD = √16 = 4"], ans: "Range 8, SD 4" },
      shortcut: "If half the data sits d below and half d above the mean, the SD is exactly d. Here d = 4."
    }],
    ["pattern", {
      key: "quant/statistics/effect-of-adding-multiplying-every", title: "Effect of adding or multiplying every value",
      spot: "“Each observation is multiplied by 3 and then 4 is subtracted” and the question asks for the new mean, range, or SD.",
      method: ["Mean and median follow the same operation as the data: new mean = k × mean + c.", "Range and SD ignore the addition and only scale by |k|.", "Apply each rule separately, so you never recompute the data."],
      ex: { q: "A data set has mean 20, range 12 and SD 5. Every value is multiplied by 3 and then 4 is subtracted. Find the new mean, range and SD.", steps: ["New mean = 3 × 20 − 4 = 56", "New range = |3| × 12 = 36", "New SD = |3| × 5 = 15"], ans: "Mean 56, range 36, SD 15" },
      shortcut: "Adding or subtracting shifts the middle but not the spread. Multiplying scales both. A negative multiplier still gives a positive SD."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Median of an unsorted list:** sort first. The middle item of an unsorted list is not the median.",
      "**Even count:** the median is the average of the two middle numbers, not the lower one.",
      "**Mean of means:** the combined mean uses group sizes. 40 people with mean 30 and 10 with mean 50 give 34, not 40.",
      "**SD after multiplying by a negative number:** SD is never negative. Multiply by the absolute value.",
      "**Adding a constant changes SD:** it does not. Only the mean, median, and the values themselves move.",
      "**Using n − 1:** these questions use the population SD (divide by n) unless told otherwise.",
      "**Several modes:** if two values tie, the set has two modes. Do not choose one."
    ]],
    ["warn", "When a number is added to or removed from a set, rebuild the total (mean × n), apply the change, and divide by the new count."],

    ["h2", "Quick check"],
    ["quiz", ["statistics-02", "statistics-04", "statistics-05", "statistics-06", "statistics-07"]]
  ]
});
BRIEFS["quant:statistics"] = "Mean, median and mode are three different ways of describing the middle of a list: the mean is total divided by count, the median is the middle after sorting, and the mode is the most frequent value. Range and standard deviation describe how spread out the numbers are. Most questions are easiest if you keep the total (mean times count) in view.\n\nA few rules do the rest: adding k to every value shifts the mean and median by k but leaves the range and SD alone; multiplying by k multiplies the mean, median, range and SD (the last two by the size of k). For a combined group, weight each mean by its count.";

/* ------------------------------------------------------------ Sets and DS */
LEARN.quant.push({
  id: "sets-ds", group: "Stats, sets & DS", title: "Sets & Venn and Data sufficiency",
  sub: "Draw the circles, fill the middle first, and learn the five-option sufficiency routine",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "eLitmus"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A **set** is a group of people or things who share a property: students who like tea, employees who know Java. A **Venn diagram** draws each group as a circle, and the overlap holds the members of both groups. The whole rectangle is the **universe** (everyone)."],
    ["list", [
      "**Add, then subtract the overlap:** if you add the sizes of two groups, the people in both groups get counted twice, so subtract them once.",
      "**Fill from the middle outward:** start with the region common to all sets, then the regions common to two sets, then the “only” regions.",
      "**“Neither” lives outside the circles:** neither = total − (those in at least one circle).",
      "**Data sufficiency** is a different skill using the same ideas: you decide whether the facts given are enough to settle one answer. You do not need to find the answer."
    ]],
    ["html", `<div style="text-align:center;margin:.8rem 0"><svg viewBox="0 0 380 220" width="100%" style="max-width:360px" role="img" aria-label="Two-set Venn diagram with four regions: only A, both, only B, and neither outside the circles." stroke="currentColor" fill="none" stroke-width="1.6">
<rect x="6" y="6" width="368" height="208" rx="8"/>
<circle cx="145" cy="112" r="72"/><circle cx="235" cy="112" r="72"/>
<g fill="currentColor" stroke="none" font-family="inherit" text-anchor="middle"><text x="112" y="116" font-size="14">only A</text><text x="190" y="116" font-size="14">both</text><text x="268" y="116" font-size="14">only B</text><text x="40" y="199" font-size="13">neither</text><text x="100" y="42" font-size="15" font-weight="600">A</text><text x="280" y="42" font-size="15" font-weight="600">B</text></g>
</svg></div>`],
    ["p", "Every person is in exactly one of the four regions, so the four regions add up to the total: **only A + both + only B + neither = N**."],
    ["html", `<div style="text-align:center;margin:.8rem 0"><svg viewBox="0 0 340 262" width="100%" style="max-width:340px" role="img" aria-label="Three-set Venn diagram with eight regions: only A, only B, only C, A and B only, B and C only, A and C only, all three, and none outside the circles." stroke="currentColor" fill="none" stroke-width="1.6">
<rect x="4" y="4" width="332" height="254" rx="8"/>
<circle cx="130" cy="108" r="62"/><circle cx="210" cy="108" r="62"/><circle cx="170" cy="171" r="62"/>
<g fill="currentColor" stroke="none" font-family="inherit" text-anchor="middle" font-size="11"><text x="100" y="88">A only</text><text x="240" y="88">B only</text><text x="170" y="222">C only</text><text x="170" y="82">AB</text><text x="124" y="160">AC</text><text x="216" y="160">BC</text><text x="170" y="130" font-weight="700">ABC</text><text x="30" y="246">none</text><text x="70" y="38" font-size="14" font-weight="600">A</text><text x="272" y="38" font-size="14" font-weight="600">B</text><text x="170" y="250" font-size="14" font-weight="600">C</text></g>
</svg></div>`],
    ["p", "In the three-set diagram, **AB** means “in A and B but not C”, and similarly AC and BC. The centre **ABC** is in all three. The eight regions (seven inside circles plus “none”) add up to the total N."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Union of two sets", "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)", "Subtract the overlap, which was counted twice"],
      ["Only A / only B", "n(A) − n(A ∩ B),  n(B) − n(A ∩ B)", "“A but not B” means the same as “only A”"],
      ["Neither", "N − n(A ∪ B)", "N is the total (everyone)"],
      ["Exactly one of two", "n(A) + n(B) − 2 n(A ∩ B)", "“A or B but not both”"],
      ["Union of three sets", "A + B + C − (AB + BC + CA) + ABC", "Here AB means the full overlap of A and B, including the centre"],
      ["Exactly one of three", "(A + B + C) − 2 (AB + BC + CA) + 3 ABC", "Sum of the three “only” regions"],
      ["Exactly two of three", "(AB + BC + CA) − 3 ABC", "Each pair overlap counts the centre once, so remove 3 centres"],
      ["At least two of three", "Exactly two + ABC", "= (AB + BC + CA) − 2 ABC"],
      ["Overlap limits, two sets", "Max = smaller of A and B;  Min = max(0, A + B − N)", "Overlap cannot exceed either set; they must fit in N"],
      ["Overlap limits, three sets", "Max all three = smallest set;  Min all three = max(0, A + B + C − 2N)", "Count those missing from each set, (N − A) + (N − B) + (N − C). Whatever is left of N is in all three"]
    ]],

    ["h2", "Shortcuts"],
    ["h", "Reading the wording"],
    ["table", ["Wording", "Means"], [
      ["At least one", "In A or B or C: the whole union"],
      ["Neither / none", "Outside all circles"],
      ["Only A", "In A, not in B or C"],
      ["Exactly two", "In two circles but not the third"],
      ["At most one", "None + exactly one"],
      ["Both A and B", "A ∩ B (includes those who are also in C)"]
    ]],
    ["list", [
      "**Two sets, only one overlap missing?** Overlap = A + B − union. If the union is the whole group (nobody outside), the overlap is A + B − N.",
      "**Three sets:** list the overlap values and the centre first, then compute “pair only” = pair − centre, then “single only” = set − the two pair-onlys − centre.",
      "**Percentages work the same:** treat N as 100. Minimum overlap of all three = A% + B% + C% − 200% (floor at 0).",
      "**Max and min overlap:** the maximum comes from nesting the smaller set inside the larger one. The minimum comes from stretching the sets apart until they fill the whole group.",
      "**Check the total:** after filling every region, they must add up to N."
    ]],
    ["h", "Data sufficiency: the five standard options"],
    ["list", [
      "**(A)** Statement I alone is sufficient, statement II alone is not.",
      "**(B)** Statement II alone is sufficient, statement I alone is not.",
      "**(C)** Both statements together are sufficient, but neither alone is.",
      "**(D)** Each statement alone is sufficient.",
      "**(E)** Both together are still not sufficient."
    ]],
    ["tip", "Some papers use four options: “I alone”, “II alone”, “either alone”, “both together”. The routine is the same. Test I alone, then II alone, then both together."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/sets-ds/two-set", title: "Two-set problems",
      spot: "Two groups, some members in both, and a question about both, only one, or neither.",
      method: ["Write N, n(A), n(B) and what is given about the overlap or about “neither”.", "Use n(A ∪ B) = n(A) + n(B) − n(A ∩ B), and neither = N − n(A ∪ B).", "Get the “only” regions by subtracting the overlap, and check that the four regions add up to N."],
      ex: { q: "In a class of 80 students, 48 take French, 35 take German and 12 take neither. How many take both?", steps: ["Union = 80 − 12 = 68", "Both = 48 + 35 − 68 = 15", "Check: only French 33, only German 20, both 15, neither 12 add to 80"], ans: "15" },
      shortcut: "When everyone is in at least one group: overlap = A + B − N. Add the two groups and subtract the total."
    }],
    ["pattern", {
      key: "quant/sets-ds/three-set", title: "Three-set problems (only, exactly, at least)",
      spot: "Three groups with pair overlaps and a triple overlap, and a question like “exactly one”, “exactly two”, “at least two” or “none”.",
      method: ["Start with the centre (all three), then each pair-only region = pair − centre.", "Single-only regions = set − (two pair-only regions) − centre.", "Add the right regions for what is asked, and use N minus the union for “none”."],
      ex: { q: "In a group of 80 people, 40 like A, 35 like B and 30 like C. 15 like A and B, 12 like B and C, 10 like A and C, and 5 like all three. How many like exactly one, exactly two, and none?", steps: ["Union = 40 + 35 + 30 − (15 + 12 + 10) + 5 = 73, so none = 80 − 73 = 7", "Exactly two = 37 − 3 × 5 = 22 (AB 10, BC 7, AC 5)", "Exactly one = 105 − 2 × 37 + 3 × 5 = 46 (A only 20, B only 13, C only 13)", "Check: 46 + 22 + 5 + 7 = 80"], ans: "Exactly one 46, exactly two 22, none 7" },
      shortcut: "“Both A and B” usually includes those in C as well. Subtract the centre to get “A and B only”."
    }],
    ["pattern", {
      key: "quant/sets-ds/max-and-min-overlap", title: "Maximum and minimum overlap",
      spot: "Group sizes are given but the overlap is not, and the question asks for the greatest or smallest possible overlap.",
      method: ["Maximum overlap = the smaller of the two groups (one nested inside the other).", "Minimum overlap = A + B − N, or 0 if that is negative.", "For three groups, the minimum in all three is A + B + C − 2N (floor 0) and the maximum is the smallest group."],
      ex: { q: "In a group of 90, 55 speak Tamil and 60 speak Telugu. What are the least and most who speak both?", steps: ["Least = 55 + 60 − 90 = 25", "Most = the smaller group = 55"], ans: "Least 25, most 55" },
      shortcut: "For percentages: if 70%, 75% and 85% like three things, at least 70 + 75 + 85 − 200 = 30% like all three."
    }],
    ["pattern", {
      key: "quant/sets-ds/data-sufficiency-with-the-standard", title: "Data sufficiency with the five standard options",
      spot: "A question followed by two statements, and options ranging from “I alone” to “not enough”. You do not need the answer itself.",
      method: ["Test statement I alone: does it give exactly one answer?", "Test statement II alone in the same way, then both together.", "Pick the option that matches: A, B, C, D or E."],
      ex: { q: "What is the number of students in a class? I. 30% of the students are girls. II. There are 56 boys in the class.", steps: ["I alone gives only a percentage with no actual count, so it is not enough", "II alone gives the boys but not the share, so it is not enough", "Together: boys are 70% of the class, 70% of N = 56, so N = 80", "Both together are needed, so the option is (C)"], ans: "(C): both statements together are sufficient" },
      shortcut: "Do not calculate the final answer beyond what is needed. Just check that one fixed value comes out. In a yes/no question, a definite “no” is sufficient too."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Counting the overlap twice:** A + B is more than the union. Subtract the overlap once.",
      "**Forgetting the centre in three sets:** the pair overlap “A and B” usually includes those who are also in C.",
      "**“Neither” confusion:** neither means outside all circles, not “only one”.",
      "**Treating a maximum as a certainty:** max and min overlap questions give limits, not a single value. Choose the right end.",
      "**Using “or” in the sloppy sense:** “A or B” (at least one) includes both. “A or B but not both” does not.",
      "**Percentage questions:** if the total is not given, treat it as 100 and work in percent. Do not add a total from outside.",
      "**Combining statements too soon:** in DS, check each statement alone first. Combining when one alone is enough gives the wrong option.",
      "**Guessing a number:** DS asks “is it enough”, not “what is it”. A statement that leaves two possible values is not sufficient."
    ]],
    ["warn", "Before any calculation in a Venn question, mark the total N, the “neither” region, and the centre. Before choosing a DS option, test I alone, II alone, then both."],

    ["h2", "Quick check"],
    ["quiz", ["sets-ds-01", "sets-ds-05", "sets-ds-07", "sets-ds-06", "sets-ds-04"]]
  ]
});
BRIEFS["quant:sets-ds"] = "A Venn diagram draws each group as a circle, and the overlap holds the members of both. For two sets, union = A + B − both, and neither = total − union. For three sets, fill the centre first, then the pair-only regions, then the single-only regions, and check that every region adds up to the total.\n\nFor maximum and minimum overlap, nest the smaller set inside the larger for the maximum, and stretch the sets apart for the minimum (A + B − N, never below 0). In data sufficiency, test statement I alone, then II alone, then both together, and choose the option that matches. You only need to know whether the facts fix a single answer.";
