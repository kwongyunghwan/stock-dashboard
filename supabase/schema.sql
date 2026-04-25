-- Stock Dashboard schema
-- Run this once in Supabase SQL Editor.
-- Note: Auth is name-based without passwords; RLS is enabled with open
-- policies because the publishable key is the only credential. Anyone with
-- the URL can read/write any user's rows. Acceptable for a personal app.

create extension if not exists pgcrypto;

create table if not exists users (
  id          uuid primary key default gen_random_uuid(),
  name        text unique not null,
  created_at  timestamptz not null default now()
);

create table if not exists watchlist (
  user_id   uuid not null references users(id) on delete cascade,
  symbol    text not null,
  added_at  timestamptz not null default now(),
  primary key (user_id, symbol)
);

create table if not exists holdings (
  user_id        uuid not null references users(id) on delete cascade,
  symbol         text not null,
  quantity       numeric not null check (quantity > 0),
  avg_price_usd  numeric not null check (avg_price_usd > 0),
  updated_at     timestamptz not null default now(),
  primary key (user_id, symbol)
);

alter table users     enable row level security;
alter table watchlist enable row level security;
alter table holdings  enable row level security;

drop policy if exists "open_users"     on users;
drop policy if exists "open_watchlist" on watchlist;
drop policy if exists "open_holdings"  on holdings;

create policy "open_users"     on users     for all using (true) with check (true);
create policy "open_watchlist" on watchlist for all using (true) with check (true);
create policy "open_holdings"  on holdings  for all using (true) with check (true);
