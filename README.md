# TRAPPED

React + Vite + Tailwind + Framer Motion + Howler, per the project's tech stack.

## Run it

```
npm install
npm run dev
```

Then open the printed localhost URL. `npm run build` produces a static bundle
ready for Vercel.

Note: this was built in a sandboxed environment with no npm registry access,
so `npm install` could not be run here to produce a full build check. Every
source file was checked for balanced syntax by hand, and the app logic
(bias-scoring from player answers) was unit-checked with plain Node. Still —
run `npm install && npm run dev` locally as the first real smoke test before
anything else.

## UI shell

`src/App.jsx` now hosts the whole game rather than just Level 4:

boot → onboarding (title screen) → login → hub (level select / progress) →
play a level → back to hub.

- **Login** — Google SSO restricted to your org's email domain, via
  Supabase. Until Supabase is connected, it falls back to a local nickname
  field so the shell is fully playable today. See `SUPABASE_SETUP.md` to
  wire up the real thing.
- **Level select** (`src/shell/LevelSelect.jsx`) — grid of all 4 levels.
  Levels 1 and 2 show locked/"coming soon" until their code exists.
- **Progress view** (`src/shell/ProgressView.jsx`) — scenarios survived,
  biases escaped, points, and a per-level breakdown, using the exact score
  labels from the copy spec.
- **Level registry** (`src/data/levels.js`) — single place that wires a new
  level component into the shell once it's built; also where the locked
  levels' cards are configured.
- Progress persists per-user via `src/lib/progressStore.js` (Supabase table
  when configured, `localStorage` otherwise).

## What's implemented

Level 4 — The Witness, full loop:

- **Setup** — auto-advancing context lines, no instructions
- **Flash scene** — 8-second, unpausable, unreplayable animated scene. This
  is the only ground truth the player gets: a silver hatchback, moderate
  speed, heading south. Everything after this contradicts it.
- **Dispatcher call** — 5 leading questions, one at a time, exact copy from
  the spec, each answer recorded
- **Consequence** — fixed outcome (wrong car flagged), matching the spec's
  design intent that Level 4 always fails on outcome — only process (bias
  resistance) is variable
- **Reveal** — split comparison of truth vs. the player's own report, plus
  the 4 bias cards (misinformation effect, anchoring, authority bias,
  confirmation bias), each scored from actual recorded answers — see
  `scoreAnswers()` in `src/data/level4.js` for the exact logic
- **Completion screen** — this level's outcome/process score, using the
  exact global score labels from the copy spec. (The full 4-level end
  screen — radar chart, named profile, stress curve — isn't built here since
  levels 1–3 don't exist yet.)

## Bias-scoring logic

All four verdicts are pure functions of the 5 recorded answers — no hidden
randomness:

- **Misinformation effect** — fired if the player said the car *was* dark on
  the first ask.
- **Anchoring** — fired if they accepted "dark" *and* it carried into at
  least one later answer (fast / sedan / north).
- **Confirmation bias** — fired if 2+ of the 3 middle answers were full
  affirmations, i.e. they built and kept reinforcing a consistent story.
- **Authority bias** — fired if they chose CONFIRM on the dispatcher's
  readback instead of CORRECT IT.

## Known gaps to close before this is genuinely done

- No actual audio files beyond generated chiptune placeholders (`public/sounds`) —
  fine for MVP feel, swap for Bfxr/Chiptone assets if you want more character.
- No mobile touch-target QA pass yet — do the "stranger plays cold" test
  from the project instructions before calling this finished.
- Levels 1–3 don't exist yet, so this only exports a per-level result into
  `localStorage.trapped_results` for whenever the real end screen gets built.
