import { createClient } from '@/lib/server'
import { ArrivalsTable } from './arrivals-table'

export const metadata = { title: 'Guest Arrivals · Harold & Karen' }

// Public page — no sign-in. Always read fresh so check-ins show up live.
export const dynamic = 'force-dynamic'

type Guest = {
  id: string
  name: string
  arrived: boolean
  arrived_at: string | null
  table_number: number | null
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

export default async function ArrivalsPage() {
  const supabase = await createClient()

  const [{ data: rsvps }, { data: guests, error: guestError }] = await Promise.all([
    supabase.from('rsvps').select('id, attending'),
    supabase
      .from('guests')
      .select('id, name, arrived, arrived_at, table_number, created_at')
      .order('table_number', { ascending: true, nullsFirst: false })
      .order('name'),
  ])

  const rsvpList = rsvps ?? []
  const guestList: Guest[] = guests ?? []

  const attending    = rsvpList.filter(r => r.attending === 'yes').length
  const notAttending = rsvpList.filter(r => r.attending === 'no').length
  const arrivedCount = guestList.filter(g => g.arrived).length

  return (
    <div className="min-h-dvh bg-background">

      {/* top bar */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <span className="font-script text-foreground" style={{ fontSize: '1.6rem', lineHeight: 1 }}>
            H &amp; K
          </span>
          <span className="h-4 w-px bg-border" />
          <span className="font-serif uppercase tracking-[0.15em] text-muted-foreground" style={{ fontSize: '0.68rem' }}>
            Guest Arrivals
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 flex flex-col gap-10">

        {/* stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total RSVPs"   value={rsvpList.length} />
          <StatCard label="Attending"     value={attending}        sub="will be there" />
          <StatCard label="Not Attending" value={notAttending}     sub="sending regrets" />
          <StatCard label="Arrived"       value={arrivedCount}     sub={`of ${guestList.length} guests`} />
        </div>

        {/* arrivals table */}
        {guestError ? (
          <div className="rounded-xl border border-border bg-card shadow-sm px-6 py-10 text-center">
            <p className="font-serif text-muted-foreground" style={{ fontSize: '0.88rem' }}>
              Could not load guests — run <code className="text-gold">supabase/guest-arrivals-setup.sql</code> in Supabase first.
            </p>
          </div>
        ) : (
          <ArrivalsTable guests={guestList} />
        )}

      </main>
    </div>
  )
}
