import { z } from 'zod';

export const ProductScalarFieldEnumSchema = z.enum(['id','title','slug','description','increaseByOne','cut','specialCut','category','mainImage','images','price','discount','unit','quantity','lowQuantity','createdAt','updatedAt','isActive']);

export default ProductScalarFieldEnumSchema;
