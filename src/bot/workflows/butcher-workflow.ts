import { createStep, createWorkflow } from '@mastra/core/workflows'
import { z } from 'zod'
import MeatTypeSchema from "@/generated/inputTypeSchemas/MeatTypeSchema"
import { getNonTrendingProductsTool } from "../tools/get-non-trending-products-tool"

/* ------------------------ nonTrendingProductsSchema ----------------------- */
// هذا التعريف يمثل مصفوفة المنتجات مباشرة
const nonTrendingProductsSchema = z.array(z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  unit: z.string().nullable(),
  slug: z.string(),
  stock: z.number(),
  cut: MeatTypeSchema,
  description: z.string(),
}))

/* ------------------------ fetchButcherProductsStep ------------------------ */
const fetchButcherProductsStep = createStep(getNonTrendingProductsTool)

/* ------------------------- analyzeAndRecommendStep ------------------------ */
const analyzeAndRecommendStep = createStep({
  id: 'analyze-and-recommend',
  description: 'يحلل المنتجات الراكدة ويختار قطعية معينة بناءً على المعايير ليرجعها كـ Schema محدد',

  // ✅ التعديل هنا: جعل المدخل مصفوفة مباشرة (Array) ليتطابق تماماً مع مخرج الأداة السابقة
  inputSchema: nonTrendingProductsSchema,

  outputSchema: z.object({
    recommendation: MeatTypeSchema,
  }),
  execute: async ({ inputData, mastra }) => {
    // التحقق من وجود البيانات (التي أصبحت الآن مصفوفة مباشرة)
    if (!inputData || !Array.isArray(inputData)) {
      throw new Error('Input data not found or not an array')
    }

    const agent = mastra?.getAgent('butcherAgent')
    if (!agent) {
      throw new Error('Butcher agent not found in Mastra context')
    }

    const validCuts = MeatTypeSchema.options

    // قمنا بتمرير inputData مباشرة لأنها هي المصفوفة الآن بدلاً من inputData.productsData
    const promptContext = `
أنت الآن خبير اللحوم المسؤول عن اتخاذ قرار دقيق ومحدد. بناءً على قائمة المنتجات الراكدة التالية:
${JSON.stringify(inputData, null, 3)}

المطلوب منك: تحليل هذه المنتجات واختيار "قطعية واحدة فقط" ترى أنها الأنسب للترويج لها الآن.
يجب أن تكون إجابتك عبارة عن كلمة واحدة فقط ومطابقة تماماً لـواحدة من هذه القيم حصراً:
${validCuts.join(' | ')}

تحذير: لا تكتب أي مقدمات أو تفسيرات أو علامات ترقيم، فقط اكتب الكلمة كما هي مكتوبة في الأعلى تماماً.
`

    const response = await agent.generate(promptContext)
    const cleanedText = response.text.trim()

    // التحقق من توافق النص الراجع مع الـ Enum
    const parsedCut = MeatTypeSchema.safeParse(cleanedText)

    if (!parsedCut.success) {
      // الـ Fallback في حال أخطأ الـ Agent: نأخذ قطعية أول منتج متاح في المصفوفة مباشرة
      const fallbackCut = inputData[0]?.cut
      if (fallbackCut) {
        return { recommendation: fallbackCut }
      }
      throw new Error(`الـ Agent أرجع قيمة غير مطابقة للـ Schema: ${cleanedText}`)
    }

    return {
      recommendation: parsedCut.data,
    }
  },
})

/* ---------------------------- getRecipeFromWeb --------------------------- */
const getRecipeFromWeb = createStep({
  id: 'get-recipe-from-web',
  description: 'جلب وصفة من الإنترنت تناسب القطعية المستلمة',
  inputSchema: z.object({
    recommendation: MeatTypeSchema,
  }),
  outputSchema: z.object({
    recipe: z.string(),
  }),
  execute: async ({ mastra, inputData }) => {
    const agent = mastra.getAgent('webSearchAgent')
    if (!agent) throw new Error('Agent not found')

    const userQuery = `اقترح وصفة طبخ مناسبة ومثالية جداً لقطعية اللحم المعروفة باسم: (${inputData.recommendation})`
    const response = await agent.stream([{ role: 'user', content: userQuery }])

    return {
      recipe: await response.text,
    }
  },
})

/* ------------------------- generateExpertResponse ------------------------- */
const generateExpertResponse = createStep({
  id: 'generate-expert-response',
  description: 'صياغة الوصفة بأسلوب راقي وهيكل بيانات محدد',
  inputSchema: z.object({ recipe: z.string() }),
  outputSchema: z.object({
    finalAnswer: z.string(),
  }),
  execute: async ({ inputData, mastra, writer }) => {
    const { recipe } = inputData
    if (!recipe) throw new Error('recipe not found')

    const agent = mastra.getAgent('butcherAgent')
    if (!agent) throw new Error('Agent not found')

    const prompt = `
      الدور: أنت المهندس أحمد، خبير الإنتاج الحيواني المتخصص. تتحدث بلهجة مصرية "راقية" جداً (أسلوب الطبقات المثقفة).
      اللغة: العامية المصرية المهذبة (حضرتك، فندم، ذوق حضرتك الرفيع، معايير الجودة).

      البيانات المتاحة:
      - تفاصيل الوصفة: ${recipe}

      المطلوب منك الآن:
      تقديم هذه الوصفة للعميل بأسلوبك الاحترافي اليدوي. يجب أن يشمل الرد:
      1. اسم الوصفة المناسبة للقطعية
      2. قائمة بالمكونات
      3. خطوات التحضير (طريقة التحضير)

      هيكل الرد المطلوب:
      # [اسم الوصفة المقترحة]
      ## المكونات
      - [اسم المكون]

      ## طريقة التحضير
      1. [الخطوة الأولى]

      **القيمة الغذائية لهذه الوصفة مع التركيز على مميزات هذه القطعية بالذات**
      `

    const response = await agent.stream([{ role: 'user', content: prompt }])

    if (writer) {
      await response.fullStream.pipeTo(writer)
    }

    return { finalAnswer: await response.text }
  }
})

/* ----------------------------- butcherWorkflow ---------------------------- */
const butcherWorkflow = createWorkflow({
  id: 'butcher-workflow',
  inputSchema: z.object({ limit: z.number().optional().default(5) }),
  outputSchema: z.object({
    finalAnswer: z.string(),
  }),
})
  .then(fetchButcherProductsStep)
  .then(analyzeAndRecommendStep)
  .then(getRecipeFromWeb)
  .then(generateExpertResponse)

butcherWorkflow.commit()

export { butcherWorkflow }