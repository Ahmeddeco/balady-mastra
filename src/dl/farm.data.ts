import prisma from "@/lib/prisma"

export const getAllFarmsForServerFarmsPage = async (size: number, page: number,) => {
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
  try {
    return await prisma.farm.findUniqueOrThrow({ where: { id }, include: { manager: { select: { name: true, id: true } } } })
  } catch (error) {
    console.error("خطأ أثناء جلب بيانات المزرعة:", error)
    throw error
  }
}