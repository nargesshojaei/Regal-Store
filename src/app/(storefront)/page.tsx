import Blog from "@/sections/Blog";
import BodyShape from "@/sections/BodyShape";
import BrandFeatures from "@/sections/BrandFeatures";
import Categories from "@/sections/Categories";
import DiscountProducts from "@/sections/DiscountProducts";
import Hero from "@/sections/Hero";
import Testimonials from "@/sections/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <DiscountProducts />
      <BodyShape />
      <BrandFeatures />
      <Testimonials />
      <Blog />
    </>
  );
}
       