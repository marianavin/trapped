import { useState } from 'react'
import SetupScreen from './SetupScreen.jsx'
import Play from './Play.jsx'
import Consequence from './Consequence.jsx'
import Reveal from './Reveal.jsx'
import { scoreRun } from '../data/level2.js'

// Setup -> Play (label conflict -> authority voice -> confirmation
// gut-check) -> Consequence -> Reveal, per the core loop.
export default function Level2({ onComplete }) {
  const [stage, setStage] = useState('setup')
  const [scored, setScored] = useState(null)

  function handlePlayDone(choices) {
    setScored(scoreRun(choices))
    setStage('consequence')
  }

  function restart() {
    setScored(null)
    setStage('setup')
  }

  return (
    <div className="h-full w-full">
      {stage === 'setup' && <SetupScreen onDone={() => setStage('play')} />}

      {stage === 'play' && <Play onDone={handlePlayDone} />}

      {stage === 'consequence' && (
        <Consequence success={scored.outcomeSuccess} onDone={() => setStage('reveal')} />
      )}

      {stage === 'reveal' && (
        <Reveal
          success={scored.outcomeSuccess}
          results={scored.results}
          onNext={() =>
            onComplete({
              outcomeSuccess: scored.outcomeSuccess,
              totalBiases: 3,
              escapedCount: scored.escapedCount,
              results: scored.results,
            })
          }
          onRetry={restart}
        />
      )}
    </div>
  )
}
