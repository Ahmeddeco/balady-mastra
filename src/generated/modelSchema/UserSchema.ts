import { z } from 'zod';
import { RoleSchema } from '../inputTypeSchemas/RoleSchema'

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: RoleSchema,
  id: z.string(),
  name: z.string().nullish(),
  email: z.string(),
  emailVerified: z.date().nullish(),
  image: z.string().nullish(),
  personalId: z.string().nullish(),
  primaryMobile: z.string().nullish(),
  secondaryMobile: z.string().nullish(),
  country: z.string().nullish(),
  state: z.string().nullish(),
  city: z.string().nullish(),
  detailedAddress: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof UserSchema>

export default UserSchema;
