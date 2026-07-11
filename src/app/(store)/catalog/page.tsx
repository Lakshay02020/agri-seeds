import { createClient } from "@/lib/supabase/server"
import { Leaf } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function CatalogPage() {
  const supabase = await createClient()
  
  // Fetch active products
  const { data: products } = await supabase
    .from('products')
    .select(`
      id, name, slug, price, brand, pack_size,
      categories(name),
      product_images(image_url)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 pt-12 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 mb-4">
            Seed Catalog
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl">
            Browse our complete collection of premium, high-yielding agricultural seeds designed for maximum growth.
          </p>
        </div>

        {!products || products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-16 text-center shadow-sm">
            <Leaf className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">No products found</h3>
            <p className="text-zinc-500">We are currently updating our inventory. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => {
              const imageUrl = product.product_images?.[0]?.image_url
              return (
                <Link href={`/product/${product.slug}`} key={product.id} className="group block bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all">
                  <div className="relative aspect-square rounded-xl bg-zinc-50 mb-4 overflow-hidden border border-zinc-100">
                    {imageUrl ? (
                      <Image 
                        src={imageUrl} 
                        alt={product.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                        <Leaf className="h-8 w-8 opacity-20" />
                      </div>
                    )}
                    
                    {product.brand && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-zinc-800 shadow-sm">
                        {product.brand}
                      </div>
                    )}
                  </div>
                  
                  <div className="px-1 pb-2">
                    <div className="text-xs font-medium text-green-600 mb-1">
                      {(product.categories as any)?.name || 'Uncategorized'}
                    </div>
                    <h3 className="font-semibold text-zinc-900 text-base mb-1 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-lg text-zinc-900">₹{product.price.toFixed(2)}</span>
                      {product.pack_size && (
                        <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-1 rounded-md">{product.pack_size}</span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
