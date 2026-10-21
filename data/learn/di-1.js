/* Learn pages for Data Interpretation, part 1: Table, Multiple tables, Bar graph, Line graph. */
window.LEARN = window.LEARN || {}; LEARN.di = LEARN.di || []; window.BRIEFS = window.BRIEFS || {};

/* ===================== TABLE ===================== */
LEARN.di.push({
  id: "di-table", group: "Chart types", title: "Table",
  sub: "Rows and columns of numbers: read the right cell, then do small, careful arithmetic",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "Banking", "CAT"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A table is the plainest form of Data Interpretation: every number you need is printed, so the whole game is **reading the correct cell** and doing short arithmetic on it. Marks are lost on three things only: reading the wrong row or column, ignoring the unit, and rushing the percentage."],
    ["p", "Before you touch a question, spend ten seconds on the table itself: read the **title, the column heads and the unit** (₹ crore, thousand, %). Then note whether any column is already a percentage or a ratio, because that changes what you can add."],
    ["list", [
      "**Units first:** ‘in thousands’ and ‘in lakhs’ change the answer by a factor you cannot recover later.",
      "**Row or column:** years usually run down or across; decide which before you read.",
      "**Totals are not given:** unless a ‘Total’ row is printed, you must add it yourself, and only once.",
      "**Estimate before you calculate:** a rough answer lets you cross out two options at once."
    ]],

    ["h2", "Example data used below"],
    ["p", "All the pattern cards use this one small table. A company's revenue and expenditure (₹ crore):"],
    ["table", ["Year", "Revenue", "Expenditure", "Profit"], [
      ["2020", "120", "90", "30"],
      ["2021", "150", "105", "45"],
      ["2022", "135", "108", "27"],
      ["2023", "180", "126", "54"],
      ["2024", "215", "150", "65"]
    ]],

    ["h2", "Formulas"],
    ["formulas", [
      ["% change", "(New − Old) ÷ Old × 100", "The base is always the earlier value"],
      ["Percentage of a total", "Part ÷ Total × 100", "Add the total yourself if it is not printed"],
      ["Average", "Sum ÷ number of items", "Count the items, do not assume 5"],
      ["Ratio a : b", "Divide both by their HCF", "Keep the order the question gives"],
      ["Profit", "Income − Expenditure", "Profit % = Profit ÷ Cost × 100"],
      ["CAGR (rough)", "(End ÷ Start)^(1/n) − 1", "n = number of gaps (years − 1), not number of years"],
      ["Percentage points", "Difference of two percentages", "From 20% to 25% is 5 points, but a 25% rise"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**Drag a finger or pencil along the row** while reading; most ‘wrong cell’ errors are an eye slipping a line.",
      "**Use friendly fractions:** 12.5% = 1/8, 16.67% = 1/6, 33.3% = 1/3, 37.5% = 3/8, 62.5% = 5/8.",
      "**Round both numbers the same way** for approximation questions, and compare to the options’ gaps.",
      "**Compare without calculating:** if one value is more than double another, you can answer ‘which is bigger’ on sight.",
      "**Add differences, not totals:** for ‘average change’ or ‘profit over years’ add the small differences, not the large figures.",
      "**Check the extremes first:** highest and lowest are usually the answer (or the distractor) in max/min questions."
    ]],
    ["tip", "Underline the unit and the year range in the question before you look at the table. It stops you from answering for 2021–23 when the question asks for 2022–24."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "di/di-table/direct-read", title: "Direct read",
      spot: "“What was the expenditure in 2022?” or “In which year was revenue ₹180 crore?” Just one or two cells.",
      method: ["Find the row from the year or item named, then the column from the quantity named.", "Read the cell and say the unit aloud.", "If two cells are asked together, read both before adding."],
      ex: { q: "What was the company's expenditure in 2022 and 2023 together (₹ crore)?", steps: ["Expenditure column, 2022 = 108", "Expenditure column, 2023 = 126", "108 + 126 = 234"], ans: "₹234 crore" },
      shortcut: "Read both numbers aloud before adding. The common slip is picking Revenue (the neighbouring column) for one of them."
    }],
    ["pattern", {
      key: "di/di-table/pct-change-growth", title: "% change / growth",
      spot: "“By what percent did revenue rise from 2021 to 2023?”",
      method: ["Pick the old value and the new value, in time order.", "Find the difference, new − old.", "Divide by the OLD value and multiply by 100."],
      ex: { q: "By what percent did revenue increase from 2021 to 2023?", steps: ["Old = 150, new = 180", "Increase = 30", "30 ÷ 150 × 100 = 20%"], ans: "20%" },
      shortcut: "Spot ratios: 150 → 180 is ×1.2, so +20%. Dividing 30 by 180 gives 16.7%, the classic wrong base."
    }],
    ["pattern", {
      key: "di/di-table/ratio-of-two-values", title: "Ratio of two values",
      spot: "“What is the ratio of revenue in 2020 to expenditure in 2024?” Two cells, possibly from different rows and columns.",
      method: ["Read the first quantity named, then the second, in that order.", "Write them as a : b.", "Cancel the common factor."],
      ex: { q: "Find the ratio of the revenue in 2020 to the expenditure in 2024.", steps: ["Revenue 2020 = 120", "Expenditure 2024 = 150", "120 : 150, divide by 30, gives 4 : 5"], ans: "4 : 5" },
      shortcut: "Cancel zeros first (12 : 15), then the common factor (3). The order of the words in the question is the order of the ratio."
    }],
    ["pattern", {
      key: "di/di-table/share-of-total", title: "Share of total",
      spot: "“What percent of the five-year revenue came in 2023?”",
      method: ["Add the column to get the total (the table may not print it).", "Take the required part.", "Part ÷ total × 100."],
      ex: { q: "2023 revenue is what percent of the total revenue for 2020–2024?", steps: ["Total = 120 + 150 + 135 + 180 + 215 = 800", "Part = 180", "180 ÷ 800 × 100 = 22.5%"], ans: "22.5%" },
      shortcut: "A total of 800 is a gift: divide by 8 and move the decimal. 180 ÷ 8 = 22.5. Always add the total before touching the part."
    }],
    ["pattern", {
      key: "di/di-table/average", title: "Average",
      spot: "“What was the average revenue per year?” or “average expenditure over the last three years”.",
      method: ["Decide which years are included (all, or a subset).", "Add those values.", "Divide by how many there are."],
      ex: { q: "Find the average annual revenue for 2020–2024.", steps: ["Sum = 800 (from the total above)", "Number of years = 5", "800 ÷ 5 = 160"], ans: "₹160 crore" },
      shortcut: "Guess a middle value (say 150) and add the small gaps: −30, 0, −15, +30, +65 gives +50, and 50 ÷ 5 = 10, so 160."
    }],
    ["pattern", {
      key: "di/di-table/max-min-rank", title: "Max / min / rank",
      spot: "“In which year was profit highest?”, “biggest rise over the previous year”, “second lowest”.",
      method: ["Decide the exact quantity: a raw figure, a difference or a percent.", "Compute it for every row (write it in the margin).", "Pick the extreme or rank asked."],
      ex: { q: "In which year did revenue show the largest increase over the previous year?", steps: ["Increases: 2021: +30, 2022: −15, 2023: +45, 2024: +35", "The largest is +45", "It happened in 2023"], ans: "2023" },
      shortcut: "‘Biggest rise’ is a difference, so the biggest revenue year (2024) is not automatically the answer. Write the differences down."
    }],
    ["pattern", {
      key: "di/di-table/years-above-average", title: "Years above average",
      spot: "“In how many years was revenue above the five-year average?”",
      method: ["Find the average of the whole range.", "Compare each year to it.", "Count only the years that clear it."],
      ex: { q: "In how many years did revenue exceed its five-year average?", steps: ["Average = 800 ÷ 5 = 160", "Compare: 120, 150, 135 are below; 180 and 215 are above", "Two years: 2023 and 2024"], ans: "2" },
      shortcut: "Compare with the average, not with a neighbouring year. A year equal to the average is not ‘above’."
    }],
    ["pattern", {
      key: "di/di-table/approximate-value", title: "Approximate value",
      spot: "“Approximately what percent…?” with options that are far apart.",
      method: ["Round both numbers to friendly ones.", "Do the sum with the rounded numbers.", "Pick the nearest option."],
      ex: { q: "Expenditure rose from 2022 to 2024 by approximately what percent?", steps: ["108 ≈ 110 and 150 stays 150: rise ≈ 40", "40 ÷ 110 ≈ 36%; exact: 42 ÷ 108 = 38.9%", "Nearest sensible option: about 39%"], ans: "≈ 39%" },
      shortcut: "Round the base up, then the answer comes out a little low; keep that direction in mind and nudge the answer up."
    }],
    ["pattern", {
      key: "di/di-table/cagr-roughly", title: "CAGR roughly",
      spot: "“At roughly what yearly rate did revenue grow from 2020 to 2024?”",
      method: ["Find the overall multiple: end ÷ start.", "Count the gaps between years (2020 to 2024 is 4 gaps).", "Find the rate whose 4th power matches, using 1.1⁴ ≈ 1.46, 1.15⁴ ≈ 1.75, 1.2⁴ ≈ 2.07."],
      ex: { q: "Roughly what is the annual growth rate of revenue between 2020 and 2024?", steps: ["Multiple = 215 ÷ 120 ≈ 1.79", "Gaps = 4", "1.15⁴ ≈ 1.75 and 1.16⁴ ≈ 1.81, so the rate is about 15.7%"], ans: "≈ 16% per year" },
      shortcut: "Memorise 1.1⁴ ≈ 1.46, 1.15⁴ ≈ 1.75, 1.2⁴ ≈ 2.07. The multiple 1.79 sits just above 1.75, so a little over 15%."
    }],
    ["pattern", {
      key: "di/di-table/combined", title: "Combined (e.g. profit from income and expense)",
      spot: "Needs a derived quantity first: profit, profit %, a ratio of totals.",
      method: ["Write the derived quantity as a formula (profit = revenue − expenditure).", "Compute it for the rows asked.", "Apply the final step (percent, ratio, average)."],
      ex: { q: "What was the profit percent on expenditure in 2024?", steps: ["Profit = 215 − 150 = 65", "Profit % = 65 ÷ 150 × 100", "= 43.33%"], ans: "43.33%" },
      shortcut: "Profit % is on the cost (expenditure) unless the question says ‘on revenue’. Divide by 150, not 215."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Wrong base for percentage change:** divide by the old value, not the new one.",
      "**Unit slips:** a table in ‘thousand’ gives an answer in thousand; do not write the plain number.",
      "**Percent vs percentage points:** from 40% to 50% is 10 points but a 25% rise.",
      "**Reading the neighbouring column or row:** Revenue and Expenditure sit side by side for a reason.",
      "**Wrong count of years in an average or CAGR:** CAGR uses the number of gaps, an average uses the number of items.",
      "**Using ‘above’ for ‘equal or above’:** read the inequality exactly."
    ]],
    ["warn", "Scan the options before calculating. If they differ by large steps, a rounded estimate is enough and saves a minute."],

    ["h2", "Quick check"],
    ["quiz", ["di-table-01", "di-table-02", "di-table-04", "di-table-07", "di-table-10"]]
  ]
});
BRIEFS["di:di-table"] = "A table hands you every number; the work is choosing the right cell and the right operation. Check the title, the unit and which way the years run, then read the cells before you calculate anything.\n\nThe ten patterns cover direct reading, percent change, ratios, shares, averages, extremes, years above average, approximations, rough CAGR and combined questions. Percent change always divides by the old value, an average divides by the number of items, and CAGR uses the number of gaps.";

/* ===================== MULTIPLE TABLES ===================== */
LEARN.di.push({
  id: "di-multi-table", group: "Chart types", title: "Multiple tables",
  sub: "Two or three linked tables: combine them with one clean intermediate step",
  tags: ["TCS", "Infosys", "Banking", "CAT", "Wipro"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A multiple-table set gives you facts in separate tables and expects you to **link them**: one table says how many people took an exam, another says what percent passed. Neither table alone answers the question; the product of two cells does."],
    ["p", "The skill is not harder arithmetic, it is **bookkeeping**. Work out the linking quantity once (here, the number passed in each state), write it beside the question, and then every later step is a one-table calculation."],
    ["list", [
      "**Spot the link:** a count table plus a percent table means ‘count × percent ÷ 100’ gives a new count.",
      "**Same row key:** both tables must be read for the same state, year or item. Tick it off before multiplying.",
      "**Do not average percentages:** the overall rate is total passed ÷ total appeared, not the mean of the rates.",
      "**Build a helper row:** a small derived table of ‘passed’ in the margin serves five questions."
    ]],

    ["h2", "Example data used below"],
    ["p", "Table 1: candidates who appeared in an entrance exam, by state (thousand)."],
    ["table", ["State", "2021", "2022", "2023"], [
      ["State A", "72", "80", "90"],
      ["State B", "48", "60", "75"],
      ["State C", "40", "50", "60"],
      ["State D", "44", "40", "36"]
    ]],
    ["p", "Table 2: pass percentage, by state."],
    ["table", ["State", "2022", "2023"], [
      ["State A", "60%", "70%"],
      ["State B", "50%", "60%"],
      ["State C", "80%", "75%"],
      ["State D", "75%", "75%"]
    ]],
    ["p", "The derived ‘number passed’ (thousand) is Table 1 × Table 2:"],
    ["table", ["State", "Passed 2022", "Passed 2023"], [
      ["State A", "48", "63"],
      ["State B", "30", "45"],
      ["State C", "40", "45"],
      ["State D", "30", "27"],
      ["Total", "148", "180"]
    ]],

    ["h2", "Formulas"],
    ["formulas", [
      ["Linked count", "Count × Percent ÷ 100", "Appeared × pass% = passed"],
      ["Failed", "Appeared − Passed", "Or Appeared × (100 − pass%) ÷ 100"],
      ["Overall rate", "Total part ÷ Total whole × 100", "Never the plain mean of the rates"],
      ["% change", "(New − Old) ÷ Old × 100", "Compare like with like: passed with passed"],
      ["Share of total", "State's value ÷ column total × 100", "Total of the derived column"],
      ["CAGR (rough)", "(End ÷ Start)^(1/n) − 1", "n = gaps between the years"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**Compute the linking column only for the rows you need.** If the question names two states, do two products.",
      "**Use 10% blocks:** 70% of 90 = 63 (9 × 7). 75% of 36 = 27 (three-quarters).",
      "**Answer in the unit of the first table** (here thousand), and say so.",
      "**Cross-check totals:** the rows of the derived table should add to the total you compute independently.",
      "**For ratios of passed counts,** compare the products as they are and cancel at the end; no need to simplify early."
    ]],
    ["tip", "Write ‘T1 × T2’ beside the question number. It reminds you that the answer needs both tables and stops you using just one."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "di/di-multi-table/direct-read", title: "Direct read",
      spot: "A single value from one table, often with a trap that the other table looks tempting.",
      method: ["Decide which table holds the quantity (counts or percentages).", "Go to the row (state) and column (year).", "Read the cell with its unit."],
      ex: { q: "How many candidates (in thousand) appeared from State B in 2023?", steps: ["Count of candidates is in Table 1", "State B, 2023 = 75", "The pass % in Table 2 is not needed"], ans: "75 thousand" },
      shortcut: "Name the table before reading: ‘counts live in Table 1’. It prevents answering with 60%."
    }],
    ["pattern", {
      key: "di/di-multi-table/pct-change-growth", title: "% change / growth",
      spot: "“By what percent did the number of candidates from State B rise from 2022 to 2023?”",
      method: ["Pick the same quantity in two years (both from one table, or both derived).", "Find the difference.", "Divide by the earlier value."],
      ex: { q: "By what percent did the number of candidates appearing from State B grow between 2022 and 2023?", steps: ["2022 = 60, 2023 = 75", "Rise = 15", "15 ÷ 60 × 100 = 25%"], ans: "25%" },
      shortcut: "75 ÷ 60 = 1.25, so +25%. Do not compare passed numbers with appeared numbers; the growth must use the same quantity."
    }],
    ["pattern", {
      key: "di/di-multi-table/ratio-of-two-values", title: "Ratio of two values",
      spot: "“Ratio of those who passed from State A to those who passed from State C in 2022.”",
      method: ["Compute passed for each state: appeared × pass %.", "Write them as a : b.", "Cancel."],
      ex: { q: "Find the ratio of the number of candidates who passed in State A to those who passed in State C in 2022.", steps: ["State A: 80 × 60% = 48", "State C: 50 × 80% = 40", "48 : 40 = 6 : 5"], ans: "6 : 5" },
      shortcut: "A ratio of passed counts is NOT the ratio of pass percentages (60 : 80 = 3 : 4). Always multiply by the counts."
    }],
    ["pattern", {
      key: "di/di-multi-table/share-of-total", title: "Share of total",
      spot: "“What percent of all passed candidates in 2023 were from State A?”",
      method: ["Build the passed number for every state in that year.", "Add for the total.", "State's passed ÷ total passed × 100."],
      ex: { q: "State A candidates were what percent of all successful candidates in 2023?", steps: ["Passed 2023: 63, 45, 45, 27, total 180", "State A = 63", "63 ÷ 180 × 100 = 35%"], ans: "35%" },
      shortcut: "The denominator is the total of the derived column (180), not the total appeared (261)."
    }],
    ["pattern", {
      key: "di/di-multi-table/average", title: "Average",
      spot: "“Average number of candidates passing per state”, or the average of appeared over years.",
      method: ["Get the values to be averaged (derived or direct).", "Add them.", "Divide by how many states or years."],
      ex: { q: "What is the average number of candidates who passed per state in 2023?", steps: ["Passed: 63, 45, 45, 27", "Sum = 180", "180 ÷ 4 = 45"], ans: "45 thousand" },
      shortcut: "The ‘average pass %’ of 70, 60, 75, 75 is 70%, but the weighted rate is 180 ÷ 261 = 69%. Use totals when numbers differ in size."
    }],
    ["pattern", {
      key: "di/di-multi-table/max-min-rank", title: "Max / min / rank",
      spot: "“Which state had the highest number of successful candidates in 2022?”",
      method: ["Compute the linking quantity for every row.", "Compare them side by side.", "Pick the extreme."],
      ex: { q: "Which state had the largest number of passed candidates in 2022?", steps: ["A: 48, B: 30, C: 40, D: 30", "Largest = 48", "State A"], ans: "State A" },
      shortcut: "The highest pass % (State C, 80%) is not the highest pass count. A big base can beat a high rate."
    }],
    ["pattern", {
      key: "di/di-multi-table/years-above-average", title: "Years above average",
      spot: "“How many states had more than the average number of passed candidates in 2022?”",
      method: ["Compute passed for all rows.", "Average them: total ÷ number of rows.", "Count those strictly above."],
      ex: { q: "In 2022, how many states had a number of passed candidates above the average across the four states?", steps: ["Passed: 48, 30, 40, 30; total 148", "Average = 148 ÷ 4 = 37", "Above 37: State A (48) and State C (40)"], ans: "2 states" },
      shortcut: "Once you have the average, just look at which values are bigger. No need for exact differences."
    }],
    ["pattern", {
      key: "di/di-multi-table/approximate-value", title: "Approximate value",
      spot: "“Approximately what was the overall pass percentage in 2023?” Options are close together, so approximate smartly.",
      method: ["Compute the numerator (total passed) and denominator (total appeared).", "Round the division.", "Compare with the options."],
      ex: { q: "What was approximately the overall pass percentage across the four states in 2023?", steps: ["Total passed = 180", "Total appeared = 90 + 75 + 60 + 36 = 261", "180 ÷ 261 ≈ 0.69, so about 69%"], ans: "≈ 69%" },
      shortcut: "261 is close to 260 and 180 ÷ 260 = 9 ÷ 13 ≈ 0.69. Rounding the denominator by a tiny amount barely moves the answer."
    }],
    ["pattern", {
      key: "di/di-multi-table/cagr-roughly", title: "CAGR roughly",
      spot: "“At what yearly rate did the candidates from State B grow from 2021 to 2023?”",
      method: ["End ÷ start gives the overall multiple.", "Gaps = last year − first year.", "Match to a known square or fourth power."],
      ex: { q: "Roughly what is the annual growth rate of State B's appearing candidates from 2021 to 2023?", steps: ["Multiple = 75 ÷ 48 = 1.5625", "Gaps = 2, so rate² = 1.5625", "Rate = 1.25, i.e. 25% per year"], ans: "25% per year" },
      shortcut: "1.5625 = 1.25². Recognising 1.44, 1.5625, 1.69, 1.96 as squares of 1.2, 1.25, 1.3, 1.4 makes two-year CAGR instant."
    }],
    ["pattern", {
      key: "di/di-multi-table/combined", title: "Combined (e.g. profit from income and expense)",
      spot: "Two derived quantities combined, such as the change in the number who failed.",
      method: ["Find the derived quantity (failed = appeared − passed) for each year.", "Compare or combine them.", "Mind the unit and direction."],
      ex: { q: "By how many thousand did the number of failed candidates from State A change between 2022 and 2023?", steps: ["2022: failed = 80 − 48 = 32", "2023: failed = 90 − 63 = 27", "Change = 5 thousand fewer"], ans: "A decrease of 5 thousand" },
      shortcut: "Failed % is 100 − pass%. State A: 40% of 80 = 32 and 30% of 90 = 27. Two small products, no subtraction of big numbers."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Using only one table:** a ‘passed’ question needs counts and percentages together.",
      "**Averaging percentages:** the overall rate is total ÷ total, not the mean of the rates.",
      "**Ratio of rates vs ratio of counts:** multiply by the appearing numbers first.",
      "**Mismatched years:** Table 2 may start a year later than Table 1; check the column heads.",
      "**Wrong denominator for share:** use the total of the derived column, not the total of the raw one.",
      "**Forgetting the unit** of the first table (thousand) in the final answer."
    ]],
    ["warn", "If a question feels long, you are probably missing the linking step. Ask: what number do I get by multiplying a cell in Table 1 with a cell in Table 2?"],

    ["h2", "Quick check"],
    ["quiz", ["di-multi-table-01", "di-multi-table-02", "di-multi-table-05", "di-multi-table-07", "di-multi-table-10"]]
  ]
});
BRIEFS["di:di-multi-table"] = "Multiple tables ask you to join facts: a count in one table and a rate in another give a new count only when you multiply them. Do that linking step once, write the result beside the question, and every later question becomes a one-table calculation.\n\nNever average percentages that apply to different sized groups; divide the totals instead. A ratio or share of derived numbers must use the derived numbers, not the percentages, and the answer must carry the unit of the table the counts came from.";

/* ===================== BAR GRAPH ===================== */
LEARN.di.push({
  id: "di-bar", group: "Chart types", title: "Bar graph (simple, grouped, stacked, horizontal)",
  sub: "Read bar heights accurately, track the legend, and turn the bars into a quick table",
  tags: ["TCS", "Infosys", "Banking", "SSC", "CAT", "Wipro"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A bar graph shows the **size of each quantity as the length of a bar**. A *simple* bar chart has one bar per category, a *grouped* chart puts two or more bars side by side for each category, a *stacked* chart piles the parts on top of each other, and a *horizontal* chart is the same thing turned on its side."],
    ["p", "Everything you need is the bar value, and in most exam charts the value is printed on top. If it is not, read it against the axis scale and check whether the axis starts at zero. Your first job is to **copy the bars into a small table**; after that a bar-graph question is a table question."],
    ["list", [
      "**Read the legend:** the colour or shading tells you which series a bar belongs to.",
      "**Read the axis:** note the unit and the scale (each gridline might be 10, not 1).",
      "**Stacked bars:** the top segment's value is the segment's own length, not the height of the stack. The bar's total is the sum of its segments.",
      "**Do not trust your eye for comparing tiny differences:** use printed values."
    ]],

    ["h2", "Example data used below"],
    ["p", "Grouped bar chart: units sold of two products (thousand), 2020–2024."],
    ["chart", { type: "bar", labels: ["2020", "2021", "2022", "2023", "2024"], series: [{ name: "Product A", data: [40, 50, 48, 60, 72] }, { name: "Product B", data: [30, 36, 45, 54, 63] }], unit: "thousand units" }, "Units sold, in thousand. Product A in the first colour, Product B in the second."],
    ["table", ["Year", "Product A", "Product B", "A + B"], [
      ["2020", "40", "30", "70"],
      ["2021", "50", "36", "86"],
      ["2022", "48", "45", "93"],
      ["2023", "60", "54", "114"],
      ["2024", "72", "63", "135"]
    ]],

    ["h2", "Formulas"],
    ["formulas", [
      ["% change", "(New − Old) ÷ Old × 100", "Old = the earlier bar"],
      ["Share in a group", "One bar ÷ sum of the bars in the group", "A share needs a total: add the group"],
      ["Gap between bars", "Larger − smaller (same year)", "Biggest gap is not the biggest bar"],
      ["Average of a series", "Sum of its bars ÷ number of bars", "A 5-year chart has 5 bars"],
      ["Revenue from units", "Units × price per unit", "Match thousand × ₹ to a final unit"],
      ["CAGR (rough)", "(Last ÷ first)^(1/gaps) − 1", "5 bars = 4 gaps"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**Table first:** spend 20 seconds copying all the bars into a small table. It pays back on every question.",
      "**Compare shapes, not numbers:** to find a year where one bar is higher than the other, you can see it before you calculate.",
      "**Use the totals row:** the ‘A + B’ column feeds every share and average.",
      "**Estimate with friendly fractions:** 63 ÷ 30 is just over 2 (2.1), so the rate is a bit over 20%.",
      "**Stacked bars:** write the segment values, never the cumulative heights.",
      "**Horizontal bars:** the labels sit on the vertical axis, so check you are not reading the wrong row."
    ]],
    ["tip", "If the chart prints values on the bars, ignore the gridlines completely. If it does not, read each bar against the nearest gridline and write down the number before doing anything else."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "di/di-bar/direct-read", title: "Direct read",
      spot: "“How many units of Product B were sold in 2022?”",
      method: ["Find the year group on the x-axis.", "Pick the bar for the named series using the legend.", "Read the value and the unit."],
      ex: { q: "How many thousand units of Product B were sold in 2022?", steps: ["Year group 2022", "Product B bar (second colour) = 45", "Unit: thousand"], ans: "45 thousand" },
      shortcut: "Within a group the bars always appear in the legend's order. Product A is first, Product B second."
    }],
    ["pattern", {
      key: "di/di-bar/pct-change-growth", title: "% change / growth",
      spot: "“By what percent did Product A's sales rise from 2020 to 2024?”",
      method: ["Read the two bars of the same series.", "Difference = later − earlier.", "Divide by the earlier bar."],
      ex: { q: "By what percent did Product A's sales rise from 2020 to 2024?", steps: ["2020 = 40, 2024 = 72", "Rise = 32", "32 ÷ 40 × 100 = 80%"], ans: "80%" },
      shortcut: "72 ÷ 40 = 1.8, so +80%. Read ‘bar of the same colour’ for both years; mixing colours gives nonsense."
    }],
    ["pattern", {
      key: "di/di-bar/ratio-of-two-values", title: "Ratio of two values",
      spot: "“Ratio of Product A's sales to Product B's sales in 2021.”",
      method: ["Read the two bars in the same year group.", "Write A : B in the order asked.", "Cancel."],
      ex: { q: "What is the ratio of Product A's sales to Product B's sales in 2021?", steps: ["A = 50, B = 36", "50 : 36", "Divide both by 2: 25 : 18"], ans: "25 : 18" },
      shortcut: "If the numbers share nothing but 2, divide once and stop. Do not force a simplification that is not there."
    }],
    ["pattern", {
      key: "di/di-bar/share-of-total", title: "Share of total",
      spot: "“Product A's sales were what percent of the combined sales in 2024?”",
      method: ["Add the bars in that group to get the total.", "Put the required bar over it.", "Convert to a percent."],
      ex: { q: "Product A's 2024 sales were what percent of the combined sales of A and B in 2024?", steps: ["Total = 72 + 63 = 135", "72 ÷ 135 = 8/15", "8/15 × 100 = 53.33%"], ans: "53.33%" },
      shortcut: "Divide top and bottom by their common factor first: 72/135 = 8/15, and 1/15 = 6.67%, so 8/15 = 53.33%."
    }],
    ["pattern", {
      key: "di/di-bar/average", title: "Average",
      spot: "“What was the average annual sales of Product A?”",
      method: ["List the series' bars.", "Add them.", "Divide by the number of bars."],
      ex: { q: "What was the average yearly sales of Product A over 2020–2024?", steps: ["40 + 50 + 48 + 60 + 72 = 270", "Bars = 5", "270 ÷ 5 = 54"], ans: "54 thousand" },
      shortcut: "Assume 50, then the surpluses are −10, 0, −2, +10, +22 = +20, and 20 ÷ 5 = 4, so 54."
    }],
    ["pattern", {
      key: "di/di-bar/max-min-rank", title: "Max / min / rank",
      spot: "“In which year was the difference between A and B the largest?”",
      method: ["Decide what is being compared (a bar, a gap, a total).", "Compute the quantity for each year.", "Choose the extreme."],
      ex: { q: "In which year was the gap between Product A's and Product B's sales the greatest?", steps: ["Gaps: 2020: 10, 2021: 14, 2022: 3, 2023: 6, 2024: 9", "Largest = 14", "2021"], ans: "2021" },
      shortcut: "The tallest bar (2024) is not the biggest gap. For gaps, look for years where the two bars look most different, then check."
    }],
    ["pattern", {
      key: "di/di-bar/years-above-average", title: "Years above average",
      spot: "“In how many years did Product A's sales exceed its average?”",
      method: ["Find the average of that series.", "Compare each bar to it.", "Count."],
      ex: { q: "In how many years was Product A's sales above its own five-year average?", steps: ["Average = 54", "Bars above 54: 60 (2023) and 72 (2024)", "Count = 2"], ans: "2" },
      shortcut: "Draw an imaginary horizontal line at the average and count bars poking above it. Bars at 50 and 48 are below."
    }],
    ["pattern", {
      key: "di/di-bar/approximate-value", title: "Approximate value",
      spot: "“About how many percent more were A's total sales than B's?” with spread-out options.",
      method: ["Total each series.", "Round to friendly numbers.", "Take the ratio or percent."],
      ex: { q: "Total sales of Product A over the five years exceeded that of Product B by approximately what percent?", steps: ["A total = 270, B total = 228", "Excess = 42", "42 ÷ 228 ≈ 18.4%, about 18%"], ans: "≈ 18%" },
      shortcut: "228 ≈ 230 and 42 ÷ 230 ≈ 0.18. Quick rounding keeps the answer within a percent of the exact value."
    }],
    ["pattern", {
      key: "di/di-bar/cagr-roughly", title: "CAGR roughly",
      spot: "“At roughly what annual rate did Product B's sales grow from 2020 to 2024?”",
      method: ["Multiple = last bar ÷ first bar.", "Gaps = 4 for five bars.", "Match to 1.1⁴ ≈ 1.46, 1.2⁴ ≈ 2.07, 1.3⁴ ≈ 2.86."],
      ex: { q: "Roughly what is the annual growth rate of Product B between 2020 and 2024?", steps: ["Multiple = 63 ÷ 30 = 2.1", "Gaps = 4", "1.2⁴ = 2.0736 ≈ 2.1, so about 20% per year"], ans: "≈ 20% per year" },
      shortcut: "A multiple near 2 over 4 years is close to 20% yearly; 2 over 7 years is the 10% ‘rule of 72’ case."
    }],
    ["pattern", {
      key: "di/di-bar/combined", title: "Combined (e.g. profit from income and expense)",
      spot: "Units from the bars plus a price (or cost) given in the question.",
      method: ["Read the bars as units.", "Multiply by the price per unit for each series.", "Combine as asked (sum, difference or profit)."],
      ex: { q: "Product A sells at ₹500 and Product B at ₹800 per unit. What was the total revenue in 2022?", steps: ["A: 48 thousand × ₹500 = ₹24,00,000", "B: 45 thousand × ₹800 = ₹36,00,000", "Total = ₹60,00,000"], ans: "₹60 lakh" },
      shortcut: "Thousand × ₹ gives thousands of rupees: 48 × 500 = 24,000 thousand = ₹24 lakh. Convert once at the end."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Reading the wrong colour:** always check the legend before the first bar.",
      "**Largest bar vs largest difference:** a gap question needs a subtraction, not a glance.",
      "**Stacked bars:** a segment's value is its own length, not where its top sits on the axis.",
      "**Axis not starting at zero:** the chart can make a small gap look huge. Use numbers, not looks.",
      "**Base error in % change:** divide by the earlier year's bar.",
      "**Wrong unit in revenue:** thousand units × ₹ is in thousand rupees."
    ]],
    ["warn", "Before answering, say the question in terms of the table you copied: ‘A 2021 over B 2021’. If the words still need the chart, you have not extracted the numbers yet."],

    ["h2", "Quick check"],
    ["quiz", ["di-bar-01", "di-bar-02", "di-bar-04", "di-bar-07", "di-bar-09"]]
  ]
});
BRIEFS["di:di-bar"] = "A bar graph turns numbers into lengths, but the question is still about numbers. Copy the bars into a small table first, check the legend and unit, and every question becomes a table question with a totals column.\n\nThe common mistakes are reading the wrong colour, mixing up the largest bar with the largest gap, and dividing a percent change by the wrong year. In stacked charts read the segment itself, not the height of the stack.";

/* ===================== LINE GRAPH ===================== */
LEARN.di.push({
  id: "di-line", group: "Chart types", title: "Line graph (single, multiple)",
  sub: "Trends, crossings and turning points: read the points, then the shape",
  tags: ["TCS", "Infosys", "Banking", "SSC", "CAT", "Wipro"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A line graph plots one value per period and joins the points, so it is built to show **change over time**: rising, falling, flat, or crossing another line. The dots (or corners) are the data; the straight segments between them are only a visual link."],
    ["p", "Questions fall in two groups: those about the **value at a point** (read it, compare it, add it) and those about **the shape** (when did two lines meet, which segment was steepest, when did a line turn). For the first, copy the points into a table. For the second, compare differences between neighbouring points."],
    ["list", [
      "**Points matter, lines do not:** do not read values from the middle of a segment.",
      "**Steepest segment = biggest change** between two neighbouring points, up or down.",
      "**Where lines cross,** the two series have the same value that year.",
      "**Multiple lines:** check the legend and the same axis scale before comparing."
    ]],

    ["h2", "Example data used below"],
    ["p", "Line graph: exports (₹ crore) of two firms, P and Q."],
    ["chart", { type: "line", labels: ["2020", "2021", "2022", "2023", "2024"], series: [{ name: "Firm P", data: [80, 100, 90, 120, 150] }, { name: "Firm Q", data: [60, 75, 90, 105, 135] }], unit: "₹ crore" }, "Exports of firm P and firm Q, in ₹ crore. The two lines meet in 2022."],
    ["table", ["Year", "Firm P", "Firm Q", "P − Q"], [
      ["2020", "80", "60", "20"],
      ["2021", "100", "75", "25"],
      ["2022", "90", "90", "0"],
      ["2023", "120", "105", "15"],
      ["2024", "150", "135", "15"]
    ]],

    ["h2", "Formulas"],
    ["formulas", [
      ["% change", "(New − Old) ÷ Old × 100", "Negative result means a fall"],
      ["Point-to-point change", "Next point − previous point", "Steepest = largest absolute value"],
      ["Share of two lines", "One ÷ (sum of both) × 100", "Same year on both lines"],
      ["Average", "Sum of the points ÷ number of points", "5 years, 5 points"],
      ["Average gap", "Mean of the yearly differences", "Take differences first, then average"],
      ["CAGR (rough)", "(Last ÷ first)^(1/gaps) − 1", "Intermediate dips do not matter"]
    ]],

    ["h2", "Shortcuts"],
    ["list", [
      "**Write the points above the line** in the exam booklet as you read them. Re-reading the picture costs more time than writing.",
      "**Difference row:** add a ‘P − Q’ row so crossing and gap questions are instant.",
      "**Crossing years:** a sign change in P − Q means the lines crossed between those years; a zero means they met on that year.",
      "**Percent fall:** a drop of 10 from 100 is 10%, but a recovery from 90 back to 100 needs +11.1%.",
      "**CAGR ignores the wiggles:** only the first and last points matter.",
      "**Axes with breaks:** if the vertical axis starts at 50, differences look bigger than they are."
    ]],
    ["tip", "A steep line does not mean a large value, only a large change. A line at 150 can be nearly flat while one at 60 shoots up."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "di/di-line/direct-read", title: "Direct read",
      spot: "“What were the exports of firm Q in 2022?”",
      method: ["Find the year on the x-axis.", "Follow up to the right line (check the legend).", "Read the value against the y-axis or the printed label."],
      ex: { q: "What were firm Q's exports in 2022 (₹ crore)?", steps: ["Year 2022", "Firm Q's point = 90", "In 2022 both lines are at 90, so they meet"], ans: "₹90 crore" },
      shortcut: "When two lines touch, one number answers both series. Spot those years early."
    }],
    ["pattern", {
      key: "di/di-line/pct-change-growth", title: "% change / growth",
      spot: "“By what percent did firm P's exports change from 2021 to 2022?” The line goes down, so the answer is a fall.",
      method: ["Read the two points in time order.", "Difference = later − earlier (keep the sign).", "Divide by the earlier point."],
      ex: { q: "What was the percentage change in firm P's exports from 2021 to 2022?", steps: ["2021 = 100, 2022 = 90", "Change = −10", "−10 ÷ 100 × 100 = −10%, a fall of 10%"], ans: "10% decrease" },
      shortcut: "If the line goes down, the answer is a decrease. Always say ‘fall’ or ‘rise’ because the options may include both signs."
    }],
    ["pattern", {
      key: "di/di-line/ratio-of-two-values", title: "Ratio of two values",
      spot: "“Ratio of P's exports to Q's exports in 2023.”",
      method: ["Read both lines in the same year.", "Write P : Q.", "Cancel."],
      ex: { q: "What is the ratio of firm P's to firm Q's exports in 2023?", steps: ["P = 120, Q = 105", "120 : 105", "Divide by 15: 8 : 7"], ans: "8 : 7" },
      shortcut: "Both numbers are multiples of 15 here. If cancelling is slow, try dividing by 5 first and then 3."
    }],
    ["pattern", {
      key: "di/di-line/share-of-total", title: "Share of total",
      spot: "“What percent of the combined exports of P and Q in 2021 was P's?”",
      method: ["Read both points for that year.", "Add them for the total.", "P ÷ total × 100."],
      ex: { q: "Firm P's 2021 exports were what percent of the two firms' combined exports that year?", steps: ["Combined = 100 + 75 = 175", "P = 100", "100 ÷ 175 = 4/7 ≈ 57.14%"], ans: "≈ 57.14%" },
      shortcut: "Cancel by 25 to get 4/7 at once, and remember 1/7 ≈ 14.29%, so 4/7 ≈ 57.14%."
    }],
    ["pattern", {
      key: "di/di-line/average", title: "Average",
      spot: "“Average exports of firm Q over the five years.”",
      method: ["Read the points of one line.", "Add.", "Divide by the number of points."],
      ex: { q: "What was firm Q's average yearly exports during 2020–2024?", steps: ["60 + 75 + 90 + 105 + 135 = 465", "Points = 5", "465 ÷ 5 = 93"], ans: "₹93 crore" },
      shortcut: "Take 90 as a base: −30, −15, 0, +15, +45 sum to +15, and 15 ÷ 5 = 3, so 93."
    }],
    ["pattern", {
      key: "di/di-line/max-min-rank", title: "Max / min / rank",
      spot: "“In which year did Q's exports show the largest increase over the previous year?” (the steepest rising segment).",
      method: ["List the difference between each pair of neighbours.", "Compare the signed differences.", "Pick the largest (or smallest) and name the later year."],
      ex: { q: "In which year did firm Q record the largest increase compared with the previous year?", steps: ["Changes: 2021: +15, 2022: +15, 2023: +15, 2024: +30", "Largest = +30", "2024"], ans: "2024" },
      shortcut: "Steepest upward segment = biggest rise. Use the later year of the segment as the answer."
    }],
    ["pattern", {
      key: "di/di-line/years-above-average", title: "Years above average",
      spot: "“In how many years were P's exports above P's average?”",
      method: ["Average the series.", "Compare each point.", "Count."],
      ex: { q: "In how many years did firm P's exports exceed its five-year average?", steps: ["Sum = 540, average = 108", "Above 108: 120 (2023) and 150 (2024)", "Two years"], ans: "2" },
      shortcut: "Mentally draw a horizontal line at 108. 100 and 90 are below, so only the last two points poke above."
    }],
    ["pattern", {
      key: "di/di-line/approximate-value", title: "Approximate value",
      spot: "“Approximately what percent did Q's exports grow in 2024 over 2023?”",
      method: ["Read the two points.", "Round the divisor to a friendly number.", "Pick the nearest option."],
      ex: { q: "Firm Q's exports in 2024 were approximately what percent higher than in 2023?", steps: ["Rise = 135 − 105 = 30", "30 ÷ 105 = 2/7", "2/7 ≈ 28.57%, about 29%"], ans: "≈ 29%" },
      shortcut: "30 ÷ 105 is 2/7 and 1/7 = 14.29%, so 2/7 = 28.57%. A rounded base of 100 would give 30%, a quick upper bound."
    }],
    ["pattern", {
      key: "di/di-line/cagr-roughly", title: "CAGR roughly",
      spot: "“At roughly what annual rate did P's exports grow from 2020 to 2024?” The dip in 2022 is a distraction.",
      method: ["Multiple = last ÷ first.", "Gaps = 4.", "Match to 1.15⁴ ≈ 1.75 and 1.2⁴ ≈ 2.07."],
      ex: { q: "What is the approximate annual growth rate of firm P's exports from 2020 to 2024?", steps: ["Multiple = 150 ÷ 80 = 1.875", "Gaps = 4", "1.17⁴ ≈ 1.87, so about 17% per year"], ans: "≈ 17% per year" },
      shortcut: "1.875 is between 1.15⁴ = 1.75 and 1.2⁴ = 2.07, nearer to 1.75 by a bit more than a half: about 17%."
    }],
    ["pattern", {
      key: "di/di-line/combined", title: "Combined (e.g. profit from income and expense)",
      spot: "A gap between the lines, then a statistic of the gaps (average, total, count).",
      method: ["Write the difference between the lines for each year.", "Handle signs carefully.", "Apply the average, sum or count."],
      ex: { q: "What was the average yearly difference between P's and Q's exports (P − Q) over 2020–2024?", steps: ["P − Q: 20, 25, 0, 15, 15", "Sum = 75", "75 ÷ 5 = 15"], ans: "₹15 crore" },
      shortcut: "Average of differences equals difference of averages: 108 − 93 = 15. Either route is a good cross-check."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Reading between the dots:** only the plotted points are data.",
      "**Steepness vs size:** the steepest segment is the biggest change, not necessarily the highest value.",
      "**Wrong sign on a fall:** a percent change from 100 to 90 is −10%, and the base is 100.",
      "**Using the wrong line:** two lines close together are easy to swap; check the legend.",
      "**Counting years vs gaps:** five points have four gaps, and CAGR uses four.",
      "**Truncated axis:** a chart that starts at 50 exaggerates every change."
    ]],
    ["warn", "Mark the crossing points and the peaks on your copy before reading any question. They are the points examiners love to ask about."],

    ["h2", "Quick check"],
    ["quiz", ["di-line-01", "di-line-02", "di-line-04", "di-line-06", "di-line-08"]]
  ]
});
BRIEFS["di:di-line"] = "A line graph shows change over time, so most questions are about a point (read it) or the change between two points (subtract, then divide by the earlier one). Copy the points into a table, add a difference row if there are two lines, and you can answer almost anything.\n\nWatch the sign of a fall, remember that the steepest segment is the biggest change rather than the biggest value, and use only the first and last points for CAGR. Do not read values from between the dots.";
