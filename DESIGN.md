---
name: Yash Gandhi
description: A nine-hole yardage book. Every section is a surveyed hole on drenched rough green.
colors:
  flag: "#ef3b2c"
  flag-deep: "#d52f21"
  sand: "#e7d39a"
  rough: "#14482f"
  deep: "#0c2e1e"
  chalk: "#f3f6ef"
  mist: "#b7cdbd"
  moss: "#9dbfa8"
  card: "#f4f6f1"
  ink: "#12402a"
  pencil-ink: "#2b2f8a"
  cut: "#1a5a3a"
  fairway: "#23714a"
  stripe: "#2a7d53"
  putt: "#6cc15a"
  water: "#2f6fd6"
  concrete: "#c9c4b2"
  concrete-joint: "#a9a38f"
  timber: "#8a6a44"
  brick: "#7a3b2a"
typography:
  display:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(6rem, 11vw, 11.5rem)"
    fontWeight: 900
    lineHeight: 0.8
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "6rem"
    fontWeight: 800
    lineHeight: 0.86
  title:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 800
    lineHeight: 0.9
  figure:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 800
    lineHeight: 1
    fontFeature: "tnum"
  body:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
    fontFeature: "ss01"
  label:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.25
  yardage:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: "0.025em"
    fontFeature: "tnum"
  pencil:
    fontFamily: "Nanum Pen Script, cursive"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.33
rounded:
  hairline: "1px"
  cover: "2px"
  button: "3px"
  plaque: "4px"
  embed: "12px"
spacing:
  gutter-sm: "16px"
  gutter: "32px"
  item: "40px"
  stack: "48px"
  hole-y-sm: "96px"
  hole-y: "128px"
components:
  button-flag:
    backgroundColor: "{colors.flag}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "12px 20px"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.chalk}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "12px 20px"
  tee-plaque:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.chalk}"
    typography: "{typography.headline}"
    rounded: "{rounded.plaque}"
    width: "112px"
  scorecard:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.plaque}"
  scorecard-cell:
    textColor: "{colors.ink}"
    typography: "{typography.figure}"
    width: "62px"
    height: "32px"
  tee-sheet-date-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.card}"
    padding: "12px 16px"
  tee-sheet-slot-selected:
    textColor: "{colors.pencil-ink}"
    typography: "{typography.pencil}"
  field-underline:
    backgroundColor: "transparent"
    textColor: "{colors.chalk}"
    padding: "10px 0"
  details-panel:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.plaque}"
    padding: "32px"
---

# Design System: Yash Gandhi

## Overview

**Creative North Star: "The Yardage Book"**

The site is a caddie's yardage book laid over a golf course seen from above. The ground is a single drenched rough green that fills every viewport, carrying faint surveyed contour lines that brighten in a soft 240px pool around the pointer. Each section is a hole: a dark tee-sign plaque with a huge condensed number, a surveyed hole diagram (striped fairway, putting green, sand bunkers, blue water, trees) that stays pinned beside the text, and short handwritten caddie notes tied to the drawing by thin white leader lines. A cream club scorecard stays fixed at the bottom of the screen and works as the site's navigation.

Density is generous and editorial: huge condensed uppercase names, long quiet body columns (52–62ch), and hairline chalk rules between items in place of cards. Materials come from the course and the card: turf, sand, water, white linework, card stock, green grid ink, a red pencil circle and a blue ballpoint. The build rejects both the dark bento-card developer portfolio and the cream serif editorial page.

Motion follows the ball: flights arc and slow down as they land, pencil strokes draw in, the flag waves. Nothing bounces. All looping and drawing motion stops under `prefers-reduced-motion`, and ball flights jump straight to where they land.

**Key Characteristics:**
- One saturated ground colour (rough) everywhere, with depth coming from tone, not from panels.
- Hole diagrams are the imagery: generated SVG courses, never photos or illustrations of golf.
- Four type voices, each with one job: condensed display for names and numbers, grotesque for reading, mono for measurements and card ruling, pencil for handwritten notes.
- Flag red is the pin: the one primary action and anything live or current.
- Objects that sit on the ground (scorecard, plaques, book cover, album art) lift off it with soft, low shadows. Everything else lies flat.

## Colors

A turf-and-card-stock palette: greens do the structural work, chalk white draws the lines, and red is the only loud colour.

### Primary
- **Pin Flag Red** (flag): the flag on every green, the primary action button (Resume, Book call), the "Now playing" equaliser and label, the Strava live dot, the active scorecard column heading, the pencil circle around the current hole, text selection, and the text caret. Hover darkens it to **Flag Red, Pressed** (flag-deep) on the subscribe button.

### Secondary
- **Bunker Sand** (sand): bunkers in the diagrams, every handwritten caddie note in running text, text that turns sand on hover for display-type list items (projects, contact), and the 2px focus ring throughout the site.

### Tertiary (course materials, used inside SVG diagrams)
- **First Cut** (cut): the collar around the fairway.
- **Fairway** / **Mowing Stripe** (fairway, stripe): the two tones of the fairway stripes, set at 38°. The stripe tone is also the scrollbar thumb.
- **Putting Green** (putt): the green, striped with a lighter tone at -30°.
- **Water Hazard** (water): ponds, with a dashed inner ripple line.
- **Cart Path Concrete** / **Expansion Joint** (concrete, concrete-joint): the 22px cart paths between holes, cut by a joint every 34px and edged with a 35% deep-rough shadow.
- **Timber** / **Brick** (timber, brick): the plank bridge over the creek and the halfway house roof. They appear only in cart-path scenery.

### Neutral
- **Rough** (rough): the page ground and the `theme-color`.
- **Deep Rough** (deep): tee plaques, the booking details panel, the scrollbar track, the pin cup, and the dark stroke behind SVG text that keeps labels readable.
- **Chalk** (chalk): headings, all diagram linework, leader lines, the ball's flight path, and the aim reticle. At 15% opacity it draws the rules between items; at 40% it draws the outline button's border.
- **Mist** (mist): body text on the ground.
- **Moss** (moss): secondary text such as locations, tags, captions, yardage lines and field labels.
- **Card Stock** (card): the scorecard, the tee sheet, and the subscribe input. Company logos sit directly on the rough as transparent PNGs, with no tile.
- **Card Ink** (ink): text and grid ruling on card stock (15% for grid lines, 20% under the date tabs). A solid ink fill marks the selected tee-sheet date.
- **Ballpoint** (pencil-ink): the player's handwritten scores on the scorecard and their name on the tee sheet. It appears only on card stock.

### Named Rules
**The Pin Rule.** Red marks where the ball is going (the single primary action) or what is happening now (live data, the current hole). Never use it for decoration, section colour, or a second button on the same view.

**The One Ground Rule.** The page is always rough green. Sections are separated by space and hairline rules, never by background bands or alternating colours.

**The Two Inks Rule.** Card stock takes green ink for printed text and blue ballpoint for anything the visitor fills in. Chalk stays on the ground and never goes on the card.

## Typography

**Display Font:** Big Shoulders Display, weights 600/800/900 (fallbacks: Arial Narrow, sans-serif)
**Body Font:** Schibsted Grotesk, weights 400–700 plus italic 400, with `ss01` on (fallbacks: system-ui)
**Mono Font:** Azeret Mono, weights 400/500 (fallback: ui-monospace)
**Hand Font:** Nanum Pen Script (fallback: cursive)

**Character:** A sports scoreboard stencil paired with a sturdy, plain grotesque, like a club's printed signage with a caddie's handwriting in the margins.

### Hierarchy
- **Display** (900, clamp(6rem, 11vw, 11.5rem) on desktop and clamp(5.2rem, 17vw, 11.5rem) on mobile, line-height 0.8, uppercase): the owner's name in the hero. The /book page title uses the same voice at clamp(4rem, 12vw, 9rem).
- **Headline** (800, 3rem / 4.5rem / 6rem across breakpoints, line-height 0.86, uppercase): hole names on tee signs. The plaque number beside it is set at 900, 3.75–6rem.
- **Title** (800, 2rem–3.75rem, line-height 0.88–0.92, uppercase): role titles, project names, the book title, and contact labels (up to 4.5rem). Sub-block headings are 1.875–2.25rem.
- **Figure** (800, 2.1rem up to 3.75rem, line-height 1, tabular): Strava figures. Units sit beside them in mono.
- **Body** (400, 1.125rem, line-height 1.625, 52–62ch): descriptions, in mist. A lead paragraph can step up to 1.25rem in chalk.
- **Label** (400–500, 0.875rem): tags joined with "·", captions and field labels, in moss.
- **Yardage** (mono 400, 0.75–0.875rem, tabular, uppercase): "PAR 4 / 436 YDS", date and time readouts, the aim readout, and diagram leader labels (11 units, tracked 0.04em). A 30% chalk slash separates the parts.
- **Pencil** (1.25–1.5rem, sand on the ground): caddie notes, loading and empty states ("checking the tee sheet…"), confirmations, and the handwritten asides beside section headings ("in the bag").

### Named Rules
**The Measured Mono Rule.** Mono is only for numbers that count something (par, yards, times, dates, units) and for the printed row labels on a card (HOLE, PAR, YOU, TEE TIME). Don't use it for prose or buttons.

**The Margin Note Rule.** Pencil is a person writing, not a heading. Keep it short, lowercase and conversational, and place it beside or after the thing it comments on, never above it as a label.

**The Condensed Weight Rule.** Display type is always uppercase and always 800 or heavier. Set the weight explicitly (the build uses inline `fontWeight`).

## Layout

The home page is a single scroll with a 1320px max width and 16px gutters (32px from 640px up). Each hole uses a 12-column grid from 1024px up: the hole diagram takes 5 columns and stays pinned (`top: 24px`, height `100vh − 10rem`), and the text takes 7. The diagram swaps sides from hole to hole, like the pages of a yardage book. Below 1024px the diagram becomes a 220px-tall drawing under the tee sign that scrolls away with the page. It is never sticky on phones, because reading comes first.

Holes have 96px of vertical padding (128px from 640px up). The body starts 48–64px below the tee sign. List items are separated by chalk hairlines with 36–40px of padding. The hero fills the viewport (`100svh`) and puts the name in the left 5 columns and Hole 1 in the right 7. The page has 112px of bottom padding so the fixed scorecard never covers content. The /book page narrows to 1180px and uses a 1.15fr : 1fr split between the tee sheet and the details panel.

Scrolling drives the diagrams: each `[data-shot]` item that crosses 62% of the viewport height moves the ball one shot along that hole, and the scorecard marks the hole whose top has crossed 45%.

## Elevation & Depth

The ground and the text are flat. Depth has two sources. The first is tone: deep rough plaques and panels sit on rough, with a 1px chalk ring at 10%. The second is physical lift for objects resting on the course, which get soft, low shadows with a negative spread that stays close to the object. Shadows are always black, always pushed down, and never glow.

### Shadow Vocabulary
- **Object rest** (`box-shadow: 0 6px 18px -6px rgba(0,0,0,0.5)`): the flag button at rest. On hover it deepens to `0 10px 24px -8px rgba(0,0,0,0.55)` and the button rises 2px.
- **Plaque** (`box-shadow: 0 10px 24px -12px rgba(0,0,0,0.7)`): tee-sign number plaques.
- **Card on turf** (`box-shadow: 0 18px 40px -12px rgba(0,0,0,0.6), 0 2px 6px -2px rgba(0,0,0,0.35)`): the fixed scorecard.
- **Sheet** (`box-shadow: 0 24px 48px -20px rgba(0,0,0,0.7)`): the tee sheet. The album art uses `0 24px 40px -18px`.
- **Held object** (`box-shadow: 0 24px 40px -14px rgba(0,0,0,0.75), 0 4px 10px -4px rgba(0,0,0,0.5)`): the book cover.
- **Sticky strip** (`box-shadow: 0 12px 16px -12px rgba(0,0,0,0.5)`): the mobile hole-map strip.

Inside diagrams, depth is drawn rather than cast: a blurred deep-rough halo under the fairway, a darker sand lip offset under each bunker, tree shadows offset down and to the right, and a ball shadow that moves away from the ball as it rises.

### Named Rules
**The Resting Object Rule.** Only an object that could physically lie on the grass gets a shadow. Text, rules, and list rows never do.

## Shapes

Corners are nearly square, like printed stock: 3px for buttons and album art, 4px for plaques, cards and panels, 2px for the book cover. The one exception is the Spotify embed, which keeps 12px to match the player's own corners. Round shapes belong to the course: the ball, the cup, the live dot, and the organic blob outlines of greens, bunkers and ponds (seeded, irregular, never perfect ovals). Lines are hairlines: 1px chalk rules, 1px leader lines at 55–60% opacity, a dashed aim line (6/5) and a dotted flight path (2/6, round caps). The hand-drawn ellipse that circles the active hole is the one freehand shape.

## Components

### Buttons
Printed, square-shouldered, and physical.
- **Shape:** nearly square (3px).
- **Flag (primary):** flag-red fill, white Schibsted Grotesk 600, 12px × 20px padding, 12px gap for an optional inline SVG flag or arrow. On hover it rises 2px and its shadow deepens (200ms). When disabled it drops to 50% opacity and stops lifting. Use one per view.
- **Line (secondary):** transparent, with a 1px chalk border at 40% and chalk text. On hover the border goes full chalk and a 5% chalk wash fills it. It can be enlarged to 16px × 28px at 1.125rem.
- **Chalk link:** chalk text with a 1px underline at 35% chalk. On hover the underline turns red and the text turns white. An arrow SVG follows it.

### Cards / Containers
There are no content cards. Content sits directly on the ground, separated by hairlines.
- **Tee plaque:** a deep-rough square (4.5rem wide on mobile, 7rem from 640px up) holding the hole number, with a plaque shadow and a 10% chalk ring.
- **Card stock (scorecard, tee sheet):** card background, ink text, 15% ink grid lines, 4px corners, card-on-turf or sheet shadow.
- **Details panel:** deep rough, 10% chalk ring, 4px corners, 24–32px padding. It has no shadow.

### Inputs / Fields
- **Style:** an underline only. The field is transparent with a 1px chalk rule at 30%, no side padding, 10px vertical padding, 1.125rem chalk text, and a placeholder in moss at 70%.
- **Focus:** the underline turns sand. The global 2px sand outline is suppressed on fields because the underline carries focus.
- **On card stock (subscribe):** a 48px card-coloured input with ink text beside a 48px flag-red submit button. Focus shows a 2px flag-red inset underline.

### Navigation
- **Scorecard:** a real `<table>` fixed 12–16px above the bottom edge and centred. Rows: section names (9px, uppercase, 0.06em tracking, 600; shown from 768px up, red for the current hole), HOLE numbers in display 800 as buttons (28 / 36 / 48px wide), PAR in 10px mono, and YOU in blue ballpoint pencil, slightly rotated. When scrolling, YOU fills with a birdie for each hole visited; when carting, it holds the real score, circled under par and boxed over par (double rings for two or more). An OUT column totals the round. The current hole is circled by a red pencil ellipse that draws in over 0.6s. Hover and focus tint the cell with 5% ink. In cart mode, holes not yet reached are disabled at 25% ink.
- **Scorecard tabs:** card-stock tabs sit on top of the card. On the left, a Carting / Scrolling radio pair (the active tab is card stock with a 2px flag-red underline; the inactive one is a darker card grey). On the right, "Hide card". Collapsed, the card becomes a pill showing the circled current hole, its name, and the score to par. Phones start collapsed; the choice is remembered.

### Hole Diagram (signature)
A generated SVG course: contour rings feathered to the edges, a two-tone striped fairway with a cut collar and a soft shadow, a blob-shaped green with a fringe, sand bunkers with a lip, ponds with a dashed ripple, clustered trees, a tee box with two markers, and a cup with a waving red flag (2.4s). Each shot is a 6-unit chalk ring (red when it is the current shot) with a mono leader label and a yardage line, stroked in deep rough so they stay readable. Playable holes (the hero, and every hole in cart mode) are pull-back only. The visitor grabs the ball (which pulses with a chalk ring at rest), drags back, and a sand band runs to the finger while a chalk reticle with a mono readout (`YDS · %` on full shots, `FT` on putts) marks the target. Releasing hits. The flight follows the same gentle curve its dotted trail is drawn with, and the trail grows behind the ball rather than appearing ahead of it. A pencil note names the lie once the ball comes to rest. Marks are sized in screen pixels so they read the same on a phone. Arrow keys pull back and Enter hits. Flights last 450–1400ms, scaled by distance, and slow down as they land; putts roll without lift. In scroll mode the ball plays each marker in turn with a short pause at each, never skipping one.

### Cart Path and Cart (cart mode)
Between two holes, a concrete path in pixel coordinates (never stretched) runs from one hole's map column to the next. Each leg has its own route and scenery: pines, hill switchbacks over contour rings, a creek with a plank bridge, the halfway house, a pond, an avenue of trees, a bunker complex, and the practice green. Each gets one pencil note. The cart is a top-down card-stock body with a red and a green bag on the back. It drives the path with cubic ease-in-out over 3.4–5.2s, scaled by length, while the page follows it, then settles where the next hole's map pins. Ahead of the furthest hole the path is roped off: a parked cart, two chalk posts and a dashed red rope, with "Cart path closed" in display type. Once the hole is finished, the rope becomes a flag-red "Drive to hole N" button.

### Mode Chooser (cart mode)
A card-stock dialog over 75% deep rough, shown once per visit, titled "How are you getting around?". It offers two option cards (Carting, Scrolling), each with a line pictogram, a display name, one sentence, and a mono detail. On phones it is a bottom sheet. Escape chooses Scrolling.

### Caddie Note (signature)
Nanum Pen Script in chalk, stroked in deep rough so it reads over turf, joined to a 2px dot on the drawing by a 1px chalk leader line at 55%. In running text it becomes a sand pencil aside.

### Tee Sheet
Date tabs across the top (a weekday in 10px mono above the date in display 800; the selected tab is filled with ink). Below them, a two-column table: TEE TIME in mono and PLAYER, where the visitor's first name appears in blue ballpoint and the selected row gets a 10% flag-red wash.

## Do's and Don'ts

### Do:
- **Do** open every new section as a hole: a tee plaque with the number, the name in condensed uppercase, a mono "PAR n / yards YDS" line, and a hole diagram whose shots match the section's `[data-shot]` items.
- **Do** keep the page on rough (#14482f) with the contour field behind it on every route, /book included.
- **Do** separate list items with 1px chalk rules at 15% and 36–40px padding instead of boxes.
- **Do** keep body text at 1.125rem, line-height 1.625, and 52–62ch.
- **Do** put data and forms on card stock or a deep plaque. Use green ink for printed text and blue ballpoint for anything the visitor writes.
- **Do** write loading, empty and confirmation messages as short lowercase pencil notes in sand.
- **Do** make motion physical: flights that slow as they land, strokes that draw in (cubic-bezier(0.16, 1, 0.3, 1)), and colour hovers of 200–300ms. Honour `prefers-reduced-motion`.
- **Do** draw icons as small inline SVGs (arrows and a flag) using `currentColor`, with 1.3–1.6px strokes and round caps.

### Don't:
- **Don't** use flag red for anything that isn't the primary action, the pin, or something live or current.
- **Don't** add background bands, gradient fills, glass, or glowing shadows to UI surfaces. The only gradients the world uses are masks (the pointer's contour light and the diagram edge feather).
- **Don't** round corners past 4px, except the Spotify embed at 12px.
- **Don't** set display type in sentence case or lighter than 800, and don't use mono for prose.
- **Don't** put a small uppercase label above a heading. Section identity comes from the tee plaque number and the mono PAR/YDS line under the name.
- **Don't** use chalk text on card stock, or set card labels lighter than ink at 75%, because 10px labels need the contrast.
- **Don't** add bouncy, spring or elastic easing.
