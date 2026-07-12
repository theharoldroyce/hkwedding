// RSVP automatically closes at the start of August 1, 2026 (Philippine time,
// UTC+8) — the same timezone convention the guest-photo gate uses. After this
// moment the form is hidden on the site and the API rejects new submissions,
// so no server changes are needed on the day itself.
export const RSVP_CLOSES_AT = new Date("2026-08-01T00:00:00+08:00");

export function isRsvpClosed(now: number = Date.now()) {
  return now >= RSVP_CLOSES_AT.getTime();
}
