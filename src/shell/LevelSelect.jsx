import { LEVELS, isUnlocked } from '../data/levels.js'
import { PanelCard } from '../components/GameUI.jsx'
import { play } from '../audio/sounds.js'

function LevelCard({ level, result, locked, onPlay }) {
  const completed = Boolean(result)

  const statusText = locked
    ? level.built
      ? 'locked, complete the previous level first'
      : 'locked, coming soon'
    : completed
    ? `completed, ${result.escapedCount} of ${result.totalBiases} biases escaped`
    : 'not started'

  function handleClick() {
    if (locked) return
    play('questionArrive')
    onPlay(level.id)
  }

  return (
    <PanelCard disabled={locked} onClick={handleClick} aria-label={`Level ${level.index}, ${level.title}, ${statusText}`}>
      <div className="flex items-center justify-between">
        <span className={`font-pixel text-[9px] sm:text-[10px] ${locked ? '' : 'text-accent-cyan'}`}>
          LEVEL {level.index}
        </span>
        {locked && (
          <span className="font-pixel text-[8px] sm:text-[9px] text-l4text/70">
            {level.built ? 'LOCKED' : 'COMING SOON'}
          </span>
        )}
        {!locked && completed && <span className="font-pixel text-[8px] sm:text-[9px] text-escaped">DONE</span>}
      </div>

      <h3 className="font-pixel text-xs sm:text-sm leading-snug">{level.title}</h3>

      <p className="font-mono text-[11px] sm:text-xs text-l4text/75 leading-snug">
        {locked
          ? level.built
            ? 'COMPLETE THE PREVIOUS LEVEL'
            : 'COMING SOON'
          : completed
          ? `${result.escapedCount}/${result.totalBiases} BIASES ESCAPED`
          : level.hook}
      </p>
    </PanelCard>
  )
}

export default function LevelSelect({ progress, onPlay }) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-lg mx-auto p-5">
      {LEVELS.map((level) => {
        const locked = !level.built || !isUnlocked(level.id, progress)
        return (
          <LevelCard key={level.id} level={level} result={progress[level.id]} locked={locked} onPlay={onPlay} />
        )
      })}
    </div>
  )
}
