import { useState } from 'react'
import HubBar from './HubBar.jsx'
import LevelSelect from './LevelSelect.jsx'
import ProgressView from './ProgressView.jsx'
import Leaderboard from './Leaderboard.jsx'
import { computeTotals } from '../data/scoring.js'
import { useAuth } from '../lib/AuthContext.jsx'

export default function HubScreen({ progress, onPlay }) {
  const [tab, setTab] = useState('levels')
  const { user } = useAuth()
  const totals = computeTotals(progress)

  return (
    <div className="h-full w-full flex flex-col bg-l4bg text-l4text overflow-hidden">
      <HubBar tab={tab} onTabChange={setTab} points={totals.points} />

      <div
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        tabIndex={-1}
        className="flex-1 overflow-y-auto gw-scrollbar py-4"
      >
        <h2 className="sr-only">
          {tab === 'levels' ? 'Level select' : tab === 'progress' ? 'Your progress' : 'Leaderboard'}
        </h2>
        {tab === 'levels' && <LevelSelect progress={progress} onPlay={onPlay} />}
        {tab === 'progress' && <ProgressView progress={progress} />}
        {tab === 'leaderboard' && <Leaderboard selfId={user?.id} />}
      </div>
    </div>
  )
}
