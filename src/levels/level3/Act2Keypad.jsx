import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  SCRAMBLED_LAYOUT,
  TARGET_DIGITS,
  KEYPAD_PROMPT,
  BG_VOICE_LOOP,
  WRONG_DIAL_RESPONSE,
  RIGHT_DIAL_RESPONSE,
  MAX_MISTAKES,
} from './data.js'
import { play, stopSiren } from '../../audio/sounds.js'
import PhoneHousing from './PhoneHousing.jsx'

// Act 2 — automaticity. The keypad is physically scrambled: 1 and 2 no
// longer live where a phone keypad puts them. Nothing on screen says this.
// A player who reads each key before pressing dials fine. A player who taps
// on muscle memory alone misfires.
export default function Act2Keypad({ onDone }) {
  const [dialed, setDialed] = useState([])
  const [mistakes, setMistakes] = useState(0)
  const [flash, setFlash] = useState(null) // 'error' | 'success' | null
  const [message, setMessage] = useState('')
  const [shakeKey, setShakeKey] = useState(0)
  const [locked, setLocked] = useState(false)

  const handlePress = (digit) => {
    if (locked || !digit) return
    const nextIndex = dialed.length
    const expected = TARGET_DIGITS[nextIndex]

    if (digit === expected) {
      play('keyClick')
      const next = [...dialed, digit]
      setDialed(next)
      if (next.length === TARGET_DIGITS.length) {
        setLocked(true)
        setFlash('success')
        setMessage(RIGHT_DIAL_RESPONSE)
        play('connectSuccess')
        stopSiren()
        setTimeout(() => onDone({ connected: true, hadMistake: mistakes > 0 }), 900)
      }
      return
    }

    const newMistakes = mistakes + 1
    setMistakes(newMistakes)
    setDialed([])
    setFlash('error')
    setMessage(WRONG_DIAL_RESPONSE)
    setShakeKey((k) => k + 1)
    play('wrongBuzz')

    if (newMistakes >= MAX_MISTAKES) {
      setLocked(true)
      setTimeout(() => onDone({ connected: false, hadMistake: true }), 900)
    } else {
      setTimeout(() => setFlash(null), 350)
    }
  }

  useEffect(() => {
    return () => stopSiren()
  }, [])

  return (
    <div className="relative h-full w-full flex flex-col items-center bg-l3-bg px-5 py-6 sm:px-10 overflow-hidden">
      <PhoneHousing />
      {/* dims the booth dressing so the dial grid stays the clear focal point */}
      <div className="absolute inset-0 bg-l3-bg/45" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center w-full">
        <PulsingVoice text={BG_VOICE_LOOP} />

        <p className="font-pixel text-white text-xs sm:text-sm mt-4">{KEYPAD_PROMPT}</p>

        <div className="font-mono text-l3-prompt text-lg h-8 mt-2 tracking-[0.4em]">
          {'•'.repeat(dialed.length)}
        </div>

        <p
          className={`font-mono text-xs sm:text-sm h-6 mt-1 ${
            flash === 'error' ? 'text-l3-error' : flash === 'success' ? 'text-l3-success' : 'text-transparent'
          }`}
        >
          {message || '·'}
        </p>

        <motion.div
          key={shakeKey}
          animate={flash === 'error' ? { x: [0, -6, 6, -4, 4, 0] } : {}}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-3 gap-3 mt-4 w-full max-w-xs"
        >
          {SCRAMBLED_LAYOUT.map((digit, i) =>
            digit === '' ? (
              <div key={i} />
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => handlePress(digit)}
                disabled={locked}
                className={`font-pixel text-lg sm:text-xl aspect-square border-2 border-l3-face bg-l3-face text-white
                  active:bg-white active:text-black disabled:opacity-40 transition-colors duration-75`}
              >
                {digit}
              </button>
            )
          )}
        </motion.div>

        <p className="font-mono text-[10px] sm:text-xs text-l3-prompt/70 mt-6">
          MISTAKES: {mistakes}/{MAX_MISTAKES}
        </p>
      </div>
    </div>
  )
}

function PulsingVoice({ text }) {
  return (
    <motion.p
      className="font-mono text-l3-prompt/80 text-xs sm:text-sm"
      animate={{ opacity: [0.35, 1, 0.35] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {text}
    </motion.p>
  )
}
