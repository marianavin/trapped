import { useEffect, useRef, useState } from 'react'
import BombPanel, { BombPlayHud } from './BombPanel.jsx'
import { play, startSiren, stopAll } from '../audio/sounds.js'
import {
  TIMER_SECONDS,
  VOICE_1_LINE,
  VOICE_1_HINT,
  HINT_LABEL,
  LEGEND_LABEL,
  LEGEND_ROWS,
  VOICE_2_LINE,
  VOICE_2_HINT,
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

// The whole defusal happens as direct manipulation of the bomb panel, not a
// menu of choices: click a wire to cut it (label-vs-legend conflict), click
// a wire again once the calmer second voice contradicts the first
// (authority bias), then either re-check the legend or hit CUT NOW under
// max time pressure (confirmation bias). One 60s countdown, embedded in the
// panel's own LED display, runs throughout — running out mid-decision is
// itself a fail.
export default function Play({ onDone }) {
  const [wires] = useState(() => shuffled(WIRES))
  const [stage, setStage] = useState('choose1') // choose1 -> voice2 -> final
  const [firstCut, setFirstCut] = useState(null)
  const [currentWireId, setCurrentWireId] = useState(null)
  const [authorityChoice, setAuthorityChoice] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS)
  const doneRef = useRef(false)
  const prevSecondsRef = useRef(TIMER_SECONDS)

  useEffect(() => {
    startSiren()
    return () => stopAll()
  }, [])

  useEffect(() => {
    if (doneRef.current || secondsLeft <= 0) return
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secondsLeft])

  useEffect(() => {
    if (secondsLeft >= prevSecondsRef.current || secondsLeft <= 0 || doneRef.current) return
    prevSecondsRef.current = secondsLeft
    play(secondsLeft <= 5 ? 'countdownUrgent' : 'countdownTick')
  }, [secondsLeft])

  useEffect(() => {
    if (secondsLeft <= 0) {
      finish({ firstCut, authorityChoice, finalAction: null })
    }
  }, [secondsLeft, firstCut, authorityChoice])

  function finish(payload) {
    if (doneRef.current) return
    doneRef.current = true
    stopAll()
    onDone(payload)
  }

  function handleWireClick(id) {
    if (stage === 'choose1') {
      play('wireSnip')
      setFirstCut(id)
      setCurrentWireId(id)
      setStage('voice2')
      play('questionArrive')
      return
    }
    if (stage === 'voice2') {
      play('wireSnip')
      setAuthorityChoice(id === firstCut ? 'stick' : 'switch')
      setCurrentWireId(id)
      setStage('final')
      play('questionArrive')
    }
  }

  function handleRecheck() {
    play('keyClick')
    finish({ firstCut, authorityChoice, finalAction: 'recheck' })
  }

  function handleCutNow() {
    play('keyClick')
    finish({ firstCut, authorityChoice, finalAction: 'gut' })
  }

  const mm = String(Math.floor(Math.max(secondsLeft, 0) / 60)).padStart(2, '0')
  const ss = String(Math.max(secondsLeft, 0) % 60).padStart(2, '0')

  const message = stage === 'choose1' ? VOICE_1_LINE : stage === 'voice2' ? VOICE_2_LINE : RECHECK_PROMPT
  const messageHint = stage === 'choose1' ? VOICE_1_HINT : stage === 'voice2' ? VOICE_2_HINT : null

  const urgent = secondsLeft > 0 && secondsLeft <= 5

  return (
    <div className={`relative h-full w-full bg-l4bg text-l4text overflow-hidden ${urgent ? 'shake' : ''}`}>
      <div className="h-full overflow-y-auto gw-scrollbar">
        <div className="min-h-full flex flex-col items-center justify-center px-4 py-6 gap-4 pb-40">
          <BombPanel
            wires={wires}
            currentWireId={currentWireId}
            mm={mm}
            ss={ss}
            secondsLeft={secondsLeft}
            message={message}
            onWireClick={handleWireClick}
            wiresClickable={stage === 'choose1' || stage === 'voice2'}
          />
        </div>
      </div>

      <BombPlayHud
        hint={messageHint}
        hintLabel={HINT_LABEL}
        legendLabel={LEGEND_LABEL}
        legendRows={LEGEND_ROWS}
        showRecheck={stage === 'final'}
        onRecheck={handleRecheck}
        showCutNow={stage === 'final'}
        onCutNow={handleCutNow}
      />
    </div>
  )
}
