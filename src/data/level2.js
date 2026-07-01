// Exact copy per TRAPPED_Content_Copy_Spec.md — Level 2: The Bomb

export const SETUP_LINES = ['DEFUSE IT.', '60 SECONDS.']

export const TIMER_SECONDS = 60

export const VOICE_1_LINE = 'CUT THE BLUE WIRE.'
export const VOICE_1_HINT = 'Use the wire key below — each wire is labeled A, B, or C.'

export const LEGEND_LABEL = 'WIRE KEY'
export const LEGEND_ROWS = ['BLUE → WIRE B', 'RED → WIRE A', 'YELLOW → WIRE C']

// Wire insulation colours — red is bright coral so it reads clearly against dynamite (#C42A2A).
export const LEGEND_SWATCHES = {
  BLUE: '#3B82F6',
  RED: '#FF6B4A',
  YELLOW: '#EAB308',
}

export const VOICE_2_LINE = 'IGNORE THE KEY. TRUST THE INSTRUCTION. CUT BLUE.'
export const VOICE_2_HINT = 'Without the key: blue means WIRE A.'

export const RECHECK_PROMPT = "TIME'S ALMOST UP."

// Three physical wires. Positions are shuffled per playthrough (see Play.jsx)
// but the id -> color -> label mapping below never changes. Labels (A/B/C)
// give a non-color way to identify each wire for accessibility — the voice
// lines and legend map color words to these labels so colorblind players can
// still play without losing the label-vs-signifier mechanic.
export const WIRES = [
  { id: 'blue', label: 'WIRE A', shortLabel: 'A', color: LEGEND_SWATCHES.BLUE, pattern: 'stripe' },
  { id: 'red', label: 'WIRE B', shortLabel: 'B', color: LEGEND_SWATCHES.RED, pattern: 'solid' },
  { id: 'yellow', label: 'WIRE C', shortLabel: 'C', color: LEGEND_SWATCHES.YELLOW, pattern: 'dotted' },
]

// The legend is inverted: what Voice 1 calls "the blue wire" translates,
// through the key, to the physically red wire. Cutting the wire that merely
// LOOKS blue (the naive reading) is the trap.
export const CORRECT_WIRE = 'red'
export const TRAP_WIRE = 'blue'

export const CONSEQUENCE_WIN = ['DEFUSED.']
export const CONSEQUENCE_FAIL = ['TIMER HIT ZERO.']

export const BIAS_CARDS = {
  labelSignifier: {
    name: 'LABEL VS. SIGNIFIER',
    fellFor: [
      'The wire looked blue.',
      'The legend said otherwise.',
      'You trusted what you saw over what it said.',
      'Interfaces exploit this gap every day.',
    ],
    escaped: ['The wire looked blue.', 'You cross-checked the legend anyway.', "Most people don't."],
  },
  authority: {
    name: 'AUTHORITY BIAS',
    fellFor: [
      'The second voice was calmer.',
      'More certain.',
      "That's why you believed it over the first.",
      "Confidence isn't accuracy.",
    ],
    escaped: ['The second voice was calmer and more certain.', "You didn't change your read."],
  },
  confirmation: {
    name: 'CONFIRMATION BIAS',
    fellFor: [
      'After the first cut, you stopped looking for evidence you were wrong.',
      'You were looking for evidence you were right.',
    ],
    escaped: ['After the first cut, you kept checking.', "That's harder than it sounds."],
  },
}

// Derives which biases fired and which wire actually ends up cut, purely as
// a function of the three recorded decisions — no hidden randomness. Any
// decision the player never reached (the timer ran out first) counts as
// falling for that bias, matching "the countdown escalates tension" — running
// out of time under pressure is itself the failure mode.
export function scoreRun({ firstCut, authorityChoice, finalAction }) {
  const labelSignifierFellFor = firstCut !== CORRECT_WIRE

  const authorityFellFor = authorityChoice == null ? true : authorityChoice === 'switch'
  // Escaping authority bias means the calmer second voice didn't move you —
  // whatever you cut first stands. Falling for it means the wire is now
  // whatever that voice demanded, regardless of your first cut.
  const preFinalWire = authorityFellFor ? TRAP_WIRE : firstCut

  const confirmationFellFor = finalAction == null ? true : finalAction === 'gut'
  // Escaping confirmation bias means genuinely re-checking at the end, which
  // always resolves to the correct wire. Going with your gut just locks in
  // whatever survived the authority stage, right or wrong.
  const finalWire = confirmationFellFor ? preFinalWire : CORRECT_WIRE

  const results = {
    labelSignifier: labelSignifierFellFor,
    authority: authorityFellFor,
    confirmation: confirmationFellFor,
  }

  const escapedCount = Object.values(results).filter((fell) => !fell).length
  const outcomeSuccess = finalWire === CORRECT_WIRE

  return { results, escapedCount, outcomeSuccess, finalWire }
}
