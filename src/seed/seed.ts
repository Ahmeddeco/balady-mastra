import { Age, Category, CattleType, Gender, MeatType, Role, Unit } from "@/generated/prisma/enums"
import prisma from "@/lib/prisma"

// Helper function to slugify Arabic text safely and correctly
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
  console.log('⏳ DATABASE CLEANUP: Purging all tables in reverse order to avoid constraint violations...')

  // Clean up existing records to avoid foreign key conflicts
  await prisma.favorite.deleteMany({})
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.yield.deleteMany({})
  await prisma.cattle.deleteMany({})
  await prisma.breed.deleteMany({})
  await prisma.farm.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('✅ CLEANUP COMPLETE: Starting data seeding sequentially...')

  // =========================================================
  // 1. Seed 12 Users (Admin, Suppliers, Clients)
  // =========================================================
  console.log('🔹 SEEDING: Creating 12 users/accounts...')
  const usersData = [
    { name: 'أحمد عبد الفتاح', email: 'admin@hetetlahma.com', role: Role.admin, primaryMobile: '01000000001', city: 'شبين الكوم', detailedAddress: 'بجوار مستشفى المواساة، البر الشرقي' },
    { name: 'الحاج محمد الجزار', email: 'mohamed.butcher@gmail.com', role: Role.supplier, primaryMobile: '01112223334', city: 'تلا', detailedAddress: 'شارع بورسعيد العمومي' },
    { name: 'المهندس مصطفى محمود', email: 'mostafa.farm@outlook.com', role: Role.supplier, primaryMobile: '01223334445', city: 'قويسنا', detailedAddress: 'طريق مصر اسكندرية الزراعي' },
    { name: 'الدكتور حازم سعيد', email: 'hazem.vet@gmail.com', role: Role.user, primaryMobile: '01556667778', city: 'الشهداء', detailedAddress: 'ميدان المحطة' },
    { name: 'الحاج إبراهيم غالي', email: 'ibrahim.ghaly@yahoo.com', role: Role.supplier, primaryMobile: '01002003004', city: 'أشمون', detailedAddress: 'خلف مركز الشرطة' },
    { name: 'عمرو دياب الشرقاوي', email: 'amr.sharkawy@gmail.com', role: Role.client, primaryMobile: '01147778889', city: 'شبين الكوم', detailedAddress: 'شارع الجلاء البحريني' },
    { name: 'طه عبد الكريم', email: 'taha.meat@gmail.com', role: Role.supplier, primaryMobile: '01289991112', city: 'منوف', detailedAddress: 'طريق سرس الليان' },
    { name: 'الحاج عادل شاهين', email: 'adel.shahin@gmail.com', role: Role.supplier, primaryMobile: '01065554443', city: 'بركة السبع', detailedAddress: 'بجوار الكوبري العلوي' },
    { name: 'كريم رأفت الأسيوطي', email: 'karim.assiouty@gmail.com', role: Role.client, primaryMobile: '01521113334', city: 'شبين الكوم', detailedAddress: 'حي كفر مصلحة' },
    { name: 'المهندس سامح غنيم', email: 'sameh.ghoneim@gmail.com', role: Role.supplier, primaryMobile: '01014141515', city: 'السادات', detailedAddress: 'المنطقة الصناعية الرابعة' },
    { name: 'أشرف عبد الباقي', email: 'ashraf.client@gmail.com', role: Role.client, primaryMobile: '01123456789', city: 'الباجور', detailedAddress: 'شارع الجيش' },
    { name: 'محمود الشامي', email: 'shamy.farm@gmail.com', role: Role.supplier, primaryMobile: '01234567890', city: 'شبين الكوم', detailedAddress: 'بشائر الخير' },
  ]

  const users = []
  for (const u of usersData) {
    const user = await prisma.user.create({
      data: { ...u, country: 'مصر', state: 'المنوفية' }
    })
    users.push(user)
  }

  // =========================================================
  // 2. Seed 12 Breeds with high technical accuracy
  // =========================================================
  console.log('🔹 SEEDING: Creating 12 standard cattle breeds...')
  const breedsData = [
    {
      name: 'سمنتال ألماني (Simmental)',
      type: CattleType.cow,
      conversionRate: 1.45,
      description: 'سلالة سويسرية-ألمانية مزدوجة الغرض. تمتاز بهيكل عظمي عريض وقدرة ممتازة على تحويل الأعلاف إلى لحم أحمر مرمر، مع نسبة تصافي تصل إلى 60-62%.',
      image: 'https://images.unsplash.com/photo-1546445317-29f4545e6d51?w=800',
      images: ['https://images.unsplash.com/photo-1546445317-29f4545e6d51?w=800']
    },
    {
      name: 'بلاك أنجوس (Black Angus)',
      type: CattleType.cow,
      conversionRate: 1.30,
      description: 'السلالة رقم 1 عالمياً في جودة الستيك الفاخر. تمتاز بقدرة وراثية عالية على توزيع الدهون داخل نسيج العضلات (الترخيم Marbling) ونسبة تصافي 62-64%.',
      image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800',
      images: ['https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800']
    },
    {
      name: 'بقري بلدي خليط سوبر',
      type: CattleType.cow,
      conversionRate: 1.10,
      description: 'السلالة التجارية الأكثر نجاحاً بمصر ناتجة من تهجين البلدي مع سلالات أوروبية. لحمها وردي طازج قليل الدهون ومقاومة عالية للأمراض المحلية، بتصافي 55-58%.',
      image: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=800',
      images: ['https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=800']
    },
    {
      name: 'جاموس بحيري مصري',
      type: CattleType.buffalo,
      conversionRate: 0.95,
      description: 'أفضل سلالات اللحم واللبن في مصر السفلى. يمتاز اللحم باللون الأحمر الداكن والخلو التام من الكوليسترول في الدهون، ونسبة تصافي تصل لـ 53-56%.',
      image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=800',
      images: ['https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=800']
    },
    {
      name: 'ليموزين فرنسي (Limousin)',
      type: CattleType.cow,
      conversionRate: 1.40,
      description: 'سلالة فرنسية عملاقة تتميز بإنتاجية لحم أحمر صافي فائقة العروق والكتل العضلية، عظامها خفيفة جداً مما يرفع نسبة التصافي بعد الذبح إلى 65%.',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
      images: []
    },
    {
      name: 'شاروليه (Charolais)',
      type: CattleType.cow,
      conversionRate: 1.50,
      description: 'من أقدم وأضخم سلالات التسمين الفرنسية، لونها أبيض كريمي، تمتاز بمعدل نمو يومي جبار وكتلة لحمية ضخمة في منطقة الفخد والقطنية.',
      image: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=800',
      images: []
    },
    {
      name: 'جمال مغربي كاسر',
      type: CattleType.camel,
      conversionRate: 0.80,
      description: 'إبل لحم ممتازة تستورد للتسمين في مصر، ألياف اللحم غنية بالبروتينات والحديد ونسبة الدهون منخفضة وتتركز بالسنام فقط، نسبة تصافي 50-52%.',
      image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=800',
      images: []
    },
    {
      name: 'غنم برقي مرساوي',
      type: CattleType.sheep,
      conversionRate: 0.25,
      description: 'سلالة أغنام برقة الشهيرة بمطروح، ترعى على الأعشاب الصحراوية ولحمها يمتاز بقلة نسبة الدهون (اللية صغيرة جداً) وطعم خالي تماماً من الزفارة.',
      image: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=800',
      images: []
    },
    {
      name: 'ماعز بور (Boer)',
      type: CattleType.goat,
      conversionRate: 0.35,
      description: 'سلالة الماعز الأولى عالمياً في إنتاج اللحم منشأها جنوب أفريقيا. تمتاز بجسم عريض ممتلئ ولحم طري غني بالعصارة بنسبة تصافي تصل لـ 55%.',
      image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800',
      images: []
    },
    {
      name: 'براهمان (Brahman)',
      type: CattleType.cow,
      conversionRate: 1.15,
      description: 'سلالة أمريكية ذات سنام تتحمل درجات الحرارة العالية والرطوبة الشديدة ومقاومة للقراد والأمراض الجلدية بشكل جينات وراثية خارقة.',
      image: 'https://images.unsplash.com/photo-1563503113-16a7da933333?w=800',
      images: []
    },
    {
      name: 'جاموس صعيدي (قبلي)',
      type: CattleType.buffalo,
      conversionRate: 0.88,
      description: 'يتحمل الطقس الحار في صعيد مصر، عظامه قوية وممتاز في إنتاج اللحم الكندوز الثقيل بعد التسمين المكثف على الكسب والتبن وعلف المزارع.',
      image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800',
      images: []
    },
    {
      name: 'غنم رحماني بلدي',
      type: CattleType.sheep,
      conversionRate: 0.22,
      description: 'أكبر سلالات الأغنام المصرية حجماً، منشأها البحيرة، تمتاز بإنتاجية عالية في اللحم، ولونها بني داكن وهي المفضلة في أضاحي العيد بوجه بحري.',
      image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800',
      images: []
    }
  ]

  const breeds = []
  for (const b of breedsData) {
    const breed = await prisma.breed.create({ data: b })
    breeds.push(breed)
  }

  // =========================================================
  // 3. Seed 12 Livestock Farms (Farm)
  // =========================================================
  console.log('🔹 SEEDING: Creating 12 livestock & fattening farms...')
  const farmsData = [
    { name: 'مزرعة حتة لحمة النموذجية', city: 'شبين الكوم', userId: users[0].id },
    { name: 'مزارع الجزار لإنتاج العجول البقري', city: 'تلا', userId: users[1].id },
    { name: 'النور لتسمين السلالات الفاخرة', city: 'قويسنا', userId: users[2].id },
    { name: 'النماء للإنتاج الداجني والحيواني', city: 'أشمون', userId: users[4].id },
    { name: 'البركة لتجارة وموالدة الجاموس', city: 'منوف', userId: users[6].id },
    { name: 'شاهين لإنتاج الكندوز والبتلو', city: 'بركة السبع', userId: users[7].id },
    { name: 'الوفاق لتسمين العجول المستوردة', city: 'السادات', userId: users[9].id },
    { name: 'الهدى لتربية الأغنام والماعز البور', city: 'الباجور', userId: users[0].id },
    { name: 'الفايد للإنتاج الحيواني المكثف', city: 'شبين الكوم', userId: users[2].id },
    { name: 'الخيالة لتسمين الإبل والجمال', city: 'تلا', userId: users[1].id },
    { name: 'المراعي الخضراء للأبقار الحلابة واللحم', city: 'قويسنا', userId: users[4].id },
    { name: 'مزرعة الشامي لخلطات التسمين السوبر', city: 'شبين الكوم', userId: users[11].id },
  ]

  const farms = []
  for (const f of farmsData) {
    const farm = await prisma.farm.create({
      data: { ...f, country: 'مصر', state: 'المنوفية', detailedAddress: 'طريق المزرعة الرئيسي العمومي' }
    })
    farms.push(farm)
  }

  // =========================================================
  // 4. Seed 12 Heads of Cattle with realistic parameters
  // =========================================================
  console.log('🔹 SEEDING: Adding 12 live cattle records into barns...')
  const cattleData = [
    { farmId: farms[0].id, breedId: breeds[0].id, gender: Gender.male, age: Age.young, liveWeight: 465.0, costPrice: 83700.0, description: 'عجل سمنتال بيور، هادي وشهية ممتازة لعلف التسمين 16%' },
    { farmId: farms[0].id, breedId: breeds[1].id, gender: Gender.male, age: Age.medium, liveWeight: 510.0, costPrice: 102000.0, description: 'أنجوس أسود سوبر جاهز لدخول مجزر حتة لحمة للتشفي الفاخر' },
    { farmId: farms[1].id, breedId: breeds[2].id, gender: Gender.male, age: Age.medium, liveWeight: 420.0, costPrice: 71400.0, description: 'خليط بلدي كاسر جوز، نسبة دهن خارجية مثالية للبيع بالمحل' },
    { farmId: farms[2].id, breedId: breeds[3].id, gender: Gender.male, age: Age.adult, liveWeight: 580.0, costPrice: 98600.0, description: 'جاموس كندوز ثقيل، لحم أحمر داكن ممتاز للمفروم ومصنعات السجق' },
    { farmId: farms[2].id, breedId: breeds[4].id, gender: Gender.male, age: Age.young, liveWeight: 440.0, costPrice: 88000.0, description: 'ليموزين فرنسي عظم خفيف، ككتل عضلية فائقة الجودة بالفخد' },
    { farmId: farms[6].id, breedId: breeds[5].id, gender: Gender.male, age: Age.medium, liveWeight: 620.0, costPrice: 117800.0, description: 'تشاروليه عملاق هولندي، فرز أول مخصص لطلبيات الفنادق والمطاعم' },
    { farmId: farms[9].id, breedId: breeds[6].id, gender: Gender.male, age: Age.adult, liveWeight: 480.0, costPrice: 67200.0, description: 'جمل مغربي كاسر أول، السنام مليان دهن صافي ولحم أحمر خشن للفتة' },
    { farmId: farms[7].id, breedId: breeds[7].id, gender: Gender.male, age: Age.young, liveWeight: 55.0, costPrice: 11000.0, description: 'خروف برقي صحراوي مرسى مطروح، لية خفيفة جداً ولحم طري للشوي' },
    { farmId: farms[7].id, breedId: breeds[8].id, gender: Gender.male, age: Age.young, liveWeight: 45.0, costPrice: 9450.0, description: 'جدي بور أصلي، منشأ جنوب أفريقي، تسمين مكثف على الفول والدرة' },
    { farmId: farms[0].id, breedId: breeds[2].id, gender: Gender.female, age: Age.adult, liveWeight: 390.0, costPrice: 58500.0, description: 'بقرة بلدي نتاية مخصصة لإنتاج المفروم الاقتصادي والشرائح السريعة' },
    { farmId: farms[11].id, breedId: breeds[0].id, gender: Gender.male, age: Age.young, liveWeight: 410.0, costPrice: 73800.0, description: 'عجل سمنتال وسط، تحت التسمين لدورة عيد الأضحى المبارك' },
    { farmId: farms[11].id, breedId: breeds[11].id, gender: Gender.male, age: Age.medium, liveWeight: 65.0, costPrice: 12350.0, description: 'خروف رحماني كاسر جوز مجهز للذبح الفوري بناء على طلب عميل' },
  ]

  const cattles = []
  for (const c of cattleData) {
    const cattle = await prisma.cattle.create({ data: c })
    cattles.push(cattle)
  }

  // =========================================================
  // 5. Seed Yield / Deboning Reports for slaughtered cattle
  // =========================================================
  console.log('🔹 SEEDING: Creating yield and carcass breakdown reports...')
  const yieldsData = [
    { cattleId: cattles[1].id, hotCarcassWeight: 320.0, boneWeight: 54.0, fatWeight: 38.0, wasteWeight: 8.0, netYieldWeight: 220.0, report: 'الذبحية ممتازة والترخيم عالي جداً في بيت الكلاوي والانتركوت والموزة ناعمة.' },
    { cattleId: cattles[2].id, hotCarcassWeight: 240.0, boneWeight: 46.0, fatWeight: 24.0, wasteWeight: 6.0, netYieldWeight: 164.0, report: 'تصفي بلدي تقليدي، عضم خشن شوية لكن اللحم وردي فاتح ممتاز للبفتيك وكباب الحلة.' },
    { cattleId: cattles[3].id, hotCarcassWeight: 315.0, boneWeight: 68.0, fatWeight: 42.0, wasteWeight: 10.0, netYieldWeight: 195.0, report: 'جاموس كندوز كبير، اللحم أحمر داكن ونسبة الفات عالية في الدوش، مخصص للمفروم والسجق.' },
    { cattleId: cattles[4].id, hotCarcassWeight: 286.0, boneWeight: 38.0, fatWeight: 18.0, wasteWeight: 5.0, netYieldWeight: 225.0, report: 'سلالة الليموزين أبهرتنا، العضم خفيف جداً والكتلة اللحمية الصافية أعلى من المتوقع.' },
  ]

  for (const y of yieldsData) {
    await prisma.yield.create({ data: y })
  }

  // =========================================================
  // 6. Seed 12 Butcher Shop Products linked to source cattle
  // =========================================================
  console.log('🔹 SEEDING: Creating 12 commercial butcher shop products...')
  const productsData = [
    {
      title: 'انتركوت ستيك (ريب آي) أنجوس فاخر',
      description: 'قطعية الانتركوت مأخوذة من عجل بلاك أنجوس. تمتاز بتداخل دهني خفيف (ماربلينج) يمنحها طراوة وعصارة فريدة عند الشوي السريع.',
      cut: MeatType.ribeye, category: Category.meat, mainImage: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800',
      price: 480.0, stock: 45.0, lowQuantity: 5.0, cattleId: cattles[1].id
    },
    {
      title: 'كباب حلة بلدي من قطعية السن الصافي',
      description: 'مكعبات لحم بقري طازجة مقطوعة بعناية من منطقة السن لعجولنا البلدية الخليط. متوازنة بين اللحم والدهن لطعم بلدي أصيل.',
      cut: MeatType.chuck, category: Category.meat, mainImage: 'https://images.unsplash.com/photo-1560781290-7dc94c0f8f4f?w=800',
      price: 420.0, stock: 65.0, lowQuantity: 10.0, cattleId: cattles[2].id
    },
    {
      title: 'عرق فلتو بقري ناعم (Tenderloin)',
      description: 'بيت الكلاوي الفاخر، أنعم نسيج عضلي في الذبيحة بالكامل، خالي تماماً من الدهون ومخصص للإستيك السريع الذي يذوب في الفم.',
      cut: MeatType.tenderloin, category: Category.meat, mainImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      price: 520.0, stock: 12.0, lowQuantity: 2.0, cattleId: cattles[1].id
    },
    {
      title: 'موزة بقري بلدي بالعظم وللصواني',
      description: 'قطعية الموزة الخلفية الغنية بالجيلاتين الطبيعي والأنسجة الناعمة، مثالية للسلق وعمل طواجن البصل بالفرن.',
      cut: MeatType.shank, category: Category.meat, mainImage: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=800',
      price: 430.0, stock: 30.0, lowQuantity: 6.0, cattleId: cattles[2].id
    },
    {
      title: 'لحم مفروم كندوز سوبر (قليل الدسم)',
      description: 'مفروم طازج يجهز يومياً من قطعيات الرقبة والسن والوش فخدة، مضاف له نسبة 10% دهون دوش طبيعية لضمان التماسك والطعم الزكي.',
      cut: MeatType.processed, category: Category.processed, mainImage: 'https://images.unsplash.com/photo-1588168333622-24244fe27066?w=800',
      price: 390.0, stock: 120.0, lowQuantity: 15.0, cattleId: cattles[3].id
    },
    {
      title: 'سجق بلدي بالخلطة الشرقية السرية',
      description: 'سجق بلدي داخل ممبار ضاني طبيعي (هانك)، مفروم من لحم الكندوز الصافي ومتبل ببهارات حتة لحمة المميزة بدون مواد حافظة.',
      cut: MeatType.processed, category: Category.processed, mainImage: 'https://images.unsplash.com/photo-1541048611056-22998c2394e3?w=800',
      price: 350.0, stock: 80.0, lowQuantity: 10.0, cattleId: null
    },
    {
      title: 'وش فخدة بفتيك (إسكالوب) سريع الطهي',
      description: 'شرائح بفتيك رقيقة ومفصولة نتيج تشفية وش الفخدة للبقري الليموزين، خالية من الشغت والعروق لتنضج في أقل من دقيقتين.',
      cut: MeatType.topside, category: Category.meat, mainImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      price: 460.0, stock: 25.0, lowQuantity: 4.0, cattleId: cattles[4].id
    },
    {
      title: 'عرق تربيانكو (اللحمة الباردة) مميز',
      description: 'قطعية ضهر الفخدة الحبال الطويلة الخالية من الدهون الداخلية، مخصصة لعمل اللحمة الباردة بالثوم والفلفل الأسود والربط بالدوبارة.',
      cut: MeatType.eye_round, category: Category.meat, mainImage: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800',
      price: 470.0, stock: 18.0, lowQuantity: 2.0, cattleId: cattles[4].id
    },
    {
      title: 'ريش ضاني برقي للشوي على الفحم',
      description: 'ريش غنم برقي مرساوي طازجة، طعم غني جداً ونسبة دهن متناسقة تذوب على الفحم لتمنحك تجربة شوي بدوية أصيلة.',
      cut: MeatType.ribs, category: Category.meat, mainImage: 'https://images.unsplash.com/photo-1602489114881-48a86033d4d4?w=800',
      price: 490.0, stock: 20.0, lowQuantity: 3.0, cattleId: cattles[7].id
    },
    {
      title: 'كبدة بقري بلدي طازجة بالقلب والكلاوي',
      description: 'كبدة دبيحة اليوم الفريش، تقطع حسب الطلب (عصافيري أو شرائح للردة) مع قطع من القلب والكلاوي والحلويات البلدي.',
      cut: MeatType.liver, category: Category.meat, mainImage: 'https://images.unsplash.com/photo-1628268909376-e8c44bb3153f?w=800',
      price: 450.0, stock: 15.0, lowQuantity: 2.0, cattleId: cattles[1].id
    },
    {
      title: 'صدور دجاج بانيه مخلية (سوبر فريش)',
      description: 'صدور دجاج بيضاء مخلية تماماً من العظم والجلد، تنظف وتجهز يومياً داخل قسم الدواجن الخاص بمحلاتنا لضمان النظافة والجودة.',
      cut: MeatType.chicken_breast, category: Category.chicken, mainImage: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800',
      price: 210.0, stock: 150.0, lowQuantity: 20.0, unit: Unit.piece, cattleId: null
    },
    {
      title: 'برجر حتة لحمة الجامبو الملكي',
      description: 'أقراص برجر مجهزة من لحم الموزة والسن الكندوز الصافي مع بهارات البرجر الأمريكية، بدون إضافة صويا تماماً للحفاظ على الطعم الأصلي.',
      cut: MeatType.processed, category: Category.processed, mainImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
      price: 380.0, stock: 90.0, lowQuantity: 12.0, unit: Unit.piece, cattleId: null
    }
  ]

  for (const p of productsData) {
    await prisma.product.create({
      data: {
        title: p.title,
        slug: slugify(p.title),
        description: p.description,
        cut: p.cut,
        category: p.category,
        mainImage: p.mainImage,
        images: [p.mainImage],
        price: p.price,
        stock: p.stock,
        lowQuantity: p.lowQuantity,
        unit: p.unit ?? Unit.kg,
        cattleId: p.cattleId,
        increaseByOne: false,
        isActive: true,
        discount: 0
      }
    })
  }

  console.log('✨ SUCCESS: Database seeding accomplished flawlessly with 12 entries per table.')
}

main()
  .catch((e) => {
    console.error('❌ SEEDING CRASHED: An error occurred during runtime:')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })