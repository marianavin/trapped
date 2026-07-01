import { useState } from 'react'
import PixelButton from '../components/PixelButton.jsx'
import GlitchShell, { ScreenHeader } from '../components/GlitchShell.jsx'
import WindowChrome from '../components/WindowChrome.jsx'
import { useAuth } from '../lib/AuthContext.jsx'
import { ALLOWED_EMAIL_DOMAIN } from '../lib/supabaseClient.js'

export default function LoginScreen() {
  const { isMock, authError, signInWithGoogle, signInMock } = useAuth()
  const [name, setName] = useState('')

  return (
    <GlitchShell contentClassName="gap-8 px-6 py-10">
      <ScreenHeader title="TRAPPED" subtitle="Your mind is the obstacle." />

      {isMock ? (
        <WindowChrome title="DEV MODE // AUTH" className="w-full max-w-xs">
          <div className="flex flex-col items-center gap-4">
            <p className="font-pixel text-[8px] sm:text-[9px] text-accent-cyan text-center">
              GOOGLE SSO NOT CONNECTED
            </p>
            <label htmlFor="player-name" className="sr-only">
              Your name
            </label>
            <input
              id="player-name"
              name="playerName"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="YOUR NAME"
              maxLength={24}
              className="font-pixel text-[10px] w-full bg-black/40 rounded-sm neon-glow border-2 border-accent-cyan text-l4text px-3 py-3 text-center placeholder:text-l4text/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan"
              onKeyDown={(e) => e.key === 'Enter' && signInMock(name)}
            />
            <PixelButton full variant="primary" onClick={() => signInMock(name)}>
              ENTER
            </PixelButton>
          </div>
        </WindowChrome>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <PixelButton variant="primary" onClick={signInWithGoogle}>
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
      )}
    </GlitchShell>
  )
}
