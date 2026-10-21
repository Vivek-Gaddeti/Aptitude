/* Learn pages for Data Interpretation, part 3: Radar chart, Venn-based DI, Calculation tricks. */
window.LEARN = window.LEARN || {}; LEARN.di = LEARN.di || []; window.BRIEFS = window.BRIEFS || {};

/* Three-set Venn used in the Venn lesson: numbers are the seven regions plus "none" (120 students in all). */
var DI3_VENN = (function () {
  var g = '<g stroke="currentColor" fill="none" stroke-width="1.5"><circle cx="130" cy="110" r="80"/><circle cx="230" cy="110" r="80"/><circle cx="180" cy="190" r="80"/><rect x="2" y="2" width="356" height="296" rx="6" stroke-opacity=".4"/></g>';
  var t = '<g fill="currentColor" font-size="15" text-anchor="middle" font-family="sans-serif">' +
    '<text x="90" y="95">22</text><text x="270" y="95">18</text><text x="180" y="240">15</text><text x="180" y="82">12</text><text x="133" y="172">8</text><text x="227" y="172">10</text><text x="180" y="138">5</text>' +
    '<text x="50" y="28" font-weight="bold">Python</text><text x="310" y="28" font-weight="bold">Java</text><text x="310" y="282" font-weight="bold">SQL</text><text x="52" y="270" font-size="13">None: 30</text></g>';
  return '<svg viewBox="0 0 360 300" width="100%" style="max-width:380px;display:block;margin:0 auto" role="img" aria-label="Venn diagram of Python, Java and SQL learners: only Python 22, only Java 18, only SQL 15, Python and Java only 12, Python and SQL only 8, Java and SQL only 10, all three 5, none 30">' + g + t + '</svg>';
})();

LEARN.di.push({
  id: "di-radar", group: "Chart types", title: "Radar chart",
  sub: "Values around a circle: reading spokes, comparing two shapes and doing the usual DI arithmetic on them",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "eLitmus"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A **radar chart** (also called a spider or web chart) puts each category on its own **spoke**, like the spokes of a wheel, all starting from the centre. The further out a point lies along its spoke, the bigger the value. Joining the points gives a closed shape. With two series you get two shapes, and the question is usually about where one shape sticks out beyond the other."],
    ["p", "Nothing about the arithmetic is special. Once you have read the values off the spokes, every question is an ordinary percentage, ratio, average or growth problem. The only new skill is **reading** accurately, because the rings are not always labelled at every point."],
    ["chart", { type: "radar", labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], series: [{ name: "Sales (₹ lakh)", data: [40, 52, 48, 60, 64, 60] }], unit: "Monthly sales, ₹ lakh" }, "Sales of a store over six months. Each spoke is a month, and the rings are equally spaced."],
    ["list", [
      "**Spokes are categories, rings are the scale.** The rings are equally spaced, starting from 0 at the centre. Find the value of the outer ring first.",
      "**Read the point, not the area.** The size of the shape looks impressive but the question is about the length along one spoke.",
      "**The spoke order means nothing** unless the categories are months or years. A bigger \"corner\" is not a trend.",
      "**Two series:** compare the two points on the same spoke. Where the outer shape is the larger series, that category has the higher value."
    ]],
    ["note", "If values are printed at the points, use them. If not, judge each point as a fraction of the distance between two rings and write the number down before you calculate."],

    ["h2", "Formulas"],
    ["formulas", [
      ["% change", "(new − old) ÷ old × 100", "Divide by the old value, not the new one"],
      ["Share of total", "value ÷ sum of all spokes × 100", "Add all spokes first"],
      ["Average", "sum of the spokes ÷ number of spokes", "Count the spokes, do not guess"],
      ["Ratio of two values", "a : b, cancelled to lowest terms", "64 : 40 = 8 : 5"],
      ["Profit", "income − expense (same spoke)", "Two series, one spoke at a time"],
      ["Profit %", "profit ÷ expense × 100", "On cost price unless told otherwise"],
      ["CAGR", "(end ÷ start)^(1/n) − 1", "n is the number of intervals, not the number of points"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**Write the data in a mini table first.** Spend 20 seconds turning the spokes into a row of numbers. Every later question then becomes arithmetic on that row.",
      "**Average by deviation:** pick a round base near the middle (50) and add only the differences: −10, +2, −2, +10, +14, +10 = +24, and 24 ÷ 6 = 4, so the average is 54.",
      "**Above-average count:** find the average once, then tick every spoke longer than it. You do not need exact differences.",
      "**Two-series comparison:** the gap between two shapes on a spoke is the profit, the surplus or the difference. Write all the gaps in one line.",
      "**Sum before share:** for a share question, add the spokes once and reuse the total for every part of the question."
    ]],
    ["tip", "Check the unit and the ring label before anything else. A radar in ₹ crore and a radar in ₹ lakh look the same."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "di/di-radar/direct-read", title: "Direct read",
      spot: "“What is the value for March?”, “which spoke has the value 48?”, “how many categories exceed 50?”.",
      method: ["Find the category spoke named in the question.", "Read the printed label, or read the point against the rings.", "Check the unit in the caption before you answer."],
      ex: { q: "In the sales radar above, in how many months were sales more than ₹ 50 lakh?", steps: ["Values: Jan 40, Feb 52, Mar 48, Apr 60, May 64, Jun 60", "Months above 50: Feb, Apr, May, Jun"], ans: "4 months" },
      shortcut: "Count against the ring, not by eye: a point just past the 50 ring is above 50 even if it looks small."
    }],
    ["pattern", {
      key: "di/di-radar/pct-change-growth", title: "% change / growth",
      spot: "“By what percent did sales rise from January to May?”, “percentage increase between two spokes”.",
      method: ["Read the old and the new value.", "Subtract to get the change.", "Divide the change by the old value and multiply by 100."],
      ex: { q: "By what percent are May sales above January sales?", steps: ["Change = 64 − 40 = 24", "24 ÷ 40 = 0.6", "0.6 × 100 = 60%"], ans: "60%" },
      shortcut: "The ratio 64 : 40 = 1.6 already tells you the answer: 1.6 means +60%. Ratio minus 1 is the growth."
    }],
    ["pattern", {
      key: "di/di-radar/ratio-of-two-values", title: "Ratio of two values",
      spot: "“Ratio of sales in May to sales in January”, “what is the ratio of A to B”.",
      method: ["Read both values in the order the question gives.", "Write them as a : b.", "Cancel the common factor."],
      ex: { q: "Find the ratio of May sales to January sales.", steps: ["May : Jan = 64 : 40", "Both divide by 8", "= 8 : 5"], ans: "8 : 5" },
      shortcut: "Order matters. The first named category is the first number in the ratio."
    }],
    ["pattern", {
      key: "di/di-radar/share-of-total", title: "Share of total",
      spot: "“What percent of the six-month sales happened in May?”, “share of the total”.",
      method: ["Add all the spokes to get the total.", "Divide the required spoke by the total.", "Multiply by 100 and round as asked."],
      ex: { q: "What percent of the half-year total is May’s sales (to the nearest whole number)?", steps: ["Total = 40 + 52 + 48 + 60 + 64 + 60 = 324", "64 ÷ 324 = 0.1975", "About 19.75%, so nearly 20%"], ans: "about 20% (19.75%)" },
      shortcut: "Estimate with a round total: 64 out of 324 is a bit under 64 out of 320 = 20%."
    }],
    ["pattern", {
      key: "di/di-radar/average", title: "Average",
      spot: "“Average monthly sales”, “mean of the values on these spokes”.",
      method: ["Add the values of the spokes asked for.", "Divide by how many spokes you added."],
      ex: { q: "Find the average monthly sales for the six months.", steps: ["Sum = 324", "324 ÷ 6 = 54"], ans: "₹ 54 lakh" },
      shortcut: "Use a base of 50: the differences −10, +2, −2, +10, +14, +10 add to +24, and 24 ÷ 6 = +4, so the average is 54."
    }],
    ["pattern", {
      key: "di/di-radar/max-min-rank", title: "Max / min / rank",
      spot: "“Which month had the highest sales?”, “the second lowest”, “difference between highest and lowest”.",
      method: ["Rank the values from the largest to the smallest.", "Pick the position the question asks for.", "If they want the gap, subtract the lowest from the highest."],
      ex: { q: "Find the highest month, the lowest month and the gap between them.", steps: ["Highest: May with 64", "Lowest: Jan with 40", "Gap = 64 − 40 = 24"], ans: "May (64), Jan (40), difference 24" },
      shortcut: "Two months can tie (Apr and Jun are both 60). Watch for \"second highest\" when there is a tie."
    }],
    ["pattern", {
      key: "di/di-radar/years-above-average", title: "Years above average",
      spot: "“In how many months were sales above the six-month average?”",
      method: ["Find the average of the series.", "Compare every spoke with it.", "Count the spokes that are strictly greater."],
      ex: { q: "In how many months were sales above the average?", steps: ["Average = 54", "Above 54: Apr 60, May 64, Jun 60", "Feb 52 and Mar 48 are below"], ans: "3 months" },
      shortcut: "You only need the average roughly. If a value is within 1 or 2 of it, compute exactly, otherwise just compare."
    }],
    ["pattern", {
      key: "di/di-radar/approximate-value", title: "Approximate value",
      spot: "No numbers are printed, and the question asks for \"about\" or \"approximately\".",
      method: ["Note the value of the two rings the point lies between.", "Estimate the fraction of the way from the inner ring to the outer ring.", "Value = inner + fraction × ring gap, then use that number."],
      ex: { q: "A point lies about one-fifth of the way from the 60 ring to the 80 ring. Estimate its value.", steps: ["Ring gap = 80 − 60 = 20", "One-fifth of 20 = 4", "Value ≈ 60 + 4 = 64"], ans: "about 64" },
      shortcut: "Answer options are usually far apart, so a rough read is enough. Do not agonise over half a unit."
    }],
    ["pattern", {
      key: "di/di-radar/cagr-roughly", title: "CAGR roughly",
      spot: "A radar whose spokes are years, and the question says “compound annual growth rate”, “growth per year on average”.",
      method: ["Find end ÷ start.", "Count the number of intervals between the two years (years − 1).", "Match the ratio to a power you know: 1.1² = 1.21, 1.1³ = 1.331, 1.1⁴ = 1.464."],
      ex: { q: "Revenue (₹ crore) for 2019 to 2023 is 100, 110, 121, 133 and 146. Estimate the yearly growth rate.", steps: ["End ÷ start = 146 ÷ 100 = 1.46 over 4 intervals", "1.1⁴ = 1.4641, which is almost exactly 1.46", "Rate is about 10% a year (9.9% exactly to one decimal)"], ans: "about 10% per year" },
      shortcut: "Five points mean four intervals. Using five is the commonest mistake."
    }],
    ["chart", { type: "radar", labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], series: [{ name: "Income", data: [60, 70, 65, 80, 90, 75] }, { name: "Expense", data: [48, 55, 52, 62, 70, 60] }], unit: "₹ lakh" }, "Income and expense of the same store. The gap between the two shapes on a spoke is that month’s profit."],
    ["pattern", {
      key: "di/di-radar/combined", title: "Combined (e.g. profit from income and expense)",
      spot: "Two series on the same spokes, and the question asks for profit, surplus, total or a ratio built from both.",
      method: ["Pair the two values on each spoke.", "Subtract (income − expense) to get the profit on each spoke.", "Add or compare those profits, then work out a percent if asked."],
      ex: { q: "Using the income and expense radar, find the total profit for six months and the overall profit percent on income.", steps: ["Profit per month: 12, 15, 13, 18, 20, 15", "Total profit = 93", "Total income = 440, so profit on income = 93 ÷ 440 × 100 = 21.1%", "Total expense = 347, so profit on expense = 26.8%"], ans: "₹ 93 lakh, 21.1% of income" },
      shortcut: "Add the whole series first: total income − total expense gives the total profit in one subtraction (440 − 347 = 93)."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Reading the wrong ring scale:** the outer ring is not always 100. Look at the labels.",
      "**Dividing by the new value** in a % change question. Always divide by the old value.",
      "**CAGR with the wrong n:** five years of points means four growth steps.",
      "**Mixing two series:** read the income and expense for the same spoke, not neighbouring ones.",
      "**Judging by area:** a shape that looks larger overall can still be smaller on the spoke you are asked about.",
      "**Ties in ranking:** two equal spokes both take the same rank."
    ]],
    ["warn", "Before any arithmetic, write the values as a short row of numbers. Almost every radar mistake is a misread spoke."],

    ["h2", "Quick check"],
    ["quiz", ["di-radar-01", "di-radar-03", "di-radar-05", "di-radar-07", "di-radar-09"]]
  ]
});
BRIEFS["di:di-radar"] = "A radar chart puts each category on a spoke, with the length along the spoke showing the value. With two series, the gap between the two shapes on a spoke is the difference, such as profit. The real skill is reading each spoke accurately, because everything after that is ordinary percentage, ratio and average work.\n\nStart by copying the values into a short row of numbers and check the unit. Then handle the usual question types: growth, ratio, share of total, average, above-average counts and rough CAGR. Use end ÷ start and count intervals, not points, for growth rate.";

LEARN.di.push({
  id: "di-venn", group: "Chart types", title: "Venn-based DI",
  sub: "Overlapping circles as data: regions, \"exactly\" versus \"at least\", and the usual DI arithmetic on them",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "eLitmus"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A **Venn-based DI** set gives you overlapping circles with a number written in each region. Each number counts people (or items) in exactly that region and nowhere else. The questions then ask you to add some regions together and apply a percentage, ratio, average or growth step."],
    ["p", "The whole skill is **choosing the right regions**. \"Plays Python\" means four regions (the whole circle), \"only Python\" means one, and \"Python or Java\" means everything inside either circle."],
    ["html", DI3_VENN],
    ["p", "*Students learning Python, Java and SQL. The numbers are the students in each region, and 30 students are outside all three circles, so the total is 120.*"],
    ["list", [
      "**Region numbers do not overlap.** The 22 in \"only Python\" is not inside the 12 of \"Python and Java only\". You can add regions directly.",
      "**A whole circle** is the sum of every region inside it. Python = 22 + 12 + 8 + 5 = 47.",
      "**\"None\" sits outside the circles** but inside the box. Include it when the question talks about the total group.",
      "**Check the stem:** is the number in a region, or is it the total for a whole circle? The caption tells you."
    ]],
    ["note", "In this lesson every number written in the diagram is for that region alone. Some papers give circle totals instead; then the regions have to be rebuilt by subtraction."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Union of two sets", "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)", "The overlap is counted twice, so subtract once"],
      ["Union of three sets", "A + B + C − AB − BC − CA + ABC", "Here AB means everyone in A and B, including all three"],
      ["Exactly one", "sum of the three \"only\" regions", "22 + 18 + 15 = 55"],
      ["Exactly two", "sum of the three pair-only regions", "12 + 8 + 10 = 30"],
      ["At least one", "total − none", "120 − 30 = 90"],
      ["Total", "all seven regions + none", "The box holds everything"],
      ["Percent of a group", "region(s) ÷ group × 100", "Choose the denominator carefully"]
    ]],

    ["h2", "Shortcuts"],
    ["table", ["Phrase", "Regions to add", "Count in the diagram"], [
      ["Only Python", "just that region", "22"],
      ["Python (any)", "all 4 regions in the circle", "22 + 12 + 8 + 5 = 47"],
      ["Python and Java", "pair-only + the middle", "12 + 5 = 17"],
      ["Python and Java but not SQL", "pair-only region", "12"],
      ["Exactly two languages", "three pair-only regions", "30"],
      ["At least two languages", "exactly two + all three", "35"],
      ["Python or Java", "47 + 45 − 17", "75"],
      ["None of them", "outside the circles", "30"]
    ]],
    ["list", [
      "**Colour the regions before adding:** put a tick on each region the phrase includes, then add the ticked numbers.",
      "**\"Or\" means union.** Do not add two circle totals without subtracting the overlap.",
      "**Use complements:** the number who do not know Python = 120 − 47 = 73 is quicker than adding five regions.",
      "**Sanity check:** the seven regions plus none must equal the stated total."
    ]],
    ["tip", "Underline the key word in the question: only, exactly, at least, at most, none. Each one points to a different set of regions."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "di/di-venn/direct-read", title: "Direct read",
      spot: "“How many learn only Java?”, “how many learn exactly two languages?”, “how many know all three?”.",
      method: ["Translate the phrase into regions (only, pair, all three, whole circle).", "Read the numbers in those regions.", "Add them."],
      ex: { q: "How many students learn exactly two of the three languages, and how many learn at least one?", steps: ["Exactly two = 12 + 8 + 10 = 30", "Everyone outside \"none\" learns at least one: 22 + 18 + 15 + 12 + 8 + 10 + 5 = 90, or 120 − 30"], ans: "30 students; 90 students" },
      shortcut: "At least one is always total minus none."
    }],
    ["pattern", {
      key: "di/di-venn/pct-change-growth", title: "% change / growth",
      spot: "Two circle totals compared (“Python learners are what percent more than SQL learners?”), or a count that rises or falls.",
      method: ["Work out the two totals from their regions.", "Subtract to get the change.", "Divide by the base the question names (the \"than\" quantity) and multiply by 100."],
      ex: { q: "Python learners (47) are what percent more than SQL learners (38)?", steps: ["Difference = 47 − 38 = 9", "9 ÷ 38 = 0.2368", "About 23.7% more"], ans: "about 23.7%" },
      shortcut: "The base is whatever follows \"than\" or \"of\": here 38. Swapping the base gives a different answer (9 ÷ 47 = 19.1%)."
    }],
    ["pattern", {
      key: "di/di-venn/ratio-of-two-values", title: "Ratio of two values",
      spot: "“Ratio of those who learn only Python to those who learn only SQL”, “exactly two to all three”.",
      method: ["Find the number for each group from the correct regions.", "Write them in the order asked as a : b.", "Cancel to the lowest terms."],
      ex: { q: "Find the ratio of students who learn exactly two languages to those who learn all three.", steps: ["Exactly two = 30, all three = 5", "30 : 5", "= 6 : 1"], ans: "6 : 1" },
      shortcut: "Add the regions before you build the ratio, never ratio the regions one by one."
    }],
    ["pattern", {
      key: "di/di-venn/share-of-total", title: "Share of total",
      spot: "“What percent of all students know all three?”, “what percent learn none?”.",
      method: ["Count the group asked for.", "Decide the denominator: the whole box (120), or only those in the circles (90).", "Divide and multiply by 100."],
      ex: { q: "What percent of the 120 students learn exactly one language?", steps: ["Exactly one = 22 + 18 + 15 = 55", "55 ÷ 120 = 0.4583", "About 45.8%"], ans: "about 45.8%" },
      shortcut: "For 120, each 1.2 students is 1%. For 5 out of 120: 5 ÷ 120 = 4.17%."
    }],
    ["pattern", {
      key: "di/di-venn/average", title: "Average",
      spot: "“Average number of students per language”, “average of the exactly-two regions”.",
      method: ["Find the total of each group involved (use whole-circle totals for per-language averages).", "Add them.", "Divide by the number of groups."],
      ex: { q: "What is the average number of students per language (counting each language’s full circle)?", steps: ["Python 47, Java 18 + 12 + 10 + 5 = 45, SQL 15 + 8 + 10 + 5 = 38", "Sum = 130", "130 ÷ 3 = 43.3"], ans: "about 43.3 students" },
      shortcut: "The sum 130 is larger than 90 because multi-language students are counted once for each language."
    }],
    ["pattern", {
      key: "di/di-venn/max-min-rank", title: "Max / min / rank",
      spot: "“Which language has the most learners?”, “which region is the smallest?”.",
      method: ["Compute the total for every circle, or list every region.", "Order them from the largest.", "Pick the rank asked."],
      ex: { q: "Rank the languages by total learners and name the smallest region.", steps: ["Python 47, Java 45, SQL 38", "Order: Python, Java, SQL", "Regions are 22, 18, 15, 12, 8, 10, 5, so the smallest is the middle (all three) with 5"], ans: "Python > Java > SQL; smallest region 5" },
      shortcut: "A circle can lead on totals even when its \"only\" region is not the largest. Compare totals for a language, regions for a region."
    }],
    ["pattern", {
      key: "di/di-venn/years-above-average", title: "Years above average",
      spot: "“How many regions have more students than the average region?”, or a version with circles in place of the years.",
      method: ["Add the regions asked about and divide by their number.", "Compare each region with the average.", "Count those above."],
      ex: { q: "The seven regions inside the circles hold 22, 18, 15, 12, 8, 10, 5. How many regions are above their average?", steps: ["Sum = 90, average = 90 ÷ 7 = 12.86", "Above: 22, 18, 15", "12 is just below, so it does not count"], ans: "3 regions" },
      shortcut: "Watch values close to the average (12 versus 12.86). Compare exactly, do not round the average to 13 and then count 12 as equal."
    }],
    ["pattern", {
      key: "di/di-venn/approximate-value", title: "Approximate value",
      spot: "“About what percent …” where options are far apart.",
      method: ["Add the right regions.", "Round both numerator and denominator to friendly numbers.", "Divide quickly."],
      ex: { q: "Approximately what percent of all 120 students learn Python?", steps: ["Python = 47", "47 is close to 48, and 48 ÷ 120 = 40%", "47 is slightly less, so about 39%"], ans: "about 39% (39.2%)" },
      shortcut: "For a total of 120, 12 students is 10%, so 47 is just under 4 × 12 = 48, which is 40%."
    }],
    ["pattern", {
      key: "di/di-venn/cagr-roughly", title: "CAGR roughly",
      spot: "A Venn total compared with the same total some years earlier, with “average yearly growth”.",
      method: ["Take the end total and the start total.", "Divide end by start.", "Compare with 1.1ⁿ, 1.05ⁿ or 1.2ⁿ for n years."],
      ex: { q: "Python learners grew from 35 three years ago to 47 now. Roughly, what is the yearly growth rate?", steps: ["47 ÷ 35 = 1.343 over 3 years", "1.1³ = 1.331, which is very close", "So the rate is about 10% a year"], ans: "about 10% per year" },
      shortcut: "Total growth 34% over 3 years is a bit more than 3 × 10% = 30%, because of compounding. That is the check for 10%."
    }],
    ["pattern", {
      key: "di/di-venn/combined", title: "Combined (e.g. profit from income and expense)",
      spot: "Each region has a different price, fee or weight, and the question asks for total money or an average per head.",
      method: ["Group the regions by the rate they pay.", "Multiply each group’s count by its rate.", "Add, then divide by the number of people if the question wants an average."],
      ex: { q: "A coaching fee is ₹ 2,000 for one language, ₹ 3,500 for exactly two and ₹ 4,500 for all three. Find the total fee and the average fee per paying student.", steps: ["Exactly one: 55 × 2,000 = ₹ 1,10,000", "Exactly two: 30 × 3,500 = ₹ 1,05,000", "All three: 5 × 4,500 = ₹ 22,500", "Total = ₹ 2,37,500 from 90 students, so average = 2,37,500 ÷ 90 = ₹ 2,639 (about)"], ans: "₹ 2,37,500; about ₹ 2,639 per student" },
      shortcut: "Do not charge the 30 students who learn nothing. Divide by 90, the paying group, not by 120."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Double counting:** adding two whole circles without taking away the overlap.",
      "**Confusing \"only\" with the whole circle.** Only Python is 22, Python is 47.",
      "**Forgetting the \"none\" region** in a total, or including it in an \"at least one\" count.",
      "**Wrong denominator:** the 120-student box, or the 90 who learn something. Read the sentence.",
      "**\"Exactly two\" versus \"at least two\":** the second also includes the middle region.",
      "**Using the middle region as part of a pair-only number:** the 12 does not include the 5."
    ]],
    ["warn", "Tick the regions on paper before you add. The wrong answers in Venn sets are built from the regions people forget."],

    ["h2", "Quick check"],
    ["quiz", ["di-venn-01", "di-venn-03", "di-venn-05", "di-venn-07", "di-venn-09"]]
  ]
});
BRIEFS["di:di-venn"] = "A Venn-based DI set gives you overlapping circles with a number in each region, and each number belongs to that region only. The whole skill is translating a phrase such as only, exactly two or at least one into the right set of regions, then adding them. At least one is always total minus none.\n\nAfter that the questions are normal DI: a percent of the total, a ratio of two groups, an average per language or a rough growth rate. Tick the regions on paper, choose the denominator carefully, and never add two whole circles without removing the overlap.";

LEARN.di.push({
  id: "di-tricks", group: "Calculation tricks", title: "Calculation tricks",
  sub: "Faster arithmetic for DI sets: fraction tables, rounding, quick % change, cross-multiplying, rough CAGR and mental products",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "eLitmus", "Banking"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A DI set has 4 to 6 questions and perhaps 8 to 10 minutes. The data is easy to read, so the time goes on **arithmetic**. Long division and exact multiplication are the slowest part of the paper and the main source of slips. The fix is to do less exact arithmetic: round sensibly, use fractions you already know, and compare numbers without dividing them out."],
    ["p", "Most DI options are spread far enough apart that an answer within about 1% is enough to choose. This lesson gives you the tools that make that possible. Each one is practised on a real calculation."],
    ["list", [
      "**Convert to a fraction you know.** 12.5% is 1/8, 16.67% is 1/6, 37.5% is 3/8. A fraction is easier than a decimal.",
      "**Round, then correct.** Round to friendly numbers, then decide whether the true answer is slightly higher or lower.",
      "**Compare by cross-multiplying,** never by dividing.",
      "**Estimate first, calculate second.** If the options differ widely, the estimate is the answer."
    ]],
    ["note", "Tricks are for questions with spaced options. If two options are within 1% of each other, do the exact calculation."],

    ["h2", "Rules"],
    ["formulas", [
      ["% change", "(new − old) ÷ old", "Split into 10%, 5%, 1% chunks of the old value"],
      ["Successive changes", "+a% then +b% → a + b + ab/100", "+20% then −20% is −4%, not 0"],
      ["Compare a/b and c/d", "a × d versus c × b", "Larger cross-product on the side of the larger fraction"],
      ["Growth factor", "(1 + r)ⁿ = end ÷ start", "1.1² = 1.21, 1.1³ = 1.331, 1.1⁴ = 1.464"],
      ["Average by deviation", "base + (sum of deviations ÷ count)", "Choose a base near the middle"],
      ["Square ending in 5", "n5² = n(n + 1) followed by 25", "85² = 8 × 9 = 72, then 25 → 7225"],
      ["Difference of squares", "(a + b)(a − b) = a² − b²", "104 × 96 = 100² − 4² = 9984"]
    ]],

    ["h2", "Shortcuts"],
    ["h", "Fraction and percentage table"],
    ["table", ["Fraction", "Percent", "Fraction", "Percent"], [
      ["1/2", "50%", "1/9", "11.11%"],
      ["1/3", "33.33%", "1/10", "10%"],
      ["1/4", "25%", "1/11", "9.09%"],
      ["1/5", "20%", "1/12", "8.33%"],
      ["1/6", "16.67%", "1/13", "7.69%"],
      ["1/7", "14.29%", "1/14", "7.14%"],
      ["1/8", "12.5%", "1/15", "6.67%"],
      ["3/8", "37.5%", "1/16", "6.25%"],
      ["5/8", "62.5%", "1/20", "5%"],
      ["7/8", "87.5%", "1/25", "4%"]
    ]],
    ["p", "Learn 1/2 to 1/16 once. Every other fraction is a multiple: 5/7 = 5 × 14.29% = 71.4%, and 7/12 = 7 × 8.33% = 58.3%. Learn also the inverse: if the question says \"16.67% of\", just divide by 6."],
    ["chart", { type: "bar", labels: ["1/3", "1/4", "1/5", "1/6", "1/8", "1/10"], series: [{ name: "Percent", data: [33.3, 25, 20, 16.7, 12.5, 10] }], unit: "% equivalent" }, "The common unit fractions as percentages. Reading the picture backwards: if a bar chart’s bar is a quarter of the total, it is 25%."],
    ["list", [
      "**Round to one or two significant figures.** 6,23,418 ÷ 24,950 becomes 6,24,000 ÷ 25,000.",
      "**Spot a friendly multiple:** dividing by 25 is multiplying by 4 and moving two places; dividing by 5 is doubling and moving one place.",
      "**Percent as chunks:** find 10% by moving the decimal, then build 5% (half), 1%, 20% (double).",
      "**Always keep the unit** (lakh, crore, thousand) the same for numerator and denominator, then ignore it."
    ]],
    ["tip", "If only the order of the options matters (which is larger?), you never need the number itself. Cross-multiply and stop."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "di/di-tricks/fraction-pct-table", title: "Fraction ↔ % table",
      spot: "A percentage like 12.5%, 37.5% or 16⅔% of a number, or a ratio that turns up as a familiar fraction.",
      method: ["Recognise the percentage as a fraction from the table.", "Divide the number by the denominator, then multiply by the numerator.", "Check that the result sits between the obvious neighbours (10% and 50%)."],
      ex: { q: "Find 37.5% of 840, and 16⅔% of 1,260.", steps: ["37.5% = 3/8; 840 ÷ 8 = 105, and 3 × 105 = 315", "16⅔% = 1/6; 1,260 ÷ 6 = 210"], ans: "315 and 210" },
      shortcut: "Going the other way: 72 out of 480 is 72 ÷ 480 = 3/20 = 15%. Reduce the fraction, then convert."
    }],
    ["pattern", {
      key: "di/di-tricks/approximation", title: "Approximation",
      spot: "Large unwieldy numbers, with options far apart: “approximately how many times”, “about what percent”.",
      method: ["Round numerator and denominator to the same number of significant figures.", "Do the easy calculation with the rounded numbers.", "Decide the direction: if you rounded the divisor up, the true answer is a touch higher."],
      ex: { q: "Estimate 6,23,418 ÷ 24,950.", steps: ["6,23,418 ≈ 6,24,000 and 24,950 ≈ 25,000", "6,24,000 ÷ 25,000 = 624 ÷ 25 = 24.96", "True value is 24.99, so the estimate is within 0.2%"], ans: "about 25 (24.99)" },
      shortcut: "Round both numbers in the same direction when dividing (both up or both down), so the errors cancel."
    }],
    ["pattern", {
      key: "di/di-tricks/pct-change-at-a-glance", title: "% change at a glance",
      spot: "“By what percent did the figure rise or fall?”, including two changes in a row.",
      method: ["Find the difference between the new and old value.", "Express it using chunks of the old value: 10% is one place left, 5% is half of that.", "Add the chunks until you reach the difference."],
      ex: { q: "A figure rose from 480 to 552. Find the percent increase. Then find the net effect of +20% followed by −20%.", steps: ["Difference = 72", "10% of 480 = 48, 5% = 24, and 48 + 24 = 72, so the rise is 15%", "Successive: +20 − 20 + (20 × −20) ÷ 100 = −4%, so a net fall of 4%"], ans: "15%; net 4% fall" },
      shortcut: "New ÷ old: 552 ÷ 480 = 1.15, so +15%. The ratio minus 1 is the percent change."
    }],
    ["pattern", {
      key: "di/di-tricks/ratio-comparison-without-full-division", title: "Ratio comparison without full division",
      spot: "“Which year had the highest profit percent / ratio / share?” with many close candidates.",
      method: ["Write the candidates as fractions a/b and c/d.", "Cross-multiply: a × d and c × b.", "The side with the bigger product has the bigger fraction."],
      ex: { q: "Which is larger: 46 ÷ 230 or 39 ÷ 200? And 17/23 or 24/31?", steps: ["46 × 200 = 9,200 and 39 × 230 = 8,970, so 46/230 is larger (0.200 versus 0.195)", "17 × 31 = 527 and 24 × 23 = 552, so 24/31 is larger"], ans: "46/230; 24/31" },
      shortcut: "If one fraction has both a bigger numerator and a smaller denominator, it wins at once, with no calculation. Otherwise cross-multiply."
    }],
    ["pattern", {
      key: "di/di-tricks/cagr-roughly", title: "CAGR roughly",
      spot: "“Average annual growth rate” or “compound growth” over 3 to 5 years, with options that are whole percents.",
      method: ["Find end ÷ start.", "Count intervals (years between, not number of data points).", "Match with a growth factor you know: 1.05³ = 1.158, 1.1³ = 1.331, 1.1⁴ = 1.464, 1.15² = 1.3225, 1.2² = 1.44."],
      ex: { q: "A company’s sales grew from ₹ 250 crore to ₹ 366 crore in 4 years. Estimate the yearly growth.", steps: ["366 ÷ 250 = 1.464", "1.1⁴ = 1.4641", "So the rate is 10% a year"], ans: "10% per year" },
      shortcut: "Total growth divided by years gives a slight overestimate of the true rate. 46.4% ÷ 4 = 11.6%, and the real rate is 10%. Use it to bound the answer."
    }],
    ["pattern", {
      key: "di/di-tricks/averages-from-a-chart", title: "Averages from a chart",
      spot: "“Average over the years / months” from a bar or line chart, with values that are all near each other.",
      method: ["Choose a base value close to the middle of the data.", "Write each value’s deviation from the base (positive or negative).", "Add the deviations, divide by the count, and add that to the base."],
      ex: { q: "Production (thousand units) in five years: 58, 62, 55, 66, 59. Find the average.", steps: ["Base 60: deviations −2, +2, −5, +6, −1", "Sum of deviations = 0", "Average = 60 + 0 = 60"], ans: "60 thousand units" },
      shortcut: "When the numbers are 38, 42, 40, 44: base 40, deviations −2, +2, 0, +4 add to 4, so the average is 40 + 4/4 = 41. No big addition at all."
    }],
    ["pattern", {
      key: "di/di-tricks/fast-multiplication", title: "Fast multiplication",
      spot: "Multiplying by 5, 11, 15, 25, 99, 101, squaring a number ending in 5, or numbers close to 100.",
      method: ["See whether one of the numbers is near a round number (100, 1,000) or a special number (5, 11, 25).", "Replace the multiplication with a rule below.", "Do the small piece in your head."],
      ex: { q: "Compute 47 × 11, 68 × 25, 85², 104 × 96 and 23 × 99.", steps: ["× 11: 47 → 4 (4 + 7) 7 = 517", "× 25: 68 × 100 ÷ 4 = 6,800 ÷ 4 = 1,700", "85²: 8 × 9 = 72, then 25, so 7,225", "104 × 96 = 100² − 4² = 10,000 − 16 = 9,984", "× 99: 23 × 100 − 23 = 2,277"], ans: "517; 1,700; 7,225; 9,984; 2,277" },
      shortcut: "× 5 is × 10 ÷ 2 (126 × 5 = 1,260 ÷ 2 = 630). × 15 is × 10 plus half of it (36 × 15 = 360 + 180 = 540). × 1.5 adds half (64 × 1.5 = 96)."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Rounding in opposite directions** when dividing: rounding the numerator up and the denominator down inflates the answer.",
      "**Using the new value as the base** for % change. It is the old value.",
      "**Averaging percentages** without weights. A 10% rise on 200 and a 30% rise on 800 is not a 20% rise.",
      "**Counting data points as years** in a CAGR: 2019 to 2023 is 4 intervals.",
      "**Cross-multiplying the wrong way:** the larger cross-product belongs to the fraction whose numerator was in it. Test with a simple pair like 1/2 versus 2/3.",
      "**Trusting a shortcut when options are close.** Estimation is for spaced options only.",
      "**Losing the unit** when you switch between thousands, lakhs and crores in the middle of a calculation."
    ]],
    ["warn", "Do the estimate first. If exactly one option is near it, tick it and move on. Exact arithmetic is the last resort."],

    ["h2", "Quick check"],
    ["quiz", ["di-tricks-01", "di-tricks-03", "di-tricks-05", "di-tricks-07", "di-tricks-09"]]
  ]
});
BRIEFS["di:di-tricks"] = "DI sets are mostly arithmetic, so speed comes from avoiding exact arithmetic. Learn the fraction and percent table, round to friendly numbers (both in the same direction when dividing), and build a percent change from 10% and 5% chunks of the old value. Compare fractions by cross-multiplying instead of dividing.\n\nFor rough CAGR, match end ÷ start with a power such as 1.1ⁿ, and for averages pick a base and add up the small deviations. A few multiplication tricks (×11, ×25, squares ending in 5, numbers near 100) finish the toolkit. Always estimate first, and only calculate exactly when two options are close.";
