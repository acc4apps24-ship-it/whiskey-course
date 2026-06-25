create extension if not exists pgcrypto;

create table if not exists public.wj_users (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  display_name text not null check (char_length(trim(display_name)) between 2 and 24),
  age_confirmed_at timestamptz not null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.wj_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.wj_users(id) on delete cascade,
  chapter_id text not null,
  status text not null check (status in ('not_started', 'in_progress', 'completed')),
  current_card_id text,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, chapter_id)
);

create table if not exists public.wj_quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.wj_users(id) on delete cascade,
  chapter_id text not null,
  activity_id text not null,
  answer text not null,
  is_correct boolean not null,
  attempt_number integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.wj_xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.wj_users(id) on delete cascade,
  event_type text not null,
  source_id text not null,
  xp_delta integer not null check (xp_delta >= 0),
  reason text not null,
  created_at timestamptz not null default now(),
  unique (user_id, event_type, source_id)
);

create table if not exists public.wj_tasting_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.wj_users(id) on delete cascade,
  chapter_id text not null,
  appearance text,
  nose text,
  palate text,
  finish text,
  association text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace view public.wj_leaderboard as
select
  u.id as user_id,
  u.display_name,
  coalesce(sum(x.xp_delta), 0)::integer as total_xp,
  count(distinct p.chapter_id) filter (where p.status = 'completed')::integer as completed_chapters,
  u.last_seen_at
from public.wj_users u
left join public.wj_xp_events x on x.user_id = u.id
left join public.wj_progress p on p.user_id = u.id
group by u.id, u.display_name, u.last_seen_at
order by total_xp desc, completed_chapters desc, u.last_seen_at asc;

alter table public.wj_users enable row level security;
alter table public.wj_progress enable row level security;
alter table public.wj_quiz_attempts enable row level security;
alter table public.wj_xp_events enable row level security;
alter table public.wj_tasting_notes enable row level security;

create policy "anon can create users" on public.wj_users for insert to anon with check (true);
create policy "anon can read users for leaderboard" on public.wj_users for select to anon using (true);
create policy "anon can update users by session" on public.wj_users for update to anon using (true) with check (true);

create policy "anon can manage progress" on public.wj_progress for all to anon using (true) with check (true);
create policy "anon can manage attempts" on public.wj_quiz_attempts for all to anon using (true) with check (true);
create policy "anon can manage xp events" on public.wj_xp_events for all to anon using (true) with check (true);
create policy "anon can manage tasting notes" on public.wj_tasting_notes for all to anon using (true) with check (true);

grant select on public.wj_leaderboard to anon;
