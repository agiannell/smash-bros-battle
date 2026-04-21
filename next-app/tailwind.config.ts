import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        bangers: ['var(--font-bangers)', 'cursive'],
        noto: ['var(--font-noto)', 'sans-serif'],
      },
      colors: {
        navy: 'rgb(37, 55, 83)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInDelay: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        flyUp: {
          '0%': { marginTop: '500px', opacity: '0' },
          '100%': { marginTop: '0', opacity: '1' },
        },
        flyRight: {
          '0%': { marginRight: '500px', opacity: '0' },
          '100%': { marginRight: '0', opacity: '1' },
        },
        flyDown: {
          '0%': { marginBottom: '2000px', opacity: '0' },
          '100%': { marginBottom: '0', opacity: '1' },
        },
        growIn: {
          '0%': { opacity: '0', transform: 'scale(0)', transformOrigin: 'top right' },
          '100%': { opacity: '1', transform: 'scale(1)', transformOrigin: 'top right' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-in-out',
        fadeInDelay: 'fadeInDelay 0.7s ease-in-out',
        flyUp: 'flyUp 1.5s cubic-bezier(.9, .12, .7, 1.3) 1s both',
        flyRight: 'flyRight 0.7s cubic-bezier(.7, .12, .6, 1.7)',
        flyDown: 'flyDown 1.5s cubic-bezier(.9, .12, .7, 1)',
        growIn: 'growIn 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
}

export default config
