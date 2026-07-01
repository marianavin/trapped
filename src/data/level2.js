// Exact copy per TRAPPED_Content_Copy_Spec.md — Level 2: The Bomb

export const SETUP_LINES = ['DEFUSE IT.', '90 SECONDS.']

export const TIMER_SECONDS = 90

export const VOICE_1_LINE = 'CUT THE BLUE WIRE.'

export const LEGEND_LABEL = 'COLOR KEY — INVERTED'
export const LEGEND_ROWS = ['BLUE = RED', 'RED = BLUE', 'YELLOW = YELLOW']

export const VOICE_2_LINE = 'IGNORE THE LEGEND. TRUST THE INSTRUCTION. CUT BLUE.'

export const RECHECK_PROMPT = "TIME'S ALMOST UP."

// Three physical wires. Positions are shuffled per playthrough (see Play.jsx)
// but the id -> color -> meaning mapping below never changes.
export const WIRES = [
  { id: 'blue', label: 'WIRE A', color: '#3B82F6' },
  { id: 'red', label: 'WIRE B', color: '#DC2626' },
  { id: 'yellow', label: 'WIRE C', color: '#EAB308' },
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
