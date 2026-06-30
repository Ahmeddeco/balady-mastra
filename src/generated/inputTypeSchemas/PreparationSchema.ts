import { z } from 'zod';

export const PreparationSchema = z.enum(['escalope','steak','cubes','kabab_hala','slices','minced','whole']);

export type PreparationType = `${z.infer<typeof PreparationSchema>}`

export default PreparationSchema;
