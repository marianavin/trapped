import { useEffect, useState } from 'react'
import CabinetFrame from './components/CabinetFrame.jsx'
import { LoadingScreen } from './components/GameUI.jsx'
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
    return <LoadingScreen />
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
    return <LoadingScreen message="LOADING PROGRESS…" />
  }

  return <HubScreen progress={progress} onPlay={playLevel} />
}

export default function App() {
  return (
    <CabinetFrame>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </CabinetFrame>
  )
}
