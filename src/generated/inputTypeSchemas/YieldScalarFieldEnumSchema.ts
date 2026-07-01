import { z } from 'zod';

export const YieldScalarFieldEnumSchema = z.enum(['id','cattleId','hotCarcassWeight','boneWeight','fatWeight','wasteWeight','netYieldWeight','report','createdAt','updatedAt']);

export default YieldScalarFieldEnumSchema;
