import { useState } from 'react'
import PixelButton from '../components/PixelButton.jsx'
import GlitchShell, { ScreenHeader } from '../components/GlitchShell.jsx'
import WindowChrome from '../components/WindowChrome.jsx'
import { TextInput } from '../components/GameUI.jsx'
import { play } from '../audio/sounds.js'
import { useAuth } from '../lib/AuthContext.jsx'
import { ALLOWED_EMAIL_DOMAIN } from '../lib/supabaseClient.js'

export default function LoginScreen() {
  const { isMock, authError, signInWithGoogle, signInMock } = useAuth()
  const [name, setName] = useState('')

  return (
    <GlitchShell contentClassName="gap-8 px-6 py-10">
      <ScreenHeader title="TRAPPED" subtitle="Your mind is the obstacle." />

      {isMock ? (
        <WindowChrome title="PLAYER LOGIN" className="w-full max-w-xs">
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
            <PixelButton full variant="primary" onClick={() => { play('connectSuccess'); signInMock(name) }}>
              ENTER
            </PixelButton>
          </div>
        </WindowChrome>
      ) : (
        <WindowChrome title="PLAYER LOGIN" className="w-full max-w-xs">
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
        </WindowChrome>
      )}
    </GlitchShell>
  )
}
