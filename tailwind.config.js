/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './pages/**/*.html',
    './blog/**/*.html',
    './js/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "primary": "#0d7ff2",
        "stitch-bg": "var(--stitch-bg)",
        "stitch-surface": "var(--stitch-surface)",
        "stitch-border": "var(--stitch-border)",
        "stitch-text": "var(--stitch-text)",
        "stitch-muted": "var(--stitch-muted)",
        "stitch-accent": "var(--stitch-accent)",
        "stitch-input": "var(--stitch-input)",
        "background-light": "#f8fafc",
        "background-dark": "#0f172a",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "sans": ["Inter", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "1rem",
        "2xl": "1.5rem",
        "full": "9999px",
        "stitch": "0.5rem",
      },
      boxShadow: {
        "stitch-soft": "var(--stitch-shadow-soft)",
        "stitch-glow": "var(--stitch-shadow-glow)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
  corePlugins: {
    preflight: false,
  },
};
