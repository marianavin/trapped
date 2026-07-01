// Level 3 — The Scrambled Keypad.
// Four discrete trials, each engineered to trip a distinct bias, alternating
// PERCEPTION/MOTOR <-> MEMORY/REASONING so the player can't pattern-match
// "keypad = trick" too early.
//   1. The Hint           (P) — anchoring & recency (991 vs 911)
//   2. Fading Address     (M) — serial position (primacy/recency)
//   3. Mislabeled Key   (P) — Stroop-style interference
//   4. Loud Number      (M) — anchoring
//
// Ported from the reference "Mind Maze" build's Level 3 (same mechanics),
// restyled to this project's unified navy/cyan/magenta system rather than
// that build's separate neon-red palette — see tailwind.config.js's
// "glitchwave" comment for why every level shares one palette now.

export const SETUP_TEXT = ['SOMEONE NEEDS HELP.', 'STAY WITH THE VOICE.']

export const NORMAL_LAYOUT = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '']

// Task 1 pad — 6 and 9 swapped vs the reference artwork arrangement.
export const TRIAL_1_LAYOUT = ['3', '7', '2', '5', '4', '9', '1', '8', '6', '', '0', '']

export const TRIAL_3_REMIX_SEED = 73

export function swapSixAndNine(layout) {
  const next = [...layout]
  const i6 = next.indexOf('6')
  const i9 = next.indexOf('9')
  if (i6 >= 0 && i9 >= 0) [next[i6], next[i9]] = [next[i9], next[i6]]
  return next
}

// A physically shuffled 3x4 pad. Digits 0-9 present; two blanks preserved.
export function scrambledLayout(seed = 1) {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  // deterministic Fisher-Yates so tasks stay stable across renders
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[digits[i], digits[j]] = [digits[j], digits[i]]
  }
  const grid = [...digits.slice(0, 9)]
  grid.push('', digits[9], '')
  return swapSixAndNine(grid)
}

export const TASK_ORDER = ['automaticity', 'serialPosition', 'stroop', 'anchoring']

export const LEVEL_TIMER_S = 40
export const LEVEL_TIMER_MS = LEVEL_TIMER_S * 1000

export const BIAS_CARDS = {
  automaticity: {
    name: 'ANCHORING & RECENCY',
    subtitle: 'THE HINT',
    info:
      'Anchoring bias is the tendency to rely too heavily on a salient number shown on screen. The recency effect makes the most recently seen information feel more important than something you heard seconds earlier.',
    fell: [
      'The voice said 9-1-1.',
      'The bold hint said 991 — last on screen, impossible to ignore.',
      'Anchoring bias: the number right in front of you became the anchor a rushed player locked onto.',
      'Recency effect: under time pressure, the most recently seen detail outweighed what you heard seconds earlier.',
    ],
    escaped: [
      'You heard nine-one-one and dialled 911.',
      'The bold 991 hint did not override the spoken instruction.',
    ],
  },
  serialPosition: {
    name: 'SERIAL POSITION',
    subtitle: 'THE FADING ADDRESS',
    info:
      'The serial position effect is a memory bias where items at the start and end of a list are remembered better than those in the middle.',
    fell: [
      'You held the first chunk. You held the last.',
      'The middle blurred.',
      'The dialling in between ate your working memory.',
    ],
    escaped: ['You rehearsed the middle while your fingers moved.', 'Nothing slipped.'],
  },
  stroop: {
    name: 'STROOP INTERFERENCE',
    subtitle: 'THE MISLABELED KEY',
    info:
      'Stroop interference occurs when one feature of a stimulus (like a highlight) conflicts with another (the digit). The faster, more attention-grabbing cue often wins.',
    fell: [
      'The digit said one thing. The glow said another.',
      'You trusted the faster read.',
      'Confident. Wrong.',
    ],
    escaped: ['You read the numeral, not the glow.', 'The slower answer was the right one.'],
  },
  anchoring: {
    name: 'ANCHORING',
    subtitle: 'THE LOUD NUMBER',
    info:
      'Anchoring bias is the tendency to let an irrelevant number on screen influence what you dial, even when it has nothing to do with the task.',
    fell: [
      'A big number was on the screen.',
      'It had nothing to do with the call.',
      'It leaked into your dialling anyway.',
    ],
    escaped: ['You saw the loud number and let it pass.', 'Only what you heard made it through.'],
  },
}

// Consequence copy — outcome depends on how many of the 4 trials passed.
export const CONSEQUENCE_WIN = ['CONNECTED.', 'HELP IS ON THE WAY.']
export const CONSEQUENCE_PARTIAL = ['CONNECTED — BARELY.', 'DETAILS UNCLEAR.']
export const CONSEQUENCE_FAIL = ['WRONG NUMBER.', 'THE LINE WENT DEAD.']
