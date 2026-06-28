import { Category } from "@/generated/prisma/enums"
import prisma from "@/lib/prisma"

export const getAllProductsForProductsPage = async (size: number, page: number, activeCategory?: Category) => {
  try {
    const totalProducts = await prisma.product.count()
    const totalPages = Math.ceil(totalProducts / size)

    const data = await prisma.product.findMany({
      where: { category: activeCategory, },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        category: true,
        mainImage: true,
        stock: true,
        images: true,
        discount: true,
        unit: true,
        slug: true,
        favorites: { select: { userId: true, productId: true } }
      },
      orderBy: { createdAt: "desc" },
      take: size,
      skip: (page * size) - size
    })
    return { data, totalPages, totalProducts }
  } catch (error) {
    console.error(error)
  }
}

/* ----------------------------- findOneProduct ----------------------------- */
export const getOneProductBySlug = async (slug: string) => {
  try {
    const data = await prisma.product.findUnique({ where: { slug } })
    return data
  } catch (error) {
    console.error(error)
  }
}


/* ---------------------------- getOneProductById --------------------------- */
export const getOneProductById = async (id: string) => {
  try {
    const data = await prisma.product.findUnique({ where: { id } })
    return data
  } catch (error) {
    console.error(error)
  }
}

/* ------------------- getAllProductsForProductsServerPage ------------------ */
export const getAllProductsForProductsServerPage = async (size: number, page: number, activeCategory?: Category) => {
  try {
    const totalProducts = await prisma.product.count()
    const totalPages = Math.ceil(totalProducts / size)

    const data = await prisma.product.findMany({
      where: { category: activeCategory },
      select: { id: true, category: true, cut: true, discount: true, mainImage: true, price: true, slug: true, title: true, unit: true, stock: true, },
      orderBy: { createdAt: "desc" },
      take: size,
      skip: (page * size) - size
    })
    return { data, totalPages, totalProducts }
  } catch (error) {
    console.error(error)
  }
}

/* ------------------------- getNonTrendingProducts ------------------------- */
export const getNonTrendingProducts = async (limit: number = 3) => {
  try {
    const data = await prisma.product.findMany({
      where: { stock: { gt: 0 } },
      orderBy: { stock: "desc" },
      select: { id: true, title: true, price: true, unit: true, slug: true, quantity: true, description: true },
      take: limit
    })
    return data
  } catch (error) {
    console.error("Error fetching getNonTrendingProducts: ", error)
    return []
  }
}