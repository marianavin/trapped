import { getLevel } from '../data/levels.js'

// Renders whichever built level is active and normalizes its result before
// handing it back to the shell. Existing level components use slightly
// different completion prop names (Level3: onComplete, Level4:
// onLevelComplete) — passing both is harmless since each component only
// reads the one it defines.
export default function LevelRunner({ levelId, onDone }) {
  const level = getLevel(levelId)
  if (!level || !level.built) return null

  const { Component, normalizeResult } = level

  function handleComplete(payload) {
    onDone(normalizeResult(payload))
  }

  return (
    <div className="h-full w-full">
      <Component onComplete={handleComplete} onLevelComplete={handleComplete} />
    </div>
  )
}
