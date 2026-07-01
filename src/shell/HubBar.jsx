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
          <div className="flex flex-col items-end gap-0 min-w-0">
            {user?.name && (
              <span className="hidden sm:block font-mono text-[10px] sm:text-[11px] text-l4text uppercase tracking-wide truncate max-w-[8rem] leading-none">
                {user.name}
              </span>
            )}
            <span className="font-mono text-[10px] sm:text-[11px] font-bold text-accent-cyan uppercase tracking-wide leading-none tabular-nums">
              {points} POINTS
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
