import { Age, Category, CattleType, Gender, MeatType, Role, Unit } from "@/generated/prisma/enums"
import prisma from "@/lib/prisma"
import { Decimal } from "@prisma/client/runtime/client"

// دالة مساعدة لعمل الـ Slug بشكل متوافق وصحيح للنصوص العربية
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0621-\u064A0-9\-_]/g, '')
    .replace(/\-+/g, '-')
}

async function main() {
  console.log('⏳ بدء تنظيف قاعدة البيانات وتصفير الجداول بالترتيب العكسي...')

  // تنظيف الجداول المحددة بالترتيب لتجنب قيود المفاتيح الأجنبية
  await prisma.product.deleteMany({})
  await prisma.cattle.deleteMany({})
  await prisma.farm.deleteMany({})
  await prisma.breed.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('✅ تم تنظيف الجداول. بدء تنفيذ خطوات السييد بالترتيب المنطقي...')

  // =========================================================
  // الخطوة 0: إضافة مستخدم (User) ليكون مديراً للمزرعة
  // =========================================================
  const managerUser = await prisma.user.create({
    data: {
      name: 'أحمد عبد الفتاح',
      email: 'admin@hetetlahma.com',
      role: Role.ADMIN,
      primaryMobile: '01000000001',
      country: 'مصر',
      state: 'المنوفية',
      city: 'شبين الكوم',
      detailedAddress: 'بجوار مستشفى المواساة، البر الشرقي',
    },
  })
  console.log('🔹 الخطوة 0: تم إضافة المستخدم الإداري بنجاح.')

  // =========================================================
  // الخطوة 1: إضافة فصائل لحيوانات اللحم إلى جدول Breed (بيانات علمية)
  // =========================================================

  // أ. سلالة السمنتال (Simmental)
  const breedSimmental = await prisma.breed.create({
    data: {
      title: 'سمنتال ألماني (Simmental)',
      description: 'سلالة نشأت في سويسرا وتطورت في ألمانيا. تمتاز بهيكل عظمي عريض وقدرة ممتازة على تحويل الأعلاف الخشنة والخضراء إلى لحم أحمر مرمر، مع نسبة تصافي تصل إلى 60-62%.',
      conversionRate: new Decimal(1.45), // معدل النمو اليومي الحقيقي: 1.45 كجم/يوم في التسمين المكثف
      image: 'https://images.unsplash.com/photo-1546445317-29f4545e6d51?auto=format&fit=crop&q=80&w=800',
      images: ['https://images.unsplash.com/photo-1546445317-29f4545e6d51?auto=format&fit=crop&q=80&w=800'],
    },
  })

  // ب. سلالة البلاك أنجوس (Black Angus)
  const breedAngus = await prisma.breed.create({
    data: {
      title: 'بلاك أنجوس إسكتلندي (Black Angus)',
      description: 'السلالة رقم 1 عالمياً في جودة الستيك الفاخر. تمتاز بقدرتها الوراثية العالية على توزيع الدهون داخل نسيج العضلات (الترخيم أو الـ Marbling) مما يعطي اللحم طراوة وعصارة استثنائية، بنسبة تصافي 62-64%.',
      conversionRate: new Decimal(1.30), // معدل النمو اليومي الحقيقي: 1.30 كجم/يوم
      image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=800',
      images: ['https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=800'],
    },
  })

  // ج. الخليط البلدي السوبر (الخليط التجاري المصري)
  const breedBaladyMix = await prisma.breed.create({
    data: {
      title: 'بقري بلدي خليط سوبر',
      description: 'السلالة التجارية الأكثر نجاحاً في السوق المصري، ناتجة عن تهجين الأبقار البلدية مع سلالات أوروبية متخصصة في اللحم. تمتاز بمقاومة عالية للأمراض المحلية، وتنتج لحماً وردياً طازجاً قليل الدهون الخارجية وهو الطعم البلدي التقليدي المفضل للمستهلك بمصر، بتصافي 55-58%.',
      conversionRate: new Decimal(1.05), // معدل النمو اليومي الحقيقي في مزارع التسمين المصرية: 1.05 كجم/يوم
      image: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&q=80&w=800',
      images: ['https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&q=80&w=800'],
    },
  })
  console.log('🔹 الخطوة 1: تم إضافة الفصائل والسلالات العلمية لجدول Breed.')

  // =========================================================
  // الخطوة 2: إضافة مزرعة إلى جدول Farm وربطها بالمدير
  // =========================================================
  const myFarm = await prisma.farm.create({
    data: {
      name: 'مزرعة حتة لحمة للإنتاج الحيواني والتسمين',
      userId: managerUser.id, // ربط صريح بالمستخدم الإداري
      country: 'مصر',
      state: 'المنوفية',
      city: 'شبين الكوم',
    },
  })
  console.log('🔹 الخطوة 2: تم إضافة المزرعة بنجاح وربطها بمديرها في جدول Farm.')

  // =========================================================
  // الخطوة 3: إضافة عجول إلى جدول Cattle وربطها بالمزرعة والفصيل
  // =========================================================

  // عجل تسمين سمنتال قائم بالمزرعة
  const cattleSimmental = await prisma.cattle.create({
    data: {
      farmId: myFarm.id, // ربط بالمزرعة المنشأة في الخطوة 2
      breedId: breedSimmental.id, // ربط بفصيل السمنتال المنشأ في الخطوة 1
      type: CattleType.بقري,
      gender: Gender.ذكر,
      age: Age.صغير, // لباني في مرحلة التسمين النهائي
      liveWeight: new Decimal(465.00), // الوزن قائم على الميزان بالكيلو
      costPrice: new Decimal(74400.00), // تكلفة الشراء الحقيقية للرأس بالجنيه
    },
  })

  // عجل خليط بلدي سوبر جاهز للذبح والتشفية
  const cattleBalady = await prisma.cattle.create({
    data: {
      farmId: myFarm.id,
      breedId: breedBaladyMix.id, // ربط بفصيل الخليط البلدي
      type: CattleType.بقري,
      gender: Gender.ذكر,
      age: Age.وسيط, // كاسر جوز - المرحلة التجارية المثالية للذبح لضمان طراوة اللحم وكمية التصافي
      liveWeight: new Decimal(420.00),
      costPrice: new Decimal(63000.00),
    },
  })
  console.log('🔹 الخطوة 3: تم إضافة العجول وربطها بالمزرعة وفصائلها في جدول Cattle.')

  // =========================================================
  // الخطوة 4: ربط كل ما سبق بجدول المنتجات Product
  // =========================================================

  // المنتج الأول: انتركوت مربوط بالعجل السمنتال لتتبع الجودة الفاخرة (Traceability)
  await prisma.product.create({
    data: {
      title: 'انتركوت ستيك (ريب آي) سمنتال فاخر',
      slug: slugify('انتركوت ستيك ريب آي سمنتال فاخر'),
      description: 'قطعية الانتركوت الفاخرة مأخوذة من عجل سمنتال ألماني مربى بمزارعنا ومذبوح حديثاً. تمتاز القطعية بتداخل دهني خفيف (الترخيم) يمنحها طراوة وعصارة فريدة عند الشوي السريع.',
      cut: MeatType.انتركوت,
      category: Category.MEAT,
      mainImage: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=800',
      images: ['https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800'],
      price: new Decimal(460.00),
      discount: 0,
      unit: Unit.كجم,
      stock: new Decimal(35.00), // الوزن الصافي المتاح للبيع بعد تشفية العجل
      lowQuantity: new Decimal(5.00),
      increaseByOne: false,
      isActive: true,
      cattleId: cattleSimmental.id, // 👈 هنا تم الربط التام بالعجل السمنتال العيني المنشأ في خطوة 3
    },
  })

  // المنتج الثاني: مكعبات كباب حلة مربوطة بالعجل الخليط البلدي المذبوح اليوم بالمحل
  await prisma.product.create({
    data: {
      title: 'كباب حلة بلدي من قطعية السن الصافي',
      slug: slugify('كباب حلة بلدي من قطعية السن الصافي'),
      description: 'مكعبات لحم بقري طازجة مقطوعة بعناية من منطقة السن لعجولنا البلدية الخليط. تمتاز بالتوازن الطبيعي الممتاز بين اللحم الأحمر ونسبة دهن خفيفة تذوب أثناء الطبخ لتعطي أفضل مرقة وكباب حلة بلدي أصيل.',
      cut: MeatType.سن,
      category: Category.MEAT,
      mainImage: 'https://images.unsplash.com/photo-1560781290-7dc94c0f8f4f?auto=format&fit=crop&q=80&w=800',
      images: ['https://images.unsplash.com/photo-1628268909376-e8c44bb3153f?auto=format&fit=crop&q=80&w=800'],
      price: new Decimal(420.00),
      discount: 0,
      unit: Unit.كجم,
      stock: new Decimal(55.00), // كمية السن الصافي المتاحة بالثلاجة اليوم
      lowQuantity: new Decimal(10.00),
      increaseByOne: false,
      isActive: true,
      cattleId: cattleBalady.id, // 👈 هنا تم الربط التام بالعجل الخليط البلدي
    },
  })

  // المنتج الثالث: منتج عام من فصيل الأنجوس غير مربوط بعجل عيني محدد (لحم عام بالسوق)
  await prisma.product.create({
    data: {
      title: 'عرق فلتو أنجوس فاخر للشوي',
      slug: slugify('عرق فلتو أنجوس فاخر للشوي'),
      description: 'بيت الكلاوي الفاخر (عرق الفلتو) من فصيل البلاك أنجوس الأسكتلندي. أنعم نسيج عضلي في الذبيحة بالكامل، خالي من الدهون ومخصص للإستيك الفاخر الذي يذوب في الفم.',
      cut: MeatType.فلتو,
      category: Category.MEAT,
      mainImage: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&q=80&w=800',
      images: [],
      price: new Decimal(520.00),
      discount: 10,
      unit: Unit.كجم,
      stock: new Decimal(12.00),
      lowQuantity: new Decimal(2.00),
      increaseByOne: false,
      isActive: true,
      cattleId: null, // غير مربوط بعجل عيني، ولكنه يمثل لحم أنجوس عام مستورد أو متاح بالمحل
    },
  })
  console.log('🔹 الخطوة 4: تم ربط العجول والسلالات بجدول المنتجات Product بنجاح عالي.')

  console.log('✨ تهانينا! تمت عملية الـ Seeding بالتسلسل والربط المنطقي المطلوب بنجاح كامل 100%.')
}

main()
  .catch((e) => {
    console.error('❌ حدث خطأ أثناء عملية السييد المتسلسل:')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })