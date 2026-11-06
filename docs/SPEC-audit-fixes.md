# Spec: fixes from the full-site audit (2026-11-06) + pen support

Three read-only audits (UI/UX, technical, content) found the items below. Content fixes (data/**) are done by a separate agent.
Pen features are specified in docs/SPEC-pen.md. Design rules: docs/SPEC-calm.md, Round 2 of docs/SPEC-lively.md (snaps only),
docs/SPEC-workspace.md (tablet question + docked pad; user explicitly wants the session buttons at the TOP on tablet: keep that).
Everyone: edit only your files; don't run tools/pages.py / lite.js / stamp.js unless you own them; don't commit. Files are often CRLF:
preserve endings and re-check each file parses and has a single copy of its end after scripted edits.

## SHELL (assets/common.js, assets/brutal.css, assets/style.css, assets/find.js, sw.js, manifest.webmanifest, tools/pages.py, tools/stamp.js, tools/lite.js)
- H1 Store hardening: sanitize in `Store.load()` after parse (items/activity/meta plain objects; drop item values that aren't objects;
  mocks = array of objects with an id). Same sanitizer on the imported object in `importJSON` (reject a file that has no usable data).
  `v && v.status` in paintRing (~989) and any similar spot.
- M1 Multi-tab safety: `storage` listener that drops the cache (`Store.d = null`) and fires `store:change`; `Store.save()` re-reads the
  stored copy and merges this tab's changed keys (track dirty item keys / activity days / meta / mocks by id) before writing.
- M2 Save failures: if setItem throws, show one toast "Progress could not be saved in this browser. Use Export on the dashboard." (once per page).
- H2 + M4 Real offline: `tools/stamp.js` also rewrites sw.js: a cache name with a content hash (`apt-<hash>`) and `const ASSETS = [...]`
  (every page plus every stamped local script/stylesheet URL exactly as the pages reference them, plus manifest and icons).
  sw.js precaches ASSETS on install (`cache.addAll`), deletes every other `apt-` cache on activate, stays network-first for pages.
- M3 Lesson pages load only what they use: `tools/lite.js` writes `data/quiz/<sec>.js` containing just the questions referenced by that
  section's lesson quiz blocks (+ the sets they reference) via `QB.add` / `QB.set`; `tools/pages.py` loads that file on lesson pages
  instead of glob("q/<sec>") + glob("sets"). Practice/mock/revision unchanged.
- Small: favicon link (assets/icons/icon.svg) in pages.py HEAD; Google Fonts stylesheet non-blocking (`media="print" onload="this.media='all'"`
  + `<noscript>` fallback); `aria-label` on `#docSearch` and the notes textarea; nav badge text `var(--on-fill)` in dark; unknown lesson hash →
  show the first topic but with a small toast "That topic wasn't found"; no blurred backdrops anywhere (find.js / modals / sheets: plain
  `rgba(0,0,0,.45)`), keep the "Ctrl K" finder otherwise as is.
- UI: phone settings popover lists "More pages" (Mock tests, Placement strategy, Cheat sheet) like tablet does; touch targets ≥ 44px on
  tablet/phone for `.pr-pick`, chips and filter chips site-wide (reason chips are PLAYER's); lesson floating "Practise this topic" + back-to-top
  never overlap each other or body text on tablet (stack them, reserve bottom padding); revision count badge sits beside the label on the phone
  tab strip and doesn't cover the rail icon; lesson actions: "Mark for revision" and "Learned" are exclusive — show a toast explaining the swap
  ("Moved from Learned to Needs revision"); toasts sit above any bottom bar and never over the reading column centre on desktop (bottom-left);
  sticky hover on touch: under `@media (hover: none)` cancel hover backgrounds/transforms of buttons, chips, cards, options, nav items;
  wide tables on phone (strategy, lessons, cheat sheet): show a right-edge fade + "scroll →" hint inside `.table-wrap` when it overflows;
  keep content left edge consistent: the same `.page` max-width/padding on dashboard, practice setup, mock gallery, revision.

## PEN (assets/rough.js only)
Everything in docs/SPEC-pen.md §1, the `RoughPad.layer(hostEl, contextKey)` factory of §2 (returns `{ clear(), destroy(), setTool(t), hasMarks() }`,
transparent canvas sized to the host, pen-only rules, strokes saved under "mk:" + contextKey, highlighter default, `readonly(on)` to show marks without
capturing input), and §3's lesson dock: on tablet lesson pages (`#sidebar` exists, data-device tablet) the Rough work control docks the pad as a right
column (rough.js injects its own host + CSS; content width shrinks; W toggles; landscape only, portrait keeps the drawer).
Also from the audit: toolbar targets ≥ 44px including the size control and the Exam-mode switch; thin vs medium size visibly different; visible text
labels under icons on touch devices (or a compact label row) since tooltips don't show on touch; gap between Undo/Redo and Clear;
the off-screen drawer is `inert` + `visibility:hidden` when closed; a "Pen only / Finger too" switch replacing the silent session flag.

## PLAYER (assets/practice.js, assets/practice.css, assets/mock.js)
- Mark-up layer integration from SPEC-pen §2 (guard `RoughPad.layer`), §3 (`touch-action: manipulation`, `user-select:none` on player/exam
  chrome and options, not on passages), swipe only on phone (never tablet/desktop).
- Audit HIGH: practice setup on tablet portrait — the sticky summary/Start bar sits above the bottom tab bar (`bottom: var(--bar-h)`); phone review,
  mock result and speed-drill end: action bar is one row (primary + one "More" or secondary) and not covering content (non-sticky at the end on phone);
  phone review rows show the question text (chip + time on a second line, 2-line clamp).
- MEDIUM: mock start on tablet/phone puts the "Your paper" card (with Start) first and hides keyboard rows/kbd off desktop; DI/passage stimulus on
  tablet landscape gets more room (max-height ~52dvh, `overscroll-behavior: contain`) and the x-axis labels never clip; portrait tablet mock left area has
  bottom padding so "Previous" isn't cut; mistake-reason chips ≥ 44px; replace "Add wrong to mistake book" with a quiet note "Wrong answers are already in
  your mistake book" (link) when they already are; desktop practice: after answering, a sticky bottom action row with Next stays visible;
  mock tablet: palette popover closes when any modal opens and doesn't cover the pad tabs (anchor below the top bar, max-height), rail End labelled
  "Submit", "Quit without saving" separated with a gap and a confirm (already confirms? check); `.pr-crumb` ellipsis; speed drill on tablet/desktop
  centred larger question + a big on-screen keypad on touch (digits, ., −, ⌫, Enter) so no OS keyboard is needed.
- Use "Bookmark" consistently (rail may abbreviate to an icon + "Bookmark" if space allows).

## PAGES (assets/home.js, assets/revision.js, assets/formulas.js)
- Flashcards: tab count and "today" counts include new cards available ("20 new · 0 due"), primary "Start 20 cards" when nothing is due.
- Dashboard streak number: the big "1" glyph renders oddly in Space Mono at that size — use Archivo 900 tabular for the big streak digits.
- Cheat sheet: wide tables on phone get the same scroll hint as SHELL's `.table-wrap` (if formulas.js renders its own wrappers).

## Verify (each owner, own screens)
`node tools/cdp.js` per docs/SPEC-pen.md §4 and docs/SPEC-lively.md §5 (desktop 1440×900, tablet 1180×820 + 820×1180 with apt:layout=tablet + touch,
phone 390×844, light + dark). Before leaving a running set/exam in a test: `document.dispatchEvent(new Event("apt:suspend"))`; wrap runs in `timeout 280`.
