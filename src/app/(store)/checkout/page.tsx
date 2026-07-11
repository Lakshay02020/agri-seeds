'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/useCart'
import { createRazorpayOrder, verifyPaymentAndCreateOrder } from '@/actions/checkout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ShoppingBag, Loader2, ShieldCheck, CreditCard, Leaf } from 'lucide-react'
import Image from 'next/image'

export default function CheckoutPage() {
  const cart = useCart()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false)

  const [shipping, setShipping] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  // Prevent hydration errors & redirect if cart is empty
  useEffect(() => {
    setMounted(true)
    if (cart.items.length === 0) {
      router.push('/catalog')
    }
  }, [cart.items.length, router])

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => setIsRazorpayLoaded(true)
    script.onerror = () => setError('Failed to load Razorpay SDK. Please check your connection.')
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  if (!mounted) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value })
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isRazorpayLoaded) {
      setError("Payment system is still loading. Please wait a moment.")
      return
    }

    setLoading(true)
    setError('')

    try {
      const totalAmount = cart.getCartTotal()
      
      // 1. Create order on server
      const order = await createRazorpayOrder(totalAmount)

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "AgriSeeds",
        description: "Premium Agricultural Seeds",
        image: "https://res.cloudinary.com/dmhqtmk5s/image/upload/v1/agriseeds_logo", // Placeholder logo
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment and Create DB Records
            await verifyPaymentAndCreateOrder(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature,
              cart.items,
              shipping
            )

            // 4. Clear cart and redirect
            cart.clearCart()
            router.push('/checkout/success')
            
          } catch (err: any) {
            setError(err.message || 'Payment verification failed')
            setLoading(false)
          }
        },
        prefill: {
          name: shipping.fullName,
          email: shipping.email,
          contact: shipping.phone,
        },
        theme: {
          color: "#16a34a", // Green-600
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
          }
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        setError(`Payment Failed: ${response.error.description}`)
        setLoading(false)
      })
      
      rzp.open()
      
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment')
      setLoading(false)
    }
  }

  const total = cart.getCartTotal()

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Secure Checkout</h1>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-red-600 shrink-0"></div>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-6">
            <form id="checkout-form" onSubmit={handlePayment}>
              <Card className="border-zinc-200 shadow-sm overflow-hidden">
                <div className="bg-zinc-100/50 px-6 py-4 border-b border-zinc-100">
                  <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs">1</div>
                    Shipping Details
                  </h2>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" name="fullName" required value={shipping.fullName} onChange={handleInputChange} className="focus-visible:ring-green-600" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" required value={shipping.email} onChange={handleInputChange} className="focus-visible:ring-green-600" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" required value={shipping.phone} onChange={handleInputChange} className="focus-visible:ring-green-600" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Full Address</Label>
                      <Input id="address" name="address" required value={shipping.address} onChange={handleInputChange} className="focus-visible:ring-green-600" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City / District</Label>
                      <Input id="city" name="city" required value={shipping.city} onChange={handleInputChange} className="focus-visible:ring-green-600" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" name="state" required value={shipping.state} onChange={handleInputChange} className="focus-visible:ring-green-600" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input id="pincode" name="pincode" required value={shipping.pincode} onChange={handleInputChange} className="focus-visible:ring-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <Card className="border-zinc-200 shadow-sm overflow-hidden">
                <div className="bg-zinc-100/50 px-6 py-4 border-b border-zinc-100">
                  <h2 className="text-lg font-semibold text-zinc-900">Order Summary</h2>
                </div>
                <CardContent className="p-0">
                  <div className="max-h-[300px] overflow-y-auto p-6 space-y-4">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="h-16 w-16 relative rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                          {item.image_url ? (
                            <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                          ) : (
                            <Leaf className="absolute inset-0 m-auto h-6 w-6 text-zinc-300" />
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="text-sm font-medium text-zinc-900 line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-zinc-500 mt-0.5">Qty: {item.quantity} {item.pack_size ? `| ${item.pack_size}` : ''}</p>
                        </div>
                        <div className="font-semibold text-zinc-900 flex items-center">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-zinc-100 bg-zinc-50 p-6 space-y-3">
                    <div className="flex justify-between text-sm text-zinc-600">
                      <span>Subtotal</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-zinc-600">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-zinc-900 pt-3 border-t border-zinc-200">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                form="checkout-form"
                disabled={loading || !isRazorpayLoaded}
                className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-xl shadow-green-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Pay ₹{total.toFixed(2)} Securely
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 mt-4">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                Payments are 100% secure and encrypted via Razorpay
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
