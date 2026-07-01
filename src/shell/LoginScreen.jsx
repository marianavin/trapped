import { useEffect, useState } from 'react'
import PixelButton from '../components/PixelButton.jsx'
import GlitchShell, { ScreenHeader } from '../components/GlitchShell.jsx'
import DraggableWindow from '../components/DraggableWindow.jsx'
import { TextInput } from '../components/GameUI.jsx'
import { play } from '../audio/sounds.js'
import { useAuth } from '../lib/AuthContext.jsx'
import { ALLOWED_EMAIL_DOMAIN } from '../lib/supabaseClient.js'

const INTRO_LINES = [
  'Your mind is the obstacle.',
  'Your confidence is the trap.',
]

function LoginIntro() {
  return (
    <div className="relative z-0 -translate-y-[50px] font-mono text-xs sm:text-sm text-l4text/80 leading-relaxed text-center flex flex-col gap-2 px-2">
      {INTRO_LINES.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  )
}

export default function LoginScreen() {
  const { isMock, authError, signInWithGoogle, signInMock } = useAuth()
  const [name, setName] = useState('')

  useEffect(() => {
    play('bootChime')
  }, [])

  return (
    <GlitchShell contentClassName="gap-8 px-6 py-10 overflow-visible" className="overflow-visible">
      <ScreenHeader title="TRAPPED" className="-translate-y-[50px]" />

      <div className="relative flex flex-col items-center gap-4 w-full max-w-xs overflow-visible">
        <LoginIntro />

        {isMock ? (
          <DraggableWindow title="PLAYER LOGIN" className="relative z-20 w-full" staticTrailCount={20} staticTrailStep={5}>
            <div className="flex flex-col items-center gap-4">
              <p className="font-pixel text-[8px] sm:text-[9px] text-accent-cyan text-center">
                ENTER A NICKNAME FOR THE LEADERBOARD
              </p>
              <label htmlFor="player-name" className="sr-only">
                Your name
              </label>
              <TextInput
                id="player-name"
                name="playerName"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="YOUR NAME"
                maxLength={24}
                onKeyDown={(e) => e.key === 'Enter' && signInMock(name)}
              />
              <PixelButton full variant="purple" onClick={() => { play('connectSuccess'); signInMock(name) }}>
                BEGIN
              </PixelButton>
            </div>
          </DraggableWindow>
        ) : (
          <DraggableWindow title="PLAYER LOGIN" className="relative z-20 w-full" staticTrailCount={20} staticTrailStep={5}>
            <div className="flex flex-col items-center gap-4">
              <PixelButton full variant="primary" onClick={signInWithGoogle}>
                CONTINUE WITH GOOGLE
              </PixelButton>
              {ALLOWED_EMAIL_DOMAIN && (
                <p className="font-mono text-xs text-l4text/60">@{ALLOWED_EMAIL_DOMAIN} accounts only</p>
              )}
              {authError && (
                <p role="alert" className="font-mono text-xs text-caught">
                  {authError}
                </p>
              )}
            </div>
          </DraggableWindow>
        )}
      </div>
    </GlitchShell>
  )
}
