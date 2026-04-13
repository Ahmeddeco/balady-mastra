import { Product } from "@/generated/prisma/client"
import { toast } from "sonner"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  id: string
  quantity: number
  title: string
  price: number
  image: string
  increaseByOne?: boolean
}

type CartState = {
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (id: string) => void
  updateQuantityByHalf: (type: 'increment' | 'decrement', id: string) => void
  updateQuantityByOnes: (type: 'increment' | 'decrement', id: string) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      /* -------------------------------- addToCart ------------------------------- */
      addToCart: (product) => {
        const existingProduct = get().items.find((item) => item.id === product!.id)
        set({
          items: existingProduct
            ? get().items
            : [
              ...get().items,
              {
                quantity: 1,
                id: product?.id,
                title: product?.title,
                price: product?.price,
                image: product?.mainImage,
                increaseByOne: product?.increaseByOne ?? false
              },
            ],
        })
        if (existingProduct) {
          toast.error("المنتج موجود سابقا في السلة")
        } else {
          toast.success('تم إضافة المنتج الى السلة بنجاح.')
        }
      },

      /* ----------------------------- removeFromCart ----------------------------- */
      removeFromCart: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        })
        toast.error('تم إزالة المنتج من السلة.')

      },

      /* -------------------------- updateQuantityByHalf -------------------------- */
      updateQuantityByHalf: (type, id) => {
        set({
          items: get().items.map((item) =>
            item.id === id
              ? {
                ...item,
                quantity:
                  type === "increment"
                    ? item.quantity + .5

                    : Math.max(1, item.quantity - .5), // preventing the quantity from going below .5 when decrementing.
              }
              : item
          ),
        })
      },

      /* -------------------------- updateQuantityByOnes -------------------------- */
      updateQuantityByOnes: (type, id) => {
        set({
          items: get().items.map((item) =>
            item.id === id
              ? {
                ...item,
                quantity:
                  type === "increment"
                    ? item.quantity + 1

                    : Math.max(1, item.quantity - 1), // preventing the quantity from going below 1 when decrementing.
              }
              : item
          ),
        })
      }
    }), { name: 'cart-storage' }
  )
)