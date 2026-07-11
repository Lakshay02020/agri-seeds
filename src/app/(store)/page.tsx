import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf, Sprout } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function Home() {
  const supabase = await createClient()
  
  // Fetch active products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select(`
      id, name, slug, price, brand, pack_size,
      categories(name),
      product_images(image_url)
    `)
    .eq('is_active', true)
    .limit(4)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-50 pt-20 pb-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03]"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700 mb-8">
              <Sprout className="h-4 w-4" />
              <span>Premium Quality Agricultural Seeds</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 mb-8 leading-[1.1]">
              Grow your yield with <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                confidence and quality.
              </span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-zinc-600 mb-10 leading-relaxed">
              Direct from the best breeders to your farm. Discover high-yielding, disease-resistant seeds curated specifically for Indian climates and soils.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/catalog" className="inline-flex items-center justify-center h-14 px-8 bg-green-600 hover:bg-green-700 text-white rounded-full text-base font-semibold shadow-lg shadow-green-600/20 w-full sm:w-auto group transition-colors">
                Explore Catalog
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/categories" className="inline-flex items-center justify-center h-14 px-8 rounded-full text-base font-semibold border border-zinc-200 bg-transparent hover:bg-zinc-100 hover:text-zinc-900 w-full sm:w-auto transition-colors">
                View Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Featured Seeds</h2>
              <p className="text-zinc-500">Our most popular and high-yielding varieties.</p>
            </div>
            <Link href="/catalog" className="hidden sm:flex items-center text-green-600 font-medium hover:text-green-700 transition-colors">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {!featuredProducts || featuredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-12 text-center">
              <Leaf className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
              <h3 className="text-lg font-semibold text-zinc-900 mb-1">No products yet</h3>
              <p className="text-zinc-500">Check back soon for our premium seed selection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => {
                const imageUrl = product.product_images?.[0]?.image_url
                return (
                  <Link href={`/product/${product.slug}`} key={product.id} className="group block">
                    <div className="relative aspect-square rounded-2xl bg-zinc-100 mb-4 overflow-hidden border border-zinc-200/60">
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
                    
                    <div>
                      <div className="text-xs font-medium text-green-600 mb-1">
                        {product.categories?.name || 'Uncategorized'}
                      </div>
                      <h3 className="font-semibold text-zinc-900 text-lg mb-1 line-clamp-1 group-hover:text-green-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-lg text-zinc-900">₹{product.price.toFixed(2)}</span>
                        {product.pack_size && (
                          <span className="text-sm text-zinc-500">{product.pack_size}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
