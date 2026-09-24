import { ArrowLeft } from "lucide-react";
import type { HomeLook } from "@/lib/api/home";
import Button from "@/ui/Button";
import LookImage from "@/ui/LookImage";
import SectionHeading from "@/ui/SectionHeading";
//ردیف عکس «دوخت بر اساس شکل بدن» است.
export default function BodyShape({ looks = [] }: { looks?: HomeLook[] }) {
  // ۵ عکس هم‌ارتفاع در یک ردیف. عکس وسط طبق طرح کمی بزرگ‌تر است.
  const photos = looks.slice(0, 5);

  return (
    <section dir="rtl" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading title="طراحی و دوخت بر اساس شکل بدن شما" align="center" />
          <p className="mt-5 text-sm leading-8 text-neutral-09">
            در رگال هر دوخت با اندازه‌گیری دقیق و شناخت فرم بدن شما انجام می‌شود
            تا لباس کاملاً متناسب، راحت و منحصربه‌فرد باشد. از انتخاب پارچه تا
            آخرین جزئیات، همه چیز برای شما شخصی‌سازی می‌شود.
          </p>
          <div className="mt-7 flex justify-center">
            <Button href="/about">
              مشاهده جزئیات
              <ArrowLeft className="size-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>

        {photos.length > 0 ? (
          <div className="mt-14 grid grid-cols-2 items-center gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-5">
            {photos.map((look, index) => {
              const isCenter = index === 2;

              return (
                <LookImage
                  key={look.src + look.alt}
                  src={look.src}
                  alt={look.alt}
                  className={
                    isCenter
                      ? "aspect-[3/5] w-full"
                      : "aspect-[3/4] w-full"
                  }
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
