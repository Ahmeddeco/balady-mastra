import { ChartNoAxesCombined, Ham, RulerDimensionLine, Server, Users } from "lucide-react"
import { PiCowDuotone, PiFarmFill } from "react-icons/pi"

export const serverNav = [
  {
    title: "السيرفر",
    href: "/server",
    icon: Server
  },
  {
    title: "المستخدمين",
    href: "/server/users",
    icon: Users
  },
  {
    title: "المزارع",
    href: "/server/farms",
    icon: PiFarmFill
  },
  {
    title: "السلالات",
    href: "/server/breeds",
    icon: RulerDimensionLine
  },
  {
    title: "الحيوانات",
    href: "/server/cattle",
    icon: PiCowDuotone
  },
  {
    title: "التصافي",
    href: "/server/yields",
    icon: PiCowDuotone
  },
  {
    title: "products",
    href: "/server/products",
    icon: Ham
  },
  {
    title: "الإحصائيات",
    href: "/server/charts",
    icon: ChartNoAxesCombined
  },
]