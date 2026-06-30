import { z } from 'zod';

export const MeatTypeSchema = z.enum(['سن','موزة','ريش','وش_فخدة','ضهر_فخدة','سمانة','انتركوت','تربيانكو','لوحة_الكتف','دوش','كبدة','قلب','كلاوي','فلتو','السرة','مصنعات','صدور_دواجن','أوراك_دواجن']);

export type MeatTypeType = `${z.infer<typeof MeatTypeSchema>}`

export default MeatTypeSchema;
