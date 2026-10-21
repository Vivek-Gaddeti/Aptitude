# Batch spec: 10 questions per topic + the cheat sheet

Site root (ROOT): `C:\Users\gkviv\OneDrive\Desktop\Aptitude`. Read `docs/SPEC-stage1.md` §4 (question format, binding) and look at
`data/q/quant/percentages-1.js` for an accepted example. Topic and pattern ids come from `data/catalog.js` (CATALOG); use them exactly.
The DSA folder `C:\Users\gkviv\OneDrive\Desktop\DSA` is read-only reference; never edit it.

## A. Questions (question agents)

- One file per topic: `data/q/<sec>/<topic-id>.js` containing `QB.add([...])`. Edit ONLY the files for your topics (and `data/sets/<topic-id>.js` if you need shared stimuli).
- **Exactly 10 questions per topic** (more is fine for DI sets), spread over the topic's most important catalog patterns (cover as many patterns as 10 allows,
  most-asked first). Difficulty mix ≈ 3 Easy, 4 Medium, 3 Hard. Answer positions spread over A–D.
- ids: `<topic-id>-01` … `<topic-id>-10` (e.g. `time-work-07`, `coding-decoding-03`, `di-bar-05`).
- Every question: `id, sec, topic, pattern, d, q, opts (4 distinct), ans, time, sol (1–4 short steps), short, trap, why (4 entries, null at ans)`.
  `short`/`trap`/`why` are strongly wanted for quant & reasoning; for verbal `sol` must give the rule/reason in one line.
- **Correctness is the top priority.** Placement aptitude keys are easy to get wrong.
  - Quant & DI numeric answers: give `calc` (JS expression = the number shown in the correct option) so `node tools/verify.js` checks it.
    Use `check` (boolean JS) only when the answer isn't one number.
  - Reasoning: before writing a puzzle / seating / blood-relation / direction / syllogism / inequality / ranking / coding question, solve it with a
    small node script (brute force over all arrangements, or simulate) in your scratch folder and confirm **exactly one** option is correct
    (for seating/puzzles: exactly one arrangement satisfies the clues, or at least the asked fact is the same in every valid arrangement).
  - Verbal: one clearly correct option; standard Indian-English exam conventions; no "two could be right" items.
- Original text only (never copy RS Aggarwal, Arun Sharma, IndiaBix, PrepInsta, etc.). Placement-test style (TCS NQT, Infosys, Wipro, Accenture,
  Cognizant, Capgemini, AMCAT, eLitmus). Indian contexts, ₹ with Indian grouping (₹1,25,000).
- Inline formatting in q/sol: `**bold**`, `*italic*`, `` `code` ``. Use real characters × ÷ − ² ³ √ ₹ → ≈ π. For multi-line q text use "\n" (shown as line breaks).
- Figures (non-verbal, cubes/dice, counting figures, Venn): prefer text-only versions (letters/words/clock times for mirror images, numbered dice
  faces described in words, painted-cube counting by size, etc.). When a figure is unavoidable, put an inline SVG in a shared set:
  `QB.set("<id>", { title, kind: "html", html: "<svg viewBox=... width=\"100%\" style=\"max-width:360px\">…</svg>" })` drawn with
  `stroke="currentColor"`, `fill="none"` (or `fill="currentColor"` with opacity) so it works in light and dark, and point the question at it with `set`.
- Shared stimuli (RC passages, DI data, long puzzles): `QB.set(id, { title, kind: "passage", text: "para\n\npara" })` or `kind: "html"` (tables:
  plain `<table>` markup, no inline colours) or `kind: "chart"` (§C). Questions reference it with `set: "<id>"`. A set's questions get ids in the
  topic's normal sequence.

**Self-check before you report:** run `node tools/verify.js --only <topic-id>` for each topic (from ROOT). It must say 0 errors for your files.
(Other agents write other topics at the same time; ignore errors in files that aren't yours.) Also keep your own solver scripts' output.

## B. Cheat sheet (cheat-sheet agents)

Data: `data/formulas/<n>-<sec>.js`, each pushing into `window.FORMULAS = window.FORMULAS || []`:
```js
FORMULAS.push({ sec: "quant", topic: "percentages", title: "Percentages",
  items: [ ["Percentage change", "(new − old) ÷ old × 100", "always on the OLD value"], ... ],   // [name, formula, note?]
  tricks: ["…"], traps: ["…"] });
```
Memory tables in `data/formulas/0-tables.js`: `window.CHEAT_TABLES = [{ id, title, head: [...], rows: [[...]] , note? }, ...]`
(squares 1–30, cubes 1–20, fraction ↔ % for 1/2…1/20 incl. x/6, x/7, x/8, x/9, x/11, x/12, powers of 2 / 3 / 5, primes < 100, A=1…Z=26 with reverse
positions (A=26) and opposite letters (A↔Z), squares near 50/100 trick, multiplication by 5/25/125, day-codes for calendars, odd days per month/century).
Renderer `assets/formulas.js` exposes `window.CheatSheet()` (called by formulas.html, already wired in tools/pages.py) and renders into `#content`:
page title + lead, a search box (filters cards live, highlights matches, `/` focuses it), section chips (All · Quant · Reasoning · Verbal · DI ·
Tables), a compact sticky table of contents, one card per topic (formula rows in a neat grid: name | formula (monospace-ish pill) | note; then
Tricks and Traps lists), the memory tables, each card with a "Practice →" link to `practice.html#topic/<sec>/<topic>`, and a **Print** button
with a clean `@media print` stylesheet (no header/sidebar/buttons, two columns, black on white, cards don't split across pages).
Inject its CSS from the JS (one `<style id="cheatStyle">`) using the site tokens (`--panel`, `--border`, `--muted`, `--accent`, `--accent-soft`, …),
correct in light AND dark, no emoji (use `icon()`), motion only under `:root[data-anim="on"]`.

## C. DI charts (`assets/charts.js`, DI agent 1 owns it)

`Object.assign(QB, { chartHTML(set) { … } })` returns an inline SVG (themable: axes/text use `currentColor`/`var(--muted)`, series colours from a
fixed soft palette that reads in both themes) for `set.chart`:
```js
{ type: "bar" | "hbar" | "stacked" | "line" | "pie" | "donut" | "radar",
  labels: ["2020", "2021", …], series: [{ name: "Product A", data: [52, 58, …] }, …], unit: "₹ crore", yMax?: 100, note?: "…" }
```
Bars/lines show value labels when there are ≤ 8 points per series; pie/donut show % labels; a legend when > 1 series. `set.title` is drawn above
by the player. qbank.js already calls `QB.chartHTML(set)` when it exists. Must not throw in Node (verify.js loads data files only, not charts.js).
