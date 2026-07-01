import { z } from 'zod';

export const CattleScalarFieldEnumSchema = z.enum(['id','farmId','breedId','description','image','images','gender','age','liveWeight','costPrice','createdAt','updatedAt']);

export default CattleScalarFieldEnumSchema;
