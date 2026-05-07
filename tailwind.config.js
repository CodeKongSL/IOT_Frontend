/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', '"Cabinet Grotesk"', '"Segoe UI Variable"', '"Segoe UI"', 'sans-serif'],
        body: ['"Manrope"', '"Space Grotesk"', '"Segoe UI Variable"', '"Segoe UI"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f5f6f9',
          100: '#e7e9f0',
          200: '#cfd5e3',
          300: '#a8b2cc',
          400: '#7c89ad',
          500: '#5d6a8e',
          600: '#47516f',
          700: '#343c54',
          800: '#222838',
          900: '#131722',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.65)',
          dark: 'rgba(14, 18, 30, 0.65)',
        },
        accent: {
          300: '#8be0ff',
          400: '#4ec0ff',
          500: '#2a94ff',
          600: '#1d6dff',
        },
        signal: {
          warm: '#ffb347',
          cool: '#6fe3ff',
          mint: '#72f1b8',
          rose: '#ff7aa2',
        },
      },
      boxShadow: {
        glow: '0 20px 50px -30px rgba(42, 148, 255, 0.55)',
        soft: '0 20px 40px -30px rgba(10, 14, 25, 0.5)',
        glass: '0 10px 30px -12px rgba(17, 24, 39, 0.45)',
      },
      backdropBlur: {
        glass: '14px',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}

