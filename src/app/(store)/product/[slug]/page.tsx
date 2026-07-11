import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Sprout } from "lucide-react"
import { AddToCartButton } from "@/components/store/AddToCartButton"

export default async function ProductDetails({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { slug } = await params
  
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      categories(name),
      product_images(image_url)
    `)
    .eq('slug', slug)
    .limit(1)
    .single()

  if (error) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Database Query Error</h1>
        <p className="text-zinc-600 bg-zinc-100 p-4 rounded-md inline-block text-left font-mono text-sm max-w-2xl overflow-auto">
          {JSON.stringify(error, null, 2)}
        </p>
      </div>
    )
  }

  if (!product || !product.is_active) {
    notFound()
  }

  const mainImage = product.product_images?.[0]?.image_url

  return (
    <div className="bg-white">
      <div className="border-b border-zinc-100 bg-zinc-50/50">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-green-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Images Section */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200">
              {mainImage ? (
                <Image src={mainImage} alt={product.name} fill className="object-cover" priority />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                  <Sprout className="h-20 w-20 opacity-20" />
                </div>
              )}
            </div>
            
            {product.product_images && product.product_images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.product_images.map((img: any, i: number) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 cursor-pointer hover:border-green-600 transition-colors">
                    <Image src={img.image_url} alt={`${product.name} ${i}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <div className="mb-6">
              <p className="text-green-600 font-semibold mb-2">{product.categories?.name || 'General'}</p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 text-zinc-500">
                {product.brand && (
                  <div className="flex items-center gap-1.5 bg-zinc-100 px-3 py-1 rounded-full text-sm font-medium text-zinc-700">
                    Brand: {product.brand}
                  </div>
                )}
                {product.pack_size && (
                  <div className="flex items-center gap-1.5 text-sm">
                    Pack: <span className="font-medium text-zinc-900">{product.pack_size}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-end gap-4 mb-8">
              <span className="text-4xl font-bold text-zinc-900">₹{product.price.toFixed(2)}</span>
              {product.discount > 0 && (
                <span className="text-lg text-zinc-400 line-through mb-1">₹{(product.price + product.discount).toFixed(2)}</span>
              )}
            </div>

            {product.description && (
              <p className="text-lg text-zinc-600 leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            <div className="h-px w-full bg-zinc-200 mb-8"></div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8">
              {product.crop_type && (
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Crop Type</p>
                  <p className="font-medium text-zinc-900">{product.crop_type}</p>
                </div>
              )}
              {product.hybrid_open_pollinated && (
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Seed Type</p>
                  <p className="font-medium text-zinc-900">{product.hybrid_open_pollinated}</p>
                </div>
              )}
              {product.season && (
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Suitable Season</p>
                  <p className="font-medium text-zinc-900">{product.season}</p>
                </div>
              )}
              {product.maturity_duration && (
                <div>
                  <p className="text-sm text-zinc-500 mb-1">Maturity</p>
                  <p className="font-medium text-zinc-900">{product.maturity_duration}</p>
                </div>
              )}
            </div>

            {product.features && (
              <div className="mb-8 p-6 bg-green-50 rounded-2xl border border-green-100">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Key Features
                </h3>
                <p className="text-green-800 text-sm leading-relaxed">{product.features}</p>
              </div>
            )}

            {/* Client Component for interactive Add to Cart */}
            <AddToCartButton product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: mainImage || '',
              pack_size: product.pack_size,
              stock: product.stock
            }} />
            
            <p className="text-sm text-zinc-500 mt-4 text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
              <span className={`h-2 w-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
              {product.stock > 10 ? 'In Stock & Ready to Ship' : product.stock > 0 ? `Only ${product.stock} left in stock` : 'Currently Out of Stock'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
