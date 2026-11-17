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
