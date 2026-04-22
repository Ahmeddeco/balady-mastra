/* eslint-disable @typescript-eslint/no-explicit-any */

import { createStep, createWorkflow } from '@mastra/core/workflows'
import { z } from 'zod'
import { getNonTrendingProducts } from '@/dl/products.data'
import { embedder } from '../rag/embedder.model'
import { embed } from 'ai'
import { LanceVectorStore } from '@mastra/lance'

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

const limit = 3

/* -------------------------- fetchButcherProducts -------------------------- */
const fetchButcherProducts = createStep({
  id: 'fetch-butcher-products',
  description: 'جلب القطعيات الاكثر كمية من قاعدة البيانات',
  inputSchema: z.object({
    limit: z.number().optional().default(limit),
  }),
  outputSchema: z.object({
    products: nonTrendingProductsSchema,
  }),
  execute: async () => {
    const products = await getNonTrendingProducts(limit)
    return { products }
  },
})

/* ---------------------------- getRecepieFromRag --------------------------- */
const getRecepieFromRag = createStep({
  id: 'get-recepie-from-rag',
  description: 'جلب وصفة من RAG تناسب القطعيات المأخوذة من الخطوة السابقة',
  inputSchema: z.object({
    products: nonTrendingProductsSchema,
  }),
  outputSchema: z.object({
    recepie: z.string().array(),
  }),
  execute: async (inputData) => {
    const userQuery = `ما هي الوصفة المناسبة لقطعة ${inputData.inputData.products[0].title} `

    const store = await LanceVectorStore.create('../rag/db')
    const { embedding: queryVector } = await embed({
      value: userQuery,
      model: embedder // استخدام نفس الموديل (embeddinggemma:300m) لضمان توافق الأبعاد
    })

    //  تنفيذ عملية البحث في LanceDB
    const results = await store.query({
      tableName: 'myVectors',
      indexName: 'myCollection',
      queryVector: queryVector,
      topK: 3,
    })
    // نقوم باستخراج النصوص فقط من نتائج البحث ليتوافق مع outputSchema
    const formattedRecipes = results.map((res: any) => res.text || res.content || JSON.stringify(res))

    return {
      recepie: formattedRecipes // إرجاع كائن يحتوي على المصفوفة
    }
  },
})

/* ---------------------------- getRecepieFromWeb --------------------------- */
const getRecepieFromWeb = createStep({
  id: 'get-recepie-from-web',
  description: 'جلب وصفة من الإنترنت تناسب القطعية',
  inputSchema: z.object({
    recepie: z.string().array(), // ✅ تم التعديل - نفس outputSchema لـ getRecepieFromRag
  }),
  outputSchema: z.object({
    recepie: z.string().array(),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra.getAgent('butcherAgent')
    if (!agent) throw new Error('Agent not found')

    const userQuery = `اقترح وصفة مناسبة للحوم`
    const response = await agent.generate(userQuery)

    return {
      recepie: [response.text],
    }
  },
})

/* ------------------------- generateExpertResponse ------------------------- */
const generateExpertResponse = createStep({
  id: 'generate-expert-response',
  description: 'صياغة الوصفة بأسلوب راقي وهيكل بيانات محدد',
  inputSchema: z.object({ recepie: z.string().array() }),
  outputSchema: z.object({
    finalAnswer: z.string(),
  }),
  execute: async ({ inputData, mastra, writer }) => {
    const recepie = inputData.recepie

    if (!recepie) throw new Error('recepie not found')

    const agent = mastra.getAgent('butcherAgent')
    if (!agent) throw new Error('Agent not found')

    const prompt = `
      الدور: أنت المهندس أحمد، خبير الإنتاج الحيواني المتخصص. تتحدث بلهجة مصرية "راقية" جداً (أسلوب الطبقات المثقفة).
      اللغة: العامية المصرية المهذبة (حضرتك، فندم، ذوق حضرتك الرفيع، معايير الجودة).

      البيانات المتاحة:
      - اسم الوصفة: ${inputData.recepie}
      - القطعة المختارة: ${inputData.recepie}

      المطلوب منك الآن:
      تقديم وصفة مرتبطة بالقطعة المختارة. يجب أن يشمل الرد:
      1. اسم الوصفة
      2. قائمة بالمكونات (المكونات)
      3. خطوات التحضير (طريقة التحضير)

      هيكل الرد المطلوب:
      # ${inputData.recepie} والقطعة المختارة لها ${inputData.recepie}
      ## المكونات
      - [اسم المكون]
      - [اسم المكون]

      ## طريقة التحضير
      1. [خطوة الأولى]
      2. [خطوة الثانية]

      **القيمة الغذائية لهذه الوصفة مع التركيز على أن القطعة المختارة لها هي من أفضل القطعيات لهذه الوصفة**

      تعليمات هامة:
      - استخدم اللهجة المصرية الراقية فقط.
      - ركز على الجودة والحصرية (Exclusivity).
- التزم تماما بالوصفة المقدمة لك من الخطوة السابقة.
      `


    const response = await agent.stream([{ role: 'user', content: prompt }])

    // Pipe agent stream to step writer for real-time text streaming
    await response.fullStream.pipeTo(writer)
    return { finalAnswer: await response.text }


  }
})


// خطوة وهمية تمرر البيانات كما هي عند وجود نتيجة من RAG
const skipStep = createStep({
  id: 'skip-step',
  inputSchema: z.object({
    recepie: z.string().array(), // نفس outputSchema لـ getRecepieFromRag
  }),
  outputSchema: z.object({
    recepie: z.string().array(),
  }),
  execute: async ({ inputData }) => inputData,
})


const butcherWorkflow = createWorkflow({
  id: 'butcher-workflow',
  inputSchema: z.object({ limit: z.number().optional().default(5) }),
  outputSchema: z.object({
    title: z.string(),
    ingrediants: z.string().array(),
    steps: z.string().array(),
    value: z.string(),
  }),
})
  .then(fetchButcherProducts)
  .then(getRecepieFromRag)
  .branch([
    [
      async ({ inputData }) => Boolean(inputData.recepie?.length),
      skipStep, // inputSchema: { recepie: string[] } ✅
    ],
    [
      async ({ inputData }) => !inputData.recepie?.length,
      getRecepieFromWeb, // inputSchema: { recepie: string[] } ✅
    ],
  ])
  .map(async ({ inputData }) => {
    const result = inputData['skip-step'] || inputData['get-recepie-from-web']
    return {
      recepie: result?.recepie ?? [],
    }
  })
  .then(generateExpertResponse)

butcherWorkflow.commit()

export { butcherWorkflow }