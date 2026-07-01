import { useEffect } from 'react'
import { CONSEQUENCE_WIN, CONSEQUENCE_PARTIAL, CONSEQUENCE_FAIL } from './data.js'
import { ConsequenceBeat } from '../../components/GameUI.jsx'
import { play } from '../../audio/sounds.js'

export default function Consequence({ outcome, onDone }) {
  const lines =
    outcome === 'win' ? CONSEQUENCE_WIN : outcome === 'partial' ? CONSEQUENCE_PARTIAL : CONSEQUENCE_FAIL

  useEffect(() => {
    play(outcome === 'fail' ? 'failPhrase' : 'connectSuccess')
  }, [outcome])

  return <ConsequenceBeat lines={lines} tone={outcome === 'fail' ? 'fail' : 'success'} onDone={onDone} />
}
