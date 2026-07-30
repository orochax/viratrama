-- Account recovery, transactional email delivery, fulfillment history and
-- the play mode selected for each game session.
alter table public.profiles
  add column if not exists phone text;

alter table public.licenses
  add column if not exists allowed_play_modes text[] not null default array['digital','hybrid'];

alter table public.game_sessions
  add column if not exists play_mode text not null default 'hybrid'
    check (play_mode in ('digital','hybrid'));

create table if not exists public.order_claim_tokens (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  token_hash text not null unique,
  purpose text not null check (purpose in ('confirmation','recovery','activation')),
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.email_deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  recipient_email text not null,
  kind text not null check (kind in ('purchase_confirmation','order_recovery','fulfillment_update')),
  delivery_key text not null unique,
  status text not null default 'pending' check (status in ('pending','sent','failed')),
  provider_id text,
  error_message text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.fulfillment_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  carrier text,
  tracking_code text,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists order_claim_tokens_order_idx
  on public.order_claim_tokens(order_id, expires_at desc);
create index if not exists email_deliveries_order_idx
  on public.email_deliveries(order_id, created_at desc);
create index if not exists fulfillment_events_order_idx
  on public.fulfillment_events(order_id, created_at desc);

alter table public.order_claim_tokens enable row level security;
alter table public.email_deliveries enable row level security;
alter table public.fulfillment_events enable row level security;

revoke all on public.order_claim_tokens from anon, authenticated;
revoke all on public.email_deliveries from anon, authenticated;
revoke all on public.fulfillment_events from anon, authenticated;

grant all privileges on public.order_claim_tokens to service_role;
grant all privileges on public.email_deliveries to service_role;
grant all privileges on public.fulfillment_events to service_role;
grant all privileges on public.profiles to service_role;
grant all privileges on public.licenses to service_role;
grant all privileges on public.game_sessions to service_role;
