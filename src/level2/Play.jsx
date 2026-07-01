import { useEffect, useRef, useState } from 'react'
import BombPanel from './BombPanel.jsx'
import { play, startSiren, stopSiren } from '../audio/sounds.js'
import {
  TIMER_SECONDS,
  VOICE_1_LINE,
  VOICE_1_HINT,
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
// max time pressure (confirmation bias). One 90s countdown, embedded in the
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
  }, [secondsLeft, firstCut, authorityChoice])

  function finish(payload) {
    if (doneRef.current) return
    doneRef.current = true
    stopSiren()
    onDone(payload)
  }

  function handleWireClick(id) {
    if (stage === 'choose1') {
      play('keyClick')
      setFirstCut(id)
      setCurrentWireId(id)
      setStage('voice2')
      play('questionArrive')
      return
    }
    if (stage === 'voice2') {
      play('keyClick')
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

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-l2-bg text-l2-text px-4 py-6 gap-4">
      <BombPanel
        wires={wires}
        currentWireId={currentWireId}
        mm={mm}
        ss={ss}
        message={message}
        messageHint={messageHint}
        legendLabel={LEGEND_LABEL}
        legendRows={LEGEND_ROWS}
        showLegend
        onWireClick={handleWireClick}
        wiresClickable={stage === 'choose1' || stage === 'voice2'}
        showRecheck={stage === 'final'}
        onRecheck={handleRecheck}
        showCutNow={stage === 'final'}
        onCutNow={handleCutNow}
      />
    </div>
  )
}
