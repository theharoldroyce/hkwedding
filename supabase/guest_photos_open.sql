-- Open guest photo uploads immediately — removes the wedding-day cutoff.
-- Run this once in the Supabase dashboard (SQL Editor).
--
-- Why this exists: the /snapshots QR-scan page unlocks the uploader UI ahead
-- of the wedding day, but the RLS policies in guest_photos.sql still reject
-- inserts until 2026-08-18. Applying this lifts that gate at the backend so
-- uploads actually succeed.
--
-- NOTE: RLS can't tell which page a request came from, so this opens uploads
-- globally (any anon caller). In practice only /snapshots exposes an open
-- uploader — the home page keeps its locked UI.
--
-- To restore the wedding-day gate later, re-run guest_photos.sql.

-- Table insert: allow any guest photo row.
drop policy if exists "Anyone can add a guest photo" on public.guest_photos;
create policy "Anyone can add a guest photo"
  on public.guest_photos for insert
  to anon, authenticated
  with check (true);

-- Storage upload: allow any object into the guest-photos bucket.
drop policy if exists "Guest bucket public upload" on storage.objects;
create policy "Guest bucket public upload"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'guest-photos');
