import { finalPrice, Currency } from "../logic/currency"
import { expect, test, describe } from "vitest"

describe("finalPrice ", () => {

  test("must return 0.00 EGP if the price is minus", () => {
    const result = finalPrice(-100, 10)
    expect(result).toContain("٠٫٠٠")
  })

  test("incorrect discount", () => {
    const result = finalPrice(100, 150) // خصم 150% غير منطقي
    expect(result).toContain("٠٫٠٠")
  })

  test("it must ignore the discount if it is minus", () => {
    const result = finalPrice(100, -20) // خصم بالسالب
    expect(result).toContain("١٠٠٫٠٠")
  })

})


describe("Currency", () => {

  test("يجب أن يحول الرقم إلى تنسيق العملة المصرية بالأرقام العربية", () => {
    const result = Currency(1500)

    // نختبر وجود الأرقام العربية بغض النظر عن ترتيب العرض في الـ Terminal
    expect(result).toContain("١٬٥٠٠٫٠٠")
    expect(result).toContain("ج.م")
  })
})