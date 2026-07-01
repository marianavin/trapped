// Level 3 — The Scrambled Keypad.
// Four discrete trials, each engineered to trip a distinct bias, alternating
// PERCEPTION/MOTOR <-> MEMORY/REASONING so the player can't pattern-match
// "keypad = trick" too early.
//   1. Swap             (P) — automaticity / capture error
//   2. Fading Address   (M) — serial position (primacy/recency)
//   3. Mislabeled Key   (P) — Stroop-style interference
//   4. Loud Number      (M) — anchoring
//
// Ported from the reference "Mind Maze" build's Level 3 (same mechanics),
// restyled to this project's unified navy/cyan/magenta system rather than
// that build's separate neon-red palette — see tailwind.config.js's
// "glitchwave" comment for why every level shares one palette now.

export const SETUP_TEXT = ['SOMEONE NEEDS HELP.', 'STAY WITH THE VOICE.']

export const NORMAL_LAYOUT = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '']

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
  return grid
}

export const TASK_ORDER = ['automaticity', 'serialPosition', 'stroop', 'anchoring']

export const BIAS_CARDS = {
  automaticity: {
    name: 'AUTOMATICITY',
    subtitle: 'THE SWAP',
    fell: [
      'The voice said 9-1-1.',
      'Your thumb went where 9-1-1 lives on every phone.',
      'The keys were somewhere else.',
      'Habit moved faster than your eyes.',
    ],
    escaped: [
      'You read each key before pressing it.',
      'Your thumb wanted the shortcut. You refused.',
    ],
  },
  serialPosition: {
    name: 'SERIAL POSITION',
    subtitle: 'THE FADING ADDRESS',
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
