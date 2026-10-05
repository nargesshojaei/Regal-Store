import Link from "next/link";
import type { BlogPost } from "@/types";
import LookImage from "@/ui/LookImage";
//کارت مقاله است: عکس، عنوان، خلاصه، تاریخ و نویسنده.
export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group h-full">
      <Link href={post.href} className="block">
        <LookImage
          src={post.image}
          alt={post.title}
          className="aspect-[4/3] w-full"
        />
      </Link>
      <h3 className="mt-4 text-base font-semibold text-black group-hover:text-primary">
        <Link href={post.href}>{post.title}</Link>
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-7 text-neutral-09">{post.excerpt}</p>
      <div className="mt-3 flex items-center gap-3 text-xs text-neutral-08">
        <span>{post.date}</span>
        {post.author ? (
          <>
            <span className="size-1 rounded-full bg-neutral-08" />
            <span>{post.author}</span>
          </>
        ) : null}
      </div>
    </article>
  );
}
