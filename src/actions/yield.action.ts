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

  try {
    // التحقق مما إذا كان العجل المختار مرتبطاً بالفعل بتقرير تصافي آخر
    const existingYield = await prisma.yield.findUnique({
      where: { cattleId: submission.value.cattleId },
    })

    if (existingYield) {
      return submission.reply({
        formErrors: ["هذا الحيوان مرتبط بالفعل بتقرير تشفية آخر. يرجى اختيار حيوان آخر."],
      })
    }

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
    console.error("DATABASE ERROR: Failed to create yield record ->", error)
    return submission.reply({
      formErrors: ["حدث خطأ غير متوقع في قاعدة البيانات أثناء حفظ تقرير التصافي."],
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
    // 1. البحث عما إذا كان العجل المختار مرتبكاً بتقرير تصافي مسبقاً
    const existingYieldForCattle = await prisma.yield.findUnique({
      where: { cattleId: submission.value.cattleId },
    })

    // 2. إذا كان العجل مرتبطاً بتقرير تصافي آخر (وليس التقرير الحالي الذي نقوم بتعديله) يتم رفض العملية
    if (existingYieldForCattle && existingYieldForCattle.id !== submission.value.id) {
      return submission.reply({
        formErrors: ["هذا الحيوان مرتبط بالفعل بتقرير تشفية آخر. يرجى اختيار حيوان آخر."],
      })
    }

    // 3. تحديث البيانات بأمان في حال اجتياز التحقق
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
    console.error("DATABASE ERROR: Failed to update yield record ->", error)
    return submission.reply({
      formErrors: ["حدث خطأ غير متوقع في قاعدة البيانات أثناء تعديل تقرير التصافي."],
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
    console.error("DATABASE ERROR: Failed to delete yield record ->", error)
  }
  redirect("/server/yields")
}