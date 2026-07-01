import Level2 from '../level2/Level2.jsx'
import Level3 from '../levels/level3/Level3.jsx'
import Level4 from '../level4/Level4.jsx'

// Single source of truth for the level-select grid and progress view.
// Titles are copy-spec exact (TRAPPED_Content_Copy_Spec.md section headers).
//
// The old Level 1 ("The Escape") has been cut from the game entirely. The
// remaining three levels kept their component/source-file names (Level2,
// Level3, Level4 — historical, tied to their original directories) but were
// renumbered here so the game now runs Bomb -> Scrambled Keypad -> Witness
// as levels 1, 2, 3. The `id`/`index`/`title` fields below are the only
// source of truth for display order and progress-tracking keys; they're
// intentionally decoupled from the component/folder names.
export const LEVELS = [
  {
    id: 'level1',
    index: 1,
    title: 'THE BOMB',
    accent: '#2DE8FF',
    built: true,
    totalBiases: 3,
    Component: Level2,
    // Level2's onComplete already emits the normalized shape directly.
    normalizeResult: (payload) => payload,
  },
  {
    id: 'level2',
    index: 2,
    title: 'THE SCRAMBLED KEYPAD',
    accent: '#2DE8FF',
    built: true,
    totalBiases: 4,
    Component: Level3,
    // Level3's onComplete already emits the normalized shape directly.
    normalizeResult: (payload) => payload,
  },
  {
    id: 'level3',
    index: 3,
    title: 'THE WITNESS',
    accent: '#2DE8FF',
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

// A level's `built` flag gates "does this level's code exist yet" (for any
// future level added mid-development). This gates the separate, player-
// facing rule: each level only opens once every level before it in display
// order has been played through to a result — "level 2 and 3 require level
// 1 complete; level 3 also requires level 2 complete." Level 1 has no
// prerequisite. `progress` is the { [levelId]: normalizedResult } map from
// progressStore.js — any recorded result (win or lose) counts as complete,
// consistent with how "DONE" already works elsewhere in the hub.
export function isUnlocked(levelId, progress) {
  const idx = LEVELS.findIndex((l) => l.id === levelId)
  if (idx <= 0) return true
  return LEVELS.slice(0, idx).every((l) => Boolean(progress[l.id]))
}
