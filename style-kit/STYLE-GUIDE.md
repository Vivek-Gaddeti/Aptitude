# Calm neo-brutalism: style guide

The visual style of Aptitude Hub, written so you can apply it to any website.
Files in this folder:
- `brutal-kit.css`: drop-in CSS (tokens, base, components, motion, light + dark).
- `demo.html`: every component on one page, with a theme switch. Open it in a browser.

## 1. The idea in one paragraph
Hard ink outlines, square corners, flat bright fills, two typefaces (Archivo for words, Space Mono for numbers and labels),
and a warm off-white page (charcoal in dark mode). It is "brutalist" because nothing is soft: no rounded corners, no gradients,
no blurred shadows. It is "calm" because only **one thing per screen is loud**. Everything else is flat and quiet, so the
page stays easy to read.

## 2. Five rules (these matter more than any colour)
1. **One loud thing per screen.** Only the main action (`.btn-primary`: 3px ink border, accent fill, 4px hard shadow) and
   at most one hero card (`.hero`: 3px border, 6px hard shadow) get shadows. Every other card, chip, input and button is flat:
   a 2px border and no shadow.
2. **Two border colours with different jobs.** `--line` (light) for containers, rows and dividers; `--line-control` (darker)
   for anything you can click or type in. Users can tell what is interactive from the border alone.
3. **Colour always means something.** Bright fills mark a category (a section's colour) or a state: green = correct / done,
   pink-red soft = wrong / needs work, yellow = starred / attention, ink fill = selected. Never use colour as decoration.
4. **Each type style has one job.** The page title alone is Archivo 900 UPPERCASE. Section headings are Archivo 800 in sentence
   case with a 2px rule under h2. Labels are Space Mono 12px UPPERCASE in the muted colour. Numbers, timers and scores are Space Mono.
   Body text is 16px with 1.5 line height.
5. **Show less, at the right time.** Hide empty panels until there is data; fold details into `<details>`; sensible defaults with
   options folded away; no decorative backgrounds.

## 3. Colour tokens

| Token | Light | Dark | Job |
|---|---|---|---|
| `--bg` | `#FFF6F1` | `#121212` | page background |
| `--panel` | `#FFFFFF` | `#1B1B1B` | cards, header, inputs |
| `--panel-2` | `#FFEDE6` | `#202020` | hover, table heads, quiet fills |
| `--ink` | `#22121A` | `#EEEAE4` | hard outlines and shadows, selected fills |
| `--text` | `#22121A` | `#EEEAE4` | body text |
| `--muted` | `#6B5560` | `#ABA69F` | secondary text, labels |
| `--line` | `#D3C6CA` | `#4D4D4D` | quiet borders (containers, rows) |
| `--line-control` | `#8E7F86` | `#7A7A7A` | borders of interactive things |
| `--accent` | `#D6245F` | `#FF6B93` | primary button, logo, links |
| `--accent-soft` | `#FFD6E2` | `#2E2025` | soft accent fill |
| `--on-fill` | `#22121A` | `#121212` | text on bright fills |
| `--green` / `--green-soft` | `#0B7A43` / `#C9F7D9` | `#5BD98C` / `#183626` | correct, done, tips |
| `--amber` / `--amber-soft` | `#8A5A00` / `#FFE89A` | `#F2C94C` / `#3A3014` | warnings |
| `--red` / `--red-soft` | `#C21F4F` / `#FFD6E2` | `#F48FB1` / `#3A1E25` | wrong, needs revision |
| `--purple` / `--purple-soft` | `#5B3CC4` / `#E5DCFF` | `#B9A3F5` / `#2A2342` | marked for review |

Bright fills for categories (always with `--on-fill` ink text):
pink `#FF8AB0`, green `#3DDC84`, yellow `#FFD23F`, blue `#8EC5FF`, orange `#FF9F5A`, lilac `#B79CFF`, raspberry `#FF6F9C`
(dark mode uses slightly softer versions; see the CSS). Text selection is yellow with ink text.

Dark mode is "charcoal": near-black surfaces, grey lines, warm off-white text. Bright fills keep dark text on them.

## 4. Typography

| Use | Style |
|---|---|
| Page title (one per page) | Archivo 900, UPPERCASE, `clamp(1.9rem, 4vw, 2.8rem)`, line-height 1, letter-spacing −0.015em |
| Section heading (h2) | Archivo 800, 1.35rem, sentence case, 2px `--line` rule underneath |
| Sub-heading (h3, card titles) | Archivo 800, ~1.1rem |
| Body | Archivo 400–600, 16px, line-height 1.5, max ~62 characters for leads |
| Labels, table heads, breadcrumbs | Space Mono 700, 12px, UPPERCASE, letter-spacing 0.06em, `--muted` |
| Numbers, timers, scores, kbd | Space Mono 700, tabular numbers |
| Buttons | Archivo 800 (primary 900), sentence case |

Google Fonts: `Archivo:wght@500;600;700;800;900` and `Space+Mono:wght@400;700`.

## 5. Shape and spacing
- Corners: **square everywhere** (radius 0).
- Borders: 2px for everything flat, 3px only for the primary button and the hero card.
- Shadows: hard and offset, never blurred: `4px 4px 0 ink` (primary), `6px 6px 0 ink` (hero), `3px 3px 0 ink` (correct answer, hover lift).
- Spacing on a 4px grid: 4, 8, 12, 16, 24, 32, 48.
- Touch targets at least 44px high. Header 64px. Content max width about 1100px (reading pages narrower, ~760–960px).
- Focus ring: 2px ink outline with a 2px offset on every focusable thing.

## 6. Components (class names in `brutal-kit.css`)
- **Buttons**: `.btn` (flat, 2px control border, panel fill, hover = `--panel-2`), `.btn-primary` (the loud one), `.btn-quiet`
  (underlined text button), `.btn-sm`, `.icon-btn` (44×44 square). Toggles use `aria-pressed="true"` plus `.is-green` / `.is-red` /
  `.is-yellow` for their on colour.
- **Cards**: `.card` (flat panel, 2px quiet border), `a.card` (clickable: control border, hover fill and lift), `.hero` (one per screen).
- **Callouts**: `.callout` + `.tip` (green soft), `.warn` (amber soft), `.danger` (red soft), with a mono `.label` on top.
- **Chips**: `.chip`; selected = ink fill with background-coloured text. **Tags**: `.tag` + colour (`pink`, `green`, `blue`…).
- **Segmented control**: `.seg` with buttons; the pressed one is ink filled.
- **Forms**: inputs with a 2px control border; focus = ink border + ink outline. `.check` = square checkbox that fills green.
- **Choice cards**: `.option` with a letter box `.k`; `.selected` = ink fill, `.correct` = green soft + 3px ink shadow, `.wrong` = red soft.
- **Header**: `.topbar` (panel, 2px bottom rule), `.brand` + square accent `.logo`, `.nav` links (active = ink fill).
- **Data**: tables with mono uppercase heads on `--panel-2`; `.meter` progress bar (2px border, accent fill); `.badge`; `.toast` (ink box).
- Layout helpers: `.container`, `.stack`, `.row`, `.grid`, `.grow`.

## 7. Motion: feedback only, mechanical, short
- **Press**: anything clickable moves 2px down-right while pressed (80 ms linear); the primary button's shadow drops to 0, so it
  looks pushed in.
- **Stamp**: when a toggle changes state, add `.is-stamped` (100 ms scale to 0.94 in steps), like a rubber stamp.
- **Thunk**: the correct answer gets its 3px ink shadow instantly.
- **Lift**: clickable cards and chips rise 2px with a 3px ink shadow on hover (mouse devices only).
- **Nudge**: a wrong pick shakes 3px left-right in steps (`.is-nudged`, 160 ms).
- Progress bars ease their width in 150 ms linear.
- **Never**: fades, blur, floaty easing, rotation, 3D flips, confetti, or anything that animates on page load. Menus and popovers
  appear instantly. `prefers-reduced-motion` turns every remaining animation off.

## 8. Voice of the interface (copy)
Short, plain, friendly, no exclamation spam. Sentence case everywhere except the page title. No emoji: use simple 24×24 line
icons drawn with `currentColor` (stroke 1.9, round caps) so they follow light and dark mode.

## 9. Applying it to another site
1. Add the two font links and `brutal-kit.css` (after any existing CSS, so it wins).
2. Map your existing classes to the kit's, or rename: your main call-to-action → `.btn btn-primary`; other buttons → `.btn`;
   panels → `.card`; your one featured block → `.hero`.
3. Remove rounded corners, gradients and soft shadows from your old CSS (search for `border-radius`, `box-shadow`, `linear-gradient`).
4. Pick your section colours from the bright fills and use them only to mark categories.
5. Check light and dark, 44px targets and keyboard focus. Open `demo.html` side by side as a reference.
