import { useEffect } from 'react'
import { getLevel } from '../data/levels.js'
import PixelButton from '../components/PixelButton.jsx'

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
      <div className="fixed top-2 right-2 z-[60]">
        <PixelButton variant="dark" onClick={confirmExit} className="!px-2 !py-2 !text-[8px] sm:!text-[9px]">
          ✕ MENU
        </PixelButton>
      </div>
      <Component onComplete={handleComplete} onLevelComplete={handleComplete} />
    </div>
  )
}
