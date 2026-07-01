import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Keypad from '../Keypad.jsx'
import PhoneFrame from '../PhoneFrame.jsx'
import TrialLayout from '../TrialLayout.jsx'
import { useTrialHint } from '../TrialHintContext.jsx'
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

export default function Task4LoudNumber({ timeRemainingMs, onDone }) {
  const [dialed, setDialed] = useState([])
  const [pressed, setPressed] = useState(null)
  const [mistakes, setMistakes] = useState(0)
  const [anchorLeaks, setAnchorLeaks] = useState(0)
  const layout = useRef(scrambledLayout(53)).current
  const finishedRef = useRef(false)

  useTrialHint('“SEVEN. THREE. EIGHT. TWO.”')

  useEffect(() => {
    setTimeout(() => speak('seven, three, eight, two', { rate: 0.7 }), 1200)
    return () => cancelSpeech()
  }, [])

  function finish(passed) {
    if (finishedRef.current) return
    finishedRef.current = true
    setTimeout(() => onDone({ passed, anchorLeaks }), 500)
  }

  function handlePress(digit, index) {
    if (finishedRef.current || timeRemainingMs <= 0) return
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
    <TrialLayout
      overlay={
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute z-10 top-4 right-4 pixel-border bg-black/70 px-4 py-3 text-accent-magenta"
        >
          <p className="font-pixel text-[8px] text-accent-magenta">APT</p>
          <p className="font-pixel text-4xl text-accent-magenta">{ANCHOR}</p>
        </motion.div>
      }
      header={
        <>
          <p className="font-pixel text-[10px] text-l3-prompt">TRIAL 4 / 4</p>
          <p className="font-pixel text-[10px] text-l3-label mt-1">DIAL THE ACCESS CODE</p>
        </>
      }
      phone={
        <PhoneFrame display={dialed.join('')}>
          <Keypad layout={layout} onPress={handlePress} pressedIndex={pressed} active={timeRemainingMs > 0} />
        </PhoneFrame>
      }
      footer={null}
    />
  )
}
