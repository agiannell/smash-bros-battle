# Smash Bros. Battle Game

Pick two of five random fighters, hit BATTLE, and the one with the higher random HP wins. Live at [smashbros.anthonygnl.com](https://smashbros.anthonygnl.com).

- Edit a fighter's name, replace a single fighter, or reset the whole battlefield.
- Browse every available fighter from the menu.

## What's in the repo

| Directory | What it is |
|---|---|
| `next-app/` | The web game: Next.js (App Router), React, Tailwind CSS |
| `mobile/` | iOS app: React Native + Expo, run on your own devices through Expo Go |
| `lib/`, `bin/` | AWS CDK stack: DynamoDB table, Next.js on CloudFront, two Lambdas |
| `lambdas/` | Weekly sync of the fighter list from the Amiibo API |

`next-app/` and `mobile/` are independent packages, each with its own `package.json` and `yarn.lock`. This is deliberately not a yarn workspace: the CDK deploy bundles `next-app/node_modules` as-is. The mobile app reads fighters over HTTPS from the web app's public API.

Each package has its own `CLAUDE.md` with commands and gotchas; start there.

## Getting started

```bash
yarn install                      # CDK + Lambdas (repo root)
cd next-app && yarn install       # web app
cd mobile && yarn install         # mobile app
git config core.hooksPath .githooks   # typecheck every package before each push
```

### Web

`cd next-app && yarn dev`. It reads DynamoDB directly, so it needs AWS credentials and a `FIGHTERS_TABLE_NAME` environment variable.

### Mobile

`cd mobile && npx expo start`, then scan the QR code with Expo Go on your phone. No AWS credentials are needed.

### Deploy

`yarn deploy` builds the Next.js app and runs `cdk deploy`. In CI, the `deploy.yml` GitHub Action does the same.

## Checks

- `yarn test`: CDK assertions (CI runs this on every push and pull request).
- `yarn typecheck` in the root, `next-app/`, and `mobile/`. The pre-push hook runs all three.
