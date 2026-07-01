import { useEffect, useRef, useState } from 'react'
import Keypad from '../Keypad.jsx'
import PhoneFrame from '../PhoneFrame.jsx'
import TrialLayout from '../TrialLayout.jsx'
import { useTrialHint } from '../TrialHintContext.jsx'
import { scrambledLayout } from '../data.js'
import { speak, cancelSpeech } from '../speech.js'
import { play } from '../../../audio/sounds.js'

// TASK 3 - STROOP-STYLE INTERFERENCE ("The Mislabeled Key")
// Voice recites four digits. Four random keys stay highlighted with an
// orange wash over the button fill. The bias is only revealed in the
// evaluation: we count how many times the player pressed a WRONG key
// that was highlighted.
const TARGET = ['7', '3', '8', '2']
const HOT_KEYS_COUNT = 4
const HIGHLIGHT_BG =
  'linear-gradient(rgba(255,120,40,0.15), rgba(255,120,40,0.15)), rgba(40, 8, 8, 0.45)'

export default function Task3MislabeledKey({ timeRemainingMs, onDone, trial3Layout }) {
  const [dialed, setDialed] = useState([])
  const [pressed, setPressed] = useState(null)
  const [mistakes, setMistakes] = useState(0)
  const [stroopHits, setStroopHits] = useState(0)
  const layout = useRef(trial3Layout ?? scrambledLayout(41)).current
  const finishedRef = useRef(false)
  const hotSet = useRef(
    pickHot(layout.map((d, i) => (d ? i : -1)).filter((i) => i >= 0))
  ).current
  const hotKeys = useRef(new Set(hotSet)).current

  useTrialHint('“SEVEN. THREE. EIGHT. TWO.”')

  useEffect(() => {
    setTimeout(() => speak('seven, three, eight, two', { rate: 0.7 }), 300)
    return () => cancelSpeech()
  }, [])

  function finish(passed) {
    if (finishedRef.current) return
    finishedRef.current = true
    setTimeout(() => onDone({ passed, stroopHits }), 500)
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
    // Stroop tell: player pressed a WRONG key that was glowing at that moment.
    if (hotKeys.has(index)) setStroopHits((v) => v + 1)
    play('wrongBuzz')
    const m = mistakes + 1
    setMistakes(m)
    setDialed([])
    if (m >= 3) finish(false)
  }

  const overrides = {}
  hotSet.forEach((i) => {
    overrides[i] = { style: { background: HIGHLIGHT_BG } }
  })

  return (
    <TrialLayout
      header={<p className="font-pixel text-[10px] text-l3-prompt">TRIAL 3 / 4</p>}
      phone={
        <PhoneFrame display={dialed.join('')}>
          <Keypad
            layout={layout}
            overrides={overrides}
            onPress={handlePress}
            pressedIndex={pressed}
            active={timeRemainingMs > 0}
          />
        </PhoneFrame>
      }
      footer={null}
    />
  )
}

function pickHot(indexes) {
  const pool = [...indexes]
  const picked = []
  while (picked.length < HOT_KEYS_COUNT && pool.length) {
    const j = Math.floor(Math.random() * pool.length)
    picked.push(pool.splice(j, 1)[0])
  }
  return picked
}
