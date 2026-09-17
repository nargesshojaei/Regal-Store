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
