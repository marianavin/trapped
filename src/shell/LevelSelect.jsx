import { LEVELS } from '../data/levels.js'

function LevelCard({ level, result, onPlay }) {
  const locked = !level.built
  const completed = Boolean(result)

  const statusText = locked
    ? 'locked, coming soon'
    : completed
    ? `completed, ${result.escapedCount} of ${result.totalBiases} biases escaped`
    : 'not started'

  return (
    <button
      onClick={() => !locked && onPlay(level.id)}
      disabled={locked}
      aria-label={`Level ${level.index}, ${level.title}, ${statusText}`}
      className={[
        'pixel-border text-left p-4 flex flex-col gap-2 transition-colors',
        'focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-yellow-300',
        locked ? 'bg-l4panel/40 text-l4text/30 cursor-not-allowed' : 'bg-l4panel text-l4text hover:bg-l4text hover:text-l4panel cursor-pointer',
      ].join(' ')}
      style={!locked ? { borderColor: level.accent } : undefined}
    >
      <div className="flex items-center justify-between">
        <span className="font-pixel text-[9px] sm:text-[10px]" style={!locked ? { color: level.accent } : undefined}>
          LEVEL {level.index}
        </span>
        {locked && <span className="font-pixel text-[8px] sm:text-[9px]">LOCKED</span>}
        {!locked && completed && <span className="font-pixel text-[8px] sm:text-[9px] text-escaped">DONE</span>}
      </div>

      <h3 className="font-pixel text-xs sm:text-sm leading-snug">{level.title}</h3>

      <p className="font-mono text-[11px] sm:text-xs opacity-70">
        {locked
          ? 'COMING SOON'
          : completed
          ? `${result.escapedCount}/${result.totalBiases} BIASES ESCAPED`
          : 'NOT STARTED — TAP TO PLAY'}
      </p>
    </button>
  )
}

// Grid of all 4 levels. Levels 1 and 2 render locked until they're built
// (see levels.js) — the blueprint's level order still shows end-to-end so
// players understand the full arc, per the Progression design lens.
export default function LevelSelect({ progress, onPlay }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mx-auto p-5">
      {LEVELS.map((level) => (
        <LevelCard key={level.id} level={level} result={progress[level.id]} onPlay={onPlay} />
      ))}
    </div>
  )
}
