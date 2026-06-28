import { Category, MeatType, Unit } from "@/generated/prisma/enums"
import prisma from "@/lib/prisma"
import { fakerAR as faker } from '@faker-js/faker'

// روابط صور فريش وعالية الجودة تم التحقق من سلامتها ومخصصة للحوم الحمراء الطازجة
const MEAT_IMAGES_POOL = [
  'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=800', // Fresh Beef Cut
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800', // Raw Meat Steaks
  'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=800', // Raw Ribs
  'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&q=80&w=800', // Premium Butcher Cut
  'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&q=80&w=800', // Ribeye Steak Raw
  'https://images.unsplash.com/photo-1560781290-7dc94c0f8f4f?auto=format&fit=crop&q=80&w=800', // Fresh Raw Beef
  'https://images.unsplash.com/photo-1628268909376-e8c44bb3153f?auto=format&fit=crop&q=80&w=800', // Red Meat Close up
  'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&q=80&w=800', // Raw Steaks Pack
  'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&q=80&w=800', // Raw Steaks Pack
]

// دالة مساعدة لعمل الـ Slug بشكل متوافق وصحيح للنصوص العربية
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // استبدال المسافات بشرطة
    .replace(/[^\u0621-\u064A0-9\-_]/g, '') // الاحتفاظ بالحروف العربية والأرقام والشرط فقط
    .replace(/\-+/g, '-') // منع تكرار الشرط
}

async function main() {
  console.log('⏳ Cleaning up database tables...')
  await prisma.product.deleteMany({})
  console.log('✅ Products table has been cleared.')

  // قائمة بقطعيات اللحوم الفريش لإنشاء منتجات حقيقية مبنية على الـ Enum المتوفر لديك
  const freshMeatProducts = [
    { title: 'كيلو عرق فلتو فريش ممتازة', cut: MeatType.فلتو },
    { title: 'وش فخدة بلدي للبفتيك والاسكالوب', cut: MeatType.وش_فخدة },
    { title: 'كيلو كباب حلة سن بقري فريش', cut: MeatType.سن },
    { title: 'موزة بقري بلدي بالعظم فريش', cut: MeatType.موزة },
    { title: 'ريش ضاني بلدي فريش للشي', cut: MeatType.ريش },
    { title: 'انتركوت بقري مميز للشوي والقلي', cut: MeatType.انتركوت },
    { title: 'كبدة بقري بلدي طازجة', cut: MeatType.كبدة },
    { title: 'لحم مفروم بلدي طازج خالي من الدسم', cut: MeatType.مصنعات },
  ]

  console.log('🌱 Seeding fresh meat products...')

  for (const item of freshMeatProducts) {
    // خلط المصفوفة لاختيار صور مختلفة بشكل عشوائي فريد لكل منتج
    const shuffledImages = [...MEAT_IMAGES_POOL].sort(() => 0.5 - Math.random())
    const mainImage = shuffledImages[0]

    // أخذ 8 صور كاملة لخانة الـ images
    const galleryImages = shuffledImages.slice(1, 9)

    const price = faker.number.int({ min: 350, max: 480 })
    const discount = faker.helpers.arrayElement([0, 10, 15, 20])

    await prisma.product.create({
      data: {
        title: item.title,
        slug: slugify(item.title),
        description: `قطعيات لحوم فريش طازجة مختارة بعناية من أجود السلالات البلدية. قطع ${item.cut} ممتازة للطبخ المنزلي والتجهيز الفوري حسب طلبك، نضمن لك الجودة والنظافة والوزن الدقيق بعد التشفيه والتجهيز.`,
        cut: item.cut,
        category: Category.MEAT,
        mainImage: mainImage,
        images: galleryImages,
        price: price,
        discount: discount > 0 ? discount : null,
        unit: Unit.كجم, // ✅ تم التعديل لتطابق السكيما (كجم بدلاً من KG)
        stock: faker.number.float({ min: 10, max: 100, multipleOf: 0.5 }), // ✅ تم التعديل إلى stock بدلاً من quantity
        lowQuantity: 5,
        increaseByOne: false // بناءً على أن الوحدة كجم
      },
    })
  }

  console.log(`✨ Successfully seeded ${freshMeatProducts.length} fresh meat products with multiple images each.`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding process:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })