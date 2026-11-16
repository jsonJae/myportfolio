---
name: Jason Gian Duran Portfolio
description: A tactile, neumorphic portfolio where soft extruded surfaces carry one deep ultramarine ink.
colors:
  surface: "#EDF0F5"
  surface-deep: "#E3E8EF"
  primary: "#0824A9"
  ink: "#000000"
  ink-soft: "rgba(0, 0, 0, 0.7)"
  muted: "#6B7280"
  muted-quiet: "#D1D5DB"
  border-highlight: "rgba(255, 255, 255, 0.6)"
  shadow-tint: "#A3B1C6"
typography:
  display:
    fontFamily: "Geist Mono, monospace"
    fontSize: "64px"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.025em"
  display-small:
    fontFamily: "Geist Mono, monospace"
    fontSize: "40px"
    fontWeight: 900
    lineHeight: 1.05
  display-intro:
    fontFamily: "Geist Mono, monospace"
    fontSize: "30px"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.02em"
  display-intro-small:
    fontFamily: "Geist Mono, monospace"
    fontSize: "22px"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.02em"
  display-name:
    fontFamily: "Geist Mono, monospace"
    fontSize: "80px"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.03em"
  display-name-small:
    fontFamily: "Geist Mono, monospace"
    fontSize: "48px"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Geist Mono, monospace"
    fontSize: "54px"
    fontWeight: 900
    lineHeight: 0.9
  headline-small:
    fontFamily: "Geist Mono, monospace"
    fontSize: "30px"
    fontWeight: 900
    lineHeight: 0.95
  title:
    fontFamily: "Geist Mono, monospace"
    fontSize: "24px"
    fontWeight: 900
    lineHeight: 1.1
  body:
    fontFamily: "Geist Mono, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.75
  body-about:
    fontFamily: "Geist Mono, monospace"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.75
  body-about-small:
    fontFamily: "Geist Mono, monospace"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.75
  body-small:
    fontFamily: "Geist Mono, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Geist Mono, monospace"
    fontSize: "10px"
    fontWeight: 500
    letterSpacing: "0.18em"
  hero-ambient:
    fontFamily: "Geist Mono, monospace"
    fontSize: "18px"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "0"
rounded:
  well: "16px"
  card: "24px"
  label: "28px"
  panel: "32px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-nav:
    textColor: "{colors.muted}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  button-nav-active:
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  button-icon:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    size: "48px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "24px 32px"
  chip:
    textColor: "{colors.muted}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
---

# Design System: Jason Gian Duran Portfolio

## Overview

**Creative North Star: "The Tactile Sketchbook"**

The portfolio behaves like a physical design notebook: every surface is a sheet of matte, slightly cool paper, and every control is something the hand could press. Depth is not decoration here, it is the primary affordance language. Elements are extruded from the same Fog Paper background at rest, recess into it when selected, and lift further when hovered. The only ink is Ultramarine, used for type, icons, and active states, never as a large fill.

The interface is calm and low-chroma so the work and the portrait carry the color. Type is deliberately split: a heavy, high-contrast display face (Hartwell-Black) announces sections and labels, while a hairline extra-light body face (Ambulatoria) handles reading. That contrast, heavy ink against faint gray prose, is the system's signature rhythm.

The result should feel handcrafted and precise at once: soft forms with confident, decisive press-and-lift states. Confirmed anti-reference: neon accents, glassy gradient blobs, and flat Material-style cards are rejected; depth must stay soft and physical, never glossy or synthetic.

**Key Characteristics:**
- One background, one ink. Fog Paper `#EDF0F5` carries everything; Ultramarine `#0824A9` is the sole accent.
- Depth is tactile and dual: paired light/shadow on every raised or recessed surface.
- Large radii and pill navigation keep the material soft and pressable.
- Heavy display type against hairline body type; the weight gap is the hierarchy.
- Motion is slow, looping, and ambient in the hero, crisp and short on interaction.

## Colors

A near-monochrome system: a cool light gray field with a single saturated blue, plus black for body reading.

### Primary
- **Ultramarine Ink** (#0824A9): All display type, section headings, active navigation, social and icon glyphs, chip hover text, and the hero word cloud. Used as ink on the paper, not as a background fill.
- **Ultramarine Hover** (`blue-700` / #1D4ED8): The only hover tint, used on social icons; a slight lightening of the ink on interaction.

### Neutral
- **Fog Paper** (#EDF0F5): The universal background and the color every extruded surface shares. Cards, nav shell, chips, and wells are all Fog Paper; separation comes only from shadow, never from a different fill.
- **Deep Fog Paper** (#E3E8EF): The one tonal step below Fog Paper, used only for the alternating section sheets from Experience onward. It is a full-bleed section band, never a card or control fill; cards inside it stay Fog Paper and read as lighter paper laid on a deeper sheet.
- **Shadow Tint** (#A3B1C6): The cool gray baked into every drop shadow's dark side. It is what makes the paper read as cool rather than dirty.
- **Paper White** (`rgba(255,255,255,0.5–0.6)`): The highlight side of every shadow and the hairline border on labels and the scrolled nav. Never a solid white fill.
- **Ink Black** (#000000, and 70% for softened prose): Body copy inside cards. Plain black, not gray, for primary reading text.
- **Quiet Gray** (#6B7280 / `gray-500`): Inactive nav items and chip text.
- **Disabled Gray** (#D1D5DB / `gray-300`): Nav items without a destination. Deliberately low contrast; they are non-interactive.

### Named Rules
**The One Ink Rule.** Ultramarine is ink, not paint. It appears on type, glyphs, and state indicators only; no component uses it as a large background fill. Its rarity is what makes it read as intentional.

**The Single Paper Rule.** Every raised surface is the same Fog Paper as the page behind it. If a surface needs a different background to be legible, the shadow is wrong, not the color. The only exception is the section sheet: a full-bleed band may use Deep Fog Paper to mark a new section, and cards inside it still use Fog Paper.

## Typography

**Display Font:** Geist Mono, used for all text: headings, prose, labels, metadata, and controls.
**Body Font:** Geist Mono (same family, regular weight).
**Label Font:** Geist Mono at 500 for uppercase labels, metadata, tags, and nav tooltips.

**Character:** One typeface, one voice. Geist Mono carries the whole system: heavy 900 for statements and names, 400 for prose, 500 for labels. Because monospace fixes every glyph to the same width, hierarchy comes from size, weight, and ink rather than a face change; headings are tight and often lowercase ("curated works.", "beyond the code."). Italic display words are synthesised from Geist Mono and used sparingly as the only typographic flourish.

### Hierarchy
- **Display** (Geist Mono 900, 64px desktop / 40px mobile, line-height 0.95–1): Section announcements ("curated works."). Always Ultramarine and centered in the section.
- **About heading** (Geist Mono 900): one inline line. "hey, i'm" is 30px desktop / 22px mobile; "Jason" is 80px desktop / 48px mobile, tight tracking, same Ultramarine. "Jason" is always the larger, louder word, and its letters rise in a 55ms stagger.
- **Headline** (Geist Mono 900, 54px desktop / 30–40px mobile, line-height 0.9): The "designer" and "developer" label cards in the hero. Tightest tracking, lowercase.
- **Title** (Geist Mono 900, 20–24px, line-height 1.1): Project card titles.
- **About body** (Geist Mono 400, 17px desktop / 15px mobile, line-height 1.75): Both About paragraphs share the same size and weight. The location, "Muntinlupa, Philippines", follows "Los Baños" in the first paragraph, set in 600 ink-black inline. "where AI is headed" is bolded the same way in the second. No markers or underlines.
- **Body** (Geist Mono 400, 14px desktop / 13px mobile, line-height 1.75): Prose in Projects, Experience, Beyond, and Contact. Softened to 70% black.
- **Label** (Geist Mono 500, 10px, uppercase, wide tracking): Project tags, roles, and metadata; nav tooltips use it at 11px.
- **Hero ambient** (Geist Mono 900, 11–26px, alphabetical word cloud): An intentional freeform scale, sized by word importance rather than a fixed step. This is the only place size is set by feel.

### Named Rules
**The Weight Gap Rule.** Display and body type must never sit near the same weight. If a heading looks merely bold, it is wrong; it should look pressed into the paper. Body copy stays at regular weight.

**The Mono About Rule.** The About section is the one place where Geist Mono carries prose. Do not use colored inline words, serif accents, underlines, or marker highlights there; emphasis comes from scale, ink weight, and the single name reveal.

## Layout

Single scrolling page, full-viewport sections, no visible grid lines. Content is centered with generous outer margins rather than a boxed container.

**Section sheets.** From Experience onward, each section is its own full-bleed sheet of paper laid over the previous one. Alternate sheets take the Deep Fog Paper band; the others stay Fog Paper. Every sheet carries a 32px rounded top, a cool hairline seam with an inset white highlight, and an upward soft shadow so the next section reads as resting on top of the last. Where the browser supports scroll-driven animation, each sheet settles in (translate 30px, scale 0.992 → 1) over the first 30% of its entry; reduced-motion users get the sheet with no settle. Home and About stay directly on the page surface and are not sheeted.

- **Hero:** full `min-h-screen`, absolutely composed. A centered portrait anchors the bottom; two label cards float at the sides (desktop: ~38% from top, inset 80px); a word cloud orbits the portrait; a soft gradient fades the portrait base into the paper.
- **About:** two columns on desktop (Geist Mono copy column + portrait), stacked on mobile. The heading is one inline line ("hey, i'm Jason") with the name at 80/48px; body copy is uniform 17/15px mono with the location set inline. A résumé pill (Fog Paper at rest, Ultramarine wipe on hover) and three plain social icons close the column. The portrait sits on a soft drop shadow with its bottom edge fading into the paper.
- **Experience:** centered heading and intro, then a plain two-column list capped at `max-w-4xl`: period and company on the left, role, context, and bullets on the right. No cards or timeline rail; entries rise in on scroll.
- **Tools & Stack:** plain labeled rows on the paper (Tech Stacks, Languages, Databases, Tools, Design); items are separated by slashes with no chips or panel. Rows stagger in on scroll.
- **Projects:** centered heading and intro, then a 1- or 2-column card grid capped at `max-w-5xl`, with generous `my-16`/`my-20` vertical breathing room.
- **Beyond:** centered heading and a plain 3-column text grid capped at `max-w-5xl`; each column pairs a Lucide glyph and index with a short first-person facet. No cards.
- **Contact:** two columns on desktop: an intro with four direct-link rows (email, LinkedIn, GitHub, résumé) beside underline form fields on the paper. No form card. The form opens the visitor's email app with the subject and body prefilled; no backend.
- **Density:** spacious. Sections resolve to one idea each; whitespace is a material, not filler.
- **Breakpoint:** a single behavioral breakpoint at `md` (768px). Below it, multi-column layouts stack and the dock compacts to 42px buttons under 420px.

## Elevation & Depth

Depth is the system's core material, expressed as paired neumorphic shadows: a cool Shadow Tint below-right and a Paper White highlight above-left. Nothing is flat. Raised surfaces (cards, labels, nav shell) use outward shadows; recesses (active nav pills, social buttons, project preview wells) use inset shadows. Increased intensity maps to increased importance or interaction: a small shadow for chips, the standard pair for cards, the deep pair for the hero labels, and hover shadows that both grow and offset further.

### Shadow Vocabulary
- **Chip** (`5px 5px 10px rgba(163,177,198,0.6), -5px -5px 10px rgba(255,255,255,0.5)`): Tags and the smallest raised elements.
- **Standard** (`9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)`): Cards, the About panel, the unscrolled nav.
- **Hover** (`12px 12px 20px rgba(163,177,198,0.7), -12px -12px 20px rgba(255,255,255,0.6)`): Raised card/nav hover; deeper blur and stronger tint.
- **Deep** (`16px 16px 28px rgba(163,177,198,0.7), -16px -16px 28px rgba(255,255,255,0.6)`): The floating hero label cards only.
- **Recess** (`inset 6px 6px 10px rgba(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5)`): Social icon buttons, active nav pills, preview wells.
- **Recess Deep** (`inset 10px 10px 20px rgba(163,177,198,0.7), inset -10px -10px 20px rgba(255,255,255,0.6)`): The hero's inner glow disc and any large selected well.

### Named Rules
**The Paired Shadow Rule.** Never a single shadow. Every raised surface carries both the tint and the white, in mirror offsets. A surface with one shadow reads flat and breaks the material.

**The Lift/Recess Rule.** Interaction always changes depth, not color. Hover lifts (larger outward shadow, slight rise); press or selection recesses (inset shadow). Color changes are reserved for text state only.

## Shapes

Soft and rounded throughout; no sharp corners anywhere in the interface.

- **Pill (`9999px`):** Nav shell, nav items, social buttons, chips, and the About social row. The dominant interactive silhouette.
- **Panel (`32px`):** Project cards.
- **Label (`24–28px`):** Hero designer/developer cards (`24px` mobile, `28px` desktop).
- **Card (`24px`):** About text panel (`rounded-3xl`).
- **Well (`16px`):** Project preview image placeholder (`rounded-2xl`).
- **Hairline accent:** A short 2px Ultramarine/30% rule under each hero label heading acts as a tiny divider.
- **Borders:** Only on raised surfaces that overlay content (hero labels, unscrolled nav): a `white/50–60` hairline that catches the light edge. Cards that sit in normal flow get no border.

## Components

### Buttons
- **Shape:** Full pill (`9999px`).
- **Résumé (primary):** Fog Paper pill with Ultramarine 10px Geist Mono uppercase label and a download glyph at rest. On hover a solid Ultramarine fill wipes in from the left, the label and icon turn white, and the pill lifts 2px; it presses with a slight scale on active.
- **Primary (nav item):** Replaced by the clean magnification dock; see Navigation.
- **Hover / Focus:** Lift on hover, press on active, 300ms transition. Tap feedback on cards uses `translateY` and scale (1.03 up, 0.97 down).
- **Icon (social):** Plain 21px Ultramarine-free glyph in a 44px hit area, no circle or shadow. Color shifts from 60% ink to Ultramarine on hover with a 2px lift.

### Chips
- **Style:** Ultramarine-free at rest: Quiet Gray 10px uppercase bold on Fog Paper with a Chip shadow. No border.
- **State:** Hover deepens the shadow. They are labels, not filters; no selected state exists.

### Cards / Containers
- **Corner Style:** Panel `32px` for project cards; Label `24–28px` for hero labels; Card `24px` for the About panel.
- **Background:** Always Fog Paper; never a tint.
- **Shadow Strategy:** Standard at rest, Hover on hover with a `-translate-y-1` lift, `translate-y-0.5` on active press. Hero labels use Deep and scale gently on hover.
- **Border:** None in flow; `white/60` hairline only when a card floats over imagery.
- **Internal Padding:** `p-6 md:p-8` (24→32px).

### Navigation
- **Style:** A clean floating dock fixed 20px from the bottom, horizontally centered. A light neutral-gray pill (`bg-neutral-100/80`) holds 46px white circular buttons with a faint hairline ring and a soft drop shadow; no neumorphic inset or paired extruded shadows. The dock carries seven sections: Home, About, Experience, Stack, Projects, Beyond, Contact.
- **Motion:** macOS-style magnification. Pointer distance drives each button's size through a spring (46px → 66px, stiffness 220, damping 18), and the icon scales with it. On hover an Ultramarine fill wipes across the button from the left and the icon turns white. Disabled and reduced-motion states stay at base size.
- **Icons:** 19px Lucide line icons at a 1.7 stroke. Active item is Ultramarine; inactive icons are neutral gray. Disabled items are muted and non-interactive.
- **Tooltip:** A small white pill above the hovered button, set in 10px Geist Mono uppercase with wide tracking; disabled buttons append "Soon".
- **Typography:** Icon-only with `aria-label`; Geist Mono is used only in tooltips.
- **Mobile:** Buttons compact to 42px under 420px so all seven fit; touch does not trigger magnification or tooltips.

### Signature: Hero Label Cards
Two floating Fog Paper cards, "designer" and "developer", mirror-slide in from left and right. Each holds a 54px lowercase display word, a short 2px Ultramarine rule, and a 14px hairline description. They are the clearest expression of the whole system: heavy ink on a deep soft shadow, bordered by light.

## Do's and Don'ts

### Do:
- **Do** use Fog Paper `#EDF0F5` as the background of every raised surface; separate with shadow, not fill.
- **Do** pair the Shadow Tint with the Paper White highlight on every extruded or recessed element.
- **Do** keep Ultramarine `#0824A9` for type, glyphs, and state; keep fills neutral.
- **Do** change depth (lift outward, recess inward) to signal interaction, with 300ms transitions.
- **Do** let display type be heavy and tight, and body type hairline and soft; preserve the weight gap.
- **Do** prefer large radii: pills for controls, 32px panels for cards, 16px wells for embeds.

### Don't:
- **Don't** introduce neon accents, saturated gradients, or glassmorphism; confirmed anti-reference.
- **Don't** ship flat Material-style cards; if a surface has no paired shadow, it is not part of this system.
- **Don't** use a single-offset shadow or a hard gray border in place of depth.
- **Don't** fill a large area with Ultramarine; it stays an ink.
- **Don't** use Geist Mono for Projects prose; the About section is the intentional mono exception.
- **Don't** use sharp corners anywhere.
