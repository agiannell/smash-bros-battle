# CLAUDE.md — next-app

This file provides guidance for the Next.js frontend at `next-app/`.

## Commands

```bash
yarn dev          # run locally (requires AWS credentials + FIGHTERS_TABLE_NAME env var)
yarn build        # production build
yarn typecheck    # tsc --noEmit
```

## Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS v3**
- **AWS SDK v3** (`@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb`) — server-side only
- Fonts: `Bangers` (headings, `font-bangers`) and `Noto Sans KR` (body, `font-noto`) via `next/font/google`

## Directory structure

```
app/
  api/
    fighters/       GET — random fighters, `?count=N` (default 5; force-dynamic)
    all-fighters/   GET — all fighters (force-dynamic; 24h cache inside getAllFighters)
  components/       Shared UI components (server + client)
  game/
    GameLoader.tsx  Async server component — fetches both fighter lists, renders <Game />
    Game.tsx        'use client' root — composes hooks, renders layout
    hooks/
      useGame.ts    All game state: contenders, result, battle logic
      useFighters.ts  Holds the server-provided lists; refetches the random 5 on reset
  lib/
    getFighters.ts  DynamoDB query (server-side)
    types.ts        Fighter, Contender interfaces
  globals.css       Tailwind directives + custom CSS classes
  layout.tsx        Root layout, font variables, metadata
  page.tsx          Entry — <GameLoader /> inside Suspense, with a skeleton fallback
tailwind.config.ts  Custom colors, fonts, animations
```

## Key types

```ts
interface Fighter  { id: string; name: string; image: string }
interface Contender { slot: 0 | 1; name: string; image: string; hp: number }
type GameResult = { kind: 'win'; name: string } | { kind: 'draw' }
```

## Data flow

1. `page.tsx` streams `GameLoader` (async server component) inside `Suspense`; it calls `getRandomFighters(5)` and `getAllFighters()` from `lib/getFighters.ts` → DynamoDB `QueryCommand` (`pk = "FIGHTER"`)
2. `Game` receives both lists as props; `useFighters` only seeds state from them. Nothing is fetched on mount
3. On reset or replace, `useFighters` calls `GET /api/fighters` to re-roll the random 5
4. `useGame` manages all client-side game state (contenders, winner, draw) — no server persistence
5. Contenders are client-state only; user-edited names persist for the session and reset on clear
6. Both API routes are also the public API the `mobile/` app uses

## Styling conventions

- Tailwind utility classes for layout/spacing/color
- Custom CSS classes in `globals.css` for things not expressible as utilities:
  - `.battlefield-bg` — background image
  - `.btn-close`, `.btn-menu` — SVG background-image buttons (the BATTLE button is an inline SVG component, since background-image SVGs can't load web fonts)
  - `.btn-green` — standard green action button
- Custom Tailwind animations: `flyUp`, `flyRight`, `flyDown`, `fadeIn`, `fadeInDelay`, `growIn`
- Custom color: `bg-navy` = `rgb(37, 55, 83)`

## Gotchas

- **`FIGHTERS_TABLE_NAME`** is injected at runtime by CDK — not available at build time. Any page or route that calls `getFighters` must use `export const dynamic = 'force-dynamic'` (or equivalent) to prevent Next.js from attempting a static prerender, which would fail with a CDK Token validation error
- **`/api/fighters` uses `force-dynamic`** so each request gets a fresh random selection
- **`/api/all-fighters` is `force-dynamic` too**, but `getAllFighters` is wrapped in `unstable_cache(..., { revalidate: 86400 })`, so DynamoDB is queried at most once a day — the full list changes rarely
- **Fighter images use `<img>` not `next/image`** — matches v1 behavior; `raw.githubusercontent.com` is allow-listed in `next.config.ts` but `<img>` is used directly
- **HP is client-side**: `Math.ceil(Math.random() * 49 + 50)` in `useGame.chooseContender` — range 51–99
- **Battle logic is client-side**: `battleFn` in `useGame` — higher HP wins, equal HP is a draw
