import { useEffect, useRef, useState } from 'react'
import CRTOverlay from '../../components/CRTOverlay.jsx'
import Setup from './Setup.jsx'
import Reveal from './Reveal.jsx'
import TrialTimer from './TrialTimer.jsx'
import Task1Swap from './tasks/Task1Swap.jsx'
import Task2FadingAddress from './tasks/Task2FadingAddress.jsx'
import Task3MislabeledKey from './tasks/Task3MislabeledKey.jsx'
import Task4LoudNumber from './tasks/Task4LoudNumber.jsx'
import { TASK_ORDER, LEVEL_TIMER_MS, scrambledLayout, TRIAL_3_REMIX_SEED } from './data.js'
import { stopSiren } from '../../audio/sounds.js'
import { cancelSpeech } from './speech.js'

// The 4 trials, in alternating perception (P) / memory (M) order so the
// player can't pattern-match "keypad = X trick" too early.
//   1. The Hint         (P) - anchoring & recency
//   2. Fading Address   (M) - serial position
//   3. Mislabeled Key   (P) - Stroop
//   4. Loud Number      (M) - anchoring
const TASKS = [
  { key: 'automaticity', Comp: Task1Swap },
  { key: 'serialPosition', Comp: Task2FadingAddress },
  { key: 'stroop', Comp: Task3MislabeledKey },
  { key: 'anchoring', Comp: Task4LoudNumber },
]

const initial = {
  phase: 'setup',
  index: 0,
  results: {}, // biasKey -> { passed, ...meta }
}

export default function Level3({ onComplete }) {
  const [state, setState] = useState(initial)
  const [timeRemainingMs, setTimeRemainingMs] = useState(LEVEL_TIMER_MS)
  const [trial3Layout, setTrial3Layout] = useState(null)
  const endAtRef = useRef(0)
  const timedOutRef = useRef(false)

  function startLevelTimer() {
    timedOutRef.current = false
    endAtRef.current = Date.now() + LEVEL_TIMER_MS
    setTimeRemainingMs(LEVEL_TIMER_MS)
  }

  const restart = () => {
    stopSiren()
    cancelSpeech()
    timedOutRef.current = false
    setTimeRemainingMs(LEVEL_TIMER_MS)
    setTrial3Layout(null)
    setState(initial)
  }

  useEffect(() => {
    if (state.phase !== 'play') return
    if (timedOutRef.current) return

    const tick = () => {
      const remaining = Math.max(0, endAtRef.current - Date.now())
      setTimeRemainingMs(remaining)
      if (remaining <= 0) {
        setState((s) => {
          const results = { ...s.results }
          for (const task of TASKS) {
            if (!results[task.key]) results[task.key] = { passed: false, timedOut: true }
          }
          return { ...s, results, phase: 'reveal' }
        })
        timedOutRef.current = true
        stopSiren()
        cancelSpeech()
        return
      }
    }

    tick()
    const id = setInterval(tick, 10)
    return () => clearInterval(id)
  }, [state.phase])

  function handleTaskDone(result) {
    if (timedOutRef.current) return
    if (state.index === 0 && result.passed) {
      setTrial3Layout(scrambledLayout(TRIAL_3_REMIX_SEED))
    }
    setState((s) => {
      const nextResults = { ...s.results, [TASKS[s.index].key]: result }
      const nextIndex = s.index + 1
      if (nextIndex >= TASKS.length) {
        return { ...s, results: nextResults, phase: 'reveal' }
      }
      return { ...s, results: nextResults, index: nextIndex }
    })
  }

  const passedCount = Object.values(state.results).filter((r) => r?.passed).length
  const outcome = passedCount === TASKS.length ? 'win' : passedCount >= 3 ? 'partial' : 'fail'

  if (state.phase === 'setup') {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <Setup
          onDone={() => {
            startLevelTimer()
            setState((s) => ({ ...s, phase: 'play' }))
          }}
        />
        <CRTOverlay />
      </div>
    )
  }

  if (state.phase === 'play') {
    const { Comp } = TASKS[state.index]
    return (
      <div className="relative h-full w-full overflow-hidden">
        <TrialTimer ms={timeRemainingMs} />
        <Comp
          key={state.index}
          timeRemainingMs={timeRemainingMs}
          trial3Layout={state.index === 2 ? trial3Layout : undefined}
          onDone={handleTaskDone}
        />
        <CRTOverlay />
      </div>
    )
  }

  // reveal
  const flatResults = Object.fromEntries(
    TASK_ORDER.map((k) => [k, state.results[k]?.passed ? 'escaped' : 'fell'])
  )
  const fellBooleans = Object.fromEntries(TASK_ORDER.map((k) => [k, !state.results[k]?.passed]))

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Reveal
        results={flatResults}
        outcome={outcome}
        onNext={() =>
          onComplete({
            outcomeSuccess: outcome !== 'fail',
            totalBiases: TASKS.length,
            escapedCount: passedCount,
            results: fellBooleans,
          })
        }
        onRetry={restart}
      />
      <CRTOverlay />
    </div>
  )
}
