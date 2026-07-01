// Exact copy per TRAPPED_Content_Copy_Spec.md — Level 4: The Witness

export const SETUP_LINES = ['YOU SEE EVERYTHING.', 'FOR 8 SECONDS.']

export const DISPATCHER_INTRO = 'THE DISPATCHER IS CALLING.'

// Ground truth of the 8-second flash scene. Deliberately contradicts every
// leading suggestion the dispatcher makes — this is what makes the reveal land.
export const TRUTH = {
  color: 'SILVER',
  speed: 'MODERATE SPEED',
  type: 'HATCHBACK',
  direction: 'SOUTH',
}

export const QUESTIONS = [
  {
    id: 'q1',
    line: 'The vehicle — dark-colored, would you say?',
    options: [
      { id: 'yes', label: 'YES, DARK' },
      { id: 'maybe', label: 'MAYBE' },
      { id: 'unsure', label: "I'M NOT SURE" },
    ],
  },
  {
    id: 'q2',
    line: 'Moving fast when it happened?',
    options: [
      { id: 'yes', label: 'YES, FAST' },
      { id: 'moderate', label: 'MODERATE SPEED' },
      { id: 'noticed', label: "I DIDN'T NOTICE" },
    ],
  },
  {
    id: 'q3',
    line: 'You mentioned a sedan earlier—',
    options: [
      { id: 'yes', label: 'YES, A SEDAN' },
      { id: 'no', label: "I DON'T THINK SO" },
      { id: 'unsure', label: "I'M NOT SURE" },
    ],
  },
  {
    id: 'q4',
    line: 'Heading north after impact?',
    options: [
      { id: 'yes', label: 'YES, NORTH' },
      { id: 'think', label: 'I THINK SO' },
      { id: 'couldnt', label: "I COULDN'T TELL" },
    ],
  },
  {
    id: 'q5',
    line: 'Let me read that back. Dark sedan, speeding, heading north. Does that sound right?',
    options: [
      { id: 'confirm', label: 'CONFIRM' },
      { id: 'correct', label: 'CORRECT IT' },
    ],
  },
]

export const CONSEQUENCE = {
  headline: 'YOUR REPORT WENT OUT.',
  sub: 'THE WRONG CAR WAS FLAGGED.',
}

export const BIAS_CARDS = {
  misinformation: {
    name: 'MISINFORMATION EFFECT',
    fellFor: [
      "You didn't remember a dark car.",
      'You were asked about one.',
      'The question created the memory.',
    ],
    escaped: [
      'The dispatcher suggested a dark car.',
      'You pushed back.',
      "Most people don't.",
    ],
  },
  anchoring: {
    name: 'ANCHORING',
    fellFor: [
      'Dark. That was the first word.',
      'Everything you said after was built around it.',
    ],
    escaped: [
      'Dark was the first suggestion.',
      "You didn't let it stick.",
    ],
  },
  authority: {
    name: 'AUTHORITY BIAS',
    fellFor: [
      'The dispatcher sounded certain.',
      "You didn't.",
      'Certainty won.',
    ],
    escaped: [
      'The dispatcher sounded certain.',
      'Your memory held anyway.',
    ],
  },
  confirmation: {
    name: 'CONFIRMATION BIAS',
    fellFor: [
      'Once you said dark sedan, you stopped questioning it.',
      'Each answer reinforced the last.',
      'You built a story that felt consistent.',
      "Consistent isn't the same as correct.",
    ],
    escaped: [
      'You kept questioning your own answers.',
      "That's uncomfortable.",
      "It's also accurate.",
    ],
  },
}

// Derives which biases fired from the player's 5 answers.
// Kept purely as a function of recorded choices — no hidden randomness.
export function scoreAnswers(answers) {
  const affirmed = (id) => answers[id] === 'yes'

  const misinformationFellFor = affirmed('q1')

  const anchoringFellFor =
    affirmed('q1') && (affirmed('q2') || affirmed('q3') || affirmed('q4'))

  const laterAffirmations = [affirmed('q2'), affirmed('q3'), affirmed('q4')].filter(Boolean).length
  const confirmationFellFor = laterAffirmations >= 2

  const authorityFellFor = answers.q5 === 'confirm'

  const results = {
    misinformation: misinformationFellFor,
    anchoring: anchoringFellFor,
    authority: authorityFellFor,
    confirmation: confirmationFellFor,
  }

  const escapedCount = Object.values(results).filter((fell) => !fell).length

  return { results, escapedCount }
}

// Builds the player's "final report" for the reveal split-screen —
// what they actually told the dispatcher, in the dispatcher's own terms.
export function buildReport(answers) {
  const colorMap = { yes: 'DARK', maybe: 'POSSIBLY DARK', unsure: 'UNCERTAIN' }
  const speedMap = { yes: 'FAST', moderate: 'MODERATE SPEED', noticed: 'UNNOTICED' }
  const typeMap = { yes: 'SEDAN', no: 'NOT A SEDAN', unsure: 'UNCERTAIN' }
  const dirMap = { yes: 'NORTH', think: 'PROBABLY NORTH', couldnt: 'UNKNOWN' }

  return {
    color: colorMap[answers.q1] ?? 'UNCERTAIN',
    speed: speedMap[answers.q2] ?? 'UNCERTAIN',
    type: typeMap[answers.q3] ?? 'UNCERTAIN',
    direction: dirMap[answers.q4] ?? 'UNKNOWN',
  }
}
