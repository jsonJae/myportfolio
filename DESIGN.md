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
    fontFamily: "Bodoni Moda, serif"
    fontSize: "88px"
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: "-0.045em"
  display-heading:
    fontFamily: "Bodoni Moda, serif"
    fontSize: "56px"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.04em"
  display-italic:
    fontFamily: "Bodoni Moda, serif"
    fontSize: "30px - 44px"
    fontWeight: 500
    fontStyle: "italic"
    letterSpacing: "-0.02em"
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
rounded:
  pill: "9999px"
  card: "24px"
  panel: "32px"
---

# Design System: Jason Gian Duran Portfolio

## Creative North Star: "Precision Editorial & Tactile Micro-Interactions"

The portfolio is rooted in a refined, minimalist aesthetic: calm, light Fog Paper backgrounds (`#EDF0F5`), a serif/mono typography pairing (Bodoni Moda for display, Geist Mono for body), elegant rounded pill geometry, and deep Ultramarine ink (`#0824A9`). 

**What this design system is:**
- Crisp, modern, clean, and intentional.
- Tactile through deliberate micro-interactions: horizontal wipe hover fills, elastic spring physics, smooth magnification, and subtle ambient lifts.
- Grounded in high-contrast typography: didone serifs with razor hairlines paired against monospaced utility text, with 900 weights contrasted by delicate italic flourishes.

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

**Two-Typeface System**: Bodoni Moda for all display headings and heroic scales; Geist Mono for body text, controls, and metadata. The serif/mono pairing signals "designer + developer" and delivers editorial refinement on headings while maintaining tool-like clarity in prose and UI.

### Hierarchy
1. **Hero & Name Display** (Bodoni Moda 900, 56px–88px+ mobile/desktop, tight tracking `-0.045em`, leading ~0.92):
   - Solid Ultramarine ink.
   - Interactive letter-level physics: spring bounce on hover, kinetic wave cascading on tap/click.
2. **Greeting Flourish** (Bodoni Moda 500 italic, 30px–44px, tracking `-0.02em`):
   - Lowercase conversational opening ("hey, I’m", "hi, I’m").
   - Paired on the same optical baseline as the display name.
3. **Section Headings** (Bodoni Moda 900, 40px–68px, tracking `-0.035em`):
   - About Me, Experience, Stack, Projects, Beyond, Contact.
   - Mix of full weight ("Me.", "Stack") and regular weight italic ("About", "Experience") for personality.
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
- **Compact View**: Compresses to 42px icons on narrow screens (<420px) to guarantee zero horizontal overflow.

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
- **Weight is the progress bar**: "Jason." is set in Bodoni Moda italic at the hero's exact size, starting as faint hairlines (weight 400, Ultramarine at 16%). Each letter presses to full ink (weight 900) as the page's fonts, photos and scripts actually arrive. Image progress is streamed byte by byte, and weights snap to steps of 10.
- **Status line**: Geist Mono 10px uppercase, `rgb(0 0 0 / 0.62)`, naming the step the fill is passing through (Setting type, Developing portrait, Cutting silhouette, Printing photos, Wiring scripts, Ready). A tabular Ultramarine counter (`000`–`100`) sits opposite.
- **The still beat**: at full weight the name holds while React mounts underneath. The one long main-thread task always lands while nothing on screen moves.
- **Hand-off**: the letters fly to the hero name's measured position with a 40ms trail (scaled down on small type) and settle from 900 to the hero's resting 600. The splash then swaps for the real name, pixel for pixel, and only then does the portrait rise in front of it.
- **Rules**: plays once per tab session (`?splash` forces a replay); reduced motion cross-fades without the flight; deep links that land below the hero skip the flight; a failsafe dismisses it if the app never claims it.

### 6. Project Cards & Detail Sheet
"Curated works" uses one card design for every project; content lives in `src/data/projects.js`.
- **Card**: white, 24px radius, hairline border, a 16:9 image on top, then the Bodoni title (italic subtitle at 0.55em), an org · role line (an award shows as a filled Ultramarine pill), the summary, and a footer of mono tags beside a "Details +" pill with the horizontal wipe. Two columns from `md`; an odd last card centers.
- **Placeholders**: a missing image shows grid paper with print crop marks; a missing GitHub link or detail list shows a dashed Ultramarine box marked "Placeholder." Fill the data field and the placeholder disappears.
- **Ongoing work** (`ongoing: true`; YSEIS, kept as the last card): an outlined "Ongoing" pill with a slow ping follows the org · role line. Until screenshots exist, the image is a proof still on the press: the project's real design tokens (colors, item statuses, type scale, spacing) printed in two plates that line up exactly. The ink plate is printed up to a 61% frontier, and past it the key plate shows dashed keylines, so the cut runs straight through chips and swatches. On entry the brayer inks up to the frontier, then keeps working the edge: one stroke, a press just past it, a lift and a rest every 5.2s, paused while the card is off-screen. A "Still printing" line sits inside the crop marks. The name is pressed only part way: the first 60% of its letters at full ink, the next one wet and pressing in time with the brayer, the rest hairlines. The proof is sized in container units, so the spread shows the same print with a plain caption in place of the screenshot placeholder, and its heading reads "what I've done so far." Reduced motion leaves it at rest, half printed.
- **The press**: as a card enters view, a brayer rolls across its image and reveals it, and the title presses from weight 400 at 20% ink to 900, echoing the splash. Cards in a row stagger by 140ms.
- **Expansion**: the whole card is one button. It morphs over the dimmed page through shared `layoutId`s (shell, image, title) on the contact window's spring (`stiffness 260, damping 32, mass 0.9`). Esc, the close button or a backdrop click folds it back into its card, and focus returns there.
- **The spread** (desktop, `lg` and up): the sheet opens as a two-page spread up to 1240px wide. The left page is grid paper with crop marks holding one large print of the current screenshot, sized so the spread fits the viewport height; under it sit a `02 / 04` counter, the image's description as a visible caption, outline arrow buttons with the wipe, and a thumbnail strip. The right page (340–430px) has no eyebrow labels. It opens with the title, the org · role line and the tags as a mono slash line, then the links (live app solid and GitHub outline, side by side at equal width), then the summary as an unlabeled lead paragraph (15px, ink at 85%). "What I did" follows under a heading in the site's own section style (*what* in Bodoni italic, *I did.* in black), its points separated by hairlines. Only the right page scrolls, inside a band that starts below the close button, so the print stays in view while reading. Phones and tablets stack the two pages and scroll the whole sheet, with the counter and arrows on one row over a full-width caption.
- **Turning images**: the next print is revealed behind the same brayer that prints the cards, rolling in the direction of travel (0.72s). Arrow keys, the buttons, thumbnails and horizontal swipes all turn. Screenshots preload when the sheet opens.
- **The loupe**: hovering the print with a mouse shows a small 160px lens at a light 1.35x, which reads as a close look rather than a blow-up and keeps the surrounding UI in view; it stays crisp since the screenshots are about 2.4x the print's size. The lens follows the pointer with no easing; only its glass fades and grows in. Its hint ("Hover the image to inspect") sits fixed at the right end of the thumbnail row, never inside a caption.
- **Mouse, not media queries**: the lens opens only on real mouse movement, and the hint appears once a mouse has moved inside the sheet. Never gate either on `hover`/`pointer` media queries: Chrome on touchscreen laptops reports "no hover, coarse pointer" even while a mouse or trackpad drives it, which hid the loupe entirely.
- **Scroll edges**: scrolling text fades out at the bottom always, and at the top once scrolled, so it never runs hard under the close button.

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
- **Do** use Bodoni Moda for display headings and Geist Mono for all body, controls, and metadata.
- **Do** use Ultramarine `#0824A9` as the singular brand voice for typography, active states, and focal contrast.
- **Do** vertically center aligned button rows (such as Resume and social icons) on a shared axis with uniform height.

### Don't:
- **Don't** use heavy neumorphic dual-shadows, sunken clay insets, or extruded mud effects.
- **Don't** use hard sheet dividers that chop the scroll experience into disjointed cards.
- **Don't** mix fonts outside the serif (display) + mono (utility) pairing.
- **Don't** clip text ascenders/descenders by applying tight `overflow-hidden` wrappers without generous padding.
