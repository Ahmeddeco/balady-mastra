'use server'

import { parseWithZod } from "@conform-to/zod"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import UserSchema from "@/schemas/UserSchema"
import ProductSchema from "@/schemas/ProductSchema"

/* ------------------------------ addUserAction ----------------------------- */
export const addProductAction = async (prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: ProductSchema,
  })
  if (submission.status !== 'success') {
    return submission.reply()
  }

  try {
    await prisma.product.upsert({
      where: { title: submission.value.title },
      create: {
        title: submission.value.title,
        slug: submission.value.slug,
        description: submission.value.description,
        specialCut: submission.value.specialCut,
        isActive: submission.value.isActive,
        category: submission.value.category,
        unit: submission.value.unit,
        price: submission.value.price,
        discount: submission.value.discount,
        quantity: submission.value.quantity,
        lowQuantity: submission.value.lowQuantity,
        mainImage: submission.value.mainImage,
        images: submission.value.images,
      },
      update: {
        title: submission.value.title,
        slug: submission.value.slug,
        description: submission.value.description,
        specialCut: submission.value.specialCut,
        isActive: submission.value.isActive,
        category: submission.value.category,
        unit: submission.value.unit,
        price: submission.value.price,
        discount: submission.value.discount,
        quantity: submission.value.quantity,
        lowQuantity: submission.value.lowQuantity,
        mainImage: submission.value.mainImage,
        images: submission.value.images,
      }
    })
  } catch (error) {
    console.error(error)
  }
  redirect("/server/products")
}

/* ---------------------------- editProductAction --------------------------- */
export const editProductAction = async (prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: ProductSchema,
  })
  if (submission.status !== 'success') {
    return submission.reply()
  }

  try {
    await prisma.product.update({
      where: { id: submission.value.id! },
      data: {
        title: submission.value.title,
        slug: submission.value.slug,
        description: submission.value.description,
        specialCut: submission.value.specialCut ?? false,
        isActive: submission.value.isActive ?? false,
        category: submission.value.category,
        unit: submission.value.unit,
        price: submission.value.price,
        discount: submission.value.discount,
        quantity: submission.value.quantity,
        lowQuantity: submission.value.lowQuantity,
        mainImage: submission.value.mainImage,
        images: submission.value.images,
      }
    })
  } catch (error) {
    console.error(error)
  }
  redirect("/server/products")
}

/* ---------------------------- deleteUserAction ---------------------------- */
export const deleteUserAction = async (formData: FormData) => {
  try {
    const id = formData.get("id")
    await prisma.user.delete({
      where: { id: id as string },
    })
  } catch (error) {
    console.error(error)
  }
  redirect("/server/users")
}