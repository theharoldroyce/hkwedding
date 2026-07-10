'use client'

import { useState } from 'react'
import { toggleArrived } from './actions'

type Guest = {
  id: string
  name: string
  arrived: boolean
  arrived_at: string | null
  category: string | null
}

export function GuestArrivalsTable({ guests }: { guests: Guest[] }) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? guests.filter(g => g.name.toLowerCase().includes(query.toLowerCase()))
    : guests

  const arrivedCount = guests.filter(g => g.arrived).length

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">

      {/* header */}
      <div className="border-b border-border px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-serif text-foreground" style={{ fontSize: '1rem' }}>
            Guest Arrivals
          </h2>
          <p className="font-serif text-muted-foreground" style={{ fontSize: '0.75rem' }}>
            Mark guests as they arrive on the day
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* search */}
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search guest…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="rounded-lg border border-border bg-background pl-8 pr-4 py-2 font-serif text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-gold/60 transition-colors"
              style={{ fontSize: '0.82rem', width: '180px' }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="size-3">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <span className="font-serif uppercase tracking-[0.12em] text-muted-foreground whitespace-nowrap" style={{ fontSize: '0.68rem' }}>
            {arrivedCount} / {guests.length} arrived
          </span>
        </div>
      </div>

      {/* empty states */}
      {guests.length === 0 && (
        <div className="px-6 py-16 text-center">
          <p className="font-serif text-muted-foreground" style={{ fontSize: '0.88rem' }}>
            No attending guests yet. They will appear here once RSVPs come in.
          </p>
        </div>
      )}

      {guests.length > 0 && filtered.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="font-serif text-muted-foreground" style={{ fontSize: '0.88rem' }}>
            No guests match &ldquo;{query}&rdquo;
          </p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-6 py-3 font-serif uppercase tracking-[0.12em] text-gold/70" style={{ fontSize: '0.65rem' }}>Name</th>
                <th className="px-6 py-3 font-serif uppercase tracking-[0.12em] text-gold/70" style={{ fontSize: '0.65rem' }}>Role</th>
                <th className="px-6 py-3 font-serif uppercase tracking-[0.12em] text-gold/70" style={{ fontSize: '0.65rem' }}>Status</th>
                <th className="px-6 py-3 font-serif uppercase tracking-[0.12em] text-gold/70" style={{ fontSize: '0.65rem' }}>Arrived At</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((guest, i) => (
                <tr
                  key={guest.id}
                  className={`border-b border-border last:border-0 transition-colors ${
                    guest.arrived ? 'bg-butter/10' : i % 2 === 0 ? '' : 'bg-background/30'
                  }`}
                >
                  <td className="px-6 py-4 font-serif text-foreground" style={{ fontSize: '0.9rem' }}>
                    {guest.name}
                  </td>
                  <td className="px-6 py-4">
                    {guest.category ? (
                      <span
                        className="inline-flex items-center rounded-full border border-gold/30 bg-butter/20 px-2.5 py-0.5 font-serif uppercase tracking-widest text-foreground"
                        style={{ fontSize: '0.6rem' }}
                      >
                        {guest.category}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-serif uppercase tracking-widest ${
                        guest.arrived ? 'bg-butter/50 text-foreground' : 'bg-muted text-muted-foreground'
                      }`}
                      style={{ fontSize: '0.65rem' }}
                    >
                      <span className={`size-1.5 rounded-full ${guest.arrived ? 'bg-gold' : 'bg-muted-foreground/40'}`} />
                      {guest.arrived ? 'Arrived' : 'Not yet'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-serif text-muted-foreground" style={{ fontSize: '0.82rem' }}>
                    {guest.arrived_at
                      ? new Date(guest.arrived_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={toggleArrived}>
                      <input type="hidden" name="id" value={guest.id} />
                      <input type="hidden" name="arrived" value={String(guest.arrived)} />
                      <button
                        type="submit"
                        className={`rounded-lg px-3 py-1.5 font-serif uppercase tracking-[0.1em] transition-colors ${
                          guest.arrived
                            ? 'border border-border text-muted-foreground hover:border-gold/40 hover:text-foreground'
                            : 'bg-gold text-white hover:opacity-85'
                        }`}
                        style={{ fontSize: '0.65rem' }}
                      >
                        {guest.arrived ? 'Undo' : 'Check In'}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
