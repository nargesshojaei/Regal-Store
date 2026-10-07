import { ArrowLeft } from "lucide-react";
import { heroChips } from "@/data/home";
import type { HomeLook } from "@/lib/api/home";
import Button from "@/ui/Button";
import LookImage from "@/ui/LookImage";
// بنر بالای خانه است: لوک‌ها، کالای ویژه و چیپ‌ها.
function EmptyFeatured() {
  return (
    <div
      className="min-h-[220px] w-full rounded-[15px] border border-neutral-03 md:min-h-full"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage:
          "linear-gradient(45deg, #ececec 25%, transparent 25%), linear-gradient(-45deg, #ececec 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ececec 75%), linear-gradient(-45deg, transparent 75%, #ececec 75%)",
        backgroundSize: "18px 18px",
        backgroundPosition: "0 0, 0 9px, 9px -9px, -9px 0",
      }}
    />
  );
}

export default function Hero({
  looks = [],
  featured,
}: {
  looks?: HomeLook[];
  featured?: HomeLook;
}) {
  // همیشه ۳ قاب هم‌اندازه زیر متن می‌گذاریم
  const slots = [looks[0], looks[1], looks[2]];

  return (
    <section dir="rtl" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 md:px-12 md:pb-12 md:pt-8">
        <div className="grid items-stretch gap-4 md:grid-cols-4 md:gap-5">
          {/* متن و ۳ عکس: در RTL سمت راست می‌آیند */}
          <div className="flex min-w-0 flex-col md:col-span-3">
            <div className="flex flex-col items-start text-right">
              <h1 className="text-[1.75rem] font-semibold leading-snug text-black sm:text-4xl md:max-w-[16ch] md:text-5xl lg:text-[63px] lg:leading-[1.4]">
                لباس‌هایی که داستان شما را روایت می‌کنند
              </h1>
              <p className="mt-2 max-w-[42ch] text-base leading-7 text-neutral-09 md:text-[17px]">
                هر لباس را با دقت و عشق طراحی کرده‌ایم تا زیبایی، اعتمادبه‌نفس و
                روایت شخصی شما را کامل کند.
              </p>

              <div className="mt-2.5 flex flex-wrap items-center justify-start gap-1.5">
                {heroChips.map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-03 bg-white px-2.5 py-1 text-[11px] text-neutral-11 md:text-xs"
                  >
                    <span
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: chip.color }}
                    />
                    {chip.label}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-start gap-2.5">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 86 28"
                  className="h-5 w-14 text-neutral-11 md:h-6 md:w-16"
                  fill="none"
                >
                  <path
                    d="M84 11c-14 1-22 10-36 8-11-2-16-11-28-10C12 10 6 16 2 14"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                  />
                </svg>
                <Button href="/shop" className="px-5 py-2.5 text-xs md:text-sm">
                  مشاهده کالکشن‌ها
                  <ArrowLeft className="size-3.5" strokeWidth={1.5} />
                </Button>
              </div>
            </div>

            {/* ۳ ستون کاملاً هم‌اندازه */}
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3 md:mt-8 md:gap-5">
              {slots.map((look, index) => (
                <LookImage
                  key={look?.src || `hero-empty-${index}`}
                  src={look?.src}
                  alt={look?.alt || "لباس رگال"}
                  className="aspect-[3/4] w-full"
                />
              ))}
            </div>
          </div>

          {/* عکس بزرگ سمت چپ؛ ارتفاعش با ستون متن یکی می‌شود */}
          {featured?.src ? (
            <LookImage
              src={featured.src}
              alt={featured.alt}
              className="min-h-[220px] w-full md:min-h-full"
            />
          ) : (
            <EmptyFeatured />
          )}
        </div>
      </div>
    </section>
  );
}
