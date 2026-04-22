import { extractText } from 'unpdf'
import fs from 'fs'

export const pdfExtractor = async (fileDir: string) => {
  try {
    const pdfBuffer = fs.readFileSync(fileDir)
    const { text } = await extractText(new Uint8Array(pdfBuffer))
    return text
  } catch (error) {
    console.error(error)
  }
}