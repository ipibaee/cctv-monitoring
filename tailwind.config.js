/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          dark: 'rgba(15, 23, 42, 0.65)',
          light: 'rgba(255, 255, 255, 0.75)',
          border: 'rgba(255, 255, 255, 0.12)',
          borderLight: 'rgba(0, 0, 0, 0.08)',
          glow: 'rgba(56, 189, 248, 0.15)',
        },
        obsidian: {
          950: '#070A11',
          900: '#0B0F19',
          800: '#131927',
          700: '#1C2538',
        },
        cyanGlow: '#06b6d4',
        violetGlow: '#8b5cf6',
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
        ultra: '24px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(139, 92, 246, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}
