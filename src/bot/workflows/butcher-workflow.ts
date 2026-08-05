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

butcherWorkflow.commit()

export { butcherWorkflow }