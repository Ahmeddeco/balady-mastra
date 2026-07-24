import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image','role','personalId','primaryMobile','secondaryMobile','country','state','mobile','city','detailedAddress','lat','lng','createdAt','updatedAt']);

export default UserScalarFieldEnumSchema;
