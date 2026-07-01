import { useState } from 'react'
import CRTOverlay from '../../components/CRTOverlay.jsx'
import Setup from './Setup.jsx'
import Consequence from './Consequence.jsx'
import Reveal from './Reveal.jsx'
import Task1Swap from './tasks/Task1Swap.jsx'
import Task2FadingAddress from './tasks/Task2FadingAddress.jsx'
import Task3MislabeledKey from './tasks/Task3MislabeledKey.jsx'
import Task4LoudNumber from './tasks/Task4LoudNumber.jsx'
import { TASK_ORDER } from './data.js'
import { stopSiren } from '../../audio/sounds.js'
import { cancelSpeech } from './speech.js'

// The 4 trials, in alternating perception (P) / memory (M) order so the
// player can't pattern-match "keypad = X trick" too early.
//   1. Swap             (P) - automaticity
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

  const restart = () => {
    stopSiren()
    cancelSpeech()
    setState(initial)
  }

  function handleTaskDone(result) {
    setState((s) => {
      const nextResults = { ...s.results, [TASKS[s.index].key]: result }
      const nextIndex = s.index + 1
      if (nextIndex >= TASKS.length) {
        return { ...s, results: nextResults, phase: 'consequence' }
      }
      return { ...s, results: nextResults, index: nextIndex }
    })
  }

  const passedCount = Object.values(state.results).filter((r) => r?.passed).length
  const outcome = passedCount === TASKS.length ? 'win' : passedCount >= 3 ? 'partial' : 'fail'

  if (state.phase === 'setup') {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <Setup onDone={() => setState((s) => ({ ...s, phase: 'play' }))} />
        <CRTOverlay />
      </div>
    )
  }

  if (state.phase === 'play') {
    const { Comp } = TASKS[state.index]
    return (
      <div className="relative h-full w-full overflow-hidden">
        <Comp key={state.index} onDone={handleTaskDone} />
        <CRTOverlay />
      </div>
    )
  }

  if (state.phase === 'consequence') {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <Consequence outcome={outcome} onDone={() => setState((s) => ({ ...s, phase: 'reveal' }))} />
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
    <div className="relative z-50 h-full w-full overflow-hidden">
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
    </div>
  )
}
