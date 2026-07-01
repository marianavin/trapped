import { useEffect } from 'react'
import { getLevel } from '../data/levels.js'

// Renders whichever built level is active and normalizes its result before
// handing it back to the shell. Existing level components use slightly
// different completion prop names (Level3: onComplete, Level4:
// onLevelComplete) — passing both is harmless since each component only
// reads the one it defines.
//
// Also renders the only way out of a level mid-play: an EXIT control (plus
// Escape key) that backs out to the hub without saving a result. Unmounting
// the level component runs its own cleanup (e.g. stopSiren/stopAlarm), so
// no extra teardown is needed here.
export default function LevelRunner({ levelId, onDone, onExit }) {
  const level = getLevel(levelId)

  function confirmExit() {
    const ok = window.confirm("Exit this level? Your progress on this level won't be saved.")
    if (ok) onExit()
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') confirmExit()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!level || !level.built) return null

  const { Component, normalizeResult } = level

  function handleComplete(payload) {
    onDone(normalizeResult(payload))
  }

  return (
    <div className="relative h-full w-full">
      <button
        type="button"
        onClick={confirmExit}
        title="Exit to menu"
        className="fixed top-2 right-2 z-[60] font-pixel text-[8px] sm:text-[9px] px-2 py-2 bg-black/70 text-white/80 border-2 border-white/40 hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
      >
        ✕ MENU
      </button>
      <Component onComplete={handleComplete} onLevelComplete={handleComplete} />
    </div>
  )
}
