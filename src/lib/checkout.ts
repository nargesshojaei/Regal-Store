"use client";




// مسیر خرید:
// 1) سبد خرید
// 2) فرم اطلاعات خریدار  →  /checkout
// 3) صفحه درگاه          →  /checkout/pay
// 4) نتیجه موفق یا ناموفق →  /checkout/result
//
// اطلاعات خریدار در sessionStorage می‌ماند.
// اگر کاربر انصراف بزند، سبد پاک نمی‌شود و همان اطلاعات برای پرداخت دوباره هست.
// شماره کارت هیچ‌جا ذخیره نمی‌شود.
// فقط پرداخت موفق، سفارش را در حساب کاربر می‌نویسد و سبد را خالی می‌کند.

import { addOrder, readProfile, type AccountOrder } from "@/lib/account";
import { cartTotal, clearCart, readCart, type CartProduct } from "@/lib/cart";
import { formatToday } from "@/lib/format";

// چیزی که کاربر در فرم خرید پر می‌کند
export type BuyerInfo = {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  deliveryDate: string;
  notes: string;
  postalCode: string;
};

// پیش‌نویس خرید، تا برسیم به درگاه
export type CheckoutDraft = {
  trackingCode: string;
  buyer: BuyerInfo;
};

// بعد از پرداخت موفق، فقط کد رهگیری و مبلغ را نگه می‌داریم
export type PaymentReceipt = {
  trackingCode: string;
  totalPrice: number;
};

const DRAFT_KEY = "regal-checkout-draft";
const RECEIPT_KEY = "regal-payment-receipt";

export function emptyBuyer(): BuyerInfo {
  return {
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    deliveryDate: "",
    notes: "",
    postalCode: "",
  };
}

// متن ذخیره‌شده را به آبجکت تبدیل می‌کند. اگر خالی یا خراب باشد، null برمی‌گردد.
function readJson<T>(storage: Storage, key: string): T | null {
  const raw = storage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function readDraft(): CheckoutDraft | null {
  if (typeof window === "undefined") return null;
  const raw = readJson<CheckoutDraft>(sessionStorage, DRAFT_KEY);
  if (!raw?.buyer || !raw.trackingCode) return null;

  const buyer = raw.buyer;
  return {
    trackingCode: raw.trackingCode,
    buyer: {
      firstName: buyer.firstName || "",
      lastName: buyer.lastName || "",
      address: buyer.address || "",
      phone: buyer.phone || "",
      deliveryDate: buyer.deliveryDate || "",
      notes: buyer.notes || "",
      postalCode: buyer.postalCode || "",
    },
  };
}

export function saveDraft(draft: CheckoutDraft) {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function readReceipt(): PaymentReceipt | null {
  if (typeof window === "undefined") return null;
  return readJson<PaymentReceipt>(sessionStorage, RECEIPT_KEY);
}

// یک کد ۸ رقمی، مثل ۵۶۷۸۸۳۶۲
export function createTrackingCode() {
  const number = Math.floor(10000000 + Math.random() * 90000000);
  return String(number);
}

// input تاریخ، مقدار را به شکل 2026-09-29 می‌خواهد
export function todayISO() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return date.getFullYear() + "-" + month + "-" + day;
}

// ۱۲۳ فارسی یا عربی را به 123 انگلیسی تبدیل می‌کند
export function englishDigits(value: string) {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  let result = "";

  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    const persianIndex = persian.indexOf(char);
    const arabicIndex = arabic.indexOf(char);

    if (persianIndex !== -1) result = result + String(persianIndex);
    else if (arabicIndex !== -1) result = result + String(arabicIndex);
    else result = result + char;
  }

  return result;
}

// از متن کد پستی فقط رقم‌ها را برمی‌دارد
export function postalDigits(value: string) {
  const english = englishDigits(value);
  let digits = "";

  for (let i = 0; i < english.length; i++) {
    const char = english[i];
    if (char >= "0" && char <= "9") digits = digits + char;
  }

  return digits;
}

function toOrderItem(item: CartProduct) {
  return {
    id: item.lineId || item.id,
    name: item.name,
    image: item.image,
    count: item.count,
    price: item.price,
    discount: 0,
    color: item.color,
    colorHex: item.colorHex,
    size: item.size,
  };
}

// این تابع فقط با دکمه «پرداخت» درگاه صدا زده می‌شود.
// دکمه «انصراف» این‌جا را صدا نمی‌زند، برای همین سبد می‌ماند.
export function commitSuccessfulPayment(): PaymentReceipt | null {
  const draft = readDraft();
  const items = readCart();

  if (!draft) return null;
  if (items.length === 0) return null;

  const buyer = draft.buyer;
  const profile = readProfile();
  const fullName = (buyer.firstName + " " + buyer.lastName).trim();
  const order: AccountOrder = {
    id: draft.trackingCode,
    status: "pending",
    date: formatToday(),
    createdAt: Date.now(),
    address: buyer.address.trim(),
    shipping: 0,
    buyerName: fullName,
    phone: buyer.phone.trim() || profile.phone,
    deliveryDate: buyer.deliveryDate,
    notes: buyer.notes.trim(),
    postalCode: buyer.postalCode,
    items: items.map(toOrderItem),
  };

  addOrder(order);
  clearCart();

  const receipt: PaymentReceipt = {
    trackingCode: draft.trackingCode,
    totalPrice: cartTotal(items),
  };

  sessionStorage.setItem(RECEIPT_KEY, JSON.stringify(receipt));
  sessionStorage.removeItem(DRAFT_KEY);
  return receipt;
}
