import type { Order } from "@/types/order";
import { api, apiList } from "./client";
//لیست سفارش، جزئیات، ثبت تحویل
{/*fetchOrders(page, delivered, sort) → لیست فیلترشده و صفحه‌بندی‌شده
fetchOrderCount → تعداد هر وضعیت (برای عدد کنار فیلتر)
fetchOrder(id) → جزئیات یک سفارش
markOrderDelivered(id) → ثبت تحویل
 */}
export const PAGE_SIZE = 5;

export async function getOrders(
  page: number,
  delivered: boolean,
  sort: "asc" | "desc",
) {
  const params = new URLSearchParams({
    delivered: String(delivered),
    _page: String(page),
    _limit: String(PAGE_SIZE),
    _sort: "createdAt",
    _order: sort,
  });

  return apiList<Order[]>(`/orders?${params.toString()}`);
}

export async function getOrderCount(delivered: boolean) {
  const params = new URLSearchParams({
    delivered: String(delivered),
    _page: "1",
    _limit: "1",
  });

  const result = await apiList<Order[]>(`/orders?${params.toString()}`);
  return result.total;
}

export async function getOrder(id: number) {
  return api<Order>(`/orders/${id}`);
}

export async function setOrderDelivered(id: number) {
  return api<Order>(`/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ delivered: true }),
  });
}
