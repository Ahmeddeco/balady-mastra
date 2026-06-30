import { z } from 'zod';

export const YieldReportScalarFieldEnumSchema = z.enum(['id','cattleId','hotCarcassWeight','boneWeight','fatWeight','wasteWeight','netYieldWeight','createdAt','updatedAt']);

export default YieldReportScalarFieldEnumSchema;
