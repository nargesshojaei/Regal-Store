import type { BlogPost } from "@/types";
//سه مقاله را تعریف می‌کند.
export const blogPosts: BlogPost[] = [
  {
    id: "seasonal-style",
    title: "انتخاب لباس زنانه در هر فصل",
    excerpt:
      "برای هر فصل چه پارچه، رنگ و برشی مناسب‌تر است و چطور کمد را بدون خرید اضافه به‌روز نگه دارید.",
    date: "۱۴۰۳/۱۲/۱۸",
    author: "تحریریه رگال",
    image: "",
    href: "/blog/seasonal-style",
  },
  {
    id: "everyday-tricks",
    title: "چند ترفند برای استایل روزمره",
    excerpt:
      "با چند لایه ساده، یک کمربند درست و کفش مناسب، همان لباس‌های همیشگی را تازه و مرتب نشان دهید.",
    date: "۱۴۰۳/۱۲/۱۲",
    author: "استایلیست رگال",
    image: "",
    href: "/blog/everyday-tricks",
  },
  {
    id: "color-effect",
    title: "تاثیر رنگ‌ها در استایل شخصی",
    excerpt:
      "رنگ‌های خنثی، نود و متالیک چطور فرم بدن را متعادل می‌کنند و کدام ترکیب برای مهمانی مناسب‌تر است.",
    date: "۱۴۰۳/۱۲/۰۵",
    author: "تحریریه رگال",
    image: "",
    href: "/blog/color-effect",
  },
];
