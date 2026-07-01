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
    accent: '#8899FF',
    built: true,
    totalBiases: 3,
    hook: '60 SECONDS. THREE WIRES. SOMEONE IS LYING.',
    Component: Level2,
    // Level2's onComplete already emits the normalized shape directly.
    normalizeResult: (payload) => payload,
  },
  {
    id: 'level2',
    index: 2,
    title: 'THE SCRAMBLED KEYPAD',
    accent: '#FF00FF',
    built: true,
    totalBiases: 4,
    hook: 'SOMEONE NEEDS HELP. CALL 112.',
    Component: Level3,
    // Level3's onComplete already emits the normalized shape directly.
    normalizeResult: (payload) => payload,
  },
  {
    id: 'level3',
    index: 3,
    title: 'THE WITNESS',
    accent: '#00F0FF',
    built: false,
    totalBiases: 4,
    hook: 'YOU SAW IT. OR DID YOU?',
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

// A level's `built` flag gates whether its code exists yet. Sequential
// unlock requires the previous level to appear in `progress` (player reached
// reveal and continued). Level 1 is always playable when built.
export function isUnlocked(levelId, progress = {}) {
  const level = getLevel(levelId)
  if (!level?.built) return false

  const index = LEVELS.findIndex((l) => l.id === levelId)
  if (index <= 0) return true

  const previous = LEVELS[index - 1]
  return Boolean(progress[previous.id])
}
