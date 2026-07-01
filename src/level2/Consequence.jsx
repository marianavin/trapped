import { useEffect } from 'react'
import { CONSEQUENCE_WIN, CONSEQUENCE_FAIL } from '../data/level2.js'
import { ConsequenceBeat } from '../components/GameUI.jsx'
import { play } from '../audio/sounds.js'

export default function Consequence({ success, onDone }) {
  const lines = success ? CONSEQUENCE_WIN : CONSEQUENCE_FAIL

  useEffect(() => {
    play(success ? 'connectSuccess' : 'failPhrase')
  }, [success])

  return <ConsequenceBeat lines={lines} tone={success ? 'success' : 'fail'} onDone={onDone} />
}
