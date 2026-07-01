import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Keypad from '../Keypad.jsx'
import PhoneFrame from '../PhoneFrame.jsx'
import PhoneHousing from '../PhoneHousing.jsx'
import { scrambledLayout } from '../data.js'
import { speak, cancelSpeech } from '../speech.js'
import { play } from '../../../audio/sounds.js'

// TASK 4 - ANCHORING ("The Loud Number")
// A huge, salient number is on-screen for a totally unrelated reason
// (apartment placard "APT 14"). The voice then dictates a completely
// different code. Under pressure, players leak the anchor (1 or 4) into
// their input.
const ANCHOR = '14'
const TARGET = ['7', '3', '8', '2']
const ANCHOR_DIGITS = new Set(['1', '4'])
const COUNTDOWN_S = 15

export default function Task4LoudNumber({ onDone }) {
  const [dialed, setDialed] = useState([])
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_S)
  const [pressed, setPressed] = useState(null)
  const [mistakes, setMistakes] = useState(0)
  const [anchorLeaks, setAnchorLeaks] = useState(0)
  const layout = useRef(scrambledLayout(53)).current
  const finishedRef = useRef(false)

  useEffect(() => {
    setTimeout(() => speak('seven, three, eight, two', { rate: 0.7 }), 1200)
    return () => cancelSpeech()
  }, [])

  useEffect(() => {
    if (finishedRef.current) return
    if (timeLeft <= 0) return finish(false)
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft])

  function finish(passed) {
    if (finishedRef.current) return
    finishedRef.current = true
    setTimeout(() => onDone({ passed, anchorLeaks }), 500)
  }

  function handlePress(digit, index) {
    if (finishedRef.current) return
    setPressed(index)
    setTimeout(() => setPressed(null), 120)
    const expected = TARGET[dialed.length]
    if (digit === expected) {
      play('keyClick')
      const next = [...dialed, digit]
      setDialed(next)
      if (next.length === TARGET.length) finish(true)
      return
    }
    // Anchor leak: player pressed a digit that appears in the loud number
    // but is NOT the expected digit.
    if (ANCHOR_DIGITS.has(digit) && !TARGET.includes(digit)) {
      setAnchorLeaks((v) => v + 1)
    }
    play('wrongBuzz')
    const m = mistakes + 1
    setMistakes(m)
    setDialed([])
    if (m >= 3) finish(false)
  }

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-between px-5 py-8 overflow-hidden bg-l3-bg">
      <PhoneHousing />
      <div className="absolute inset-0 bg-l3-bg/45" aria-hidden="true" />

      {/* Big salient placard */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="absolute z-10 top-4 right-4 pixel-border bg-black/70 px-4 py-3 text-accent-magenta"
      >
        <p className="font-pixel text-[8px] text-accent-magenta">APT</p>
        <p className="font-pixel text-4xl text-accent-magenta">{ANCHOR}</p>
      </motion.div>

      <div className="relative z-10 text-center">
        <p className="font-pixel text-[10px] text-l3-prompt">TRIAL 4 / 4</p>
        <p className="font-pixel text-[10px] text-white/60 mt-1">DIAL THE ACCESS CODE</p>
      </div>

      <div className="relative z-10 text-center">
        <p className="font-mono text-l3-label text-base sm:text-lg tracking-widest">
          &ldquo;SEVEN. THREE. EIGHT. TWO.&rdquo;
        </p>
      </div>

      <div className="relative z-10">
        <PhoneFrame display={dialed.join('')} statusRight={`${timeLeft}s`}>
          <Keypad layout={layout} onPress={handlePress} pressedIndex={pressed} />
        </PhoneFrame>
      </div>

      <p
        className={`relative z-10 font-pixel text-sm ${
          timeLeft <= 4 ? 'text-accent-magenta' : 'text-l3-prompt'
        }`}
      >
        {timeLeft}s
      </p>
    </div>
  )
}
