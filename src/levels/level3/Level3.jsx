import { useState } from 'react'
import CRTOverlay from '../../components/CRTOverlay.jsx'
import Setup from './Setup.jsx'
import Act1Location from './Act1Location.jsx'
import Act2Keypad from './Act2Keypad.jsx'
import Consequence from './Consequence.jsx'
import Reveal from './Reveal.jsx'
import { SIGN_ADDRESS } from './data.js'
import { stopSiren } from '../../audio/sounds.js'

const initialState = {
  phase: 'setup',
  address: null,
  connected: false,
  hadMistake: false,
}

export default function Level3({ onComplete }) {
  const [state, setState] = useState(initialState)

  const goTo = (phase, patch = {}) => setState((s) => ({ ...s, ...patch, phase }))

  const restart = () => {
    stopSiren()
    setState(initialState)
  }

  const results = {
    automaticity: state.hadMistake ? 'fell' : 'escaped',
    anchoring: state.address === SIGN_ADDRESS ? 'escaped' : 'fell',
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {state.phase === 'setup' && <Setup onDone={() => goTo('act1')} />}

      {state.phase === 'act1' && (
        <Act1Location onProceed={(address) => goTo('act2', { address })} />
      )}

      {state.phase === 'act2' && (
        <Act2Keypad
          onDone={({ connected, hadMistake }) => goTo('consequence', { connected, hadMistake })}
        />
      )}

      {state.phase === 'consequence' && (
        <Consequence connected={state.connected} onDone={() => goTo('reveal')} />
      )}

      {state.phase === 'reveal' && (
        <Reveal
          results={results}
          connected={state.connected}
          onNext={() =>
            onComplete({
              outcomeSuccess: state.connected,
              totalBiases: 2,
              escapedCount: Object.values(results).filter((r) => r === 'escaped').length,
              results: {
                automaticity: results.automaticity === 'fell',
                anchoring: results.anchoring === 'fell',
              },
            })
          }
          onRetry={restart}
        />
      )}

      {state.phase !== 'reveal' && <CRTOverlay />}
    </div>
  )
}
