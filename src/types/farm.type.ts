import { getAllFarmsForSelect, getAllFarmsForServerFarmsPage, getOneFarmForEditPage } from "@/dl/farm.data"

export type getAllFarmsForServerFarmsPageType = Awaited<ReturnType<typeof getAllFarmsForServerFarmsPage>>
export type getOneFarmForEditPageType = Awaited<ReturnType<typeof getOneFarmForEditPage>>
export type getAllFarmsForSelectType = Awaited<ReturnType<typeof getAllFarmsForSelect>>