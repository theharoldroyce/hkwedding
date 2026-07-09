-- ============================================================
--  Guest Arrivals (public check-in page) setup
--  Run this once in the Supabase Dashboard → SQL Editor.
--
--  This powers /arrivals — a page with NO sign-in. Because it
--  is public, the policies below let anonymous visitors read
--  the RSVP/guest lists and add, check in, or remove guests.
--  Anyone with the link can do this — that is the trade-off of
--  a no-login page. Keep the URL private if that matters to you.
-- ============================================================

-- 1) Add a table number to each guest (nullable — guests created
--    from an RSVP won't have one until it's assigned here).
alter table public.guests
  add column if not exists table_number int;

-- 2) Row Level Security — allow anonymous access for the public page.
alter table public.guests enable row level security;
alter table public.rsvps  enable row level security;

-- Guests: anyone may read, add, update (check-in / table no.), and remove.
drop policy if exists "Public can read guests"   on public.guests;
create policy "Public can read guests"
  on public.guests for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can add guests"    on public.guests;
create policy "Public can add guests"
  on public.guests for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Public can update guests" on public.guests;
create policy "Public can update guests"
  on public.guests for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Public can remove guests" on public.guests;
create policy "Public can remove guests"
  on public.guests for delete
  to anon, authenticated
  using (true);

-- RSVPs: the public RSVP form must still be able to add responses
-- (enabling RLS above turns off the previously-open insert access).
drop policy if exists "Public can add rsvps" on public.rsvps;
create policy "Public can add rsvps"
  on public.rsvps for insert
  to anon, authenticated
  with check (true);

-- RSVPs: the stat cards need the counts, so allow anonymous read.
drop policy if exists "Public can read rsvps" on public.rsvps;
create policy "Public can read rsvps"
  on public.rsvps for select
  to anon, authenticated
  using (true);

-- Removing a guest also removes their RSVP so the counts stay in sync.
drop policy if exists "Public can remove rsvps" on public.rsvps;
create policy "Public can remove rsvps"
  on public.rsvps for delete
  to anon, authenticated
  using (true);

-- ============================================================
--  Done. Open /arrivals — no sign-in required.
-- ============================================================
