import RoleSchema from '@/generated/inputTypeSchemas/RoleSchema'
import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().nullish(),
  name: z.string().nullish(),
  email: z.string(),
  role: RoleSchema,
  primaryMobile: z.string().nullish(),
  secondaryMobile: z.string().nullish(),
  country: z.string().nullish(),
  state: z.string().nullish(),
  city: z.string().nullish(),
  detailedAddress: z.string().nullish(),
  image: z.string().nullish(),
  personalId: z.string().nullish(),
})

export type User = z.infer<typeof UserSchema>

export default UserSchema
