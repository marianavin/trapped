import { useEffect, useState } from 'react'
import { getLevel } from '../data/levels.js'
import PixelButton from '../components/PixelButton.jsx'
import { AbortDialog, ScreenFlash } from '../components/GameUI.jsx'
import { play } from '../audio/sounds.js'

export default function LevelRunner({ levelId, onDone, onExit }) {
  const level = getLevel(levelId)
  const [showExit, setShowExit] = useState(false)
  const [flash, setFlash] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setFlash(false), 220)
    return () => clearTimeout(t)
  }, [])

  function requestExit() {
    play('questionArrive')
    setShowExit(true)
  }

  function confirmExit() {
    play('wrongBuzz')
    setShowExit(false)
    onExit()
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (showExit) setShowExit(false)
        else requestExit()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showExit])

  if (!level || !level.built) return null

  const { Component, normalizeResult } = level

  function handleComplete(payload) {
    onDone(normalizeResult(payload))
  }

  return (
    <div className="relative h-full w-full">
      <ScreenFlash show={flash} />
      <div className="absolute top-2 right-2 z-[60]">
        <PixelButton variant="ghost" size="xs" onClick={requestExit}>
          EXIT
        </PixelButton>
      </div>
      <AbortDialog open={showExit} onConfirm={confirmExit} onCancel={() => setShowExit(false)} />
      <Component onComplete={handleComplete} onLevelComplete={handleComplete} />
    </div>
  )
}
