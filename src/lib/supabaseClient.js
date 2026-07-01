import { createClient } from '@supabase/supabase-js'

// The shell runs with a real Supabase backend when these are set (see
// .env.example / SUPABASE_SETUP.md). Without them it falls back to a
// local-only mock (see AuthContext.jsx + progressStore.js) so the game
// stays fully playable before the backend is provisioned.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

// Restricts Google sign-in to a single Google Workspace domain (your org's
// emails). Set VITE_ALLOWED_EMAIL_DOMAIN in .env, e.g. "vinted.com".
export const ALLOWED_EMAIL_DOMAIN = import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN || null

// Google SSO is parked for now (no Google Cloud project access for the
// Function Days build) — the game runs on nickname-only login regardless of
// whether Supabase is configured. Supabase, when configured, is still used
// to persist progress and power the leaderboard (see progressStore.js).
// Flip this to true once Google auth is actually wired up in the Supabase
// dashboard (see SUPABASE_SETUP.md) to bring back the Google login screen.
export const GOOGLE_SSO_ENABLED = false
