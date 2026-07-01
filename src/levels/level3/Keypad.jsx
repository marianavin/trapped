import { motion } from 'framer-motion'
import { CIRCLE_POSITIONS, CIRCLE_SIZE_PCT, BAKED_LAYOUT } from './keypadPositions.js'
import { PHONE } from './phoneTheme.js'

const KEY_BTN =
  'font-pixel rounded-full border-2 flex items-center justify-center transition-all duration-200 shadow-none ' +
  'hover:border-[#FF9A3C] hover:text-[#FFF5E0] hover:bg-[rgba(255,120,40,0.15)] ' +
  'hover:shadow-[0_0_6px_#FF9A3C,0_0_14px_#FF9A3C88,inset_0_0_10px_rgba(255,120,40,0.18)] ' +
  'active:border-[#FF9A3C] active:text-[#FFF5E0] active:bg-[rgba(255,120,40,0.2)] ' +
  'active:shadow-[0_0_8px_#FF9A3C,0_0_18px_#FF9A3C,inset_0_0_12px_rgba(255,120,40,0.25)]'

function keyStyle(pressed) {
  if (pressed) {
    return {
      borderColor: PHONE.keypadRingHover,
      color: PHONE.keypadTextHover,
      background: PHONE.keypadFillHover,
      boxShadow: PHONE.keypadGlowHover.replace('0.18)', '0.25)'),
    }
  }
  return {
    borderColor: PHONE.keypadRingNeutral,
    color: PHONE.keypadTextNeutral,
    background: PHONE.keypadFillNeutral,
    boxShadow: 'none',
  }
}

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
              animate={pressed ? { scale: [1, 1.12, 1] } : { scale: 1 }}
              transition={{ duration: 0.15 }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 ${KEY_BTN} ${
                active ? '' : 'opacity-50 pointer-events-none'
              } ${o.className || ''}`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: `${CIRCLE_SIZE_PCT}%`,
                paddingBottom: `${CIRCLE_SIZE_PCT}%`,
                ...keyStyle(pressed),
                ...o.style,
              }}
            >
              {needsRelabel && (
                <span className="absolute inset-[8%] rounded-full flex items-center justify-center font-pixel text-sm sm:text-base">
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
      ? 'h-[2.8rem] w-[2.8rem] text-base'
      : size === 'lg'
        ? 'h-16 w-16 text-2xl'
        : 'h-[3.4rem] w-[3.4rem] text-lg sm:h-[3.8rem] sm:w-[3.8rem] sm:text-xl'

  return (
    <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 justify-items-center select-none mx-auto w-fit">
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
            whileTap={{ scale: 0.94 }}
            animate={pressed ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ duration: 0.15 }}
            className={[cell, KEY_BTN, active ? '' : 'opacity-50', o.className || ''].join(' ')}
            style={{ ...keyStyle(pressed), ...o.style }}
          >
            {label}
          </motion.button>
        )
      })}
    </div>
  )
}
