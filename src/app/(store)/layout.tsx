import { Leaf, Menu } from "lucide-react"
import Link from "next/link"
import { CartDrawer } from "@/components/store/CartDrawer"
import { createClient } from "@/lib/supabase/server"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-green-100 selection:text-green-900">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-zinc-900 hidden sm:block">AgriSeeds</span>
          </Link>
          
          <nav className="hidden md:flex gap-8 text-sm font-medium text-zinc-600 absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="text-zinc-900 hover:text-green-600 transition-colors">Home</Link>
            <Link href="/catalog" className="hover:text-green-600 transition-colors">All Seeds</Link>
            <Link href="/categories" className="hover:text-green-600 transition-colors">Categories</Link>
            <Link href="/about" className="hover:text-green-600 transition-colors">About Us</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden sm:flex items-center gap-4">
                <Link href="/my-orders" className="text-sm font-medium text-zinc-600 hover:text-green-600 transition-colors">
                  My Orders
                </Link>
                <Link href="/admin" className="text-sm font-medium text-zinc-600 hover:text-green-600 transition-colors">
                  Dashboard
                </Link>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:block text-sm font-medium text-zinc-600 hover:text-green-600 transition-colors">
                Sign In
              </Link>
            )}
            
            <div className="h-4 w-px bg-zinc-200 mx-2 hidden sm:block"></div>
            
            <CartDrawer />

            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
                <Menu className="h-6 w-6 text-zinc-600" />
                <span className="sr-only">Toggle mobile menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 pt-10">
                  <Link href="/" className="flex items-center gap-2 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
                      <Leaf className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-semibold tracking-tight text-zinc-900">AgriSeeds</span>
                  </Link>
                  <nav className="flex flex-col gap-4 text-base font-medium text-zinc-600">
                    <SheetClose render={<Link href="/" className="hover:text-green-600 transition-colors py-2" />}>Home</SheetClose>
                    <SheetClose render={<Link href="/catalog" className="hover:text-green-600 transition-colors py-2" />}>All Seeds</SheetClose>
                    <SheetClose render={<Link href="/categories" className="hover:text-green-600 transition-colors py-2" />}>Categories</SheetClose>
                    <SheetClose render={<Link href="/about" className="hover:text-green-600 transition-colors py-2" />}>About Us</SheetClose>
                    
                    <div className="h-px w-full bg-zinc-100 my-2"></div>
                    
                    {user ? (
                      <>
                        <SheetClose render={<Link href="/my-orders" className="hover:text-green-600 transition-colors py-2" />}>My Orders</SheetClose>
                        <SheetClose render={<Link href="/admin" className="hover:text-green-600 transition-colors py-2" />}>Admin Dashboard</SheetClose>
                      </>
                    ) : (
                      <SheetClose render={<Link href="/login" className="hover:text-green-600 transition-colors py-2" />}>Sign In</SheetClose>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-zinc-100 bg-zinc-50 pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
                  <Leaf className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-zinc-900">AgriSeeds</span>
              </Link>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Premium agricultural seeds delivered directly to farmers across India. High yield, disease-resistant, and climate-adapted.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 mb-4">Shop</h4>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li><Link href="#" className="hover:text-green-600">Vegetable Seeds</Link></li>
                <li><Link href="#" className="hover:text-green-600">Fruit Seeds</Link></li>
                <li><Link href="#" className="hover:text-green-600">Field Crops</Link></li>
                <li><Link href="#" className="hover:text-green-600">New Arrivals</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 mb-4">Support</h4>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li><Link href="#" className="hover:text-green-600">Track Order</Link></li>
                <li><Link href="#" className="hover:text-green-600">Shipping Policy</Link></li>
                <li><Link href="#" className="hover:text-green-600">Return Policy</Link></li>
                <li><Link href="#" className="hover:text-green-600">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li>+91 98765 43210</li>
                <li>support@agriseeds.com</li>
                <li>New Delhi, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <p>© {new Date().getFullYear()} AgriSeeds. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-green-600">Privacy Policy</Link>
              <Link href="#" className="hover:text-green-600">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
