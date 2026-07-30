create table public.orders (
  id uuid primary key,
  public_number text not null unique,
  access_token_hash text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_tax_id text not null,
  status text not null default 'draft'
    check (status in ('draft','pending_payment','paid','checkout_failed','cancelled','refunded','disputed')),
  currency text not null default 'BRL' check (currency = 'BRL'),
  subtotal_cents integer not null check (subtotal_cents >= 0),
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  provider text not null default 'abacatepay' check (provider = 'abacatepay'),
  provider_customer_id text,
  provider_checkout_id text unique,
  checkout_url text,
  receipt_url text,
  paid_at timestamptz,
  refunded_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  story_id uuid not null references public.stories(id),
  product_slug text not null,
  product_title text not null,
  format_id text not null check (format_id in ('physical','digital')),
  format_label text not null,
  provider_product_id text not null,
  unit_price_cents integer not null check (unit_price_cents > 0),
  quantity smallint not null check (quantity between 1 and 10),
  created_at timestamptz not null default now()
);

create table public.order_addresses (
  order_id uuid primary key references public.orders(id) on delete cascade,
  recipient_name text not null,
  zip_code text not null,
  street text not null,
  number text not null,
  complement text,
  neighborhood text not null,
  city text not null,
  state text not null,
  created_at timestamptz not null default now()
);

create table public.order_fulfillments (
  order_id uuid primary key references public.orders(id) on delete cascade,
  status text not null default 'not_required'
    check (status in ('not_required','waiting_payment','pending','processing','shipped','delivered','cancelled')),
  tracking_code text,
  carrier text,
  shipped_at timestamptz,
  delivered_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.payment_events (
  provider_event_id text primary key,
  order_id uuid references public.orders(id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}',
  processed_at timestamptz not null default now()
);

alter table public.licenses
  add column order_item_id uuid references public.order_items(id) on delete set null,
  add column order_item_unit smallint;

create unique index licenses_order_item_unit_key
  on public.licenses(order_item_id, order_item_unit)
  where order_item_id is not null;

create table public.license_deliveries (
  license_id uuid primary key references public.licenses(id) on delete cascade,
  encrypted_code text not null,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

create index orders_customer_email_idx on public.orders(lower(customer_email));
create index orders_created_at_idx on public.orders(created_at desc);
create index order_items_order_id_idx on public.order_items(order_id);
create index payment_events_order_id_idx on public.payment_events(order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_addresses enable row level security;
alter table public.order_fulfillments enable row level security;
alter table public.payment_events enable row level security;
alter table public.license_deliveries enable row level security;

revoke all on public.orders from anon, authenticated;
revoke all on public.order_items from anon, authenticated;
revoke all on public.order_addresses from anon, authenticated;
revoke all on public.order_fulfillments from anon, authenticated;
revoke all on public.payment_events from anon, authenticated;
revoke all on public.license_deliveries from anon, authenticated;

create or replace function public.create_store_order(
  p_order jsonb,
  p_items jsonb,
  p_address jsonb
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  has_physical boolean := false;
  created_order_id uuid := (p_order->>'id')::uuid;
  calculated_subtotal integer;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'ORDER_ITEMS_REQUIRED';
  end if;

  insert into public.orders (
    id, public_number, access_token_hash, user_id, customer_name,
    customer_email, customer_phone, customer_tax_id, subtotal_cents,
    shipping_cents, total_cents, metadata
  ) values (
    created_order_id,
    p_order->>'public_number',
    p_order->>'access_token_hash',
    nullif(p_order->>'user_id','')::uuid,
    p_order->>'customer_name',
    lower(p_order->>'customer_email'),
    p_order->>'customer_phone',
    p_order->>'customer_tax_id',
    (p_order->>'subtotal_cents')::integer,
    (p_order->>'shipping_cents')::integer,
    (p_order->>'total_cents')::integer,
    coalesce(p_order->'metadata','{}'::jsonb)
  );

  for item in select value from jsonb_array_elements(p_items)
  loop
    insert into public.order_items (
      id, order_id, story_id, product_slug, product_title, format_id,
      format_label, provider_product_id, unit_price_cents, quantity
    ) values (
      (item->>'id')::uuid,
      created_order_id,
      (item->>'story_id')::uuid,
      item->>'product_slug',
      item->>'product_title',
      item->>'format_id',
      item->>'format_label',
      item->>'provider_product_id',
      (item->>'unit_price_cents')::integer,
      (item->>'quantity')::smallint
    );
    has_physical := has_physical or item->>'format_id' = 'physical';
  end loop;

  select coalesce(sum(unit_price_cents * quantity),0)::integer
  into calculated_subtotal
  from public.order_items
  where order_id = created_order_id;

  if calculated_subtotal <> (p_order->>'subtotal_cents')::integer
     or calculated_subtotal + (p_order->>'shipping_cents')::integer
        <> (p_order->>'total_cents')::integer then
    raise exception 'ORDER_TOTAL_MISMATCH';
  end if;

  if has_physical then
    if p_address is null or jsonb_typeof(p_address) <> 'object' then
      raise exception 'SHIPPING_ADDRESS_REQUIRED';
    end if;
    insert into public.order_addresses (
      order_id, recipient_name, zip_code, street, number, complement,
      neighborhood, city, state
    ) values (
      created_order_id,
      p_address->>'recipient_name',
      p_address->>'zip_code',
      p_address->>'street',
      p_address->>'number',
      nullif(p_address->>'complement',''),
      p_address->>'neighborhood',
      p_address->>'city',
      upper(p_address->>'state')
    );
  end if;

  insert into public.order_fulfillments(order_id, status)
  values (created_order_id, case when has_physical then 'waiting_payment' else 'not_required' end);

  return created_order_id;
end;
$$;

create or replace function public.process_abacate_checkout_event(
  p_event_id text,
  p_event_type text,
  p_order_id uuid,
  p_checkout_id text,
  p_paid_amount integer,
  p_receipt_url text,
  p_payload jsonb,
  p_licenses jsonb default '[]'::jsonb
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  event_inserted integer;
  current_order public.orders%rowtype;
  expected_license_count integer;
  license_row jsonb;
  item_story_id uuid;
  inserted_license_id uuid;
begin
  insert into public.payment_events(provider_event_id, order_id, event_type, payload)
  values (p_event_id, p_order_id, p_event_type, coalesce(p_payload,'{}'::jsonb))
  on conflict (provider_event_id) do nothing;
  get diagnostics event_inserted = row_count;
  if event_inserted = 0 then
    return false;
  end if;

  select * into current_order
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  if current_order.provider_checkout_id is not null
     and current_order.provider_checkout_id <> p_checkout_id then
    raise exception 'CHECKOUT_MISMATCH';
  end if;

  if p_event_type = 'checkout.completed' then
    if p_paid_amount <> current_order.total_cents then
      raise exception 'PAYMENT_AMOUNT_MISMATCH';
    end if;

    select coalesce(sum(quantity),0)::integer into expected_license_count
    from public.order_items where order_id = p_order_id;

    if jsonb_typeof(p_licenses) <> 'array'
       or jsonb_array_length(p_licenses) <> expected_license_count then
      raise exception 'LICENSE_COUNT_MISMATCH';
    end if;

    update public.orders set
      status = 'paid',
      provider_checkout_id = p_checkout_id,
      receipt_url = p_receipt_url,
      paid_at = coalesce(paid_at, now()),
      updated_at = now()
    where id = p_order_id;

    for license_row in select value from jsonb_array_elements(p_licenses)
    loop
      select story_id into item_story_id
      from public.order_items
      where id = (license_row->>'order_item_id')::uuid
        and order_id = p_order_id;

      if item_story_id is null then
        raise exception 'ORDER_ITEM_NOT_FOUND';
      end if;

      insert into public.licenses (
        story_id, code_hash, code_last4, status, metadata,
        order_item_id, order_item_unit
      ) values (
        item_story_id,
        license_row->>'code_hash',
        license_row->>'code_last4',
        'unactivated',
        jsonb_build_object(
          'source','abacatepay',
          'order_id',p_order_id,
          'checkout_id',p_checkout_id
        ),
        (license_row->>'order_item_id')::uuid,
        (license_row->>'order_item_unit')::smallint
      )
      on conflict (order_item_id, order_item_unit) where order_item_id is not null
      do nothing
      returning id into inserted_license_id;

      if inserted_license_id is not null then
        insert into public.license_deliveries(license_id, encrypted_code)
        values (inserted_license_id, license_row->>'encrypted_code');
      end if;
      inserted_license_id := null;
    end loop;

    update public.order_fulfillments set
      status = case when status = 'waiting_payment' then 'pending' else status end,
      updated_at = now()
    where order_id = p_order_id;
  elsif p_event_type = 'checkout.refunded' then
    update public.orders set
      status = 'refunded',
      provider_checkout_id = coalesce(provider_checkout_id, p_checkout_id),
      receipt_url = coalesce(p_receipt_url, receipt_url),
      refunded_at = coalesce(refunded_at, now()),
      updated_at = now()
    where id = p_order_id;

    update public.licenses set status = 'revoked'
    where order_item_id in (
      select id from public.order_items where order_id = p_order_id
    );

    update public.order_fulfillments set
      status = case when status in ('shipped','delivered') then status else 'cancelled' end,
      updated_at = now()
    where order_id = p_order_id;
  elsif p_event_type in ('checkout.disputed','checkout.lost') then
    update public.orders set
      status = 'disputed',
      provider_checkout_id = coalesce(provider_checkout_id, p_checkout_id),
      updated_at = now()
    where id = p_order_id;

    update public.licenses set status = 'revoked'
    where order_item_id in (
      select id from public.order_items where order_id = p_order_id
    );
  end if;

  return true;
end;
$$;

revoke all on function public.create_store_order(jsonb,jsonb,jsonb) from public, anon, authenticated;
revoke all on function public.process_abacate_checkout_event(text,text,uuid,text,integer,text,jsonb,jsonb) from public, anon, authenticated;
grant execute on function public.create_store_order(jsonb,jsonb,jsonb) to service_role;
grant execute on function public.process_abacate_checkout_event(text,text,uuid,text,integer,text,jsonb,jsonb) to service_role;
