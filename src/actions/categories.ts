'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCategory(formData: FormData) {
  const supabase = await createClient()

  // Security Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') return { error: "Forbidden: Admin access required" }

  const name = formData.get('name') as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  const description = formData.get('description') as string
  const imageUrl = formData.get('imageUrl') as string

  const { error } = await supabase.from('categories').insert({
    name,
    slug,
    description,
    image_url: imageUrl,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/categories')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()

  // Security Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') return { error: "Forbidden: Admin access required" }

  const { error } = await supabase.from('categories').delete().eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/admin/categories')
  return { success: true }
}
