import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { CategoryDialog } from "@/components/admin/CategoryDialog"
import Image from "next/image"
import { deleteCategory } from "@/actions/categories"

export default async function AdminCategories() {
  const supabase = await createClient()
  
  // Fetch categories from database
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Categories</h1>
          <p className="text-zinc-500 mt-2">Organize your seeds into crop families.</p>
        </div>
        
        <CategoryDialog />
      </div>

      {!categories || categories.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-zinc-500">
          No categories found. Click "Add Category" to create your first one.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category.id} className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md">
              {category.image_url ? (
                <div className="relative h-48 w-full bg-zinc-100">
                  <Image src={category.image_url} alt={category.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-48 w-full items-center justify-center bg-green-50">
                  <span className="text-green-600 font-medium">{category.name.charAt(0)}</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-zinc-900">{category.name}</h3>
                <p className="text-sm text-zinc-500 line-clamp-2 mt-1">{category.description || 'No description provided.'}</p>
              </div>
              
              <form action={async () => {
                'use server'
                await deleteCategory(category.id)
              }} className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button type="submit" size="icon" variant="destructive" className="h-8 w-8 shadow-sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
