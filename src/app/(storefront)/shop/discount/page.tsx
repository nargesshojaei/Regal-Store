import { getHomeCatalog } from "@/lib/api/home";
import ProductGrid from "@/features/product/ProductGrid";
//صفحه کامل کالاهای تخفیف‌دار است.
export const dynamic = "force-dynamic";

export default async function DiscountPage() {
  const catalog = await getHomeCatalog();

  return (
    <div dir="rtl" className="mx-auto max-w-7xl px-6 py-12 md:px-12">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-black">محصولات تخفیف‌دار</h1>
        <span className="size-1.5 rounded-full bg-black" />
      </div>

      {catalog.discountProducts.length === 0 ? (
        <p className="mt-10 text-sm text-neutral-09">کالای تخفیف‌داری پیدا نشد.</p>
      ) : (
        <div className="mt-8">
          <ProductGrid products={catalog.discountProducts} />
        </div>
      )}
    </div>
  );
}
