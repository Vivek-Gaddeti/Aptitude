/* Cheat sheet: Quantitative Aptitude (27 topics). Entry format: see docs/SPEC-batch-q.md section B. */
window.FORMULAS = window.FORMULAS || [];
(function () {
  var Q = [
    { topic: "number-system", title: "Number system",
      items: [
        ["Divisibility by 3 / 9", "digit sum divisible by 3 / 9", "remainder = digit sum mod 3 or 9"],
        ["Divisibility by 4 / 8", "last 2 / last 3 digits divisible by 4 / 8", ""],
        ["Divisibility by 11", "(sum of odd-place digits) − (sum of even-place digits) = 0 or ±11k", ""],
        ["Divisibility by 7, 11, 13", "split into groups of 3 from right; alternate-sign sum divisible by 7 / 11 / 13", "because 1001 = 7 × 11 × 13"],
        ["Number of factors", "N = aᵖ·bᵠ·cʳ ⇒ (p+1)(q+1)(r+1)", "includes 1 and N"],
        ["Sum of factors", "(aᵖ⁺¹−1)/(a−1) × (bᵠ⁺¹−1)/(b−1) × …", "e.g. 12 = 2²·3 → 7 × 4 = 28"],
        ["Product of factors", "N^(number of factors / 2)", ""],
        ["Odd / even factors", "odd: ignore the power of 2; even = total − odd", ""],
        ["Perfect-square factors", "product of (⌊p/2⌋+1) over every prime power", "all exponents even"],
        ["Number of ways as product of 2 factors", "total factors / 2 (N not a perfect square)", "(total + 1)/2 if N is a perfect square"],
        ["Trailing zeros in n!", "⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + …", "count of 5s"],
        ["Highest power of prime p in n!", "⌊n/p⌋ + ⌊n/p²⌋ + ⌊n/p³⌋ + …", "Legendre's formula"],
        ["Fermat's little theorem", "p prime, p ∤ a ⇒ aᵖ⁻¹ ≡ 1 (mod p)", ""],
        ["Euler's theorem", "gcd(a, n) = 1 ⇒ a^φ(n) ≡ 1 (mod n)", "φ(n) = n(1−1/p₁)(1−1/p₂)…"],
        ["Remainder theorem", "f(x) ÷ (x − a) leaves remainder f(a)", ""],
        ["Wilson's theorem", "(p−1)! ≡ −1 (mod p)", "p prime"],
        ["Sum of first n natural / odd / even", "n(n+1)/2 ; n² ; n(n+1)", ""],
        ["Sum of squares / cubes of first n", "n(n+1)(2n+1)/6 ; [n(n+1)/2]²", ""],
        ["Base conversion", "divide repeatedly by new base (read remainders upward); expand by place powers back to base 10", "e.g. 1011₂ = 8+2+1 = 11"],
        ["Two-digit number", "10a + b ; reversed = 10b + a", "sum = 11(a+b), difference = 9(a−b)"],
        ["Recurring decimal → fraction", "0.(a) = a/9 ; 0.(ab) = ab/99 ; 0.(abc) = abc/999", "bracket = repeating block"]
      ],
      tricks: [
        "Unit digit of aⁿ: cycle lengths 4 for 2, 3, 7, 8 (2→2,4,8,6; 3→3,9,7,1; 7→7,9,3,1; 8→8,4,2,6); 0, 1, 5, 6 never change; 4 and 9 cycle of 2. Use n mod 4 (0 means 4th position).",
        "Last two digits: 76ⁿ ends in 76, 25ⁿ in 25 (n ≥ 2), 01 stays 01; 7⁴ = 2401 ends in 01, so reduce the power of 7 mod 4; 24ⁿ ends in 24 (n odd) or 76 (n even).",
        "Divisibility by 7: double the last digit and subtract it from the rest; repeat until small.",
        "Divisibility by 6, 12, 15 etc.: test co-prime parts separately (2 and 3 for 6; 3 and 4 for 12).",
        "Any n consecutive integers have a product divisible by n!; product of 3 consecutive is divisible by 6.",
        "Remainder of aⁿ ÷ m: reduce a mod m first, then use the cycle of remainders, or use −1 form (e.g. 7²⁵ mod 8: 7 ≡ −1)."
      ],
      traps: [
        "Count of factors includes 1 and the number itself; 'proper' factors exclude N (and sometimes 1).",
        "Trailing zeros: count 5s, not 2s, and keep dividing by 25, 125 …, not just by 5.",
        "Cycle position: when n mod 4 = 0 use the 4th term of the cycle, not the 0th.",
        "1 is neither prime nor composite; 2 is the only even prime."
      ] },

    { topic: "hcf-lcm", title: "HCF & LCM",
      items: [
        ["HCF × LCM", "HCF(a, b) × LCM(a, b) = a × b", "only for TWO numbers"],
        ["HCF / LCM by primes", "HCF = lowest powers of common primes ; LCM = highest powers of all primes", ""],
        ["HCF of fractions", "HCF of numerators / LCM of denominators", "fractions in lowest terms"],
        ["LCM of fractions", "LCM of numerators / HCF of denominators", "fractions in lowest terms"],
        ["Largest number dividing a, b, c leaving remainders r₁, r₂, r₃", "HCF(a − r₁, b − r₂, c − r₃)", "same remainder r: HCF of the differences"],
        ["Largest number leaving the SAME remainder", "HCF(a − b, b − c, a − c)", "differences only"],
        ["Smallest number leaving the same remainder r", "LCM(d₁, d₂, …) + r", ""],
        ["Smallest number leaving remainder (d − r) each time", "LCM(d₁, d₂, …) − k", "when d₁ − r₁ = d₂ − r₂ = k"],
        ["Smallest n-digit number divisible by x", "n-digit smallest − (its remainder mod x) + x", "or n-digit smallest rounded up to a multiple of x"],
        ["Greatest n-digit number divisible by x", "greatest n-digit number − (remainder when divided by x)", ""],
        ["Bells / lights together again", "LCM of the intervals", "first time all coincide after start"],
        ["Largest square tile for a × b floor", "HCF(a, b) ; tiles = a × b / HCF²", ""],
        ["Rows / equal groups (no leftover)", "HCF of the quantities", "then divide each total by HCF"],
        ["Co-prime numbers", "HCF = 1 ⇒ LCM = product", ""],
        ["Ratio form", "numbers a·x : b·x (a, b co-prime) ⇒ HCF = x, LCM = a·b·x", "e.g. 3x, 4x → LCM 12x"]
      ],
      tricks: [
        "Given ratio of two numbers and their LCM or HCF: numbers = ax, bx; LCM = abx, so x = LCM/(ab).",
        "Two numbers with HCF h: sum or difference is also a multiple of h.",
        "Meeting-time-on-circular-track problems: time = LCM of the individual lap times.",
        "Number leaving same remainder r with several divisors: LCM·k + r; to find the nth such number use LCM·(n−1) + smallest.",
        "Find HCF quickly by the division method: HCF(a, b) = HCF(b, a mod b)."
      ],
      traps: [
        "HCF × LCM = product holds for two numbers only, not for three.",
        "HCF of fractions has LCM of the DENOMINATORS in the denominator (and vice versa for LCM).",
        "Check if the question wants the LEAST number leaving remainder r or the least number that IS divisible (add r only for the first).",
        "For 'greatest number' use HCF, for 'least number' use LCM."
      ] },

    { topic: "simplification", title: "Simplification & approximation",
      items: [
        ["BODMAS order", "Brackets → Orders (powers/roots) → Division/Multiplication (left to right) → Addition/Subtraction (left to right)", "D and M have equal rank"],
        ["(a + b)²", "a² + 2ab + b²", ""],
        ["(a − b)²", "a² − 2ab + b²", ""],
        ["a² − b²", "(a + b)(a − b)", ""],
        ["(a + b)³", "a³ + 3a²b + 3ab² + b³", ""],
        ["Laws of indices", "aᵐ·aⁿ = aᵐ⁺ⁿ ; aᵐ/aⁿ = aᵐ⁻ⁿ ; (aᵐ)ⁿ = aᵐⁿ ; a⁰ = 1 ; a⁻ⁿ = 1/aⁿ", ""],
        ["Fractional index", "a^(m/n) = ⁿ√(aᵐ)", ""],
        ["Surd laws", "√a·√b = √(ab) ; √a/√b = √(a/b) ; (√a)² = a", ""],
        ["Rationalise", "1/(√a + √b) = (√a − √b)/(a − b)", "multiply by conjugate"],
        ["Square of a sum of roots", "(√a + √b)² = a + b + 2√(ab)", "to denest: write as (√x + √y)²"],
        ["Recurring decimal", "0.(ab) = ab/99 ; 0.a(bc) = (abc − a)/990", "9s for repeating digits, then 0s for non-repeating digits"],
        ["Sum of an infinite GP (in decimals)", "a/(1 − r)", "0.333… = 0.3/(1−0.1) = 1/3"],
        ["Square root by factorisation", "pair equal prime factors", "√(2²·3²·5²) = 30"],
        ["Cube root by factorisation", "triple equal prime factors", ""],
        ["Percent ↔ fraction (bank basics)", "12.5% = 1/8 ; 16.67% = 1/6 ; 37.5% = 3/8 ; 62.5% = 5/8 ; 83.33% = 5/6", "see memory tables"]
      ],
      tricks: [
        "(a + b)² − (a − b)² = 4ab and (a + b)² + (a − b)² = 2(a² + b²).",
        "Squares near 50 or 100: for 100 + x: 100² + 200x + x²; (50 + x)² = 2500 + 100x + x²; (50 − x)² = 2500 − 100x + x².",
        "Squaring a number ending in 5: n5² = n(n+1) followed by 25 (65² = 4225).",
        "Approximation questions: round to a convenient value, do not compute exactly; convert % to fractions.",
        "Multiply by 5 = ×10 ÷ 2; by 25 = ×100 ÷ 4; by 125 = ×1000 ÷ 8; by 99 = ×100 − the number.",
        "Break to near multiples: 98 × 47 = (100 − 2) × 47; 103² = 10609."
      ],
      traps: [
        "Multiplication and division have equal priority: 12 ÷ 3 × 2 = 8, not 2.",
        "(−2)² = 4 but −2² = −4.",
        "√(a² + b²) is NOT a + b; √(a + b) is not √a + √b.",
        "Recurring decimal 0.(1) = 1/9 but 0.0(1) = 1/90 (a non-repeating digit adds a zero in the denominator)."
      ] },

    { topic: "percentages", title: "Percentages",
      items: [
        ["Percentage", "(part ÷ whole) × 100", ""],
        ["% change", "(new − old) ÷ old × 100", "always on the OLD value"],
        ["x% of y", "x% of y = y% of x", "swap to the easier one"],
        ["A is x% more than B ⇒ B is ?% less than A", "100x/(100 + x) %", "base changes"],
        ["A is x% less than B ⇒ B is ?% more than A", "100x/(100 − x) %", ""],
        ["Successive change a%, b%", "a + b + ab/100 %", "use signs: + increase, − decrease"],
        ["Price up r% ⇒ cut consumption to keep spend", "100r/(100 + r) %", "price × consumption = constant"],
        ["Price down r% ⇒ consumption can rise by", "100r/(100 − r) %", ""],
        ["Population after n years", "P (1 + r/100)ⁿ", "decay: (1 − r/100)ⁿ"],
        ["Original from final", "final × 100/(100 ± change %)", ""],
        ["Net change after +x% then −x%", "−x²/100 %", "always a loss"],
        ["Area/volume from side change by x%", "area: 2x + x²/100 % ; volume: 3x + 3x²/100 + x³/10⁴ %", "same logic with successive changes"],
        ["Votes", "winner − loser = margin ; valid = total − invalid", "lead = (2p − 100)% of valid, p = winner %"],
        ["Pass marks", "pass % × total = marks scored + shortfall", "or marks scored − surplus"],
        ["Income-expenditure", "savings = income − expenditure ; expenditure % = 100 − savings %", ""],
        ["Population (two-year constant growth)", "P × (1 + r/100)²", "reverse for past year: P ÷ (1 + r/100)ⁿ"]
      ],
      tricks: [
        "Successive % table: +20% then +10% = 20 + 10 + 200/100 = +32%; +r% then −r% = −r²/100%.",
        "Remember: 1/8 = 12.5%, 1/6 = 16.67%, 1/7 ≈ 14.28%, 1/9 = 11.11%, 1/11 = 9.09%, 3/8 = 37.5%.",
        "If A is x% more than B, then ratio A:B = (100 + x):100; use ratios to answer 'what % is …'.",
        "Quick percentage: 10% = shift decimal; 5% = half of 10%; 15% = 10% + 5%; 1% = shift two places.",
        "Rise in one side = x% ⇒ rise in area (square) = 2x + x²/100.",
        "Option elimination: with answers close to each other, compute using approximate fractions."
      ],
      traps: [
        "Percentage change is on the OLD (original) value, not the new.",
        "Increase of x% then decrease of x% does NOT return to the original value.",
        "A is 25% more than B does not mean B is 25% less than A (it is 20% less).",
        "Percentage points and percent are different (from 20% to 25% is +5 points, +25%)."
      ] },

    { topic: "profit-loss", title: "Profit, loss & discount",
      items: [
        ["Profit / Loss", "SP − CP / CP − SP", ""],
        ["Profit %", "(profit ÷ CP) × 100", "ALWAYS on CP"],
        ["Loss %", "(loss ÷ CP) × 100", ""],
        ["SP from CP", "CP × (100 + P%)/100 ; with loss CP × (100 − L%)/100", ""],
        ["CP from SP", "SP × 100/(100 + P%) ; SP × 100/(100 − L%)", ""],
        ["Discount", "MP − SP", "on marked price"],
        ["Discount %", "(discount ÷ MP) × 100", ""],
        ["SP with discount", "MP × (100 − D%)/100", ""],
        ["MP from CP", "MP = CP × (100 + P%)/(100 − D%)", "profit P% after D% discount"],
        ["Successive discounts d₁, d₂", "d₁ + d₂ − d₁d₂/100 %", "single equivalent discount"],
        ["Same SP, profit x% and loss x%", "net loss % = x²/100", "no profit, no loss gain"],
        ["Two items, SP equal, gain a% on one, loss a% on other", "loss = a²/100 % of total CP", ""],
        ["False weight", "gain % = (error ÷ (true weight − error)) × 100", "error = true weight − false weight"],
        ["Dishonest dealer (both false weight and cost)", "gain % = [(100 + g)/(100 − e)·100] − 100", "g = markup %, e = weight shortfall %"],
        ["Buy x get y free (equal items)", "discount % = y/(x + y) × 100", ""],
        ["CP of n items = SP of m items", "profit % = (n − m)/m × 100", "n > m means profit"],
        ["Marked price above CP", "mark up m%, discount d% ⇒ net % = m − d − md/100", ""]
      ],
      tricks: [
        "Profit of 20% on SP is not 20% on CP: if profit on SP is s%, CP = SP(1 − s/100); profit on CP = 100s/(100 − s).",
        "Set CP = 100 (or LCM-style 1000) and compute SP directly to avoid fractions.",
        "Equal SP for two items, one at +x% one at −x%: always a loss of x²/100 %.",
        "Net discount for 20% + 10% = 20 + 10 − 2 = 28% (not 30%)."
      ],
      traps: [
        "Profit % is on CP, discount % is on MP.",
        "Successive discounts are not added: 20% + 10% = 28%, not 30%.",
        "Wrong SP: 'sold at 15% loss' means SP = 85% of CP, not 115%.",
        "In false-weight problems the gain is on the weight actually given, not on the stated weight."
      ] },

    { topic: "interest", title: "Simple & compound interest",
      items: [
        ["Simple interest", "SI = P × R × T / 100", "T in years"],
        ["Amount (SI)", "A = P + SI = P(1 + RT/100)", ""],
        ["Compound amount", "A = P (1 + R/100)ⁿ", "annual compounding"],
        ["Compound interest", "CI = A − P = P[(1 + R/100)ⁿ − 1]", ""],
        ["Half-yearly compounding", "A = P (1 + R/200)²ⁿ", "rate halves, periods double"],
        ["Quarterly compounding", "A = P (1 + R/400)⁴ⁿ", ""],
        ["Mixed time with fraction (n + a/b yrs)", "A = P (1 + R/100)ⁿ (1 + (a/b)·R/100)", ""],
        ["CI − SI for 2 years", "P (R/100)²", ""],
        ["CI − SI for 3 years", "P (R/100)² (3 + R/100)", ""],
        ["Rate when money doubles (SI)", "R = 100/T %", "triples: 200/T ; n-fold: 100(n − 1)/T"],
        ["Time to double (SI)", "T = 100/R yrs", ""],
        ["Rule of 72", "years to double ≈ 72/R", "approximation for compound"],
        ["Equal annual instalments (SI)", "x = 100·A / (100n + R·n(n−1)/2)", "A = total due at the end of n years"],
        ["Equal instalments (CI, 2 yrs)", "x = A / [1/(1 + r) + 1/(1 + r)²]", "A = loan now, r = R/100"],
        ["Different rates r₁, r₂, r₃", "A = P (1 + r₁/100)(1 + r₂/100)(1 + r₃/100)", "year-wise rates"],
        ["Lending–borrowing gain", "P × (R₂ − R₁) × T / 100", ""],
        ["Effective annual rate (halved)", "(1 + R/200)² − 1", ""]
      ],
      tricks: [
        "CI for 2 yrs on rate R%: effective rate = 2R + R²/100 (same as successive percentage).",
        "CI − SI for 2 years = P(R/100)²; for 3 years = P(R/100)²(3 + R/100).",
        "At 10% CI: amount multiplies 1.1, 1.21, 1.331, 1.4641 for 1, 2, 3, 4 years; at 20%: 1.2, 1.44, 1.728.",
        "Money is n times in T years at SI ⇒ in T' years it is (1 + (n−1)T'/T) times.",
        "When asked for the sum from the difference CI − SI, use P = diff × (100/R)².",
        "Quick estimate: 8% CI doubles in 9 years (72 ÷ 8)."
      ],
      traps: [
        "CI formula gives the AMOUNT; subtract P to get interest.",
        "For half-yearly or quarterly compounding, halve/quarter the rate AND double/quadruple the periods.",
        "SI: time must be in years (months ÷ 12, days ÷ 365).",
        "'Interest earned' and 'amount' are different — read what is asked."
      ] },

    { topic: "ratio", title: "Ratio, proportion & variation",
      items: [
        ["Ratio", "a : b = a/b", "same units"],
        ["Proportion", "a : b = c : d ⇒ ad = bc", "extremes = means"],
        ["Mean proportion of a, b", "√(ab)", "a : x = x : b"],
        ["Third proportional to a, b", "b²/a", "a : b = b : x"],
        ["Fourth proportional", "bc/a", "a : b = c : x"],
        ["Duplicate / triplicate ratio", "a² : b² ; a³ : b³", ""],
        ["Compounded ratio", "(a : b) × (c : d) = ac : bd", ""],
        ["Componendo", "a/b = c/d ⇒ (a + b)/b = (c + d)/d", ""],
        ["Dividendo", "a/b = c/d ⇒ (a − b)/b = (c − d)/d", ""],
        ["Componendo–dividendo", "a/b = c/d ⇒ (a + b)/(a − b) = (c + d)/(c − d)", ""],
        ["Ratio of a, b, c from a:b and b:c", "make b equal (LCM method)", "e.g. 2:3 and 4:5 → 8:12:15"],
        ["Dividing N in ratio a : b : c", "shares = N·a/(a+b+c), …", ""],
        ["Direct variation", "x ∝ y ⇒ x/y = constant", ""],
        ["Inverse variation", "x ∝ 1/y ⇒ xy = constant", ""],
        ["Joint variation", "x ∝ yz ⇒ x/(yz) = constant", ""],
        ["Ratio after adding k to each", "(a + k) : (b + k)", "use algebra with a = ax', b = bx'"],
        ["Mixed units", "convert to same unit first", "paise → ₹ ; mins → hrs"]
      ],
      tricks: [
        "Ratio changes: a:b = 3:5; add 10 to both to get 5:7 → solve 3x+10 / 5x+10 = 5/7.",
        "Always write the ratio as multiples (3x, 5x) and use the given total to find x.",
        "Sum of a:b:c given and ratio: share of a = a/(a+b+c) × total.",
        "Ratio of squares for areas, cubes for volumes: sides in ratio a:b ⇒ areas a²:b², volumes a³:b³.",
        "Join ratios by making the common term equal using LCM.",
        "Coins/currency: ratio of numbers × face value = ratio of amounts."
      ],
      traps: [
        "Ratio of AMOUNTS is not ratio of NUMBER of coins; divide by the denomination.",
        "Compare in the same units and the same order (a:b vs b:a).",
        "Adding the same number to both terms does not keep the ratio.",
        "Inverse variation: if x doubles, y halves; do not multiply."
      ] },

    { topic: "partnership", title: "Partnership",
      items: [
        ["Profit share", "profit ∝ (investment × time)", ""],
        ["Equal time", "profit ratio = investment ratio", ""],
        ["Equal investment", "profit ratio = time ratio", ""],
        ["Capital-months", "capital × number of months", "use for different periods"],
        ["Working partner's salary", "salary first, remaining profit shared by capital ratio", ""],
        ["Commission", "deduct commission from profit, divide the rest", ""],
        ["Two investments, one withdrawn", "A: P × t₁ + (P − w)(12 − t₁)", "capital×time per partner"],
        ["Partner's share", "(own capital·time / total capital·time) × total profit", ""],
        ["Investment from profit share", "capital = profit share ÷ profit × total capital·time", ""],
        ["Sleeping partner", "invests money but does not work; gets only profit share", "active partner gets salary/commission on top"],
        ["Total investment time", "if A invests for 12 months, B joins after k months ⇒ B's time = 12 − k", ""]
      ],
      tricks: [
        "Always convert each partner's investment to capital × months, then use ratio.",
        "If A invests x for 12 months, B invests y for 8 months: ratio = 12x : 8y = 3x : 2y.",
        "Joining after k months with doubled capital: ratio = 1 × 12 : 2 × (12 − k).",
        "Quick check: profit shares always add to total profit.",
        "For three partners where A = 2×B and B = 3×C: ratio of capital = 6 : 3 : 1."
      ],
      traps: [
        "Use TIME also, not only capital, when periods differ.",
        "Deduct manager's commission/working partner's salary BEFORE sharing the rest.",
        "Loss is also shared in the investment-time ratio.",
        "Months, not years, must be consistent across partners."
      ] },

    { topic: "mixtures", title: "Mixtures & alligation",
      items: [
        ["Alligation rule", "cheaper qty : dearer qty = (d − m) : (m − c)", "c cheaper, d dearer, m mean price"],
        ["Mean price", "m = (c₁q₁ + c₂q₂)/(q₁ + q₂)", "weighted average"],
        ["Cross method", "(dearer − mean) : (mean − cheaper)", "gives cheaper : dearer"],
        ["Replacement (one liquid)", "final / initial = (1 − x/V)ⁿ", "remove x from V, n times"],
        ["Quantity left after n operations", "V (1 − x/V)ⁿ", "V = container volume, x = replaced amount"],
        ["Concentration after mixing", "(c₁V₁ + c₂V₂)/(V₁ + V₂)", ""],
        ["Mixing same concentration with water", "milk % × qty stays constant", "C₁V₁ = C₂V₂"],
        ["Gain by dishonest mixing", "gain % = water/milk × 100", "when sold at cost price"],
        ["Speed alligation", "average speed = total distance / total time", "not a plain average of speeds"],
      ],
      tricks: [
        "Cross method: draw dearer and cheaper prices on top, mean in the middle, subtract diagonally → ratio.",
        "Replacement problem: milk left = initial × (1 − replaced/total)ⁿ.",
        "To dilute a 100% pure liquid to p% pure: pure : water = p : (100 − p).",
        "Mix two solutions of 10% and 30% to get 25%: ratio = (30−25):(25−10) = 5:15 = 1:3.",
        "Profit on a mixture with mean cost: apply alligation on cost price, then selling price separately.",
        "Weighted average = alligation: they are the same method."
      ],
      traps: [
        "Alligation ratio gives quantities, with each quantity paired to the OPPOSITE price (cheaper paired with dearer − mean).",
        "The ratio from alligation is of quantities, not prices.",
        "In replacement problems the fraction removed is of the CURRENT mixture each time.",
        "Averaging speeds directly is wrong; use total distance ÷ total time."
      ] },

    { topic: "averages", title: "Averages",
      items: [
        ["Average", "sum of observations / number of observations", ""],
        ["Sum", "average × number", ""],
        ["Average of first n natural numbers", "(n + 1)/2", ""],
        ["Average of first n even / odd numbers", "n + 1 ; n", ""],
        ["Average of AP", "(first + last)/2", "also the middle term"],
        ["Average of consecutive integers", "middle number (odd count)", ""],
        ["Combined average", "(n₁a₁ + n₂a₂)/(n₁ + n₂)", ""],
        ["New member joins", "new member = old avg + (n + 1) × increase", "decrease: old avg − (n+1) × decrease"],
        ["Member replaced", "new − old = n × change in average", ""],
        ["Average speed (equal distances)", "2xy/(x + y)", "harmonic mean"],
        ["Average speed (equal times)", "(x + y)/2", ""],
        ["Average speed (generally)", "total distance / total time", ""],
        ["Average age after a person leaves / joins", "(total ± age)/(n ± 1)", ""],
        ["Weighted average", "Σ(w·x)/Σw", ""],
        ["Average of squares of first n", "(n+1)(2n+1)/6", ""]
      ],
      tricks: [
        "Average of n numbers increases by a when a new number joins: new number = old avg + a(n + 1).",
        "Deviation method: choose an assumed mean, average the deviations, add back.",
        "When all values increase by k, average increases by k; when multiplied by k, average multiplies by k.",
        "Average of two groups lies between their averages, closer to the larger group (use alligation).",
        "Replacing one member changes the sum by n × (change in average).",
        "Average of n consecutive numbers = middle value; for even count = mean of the two middle values."
      ],
      traps: [
        "Average speed for equal distances is the harmonic mean, not (x + y)/2.",
        "When a member leaves, the count becomes n − 1.",
        "When average of the new group (n+1 persons) is used, divide by n + 1, not n.",
        "Overlapping groups (e.g. first 5 and last 5 of 9): the common member is counted twice."
      ] },

    { topic: "ages", title: "Problems on ages",
      items: [
        ["Set variables", "present ages as ax, bx for ratio a : b", ""],
        ["Age n years ago / hence", "(age − n) / (age + n)", ""],
        ["Ratio after t years", "(ax + t)/(bx + t) = c/d", "cross-multiply"],
        ["Difference of ages", "constant over time", ""],
        ["Sum of ages after t years", "present sum + (number of people × t)", ""],
        ["Average age of family", "(total ages)/(members)", "after t years add t to average"],
        ["Father–son ratio", "n years ago/hence both change by n", ""],
        ["Age of child born after", "present age − gap", ""],
        ["Multiple relation", "A = k × B ⇒ after t years (A + t) = m(B + t)", "solve linear"],
        ["Twins / same year", "equal ages always", ""],
        ["Sum in future", "sum now + n × t", ""],
        ["Average increases when replaced", "new member = old member + n × change", "family problem"]
      ],
      tricks: [
        "Difference between two ages never changes; build equations with the difference.",
        "Present = x, after t years x + t; t years ago x − t. Write the unknowns on the present.",
        "For ratio problems, assume ages as multiples (5x, 3x) and find x from one extra fact.",
        "After t years total of n persons rises by nt; average rises by t.",
        "Test options: plug answer options into the statement (ages are small whole numbers)."
      ],
      traps: [
        "'Years ago' vs 'years hence': sign matters; confirm ages are positive.",
        "Ratio of ages changes when the same number is added, but the DIFFERENCE does not.",
        "When someone leaves/dies, the divisor changes but the remaining ages do not shift.",
        "Do not mix age at marriage / birth of child with present ages."
      ] },

    { topic: "time-work", title: "Time & work",
      items: [
        ["Work rate", "work ÷ time", "1 job in n days ⇒ 1/n per day"],
        ["Together", "1/T = 1/a + 1/b + 1/c", "work per day adds"],
        ["Two workers", "T = ab/(a + b)", ""],
        ["A does in a days, B is x times as efficient", "B takes a/x days", ""],
        ["Efficiency", "efficiency ∝ 1/time", ""],
        ["Man-days", "M₁D₁H₁/W₁ = M₂D₂H₂/W₂", "H = hours per day"],
        ["Unit method", "total work = LCM of days", "then rate = work/days"],
        ["Leaving midway", "work done by team first, rest by remaining", ""],
        ["Wages", "wage ∝ work done = rate × time", ""],
        ["Alternate days", "work in a cycle = a₁ + a₂; repeat the cycle", ""],
        ["A and B together do work in t₁; A alone in t₂", "B alone = t₁t₂/(t₂ − t₁)", ""],
        ["M men and W women", "M × (man's rate) + W × (woman's rate)", "convert women to men by efficiency"],
        ["Time to finish remaining", "remaining work ÷ rate", ""],
        ["Mix of full and partial", "work done = Σ(rate × days)", ""]
      ],
      tricks: [
        "Take total work as LCM of the given days (e.g. 12, 15 → 60 units): rate_A = 5, rate_B = 4.",
        "Efficiency ratio is inverse of time ratio: A:B time = 2:3 ⇒ efficiency 3:2.",
        "If A and B take a and b days, A+B in ab/(a + b); with c: use LCM units.",
        "Alternate-day work: add the two day-rates, find completed cycles, then handle the remainder day carefully.",
        "M₁D₁/W₁ = M₂D₂/W₂ — when hours also change include H.",
        "A leaves k days before completion: A works (T − k) days; use T from total work equation."
      ],
      traps: [
        "Add RATES (1/a), not times; the answer is a time (reciprocal of the sum).",
        "Pay shares in proportion to work done (rate × days), not just days.",
        "Alternate-day work: the last day may be completed early; check where the work finishes.",
        "'More men, less days' is inverse variation; 'more work, more days' is direct."
      ] },

    { topic: "pipes", title: "Pipes & cisterns",
      items: [
        ["Inlet rate", "capacity ÷ time to fill alone", "positive"],
        ["Outlet rate", "capacity ÷ time to empty alone", "negative"],
        ["Both open (fill)", "1/T = 1/a − 1/b", "b > a, else never fills"],
        ["Both inlets", "1/T = 1/a + 1/b", ""],
        ["Leak", "if pipe fills in a and leak causes b ⇒ leak empties in ab/(b − a)", "with leak the tank fills in b"],
        ["Time with leak", "fill time = capacity ÷ (inlet − leak)", ""],
        ["Part filled in t min", "t(1/a − 1/b)", ""],
        ["Alternate opening", "per-cycle work = 1/a − 1/b (or +)", "same as time & work"],
        ["Tank filled by A, B and emptied by C", "1/a + 1/b − 1/c", ""],
        ["Pipe closed after t min", "remaining time = (1 − t·rate)/new rate", ""],
        ["Net rate", "sum of signed rates", "inlet +, outlet −"]
      ],
      tricks: [
        "Use LCM of times as capacity: A fills in 12, B empties in 20 → capacity 60, rates +5, −3, net 2/min.",
        "Leak problem: A fills in 6 h, with leak 8 h ⇒ leak empties in 6 × 8/(8 − 6) = 24 h.",
        "Pipes opened alternately: compute work per pair of minutes and handle the remainder.",
        "Two pipes fill in a and b; a third empties in c: use LCM and signed rates.",
        "If asked for the pipe that is faster, compare rates (inverse of times)."
      ],
      traps: [
        "Outlet/leak rates are negative; do not add them to inlets.",
        "Net rate must be positive for the tank to fill at all.",
        "Pipes opened one after another (alternate) are not the same as opened together.",
        "Careful with units: capacity in litres vs time in minutes/hours."
      ] },

    { topic: "tsd", title: "Time, speed & distance",
      items: [
        ["Basic", "speed = distance ÷ time", "D = S × T"],
        ["km/h → m/s", "× 5/18", "m/s → km/h: × 18/5"],
        ["Average speed (equal distances)", "2xy/(x + y)", ""],
        ["Average speed (generally)", "total distance / total time", ""],
        ["Ratio of speeds ↔ time", "same distance: speed ∝ 1/time", ""],
        ["Relative speed (opposite)", "S₁ + S₂", "towards each other"],
        ["Relative speed (same direction)", "|S₁ − S₂|", ""],
        ["Train crossing a pole / man", "length ÷ speed", ""],
        ["Train crossing platform / bridge", "(train + platform length) ÷ speed", ""],
        ["Two trains crossing each other", "(L₁ + L₂)/(S₁ ± S₂)", "+ opposite, − same direction"],
        ["Boat downstream / upstream", "b + c ; b − c", "b = boat speed, c = current"],
        ["Boat speed", "(down + up)/2", ""],
        ["Current speed", "(down − up)/2", ""],
        ["Average of the same distance there and back (boats)", "(b² − c²)/b", ""],
        ["Meeting from two ends (towards)", "d/(S₁ + S₂)", ""],
        ["Late/early (same distance)", "d = S₁S₂ × Δt/(S₂ − S₁)", "Δt = time difference"],
        ["Circular track meeting", "same direction: L/(S₁ − S₂) ; opposite: L/(S₁ + S₂)", ""],
        ["Race: A beats B by x m", "B covers (L − x) when A covers L", "ratio of speeds = L : (L − x)"]
      ],
      tricks: [
        "Speed ratio of a and b for same distance: time ratio inverted.",
        "If speed is multiplied by a/b, time is multiplied by b/a.",
        "Equal distances at two speeds s₁ and s₂: average speed = 2s₁s₂/(s₁ + s₂).",
        "Use km/h → m/s: 36 km/h = 10 m/s, 54 = 15, 72 = 20, 90 = 25.",
        "Boat problem: upstream time and downstream time for the same distance: ratio gives (b+c):(b−c).",
        "Trains crossing a stationary object use own length; moving object uses relative speed and both lengths."
      ],
      traps: [
        "Average speed is NOT the average of the two speeds for equal distances.",
        "Train crossing a platform needs train length + platform length.",
        "Convert units: km/h vs m/s, minutes vs hours, before applying the formula.",
        "Same direction → subtract speeds; opposite → add."
      ] },

    { topic: "pnc", title: "Permutations & combinations",
      items: [
        ["Factorial", "n! = n(n − 1)…1", "0! = 1"],
        ["Permutations", "ⁿPᵣ = n!/(n − r)!", "order matters"],
        ["Combinations", "ⁿCᵣ = n!/[r!(n − r)!]", "order does not matter"],
        ["Symmetry", "ⁿCᵣ = ⁿCₙ₋ᵣ", ""],
        ["Pascal", "ⁿCᵣ + ⁿCᵣ₊₁ = ⁿ⁺¹Cᵣ₊₁", ""],
        ["Repetition allowed", "nʳ", "r positions, n choices each"],
        ["Arrangements with identical items", "n!/(p! q! r!)", "p, q, r identical"],
        ["Circular arrangement", "(n − 1)!", "for 'necklace/garland' (n − 1)!/2"],
        ["Together", "(n − k + 1)! × k!", "k items glued as one block"],
        ["Never together", "total − together", ""],
        ["Selecting any number of n items", "2ⁿ − 1", "at least one"],
        ["Distinct objects to groups", "n!/[(r!)ᵏ k!] equal groups of r", ""],
        ["Derangements Dₙ", "n! (1 − 1/1! + 1/2! − … + (−1)ⁿ/n!)", "D₃ = 2, D₄ = 9, D₅ = 44"],
        ["Number of diagonals of n-gon", "n(n − 3)/2", ""],
        ["Number of triangles from n points (no 3 collinear)", "ⁿC₃", ""],
        ["Number of handshakes / matches", "ⁿC₂", ""],
        ["Distributing n identical items among r people", "ⁿ⁺ʳ⁻¹Cᵣ₋₁", "each can get 0 or more"],
        ["Rank of a word", "count lexicographically smaller words", "fix letters one by one"]
      ],
      tricks: [
        "Word arrangements: divide by the factorial of each repeated letter (e.g. MISSISSIPPI = 11!/(4!4!2!)).",
        "'At least one': total − none. 'Together': treat as a single block, then multiply by internal order.",
        "Circular with a fixed seat for one person: (n − 1)!; if clockwise/anticlockwise are the same: (n − 1)!/2.",
        "Always decide first: does ORDER matter? Yes → P, no → C.",
        "Handshakes among n people = nC₂; diagonals = nC₂ − n.",
        "Number of ways to select with restrictions: handle the restricted places first."
      ],
      traps: [
        "Do not confuse P and C; selecting a team is C, arranging in a row is P.",
        "Repeated letters/digits: divide by the factorials, otherwise overcount.",
        "Numbers formed with digits: the first digit cannot be 0.",
        "'Never together' = total − together, not together × something."
      ] },

    { topic: "probability", title: "Probability",
      items: [
        ["Probability", "P(E) = favourable / total outcomes", "0 ≤ P ≤ 1"],
        ["Complement", "P(not E) = 1 − P(E)", ""],
        ["Addition rule", "P(A or B) = P(A) + P(B) − P(A and B)", "mutually exclusive: last term 0"],
        ["Independent events", "P(A and B) = P(A) × P(B)", ""],
        ["Conditional", "P(A | B) = P(A and B)/P(B)", ""],
        ["Odds in favour", "m : n ⇒ P = m/(m + n)", ""],
        ["Two dice sum", "total 36 outcomes; sum 7 has 6 ways", "sums 2 and 12: 1 way each"],
        ["Coins", "n coins have 2ⁿ outcomes", "exactly k heads: ⁿCₖ/2ⁿ"],
        ["Cards", "52 cards; 4 suits × 13; 12 face cards; 4 aces", "26 red, 26 black"],
        ["Balls drawn without replacement", "ᵃC_x × ᵇC_y / ⁿC_r", "n = a + b"],
        ["At least one", "1 − P(none)", ""],
        ["Birthday-type (all different)", "ⁿPᵣ/nʳ", ""],
        ["Bayes' theorem", "P(A | B) = P(B | A) P(A)/P(B)", ""],
        ["Expected value", "Σ x·P(x)", ""],
        ["Repeated trials (binomial)", "ⁿCₖ pᵏ (1 − p)ⁿ⁻ᵏ", "k successes"]
      ],
      tricks: [
        "For 'at least one' always do 1 − P(none).",
        "Two dice: P(sum = 7) = 1/6, P(sum > 9) = 1/6, P(doublet) = 1/6, P(sum ≤ 4) = 1/6.",
        "Draw without replacement: use combinations; with replacement: multiply probabilities.",
        "Mutually exclusive ⇒ add; independent ⇒ multiply.",
        "Sample space for 3 coins = 8, for 3 dice = 216."
      ],
      traps: [
        "Mutually exclusive ≠ independent.",
        "Without replacement, the denominator changes after each draw.",
        "A deck of cards has 12 face cards (not 16); aces are not face cards.",
        "P(A or B) subtracts the overlap when A and B can occur together."
      ] },

    { topic: "mensuration-2d", title: "Mensuration 2D",
      items: [
        ["Rectangle", "A = l × b ; P = 2(l + b) ; d = √(l² + b²)", ""],
        ["Square", "A = a² ; P = 4a ; d = a√2", "A = d²/2"],
        ["Triangle", "A = ½ × base × height", ""],
        ["Heron's formula", "A = √[s(s − a)(s − b)(s − c)], s = (a + b + c)/2", ""],
        ["Equilateral triangle", "A = (√3/4) a² ; height = (√3/2) a", ""],
        ["Isosceles triangle", "A = (b/4) √(4a² − b²)", "a = equal sides, b = base"],
        ["Right triangle", "A = ½ × leg₁ × leg₂ ; hyp² = leg₁² + leg₂²", ""],
        ["Parallelogram", "A = base × height", ""],
        ["Rhombus", "A = ½ d₁ d₂ ; side = ½ √(d₁² + d₂²)", ""],
        ["Trapezium", "A = ½ (a + b) h", "a, b parallel sides"],
        ["Circle", "A = πr² ; C = 2πr", "π = 22/7 ≈ 3.1416"],
        ["Semicircle", "A = ½πr² ; P = πr + 2r", ""],
        ["Sector", "A = (θ/360) πr² ; arc = (θ/360) 2πr", "θ in degrees"],
        ["Ring (annulus)", "A = π(R² − r²)", ""],
        ["Regular hexagon", "A = (3√3/2) a²", ""],
        ["Cyclic quadrilateral", "A = √[(s−a)(s−b)(s−c)(s−d)]", "Brahmagupta"],
        ["Quadrilateral by diagonal", "A = ½ d (h₁ + h₂)", ""],
        ["Inradius / circumradius of equilateral", "r = a/(2√3) ; R = a/√3", ""],
        ["Rectangular path around a field", "area = outer rectangle − inner rectangle", "width w on all sides: (l + 2w)(b + 2w) − lb"],
        ["Distance moved in n revolutions", "n × 2πr", ""]
      ],
      tricks: [
        "Area of a square from its diagonal d: d²/2.",
        "Pythagorean triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25, 20-21-29 (and their multiples).",
        "Perimeters equal: circle has the largest area; square beats rectangle.",
        "Area changes: side × k ⇒ area × k²; if length +x% and breadth −y% apply successive %.",
        "Path around a rectangle: area of path = (l + 2w)(b + 2w) − lb; inside path: lb − (l − 2w)(b − 2w).",
        "Use π = 22/7 when radius is a multiple of 7, otherwise 3.14."
      ],
      traps: [
        "Triangle area has the ½ factor; people forget it.",
        "Use the perpendicular height, not the slant side.",
        "Diameter vs radius: read the question; also circumference is πd.",
        "Paths: width is added on BOTH sides for outer, subtracted on both sides for inner."
      ] },

    { topic: "mensuration-3d", title: "Mensuration 3D",
      items: [
        ["Cuboid", "V = lbh ; TSA = 2(lb + bh + hl) ; d = √(l² + b² + h²)", "LSA = 2h(l + b)"],
        ["Cube", "V = a³ ; TSA = 6a² ; LSA = 4a² ; d = a√3", ""],
        ["Cylinder", "V = πr²h ; CSA = 2πrh ; TSA = 2πr(r + h)", ""],
        ["Cone", "V = ⅓πr²h ; CSA = πrl ; TSA = πr(r + l) ; l = √(r² + h²)", ""],
        ["Sphere", "V = (4/3)πr³ ; SA = 4πr²", ""],
        ["Hemisphere", "V = (2/3)πr³ ; CSA = 2πr² ; TSA = 3πr²", ""],
        ["Frustum of a cone", "V = (πh/3)(R² + Rr + r²) ; CSA = π(R + r)l", "l = √(h² + (R − r)²)"],
        ["Prism", "V = base area × height", ""],
        ["Pyramid", "V = ⅓ × base area × height", ""],
        ["Spherical shell", "V = (4/3)π(R³ − r³)", ""],
        ["Cone from a sector", "slant l = sector radius ; base circumference = arc length", "r = (θ/360)·l"],
        ["Recasting (melting)", "volume before = volume after", "number of pieces = V big / V small"],
        ["Water flow", "volume = cross-section area × speed × time", ""],
        ["Cube cut into smaller cubes", "n = (a/b)³", "side a into side b"],
        ["Painted cube (side n, cut into unit cubes)", "3 faces: 8 ; 2 faces: 12(n − 2) ; 1 face: 6(n − 2)² ; 0 faces: (n − 2)³", ""],
        ["Wall bricks", "number = wall volume / brick volume", "convert units"]
      ],
      tricks: [
        "Cone : cylinder : hemisphere (same r, h = r) volumes = 1 : 3 : 2.",
        "Radius × k ⇒ surface × k², volume × k³.",
        "Melting a sphere of radius R into n spheres of radius r: n = (R/r)³.",
        "Cylinder with r and h; new radius doubles, same volume ⇒ h becomes h/4.",
        "Hollow cylinder: V = πh(R² − r²).",
        "Water in a conical vessel: height scale h' = h·∛(volume ratio)."
      ],
      traps: [
        "Cone volume has ⅓; cylinder does not.",
        "Slant height ≠ vertical height in a cone: l = √(r² + h²).",
        "Painted-cube formulas apply for n ≥ 2 (for n = 2 there are no 1-face cubes).",
        "Check units: 1 m³ = 1000 litres; cm³ to litres divide by 1000."
      ] },

    { topic: "geometry", title: "Geometry basics",
      items: [
        ["Angles in a triangle", "A + B + C = 180°", "exterior angle = sum of two interior opposite"],
        ["Sum of interior angles of n-gon", "(n − 2) × 180°", ""],
        ["Each interior angle of regular n-gon", "(n − 2) × 180°/n", "exterior = 360°/n"],
        ["Parallel lines + transversal", "alternate angles equal ; co-interior supplementary", "corresponding equal"],
        ["Pythagoras", "a² + b² = c²", "right triangle"],
        ["Similar triangles", "sides in same ratio; areas ∝ (side ratio)²", ""],
        ["Basic proportionality (Thales)", "DE ∥ BC ⇒ AD/DB = AE/EC", ""],
        ["Angle bisector theorem", "AB/AC = BD/DC", "D on BC"],
        ["Median", "divides triangle into 2 equal areas ; centroid divides it 2 : 1", ""],
        ["Incentre / circumcentre", "inradius r = Area/s ; circumradius R = abc/(4·Area)", "right triangle: R = hyp/2"],
        ["Angle in a semicircle", "90°", ""],
        ["Angle at centre", "twice the angle at the circumference", "same arc"],
        ["Cyclic quadrilateral", "opposite angles sum to 180°", ""],
        ["Tangent", "perpendicular to the radius ; two tangents from a point are equal", "length = √(d² − r²)"],
        ["Tangent–secant", "PT² = PA × PB", ""],
        ["Chords intersecting", "PA × PB = PC × PD", ""],
        ["Distance formula", "√[(x₂ − x₁)² + (y₂ − y₁)²]", ""],
        ["Section formula", "((mx₂ + nx₁)/(m + n), (my₂ + ny₁)/(m + n))", "internal m : n"],
        ["Midpoint", "((x₁ + x₂)/2, (y₁ + y₂)/2)", ""],
        ["Slope of a line", "(y₂ − y₁)/(x₂ − x₁)", "parallel: equal ; perpendicular: product −1"],
        ["Area of triangle (coordinates)", "½ |x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)|", ""],
        ["Equation of a line", "y = mx + c ; two-point: (y − y₁) = m (x − x₁)", ""],
        ["Number of diagonals", "n(n − 3)/2", ""],
      ],
      tricks: [
        "In any triangle the sum of any two sides is more than the third and their difference is less.",
        "Exterior angle of a regular polygon = 360°/n; sides = 360°/exterior.",
        "Triples 3-4-5, 5-12-13, 8-15-17, 7-24-25 save square-root work.",
        "In similar triangles the ratio of areas = square of ratio of corresponding sides.",
        "Largest angle is opposite the longest side.",
        "Medians meet at the centroid, 2 : 1 from the vertex; the centroid is also the average of the vertex coordinates."
      ],
      traps: [
        "Similar triangles: AREAS go with squares of sides, not the plain ratio.",
        "Angle at the centre is twice the angle at the circumference on the same arc, not equal.",
        "Alternate angles are equal, co-interior angles are supplementary (sum 180°).",
        "Slope of a vertical line is undefined, not zero."
      ] },

    { topic: "algebra", title: "Algebra",
      items: [
        ["(a + b)²", "a² + 2ab + b²", ""],
        ["(a − b)²", "a² − 2ab + b²", ""],
        ["a² − b²", "(a + b)(a − b)", ""],
        ["a³ + b³", "(a + b)(a² − ab + b²)", ""],
        ["a³ − b³", "(a − b)(a² + ab + b²)", ""],
        ["(a + b)³", "a³ + 3a²b + 3ab² + b³", ""],
        ["(a + b + c)²", "a² + b² + c² + 2(ab + bc + ca)", ""],
        ["a³ + b³ + c³ − 3abc", "(a + b + c)(a² + b² + c² − ab − bc − ca)", "if a + b + c = 0: a³ + b³ + c³ = 3abc"],
        ["Quadratic roots", "x = [−b ± √(b² − 4ac)]/(2a)", "D = b² − 4ac"],
        ["Sum / product of roots", "−b/a ; c/a", ""],
        ["Nature of roots", "D > 0 real distinct ; D = 0 equal ; D < 0 complex", ""],
        ["Linear equations", "a₁x + b₁y = c₁ ; solve by elimination", "unique if a₁/a₂ ≠ b₁/b₂"],
        ["Consistent / inconsistent", "a₁/a₂ = b₁/b₂ = c₁/c₂ infinite ; a₁/a₂ = b₁/b₂ ≠ c₁/c₂ none", ""],
        ["x + 1/x = k", "x² + 1/x² = k² − 2 ; x³ + 1/x³ = k³ − 3k", ""],
        ["x − 1/x = k", "x² + 1/x² = k² + 2", ""],
        ["Remainder theorem", "f(x) ÷ (x − a) ⇒ remainder f(a)", ""],
        ["Factor theorem", "(x − a) is a factor ⇔ f(a) = 0", ""],
        ["Modulus", "|x| = a ⇒ x = ±a ; |x| < a ⇒ −a < x < a", ""],
        ["Inequalities", "multiply by a negative flips the sign", ""],
        ["AM ≥ GM", "(a + b)/2 ≥ √(ab)", "equality when a = b"],
        ["Max/min of ax² + bx + c", "at x = −b/(2a) ; value c − b²/(4a)", ""],
      ],
      tricks: [
        "Use options: substitute choice values into the equation when factorising is slow.",
        "x + 1/x = k ⇒ x² + 1/x² = k² − 2 and x³ + 1/x³ = k³ − 3k.",
        "If a + b + c = 0, then a³ + b³ + c³ = 3abc.",
        "Roots symmetric: sum = −b/a, product = c/a; (α − β)² = (α + β)² − 4αβ.",
        "Quadratic factor by splitting the middle term: find two numbers with product ac and sum b.",
        "Linear equations with pairs: add and subtract the equations to get x + y and x − y."
      ],
      traps: [
        "Multiplying an inequality by a negative number reverses the sign.",
        "Squaring both sides can create extra roots; verify.",
        "|x| = a with a < 0 has no solution.",
        "Dividing by an expression that can be zero loses roots."
      ] },

    { topic: "progressions", title: "Progressions",
      items: [
        ["AP nth term", "aₙ = a + (n − 1)d", ""],
        ["AP sum", "Sₙ = n/2 [2a + (n − 1)d] = n/2 (a + l)", ""],
        ["AP number of terms", "n = (l − a)/d + 1", ""],
        ["AP middle term", "aₖ = (aₖ₋ₘ + aₖ₊ₘ)/2", "three terms: a − d, a, a + d"],
        ["GP nth term", "aₙ = a rⁿ⁻¹", ""],
        ["GP sum (r ≠ 1)", "Sₙ = a(rⁿ − 1)/(r − 1) = a(1 − rⁿ)/(1 − r)", ""],
        ["Infinite GP", "S∞ = a/(1 − r)", "|r| < 1"],
        ["Three terms in GP", "a/r, a, ar", "middle² = product of outer"],
        ["HP", "reciprocals form an AP", "nth term 1/(a + (n − 1)d)"],
        ["Relations AM, GM, HM", "AM = (a + b)/2 ; GM = √(ab) ; HM = 2ab/(a + b)", "GM² = AM × HM"],
        ["Sum of first n naturals", "n(n + 1)/2", ""],
        ["Sum of squares", "n(n + 1)(2n + 1)/6", ""],
        ["Sum of cubes", "[n(n + 1)/2]²", ""],
        ["Sum of first n odd numbers", "n²", ""],
        ["Sum of first n even numbers", "n(n + 1)", ""],
        ["n AMs between a and b", "common difference d = (b − a)/(n + 1)", ""],
        ["n GMs between a and b", "common ratio r = (b/a)^(1/(n + 1))", ""],
        ["nth term from sum", "aₙ = Sₙ − Sₙ₋₁", ""],
        ["Multiples of k up to N", "⌊N/k⌋ terms ; sum = k·m(m + 1)/2, m = ⌊N/k⌋", ""]
      ],
      tricks: [
        "Odd count: take the middle term as a and terms as a ± d, a ± 2d; even count: a ± d/2, a ± 3d/2.",
        "Sum of first n odd numbers = n²; first n even = n(n+1).",
        "In an AP, the sum of terms equidistant from the ends is the same.",
        "Number of terms between multiples: (last − first)/d + 1.",
        "GP with |r| < 1: S∞ = a/(1 − r); 0.777… = 7/10 ÷ (1 − 1/10) = 7/9.",
        "For three numbers in GP choose a/r, a, ar so the product is a³."
      ],
      traps: [
        "Number of terms = (l − a)/d + 1, not (l − a)/d.",
        "S∞ exists only when |r| < 1.",
        "AP and GP formulas for the nth term are not interchangeable.",
        "HP: take reciprocals to make an AP first."
      ] },

    { topic: "logarithms", title: "Logarithms",
      items: [
        ["Definition", "logₐ N = x ⇔ aˣ = N", "a > 0, a ≠ 1, N > 0"],
        ["Product rule", "log(MN) = log M + log N", ""],
        ["Quotient rule", "log(M/N) = log M − log N", ""],
        ["Power rule", "log Mᵖ = p log M", ""],
        ["Change of base", "logₐ b = log b/log a = 1/(log_b a)", ""],
        ["Special values", "logₐ 1 = 0 ; logₐ a = 1", ""],
        ["Inverse", "a^(logₐ N) = N", ""],
        ["logₐ b × log_b c", "= logₐ c", "chain rule"],
        ["Power of the base", "log base aⁿ of b = (1/n) logₐ b", ""],
        ["log₁₀ 2", "≈ 0.3010", "log₁₀ 3 ≈ 0.4771 ; log₁₀ 5 ≈ 0.6990 ; log₁₀ 7 ≈ 0.8451"],
        ["Characteristic", "number of digits before decimal − 1", "digits in N = ⌊log₁₀N⌋ + 1"],
        ["Natural log", "ln e = 1, e ≈ 2.718", ""],
        ["Exponential equation", "aˣ = b ⇒ x = log b/log a", ""],
        ["log(a + b)", "no simple expansion", ""]
      ],
      tricks: [
        "Digits in 2ⁿ: ⌊n × 0.3010⌋ + 1.",
        "logₐ b × log_b a = 1; logₐ b × log_b c × log_c a = 1.",
        "If logₐ x = p and logₐ y = q, then logₐ(x²y) = 2p + q.",
        "log₁₀ 5 = 1 − log₁₀ 2 (since 5 = 10/2).",
        "Convert to a common base to solve equations like 4ˣ = 8^(x−1)."
      ],
      traps: [
        "log(a + b) ≠ log a + log b; log(a − b) ≠ log a − log b.",
        "Domain: the argument must be positive and the base positive ≠ 1.",
        "log (a^b) = b log a, not (log a)^b.",
        "Characteristic of a number < 1 is negative (e.g. log 0.05 = −1.30 = 2̄.70)."
      ] },

    { topic: "number-series", title: "Number series",
      items: [
        ["Common difference (AP)", "tₙ − tₙ₋₁ = constant", ""],
        ["Common ratio (GP)", "tₙ/tₙ₋₁ = constant", ""],
        ["Second-order difference", "differences form an AP", "e.g. 2, 5, 10, 17: +3, +5, +7"],
        ["Squares", "1, 4, 9, 16, 25, 36, 49, 64, 81, 100", "n²; ±1 and ±n patterns"],
        ["Cubes", "1, 8, 27, 64, 125, 216, 343", "n³ ± n or n³ ± 1"],
        ["Primes", "2, 3, 5, 7, 11, 13, 17, 19, 23, 29", ""],
        ["Fibonacci-type", "tₙ = tₙ₋₁ + tₙ₋₂", "variants: ± something"],
        ["Alternating series", "two interleaved series", "check odd and even terms separately"],
        ["× n + k pattern", "tₙ₊₁ = tₙ × a + b, a changing by 1", ""],
        ["n² − 1 / n² + 1 / n³ ± n", "check against squares/cubes first", ""],
        ["Triangular numbers", "n(n + 1)/2: 1, 3, 6, 10, 15, 21", ""],
        ["Wrong number out", "check differences/ratios; the term that breaks the pattern", ""]
      ],
      tricks: [
        "Always look at differences, then ratios, then squares/cubes, then alternating pattern.",
        "If differences are increasing slowly (1, 2, 3, 4…), check second differences; if the series grows fast, check ratios or cubes.",
        "Pairs: 2, 6, 12, 20, 30 → n(n+1); 3, 8, 15, 24 → n² − 1.",
        "Alternate two-term series: separate odd and even positions.",
        "For missing-number series, try ×a ± b with a changing."
      ],
      traps: [
        "Do not stop at the first pattern that fits two terms; test every term.",
        "'Wrong number' means find the one violating the pattern, not the last term.",
        "Mixed operations: the pattern may alternate between +, ×.",
        "Prime-based series skip composite numbers: 2, 3, 5, 7, 11, 13."
      ] },

    { topic: "clocks", title: "Clocks",
      items: [
        ["Minute hand speed", "6° per minute", "360° in 60 min"],
        ["Hour hand speed", "0.5° per minute", "30° per hour"],
        ["Relative speed", "5.5° per minute", ""],
        ["Angle at H hours M minutes", "|30H − 5.5M|", "if > 180° take 360° − angle"],
        ["Hands together", "11 times in 12 hours (22 in a day)", ""],
        ["Hands opposite (180°)", "11 times in 12 hours", ""],
        ["Right angle (90°)", "22 times in 12 hours (44 in a day)", ""],
        ["Hands overlap after H o'clock", "M = 60H/11 minutes past H", "θ = 0°"],
        ["Hands at angle θ after H o'clock", "M = (60H ± 2θ)/11 minutes past H", "two solutions: + and −"],
        ["Hands opposite after H o'clock", "M = (60H ± 360)/11 minutes past H", "θ = 180°"],
        ["Time gained/lost", "per hour correct vs faulty clock difference", "true time ratio"],
        ["Overlap interval", "65 5/11 minutes", "between consecutive overlaps"],
        ["Faulty clock", "if hands of a clock overlap every x true minutes, it runs at (720/11)/x of true time", "x > 720/11 ⇒ slow ; x < 720/11 ⇒ fast"],
        ["Angle per hour mark", "30° between consecutive numbers", ""],
        ["Mirror image time", "11:60 − given time", "(for clock mirrors)"]
      ],
      tricks: [
        "Angle between hands: |30H − 5.5M|; if it exceeds 180°, subtract from 360°.",
        "The hands overlap every 65 5/11 minutes (720/11).",
        "Hands overlap at (60H/11) minutes past H, e.g. 4 o'clock → 21 9/11 min past 4.",
        "In 12 hours hands are at 90° 22 times, at 180° 11 times, together 11 times.",
        "A clock that is slow or fast: find gain/loss per hour from overlap time.",
        "Mirror image of time T on a clock is 11:60 − T (or 12:00 − T, for exact hours)."
      ],
      traps: [
        "Use H as the hour on a 12-hour clock (12 → 0 in the formula).",
        "Two moments give the same angle; check both when asked for the first.",
        "Always give the smaller angle (≤ 180°) unless the problem asks for reflex.",
        "Overlap interval is NOT 60 min; it's 65 5/11 min for a correct clock."
      ] },

    { topic: "calendars", title: "Calendars",
      items: [
        ["Ordinary year", "365 days = 52 weeks + 1 odd day", ""],
        ["Leap year", "366 days = 52 weeks + 2 odd days", ""],
        ["Leap year rule", "divisible by 4; century years divisible by 400", "1900 not, 2000 is"],
        ["Odd days in 100 years", "5 (since 24 leaps + 76 ordinary = 24×2 + 76 = 124 ≡ 5)", ""],
        ["Odd days in 200 / 300 / 400 years", "3 / 1 / 0", ""],
        ["Odd days per month", "Jan 3, Feb 0 (1 leap), Mar 3, Apr 2, May 3, Jun 2, Jul 3, Aug 3, Sep 2, Oct 3, Nov 2, Dec 3", "days mod 7"],
        ["Day codes", "Sun 0, Mon 1, Tue 2, Wed 3, Thu 4, Fri 5, Sat 6", "odd days → day"],
        ["Day of a date", "odd days of completed centuries + years + months + date, mod 7", "count only COMPLETED years/months before the date"],
        ["Leap years in n years", "⌊n/4⌋ − ⌊n/100⌋ + ⌊n/400⌋", "up to that year"],
        ["Number of weeks and days", "N days = ⌊N/7⌋ weeks + N mod 7 days", ""],
        ["Day after n days", "(today code + n) mod 7", ""],
      ],
      tricks: [
        "Odd days: 100 yrs = 5, 200 = 3, 300 = 1, 400 = 0 (use for centuries before the year).",
        "Ordinary year shifts the same date by 1 weekday; a leap year by 2 (after Feb 29).",
        "Number of leap years up to year N: ⌊N/4⌋ − ⌊N/100⌋ + ⌊N/400⌋.",
        "Month odd days: 31-day months add 3, 30-day months add 2, Feb 0 (or 1 in leap).",
        "Anchor: 1 Jan 2000 was a Saturday; 1 Jan 1900 was a Monday; 1 Jan 2001 was a Monday.",
        "A year's calendar repeats after 28 years (inside a century without a skipped leap year); non-leap year repeats after 6 or 11 years."
      ],
      traps: [
        "1900 was NOT a leap year; 2000 was.",
        "Count 'years elapsed' not the current year; for date in year Y, use complete years up to Y − 1.",
        "A leap year adds one day only after 29 Feb; for January and February dates use ordinary-year offsets.",
        "Odd days are days mod 7; 0 odd days means the SAME weekday."
      ] },

    { topic: "statistics", title: "Statistics",
      items: [
        ["Mean", "Σx / n", ""],
        ["Mean (frequency)", "Σ f x / Σ f", ""],
        ["Median (odd n)", "((n + 1)/2)th value", "sorted data"],
        ["Median (even n)", "average of (n/2)th and (n/2 + 1)th", ""],
        ["Mode", "most frequent value", "empirical: Mode = 3 Median − 2 Mean"],
        ["Range", "max − min", ""],
        ["Variance", "σ² = Σ(x − mean)²/n = Σx²/n − mean²", ""],
        ["Standard deviation", "σ = √variance", ""],
        ["Effect of adding constant k", "mean + k ; SD unchanged", ""],
        ["Effect of multiplying by k", "mean × k ; SD × |k|", ""],
        ["Mean deviation", "Σ|x − mean|/n", ""],
        ["Coefficient of variation", "(σ / mean) × 100", ""],
        ["Weighted mean", "Σ w x / Σ w", ""],
        ["Combined mean", "(n₁m₁ + n₂m₂)/(n₁ + n₂)", ""],
        ["Quartiles", "Q₁ = ((n + 1)/4)th ; Q₃ = (3(n + 1)/4)th", "IQR = Q₃ − Q₁"],
        ["Correlation sign", "r between −1 and +1", ""],
        ["Growth rate average (geometric mean)", "(x₁ x₂ … xₙ)^(1/n)", "for percentage changes"],
        ["Median of grouped data", "L + [(n/2 − cf)/f] × h", ""]
      ],
      tricks: [
        "Adding a constant shifts mean and median but not the SD.",
        "Mean ≥ GM ≥ HM for positive numbers.",
        "Mode ≈ 3 Median − 2 Mean for moderately skewed data.",
        "Median needs sorted data; check the count (odd/even).",
        "Sum of deviations from the mean is always zero.",
        "Variance shortcut: mean of squares − square of mean."
      ],
      traps: [
        "Sort the data before picking the median.",
        "SD is the square root of variance; do not forget the root.",
        "For frequency tables use Σf as n, not the number of rows.",
        "Mode may not exist or may not be unique."
      ] },

    { topic: "sets-ds", title: "Sets & Venn and Data sufficiency",
      items: [
        ["Two sets", "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)", ""],
        ["Three sets", "n(A ∪ B ∪ C) = ΣA − Σ(A∩B) + n(A∩B∩C)", "ΣA = n(A)+n(B)+n(C)"],
        ["Neither", "total − n(A ∪ B)", ""],
        ["Only A", "n(A) − n(A ∩ B)", "three sets: n(A) − n(A∩B) − n(A∩C) + n(A∩B∩C)"],
        ["Exactly two (3 sets)", "Σ n(A∩B) − 3 n(A∩B∩C)", ""],
        ["Exactly one", "ΣA − 2 Σ n(A∩B) + 3 n(A∩B∩C)", ""],
        ["De Morgan", "(A ∪ B)' = A' ∩ B' ; (A ∩ B)' = A' ∪ B'", ""],
        ["Subsets of n elements", "2ⁿ", "proper subsets 2ⁿ − 1"],
        ["Maximum overlap", "min(n(A), n(B))", ""],
        ["Minimum overlap", "max(0, n(A) + n(B) − total)", ""],
        ["Complement", "n(A') = total − n(A)", ""],
        ["Data sufficiency options", "1: statement I alone; 2: II alone; 3: both together; 4: each alone; 5: neither", "standard 5-option form"],
        ["DS method", "decide I alone, decide II alone, then both", "never mix the statements first"],
        ["Value vs yes/no questions", "yes/no needs a definite answer (always yes or always no)", ""]
      ],
      tricks: [
        "Draw a Venn diagram and fill from the innermost region (all three) outwards.",
        "Maximum/minimum overlaps: min = n(A) + n(B) − total; max = smaller set.",
        "n(A ∪ B ∪ C) = ΣA − Σ pairs + triple; use it to find missing intersections.",
        "Data sufficiency: test each statement alone first; if neither alone works, combine.",
        "For yes/no DS: if a statement gives sometimes yes, sometimes no, it is NOT sufficient."
      ],
      traps: [
        "Intersections counted in two sets: subtract once for 2 sets, and add back the triple for 3 sets.",
        "'Only A' excludes the overlaps; 'A' alone in the equation includes them.",
        "DS: do not solve for the number if the question only needs sufficiency.",
        "'At least one' is the union; 'neither' is the complement."
      ] }
  ];
  Q.forEach(function (e) { e.sec = "quant"; window.FORMULAS.push(e); });
})();
