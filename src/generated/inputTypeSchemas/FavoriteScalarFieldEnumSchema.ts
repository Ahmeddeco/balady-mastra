import { z } from 'zod';

export const FavoriteScalarFieldEnumSchema = z.enum(['productId','userId','createdAt']);

export default FavoriteScalarFieldEnumSchema;
