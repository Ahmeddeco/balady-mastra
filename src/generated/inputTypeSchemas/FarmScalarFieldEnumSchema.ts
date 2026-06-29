import { z } from 'zod';

export const FarmScalarFieldEnumSchema = z.enum(['id','name','userId','country','state','city','createdAt','updatedAt']);

export default FarmScalarFieldEnumSchema;
