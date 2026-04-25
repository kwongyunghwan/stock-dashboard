import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./shared/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#0b0e14",
        panel: "#141821",
        panel2: "#1b202b",
        border: "#252b39",
        muted: "#8a93a6",
        up: "#22c55e",
        down: "#ef4444",
      },
    },
  },
  plugins: [],
};
export default config;
