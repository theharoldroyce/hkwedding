'use client'

import { useState } from 'react'
import { addGuest, editGuest, removeGuest, toggleArrived } from './actions'
import { GUEST_CATEGORIES } from '@/lib/guest-categories'

type Guest = {
  id: string
  name: string
  arrived: boolean
  arrived_at: string | null
  table_number: number | null
  category: string | null
}

export function ArrivalsTable({ guests }: { guests: Guest[] }) {
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<Guest | null>(null)

  const filtered = guests.filter(g => {
    if (categoryFilter && g.category !== categoryFilter) return false
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      g.name.toLowerCase().includes(q) ||
      String(g.table_number ?? '').includes(q) ||
      (g.category?.toLowerCase().includes(q) ?? false)
    )
  })

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">

      {/* header */}
      <div className="border-b border-border px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-serif text-foreground" style={{ fontSize: '1rem' }}>
            Guest Arrivals
          </h2>
          <p className="font-serif text-muted-foreground" style={{ fontSize: '0.75rem' }}>
            Add guests, assign tables, and check them in as they arrive
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
              placeholder="Search name, table, or role…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="rounded-lg border border-border bg-background pl-8 pr-4 py-2 font-serif text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-gold/60 transition-colors"
              style={{ fontSize: '0.82rem', width: '190px' }}
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

          {/* category filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
            className="rounded-lg border border-border bg-background px-3 py-2 font-serif text-foreground outline-none focus:border-gold/60 transition-colors"
            style={{ fontSize: '0.82rem' }}
          >
            <option value="">All roles</option>
            {GUEST_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* add guest toggle */}
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 font-serif uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-85 whitespace-nowrap"
            style={{ fontSize: '0.68rem' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" className="size-3.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Guest
          </button>
        </div>
      </div>

      {/* add guest modal */}
      {adding && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-guest-title"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setAdding(false)}
          />

          {/* dialog */}
          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
            style={{ boxShadow: '0 20px 60px -20px rgba(0,0,0,0.4)' }}
          >
            {/* corner dots */}
            <span className="absolute left-4 top-4 size-1.5 rounded-full bg-gold/25" />
            <span className="absolute right-4 top-4 size-1.5 rounded-full bg-gold/25" />

            {/* close */}
            <button
              onClick={() => setAdding(false)}
              aria-label="Close"
              className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="size-4">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <form
              action={async (formData) => {
                await addGuest(formData)
                setAdding(false)
              }}
              className="flex flex-col gap-6 px-8 py-10"
            >
              <div className="flex flex-col items-center gap-1 text-center">
                <h3 id="add-guest-title" className="font-script text-foreground" style={{ fontSize: '1.8rem', lineHeight: 1 }}>
                  Add a Guest
                </h3>
                <span className="mt-2 block h-px w-10 bg-gold/40" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="add-name" className="font-serif uppercase tracking-[0.12em] text-gold/70" style={{ fontSize: '0.65rem' }}>
                  Name
                </label>
                <input
                  id="add-name"
                  name="name"
                  type="text"
                  required
                  autoFocus
                  placeholder="Full name"
                  className="rounded-lg border border-border bg-background px-4 py-2.5 font-serif text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-gold/60 transition-colors"
                  style={{ fontSize: '0.9rem' }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="add-table" className="font-serif uppercase tracking-[0.12em] text-gold/70" style={{ fontSize: '0.65rem' }}>
                  Table Number
                </label>
                <input
                  id="add-table"
                  name="table_number"
                  type="number"
                  min={1}
                  placeholder="e.g. 5"
                  className="rounded-lg border border-border bg-background px-4 py-2.5 font-serif text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-gold/60 transition-colors"
                  style={{ fontSize: '0.9rem' }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="add-category" className="font-serif uppercase tracking-[0.12em] text-gold/70" style={{ fontSize: '0.65rem' }}>
                  Role / Category
                </label>
                <select
                  id="add-category"
                  name="category"
                  defaultValue=""
                  className="rounded-lg border border-border bg-background px-4 py-2.5 font-serif text-foreground outline-none focus:border-gold/60 transition-colors"
                  style={{ fontSize: '0.9rem' }}
                >
                  <option value="">— Select a role —</option>
                  {GUEST_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setAdding(false)}
                  className="flex-1 rounded-lg border border-border bg-background px-5 py-2.5 font-serif uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
                  style={{ fontSize: '0.68rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-gold px-5 py-2.5 font-serif uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-85"
                  style={{ fontSize: '0.68rem' }}
                >
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* edit guest modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-guest-title"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditing(null)}
          />

          {/* dialog */}
          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
            style={{ boxShadow: '0 20px 60px -20px rgba(0,0,0,0.4)' }}
          >
            {/* corner dots */}
            <span className="absolute left-4 top-4 size-1.5 rounded-full bg-gold/25" />
            <span className="absolute right-4 top-4 size-1.5 rounded-full bg-gold/25" />

            {/* close */}
            <button
              onClick={() => setEditing(null)}
              aria-label="Close"
              className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="size-4">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <form
              action={async (formData) => {
                await editGuest(formData)
                setEditing(null)
              }}
              className="flex flex-col gap-6 px-8 py-10"
            >
              <input type="hidden" name="id" value={editing.id} />

              <div className="flex flex-col items-center gap-1 text-center">
                <h3 id="edit-guest-title" className="font-script text-foreground" style={{ fontSize: '1.8rem', lineHeight: 1 }}>
                  Edit Guest
                </h3>
                <span className="mt-2 block h-px w-10 bg-gold/40" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="edit-name" className="font-serif uppercase tracking-[0.12em] text-gold/70" style={{ fontSize: '0.65rem' }}>
                  Name
                </label>
                <input
                  id="edit-name"
                  name="name"
                  type="text"
                  required
                  autoFocus
                  defaultValue={editing.name}
                  placeholder="Full name"
                  className="rounded-lg border border-border bg-background px-4 py-2.5 font-serif text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-gold/60 transition-colors"
                  style={{ fontSize: '0.9rem' }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="edit-table" className="font-serif uppercase tracking-[0.12em] text-gold/70" style={{ fontSize: '0.65rem' }}>
                  Table Number
                </label>
                <input
                  id="edit-table"
                  name="table_number"
                  type="number"
                  min={1}
                  defaultValue={editing.table_number ?? ''}
                  placeholder="e.g. 5"
                  className="rounded-lg border border-border bg-background px-4 py-2.5 font-serif text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-gold/60 transition-colors"
                  style={{ fontSize: '0.9rem' }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="edit-category" className="font-serif uppercase tracking-[0.12em] text-gold/70" style={{ fontSize: '0.65rem' }}>
                  Role / Category
                </label>
                <select
                  id="edit-category"
                  name="category"
                  defaultValue={editing.category ?? ''}
                  className="rounded-lg border border-border bg-background px-4 py-2.5 font-serif text-foreground outline-none focus:border-gold/60 transition-colors"
                  style={{ fontSize: '0.9rem' }}
                >
                  <option value="">— Select a role —</option>
                  {GUEST_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="flex-1 rounded-lg border border-border bg-background px-5 py-2.5 font-serif uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
                  style={{ fontSize: '0.68rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-gold px-5 py-2.5 font-serif uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-85"
                  style={{ fontSize: '0.68rem' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* empty states */}
      {guests.length === 0 && (
        <div className="px-6 py-16 text-center">
          <p className="font-serif text-muted-foreground" style={{ fontSize: '0.88rem' }}>
            No guests yet. Add one above, or they&rsquo;ll appear here as RSVPs come in.
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
                <th className="px-6 py-3 font-serif uppercase tracking-[0.12em] text-gold/70" style={{ fontSize: '0.65rem' }}>Table</th>
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
                  <td className="px-6 py-4 font-serif text-foreground" style={{ fontSize: '0.85rem' }}>
                    {guest.table_number != null ? (
                      <span className="inline-flex items-center rounded-md border border-border bg-background px-2.5 py-0.5" style={{ fontSize: '0.78rem' }}>
                        {guest.table_number}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
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
                      <button
                        type="button"
                        onClick={() => setEditing(guest)}
                        aria-label={`Edit ${guest.name}`}
                        className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                      </button>
                      <form
                        action={removeGuest}
                        onSubmit={e => {
                          if (!confirm(`Remove ${guest.name} from the list?`)) e.preventDefault()
                        }}
                      >
                        <input type="hidden" name="id" value={guest.id} />
                        <button
                          type="submit"
                          aria-label={`Remove ${guest.name}`}
                          className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 5v6m4-6v6" />
                          </svg>
                        </button>
                      </form>
                    </div>
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
