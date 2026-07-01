import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Keypad from '../Keypad.jsx'
import PhoneFrame from '../PhoneFrame.jsx'
import PhoneHousing from '../PhoneHousing.jsx'
import { speak, cancelSpeech } from '../speech.js'
import { play } from '../../../audio/sounds.js'

// TASK 1 - AUTOMATICITY / CAPTURE ERROR ("The Swap")
// Voice recites 9-1-1. The keypad is physically scrambled: the keys
// LABELLED 9, 1, 1 are nowhere near their muscle-memory spots. If the
// player taps the top-left / bottom-corner positions their fingers know,
// they misfire. If they read each key, they dial fine.
//
// Success = pressed the correct DIGITS (label), even if slow.
// Failure = pressed a wrong digit that happens to sit at the normal 9/1/1
// spot (top-right for 9, top-left for 1) - the tell that habit fired.
//
// This is also the one trial that matches the phone-frame artwork exactly
// (3 7 2 / 5 1 6 / 4 8 9 / 0) once that asset is in place - the image IS
// the trick here.
const TARGET = ['9', '1', '1']

// Positions where 9-1-1 normally lives on a phone keypad. Any tap here
// that isn't the correct label counts as a capture-error tell.
const NORMAL_911_POSITIONS = { 9: 8, 1: 0 }

export default function Task1Swap({ onDone }) {
  const [dialed, setDialed] = useState([])
  const [mistakes, setMistakes] = useState(0)
  const [captureError, setCaptureError] = useState(false)
  const [pressedIndex, setPressed] = useState(null)
  const [showLine, setShowLine] = useState(false)
  const layout = useRef(['3', '7', '2', '5', '1', '6', '4', '8', '9', '', '0', '']).current
  const finishedRef = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => {
      speak('nine, one, one', { rate: 0.7 })
      setShowLine(true)
    }, 400)
    return () => {
      clearTimeout(t)
      cancelSpeech()
    }
  }, [])

  function finish(passed) {
    if (finishedRef.current) return
    finishedRef.current = true
    setTimeout(() => onDone({ passed, captureError }), 550)
  }

  function handlePress(digit, index) {
    if (finishedRef.current) return
    setPressed(index)
    setTimeout(() => setPressed(null), 140)
    const expected = TARGET[dialed.length]
    if (digit === expected) {
      play('keyClick')
      const next = [...dialed, digit]
      setDialed(next)
      if (next.length === TARGET.length) finish(true)
      return
    }
    // wrong digit - was it the muscle-memory position?
    const habitPos = NORMAL_911_POSITIONS[expected]
    if (habitPos != null && index === habitPos) setCaptureError(true)
    play('wrongBuzz')
    const m = mistakes + 1
    setMistakes(m)
    setDialed([])
    if (m >= 3) finish(false)
  }

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-between px-5 py-6 overflow-hidden bg-l3-bg">
      <PhoneHousing />
      <div className="absolute inset-0 bg-l3-bg/45" aria-hidden="true" />

      <div className="relative z-10 text-center">
        <p className="font-pixel text-[10px] text-l3-prompt">TRIAL 1 / 4</p>
      </div>

      <div className="relative z-10 min-h-[2rem] text-center">
        {showLine && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-l3-label text-lg tracking-widest"
          >
            &ldquo;NINE. ONE. ONE.&rdquo;
          </motion.p>
        )}
      </div>

      <div className="relative z-10">
        <PhoneFrame display={dialed.join('')}>
          <Keypad layout={layout} onPress={handlePress} pressedIndex={pressedIndex} />
        </PhoneFrame>
      </div>

      <p className="relative z-10 font-pixel text-[9px] text-accent-magenta/80 h-4">
        {mistakes > 0 ? `MISFIRES: ${mistakes}` : ''}
      </p>
    </div>
  )
}
