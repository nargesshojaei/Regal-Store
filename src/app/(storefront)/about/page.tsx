import type { Metadata } from "next";
import AboutBenefits from "@/features/about/AboutBenefits";
import AboutFaq from "@/features/about/AboutFaq";
import AboutIntro from "@/features/about/AboutIntro";
import AboutTimeline from "@/features/about/AboutTimeline";
//صفحه درباره ما را از چهار بخش زیر می‌سازد
export const metadata: Metadata = {
  title: "درباره ما | رگال",
  description: "داستان رگال، مسیر برند و پاسخ سوالات متداول خرید لباس سفارشی.",
};

export default function AboutPage() {
  return (
    <>
      <AboutIntro />
      <AboutBenefits />
      <AboutTimeline />
      <AboutFaq />
    </>
  );
}
