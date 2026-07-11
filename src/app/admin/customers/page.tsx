export default function AdminCustomers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Customers</h1>
        <p className="text-zinc-500 mt-2">View registered users and their details.</p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-zinc-500">
        No customers found. Once users register on your site, they will appear here.
      </div>
    </div>
  )
}
