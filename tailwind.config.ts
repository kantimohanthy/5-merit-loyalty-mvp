import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0a0f1e",
          900: "#0d1526",
          800: "#131c33",
          700: "#1b2743",
          600: "#253354",
          500: "#334469",
        },
        ink: "#0d1526",
        cream: "#f7f5f0",
        paper: "#fbfaf7",
        line: "#e6e2d8",
        positive: {
          50: "#eef7ee",
          100: "#d9ecda",
          400: "#4f9d5c",
          500: "#3d8148",
          600: "#2f6738",
        },
        amber: {
          50: "#fbf3e8",
          100: "#f4e2c3",
          400: "#d99a3f",
          500: "#c2822b",
          600: "#a56a1f",
        },
        xyz: {
          primary: "#0A3680",
          "primary-dark": "#062356",
          accent: "#1D6CB8",
          "accent-soft": "#E6F0FA",
          surface: "#F4F6F9",
          card: "#FFFFFF",
          border: "#DCE3ED",
          ink: "#0D192B",
          "ink-soft": "#41516C",
          "sidebar-bg": "#0F223D",
          "sidebar-ink": "#E7ECF5",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "Fraunces",
          "ui-serif",
          "Georgia",
          "serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(13, 21, 38, 0.04), 0 8px 24px -8px rgba(13, 21, 38, 0.10)",
        pop: "0 4px 12px rgba(13, 21, 38, 0.08), 0 16px 40px -12px rgba(13, 21, 38, 0.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
