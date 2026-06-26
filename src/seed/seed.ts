import MeatTypeSchema from "@/generated/inputTypeSchemas/MeatTypeSchema"
import { Category, Unit } from "@/generated/prisma/enums"
import prisma from "@/lib/prisma"
import { faker } from "@faker-js/faker"

// مواءمة مصفوفة المنتجات لتطابق الـ MeatType Enum المعرف في الـ Schema تماماً
const meatProducts = [
  { title: "عرق فليتو بلدي فاخر", cut: MeatTypeSchema.Enum.انتركوت, category: Category.MEAT, unit: Unit.KG },
  { title: "موزة بقري أصلي زبدة", cut: MeatTypeSchema.Enum.موزة, category: Category.MEAT, unit: Unit.KG },
  { title: "كفتة حاتي متبلة جاهزة", cut: MeatTypeSchema.Enum.سن, category: Category.PROCESSED, unit: Unit.KG },
  { title: "سجق بلدي خلطة خاصة", cut: MeatTypeSchema.Enum.سن, category: Category.PROCESSED, unit: Unit.KG },
  { title: "بوفتيك ناعم لسه واصل", cut: MeatTypeSchema.Enum.وش_فخدة, category: Category.MEAT, unit: Unit.KG },
  { title: "إنتركوت بيت الكلاوي تربية بيتي", cut: MeatTypeSchema.Enum.انتركوت, category: Category.MEAT, unit: Unit.KG },
  { title: "برجر سوبر فريش", cut: MeatTypeSchema.Enum.سن, category: Category.PROCESSED, unit: Unit.KG },
  { title: "لحمة مفرومة سن صافي", cut: MeatTypeSchema.Enum.سن, category: Category.MEAT, unit: Unit.KG },
  { title: "ريش ضاني بلدي ممتازة", cut: MeatTypeSchema.Enum.ريش, category: Category.MEAT, unit: Unit.KG },
  { title: "كبدة بتلو اسكندراني", cut: MeatTypeSchema.Enum.وش_فخدة, category: Category.MEAT, unit: Unit.KG },
]

async function main() {
  console.log("🧹 جاري تنظيف قاعدة البيانات...")
  await prisma.product.deleteMany()

  console.log("🌱 جاري إدخال بيانات المنتجات لبراند بلدي...")
  for (const product of meatProducts) {
    // توليد الـ Slug بشكل نظيف يتوافق مع حروف العناوين
    const slug = `${faker.helpers.slugify(product.title).toLowerCase()}-${faker.string.alphanumeric(5)}`

    await prisma.product.create({
      data: {
        title: product.title,
        slug: slug,
        description: `من أجود قطعيات براند "بلدي" الفاخرة تحت إشراف المهندس أحمد.`,
        cut: product.cut, // استخدام الـ Enum المطابق للـ Schema
        category: product.category,
        mainImage: `https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80`,
        images: [`https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80`],
        price: Number(faker.commerce.price({ min: 350, max: 650 })),
        unit: product.unit,
        quantity: faker.number.int({ min: 20, max: 150 }),
        isActive: true,
        // ✅ تم إزالة حقل preparation لعدم وجوده في جدول الـ Product في الـ Schema الحالية
      }
    })
  }
  console.log("✅ تم تنفيذ الـ Seed وإدخال المنتجات بنجاح يا هندسة!")
}

main()
  .catch(e => {
    console.error("❌ حدث خطأ أثناء تنفيذ الـ Seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })