import { notFound } from "next/navigation";
import { getCategories, getSubs, type Category, type Sub } from "@/lib/api/categories";
import { toCardProduct, toDetailProduct } from "@/lib/api/home";
import { getProduct, getProducts } from "@/lib/api/products";
import ProductDetail from "@/features/product/ProductDetail";
import type { Product } from "@/types/product";

export const dynamic = "force-dynamic";

// صفحه جزئیات کالا
// آدرس: /shop/12  →  12 همان آیدی کالاست
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product;
  try {
    product = await getProduct(slug);
  } catch {
    notFound();
  }

  if (!product || !product.id) {
    notFound();
  }

  let categoryList: Category[] = [];
  let subList: Sub[] = [];
  let similar: Product[] = [];

  try {
    const [cats, subs, related] = await Promise.all([
      getCategories(),
      getSubs(),
      getProducts(1, product.category, undefined, 8),
    ]);

    categoryList = cats.data || [];
    subList = subs.data || [];
    similar = (related.data || [])
      .filter((item) => Number(item.id) !== Number(product.id))
      .slice(0, 4)
      .map(toCardProduct);
  } catch {
    categoryList = [];
    subList = [];
    similar = [];
  }

  const detail = toDetailProduct(product, categoryList, subList);

  return <ProductDetail product={detail} similar={similar} />;
}
