import { z } from 'zod';

export const ProductScalarFieldEnumSchema = z.enum(['id','title','slug','description','cut','category','mainImage','images','price','discount','unit','quantity','lowQuantity','increaseByOne','createdAt','updatedAt']);

export default ProductScalarFieldEnumSchema;
