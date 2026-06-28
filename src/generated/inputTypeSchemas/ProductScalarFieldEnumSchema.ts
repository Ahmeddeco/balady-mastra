import { z } from 'zod';

export const ProductScalarFieldEnumSchema = z.enum(['id','title','slug','description','cut','category','mainImage','images','price','discount','unit','stock','lowQuantity','increaseByOne','createdAt','updatedAt']);

export default ProductScalarFieldEnumSchema;
