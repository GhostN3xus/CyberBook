import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      colors: {
        brand: {
          DEFAULT: '#00f5a0',
          dark: '#0f1729',
          neon: '#00f5a0',
          muted: '#1f2937'
        }
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
