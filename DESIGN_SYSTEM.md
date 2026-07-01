# TRAPPED — Design System (Glitchwave)

This supersedes the visual direction in `TRAPPED_Visual_Sound_Reference.md`
(that doc's "retro Gameboy pixel art, muted 3-4 colors per level" brief has
been replaced by a single neon cyberpunk system, reused by every level and
the shell). Sound design, typing/animation timing, and copy rules in that
doc are unaffected — only the "Color Palettes Per Level" section and the
per-level color tables are out of date. Everything below reflects what's
actually implemented as of this pass.

## Why one system instead of four

Each level used to carry its own unrelated palette (fire amber, terminal
green, clinical grey-blue, navy streetlight), so the app read as four
prototypes stitched together rather than one game. There is now exactly
one palette and two chrome motifs, reused everywhere. Levels differ in
content and scene art, not in color scheme.

## Color tokens

Defined in `tailwind.config.js`. Token *names* are mostly the old per-level
names (`l1-text`, `l3-prompt`, `l4bg`, etc.) — only their hex values were
unified, so existing components repaint for free. New code should prefer
the two generic names.

| Token | Hex | Use |
|---|---|---|
| `accent-cyan` | `#2DE8FF` | Primary/interactive/success accent. Headers, glow borders, ESCAPED status, primary buttons. |
| `accent-magenta` | `#FF4477` | Danger/fail accent. FELL FOR IT, retry buttons, error flashes, alarms. |
| background (`l2-bg`/`l3-bg`/`l4bg`, + each level's own bg token) | `#12132B` | Deep navy base, paired with the grid background in `index.css`. |
| panel (`l2-panel`/`l3-face`/`l4panel`, + each level's own panel token) | `#1B1D45` | Card/wall/panel fill, one step up from background. |
| light text (`l4text`, `l2-text`, `l3-label`, + each level's own text token) | `#EAF7FF` / `#CFEFFF` | Pale cyan-white body/label text on dark surfaces. |
| `escaped` / `correct` | `#2DE8FF` | Global "you got it" status color. |
| `caught` / `wrong` | `#FF4477` | Global "you fell for it" status color. |
| warning | `#F5C518` | Reserved for hazard-stripe / caution accents only (used sparingly, e.g. Level 2's bomb warning triangle). Not a third brand color. |
| `reveal-bg` / `reveal-text` | `#F5F5F5` / `#1A1A1A` | The one deliberately light surface — a "printed document" card (Level 4's newspaper clipping), matching the reference's white system-alert/search windows sitting on the dark grid. Everything else is dark. |

**Contrast rule:** any text/background pairing must hit ≥4.5:1 (WCAG AA
for normal text). Both accent colors were chosen to clear this against
both the background and panel tones — don't introduce a new muted/dimmed
variant (e.g. `text-*/30`) without checking contrast at the actual font
size it'll render at; two real failures shipped this way already (Level 2's
legend label, the locked level-card state) and both had to be corrected.

**Gameplay-literal colors are exempt.** Two spots encode a color as actual
puzzle content, not decoration, and must never be repainted to match the
brand palette:
- Level 2's three wire colors (`src/data/level2.js` `WIRES` — blue/red/yellow are literally what the dialogue and legend reference).
- Level 4's driver-shirt pixel in `FlashScene.jsx` (`#FFD166`, pinned inline) — the reveal screen checks the player's memory against `TRUTH.shirt === 'AMBER'` in `src/data/level4.js`.

If a level design ever needs a new "this exact hue is the answer" mechanic,
pin it the same way: a literal hex with a comment, not a shared token.

## Background

`index.css` sets a shared navy + faint cyan grid on `html/body/#root`
(`background-size: 28px 28px`, ~5% opacity grid lines), matching the
reference's grid-backed UI-kit sheet. Every screen sits on this — don't
override it with a different solid color per-screen.

## Typography

Unchanged from the original brief: **Press Start 2P** for headers/UI
labels/buttons (always caps), **Courier New / monospace** for body and
dialogue copy (mixed case). Keep pixel-font sizes at 8px+ for anything a
player has to read during play — 6-7px pixel type reads as noise, not text
(this is also the size range where two of the contrast bugs above lived).

## Two chrome motifs

The reference actually contains two distinct visual languages that both
belong in the system — don't blend them into one generic "bordered box."

**1. Neon glow — interactive & outcome.** Rounded corners, a colored
border, and a soft glow in the same color (`.pixel-border` / `.neon-glow`
in `index.css`, `currentColor`-driven). Used for: `PixelButton`,
`BiasCard`, level-select cards, the hub avatar chip. If it's something the
player clicks, or a card reporting an outcome (escaped/fell for it), it
gets a glow border, not a flat rule.

**2. Window chrome — messages & alerts.** Hard black 2px outline, flat
4px offset drop-shadow (no blur), and a gradient or solid title bar with
`_ □ ×` corner glyphs — `src/components/WindowChrome.jsx`. Used for
anything framed as a message arriving on screen from someone/something
else: dispatcher lines (`DispatcherCall.jsx`), bystander dialogue
(`Act1Location.jsx`), the shared `DialogueBox`. `tone="cyan"` (default) is
neutral/informational; `tone="danger"` is a solid magenta bar for
alert-framed content, matching the reference's KERNEL PANIC window.
Reach for this instead of a plain `pixel-border` box whenever the content
is dialogue/instruction text rather than a control.

Buttons and cards never get window chrome; messages and alerts never get
a glow border. Mixing the two is the fastest way back to "looks like four
apps."

## Components

- `PixelButton` (`src/components/PixelButton.jsx`) — `variant="primary"` (cyan) for proceed/continue actions, `variant="danger"` (magenta) for retry/negative actions. Every reveal screen's NEXT/TRY AGAIN pair should use exactly these two variants — they used to be inconsistent per level (some hardcoded white, some shared one ambiguous "dark" variant for both outcomes).
- `BiasCard` (`src/components/BiasCard.jsx`) — the escaped/fell-for-it outcome card. `GLOW.escaped`/`GLOW.caught` are pinned to `accent-cyan`/`accent-magenta`; keep the two per-level duplicates (`levels/level1/Reveal.jsx`, `levels/level3/Reveal.jsx`) in sync if this changes.
- `WindowChrome` (`src/components/WindowChrome.jsx`) — see above.
- `CRTOverlay` (`src/components/CRTOverlay.jsx`) — scanline texture, opt-in per screen. Fine as-is.

## Iconography

Never place a non-pixel-font glyph (✗ ✓ 🔍 emoji, etc.) inline inside a
`font-pixel` span — Press Start 2P has no glyph for most symbols, so the
browser silently substitutes a different, much smaller/thinner font for
just that character. Give the icon its own `aria-hidden` span with
independent sizing (see `BiasCard.jsx` or any of the `Reveal.jsx` files
for the pattern) so it isn't rendered as an afterthought.

## Level scene art

Illustrated backdrops (Level 2 `BombPanel.jsx` chrome, Level 3
`StreetBackdrop.jsx`/`PhoneHousing.jsx`, Level 4
`DispatcherBackdrop.jsx`/`AccidentBackdrop.jsx`, and whatever backs Level 1)
are flat-fill pixel-art
SVG with hard edges (`shapeRendering="crispEdges"`, no circles/gradients/
blur — "round" things are stepped rectangles via `src/components/
PixelArtKit.jsx`). New scene art should pull its palette from the tokens
above rather than inventing new hex values, with the gameplay-literal-color
exception noted earlier.

## Open follow-ups

- `TRAPPED_Visual_Sound_Reference.md` still documents the old per-level
  palettes — worth trimming that section down to a pointer at this file so
  the two docs don't drift again.
- `WindowChrome` isn't yet used in Level 2's bomb-panel message/legend
  cards (they keep their own white "paper" card look, which is intentional
  and matches the reference's white system windows) or in Level 1's setup
  screens (currently full-bleed atmospheric text with no box at all) — call
  these out if a future pass wants every "message" moment fully unified.
