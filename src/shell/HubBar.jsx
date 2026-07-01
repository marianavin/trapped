import { useAuth } from '../lib/AuthContext.jsx'

const TABS = [
  { id: 'levels', label: 'LEVELS' },
  { id: 'progress', label: 'PROGRESS' },
]

// Persistent nav shown across the level-select and progress screens only —
// never during play, so it doesn't dilute the tension of a level in
// progress (per the "no decorative elements" visual rule).
export default function HubBar({ tab, onTabChange, points }) {
  const { user, signOut } = useAuth()
  const initial = (user?.name || '?').trim().charAt(0).toUpperCase()

  return (
    <div className="w-full border-b-4 border-l4text/20 bg-l4panel px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 shrink-0 flex items-center justify-center pixel-border font-pixel text-[10px] text-l4text bg-l4bg">
          {initial}
        </div>
        <span className="font-mono text-xs text-l4text/80 truncate max-w-[7rem] sm:max-w-none">
          {user?.name}
        </span>
      </div>

      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={[
              'font-pixel text-[9px] sm:text-[10px] px-2 py-2 transition-colors',
              tab === t.id ? 'text-l4street' : 'text-l4text/50 hover:text-l4text',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="font-pixel text-[10px] sm:text-xs text-l4street">{points} PTS</span>
        <button onClick={signOut} className="font-mono text-[10px] text-l4text/50 hover:text-l4text">
          SIGN OUT
        </button>
      </div>
    </div>
  )
}
