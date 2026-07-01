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
        <div
          aria-hidden="true"
          className="w-7 h-7 shrink-0 flex items-center justify-center pixel-border font-pixel text-[10px] text-l4text bg-l4bg"
        >
          {initial}
        </div>
        <span className="font-mono text-xs text-l4text/80 truncate max-w-[7rem] sm:max-w-none">
          Signed in as {user?.name}
        </span>
      </div>

      <div role="tablist" aria-label="Game sections" className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => onTabChange(t.id)}
            className={[
              'font-pixel text-[9px] sm:text-[10px] px-2 py-2 border-b-2 transition-colors',
              'focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-yellow-300',
              tab === t.id ? 'text-l4street border-l4street' : 'text-l4text/75 border-transparent hover:text-l4text',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="font-pixel text-[10px] sm:text-xs text-l4street">{points} PTS</span>
        <button
          onClick={signOut}
          className="font-mono text-[10px] text-l4text/75 hover:text-l4text focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
        >
          SIGN OUT
        </button>
      </div>
    </div>
  )
}
