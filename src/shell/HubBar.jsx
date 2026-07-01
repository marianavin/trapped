import { useAuth } from '../lib/AuthContext.jsx'
import PixelButton from '../components/PixelButton.jsx'
import { TabButton } from '../components/GameUI.jsx'
import { play } from '../audio/sounds.js'

const TABS = [
  { id: 'levels', label: 'LEVELS' },
  { id: 'progress', label: 'PROGRESS' },
  { id: 'leaderboard', label: 'RANKING' },
]

export default function HubBar({ tab, onTabChange, points }) {
  const { user, signOut } = useAuth()
  const initial = (user?.name || '?').trim().charAt(0).toUpperCase()

  return (
    <header className="w-full border-b-2 border-accent-cyan/30 bg-l4panel px-4 py-2.5 shadow-neon-cyan">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 min-h-9">
        {/* brand */}
        <div className="flex items-center justify-start min-w-0">
          <h1 className="m-0 leading-none font-pixel text-sm sm:text-base tracking-widest glitch-title glitch-shift">
            TRAPPED
          </h1>
        </div>

        {/* navigation */}
        <nav role="tablist" aria-label="Game sections" className="flex items-center gap-1 justify-self-center">
          {TABS.map((t) => (
            <TabButton
              key={t.id}
              id={`tab-${t.id}`}
              label={t.label}
              active={tab === t.id}
              controls={`panel-${t.id}`}
              onClick={() => {
                if (tab !== t.id) play('tabBlip')
                onTabChange(t.id)
              }}
            />
          ))}
        </nav>

        {/* player */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div
              aria-hidden="true"
              title={user?.name}
              className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 flex items-center justify-center border-2 border-accent-cyan text-accent-cyan font-pixel text-[8px] sm:text-[10px] bg-l4bg neon-glow-cyan"
            >
              {initial}
            </div>
            <span className="hidden sm:inline font-mono text-xs text-l4text/70 truncate max-w-[7rem]">
              {user?.name}
            </span>
          </div>
          <span className="font-pixel text-[9px] sm:text-[10px] text-accent-cyan shrink-0 tabular-nums">
            {points} POINTS
          </span>
          <PixelButton variant="ghost" size="xs" onClick={signOut}>
            SIGN OUT
          </PixelButton>
        </div>
      </div>
    </header>
  )
}
