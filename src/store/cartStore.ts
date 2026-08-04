import { Unit } from "@/generated/prisma/enums"
import { toast } from "sonner"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  id: string
  quantity: number
  stock: number
  titleAr: string
  titleEn: string
  price: number
  mainImage: string
  unit: Unit
}

export type CartItemInput = Omit<CartItem, "quantity"> & {
  quantity?: number
}

type CartState = {
  items: CartItem[]
  addToCart: (product: CartItemInput) => void
  removeFromCart: (id: string) => void
  updateQuantityByHalf: (type: "increment" | "decrement", id: string) => void
  updateQuantityByOnes: (type: "increment" | "decrement", id: string) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product: CartItemInput) => {
        const existingProduct = get().items.find((item) => item.id === product.id)
        const unit = product?.unit ?? Unit.piece
        const initialQuantity = unit === Unit.piece ? 1 : 0.5

        set({
          items: existingProduct
            ? get().items
            : [
              ...get().items,
              {
                id: product.id,
                quantity: product.quantity ?? initialQuantity,
                stock: product.stock,
                titleAr: product.titleAr,
                titleEn: product.titleEn,
                price: product.price,
                mainImage: product.mainImage,
                unit,
              } as CartItem,
            ],
        })
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
                    : Math.max(.5, item.quantity - .5), // preventing the quantity from going below .5 when decrementing.
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
    }), { name: 'balady-cart-storage' }
  )
)