import { z } from 'zod';

export const PreparationSchema = z.enum(['بفتيك','ستيك','مكعبات','كباب_حلة','شرائح','مفروم','كامل']);

export type PreparationType = `${z.infer<typeof PreparationSchema>}`

export default PreparationSchema;
