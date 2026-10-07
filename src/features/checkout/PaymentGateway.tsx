"use client";




// فقط ظاهر درگاه است.
// فیلدها جایی ذخیره یا ارسال نمی‌شوند.
// دکمه پرداخت صفحه موفق را باز می‌کند و دکمه انصراف صفحه ناموفق را.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, CreditCard, Grid3x3 } from "lucide-react";
import { cartTotal, readCart } from "@/lib/cart";
import { commitSuccessfulPayment, readDraft, readReceipt } from "@/lib/checkout";
import { faDigits, formatPrice } from "@/lib/format";

const inputClass =
  "h-11 w-full rounded-lg border border-[#e6e6ea] bg-white px-3 text-sm text-black outline-none focus:border-[#e11d74]";

const START_SECONDS = 10 * 60;

function onlyDigits(value: string) {
  let digits = "";
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (char >= "0" && char <= "9") digits = digits + char;
  }
  return digits;
}

// 6037991234567890 می‌شود 6037-9912-3456-7890
function groupCard(value: string) {
  const digits = onlyDigits(value).slice(0, 16);
  let grouped = "";

  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && i % 4 === 0) grouped = grouped + "-";
    grouped = grouped + digits[i];
  }

  return grouped;
}

function clockText(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const text = String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  return faDigits(text);
}

export default function PaymentGateway() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState<"none" | "missing" | "empty">("none");
  const [amount, setAmount] = useState(0);
  const [left, setLeft] = useState(START_SECONDS);
  const [card, setCard] = useState("");
  const [cvv, setCvv] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const draft = readDraft();
    const items = readCart();

    if (!draft) setBlocked("missing");
    else if (items.length === 0) setBlocked("empty");
    else setAmount(cartTotal(items));

    setReady(true);
  }, []);

  // هر ثانیه یکی از زمان باقی‌مانده کم می‌شود
  useEffect(() => {
    const timer = window.setInterval(() => {
      setLeft((value) => {
        if (value <= 0) return 0;
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  // اگر ۱۰ دقیقه تمام شود و هنوز پرداخت نشده باشد، صفحه ناموفق
  useEffect(() => {
    const pageIsOpen = ready && blocked === "none";
    if (!pageIsOpen) return;
    if (left > 0) return;
    router.push("/checkout/result?status=failed");
  }, [blocked, left, ready, router]);

  function pay() {
    const receipt = commitSuccessfulPayment();
    if (receipt || readReceipt()) {
      router.push("/checkout/result?status=success");
      return;
    }
    router.push("/checkout/result?status=failed");
  }

  function cancel() {
    router.push("/checkout/result?status=failed");
  }

  if (!ready) {
    return (
      <p className="flex min-h-screen items-center justify-center text-sm text-neutral-09">
        در حال بارگذاری...
      </p>
    );
  }

  if (blocked === "missing") {
    return (
      <Blocked
        message="ابتدا اطلاعات خریدار را کامل کنید."
        linkHref="/checkout"
        linkText="تکمیل اطلاعات"
      />
    );
  }

  if (blocked === "empty") {
    const alreadyPaid = readReceipt() !== null;
    if (alreadyPaid) {
      return (
        <Blocked
          message="این پرداخت قبلاً انجام شده است."
          linkHref="/account/orders"
          linkText="پیگیری سفارش"
        />
      );
    }

    return (
      <Blocked message="سبد خرید خالی است." linkHref="/cart" linkText="سبد خرید" />
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#eef0f4] px-4 py-8 md:py-12">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-[#ececf1] bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 bg-[#f03486] px-4 py-4 text-white sm:px-5 md:px-8">
          <p className="min-w-0 text-sm font-medium md:text-base">درگاه اینترنتی «پرداخت رگال»</p>
          <span className="text-sm tracking-wide">regal</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 py-4 text-sm text-[#7c3aed]">
          <span className="inline-flex items-center gap-2">
            <Clock className="size-4" strokeWidth={1.75} />
            مدت زمان باقی‌مانده: {clockText(left)}
          </span>
          <span className="text-neutral-11">مبلغ: {formatPrice(amount)} تومان</span>
        </div>

        <form
          className="px-5 pb-8 md:px-8"
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault();
            pay();
          }}
        >
          <h1 className="text-lg font-medium text-[#f03486]">اطلاعات کارت</h1>

          <div className="mt-6 space-y-5">
            <GatewayRow label="شماره کارت:" hint="شماره ۱۶ رقمی روی کارت">
              <div className="relative">
                <input
                  value={card}
                  onChange={(event) => setCard(groupCard(event.target.value))}
                  inputMode="numeric"
                  dir="ltr"
                  placeholder="____-____-____-____"
                  className={`${inputClass} pl-11 text-left tracking-wider`}
                  autoComplete="off"
                />
                <CreditCard className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-neutral-08" />
              </div>
            </GatewayRow>

            <GatewayRow label="شماره شناسایی دوم (CVV2):" hint="سه یا چهار رقم">
              <input
                value={cvv}
                onChange={(event) => setCvv(onlyDigits(event.target.value).slice(0, 4))}
                inputMode="numeric"
                dir="ltr"
                className={`${inputClass} max-w-40 text-left`}
                autoComplete="off"
              />
            </GatewayRow>

            <GatewayRow label="تاریخ انقضای کارت:" hint="ماه و سال">
              <div className="flex max-w-56 items-center gap-2" dir="ltr">
                <input
                  value={month}
                  onChange={(event) => setMonth(onlyDigits(event.target.value).slice(0, 2))}
                  inputMode="numeric"
                  placeholder="ماه"
                  className={`${inputClass} text-center`}
                  autoComplete="off"
                />
                <span className="text-neutral-08">/</span>
                <input
                  value={year}
                  onChange={(event) => setYear(onlyDigits(event.target.value).slice(0, 2))}
                  inputMode="numeric"
                  placeholder="سال"
                  className={`${inputClass} text-center`}
                  autoComplete="off"
                />
              </div>
            </GatewayRow>

            <GatewayRow label="رمز دوم (رمز اینترنتی):" hint="رمز پویا یا رمز اینترنتی کارت">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  dir="ltr"
                  className={`${inputClass} max-w-56 text-left`}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPassword("123456");
                    setOtpSent(true);
                  }}
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#e6e6ea] px-3 text-xs text-[#7c3aed]"
                >
                  <Grid3x3 className="size-4" />
                  درخواست رمز پویا
                </button>
              </div>
              {otpSent ? (
                <p className="mt-2 text-xs text-neutral-08">رمز در کادر قرار گرفت.</p>
              ) : null}
            </GatewayRow>

            <GatewayRow label="ایمیل (اختیاری):" hint="اختیاری">
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                dir="ltr"
                className={`${inputClass} text-left`}
                autoComplete="off"
              />
            </GatewayRow>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={cancel}
              className="h-12 rounded-xl bg-[#f5b400] text-sm font-medium text-white transition-colors hover:bg-[#e0a400]"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="h-12 rounded-xl bg-[#22c55e] text-sm font-medium text-white transition-colors hover:bg-[#16a34a]"
            >
              پرداخت
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Blocked({
  message,
  linkHref,
  linkText,
}: {
  message: string;
  linkHref: string;
  linkText: string;
}) {
  return (
    <div
      dir="rtl"
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f4f5f7] px-6 text-center"
    >
      <p className="text-sm text-neutral-11">{message}</p>
      <div className="flex gap-3">
        <Link href={linkHref} className="text-sm text-primary">
          {linkText}
        </Link>
        {linkHref === "/cart" ? null : (
          <Link href="/cart" className="text-sm text-neutral-09">
            سبد خرید
          </Link>
        )}
      </div>
    </div>
  );
}

// برچسب سمت راست است و کادر ورودی سمت چپ
function GatewayRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid items-start gap-2 md:grid-cols-[220px_minmax(0,1fr)] md:gap-4">
      <div>
        <p className="text-sm text-neutral-12">{label}</p>
        <p className="mt-1 text-[11px] leading-5 text-neutral-08">{hint}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}
