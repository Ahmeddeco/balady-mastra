import { z } from 'zod';

export const ProductScalarFieldEnumSchema = z.enum(['id','title','slug','description','cut','category','mainImage','images','price','discount','unit','stock','lowQuantity','increaseByOne','isActive','cattleId','createdAt','updatedAt']);

export default ProductScalarFieldEnumSchema;
