import prisma from "@/lib/prisma"


/* --------------------- getAllCattleForServerCattlePage -------------------- */
export const getAllCattleForServerCattlePage = async (size: number, page: number,) => {
  try {
    const totalCattle = await prisma.cattle.count()
    const totalPages = Math.ceil(totalCattle / size)

    const data = await prisma.cattle.findMany({
      select: { id: true, createdAt: true, age: true, gender: true, image: true, liveWeight: true, farm: { select: { name: true, id: true } }, breed: { select: { name: true, id: true } } },
      orderBy: { createdAt: "asc" },
      take: size,
      skip: (page * size) - size
    })
    return { data, totalPages, totalCattle }
  } catch (error) {
    console.error(error)
  }
}

/* --------------------- getAllCattleForServerFarmsPage --------------------- */
export const getAllCattleForServerFarmsPage = async (size: number, page: number,) => {
  try {
    const totalCattle = await prisma.cattle.count()
    const totalPages = Math.ceil(totalCattle / size)

    const data = await prisma.cattle.findMany({
      orderBy: { createdAt: "asc" },
      take: size,
      skip: (page * size) - size
    })
    return { data, totalPages, totalCattle }
  } catch (error) {
    console.error(error)
  }
}

/* -------------------------- getOneBreedForEditPage ------------------------- */
export const getOneCattleForEditPage = async (id: string) => {
  try {
    return await prisma.cattle.findUniqueOrThrow({ where: { id } })
  } catch (error) {
    console.error("خطأ أثناء جلب بيانات الحيوان :", error)
    throw error
  }
}

/* -------------------------- getAllCattleForSelect ------------------------- */
export const getAllCattleForSelect = async () => {
  try {
    return await prisma.cattle.findMany({ select: { id: true, createdAt: true, breed: { select: { name: true } }, farm: { select: { name: true } } }, orderBy: { createdAt: "asc" } })
  } catch (error) {
    console.error("خطأ أثناء جلب بيانات الحيوان :", error)
    throw error
  }
}