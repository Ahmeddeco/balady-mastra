'use server'

import { parseWithZod } from "@conform-to/zod"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import BreedSchema from "@/schemas/Breed.Schema"
import { splittedImages } from "@/logic/splittedImages"

/* ----------------------------- addBreedAction ----------------------------- */
export const addBreedAction = async (prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: BreedSchema,
  })
  if (submission.status !== 'success') {
    return submission.reply()
  }

  const separatedImages = splittedImages(submission.value.images[0])

  try {
    await prisma.breed.upsert({
      where: { name: submission.value.name },
      create: {
        name: submission.value.name,
        description: submission.value.description,
        conversionRate: submission.value.conversionRate,
        image: submission.value.image,
        images: separatedImages ?? "",
      },
      update: {
        description: submission.value.description,
        conversionRate: submission.value.conversionRate,
        image: submission.value.image,
        images: separatedImages ?? "",
      }
    })
  } catch (error) {
    console.error("Failed to create product: ", error)
    return submission.reply({
      formErrors: ["حدث خطأ أثناء حفظ السلالة في قاعدة البيانات."],
    })
  }
  redirect("/server/breeds")
}

/* ----------------------------- editBreedAction ----------------------------- */
export const editBreedAction = async (prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: BreedSchema,
  })
  if (submission.status !== 'success') {
    return submission.reply()
  }
  const separatedImages = splittedImages(submission.value.images[0])

  try {
    await prisma.breed.update({
      where: { id: submission.value.id! },
      data: {
        name: submission.value.name,
        description: submission.value.description,
        conversionRate: submission.value.conversionRate,
        image: submission.value.image,
        images: separatedImages,
      }
    })
  } catch (error) {
    console.error("Failed to create product: ", error)
    return submission.reply({
      formErrors: ["حدث خطأ أثناء تعديل بيانات السلالة في قاعدة البيانات."],
    })
  }

  redirect("/server/breeds")
}

/* ---------------------------- deleteBreedAction ---------------------------- */
export const deleteBreedAction = async (formData: FormData) => {
  try {
    const id = formData.get("id")
    await prisma.breed.delete({
      where: { id: id as string },
    })
  } catch (error) {
    console.error(error)
  }
  redirect("/server/breeds")
}