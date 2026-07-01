import { useState } from 'react'
import CRTOverlay from '../../components/CRTOverlay.jsx'
import Setup from './Setup.jsx'
import Act1Corridor from './Act1Corridor.jsx'
import Act2Panel from './Act2Panel.jsx'
import Consequence from './Consequence.jsx'
import Reveal from './Reveal.jsx'
import { stopAlarm } from '../../audio/sounds.js'

const initialState = {
  phase: 'setup',
  forkChoice: null,
  extinguisherChoice: null,
  panelChoice: null,
}

// Setup -> corridor (fork + extinguisher) -> door panel -> consequence ->
// reveal, per the core loop. Only the panel choice decides win/lose; the
// fork alone decides the social-proof card, independent of the panel.
export default function Level1({ onComplete }) {
  const [state, setState] = useState(initialState)

  const goTo = (phase, patch = {}) => setState((s) => ({ ...s, ...patch, phase }))

  const restart = () => {
    stopAlarm()
    setState(initialState)
  }

  const success = state.panelChoice === 'pushbar'
  const smoky = state.extinguisherChoice === 'pickedUp'

  const results = {
    salience: state.panelChoice === 'emergency' ? 'fell' : 'escaped',
    socialProof: state.forkChoice === 'crowd' ? 'fell' : 'escaped',
    framing: state.panelChoice === 'pushbar' ? 'escaped' : 'fell',
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {state.phase === 'setup' && <Setup onDone={() => goTo('corridor')} />}

      {state.phase === 'corridor' && (
        <Act1Corridor
          onProceed={({ forkChoice, extinguisherChoice }) =>
            goTo('panel', { forkChoice, extinguisherChoice })
          }
        />
      )}

      {state.phase === 'panel' && (
        <Act2Panel smoky={smoky} onDone={({ panelChoice }) => goTo('consequence', { panelChoice })} />
      )}

      {state.phase === 'consequence' && (
        <Consequence success={success} onDone={() => goTo('reveal')} />
      )}

      {state.phase === 'reveal' && (
        <Reveal
          results={results}
          success={success}
          onNext={() =>
            onComplete({
              outcomeSuccess: success,
              totalBiases: 3,
              escapedCount: Object.values(results).filter((r) => r === 'escaped').length,
              results: {
                salience: results.salience === 'fell',
                socialProof: results.socialProof === 'fell',
                framing: results.framing === 'fell',
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
