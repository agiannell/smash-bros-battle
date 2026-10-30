# Mobile port — work checklist

Working checklist for the iOS port. Rationale for every decision here lives in [`PLAN.md`](./PLAN.md).

Items are in dependency order. **Checkpoints** (🚩) are hard gates — don't start the next phase until the checkpoint passes, or you'll be debugging two unfamiliar layers at once.

---

## Phase 0 — Backend: restore `/api/all-fighters`

*No mobile code until this is deployed and returning data.*

- [x] Create `next-app/app/api/all-fighters/route.ts` — `GET` handler calling `getAllFighters()` from `next-app/app/lib/getFighters.ts`, with `export const dynamic = 'force-dynamic'` and a 500 + `{ error }` catch. Mirror the shape of the existing `next-app/app/api/fighters/route.ts`.
  - **Done when:** `cd next-app && yarn typecheck` passes.
  - ⚠️ `force-dynamic` is required, not stylistic — `FIGHTERS_TABLE_NAME` is a runtime CDK token and a static prerender attempt fails the build.
- [x] **Prerequisite discovered:** upgrade `next-app` from Next 15.5.15 → 16.4.3 (+ React 19.3.1). OpenNext 3.10.4 (what `cdk-nextjs-standalone` runs via `npx @opennextjs/aws@^3`) refuses end-of-support Next 15, so no deploy could succeed. Tailwind stays on v3 (NativeWind v4 pairs with it) and TypeScript stays on 5.9.
  - **Done:** `yarn typecheck` and `yarn build` pass; `npx cdk diff` completes (OpenNext build succeeds) and shows only Lambda code assets + cache-invalidation changes — no IAM, DynamoDB, DNS, or CloudFront changes.
- [x] Run `yarn test` at repo root (CDK assertions) — confirm nothing regressed.
  - **Done when:** all 7 assertions pass. (Passes with `--timeout 60000`; the default 2s mocha hook timeout can trip on a cold esbuild bundle.)
- [x] Deploy: done via the GitHub Actions `deploy.yml` workflow (PR #10: Next 16 upgrade + new route).
  - **Done when:** deploy completes without error.
- [x] 🚩 **Checkpoint — both endpoints live** (verified: `/api/fighters` → 5, `/api/all-fighters` → 96, all with `id`/`name`/`image`):
  ```bash
  curl -s https://smashbros.anthonygnl.com/api/fighters     | jq 'length'   # expect 5
  curl -s https://smashbros.anthonygnl.com/api/all-fighters | jq 'length'   # expect ~90
  curl -s https://smashbros.anthonygnl.com/api/all-fighters | jq '.[0]'     # expect {id, name, image}
  ```
- [ ] Load `https://smashbros.anthonygnl.com` in a browser — confirm the web game still works end to end (the deploy touched the Next build).

## Phase 1 — Scaffold the Expo app

- [x] Install Expo Go on the iPhone from the App Store (free, no developer account).
- [x] Scaffold: `npx create-expo-app@latest mobile --template blank-typescript`
  - ⚠️ `mobile/PLAN.md` and `mobile/TODO.md` already exist — make sure the scaffolder doesn't clobber them, or scaffold to a temp dir and move the files in.
  - **Done when:** `mobile/package.json`, `mobile/App.tsx`, and `mobile/yarn.lock` exist.
- [x] Confirm `mobile/` has its **own** `yarn.lock` and that root `package.json` still has **no** `workspaces` field.
  - **Done when:** `git diff package.json next-app/package.json` is empty. Breaking this breaks the CDK deploy.
- [x] Add `mobile/.gitignore` entries for `node_modules`, `.expo`. `.env*` is also ignored — no env files are checked in; the API base URL lives in `src/config.ts`.
- [x] Install NativeWind v4: `nativewind`, `tailwindcss@^3`, `react-native-reanimated`. Wire up the Babel preset, `withNativeWind` in `metro.config.js`, `global.css`, and `nativewind-env.d.ts`.
  - **Done when:** a `<View className="bg-red-500">` renders red.
- [x] Install the rest: `npx expo install expo-image expo-font @expo-google-fonts/bangers @expo-google-fonts/noto-sans-kr react-native-svg react-native-svg-transformer`
- [x] Configure `react-native-svg-transformer` in `mobile/metro.config.js` (composes with `withNativeWind`).
- [x] Set `"orientation": "default"` in `mobile/app.json` — the template ships `"portrait"`.
- [x] Create `mobile/src/config.ts` exporting `config.apiBaseUrl = 'https://smashbros.anthonygnl.com'` (instead of a `.env` file).
- [x] Port `mobile/tailwind.config.js` from `next-app/tailwind.config.ts`: keep `colors.navy`, repoint `content`, add `presets: [require('nativewind/preset')]`, map `fontFamily` to the expo-font names, and **delete the `keyframes`/`animation` blocks** (Phase 4 handles those in Reanimated).
- [x] Load Bangers + Noto Sans KR via `useFonts` in `App.tsx`, gated on a loading state.
  - ⚠️ Import single weights from subpaths (`@expo-google-fonts/noto-sans-kr/400Regular`). Importing from the package root made Metro bundle all 9 weights (~56 MB).
  - Note: Noto Sans KR Regular alone is 6.2 MB (full CJK). Fine for personal use; subset it if bundle size ever matters.
- [x] Flatten the SVGs' `<style>.cls-1{fill:…}</style>` + `class="cls-1"` into direct `fill` attributes — `react-native-svg` ignores CSS classes. (Done on the copies in `mobile/assets/icons/`; the web originals are untouched.)
- [x] Copy assets: `next-app/public/sb-stage-2.jpg` → `mobile/assets/`, and the 4 SVGs (`smash-logo-white.svg`, `close-button.svg`, `menu-lines.svg`, `favicons/smash-icon-red.svg`) → `mobile/assets/icons/`.
- [x] Verified off-device: `yarn typecheck` clean, `npx expo-doctor` 20/20, `npx expo export --platform ios` bundles (Expo SDK 58, RN 0.88, Reanimated 4.7 + worklets 0.13, NativeWind 4.2.7, Tailwind 3.4).
- [x] 🚩 **Checkpoint — running on the phone (verified on iPhone via Expo Go):** `cd mobile && npx expo start`, scan the QR with Expo Go. Navy background, a heading in Bangers, body text in Noto Sans KR, the logo SVG rendering.
  - **Do not proceed until this works.** Everything after assumes a working device loop.

## Phase 2 — Data layer and game logic

- [x] `mobile/src/lib/types.ts` — verbatim copy of `next-app/app/lib/types.ts` (`Fighter`, `Contender`).
- [x] `mobile/src/lib/api.ts` — `getRandomFighters()` and `getAllFighters()` over `fetch`, based on `config.apiBaseUrl` from `src/config.ts`, throwing on non-2xx.
  - **Done when:** a temporary `console.log` in `App.tsx` prints 5 fighters and ~90 fighters from the device.
- [x] `mobile/src/game/useGame.ts` — verbatim copy of `next-app/app/game/hooks/useGame.ts`. No changes; it has zero platform imports.
  - Preserve exactly: HP `Math.ceil(Math.random() * 49 + 50)` (51–99), slot re-indexing in `replaceContender`, higher-HP-wins / equal-is-draw in `battleFn`, `onReset` firing on replace **and** clear.
- [x] `mobile/src/game/useFighters.ts` — adapted from the web hook: fetches both lists on mount via `Promise.all` with a loading state (no server-rendered seed props on mobile), and mobile-appropriate error copy.
- [x] `cd mobile && npx tsc --noEmit` passes.

## Phase 3 — UI components

*Build bottom-up; check each on the device before moving on. Get **portrait** correct first, then add landscape — don't fight both at once.*

- [ ] `src/components/Queue.tsx` — one selectable fighter card. `<Pressable>` + `expo-image`; returns `null` at 2 contenders.
- [ ] `src/components/Fighters.tsx` — horizontal `FlatList` of the 5 random fighters; swaps to the "Reset Battlefield" button at 2 contenders.
- [ ] `src/components/Contenders.tsx` — HP, image, name, `<TextInput>` inline edit + Submit, Edit Name / Replace buttons. Drop the `shadow-[0_0_100px_100px_...]` (iOS shadows have no spread).
- [ ] `src/components/BattleButton.tsx` — `react-native-svg` shield from the 4-segment `SHIELD_PATH`, `<Pressable>` with `onPressIn`/`onPressOut` swapping `#666` ↔ `#ff3837`.
  - ⚠️ Render the "BATTLE!" label as an RN `<Text>` layered over the SVG rather than as SVG `<text>` — keeps the Bangers font reliable.
- [ ] `src/components/Battlefield.tsx` — `<ImageBackground>` with `sb-stage-2.jpg`; empty state ("Choose Your Character!") vs 2-up contender layout + `BattleButton`.
- [ ] `src/components/Header.tsx` — top bar with logo + hamburger, inside `SafeAreaView` insets.
- [ ] `src/components/Menu.tsx` — `<Modal transparent>` dropdown with "See All Characters".
- [ ] `src/components/AllFighters.tsx` — full-roster grid as a `FlatList` with `numColumns`, `expo-image` with `cachePolicy="memory-disk"` and `recyclingKey={fighter.id}`.
  - ⚠️ Not a `ScrollView` of 90 images. `FlatList` windowing is the RN equivalent of the web's `loading="lazy"`.
  - ⚠️ Changing `numColumns` requires changing the `FlatList` `key` to force a re-render.
- [ ] `src/components/ResultHeader.tsx` — full-screen `<Modal>`; green `rgba(54,153,83,0.9)` win / red `rgba(255,0,0,0.9)` draw; Giphy GIFs via `expo-image` (animates them); close button.
- [ ] `App.tsx` — compose `useFighters` + `useGame` (passing `refetchRandom` as `onReset`), header/result switch, error banner, `Battlefield`, `Fighters`. Keep the `result satisfies never` exhaustiveness check from `Game.tsx`.
- [ ] Wire pull-to-refresh to `useFighters().reload` (e.g. `RefreshControl` on the fighter list). The hook's error copy says "Pull to retry", so this has to exist. Also use `loading` for the initial state.
- [ ] Replace every `hover:` variant with `active:` / `Pressable` press state.
- [ ] Decide the `vw`/`vh` strategy: test whether NativeWind v4 viewport units update on rotation. If not, switch those sizes to `useWindowDimensions()` + inline styles.
  - **Done when:** the decision is made deliberately and applied consistently, not left half-and-half.
- [ ] Add landscape layouts — reflow the contender pair and the all-fighters `numColumns`.
- [ ] 🚩 **Checkpoint — full manual pass on device** (see "Verification" in `PLAN.md`), **rotating the device at every step**.

## Phase 4 — Animations (Reanimated)

- [ ] `flyUp` → `translateY: 500 → 0` + opacity, `withDelay(1000, withTiming(1500, Easing.bezier(.9,.12,.7,1.3)))` — on the fighter queue row.
- [ ] `flyRight` → `translateX`, 700ms, `Easing.bezier(.7,.12,.6,1.7)` (the overshoot) — on the empty-battlefield prompt.
- [ ] `flyDown` → `translateY: 2000 → 0`, 1500ms, `Easing.bezier(.9,.12,.7,1)` — on the all-fighters grid.
- [ ] `growIn` → `scale(0) → scale(1)`, 300ms — on the menu dropdown.
  - ⚠️ RN has no `transformOrigin`; transforms pivot at center. Needs a compensating `translateX`/`translateY` to fake the web's `top right` origin.
- [ ] `fadeIn` (200ms) and `fadeInDelay` (700ms) → `withTiming` on opacity — on the result overlay.
- [ ] Verify animations don't re-trigger spuriously on rotation.

## Phase 5 — Wiring up and cleanup

- [ ] Add a `typecheck` script to `mobile/package.json` (`tsc --noEmit`).
- [ ] Add a `mobile` typecheck job to `.github/workflows/test.yml`. Consider adding `next-app` typecheck too — that workflow currently only runs root CDK tests and never touches either frontend.
- [ ] Run `snyk_code_scan` over `mobile/src` and the new API route; fix any findings; rescan until clean.
- [ ] Write `mobile/CLAUDE.md` — commands, stack, directory structure, and the gotchas that bit during the port.
- [ ] Add a mobile section to the root `CLAUDE.md`.
- [ ] **Fix stale docs** (pre-existing, surfaced during planning):
  - [ ] Root `CLAUDE.md` + `next-app/CLAUDE.md`: the data-flow sections describe `useFighters` fetching both endpoints on mount. Untrue since `40ede47` — the web app is server-rendered and only fetches `/api/fighters` lazily on reset.
  - [ ] `next-app/CLAUDE.md`: remove `.btn-battle` from the background-image class list — it became an inline SVG in `fc45a64`.
  - [ ] Root `README.md`: describes v1 (Express, nodemon, port 4002). Entirely obsolete.
- [ ] Consider deleting the vestigial `/api` directory at repo root — untracked, contains only stale `node_modules` and an empty `api/src/fighters/`.
