import { z } from 'zod';

export const BreedScalarFieldEnumSchema = z.enum(['id','name','description','type','conversionRate','image','images','createdAt','updatedAt']);

export default BreedScalarFieldEnumSchema;
