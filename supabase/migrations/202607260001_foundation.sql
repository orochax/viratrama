create extension if not exists pgcrypto;

create type public.license_status as enum ('unactivated','active','revoked');
create type public.session_status as enum ('draft','lobby','role_assignment','role_reveal','prologue','active','paused','final_decision','completed','abandoned');

create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, full_name text, is_admin boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.stories (id uuid primary key default gen_random_uuid(), slug text unique not null, title text not null, subtitle text, trailer_copy text, age_rating text, min_players smallint not null default 3, max_players smallint not null default 6, duration_min smallint, duration_max smallint, status text not null default 'draft', version integer not null default 1, cover_path text, created_at timestamptz not null default now());
create table public.licenses (id uuid primary key default gen_random_uuid(), story_id uuid not null references public.stories(id), code_hash text not null unique, code_last4 text not null, owner_user_id uuid references auth.users(id), activated_at timestamptz, status public.license_status not null default 'unactivated', metadata jsonb not null default '{}', created_at timestamptz not null default now());
create table public.game_sessions (id uuid primary key default gen_random_uuid(), license_id uuid not null references public.licenses(id), host_user_id uuid not null references auth.users(id), room_code text unique not null, status public.session_status not null default 'draft', current_act integer not null default 0, current_step_id uuid, story_version integer not null, narrative_time text not null default '23:12', elapsed_seconds integer not null default 0, started_at timestamptz, paused_at timestamptz, completed_at timestamptz, alarm_triggered_at timestamptz, alarm_deadline_at timestamptz, alert_level smallint not null default 0 check (alert_level between 0 and 5), collective_score integer not null default 0, final_ending_id uuid, kit_restored boolean not null default false, state jsonb not null default '{}', created_at timestamptz not null default now());
create unique index one_live_session_per_license on public.game_sessions(license_id) where status in ('lobby','role_assignment','active','paused');
create table public.players (id uuid primary key default gen_random_uuid(), session_id uuid not null references public.game_sessions(id) on delete cascade, auth_user_id uuid references auth.users(id), nickname text not null, personal_code_hash text, device_mode text not null default 'shared' check(device_mode in ('own','shared','none')), is_host boolean not null default false, is_active boolean not null default true, joined_at timestamptz not null default now(), last_seen_at timestamptz, current_location_node text, individual_score integer not null default 0, metadata jsonb not null default '{}');
create table public.game_events (id bigint generated always as identity primary key, session_id uuid not null references public.game_sessions(id) on delete cascade, player_id uuid references public.players(id), event_type text not null, payload jsonb not null default '{}', created_at timestamptz not null default now());

alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.licenses enable row level security;
alter table public.game_sessions enable row level security;
alter table public.players enable row level security;
alter table public.game_events enable row level security;

create policy "profiles own row" on public.profiles for select using (id = auth.uid());
create policy "published stories readable" on public.stories for select using (status = 'published');
create policy "owners read licenses" on public.licenses for select using (owner_user_id = auth.uid());
create policy "hosts manage sessions" on public.game_sessions for all using (host_user_id = auth.uid()) with check (host_user_id = auth.uid());
create policy "players read own session" on public.players for select using (exists (select 1 from public.game_sessions s where s.id = session_id and s.host_user_id = auth.uid()) or auth_user_id = auth.uid());
create policy "players join own identity" on public.players for insert with check (auth_user_id = auth.uid());
create policy "events visible to host" on public.game_events for select using (exists (select 1 from public.game_sessions s where s.id = session_id and s.host_user_id = auth.uid()));

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles(id, full_name) values(new.id, coalesce(new.raw_user_meta_data->>'full_name','')); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
