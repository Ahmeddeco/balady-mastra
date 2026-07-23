import 'server-only'

const dictionaries = {
  en: () => import('./en').then((module) => module.enDic),
  ar: () => import('./ar').then((module) => module.arDic),
}


export const getDictionary = async (locale: 'en' | 'ar') =>
  dictionaries[locale]()