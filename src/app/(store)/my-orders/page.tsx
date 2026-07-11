import { createClient } from "@/lib/supabase/server"
import { Package, Clock, CheckCircle2, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"

export default async function MyOrdersPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login?next=/my-orders')
  }

  // Fetch user's orders with items
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:product_id (name, slug, product_images(image_url))
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-zinc-50 pt-12 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">My Orders</h1>
          <p className="text-zinc-500 mt-2">View and track your recent purchases.</p>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center shadow-sm">
            <Package className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">No orders found</h3>
            <p className="text-zinc-500 mb-6">You haven't placed any orders yet. Start exploring our premium seeds!</p>
            <Link href="/catalog" className="inline-flex items-center justify-center h-12 px-6 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
                {/* Order Header */}
                <div className="bg-zinc-50/80 border-b border-zinc-200 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-x-8 gap-y-4">
                    <div>
                      <p className="text-xs font-medium text-zinc-500 mb-1">Order Placed</p>
                      <p className="text-sm font-semibold text-zinc-900">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-500 mb-1">Total</p>
                      <p className="text-sm font-semibold text-zinc-900">₹{order.total_amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-500 mb-1">Order ID</p>
                      <p className="text-sm font-semibold text-zinc-900">{order.id.split('-')[0]}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {order.payment_status === 'PAID' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <CheckCircle2 className="h-4 w-4" /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        <Clock className="h-4 w-4" /> {order.payment_status}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      <Truck className="h-4 w-4" /> {order.order_status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:p-6 divide-y divide-zinc-100">
                  {order.order_items?.map((item: any) => {
                    const product = item.product;
                    const imageUrl = product?.product_images?.[0]?.image_url;
                    
                    return (
                      <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                        <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 flex-shrink-0">
                          {imageUrl ? (
                            <Image src={imageUrl} alt={product?.name || 'Product'} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-zinc-400 text-xs text-center">No Image</div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <Link href={`/product/${product?.slug || '#'}`} className="font-semibold text-zinc-900 hover:text-green-600 transition-colors line-clamp-1">
                              {product?.name || 'Unknown Product'}
                            </Link>
                            <p className="text-sm text-zinc-500 mt-1">Qty: {item.quantity}</p>
                          </div>
                          <div className="font-bold text-zinc-900">
                            ₹{item.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
