/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{html,ts,md,analog}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'serif': ['Fraunces', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        'display': ['Fraunces', 'Georgia', 'serif'],
        'mono': ['DM Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // editorial tokens, wired to CSS variables (see styles.css)
        'paper': 'rgb(var(--paper) / <alpha-value>)',
        'surface': 'rgb(var(--surface) / <alpha-value>)',
        'ink': 'rgb(var(--ink) / <alpha-value>)',
        'muted': 'rgb(var(--muted) / <alpha-value>)',
        'hairline': 'rgb(var(--hairline) / <alpha-value>)',
        'accent': {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          'soft': 'rgb(var(--accent-soft) / <alpha-value>)',
        },
      },
      maxWidth: {
        'prose': '46rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out both',
        'fade-in-up': 'fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-up': 'slideUp 0.5s ease-out both',
        'scale-in': 'scaleIn 0.3s ease-out both',
        'aurora': 'aurora 18s ease-in-out infinite',
        'aurora-slow': 'aurora 26s ease-in-out infinite',
        'float': 'float 8s ease-in-out infinite',
        'marquee': 'marquee 40s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(22px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.9' },
          '33%': { transform: 'translate(3%, -4%) scale(1.08)', opacity: '1' },
          '66%': { transform: 'translate(-3%, 3%) scale(0.96)', opacity: '0.85' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      typography: {},
    },
  },
  plugins: [],
};
