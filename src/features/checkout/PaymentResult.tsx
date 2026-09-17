import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

type PaymentResultProps = {
  status: "success" | "failed";
};

const copy = {
  success: {
    title: "پرداخت موفق",
    description:
      "سفارش شما ثبت شد. جزئیات را از حساب کاربری یا ایمیل پیگیری کنید.",
    Icon: CheckCircle2,
    iconClass: "text-primary",
    primaryHref: "/shop",
    primaryLabel: "ادامه خرید",
    secondaryHref: "/account",
    secondaryLabel: "مشاهده سفارش‌ها",
  },
  failed: {
    title: "پرداخت ناموفق",
    description:
      "پرداخت انجام نشد. مبلغی کسر نشده است؛ دوباره امتحان کنید یا به سبد برگردید.",
    Icon: XCircle,
    iconClass: "text-neutral-11",
    primaryHref: "/checkout",
    primaryLabel: "تلاش دوباره",
    secondaryHref: "/cart",
    secondaryLabel: "بازگشت به سبد",
  },
} as const;

export default function PaymentResult({ status }: PaymentResultProps) {
  const content = copy[status];
  const { Icon } = content;

  return (
    <section
      dir="rtl"
      className="flex min-h-[70vh] items-center justify-center px-6 py-16"
    >
      <div className="w-full max-w-md rounded-2xl border border-neutral-03 bg-neutral-01 px-8 py-12 text-center">
        <Icon
          className={`mx-auto size-16 ${content.iconClass}`}
          strokeWidth={1.25}
          aria-hidden
        />
        <h1 className="mt-6 text-2xl font-semibold text-black">
          {content.title}
        </h1>
        <p className="mt-3 text-sm leading-7 text-neutral-09">
          {content.description}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={content.primaryHref}
            className="rounded-lg bg-primary px-5 py-3 text-sm text-white transition-colors hover:bg-primary-shade-08"
          >
            {content.primaryLabel}
          </Link>
          <Link
            href={content.secondaryHref}
            className="rounded-lg border border-neutral-03 bg-white px-5 py-3 text-sm text-neutral-11 transition-colors hover:bg-neutral-03"
          >
            {content.secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
