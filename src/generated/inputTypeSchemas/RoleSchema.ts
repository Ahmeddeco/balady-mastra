import { z } from 'zod';

export const RoleSchema = z.enum(['ADMIN','USER','CLIENT','SUPPLIER']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export default RoleSchema;
