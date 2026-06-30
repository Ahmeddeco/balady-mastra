import { z } from 'zod';

export const RoleSchema = z.enum(['admin','user','client','supplier']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export default RoleSchema;
