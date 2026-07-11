'use client'

import { useState } from "react"
import { useCart } from "@/store/useCart"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import { toast } from "sonner"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    image_url: string
    pack_size?: string
    stock: number
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const cart = useCart()

  const handleAddToCart = () => {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity,
      pack_size: product.pack_size,
      stock: product.stock,
    })
    
    toast.success(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart`, {
      description: `${product.name} has been added to your shopping cart.`,
      duration: 3000,
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      <div className="flex items-center justify-between border border-zinc-200 rounded-full h-14 px-4 w-full sm:w-32 bg-white">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="text-zinc-500 hover:text-zinc-900"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="font-semibold text-lg">{quantity}</span>
        <button 
          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
          className="text-zinc-500 hover:text-zinc-900"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <Button 
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className="flex-1 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white text-lg font-semibold shadow-lg shadow-green-600/20"
      >
        <ShoppingBag className="mr-2 h-5 w-5" />
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    </div>
  )
}
