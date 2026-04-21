# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Install root CDK dependencies:**
```
yarn install
```

**Install and build Next.js app (required before CDK deploy):**
```
yarn build:next
```

**Run Next.js app locally (requires AWS credentials + FIGHTERS_TABLE_NAME env var):**
```
cd next-app && yarn dev
```

**Type-check root (CDK + Lambda code):**
```
yarn typecheck
```

**Type-check Next.js app:**
```
cd next-app && yarn typecheck
```

**CDK commands:**
```
npx cdk synth        # synthesize CloudFormation template
npx cdk diff         # compare deployed stack with current state
npx cdk deploy       # full deploy (also runs build:next)
```

## Architecture

This is an **AWS CDK v2** monorepo (TypeScript) that deploys a Next.js frontend, a DynamoDB table, and two Lambda functions to AWS. The frontend is the v2 rewrite of the Smash Bros. battle game.

**Entry point**: `bin/smash-bros-battle.ts` — instantiates `SmashBrosStack`.

**Stack definition**: `lib/smash-bros-stack.ts` — DynamoDB table, weekly sync Lambda, one-time backfill Lambda, and the Next.js CloudFront distribution deployed to `smashbros.anthonygnl.com`.

**Lambda functions**: `lambdas/<name>/index.ts` — bundled by `NodejsFunction` (esbuild). Both import from `lambdas/shared/amiibo.ts` for the Amiibo API fetch.

**Next.js frontend**: `next-app/` — App Router, Tailwind CSS, TypeScript. Hosted via `cdk-nextjs-standalone` (OpenNext + CloudFront + S3).

### DynamoDB Table (`smash-bros-fighters`)

| Key | Type | Description |
|---|---|---|
| `pk` | String (PK) | Constant `"FIGHTER"` |
| `id` | String (SK) | `head-tail` from Amiibo API (e.g. `"00000000-00000002"`) |
| `name` | String | Canonical Amiibo name |
| `image` | String | Amiibo image URL |
| `created_at` | String | ISO timestamp, set on first insert |
| `updated_at` | String | ISO timestamp, updated on every upsert |

### Lambdas

- **`fighters-sync`**: Runs every Monday at 12:00 UTC via EventBridge. Upserts all fighters from the Amiibo API (`amiiboapi.com/api/amiibo/?amiiboSeries=0x00`), preserving `created_at`.
- **`fighters-backfill`**: Runs once at first deploy via CDK `Trigger` (`executeOnHandlerChange: false`). Same upsert logic.

### Next.js App (`next-app/`)

**Data flow:**
1. `useFighters` hook fetches `GET /api/fighters` (5 random) and `GET /api/all-fighters` on mount
2. API routes call `lib/getFighters.ts` which queries DynamoDB directly via `DynamoDBDocumentClient`
3. `useGame` hook manages all client-side game state (contenders, winner, draw)
4. Contenders are **client-state only** — no server persistence. User-edited names persist for the session and reset on clear.

**Key files:**
- `app/game/Game.tsx` — `'use client'` root, composes `useGame` + `useFighters`, renders header + battlefield + fighters
- `app/game/hooks/useGame.ts` — all game state and handlers (contenders, battle logic, clear)
- `app/game/hooks/useFighters.ts` — fighter data fetching and refetch-on-reset
- `app/lib/getFighters.ts` — DynamoDB query (server-side); paginates with `do/while` + `LastEvaluatedKey`
- `app/lib/types.ts` — `Fighter` and `Contender` interfaces
- `app/globals.css` — Tailwind directives + background image classes (battlefield, buttons)
- `next-app/tailwind.config.ts` — custom animations (`flyUp`, `flyRight`, `flyDown`, `fadeIn`, `fadeInDelay`, `growIn`)

**Environment variable**: `FIGHTERS_TABLE_NAME` — injected at runtime by the CDK `Nextjs` construct. Not available at Next.js build time. The `/api/fighters` route uses `export const dynamic = 'force-dynamic'` to ensure each request gets a fresh random selection.

## Gotchas

- **CDK tests must pass `skipFrontend: true`**: `cdk-nextjs-standalone` triggers a full Next.js build during `Template.fromStack()`. Pass `skipFrontend: true` to skip this during test synthesis.
- **`next-app/.npmrc` pins the registry**: Overrides a global Yarn/npm config that may point to a private registry, avoiding 401s in CI.
- **Fighter images use `<img>` not `next/image`**: The Amiibo image URLs are `raw.githubusercontent.com` paths; `next/image` is allowed-listed in `next.config.ts` but `<img>` is used to match v1 behavior.
- **HP generation is client-side**: `Math.ceil(Math.random() * 49 + 50)` in `useGame.chooseContender`. Range: 51–99.
- **Battle logic is client-side**: `battleFn` in `useGame` — no server round-trip.
