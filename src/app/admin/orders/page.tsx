import { createClient } from "@/lib/supabase/server"
import { Package, Truck, CheckCircle2, Clock } from "lucide-react"

export default async function AdminOrders() {
  const supabase = await createClient()

  // Fetch all orders with user info
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      profiles:user_id ( full_name, email )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Orders</h1>
        <p className="text-zinc-500 mt-2">Manage customer orders and fulfillments.</p>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 mb-4">
            <Package className="h-6 w-6 text-zinc-400" />
          </div>
          <h3 className="text-lg font-medium text-zinc-900">No orders yet</h3>
          <p className="mt-2 text-sm text-zinc-500">
            Once a customer places an order, it will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-zinc-900 truncate block max-w-[120px]" title={order.id}>
                      {order.id.split('-')[0]}...
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-900">{order.profiles?.full_name || 'Guest'}</div>
                    <div className="text-zinc-500 text-xs">{order.profiles?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 font-semibold text-zinc-900">
                    ₹{order.total_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {order.payment_status === 'PAID' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle2 className="h-3 w-3" /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        <Clock className="h-3 w-3" /> {order.payment_status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      <Truck className="h-3 w-3" /> {order.order_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
