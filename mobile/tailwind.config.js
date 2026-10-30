/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Names must match the families registered via useFonts in App.tsx.
      fontFamily: {
        bangers: ['Bangers_400Regular'],
        noto: ['NotoSansKR_400Regular'],
      },
      colors: {
        navy: 'rgb(37, 55, 83)',
      },
      // The web keyframes (flyUp, flyRight, ...) are intentionally not ported:
      // NativeWind doesn't implement them. They become Reanimated in Phase 4.
    },
  },
  plugins: [],
}
