# TRAPPED — Game Design Blueprint

## Concept

A browser-based game where every level is a high-stakes real-world scenario designed to trigger a specific set of cognitive biases. The game never tells you that. It just puts you under pressure, lets you make decisions, and shows you what happened afterward.

The player only understands what went wrong after it already worked on them. That's the lesson.

**Topic:** Cognitive biases — how the mind shortcuts under pressure, and where those shortcuts fail.
**One-liner:** A game that manipulates you the same way bad design does — you only understand what happened after it already worked.
**Session length:** 15–20 minutes total (4 levels × 2–3 minutes + reveal screens).

---

## Core Loop

> Setup → Play → Consequence → Reveal → Next level

1. **Setup** — 10 seconds of context. Just enough to act. No tutorials, no instructions.
2. **Play** — player makes a sequence of micro-decisions under time pressure and emotional load.
3. **Consequence** — something happens as a direct result of the player's decisions. The outcome is immediate and clear.
4. **Reveal** — the game pauses. Each bias that fired is named, the exact decision moment is shown, and a one-sentence explanation is given. Tone is knowing, not judgmental.
5. **Score** — outcome (did you succeed?) and process (how many biases caught you?) are tracked separately.

---

## Key Design Principles

- **The game never explains itself during play.** No labels, no hints, no tutorial text. The scenario teaches through consequence.
- **Stress is the mechanism.** Cognitive biases fire hardest under time pressure and emotional load. Every level is designed to create both.
- **Outcome ≠ process.** A player can succeed a level having fallen for every bias, or fail it with clean reasoning. Both are possible. The game makes this visible.
- **The reveal is the emotional payoff.** It should feel like being caught, not like being taught. Specific, not generic. "You saw €120 first. That number had no meaning. But it made €49 feel like a rescue."
- **Cold playability.** A stranger must be able to pick it up and understand it within 10 seconds, with no one explaining it.

---

## Mechanics

### Decision-making
Players make a sequence of micro-decisions, not one big choice. Decisions are embedded in the scenario — reading information, navigating a space, responding to a prompt. They feel like natural reactions, not quiz questions.

### Time & urgency
Each level uses urgency differently:
- **Hard timer** — visible countdown, escalating audio, screen degradation as time runs out
- **Cascade pressure** — wrong decisions don't end the level; they create new problems with less time
- **Emotional pressure** — no countdown, but pace and stakes create urgency (dispatcher speaking fast, situation worsening visibly)

### The reveal screen
After each level consequence:
- Each bias is named
- The exact decision moment where it fired is highlighted
- ✓ Escaped / ✗ Fell for it
- One sentence explaining the mechanism
- Outcome score and process score shown separately

### Bias scoring dimensions
Individual biases are grouped into 5 cognitive dimensions tracked across all levels:

| Dimension | What it measures |
|---|---|
| **First impression grip** | How much the first piece of information dominates everything after |
| **Social pull** | How much others' behavior overrides your own read |
| **Risk perception** | How framing changes your assessment of the same danger |
| **Attention focus** | Whether you narrow in on one thing and miss the full picture |
| **Commitment under doubt** | Whether you stick with a bad path when evidence changes |

### End screen
After all 4 levels:
- **Radar chart** across the 5 dimensions — strongest and weakest at a glance
- **Named profile** — a single headline capturing the player's cognitive pattern (e.g. "The Fast Committer", "The Crowd Reader", "The Anchored Analyst")
- **Outcome vs. process score** side by side
- **Stress curve** — bias resistance plotted across levels 1–4
- **One designer insight** — bridges the personal result to professional practice (e.g. "You're strongly affected by framing effects — which means you may be using them on your users without realising it.")
- Designed to be shareable as a screenshot

---

## Levels

---

### Level 1: The Escape — Door Panels

**Premise:** Fire alarm. Smoke rising. You're navigating out of a building and reach an exit door with a panel of buttons. You have seconds to choose the right one.

**Biases embedded (3):**
1. **Salience / Tunnel Vision** — the "EMERGENCY RELEASE" button is large, red, pulsing, and centered in the player's natural eye-line. The correct push-bar is small, grey, and at screen edge. The eye is drawn before the brain reads anything.
2. **Social Proof** — a flicker overlay appears briefly: "3 people ahead of you used the Emergency Release." Never true, but it nudges the same way a "12 people viewing this room" banner does. Easy to miss, registers subconsciously.
3. **Framing** — the keypad is labeled "STAFF OVERRIDE — AUTHORIZED ONLY," framing it as forbidden even though it's irrelevant here. The push-bar has no label — absence of framing reads as absence of correctness, which is itself a trap.

**How it works:**
- The level is a multi-room escape with 3 decision points before the panel
- **Corridor fork:** crowd goes right, empty path goes left. The crowd is wrong, the empty route is faster. *(Social proof)*
- **Mid-corridor:** a fire extinguisher on the floor. Pick it up and lose 5 seconds, or leave it. It's never needed — the pull to grab it is loss aversion bait.
- **The door panel:** three elements render in scan order — Emergency Release (large, pulsing, left), Keypad ("authorized only", center), Push-bar (small, unlabeled, right). Social proof tag flickers for 0.5s near Emergency Release. 4-second countdown begins.
- **Consequence:** most players hit Emergency Release → door locks, smoke fills screen, soft fail cue.

**Urgency type:** Hard timer (4 seconds at panel) + cascade pressure through corridors.
**Duration:** ~2.5 minutes

---

### Level 2: The Bomb — Coloured Wires

**Premise:** A countdown timer. Three wires. A written instruction and a color legend that don't agree. You have to cut the right wire — but "right" depends on which signal you trust.

**Biases embedded (3):**
1. **Label vs. signifier conflict** — the wire physically colored red is wired to detonate. The wire colored blue is labeled "red" in the legend. People default to trusting either the word or the color, rarely cross-checking both — the same failure as a button that says "Cancel" but is styled green and positioned where "Confirm" usually sits.
2. **Authority bias** — midway through, a second voice contradicts the first with a calmer, more authoritative tone. Whose instruction do you follow?
3. **Confirmation bias** — after the first cut, a new instruction arrives that may contradict the legend. Players search for evidence their first cut was correct rather than updating their model.

**How it works:**
- Multi-stage defusal sequence, not a single wire cut
- **Stage 1:** Voice says "cut the blue wire." The physically blue-looking wire is labeled red in the legend. Legend is small, arrives a beat after the player's first instinct forms.
- **Stage 2:** First cut done. New instruction appears — "the legend is inverted." Doubt sets in. Did the first cut work?
- **Stage 3:** A second, calmer voice contradicts the first. Player must choose which authority to trust.
- **Stage 4:** Final cut under maximum time pressure.
- **Consequence:** detonation or defusal depending on whether the player cross-referenced legend and label, and which voice they trusted.

**Urgency type:** Hard countdown timer visible throughout.
**Duration:** ~2.5 minutes

---

### Level 3: Dialling Emergency — Scrambled Keypad

**Premise:** Someone needs help. You need to call emergency services fast — but the keypad's digits have been physically swapped, and your muscle memory wants to hit where the numbers normally live, not where they actually are.

**Biases embedded (2):**
1. **Automaticity vs. deliberate attention** — spatial/muscle memory overrides literal reading under stress. The same trap as when a redesigned app moves "delete" to where "save" used to be, and experienced users misclick out of habit.
2. **Anchoring / information primacy** — before dialling, you're given conflicting information about the address and what happened. The first version you hear anchors all subsequent estimates, even when corrected.

**How it works:**
- **Act 1 — information gathering:** A panicked bystander gives you one address, a sign on the wall says another. You must decide what number to call (fire? ambulance? police?) based on incomplete, conflicting information delivered in a specific order designed to anchor the first detail.
- **Act 2 — the dial:** scrambled keypad renders. Digits are physically swapped. A calm voice or on-screen prompt says "press 1, then 1, then 2" — but muscle memory fires for the positions where those numbers normally sit.
- **Consequence:** misdial or correct dial. Emotional cost of getting it wrong is clear — a voice on the line that isn't the right service, or silence.

**Urgency type:** Emotional pressure — sirens in background, panicked voiceover repeating "is anyone there?" No hard timer, but the pressure is real.
**Duration:** ~2.5 minutes

---

### Level 4: The Witness

**Premise:** You witness a hit-and-run. A dispatcher calls immediately and walks you through what happened — but their questions are leading, and by the end your report describes what you were guided to say, not what you actually saw.

**Biases embedded (4):**
1. **Misinformation effect** — leading questions implant details the player never observed ("was the car moving fast?" creates a memory of speed even if none was clocked)
2. **Anchoring** — the first detail suggested by the dispatcher dominates everything after ("dark-colored vehicle?" — all subsequent estimates are built around dark)
3. **Authority bias** — the dispatcher sounds official and certain, making their framing feel more reliable than the player's own uncertain memory
4. **Confirmation bias** — once the player agrees to one detail, subsequent answers bend toward consistency with it, even when they shouldn't

**How it works:**
- **The flash:** an 8-second scene plays — a car, a person, a street. Fast, realistic, imperfect. It cannot be replayed.
- **The call:** dispatcher calls immediately. Questions arrive one at a time, faster than comfortable. Each is subtly leading: "The vehicle — it was moving quickly, yes?" / "You mentioned a dark car earlier" (the player didn't) / "Was anyone else around?"
- **The confirmation:** dispatcher reads back a summary and asks the player to confirm. It is partly wrong.
- **Consequence:** the report goes out. The wrong car gets flagged. The right one doesn't.

**Urgency type:** Emotional pressure — dispatcher's pace and expectant silence. No countdown.
**Duration:** ~2–3 minutes

**Reveal:** Split screen. Left: original 8-second scene replayed. Right: the player's final report. Differences highlighted in red. *"You didn't see a dark car. You agreed to one."*

---

## Design Lenses

These are the five quality criteria the game is evaluated against:

| Lens | How the game addresses it |
|---|---|
| **Onboarding** — I knew what to do without anyone explaining | The first action in Level 1 teaches the mechanic by doing it. No instructions. A stranger picks it up in 10 seconds. |
| **Feedback** — The game told me when I did something right or wrong | Immediate consequence after every decision. Reveal screen after every level. Outcome and process scores always visible. |
| **Tension** — I felt something — pressure, delight, surprise | The game uses the psychological tricks on the player for real — the fake timer creates real anxiety, the leading questions create genuine doubt. The reveal is the surprise. |
| **Progression** — It got more interesting the longer I played | Levels escalate: 2 biases → 3 → 3 → 4. Bias types diversify. End profile only completes after all 4 levels, giving reason to finish. |
| **Craft** — It looks like someone cared how it felt | Each level has a distinct visual palette and sound design. Reveal screens are designed, not dumped. The end profile is built to be screenshotted and shared. |

---

## Visual & Tone Direction

- **Art style:** minimal, slightly clinical — not pixel art, not cartoon. Functional UI aesthetic that mirrors the environments being referenced (emergency panels, bomb defusal screens, phone keypads, dispatcher interfaces).
- **Color:** each level has its own palette. Level 1 warm amber/red (fire), Level 2 cold green/black (bomb panel), Level 3 grey/white (payphone, damaged panel), Level 4 blue/grey (dispatcher, night street).
- **Sound:** ambient tension per level. Alarm, countdown ticks, dispatcher voice, street ambience. Audio escalates with urgency.
- **Reveal screens:** calm, quiet contrast to the chaos of play. White space, clear typography, the bias name as the headline.
- **Tone of voice:** knowing, not judgmental. The voice of someone who has seen this a thousand times and finds it quietly fascinating.

---

## Technical Constraints

- Web app — runs in a browser, no installation
- Works on any device (desktop + mobile)
- Single public URL, playable cold by a stranger
- Built with AI tools (Lovable / Cursor / Claude Code)
- Must be deployed by end of Day 2

---

## Scope & MVP

**Must have:**
- All 4 levels playable end-to-end
- Reveal screen after each level (bias name + your moment + one sentence)
- End screen with outcome vs. process score
- Cold playable — no explanation needed

**Cut if running out of time:**
- Radar chart (replace with simple list)
- Named profile
- Stress curve
- Per-level sound design (keep ambient tension only)

**Never cut:**
- The game must actually do the psychological tricks to the player during play — not describe them. That is the entire point.
