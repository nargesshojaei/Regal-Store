import { api, apiList, fileUrl } from "./client";
// لیست/افزودن/ویرایش/حذف کالا

{/*کار با کالا.

نوع Product: id، name، image، thumbnail، price، quantity، category، subcategory، description
productPhoto → آدرس عکس از thumbnail یا اولین image
getProducts(page, category, subcategory, limit) → لیست با فیلتر دسته / زیردسته
getProduct(id) → یک کالا برای صفحه جزئیات
addProduct → POST
editProduct → PATCH
removeProduct → DELETE */}
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
  discount?: number;
  color?: string[];
  size?: string[];
  favourite?: boolean;
};

// آدرس عکس کالا روی سرور
export function productPhoto(product: Product) {
  let id = product.thumbnail;

  if (!id && product.image && product.image[0]) {
    id = product.image[0];
  }

  return fileUrl(id);
}

export async function getProducts(
  page = 1,
  category?: number,
  subcategory?: number,
  limit = PAGE_SIZE,
) {
  const params = new URLSearchParams({
    _page: String(page),
    _limit: String(limit),
    _sort: "createdAt",
    _order: "desc",
  });

  if (category) {
    params.set("category", String(category));
  }

  if (subcategory) {
    params.set("subcategory", String(subcategory));
  }

  return apiList<Product[]>(`/products?${params.toString()}`);
}

// یک کالا با آیدی، برای صفحه جزئیات
export async function getProduct(id: string | number) {
  return api<Product>(`/products/${id}`, { cache: "no-store" });
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
