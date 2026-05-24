import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        bg: '#0b0f1a',
        card: '#131a2a',
        cardHover: '#1a2238',
        line: '#1f2a44',
        ink: '#e6edf7',
        muted: '#8a98b8',
        up: '#22c55e',
        down: '#ef4444',
        brand: '#60a5fa',
      },
    },
  },
  plugins: [],
};

export default config;
