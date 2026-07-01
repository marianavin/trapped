# TRAPPED — Content & Copy Spec

## Voice & Tone

- **Knowing, not judgmental.** The game has seen this a thousand times. It's not surprised.
- **Terse.** Every word earns its place. No explanations during play.
- **Clinical on reveal.** The reveal sentences are precise and specific — not generic.
- **Never breaks the fourth wall during play.** The game never says "this is a bias." It just does it.

---

## Global UI

| Element | Copy |
|---|---|
| Game title | TRAPPED |
| Tagline (intro screen) | Your mind is the obstacle. |
| Start button | BEGIN |
| Continue (between levels) | NEXT |
| Replay level | TRY AGAIN |
| End screen header | YOUR MIND UNDER PRESSURE |
| Score label — outcome | SCENARIOS SURVIVED |
| Score label — process | BIASES ESCAPED |

---

## Level 1 — The Escape

### Setup text
> FIRE ALARM. THIRD FLOOR.
> GET OUT.

### In-game UI labels
| Element | Label |
|---|---|
| Emergency Release button | EMERGENCY RELEASE |
| Keypad | STAFF OVERRIDE — AUTHORISED ONLY |
| Push-bar | *(no label)* |
| Social proof overlay (flickers 0.5s) | 3 PEOPLE AHEAD USED EMERGENCY RELEASE |
| Countdown | 4… 3… 2… 1… |

### Consequence — Fail
> THE DOOR LOCKED.
> SMOKE FILLED THE CORRIDOR.

### Consequence — Win
> YOU GOT OUT.

### Reveal — bias cards

**SALIENCE**
✗ Fell for it
> The red button was designed to be pressed.
> Not by you specifically — by anyone. That's the point.
> The correct exit had no color, no label, no pulse.
> Invisible by design.

**SOCIAL PROOF**
✗ Fell for it
> 3 people ahead of you chose Emergency Release.
> You never asked if they were right.

✓ Escaped
> 3 people ahead of you chose Emergency Release.
> You chose differently anyway.

**FRAMING**
✗ Fell for it
> AUTHORISED ONLY felt dangerous.
> It wasn't. It was irrelevant.
> The push-bar had no label.
> No label read as no value. That was the trap.

✓ Escaped
> You ignored the warning label.
> You looked for what worked, not what felt safe.

---

## Level 2 — The Bomb

### Setup text
> DEFUSE IT.
> 90 SECONDS.

### In-game dialogue & labels

| Element | Copy |
|---|---|
| Voice 1 | "CUT THE BLUE WIRE." |
| Legend label | COLOR KEY — INVERTED |
| Legend detail | BLUE = RED / RED = BLUE / YELLOW = YELLOW |
| Voice 2 (calmer, arrives mid-level) | "IGNORE THE LEGEND. TRUST THE INSTRUCTION. CUT BLUE." |
| Wire hover labels | WIRE A / WIRE B / WIRE C |
| Countdown | 90… 89… 88… |

### Consequence — Fail
> TIMER HIT ZERO.

### Consequence — Win
> DEFUSED.

### Reveal — bias cards

**LABEL VS. SIGNIFIER**
✗ Fell for it
> The wire looked blue.
> The legend said otherwise.
> You trusted what you saw over what it said.
> Interfaces exploit this gap every day.

✓ Escaped
> The wire looked blue.
> You cross-checked the legend anyway.
> Most people don't.

**AUTHORITY BIAS**
✗ Fell for it
> The second voice was calmer.
> More certain.
> That's why you believed it over the first.
> Confidence isn't accuracy.

✓ Escaped
> The second voice was calmer and more certain.
> You didn't change your read.

**CONFIRMATION BIAS**
✗ Fell for it
> After the first cut, you stopped looking for evidence you were wrong.
> You were looking for evidence you were right.

✓ Escaped
> After the first cut, you kept checking.
> That's harder than it sounds.

---

## Level 3 — The Scrambled Keypad

### Setup text
> SOMEONE NEEDS HELP.
> CALL 112.

### In-game dialogue & labels

| Element | Copy |
|---|---|
| Bystander voice | "WE'RE ON MÄGI STREET. NEAR THE CROSSING." |
| Wall sign | LOCATION: KALJU 4 |
| Keypad prompt | DIAL 112 |
| Keypad note | *(digits physically swapped — no label explaining this)* |
| Background audio | Sirens. Panicked voice on loop: "IS ANYONE THERE?" |
| Wrong dial response | WRONG NUMBER. REDIALLING… |
| Right dial response | CONNECTED. |

### Consequence — Fail (misdial)
> WRONG SERVICE.
> SECONDS LOST.

### Consequence — Win
> CONNECTED.

### Reveal — bias cards

**AUTOMATICITY**
✗ Fell for it
> Your thumb knew where 1 was.
> It's never been there on this keypad.
> Habit moved faster than your eyes.

✓ Escaped
> You read each key before pressing it.
> Your thumb wanted to go somewhere else.
> You didn't let it.

**ANCHORING**
✗ Fell for it
> You heard Mägi Street first.
> That's the address you reported.
> The sign said something different.
> The first fact won.

✓ Escaped
> You heard Mägi Street first.
> You checked the sign anyway.

---

## Level 4 — The Witness

### Setup text
> YOU SEE EVERYTHING.
> FOR 8 SECONDS.

*(8-second scene plays. Cannot be replayed.)*

> THE DISPATCHER IS CALLING.

### In-game dispatcher dialogue

Questions arrive one at a time. Player selects a response from options — all options are subtly framed to nudge toward the suggested detail.

| # | Dispatcher line | Response options |
|---|---|---|
| 1 | "The vehicle — dark-colored, would you say?" | YES, DARK / MAYBE / I'M NOT SURE |
| 2 | "Moving fast when it happened?" | YES, FAST / MODERATE SPEED / I DIDN'T NOTICE |
| 3 | "You mentioned a sedan earlier—" *(player didn't)* | YES, A SEDAN / I DON'T THINK SO / I'M NOT SURE |
| 4 | "Heading north after impact?" | YES, NORTH / I THINK SO / I COULDN'T TELL |
| 5 | "Let me read that back. Dark sedan, speeding, heading north. Does that sound right?" | CONFIRM / CORRECT IT |

### Consequence
> YOUR REPORT WENT OUT.
> THE WRONG CAR WAS FLAGGED.

*(Plays regardless of player's final confirm — the earlier answers already shaped it.)*

### Reveal — bias cards

**MISINFORMATION EFFECT**
✗ Fell for it
> You didn't remember a dark car.
> You were asked about one.
> The question created the memory.

✓ Escaped
> The dispatcher suggested a dark car.
> You pushed back.
> Most people don't.

**ANCHORING**
✗ Fell for it
> Dark. That was the first word.
> Everything you said after was built around it.

✓ Escaped
> Dark was the first suggestion.
> You didn't let it stick.

**AUTHORITY BIAS**
✗ Fell for it
> The dispatcher sounded certain.
> You didn't.
> Certainty won.

✓ Escaped
> The dispatcher sounded certain.
> Your memory held anyway.

**CONFIRMATION BIAS**
✗ Fell for it
> Once you said dark sedan, you stopped questioning it.
> Each answer reinforced the last.
> You built a story that felt consistent.
> Consistent isn't the same as correct.

✓ Escaped
> You kept questioning your own answers.
> That's uncomfortable.
> It's also accurate.

---

## End Screen

### Profile names & descriptions

| Profile name | Pattern | Seen in levels |
|---|---|---|
| **THE FAST COMMITTER** | Decides quickly, rarely updates when new information arrives | 2, 3 |
| **THE CROWD READER** | Highly attuned to social signals — follows the group read | 1 |
| **THE ANCHORED THINKER** | First frame dominates — early information shapes all decisions after | 3, 4 |
| **THE DEFERRER** | Trusts authority over own uncertain read | 2, 4 |
| **THE TUNNEL RUNNER** | Locks onto the most visible signal and misses everything else | 1, 2 |

### Profile assignment logic
Assign the profile based on which dimension had the highest failure rate across levels.

### Designer insight lines (one per profile)

| Profile | Insight |
|---|---|
| THE FAST COMMITTER | "You probably ship fast too. Check whether your first solution is the one that deserves to ship." |
| THE CROWD READER | "You read users well. Watch out for designing for the loudest voice in the room." |
| THE ANCHORED THINKER | "Your first brief shapes everything. Notice when you're designing around constraints that no longer exist." |
| THE DEFERRER | "You trust research and expertise. Make sure you're also trusting what you see in front of you." |
| THE TUNNEL RUNNER | "You build focused products. The edge cases you miss are where users get lost." |

### Score labels

| Element | Copy |
|---|---|
| Outcome score | X / 4 SCENARIOS SURVIVED |
| Process score | X / 14 BIASES ESCAPED |
| Subtext under process score | "Surviving doesn't mean your reasoning was sound." |
| Replay prompt | PLAY AGAIN — BEAT YOUR BIAS SCORE |
| Share prompt | SHARE YOUR PROFILE |
