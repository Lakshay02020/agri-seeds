import { CheckCircle2, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-zinc-100 text-center relative overflow-hidden">
        
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>

        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <div>
          <h2 className="mt-2 text-3xl font-extrabold text-zinc-900 tracking-tight">
            Order Confirmed!
          </h2>
          <p className="mt-4 text-sm text-zinc-500 leading-relaxed">
            Thank you for your purchase. Your payment was successful and your premium seeds are being prepared for dispatch.
          </p>
        </div>

        <div className="bg-zinc-50 rounded-xl p-6 border border-zinc-100 mt-8 text-left space-y-4">
          <h3 className="font-semibold text-zinc-900 flex items-center gap-2">
            <Package className="h-5 w-5 text-green-600" />
            What happens next?
          </h3>
          <ul className="text-sm text-zinc-600 space-y-3">
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">•</span>
              You will receive an order confirmation email shortly.
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">•</span>
              We will notify you via SMS when your package is shipped.
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">•</span>
              Standard delivery takes 3-5 business days.
            </li>
          </ul>
        </div>
        
        <div className="pt-6">
          <Link 
            href="/catalog" 
            className="inline-flex items-center justify-center w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-600/20 text-base font-semibold group"
          >
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
