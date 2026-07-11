import Link from "next/link"
import { Sprout, LayoutDashboard, Package, ShoppingCart, Users, LogOut, Settings, List } from "lucide-react"
import { logout } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-zinc-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
              <Sprout className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-900">AgriAdmin</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-4">
            <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-900 bg-zinc-100 transition-all">
              <LayoutDashboard className="h-5 w-5 text-green-600" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link href="/admin/orders" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
              <ShoppingCart className="h-5 w-5" />
              <span className="font-medium">Orders</span>
            </Link>
            <Link href="/admin/products" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
              <Package className="h-5 w-5" />
              <span className="font-medium">Products</span>
            </Link>
            <Link href="/admin/categories" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
              <List className="h-5 w-5" />
              <span className="font-medium">Categories</span>
            </Link>
            <Link href="/admin/customers" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
              <Users className="h-5 w-5" />
              <span className="font-medium">Customers</span>
            </Link>
          </nav>
        </div>
        
        <div className="p-4 border-t border-zinc-200">
          <form action={logout}>
            <Button variant="ghost" className="w-full justify-start text-zinc-600 hover:text-red-600 hover:bg-red-50">
              <LogOut className="mr-2 h-5 w-5" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-zinc-200 md:hidden">
           <Link href="/admin" className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-green-600" />
            <span className="font-bold text-zinc-900">AgriAdmin</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="h-16 flex items-center px-6 border-b border-zinc-200">
                <Link href="/admin" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
                    <Sprout className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-zinc-900">AgriAdmin</span>
                </Link>
              </div>
              <div className="flex-1 overflow-auto py-4">
                <nav className="grid gap-1 px-4">
                  <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-900 hover:bg-zinc-100 transition-all">
                    <LayoutDashboard className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <Link href="/admin/orders" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="font-medium">Orders</span>
                  </Link>
                  <Link href="/admin/products" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
                    <Package className="h-5 w-5" />
                    <span className="font-medium">Products</span>
                  </Link>
                  <Link href="/admin/categories" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
                    <List className="h-5 w-5" />
                    <span className="font-medium">Categories</span>
                  </Link>
                  <Link href="/admin/customers" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">Customers</span>
                  </Link>
                </nav>
              </div>
              <div className="p-4 border-t border-zinc-200 absolute bottom-0 w-full">
                <form action={logout}>
                  <Button variant="ghost" className="w-full justify-start text-zinc-600 hover:text-red-600 hover:bg-red-50">
                    <LogOut className="mr-2 h-5 w-5" />
                    Sign out
                  </Button>
                </form>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <div className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
