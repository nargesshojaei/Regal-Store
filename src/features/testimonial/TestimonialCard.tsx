import type { Testimonial } from "@/types";
import StarRating from "@/ui/StarRating";
//کارت نظر صفحه خانه را نشان می‌دهد: آواتار، نام، امتیاز و متن.
export default function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="flex h-full flex-col items-start">
      <div className="flex w-full items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {item.avatar ? (
            <img
              src={item.avatar}
              alt={item.name}
              className="size-10 rounded-full border border-neutral-03 object-cover opacity-80 transition duration-300 hover:opacity-100"
            />
          ) : (
            <span className="flex size-10 items-center justify-center rounded-full border border-neutral-03 bg-neutral-03 text-sm text-neutral-09">
              {item.name.charAt(0)}
            </span>
          )}
          <div>
            <p className="text-sm font-medium text-black">{item.name}</p>
            <p className="text-xs text-neutral-08">{item.role}</p>
          </div>
        </div>
        <span className="text-5xl leading-none text-neutral-03">”</span>
      </div>
      <p className="mt-5 text-sm leading-8 text-neutral-11">{item.quote}</p>
      <div className="mt-4">
        <StarRating value={item.rating} />
      </div>
    </article>
  );
}
