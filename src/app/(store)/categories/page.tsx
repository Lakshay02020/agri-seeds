import { createClient } from "@/lib/supabase/server"
import { Leaf } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function CategoriesPage() {
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 pt-12 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl">
            Find exactly what you need by browsing our specialized seed categories.
          </p>
        </div>

        {!categories || categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-16 text-center shadow-sm">
            <Leaf className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">No categories yet</h3>
            <p className="text-zinc-500">We are currently setting up our categories. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link href={`/catalog?category=${category.slug}`} key={category.id} className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 block">
                {category.image_url ? (
                  <div className="relative h-48 w-full bg-zinc-100">
                    <Image src={category.image_url} alt={category.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                ) : (
                  <div className="flex h-48 w-full items-center justify-center bg-green-50">
                    <Leaf className="h-12 w-12 text-green-200" />
                  </div>
                )}
                
                <div className={category.image_url ? "absolute bottom-0 left-0 p-6 text-white" : "p-6"}>
                  <h3 className={`text-2xl font-bold mb-2 ${category.image_url ? 'text-white' : 'text-zinc-900'}`}>{category.name}</h3>
                  <p className={`line-clamp-2 text-sm ${category.image_url ? 'text-zinc-200' : 'text-zinc-500'}`}>
                    {category.description || 'Explore our collection of premium seeds in this category.'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
