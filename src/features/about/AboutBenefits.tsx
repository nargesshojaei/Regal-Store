import { BadgeCheck, CreditCard, Package } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { aboutBenefits } from "@/data/about";
//بخش «بهترین امکانات» در صفحه درباره ما است.
// هر id در data/about.ts به یک آیکون وصل شده است
const benefitIcons = {
  original: BadgeCheck,
  shipping: Package,
  payment: CreditCard,
};

export default function AboutBenefits() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 sm:grid-cols-3 md:px-12">
        {aboutBenefits.map((benefit) => {
          const Icon = benefitIcons[benefit.id];

          return (
            <Card
              key={benefit.id}
              className="items-center gap-4 bg-transparent py-2 text-center shadow-none ring-0"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-neutral-01 text-neutral-11">
                <Icon className="size-6" strokeWidth={1.5} />
              </span>
              <CardTitle className="text-base font-semibold text-black">{benefit.title}</CardTitle>
              <CardDescription className="max-w-xs text-sm leading-7">
                {benefit.text}
              </CardDescription>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
