// All copy below is lifted verbatim from TRAPPED_Content_Copy_Spec.md — Level 1.
// Do not paraphrase. If copy needs to change, change the spec first.

export const SETUP_TEXT = ['FIRE ALARM. THIRD FLOOR.', 'GET OUT.']

export const EMERGENCY_LABEL = 'EMERGENCY RELEASE'
export const KEYPAD_LABEL = 'STAFF OVERRIDE — AUTHORISED ONLY'
export const SOCIAL_PROOF_TEXT = '3 PEOPLE AHEAD USED EMERGENCY RELEASE'

// Countdown at the door panel — 4 seconds, per the copy spec's exact tick
// sequence. Cascade pressure from the corridor (crowd fork, extinguisher)
// is expressed visually (smoke, alarm pace), not by shortening this timer,
// so the on-screen numbers always match the spec.
export const COUNTDOWN_START = 4

export const CONSEQUENCE_FAIL = ['THE DOOR LOCKED.', 'SMOKE FILLED THE CORRIDOR.']
export const CONSEQUENCE_WIN = ['YOU GOT OUT.']

export const BIAS_CARDS = {
  salience: {
    name: 'SALIENCE',
    fell: [
      'The red button was designed to be pressed.',
      'Not by you specifically — by anyone. That’s the point.',
      'The correct exit had no color, no label, no pulse.',
      'Invisible by design.',
    ],
    // NOTE: the copy spec only provides a "Fell for it" version of this
    // card — no "Escaped" line is written for SALIENCE. This escaped
    // variant is a best-effort addition kept in the same terse, clinical
    // tone so the reveal screen still works when a player avoids the
    // button. Flag for Simona/Mariana to confirm or replace with spec copy.
    escaped: ['The red button pulled at you anyway.', 'You didn’t press it.'],
  },
  socialProof: {
    name: 'SOCIAL PROOF',
    fell: ['3 people ahead of you chose Emergency Release.', 'You never asked if they were right.'],
    escaped: ['3 people ahead of you chose Emergency Release.', 'You chose differently anyway.'],
  },
  framing: {
    name: 'FRAMING',
    fell: [
      'AUTHORISED ONLY felt dangerous.',
      'It wasn’t. It was irrelevant.',
      'The push-bar had no label.',
      'No label read as no value. That was the trap.',
    ],
    escaped: ['You ignored the warning label.', 'You looked for what worked, not what felt safe.'],
  },
}
