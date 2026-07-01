# TRAPPED — Visual & Sound Reference

## Aesthetic Direction

Retro pixel art, Gameboy-inspired. Not nostalgic costume — intentional constraint. The lo-fi aesthetic makes every element earn its place on screen. No decorative noise. Everything visible has a reason.

The contrast that creates tension: the game *looks* retro and lo-fi, but the *scenarios* are completely modern — emergency panels, dispatcher calls, bomb defusal. Old aesthetic, real-world urgency.

**References:** Snake (Nokia), Pokémon Red/Blue (Gameboy), Pac-Man, early Gameboy RPGs.

---

## Overall Visual Rules

- **Pixel art style** — chunky, high-contrast, every element reads instantly at small size
- **Limited palette per level** — 3–4 colors maximum per screen. The important thing is always visually obvious.
- **CRT feel** — subtle scanline overlay, slight screen flicker on transitions, pixel-perfect rendering (no anti-aliasing)
- **No decorative elements** — if it doesn't communicate something, it's not there
- **Everything in caps** — UI labels, button text, prompts. Feels like a system, not a product.
- **Pixel grid** — all elements snap to a pixel grid. Nothing floats or bleeds.

---

## Typography

| Use | Font | Style |
|---|---|---|
| Headers, level titles, UI labels | Press Start 2P | All caps, white on dark |
| Body text, reveal copy | Courier New or monospace pixel font | Mixed case, high contrast |
| Countdown timer | Press Start 2P | Large, centered, color shifts red as time runs out |
| Bias names on reveal screen | Press Start 2P | Uppercase, color-coded ✓/✗ |

Google Fonts link for Press Start 2P: https://fonts.google.com/specimen/Press+Start+2P

---

## Color Palettes Per Level

### Level 1 — The Escape (Fire)
| Role | Color | Hex |
|---|---|---|
| Background | Near-black | #0D0D0D |
| Smoke fill | Dark grey | #2A2A2A |
| Danger / Emergency button | Pulsing red | #FF2D2D |
| Correct element (push-bar) | Muted grey | #5A5A5A |
| Text | Amber | #FFB347 |
| Social proof overlay | Dim white | #CCCCCC |

### Level 2 — The Bomb (Terminal)
| Role | Color | Hex |
|---|---|---|
| Background | Black | #000000 |
| Primary text & UI | Phosphor green | #00FF41 |
| Wire — looks red | Deep red | #CC0000 |
| Wire — looks blue | Steel blue | #4A90D9 |
| Wire — decoy yellow | Muted yellow | #D4A017 |
| Timer | Bright green → red as it drops | #00FF41 → #FF2D2D |
| Panel labels | Dim green | #007A20 |

### Level 3 — The Scrambled Keypad (Clinical)
| Role | Color | Hex |
|---|---|---|
| Background | Cool dark grey | #1A1A2E |
| Keypad face | Medium grey | #3A3A4A |
| Key labels | White | #FFFFFF |
| Prompt text | Pale blue | #A8C8E8 |
| Error state | Red flash | #FF4444 |
| Correct dial | Green flash | #44FF88 |

### Level 4 — The Witness (Night Street)
| Role | Color | Hex |
|---|---|---|
| Background | Deep navy | #0A0E1A |
| Streetlight wash | Amber yellow | #FFD166 |
| Dispatcher interface | Dark blue-grey | #1E2A3A |
| Text | Off-white | #E8E8E8 |
| Memory flash overlay | Warm white | #FFF8E7 |
| Reveal — wrong detail | Red highlight | #FF4444 |
| Reveal — correct detail | Green highlight | #44FF88 |

### Reveal Screen (All levels)
| Role | Color | Hex |
|---|---|---|
| Background | Near-white | #F5F5F5 |
| Text | Near-black | #1A1A1A |
| Escaped bias | Green | #2ECC71 |
| Caught bias | Red | #E74C3C |
| Bias name | Black, uppercase | #000000 |

### End Screen
| Role | Color | Hex |
|---|---|---|
| Background | Deep dark | #0D0D0D |
| Radar chart — strong | Bright green | #2ECC71 |
| Radar chart — weak | Red | #E74C3C |
| Profile name | Amber | #FFB347 |
| Body text | Off-white | #E8E8E8 |

---

## Animation Direction

- **Transitions between screens:** pixel wipe or hard cut — no smooth fades. Abrupt transitions increase tension.
- **Emergency Release button (Level 1):** slow pulse/glow, 1.5s cycle. Draws the eye passively.
- **Countdown timer:** no animation until last 5 seconds — then slight shake, color shift to red, pitch rises in sync.
- **Smoke fill (Level 1):** slow upward creep from screen bottom, 20% opacity fill.
- **Bias caught on reveal:** each bias card flips in one at a time, 0.3s delay between cards.
- **CRT flicker:** subtle, random — fires every 8–15 seconds for 1–2 frames. Not distracting, just present.
- **Screen shake:** on wrong decisions — short, sharp, 0.2s. Feedback without gore.
- **Social proof tag (Level 1):** flickers at 0.5s, disappears. Subconscious, not readable on first pass.

---

## Sound Design

### Direction
8-bit / chiptune. Short, punchy, characteristic. Every sound is functional — it communicates something. No ambient music during play. Sound only appears when it means something.

Reference games: Pokémon Red/Blue, Snake (Nokia), original Pac-Man, early arcade games.

### Sound Library (Freesound.org or generated via chiptune tools)

| Moment | Sound | Character |
|---|---|---|
| Game start | Short ascending 3-note chime | Bright, classic Gameboy boot feel |
| Level setup loads | Low single tone | Signals something is about to happen |
| Countdown tick | Single pixel click, repeating | Accelerates in the last 5 seconds |
| Last 5 seconds | Pitch-rising tick + screen shake | Urgency escalates |
| Wrong decision | Low buzz, 0.3s | Error, not death — just wrong |
| Right decision | Bright ascending blip | Small win, satisfying |
| Level fail | Descending 3-note phrase | Classic game over feel |
| Level succeed | Short ascending melody, 4 notes | Reward without fanfare |
| Reveal screen loads | Single soft tone, reverb | Quieter, more contemplative |
| Bias caught (reveal) | Low thud | You fell for it |
| Bias escaped (reveal) | Bright tick | You made it |
| End screen | Slow ambient chiptune loop | Reflective, not celebratory |
| Alarm (Level 1) | Repeating pixel alarm blip | Loops throughout level |
| Dispatcher voice (Level 3 & 4) | Filtered, slightly degraded audio | Sounds like a real call, not studio |
| Bomb timer (Level 2) | Metronome-style beep, accelerates | Classic countdown tension |

### Sound tools to generate / source
- **Bfxr** (bfxr.net) — browser-based chiptune sound effect generator
- **Freesound.org** — for filtered voice and ambient reference
- **Chiptone** (sfbgames.itch.io/chiptone) — more detailed chiptune sounds

---

## UI Components

| Component | Style |
|---|---|
| Buttons | Pixel border, flat fill, no border-radius. Active state = inverted colors. |
| Timers | Large pixel font, centered top. Color shifts as time drops. |
| Progress indicator | Pixel health-bar style across top of screen |
| Dialogue boxes | Classic RPG text box — dark fill, pixel border, text types out character by character |
| Reveal cards | White card on dark background, pixel border, flips in |
| Radar chart (end screen) | Pixel-rendered, no smooth curves — angular, grid-based |

---

## Screen Layout Principle

**Everything must read at a glance.** If a player needs more than 2 seconds to understand what they're looking at, simplify. The game creates cognitive load through *scenarios*, not through UI complexity.

Mobile-first layout. Assume the player is on a phone at the expo.
