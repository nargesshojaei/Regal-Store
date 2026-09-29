import { getHomeCatalog } from "@/lib/api/home";
import Blog from "@/sections/Blog";
import BodyShape from "@/sections/BodyShape";
import BrandFeatures from "@/sections/BrandFeatures";
import Categories from "@/sections/Categories";
import DiscountProducts from "@/sections/DiscountProducts";
import FeaturedCategories from "@/sections/FeaturedCategories";
import Hero from "@/sections/Hero";
import Testimonials from "@/sections/Testimonials";

//صفحه خانه است. کاتالوگ را از سرور می‌گیرد و بخش‌ها را پشت‌سرهم نشان می‌دهد.
//بالای نظرات، چهار کالای پیراهن کوتاه و چهار کالای شومیز را مثل ردیف تخفیف‌دار نشان می‌دهد.
export const dynamic = "force-dynamic";

export default async function Home() {
  const catalog = await getHomeCatalog();

  return (
    <>
      <Hero looks={catalog.heroLooks} featured={catalog.heroFeatured} />
      <Categories items={catalog.categories} />
      <BodyShape looks={catalog.bodyLooks} />
      <DiscountProducts products={catalog.discountProducts} />
      <BrandFeatures look={catalog.brandLook} />
      <FeaturedCategories groups={catalog.featuredGroups} />
      <Testimonials avatars={catalog.testimonialAvatars} />
      <Blog images={catalog.blogImages} />
    </>
  );
}
