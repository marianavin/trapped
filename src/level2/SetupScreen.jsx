import { useEffect } from 'react'
import { SETUP_LINES } from '../data/level2.js'
import { SetupIntro } from '../components/GameUI.jsx'
import { play } from '../audio/sounds.js'

export default function SetupScreen({ onDone }) {
  useEffect(() => {
    play('setupTone')
  }, [])

  return <SetupIntro lines={SETUP_LINES} onDone={onDone} />
}
