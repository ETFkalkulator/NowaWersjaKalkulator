/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./pages/**/*.html",
    "./blog/**/*.html",
    "./js/**/*.js",
    "./js/*.js"
  ],
  darkMode: 'class',
  theme: {
      extend: {
          colors: {
              "primary": "#0d7ff2", // Universal brand 
              
              // Semantic Stitch Tokens - Globally responsive to Light/Dark mode via CSS variables
              "stitch-bg": "var(--stitch-bg)",               // App Background
              "stitch-surface": "var(--stitch-surface)",     // Cards / Modals
              "stitch-border": "var(--stitch-border)",       // Dividers
              "stitch-text": "var(--stitch-text)",           // Primary text
              "stitch-muted": "var(--stitch-muted)",         // Subtitles / Secondary
              "stitch-accent": "var(--stitch-accent)",       // Primary color accents
              "stitch-input": "var(--stitch-input)",         // Input background
              
              // Legacy overrides (to ensure backwards compatibility without breaking everything)
              "background-light": "#f8fafc",
              "background-dark": "#0f172a",
          },
          fontFamily: {
              "display": ["Inter", "sans-serif"],
              "sans": ["Inter", "sans-serif"]
          },
          borderRadius: { 
              "DEFAULT": "0.25rem", 
              "lg": "0.5rem", 
              "xl": "1rem", 
              "2xl": "1.5rem", 
              "full": "9999px",
              "stitch": "0.5rem" // ROUND_EIGHT from Nowoczesna (Structural root)
          },
          boxShadow: {
              // Newsletter Restoration derived deep shadows
              "stitch-soft": "var(--stitch-shadow-soft)",
              "stitch-glow": "var(--stitch-shadow-glow)"
          }
      },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ]
}
