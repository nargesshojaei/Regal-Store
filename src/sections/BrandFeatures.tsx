import { Sparkles, Scissors } from "lucide-react";
import { brandHighlights } from "@/data/home";
import type { HomeLook } from "@/lib/api/home";
import LookImage from "@/ui/LookImage";
import SectionHeading from "@/ui/SectionHeading";

const icons = [Sparkles, Scissors];
  
//معرفی برند را کنار یک عکس و دو نکته می‌گذارد.
export default function BrandFeatures({ look }: { look?: HomeLook }) {
  return (
    <section dir="rtl" className="bg-white py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2 md:px-12 md:gap-16">
        <div>
          <SectionHeading title="کشف پوششی با رگال" />
          <p className="mt-5 max-w-md text-sm leading-8 text-neutral-09">
            رگال جایی است که طراحی خاص و دوخت دقیق در کنار هم قرار می‌گیرند تا
            پوششی بسازند که فقط مال شما باشد؛ آرام، شیک و ماندگار.
          </p>

          <div className="mt-8 flex flex-col gap-6">
            {brandHighlights.map((item, index) => {
              const Icon = icons[index] ?? Sparkles;
              return (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-tint-02 text-primary">
                    <Icon className="size-4" strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-black">{item.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-neutral-09">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <LookImage
          src={look?.src}
          alt={look?.alt || "رگال"}
          className="aspect-[4/3] w-full"
        />
      </div>
    </section>
  );
}
