import { api, apiList, cleanFileId, fileUrl } from "./client";
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

// thumbnail و image را به یک لیست شناسه تبدیل می‌کند.
// اگر سرور عکس‌ها را رشته، آرایه یا آبجکت برگرداند، عکس دوم هم از قلم نمی‌افتد.
export function imageIds(product: { image?: unknown; thumbnail?: unknown }) {
  const ids: string[] = [];

  function add(value: unknown) {
    if (Array.isArray(value)) {
      value.forEach(add);
      return;
    }

    if (typeof value === "string") {
      const text = value.trim();
      if (text.startsWith("[")) {
        try {
          add(JSON.parse(text));
          return;
        } catch {
          // متن معمولی است
        }
      }
      if (text.includes(",") && !text.startsWith("http") && !text.startsWith("blob:")) {
        text.split(",").forEach(add);
        return;
      }
    }

    const id = cleanFileId(value);
    if (!id || ids.includes(id)) return;
    ids.push(id);
  }

  add(product.thumbnail);
  add(product.image);
  return ids;
}

// آدرس عکس کالا روی سرور
export function productPhoto(product: Product) {
  return fileUrl(imageIds(product)[0]);
}

export function productPhotoUrls(product: Product) {
  return imageIds(product)
    .map((id) => fileUrl(id))
    .filter((url): url is string => Boolean(url));
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
