"use client";
//خواندن و ذخیره پروفایل، آدرس، سفارش و وضعیت ورود را انجام می‌دهد وهوک را می‌دهد.
// حساب کاربری فروشگاه
// پروفایل، آدرس و سفارش داخل localStorage می‌مونن
// پروفایل علاوه بر مرورگر، با درخواست به json-server هم ذخیره می‌شود
// سفارش‌ها بین فروشگاه و ادمین مشترک‌اند
// تا با رفرش صفحه پاک نشن

import { useEffect, useState } from "react";

export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export type Address = {
  id: string;
  title: string;
  province: string;
  city: string;
  line: string;
  plaque: string;
  unit: string;
  postalCode: string;
  receiver: string;
  phone: string;
  isDefault: boolean;
  mapText: string;
};

// وضعیت سفارش بین فروشگاه و ادمین یکی است
// pending = هنوز تحویل نشده، delivered = ادمین تحویل را ثبت کرده
export type OrderStatus = "pending" | "delivered";

export type AccountOrderItem = {
  id: string;
  name: string;
  image: string;
  count: number;
  price: number;
  discount: number;
  color?: string;
  colorHex?: string;
  size?: string;
};

export type AccountOrder = {
  id: string;
  status: OrderStatus;
  date: string;
  address: string;
  shipping: number;
  items: AccountOrderItem[];
  buyerName?: string;
  phone?: string;
  job?: string;
  deliveryDate?: string;
  notes?: string;
  postalCode?: string;
  createdAt?: number;
};

const PROFILE_KEY = "regal-profile";
const ADDRESS_KEY = "regal-addresses";
const ORDER_KEY = "regal-orders";
const LOGIN_KEY = "regal-logged-in";
const EVENT = "regal-account-change";

const emptyProfile: Profile = {
  id: "",
  firstName: "",
  lastName: "",
  phone: "09126636537",
  email: "",
};

// به بقیه تب‌ها و کامپوننت‌ها خبر می‌دیم که دیتا عوض شده
function notify() {
  window.dispatchEvent(new Event(EVENT));
}

function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// بار اول که کاربر میاد، یک پروفایل خالی با شماره نمونه ذخیره می‌کنیم
export function readProfile(): Profile {
  const saved = readJson<Profile>(PROFILE_KEY);
  if (!saved) {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(emptyProfile));
    return emptyProfile;
  }
  return { ...emptyProfile, ...saved };
}

export function saveProfile(profile: Profile) {
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  notify();
}

// اسم کنار آواتار. اگه اسم نداشته باشه همون «کاربر رگال» می‌مونه
export function profileName(profile: Profile) {
  const full = `${profile.firstName} ${profile.lastName}`.trim();
  if (full) return full;
  return "کاربر رگال";
}

// 0912... رو شبیه طرح به شکل +98 نشون می‌دیم
export function showPhone(phone: string) {
  if (!phone) return "وارد نشده است";
  if (phone.startsWith("+98")) return phone;
  if (phone.startsWith("0")) return `+98${phone.slice(1)}`;
  return phone;
}

function starterAddress(): Address {
  return {
    id: "home-1",
    title: "خانه",
    province: "تهران",
    city: "تهران",
    line: "نیاوران، خیابان باهنر، کوچه گلستان",
    plaque: "۱۲",
    unit: "۳",
    postalCode: "۱۹۸۷۶۵۴۳۲۱",
    receiver: "کاربر رگال",
    phone: "09126636537",
    isDefault: true,
    mapText: "تهران، نیاوران، خیابان باهنر",
  };
}

export function readAddresses(): Address[] {
  const saved = readJson<Address[]>(ADDRESS_KEY);
  // null یعنی هنوز کلیدی نبوده، پس نمونه رو می‌ذاریم
  // آرایه خالی یعنی کاربر خودش همه رو پاک کرده
  if (!saved) {
    const first = [starterAddress()];
    window.localStorage.setItem(ADDRESS_KEY, JSON.stringify(first));
    return first;
  }
  return saved;
}

export function saveAddress(address: Address) {
  const list = readAddresses();
  const index = list.findIndex((item) => item.id === address.id);
  let next = list.slice();

  if (index === -1) {
    next.push(address);
  } else {
    next[index] = address;
  }

  // فقط یک آدرس می‌تونه پیش‌فرض باشه
  if (address.isDefault) {
    next = next.map((item) => {
      return { ...item, isDefault: item.id === address.id };
    });
  }

  window.localStorage.setItem(ADDRESS_KEY, JSON.stringify(next));
  notify();
}

export function removeAddress(id: string) {
  const next = readAddresses().filter((item) => item.id !== id);
  window.localStorage.setItem(ADDRESS_KEY, JSON.stringify(next));
  notify();
}

// متن یک‌خطی آدرس برای کارت
// اگه خود آدرس از قبل اسم شهر را داشته باشد، دوباره تکرار نمی‌شود
export function addressText(address: Address) {
  let text = address.line || "";

  if (text.indexOf(address.city) === -1) {
    text = `${address.province}، ${address.city}، ${text}`;
  }

  if (address.plaque) text = text + "، پلاک " + address.plaque;
  if (address.unit) text = text + "، واحد " + address.unit;
  return text;
}

// سفارش‌های ساختگی قبلی را دیگر نشان نمی‌دهیم
const SAMPLE_IDS = ["ord-1001", "ord-1002", "ord-1003"];

function cleanStatus(status: string): OrderStatus {
  if (status === "delivered") return "delivered";
  return "pending";
}

// لیست واقعی سفارش‌ها. فروشگاه و ادمین هر دو همین را می‌خوانند.
export function readOrders(): AccountOrder[] {
  const saved = readJson<AccountOrder[]>(ORDER_KEY);
  if (!saved) return [];

  const next: AccountOrder[] = [];
  let changed = false;

  for (let i = 0; i < saved.length; i++) {
    const order = saved[i];
    if (SAMPLE_IDS.indexOf(order.id) !== -1) {
      changed = true;
      continue;
    }

    const status = cleanStatus(order.status);
    if (status !== order.status) changed = true;
    next.push({ ...order, status });
  }

  if (changed) {
    window.localStorage.setItem(ORDER_KEY, JSON.stringify(next));
  }

  return next;
}

// سفارش تازه را بالای لیست می‌گذارد.
// اگر همان کد رهگیری قبلاً ذخیره شده باشد، دوباره اضافه نمی‌شود.
export function addOrder(order: AccountOrder) {
  const list = readOrders();
  const alreadySaved = list.some((item) => item.id === order.id);
  if (alreadySaved) return;

  const next = [order, ...list];
  window.localStorage.setItem(ORDER_KEY, JSON.stringify(next));
  notify();
}

// ادمین با این تابع وضعیت را «تحویل شده» می‌کند
// چون هر دو صفحه همین لیست را می‌خوانند، فروشگاه هم عوض می‌شود
export function markOrderDelivered(id: string) {
  const list = readOrders();
  const next = list.map((order) => {
    if (order.id !== id) return order;
    return { ...order, status: "delivered" as const };
  });

  window.localStorage.setItem(ORDER_KEY, JSON.stringify(next));
  notify();
}

// تخفیف کل یک سفارش
export function orderDiscount(order: AccountOrder) {
  let sum = 0;
  for (let i = 0; i < order.items.length; i++) {
    sum = sum + order.items[i].discount;
  }
  return sum;
}

// مبلغی که مشتری پرداخته
export function orderPaid(order: AccountOrder) {
  let sum = order.shipping;
  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i];
    sum = sum + item.price * item.count - item.discount;
  }
  return sum;
}

export function readLoggedIn() {
  const value = window.localStorage.getItem(LOGIN_KEY);
  if (value === null) {
    window.localStorage.setItem(LOGIN_KEY, "yes");
    return true;
  }
  return value === "yes";
}

export function setLoggedIn(value: boolean) {
  window.localStorage.setItem(LOGIN_KEY, value ? "yes" : "no");
  notify();
}

// هوک ساده: هر بار دیتا عوض شد دوباره از لوکال می‌خونیم
function useSaved<T>(read: () => T) {
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    function sync() {
      setValue(read());
    }

    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [read]);

  return value;
}

export function useProfile() {
  return useSaved(readProfile);
}

export function useAddresses() {
  return useSaved(readAddresses);
}

export function useOrders() {
  return useSaved(readOrders);
}

export function useLoggedIn() {
  return useSaved(readLoggedIn);
}
