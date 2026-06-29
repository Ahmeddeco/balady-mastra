'use server'

import { parseWithZod } from "@conform-to/zod"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { slugifyTitle } from "@/logic/slugifyTitle"
import ProductSchema from "@/schemas/Product.Schema"

/* ------------------------------ addUserAction ----------------------------- */
export const addProductAction = async (prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: ProductSchema,
  })
  if (submission.status !== 'success') {
    return submission.reply()
  }
  const slug = slugifyTitle(submission.value.title)

  try {
    await prisma.product.upsert({
      where: { title: submission.value.title },
      create: {
        title: submission.value.title,
        slug: slug,
        description: submission.value.description,
        isActive: submission.value.isActive,
        cut: submission.value.cut,
        category: submission.value.category,
        unit: submission.value.unit,
        price: Number(submission.value.price),
        discount: Number(submission.value.discount),
        stock: Number(submission.value.stock),
        lowQuantity: Number(submission.value.lowQuantity),
        mainImage: submission.value.mainImage,
        images: submission.value.images,
      },
      update: {
        title: submission.value.title,
        slug: slug,
        description: submission.value.description,
        cut: submission.value.cut,
        isActive: submission.value.isActive,
        category: submission.value.category,
        unit: submission.value.unit,
        price: Number(submission.value.price),
        discount: Number(submission.value.discount),
        stock: Number(submission.value.stock),
        lowQuantity: Number(submission.value.lowQuantity),
        mainImage: submission.value.mainImage,
        images: submission.value.images,
      }
    })
  } catch (error) {
    console.error("Failed to create product: ", error)
    return submission.reply({
      formErrors: ["حدث خطأ أثناء حفظ المنتج ومكوناته الفعالة في قاعدة البيانات."],
    })
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

  const slug = slugifyTitle(submission.value.title)

  try {
    await prisma.product.update({
      where: { id: submission.value.id! },
      data: {
        title: submission.value.title,
        slug: slug,
        description: submission.value.description,
        cut: submission.value.cut,
        isActive: submission.value.isActive,
        category: submission.value.category,
        unit: submission.value.unit,
        price: Number(submission.value.price),
        discount: Number(submission.value.discount),
        stock: Number(submission.value.stock),
        lowQuantity: Number(submission.value.lowQuantity),
        mainImage: submission.value.mainImage,
        images: submission.value.images,
      }
    })
  } catch (error) {
    console.error("Failed to update product: ", error)
    return submission.reply({
      formErrors: ["حدث خطأ أثناء حفظ المنتج ومكوناته الفعالة في قاعدة البيانات."],
    })
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