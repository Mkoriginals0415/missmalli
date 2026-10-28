import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          ivory: "var(--color-brand-ivory, #FBF8F2)",
          warmWhite: "var(--color-brand-ivory, #FBF8F2)",
          plum: "var(--color-brand-plum, #5B2A6E)",
          purple: "var(--color-brand-plum, #5B2A6E)",
          deepPlum: "var(--color-brand-deep-plum, #2A1235)",
          dark: "var(--color-brand-deep-plum, #2A1235)",
          lilac: "var(--color-brand-lilac, #C9B6E4)",
          lavender: "var(--color-brand-lilac, #C9B6E4)",
          blush: "var(--color-brand-blush, #E8B4C4)",
          gold: "var(--color-brand-gold, #B8923A)",
          ink: "#111111",
        },
      },
      fontFamily: {
        sans: ['"Poppins"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        'card': '22px',
        'pill': '30px',
      },
    },
  },
  plugins: [],
} satisfies Config;
