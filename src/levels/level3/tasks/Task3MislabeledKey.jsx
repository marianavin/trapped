import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Keypad from '../Keypad.jsx'
import PhoneFrame from '../PhoneFrame.jsx'
import PhoneHousing from '../PhoneHousing.jsx'
import { scrambledLayout } from '../data.js'
import { speak, cancelSpeech } from '../speech.js'
import { play } from '../../../audio/sounds.js'

// TASK 3 - STROOP-STYLE INTERFERENCE ("The Mislabeled Key")
// Voice recites four digits. During play, a rotating set of keys glows in
// the shared danger accent (magenta) - this constantly-shifting noise
// fights with reading the correct numeral. The bias is only revealed in
// the evaluation: we count how many times the player pressed a WRONG key
// that happened to be glowing at that moment.
const TARGET = ['7', '3', '8', '2']
const COUNTDOWN_S = 12
const HOT_KEYS_COUNT = 3
const HOT_ROTATE_MS = 650

export default function Task3MislabeledKey({ onDone }) {
  const [dialed, setDialed] = useState([])
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_S)
  const [pressed, setPressed] = useState(null)
  const [mistakes, setMistakes] = useState(0)
  const [stroopHits, setStroopHits] = useState(0)
  const [hotSet, setHotSet] = useState([])
  const layout = useRef(scrambledLayout(41)).current
  const finishedRef = useRef(false)
  const hotRef = useRef(new Set())

  // Rotate the glowing keys - random wrong buttons keep lighting up.
  useEffect(() => {
    const digitIdx = layout.map((d, i) => (d ? i : -1)).filter((i) => i >= 0)
    setHotSet(pickHot(digitIdx))
    const t = setInterval(() => setHotSet(pickHot(digitIdx)), HOT_ROTATE_MS)
    return () => clearInterval(t)
  }, [layout])

  useEffect(() => {
    hotRef.current = new Set(hotSet)
  }, [hotSet])

  useEffect(() => {
    setTimeout(() => speak('seven, three, eight, two', { rate: 0.7 }), 300)
    return () => cancelSpeech()
  }, [])

  useEffect(() => {
    if (finishedRef.current) return
    if (timeLeft <= 0) {
      finish(false)
      return
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft])

  function finish(passed) {
    if (finishedRef.current) return
    finishedRef.current = true
    setTimeout(() => onDone({ passed, stroopHits }), 500)
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
    // Stroop tell: player pressed a WRONG key that was glowing at that moment.
    if (hotRef.current.has(index)) setStroopHits((v) => v + 1)
    play('wrongBuzz')
    const m = mistakes + 1
    setMistakes(m)
    setDialed([])
    if (m >= 3) finish(false)
  }

  const overrides = {}
  hotSet.forEach((i) => {
    // borderColor via inline style (see Keypad.jsx) so it reliably wins over
    // the default transparent border regardless of Tailwind's class order.
    overrides[i] = {
      className: 'text-accent-magenta neon-glow animate-pulse',
      style: { borderColor: '#FF3131' },
    }
  })

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-between px-5 py-8 overflow-hidden bg-l3-bg">
      <PhoneHousing />
      <div className="absolute inset-0 bg-l3-bg/45" aria-hidden="true" />

      <div className="relative z-10 text-center">
        <p className="font-pixel text-[10px] text-l3-prompt">TRIAL 3 / 4</p>
      </div>

      <div className="relative z-10 text-center">
        <p className="font-mono text-l3-label text-base sm:text-lg tracking-widest">
          &ldquo;SEVEN. THREE. EIGHT. TWO.&rdquo;
        </p>
      </div>

      <div className="relative z-10">
        <PhoneFrame display={dialed.join('')} statusRight={`${timeLeft}s`}>
          <Keypad layout={layout} overrides={overrides} onPress={handlePress} pressedIndex={pressed} />
        </PhoneFrame>
      </div>

      <motion.p
        animate={{ scale: timeLeft <= 3 ? [1, 1.15, 1] : 1 }}
        transition={{ duration: 0.4, repeat: timeLeft <= 3 ? Infinity : 0 }}
        className={`relative z-10 font-pixel text-sm ${timeLeft <= 3 ? 'text-accent-magenta' : 'text-l3-prompt'}`}
      >
        {timeLeft}s
      </motion.p>
    </div>
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
