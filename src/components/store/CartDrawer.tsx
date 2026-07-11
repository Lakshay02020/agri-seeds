'use client'

import { ShoppingBag, Minus, Plus, Trash2, X } from "lucide-react"
import { useCart } from "@/store/useCart"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

export function CartDrawer() {
  const cart = useCart()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Prevent hydration mismatch for Zustand persisted state
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingBag className="h-5 w-5" />
      </Button>
    )
  }

  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-100 hover:text-zinc-900 h-10 w-10 relative text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
        <ShoppingBag className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white">
            {itemCount}
          </span>
        )}
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-white">
        <SheetHeader className="px-6 py-4 border-b border-zinc-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-green-600" />
              Your Cart
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {cart.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center mb-6">
                <ShoppingBag className="h-10 w-10 text-green-600/50" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">Your cart is empty</h3>
              <p className="text-zinc-500 max-w-[250px] mb-8">
                Looks like you haven't added any premium seeds to your cart yet.
              </p>
              <Button onClick={() => setIsOpen(false)} className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8">
                Start Shopping
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 px-6 py-4">
                <div className="space-y-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 flex-shrink-0">
                        {item.image_url ? (
                          <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-400">No Image</div>
                        )}
                      </div>
                      
                      <div className="flex flex-1 flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-zinc-900 line-clamp-1 pr-4">{item.name}</h4>
                            <button 
                              onClick={() => cart.removeItem(item.id)}
                              className="text-zinc-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          {item.pack_size && (
                            <p className="text-sm text-zinc-500 mt-1">{item.pack_size}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3 bg-zinc-100 rounded-full px-2 py-1">
                            <button 
                              onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                              className="h-6 w-6 flex items-center justify-center rounded-full bg-white text-zinc-600 shadow-sm hover:text-zinc-900 disabled:opacity-50"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                              className="h-6 w-6 flex items-center justify-center rounded-full bg-white text-zinc-600 shadow-sm hover:text-zinc-900 disabled:opacity-50"
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="font-bold text-zinc-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="border-t border-zinc-100 p-6 bg-zinc-50/80 backdrop-blur-sm flex-shrink-0">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-zinc-500 text-sm">
                    <span>Subtotal</span>
                    <span>₹{cart.getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 text-sm">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-zinc-900 pt-3 border-t border-zinc-200">
                    <span>Total</span>
                    <span>₹{cart.getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-14 rounded-full bg-green-600 hover:bg-green-700 text-white text-lg font-semibold shadow-lg shadow-green-600/20">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
