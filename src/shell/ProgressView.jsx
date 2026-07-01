import { LEVELS } from '../data/levels.js'
import { computeTotals } from '../data/scoring.js'

function LevelRow({ level, result }) {
  const locked = !level.built
  const completed = Boolean(result)

  let status = 'LOCKED'
  if (!locked) status = completed ? 'COMPLETE' : 'NOT STARTED'

  return (
    <li className="flex items-center justify-between gap-3 font-mono text-xs sm:text-sm py-3 border-b border-l4text/10">
      <div className="flex flex-col">
        <span className="font-pixel text-[9px] sm:text-[10px]" style={{ color: locked ? undefined : level.accent }}>
          LEVEL {level.index} — {level.title}
        </span>
        <span className="text-l4text/75 text-[10px] sm:text-xs mt-1">{status}</span>
      </div>
      <div className="text-right shrink-0">
        {completed ? (
          <>
            <div className={result.outcomeSuccess ? 'text-escaped' : 'text-caught'}>
              {result.outcomeSuccess ? '✓ SURVIVED' : '✗ DID NOT SURVIVE'}
            </div>
            <div className="text-l4text/70">
              {result.escapedCount}/{result.totalBiases} BIASES ESCAPED
            </div>
          </>
        ) : (
          <span className="text-l4text/50">—</span>
        )}
      </div>
    </li>
  )
}

// "How far along am I" view. Uses the exact global score labels from
// TRAPPED_Content_Copy_Spec.md (SCENARIOS SURVIVED / BIASES ESCAPED).
// Radar chart / named profile are intentionally out of scope here — the
// blueprint marks those cut-if-short-on-time and they only make sense once
// all 4 levels exist; this is the simple-list fallback it names instead.
export default function ProgressView({ progress }) {
  const totals = computeTotals(progress)

  return (
    <div className="w-full max-w-2xl mx-auto p-5 flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="pixel-border p-4">
          <p className="font-pixel text-xl sm:text-2xl text-caught">
            {totals.scenariosSurvived}/{totals.scenariosTotal}
          </p>
          <p className="font-mono text-[10px] sm:text-xs text-l4text/70 mt-2">SCENARIOS SURVIVED</p>
        </div>
        <div className="pixel-border p-4">
          <p className="font-pixel text-xl sm:text-2xl text-escaped">
            {totals.biasesEscaped}/{totals.biasesAttempted || 0}
          </p>
          <p className="font-mono text-[10px] sm:text-xs text-l4text/70 mt-2">BIASES ESCAPED</p>
        </div>
      </div>

      <div className="text-center">
        <p className="font-pixel text-lg sm:text-xl text-l4street">{totals.points} PTS</p>
        <p className="font-mono text-[10px] text-l4text/75 mt-1">
          {totals.levelsCompleted}/{totals.levelsBuilt} AVAILABLE LEVELS COMPLETE
        </p>
      </div>

      <h2 className="sr-only">Per-level breakdown</h2>
      <ul>
        {LEVELS.map((level) => (
          <LevelRow key={level.id} level={level} result={progress[level.id]} />
        ))}
      </ul>
    </div>
  )
}
