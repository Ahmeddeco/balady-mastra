export const dateFormat = (date: Date) => {
  return date.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    numberingSystem: "latn"
  })
}