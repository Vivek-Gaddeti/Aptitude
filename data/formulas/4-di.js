/* Cheat sheet: data interpretation. One entry per DI topic in data/catalog.js. Item = [name, formula, note]. */
window.FORMULAS = window.FORMULAS || [];
FORMULAS.push(

{ sec: "di", topic: "di-table", title: "Table",
  items: [
    ["Percentage change", "(new − old) ÷ old × 100", "Always on the OLD value."],
    ["Percentage of a total", "part ÷ total × 100", "Total may be a row or a column total."],
    ["Average", "sum of values ÷ number of values", "Use only the values asked for."],
    ["Ratio of two cells", "A : B, then simplify", "Divide both by the smaller to compare."],
    ["Percentage point change", "new % − old %", "20% to 25% is 5 points but a 25% rise."],
    ["Difference", "larger − smaller", "Do this before dividing for percentage questions."],
  ],
  tricks: ["Read the unit line (₹ crore, thousand, lakh) and the year range first.", "For 'highest' or 'lowest', compare roughly: you rarely need the exact figures.", "Use row and column totals to check your reading."],
  traps: ["Mixing units in different columns.", "Reading the wrong year or row: put a finger on the row and go across."] },

{ sec: "di", topic: "di-multi-table", title: "Multiple tables",
  items: [
    ["Link by key", "match the same row label across both tables", "Find the common name or year first."],
    ["Derived value", "table 1 value × table 2 rate", "Price × quantity = revenue."],
    ["Combined percentage", "(sum of parts) ÷ (sum of totals) × 100", "Do not average two percentages with different bases."],
    ["Weighted average", "Σ (value × weight) ÷ Σ weight", "Use when groups have different sizes."],
    ["Ratio across tables", "figure from table 1 : figure from table 2", "Check both are in the same unit."],
  ],
  tricks: ["Write down which table gives what before calculating.", "If an answer needs only one table, do not touch the other."],
  traps: ["Averaging percentages of different-sized groups gives the wrong result."] },

{ sec: "di", topic: "di-bar", title: "Bar graph",
  items: [
    ["Percentage change", "(new − old) ÷ old × 100", "Old = the earlier bar."],
    ["Difference of bars", "read both values, subtract", "Estimate from gridlines when no labels."],
    ["Average over years", "total of the bars ÷ number of bars", ""],
    ["Stacked bar share", "segment ÷ whole bar × 100", "Segment height, not its top value."],
    ["Ratio of two bars", "bar A : bar B", "Simplify by the smaller."],
    ["CAGR", "(end ÷ start)^(1 ÷ n) − 1, n = number of years between", "Doubling in n years: about 72 ÷ n percent a year."],
  ],
  tricks: ["Compare bar heights by eye to rule out options before calculating.", "For grouped bars, check the legend colour for each series."],
  traps: ["In a stacked bar, the top of a segment is the cumulative total, not the segment's own value.", "A shortened axis (not starting at 0) makes small differences look big."] },

{ sec: "di", topic: "di-line", title: "Line graph",
  items: [
    ["Percentage growth", "(new − old) ÷ old × 100", "Between two points on the line."],
    ["Steepest rise", "largest increase between neighbouring points", "Look at absolute rise or percentage rise as asked."],
    ["Average value", "sum of the points ÷ number of points", ""],
    ["Intersection", "two lines cross when the values are equal", "Compare the points just before and after."],
    ["CAGR", "(end ÷ start)^(1 ÷ n) − 1", "Approx. for growth g under about 30%: g ÷ n − (n − 1) ÷ 2 × (g ÷ n)²"],
    ["Percentage point gap", "difference of two lines in %", "Not the same as percentage difference."],
  ],
  tricks: ["A steeper line means a bigger change in the same period, not a bigger value.", "Mark values at each point lightly before you answer more than one question."],
  traps: ["A rising line can still show a smaller percentage growth than before."] },

{ sec: "di", topic: "di-pie", title: "Pie & donut",
  items: [
    ["Degree to percentage", "degrees ÷ 360 × 100", "72° is 20%."],
    ["Percentage to degree", "% × 3.6", "15% is 54°."],
    ["Value of a sector", "% × total ÷ 100  or  degrees ÷ 360 × total", ""],
    ["Ratio of two sectors", "% (or degrees) of one : % of the other", "The total cancels."],
    ["Two pies", "sector 1 % × total 1  vs  sector 2 % × total 2", "Compare absolute values, not percentages."],
    ["Central angle of a value", "value ÷ total × 360", ""],
    ["Quick angles", "25% = 90° · 50% = 180° · 10% = 36° · 1% = 3.6°", ""],
  ],
  tricks: ["A ratio between two sectors of the same pie needs only the percentages or angles.", "Convert degrees once to % and keep working in %."],
  traps: ["With two pies of different totals, the larger percentage need not be the larger value.", "Check that the angles add to 360° (or 100%)."] },

{ sec: "di", topic: "di-mixed", title: "Mixed charts",
  items: [
    ["Bar + line", "bar gives the amount, line gives a rate on another axis", "Read the axis for each series."],
    ["Table + pie", "pie gives the share, table gives the total", "Value = share % × total."],
    ["Derived rate", "amount ÷ amount (profit ÷ cost, marks ÷ total)", ""],
    ["Percentage of a percentage", "value × p1% × p2%", "Multiply the two fractions."],
    ["Combined ratio", "multiply the values from the two charts, then compare", ""],
  ],
  tricks: ["Write the unit of each chart next to it before starting.", "Pull out the numbers you need into one small table."],
  traps: ["Reading the line value on the bar axis, or the other way round."] },

{ sec: "di", topic: "di-caselet", title: "Caselets",
  items: [
    ["Translate", "turn the paragraph into a table or equation", "Rows = items, columns = facts."],
    ["Percent to number", "% × total ÷ 100", ""],
    ["Remaining", "total − the parts already given", ""],
    ["Ratios", "ratio parts × common factor = actual", "Find the factor from one known number."],
    ["Check", "all parts add to the total", ""],
  ],
  tricks: ["Read once for the story, then again picking out numbers.", "Draw the table as you read; leave blanks for the unknowns."],
  traps: ["Missing the word 'of' vs 'than': 20% of A is not the same as 20% more than A."] },

{ sec: "di", topic: "di-missing", title: "Missing-data tables",
  items: [
    ["Row total", "sum of the row = total column", "Subtract known cells from the total."],
    ["Column total", "sum down the column = total row", "Use the grand total to check."],
    ["Percentage given", "cell = % × total ÷ 100", ""],
    ["Ratio given", "cell A : cell B = given ratio", "Cell A = ratio × cell B."],
    ["Average given", "sum = average × number of items", "Then subtract the known ones."],
  ],
  tricks: ["Start with the row or column that has only one blank.", "Fill the table in a good order: each filled cell unlocks the next."],
  traps: ["Do not forget that a total cell might include more than the shown rows."] },

{ sec: "di", topic: "di-radar", title: "Radar chart",
  items: [
    ["Reading a spoke", "distance from the centre = value on that axis", "Check the scale ring."],
    ["Compare two series", "compare the outline on each spoke", ""],
    ["Average across spokes", "sum of the values ÷ number of spokes", ""],
    ["Highest / lowest", "longest and shortest spokes", ""],
    ["Percentage difference", "(difference ÷ base) × 100 for one spoke", ""],
  ],
  tricks: ["Write the values for each spoke in a quick table.", "Check the gridline increments (they may not be 1)."],
  traps: ["The area covered is not a reliable measure: compare values spoke by spoke."] },

{ sec: "di", topic: "di-venn", title: "Venn-based DI",
  items: [
    ["Two sets", "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)", ""],
    ["Three sets", "n(A ∪ B ∪ C) = ΣA − Σ(pairs) + n(A ∩ B ∩ C)", ""],
    ["Neither", "total − n(A ∪ B ∪ C)", ""],
    ["Only A", "n(A) − n(A∩B) − n(A∩C) + n(A∩B∩C)", ""],
    ["Exactly two", "Σ(pair overlaps) − 3 × n(A ∩ B ∩ C)", ""],
  ],
  tricks: ["Fill the centre region first, then the pairs, then the 'only' regions.", "Put the 'neither' number outside the circles."],
  traps: ["'At least two' includes the triple overlap, 'exactly two' does not."] },

{ sec: "di", topic: "di-tricks", title: "Calculation tricks",
  items: [
    ["Percentage as fraction", "50% = 1/2 · 25% = 1/4 · 12.5% = 1/8 · 20% = 1/5 · 16.67% = 1/6 · 33.33% = 1/3", "Memorise the table."],
    ["x% of y = y% of x", "8% of 25 = 25% of 8 = 2", "Use the easier one."],
    ["Percentage change", "(new − old) ÷ old × 100", "Over 100% means more than doubled."],
    ["Successive changes", "a% then b%: a + b + ab ÷ 100", "+20% then −10% → 20 − 10 − 2 = +8%."],
    ["Compare fractions", "a/b vs c/d: compare ad and bc", "7/12 vs 5/9: 63 > 60, so 7/12 is larger."],
    ["Percentage points", "new % − old %", "Not the same as percentage change."],
    ["Pie degrees", "1% = 3.6° · 1° = 0.278%", ""],
    ["Doubling time", "years ≈ 72 ÷ rate (% per year)", "At 8% a year: about 9 years."],
    ["Averages", "total ÷ number; combined = Σ(avg × count) ÷ Σ count", ""],
    ["Approximation", "round to 2 significant digits", "Choose the option with the closest value."],
  ],
  tricks: ["Do not compute exactly when options are far apart: round both numbers.", "× 1.5 = add half; × 0.9 = subtract a tenth; ÷ 5 = × 2 ÷ 10; ÷ 25 = × 4 ÷ 100.", "To compare growth rates, compare the change ÷ old value, not the change alone."],
  traps: ["Round numerator and denominator the same way so the error cancels.", "A larger absolute change is not a larger percentage change."] }

);
