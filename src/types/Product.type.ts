import { getAllProductsForProductsPage, getAllProductsForProductsServerPage, getOneProductById, getOneProductBySlug } from "@/dl/products.data"

export type getOneProductByIdType = Awaited<ReturnType<typeof getOneProductById>>
export type getAllProductsForProductsServerPageType = Awaited<ReturnType<typeof getAllProductsForProductsServerPage>>
export type getAllProductsForProductsPageType = Awaited<ReturnType<typeof getAllProductsForProductsPage>>
// get one product from type of products array
export type SingleProductPageType = NonNullable<getAllProductsForProductsPageType>["data"][number]
export type getOneProductBySlugType = Awaited<ReturnType<typeof getOneProductBySlug>>