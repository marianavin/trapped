-- TRAPPED — Supabase schema
-- Run this once in your Supabase project's SQL editor (Project > SQL Editor > New query).
--
-- Identity model: this build skips Google/Supabase Auth entirely (Function
-- Days event — no time to get a Google Cloud project approved). Each player
-- is just a random UUID generated client-side on first launch and stored in
-- localStorage (see AuthContext.jsx signInMock). There is no real login, so
-- `auth.uid()` is always null for these requests — RLS below is therefore
-- intentionally permissive (anon key can read/write any row) rather than
-- scoped per-user. That's an acceptable trade-off for a short-lived internal
-- game with no sensitive data (nicknames + which cognitive biases someone
-- fell for), matching the "public expo game" threat model already called
-- out in SUPABASE_SETUP.md. Don't reuse this pattern for anything that
-- handles real user data.

create table if not exists public.players (
  id uuid primary key,
  nickname text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.players enable row level security;

create policy "anyone can read players"
  on public.players for select
  using (true);

create policy "anyone can create a player"
  on public.players for insert
  with check (true);

create policy "anyone can update a player"
  on public.players for update
  using (true);

create table if not exists public.level_progress (
  user_id uuid not null references public.players (id) on delete cascade,
  level_id text not null,
  outcome_success boolean not null default false,
  total_biases integer not null default 0,
  escaped_count integer not null default 0,
  results jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now(),
  primary key (user_id, level_id)
);

alter table public.level_progress enable row level security;

create policy "anyone can read progress"
  on public.level_progress for select
  using (true);

create policy "anyone can create progress"
  on public.level_progress for insert
  with check (true);

create policy "anyone can update progress"
  on public.level_progress for update
  using (true);

-- Leaderboard: one row per player, points computed with the same formula as
-- src/data/scoring.js (100 per scenario survived, 25 per bias escaped) — if
-- you change POINTS_PER_SURVIVED / POINTS_PER_BIAS_ESCAPED there, update
-- this view too so rankings stay consistent.
create or replace view public.leaderboard as
select
  p.id as player_id,
  p.nickname,
  count(lp.level_id) filter (where lp.outcome_success) as scenarios_survived,
  count(lp.level_id) as levels_completed,
  coalesce(sum(lp.escaped_count), 0) as biases_escaped,
  coalesce(sum(lp.total_biases), 0) as biases_attempted,
  (count(lp.level_id) filter (where lp.outcome_success) * 100
    + coalesce(sum(lp.escaped_count), 0) * 25) as points
from public.players p
left join public.level_progress lp on lp.user_id = p.id
group by p.id, p.nickname
order by points desc, p.nickname asc;
