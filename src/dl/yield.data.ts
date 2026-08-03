"use cache"

import prisma from "@/lib/prisma"
import { cacheLife, cacheTag } from "next/cache"

/* --------------------- getAllYieldsForServerFarmsPage --------------------- */
export const getAllYieldsForServerFarmsPage = async (size: number, page: number,) => {
  cacheLife("days")
  cacheTag('yields')
  try {
    const totalYields = await prisma.yield.count()
    const totalPages = Math.ceil(totalYields / size)

    const data = await prisma.yield.findMany({
      include: { cattle: { select: { createdAt: true, image: true, breed: { select: { name: true } } } } },
      orderBy: { createdAt: "asc" },
      take: size,
      skip: (page * size) - size
    })
    return { data, totalPages, totalYields }
  } catch (error) {
    console.error(error)
    throw error
  }
}

/* -------------------------- getOneYieldForEditPage ------------------------- */
export const getOneYieldForEditPage = async (id: string) => {
  cacheLife("days")
  cacheTag('yields')
  try {
    return await prisma.yield.findUniqueOrThrow({ where: { id } })
  } catch (error) {
    console.error("خطأ أثناء جلب بيانات التصافي :", error)
    throw error
  }
}

/* -------------------------- getAllYieldsForSelect ------------------------- */
export const getAllYieldsForSelect = async () => {
  cacheLife("days")
  cacheTag('yields')
  try {
    return await prisma.yield.findMany({ select: { id: true, createdAt: true }, orderBy: { createdAt: "asc" } })
  } catch (error) {
    console.error("خطأ أثناء جلب بيانات التصافي :", error)
    throw error
  }
}