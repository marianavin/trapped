import { useState } from 'react'
import PixelButton from '../components/PixelButton.jsx'
import { useAuth } from '../lib/AuthContext.jsx'
import { ALLOWED_EMAIL_DOMAIN } from '../lib/supabaseClient.js'

// Real mode: Google SSO restricted to the org's Workspace domain (see
// SUPABASE_SETUP.md for how the restriction is enforced both at the OAuth
// request and again on the returned session).
// Mock mode (no Supabase configured yet): a nickname field stands in for
// login so the shell is fully playable before the backend exists.
export default function LoginScreen() {
  const { isMock, authError, signInWithGoogle, signInMock } = useAuth()
  const [name, setName] = useState('')

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-8 bg-l4bg text-l4text px-6 text-center">
      <div>
        <h1 className="font-pixel text-2xl sm:text-4xl tracking-widest">TRAPPED</h1>
        <p className="font-mono text-sm sm:text-base text-l4text/80 mt-3">Your mind is the obstacle.</p>
      </div>

      {isMock ? (
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <p className="font-pixel text-[9px] sm:text-[10px] text-l4street">
            DEV MODE — GOOGLE SSO NOT CONNECTED YET
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
            className="font-pixel text-[10px] w-full bg-transparent border-4 border-l4text text-l4text px-3 py-3 text-center placeholder:text-l4text/60 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
            onKeyDown={(e) => e.key === 'Enter' && signInMock(name)}
          />
          <PixelButton full onClick={() => signInMock(name)}>
            ENTER
          </PixelButton>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <PixelButton onClick={signInWithGoogle}>CONTINUE WITH GOOGLE</PixelButton>
          {ALLOWED_EMAIL_DOMAIN && (
            <p className="font-mono text-xs text-l4text/70">@{ALLOWED_EMAIL_DOMAIN} accounts only</p>
          )}
          {authError && (
            <p role="alert" className="font-mono text-xs text-caught">
              {authError}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
