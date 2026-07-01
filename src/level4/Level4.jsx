import { useState } from 'react'
import SetupScreen from './SetupScreen.jsx'
import FlashScene from './FlashScene.jsx'
import DispatcherCall from './DispatcherCall.jsx'
import ConsequenceScreen from './ConsequenceScreen.jsx'
import RevealScreen from './RevealScreen.jsx'
import { scoreAnswers } from '../data/level4.js'

// Setup -> Play (flash + call) -> Consequence -> Reveal, per the core loop.
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
      {stage === 'setup' && <SetupScreen onDone={() => setStage('flash')} />}
      {stage === 'flash' && <FlashScene onDone={() => setStage('call')} />}
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
