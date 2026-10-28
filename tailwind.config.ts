import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#713D8C",
          plum: "#51265F",
          lavender: "#B59AD9",
          blush: "#E8A0C2",
          rose: "#D879A8",
          gold: "#C99A48",
          warmWhite: "#FFFEFC",
          ivory: "#FAF5F0",
          dark: "#302735",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Lato"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      aspectRatio: {
        '9/16': '9 / 16',
      },
    },
  },
  plugins: [],
} satisfies Config;
