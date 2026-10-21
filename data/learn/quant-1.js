/* Learn pages for Quantitative Aptitude, part 1: Number system, HCF & LCM, Simplification, Profit/loss, Interest, Ratio, Partnership. */
window.LEARN = window.LEARN || {}; LEARN.quant = LEARN.quant || []; window.BRIEFS = window.BRIEFS || {};

LEARN.quant.push({
  id: "number-system", group: "Number system", title: "Number system",
  sub: "Divisibility, remainders, factors, factorials and bases: the toolbox behind many “tricky” questions",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "eLitmus"],
  blocks: [
    ["h2", "The idea"],
    ["p", "Number system questions look scary but they all test a handful of small ideas about **whole numbers**: what divides what, what is left over, and how many pieces a number is built from. Once you know the tools, each question takes under a minute."],
    ["p", "The most useful habit is to break a number into **prime factors** (360 = 2³ × 3² × 5). Counting factors, finding the HCF, trailing zeros and divisibility all become easy once a number is written that way."],
    ["list", [
      "**Remainders behave nicely:** the remainder of a sum or product equals the sum or product of the remainders (then take the remainder again). You never need the huge number itself.",
      "**Patterns repeat:** unit digits of powers and remainders of powers come in short cycles. Find the cycle, then find where the exponent lands in it.",
      "**Factorials are built from small primes:** n! is just 1 × 2 × 3 × … × n, so you can count the 5s, 3s or 2s inside it without multiplying anything.",
      "**A number is not its digits only:** place value (10a + b) lets you turn word problems about digits into simple equations."
    ]],
    ["note", "Prime factorise first. If you are stuck on a number-system question, the stuck point is almost always that the number has not been broken into primes yet."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Number of factors", "N = aᵖ bᵠ cʳ → (p + 1)(q + 1)(r + 1)", "Add 1 to every power and multiply"],
      ["Sum of factors", "(1 + a + … + aᵖ)(1 + b + … + bᵠ)(…)", "Each bracket is a small geometric series"],
      ["Even / odd factors", "Odd factors = factors of the odd part; even = total − odd", "Strip all the 2s to get the odd part"],
      ["Perfect-square factors", "Count the even powers (including 0) of each prime", "360 = 2³3²5 → (2)(2)(1) = 4"],
      ["Trailing zeros in n!", "⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + …", "Fives are scarcer than twos, so count fives"],
      ["Highest power of prime p in n!", "⌊n/p⌋ + ⌊n/p²⌋ + ⌊n/p³⌋ + …", "For a composite base, do it for each prime and divide"],
      ["Fermat's little theorem", "p prime, p ∤ a → aᵖ⁻¹ ≡ 1 (mod p)", "So the cycle length divides p − 1"],
      ["Remainder theorem", "Remainder of f(x) ÷ (x − a) = f(a)", "Just substitute x = a"],
      ["Two-digit number", "10a + b; reversed = 10b + a", "Difference of the two = 9(a − b)"],
      ["Base conversion", "Divide repeatedly by the new base; read remainders upward", "Binary ↔ octal ↔ hex by grouping 3 or 4 bits"]
    ]],

    ["h2", "Shortcuts"],
    ["h", "Divisibility rules"],
    ["table", ["Divisor", "Rule"], [
      ["2, 5, 10", "Last digit even / 0 or 5 / 0"],
      ["4, 8", "Last 2 / last 3 digits divisible by 4 / 8"],
      ["3, 9", "Sum of digits divisible by 3 / 9"],
      ["6", "Divisible by both 2 and 3"],
      ["7", "Double the last digit and subtract it from the rest; repeat. 343: 34 − 6 = 28 ✓"],
      ["11", "(Sum of digits in odd places) − (sum in even places) is 0 or a multiple of 11"],
      ["12, 15, 18…", "Test two co-prime parts: 12 = 3 × 4, 18 = 2 × 9"]
    ]],
    ["list", [
      "**Unit digit cycles:** 2 → 2, 4, 8, 6 · 3 → 3, 9, 7, 1 · 7 → 7, 9, 3, 1 · 8 → 8, 4, 2, 6 (cycle length 4). 4 and 9 swap in 2 steps. 0, 1, 5, 6 never change.",
      "**Exponent mod 4:** divide the exponent by 4 and look at the remainder. A remainder of 0 means the 4th (last) number of the cycle.",
      "**Negative remainders:** 245 ≡ 5 (mod 12) but also 99 ≡ −1 (mod 100). Using −1 is often easier: (−1) to any even power is 1.",
      "**Last two digits:** numbers ending in 1, 3, 7, 9 have a short cycle mod 100. 7⁴ = 2401 ends in 01, so powers of 7 repeat every 4.",
      "**Co-prime parts:** to test divisibility by 36, check 4 and 9 separately; they share no factor, so both together is enough."
    ]],
    ["tip", "A number is divisible by a product only when it is divisible by co-prime parts. Divisible by 6 and 4 does not mean divisible by 24 (12 is). Use 3 and 8 instead."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/number-system/divisibility-rules", title: "Divisibility rules",
      spot: "“Which digit makes the number divisible by …?”, “is N divisible by …?”, or finding a missing digit in a number.",
      method: ["Pick the rule for each divisor in the question (digit sum for 3 and 9, last two digits for 4, alternate sum for 11).", "Write the unknown digit as x and apply the rule to get an equation or a short list of possibilities.", "If the divisor is composite (36, 72), split it into co-prime parts and satisfy each part."],
      ex: { q: "Find the digit x so that the number 3x72 is divisible by 36.", steps: ["36 = 4 × 9, so the number must be divisible by both", "By 4: the last two digits 72 are divisible by 4, so x is free so far", "By 9: 3 + x + 7 + 2 = 12 + x must be a multiple of 9, so x = 6", "Check: 3672 ÷ 36 = 102"], ans: "6" },
      shortcut: "Handle the digit-sum condition first: it gives one or two values of x. Then use the last-digits rule only to confirm."
    }],
    ["pattern", {
      key: "quant/number-system/unit-digit-by-cyclicity", title: "Unit digit by cyclicity",
      spot: "“What is the unit digit of 7¹²³ × 3⁴⁵?” or of any large power or product.",
      method: ["Look only at the unit digit of the base.", "Write its cycle (3 → 3, 9, 7, 1) and divide the exponent by the cycle length (4).", "The remainder picks the position in the cycle; remainder 0 means the last digit of the cycle.", "For a product, multiply the unit digits of each part and keep the last digit."],
      ex: { q: "Find the unit digit of 7¹²³ × 3⁴⁵.", steps: ["7: cycle 7, 9, 3, 1. 123 ÷ 4 leaves 3, so the unit digit is the 3rd one = 3", "3: cycle 3, 9, 7, 1. 45 ÷ 4 leaves 1, so the unit digit is 3", "Product of unit digits: 3 × 3 = 9"], ans: "9" },
      shortcut: "Only the exponent’s remainder after dividing by 4 matters. Memorise the four cycles for 2, 3, 7 and 8."
    }],
    ["pattern", {
      key: "quant/number-system/last-two-digits", title: "Last two digits",
      spot: "“Find the last two digits of 7²⁰²³ (or 13⁴⁵, 99¹⁰⁰…)”.",
      method: ["Look for a power of the base that ends in 01 (7⁴ = 2401, 3²⁰ ends in 01, 11¹⁰ ends in 01).", "Divide the exponent by that power and keep the leftover exponent.", "Compute the small leftover power and take its last two digits."],
      ex: { q: "Find the last two digits of 7²⁰²³.", steps: ["7⁴ = 2401, which ends in 01, so every block of four 7s contributes 01", "2023 = 4 × 505 + 3, so 7²⁰²³ ends like 7³", "7³ = 343, last two digits 43"], ans: "43" },
      shortcut: "Numbers ending in 1 are easy: (…01)ⁿ stays …01 and (…x1)ⁿ ends in (n × x)1. For 51, 49, 99 use the binomial idea: 99 = 100 − 1."
    }],
    ["pattern", {
      key: "quant/number-system/remainders-basic-and-remainder-theorem", title: "Remainders: basic & remainder theorem",
      spot: "“Remainder when a product or sum is divided by n”, “a number leaves remainder r on division by d, find …”, or “remainder when f(x) is divided by (x − a)”.",
      method: ["Reduce every number to its own remainder first.", "Add or multiply the small remainders, then reduce that once more.", "For algebra, substitute x = a into f(x); the value is the remainder.", "A negative remainder is fine in the middle: add the divisor at the end."],
      ex: { q: "Find the remainder when 245 × 367 is divided by 12.", steps: ["245 = 20 × 12 + 5, so the remainder is 5", "367 = 30 × 12 + 7, so the remainder is 7", "5 × 7 = 35 and 35 = 2 × 12 + 11, so the remainder is 11"], ans: "11" },
      shortcut: "Never multiply the big numbers. (a × b) mod n = ((a mod n) × (b mod n)) mod n."
    }],
    ["pattern", {
      key: "quant/number-system/remainders-of-large-powers", title: "Remainders of large powers (cyclicity, Fermat / Euler)",
      spot: "“Remainder when 3¹⁰⁰ is divided by 7”, or any big power divided by a small number.",
      method: ["Find the smallest power of the base that leaves remainder 1 (or −1) with the divisor.", "Divide the exponent by that cycle length and keep the leftover.", "Compute the small leftover power and take its remainder.", "For a prime divisor p, Fermat tells you the cycle divides p − 1."],
      ex: { q: "Find the remainder when 3¹⁰⁰ is divided by 7.", steps: ["3⁶ ≡ 1 (mod 7) by Fermat (7 is prime, so 3⁶ leaves remainder 1)", "100 = 6 × 16 + 4, so 3¹⁰⁰ leaves the same remainder as 3⁴", "3⁴ = 81 = 11 × 7 + 4, so the remainder is 4"], ans: "4" },
      shortcut: "Look for a power that is 1 or −1 more than a multiple of the divisor, as in 2⁵ = 32 = 33 − 1 for divisor 11 or 3. Then 2¹⁰ ≡ 1 straight away."
    }],
    ["pattern", {
      key: "quant/number-system/factors-count-sum-even-odd", title: "Factors: count / sum / even-odd / perfect-square factors",
      spot: "“How many factors does N have?”, “sum of all factors”, “how many even / odd / square factors”.",
      method: ["Write N as a product of prime powers.", "Count = multiply (power + 1) over all primes; sum = multiply the geometric sums.", "Odd factors come from the odd part only; even factors = total − odd.", "Perfect-square factors use only even powers of each prime."],
      ex: { q: "For N = 360, find the number of factors, their sum, and the number of even factors.", steps: ["360 = 2³ × 3² × 5", "Count = (3 + 1)(2 + 1)(1 + 1) = 24", "Sum = (1 + 2 + 4 + 8)(1 + 3 + 9)(1 + 5) = 15 × 13 × 6 = 1170", "Odd factors come from 3² × 5: (2 + 1)(1 + 1) = 6, so even factors = 24 − 6 = 18"], ans: "24 factors, sum 1170, 18 even" },
      shortcut: "Even factors = (power of 2) × (count of factors of the odd part) = 3 × 6 = 18. Perfect-square factors of 360: 2 × 2 × 1 = 4 (they are 1, 4, 9, 36)."
    }],
    ["pattern", {
      key: "quant/number-system/trailing-zeros-in-n", title: "Trailing zeros in n!",
      spot: "“How many zeros are at the end of 125! (or 100!, 200!)?”",
      method: ["Each zero needs one 2 and one 5, and 2s are more plentiful, so count the 5s.", "Divide n by 5, then by 25, then by 125, … ignoring remainders.", "Add the quotients."],
      ex: { q: "How many zeros does 125! end with?", steps: ["125 ÷ 5 = 25", "125 ÷ 25 = 5", "125 ÷ 125 = 1", "Total = 25 + 5 + 1"], ans: "31" },
      shortcut: "Divide by 5 repeatedly: 125 → 25 → 5 → 1 and add up the answers. 100! has 20 + 4 = 24 zeros."
    }],
    ["pattern", {
      key: "quant/number-system/highest-power-of-a-prime", title: "Highest power of a prime in n!",
      spot: "“What is the highest power of 3 (or 12, or 6) that divides 50!?”",
      method: ["For a prime p, add ⌊n/p⌋ + ⌊n/p²⌋ + … for the power of p inside n!.", "For a composite base, factorise it (12 = 2² × 3).", "Find the power of each prime in n!, divide by that prime’s power in the base, and take the smallest result."],
      ex: { q: "Find the highest power of 12 that divides 30!.", steps: ["12 = 2² × 3", "Power of 2 in 30!: 15 + 7 + 3 + 1 = 26, so 26 ÷ 2 = 13 groups of 2²", "Power of 3 in 30!: 10 + 3 + 1 = 14", "The smaller of 13 and 14 limits us"], ans: "13" },
      shortcut: "The limiting prime is usually the bigger one (here 3), but always check both. For a prime base, one line is enough."
    }],
    ["pattern", {
      key: "quant/number-system/primes-and-co-primes", title: "Primes & co-primes",
      spot: "“Is N prime?”, “how many primes below …”, “how many numbers up to N are co-prime to N?”.",
      method: ["To test N, divide by every prime up to √N; if none divides it, N is prime.", "Two numbers are co-prime when their HCF is 1.", "Count of numbers up to N that are co-prime to N = N × (1 − 1/p₁)(1 − 1/p₂)… over the primes of N."],
      ex: { q: "Is 221 prime? Also, how many numbers from 1 to 30 are co-prime to 30?", steps: ["√221 is a bit under 15, so test 2, 3, 5, 7, 11, 13", "221 = 13 × 17, so it is not prime", "30 = 2 × 3 × 5, so the count is 30 × (1/2) × (2/3) × (4/5) = 8", "They are 1, 7, 11, 13, 17, 19, 23, 29"], ans: "221 is not prime (13 × 17); 8 numbers" },
      shortcut: "Primes below 30: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29. Beyond 3, every prime is of the form 6k ± 1, which cuts the testing down."
    }],
    ["pattern", {
      key: "quant/number-system/base-conversion", title: "Base conversion",
      spot: "“Convert 156 to binary”, “(1011)₂ in decimal”, or arithmetic in another base.",
      method: ["Decimal to base b: divide by b again and again; the remainders read from bottom to top are the digits.", "Base b to decimal: multiply each digit by its place value (… b², b¹, b⁰) and add.", "Between binary and octal (or hex): group the bits in threes (or fours) from the right."],
      ex: { q: "Convert 156 to binary and then to octal.", steps: ["156 = 128 + 16 + 8 + 4, so the binary number is 10011100", "Group in threes from the right: 010 | 011 | 100", "010 = 2, 011 = 3, 100 = 4, giving 234 in octal", "Check: 2 × 64 + 3 × 8 + 4 = 156"], ans: "(10011100)₂ = (234)₈" },
      shortcut: "Learn powers of 2 up to 256. For binary to decimal, add the place values where the digit is 1."
    }],
    ["pattern", {
      key: "quant/number-system/place-value-and-digit-sums", title: "Place value & digit sums",
      spot: "Two-digit or three-digit number puzzles: digit sum, reversed number, difference of digits, “number is k times the sum of its digits”.",
      method: ["Write the number as 10a + b (or 100a + 10b + c).", "Translate each sentence in the problem into an equation in a and b.", "Solve, then check against the original words."],
      ex: { q: "A two-digit number is 4 times the sum of its digits, and adding 18 to it reverses the digits. Find the number.", steps: ["10a + b = 4(a + b), so 6a = 3b and b = 2a", "Adding 18 reverses the digits: (10b + a) − (10a + b) = 9(b − a) = 18, so b − a = 2", "With b = 2a: a = 2 and b = 4", "Check: 24 = 4 × 6, and 24 + 18 = 42"], ans: "24" },
      shortcut: "The difference between a number and its reverse is always 9 × (difference of the digits), so it must be a multiple of 9."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Counting factors with the wrong powers:** the count uses (power + 1), not the power. 2³ has 4 factors, not 3.",
      "**Forgetting 1 and the number itself:** factors include both. Prime factors do not.",
      "**Unit-digit remainder 0:** when the exponent divides evenly by 4, take the 4th number of the cycle, not the 0th.",
      "**Trailing zeros:** count 25, 125 as extra fives. 100! has 24 zeros, not 20.",
      "**Divisibility by a composite:** 6 and 4 dividing a number does not make 24 divide it. Use co-prime parts.",
      "**Multiplying before reducing:** you will make arithmetic errors. Take remainders first.",
      "**Base conversion direction:** remainders are read bottom to top, not top to bottom.",
      "**1 is neither prime nor composite.** And 2 is the only even prime."
    ]],
    ["warn", "Before calculating, ask: Is this about what divides (factors), what is left (remainders), or how many (counting)? That picks the tool."],

    ["h2", "Quick check"],
    ["quiz", ["number-system-01", "number-system-02", "number-system-05", "number-system-06", "number-system-08"]]
  ]
});
BRIEFS["quant:number-system"] = "Number system is a toolbox rather than one skill. Break numbers into primes, reduce big numbers to their remainders, and spot short cycles in unit digits and remainders of powers. Factor counts come from adding 1 to each prime power, and factorial questions come down to counting fives or primes.\n\nThe eleven patterns here cover divisibility, cycles, remainders, factors, factorials, primes, bases and digit puzzles. Prime factorise first, never multiply out a huge number, and always check the answer against the question on a small case.";


LEARN.quant.push({
  id: "hcf-lcm", group: "Number system", title: "HCF & LCM",
  sub: "Greatest common piece, least common meeting point: the word-problem pair",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "Cognizant"],
  blocks: [
    ["h2", "The idea"],
    ["p", "The **HCF** (highest common factor) is the biggest number that divides all the given numbers. The **LCM** (lowest common multiple) is the smallest number that all of them divide. Think of HCF as “the biggest piece we can cut everything into” and LCM as “the first time everything lines up again”."],
    ["list", [
      "**HCF is about splitting:** equal groups, largest tile, longest rod. The answer is never bigger than the smallest number.",
      "**LCM is about meeting:** bells ringing together, runners meeting at the start, smallest number divisible by all. The answer is never smaller than the biggest number.",
      "**Prime factors make both easy:** HCF takes the smallest power of each common prime; LCM takes the biggest power of every prime that appears.",
      "**Remainder problems hide an HCF or LCM:** subtract the remainders (or take the common gap) and the problem becomes plain HCF or LCM."
    ]],
    ["note", "If the question says “greatest”, “largest”, “maximum” or “equal pieces”, think HCF. If it says “least”, “smallest”, “together again” or “after how long”, think LCM."],

    ["h2", "Formulas"],
    ["formulas", [
      ["HCF by prime factors", "Lowest power of each common prime", "36 = 2²3², 60 = 2²·3·5 → HCF = 2² × 3 = 12"],
      ["LCM by prime factors", "Highest power of every prime present", "LCM = 2² × 3² × 5 = 180"],
      ["Product rule (two numbers)", "HCF × LCM = a × b", "Works for two numbers only, not three"],
      ["HCF of fractions", "HCF of numerators / LCM of denominators", "Reduce each fraction to lowest terms first"],
      ["LCM of fractions", "LCM of numerators / HCF of denominators", "Again in lowest terms"],
      ["Greatest number leaving remainders", "HCF of (each number − its remainder)", "Same remainder: HCF of the differences"],
      ["Least number leaving remainders", "LCM − common gap (or + remainder)", "Same remainder r: LCM + r. Same gap g: LCM − g"],
      ["Meeting together", "LCM of the time intervals", "Count = (total time ÷ LCM) + 1 including the start"],
      ["Equal pieces / tiles", "HCF of the lengths", "Number of pieces = length ÷ HCF for each, then add (or multiply for tiles)"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**Euclid’s method for HCF:** HCF(a, b) = HCF(b, a mod b). HCF(126, 84): 126 = 84 + 42, then 84 = 2 × 42, so HCF = 42.",
      "**LCM from the HCF:** LCM(a, b) = a × b ÷ HCF. Find the HCF first, then divide.",
      "**Three numbers:** do two at a time. LCM(12, 15, 20) = LCM(LCM(12, 15), 20) = LCM(60, 20) = 60.",
      "**Common remainder in every case:** the number is a multiple of the LCM plus r. “Least” means LCM + r.",
      "**Common gap (short by the same amount):** if every divisor is “short by g”, the number is LCM − g. Check by adding g and seeing if it divides evenly.",
      "**HCF is always a factor of the difference** of the two numbers, which is why remainder problems use differences."
    ]],
    ["tip", "Do not use HCF × LCM = product for three numbers. It only works for two."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/hcf-lcm/hcf-lcm-by-prime-factors", title: "HCF / LCM by prime factors",
      spot: "“Find the HCF and LCM of 36, 60 and 84.”",
      method: ["Write each number as a product of prime powers.", "HCF: for every prime that appears in all numbers, take the lowest power.", "LCM: for every prime that appears anywhere, take the highest power."],
      ex: { q: "Find the HCF and LCM of 36, 60 and 84.", steps: ["36 = 2² × 3², 60 = 2² × 3 × 5, 84 = 2² × 3 × 7", "HCF = 2² × 3 = 12 (common primes 2 and 3, lowest powers)", "LCM = 2² × 3² × 5 × 7 = 1260 (every prime, highest powers)"], ans: "HCF 12, LCM 1260" },
      shortcut: "For HCF, divide all numbers by their common factors step by step until nothing divides all of them, then multiply the divisors."
    }],
    ["pattern", {
      key: "quant/hcf-lcm/hcf-lcm-product", title: "HCF × LCM = product",
      spot: "Two numbers where the HCF and LCM are given along with one of the numbers (or the sum / product of the numbers).",
      method: ["Use HCF × LCM = first number × second number.", "Substitute what you know and solve for the missing number.", "If only the HCF and the product are given, divide to get the LCM."],
      ex: { q: "The HCF of two numbers is 12 and their LCM is 240. One number is 48. Find the other.", steps: ["HCF × LCM = 12 × 240 = 2880", "Other number = 2880 ÷ 48", "= 60"], ans: "60" },
      shortcut: "Check by gut: both numbers must be multiples of the HCF (48 and 60 are) and factors of the LCM (they are)."
    }],
    ["pattern", {
      key: "quant/hcf-lcm/hcf-lcm-of-fractions", title: "HCF / LCM of fractions",
      spot: "“Find the HCF (or LCM) of 2/3, 4/9 and 8/27.”",
      method: ["Reduce each fraction to lowest terms.", "HCF = HCF of numerators ÷ LCM of denominators.", "LCM = LCM of numerators ÷ HCF of denominators."],
      ex: { q: "Find the HCF and LCM of 2/3, 4/9 and 8/27.", steps: ["Numerators 2, 4, 8: HCF = 2, LCM = 8", "Denominators 3, 9, 27: HCF = 3, LCM = 27", "HCF = 2/27 and LCM = 8/3"], ans: "HCF 2/27, LCM 8/3" },
      shortcut: "HCF of fractions is small (a tiny fraction); LCM is big. If your HCF is bigger than a given fraction, you turned them upside down."
    }],
    ["pattern", {
      key: "quant/hcf-lcm/greatest-number-leaving-given-remainders", title: "Greatest number leaving given remainders",
      spot: "“Find the greatest number that divides 85 and 133 leaving remainders 1 and 7.”",
      method: ["Subtract each remainder from its number, so the divisor now divides the results exactly.", "Take the HCF of these results.", "Make sure the answer is bigger than every remainder."],
      ex: { q: "Find the greatest number that divides 85 and 133 and leaves remainders 1 and 7 respectively.", steps: ["85 − 1 = 84 and 133 − 7 = 126", "HCF(84, 126) = 42", "Check: 85 = 2 × 42 + 1 and 133 = 3 × 42 + 7, and 42 is bigger than both remainders"], ans: "42" },
      shortcut: "Same remainder r in every case? Take the HCF of the differences between the numbers instead (no need to subtract r)."
    }],
    ["pattern", {
      key: "quant/hcf-lcm/least-number-leaving-given-remainders", title: "Least number leaving given remainders",
      spot: "“Least number which leaves remainders 5, 8, 13 when divided by 12, 15, 20.”",
      method: ["Find the gap (divisor − remainder) in each case.", "If the gap is the same (g), the number is a multiple of the LCM minus g. If the remainder is the same (r), it is LCM + r.", "The least such number is LCM − g (or LCM + r)."],
      ex: { q: "Find the least number that leaves remainders 5, 8 and 13 when divided by 12, 15 and 20.", steps: ["Gaps: 12 − 5 = 7, 15 − 8 = 7, 20 − 13 = 7. The gap is always 7", "LCM(12, 15, 20) = 60", "Number = 60 − 7 = 53", "Check: 53 = 4 × 12 + 5, 3 × 15 + 8, 2 × 20 + 13"], ans: "53" },
      shortcut: "Add the gap in your head: 53 + 7 = 60, divisible by all three. If it divides, you have the right number."
    }],
    ["pattern", {
      key: "quant/hcf-lcm/bells-traffic-lights-together", title: "Bells / traffic lights together",
      spot: "Several things repeat at different intervals and the question asks when they next happen together (or how many times in a given period).",
      method: ["Convert all intervals to the same unit.", "LCM of the intervals = time between joint events.", "Number of joint events in a period = (period ÷ LCM) + 1 if the first one counts at time 0."],
      ex: { q: "Three bells ring every 8, 12 and 18 minutes. They ring together at 9:00 am. How many times do they ring together in the next 6 hours, counting 9:00 am?", steps: ["LCM(8, 12, 18) = 72 minutes", "6 hours = 360 minutes, and 360 ÷ 72 = 5", "They ring together 5 more times after the start, plus the start itself"], ans: "6 times" },
      shortcut: "If the question says “in the next” period, count the joint events inside it; the starting one is added only if it is told to count it."
    }],
    ["pattern", {
      key: "quant/hcf-lcm/tiles-rows-cutting-into-equal", title: "Tiles, rows, cutting into equal pieces",
      spot: "Largest square tile for a floor, longest rope or rod that measures several lengths exactly, equal rows or groups without leftovers.",
      method: ["Convert to the same unit (cm).", "The biggest equal piece = HCF of the lengths.", "Number of pieces = each length ÷ HCF. For tiles on a floor, multiply the two counts; for ropes, add them."],
      ex: { q: "A room is 6.40 m long and 4.80 m wide. What is the side of the largest square tile that fits exactly, and how many tiles are needed?", steps: ["640 cm and 480 cm, so the tile side = HCF(640, 480) = 160 cm", "Tiles along the length = 640 ÷ 160 = 4, along the width = 480 ÷ 160 = 3", "Number of tiles = 4 × 3 = 12"], ans: "160 cm, 12 tiles" },
      shortcut: "Rods cut from several ropes: the longest rod is the HCF, and the total count is the sum of each rope ÷ HCF (24, 36, 60 m ropes give 12 m pieces: 2 + 3 + 5 = 10)."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**HCF vs LCM:** decide from the wording. “Largest tile / equal parts” is HCF; “together again” is LCM.",
      "**Using the product rule for three numbers:** HCF × LCM = product is only for two.",
      "**Forgetting the remainder:** the least number with remainder r is LCM + r, not LCM.",
      "**Gap vs remainder:** “short by the same amount” needs LCM − gap. Check both before choosing.",
      "**Mixed units:** convert hours, minutes and seconds (or m and cm) to one unit before taking LCM or HCF.",
      "**Including the start:** “how many times together in 6 hours” includes or excludes time 0 according to the wording.",
      "**HCF of fractions:** reduce first, then use the numerator HCF over the denominator LCM. It is not HCF over HCF.",
      "**Answer smaller than a remainder:** the divisor in a remainder problem must be larger than every remainder."
    ]],
    ["warn", "Test your answer: an HCF must divide every number exactly, and an LCM must be divisible by every number. A ten-second check catches wrong picks."],

    ["h2", "Quick check"],
    ["quiz", ["hcf-lcm-01", "hcf-lcm-03", "hcf-lcm-04", "hcf-lcm-05", "hcf-lcm-07"]]
  ]
});
BRIEFS["quant:hcf-lcm"] = "HCF is the biggest piece that fits every number exactly; LCM is the first number they all divide. Use HCF when you split or tile, and LCM when things meet again. Both come from prime factors: lowest common powers for HCF, highest powers for LCM.\n\nRemainder questions turn into plain HCF or LCM once you subtract the remainders or use the common gap. For two numbers HCF times LCM equals their product. Always convert to one unit first and check the answer divides evenly.";

LEARN.quant.push({
  id: "simplification", group: "Number system", title: "Simplification & approximation",
  sub: "BODMAS, recurring decimals, surds, roots and the bank-style “?” in under 40 seconds",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "Banking"],
  blocks: [
    ["h2", "The idea"],
    ["p", "Simplification is pure speed arithmetic: a long expression with fractions, decimals, powers and roots, and you must reach one number fast. There is no new maths here. The win comes from **order of operations**, a few well-known tables, and knowing when you can **round** safely."],
    ["list", [
      "**BODMAS** tells you the order: Brackets, Orders (powers and roots), Division and Multiplication (left to right), Addition and Subtraction (left to right).",
      "**Fractions beat decimals:** 0.125 is 1/8, 0.375 is 3/8. Cancel before you multiply.",
      "**Squares, cubes and roots from memory** save more time than any trick. Learn squares to 30 and cubes to 15.",
      "**Approximation questions say “?”** and the options are far apart. Round every number to something friendly and the nearest option wins."
    ]],
    ["note", "In an approximation question you are not asked for the exact value. If the options are 10 apart, rounding to the nearest whole number is plenty."],

    ["h2", "Formulas"],
    ["formulas", [
      ["BODMAS", "Brackets → Orders → ÷ × → + −", "Division and multiplication have equal rank: go left to right"],
      ["“of”", "Treated as multiplication, done early (like a bracket)", "6 of 4 ÷ 3 = (6 × 4) ÷ 3"],
      ["Recurring decimal 0.ababab…", "ab / 99", "0.272727… = 27/99 = 3/11"],
      ["Mixed recurring 0.a bcbc…", "(abc − a) / 990", "0.2333… = (23 − 2)/90 = 7/30"],
      ["Index laws", "aᵐ × aⁿ = aᵐ⁺ⁿ · aᵐ ÷ aⁿ = aᵐ⁻ⁿ · (aᵐ)ⁿ = aᵐⁿ", "a⁰ = 1, a⁻ⁿ = 1/aⁿ, aᵖ/ᵠ = ᵠ√(aᵖ)"],
      ["Surds", "√a × √b = √(ab) · √(a/b) = √a / √b", "Add only like surds: 3√2 + 5√2 = 8√2"],
      ["Rationalising", "1/(√a + √b) = (√a − √b)/(a − b)", "Multiply top and bottom by the conjugate"],
      ["Identities", "(a + b)² = a² + 2ab + b² · a² − b² = (a − b)(a + b)", "103 × 97 = 100² − 3² = 9991"]
    ]],

    ["h2", "Shortcuts"],
    ["h", "Tables worth knowing"],
    ["table", ["Squares", "Cubes", "Fraction ↔ decimal", ""], [
      ["11² = 121, 12² = 144", "2³ = 8, 3³ = 27", "1/8 = 0.125", "3/8 = 0.375"],
      ["13² = 169, 14² = 196", "4³ = 64, 5³ = 125", "5/8 = 0.625", "7/8 = 0.875"],
      ["15² = 225, 16² = 256", "6³ = 216, 7³ = 343", "1/16 = 0.0625", "1/40 = 0.025"],
      ["17² = 289, 18² = 324", "8³ = 512, 9³ = 729", "1/25 = 0.04", "1/50 = 0.02"],
      ["19² = 361, 25² = 625", "10³ = 1000, 12³ = 1728", "1/20 = 0.05", "1/80 = 0.0125"]
    ]],
    ["list", [
      "**Square of a number ending in 5:** n5² = n(n + 1) followed by 25. 35² = 3 × 4 = 12, so 1225.",
      "**Near 100 or 50:** 98² = (100 − 2)² = 9604. 102 × 98 = 100² − 2² = 9996.",
      "**Square root by last digit:** a square ending in 1 has a root ending in 1 or 9; 4 → 2 or 8; 5 → 5; 6 → 4 or 6; 9 → 3 or 7; 0 → 0. Then bracket the tens digit between two round squares.",
      "**Approximation rounding:** round numbers to the nearest friendly value (49.8 → 50, 599.7 → 600) and combine; the options tell you how much error is allowed.",
      "**Cancel early:** 144 × 25 ÷ 36 = 4 × 25 = 100. Do the cancelling before multiplying anything.",
      "**Recurring decimals:** put the repeating block over as many 9s as the block has digits, and put as many 0s as the non-repeating digits."
    ]],
    ["tip", "A large expression is often built to cancel. Look for matching numbers, a² − b², or (a + b)² patterns before you start multiplying."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/simplification/bodmas", title: "BODMAS",
      spot: "A single expression with brackets, powers, ×, ÷, + and − that needs one numerical answer.",
      method: ["Work inside brackets first, innermost first.", "Then powers and roots.", "Then division and multiplication, left to right.", "Finally addition and subtraction, left to right."],
      ex: { q: "Simplify: 48 ÷ 6 × 2 + 3² − 4 × (5 − 2)", steps: ["Bracket: (5 − 2) = 3", "Power: 3² = 9", "Left to right: 48 ÷ 6 × 2 = 8 × 2 = 16, and 4 × 3 = 12", "16 + 9 − 12"], ans: "13" },
      shortcut: "Division and multiplication share the same rank. Doing 6 × 2 before 48 ÷ 6 gives 4 instead of 16, a very common wrong answer."
    }],
    ["pattern", {
      key: "quant/simplification/fractions-and-decimals", title: "Fractions & decimals (recurring decimal → fraction)",
      spot: "Recurring decimals (0.2727…, 0.1666…), mixed fraction-decimal sums, and comparing fractions.",
      method: ["Pure recurring: put the repeating block over 9, 99 or 999 (one, two or three digits).", "Mixed recurring: (whole group − non-repeating part) over 9s followed by 0s.", "Convert everything to fractions, take a common denominator and add."],
      ex: { q: "Express 0.2727… + 0.3333… as a single fraction.", steps: ["0.2727… = 27/99 = 3/11", "0.3333… = 1/3", "3/11 + 1/3 = 9/33 + 11/33 = 20/33"], ans: "20/33" },
      shortcut: "Memorise 1/3, 1/6, 1/9, 1/11 as decimals (0.333…, 0.1666…, 0.111…, 0.0909…). Most recurring decimals are built from them."
    }],
    ["pattern", {
      key: "quant/simplification/surds-and-indices", title: "Surds & indices",
      spot: "Square roots, fractional powers and negative powers to be simplified or compared.",
      method: ["Pull the largest perfect square out of each root (√50 = 5√2).", "Add or subtract only like surds (same number inside the root).", "For indices, write every base in its smallest prime (4 = 2², 8 = 2³) and use the index laws.", "To remove a surd from a denominator, multiply by the conjugate."],
      ex: { q: "Simplify √50 + √18 − √8.", steps: ["√50 = 5√2, √18 = 3√2, √8 = 2√2", "All three are multiples of √2", "5√2 + 3√2 − 2√2 = 6√2 (about 8.49)"], ans: "6√2" },
      shortcut: "Indices: 4³ × 2⁵ ÷ 8² = 2⁶ × 2⁵ ÷ 2⁶ = 2⁵ = 32. Put every base into primes first, then just add and subtract the powers."
    }],
    ["pattern", {
      key: "quant/simplification/square-cube-roots", title: "Square / cube roots",
      spot: "“Find √5929”, “∛17576”, or a root inside a larger expression.",
      method: ["Last digit of the number tells you the last digit of the root (a square ending in 9 has a root ending in 3 or 7).", "Bracket the rest between two round squares (or cubes) to get the first digit.", "Choose between the two candidate roots by comparing with the midpoint square (for example 75² = 5625)."],
      ex: { q: "Find √5929 and ∛17576.", steps: ["√5929: it ends in 9, so the root ends in 3 or 7. 70² = 4900 and 80² = 6400, so the root is in the seventies. 75² = 5625 is less than 5929, so the root is 77. Check 77² = 5929", "∛17576: it ends in 6, so the root ends in 6. 17 lies between 8 (2³) and 27 (3³), so the tens digit is 2. Root = 26. Check 26³ = 17576"], ans: "77 and 26" },
      shortcut: "Cube-root last digits: cubes of 1, 4, 5, 6, 9 end in the same digit; 2 ↔ 8 and 3 ↔ 7 swap. Use the thousands part to pick the tens digit."
    }],
    ["pattern", {
      key: "quant/simplification/approximation", title: "Approximation (bank-style “?”)",
      spot: "“? ≈” or “find the approximate value”, with messy decimals and options that are well apart.",
      method: ["Round every number to the nearest friendly value (a whole number or a number with one easy decimal).", "Do the operations in BODMAS order on the rounded values.", "Choose the option closest to your estimate."],
      ex: { q: "Find the approximate value of 49.8% of 599.7 + 24.9 × 7.98.", steps: ["Round: 49.8% ≈ 50%, 599.7 ≈ 600, 24.9 ≈ 25, 7.98 ≈ 8", "50% of 600 = 300", "25 × 8 = 200", "300 + 200 = 500 (the exact value is 497.35)"], ans: "≈ 500" },
      shortcut: "Round numbers in the direction that gets them closest, and watch for options that are only a few apart, where you must round less."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Left to right:** 48 ÷ 6 × 2 is 16, not 4. Equal-rank operations go left to right.",
      "**Sign errors with brackets:** a minus in front of a bracket flips every sign inside.",
      "**“of” in the wrong place:** 3 of 4 ÷ 2 means (3 × 4) ÷ 2 = 6.",
      "**Recurring decimals:** 0.333… is 1/3, not 33/100, and 0.0909… is 1/11.",
      "**Adding unlike surds:** √2 + √3 is not √5.",
      "**Negative index:** 2⁻³ is 1/8, not −8.",
      "**Rounding too hard:** if two options are close, round fewer numbers or keep one decimal.",
      "**Cancelling across a plus sign:** you can cancel factors in a product, not terms in a sum."
    ]],
    ["warn", "Before multiplying anything out, scan for cancelling, a² − b², and friendly fractions. Most simplification questions are designed to collapse."],

    ["h2", "Quick check"],
    ["quiz", ["simplification-01", "simplification-03", "simplification-04", "simplification-05", "simplification-06"]]
  ]
});
BRIEFS["quant:simplification"] = "Simplification is speed arithmetic. Follow BODMAS (division and multiplication left to right), prefer fractions to decimals, cancel before you multiply, and know squares to 30 and cubes to 15. Recurring decimals become fractions over 9s, and surds add only when they are alike.\n\nFor bank-style approximation questions, round every number to something friendly and pick the closest option. Check the gap between options first, since that tells you how roughly you can round.";


LEARN.quant.push({
  id: "profit-loss", group: "Arithmetic", title: "Profit, loss & discount",
  sub: "Cost price, selling price, marked price and the shopkeeper tricks that placement tests love",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "eLitmus"],
  blocks: [
    ["h2", "The idea"],
    ["p", "Profit and loss is percentages with a story. The story always has a **cost price (CP)**, what the shopkeeper paid, and a **selling price (SP)**, what the customer pays. If SP is more than CP it is a profit, otherwise a loss."],
    ["p", "The golden rule: **profit and loss percentages are on the cost price**, unless the question says otherwise. Discount percentages are on the **marked price (MP)**, the price printed on the tag. Keeping these two bases apart solves most of the topic."],
    ["list", [
      "**Profit = SP − CP, Loss = CP − SP.** Profit % = Profit / CP × 100.",
      "**SP and CP as factors:** 20% profit means SP = 1.2 × CP. 10% loss means SP = 0.9 × CP. Use factors and the question becomes multiplication.",
      "**Marked price and discount:** the shopkeeper marks up above CP, then gives a discount on the marked price. The final SP is MP × (1 − discount).",
      "**Assume numbers:** when only percentages are given, take CP = 100 (or a friendly number like 1000) and work with actual rupees."
    ]],
    ["note", "If the question gives no actual rupee amount, pick CP = 100. You can always convert at the end because percentages do not depend on the size of the number."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Profit % / Loss %", "(SP − CP) / CP × 100 · (CP − SP) / CP × 100", "Base is always CP"],
      ["SP from CP", "SP = CP × (100 ± p) / 100", "+ for profit, − for loss"],
      ["CP from SP", "CP = SP × 100 / (100 ± p)", "Divide by the factor to undo"],
      ["Discount", "Discount = MP − SP; Discount % = (MP − SP) / MP × 100", "Base is MP, not CP"],
      ["Marked-up price", "MP = CP × (1 + markup/100)", "SP = MP × (1 − d/100)"],
      ["Successive discounts", "Net = a + b − ab/100", "Or multiply factors: (1 − a/100)(1 − b/100)"],
      ["False weight", "Gain % = (true − false) / false × 100", "The shopkeeper gives less than he charges for"],
      ["Same SP, x% gain and x% loss", "Net loss % = x² / 100", "Always a loss, never a gain or a break-even"],
      ["Buy x, get y free", "Discount % = y / (x + y) × 100", "You pay for x but receive x + y"],
      ["Profit on SP vs on CP", "On CP = p / (100 − p) × 100 · on SP = p / (100 + p) × 100", "Switch the base carefully"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**Ratio form:** if CP : SP = a : b, then profit % = (b − a)/a × 100 (or loss % if b < a).",
      "**Convert to a fraction:** 12.5% profit = 1/8, so SP : CP = 9 : 8. Learn 20% = 1/5, 25% = 1/4, 33⅓% = 1/3, 12.5% = 1/8.",
      "**Successive discount:** do not add 20% and 10%. Multiply 0.8 × 0.9 = 0.72, so the net discount is 28%, not 30%.",
      "**Markup then discount:** MP/CP × (1 − d) gives SP/CP. A 40% markup and a 15% discount gives 1.4 × 0.85 = 1.19, which is a 19% profit.",
      "**Same SP for two items:** just use x²/100. Loss = 4% for 20% each way, no further working.",
      "**False weights:** profit % = error / (what he really gave) × 100. A 900 g weight for 1 kg is 100/900 = 11.11%."
    ]],
    ["tip", "A profit of p% on the selling price means SP = 100 and CP = 100 − p. Take SP = 100 and the base switch is automatic."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/profit-loss/basic-profit-loss-pct", title: "Basic profit / loss %",
      spot: "CP and SP are given and you must find profit or loss %, or the other way round.",
      method: ["Find SP − CP; positive means profit, negative means loss.", "Divide by CP (never by SP).", "Multiply by 100."],
      ex: { q: "A shopkeeper buys a bag for ₹800 and sells it for ₹920. Find the profit percent.", steps: ["Profit = 920 − 800 = ₹120", "Profit % = 120/800 × 100", "= 15%"], ans: "15%" },
      shortcut: "Write profit/CP as a simple fraction: 120/800 = 3/20 = 15%. Fractions beat long division."
    }],
    ["pattern", {
      key: "quant/profit-loss/cp-sp-ratios", title: "CP : SP ratios",
      spot: "The ratio of CP to SP (or SP to CP) is given and you are asked for profit or loss percent.",
      method: ["Treat the ratio parts as actual rupees: CP = a, SP = b.", "Profit or loss = difference of the two parts.", "Divide by the CP part and multiply by 100."],
      ex: { q: "The ratio of cost price to selling price of an article is 8 : 7. Find the loss percent.", steps: ["Let CP = 8 units and SP = 7 units", "Loss = 8 − 7 = 1 unit", "Loss % = 1/8 × 100 = 12.5%"], ans: "12.5% loss" },
      shortcut: "CP : SP = a : b gives (b − a)/a × 100. If SP : CP is given instead, flip it first."
    }],
    ["pattern", {
      key: "quant/profit-loss/marked-price-and-discount", title: "Marked price & discount",
      spot: "A shopkeeper marks goods above cost, then allows a discount, and you must find profit %, MP, or the discount that gives a target profit.",
      method: ["Take CP = 100.", "MP = 100 × (1 + markup/100), then SP = MP × (1 − discount/100).", "Profit % = SP − 100 (since CP = 100)."],
      ex: { q: "A shopkeeper marks his goods 40% above cost and allows a discount of 15%. Find his profit percent.", steps: ["CP = 100, so MP = 140", "SP = 140 × 0.85 = 119", "Profit = 119 − 100"], ans: "19%" },
      shortcut: "Multiply the factors: 1.4 × 0.85 = 1.19. The decimal part of the product is the profit percent."
    }],
    ["pattern", {
      key: "quant/profit-loss/successive-discounts", title: "Successive discounts",
      spot: "“Two (or three) discounts of a%, b%, c% are given one after another” and you need the net discount or the final price.",
      method: ["Write each discount as a factor (20% off is 0.8).", "Multiply all the factors together.", "Net discount = 1 − product. Final price = MP × product."],
      ex: { q: "Successive discounts of 20%, 10% and 5% are given on a ₹2,500 item. Find the net discount and the price paid.", steps: ["Factors: 0.8 × 0.9 × 0.95 = 0.684", "Net discount = 1 − 0.684 = 31.6%", "Price = 2,500 × 0.684 = ₹1,710"], ans: "31.6% net discount, ₹1,710" },
      shortcut: "For two discounts, net = a + b − ab/100. 20 + 10 − 2 = 28%. For three, multiply the factors."
    }],
    ["pattern", {
      key: "quant/profit-loss/dishonest-dealer-false-weights", title: "Dishonest dealer / false weights",
      spot: "A shopkeeper uses a faulty weight (900 g for 1 kg), mixes in something, or both cheats and claims a profit.",
      method: ["True quantity given = the false weight; quantity charged for = the claimed weight.", "Profit % from cheating alone = (claimed − actual) / actual × 100.", "If he also adds a stated profit, multiply the two factors."],
      ex: { q: "A dealer sells at 10% above cost and also uses a weight of 900 g for 1 kg. Find his total profit percent.", steps: ["Selling at 10% above cost gives a factor 1.1", "Cheating gives 1000/900 = 10/9", "Overall factor = 1.1 × 10/9 = 1.2222…, so the profit is 22.22%"], ans: "22.22% (22 2/9 %)" },
      shortcut: "Profit % = (error ÷ true weight given) × 100. 100 g short of 1000 g means 100/900, not 100/1000."
    }],
    ["pattern", {
      key: "quant/profit-loss/buy-x-get-y-free", title: "Buy x get y free",
      spot: "“Buy 4 get 1 free”, “3 for the price of 2”, or any offer where free items are added.",
      method: ["You pay for x items and receive x + y.", "Effective price per item = (x × price) / (x + y).", "Discount % = y / (x + y) × 100."],
      ex: { q: "A shop offers “buy 4 pens, get 1 free” on pens priced ₹20 each. What is the effective price per pen, and the discount percent?", steps: ["Pay 4 × 20 = ₹80 for 5 pens", "Price per pen = 80/5 = ₹16", "Discount = (20 − 16)/20 = 20%, which is 1 free out of 5"], ans: "₹16 per pen, 20% discount" },
      shortcut: "The discount is the free part of the whole: 1 free in 5 is 1/5 = 20%, “buy 3 get 1 free” is 25%."
    }],
    ["pattern", {
      key: "quant/profit-loss/two-items-at-the-same", title: "Two items at the same SP (x% gain and x% loss)",
      spot: "Two articles sold at the same price (or the same total) with a gain of x% on one and a loss of x% on the other.",
      method: ["The overall result is always a loss.", "Loss % = x² / 100.", "If you need the rupee loss, find each CP separately (SP ÷ 1.2 and SP ÷ 0.8)."],
      ex: { q: "Two articles are each sold for ₹1,200, one at a 20% gain and the other at a 20% loss. Find the overall result.", steps: ["CP of the first = 1,200/1.2 = ₹1,000", "CP of the second = 1,200/0.8 = ₹1,500", "Total CP = ₹2,500, total SP = ₹2,400, so loss = ₹100, which is 4% of ₹2,500"], ans: "4% loss (x²/100 = 400/100)" },
      shortcut: "x²/100 straight away: 20² / 100 = 4%. It works only when both items have the same SP."
    }],
    ["pattern", {
      key: "quant/profit-loss/profit-pct-on-sp-vs", title: "Profit % on SP vs CP",
      spot: "“Profit is p% of the selling price”, or profit asked on SP instead of CP.",
      method: ["If profit is p% of SP, take SP = 100, so profit = p and CP = 100 − p.", "Profit on CP = p / (100 − p) × 100.", "Reverse direction (profit on CP is q%): on SP = q / (100 + q) × 100."],
      ex: { q: "A trader’s profit is 20% of the selling price. Find his profit percent on cost.", steps: ["Take SP = 100, so profit = 20 and CP = 80", "Profit on CP = 20/80 × 100"], ans: "25%" },
      shortcut: "20% on SP is 25% on CP (a fifth of the price, a quarter of the cost). The same fraction shifts bases: 1/5 → 1/4."
    }],
    ["pattern", {
      key: "quant/profit-loss/finding-cp-from-two-selling", title: "Finding CP from two selling scenarios",
      spot: "The same article is sold at two different prices with two different results, and the CP is wanted.",
      method: ["Express both results as percents of CP (loss as negative).", "The difference in selling prices = the difference in percents × CP.", "CP = price difference × 100 / percent difference."],
      ex: { q: "An article sold at a loss of 10% would give a profit of 15% if it were sold for ₹150 more. Find the cost price.", steps: ["Difference in percent = 15 − (−10) = 25%", "25% of CP = ₹150", "CP = 150 × 100/25"], ans: "₹600" },
      shortcut: "Check: 90% of 600 = 540 and 115% of 600 = 690, and the gap is 150."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Wrong base for profit:** profit % is on CP, discount % is on MP. Mixing them is the most common mistake.",
      "**Adding discounts:** 20% and 10% do not make 30%. They make 28%.",
      "**Gain % ≠ markup %:** a 40% markup with a 15% discount is a 19% profit, not 25%.",
      "**Same SP, equal gain and loss:** there is always a loss, never break-even.",
      "**False weights:** divide the error by the weight actually given, not the claimed weight.",
      "**Free items:** “buy 4 get 1 free” is 20% off, not 25%.",
      "**Profit on SP:** remember to switch the base. 20% on SP is 25% on CP.",
      "**Loss % > 100:** impossible. A loss can never exceed 100% of CP, but a profit can."
    ]],
    ["warn", "Write down: What is CP? What is SP? What is the base of the percent in the question? Then calculate."],

    ["h2", "Quick check"],
    ["quiz", ["profit-loss-01", "profit-loss-03", "profit-loss-04", "profit-loss-06", "profit-loss-07"]]
  ]
});
BRIEFS["quant:profit-loss"] = "Profit and loss percentages sit on the cost price, and discount percentages sit on the marked price. Treat each change as a multiplying factor: 20% profit is 1.2, 10% discount is 0.9, and chains simply multiply, so two discounts of 20% and 10% make a net 28%.\n\nThe nine patterns cover the usual shop stories: markup then discount, false weights, buy-x-get-y-free, two items sold at the same price, profit on selling price, and finding the cost from two scenarios. Take CP as 100 when no amounts are given.";

LEARN.quant.push({
  id: "interest", group: "Arithmetic", title: "Simple & compound interest",
  sub: "Interest on the original sum versus interest on interest, and the shortcuts that avoid long multiplication",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "Banking"],
  blocks: [
    ["h2", "The idea"],
    ["p", "**Interest** is the rent you pay for borrowing money (or earn for lending it). The **principal (P)** is the amount borrowed, **R** is the yearly rate in percent, **T** is the time in years, and the **amount (A)** is principal plus interest."],
    ["p", "In **simple interest (SI)**, interest is earned on the original principal only, so the same amount is added every year. In **compound interest (CI)**, each year’s interest is added to the principal and earns interest too, so the amount grows by a fixed **factor** every period."],
    ["list", [
      "**SI is a straight line:** the same interest every year. Doubling the time doubles the interest.",
      "**CI is a growing line:** the amount is multiplied by (1 + R/100) each year. After n years the factor is (1 + R/100)ⁿ.",
      "**CI − SI** in the first year is zero. The difference appears from the second year, because of “interest on interest”.",
      "**If compounding is half-yearly or quarterly,** halve (or quarter) the rate and double (or quadruple) the number of periods."
    ]],
    ["note", "For the first year SI and CI are equal. Their difference starts from year 2, and that is why “CI − SI” questions give a tidy formula."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Simple interest", "SI = P × R × T / 100", "A = P + SI = P(1 + RT/100)"],
      ["Compound amount (annual)", "A = P (1 + R/100)ⁿ", "CI = A − P"],
      ["Half-yearly", "A = P (1 + R/200)²ⁿ", "Rate R/2 per period, 2n periods"],
      ["Quarterly", "A = P (1 + R/400)⁴ⁿ", "Rate R/4 per period, 4n periods"],
      ["CI − SI (2 years)", "P (R/100)²", "The interest on the first year’s interest"],
      ["CI − SI (3 years)", "P (R/100)² (300 + R)/100", "= 3PR²/10⁴ + PR³/10⁶"],
      ["Becomes n times (SI)", "R = (n − 1) × 100 / T", "Double in T years: R = 100/T"],
      ["Becomes n times (CI)", "If it doubles in t years, it becomes 4× in 2t, 8× in 3t", "Rule of 72: doubling time ≈ 72 / R years"],
      ["Equal instalments (CI)", "P = x/(1 + r) + x/(1 + r)² + …", "Discount each payment back to today"],
      ["Different rates each year", "A = P (1 + r₁)(1 + r₂)(1 + r₃)", "Multiply the factors, one per year"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**SI in your head:** 8% for 3 years is 24% of P. Multiply rate × years, then take that percent of P.",
      "**Two-year factors:** 5% → 1.1025, 10% → 1.21, 20% → 1.44, 8% → 1.1664. Learn the squares of 1.05, 1.1, 1.2.",
      "**Annual vs the same SI:** CI for 2 years at R% equals SI at (2R + R²/100)%. At 10%, that is 21%.",
      "**Year-by-year check:** each year’s CI interest is bigger than the previous year’s by exactly R% of that previous interest. 10% on ₹1,000 gives 100, then 110, then 121.",
      "**Time to double:** SI doubles in 100/R years; CI doubles in about 72/R years.",
      "**Different rates:** just multiply the factors in order (the order does not matter)."
    ]],
    ["tip", "Never expand (1 + r)ⁿ by long multiplication if you can avoid it. Year-by-year multiplication with friendly rates (5%, 10%, 20%) is faster and safer."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/interest/si-basics-find-p-r", title: "SI basics; find P / R / T",
      spot: "Interest earned is given, and one of principal, rate or time is missing.",
      method: ["Use SI = PRT/100.", "Substitute the three known values.", "Solve for the missing one."],
      ex: { q: "At what rate percent per annum will ₹8,000 earn a simple interest of ₹1,920 in 3 years?", steps: ["SI = P × R × T / 100", "1,920 = 8,000 × R × 3 / 100 = 240 R", "R = 1,920 / 240"], ans: "8% per annum" },
      shortcut: "Per year the interest is 1,920/3 = ₹640, which is 640/8,000 = 8% of the principal."
    }],
    ["pattern", {
      key: "quant/interest/ci-annual", title: "CI annual",
      spot: "A sum is invested for 2 or 3 years at a given yearly rate with interest added each year.",
      method: ["Convert the rate to a factor (8% → 1.08).", "Multiply the principal by the factor once per year.", "CI = amount − principal."],
      ex: { q: "Find the compound interest on ₹12,500 for 2 years at 8% per annum.", steps: ["Year 1: 12,500 × 1.08 = 13,500", "Year 2: 13,500 × 1.08 = 14,580", "CI = 14,580 − 12,500"], ans: "₹2,080" },
      shortcut: "Two years at 8% is a factor of 1.1664, so the CI is 16.64% of the principal (12,500 × 0.1664 = 2,080)."
    }],
    ["pattern", {
      key: "quant/interest/ci-half-yearly-and-quarterly", title: "CI half-yearly & quarterly",
      spot: "“Compounded half-yearly (or quarterly)”, usually for 1, 1½ or 2 years.",
      method: ["Divide the yearly rate by 2 (half-yearly) or 4 (quarterly).", "Multiply the number of years by 2 or 4 to get the periods.", "Apply the factor once per period."],
      ex: { q: "Find the CI on ₹8,000 for 1½ years at 10% per annum compounded half-yearly.", steps: ["Rate per half-year = 5%, number of periods = 3", "Factor = 1.05³ = 1.157625", "Amount = 8,000 × 1.157625 = 9,261, so CI = 9,261 − 8,000"], ans: "₹1,261" },
      shortcut: "Half-yearly compounding earns only slightly more than annual at the same rate. A much bigger answer means you used the full rate for each half-year."
    }],
    ["pattern", {
      key: "quant/interest/ci-si-for-2-and", title: "CI − SI for 2 and 3 years",
      spot: "The difference between CI and SI for 2 or 3 years is given, and the principal, rate or both are asked.",
      method: ["For 2 years: CI − SI = P (R/100)².", "For 3 years: CI − SI = P (R/100)² × (300 + R)/100.", "Substitute and solve for the missing value."],
      ex: { q: "The difference between the CI and SI on a sum for 2 years at 5% per annum is ₹60. Find the sum.", steps: ["CI − SI = P (R/100)² = P × (5/100)² = P/400", "P/400 = 60", "P = 60 × 400"], ans: "₹24,000" },
      shortcut: "The 2-year difference is the interest on one year’s interest: 5% of 5% of P. Take 5% twice."
    }],
    ["pattern", {
      key: "quant/interest/becomes-n-times-doubling", title: "Becomes n times / doubling (rule of 72)",
      spot: "“A sum doubles (or triples) in T years; in how many years will it become …?”",
      method: ["For SI, the gain per year is constant. Doubling in T years means a gain of 100% in T years.", "Tripling needs a gain of 200%, so twice as long (for SI).", "For CI use powers: if it doubles in t years, it becomes 4× in 2t, 8× in 3t."],
      ex: { q: "A sum becomes double in 5 years at simple interest. In how many years will it become triple?", steps: ["Doubling means a 100% gain in 5 years, so 20% per year", "Tripling needs a 200% gain", "Time = 200/20"], ans: "10 years" },
      shortcut: "For SI: time to become n times = (n − 1) × time to double. For CI the times add up: double in 3 years, 8 times in 9 years. Rule of 72: doubling time ≈ 72/R years (at 8%, about 9 years)."
    }],
    ["pattern", {
      key: "quant/interest/equal-instalments", title: "Equal instalments",
      spot: "A loan is repaid in equal yearly instalments, with compound interest charged on the balance.",
      method: ["Each instalment x paid after k years is worth x/(1 + r)ᵏ today.", "Add the present values of all instalments to get the loan amount.", "To find x from the loan, divide by the sum of the discount factors."],
      ex: { q: "A loan is repaid in two equal yearly instalments of ₹3,630 each, with interest at 10% per annum compounded annually. Find the sum borrowed.", steps: ["First instalment’s value today = 3,630/1.1 = ₹3,300", "Second instalment’s value today = 3,630/1.21 = ₹3,000", "Loan = 3,300 + 3,000"], ans: "₹6,300" },
      shortcut: "Use friendly rates: at 10%, divide by 1.1 and by 1.21 (or by 11/10 and 121/100). Present values are always smaller than the instalment."
    }],
    ["pattern", {
      key: "quant/interest/different-rates-each-year", title: "Different rates each year",
      spot: "The rate changes every year (for example 5%, 10%, 20% for years 1, 2, 3).",
      method: ["Write each year’s rate as a factor.", "Multiply the principal by all the factors in turn.", "CI = final amount − principal."],
      ex: { q: "Find the CI on ₹20,000 for 3 years if the rates are 5%, 10% and 20% in successive years.", steps: ["Factor = 1.05 × 1.1 × 1.2 = 1.386", "Amount = 20,000 × 1.386 = ₹27,720", "CI = 27,720 − 20,000"], ans: "₹7,720" },
      shortcut: "Keep a running amount: 20,000 → 21,000 → 23,100 → 27,720, adding the interest at each step."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Amount vs interest:** the formula A = P(1 + r)ⁿ gives the amount. Subtract P to get the CI.",
      "**Half-yearly:** halve the rate AND double the periods. Doing only one is the usual mistake.",
      "**Time in months:** change months to years (9 months = 0.75 years) before using SI = PRT/100.",
      "**CI − SI for 3 years:** the formula is not (R/100)³ alone. It has the extra (300 + R)/100 factor.",
      "**SI for the first year equals CI,** so the “difference” questions only make sense from year 2 onwards.",
      "**“Doubles in 5 years” for CI vs SI:** at SI it triples in 10, but at CI it becomes 4× in 10 years.",
      "**Different rates:** do not average the rates. Multiply the factors.",
      "**Instalments:** the final instalment earns no interest. Do not add interest to the last payment."
    ]],
    ["warn", "Ask: simple or compound? Annual, half-yearly or quarterly? Is the answer the amount, the interest, or the principal?"],

    ["h2", "Quick check"],
    ["quiz", ["interest-01", "interest-03", "interest-04", "interest-06", "interest-09"]]
  ]
});
BRIEFS["quant:interest"] = "Simple interest adds the same amount every year; compound interest multiplies the amount by a fixed factor each period. SI = PRT/100, and CI is the final amount minus the principal. For half-yearly or quarterly compounding, divide the rate and multiply the periods.\n\nThe seven patterns cover SI basics, annual and part-year CI, the neat CI-minus-SI formulas, doubling and tripling, equal instalments, and changing rates. Use friendly factors (1.1, 1.05, 1.2) and multiply year by year instead of expanding powers.";


LEARN.quant.push({
  id: "ratio", group: "Arithmetic", title: "Ratio, proportion & variation",
  sub: "Comparing quantities with colons: sharing, mixing ratios, proportion and direct / inverse change",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "eLitmus"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A **ratio** compares two quantities of the same kind by division: 3 : 5 means “for every 3 of the first there are 5 of the second”. It has no unit. A **proportion** says two ratios are equal (a : b = c : d), and **variation** says how one quantity moves when another does."],
    ["p", "The master trick: **write the ratio as 3k and 5k.** The letter k is one “unit” of the ratio. Every sentence in the problem then turns into a simple equation in k, and you solve for it once."],
    ["list", [
      "**Parts, not amounts:** 3 : 5 has 8 parts in all. If the total is ₹800, one part is ₹100.",
      "**Ratios multiply and divide freely:** 3 : 5 = 6 : 10 = 1.5 : 2.5. You can scale both sides by the same number.",
      "**Direct variation:** both quantities rise together (more pens, more cost), so their ratio stays fixed.",
      "**Inverse variation:** one rises as the other falls (more workers, fewer days), so their product stays fixed."
    ]],
    ["note", "Always put the ratio in the same order as the question: A : B means A first. A swapped order is the quickest way to a wrong answer."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Ratio", "a : b = a/b", "Same unit on both sides"],
      ["Sharing in ratio a : b : c", "Share of A = a / (a + b + c) × Total", "One part = Total / (a + b + c)"],
      ["Combining ratios", "a : b and b : c → make the b’s equal, then join", "Multiply each ratio so B has the LCM of its two values"],
      ["Mean proportional", "Between a and b: √(ab)", "a : x = x : b"],
      ["Third proportional", "To a and b: b² / a", "a : b = b : x"],
      ["Fourth proportional", "To a, b, c: bc / a", "a : b = c : x"],
      ["Direct variation", "x / y = constant", "x₁/y₁ = x₂/y₂"],
      ["Inverse variation", "x × y = constant", "x₁ y₁ = x₂ y₂ (men × days = work)"],
      ["Adding to both terms", "(a + x) : (b + x) = c : d", "Solve the single equation for x (or for k)"],
      ["Compound ratio", "a : b and c : d → ac : bd", "Multiply the two ratios term by term"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**Use 3k and 5k:** “their difference is 24” means 2k = 24, and “their sum is 24” means 8k = 24.",
      "**Fractions as ratios:** ½ : ⅓ : ¼ becomes 6 : 4 : 3 after multiplying by 12 (the LCM of the denominators).",
      "**Sharing:** find the total parts first (2 + 3 + 4 = 9), then each share is parts/9 of the total.",
      "**Coins and notes:** multiply each ratio part by its value (₹1, ₹2, ₹5) to get the value ratio, then divide the total.",
      "**Check by plugging in:** put the numbers back in the original sentence. It takes ten seconds and catches almost every slip.",
      "**Inverse problems:** keep a “total work” number (men × days) and divide it by the new amount."
    ]],
    ["tip", "Ratio questions are percentages in disguise. A ratio of 3 : 5 means the first is 60% of the second and 3/8 = 37.5% of the total."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/ratio/ratio-basics", title: "Ratio basics",
      spot: "Two (or more) quantities in a ratio, plus their sum, difference or one of the quantities, and you need the others.",
      method: ["Write the quantities as ak and bk.", "Turn the given fact (sum, difference or value) into an equation in k.", "Solve for k and put it back."],
      ex: { q: "The ratio of boys to girls in a class is 7 : 5 and there are 24 more boys than girls. How many students are there in all?", steps: ["Boys = 7k and girls = 5k, so the difference = 2k = 24 and k = 12", "Total = 12k = 12 × 12"], ans: "144 students" },
      shortcut: "The ratio difference (2 parts) matches the real difference (24), so one part is 12. Total parts × one part gives the answer."
    }],
    ["pattern", {
      key: "quant/ratio/dividing-an-amount", title: "Dividing an amount",
      spot: "A sum of money is shared among two or more people in a given ratio (often given as fractions).",
      method: ["If the ratio is in fractions, multiply by the LCM of the denominators to get whole numbers.", "Total parts = sum of the ratio terms; one part = Total ÷ parts.", "Each share = its terms × one part."],
      ex: { q: "₹5,200 is divided among A, B and C in the ratio ½ : ⅓ : ¼. Find each share.", steps: ["Multiply by 12: 6 : 4 : 3, so 13 parts in all", "One part = 5,200/13 = ₹400", "A = 6 × 400 = ₹2,400, B = 4 × 400 = ₹1,600, C = 3 × 400 = ₹1,200"], ans: "A ₹2,400, B ₹1,600, C ₹1,200" },
      shortcut: "A share is its fraction of the total: C’s share = 3/13 of the total. Check that the shares add back to the whole."
    }],
    ["pattern", {
      key: "quant/ratio/combining-ratios", title: "Combining ratios (a:b, b:c → a:b:c)",
      spot: "Two ratios share a common middle term (A : B and B : C) and you want A : B : C.",
      method: ["Find the LCM of the two values of B.", "Scale each ratio so that B has that value.", "Join them: A : B : C."],
      ex: { q: "A : B = 3 : 4 and B : C = 6 : 7. Find A : B : C, and the share of each if the total is ₹3,500.", steps: ["LCM of 4 and 6 is 12", "A : B = 3 : 4 = 9 : 12 and B : C = 6 : 7 = 12 : 14, so A : B : C = 9 : 12 : 14", "Total parts = 35, one part = 3,500/35 = ₹100, so A = 900, B = 1,200, C = 1,400"], ans: "9 : 12 : 14 (₹900, ₹1,200, ₹1,400)" },
      shortcut: "Cross-multiply into B’s column: A is multiplied by the second B, C by the first B. Here A : B : C = 3×6 : 4×6 : 4×7 = 18 : 24 : 28 = 9 : 12 : 14."
    }],
    ["pattern", {
      key: "quant/ratio/mean-third-fourth-proportional", title: "Mean / third / fourth proportional",
      spot: "“Find the mean (or third, or fourth) proportional of …”.",
      method: ["Mean proportional of a and b: √(ab).", "Third proportional to a and b: b² / a.", "Fourth proportional to a, b and c: bc / a."],
      ex: { q: "Find the mean proportional between 12 and 27, and the third proportional to 4 and 10.", steps: ["Mean proportional = √(12 × 27) = √324 = 18", "Third proportional to 4 and 10: 4 : 10 = 10 : x, so x = 10 × 10/4"], ans: "18 and 25" },
      shortcut: "Think of a chain a : b = b : x. The third term is just the second squared over the first. For fourth, cross-multiply and divide by the odd one out."
    }],
    ["pattern", {
      key: "quant/ratio/coins-and-notes", title: "Coins & notes",
      spot: "A bag has coins or notes of different values in a given ratio of numbers, and the total value is given.",
      method: ["Write the numbers as ak, bk, ck.", "Value = number × face value, so total value = sum of (number × face value) × k.", "Solve for k, then find the count asked."],
      ex: { q: "A bag holds ₹1, ₹2 and ₹5 notes in the ratio 5 : 3 : 2 by number, and the total value is ₹1,260. How many ₹2 notes are there?", steps: ["Value per unit of k: 5 × 1 + 3 × 2 + 2 × 5 = 21", "21k = 1,260, so k = 60", "₹2 notes = 3k = 180"], ans: "180 notes" },
      shortcut: "The values of the three kinds of note are in the ratio 5 : 6 : 10. If a question gives the value ratio and asks for counts, divide each value part by its face value to get the count ratio."
    }],
    ["pattern", {
      key: "quant/ratio/adding-removing-to-change-a", title: "Adding / removing to change a ratio",
      spot: "The same number is added to (or taken from) both quantities and the ratio changes.",
      method: ["Write the quantities as ak and bk.", "After the change: (ak + x) : (bk + x) = c : d, which gives a single equation by cross-multiplying.", "Solve for k, then compute the quantities."],
      ex: { q: "Two numbers are in the ratio 3 : 5. When 10 is added to each, the ratio becomes 2 : 3. Find the numbers.", steps: ["Numbers are 3k and 5k, so (3k + 10) / (5k + 10) = 2/3", "3(3k + 10) = 2(5k + 10), so 9k + 30 = 10k + 20 and k = 10", "Numbers are 30 and 50", "Check: 40/60 = 2/3"], ans: "30 and 50" },
      shortcut: "The difference of the two numbers never changes when you add the same amount to both. Match the difference in both ratios (2 parts then 1 part)."
    }],
    ["pattern", {
      key: "quant/ratio/income-and-expenditure-ratios", title: "Income & expenditure ratios",
      spot: "Two people have incomes and expenditures in given ratios and the same (or a stated) saving.",
      method: ["Let incomes be ak and bk, and expenditures be cm and dm.", "Savings = income − expenditure for each person, giving two equations.", "Solve the two equations for k and m."],
      ex: { q: "The incomes of A and B are in the ratio 5 : 4 and their expenditures are in the ratio 3 : 2. Each saves ₹1,600. Find A’s income.", steps: ["Incomes 5x and 4x, expenditures 3y and 2y", "5x − 3y = 1,600 and 4x − 2y = 1,600", "From the second, y = 2x − 800. Put into the first: 5x − 6x + 2,400 = 1,600, so x = 800 and y = 800", "A’s income = 5 × 800"], ans: "₹4,000" },
      shortcut: "Incomes 4,000 and 3,200 with expenditures 2,400 and 1,600 check out: 1,600 saved by each. Always test with the savings."
    }],
    ["pattern", {
      key: "quant/ratio/direct-and-inverse-variation", title: "Direct & inverse variation",
      spot: "“If 12 men take 15 days…”, “food lasts for … days”, or any question where two quantities move together or against each other.",
      method: ["Decide: direct (x ÷ y fixed) or inverse (x × y fixed).", "For inverse, find the constant (total work or total supply).", "Divide the constant by the new value."],
      ex: { q: "A hostel has food for 60 students for 24 days. If 20 more students join, for how many days will the food last?", steps: ["Food = 60 × 24 = 1,440 student-days", "Now there are 80 students", "Days = 1,440/80"], ans: "18 days" },
      shortcut: "More people means fewer days. Scale by the inverse ratio: 60/80 × 24 = 18, so the days must go down."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Swapped order:** A : B is not B : A. Read the question carefully.",
      "**Using the ratio terms as the actual values:** 7 : 5 does not mean 7 and 5. It means 7k and 5k.",
      "**Adding the same amount to a ratio:** (3 + 10) : (5 + 10) is not the new ratio unless k = 1. Add to the actual quantities.",
      "**Unit mismatch:** compare like with like (both in rupees, or both in cm).",
      "**Fractional ratios:** clear the fractions with the LCM first (½ : ⅓ → 3 : 2).",
      "**Inverse vs direct:** more workers means fewer days, so use the product rule.",
      "**Combining ratios:** match the common term B before you join the ratios.",
      "**Coins:** the ratio is in numbers of coins; multiply by face value to get money."
    ]],
    ["warn", "Write 3k and 5k at the very start. Every word in the problem becomes an equation in k."],

    ["h2", "Quick check"],
    ["quiz", ["ratio-01", "ratio-02", "ratio-04", "ratio-07", "ratio-09"]]
  ]
});
BRIEFS["quant:ratio"] = "A ratio compares like quantities, and the master move is to write them as 3k and 5k so every sentence becomes an equation in one letter. Sharing, combining, coins and notes, and ratio-changing questions all follow from that.\n\nProportions use cross-multiplication, and variation comes in two kinds: direct (the ratio stays fixed) and inverse (the product stays fixed, like men times days). Clear fractions with the LCM first and always check by putting the answer back into the words.";

LEARN.quant.push({
  id: "partnership", group: "Arithmetic", title: "Partnership",
  sub: "Dividing a profit fairly: money in, time in, and who does the work",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "Cognizant"],
  blocks: [
    ["h2", "The idea"],
    ["p", "In a partnership several people put money into a business and share the profit (or loss). The fair rule is that **profit is shared in the ratio of capital × time**. A partner who puts in more money, or leaves it in for longer, takes a bigger share."],
    ["list", [
      "**Equal time:** if everyone invests for the same period, the profit ratio is just the ratio of the investments.",
      "**Different times:** multiply each investment by the months it was in (a “money-months” number) and take the ratio of those.",
      "**Working partner:** a partner who runs the business gets a fixed salary or a commission first; the rest of the profit is shared by capital × time.",
      "**Loss is shared the same way:** in the ratio of capital × time (unless a working partner’s commission is stated separately)."
    ]],
    ["note", "Think of every rupee as renting space in the business for a month. Profit follows the total “rupee-months”, not just the rupees."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Equal time", "Profit ratio = capital ratio", "A : B : C = a : b : c"],
      ["Different times", "Profit ratio = (capital × months)", "A : B = a × t₁ : b × t₂"],
      ["Share of a partner", "Share = (his money-months / total money-months) × Profit", "Money-months = capital × time"],
      ["Working partner’s salary", "Salary (or commission) first, then split the rest", "Total of a partner = salary + share of the remainder"],
      ["Investment changed midway", "Add capital × months for each period", "e.g. 20,000 × 4 + 30,000 × 8"],
      ["Joining late", "Months = 12 − months before joining", "Partner who joins after 3 months invests for 9"],
      ["Finding a missing capital", "c₁ / c₂ = (s₁ / s₂) × (t₂ / t₁)", "Use it when the profit split and the times are known"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**Cancel common factors:** A puts in 6,000 for 12 months and B 8,000 for 6 months: 72,000 : 48,000 = 3 : 2.",
      "**Same time, same ratio:** do not multiply by time when it is equal for everyone.",
      "**Months as units:** keep months as plain numbers (12, 9, 6). No need to convert to years.",
      "**Salary first:** subtract the working partner’s commission from the total profit before using the ratio.",
      "**Shares add up:** after splitting, check that the shares add to the total profit.",
      "**Capital unknown:** if the profit ratio and one capital are known, scale the ratio to find the other capital."
    ]],
    ["tip", "Write a small table: one row per partner, columns for Capital, Months, Capital × Months. The profit ratio is the last column."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/partnership/equal-time", title: "Equal time",
      spot: "Partners invest different amounts, all for the whole year (or the same period), and the profit is to be shared.",
      method: ["The profit ratio equals the investment ratio.", "Cancel common factors to get small numbers.", "Divide the profit in that ratio."],
      ex: { q: "A, B and C invest ₹20,000, ₹30,000 and ₹50,000 in a business. The year’s profit is ₹25,000. Find each share.", steps: ["Ratio = 20 : 30 : 50 = 2 : 3 : 5, which is 10 parts", "One part = 25,000/10 = ₹2,500", "A = 5,000, B = 7,500, C = 12,500"], ans: "A ₹5,000, B ₹7,500, C ₹12,500" },
      shortcut: "Cancel the zeros first. Each person’s share is their investment divided by the total investment."
    }],
    ["pattern", {
      key: "quant/partnership/different-times", title: "Different times",
      spot: "Partners invest for different numbers of months (someone joins late or withdraws early).",
      method: ["Money-months = capital × months for each partner.", "Take the ratio of the money-months and simplify.", "Share the profit in that ratio."],
      ex: { q: "A invests ₹6,000 for 12 months and B invests ₹8,000 for 6 months. The profit is ₹10,000. Find each share.", steps: ["A: 6,000 × 12 = 72,000 and B: 8,000 × 6 = 48,000", "Ratio = 72 : 48 = 3 : 2, which is 5 parts", "One part = 2,000, so A = ₹6,000 and B = ₹4,000"], ans: "A ₹6,000, B ₹4,000" },
      shortcut: "If one partner has more money but less time (or the opposite), the money-months can come out equal. Always multiply."
    }],
    ["pattern", {
      key: "quant/partnership/working-partner-s-salary", title: "Working partner’s salary",
      spot: "One partner manages the business and receives a percent of the profit (or a fixed amount) as a salary before the rest is divided.",
      method: ["Work out the salary from the total profit first.", "Share the remaining profit in the ratio of capital × time.", "The working partner’s total = salary + share of the remainder."],
      ex: { q: "A invests ₹40,000 and B invests ₹60,000 for a year. B manages the business and gets 10% of the profit as salary, and the rest is shared in the ratio of capital. The profit is ₹25,000. How much does each get?", steps: ["B’s salary = 10% of 25,000 = ₹2,500", "Remaining = 25,000 − 2,500 = ₹22,500, shared 40 : 60 = 2 : 3", "A = 22,500 × 2/5 = ₹9,000", "B = 22,500 × 3/5 + 2,500 = 13,500 + 2,500 = ₹16,000"], ans: "A ₹9,000, B ₹16,000" },
      shortcut: "A’s share is a pure ratio share of the remainder. B gets that plus the salary. Check: 9,000 + 16,000 = 25,000."
    }],
    ["pattern", {
      key: "quant/partnership/investment-changed-midway", title: "Investment changed midway",
      spot: "A partner adds or withdraws money part-way through the year, or the capital changes in stages.",
      method: ["Split the year into periods with a constant capital.", "Capital × months for each period, then add the periods for that partner.", "Take the ratio of the totals and share the profit."],
      ex: { q: "A starts with ₹20,000 and adds ₹10,000 after 4 months. B invests ₹25,000 for the whole year. The year’s profit is ₹31,000. Find each share.", steps: ["A: 20,000 × 4 + 30,000 × 8 = 80,000 + 240,000 = 320,000", "B: 25,000 × 12 = 300,000", "Ratio = 320 : 300 = 16 : 15, which is 31 parts", "One part = 31,000/31 = ₹1,000, so A = ₹16,000 and B = ₹15,000"], ans: "A ₹16,000, B ₹15,000" },
      shortcut: "After adding ₹10,000 the capital is 30,000 for the remaining 8 months (12 − 4). Do not forget the earlier months at the old capital."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Ignoring time:** if the periods differ, you must multiply by months. The investment ratio alone is wrong.",
      "**Joining late:** a partner who joins after 3 months has 9 months, not 3.",
      "**Salary:** take the working partner’s salary out first. Do not share it by capital.",
      "**Capital changes:** split the year at each change and add the periods.",
      "**Sharing loss:** losses are shared the same way as profits (by capital × time).",
      "**Ratio order:** keep the order of the partners the same in the ratio and in the shares.",
      "**Units:** keep time in the same unit for everyone (all months).",
      "**Percent of profit vs of capital:** a commission is on the total profit, not on the capital."
    ]],
    ["warn", "Build the capital × months table first. Every partnership question is that table plus a division of the profit."],

    ["h2", "Quick check"],
    ["quiz", ["partnership-01", "partnership-04", "partnership-06", "partnership-08", "partnership-09"]]
  ]
});
BRIEFS["quant:partnership"] = "Partners share profit in the ratio of capital times time. With equal time it is just the ratio of the investments; with different times, multiply each capital by its months first. If one partner works the business, pay the salary or commission out of the profit first and share the rest by capital times time.\n\nWhen the capital changes during the year, split the year into stretches of constant capital and add them up for each partner. A small table of capital, months and their product keeps every question tidy.";
