import { api, apiList } from "./client";
import type { Product } from "./products";
{/*fetchInventory(page) → همان محصولات با pagination ۵ تایی
updateInventory(id, price, quantity) → PATCH /products/:id */}
export const PAGE_SIZE = 5;

export async function getInventory(page = 1) {
  const params = new URLSearchParams({
    _page: String(page),
    _limit: String(PAGE_SIZE),
    _sort: "createdAt",
    _order: "desc",
  });

  return apiList<Product[]>(`/products?${params.toString()}`);
}

export async function saveInventory(id: number, price: number, quantity: number) {
  return api<Product>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ price, quantity }),
  });
}
