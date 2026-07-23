import { redirect } from "next/navigation"
import { getSession } from "./getSession"
import { Role } from "@/generated/prisma/enums"

export const isAllowedRoles = async (isAllowedRoles: Role[]) => {
  const superAdmin = process.env.SUPER_ADMIN
  const session = await getSession()

  if (session?.user.email === superAdmin) {
    return
  }
  if (!session || !isAllowedRoles.includes(session?.user?.role as Role)) {
    redirect("/")
  }
  return
}