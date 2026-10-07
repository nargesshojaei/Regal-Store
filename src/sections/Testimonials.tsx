import { testimonials } from "@/data/Testimonials";
import TestimonialCard from "@/features/testimonial/TestimonialCard";
import SectionHeading from "@/ui/SectionHeading";
//سه نظر مشتری را در یک ردیف میچیند
export default function Testimonials({ avatars = [] }: { avatars?: string[] }) {
  const items = testimonials.map((item, index) => ({
    ...item,
    avatar: avatars[index] || item.avatar,
  }));

  return (
    <section dir="rtl" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-12">
        <SectionHeading title="رضایت مشتریان از ارزشمندترین دارایی ماست" />
        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {items.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
