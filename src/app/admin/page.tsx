import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IndianRupee, Package, ShoppingCart, Users, CheckCircle2, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Run queries in parallel
  const [
    { data: ordersData },
    { count: productsCount },
    { count: customersCount },
    { data: recentOrders }
  ] = await Promise.all([
    supabase.from('orders').select('total_amount'),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('orders')
      .select('*, profiles:user_id ( full_name, email )')
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  const totalRevenue = ordersData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0
  const ordersCount = ordersData?.length || 0
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
        <p className="text-zinc-500 mt-2">Welcome to the AgriSeeds administration panel.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-zinc-500 mt-1">+0% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersCount}</div>
            <p className="text-xs text-zinc-500 mt-1">Total completed orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsCount || 0}</div>
            <p className="text-xs text-zinc-500 mt-1">Seeds available in store</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersCount || 0}</div>
            <p className="text-xs text-zinc-500 mt-1">Registered accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {!recentOrders || recentOrders.length === 0 ? (
            <div className="text-sm text-zinc-500 text-center py-8">
              No orders found yet. When a customer places an order, it will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[600px]">
                <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-600 font-medium">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-zinc-900 truncate max-w-[100px]" title={order.id}>
                        {order.id.split('-')[0]}...
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-zinc-900">{order.profiles?.full_name || 'Guest'}</div>
                      </td>
                      <td className="px-4 py-3 text-zinc-600">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3 font-semibold text-zinc-900 text-right">
                        ₹{order.total_amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        {order.payment_status === 'PAID' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">
                            <CheckCircle2 className="h-3 w-3" /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 text-yellow-700">
                            <Clock className="h-3 w-3" /> {order.payment_status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
