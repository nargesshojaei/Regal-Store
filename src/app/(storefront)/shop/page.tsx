import ShopList from "@/features/product/ShopList";
import { getCategories, getSubs } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/products";
import { toShopItem } from "@/lib/api/home"; 
//کالا و دسته‌ها را از سرور می‌گیرد و عنوان صفحه را از دسته یا زیردسته می‌سازد.
export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; subcategory?: string }>;
}) {
  const params = await searchParams;
  const categoryId = params.category ? Number(params.category) : undefined;
  const subId = params.subcategory ? Number(params.subcategory) : undefined;

  let items: ReturnType<typeof toShopItem>[] = [];
  let title = "محصولات";
  let types: { id: number; name: string; category: number }[] = [];

  try {
    const [productResult, cats, subs] = await Promise.all([
      getProducts(1, categoryId, undefined, 40),
      getCategories(),
      getSubs(),
    ]);

    const catList = cats.data || [];
    const subList = subs.data || [];
    const cat = catList.find((item) => Number(item.id) === categoryId);
    const sub = subList.find((item) => Number(item.id) === subId);

    items = (productResult.data || []).map(toShopItem);
    types = categoryId
      ? subList.filter((item) => Number(item.category) === categoryId)
      : subList;
    title = sub?.name || cat?.name || "محصولات";
  } catch {
    items = [];
  }

  return (
    <div dir="rtl" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-12 md:py-10">
      <ShopList
        items={items}
        title={title}
        types={types}
        selectedSubId={subId}
      />
    </div>
  );
}
