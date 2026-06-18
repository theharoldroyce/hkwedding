'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(_: unknown, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) return { error: error.message }

  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

export async function toggleArrived(formData: FormData) {
  const id = formData.get('id') as string
  const arrived = formData.get('arrived') === 'true'

  const supabase = await createClient()
  await supabase
    .from('guests')
    .update({
      arrived: !arrived,
      arrived_at: !arrived ? new Date().toISOString() : null,
    })
    .eq('id', id)

  revalidatePath('/admin')
}
