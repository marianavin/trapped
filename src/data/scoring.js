import { LEVELS, getBuiltLevels } from './levels.js'

const POINTS_PER_SURVIVED = 100
const POINTS_PER_BIAS_ESCAPED = 25

// Rolls up every completed level's normalized result into the numbers the
// hub bar and progress view show. Denominators are computed from levels
// actually completed so far, not hardcoded — see levels.js for the current
// level count and per-level bias totals.
export function computeTotals(progress) {
  const completedIds = Object.keys(progress)
  const completed = completedIds.map((id) => progress[id])
  const levelsBuilt = getBuiltLevels().length

  const scenariosSurvived = completed.filter((r) => r.outcomeSuccess).length
  const biasesEscaped = completed.reduce((sum, r) => sum + (r.escapedCount || 0), 0)
  const biasesAttempted = completed.reduce((sum, r) => sum + (r.totalBiases || 0), 0)

  const points =
    scenariosSurvived * POINTS_PER_SURVIVED + biasesEscaped * POINTS_PER_BIAS_ESCAPED

  return {
    points,
    scenariosSurvived,
    scenariosTotal: levelsBuilt,
    biasesEscaped,
    biasesAttempted, // grows as more levels are built and played
    levelsCompleted: completedIds.length,
    levelsBuilt,
  }
}
