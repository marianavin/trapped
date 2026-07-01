import { useState } from 'react'
import HubBar from './HubBar.jsx'
import LevelSelect from './LevelSelect.jsx'
import ProgressView from './ProgressView.jsx'
import { StatusFooter } from '../components/GlitchShell.jsx'
import { computeTotals } from '../data/scoring.js'

export default function HubScreen({ progress, onPlay }) {
  const [tab, setTab] = useState('levels')
  const totals = computeTotals(progress)

  return (
    <div className="h-full w-full flex flex-col bg-l4bg text-l4text overflow-hidden">
      <HubBar tab={tab} onTabChange={setTab} points={totals.points} />

      <div className="px-4 pt-4 pb-2 text-center shrink-0">
        <h1 className="font-pixel text-[10px] sm:text-xs text-accent-cyan tracking-widest glitch-shift">
          GLITCHWAVE DATA MASTER
        </h1>
        <p className="font-mono text-[10px] text-l4text/50 mt-1">PROTOCOL_SELECT // LEVEL ACCESS</p>
      </div>

      <div
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        tabIndex={-1}
        className="flex-1 overflow-y-auto py-4"
      >
        <h2 className="sr-only">{tab === 'levels' ? 'Level select' : 'Your progress'}</h2>
        {tab === 'levels' && <LevelSelect progress={progress} onPlay={onPlay} />}
        {tab === 'progress' && <ProgressView progress={progress} />}
      </div>

      <StatusFooter />
    </div>
  )
}
