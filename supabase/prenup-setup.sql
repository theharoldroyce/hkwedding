-- ============================================================
--  Prenup albums setup
--  Run this once in the Supabase Dashboard → SQL Editor.
--  After this, manage photos from the site's /admin page
--  (drag & drop upload, reorder, caption, delete).
-- ============================================================

-- 1) Storage bucket (public read) that holds the image files.
insert into storage.buckets (id, name, public)
values ('prenup', 'prenup', true)
on conflict (id) do update set public = true;

-- 2) Metadata table that drives what renders, in what order.
create table if not exists public.prenup_photos (
  id         uuid primary key default gen_random_uuid(),
  album      text not null check (album in ('v1', 'v2')),
  path       text not null,          -- storage path within the bucket, e.g. 'v1/photo-01.jpg'
  sort_order int  not null default 0,
  caption    text,
  created_at timestamptz not null default now()
);

create index if not exists prenup_photos_album_order_idx
  on public.prenup_photos (album, sort_order);

-- 3) Row Level Security on the table.
alter table public.prenup_photos enable row level security;

-- Everyone can READ (the public site needs this).
drop policy if exists "Public can read prenup photos" on public.prenup_photos;
create policy "Public can read prenup photos"
  on public.prenup_photos
  for select
  to anon, authenticated
  using (true);

-- Logged-in admins can INSERT / UPDATE / DELETE (the /admin uploader).
drop policy if exists "Authenticated can manage prenup photos" on public.prenup_photos;
create policy "Authenticated can manage prenup photos"
  on public.prenup_photos
  for all
  to authenticated
  using (true)
  with check (true);

-- 4) Storage object policies for the prenup bucket.
--    (Public read is already granted by the bucket being public.)
--    Logged-in admins can upload / overwrite / delete files.
drop policy if exists "Authenticated can upload prenup files" on storage.objects;
create policy "Authenticated can upload prenup files"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'prenup');

drop policy if exists "Authenticated can update prenup files" on storage.objects;
create policy "Authenticated can update prenup files"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'prenup')
  with check (bucket_id = 'prenup');

drop policy if exists "Authenticated can delete prenup files" on storage.objects;
create policy "Authenticated can delete prenup files"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'prenup');

-- ============================================================
--  Done. Now go to /admin → "Prenup Albums" to upload photos.
-- ============================================================
