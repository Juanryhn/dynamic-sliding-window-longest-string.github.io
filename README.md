# Dynamic Sliding Window — Longest Substring Visualizer

This project is a React + TypeScript + Vite application that visualizes a dynamic sliding window algorithm building the longest contiguous substring from an input string.

## Features
- Enter any string up to 100 characters
- Step forward (Next) through the sliding window logic
- Step backward (Previous) using snapshot history
- Visual markers for left (l) and right (r) window pointers
- Live display of the current comparison window and the longest substring found
- Reset the window pointers back to the start

## How the algorithm works
The window is represented by pointers `l` and `r`. At each Next step:
1. Check if growing the window introduces a duplicate:
   - If the next head equals the current tail (`value[l] === value[r+1]`), shift both `l` and `r` right.
   - If the next character equals a character inside the current window (`comparison`), move `l` to the position after the first occurrence, and increment `r`.
2. If there is no duplicate, increment `r`.
3. Recompute `comparison = value.substring(l, r+1)` and update `longest` if the window length is greater than the current longest.
4. Push a snapshot of the previous state into history to enable the Previous action.

The Previous action pops the last snapshot from history and restores `l`, `r`, `comparison`, and `longest`.

## UI and Controls
- Random String input: type your string; rendering updates per character with pointer markers.
- Next button: advances the window. Disabled when `r + 1 === value.length`.
- Previous button: steps back using history. Disabled when there is no history.
- Reset button: resets window pointers to `{ l: 0, r: 0 }`. Note: history is not cleared by reset.

## Tech stack
- React 19 + TypeScript 5.9
- Vite 7
- Tailwind CSS 4 (via @tailwindcss/vite)
- Lightweight UI primitives for button and input components

## Key files
- `src/App.tsx` — main component implementing the sliding window logic and UI.
- `src/components/ui/button.tsx` — button component
- `src/components/ui/input.tsx` — input component
- `src/main.tsx` — application entry point
- `vite.config.ts` — Vite configuration

## Project structure
```
.
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx
│   │       └── input.tsx
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── package.json
└── README.md
```

## Scripts
- `npm run dev` — start dev server with HMR
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

## Getting started
1. Install dependencies:
   - `npm install` or `yarn`
2. Start dev server:
   - `npm run dev`
3. Open http://localhost:5173 in your browser (default Vite port).

## Known limitations
- Reset does not clear history; Previous will still traverse snapshots taken before the reset.
- The visualization focuses on contiguous substrings; behavior on certain inputs with repeated adjacent characters may shift `l` and `r` together.

## License
No explicit license has been set. Use at your own discretion.

## Contributing
Issues and pull requests are welcome. Please run `npm run lint` before submitting changes.
