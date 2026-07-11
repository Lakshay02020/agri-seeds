import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { deleteProduct } from "@/actions/products"

export default async function AdminProducts() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      categories ( name ),
      product_images ( image_url )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Products</h1>
          <p className="text-zinc-500 mt-2">Manage your seed inventory, pricing, and details.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-zinc-500">
          No products found. Click "Add Product" to create your first seed listing.
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[800px]">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-medium">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 relative rounded-md overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                        {product.product_images && product.product_images.length > 0 ? (
                          <Image src={product.product_images[0].image_url} alt={product.name} fill className="object-cover" />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-zinc-400">?</span>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-900">{product.name}</div>
                        <div className="text-zinc-500 text-xs">{product.brand || 'No Brand'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600">{product.categories?.name || 'Uncategorized'}</td>
                  <td className="px-6 py-4 font-medium">₹{product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {product.is_active ? (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-green-600"><span className="h-1.5 w-1.5 rounded-full bg-green-600"></span> Active</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500"><span className="h-1.5 w-1.5 rounded-full bg-zinc-400"></span> Draft</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-8">
                          <Edit className="h-3 w-3 mr-1" /> Edit
                        </Button>
                      </Link>
                      <form action={async () => {
                        'use server'
                        await deleteProduct(product.id)
                      }}>
                        <Button type="submit" variant="destructive" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  )
}
