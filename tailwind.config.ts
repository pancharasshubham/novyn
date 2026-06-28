import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0b",
        surface: "#141417",
        edge: "#26262b",
        muted: "#8a8a93",
        accent: "#7c5cff",
      },
    },
  },
  plugins: [],
};

export default config;
