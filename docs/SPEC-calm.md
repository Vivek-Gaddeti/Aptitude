# Spec: calm brutalism, quality-of-life fixes, tablet thumb rail

The approved design is the canvas "Aptitude Hub: calm brutalism" (summarised here; you cannot open it).
Keep the neo-brutalist identity (ink outlines, flat bright fills, square corners, Archivo + Space Mono, the colour tokens
in `assets/brutal.css`) but make it calm, uncluttered and to the point.

## Hard rules (everyone)
- **Edit ONLY the files you own** (table below). Other agents edit other files at the same time.
- Do NOT run `tools/pages.py`, `tools/lite.js`, `tools/stamp.js`; do not edit `.html` pages, `data/**`, `tools/**`. Do not commit.
- Works from `file://` (plain scripts, no modules, no fetch of local files). No emoji; icons via `icon()` from common.js
  or inline stroke SVG. Light AND dark mode via the CSS tokens (`--ink`, `--panel`, `--panel-2`, `--bg`, `--text`,
  `--muted`, `--accent`, `--f-pink/green/yellow/blue/orange/lilac`, `--green-soft` …), never hard-coded greys.
- Motion only under `:root[data-anim="on"]`. Every `[hidden]` element with its own display rule needs `x[hidden]{display:none}`.
- Touch targets >= 44px. Text contrast >= 4.5:1. Real `<button>` / `<a href>` / labelled inputs.
- Keep every existing feature working (keyboard shortcuts, recording answers, mocks, revision, export/import).
- Per-viewer preferences in `localStorage` with the `apt:` prefix, wrapped in try/catch.

## Design rules (from the canvas)
1. **One loud thing per screen.** Only the primary action gets the loud treatment: `.btn.primary` (3px ink border,
   accent fill, 4px hard shadow). At most one hero card per screen: class **`.is-hero`** (3px border + 6px hard shadow).
   Every other card, panel, tile, chip and secondary button is **flat**: 2px ink border, no shadow, no hover lift.
2. **Cards stay flat** (see 1). Hover on clickable cards: background `var(--panel-2)` only, no translate, no shadow.
3. **Colour always means something**: section colours (Quant pink, Reasoning green, Verbal yellow, DI blue,
   Practice orange, Revision lilac), states (correct green, wrong pink-soft, selected = ink fill with white text,
   tip/shortcut = green-soft). No decorative fills.
4. **Type with a job each**: page title only = Archivo 900 UPPERCASE; section headings (h2/h3) = 800, **sentence case**
   (no text-transform), labels = Space Mono 12px uppercase muted, numbers/timers = Space Mono. Body 16px / 1.5.
5. **Show less, at the right time**: hide empty panels until there is data; sensible defaults with options folded
   behind "More options"; details on demand (`<details>`); decoration off (no dot-grid background, effects menu,
   mascot walker, greeting).

## Shared contracts (all agents rely on these exact names)
- **Loud classes**: `.btn.primary` and `.is-hero` (defined by SHELL in brutal.css). Use them; don't restyle them.
- **Device mode**: SHELL sets `document.documentElement.dataset.device = "tablet" | "desktop" | "phone"` early (in
  common.js, before first paint where possible) and keeps it updated on resize:
  tablet = `localStorage["apt:layout"]==="tablet"`, or (`apt:layout` is "auto"/unset AND `(pointer: coarse)` AND the
  short side >= 600px AND long side <= 1400px); phone = width < 700px; else desktop. `apt:layout` may also be "desktop".
- **Hand**: `document.documentElement.dataset.hand = "right" | "left"` from `localStorage["apt:hand"]` (default "right").
  Thumb rails sit on that side.
- **Global rail** (SHELL): in tablet mode the top header is replaced by a vertical rail on the hand side: logo at top,
  nav items (icon + label, 60px tall) in the lower half, then Search and Rough work at the very bottom (thumb zone).
  Content gets padding on that side (`--rail-w: 112px`).
- **Session rail** (PRACTICE and MOCK): while a question session or mock exam is running, the page adds
  `document.body.classList.add("in-session")` and renders its own `<aside class="session-rail">`. In tablet mode SHELL
  hides the global rail when `body.in-session`; the session rail takes its place on the hand side (width
  `var(--rail-w-session, 132px)`): top = End + Q x/N + timer; middle/bottom = tool buttons (Solution S, Mark M,
  Bookmark F, Rough work W; mock: palette, Clear, Mark); bottom-most = the one primary action (Check / Next / Save & next)
  at least 112px tall. Outside tablet mode the session rail is hidden (or not rendered) and the normal layout is used.
- **Resumable session**: PRACTICE writes `localStorage["apt:session"] = { route, title, idx, total, at }` while a set is
  in progress (and removes it when the set ends or is ended); `route` is the practice.html hash that restores it.
  DASH shows "Resume: <title> · Q idx/total" as the first card when it exists and is < 24 h old.
- **Settings** (SHELL): the header/rail settings menu offers Theme, Layout (Auto / Desktop / Tablet), Rail side
  (Right / Left), Text size (Normal / Large: `html[data-text="lg"]` scales root font to 112.5%), Effects (off by default:
  `localStorage.anim` default "off" unless the user turned it on).

## Ownership and tasks

| Owner | Files | Tasks |
|---|---|---|
| SHELL | `assets/brutal.css`, `assets/style.css`, `assets/common.js`, `assets/fx/*`, `assets/find.js`, `assets/search.js`, `assets/rough.js`, `assets/glossary.js` | Global calm rules (flatten shadows/lifts everywhere except `.btn.primary`, `.is-hero`; sentence-case h2/h3/card titles; remove dot-grid; quieter header: plain nav links, active = ink fill white text; drop the ✨ effects button from the header into Settings; no mascot walker/greeting). Lesson pages (DocPage in common.js): title, one-line lead, then ONE row: primary "Practise <topic>" (links to `practice.html#topic/<sec>/<topic>`), a "Mark as learned" checkbox-style toggle, the other status actions as quiet text buttons, company tags as one muted line "Asked in …"; formulas block = clean 3-column table, formula in Space Mono plain text (no pink pills); pattern cards flat. Device/hand/text-size/layout settings + tablet global rail + `body.in-session` handling. QoL: skip-to-content link; on lessons a sticky (bottom on phone/tablet) "Practise this topic" button after scrolling past the header; "Back to top" button on long pages; rough-work pad opens on the hand side on tablets. |
| DASH | `assets/home.js` | Rebuild the dashboard per the canvas: optional Resume card first; ONE `.is-hero` "Today's set" card (TODAY label, title, one-line description, goal progress bar, primary "Start today's set", text link "Change daily goal", streak block inside the hero); a row of three flat shortcut cards (Continue learning <next topic>, Speed drill, Mock test Quick 15); "Sections" as one flat list (colour square, name, learned progress, Learn and Practise links); weak patterns, why-you-miss, accuracy per section and mock history appear ONLY when they have data (otherwise one muted line "Your weak patterns, mistake reasons and mock history show up here after your first 10 answers."); the year heatmap moves behind a "Year view" `<details>` at the bottom (only when there is activity). Keep Export / Import / Reset reachable (settings or a footer link). Works in tablet mode (content only; the rail is SHELL's). |
| PRACTICE | `assets/practice.js`, `assets/practice.css` | Setup: H1 PRACTICE + one line; quick-start row of three flat buttons (Daily set, Speed drill, Mock tests); one flat card: 1 · Section (segmented buttons, selected = section colour fill), 2 · Topic (chips grouped by catalog group with group headings; selected = ink fill), then folded `<details>` "Patterns: all N in <topic>" (the pattern picker inside) and "More options" (difficulty, count, source, feedback, timing); summary bar at the bottom of the card with "N questions · <topic>" + one-line defaults + the primary Start. Remove the duplicated pattern table or fold it into the Patterns details. Question screen: thin header (End, breadcrumb sec chip › topic › pattern, Q x/N, your time / target, segmented progress); NO right rail on desktop: centred column max 760px; options plain (no per-option "why" text visible); after answering: the chosen wrong option pink-soft with "Your answer ×", correct green with "Correct ✓", then ONE flat card: result line + time vs target, numbered solution, shortcut (green-soft box), `<details>` "Why the other options are tempting" (per-option why + trap), optional one-line mistake-reason chips; bottom row: bookmark, "?" (opens keyboard shortcuts popover), primary Next. Session stats / palette move into a popover or a collapsible "Session" button. Phone: question first. Tablet: render the session rail (contract above) with Check/Next as the big bottom button; options in a right-hand column in landscape. QoL: remember the last setup (`apt:lastSetup`) and preselect it; resumable session (contract); `beforeunload` confirm while a set is in progress; on touch devices swipe left/right on the question = next/previous answered; "Retry wrong ones" on the review stays. |
| MOCK | `assets/mock.js`, `assets/revision.js`, `assets/formulas.js` | Apply the calm rules to their injected styles (flat cards, one primary per screen, sentence-case headings). Mock exam: in tablet mode render the session rail (End, section tabs, timer, palette toggle, Clear, Mark; bottom primary "Save & next"); `body.in-session` during the exam; `beforeunload` confirm during an exam. Mock list: presets as a calm list/table with one Start per row (flat). Revision and formula sheet: flatten, sentence-case headings, keep search/print. |

## Testing (each agent, for its own screens)
Playwright is at `/opt/node-tools/node_modules/playwright`, Chromium at `/opt/pw-browsers/chromium` (headless,
`file:///home/user/Aptitude/<page>.html`). Check: no page errors; light and dark (`localStorage.theme`); desktop
1440×900; tablet 1180×820 and 820×1180 with `localStorage["apt:layout"]="tablet"`; phone 390×844 (no horizontal
scroll). Look at your screenshots (Read the PNGs). Put scripts and screenshots in `/tmp/claude-0/agent-<name>/`.
Finish with a short report: what changed, screenshots you checked, anything left undone.
