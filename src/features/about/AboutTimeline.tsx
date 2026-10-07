import { Card } from "@/components/ui/card";
import { aboutJourney, aboutSteps } from "@/data/about";
//خط زمانی در صفحه درباره ما است.
export default function AboutTimeline() {
  return (
    <section className="bg-neutral-01 py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-black md:text-4xl">{aboutJourney.title}</h2>
          <p className="mt-5 text-sm leading-8 text-neutral-09">{aboutJourney.text}</p>
        </div>

        <div className="relative mt-16">
          {/* خط عمودی وسط تایم‌لاین؛ فقط در دسکتاپ دیده می‌شود */}
          <div className="absolute top-6 bottom-6 left-1/2 hidden w-px -translate-x-1/2 bg-neutral-08/30 md:block" />

          <div className="flex flex-col gap-6 md:gap-10">
            {aboutSteps.map((step, index) => (
              <TimelineRow key={step.year} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type TimelineStep = {
  year: string;
  title: string;
  text: string;
};

function TimelineRow({ step, index }: { step: TimelineStep; index: number }) {
  // شماره زوج سمت چپ خط، شماره فرد سمت راست خط
  const cardOnLeft = index % 2 === 0;
  const isFirstYear = index === 0;

  return (
    <div className="relative md:grid md:grid-cols-2 md:gap-x-36">
      <div className={cardOnLeft ? "md:col-start-2" : ""}>
        <Card className="gap-2 rounded-2xl bg-white py-5 shadow-none ring-neutral-03">
          <p className="px-4 text-sm font-medium text-primary md:hidden">{step.year}</p>
          <h3 className="px-4 text-base font-semibold text-black">{step.title}</h3>
          <p className="px-4 text-sm leading-7 text-neutral-09">{step.text}</p>
        </Card>
      </div>

      <div className="absolute top-1/2 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        {isFirstYear ? (
          <div className="flex size-20 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
            {step.year}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 bg-neutral-01 px-2">
            <span className="text-sm text-neutral-08">{step.year}</span>
            <span className="size-3 rounded-full border-2 border-neutral-08/70 bg-neutral-01" />
          </div>
        )}
      </div>
    </div>
  );
}
