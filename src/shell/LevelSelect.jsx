import { LEVELS, isUnlocked } from '../data/levels.js'

function LevelCard({ level, result, locked, onPlay }) {
  const completed = Boolean(result)
  const accent = locked ? undefined : '#00F0FF'

  const statusText = locked
    ? level.built
      ? 'locked, complete the previous level first'
      : 'locked, coming soon'
    : completed
    ? `completed, ${result.escapedCount} of ${result.totalBiases} biases escaped`
    : 'not started'

  return (
    <button
      onClick={() => !locked && onPlay(level.id)}
      disabled={locked}
      aria-label={`Level ${level.index}, ${level.title}, ${statusText}`}
      className={[
        'text-left p-4 flex flex-col gap-2 transition-all border-2 rounded-sm',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan',
        locked
          ? 'bg-l4panel/50 text-l4text/60 border-l4text/20 cursor-not-allowed'
          : 'gw-panel-grid text-l4text cursor-pointer hover:brightness-110',
      ].join(' ')}
      style={
        !locked
          ? { borderColor: accent, boxShadow: `0 0 4px ${accent}, 0 0 14px ${accent}44` }
          : undefined
      }
    >
      <div className="flex items-center justify-between">
        <span className="font-pixel text-[9px] sm:text-[10px]" style={!locked ? { color: accent } : undefined}>
          LEVEL {level.index}
        </span>
        {locked && <span className="font-pixel text-[8px] sm:text-[9px] text-l4text/50">LOCKED</span>}
        {!locked && completed && <span className="font-pixel text-[8px] sm:text-[9px] text-escaped">DONE</span>}
      </div>

      <h3 className="font-pixel text-xs sm:text-sm leading-snug">{level.title}</h3>

      <p className="font-mono text-[11px] sm:text-xs opacity-70">
        {locked
          ? level.built
            ? 'COMPLETE THE PREVIOUS LEVEL'
            : 'COMING SOON'
          : completed
          ? `${result.escapedCount}/${result.totalBiases} BIASES ESCAPED`
          : 'NOT STARTED — TAP TO PLAY'}
      </p>
    </button>
  )
}

export default function LevelSelect({ progress, onPlay }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mx-auto p-5">
      {LEVELS.map((level) => {
        const locked = !level.built || !isUnlocked(level.id, progress)
        return (
          <LevelCard key={level.id} level={level} result={progress[level.id]} locked={locked} onPlay={onPlay} />
        )
      })}
    </div>
  )
}
