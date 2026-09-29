import type { FeaturedGroup } from "@/lib/api/home";
import ProductCard from "@/features/product/ProductCard";
import SectionHeading from "@/ui/SectionHeading";

//بالای نظرات، چهار کالای پیراهن کوتاه و چهار کالای شومیز را مثل ردیف تخفیف‌دار نشان می‌دهد.
export default function FeaturedCategories({
  groups = [],
}: {
  groups?: FeaturedGroup[];
}) {
  const visible = groups.filter((group) => group.products.length > 0);
  if (visible.length === 0) return null;

  return (
    <section dir="rtl" className="bg-white py-16 md:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-6 md:gap-20 md:px-12">
        {visible.map((group) => (
          <div key={group.title}>
            <SectionHeading title={group.title} />
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
              {group.products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
