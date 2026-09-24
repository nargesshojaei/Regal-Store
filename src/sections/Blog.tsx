import { blogPosts } from "@/data/Blog";
import BlogCard from "@/features/blog/BlogCard";
import SectionHeading from "@/ui/SectionHeading";
//سه کارت مقاله پایین صفحه خانه را می‌چیند.
export default function Blog({ images = [] }: { images?: string[] }) {
  const posts = blogPosts.map((post, index) => ({
    ...post,
    image: images[index] || post.image,
  }));

  return (
    <section dir="rtl" className="bg-white py-16 md:pb-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeading title="مقالات و استایل زنانه" />
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
