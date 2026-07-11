import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  image_url: string
  quantity: number
  pack_size?: string
  stock: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id)
        if (existingItem) {
          return {
            items: state.items.map((i) => 
              i.id === item.id 
                ? { ...i, quantity: Math.min(item.stock, i.quantity + item.quantity) }
                : i
            )
          }
        }
        return { items: [...state.items, item] }
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id)
      })),
      
      updateQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) {
          return { items: state.items.filter((i) => i.id !== id) }
        }
        return {
          items: state.items.map((i) => 
            i.id === id ? { ...i, quantity: Math.min(i.stock, quantity) } : i
          )
        }
      }),
      
      clearCart: () => set({ items: [] }),
      
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      }
    }),
    {
      name: 'agriseeds-cart',
    }
  )
)
