---
name: Zen Analogue
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#b7131a'
  on-secondary: '#ffffff'
  secondary-container: '#db322f'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c1b1a'
  on-tertiary-container: '#868381'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb4ac'
  on-secondary-fixed: '#410002'
  on-secondary-fixed-variant: '#93000d'
  tertiary-fixed: '#e6e1df'
  tertiary-fixed-dim: '#cac6c3'
  on-tertiary-fixed: '#1c1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
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
    lineHeight: 34px
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
  label-md:
    fontFamily: Bricolage Grotesque
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Bricolage Grotesque
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  gutter: 16px
  island-gap: 32px
  desktop-max-width: 1200px
---

## Brand & Style

The design system is rooted in the philosophy of "Premium Minimalism"—a synthesis of digital precision and analogue warmth. It targets a sophisticated audience that values clarity over noise, prioritizing focus and intentionality. 

The aesthetic is characterized by:
- **Ultra-Minimalism:** Extreme restraint in the use of color and decorative elements.
- **Island UI:** Components exist as distinct, floating objects, separated from the background to create a sense of physical presence.
- **Analogue Tactility:** High-contrast lines and bold typography evoke the feeling of high-end print media or bespoke stationary.
- **Emotional Response:** The UI should feel calm, decisive, and luxurious through the use of generous whitespace and a singular, punchy accent.

## Colors

The palette is strictly monochromatic with a singular high-energy disruption. 

- **Primary & Text:** A deep, ink-like charcoal (#121212) is used for all functional text, primary icons, and structural borders.
- **Accent:** A punchy "Ribbon Red" (#E53935) is reserved for critical actions, notifications, or brand-specific moments. It must be used sparingly to maintain its impact.
- **Surfaces:** Pure white (#FFFFFF) for floating cards and "islands."
- **Backgrounds:** A very soft off-white (#F9F9F9) is used for the canvas to allow the white "islands" to stand out through subtle contrast and soft shadows.

## Typography

The typography utilizes **Bricolage Grotesque** across all levels to maintain a cohesive, idiosyncratic character that feels both modern and historically rooted.

- **Hierarchy:** Use extreme scale differences to guide the eye. Headlines should be bold and tight, while body text remains legible with comfortable line heights.
- **Styling:** Labels should often use uppercase with slight tracking to provide a structural, "tabbed" feel in the UI.
- **Alignment:** Consistent left-alignment is preferred to reinforce the "analogue page" aesthetic.

## Layout & Spacing

The layout philosophy follows a **"Safe Area Island"** model. Content is grouped into floating modules rather than edge-to-edge containers.

- **Grid:** A 12-column fluid grid is used for desktop, but elements are encouraged to "float" with wide margins. 
- **Rhythm:** An 8px base unit (8, 16, 24, 32, 48, 64) governs all spacing.
- **Whitespace:** Emphasize whitespace around "islands" to denote importance. Margin between separate floating components should be at least 32px to maintain the "floating" illusion.
- **Breakpoints:**
  - **Mobile (<768px):** 4 columns, 16px side margins. Islands typically span full width minus margins.
  - **Tablet (768px - 1024px):** 8 columns, 24px margins.
  - **Desktop (>1024px):** 12 columns, max-width 1200px, centered.

## Elevation & Depth

Visual hierarchy is achieved through a combination of **Ambient Shadows** and **High-Contrast Layering**.

- **Shadows:** Use extremely soft, large-radius shadows (e.g., `box-shadow: 0 10px 40px rgba(0,0,0,0.04)`). The goal is to make elements appear as though they are hovering just millimeters above the background surface.
- **Contrast:** Depth is also communicated by the stark transition from the off-white background to the pure white surface of the "island" containers.
- **Z-Index:**
  - **Level 0 (Base):** Off-white canvas.
  - **Level 1 (Islands):** White cards with soft shadows.
  - **Level 2 (Overlays/Modals):** Pure white with a slightly darker shadow and a 20% black backdrop blur.

## Shapes

The design system uses a consistent "Rounded" language (8px base) to soften the high-contrast aesthetic and make the "islands" feel approachable.

- **Standard Containers:** Use `rounded-md` (0.5rem / 8px).
- **Larger Modules:** Use `rounded-lg` (1rem / 16px) for major floating sections or dashboard cards.
- **Buttons & Inputs:** Follow the 8px standard strictly to maintain a "blocky yet refined" look. 
- **Exceptions:** Floating Action Buttons (FABs) or specific navigation elements may use `rounded-full` (pill-shape) to distinguish them as high-priority interactive triggers.

## Components

### Buttons
- **Primary:** Solid #121212 background with white text. No border. 8px corner radius.
- **Secondary:** White background with a 1px #121212 border. 
- **Accent:** Solid #E53935 background. Used only for "Buy," "Confirm," or "Critical" actions.

### Cards (Islands)
- Pure white background, 16px corner radius, soft ambient shadow. 
- Internal padding should be generous (typically 24px or 32px).

### Input Fields
- Underline style or very subtle 1px light grey border (#E0E0E0). 
- When focused, the border or underline becomes 2px #121212.

### Chips & Tags
- Light grey (#F0F0F0) background with #121212 text.
- 4px corner radius (slightly sharper than buttons).

### Navigation (The Dock)
- A floating "island" at the bottom of the screen. 
- Icons are 24px, solid #121212. Active state indicated by a small red dot below the icon or the icon itself changing to red.

### Selection Controls
- **Checkboxes:** Square with 4px radius. Solid black fill with white checkmark when selected.
- **Radio Buttons:** Classic circle. Solid black center dot when selected.