import Link from "next/link";
import type { Category } from "@/types";
import LookImage from "@/ui/LookImage";
//کارت یک دسته است: عکس، نام و لینک به فروشگاه
export default function CategoryCard({
  category,
  className = "",
}: {
  category: Category;
  className?: string;
}) {
  return (
    <Link href={category.href} className={`block h-full ${className}`}>
      <LookImage
        src={category.image}
        alt={category.name}
        className="h-full min-h-[180px] w-full"
      >
        <span className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/50" />
        <span className="absolute inset-x-0 bottom-3 z-10 flex justify-center px-2">
          <span className="w-fit max-w-[8rem] rounded-full bg-white/90 px-2.5 py-1 text-center shadow-sm backdrop-blur-[2px]">
            <span className="block truncate text-[11px] font-medium leading-4 text-black">
              {category.name}
            </span>
            {category.subtitle ? (
              <span className="block truncate text-[9px] leading-3 text-neutral-08">
                {category.subtitle}
              </span>
            ) : null}
          </span>
        </span>
      </LookImage>
    </Link>
  );
}
