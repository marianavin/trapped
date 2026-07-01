import { useState } from 'react'
import SetupScreen from './SetupScreen.jsx'
import FlashScene from './FlashScene.jsx'
import NewspaperScreen from './NewspaperScreen.jsx'
import DispatcherCall from './DispatcherCall.jsx'
import ConsequenceScreen from './ConsequenceScreen.jsx'
import RevealScreen from './RevealScreen.jsx'
import { scoreAnswers } from '../data/level4.js'

// Setup -> Act 1 (accident) -> Act 2 (newspaper) -> Act 3 (call) ->
// Consequence -> Reveal. The 3-act split (see FlashScene/NewspaperScreen/
// DispatcherCall) replaces the earlier single flash-scene-then-call design:
// the accident itself is now fully perceptible, and the wrong story gets
// planted in Act 2 before the officer ever asks a leading question.
export default function Level4({ onLevelComplete }) {
  const [stage, setStage] = useState('setup')
  const [answers, setAnswers] = useState(null)
  const [scored, setScored] = useState(null)

  function handleCallComplete(finalAnswers) {
    setAnswers(finalAnswers)
    setScored(scoreAnswers(finalAnswers))
    setStage('consequence')
  }

  return (
    <div className="h-full w-full">
      {stage === 'setup' && <SetupScreen onDone={() => setStage('accident')} />}
      {stage === 'accident' && <FlashScene onDone={() => setStage('newspaper')} />}
      {stage === 'newspaper' && <NewspaperScreen onProceed={() => setStage('call')} />}
      {stage === 'call' && <DispatcherCall onComplete={handleCallComplete} />}
      {stage === 'consequence' && (
        <ConsequenceScreen onContinue={() => setStage('reveal')} />
      )}
      {stage === 'reveal' && (
        <RevealScreen
          answers={answers}
          results={scored.results}
          onContinue={() => onLevelComplete({ answers, ...scored })}
        />
      )}
    </div>
  )
}
