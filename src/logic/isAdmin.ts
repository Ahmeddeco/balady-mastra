import { auth } from "../../auth"
import { Role } from "@/generated/prisma/enums"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export const isAdmin = async () => {
  // const session = await auth()
  // if (!session) redirect("/")

  // const authEmail = session?.user?.email
  // const userDB = await prisma.user.findUnique({
  //   where: { email: authEmail! }, select: { role: true }
  // })

  // if
  //   (authEmail === process.env.SUPPER_ADMIN || userDB?.role === Role.ADMIN) {
  //   return session
  // } else {
  //   redirect("/")
  // }

  return
}

