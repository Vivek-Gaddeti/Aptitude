# Stage 1 spec: engine + practice player + Percentages end to end

Read with `PLAN.md` (the agreed plan) and `design/practice-mockup.html` (the agreed look of the practice screen).
Reference site (READ-ONLY, never modify): `C:\Users\gkviv\OneDrive\Desktop\DSA`. Its hand-off notes:
`C:\Users\gkviv\OneDrive\Desktop\DSA\AI-SITE-HANDOFF.md` sections 2, 4, 5, 7 (design taste + lessons learned: obey them).
New site root: `C:\Users\gkviv\OneDrive\Desktop\Aptitude` (called ROOT below).

Hard rules for everyone
- Works from `file://` by double-clicking `index.html`: plain `<script>` tags, no modules, no fetch of local files, no build step needed to view.
- No emoji in the interface. Use `icon("name")` from common.js (add new line icons there if needed, 24×24, stroke currentColor).
- Light AND dark mode must look right. Use the CSS tokens (`--panel`, `--border`, `--muted`, `--accent`, `--green-soft`…), never hard-coded greys.
- Motion only under `:root[data-anim="on"]`, slow soft ease-out (0.3–0.6 s), nothing bouncy. Buttons never change size when the label changes (`swapLabel`).
- Every `[hidden]` element that has its own `display` rule needs `x[hidden]{display:none}`. Faded-out overlays get `pointer-events:none`.
- Site-specific localStorage keys start with `apt:` (the Store key is `apt:v1`). Theme / anim / glow keys stay shared (`theme`, `anim`, …).
- Plain-English, original text. Indian number formatting for money: ₹1,00,000 style (`QB.money`).

---

## 1. Files and who owns them

| File | Owner | Notes |
|---|---|---|
| `assets/style.css`, `assets/fx/*`, `assets/search.js` | Engine | copied from DSA; fx texts adapted |
| `assets/common.js` | Engine | copied; `Store.merged()` and its call removed; 7 nav colours; nav icons for the new labels; new block types (§5) |
| `assets/site.js` | Engine | SITE config + data containers + the tiny QB registry (§2) |
| `assets/find.js`, `assets/glossary.js` | Engine | Ctrl+K over catalog/learn/questions; aptitude glossary |
| `assets/home.js` | Engine | simple Stage-1 dashboard (full dashboard is Stage 2) |
| `data/catalog.js` | Engine | every section → topic → pattern from PLAN.md §2 (§3) |
| `tools/pages.py`, `tools/stamp.js`, `tools/lite.js`, `tools/cdp.js` | Engine | adapted copies |
| `assets/qbank.js` | Player | QB engine: RNG, option helpers, selection, recording, quiz blocks (§4, §6) |
| `assets/practice.js`, `assets/practice.css` | Player | the practice page (setup → player → review) |
| `assets/rough.js` | Rough-pad | header button + slide-out pad (draw / notes / calculator) |
| `tools/verify.js` | Verify | checks every question + runs generators (§7) |
| `data/learn/quant.js`, `data/briefs.js` | Content-learn | Percentages learn section |
| `data/gen/quant/percentages.js` | Content-learn | 10 generators |
| `data/q/quant/percentages-1.js` | Content-bank-1 | patterns 1–5, 15+ each |
| `data/q/quant/percentages-2.js` | Content-bank-2 | patterns 6–10, 15+ each |

Do not edit files you don't own. If you need something from another owner, use the interface below exactly as written.

## 2. Globals defined in `assets/site.js` (loaded first on every page)

```js
window.SITE = { storeKey: "apt:v1", brand: "Aptitude Hub", logo: "AH", home: "index.html", mascot: "walk",
  ring: { prefixes: ["quant:", "reasoning:", "verbal:", "di:"], total: <number of topics in catalog>, label: "topics learned" },
  links: [ ["index.html","Dashboard"], ["quant.html","Quant"], ["reasoning.html","Reasoning"], ["verbal.html","Verbal"], ["di.html","DI"],
    ["practice.html","Practice",[["practice.html","Practice","Drills, topic sets, daily set"],["mock.html","Mock tests","Company-style timed tests"],["strategy.html","Placement strategy","Company patterns and exam technique"]]],
    ["revision.html","Revision",[["revision.html","Review & mistakes","Due questions and your mistake book"],["formulas.html","Formula sheet","Every formula and table on one page"]]] ] };
window.LEARN = { quant: [], reasoning: [], verbal: [], di: [] };   // doc sections, filled by data/learn/*.js
window.BRIEFS = window.BRIEFS || {};
window.QB = {                                  // question registry, filled by data/q/**, data/gen/**, data/sets/**
  qs: [], byId: {}, sets: {}, gens: {},
  add(list) { list.forEach((q) => { this.qs.push(q); this.byId[q.id] = q; }); },
  set(id, spec) { this.sets[id] = Object.assign({ id }, spec); },
  gen(key, g) { this.gens[key] = Object.assign({ key }, g); },   // key = "sec/topic/pattern"
};
```
`assets/qbank.js` later does `Object.assign(QB, {...methods})`; data files only ever call `QB.add / QB.set / QB.gen`.

Header colours (`NAV_COLORS` in common.js, by link index): Dashboard blue `#4f7cff`, Quant mint `#1fae7a`, Reasoning lavender
`#8b6cf0`, Verbal pink `#e2609a`, DI teal `#22a3b6`, Practice peach `#ec8a4f`, Revision indigo `#6d6af0` (ink `#5552c9`, dark ink `#8f8cf5`).
Note DSA's order is blue, mint, lavender, peach, pink, teal, so the engine must reorder or extend the array to get this mapping.

## 3. `data/catalog.js`

```js
window.CATALOG = [
  { sec: "quant", name: "Quantitative Aptitude", short: "Quant", page: "quant.html", topics: [
    { id: "percentages", title: "Percentages", group: "Arithmetic", patterns: [
      { id: "percent-of", title: "% of a number & % ↔ fraction", gen: true }, ... ] },
    ... ] },
  { sec: "reasoning", ... }, { sec: "verbal", ... }, { sec: "di", ... } ];
```
- Transcribe **every** topic and pattern from PLAN.md §2 (ids: short kebab-case; `gen: true` for `G`, `solver: true` for `S`).
- Groups: Quant → "Number system" (number system, HCF & LCM, simplification), "Arithmetic" (percentages … TSD), "Counting & chance" (P&C, probability),
  "Geometry & mensuration", "Algebra" (algebra, progressions, logs), "Series, clocks & calendars", "Stats, sets & DS". Choose similar sensible groups for the others.
- **Percentages pattern ids are fixed** (content agents rely on them):
  1 `percent-of` · 2 `pct-change` · 3 `base-change` · 4 `successive-change` · 5 `product-constant` · 6 `growth-depreciation` ·
  7 `elections` · 8 `income-savings` · 9 `exam-marks` · 10 `back-calc`
- Pattern key everywhere = `sec/topic/pattern`, e.g. `quant/percentages/successive-change`.

## 4. Question format

### Bank question (`data/q/<sec>/<topic>-N.js`: `QB.add([...])`)
```js
{ id: "pct-successive-07",            // unique; prefix pct- for percentages, then a short pattern tag, then 2-digit number
  sec: "quant", topic: "percentages", pattern: "successive-change",
  d: "Easy" | "Medium" | "Hard",
  q: "A jacket's price is raised by **30%** and then cut by **30%**. It now sells for ₹910. What was the original price?",
  opts: ["₹910", "₹992", "₹1,000", "₹1,300"],   // exactly 4, distinct; "None of these" etc. allowed as the last option
  ans: 2,                                   // index of the correct option
  time: 45,                                 // target seconds (Easy 30–45, Medium 45–75, Hard 75–120)
  sol: ["Net change = a + b + ab/100 = 30 − 30 − 9 = −9%", "0.91 × P = 910 → P = **₹1,000**"],   // short steps, inline fmt allowed
  short: "Up x% then down x% is always a loss of x²/100 %.",     // the fastest method (optional but strongly wanted)
  trap: "Adding 9% back to 910 gives ₹992; the 9% is of the ORIGINAL.",   // the classic mistake (optional)
  why: ["Assumed +30% and −30% cancel", "Added 9% to 910 instead of dividing by 0.91", null, "Undid only the 30% cut"],  // per option, null for the correct one (optional)
  calc: "910 / (1.3 * 0.7)",                // JS expression = the numeric answer (see §7); OR
  check: "...",                             // JS boolean expression when the answer isn't a single number
  set: null }                               // id of a shared stimulus (DI/RC/puzzle), else omit
```
Inline text format (rendered by `fmt` from common.js): `**bold**`, `*italic*`, `` `code` ``. Use real characters: × ÷ − ² ³ √ ₹ → ≈.

### Generator (`data/gen/<sec>/<topic>.js`: `QB.gen(key, {...})`)
```js
QB.gen("quant/percentages/successive-change", {
  title: "Successive change",
  gen(rng, d) {               // d = "Easy" | "Medium" | "Hard"; must be deterministic for a given rng seed
    const a = rng.pick([10, 20, 25, 30]), ...;
    const o = QB.options(rng, [ [QB.money(ans), null], [QB.money(w1), "why w1 is tempting"], [..], [..] ]);  // first = correct
    return { q, ...o, time: 45, sol: [...], short: "...", trap: "...", calc: String(ans) };   // o = { opts, ans, why }
  } });
```
- The player adds `id: "g:" + key + ":" + d + ":" + seed`, `sec/topic/pattern/d` from the key. Regenerating with the same seed gives the same question.
- Distractors must come from **real mistakes** (wrong base, adding instead of compounding, forgetting a step…). If two candidates collide,
  generators must pick other numbers (loop with rng until all 4 options are distinct); never output duplicate option text.
- Use "nice" numbers so the answer is clean at the given difficulty (Easy: integers; Hard may have one decimal or ₹ with paise only if natural).

### Shared stimulus (`data/sets/*.js`: `QB.set(id, {...})`), for DI / RC / puzzles (none in Stage 1 except the player's test)
`{ title, kind: "passage" | "html" | "chart", text?: "paragraphs\n\nseparated", html?: "...", chart?: {...later} }`

### QB helpers that `assets/qbank.js` must provide (content + verify rely on them)
- `QB.rng(seed)` → function returning floats in [0,1) (mulberry32), with methods `.int(a, b)` (inclusive), `.pick(arr)`, `.shuffle(arr)` (copy), `.chance(p)`.
- `QB.options(rng, pairs)` → shuffles `[[text, why]…]` (first = correct) → `{ opts, ans, why }`. Throws if texts are not distinct.
- `QB.money(n)` → "₹1,000" / "₹1,25,000" (Indian grouping; up to 2 decimals only if non-integer). `QB.num(n)` same without ₹.
  `QB.pct(n)` → "12.5%" (trims trailing zeros, max 2 decimals). `QB.frac(a, b)` → "3/8" reduced.
- `QB.gcd`, `QB.lcm`, `QB.round(x, n)`.
- `QB.make(key, d, seed)` → a full question object from a generator (adds id/sec/topic/pattern/d).
- qbank.js must run in Node too (verify.js loads it): no DOM access at load time; guard DOM code with `typeof document !== "undefined"`.

## 5. Learn pages (doc sections), `data/learn/<sec>.js`

```js
LEARN.quant.push({ id: "percentages", group: "Arithmetic", title: "Percentages", sub: "one-line lead", tags: ["TCS", "Infosys", "AMCAT"],
  blocks: [ ...blocks ] });
```
Existing block types from the DSA engine still work: `"para"`, `["h2", t]`, `["h", t]`, `["p", t]`, `["list", [...]]`, `["ol", [...]]`,
`["table", headers, rows]`, `["tip"|"note"|"warn"|"danger", text, label?]`, `["ex", {t, d, q, idea, steps, out}]`, `["qa", q, a]`, `["html", raw]`.

New block types (the engine agent adds them to `renderBlock` in common.js):
- `["formulas", [[name, formula, note?], ...]]` → a neat two/three-column formula card (formula in a monospace-ish pill).
- `["pattern", { key: "quant/percentages/successive-change", title, spot: "how to recognise it", method: ["step", ...],
   ex: { q, steps: [...], ans }, shortcut?: text }]` → a pattern card: title, "How to spot it", "Method", a collapsible solved example,
   optional shortcut callout, and a **Practice this pattern →** link to `practice.html#drill/quant/percentages/successive-change`
   showing the pattern's attempts/accuracy from `Store.item("pat:" + key)` (`{n, c}`) if any.
- `["quiz", ["pct-basic-01", "pct-change-03", ...]]` → rendered by `QB.quizHTML(ids)` if `window.QB && QB.quizHTML` (else nothing).
  Inline MCQs, one-click answer, instant ✓/✗ + solution. Clicks handled by qbank.js (delegated listener); records via `QB.record`.

Topic shape (every topic, in this order): `["h2","The idea"]` concept in plain English → `["h2","Formulas"]` formulas block → `["h2","Shortcuts"]`
→ `["h2","Patterns"]` one pattern block per catalog pattern → `["h2","Common traps"]` → `["h2","Quick check"]` quiz block (5 bank ids).
`BRIEFS["quant:percentages"]` = two short plain-English paragraphs.

Learn pages for sections with no content yet show one placeholder section built by the engine from CATALOG ("Coming soon": the list of planned
topics and patterns), so DocPage never gets an empty list.

## 6. Progress model (Store from common.js, key `apt:v1`)

- `Store.item("q:<id>")` / `"g:<key>:<d>:<seed>"` → `{ n, c, last: 1|0, t: secondsLastTime, why: "concept"|"calc"|"misread"|"time"|"guess", star, mark, note,
  status/level/next (spaced repetition: a wrong answer sets status "revise" and next = now; a right answer on a "revise" item calls Store.review(k, true)) }`
- `Store.item("pat:<sec>/<topic>/<pattern>")` → `{ n, c, ts (total seconds), seen (timestamp) }`
- Learn sections use DocPage's keys: `quant:percentages` etc.
- `Store.bump()` once per answered question (drives heatmap / streak / daily goal). Daily goal default 25 questions.
- One function records an answer everywhere: `QB.record(q, chosenIndex, seconds)` → updates q-item, pat-item, bumps activity, saves once,
  returns `{ ok, item }`.

## 7. `tools/verify.js`

`node tools/verify.js` loads `assets/site.js`, `assets/qbank.js`, `data/catalog.js`, every `data/q/**/*.js`, `data/gen/**/*.js`, `data/sets/**/*.js`
in a Node `vm` context with `window = globalThis`, then reports errors (non-zero exit if any):
- ids unique; required fields present; `sec/topic/pattern` exist in CATALOG; `d` valid; exactly 4 opts, distinct (trimmed, case-insensitive);
  `ans` integer 0–3; `why` (if present) length 4 with `why[ans] == null`; `time` 10–300; `sol` non-empty; `set` (if present) exists.
- `calc`: evaluate with helpers in scope (`gcd lcm fact nCr nPr round sqrt pow abs floor ceil min max PI`). Parse the number in `opts[ans]`
  (strip ₹ , % spaces and words; handle `a/b` fractions and leading −/-) and require a match within half a unit of the option's last shown decimal
  place (or relative 1e-9 when calc is exact). Also require that **no other option** parses to the same value. Options that can't be parsed while
  `calc` is given → error.
- `check`: evaluate; must be `true`.
- A question with neither `calc` nor `check` is allowed only for sec reasoning/verbal (warning count printed for quant).
- Generators: for each key and each difficulty, run `QB.make` for seeds 1..2000; every result must pass the same checks above (calc required);
  determinism (same seed twice → identical JSON).
- Print a summary table: per topic → pattern: bank count by E/M/H, generator yes/no, errors. End with `0 errors` or the list.

## 8. Practice page `practice.html` (`assets/practice.js` + `assets/practice.css`)

Follow `design/practice-mockup.html` closely (session bar, segmented progress, timer ring with target, option cards with key chips,
result line, solution with Shortcut + Trap boxes, why-each-option text, mistake-reason chips, right rail: session stats, question palette, keys).

Routes (hash):
- `#` or `#setup` → **Setup**: choose Section (only those with questions/generators enabled; others greyed "coming soon"), Topics (multi),
  Patterns (multi, default all), Difficulty (E/M/H toggles), Count (10/20/30), Source (Bank / Generated / Mix, default Mix),
  Feedback (Instant / Test), Timing (Untimed / Target per question / Total timer = sum of targets). Plus a **pattern table** for the chosen
  topic: pattern, bank count, accuracy, avg time, buttons *Drill* and *Learn* (links to learn page `quant.html#percentages`).
  **Start** builds the session. Remember last setup in localStorage `apt:prac:setup`.
- `#drill/<sec>/<topic>/<pattern>` → **Pattern drill**: endless; generated questions when a generator exists (else cycle the bank, unseen first);
  difficulty adapts: start Easy, 3 right in a row → up, 2 wrong in a row → down. Ends when the user clicks End session → review.
- `#topic/<sec>/<topic>` → Setup with that topic preselected.
- `#run` → the player (session kept in `sessionStorage` `apt:prac:sess` so a reload resumes). `#review` → end-of-set review.

Player behaviour: one question at a time; keys 1–4 / A–D answer, Enter next, S solution, M mark, F bookmark, ←/→ previous/next answered question,
W toggles the rough pad (rough.js handles W itself; practice.js must not), Esc closes things. Keys are ignored while typing in an input/textarea.
Per-question timer pauses when the tab is hidden. Instant mode: after answering, show correct/incorrect, time vs target ("x s over" in amber when
slower; a "rushed?" note when wrong in under 30 % of the target), solution, shortcut, trap, why per option, reason chips (save to the q item).
Test mode: no feedback until the end; palette shows answered/marked only. Sets (`q.set`): stimulus pinned left (sticky), question right, "Set question k of n".

Review screen: score, accuracy, total and average time, a time strip (one bar per question, target tick, colour by result), a pattern table
(attempted, correct, avg time vs target), list of questions with expandable solutions, and buttons **Retry wrong ones**, **Add wrong to mistake book**
(sets status "revise" on those items: they then show up in Revision), **Drill weakest pattern**, **New set**.

Confetti: when a set finishes with ≥ 80 %, call `window.fxConfetti?.()` if fx-celebrate exposes something like it (check the DSA file; else skip).

## 9. Rough-work pad `assets/rough.js`

Loaded on every page. Adds a header button (pencil icon, title "Rough work (W)") right before the `.fx-slot` in `#topbar`, replacing the DSA
playground button's position. Pressing **W** (not in an input) or the button toggles a right slide-out drawer (380 px, full height under the header,
like the mock-up): tabs **Draw** (canvas: pen, eraser, clear; pointer events; crisp on high-DPI; ink colour follows the theme),
**Notes** (textarea, saved to `apt:rw:notes`), **Calculator** (buttons + keyboard input: digits, + − × ÷, %, √, x², parentheses, ⌫, C, =;
safe evaluator, no `eval` of arbitrary text). An **Exam mode** switch (saved `apt:rw:exam`) hides the Calculator tab ("Calculator is off in
exam mode"). Esc or ✕ closes. The drawer must not cover clicks when closed. Exposes `window.RoughPad = { toggle(), open(), close(), clear(),
setContext(id) }`. `setContext(qid)` keeps a separate drawing per question in memory (practice.js calls it on each question); the drawing is
lost on page reload, which is fine.

## 10. Pages (`tools/pages.py`)

All pages share the DSA template (head, theme script, topbar, fx scripts at the end, find.js, search.js) plus `assets/rough.js` and
`assets/practice.css` on every page. Script order: `site.js`, `common.js`, `data/catalog.js`, page data, page script, fx…, `data/progress.js`,
`find.js`, `search.js`, `rough.js`.
- `index.html` Dashboard: `assets/home.js`.
- `quant.html`, `reasoning.html`, `verbal.html`, `di.html`: DocPage with `LEARN.<sec>` (kind = sec), + `glossary.js`, `qbank.js`,
  `data/briefs.js`, `data/learn/<sec>.js` (if present), all `data/q/<sec>/*.js` (for quiz blocks).
- `practice.html`: `qbank.js`, all `data/q/**`, `data/gen/**`, `data/sets/**`, `practice.js`.
- `mock.html`, `strategy.html`, `revision.html`, `formulas.html`: placeholder content ("Coming in stage N" card + what it will hold) via a tiny
  inline script, so the header links work. (pages.py globs the data folders so new files are picked up automatically.)
`tools/lite.js` writes `data/progress.js`: `window.PROGRESS = { catalog: [...sec/topic/pattern titles], learn: { quant: [{id,title,group}], ... },
qcount: { "quant/percentages/successive-change": 15, ... } }` for find.js and home.js. Run order after edits:
`node tools/lite.js && python tools/pages.py && node tools/stamp.js`.
