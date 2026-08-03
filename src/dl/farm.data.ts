"use cache"

import prisma from "@/lib/prisma"
import { cacheLife, cacheTag } from "next/cache"

export const getAllFarmsForServerFarmsPage = async (size: number, page: number,) => {
  cacheLife("weeks")
  cacheTag('farms')
  try {
    const totalFarms = await prisma.farm.count()
    const totalPages = Math.ceil(totalFarms / size)

    const data = await prisma.farm.findMany({
      select: {
        id: true,
        name: true,
        country: true,
        state: true,
        city: true,
        lat: true,
        lng: true,
        manager: { select: { name: true, id: true, image: true } }
      },
      orderBy: { name: "asc" },
      take: size,
      skip: (page * size) - size
    })
    return { data, totalPages, totalFarms }
  } catch (error) {
    console.error(error)
  }
}

/* -------------------------- getOneFarmForEditPage ------------------------- */
export const getOneFarmForEditPage = async (id: string) => {
  cacheLife("weeks")
  cacheTag('farms')
  try {
    return await prisma.farm.findUniqueOrThrow({ where: { id }, include: { manager: { select: { name: true, id: true } } } })
  } catch (error) {
    console.error("خطأ أثناء جلب بيانات المزرعة:", error)
    throw error
  }
}

/* -------------------------- getAllFarmsForSelect ------------------------- */
export const getAllFarmsForSelect = async () => {
  cacheLife("weeks")
  cacheTag('farms')
  try {
    return await prisma.farm.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })
  } catch (error) {
    console.error("خطأ أثناء جلب بيانات المزرعة:", error)
    throw error
  }
}