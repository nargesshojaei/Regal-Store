import { Star } from "lucide-react";
//پنج ستاره امتیاز نظر
export default function StarRating({ value = 0 }: { value?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} از ۵`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`size-3.5 ${
            index < value ? "fill-primary text-primary" : "text-neutral-03"
          }`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}
