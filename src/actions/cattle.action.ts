'use server'

import { parseWithZod } from "@conform-to/zod"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { slugifyTitle } from "@/logic/slugifyTitle"
import ProductSchema from "@/schemas/Product.Schema"
import CattleSchema from "@/schemas/Cattle.Schema"
import { splittedImages } from "@/logic/splittedImages"

/* ------------------------------ addUserAction ----------------------------- */
export const AddCattleAction = async (prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: CattleSchema,
  })
  if (submission.status !== 'success') {
    return submission.reply()
  }

  const separatedImages = splittedImages(submission.value.images[0] ?? [])

  try {
    await prisma.cattle.create({
      data: {
        farm: { connect: { id: submission.value.farmId } },
        breed: { connect: { id: submission.value.breedId } },
        description: submission.value.description,
        images: separatedImages,
        image: submission.value.image,
        age: submission.value.age,
        gender: submission.value.gender,
        liveWeight: submission.value.liveWeight,
        costPrice: submission.value.costPrice,
      },
    })
  } catch (error) {
    console.error("Failed to create product: ", error)
    return submission.reply({
      formErrors: ["حدث خطأ أثناء حفظ المنتج ومكوناته الفعالة في قاعدة البيانات."],
    })
  }
  redirect("/server/cattle")
}

/* ---------------------------- editProductAction --------------------------- */
export const EditCattleAction = async (prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: CattleSchema,
  })
  if (submission.status !== 'success') {
    return submission.reply()
  }


  const separatedImages = splittedImages(submission.value.images[0] ?? [])

  try {
    await prisma.cattle.update({
      where: { id: submission.value.id! },
      data: {
        farm: { connect: { id: submission.value.farmId } },
        breed: { connect: { id: submission.value.breedId } },
        description: submission.value.description,
        images: separatedImages,
        image: submission.value.image,
        age: submission.value.age,
        gender: submission.value.gender,
        liveWeight: submission.value.liveWeight,
        costPrice: submission.value.costPrice,
      },
    })
  } catch (error) {
    console.error("Failed to create product: ", error)
    return submission.reply({
      formErrors: ["حدث خطأ أثناء حفظ المنتج ومكوناته الفعالة في قاعدة البيانات."],
    })
  }
  redirect("/server/cattle")
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