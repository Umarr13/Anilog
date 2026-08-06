---
name: Analogue Journal System
colors:
  surface: '#fdf8f7'
  surface-dim: '#ddd9d8'
  surface-bright: '#fdf8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f1'
  surface-container: '#f1edec'
  surface-container-high: '#ece7e6'
  surface-container-highest: '#e6e1e0'
  on-surface: '#1c1b1b'
  on-surface-variant: '#4c4540'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ee'
  outline: '#7e756f'
  outline-variant: '#cfc4bd'
  surface-tint: '#635d5a'
  primary: '#191613'
  on-primary: '#ffffff'
  primary-container: '#2e2a27'
  on-primary-container: '#97918d'
  inverse-primary: '#cdc5c0'
  secondary: '#4e635a'
  on-secondary: '#ffffff'
  secondary-container: '#cee5da'
  on-secondary-container: '#52675e'
  tertiary: '#290e0f'
  on-tertiary: '#ffffff'
  tertiary-container: '#422223'
  on-tertiary-container: '#b58787'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9e1dc'
  primary-fixed-dim: '#cdc5c0'
  on-primary-fixed: '#1e1b18'
  on-primary-fixed-variant: '#4b4642'
  secondary-fixed: '#d1e8dd'
  secondary-fixed-dim: '#b5ccc1'
  on-secondary-fixed: '#0b1f18'
  on-secondary-fixed-variant: '#374b43'
  tertiary-fixed: '#ffdad9'
  tertiary-fixed-dim: '#edbaba'
  on-tertiary-fixed: '#2f1314'
  on-tertiary-fixed-variant: '#613d3d'
  background: '#fdf8f7'
  on-background: '#1c1b1b'
  surface-variant: '#e6e1e0'
typography:
  display-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Bricolage Grotesque
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  body-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Bricolage Grotesque
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  margin-page: 32px
  gutter: 24px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

This design system is built on the philosophy of **"High-Fidelity Lo-Fi."** It transforms the digital interface into a tactile, analogue workspace that encourages intentionality and calm. The aesthetic is a hybrid of **Minimalism** and **Tactile Skeuomorphism**, focusing on the physical properties of paper, ink, and graphite rather than digital gradients or neon glows.

The target audience seeks a sanctuary from "hyper-digital" interfaces. The emotional response should be one of relief—the digital equivalent of opening a fresh, high-quality linen notebook. The design uses "hand-drawn" imperfections, subtle grain textures, and a layout that prioritizes focus over noise. It is quiet, sophisticated, and deeply human.

## Colors

The palette is rooted in the "Analogue Journal" aesthetic, moving away from pure whites and harsh blacks.

- **The Canvas:** The base background is a warm, creamy paper (`#fcf9f0`). Depth is created not through shadows, but through tonal shifts to `#f5f2e8` (mid-tone paper) and `#efece0` (recycled cardstock).
- **The Ink:** All text and structural elements use Charcoal Ink (`#2e2a27`), which provides a softer, more organic contrast than pure black.
- **The Highlighters:** Soft Sage and Dusty Rose act as functional accents. They should be used with low opacity (30-50%) to mimic the effect of a marker bleeding into paper, primarily for highlights, chips, and active states.

## Typography

This system uses **Bricolage Grotesque** for its idiosyncratic, hand-hewn personality. It balances geometric structure with "quirks" that feel human.

- **Hierarchy:** Use heavy weights (700-800) for headlines to create an editorial feel. Body text should maintain generous line heights (1.5x+) to ensure a breezy, readable flow that mimics a well-spaced journal entry.
- **The Technical Note:** **JetBrains Mono** is introduced for labels, metadata, and captions. This "monospaced" addition provides a subtle nod to typewritten notes or architect's notations, contrasting against the fluid nature of the main typeface.
- **Styling:** Avoid all-caps for headlines; keep them in sentence case to maintain a conversational, quiet tone.

## Layout & Spacing

The layout is a **Fixed Grid** inspired by the margins of a notebook. 

- **The Margin:** A consistent 32px safe-area acts as the "gutter" of the book. Content should never crowd the edges.
- **Vertical Rhythm:** A strict 8px baseline grid ensures that text feels "seated" on the page, similar to lined paper.
- **The Rule:** In desktop views, the content container is centered and constrained to 720px, mimicking the width of a standard journal. On mobile, the margins may shrink to 20px, but vertical "breathing room" (stacking) should remain high.

## Elevation & Depth

In this system, elevation is **additive** rather than **spatial**. 

- **Tonal Stacking:** Instead of using shadows to lift elements, use surface color shifts. A card "floats" by being `#efece0` on a `#fcf9f0` background.
- **Textures:** Apply a global noise/grain filter (low opacity, ~3%) over the entire UI to simulate paper fiber. 
- **The "Rule" Line:** Use subtle, 1px horizontal lines (`#2e2a27` at 10% opacity) to separate sections, mimicking the ruled lines of a notebook.
- **In-Set Effects:** For input fields or "pressed" states, use a very soft inner shadow (blur 4px, color `#2e2a27` at 5% opacity) to suggest the paper is slightly indented by a pen.

## Shapes

The shape language is "Soft" but structured.

- **Base Radius:** Use a `0.25rem` radius for most components. This mimics the slightly rounded corners of a cut sheet of paper.
- **The "Organic" Border:** For primary cards or focal points, implement a SVG mask or a border-image that has a slight "wobble" (0.5px deviation) to simulate a hand-drawn line.
- **Large Elements:** Use `0.75rem` for large containers to keep the interface feeling friendly and approachable.

## Components

- **Buttons:** Primary buttons should be "Ink Fill" (`#2e2a27`) with paper-colored text. Secondary buttons use a 1.5px charcoal border with the "hand-drawn" wobble. No heavy shadows—only a slight vertical offset (2px) when hovered.
- **Chips / Tags:** These should look like highlighter marks. Use a solid block of `highlighter_sage` or `highlighter_rose` at 20% opacity with the text on top.
- **Input Fields:** Styled as a single horizontal underline rather than a box, mimicking writing on a line. The cursor should be a slightly thicker charcoal block.
- **Checkboxes:** When checked, they should show a "hand-drawn" X or a thick graphite-style checkmark that slightly exceeds the box's boundaries.
- **Cards:** Cards are defined by their background color (`surface_layered`) and a subtle grain texture. Avoid borders on cards unless they overlap identical colors.
- **Dividers:** Use a "Wavy" line or a simple dashed line to denote section breaks, reinforcing the sketchbook aesthetic.