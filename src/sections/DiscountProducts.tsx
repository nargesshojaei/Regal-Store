import { Percent } from "lucide-react";
import type { Product } from "@/types/product";
import ProductCard from "@/features/product/ProductCard";
import SectionHeading from "@/ui/SectionHeading";
//چهار کالای تخفیف‌دار صفحه خانه را نشان می‌دهد.
export default function DiscountProducts({
  products = [],
}: {
  products?: Product[];
}) {
  // ۴ ستون هم‌اندازه مثل طرح
  const cards = products.slice(0, 4);

  return (
    <section dir="rtl" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex items-center gap-2">
          <SectionHeading title="محصولات تخفیف‌دار" />
          <Percent className="size-4 text-primary" strokeWidth={1.75} />
        </div>

        {cards.length === 0 ? (
          <p className="mt-10 text-sm text-neutral-09">کالای تخفیف‌داری پیدا نشد.</p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {cards.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
