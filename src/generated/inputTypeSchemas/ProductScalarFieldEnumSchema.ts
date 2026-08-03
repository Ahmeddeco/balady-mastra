import { z } from 'zod';

export const ProductScalarFieldEnumSchema = z.enum(['id','titleAr','titleEn','slug','descriptionAr','descriptionEn','cut','category','mainImage','images','price','discount','unit','stock','lowQuantity','increaseByOne','isActive','cattleId','createdAt','updatedAt']);

export default ProductScalarFieldEnumSchema;
