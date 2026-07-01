import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured, ALLOWED_EMAIL_DOMAIN, GOOGLE_SSO_ENABLED } from './supabaseClient.js'
import { upsertPlayer } from './progressStore.js'

const MOCK_USER_KEY = 'trapped_mock_user'

// Nickname login is used whenever Google SSO isn't switched on, regardless
// of whether Supabase itself is configured — see GOOGLE_SSO_ENABLED in
// supabaseClient.js for why.
const USE_GOOGLE_AUTH = GOOGLE_SSO_ENABLED && isSupabaseConfigured

const AuthContext = createContext(null)

function domainOf(email) {
  return typeof email === 'string' && email.includes('@') ? email.split('@')[1].toLowerCase() : null
}

function randomId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  // Fallback for environments without crypto.randomUUID (older Safari).
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function loadMockUser() {
  try {
    const raw = localStorage.getItem(MOCK_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

// Wraps real Supabase Google SSO when configured (see supabaseClient.js);
// otherwise falls back to a local-only mock login so the shell, level
// select and progress view are fully playable before the backend exists.
// Swap-in is automatic — no component outside this file needs to know
// which mode is active.
export function AuthProvider({ children }) {
  const [status, setStatus] = useState('loading') // loading | signedOut | signedIn
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    if (!USE_GOOGLE_AUTH) {
      const mock = loadMockUser()
      setUser(mock)
      setStatus(mock ? 'signedIn' : 'signedOut')
      return
    }

    let unsub = () => {}

    supabase.auth
      .getSession()
      .then(({ data }) => {
        applySession(data.session)
      })
      .catch((err) => {
        console.error('Failed to get session:', err.message)
        setStatus('signedOut')
      })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session)
    })
    unsub = () => listener.subscription.unsubscribe()

    return unsub
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function applySession(session) {
    const sessionUser = session?.user ?? null
    if (!sessionUser) {
      setUser(null)
      setStatus('signedOut')
      return
    }

    const email = sessionUser.email
    if (ALLOWED_EMAIL_DOMAIN && domainOf(email) !== ALLOWED_EMAIL_DOMAIN.toLowerCase()) {
      setAuthError(`Use your ${ALLOWED_EMAIL_DOMAIN} account to sign in.`)
      supabase.auth.signOut().catch((err) => console.error('Failed to sign out:', err.message))
      setUser(null)
      setStatus('signedOut')
      return
    }

    setAuthError(null)
    setUser({
      id: sessionUser.id,
      email,
      name: sessionUser.user_metadata?.full_name || email,
      avatarUrl: sessionUser.user_metadata?.avatar_url || null,
    })
    setStatus('signedIn')
  }

  async function signInWithGoogle() {
    if (!isSupabaseConfigured) return
    setAuthError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: ALLOWED_EMAIL_DOMAIN ? { hd: ALLOWED_EMAIL_DOMAIN } : undefined,
      },
    })
    if (error) setAuthError(error.message)
  }

  // Nickname login — no password, no Google. This is the game's real login
  // for the Function Days build (see GOOGLE_SSO_ENABLED). Each device keeps
  // a stable random id across renames so replaying under a new nickname
  // doesn't fork into a second leaderboard entry, and two different players
  // who happen to type the same nickname never collide into one account
  // (the old version derived the id from the name itself, which did collide).
  function signInMock(name) {
    const trimmed = (name || '').trim() || 'PLAYER'
    const existing = loadMockUser()
    const id = existing?.id || `mock-${randomId()}`
    const mockUser = {
      id,
      email: `${trimmed.toLowerCase().replace(/\s+/g, '.')}@mock.local`,
      name: trimmed,
      avatarUrl: null,
    }
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser))
    setUser(mockUser)
    setStatus('signedIn')
    // Sync the nickname to Supabase so the leaderboard can show it — best
    // effort only, never blocks sign-in if it fails or Supabase isn't set up.
    upsertPlayer(id, trimmed).catch((err) => console.error('upsertPlayer failed:', err.message))
  }

  async function signOut() {
    if (USE_GOOGLE_AUTH) {
      try {
        await supabase.auth.signOut()
      } catch (err) {
        console.error('Failed to sign out:', err.message)
      }
    } else {
      localStorage.removeItem(MOCK_USER_KEY)
      setUser(null)
      setStatus('signedOut')
    }
  }

  const value = useMemo(
    () => ({
      status,
      user,
      authError,
      isMock: !USE_GOOGLE_AUTH,
      signInWithGoogle,
      signInMock,
      signOut,
    }),
    [status, user, authError]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
