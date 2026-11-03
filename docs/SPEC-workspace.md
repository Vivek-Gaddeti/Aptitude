# Spec: tablet workspace (question + docked rough-work pad)

User request: when practising on a tablet, the rough-work drawer is not good, and the space below the question is empty.
Keep the question on the left and the rough work on the right, always visible, and make the pad good for working.
Hard rules from docs/SPEC-calm.md and docs/SPEC-lively.md (Round 2) apply: calm neo-brutalism (ink outlines, square corners,
flat fills, 2px `--line-control` borders on controls), tokens only, light + dark, 44px targets, motion only as snaps, no emoji,
works from file://. Do not run tools/pages.py / lite.js / stamp.js and do not commit (the integrator does that).

## 1. RoughPad gets a docked mode (assets/rough.js)
- New API: `RoughPad.dock(hostEl)` moves the pad's panel (tabs Draw / Notes / Calculator + exam switch) into `hostEl` and lays it
  out to fill the host (flex column, the canvas takes all remaining height). `RoughPad.undock()` puts it back into the slide-out drawer.
  `RoughPad.docked()` → boolean. While docked, the W key / rail "Rough work" button toggles the dock (show / hide the workspace
  column) instead of the drawer, and the drawer never opens. The drawing for each question still follows `setContext(id)`.
- Re-mounting: the practice page re-renders its HTML on every question, so `dock()` must be cheap and idempotent: if the panel is
  already inside a host with the same id, do nothing; if the old host was removed, move the panel into the new one and refit the canvas
  (ResizeObserver already exists).
- Better pad for working (both modes):
  - Toolbar: Pen, Eraser, **Undo** (also Ctrl+Z inside the pad), **Clear**, **Paper** toggle (blank / squared grid / ruled lines, drawn
    as a CSS background on the canvas wrapper with `--line` colour; remembered in `apt:rw:paper`, default squared), and pen **size**
    (thin / medium) as a 2-way segmented control.
  - **Palm rejection**: once a `pointerType === "pen"` event is seen on the canvas, ignore `touch` pointers for drawing (they may
    still scroll the page outside the canvas). Store the flag for the session.
  - Strokes per question survive a page reload: keep `strokes` in `sessionStorage["apt:rw:strokes"]` (JSON, keep at most the 30 most
    recent contexts, round points to 1 decimal); save on pointerup / clear / undo.
  - Header in docked mode: "Rough work" label + context note "saved for this question" + a hide button (collapses the column).
- Styling uses the brutal tokens: toolbar buttons 44px square, 2px borders, active tool = ink fill with `--bg` icon.

## 2. Practice player layout on tablet (assets/practice.js, assets/practice.css)
Only when `html[data-device="tablet"]` and the player is running (`body.in-session`) and the workspace is not hidden
(`localStorage["apt:ws"] !== "off"`, default on):
- **Landscape:** two columns inside the content area (rail stays on the hand side): left = the question column
  (breadcrumb, progress, question card with text ABOVE the options, the after-answer card, set navigation, stimulus for DI/RC sets
  above the question), width `minmax(0, 1fr)`; right = the workspace column `#prWork` (min 40%, max 52% of the content width),
  `position: sticky; top: 12px; height: calc(100dvh - 24px)` so it never scrolls away. The left column scrolls normally.
  If the rail is on the left (`data-hand="left"`), the workspace stays on the right of the question (next to the content edge, away from the rail).
- **Portrait:** question area on top limited to `max-height: 46dvh` with its own scroll (`overflow-y: auto`), workspace below
  filling the rest down to the bottom session bar (`calc(100dvh - <question area> - var(--sbar-h) - gaps)`; use flex column on a
  container sized to the viewport minus the bar).
- DI / passage sets: in landscape the stimulus goes in the left column above the question (tap-to-enlarge stays); in portrait it is inside the
  scrolling question area.
- `RoughPad.dock(document.getElementById("prWork"))` after each paint while the workspace is on; `RoughPad.undock()` when the player
  stops (review, setup, End) or the workspace is turned off.
- The rail's "Rough work" button reads "Hide pad" / "Show pad" in this mode (toggles `apt:ws`), W does the same.
- Desktop and phone keep today's layout and drawer.

## 3. Mock exam on tablet (assets/mock.js)
Same workspace in the exam screen on tablet (landscape: question left, pad right; portrait: question top, pad below above the bottom bar),
same `apt:ws` switch, the rail's Rough button toggles it, `setContext("mock:" + q.id)` as today. The palette popover still opens over it.

## 4. Testing
`node tools/cdp.js <steps.js>`, tablet 1180×820 and 820×1180 (localStorage `apt:layout="tablet"`, touch emulation), light + dark,
hand right + left; draw on the canvas with `Input.dispatchMouseEvent` (and `Input.dispatchTouchEvent` for touch); check the pad keeps
the drawing per question when moving Next/Prev and after reload; undo/clear/paper work; answering shows the solution in the left
column while the pad stays put; DI set (practice.html#topic/di/di-bar) and a mock exam (mock.html#start/quick-15) look right;
desktop and phone unchanged; no page errors; no horizontal scroll.
