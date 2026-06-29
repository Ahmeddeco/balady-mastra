import { ChartNoAxesCombined, Ham, RulerDimensionLine, Server, Users } from "lucide-react"
import { PiCowDuotone, PiFarmFill } from "react-icons/pi"

export const serverNav = [
  {
    title: "server",
    href: "/server",
    icon: Server
  },
  {
    title: "users",
    href: "/server/users",
    icon: Users
  },
  {
    title: "farm",
    href: "/server/farms",
    icon: PiFarmFill
  },
  {
    title: "breed",
    href: "/server/breed",
    icon: RulerDimensionLine
  },
  {
    title: "cattle",
    href: "/server/cattle",
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