import { createClient } from "@/lib/supabase/server"
import { Users, Mail, Phone, Calendar } from "lucide-react"

export default async function AdminCustomers() {
  const supabase = await createClient()

  // Fetch all customers
  const { data: customers } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Customers</h1>
        <p className="text-zinc-500 mt-2">View registered users and their details.</p>
      </div>

      {!customers || customers.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 mb-4">
            <Users className="h-6 w-6 text-zinc-400" />
          </div>
          <h3 className="text-lg font-medium text-zinc-900">No customers yet</h3>
          <p className="mt-2 text-sm text-zinc-500">
            Once users register on your site, they will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[800px]">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-medium">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold flex-shrink-0">
                          {customer.full_name ? customer.full_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="font-medium text-zinc-900">
                          {customer.full_name || 'Unnamed User'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-zinc-600">
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-zinc-400" /> {customer.email}
                        </span>
                        {customer.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-zinc-400" /> {customer.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                        {new Date(customer.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Active Account
                      </span>
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
