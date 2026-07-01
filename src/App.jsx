import { useEffect, useState } from 'react'
import CRTOverlay from './components/CRTOverlay.jsx'
import TitleScreen from './screens/TitleScreen.jsx'
import LoginScreen from './shell/LoginScreen.jsx'
import HubScreen from './shell/HubScreen.jsx'
import LevelRunner from './shell/LevelRunner.jsx'
import { AuthProvider, useAuth } from './lib/AuthContext.jsx'
import { loadProgress, saveLevelResult } from './lib/progressStore.js'

// The UI shell: initialise -> onboard -> login -> hub (level select /
// progress) -> play a level -> back to hub. This replaces the old
// title -> Level4 -> complete flow now that the game has a real home base.
function AppShell() {
  const { status, user } = useAuth()
  const [onboarded, setOnboarded] = useState(false)
  const [progress, setProgress] = useState({})
  const [progressReady, setProgressReady] = useState(false)
  const [activeLevelId, setActiveLevelId] = useState(null)
  const [playKey, setPlayKey] = useState(0)

  useEffect(() => {
    if (status !== 'signedIn' || !user) {
      setProgressReady(false)
      return
    }
    let cancelled = false
    loadProgress(user.id).then((p) => {
      if (!cancelled) {
        setProgress(p)
        setProgressReady(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [status, user])

  async function handleLevelDone(normalizedResult) {
    const levelId = activeLevelId
    setActiveLevelId(null)
    if (!user) return
    const updated = await saveLevelResult(user.id, levelId, normalizedResult)
    setProgress(updated)
  }

  function playLevel(levelId) {
    setPlayKey((k) => k + 1)
    setActiveLevelId(levelId)
  }

  if (status === 'loading') {
    return (
      <div role="status" aria-live="polite" className="h-full w-full flex items-center justify-center bg-l4bg text-accent-cyan">
        <p className="font-pixel text-xs animate-pulse glitch-shift">LOADING…</p>
      </div>
    )
  }

  if (status === 'signedOut') {
    if (!onboarded) {
      return <TitleScreen onBegin={() => setOnboarded(true)} />
    }
    return <LoginScreen />
  }

  // signedIn
  if (activeLevelId) {
    return (
      <LevelRunner
        key={playKey}
        levelId={activeLevelId}
        onDone={handleLevelDone}
        onExit={() => setActiveLevelId(null)}
      />
    )
  }

  if (!progressReady) {
    return (
      <div role="status" aria-live="polite" className="h-full w-full flex items-center justify-center bg-l4bg text-accent-cyan">
        <p className="font-pixel text-xs animate-pulse glitch-shift">LOADING PROGRESS…</p>
      </div>
    )
  }

  return <HubScreen progress={progress} onPlay={playLevel} />
}

export default function App() {
  return (
    <div className="h-screen w-screen crt-flicker">
      <CRTOverlay />
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </div>
  )
}
