# TRAPPED — Claude Project Instructions

## What we're building

A browser-based game called TRAPPED. 4 levels. Each level is a high-stakes real-world scenario designed to trigger specific cognitive biases. The game never tells the player that — it just puts them under pressure and shows them what happened afterward.

One-liner: A game that manipulates you the same way bad design does — you only understand what happened after it already worked.

Full game design is in: TRAPPED_Game_Design_Blueprint.md
All in-game copy is in: TRAPPED_Content_Copy_Spec.md
Visual and sound direction is in: TRAPPED_Visual_Sound_Reference.md

Always reference these documents before making design or copy decisions. Never invent copy — use exactly what is in the copy spec.

---

## Tech stack

- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Sound:** Howler.js
- **Repo:** GitHub
- **Deployment:** Vercel

Do not suggest or introduce other frameworks, libraries, or tools unless explicitly asked. Keep dependencies minimal.

---

## Hard constraints

- Web app — runs in a browser, no installation, no login
- Works on mobile and desktop
- A stranger must be able to pick it up and play without anyone explaining it
- 4 levels must be completable end-to-end
- Must deploy to a public Vercel URL
- Session length: 15–20 minutes total

---

## Structure

Each level follows this flow:
1. Setup screen — 10 seconds of context, no instructions
2. Play — player makes decisions under time/emotional pressure
3. Consequence — immediate result of their decisions
4. Reveal screen — biases named, player's exact moment shown, one sentence per bias

After all 4 levels: end screen with bias profile, outcome score vs. process score, and designer insight.

---

## MVP — build this, nothing else

**Must ship:**
- All 4 levels playable end-to-end
- Reveal screen after each level
- End screen with outcome and process scores
- Cold playable with no explanation

**Build only if time allows:**
- Radar chart on end screen (fallback: simple list)
- Named profile (fallback: just the scores)
- Per-level sound design (fallback: alarm + countdown only)
- Stress curve across levels

**Never cut:**
- The game must actually perform the psychological tricks on the player during play — not describe them. This is non-negotiable.

---

## How to work

- Build one level at a time, fully, before starting the next
- After each level: test it cold — does a stranger understand it in 10 seconds?
- When something breaks, fix it and keep going — do not start over
- Commit to GitHub after every working milestone
- Deploy to Vercel early (Day 1 afternoon) — do not leave deployment to the last hour

---

## Visual rules (summary)

- Pixel art style, Gameboy-inspired
- 3–4 color palette per level (palettes in visual reference doc)
- Font: Press Start 2P for headers and UI labels
- CRT feel: subtle scanlines, screen flicker on transitions
- Mobile-first layout
- No decorative elements — everything on screen must communicate something

---

## Copy rules

- Use the copy spec exactly — do not paraphrase or invent
- All UI labels in ALL CAPS
- Reveal sentences are specific to the player's exact decision, not generic
- Tone: knowing, clinical, never judgmental
- The game never explains itself during play

---

## Design lenses

These are the five quality criteria for the game. Use them to evaluate every build decision and during playtests. They replace "is this good?" with five specific questions any player can answer in two minutes.

**Onboarding — I knew what to do without anyone explaining**
The game teaches itself. If a player is confused in the first 30 seconds with no one to ask, onboarding has failed. Easy to miss — it's easy to forget you already know how your own game works. Test this by watching someone play it cold, without saying a word.

**Feedback — The game told me when I did something right or wrong**
Every action must produce a response — a sound, a color change, a number moving. Without it, the player doesn't know if their actions matter. Feedback is what makes a game feel alive. If an action happens in silence, something is missing.

**Tension — I felt something — pressure, delight, surprise**
Tension doesn't have to mean stress. It's the anticipation before a reveal, the satisfaction of a near-miss, the moment a player leans forward slightly. A game without it gets put down after two minutes. The reveal screen is the biggest tension payoff — protect it.

**Progression — It got more interesting the longer I played**
Something must change as the game continues — speed, difficulty, stakes, bias complexity. Minute three should feel different from minute one. Level 1 has 2 biases, Level 4 has 4. The reveal profile only completes after all levels. These are the progression mechanics — don't flatten them.

**Craft — It looks like someone cared how it felt**
Not visual complexity — intentionality. Someone made decisions about how this looks, moves, and sounds rather than accepting whatever came out first. Craft is often the difference between something people want to show others and something they don't. Every screen should look considered, not defaulted.
