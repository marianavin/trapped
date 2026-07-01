import { LEVELS, isUnlocked } from '../data/levels.js'
import { computeTotals } from '../data/scoring.js'
import { ListRow, StatCard } from '../components/GameUI.jsx'

function LevelRow({ level, result, locked }) {
  const completed = Boolean(result)

  let status = 'LOCKED'
  if (locked && !level.built) status = 'COMING SOON'
  else if (!locked) status = completed ? 'COMPLETE' : 'NOT STARTED'

  return (
    <ListRow>
      <div className="flex flex-col flex-1 min-w-0">
        <span className={`font-pixel text-[9px] sm:text-[10px] ${locked ? 'text-l4text/60' : 'text-accent-cyan'}`}>
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
    </ListRow>
  )
}

export default function ProgressView({ progress }) {
  const totals = computeTotals(progress)

  return (
    <div className="w-full max-w-2xl mx-auto p-5 flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 text-center">
        <StatCard tone="caught">
          <p className="font-pixel text-xl sm:text-2xl">
            {totals.scenariosSurvived}/{totals.scenariosTotal}
          </p>
          <p className="font-mono text-[10px] sm:text-xs text-l4text/60 mt-2">SCENARIOS SURVIVED</p>
        </StatCard>
        <StatCard tone="cyan">
          <p className="font-pixel text-xl sm:text-2xl">
            {totals.biasesEscaped}/{totals.biasesAttempted || 0}
          </p>
          <p className="font-mono text-[10px] sm:text-xs text-l4text/60 mt-2">BIASES ESCAPED</p>
        </StatCard>
      </div>

      <div className="text-center">
        <p className="font-pixel text-lg sm:text-xl text-accent-cyan">{totals.points} POINTS</p>
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
