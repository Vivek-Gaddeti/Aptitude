/* Learn pages for Data Interpretation, part 2: Pie & donut, Mixed charts, Caselets, Missing-data tables. */
window.LEARN = window.LEARN || {}; LEARN.di = LEARN.di || []; window.BRIEFS = window.BRIEFS || {};

/* ---------------------------------------------------------------- PIE */
LEARN.di.push({
  id: "di-pie", group: "Chart types", title: "Pie & donut (% and degrees, two pies)",
  sub: "Slices are shares of one whole: convert between percent, degrees and rupees, and compare two pies carefully",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "Banking", "CAT"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A pie (or donut) chart splits **one whole** into slices. The whole is 100%, which is also 360°. A slice tells you only its **share**; to get a real amount you need the total, which is usually written in the heading or a note under the chart."],
    ["p", "Most pie questions are three conversions in different clothes: **percent → amount** (multiply by the total), **percent ↔ degrees** (multiply or divide by 3.6), and **amount ↔ amount** (compare two slices of the same pie, where the total cancels out)."],
    ["chart", { type: "pie", labels: ["Rent", "Food", "Education", "Transport", "Savings", "Others"], series: [{ name: "Share", data: [25, 30, 15, 10, 12, 8] }], note: "Monthly income of the family: ₹80,000." }, "Pie A: how a family spends its monthly income of ₹80,000."],
    ["p", "When a question shows **two pies**, the totals usually differ. A bigger slice in the second pie may still be a smaller amount, or the other way round, so always turn each slice into an amount before comparing across pies."],
    ["chart", { type: "donut", labels: ["North", "South", "East", "West"], series: [{ name: "2022", data: [30, 25, 20, 25] }, { name: "2023", data: [24, 30, 22, 24] }], note: "Total sales: 2022 = ₹400 crore, 2023 = ₹500 crore." }, "Pie B: region-wise share of sales in two years. The totals are different."],
    ["note", "Write the total next to the chart before you start. Then every slice becomes an amount in one step: 30% of ₹80,000 = ₹24,000."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Amount of a slice", "Amount = (share % ÷ 100) × total", "Food: 30% of ₹80,000 = ₹24,000"],
      ["Central angle", "Angle = share % × 3.6°", "Because 360° ÷ 100 = 3.6°"],
      ["Share from an angle", "Share % = angle ÷ 3.6", "108° → 30%"],
      ["Ratio of two slices (same pie)", "Ratio = share₁ : share₂", "The total cancels, so use the percents directly"],
      ["Slice across two pies", "Change % = (new amount − old amount) ÷ old amount × 100", "Convert both slices to amounts first"],
      ["Percentage point vs percent", "Points = share₂ − share₁; percent = change in amount ÷ old amount", "25% → 30% share is +5 points, not +5%"],
      ["Average slice", "Average = total ÷ number of slices", "Or average the percents, then take that % of the total"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**10% first:** find 10% of the total, then build any slice from it. 10% of ₹80,000 = ₹8,000, so 25% = 2.5 × 8,000 = ₹20,000.",
      "**Degrees by quarters:** 25% = 90°, 50% = 180°, 10% = 36°, 1% = 3.6°. Add slices: 15% = 36 + 18 = 54°.",
      "**Same pie, same total:** for a ratio, a difference or a comparison inside one pie, never touch the total. Work with the percents.",
      "**Sum check:** all slices add to 100% (360°). If one slice is missing, it is 100 minus the rest.",
      "**Two pies, two totals:** the slice with the higher percent is not always the higher amount. 24% of 500 beats 25% of 400.",
      "**Missing label:** a hidden slice is 100% minus the visible ones, or 360° minus the visible angles."
    ]],
    ["tip", "If you can see the % labels on the slices, ignore the angles. Percents are easier to calculate with. Use degrees only when the chart gives angles instead of percents."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "di/di-pie/direct-read", title: "Direct read: a slice as an amount",
      spot: "“How much does the family spend on X?” or “what is the sales figure of region R?”. One slice, one total.",
      method: ["Find the total in the heading or the note.", "Read the slice’s percent (or convert its angle ÷ 3.6).", "Amount = percent ÷ 100 × total."],
      ex: { q: "In Pie A, how much (₹) does the family spend on Food?", steps: ["Total income = ₹80,000; Food = 30%", "10% = ₹8,000, so 30% = 3 × 8,000", "Food = **₹24,000**"], ans: "₹24,000" },
      shortcut: "Take 10% of the total once and multiply: 30% is three tens, 25% is two and a half."
    }],
    ["pattern", {
      key: "di/di-pie/pct-change-growth", title: "% change across two pies",
      spot: "Two pies for two years with different totals, and “by what percent did X grow/fall?”.",
      method: ["Turn the slice in each pie into an amount using that pie’s total.", "Find the difference between the new and old amount.", "Divide by the OLD amount and multiply by 100."],
      ex: { q: "In Pie B, by what percent did South’s sales grow from 2022 to 2023?", steps: ["2022: 25% of 400 = ₹100 crore", "2023: 30% of 500 = ₹150 crore", "Growth = (150 − 100) ÷ 100 = 50%"], ans: "50%" },
      shortcut: "Do not subtract the percents. South’s share rose by only 5 points, but its sales rose by 50% because the whole pie grew too."
    }],
    ["pattern", {
      key: "di/di-pie/ratio-of-two-values", title: "Ratio of two slices",
      spot: "“Ratio of the amount for A to the amount for B”, inside one pie or across two pies.",
      method: ["Same pie: write the two percents as a ratio and simplify.", "Two pies: convert both slices to amounts first, because the totals differ.", "Cancel the common factor."],
      ex: { q: "In Pie B, find the ratio of North’s 2023 sales to East’s 2022 sales.", steps: ["North 2023 = 24% of 500 = ₹120 crore", "East 2022 = 20% of 400 = ₹80 crore", "120 : 80 = **3 : 2**"], ans: "3 : 2" },
      shortcut: "Inside one pie (Rent 25% : Transport 10%) the ratio is just 25 : 10 = 5 : 2. Only across pies must you use the totals."
    }],
    ["pattern", {
      key: "di/di-pie/share-of-total", title: "Share of total and central angle",
      spot: "“What is the central angle of sector X?”, “what percent is Y?”, or a pie drawn in degrees.",
      method: ["Convert the percent to degrees by multiplying by 3.6, or degrees to percent by dividing by 3.6.", "For a group of slices, add their percents first and convert once.", "Check the answer lies between 0° and 360°."],
      ex: { q: "In Pie A, find the central angle of the Education sector. Then find the angle for Transport and Others together.", steps: ["Education = 15%, so 15 × 3.6 = **54°**", "Transport + Others = 10% + 8% = 18%", "18 × 3.6 = **64.8°**"], ans: "54° and 64.8°" },
      shortcut: "Reverse use: a 108° sector is 108 ÷ 3.6 = 30% of the total, so its amount is 30% of the total as well."
    }],
    ["pattern", {
      key: "di/di-pie/average", title: "Average of several slices",
      spot: "“Average amount spent on A, B, C and D”, or the average of all categories.",
      method: ["Add the PERCENTS of the slices asked about.", "Divide by how many slices there are, to get the average percent.", "Take that percent of the total (or take amounts first, then average)."],
      ex: { q: "In Pie A, find the average monthly spend on Rent, Food, Education and Transport.", steps: ["Percents: 25 + 30 + 15 + 10 = 80%", "Average = 80 ÷ 4 = 20%", "20% of ₹80,000 = **₹16,000**"], ans: "₹16,000" },
      shortcut: "Average the percents first. It keeps the numbers small, and you multiply by the total only once at the end."
    }],
    ["pattern", {
      key: "di/di-pie/max-min-rank", title: "Largest, smallest and rank",
      spot: "“Which item has the highest share?”, “how much more is the largest than the smallest?”, “third highest”.",
      method: ["Read the percents and sort them in your head: only the extremes matter.", "For a difference inside one pie, subtract the percents, then apply the total.", "Across two pies, compare amounts, not percents."],
      ex: { q: "In Pie A, how much more (₹) is spent on the largest category than on the smallest?", steps: ["Largest = Food 30%, smallest = Others 8%", "Difference = 22 points", "22% of ₹80,000 = 22 × 800 = **₹17,600**"], ans: "₹17,600" },
      shortcut: "Subtract the percents first and multiply by the total once. 22% × 80,000 beats computing two amounts and subtracting."
    }],
    ["pattern", {
      key: "di/di-pie/years-above-average", title: "Slices above the average",
      spot: "“How many categories are above the average?”, “which regions exceed the mean share?”.",
      method: ["Average share = 100 ÷ number of slices.", "Count the slices whose percent is strictly more than that average.", "A slice exactly equal to the average is not above it."],
      ex: { q: "In Pie A, how many of the six categories are spent above the average category amount?", steps: ["Average share = 100 ÷ 6 ≈ 16.7%", "Slices above 16.7%: Rent 25% and Food 30%", "Education is 15%, below the average", "Count = **2**"], ans: "2" },
      shortcut: "Within one pie you compare percents only. No amounts are needed. For two pies, compare amounts against that pie’s own average (total ÷ number of slices)."
    }],
    ["pattern", {
      key: "di/di-pie/approximate-value", title: "Approximate value of a slice",
      spot: "An awkward total such as ₹7,45,000 with “approximately how much is …” and options that are well spread out.",
      method: ["Round the total to something friendly (₹7,45,000 ≈ ₹7.5 lakh).", "Build the percent from 10% and 1%.", "Pick the closest option. Do not chase the exact figure."],
      ex: { q: "A pie shows Savings as 12% of an income of ₹7,45,000. Approximately how much is saved?", steps: ["10% of 7,45,000 = 74,500", "2% of 7,45,000 = 14,900", "Total = 89,400, which is approximately **₹89,000**"], ans: "≈ ₹89,000" },
      shortcut: "Treat 12% as 10% + 2%. Quick estimate: 12% of 7.5 lakh = 90,000, so the nearest option is the one around ₹90,000."
    }],
    ["pattern", {
      key: "di/di-pie/cagr-roughly", title: "CAGR roughly from two pies",
      spot: "Two pies several years apart and “approximate annual growth rate of …”.",
      method: ["Convert the slice in each pie to an amount.", "Find the growth multiple (new ÷ old).", "Match it to the number of years: doubling in 4 years is about 19% a year (1.19⁴ ≈ 2)."],
      ex: { q: "In 2019 the pie shows North at 20% of ₹200 crore. In 2023 it shows North at 25% of ₹320 crore. Roughly what is North’s yearly growth rate?", steps: ["2019: 20% of 200 = ₹40 crore", "2023: 25% of 320 = ₹80 crore", "It doubled in 4 years: 1.19⁴ ≈ 2.005", "Rate ≈ **19% a year**"], ans: "About 19% per year" },
      shortcut: "Rule of 72: doubling time ≈ 72 ÷ rate. 72 ÷ 4 years = 18%, a little under the true 19%, so the answer is close to 18–19%."
    }],
    ["pattern", {
      key: "di/di-pie/combined", title: "Combined: income pie and expenditure pie",
      spot: "One pie gives how expenditure is split, and the text gives income. Questions ask for profit, profit % or a slice as a share of income.",
      method: ["Note which total each pie is a share of (expenditure or income).", "Convert the slice to an amount using the right total.", "Profit = income − expenditure; then profit % uses cost as the base unless the question says otherwise."],
      ex: { q: "A firm’s revenue is ₹5,00,000 and its expenditure pie (total ₹4,00,000) shows Marketing as 8%. Find the profit % on cost and Marketing as a percent of revenue.", steps: ["Profit = 5,00,000 − 4,00,000 = ₹1,00,000", "Profit % on cost = 1,00,000 ÷ 4,00,000 = **25%**", "Marketing = 8% of 4,00,000 = ₹32,000", "As a share of revenue = 32,000 ÷ 5,00,000 = **6.4%**"], ans: "25% and 6.4%" },
      shortcut: "A slice of the expenditure pie is a share of expenditure, not revenue. 8% of cost is not 8% of income."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Percent points vs percent:** a share going from 25% to 30% is +5 points, but the amount may have grown by 50%. The wording decides.",
      "**Different totals:** comparing slices of two pies by their percents alone is a classic error. Convert to amounts.",
      "**Wrong base:** a slice of the expenditure pie is a share of expenditure. A slice of the income pie is a share of income.",
      "**360 or 100?** Angles use 360°. Convert with 3.6, not by treating degrees as percents.",
      "**Strictly above:** a slice equal to the average does not count as above it.",
      "**Missing slice:** a hidden slice is 100% minus the rest. Never guess its size from the picture.",
      "**Donut centre text:** the number in the middle is often the total. Read it before anything else."
    ]],
    ["warn", "Before calculating, ask: how many pies, and what is the total of each? That one question avoids most pie-chart mistakes."],

    ["h2", "Quick check"],
    ["quiz", ["di-pie-01", "di-pie-02", "di-pie-04", "di-pie-06", "di-pie-08"]]
  ]
});
BRIEFS["di:di-pie"] = "A pie chart shows how one whole is split. The whole is 100% and 360 degrees, so one percent is 3.6 degrees. Read the total from the heading, turn each slice into an amount by taking that percent of the total, and compare slices of the same pie by their percents alone.\n\nWith two pies the totals usually differ, so convert every slice to an amount before comparing, and never subtract the percents when the question asks for percent growth. The ten patterns cover direct reads, growth, ratios, angles, averages, extremes, above-average counts, approximations, growth rates and profit from income and expense pies.";

/* ---------------------------------------------------------------- MIXED */
LEARN.di.push({
  id: "di-mixed", group: "Chart types", title: "Mixed charts (bar + line, table + pie)",
  sub: "Two sources, one question: read amounts from one and percentages from the other, then combine",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "Banking", "CAT"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A mixed set gives you **two displays of related data**: a bar chart of revenue with a line chart of profit %, or a table of totals with a pie of shares. Neither alone answers the question. One display holds the base amount and the other holds a rate, a share or a second measure."],
    ["p", "The work is always the same: **identify what each display measures**, bring them to a common form (usually an amount), then calculate. Check the units too. One chart may be in ₹ crore, another in percent."],
    ["chart", { type: "bar", labels: ["2019", "2020", "2021", "2022", "2023"], series: [{ name: "Revenue (₹ crore)", data: [100, 150, 120, 180, 200] }], unit: "Revenue (₹ crore)" }, "Set M, part 1 (bar): yearly revenue of a company."],
    ["chart", { type: "line", labels: ["2019", "2020", "2021", "2022", "2023"], series: [{ name: "Profit % of revenue", data: [10, 12, 15, 20, 25] }], unit: "Profit as % of revenue", yMax: 30 }, "Set M, part 2 (line): profit as a percent of that year’s revenue."],
    ["p", "Turn the pair into one table of amounts first. Profit = revenue × profit % ÷ 100, and expenditure = revenue − profit."],
    ["table", ["Year", "Revenue (₹ cr)", "Profit % ", "Profit (₹ cr)", "Expenditure (₹ cr)"], [
      ["2019", "100", "10", "10", "90"],
      ["2020", "150", "12", "18", "132"],
      ["2021", "120", "15", "18", "102"],
      ["2022", "180", "20", "36", "144"],
      ["2023", "200", "25", "50", "150"],
      ["Total", "750", "", "132", "618"]
    ]],
    ["note", "The other common mix is a table plus a pie: the table gives each region’s total, the pie splits one region into products. The slice of a product is (pie %) × (that region’s total from the table)."],

    ["h2", "Formulas"],
    ["formulas", [
      ["Profit from rate", "Profit = revenue × profit % ÷ 100", "2022: 20% of 180 = 36"],
      ["Expenditure", "Expenditure = revenue − profit", "180 − 36 = 144"],
      ["Table + pie", "Amount = pie % × the total in the table", "Use the total of the same item the pie splits"],
      ["Growth %", "(new − old) ÷ old × 100", "Compute it on the quantity asked, not on the other chart"],
      ["Average over years", "Sum of the yearly values ÷ number of years", "Average of amounts, not of percents, unless asked"],
      ["Approx. CAGR", "(final ÷ initial)^(1/years) − 1", "Doubling in 4 years ≈ 19%, tripling in 4 years ≈ 32%"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**Build the combined table first:** one minute spent making an amounts table saves a minute on every question in the set.",
      "**Read the legend and the axis labels:** the same chart can have two different y-axes. Check which line belongs to which axis.",
      "**Rates cannot be added or averaged blindly:** the average of 10% and 25% is not the overall profit %. Weight them by revenue.",
      "**Match the year:** a rate in the line chart belongs to the same year’s bar. Trace the vertical line up from the label.",
      "**Check the unit:** ₹ crore vs ₹ lakh, % vs absolute. Convert before comparing."
    ]],
    ["tip", "Revenue and profit % rising together does not mean profit rose by the same factor. Profit is the product of the two, so it can move much faster than either."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "di/di-mixed/direct-read", title: "Direct read: combine the bar and the line",
      spot: "A value that needs both displays, such as “profit in 2022” when one chart gives revenue and the other gives profit %.",
      method: ["Read the revenue for that year from the bar chart.", "Read the profit % for the same year from the line chart.", "Multiply them: revenue × % ÷ 100."],
      ex: { q: "From Set M, what was the profit (₹ crore) in 2022?", steps: ["Revenue 2022 = ₹180 crore (bar)", "Profit % 2022 = 20% (line)", "Profit = 20% of 180 = **₹36 crore**"], ans: "₹36 crore" },
      shortcut: "10% of 180 is 18, so 20% is 36. Always pick the same year on both charts."
    }],
    ["pattern", {
      key: "di/di-mixed/pct-change-growth", title: "% change of a combined quantity",
      spot: "“By what percent did profit increase from 2021 to 2022?” where profit is not shown directly.",
      method: ["Compute the quantity (profit) for both years.", "Find the difference.", "Divide by the earlier year’s value."],
      ex: { q: "From Set M, find the percentage increase in profit from 2021 to 2022.", steps: ["Profit 2021 = 15% of 120 = ₹18 crore", "Profit 2022 = 20% of 180 = ₹36 crore", "Increase = 18 ÷ 18 = **100%**"], ans: "100%" },
      shortcut: "Revenue grew only 50% (120 → 180) and the margin rose from 15% to 20%, but profit doubled. Do not report the revenue growth."
    }],
    ["pattern", {
      key: "di/di-mixed/ratio-of-two-values", title: "Ratio across the two displays",
      spot: "“Ratio of revenue to profit in 2020” or “profit of one year to another”.",
      method: ["Write both quantities in the same unit.", "Compute the one that is not given directly.", "Simplify by the common factor."],
      ex: { q: "From Set M, find the ratio of revenue to profit in 2020.", steps: ["Revenue 2020 = ₹150 crore", "Profit 2020 = 12% of 150 = ₹18 crore", "150 : 18 = **25 : 3**"], ans: "25 : 3" },
      shortcut: "Revenue : profit is just 100 : profit %. For 12% that is 100 : 12 = 25 : 3, with no revenue needed."
    }],
    ["pattern", {
      key: "di/di-mixed/share-of-total", title: "Share of a multi-year total",
      spot: "“What percent of the five-year revenue was earned in 2022?”.",
      method: ["Add the yearly values from the bar chart to get the overall total.", "Divide the year’s value by that total.", "Multiply by 100."],
      ex: { q: "From Set M, 2022 revenue is what percent of the total revenue over 2019–2023?", steps: ["Total revenue = 100 + 150 + 120 + 180 + 200 = ₹750 crore", "Share = 180 ÷ 750", "= **24%**"], ans: "24%" },
      shortcut: "Divide 750 by 100 to get 7.5; then 180 ÷ 7.5 = 24. Choose a division that clears the denominator."
    }],
    ["pattern", {
      key: "di/di-mixed/average", title: "Average of a combined quantity",
      spot: "“Average profit during 2020–2022” when profit must be built from both charts.",
      method: ["Compute the quantity for each year in the range.", "Add them.", "Divide by the number of years."],
      ex: { q: "From Set M, find the average yearly profit (₹ crore) for 2020, 2021 and 2022.", steps: ["Profits: 18, 18 and 36", "Sum = 72", "Average = 72 ÷ 3 = **₹24 crore**"], ans: "₹24 crore" },
      shortcut: "Do not average the profit percents (12, 15, 20) and apply that to the average revenue. The result will be different."
    }],
    ["pattern", {
      key: "di/di-mixed/max-min-rank", title: "Highest, lowest and gap",
      spot: "“In which year was profit highest?”, “difference between the highest and lowest profit”.",
      method: ["Build the combined quantity for every year.", "Pick the extremes from that list, not from either chart alone.", "Subtract if a gap is asked."],
      ex: { q: "From Set M, how much more is the highest yearly profit than the lowest?", steps: ["Profits: 10, 18, 18, 36, 50", "Highest = 50 (2023), lowest = 10 (2019)", "Difference = **₹40 crore**"], ans: "₹40 crore" },
      shortcut: "The highest revenue year need not be the highest profit year, and the highest margin need not be either. Always check the product."
    }],
    ["pattern", {
      key: "di/di-mixed/years-above-average", title: "Years above the average",
      spot: "“In how many years was revenue more than the five-year average?”.",
      method: ["Average = total ÷ number of years (750 ÷ 5 = 150).", "Compare each bar with that figure.", "Count only the strictly greater ones."],
      ex: { q: "From Set M, in how many years was the revenue more than the five-year average?", steps: ["Average revenue = 750 ÷ 5 = ₹150 crore", "Above 150: 2022 (180) and 2023 (200)", "2020 is exactly 150, so it does not count", "Count = **2**"], ans: "2" },
      shortcut: "Draw a horizontal line at the average on the bar chart and count the bars that clearly cross it."
    }],
    ["pattern", {
      key: "di/di-mixed/approximate-value", title: "Approximate percentage of a total",
      spot: "A ratio like 18 ÷ 132 where exact division is awkward and the options are well apart.",
      method: ["Round the total to a friendly figure (132 ≈ 130).", "Divide the part by it.", "Pick the nearest option."],
      ex: { q: "From Set M, the 2020 profit is approximately what percent of the total profit over the five years?", steps: ["Profit 2020 = 18; total profit = 10 + 18 + 18 + 36 + 50 = 132", "Round: 18 ÷ 130 ≈ 13.8%", "Exact 18 ÷ 132 = 13.6%, so the answer is about **14%**"], ans: "≈ 14%" },
      shortcut: "10% of 132 is 13.2 and 18 is a bit more, so the share is a little under 14%. Estimate before dividing."
    }],
    ["pattern", {
      key: "di/di-mixed/cagr-roughly", title: "CAGR roughly",
      spot: "“Approximate annual growth rate of profit from 2019 to 2023”.",
      method: ["Build the start and end values of the quantity.", "Find the multiple: end ÷ start.", "Try friendly rates for the number of years (4 here)."],
      ex: { q: "From Set M, profit grew from ₹10 crore in 2019 to ₹50 crore in 2023. Roughly what is the yearly growth rate?", steps: ["Multiple = 50 ÷ 10 = 5 over 4 years", "Try 50%: 1.5⁴ = 5.06, almost exactly 5", "Rate ≈ **50% a year**"], ans: "About 50% per year" },
      shortcut: "Learn a few four-year multiples: 1.1⁴ ≈ 1.46, 1.2⁴ ≈ 2.07, 1.5⁴ ≈ 5.06. Match the multiple to the nearest one."
    }],
    ["pattern", {
      key: "di/di-mixed/combined", title: "Combined: revenue, profit and expenditure",
      spot: "“By how much did expenditure change?”, or any question that needs revenue and profit together.",
      method: ["Expenditure = revenue − profit, per year.", "Compute it for the years asked.", "Then find the difference, ratio or percent."],
      ex: { q: "From Set M, by how much (₹ crore) did the expenditure rise from 2021 to 2022?", steps: ["2021: revenue 120, profit 18, expenditure 102", "2022: revenue 180, profit 36, expenditure 144", "Rise = 144 − 102 = **₹42 crore**"], ans: "₹42 crore" },
      shortcut: "Expenditure = revenue × (100 − profit %) ÷ 100. For 2022, 80% of 180 = 144 in one step."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Using the rate chart as an amount:** the line shows percent, not rupees. 20 on the line is 20%, not ₹20 crore.",
      "**Averaging percents:** (10 + 25) ÷ 2 is not the overall profit %. Use amounts.",
      "**Mismatched years:** bars and points sit at the same labels, but misreading one tick gives a wrong year.",
      "**Wrong base for growth:** use the earlier year, and the quantity actually asked about.",
      "**Units:** ₹ crore on one chart and ₹ lakh on the other will wreck the ratio. Convert first.",
      "**Table total vs pie total:** the pie splits one row or column of the table, not the grand total."
    ]],
    ["warn", "First state, in a few words, what each display measures and its unit. Then decide which combined quantity the question needs."],

    ["h2", "Quick check"],
    ["quiz", ["di-mixed-01", "di-mixed-03", "di-mixed-05", "di-mixed-06", "di-mixed-09"]]
  ]
});
BRIEFS["di:di-mixed"] = "A mixed set pairs two displays, such as a bar chart of revenue and a line of profit percent, or a table of totals and a pie of shares. One display holds the base amount and the other holds a rate or a share. Build a single table of amounts first, then every question becomes a simple read or calculation.\n\nWatch the units and the years, never average percentages without weighting, and remember that a profit built from revenue and a rate can grow much faster than either one. The ten patterns cover direct reads, growth, ratios, shares, averages, extremes, above-average counts, approximations, growth rates and cost from revenue and profit.";

/* ---------------------------------------------------------------- CASELET */
LEARN.di.push({
  id: "di-caselet", group: "Chart types", title: "Caselets (paragraph → table)",
  sub: "No chart is given: turn the paragraph into a small table, then the questions are easy reads",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "Banking", "CAT"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A caselet is a **paragraph full of numbers**: ratios, percent changes, totals and a few direct values. There is no chart, so the first job is to **organise the facts into a table**. Once the table is built, the questions are the same as in any table set."],
    ["p", "Read the paragraph once to see what is being measured, then again slowly, filling one cell per fact. Some facts only fix one cell, and others (a ratio or a total) fix several at once. Fill what you can, then use the rest to complete the gaps."],
    ["note", "Caselet: A coaching institute ran three batches: Morning, Afternoon and Evening. In 2022 it had 600 students in the ratio 2 : 3 : 5. In 2023 the Morning batch grew by 25%, the Afternoon batch fell by 10%, and the Evening batch rose by 10%. The fee was ₹12,000 per student in 2022 and ₹15,000 in 2023. The running cost per student in 2023 was ₹10,000. The Morning batch had 75 students in 2020."],
    ["p", "Step 1: split the 600 in the ratio 2 : 3 : 5 (one part = 60). Step 2: apply each percent change to get 2023. Step 3: add the totals. The table is the working that every question below uses."],
    ["table", ["Batch", "2022 students", "Change", "2023 students"], [
      ["Morning", "120", "+25%", "150"],
      ["Afternoon", "180", "−10%", "162"],
      ["Evening", "300", "+10%", "330"],
      ["Total", "600", "+7%", "642"]
    ]],

    ["h2", "Formulas"],
    ["formulas", [
      ["Ratio split", "Part = total × (ratio term ÷ sum of terms)", "600 × 2/10 = 120"],
      ["After a % change", "New = old × (1 ± change ÷ 100)", "180 × 0.9 = 162"],
      ["% change of a total", "(new total − old total) ÷ old total × 100", "(642 − 600) ÷ 600 = 7%"],
      ["Revenue", "Revenue = number × price", "642 × ₹15,000"],
      ["Profit", "Profit = number × (price − cost per unit)", "642 × (15,000 − 10,000)"],
      ["Total of totals", "Overall % change ≠ average of the part changes", "Weight by the old values"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**Table first:** a blank grid of rows and columns, filled as you read, keeps every number in view.",
      "**One part, not fractions:** with a ratio 2 : 3 : 5, set one part = total ÷ 10 and multiply.",
      "**Percent change factors:** +25% = ×1.25, −10% = ×0.9, +10% = ×1.1. Multiply, do not add and subtract separately.",
      "**Average of changes is not the change of the total:** +25%, −10%, +10% do not average to +8.3%. The total rose by 7%.",
      "**Mark the unknown cells:** write “?” and fill them in whatever order the facts allow.",
      "**Skip the unneeded:** a caselet often has extra facts for other questions. Fill only the cells the question needs."
    ]],
    ["tip", "Underline each number as you tabulate it. If a number is left un-underlined at the end of the paragraph, you missed a fact."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "di/di-caselet/direct-read", title: "Direct read: build one cell",
      spot: "“How many students were in the Evening batch in 2023?”. The paragraph does not state it; you must derive it.",
      method: ["Find the base number in the paragraph (total and ratio, for 2022).", "Apply the percent change to that base.", "State the answer in the unit asked."],
      ex: { q: "In the caselet, how many students were in the Evening batch in 2023?", steps: ["2022 Evening = 5/10 of 600 = 300", "Rise of 10%: 300 × 1.1", "= **330**"], ans: "330" },
      shortcut: "Do not stop at the 2022 figure. The question is almost always one step beyond what the paragraph gives."
    }],
    ["pattern", {
      key: "di/di-caselet/pct-change-growth", title: "% change of the total",
      spot: "“By what percent did the total number of students change?” after the parts have individual changes.",
      method: ["Find every part for both years and add them.", "Subtract old total from new total.", "Divide by the old total."],
      ex: { q: "In the caselet, by what percent did the total number of students change from 2022 to 2023?", steps: ["2023 total = 150 + 162 + 330 = 642", "Change = 642 − 600 = 42", "42 ÷ 600 = **7% increase**"], ans: "7% increase" },
      shortcut: "Alternative: weights 20%, 30%, 50% give 0.2 × 25 + 0.3 × (−10) + 0.5 × 10 = 5 − 3 + 5 = +7%. Weight by the old shares."
    }],
    ["pattern", {
      key: "di/di-caselet/ratio-of-two-values", title: "Ratio from the table",
      spot: "“Ratio of Morning to Afternoon in 2023”. Both values need to be built first.",
      method: ["Build both cells from the facts.", "Write them as a ratio.", "Divide by the HCF."],
      ex: { q: "In the caselet, find the ratio of Morning to Afternoon students in 2023.", steps: ["Morning 2023 = 120 × 1.25 = 150", "Afternoon 2023 = 180 × 0.9 = 162", "150 : 162 = **25 : 27** (divide by 6)"], ans: "25 : 27" },
      shortcut: "The ratio of the new values is the old ratio times the change factors: (2 × 1.25) : (3 × 0.9) = 2.5 : 2.7 = 25 : 27."
    }],
    ["pattern", {
      key: "di/di-caselet/share-of-total", title: "Share of the total",
      spot: "“What percent of the students were in the Evening batch?”.",
      method: ["Pick the correct year’s total as the base.", "Divide the part by that total.", "Multiply by 100."],
      ex: { q: "In the caselet, what percent of the 2022 students attended the Evening batch?", steps: ["Ratio 2 : 3 : 5 has sum 10", "Evening = 5/10 of the total", "= **50%**"], ans: "50%" },
      shortcut: "A ratio already gives shares. 2 : 3 : 5 is 20% : 30% : 50%, so no multiplication is needed. For 2023, the base changes to 642."
    }],
    ["pattern", {
      key: "di/di-caselet/average", title: "Average from the table",
      spot: "“Average number of students per batch in 2023”.",
      method: ["Total for the year (from the table).", "Divide by the number of batches.", "Check the answer lies between the smallest and largest value."],
      ex: { q: "In the caselet, find the average number of students per batch in 2023.", steps: ["2023 total = 642", "Three batches", "642 ÷ 3 = **214**"], ans: "214" },
      shortcut: "Estimate first: 150, 162 and 330 average out to around 200–220, so 214 fits."
    }],
    ["pattern", {
      key: "di/di-caselet/max-min-rank", title: "Largest, smallest and rank",
      spot: "“Which batch had the lowest enrolment in 2023?”, “largest rise or fall”.",
      method: ["Build the whole column for that year.", "Pick the extreme from it.", "For a rise or fall, compare new and old for each batch separately."],
      ex: { q: "In the caselet, which batch had the fewest students in 2023, and how many fewer than the Evening batch?", steps: ["2023: Morning 150, Afternoon 162, Evening 330", "Fewest = Morning, 150", "330 − 150 = **180 fewer**"], ans: "Morning; 180" },
      shortcut: "The batch that fell (Afternoon) is not the smallest. Do not mix up “decreased” with “lowest”."
    }],
    ["pattern", {
      key: "di/di-caselet/years-above-average", title: "Above the average",
      spot: "“How many batches had more students than the average in 2023?”.",
      method: ["Average the column (total ÷ number of batches).", "Compare each cell with that average.", "Count the strictly bigger ones."],
      ex: { q: "In the caselet, how many batches had more than the 2023 average number of students per batch?", steps: ["Average = 642 ÷ 3 = 214", "Above 214: Evening (330) only", "Morning 150 and Afternoon 162 are below", "Count = **1**"], ans: "1" },
      shortcut: "One big batch pulls the average up, so only that batch can be above it. Expect a small count."
    }],
    ["pattern", {
      key: "di/di-caselet/approximate-value", title: "Approximate revenue",
      spot: "A price like ₹14,800 and 162 students, with “approximately how much revenue” and options far apart.",
      method: ["Round the price to a friendly figure.", "Multiply by the count.", "Adjust once for the rounding, or just pick the nearest option."],
      ex: { q: "Suppose the Afternoon batch in 2023 paid a fee of ₹14,800 per student. Approximately how much (₹ lakh) was the fee income from that batch?", steps: ["Afternoon 2023 = 162 students", "Round the fee: 162 × 15,000 = 24,30,000", "Rounding added 162 × 200 = 32,400, so exact = 23,97,600", "≈ **₹24 lakh**"], ans: "≈ ₹24 lakh" },
      shortcut: "Round to a clean multiplier, then check which way you rounded. The options are usually far enough apart that you can skip the correction."
    }],
    ["pattern", {
      key: "di/di-caselet/cagr-roughly", title: "CAGR roughly",
      spot: "A fact about an earlier year (“75 students in 2020”) plus a later value, and “approximate annual growth”.",
      method: ["Get the start and end values from the paragraph and table.", "Count the years between them.", "Match the multiple to a growth rate."],
      ex: { q: "In the caselet, the Morning batch had 75 students in 2020 and 150 in 2023. Roughly what is the yearly growth rate?", steps: ["The batch doubled in 3 years", "1.26³ ≈ 2.0 (2^(1/3) ≈ 1.26)", "Rate ≈ **26% a year**"], ans: "About 26% per year" },
      shortcut: "Rule of 72: 72 ÷ 3 years = 24%, a little low. The true rate is about 26% because growth compounds."
    }],
    ["pattern", {
      key: "di/di-caselet/combined", title: "Combined: income and expense",
      spot: "A fee (income per student) and a cost per student are in the paragraph. Questions ask for profit.",
      method: ["Find the number of students for the year.", "Profit per student = fee − cost.", "Multiply by the number of students."],
      ex: { q: "In the caselet, find the total profit (₹) of the institute in 2023.", steps: ["2023 students = 642", "Profit per student = 15,000 − 10,000 = ₹5,000", "642 × 5,000 = 32,10,000", "= **₹32.1 lakh**"], ans: "₹32,10,000" },
      shortcut: "Take the difference per student first, then multiply once. It is quicker than finding revenue and cost separately."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Stopping at the paragraph’s numbers:** the question often asks for a value that must be derived.",
      "**Base of the percent:** a 25% rise applies to that batch’s own 2022 figure, not to the total.",
      "**Averaging the changes:** +25%, −10%, +10% do not average to the total’s change. Use the numbers.",
      "**Wrong year’s total:** the share of a 2023 student uses 642, not 600.",
      "**Ratio terms:** in 2 : 3 : 5 the first term is Morning only if the paragraph says the order.",
      "**Units of money:** ₹ vs ₹ lakh. Convert once at the end."
    ]],
    ["warn", "Do not answer from the paragraph alone. Build the table, check that the columns add to the stated totals, and only then answer."],

    ["h2", "Quick check"],
    ["quiz", ["di-caselet-01", "di-caselet-03", "di-caselet-05", "di-caselet-07", "di-caselet-10"]]
  ]
});
BRIEFS["di:di-caselet"] = "A caselet is a paragraph of numbers with no chart. Turn it into a small table before you answer anything: split totals by their ratios, apply each percent change to its own base, and add up the columns. The questions are then ordinary table questions.\n\nDo not stop at the numbers printed in the paragraph, because most questions need a value one step further on. Never average the part changes to get the change in the total. The ten patterns cover reads, growth, ratios, shares, averages, extremes, above-average counts, approximations, growth rates and profit from fees and costs.";

/* ---------------------------------------------------------------- MISSING */
LEARN.di.push({
  id: "di-missing", group: "Chart types", title: "Missing-data tables",
  sub: "Some cells are blank: recover them from the row and column totals, then answer the question",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "Banking", "CAT"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A missing-data table has a few **blank cells** (marked ?) and gives totals that let you recover them. Every row adds up to its total, and every column adds up to its total. A blank is found by subtracting the known cells from a total."],
    ["p", "The skill is **order**. Find a row or column with exactly one blank, fill it, and move on. A filled cell may unlock the next row. Work through the whole table before you answer, because one wrong fill spoils every later answer. Use the grand total to check your work."],
    ["table", ["Product (₹ lakh)", "2021", "2022", "2023", "Total"], [
      ["A", "40", "?", "55", "140"],
      ["B", "30", "50", "?", "128"],
      ["C", "?", "35", "45", "105"],
      ["D", "35", "40", "52", "127"],
      ["Total", "130", "?", "200", "500"]
    ]],
    ["p", "Table M, filled in: A’s 2022 = 140 − 40 − 55 = 45. B’s 2023 = 128 − 30 − 50 = 48. C’s 2021 = 105 − 35 − 45 = 25. The 2022 total is 45 + 50 + 35 + 40 = 170."],
    ["table", ["Product (₹ lakh)", "2021", "2022", "2023", "Total"], [
      ["A", "40", "45", "55", "140"],
      ["B", "30", "50", "48", "128"],
      ["C", "25", "35", "45", "105"],
      ["D", "35", "40", "52", "127"],
      ["Total", "130", "170", "200", "500"]
    ]],
    ["note", "Check the filled table: the columns 130 + 170 + 200 = 500, and the rows 140 + 128 + 105 + 127 = 500. Both agree, so every fill is right."],

    ["h2", "Rules"],
    ["formulas", [
      ["Missing cell in a row", "Blank = row total − sum of the other cells", "A 2022: 140 − (40 + 55) = 45"],
      ["Missing cell in a column", "Blank = column total − sum of the other cells", "C 2021: 130 − (40 + 30 + 35) = 25"],
      ["Missing total", "Total = sum of the cells in that row or column", "2022 total: 45 + 50 + 35 + 40"],
      ["Grand-total check", "Row totals added = column totals added", "500 both ways"],
      ["Two blanks in a row", "Use a column for one of them first", "Then the row has only one blank left"],
      ["Percent or ratio given", "Convert it into an equation for the blank", "“X is 20% of the total” → X = 0.2 × total"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**One blank at a time:** scan for a line (row or column) with exactly one blank. Fill it. Scan again.",
      "**Both directions:** a cell on a line with two blanks can be solved from its other line.",
      "**Check before you move:** after filling, quickly check the column against its total.",
      "**Do not fill what you do not need:** if the question concerns only A in 2021 and 2023, the blank in A’s 2022 cell is irrelevant (unless you need the row total).",
      "**Keep the totals:** the totals of the table are the strongest clues. Use them, not estimates."
    ]],
    ["tip", "After filling, do the grand-total check (rows and columns both reach 500). It takes ten seconds and catches every slip."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "di/di-missing/direct-read", title: "Direct read: fill a blank",
      spot: "“What were the sales of A in 2022?” when that cell is a ?.",
      method: ["Find the row (or column) holding the blank and its total.", "Add the known cells.", "Subtract from the total."],
      ex: { q: "In Table M, what were product A’s sales (₹ lakh) in 2022?", steps: ["Row total of A = 140", "Known cells: 40 + 55 = 95", "A 2022 = 140 − 95 = **45**"], ans: "₹45 lakh" },
      shortcut: "Round numbers help: 140 − 95 is 45. Check against the column later, since 2022’s other cells add to 125."
    }],
    ["pattern", {
      key: "di/di-missing/pct-change-growth", title: "% change using a filled blank",
      spot: "“Percent increase in sales of C from 2021 to 2023” where C’s 2021 cell is blank.",
      method: ["Recover the blank from its row or column total.", "Take the difference between the two cells.", "Divide by the earlier one."],
      ex: { q: "In Table M, by what percent did product C’s sales grow from 2021 to 2023?", steps: ["C 2021 = 105 − 35 − 45 = 25", "C 2023 = 45", "Growth = (45 − 25) ÷ 25 = **80%**"], ans: "80%" },
      shortcut: "Cross-check the blank with the column too: 130 − (40 + 30 + 35) = 25, the same result."
    }],
    ["pattern", {
      key: "di/di-missing/ratio-of-two-values", title: "Ratio of two cells",
      spot: "“Ratio of B’s sales to D’s sales in 2023”, where B’s cell is blank.",
      method: ["Fill the blank.", "Write the two values as a ratio.", "Simplify."],
      ex: { q: "In Table M, find the ratio of product B’s 2023 sales to product D’s 2023 sales.", steps: ["B 2023 = 128 − 30 − 50 = 48", "D 2023 = 52", "48 : 52 = **12 : 13**"], ans: "12 : 13" },
      shortcut: "Use the column to confirm: 200 − 55 − 45 − 52 = 48."
    }],
    ["pattern", {
      key: "di/di-missing/share-of-total", title: "Share of the grand total",
      spot: "“What percent of the overall sales came from A?”.",
      method: ["Take the row total of the item (it is given or can be built).", "Divide by the grand total.", "Multiply by 100."],
      ex: { q: "In Table M, product A’s three-year sales are what percent of the grand total?", steps: ["A’s total = 140", "Grand total = 500", "140 ÷ 500 = **28%**"], ans: "28%" },
      shortcut: "Dividing by 500 is the same as doubling and moving the decimal: 140 × 2 = 280, so 28%."
    }],
    ["pattern", {
      key: "di/di-missing/average", title: "Average of a row",
      spot: "“Average yearly sales of C over the three years”.",
      method: ["Use the row total if given, or fill the blank first.", "Divide by the number of years.", "Check it is between the smallest and largest."],
      ex: { q: "In Table M, what was the average yearly sale of product C over 2021–2023?", steps: ["C total = 105 (given)", "Three years", "105 ÷ 3 = **₹35 lakh**"], ans: "₹35 lakh" },
      shortcut: "The row total is given, so the blank cell does not need to be filled at all. Average = total ÷ count."
    }],
    ["pattern", {
      key: "di/di-missing/max-min-rank", title: "Largest and smallest after filling",
      spot: "“Which product had the lowest sales in 2023?” when one 2023 cell is blank.",
      method: ["Fill every blank in the column.", "Compare all the values.", "Never answer from the visible cells alone."],
      ex: { q: "In Table M, which product had the lowest sales in 2023?", steps: ["2023: A 55, B 48 (filled), C 45, D 52", "Lowest = **C, 45**"], ans: "Product C" },
      shortcut: "The hidden cell might be the answer. Here B’s hidden 48 is smaller than D’s 52 but still larger than C’s 45."
    }],
    ["pattern", {
      key: "di/di-missing/years-above-average", title: "Years above the average",
      spot: "“In how many years did B sell more than its yearly average?”.",
      method: ["Average = row total ÷ number of years.", "Fill the blank cells of the row.", "Count strictly greater values."],
      ex: { q: "In Table M, in how many years were product B’s sales above its own three-year average?", steps: ["Average = 128 ÷ 3 ≈ 42.7", "B: 30, 50, 48 (2023 is filled)", "Above 42.7: 2022 and 2023", "Count = **2**"], ans: "2" },
      shortcut: "You do not need the exact average. 128 is the total, so the average is about 43; 50 and 48 clearly beat it."
    }],
    ["pattern", {
      key: "di/di-missing/approximate-value", title: "Approximate percentage",
      spot: "A share that does not divide cleanly (50 ÷ 170) with well-spaced options.",
      method: ["Fill any needed total first.", "Round the denominator.", "Estimate the percent and pick the nearest option."],
      ex: { q: "In Table M, product B’s 2022 sales are approximately what percent of the total 2022 sales?", steps: ["2022 total = 45 + 50 + 35 + 40 = 170 (it is blank in the table)", "50 ÷ 170 ≈ 0.294", "≈ **29%**"], ans: "≈ 29%" },
      shortcut: "170 is close to 167 and 50 ÷ 167 = 30%, a quick upper estimate. The nearest option is just under 30."
    }],
    ["pattern", {
      key: "di/di-missing/cagr-roughly", title: "CAGR roughly",
      spot: "“Approximate annual growth of A from 2021 to 2023”, over two years.",
      method: ["Pick the two known cells (no filling needed).", "Multiple = end ÷ start.", "Take the square root for 2 years and match a rate."],
      ex: { q: "In Table M, roughly what is the yearly growth rate of product A between 2021 and 2023?", steps: ["A: 40 → 55 in 2 years", "Multiple = 55 ÷ 40 = 1.375", "1.17² = 1.369, which is very close", "Rate ≈ **17% a year**"], ans: "About 17% per year" },
      shortcut: "A 2022 is blank but you do not need it. Only the first and last year matter for CAGR."
    }],
    ["pattern", {
      key: "di/di-missing/combined", title: "Combined: fill, then use with a cost",
      spot: "A table of sales plus a cost figure; “profit %” where a total is blank.",
      method: ["Fill the blank total from its column.", "Profit = sales − cost.", "Profit % on sales = profit ÷ sales × 100."],
      ex: { q: "In Table M, the total cost in 2022 was ₹136 lakh. Find the profit and the profit % on sales for 2022.", steps: ["2022 sales = 45 + 50 + 35 + 40 = ₹170 lakh", "Profit = 170 − 136 = ₹34 lakh", "Profit % on sales = 34 ÷ 170 = **20%**"], ans: "₹34 lakh, 20%" },
      shortcut: "Profit % on sales and on cost differ. Here on cost it would be 34 ÷ 136 = 25%, so read which base is asked."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Wrong total subtracted:** use the total of the same row or column as the blank, not one of the other direction.",
      "**Skipping the check:** one arithmetic slip carries into every later answer. Run the grand-total check.",
      "**Answering from visible cells:** the extreme or the average may depend on a blank cell.",
      "**Sum of ? cells:** a line with two blanks cannot be solved on its own. Use the other direction first.",
      "**Percent base:** growth uses the earlier value, share uses the total, profit % uses the base the question names.",
      "**Strictly above:** a value equal to the average is not above it."
    ]],
    ["warn", "Fill the whole table first, check the totals, and only then read the question again."],

    ["h2", "Quick check"],
    ["quiz", ["di-missing-01", "di-missing-02", "di-missing-04", "di-missing-06", "di-missing-09"]]
  ]
});
BRIEFS["di:di-missing"] = "A missing-data table hides a few cells but gives the row and column totals. Every blank equals a total minus the known cells in the same line. Start with a line that has just one blank, fill it, and carry on until the grid is complete.\n\nCheck your work by adding the rows and columns to the grand total, and fill the table fully before reading the question, since an extreme or an average may depend on a hidden cell. The ten patterns cover reads, growth, ratios, shares, averages, extremes, above-average counts, approximations, growth rates and profit from sales and cost.";
