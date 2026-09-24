import type { Category } from "@/types";
import CategoryCard from "@/features/category/CategoryCard";
import SectionHeading from "@/ui/SectionHeading";

// در دسکتاپ ۴ ستون و ۳ ردیف کاملاً هم‌اندازه داریم.
// بعضی کارت‌ها طبق طرح، ۲ یا ۳ ردیف را می‌گیرند.
const desktopSpan = [
  "",
  "",
  "",
  "lg:row-span-3",
  "lg:row-span-2",
  "",
  "lg:row-span-2",
  "",
];

export default function Categories({ items = [] }: { items?: Category[] }) {
  const cards = items.slice(0, 8);

  return (
    <section dir="rtl" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeading title="دسته‌بندی محصولات" />

        {cards.length === 0 ? (
          <p className="mt-10 text-sm text-neutral-09">دسته‌بندی‌ای پیدا نشد.</p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:h-[680px] lg:grid-cols-4 lg:grid-rows-3 lg:gap-5">
            {cards.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                className={`min-h-[200px] lg:min-h-0 ${desktopSpan[index] || ""}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
