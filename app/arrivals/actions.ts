'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'

// NOTE: /arrivals is a public page with no sign-in. These actions run with
// the anonymous key and rely on the RLS policies in
// supabase/guest-arrivals-setup.sql to permit anonymous writes.

export async function addGuest(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const tableRaw = (formData.get('table_number') as string)?.trim()
  const category = (formData.get('category') as string)?.trim() || null

  if (!name) return

  const table_number =
    tableRaw && !Number.isNaN(Number(tableRaw)) ? Number(tableRaw) : null

  const supabase = await createClient()
  await supabase.from('guests').insert({ name, table_number, category })

  revalidatePath('/arrivals')
}

export async function editGuest(formData: FormData) {
  const id = formData.get('id') as string
  const name = (formData.get('name') as string)?.trim()
  const tableRaw = (formData.get('table_number') as string)?.trim()
  const category = (formData.get('category') as string)?.trim() || null

  if (!id || !name) return

  const table_number =
    tableRaw && !Number.isNaN(Number(tableRaw)) ? Number(tableRaw) : null

  const supabase = await createClient()
  await supabase.from('guests').update({ name, table_number, category }).eq('id', id)

  revalidatePath('/arrivals')
}

export async function removeGuest(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient()

  // If this guest came from an RSVP, delete that RSVP too so the
  // Total RSVPs / Attending counts stay in sync.
  const { data: guest } = await supabase
    .from('guests')
    .select('rsvp_id')
    .eq('id', id)
    .single()

  await supabase.from('guests').delete().eq('id', id)

  if (guest?.rsvp_id) {
    await supabase.from('rsvps').delete().eq('id', guest.rsvp_id)
  }

  revalidatePath('/arrivals')
}

export async function toggleArrived(formData: FormData) {
  const id = formData.get('id') as string
  const arrived = formData.get('arrived') === 'true'
  if (!id) return

  const supabase = await createClient()
  await supabase
    .from('guests')
    .update({
      arrived: !arrived,
      arrived_at: !arrived ? new Date().toISOString() : null,
    })
    .eq('id', id)

  revalidatePath('/arrivals')
}
