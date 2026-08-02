import { getSession } from "@/auth/getSession"
import { redirect } from "next/navigation"

export const isAllowedRoles = async (isAllowedRoles: string[]) => {
  const superAdmin = process.env.SUPER_ADMIN
  const session = await getSession()
  console.log('session from isAllowedRoles', session)

  if (session?.user.email === superAdmin) {
    return
  }
  if (!session || !isAllowedRoles.includes(session.user.role!)) {
    redirect("/login")
  }
  return
}