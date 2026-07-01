import prisma from "@/lib/prisma"

/* --------------------- getAllYieldsForServerFarmsPage --------------------- */
export const getAllYieldsForServerFarmsPage = async (size: number, page: number,) => {
  try {
    const totalYields = await prisma.yield.count()
    const totalPages = Math.ceil(totalYields / size)

    const data = await prisma.yield.findMany({
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
  try {
    return await prisma.yield.findUniqueOrThrow({ where: { id } })
  } catch (error) {
    console.error("خطأ أثناء جلب بيانات التصافي :", error)
    throw error
  }
}

/* -------------------------- getAllYieldsForSelect ------------------------- */
export const getAllYieldsForSelect = async () => {
  try {
    return await prisma.yield.findMany({ select: { id: true, createdAt: true }, orderBy: { createdAt: "asc" } })
  } catch (error) {
    console.error("خطأ أثناء جلب بيانات التصافي :", error)
    throw error
  }
}