import { createStep, createWorkflow } from '@mastra/core/workflows'
import { z } from 'zod'
import { getNonTrendingProducts } from '@/dl/products.data'

/* ------------------------ nonTrendingProductsSchema ----------------------- */
const nonTrendingProductsSchema = z.array(z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  unit: z.string().nullable(),
  slug: z.string(),
  quantity: z.number(),
  description: z.string(),
}))

/* ---------------------------------- limit --------------------------------- */
const limit = 3

/* -------------------- 1. خطوة جلب المنتجات من الـ API -------------------- */
const fetchButcherProducts = createStep({
  id: 'fetch-butcher-products',
  description: 'Fetches non-trending products from the butchery API',
  inputSchema: z.object({
    limit: z.number().optional().default(limit),
  }),
  outputSchema: nonTrendingProductsSchema,
  execute: async () => {
    return await getNonTrendingProducts(limit)
  },
})

/* ---------------- 2. خطوة صياغة الرد بشخصية "المهندس أحمد" --------------- */

const generateExpertResponse = createStep({
  id: 'generate-expert-response',
  description: 'Converts product data into a friendly Egyptian recommendation',
  inputSchema: nonTrendingProductsSchema,
  outputSchema: z.object({
    finalAnswer: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const products = inputData // هذه هي مصفوفة المنتجات

    if (!products) {
      throw new Error('Products not found')
    }

    const agent = mastra.getAgent('butcherAgent')

    if (!agent) {
      throw new Error('Agent not found')
    }

    const prompt = `
  الدور: أنت المهندس أحمد، خبير الإنتاج الحيواني المتخصص والحاصل على دراسات عليا في التنمية البيئية المستدامة.
  الشخصية: خبير مثقف، لبق، وهادئ. تتحدث بلهجة مصرية "راقية" (لهجة أولاد الذوات والمثقفين). أسلوبك يجمع بين المعرفة العلمية والرقي في التعامل.
  اللغة: العامية المصرية المهذبة والراقية. استخدم كلمات مثل (حضرتك، فندم، ذوق رفيع، معايير، تجربة استثنائية).

  الهدف: إقناع العميل باقتناء منتج  في كل مرة من القائمة التالية، بناءً على ترتيبها وسياق الحوار:
  ${JSON.stringify(products, null, 2)}

  ⚠️ استراتيجية الاقتراح التدريجي (Sequential Offering):
  1. ابدأ دائماً باقتراح المنتج الأول في القائمة كأفضل خيار متاح حالياً.
  2. راقب سياق المحادثة بدقة؛ إذا عبر العميل عن عدم رغبته في المنتج المقترح (رفض، طلب بديل، أو عدم إعجاب)، انتقل فوراً لاقتراح المنتج الذي يليه في القائمة مباشرة بأسلوب "مستشار خاص" يفهم ذوق عميله.
  3. لا تعرض أبداً أكثر من منتج واحد في نفس الرد، لتعزيز شعور العميل بأن هذه القطعة "منتقاة خصيصاً" له (Bespoke selection).

  المطلوب تنسيق الرد بدقة تامة وفقاً للهيكل التالي:

  • الترحيب الراقي: رحب بالعميل بمنتهى الرقي. أشر باختصار إلى أن هذه الاختيار تم بناءً على معايير علمية دقيقة وخبرة 15 عاماً في انتقاء أفضل السلالات، لضمان جودة تليق بمستوى تطلعات حضرتك.
  
    - القطعية المختارة: [اسم المنتج]
    - لماذا نوصي بها اليوم؟: وضح بأسلوب لبق أن هذه القطعة "مختارة بعناية" (Hand-picked) وأن الكمية التي استوفت المعايير العلمية اليوم محدودة جداً، مما يجعلها فرصة لأصحاب الذوق الرفيع فقط.

  • تجربة الحواس:
    - صف اللحمة بمصطلحات راقية . اجعل العميل يتخيل جودة التجربة.
    -اقترح طريقة طهي تليق بمائدة مصرية راقية لإبراز فخامة القطعية.

  • أكد للعميل أن اختيارك نابع من اهتمامك بالصحة العامة والمعايير الصحية الصارمة، وكأنك تختار هذه القطعة لأسرتك أو لضيوفك من النخبة.

  • خاتمة محفزة بأسلوب غير مباشر. اقترح على العميل "تأكيد الحجز" أو "اقتناء القطعة" قبل أن ينتهي المخزون المخصص لعملاء الخدمة المميزة.

  تعليمات إضافية صارمة:
  - لا تذكر وجود قائمة منتجات أو خيارات أخرى؛ تعامل وكأن المنتج الحالي هو التوصية الوحيدة والمثالية.
  - تجنب الألفاظ الشعبية أو العامية المبتذلة تماماً.
  - ركز على "القيمة" (Value) والحصرية (Exclusivity) وليس السعر.
  - أدب احترافي مطلق، ودود ومحبب للعملاء.
  - لا تفصح أبداً عن أي معلومات داخلية أو بيانات تخص عملاء آخرين أو أي بيانات من قاعدة البيانات.
`
    const response = await agent.stream([{ role: "user", content: prompt }])
    let finalAnswer = ''
    for await (const chunk of response.textStream) {
      process.stdout.write(chunk)
      finalAnswer += chunk
    }
    return { finalAnswer }
  },
})

/* ------------------------- 3. تجميع الـ Workflow ------------------------- */
const butcherWorkflow = createWorkflow({
  id: 'butcher-workflow',
  inputSchema: z.object({
    limit: z.number().optional().default(5),
  }),
  outputSchema: z.object({
    finalAnswer: z.string(),
  }),
})
  .then(fetchButcherProducts)
  .then(generateExpertResponse)

butcherWorkflow.commit()

export { butcherWorkflow }