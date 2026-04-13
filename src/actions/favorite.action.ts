"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleFavoriteAction(formData: FormData) {
  const productId = formData.get("productId") as string
  const userId = formData.get("userId") as string
  const isFavorite = formData.get("isFavorite") as string

  if (isFavorite === "true") {
    await prisma.favorite.delete({
      where: { userId_productId: { userId, productId } },
    })
  } else {
    await prisma.favorite.create({
      data: { userId, productId },
    })
  }

  // Clear cache for the current page to show updated heart state
  revalidatePath("/products", "layout")
}