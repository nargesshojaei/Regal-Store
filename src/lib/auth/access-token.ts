//خواندن توکن از cookie
// اسم cookie که accessToken داخلش ذخیره می‌شود
export const ADMIN_ACCESS_TOKEN_COOKIE = "regal-access-token";

// در Client Component توکن را از cookie مرورگر می‌خوانیم.
export function getAccessTokenFromBrowser() {
  if (typeof document === "undefined") return undefined;

  const prefix = `${ADMIN_ACCESS_TOKEN_COOKIE}=`;
  const row = document.cookie
    .split("; ")
    .find((part) => part.startsWith(prefix));

  if (!row) return undefined;
  return decodeURIComponent(row.slice(prefix.length));
}
