# Hand-off: build an "Aptitude Hub" for placements
### Quantitative Aptitude · Logical Reasoning · Verbal Ability · Data Interpretation

This file contains everything a new Claude session needs to build a placement-aptitude study site that looks and works
like the DSA + Python **Study Hub** in `C:\Users\gkviv\OneDrive\Desktop\DSA`, with a more refined, practice-first design.

The companion file `AI-SITE-HANDOFF.md` (same folder) describes the shared engine in detail. **Read its sections 2, 4, 5, 7
and 8 as well.** They apply here unchanged: who the user is, the design taste, which engine files to copy, the content block
format, lessons learned and how to test. This file covers what is specific to aptitude.

---

## 1. Paste this as the first message in the new session

> I'm preparing for campus placements and want an offline website for **aptitude**: Quantitative Aptitude, Logical
> Reasoning, Verbal Ability and Data Interpretation, with lots of practice questions in every pattern. It should look
> and feel like my DSA + Python Study Hub, but more refined. Read these two hand-offs first:
> `C:\Users\gkviv\OneDrive\Desktop\DSA\APTITUDE-SITE-HANDOFF.md` and
> `C:\Users\gkviv\OneDrive\Desktop\DSA\AI-SITE-HANDOFF.md` (sections 2, 4, 5, 7, 8). Use the existing site in
> `C:\Users\gkviv\OneDrive\Desktop\DSA` only as a read-only reference and copy its engine into **this** folder.
>
> Before writing any code, give me: (1) the page and navigation plan, (2) the full topic → pattern list for all four
> sections, (3) the practice / mock-test design, and (4) a design mock-up of the practice screen. We'll agree on it,
> then build in stages: first the engine and one complete topic end to end, then the rest topic by topic.

(Open the new session in an empty folder, e.g. `C:\Users\gkviv\OneDrive\Desktop\Aptitude`.)

---

## 2. Goals in the user's words

- "All the aptitude: reasoning, data interpretation, verbal, and similar."
- "Similar web interface, somewhat refined if possible."
- "**More practice problems in different patterns.**"
- "**If there are any patterns or things to know, add those also**": formulas, shortcuts, tricks and common traps for every topic.
- It's for **placement tests**: TCS NQT, Infosys, Wipro, Accenture, Cognizant, Capgemini, HCL, Tech Mahindra, Deloitte, AMCAT,
  eLitmus (pH test), CoCubes / Aon, plus bank-style patterns. Speed and accuracy under time limits matter as much as concepts.

---

## 3. Site structure (proposal; confirm with the user)

**Header:** *Dashboard · Quant · Reasoning · Verbal · DI · Practice ▾ (Pattern drills, Mixed practice, Mock tests) · Revision*.
Plus the playground slot replaced by a **Rough work** pad. Keep the ✨ menu, theme switch, Ctrl+K finder and streak.

| Page | What's on it |
|---|---|
| `index.html` Dashboard | Today's goal (e.g. 25 questions), streak, accuracy and avg time by section, weak patterns, "Continue", mock-test history chart, year heatmap |
| `quant.html` · `reasoning.html` · `verbal.html` · `di.html` | Learn pages (doc pages with sidebar). Each topic covers: the concept in plain English → formulas → shortcuts / tricks → **patterns** (each with a solved example and a "Practice this pattern" button) → common traps → quick-check MCQs |
| `practice.html` | The practice engine: choose section / topic / pattern / difficulty / count, untimed or timed. One question at a time |
| `mock.html` | Timed sectional and full mocks in company formats; result analysis |
| `formulas.html` | Every formula and shortcut on one printable, searchable sheet, plus tables to memorise (squares 1–30, cubes 1–20, fraction ↔ %, powers of 2/3/5, primes to 100, alphabet positions A=1…Z=26 and reverse) |
| `revision.html` | Mistake book plus spaced repetition of wrong and bookmarked questions; formula and vocabulary flashcards |

---

## 4. Topic → pattern list (cover all of it; every pattern gets notes + an example + practice)

### Quantitative Aptitude
- **Number system:** divisibility rules, remainders (incl. cyclicity, Fermat / Euler basics), unit digit, last two digits, factors (count / sum),
  HCF & LCM (incl. word problems: bells, tiles), trailing zeros in n!, highest power of a prime in n!, prime numbers, base conversion
- **Simplification & approximation:** BODMAS, surds & indices, approximation, fractions and decimals
- **Percentages:** % change, successive %, population / depreciation, election, income–expenditure, % ↔ fraction
- **Profit, loss & discount:** marked price, successive discounts, false weights, buy-x-get-y, CP/SP ratios
- **Simple & compound interest:** CI vs SI difference (2 and 3 years), half-yearly / quarterly, instalments, doubling time
- **Ratio & proportion, variation:** ratio sharing, coins, mean / third / fourth proportional
- **Partnership**
- **Mixtures & alligation:** alligation rule, repeated replacement
- **Averages:** replacement, added / removed members, cricket averages
- **Problems on ages**
- **Time & work:** efficiency method, LCM method, A+B together, alternate days, leaving midway, work–wages
- **Pipes & cisterns**
- **Time, speed & distance:** average speed, relative speed, trains (pole / platform / crossing), boats & streams, races & head start,
  circular track meetings, late / early
- **Permutations & combinations:** arrangements, circular, words with repetition, selection, distribution, handshakes
- **Probability:** coins, dice, cards, balls, at least one, conditional basics
- **Mensuration 2D & 3D:** area, perimeter, volume, surface area, melting / recasting
- **Geometry basics:** triangles, circles, polygons, similarity, coordinate basics
- **Algebra:** linear and quadratic equations, inequalities
- **Progressions:** AP, GP, sum formulas
- **Logarithms**
- **Number series:** missing / wrong number, difference, ratio, squares / cubes, mixed
- **Clocks:** angle between hands, coinciding, gaining / losing
- **Calendars:** odd days, day of the week for a date, repeating years
- **Statistics:** mean, median, mode, range, standard deviation basics
- **Set theory / Venn**
- **Data sufficiency (quant)**

### Logical Reasoning
- **Series:** number, letter, alphanumeric
- **Analogies**
- **Classification:** odd one out
- **Coding–decoding:** letter shift, reverse, position-sum, substitution, word-to-code tables, TCS-style new patterns
- **Blood relations:** direct, puzzle-based, coded symbols (A+B means…)
- **Direction sense:** paths, shadows, final distance (Pythagoras)
- **Seating arrangement:** linear one-row and two-row, circular facing centre / outside / mixed, square / rectangular table
- **Puzzles:** floor / flat, box stacking, scheduling (days / months), comparison & ranking, mixed variable
- **Order & ranking**
- **Syllogisms:** classic + possibility cases + "only a few"
- **Statements:** conclusions, assumptions, arguments, course of action; cause & effect
- **Inequalities:** direct and coded
- **Input–output (machine)**
- **Data sufficiency (reasoning)**
- **Cubes & dice:** painted-cube counting, dice opposite faces, nets
- **Counting figures:** triangles, squares
- **Non-verbal:** mirror and water images, paper folding / cutting, embedded figures, pattern completion, figure series
- **Venn-diagram reasoning**
- **Critical reasoning:** strengthen, weaken, inference, assumption
- **Logical deduction and binary logic (eLitmus style)**

### Verbal Ability
- **Reading comprehension:** main idea, inference, tone, vocabulary in context
- **Grammar:** error spotting / sentence correction (subject–verb agreement, tenses, articles, prepositions, pronouns, modifiers,
  parallelism, conjunctions)
- **Fill in the blanks:** vocabulary, grammar, double blanks
- **Para jumbles:** opening sentence, mandatory pairs, connectors
- **Sentence completion and para completion**
- **Cloze test**
- **Vocabulary:** synonyms, antonyms, one-word substitution, idioms & phrases, commonly confused words, spellings
- **Voice and narration:** active / passive, direct / indirect speech
- **Sentence improvement**
- **Email / essay writing tips** (Infosys / TCS have writing sections)

### Data Interpretation
- **Chart types:** tables, bar (simple / grouped / stacked), line, pie / donut, mixed charts, caselets (paragraph data), missing-data DI, radar,
  Venn-based DI
- **Calculation tricks:** fraction ↔ % table, approximation, percentage change at a glance, ratio comparison without full division,
  "CAGR roughly", averages from charts

### Placement strategy section
- **Company test patterns:** sections, question counts, time, negative marking, cut-off style. Mark each as "check the latest pattern",
  because patterns change every year.
- **Exam technique:** time management, which questions to skip, elimination, option back-solving, mental-math tricks
  (squares near 50/100, multiply by 5/25/125, Vedic basics), and how to practise.

---

## 5. Practice: the heart of the site ("more practice problems in different patterns")

### Question format (data/q/*.js)
```js
{ id: "pct-successive-07", sec: "quant", topic: "percentages", pattern: "successive-change", d: "Medium",
  q: "A price rises 20% and then falls 20%. Net change?", opts: ["No change", "4% decrease", "4% increase", "2% decrease"],
  ans: 1, time: 45,                                 // target seconds
  sol: ["Net = a + b + ab/100 = 20 − 20 − 400/100 = −4", "So a 4% decrease"],
  short: "Equal % up then down is always a loss of x²/100 %", trap: "Thinking +20 − 20 = 0",
  set: null,                                       // DI / RC / puzzle sets share a stimulus: set: "di-bar-03"
  check: "round((1.2*0.8-1)*100, 6) == -4" }       // machine check of the answer (quant), see 5.3
```
- **Shared stimuli** (`data/sets/*.js`): a DI chart spec, an RC passage or a puzzle setup, which several questions point to via `set`.
- **Volume target:** at least **15–40 questions per pattern** (Easy / Medium / Hard mix), so roughly **2,000+ questions** in total. Build
  topic by topic.
- **All questions must be original.** Write new ones and don't copy RS Aggarwal, Arun Sharma, IndiaBix, PrepInsta and the like word for word.
  Patterns and formulas are fine; copied question text isn't.

### Pattern generators (unlimited fresh practice)
For number-driven quant and reasoning patterns, write generators: `{ pattern, gen(rng) → question }` with a seeded RNG.
Good candidates: percentages, SI/CI, profit & loss, ratios, averages, ages, time & work, pipes, TSD / trains / boats, clocks,
calendars, number series, letter series, coding–decoding, direction sense, unit digit, remainders, HCF/LCM, simple
probability. Generators compute the answer and build believable wrong options from common mistakes, e.g.
`a+b` instead of `a+b+ab/100`, or adding speeds instead of subtracting. The "Pattern drill" mode serves endless generated questions.

### Correctness checks (very important: aptitude answer keys are easy to get wrong)
- `tools/verify.js` loads every question and checks that `ans` is a valid index, the options are distinct, and the correct option
  appears exactly once.
- For quant, it also evaluates `check` (a Python expression run by `tools/verify.py`, or a JS function) and fails on any mismatch.
- **Puzzles and seating arrangements:** write a brute-force solver that enumerates all arrangements, confirms the clues give
  **exactly one** solution, and checks every answer against it.
- **Syllogisms:** check with a small set-model enumerator (all possible Venn region fillings).
- **Blood relations and directions:** compute with a tiny family-graph / coordinate solver.
- **Generators:** run each one thousands of times and assert the answer is unique and correct.
- **Verbal:** no machine check is possible, so give every answer a one-line reason in `sol` and keep the grammar rules consistent.

### Practice screen (refined UI)
- **Layout:** one question per screen, large option cards, and keys **1–4 / A–D** to answer, **Enter** for next, **B** to bookmark,
  **M** to mark for review, **S** to show the solution.
- **Instant mode** shows ✓/✗ with the step-by-step solution, the shortcut and the trap. **Test mode** shows everything at the end.
- **Per-question timer** with the target time. Afterwards it shows "your time vs target", and fast-but-wrong answers get flagged.
- **DI and RC sets:** the chart or passage stays pinned on the left and the questions sit on the right.
- **Rough-work pad:** a slide-out panel with a drawing canvas (pen, eraser, clear) and a text area. An optional calculator toggle,
  with an "exam mode" that has no calculator.
- **End-of-set review:** score, accuracy, time per question, a pattern-wise breakdown, "Retry wrong ones" and "Add to mistake book".

### Mock tests
- **Formats:** company-style presets (sections, counts, timer, negative marking on / off), defined as data so they're easy to update.
- **During the test:** a section timer and a question palette (answered / not answered / marked / not visited, as in real tests).
- **Auto-submit** when time runs out.
- **Analysis:** score, percentile-style comparison with your past mocks, topic heatmap, time sinks, and questions to revisit.

### Progress model (one localStorage store, new key e.g. `"apt:v1"`)
- **Per question:** attempts, correct, last result, time taken, bookmark, note, and spaced-repetition fields (reuse `Store.review`).
- **Per pattern:** attempts, accuracy and average time, which drive "weak patterns" on the dashboard.
- **Activity per day:** for the heatmap, streak and daily goal.

---

## 6. Visual aids to build as SVG generators (no images needed)

- **DI charts from a data spec:** bar, stacked bar, line, pie / donut and table, all themable in light and dark. The same spec drives
  the chart and the generated questions.
- **Venn diagrams** for syllogisms and set theory, with shaded regions per statement.
- **Family trees** for blood relations, with generation levels and +/- gender markers.
- **Direction paths** on a grid with N/E/S/W and the final displacement line.
- **Seating diagrams:** linear and circular tables, with facing arrows.
- **Clock faces** with the hands at a given time and the angle arc.
- **Dice and cube nets**, and a painted-cube counter (an n×n×n grid).
- **Calendar odd-days table.**
- **Visualizers** (step-through, reusing the viz.js engine):
  - alligation cross;
  - train crossing a platform (relative motion);
  - pipes filling a tank;
  - work-efficiency bars;
  - circular-track meeting points;
  - CI growth year by year;
  - syllogism Venn checking;
  - seating clue-by-clue solving.

---

## 7. Reuse from the DSA site (see AI-SITE-HANDOFF.md section 4 for the file-by-file table)

- **Copy unchanged:** `assets/style.css`, `common.js` (**remove `Store.merged()` and its call**), `fx/*`, `find.js`, `search.js` and
  `glossary.js` (replace the terms with aptitude jargon: CP, SP, MP, efficiency, odd days, alligation, syllogism…).
- **Copy the tools** `pages.py`, `stamp.js`, `cdp.js` and `lite.js`, and adapt them. Write a new `verify` for questions.
- **Python in the browser (`py.js`) isn't needed** for aptitude. Leave it out, or keep the playground as an optional
  "calculator / scratch Python" if the user wants it. **The Rough-work pad replaces it in the header.**
- **NeetCode-page parts worth borrowing:** the timer (with best time and pause when the tab is hidden), the roadmap canvas
  (could become a topic map), the list filters and the category tiles.
- **The dashboard** keeps its look (goal ring, streak cards, gauge, heatmap, course cards, weak spots). Rewrite its model for
  sections, topics, patterns, accuracy and speed.
- **Everything works offline** by double-clicking `index.html`. No CDN is needed except the Google font, which is optional.

---

## 8. "Refined" ideas to propose (let the user pick)

1. **Daily mixed set:** 20 questions picked from weak patterns + due reviews + new topics, with an "Up next" card on the dashboard.
2. **Speed drills:** 60-second rapid-fire mental math (squares, %, fractions, tables) with a personal best.
3. **Formula flashcards with spaced repetition**, and vocabulary flashcards (word, meaning, example, synonym / antonym).
4. **Pattern recognition mode:** see a question, then name the pattern and the formula before solving it.
5. **Mistake reasons:** after a wrong answer, tag why (concept / calculation / misread / time). The dashboard shows which reason dominates.
6. **Solve-by-options hints:** for each question, show whether back-solving from the options is faster.
7. **Company corner:** one page per company with its pattern, tips, and a mock preset button.
8. **Print / PDF formula sheet** with a clean print stylesheet.
9. **Ctrl+K** finds topics, patterns, formulas and questions by text.
10. **Focus mode** for mocks: hides the header and sidebar and goes full-screen, with no animations.

---

## 9. Build order (suggested)

1. Copy the engine, set up `site.js` (brand e.g. "Aptitude Hub", logo "AH", storeKey `apt:v1`, header links), and generate the pages.
2. Build the practice engine and question format, plus the verify tool, using **Percentages** as the first complete topic: learn page,
   patterns, 60+ questions and generators. Show the user and refine the UI.
3. Build the mock-test engine with one company preset.
4. Fill the rest of Quant topic by topic, then DI (chart generators first), then Reasoning (with the solvers), then Verbal.
5. Formulas page, flashcards, Revision / mistake book, dashboard analytics.
6. Polish: light and dark screenshots, keyboard flows, empty states, print stylesheet.

At each stage: run the verify tool (0 errors), test with `node tools/cdp.js`, send screenshots, and tell the user to press
**Ctrl + F5**.
