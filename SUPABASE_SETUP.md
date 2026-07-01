# Connecting real Google SSO (Supabase)

The shell works today with a local nickname login (no setup needed). Follow
this once you're ready to switch on real "sign in with your @org Google
account."

## 1. Create a Supabase project
1. supabase.com → New project.
2. Project Settings → API → copy the **Project URL** and **anon public** key.

## 2. Enable Google as an auth provider
1. Authentication → Providers → Google → enable.
2. You need a Google OAuth Client ID/secret: Google Cloud Console → APIs &
   Services → Credentials → Create OAuth client ID → type "Web application."
3. Add Supabase's callback URL (shown on the Google provider page in
   Supabase, looks like `https://<project-ref>.supabase.co/auth/v1/callback`)
   as an Authorized redirect URI in the Google client.
4. Paste the Google Client ID + Secret into Supabase's Google provider form
   and save.

## 3. Restrict sign-in to your org's domain
Two layers, both already wired into the app code:
- **Request-side hint** — the app sends Google's `hd` (hosted domain)
  parameter, which pre-filters the Google account picker to your domain.
  This alone is a UX nicety, not real enforcement — a user could still
  attempt sign-in with a different account.
- **Server-verified check** — after any sign-in, `AuthContext.jsx` checks the
  returned email's domain against `VITE_ALLOWED_EMAIL_DOMAIN` and immediately
  signs the user back out if it doesn't match, showing an error instead.

Set `VITE_ALLOWED_EMAIL_DOMAIN` to your org's domain (e.g. `vinted.com`) in
`.env`. If you need this enforced even against a compromised or modified
client, add a Postgres trigger on `auth.users` that rejects/deletes rows
where the email domain doesn't match — not included here since the
client-side check covers the MVP threat model (a public expo game).

## 4. Run the database schema
Project → SQL Editor → paste the contents of `supabase/schema.sql` → Run.
This creates the `level_progress` table with row-level security so each
player can only read/write their own rows.

## 5. Set redirect URLs
Authentication → URL Configuration:
- **Site URL** → your Vercel production URL
- **Redirect URLs** → add `http://localhost:5173` (Vite dev) and your Vercel
  URL

## 6. Set environment variables
Copy `.env.example` to `.env` locally, and add the same three variables in
Vercel → Project Settings → Environment Variables:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_ALLOWED_EMAIL_DOMAIN=yourorg.com
```

Restart `npm run dev` (or redeploy on Vercel). The login screen switches
from the nickname field to "CONTINUE WITH GOOGLE" automatically once both
Supabase variables are present — no code changes needed.
