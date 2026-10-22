# Spec: fullscreen, installable app, tablet fixes, focus mode, lively motion, quality of life

Read first: `docs/SPEC-calm.md` (design rules, tablet rail contract) and `docs/SPEC-motion.md` (current motion). This spec
**replaces the motion rules of SPEC-motion.md §1** with the "lively" layer below; everything else in those specs still applies
(file://, no emoji, tokens, light + dark, 44px targets, `[hidden]` rules, real buttons, `apt:` localStorage keys in try/catch).

## Hard rules (everyone)
- Edit ONLY the files you own (table at the end). Other agents edit other files at the same time.
- Do NOT run `tools/pages.py`, `tools/lite.js`, `tools/stamp.js`; do not edit `.html` pages, `data/**`, `tools/**`; do not git commit.
- Other agents' helpers may not exist yet when you test: always guard (`window.Motion && Motion.countUp(...)`).
- Must work from `file://` (no modules, no fetch of local files) AND from https (GitHub Pages).

## 1. Shared contracts (exact names)

### 1.1 Attributes on `<html>` (set by SHELL in the early prefs block of common.js, kept updated)
- `data-device` = tablet | desktop | phone (unchanged), `data-hand` (unchanged), `data-text` (unchanged).
- **`data-orient`** = `portrait` | `landscape` (innerHeight > innerWidth → portrait).
- **`data-motion`** = `lively` (default) | `minimal`, from `localStorage["apt:motion"]`. Settings gets a row
  "Animations: Lively / Minimal". `prefers-reduced-motion: reduce` always behaves as minimal (CSS + `Motion.on()`).
- **`data-fs`** = `on` while the document is fullscreen (or running as an installed fullscreen/standalone app), else absent.

### 1.2 `window.Motion` (SHELL, common.js)
```
Motion.on()                         -> true when data-motion="lively" and reduced motion is not requested
Motion.countUp(el, to, { ms = 600, from = 0, fmt = (n) => String(Math.round(n)) })   // ease-out number roll; no-op sets final text when !on()
Motion.confetti({ x, y, n = 36 })   // brutalist confetti: small ink-outlined squares in --f-* colours, falls ~900 ms, removed after; no-op when !on()
Motion.nudge(el)                    // wrong answer: 2 small horizontal shakes, 220 ms (class .is-nudged)
Motion.enter(el)                    // one-time rise-in: translateY(6px)+opacity 0 -> 0, 180 ms ease-out (class .is-entering)
Motion.celebrate(kind, text)        // a "rubber stamp" badge that drops in the middle-top of the screen (scale 1.5 -> 1, rotate -6deg, 220 ms), holds 1.4 s, fades 200 ms. kind: "goal" | "streak" | "best" | "done"
```
`window.stamp(el)` stays as is.

### 1.3 Events (SHELL)
- `Store.bump()` already counts today's activity. After it, if today's count **reaches the goal** (`meta.goal`, default 25) for
  the first time today, dispatch `document` event **`apt:goal`** `{ detail: { n, goal } }` and call
  `Motion.celebrate("goal", "Daily goal done")` (once per day; remember in `meta.goalHit = "YYYY-MM-DD"`).
- When the streak reaches 3, 7, 14, 30, 50, 100 days for the first time (`meta.streakSeen` = highest milestone shown),
  dispatch **`apt:streak`** `{ detail: { days } }` and `Motion.celebrate("streak", days + "-day streak")`.

### 1.4 Fullscreen (SHELL)
- A **Fullscreen** toggle: header icon button (next to Settings, icon "expand" / "collapse" lines, 24×24 stroke) and a fixed slot in
  the tablet rail tools; also listed inside the Settings popover. Hidden where the Fullscreen API is missing
  (`document.fullscreenEnabled || document.webkitFullscreenEnabled` false) or when running installed
  (`matchMedia("(display-mode: fullscreen), (display-mode: standalone)")`).
- Turning it on: `document.documentElement.requestFullscreen({ navigationUI: "hide" })` (+ webkit fallback); store
  `localStorage["apt:fs"] = "1"`. Turning it off: exit + store `"0"`.
- **Surviving page changes:** browsers drop fullscreen on navigation and only allow re-entry from a user gesture. On every page load,
  if `apt:fs === "1"` and not fullscreen: add one-time capture listeners for `pointerdown` and `keydown` that call requestFullscreen
  (ignore errors), and show a small unobtrusive pill at the bottom centre "Tap anywhere for fullscreen" (dismiss on success or
  after 4 s; no toast spam: show at most once per page load).
- If the user leaves fullscreen *on the same page* (Esc / F11 / the button), set `apt:fs = "0"`. Exits caused by navigation must
  NOT clear it: set a `leaving` flag on `pagehide`/`beforeunload` and on clicks of `a[href]` that go to another page (not `#…`).
- While fullscreen, set `html[data-fs="on"]`; the button shows "collapse".
- API for other pages: `window.Fullscreen = { supported(), active(), toggle(), enter(), exit() }`; it dispatches `apt:fs` on
  `document` whenever the state changes, so page-owned buttons can repaint.

### 1.5 Installable app (SHELL; only over http/https)
- `manifest.webmanifest` at the site root: name "Aptitude Hub", short_name "Aptitude", start_url "./index.html", scope "./",
  `display: "fullscreen"`, `display_override: ["fullscreen", "standalone"]`, background_color "#FFF6F1", theme_color "#D6245F",
  icons: `assets/icons/icon-192.png`, `assets/icons/icon-512.png` (purpose any), `assets/icons/icon-maskable-512.png` (purpose maskable),
  `assets/icons/icon.svg` (sizes any). Icon = the "AH" logo: raspberry square, ink outline, white Archivo-style "AH".
  Make the PNGs by rendering an SVG in headless Chrome with `node tools/cdp.js <your steps file>` (screenshot with a clip), saved
  into `assets/icons/`. Also `apple-touch-icon.png` (180).
- `sw.js` at the root: network-first for every GET of the same origin, falling back to the cache (cache name `apt-v1`); on install,
  precache `./`, `index.html` and the HTML pages; `skipWaiting` + `clients.claim`. Never cache cross-origin requests except Google Fonts
  (stale-while-revalidate).
- In common.js, **only when `location.protocol` is http or https**: inject `<link rel="manifest">`, `<meta name="theme-color">`,
  `<link rel="apple-touch-icon">`, `<meta name="apple-mobile-web-app-capable" content="yes">`, and register `sw.js`.
  On file:// do nothing (a manifest link there logs a console error).

## 2. Lively motion layer (CSS by SHELL in brutal.css; pages use the classes)
All rules under `html[data-motion="lively"]` AND `@media (prefers-reduced-motion: no-preference)`. Mechanical and short (≤ 260 ms
except confetti and the celebrate badge), ease-out or linear, nothing loops forever. The existing press / stamp / thunk / bars stay.
- **Hover on clickable cards** (`.db-tile`, `.pr-quick`, `.mk-row`, `.db-sec .btn`, `.pr-pick`, `.pr-opt` while unanswered,
  `.gr-item`, nav links): `transform: translate(-2px,-2px); box-shadow: 3px 3px 0 var(--ink)` over 120 ms; `:active` returns to 0.
  Only on `(hover: hover)` devices. (Overrides the calm "no shadow" rule for these hover states only.)
- `.is-entering` (Motion.enter), `.is-nudged` (Motion.nudge), `.is-thunk` now animates its shadow from 0 to 3px in 140 ms.
- **Progress bars**: width transitions become 400 ms ease-out (`.bar > span`, `.db-meter > span`, `.db-bar > span`, segmented progress).
- **Header streak flame**: when today's goal is met, `.d-streak` gets class `hot`: the flame flickers (scale/rotate) for 1.2 s once on page load.
- **Page load**: `#content` children get one rise-in (120 ms, 30 ms stagger, max 6 children). Nothing animates on in-page
  re-renders except where a page owner calls `Motion.enter`.
- Minimal mode / reduced motion = today's behaviour (press, stamp, thunk, bars only).

## 3. Tablet and touch
- **Hide keyboard hints on touch**: `kbd` inside buttons, links and rails (`button kbd, .btn kbd, a kbd, .sr-btn kbd, .pr-quiet kbd`)
  hidden when `html[data-device="tablet"]`, `html[data-device="phone"]` or `(pointer: coarse)`. Keep kbd in prose and in the "?" sheet.
- **Portrait tablet = bottom bar** (SHELL): when `html[data-device="tablet"][data-orient="portrait"]`, the global rail becomes a bottom
  bar (`--bar-h: 72px`): the 7 section items with icon + label, then "More" (opens the settings popover, which in this mode also lists
  Search, Rough work, Topics (when the page has a sidebar) and Fullscreen as big buttons). Body gets `padding-bottom: var(--bar-h)`,
  no side padding. Popovers open upward from the bar. Landscape keeps the side rail.
- **Session rails in portrait** (PRACTICE, MOCK): when `html[data-device="tablet"][data-orient="portrait"] body.in-session`, the
  session rail becomes a bottom bar (height `--sbar-h: 88px`): End on the left, Q x/N + big timer, the tool buttons, and the primary
  (Next / Save & next) on the hand side, at least 160px wide. Content gets `padding-bottom: calc(var(--sbar-h) + 16px)`.
- Phone header nav (SHELL): add small labels (11px) under the icons in the phone nav row; keep it one row (scroll if needed).

## 4. Ownership and tasks

| Owner | Files | Tasks |
|---|---|---|
| SHELL | `assets/common.js`, `assets/brutal.css`, `assets/style.css`, `assets/rough.js`, `assets/find.js`, new `manifest.webmanifest`, `sw.js`, `assets/icons/*` | §1 (all contracts), §2, §3 (kbd hiding, portrait bottom bar, phone labels). Settings rows: Theme, Layout, Rail side, Text size, **Animations**, plus Fullscreen. rough.js: compute the drawer's top from the header's current bottom **each time it opens** (the header may be hidden in focus mode; then top = 0); in portrait tablet the drawer must end above the bottom bar. Lessons (DocPage): remember the scroll position per topic (`apt:scroll:<kind>:<id>`, restore on return, not when following a #hash from another page's link… simply restore when it exists) and a 3px reading-progress line at the top of the viewport (accent colour). Streak / goal events (§1.3). |
| PRACTICE | `assets/practice.js`, `assets/practice.css` | Bugs: on tablet hide the in-page tools row (`.pr-tools`: star, flag, ?, Show solution, Skip) because the rail has them; add **Previous** and **Skip** to the session rail; make the rail timer big (mono, ~1.5rem, like the mock rail). Portrait session bottom bar (§3). **Focus mode**: while the player runs (view run) on desktop and phone, add `body.pr-focus`, hide `#topbar` (as mock does with `mk-focus`), and show a slim bar with End, breadcrumb, Q x/N, timer, a Fullscreen toggle button (call the SHELL toggle `window.Fullscreen && Fullscreen.toggle()`, hide it if `!window.Fullscreen || !Fullscreen.supported()`), and Session. **DI on tablet landscape**: stimulus column 58%, question 42%; tap the chart/stimulus to open it enlarged in an overlay (Esc / tap to close) on every device. **Lively**: `Motion.enter` on the question card when a new question shows; `Motion.nudge` on a wrong pick; count-up of score and accuracy on the review screen; `Motion.confetti` when a set ends at ≥ 80% (≥ 5 answered) or a new speed-drill best; `navigator.vibrate` (10 ms right, [18, 40, 18] wrong) on touch devices when `Motion.on()`. **QoL**: setup option "Auto-next on correct" (`apt:autonext`, off by default) → after a correct instant-mode answer, go to the next question after 900 ms unless the user interacts; a "Daily goal done" moment is handled by SHELL's event, nothing to do here. |
| MOCK | `assets/mock.js` (its injected style) | Bug: the desktop palette overflows the 290px rail: use `grid-template-columns: repeat(auto-fill, minmax(44px, 1fr))` with a fixed square size so it always fits. **Filter chips** on the gallery: All · Company · Sectional · Full (remember in sessionStorage). Portrait tablet session bottom bar (§3). Document title shows the time left during an exam (`"12:31 · Quick 15"`), restored after. **Lively**: count-up of the score on the result screen, `Motion.confetti` at ≥ 80%, `Motion.celebrate("best", "New best")` when the score beats every earlier attempt at that preset; `Motion.enter` on the question card when moving to another question. |
| PAGES | `assets/home.js`, `assets/revision.js`, `assets/formulas.js` | **Home**: "Welcome back" line under the title when the last activity day was before today ("Welcome back. 6 reviews are due and your streak is 4 days." / for a broken streak: "Welcome back. Pick up where you left off."); a **This week** card (questions this week vs last week, active days, best day) shown when there is activity; count-up on the streak number and today's count; when today's goal is met, a rubber-stamp seal "GOAL DONE" sits on the hero card (static; its drop-in animation plays once per day via `meta.goalSeal`). **Revision**: restore a real flashcard flip (rotateY 280 ms, `backface-visibility`) in lively mode, instant in minimal; count-up on the hero numbers. **Cheat sheet**: below 900px (tablet + phone) a "Contents" button in the bar opens the table of contents as an overlay drawer (closes on pick, Esc, tap outside); in tablet landscape keep the sticky TOC if there is room (≥ 1000px content width) else use the drawer. |

## 5. Testing (each agent, own screens)
`node tools/cdp.js <steps.js>` (headless Chrome, file://, see the file header). Emulate sizes with
`send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile })` and touch with
`send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 })`; set `localStorage["apt:layout"]="tablet"` on a page,
then load the next. Check desktop 1440×900, tablet 1180×820 and 820×1180, phone 390×844, light and dark, Lively and Minimal,
no page errors, no horizontal scroll. Look at your PNGs yourself. Put scripts and screenshots in the scratch folder you are given.
Finish with a short report: files changed, what you did per task, screenshots checked, anything not done or needing another owner.

---

# Round 2 (user feedback, 2026-10-22) — this section overrides anything above it

User said: (1) the ≡ menu button on desktop lesson pages is unnecessary; (2) "these animations / this UI don't follow the theme";
(3) tablet rail on the practice page: Revision is squashed and there is a blank slot — put a "More pages" option there;
(4) fullscreen dropping on every page change is irritating.

## R1. Fullscreen that never drops: the app shell (SHELL)
Replace the "re-arm on first tap" approach completely (remove the pill, the one-time gesture listeners and the `apt:fs`
auto re-entry on load).
- Turning fullscreen ON from any page (header button, rail item, Settings, practice focus bar) does, inside the click handler:
  1. dispatch `document` event **`apt:suspend`** synchronously (practice.js / mock.js listen: flush the timer, persist the session,
     clear their intervals, set an internal view of "suspended" so nothing ticks, submits, re-renders or asks beforeunload);
  2. turn the current document into a **host**: add `html.app-host`, append `<iframe id="appFrame" src="<current URL>" allow="fullscreen" title="Aptitude Hub">`
     filling the viewport (position fixed, inset 0, border 0, z-index above everything); CSS hides every other body child
     (`html.app-host body > :not(#appFrame) { display: none !important }`), `overflow: hidden` on html/body;
  3. `document.documentElement.requestFullscreen({ navigationUI: "hide" })` (webkit fallback) in the same handler, then focus the iframe.
- All later navigation happens INSIDE the iframe (normal links), so fullscreen stays on. Browser Back/Forward move the iframe.
- **Inside a frame** (`window.top !== window`): common.js marks `html[data-framed]`; the Fullscreen controls send
  `parent.postMessage({ apt: "fs-toggle" }, "*")` instead of calling the API (the click gives the parent user activation).
  The host answers every toggle and every `fullscreenchange` with `{ apt: "fs-state", on }` to the frame; the frame sets
  `html[data-fs]` and repaints its buttons (the `apt:fs` event stays). On load the frame posts `{ apt: "hello" }`; the host replies with the state.
- The frame posts `{ apt: "page", title, href }` on load and on every hashchange; the host sets `document.title`, and tries
  `history.replaceState(null, "", <frame path + hash>)` inside try/catch (works on https, may be refused on file://) so a reload lands on the same page.
- Turning fullscreen OFF just exits fullscreen; the host keeps the frame (seamless). Esc exits too (browser).
- Messages: accept only objects with an `apt` field and only from `appFrame.contentWindow` / `window.parent` respectively.
- Installed app (display-mode fullscreen/standalone): hide the controls as before.
- `window.Fullscreen = { supported(), active(), toggle(), enter(), exit() }` keeps working in both host and frame.
- Must work on file:// (postMessage only, never touch the other document's DOM) and on https.

## R2. Motion and UI that fit calm neo-brutalism (SHELL in common.js/brutal.css; PAGES in home/revision/formulas)
Brutalist motion vocabulary: **hard edges, offset ink shadows, snaps**. Allowed: translate by whole pixels, the ink offset shadow
appearing/disappearing, `steps()` timing or ≤ 120 ms linear, the rubber-stamp scale. NOT allowed: opacity fades, blur,
easing curves that float, rotation drift, falling particles, 3D perspective.
- Remove the page-load rise-in (`html.mo-rise …`) entirely.
- `Motion.confetti` becomes a no-op (keep the function so callers don't break); delete its CSS.
- `Motion.enter(el)`: a 90 ms snap: from `translate(3px,3px)` to 0, `steps(2)`; no opacity.
- `Motion.nudge(el)`: keep the shake but `steps(4)`, 160 ms, ±3px.
- `Motion.celebrate`: a hard-edged ink-bordered stamp badge with a 4px ink offset shadow at the top centre; appears with the
  existing stamp keyframe (scale .94 → 1 in steps), holds 1.6 s, then disappears instantly (no fade). Slight -3deg tilt allowed (it is a stamp, static).
- Hover lift on clickable cards stays (translate(-2px,-2px) + 3px ink shadow, 80 ms linear).
- Progress bars: back to 150 ms linear.
- Lesson action row (DocPage actionBar): "Mark as learned", "Mark for revision", "Bookmark" become three flat bordered toggle
  buttons (2px `--line-control` border, 44px high, Archivo 800, icon + label, no underline). On-states use meaning colours:
  learned = `--f-green` fill, needs revision = `--red-soft` fill, bookmarked = `--f-yellow` fill, with `--on-fill` text, plus a
  check icon in the learned box. The primary "Practise <topic>" stays the one loud button.
- PAGES: revision flashcard flip = a snap swap: the card squashes `scaleX(1 → 0)` in 60 ms steps(2), swaps faces, `scaleX(0 → 1)` 60 ms steps(2)
  (no rotateY, no perspective); minimal = instant. Cheat-sheet drawer opens/closes instantly. Home "GOAL DONE" seal: static stamp,
  drop-in = the stamp keyframe only. Count-ups stay but tick in whole numbers (they already do) over ≤ 500 ms.

## R3. Header and rail (SHELL)
- Desktop: hide `#menuBtn` whenever the sidebar is a column (device desktop and width > 900); show it only in drawer mode.
- Tablet rail must never overlap or squash: items `flex: none`; item height = `clamp(48px, calc((100dvh - <logo block>) / <item count>), 60px)`
  (compute it in JS on resize if simpler, as `--gr-item-h`); if still too tall, the rail scrolls (`overflow-y: auto`, no scrollbar).
- Tools group: slot 1 = **Topics** on pages with a sidebar, otherwise **Pages** (icon "doc" or a grid icon, label "Pages") which opens a
  small menu (same look as the settings popover, anchored to the rail) listing the sub-pages: Mock tests, Placement strategy,
  Cheat sheet (from `SITE.links` sub-menus, excluding links already in the rail), each 52px high with icon + label.
  Then Search, Rough, More. **Move Fullscreen out of the rail** into the More popover (top row, a big toggle) to save a slot.
- Portrait bottom bar: More popover keeps listing Search, Rough work, Topics/Pages, Fullscreen.

## R4. Ownership for round 2
| Owner | Files |
|---|---|
| SHELL2 | `assets/common.js`, `assets/brutal.css`, `assets/rough.js`, and ONLY the `apt:suspend` listener blocks in `assets/practice.js` and `assets/mock.js` (plus making their Fullscreen buttons work in a frame if they call `Fullscreen.toggle()`, which they already do) |
| PAGES2 | `assets/home.js`, `assets/revision.js`, `assets/formulas.js` (R2 PAGES items) |
