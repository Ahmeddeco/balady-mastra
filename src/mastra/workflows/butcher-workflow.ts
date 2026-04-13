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
// 1. خطوة جلب المنتجات من الـ API
const fetchButcherProducts = createStep({
  id: 'fetch-butcher-products',
  description: 'Fetches non-trending products from the butchery API',
  inputSchema: z.object({
    limit: z.number().optional().default(5),
  }),
  outputSchema: nonTrendingProductsSchema,
  execute: async () => {
    return await getNonTrendingProducts(5)
  },
})

// 2. خطوة صياغة الرد بشخصية "المهندس أحمد"

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
  اللغة: العامية المصرية المهذبة. استخدم كلمات مثل (حضرتك، فندم، ذوق رفيع، معايير، تجربة استثنائية).

  الهدف: إقناع العميل باقتناء أصناف من القائمة التالية باستخدام أحدث استراتيجيات علم النفس التسويقي (مثل مبدأ الندرة، الحصرية، والإشباع الحسي):
  ${JSON.stringify(products, null, 2)}

  المطلوب تنسيق الرد بدقة تامة وفقاً للهيكل التالي:

  ✨ "حته لحمة" | المختارات الحصرية للمهندس أحمد
  ══════════════════════════════════════════

  🎩 مدخل الخبراء (هيبة التخصص - Authority)
  • [رحب بالعميل بمنتهى الرقي. أشر باختصار إلى أن هذه الاختيارات تمت بناءً على معايير علمية دقيقة وخبرة 15 عاماً في انتقاء أفضل السلالات، لضمان جودة تليق بمستوى تطلعات حضرتك.]

  💎 القطعة النادرة (الحصرية والندرة - Scarcity & Exclusivity)
  • القطعية المختارة: [اسم المنتج]
  • لماذا نوصي بها اليوم؟: [وضح بأسلوب لبق أن هذه القطعة "مختارة بعناية" (Hand-picked) وأن الكمية التي استوفت المعايير العلمية اليوم محدودة جداً، مما يجعلها فرصة لأصحاب الذوق الرفيع فقط.]

  🍽️ تجربة التذوق (الإغراء الحسي الراقي - Sensory Appeal)
  • الخصائص الفيزيائية: [صف اللحمة بمصطلحات راقية مثل: "تداخل دهني مثالي - Marbling"، "نسيج مخملي ناعم"، "توازن النكهات". اجعل العميل يتخيل جودة التجربة.]
  • فن التقديم: [اقترح طريقة طهي تليق بمائدة راقية لإبراز فخامة القطعية.]

  🧠 ميثاق الجودة (الطمأنة النفسية - Risk Reversal)
  • [أكد للعميل أن اختيارك نابع من اهتمامك بالصحة العامة والمعايير الصحية الصارمة، وكأنك تختار هذه القطعة لأسرتك أو لضيوفك من النخبة.]

  🥂 دعوة للاقتناء (التحفيز الأنيق - Elegant CTA)
  • [خاتمة محفزة بأسلوب غير مباشر. اقترح على العميل "تأكيد الحجز" أو "اقتناء القطعة" قبل أن ينتهي المخزون المخصص لعملاء الخدمة المميزة.]

  تعليمات إضافية:
  - حافظ على التنسيق البصري (الإيموجي والخطوط الفاصلة).
  - تجنب الألفاظ الشعبية أو العامية المبتذلة.
  - ركز على "القيمة" (Value) وليس "السعر".
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

// 3. تجميع الـ Workflow
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