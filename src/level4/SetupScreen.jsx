import { SETUP_LINES } from '../data/level4.js'
import { SetupIntro } from '../components/GameUI.jsx'
import { play } from '../audio/sounds.js'
import { useEffect } from 'react'

export default function SetupScreen({ onDone }) {
  useEffect(() => {
    play('setupTone')
  }, [])

  return <SetupIntro lines={SETUP_LINES} onDone={onDone} />
}
