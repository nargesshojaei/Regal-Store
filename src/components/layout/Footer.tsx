"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Send,
  MessageCircle,
  Copyright,
  ArrowUp,
} from "lucide-react";

const linkColumns = [
  {
    title: "لینک‌های کمکی",
    links: ["قوانین و مقررات", "حریم خصوصی", "سوالات متداول"],
  },
  {
    title: "دسته محصولات",
    links: ["پیراهن کوتاه", "شومیز و دامن", "شلوار", "سرهمی", "کت و ترنچ کت"],
  },
  {
    title: "ارتباط با ما",
    links: ["تماس با ما", "درباره ما", "چت آنلاین با طراح", "همکاری با ما"],
  },
];

const contactItems = [
  { text: "۰۲۱ - ۱۳۳۴ ۵۴۷۹ | ۰۲۱ - ۱۳۳۴ ۵۶۷۸", icon: Phone },
  { text: "Info@regal.com", icon: Mail },
  { text: "تهران، خیابان ولیعصر نرسیده به میدان ونک", icon: MapPin },
  { text: "شنبه تا چهارشنبه ۹ صبح الی ۱۸", icon: Clock },
];

const socialLinks = [
  { icon: Instagram, label: "اینستاگرام" },
  { icon: MessageCircle, label: "واتساپ" },
  { icon: Send, label: "تلگرام" },
];

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <span className="size-1.5 rounded-full bg-neutral-08" />
    </div>
  );
}

export default function Footer() {
  return (
    <footer dir="rtl" className="relative bg-black text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-16 md:px-12 lg:flex-row lg:items-start lg:gap-10">
        {/* Brand + newsletter — right side in RTL */}
        <div className="flex w-full max-w-[400px] shrink-0 flex-col items-start gap-6">
          <span className="text-[28px] font-semibold tracking-tight">règal</span>
          <p className="text-sm leading-7 text-white/90">
            به فروشگاه رگال خوش آمدید، جایی که استایل و شیک بودن به شما هدیه داده
            می‌شود. با خبرنامه رگال همراه باشید و اولین نفر باشید که اخبار،
            پیشنهادات و توصیه‌های دنیای مد و فشن را می‌شنوید.
          </p>
          <form
            className="flex w-full items-center gap-3"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="email"
              placeholder="ایمیل خود را وارد کنید..."
              className="h-12 flex-1 rounded-lg border border-neutral-08 bg-transparent px-5 text-sm text-neutral-03 placeholder:text-neutral-08 focus:outline-none"
            />
            <button
              type="submit"
              className="h-12 shrink-0 rounded-[10px] border border-neutral-08 px-6 text-sm text-neutral-03 transition-colors hover:bg-neutral-13"
            >
              عضویت
            </button>
          </form>
        </div>

        {/* Vertical rule + back-to-top */}
        <div className="relative hidden min-h-[220px] w-px shrink-0 self-stretch bg-neutral-12 lg:block">
          <button
            type="button"
            aria-label="بازگشت به بالا"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="absolute left-1/2 top-0 flex size-[70px] -translate-x-1/2 -translate-y-[calc(50%+4rem)] items-center justify-center rounded-full bg-neutral-13 text-white"
          >
            <ArrowUp className="size-6" strokeWidth={1.5} />
          </button>
        </div>

        {/* Link columns — لینک‌های کمکی → دسته محصولات → ارتباط با ما → اطلاعات تماس */}
        <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4">
          {linkColumns.map((col) => (
            <div key={col.title} className="flex flex-col items-start gap-5">
              <SectionHeading title={col.title} />
              <ul className="flex flex-col gap-1">
                {col.links.map((label) => (
                  <li key={label}>
                    <Link
                      href="#"
                      className="block py-1.5 text-sm text-neutral-03 transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 flex flex-col items-start gap-5 sm:col-span-1">
            <SectionHeading title="اطلاعات تماس" />
            <ul className="flex w-full flex-col gap-1 text-sm text-neutral-03">
              {contactItems.map(({ text, icon: Icon }) => (
                <li key={text} className="flex items-start gap-2 py-2">
                  <Icon className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-12">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-4 px-6 py-5 md:flex-row md:px-12">
          <div className="flex items-center gap-2 text-sm text-neutral-09">
            <span>تمامی حقوق مادی و معنوی برای مجموعه رگال محفوظ است.</span>
            <Copyright className="size-4" strokeWidth={1.5} />
          </div>
          <div className="flex items-center gap-2">
            {socialLinks.map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                className="flex items-center justify-center rounded-lg border border-neutral-08 p-3 transition-colors hover:bg-neutral-13"
              >
                <Icon className="size-4" strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
