export const splittedItems = (items: string) => {
  const itemsArray = items.split(",").map((item) => item.trim())
  return itemsArray
}