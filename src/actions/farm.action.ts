'use server'

import { parseWithZod } from "@conform-to/zod"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import FarmSchema from "@/schemas/Farm.Schema"

/* ------------------------------ addFarmAction ----------------------------- */
export const addFarmAction = async (prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: FarmSchema,
  })
  if (submission.status !== 'success') {
    return submission.reply()
  }

  try {
    await prisma.farm.upsert({
      where: { name: submission.value.name },
      create: {
        name: submission.value.name,
        userId: submission.value.userId,
        country: submission.value.country,
        state: submission.value.state,
        city: submission.value.city,
        lat: submission.value.lat,
        lng: submission.value.lng,
        detailedAddress: submission.value.detailedAddress
      },
      update: {
        name: submission.value.name,
        userId: submission.value.userId,
        country: submission.value.country,
        state: submission.value.state,
        city: submission.value.city,
        lat: submission.value.lat,
        lng: submission.value.lng,
        detailedAddress: submission.value.detailedAddress
      }
    })
  } catch (error) {
    console.error("Failed to create product: ", error)
    return submission.reply({
      formErrors: ["حدث خطأ أثناء حفظ المزرعة في قاعدة البيانات."],
    })
  }
  redirect("/server/farms")
}

/* ----------------------------- editUserAction ----------------------------- */
export const editFarmAction = async (prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: FarmSchema,
  })
  if (submission.status !== 'success') {
    return submission.reply()
  }

  try {
    await prisma.farm.update({
      where: { id: submission.value.id! },
      data: {
        name: submission.value.name,
        userId: submission.value.userId,
        country: submission.value.country,
        state: submission.value.state,
        city: submission.value.city,
        lat: submission.value.lat,
        lng: submission.value.lng,
        detailedAddress: submission.value.detailedAddress
      }
    })
  } catch (error) {
    console.error("Failed to create product: ", error)
    return submission.reply({
      formErrors: ["حدث خطأ أثناء تعديل بيانات المزرعة في قاعدة البيانات."],
    })
  }

  redirect("/server/farms")
}

/* ---------------------------- deleteFarmAction ---------------------------- */
export const deleteFarmAction = async (formData: FormData) => {
  try {
    const id = formData.get("id")
    await prisma.farm.delete({
      where: { id: id as string },
    })
  } catch (error) {
    console.error(error)
  }
  redirect("/server/farms")
}