# CLAUDE.md — mobile

Guidance for the React Native / Expo app at `mobile/`. It is a port of the web game in `next-app/`, run on the owner's own devices through **Expo Go** (no App Store, no Apple Developer account, no Xcode). `PLAN.md` has the reasoning behind the architecture; `TODO.md` is the phased checklist.

## Commands

```bash
yarn install        # this package has its own yarn.lock; do not add yarn workspaces
yarn start          # expo start — scan the QR code with Expo Go
yarn ios            # simulator (needs Xcode installed, never opened)
yarn typecheck      # tsc --noEmit
```

There are no AWS credentials on the device. Fighters come from the web app's public API over HTTPS (`src/config.ts`: `apiBaseUrl`, `queueSize`).

## Stack

- **Expo SDK 58**, **React Native 0.88**, **React 19.3**, **TypeScript 6** — everything must work inside Expo Go (no custom native modules)
- **NativeWind 4** on **Tailwind 3.4** (`className` everywhere; theme colors `navy`, fonts `bangers` / `noto`)
- **react-native-reanimated 4** + **react-native-worklets** — animations and the pull-to-refresh hint
- **react-native-svg** (+ transformer): icons are imported as components, plus the BATTLE shield and the contender glow
- **expo-image** (animated GIFs, `memory-disk` cache), **expo-font**, **expo-haptics**
- **react-native-safe-area-context**

## Directory structure

```
App.tsx               fonts + SafeAreaProvider, renders <Game />
src/
  config.ts           API base URL, queue size
  lib/
    api.ts            fetch wrappers over the public API (throw on non-2xx)
    types.ts          Fighter, Contender (copy of the web's)
  game/
    Game.tsx          composes everything; overlays, pull-to-refresh, haptics
    useGame.ts        game state and battle logic (copy of the web's, unchanged)
    useFighters.ts    fetches both lists on mount (no server seed on mobile)
  components/         one per web component, plus Entrance and GreenButton
assets/               stage image, SVG icons
tailwind.config.js  global.css  babel.config.js  metro.config.js
```

`useGame.ts` and `types.ts` are verbatim copies of the web files, deliberately not shared code (see `PLAN.md`). Keep them in sync by hand if the web logic changes.

## Conventions

- **No `vw` / `vh`.** Use fixed point sizes plus `useWindowDimensions()`; `landscape = width > height`. Both orientations are supported.
- **No `hover:` variants**; use `active:` and `group-active:` on `Pressable`.
- **No navigation library.** One screen. The menu and the all-fighters grid are in-tree absolute overlays so the header toggle stays tappable. The win/draw result is a `Modal`.
- **Animations go through `src/components/Entrance.tsx`**: a one-shot mount animation with presets ported from the web's keyframes (`flyUp`, `flyRight`, `flyDown`, `growIn`, `fadeIn`, `fadeInDelay`). They animate `transform`/`opacity`, not margins.
- SVGs must use direct `fill` attributes. `react-native-svg` ignores CSS `<style>` classes.

## Gotchas (each of these bit during the port)

- **Absolute offsets ignore the parent's padding.** `SafeAreaView` insets are padding, so an absolutely positioned element must add `useSafeAreaInsets()` by hand (menu/grid `top: insets.top + 60`, the result overlay's X).
- **`Modal` is portrait-only on iOS** unless you pass `supportedOrientations={['portrait', 'landscape']}`.
- **Don't wrap `Contenders` in an extra shrink-to-fit view.** Its `flex-1` details collapse to zero width and the text vanishes. `Entrance` doubles as the landscape slot for this reason.
- **Rotation must not remount.** `Battlefield` renders one tree for both orientations; separate landscape/portrait trees remount the BATTLE button and replay its fade.
- **Six `w-1/6` items round to over 100% and wrap.** Use `flex-1` in a non-wrapping row.
- **`FlatList` needs a new `key` when `numColumns` changes** (the all-fighters grid keys on it).
- **`transformOrigin` works** in RN 0.88; use it instead of compensating translates (`growIn` uses `'top right'`).
- **Import font weights from subpaths** (`@expo-google-fonts/noto-sans-kr/400Regular`). The package root bundles all weights (~56 MB).
- **Expo Go's floating gear button** covers the top-right (portrait) and bottom-left (landscape) corners during development. It isn't part of the app.
- **`*.d.ts` is git-ignored at the repo root**, so `mobile/.gitignore` re-includes `nativewind-env.d.ts` and `svg.d.ts`. Don't delete those rules.
- **Root `tsconfig.json` excludes `mobile/`.** Without it, root `yarn typecheck` tries to compile the app without JSX settings.
