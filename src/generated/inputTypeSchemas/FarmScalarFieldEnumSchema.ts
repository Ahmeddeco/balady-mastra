import { z } from 'zod';

export const FarmScalarFieldEnumSchema = z.enum(['id','name','country','state','city','detailedAddress','lat','lng','createdAt','updatedAt','userId']);

export default FarmScalarFieldEnumSchema;
