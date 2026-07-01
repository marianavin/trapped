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

  return (
    <header className="w-full border-b-2 border-accent-cyan/30 bg-l4panel px-4 py-2.5 shadow-neon-cyan">
      <div className="flex items-center justify-between gap-3 min-h-9">
        <nav role="tablist" aria-label="Game sections" className="flex items-center gap-1">
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

        <div className="flex items-center justify-end gap-2 sm:gap-3 min-w-0 shrink-0">
          <div className="flex flex-col items-end min-w-0 leading-tight">
            {user?.name && (
              <span className="hidden sm:block font-mono text-[10px] sm:text-[11px] text-l4text uppercase tracking-wide truncate max-w-[8rem]">
                {user.name}
              </span>
            )}
            <span className="inline-flex items-baseline gap-1.5 sm:gap-2">
              <span className="font-pixel text-xs sm:text-sm text-accent-cyan tabular-nums leading-none">
                {points}
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] text-l4text uppercase tracking-wide leading-none">
                POINTS
              </span>
            </span>
          </div>
          <div aria-hidden="true" className="w-px h-6 bg-accent-cyan/20 shrink-0" />
          <PixelButton variant="ghost" size="xs" onClick={signOut}>
            SIGN OUT
          </PixelButton>
        </div>
      </div>
    </header>
  )
}
