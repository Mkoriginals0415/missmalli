import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "rgb(var(--color-brand-primary-rgb, 181 154 217) / <alpha-value>)",
          secondary: "rgb(var(--color-brand-secondary-rgb, 113 61 140) / <alpha-value>)",
          ivory: "rgb(var(--color-brand-ivory-rgb, 251 248 242) / <alpha-value>)",
          warmWhite: "rgb(var(--color-brand-ivory-rgb, 251 248 242) / <alpha-value>)",
          plum: "rgb(var(--color-brand-secondary-rgb, 113 61 140) / <alpha-value>)",
          purple: "rgb(var(--color-brand-secondary-rgb, 113 61 140) / <alpha-value>)",
          deepPlum: "rgb(var(--color-brand-deep-plum-rgb, 42 18 53) / <alpha-value>)",
          dark: "rgb(var(--color-brand-deep-plum-rgb, 42 18 53) / <alpha-value>)",
          lilac: "rgb(var(--color-brand-primary-rgb, 181 154 217) / <alpha-value>)",
          lavender: "rgb(var(--color-brand-primary-rgb, 181 154 217) / <alpha-value>)",
          blush: "rgb(var(--color-brand-blush-rgb, 232 180 196) / <alpha-value>)",
          gold: "rgb(var(--color-brand-gold-rgb, 184 146 58) / <alpha-value>)",
          ink: "#111111",
        },
      },
      fontFamily: {
        sans: ['"Lato"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
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
