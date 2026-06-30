import prisma from "@/lib/prisma"

export const getAllBreedsForServerFarmsPage = async (size: number, page: number,) => {
  try {
    const totalBreeds = await prisma.breed.count()
    const totalPages = Math.ceil(totalBreeds / size)

    const data = await prisma.breed.findMany({
      orderBy: { name: "asc" },
      take: size,
      skip: (page * size) - size
    })
    return { data, totalPages, totalBreeds }
  } catch (error) {
    console.error(error)
  }
}

/* -------------------------- getOneBreedForEditPage ------------------------- */
export const getOneBreedForEditPage = async (id: string) => {
  try {
    return await prisma.breed.findUniqueOrThrow({ where: { id } })
  } catch (error) {
    console.error("خطأ أثناء جلب بيانات المزرعة:", error)
    throw error
  }
}