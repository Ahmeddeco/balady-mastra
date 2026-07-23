import { Category } from "@/generated/prisma/enums"
import { AiFillSafetyCertificate } from "react-icons/ai"
import { FaUserDoctor } from "react-icons/fa6"
import { GiBiceps, GiBuffaloHead, GiChickenOven, GiManualMeatGrinder } from "react-icons/gi"
import { RiHqFill } from "react-icons/ri"
import { TbSoupFilled } from "react-icons/tb"

export const arDic = {
  homePage: {
    hero: {
      title: "بلدي",
      titleBr: "خبراء اللحوم",
      subTitle: "	نحن نضمن لك لحوماً بلدية 100%، مصدرها مزارعنا التي تتبع أعلى معايير التغذية الطبيعية. يتم اختيار المواشي بعناية فائقة لضمان طعم غني وقيمة غذائية عالية، بعيداً عن أي هرمونات أو إضافات صناعية.",
      bottomCard: {
        first: "طن من اللحوم كل شهر",
        second: "نوع من منتجات اللحوم"
      }
    },
    categoriesSection: {
      title: "نحن نقدم لحوم ",
      titleBr: "من أجود الأنواع.",
      categories: [
        {
          title: "دجاج طازج",
          description: "نقدم لكم دجاجاً طازجاً من المزرعة بأعلى جودة، ومُعداً بعناية فائقة ويوميّاً لضمان أفضل مذاق وأعلى طعم.",
          icon: GiChickenOven,
          searchParams: Category.chicken
        },
        {
          title: "لحم بقري",
          description: "نختار لكم أجوَد قطعيات اللحم البقري الطازج، والمُعدة بمهارة والمُعتقة بعناية لضمان طراوة لا تُضاهى وطعم غني.",
          icon: GiBuffaloHead,
          searchParams: Category.meat
        },
        {
          title: "مصنعات لحوم",
          description: "نطبق أعلى معايير السلامة والحرفية في تصنيع وتجهيز اللحوم، لنقدم منتجات مُقطعة ومُتبلة ومُغلفة بكل مهارة.",
          icon: GiManualMeatGrinder,
          searchParams: Category.processed
        },
      ]
    },
    whyChooseUsSection: {
      title: "لماذا تختار منتجاتنا؟",
      whyChooseUs: [
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
    },
  },
}