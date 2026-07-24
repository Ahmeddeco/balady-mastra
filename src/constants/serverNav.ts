import { ChartNoAxesCombined, Ham, Newspaper, RulerDimensionLine, Server, Users } from "lucide-react"
import { PiCowDuotone, PiFarmFill } from "react-icons/pi"

export const serverNav = [
  {
    title: { ar: "سيرفر", en: "server" },
    href: "/server",
    icon: Server
  },
  {
    title: { ar: "المستخدمين", en: "users" },
    href: "/server/users",
    icon: Users
  },
  {
    title: { ar: "المزارع", en: "farms" },
    href: "/server/farms",
    icon: PiFarmFill
  },
  {
    title: { ar: "السلالات", en: "breeds" },
    href: "/server/breeds",
    icon: RulerDimensionLine
  },
  {
    title: { ar: "الحيوانات", en: "cattle" },
    href: "/server/cattle",
    icon: PiCowDuotone
  },
  {
    title: { ar: "التصافي", en: "yields" },
    href: "/server/yields",
    icon: PiCowDuotone
  },
  {
    title: { ar: "المنتجات", en: "products" },
    href: "/server/products",
    icon: Ham
  },
  {
    title: { ar: "مقالاتنا", en: "articles" },
    href: "/server/articles",
    icon: Newspaper
  },
  {
    title: { ar: "الإحصائيات", en: "charts" },
    href: "/server/charts",
    icon: ChartNoAxesCombined
  },

]