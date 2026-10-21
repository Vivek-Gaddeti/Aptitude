/* Learn pages for Quantitative Aptitude, part 2: mixtures, averages, ages, time & work, pipes, time-speed-distance. */
window.LEARN = window.LEARN || {}; LEARN.quant = LEARN.quant || []; window.BRIEFS = window.BRIEFS || {};

/* ---- diagrams (inline SVG, theme-aware through currentColor) ---- */
const SVG_ALLIGATION = `<div class="diagram"><svg viewBox="0 0 420 200" width="420" role="img" aria-label="Alligation cross: cheaper 30, dearer 45, mean 36, giving 9 and 6" stroke="currentColor" fill="none" stroke-width="1.6" stroke-linecap="round" style="max-width:420px">
  <rect x="10" y="14" width="110" height="38" rx="8"/><text x="65" y="38" text-anchor="middle" fill="currentColor" stroke="none" font-size="14">Cheaper: ₹30</text>
  <rect x="10" y="148" width="110" height="38" rx="8"/><text x="65" y="172" text-anchor="middle" fill="currentColor" stroke="none" font-size="14">Dearer: ₹45</text>
  <line x1="120" y1="33" x2="165" y2="92"/><line x1="255" y1="108" x2="300" y2="167"/>
  <line x1="120" y1="167" x2="165" y2="108"/><line x1="255" y1="92" x2="300" y2="33"/>
  <rect x="165" y="82" width="90" height="36" rx="18" stroke-width="2.4"/><text x="210" y="105" text-anchor="middle" fill="currentColor" stroke="none" font-size="14" font-weight="700">Mean: ₹36</text>
  <rect x="300" y="14" width="110" height="38" rx="8"/><text x="355" y="38" text-anchor="middle" fill="currentColor" stroke="none" font-size="14">45 − 36 = 9</text>
  <rect x="300" y="148" width="110" height="38" rx="8"/><text x="355" y="172" text-anchor="middle" fill="currentColor" stroke="none" font-size="14">36 − 30 = 6</text>
  <text x="210" y="62" text-anchor="middle" fill="currentColor" stroke="none" font-size="12" opacity=".75">cheaper : dearer</text>
  <text x="210" y="142" text-anchor="middle" fill="currentColor" stroke="none" font-size="12" opacity=".75">= 9 : 6 = 3 : 2</text>
</svg><div class="cap">The alligation cross. Subtract along the two diagonals; each answer sits on the row of the quantity it measures.</div></div>`;

const SVG_PLATFORM = `<div class="diagram"><svg viewBox="0 0 420 160" width="420" role="img" aria-label="A 150 m train crossing a 250 m platform covers 400 m" stroke="currentColor" fill="none" stroke-width="1.6" stroke-linecap="round" style="max-width:420px">
  <line x1="10" y1="92" x2="410" y2="92"/>
  <rect x="150" y="76" width="230" height="16" rx="2"/>
  <rect x="40" y="58" width="110" height="30" rx="6" stroke-width="2.4"/>
  <path d="M150 66 L162 74 L150 82" />
  <rect x="270" y="58" width="110" height="30" rx="6" stroke-dasharray="5 4"/>
  <text x="95" y="50" text-anchor="middle" fill="currentColor" stroke="none" font-size="13">Train 150 m</text>
  <text x="325" y="50" text-anchor="middle" fill="currentColor" stroke="none" font-size="13" opacity=".75">train at the end</text>
  <text x="265" y="110" text-anchor="middle" fill="currentColor" stroke="none" font-size="13">Platform 250 m</text>
  <line x1="40" y1="128" x2="380" y2="128"/><line x1="40" y1="121" x2="40" y2="135"/><line x1="380" y1="121" x2="380" y2="135"/>
  <text x="210" y="152" text-anchor="middle" fill="currentColor" stroke="none" font-size="14" font-weight="700">Distance to cross = 150 + 250 = 400 m</text>
</svg><div class="diagram-cap cap">Crossing starts when the front reaches the platform and ends when the tail leaves it, so the train travels its own length plus the platform.</div></div>`;

const SVG_BOAT = `<div class="diagram"><svg viewBox="0 0 420 170" width="420" role="img" aria-label="Boat going downstream adds the stream speed, upstream subtracts it" stroke="currentColor" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="max-width:420px">
  <path d="M30 40 L110 40 L96 58 L44 58 Z"/><path d="M70 40 L70 22 L92 40"/>
  <path d="M130 30 L200 30 M192 24 L200 30 L192 36"/>
  <path d="M14 66 q8 -6 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0"/>
  <text x="215" y="28" fill="currentColor" stroke="none" font-size="14" font-weight="700">Downstream</text>
  <text x="215" y="46" fill="currentColor" stroke="none" font-size="13">boat + stream = 12 km/h</text>
  <path d="M30 108 L110 108 L96 126 L44 126 Z"/><path d="M70 108 L70 90 L48 108"/>
  <path d="M200 98 L130 98 M138 92 L130 98 L138 104"/>
  <path d="M14 134 q8 -6 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0"/>
  <text x="215" y="96" fill="currentColor" stroke="none" font-size="14" font-weight="700">Upstream</text>
  <text x="215" y="114" fill="currentColor" stroke="none" font-size="13">boat − stream = 8 km/h</text>
  <text x="105" y="160" text-anchor="middle" fill="currentColor" stroke="none" font-size="13">Boat = (12 + 8)/2 = 10 km/h</text><text x="315" y="160" text-anchor="middle" fill="currentColor" stroke="none" font-size="13">Stream = (12 − 8)/2 = 2 km/h</text>
</svg><div class="cap">The stream helps the boat going down and slows it going up. Half the sum is the boat; half the difference is the stream.</div></div>`;

/* =========================================================== MIXTURES */
LEARN.quant.push({
  id: "mixtures", group: "Arithmetic", title: "Mixtures & alligation",
  sub: "Mixing prices and strengths: one cross-subtraction replaces a page of algebra",
  tags: ["TCS", "Infosys", "Wipro", "Capgemini", "AMCAT", "eLitmus"],
  blocks: [
    ["h2", "The idea"],
    ["p", "When you mix two things, the result lies **between** them, and it sits closer to whichever one you used more of. A mix of ₹30 rice and ₹45 rice can never cost ₹50, and it will cost nearer ₹30 if you use mostly the cheap rice. **Alligation** is just a fast way of turning that “closer to the bigger part” idea into an exact ratio."],
    ["p", "The same idea works for prices, for the percent of acid or sugar in a solution, for the percent of milk in a mixture, and even for speeds or profits. Anything that is an average weighted by quantity can be done with the cross."],
    ["list", [
      "**Mean price (weighted average):** total cost of everything ÷ total quantity. It is not the simple average of the two prices unless the quantities are equal.",
      "**Concentration is an amount per 100:** a 20% acid solution has 20 parts acid in every 100 parts. The pure ingredient inside is what stays constant when you only add or remove water.",
      "**Pure water is a 0% solution** and **pure acid / milk is a 100% solution.** That lets you treat “add water” as just another mixing problem.",
      "**Repeated replacement shrinks the pure part by the same factor each time:** you keep removing the same fraction of what is left."
    ]],
    ["note", "In every problem, first decide what is being averaged (a price, a percent) and what the weights are (kg, litres). The cross-subtraction always gives the ratio of the weights."],
    ["html", SVG_ALLIGATION],

    ["h2", "Formulas"],
    ["formulas", [
      ["Mean price", "Mean = (q₁p₁ + q₂p₂) / (q₁ + q₂)", "Weighted average: price × quantity, added, divided by total quantity"],
      ["Alligation rule", "Cheaper qty : Dearer qty = (Dearer − Mean) : (Mean − Cheaper)", "Each quantity is proportional to the gap on the OTHER side of the mean"],
      ["Mixing to a target %", "Qty of A : Qty of B = (B% − Target%) : (Target% − A%)", "Same cross, with percents instead of prices. Water is 0%, pure ingredient is 100%"],
      ["Repeated replacement", "Left after n steps = V (1 − x/V)ⁿ", "V = vessel volume, x = amount removed and replaced each time (pure part only)"],
      ["Ratio after n steps", "Pure part / Total = (1 − x/V)ⁿ", "The total volume never changes, only the pure part does"],
      ["Add or remove water", "Pure ingredient stays fixed", "New total = pure amount ÷ new strength"],
      ["Mixture sold at a profit", "Selling price = Cost × (100 + p)/100", "Find the mean cost price first, then add the profit"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**The cross:** write the cheaper price top-left, the dearer bottom-left, the mean in the middle, then subtract diagonally. The answers read straight off as the ratio.",
      "**Closer to the larger part:** if the mean is nearer the cheaper price, the cheaper ingredient has the larger quantity. Use this to catch a swapped ratio.",
      "**Percent works like price:** to get 20% from a 10% and a 40% solution, use the cross with 10, 40 and 20: gaps 20 and 10, so 2 : 1.",
      "**Repeated replacement in one line:** if you remove a fraction f each time, what remains of the pure part is (1 − f)ⁿ. Removing 1/5 twice leaves 4/5 × 4/5 = 16/25.",
      "**Adding water to a solution:** the pure amount does not change, so work out the pure amount first, then divide by the new strength.",
      "**Equal quantities** give the simple average. If the mean is exactly halfway, the ratio is 1 : 1."
    ]],
    ["tip", "Make the cross look the same every time: cheaper on top, dearer below, and the answers on the right. A consistent layout stops the ratio from flipping."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/mixtures/alligation", title: "Alligation (mean price)",
      spot: "Two items at different prices are mixed, and the question asks for the ratio, the mean price, or the mean price when the ratio is given.",
      method: ["Write the cheaper price, the dearer price and the mean price in the cross.", "Subtract diagonally: (dearer − mean) goes with the cheaper, (mean − cheaper) goes with the dearer.", "Reduce the two numbers to the simplest ratio of cheaper : dearer."],
      ex: { q: "In what ratio must sugar at ₹30 per kg be mixed with sugar at ₹45 per kg to get a mixture worth ₹36 per kg?", steps: ["Cheaper = 30, dearer = 45, mean = 36", "Cheaper part ∝ 45 − 36 = 9, dearer part ∝ 36 − 30 = 6", "9 : 6 reduces to 3 : 2"], ans: "3 : 2 (cheaper : dearer)" },
      shortcut: "Mean 36 is 6 above 30 and 9 below 45, so it is nearer the cheaper one, which therefore has the bigger share (3 parts against 2)."
    }],
    ["pattern", {
      key: "quant/mixtures/mixing-two-solutions-to-a", title: "Mixing two solutions to a target %",
      spot: "Two solutions of different strengths are mixed to get a given percent of acid, salt, milk or sugar. You are asked for a ratio or a quantity.",
      method: ["Treat each strength like a price (water counts as 0%).", "Use the cross to get the ratio of the two solutions.", "Turn the ratio into litres using the quantity you were given."],
      ex: { q: "How many litres of a 40% acid solution must be added to 20 L of a 10% solution to get a 20% solution?", steps: ["Weaker 10%, stronger 40%, target 20%", "10% solution : 40% solution = (40 − 20) : (20 − 10) = 20 : 10 = 2 : 1", "20 L of the 10% solution needs 10 L of the 40% solution", "Check: acid = 2 + 4 = 6 L in 30 L, and 6/30 = 20%"], ans: "10 litres" },
      shortcut: "Gaps from the target: 10 below and 20 above. The bigger gap goes with the weaker solution, so there is more of it."
    }],
    ["pattern", {
      key: "quant/mixtures/repeated-replacement", title: "Repeated replacement",
      spot: "A vessel is full of pure milk (or acid). Some is removed and replaced by water, and this is done more than once.",
      method: ["Find the fraction removed each time: x / V.", "The pure part is multiplied by (1 − x/V) at every step.", "After n steps: pure = V (1 − x/V)ⁿ. The water is whatever is left of the total."],
      ex: { q: "A vessel holds 40 L of pure milk. 8 L is removed and replaced by water. The same is done once more. How much milk is left?", steps: ["Fraction removed each time = 8/40 = 1/5, so the factor is 4/5", "Milk left = 40 × (4/5)² = 40 × 16/25", "= 25.6 L, so water is 14.4 L and the ratio milk : water = 16 : 9"], ans: "25.6 L of milk" },
      shortcut: "Think in fractions of the whole: after two rounds of 1/5, the milk is 16/25 of the vessel. You never need the actual litres until the last line."
    }],
    ["pattern", {
      key: "quant/mixtures/removing-and-adding-water", title: "Removing & adding water",
      spot: "A mixture is given in a ratio or a percent, then water is added, evaporated, or some mixture is drawn off, and a new strength or ratio is required.",
      method: ["Split the mixture into the pure ingredient and water. Only water changes if you add or evaporate water.", "Keep the pure amount fixed and set it equal to the new strength × new total.", "If you take out some mixture, both parts leave in the same ratio as in the mixture."],
      ex: { q: "A 60 L mixture of milk and water is in the ratio 3 : 2. How much water must be added to make the ratio 3 : 4?", steps: ["Milk = 60 × 3/5 = 36 L, water = 24 L", "Milk stays 36 L. For 3 : 4, water must be 36 × 4/3 = 48 L", "Water to add = 48 − 24"], ans: "24 litres" },
      shortcut: "Fix the part that does not change (here milk). Scale the ratio so that part matches, then compare the other part."
    }],
    ["pattern", {
      key: "quant/mixtures/three-mixtures", title: "Three mixtures",
      spot: "Three vessels or three ingredients are combined, each with its own ratio or percent, and you need the final ratio or percent.",
      method: ["For each source, find the amount of the thing you track (milk, acid, sugar).", "Add those amounts, and add the quantities taken.", "Final percent = total pure ÷ total quantity × 100. Final ratio = pure : (total − pure)."],
      ex: { q: "Vessels A, B and C hold milk : water in the ratios 1 : 2, 2 : 3 and 3 : 2. If 3 L from A, 5 L from B and 2 L from C are mixed, what is the percent of milk in the mixture?", steps: ["Milk from A = 3 × 1/3 = 1 L", "Milk from B = 5 × 2/5 = 2 L", "Milk from C = 2 × 3/5 = 1.2 L", "Total milk = 4.2 L in 3 + 5 + 2 = 10 L, so 4.2/10 = 42%"], ans: "42% milk, which is a milk : water ratio of 21 : 29" },
      shortcut: "Convert every ratio into a fraction of milk first (1/3, 2/5, 3/5). Then it is just a weighted sum."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Simple average of two prices:** the mean price depends on the quantities. ₹30 and ₹45 mixed 3 : 2 gives ₹36, not ₹37.5.",
      "**Swapped ratio:** the cheaper quantity goes with the dearer gap, not its own gap. Always check that the mean is nearer the bigger part.",
      "**Percent of what:** concentration is a percent of the whole mixture. Remember that water is 0%, not “nothing”.",
      "**Replacement removes both:** when you draw off mixture, you remove milk and water in the current ratio, not only water.",
      "**Using litres removed as the remaining:** in repeated replacement, the pure part left is V(1 − x/V)ⁿ. Do not subtract x each time.",
      "**Adding water changes the total:** the pure amount is fixed, so recompute the total from the new percent.",
      "**Different measures:** if one strength is given per litre and another per kg, convert to one unit before using the cross."
    ]],
    ["warn", "After you get a ratio, quickly test it: the mean must fall nearer the ingredient with the bigger share. If it does not, the ratio is upside down."],

    ["h2", "Quick check"],
    ["quiz", ["mixtures-01", "mixtures-03", "mixtures-04", "mixtures-05", "mixtures-07"]]
  ]
});
BRIEFS["quant:mixtures"] = "A mixture is a weighted average, so its price or strength always lies between the two things you mixed, and nearer the one you used more of. Alligation turns that into a ratio: write the cheaper and dearer values on the left, the mean in the middle, and subtract along the two diagonals.\n\nThe same cross works for prices and for percent of acid or milk, with pure water as 0%. For repeated replacement, the pure part is multiplied by (1 − removed/total) at every step. When water is added or evaporated, hold the pure amount fixed and rebuild the total.";

/* =========================================================== AVERAGES */
LEARN.quant.push({
  id: "averages", group: "Arithmetic", title: "Averages",
  sub: "Everything is a sum in disguise: turn the average back into a total and the question gets easy",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "AMCAT"],
  blocks: [
    ["h2", "The idea"],
    ["p", "The **average** of some numbers is the single value each would have if the total were shared out equally. That is why **Average = Sum ÷ Count**, and, turned around, **Sum = Average × Count**. Almost every averages question is solved by converting the average into a sum, doing a little addition or subtraction, and converting back."],
    ["list", [
      "**The sum is the workhorse:** averages themselves cannot be added or subtracted across groups. Totals can.",
      "**Change in average × count = change in total:** if the average of 8 people goes up by 3, the total went up by 24.",
      "**The average lies between the smallest and largest value.** Use this to sanity-check answers.",
      "**Evenly spaced numbers:** the average equals the middle value (odd count) or the mean of the two middle values (even count). That makes consecutive-number questions very quick.",
      "**Weighted average:** when groups have different sizes, weight each group's average by its size."
    ]],
    ["note", "Never average two averages directly unless the groups are the same size. Convert each to a total, add the totals, and divide by the total count."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Average", "Average = Sum / Number of items", "Rearranged: Sum = Average × Number"],
      ["Change in average", "Change in total = Change in average × Count", "Use when a value is replaced, added or corrected"],
      ["New member replaces one", "New − Old = n × (Rise in average)", "n = number of members. A fall makes the right side negative"],
      ["Member added", "New value = New average + n × (Rise in average)", "n = old count before the newcomer joins. He must cover the new average and lift every earlier member"],
      ["Consecutive numbers", "Average = (first + last) / 2", "For any evenly spaced list. First n natural numbers: average = (n + 1)/2"],
      ["Sum of first n", "Naturals n(n + 1)/2 · Odds n² · Evens n(n + 1)", "Average of first n odds = n; of first n evens = n + 1"],
      ["Weighted average", "(n₁a₁ + n₂a₂ + …) / (n₁ + n₂ + …)", "Weights are the group sizes"],
      ["Wrongly copied value", "Correct sum = Wrong sum − Wrong value + Right value", "Correct average = Correct sum / n"],
      ["Cricket (innings)", "Runs needed = New average × (n + 1) − Old total", "Equivalent: Old average + (n + 1) × Rise"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**Deviation method:** pick a guess close to the average, add up how far each number is above or below it, divide the net by the count, and add that to the guess. For 12, 18, 25, 31, 44 take 25: gaps −13, −7, 0, +6, +19 give a net of +5, and 25 + 5/5 = 26.",
      "**Replacing a member:** the new person's value = old value + (count × rise in average). Eight people, rise of 3: new = old + 24.",
      "**Adding a member:** the new value = new average + (old count × rise). It is the new average plus enough to lift every earlier member.",
      "**Cricket in one line:** the next score = old average + (innings after this one) × (target rise). From 40 to 42 over 13 innings: 40 + 13 × 2 = 66.",
      "**Corrections:** do not recompute the sum. Divide the error by the count and shift the average by that much.",
      "**Consecutive numbers:** find the middle value from the average, then count steps outwards."
    ]],
    ["tip", "If a question gives you averages and asks for one missing value, set up Sum = Average × Count for every group and subtract. Never try to reason with averages directly."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/averages/basic-averages", title: "Basic averages",
      spot: "A list of numbers with its average, and one missing number or the average itself is required.",
      method: ["Total = average × count for the full list.", "Add the known numbers.", "Missing number = total − known sum."],
      ex: { q: "The average of 6 numbers is 28. Five of them are 20, 25, 30, 32 and 35. Find the sixth number.", steps: ["Total of all six = 28 × 6 = 168", "Sum of the five known = 20 + 25 + 30 + 32 + 35 = 142", "Sixth = 168 − 142"], ans: "26" },
      shortcut: "Write the sum, not the average. Compare totals; averages hide the arithmetic."
    }],
    ["pattern", {
      key: "quant/averages/new-member-replaces-one", title: "New member replaces one",
      spot: "A person (or number) leaves and a new one takes the place, and the group's average goes up or down by a given amount.",
      method: ["The group size stays the same.", "Change in total = count × change in average.", "New value = old value + that change (or minus, if the average fell)."],
      ex: { q: "The average age of 8 men rises by 3 years when one man aged 32 is replaced by a new man. What is the age of the new man?", steps: ["Rise in total = 8 × 3 = 24 years", "New man's age = 32 + 24"], ans: "56 years" },
      shortcut: "New = old + count × rise. A fall in the average means new = old − count × fall."
    }],
    ["pattern", {
      key: "quant/averages/members-added-removed", title: "Members added / removed",
      spot: "Some members join or leave the group and the average changes, or the average of a smaller group inside a bigger one is known.",
      method: ["Find the total of the whole group (average × count).", "Find the total of the part you know (average × its count).", "Total of the rest = whole − part; divide by its count."],
      ex: { q: "The average of 10 numbers is 40. When two of them are removed, the average of the remaining eight is 38. What is the average of the two removed numbers?", steps: ["Total of 10 = 40 × 10 = 400", "Total of 8 = 38 × 8 = 304", "Two removed add to 400 − 304 = 96, so their average = 96/2"], ans: "48" },
      shortcut: "Whenever the count changes, rebuild each total separately. Never subtract averages."
    }],
    ["pattern", {
      key: "quant/averages/consecutive-numbers", title: "Consecutive numbers",
      spot: "Consecutive integers, odd numbers, even numbers or multiples of a number, with their average or sum given.",
      method: ["For an odd count, the average is the middle number. For an even count, it lies halfway between the two middle ones.", "Count steps outwards using the common difference (1 for consecutive, 2 for odd or even, k for multiples of k).", "Check: first + last = 2 × average."],
      ex: { q: "The average of 7 consecutive odd numbers is 33. Find the largest and smallest.", steps: ["Middle (4th) number = 33", "Three steps of 2 up: 33 + 6 = 39", "Three steps of 2 down: 33 − 6 = 27"], ans: "Largest 39, smallest 27 (the numbers are 27, 29, 31, 33, 35, 37, 39)" },
      shortcut: "The number of steps from the middle is (count − 1)/2. Here that is 3 steps of 2 each, or 6."
    }],
    ["pattern", {
      key: "quant/averages/cricket-averages", title: "Cricket averages",
      spot: "A batter's average after some innings and the score needed in the next innings (or the average after one more innings).",
      method: ["Runs so far = average × innings.", "Target total = new average × (innings + 1).", "Runs needed = target total − runs so far."],
      ex: { q: "A batter's average after 12 innings is 40. How many runs must he score in his 13th innings to raise the average to 42?", steps: ["Runs so far = 40 × 12 = 480", "Target = 42 × 13 = 546", "Runs needed = 546 − 480"], ans: "66 runs" },
      shortcut: "Old average + (innings after this one) × rise = 40 + 13 × 2 = 66. The new innings must cover the rise for everyone."
    }],
    ["pattern", {
      key: "quant/averages/weighted-average", title: "Weighted average",
      spot: "Groups of different sizes each have an average, and you want the combined average.",
      method: ["Multiply each group's average by its size to get its total.", "Add the totals and add the sizes.", "Divide the combined total by the combined size."],
      ex: { q: "Class A has 30 students with an average of 60 marks. Class B has 20 students with an average of 70. What is the combined average?", steps: ["Total of A = 30 × 60 = 1,800", "Total of B = 20 × 70 = 1,400", "Combined = (1,800 + 1,400) / 50 = 3,200/50"], ans: "64" },
      shortcut: "The answer is nearer the bigger group: 64 is 4 above 60 and 6 below 70, and the gaps 4 : 6 are the inverse of the sizes 30 : 20. This is the alligation cross again."
    }],
    ["pattern", {
      key: "quant/averages/correcting-a-wrongly-copied-value", title: "Correcting a wrongly copied value",
      spot: "An average was found, then someone discovers that one (or more) values were misread or copied wrongly, and you must give the correct average.",
      method: ["Wrong total = wrong average × count.", "Correct total = wrong total − wrong value + right value.", "Correct average = correct total ÷ count."],
      ex: { q: "The average marks of 25 students were found to be 60. It was later discovered that one student's marks were entered as 95 instead of 45. What is the correct average?", steps: ["Wrong total = 60 × 25 = 1,500", "Correct total = 1,500 − 95 + 45 = 1,450", "Correct average = 1,450/25"], ans: "58" },
      shortcut: "The total was 50 too high, and 50/25 = 2, so the average was 2 too high: 60 − 2 = 58."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Averaging averages:** (60 + 70)/2 = 65 is wrong when the groups are 30 and 20 students. Weight by size.",
      "**Wrong count:** when a person is added the count rises by 1, not by the number of people who left. Write the count at each stage.",
      "**Replacement vs addition:** replacing keeps the count the same; adding changes it. The formulas are different.",
      "**Cricket counts innings:** the 13th innings means the new count is 13, not 12 or 14.",
      "**Using averages for corrections:** fix the total first, then divide. Do not shift the average by the full error.",
      "**Even numbers of terms:** the average of an even-sized consecutive list is NOT in the list. Do not assume a middle number.",
      "**Not-outs:** a batter's average counts only completed innings, so check what the question treats as the count."
    ]],
    ["warn", "Before you start, write the sum and the count for every group. If a number you are about to use is an average, convert it to a total first."],

    ["h2", "Quick check"],
    ["quiz", ["averages-01", "averages-03", "averages-04", "averages-06", "averages-08"]]
  ]
});
BRIEFS["quant:averages"] = "An average is a total shared out equally, so Sum = Average × Count is the one equation to remember. Almost every question is solved by turning the averages into totals, adding or subtracting, and turning the answer back into an average.\n\nA replaced member changes the total by count × change in average. A wrongly copied value changes the total by the size of the error. Different-sized groups need a weighted average, never the average of the two averages. Consecutive numbers are quick because the average sits in the middle.";

/* =========================================================== AGES */
LEARN.quant.push({
  id: "ages", group: "Arithmetic", title: "Problems on ages",
  sub: "Two facts decide every age problem: the gap between two people never changes, and everyone ages by the same amount",
  tags: ["TCS", "Infosys", "Wipro", "Capgemini", "Cognizant", "AMCAT"],
  blocks: [
    ["h2", "The idea"],
    ["p", "An age problem is a small story in words. Your job is to translate it into one or two equations about **ages at one moment** and then solve. The story always jumps between now, the past and the future, so be careful about which moment each fact belongs to."],
    ["list", [
      "**The difference between two ages never changes.** If a father is 28 years older than his son now, he was 28 years older when the son was born and will be 28 years older when the son is 40.",
      "**Everyone gets older by the same amount.** After t years, add t to every person's age. Before t years, subtract t from every age.",
      "**A ratio of ages is not constant.** 3 : 2 now becomes a different ratio next year, because both numbers grow by the same amount, not by the same fraction.",
      "**The sum of ages grows by (number of people × years).** For two people, 10 years later the sum is 20 more."
    ]],
    ["note", "Choose your unknown as the **present** age of the person you are asked about (or as a ratio part: 4x and 5x). Then write what every other age was or will be."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Ratio now", "Ages = ax and bx", "x is the one part. Use it when a ratio a : b is given for the present"],
      ["After t years", "(ax + t) / (bx + t) = p / q", "Add t to both. Then cross-multiply and solve for x"],
      ["Before t years", "(ax − t) / (bx − t) = p / q", "Subtract t from both. Check that nobody becomes negative"],
      ["Age difference", "Difference stays the same", "Use it to find one age quickly from another"],
      ["Sum of ages", "Sum after t years = Sum now + (people × t)", "Sum before t years = Sum now − (people × t)"],
      ["Family average", "Total = Average × members", "At an earlier time subtract t for each person who already existed"],
      ["“k times” statement", "Older − t = k (Younger − t)", "Older now is expressed with the same unknown as the younger"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**Sum and ratio together:** if the sum at some time is known and the ratio at that time is known, you can read each age straight from the ratio parts.",
      "**Shift the sum:** if the sum is given now and the ratio is given t years ago, subtract (people × t) from the sum first, split it by the ratio, then add t back.",
      "**Use the gap:** the age gap is one part in every ratio. If it is 6 years, then a later ratio of 5 : 6 means the ages are 5 × 6 = 30 and 6 × 6 = 36.",
      "**Try the options:** with a ratio statement, test an answer from the options for the present age and see whether the other statement holds. This is often the quickest check.",
      "**Equal ratio parts:** when the ratio is ax : bx, the difference is (b − a)x. Find x from the given difference and everything follows."
    ]],
    ["tip", "Draw a tiny table with columns Now / Then and rows for each person. Fill in the unknowns once, and the equations write themselves."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/ages/ratio-now-then", title: "Ratio now / then",
      spot: "The present ages are in one ratio, and after (or before) some years they are in another ratio.",
      method: ["Let the present ages be ax and bx.", "Add or subtract the years from both and write the new ratio as a fraction.", "Cross-multiply, solve for x, then find the requested age."],
      ex: { q: "The ages of A and B are in the ratio 4 : 5. Six years from now the ratio will be 5 : 6. What is B's present age?", steps: ["Let A = 4x and B = 5x", "(4x + 6)/(5x + 6) = 5/6, so 24x + 36 = 25x + 30", "x = 6, so B = 5 × 6"], ans: "30 years (A is 24 now; in 6 years they are 30 and 36, which is 5 : 6)" },
      shortcut: "The gap between the ages is one part now and is also one part later. Here the gap is 6 years and it is 1 part at the later ratio, so 6 years later B is 36."
    }],
    ["pattern", {
      key: "quant/ages/sum-and-ratio", title: "Sum and ratio",
      spot: "The sum of the ages (now, or some years ago or later) and their ratio are given.",
      method: ["Move the sum to the same moment as the ratio: sum then = sum now ± (people × years).", "Split that sum in the ratio to get each age at that moment.", "Shift back (or forward) to the present."],
      ex: { q: "The sum of the present ages of Ram and Shyam is 50 years. Five years ago their ages were in the ratio 3 : 2. What is Ram's present age?", steps: ["Sum five years ago = 50 − 2 × 5 = 40", "Ram : Shyam then = 3 : 2, so parts = 8 each: Ram 24, Shyam 16", "Ram now = 24 + 5"], ans: "29 years (Shyam is 21)" },
      shortcut: "Total parts first, then one part. Always shift the sum before splitting."
    }],
    ["pattern", {
      key: "quant/ages/n-years-ago-it-was", title: "\"n years ago it was k times\"",
      spot: "A statement such as “10 years ago, the father was 4 times as old as his son”, together with a present-day relationship.",
      method: ["Let the younger person be s now, and write the other one using the present relationship.", "Subtract n from both ages and apply the k-times statement.", "Solve the single equation for s."],
      ex: { q: "Ten years ago, a man was 4 times as old as his son. Now he is only twice as old as his son. What is the son's present age?", steps: ["Let the son be s now, so the man is 2s", "Ten years ago: 2s − 10 = 4(s − 10)", "2s − 10 = 4s − 40, so s = 15"], ans: "15 years (man 30; ten years ago they were 20 and 5)" },
      shortcut: "Always subtract the years from every person before applying “k times”. The present relationship does not apply in the past."
    }],
    ["pattern", {
      key: "quant/ages/parent-and-children", title: "Parent & children",
      spot: "Family problems: average age of the family now, and the average (or total) at the birth of a child, or when the children grow up.",
      method: ["Total now = average × members.", "Going back t years, every member who already existed was t years younger. Subtract t for each of them.", "Do not subtract anything for a person not yet born."],
      ex: { q: "The average age of a family of 5 members is 28 years. The youngest member is 8 years old. What was the average age of the family at the birth of the youngest member?", steps: ["Total now = 28 × 5 = 140; remove the youngest (8): other four add up to 132", "At the birth, each of the four was 8 years younger: 132 − 4 × 8 = 100", "Average of those four = 100/4"], ans: "25 years" },
      shortcut: "Total at birth = total now − (members who existed then × child's age). The baby counts only from birth, so he has age 0."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Adding the years to one person only:** after t years, everyone's age goes up by t.",
      "**Applying a ratio to a different time:** a ratio is true only for the moment it is stated. Never reuse it for “now” and “then”.",
      "**Forgetting the shift on a sum:** a sum given now is not the sum from five years ago. Subtract (people × years).",
      "**Subtracting from a baby:** if someone is younger than the number of years, they did not exist yet. Their age is 0 at birth, not negative.",
      "**Rushing to the answer:** read the question for who is asked. Many students solve for x and then forget to multiply by the ratio part.",
      "**Age differences:** the gap is fixed. If your equations make it change, you made an error.",
      "**“Older by” vs “times as old”:** “older by 5” is a difference (add 5); “5 times as old” is a multiple (multiply by 5). Do not mix them up."
    ]],
    ["warn", "After you find the ages, put them back into the story and check every sentence. Age problems are the easiest to verify."],

    ["h2", "Quick check"],
    ["quiz", ["ages-01", "ages-02", "ages-03", "ages-04", "ages-07"]]
  ]
});
BRIEFS["quant:ages"] = "An age problem is a story with two or three moments in it. The two facts that keep you safe are that the gap between two ages never changes and that everyone gains the same number of years. Pick one unknown (often a ratio part x), then write every age at every moment before you form an equation.\n\nFor sum-and-ratio questions, move the sum to the moment the ratio belongs to (the sum shifts by people × years) and split it by the ratio. For “n years ago it was k times”, subtract n from every person first. For families, subtract the years only for those who already existed.";

/* =========================================================== TIME & WORK */
LEARN.quant.push({
  id: "time-work", group: "Arithmetic", title: "Time & work",
  sub: "Turn days into daily work, add the rates, and the whole topic becomes simple arithmetic",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "Capgemini", "eLitmus"],
  blocks: [
    ["h2", "The idea"],
    ["p", "If a person finishes a job in 10 days, then in one day they finish **1/10** of it. That fraction is their **rate of work**. When people work together, their rates simply **add**. So the time they take together is 1 divided by the total rate."],
    ["p", "A cleaner way is the **LCM (total-work) method**: pick a convenient total, such as the LCM of all the days, as the number of “work units”. Then each person's daily work is a whole number, and everything turns into integer arithmetic."],
    ["list", [
      "**Rate = 1 ÷ days.** A job done in 12 days gives a rate of 1/12 per day.",
      "**More efficient means fewer days.** Work and days are inversely proportional for the same job: if you are twice as fast, you take half the days.",
      "**Work = rate × time.** If the rates are in work units per day, multiplying by days gives units done.",
      "**Wages follow the work done**, not the days worked or the days alone. Pay is shared in the ratio of work done."
    ]],
    ["note", "If the question says “A is twice as efficient as B”, A's rate is twice B's rate and A's time is half B's time. The two ratios are opposites of each other."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Rate of work", "Rate = 1 / Days", "Days = 1 / Rate. Rates add when people work together"],
      ["Two people together", "Time = xy / (x + y)", "Product over sum of their individual days"],
      ["A + B given, A alone known", "B's days = (days together × A's days) / (A's days − days together)", "Or subtract the rates: 1/B = 1/together − 1/A"],
      ["LCM method", "Total work = LCM of the days", "Daily units = Total ÷ Days for each person"],
      ["Work done in t days", "Fraction done = t / Days", "Remaining = 1 − fraction done"],
      ["Men-days rule", "M₁ D₁ H₁ / W₁ = M₂ D₂ H₂ / W₂", "Men × days × hours per day ∝ work. Equal efficiency assumed"],
      ["Wages", "Share ∝ (rate × days worked)", "Equals the units of work each person did"],
      ["Efficiency ratio", "Efficiency ∝ 1 / Days", "If A : B efficiency = 3 : 1, days A : B = 1 : 3"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**Two people:** days together = product ÷ sum. A in 10 and B in 15 gives 150 ÷ 25 = 6 days.",
      "**LCM every time:** choose total work = LCM of the given days. Then A, B and C get small whole numbers per day, and “together” is just their sum.",
      "**Subtract to find a missing person:** if all three together do 6 units a day and A and B do 3 + 2, then C does 1. Never work with fractions when you can use units.",
      "**Efficiency ratios:** a ratio of efficiency like 3 : 1 means a ratio of days of 1 : 3. Total parts give the total rate.",
      "**Alternate days:** compute the work done in one pair of days, find how many full pairs fit, then handle the leftover.",
      "**Men-days:** equate (men × days × hours) on both sides. Do the same for women and children after converting everyone into one unit.",
      "**Leaving and joining:** compute the work done before the change, then the remaining work, then divide by the new rate."
    ]],
    ["tip", "Write the LCM units in a small table: person, days, units per day. Many questions finish just from reading that table."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/time-work/days-efficiency", title: "Days → efficiency",
      spot: "Each person's days (or the days for a group) are given, and you want the time together or one person's time alone.",
      method: ["Convert each person's days into a daily rate (1/days).", "Add rates for together, subtract for “the other person alone”.", "Take the reciprocal of the final rate to get days."],
      ex: { q: "A and B together can do a job in 8 days. A alone can do it in 12 days. In how many days can B alone do it?", steps: ["Together: 1/8 per day; A: 1/12 per day", "B = 1/8 − 1/12 = 3/24 − 2/24 = 1/24 per day", "B takes 24 days"], ans: "24 days" },
      shortcut: "For two people: (together × A) ÷ (A − together) = (8 × 12) ÷ (12 − 8) = 24."
    }],
    ["pattern", {
      key: "quant/time-work/lcm-method", title: "LCM (total-work) method",
      spot: "Two or three people with different days, working together or in turns. Fractions would otherwise get messy.",
      method: ["Take total work = LCM of all the days.", "Daily work of each person = total ÷ their days.", "Add the daily works; days together = total ÷ combined daily work."],
      ex: { q: "A, B and C can do a work alone in 12, 15 and 20 days. In how many days will they finish it working together?", steps: ["LCM of 12, 15, 20 = 60 units", "Per day: A = 5, B = 4, C = 3, together = 12 units", "Days = 60 ÷ 12"], ans: "5 days" },
      shortcut: "Pick the LCM so that everyone's daily work is a whole number, then forget fractions altogether."
    }],
    ["pattern", {
      key: "quant/time-work/together-then-one-leaves", title: "Together, then one leaves",
      spot: "Two people start together; after some days one leaves (or a new person joins) and the rest is finished by the remaining worker.",
      method: ["Use LCM units for the whole job.", "Work done together = days × combined rate.", "Remaining work ÷ the remaining person's rate = further days."],
      ex: { q: "A can do a job in 20 days and B in 30 days. They work together for 6 days, and then A leaves. In how many more days will B finish the rest?", steps: ["LCM = 60 units: A = 3 per day, B = 2 per day, together 5", "Work done in 6 days = 6 × 5 = 30 units, so 30 units remain", "B alone: 30 ÷ 2 = 15 days"], ans: "15 more days" },
      shortcut: "Draw a timeline. First stretch: both. Second stretch: one. Total units must add to the LCM."
    }],
    ["pattern", {
      key: "quant/time-work/alternate-days", title: "Alternate days",
      spot: "Two people work on alternate days (A on day 1, B on day 2, and so on), or two people take turns in some other fixed cycle.",
      method: ["Use LCM units and find the work done in one cycle (two days).", "See how many full cycles fit under the total, then handle the remaining work on the next day.", "Check who is working on the last partial day."],
      ex: { q: "A can finish a job in 15 days and B in 20 days. They work on alternate days, starting with A. In how many days is the job finished?", steps: ["LCM = 60 units: A = 4 per day, B = 3 per day, so one pair of days = 7 units", "8 pairs = 16 days gives 56 units, leaving 4 units", "Day 17 is A's turn and A does 4 units, finishing the job"], ans: "17 days" },
      shortcut: "Keep the remainder in mind: if the leftover is no more than the first person's daily work, the job ends on that person's turn."
    }],
    ["pattern", {
      key: "quant/time-work/m-d-h-w-m", title: "M₁D₁H₁/W₁ = M₂D₂H₂/W₂",
      spot: "Numbers of workers, days and hours per day all change, and the same type of work is done (possibly in different amounts).",
      method: ["Write men × days × hours on each side.", "Divide by the amount of work if the two jobs are different (W₁ and W₂).", "Solve for the unknown; check that fewer workers mean more days."],
      ex: { q: "18 men working 8 hours a day can complete a job in 10 days. How many days will 12 men working 6 hours a day take to complete the same job?", steps: ["Work in man-hours = 18 × 10 × 8 = 1,440", "12 men × 6 hours = 72 man-hours per day", "Days = 1,440 ÷ 72"], ans: "20 days" },
      shortcut: "Count total man-hours once, then divide by the new man-hours per day."
    }],
    ["pattern", {
      key: "quant/time-work/work-and-wages", title: "Work & wages",
      spot: "Several people work (maybe for different numbers of days) and a total payment must be shared fairly.",
      method: ["Find each person's work in LCM units (daily units × days worked).", "The ratio of units done is the ratio of wages.", "Split the total amount in that ratio."],
      ex: { q: "A and B can do a job alone in 10 and 15 days. With the help of C they finish it in 5 days, and ₹3,600 is paid for it. How should the money be shared?", steps: ["LCM = 30 units: A = 3 per day, B = 2 per day, all three together = 30/5 = 6 per day, so C = 1", "In 5 days: A = 15, B = 10, C = 5 units, ratio 3 : 2 : 1", "Shares: 1,800, 1,200 and 600"], ans: "A ₹1,800, B ₹1,200, C ₹600" },
      shortcut: "The wage ratio is the ratio of daily work when everyone works the same number of days."
    }],
    ["pattern", {
      key: "quant/time-work/a-is-twice-as-efficient", title: "\"A is twice as efficient as B\"",
      spot: "Statements such as “A is twice (or 3 times) as efficient as B”, “A takes 20 days less than B”, “A is 50% more efficient than B”.",
      method: ["Convert the efficiency ratio into a days ratio, which is the reverse.", "Use the day-difference (or the combined time) to find the part value.", "Then compute the combined time from the two single times."],
      ex: { q: "A is 3 times as efficient as B, and A can do a job in 20 days less than B. How long will they take working together?", steps: ["Efficiency 3 : 1 means days 1 : 3. Let A = x days and B = 3x days", "Difference: 3x − x = 20, so x = 10: A takes 10 days, B takes 30 days", "Together: 10 × 30 / (10 + 30) = 300/40"], ans: "7.5 days" },
      shortcut: "A is 3 times as efficient: together they make 4 units of B's work per day, so the time is B's time ÷ 4 = 30/4 = 7.5."
    }],
    ["pattern", {
      key: "quant/time-work/men-women-and-children-groups", title: "Men, women & children groups",
      spot: "Groups of men, women and children share work, with a given relation like “1 man = 2 women” or “3 men = 5 women”.",
      method: ["Convert every group into one common unit (all women, say).", "Find the total work in those units × days.", "Divide by the new group's units per day."],
      ex: { q: "5 men and 4 women can finish a job in 12 days. A man does as much work in a day as 2 women. How many days will 3 men and 6 women take?", steps: ["In women: 5 men = 10 women, so first group = 14 women", "Work = 14 × 12 = 168 woman-days", "Second group = 3 men + 6 women = 6 + 6 = 12 women, so days = 168 ÷ 12"], ans: "14 days" },
      shortcut: "Same work, so days are inversely proportional to group size: 12 days × 14/12 = 14 days."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Averaging the days:** two people together are faster than either alone. Never average their days.",
      "**Adding days instead of rates:** the rates add, not the days.",
      "**Wrong efficiency direction:** twice as efficient means half the days, not double.",
      "**Wages by days:** split wages by work done. If one person works fewer days, their share is smaller.",
      "**LCM units not total:** after picking the LCM as the total work, remember that the units are not hours or days.",
      "**Alternate days:** the leftover work may be finished mid-way through the day. Work out who is on turn.",
      "**Men-days with different hours:** convert everything to man-hours before comparing."
    ]],
    ["warn", "A reasonableness check will catch most mistakes: the time together must be shorter than the shortest single time."],

    ["h2", "Quick check"],
    ["quiz", ["time-work-01", "time-work-02", "time-work-04", "time-work-05", "time-work-06"]]
  ]
});
BRIEFS["quant:time-work"] = "A person who finishes a job in 10 days does 1/10 of it each day, so rates add when people work together. The easiest route is the LCM method: take the LCM of the days as the total work, give everyone a whole number of units per day, and add.\n\nTogether-then-one-leaves problems are two stretches added up; alternate days are one pair of days repeated, plus a leftover. Men × days × hours stays constant for the same job. Wages are split by the work actually done, and efficiency is the opposite ratio to days.";

/* =========================================================== PIPES */
LEARN.quant.push({
  id: "pipes", group: "Arithmetic", title: "Pipes & cisterns",
  sub: "It is time and work with a tank: inlets add water, outlets and leaks take it away",
  tags: ["TCS", "Infosys", "Wipro", "Cognizant", "AMCAT", "eLitmus"],
  blocks: [
    ["h2", "The idea"],
    ["p", "Pipes and cisterns is **time and work** in disguise. A pipe that fills a tank in 6 hours fills **1/6** of it each hour. An outlet pipe or a leak does the same job in reverse, so its rate is **negative**. Add all the rates (inlets positive, outlets negative) to get the net rate, then take the reciprocal to get the time."],
    ["list", [
      "**Inlet** pipes add water, so their rate is positive.",
      "**Outlet** pipes and **leaks** remove water, so their rate is negative.",
      "**Net rate = sum of all rates.** If the net rate is positive the tank fills; if negative it empties.",
      "**LCM units** work exactly as in time and work: take the tank as LCM units and give each pipe a whole number per hour."
    ]],
    ["note", "A leak is simply a hidden outlet. “Due to a leak it takes 8 hours instead of 6” means the leak slowed the net rate; the leak's own rate is the difference."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Inlet / outlet rate", "Inlet = +1/t · Outlet = −1/t", "Fraction of the tank per hour (t = hours to fill or empty alone)"],
      ["Together", "Net = Σ rates · Time = 1 / Net", "Add inlets, subtract outlets"],
      ["Two inlets", "Time = xy / (x + y)", "Product over sum, as in time and work"],
      ["Inlet and outlet", "Time = xy / (y − x)", "x = hours to fill, y = hours to empty (y larger than x). Tank fills"],
      ["A leak", "Leak empties the full tank in xy / (y − x) hours", "x = normal fill time, y = longer time with the leak"],
      ["Closed midway", "Work done + Remaining = Tank", "Compute the first stretch at one net rate, the rest at another"],
      ["Capacity", "Capacity = Net litres per minute × Time", "When rates are in litres, the capacity is just rate × time"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**LCM first:** a tank of LCM units makes every pipe a whole number. For 6, 12 and 8 hours, use 24 units: +4, +2, −3.",
      "**Leak time:** if a pipe fills in x hours and the leak makes it y hours, the leak alone empties a full tank in x × y ÷ (y − x) hours.",
      "**Alternate opening:** work out the net units per pair of hours, find how many full pairs fit, then finish the last stretch. Watch for the tank filling in the middle of a pair.",
      "**Closed after some time:** use the combined rate for the first stretch, then only the remaining pipes for the rest. The units must add to the tank.",
      "**Rates in litres:** do not convert to fractions. Use litres per minute directly and multiply by time for capacity."
    ]],
    ["tip", "Pipes problems repeat time and work. If you are stuck, ask “what would I do if these were people?” and the same method works."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/pipes/fill-empty-together", title: "Fill / empty together",
      spot: "Several pipes (some filling, some emptying) are opened together, and the time to fill (or empty) is asked.",
      method: ["Take the tank as LCM units.", "Give inlets a positive and outlets a negative number of units per hour.", "Time = tank ÷ net units per hour."],
      ex: { q: "Inlet A fills a tank in 6 hours, inlet B in 12 hours, and outlet C empties it in 8 hours. If all three are opened together, how long to fill the empty tank?", steps: ["LCM of 6, 12, 8 = 24 units", "A = +4, B = +2, C = −3 units per hour, so net = 3", "Time = 24 ÷ 3"], ans: "8 hours" },
      shortcut: "If the net rate comes out negative, the tank will empty, not fill. Check the sign before dividing."
    }],
    ["pattern", {
      key: "quant/pipes/a-leak", title: "A leak",
      spot: "A pipe fills a tank in some time, but a leak makes it take longer. You need the leak's own time, or the other way round.",
      method: ["Take the tank as LCM units.", "Pipe = tank ÷ normal time, net = tank ÷ longer time.", "Leak = pipe − net, and its emptying time = tank ÷ leak."],
      ex: { q: "A pipe can fill a tank in 6 hours. Because of a leak at the bottom it takes 8 hours. In how many hours will the leak alone empty the full tank?", steps: ["LCM of 6 and 8 = 24 units", "Pipe = 4 per hour, net = 3 per hour, so leak = 1 per hour", "Time to empty = 24 ÷ 1"], ans: "24 hours" },
      shortcut: "x × y ÷ (y − x) = 6 × 8 ÷ 2 = 24 hours."
    }],
    ["pattern", {
      key: "quant/pipes/alternate-opening", title: "Alternate opening",
      spot: "Pipes are opened one at a time in turns (A for the first hour, B for the second, and so on), and the total time is required.",
      method: ["Find the net units gained in one complete cycle of pipes.", "Divide to see how many full cycles fit before the last stretch.", "In the final stretch, check whether the tank fills during the first pipe's turn."],
      ex: { q: "Pipe A can fill a tank in 12 hours and pipe B can empty it in 18 hours. They are opened alternately for one hour each, starting with A. How long does the tank take to fill?", steps: ["LCM of 12 and 18 = 36 units: A = +3, B = −2, so each pair of hours gains 1 unit", "After 66 hours (33 pairs) the level is 33 units, and 3 units are still needed", "The next hour is A's turn and A adds 3 units, so the tank is full in hour 67"], ans: "67 hours" },
      shortcut: "Do not multiply 36 pairs by 2 blindly. The tank fills during A's turn before the pair is over, so stop at the right hour."
    }],
    ["pattern", {
      key: "quant/pipes/closed-after-some-time", title: "Closed after some time",
      spot: "Pipes are opened together, then one is closed (or opened) after a given time, and the total time is asked.",
      method: ["Use LCM units.", "Work done in the first stretch = hours × combined rate.", "Remaining units ÷ the new combined rate = extra hours. Add the two stretches."],
      ex: { q: "Pipes A and B can fill a tank in 12 and 16 hours. Both are opened together, but B is closed after 4 hours. In how many hours is the tank full in all?", steps: ["LCM of 12 and 16 = 48 units: A = 4, B = 3, so together 7 per hour", "In 4 hours: 28 units, so 20 remain", "A alone: 20 ÷ 4 = 5 hours more, total = 4 + 5"], ans: "9 hours" },
      shortcut: "Keep a running total of units. The tank is full when the units reach the LCM."
    }],
    ["pattern", {
      key: "quant/pipes/tank-capacity-from-rates", title: "Tank capacity from rates",
      spot: "Pipe rates are given in litres per minute (or per hour), and the capacity of the tank is requested.",
      method: ["Find the net litres per minute (inlets minus outlets).", "Capacity = net rate × time to fill.", "If the rates are given as parts of the tank instead, the LCM of the times gives a capacity that makes every rate a whole number."],
      ex: { q: "A tap fills 15 litres per minute and an outlet pipe empties 9 litres per minute. With both open, the empty tank is full in 30 minutes. What is the capacity of the tank?", steps: ["Net rate = 15 − 9 = 6 litres per minute", "Capacity = 6 × 30"], ans: "180 litres" },
      shortcut: "Capacity is always net rate × time. If it is not given directly, build the net rate first."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Averaging the times:** two inlets together are faster than either alone.",
      "**Forgetting the sign of an outlet:** an emptying pipe subtracts. Adding it makes the tank fill too fast.",
      "**Using the leak's time as the net time:** a leak slows the pipe; its own emptying time is a different number.",
      "**Alternate opening stops too late:** the tank can fill during the first pipe's turn, so the answer is not always a whole number of pairs.",
      "**Mixed units:** convert minutes and hours to a common unit before adding rates.",
      "**Negative net rate:** if outlets win, the tank never fills. The question usually avoids this, but check anyway.",
      "**Closing the wrong pipe:** read which pipe stays open for the last stretch."
    ]],
    ["warn", "Always check: net units over the whole time must equal the tank's LCM units, and the leaks must be slower than the inlets for the tank to ever fill."],

    ["h2", "Quick check"],
    ["quiz", ["pipes-01", "pipes-02", "pipes-03", "pipes-05", "pipes-06"]]
  ]
});
BRIEFS["quant:pipes"] = "Pipes and cisterns is time and work with a tank. An inlet that fills in 6 hours does 1/6 of the tank an hour; an outlet or leak does the same, with a minus sign. Take the tank as the LCM of the times, give every pipe whole units per hour, add them, and divide.\n\nFor a leak, subtract the slower rate from the normal rate to find the leak's own rate. For alternate opening, find the gain in one cycle and watch for the tank filling in the middle of a cycle. For capacity in litres, it is simply the net rate multiplied by the time.";

/* =========================================================== TSD */
LEARN.quant.push({
  id: "tsd", group: "Arithmetic", title: "Time, speed & distance",
  sub: "One formula, many costumes: trains, boats, races, circular tracks and chases",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "AMCAT", "eLitmus"],
  blocks: [
    ["h2", "The idea"],
    ["p", "Everything here comes from one relation: **Distance = Speed × Time**. Trains, boats, races and chases are the same relation with a different story attached. The skill is deciding **which distance** and **which speed** to use. For two moving things, that usually means the **relative speed**."],
    ["list", [
      "**Keep units consistent:** distance in km with speed in km/h and time in hours, or metres with m/s and seconds. Convert with × 5/18 (km/h to m/s) or × 18/5 (m/s to km/h).",
      "**Relative speed:** things moving towards each other (or in opposite directions) add speeds; things moving the same way subtract.",
      "**Same distance:** speed and time are inversely related. Twice as fast takes half the time.",
      "**A moving object has a length:** a train must cover its own length (plus anything it crosses) before it has “crossed” it."
    ]],
    ["note", "Average speed is total distance ÷ total time. It is **not** the average of the speeds, unless the times are equal."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Basic relation", "Distance = Speed × Time", "Speed = D / T, Time = D / S"],
      ["Unit conversion", "km/h × 5/18 = m/s · m/s × 18/5 = km/h", "72 km/h = 20 m/s. Divide by 3.6, multiply by 3.6 for the reverse"],
      ["Average speed (equal distances)", "2xy / (x + y)", "Harmonic mean. Equal distances at x and y"],
      ["Average speed (general)", "Total distance / Total time", "Always works; the harmonic mean is a special case"],
      ["Late / early at two speeds", "Distance = (s₁ s₂ / (s₂ − s₁)) × time difference", "Time difference in hours, speeds s₁ < s₂"],
      ["Relative speed", "Opposite: s₁ + s₂ · Same direction: s₁ − s₂", "Meeting time = distance apart / relative speed"],
      ["Train crossing a pole or man", "Time = Length / Speed", "A standing object has no length that matters"],
      ["Train crossing a platform or bridge", "Time = (Train + Platform) / Speed", "Total distance = train length + platform length"],
      ["Two trains", "Time = (L₁ + L₂) / relative speed", "Add speeds if opposite, subtract if same direction"],
      ["Boats and streams", "Down = u + v · Up = u − v · u = (D + U)/2 · v = (D − U)/2", "u = boat in still water, v = stream"],
      ["Races", "Same time: distances in the ratio of speeds", "Head start = speed difference × time"],
      ["Circular track", "Meet time = Length / relative speed", "Opposite: sum of speeds. Same direction: difference"],
      ["Chase", "Time = Gap / (Speed of chaser − Speed of runner)", "Distance caught = chaser's speed × time"],
      ["Stoppages", "Stoppage per hour = (Lost km / Speed without stops) × 60 min", "Lost km = speed without stops − speed with stops"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**Convert first:** 54 km/h = 15 m/s (÷ 3.6). Memorise a few: 36 → 10, 54 → 15, 72 → 20, 90 → 25.",
      "**Equal distances:** use 2xy/(x + y). 30 km/h one way and 20 km/h back gives 2 × 30 × 20/50 = 24 km/h. If the times are equal, then the average is simple.",
      "**Same distance, speed ratio a : b:** time ratio is b : a. Differences in time then scale with the ratio parts.",
      "**Trains:** pole / man: length only. Platform / bridge: length + platform. Two trains: sum of lengths over relative speed.",
      "**Boats:** the boat's still-water speed is half the sum of downstream and upstream, and the stream is half their difference.",
      "**Races:** when A beats B by 100 m in a 1,000 m race, A runs 1,000 while B runs 900. Chain these ratios for three runners.",
      "**Circular track:** the first meeting after a start from the same point takes length ÷ relative speed.",
      "**Stoppages:** the minutes lost per hour = the speed lost ÷ speed without stops × 60."
    ]],
    ["tip", "Always say out loud what the distance is in the question: “the train travels its length plus the bridge” or “the chaser must close the gap”. Half the mistakes are the wrong distance."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/tsd/basics-and-km-h-m", title: "Basics & km/h ↔ m/s",
      spot: "Speed, time and distance with mixed units, or a plain conversion between km/h and m/s.",
      method: ["Pick one unit system (metres and seconds or km and hours).", "Convert the speed with × 5/18 (to m/s) or × 18/5 (to km/h).", "Apply D = S × T."],
      ex: { q: "A cyclist rides at 90 km/h. Convert this to m/s and find the distance covered in 12 seconds.", steps: ["90 × 5/18 = 25 m/s", "Distance = 25 × 12"], ans: "25 m/s and 300 m" },
      shortcut: "Divide by 3.6 to go from km/h to m/s. 90 ÷ 3.6 = 25."
    }],
    ["pattern", {
      key: "quant/tsd/average-speed", title: "Average speed (equal distances)",
      spot: "A journey goes one way at one speed and returns (or covers the second half) at another speed.",
      method: ["Check that the two distances are equal.", "Use 2xy/(x + y), or total distance ÷ total time.", "The result is always nearer the slower speed."],
      ex: { q: "A man goes from A to B at 30 km/h and comes back at 20 km/h. What is his average speed for the whole trip?", steps: ["Equal distances, so average = 2xy/(x + y)", "= 2 × 30 × 20/(30 + 20) = 1,200/50"], ans: "24 km/h" },
      shortcut: "More time is spent at the slower speed, so the average is below the simple mean of 25."
    }],
    ["pattern", {
      key: "quant/tsd/late-early-at-two-speeds", title: "Late / early at two speeds",
      spot: "A person is late at one speed and early (or on time) at another, and the distance or the usual time is asked.",
      method: ["Write the distance as the same quantity in both cases.", "Time at the slow speed − time at the fast speed = total difference (late + early).", "Solve D/s₁ − D/s₂ = difference."],
      ex: { q: "A student walking at 4 km/h reaches school 10 minutes late. Walking at 5 km/h, he reaches 5 minutes early. How far is the school?", steps: ["Difference in time = 10 + 5 = 15 min = 1/4 hour", "D/4 − D/5 = 1/4, so D/20 = 1/4", "D = 5 km"], ans: "5 km" },
      shortcut: "D = (s₁ s₂ / (s₂ − s₁)) × difference = (20 / 1) × 1/4 = 5 km."
    }],
    ["pattern", {
      key: "quant/tsd/relative-speed", title: "Relative speed",
      spot: "Two objects move towards, away from, or after each other, and you need the time to meet, the gap, or a speed.",
      method: ["Opposite directions: add the speeds. Same direction: subtract them.", "Time = distance ÷ relative speed.", "For the meeting point, multiply each speed by the time."],
      ex: { q: "Two towns are 300 km apart. Two cars start at the same time from the two towns towards each other at 55 km/h and 45 km/h. When do they meet, and how far from the first town?", steps: ["Relative speed = 55 + 45 = 100 km/h", "Time = 300/100 = 3 hours", "Distance from the first town = 55 × 3"], ans: "After 3 hours, 165 km from the first town" },
      shortcut: "The distance each covers is in the ratio of the speeds: 55 : 45 = 11 : 9 of 300, so 165 : 135."
    }],
    ["pattern", {
      key: "quant/tsd/trains-pole-man", title: "Trains: pole / man",
      spot: "A train passes a pole, a tree, a signal or a standing man. Only the train's own length matters.",
      method: ["Distance = length of the train.", "Convert the speed to m/s when length is in metres.", "Time = length ÷ speed, or speed = length ÷ time."],
      ex: { q: "A train 240 m long passes a pole in 16 seconds. What is its speed in km/h?", steps: ["Speed = 240/16 = 15 m/s", "In km/h: 15 × 18/5 = 54"], ans: "54 km/h" },
      shortcut: "m/s × 3.6 gives km/h. 15 × 3.6 = 54."
    }],
    ["html", SVG_PLATFORM],
    ["pattern", {
      key: "quant/tsd/trains-platform-bridge", title: "Trains: platform / bridge",
      spot: "A train crosses a platform, a bridge or a tunnel. Both lengths count.",
      method: ["Distance = train length + platform length.", "Speed = total distance ÷ time (in m/s).", "Convert to km/h if asked."],
      ex: { q: "A 150 m long train crosses a 250 m long platform in 20 seconds. What is the speed of the train in km/h?", steps: ["Distance = 150 + 250 = 400 m", "Speed = 400/20 = 20 m/s", "In km/h: 20 × 18/5 = 72"], ans: "72 km/h" },
      shortcut: "Crossing a platform takes (L + P)/S. Crossing a pole takes L/S. Their time difference gives P/S."
    }],
    ["pattern", {
      key: "quant/tsd/trains-two-trains", title: "Trains: two trains",
      spot: "Two trains cross each other, going in opposite directions or in the same direction. The time to cross is asked, or a speed or length is.",
      method: ["Distance = sum of the two lengths.", "Relative speed: add if opposite, subtract if same direction.", "Time = total length ÷ relative speed (in m/s)."],
      ex: { q: "Two trains 120 m and 180 m long run at 54 km/h and 36 km/h on parallel tracks in opposite directions. How long do they take to cross each other? How long if they move in the same direction?", steps: ["Total length = 120 + 180 = 300 m", "Opposite: 54 + 36 = 90 km/h = 25 m/s, so 300/25 = 12 s", "Same direction: 54 − 36 = 18 km/h = 5 m/s, so 300/5 = 60 s"], ans: "12 seconds (opposite) and 60 seconds (same direction)" },
      shortcut: "Convert 90 km/h to 25 m/s once (÷ 3.6) and the rest is simple division."
    }],
    ["pattern", {
      key: "quant/tsd/trains-train-and-a-walking", title: "Trains: train and a walking man",
      spot: "A train passes a man who is walking or cycling in the same direction or towards the train.",
      method: ["The man has no length, so the distance is the train's length.", "Relative speed: subtract if same direction, add if opposite.", "Convert to m/s and divide."],
      ex: { q: "A 150 m long train runs at 45 km/h. A man walks at 9 km/h. How long does the train take to pass him if he walks in the same direction? And if he walks towards the train?", steps: ["Same direction: 45 − 9 = 36 km/h = 10 m/s, so 150/10 = 15 s", "Towards the train: 45 + 9 = 54 km/h = 15 m/s, so 150/15 = 10 s"], ans: "15 seconds (same direction) and 10 seconds (towards)" },
      shortcut: "The man changes only the speed, not the distance. Put his speed with the opposite sign for the same direction."
    }],
    ["html", SVG_BOAT],
    ["pattern", {
      key: "quant/tsd/boats-and-streams", title: "Boats & streams",
      spot: "A boat goes downstream (with the current) and upstream (against it), and you must find its speed in still water, the stream's speed, or a time.",
      method: ["Downstream speed = boat + stream; upstream speed = boat − stream.", "Find each speed from distance ÷ time.", "Boat = (down + up)/2, stream = (down − up)/2."],
      ex: { q: "A boat goes 24 km downstream in 2 hours and returns the same 24 km upstream in 3 hours. Find the speed of the boat in still water and the speed of the stream.", steps: ["Downstream = 24/2 = 12 km/h, upstream = 24/3 = 8 km/h", "Boat = (12 + 8)/2 = 10 km/h", "Stream = (12 − 8)/2 = 2 km/h"], ans: "Boat 10 km/h, stream 2 km/h" },
      shortcut: "Boat is the mean of the two speeds, stream is half the gap. Same distance both ways, so the time ratio is the inverse of the speed ratio."
    }],
    ["pattern", {
      key: "quant/tsd/races-and-head-starts", title: "Races & head starts",
      spot: "“A beats B by x metres”, “A gives B a start of x metres”, or a chain of three runners.",
      method: ["When A finishes the race, B is behind by the beaten distance, so B has run (race − x).", "In the same time, distances are in the ratio of the speeds.", "For three runners, chain the ratios to compare A with C."],
      ex: { q: "In a 1,000 m race, A beats B by 100 m, and B beats C by 100 m in a 1,000 m race. By how many metres does A beat C in a 1,000 m race?", steps: ["When A runs 1,000, B runs 900", "When B runs 1,000, C runs 900. So when B runs 900, C runs 900 × 900/1,000 = 810", "When A runs 1,000, C runs 810, so A beats C by 1,000 − 810"], ans: "190 m" },
      shortcut: "Speed ratios multiply: A : B = 10 : 9, B : C = 10 : 9, so A : C = 100 : 81, which is 1,000 : 810."
    }],
    ["pattern", {
      key: "quant/tsd/circular-track-meetings", title: "Circular track meetings",
      spot: "Two people run round a circular track and you must find when (or how often) they meet.",
      method: ["Same direction: relative speed is the difference. Opposite directions: relative speed is the sum.", "The first meeting needs the faster runner to gain one full lap (same direction) or the two to cover one lap together (opposite).", "Time = track length ÷ relative speed."],
      ex: { q: "Two runners start from the same point on a 600 m circular track at 5 m/s and 7 m/s. When do they first meet if they run in the same direction? And in opposite directions?", steps: ["Same direction: relative speed = 7 − 5 = 2 m/s, so 600/2 = 300 s", "Opposite: relative speed = 7 + 5 = 12 m/s, so 600/12 = 50 s"], ans: "300 seconds (same direction) and 50 seconds (opposite directions)" },
      shortcut: "Same direction: the faster runner laps the slower one. Opposite: together they cover exactly one lap."
    }],
    ["pattern", {
      key: "quant/tsd/chase", title: "Chase (police & thief)",
      spot: "One person starts earlier or ahead, and the chaser catches up later. The catching time or distance is asked.",
      method: ["Find the gap when the chase starts (head start × speed of the runner).", "Closing speed = chaser's speed − runner's speed.", "Time to catch = gap ÷ closing speed; distance = chaser's speed × that time."],
      ex: { q: "A thief runs at 10 km/h. A policeman starts 2 hours later from the same place at 15 km/h. When and where does the policeman catch the thief?", steps: ["Gap when the policeman starts = 10 × 2 = 20 km", "Closing speed = 15 − 10 = 5 km/h, so time = 20/5 = 4 hours", "Distance = 15 × 4 = 60 km"], ans: "4 hours after the policeman starts, 60 km from the start" },
      shortcut: "Both travel the same distance in the end, so thief's time is 6 hours: 10 × 6 = 60 km, the same as the policeman's 15 × 4."
    }],
    ["pattern", {
      key: "quant/tsd/stoppages-per-hour", title: "Stoppages per hour",
      spot: "A vehicle's speed is given without and with stoppages, and the stop time per hour is asked.",
      method: ["Lost distance per hour = speed without stops − speed with stops.", "Time to cover the lost distance at the running speed = lost distance ÷ speed without stops.", "Convert that fraction of an hour to minutes."],
      ex: { q: "Without stoppages, a bus runs at 60 km/h. Including stoppages, its speed is 48 km/h. For how many minutes does the bus stop per hour?", steps: ["Lost distance per hour = 60 − 48 = 12 km", "Time to cover 12 km at 60 km/h = 12/60 = 1/5 hour", "= 12 minutes"], ans: "12 minutes per hour" },
      shortcut: "Minutes stopped = (speed lost ÷ speed without stops) × 60 = (12/60) × 60."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Mixing units:** metres with km/h gives nonsense. Convert before you divide.",
      "**Averaging two speeds:** the average speed over equal distances is 2xy/(x + y), not (x + y)/2.",
      "**Forgetting the length:** a train crossing a platform travels its own length plus the platform, not the platform alone.",
      "**Relative speed signs:** opposite directions add, same direction subtracts. Mixing them up gives the wrong time.",
      "**A man has no length:** when a train passes a man or a pole, only the train's length counts.",
      "**Boats:** the stream adds to the boat downstream and subtracts upstream. Do not average the speeds to find the boat's own speed.",
      "**Stoppages:** the stoppage time is measured against the speed without stops, not the speed with stops.",
      "**Late and early:** add the late and early times to get the total difference in times, not subtract them."
    ]],
    ["warn", "Before calculating, write the distance, the speed and the time with units. If any of the three does not match the others, convert first."],

    ["h2", "Quick check"],
    ["quiz", ["tsd-01", "tsd-02", "tsd-03", "tsd-06", "tsd-07"]]
  ]
});
BRIEFS["quant:tsd"] = "Everything in this topic is Distance = Speed × Time. The skill is choosing the right distance (a train's own length, a train plus a platform, a gap to close) and the right speed (usually a relative speed, added for opposite directions and subtracted for the same direction). Keep units matched: multiply km/h by 5/18 to get m/s.\n\nFor a round trip over equal distances use 2xy/(x + y), never the simple average. For boats, the boat is half the sum of the downstream and upstream speeds and the stream is half their difference. Races, circular tracks, chases and stoppages are all relative-speed ideas in different clothing.";
