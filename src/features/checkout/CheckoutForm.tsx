"use client";

// فرم اطلاعات خریدار.
// اگر فرم درست باشد، پیش‌نویس ذخیره می‌شود و کاربر می‌رود صفحه درگاه.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CheckoutSteps from "@/features/checkout/CheckoutSteps";
import JalaliDateField from "@/ui/JalaliDateField";
import { readProfile } from "@/lib/account";
import { useCart, type CartProduct } from "@/lib/cart";
import {
  createTrackingCode,
  emptyBuyer,
  postalDigits,
  readDraft,
  saveDraft,
  todayISO,
  type BuyerInfo,
} from "@/lib/checkout";
import { faDigits, formatLongDate, formatPrice } from "@/lib/format";

const fieldClass =
  "h-11 w-full rounded-lg border border-neutral-03 bg-white px-3 text-sm text-black outline-none transition-colors placeholder:text-neutral-08 focus:border-primary";

// برای هر فیلد یا متن خطا هست، یا هیچی
type FieldErrors = {
  firstName?: string;
  lastName?: string;
  address?: string;
  phone?: string;
  deliveryDate?: string;
  postalCode?: string;
};

const FIELD_ORDER: Array<keyof FieldErrors> = [
  "firstName",
  "lastName",
  "phone",
  "postalCode",
  "address",
  "deliveryDate",
];

function isMobile(value: string) {
  const digits = postalDigits(value);
  return digits.length === 11 && digits.startsWith("09");
}

function validate(form: BuyerInfo) {
  const errors: FieldErrors = {};
  const postal = postalDigits(form.postalCode);

  if (!form.firstName.trim()) errors.firstName = "نام را وارد کنید.";
  if (!form.lastName.trim()) errors.lastName = "نام خانوادگی را وارد کنید.";
  if (form.address.trim().length < 10) errors.address = "آدرس را کامل بنویسید.";
  if (!isMobile(form.phone)) errors.phone = "شماره تلفن را با ۱۱ رقم و شروع ۰۹ وارد کنید.";

  if (!form.deliveryDate) {
    errors.deliveryDate = "تاریخ تحویل را از تقویم انتخاب کنید.";
  } else if (form.deliveryDate < todayISO()) {
    errors.deliveryDate = "تاریخ تحویل نمی‌تواند گذشته باشد.";
  }

  if (postal.length !== 10) errors.postalCode = "کد پستی باید ۱۰ رقم باشد.";

  return errors;
}

function hasAnyError(errors: FieldErrors) {
  const messages = Object.values(errors);
  for (let i = 0; i < messages.length; i++) {
    if (messages[i]) return true;
  }
  return false;
}

export default function CheckoutForm() {
  const router = useRouter();
  const cart = useCart();
  const [form, setForm] = useState<BuyerInfo | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  // اگر کاربر از درگاه برگشته باشد، همان اطلاعات قبلی را نشان بده
  useEffect(() => {
    const draft = readDraft();
    if (draft) {
      setForm(draft.buyer);
      return;
    }

    const profile = readProfile();
    const nextForm = emptyBuyer();
    nextForm.firstName = profile.firstName;
    nextForm.lastName = profile.lastName;
    nextForm.phone = profile.phone;
    setForm(nextForm);
  }, []);

  function update(key: keyof BuyerInfo, value: string) {
    setForm((current) => {
      if (!current) return current;
      return { ...current, [key]: value };
    });

    // خطای همان فیلد را پاک کن تا کاربر دوباره ببیند
    setErrors((current) => {
      return { ...current, [key]: undefined };
    });
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!form) return;
    if (cart.items.length === 0) return;

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (hasAnyError(nextErrors)) {
      const firstKey = FIELD_ORDER.find((key) => nextErrors[key]);
      window.setTimeout(() => {
        const node = document.getElementById(`checkout-${firstKey}`);
        node?.scrollIntoView({ behavior: "smooth", block: "center" });
        const focusable = node?.querySelector("input, textarea, button");
        if (focusable instanceof HTMLElement) focusable.focus();
      }, 0);
      return;
    }

    const previous = readDraft();
    let trackingCode = createTrackingCode();
    if (previous) trackingCode = previous.trackingCode;

    saveDraft({
      trackingCode,
      buyer: {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        address: form.address.trim(),
        phone: postalDigits(form.phone),
        deliveryDate: form.deliveryDate,
        notes: form.notes.trim(),
        postalCode: postalDigits(form.postalCode),
      },
    });

    router.push("/checkout/pay");
  }

  // تا وقتی سبد از localStorage خوانده نشده، خالی حسابش نکن
  if (!cart.ready || !form) {
    return <p className="px-6 py-16 text-center text-sm text-neutral-09">در حال بارگذاری...</p>;
  }

  if (cart.items.length === 0) {
    return (
      <div dir="rtl" className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="text-xl font-semibold text-black">سبد خرید خالی است</h1>
        <p className="mt-3 text-sm leading-7 text-neutral-09">
          برای تکمیل خرید ابتدا کالا به سبد اضافه کنید.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm text-white"
        >
          رفتن به فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <div dir="rtl" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-12 md:py-10">
      <CheckoutSteps current="info" />

      <form
        onSubmit={submit}
        className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]"
        noValidate
      >
        <div className="space-y-5">
          <section className="rounded-2xl border border-neutral-03 p-5 md:p-6">
            <h1 className="text-base font-medium text-black">اطلاعات خریدار</h1>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field id="checkout-firstName" label="نام" error={errors.firstName}>
                <input
                  value={form.firstName}
                  onChange={(event) => update("firstName", event.target.value)}
                  className={fieldClass}
                  autoComplete="given-name"
                />
              </Field>
              <Field id="checkout-lastName" label="نام خانوادگی" error={errors.lastName}>
                <input
                  value={form.lastName}
                  onChange={(event) => update("lastName", event.target.value)}
                  className={fieldClass}
                  autoComplete="family-name"
                />
              </Field>
              <Field id="checkout-phone" label="شماره تلفن" error={errors.phone}>
                <input
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  inputMode="tel"
                  dir="ltr"
                  placeholder="۰۹۱۲xxxxxxx"
                  className={`${fieldClass} text-left`}
                  autoComplete="tel"
                />
              </Field>
              <Field id="checkout-postalCode" label="کد پستی" error={errors.postalCode}>
                <input
                  value={form.postalCode}
                  onChange={(event) => update("postalCode", event.target.value)}
                  inputMode="numeric"
                  dir="ltr"
                  placeholder="۱۰ رقم"
                  className={`${fieldClass} text-left`}
                  autoComplete="postal-code"
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field id="checkout-address" label="آدرس" error={errors.address}>
                <textarea
                  value={form.address}
                  onChange={(event) => update("address", event.target.value)}
                  rows={3}
                  placeholder="استان، شهر، خیابان، پلاک و واحد"
                  className={`${fieldClass} h-auto py-3`}
                  autoComplete="street-address"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-03 p-5 md:p-6">
            <h2 className="text-base font-medium text-black">تاریخ تحویل</h2>
            <p className="mt-1 text-xs text-neutral-08">روز موردنظر را از تقویم انتخاب کنید.</p>
            <div className="mt-4">
              <Field id="checkout-deliveryDate" label="انتخاب از تقویم" error={errors.deliveryDate}>
                <JalaliDateField
                  value={form.deliveryDate}
                  min={todayISO()}
                  onChange={(value) => update("deliveryDate", value)}
                />
              </Field>
              {form.deliveryDate ? (
                <p className="mt-2 text-sm text-primary">{formatLongDate(form.deliveryDate)}</p>
              ) : null}
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-03 p-5 md:p-6">
            <Field label="توضیحات">
              <textarea
                value={form.notes}
                onChange={(event) => update("notes", event.target.value)}
                rows={3}
                placeholder="اگر توضیح خاصی برای ارسال سفارش دارید بنویسید."
                className={`${fieldClass} h-auto py-3`}
              />
            </Field>
          </section>
        </div>

        <CartSide
          items={cart.items}
          totalCount={cart.totalCount}
          totalPrice={cart.totalPrice}
        />
      </form>
    </div>
  );
}

function CartSide({
  items,
  totalCount,
  totalPrice,
}: {
  items: CartProduct[];
  totalCount: number;
  totalPrice: number;
}) {
  return (
    <aside className="rounded-2xl border border-neutral-03 p-5 lg:sticky lg:top-24">
      <h2 className="text-base font-medium text-black">سبد خرید</h2>
      <ul className="mt-4 max-h-64 space-y-3 overflow-auto">
        {items.map((item) => (
          <li key={item.lineId} className="flex items-center gap-3">
            {item.image ? (
              <img
                src={item.image}
                alt=""
                className="size-12 rounded-lg object-cover object-top"
              />
            ) : (
              <div className="size-12 rounded-lg bg-neutral-03" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-black">{item.name}</p>
              {item.color || item.size ? (
                <p className="truncate text-xs text-neutral-08">
                  {item.color ? `رنگ: ${item.color}` : ""}
                  {item.color && item.size ? "، " : ""}
                  {item.size ? `سایز: ${item.size}` : ""}
                </p>
              ) : null}
              <p className="text-xs text-neutral-08">{faDigits(item.count)} عدد</p>
            </div>
            <p className="shrink-0 text-xs text-neutral-11">
              {formatPrice(item.price * item.count)} تومان
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-5 space-y-2 border-t border-neutral-03 pt-4 text-sm">
        <Row label="تعداد" value={faDigits(totalCount) + " عدد"} />
        <Row label="مبلغ کالاها" value={formatPrice(totalPrice) + " تومان"} />
        <div className="flex items-center justify-between pt-2 text-base text-black">
          <span>مبلغ قابل پرداخت</span>
          <span>{formatPrice(totalPrice)} تومان</span>
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-primary text-sm text-white transition-colors hover:bg-primary-shade-08"
      >
        پرداخت
      </button>
    </aside>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id?: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-28">
      <label className="block">
        <span className="mb-2 block text-sm text-neutral-11">{label}</span>
        {children}
        {error ? <span className="mt-1 block text-xs text-red-500">{error}</span> : null}
      </label>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-neutral-09">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
