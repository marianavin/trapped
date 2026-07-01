import { LEVELS, isUnlocked } from '../data/levels.js'

function LevelCard({ level, result, locked, onPlay }) {
  const completed = Boolean(result)

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
        'pixel-border text-left p-4 flex flex-col gap-2 transition-colors',
        'focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-yellow-300',
        // was text-l4text/30 on bg-l4panel/40 — the two stacked opacities
        // compressed the actual rendered contrast to ~2.4:1 (fails WCAG's
        // 4.5:1) at an 8-10px pixel font, per user report. /70 on a single
        // layer keeps the "disabled" look but lands ~7.5:1.
        locked ? 'bg-l4panel/40 text-l4text/70 cursor-not-allowed' : 'bg-l4panel text-l4text hover:bg-l4text hover:text-l4panel cursor-pointer',
      ].join(' ')}
      style={
        !locked
          ? { borderColor: level.accent, boxShadow: `0 0 5px ${level.accent}, 0 0 16px ${level.accent}66` }
          : undefined
      }
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

// Grid of all levels, in order. A level renders locked either because its
// code isn't shipped yet (level.built) or because the player hasn't
// finished every level before it (isUnlocked) — the game is strictly
// sequential: level 1 has no prerequisite, level 2 requires level 1
// complete, level 3 requires levels 1 and 2 complete.
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
