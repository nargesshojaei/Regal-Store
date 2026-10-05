// فرمت قیمت و تاریخ فارسی
{/*formatPrice → عدد با رقم فارسی (مثل ۱۲٬۰۰۰)
formatDate → تاریخ شمسی به وقت تهران */}
export function formatPrice(value: number | string) {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat("fa-IR").format(amount);
}

export function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone: "Asia/Tehran",
  }).format(new Date(timestamp));
}

// 123 را به ۱۲۳ تبدیل می‌کند
export function faDigits(value: string | number) {
  const english = "0123456789";
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const text = String(value);
  let result = "";

  for (let i = 0; i < text.length; i++) {
    const index = english.indexOf(text[i]);
    if (index === -1) result = result + text[i];
    else result = result + persian[index];
  }

  return result;
}

// تاریخ فرم مثل 2026-09-29 را به متن فارسی تبدیل می‌کند
export function formatLongDate(iso: string) {
  const parts = iso.split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (!year || !month || !day) return iso;

  // در جاوااسکریپت ماه از صفر شروع می‌شود، برای همین یکی کم می‌کنیم
  return new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(year, month - 1, day));
}

// تاریخ امروز برای کارت سفارش در حساب کاربر
export function formatToday() {
  return new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}
