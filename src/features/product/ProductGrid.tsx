import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";
//کالاها را در شبکه دو ستونه موبایل و چهار ستونه دسکتاپ می‌چیند.
export default function ProductGrid({
  products,
}: {
  products: Product[];
  scroll?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
