import { LEVELS, isUnlocked } from '../data/levels.js'
import { PanelCard, panelAccentLabelClass } from '../components/GameUI.jsx'
import { play } from '../audio/sounds.js'

const ACCENT_BY_COLOR = {
  '#8899FF': 'purple',
  '#FF00FF': 'magenta',
  '#00F0FF': 'cyan',
}

function levelAccentKey(level) {
  return ACCENT_BY_COLOR[level.accent] ?? 'cyan'
}

function LevelCard({ level, result, locked, onPlay }) {
  const completed = Boolean(result)
  const accentKey = levelAccentKey(level)
  const accentLabel = panelAccentLabelClass(accentKey)

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
    <PanelCard
      disabled={locked}
      accent={accentKey}
      onClick={handleClick}
      aria-label={`Level ${level.index}, ${level.title}, ${statusText}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={[
            'font-pixel text-[9px] sm:text-[10px] inline-block px-1.5 py-0.5',
            locked ? '' : accentLabel,
          ].join(' ')}
        >
          LEVEL {level.index}
        </span>
        {locked && (
          <span className="font-pixel text-[8px] sm:text-[9px] text-l4-muted/80">
            {level.built ? 'LOCKED' : 'COMING SOON'}
          </span>
        )}
        {!locked && completed && (
          <span className="font-pixel text-[8px] sm:text-[9px] text-l4text/70">DONE</span>
        )}
      </div>

      <h3 className={`font-pixel text-xs sm:text-sm leading-snug ${locked ? 'text-l4-muted' : 'text-l4text'}`}>
        {level.title}
      </h3>

      <p
        className={`font-mono text-[11px] sm:text-xs leading-snug ${
          locked ? 'text-l4-muted/80' : 'text-l4text/85'
        }`}
      >
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
