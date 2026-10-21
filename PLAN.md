# Aptitude Hub: plan for review

Nothing is built yet. This is the plan to agree on first. The mock-up of the practice screen is in
`design/practice-mockup.html` (double-click it; the bar at the bottom switches its states and light / dark).

---

## 1. Pages and navigation

**Header (7 links, same look as the Study Hub):**
`AH Aptitude Hub` · **Dashboard** · **Quant** · **Reasoning** · **Verbal** · **DI** · **Practice ▾** · **Revision ▾**
and on the right: **Rough work** (replaces the Python playground) · Find (Ctrl+K) · ✨ menu · theme switch. The streak flame, greeting,
logo ring, due badge and peek cards all stay.

| Colour | Link | Page(s) | What's on it |
|---|---|---|---|
| blue | Dashboard | `index.html` | Today's goal ring (default **25 questions**), streak, accuracy + avg time per section, **weak patterns**, "Up next" daily set, mock history chart, year heatmap, Export / Import / Reset |
| green | Quant | `quant.html` | Learn pages (doc page with sidebar). Every topic follows one shape: *In short* → concept → formulas → shortcuts → **patterns** (each: how to spot it, method, solved example, **Practice this pattern** button) → traps → 5 quick-check MCQs |
| purple | Reasoning | `reasoning.html` | Same shape, plus the visual aids (Venn, family tree, direction grid, seating, dice / nets) |
| pink | Verbal | `verbal.html` | Same shape; grammar rules as a numbered rulebook that every verbal answer cites |
| teal | DI | `di.html` | Chart types + calculation tricks; every chart is drawn from a data spec (SVG, themable) |
| orange | Practice ▾ → **Practice** | `practice.html` | Setup screen → one-question-at-a-time player → end-of-set review. Modes: Pattern drill · Topic practice · Mixed / Daily set · Speed drill |
| | Practice ▾ → **Mock tests** | `mock.html` | Company presets (as data), the exam-style test screen, results + history |
| | Practice ▾ → **Placement strategy** | `strategy.html` | Doc page: one section per company (pattern, tips, "Start this mock"), plus exam technique and mental-math tricks |
| indigo | Revision ▾ → **Review & mistakes** | `revision.html` | Due reviews (spaced repetition), mistake book grouped by pattern and by *mistake reason*, bookmarks |
| | Revision ▾ → **Formula sheet** | `formulas.html` | Every formula + shortcut on one searchable, printable sheet; memory tables (squares 1–30, cubes 1–20, fraction ↔ %, powers of 2/3/5, primes to 100, A=1…Z=26 and reverse) |
| | Revision ▾ → **Flashcards** | inside `revision.html` (tab) | Formula cards and vocabulary cards (word, meaning, example, synonym / antonym), spaced repetition |

Every "Practice this pattern" button deep-links into the player, e.g. `practice.html#drill/quant/percentages/successive-change`.
Ctrl+K finds topics, patterns, formulas and question text.

---

## 2. Topic → pattern list

`G` = gets a **generator** (unlimited fresh questions); `S` = answers checked by a **solver** in the verify tool. Everything else is a
hand-written bank with a one-line reason per answer.

### Quantitative Aptitude (27 topics)
1. **Number system:** divisibility rules · unit digit by cyclicity `G` · last two digits `G` · remainders: basic & remainder theorem `G` ·
   remainders of large powers (cyclicity, Fermat / Euler) `G` · factors: count / sum / even-odd / perfect-square factors `G` ·
   trailing zeros in n! `G` · highest power of a prime in n! `G` · primes & co-primes · base conversion `G` · place value & digit sums
2. **HCF & LCM:** HCF / LCM by prime factors `G` · HCF × LCM = product `G` · HCF / LCM of fractions `G` · greatest number leaving given
   remainders `G` · least number leaving given remainders `G` · bells / traffic lights together `G` · tiles, rows, cutting into equal pieces `G`
3. **Simplification & approximation:** BODMAS `G` · fractions & decimals (recurring decimal → fraction) · surds & indices · square / cube
   roots · approximation (bank-style "?") `G`
4. **Percentages:** % of a number & % ↔ fraction `G` · percentage change `G` · "A is x% more than B, so B is ?% less" (base change) `G` ·
   successive change `G` · price × consumption constant `G` · population growth / depreciation `G` · elections & votes `G` ·
   income–expenditure–savings `G` · exam marks, pass / fail `G` · back-calculating the original value `G`
5. **Profit, loss & discount:** basic P / L % `G` · CP : SP ratios `G` · marked price & discount `G` · successive discounts `G` ·
   dishonest dealer / false weights `G` · buy x get y free `G` · two items at the same SP (x% gain and x% loss) `G` · profit % on SP vs CP `G` ·
   finding CP from two selling scenarios `G`
6. **Simple & compound interest:** SI basics; find P / R / T `G` · CI annual `G` · half-yearly & quarterly `G` · CI − SI for 2 and 3 years `G` ·
   becomes n times / doubling (rule of 72) `G` · equal instalments `G` · different rates each year `G`
7. **Ratio, proportion & variation:** ratio basics `G` · dividing an amount `G` · combining ratios (a:b, b:c → a:b:c) `G` · mean / third /
   fourth proportional `G` · coins & notes `G` · adding / removing to change a ratio `G` · income & expenditure ratios `G` · direct & inverse variation `G`
8. **Partnership:** equal time `G` · different times `G` · working partner's salary `G` · investment changed midway `G`
9. **Mixtures & alligation:** alligation (mean price) `G` · mixing two solutions to a target % `G` · repeated replacement `G` · removing & adding
   water `G` · three mixtures
10. **Averages:** basic `G` · new member replaces one `G` · members added / removed `G` · consecutive numbers `G` · cricket averages `G` ·
    weighted average `G` · correcting a wrongly copied value `G`
11. **Problems on ages:** ratio now / then `G` · sum and ratio `G` · "n years ago it was k times" `G` · parent & children `G`
12. **Time & work:** days → efficiency `G` · LCM (total-work) method `G` · together, then one leaves `G` · alternate days `G` · M₁D₁H₁/W₁ =
    M₂D₂H₂/W₂ `G` · work & wages `G` · "A is twice as efficient as B" `G` · men, women & children groups `G`
13. **Pipes & cisterns:** fill / empty together `G` · a leak `G` · alternate opening `G` · closed after some time `G` · tank capacity from rates `G`
14. **Time, speed & distance:** basics & km/h ↔ m/s `G` · average speed (equal distances) `G` · late / early at two speeds `G` · relative speed
    `G` · trains: pole / man `G`, platform / bridge `G`, two trains `G`, train and a walking man `G` · boats & streams `G` · races & head starts `G` ·
    circular track meetings `G` · chase (police & thief) `G` · stoppages per hour `G`
15. **Permutations & combinations:** counting principle `G` · arrangements with restrictions (together / apart) `G` · words from letters with
    repeats, vowels together `G` · circular arrangements & necklaces `G` · selection nCr, at least / at most `G` · committees with conditions `G` ·
    distribution (identical / distinct) · handshakes, diagonals, lines & triangles from points `G` · forming numbers from digits `G`
16. **Probability:** coins `G` · dice (sums, doubles) `G` · cards · balls from bags, with / without replacement `G` · at least one (complement)
    `G` · independent & conditional basics · odds · arrangement-based probability
17. **Mensuration 2D:** rectangles & squares `G` · triangles (Heron, equilateral) `G` · circles, sectors, rings `G` · paths around / inside a
    field `G` · % change in area `G` · trapezium, rhombus, parallelogram `G`
18. **Mensuration 3D:** cube & cuboid `G` · cylinder `G` · cone (and frustum basics) `G` · sphere & hemisphere `G` · melting & recasting `G` ·
    water level rise `G` · cost of painting / tiling `G`
19. **Geometry basics:** angles & parallel lines · triangle properties & Pythagorean triplets · similarity & area ratios · circle theorems
    (chords, tangents) · polygons (angles, diagonals) `G` · coordinate basics (distance, midpoint, slope, area) `G`
20. **Algebra:** linear equations `G` · word problems → equations `G` · quadratics (roots, sum / product) `G` · inequalities & modulus · identities
21. **Progressions:** AP nth term & sum `G` · GP nth term & sum, infinite GP `G` · AM / GM / HM · word problems (growing savings) `G`
22. **Logarithms:** laws · change of base · log equations · number of digits via log `G`
23. **Number series:** differences (1st / 2nd order) `G` · multiplicative `G` · squares / cubes ± k `G` · two interleaved series `G` · mixed
    (×a + b) `G` · prime-based `G` · wrong number `G` · missing number `G`
24. **Clocks:** angle at a time `G` · coinciding / opposite / right angle `G` · gaining & losing clocks `G` · clock in a mirror `G` · how many times a day
25. **Calendars:** odd days & leap years · day of the week for a date `G` · "n days after Monday" `G` · repeating calendar years `G`
26. **Statistics:** mean / median / mode `G` · range & standard deviation basics `G` · effect of adding / multiplying every value `G`
27. **Sets & Venn (quant) and Data sufficiency (quant):** two-set `G` · three-set (only / exactly / at least) `G` · max & min overlap `G` ·
    DS with the standard five options

### Logical Reasoning (21 topics)
1. **Series:** letter series `G` · alphanumeric `G` · letter clusters `G` · repeating patterns (aab_ab…) `G`
2. **Analogies:** number `G` · letter `G` · word relationships (tool–worker, part–whole…)
3. **Classification (odd one out):** numbers `G` · letter groups `G` · words
4. **Coding–decoding:** letter shift `G` · reverse / opposite letters (A↔Z) `G` · position-sum & number codes `G` · substitution ("sky is called
   blue") · sentence → code tables · mixed operations (swap halves, reverse then shift: TCS-style) `G` · symbol codes
5. **Blood relations:** direct `S` · "pointing to a photo" `S` · family puzzles `S` · coded symbols (A + B means…) `S` · generation chains `S`
6. **Direction sense:** final direction after turns `G` · distance & direction from start (Pythagoras) `G` · shadows at sunrise / sunset `G` ·
   coded directions `G`
7. **Seating arrangement:** one row, same direction `S` · one row, mixed facing `S` · two rows facing each other `S` · circle facing the centre `S` ·
   circle facing outside / mixed `S` · square & rectangular tables `S`
8. **Puzzles:** floors & flats `S` · box stacking `S` · scheduling (days / months) `S` · comparison (heights, weights) `S` · multi-attribute grids
   (person–colour–city) `S`
9. **Order & ranking:** rank from both ends → total `G` · positions swapped `G` · minimum number of people `G` · rank among those who passed `G`
10. **Syllogisms:** two statements `S` · three statements `S` · possibility cases `S` · "only a few" `S` · either–or pairs `S`
11. **Statements:** conclusions · assumptions · arguments (strong / weak) · course of action · cause & effect
12. **Inequalities:** direct (A > B ≥ C) `S` · coded symbols `S` · either–or conclusions `S`
13. **Input–output machine:** word rearrangement `S` · number sorting `S` · words + numbers `S` · find a step / the previous step `S`
14. **Data sufficiency (reasoning):** blood relations · ranking · direction · coding
15. **Cubes & dice:** painted cube counting `G` · cubes with differently painted faces `G` · opposite faces from several views `S` · standard dice
    rules · nets
16. **Counting figures:** triangles · squares & rectangles · lines
17. **Non-verbal:** mirror images · water images · paper folding & punching · embedded figures · pattern completion · figure series · figure
    analogy & classification (all drawn as SVG)
18. **Venn-diagram reasoning:** which diagram fits (e.g. doctors, women, mothers) · counting regions
19. **Critical reasoning:** strengthen · weaken · inference · assumption · main point · paradox
20. **Logical deduction (eLitmus):** truth-tellers & liars `S` · binary / flipped statements `S` · who is lying `S` · cryptarithmetic (addition,
    multiplication) `S`
21. **Alphabet test:** letter positions `G` · dictionary order `G` · words from the letters of a word

### Verbal Ability (11 topics)
1. **Reading comprehension:** main idea / title · specific detail · inference · tone & attitude · vocabulary in context · author's purpose ·
   true / false / cannot say (TCS-style)
2. **Error spotting:** subject–verb agreement · tenses · articles · prepositions · pronouns · modifiers · parallelism · conjunctions &
   correlatives · degrees of comparison · adjective vs adverb · redundancy · question tags · conditionals
3. **Sentence correction / improvement:** replace the underlined part · "no improvement"
4. **Fill in the blanks:** vocabulary · grammar · double blanks · collocations · phrasal verbs
5. **Para jumbles:** opening sentence · mandatory pairs (pronoun → noun) · connectors & time order · fixed first and last · odd sentence out
6. **Sentence & para completion:** last sentence · middle sentence · logical conclusion
7. **Cloze test:** grammar-based · vocabulary-based
8. **Vocabulary:** synonyms · antonyms · one-word substitution · idioms & phrases · confused words (affect / effect) · spellings · same word, different
   uses · verbal analogies
9. **Voice:** active ↔ passive for every tense, modals, imperatives, questions
10. **Narration:** direct ↔ indirect for statements, questions, commands, exclamations
11. **Writing:** email writing (structure, tone, using the given phrases) · essay planning · communication-test tips (Versant-style)

### Data Interpretation (10 chart types × the same question patterns)
- **Chart types:** table · multiple tables · bar (simple / grouped / stacked / horizontal) · line (single / multiple) · pie & donut (% and degrees,
  two pies) · mixed (bar + line, table + pie) · caselets (paragraph → table) · missing-data tables · radar · Venn-based DI
- **Question patterns** (asked of every chart, generated from its data spec `G`): direct read · % change / growth · ratio of two values ·
  share of total · average · max / min / rank · "how many years above average" · approximate value · CAGR roughly · combined (e.g. profit from
  income and expense)
- **Calculation tricks:** fraction ↔ % table · approximation · % change at a glance · ratio comparison without full division · CAGR roughly ·
  averages from a chart · fast multiplication

### Placement strategy (`strategy.html`)
- **One section per company:** TCS NQT · Infosys · Wipro · Accenture · Cognizant · Capgemini · HCL · Tech Mahindra · Deloitte · AMCAT ·
  eLitmus (pH test) · CoCubes / Aon · bank-style. Each gives sections, counts, time, negative marking, cut-off style, tips and a **Start this mock**
  button, and is labelled **"check the latest pattern"**.
- **Exam technique:** time budgeting, what to skip, elimination, back-solving from options, mental math (squares near 50 / 100, × 5 / 25 / 125,
  Vedic basics), and a weekly practice plan.

**Size:** about 330 patterns (Quant ~185, Reasoning ~90, Verbal ~50, DI ~10 chart types × 10 question patterns). The bank aims for
**15+ hand-checked questions per pattern** (Easy / Medium / Hard): about 3,000 in total over all the stages. `G` patterns also get
**unlimited generated questions**, so their bank can start smaller (8–10 tricky, hand-picked ones) and grow.

---

## 3. Practice and mock-test design

### Modes (all in `practice.html`, one player)
| Mode | What it serves | Default |
|---|---|---|
| **Pattern drill** | One pattern, endless: generated questions (or the bank for non-`G` patterns), adapts Easy → Hard as you get them right | untimed, instant feedback |
| **Topic practice** | Pick section → topics → patterns → difficulty → count (10 / 20 / 30) | instant feedback |
| **Daily set** | 20 questions: ~40% weak patterns, ~30% due reviews, ~30% new or not seen recently. "Up next" on the dashboard | instant feedback |
| **Speed drill** | 60-second mental-math rapid fire (squares, %, fractions, tables), with a personal best | timed |

Every mode can be **Instant** (✓/✗ plus the solution after each answer) or **Test** (no feedback until the end), and **Untimed**, **Target per
question** or **Total timer**.

### The question screen (see the mock-up)
- **One question per screen:** large option cards and a session bar with a breadcrumb, *Q 7 of 20*, a segmented progress line that colours in
  green / red as you go, and the timer showing *your time / target*.
- **Keys:** **1–4** or **A–D** answer · **Enter** next · **S** solution · **M** mark for review · **F** bookmark (*flag*: B is taken by option B) ·
  **W** rough-work pad · **←/→** move through answered questions.
- **After an answer (Instant):** the correct card turns green and yours red, with a result line *0:52 vs 0:45 target · slower than target*.
  Then come the step-by-step solution, a **Shortcut** box, a **Trap** box and **why each wrong option is tempting**. Generators know which
  mistake makes each wrong option, so this comes for free. Fast but wrong answers get a "rushed?" flag.
- **Mistake reason** chips after a wrong answer: *Concept · Calculation · Misread · Time pressure · Guessed*. They're optional, one click, and
  feed the dashboard and mistake book.
- **Right rail:** session stats (score, accuracy, avg time), the question palette, and key hints.
- **DI / RC / puzzle sets:** the chart, passage or puzzle setup stays **pinned on the left** and the questions sit on the right, with *Set question 2 of 5*.
- **Rough-work pad (W):** slides in from the right. It has **Draw** (pen, eraser, clear, saved per question), **Notes**, and a **Calculator**
  that **Exam mode** switches off. It doesn't move the question.
- **End-of-set review:** score, accuracy, time per question (bar strip with the target line), a pattern-by-pattern table, and the buttons
  **Retry wrong ones**, **Add all wrong to mistake book** and **Drill my weakest pattern**.

### Mock tests (`mock.html`)
- **Presets are data** (`data/mocks.js`): sections, question counts, minutes per section (or overall), negative marking, section locking, and the topic mix
  each section draws from. The first preset is a TCS NQT-style numerical + reasoning + verbal test. The others are added as their topics are built.
- **Exam-like screen:** **focus mode** (header and sidebar hidden, no animations), a section timer, a **question palette** with the real-test states
  (*answered · not answered · marked · answered & marked · not visited*), **Save & next**, **Clear response**, **auto-submit** at 0:00, and
  "Are you sure?" with the counts before submitting.
- **Question choice:** from the bank following the preset's topic mix, avoiding questions you saw in the last few mocks, using a saved seed
  so you can **retake the same mock**.
- **Analysis:** score with negative marking, accuracy, the attempt rate, your rank against your own past mocks, a topic heatmap, time sinks (the
  longest questions), and questions to revisit, each with one-click **Add to mistake book**.

### Progress model (localStorage key `apt:v1`; site-specific keys get the prefix `apt:`)
- **Per question** (`q:<id>`, generated ones as `g:<pattern>:<seed>` so they can be rebuilt exactly): attempts, correct, last result, time,
  mistake reason, bookmark, note, and spaced-repetition fields (reusing `Store.review`).
- **Per pattern** (`pat:<sec>/<topic>/<pattern>`): attempts, accuracy, average time and last-seen date. These drive the weak patterns and the
  daily set.
- **Per learn section:** learned / needs revision / bookmark, as in the Study Hub.
- **Per day:** questions done and correct, which drive the heatmap, streak and goal ring. **Mocks:** a list of results.

### Correctness (the verify tool must show 0 errors before every hand-off)
`node tools/verify.js` checks every question: the `ans` index is valid, options are distinct, the correct option appears exactly once, the
fields are complete, and ids are unique. It also runs:
- each quant `check` expression;
- every generator 5,000 times (unique correct answer, no duplicate options);
- a brute-force solver for seating, puzzles and logical deduction (*exactly one* arrangement);
- a Venn-region enumerator for syllogisms and inequalities;
- a family-graph / coordinate solver for blood relations and directions;
- a cryptarithm solver.

Verbal answers each carry a one-line reason that cites a rule number from the grammar rulebook.

All questions are original. Patterns and formulas are standard, but no question text is copied from books or sites.

---

## 4. "Refined" extras (my picks are marked ★; you choose)
1. ★ Daily mixed set with an "Up next" card
2. ★ 60-second speed drills with a personal best
3. ★ Formula and vocabulary flashcards (spaced repetition)
4. Pattern-recognition mode (name the pattern before solving): *later*
5. ★ Mistake reasons (concept / calculation / misread / time)
6. Solve-by-options hint ("back-solving is faster here"): *later, as a small tag in the solution*
7. ★ Company corner, folded into `strategy.html` and mock presets
8. ★ Printable formula sheet
9. ★ Ctrl+K over topics, patterns, formulas and questions
10. ★ Focus mode for mocks

---

## 5. Build stages
1. **Engine + Percentages end to end:** copy the engine (style, common minus `Store.merged()`, fx, find, search, glossary with aptitude terms,
   tools), write `site.js` (Aptitude Hub · AH · `apt:v1` · new header), generate pages, then build the **practice player**, the question format,
   `verify.js`, the generators and the **Percentages** topic (learn page, 10 patterns, 150+ bank questions, generators). Screenshots in light and
   dark.
2. **Mock engine** + the first preset + the dashboard model (goal, weak patterns, heatmap).
3. **Quant**, topic by topic (number system → … → DS), in batches of 3–4 topics per hand-off.
4. **DI**: the chart generators first, then the sets.
5. **Reasoning**, with the solvers and visual aids.
6. **Verbal**: the rulebook, then the banks and RC sets.
7. **Formula sheet, flashcards, revision / mistake book, strategy page.**
8. **Polish:** keyboard flows, empty states, print stylesheet, final light / dark pass.

Each stage ends with: verify (0 errors) → `node tools/cdp.js` checks + screenshots in light and dark → a short summary → you press **Ctrl + F5**.
