import { Category, Unit } from "@/generated/prisma/enums"

/* ---------------------------- ProductCardType ---------------------------- */
export type ProductCardType = {
  id: string
  title: string
  slug: string
  description: string
  specialCut: boolean | null
  category: Category
  mainImage: string
  images: string[]
  price: number
  increaseByOne?: boolean
  discount: number | null
  unit: Unit | null
  favorites: {
    productId: string
    userId: string
  }[]
} | undefined