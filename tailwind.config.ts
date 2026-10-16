import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#ba252f', // Ainak Primary Crimson Red
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        gold: {
          500: '#d39d4e',
          600: '#b88235',
        },
        luxury: {
          dark: '#111827',
          charcoal: '#1f2937',
          muted: '#6b7280',
          light: '#f9fafb',
          surface: '#f3f4f6',
        }
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
