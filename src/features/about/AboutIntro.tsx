import Link from "next/link";
import { Check, ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { aboutPoints, aboutStory } from "@/data/about";

// عکس اول بزرگ و سمت چپ است. عکس دوم بالا و عکس سوم پایین، سمت راست.
const aboutPhotos = [
  {
    src: "https://mediahub.boohoo.com/bgg27475_dark%20red_xl?qlt=70&w=549&ssz=true&dpr=1",
    alt: "لباس قرمز تیره",
  },
  {
    src: "https://mediahub.boohoo.com/hzz59936_white_xl?qlt=70&w=549&ssz=true&dpr=1",
    alt: "لباس سفید",
  },
  {
    src: "https://mediahub.boohoo.com/hzz55447_pastel%20blue_xl?qlt=70&w=549&ssz=true&dpr=1",
    alt: "لباس آبی روشن",
  },
];

export default function AboutIntro() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-12">
        <nav aria-label="مسیر صفحه" className="mb-10 flex items-center gap-1.5 text-sm text-neutral-08">
          <Link href="/" className="transition-colors hover:text-primary">
            صفحه اصلی
          </Link>
          <ChevronLeft className="size-4" />
          <span className="text-neutral-11">درباره ما</span>
        </nav>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="text-3xl font-bold text-black md:text-4xl">{aboutStory.title}</h1>
            <p className="mt-5 text-justify text-sm leading-8 text-neutral-09">{aboutStory.text}</p>

            <ul className="mt-4">
              {aboutPoints.map((point, index) => (
                <li key={point}>
                  <div className="flex items-start gap-3 py-4">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-neutral-08 text-neutral-11">
                      <Check className="size-3" strokeWidth={2.5} />
                    </span>
                    <p className="text-sm leading-7 text-neutral-11">{point}</p>
                  </div>
                  {index < aboutPoints.length - 1 ? <Separator /> : null}
                </li>
              ))}
            </ul>
          </div>

          {/* dir=ltr تا عکس بزرگ همیشه سمت چپ بماند، مثل طرح */}
          <div dir="ltr" className="grid h-72 grid-cols-[1.15fr_0.85fr] gap-3 sm:h-[440px]">
            <img
              src={aboutPhotos[0].src}
              alt={aboutPhotos[0].alt}
              className="size-full rounded-2xl object-cover object-top"
            />
            <div className="grid grid-rows-2 gap-3">
              <img
                src={aboutPhotos[1].src}
                alt={aboutPhotos[1].alt}
                className="size-full rounded-2xl object-cover object-top"
              />
              <img
                src={aboutPhotos[2].src}
                alt={aboutPhotos[2].alt}
                className="size-full rounded-2xl object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
