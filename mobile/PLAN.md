# iOS port of Smash Bros Battle (React Native / Expo)

> Reference document: the **why** behind the mobile app's architecture.
> For the ordered, tickable list of work, see [`TODO.md`](./TODO.md).

## Context

`smashbros.anthonygnl.com` is a working Next.js 15 game: pick 2 of 5 random fighters, each gets a random HP (51–99), higher HP wins. Fighter data lives in a DynamoDB table (`smash-bros-fighters`) populated weekly from the Amiibo API, and is read server-side by the Next.js Lambda using its own IAM role.

The goal is the same game as an iOS app, built in React Native, running on personal devices. This is a first mobile project, so the plan optimizes for *short feedback loops and no Xcode* over architectural purity.

Decisions made up front:

- **Distribution:** personal devices only — no App Store, no Apple Developer account.
- **Repo:** same repo, monorepo-style.
- **Data:** public HTTP API over HTTPS; no AWS credentials on the device.
- **Styling:** NativeWind (Tailwind for RN).
- **Orientation:** support both portrait and landscape.

Intended outcome: `npx expo start` in `mobile/`, scan a QR code with Expo Go on an iPhone, and play the game.

---

## Key architectural calls (and why)

### 1. Three sibling packages — do NOT introduce yarn workspaces

The repo looks like a monorepo but isn't one. There's no `workspaces` field, no `packageManager` field, no `.yarnrc.yml`, and `next-app/` has **its own independent `yarn.lock`**. The CDK deploy depends on that: `build:next` runs `cd next-app && yarn install --frozen-lockfile && yarn build`, and `cdk-nextjs-standalone` (OpenNext) traces `next-app/node_modules` to bundle the server Lambda.

Converting to yarn workspaces would hoist dependencies out of `next-app/node_modules` and is a realistic way to break a working production deploy — for zero benefit here.

**So:** `mobile/` is a third independent package with its own `package.json` and `yarn.lock`, exactly like `next-app/` is today. "Monorepo" here means one git repo and one place to reason about the data model, not one dependency graph.

### 2. Essentially no shared code — and that's the right answer

The genuinely platform-neutral surface is two files:

- `next-app/app/lib/types.ts` — **13 lines** (`Fighter`, `Contender`)
- `next-app/app/game/hooks/useGame.ts` — **47 lines**, pure `useState`, zero platform imports

That's ~60 lines. Every realistic sharing mechanism (a `file:` dependency, Metro `watchFolders` + tsconfig paths, a published package) costs more config, more breakage surface, and more risk to the OpenNext bundle than those 60 lines are worth — especially for a one-person project.

**So:** copy `types.ts` and `useGame.ts` into `mobile/src/`. They will also legitimately diverge: the mobile `useFighters` needs an absolute base URL, and the mobile reset flow will want to be animation-aware.

> Revisit if the shared surface grows past ~300 lines, or if the two copies drift in a way that causes a real bug. At that point extract `packages/core/` with Metro `watchFolders` + `transpilePackages`.

Everything else — components, styling, animations, images, fonts — is genuinely platform-specific and gets rewritten.

### 3. Expo (managed) + Expo Go, so you never open Xcode

Every library below ships inside the Expo Go app, which means: install Expo Go from the App Store, scan a QR code, and the app runs on your phone. No native build, no signing, no $99/yr.

| Need | Library | In Expo Go? |
|---|---|---|
| Images (remote + animated GIF + disk cache) | `expo-image` | ✅ |
| Fonts (Bangers, Noto Sans KR) | `expo-font` + `@expo-google-fonts/*` | ✅ |
| SVG icons + the BATTLE shield | `react-native-svg` | ✅ |
| Animations | `react-native-reanimated` | ✅ |
| Tailwind classes | `nativewind` v4 | ✅ (Babel/Metro transform, no native code) |

If the app later needs to live on the home screen without Expo Go running, `npx expo run:ios` with free Xcode personal signing gives a 7-day-renewable install. Out of scope for now.

### 4. One screen, no navigation library

The game is a single screen plus two overlays (all-fighters grid, win/draw result). Scaffold with `--template blank-typescript` and use RN `<Modal>` for the overlays. Skip `expo-router` — it's the default template but pure ceremony for one screen.

---

## Phase 0 — Restore the `/api/all-fighters` endpoint

The mobile app needs the full roster for the "See All Characters" grid. That route **was deleted** in commit `40ede47` when fighter loading moved to server components — the web app now gets the full list as a server prop, so nothing calls it anymore.

`GET /api/fighters` (5 random) still exists and is already publicly reachable at `https://smashbros.anthonygnl.com/api/fighters`.

**Create** `next-app/app/api/all-fighters/route.ts`, mirroring the existing `next-app/app/api/fighters/route.ts`:

```ts
import { getAllFighters } from '../../lib/getFighters'

export const dynamic = 'force-dynamic'   // see gotcha below

export async function GET() {
  try {
    return Response.json(await getAllFighters())
  } catch {
    return Response.json({ error: 'Failed to load fighters' }, { status: 500 })
  }
}
```

Notes:

- Reuse `getAllFighters` from `next-app/app/lib/getFighters.ts` — it's already wrapped in `unstable_cache(..., { revalidate: 86400 })`, so the 24h cache comes for free and DynamoDB isn't hit per request.
- `force-dynamic` is **required**, not optional. `FIGHTERS_TABLE_NAME` is a CDK token injected at runtime only; a static prerender attempt fails at build. This is the documented gotcha in `CLAUDE.md`.
- No CORS config needed — native apps don't enforce browser origin policy.
- No API Gateway needed. CloudFront already fronts these routes.

Then `npx cdk deploy` and verify both endpoints respond before writing any mobile code.

## Phase 1 — Scaffold `mobile/`

```
mobile/
  PLAN.md               TODO.md
  package.json          yarn.lock          tsconfig.json
  app.json              babel.config.js    metro.config.js
  tailwind.config.js    global.css         nativewind-env.d.ts
  App.tsx
  assets/
    sb-stage-2.jpg              (copy from next-app/public/)
    icons/*.svg                 (copy the 4 SVGs from next-app/public/)
  src/
    config.ts           lib/types.ts        lib/api.ts
    game/useGame.ts     game/useFighters.ts
    components/...
```

1. `npx create-expo-app@latest mobile --template blank-typescript`
2. Install NativeWind v4 per its Expo setup guide (`nativewind`, `tailwindcss@^3`, `react-native-reanimated`; Babel preset + `withNativeWind` in `metro.config.js` + `global.css`).
   - **NativeWind v4 pairs with Tailwind v3** — and `next-app` is already on `3.4.17`, so the theme config ports over directly.
3. `npx expo install expo-image expo-font @expo-google-fonts/bangers @expo-google-fonts/noto-sans-kr react-native-svg react-native-svg-transformer`
4. `app.json`: set `"orientation": "default"` (the template defaults to `"portrait"`; both orientations are wanted).
5. `src/config.ts`: exports `config.apiBaseUrl = 'https://smashbros.anthonygnl.com'`. No `.env` files are used or checked in. SSM was rejected because it would need AWS credentials on the device, and there is no build pipeline (Expo Go) to inject a pipeline variable.
6. **Checkpoint:** `npx expo start`, scan with Expo Go, see a navy screen with Bangers text. Don't move on until this works.

### Porting `tailwind.config.js`

Copy `next-app/tailwind.config.ts` and change:

- `content: ['./App.tsx', './src/**/*.{ts,tsx}']`
- `presets: [require('nativewind/preset')]`
- `fontFamily` → the loaded `expo-font` family names (`Bangers_400Regular`, `NotoSansKR_400Regular`), not CSS variables
- `colors.navy` carries over unchanged
- **Delete the `keyframes` / `animation` blocks.** NativeWind does not implement Tailwind keyframe animations — these all become Reanimated in Phase 4.

## Phase 2 — Data layer and game logic

**`src/lib/types.ts`** — verbatim copy of `next-app/app/lib/types.ts`.

**`src/lib/api.ts`** — new. Thin wrapper over `fetch` against `config.apiBaseUrl` from `src/config.ts`, exposing `getRandomFighters()` and `getAllFighters()`, both returning `Fighter[]` and throwing on non-2xx.

**`src/game/useGame.ts`** — verbatim copy of `next-app/app/game/hooks/useGame.ts`. Pure `useState`, no platform deps. Preserves all existing behavior: HP `Math.ceil(Math.random() * 49 + 50)`, slot re-indexing in `replaceContender`, higher-HP-wins/equal-is-draw in `battleFn`, `onReset` callback on replace and clear.

**`src/game/useFighters.ts`** — adapted from the web version. Two differences:

- No server-rendered seed props exist on mobile, so it fetches **both** lists on mount (`Promise.all`) with a loading state, rather than being handed initial data.
- Error copy: "Failed to load fighters. Pull to retry." — "Please refresh the page" is meaningless on a phone.

## Phase 3 — UI components

Rebuild under `src/components/`, mapping one-to-one from `next-app/app/components/`. Build bottom-up and check each on device.

| Mobile component | Ported from | Main rework |
|---|---|---|
| `Queue.tsx` | `Queue.tsx` | `<Pressable>`; `expo-image` for the fighter thumb |
| `Fighters.tsx` | `Fighters.tsx` | Non-scrolling row of 4 fighters (`config.queueSize`) |
| `Contenders.tsx` | `Contenders.tsx` | `<TextInput>` for name edit; web's spread shadow becomes an SVG radial-gradient glow; compact row layout in portrait |
| `BattleButton.tsx` | `BattleButton.tsx` | `react-native-svg` shield, `<Pressable>` with `onPressIn/Out` swapping `#666`→`#ff3837` |
| `Battlefield.tsx` | `Battlefield.tsx` | `<ImageBackground>` with `sb-stage-2.jpg`; portrait stacks contenders with BATTLE between them; landscape is side by side |
| `Header.tsx` | `Header.tsx` | Absolute-positioned bar respecting `SafeAreaView` insets |
| `Menu.tsx` | `Menu.tsx` | `<Modal transparent>` |
| `AllFighters.tsx` | `AllFighters.tsx` | **`FlatList` with `numColumns`** — see below |
| `ResultHeader.tsx` | `ResultHeader.tsx` | Full-screen `<Modal>`; `expo-image` renders the Giphy GIFs animated |
| `App.tsx` | `Game.tsx` | Same composition; keep the `result satisfies never` exhaustiveness check |

### Things that genuinely don't translate

- **`hover:` variants** (`hover:scale-110`, `hover:rotate-180`, `BattleButton`'s `onMouseEnter`) — no hover on touch. Use `active:` / `<Pressable>` press state.
- **The three `background-image` CSS classes** (`.battlefield-bg`, `.btn-close`, `.btn-menu`) — no NativeWind equivalent. Use `<ImageBackground>` and `react-native-svg` components instead.
- **`vw` / `vh` units** — used throughout (`h-[65vh]`, `w-[20vw]`, `h-[9vw]`, `calc(100vh-80px)`). NativeWind v4 claims viewport-unit support; **verify it updates on rotation** before relying on it. If it doesn't, `useWindowDimensions()` with inline styles is the reliable path and re-renders correctly on rotate.
- **`shadow-[0_0_100px_100px_rgba(0,0,0,0.7)]`** in `Contenders` — iOS shadows have no spread parameter. Either drop it or fake it with a semi-transparent overlay.
- **`font-bangers text-9xl`** from `globals.css` `@layer base` — NativeWind has no cascading element defaults. Make a small `<Heading>` wrapper component instead of relying on an `h1` rule.

### The all-fighters grid (~90 remote images)

Avoid heavy image-optimization layers for high-volume remote grids; prefer lazy loading. The RN equivalent:

- **`FlatList` with `numColumns`**, not a `ScrollView` of 90 `<Image>`s. FlatList windows offscreen rows, which is what `loading="lazy"` buys on web (added in commit `1d20075`).
- **`expo-image`** with `cachePolicy="memory-disk"` and `recyclingKey={fighter.id}` — remote `raw.githubusercontent.com` URLs then hit disk cache on relaunch.
- Set `numColumns` from orientation so the grid reflows on rotate. Note `FlatList` needs a `key` change to re-render when `numColumns` changes.

## Phase 4 — Animations (Reanimated)

The six Tailwind keyframes in `next-app/tailwind.config.ts` are the game's whole feel. They animate **`marginTop`/`marginRight`/`marginBottom`**, which RN can't animate off the UI thread — port each to a `transform`, which is equivalent visually and much smoother:

| Web | Mobile |
|---|---|
| `flyUp` — `marginTop: 500px → 0`, 1.5s, 1s delay | `translateY: 500 → 0` + opacity, `withDelay(1000, withTiming(...))` |
| `flyRight` — `marginRight: 500px → 0`, 0.7s overshoot | `translateX` with `Easing.bezier(.7,.12,.6,1.7)` |
| `flyDown` — `marginBottom: 2000px → 0`, 1.5s | `translateY: 2000 → 0` |
| `growIn` — `scale(0) → scale(1)`, origin `top right` | `scale` + a compensating `translateX`/`translateY` — **RN has no `transformOrigin`**, transforms pivot at center |
| `fadeIn` 0.2s / `fadeInDelay` 0.7s | `withTiming` on opacity |

All four cubic-beziers map directly onto `Easing.bezier(...)` with the same control points. `growIn` is the only one needing real thought.

## Phase 5 — Wiring up and cleanup

- **CI:** add a `mobile` typecheck job to `.github/workflows/test.yml`. Today that workflow only installs root deps and runs the CDK tests — it never touches `next-app` either. Adding `mobile` typecheck (and optionally `next-app` typecheck, a pre-existing gap) is cheap insurance.
- **Snyk:** run `snyk_code_scan` over the new `mobile/` source and the new API route, fix anything it reports, and rescan until clean.
- **Docs:** add `mobile/CLAUDE.md`; add a mobile section to root `CLAUDE.md`.
- **Fix the stale docs this work touches.** Both `CLAUDE.md` files currently describe a `useFighters` that fetches `/api/fighters` *and* `/api/all-fighters` on mount — that stopped being true at `40ede47`. Phase 0 makes the endpoint real again, but the web app still doesn't fetch on mount, so the data-flow sections need correcting either way. `next-app/CLAUDE.md` also still lists `.btn-battle` as a background-image class; it became an inline SVG in `fc45a64`. Root `README.md` describes v1 (Express, port 4002) and is entirely obsolete.

---

## Verification

**Phase 0 (before any mobile code):**

```bash
curl -s https://smashbros.anthonygnl.com/api/fighters      | jq 'length'   # 5
curl -s https://smashbros.anthonygnl.com/api/all-fighters  | jq 'length'   # ~90
```

Plus `yarn test` at root (CDK assertions) and `cd next-app && yarn typecheck`.

**Per phase, on device:** `cd mobile && npx expo start`, scan with Expo Go. Reload is instant — this is the main feedback loop and it's why the Expo-Go-compatible library set matters.

**Also:** `npx expo start --ios` for the simulator (needs Xcode installed, but you never open it) — useful for quick rotation testing.

**Full manual pass once Phase 3 lands:**

1. Launch → 5 fighters load in the queue
2. Tap a fighter → appears in slot 0 with HP in 51–99; tap another → slot 1
3. Tap BATTLE → higher HP wins; the result overlay shows the right name and GIF
4. Force a draw (relaunch until two equal HPs, or temporarily hard-code) → draw overlay
5. Edit a contender's name → persists until clear
6. Replace a contender → that slot clears, the remaining one re-indexes to slot 0, queue re-rolls
7. Clear → everything resets, queue re-rolls
8. Open "See All Characters" → ~90 fighters scroll smoothly, no blank-image flicker on second open (disk cache)
9. **Rotate the device at every one of the above** — this is the step most likely to find bugs, given the "support both orientations" choice
10. Airplane mode on launch → error message shows, app doesn't crash

**Typecheck:** `cd mobile && npx tsc --noEmit`.

---

## Risks worth knowing up front

1. **Rotation support is the single largest source of work and bugs here.** The web layout is `vw`/`vh` throughout and assumes a wide viewport. Budget most of Phase 3 for this, and consider getting portrait fully correct first, then adding landscape.
2. **NativeWind buys less than it looks like it will.** Theme colors and font families port cleanly; `vw`/`vh`, all six animations, the three background-image classes, every `hover:`, the base-layer `h1`/`body` rules, and the arbitrary shadow all need rewriting regardless. It's still a reasonable choice for familiarity — just don't expect classNames to copy across.
3. **The API has no auth, no rate limiting, and no CORS config.** Fine for a personal project on a public dataset, and unchanged by this work — but Phase 0 does make the full roster publicly fetchable again, so it's worth saying out loud.
4. **Nintendo/Amiibo imagery** is why "personal devices only" is the right call. Nothing in this plan should be taken as a path toward a public listing.
