import { getAccessTokenFromBrowser } from "@/lib/auth/access-token";
//fetch مشترک، هدر token، آدرس عکس

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

export function fileUrl(fileId?: string) {
  if (!fileId) return undefined;
  if (fileId.startsWith("http")) return fileId;
  if (fileId.startsWith("/")) return `${API_URL}${fileId}`;
  return `${API_URL}/files/${fileId}`;
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

export async function apiList<T>(path: string) {
  const response = await send(path);
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
