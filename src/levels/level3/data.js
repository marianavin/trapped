// All copy below is lifted verbatim from TRAPPED_Content_Copy_Spec.md — Level 3.
// Do not paraphrase. If copy needs to change, change the spec first.

export const SETUP_TEXT = ['SOMEONE NEEDS HELP.', 'CALL 112.']

export const BYSTANDER_LINE = "WE'RE ON MÄGI STREET. NEAR THE CROSSING."
export const SIGN_TEXT = 'LOCATION: KALJU 4'
export const BYSTANDER_ADDRESS = 'MÄGI STREET'
export const SIGN_ADDRESS = 'KALJU 4'

export const KEYPAD_PROMPT = 'DIAL 112'
export const BG_VOICE_LOOP = 'IS ANYONE THERE?'
export const WRONG_DIAL_RESPONSE = 'WRONG NUMBER. REDIALLING…'
export const RIGHT_DIAL_RESPONSE = 'CONNECTED.'

export const CONSEQUENCE_FAIL = ['WRONG SERVICE.', 'SECONDS LOST.']
export const CONSEQUENCE_WIN = ['CONNECTED.']

export const TARGET_DIGITS = ['1', '1', '2']

// Standard phone-keypad digit positions, then the physically scrambled
// layout the player actually sees. 1 and 2 (the digits they need to dial)
// are moved off their muscle-memory spots so a habitual first tap misfires.
export const NORMAL_LAYOUT = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '']
export const SCRAMBLED_LAYOUT = ['7', '8', '3', '4', '5', '6', '1', '2', '9', '', '0', '']

export const MAX_MISTAKES = 4

export const BIAS_CARDS = {
  automaticity: {
    name: 'AUTOMATICITY',
    fell: [
      'Your thumb knew where 1 was.',
      "It's never been there on this keypad.",
      'Habit moved faster than your eyes.',
    ],
    escaped: [
      'You read each key before pressing it.',
      'Your thumb wanted to go somewhere else.',
      "You didn't let it.",
    ],
  },
  anchoring: {
    name: 'ANCHORING',
    fell: [
      'You heard Mägi Street first.',
      "That's the address you reported.",
      'The sign said something different.',
      'The first fact won.',
    ],
    escaped: ['You heard Mägi Street first.', 'You checked the sign anyway.'],
  },
}
