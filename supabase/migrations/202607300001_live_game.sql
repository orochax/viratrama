-- Production game runtime. Additive only: existing sessions and content are preserved.
alter table public.game_sessions
  add column if not exists version integer not null default 1,
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists max_players smallint not null default 6 check (max_players between 3 and 6),
  add column if not exists max_alert_level smallint not null default 0 check (max_alert_level between 0 and 5),
  add column if not exists route_slug text,
  add column if not exists police_eta_known boolean not null default false,
  add column if not exists entry_deadline_at timestamptz,
  add column if not exists extraction_deadline_at timestamptz;

alter table public.players
  add column if not exists guest_token_hash text,
  add column if not exists personal_code_last4 text,
  add column if not exists confirmed boolean not null default false,
  add column if not exists ready boolean not null default false,
  add column if not exists role_revealed boolean not null default false,
  add column if not exists avatar_gender text not null default 'default'
    check (avatar_gender in ('default', 'masculino', 'feminino')),
  add column if not exists disconnected_at timestamptz;

alter table public.game_events add column if not exists idempotency_key text;
create unique index if not exists game_events_idempotency_unique
  on public.game_events(session_id, idempotency_key) where idempotency_key is not null;
create unique index if not exists players_session_guest_token_unique
  on public.players(session_id, guest_token_hash) where guest_token_hash is not null;
create index if not exists players_session_active_idx on public.players(session_id, is_active);
create index if not exists sessions_host_status_idx on public.game_sessions(host_user_id, status, updated_at desc);

drop index if exists public.one_live_session_per_license;
create unique index one_live_session_per_license on public.game_sessions(license_id)
  where status in ('lobby','role_assignment','role_reveal','prologue','active','paused','final_decision');

create table if not exists public.story_versions (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  version integer not null,
  content jsonb not null,
  checksum text not null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique(story_id, version)
);

create table if not exists public.session_action_receipts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  player_id uuid references public.players(id) on delete set null,
  idempotency_key text not null,
  command text not null,
  response jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique(session_id, idempotency_key)
);

create table if not exists public.session_locations (
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  marker_code text not null,
  player_id uuid references public.players(id) on delete cascade,
  node_slug text not null,
  updated_at timestamptz not null default now(),
  primary key(session_id, marker_code)
);

alter table public.story_versions enable row level security;
alter table public.session_action_receipts enable row level security;
alter table public.session_locations enable row level security;
create policy "published story versions readable" on public.story_versions for select
  using (published_at is not null and exists (
    select 1 from public.stories s where s.id = story_id and s.status = 'published'
  ));
create policy "session members read locations" on public.session_locations for select
  using (public.is_session_member(session_id));

-- Guests never query these tables directly. The server validates the re-entry
-- token hash and returns a player-specific DTO.
revoke all on public.session_action_receipts from anon, authenticated;

create or replace function public.touch_game_session() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists touch_game_session on public.game_sessions;
create trigger touch_game_session before update on public.game_sessions
for each row execute procedure public.touch_game_session();

create or replace function public.claim_session_version(
  target_session uuid,
  expected_version integer,
  next_status public.session_status,
  next_state jsonb,
  next_act integer,
  next_alert smallint,
  next_score integer,
  next_route text
) returns boolean language plpgsql security definer set search_path = public as $$
declare changed integer;
begin
  update public.game_sessions
  set version = version + 1,
      status = next_status,
      state = next_state,
      current_act = next_act,
      alert_level = next_alert,
      max_alert_level = greatest(max_alert_level, next_alert),
      collective_score = next_score,
      route_slug = coalesce(next_route, route_slug),
      completed_at = case when next_status = 'completed' then now() else completed_at end
  where id = target_session and version = expected_version;
  get diagnostics changed = row_count;
  return changed = 1;
end;
$$;
revoke all on function public.claim_session_version(uuid,integer,public.session_status,jsonb,integer,smallint,integer,text)
  from public, anon, authenticated;
grant execute on function public.claim_session_version(uuid,integer,public.session_status,jsonb,integer,smallint,integer,text)
  to service_role;
