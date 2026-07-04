import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'
import { logout } from './actions'
import { GuestArrivalsTable } from './guest-arrivals-table'
import { PrenupManager } from './prenup-manager'

export const metadata = { title: 'Admin · Harold & Karen' }

type RSVP = {
  id: string
  name: string
  attending: string
  created_at: string
}

type Guest = {
  id: string
  name: string
  arrived: boolean
  arrived_at: string | null
  created_at: string
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-card px-6 py-5 shadow-sm">
      <p className="font-serif uppercase tracking-[0.15em] text-gold/70" style={{ fontSize: '0.68rem' }}>
        {label}
      </p>
      <p className="font-serif font-semibold text-foreground" style={{ fontSize: '2rem', lineHeight: 1 }}>
        {value}
      </p>
      {sub && (
        <p className="font-serif text-muted-foreground" style={{ fontSize: '0.78rem' }}>{sub}</p>
      )}
    </div>
  )
}

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const [{ data: rsvps, error: rsvpError }, { data: guests, error: guestError }] =
    await Promise.all([
      supabase.from('rsvps').select('id, name, attending, created_at').order('created_at', { ascending: false }),
      supabase.from('guests').select('id, name, arrived, arrived_at, created_at').order('name'),
    ])

  const rsvpList: RSVP[] = rsvps ?? []
  const guestList: Guest[] = guests ?? []

  const attending    = rsvpList.filter(r => r.attending === 'yes').length
  const notAttending = rsvpList.filter(r => r.attending === 'no').length
  const arrivedCount = guestList.filter(g => g.arrived).length

  return (
    <div className="min-h-dvh bg-background">

      {/* top bar */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-script text-foreground" style={{ fontSize: '1.6rem', lineHeight: 1 }}>
              H &amp; K
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="font-serif uppercase tracking-[0.15em] text-muted-foreground" style={{ fontSize: '0.68rem' }}>
              Admin Dashboard
            </span>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-border bg-background px-4 py-2 font-serif uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground"
              style={{ fontSize: '0.68rem' }}
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 flex flex-col gap-10">

        {/* stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total RSVPs"   value={rsvpList.length} />
          <StatCard label="Attending"     value={attending}        sub="will be there" />
          <StatCard label="Not Attending" value={notAttending}     sub="sending regrets" />
          <StatCard label="Arrived"       value={arrivedCount}     sub={`of ${attending} attending`} />
        </div>

        {/* ── Prenup Albums ── */}
        <PrenupManager />

        {/* ── Guest Arrivals ── */}
        {guestError ? (
          <div className="rounded-xl border border-border bg-card shadow-sm px-6 py-10 text-center">
            <p className="font-serif text-muted-foreground" style={{ fontSize: '0.88rem' }}>
              Could not load guests — make sure the <code className="text-gold">guests</code> table exists in Supabase.
            </p>
          </div>
        ) : (
          <GuestArrivalsTable guests={guestList} />
        )}

        {/* ── RSVP Responses ── */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border px-6 py-4 flex items-center justify-between">
            <h2 className="font-serif text-foreground" style={{ fontSize: '1rem' }}>
              All RSVP Responses
            </h2>
            <span className="font-serif uppercase tracking-[0.12em] text-muted-foreground" style={{ fontSize: '0.68rem' }}>
              {rsvpList.length} {rsvpList.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>

          {rsvpError && (
            <div className="px-6 py-10 text-center">
              <p className="font-serif text-muted-foreground" style={{ fontSize: '0.88rem' }}>
                Could not load RSVPs — make sure the <code className="text-gold">rsvps</code> table exists.
              </p>
            </div>
          )}

          {!rsvpError && rsvpList.length === 0 && (
            <div className="px-6 py-16 text-center">
              <p className="font-serif text-muted-foreground" style={{ fontSize: '0.88rem' }}>
                No responses yet.
              </p>
            </div>
          )}

          {!rsvpError && rsvpList.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-background/50">
                    <th className="px-6 py-3 font-serif uppercase tracking-[0.12em] text-gold/70" style={{ fontSize: '0.65rem' }}>Name</th>
                    <th className="px-6 py-3 font-serif uppercase tracking-[0.12em] text-gold/70" style={{ fontSize: '0.65rem' }}>Attending</th>
                    <th className="px-6 py-3 font-serif uppercase tracking-[0.12em] text-gold/70" style={{ fontSize: '0.65rem' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvpList.map((rsvp, i) => (
                    <tr key={rsvp.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-background/30'}`}>
                      <td className="px-6 py-4 font-serif text-foreground" style={{ fontSize: '0.9rem' }}>{rsvp.name}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-serif uppercase tracking-widest ${
                            rsvp.attending === 'yes' ? 'bg-butter/40 text-foreground' : 'bg-muted text-muted-foreground'
                          }`}
                          style={{ fontSize: '0.65rem' }}
                        >
                          {rsvp.attending === 'yes' ? 'Attending' : 'Not Attending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-serif text-muted-foreground" style={{ fontSize: '0.82rem' }}>
                        {new Date(rsvp.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
