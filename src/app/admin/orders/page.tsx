export default function AdminOrders() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Orders</h1>
        <p className="text-zinc-500 mt-2">Manage customer orders and fulfillments.</p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-zinc-500">
        No orders found. Once a customer places an order, it will appear here.
      </div>
    </div>
  )
}
