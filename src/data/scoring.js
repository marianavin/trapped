import { LEVELS, TOTAL_LEVEL_COUNT } from './levels.js'

const POINTS_PER_SURVIVED = 100
const POINTS_PER_BIAS_ESCAPED = 25

// Rolls up every completed level's normalized result into the numbers the
// hub bar and progress view show. Denominators are computed from levels
// actually completed so far, not hardcoded — the game only has 2 of its
// 4 levels built right now (see levels.js).
export function computeTotals(progress) {
  const completedIds = Object.keys(progress)
  const completed = completedIds.map((id) => progress[id])

  const scenariosSurvived = completed.filter((r) => r.outcomeSuccess).length
  const biasesEscaped = completed.reduce((sum, r) => sum + (r.escapedCount || 0), 0)
  const biasesAttempted = completed.reduce((sum, r) => sum + (r.totalBiases || 0), 0)

  const points =
    scenariosSurvived * POINTS_PER_SURVIVED + biasesEscaped * POINTS_PER_BIAS_ESCAPED

  return {
    points,
    scenariosSurvived,
    scenariosTotal: TOTAL_LEVEL_COUNT, // 4 — the full game, per copy spec
    biasesEscaped,
    biasesAttempted, // grows to 14 once all 4 levels are built and played
    levelsCompleted: completedIds.length,
    levelsBuilt: LEVELS.filter((l) => l.built).length,
  }
}
