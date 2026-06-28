import { getAllProductsForProductsServerPage, getOneProductById } from "@/dl/products.data"
import { Category, Unit } from "@/generated/prisma/enums"

export type getOneProductByIdType = Awaited<ReturnType<typeof getOneProductById>>
export type getAllProductsForProductsServerPageType = Awaited<ReturnType<typeof getAllProductsForProductsServerPage>>
