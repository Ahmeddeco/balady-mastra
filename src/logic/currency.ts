export const Currency = (price: number) => {
    return price.toLocaleString('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

export const finalPrice = (price: number, discount: number) => {
    // التحقق من قيم السعر والخصم وانهم لايكونوا قيم سالبة
    const validatedPrice = price < 0 ? 0 : price
    const validatedDiscount = discount > 100 ? 100 : (discount < 0 ? 0 : discount)

    return (validatedPrice - (validatedPrice * (validatedDiscount / 100))).toLocaleString('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}