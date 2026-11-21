---
name: Jason Gian Duran Portfolio
description: A clean, tactile editorial portfolio with crisp typography, refined pill controls, subtle ambient depth, and deep Ultramarine ink.
colors:
  surface: "#EDF0F5"
  surface-card: "#FFFFFF"
  primary: "#0824A9"
  primary-hover: "#1D4ED8"
  ink: "#000000"
  ink-soft: "rgba(0, 0, 0, 0.7)"
  muted: "#6B7280"
  muted-quiet: "#D1D5DB"
  border-subtle: "rgba(0, 0, 0, 0.08)"
  border-primary: "rgba(8, 36, 169, 0.35)"
typography:
  display-large:
    fontFamily: "Instrument Serif, serif"
    fontSize: "clamp(6rem, 27vw, 21rem)"
    fontWeight: 400
    fontStyle: "italic"
    lineHeight: 0.86
    letterSpacing: "-0.02em"
  display-heading:
    fontFamily: "Instrument Serif, serif"
    fontSize: "48px - 88px"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.02em"
  display-italic:
    fontFamily: "Instrument Serif, serif"
    fontSize: "1.8rem - 4.25rem"
    fontWeight: 400
    fontStyle: "italic"
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist Mono, monospace"
    fontSize: "15px - 17px"
    fontWeight: 400
    lineHeight: 1.75
  button:
    fontFamily: "Geist Mono, monospace"
    fontSize: "13px - 14px"
    fontWeight: 700
    letterSpacing: "0.03em"
  tooltip:
    fontFamily: "Geist Mono, monospace"
    fontSize: "10px"
    fontWeight: 500
    letterSpacing: "0.16em"
  compose-tools:
    fontFamily: "Geist, sans-serif"
    fontSize: "12px - 17px"
    fontWeight: "500 - 700"
rounded:
  pill: "9999px"
  card: "24px"
  panel: "32px"
---

# Design System: Jason Gian Duran Portfolio

## Creative North Star: "Precision Editorial & Tactile Micro-Interactions"

The portfolio is rooted in a refined, minimalist aesthetic: calm, light Fog Paper backgrounds (`#EDF0F5`), a serif/mono typography pairing (Instrument Serif for display, Geist Mono for body), elegant rounded pill geometry, and deep Ultramarine ink (`#0824A9`). 

**What this design system is:**
- Crisp, modern, clean, and intentional.
- Tactile through deliberate micro-interactions: horizontal wipe hover fills, elastic spring physics, smooth magnification, and subtle ambient lifts.
- Grounded in editorial typography: a narrow, high-contrast Instrument Serif at large sizes against monospaced utility text, with hierarchy carried by size and the roman/italic pairing rather than weight.

**What this design system is NOT (Confirmed Anti-References):**
- **No heavy neumorphism**: No deep extruded mud-shadows, no paired dual-tints (`#A3B1C6`), and no synthetic plastic recesses.
- **No neon accents or loud gradient blobs**: Color is applied as intentional ink, never as gaudy rainbow fills.
- **No rigid section sheet dividers**: The page scrolls fluidly as one seamless canvas.

---

## Colors & Surface Palette

A focused, restrained palette where Fog Paper carries the page and Ultramarine carries intent.

### Primary Ink
- **Ultramarine Ink** (`#0824A9`): Primary accent, prominent headings, active button states, hover fills, focus rings, and selection indicators.
- **Ultramarine Hover** (`#1D4ED8`): Lightened state for interactive highlights and hover glows.
- **Ultramarine Wash** (`rgba(8, 36, 169, 0.10)` to `rgba(8, 36, 169, 0.40)`): Used for subtle micro-wipes, tooltips, and active dock background tints.

### Background & Neutrals
- **Fog Paper** (`#EDF0F5`): The primary background color across the entire portfolio.
- **Card / Control White** (`#FFFFFF` or `bg-surface/80` with backdrop blur): Clean, crisp surfaces for interactive buttons, the floating navbar shell, and tooltip badges.
- **Ink Black** (`#000000`): Pure black for key emphasis and high-contrast text.
- **Ink Soft** (`rgba(0, 0, 0, 0.7)`): Reading text with balanced contrast and optical softness.
- **Muted Gray** (`#6B7280`): Secondary descriptions, inactive states, and tooltips.
- **Border Subtle** (`rgba(0, 0, 0, 0.06 - 0.08)`): Hairline structural borders that give pill controls definition without heavy lines.
- **Border Primary Accent** (`rgba(8, 36, 169, 0.25 - 0.35)`): Hairline brand accent borders on buttons and interactive pills.

---

## Typography

**Two-Typeface System**: Instrument Serif (SIL Open Font License, self-hosted as `InstrumentSerif-Regular.woff2` and `InstrumentSerif-Italic.woff2`) for all display headings and heroic scales; Geist Mono for body text, controls, and metadata. Instrument Serif has one weight, roman and italic, so display type never uses weight utilities (`font-semibold`, `font-black`): `.font-display` pins weight 400 and turns off `font-synthesis`, so a stray weight class can never fake a bold. Hierarchy comes from size and from pairing an italic word with a roman one. Because the face is narrow and light, display sizes run a step larger than a heavy didone would.

**One scoped exception**: Geist (sans, the sibling of Geist Mono; self-hosted latin files `Geist-Variable.woff2` and `Geist-Italic-Variable.woff2`) sets the compose window's formatting tools only: the B / I / U glyphs, their tooltips and the link field. It appears nowhere else, so the browser fetches it only when that window opens.

### Hierarchy
1. **Hero & Name Display** (Instrument Serif italic, `clamp(6rem, 27vw, 21rem)`, tracking `-0.02em`, leading 0.86):
   - Solid Ultramarine ink.
   - Optically centred on the ink, not the letter boxes: shifted `0.137em` right (`translate` on `.hero-name` and `.splash-name`) because the italic J's swash hangs past its box on the left.
   - Cursor proximity lift: letters within 260px of the pointer rise by up to 0.05em on a soft `power3.out` follow; the outline copy in front of Jason mirrors the filled letters exactly.
   - Phones (below md): the name grows to `min(22vw + 3.5rem, 40svh)` (about 76% of the width) and is tied to the portrait rather than the viewport, so Jason's hair overlaps the letters by the same 0.11em as on desktop at every phone height. The hero fills `100svh`, and the photo shrinks on short phones so the greeting always starts at least 80px down, clear of the menu button. The constants live with `.hero-stage` in `src/index.css`; the splash in `index.html` shares the mobile size.
2. **Greeting Flourish** (Instrument Serif roman, `clamp(1.8rem, 4.8vw, 4.25rem)`, tracking `-0.01em`):
   - Conversational opening ("Hey, I’m"), set in ink at 80%.
   - Paired on the same optical baseline as the display name.
3. **Section Headings** (Instrument Serif, 48px mobile / 80px desktop; About 50–84px, Contact 52–88px; tracking `-0.02em`, leading 0.92):
   - About Me, Experience, Stack, Projects, Beyond, Contact.
   - One italic word against roman words ("*About* Me.", "*where* I’ve worked.", "*beyond* the code.") for personality.
   - Card and sheet titles (experience roles 28–32px, project titles up to 50px, the sheet's "*what* I did." at 34px) follow the same rule.
4. **Editorial Prose** (Geist Mono 400, 15px mobile / 17px desktop, leading 1.75):
   - High legibility, generous line height, `text-pretty`.
   - Key location and interest anchors set in `font-semibold text-ink`.
5. **Interactive Labels & Controls** (Geist Mono 700, 13px–14px, tracking `0.03em`):
   - Pill buttons, CTA actions, and download links.
6. **Metadata & Tooltips** (Geist Mono 500, 10px, uppercase, tracking `0.16em`):
   - Floating dock tooltips, project tags, and category labels.

---

## Signature Interactive Patterns

### 1. The Horizontal Wipe Fill
Used across the **Navigation Dock**, the **Resume Button**, and primary action controls:
- **Rest State**: An outlined pill container with transparent or crisp white/surface fill, hairline border (`border-primary/35`), and Ultramarine text/icon.
- **Hover Action**: An inner absolute span wipes horizontally across the pill (`origin-left scale-x-0 group-hover:scale-x-100 bg-primary duration-300 ease-soft`).
- **Foreground Transition**: Text and icons smoothly shift from Ultramarine to pure crisp white (`text-white`).

### 2. Floating Magnification Dock
The signature global navigation:
- **Pill Shell**: Centered at the viewport bottom (`bottom-[calc(1.25rem+env(safe-area-inset-bottom))]`), frosted backdrop blur (`bg-surface/80 backdrop-blur-md`), with a delicate border (`border-black/[0.08]`) and soft ambient shadow (`shadow-[0_12px_36px_-8px_rgba(15,23,42,0.18)]`).
- **Magnification Physics**: Spring-driven size expansion (46px base to 66px peak, `stiffness: 220, damping: 18`) following pointer proximity.
- **Active Section State**: The current active section is rendered in its **fully wiped** Ultramarine state.
- **Dynamic Context Dimming**: When the cursor hovers over a *different* section, the current active section dims to **40% opacity** as a reference anchor, while the prospective destination receives full 100% solid Ultramarine contrast.
- **Desktop and tablet only** (md and up). Below md the dock gives way to the full-screen menu (see 8).

### 3. Tactile Pill Controls & Social Icon Buttons
- **Shape & Targets**: Pure circular and pill geometry with minimum `44×44px` tap targets for accessibility.
- **Subtle Surface Depth**: Clean light background (`bg-surface`), delicate brand border (`border-primary/25`), and a light ambient shadow (`shadow-[0_1px_3px_rgba(15,23,42,0.06)]`).
- **Interactive States**:
  - **Hover**: 2px lift (`-translate-y-0.5`), brand blue glow (`shadow-[0_10px_22px_-6px_rgba(8,36,169,0.3)]`), and icon scale `1.10`.
  - **Press / Active**: Tactile spring settle (`scale: 0.95`, `translate-y-0`, `shadow-[inset_0_2px_4px_rgba(8,36,169,0.15)]`).
  - **Keyboard Focus**: Prominent, accessible ring (`focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`).

### 4. Kinetic Typography Delight
- Headline elements enter with spring physics (`cubic-bezier(0.22, 1, 0.36, 1)` or Framer Motion springs).
- Interactive letters spring up with alternating micro-tilts (`-4°` to `+4°`) and soft ink drop-shadows on hover, allowing users to playfully scrub across typography.

### 5. The Ink-Fill Splash & Name Hand-off
The first visit's focal moment. It lives in `index.html`, so it paints before the app bundle arrives.
- **Ink is the progress bar**: "Jason." is set in Instrument Serif italic at the hero's exact size, starting as a faint, soft wash (Ultramarine at 16%, blurred 3px). Each letter presses to crisp full ink as the page's fonts, photos and scripts actually arrive. Image progress is streamed byte by byte.
- **Status line**: Geist Mono 10px uppercase, `rgb(0 0 0 / 0.62)`, naming the step the fill is passing through (Setting type, Developing portrait, Cutting silhouette, Printing photos, Wiring scripts, Ready). A tabular Ultramarine counter (`000`–`100`) sits opposite.
- **The still beat**: at full ink the name holds while React mounts underneath. The one long main-thread task always lands while nothing on screen moves.
- **Hand-off**: the letters fly to the hero name's measured position with a 40ms trail (scaled down on small type), a pure translation since the splash and the hero share face, size and tracking. The splash then swaps for the real name, pixel for pixel, and only then does the portrait rise in front of it.
- **Rules**: plays once per tab session (`?splash` forces a replay); reduced motion cross-fades without the flight; deep links that land below the hero skip the flight; a failsafe dismisses it if the app never claims it.

### 6. Project Cards & Detail Sheet
"Curated works" uses one card design for every project; content lives in `src/data/projects.js`.
- **Card**: white, 24px radius, hairline border, a 16:9 image on top, then the Instrument Serif title (italic subtitle at 0.55em), an org · role line (an award shows as a filled Ultramarine pill), the summary, and a footer of mono tags beside a "Details +" pill with the horizontal wipe. Two columns from `md`; an odd last card centers.
- **Placeholders**: a missing image shows grid paper with print crop marks; a missing GitHub link or detail list shows a dashed Ultramarine box marked "Placeholder." Fill the data field and the placeholder disappears.
- **Ongoing work** (`ongoing: true`; YSEIS, kept as the last card): an outlined "Ongoing" pill with a slow ping follows the org · role line. Until screenshots exist, the image is a proof still on the press: the project's real design tokens (colors, item statuses, type scale, spacing) printed in two plates that line up exactly. The ink plate is printed up to a 61% frontier, and past it the key plate shows dashed keylines, so the cut runs straight through chips and swatches. With no cover to wait for, it prints as soon as the card is in view: the brayer inks up to the frontier, then keeps working the edge: one stroke, a press just past it, a lift and a rest every 5.2s, paused while the card is off-screen. A "Still printing" line sits inside the crop marks. The name is pressed only part way: the first 60% of its letters at crisp full ink, the next one still wet, sharpening and darkening in time with the brayer and then softening again, and the rest still a soft wash (22% ink, blurred 1.6px). The proof is sized in container units, so the spread shows the same print with a plain caption in place of the screenshot placeholder, and its heading reads "what I've done so far." Reduced motion leaves it at rest, half printed.
- **The press**: as a card enters view, a brayer rolls across its image and reveals it, and the title presses from a soft wash (18% ink, blurred 2px) to crisp full ink, echoing the splash. Cards in a row stagger by 140ms. The press never runs on a missing picture: covers are warmed once the page is idle, each card switches its cover to eager loading 900px before it arrives, and the press starts only when that visible image has decoded. On a slow network it waits at most 1.4s, then prints onto the blank grid-paper sheet (the media frame's own background) and the picture fades in (0.5s) when it lands.
- **Expansion**: the whole card is one button. It morphs over the dimmed page through shared `layoutId`s (shell, image, title) on the contact window's spring (`stiffness 260, damping 32, mass 0.9`). Esc, the close button or a backdrop click folds it back into its card, and focus returns there.
- **The spread** (desktop, `lg` and up): the sheet opens as a two-page spread up to 1240px wide. The left page is grid paper with crop marks holding one large print of the current screenshot, sized so the spread fits the viewport height; under it sit a `02 / 04` counter, the image's description as a visible caption, outline arrow buttons with the wipe, and a thumbnail strip. The right page (340–430px) has no eyebrow labels. It opens with the title, the org · role line and the tags as a mono slash line, then the links (live app solid and GitHub outline, side by side at equal width), then the summary as an unlabeled lead paragraph (15px, ink at 85%). "What I did" follows under a heading in the site's own section style (*what* in Instrument Serif italic, *I did.* in roman), its points separated by hairlines. Only the right page scrolls, inside a band that starts below the close button, so the print stays in view while reading. Phones and tablets stack the two pages and scroll the whole sheet, with the counter and arrows on one row over a full-width caption.
- **Turning images**: the next print is revealed behind the same brayer that prints the cards, rolling in the direction of travel (0.72s). Arrow keys, the buttons, thumbnails and horizontal swipes all turn. Screenshots preload when the sheet opens.
- **The loupe**: hovering the print with a mouse shows a small 160px lens at a light 1.35x, which reads as a close look rather than a blow-up and keeps the surrounding UI in view; it stays crisp since the screenshots are about 2.4x the print's size. The lens follows the pointer with no easing; only its glass fades and grows in. Its hint ("Hover the image to inspect") sits fixed at the right end of the thumbnail row, never inside a caption.
- **Mouse, not media queries**: the lens opens only on real mouse movement, and the hint appears once a mouse has moved inside the sheet. Never gate either on `hover`/`pointer` media queries: Chrome on touchscreen laptops reports "no hover, coarse pointer" even while a mouse or trackpad drives it, which hid the loupe entirely.
- **Scroll edges**: scrolling text fades out at the bottom always, and at the top once scrolled, so it never runs hard under the close button.

### 7. Kismet, the portfolio assistant
The site's chatbot (`src/components/ChatBot.jsx`, face in `KismetFace.jsx`, server in `server/`).
- **Identity**: the name is set like the hero name: Instrument Serif italic in Ultramarine with a full stop ("Kismet."). The mark is a split-face tortoiseshell cat inside an Ultramarine ink disc, the same 46px circle as the dock's buttons, with a faint second Ultramarine plate behind it like a two-plate print. Every shape is rounded: soft ears inside the circle, round amber eyes with oval pupils, a soft pink nose, a pale muzzle and curved cream whiskers. No pointed or angular shapes in the face.
- **Tortoiseshell palette** (the one place warm colour enters the site, and only inside the mark): dark fur `#33251E`, ginger `#DE8638`, caramel flecks `#B5642C`, muzzle `#F2CB98`, inner ear `#E59C7E`, nose `#D7796C`, iris `#F0BF48`, line ink `#1E1511`, whiskers `#FCEEDC`.
- **Launcher**: a 64px circle holding only Kismet's face, the same height as the dock shell and on the dock's exact line (`bottom-[calc(1.25rem+env(safe-area-inset-bottom))]`). Below md there is no dock, so the launcher has the bottom row to itself on that same line. No label. Hover (and keyboard focus-visible): lifts 3px and grows to 1.05, the shadow deepens, the second ink plate slides out from under the disc like a sticker peeling off the page, the cat's eyes close happily, and an "Ask Kismet" label appears above it in the dock's tooltip style. Press: 0.94. The launcher only ever scales uniformly; it is never stretched.
- **Signature moment (registration)**: while Kismet thinks, the second plate drifts out of register behind the disc, the pupils widen and glance up, and an ear flicks every second or so; when the answer starts the plate snaps back into register on a stiff spring. That is the only looping motion. At rest the cat blinks irregularly, twitches an ear now and then, and follows the pointer with its pupils. On hover its eyes close into content "^ ^" arcs and its ears perk; while it streams, the jaw drops with each chunk and the whiskers flick; on an error its ears flatten and its mouth goes flat.
- **Panel**: opens and closes as a lens, a circular `clip-path` centred on the launcher. Open: an Ultramarine disc exactly the size of the face disc (30.5px radius) grows into the panel over 0.52s (`cubic-bezier(0.22, 1, 0.36, 1)`), fading to white in the first 0.32s, with the contents fading in 0.16s behind the edge. Close: contents fade out (0.12s), the lens contracts back onto the disc over 0.36s (`cubic-bezier(0.65, 0, 0.35, 1)`) and turns Ultramarine as it lands, then the launcher reappears on a bouncy spring. No shared-element morph, so nothing is ever stretched. Reduced motion: plain fades. The panel's bottom edge sits on the launcher's bottom edge (below md and from `xl` up, both on the dock's line; on phones the panel's top stays below the menu button). Between md and `xl` a 25rem panel on that line would cover the dock, so there it sits 12px above the dock instead. White surface, no header rule.
- **Chat bubbles**: Kismet's messages (the greeting included) are Fog Paper bubbles, 18px radius with a 5px tail corner at bottom-left, each with a still 22px Kismet avatar at that corner showing the message's expression (error face on errors). Visitor messages are Ultramarine bubbles with white text, tail at bottom-right, a soft blue drop shadow, and white-on-blue text selection. Suggestion chips sit indented to the bubble column. Thinking is a bubble of three Ultramarine dots that ink in turn, and the reply streams into that same bubble. Errors are a dashed Ultramarine bubble with a "Try again" pill that resends the last question. Geist Mono 13px / 1.55 throughout (errors 12.5px, suggestion chips 12px), 12px between messages; the input stays 16px on phones so iOS does not zoom; bubbles wrap naturally (no `text-wrap: pretty`).
- **Pop-up dialogue**: Kismet speaks up in a white speech bubble right above the launcher (tail corner at bottom-right, toward the cat). Triggers: the first time a section settles in the middle of the viewport for 1.5s (with a section-specific line, and the cat glancing the way you scrolled), plus an idle timer (first at 8s, then every 40s). At least 15s apart, at most 6 per page load, never while the chat is open or the tab is hidden. Opening the chat only pauses them; dismissing a bubble mutes Kismet for 2 minutes, a second dismissal for the rest of the page load. Nothing is persisted, so a reload starts fresh. The bubble springs out of its tail corner with a short blur clearing, the line types out at 26ms a letter while the cat's mouth moves and it does a small hop, and the full text is reserved invisibly so the bubble never reflows. An "Ask Kismet" hint fades in once typed; clicking the bubble opens the chat and asks that question. It lingers 7s after typing, longer while hovered or focused. Reduced motion: no typing, hop or spring; the bubble fades in with its full text.
- **Replies**: Kismet answers with one direct sentence, then 2-4 short `- ` bullets when there is more to say, with **project/tool names** in bold (knowledge and prompt rules in `server/knowledge.js`). A single fact or link stays inline in the sentence. The bubble renders real lists with 4px Ultramarine dots and semibold ink for bold names; URLs, emails and the resume path become underlined Ultramarine links that wrap only after "/", "-" or "@".
- **Ink press**: each streamed word mounts at weight 200 in faint Ultramarine and presses to reading ink, echoing the splash. Reduced motion turns off the press, the loops, pupil tracking, blinking and ear twitches; expressions (mouth, ears, eyes) still change.

### 8. Mobile menu (below md)
Phones and small tablets swap the dock for one button and a full-screen menu (`src/components/MobileMenu.jsx`). Desktop and tablet (md and up) never render either.
- **Button**: a 48px circle fixed at the top right (`top-[calc(1rem+env(safe-area-inset-top))] right-4`) in the dock's shell (`bg-surface/80 backdrop-blur-md`, hairline border, the dock's soft shadow), holding two 18px ink hairlines. Open, it fills with Ultramarine and the lines spring into a white X (`stiffness 420, damping 28`). Press: 0.92. It sits at `z-[66]`, above Kismet (60) and below the modal sheets (70), so it never covers a sheet's close button.
- **Open**: the button spills its ink. A circular `clip-path` lens centred on the button grows from its 24px radius to the farthest corner over 0.62s (`cubic-bezier(0.22, 1, 0.36, 1)`) while the surface dries from Ultramarine to Fog Paper (0.44s), the same lens as Kismet's panel. "Jason." (Instrument Serif italic, 30px, Ultramarine) shares the button's row. The section names (Instrument Serif, `min(clamp(2.75rem, 12.5vw, 4rem), 7.5svh)`, leading 1.02, every row at least 48px tall) then press from a faint wash (18% Ultramarine, blurred 3px, 22px low) to crisp ink, 45ms apart. The current section is set italic in Ultramarine with an 8px ink dot, the one italic word among roman ones. A row of the Resume pill and GitHub, LinkedIn and email buttons (the About controls, wipe fill on press) rises last.
- **Close**: the names lift off (0.14s), then the lens contracts back onto the button over 0.44s (`cubic-bezier(0.65, 0, 0.35, 1)`) and turns to ink as it lands; the button holds its ink until then. Choosing a section starts the scroll as the lens contracts, so the page arrives under it.
- **Behaviour**: the page is locked while open; focus moves to the first name, Tab cycles between the button and the menu, Esc closes, and focus returns to the button. Short landscape screens scroll inside the menu. Growing past md closes it. Reduced motion: plain 0.2s fades, no lens, press or spring.

### 9. Contact finale: ink over the ridges
The last screen closes the hero's ridgelines and the site's print theme in one scroll-driven sequence (`src/components/Contact.jsx`, backdrop in `src/components/contact/ContactScene.jsx`, ridges from `contact/ridge.js`, styles under "Contact: the finale" in `src/index.css`). Progress `p` runs from the section's top meeting the bottom of the viewport (0) to the end of the page (1).
- **The flood**: three pale ranges (`#DDE3ED`, `#C6D0E3`, `#9EACD4`, each with a white crest line) rise one after another, then the front range, solid Ultramarine with a faint Fog Paper crest, floods the section. Each settles a little lower than the one behind, so the last screen is ink under a ridgeline with the Fog Paper sky above. The content always sits on ink, which is why its type is Fog Paper (text at 80%, the copyright at 60%). Phones get shallower ranges so the sky band never reaches the copy.
- **Plates**: the headline is printed in three plates: Fog Paper in front, Ultramarine Hover and Fog Paper at 30% behind, out of register by about 20px. They close in with the scroll and land on a spring (`stiffness 150, damping 15`), overshooting a touch as they snap into register at the bottom.
- **On the ink**: the backdrop is a map, a print shop and a letter at once, with no photographs.
  - *Map*: contour rings draw themselves around two summits (west, behind the copy; east, under the compass), inner rings last. A compass rose (ticks, an eight-point rose with N in the hero's italic, a dashed crosshair and the label "14.41°N · 121.04°E") swings from 150° off toward north with the scroll and settles on a loose spring (lg only).
  - *Print shop*: letterpress sorts, blocks of type metal drawn in Fog Paper outline with a lit face and two nicks, carrying a reversed "J" and "@" in the hero's italic. They drift in at different depths: two beside the copy from lg, two small ones flanking the ridges below lg.
  - *Letter*: airmail stripes (Fog Paper and Ultramarine Hover bars) slide down both edges of the ink in a seamless 7s loop. A paper plane (Lucide `Send`) rides a CSS `offset-path`: on desktop it takes off from the "@" sort and flies a dotted trail to the compose button, and below lg it crosses the sky above the ridges with a dotted Ultramarine contrail, parking short of the menu button.
  - The hollow "Jason." in the hero's italic, 1px Fog Paper outline at 30%, bleeds off the foot of the page.
- **Arriving** (`p` ≥ 0.985, released below 0.9), in turn: the sorts press and leave their prints, the glyph the right way round in a 20% Fog Paper wash; the postmark (Fog Paper ink, a double ring reading "MUNTINLUPA · PH", the coordinates and today's date, wavy cancel lines drawn like the ridges and a rubber-stamp ink filter) slams down beside the copy, or at the bottom left below lg; a map pin drops onto the compass centre with a ripple over the contours; the plane loops once and settles; "Jason." fills with a 9% Fog Paper wash; a ring pings twice where the trail meets the button; and the envelope's two back-flap seams draw in behind the name.
- **Pointer**: with a mouse, the sorts, contours, compass and name shift a few pixels against the pointer on a soft spring, nearer layers more, and the sorts tilt slightly.
- **Controls on ink**: the compose pill is white with Ultramarine type, so it grows into the white compose window without a colour change. The email pill and link pills are outlined in Fog Paper at 15–30%; the links wipe to Fog Paper with Ultramarine type on hover, and focus rings are Fog Paper with an Ultramarine offset. Text selected on the ink highlights in Fog Paper.
- **Compose window** (`src/components/ComposeWindow.jsx`): a white 24px-radius window (640px, or 5xl when expanded) under a 56px Ultramarine title bar reading "New message" with a dot and "Goes straight to my inbox" in white at 70% (it truncates on narrow phones). The envelope rows (To, From, Reply to, Subject) share a 4.5rem mono label column and 48px lines with hairlines between; a field's error sits under that field in red with a small alert icon, and only the message and send errors sit above the action bar. A hairline opens the action bar: from sm it is one row, with the formatting tools on the left and discard and Send on the right; phones stack the tools (spread across the width) over discard and Send, in the same focus order. The tools are 36px marks in a 44px hit area: B, I and U are drawn in Geist as the style itself, lists, link and clear formatting are Lucide icons. Hover is Fog Paper with ink, pressed is a 10% Ultramarine wash with Ultramarine ink. Each tool has an ink tooltip in Geist 12px with its shortcut at 55% white (Ctrl or ⌘ + B, I, U, K, \), shown after 300ms on hover and at once on keyboard focus; the first and last tooltips align to their edge so the window never clips them. The link field replaces the tools in place as a Fog Paper field in Geist with Cancel and a solid Apply. Send keeps the site's mono pill and carries its shortcut inside, after a hairline (sm and up). Inputs and the editor use an Ultramarine caret.
- **Reduced motion**: the finished scene with nothing moving: flooded, in register, contours drawn, compass on north with the pin down, sorts placed with their prints, the plane parked, the postmark down, the seams drawn and the name filled. The airmail stripes stand still.

### 10. About: the toss
The About photo shows Jason throwing papers in the air; the section finishes the throw (`src/components/about/FallingPapers.jsx`, physics and drawing in `about/papers.js`). Canvas 2D, no library.
- **The toss**: when the photo is 40% in view, 22 sheets (13 on phones) leave the photo's paper cluster over half a second, thrown up and out from a point right of centre, so most head left over the open page behind the copy. After that one sheet (now and then two) slips out every 2.6–5.2s while the section is on screen.
- **Flutter**: each sheet turns in the page plane and about its own horizontal axis, drawn as a vertical scale of cos(phi): edge-on it thins to a sliver, past 90° it shows a slightly cooler back. Drag follows how flat the sheet is to the fall, so flat sheets float (about 90px/s) and edge-on ones slice down; that is the whole flutter. Sixty percent rock about a flat pose with a slow pendulum sway (±25–60px); the rest tumble end over end and drift the way they spin. A slow leftward breeze varies under them. Right after the toss the air has not caught them yet, so they rise before they fall.
- **Depth**: sizes run from about 26px (far) to 75px (near), lighter and slower when far. Far sheets draw on a canvas under the photo, so the cut-out hides them as they pass behind Jason; near sheets draw on a canvas over the photo. Both sit under the copy, which always stays on top.
- **Sheets**: white paper with a hairline edge and a soft blurred shadow cast further off the nearer the sheet. Four kinds: blank (like the photo's own), a typed page, a resume-like page with an Ultramarine heading, and grid paper. Printed backs show the text faintly through, mirrored. Sheets shade toward Ultramarine ink as they turn away.
- **Mouse gust**: a moving mouse drags nearby sheets with the air it pushes (blending them toward the pointer's velocity within 180px) and sets them spinning. Mouse only: a finger on the page is scrolling.
- **Edges**: sheets fade in over 0.35s as they leave the photo, fade out over the last 150px of the section, and may rise up to 128px above it before fading.
- **Cost**: the loop runs only while the section is on screen and the tab is visible; canvases render at up to 1.5x. Reduced motion draws one still frame of the toss, 1.2s in, with no sheet left edge-on.

---

## Motion & Accessibility Standards

- **Easing Curves**: Use soft cubic easing `cubic-bezier(0, 0, 0.2, 1)` or `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Performance**: Animate exclusively `transform` and `opacity`. Use `will-change` judiciously during active transitions only.
- **Reduced Motion (`prefers-reduced-motion`)**:
  - Always respect user system preferences.
  - Bypass multi-step entrance animations and spring loops; immediately render full rest states.
  - Retain color shifts and border transitions since they do not cause motion sickness.
- **Screen Reader Readiness**:
  - Provide explicit, descriptive `aria-label` attributes (`"GitHub profile"`, `"Send email"`, `"Resume"`).
  - When text lines dynamically cycle, maintain a visually hidden screen-reader list (`sr-only`) and mark the animated container `aria-hidden="true"`.

---

## Do's and Don'ts

### Do:
- **Do** keep surfaces clean, light, and minimal (`#EDF0F5` background, `#FFFFFF` / `bg-surface` pills).
- **Do** use the horizontal wipe hover effect for interactive pills and primary CTA buttons.
- **Do** maintain a strict 44×44px minimum tap target for all circular and icon buttons.
- **Do** use Instrument Serif for display headings and Geist Mono for all body, controls, and metadata. Never put weight utilities on display type.
- **Do** use Ultramarine `#0824A9` as the singular brand voice for typography, active states, and focal contrast.
- **Do** vertically center aligned button rows (such as Resume and social icons) on a shared axis with uniform height.

### Don't:
- **Don't** use heavy neumorphic dual-shadows, sunken clay insets, or extruded mud effects.
- **Don't** use hard sheet dividers that chop the scroll experience into disjointed cards.
- **Don't** mix fonts outside the serif (display) + mono (utility) pairing. The one exception is Geist sans on the compose window's formatting tools; don't spread it further.
- **Don't** clip text ascenders/descenders by applying tight `overflow-hidden` wrappers without generous padding.
