-- Guest photo uploads — run this once in the Supabase dashboard (SQL Editor).
-- Creates the table, a public storage bucket, and the policies that let
-- anonymous wedding guests both view and add photos (but NOT delete them —
-- removal stays with you via the dashboard for moderation).

-- 1. Table -----------------------------------------------------------------
create table if not exists public.guest_photos (
  id            uuid primary key default gen_random_uuid(),
  path          text not null,
  uploader_name text,
  created_at    timestamptz not null default now()
);

alter table public.guest_photos enable row level security;

-- Anyone (including anonymous visitors) may view guest photos.
create policy "Guest photos are publicly readable"
  on public.guest_photos for select
  to anon, authenticated
  using (true);

-- Anyone may add a guest photo.
create policy "Anyone can add a guest photo"
  on public.guest_photos for insert
  to anon, authenticated
  with check (true);

-- 2. Public storage bucket -------------------------------------------------
insert into storage.buckets (id, name, public)
values ('guest-photos', 'guest-photos', true)
on conflict (id) do nothing;

-- 3. Storage object policies for that bucket -------------------------------
create policy "Guest bucket public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'guest-photos');

create policy "Guest bucket public upload"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'guest-photos');
