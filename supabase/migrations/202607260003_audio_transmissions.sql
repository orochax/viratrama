-- Audio-first narrative media model. Existing media_assets rows remain compatible.
alter table public.media_assets
  add column if not exists character_slug text,
  add column if not exists transmission_type text not null default 'recording',
  add column if not exists portrait_path text,
  add column if not exists alternate_portrait_path text,
  add column if not exists theme text not null default 'neutral',
  add column if not exists conditions jsonb not null default '{}',
  add column if not exists effects jsonb not null default '{}',
  add column if not exists audio_mode text not null default 'collective',
  add column if not exists completion_rule text not null default 'host_or_transcript',
  add column if not exists requires_completion boolean not null default true,
  add column if not exists production_state text not null default 'not_recorded',
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid references auth.users(id),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists media_assets_story_code_unique on public.media_assets(story_id, code);
create index if not exists media_assets_character_idx on public.media_assets(story_id, character_slug);
create index if not exists media_assets_status_idx on public.media_assets(story_id, status, production_state);

create table if not exists public.media_transmission_events (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete cascade,
  player_id uuid references public.players(id) on delete set null,
  event_type text not null check (event_type in ('transmission_ready','transmission_started','transmission_paused','transmission_resumed','transmission_progress','transmission_completed','transmission_replayed','transmission_failed','transcript_opened','transcript_confirmed','narrative_step_unlocked')),
  idempotency_key text not null,
  position_seconds numeric(10,3),
  payload jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique(session_id, idempotency_key)
);

create index if not exists media_transmission_events_session_idx on public.media_transmission_events(session_id, created_at);
alter table public.media_transmission_events enable row level security;

create policy "members read transmission events" on public.media_transmission_events
  for select using (public.is_session_member(session_id));

create policy "members insert transmission events" on public.media_transmission_events
  for insert with check (public.is_session_member(session_id));

create policy "admins manage media assets" on public.media_assets
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

-- Storage objects remain private. Application code must issue signed URLs server-side.
