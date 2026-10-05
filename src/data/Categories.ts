import type { Category } from "@/types";
import { unsplash } from "./images";
//دسته‌های نمایشی صفحه خانه را با عکس و لینک نگه می‌دارد.
export const categories: Category[] = [
  {
    id: "crop-top",
    name: "تاپ و کراپ",
    subtitle: "کالکشن تابستانه",
    href: "/shop",
    image: unsplash("photo-1617019114583-affb34d1b3cd", 700),
  },
  {
    id: "blazer",
    name: "کت و جلیقه",
    subtitle: "استایل رسمی",
    href: "/shop",
    image: unsplash("photo-1594633313593-bab3825d0caf", 700),
  },
  {
    id: "trousers",
    name: "شلوار",
    subtitle: "روزمره و اداری",
    href: "/shop",
    image: unsplash("photo-1594633312681-425c7b97ccd1", 700),
  },
  {
    id: "shirt",
    name: "شومیز",
    subtitle: "مینیمال و شیک",
    href: "/shop",
    image: unsplash("photo-1603252109360-909baaf261c7", 700),
  },
  {
    id: "coat",
    name: "پالتو",
    subtitle: "پاییز و زمستان",
    href: "/shop",
    image: unsplash("photo-1539109136881-3be0616acf24", 700),
  },
  {
    id: "skirt",
    name: "دامن",
    subtitle: "کوتاه و بلند",
    href: "/shop",
    image: unsplash("photo-1583496661160-fb5886a0aaaa", 700),
  },
  {
    id: "slip",
    name: "سارافون",
    subtitle: "راحت و خاص",
    href: "/shop",
    image: unsplash("photo-1496747611176-843222e1e57c", 700),
  },
  {
    id: "short-dress",
    name: "پیراهن کوتاه",
    subtitle: "مجلسی و روزانه",
    href: "/shop",
    image: unsplash("photo-1539008835657-9e8e9680c956", 700),
  },
  {
    id: "trench",
    name: "کت و بارانی",
    subtitle: "لایه رویی",
    href: "/shop",
    image: unsplash("photo-1487222477894-8943e31ef7b2", 700),
  },
  {
    id: "set",
    name: "شومیز و دامن",
    subtitle: "ست هماهنگ",
    href: "/shop",
    image: unsplash("photo-1572804013309-59a88b7e92f1", 700),
  },
  {
    id: "jumpsuit",
    name: "سرهمی",
    subtitle: "یک‌تکه مدرن",
    href: "/shop",
    image: unsplash("photo-1581044777550-4cfa60707c03", 700),
  },
  {
    id: "maxi",
    name: "پیراهن ماکسی",
    subtitle: "بلند و شیک",
    href: "/shop",
    image: unsplash("photo-1595777457583-95e059d581b8", 700),
  },
];
