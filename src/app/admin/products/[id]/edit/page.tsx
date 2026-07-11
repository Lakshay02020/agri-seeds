import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/ProductForm"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: categories } = await supabase.from('categories').select('*').order('name')
  
  const { data: product } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('id', id)
    .single()

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Edit Product</h1>
        <p className="text-zinc-500 mt-2">Update the details, pricing, and stock of this seed variety.</p>
      </div>

      <ProductForm categories={categories || []} initialData={product} />
    </div>
  )
}
