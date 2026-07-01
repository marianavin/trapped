import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PixelButton from '../components/PixelButton.jsx'
import Typewriter from '../components/Typewriter.jsx'
import { play, startSiren, stopSiren } from '../audio/sounds.js'
import {
  TIMER_SECONDS,
  VOICE_1_LINE,
  LEGEND_LABEL,
  LEGEND_ROWS,
  VOICE_2_LINE,
  RECHECK_PROMPT,
  WIRES,
} from '../data/level2.js'

// Per-mount shuffle of wire position only — the color -> meaning mapping in
// data/level2.js never changes, so a stranger can't just memorize "always
// pick the middle one" on a replay.
function shuffled(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// The full multi-stage defusal: label-vs-legend conflict -> a calmer second
// voice contradicting the first (authority bias) -> a final gut-check under
// max time pressure (confirmation bias). A single 90s countdown runs
// throughout; running out mid-decision is itself a fail.
export default function Play({ onDone }) {
  const [wires] = useState(() => shuffled(WIRES))
  const [stage, setStage] = useState('brief') // brief -> choose1 -> voice2 -> final
  const [legendShown, setLegendShown] = useState(false)
  const [firstCut, setFirstCut] = useState(null)
  const [authorityChoice, setAuthorityChoice] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS)
  const doneRef = useRef(false)

  useEffect(() => {
    startSiren()
    return () => stopSiren()
  }, [])

  useEffect(() => {
    if (doneRef.current || secondsLeft <= 0) return
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secondsLeft])

  useEffect(() => {
    if (secondsLeft <= 0) {
      finish({ firstCut, authorityChoice, finalAction: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft])

  function finish(payload) {
    if (doneRef.current) return
    doneRef.current = true
    stopSiren()
    onDone(payload)
  }

  function chooseWire(id) {
    if (stage !== 'choose1') return
    play('keyClick')
    setFirstCut(id)
    setStage('voice2')
    play('questionArrive')
  }

  function chooseAuthority(choice) {
    play('keyClick')
    setAuthorityChoice(choice)
    setStage('final')
    play('questionArrive')
  }

  function chooseFinal(action) {
    play('keyClick')
    finish({ firstCut, authorityChoice, finalAction: action })
  }

  const mm = String(Math.floor(Math.max(secondsLeft, 0) / 60)).padStart(2, '0')
  const ss = String(Math.max(secondsLeft, 0) % 60).padStart(2, '0')

  const srText =
    stage === 'brief' || stage === 'choose1'
      ? VOICE_1_LINE
      : stage === 'voice2'
      ? VOICE_2_LINE
      : RECHECK_PROMPT

  return (
    <div className="relative h-full w-full flex flex-col items-center bg-l2-bg text-l2-text px-6 py-8 gap-6 overflow-y-auto">
      <p role="status" aria-live="polite" className="sr-only">
        {srText}
      </p>

      <div className="font-pixel text-2xl sm:text-3xl text-l2-accent tabular-nums" aria-hidden="true">
        {mm}:{ss}
      </div>

      {(stage === 'brief' || stage === 'choose1') && (
        <div className="w-full max-w-md flex flex-col gap-4">
          <div className="pixel-border bg-l2-panel p-4" aria-hidden="true">
            <Typewriter
              text={VOICE_1_LINE}
              speed={22}
              onDone={() => setTimeout(() => {
                setLegendShown(true)
                setStage('choose1')
              }, 300)}
              className="font-mono text-sm sm:text-base leading-relaxed"
            />
          </div>

          {legendShown && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pixel-border bg-black/40 p-3"
              aria-hidden="true"
            >
              <p className="font-pixel text-[9px] sm:text-[10px] text-l2-accent mb-2">{LEGEND_LABEL}</p>
              {LEGEND_ROWS.map((row) => (
                <p key={row} className="font-mono text-xs sm:text-sm">
                  {row}
                </p>
              ))}
            </motion.div>
          )}

          {stage === 'choose1' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center gap-4 sm:gap-6 mt-2"
            >
              {wires.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => chooseWire(w.id)}
                  className="flex flex-col items-center gap-2 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
                  aria-label={`Cut ${w.label}`}
                >
                  <span
                    className="block w-16 h-6 sm:w-24 sm:h-8 pixel-border active:translate-y-[2px]"
                    style={{ background: w.color }}
                  />
                  <span className="font-pixel text-[8px] sm:text-[9px]">{w.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {stage === 'voice2' && (
          <motion.div
            key="voice2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md flex flex-col gap-5"
          >
            <div className="pixel-border bg-l2-panel p-4" aria-hidden="true">
              <Typewriter
                text={VOICE_2_LINE}
                speed={18}
                className="font-mono text-sm sm:text-base leading-relaxed"
              />
            </div>
            <div className="flex flex-col gap-3">
              <PixelButton full onClick={() => chooseAuthority('stick')}>
                STICK WITH MY CUT
              </PixelButton>
              <PixelButton full onClick={() => chooseAuthority('switch')}>
                SWITCH TO BLUE
              </PixelButton>
            </div>
          </motion.div>
        )}

        {stage === 'final' && (
          <motion.div
            key="final"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md flex flex-col gap-5"
          >
            <div className="pixel-border bg-l2-panel p-4" aria-hidden="true">
              <p className="font-mono text-sm sm:text-base leading-relaxed">{RECHECK_PROMPT}</p>
            </div>
            <div className="flex flex-col gap-3">
              <PixelButton full onClick={() => chooseFinal('recheck')}>
                RE-CHECK THE KEY
              </PixelButton>
              <PixelButton full onClick={() => chooseFinal('gut')}>
                GO WITH YOUR GUT
              </PixelButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
