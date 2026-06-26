import { LanceVectorStore } from '@mastra/lance'
import { embed, embedMany } from 'ai'
import { MDocument } from '@mastra/rag'
import { readFile } from 'node:fs/promises'
import { embedder } from './embedder.model'

/* -------------------------- 1. Load markdown file ------------------------- */
const MdContent = await readFile("D:/WORKS/Next-JS-Works/balady-mastra/src/bot/rag/md/rag.md", "utf-8")
const doc = MDocument.fromMarkdown(MdContent)

/* ------------------------ // 2. Chunk the document ------------------------ */
const chunks = await doc.chunk({ strategy: "semantic-markdown" })

/* ------------------------- 3. Generate embeddings ------------------------- */
const { embeddings } = await embedMany({
  values: chunks.map(chunk => chunk.text),
  model: embedder
})

/* --------------------- 4. Create LanceDB vector store --------------------- */
const store = await LanceVectorStore.create('./src/bot/public/src/mastra/rag/db')

/* ------- 5. Create index (set dimension to match gemma:300m output) ------- */
await store.createIndex({
  tableName: 'myVectors',
  indexName: 'myCollection',
  dimension: 768, // update this to match the actual output dimension of gemma:300m
})

/* --------------------------- 6. Store embeddings -------------------------- */
await store.upsert({
  tableName: 'myVectors',
  indexName: 'myCollection',
  vectors: embeddings,
  metadata: chunks.map(chunk => ({ text: chunk.text })),
})

/* ------------------------- 7. Query similar chunks ------------------------ */
const userQuery = "طريقة عمل ستروجانوف اللحم"

const { embedding: queryVector } = await embed({
  value: userQuery,
  model: embedder // استخدام نفس الموديل (embeddinggemma:300m) لضمان توافق الأبعاد
})

// 3. تنفيذ عملية البحث في LanceDB
const results = await store.query({
  tableName: 'myVectors',
  indexName: 'myCollection',
  queryVector: queryVector,
  topK: 3,
})

console.log('نتائج البحث المشابهة:', results)


/* --------------- use this execution command in the terminal --------------- */
// npx tsx src/bot/rag/store.ts