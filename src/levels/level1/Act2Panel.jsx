import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { EMERGENCY_LABEL, KEYPAD_LABEL, SOCIAL_PROOF_TEXT, COUNTDOWN_START } from './data.js'
import { play, stopAlarm } from '../../audio/sounds.js'
import { RoomScene } from './Artwork.jsx'

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
      className="relative h-full w-full overflow-hidden bg-l1-wall-dark"
    >
      <RoomScene />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-l1-smoke transition-[height] duration-500"
        style={{ opacity: 0.28, height: smoky ? '42%' : '20%' }}
      />

      {/* countdown */}
      <p
        className={`absolute top-3 left-0 right-0 text-center z-20 font-pixel text-2xl sm:text-3xl drop-shadow-[0_2px_0_rgba(0,0,0,0.8)] ${
          seconds <= 1 ? 'text-l1-danger animate-pulse' : 'text-l1-text'
        }`}
      >
        {seconds}
      </p>

      {/* Emergency Release — large, pulsing, sits over the panel cut-out
          drawn in RoomScene at (297,400) r38 / viewBox 360x640. */}
      <div className="absolute z-20 flex flex-col items-center" style={{ left: '68%', top: '54%', width: '30%' }}>
        {showSocialProof && (
          <p className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 text-center font-mono text-[8px] sm:text-[9px] text-l1-overlay leading-tight">
            {SOCIAL_PROOF_TEXT}
          </p>
        )}
        <motion.button
          type="button"
          onClick={() => resolve('emergency')}
          disabled={locked}
          animate={{ boxShadow: ['0 0 0px #FF4477', '0 0 26px #FF4477', '0 0 0px #FF4477'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          aria-label={EMERGENCY_LABEL}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-l1-danger border-4 border-l1-metal disabled:opacity-50"
        />
        <p className="mt-1 font-pixel text-[7px] sm:text-[8px] text-white text-center leading-tight">
          {EMERGENCY_LABEL}
        </p>
      </div>

      {/* Keypad — "authorised only", framing trap, sits over the keypad
          grid drawn in RoomScene at (262,222,70,52). */}
      <button
        type="button"
        onClick={() => resolve('keypad')}
        disabled={locked}
        className="absolute z-20 flex flex-col items-center justify-end bg-transparent disabled:opacity-50"
        style={{ left: '68%', top: '32%', width: '30%', height: '15%' }}
      >
        <p className="font-pixel text-[6px] sm:text-[7px] text-l1-overlay text-center leading-tight">
          {KEYPAD_LABEL}
        </p>
      </button>

      {/* Push-bar — the door handle. Small, unlabeled, no visual weight at
          all. Correct answer, invisible by design. */}
      <button
        type="button"
        onClick={() => resolve('pushbar')}
        disabled={locked}
        aria-label="door handle"
        className="absolute z-20 bg-transparent disabled:opacity-50"
        style={{ left: '41%', top: '47%', width: '18%', height: '18%' }}
      />
    </motion.div>
  )
}
