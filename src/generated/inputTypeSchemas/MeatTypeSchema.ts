import { z } from 'zod';

export const MeatTypeSchema = z.enum(['chuck','shank','ribs','topside','silverside','knuckle','ribeye','eye_round','blade','brisket','liver','heart','kidneys','tenderloin','flank','processed','chicken_breast','chicken_thigh']);

export type MeatTypeType = `${z.infer<typeof MeatTypeSchema>}`

export default MeatTypeSchema;
