import { z } from 'zod'

export const FavoriteSchema = z.object({
  productId: z.string(),
  userId: z.string(),
})

export type Favorite = z.infer<typeof FavoriteSchema>

export default FavoriteSchema
