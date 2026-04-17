# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Install dependencies:**
```
yarn
```

**Start frontend (port 3000):**
```
yarn start
```

**Start backend (port 4002) — requires nodemon globally installed:**
```
nodemon
```

**Build for production:**
```
yarn build
```

**Run tests:**
```
yarn test
```

Both servers must run concurrently during development. The React app proxies API requests to the Express backend at `http://localhost:4002`.

## Architecture

This is a turn-based browser game where players select two Super Smash Bros. characters from the Nintendo Amiibo API, each gets a random HP value (50–99), and the higher HP wins.

**Stack:**
- Frontend: React 17 (class components throughout), Axios, plain CSS
- Backend: Express 4 + Axios, no database — all state is in-memory

**Data flow:**
1. Backend fetches fighters from `https://www.amiiboapi.com/api/amiibo/?amiiboSeries=0x00` via `allFightersCtrl.js`
2. `chooseYourCtrl.js` manages a `contenders` array in server memory (add, remove, clear)
3. `App.js` is the single source of truth on the frontend — it holds all game state and passes props down
4. Components are purely presentational; all logic and API calls live in `App.js`

**Key files:**
- `server/index.js` — Express app, route definitions, serves `build/` in production
- `server/controllers/allFightersCtrl.js` — fighter fetch + random selection
- `server/controllers/chooseYourCtrl.js` — contender CRUD
- `src/Components/App.js` — root component, all state and handlers
- `src/App.css` — all styles (~471 lines, includes animations)

**Header variants** (`Header.js`, `WinHeader.js`, `DrawHeader.js`) are conditionally rendered by `App.js` based on game state. `WinHeader.js` fetches a celebration GIF from the Giphy API.
