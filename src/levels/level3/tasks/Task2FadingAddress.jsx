import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Keypad from '../Keypad.jsx'
import { scrambledLayout } from '../data.js'
import PhoneFrame from '../PhoneFrame.jsx'
import TrialLayout from '../TrialLayout.jsx'
import { useTrialHint } from '../TrialHintContext.jsx'
import { speak, cancelSpeech } from '../speech.js'
import { play } from '../../../audio/sounds.js'

// TASK 2 - SERIAL POSITION EFFECT ("The Fading Address")
// Address flashes for ~2s: "BUILDING 27, UNIT 193, GATE 4" -> digits 27-193-4.
// Then the player is forced to dial 1-1-2 (interference / distractor task).
// Only AFTER that do they get to type the address digits from memory.
// Middle chunk (193) is where players typically blank - primacy grabs 27,
// recency grabs 4.
const ADDRESS_TEXT = 'BUILDING 27 · UNIT 193 · GATE 4'
const ADDRESS_DIGITS = ['2', '7', '1', '9', '3', '4']
const DIAL_112 = ['1', '1', '2']
const FLASH_MS = 2200

export default function Task2FadingAddress({ timeRemainingMs, onDone }) {
  const [phase, setPhase] = useState('flash') // flash -> dial -> recall -> done
  const [dialed, setDialed] = useState([])
  const [recall, setRecall] = useState([])
  const [pressed, setPressed] = useState(null)
  const dialLayout = useRef(scrambledLayout(11)).current
  const recallLayout = useRef(scrambledLayout(29)).current
  const finishedRef = useRef(false)

  const hintText =
    phase === 'dial' ? '“ONE. ONE. TWO.”' : phase === 'recall' ? 'ADDRESS DIGITS' : null
  useTrialHint(hintText, { animate: phase === 'dial' })

  useEffect(() => {
    if (phase !== 'flash') return
    const t = setTimeout(() => setPhase('dial'), FLASH_MS)
    speak('Building twenty-seven. Unit one ninety-three. Gate four.', { rate: 0.85 })
    return () => {
      clearTimeout(t)
      cancelSpeech()
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'dial') speak('Dial one, one, two.', { rate: 0.7 })
  }, [phase])

  useEffect(() => {
    if (phase === 'recall') speak('Now the address digits.', { rate: 0.85 })
  }, [phase])

  function finish(passed, meta) {
    if (finishedRef.current) return
    finishedRef.current = true
    setTimeout(() => onDone({ passed, ...meta }), 500)
  }

  function pressDial(digit, index) {
    if (phase !== 'dial' || timeRemainingMs <= 0) return
    setPressed(index)
    setTimeout(() => setPressed(null), 120)
    const expected = DIAL_112[dialed.length]
    if (digit === expected) {
      play('keyClick')
      const next = [...dialed, digit]
      setDialed(next)
      if (next.length === DIAL_112.length) setTimeout(() => setPhase('recall'), 400)
    } else {
      play('wrongBuzz')
      setDialed([])
    }
  }

  function pressRecall(digit, index) {
    if (phase !== 'recall' || timeRemainingMs <= 0) return
    setPressed(index)
    setTimeout(() => setPressed(null), 120)
    const next = [...recall, digit]
    setRecall(next)
    play('keyClick')
    if (next.length === ADDRESS_DIGITS.length) {
      const correct = next.every((d, i) => d === ADDRESS_DIGITS[i])
      // Track middle-chunk failures specifically (positions 2,3,4 -> 1,9,3)
      const middleFailed = next.slice(2, 5).some((d, i) => d !== ADDRESS_DIGITS[i + 2])
      finish(correct, { middleFailed, entered: next.join('') })
    }
  }

  return (
    <TrialLayout
      header={
        <>
          <p className="font-pixel text-[10px] text-l3-prompt">TRIAL 2 / 4</p>
          <p className="font-pixel text-[10px] text-l3-label mt-1">
            {phase === 'flash' && 'REMEMBER THE ADDRESS'}
            {phase === 'dial' && 'FIRST — DIAL 1-1-2'}
            {phase === 'recall' && 'NOW — ADDRESS DIGITS'}
          </p>
        </>
      }
      phone={
        <AnimatePresence mode="wait">
          {phase === 'flash' ? (
            <motion.div
              key="flash"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="pixel-border w-[234px] bg-black/40 px-6 py-6 text-center text-l3-prompt sm:w-[251px]"
            >
              <p className="font-pixel text-[10px] text-l3-prompt mb-3">CALLER LOCATION</p>
              <p className="font-mono text-l3-label text-lg sm:text-2xl tracking-wider">
                {ADDRESS_TEXT}
              </p>
            </motion.div>
          ) : (
            <motion.div key="pad" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <PhoneFrame
                display={(phase === 'dial' ? dialed : recall).join('')}
                statusRight={phase === 'dial' ? 'DIAL 1-1-2' : 'ADDRESS'}
              >
                <Keypad
                  layout={phase === 'dial' ? dialLayout : recallLayout}
                  onPress={phase === 'dial' ? pressDial : pressRecall}
                  pressedIndex={pressed}
                  active={timeRemainingMs > 0}
                />
              </PhoneFrame>
            </motion.div>
          )}
        </AnimatePresence>
      }
      footer={
        <p className="font-pixel text-[9px] text-l3-label">
          {phase === 'recall' ? `${recall.length}/${ADDRESS_DIGITS.length}` : ''}
        </p>
      }
    />
  )
}
