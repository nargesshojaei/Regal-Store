import { api, apiList, fileUrl } from "./client";
// لیست/افزودن/ویرایش/حذف کالا

{/*کار با کالا.

نوع ApiProduct: id، name، image، thumbnail، price، quantity، category، subcategory، description
productImageSrc → آدرس عکس از thumbnail یا اولین image
fetchProducts(page, category) → لیست با _page، _limit=5، اختیاری category
createProduct → POST
updateProduct → PATCH
deleteProduct → DELETE */}
export const PAGE_SIZE = 5;

export type Product = {
  id: number;
  name: string;
  brand?: string;
  image?: string[];
  thumbnail?: string;
  price: number;
  quantity: number;
  category?: number;
  subcategory?: number;
  description?: string;
  createdAt?: number;
};

// آدرس عکس کالا روی سرور
export function productPhoto(product: Product) {
  const id = product.thumbnail || product.image?.[0];
  return fileUrl(id);
}

export async function getProducts(page = 1, category?: number) {
  const params = new URLSearchParams({
    _page: String(page),
    _limit: String(PAGE_SIZE),
    _sort: "createdAt",
    _order: "desc",
  });

  if (category) {
    params.set("category", String(category));
  }

  return apiList<Product[]>(`/products?${params.toString()}`);
}

export async function addProduct(body: Omit<Product, "id">) {
  return api<Product>("/products", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function editProduct(id: number, body: Partial<Product>) {
  return api<Product>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function removeProduct(id: number) {
  return api(`/products/${id}`, { method: "DELETE" });
}
