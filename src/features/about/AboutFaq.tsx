"use client";
//آکاردئون سوالات را نشان می‌دهد؛ سوال زمان تحویل از اول
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { aboutFaq, aboutQuestions } from "@/data/about";

export default function AboutFaq() {
  return (
    <section className="bg-neutral-01 pb-20 md:pb-28">
      <div className="mx-auto grid max-w-7xl items-start gap-10 px-6 md:px-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="max-w-md text-3xl font-bold leading-snug text-black md:text-4xl">
            {aboutFaq.title}
          </h2>
          <p className="mt-4 text-sm text-neutral-09">{aboutFaq.label}</p>
          <p className="mt-4 max-w-md text-sm leading-8 text-neutral-09">{aboutFaq.text}</p>
        </div>

        {/* سوال دوم در طرح باز است؛ defaultValue همان id را باز نگه می‌دارد */}
        <Accordion type="single" collapsible defaultValue="delivery-time" className="gap-3">
          {aboutQuestions.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="rounded-2xl border border-neutral-03 bg-white px-5 shadow-none not-last:border-b"
            >
              <AccordionTrigger className="py-5 text-sm font-medium text-black hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-7 text-neutral-09">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
