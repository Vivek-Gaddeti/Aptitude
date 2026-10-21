# Completion spec: finish the content of Aptitude Hub

ROOT here is `/home/user/Aptitude` (the older specs say `C:\Users\gkviv\OneDrive\Desktop\Aptitude`; it is the same site).
The DSA reference folder is NOT available here; everything you need is in this repo.

Read before you start: `PLAN.md` (the agreed plan), `docs/SPEC-stage1.md` §4 (question + generator format) and §5 (lesson format),
`docs/SPEC-batch-q.md` §A (bank rules) and §C (chart spec), `docs/SPEC-final.md` (learn-section rules). Topic and pattern ids come
from `data/catalog.js`; use them exactly.

## Hard rules (everyone)
- **Edit ONLY the files your task names.** Other agents are writing other files in the same folder at the same time.
- Do NOT run `tools/pages.py`, `tools/lite.js` or `tools/stamp.js`, and do NOT touch any `.html` file, `assets/*`, `data/catalog.js`
  or `tools/*`. The integrator rebuilds the pages. Do NOT git commit or push.
- Plain `<script>`-loadable JS (no modules, no `require`, no `export`). Data files only call `QB.add`, `QB.set`, `QB.gen`,
  `LEARN.<sec>.push`, `BRIEFS[...] =`. Files must also load in Node (verify.js runs them): no DOM access at load time.
- Original text only (never copy from IndiaBix, RS Aggarwal, PrepInsta, etc.). Indian contexts, ₹ with Indian grouping (₹1,25,000).
  No emoji. Use real characters × ÷ − ² ³ √ ₹ → ≈ π. Inline format: `**bold**`, `*italic*`, `` `code` ``.
- **Correctness first.** Check every number with node. For reasoning puzzles/seating/blood relations/syllogisms etc., write a small
  brute-force script in your own scratch folder (`/tmp/claude-0/agent-<your-task-name>/`) and confirm exactly one option is correct.
- Self-check: `node tools/verify.js --only <topic-id>` for each of your topics must report **0 errors** (warnings about your own
  generators' variety must also be fixed). Ignore problems in files that aren't yours.
- Finish with a short report: files written, counts (questions / generators / lesson sections), the verify summary line(s), and
  anything you could not do.

## A. Lessons (`data/learn/<sec>-<n>.js`)
Copy the depth, voice and block usage of `data/learn/reasoning-1.js` (reasoning), `data/learn/verbal-1.js` (verbal) and
`data/learn/quant-1.js` (DI: numbers and charts). File header:
`window.LEARN = window.LEARN || {}; LEARN.<sec> = LEARN.<sec> || []; window.BRIEFS = window.BRIEFS || {};`
One `LEARN.<sec>.push({ id, group, title, sub, tags, blocks })` per topic (id / group / title exactly as in the catalog), plus
`BRIEFS["<sec>:<topic>"] = "two short plain-English paragraphs";`.
Topic shape, in order: `["h2","The idea"]` → `["h2","Formulas"]` (or "Rules") → `["h2","Shortcuts"]` → `["h2","Patterns"]` with ONE
`["pattern", { key: "sec/topic/pattern", title, spot, method: [...], ex: { q, steps: [...], ans }, shortcut }]` per catalog pattern of
the topic → `["h2","Common traps"]` → `["h2","Quick check"]` + `["quiz", [5 ids]]` using 5 EXISTING ids from `data/q/<sec>/<topic>.js`.
DI lessons: draw example charts with `["chart", { type, labels, series: [{ name, data }], unit }, caption]` (types: bar, hbar, stacked,
line, pie, donut, radar) and tables with `["table", head, rows]`. Diagrams: `["html", svg]` with `stroke="currentColor"` / `fill="none"`,
max-width ~420px, so they work in light and dark. Check: `node -e` load your file with `global.window=global` and confirm it parses, and
`node tools/verify.js --only <topic>` still 0 errors (quiz ids must exist).

## B. Generators (`data/gen/<sec>/<topic>.js`)
Model: `data/gen/quant/percentages.js` (helpers `wrap`, `mk`, distractors built from real mistakes with a `why` each, `calc`).
One `QB.gen("sec/topic/pattern", { title, gen(rng, d) {...} })` for EVERY catalog pattern of your topics marked `gen: true`.
Easy / Medium / Hard must all work; deterministic for a given rng; 4 distinct options; clean answers; `sol`, `short`, `trap`;
`calc` (number) or `check` so verify can prove the answer. Variety: >= 30% distinct question texts per difficulty (vary contexts,
names and wording, not just numbers). verify runs each generator 2,000 times per difficulty: it must report 0 errors and no
variety warnings for your keys.

## C. Bank questions (`data/q/<sec>/<topic>-2.js`, shared stimuli in `data/sets/<topic>-2.js`)
Target per topic: **20 new questions** so each topic reaches about 30, and **every catalog pattern of the topic has at least 2 bank
questions in total** (count existing ones in `data/q/<sec>/<topic>.js`; fill the empty / thin patterns first).
ids continue the topic's sequence: `<topic-id>-11` … `<topic-id>-30` (check the existing file for the id style and last number).
Difficulty ≈ 6 Easy / 8 Medium / 6 Hard; answer positions spread over A–D. Full fields as in SPEC-stage1 §4
(`id, sec, topic, pattern, d, q, opts, ans, time, sol, short, trap, why`, plus `calc` / `check` for quant & DI numbers).
Verbal: `sol` gives the rule in one line; exactly one defensible answer. DI / RC / puzzles: new sets via `QB.set` in
`data/sets/<topic>-2.js` with ids that start with `<topic-id>-s2-`, each set with 4–5 questions.

## D. DI generators (`data/gen/di/charts.js`)
A generated DI question needs its own chart: inside `gen(rng, d)` build the data, register it with
`QB.set(id, { title, kind: "chart", chart: {...} })` (or `kind: "html"` with a `<table>` for tables) using an id derived only from the
generated content (e.g. `"gdi-" + key + "-" + <hash of the numbers>`), and return `set: id` with the question. Because a generator is
deterministic, rebuilding a question from its seed re-registers the same set. Charts follow SPEC-batch-q §C.
