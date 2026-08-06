/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
      extend: {
          "colors": {
              "primary-fixed-dim": "#c8c6c5",
              "surface-variant": "#e2e2e2",
              "on-tertiary": "#ffffff",
              "on-primary-fixed": "#1c1b1b",
              "surface-container-high": "#e8e8e8",
              "inverse-primary": "#c8c6c5",
              "background": "#f9f9f9",
              "on-surface": "#1a1c1c",
              "surface-bright": "#f9f9f9",
              "surface-container-lowest": "#ffffff",
              "surface-container-low": "#f3f3f4",
              "on-secondary-fixed-variant": "#93000d",
              "outline": "#747878",
              "secondary-fixed-dim": "#ffb4ac",
              "error-container": "#ffdad6",
              "secondary-fixed": "#ffdad6",
              "on-tertiary-container": "#868381",
              "on-background": "#1a1c1c",
              "tertiary-fixed-dim": "#cac6c3",
              "surface-container": "#eeeeee",
              "on-primary-fixed-variant": "#474646",
              "inverse-surface": "#2f3131",
              "surface-dim": "#dadada",
              "on-error-container": "#93000a",
              "on-tertiary-fixed-variant": "#484645",
              "on-secondary-fixed": "#410002",
              "secondary": "#b7131a",
              "primary-container": "#1c1b1b",
              "on-primary-container": "#858383",
              "surface-tint": "#5f5e5e",
              "primary-fixed": "#e5e2e1",
              "tertiary": "#000000",
              "on-primary": "#ffffff",
              "error": "#ba1a1a",
              "primary": "#000000",
              "inverse-on-surface": "#f0f1f1",
              "on-secondary": "#ffffff",
              "tertiary-fixed": "#e6e1df",
              "outline-variant": "#c4c7c7",
              "on-error": "#ffffff",
              "surface": "#f9f9f9",
              "surface-container-highest": "#e2e2e2",
              "on-surface-variant": "#444748",
              "secondary-container": "#db322f",
              "on-tertiary-fixed": "#1c1b1a",
              "tertiary-container": "#1c1b1a",
              "on-secondary-container": "#fffbff"
          },
          "borderRadius": {
              "DEFAULT": "0.25rem",
              "lg": "0.5rem",
              "xl": "0.75rem",
              "full": "9999px"
          },
          "spacing": {
              "unit": "8px",
              "container-padding": "24px",
              "desktop-max-width": "1200px",
              "gutter": "16px",
              "island-gap": "32px"
          },
          "fontFamily": {
              "label-sm": ["Bricolage Grotesque"],
              "headline-xl": ["Bricolage Grotesque"],
              "body-lg": ["Bricolage Grotesque"],
              "headline-lg": ["Bricolage Grotesque"],
              "label-md": ["Bricolage Grotesque"],
              "headline-lg-mobile": ["Bricolage Grotesque"],
              "body-md": ["Bricolage Grotesque"],
              
              "body-sm": ["Work Sans"],
              "headline-md": ["Manrope"],
              "label-caps": ["Geist"],
              "brand-logo": ["Geist"],
          },
          "fontSize": {
              "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "500" }],
              "headline-xl": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "800" }],
              "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
              "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "700" }],
              "label-md": ["14px", { "lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "600" }],
              "headline-lg-mobile": ["28px", { "lineHeight": "34px", "fontWeight": "700" }],
              "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
              
              "body-sm": ["14px", { "lineHeight": "22px", "letterSpacing": "0px", "fontWeight": "400" }],
              "headline-md": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "400" }],
              "label-caps": ["10px", { "lineHeight": "12px", "letterSpacing": "0.15em", "fontWeight": "600" }],
              "brand-logo": ["11px", { "lineHeight": "14px", "letterSpacing": "0.2em", "fontWeight": "600" }],
          },
          "keyframes": {
              "splash-enter": {
                  "0%": { opacity: "0", transform: "scale(0.95)" },
                  "100%": { opacity: "1", transform: "scale(1)" }
              },
              "text-fade": {
                  "0%": { opacity: "0", transform: "translateY(10px)" },
                  "100%": { opacity: "1", transform: "translateY(0)" }
              },
              "loading-line": {
                  "0%": { width: "0%", left: "50%", transform: "translateX(-50%)" },
                  "50%": { width: "100%", left: "50%", transform: "translateX(-50%)" },
                  "100%": { width: "0%", left: "50%", transform: "translateX(-50%)" }
              },
              "slideInUp": {
                  from: { opacity: "0", transform: "translateY(20px)" },
                  to: { opacity: "1", transform: "translateY(0)" }
              }
          },
          "animation": {
              "splash-enter": "splash-enter 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
              "text-fade": "text-fade 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s forwards",
              "loading-line": "loading-line 2s ease-in-out infinite",
              "slide-in": "slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards"
          }
      }
  },
  plugins: [],
}
