import { MapPin, Smartphone } from "lucide-react"
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6"


export const frontNavLinks = [
  {
    title: "منتجاتنا",
    href: "/products"
  },
  {
    title: "عملائنا",
    href: "/clients"
  },
  {
    title: "مقالاتنا",
    href: "/articles",
  },
  {
    title: "weather",
    href: "/weather",
  },
  {
    title: "bot",
    href: "/bot",
  },
  {
    title: "server",
    href: "/server",
  },
]

export const socials = [
  {
    href: "https://www.facebook.com/",
    icon: FaFacebookF
  },
  {
    href: "https://www.instagram.com/",
    icon: FaInstagram
  },
  {
    href: "https://x.com/",
    icon: FaXTwitter
  },
]

export const footerData = [
  {
    icon: MapPin,
    title: "شبين الكوم - المنوفية - مصر"
  },
  {
    icon: Smartphone,
    title: "01152640142"
  },
]