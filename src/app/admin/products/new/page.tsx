import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/ProductForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewProductPage() {
  const supabase = await createClient()
  
  // Fetch categories to populate the dropdown
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Link href="/admin/products" className="flex items-center text-sm font-medium text-green-600 hover:text-green-700 w-fit">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Products
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Add New Product</h1>
          <p className="text-zinc-500 mt-2">Fill in the details below to add a new seed variety to your store.</p>
        </div>
      </div>
      
      <ProductForm categories={categories || []} />
    </div>
  )
}
