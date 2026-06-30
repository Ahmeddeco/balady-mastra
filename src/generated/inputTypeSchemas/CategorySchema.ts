import { z } from 'zod';

export const CategorySchema = z.enum(['meat','processed','chicken']);

export type CategoryType = `${z.infer<typeof CategorySchema>}`

export default CategorySchema;
