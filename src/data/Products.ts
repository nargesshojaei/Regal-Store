import type { Product } from "@/types/product";
import { unsplash } from "./images";
//کالاهای نمونه محلی است؛ علاقه‌مندی و سفارش حساب از همین‌ها استفاده می‌کنند.
export const products: Product[] = [
  {
    id: "peach-dress",
    name: "پیراهن مجلسی هلویی",
    category: "مجلسی",
    price: 2354000,
    originalPrice: 2942500,
    discountPercent: 20,
    stock: 8,
    image: unsplash("photo-1550614000-889865f26852", 800),
    description: "پیراهن بدون آستین با برش دقیق و پارچه لطیف هلویی.",
    colors: [
      { name: "هلویی", hex: "#e8b4a0" },
      { name: "کرم", hex: "#d9c4b0" },
      { name: "مشکی", hex: "#1a1a1a" },
    ],
  },
  {
    id: "black-dress",
    name: "پیراهن کوتاه مشکی",
    category: "مجلسی",
    price: 2890000,
    originalPrice: 3400000,
    discountPercent: 15,
    stock: 6,
    image: unsplash("photo-1612336307429-8a8987206736", 800),
    description: "پیراهن کوتاه مشکی با جزئیات دانتل برای مهمانی‌های شبانه.",
    colors: [
      { name: "مشکی", hex: "#111111" },
      { name: "نقره‌ای", hex: "#c5c5c5" },
      { name: "کرم", hex: "#d8cbb8" },
    ],
  },
  {
    id: "white-dress",
    name: "پیراهن سفید شانه‌باز",
    category: "مجلسی",
    price: 3200000,
    originalPrice: 4000000,
    discountPercent: 20,
    stock: 5,
    image: unsplash("photo-1539008835657-9e8e9680c956", 800),
    description: "پیراهن سفید مینیمال با یقه یک‌طرفه و برش پاکیزه.",
    colors: [
      { name: "سفید", hex: "#f4f1ec" },
      { name: "کرم", hex: "#e6d7c3" },
    ],
  },
  {
    id: "mint-dress",
    name: "پیراهن سبز نعنایی",
    category: "مجلسی",
    price: 2130000,
    originalPrice: 2506000,
    discountPercent: 15,
    stock: 7,
    image: unsplash("photo-1496747611176-843222e1e57c", 800),
    description: "پیراهن یک‌شانه با دامن نرم و رنگ ملایم.",
    colors: [
      { name: "نعنایی", hex: "#c5d5c0" },
      { name: "سفید", hex: "#f3f3f3" },
      { name: "زیتونی", hex: "#8a8f6a" },
    ],
  },
];

export const discountProducts = products;
