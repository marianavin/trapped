import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { EMERGENCY_LABEL, KEYPAD_LABEL, SOCIAL_PROOF_TEXT, COUNTDOWN_START } from './data.js'
import { play, stopAlarm } from '../../audio/sounds.js'

// The door panel. Three elements render in scan order - Emergency Release
// (large, pulsing, first), Keypad ("authorised only", middle), Push-bar
// (small, unlabeled, last) - so the eye is drawn before the brain reads
// anything. The social-proof tag flickers once near Emergency Release,
// gone before it's consciously readable. A 4-second countdown runs
// throughout; running it out resolves the same way pressing the wrong
// thing does.
export default function Act2Panel({ smoky, onDone }) {
  const [seconds, setSeconds] = useState(COUNTDOWN_START)
  const [showSocialProof, setShowSocialProof] = useState(false)
  const [locked, setLocked] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)

  const resolve = (choice) => {
    if (locked) return
    setLocked(true)
    stopAlarm()
    if (choice === 'pushbar') {
      play('connectSuccess')
    } else {
      play('wrongBuzz')
      setShakeKey((k) => k + 1)
    }
    setTimeout(() => onDone({ panelChoice: choice }), choice === 'pushbar' ? 500 : 650)
  }

  useEffect(() => {
    const flickerIn = setTimeout(() => setShowSocialProof(true), 900)
    const flickerOut = setTimeout(() => setShowSocialProof(false), 1400)
    return () => {
      clearTimeout(flickerIn)
      clearTimeout(flickerOut)
    }
  }, [])

  // Ticks 4 -> 3 -> 2 -> 1, then resolves as a timeout - the countdown never
  // renders a "0", matching the copy spec's exact "4… 3… 2… 1…" sequence.
  useEffect(() => {
    if (locked) return
    const t = setTimeout(() => {
      if (seconds <= 1) {
        resolve('timeout')
      } else {
        play('keyClick')
        setSeconds((s) => s - 1)
      }
    }, 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds, locked])

  return (
    <motion.div
      key={shakeKey}
      animate={shakeKey > 0 ? { x: [0, -6, 6, -4, 4, 0] } : {}}
      transition={{ duration: 0.25 }}
      className="relative h-full w-full flex flex-col items-center bg-l1-bg px-6 py-6 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-l1-smoke transition-[height] duration-500"
        style={{ opacity: 0.22, height: smoky ? '38%' : '18%' }}
      />

      <p
        className={`relative z-10 font-pixel text-2xl sm:text-3xl mt-2 ${
          seconds <= 1 ? 'text-l1-danger animate-pulse' : 'text-l1-text'
        }`}
      >
        {seconds}
      </p>

      <div className="relative z-10 flex-1 w-full max-w-xs flex flex-col items-stretch justify-center gap-6">
        <div className="relative">
          {showSocialProof && (
            <p className="absolute -top-4 left-0 right-0 text-center font-mono text-[10px] text-l1-overlay">
              {SOCIAL_PROOF_TEXT}
            </p>
          )}
          <motion.button
            type="button"
            onClick={() => resolve('emergency')}
            disabled={locked}
            animate={{ boxShadow: ['0 0 0px #FF2D2D', '0 0 22px #FF2D2D', '0 0 0px #FF2D2D'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full py-6 bg-l1-danger text-white font-pixel text-sm sm:text-base border-4 border-white disabled:opacity-50"
          >
            {EMERGENCY_LABEL}
          </motion.button>
        </div>

        <button
          type="button"
          onClick={() => resolve('keypad')}
          disabled={locked}
          className="w-full py-4 bg-transparent border-2 border-l1-overlay text-l1-overlay font-pixel text-[9px] sm:text-[10px] disabled:opacity-50"
        >
          {KEYPAD_LABEL}
        </button>

        <button
          type="button"
          onClick={() => resolve('pushbar')}
          disabled={locked}
          className="self-end w-24 py-2 bg-transparent border border-l1-correct text-l1-correct disabled:opacity-50"
          aria-label="push bar"
        />
      </div>
    </motion.div>
  )
}
