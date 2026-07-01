import { getAllYieldsForSelect, getAllYieldsForServerFarmsPage, getOneYieldForEditPage } from "@/dl/yield.data"

export type getAllYieldsForSelectType = Awaited<ReturnType<typeof getAllYieldsForSelect>>
export type getAllYieldsForServerFarmsPageType = Awaited<ReturnType<typeof getAllYieldsForServerFarmsPage>>
export type getOneYieldForEditPageType = Awaited<ReturnType<typeof getOneYieldForEditPage>>
