// تعريف واجهة البيانات (Interface) لضمان الـ Type Safety في الـ TypeScript
interface CattleYieldData {
  liveWeight?: number | null
  hotCarcassWeight?: number | null
  boneWeight?: number | null
  trimFatWeight?: number | null
  wasteWeight?: number | null
  netYieldWeight?: number | null
}

export const calculateYieldMetrics = (cattle: CattleYieldData) => {
  // 1. استخراج الأوزان الفعلية مع وضع 0 كقيمة افتراضية لمنع الأخطاء
  const live = cattle.liveWeight || 0
  const carcass = cattle.hotCarcassWeight || 0
  const bone = cattle.boneWeight || 0
  const fat = cattle.trimFatWeight || 0
  const waste = cattle.wasteWeight || 0
  const netMeat = cattle.netYieldWeight || 0

  // 2. حساب النسب كأرقام (Numbers) بدلاً من نصوص وتجنب مشاكل الـ Floating-point
  // تم استخدام Math.round لتقريب النتيجة لخانة أو خانتين عشريتين مع الحفاظ على نوع الـ Number
  return {

    dressingPercentage: live > 0 ? Math.round((carcass / live) * 100 * 100) / 100 : 0, // نسبة التصافي = (وزن الذبيحة / الوزن القائم) * 100
    meatYieldPercentage: carcass > 0 ? Math.round((netMeat / carcass) * 100 * 100) / 100 : 0,  // نسبة التشافي = (وزن اللحم الصافي / وزن الذبيحة) * 100
    bonePercentage: carcass > 0 ? Math.round((bone / carcass) * 100 * 100) / 100 : 0,  // نسبة العظم = (وزن العظم / وزن الذبيحة) * 100
    fatPercentage: carcass > 0 ? Math.round((fat / carcass) * 100 * 100) / 100 : 0, // نسبة الدهن المهذب = (وزن الدهن / وزن الذبيحة) * 100
    wastePercentage: carcass > 0 ? Math.round((waste / carcass) * 100 * 100) / 100 : 0,  // نسبة الشغت والهالك الصافي = (وزن الشغت / وزن الذبيحة) * 100
  }
}