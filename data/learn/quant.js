/* Learn pages for Quantitative Aptitude. Each topic is pushed onto LEARN.quant. */
LEARN.quant.push({
  id: "percentages", group: "Arithmetic", title: "Percentages",
  sub: "The skill behind profit, interest, data interpretation and half the numerical section",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "eLitmus"],
  blocks: [
    ["h2", "The idea"],
    ["p", "**Percent** means “out of 100”. 35% is just 35/100 = 0.35. So “35% of 240” means 0.35 × 240 = 84. Nothing more."],
    ["p", "Every percentage question has a **base** (the whole you are comparing against). Most mistakes come from using the wrong base. If a price goes from ₹80 to ₹100, the rise is measured against the **starting** value ₹80, so it is 20/80 = 25%, not 20/100."],
    ["list", [
      "**Percent vs percentage points:** if a pass rate goes from 40% to 50%, it rose by **10 percentage points**, but the pass rate itself rose by 10/40 = **25%**.",
      "**Percent ↔ fraction:** it is much faster to think “25% = 1/4” than to multiply by 0.25. Learn the small table below and most questions turn into easy fractions.",
      "**“Of” means multiply, “is” means equals:** “What percent of 80 is 20?” becomes x/100 × 80 = 20.",
      "**Percent is relative:** 10% of a big number is bigger than 50% of a small number. Always ask “10% of what?”"
    ]],
    ["note", "If you can say, in one second, which number is the base, you have already avoided most of the traps in this topic."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Percent of a number", "x% of N = x/100 × N", "x% of y = y% of x, use whichever is easier"],
      ["Percentage change", "(New − Old) / Old × 100", "Base is always the OLD value"],
      ["x% more / less (base switch)", "A is x% more than B → B is x/(100+x) × 100 % less than A", "A is x% less than B → B is x/(100−x) × 100 % more than A"],
      ["Successive changes", "a + b + ab/100", "Use the sign: rise = +, fall = −. Three changes: multiply factors"],
      ["Product constant (price × quantity)", "Reduction = x/(100+x) × 100 %", "Price falls x% → quantity can rise x/(100−x) × 100 %"],
      ["Growth / depreciation", "Final = P (1 ± r/100)ⁿ", "Same factor every year, multiplied n times"],
      ["Elections", "Valid = Total − invalid", "Winner's lead = (2p − 100)% of valid votes (p = winner's % )"],
      ["Income and savings", "Savings = Income − Expenditure", "A small difference of two big numbers: rebuild it from Income = 100"],
      ["Exam marks", "Pass mark = score + shortfall", "Two cases: (shortfall + surplus) = difference in % × Max"],
      ["Back-calculation", "Original = Final / factor", "Factor = 1 + r/100 for a rise, 1 − r/100 for a fall"]
    ]],

    ["h2", "Shortcuts"],
    ["h", "Fraction ↔ percent table (learn this cold)"],
    ["table", ["Fraction", "Percent", "Fraction", "Percent"], [
      ["1/2", "50%", "1/11", "9.09%"],
      ["1/3", "33.33%", "1/12", "8.33%"],
      ["1/4", "25%", "1/13", "7.69%"],
      ["1/5", "20%", "1/14", "7.14%"],
      ["1/6", "16.67%", "1/15", "6.67%"],
      ["1/7", "14.29%", "1/16", "6.25%"],
      ["1/8", "12.5%", "1/17", "5.88%"],
      ["1/9", "11.11%", "1/18", "5.56%"],
      ["1/10", "10%", "1/19", "5.26%"],
      ["", "", "1/20", "5%"]
    ]],
    ["list", [
      "**10% first, then adjust:** to find 35% of 240, take 10% = 24, so 30% = 72, and 5% = 12, total 84. Move the decimal for 10%, halve it for 5%, and add pieces.",
      "**Multiplying factors:** +20% is × 1.2, −20% is × 0.8, +5% is × 1.05. A rise of 20% then a fall of 20% is 1.2 × 0.8 = 0.96, a net loss of 4%.",
      "**x% of y = y% of x:** 16% of 25 is 25% of 16 = 4. Swap so that the friendlier percent comes first.",
      "**Reverse-% trick:** if a 20% rise gives ₹1,200, the original is ₹1,200 ÷ 1.2 = ₹1,000. “Divide by the factor” undoes any % change.",
      "**Reduce the fraction:** 15 out of 60 is 1/4 = 25%. Do not divide in your head with decimals."
    ]],
    ["tip", "Same percent up and down: a rise of x% followed by a fall of x% is always a loss of x²/100 %. +10% then −10% is −1%, +30% then −30% is −9%."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "quant/percentages/percent-of", title: "% of a number, and % ↔ fraction",
      spot: "“What is x% of N?”, “express a fraction as a percent”, or “if p% of A = q% of B, find A”.",
      method: ["Convert the percent into a friendly fraction or into pieces of 10% and 5%.", "Compute the pieces and add them.", "For two parts, work each one out separately and add; never merge percentages with different bases."],
      ex: { q: "Find 35% of 240 + 15% of 360.", steps: ["35% of 240: 10% = 24, so 30% = 72 and 5% = 12, giving 84", "15% of 360: 10% = 36 and 5% = 18, giving 54", "Total = 84 + 54"], ans: "138" },
      shortcut: "Build any percent from 10% (move the decimal), 5% (half of 10%) and 1% (move it twice)."
    }],
    ["pattern", {
      key: "quant/percentages/pct-change", title: "Percentage change",
      spot: "Two values are given (old and new) and the question asks “by what percent did it rise / fall?”",
      method: ["Find the change: new − old (ignore the sign for the size).", "Divide by the OLD value.", "Multiply by 100 and say whether it is an increase or a decrease."],
      ex: { q: "A salary goes from ₹24,000 to ₹27,000. What is the percentage increase?", steps: ["Change = 27,000 − 24,000 = 3,000", "3,000 / 24,000 = 1/8", "1/8 = 12.5%"], ans: "12.5%" },
      shortcut: "Write change/old as a simple fraction and use the fraction table: 3000/24000 = 1/8 = 12.5%."
    }],
    ["pattern", {
      key: "quant/percentages/base-change", title: "A is x% more than B, so B is ?% less",
      spot: "One quantity is described as x% more (or less) than another and you are asked the reverse comparison.",
      method: ["Put B = 100. Then A = 100 + x (for “more”) or 100 − x (for “less”).", "Find the gap between them (always x).", "Divide the gap by the NEW base, the one you are now comparing with."],
      ex: { q: "Ravi's salary is 60% more than Sunil's. Sunil's salary is what percent less than Ravi's?", steps: ["Sunil = 100, Ravi = 160", "Gap = 60, measured against Ravi: 60/160 × 100", "= 37.5%"], ans: "37.5%" },
      shortcut: "x/(100 + x) × 100 for “more → less”, and x/(100 − x) × 100 for “less → more”."
    }],
    ["pattern", {
      key: "quant/percentages/successive-change", title: "Successive change",
      spot: "A value changes by a%, then by b% (price rises then falls, two discounts, length and breadth both change).",
      method: ["Write each change as a signed percent (rise +, fall −).", "Use a + b + ab/100, or multiply the factors.", "For three or more changes, multiply all the factors and subtract 1."],
      ex: { q: "A price is raised by 30% and then cut by 20%. What is the net change?", steps: ["a = +30, b = −20", "Net = 30 − 20 + (30 × −20)/100 = 10 − 6", "Net = +4%"], ans: "+4% (a net rise of 4%)" },
      shortcut: "Factors: 1.3 × 0.8 = 1.04, so +4%. For area, the two lengths multiply as well."
    }],
    ["pattern", {
      key: "quant/percentages/product-constant", title: "Price × consumption constant",
      spot: "Two quantities multiply to something that must stay the same (price × quantity = spending, speed × time = distance, length × breadth = area).",
      method: ["Write the new value of the first quantity as a percent of the old one (125% for a 25% rise).", "The other quantity must become 100/125 of its old value.", "Reduction = x/(100 + x) × 100 %."],
      ex: { q: "Rice rises from ₹40 per kg to ₹50 per kg. A hostel used 20 kg for the same monthly budget. How many kg can it buy now?", steps: ["Budget = 40 × 20 = ₹800", "New quantity = 800 / 50", "= 16 kg"], ans: "16 kg" },
      shortcut: "25% price rise means 20% less quantity (5/4 up, so 4/5 down). Learn the pairs 25 ↔ 20, 50 ↔ 33.3, 100 ↔ 50."
    }],
    ["pattern", {
      key: "quant/percentages/growth-depreciation", title: "Population growth / depreciation",
      spot: "“Grows (or falls) by r% every year”, population after n years, value of a machine after n years.",
      method: ["Turn r% into a factor: 1 + r/100 for growth, 1 − r/100 for depreciation.", "Multiply the starting value by the factor n times (year by year is fine for n = 2 or 3).", "If the final value is given and you want the start, divide by the factor n times."],
      ex: { q: "The population of a town is 50,000 and grows by 10% every year. What is it after 2 years?", steps: ["Year 1: 50,000 × 1.1 = 55,000", "Year 2: 55,000 × 1.1 = 60,500"], ans: "60,500" },
      shortcut: "Two years at 10% is +21%, not +20%. The extra 1% is the “growth on growth”: a + b + ab/100."
    }],
    ["pattern", {
      key: "quant/percentages/elections", title: "Elections and votes",
      spot: "Votes polled, invalid votes, winner's percent of the valid votes, margin of victory.",
      method: ["Valid votes = total polled minus the invalid ones. Every later percent is of the VALID votes.", "Winner's votes = p% of valid; loser's = (100 − p)% of valid.", "Margin = winner − loser = (2p − 100)% of valid."],
      ex: { q: "25,000 votes were polled and 20% were invalid. The winner got 60% of the valid votes. By how many votes did the winner win?", steps: ["Valid votes = 80% of 25,000 = 20,000", "Margin = (60 − 40)% of 20,000 = 20% of 20,000", "= 4,000"], ans: "4,000" },
      shortcut: "Margin percent = 2p − 100. For p = 60 it is 20%, so margin = one-fifth of the valid votes."
    }],
    ["pattern", {
      key: "quant/percentages/income-savings", title: "Income, expenditure and savings",
      spot: "Income, spending percentages, savings left over, and what happens to savings when income and spending change.",
      method: ["Take income as 100 (or the real amount if given).", "Expenditure = (100 − savings%) of income, and savings = income − expenditure.", "If income and expenditure change by different percents, recompute both and subtract."],
      ex: { q: "Meena saves 20% of her income. Her income rises by 10% and her expenditure rises by 15%. By what percent does her savings change?", steps: ["Income 100 → savings 20, expenditure 80", "New income 110, new expenditure 80 × 1.15 = 92", "New savings = 110 − 92 = 18, change = (18 − 20)/20 = −10%"], ans: "−10% (savings fall by 10%)" },
      shortcut: "Savings move much more than income. Always rebuild it as income − expenditure with income = 100."
    }],
    ["pattern", {
      key: "quant/percentages/exam-marks", title: "Exam marks, pass and fail",
      spot: "Pass percentage, “failed by x marks”, “passed by y marks”, find the maximum marks.",
      method: ["Pass mark = marks scored + shortfall (or scored − surplus).", "Compare two scenarios: the gap between the two percents equals the gap between the two scores.", "Maximum marks = that mark gap × 100 / percent gap."],
      ex: { q: "Arjun scored 35% and failed by 20 marks. The pass mark is 40%. What are the maximum marks?", steps: ["Gap in percent = 40 − 35 = 5%", "5% of Max = 20 marks", "Max = 20 × 100/5 = 400"], ans: "400" },
      shortcut: "Two scenarios: Max = (shortfall + surplus) × 100 / (difference in percents). The pass mark lies between the two scores."
    }],
    ["pattern", {
      key: "quant/percentages/back-calc", title: "Back-calculating the original value",
      spot: "The final value after one or more percent changes is given and you must find the starting value.",
      method: ["Convert the change into a factor (1.2 for +20%, 0.9 for −10%).", "Multiply the factors if there are several changes.", "Divide the final value by the combined factor."],
      ex: { q: "A price is raised by 20% and then cut by 10%. It now costs ₹10,800. What was the original price?", steps: ["Factor = 1.2 × 0.9 = 1.08", "Original = 10,800 / 1.08", "= ₹10,000"], ans: "₹10,000" },
      shortcut: "To undo a change, divide by the factor. Do not “take x% off the final value”: the x% was on the old base."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Wrong base:** the percent change is measured against the starting value, not the new one. 80 to 100 is +25%, not +20%.",
      "**Adding successive percentages:** +20% then −20% is not 0%. It is −4%, because the second change acts on a different value.",
      "**Percentage vs percentage points:** 40% to 50% is +10 points but +25% relative.",
      "**“% more” vs “% of”:** 150% of B is 50% more than B. “x% more than B” is B × (1 + x/100), not B × x/100.",
      "**Symmetric thinking:** if A is 25% more than B, B is 20% less than A, not 25% less. The two use different bases.",
      "**Population back-calculation:** to find last year's value, divide by the factor (1.1); do not multiply by 0.9. Subtracting x% of the final value gives the wrong answer.",
      "**Invalid votes:** percentages of votes refer to valid votes, so remove the invalid ones first.",
      "**Savings:** savings is a difference. A 10% rise in income does not give a 10% rise in savings."
    ]],
    ["warn", "Always ask three questions before calculating: What is the base? Is it a rise or a fall? Is the answer a percent, an amount, or a count?"],

    ["h2", "Quick check"],
    ["quiz", ["pct-of-01", "pct-change-02", "pct-succ-03", "pct-elect-02", "pct-back-04"]]
  ]
});
