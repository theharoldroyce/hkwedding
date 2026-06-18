import { createClient } from '@/lib/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
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
