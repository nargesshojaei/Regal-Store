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
    title: "ارتباط با ما",
    links: ["تماس با ما", "درباره ما", "چت آنلاین با طراح", "همکاری با ما"],
  },
  {
    title: "دسته محصولات",
    links: ["پیراهن کوتاه", "شومیز و دامن", "شلوار", "سرهمی", "کت و ترنچ کت"],
  },
  {
    title: "لینک‌های کمکی",
    links: ["قوانین و مقررات", "حریم خصوصی", "سوالات متداول"],
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
      <h3 className="text-lg font-semibold">{title}</h3>
      <span className="size-1.5 rounded-full bg-neutral-08" />
    </div>
  );
}

export default function Footer() {
  return (
    <footer dir="rtl" className="relative bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:px-12 lg:grid-cols-[433px_1fr]">
        {/* Newsletter / brand */}
        <div className="flex flex-col items-end gap-6 lg:order-2">
          <span className="text-2xl font-semibold">رگال</span>
          <p className="text-right text-sm leading-6 text-white">
            به فروشگاه رگال خوش آمدید، جایی که استایل و شیک بودن به شما هدیه داده
            می‌شود. با خبرنامه رگال همراه باشید و اولین نفر باشید که اخبار،
            پیشنهادات و توصیه‌های دنیای مد و فشن را می‌شنوید.
          </p>
          <form className="flex w-full items-center gap-3.5">
            <input
              type="email"
              placeholder="ایمیل خود را وارد کنید..."
              className="h-12 flex-1 rounded-lg border border-neutral-08 bg-transparent px-6 py-3 text-right text-sm text-neutral-03 placeholder:text-neutral-03 focus:outline-none"
            />
            <button
              type="submit"
              className="h-12 shrink-0 rounded-[10px] border border-neutral-08 px-6 text-base text-neutral-03 transition-colors hover:bg-neutral-13"
            >
              عضویت
            </button>
          </form>
        </div>

        {/* Contact info + link columns, in this exact right-to-left order */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:order-1">
          {/* Contact info (rightmost) */}
          <div className="col-span-2 flex flex-col items-end gap-6 sm:col-span-1">
            <SectionHeading title="اطلاعات تماس" />
            <ul className="flex w-full flex-col items-end gap-1 text-sm">
              {contactItems.map(({ text, icon: Icon }) => (
                <li
                  key={text}
                  className="flex w-full items-center justify-end gap-2 py-2 text-right"
                >
                  <span>{text}</span>
                  <Icon className="size-4 shrink-0" strokeWidth={1.5} />
                </li>
              ))}
            </ul>
          </div>

          {linkColumns.map((col) => (
            <div key={col.title} className="flex flex-col items-end gap-6">
              <SectionHeading title={col.title} />
              <ul className="flex flex-col items-end gap-1">
                {col.links.map((label) => (
                  <li key={label}>
                    <Link
                      href="#"
                      className="flex h-10 items-center rounded-lg px-4 py-2 text-sm text-neutral-03 transition-colors hover:text-primary-tint-09"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar — copyright on the right, socials on the left */}
      <div className="border-t border-neutral-12 bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-12">
          <div className="flex items-center gap-2 text-sm text-neutral-09">
            <span>تمامی حقوق مادی و معنوی برای مجموعه رگال محفوظ است.</span>
            <Copyright className="size-4" strokeWidth={1.5} />
          </div>
          <div className="flex items-center gap-2">
            {socialLinks.map(({ icon: Icon, label }) => (
              <button
                key={label}
                aria-label={label}
                className="flex items-center justify-center rounded-lg border border-neutral-08 p-3 transition-colors hover:bg-neutral-13"
              >
                <Icon className="size-4" strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Back-to-top */}
      <button
        aria-label="بازگشت به بالا"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="absolute -top-9 right-[513px] hidden size-[70px] items-center justify-center rounded-full bg-neutral-13 lg:flex"
      >
        <ArrowUp className="size-6" strokeWidth={1.5} />
      </button>
    </footer>
  );
}
