-- MOONpaper: Supabase schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query).

create extension if not exists "pgcrypto";

-- ---------- Tables ----------

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  type text not null check (type in ('pc', 'mobile', 'both')),
  description text default '',
  created_at timestamptz not null default now()
);

create table if not exists wallpapers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text default '',
  image_url text not null,
  download_url text not null,
  device_type text not null check (device_type in ('pc', 'mobile')),
  category text not null,
  resolution text not null,
  aspect_ratio text not null,
  tags text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default true,
  downloads integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text default '',
  cover_image text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists collection_wallpapers (
  collection_id uuid not null references collections(id) on delete cascade,
  wallpaper_id uuid not null references wallpapers(id) on delete cascade,
  primary key (collection_id, wallpaper_id)
);

create index if not exists wallpapers_device_type_idx on wallpapers (device_type);
create index if not exists wallpapers_category_idx on wallpapers (category);
create index if not exists wallpapers_published_idx on wallpapers (published);

-- ---------- Download counter ----------

create or replace function increment_wallpaper_downloads(wallpaper_id uuid)
returns void
language sql
security definer
as $$
  update wallpapers set downloads = downloads + 1 where id = wallpaper_id;
$$;

-- ---------- Row Level Security ----------

alter table categories enable row level security;
alter table wallpapers enable row level security;
alter table collections enable row level security;
alter table collection_wallpapers enable row level security;

-- Public (anon) read access to published content only.
create policy "Public read categories" on categories for select using (true);

create policy "Public read published wallpapers" on wallpapers
  for select using (published = true);

create policy "Public read published collections" on collections
  for select using (published = true);

create policy "Public read collection_wallpapers" on collection_wallpapers
  for select using (true);

-- Authenticated (signed-in admin) users get full read/write access.
-- This project treats any Supabase Auth user as an admin, create admin
-- accounts manually in Supabase Auth rather than allowing public sign-up.
create policy "Admins manage categories" on categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Admins manage wallpapers" on wallpapers
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Admins manage collections" on collections
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Admins manage collection_wallpapers" on collection_wallpapers
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
