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

// شناسه عکس ممکن است رشته، عدد، یا آبجکت پاسخ آپلود باشد
export function cleanFileId(value: unknown): string | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);

  if (typeof value === "string") {
    const text = value.trim().replace(/^["']|["']$/g, "");
    if (!text || text === "[object Object]") return undefined;
    return text;
  }

  if (value && typeof value === "object") {
    const row = value as Record<string, unknown>;
    return (
      cleanFileId(row.filename) ||
      cleanFileId(row.thumbnail) ||
      cleanFileId(row.url) ||
      cleanFileId(row.path) ||
      cleanFileId(row.src) ||
      cleanFileId(row.file) ||
      cleanFileId(row.data) ||
      cleanFileId(row.name) ||
      cleanFileId(row.id)
    );
  }

  return undefined;
}

function uniqueUrls(urls: string[]) {
  return urls.filter((url, index) => url && urls.indexOf(url) === index);
}

// اگر عکس دوم با مسیر متفاوت ذخیره شده باشد، چند آدرس امتحان می‌شود
export function fileCandidates(value: unknown): string[] {
  const clean = cleanFileId(value);
  if (!clean) return [];
  if (clean.startsWith("blob:") || clean.startsWith("data:")) return [clean];

  if (clean.startsWith("http")) {
    try {
      const url = new URL(clean);
      const name = decodeURIComponent(url.pathname.split("/").filter(Boolean).pop() || "");
      if (!name) return [clean];
      return uniqueUrls([
        clean,
        `${API_URL}/files/${name}`,
        `${API_URL}/uploads/${name}`,
      ]);
    } catch {
      return [clean];
    }
  }

  if (clean.startsWith("/")) return [`${API_URL}${clean}`];

  const name = clean.split(/[/\\]/).filter(Boolean).pop() || clean;
  return uniqueUrls([
    `${API_URL}/files/${clean}`,
    `${API_URL}/files/${name}`,
    `${API_URL}/uploads/${name}`,
    `${API_URL}/${clean}`,
  ]);
}

// آدرس اصلی عکس روی سرور
export function fileUrl(id?: unknown) {
  return fileCandidates(id)[0];
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
