import { GiChickenOven } from "react-icons/gi"
import { ShoppingBag, Smile, Truck } from "lucide-react"
import { GiBuffaloHead } from "react-icons/gi"
import { FaUserDoctor } from "react-icons/fa6"
import { AiFillSafetyCertificate } from "react-icons/ai"
import { RiHqFill } from "react-icons/ri"
import { TbSoupFilled } from "react-icons/tb"
import { GiBiceps } from "react-icons/gi"
import { GiManualMeatGrinder } from "react-icons/gi"
import { Category } from "@/generated/prisma/enums"

export const carouselImages = [
  '/images/shawerma.webp',
  '/images/tbond.webp',
  '/images/threeSteak.webp'
]

export const categories = [
  {
    title: "دجاج طازج",
    description: "نحن نضمن لك لحوماً بلدية 100%، مصدرها مزارعنا التي تتبع أعلى معايير التغذية الطبيعية. يتم اختيار المواشي بعناية فائقة لضمان طعم ",
    icon: GiChickenOven,
    searchParams: Category.CHICKEN
  },
  {
    title: "لحم بقري",
    description: "نحن نضمن لك لحوماً بلدية 100%، مصدرها مزارعنا التي تتبع أعلى معايير التغذية الطبيعية. يتم اختيار المواشي بعناية فائقة لضمان طعم ",
    icon: GiBuffaloHead,
    searchParams: Category.MEAT
  },
  {
    title: "مصنعات لحوم",
    description: "نحن نضمن لك لحوماً بلدية 100%، مصدرها مزارعنا التي تتبع أعلى معايير التغذية الطبيعية. يتم اختيار المواشي بعناية فائقة لضمان طعم ",
    icon: GiManualMeatGrinder,
    searchParams: Category.PROCESSED
  },
]

export const whyChooseUs = [
  {
    title: "جودة بلدية أصلية",
    description: "لحوم طازجة من مزارعنا مباشرة، تغذية طبيعية 100% بدون هرمونات لضمان الطعم البلدي الأصيل.",
    icon: RiHqFill,
  },
  {
    title: "ذبح يومي وتغليف آمن",
    description: "نذبح يومياً لضمان الطزاجة، ونغلف طلبك بأعلى معايير الجودة لضمان النظافة والحماية.",
    icon: AiFillSafetyCertificate,
  },
  {
    title: "رقابة طبية وذبح حلال",
    description: "إشراف بيطري كامل في السلخانات المعتمدة وذبح شرعي يضمن لك ولأسرتك الأمان التام.",
    icon: FaUserDoctor,
  },
  {
    title: "صحة ولياقة عالية",
    description: "اللحم البلدي الخاص بنا يعطيك كل ما يحتاجه الجسم ليصبح قويا ونشيطا.",
    icon: GiBiceps,
  },
  {
    title: "طعم لذيذ لا يقاوم",
    description: "الطعم البلدي الذي لا يقاوم اصله من التغذية الجيدة لحيواناتنا",
    icon: TbSoupFilled,
  },
]

export const delivery = [
  {
    icon: ShoppingBag,
    title: "1- اختيار المنتجات",
    description: "التجول في متجرنا واتنقاء السلع واتمام عملية الدفع.",
  },
  {
    icon: Truck,
    title: "2- الشحن والتوصيل",
    description: "يتم التوصيل من خلال عربات مجهزة وبتغليف محكم.",
  },
  {
    icon: Smile,
    title: "3- الحصول على السعادة المطلوبة",
    description: "هذا ما ستحصل عليه بعد اتمام الشراء واستخدام المنتج ",
  },
]