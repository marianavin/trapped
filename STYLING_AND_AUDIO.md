# Global styling & audio system — how to use it

This project separates **visual/audio style** from **level logic**, so you (or
whoever's designing) can restyle the whole game — or one level — without
opening a single level file.

## The rule

Level code (`src/levels/*`) and screen code (`src/components/screens/*`)
only ever reference *tokens*: Tailwind classes like `bg-theme-bg` or
`text-theme-danger`, and sound keys like `play('decision_wrong')`. They never
contain a hex color, a font name, or an audio file path. Every actual value
lives in exactly two config files.

## Changing visuals

Edit **`src/theme/levelThemes.js`**:

- `levelThemes[1..4]` — each level's color palette (background, danger
  accent, correct/muted element, text, overlay, accent). Reveal and end
  screens have their own entries (`reveal`, `end`) since they're the same
  regardless of which level just played.
- `statusColors` — the global success/error green/red used everywhere
  (reveal cards, dial feedback, etc).
- `typography` — the font stack for headers/UI vs. body/reveal copy, used
  by every screen.
- `crt` — scanline opacity and flicker timing for the CRT overlay.
- `motion` — pulse speed, shake duration, reveal-card stagger, and the
  countdown "danger" threshold — all shared Framer Motion timing.

Nothing else needs to change. `ThemeProvider` reads this file and writes the
palette out as CSS custom properties (`--color-bg`, `--color-danger`, etc.)
scoped to whichever level is currently mounted; `tailwind.config.js` maps
those variables to the `theme-*` and `status-*` utility classes used
throughout the app.

**Example:** to make Level 2's "danger" wire brighter, change
`levelThemes[2].colors.danger` in `levelThemes.js`. Every button, wire, and
highlight using `theme-danger` in Level 2 updates automatically — Level 2's
component code is untouched.

## Changing audio

Edit **`src/audio/soundConfig.js`**:

- `soundConfig` — the semantic sound registry (`decision_wrong`,
  `countdown_tick`, `bias_caught`, etc). Each entry has a file path, base
  volume, loop flag, and mixer category (`sfx` / `voice` / `music`).
- `levelAmbience` — which looping background sound plays for each level.
- `mixer` — master/sfx/voice/music volume and global mute.
- `escalationRate()` — the shared curve that speeds up countdown ticks as
  time runs out (used by both Level 1's door panel and Level 2's bomb).

Levels call the semantic key via the `useSound()` hook —
`const { play } = useSound(); play('decision_wrong')` — never a raw file
path. To swap a sound effect, change its `src` in `soundConfig.js`. To
retune the whole game's volume, change `mixer` once.

Drop actual audio files into `src/audio/sounds/` using the filenames
referenced in `soundConfig.js` (see the README in that folder for
suggested free chiptune tools). Until real files are added, missing audio
fails silently — the game still runs.

## Reusable pieces already wired to the system

`src/components/ui/` — `PixelButton`, `CountdownTimer`, `DialogueBox`,
`RevealCard`, `ProgressBar`, `CRTOverlay`. Build new level UI out of these
where possible instead of writing new styled elements, so new UI
automatically respects the global theme/audio config too.

## Running it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build for Vercel
```

`src/App.jsx` is a minimal shell that walks through intro → Level 1–4 →
reveal → end, useful for confirming theme/audio changes visually. Replace
its flow/scoring logic freely — it doesn't affect theme/, audio/, or
components/ui/.
