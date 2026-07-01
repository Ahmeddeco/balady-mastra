'use server'

import { parseWithZod } from "@conform-to/zod"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import YieldSchema from "@/schemas/Yield.schema"

/* ------------------------------ addYieldAction ----------------------------- */
export const addYieldAction = async (prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: YieldSchema,
  })
  if (submission.status !== 'success') {
    return submission.reply()
  }
  console.log('formData from addYieldAction', formData)
  try {
    await prisma.yield.create({
      data: {
        cattle: { connect: { id: submission.value.cattleId } },
        hotCarcassWeight: submission.value.hotCarcassWeight,
        boneWeight: submission.value.boneWeight,
        fatWeight: submission.value.fatWeight,
        wasteWeight: submission.value.wasteWeight,
        netYieldWeight: submission.value.netYieldWeight,
        report: submission.value.report,
      }
    })
  } catch (error) {
    console.error("Failed to create yield: ", error)
    return submission.reply({
      formErrors: ["حدث خطأ أثناء حفظ التصافي في قاعدة البيانات."],
    })
  }
  redirect("/server/yields")
}

/* ----------------------------- editYieldAction ----------------------------- */
export const editYieldAction = async (prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, {
    schema: YieldSchema,
  })
  if (submission.status !== 'success') {
    return submission.reply()
  }
  try {
    await prisma.yield.update({
      where: { id: submission.value.id! },
      data: {
        cattle: { connect: { id: submission.value.cattleId } },
        hotCarcassWeight: submission.value.hotCarcassWeight,
        boneWeight: submission.value.boneWeight,
        fatWeight: submission.value.fatWeight,
        wasteWeight: submission.value.wasteWeight,
        netYieldWeight: submission.value.netYieldWeight,
        report: submission.value.report,
      }
    })
  } catch (error) {
    console.error("Failed to create yield: ", error)
    return submission.reply({
      formErrors: ["حدث خطأ أثناء تعديل التصافي  في قاعدة البيانات."],
    })
  }
  redirect("/server/yields")
}

/* ---------------------------- deleteYieldAction ---------------------------- */
export const deleteYieldAction = async (formData: FormData) => {
  try {
    const id = formData.get("id")
    await prisma.yield.delete({
      where: { id: id as string },
    })
  } catch (error) {
    console.error(error)
  }
  redirect("/server/yields")
}