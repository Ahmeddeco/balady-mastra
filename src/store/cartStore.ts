import { Preparation } from "@/generated/prisma/enums"
import { toast } from "sonner"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  id: string
  requestedQuantity: number
  quantity: number
  titleAr: string
  titleEn: string
  price: number
  mainImage: string
  preparation: Preparation
}

type CartState = {
  items: CartItem[]
  addToCart: (product: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (type: 'increment' | 'decrement', id: string) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product: CartItem) => {
        const existingProduct = get().items.find((item) => item.id === product!.id)
        set({
          items: existingProduct
            ? get().items
            : [
              ...get().items,
              {
                requestedQuantity: 1,
                quantity: 1,
                id: product!.id,
                titleEn: product!.titleEn,
                titleAr: product!.titleAr,
                price: product!.price,
                mainImage: product!.mainImage,
                preparation: product!.preparation,

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

      /* ----------------------------- updateQuantity ----------------------------- */
      updateQuantity: (type, id) => {
        set({
          items: get().items.map((item) =>
            item.id === id
              ? {
                ...item,
                requestedQuantity:
                  type === "increment"
                    ? item.requestedQuantity + 1
                    : Math.max(1, item.requestedQuantity - 1), // preventing the quantity from going below 1 when decrementing.
              }
              : item
          ),
        })
      }
    }), { name: 'balady-cart-storage' }
  )
)