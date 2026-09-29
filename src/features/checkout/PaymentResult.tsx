"use client";

// صفحه آخر خرید.
// موفق: کد رهگیری را نشان می‌دهد. سفارش قبلاً ذخیره شده و سبد خالی است.
// ناموفق: سبد دست نخورده می‌ماند و کاربر می‌تواند دوباره پرداخت کند.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { readDraft, readReceipt } from "@/lib/checkout";
import { faDigits } from "@/lib/format";

type PaymentResultProps = {
  status: "success" | "failed";
};

const buttonClass =
  "inline-flex h-12 min-w-44 items-center justify-center rounded-lg px-5 text-sm";

export default function PaymentResult({ status }: PaymentResultProps) {
  const router = useRouter();
  const [tracking, setTracking] = useState("");
  const [ready, setReady] = useState(false);
  const success = status === "success";

  useEffect(() => {
    if (success) {
      const receipt = readReceipt();
      // اگر کسی مستقیم این آدرس را باز کند و پرداختی نبوده، برگردد سبد
      if (!receipt) {
        router.replace("/cart");
        return;
      }
      setTracking(receipt.trackingCode);
      setReady(true);
      return;
    }

    const draft = readDraft();
    if (draft) setTracking(draft.trackingCode);
    setReady(true);
  }, [router, success]);

  if (!ready) {
    return <p className="px-6 py-24 text-center text-sm text-neutral-09">در حال بارگذاری...</p>;
  }

  let title = "پرداخت شما ناموفق بود!";
  let description =
    "سفارش ثبت نشده است. سبد خرید باقی مانده و می‌توانید دوباره پرداخت کنید.";
  let firstHref = "/checkout/pay";
  let firstLabel = "پرداخت مجدد";
  let secondHref = "/cart";
  let secondLabel = "بازگشت به سبد خرید";

  if (success) {
    title = "پرداخت شما با موفقیت انجام شد!";
    description =
      "سفارش شما ثبت شد و سبد خرید خالی شد. جزئیات را از بخش سفارش‌های حساب کاربری ببینید.";
    firstHref = "/account/orders";
    firstLabel = "پیگیری سفارش";
    secondHref = "/";
    secondLabel = "بازگشت به صفحه اصلی";
  }

  return (
    <section
      dir="rtl"
      className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center"
    >
      <span
        className={`flex size-20 items-center justify-center rounded-full text-white ${
          success ? "bg-[#22c55e]" : "bg-[#f43f5e]"
        }`}
      >
        {success ? (
          <Check className="size-10" strokeWidth={2.5} />
        ) : (
          <X className="size-10" strokeWidth={2.5} />
        )}
      </span>

      <h1 className="mt-8 text-2xl font-semibold text-black">{title}</h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-neutral-09">{description}</p>

      {tracking ? (
        <p className="mt-6 text-sm text-neutral-11">
          کد رهگیری سفارش:{" "}
          <span className="font-medium text-black">{faDigits(tracking)}</span>
        </p>
      ) : null}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href={firstHref} className={`${buttonClass} border border-neutral-03 bg-white text-neutral-12`}>
          {firstLabel}
        </Link>
        <Link href={secondHref} className={`${buttonClass} bg-primary text-white`}>
          {secondLabel}
        </Link>
      </div>
    </section>
  );
}
