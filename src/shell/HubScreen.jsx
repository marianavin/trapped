import { useState } from 'react'
import HubBar from './HubBar.jsx'
import LevelSelect from './LevelSelect.jsx'
import ProgressView from './ProgressView.jsx'
import { computeTotals } from '../data/scoring.js'

// The shell's home base: nav + score always visible, switches between the
// level grid and the progress/score view. Never shown mid-level.
export default function HubScreen({ progress, onPlay }) {
  const [tab, setTab] = useState('levels')
  const totals = computeTotals(progress)

  return (
    <div className="h-full w-full flex flex-col bg-l4bg text-l4text overflow-y-auto">
      <HubBar tab={tab} onTabChange={setTab} points={totals.points} />
      <div className="flex-1 py-6">
        {tab === 'levels' && <LevelSelect progress={progress} onPlay={onPlay} />}
        {tab === 'progress' && <ProgressView progress={progress} />}
      </div>
    </div>
  )
}
