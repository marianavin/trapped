import { useEffect, useState } from 'react'
import CabinetFrame from './components/CabinetFrame.jsx'
import { LoadingScreen } from './components/GameUI.jsx'
import LoginScreen from './shell/LoginScreen.jsx'
import HubScreen from './shell/HubScreen.jsx'
import LevelRunner from './shell/LevelRunner.jsx'
import { AuthProvider, useAuth } from './lib/AuthContext.jsx'
import { loadProgress, saveLevelResult } from './lib/progressStore.js'
import { isUnlocked } from './data/levels.js'

// The UI shell: login -> hub (level select / progress) -> play a level -> back to hub.
function AppShell() {
  const { status, user } = useAuth()
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
    if (!isUnlocked(levelId, progress)) return
    setPlayKey((k) => k + 1)
    setActiveLevelId(levelId)
  }

  if (status === 'loading') {
    return <LoadingScreen />
  }

  if (status === 'signedOut') {
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
