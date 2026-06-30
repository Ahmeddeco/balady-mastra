import { getAllCattleForServerCattlePage, getAllCattleForServerFarmsPage, getOneCattleForEditPage } from "@/dl/cattle.data"

export type getOneCattleForEditPageType = Awaited<ReturnType<typeof getOneCattleForEditPage>>
export type getAllCattleForServerFarmsPageType = Awaited<ReturnType<typeof getAllCattleForServerFarmsPage>>
export type getAllCattleForServerCattlePageType = Awaited<ReturnType<typeof getAllCattleForServerCattlePage>>