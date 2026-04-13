import { Category, Unit } from "@/generated/prisma/enums"

/* ---------------------------- ProductCardProps ---------------------------- */
export type ProductCardProps = {
  id: string
  title: string
  increaseByOne: boolean
  slug: string
  description: string
  specialCut: boolean | null
  category: "MEAT" | "PROCESSED" | "CHICKEN"
  mainImage: string
  images: string[]
  price: number
  discount: number | null
  unit: ("KG" | "PIECE") | null
  favorites: {
    productId: string
    userId: string
  }[]
} | undefined
