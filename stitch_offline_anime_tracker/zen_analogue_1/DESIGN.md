---
name: Zen Analogue
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e3e2e2'
  on-secondary-container: '#646464'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1c'
  on-tertiary-container: '#838484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e3e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  brand-logo:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.2em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '300'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0px
  body-sm:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0px
  label-caps:
    fontFamily: Geist
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.15em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 26px
    fontWeight: '300'
    lineHeight: 34px
    letterSpacing: -0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  stack-xs: 8px
  stack-md: 24px
  stack-xl: 64px
---

## Brand & Style

The design system is centered on high-fidelity minimalism, designed for users seeking digital stillness and intentionality. It evokes an emotional response of calm, precision, and luxury through "Zen Analogue" aesthetics—marrying the tactile nature of high-end physical products with a clean digital interface.

The visual style is a blend of **Minimalism** and **Tactile Line Art**. It prioritizes massive amounts of negative space (premium whitespace) to allow content to breathe. UI elements are treated with a quiet authority; nothing competes for attention. The brand is sophisticated, intellectual, and rhythmic, favoring architectural clarity over decorative clutter.

## Colors

The palette is strictly monochromatic with a focus on tonal nuances.
- **Primary:** Deep charcoal for high-contrast text and essential structural lines.
- **Secondary:** A muted mid-grey for secondary information and iconography.
- **Tertiary:** A soft off-white used for container backgrounds to provide a subtle lift from the base.
- **Neutral:** A warm, near-white base for the global background to prevent eye strain and maintain the "Zen" atmosphere.

Surface colors should be layered with very low contrast to maintain a "paper-like" feel, using shadows rather than color fills to indicate depth.

## Typography

Typography is used as a structural element. The **brand logo** (Anilog) is exclusively set in small, uppercase Geist with generous letter spacing to evoke a premium, architectural feel. 

Headlines use Manrope with a light weight and tight tracking to maintain a modern, refined look. Body copy utilizes Work Sans for its grounded and reliable legibility. The technical "Geist" font is reserved for labels and navigational elements to lean into the "Analogue" precision. Use `label-caps` for all metadata and interactive hints.

## Layout & Spacing

This design system uses a **Fixed Grid** model for desktop and a fluid, margin-heavy model for mobile.
- **Desktop:** 12-column grid with a maximum content width of 1140px. 
- **Mobile:** Single column with 20px safe margins.

Spacing is aggressive in its emptiness. "Premium whitespace" means using `stack-xl` (64px) between major sections to ensure no two content blocks feel crowded. Alignment should be strictly left-aligned for headings and branding, while navigation elements are anchored to the bottom.

## Elevation & Depth

Hierarchy is achieved through **Ambient Shadows** and **Tonal Layers**. 
- Shadows are extremely diffused (e.g., `blur: 40px`, `opacity: 0.04`) and use the primary charcoal color as the tint.
- Surfaces do not "pop"; they gently float. 
- The background is the lowest tier, with "Islands" (like the bottom nav) sitting on the highest tier with a subtle shadow to indicate interactability. 
- Line art icons and borders should use 1px or 0.5px widths to maintain the high-fidelity, technical feel.

## Shapes

The shape language is **Soft (1)**. Elements like input fields and containers have a 0.25rem corner radius. This slight rounding takes the "edge" off the minimalism, making it feel approachable rather than clinical. The "Island" navigation bar is an exception, utilizing `rounded-xl` (0.75rem) to signify its role as a floating, tactile object.

## Components

### Header
Extremely minimalist. The brand name "ANILOG" sits in the top-left using the `brand-logo` typography token. No background fill, no borders. It should appear to float on the page background.

### Bottom Island Navigation
A floating bar centered at the bottom of the viewport. It features a semi-transparent white background (Tertiary with 80% opacity) and a subtle ambient shadow. Icons are custom, ultra-thin (1px stroke) line art. Active states are indicated by a simple 4px dot below the icon, rather than a color change or background fill.

### Buttons
- **Primary:** Text-only or thin-outlined. No heavy fills. Use `label-caps` typography.
- **Ghost:** Used for secondary actions, purely text-based with an underline on hover.

### Cards
Cards are defined by a 1px border in a very light grey (#E6E6E6) or a soft ambient shadow. No heavy padding—content inside cards should maintain the same spacing rhythm as the rest of the page.

### Input Fields
Underline style only. A single 1px line at the bottom of the field that darkens when focused. Labels should be small caps (`label-caps`) floating above the line.