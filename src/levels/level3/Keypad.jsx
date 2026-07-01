import { motion } from 'framer-motion'
import { CIRCLE_POSITIONS, CIRCLE_SIZE_PCT, BAKED_LAYOUT } from './keypadPositions.js'

// Shared 3x4 keypad. `layout` is a length-12 array of digit strings; empty
// strings render as blank cells. `overrides` lets a task style individual
// keys (Stroop paints a key "hot" in the danger accent, etc.) without every
// task re-implementing the pad.
//
//   overrides = { [index]: { className, digit, style } }
//
// `active` disables input when false. `pressedIndex` briefly highlights a
// key so the player gets tactile feedback. `imageMode` is injected by
// PhoneFrame — true when the real phone-frame.png loaded, in which case
// keys are transparent hit-zones over the artwork (with a small opaque
// relabel badge only where this task's digit differs from what's painted
// on the image), false when falling back to a CSS-drawn pad.
export default function Keypad({
  layout,
  onPress,
  active = true,
  overrides = {},
  pressedIndex = null,
  size = 'md',
  imageMode = false,
}) {
  if (imageMode) {
    return (
      <>
        {layout.map((digit, i) => {
          if (digit === '') return null
          const o = overrides[i] || {}
          const label = o.digit ?? digit
          const pressed = pressedIndex === i
          const needsRelabel = label !== BAKED_LAYOUT[i]
          const pos = CIRCLE_POSITIONS[i]
          return (
            <motion.button
              key={i}
              type="button"
              disabled={!active}
              onClick={() => active && onPress(label, i)}
              whileTap={{ scale: 0.9 }}
              animate={pressed ? { scale: [1, 1.15, 1] } : { scale: 1 }}
              transition={{ duration: 0.15 }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${
                active ? '' : 'opacity-50'
              } ${o.className || ''}`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: `${CIRCLE_SIZE_PCT}%`,
                paddingBottom: `${CIRCLE_SIZE_PCT}%`,
                // borderColor as an inline style (not a border-* utility) so
                // a task's override always wins unambiguously over this
                // default, instead of depending on Tailwind's generated
                // stylesheet order between two same-specificity utilities.
                borderColor: 'transparent',
                ...o.style,
              }}
            >
              {needsRelabel && (
                <span
                  className="absolute inset-[8%] rounded-full flex items-center justify-center font-pixel text-sm sm:text-base text-l3-prompt"
                  style={{ background: 'rgba(18,19,43,0.92)' }}
                >
                  {label}
                </span>
              )}
            </motion.button>
          )
        })}
      </>
    )
  }

  const cell =
    size === 'sm'
      ? 'h-14 w-14 text-lg'
      : size === 'lg'
        ? 'h-20 w-20 text-3xl'
        : 'h-16 w-16 text-2xl sm:h-20 sm:w-20 sm:text-3xl'

  return (
    <div className="grid grid-cols-3 gap-2 select-none">
      {layout.map((digit, i) => {
        const o = overrides[i] || {}
        const label = o.digit ?? digit
        if (label === '') return <div key={i} className={cell} />
        const pressed = pressedIndex === i
        return (
          <motion.button
            key={i}
            type="button"
            disabled={!active}
            onClick={() => active && onPress(label, i)}
            whileTap={{ scale: 0.92 }}
            animate={pressed ? { scale: [1, 1.1, 1] } : { scale: 1 }}
            transition={{ duration: 0.15 }}
            className={[
              cell,
              'font-pixel rounded-full border-2 border-l3-face bg-l3-face text-white',
              'flex items-center justify-center transition-colors duration-75',
              active ? 'active:bg-white active:text-black' : 'opacity-60',
              o.className || '',
            ].join(' ')}
            style={o.style}
          >
            {label}
          </motion.button>
        )
      })}
    </div>
  )
}
