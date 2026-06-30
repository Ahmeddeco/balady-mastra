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
    console.error("خطأ أثناء جلب بيانات السلالة :", error)
    throw error
  }
}


export const getAllBreedForSelect = async () => {
  try {
    return await prisma.breed.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })
  } catch (error) {
    console.error("خطأ أثناء جلب بيانات السلالة :", error)
    throw error
  }
}