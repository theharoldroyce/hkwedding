import { createClient } from '@/lib/server'
import { isRsvpClosed } from '@/lib/rsvp'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // RSVP closes automatically on August 1, 2026 — reject late submissions.
  if (isRsvpClosed()) {
    return NextResponse.json(
      { error: 'RSVP is now closed. Please contact the couple directly.' },
      { status: 403 },
    )
  }

  const { name, attending } = await request.json()

  if (!name?.trim() || !['yes', 'no'].includes(attending)) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: rsvp, error } = await supabase
    .from('rsvps')
    .insert({ name: name.trim(), attending })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Add to guests check-in list for attendees
  if (attending === 'yes') {
    await supabase
      .from('guests')
      .insert({ rsvp_id: rsvp.id, name: name.trim() })
  }

  return NextResponse.json({ ok: true })
}
