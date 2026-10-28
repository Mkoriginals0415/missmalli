import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          ivory: "#FBF8F2",     // Soft cream canvas
          plum: "#5B2A6E",      // Royal plum primary
          deepPlum: "#2A1235",  // Deep plum footer & dark text
          lilac: "#C9B6E4",     // Lilac accent
          blush: "#E8B4C4",     // Blush pink accent
          gold: "#B8923A",      // Zari gold accent
          ink: "#111111",       // Ink dark typography
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
