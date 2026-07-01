import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured, ALLOWED_EMAIL_DOMAIN } from './supabaseClient.js'

const MOCK_USER_KEY = 'trapped_mock_user'

const AuthContext = createContext(null)

function domainOf(email) {
  return typeof email === 'string' && email.includes('@') ? email.split('@')[1].toLowerCase() : null
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
    if (!isSupabaseConfigured) {
      const mock = loadMockUser()
      setUser(mock)
      setStatus(mock ? 'signedIn' : 'signedOut')
      return
    }

    let unsub = () => {}

    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session)
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
      supabase.auth.signOut()
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

  // Dev-mode stand-in for Google SSO — no password, no backend. Lets the
  // shell be built and played end-to-end before Supabase is wired up.
  function signInMock(name) {
    const trimmed = (name || '').trim() || 'PLAYER'
    const mockUser = {
      id: `mock-${trimmed.toLowerCase().replace(/\s+/g, '-')}`,
      email: `${trimmed.toLowerCase().replace(/\s+/g, '.')}@mock.local`,
      name: trimmed,
      avatarUrl: null,
    }
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser))
    setUser(mockUser)
    setStatus('signedIn')
  }

  async function signOut() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
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
      isMock: !isSupabaseConfigured,
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
