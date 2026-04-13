import { z } from 'zod';

export const CategorySchema = z.enum(['MEAT','PROCESSED','CHICKEN']);

export type CategoryType = `${z.infer<typeof CategorySchema>}`

export default CategorySchema;
