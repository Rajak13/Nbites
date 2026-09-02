import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        editorial: ['var(--font-clubstone)', 'Georgia', 'serif'],
        body: ['var(--font-nokie)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#F97316',
          amber: '#F59E0B',
          dark: '#0B0B0B',
          surface: '#141414',
          card: '#18181B',
          border: '#27272A',
          text: '#F5F5F0',
          muted: '#A1A1AA',
        },
      },
      borderRadius: {
        none: '0px',
        pill: '100px',
      },
      boxShadow: {
        brutalist: '4px 4px 0px 0px rgba(0, 0, 0, 0.8)',
        'brutalist-orange': '4px 4px 0px 0px rgba(249, 115, 22, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
