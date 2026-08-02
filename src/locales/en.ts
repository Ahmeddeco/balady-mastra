import { Category } from "@/generated/prisma/enums"
import { ShoppingBag, Smile, Truck } from "lucide-react"
import { AiFillSafetyCertificate } from "react-icons/ai"
import { FaUserDoctor } from "react-icons/fa6"
import { GiBiceps, GiBuffaloHead, GiChickenOven, GiManualMeatGrinder } from "react-icons/gi"
import { RiHqFill } from "react-icons/ri"
import { TbSoupFilled } from "react-icons/tb"

export const enDic = {
  homePage: {
    hero: {
      title: "balady",
      titleBr: "Meat experts",
      subTitle: "We guarantee 100% locally sourced meat, sourced from our farms that adhere to the highest standards of natural feeding. Our livestock is carefully selected to ensure rich flavor and high nutritional value, free from any hormones or artificial additives.",
      bottomCard: {
        first: "ton of meat every month",
        second: "A type of meat product"
      }
    },
    categoriesSection: {
      title: "We offer meat",
      titleBr: "One of the finest types.",
      categories: [
        {
          title: "Fresh chicken",
          description: "We provide premium, farm-fresh chicken, expertly prepared and delivered daily to ensure the highest quality and best taste.",
          icon: GiChickenOven,
          searchParams: Category.chicken
        },
        {
          title: "Beef",
          description: "We select the finest cuts of fresh beef, expertly prepared and aged to perfection for unmatched tenderness and rich flavor.",
          icon: GiBuffaloHead,
          searchParams: Category.meat
        },
        {
          title: "Meat processing",
          description: "We apply the highest standards of safety and craftsmanship in meat processing, delivering expertly cut, seasoned, and packaged products.",
          icon: GiManualMeatGrinder,
          searchParams: Category.processed
        },
      ]
    },
    whyChooseUsSection: {
      title: "Why choose our products?",
      whyChooseUs: [
        {
          title: "Original municipal quality",
          description: "Fresh meat from our farms, 100% natural feeding to guarantee the perfect taste.",
          icon: RiHqFill,
        },
        {
          title: "Daily slaughter and secure packaging",
          description: "We slaughter daily to ensure freshness, and we package orders to the highest quality.",
          icon: AiFillSafetyCertificate,
        },
        {
          title: "Medical supervision and halal slaughter",
          description: "Full slaughter halal in slaughterhouses and  slaughtering ensures complete safety.",
          icon: FaUserDoctor,
        },
        {
          title: "High health and fitness",
          description: "Our local meat gives you everything your body needs to become strong and energetic.",
          icon: GiBiceps,
        },
        {
          title: "An irresistible, delicious taste",
          description: "The irresistible local taste originates from the good nutrition of our animals.",
          icon: TbSoupFilled,
        },
      ]
    },
    deliverySection: {
      title: "Stages of the purchasing process",
      delivery: [
        {
          icon: ShoppingBag,
          title: "1- Product selection",
          description: "Browse our store, select items, and complete the payment process.",
        },
        {
          icon: Truck,
          title: "2- Shipping and Delivery",
          description: "Delivery is done via equipped vehicles and securely packaged.",
        },
        {
          icon: Smile,
          title: "3- Achieving the desired happiness",
          description: "This is what you will receive after completing the purchase and using the product.",
        },
      ]
    },
  },
}