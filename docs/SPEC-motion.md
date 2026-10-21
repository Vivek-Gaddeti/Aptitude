# Spec: "stamp" motion, tablet fixes, resizable sidebar, visible practice options

Read `docs/SPEC-calm.md` first: its hard rules, design rules and contracts still apply (except where this file replaces
them: the Effects setting and `html[data-anim]` go away).

## 1. Motion: the "stamp" style (replaces ALL old animation)
Motion is feedback only: short, mechanical, like pressing a key or a rubber stamp.
- Under 150 ms, `linear` or `ease-out` only. No blur, no bounce, no loops, no stagger, no slide-ins, no fades on load.
- Nothing animates on page load, page switch, topic switch, next question, theme switch, menu open or popover open:
  these are **instant** (a menu/popover may fade in 100 ms at most, opacity only).
- `@media (prefers-reduced-motion: reduce)` turns every remaining animation and transition off.
- Remove the Effects setting, `localStorage.anim`, `html[data-anim]` and everything gated by them. Remove confetti, liquid
  fill, bubbles, sparkles, stars, bloom rings, badge pulses, streak pop, nav-icon wiggles, logo breathing, snow, rainbow,
  sheen, spotlight, cursor effects, glide indicators, peek cards, the resume chip (`.d-resume`), view transitions
  (`::view-transition-*`, `@view-transition`), entrance fades, `pr-in`, smooth-scroll, theme cross-fade, the `--gc`
  colour transition, sidebar group slide-open (open/close instantly), label cross-fades (`.swap`), and every other
  keyframe/transition not listed below. Delete dead code and the unused fx files instead of only disabling them.

**What remains (contract, defined by SHELL in `assets/brutal.css` + `assets/common.js`):**
| Name | Definition |
|---|---|
| Press | Every button / `.btn` / clickable card / option: `:active` → `transform: translate(2px, 2px)`; a shadowed element (`.btn.primary`) also drops its shadow to 0 while pressed. `transition: transform 80ms linear, box-shadow 80ms linear` only on those properties. No hover lift. |
| Stamp | `@keyframes stamp { 50% { transform: scale(.94) } }` 100 ms linear; class `.is-stamped`. `window.stamp(el)` (common.js) restarts it on `el` (remove class, force reflow, add class; no-op under reduced motion). Use it when a toggle changes state: Mark for revision, Bookmark, Mark as learned, Mark (M), Flag (F), a flashcard rating, goal saved. The state change itself (filled icon, label, colour) is instant. |
| Thunk | `.is-thunk { box-shadow: 3px 3px 0 var(--ink) }` applied instantly to the correct option after answering (no transition). Wrong pick: instant pink-soft fill. |
| Bars | Progress bars / goal ring: `transition: width 150ms linear` (or the ring's stroke equivalent), nothing else. |
| Toast | Appears and disappears instantly. |

## 2. Tablet mode fixes (SHELL)
- The rail must be **identical and stable on every page**: same items in the same positions (logo top; the 7 section
  items; then Search, Rough work, More). Page-specific actions never shift the section items: "Topics" (lesson pages)
  goes INSIDE the bottom tool group, which has a fixed number of slots on every page (show a disabled-looking slot or
  nothing at the end, but never move the others). Same height, spacing and item size everywhere; no gap that changes.
- Lesson/strategy pages on tablet: the topic sidebar is NOT permanently open; it is an overlay drawer opened by "Topics"
  on the rail (closes on pick, Esc, or tapping outside), so content gets the full width.
- Content layout identical across pages in tablet mode: same side padding, same max-width, centred in the space left of
  (or right of) the rail. Sticky bars (practice summary bar, lesson sticky Practise button, back-to-top) never sit under
  the rail.
- Switching Layout or Rail side in Settings applies immediately and cleanly (no half-styled state, no leftover header).
- Remove the stray resume chip and any other leftover fx element on every page.

## 3. Resizable / closable sidebar (SHELL, desktop)
- Lesson pages and the formula sheet's table of contents (any `.sidebar`): a drag handle on the sidebar's content edge
  (pointer + touch, keyboard: focusable handle, ←/→ adjust 16 px) sets the width between 200 and 420 px; double-click
  resets to the default. Remembered in `localStorage["apt:sidebarW"]`.
- A collapse button at the top of the sidebar closes it completely (content takes the full width); a small "Topics"
  button (icon + label) stays at the top-left of the content to reopen it. Shortcut: `[` toggles. Remembered in
  `localStorage["apt:sidebarClosed"]`. Instant, no slide animation.
- Phone keeps its existing behaviour; tablet uses the drawer from section 2.

## 4. Practice options visible (PRACTICE)
On the setup screen remove the "More options" fold: Difficulty, Number of questions, Feedback (Instant / Test) and
Timing are visible as compact segmented controls in one row (wrapping on narrow screens) under the topic picker, with
Source (Bank / Generated / Mix) in the same row or a second compact row. The "Patterns" fold stays. The summary bar
keeps reflecting the choices.

## Ownership
| Owner | Files |
|---|---|
| SHELL | `assets/brutal.css`, `assets/style.css`, `assets/common.js`, `assets/fx/*` (delete what is unused; keep a file only if something still needs it), `assets/find.js`, `assets/search.js`, `assets/rough.js`, `assets/glossary.js`, `tools/pages.py` (head script: drop the `anim` logic; drop removed fx files from the page template). SHELL may run `node tools/lite.js && PYTHONUTF8=1 python3 tools/pages.py && node tools/stamp.js` at the end. |
| PRACTICE | `assets/practice.js`, `assets/practice.css`: section 4, stamp/thunk/press on the player (remove `pr-in` and every other old motion there), tablet layout consistent with section 2 (centred content, nothing under the rail). |
| PAGES | `assets/home.js`, `assets/mock.js`, `assets/revision.js`, `assets/formulas.js`: remove old motion from their injected styles/scripts, use press/stamp/bars per the contract, tablet layout consistent with section 2. |

Testing as in SPEC-calm (Playwright, desktop / tablet both orientations + left hand / phone, light + dark), plus:
`document.getAnimations()` after each interaction must list only `stamp`, press transforms, bar widths, or nothing.
