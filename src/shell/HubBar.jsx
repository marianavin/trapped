import { useAuth } from '../lib/AuthContext.jsx'

const TABS = [
  { id: 'levels', label: 'LEVELS' },
  { id: 'progress', label: 'PROGRESS' },
]

export default function HubBar({ tab, onTabChange, points }) {
  const { user, signOut } = useAuth()
  const initial = (user?.name || '?').trim().charAt(0).toUpperCase()

  return (
    <div className="w-full border-b-2 border-accent-cyan/30 bg-l4panel px-4 py-3 flex items-center justify-between gap-3 shadow-neon-cyan">
      <div className="flex items-center gap-2 min-w-0">
        <div
          aria-hidden="true"
          className="w-7 h-7 shrink-0 flex items-center justify-center border-2 border-accent-cyan text-accent-cyan font-pixel text-[10px] bg-l4bg neon-glow-cyan"
        >
          {initial}
        </div>
        <span className="font-mono text-xs text-l4text/75 truncate max-w-[7rem] sm:max-w-none">
          {user?.name}
        </span>
      </div>

      <div role="tablist" aria-label="Game sections" className="flex gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => onTabChange(t.id)}
            className={[
              'font-pixel text-[8px] sm:text-[9px] px-2 py-2 border-2 rounded-sm transition-all',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan',
              tab === t.id
                ? 'text-accent-cyan border-accent-cyan bg-accent-cyan/10 neon-glow-cyan'
                : 'text-l4text/60 border-transparent hover:text-accent-cyan hover:border-accent-cyan/40',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="font-pixel text-[9px] sm:text-[10px] text-accent-cyan">{points} PTS</span>
        <button
          onClick={signOut}
          className="font-mono text-[10px] text-l4text/60 hover:text-accent-magenta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan"
        >
          SIGN OUT
        </button>
      </div>
    </div>
  )
}
