'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  // Security Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') return { error: "Forbidden: Admin access required" }

  const name = formData.get('name') as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  
  // Extract images correctly
  const imageUrlsJson = formData.get('imageUrls') as string
  const imageUrls = imageUrlsJson ? JSON.parse(imageUrlsJson) : []

  const productData = {
    category_id: formData.get('category_id') as string,
    name,
    slug,
    brand: formData.get('brand') as string,
    crop_type: formData.get('crop_type') as string,
    seed_variety: formData.get('seed_variety') as string,
    hybrid_open_pollinated: formData.get('hybrid_open_pollinated') as 'Hybrid' | 'Open Pollinated',
    season: formData.get('season') as string,
    pack_size: formData.get('pack_size') as string,
    price: parseFloat(formData.get('price') as string),
    discount: parseFloat(formData.get('discount') as string) || 0,
    stock: parseInt(formData.get('stock') as string) || 0,
    description: formData.get('description') as string,
    benefits: formData.get('benefits') as string,
    features: formData.get('features') as string,
    yield_info: formData.get('yield_info') as string,
    maturity_duration: formData.get('maturity_duration') as string,
    disease_resistance: formData.get('disease_resistance') as string,
    sowing_time: formData.get('sowing_time') as string,
    climate: formData.get('climate') as string,
    irrigation: formData.get('irrigation') as string,
    germination_rate: formData.get('germination_rate') as string,
    storage_instructions: formData.get('storage_instructions') as string,
    is_active: formData.get('is_active') === 'true',
  }

  const { data: product, error } = await supabase
    .from('products')
    .insert(productData)
    .select('id')
    .single()

  if (error) {
    console.error("Product Insert Error:", error)
    return { error: error.message }
  }

  // Insert Images
  if (product && imageUrls.length > 0) {
    const imageInserts = imageUrls.map((url: string, index: number) => ({
      product_id: product.id,
      image_url: url,
      display_order: index,
    }))
    
    await supabase.from('product_images').insert(imageInserts)
  }

  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  // Security Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') return { error: "Forbidden: Admin access required" }

  const { error } = await supabase.from('products').delete().eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/admin/products')
  return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()

  // Security Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') return { error: "Forbidden: Admin access required" }

  const name = formData.get('name') as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  
  const imageUrlsJson = formData.get('imageUrls') as string
  const imageUrls = imageUrlsJson ? JSON.parse(imageUrlsJson) : []

  const productData = {
    category_id: formData.get('category_id') as string,
    name,
    slug,
    brand: formData.get('brand') as string,
    crop_type: formData.get('crop_type') as string,
    seed_variety: formData.get('seed_variety') as string,
    hybrid_open_pollinated: formData.get('hybrid_open_pollinated') as 'Hybrid' | 'Open Pollinated',
    season: formData.get('season') as string,
    pack_size: formData.get('pack_size') as string,
    price: parseFloat(formData.get('price') as string),
    discount: parseFloat(formData.get('discount') as string) || 0,
    stock: parseInt(formData.get('stock') as string) || 0,
    description: formData.get('description') as string,
    benefits: formData.get('benefits') as string,
    features: formData.get('features') as string,
    yield_info: formData.get('yield_info') as string,
    maturity_duration: formData.get('maturity_duration') as string,
    disease_resistance: formData.get('disease_resistance') as string,
    sowing_time: formData.get('sowing_time') as string,
    climate: formData.get('climate') as string,
    irrigation: formData.get('irrigation') as string,
    germination_rate: formData.get('germination_rate') as string,
    storage_instructions: formData.get('storage_instructions') as string,
    is_active: formData.get('is_active') === 'true',
  }

  const { error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)

  if (error) {
    console.error("Product Update Error:", error)
    return { error: error.message }
  }

  if (imageUrls.length > 0) {
    // Delete old images first to keep it simple
    await supabase.from('product_images').delete().eq('product_id', id)
    
    const imageInserts = imageUrls.map((url: string, index: number) => ({
      product_id: id,
      image_url: url,
      display_order: index,
    }))
    
    await supabase.from('product_images').insert(imageInserts)
  }

  revalidatePath('/admin/products')
  redirect('/admin/products')
}
