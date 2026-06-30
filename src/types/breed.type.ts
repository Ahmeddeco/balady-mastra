import { getAllBreedForSelect, getAllBreedsForServerFarmsPage, getOneBreedForEditPage } from "@/dl/breed.data"

export type getOneBreedForEditPageType = Awaited<ReturnType<typeof getOneBreedForEditPage>>
export type getAllBreedsForServerFarmsPageType = Awaited<ReturnType<typeof getAllBreedsForServerFarmsPage>>
export type getAllBreedForSelectType = Awaited<ReturnType<typeof getAllBreedForSelect>>