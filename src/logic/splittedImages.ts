export const splittedImages = (images: string | undefined | null): string[] => {
  // إذا كانت القيمة غير موجودة أو نصاً فارغاً، أعد مصفوفة فارغة مباشرة
  if (!images || typeof images !== 'string') {
    return []
  }

  return images.split(",").map((image) => image.trim()).filter(Boolean)
}