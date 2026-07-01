import { LEVELS, isUnlocked } from '../data/levels.js'
import { computeTotals } from '../data/scoring.js'

function LevelRow({ level, result, locked }) {
  const completed = Boolean(result)

  let status = 'LOCKED'
  if (!locked) status = completed ? 'COMPLETE' : 'NOT STARTED'

  return (
    <li className="flex items-center justify-between gap-3 font-mono text-xs sm:text-sm py-3 border-b border-accent-cyan/10">
      <div className="flex flex-col">
        <span className="font-pixel text-[9px] sm:text-[10px]" style={{ color: locked ? undefined : '#00F0FF' }}>
          LEVEL {level.index} — {level.title}
        </span>
        <span className="text-l4text/60 text-[10px] sm:text-xs mt-1">{status}</span>
      </div>
      <div className="text-right shrink-0">
        {completed ? (
          <>
            <div className={`${result.outcomeSuccess ? 'text-escaped' : 'text-caught'} inline-flex items-center gap-1`}>
              <span aria-hidden="true" className="font-sans text-base font-bold leading-none">
                {result.outcomeSuccess ? '✓' : '✗'}
              </span>
              {result.outcomeSuccess ? 'SURVIVED' : 'DID NOT SURVIVE'}
            </div>
            <div className="text-l4text/60">
              {result.escapedCount}/{result.totalBiases} BIASES ESCAPED
            </div>
          </>
        ) : (
          <span className="text-l4text/40">—</span>
        )}
      </div>
    </li>
  )
}

export default function ProgressView({ progress }) {
  const totals = computeTotals(progress)

  return (
    <div className="w-full max-w-2xl mx-auto p-5 flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="gw-panel-grid border-2 border-caught rounded-sm p-4 text-caught" style={{ boxShadow: '0 0 4px #FF3131, 0 0 14px #FF313144' }}>
          <p className="font-pixel text-xl sm:text-2xl">
            {totals.scenariosSurvived}/{totals.scenariosTotal}
          </p>
          <p className="font-mono text-[10px] sm:text-xs text-l4text/60 mt-2">SCENARIOS SURVIVED</p>
        </div>
        <div className="gw-panel-grid border-2 border-escaped rounded-sm p-4 text-escaped" style={{ boxShadow: '0 0 4px #00F0FF, 0 0 14px #00F0FF44' }}>
          <p className="font-pixel text-xl sm:text-2xl">
            {totals.biasesEscaped}/{totals.biasesAttempted || 0}
          </p>
          <p className="font-mono text-[10px] sm:text-xs text-l4text/60 mt-2">BIASES ESCAPED</p>
        </div>
      </div>

      <div className="text-center">
        <p className="font-pixel text-lg sm:text-xl text-accent-cyan">{totals.points} PTS</p>
        <p className="font-mono text-[10px] text-l4text/60 mt-1">
          {totals.levelsCompleted}/{totals.levelsBuilt} AVAILABLE LEVELS COMPLETE
        </p>
      </div>

      <h2 className="sr-only">Per-level breakdown</h2>
      <ul>
        {LEVELS.map((level) => {
          const locked = !level.built || !isUnlocked(level.id, progress)
          return <LevelRow key={level.id} level={level} result={progress[level.id]} locked={locked} />
        })}
      </ul>
    </div>
  )
}
