import { Role } from "@/generated/prisma/enums"

export type getAllUsersForUsersPageType = {
  data: {
    id: string,
    name: string | null,
    email: string,
    image: string | null,
    primaryMobile: string | null,
    country: string | null,
    state: string | null,
    city: string | null,
    role: Role,
  }[]
  totalPages: number
} | undefined