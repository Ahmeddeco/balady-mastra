import { z } from 'zod';

export const ProductScalarFieldEnumSchema = z.enum(['id','type','cut','preparation','title','slug','description','increaseByOne','specialCut','category','mainImage','images','price','discount','unit','quantity','lowQuantity','createdAt','updatedAt','isActive']);

export default ProductScalarFieldEnumSchema;
