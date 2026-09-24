import { getAccessTokenFromBrowser } from "@/lib/auth/access-token";
//fetch مشترک، هدر token، آدرس عکس
//درس API، ساخت لینک عکس و fetch مشترک با هدر توکن است. برای آپلود، هدر JSON نمی‌گذارد تا فایل
{/*
پایه همه درخواست‌ها.

getApiUrl() → آدرس سرور
fileUrl(id) → http://localhost:3002/files/xxx برای عکس
send() → توکن را در هدر token می‌گذارد؛ برای آپلود Content-Type: json نمی‌گذارد تا FormData خراب نشود
api() → یک رکورد (GET یک کالا، POST، PATCH، DELETE)
apiList() → لیست + تعداد کل از هدر X-Total-Count (برای pagination) */}
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002";

export function getApiUrl() {
  return API_URL;
}

// آدرس عکس روی سرور
export function fileUrl(id?: string) {
  if (!id) return undefined;
  if (id.startsWith("http")) return id;
  if (id.startsWith("blob:")) return id;
  if (id.startsWith("/")) return `${API_URL}${id}`;
  return `${API_URL}/files/${id}`;
}

async function send(path: string, options?: RequestInit) {
  const token = getAccessTokenFromBrowser();
  const isFormData =
    typeof FormData !== "undefined" && options?.body instanceof FormData;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { token } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${path}`);
  }

  return response;
}

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await send(path, options);
  const text = await response.text();
  if (!text) return undefined as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

export async function apiList<T>(path: string, options?: RequestInit) {
  const response = await send(path, { cache: "no-store", ...options });
  const data = (await response.json()) as T;
  const raw =
    response.headers.get("X-Total-Count") ??
    response.headers.get("x-total-count");
  const fromHeader = raw ? Number(raw) : NaN;

  return {
    data,
    total: Number.isFinite(fromHeader)
      ? fromHeader
      : Array.isArray(data)
        ? data.length
        : 0,
  };
}
