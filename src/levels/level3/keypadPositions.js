// Coordinate map for overlaying live, tappable hit-zones on top of the
// static phone-mockup artwork (public/phone-frame.png), once that asset is
// dropped in. Until then PhoneFrame.jsx falls back to a CSS-drawn chassis
// automatically, so the game runs either way.
//
// BAKED_LAYOUT is the digit already painted into that artwork at each of
// the 12 grid cells (reading order, left-to-right / top-to-bottom):
//   3 7 2
//   5 4 9
//   1 8 6
//     0
// This happens to be the exact scrambled arrangement Task 1 ("The Swap")
// needs, so that trial renders with zero overlay — the artwork IS the
// trick. Every other trial needs a different digit at some cells, so the
// Keypad component paints a small relabel badge over just those cells,
// leaving the rest of the artwork untouched.
//
// CIRCLE_POSITIONS are percentages of the rendered image's own width/height
// (not the viewport), so they scale correctly at any screen size. These
// were estimated by eye from the reference image and may need a small
// nudge once the real file is in place and visually checked — isolated
// here for exactly that reason.
export const PHONE_IMAGE_SRC = '/phone-frame.png'

export const BAKED_LAYOUT = ['3', '7', '2', '5', '4', '9', '1', '8', '6', '', '0', '']

export const CIRCLE_SIZE_PCT = 14

export const CIRCLE_POSITIONS = [
  { x: 32, y: 35.5 }, // 3
  { x: 50, y: 35.5 }, // 7
  { x: 68, y: 35.5 }, // 2
  { x: 32, y: 45.5 }, // 5
  { x: 50, y: 45.5 }, // 1
  { x: 68, y: 45.5 }, // 6
  { x: 32, y: 55.5 }, // 4
  { x: 50, y: 55.5 }, // 8
  { x: 68, y: 55.5 }, // 9
  { x: 32, y: 65.5 }, // (blank)
  { x: 50, y: 65.5 }, // 0
  { x: 68, y: 65.5 }, // (blank)
]

// Roughly where the dialled-digits display sits above the pad, for
// overlaying the live "•••" progress text on the artwork's blank readout.
export const DISPLAY_POSITION = { x: 50, y: 21 }
export const STATUS_RIGHT_POSITION = { x: 82, y: 6.5 }
