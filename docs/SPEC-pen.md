# Spec: tablet + pen (stylus) support

Builds on docs/SPEC-workspace.md (tablet practice/mock: question beside a docked rough-work pad, assets/rough.js API dock/undock/
setContext, strokes per context in sessionStorage "apt:rw:strokes", palm rejection after a pen is seen). Design rules: docs/SPEC-calm.md
and the Round 2 section of docs/SPEC-lively.md (calm neo-brutalism; motion = snaps only; tokens; light + dark; 44px targets; no emoji).

## 1. Writing feels like paper (assets/rough.js)
- **Low latency**: create the 2D context with `{ desynchronized: true }` where supported; draw incrementally (already); use
  `getCoalescedEvents()` (already) and `getPredictedEvents()` for a 1-frame preview segment that is replaced on the next move.
- **Smooth strokes**: render with quadratic curves through segment midpoints instead of straight polylines.
- **Pressure**: for `pointerType === "pen"`, line width = base × (0.45 + 0.9 × pressure), stored per point so redraws match.
  Mouse and finger use the base width.
- **Pen eraser and barrel button**: a pen with an eraser end (`e.pointerType === "pen" && (e.button === 5 || (e.buttons & 32))`)
  erases; holding the barrel button (`e.buttons & 2`) erases while held. Show the eraser cursor meanwhile.
- **Tools**: Pen, Highlighter (wide, yellow `--f-yellow`, drawn with `globalCompositeOperation = "multiply"` in light mode and
  `"screen"` in dark so text stays readable; flat, no transparency gradients), Eraser with two modes: **stroke** (touch a stroke and
  the whole stroke disappears; default) and **area** (the current pixel eraser). Colours for the pen: ink (follows theme), red
  (`--red`), blue (`#1F5FA8` light / `#82B4F5` dark). Remember tool, colour, size in localStorage (`apt:rw:tool`, `apt:rw:color`, `apt:rw:size`).
- **Undo + Redo** buttons (Ctrl+Z / Ctrl+Shift+Z or Ctrl+Y inside the pad).
- **Hover preview**: when a pen hovers over the canvas (`pointermove` with `pointerType === "pen"` and `buttons === 0`), show a
  small ring the size of the current tool at the tip; hide on leave.
- **Pen-only mode**: a toolbar toggle "Pen only" (auto-enabled the first time a pen draws, remembered in `apt:rw:penonly`;
  the user can turn it off). In pen-only mode a finger never draws: one finger scrolls the pad page, so the palm and fingers are safe.
- **More paper**: the drawing surface is a tall page inside the pad that scrolls vertically (start at 2 × the visible height; a
  "More space" button at the bottom adds one more screen, up to 6). Scroll with a finger in pen-only mode, or the scrollbar.
  Strokes store page coordinates, so scrolling never changes them.
- **No browser interference** on the pad and markup layers: `touch-action: none` (pen-only mode: `pan-y` so a finger scrolls),
  `user-select: none`, `-webkit-user-select: none`, `-webkit-touch-callout: none`, and prevent `contextmenu`, `selectstart` and
  `dragstart` while writing. Never let a stroke trigger page swipe, text selection, the magnifier, or the long-press menu.
- Toolbar layout must fit at 46% of a 1180px landscape screen and full width in portrait: group as
  [Pen ▾ colour] [Highlighter] [Eraser (stroke/area)] | [Undo] [Redo] [Clear] | [Paper] [Size] [Pen only]. Icons 24×24 line icons,
  44px square buttons, active = ink fill. Colour picker = three 28px squares in a small popover anchored to the pen button.

## 2. Mark up the question itself (assets/practice.js, assets/practice.css, assets/mock.js)
- On tablet (and any device with a pen seen this session), a **Mark up** toggle in the session rail (label "Mark up"; also the key
  **D** for draw on keyboards). When on, a transparent ink layer covers the question text and the shared stimulus (chart, table,
  passage) but NOT the answer options, so tapping an option always answers.
- The layer uses the same engine as the pad (export a small factory from rough.js: `RoughPad.layer(hostEl, contextKey)` returning
  `{ clear(), destroy(), setTool() }`, sharing the current tool/colour/size, pen-only rules, undo per layer, stroke persistence under
  the key `"mk:" + contextKey`). Highlighter is the default tool on the markup layer.
- Markups are saved per question (practice: question id; mock: "mock:" + id) and come back on Prev/Next and reload.
- While Mark up is on: tap-to-enlarge on the stimulus is disabled and swipe is off; a small "Marking up · Done" chip at the top of the
  question card turns it off. Turning it off keeps the marks visible (read-only); a "Clear marks" item clears them.
- Review screens (practice review, mock result) show the user's marks on the question when present (static image from the strokes).

## 3. Pen-friendly controls everywhere
- Option cards, rail buttons, chips: `touch-action: manipulation` (no double-tap zoom delay); answers register on `click`
  (pointerup on the same element), so resting a palm on the screen and lifting it elsewhere never answers.
- A pen hovering over an option shows the same hover state as a mouse (`@media (any-hover: hover)` + `:hover`).
- Disable text selection inside the question player and exam (`user-select: none` on `.pr-play` and `.mk-exam`, except the
  passage/stimulus text so a student can still select and copy if they want with a finger long-press when Mark up is off).
- Lessons on tablet: the Rough work rail button opens the pad docked as a right column next to the lesson (same dock API) instead of
  the overlay drawer, so worked examples can be copied by hand while reading. W toggles it.

## 4. Testing
`node tools/cdp.js` with tablet emulation (1180×820 and 820×1180, `apt:layout="tablet"`, touch emulation). Simulate a pen with
`Input.dispatchMouseEvent` is not enough: use `Input.dispatchTouchEvent` for fingers and, for pen, dispatch synthetic PointerEvents in
the page (`new PointerEvent("pointerdown", { pointerType: "pen", pressure: .6, clientX, clientY, buttons: 1, isPrimary: true })` etc.)
to exercise pressure, eraser (buttons 32), barrel (buttons 2), hover (buttons 0). Verify: strokes persist per question for pad and
markup; stroke eraser removes whole strokes; undo/redo; pen-only blocks finger drawing and lets the finger scroll the pad; marking up
never selects an option or swipes; options still answer with a tap; desktop and phone unchanged; light + dark; no page errors.
