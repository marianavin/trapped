import Level1 from '../levels/level1/Level1.jsx'
import Level2 from '../level2/Level2.jsx'
import Level3 from '../levels/level3/Level3.jsx'
import Level4 from '../level4/Level4.jsx'

// Single source of truth for the level-select grid and progress view.
// Titles are copy-spec exact (TRAPPED_Content_Copy_Spec.md section headers).
export const LEVELS = [
  {
    id: 'level1',
    index: 1,
    title: 'THE ESCAPE',
    accent: '#FFB347',
    built: true,
    totalBiases: 3,
    Component: Level1,
    // Level1's onComplete already emits the normalized shape directly.
    normalizeResult: (payload) => payload,
  },
  {
    id: 'level2',
    index: 2,
    title: 'THE BOMB',
    accent: '#00FF41',
    built: true,
    totalBiases: 3,
    Component: Level2,
    // Level2's onComplete already emits the normalized shape directly.
    normalizeResult: (payload) => payload,
  },
  {
    id: 'level3',
    index: 3,
    title: 'THE SCRAMBLED KEYPAD',
    accent: '#A8C8E8',
    built: true,
    totalBiases: 2,
    Component: Level3,
    // Level3's onComplete already emits the normalized shape directly.
    normalizeResult: (payload) => payload,
  },
  {
    id: 'level4',
    index: 4,
    title: 'THE WITNESS',
    accent: '#FFD166',
    built: true,
    totalBiases: 4,
    Component: Level4,
    // Level4 always ends on a fixed narrative outcome (the wrong car gets
    // flagged regardless of the final confirm) — only the process/bias
    // score varies. See TRAPPED_Content_Copy_Spec.md, Level 4 consequence.
    normalizeResult: (payload) => ({
      outcomeSuccess: false,
      totalBiases: 4,
      escapedCount: payload.escapedCount,
      results: payload.results,
    }),
  },
]

export const TOTAL_LEVEL_COUNT = LEVELS.length

export function getLevel(levelId) {
  return LEVELS.find((l) => l.id === levelId)
}

export function getBuiltLevels() {
  return LEVELS.filter((l) => l.built)
}
