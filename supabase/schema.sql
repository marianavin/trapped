-- TRAPPED — Supabase schema
-- Run this once in your Supabase project's SQL editor (Project > SQL Editor > New query).
-- Auth itself (Google provider) is configured in the dashboard, not here — see SUPABASE_SETUP.md.

create table if not exists public.level_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  level_id text not null,
  outcome_success boolean not null default false,
  total_biases integer not null default 0,
  escaped_count integer not null default 0,
  results jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now(),
  primary key (user_id, level_id)
);

alter table public.level_progress enable row level security;

-- Each player can only ever read/write their own rows.
create policy "read own progress"
  on public.level_progress for select
  using (auth.uid() = user_id);

create policy "insert own progress"
  on public.level_progress for insert
  with check (auth.uid() = user_id);

create policy "update own progress"
  on public.level_progress for update
  using (auth.uid() = user_id);
