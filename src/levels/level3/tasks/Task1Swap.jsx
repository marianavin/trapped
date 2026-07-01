import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Keypad from '../Keypad.jsx'
import PhoneFrame from '../PhoneFrame.jsx'
import TrialLayout from '../TrialLayout.jsx'
import Trial1KeyboardHint from '../Trial1KeyboardHint.jsx'
import { TRIAL_1_LAYOUT } from '../data.js'
import { speak, cancelSpeech } from '../speech.js'
import { play } from '../../../audio/sounds.js'

// TASK 1 — ANCHORING & RECENCY ("The Hint")
// Voice recites 9-1-1. A bold on-screen hint says 991. Dial 911 and you
// escaped; dial 991 and the recent visual anchor won over the spoken code.
const CORRECT_911 = ['9', '1', '1']
const TRAP_991 = ['9', '9', '1']

function matchesPrefix(seq, target) {
  return seq.every((d, i) => d === target[i])
}

export default function Task1Swap({ timeRemainingMs, onDone }) {
  const [dialed, setDialed] = useState([])
  const [mistakes, setMistakes] = useState(0)
  const [pressedIndex, setPressed] = useState(null)
  const [showLine, setShowLine] = useState(false)
  const layout = useRef(TRIAL_1_LAYOUT).current
  const phoneContainerRef = useRef(null)
  const keyNineRef = useRef(null)
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

  function finish(passed, entered) {
    if (finishedRef.current) return
    finishedRef.current = true
    setTimeout(
      () =>
        onDone({
          passed,
          entered,
          followedHint: entered === '991',
        }),
      550
    )
  }

  function handlePress(digit, index) {
    if (finishedRef.current || timeRemainingMs <= 0) return
    setPressed(index)
    setTimeout(() => setPressed(null), 140)

    const next = [...dialed, digit]
    const on911 = matchesPrefix(next, CORRECT_911)
    const on991 = matchesPrefix(next, TRAP_991)

    if (on911 || on991) {
      play('keyClick')
      setDialed(next)
      if (next.length === 3) {
        const entered = next.join('')
        finish(entered === '911', entered)
      }
      return
    }

    play('wrongBuzz')
    const m = mistakes + 1
    setMistakes(m)
    setDialed([])
    if (m >= 3) finish(false, '')
  }

  return (
    <TrialLayout
      header={<p className="font-pixel text-[10px] text-l3-prompt">TRIAL 1 / 4</p>}
      prompt={
        showLine ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-l3-label text-lg tracking-widest"
          >
            &ldquo;NINE. ONE. ONE.&rdquo;
          </motion.p>
        ) : null
      }
      phone={
        <div ref={phoneContainerRef} className="relative overflow-visible">
          <PhoneFrame display={dialed.join('')}>
            <Keypad
              layout={layout}
              onPress={handlePress}
              pressedIndex={pressedIndex}
              active={timeRemainingMs > 0}
              keyAnchorRef={keyNineRef}
              keyAnchorLabel="9"
            />
          </PhoneFrame>
          {showLine && (
            <Trial1KeyboardHint anchorRef={keyNineRef} containerRef={phoneContainerRef} />
          )}
        </div>
      }
      footer={
        <p className="font-pixel text-[9px] text-accent-magenta/80">
          {mistakes > 0 ? `MISFIRES: ${mistakes}` : ''}
        </p>
      }
    />
  )
}
