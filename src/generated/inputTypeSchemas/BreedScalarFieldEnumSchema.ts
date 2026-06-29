import { z } from 'zod';

export const BreedScalarFieldEnumSchema = z.enum(['id','title','description','conversionRate','image','images','createdAt','updatedAt']);

export default BreedScalarFieldEnumSchema;
